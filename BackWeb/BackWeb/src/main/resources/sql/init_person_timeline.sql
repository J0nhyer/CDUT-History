-- ============================================
-- 人物时间线初始化脚本
-- 包含表结构创建和数据导入
-- 数据库: javawebdb
-- ============================================

USE javawebdb;

-- 1. 创建表结构
SOURCE person_event_schema.sql;

-- 2. 导入数据
SOURCE person_event_data_inserts_complete.sql;

-- 3. 验证数据
SELECT 
    person_name,
    COUNT(*) as event_count
FROM person_event 
GROUP BY person_name 
ORDER BY event_count DESC;

SELECT '✅ 人物时间线数据初始化完成！' as status;
