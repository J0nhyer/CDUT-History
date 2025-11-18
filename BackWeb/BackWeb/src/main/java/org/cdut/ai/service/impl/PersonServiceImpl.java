package org.cdut.ai.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.cdut.ai.mapper.PersonBiographyMapper;
import org.cdut.ai.mapper.PersonMapper;
import org.cdut.ai.mapper.PersonRelationshipMapper;
import org.cdut.ai.model.Person;
import org.cdut.ai.model.PersonBiography;
import org.cdut.ai.model.PersonRelationship;
import org.cdut.ai.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PersonServiceImpl extends ServiceImpl<PersonMapper, Person> implements PersonService {

    @Autowired
    private PersonMapper personMapper;
    
    @Autowired
    private PersonBiographyMapper biographyMapper;
    
    @Autowired
    private PersonRelationshipMapper relationshipMapper;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Person getPersonDetail(String personId) {
        // 查询基本信息
        Person person = personMapper.findByPersonId(personId);
        if (person == null) {
            return null;
        }
        
        // 填充关联数据
        fillPersonDetails(person);
        
        return person;
    }

    @Override
    public List<Person> getAllPersons() {
        List<Person> persons = list();
        // 解析keyTags JSON字符串为List
        persons.forEach(this::parseKeyTags);
        return persons;
    }

    @Override
    public List<Person> searchByName(String name) {
        List<Person> persons = personMapper.findByNameLike(name);
        persons.forEach(this::parseKeyTags);
        return persons;
    }

    @Override
    public List<Person> getPersonsByStatus(String dataStatus) {
        List<Person> persons = personMapper.findByDataStatus(dataStatus);
        persons.forEach(this::parseKeyTags);
        return persons;
    }

    @Override
    @Transactional
    public boolean saveOrUpdatePersonDetail(Person person) {
        try {
            // 1. 保存或更新基本信息
            Person existing = personMapper.findByPersonId(person.getPersonId());
            
            // 转换keyTags List为JSON字符串
            if (person.getKeyTagsList() != null) {
                person.setKeyTags(objectMapper.writeValueAsString(person.getKeyTagsList()));
            }
            
            if (existing != null) {
                person.setId(existing.getId());
                updateById(person);
            } else {
                save(person);
            }
            
            // 2. 删除旧的关联数据
            deleteRelatedData(person.getPersonId());
            
            // 3. 保存生平
            if (person.getBiography() != null) {
                for (int i = 0; i < person.getBiography().size(); i++) {
                    PersonBiography biography = person.getBiography().get(i);
                    biography.setPersonId(person.getPersonId());
                    if (biography.getTagsList() != null) {
                        biography.setTags(objectMapper.writeValueAsString(biography.getTagsList()));
                    }
                    biography.setSortOrder(i);
                    biographyMapper.insert(biography);
                }
            }
            
            // 4. 保存关系
            if (person.getRelationships() != null) {
                for (int i = 0; i < person.getRelationships().size(); i++) {
                    PersonRelationship relationship = person.getRelationships().get(i);
                    relationship.setPersonId(person.getPersonId());
                    relationship.setSortOrder(i);
                    relationshipMapper.insert(relationship);
                }
            }
            
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public boolean deletePerson(String personId) {
        // 删除关联数据（外键会自动级联删除，但为了安全还是显式删除）
        deleteRelatedData(personId);
        
        // 删除主记录
        Person person = personMapper.findByPersonId(personId);
        if (person != null) {
            return removeById(person.getId());
        }
        return false;
    }
    
    /**
     * 填充人物的所有关联数据
     */
    private void fillPersonDetails(Person person) {
        String personId = person.getPersonId();
        
        System.out.println(">>> [DEBUG] fillPersonDetails - 开始处理: " + personId);
        
        // 解析keyTags
        parseKeyTags(person);
        
        try {
            System.out.println(">>> [DEBUG] 查询biography表...");
            // 查询生平
            List<PersonBiography> biography = biographyMapper.selectList(
                new LambdaQueryWrapper<PersonBiography>()
                    .eq(PersonBiography::getPersonId, personId)
                    .orderByAsc(PersonBiography::getSortOrder)
            );
            System.out.println(">>> [DEBUG] biography查询成功，记录数: " + biography.size());
            biography.forEach(this::parseBiographyTags);
            person.setBiography(biography);
        } catch (Exception e) {
            System.err.println(">>> [ERROR] 查询生平数据失败: " + e.getMessage());
            System.err.println(">>> [ERROR] 错误类型: " + e.getClass().getName());
            e.printStackTrace();
            person.setBiography(new ArrayList<>());
            throw e; // 重新抛出异常以便上层捕获
        }
        
        try {
            System.out.println(">>> [DEBUG] 查询relationship表...");
            // 查询关系
            List<PersonRelationship> relationships = relationshipMapper.selectList(
                new LambdaQueryWrapper<PersonRelationship>()
                    .eq(PersonRelationship::getPersonId, personId)
                    .orderByAsc(PersonRelationship::getSortOrder)
            );
            System.out.println(">>> [DEBUG] relationship查询成功，记录数: " + relationships.size());
            person.setRelationships(relationships);
        } catch (Exception e) {
            System.err.println(">>> [ERROR] 查询关系数据失败: " + e.getMessage());
            System.err.println(">>> [ERROR] 错误类型: " + e.getClass().getName());
            e.printStackTrace();
            person.setRelationships(new ArrayList<>());
            throw e; // 重新抛出异常以便上层捕获
        }
        
        System.out.println(">>> [DEBUG] fillPersonDetails - 完成");
    }
    
    /**
     * 解析keyTags JSON字符串为List
     */
    private void parseKeyTags(Person person) {
        if (StringUtils.hasText(person.getKeyTags())) {
            try {
                person.setKeyTagsList(objectMapper.readValue(
                    person.getKeyTags(), 
                    new TypeReference<List<String>>() {}
                ));
            } catch (Exception e) {
                person.setKeyTagsList(new ArrayList<>());
            }
        } else {
            person.setKeyTagsList(new ArrayList<>());
        }
    }
    
    private void parseBiographyTags(PersonBiography biography) {
        if (StringUtils.hasText(biography.getTags())) {
            try {
                biography.setTagsList(objectMapper.readValue(
                    biography.getTags(),
                    new TypeReference<List<String>>() {}
                ));
            } catch (Exception e) {
                biography.setTagsList(new ArrayList<>());
            }
        } else {
            biography.setTagsList(new ArrayList<>());
        }
    }
    
    /**
     * 删除关联数据
     */
    private void deleteRelatedData(String personId) {
        biographyMapper.delete(new LambdaQueryWrapper<PersonBiography>()
            .eq(PersonBiography::getPersonId, personId));
        
        relationshipMapper.delete(new LambdaQueryWrapper<PersonRelationship>()
            .eq(PersonRelationship::getPersonId, personId));
    }

    @Override
    public Map<String, Object> getAllAdvancedProfiles() {
        try {
            List<Person> persons = list();

            Map<String, Object> result = new LinkedHashMap<>();
            for (Person person : persons) {
                try {
                    fillPersonDetails(person);
                    Map<String, Object> profileData = buildAdvancedProfile(person);
                    result.put(person.getPersonId(), profileData);
                } catch (Exception e) {
                    System.err.println("警告: 构建人物资料失败 (" + person.getPersonId() + "): " + e.getMessage());
                    e.printStackTrace();
                }
            }
            return result;
        } catch (Exception e) {
            System.err.println("错误: 获取所有人物资料失败: " + e.getMessage());
            e.printStackTrace();
            return new LinkedHashMap<>();
        }
    }

    @Override
    public Map<String, Object> getAdvancedProfile(String personId) {
        try {
            System.out.println(">>> [DEBUG] 开始获取人物资料: " + personId);
            Person person = personMapper.findByPersonId(personId);
            if (person == null) {
                System.err.println(">>> [ERROR] 未找到人物: " + personId);
                return null;
            }
            System.out.println(">>> [DEBUG] 找到人物: " + person.getName());
            
            // 填充关联数据（biography和relationships）
            try {
                System.out.println(">>> [DEBUG] 开始填充关联数据...");
                fillPersonDetails(person);
                System.out.println(">>> [DEBUG] 关联数据填充完成");
            } catch (Exception e) {
                System.err.println(">>> [ERROR] 填充人物关联数据失败 (" + personId + "): " + e.getMessage());
                System.err.println(">>> [ERROR] 错误类型: " + e.getClass().getName());
                e.printStackTrace();
                person.setBiography(new ArrayList<>());
                person.setRelationships(new ArrayList<>());
            }
            
            return buildAdvancedProfile(person);
        } catch (Exception e) {
            System.err.println("错误: 获取人物资料失败 (" + personId + "): " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private Map<String, Object> buildAdvancedProfile(Person person) {
        Map<String, Object> profileData = new LinkedHashMap<>();

        profileData.put("id", person.getPersonId());
        profileData.put("name", person.getName());
        profileData.put("subtitle", person.getSubtitle());

        // 处理图片路径
        String imagePath = normalizeImagePath(null, person.getImageUrl());
        
        // 如果图片路径为空，使用 person_id 作为文件名（persons/{person_id}.png）
        // 注意：前端会根据实际文件是否存在来决定是否使用 unknown.png
        if (!StringUtils.hasText(imagePath)) {
            String personId = person.getPersonId();
            if (StringUtils.hasText(personId)) {
                // 使用 person_id 作为文件名，格式：persons/{person_id}.png
                imagePath = "persons/" + personId + ".png";
            } else {
                // 如果连 person_id 都没有，使用 unknown
                imagePath = "persons/unknown.png";
            }
        }
        
        // 确保图片路径格式正确
        if (StringUtils.hasText(imagePath)) {
            profileData.put("image", imagePath);
        }

        List<String> keyTags = extractKeyTags(null, person.getKeyTags());
        profileData.put("keyTags", keyTags);

        profileData.put("dataStatus", person.getDataStatus());
        LocalDate lastVerified = person.getLastVerified();
        profileData.put("lastVerified", lastVerified != null ? lastVerified.toString() : null);

        // 添加biography和relationships数据
        List<PersonBiography> biographyList = person.getBiography() != null ? person.getBiography() : new ArrayList<>();
        profileData.put("biography", biographyList);
        profileData.put("relationships", person.getRelationships() != null ? person.getRelationships() : new ArrayList<>());

        // 从biography中提取特定类型的内容，方便前端直接使用
        extractBiographyContent(profileData, biographyList);

        return profileData;
    }

    private List<String> extractKeyTags(Object existing, String keyTagsJson) {
        if (existing instanceof List) {
            return ((List<?>) existing).stream()
                .map(String::valueOf)
                .collect(Collectors.toList());
        }

        if (StringUtils.hasText(keyTagsJson)) {
            try {
                return objectMapper.readValue(keyTagsJson, new TypeReference<List<String>>() {});
            } catch (Exception e) {
                // ignore
            }
        }
        return new ArrayList<>();
    }

    /**
     * 从biography列表中提取特定类型的内容，方便前端直接使用
     */
    private void extractBiographyContent(Map<String, Object> profileData, List<PersonBiography> biographyList) {
        if (biographyList == null || biographyList.isEmpty()) {
            return;
        }
        
        // 提取"详细介绍"类型的内容
        for (PersonBiography bio : biographyList) {
            if ("详细介绍".equals(bio.getTitle()) && StringUtils.hasText(bio.getContent())) {
                profileData.putIfAbsent("introduction", bio.getContent());
            }
            if ("主要成就".equals(bio.getTitle()) && StringUtils.hasText(bio.getContent())) {
                profileData.putIfAbsent("achievements", bio.getContent());
            }
        }
    }

    private String normalizeImagePath(Object imageValue, String fallback) {
        String path = null;
        if (imageValue instanceof String && StringUtils.hasText((String) imageValue)) {
            path = (String) imageValue;
        }
        if (!StringUtils.hasText(path) && StringUtils.hasText(fallback)) {
            path = fallback;
        }
        
        // 如果路径为空，返回 null（会在 buildAdvancedProfile 中处理）
        if (!StringUtils.hasText(path)) {
            return null;
        }
        
        // 处理 @/assets/ 路径
        if (path.startsWith("@/assets/")) {
            return path.substring("@/assets/".length());
        }
        
        // 处理 ./ 或 / 开头的路径
        if (path.startsWith("./") || path.startsWith("/")) {
            return path.replaceFirst("^[/\\.]+", "");
        }
        
        // 如果路径已经是 persons/ 格式，直接返回
        if (path.startsWith("persons/")) {
            return path;
        }
        
        return path;
    }
}

