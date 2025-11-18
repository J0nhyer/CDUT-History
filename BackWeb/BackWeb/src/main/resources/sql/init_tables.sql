-- ====================================================
-- 初始化数据库表结构
-- ====================================================

USE javawebdb;

SET FOREIGN_KEY_CHECKS = 0;

-- 删除旧表(如果需要完全重建,取消下面的注释)
-- DROP TABLE IF EXISTS `person_profile`;
-- DROP TABLE IF EXISTS `person_relationship`;
-- DROP TABLE IF EXISTS `person_biography`;
-- DROP TABLE IF EXISTS `person`;

-- 创建person表
CREATE TABLE IF NOT EXISTS `person` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `person_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '人物唯一标识',
    `name` VARCHAR(100) NOT NULL COMMENT '姓名',
    `subtitle` VARCHAR(500) COMMENT '副标题/职位',
    `image_url` VARCHAR(500) COMMENT '头像图片路径',
    `key_tags` TEXT COMMENT '关键词标签(JSON数组)',
    `data_status` VARCHAR(20) DEFAULT 'draft' COMMENT '数据状态',
    `last_verified` DATE COMMENT '最后验证日期',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_person_id` (`person_id`),
    INDEX `idx_name` (`name`),
    INDEX `idx_data_status` (`data_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物基本信息表';

-- 创建person_biography表
CREATE TABLE IF NOT EXISTS `person_biography` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `person_id` VARCHAR(100) NOT NULL COMMENT '人物ID',
    `title` VARCHAR(200) NOT NULL COMMENT '章节标题',
    `content` TEXT NOT NULL COMMENT '内容(支持HTML)',
    `tags` TEXT COMMENT '标签(JSON数组)',
    `media_type` VARCHAR(50) COMMENT '媒体类型',
    `media_url` VARCHAR(500) COMMENT '媒体资源URL',
    `needs_verification` TINYINT(1) DEFAULT 0 COMMENT '是否需要验证',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_person_id` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物生平传记表';

-- 创建person_relationship表
CREATE TABLE IF NOT EXISTS `person_relationship` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `person_id` VARCHAR(100) NOT NULL COMMENT '人物ID',
    `related_person_id` VARCHAR(100) COMMENT '关联人物ID',
    `related_person_name` VARCHAR(100) NOT NULL COMMENT '关联人物姓名',
    `relation_type` VARCHAR(50) COMMENT '关系类型',
    `relation` VARCHAR(100) COMMENT '关系描述',
    `description` TEXT COMMENT '关系详细描述',
    `needs_verification` TINYINT(1) DEFAULT 0 COMMENT '是否需要验证',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_person_id` (`person_id`),
    INDEX `idx_related_person_id` (`related_person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物关系表';

-- 创建person_profile表
CREATE TABLE IF NOT EXISTS `person_profile` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `person_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '人物ID',
    `profile_json` LONGTEXT NOT NULL COMMENT '完整人物资料JSON',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_profile_person_id` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物完整资料JSON表';

SET FOREIGN_KEY_CHECKS = 1;

SELECT '表结构创建完成' AS status;
