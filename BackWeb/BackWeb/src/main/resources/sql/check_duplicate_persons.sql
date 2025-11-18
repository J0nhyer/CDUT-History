-- 检查person表中的重复人物
USE javawebdb;

-- 检查 person 表中是否有重复的 person_id
SELECT person_id, name, COUNT(*) as count
FROM person
GROUP BY person_id
HAVING COUNT(*) > 1;

-- 检查同名人物
SELECT name, COUNT(*) as count, GROUP_CONCAT(person_id) as person_ids
FROM person
GROUP BY name
HAVING COUNT(*) > 1;

-- 查看所有陈毓泰的记录
SELECT * FROM person WHERE name LIKE '%陈毓泰%' OR person_id LIKE '%chenyutai%';

-- 检查 person_profile 表中的重复数据
SELECT person_id, COUNT(*) as count
FROM person_profile
GROUP BY person_id
HAVING COUNT(*) > 1;
