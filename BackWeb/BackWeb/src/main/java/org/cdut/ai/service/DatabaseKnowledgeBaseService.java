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
     * 构建AI对话的知识上下文（优化版）
     */
    public String buildKnowledgeContext(String question, int limit) {
        List<KnowledgeBase> blocks = new ArrayList<>();
        
        // 1. 始终优先获取系统提示词（category='system_prompt'）
        List<KnowledgeBase> systemPrompt = knowledgeBaseMapper.findByCategory("system_prompt").stream()
                .limit(1)
                .collect(Collectors.toList());
        
        if (!systemPrompt.isEmpty()) {
            blocks.addAll(systemPrompt);
        }

        if (!StringUtils.hasText(question)) {
            // 如果没有问题，返回所有高优先级的知识
            List<KnowledgeBase> otherBlocks = knowledgeBaseMapper.findAllEnabled().stream()
                    .filter(kb -> blocks.stream().noneMatch(b -> b.getId().equals(kb.getId())))
                    .limit(limit - blocks.size())
                    .collect(Collectors.toList());
            blocks.addAll(otherBlocks);
        } else {
            // 2. 优先检索FAQ（常见问题快速匹配）
            List<KnowledgeBase> faqResults = knowledgeBaseMapper.findByCategory("faq").stream()
                    .filter(kb -> matchQuestion(question, kb))
                    .limit(2)
                    .collect(Collectors.toList());
            
            for (KnowledgeBase kb : faqResults) {
                if (blocks.stream().noneMatch(b -> b.getId().equals(kb.getId()))) {
                    blocks.add(kb);
                }
            }
            
            // 3. 如果FAQ匹配不足，尝试同义词扩展
            if (blocks.size() < limit / 2) {
                List<KnowledgeBase> synonymResults = knowledgeBaseMapper.findByCategory("synonym").stream()
                        .filter(kb -> matchSynonym(question, kb))
                        .limit(1)
                        .collect(Collectors.toList());
                blocks.addAll(synonymResults);
            }
            
            // 4. 全文搜索
            if (blocks.size() < limit) {
                List<KnowledgeBase> searchResults = knowledgeBaseMapper.fullTextSearch(question, limit);
                
                for (KnowledgeBase kb : searchResults) {
                    if (blocks.stream().noneMatch(b -> b.getId().equals(kb.getId()))) {
                        blocks.add(kb);
                        if (blocks.size() >= limit) break;
                    }
                }
            }
            
            // 5. 如果结果仍不足，补充关键词搜索
            if (blocks.size() < limit) {
                String[] keywords = extractKeywords(question);
                for (String keyword : keywords) {
                    if (blocks.size() >= limit) break;
                    List<KnowledgeBase> additionalBlocks = knowledgeBaseMapper
                            .searchByKeyword(keyword, limit - blocks.size());
                    
                    for (KnowledgeBase block : additionalBlocks) {
                        if (blocks.stream().noneMatch(b -> b.getId().equals(block.getId()))) {
                            blocks.add(block);
                            if (blocks.size() >= limit) break;
                        }
                    }
                }
            }
            
            // 6. 加载Few-shot示例（如果问题类型明确）
            if (blocks.size() < limit) {
                String questionType = classifyQuestion(question);
                if (questionType != null) {
                    List<KnowledgeBase> fewShotExamples = knowledgeBaseMapper.findByCategory("few_shot").stream()
                            .filter(kb -> kb.getKeywords() != null && kb.getKeywords().contains(questionType))
                            .limit(1)
                            .collect(Collectors.toList());
                    blocks.addAll(fewShotExamples);
                }
            }
        }

        if (blocks.isEmpty()) {
            return "暂无相关知识库资料。";
        }

        return blocks.stream()
                .map(KnowledgeBase::getContent)
                .collect(Collectors.joining("\n\n"));
    }
    
    /**
     * 匹配问题是否与FAQ相关
     */
    private boolean matchQuestion(String question, KnowledgeBase faq) {
        if (faq.getKeywords() == null) return false;
        String lowerQuestion = question.toLowerCase(Locale.ROOT);
        String[] faqKeywords = faq.getKeywords().split(",");
        
        for (String keyword : faqKeywords) {
            if (lowerQuestion.contains(keyword.trim().toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 匹配同义词
     */
    private boolean matchSynonym(String question, KnowledgeBase synonym) {
        if (synonym.getKeywords() == null) return false;
        String lowerQuestion = question.toLowerCase(Locale.ROOT);
        String[] synonymKeywords = synonym.getKeywords().split(",");
        
        for (String keyword : synonymKeywords) {
            if (lowerQuestion.contains(keyword.trim().toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 智能问题分类
     */
    private String classifyQuestion(String question) {
        String lowerQuestion = question.toLowerCase(Locale.ROOT);
        
        // 人物类问题
        if (lowerQuestion.matches(".*(谁|院士|教授|校长|人物|介绍).*")) {
            return "人物查询";
        }
        
        // 历史事件类
        if (lowerQuestion.matches(".*(哪年|什么时候|历史|建校|成立|发展).*")) {
            return "历史事件";
        }
        
        // 统计数据类
        if (lowerQuestion.matches(".*(几个|多少|有多少|数量|统计).*")) {
            return "统计数据";
        }
        
        // 学科专业类
        if (lowerQuestion.matches(".*(专业|学科|学院|优势|特色).*")) {
            return "学科专业";
        }
        
        return null;
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
