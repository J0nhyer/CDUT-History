-- ============================================
-- 人物时间轴事件完整数据插入
-- 从personsDetailDataAdvanced.js自动提取
-- 数据库: javawebdb
-- ============================================

USE javawebdb;

-- 张倬元 (zhangzhuoyuan): 5个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhangzhuoyuan-1926', 'zhangzhuoyuan', '张倬元', '1926', '出生于河北乐亭', '出生于河北省乐亭县一个农民家庭', 'birth', 'medium', '["张倬元"]', '人物时间轴', 19260101),
('person-zhangzhuoyuan-1948', 'zhangzhuoyuan', '张倬元', '1948', '就读清华大学', '考入清华大学地质系学习', 'education', 'medium', '["张倬元"]', '人物时间轴', 19480101),
('person-zhangzhuoyuan-1952', 'zhangzhuoyuan', '张倬元', '1952', '来到成都地质学院', '分配至成都地质学院工作，开始工程地质学研究', 'career', 'high', '["张倬元"]', '人物时间轴', 19520101),
('person-zhangzhuoyuan-1983_1988', 'zhangzhuoyuan', '张倬元', '1983-1988', '担任成都地质学院院长', '领导学校发展，为学校争取到两个首批国家重点学科', 'career', 'high', '["张倬元"]', '人物时间轴', 19830101),
('person-zhangzhuoyuan-2022', 'zhangzhuoyuan', '张倬元', '2022', '逝世', '享年96岁，为中国工程地质学发展奉献了一生', 'death', 'high', '["张倬元"]', '人物时间轴', 20220101);

-- 黄润秋 (huangrunqiu): 6个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-huangrunqiu-1963', 'huangrunqiu', '黄润秋', '1963', '出生', '出生于四川省成都市', 'birth', 'medium', '["黄润秋"]', '人物时间轴', 19630101),
('person-huangrunqiu-1978', 'huangrunqiu', '黄润秋', '1978', '考入成都地质学院', '考入成都地质学院（现成都理工大学）工程地质专业', 'education', 'high', '["黄润秋"]', '人物时间轴', 19780101),
('person-huangrunqiu-1988', 'huangrunqiu', '黄润秋', '1988', '攻读博士学位', '师从张倬元教授，攻读工程地质学博士学位', 'education', 'high', '["黄润秋"]', '人物时间轴', 19880101),
('person-huangrunqiu-1994', 'huangrunqiu', '黄润秋', '1994', '破格晋升教授', '因突出的科研成就，破格晋升为教授，年仅31岁', 'career', 'high', '["黄润秋"]', '人物时间轴', 19940101),
('person-huangrunqiu-2009', 'huangrunqiu', '黄润秋', '2009', '当选中国工程院院士', '因在地质灾害防治领域的突出贡献当选为中国工程院院士', 'honor', 'high', '["黄润秋"]', '人物时间轴', 20090101),
('person-huangrunqiu-2020', 'huangrunqiu', '黄润秋', '2020', '任生态环境部部长', '担任中华人民共和国生态环境部部长', 'career', 'high', '["黄润秋"]', '人物时间轴', 20200101);

-- 王成善 (wangchengshan): 6个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-wangchengshan-1951', 'wangchengshan', '王成善', '1951', '出生', '出生于辽宁省', 'birth', 'medium', '["王成善"]', '人物时间轴', 19510101),
('person-wangchengshan-1977', 'wangchengshan', '王成善', '1977', '考入成都地质学院', '考入成都地质学院（现成都理工大学）地质学专业', 'education', 'high', '["王成善"]', '人物时间轴', 19770101),
('person-wangchengshan-1981', 'wangchengshan', '王成善', '1981', '获得硕士学位', '师从刘宝珺院士，获得沉积地质学硕士学位', 'education', 'high', '["王成善"]', '人物时间轴', 19810101),
('person-wangchengshan-1991', 'wangchengshan', '王成善', '1991', '获得博士学位', '获得中国地质大学（北京）博士学位', 'education', 'high', '["王成善"]', '人物时间轴', 19910101),
('person-wangchengshan-2013', 'wangchengshan', '王成善', '2013', '当选中国科学院院士', '因在沉积地质学和石油地质学领域的突出贡献当选为中国科学院院士', 'honor', 'high', '["王成善"]', '人物时间轴', 20130101),
('person-wangchengshan-2017', 'wangchengshan', '王成善', '2017', '担任国际古地理学会主席', '当选为国际古地理学会主席，提升中国在该领域的国际影响力', 'career', 'high', '["王成善"]', '人物时间轴', 20170101);

