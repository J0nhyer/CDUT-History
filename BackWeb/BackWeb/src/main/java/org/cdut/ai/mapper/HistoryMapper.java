package org.cdut.ai.mapper;

import org.apache.ibatis.annotations.*;
import org.cdut.ai.model.HistoryEvent;
import org.cdut.ai.model.HistoryPeriod;

import java.util.List;

/**
 * 历史数据Mapper接口
 */
@Mapper
public interface HistoryMapper {
    
    // ==================== 历史事件相关 ====================
    
    /**
     * 获取所有历史事件（按年份排序）
     */
    @Select("SELECT * FROM history_event ORDER BY year ASC, sort_order ASC")
    List<HistoryEvent> getAllEvents();
    
    /**
     * 根据事件ID获取历史事件
     */
    @Select("SELECT * FROM history_event WHERE event_id = #{eventId}")
    HistoryEvent getEventById(@Param("eventId") String eventId);
    
    /**
     * 根据事件类型获取历史事件
     */
    @Select("SELECT * FROM history_event WHERE event_type = #{eventType} ORDER BY year ASC")
    List<HistoryEvent> getEventsByType(@Param("eventType") String eventType);
    
    /**
     * 根据重要性获取历史事件
     */
    @Select("SELECT * FROM history_event WHERE importance = #{importance} ORDER BY year ASC")
    List<HistoryEvent> getEventsByImportance(@Param("importance") String importance);
    
    /**
     * 根据年份范围获取历史事件
     */
    @Select("SELECT * FROM history_event WHERE year BETWEEN #{startYear} AND #{endYear} ORDER BY year ASC")
    List<HistoryEvent> getEventsByYearRange(@Param("startYear") String startYear, @Param("endYear") String endYear);
    
    // ==================== 历史时期相关 ====================
    
    /**
     * 获取所有历史时期（按排序顺序）
     */
    @Select("SELECT * FROM history_period ORDER BY sort_order ASC")
    List<HistoryPeriod> getAllPeriods();
    
    /**
     * 根据时期ID获取历史时期
     */
    @Select("SELECT * FROM history_period WHERE period_id = #{periodId}")
    HistoryPeriod getPeriodById(@Param("periodId") String periodId);
    
    /**
     * 插入历史事件
     */
    @Insert("INSERT INTO history_event (event_id, year, month, day, title, description, event_type, importance, tags, achievements, image_url, source, sort_order) " +
            "VALUES (#{eventId}, #{year}, #{month}, #{day}, #{title}, #{description}, #{eventType}, #{importance}, #{tags}, #{achievements}, #{imageUrl}, #{source}, #{sortOrder})")
    int insertEvent(HistoryEvent event);
    
    /**
     * 更新历史事件
     */
    @Update("UPDATE history_event SET year=#{year}, month=#{month}, day=#{day}, title=#{title}, description=#{description}, " +
            "event_type=#{eventType}, importance=#{importance}, tags=#{tags}, achievements=#{achievements}, " +
            "image_url=#{imageUrl}, source=#{source}, sort_order=#{sortOrder} WHERE event_id=#{eventId}")
    int updateEvent(HistoryEvent event);
    
    /**
     * 删除历史事件
     */
    @Delete("DELETE FROM history_event WHERE event_id = #{eventId}")
    int deleteEvent(@Param("eventId") String eventId);
}
