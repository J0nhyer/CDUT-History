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
@TableName("person_biography")
public class PersonBiography {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("person_id")
    private String personId;  // 人物ID
    
    private String title;     // 章节标题
    
    @TableField(value = "content", jdbcType = org.apache.ibatis.type.JdbcType.LONGVARCHAR)
    private String content;   // 内容（支持HTML）
    
    @TableField(value = "tags", jdbcType = org.apache.ibatis.type.JdbcType.LONGVARCHAR)
    private String tags;      // 标签（JSON字符串）
    
    @TableField("media_type")
    private String mediaType; // 媒体类型：image/video/audio
    
    @TableField("media_url")
    private String mediaUrl;  // 媒体资源URL
    
    @TableField("needs_verification")
    private Boolean needsVerification; // 是否需要验证
    
    @TableField("sort_order")
    private Integer sortOrder; // 排序顺序
    
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    // 非数据库字段
    @TableField(exist = false)
    private List<String> tagsList;
}

