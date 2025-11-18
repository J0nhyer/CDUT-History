-- 检查liubaojun人物数据
USE javawebdb;

-- 1. 检查person表中是否有liubaojun
SELECT '=== Person表数据 ===' AS info;
SELECT * FROM person WHERE person_id = 'liubaojun';

-- 2. 检查biography数据
SELECT '=== Biography表数据 ===' AS info;
SELECT * FROM person_biography WHERE person_id = 'liubaojun';

-- 3. 检查relationship数据
SELECT '=== Relationship表数据 ===' AS info;
SELECT * FROM person_relationship WHERE person_id = 'liubaojun' OR related_person_id = 'liubaojun';

-- 4. 检查person_profile表数据
SELECT '=== PersonProfile表数据 ===' AS info;
SELECT * FROM person_profile WHERE person_id = 'liubaojun';

-- 5. 如果person表中没有数据，插入liubaojun
INSERT INTO `person` (`person_id`, `name`, `subtitle`, `image_url`, `key_tags`, `data_status`, `last_verified`) 
SELECT 'liubaojun', '刘宝珺', '中国科学院院士 · 沉积地质学家 · 成都理工大学名誉校长', '@/assets/persons/liubaojun.png', '["中国科学院院士","沉积地质学奠基人","李四光奖获得者"]', 'completed', '2025-10-30'
WHERE NOT EXISTS (SELECT 1 FROM person WHERE person_id = 'liubaojun');

-- 6. 验证插入结果
SELECT '=== 插入后Person表数据 ===' AS info;
SELECT * FROM person WHERE person_id = 'liubaojun';
