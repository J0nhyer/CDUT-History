-- ====================================================
-- 学术星图数据初始化脚本
-- 执行方式: 
--   方法1: mysql -u root -p javawebdb < init_academic_universe.sql
--   方法2: 在MySQL客户端执行 source init_academic_universe.sql
-- ====================================================

USE javawebdb;

-- ========== 第一步：创建表结构 ==========

-- 1. 学术星图大学信息表
CREATE TABLE IF NOT EXISTS `academic_universe` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `university_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '大学唯一标识（如：cdut）',
    `name` VARCHAR(200) NOT NULL COMMENT '大学名称',
    `type` VARCHAR(50) DEFAULT 'university' COMMENT '类型：university',
    `position_x` DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'X坐标位置',
    `position_y` DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Y坐标位置',
    `position_z` DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Z坐标位置',
    `size` DECIMAL(10, 2) DEFAULT 3.00 COMMENT '大小',
    `description` TEXT COMMENT '描述',
    `color` VARCHAR(20) DEFAULT '0xffaa00' COMMENT '颜色（十六进制）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_university_id` (`university_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学术星图大学信息表';

-- 2. 学术星图节点表（学院/研究院/实验室）
CREATE TABLE IF NOT EXISTS `academic_node` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `node_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '节点唯一标识（如：u01）',
    `name` VARCHAR(500) NOT NULL COMMENT '节点名称',
    `type` VARCHAR(50) DEFAULT 'small_star' COMMENT '节点类型：small_star/lab/institute等',
    `position_x` DECIMAL(10, 2) NOT NULL COMMENT 'X坐标位置',
    `position_y` DECIMAL(10, 2) NOT NULL COMMENT 'Y坐标位置',
    `position_z` DECIMAL(10, 2) NOT NULL COMMENT 'Z坐标位置',
    `size` DECIMAL(10, 2) NOT NULL COMMENT '大小',
    `color` VARCHAR(20) NOT NULL COMMENT '颜色（十六进制）',
    `title` VARCHAR(500) COMMENT '标题',
    `description` TEXT COMMENT '描述',
    `style_glow` DECIMAL(5, 2) DEFAULT 0.60 COMMENT '发光强度（0-1.2）',
    `style_ring` TINYINT(1) DEFAULT 0 COMMENT '是否有光环：0-否，1-是',
    `style_shape` VARCHAR(50) COMMENT '形状：sphere/hex/diamond/triangle等',
    `start_year` INT COMMENT '起始年份（用于时间轴显示）',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_node_id` (`node_id`),
    INDEX `idx_type` (`type`),
    INDEX `idx_start_year` (`start_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学术星图节点表';

-- 3. 学术星图专业表
CREATE TABLE IF NOT EXISTS `academic_major` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `node_id` VARCHAR(100) NOT NULL COMMENT '节点ID（关联academic_node.node_id）',
    `major_id` VARCHAR(100) NOT NULL COMMENT '专业唯一标识（如：u03-m1）',
    `name` VARCHAR(200) NOT NULL COMMENT '专业名称',
    `level` VARCHAR(50) COMMENT '专业层次：本科/研究生/博士等',
    `color` VARCHAR(20) COMMENT '专业颜色（十六进制，可选）',
    `description` TEXT COMMENT '专业描述',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_node_id` (`node_id`),
    INDEX `idx_major_id` (`major_id`),
    FOREIGN KEY (`node_id`) REFERENCES `academic_node`(`node_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学术星图专业表';

-- 4. 学术星图节点关系表
CREATE TABLE IF NOT EXISTS `academic_relation` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `source_node_id` VARCHAR(100) NOT NULL COMMENT '源节点ID（关联academic_node.node_id）',
    `target_node_id` VARCHAR(100) COMMENT '目标节点ID（关联academic_node.node_id，可为空）',
    `target_name` VARCHAR(500) COMMENT '目标名称（如果target_node_id为空时使用）',
    `relation_type` VARCHAR(100) NOT NULL COMMENT '关系类型',
    `description` TEXT COMMENT '关系描述',
    `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_source_node_id` (`source_node_id`),
    INDEX `idx_target_node_id` (`target_node_id`),
    INDEX `idx_relation_type` (`relation_type`),
    FOREIGN KEY (`source_node_id`) REFERENCES `academic_node`(`node_id`) ON DELETE CASCADE,
    FOREIGN KEY (`target_node_id`) REFERENCES `academic_node`(`node_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学术星图节点关系表';

-- ========== 第二步：清空旧数据（如果需要重新初始化） ==========

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE academic_major;
TRUNCATE TABLE academic_relation;
TRUNCATE TABLE academic_node;
TRUNCATE TABLE academic_universe;
SET FOREIGN_KEY_CHECKS = 1;

-- ========== 第三步：插入数据 ==========

-- 插入大学信息
INSERT INTO academic_universe
  (university_id, name, type, position_x, position_y, position_z, size, description, color)
VALUES
  ('cdut', '成都理工大学', 'university', 0.00, 0.00, 0.00, 3.00, '', '0xffaa00');

-- 插入学院/实验室节点
INSERT INTO academic_node
  (node_id, name, type, position_x, position_y, position_z, size, color, title, description, style_glow, style_ring, style_shape, start_year, sort_order)
VALUES
  ('u01', '油气藏地质及开发工程全国重点实验室（成都理工大学）', 'small_star', 9.60, 0.40, 2.80, 0.72, '0x8a2be2', '', '', 0.90, 1, 'sphere', NULL, 1),
  ('u02', '地质灾害防治与地质环境保护全国重点实验室', 'small_star', 7.80, -0.60, -6.50, 0.70, '0x8a2be2', '', '', 0.85, 1, 'sphere', NULL, 2),
  ('u03', '能源学院（页岩气现代产业学院）', 'small_star', 3.20, 1.90, -10.80, 0.64, '0xf59e0b', '', '', 0.70, 0, 'sphere', NULL, 3),
  ('u04', '地球物理学院', 'small_star', -2.60, 2.60, -11.40, 0.66, '0x9ca3af', '', '', 0.70, 0, NULL, NULL, 4),
  ('u05', '地球与行星科学学院', 'small_star', 6.10, -1.10, -4.80, 0.66, '0x9ca3af', '', '', 0.65, 0, NULL, NULL, 5),
  ('u06', '材料与化学化工学院（锂资源与锂电产业学院）', 'small_star', -7.20, 1.20, -8.60, 0.68, '0x9ca3af', '', '', 0.75, 0, 'hex', NULL, 6),
  ('u07', '马克思主义学院', 'small_star', -11.30, 0.70, -1.90, 0.60, '0xfda4af', '', '', 0.55, NULL, NULL, NULL, 7),
  ('u08', '外国语学院', 'small_star', -12.00, -0.80, 1.40, 0.62, '0xfda4af', '', '', 0.60, NULL, 'diamond', NULL, 8),
  ('u09', '传播科学与艺术学院', 'small_star', -10.50, 2.10, 5.40, 0.66, '0xfda4af', '', '', 0.75, NULL, NULL, NULL, 9),
  ('u10', '计算机与网络安全学院（示范性软件学院）', 'small_star', -6.40, 3.00, 9.50, 0.70, '0xf59e0b', '', '', 0.90, 1, NULL, NULL, 10),
  ('u11', '生态环境学院', 'small_star', -0.90, 3.40, 12.10, 0.60, '0x4ade80', '', '', 0.60, NULL, 'triangle', NULL, 11),
  ('u12', '物理学院', 'small_star', 4.90, 2.50, 11.10, 0.62, '0x9ca3af', '', '', 0.65, NULL, NULL, NULL, 12),
  ('u13', '沉积地质研究院', 'small_star', 9.70, 1.60, 7.70, 0.72, '0x8a2be2', '', '', 0.90, 1, NULL, NULL, 13),
  ('u14', '环境与土木工程学院', 'small_star', 2.40, -1.20, -8.10, 0.62, '0xf59e0b', '', '', 0.65, NULL, NULL, NULL, 14),
  ('u15', '核技术与自动化工程学院', 'small_star', -3.90, -2.00, -7.00, 0.66, '0xf59e0b', '', '', 0.80, NULL, 'hex', NULL, 15),
  ('u16', '管理科学学院', 'small_star', -8.20, -0.90, -3.10, 0.60, '0xfdba74', '', '', 0.55, NULL, NULL, NULL, 16),
  ('u17', '文法学院（纪检监察学院）', 'small_star', -9.00, 0.20, 1.90, 0.63, '0xfda4af', '', '', 0.65, NULL, NULL, NULL, 17),
  ('u18', '商学院', 'small_star', -7.10, 1.40, 5.60, 0.64, '0xfdba74', '', '', 0.70, NULL, 'diamond', NULL, 18),
  ('u19', '体育学院', 'small_star', -2.10, 2.20, 9.10, 0.60, '0x60a5fa', '', '', 0.60, NULL, NULL, NULL, 19),
  ('u20', '地理与规划学院', 'small_star', 2.90, 2.90, 9.40, 0.66, '0x4ade80', '', '', 0.75, NULL, NULL, NULL, 20),
  ('u21', '数学科学学院', 'small_star', 6.70, -0.30, 7.50, 0.62, '0x9ca3af', '', '', 0.60, NULL, 'triangle', NULL, 21),
  ('u22', '机电工程学院', 'small_star', 10.60, 1.10, 2.40, 0.68, '0xf59e0b', '', '', 0.80, 1, NULL, NULL, 22),
  ('u23', '国际教育学院（成都理工大学牛津布鲁克斯学院）', 'small_star', 10.20, -1.40, -3.90, 0.61, '0x60a5fa', '', '', 0.60, NULL, NULL, NULL, 23);

-- 插入专业信息
INSERT INTO academic_major (node_id, major_id, name, level, color, description, sort_order)
VALUES
  ('u03', 'u03-m1', '石油工程', '本科', NULL, NULL, 1),
  ('u03', 'u03-m2', '能源与动力工程', '本科', NULL, NULL, 2),
  ('u03', 'u03-m3', '油气储运工程', '本科', NULL, NULL, 3),
  ('u04', 'u04-m1', '地球物理学', '本科', NULL, NULL, 1),
  ('u04', 'u04-m2', '勘查技术与工程', '本科', NULL, NULL, 2),
  ('u04', 'u04-m3', '空间信息与数字技术', '本科', NULL, NULL, 3),
  ('u05', 'u05-m1', '地质学', '本科', NULL, NULL, 1),
  ('u05', 'u05-m2', '地球信息科学与技术', '本科', NULL, NULL, 2),
  ('u05', 'u05-m3', '行星科学相关专业', '本科', NULL, NULL, 3),
  ('u06', 'u06-m1', '材料化学', '本科', NULL, NULL, 1),
  ('u06', 'u06-m2', '化学工程与工艺', '本科', NULL, NULL, 2),
  ('u06', 'u06-m3', '应用化学', '本科', NULL, NULL, 3),
  ('u07', 'u07-m1', '思想政治教育', '本科', NULL, NULL, 1),
  ('u07', 'u07-m2', '马克思主义理论', '研究生', NULL, NULL, 2),
  ('u07', 'u07-m3', '中国近现代史基本问题研究', '研究生', NULL, NULL, 3),
  ('u08', 'u08-m1', '英语', '本科', NULL, NULL, 1),
  ('u08', 'u08-m2', '翻译', '本科', NULL, NULL, 2),
  ('u08', 'u08-m3', '商务英语', '本科', NULL, NULL, 3),
  ('u09', 'u09-m1', '广告学', '本科', NULL, NULL, 1),
  ('u09', 'u09-m2', '传播学', '本科', NULL, NULL, 2),
  ('u09', 'u09-m3', '数字媒体艺术', '本科', NULL, NULL, 3),
  ('u10', 'u10-m1', '计算机科学与技术', '本科', NULL, NULL, 1),
  ('u10', 'u10-m2', '软件工程', '本科', NULL, NULL, 2),
  ('u10', 'u10-m3', '网络空间安全', '本科', NULL, NULL, 3),
  ('u11', 'u11-m1', '环境工程', '本科', NULL, NULL, 1),
  ('u11', 'u11-m2', '环境科学', '本科', NULL, NULL, 2),
  ('u11', 'u11-m3', '生态学', '本科', NULL, NULL, 3),
  ('u12', 'u12-m1', '应用物理学', '本科', NULL, NULL, 1),
  ('u12', 'u12-m2', '光电信息科学与工程', '本科', NULL, NULL, 2),
  ('u12', 'u12-m3', '核物理相关专业', '本科', NULL, NULL, 3),
  ('u14', 'u14-m1', '土木工程', '本科', NULL, NULL, 1),
  ('u14', 'u14-m2', '给排水科学与工程', '本科', NULL, NULL, 2),
  ('u14', 'u14-m3', '城市地下空间工程', '本科', NULL, NULL, 3),
  ('u15', 'u15-m1', '核工程与核技术', '本科', NULL, NULL, 1),
  ('u15', 'u15-m2', '自动化', '本科', NULL, NULL, 2),
  ('u15', 'u15-m3', '测控技术与仪器', '本科', NULL, NULL, 3),
  ('u16', 'u16-m1', '信息管理与信息系统', '本科', NULL, NULL, 1),
  ('u16', 'u16-m2', '工程管理', '本科', NULL, NULL, 2),
  ('u16', 'u16-m3', '管理科学', '本科', NULL, NULL, 3),
  ('u17', 'u17-m1', '汉语言文学', '本科', NULL, NULL, 1),
  ('u17', 'u17-m2', '法学', '本科', NULL, NULL, 2),
  ('u17', 'u17-m3', '新闻学', '本科', NULL, NULL, 3),
  ('u18', 'u18-m1', '会计学', '本科', NULL, NULL, 1),
  ('u18', 'u18-m2', '财务管理', '本科', NULL, NULL, 2),
  ('u18', 'u18-m3', '工商管理', '本科', NULL, NULL, 3),
  ('u19', 'u19-m1', '社会体育指导与管理', '本科', NULL, NULL, 1),
  ('u19', 'u19-m2', '体育教育', '本科', NULL, NULL, 2),
  ('u19', 'u19-m3', '运动训练', '本科', NULL, NULL, 3),
  ('u20', 'u20-m1', '地理信息科学', '本科', NULL, NULL, 1),
  ('u20', 'u20-m2', '自然地理与资源环境', '本科', NULL, NULL, 2),
  ('u20', 'u20-m3', '城乡规划', '本科', NULL, NULL, 3),
  ('u21', 'u21-m1', '数学与应用数学', '本科', NULL, NULL, 1),
  ('u21', 'u21-m2', '信息与计算科学', '本科', NULL, NULL, 2),
  ('u21', 'u21-m3', '统计学', '本科', NULL, NULL, 3),
  ('u22', 'u22-m1', '机械设计制造及其自动化', '本科', NULL, NULL, 1),
  ('u22', 'u22-m2', '车辆工程', '本科', NULL, NULL, 2),
  ('u22', 'u22-m3', '过程装备与控制工程', '本科', NULL, NULL, 3),
  ('u23', 'u23-m1', '工程管理（中外合作）', '本科', NULL, NULL, 1),
  ('u23', 'u23-m2', '国际经济与贸易（中外合作）', '本科', NULL, NULL, 2),
  ('u23', 'u23-m3', '计算机科学与技术（中外合作）', '本科', NULL, NULL, 3);

-- 插入关系信息（能源学院示例）
INSERT INTO academic_relation (source_node_id, target_node_id, target_name, relation_type, description, sort_order)
VALUES
  ('u03', NULL, '中国石油', '产学研合作', '', 0),
  ('u03', NULL, '中国石化', '产学研合作', '', 1),
  ('u03', 'u01', '油气藏地质及开发工程全国重点实验室（成都理工大学）', '科研协作', '', 2);

-- ========== 第四步：验证数据 ==========

SELECT '===== 初始化完成，数据验证 =====' AS status;

SELECT '大学信息:' AS table_name, COUNT(*) AS count FROM academic_universe
UNION ALL
SELECT '学院/实验室节点:', COUNT(*) FROM academic_node
UNION ALL
SELECT '专业信息:', COUNT(*) FROM academic_major
UNION ALL
SELECT '关系信息:', COUNT(*) FROM academic_relation;

SELECT '===== 大学信息详情 =====' AS info;
SELECT * FROM academic_universe WHERE university_id = 'cdut';

SELECT '===== 前5个节点 =====' AS info;
SELECT node_id, name, type, color FROM academic_node ORDER BY sort_order LIMIT 5;
