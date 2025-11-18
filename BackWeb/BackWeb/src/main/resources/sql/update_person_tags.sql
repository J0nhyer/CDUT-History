-- ====================================================
-- 更新person表的key_tags字段
-- 为所有人物添加学科、年代、成就标签
-- ====================================================

USE javawebdb;

-- 更新现有人物的key_tags
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","院士","奖项人"]' WHERE `person_id` = 'liubaojun';
UPDATE `person` SET `key_tags` = '["地质学","工程学","20世纪初","教授","奖项人"]' WHERE `person_id` = 'zhangzhuoyuan';
UPDATE `person` SET `key_tags` = '["地质学","环境","20世纪中","院士"]' WHERE `person_id` = 'huangrunqiu';
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","院士"]' WHERE `person_id` = 'wangchengshan';
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","院士"]' WHERE `person_id` = 'duoji';
UPDATE `person` SET `key_tags` = '["地质学","20世纪初","教授"]' WHERE `person_id` = 'zengyunfu';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'wuzongyue';
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","院士"]' WHERE `person_id` = 'chenyuntai';
UPDATE `person` SET `key_tags` = '["石油","工程学","20世纪中","教授"]' WHERE `person_id` = 'liuqinyou';
UPDATE `person` SET `key_tags` = '["地质学","20世纪初","教授"]' WHERE `person_id` = 'changlongqing';
UPDATE `person` SET `key_tags` = '["石油","地质学","20世纪初","教授"]' WHERE `person_id` = 'lichengsan';
UPDATE `person` SET `key_tags` = '["地质学","环境","20世纪中","教授"]' WHERE `person_id` = 'xuqiang';
UPDATE `person` SET `key_tags` = '["工程学","20世纪中","教授"]' WHERE `person_id` = 'tuoxianguo';
UPDATE `person` SET `key_tags` = '["地质学","环境","21世纪","教授"]' WHERE `person_id` = 'fanxuanmei';
UPDATE `person` SET `key_tags` = '["地质学","21世纪","教授","奖项人"]' WHERE `person_id` = 'lichao';
UPDATE `person` SET `key_tags` = '["工程学","21世纪","教授"]' WHERE `person_id` = 'pengqiang';
UPDATE `person` SET `key_tags` = '["地质学","环境","20世纪中","教授"]' WHERE `person_id` = 'huwei';
UPDATE `person` SET `key_tags` = '["石油","地质学","20世纪中","教授"]' WHERE `person_id` = 'liushugen';
UPDATE `person` SET `key_tags` = '["地质学","环境","20世纪中","教授"]' WHERE `person_id` = 'tangchuan';
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","教授"]' WHERE `person_id` = 'chenweidong';
UPDATE `person` SET `key_tags` = '["地质学","环境","20世纪中","院士"]' WHERE `person_id` = 'cuipeng';
UPDATE `person` SET `key_tags` = '["工程学","20世纪中","教授"]' WHERE `person_id` = 'geliangquan';
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","教授"]' WHERE `person_id` = 'hanxiqiu';
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","教授"]' WHERE `person_id` = 'houmingcai';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'hubing';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'huchangsheng';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'huguangjie';
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","院士"]' WHERE `person_id` = 'huruizhong';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'huangqi';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'laijiao';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'libin';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'liwei';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'lixiaoming';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'liujun';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'liuyong';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'liuyun';
UPDATE `person` SET `key_tags` = '["工程学","20世纪中","教授"]' WHERE `person_id` = 'luoqiang';
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","教授"]' WHERE `person_id` = 'nishijun';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'shizejin';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'sunming';
UPDATE `person` SET `key_tags` = '["地质学","20世纪中","教授"]' WHERE `person_id` = 'tangjuxing';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'tangqingli';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'wanghai';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'wangjun';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'wangli';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'wangming';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'xudachun';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'yixiangyi';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'zhanghua';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'zhangli';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'zhangminghua';
UPDATE `person` SET `key_tags` = '["石油","地质学","20世纪中","教授"]' WHERE `person_id` = 'zhangshuichang';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'zhangwentao';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'zhaoyuan';
UPDATE `person` SET `key_tags` = '["其他","20世纪中"]' WHERE `person_id` = 'zhouyong';

SELECT '标签更新完成' AS status;
SELECT COUNT(*) AS updated_count FROM person WHERE key_tags IS NOT NULL;
