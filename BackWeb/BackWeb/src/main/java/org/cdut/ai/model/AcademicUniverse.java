package org.cdut.ai.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("academic_universe")
public class AcademicUniverse {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String universityId;  // 大学唯一标识（如：cdut）
    private String name;          // 大学名称
    private String type;          // 类型：university
    private Double positionX;     // X坐标位置
    private Double positionY;     // Y坐标位置
    private Double positionZ;     // Z坐标位置
    private Double size;          // 大小
    private String description;   // 描述
    private String color;         // 颜色（十六进制，如：0xffaa00）
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

