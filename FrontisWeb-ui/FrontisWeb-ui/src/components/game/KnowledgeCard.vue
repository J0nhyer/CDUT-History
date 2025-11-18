<template>
  <div class="knowledge-card-overlay" @click="$emit('close')">
    <div class="knowledge-card-modal" @click.stop>
      <!-- 卡片头部 -->
      <div class="card-modal-header">
        <h2 class="card-modal-title">{{ knowledge.title }}</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <!-- 卡片内容 -->
      <div class="card-modal-content">
        <div class="knowledge-icon-large">{{ knowledge.icon || '📖' }}</div>
        
        <div class="knowledge-details">
          <div v-if="knowledge.year" class="detail-item">
            <span class="detail-label">年份:</span>
            <span class="detail-value">{{ knowledge.year }}</span>
          </div>
          
          <div v-if="knowledge.category" class="detail-item">
            <span class="detail-label">分类:</span>
            <span class="detail-value">{{ knowledge.category }}</span>
          </div>
        </div>
        
        <div class="knowledge-description">
          {{ knowledge.content || '暂无详细内容' }}
        </div>
        
        <!-- 相关链接 -->
        <div v-if="knowledge.relatedItems && knowledge.relatedItems.length" class="related-section">
          <h3 class="section-title">相关知识点</h3>
          <div class="related-items">
            <div 
              v-for="item in knowledge.relatedItems" 
              :key="item.id"
              class="related-item"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 卡片底部 -->
      <div class="card-modal-footer">
        <button @click="shareKnowledge" class="action-btn secondary">
          📤 分享
        </button>
        <button @click="$emit('close')" class="action-btn primary">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KnowledgeCard',
  
  props: {
    knowledge: {
      type: Object,
      required: false,
      default: () => ({ id: '', title: '', content: '', category: '' })
    }
  },
  
  emits: ['close'],
  
  setup() {
    const shareKnowledge = () => {
      alert('分享功能开发中...');
    };
    
    return {
      shareKnowledge
    };
  }
};
</script>

<style scoped>
.knowledge-card-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
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

.knowledge-card-modal {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: scaleIn 0.3s;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.card-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
  position: relative;
}

.card-modal-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  padding-right: 40px;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.card-modal-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.knowledge-icon-large {
  font-size: 80px;
  text-align: center;
  margin-bottom: 20px;
}

.knowledge-details {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f7fafc;
  border-radius: 10px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-label {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
}

.detail-value {
  font-size: 16px;
  color: #2d3748;
  font-weight: 600;
}

.knowledge-description {
  font-size: 16px;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 25px;
}

.related-section {
  padding-top: 20px;
  border-top: 2px solid #e2e8f0;
}

.section-title {
  margin: 0 0 15px;
  font-size: 18px;
  color: #2d3748;
}

.related-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.related-item {
  padding: 8px 15px;
  background: #ebf8ff;
  color: #2c5282;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.related-item:hover {
  background: #667eea;
  color: white;
}

.card-modal-footer {
  display: flex;
  gap: 10px;
  padding: 20px 30px;
  border-top: 2px solid #e2e8f0;
  background: #f7fafc;
}

.action-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: all 0.3s;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.action-btn.secondary {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.action-btn.secondary:hover {
  border-color: #667eea;
  color: #667eea;
}

@media (max-width: 768px) {
  .knowledge-card-modal {
    width: 95%;
  }
  
  .card-modal-content {
    padding: 20px;
  }
  
  .card-modal-footer {
    flex-direction: column;
  }
}
</style>



