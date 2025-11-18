package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.cdut.ai.model.CampusBuilding;

import java.util.List;

@Mapper
public interface CampusBuildingMapper extends BaseMapper<CampusBuilding> {
    /**
     * 根据buildingId查询建筑
     */
    CampusBuilding findByBuildingId(@Param("buildingId") String buildingId);
    
    /**
     * 根据建筑类型查询
     */
    List<CampusBuilding> findByBuildingType(@Param("buildingType") String buildingType);
    
    /**
     * 查询所有特殊建筑
     */
    List<CampusBuilding> findSpecialBuildings();
}

