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
@TableName("academic_major")
public class AcademicMajor {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String nodeId;        // 节点ID（关联academic_node.node_id）
    private String majorId;        // 专业唯一标识（如：u03-m1）
    private String name;          // 专业名称
    private String level;          // 专业层次：本科/研究生/博士等
    private String color;         // 专业颜色（十六进制，可选）
    private String description;    // 专业描述
    private Integer sortOrder;     // 排序顺序
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

