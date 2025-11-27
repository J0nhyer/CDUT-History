-- 知识库表
USE javawebdb;

-- 删除已存在的表
DROP TABLE IF EXISTS `knowledge_base`;

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

-- 插入初始数据（从原 knowledge-base.txt 迁移）

-- 查看插入的数据
SELECT * FROM `knowledge_base` ORDER BY `priority` DESC, `id` ASC;
