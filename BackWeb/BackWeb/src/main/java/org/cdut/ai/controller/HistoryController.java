package org.cdut.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.cdut.ai.model.HistoryEvent;
import org.cdut.ai.model.HistoryPeriod;
import org.cdut.ai.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 历史数据控制器
 */
@Tag(name = "成理历史管理")
@RestController
@RequestMapping("/api/history")
@CrossOrigin(allowCredentials = "false", originPatterns = "*", allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class HistoryController {
    
    @Autowired
    private HistoryService historyService;
    
    /**
     * 获取所有历史事件
     */
    @Operation(summary = "获取所有历史事件")
    @GetMapping("/events")
    public Map<String, Object> getAllEvents() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Map<String, Object>> events = historyService.getAllEventsWithParsedJson();
            result.put("success", true);
            result.put("data", events);
            result.put("total", events.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取历史事件失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 根据事件ID获取历史事件详情
     */
    @Operation(summary = "获取历史事件详情")
    @GetMapping("/events/{eventId}")
    public Map<String, Object> getEventById(@PathVariable String eventId) {
        Map<String, Object> result = new HashMap<>();
        try {
            HistoryEvent event = historyService.getEventById(eventId);
            if (event != null) {
                result.put("success", true);
                result.put("data", event);
            } else {
                result.put("success", false);
                result.put("message", "未找到该历史事件");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取历史事件失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 根据事件类型获取历史事件
     */
    @Operation(summary = "根据类型获取历史事件")
    @GetMapping("/events/type/{eventType}")
    public Map<String, Object> getEventsByType(@PathVariable String eventType) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<HistoryEvent> events = historyService.getEventsByType(eventType);
            result.put("success", true);
            result.put("data", events);
            result.put("total", events.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取历史事件失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 根据重要性获取历史事件
     */
    @Operation(summary = "根据重要性获取历史事件")
    @GetMapping("/events/importance/{importance}")
    public Map<String, Object> getEventsByImportance(@PathVariable String importance) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<HistoryEvent> events = historyService.getEventsByImportance(importance);
            result.put("success", true);
            result.put("data", events);
            result.put("total", events.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取历史事件失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 获取所有历史时期
     */
    @Operation(summary = "获取所有历史时期")
    @GetMapping("/periods")
    public Map<String, Object> getAllPeriods() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Map<String, Object>> periods = historyService.getAllPeriodsWithParsedJson();
            result.put("success", true);
            result.put("data", periods);
            result.put("total", periods.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取历史时期失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 根据时期ID获取历史时期详情
     */
    @Operation(summary = "获取历史时期详情")
    @GetMapping("/periods/{periodId}")
    public Map<String, Object> getPeriodById(@PathVariable String periodId) {
        Map<String, Object> result = new HashMap<>();
        try {
            HistoryPeriod period = historyService.getPeriodById(periodId);
            if (period != null) {
                result.put("success", true);
                result.put("data", period);
            } else {
                result.put("success", false);
                result.put("message", "未找到该历史时期");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取历史时期失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 获取完整的历史时间轴数据（包含事件和时期）
     */
    @Operation(summary = "获取完整的历史时间轴数据")
    @GetMapping("/timeline")
    public Map<String, Object> getCompleteTimeline() {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> timelineData = historyService.getCompleteTimelineData();
            result.put("success", true);
            result.put("data", timelineData);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取历史时间轴数据失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 获取历史时钟展示用的事件（高重要性事件）
     */
    @Operation(summary = "获取历史时钟展示事件")
    @GetMapping("/clock-events")
    public Map<String, Object> getClockEvents() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<HistoryEvent> events = historyService.getEventsByImportance("high");
            result.put("success", true);
            result.put("data", events);
            result.put("total", events.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取历史时钟事件失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
}