-- 多吉 (duoji): 6个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-duoji-1953', 'duoji', '多吉', '1953', '出生', '出生于西藏自治区', 'birth', 'medium', '["多吉"]', '人物时间轴', 19530101),
('person-duoji-1974', 'duoji', '多吉', '1974', '就读成都地质学院', '考入成都地质学院（现成都理工大学）地质学专业', 'education', 'high', '["多吉"]', '人物时间轴', 19740101),
('person-duoji-1978', 'duoji', '多吉', '1978', '毕业返回西藏', '从成都地质学院毕业，返回西藏从事地质工作', 'education', 'high', '["多吉"]', '人物时间轴', 19780101),
('person-duoji-1990', 'duoji', '多吉', '1990', '发现羊八井地热田', '主持发现并评价了西藏羊八井地热田，为西藏能源开发做出重要贡献', 'achievement', 'high', '["多吉"]', '人物时间轴', 19900101),
('person-duoji-2001', 'duoji', '多吉', '2001', '当选中国工程院院士', '因在地热地质和矿产地质领域的突出贡献当选为中国工程院院士', 'honor', 'high', '["多吉"]', '人物时间轴', 20010101),
('person-duoji-2005', 'duoji', '多吉', '2005', '担任西藏地质勘查局局长', '担任西藏自治区地质勘查局局长，继续为西藏地质事业发展贡献力量', 'career', 'high', '["多吉"]', '人物时间轴', 20050101);

-- 曾允孚 (zengyunfu): 5个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zengyunfu-1925', 'zengyunfu', '曾允孚', '1925', '出生', '出生于湖南省', 'birth', 'medium', '["曾允孚"]', '人物时间轴', 19250101),
('person-zengyunfu-1950', 'zengyunfu', '曾允孚', '1950', '毕业于北京大学', '毕业于北京大学地质系', 'education', 'high', '["曾允孚"]', '人物时间轴', 19500101),
('person-zengyunfu-1956', 'zengyunfu', '曾允孚', '1956', '来到成都地质学院', '来到成都地质学院（现成都理工大学）工作，从事沉积地质学教学和科研', 'career', 'high', '["曾允孚"]', '人物时间轴', 19560101),
('person-zengyunfu-1980', 'zengyunfu', '曾允孚', '1980', '创建沉积地质研究所', '创建成都地质学院沉积地质研究所，担任首任所长', 'career', 'high', '["曾允孚"]', '人物时间轴', 19800101),
('person-zengyunfu-2000', 'zengyunfu', '曾允孚', '2000', '获得全国优秀教师称号', '因在教学方面的突出贡献，获得全国优秀教师称号', 'education', 'high', '["曾允孚"]', '人物时间轴', 20000101);

-- 罗蛰潭 (luozhetan): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-luozhetan-1956', 'luozhetan', '罗蛰潭', '1956', '参与建校', '1956年参与成都地质学院（现成都理工大学）建校工作，是建校初期五大学科奠基人之一', 'career', 'high', '["罗蛰潭"]', '人物时间轴', 19560101);

-- 金景福 (jinjingfu): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-jinjingfu-1956', 'jinjingfu', '金景福', '1956', '参与建校', '1956年参与成都地质学院（现成都理工大学）建校工作，是建校初期五大学科奠基人之一', 'career', 'high', '["金景福"]', '人物时间轴', 19560101);

-- 邬宗岳 (wuzongyue): 5个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-wuzongyue-1933', 'wuzongyue', '邬宗岳', '1933', '出生', '出生于四川省', 'birth', 'medium', '["邬宗岳"]', '人物时间轴', 19330101),
('person-wuzongyue-1956', 'wuzongyue', '邬宗岳', '1956', '考入成都地质学院', '考入成都地质学院（现成都理工大学）地质学专业', 'education', 'high', '["邬宗岳"]', '人物时间轴', 19560101),
('person-wuzongyue-1960', 'wuzongyue', '邬宗岳', '1960', '毕业参加工作', '从成都地质学院毕业，参加地质工作', 'education', 'medium', '["邬宗岳"]', '人物时间轴', 19600101),
('person-wuzongyue-1975', 'wuzongyue', '邬宗岳', '1975', '参加中国登山队', '作为中国登山队队员，参加攀登珠穆朗玛峰', 'career', 'high', '["邬宗岳"]', '人物时间轴', 19750101),
('person-wuzongyue-1975', 'wuzongyue', '邬宗岳', '1975', '攀登珠峰时牺牲', '在攀登珠穆朗玛峰过程中，为保护队友而英勇牺牲', 'death', 'high', '["邬宗岳"]', '人物时间轴', 19750101);

