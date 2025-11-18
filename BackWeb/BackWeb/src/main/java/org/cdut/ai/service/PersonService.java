package org.cdut.ai.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.cdut.ai.model.Person;

import java.util.List;
import java.util.Map;

public interface PersonService extends IService<Person> {
    /**
     * 根据personId获取完整的人物信息（包含所有关联数据）
     */
    Person getPersonDetail(String personId);
    
    /**
     * 获取所有人物列表（基本信息）
     */
    List<Person> getAllPersons();
    
    /**
     * 根据姓名搜索人物
     */
    List<Person> searchByName(String name);
    
    /**
     * 根据数据状态查询人物
     */
    List<Person> getPersonsByStatus(String dataStatus);
    
    /**
     * 保存或更新完整的人物信息（包含所有关联数据）
     */
    boolean saveOrUpdatePersonDetail(Person person);
    
    /**
     * 删除人物及其所有关联数据
     */
    boolean deletePerson(String personId);

    /**
     * 获取所有人物的完整展示数据（用于前端渲染）
     */
    Map<String, Object> getAllAdvancedProfiles();

    /**
     * 获取指定人物的完整展示数据
     */
    Map<String, Object> getAdvancedProfile(String personId);
    
    /**
     * 获取所有可用的标签选项（按分类分组）
     */
    Map<String, List<String>> getAllAvailableTags();
}

