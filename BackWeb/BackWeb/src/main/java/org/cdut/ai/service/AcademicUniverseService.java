package org.cdut.ai.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.cdut.ai.model.AcademicMajor;
import org.cdut.ai.model.AcademicNode;
import org.cdut.ai.model.AcademicUniverse;

import java.util.List;
import java.util.Map;

public interface AcademicUniverseService extends IService<AcademicUniverse> {
    /**
     * 获取完整的学术星图数据（包含大学信息和所有节点）
     * 返回格式与前端universeData2.js一致
     */
    Map<String, Object> getUniverseData();
    
    /**
     * 获取大学信息
     */
    AcademicUniverse getUniversity();
    
    /**
     * 保存或更新大学信息
     */
    boolean saveOrUpdateUniversity(AcademicUniverse university);
    
    /**
     * 获取所有节点（包含专业和关系）
     */
    List<AcademicNode> getAllNodes();
    
    /**
     * 根据nodeId获取节点详情（包含专业和关系）
     */
    AcademicNode getNodeDetail(String nodeId);
    
    /**
     * 保存或更新完整的学术星图数据
     */
    boolean saveOrUpdateUniverseData(Map<String, Object> universeData);
    
    /**
     * 保存或更新节点（包含专业和关系）
     */
    boolean saveOrUpdateNode(AcademicNode node);
    
    /**
     * 删除节点及其关联数据
     */
    boolean deleteNode(String nodeId);
    
    /**
     * 获取所有专业
     */
    List<AcademicMajor> getAllMajors();
}