-- 陈运泰 (chenyuntai): 5个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-chenyuntai-1940', 'chenyuntai', '陈运泰', '1940', '出生', '出生于广东省', 'birth', 'medium', '["陈运泰"]', '人物时间轴', 19400101),
('person-chenyuntai-1962', 'chenyuntai', '陈运泰', '1962', '毕业于北京大学', '毕业于北京大学地球物理学专业', 'education', 'high', '["陈运泰"]', '人物时间轴', 19620101),
('person-chenyuntai-1966', 'chenyuntai', '陈运泰', '1966', '任教于成都地质学院', '任教于成都地质学院（现成都理工大学），从事地球物理学教学和科研', 'career', 'high', '["陈运泰"]', '人物时间轴', 19660101),
('person-chenyuntai-1991', 'chenyuntai', '陈运泰', '1991', '当选中国科学院院士', '因在地球物理学和地震学领域的突出贡献当选为中国科学院院士', 'honor', 'high', '["陈运泰"]', '人物时间轴', 19910101),
('person-chenyuntai-2000', 'chenyuntai', '陈运泰', '2000', '担任中国地震学会理事长', '担任中国地震学会理事长，推动我国地震学研究发展', 'career', 'high', '["陈运泰"]', '人物时间轴', 20000101);

-- 刘清友 (liuqingyou): 6个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-liuqingyou-1963', 'liuqingyou', '刘清友', '1963', '出生', '1963年6月出生于四川', 'birth', 'medium', '["刘清友"]', '人物时间轴', 19630101),
('person-liuqingyou-1982', 'liuqingyou', '刘清友', '1982', '本科毕业', '获工学学士学位', 'education', 'high', '["刘清友"]', '人物时间轴', 19820101),
('person-liuqingyou-2002', 'liuqingyou', '刘清友', '2002', '硕士毕业', '获工学硕士学位', 'education', 'high', '["刘清友"]', '人物时间轴', 20020101),
('person-liuqingyou-2014', 'liuqingyou', '刘清友', '2014', '博士毕业', '获工学博士学位', 'education', 'high', '["刘清友"]', '人物时间轴', 20140101),
('person-liuqingyou-2018', 'liuqingyou', '刘清友', '2018', '担任校长', '2018年12月任成都理工大学党委副书记、校长', 'career', 'high', '["刘清友"]', '人物时间轴', 20180101),
('person-liuqingyou-2023', 'liuqingyou', '刘清友', '2023', '担任党委书记', '2023年10月任成都理工大学党委书记', 'career', 'high', '["刘清友"]', '人物时间轴', 20230101);

-- 张言森 (zhangyansen): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhangyansen-1956', 'zhangyansen', '张言森', '1956', '参与建校', '参与成都地质勘探学院筹建，是建校初期的核心教授之一', 'career', 'high', '["张言森"]', '人物时间轴', 19560101),
('person-zhangyansen-1956_1960', 'zhangyansen', '张言森', '1956-1960', '教学与学科建设', '在学校初期的教学工作和学科建设中发挥重要作用', 'career', 'high', '["张言森"]', '人物时间轴', 19560101);

-- 刘祖彝 (liuzuyi): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-liuzuyi-1956', 'liuzuyi', '刘祖彝', '1956', '参与建校', '参与成都地质勘探学院筹建，是建校初期的核心教授之一', 'career', 'high', '["刘祖彝"]', '人物时间轴', 19560101),
('person-liuzuyi-1956_1960', 'liuzuyi', '刘祖彝', '1956-1960', '教学与学科建设', '在学校初期的教学工作和学科建设中发挥重要作用', 'career', 'high', '["刘祖彝"]', '人物时间轴', 19560101);

