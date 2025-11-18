package org.cdut.ai.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("person")
public class Person {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("person_id")
    private String personId;  // 人物唯一标识（如：liubaojun）
    
    private String name;      // 姓名
    private String subtitle;  // 副标题/职位
    
    @TableField("image_url")
    private String imageUrl;  // 头像图片路径
    
    @TableField(value = "key_tags", jdbcType = org.apache.ibatis.type.JdbcType.LONGVARCHAR)
    private String keyTags;   // 关键词标签（JSON字符串，前端解析为数组）
    
    @TableField("data_status")
    private String dataStatus; // 数据状态：completed/pending/draft
    
    @TableField("last_verified")
    private LocalDate lastVerified; // 最后验证日期
    
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    @TableField("updated_at")
    private LocalDateTime updatedAt;
    
    // 非数据库字段，用于返回完整数据
    @TableField(exist = false)
    private List<String> keyTagsList;
    
    @TableField(exist = false)
    private List<PersonBiography> biography;
    
    @TableField(exist = false)
    private List<PersonRelationship> relationships;
}

