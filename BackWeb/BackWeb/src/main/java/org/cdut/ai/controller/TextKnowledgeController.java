package org.cdut.ai.controller;

import org.cdut.ai.service.TextKnowledgeBaseService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 基于.txt文件的知识库API
 */
@RestController
@RequestMapping("/api/knowledge-txt")
public class TextKnowledgeController {

    private final TextKnowledgeBaseService textKnowledgeBaseService;

    public TextKnowledgeController(TextKnowledgeBaseService textKnowledgeBaseService) {
        this.textKnowledgeBaseService = textKnowledgeBaseService;
    }

    /**
     * 获取知识上下文（用于测试）
     */
    @GetMapping("/context")
    public Map<String, Object> getKnowledgeContext(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "5") int limit) {
        String context = textKnowledgeBaseService.buildKnowledgeContext(query, limit);
        return Map.of(
            "query", query != null ? query : "",
            "limit", limit,
            "context", context
        );
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
            "status", "ok",
            "knowledgeSource", "txt file",
            "path", "data/knowledge-base.txt"
        );
    }
}
