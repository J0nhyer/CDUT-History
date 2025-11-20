-- ============================================
-- 人物荣誉成就数据插入脚本
-- 数据库: javawebdb
-- ============================================

USE javawebdb;

-- 清空现有荣誉数据
TRUNCATE TABLE `person_awards`;

-- 刘宝珺的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('liubaojun', '中国科学院院士', '院士', '国际级', 1991, '中国科学院', '中国科学院地学部院士，我国著名沉积地质学家', 1, 1),
('liubaojun', '李四光地质科学奖', '国家级奖项', '国家级', 1989, '李四光地质科学奖基金会', '表彰在地质科学领域做出突出贡献', 1, 2),
('liubaojun', '斯潘迪亚罗夫奖', '国家级奖项', '国际级', 1997, '国际沉积学家协会', '国际沉积学最高奖项', 1, 3),
('liubaojun', '中国沉积学成就奖', '国家级奖项', '国家级', 2013, '中国矿物岩石地球化学学会', '表彰在沉积学领域的卓越贡献', 1, 4),
('liubaojun', '成都理工大学名誉校长', '学术职务', '校级', NULL, '成都理工大学', '成都理工大学最高荣誉职位', 1, 5);

-- 张倬元的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('zhangzhuoyuan', '成都地质学院院长', '学术职务', '校级', 1983, '成都地质学院', '1983-1988年担任院长', 1, 1),
('zhangzhuoyuan', '工程地质学奠基人', '其他荣誉', '国家级', NULL, NULL, '中国工程地质学科创建者之一', 1, 2),
('zhangzhuoyuan', '国家重点学科创建人', '其他荣誉', '国家级', NULL, '教育部', '创建工程地质国家重点学科', 1, 3),
('zhangzhuoyuan', '清华大学1946届校友', '其他荣誉', NULL, 1946, '清华大学', '清华大学地质系毕业', 0, 4);

-- 黄润秋的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('huangrunqiu', '中国工程院院士', '院士', '国际级', 2009, '中国工程院', '中国工程院土木、水利与建筑工程学部院士', 1, 1),
('huangrunqiu', '生态环境部部长', '学术职务', '国家级', 2020, '中华人民共和国国务院', '现任生态环境部部长', 1, 2),
('huangrunqiu', '九三学社中央副主席', '学术职务', '国家级', NULL, '九三学社', '民主党派中央领导职务', 1, 3),
('huangrunqiu', '国家科技进步一等奖', '国家级奖项', '国家级', NULL, '中华人民共和国国务院', '获得2项国家科技进步一等奖', 1, 4),
('huangrunqiu', '第十四届全国政协常委', '学术职务', '国家级', NULL, '中国人民政治协商会议', '全国政协常委', 1, 5);

-- 王成善的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('wangchengshan', '中国科学院院士', '院士', '国际级', 2013, '中国科学院', '中国科学院地学部院士', 1, 1),
('wangchengshan', '美国地质学会会士', '国家级奖项', '国际级', 2012, '美国地质学会', '国际地质学最高荣誉之一', 1, 2),
('wangchengshan', '李四光地质科学奖', '国家级奖项', '国家级', NULL, '李四光地质科学奖基金会', '地质科学领域杰出贡献奖', 1, 3),
('wangchengshan', '全国五一劳动奖章', '国家级奖项', '国家级', NULL, '中华全国总工会', '全国劳动模范', 1, 4),
('wangchengshan', '成都理工大学校长', '学术职务', '校级', NULL, '成都理工大学', '曾任成都理工大学校长', 1, 5);

-- 多吉的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('duoji', '中国工程院院士', '院士', '国际级', 2009, '中国工程院', '第一位藏族中国工程院院士', 1, 1),
('duoji', '羊八井地热田勘查主要完成人', '其他荣誉', '国家级', NULL, NULL, '羊八井地热田勘查项目主要完成人', 1, 2),
('duoji', '西藏地矿局总工程师', '学术职务', '省部级', NULL, '西藏自治区地质矿产勘查开发局', '西藏地矿局总工程师', 1, 3);

