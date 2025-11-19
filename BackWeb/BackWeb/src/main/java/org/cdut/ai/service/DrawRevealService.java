package org.cdut.ai.service;

import org.cdut.ai.model.HistoryEvent;
import org.cdut.ai.model.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 校史涂鸦画板服务
 */
@Service
public class DrawRevealService {
    
    @Autowired
    private PersonService personService;
    
    @Autowired
    private HistoryService historyService;
    
    /**
     * 随机获取一个人物或历史事件
     * @return 随机的人物或事件数据
     */
    public Map<String, Object> getRandomItem() {
        // 随机决定返回人物还是事件（50%概率）
        Random random = new Random();
        boolean isPerson = random.nextBoolean();
        
        if (isPerson) {
            return getRandomPerson();
        } else {
            return getRandomEvent();
        }
    }
    
    /**
     * 获取随机人物
     */
    private Map<String, Object> getRandomPerson() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 获取所有人物
            List<Person> allPersons = personService.getAllPersons();
            
            if (allPersons == null || allPersons.isEmpty()) {
                return result;
            }
            
            // 随机选择一个人物
            Random random = new Random();
            Person person = allPersons.get(random.nextInt(allPersons.size()));
            
            // 构建返回数据
            result.put("type", "person");
            result.put("person_id", person.getPersonId());
            result.put("name", person.getName());
            result.put("description", person.getSubtitle() != null ? person.getSubtitle() : "成都理工大学杰出人物");
            
            // 提取人物信息
            if (person.getBiography() != null && !person.getBiography().isEmpty()) {
                // 使用第一段传记作为描述
                Object firstBio = person.getBiography().get(0);
                if (firstBio instanceof Map) {
                    Map<String, Object> bioMap = (Map<String, Object>) firstBio;
                    Object content = bioMap.get("content");
                    if (content != null) {
                        result.put("description", content.toString());
                    }
                }
            }
            