-- 周晓和 (zhouxiaohe): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhouxiaohe-1956', 'zhouxiaohe', '周晓和', '1956', '参与建校', '参与成都地质勘探学院筹建，是建校初期的核心教授之一', 'career', 'high', '["周晓和"]', '人物时间轴', 19560101),
('person-zhouxiaohe-1956_1960', 'zhouxiaohe', '周晓和', '1956-1960', '教学与学科建设', '在学校初期的教学工作和学科建设中发挥重要作用', 'career', 'high', '["周晓和"]', '人物时间轴', 19560101);

-- 李之常 (lizhichang): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-lizhichang-1956', 'lizhichang', '李之常', '1956', '参与建校', '参与成都地质勘探学院筹建，是建校初期的核心教授之一', 'career', 'high', '["李之常"]', '人物时间轴', 19560101),
('person-lizhichang-1956_1960', 'lizhichang', '李之常', '1956-1960', '教学与学科建设', '在学校初期的教学工作和学科建设中发挥重要作用', 'career', 'high', '["李之常"]', '人物时间轴', 19560101);

-- 吴燕生 (wuyansheng): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-wuyansheng-1956', 'wuyansheng', '吴燕生', '1956', '参与建校', '参与成都地质勘探学院筹建，是建校初期的核心教授之一', 'career', 'high', '["吴燕生"]', '人物时间轴', 19560101),
('person-wuyansheng-1956_1960', 'wuyansheng', '吴燕生', '1956-1960', '教学与学科建设', '在学校初期的教学工作和学科建设中发挥重要作用', 'career', 'high', '["吴燕生"]', '人物时间轴', 19560101);

-- 李唐泌 (litangbi): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-litangbi-1956', 'litangbi', '李唐泌', '1956', '参与建校', '参与成都地质勘探学院筹建，是建校初期的核心教授之一', 'career', 'high', '["李唐泌"]', '人物时间轴', 19560101),
('person-litangbi-1956_1960', 'litangbi', '李唐泌', '1956-1960', '教学与学科建设', '在学校初期的教学工作和学科建设中发挥重要作用', 'career', 'high', '["李唐泌"]', '人物时间轴', 19560101);

-- 常隆庆 (changlongqing): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-changlongqing-1956', 'changlongqing', '常隆庆', '1956', '参与建校', '参与成都地质勘探学院筹建，是建校初期的核心教授之一', 'career', 'high', '["常隆庆"]', '人物时间轴', 19560101),
('person-changlongqing-1956_1960', 'changlongqing', '常隆庆', '1956-1960', '教学与学科建设', '在学校初期的教学工作和学科建设中发挥重要作用', 'career', 'high', '["常隆庆"]', '人物时间轴', 19560101);

-- 李承三 (lichengsan): 5个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-lichengsan-1906', 'lichengsan', '李承三', '1906', '出生', '出生于湖北省', 'birth', 'medium', '["李承三"]', '人物时间轴', 19060101),
('person-lichengsan-1929', 'lichengsan', '李承三', '1929', '毕业于中央大学', '毕业于中央大学（现南京大学）地质系', 'education', 'high', '["李承三"]', '人物时间轴', 19290101),
('person-lichengsan-1956', 'lichengsan', '李承三', '1956', '来到成都地质学院', '来到成都地质学院（现成都理工大学）工作', 'career', 'high', '["李承三"]', '人物时间轴', 19560101),
('person-lichengsan-1956', 'lichengsan', '李承三', '1956', '担任首任教务长', '担任成都地质学院首任教务长，负责学校的教学工作', 'career', 'high', '["李承三"]', '人物时间轴', 19560101),
('person-lichengsan-1965', 'lichengsan', '李承三', '1965', '退休', '从成都地质学院退休', 'career', 'medium', '["李承三"]', '人物时间轴', 19650101);

