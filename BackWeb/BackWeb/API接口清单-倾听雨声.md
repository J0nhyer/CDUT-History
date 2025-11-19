# 倾听雨声模块所需API接口清单

## 前端KeywordRain.vue需要调用的API接口

### 1. 人物接口
```
GET /api/persons
```
返回字段需要：
- `name`: 人物姓名
- `awards`: 人物奖项（JSON数组字符串）

示例返回：
```json
[
  {
    "person_id": "liubaojun",
    "name": "刘宝珺",
    "awards": "[\"中国科学院院士\", \"李四光地质科学奖\"]"
  }
]
```

### 2. 历史事件接口
```
GET /api/history-events
```
返回字段需要：
- `year`: 年份
- `title`: 事件标题
- `keywords`: 事件关键词（逗号分隔字符串）

示例返回：
```json
[
  {
    "event_id": "event-1956",
    "year": "1956",
    "title": "成都地质学院成立",
    "keywords": "建校,地质,教育"
  }
]
```

### 3. 学术节点接口（学院/研究院）
```
GET /api/academic-nodes
```
返回字段需要：
- `name`: 节点名称（学院名）

示例返回：
```json
[
  {
    "node_id": "u01",
    "name": "地球科学学院"
  }
]
```

### 4. 专业接口
```
GET /api/academic-majors
```
返回字段需要：
- `name`: 专业名称

示例返回：
```json
[
  {
    "major_id": "u01-m1",
    "name": "地质学"
  }
]
```

## 后端实现建议

### Java Controller示例

```java
@RestController
@RequestMapping("/api")
public class KeywordRainController {
    
    @GetMapping("/persons")
    public List<Map<String, Object>> getPersons() {
        // 查询person表，只返回name和awards字段
        return personService.getBasicPersonInfo();
    }
    
    @GetMapping("/history-events")
    public List<Map<String, Object>> getHistoryEvents() {
        // 查询history_event表
        return historyEventService.getAllEvents();
    }
    
    @GetMapping("/academic-nodes")
    public List<Map<String, Object>> getAcademicNodes() {
        // 查询academic_node表
        return academicNodeService.getAllNodes();
    }
    
    @GetMapping("/academic-majors")
    public List<Map<String, Object>> getAcademicMajors() {
        // 查询academic_major表
        return academicMajorService.getAllMajors();
    }
}
```

## SQL查询参考

```sql
-- 1. 人物基本信息
SELECT person_id, name, awards FROM person WHERE data_status = 'completed';

-- 2. 历史事件
SELECT event_id, year, title, keywords FROM history_event;

-- 3. 学术节点
SELECT node_id, name FROM academic_node;

-- 4. 专业信息
SELECT major_id, name FROM academic_major;
```

## 注意事项

1. 所有接口支持CORS跨域
2. 返回数据格式统一为JSON
3. API无需分页（关键词雨会在前端处理数据量）
4. 建议添加缓存（Redis），减少数据库查询
5. 如果接口不存在，前端会fallback到默认关键词
