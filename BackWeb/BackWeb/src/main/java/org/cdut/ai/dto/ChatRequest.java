package org.cdut.ai.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

public class ChatRequest {

    @NotBlank
    private String question;

    @Valid
    private List<ChatMessage> history = new ArrayList<>();

    private boolean useKnowledgeBase = true;

    private String knowledgeBaseId;

    private Double temperature;

    private Integer maxTokens;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<ChatMessage> getHistory() {
        return history;
    }

    public void setHistory(List<ChatMessage> history) {
        this.history = history;
    }

    public boolean isUseKnowledgeBase() {
        return useKnowledgeBase;
    }

    public void setUseKnowledgeBase(boolean useKnowledgeBase) {
        this.useKnowledgeBase = useKnowledgeBase;
    }

    public String getKnowledgeBaseId() {
        return knowledgeBaseId;
    }

    public void setKnowledgeBaseId(String knowledgeBaseId) {
        this.knowledgeBaseId = knowledgeBaseId;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Integer getMaxTokens() {
        return maxTokens;
    }

    public void setMaxTokens(Integer maxTokens) {
        this.maxTokens = maxTokens;
    }
}
