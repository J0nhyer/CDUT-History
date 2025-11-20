package org.cdut.ai.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.cdut.ai.mapper.HistoryMapper;
import org.cdut.ai.model.HistoryEvent;
import org.cdut.ai.model.HistoryPeriod;
import org.cdut.ai.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 历史数据服务实现类
 */
@Service
public class HistoryServiceImpl implements HistoryService {
    
    @Autowired
    private HistoryMapper historyMapper;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public List<HistoryEvent> getAllEvents() {
        return historyMapper.getAllEvents();
    }
    
    @Override
    public List<Map<String, Object>> getAllEventsWithParsedJson() {
        List<HistoryEvent> events = historyMapper.getAllEvents();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (HistoryEvent event : events) {
            Map<String, Object> eventMap = new HashMap<>();
            eventMap.put("id", event.getEventId());
            eventMap.put("year", event.getYear());
            eventMap.put("month", event.getMonth());
            eventMap.put("day", event.getDay());
            eventMap.put("title", event.getTitle());
            eventMap.put("description", event.getDescription());
            eventMap.put("type", event.getEventType());
            eventMap.put("importance", event.getImportance());
            eventMap.put("imageUrl", event.getImageUrl());
            eventMap.put("source", event.getSource());
            eventMap.put("sortOrder", event.getSortOrder());
            
            // 解析JSON字段
            try {
                if (event.getTags() != null && !event.getTags().isEmpty()) {
                    List<String> tags = objectMapper.readValue(event.getTags(), new TypeReference<List<String>>(){});
                    eventMap.put("tags", tags);
                } else {
                    eventMap.put("tags", new ArrayList<>());
                }
                
                if (event.getAchievements() != null && !event.getAchievements().isEmpty()) {
                    List<String> achievements = objectMapper.readValue(event.getAchievements(), new TypeReference<List<String>>(){});
                    eventMap.put("achievements", achievements);
                } else {
                    eventMap.put("achievements", new ArrayList<>());
                }
            } catch (Exception e) {
                eventMap.put("tags", new ArrayList<>());
                eventMap.put("achievements", new ArrayList<>());
            }
            
            result.add(eventMap);
        }
        
        return result;
    }
    
    @Override
    public HistoryEvent getEventById(String eventId) {
        return historyMapper.getEventById(eventId);
    }
    
    @Override
    public List<HistoryEvent> getEventsByType(String eventType) {
        return historyMapper.getEventsByType(eventType);
    }
    
    @Override
    public List<HistoryEvent> getEventsByImportance(String importance) {
        return historyMapper.getEventsByImportance(importance);
    }
    
    @Override
    public List<HistoryEvent> getEventsByYearRange(String startYear, String endYear) {
        return historyMapper.getEventsByYearRange(startYear, endYear);
    }
    
    @Override
    public List<HistoryPeriod> getAllPeriods() {
        return historyMapper.getAllPeriods();
    }
    
    @Override
    public List<Map<String, Object>> getAllPeriodsWithParsedJson() {
        List<HistoryPeriod> periods = historyMapper.getAllPeriods();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (HistoryPeriod period : periods) {
            Map<String, Object> periodMap = new HashMap<>();
            periodMap.put("id", period.getPeriodId());
            periodMap.put("yearRange", period.getYearRange());
            periodMap.put("title", period.getTitle());
            periodMap.put("subtitle", period.getSubtitle());
            periodMap.put("description", period.getDescription());
            periodMap.put("imageUrl", period.getImageUrl());
            periodMap.put("color", period.getColor());
            periodMap.put("sortOrder", period.getSortOrder());
            
            // 解析JSON字段
            try {
                if (period.getKeyEvents() != null && !period.getKeyEvents().isEmpty()) {
                    List<String> keyEvents = objectMapper.readValue(period.getKeyEvents(), new TypeReference<List<String>>(){});
                    periodMap.put("keyEvents", keyEvents);
                } else {
                    periodMap.put("keyEvents", new ArrayList<>());
                }
            } catch (Exception e) {
                periodMap.put("keyEvents", new ArrayList<>());
            }
            
            result.add(periodMap);
        }
        
        return result;
    }
    
    @Override
    public HistoryPeriod getPeriodById(String periodId) {
        return historyMapper.getPeriodById(periodId);
    }
    
    @Override
    public Map<String, Object> getCompleteTimelineData() {
        Map<String, Object> result = new HashMap<>();
        
        // 获取所有事件（带JSON解析）
        List<Map<String, Object>> events = getAllEventsWithParsedJson();
        result.put("events", events);
        result.put("eventsCount", events.size());
        
        // 获取所有时期（带JSON解析）
        List<Map<String, Object>> periods = getAllPeriodsWithParsedJson();
        result.put("periods", periods);
        result.put("periodsCount", periods.size());
        
        // 计算年份范围
        if (!events.isEmpty()) {
            String minYear = events.stream()
                .map(e -> (String) e.get("year"))
                .min(String::compareTo)
                .orElse("1956");
            String maxYear = events.stream()
                .map(e -> (String) e.get("year"))
                .max(String::compareTo)
                .orElse("2025");
            result.put("minYear", minYear);
            result.put("maxYear", maxYear);
        }
        
        return result;
    }
    
    @Override
    public HistoryEvent getRandomHistoryEvent() {
        List<HistoryEvent> allEvents = historyMapper.getAllEvents();
        if (allEvents == null || allEvents.isEmpty()) {
            return null;
        }
        int randomIndex = (int) (Math.random() * allEvents.size());
        return allEvents.get(randomIndex);
    }
}
