package org.cdut.ai.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
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
@TableName("person_event")
public class PersonEvent {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("event_id")
    private String eventId;  // 事件唯一标识
    
    @TableField("person_id")
    private String personId;  // 人物ID
    
    @TableField("person_name")
    private String personName;  // 人物姓名
    
    private String year;     // 年份
    
    private String month;    // 月份（可选）
    
    private String day;      // 日期（可选）
    
    private String title;    // 事件标题
    
    private String description;  // 事件详细描述
    
    @TableField("event_category")
    private String eventCategory;  // 事件类别：birth/education/career/achievement/honor/death等
    
    private String importance;  // 重要性：high/medium/low
    
    @TableField("tags")
    private String tags;  // 标签（JSON字符串）
    
    @TableField("achievements")
    private String achievements;  // 相关成就（JSON字符串）
    
    @TableField("media_type")
    private String mediaType;  // 媒体类型：image/video/audio
    
    @TableField("media_url")
    private String mediaUrl;  // 媒体资源URL
    
    private String source;  // 来源
    
    @TableField("sort_order")
    private Integer sortOrder;  // 排序顺序
    
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    @TableField("updated_at")
    private LocalDateTime updatedAt;
    
    // 非数据库字段
    @TableField(exist = false)
    private List<String> tagsList;
    
    @TableField(exist = false)
    private List<String> achievementsList;
}
