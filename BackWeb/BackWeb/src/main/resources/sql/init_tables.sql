-- ====================================================
-- 初始化数据库表结构
-- ====================================================

USE javawebdb;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `person_relationship`;
DROP TABLE IF EXISTS `person_biography`;
DROP TABLE IF EXISTS `person`;
DROP TABLE IF EXISTS `person_event`;
DROP TABLE IF EXISTS `person_awards`;

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
    `is_visible` TINYINT(1) DEFAULT 1 COMMENT '是否可见',
    `display_order` INT DEFAULT 9999 COMMENT '显示顺序',
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

-- 人物时间轴事件表
CREATE TABLE IF NOT EXISTS `person_event` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `event_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '事件唯一标识（如：person-liubaojun-1931）',
    `person_id` VARCHAR(100) NOT NULL COMMENT '人物ID（关联person.person_id）',
    `person_name` VARCHAR(100) NOT NULL COMMENT '人物姓名',
    `year` VARCHAR(50) NOT NULL COMMENT '年份（如：1956或1956-1958）',
    `month` VARCHAR(20) COMMENT '月份（可选）',
    `day` VARCHAR(20) COMMENT '日期（可选）',
    `title` VARCHAR(500) NOT NULL COMMENT '事件标题',
    `description` TEXT COMMENT '事件详细描述',
    `event_category` VARCHAR(50) COMMENT '事件类别：birth/education/career/achievement/honor/death等',
    `importance` VARCHAR(20) DEFAULT 'medium' COMMENT '重要性：high/medium/low',
    `tags` TEXT COMMENT '标签（JSON数组）',
    `achievements` TEXT COMMENT '相关成就（JSON数组）',
    `media_type` VARCHAR(50) COMMENT '媒体类型：image/video/audio',
    `media_url` VARCHAR(500) COMMENT '媒体资源URL',
    `source` VARCHAR(500) COMMENT '来源',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序（YYYYMMDD格式）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_event_id` (`event_id`),
    INDEX `idx_person_id` (`person_id`),
    INDEX `idx_person_name` (`person_name`),
    INDEX `idx_year` (`year`),
    INDEX `idx_event_category` (`event_category`),
    INDEX `idx_importance` (`importance`),
    INDEX `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物时间轴事件表';

CREATE TABLE IF NOT EXISTS `person_awards` (
  `award_id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '荣誉ID',
  `person_id` VARCHAR(50) NOT NULL COMMENT '人物ID（外键关联person表）',
  `award_name` VARCHAR(200) NOT NULL COMMENT '荣誉名称',
  `award_type` VARCHAR(50) NOT NULL COMMENT '荣誉类型：院士、国家级奖项、省部级奖项、学术职务、教学荣誉、其他',
  `award_level` VARCHAR(20) DEFAULT NULL COMMENT '荣誉级别：国际级、国家级、省部级、校级',
  `award_year` INT DEFAULT NULL COMMENT '获奖年份',
  `award_date` DATE DEFAULT NULL COMMENT '获奖具体日期',
  `awarding_organization` VARCHAR(200) DEFAULT NULL COMMENT '颁奖机构',
  `award_description` TEXT DEFAULT NULL COMMENT '荣誉描述',
  `award_rank` VARCHAR(50) DEFAULT NULL COMMENT '奖项等级（如：特等奖、一等奖、二等奖）',
  `is_major` TINYINT(1) DEFAULT 0 COMMENT '是否为重大荣誉（用于首页展示）',
  `display_order` INT DEFAULT 0 COMMENT '显示顺序',
  `needs_verification` TINYINT(1) DEFAULT 0 COMMENT '是否需要核实',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  INDEX `idx_person_id` (`person_id`),
  INDEX `idx_award_type` (`award_type`),
  INDEX `idx_award_year` (`award_year`),
  INDEX `idx_is_major` (`is_major`),
  
  -- 外键约束
  FOREIGN KEY (`person_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物荣誉成就表';

SET FOREIGN_KEY_CHECKS = 1;

