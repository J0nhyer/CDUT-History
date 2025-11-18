-- ====================================================
-- 验证数据导入结果
-- ====================================================

USE javawebdb;

SELECT '======================================' AS '';
SELECT '数据统计信息:' AS '';
SELECT '======================================' AS '';

SELECT 'person表' AS 表名, COUNT(*) AS 记录数 FROM person
UNION ALL
SELECT 'person_biography表', COUNT(*) FROM person_biography
UNION ALL
SELECT 'person_relationship表', COUNT(*) FROM person_relationship
UNION ALL
SELECT 'person_profile表', COUNT(*) FROM person_profile;

SELECT '======================================' AS '';
SELECT '所有人物列表(person_id):' AS '';
SELECT '======================================' AS '';
SELECT person_id, name, data_status FROM person ORDER BY person_id;

SELECT '======================================' AS '';
SELECT '测试查询liubaojun数据:' AS '';
SELECT '======================================' AS '';
SELECT * FROM person WHERE person_id = 'liubaojun';

SELECT '======================================' AS '';
SELECT '数据导入完成！' AS '';
SELECT '======================================' AS '';
