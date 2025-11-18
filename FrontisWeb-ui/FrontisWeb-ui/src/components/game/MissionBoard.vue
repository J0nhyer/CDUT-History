<template>
  <div class="mission-board">
    <h2 class="board-title">📋 任务大厅</h2>
    
    <!-- 任务类型标签 -->
    <div class="mission-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['mission-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-name">{{ tab.name }}</span>
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>
    
    <!-- 主线任务 -->
    <div v-if="activeTab === 'main'" class="missions-container">
      <div class="container-header">
        <h3>主线任务 - 校史时间线</h3>
        <p class="header-desc">跟随时间的脚步,了解成都理工大学的光辉历程</p>
      </div>
      
      <div class="missions-list">
        <div 
          v-for="quest in mainQuests" 
          :key="quest.id"
          class="mission-card main-quest"
          :class="{ 
            completed: completedQuests.includes(quest.id),
            locked: !isMissionUnlocked(quest)
          }"
        >
          <!-- 章节标记 -->
          <div class="chapter-badge">第{{ quest.chapter }}章</div>
          
          <!-- 完成标记 -->
          <div v-if="completedQuests.includes(quest.id)" class="completed-badge">
            ✅ 已完成
          </div>
          
          <!-- 锁定遮罩 -->
          <div v-if="!isMissionUnlocked(quest)" class="locked-overlay">
            <span class="lock-icon">🔒</span>
            <p>{{ quest.unlockCondition }}</p>
          </div>
          
          <div class="mission-header">
            <div class="mission-era">{{ quest.era || '' }}</div>
            <div class="mission-difficulty" :class="quest.difficulty || 'easy'">
              {{ getDifficultyText(quest.difficulty || 'easy') }}
            </div>
          </div>
          
          <h4 class="mission-title">{{ quest.title || '未命名任务' }}</h4>
          <p class="mission-description">{{ quest.description || '暂无描述' }}</p>
          
          <!-- 任务目标 -->
          <div class="mission-objectives">
            <h5>任务目标:</h5>
            <ul>
              <li v-for="obj in (quest.objectives || [])" :key="obj.id || obj.text">
                {{ obj.text || '' }}
              </li>
            </ul>
          </div>
          
          <!-- 任务奖励 -->
          <div class="mission-rewards">
            <h5>奖励:</h5>
            <div class="rewards-list">
              <span class="reward-item">💫 {{ quest.rewards?.exp || 0 }} 经验</span>
              <span class="reward-item">💰 {{ quest.rewards?.coins || 0 }} 金币</span>
              <span v-if="quest.rewards?.items?.length" class="reward-item">
                🎁 {{ quest.rewards.items.length }} 件物品
              </span>
              <span v-if="quest.rewards?.unlock" class="reward-item special">
                🔓 解锁 {{ quest.rewards.unlock }}
              </span>
            </div>
          </div>
          
          <button 
            v-if="!completedQuests.includes(quest.id) && isMissionUnlocked(quest)"
            @click="acceptQuest(quest.id)"
            class="accept-btn"
          >
            接受任务
          </button>
        </div>
      </div>
    </div>
    
    <!-- 支线任务 -->
    <div v-if="activeTab === 'side'" class="missions-container">
      <div class="container-header">
        <h3>支线任务</h3>
        <p class="header-desc">探索更多校园秘密,获得额外奖励</p>
      </div>
      
      <div class="missions-grid">
        <div 
          v-for="quest in sideQuests" 
          :key="quest.id"
          class="mission-card side-quest"
          :class="{ completed: completedQuests.includes(quest.id) }"
        >
          <div class="quest-type-badge">{{ getQuestTypeText(quest.type) }}</div>
          
          <h4 class="mission-title">{{ quest.title || '未命名任务' }}</h4>
          <p class="mission-description">{{ quest.description || '暂无描述' }}</p>
          
          <div class="mission-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getProgress(quest) + '%' }"></div>
            </div>
            <span class="progress-text">{{ getProgress(quest) }}%</span>
          </div>
          
          <div class="mission-rewards compact">
            <span class="reward-item">💫 {{ quest.rewards?.exp || 0 }}</span>
            <span class="reward-item">💰 {{ quest.rewards?.coins || 0 }}</span>
          </div>
          
          <button 
            v-if="!completedQuests.includes(quest.id)"
            @click="acceptQuest(quest.id)"
            class="accept-btn small"
          >
            接受
          </button>
          <div v-else class="completed-mark">✅</div>
        </div>
      </div>
    </div>
    
    <!-- 每日任务 -->
    <div v-if="activeTab === 'daily'" class="missions-container">
      <div class="container-header">
        <h3>每日任务</h3>
        <p class="header-desc">完成每日任务,获取固定奖励</p>
        <div class="daily-timer">⏰ 刷新倒计时: {{ dailyResetTime }}</div>
      </div>
      
      <div class="daily-list">
        <div 
          v-for="quest in dailyQuests" 
          :key="quest.id"
          class="daily-card"
          :class="{ completed: isDailyCompleted(quest.id) }"
        >
          <div class="daily-content">
            <h4 class="daily-title">{{ quest.title || '未命名任务' }}</h4>
            <p class="daily-desc">{{ quest.description || '暂无描述' }}</p>
          </div>
          
            <div class="daily-progress">
            <div class="progress-circle">
              <span class="progress-number">{{ getDailyProgress(quest.id) }}/{{ quest.objectives?.[0]?.amount || 0 }}</span>
            </div>
          </div>
          
          <div class="daily-reward">
            <span>💫 {{ quest.rewards?.exp || 0 }}</span>
            <span>💰 {{ quest.rewards?.coins || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'MissionBoard',
  
  props: {
    mainQuests: {
      type: Array,
      default: () => []
    },
    sideQuests: {
      type: Array,
      default: () => []
    },
    dailyQuests: {
      type: Array,
      default: () => []
    },
    completedQuests: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['accept', 'complete'],
  
  setup(props, { emit }) {
    const activeTab = ref('main');
    
    const tabs = computed(() => [
      { 
        id: 'main', 
        name: '主线任务', 
        icon: '🎯',
        count: (props.mainQuests || []).filter(q => !(props.completedQuests || []).includes(q.id)).length
      },
      { 
        id: 'side', 
        name: '支线任务', 
        icon: '⭐',
        count: (props.sideQuests || []).filter(q => !(props.completedQuests || []).includes(q.id)).length
      },
      { 
        id: 'daily', 
        name: '每日任务', 
        icon: '📅',
        count: (props.dailyQuests || []).length
      }
    ]);
    
    const dailyResetTime = ref('23:59:59');
    
    const getDifficultyText = (difficulty) => {
      const texts = {
        easy: '简单',
        medium: '中等',
        hard: '困难',
        expert: '专家'
      };
      return texts[difficulty] || difficulty;
    };
    
    const getQuestTypeText = (type) => {
      const texts = {
        collection: '收集',
        knowledge: '知识',
        exploration: '探索',
        challenge: '挑战',
        puzzle: '解谜',
        social: '社交'
      };
      return texts[type] || type;
    };
    
    const isMissionUnlocked = (quest) => {
      if (!quest || !quest.unlockCondition) return true;
      
      if (quest.unlockCondition === 'default') return true;
      
      if (quest.unlockCondition.startsWith('complete_')) {
        const requiredQuest = quest.unlockCondition.replace('complete_', '');
        return (props.completedQuests || []).includes(requiredQuest);
      }
      
      return false;
    };
    
    const getProgress = (quest) => {
      // 简化的进度计算
      if (!quest || !quest.objectives) return 0;
      return 0;
    };
    
    const isDailyCompleted = (questId) => {
      // 检查每日任务是否完成
      if (!questId) return false;
      return (props.completedQuests || []).includes(questId);
    };
    
    const getDailyProgress = (questId) => {
      // 获取每日任务进度
      if (!questId) return 0;
      // 简化进度计算
      return 0;
    };
    
    const acceptQuest = (questId) => {
      emit('accept', questId);
    };
    
    return {
      activeTab,
      tabs,
      dailyResetTime,
      getDifficultyText,
      getQuestTypeText,
      isMissionUnlocked,
      getProgress,
      isDailyCompleted,
      getDailyProgress,
      acceptQuest
    };
  }
};
</script>

<style scoped>
.mission-board {
  padding: 20px;
}

.board-title {
  margin: 0 0 25px;
  font-size: 28px;
  color: #2d3748;
  text-align: center;
}

.mission-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  border-bottom: 2px solid #e2e8f0;
}

.mission-tab {
  flex: 1;
  padding: 15px 20px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #718096;
}

.mission-tab:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.mission-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-icon {
  font-size: 20px;
}

.tab-count {
  background: #667eea;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 24px;
  text-align: center;
}

.missions-container {
  margin-top: 20px;
}

.container-header {
  margin-bottom: 20px;
}

.container-header h3 {
  margin: 0 0 5px;
  font-size: 22px;
  color: #2d3748;
}

.header-desc {
  margin: 0;
  color: #718096;
  font-size: 14px;
}

.daily-timer {
  margin-top: 10px;
  padding: 8px 15px;
  background: #fff5f5;
  color: #c53030;
  border-radius: 8px;
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
}

.missions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.missions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.mission-card {
  position: relative;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s;
}

.mission-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.mission-card.main-quest {
  border-left: 5px solid #667eea;
}

.mission-card.side-quest {
  border-left: 5px solid #48bb78;
}

.mission-card.completed {
  opacity: 0.7;
  background: #f7fafc;
}

.mission-card.locked {
  opacity: 0.5;
}

.chapter-badge {
  position: absolute;
  top: -10px;
  left: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.completed-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: #48bb78;
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  z-index: 5;
}

.lock-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.mission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.mission-era {
  font-size: 13px;
  color: #667eea;
  font-weight: 600;
}

.mission-difficulty {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
}

.mission-difficulty.easy {
  background: #c6f6d5;
  color: #22543d;
}

.mission-difficulty.medium {
  background: #feebc8;
  color: #7c2d12;
}

.mission-difficulty.hard {
  background: #fed7d7;
  color: #742a2a;
}

.mission-difficulty.expert {
  background: #e9d5ff;
  color: #5b21b6;
}

.mission-title {
  margin: 0 0 10px;
  font-size: 18px;
  color: #2d3748;
}

.mission-description {
  margin: 0 0 15px;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.6;
}

.mission-objectives,
.mission-rewards {
  margin-bottom: 15px;
}

.mission-objectives h5,
.mission-rewards h5 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #2d3748;
}

