package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.cdut.ai.model.AcademicMajor;

import java.util.List;

@Mapper
public interface AcademicMajorMapper extends BaseMapper<AcademicMajor> {
    /**
     * 根据nodeId查询专业列表
     */
    List<AcademicMajor> findByNodeId(@Param("nodeId") String nodeId);
    
    /**
     * 根据majorId查询专业
     */
    AcademicMajor findByMajorId(@Param("majorId") String majorId);
}

