package org.cdut.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.cdut.ai.model.*;
import org.cdut.ai.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 人物数据导入工具
 * 用于将前端JS文件中的数据导入到数据库
 */
@Tag(name = "人物数据导入")
@RestController
@RequestMapping("/api/person/import")
@CrossOrigin(allowCredentials = "false", originPatterns = "*", allowedHeaders = "*",
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class PersonImportController {

    @Autowired
    private PersonService personService;

    @Operation(summary = "导入单个人物数据")
    @PostMapping("/single")
    public Map<String, Object> importSinglePerson(@RequestBody Map<String, Object> personData) {
        Map<String, Object> result = new HashMap<>();
        try {
            Person person = convertToPerson(personData);
            boolean success = personService.saveOrUpdatePersonDetail(person);
            if (success) {
                result.put("success", true);
                result.put("message", "导入成功");
                result.put("personId", person.getPersonId());
            } else {
                result.put("success", false);
                result.put("message", "导入失败");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "导入失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Operation(summary = "批量导入人物数据")
    @PostMapping("/batch")
    public Map<String, Object> importBatchPersons(@RequestBody Map<String, Map<String, Object>> personsData) {
        Map<String, Object> result = new HashMap<>();
        List<String> successList = new ArrayList<>();
        List<String> failList = new ArrayList<>();
        
        try {
            for (Map.Entry<String, Map<String, Object>> entry : personsData.entrySet()) {
                try {
                    Person person = convertToPerson(entry.getValue());
                    boolean success = personService.saveOrUpdatePersonDetail(person);
                    if (success) {
                        successList.add(person.getPersonId());
                    } else {
                        failList.add(entry.getKey());
                    }
                } catch (Exception e) {
                    failList.add(entry.getKey() + ": " + e.getMessage());
                }
            }
            
            result.put("success", true);
            result.put("message", String.format("导入完成：成功 %d 条，失败 %d 条", successList.size(), failList.size()));
            result.put("successList", successList);
            result.put("failList", failList);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "批量导入失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 将前端JS数据格式转换为Person实体
     */
    @SuppressWarnings("unchecked")
    private Person convertToPerson(Map<String, Object> data) {
        Person person = new Person();
        
        // 基本信息
        person.setPersonId((String) data.get("id"));
        person.setName((String) data.get("name"));
        person.setSubtitle((String) data.get("subtitle"));
        
        // 图片URL（前端是import的图片对象，这里需要转换为URL路径）
        Object imageObj = data.get("image");
        if (imageObj != null) {
            // 如果是字符串，直接使用；如果是对象，可能需要特殊处理
            person.setImageUrl(imageObj.toString());
        }
        
        // 关键词标签
        List<String> keyTags = (List<String>) data.get("keyTags");
        person.setKeyTagsList(keyTags);
        
        // 数据状态
        person.setDataStatus((String) data.getOrDefault("dataStatus", "draft"));
        
        // 最后验证日期
        String lastVerified = (String) data.get("lastVerified");
        if (lastVerified != null && !lastVerified.isEmpty()) {
            try {
                person.setLastVerified(LocalDate.parse(lastVerified, DateTimeFormatter.ISO_DATE));
            } catch (Exception e) {
                // 解析失败，忽略
            }
        }
        
        // 生平
        List<Map<String, Object>> biographyData = (List<Map<String, Object>>) data.get("biography");
        if (biographyData != null) {
            List<PersonBiography> biography = new ArrayList<>();
            for (Map<String, Object> item : biographyData) {
                PersonBiography b = new PersonBiography();
                b.setTitle((String) item.get("title"));
                b.setContent((String) item.get("content"));
                b.setTagsList((List<String>) item.get("tags"));
                b.setMediaType((String) item.get("mediaType"));
                
                Object mediaUrlObj = item.get("mediaUrl");
                if (mediaUrlObj != null) {
                    b.setMediaUrl(mediaUrlObj.toString());
                }
                
                b.setNeedsVerification((Boolean) item.getOrDefault("needsVerification", false));
                biography.add(b);
            }
            person.setBiography(biography);
        }
        
        // 关系
        List<Map<String, Object>> relationshipsData = (List<Map<String, Object>>) data.get("relationships");
        if (relationshipsData != null) {
            List<PersonRelationship> relationships = new ArrayList<>();
            for (Map<String, Object> item : relationshipsData) {
                PersonRelationship r = new PersonRelationship();
                r.setRelatedPersonId((String) item.get("id"));
                r.setRelatedPersonName((String) item.get("name"));
                r.setRelationType((String) item.get("type"));
                r.setRelation((String) item.get("relation"));
                r.setDescription((String) item.get("description"));
                r.setNeedsVerification((Boolean) item.getOrDefault("needsVerification", false));
                relationships.add(r);
            }
            person.setRelationships(relationships);
        }
        
        return person;
    }
}

