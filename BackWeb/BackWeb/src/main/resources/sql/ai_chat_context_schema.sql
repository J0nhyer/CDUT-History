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

-- 3. 知识库文档表
CREATE TABLE IF NOT EXISTS `knowledge_document` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `doc_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '文档唯一标识',
    `title` VARCHAR(500) NOT NULL COMMENT '文档标题',
    `content` LONGTEXT NOT NULL COMMENT '文档内容',
    `content_type` VARCHAR(50) DEFAULT 'text' COMMENT '内容类型：text/markdown/html',
    `source_type` VARCHAR(50) COMMENT '来源类型：manual/import/crawl/database',
    `source_reference` VARCHAR(500) COMMENT '来源引用（如数据库表名、URL等）',
    `tags` TEXT COMMENT '标签（JSON数组）',
    `metadata` TEXT COMMENT '元数据（JSON对象）',
    `embedding_status` VARCHAR(20) DEFAULT 'pending' COMMENT '向量化状态：pending/processing/completed/failed',
    `word_count` INT COMMENT '字数统计',
    `view_count` INT DEFAULT 0 COMMENT '查看次数',
    `reference_count` INT DEFAULT 0 COMMENT '被引用次数',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_doc_id` (`doc_id`),
    INDEX `idx_source_type` (`source_type`),
    INDEX `idx_embedding_status` (`embedding_status`),
    INDEX `idx_created_at` (`created_at`),
    FULLTEXT INDEX `idx_fulltext_content` (`title`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文档表';

-- 4. 知识库向量索引表（可选，用于向量检索）
CREATE TABLE IF NOT EXISTS `knowledge_embedding` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `doc_id` VARCHAR(100) NOT NULL COMMENT '文档ID',
    `chunk_index` INT NOT NULL COMMENT '文档分块索引',
    `chunk_text` TEXT NOT NULL COMMENT '分块文本',
    `embedding_vector` TEXT COMMENT '向量数据（JSON数组或二进制）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_doc_id` (`doc_id`),
    FOREIGN KEY (`doc_id`) REFERENCES `knowledge_document`(`doc_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库向量索引表';

-- 5. 知识库类别表
CREATE TABLE IF NOT EXISTS `knowledge_category` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `category_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '类别唯一标识',
    `name` VARCHAR(200) NOT NULL COMMENT '类别名称',
    `description` TEXT COMMENT '类别描述',
    `parent_id` VARCHAR(100) COMMENT '父类别ID',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库类别表';

-- 6. 文档类别关联表
CREATE TABLE IF NOT EXISTS `knowledge_doc_category` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `doc_id` VARCHAR(100) NOT NULL COMMENT '文档ID',
    `category_id` VARCHAR(100) NOT NULL COMMENT '类别ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_doc_category` (`doc_id`, `category_id`),
    INDEX `idx_doc_id` (`doc_id`),
    INDEX `idx_category_id` (`category_id`),
    FOREIGN KEY (`doc_id`) REFERENCES `knowledge_document`(`doc_id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `knowledge_category`(`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文档类别关联表';

-- 插入默认知识库类别
INSERT INTO `knowledge_category` (`category_id`, `name`, `description`, `sort_order`) VALUES
('cat-school-history', '学校历史', '成都理工大学历史沿革、发展历程', 1),
('cat-famous-people', '杰出人物', '学校历史上的杰出人物、校友', 2),
('cat-major-events', '重大事件', '学校发展过程中的重大事件', 3),
('cat-academic', '学术成就', '学校的学术研究成果和荣誉', 4),
('cat-campus', '校园文化', '校园建筑、文化活动等', 5),
('cat-general', '综合信息', '其他综合性信息', 99)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

SELECT '✓ AI对话上下文记忆数据库表结构创建完成' AS status;
