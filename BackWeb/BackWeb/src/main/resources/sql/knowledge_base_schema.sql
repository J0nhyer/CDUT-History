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
INSERT INTO `knowledge_base` (`title`, `content`, `category`, `keywords`, `priority`) VALUES
('成都理工大学简介', 
'成都理工大学坐落于四川省成都市，是教育部与四川省共建的"双一流"建设高校。它以地质、能源、资源科学等学科为显著优势，同时涵盖理、工、文、管等多学科协调发展。在地质勘探、环境科学等领域享有盛誉，是我国地球科学高层次人才培养的重要基地之一。',
'school_history',
'成都理工大学,双一流,地质,能源,资源科学,地球科学',
10),

('学校历史沿革',
'1956年，成都地质勘探学院建校，这是成都理工大学的前身。学校经历多次更名和发展，最终于1993年更名为成都理工学院，2001年正式更名为成都理工大学。',
'school_history',
'建校,1956,成都地质勘探学院,更名,历史',
10),

('优势学科',
'地质学、地质资源与地质工程是学校的王牌学科。学校在地球科学、资源勘查、环境科学、土木工程等领域具有显著优势。拥有多个国家重点学科和省部级重点实验室。',
'discipline',
'地质学,地质资源,地质工程,王牌学科,重点学科',
8),

('校园文化',
'学校秉承"穷究于理，成就于工"的校训，培养了大批地质、能源领域的专业人才。校园内建有地质博物馆，收藏了丰富的地质标本和化石。',
'culture',
'校训,穷究于理成就于工,地质博物馆,校园文化',
7),

('AI助手身份',
'我是成都理工大学的AI校史助手，专门回答关于学校历史、人物、事件等问题。我可以帮助你了解成都理工大学的校史与人物故事。',
'general',
'AI助手,校史,人物,事件',
5);

-- 查看插入的数据
SELECT * FROM `knowledge_base` ORDER BY `priority` DESC, `id` ASC;
