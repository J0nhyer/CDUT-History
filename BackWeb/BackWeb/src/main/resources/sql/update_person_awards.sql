-- ============================================
-- 人物奖项成就数据更新
-- 提取自biography的主要成就
-- ============================================

USE javawebdb;

-- duoji: 4个成就
-- zengyunfu: 4个成就
-- changlongqing: 4个成就
-- chenweidong: 4个成就
-- chenyuntai: 8个成就
-- cuipeng: 4个成就
-- duoji: 4个成就
-- fanxuanmei: 5个成就
-- geliangquan: 4个成就
-- hanxiqiu: 4个成就
-- houmingcai: 4个成就
-- hubing: 4个成就
-- huchangsheng: 4个成就
-- huguangjie: 4个成就
-- huruizhong: 4个成就
-- huwei: 6个成就
-- huangqi: 4个成就
-- huangrunqiu: 4个成就
-- laijiao: 4个成就
-- libin: 4个成就
-- lichao: 6个成就
-- lichengsan: 4个成就
-- liwei: 4个成就
-- lixiaoming: 4个成就
-- liubaojun: 4个成就
-- liujun: 4个成就
-- liuqinyou: 6个成就
-- liushugen: 4个成就
-- liuyong: 4个成就
-- liuyun: 4个成就
-- luoqiang: 4个成就
-- nishijun: 4个成就
-- pengqiang: 4个成就
-- shizejin: 4个成就
-- sunming: 4个成就
-- tangchuan: 4个成就
-- tangjuxing: 4个成就
-- tangqingli: 4个成就
-- tuoxianguo: 4个成就
-- wangchengshan: 7个成就
-- wanghai: 4个成就
-- wangjun: 4个成就
-- wangli: 4个成就
-- wangming: 4个成就
-- wuzongyue: 4个成就
-- xudachun: 4个成就
-- xuqiang: 5个成就
-- yixiangyi: 4个成就
-- zhanghua: 4个成就
-- zhangli: 4个成就
-- zhangminghua: 4个成就
-- zhangshuichang: 4个成就
-- zhangwentao: 4个成就
-- zhangzhuoyuan: 4个成就
-- zhaoyuan: 4个成就
-- zhouyong: 4个成就