.mission-objectives ul {
  margin: 0;
  padding-left: 20px;
  color: #4a5568;
  font-size: 13px;
}

.mission-objectives li {
  margin-bottom: 5px;
}

.rewards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reward-item {
  padding: 6px 12px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #4a5568;
}

.reward-item.special {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border-color: #fbbf24;
}

.mission-rewards.compact {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.accept-btn {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.accept-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.accept-btn.small {
  padding: 8px 15px;
  font-size: 13px;
}

.quest-type-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #48bb78;
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 10px;
}

.mission-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
  border-radius: 10px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  font-weight: bold;
  color: #4a5568;
  min-width: 40px;
  text-align: right;
}

.completed-mark {
  text-align: center;
  font-size: 24px;
  padding: 10px;
}

.daily-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.daily-card {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 20px;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 15px 20px;
  transition: all 0.3s;
}

.daily-card:hover {
  border-color: #667eea;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.daily-card.completed {
  background: #f0fff4;
  border-color: #48bb78;
}

.daily-title {
  margin: 0 0 5px;
  font-size: 16px;
  color: #2d3748;
}

.daily-desc {
  margin: 0;
  font-size: 13px;
  color: #718096;
}

.progress-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f7fafc;
  border: 3px solid #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-number {
  font-size: 14px;
  font-weight: bold;
  color: #2d3748;
}

.daily-reward {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  text-align: right;
}

@media (max-width: 768px) {
  .missions-grid {
    grid-template-columns: 1fr;
  }
  
  .daily-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>



