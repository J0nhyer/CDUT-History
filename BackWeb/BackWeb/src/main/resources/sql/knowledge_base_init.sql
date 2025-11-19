-- ============================================
-- 初始化知识库数据
-- 从现有数据库表中提取知识
-- ============================================

USE javawebdb;

-- 1. 从历史事件表导入知识
INSERT INTO `knowledge_document` (`doc_id`, `title`, `content`, `content_type`, `source_type`, `source_reference`, `tags`, `metadata`, `word_count`)
SELECT 
    CONCAT('doc-history-', `event_id`) AS doc_id,
    `title`,
    CONCAT(
        '年份：', `year`, 
        IF(`month` IS NOT NULL, CONCAT('月：', `month`), ''),
        '\n\n', 
        `title`,
        '\n\n',
        IFNULL(`description`, '')
    ) AS content,
    'text' AS content_type,
    'database' AS source_type,
    'history_event' AS source_reference,
    `tags`,
    JSON_OBJECT(
        'event_type', `event_type`,
        'importance', `importance`,
        'year', `year`,
        'image_url', `image_url`
    ) AS metadata,
    CHAR_LENGTH(CONCAT(`title`, IFNULL(`description`, ''))) AS word_count
FROM `history_event`
WHERE `title` IS NOT NULL
ON DUPLICATE KEY UPDATE 
    `content` = VALUES(`content`),
    `updated_at` = CURRENT_TIMESTAMP;

-- 2. 从人物表导入知识
INSERT INTO `knowledge_document` (`doc_id`, `title`, `content`, `content_type`, `source_type`, `source_reference`, `tags`, `metadata`, `word_count`)
SELECT 
    CONCAT('doc-person-', `person_id`) AS doc_id,
    CONCAT('人物：', `name`) AS title,
    CONCAT(
        '姓名：', `name`,
        '\n',
        '简介：', IFNULL(`subtitle`, ''),
        '\n',
        '标签：', IFNULL(`key_tags`, '')
    ) AS content,
    'text' AS content_type,
    'database' AS source_type,
    'person' AS source_reference,
    `key_tags` AS tags,
    JSON_OBJECT(
        'person_id', `person_id`,
        'data_status', `data_status`,
        'image_url', `image_url`
    ) AS metadata,
    CHAR_LENGTH(CONCAT(`name`, IFNULL(`subtitle`, ''))) AS word_count
FROM `person`
WHERE `name` IS NOT NULL
ON DUPLICATE KEY UPDATE 
    `content` = VALUES(`content`),
    `updated_at` = CURRENT_TIMESTAMP;

-- 3. 从人物生平传记表导入知识
INSERT INTO `knowledge_document` (`doc_id`, `title`, `content`, `content_type`, `source_type`, `source_reference`, `tags`, `metadata`, `word_count`)
SELECT 
    CONCAT('doc-biography-', pb.`id`) AS doc_id,
    CONCAT('人物传记：', p.`name`, ' - ', pb.`title`) AS title,
    CONCAT(
        '人物：', p.`name`,
        '\n',
        '章节：', pb.`title`,
        '\n\n',
        pb.`content`
    ) AS content,
    'html' AS content_type,
    'database' AS source_type,
    'person_biography' AS source_reference,
    pb.`tags`,
    JSON_OBJECT(
        'person_id', pb.`person_id`,
        'person_name', p.`name`,
        'media_type', pb.`media_type`,
        'media_url', pb.`media_url`
    ) AS metadata,
    CHAR_LENGTH(pb.`content`) AS word_count
FROM `person_biography` pb
JOIN `person` p ON pb.`person_id` = p.`person_id`
WHERE pb.`content` IS NOT NULL
ON DUPLICATE KEY UPDATE 
    `content` = VALUES(`content`),
    `updated_at` = CURRENT_TIMESTAMP;

-- 4. 从人物时间轴事件表导入知识
INSERT INTO `knowledge_document` (`doc_id`, `title`, `content`, `content_type`, `source_type`, `source_reference`, `tags`, `metadata`, `word_count`)
SELECT 
    CONCAT('doc-person-event-', `event_id`) AS doc_id,
    CONCAT('人物事件：', `person_name`, ' - ', `title`) AS title,
    CONCAT(
        '人物：', `person_name`,
        '\n',
        '年份：', `year`,
        IF(`month` IS NOT NULL, CONCAT(' 月份：', `month`), ''),
        '\n',
        '事件：', `title`,
        '\n\n',
        IFNULL(`description`, '')
    ) AS content,
    'text' AS content_type,
    'database' AS source_type,
    'person_event' AS source_reference,
    `tags`,
    JSON_OBJECT(
        'person_id', `person_id`,
        'person_name', `person_name`,
        'event_category', `event_category`,
        'importance', `importance`,
        'year', `year`,
        'media_url', `media_url`
    ) AS metadata,
    CHAR_LENGTH(CONCAT(`title`, IFNULL(`description`, ''))) AS word_count
FROM `person_event`
WHERE `title` IS NOT NULL
ON DUPLICATE KEY UPDATE 
    `content` = VALUES(`content`),
    `updated_at` = CURRENT_TIMESTAMP;

-- 5. 关联文档到类别
-- 历史事件归类到"重大事件"
INSERT INTO `knowledge_doc_category` (`doc_id`, `category_id`)
SELECT CONCAT('doc-history-', `event_id`), 'cat-major-events'
FROM `history_event`
WHERE `event_id` IS NOT NULL
ON DUPLICATE KEY UPDATE `doc_id` = VALUES(`doc_id`);

-- 人物归类到"杰出人物"
INSERT INTO `knowledge_doc_category` (`doc_id`, `category_id`)
SELECT CONCAT('doc-person-', `person_id`), 'cat-famous-people'
FROM `person`
WHERE `person_id` IS NOT NULL
ON DUPLICATE KEY UPDATE `doc_id` = VALUES(`doc_id`);

-- 人物传记归类到"杰出人物"
INSERT INTO `knowledge_doc_category` (`doc_id`, `category_id`)
SELECT CONCAT('doc-biography-', `id`), 'cat-famous-people'
FROM `person_biography`
WHERE `id` IS NOT NULL
ON DUPLICATE KEY UPDATE `doc_id` = VALUES(`doc_id`);

-- 人物事件归类到"杰出人物"
INSERT INTO `knowledge_doc_category` (`doc_id`, `category_id`)
SELECT CONCAT('doc-person-event-', `event_id`), 'cat-famous-people'
FROM `person_event`
WHERE `event_id` IS NOT NULL
ON DUPLICATE KEY UPDATE `doc_id` = VALUES(`doc_id`);

-- 更新知识库文档的embedding状态为completed（简化处理，实际应该做向量化）
UPDATE `knowledge_document` SET `embedding_status` = 'completed';

-- 统计信息
SELECT 
    '✓ 知识库初始化完成' AS status,
    (SELECT COUNT(*) FROM `knowledge_document`) AS total_documents,
    (SELECT COUNT(*) FROM `knowledge_document` WHERE `source_reference` = 'history_event') AS history_docs,
    (SELECT COUNT(*) FROM `knowledge_document` WHERE `source_reference` = 'person') AS person_docs,
    (SELECT COUNT(*) FROM `knowledge_document` WHERE `source_reference` = 'person_biography') AS biography_docs,
    (SELECT COUNT(*) FROM `knowledge_document` WHERE `source_reference` = 'person_event') AS person_event_docs;
