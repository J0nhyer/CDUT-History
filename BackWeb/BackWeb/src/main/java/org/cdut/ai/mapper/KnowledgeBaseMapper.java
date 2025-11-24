package org.cdut.ai.mapper;

import org.apache.ibatis.annotations.*;
import org.cdut.ai.model.KnowledgeBase;

import java.util.List;

/**
 * 知识库数据访问接口
 */
@Mapper
public interface KnowledgeBaseMapper {

    /**
     * 查询所有启用的知识库记录
     */
    @Select("SELECT * FROM knowledge_base WHERE status = 1 ORDER BY priority DESC, id ASC")
    List<KnowledgeBase> findAllEnabled();

    /**
     * 根据分类查询知识库
     */
    @Select("SELECT * FROM knowledge_base WHERE category = #{category} AND status = 1 ORDER BY priority DESC, id ASC")
    List<KnowledgeBase> findByCategory(@Param("category") String category);

    /**
     * 根据关键词搜索（标题和内容模糊匹配）
     */
    @Select("SELECT * FROM knowledge_base WHERE status = 1 AND (title LIKE CONCAT('%', #{keyword}, '%') OR content LIKE CONCAT('%', #{keyword}, '%') OR keywords LIKE CONCAT('%', #{keyword}, '%')) ORDER BY priority DESC, id ASC LIMIT #{limit}")
    List<KnowledgeBase> searchByKeyword(@Param("keyword") String keyword, @Param("limit") int limit);

    /**
     * 全文搜索（使用MySQL全文索引）
     */
    @Select("SELECT *, MATCH(title, content) AGAINST(#{query} IN NATURAL LANGUAGE MODE) AS score FROM knowledge_base WHERE status = 1 AND MATCH(title, content) AGAINST(#{query} IN NATURAL LANGUAGE MODE) ORDER BY score DESC, priority DESC LIMIT #{limit}")
    List<KnowledgeBase> fullTextSearch(@Param("query") String query, @Param("limit") int limit);

    /**
     * 插入知识库记录
     */
    @Insert("INSERT INTO knowledge_base (title, content, category, keywords, priority, status) VALUES (#{title}, #{content}, #{category}, #{keywords}, #{priority}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(KnowledgeBase knowledgeBase);

    /**
     * 更新知识库记录
     */
    @Update("UPDATE knowledge_base SET title = #{title}, content = #{content}, category = #{category}, keywords = #{keywords}, priority = #{priority}, status = #{status} WHERE id = #{id}")
    int update(KnowledgeBase knowledgeBase);

    /**
     * 删除知识库记录
     */
    @Delete("DELETE FROM knowledge_base WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    /**
     * 根据ID查询
     */
    @Select("SELECT * FROM knowledge_base WHERE id = #{id}")
    KnowledgeBase findById(@Param("id") Long id);
}
