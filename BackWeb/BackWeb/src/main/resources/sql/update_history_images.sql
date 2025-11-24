-- ============================================
-- 更新历史事件图片路径
-- 数据库: javawebdb
-- ============================================

USE javawebdb;

-- 更新历史事件的图片路径，使用assets/history文件夹中的图片
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102912.jpg' WHERE `event_id` = 'event-1956';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102915.jpg' WHERE `event_id` = 'event-1958';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102p0.jpg' WHERE `event_id` = 'event-1990';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102k0.jpg' WHERE `event_id` = 'event-1993';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102p2.jpg' WHERE `event_id` = 'event-1995';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102p6.jpg' WHERE `event_id` = 'event-2000';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102k1.jpg' WHERE `event_id` = 'event-2001';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102p9.jpg' WHERE `event_id` = 'event-2005';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102q2.jpg' WHERE `event_id` = 'event-2007';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102q4.jpg' WHERE `event_id` = 'event-2008';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102k3.jpg' WHERE `event_id` = 'event-2010';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102q7.jpg' WHERE `event_id` = 'event-2011';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102q9.jpg' WHERE `event_id` = 'event-2012';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102r0.jpg' WHERE `event_id` = 'event-2013';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102r2.jpg' WHERE `event_id` = 'event-2015';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102r3.jpg' WHERE `event_id` = 'event-2016';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102r5.jpg' WHERE `event_id` = 'event-2019';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102r6.jpg' WHERE `event_id` = 'event-2020';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102r7.jpg' WHERE `event_id` = 'event-2022';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102r8.jpg' WHERE `event_id` = 'event-2023';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102r9.jpg' WHERE `event_id` = 'event-2024';
UPDATE `history_event` SET `image_url` = '@/assets/history/1-160123102s3.jpg' WHERE `event_id` = 'event-2025';

-- 查看更新结果
SELECT `event_id`, `year`, `title`, `image_url` FROM `history_event` ORDER BY `year`;
