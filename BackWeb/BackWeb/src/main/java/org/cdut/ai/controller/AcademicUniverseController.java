package org.cdut.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.cdut.ai.model.AcademicNode;
import org.cdut.ai.model.AcademicUniverse;
import org.cdut.ai.service.AcademicUniverseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "学术星图管理")
@RestController
@RequestMapping("/api/academic-universe")
@CrossOrigin(allowCredentials = "false", originPatterns = "*", allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AcademicUniverseController {

    @Autowired
    private AcademicUniverseService academicUniverseService;

    @Operation(summary = "获取完整的学术星图数据")
    @GetMapping("/data")
    public Map<String, Object> getUniverseData() {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> data = academicUniverseService.getUniverseData();
            result.put("success", true);
            result.put("data", data);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取数据失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "获取大学信息")
    @GetMapping("/university")
    public Map<String, Object> getUniversity() {
        Map<String, Object> result = new HashMap<>();
        try {
            AcademicUniverse university = academicUniverseService.getUniversity();
            result.put("success", true);
            result.put("data", university);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取大学信息失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "保存或更新大学信息")
    @PostMapping("/university")
    public Map<String, Object> saveOrUpdateUniversity(@RequestBody AcademicUniverse university) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = academicUniverseService.saveOrUpdateUniversity(university);
            result.put("success", success);
            result.put("message", success ? "保存成功" : "保存失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "保存失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "获取所有节点")
    @GetMapping("/nodes")
    public Map<String, Object> getAllNodes() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<AcademicNode> nodes = academicUniverseService.getAllNodes();
            result.put("success", true);
            result.put("data", nodes);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取节点列表失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
    
    @Operation(summary = "获取所有专业")
    @GetMapping("/majors")
    public List<org.cdut.ai.model.AcademicMajor> getAllMajors() {
        return academicUniverseService.getAllMajors();
    }

    @Operation(summary = "根据nodeId获取节点详情")
    @GetMapping("/nodes/{nodeId}")
    public Map<String, Object> getNodeDetail(@PathVariable String nodeId) {
        Map<String, Object> result = new HashMap<>();
        try {
            AcademicNode node = academicUniverseService.getNodeDetail(nodeId);
            if (node != null) {
                result.put("success", true);
                result.put("data", node);
            } else {
                result.put("success", false);
                result.put("message", "节点不存在");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取节点详情失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "保存或更新节点")
    @PostMapping("/nodes")
    public Map<String, Object> saveOrUpdateNode(@RequestBody AcademicNode node) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = academicUniverseService.saveOrUpdateNode(node);
            result.put("success", success);
            result.put("message", success ? "保存成功" : "保存失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "保存失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "删除节点")
    @DeleteMapping("/nodes/{nodeId}")
    public Map<String, Object> deleteNode(@PathVariable String nodeId) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = academicUniverseService.deleteNode(nodeId);
            result.put("success", success);
            result.put("message", success ? "删除成功" : "删除失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "删除失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "保存或更新完整的学术星图数据（批量导入）")
    @PostMapping("/data")
    public Map<String, Object> saveOrUpdateUniverseData(@RequestBody Map<String, Object> universeData) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = academicUniverseService.saveOrUpdateUniverseData(universeData);
            result.put("success", success);
            result.put("message", success ? "保存成功" : "保存失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "保存失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
}

