-- ====================================================
-- 一键修复liubaojun 500错误脚本
-- 执行方式: mysql -u root -p < EXECUTE_ME.sql
-- ====================================================

USE javawebdb;

-- 步骤1: 创建所有必需的表
CREATE TABLE IF NOT EXISTS `person` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `person_id` VARCHAR(100) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `subtitle` VARCHAR(500),
    `image_url` VARCHAR(500),
    `key_tags` TEXT,
    `data_status` VARCHAR(20) DEFAULT 'draft',
    `last_verified` DATE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_person_id` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `person_biography` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `person_id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `tags` TEXT,
    `media_type` VARCHAR(50),
    `media_url` VARCHAR(500),
    `needs_verification` TINYINT(1) DEFAULT 0,
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_person_id` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `person_relationship` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `person_id` VARCHAR(100) NOT NULL,
    `related_person_id` VARCHAR(100),
    `related_person_name` VARCHAR(100) NOT NULL,
    `relation_type` VARCHAR(50),
    `relation` VARCHAR(100),
    `description` TEXT,
    `needs_verification` TINYINT(1) DEFAULT 0,
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_person_id` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `person_profile` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `person_id` VARCHAR(100) NOT NULL UNIQUE,
    `profile_json` LONGTEXT NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_profile_person_id` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 步骤2: 插入liubaojun数据
INSERT INTO `person` (`person_id`, `name`, `subtitle`, `image_url`, `key_tags`, `data_status`, `last_verified`) 
VALUES ('liubaojun', '刘宝珺', '中国科学院院士 · 沉积地质学家 · 成都理工大学名誉校长', 
        '@/assets/persons/liubaojun.png', 
        '["中国科学院院士","沉积地质学奠基人","李四光奖获得者"]', 
        'completed', '2025-10-30')
ON DUPLICATE KEY UPDATE
    `name` = '刘宝珺',
    `subtitle` = '中国科学院院士 · 沉积地质学家 · 成都理工大学名誉校长',
    `image_url` = '@/assets/persons/liubaojun.png',
    `key_tags` = '["中国科学院院士","沉积地质学奠基人","李四光奖获得者"]',
    `data_status` = 'completed';

-- 步骤3: 验证数据
SELECT '===== 验证结果 =====' AS status;
SELECT 'person表记录:' AS table_name, COUNT(*) AS count FROM person WHERE person_id = 'liubaojun'
UNION ALL
SELECT 'person_biography表记录:', COUNT(*) FROM person_biography WHERE person_id = 'liubaojun'
UNION ALL
SELECT 'person_relationship表记录:', COUNT(*) FROM person_relationship WHERE person_id = 'liubaojun';

SELECT '===== liubaojun数据 =====' AS status;
SELECT * FROM person WHERE person_id = 'liubaojun';
