package org.cdut.ai.service;

import org.cdut.ai.model.HistoryEvent;
import org.cdut.ai.model.HistoryPeriod;

import java.util.List;
import java.util.Map;

/**
 * 历史数据服务接口
 */
public interface HistoryService {
    
    /**
     * 获取所有历史事件
     */
    List<HistoryEvent> getAllEvents();
    
    /**
     * 获取历史事件（带JSON解析）
     */
    List<Map<String, Object>> getAllEventsWithParsedJson();
    
    /**
     * 根据事件ID获取历史事件
     */
    HistoryEvent getEventById(String eventId);
    
    /**
     * 根据事件类型获取历史事件
     */
    List<HistoryEvent> getEventsByType(String eventType);
    
    /**
     * 根据重要性获取历史事件
     */
    List<HistoryEvent> getEventsByImportance(String importance);
    
    /**
     * 根据年份范围获取历史事件
     */
    List<HistoryEvent> getEventsByYearRange(String startYear, String endYear);
    
    /**
     * 获取所有历史时期
     */
    List<HistoryPeriod> getAllPeriods();
    
    /**
     * 获取历史时期（带JSON解析）
     */
    List<Map<String, Object>> getAllPeriodsWithParsedJson();
    
    /**
     * 根据时期ID获取历史时期
     */
    HistoryPeriod getPeriodById(String periodId);
    
    /**
     * 获取完整的历史时间轴数据（包含事件和时期）
     */
    Map<String, Object> getCompleteTimelineData();
}