-- 陈运泰的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('chenyuntai', '中国科学院院士', '院士', '国际级', 1991, '中国科学院', '中国科学院地学部院士', 1, 1),
('chenyuntai', '第三世界科学院院士', '院士', '国际级', 1999, '第三世界科学院', '发展中国家科学院院士', 1, 2),
('chenyuntai', '全国科学大会奖', '国家级奖项', '国家级', 1978, '中华人民共和国国务院', '全国科学大会奖', 1, 3),
('chenyuntai', '中国地震局地球物理研究所名誉所长', '学术职务', '国家级', NULL, '中国地震局', '地球物理研究所名誉所长', 1, 4);

-- 刘清友的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('liuqinyou', '成都理工大学党委书记', '学术职务', '校级', 2023, '成都理工大学', '2023年10月起任党委书记', 1, 1),
('liuqinyou', '长江学者特聘教授', '人才计划', '国家级', NULL, '教育部', '教育部长江学者特聘教授', 1, 2),
('liuqinyou', '国家科技进步特等奖', '国家级奖项', '国家级', NULL, '中华人民共和国国务院', '1项特等奖，2项二等奖', 1, 3),
('liuqinyou', '何梁何利基金科学与技术进步奖', '国家级奖项', '国家级', NULL, '何梁何利基金', '何梁何利基金奖', 1, 4),
('liuqinyou', '光华工程科技奖', '国家级奖项', '国家级', NULL, '中国工程院', '工程科技领域重要奖项', 1, 5);

-- 许强的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('xuqiang', '成都理工大学校长', '学术职务', '校级', 2023, '成都理工大学', '2023年10月起任校长', 1, 1),
('xuqiang', '国家杰出青年科学基金', '人才计划', '国家级', NULL, '国家自然科学基金委员会', '国家杰青', 1, 2),
('xuqiang', '长江学者特聘教授', '人才计划', '国家级', NULL, '教育部', '教育部长江学者', 1, 3),
('xuqiang', '国家科技进步一等奖', '国家级奖项', '国家级', NULL, '中华人民共和国国务院', '2项一等奖，1项二等奖', 1, 4),
('xuqiang', '全国杰出专业技术人才', '国家级奖项', '国家级', NULL, '人力资源和社会保障部', '全国杰出专业技术人才', 1, 5),
('xuqiang', '第十四届全国人大代表', '学术职务', '国家级', NULL, '全国人民代表大会', '全国人大代表', 1, 6);

-- 李超的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('lichao', '瓦尔特奖章', '国家级奖项', '国际级', 2024, '国际沉积学家协会', '首位获得该奖的中国科学家', 1, 1),
('lichao', '国家杰出青年科学基金', '人才计划', '国家级', 2018, '国家自然科学基金委员会', '国家杰青', 1, 2),
('lichao', '国家万人计划科技创新领军人才', '人才计划', '国家级', 2019, '中共中央组织部', '万人计划领军人才', 1, 3),
('lichao', '侯德封奖', '国家级奖项', '国家级', 2014, '中国矿物岩石地球化学学会', '地球化学领域青年奖', 1, 4),
('lichao', '成都理工大学首篇Nature论文', '其他荣誉', '国际级', 2023, 'Nature', '以第一单位发表Nature论文', 1, 5);

-- 范宣梅的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('fanxuanmei', '国家杰出青年科学基金', '人才计划', '国家级', 2021, '国家自然科学基金委员会', '国家杰青', 1, 1),
('fanxuanmei', '百千万人才工程', '人才计划', '国家级', NULL, '人力资源和社会保障部', '国家级人才工程', 1, 2),
('fanxuanmei', '国际交流与合作处处长', '学术职务', '校级', NULL, '成都理工大学', '国际交流与合作处处长', 0, 3);

-- 胡伟的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('huwei', '国家杰出青年科学基金', '人才计划', '国家级', 2022, '国家自然科学基金委员会', '国家杰青', 1, 1),
('huwei', '国家优秀青年科学基金', '人才计划', '国家级', 2018, '国家自然科学基金委员会', '国家优青', 1, 2),
('huwei', '国家科技进步奖二等奖', '国家级奖项', '国家级', 2019, '中华人民共和国国务院', '国家科技进步二等奖', 1, 3),
('huwei', '国际大滑坡协会秘书长', '学术职务', '国际级', NULL, '国际大滑坡协会', 'ICL秘书长', 1, 4);

