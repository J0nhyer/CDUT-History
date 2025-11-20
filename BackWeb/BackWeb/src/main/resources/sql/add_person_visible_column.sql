-- 为person表添加是否显示字段
-- 数据库: javawebdb

USE javawebdb;

-- 添加is_visible字段（是否显示人物信息）
ALTER TABLE `person` 
ADD COLUMN `is_visible` TINYINT(1) DEFAULT 1 COMMENT '是否显示人物信息：1-显示，0-不显示' 
AFTER `awards`;

-- 为新字段添加索引以提高查询效率
ALTER TABLE `person` 
ADD INDEX `idx_is_visible` (`is_visible`);
