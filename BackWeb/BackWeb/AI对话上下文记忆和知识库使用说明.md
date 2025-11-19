# AI对话上下文记忆和知识库功能使用说明

## 功能概述

本系统实现了完整的AI对话上下文记忆功能和增强的知识库系统，主要特性包括：

### 1. 上下文记忆功能
- 自动保存对话历史到数据库
- 支持多会话管理
- 自动加载历史上下文进行连续对话
- 支持会话的创建、查询、删除

### 2. 知识库系统
- 从现有数据库自动导入知识（历史事件、人物、传记等）
- 支持全文搜索和关键词搜索
- 知识文档分类管理
- 智能检索相关知识用于AI回答

## 数据库表结构

### 核心表：
1. **chat_session** - 聊天会话表
2. **chat_message** - 聊天消息表
3. **knowledge_document** - 知识库文档表
4. **knowledge_category** - 知识库类别表
5. **knowledge_embedding** - 知识库向量索引表（预留）

## 初始化步骤

### 1. 创建数据库表
```bash
# 执行以下SQL脚本
mysql -u root -p javawebdb < BackWeb/BackWeb/src/main/resources/sql/ai_chat_context_schema.sql
```

### 2. 初始化知识库
```bash
# 从现有数据库导入知识
mysql -u root -p javawebdb < BackWeb/BackWeb/src/main/resources/sql/knowledge_base_init.sql
```

## API接口说明

### AI对话接口

#### 1. 普通聊天（无上下文）
```
POST /api/ai/chat
Content-Type: application/json

{
  "question": "成都理工大学什么时候建校？",
  "useKnowledgeBase": true,
  "temperature": 0.7
}
```

#### 2. 带上下文记忆的聊天（推荐）
```
POST /api/ai/chat-with-context
Content-Type: application/json

{
  "question": "成都理工大学什么时候建校？",
  "sessionId": "可选，不传则自动创建新会话",
  "userId": "user123",
  "useKnowledgeBase": true,
  "temperature": 0.7
}
```

### 会话管理接口

#### 1. 创建新会话
```
POST /api/chat/sessions
Content-Type: application/json

{
  "userId": "user123",
  "title": "关于校史的对话"
}
```

#### 2. 获取用户的所有会话
```
GET /api/chat/sessions?userId=user123&limit=50
```

#### 3. 获取会话详情
```
GET /api/chat/sessions/{sessionId}
```

#### 4. 获取会话的历史消息
```
GET /api/chat/sessions/{sessionId}/messages?limit=50
```

#### 5. 获取会话的完整上下文
```
GET /api/chat/sessions/{sessionId}/context?messageLimit=20
```

#### 6. 删除会话
```
DELETE /api/chat/sessions/{sessionId}
```

#### 7. 更新会话标题
```
PUT /api/chat/sessions/{sessionId}/title
Content-Type: application/json

{
  "title": "新的会话标题"
}
```

### 知识库接口

#### 1. 添加知识文档
```
POST /api/knowledge-v2/documents
Content-Type: application/json

{
  "title": "学校发展历程",
  "content": "成都理工大学始建于1956年...",
  "contentType": "text",
  "sourceType": "manual",
  "tags": ["历史", "发展"],
  "metadata": {
    "author": "管理员",
    "year": "2023"
  }
}
```

#### 2. 搜索知识文档
```
GET /api/knowledge-v2/documents/search?query=建校&limit=10
```

#### 3. 获取知识上下文（用于AI对话）
```
GET /api/knowledge-v2/context?query=建校历史&limit=5
```

#### 4. 获取所有知识文档
```
GET /api/knowledge-v2/documents?limit=100
```

#### 5. 按来源类型获取文档
```
GET /api/knowledge-v2/documents/by-source/{sourceType}?limit=100

# sourceType可选值：database, manual, import, crawl
```

#### 6. 获取知识库统计信息
```
GET /api/knowledge-v2/statistics
```

## 前端集成示例

### Vue.js 示例

```javascript
// 创建新会话并开始对话
async function startNewChat() {
  // 1. 创建会话
  const sessionResponse = await fetch('/api/chat/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user123',
      title: '新对话'
    })
  });
  const session = await sessionResponse.json();
  
  // 2. 发送消息
  const eventSource = new EventSource('/api/ai/chat-with-context', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: '成都理工大学什么时候建校？',
      sessionId: session.sessionId,
      userId: 'user123'
    })
  });
  
  eventSource.addEventListener('message', (event) => {
    console.log('收到AI回复:', event.data);
  });
}

// 加载历史会话
async function loadChatHistory() {
  const response = await fetch('/api/chat/sessions?userId=user123&limit=50');
  const sessions = await response.json();
  console.log('历史会话:', sessions);
}

// 加载会话的消息
async function loadSessionMessages(sessionId) {
  const response = await fetch(`/api/chat/sessions/${sessionId}/messages?limit=50`);
  const messages = await response.json();
  console.log('历史消息:', messages);
}
```

## 数据流程

### 对话流程：
1. 用户发送问题 → 创建/获取会话
2. 系统从知识库检索相关知识
3. 系统从数据库加载历史消息
4. 构建完整上下文（系统提示 + 知识 + 历史 + 当前问题）
5. 调用AI模型生成回答
6. 保存用户问题和AI回答到数据库
7. 更新会话信息

### 知识库流程：
1. 系统启动时自动从现有数据库导入知识
2. 用户提问时，系统根据问题检索相关知识
3. 检索到的知识作为上下文提供给AI
4. AI基于知识库回答问题

## 知识库数据来源

系统会自动从以下表导入知识：
- `history_event` - 历史事件
- `person` - 人物基本信息
- `person_biography` - 人物传记
- `person_event` - 人物时间轴事件

每次导入会自动分类到对应的知识类别。

## 优化建议

### 1. 性能优化
- 对于大量历史消息，可以限制加载数量（如最近20条）
- 使用缓存减少数据库查询
- 考虑异步处理知识库更新

### 2. 功能扩展
- 实现真实的向量检索（使用embedding）
- 添加对话摘要功能
- 支持对话导出/分享
- 添加用户反馈机制

### 3. 安全性
- 添加用户认证和授权
- 限制会话数量和消息长度
- 敏感信息过滤

## 故障排查

### 问题1：无法保存对话历史
- 检查数据库表是否创建成功
- 检查数据库连接配置
- 查看后端日志

### 问题2：知识库搜索不到内容
- 确认已执行knowledge_base_init.sql
- 检查MySQL全文索引是否创建
- 尝试使用关键词搜索

### 问题3：上下文没有加载
- 检查sessionId是否正确
- 确认消息已成功保存到数据库
- 查看service层日志

## 技术栈

- **后端**: Spring Boot + MyBatis-Plus
- **数据库**: MySQL 8.0+
- **AI模型**: 阿里云百炼
- **流式传输**: Server-Sent Events (SSE)

## 相关文件

### SQL脚本
- `ai_chat_context_schema.sql` - 数据库表结构
- `knowledge_base_init.sql` - 知识库初始化

### Java类
- `ChatSession.java` - 会话模型
- `ChatMessage.java` - 消息模型
- `KnowledgeDocument.java` - 知识文档模型
- `ChatContextService.java` - 会话上下文服务
- `EnhancedKnowledgeBaseService.java` - 增强知识库服务
- `EnhancedAiAssistantService.java` - 增强AI助手服务
- `ChatContextController.java` - 会话管理控制器
- `EnhancedKnowledgeController.java` - 知识库控制器

## 联系支持

如有问题，请查看项目文档或联系开发团队。