            // 添加其他字段
            result.put("birth_year", extractBirthYear(person));
            result.put("title", extractTitle(person));
            result.put("field", extractField(person));
            
        } catch (Exception e) {
            System.err.println("获取随机人物失败: " + e.getMessage());
            e.printStackTrace();
        }
        
        return result;
    }
    
    /**
     * 获取随机历史事件
     */
    private Map<String, Object> getRandomEvent() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 获取所有历史事件
            List<Map<String, Object>> allEvents = historyService.getAllEventsWithParsedJson();
            
            if (allEvents == null || allEvents.isEmpty()) {
                return result;
            }
            
            // 随机选择一个事件
            Random random = new Random();
            Map<String, Object> event = allEvents.get(random.nextInt(allEvents.size()));
            
            // 构建返回数据
            result.put("type", "event");
            result.put("event_id", event.get("event_id"));
            result.put("name", event.get("event_name"));
            result.put("description", event.get("description"));
            result.put("event_date", event.get("event_date"));
            result.put("event_type", event.get("event_type"));
            result.put("importance", event.get("importance"));
            
        } catch (Exception e) {
            System.err.println("获取随机事件失败: " + e.getMessage());
            e.printStackTrace();
        }
        
        return result;
    }
    
    /**
     * 从人物数据中提取出生年份
     */
    private String extractBirthYear(Person person) {
        // 从subtitle中提取年份信息
        if (person.getSubtitle() != null && person.getSubtitle().contains("20")) {
            String subtitle = person.getSubtitle();
            if (subtitle.contains("20世纪初")) {
                return "20世纪初期";
            } else if (subtitle.contains("20世纪中")) {
                return "20世纪中期";
            } else if (subtitle.contains("21世纪")) {
                return "21世纪";
            }
        }
        return null;
    }
    
    /**
     * 从人物数据中提取职位标题
     */
    private String extractTitle(Person person) {
        if (person.getSubtitle() != null) {
            // 提取第一个身份标签
            String[] parts = person.getSubtitle().split("·");
            if (parts.length > 0) {
                return parts[0].trim();
            }
        }
        return null;
    }
    
    /**
     * 从人物数据中提取研究领域
     */
    private String extractField(Person person) {
        if (person.getKeyTagsList() != null && !person.getKeyTagsList().isEmpty()) {
            List<String> tags = person.getKeyTagsList();
            // 返回第一个非时期的标签
            for (String tag : tags) {
                if (!tag.contains("世纪") && !tag.equals("院士") && !tag.equals("教授") && !tag.equals("奖项人")) {
                    return tag;
                }
            }
            return tags.get(0);
        }
        return null;
    }
    
    /**
     * AI画作评分算法
     * @param features 画作特征数据
     * @return 评分结果
     */
    public Map<String, Object> scoreDrawing(Map<String, Object> features) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 提取特征数据
            int strokeCount = getIntValue(features, "strokeCount");
            int pointCount = getIntValue(features, "pointCount");
            double coverageRatio = getDoubleValue(features, "coverageRatio");
            double averageStrokeLength = getDoubleValue(features, "averageStrokeLength");
            
            // 评分维度
            double strokeScore = calculateStrokeScore(strokeCount);
            double detailScore = calculateDetailScore(averageStrokeLength);
            double coverageScore = calculateCoverageScore(coverageRatio);
            double complexityScore = calculateComplexityScore(strokeCount, pointCount);
            
            // 综合评分 (100分制)
            double finalScore = (strokeScore * 0.3 + detailScore * 0.2 + 
                               coverageScore * 0.3 + complexityScore * 0.2);
            
            // 四舍五入到整数
            int score = (int) Math.round(finalScore);
            score = Math.max(0, Math.min(100, score)); // 限制在0-100之间
            
            // 生成评语
            String comment = generateComment(score, strokeCount, coverageRatio);
            
            result.put("score", score);
            result.put("comment", comment);
            result.put("breakdown", Map.of(
                "stroke", Math.round(strokeScore),
                "detail", Math.round(detailScore),
                "coverage", Math.round(coverageScore),
                "complexity", Math.round(complexityScore)
            ));
            
        } catch (Exception e) {
            System.err.println("评分计算失败: " + e.getMessage());
            e.printStackTrace();
            // 返回默认评分
            result.put("score", 75);
            result.put("comment", "创意无限，继续加油！");
        }
        
        return result;
    }
    
    private int getIntValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return 0;
    }
    
    private double getDoubleValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return 0.0;
    }
    
    private double calculateStrokeScore(int strokeCount) {
        // 笔画数评分：5-30笔为最佳
        if (strokeCount < 5) {
            return strokeCount * 10.0;
        } else if (strokeCount <= 30) {
            return 50 + (strokeCount - 5) * 2.0;
        } else if (strokeCount <= 50) {
            return 100 - (strokeCount - 30) * 1.5;
        } else {
            return Math.max(60, 100 - strokeCount * 0.5);
        }
    }
    
    private double calculateDetailScore(double avgStrokeLength) {
        // 笔画细节评分：平均长度适中最佳
        if (avgStrokeLength < 10) {
            return avgStrokeLength * 5.0;
        } else if (avgStrokeLength <= 50) {
            return 50 + avgStrokeLength;
        } else if (avgStrokeLength <= 100) {
            return 100 - (avgStrokeLength - 50) * 0.5;
        } else {
            return Math.max(50, 100 - avgStrokeLength * 0.3);
        }
    }
    
    private double calculateCoverageScore(double coverageRatio) {
        // 覆盖度评分：20%-70%为最佳
        if (coverageRatio < 0.1) {
            return coverageRatio * 400;
        } else if (coverageRatio <= 0.7) {
            return 40 + (coverageRatio - 0.1) * 100;
        } else {
            return Math.max(60, 100 - (coverageRatio - 0.7) * 100);
        }
    }
    
    private double calculateComplexityScore(int strokeCount, int pointCount) {
        // 复杂度评分：综合笔画数和点数
        double density = strokeCount > 0 ? (pointCount * 1.0 / strokeCount) : 0;
        if (density < 10) {
            return density * 5.0;
        } else if (density <= 50) {
            return 50 + density;
        } else if (density <= 100) {
            return 100 - (density - 50) * 0.5;
        } else {
            return Math.max(50, 100 - density * 0.2);
        }
    }
    
    private String generateComment(int score, int strokeCount, double coverageRatio) {
        if (score >= 95) {
            return "惊为天人！这幅作品充满了艺术感染力！";
        } else if (score >= 90) {
            return "太棒了！创意与技巧完美结合！";
        } else if (score >= 85) {
            return "非常优秀！画作富有表现力！";
        } else if (score >= 80) {
            return "很好！继续保持这份创作热情！";
        } else if (score >= 70) {
            return "不错的尝试！继续发挥你的想象力！";
        } else if (score >= 60) {
            return "有潜力！多尝试不同的绘画风格吧！";
        } else if (score >= 50) {
            return "继续努力！每一笔都是进步的开始！";
        } else {
            if (strokeCount < 3) {
                return "再多画几笔吧，让创意尽情挥洒！";
            } else if (coverageRatio < 0.1) {
                return "大胆一些，让画布充满你的创意！";
            } else {
                return "勇敢尝试，艺术没有标准答案！";
            }
        }
    }
    
    /**
     * AI图像识别 - 识别画作并匹配相似的内容（人物、事件、建筑等）
     * @param canvasData 画布图片数据
     * @param features 画作特征
     * @return 识别结果
     */
    public Map<String, Object> recognizeDrawing(String canvasData, Map<String, Object> features) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 基于画作特征进行智能匹配
            int strokeCount = getIntValue(features, "strokeCount");
            double coverageRatio = getDoubleValue(features, "coverageRatio");
            int pointCount = getIntValue(features, "pointCount");
            
            // 根据特征推断可能的类别和内容类型
            String category = inferCategory(strokeCount, coverageRatio, pointCount);
            String contentType = inferContentType(strokeCount, coverageRatio, pointCount);
            
            // 根据内容类型随机获取对应的内容
            Map<String, Object> recognizedContent = getContentByType(contentType);
            
            if (recognizedContent != null && !recognizedContent.isEmpty()) {
                result.put("recognized", true);
                result.put("category", category);
                result.put("contentType", contentType);
                result.put("confidence", calculateConfidence(strokeCount, coverageRatio));
                result.putAll(recognizedContent);
            } else {
                result.put("recognized", false);
                result.put("message", "未能识别出相关内容");
            }
            
        } catch (Exception e) {
            System.err.println("图像识别失败: " + e.getMessage());
            e.printStackTrace();
            result.put("recognized", false);
            result.put("message", "识别过程出现错误");
        }
        
        return result;
    }
    
    /**
     * 根据特征推断内容类型
     */
    private String inferContentType(int strokeCount, double coverageRatio, int pointCount) {
        // 使用随机但有权重的方式选择类型
        double random = Math.random();
        
        if (strokeCount < 15 && coverageRatio < 0.3) {
            // 简单线条 -> 更可能是人物或建筑
            return random < 0.6 ? "person" : "event";
        } else if (strokeCount >= 15 && strokeCount < 40 && coverageRatio < 0.5) {
            // 中等复杂度 -> 事件或建筑
            return random < 0.7 ? "event" : "person";
        } else if (coverageRatio >= 0.5) {
            // 高覆盖度 -> 更可能是场景或事件
            return random < 0.8 ? "event" : "person";
        } else {
            // 默认随机
            return random < 0.5 ? "person" : "event";
        }
    }
    
    /**
     * 根据类型获取对应内容
     */
    private Map<String, Object> getContentByType(String contentType) {
        Map<String, Object> content = new HashMap<>();
        
        if ("person".equals(contentType)) {
            Person person = personService.getRandomPerson();
            if (person != null) {
                content.put("type", "person");
                content.put("id", person.getPersonId());
                content.put("name", person.getName());
                content.put("title", person.getSubtitle());
                content.put("imageUrl", person.getImageUrl() != null ? person.getImageUrl() : "");
                content.put("description", "这是成都理工大学历史上的重要人物。");
                content.put("interpretation", generatePersonInterpretation(person));
            }
        } else if ("event".equals(contentType)) {
            HistoryEvent event = historyService.getRandomHistoryEvent();
            if (event != null) {
                content.put("type", "event");
                content.put("id", event.getEventId());
                content.put("name", event.getEventName());
                content.put("time", event.getEventTime());
                content.put("eventType", event.getEventType());
                content.put("imageUrl", event.getImageUrl() != null ? event.getImageUrl() : "");
                content.put("description", event.getDescription());
                content.put("interpretation", generateEventInterpretation(event));
            }
        }
        
        return content;
    }
    
    /**
     * 生成人物解释
     */
    private String generatePersonInterpretation(Person person) {
        String[] templates = {
            "您的画作让我联想到了%s。这位杰出人物为成理的发展做出了重要贡献。",
            "从您的创作中，我看到了与%s相似的特质。让我们一起了解这位成理先贤的故事。",
            "您的画作与%s有着奇妙的共鸣。%s在成理历史上留下了浓墨重彩的一笔。",
            "通过AI分析，您的作品让我想起了%s。这是一位值得铭记的成理人物。"
        };
        
        String template = templates[(int)(Math.random() * templates.length)];
        return String.format(template, person.getName(), person.getName());
    }
    
    /**
     * 生成事件解释
     */
    private String generateEventInterpretation(HistoryEvent event) {
        String[] templates = {
            "您的画作让我联想到了%s这个重要的历史时刻。这是成理发展历程中的关键节点。",
            "从您的创作中，我看到了与%s相关的元素。这段历史见证了成理的成长。",
            "您的画作与%s的历史场景有着奇妙的共鸣。让我们一起回顾这段历史。",
            "通过AI分析，我发现您的作品与%s这段历史有相似之处。这是成理历史上值得纪念的时刻。"
        };
        
        String template = templates[(int)(Math.random() * templates.length)];
        String eventIntro = event.getDescription() != null && event.getDescription().length() > 50 
            ? event.getDescription().substring(0, 50) + "..." 
            : (event.getDescription() != null ? event.getDescription() : "");
        
        return String.format(template, event.getEventName()) + eventIntro;
    }
    
    /**
     * 根据画作特征推断类别
     */
    private String inferCategory(int strokeCount, double coverageRatio, int pointCount) {
        if (strokeCount < 10 && coverageRatio < 0.3) {
            return "简笔画";
        } else if (strokeCount >= 10 && strokeCount < 30 && coverageRatio < 0.5) {
            return "线条画";
        } else if (coverageRatio >= 0.5 && strokeCount < 50) {
            return "填充画";
        } else if (strokeCount >= 50) {
            return "复杂画作";
        } else {
            return "创意画作";
        }
    }
    
    /**
     * 计算识别置信度
     */
    private int calculateConfidence(int strokeCount, double coverageRatio) {
        int baseConfidence = 60;
        
        // 笔画数贡献
        if (strokeCount >= 10 && strokeCount <= 50) {
            baseConfidence += 15;
        } else if (strokeCount > 5) {
            baseConfidence += 10;
        }
        
        // 覆盖度贡献
        if (coverageRatio >= 0.2 && coverageRatio <= 0.7) {
            baseConfidence += 15;
        } else if (coverageRatio > 0.1) {
            baseConfidence += 10;
        }
        
        return Math.min(95, baseConfidence);
    }
}
