package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.cdut.ai.model.AcademicNode;

import java.util.List;

@Mapper
public interface AcademicNodeMapper extends BaseMapper<AcademicNode> {
    /**
     * 根据nodeId查询节点
     */
    AcademicNode findByNodeId(@Param("nodeId") String nodeId);
    
    /**
     * 根据类型查询节点列表
     */
    List<AcademicNode> findByType(@Param("type") String type);
    
    /**
     * 查询所有节点（按排序顺序）
     */
    List<AcademicNode> findAllOrderBySortOrder();
}

