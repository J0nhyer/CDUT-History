-- ============================================
-- 数据库验证脚本
-- 用于检查person表和history_event表的数据是否正确导入
-- ============================================

USE javawebdb;

-- 1. 检查person表数据量
SELECT '=== Person表数据统计 ===' AS '检查项';
SELECT COUNT(*) AS '总人物数' FROM person;
SELECT COUNT(*) AS '有图片的人物数' FROM person WHERE image_url IS NOT NULL;
SELECT COUNT(*) AS '已完成的人物数' FROM person WHERE data_status = 'completed';

-- 2. 检查是否存在许大纯
SELECT '=== 检查许大纯是否存在 ===' AS '检查项';
SELECT 
    person_id,
    name,
    subtitle,
    image_url,
    data_status
FROM person 
WHERE person_id = 'xudachun' OR name LIKE '%许大纯%';

-- 3. 列出所有人物的基本信息（前20个）
SELECT '=== Person表前20条数据 ===' AS '检查项';
SELECT 
    person_id,
    name,
    subtitle,
    data_status
FROM person 
LIMIT 20;

-- 4. 检查history_event表数据量
SELECT '=== History Event表数据统计 ===' AS '检查项';
SELECT COUNT(*) AS '总事件数' FROM history_event;
SELECT COUNT(*) AS '重要事件数' FROM history_event WHERE importance = 'high';

-- 5. 列出所有历史事件
SELECT '=== History Event表数据 ===' AS '检查项';
SELECT 
    event_id,
    title,
    year,
    event_type,
    importance
FROM history_event 
ORDER BY year;

-- 6. 如果person表为空，提示需要导入数据
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM person) = 0 
        THEN '⚠️ 警告：person表为空，请执行 person_data_inserts.sql'
        ELSE '✓ person表有数据'
    END AS '数据状态检查';

-- 7. 如果history_event表为空，提示需要导入数据
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM history_event) = 0 
        THEN '⚠️ 警告：history_event表为空，请执行 cdut_history_data_inserts.sql'
        ELSE '✓ history_event表有数据'
    END AS '数据状态检查';
