package org.cdut.ai.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("person_relationship")
public class PersonRelationship {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("person_id")
    private String personId;  // 人物ID
    
    @TableField("related_person_id")
    private String relatedPersonId; // 关联人物ID（如果存在）
    
    @TableField("related_person_name")
    private String relatedPersonName; // 关联人物姓名
    
    @TableField("relation_type")
    private String relationType; // 关系类型：mentor/student/colleague/family等
    
    private String relation; // 关系描述（如：导师、学生、同事）
    private String description; // 关系详细描述
    
    @TableField("needs_verification")
    private Boolean needsVerification; // 是否需要验证
    
    @TableField("sort_order")
    private Integer sortOrder; // 排序顺序
    
    @TableField("created_at")
    private LocalDateTime createdAt;
}

