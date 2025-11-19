-- 为person表添加awards字段
USE javawebdb;

ALTER TABLE `person` 
ADD COLUMN `awards` TEXT COMMENT '奖项成就（JSON数组，包含奖项、称号、专利、著作等）' 
AFTER `key_tags`;
