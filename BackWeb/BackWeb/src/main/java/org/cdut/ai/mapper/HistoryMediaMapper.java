package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.cdut.ai.model.HistoryMedia;

import java.util.List;

@Mapper
public interface HistoryMediaMapper extends BaseMapper<HistoryMedia> {
    /**
     * 根据mediaId查询媒体
     */
    HistoryMedia findByMediaId(@Param("mediaId") String mediaId);
    
    /**
     * 根据媒体类型查询
     */
    List<HistoryMedia> findByMediaType(@Param("mediaType") String mediaType);
    
    /**
     * 根据关联事件ID查询
     */
    List<HistoryMedia> findByRelatedEventId(@Param("relatedEventId") String relatedEventId);
    
    /**
     * 根据关联人物ID查询
     */
    List<HistoryMedia> findByRelatedPersonId(@Param("relatedPersonId") String relatedPersonId);
    
    /**
     * 根据关联建筑ID查询
     */
    List<HistoryMedia> findByRelatedBuildingId(@Param("relatedBuildingId") String relatedBuildingId);
    
    /**
     * 根据年份查询
     */
    List<HistoryMedia> findByYear(@Param("year") String year);
}