UPDATE `person` SET `awards` = '["中国工程院院士（第一位藏族院士）", "羊八井地热田勘查主要完成人", "西藏地热资源开发专家", "成都理工大学杰出校友"]' WHERE `person_id` = 'duoji';
UPDATE `person` SET `awards` = '["沉积地质学奠基人之一", "沉积学教材主编", "华南地区沉积学研究专家", "培养大批沉积地质学人才"]' WHERE `person_id` = 'zengyunfu';
UPDATE `person` SET `awards` = '["1936年发现攀枝花钒钛磁铁矿", "成都地质学院五大奠基人之一", "沉积地质学奠基人", "地质教育先驱"]' WHERE `person_id` = 'changlongqing';
UPDATE `person` SET `awards` = '["同位素地球化学专家", "国际知名学者", "高水平论文发表", "优秀教师"]' WHERE `person_id` = 'chenweidong';
UPDATE `person` SET `awards` = '["中国科学院院士（1991年）", "第三世界科学院院士（1999年）", "中国地震局地球物理研究所所长（1986-2000年）", "全国科学大会奖（1978年）", "国际数字地震台网联合会（FDSN）副主席", "中国地震学会理事长", "地震震源理论研究先驱者", "数字地震学在中国的开拓者"]' WHERE `person_id` = 'chenyuntai';
UPDATE `person` SET `awards` = '["中国科学院院士", "地质灾害防治专家", "山地灾害风险评估方法创建者", "汶川地震灾害评估专家"]' WHERE `person_id` = 'cuipeng';
UPDATE `person` SET `awards` = '["中国工程院院士（第一位藏族院士）", "羊八井地热田勘查主要完成人", "西藏地热资源开发专家", "成都理工大学杰出校友"]' WHERE `person_id` = 'duoji';
UPDATE `person` SET `awards` = '["国家杰出青年科学基金获得者（2021年）", "百千万人才工程入选者", "国际交流与合作处处长", "国家重点实验室副主任", "成功预警上百起大型地质灾害"]' WHERE `person_id` = 'fanxuanmei';
UPDATE `person` SET `awards` = '["全国高校黄大年式教师团队负责人", "核探测技术专家", "省部级科技奖励获得者", "优秀教师"]' WHERE `person_id` = 'geliangquan';
UPDATE `person` SET `awards` = '["中国首位大洋科考女首席科学家", "海洋地质学家", "大洋矿产资源勘查专家", "成都理工大学杰出校友"]' WHERE `person_id` = 'hanxiqiu';
UPDATE `person` SET `awards` = '["深时地理环境重建团队负责人", "沉积学与知识图谱交叉研究开创者", "自然资源部重点实验室主任", "高水平论文发表"]' WHERE `person_id` = 'houmingcai';
UPDATE `person` SET `awards` = '["成都理工大学校长", "高等教育管理专家", "双一流建设推动者", "教育教学改革推进者"]' WHERE `person_id` = 'hubing';
UPDATE `person` SET `awards` = '["甘肃省委书记", "成都理工大学杰出校友", "地方经济社会发展推动者", "民生工程推进者"]' WHERE `person_id` = 'huchangsheng';
UPDATE `person` SET `awards` = '["江苏省副省长", "成都理工大学杰出校友", "地方经济社会发展推动者", "科技创新推进者"]' WHERE `person_id` = 'huguangjie';
UPDATE `person` SET `awards` = '["中国科学院院士", "矿床地质学家", "华南地区矿床成矿规律研究专家", "国家自然科学奖获得者"]' WHERE `person_id` = 'huruizhong';
UPDATE `person` SET `awards` = '["国家杰出青年科学基金获得者（2022年）", "国家优秀青年科学基金获得者（2018年）", "国际大滑坡协会秘书长", "国家科技进步奖二等奖（2019年）", "《Engineering Geology》编委", "在PNAS、Geology等顶级期刊发表论文"]' WHERE `person_id` = 'huwei';
UPDATE `person` SET `awards` = '["IEEE Fellow", "智能电网技术专家", "国际知名学者", "多篇高水平论文发表"]' WHERE `person_id` = 'huangqi';
UPDATE `person` SET `awards` = '["中国工程院院士", "生态环境部部长", "地质灾害防治专家", "国家级教学名师"]' WHERE `person_id` = 'huangrunqiu';
UPDATE `person` SET `awards` = '["西藏区党委常委", "成都理工大学杰出校友", "地方经济社会发展推动者", "民族团结推进者"]' WHERE `person_id` = 'laijiao';
UPDATE `person` SET `awards` = '["广西壮族自治区副主席", "成都理工大学杰出校友", "地方经济社会发展推动者", "民族团结推进者"]' WHERE `person_id` = 'libin';
UPDATE `person` SET `awards` = '["瓦尔特奖章获得者（2024年，首位中国科学家）", "国家杰出青年科学基金获得者（2018年）", "国家\"万人计划\"科技创新领军人才", "沉积地质研究院院长", "Nature等顶级期刊发表论文", "侯德封奖获得者"]' WHERE `person_id` = 'lichao';
UPDATE `person` SET `awards` = '["地质教育先驱者", "西部地区地质研究专家", "地质学教材主编", "培养大批地质人才"]' WHERE `person_id` = 'lichengsan';
UPDATE `person` SET `awards` = '["地球物理勘探专家", "省部级科技奖励获得者", "优秀教师", "产学研合作成果"]' WHERE `person_id` = 'liwei';
UPDATE `person` SET `awards` = '["地质灾害监测预警专家", "省部级科技奖励获得者", "优秀教师", "环境与土木工程学院学科带头人"]' WHERE `person_id` = 'lixiaoming';
UPDATE `person` SET `awards` = '["中国科学院院士（1980年）", "成都理工大学名誉校长", "李四光地质科学奖获得者（1989年）", "国际斯潘迪亚罗夫奖获得者（1996年）"]' WHERE `person_id` = 'liubaojun';
UPDATE `person` SET `awards` = '["沉积地质学家", "深时地质学研究专家", "高水平论文发表", "优秀教师"]' WHERE `person_id` = 'liujun';
UPDATE `person` SET `awards` = '["成都理工大学党委书记", "教育部长江学者特聘教授", "院士有效候选人（2017、2019年）", "国家科技进步特等奖1项、二等奖2项", "何梁何利基金科学与技术进步奖", "发表论文180余篇，授权发明专利60余件"]' WHERE `person_id` = 'liuqinyou';
UPDATE `person` SET `awards` = '["国家百千万人才工程人选", "油气地质学家", "国家科技进步奖获得者", "能源学院学科带头人"]' WHERE `person_id` = 'liushugen';
UPDATE `person` SET `awards` = '["核探测技术专家", "省部级科技奖励获得者", "优秀教师", "产学研合作成果"]' WHERE `person_id` = 'liuyong';
UPDATE `person` SET `awards` = '["国家级人才计划入选者", "同位素地球化学专家", "国际知名学者", "高水平论文发表"]' WHERE `person_id` = 'liuyun';
UPDATE `person` SET `awards` = '["四川省人大常委会副主任", "成都理工大学杰出校友", "地方经济社会发展推动者", "法治建设推进者"]' WHERE `person_id` = 'luoqiang';
UPDATE `person` SET `awards` = '["国务院学位委员会学科评议组成员", "地球化学专家", "省部级科技奖励获得者", "学校领导"]' WHERE `person_id` = 'nishijun';
UPDATE `person` SET `awards` = '["国家杰出青年科学基金获得者", "功能材料专家", "高水平论文发表", "产学研合作成果"]' WHERE `person_id` = 'pengqiang';
UPDATE `person` SET `awards` = '["国务院学位委员会学科评议组成员", "石油地质学家", "国家科技进步奖获得者", "地球科学学院院长"]' WHERE `person_id` = 'shizejin';
UPDATE `person` SET `awards` = '["沉积地质学家", "深时地质学研究专家", "高水平论文发表", "优秀教师"]' WHERE `person_id` = 'sunming';
UPDATE `person` SET `awards` = '["国家百千万人才工程人选", "地质灾害风险评估专家", "省部级科技奖励获得者", "环境与土木工程学院学科带头人"]' WHERE `person_id` = 'tangchuan';
UPDATE `person` SET `awards` = '["中国科学院院士", "青藏高原矿产资源勘查专家", "国家科技进步奖获得者", "斑岩型铜矿勘查理论创建者"]' WHERE `person_id` = 'tangjuxing';
UPDATE `person` SET `awards` = '["成都理工大学纪委书记", "纪检监察专家", "党风廉政建设推动者", "制度建设推进者"]' WHERE `person_id` = 'tangqingli';
UPDATE `person` SET `awards` = '["国家杰出青年科学基金获得者", "核探测技术专家", "核技术与自动化工程学院院长", "国家科技进步奖获得者"]' WHERE `person_id` = 'tuoxianguo';
UPDATE `person` SET `awards` = '["中国科学院院士（2013年）", "美国地质学会会士（2012年）", "李四光地质科学奖获得者", "全国先进工作者、全国五一劳动奖章", "白垩纪大洋红层和富氧作用理论创建者", "\"原西藏高原\"隆升新模式提出者", "曾任成都理工大学校长"]' WHERE `person_id` = 'wangchengshan';
UPDATE `person` SET `awards` = '["核探测技术专家", "省部级科技奖励获得者", "优秀教师", "产学研合作成果"]' WHERE `person_id` = 'wanghai';
UPDATE `person` SET `awards` = '["油气储层地质专家", "国家科技进步奖获得者", "优秀教师", "能源学院学科带头人"]' WHERE `person_id` = 'wangjun';
UPDATE `person` SET `awards` = '["功能材料专家", "高水平论文发表", "产学研合作成果", "优秀教师"]' WHERE `person_id` = 'wangli';
UPDATE `person` SET `awards` = '["油气储层地质专家", "国家科技进步奖获得者", "优秀教师", "能源学院学科带头人"]' WHERE `person_id` = 'wangming';
UPDATE `person` SET `awards` = '["1960年参加首次攀登珠峰", "1964年营救队友英雄事迹", "1975年攀登珠峰时英勇牺牲", "追记特等功，追认为烈士"]' WHERE `person_id` = 'wuzongyue';
UPDATE `person` SET `awards` = '["自然资源部副部长", "成都理工大学杰出校友", "自然资源管理专家", "生态文明建设推进者"]' WHERE `person_id` = 'xudachun';
UPDATE `person` SET `awards` = '["成都理工大学校长", "国家杰出青年科学基金获得者、长江学者", "全国杰出专业技术人才", "国家科技进步一等奖2项、二等奖1项", "发表学术论文500余篇"]' WHERE `person_id` = 'xuqiang';
UPDATE `person` SET `awards` = '["国务院学位委员会学科评议组成员", "油气储层地质专家", "国家科技进步奖获得者", "能源学院院长"]' WHERE `person_id` = 'yixiangyi';
UPDATE `person` SET `awards` = '["功能材料专家", "高水平论文发表", "产学研合作成果", "优秀教师"]' WHERE `person_id` = 'zhanghua';
UPDATE `person` SET `awards` = '["地质灾害监测预警专家", "省部级科技奖励获得者", "优秀教师", "环境与土木工程学院学科带头人"]' WHERE `person_id` = 'zhangli';
UPDATE `person` SET `awards` = '["沉积地质学家", "深时地质学研究专家", "高水平论文发表", "优秀教师"]' WHERE `person_id` = 'zhangminghua';
UPDATE `person` SET `awards` = '["中国科学院院士", "石油地质学家", "油气成藏机理研究专家", "国家科技进步奖获得者"]' WHERE `person_id` = 'zhangshuichang';
UPDATE `person` SET `awards` = '["地球物理勘探专家", "省部级科技奖励获得者", "优秀教师", "产学研合作成果"]' WHERE `person_id` = 'zhangwentao';
UPDATE `person` SET `awards` = '["工程地质学科奠基人", "成都地质学院院长（1983-1988）", "国家重点学科创建者", "《工程地质分析原理》作者"]' WHERE `person_id` = 'zhangzhuoyuan';
UPDATE `person` SET `awards` = '["油气地质学家", "国家科技进步奖获得者", "优秀教师", "能源学院学科带头人"]' WHERE `person_id` = 'zhaoyuan';
UPDATE `person` SET `awards` = '["地质灾害监测预警专家", "省部级科技奖励获得者", "优秀教师", "环境与土木工程学院学科带头人"]' WHERE `person_id` = 'zhouyong';

-- 共提取 56 位人物的奖项成就信息
