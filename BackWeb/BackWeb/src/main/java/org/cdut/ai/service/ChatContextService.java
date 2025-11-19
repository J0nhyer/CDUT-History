package org.cdut.ai.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.cdut.ai.mapper.ChatMessageMapper;
import org.cdut.ai.mapper.ChatSessionMapper;
import org.cdut.ai.model.ChatMessage;
import org.cdut.ai.model.ChatSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChatContextService {

    private final ChatSessionMapper chatSessionMapper;
    private final ChatMessageMapper chatMessageMapper;

    public ChatContextService(ChatSessionMapper chatSessionMapper, ChatMessageMapper chatMessageMapper) {
        this.chatSessionMapper = chatSessionMapper;
        this.chatMessageMapper = chatMessageMapper;
    }

    /**
     * 创建新的聊天会话
     */
    @Transactional
    public ChatSession createSession(String userId, String title) {
        ChatSession session = new ChatSession();
        session.setSessionId(UUID.randomUUID().toString());
        session.setUserId(userId);
        session.setTitle(title);
        session.setTotalMessages(0);
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        chatSessionMapper.insert(session);
        return session;
    }

    /**
     * 保存聊天消息
     */
    @Transactional
    public ChatMessage saveMessage(String sessionId, String role, String content, 
                                    String model, Double temperature, String referencedKnowledge) {
        ChatMessage message = new ChatMessage();
        message.setMessageId(UUID.randomUUID().toString());
        message.setSessionId(sessionId);
        message.setRole(role);
        message.setContent(content);
        message.setModel(model);
        message.setTemperature(temperature);
        message.setReferencedKnowledge(referencedKnowledge);
        message.setTokens(estimateTokens(content));
        message.setCreatedAt(LocalDateTime.now());
        
        chatMessageMapper.insert(message);
        
        // 更新会话的消息计数
        updateSessionMessageCount(sessionId);
        
        return message;
    }

    /**
     * 获取会话的历史消息（用于上下文）
     */
    public List<ChatMessage> getSessionMessages(String sessionId, int limit) {
        LambdaQueryWrapper<ChatMessage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatMessage::getSessionId, sessionId)
               .orderByDesc(ChatMessage::getCreatedAt)
               .last("LIMIT " + limit);
        
        List<ChatMessage> messages = chatMessageMapper.selectList(wrapper);
        // 反转顺序，让最早的消息在前
        java.util.Collections.reverse(messages);
        return messages;
    }

    /**
     * 获取会话信息
     */
    public ChatSession getSession(String sessionId) {
        LambdaQueryWrapper<ChatSession> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatSession::getSessionId, sessionId);
        return chatSessionMapper.selectOne(wrapper);
    }

    /**
     * 获取用户的所有会话
     */
    public List<ChatSession> getUserSessions(String userId, int limit) {
        LambdaQueryWrapper<ChatSession> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatSession::getUserId, userId)
               .orderByDesc(ChatSession::getUpdatedAt)
               .last("LIMIT " + limit);
        return chatSessionMapper.selectList(wrapper);
    }

    /**
     * 删除会话及其消息
     */
    @Transactional
    public void deleteSession(String sessionId) {
        // 删除会话的所有消息
        LambdaQueryWrapper<ChatMessage> messageWrapper = new LambdaQueryWrapper<>();
        messageWrapper.eq(ChatMessage::getSessionId, sessionId);
        chatMessageMapper.delete(messageWrapper);
        
        // 删除会话
        LambdaQueryWrapper<ChatSession> sessionWrapper = new LambdaQueryWrapper<>();
        sessionWrapper.eq(ChatSession::getSessionId, sessionId);
        chatSessionMapper.delete(sessionWrapper);
    }

    /**
     * 更新会话标题
     */
    @Transactional
    public void updateSessionTitle(String sessionId, String title) {
        ChatSession session = getSession(sessionId);
        if (session != null) {
            session.setTitle(title);
            session.setUpdatedAt(LocalDateTime.now());
            chatSessionMapper.updateById(session);
        }
    }

    /**
     * 更新会话的消息计数
     */
    private void updateSessionMessageCount(String sessionId) {
        LambdaQueryWrapper<ChatMessage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatMessage::getSessionId, sessionId);
        Long count = chatMessageMapper.selectCount(wrapper);
        
        ChatSession session = getSession(sessionId);
        if (session != null) {
            session.setTotalMessages(count.intValue());
            session.setUpdatedAt(LocalDateTime.now());
            chatSessionMapper.updateById(session);
        }
    }

    /**
     * 估算token数量（简化版）
     */
    private int estimateTokens(String content) {
        if (content == null) return 0;
        // 中文大约1.5个字符一个token，英文大约4个字符一个token
        int chineseCount = content.replaceAll("[^\\u4e00-\\u9fa5]", "").length();
        int otherCount = content.length() - chineseCount;
        return (int) (chineseCount / 1.5 + otherCount / 4.0);
    }
}
