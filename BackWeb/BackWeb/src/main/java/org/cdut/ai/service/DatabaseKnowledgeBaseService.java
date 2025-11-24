package org.cdut.ai.service;

import org.cdut.ai.mapper.KnowledgeBaseMapper;
import org.cdut.ai.model.KnowledgeBase;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 基于数据库的知识库服务
 */
@Service
public class DatabaseKnowledgeBaseService {

    private final KnowledgeBaseMapper knowledgeBaseMapper;

    public DatabaseKnowledgeBaseService(KnowledgeBaseMapper knowledgeBaseMapper) {
        this.knowledgeBaseMapper = knowledgeBaseMapper;
    }

    /**
     * 构建AI对话的知识上下文
     */
    public String buildKnowledgeContext(String question, int limit) {
        List<KnowledgeBase> blocks;

        if (!StringUtils.hasText(question)) {
            // 如果没有问题，返回所有高优先级的知识
            blocks = knowledgeBaseMapper.findAllEnabled().stream()
                    .limit(limit)
                    .collect(Collectors.toList());
        } else {
            // 先尝试全文搜索
            blocks = knowledgeBaseMapper.fullTextSearch(question, limit);
            
            // 如果全文搜索结果不足，补充关键词搜索
            if (blocks.size() < limit) {
                String[] keywords = extractKeywords(question);
                for (String keyword : keywords) {
                    if (blocks.size() >= limit) break;
                    List<KnowledgeBase> additionalBlocks = knowledgeBaseMapper
                            .searchByKeyword(keyword, limit - blocks.size());
                    
                    // 去重添加
                    for (KnowledgeBase block : additionalBlocks) {
                        if (blocks.stream().noneMatch(b -> b.getId().equals(block.getId()))) {
                            blocks.add(block);
                            if (blocks.size() >= limit) break;
                        }
                    }
                }
            }
        }

        if (blocks.isEmpty()) {
            return "暂无相关知识库资料。";
        }

        return blocks.stream()
                .map(block -> String.format("""
                        【%s】
                        %s
                        """, block.getTitle(), block.getContent()))
                .collect(Collectors.joining("\n---\n"));
    }

    /**
     * 提取关键词
     */
    private String[] extractKeywords(String question) {
        if (!StringUtils.hasText(question)) {
            return new String[0];
        }
        
        // 简单分词：按空格、标点符号分割
        return question.toLowerCase(Locale.ROOT)
                .replaceAll("[，。！？、；：\u201c\u201d\u2018\u2019（）《》【】\\s]+", " ")
                .split("\\s+");
    }

    /**
     * 获取所有启用的知识库
     */
    public List<KnowledgeBase> getAllEnabled() {
        return knowledgeBaseMapper.findAllEnabled();
    }

    /**
     * 根据分类获取知识库
     */
    public List<KnowledgeBase> getByCategory(String category) {
        return knowledgeBaseMapper.findByCategory(category);
    }

    /**
     * 添加知识库
     */
    public KnowledgeBase addKnowledge(String title, String content, String category, String keywords, Integer priority) {
        KnowledgeBase kb = new KnowledgeBase();
        kb.setTitle(title);
        kb.setContent(content);
        kb.setCategory(category != null ? category : "general");
        kb.setKeywords(keywords);
        kb.setPriority(priority != null ? priority : 1);
        kb.setStatus(1);
        
        knowledgeBaseMapper.insert(kb);
        return kb;
    }

    /**
     * 更新知识库
     */
    public boolean updateKnowledge(KnowledgeBase knowledgeBase) {
        return knowledgeBaseMapper.update(knowledgeBase) > 0;
    }

    /**
     * 删除知识库
     */
    public boolean deleteKnowledge(Long id) {
        return knowledgeBaseMapper.deleteById(id) > 0;
    }

    /**
     * 根据ID获取知识库
     */
    public KnowledgeBase getById(Long id) {
        return knowledgeBaseMapper.findById(id);
    }
}
