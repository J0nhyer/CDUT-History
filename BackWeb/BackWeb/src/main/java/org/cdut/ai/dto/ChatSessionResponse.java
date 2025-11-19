package org.cdut.ai.dto;

import org.cdut.ai.model.ChatMessage;
import org.cdut.ai.model.ChatSession;

import java.util.List;

public class ChatSessionResponse {

    private ChatSession session;
    private List<ChatMessage> messages;

    public ChatSessionResponse() {
    }

    public ChatSession getSession() {
        return session;
    }

    public void setSession(ChatSession session) {
        this.session = session;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }
}
