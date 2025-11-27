-- ====================================================
-- 成都理工大学校史项目数据库表结构 - 完整版
-- 数据库: javawebdb
-- 说明: 集成所有模块的表结构定义
-- ====================================================

USE javawebdb;

SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================
-- 删除所有旧表（按依赖关系逆序删除）
-- ====================================================

-- 人物系统模块表
DROP TABLE IF EXISTS `person_awards`;
DROP TABLE IF EXISTS `person_event`;
DROP TABLE IF EXISTS `person_relationship`;
DROP TABLE IF EXISTS `person_biography`;
DROP TABLE IF EXISTS `person`;

-- 学术星图模块表
DROP TABLE IF EXISTS `academic_major`;
DROP TABLE IF EXISTS `academic_node`;
DROP TABLE IF EXISTS `academic_universe`;

-- AI对话模块表
DROP TABLE IF EXISTS `chat_message`;
DROP TABLE IF EXISTS `chat_session`;

-- 历史事件模块表
DROP TABLE IF EXISTS `history_event`;

-- 知识库模块表
DROP TABLE IF EXISTS `knowledge_base`;

-- 用户登录表
DROP TABLE IF EXISTS `login`;

-- ====================================================
-- 第一部分: 人物系统模块
-- ====================================================

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

-- 人物荣誉成就表
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
  
  INDEX `idx_person_id` (`person_id`),
  INDEX `idx_award_type` (`award_type`),
  INDEX `idx_award_year` (`award_year`),
  INDEX `idx_is_major` (`is_major`),
  
  FOREIGN KEY (`person_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物荣誉成就表';

-- ====================================================
-- 第二部分: 学术星图模块
-- ====================================================

-- 学术星图大学信息表
CREATE TABLE IF NOT EXISTS `academic_universe` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `university_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '大学唯一标识（如：cdut）',
    `name` VARCHAR(200) NOT NULL COMMENT '大学名称',
    `type` VARCHAR(50) DEFAULT 'university' COMMENT '类型：university',
    `position_x` DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'X坐标位置',
    `position_y` DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Y坐标位置',
    `position_z` DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Z坐标位置',
    `size` DECIMAL(10, 2) DEFAULT 3.00 COMMENT '大小',
    `description` TEXT COMMENT '描述',
    `color` VARCHAR(20) DEFAULT '0xffaa00' COMMENT '颜色（十六进制）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_university_id` (`university_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学术星图大学信息表';

-- 学术星图节点表（学院/研究院/实验室）
CREATE TABLE IF NOT EXISTS `academic_node` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `node_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '节点唯一标识（如：u01）',
    `name` VARCHAR(500) NOT NULL COMMENT '节点名称',
    `type` VARCHAR(50) DEFAULT 'small_star' COMMENT '节点类型：small_star/lab/institute等',
    `position_x` DECIMAL(10, 2) NOT NULL COMMENT 'X坐标位置',
    `position_y` DECIMAL(10, 2) NOT NULL COMMENT 'Y坐标位置',
    `position_z` DECIMAL(10, 2) NOT NULL COMMENT 'Z坐标位置',
    `size` DECIMAL(10, 2) NOT NULL COMMENT '大小',
    `color` VARCHAR(20) NOT NULL COMMENT '颜色（十六进制）',
    `title` VARCHAR(500) COMMENT '标题',
    `description` TEXT COMMENT '描述',
    `style_glow` DECIMAL(5, 2) DEFAULT 0.60 COMMENT '发光强度（0-1.2）',
    `style_ring` TINYINT(1) DEFAULT 0 COMMENT '是否有光环：0-否，1-是',
    `style_shape` VARCHAR(50) COMMENT '形状：sphere/hex/diamond/triangle等',
    `start_year` INT COMMENT '起始年份（用于时间轴显示）',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_node_id` (`node_id`),
    INDEX `idx_type` (`type`),
    INDEX `idx_start_year` (`start_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学术星图节点表';

-- 学术星图专业表
CREATE TABLE IF NOT EXISTS `academic_major` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `node_id` VARCHAR(100) NOT NULL COMMENT '节点ID（关联academic_node.node_id）',
    `major_id` VARCHAR(100) NOT NULL COMMENT '专业唯一标识（如：u03-m1）',
    `name` VARCHAR(200) NOT NULL COMMENT '专业名称',
    `level` VARCHAR(50) COMMENT '专业层次：本科/研究生/博士等',
    `color` VARCHAR(20) COMMENT '专业颜色（十六进制，可选）',
    `description` TEXT COMMENT '专业描述',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_node_id` (`node_id`),
    INDEX `idx_major_id` (`major_id`),
    FOREIGN KEY (`node_id`) REFERENCES `academic_node`(`node_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学术星图专业表';

-- ====================================================
-- 第三部分: AI对话上下文模块
-- ====================================================

-- 聊天会话表
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

-- 聊天消息表
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

-- ====================================================
-- 第四部分: 历史事件模块
-- ====================================================

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

-- ====================================================
-- 第五部分: 知识库模块
-- ====================================================

-- 创建知识库表
CREATE TABLE `knowledge_base` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` VARCHAR(200) NOT NULL COMMENT '知识块标题',
  `content` TEXT NOT NULL COMMENT '知识内容',
  `category` VARCHAR(50) DEFAULT 'general' COMMENT '分类：school_history(学校历史), person(人物), event(事件), discipline(学科), culture(校园文化), general(通用)',
  `keywords` VARCHAR(500) COMMENT '关键词，逗号分隔',
  `priority` INT DEFAULT 1 COMMENT '优先级/权重，数值越大优先级越高',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_priority` (`priority` DESC),
  FULLTEXT INDEX `ft_title_content` (`title`, `content`) WITH PARSER ngram COMMENT '全文索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI知识库表';

-- ====================================================
-- 第六部分: 用户登录模块
-- ====================================================

-- 用户登录表
CREATE TABLE IF NOT EXISTS `login` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================
-- 表结构创建完成
-- ====================================================
