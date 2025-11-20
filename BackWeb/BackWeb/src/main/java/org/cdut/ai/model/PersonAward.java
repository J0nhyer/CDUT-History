package org.cdut.ai.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 人物荣誉成就实体类
 */
@Data
@TableName("person_awards")
public class PersonAward {
    
    @TableId(value = "award_id", type = IdType.AUTO)
    private Integer awardId;
    
    @TableField("person_id")
    private String personId;
    
    @TableField("award_name")
    private String awardName;
    
    @TableField("award_type")
    private String awardType;
    
    @TableField("award_level")
    private String awardLevel;
    
    @TableField("award_year")
    private Integer awardYear;
    
    @TableField("award_date")
    private LocalDate awardDate;
    
    @TableField("awarding_organization")
    private String awardingOrganization;
    
    @TableField("award_description")
    private String awardDescription;
    
    @TableField("award_rank")
    private String awardRank;
    
    @TableField("is_major")
    private Boolean isMajor;
    
    @TableField("display_order")
    private Integer displayOrder;
    
    @TableField("needs_verification")
    private Boolean needsVerification;
    
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    @TableField("updated_at")
    private LocalDateTime updatedAt;
}
