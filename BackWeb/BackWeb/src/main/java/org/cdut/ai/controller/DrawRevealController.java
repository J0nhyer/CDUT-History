package org.cdut.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.cdut.ai.service.DrawRevealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 校史涂鸦画板控制器
 */
@Tag(name = "校史涂鸦画板")
@RestController
@RequestMapping("/api/draw-reveal")
@CrossOrigin(allowCredentials = "false", originPatterns = "*", allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class DrawRevealController {
    
    @Autowired
    private DrawRevealService drawRevealService;
    
    /**
     * 随机获取一个人物或历史事件
     */
    @Operation(summary = "随机获取人物或历史事件")
    @GetMapping("/random")
    public Map<String, Object> getRandomItem() {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> item = drawRevealService.getRandomItem();
            if (item != null && !item.isEmpty()) {
                result.put("success", true);
                result.put("data", item);
            } else {
                result.put("success", false);
                result.put("message", "暂无可用数据");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取随机内容失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * AI画作评分接口
     */
    @Operation(summary = "AI画作评分")
    @PostMapping("/score")
    public Map<String, Object> scoreDrawing(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> result = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> features = (Map<String, Object>) requestData.get("features");
            
            if (features == null) {
                result.put("success", false);
                result.put("message", "缺少画作特征数据");
                return result;
            }
            
            Map<String, Object> scoreData = drawRevealService.scoreDrawing(features);
            result.put("success", true);
            result.put("data", scoreData);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "评分失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * AI图像识别接口
     */
    @Operation(summary = "AI图像识别")
    @PostMapping("/recognize")
    public Map<String, Object> recognizeDrawing(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> result = new HashMap<>();
        try {
            String canvasData = (String) requestData.get("canvasData");
            
            if (canvasData == null || canvasData.isEmpty()) {
                result.put("success", false);
                result.put("message", "缺少画作数据");
                return result;
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> features = (Map<String, Object>) requestData.get("features");
            
            // 获取用户选择的模式（person或event）
            String drawMode = (String) requestData.get("drawMode");
            
            Map<String, Object> recognitionData = drawRevealService.recognizeDrawing(canvasData, features, drawMode);
            result.put("success", true);
            result.put("data", recognitionData);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "识别失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 测试接口
     */
    @Operation(summary = "测试接口")
    @GetMapping("/test")
    public Map<String, Object> test() {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "涂鸦画板接口连接正常");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
}
