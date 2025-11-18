package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.cdut.ai.model.AcademicUniverse;

@Mapper
public interface AcademicUniverseMapper extends BaseMapper<AcademicUniverse> {
    /**
     * 根据universityId查询
     */
    AcademicUniverse findByUniversityId(@Param("universityId") String universityId);
}

