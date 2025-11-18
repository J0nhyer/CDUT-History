package org.cdut.ai.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 历史大事记实体类
 */
@Data
public class HistoryEvent {
    private Long id;
    private String eventId;
    private String year;
    private String month;
    private String day;
    private String title;
    private String description;
    private String eventType;
    private String importance;
    private String imageUrl;
    private String source;
    private Integer needsVerification;
    private Integer sortOrder;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // JSON字段，前端需要解析
    private String tags;
    private String achievements;
    
    // 解析后的字段（供前端直接使用）
    private List<String> tagList;
    private List<String> achievementList;
}
