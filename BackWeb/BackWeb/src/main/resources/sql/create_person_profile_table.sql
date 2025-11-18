-- 创建 person_profile 表
-- 如果表已存在，此脚本不会报错（使用 IF NOT EXISTS）

USE javawebdb;

-- 创建人物完整资料表（存储前端展示所需的完整 JSON 数据）
CREATE TABLE IF NOT EXISTS `person_profile` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `person_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '人物ID（关联person.person_id）',
    `profile_json` LONGTEXT NOT NULL COMMENT '完整人物资料JSON（包含时间轴、成就、关系等）',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_profile_person_id` (`person_id`),
    FOREIGN KEY (`person_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物完整资料JSON表';

-- 验证表是否创建成功
SELECT 'person_profile 表创建成功！' AS message;

