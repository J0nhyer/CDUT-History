package org.cdut.ai.controller;

import org.cdut.ai.dto.KnowledgeDocumentAddRequest;
import org.cdut.ai.model.KnowledgeDocument;
import org.cdut.ai.service.EnhancedKnowledgeBaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/knowledge-v2")
public class EnhancedKnowledgeController {

    private final EnhancedKnowledgeBaseService knowledgeBaseService;

    public EnhancedKnowledgeController(EnhancedKnowledgeBaseService knowledgeBaseService) {
        this.knowledgeBaseService = knowledgeBaseService;
    }

    /**
     * 添加知识文档
     */
    @PostMapping("/documents")
    public KnowledgeDocument addDocument(@RequestBody KnowledgeDocumentAddRequest request) {
        return knowledgeBaseService.addDocument(
            request.getTitle(),
            request.getContent(),
            request.getContentType(),
            request.getSourceType(),
            request.getTags(),
            request.getMetadata()
        );
    }

    /**
     * 搜索知识文档
     */
    @GetMapping("/documents/search")
    public List<KnowledgeDocument> searchDocuments(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        return knowledgeBaseService.searchDocuments(query, limit);
    }

    /**
     * 获取知识上下文（用于AI对话）
     */
    @GetMapping("/context")
    public Map<String, Object> getKnowledgeContext(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int limit) {
        String context = knowledgeBaseService.buildKnowledgeContext(query, limit);
        return Map.of("context", context);
    }

    /**
     * 获取所有知识文档
     */
    @GetMapping("/documents")
    public List<KnowledgeDocument> listDocuments(
            @RequestParam(defaultValue = "100") int limit) {
        return knowledgeBaseService.listAllDocuments(limit);
    }

    /**
     * 按来源类型获取文档
     */
    @GetMapping("/documents/by-source/{sourceType}")
    public List<KnowledgeDocument> getDocumentsBySource(
            @PathVariable String sourceType,
            @RequestParam(defaultValue = "100") int limit) {
        return knowledgeBaseService.getDocumentsBySourceType(sourceType, limit);
    }

    /**
     * 获取文档详情
     */
    @GetMapping("/documents/{docId}")
    public KnowledgeDocument getDocument(@PathVariable String docId) {
        // 增加浏览计数
        knowledgeBaseService.incrementViewCount(docId);
        return knowledgeBaseService.getDocumentByDocId(docId);
    }

    /**
     * 删除文档
     */
    @DeleteMapping("/documents/{docId}")
    public void deleteDocument(@PathVariable String docId) {
        knowledgeBaseService.deleteDocument(docId);
    }

    /**
     * 获取知识库统计信息
     */
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        return knowledgeBaseService.getStatistics();
    }
}
