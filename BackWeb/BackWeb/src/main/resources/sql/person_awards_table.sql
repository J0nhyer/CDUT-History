-- ============================================
-- 人物荣誉成就表
-- 数据库: javawebdb
-- ============================================

USE javawebdb;

-- 创建人物荣誉成就表
CREATE TABLE IF NOT EXISTS `person_awards` (
  `award_id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '荣誉ID',
  `person_id` VARCHAR(50) NOT NULL COMMENT '人物ID（外键关联person表）',
  `award_name` VARCHAR(200) NOT NULL COMMENT '荣誉名称',
  `award_type` VARCHAR(50) NOT NULL COMMENT '荣誉类型：院士、国家级奖项、省部级奖项、学术职务、教学荣誉、其他',
  `award_level` VARCHAR(20) DEFAULT NULL COMMENT '荣誉级别：国际级、国家级、省部级、校级',
  `award_year` INT DEFAULT NULL COMMENT '获奖年份',
  `award_date` DATE DEFAULT NULL COMMENT '获奖具体日期',
  `awarding_organization` VARCHAR(200) DEFAULT NULL COMMENT '颁奖机构',
  `award_description` TEXT DEFAULT NULL COMMENT '荣誉描述',
  `award_rank` VARCHAR(50) DEFAULT NULL COMMENT '奖项等级（如：特等奖、一等奖、二等奖）',
  `is_major` TINYINT(1) DEFAULT 0 COMMENT '是否为重大荣誉（用于首页展示）',
  `display_order` INT DEFAULT 0 COMMENT '显示顺序',
  `needs_verification` TINYINT(1) DEFAULT 0 COMMENT '是否需要核实',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  INDEX `idx_person_id` (`person_id`),
  INDEX `idx_award_type` (`award_type`),
  INDEX `idx_award_year` (`award_year`),
  INDEX `idx_is_major` (`is_major`),
  
  -- 外键约束
  FOREIGN KEY (`person_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人物荣誉成就表';

-- 创建荣誉类型枚举说明
-- award_type 可选值：
-- '院士' - 中国科学院院士、中国工程院院士、外国院士等
-- '国家级奖项' - 国家科技进步奖、国家自然科学奖等
-- '省部级奖项' - 省部级科技进步奖等
-- '学术职务' - 学会理事长、期刊编委等
-- '教学荣誉' - 教学名师、优秀教师等
-- '人才计划' - 国家杰青、长江学者、万人计划等
-- '其他荣誉'

-- award_level 可选值：
-- '国际级' - 国际学术组织荣誉、国际奖项
-- '国家级' - 国家级荣誉和奖项
-- '省部级' - 省部级荣誉和奖项
-- '校级' - 学校级别荣誉
