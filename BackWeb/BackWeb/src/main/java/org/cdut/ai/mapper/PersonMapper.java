package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.cdut.ai.model.Person;

import java.util.List;

@Mapper
public interface PersonMapper extends BaseMapper<Person> {
    /**
     * 根据personId查询人物
     */
    Person findByPersonId(@Param("personId") String personId);
    
    /**
     * 根据姓名模糊查询
     */
    List<Person> findByNameLike(@Param("name") String name);
    
    /**
     * 根据数据状态查询
     */
    List<Person> findByDataStatus(@Param("dataStatus") String dataStatus);
    
    /**
     * 查询所有人物的key_tags字段
     */
    @org.apache.ibatis.annotations.Select("SELECT key_tags FROM person WHERE key_tags IS NOT NULL AND key_tags != ''")
    List<String> getAllKeyTags();
}

