package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.cdut.ai.model.PersonAward;

import java.util.List;

/**
 * 人物荣誉成就Mapper
 */
@Mapper
public interface PersonAwardMapper extends BaseMapper<PersonAward> {
    
    /**
     * 根据人物ID查询所有荣誉
     */
    @Select("SELECT * FROM person_awards WHERE person_id = #{personId} ORDER BY display_order ASC, award_year DESC")
    List<PersonAward> findByPersonId(String personId);
    
    /**
     * 根据人物ID和荣誉类型查询
     */
    @Select("SELECT * FROM person_awards WHERE person_id = #{personId} AND award_type = #{awardType} ORDER BY display_order ASC, award_year DESC")
    List<PersonAward> findByPersonIdAndType(String personId, String awardType);
}
