-- 更新人物图片路径
-- 使用 person_id 字段（字符串类型）而不是 id 字段（数字类型）
-- 图片路径格式：persons/文件名

-- 更新所有PNG格式的人物图片
UPDATE person_profile SET image = 'persons/changlongqing.png' WHERE person_id = 'changlongqing';
UPDATE person_profile SET image = 'persons/chenyutai.png' WHERE person_id = 'chenyutai';
UPDATE person_profile SET image = 'persons/duoji.png' WHERE person_id = 'duoji';
UPDATE person_profile SET image = 'persons/fanxuanmei.png' WHERE person_id = 'fanxuanmei';
UPDATE person_profile SET image = 'persons/huangrunqiu.png' WHERE person_id = 'huangrunqiu';
UPDATE person_profile SET image = 'persons/huiwei.png' WHERE person_id = 'huiwei';
UPDATE person_profile SET image = 'persons/jinjingfu.png' WHERE person_id = 'jinjingfu';
UPDATE person_profile SET image = 'persons/junengpan.png' WHERE person_id = 'junengpan';
UPDATE person_profile SET image = 'persons/lichao.png' WHERE person_id = 'lichao';
UPDATE person_profile SET image = 'persons/lichengsan.png' WHERE person_id = 'lichengsan';
UPDATE person_profile SET image = 'persons/litangmi.png' WHERE person_id = 'litangmi';
UPDATE person_profile SET image = 'persons/litianbin.png' WHERE person_id = 'litianbin';
UPDATE person_profile SET image = 'persons/litianfu.png' WHERE person_id = 'litianfu';
UPDATE person_profile SET image = 'persons/liubaojun.png' WHERE person_id = 'liubaojun';
UPDATE person_profile SET image = 'persons/liugeng.png' WHERE person_id = 'liugeng';
UPDATE person_profile SET image = 'persons/liuqingyou.png' WHERE person_id = 'liuqingyou';
UPDATE person_profile SET image = 'persons/liushugen.png' WHERE person_id = 'liushugen';
UPDATE person_profile SET image = 'persons/liuzuyi.png' WHERE person_id = 'liuzuyi';
UPDATE person_profile SET image = 'persons/liyong.png' WHERE person_id = 'liyong';
UPDATE person_profile SET image = 'persons/lizhichang.png' WHERE person_id = 'lizhichang';
UPDATE person_profile SET image = 'persons/lizhongquan.png' WHERE person_id = 'lizhongquan';
UPDATE person_profile SET image = 'persons/luozhetan.png' WHERE person_id = 'luozhetan';
UPDATE person_profile SET image = 'persons/peixiangjun.png' WHERE person_id = 'peixiangjun';
UPDATE person_profile SET image = 'persons/pengqiang.png' WHERE person_id = 'pengqiang';
UPDATE person_profile SET image = 'persons/sutao.png' WHERE person_id = 'sutao';
UPDATE person_profile SET image = 'persons/tangchuan.png' WHERE person_id = 'tangchuan';
UPDATE person_profile SET image = 'persons/tangjuxing.png' WHERE person_id = 'tangjuxing';
UPDATE person_profile SET image = 'persons/tuoxianguo.png' WHERE person_id = 'tuoxianguo';
UPDATE person_profile SET image = 'persons/wangchengshan.png' WHERE person_id = 'wangchengshan';
UPDATE person_profile SET image = 'persons/wuyansheng.png' WHERE person_id = 'wuyansheng';
UPDATE person_profile SET image = 'persons/wuzongyue.png' WHERE person_id = 'wuzongyue';
UPDATE person_profile SET image = 'persons/xuqiang.png' WHERE person_id = 'xuqiang';
UPDATE person_profile SET image = 'persons/zengyunfu.png' WHERE person_id = 'zengyunfu';
UPDATE person_profile SET image = 'persons/zhangyanseng.png' WHERE person_id = 'zhangyanseng';
UPDATE person_profile SET image = 'persons/zhangzhuoyuan.png' WHERE person_id = 'zhangzhuoyuan';
UPDATE person_profile SET image = 'persons/zhaoyuyan.png' WHERE person_id = 'zhaoyuyan';
UPDATE person_profile SET image = 'persons/zhouxiaohe.png' WHERE person_id = 'zhouxiaohe';

-- 更新JPG格式的人物图片（如果有PNG版本优先使用PNG，这里是备用）
UPDATE person_profile SET image = 'persons/liuqingyou.jpg' WHERE person_id = 'liuqingyou' AND image IS NULL;
UPDATE person_profile SET image = 'persons/peixiangjun.jpg' WHERE person_id = 'peixiangjun' AND image IS NULL;

-- 设置默认图片（如果某些人物没有对应图片）
UPDATE person_profile SET image = 'persons/unknown.png' WHERE image IS NULL OR image = '';

-- 查询更新结果
SELECT person_id, name, image FROM person_profile ORDER BY person_id;
