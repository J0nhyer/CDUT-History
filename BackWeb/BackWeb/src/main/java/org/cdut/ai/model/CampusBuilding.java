package org.cdut.ai.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("campus_building")
public class CampusBuilding {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String buildingId;   // 建筑唯一标识
    private String name;         // 建筑名称（中文）
    private String nameEn;       // 建筑名称（英文）
    private BigDecimal positionX; // X坐标位置
    private BigDecimal positionZ; // Z坐标位置
    private BigDecimal width;     // 宽度
    private BigDecimal depth;     // 深度
    private BigDecimal height;    // 高度
    private String color;         // 颜色（十六进制）
    private String buildingType;  // 建筑类型
    private String emoji;         // 表情符号标识
    private String description;   // 建筑描述
    private Integer floors;       // 楼层数
    private String roofType;      // 屋顶类型
    private Boolean isSpecial;    // 是否特殊建筑
    private String imageUrl;       // 建筑图片URL
    private String history;        // 建筑历史（JSON格式）
    private Integer sortOrder;    // 排序顺序
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 非数据库字段
    private transient Map<String, Object> historyMap;
}

