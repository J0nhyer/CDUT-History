package org.cdut.ai.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 基于.txt文件的知识库服务
 * 支持简单的文本格式知识库
 */
@Service
public class TextKnowledgeBaseService {

    private final Path knowledgeBasePath;
    
    public TextKnowledgeBaseService() {
        this.knowledgeBasePath = Path.of("data", "knowledge-base.txt");
        initStorage();
    }

    /**
     * 构建AI对话的知识上下文
     */
    public String buildKnowledgeContext(String question, int limit) {
        List<KnowledgeBlock> blocks = loadKnowledgeBlocks();
        
        if (blocks.isEmpty()) {
            return "暂无相关知识库资料。";
        }
        
        // 根据问题相关性排序
        List<KnowledgeBlock> topBlocks = selectTopBlocks(blocks, question, limit);
        
        if (topBlocks.isEmpty()) {
            return "未找到相关知识库资料。";
        }
        
        return topBlocks.stream()
                .map(block -> String.format("""
                        【%s】
                        %s
                        """, block.getTitle(), block.getContent()))
                .collect(Collectors.joining("\n---\n"));
    }

    /**
     * 加载所有知识块
     */
    private List<KnowledgeBlock> loadKnowledgeBlocks() {
        try {
            if (Files.notExists(knowledgeBasePath)) {
                return new ArrayList<>();
            }
            
            String content = Files.readString(knowledgeBasePath, StandardCharsets.UTF_8);
            return parseKnowledgeBlocks(content);
            
        } catch (IOException e) {
            System.err.println("读取知识库文件失败: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 解析知识块
     * 格式：
     * === 标题 ===
     * 内容...
     * 
     * === 下一个标题 ===
     * 内容...
     */
    private List<KnowledgeBlock> parseKnowledgeBlocks(String content) {
        List<KnowledgeBlock> blocks = new ArrayList<>();
        
        // 按 === 标题 === 分割
        String[] sections = content.split("(?m)^===\\s*(.+?)\\s*===$");
        
        // 第一个元素是分隔符之前的内容，跳过
        for (int i = 1; i < sections.length; i += 2) {
            if (i + 1 < sections.length) {
                String title = sections[i].trim();
                String blockContent = sections[i + 1].trim();
                
                if (StringUtils.hasText(title) && StringUtils.hasText(blockContent)) {
                    blocks.add(new KnowledgeBlock(title, blockContent));
                }
            }
        }
        
        return blocks;
    }

    /**
     * 选择最相关的知识块
     */
    private List<KnowledgeBlock> selectTopBlocks(List<KnowledgeBlock> blocks, String question, int limit) {
        if (!StringUtils.hasText(question)) {
            return blocks.stream().limit(limit).collect(Collectors.toList());
        }
        
        String[] keywords = question.toLowerCase(Locale.ROOT).split("\\s+");
        
        return blocks.stream()
                .sorted(Comparator.comparingInt((KnowledgeBlock block) -> scoreBlock(block, keywords)).reversed())
                .filter(block -> scoreBlock(block, keywords) > 0) // 只返回有相关性的
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * 计算知识块的相关性分数
     */
    private int scoreBlock(KnowledgeBlock block, String[] keywords) {
        int score = 0;
        String title = block.getTitle().toLowerCase(Locale.ROOT);
        String content = block.getContent().toLowerCase(Locale.ROOT);
        
        for (String keyword : keywords) {
            if (!StringUtils.hasText(keyword) || keyword.length() < 2) {
                continue;
            }
            
            // 标题匹配权重更高
            if (title.contains(keyword)) {
                score += 5;
            }
            
            // 内容匹配
            if (content.contains(keyword)) {
                score += 2;
            }
        }
        
        return score;
    }

    /**
     * 初始化存储
     */
    private void initStorage() {
        try {
            Files.createDirectories(knowledgeBasePath.getParent());
            
            if (Files.notExists(knowledgeBasePath)) {
                // 创建示例知识库文件
                String example = """
                        === 成都理工大学简介 ===
                        成都理工大学坐落于四川省成都市，是教育部与四川省共建的"双一流"建设高校。
                        它以地质、能源、资源科学等学科为显著优势，同时涵盖理、工、文、管等多学科协调发展。
                        在地质勘探、环境科学等领域享有盛誉，是我国地球科学高层次人才培养的重要基地之一。
                        
                        === 学校历史沿革 ===
                        1956年，成都地质勘探学院建校，这是成都理工大学的前身。
                        学校经历多次更名和发展，最终于1993年更名为成都理工学院，2001年正式更名为成都理工大学。
                        
                        === 优势学科 ===
                        地质学、地质资源与地质工程是学校的王牌学科。
                        学校在地球科学、资源勘查、环境科学、土木工程等领域具有显著优势。
                        拥有多个国家重点学科和省部级重点实验室。
                        
                        === 校园文化 ===
                        学校秉承"穷究于理，成就于工"的校训，培养了大批地质、能源领域的专业人才。
                        校园内建有地质博物馆，收藏了丰富的地质标本和化石。
                        """;
                
                Files.writeString(knowledgeBasePath, example, StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            throw new IllegalStateException("初始化知识库文件失败", e);
        }
    }

    /**
     * 知识块内部类
     */
    private static class KnowledgeBlock {
        private final String title;
        private final String content;

        public KnowledgeBlock(String title, String content) {
            this.title = title;
            this.content = content;
        }

        public String getTitle() {
            return title;
        }

        public String getContent() {
            return content;
        }
    }
}
