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
@TableName("academic_node")
public class AcademicNode {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String nodeId;        // 节点唯一标识（如：u01）
    private String name;          // 节点名称
    private String type;          // 节点类型：small_star/lab/institute等
    private Double positionX;     // X坐标位置
    private Double positionY;      // Y坐标位置
    private Double positionZ;     // Z坐标位置
    private Double size;          // 大小
    private String color;         // 颜色（十六进制）
    private String title;          // 标题
    private String description;    // 描述
    private Double styleGlow;     // 发光强度（0-1.2）
    private Boolean styleRing;     // 是否有光环
    private String styleShape;     // 形状：sphere/hex/diamond/triangle等
    private Integer startYear;     // 起始年份（用于时间轴显示）
    private Integer sortOrder;     // 排序顺序
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 非数据库字段，用于返回完整数据
    private transient List<AcademicMajor> majors;
}

