-- 检查人物简介数据
USE javawebdb;

-- 1. 检查person表数据
SELECT COUNT(*) as person_count FROM person;

-- 2. 检查person_biography表数据
SELECT COUNT(*) as biography_count FROM person_biography;

-- 3. 查看特定人物的biography数据（以liubaojun为例）
SELECT 
    pb.person_id,
    p.name,
    pb.title,
    LEFT(pb.content, 100) as content_preview,
    pb.sort_order
FROM person_biography pb
LEFT JOIN person p ON pb.person_id = p.person_id
WHERE pb.person_id = 'liubaojun'
ORDER BY pb.sort_order;

-- 4. 查看所有有biography的人物
SELECT 
    p.person_id,
    p.name,
    COUNT(pb.id) as biography_count
FROM person p
LEFT JOIN person_biography pb ON p.person_id = pb.person_id
GROUP BY p.person_id, p.name
HAVING biography_count > 0
ORDER BY biography_count DESC;

-- 5. 查看没有biography的人物
SELECT 
    p.person_id,
    p.name,
    p.subtitle
FROM person p
LEFT JOIN person_biography pb ON p.person_id = pb.person_id
WHERE pb.id IS NULL;
