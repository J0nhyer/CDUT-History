package org.cdut.ai.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 历史时期/阶段实体类
 */
@Data
public class HistoryPeriod {
    private Long id;
    private String periodId;
    private String yearRange;
    private String title;
    private String subtitle;
    private String description;
    private String imageUrl;
    private String color;
    private Integer sortOrder;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // JSON字段
    private String keyEvents;
    
    // 解析后的字段
    private List<String> keyEventList;
}
