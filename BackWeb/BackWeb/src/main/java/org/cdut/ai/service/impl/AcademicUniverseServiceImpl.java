package org.cdut.ai.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.cdut.ai.mapper.*;
import org.cdut.ai.model.*;
import org.cdut.ai.service.AcademicUniverseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AcademicUniverseServiceImpl extends ServiceImpl<AcademicUniverseMapper, AcademicUniverse> 
        implements AcademicUniverseService {

    @Autowired
    private AcademicUniverseMapper universeMapper;
    
    @Autowired
    private AcademicNodeMapper nodeMapper;
    
    @Autowired
    private AcademicMajorMapper majorMapper;
    
    @Autowired
    private AcademicRelationMapper relationMapper;

    @Override
    public Map<String, Object> getUniverseData() {
        Map<String, Object> result = new HashMap<>();
        
        // 1. 获取大学信息
        AcademicUniverse university = getUniversity();
        if (university != null) {
            Map<String, Object> universityMap = new HashMap<>();
            universityMap.put("id", university.getUniversityId());
            universityMap.put("name", university.getName());
            universityMap.put("type", university.getType());
            universityMap.put("position", Map.of(
                "x", university.getPositionX() != null ? university.getPositionX() : 0.0,
                "y", university.getPositionY() != null ? university.getPositionY() : 0.0,
                "z", university.getPositionZ() != null ? university.getPositionZ() : 0.0
            ));
            universityMap.put("size", university.getSize() != null ? university.getSize() : 3.0);
            universityMap.put("description", university.getDescription() != null ? university.getDescription() : "");
            universityMap.put("color", parseColorToInt(university.getColor() != null ? university.getColor() : "0xffaa00"));
            result.put("university", universityMap);
        }
        
        // 2. 获取所有节点
        List<AcademicNode> nodes = getAllNodes();
        List<Map<String, Object>> peopleList = new ArrayList<>();
        
        for (AcademicNode node : nodes) {
            Map<String, Object> nodeMap = convertNodeToMap(node);
            peopleList.add(nodeMap);
        }
        
        result.put("people", peopleList);
        
        return result;
    }

    @Override
    public AcademicUniverse getUniversity() {
        AcademicUniverse university = universeMapper.findByUniversityId("cdut");
        if (university == null) {
            // 如果不存在，返回默认值
            university = new AcademicUniverse();
            university.setUniversityId("cdut");
            university.setName("成都理工大学");
            university.setType("university");
            university.setPositionX(0.0);
            university.setPositionY(0.0);
            university.setPositionZ(0.0);
            university.setSize(3.0);
            university.setColor("0xffaa00");
        }
        return university;
    }

    @Override
    @Transactional
    public boolean saveOrUpdateUniversity(AcademicUniverse university) {
        try {
            AcademicUniverse existing = universeMapper.findByUniversityId(university.getUniversityId());
            if (existing != null) {
                university.setId(existing.getId());
                return updateById(university);
            } else {
                return save(university);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<AcademicNode> getAllNodes() {
        List<AcademicNode> nodes = nodeMapper.findAllOrderBySortOrder();
        for (AcademicNode node : nodes) {
            fillNodeDetails(node);
        }
        return nodes;
    }

    @Override
    public AcademicNode getNodeDetail(String nodeId) {
        AcademicNode node = nodeMapper.findByNodeId(nodeId);
        if (node != null) {
            fillNodeDetails(node);
        }
        return node;
    }

    @Override
    @Transactional
    public boolean saveOrUpdateUniverseData(Map<String, Object> universeData) {
        try {
            // 1. 保存大学信息
            if (universeData.containsKey("university")) {
                Map<String, Object> universityMap = (Map<String, Object>) universeData.get("university");
                AcademicUniverse university = convertMapToUniversity(universityMap);
                saveOrUpdateUniversity(university);
            }
            
            // 2. 保存节点信息
            if (universeData.containsKey("people")) {
                List<Map<String, Object>> peopleList = (List<Map<String, Object>>) universeData.get("people");
                for (Map<String, Object> nodeMap : peopleList) {
                    AcademicNode node = convertMapToNode(nodeMap);
                    saveOrUpdateNode(node);
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
    public boolean saveOrUpdateNode(AcademicNode node) {
        try {
            // 1. 保存或更新节点基本信息
            AcademicNode existing = nodeMapper.findByNodeId(node.getNodeId());
            if (existing != null) {
                node.setId(existing.getId());
                nodeMapper.updateById(node);
            } else {
                nodeMapper.insert(node);
            }
            
            // 2. 删除旧的关联数据
            deleteNodeRelatedData(node.getNodeId());
            
            // 3. 保存专业
            if (node.getMajors() != null) {
                for (int i = 0; i < node.getMajors().size(); i++) {
                    AcademicMajor major = node.getMajors().get(i);
                    major.setNodeId(node.getNodeId());
                    major.setSortOrder(i);
                    majorMapper.insert(major);
                }
            }
            
            // 4. 保存关系
            if (node.getRelations() != null) {
                for (int i = 0; i < node.getRelations().size(); i++) {
                    AcademicRelation relation = node.getRelations().get(i);
                    relation.setSourceNodeId(node.getNodeId());
                    relation.setSortOrder(i);
                    relationMapper.insert(relation);
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
    public boolean deleteNode(String nodeId) {
        try {
            // 删除关联数据（外键会自动级联删除）
            deleteNodeRelatedData(nodeId);
            
            // 删除节点
            AcademicNode node = nodeMapper.findByNodeId(nodeId);
            if (node != null) {
                return nodeMapper.deleteById(node.getId()) > 0;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * 填充节点的关联数据（专业和关系）
     */
    private void fillNodeDetails(AcademicNode node) {
        String nodeId = node.getNodeId();
        
        // 查询专业
        List<AcademicMajor> majors = majorMapper.findByNodeId(nodeId);
        node.setMajors(majors);
        
        // 查询关系
        List<AcademicRelation> relations = relationMapper.findBySourceNodeId(nodeId);
        node.setRelations(relations);
    }
    
    /**
     * 删除节点的关联数据
     */
    private void deleteNodeRelatedData(String nodeId) {
        majorMapper.delete(new LambdaQueryWrapper<AcademicMajor>()
            .eq(AcademicMajor::getNodeId, nodeId));
        
        relationMapper.delete(new LambdaQueryWrapper<AcademicRelation>()
            .eq(AcademicRelation::getSourceNodeId, nodeId));
    }
    
    /**
     * 将节点转换为前端需要的Map格式
     */
    private Map<String, Object> convertNodeToMap(AcademicNode node) {
        Map<String, Object> nodeMap = new HashMap<>();
        nodeMap.put("id", node.getNodeId());
        nodeMap.put("name", node.getName());
        nodeMap.put("type", node.getType());
        nodeMap.put("position", Map.of(
            "x", node.getPositionX(),
            "y", node.getPositionY(),
            "z", node.getPositionZ()
        ));
        nodeMap.put("size", node.getSize());
        nodeMap.put("color", parseColorToInt(node.getColor() != null ? node.getColor() : "0xffaa00"));
        nodeMap.put("title", node.getTitle() != null ? node.getTitle() : "");
        nodeMap.put("description", node.getDescription() != null ? node.getDescription() : "");
        
        // style对象
        Map<String, Object> style = new HashMap<>();
        if (node.getStyleGlow() != null) {
            style.put("glow", node.getStyleGlow());
        }
        if (node.getStyleRing() != null) {
            style.put("ring", node.getStyleRing());
        }
        if (node.getStyleShape() != null) {
            style.put("shape", node.getStyleShape());
        }
        if (!style.isEmpty()) {
            nodeMap.put("style", style);
        }
        
        // majors数组
        if (node.getMajors() != null && !node.getMajors().isEmpty()) {
            List<Map<String, Object>> majorsList = node.getMajors().stream()
                .map(major -> {
                    Map<String, Object> majorMap = new HashMap<>();
                    majorMap.put("id", major.getMajorId());
                    majorMap.put("name", major.getName());
                    if (major.getLevel() != null) {
                        majorMap.put("level", major.getLevel());
                    }
                    if (major.getColor() != null) {
                        majorMap.put("color", parseColorToInt(major.getColor()));
                    } else {
                        // 如果没有设置颜色，使用节点颜色
                        majorMap.put("color", parseColorToInt(node.getColor() != null ? node.getColor() : "0xffaa00"));
                    }
                    return majorMap;
                })
                .collect(Collectors.toList());
            nodeMap.put("majors", majorsList);
        }
        
        // relations数组
        if (node.getRelations() != null && !node.getRelations().isEmpty()) {
            List<Map<String, Object>> relationsList = node.getRelations().stream()
                .map(relation -> {
                    Map<String, Object> relationMap = new HashMap<>();
                    relationMap.put("type", relation.getRelationType());
                    relationMap.put("target", relation.getTargetName() != null ? 
                        relation.getTargetName() : relation.getTargetNodeId());
                    if (relation.getDescription() != null) {
                        relationMap.put("description", relation.getDescription());
                    }
                    return relationMap;
                })
                .collect(Collectors.toList());
            nodeMap.put("relations", relationsList);
        }
        
        return nodeMap;
    }
    
    /**
     * 将Map转换为AcademicUniverse对象
     */
    private AcademicUniverse convertMapToUniversity(Map<String, Object> map) {
        AcademicUniverse university = new AcademicUniverse();
        university.setUniversityId((String) map.get("id"));
        university.setName((String) map.get("name"));
        university.setType((String) map.getOrDefault("type", "university"));
        
        Map<String, Object> position = (Map<String, Object>) map.get("position");
        if (position != null) {
            university.setPositionX(convertToDouble(position.get("x")));
            university.setPositionY(convertToDouble(position.get("y")));
            university.setPositionZ(convertToDouble(position.get("z")));
        }
        
        university.setSize(convertToDouble(map.get("size")));
        university.setDescription((String) map.getOrDefault("description", ""));
        university.setColor(parseColorToString(map.get("color")));
        
        return university;
    }
    
    /**
     * 将Map转换为AcademicNode对象
     */
    private AcademicNode convertMapToNode(Map<String, Object> map) {
        AcademicNode node = new AcademicNode();
        node.setNodeId((String) map.get("id"));
        node.setName((String) map.get("name"));
        node.setType((String) map.getOrDefault("type", "small_star"));
        
        Map<String, Object> position = (Map<String, Object>) map.get("position");
        if (position != null) {
            node.setPositionX(convertToDouble(position.get("x")));
            node.setPositionY(convertToDouble(position.get("y")));
            node.setPositionZ(convertToDouble(position.get("z")));
        }
        
        node.setSize(convertToDouble(map.get("size")));
        node.setColor(parseColorToString(map.get("color")));
        node.setTitle((String) map.getOrDefault("title", ""));
        node.setDescription((String) map.getOrDefault("description", ""));
        
        // style对象
        Map<String, Object> style = (Map<String, Object>) map.get("style");
        if (style != null) {
            node.setStyleGlow(convertToDouble(style.get("glow")));
            node.setStyleRing(convertToBoolean(style.get("ring")));
            node.setStyleShape((String) style.get("shape"));
        }
        
        // majors数组
        List<Map<String, Object>> majorsList = (List<Map<String, Object>>) map.get("majors");
        if (majorsList != null) {
            List<AcademicMajor> majors = new ArrayList<>();
            for (Map<String, Object> majorMap : majorsList) {
                AcademicMajor major = new AcademicMajor();
                major.setMajorId((String) majorMap.get("id"));
                major.setName((String) majorMap.get("name"));
                major.setLevel((String) majorMap.get("level"));
                major.setColor(parseColorToString(majorMap.get("color")));
                major.setDescription((String) majorMap.getOrDefault("description", ""));
                majors.add(major);
            }
            node.setMajors(majors);
        }
        
        // relations数组
        List<Map<String, Object>> relationsList = (List<Map<String, Object>>) map.get("relations");
        if (relationsList != null) {
            List<AcademicRelation> relations = new ArrayList<>();
            for (Map<String, Object> relationMap : relationsList) {
                AcademicRelation relation = new AcademicRelation();
                relation.setRelationType((String) relationMap.get("type"));
                String target = (String) relationMap.get("target");
                relation.setTargetName(target);
                relation.setDescription((String) relationMap.getOrDefault("description", ""));
                relations.add(relation);
            }
            node.setRelations(relations);
        }
        
        return node;
    }
    
    /**
     * 将颜色值转换为整数（前端使用）
     */
    private Integer parseColorToInt(Object colorObj) {
        if (colorObj == null) {
            return 0xffaa00; // 默认颜色
        }
        
        // 如果已经是Integer类型，直接返回
        if (colorObj instanceof Integer) {
            return (Integer) colorObj;
        }
        
        String colorStr = colorObj.toString();
        if (colorStr.isEmpty()) {
            return 0xffaa00;
        }
        
        try {
            // 处理 "0xffaa00" 格式
            if (colorStr.startsWith("0x") || colorStr.startsWith("0X")) {
                return Integer.parseInt(colorStr.substring(2), 16);
            }
            // 处理 "#ffaa00" 格式
            if (colorStr.startsWith("#")) {
                return Integer.parseInt(colorStr.substring(1), 16);
            }
            // 直接是数字字符串
            return Integer.parseInt(colorStr, 16);
        } catch (Exception e) {
            return 0xffaa00;
        }
    }
    
    /**
     * 将颜色值转换为字符串（数据库存储）
     */
    private String parseColorToString(Object colorObj) {
        if (colorObj == null) {
            return "0xffaa00";
        }
        if (colorObj instanceof Integer) {
            return "0x" + Integer.toHexString((Integer) colorObj);
        }
        if (colorObj instanceof String) {
            String colorStr = (String) colorObj;
            if (!colorStr.startsWith("0x") && !colorStr.startsWith("0X") && !colorStr.startsWith("#")) {
                try {
                    int colorInt = Integer.parseInt(colorStr);
                    return "0x" + Integer.toHexString(colorInt);
                } catch (Exception e) {
                    return "0xffaa00";
                }
            }
            return colorStr;
        }
        return "0xffaa00";
    }
    
    private Double convertToDouble(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Number) {
            return ((Number) obj).doubleValue();
        }
        if (obj instanceof String) {
            try {
                return Double.parseDouble((String) obj);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
    
    private Boolean convertToBoolean(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Boolean) {
            return (Boolean) obj;
        }
        if (obj instanceof String) {
            return Boolean.parseBoolean((String) obj);
        }
        if (obj instanceof Number) {
            return ((Number) obj).intValue() != 0;
        }
        return null;
    }
}

