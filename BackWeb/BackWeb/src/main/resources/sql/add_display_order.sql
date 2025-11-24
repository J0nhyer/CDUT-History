-- 添加display_order字段到person表
-- 用于控制人物在前端的显示顺序（数字越小，优先级越高）

USE javawebdb;

-- 添加display_order字段
ALTER TABLE `person` 
ADD COLUMN `display_order` INT DEFAULT 9999 COMMENT '显示顺序（数字越小优先级越高，9999表示默认顺序）' 
AFTER `is_visible`;

-- 添加索引
ALTER TABLE `person` 
ADD INDEX `idx_display_order` (`display_order`);

-- 更新现有人物的display_order
-- 优先级顺序：许强校长 -> 新晋院士 -> 五大学科奠基人 -> 八大教授 -> 其他按字母顺序

UPDATE `person` SET `display_order` = 1 WHERE `person_id` = 'xuqiang';
UPDATE `person` SET `display_order` = 2 WHERE `person_id` = 'xiongshengqing';
UPDATE `person` SET `display_order` = 3 WHERE `person_id` = 'zhangzhuoyuan';
UPDATE `person` SET `display_order` = 4 WHERE `person_id` = 'luozhetan';
UPDATE `person` SET `display_order` = 5 WHERE `person_id` = 'liubaojun';
UPDATE `person` SET `display_order` = 6 WHERE `person_id` = 'jinjingfu';
UPDATE `person` SET `display_order` = 7 WHERE `person_id` = 'zengyunfu';
UPDATE `person` SET `display_order` = 8 WHERE `person_id` = 'zhangyanseng';
UPDATE `person` SET `display_order` = 9 WHERE `person_id` = 'liuzuyi';
UPDATE `person` SET `display_order` = 10 WHERE `person_id` = 'zhouxiaohe';
UPDATE `person` SET `display_order` = 11 WHERE `person_id` = 'lizhichang';
UPDATE `person` SET `display_order` = 12 WHERE `person_id` = 'wuyansheng';
UPDATE `person` SET `display_order` = 13 WHERE `person_id` = 'litangmi';
UPDATE `person` SET `display_order` = 14 WHERE `person_id` = 'changlongqing';
UPDATE `person` SET `display_order` = 15 WHERE `person_id` = 'lichengsan';

-- 其他院士和重要人物
UPDATE `person` SET `display_order` = 20 WHERE `person_id` = 'huangrunqiu';
UPDATE `person` SET `display_order` = 21 WHERE `person_id` = 'wangchengshan';
UPDATE `person` SET `display_order` = 22 WHERE `person_id` = 'duoji';
UPDATE `person` SET `display_order` = 23 WHERE `person_id` = 'chenyuntai';
UPDATE `person` SET `display_order` = 24 WHERE `person_id` = 'tangjuxing';

-- 其他所有人物保持默认值9999，按字母顺序排列

SELECT '✅ display_order字段添加成功！' AS message;
