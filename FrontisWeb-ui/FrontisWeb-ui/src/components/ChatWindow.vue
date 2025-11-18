<template>
  <div class="chat-window">
    <!-- 聊天窗口头部 -->
    <div class="chat-header">
      <div class="header-info">
        <div class="avatar">
          <img src="https://via.placeholder.com/40x40/4a90e2/ffffff?text=AI" alt="AI助手">
        </div>
        <div class="user-info">
          <h3>AI助手</h3>
          <span class="status">在线</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="minimizeWindow">
          <i class="fas fa-minus"></i>
        </button>
        <button class="action-btn" @click="closeWindow">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message', message.type]"
      >
        <div class="message-avatar" v-if="message.type === 'ai'">
          <img src="https://via.placeholder.com/30x30/4a90e2/ffffff?text=AI" alt="AI">
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <p v-html="message.content"></p>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 加载指示器 -->
      <div v-if="isTyping" class="message ai">
        <div class="message-avatar">
          <img src="https://via.placeholder.com/30x30/4a90e2/ffffff?text=AI" alt="AI">
        </div>
        <div class="message-content">
          <div class="message-bubble typing">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <div class="input-container">
        <textarea 
          v-model="inputMessage"
          @keydown.enter.prevent="sendMessage"
          @keydown.shift.enter="addNewLine"
          placeholder="输入您想了解的张倬元教授相关信息..."
          rows="1"
          ref="messageInput"
        ></textarea>
        <button 
          class="send-btn" 
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isLoading"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
      <div class="input-actions">
        <button class="action-btn" @click="clearChat">
          <i class="fas fa-trash"></i>
          清空对话
        </button>
        <button class="action-btn" @click="exportChat">
          <i class="fas fa-download"></i>
          导出对话
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWindow',
  data() {
    return {
      messages: [
        {
          id: 1,
          type: 'ai',
          content: '您好！我是AI助手，专门为您介绍张倬元教授的相关信息。您想了解他的哪些方面呢？比如学术成就、教育贡献、或者生平经历？',
          timestamp: new Date()
        }
      ],
      inputMessage: '',
      isLoading: false,
      isTyping: false,
      messageId: 2
    }
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading) return;

      const userMessage = {
        id: this.messageId++,
        type: 'user',
        content: this.inputMessage,
        timestamp: new Date()
      };

      this.messages.push(userMessage);
      const question = this.inputMessage;
      this.inputMessage = '';
      this.isLoading = true;
      this.isTyping = true;

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        // 模拟AI回复延迟
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const aiResponse = this.generateAIResponse(question);
        
        this.messages.push({
          id: this.messageId++,
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        });

      } catch (error) {
        this.messages.push({
          id: this.messageId++,
          type: 'ai',
          content: '抱歉，我暂时无法回答您的问题。请稍后再试。',
          timestamp: new Date()
        });
      } finally {
        this.isLoading = false;
        this.isTyping = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    generateAIResponse(question) {
      const responses = {
        '学术': '张倬元教授在学术方面有着卓越的成就。他提出了"地质过程机制分析与定量评价"学术思想体系，建立了斜坡稳定性系统工程地质研究理论方法。他还组织编写了《工程地质分析原理》这本被誉为中国工程地质界"宝典"的教材。',
        '教育': '在教育方面，张倬元教授培养了大批优秀人才，包括30余名博士后、博硕士，其中就有现任生态环境部部长黄润秋。他治学严谨，强调"实践出真知"，76岁高龄仍冒雨参与野外调查。',
        '任职': '张倬元教授于1983年-1988年担任成都地质学院院长，是成都理工大学"五大学科奠基人"之一。在他的努力下，学校获得了两个首批国家重点学科，打破了非重点院校难获重点学科的局面。',
        '成就': '张倬元教授获得了中国地质领域最高荣誉"李四光地质科学奖"。他参与了许多重大工程的地质论证，如黄河龙羊峡、长江三峡等，并提出了"地质灾害"术语及英文名"Geohazard"，获得国际认证。',
        '生平': '张倬元教授1926年出生于河北乐亭，2022年逝世，享年96岁。1951年毕业于清华大学地质系，1957年调入成都地质学院。他一生深耕工程地质研究与教育事业，为国家地质科技和高等教育发展作出了卓越贡献。'
      };

      // 简单的关键词匹配
      for (const [keyword, response] of Object.entries(responses)) {
        if (question.includes(keyword)) {
          return response;
        }
      }

      // 默认回复
      return '张倬元教授是中国著名工程地质学家，成都理工大学的重要奠基者之一。他一生致力于工程地质研究与教育事业，在学术理论、人才培养、学科建设等方面都作出了卓越贡献。您想了解他的哪个具体方面呢？';
    },

    addNewLine() {
      this.inputMessage += '\n';
    },

    formatTime(timestamp) {
      return timestamp.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    clearChat() {
      this.messages = [{
        id: 1,
        type: 'ai',
        content: '对话已清空。您好！我是AI助手，专门为您介绍张倬元教授的相关信息。您想了解他的哪些方面呢？',
        timestamp: new Date()
      }];
      this.messageId = 2;
    },

    exportChat() {
      const chatData = {
        title: '张倬元教授介绍对话记录',
        timestamp: new Date().toISOString(),
        messages: this.messages
      };

      const blob = new Blob([JSON.stringify(chatData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `张倬元教授对话记录_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    minimizeWindow() {
      this.$emit('minimize');
    },

    closeWindow() {
      this.$emit('close');
    }
  },

  mounted() {
    // 自动聚焦输入框
    this.$refs.messageInput.focus();
  }
}
</script>

<style scoped>
.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #4a90e2, #357abd);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status {
  font-size: 12px;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 5px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 10px;
}

.message-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.message-content {
  flex: 1;
  max-width: 80%;
}

.message-bubble {
  background: white;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message.user .message-bubble {
  background: #4a90e2;
  color: white;
}

.message-bubble p {
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  display: block;
}

.typing {
  padding: 15px 20px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4a90e2;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input {
  border-top: 1px solid #e9ecef;
  padding: 15px 20px;
  background: white;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 10px;
}

.input-container textarea {
  flex: 1;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  padding: 10px 15px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  max-height: 100px;
  transition: border-color 0.3s ease;
}

.input-container textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

.send-btn {
  background: #4a90e2;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #357abd;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.input-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.input-actions .action-btn {
  background: transparent;
  border: 1px solid #e9ecef;
  color: #666;
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.input-actions .action-btn:hover {
  background: #f8f9fa;
  border-color: #4a90e2;
  color: #4a90e2;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #4a90e2;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #357abd;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .chat-window {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
</style>