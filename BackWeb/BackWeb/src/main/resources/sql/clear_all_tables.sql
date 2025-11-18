-- 清空指定人物表的数据
-- 注意：此操作会删除所有数据但保留表结构
USE javawebdb;

-- 设置外键检查为0，避免外键约束问题
SET FOREIGN_KEY_CHECKS = 0;

-- 清空子表数据
TRUNCATE TABLE `person_biography`;
TRUNCATE TABLE `person_relationship`;

-- 清空主表数据
TRUNCATE TABLE `person`;

-- 恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 操作完成提示
SELECT '已清空 person、person_biography、person_relationship 三个表的数据' AS Status;
