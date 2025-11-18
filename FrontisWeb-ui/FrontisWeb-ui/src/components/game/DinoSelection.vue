<template>
  <div class="dino-selection">
    <h2 class="selection-title">🦖 选择你的恐龙伙伴</h2>
    
    <div class="dino-grid">
      <div 
        v-for="(dino, key) in dinosaurs" 
        :key="key"
        class="dino-card"
        :class="{ 
          selected: currentDino === key,
          locked: !unlockedDinos.includes(key)
        }"
        @click="handleSelect(key)"
      >
        <!-- 锁定遮罩 -->
        <div v-if="!unlockedDinos.includes(key)" class="locked-overlay">
          <div class="lock-icon">🔒</div>
          <p class="unlock-condition">{{ dino.unlockCondition }}</p>
        </div>
        
        <!-- 恐龙头像 -->
        <div class="dino-avatar">
          <span class="dino-emoji">{{ dino.emoji }}</span>
          <div v-if="currentDino === key" class="selected-badge">✓ 已选择</div>
        </div>
        
        <!-- 恐龙信息 -->
        <div class="dino-info">
          <h3 class="dino-name">{{ dino.name }}</h3>
          <p class="dino-type" :style="{ color: dino.color }">
            {{ getTypeName(dino.type) }}
          </p>
          <p class="dino-description">{{ dino.description }}</p>
        </div>
        
        <!-- 属性条 -->
        <div class="dino-stats">
          <div class="stat-item">
            <span class="stat-label">❤️ 生命</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: dino.stats.health + '%', background: '#f56565' }"></div>
            </div>
            <span class="stat-value">{{ dino.stats.health }}</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">⚡ 能量</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: dino.stats.energy + '%', background: '#48bb78' }"></div>
            </div>
            <span class="stat-value">{{ dino.stats.energy }}</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">⚔️ 攻击</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: dino.stats.attack + '%', background: '#ed8936' }"></div>
            </div>
            <span class="stat-value">{{ dino.stats.attack }}</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">🛡️ 防御</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: dino.stats.defense + '%', background: '#4299e1' }"></div>
            </div>
            <span class="stat-value">{{ dino.stats.defense }}</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">🏃 速度</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: dino.stats.speed + '%', background: '#ecc94b' }"></div>
            </div>
            <span class="stat-value">{{ dino.stats.speed }}</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">🧠 智力</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: dino.stats.intelligence + '%', background: '#9f7aea' }"></div>
            </div>
            <span class="stat-value">{{ dino.stats.intelligence }}</span>
          </div>
        </div>
        
        <!-- 技能列表 -->
        <div class="dino-abilities">
          <h4 class="abilities-title">特殊能力</h4>
          <div class="abilities-list">
            <div v-for="ability in dino.abilities" :key="ability.id" class="ability-item">
              <div class="ability-header">
                <span class="ability-name">{{ ability.name }}</span>
                <span class="ability-level">Lv.{{ ability.level }}</span>
              </div>
              <p class="ability-desc">{{ ability.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DinoSelection',
  
  props: {
    dinosaurs: {
      type: Object,
      required: false,
      default: () => ({})
    },
    currentDino: {
      type: String,
      required: false,
      default: 'mamenchisaurus'
    },
    unlockedDinos: {
      type: Array,
      default: () => ['mamenchisaurus']
    }
  },
  
  emits: ['select'],
  
  setup(props, { emit }) {
    const typeNames = {
      legendary: '传奇型 ⭐',
      attack: '攻击型',
      defense: '防御型',
      explorer: '探索型',
      agile: '敏捷型',
      wisdom: '智慧型'
    };
    
    const getTypeName = (type) => typeNames[type] || type;
    
    const handleSelect = (dinoKey) => {
      if (!dinoKey || !props.dinosaurs || Object.keys(props.dinosaurs).length === 0) {
        console.warn('恐龙数据无效');
        return;
      }
      
      if ((props.unlockedDinos || []).includes(dinoKey)) {
        emit('select', dinoKey);
      } else {
        alert('该恐龙尚未解锁!');
      }
    };
    
    return {
      getTypeName,
      handleSelect
    };
  }
};
</script>

<style scoped>
.dino-selection {
  padding: 20px;
}

.selection-title {
  margin: 0 0 30px;
  font-size: 28px;
  color: #2d3748;
  text-align: center;
}

.dino-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.dino-card {
  position: relative;
  background: white;
  border: 3px solid #e2e8f0;
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.dino-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.dino-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

/* 马门溪龙特殊样式 */
.dino-card:has(.dino-type:contains('传奇型')) {
  border: 3px solid #FFD700;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 193, 7, 0.05) 100%);
  position: relative;
}

.dino-card:has(.dino-type:contains('传奇型'))::before {
  content: '⭐ 主角恐龙 ⭐';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  padding: 4px 15px;
  border-radius: 15px;
  font-size: 11px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
}

.dino-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.dino-card.locked:hover {
  transform: none;
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
  z-index: 10;
  border-radius: 17px;
}

.lock-icon {
  font-size: 64px;
  margin-bottom: 15px;
}

.unlock-condition {
  font-size: 16px;
  color: #4a5568;
  font-weight: 600;
  text-align: center;
  max-width: 80%;
}

.dino-avatar {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
}

.dino-emoji {
  font-size: 80px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.selected-badge {
  position: absolute;
  top: -10px;
  right: 50%;
  transform: translateX(50%);
  background: #48bb78;
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.dino-info {
  text-align: center;
  margin-bottom: 20px;
}

.dino-name {
  margin: 0 0 5px;
  font-size: 24px;
  color: #2d3748;
}

.dino-type {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dino-description {
  margin: 0;
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
}

.dino-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f7fafc;
  border-radius: 10px;
}

.stat-item {
  display: grid;
  grid-template-columns: 80px 1fr 40px;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #4a5568;
}

.stat-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.stat-value {
  font-size: 12px;
  font-weight: bold;
  color: #2d3748;
  text-align: right;
}

.dino-abilities {
  padding-top: 15px;
  border-top: 2px solid #e2e8f0;
}

.abilities-title {
  margin: 0 0 12px;
  font-size: 16px;
  color: #2d3748;
}

.abilities-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ability-item {
  background: white;
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.ability-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.ability-name {
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
}

.ability-level {
  font-size: 11px;
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
}

.ability-desc {
  margin: 0;
  font-size: 12px;
  color: #718096;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .dino-grid {
    grid-template-columns: 1fr;
  }
}
</style>

