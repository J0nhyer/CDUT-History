-- 人物信息数据库表结构
-- 数据库: javawebdb

-- 1. 人物基本信息表
CREATE TABLE IF NOT EXISTS `person` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `person_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '人物唯一标识（如：liubaojun）',
    `name` VARCHAR(100) NOT NULL COMMENT '姓名',
    `subtitle` VARCHAR(500) COMMENT '副标题/职位',
    `image_url` VARCHAR(500) COMMENT '头像图片路径',
    `key_tags` TEXT COMMENT '关键词标签（JSON数组）',
    `data_status` VARCHAR(20) DEFAULT 'draft' COMMENT '数据状态：completed/pending/draft',
    `last_verified` DATE COMMENT '最后验证日期',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_person_id` (`person_id`),
    INDEX `idx_name` (`name`),
    INDEX `idx_data_status` (`data_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物基本信息表';

-- 2. 人物生平传记表
CREATE TABLE IF NOT EXISTS `person_biography` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `person_id` VARCHAR(100) NOT NULL COMMENT '人物ID（关联person.person_id）',
    `title` VARCHAR(200) NOT NULL COMMENT '章节标题',
    `content` TEXT NOT NULL COMMENT '内容（支持HTML）',
    `tags` TEXT COMMENT '标签（JSON数组）',
    `media_type` VARCHAR(50) COMMENT '媒体类型：image/video/audio',
    `media_url` VARCHAR(500) COMMENT '媒体资源URL',
    `needs_verification` TINYINT(1) DEFAULT 0 COMMENT '是否需要验证',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_person_id` (`person_id`),
    FOREIGN KEY (`person_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物生平传记表';

-- 3. 人物关系表
CREATE TABLE IF NOT EXISTS `person_relationship` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `person_id` VARCHAR(100) NOT NULL COMMENT '人物ID（关联person.person_id）',
    `related_person_id` VARCHAR(100) COMMENT '关联人物ID（如果存在）',
    `related_person_name` VARCHAR(100) NOT NULL COMMENT '关联人物姓名',
    `relation_type` VARCHAR(50) COMMENT '关系类型：mentor/student/colleague/family等',
    `relation` VARCHAR(100) COMMENT '关系描述（如：导师、学生、同事）',
    `description` TEXT COMMENT '关系详细描述',
    `needs_verification` TINYINT(1) DEFAULT 0 COMMENT '是否需要验证',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_person_id` (`person_id`),
    INDEX `idx_related_person_id` (`related_person_id`),
    FOREIGN KEY (`person_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物关系表';

-- 4. 人物完整资料表（存储前端展示所需的完整 JSON 数据）
CREATE TABLE IF NOT EXISTS `person_profile` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `person_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '人物ID（关联person.person_id）',
    `profile_json` LONGTEXT NOT NULL COMMENT '完整人物资料JSON（包含时间轴、成就、关系等）',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_profile_person_id` (`person_id`),
    FOREIGN KEY (`person_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物完整资料JSON表';

