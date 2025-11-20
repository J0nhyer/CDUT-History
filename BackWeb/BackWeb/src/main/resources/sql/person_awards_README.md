# 人物荣誉成就表使用说明

## 表结构

`person_awards` 表专门用于存储人物的各类荣誉成就，与 `person` 表通过 `person_id` 关联。

### 字段说明

| 字段名 | 类型 | 说明 | 示例 |
|-------|------|------|------|
| award_id | INT | 主键，自增ID | 1 |
| person_id | VARCHAR(50) | 人物ID（外键） | 'liubaojun' |
| award_name | VARCHAR(200) | 荣誉名称 | '中国科学院院士' |
| award_type | VARCHAR(50) | 荣誉类型 | '院士'、'国家级奖项'等 |
| award_level | VARCHAR(20) | 荣誉级别 | '国际级'、'国家级'、'省部级'、'校级' |
| award_year | INT | 获奖年份 | 2009 |
| award_date | DATE | 获奖具体日期 | '2009-12-01' |
| awarding_organization | VARCHAR(200) | 颁奖机构 | '中国科学院' |
| award_description | TEXT | 荣誉描述 | '地质工程领域' |
| award_rank | VARCHAR(50) | 奖项等级 | '特等奖'、'一等奖'、'二等奖' |
| is_major | TINYINT(1) | 是否为重大荣誉 | 1=是，0=否 |
| display_order | INT | 显示顺序 | 1, 2, 3... |
| needs_verification | TINYINT(1) | 是否需要核实 | 1=需要，0=不需要 |

## 荣誉类型分类

### award_type（荣誉类型）可选值：

1. **院士** - 中国科学院院士、中国工程院院士、外国院士等
2. **国家级奖项** - 国家科技进步奖、国家自然科学奖、国家技术发明奖等
3. **省部级奖项** - 省部级科技进步奖等
4. **学术职务** - 学会理事长、期刊编委、实验室主任等
5. **教学荣誉** - 教学名师、优秀教师等
6. **人才计划** - 国家杰青、长江学者、万人计划、百千万人才工程等
7. **学术荣誉** - 学科奠基人、开拓者等学术贡献认定
8. **其他荣誉** - 劳动模范、优秀党员等

### award_level（荣誉级别）可选值：

1. **国际级** - 国际学术组织荣誉、国际奖项（如瓦尔特奖章、美国地质学会会士）
2. **国家级** - 国家级荣誉和奖项（如院士、国家科技进步奖）
3. **省部级** - 省部级荣誉和奖项
4. **校级** - 学校级别荣誉

## 使用步骤

### 1. 创建表结构
```bash
mysql -u root -p javawebdb < person_awards_table.sql
```

### 2. 导入荣誉数据
```bash
mysql -u root -p javawebdb < person_awards_data.sql
```

## 查询示例

### 查询某人物的所有荣誉（按显示顺序排列）
```sql
SELECT * FROM person_awards 
WHERE person_id = 'liubaojun' 
ORDER BY display_order;
```

### 查询某人物的重大荣誉
```sql
SELECT * FROM person_awards 
WHERE person_id = 'liubaojun' AND is_major = 1 
ORDER BY display_order;
```

### 查询某类型的所有荣誉
```sql
SELECT p.name, pa.award_name, pa.award_year
FROM person p
JOIN person_awards pa ON p.person_id = pa.person_id
WHERE pa.award_type = '院士'
ORDER BY pa.award_year DESC;
```

### 查询某年份的所有获奖人物
```sql
SELECT p.name, pa.award_name, pa.awarding_organization
FROM person p
JOIN person_awards pa ON p.person_id = pa.person_id
WHERE pa.award_year = 2009
ORDER BY p.name;
```

### 统计每个人的荣誉数量
```sql
SELECT p.name, COUNT(*) as award_count
FROM person p
LEFT JOIN person_awards pa ON p.person_id = pa.person_id
GROUP BY p.person_id, p.name
ORDER BY award_count DESC;
```

### 查询国际级荣誉
```sql
SELECT p.name, pa.award_name, pa.award_level, pa.award_year
FROM person p
JOIN person_awards pa ON p.person_id = pa.person_id
WHERE pa.award_level = '国际级'
ORDER BY pa.award_year DESC;
```

## 数据维护建议

1. **is_major字段**：标记为1的荣誉可用于首页展示或人物卡片的重点展示
2. **display_order字段**：数字越小优先级越高，建议重要荣誉使用较小的数字
3. **award_year字段**：尽量填写准确年份，便于时间线展示
4. **needs_verification字段**：新增数据时如果信息不确定，可标记为1，待核实后改为0

## 与现有person表的关系

- `person` 表的 `awards` 字段（JSON格式）仍保留作为快速展示
- `person_awards` 表存储详细的荣誉信息，支持更复杂的查询和统计
- 建议前端优先使用 `person_awards` 表数据，`person.awards` 作为备选

## 后续扩展建议

1. 可以添加 `award_certificate_url` 字段存储证书图片路径
2. 可以添加 `award_team_members` 字段记录团队成员（对于集体奖项）
3. 可以添加 `award_ranking` 字段记录个人在获奖团队中的排名
