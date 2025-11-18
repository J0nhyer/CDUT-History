package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.cdut.ai.model.AcademicRelation;

import java.util.List;

@Mapper
public interface AcademicRelationMapper extends BaseMapper<AcademicRelation> {
    /**
     * 根据源节点ID查询关系列表
     */
    List<AcademicRelation> findBySourceNodeId(@Param("sourceNodeId") String sourceNodeId);
    
    /**
     * 根据目标节点ID查询关系列表
     */
    List<AcademicRelation> findByTargetNodeId(@Param("targetNodeId") String targetNodeId);
}

