-- ============================================
-- 成都理工大学历史事件数据库表结构
-- 数据库: javawebdb
-- ============================================

USE javawebdb;

-- 历史大事记表
CREATE TABLE IF NOT EXISTS `history_event` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `event_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '事件唯一标识（如：event-1956）',
    `year` VARCHAR(50) NOT NULL COMMENT '年份（如：1956或1956-1958）',
    `month` VARCHAR(20) COMMENT '月份（可选）',
    `day` VARCHAR(20) COMMENT '日期（可选）',
    `title` VARCHAR(500) NOT NULL COMMENT '事件标题',
    `description` TEXT COMMENT '事件详细描述',
    `event_type` VARCHAR(50) COMMENT '事件类型：founding/development/milestone/achievement等',
    `importance` VARCHAR(20) DEFAULT 'medium' COMMENT '重要性：high/medium/low',
    `tags` TEXT COMMENT '标签（JSON数组）',
    `achievements` TEXT COMMENT '重要成就（JSON数组）',
    `image_url` VARCHAR(500) COMMENT '事件图片URL',
    `source` VARCHAR(500) COMMENT '来源',
    `needs_verification` TINYINT(1) DEFAULT 0 COMMENT '是否需要验证',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_event_id` (`event_id`),
    INDEX `idx_year` (`year`),
    INDEX `idx_event_type` (`event_type`),
    INDEX `idx_importance` (`importance`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='历史大事记表';

