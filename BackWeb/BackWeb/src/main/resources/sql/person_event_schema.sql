-- ============================================
-- 人物时间轴事件数据库表结构
-- 数据库: javawebdb
-- ============================================

USE javawebdb;

-- 清空已存在的人物时间轴事件表
DROP TABLE IF EXISTS `person_event`;

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