-- 许强 (xuqiang): 10个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-xuqiang-1968', 'xuqiang', '许强', '1968', '出生', '1968年6月出生于四川南江', 'birth', 'medium', '["许强"]', '人物时间轴', 19680101),
('person-xuqiang-1988_1992', 'xuqiang', '许强', '1988-1992', '本科学习', '在成都地质学院水文地质与工程地质专业攻读本科', 'education', 'high', '["许强"]', '人物时间轴', 19880101),
('person-xuqiang-1992_1994', 'xuqiang', '许强', '1992-1994', '硕士学习', '在成都理工学院工程地质专业攻读硕士研究生', 'education', 'high', '["许强"]', '人物时间轴', 19920101),
('person-xuqiang-1994_1997', 'xuqiang', '许强', '1994-1997', '博士学习', '在成都理工学院水文地质与工程地质专业攻读博士研究生', 'education', 'high', '["许强"]', '人物时间轴', 19940101),
('person-xuqiang-1997', 'xuqiang', '许强', '1997', '任教', '在成都理工学院任教，开始从事地质灾害防治的教学和科研工作', 'career', 'high', '["许强"]', '人物时间轴', 19970101),
('person-xuqiang-2002_2004', 'xuqiang', '许强', '2002-2004', '担任副院长', '担任成都理工大学环境与土木工程学院副院长（主持工作）', 'career', 'high', '["许强"]', '人物时间轴', 20020101),
('person-xuqiang-2004_2014', 'xuqiang', '许强', '2004-2014', '担任院长', '担任成都理工大学环境与土木工程学院院长', 'career', 'high', '["许强"]', '人物时间轴', 20040101),
('person-xuqiang-2014_2019', 'xuqiang', '许强', '2014-2019', '国家重点实验室常务副主任', '担任地质灾害防治与地质环境保护国家重点实验室常务副主任', 'career', 'high', '["许强"]', '人物时间轴', 20140101),
('person-xuqiang-2019', 'xuqiang', '许强', '2019', '担任副校长', '担任成都理工大学副校长', 'career', 'high', '["许强"]', '人物时间轴', 20190101),
('person-xuqiang-2023', 'xuqiang', '许强', '2023', '担任校长', '2023年10月任成都理工大学校长', 'career', 'high', '["许强"]', '人物时间轴', 20230101);

-- 李天斌 (litianbin): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-litianbin-任职', 'litianbin', '李天斌', '任职', '担任成都理工大学教授', '担任成都理工大学教授，获得其他国家院士称号', 'education', 'high', '["李天斌"]', '人物时间轴', 19560101);

-- 庹先国 (tuoxianguo): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-tuoxianguo-任职', 'tuoxianguo', '庹先国', '任职', '担任成都理工大学教授', '担任成都理工大学教授，获得国家杰出青年科学基金', 'education', 'high', '["庹先国"]', '人物时间轴', 19560101);

-- 范宣梅 (fanxuanmei): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-fanxuanmei-任职', 'fanxuanmei', '范宣梅', '任职', '担任成都理工大学教授', '担任成都理工大学教授，获得国家杰出青年科学基金', 'education', 'high', '["范宣梅"]', '人物时间轴', 19560101);

-- 李超 (lichao): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-lichao-任职', 'lichao', '李超', '任职', '担任成都理工大学教授', '担任成都理工大学教授，获得国家杰出青年科学基金', 'education', 'high', '["李超"]', '人物时间轴', 19560101);

-- 彭强 (pengqiang): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-pengqiang-任职', 'pengqiang', '彭强', '任职', '担任成都理工大学教授', '担任成都理工大学教授，获得国家杰出青年科学基金', 'education', 'high', '["彭强"]', '人物时间轴', 19560101);

-- 胡伟 (huwei): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-huwei-任职', 'huwei', '胡伟', '任职', '担任成都理工大学教授', '担任成都理工大学教授，获得国家杰出青年科学基金', 'education', 'high', '["胡伟"]', '人物时间轴', 19560101);

-- 刘树根 (liushugen): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-liushugen-任职', 'liushugen', '刘树根', '任职', '担任成都理工大学教授', '担任成都理工大学教授，入选百千万人才工程国家级人选', 'career', 'high', '["刘树根"]', '人物时间轴', 19560101);

-- 唐川 (tangchuan): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-tangchuan-任职', 'tangchuan', '唐川', '任职', '担任成都理工大学教授', '担任成都理工大学教授，入选百千万人才工程国家级人选', 'career', 'high', '["唐川"]', '人物时间轴', 19560101);

-- 李忠权 (lizhongquan): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-lizhongquan-任职', 'lizhongquan', '李忠权', '任职', '担任成都理工大学教授', '担任成都理工大学教授，入选百千万人才工程国家级人选', 'career', 'high', '["李忠权"]', '人物时间轴', 19560101);

-- 李勇 (liyong): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-liyong-任职', 'liyong', '李勇', '任职', '担任成都理工大学教授', '担任成都理工大学教授，入选百千万人才工程国家级人选', 'career', 'high', '["李勇"]', '人物时间轴', 19560101);

