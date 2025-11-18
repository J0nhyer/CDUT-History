-- 检查 zengyunfu 的数据
USE javawebdb;

-- 1. 检查 person 表
SELECT * FROM person WHERE person_id = 'zengyunfu';

-- 2. 检查 person_profile 表
SELECT * FROM person_profile WHERE person_id = 'zengyunfu';

-- 3. 检查 person_biography 表
SELECT * FROM person_biography WHERE person_id = 'zengyunfu';

-- 4. 检查 person_relationship 表
SELECT * FROM person_relationship WHERE person_id = 'zengyunfu';

-- 5. 检查 key_tags 字段格式（看是否是合法JSON）
SELECT person_id, name, key_tags FROM person WHERE person_id = 'zengyunfu';

-- 6. 检查 biography 的 tags 字段格式
SELECT id, person_id, tags FROM person_biography WHERE person_id = 'zengyunfu';
