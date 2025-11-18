package org.cdut.ai.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("history_media")
public class HistoryMedia {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String mediaId;      // 媒体唯一标识
    private String mediaType;    // 媒体类型
    private String title;        // 标题
    private String url;          // 资源URL
    private String thumbnailUrl; // 缩略图URL
    private String description;  // 描述
    private String relatedEventId; // 关联事件ID
    private String relatedPersonId; // 关联人物ID
    private String relatedBuildingId; // 关联建筑ID
    private String year;         // 年份
    private String source;       // 来源
    private String tags;         // 标签（JSON字符串）
    private Integer sortOrder;   // 排序顺序
    private LocalDateTime createdAt;
    
    // 非数据库字段
    private transient List<String> tagsList;
}