-- 裴向军 (peixiangjun): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-peixiangjun-任职', 'peixiangjun', '裴向军', '任职', '担任成都理工大学教授', '担任成都理工大学教授，入选百千万人才工程国家级人选', 'career', 'high', '["裴向军"]', '人物时间轴', 19560101);

-- 罗晓东 (luoxiaodong): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-luoxiaodong-任职', 'luoxiaodong', '罗晓东', '任职', '任教授', '担任成都理工大学生态环境学院教授', 'career', 'medium', '["罗晓东"]', '人物时间轴', 19560101),
('person-luoxiaodong-荣誉', 'luoxiaodong', '罗晓东', '荣誉', '省科技进步一等奖', '获四川科技进步一等奖', 'honor', 'high', '["罗晓东"]', '人物时间轴', 19560101);

-- 张国权 (zhangguoquan): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhangguoquan-任职', 'zhangguoquan', '张国权', '任职', '任教授', '担任成都理工大学经济管理学院教授', 'career', 'medium', '["张国权"]', '人物时间轴', 19560101),
('person-zhangguoquan-贡献', 'zhangguoquan', '张国权', '贡献', '社科基金项目', '主持多项国家社会科学基金项目', 'career', 'high', '["张国权"]', '人物时间轴', 19560101);

-- 郭婷婷 (guotingting): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-guotingting-任职', 'guotingting', '郭婷婷', '任职', '任副教授', '担任成都理工大学新闻与传播学院副教授', 'career', 'medium', '["郭婷婷"]', '人物时间轴', 19560101),
('person-guotingting-荣誉', 'guotingting', '郭婷婷', '荣誉', '获奖项目', '多项研究获国家艺术基金与教育部优秀成果奖', 'honor', 'high', '["郭婷婷"]', '人物时间轴', 19560101);

-- 赵成 (zhaocheng): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhaocheng-任职', 'zhaocheng', '赵成', '任职', '任教授', '担任成都理工大学物理电子学院教授', 'career', 'medium', '["赵成"]', '人物时间轴', 19560101),
('person-zhaocheng-贡献', 'zhaocheng', '赵成', '贡献', '多参数探测系统', '提出光纤分布式多参数探测系统', 'career', 'high', '["赵成"]', '人物时间轴', 19560101);

-- 陈俊 (chenjun): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-chenjun-任职', 'chenjun', '陈俊', '任职', '任教授', '担任成都理工大学地球物理学院教授', 'career', 'medium', '["陈俊"]', '人物时间轴', 19560101),
('person-chenjun-贡献', 'chenjun', '陈俊', '贡献', '实验观测体系', '建立成理地震科学实验观测体系', 'career', 'high', '["陈俊"]', '人物时间轴', 19560101);

-- 张国庆 (zhangguoqing): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhangguoqing-任职', 'zhangguoqing', '张国庆', '任职', '任教授', '担任成都理工大学地球科学学院教授、博士生导师', 'career', 'medium', '["张国庆"]', '人物时间轴', 19560101),
('person-zhangguoqing-荣誉', 'zhangguoqing', '张国庆', '荣誉', 'Nature子刊发表', '成果发表在Nature子刊', 'career', 'high', '["张国庆"]', '人物时间轴', 19560101);

-- 孙海涛 (sunhaitao): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-sunhaitao-任职', 'sunhaitao', '孙海涛', '任职', '任教授', '担任成都理工大学水文与环境学院教授', 'career', 'medium', '["孙海涛"]', '人物时间轴', 19560101),
('person-sunhaitao-贡献', 'sunhaitao', '孙海涛', '贡献', '国家重大专项', '主持多项国家重大专项', 'career', 'high', '["孙海涛"]', '人物时间轴', 19560101);

-- 李雪梅 (lixuemei): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-lixuemei-任职', 'lixuemei', '李雪梅', '任职', '任教授', '担任成都理工大学地球物理学院教授', 'career', 'medium', '["李雪梅"]', '人物时间轴', 19560101),
('person-lixuemei-荣誉', 'lixuemei', '李雪梅', '荣誉', '重点项目', '主持国家自然科学基金重点项目', 'career', 'high', '["李雪梅"]', '人物时间轴', 19560101);

