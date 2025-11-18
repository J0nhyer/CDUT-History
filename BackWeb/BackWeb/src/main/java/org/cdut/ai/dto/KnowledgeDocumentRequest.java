package org.cdut.ai.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class KnowledgeDocumentRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private String format = "markdown";

    private List<String> tags;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
