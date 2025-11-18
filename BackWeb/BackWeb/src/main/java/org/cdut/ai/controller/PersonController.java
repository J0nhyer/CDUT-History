package org.cdut.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.cdut.ai.model.Person;
import org.cdut.ai.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "人物管理")
@RestController
@RequestMapping("/api/person")
@CrossOrigin(allowCredentials = "false", originPatterns = "*", allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class PersonController {

    @Autowired
    private PersonService personService;

    @Operation(summary = "获取所有人物列表")
    @GetMapping("/list")
    public Map<String, Object> getAllPersons() {
        Map<String, Object> result = new HashMap<>();
        List<Person> persons = personService.getAllPersons();
        result.put("success", true);
        result.put("data", persons);
        result.put("total", persons.size());
        return result;
    }

    @Operation(summary = "获取所有人物的完整展示数据")
    @GetMapping("/advanced")
    public Map<String, Object> getAllAdvancedPersons() {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> data = personService.getAllAdvancedProfiles();
        result.put("success", true);
        result.put("data", data);
        result.put("total", data.size());
        return result;
    }

    @Operation(summary = "获取指定人物的完整展示数据")
    @GetMapping("/{personId}/advanced")
    public Map<String, Object> getAdvancedPerson(@PathVariable String personId) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> data = personService.getAdvancedProfile(personId);
        if (data != null) {
            result.put("success", true);
            result.put("data", data);
        } else {
            result.put("success", true);
            result.put("data", new HashMap<>());
            result.put("message", "未找到该人物的展示数据");
        }
        return result;
    }

    @Operation(summary = "根据ID获取人物详情")
    @GetMapping("/{personId}")
    public Map<String, Object> getPersonDetail(@PathVariable String personId) {
        Map<String, Object> result = new HashMap<>();
        Person person = personService.getPersonDetail(personId);
        if (person != null) {
            result.put("success", true);
            result.put("data", person);
        } else {
            result.put("success", true);
            result.put("data", null);
            result.put("message", "未找到该人物");
        }
        return result;
    }

    @Operation(summary = "根据姓名搜索人物")
    @GetMapping("/search")
    public Map<String, Object> searchByName(@RequestParam String name) {
        Map<String, Object> result = new HashMap<>();
        List<Person> persons = personService.searchByName(name);
        result.put("success", true);
        result.put("data", persons);
        result.put("total", persons.size());
        return result;
    }

    @Operation(summary = "根据数据状态查询人物")
    @GetMapping("/status/{dataStatus}")
    public Map<String, Object> getPersonsByStatus(@PathVariable String dataStatus) {
        Map<String, Object> result = new HashMap<>();
        List<Person> persons = personService.getPersonsByStatus(dataStatus);
        result.put("success", true);
        result.put("data", persons);
        result.put("total", persons.size());
        return result;
    }

    @Operation(summary = "创建或更新人物信息")
    @PostMapping("/save")
    public Map<String, Object> saveOrUpdatePerson(@RequestBody Person person) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (person.getPersonId() == null || person.getPersonId().isEmpty()) {
                result.put("success", false);
                result.put("message", "人物ID不能为空");
                return result;
            }
            
            boolean success = personService.saveOrUpdatePersonDetail(person);
            if (success) {
                result.put("success", true);
                result.put("message", "保存成功");
                result.put("data", personService.getPersonDetail(person.getPersonId()));
            } else {
                result.put("success", false);
                result.put("message", "保存失败");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "保存失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "更新人物信息")
    @PutMapping("/{personId}")
    public Map<String, Object> updatePerson(@PathVariable String personId, @RequestBody Person person) {
        Map<String, Object> result = new HashMap<>();
        try {
            person.setPersonId(personId);
            boolean success = personService.saveOrUpdatePersonDetail(person);
            if (success) {
                result.put("success", true);
                result.put("message", "更新成功");
                result.put("data", personService.getPersonDetail(personId));
            } else {
                result.put("success", false);
                result.put("message", "更新失败");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "删除人物")
    @DeleteMapping("/{personId}")
    public Map<String, Object> deletePerson(@PathVariable String personId) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = personService.deletePerson(personId);
            if (success) {
                result.put("success", true);
                result.put("message", "删除成功");
            } else {
                result.put("success", false);
                result.put("message", "删除失败，人物不存在");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "删除失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "测试接口")
    @GetMapping("/test")
    public Map<String, Object> test() {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "人物管理接口连接正常");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
    
    @Operation(summary = "调试接口 - 测试数据库查询")
    @GetMapping("/debug/{personId}")
    public Map<String, Object> debugPerson(@PathVariable String personId) {
        Map<String, Object> result = new HashMap<>();
        try {
            System.out.println("=== DEBUG API 开始 ===");
            System.out.println("查询人物ID: " + personId);
            
            Person person = personService.getPersonDetail(personId);
            
            if (person == null) {
                System.out.println("ERROR: 未找到人物");
                result.put("success", false);
                result.put("message", "未找到人物");
            } else {
                System.out.println("SUCCESS: 找到人物 - " + person.getName());
                System.out.println("Biography数量: " + (person.getBiography() != null ? person.getBiography().size() : 0));
                System.out.println("Relationships数量: " + (person.getRelationships() != null ? person.getRelationships().size() : 0));
                
                result.put("success", true);
                result.put("personId", person.getPersonId());
                result.put("name", person.getName());
                result.put("biographyCount", person.getBiography() != null ? person.getBiography().size() : 0);
                result.put("relationshipsCount", person.getRelationships() != null ? person.getRelationships().size() : 0);
            }
            
        } catch (Exception e) {
            System.err.println("ERROR: 异常发生");
            e.printStackTrace();
            result.put("success", false);
            result.put("error", e.getClass().getName());
            result.put("message", e.getMessage());
        }
        
        System.out.println("=== DEBUG API 结束 ===");
        return result;
    }
}