-- 杨洪 (yanghong): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-yanghong-任职', 'yanghong', '杨洪', '任职', '任教授', '担任成都理工大学地质工程学院教授、博士生导师', 'career', 'medium', '["杨洪"]', '人物时间轴', 19560101),
('person-yanghong-贡献', 'yanghong', '杨洪', '贡献', '重大交通工程', '为川藏公路、雅西高速提供技术支持', 'career', 'high', '["杨洪"]', '人物时间轴', 19560101);

-- 周成林 (zhouchenglin): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhouchenglin-任职', 'zhouchenglin', '周成林', '任职', '任教授', '担任成都理工大学能源学院教授', 'career', 'medium', '["周成林"]', '人物时间轴', 19560101),
('person-zhouchenglin-贡献', 'zhouchenglin', '周成林', '贡献', '定量模型', '首次提出热流控制下的成烃效率定量模型', 'career', 'high', '["周成林"]', '人物时间轴', 19560101);

-- 朱小红 (zhuxiaohong): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhuxiaohong-任职', 'zhuxiaohong', '朱小红', '任职', '任教授', '担任成都理工大学计算机与信息科学学院教授', 'career', 'medium', '["朱小红"]', '人物时间轴', 19560101),
('person-zhuxiaohong-贡献', 'zhuxiaohong', '朱小红', '贡献', '智慧地学系统', '主持研发智慧地学信息系统', 'career', 'high', '["朱小红"]', '人物时间轴', 19560101);

-- 刘方 (liufang): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-liufang-任职', 'liufang', '刘方', '任职', '任教授', '担任成都理工大学艺术与传媒学院教授', 'career', 'medium', '["刘方"]', '人物时间轴', 19560101),
('person-liufang-贡献', 'liufang', '刘方', '贡献', '数字校园记忆', '主导数字校园记忆计划', 'career', 'high', '["刘方"]', '人物时间轴', 19560101);

-- 彭志勇 (pengzhiyong): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-pengzhiyong-任职', 'pengzhiyong', '彭志勇', '任职', '任教授', '担任成都理工大学地球化学学院教授', 'career', 'medium', '["彭志勇"]', '人物时间轴', 19560101),
('person-pengzhiyong-荣誉', 'pengzhiyong', '彭志勇', '荣誉', '省科技进步一等奖', '获四川省科技进步一等奖', 'honor', 'high', '["彭志勇"]', '人物时间轴', 19560101);

-- 陈静 (chenjing): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-chenjing-任职', 'chenjing', '陈静', '任职', '任教授', '担任成都理工大学文法学院教授', 'career', 'medium', '["陈静"]', '人物时间轴', 19560101),
('person-chenjing-贡献', 'chenjing', '陈静', '贡献', '国家立法咨询', '参与多项国家立法咨询项目', 'career', 'high', '["陈静"]', '人物时间轴', 19560101);

-- 黄文涛 (huangwentao): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-huangwentao-任职', 'huangwentao', '黄文涛', '任职', '任教授', '担任成都理工大学地球科学学院教授', 'career', 'medium', '["黄文涛"]', '人物时间轴', 19560101),
('person-huangwentao-贡献', 'huangwentao', '黄文涛', '贡献', '国际顶级期刊', '成果多次发表于国际顶级地学期刊', 'career', 'high', '["黄文涛"]', '人物时间轴', 19560101);

-- 张涛 (zhangtao): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhangtao-任职', 'zhangtao', '张涛', '任职', '任教授', '担任成都理工大学工程技术学院教授、博士生导师', 'career', 'medium', '["张涛"]', '人物时间轴', 19560101),
('person-zhangtao-贡献', 'zhangtao', '张涛', '贡献', '三维稳定性模型', '提出滑坡三维稳定性演化模型', 'career', 'high', '["张涛"]', '人物时间轴', 19560101);

-- 周莹 (zhouying): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhouying-任职', 'zhouying', '周莹', '任职', '任教授', '担任成都理工大学地球物理学院教授', 'career', 'medium', '["周莹"]', '人物时间轴', 19560101),
('person-zhouying-荣誉', 'zhouying', '周莹', '荣誉', '青年学者奖', '获中国地震学会青年学者奖', 'honor', 'high', '["周莹"]', '人物时间轴', 19560101);

