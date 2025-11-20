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
        return "未知";
    }
    
    /**
     * 从人物数据中提取领域信息
     */
    private String extractField(Person person) {
        if (person.getKeyTagsList() != null && !person.getKeyTagsList().isEmpty()) {
            // 查找学科领域标签
            for (String tag : person.getKeyTagsList()) {
                if (tag.equals("地质学") || tag.equals("工程学") || tag.equals("石油") ||
                    tag.equals("环境") || tag.equals("经济") || tag.equals("法律") ||
                    tag.equals("艺术") || tag.equals("计算机")) {
                    return tag;
                }
            }
        }
        return "其他";
    }
    
    /**
     * 对画作进行评分（公开接口）
     */
    public Map<String, Object> scoreDrawing(Map<String, Object> features) {
        return calculateQualityScore(features);
    }
    
    /**
     * 计算画作质量评分
     */
    private Map<String, Object> calculateQualityScore(Map<String, Object> features) {
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
     * 
     * 当前识别逻辑：
     * 1. 如果用户明确选择了模式，直接返回对应类型
     * 2. 否则根据笔画特征智能推断
     * 3. 从数据库随机返回对应类型的内容
     * 
     * 注意：所有识别结果均来自数据库中已整理的人物和事件数据
     * 
     * @param canvasData 画布图片数据
     * @param features 画作特征
     * @param drawMode 用户选择的模式（person或event，可为null）
     * @return 识别结果
     */
    public Map<String, Object> recognizeDrawing(String canvasData, Map<String, Object> features, String drawMode) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            System.out.println("\n========== 开始AI识别 ==========");
            System.out.println("🔧 用户选择模式: " + (drawMode != null ? drawMode : "未选择（智能推断）"));
            
            // 基于画作特征进行智能匹配
            int strokeCount = getIntValue(features, "strokeCount");
            double coverageRatio = getDoubleValue(features, "coverageRatio");
            int pointCount = getIntValue(features, "pointCount");
            
            // 根据特征推断可能的类别和内容类型
            String category = inferCategory(strokeCount, coverageRatio, pointCount);
            String contentType;
            
            // 如果用户明确选择了模式，优先使用用户选择
            if (drawMode != null && (drawMode.equals("person") || drawMode.equals("event"))) {
                contentType = drawMode;
                System.out.println("✅ 使用用户选择的模式: " + contentType);
            } else {
                contentType = inferContentType(strokeCount, coverageRatio, pointCount);
                System.out.println("🤖 智能推断模式: " + contentType);
            }
            
            System.out.println("🎯 识别类别: " + category);
            System.out.println("📦 内容类型: " + contentType);
            
            // 从数据库中获取对应类型的内容（人物或事件）
            Map<String, Object> recognizedContent = getContentByType(contentType);
            
            // 验证返回的内容是否来自数据库
            if (recognizedContent != null && !recognizedContent.isEmpty() && isValidDatabaseContent(recognizedContent)) {
                result.put("recognized", true);
                result.put("category", category);
                result.put("contentType", contentType);
                result.put("confidence", calculateConfidence(strokeCount, coverageRatio));
                result.put("dataSource", "数据库");  // 明确标注数据来源
                result.putAll(recognizedContent);
                
                System.out.println("✅ 识别成功: " + recognizedContent.get("name"));
                System.out.println("========== 识别完成 ==========\n");
            } else {
                result.put("recognized", false);
                result.put("message", "数据库中暂无匹配的人物或事件");
                System.out.println("❌ 识别失败: 数据库无匹配内容");
                System.out.println("========== 识别完成 ==========\n");
            }
            
        } catch (Exception e) {
            System.err.println("❌ 图像识别失败: " + e.getMessage());
            e.printStackTrace();
            result.put("recognized", false);
            result.put("message", "识别过程出现错误");
        }
        
        return result;
    }
    
    /**
     * 验证内容是否来自数据库
     * @param content 识别的内容
     * @return 是否有效
     */
    private boolean isValidDatabaseContent(Map<String, Object> content) {
        if (content == null || content.isEmpty()) {
            return false;
        }
        
        // 验证人物数据
        if ("person".equals(content.get("type"))) {
            return content.containsKey("id") && content.get("id") != null 
                && content.containsKey("name") && content.get("name") != null;
        }
        
        // 验证事件数据
        if ("event".equals(content.get("type"))) {
            return content.containsKey("id") && content.get("id") != null 
                && content.containsKey("name") && content.get("name") != null;
        }
        
        return false;
    }
    
    /**
     * 根据特征推断内容类型
     * 优化逻辑：平衡人物和事件识别
     */
    private String inferContentType(int strokeCount, double coverageRatio, int pointCount) {
        System.out.println("📊 笔画分析: strokeCount=" + strokeCount + ", coverageRatio=" + coverageRatio + ", pointCount=" + pointCount);
        
        // 计算笔画密度（点数/笔画数）
        double strokeDensity = strokeCount > 0 ? (double) pointCount / strokeCount : 0;
        
        // 识别事件图画特征（优先判断）
        if (strokeCount >= 10 && coverageRatio >= 0.3) {
            // 复杂图形 -> 更可能是场景或事件
            System.out.println("  ✓ 检测到事件图画特征：笔画多，覆盖率高（像是在画场景）");
            System.out.println("  → 推断为：事件图画，返回event类型");
            return "event";
        }
        
        if (coverageRatio >= 0.4) {
            // 高覆盖率 -> 图画而非文字
            System.out.println("  ✓ 检测到图画特征：覆盖率高（绘画痕迹明显）");
            System.out.println("  → 推断为：图画场景，返回event类型");
            return "event";
        }
        
        // 识别人名书写的特征
        if (strokeCount <= 10 && coverageRatio < 0.25 && pointCount > 50 && pointCount < 500) {
            // 低覆盖率 + 少笔画 + 中等点数（书写文字的特征）
            System.out.println("  ✓ 检测到人名书写特征：笔画少，覆盖率低，点数适中（书写痕迹）");
            System.out.println("  → 推断为：人名书写，返回person类型");
            return "person";
        }
        
        // 其他情况的智能推断
        if (strokeCount < 5 && coverageRatio < 0.2) {
            // 极简笔画 -> 可能是符号或简单文字
            System.out.println("  → 推断为：简单笔画，倾向person类型");
            return "person";
        } else {
            // 默认随机分配（50%概率各半，增加事件展示机会）
            double random = Math.random();
            String result = random < 0.5 ? "person" : "event";
            System.out.println("  → 推断为：默认逻辑，返回" + result + "类型（随机）");
            return result;
        }
    }
    
    /**
     * 从数据库获取对应类型的内容
     * 严格验证：所有数据必须来自person表或history_event表
     */
    private Map<String, Object> getContentByType(String contentType) {
        Map<String, Object> content = new HashMap<>();
        
        try {
            if ("person".equals(contentType)) {
                // 从数据库随机获取一个人物
                Person person = personService.getRandomPerson();
                if (person == null || person.getPersonId() == null || person.getName() == null) {
                    System.err.println("❌ 错误：数据库person表中没有有效数据");
                    return content;
                }
                
                // 严格验证：必须有person_id和name
                System.out.println("✓ 从person表获取: name=" + person.getName() + ", person_id=" + person.getPersonId());
                
                // 获取并验证图片路径
                String imageUrl = person.getImageUrl() != null ? person.getImageUrl() : "";
                if (imageUrl != null && !imageUrl.isEmpty()) {
                    System.out.println("  └─ 图片路径(来自person.image_url): " + imageUrl);
                } else {
                    System.out.println("  └─ ⚠️  person.image_url字段为空，无图片");
                }
                
                content.put("type", "person");
                content.put("id", person.getPersonId());  // 使用person_id作为唯一标识
                content.put("name", person.getName());
                content.put("title", person.getSubtitle() != null ? person.getSubtitle() : "");
                content.put("imageUrl", imageUrl);  // 图片路径来自数据库person.image_url字段
                content.put("description", "数据来源：person表 (person_id=" + person.getPersonId() + ")");
                content.put("interpretation", generatePersonInterpretation(person));
                content.put("dbSource", "person");  // 标记数据库来源
                
            } else if ("event".equals(contentType)) {
                // 从数据库随机获取一个历史事件
                HistoryEvent event = historyService.getRandomHistoryEvent();
                if (event == null || event.getEventId() == null || event.getTitle() == null) {
                    System.err.println("❌ 错误：数据库history_event表中没有有效数据");
                    return content;
                }
                
                System.out.println("✓ 从history_event表获取: title=" + event.getTitle() + ", event_id=" + event.getEventId());
                
                // 获取并验证图片路径
                String eventImageUrl = event.getImageUrl() != null ? event.getImageUrl() : "";
                if (eventImageUrl != null && !eventImageUrl.isEmpty()) {
                    System.out.println("  └─ 图片路径(来自history_event.image_url): " + eventImageUrl);
                } else {
                    System.out.println("  └─ ⚠️  history_event.image_url字段为空，无图片");
                }
                
                content.put("type", "event");
                content.put("id", event.getEventId());
                content.put("name", event.getTitle());
                
                // 组合时间字符串
                String eventTime = event.getYear();
                if (event.getMonth() != null && !event.getMonth().isEmpty()) {
                    eventTime += "-" + event.getMonth();
                    if (event.getDay() != null && !event.getDay().isEmpty()) {
                        eventTime += "-" + event.getDay();
                    }
                }
                content.put("time", eventTime);
                
                content.put("eventType", event.getEventType());
                content.put("imageUrl", eventImageUrl);  // 图片路径来自数据库history_event.image_url字段
                content.put("description", event.getDescription());
                content.put("interpretation", generateEventInterpretation(event));
                content.put("dbSource", "history_event");  // 标记数据库来源
            }
        } catch (Exception e) {
            System.err.println("❌ 数据库查询异常: " + e.getMessage());
            e.printStackTrace();
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
        
        return String.format(template, event.getTitle()) + eventIntro;
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
