package org.cdut.ai.service;

import org.cdut.ai.client.BailianClient;
import org.cdut.ai.config.AliBailianProperties;
import org.cdut.ai.dto.ChatMessage;
import org.cdut.ai.dto.ChatRequest;
import org.cdut.ai.model.ChatSession;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class EnhancedAiAssistantService {

    private final BailianClient bailianClient;
    private final AliBailianProperties properties;
    private final TextKnowledgeBaseService textKnowledgeBaseService;
    private final ChatContextService chatContextService;

    public EnhancedAiAssistantService(BailianClient bailianClient,
                                      AliBailianProperties properties,
                                      TextKnowledgeBaseService textKnowledgeBaseService,
                                      ChatContextService chatContextService) {
        this.bailianClient = bailianClient;
        this.properties = properties;
        this.textKnowledgeBaseService = textKnowledgeBaseService;
        this.chatContextService = chatContextService;
    }

    /**
     * 增强的流式聊天，支持上下文记忆
     */
    public Flux<String> streamChatWithContext(ChatRequest request) {
        // 1. 获取或创建会话
        String sessionId = request.getSessionId();
        if (!StringUtils.hasText(sessionId)) {
            // 创建新会话
            ChatSession session = chatContextService.createSession(
                request.getUserId(),
                truncateTitle(request.getQuestion())
            );
            sessionId = session.getSessionId();
        }

        final String finalSessionId = sessionId;

        // 2. 从数据库加载历史消息作为上下文
        List<org.cdut.ai.model.ChatMessage> dbMessages = chatContextService.getSessionMessages(finalSessionId, 10);
        
        // 3. 构建消息列表
        List<ChatMessage> messages = new ArrayList<>();
        
        // 3.1 添加系统提示词（含知识库）
        String knowledgeContext = textKnowledgeBaseService.buildKnowledgeContext(request.getQuestion(), 5);
        String systemPrompt = buildSystemPrompt(knowledgeContext);
        messages.add(new ChatMessage("system", systemPrompt));
        
        // 3.2 添加历史消息
        for (org.cdut.ai.model.ChatMessage dbMsg : dbMessages) {
            if (dbMsg.getRole() != null && dbMsg.getContent() != null) {
                messages.add(new ChatMessage(dbMsg.getRole(), dbMsg.getContent()));
            }
        }
        
        // 3.3 添加当前问题
        messages.add(new ChatMessage("user", request.getQuestion()));

        // 4. 保存用户消息到数据库
        chatContextService.saveMessage(
            finalSessionId,
            "user",
            request.getQuestion(),
            "bailian",
            request.getTemperature(),
            null
        );

        // 5. 调用AI接口
        double temperature = request.getTemperature() != null ? request.getTemperature() : properties.getTemperature();
        int maxTokens = request.getMaxTokens() != null ? request.getMaxTokens() : properties.getMaxTokens();

        AtomicReference<StringBuilder> assistantResponse = new AtomicReference<>(new StringBuilder());

        return bailianClient.streamChat(messages, temperature, maxTokens,
                request.isUseKnowledgeBase(), request.getKnowledgeBaseId())
                .doOnNext(chunk -> assistantResponse.get().append(chunk))
                .doOnComplete(() -> {
                    // 6. 保存AI回复到数据库
                    String fullResponse = assistantResponse.get().toString();
                    if (StringUtils.hasText(fullResponse)) {
                        chatContextService.saveMessage(
                            finalSessionId,
                            "assistant",
                            fullResponse,
                            "bailian",
                            temperature,
                            null
                        );
                    }
                });
    }

    /**
     * 构建系统提示词
     */
    private String buildSystemPrompt(String knowledgeContext) {
        return String.format("""
                你是成都理工大学的AI校史助手，专门回答关于学校历史、人物、事件等问题。
                
                请参考以下知识库资料回答用户问题：
                %s
                
                回答要求：
                1. 基于知识库内容回答，确保信息准确
                2. 如果知识库中没有相关信息，请明确告知用户
                3. 回答要简洁清晰，重点突出
                4. 可以结合上下文进行连续对话
                5. 对于人物、事件等可以提供更多背景信息
                """, knowledgeContext);
    }

    /**
     * 截取标题（取问题的前30个字符）
     */
    private String truncateTitle(String question) {
        if (question == null) return "新对话";
        if (question.length() <= 30) return question;
        return question.substring(0, 30) + "...";
    }

    /**
     * 清理消息
     */
    private ChatMessage sanitizeMessage(ChatMessage message) {
        if (message == null || !StringUtils.hasText(message.getContent()) || !StringUtils.hasText(message.getRole())) {
            return null;
        }
        String normalizedRole = switch (message.getRole().toLowerCase(Locale.ROOT)) {
            case "system", "user", "assistant" -> message.getRole().toLowerCase(Locale.ROOT);
            default -> "user";
        };
        return new ChatMessage(normalizedRole, message.getContent());
    }
}
