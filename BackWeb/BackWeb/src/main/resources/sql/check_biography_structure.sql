-- 检查person_biography表的实际结构
USE javawebdb;

-- 查看表结构
DESCRIBE person_biography;

-- 查看建表语句
SHOW CREATE TABLE person_biography;

-- 查看实际数据（包括content字段类型）
SELECT 
    id, 
    person_id, 
    title,
    CHAR_LENGTH(content) as content_length,
    SUBSTRING(content, 1, 100) as content_preview,
    tags
FROM person_biography 
WHERE person_id = 'liubaojun'
LIMIT 3;
