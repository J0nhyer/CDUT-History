-- ============================================
-- 更新所有人物的awards字段和data_status
-- 数据库: javawebdb
-- ============================================

USE javawebdb;

-- 更新主要人物的awards和status
UPDATE `person` SET `awards` = '["中国工程院院士", "生态环境部部长", "地质灾害防治专家", "国家级教学名师"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'huangrunqiu';
UPDATE `person` SET `awards` = '["中国科学院院士（2013年）", "地质学博士（2012年）", "李四光地质科学奖", "全国优秀博士学位论文、全国百篇优秀博士论文", "国际古地理奖", "\"原型盆地-原型成盆模式\"成因理论", "北京大学地球与空间科学学院教授"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'wangchengshan';
UPDATE `person` SET `awards` = '["中国工程院院士（第一位藏族院士）", "羊八井地热田勘查主要完成人", "西藏地热资源开发专家", "成都理工大学杰出校友"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'duoji';
UPDATE `person` SET `awards` = '["沉积地质学奠基人之一", "沉积学教材主编", "华南地区沉积学研究专家", "培养大批沉积地质学人才"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'zengyunfu';
UPDATE `person` SET `awards` = '["1960年参加国家登山队", "1964年5月登顶慕士塔格峰（7546米）英雄纪录", "1975年攀登珠穆朗玛峰时英勇牺牲", "追授为革命烈士、追授为革命烈士"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'wuzongyue';
UPDATE `person` SET `awards` = '["中国科学院院士（1991年）", "第三世界科学院院士（1999年）", "中国地震局地球物理研究所所长（1986-2000年）", "全国科学大会奖（1978年）", "国际数字地震台网联合会（FDSN）副主席", "中国地震学会理事长", "地震震源理论研究先驱者", "数字地震学在中国的开拓者"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'chenyuntai';
UPDATE `person` SET `awards` = '["成都理工大学党委书记", "教育部长江学者特聘教授", "院士有效候选人（2017、2019年）", "国家科技进步特等奖1项、二等奖2项", "何梁何利基金科学与技术进步奖", "发表论文180余篇，授权发明专利60余件"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'liuqinyou';
UPDATE `person` SET `awards` = '["1936年发现攀枝花钒钛磁铁矿", "成都地质学院五大奠基人之一", "沉积地质学奠基人", "地质教育先驱"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'changlongqing';
UPDATE `person` SET `awards` = '["地质教育先驱者", "西部地区地质研究专家", "地质学教材主编", "培养大批地质人才"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'lichengsan';
UPDATE `person` SET `awards` = '["成都理工大学校长", "国家杰出青年科学基金获得者、长江学者", "全国杰出专业技术人才", "国家科技进步一等奖2项、二等奖1项", "发表论文500余篇"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'xuqiang';
UPDATE `person` SET `awards` = '["国家杰出青年科学基金获得者", "核探测技术专家、第三世界科学院院士", "国家科技进步奖"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'tuoxianguo';
UPDATE `person` SET `awards` = '["国家杰出青年科学基金获得者（2021年）", "百千万人才工程入选者", "国际交流与合作处处长", "国家重点实验室副主任", "成功预警上百起大型地质灾害"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'fanxuanmei';
UPDATE `person` SET `awards` = '["瓦尔特奖章获得者（2024年，首位中国科学家）", "国家杰出青年科学基金获得者（2018年）", "国家\"万人计划\"科技创新领军人才", "沉积地质研究院院长", "Nature等顶级期刊发表论文", "侯德封奖获得者"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'lichao';
UPDATE `person` SET `awards` = '["国家杰出青年科学基金获得者", "功能材料专家", "高水平论文发表", "产学研合作成果"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'pengqiang';
UPDATE `person` SET `awards` = '["国家杰出青年科学基金获得者（2022年）", "国家优秀青年科学基金获得者（2018年）", "国际大滑坡协会秘书长", "国家科技进步奖二等奖（2019年）", "《Engineering Geology》编委", "在PNAS、Geology等顶级期刊发表论文"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'huwei';
UPDATE `person` SET `awards` = '["国家百千万人才工程人选", "油气地质学家", "国家科技进步奖获得者", "能源学院学科带头人"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'liushugen';
UPDATE `person` SET `awards` = '["国家百千万人才工程人选", "地质灾害风险评估专家", "省部级科技奖励获得者", "环境与土木工程学院学科带头人"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'tangchuan';
UPDATE `person` SET `awards` = '["中国科学院院士", "地质灾害防治专家", "山地灾害风险评估方法创建者", "汶川地震灾害评估专家"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'cuipeng';
UPDATE `person` SET `awards` = '["全国高校黄大年式教师团队负责人", "核探测技术专家", "省部级科技奖励获得者", "优秀教师"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'geliangquan';
UPDATE `person` SET `awards` = '["中国首位大洋科考女首席科学家", "海洋地质学家", "大洋矿产资源勘查专家", "成都理工大学杰出校友"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'hanxiqiu';
UPDATE `person` SET `awards` = '["中国科学院院士", "矿床地质学家", "华南地区矿床成矿规律研究专家", "国家自然科学奖获得者"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'huruizhong';

-- 更新张倬元的awards
UPDATE `person` SET `awards` = '["工程地质学奠基人", "成都地质学院院长（1983-1988年）", "国家重点学科创建人", "地质灾害防治先驱者"]', `data_status` = 'completed', `last_verified` = '2025-11-19' WHERE `person_id` = 'zhangzhuoyuan';

-- 完成更新
SELECT '已完成所有重要人物的awards和status更新' AS result;
