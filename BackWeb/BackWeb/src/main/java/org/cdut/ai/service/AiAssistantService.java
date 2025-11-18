package org.cdut.ai.service;

import org.cdut.ai.client.BailianClient;
import org.cdut.ai.config.AliBailianProperties;
import org.cdut.ai.dto.ChatMessage;
import org.cdut.ai.dto.ChatRequest;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
public class AiAssistantService {

    private final BailianClient bailianClient;
    private final AliBailianProperties properties;
    private final KnowledgeBaseService knowledgeBaseService;
    private final String promptTemplate;

    public AiAssistantService(BailianClient bailianClient,
                              AliBailianProperties properties,
                              KnowledgeBaseService knowledgeBaseService) {
        this.bailianClient = bailianClient;
        this.properties = properties;
        this.knowledgeBaseService = knowledgeBaseService;
        this.promptTemplate = loadPromptTemplate(properties.getPromptTemplate());
    }

    public Flux<String> streamChat(ChatRequest request) {
        List<ChatMessage> messages = new ArrayList<>();
        String knowledgeContext = knowledgeBaseService.buildPromptContext(request.getQuestion(), 3);
        messages.add(new ChatMessage("system", renderSystemPrompt(knowledgeContext, request.getQuestion())));
        if (request.getHistory() != null) {
            request.getHistory().stream()
                    .map(this::sanitizeMessage)
                    .filter(Objects::nonNull)
                    .forEach(messages::add);
        }
        messages.add(new ChatMessage("user", request.getQuestion()));

        double temperature = request.getTemperature() != null ? request.getTemperature() : properties.getTemperature();
        int maxTokens = request.getMaxTokens() != null ? request.getMaxTokens() : properties.getMaxTokens();

        return bailianClient.streamChat(messages, temperature, maxTokens,
                request.isUseKnowledgeBase(), request.getKnowledgeBaseId());
    }

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

    private String renderSystemPrompt(String knowledgeContext, String question) {
        return promptTemplate
                .replace("{{knowledge}}", knowledgeContext == null ? "" : knowledgeContext)
                .replace("{{question}}", question == null ? "" : question);
    }

    private String loadPromptTemplate(Resource resource) {
        if (resource == null) {
            return defaultPrompt();
        }
        try (InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            return FileCopyUtils.copyToString(reader);
        } catch (IOException e) {
            return defaultPrompt();
        }
    }

    private String defaultPrompt() {
        return """
                你是一名专业的校史讲解助手，请参考以下校史资料回答用户问题：
                {{knowledge}}

                如果资料中没有答案，请明确告知用户目前没有权威信息。当前问题：{{question}}
                """;
    }
}