-- 唐菊兴的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('tangjuxing', '中国工程院院士', '院士', '国际级', 2023, '中国工程院', '中国工程院能源与矿业工程学部院士', 1, 1),
('tangjuxing', '国家科技进步特等奖', '国家级奖项', '国家级', NULL, '中华人民共和国国务院', '国家科技进步特等奖', 1, 2),
('tangjuxing', '李四光地质科学奖', '国家级奖项', '国家级', NULL, '李四光地质科学奖基金会', '地质科学领域杰出贡献', 1, 3),
('tangjuxing', '全国先进工作者', '国家级奖项', '国家级', NULL, '中华人民共和国国务院', '全国先进工作者', 1, 4),
('tangjuxing', '全国优秀共产党员', '国家级奖项', '国家级', NULL, '中国共产党中央委员会', '全国优秀共产党员', 1, 5);

-- 庹先国的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('tuoxianguo', '国家杰出青年科学基金', '人才计划', '国家级', NULL, '国家自然科学基金委员会', '国家杰青', 1, 1),
('tuoxianguo', '国家科技进步奖', '国家级奖项', '国家级', NULL, '中华人民共和国国务院', '国家科技进步奖获得者', 1, 2),
('tuoxianguo', '核技术与自动化工程学院院长', '学术职务', '校级', NULL, '成都理工大学', '学院院长', 0, 3);

-- 彭强的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('pengqiang', '国家杰出青年科学基金', '人才计划', '国家级', NULL, '国家自然科学基金委员会', '国家杰青', 1, 1);

-- 刘树根的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('liushugen', '国家百千万人才工程', '人才计划', '国家级', NULL, '人力资源和社会保障部', '百千万人才工程人选', 1, 1),
('liushugen', '国家科技进步奖', '国家级奖项', '国家级', NULL, '中华人民共和国国务院', '国家科技进步奖获得者', 1, 2);

-- 唐川的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('tangchuan', '国家百千万人才工程', '人才计划', '国家级', NULL, '人力资源和社会保障部', '百千万人才工程人选', 1, 1),
('tangchuan', '省部级科技奖励', '省部级奖项', '省部级', NULL, NULL, '多项省部级科技奖励', 0, 2);

-- 曾允孚的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('zengyunfu', '沉积地质学奠基人', '其他荣誉', '国家级', NULL, NULL, '成都理工大学五大学科奠基人之一', 1, 1),
('zengyunfu', '沉积学教材主编', '教学荣誉', '国家级', NULL, NULL, '主编多部沉积学经典教材', 1, 2);

-- 常隆庆的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('changlongqing', '攀枝花钒钛磁铁矿发现者', '其他荣誉', '国家级', 1936, NULL, '发现攀枝花钒钛磁铁矿，攀枝花之父', 1, 1),
('changlongqing', '成都地质学院五大奠基人', '其他荣誉', '校级', NULL, '成都地质学院', '学校创建的主要奠基人之一', 1, 2);

-- 李承三的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('lichengsan', '成都地质学院首任教务长', '学术职务', '校级', NULL, '成都地质学院', '首任教务长', 1, 1),
('lichengsan', '地质教育先驱', '教学荣誉', '国家级', NULL, NULL, '西部地区地质教育开拓者', 1, 2);

-- 邬宗岳的荣誉
INSERT INTO `person_awards` (`person_id`, `award_name`, `award_type`, `award_level`, `award_year`, `awarding_organization`, `award_description`, `is_major`, `display_order`) VALUES
('wuzongyue', '革命烈士', '其他荣誉', '国家级', 1975, '中华人民共和国民政部', '1975年珠峰8200米处遇难，被追认为革命烈士', 1, 1),
('wuzongyue', '1960年珠峰攀登后勤支援', '其他荣誉', NULL, 1960, NULL, '首次珠峰攀登后勤支援', 0, 2),
('wuzongyue', '1964年希夏邦马峰救援', '其他荣誉', NULL, 1964, NULL, '攀登希夏邦马峰救援队友', 0, 3);
