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
@TableName("academic_relation")
public class AcademicRelation {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String sourceNodeId;   // 源节点ID（关联academic_node.node_id）
    private String targetNodeId;   // 目标节点ID（关联academic_node.node_id，可为空）
    private String targetName;     // 目标名称（如果target_node_id为空时使用）
    private String relationType;   // 关系类型
    private String description;     // 关系描述
    private Integer sortOrder;     // 排序顺序
    private LocalDateTime createdAt;
}

