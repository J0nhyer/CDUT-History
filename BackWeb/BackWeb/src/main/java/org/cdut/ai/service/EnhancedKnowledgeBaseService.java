package org.cdut.ai.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.cdut.ai.mapper.KnowledgeDocumentMapper;
import org.cdut.ai.model.KnowledgeDocument;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EnhancedKnowledgeBaseService {

    private final KnowledgeDocumentMapper knowledgeDocumentMapper;
    private final ObjectMapper objectMapper;

    public EnhancedKnowledgeBaseService(KnowledgeDocumentMapper knowledgeDocumentMapper, ObjectMapper objectMapper) {
        this.knowledgeDocumentMapper = knowledgeDocumentMapper;
        this.objectMapper = objectMapper;
    }

    /**
     * 添加知识文档
     */
    @Transactional
    public KnowledgeDocument addDocument(String title, String content, String contentType, 
                                         String sourceType, List<String> tags, Map<String, Object> metadata) {
        KnowledgeDocument doc = new KnowledgeDocument();
        doc.setDocId(UUID.randomUUID().toString());
        doc.setTitle(title);
        doc.setContent(content);
        doc.setContentType(contentType != null ? contentType : "text");
        doc.setSourceType(sourceType != null ? sourceType : "manual");
        doc.setWordCount(content != null ? content.length() : 0);
        doc.setViewCount(0);
        doc.setReferenceCount(0);
        doc.setEmbeddingStatus("completed");
        doc.setCreatedAt(LocalDateTime.now());
        doc.setUpdatedAt(LocalDateTime.now());
        
        if (tags != null && !tags.isEmpty()) {
            try {
                doc.setTags(objectMapper.writeValueAsString(tags));
            } catch (Exception e) {
                doc.setTags("[]");
            }
        }
        
        if (metadata != null && !metadata.isEmpty()) {
            try {
                doc.setMetadata(objectMapper.writeValueAsString(metadata));
            } catch (Exception e) {
                doc.setMetadata("{}");
            }
        }
        
        knowledgeDocumentMapper.insert(doc);
        return doc;
    }

    /**
     * 搜索知识文档
     */
    public List<KnowledgeDocument> searchDocuments(String query, int limit) {
        if (!StringUtils.hasText(query)) {
            // 如果没有查询，返回最新的文档
            LambdaQueryWrapper<KnowledgeDocument> wrapper = new LambdaQueryWrapper<>();
            wrapper.orderByDesc(KnowledgeDocument::getCreatedAt)
                   .last("LIMIT " + limit);
            return knowledgeDocumentMapper.selectList(wrapper);
        }
        
        try {
            // 尝试使用全文搜索
            List<KnowledgeDocument> results = knowledgeDocumentMapper.searchByFullText(query, limit);
            if (results != null && !results.isEmpty()) {
                return results;
            }
        } catch (Exception e) {
            // 全文搜索失败，降级到LIKE搜索
        }
        
        // 降级搜索：使用LIKE
        return searchByKeywords(query, limit);
    }

    /**
     * 关键词搜索（降级方案）
     */
    private List<KnowledgeDocument> searchByKeywords(String query, int limit) {
        String[] keywords = query.toLowerCase(Locale.ROOT).split("\\s+");
        LambdaQueryWrapper<KnowledgeDocument> wrapper = new LambdaQueryWrapper<>();
        
        for (String keyword : keywords) {
            if (StringUtils.hasText(keyword)) {
                wrapper.and(w -> w.like(KnowledgeDocument::getTitle, keyword)
                                  .or()
                                  .like(KnowledgeDocument::getContent, keyword));
            }
        }
        
        wrapper.orderByDesc(KnowledgeDocument::getReferenceCount)
               .orderByDesc(KnowledgeDocument::getCreatedAt)
               .last("LIMIT " + limit);
        
        return knowledgeDocumentMapper.selectList(wrapper);
    }

    /**
     * 构建知识上下文提示词
     */
    public String buildKnowledgeContext(String query, int limit) {
        List<KnowledgeDocument> docs = searchDocuments(query, limit);
        
        if (docs.isEmpty()) {
            return "暂无相关知识库资料。";
        }
        
        return docs.stream()
                .map(doc -> String.format("""
                        【%s】
                        来源：%s
                        内容：%s
                        """, 
                        doc.getTitle(),
                        doc.getSourceType(),
                        truncateContent(doc.getContent(), 500)))
                .collect(Collectors.joining("\n---\n"));
    }

    /**
     * 增加文档引用计数
     */
    @Transactional
    public void incrementReferenceCount(String docId) {
        KnowledgeDocument doc = getDocumentByDocId(docId);
        if (doc != null) {
            doc.setReferenceCount((doc.getReferenceCount() != null ? doc.getReferenceCount() : 0) + 1);
            knowledgeDocumentMapper.updateById(doc);
        }
    }

    /**
     * 增加文档浏览计数
     */
    @Transactional
    public void incrementViewCount(String docId) {
        KnowledgeDocument doc = getDocumentByDocId(docId);
        if (doc != null) {
            doc.setViewCount((doc.getViewCount() != null ? doc.getViewCount() : 0) + 1);
            knowledgeDocumentMapper.updateById(doc);
        }
    }

    /**
     * 获取文档
     */
    public KnowledgeDocument getDocumentByDocId(String docId) {
        LambdaQueryWrapper<KnowledgeDocument> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(KnowledgeDocument::getDocId, docId);
        return knowledgeDocumentMapper.selectOne(wrapper);
    }

    /**
     * 获取所有文档
     */
    public List<KnowledgeDocument> listAllDocuments(int limit) {
        LambdaQueryWrapper<KnowledgeDocument> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(KnowledgeDocument::getUpdatedAt)
               .last("LIMIT " + limit);
        return knowledgeDocumentMapper.selectList(wrapper);
    }

    /**
     * 按来源类型获取文档
     */
    public List<KnowledgeDocument> getDocumentsBySourceType(String sourceType, int limit) {
        LambdaQueryWrapper<KnowledgeDocument> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(KnowledgeDocument::getSourceType, sourceType)
               .orderByDesc(KnowledgeDocument::getCreatedAt)
               .last("LIMIT " + limit);
        return knowledgeDocumentMapper.selectList(wrapper);
    }

    /**
     * 删除文档
     */
    @Transactional
    public void deleteDocument(String docId) {
        LambdaQueryWrapper<KnowledgeDocument> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(KnowledgeDocument::getDocId, docId);
        knowledgeDocumentMapper.delete(wrapper);
    }

    /**
     * 获取知识库统计信息
     */
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        Long totalCount = knowledgeDocumentMapper.selectCount(null);
        stats.put("totalDocuments", totalCount);
        
        // 按来源类型统计
        Map<String, Long> sourceStats = new HashMap<>();
        List<String> sourceTypes = Arrays.asList("database", "manual", "import", "crawl");
        for (String sourceType : sourceTypes) {
            LambdaQueryWrapper<KnowledgeDocument> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(KnowledgeDocument::getSourceType, sourceType);
            sourceStats.put(sourceType, knowledgeDocumentMapper.selectCount(wrapper));
        }
        stats.put("bySourceType", sourceStats);
        
        return stats;
    }

    /**
     * 截断内容
     */
    private String truncateContent(String content, int maxLength) {
        if (content == null) return "";
        if (content.length() <= maxLength) return content;
        return content.substring(0, maxLength) + "...";
    }
}
