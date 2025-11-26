-- ============================================
-- AI对话上下文记忆数据库表结构
-- 数据库: javawebdb
-- ============================================

USE javawebdb;

-- 1. 聊天会话表
CREATE TABLE IF NOT EXISTS `chat_session` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `session_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '会话唯一标识',
    `user_id` VARCHAR(100) COMMENT '用户ID',
    `title` VARCHAR(500) COMMENT '会话标题（根据第一个问题生成）',
    `context_summary` TEXT COMMENT '上下文摘要',
    `total_messages` INT DEFAULT 0 COMMENT '消息总数',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    INDEX `idx_session_id` (`session_id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI聊天会话表';

-- 2. 聊天消息表
CREATE TABLE IF NOT EXISTS `chat_message` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `message_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '消息唯一标识',
    `session_id` VARCHAR(100) NOT NULL COMMENT '会话ID',
    `role` VARCHAR(20) NOT NULL COMMENT '角色：user/assistant/system',
    `content` TEXT NOT NULL COMMENT '消息内容',
    `tokens` INT COMMENT '消息token数量',
    `model` VARCHAR(100) COMMENT '使用的模型',
    `temperature` DOUBLE COMMENT '温度参数',
    `referenced_knowledge` TEXT COMMENT '引用的知识库ID（JSON数组）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_message_id` (`message_id`),
    INDEX `idx_session_id` (`session_id`),
    INDEX `idx_role` (`role`),
    INDEX `idx_created_at` (`created_at`),
    FOREIGN KEY (`session_id`) REFERENCES `chat_session`(`session_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI聊天消息表';
