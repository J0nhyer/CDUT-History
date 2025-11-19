package org.cdut.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.cdut.ai.model.KnowledgeDocument;

import java.util.List;

@Mapper
public interface KnowledgeDocumentMapper extends BaseMapper<KnowledgeDocument> {
    
    @Select("SELECT * FROM knowledge_document WHERE MATCH(title, content) AGAINST(#{query} IN NATURAL LANGUAGE MODE) LIMIT #{limit}")
    List<KnowledgeDocument> searchByFullText(@Param("query") String query, @Param("limit") int limit);
}
