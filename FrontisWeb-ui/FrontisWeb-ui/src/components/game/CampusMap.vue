<template>
  <div class="campus-map">
    <h2 class="map-title">🗺️ 成都理工大学校园地图</h2>
    
    <!-- 地图控制 -->
    <div class="map-controls">
      <button @click="zoomIn" class="control-btn">🔍 放大</button>
      <button @click="zoomOut" class="control-btn">🔎 缩小</button>
      <button @click="resetView" class="control-btn">🎯 重置</button>
      <button @click="toggleLabels" class="control-btn">
        {{ showLabels ? '隐藏标签' : '显示标签' }}
      </button>
    </div>
    
    <!-- SVG 地图 -->
    <div class="map-container" ref="mapContainer">
      <svg 
        :viewBox="`0 0 ${mapWidth} ${mapHeight}`"
        :style="{ transform: `scale(${zoom})` }"
        class="map-svg"
        @click="handleMapClick"
      >
        <!-- 背景 -->
        <defs>
          <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#7FD957;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#5FB834;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grassGradient)" />
        
        <!-- 道路 -->
        <g class="roads">
          <path 
            v-for="road in roads" 
            :key="road.id"
            :d="road.path"
            class="road"
          />
        </g>
        
        <!-- 建筑物 -->
        <g class="buildings">
          <g 
            v-for="location in (locations || [])" 
            :key="location.id"
            :transform="`translate(${(location.position?.x || 0) * 8}, ${(location.position?.y || 0) * 6})`"
            class="location"
            :class="{ 
              active: location.id === player?.currentLocation,
              locked: !isUnlocked(location)
            }"
            @click.stop="selectLocation(location)"
            @mouseenter="hoverLocation = location"
            @mouseleave="hoverLocation = null"
          >
            <!-- 建筑图标 -->
            <circle 
              :r="getLocationSize(location)" 
              :fill="getLocationColor(location)"
              class="location-marker"
            />
            
            <!-- Emoji 图标 -->
            <text 
              :font-size="getLocationSize(location) * 1.2"
              text-anchor="middle"
              dy="0.35em"
              class="location-emoji"
            >
              {{ location.emoji }}
            </text>
            
            <!-- 标签 -->
            <text 
              v-if="showLabels"
              y="35"
              text-anchor="middle"
              class="location-label"
            >
              {{ location.nameShort }}
            </text>
            
            <!-- 锁定标记 -->
            <text 
              v-if="!isUnlocked(location)"
              y="-30"
              text-anchor="middle"
              font-size="20"
            >
              🔒
            </text>
            
            <!-- 任务标记 -->
            <text 
              v-if="hasActiveMission(location)"
              y="-30"
              text-anchor="middle"
              font-size="20"
              class="mission-marker"
            >
              ❗
            </text>
            
            <!-- 收集品标记 -->
            <text 
              v-if="hasCollectibles(location)"
              y="-30"
              :x="hasActiveMission(location) ? 15 : 0"
              text-anchor="middle"
              font-size="16"
              class="collectible-marker"
            >
              ✨
            </text>
          </g>
        </g>
        
        <!-- 秘密区域 -->
        <g class="secret-areas">
          <g 
            v-for="secret in (secretAreas || [])" 
            :key="secret.id"
            :transform="`translate(${secret.position.x * 8}, ${secret.position.y * 6})`"
            class="secret-area"
            :class="{ unlocked: isSecretUnlocked(secret) }"
            @click.stop="selectLocation(secret)"
          >
            <circle r="20" fill="#FFD700" opacity="0.3" class="secret-glow" />
            <text font-size="24" text-anchor="middle" dy="0.35em">
              {{ isSecretUnlocked(secret) ? secret.emoji : '❓' }}
            </text>
          </g>
        </g>
        
        <!-- 玩家位置 -->
        <g 
          :transform="`translate(${(player?.position?.x || 50) * 8}, ${(player?.position?.y || 10) * 6})`"
          class="player-marker"
        >
          <circle r="25" fill="rgba(255, 255, 255, 0.5)" class="player-pulse" />
          <text font-size="32" text-anchor="middle" dy="0.35em" class="player-icon">
            {{ getPlayerEmoji() }}
          </text>
        </g>
      </svg>
    </div>
    
    <!-- 位置信息卡片 -->
    <transition name="slide-up">
      <div v-if="hoverLocation || selectedLocation" class="location-info-card">
        <div class="info-header">
          <span class="info-emoji">{{ (hoverLocation || selectedLocation).emoji }}</span>
          <h3 class="info-title">{{ (hoverLocation || selectedLocation).name }}</h3>
        </div>
        
        <p class="info-description">
          {{ (hoverLocation || selectedLocation).description }}
        </p>
        
        <div class="info-details">
          <div v-if="(hoverLocation || selectedLocation).collectibles?.length" class="info-section">
            <h4>🎁 可收集物品:</h4>
            <div class="collectibles-list">
              <span 
                v-for="item in (hoverLocation || selectedLocation).collectibles" 
                :key="item"
                class="collectible-tag"
              >
                {{ item }}
              </span>
            </div>
          </div>
          
          <div v-if="(hoverLocation || selectedLocation).npcs?.length" class="info-section">
            <h4>👥 NPC:</h4>
            <div class="npcs-list">
              <span 
                v-for="npc in (hoverLocation || selectedLocation).npcs" 
                :key="npc"
                class="npc-tag"
              >
                {{ npc }}
              </span>
            </div>
          </div>
          
          <div v-if="(hoverLocation || selectedLocation).missions?.length" class="info-section">
            <h4>📋 任务:</h4>
            <ul class="missions-list">
              <li v-for="mission in (hoverLocation || selectedLocation).missions" :key="mission">
                {{ mission }}
              </li>
            </ul>
          </div>
        </div>
        
        <div v-if="selectedLocation" class="info-actions">
          <button 
            v-if="canMoveTo(selectedLocation)"
            @click="moveTo(selectedLocation)" 
            class="action-btn primary"
          >
            🚶 前往此地 (消耗10能量)
          </button>
          <button 
            v-if="canInteract(selectedLocation)"
            @click="interact(selectedLocation)" 
            class="action-btn secondary"
          >
            💬 互动
          </button>
          <button @click="selectedLocation = null" class="action-btn">
            关闭
          </button>
        </div>
      </div>
    </transition>
    
    <!-- 图例 -->
    <div class="map-legend">
      <h4>图例</h4>
      <div class="legend-item">
        <span class="legend-icon building">🏛️</span>
        <span>建筑</span>
      </div>
      <div class="legend-item">
        <span class="legend-icon landscape">🌳</span>
        <span>景观</span>
      </div>
      <div class="legend-item">
        <span class="legend-icon secret">✨</span>
        <span>秘密区域</span>
      </div>
      <div class="legend-item">
        <span class="legend-icon mission">❗</span>
        <span>有任务</span>
      </div>
      <div class="legend-item">
        <span class="legend-icon locked">🔒</span>
        <span>未解锁</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'CampusMap',
  
  props: {
    player: {
      type: Object,
      required: true,
      default: () => ({
        currentLocation: 'gate',
        position: { x: 50, y: 10 },
        dinosaur: 'mamenchisaurus'
      })
    },
    locations: {
      type: Array,
      required: false,
      default: () => []
    },
    secretAreas: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['move', 'interact'],
  
  setup(props, { emit }) {
    const mapWidth = 800;
    const mapHeight = 600;
    const zoom = ref(1);
    const showLabels = ref(true);
    const hoverLocation = ref(null);
    const selectedLocation = ref(null);
    
    // 道路路径(简化版)
    const roads = [
      { id: 'main_road', path: 'M 50,50 L 750,50 L 750,550 L 50,550 Z' },
      { id: 'cross_road', path: 'M 400,50 L 400,550' }
    ];
    
    // 地图控制
    const zoomIn = () => {
      zoom.value = Math.min(zoom.value + 0.2, 2);
    };
    
    const zoomOut = () => {
      zoom.value = Math.max(zoom.value - 0.2, 0.5);
    };
    
    const resetView = () => {
      zoom.value = 1;
    };
    
    const toggleLabels = () => {
      showLabels.value = !showLabels.value;
    };
    
    // 位置相关
    const getLocationSize = (location) => {
      if (location.type === 'landmark') return 25;
      if (location.type === 'building') return 22;
      return 18;
    };
    
    const getLocationColor = (location) => {
      if (!location) return '#ed8936';
      if (location.id === props.player?.currentLocation) return '#667eea';
      if (location.type === 'building') return '#4299e1';
      if (location.type === 'landscape') return '#48bb78';
      return '#ed8936';
    };
    
    const isUnlocked = (location) => {
      if (!location) return false;
      if (!location.unlockCondition || location.unlockCondition === 'default') return true;
      
      // 检查解锁条件
      if (location.unlockCondition.startsWith('level_')) {
        const requiredLevel = parseInt(location.unlockCondition.split('_')[1]);
        return (props.player?.level || 1) >= requiredLevel;
      }
      
      if (location.unlockCondition.startsWith('complete_mission_')) {
        const missionId = location.unlockCondition.replace('complete_mission_', 'main_0');
        return (props.player?.completedQuests || []).includes(missionId);
      }
      
      return false;
    };
    
    const isSecretUnlocked = (secret) => {
      if (!secret || !secret.id) return false;
      // 秘密区域解锁条件
      return (props.player?.visitedLocations || []).includes(secret.id);
    };
    
    const hasActiveMission = (location) => {
      if (!location) return false;
      return location.missions && Array.isArray(location.missions) && location.missions.length > 0;
    };
    
    const hasCollectibles = (location) => {
      if (!location) return false;
      return location.collectibles && Array.isArray(location.collectibles) && location.collectibles.length > 0;
    };
    
    const canMoveTo = (location) => {
      if (!location) return false;
      return isUnlocked(location) && 
             location.id !== props.player?.currentLocation &&
             (props.player?.energy || 0) >= 10;
    };
    
    const canInteract = (location) => {
      if (!location) return false;
      return location.npcs && Array.isArray(location.npcs) && location.npcs.length > 0;
    };
    
    // 交互
    const selectLocation = (location) => {
      if (!location) return;
      if (!isUnlocked(location)) {
        alert(`此地点尚未解锁! ${location.unlockCondition || '未知条件'}`);
        return;
      }
      selectedLocation.value = location;
    };
    
    const moveTo = (location) => {
      emit('move', location);
      selectedLocation.value = null;
    };
    
    const interact = (location) => {
      emit('interact', { type: 'location', ...location });
      selectedLocation.value = null;
    };
    
    const handleMapClick = (event) => {
      // 点击空白区域关闭选中
      selectedLocation.value = null;
    };
    
    const getPlayerEmoji = () => {
      // 根据玩家选择的恐龙返回emoji
      const dinoEmojis = {
        mamenchisaurus: '🦕',
        trex: '🦖',
        triceratops: '🦏',
        brachiosaurus: '🦕',
        velociraptor: '🦎',
        stegosaurus: '🦖'
      };
      return dinoEmojis[props.player?.dinosaur] || '🦕';
    };
    
    return {
      mapWidth,
      mapHeight,
      zoom,
      showLabels,
      hoverLocation,
      selectedLocation,
      roads,
      
      zoomIn,
      zoomOut,
      resetView,
      toggleLabels,
      getLocationSize,
      getLocationColor,
      isUnlocked,
      isSecretUnlocked,
      hasActiveMission,
      hasCollectibles,
      canMoveTo,
      canInteract,
      selectLocation,
      moveTo,
      interact,
      handleMapClick,
      getPlayerEmoji
    };
  }
};
</script>

