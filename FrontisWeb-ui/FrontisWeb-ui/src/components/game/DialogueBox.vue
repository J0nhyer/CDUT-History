<template>
  <div class="dialogue-overlay" @click="handleOverlayClick">
    <div class="dialogue-box" @click.stop>
      <!-- NPC 头像和信息 -->
      <div class="dialogue-header">
        <div class="npc-avatar">{{ npc.emoji }}</div>
        <div class="npc-info">
          <h3 class="npc-name">{{ npc.name }}</h3>
          <p class="npc-role">{{ getRoleText(npc.role) }}</p>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <!-- 对话内容 -->
      <div class="dialogue-content">
        <div class="dialogue-text">{{ dialogue }}</div>
      </div>
      
      <!-- 选项按钮 -->
      <div v-if="options && options.length" class="dialogue-options">
        <button 
          v-for="(option, index) in options" 
          :key="index"
          class="option-btn"
          @click="selectOption(option)"
        >
          {{ option.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogueBox',
  
  props: {
    npc: {
      type: Object,
      required: false,
      default: () => ({ name: 'NPC', emoji: '👤' })
    },
    dialogue: {
      type: String,
      required: false,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['select', 'close'],
  
  setup(props, { emit }) {
    const roleTexts = {
      mentor: '导师',
      guide: '向导',
      quest_giver: '任务发布者',
      merchant: '商人',
      friend: '好友'
    };
    
    const getRoleText = (role) => roleTexts[role] || role;
    
    const selectOption = (option) => {
      emit('select', option);
    };
    
    const handleOverlayClick = () => {
      emit('close');
    };
    
    return {
      getRoleText,
      selectOption,
      handleOverlayClick
    };
  }
};
</script>

<style scoped>
.dialogue-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dialogue-box {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialogue-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.npc-avatar {
  font-size: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.npc-info {
  flex: 1;
}

.npc-name {
  margin: 0 0 5px;
  font-size: 20px;
  font-weight: bold;
}

.npc-role {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.dialogue-content {
  padding: 30px 25px;
}

.dialogue-text {
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
}

.dialogue-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 25px 25px;
}

.option-btn {
  padding: 15px 20px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #4a5568;
  text-align: left;
  transition: all 0.3s;
}

.option-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .dialogue-box {
    width: 95%;
  }
  
  .dialogue-header {
    padding: 15px 20px;
  }
  
  .npc-avatar {
    width: 50px;
    height: 50px;
    font-size: 32px;
  }
  
  .dialogue-content {
    padding: 20px;
  }
  
  .dialogue-options {
    padding: 0 20px 20px;
  }
}
</style>



