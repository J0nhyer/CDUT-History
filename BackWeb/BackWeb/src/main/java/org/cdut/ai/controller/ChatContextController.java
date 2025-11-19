package org.cdut.ai.controller;

import org.cdut.ai.dto.ChatContextRequest;
import org.cdut.ai.dto.ChatSessionResponse;
import org.cdut.ai.model.ChatMessage;
import org.cdut.ai.model.ChatSession;
import org.cdut.ai.service.ChatContextService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatContextController {

    private final ChatContextService chatContextService;

    public ChatContextController(ChatContextService chatContextService) {
        this.chatContextService = chatContextService;
    }

    /**
     * 创建新会话
     */
    @PostMapping("/sessions")
    public ChatSession createSession(@RequestBody ChatContextRequest request) {
        return chatContextService.createSession(
            request.getUserId(), 
            request.getTitle() != null ? request.getTitle() : "新对话"
        );
    }

    /**
     * 获取会话信息
     */
    @GetMapping("/sessions/{sessionId}")
    public ChatSession getSession(@PathVariable String sessionId) {
        return chatContextService.getSession(sessionId);
    }

    /**
     * 获取用户的所有会话
     */
    @GetMapping("/sessions")
    public List<ChatSession> getUserSessions(
            @RequestParam(required = false) String userId,
            @RequestParam(defaultValue = "50") int limit) {
        return chatContextService.getUserSessions(userId, limit);
    }

    /**
     * 获取会话的历史消息
     */
    @GetMapping("/sessions/{sessionId}/messages")
    public List<ChatMessage> getSessionMessages(
            @PathVariable String sessionId,
            @RequestParam(defaultValue = "50") int limit) {
        return chatContextService.getSessionMessages(sessionId, limit);
    }

    /**
     * 获取会话的完整上下文（会话信息+历史消息）
     */
    @GetMapping("/sessions/{sessionId}/context")
    public ChatSessionResponse getSessionContext(
            @PathVariable String sessionId,
            @RequestParam(defaultValue = "20") int messageLimit) {
        ChatSession session = chatContextService.getSession(sessionId);
        List<ChatMessage> messages = chatContextService.getSessionMessages(sessionId, messageLimit);
        
        ChatSessionResponse response = new ChatSessionResponse();
        response.setSession(session);
        response.setMessages(messages);
        return response;
    }

    /**
     * 删除会话
     */
    @DeleteMapping("/sessions/{sessionId}")
    public void deleteSession(@PathVariable String sessionId) {
        chatContextService.deleteSession(sessionId);
    }

    /**
     * 更新会话标题
     */
    @PutMapping("/sessions/{sessionId}/title")
    public void updateSessionTitle(
            @PathVariable String sessionId,
            @RequestBody ChatContextRequest request) {
        chatContextService.updateSessionTitle(sessionId, request.getTitle());
    }
}
