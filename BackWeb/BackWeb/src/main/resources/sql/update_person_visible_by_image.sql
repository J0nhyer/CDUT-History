-- 将所有图片为NULL的人物设置为不显示
-- 数据库: javawebdb

USE javawebdb;

-- 临时关闭安全更新模式
SET SQL_SAFE_UPDATES = 0;

-- 更新所有image_url为NULL的人物，设置is_visible为0（不显示）
UPDATE `person` 
SET `is_visible` = 0 
WHERE `image_url` IS NULL OR `image_url` = '';

-- 重新开启安全更新模式
SET SQL_SAFE_UPDATES = 1;
