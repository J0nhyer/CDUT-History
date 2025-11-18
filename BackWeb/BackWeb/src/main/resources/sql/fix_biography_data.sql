-- 修复人物简介数据
USE javawebdb;

-- 首先检查是否已经有数据
SELECT '检查现有数据...' as status;
SELECT COUNT(*) as current_biography_count FROM person_biography;

-- 如果没有数据，插入基本的biography数据
-- 这里插入几个重要人物的简介作为示例

-- 删除可能存在的旧数据（如果需要重新插入）
-- DELETE FROM person_biography WHERE person_id IN ('liubaojun', 'zhangzhuoyuan', 'wangchengshan');

-- 插入刘宝珺的biography
INSERT INTO person_biography (person_id, title, content, tags, sort_order) VALUES
('liubaojun', '人物简介', '<p>刘宝珺（1936-），中国科学院院士，著名沉积地质学家，成都理工大学名誉校长。刘宝珺院士长期从事沉积学、沉积盆地分析、层序地层学和古地理学研究，为我国沉积地质学的发展做出了重要贡献。</p>', '["简介"]', 0),
('liubaojun', '学术成就', '<p>刘宝珺院士在沉积学理论和方法研究方面做出了开创性贡献。他提出的沉积盆地分析方法和层序地层学理论，在我国石油天然气勘探中得到广泛应用。他主编的《沉积岩石学》教材成为该领域的经典教科书，培养了一代又一代沉积地质学人才。</p>', '["学术"]', 1),
('liubaojun', '获得荣誉', '<p>1997年当选为中国科学院院士，获李四光奖等多项荣誉。他的研究成果多次获得国家自然科学奖和省部级科技进步奖。</p>', '["荣誉"]', 2);

-- 插入张倬元的biography
INSERT INTO person_biography (person_id, title, content, tags, sort_order) VALUES
('zhangzhuoyuan', '人物简介', '<p>张倬元（1933-2017），中国著名工程地质学家，成都理工大学教授，我国工程地质学的奠基者之一。张倬元教授长期从事工程地质、地质灾害研究，为我国工程地质学的发展做出了卓越贡献。</p>', '["简介"]', 0),
('zhangzhuoyuan', '学术贡献', '<p>张倬元教授在地质灾害防治和工程地质研究方面取得了突出成就。他创建了我国第一个地质灾害防治研究机构，建立了系统的地质灾害评价和防治理论体系。他的研究成果在三峡工程、西南地区交通建设等国家重大工程中得到应用。</p>', '["学术"]', 1);

-- 插入王成善的biography  
INSERT INTO person_biography (person_id, title, content, tags, sort_order) VALUES
('wangchengshan', '人物简介', '<p>王成善（1953-），中国科学院院士，著名沉积地质学家，成都理工大学教授。王成善院士长期从事沉积学、地层学研究，在白垩纪地质事件、古海洋学等领域取得了重要成果。</p>', '["简介"]', 0),
('wangchengshan', '研究领域', '<p>王成善院士在白垩纪地质研究方面做出了国际领先的工作。他主持完成的多项国家重大科研项目，揭示了白垩纪海洋和气候演化的重要规律，为认识地球历史和气候变化提供了重要科学依据。</p>', '["研究"]', 1);

-- 检查插入结果
SELECT '插入完成，检查结果...' as status;
SELECT 
    pb.person_id,
    p.name,
    pb.title,
    pb.sort_order
FROM person_biography pb
LEFT JOIN person p ON pb.person_id = p.person_id
WHERE pb.person_id IN ('liubaojun', 'zhangzhuoyuan', 'wangchengshan')
ORDER BY pb.person_id, pb.sort_order;

SELECT '修复完成！' as status;
