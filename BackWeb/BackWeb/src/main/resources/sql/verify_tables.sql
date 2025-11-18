-- 验证数据库表结构
USE javawebdb;

-- 检查person表
SELECT '=== person表结构 ===' AS info;
DESCRIBE person;

SELECT '=== person表数据示例 ===' AS info;
SELECT * FROM person WHERE person_id = 'zhangzhuoyuan' LIMIT 1;

-- 检查person_biography表
SELECT '=== person_biography表结构 ===' AS info;
DESCRIBE person_biography;

SELECT '=== person_biography表数据示例 ===' AS info;
SELECT * FROM person_biography WHERE person_id = 'zhangzhuoyuan' LIMIT 2;

-- 检查person_relationship表
SELECT '=== person_relationship表结构 ===' AS info;
DESCRIBE person_relationship;

SELECT '=== person_relationship表数据示例 ===' AS info;
SELECT * FROM person_relationship WHERE person_id = 'zhangzhuoyuan' LIMIT 2;

-- 检查person_profile表
SELECT '=== person_profile表结构 ===' AS info;
DESCRIBE person_profile;

SELECT '=== person_profile表数据数量 ===' AS info;
SELECT COUNT(*) as count FROM person_profile;
