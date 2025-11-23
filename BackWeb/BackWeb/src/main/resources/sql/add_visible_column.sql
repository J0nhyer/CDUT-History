-- 给person表添加is_visible字段
-- 数据库: javawebdb

USE javawebdb;

-- 添加is_visible字段
ALTER TABLE `person` ADD COLUMN `is_visible` TINYINT(1) DEFAULT 1 COMMENT '是否可见：1可见，0不可见' AFTER `last_verified`;

-- 添加索引
ALTER TABLE `person` ADD INDEX `idx_visible` (`is_visible`);