<style scoped>
.campus-map {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-title {
  margin: 0 0 20px;
  font-size: 24px;
  color: #2d3748;
  text-align: center;
}

.map-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 8px 15px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s;
}

.control-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.map-container {
  flex: 1;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.map-svg {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
  cursor: grab;
}

.map-svg:active {
  cursor: grabbing;
}

/* 道路 */
.road {
  fill: none;
  stroke: #cbd5e0;
  stroke-width: 8;
  stroke-linecap: round;
}

/* 位置标记 */
.location {
  cursor: pointer;
  transition: all 0.3s;
}

.location:hover .location-marker {
  filter: brightness(1.2);
  transform: scale(1.1);
}

.location.active .location-marker {
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.8));
  animation: pulse 2s infinite;
}

.location.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.location-marker {
  stroke: white;
  stroke-width: 2;
  transition: all 0.3s;
}

.location-emoji {
  pointer-events: none;
  user-select: none;
}

.location-label {
  fill: #2d3748;
  font-size: 12px;
  font-weight: 600;
  pointer-events: none;
}

.mission-marker,
.collectible-marker {
  animation: bounce 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 秘密区域 */
.secret-area {
  cursor: pointer;
  transition: all 0.3s;
}

.secret-glow {
  animation: glow 2s infinite;
}

@keyframes glow {
  0%, 100% {
    opacity: 0.3;
    r: 20;
  }
  50% {
    opacity: 0.6;
    r: 25;
  }
}

/* 玩家标记 */
.player-marker {
  pointer-events: none;
}

.player-pulse {
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.player-icon {
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3));
}

/* 信息卡片 */
.location-info-card {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  z-index: 10;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.info-emoji {
  font-size: 36px;
}

.info-title {
  margin: 0;
  font-size: 20px;
  color: #2d3748;
}

.info-description {
  margin: 0 0 15px;
  color: #4a5568;
  line-height: 1.6;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.info-section h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #2d3748;
}

.collectibles-list,
.npcs-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.collectible-tag,
.npc-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #ebf8ff;
  color: #2c5282;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.npc-tag {
  background: #faf5ff;
  color: #6b46c1;
}

.missions-list {
  margin: 0;
  padding-left: 20px;
  color: #4a5568;
  font-size: 13px;
}

.info-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  padding: 10px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s;
  min-width: 120px;
}

.action-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.action-btn.secondary {
  background: #48bb78;
  color: white;
  border-color: transparent;
}

/* 图例 */
.map-legend {
  position: absolute;
  top: 60px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 5;
}

.map-legend h4 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #2d3748;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #4a5568;
}

.legend-icon {
  font-size: 16px;
}

/* 过渡动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100px);
  opacity: 0;
}
</style>