-- 林峰 (linfeng): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-linfeng-任职', 'linfeng', '林峰', '任职', '任教授', '担任成都理工大学环境与土木工程学院教授', 'career', 'medium', '["林峰"]', '人物时间轴', 19560101),
('person-linfeng-贡献', 'linfeng', '林峰', '贡献', '国家重点专项', '主持国家重点专项', 'career', 'high', '["林峰"]', '人物时间轴', 19560101);

-- 彭涛 (pengtao): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-pengtao-任职', 'pengtao', '彭涛', '任职', '任教授', '担任成都理工大学能源学院教授', 'career', 'medium', '["彭涛"]', '人物时间轴', 19560101),
('person-pengtao-贡献', 'pengtao', '彭涛', '贡献', 'CO₂封存试点', '成果在四川盆地CO₂封存试点中应用', 'career', 'high', '["彭涛"]', '人物时间轴', 19560101);

-- 宋洁 (songjie): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-songjie-任职', 'songjie', '宋洁', '任职', '任教授', '担任成都理工大学文法学院教授', 'career', 'medium', '["宋洁"]', '人物时间轴', 19560101),
('person-songjie-贡献', 'songjie', '宋洁', '贡献', '教育部重点项目', '主持教育部重点项目', 'career', 'high', '["宋洁"]', '人物时间轴', 19560101);

-- 杨波 (yangbo): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-yangbo-任职', 'yangbo', '杨波', '任职', '任教授', '担任成都理工大学计算机与信息科学学院教授', 'career', 'medium', '["杨波"]', '人物时间轴', 19560101),
('person-yangbo-荣誉', 'yangbo', '杨波', '荣誉', '教学成果奖', '获教育部教学成果奖', 'honor', 'high', '["杨波"]', '人物时间轴', 19560101);

-- 李茜 (liqian): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-liqian-任职', 'liqian', '李茜', '任职', '任副教授', '担任成都理工大学艺术与传媒学院副教授', 'career', 'medium', '["李茜"]', '人物时间轴', 19560101),
('person-liqian-荣誉', 'liqian', '李茜', '荣誉', '省设计奖项', '多次获四川省设计奖项', 'honor', 'high', '["李茜"]', '人物时间轴', 19560101);

-- 王志强 (wangzhiqiang): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-wangzhiqiang-任职', 'wangzhiqiang', '王志强', '任职', '任教授', '担任成都理工大学地质工程学院教授', 'career', 'medium', '["王志强"]', '人物时间轴', 19560101),
('person-wangzhiqiang-贡献', 'wangzhiqiang', '王志强', '贡献', '应急决策系统', '开发地质灾害应急决策支持系统', 'career', 'high', '["王志强"]', '人物时间轴', 19560101);

-- 赵慧 (zhaohui): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-zhaohui-任职', 'zhaohui', '赵慧', '任职', '任教授', '担任成都理工大学外国语学院教授', 'career', 'medium', '["赵慧"]', '人物时间轴', 19560101),
('person-zhaohui-贡献', 'zhaohui', '赵慧', '贡献', '教育部项目', '主持教育部项目', 'career', 'high', '["赵慧"]', '人物时间轴', 19560101);

-- 陈勇 (chenyong): 2个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-chenyong-任职', 'chenyong', '陈勇', '任职', '任教授', '担任成都理工大学地球物理学院教授、博士生导师', 'career', 'medium', '["陈勇"]', '人物时间轴', 19560101),
('person-chenyong-荣誉', 'chenyong', '陈勇', '荣誉', '专家组成员', '中国地震灾害风险评估专家组成员', 'career', 'high', '["陈勇"]', '人物时间轴', 19560101);

-- 袁向军 (yuanxiangjun): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-yuanxiangjun-任职', 'yuanxiangjun', '袁向军', '任职', '担任成都理工大学教授', '担任成都理工大学教授，获得其他国家院士称号', 'education', 'high', '["袁向军"]', '人物时间轴', 19560101);

-- 刘耘 (liuyun): 1个事件
INSERT INTO `person_event` (`event_id`, `person_id`, `person_name`, `year`, `title`, `description`, `event_category`, `importance`, `tags`, `source`, `sort_order`) VALUES
('person-liuyun-任职', 'liuyun', '刘耘', '任职', '担任成都理工大学教授', '担任成都理工大学教授，获得国家杰出青年科学基金', 'education', 'high', '["刘耘"]', '人物时间轴', 19560101);

-- 共提取 57 位人物的 138 个时间轴事件
