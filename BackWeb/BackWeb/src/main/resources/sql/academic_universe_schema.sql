-- 学术星图数据库表结构
-- 数据库: javawebdb

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

