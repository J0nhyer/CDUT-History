<template>
  <div class="dino-game-container">
    <!-- 返回按钮 -->
    <div class="back-section">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        返回首页
      </button>
    </div>
    
    <!-- 游戏头部 -->
    <header class="game-header">
      <div class="header-left">
        <h1 class="game-title">
          <span class="dino-icon">🦕</span>
          成都理工大学恐龙探险家
          <span class="dino-icon">🦖</span>
        </h1>
      </div>
      <div class="header-right">
        <button class="header-btn" @click="showSettings = true">
          <span class="icon">⚙️</span> 设置
        </button>
      </div>
    </header>

    <!-- 主导航标签 -->
    <nav class="main-nav">
      <button 
        v-for="tab in mainTabs" 
        :key="tab.id"
        :class="['nav-tab', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- 内容区域 -->
    <main class="game-content">
      <!-- 加载提示 -->
      <div v-if="!gameDataLoaded" class="loading-panel">
        <div class="loading-content">
          <div class="loading-spinner">🦕</div>
          <h2>正在加载恐龙校园...</h2>
          <p>请稍候，正在初始化游戏数据</p>
        </div>
      </div>

      <!-- 校园地图视图 -->
      <div v-if="currentTab === 'map' && gameDataLoaded" class="content-panel map-panel">
        <CampusMap
          :player="player"
          :locations="campusMap?.locations || []"
          :secretAreas="campusMap?.secretAreas || []"
          @move="handleMove"
          @interact="handleInteract"
        />
      </div>

      <!-- 恐龙选择视图 -->
      <div v-if="currentTab === 'dino' && gameDataLoaded" class="content-panel dino-panel">
        <DinoSelection
          :dinosaurs="dinosaurs || {}"
          :currentDino="player.dinosaur"
          :unlockedDinos="player.unlockedDinosaurs"
          @select="selectDinosaur"
        />
      </div>

      <!-- 任务大厅视图 -->
      <div v-if="currentTab === 'missions' && gameDataLoaded" class="content-panel missions-panel">
        <MissionBoard
          :mainQuests="missions?.mainQuests || []"
          :sideQuests="missions?.sideQuests || []"
          :dailyQuests="missions?.dailyQuests || []"
          :completedQuests="player.completedQuests"
          @accept="acceptMission"
          @complete="completeMission"
        />
      </div>

      <!-- 知识图谱视图 -->
      <div v-if="currentTab === 'knowledge' && gameDataLoaded" class="content-panel knowledge-panel">
        <KnowledgeGraph
          :collectedKnowledge="player.collectedKnowledge"
          :totalKnowledge="totalKnowledgeCount"
          @view="viewKnowledge"
        />
      </div>
    </main>

    <!-- 游戏状态栏 -->
    <aside class="game-sidebar">
      <!-- 玩家信息卡片 -->
      <div class="player-card">
        <div class="player-header">
          <div class="dino-avatar">{{ currentDinoData?.emoji || '🦕' }}</div>
          <div class="player-info">
            <h3 class="player-name">{{ player.name }}</h3>
            <p class="dino-name">{{ currentDinoData?.name || '马门溪龙' }} Lv.{{ player.level }}</p>
          </div>
        </div>
        
        <!-- 属性条 -->
        <div class="stats-bars">
          <div class="stat-bar">
            <div class="stat-label">
              <span>❤️ 生命值</span>
              <span>{{ player.health }}/{{ player.maxHealth }}</span>
            </div>
            <div class="bar">
              <div class="bar-fill health" :style="{ width: healthPercent + '%' }"></div>
            </div>
          </div>
          
          <div class="stat-bar">
            <div class="stat-label">
              <span>⚡ 能量</span>
              <span>{{ player.energy }}/{{ player.maxEnergy }}</span>
            </div>
            <div class="bar">
              <div class="bar-fill energy" :style="{ width: energyPercent + '%' }"></div>
            </div>
          </div>
          
          <div class="stat-bar">
            <div class="stat-label">
              <span>✨ 经验</span>
              <span>{{ player.exp }}/{{ player.expToNextLevel }}</span>
            </div>
            <div class="bar">
              <div class="bar-fill exp" :style="{ width: expPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- 技能槽 -->
        <div class="skill-slots">
          <h4 class="section-title">技能</h4>
          <div class="skills">
            <div 
              v-for="skill in (currentDinoData?.abilities || [])" 
              :key="skill.id || skill.name"
              class="skill-slot"
              :title="skill.description || skill.name"
            >
              <div class="skill-icon">{{ getSkillIcon(skill.id || skill.name) }}</div>
              <div class="skill-level">{{ skill.level || 1 }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前任务追踪 -->
      <div v-if="currentMission" class="mission-tracker">
        <h4 class="section-title">📋 当前任务</h4>
        <div class="mission-info">
          <h5 class="mission-title">{{ currentMission.title }}</h5>
          <p class="mission-desc">{{ currentMission.description }}</p>
          
          <div class="objectives">
            <div 
              v-for="(obj, index) in currentMission.objectives" 
              :key="index"
              class="objective"
              :class="{ completed: obj.completed }"
            >
              <span class="check">{{ obj.completed ? '✅' : '⭕' }}</span>
              <span class="text">{{ obj.text }}</span>
            </div>
          </div>
          
          <div v-if="currentMission.targetLocation" class="mission-nav">
            <p class="target">📍 {{ currentMission.targetLocation }}</p>
            <p class="distance">📏 距离: {{ currentMission.distance }}m</p>
            <p class="time">⏱️ 推荐时间: {{ currentMission.timeEstimate }}</p>
          </div>
        </div>
      </div>

      <!-- 背包系统 -->
      <div class="inventory">
        <h4 class="section-title">🎒 背包</h4>
        <div class="inventory-grid">
          <div 
            v-for="item in player.inventory" 
            :key="item.id"
            class="inventory-item"
            :class="`rarity-${item.rarity}`"
            @click="useItem(item)"
          >
            <span class="item-icon">{{ item.emoji }}</span>
            <span class="item-count">{{ item.count }}</span>
          </div>
        </div>
        
        <div class="inventory-stats">
          <p>💰 金币: {{ player.coins }}</p>
          <p>📚 知识碎片: {{ player.collectedKnowledge.length }}/{{ totalKnowledgeCount }}</p>
        </div>
      </div>

      <!-- 成就提示 -->
      <div v-if="recentAchievement" class="achievement-popup">
        <div class="achievement-content">
          <span class="achievement-icon">🏆</span>
          <div class="achievement-text">
            <p class="achievement-label">成就解锁!</p>
            <p class="achievement-name">{{ recentAchievement.name }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- 对话框系统 -->
    <DialogueBox
      v-if="currentDialogue"
      :npc="currentDialogue.npc"
      :dialogue="currentDialogue.text"
      :options="currentDialogue.options"
      @select="handleDialogueChoice"
      @close="currentDialogue = null"
    />

    <!-- 知识卡片展示 -->
    <KnowledgeCard
      v-if="viewingKnowledge"
      :knowledge="viewingKnowledge"
      @close="viewingKnowledge = null"
    />


    <!-- 天气和特殊事件显示 -->
    <div class="weather-display">
      <span class="weather-icon">{{ currentWeather.emoji }}</span>
      <span class="weather-text">{{ currentWeather.name }}</span>
    </div>

    <!-- 小地图 -->
    <div class="mini-map">
      <canvas ref="miniMapCanvas" width="150" height="150"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import dinoGameData from './data/dinoGameData.js';
import CampusMap from './components/game/CampusMap.vue';
import DinoSelection from './components/game/DinoSelection.vue';
import MissionBoard from './components/game/MissionBoard.vue';
import KnowledgeGraph from './components/game/KnowledgeGraph.vue';
import DialogueBox from './components/game/DialogueBox.vue';
import KnowledgeCard from './components/game/KnowledgeCard.vue';

export default {
  name: 'DinoGameMain',
  
  components: {
    CampusMap,
    DinoSelection,
    MissionBoard,
    KnowledgeGraph,
    DialogueBox,
    KnowledgeCard
  },
  
  setup() {
    // ==================== Router ====================
    const router = useRouter();
    
    // ==================== 游戏数据 ====================
    // 安全获取游戏数据，提供默认值防止错误
    const gameData = dinoGameData || {};
    const dinosaurs = gameData.dinosaurs || {};
    const campusMap = gameData.campusMap || { locations: [], secretAreas: [] };
    const missions = gameData.missions || { mainQuests: [], sideQuests: [], dailyQuests: [] };
    const collectibles = gameData.collectibles || {};
    const achievements = gameData.achievements || {};
    const quizQuestions = gameData.quizQuestions || {};
    const npcs = gameData.npcs || {};
    const specialEvents = gameData.specialEvents || { 
      weather: { 
        sunny: { name: '晴天', emoji: '☀️' },
        cloudy: { name: '多云', emoji: '☁️' },
        rainy: { name: '雨天', emoji: '🌧️' }
      }
    };
    
    console.log('游戏数据加载:', { 
      dinosaursCount: Object.keys(dinosaurs).length,
      locationsCount: campusMap.locations?.length || 0,
      mainQuestsCount: missions.mainQuests?.length || 0
    });
    
    // ==================== 标签页 ====================
    const mainTabs = [
      { id: 'map', label: '校园地图', icon: '🗺️' },
      { id: 'dino', label: '恐龙选择', icon: '🦖' },
      { id: 'missions', label: '任务大厅', icon: '📋' },
      { id: 'knowledge', label: '知识图谱', icon: '🧠' }
    ];
    
    const currentTab = ref('map');
    
    // ==================== 玩家状态 ====================
    const player = ref({
      name: '探险家',
      level: 1,
      exp: 0,
      expToNextLevel: 100,
      health: 130,
      maxHealth: 130,
      energy: 110,
      maxEnergy: 110,
      coins: 0,
      
      // 当前恐龙 - 默认使用马门溪龙
      dinosaur: 'mamenchisaurus',
      unlockedDinosaurs: ['mamenchisaurus', 'trex'],
      
      // 位置
      currentLocation: 'gate',
      position: { x: 50, y: 10 },
      
      // 进度
      completedQuests: [],
      currentQuest: null,
      collectedKnowledge: [],
      inventory: [
        { id: 'red_fossil', emoji: '🔴', count: 5, rarity: 'common' },
        { id: 'blue_crystal', emoji: '🔵', count: 3, rarity: 'common' },
        { id: 'yellow_amber', emoji: '🟡', count: 2, rarity: 'rare' }
      ],
      achievements: [],
      
      // 统计
      visitedLocations: ['gate'],
      totalDistance: 0,
      playTime: 0
    });
    
    // ==================== 计算属性 ====================
    const currentDinoData = computed(() => {
      const dino = dinosaurs[player.value.dinosaur];
      if (!dino && Object.keys(dinosaurs).length > 0) {
        // 如果默认恐龙不存在，使用第一个可用的恐龙
        const firstDino = Object.values(dinosaurs)[0];
        player.value.dinosaur = firstDino.id || Object.keys(dinosaurs)[0];
        return firstDino;
      }
      return dino || {
        id: 'mamenchisaurus',
        name: '马门溪龙',
        emoji: '🦕',
        stats: { health: 130, energy: 110, attack: 60, defense: 85, speed: 40, intelligence: 75 },
        abilities: []
      };
    });
    
    const healthPercent = computed(() => (player.value.health / player.value.maxHealth) * 100);
    const energyPercent = computed(() => (player.value.energy / player.value.maxEnergy) * 100);
    const expPercent = computed(() => (player.value.exp / player.value.expToNextLevel) * 100);
    
    const totalKnowledgeCount = computed(() => {
      // 从知识图谱中计算总数
      return 156; // 根据实际知识点数量
    });
    
    const currentMission = computed(() => {
      if (!player.value.currentQuest) return null;
      
      const quest = [...missions.mainQuests, ...missions.sideQuests].find(
        q => q.id === player.value.currentQuest
      );
      
      if (!quest) return null;
      
      return {
        ...quest,
        targetLocation: '地球科学学院',
        distance: 150,
        timeEstimate: '3分钟'
      };
    });
    
    // ==================== 游戏状态 ====================
    const gameDataLoaded = ref(false);
    const currentWeather = ref(specialEvents.weather?.sunny || { name: '晴天', emoji: '☀️' });
    const currentDialogue = ref(null);
    const viewingKnowledge = ref(null);
    const showSettings = ref(false);
    const recentAchievement = ref(null);
    
    // 验证数据加载
    if (Object.keys(dinosaurs).length > 0 && campusMap?.locations?.length > 0) {
      gameDataLoaded.value = true;
    } else {
      console.warn('游戏数据未完全加载，使用默认数据');
      gameDataLoaded.value = true; // 即使数据不完整也显示界面
    }
    
    // ==================== 游戏方法 ====================
    
    // 移动处理
    const handleMove = (location) => {
      // 马门溪龙特殊能力：四川之魂 - 在校园内移动不消耗能量
      const energyCost = player.value.dinosaur === 'mamenchisaurus' ? 0 : 10;
      
      if (energyCost > 0 && player.value.energy < energyCost) {
        alert('能量不足!需要休息或使用蓝色水晶恢复能量。');
        return;
      }
      
      if (energyCost > 0) {
        player.value.energy -= energyCost;
      }
      
      player.value.currentLocation = location.id;
      player.value.position = location.position;
      
      // 记录访问
      if (!player.value.visitedLocations.includes(location.id)) {
        player.value.visitedLocations.push(location.id);
        gainExp(10);
      }
      
      // 检查是否有随机事件
      checkRandomEvent();
    };
    
    // 交互处理
    const handleInteract = (target) => {
      if (target.type === 'npc') {
        startDialogue(target.id);
      } else if (target.type === 'collectible') {
        collectItem(target.id);
      } else if (target.type === 'knowledge') {
        unlockKnowledge(target.id);
      }
    };
    
    // 选择恐龙
    const selectDinosaur = (dinoId) => {
      if (!dinoId || !dinosaurs || Object.keys(dinosaurs).length === 0) {
        console.warn('恐龙数据未加载或无效');
        return;
      }
      
      if (player.value.unlockedDinosaurs.includes(dinoId)) {
        player.value.dinosaur = dinoId;
        // 更新属性
        const dino = dinosaurs[dinoId];
        if (dino && dino.stats) {
          player.value.maxHealth = dino.stats.health || player.value.maxHealth;
          player.value.maxEnergy = dino.stats.energy || player.value.maxEnergy;
        }
      } else {
        alert('该恐龙尚未解锁!');
      }
    };
    
    // 接受任务
    const acceptMission = (missionId) => {
      player.value.currentQuest = missionId;
    };
    
    // 完成任务
    const completeMission = (missionId) => {
      const mission = [...missions.mainQuests, ...missions.sideQuests].find(
        q => q.id === missionId
      );
      
      if (!mission) return;
      
      // 给予奖励
      player.value.exp += mission.rewards.exp || 0;
      player.value.coins += mission.rewards.coins || 0;
      
      if (mission.rewards.items) {
        mission.rewards.items.forEach(itemId => {
          addToInventory(itemId);
        });
      }
      
      if (mission.rewards.knowledge) {
        mission.rewards.knowledge.forEach(knowledgeId => {
          unlockKnowledge(knowledgeId);
        });
      }
      
      // 解锁恐龙
      if (mission.rewards.unlock) {
        if (dinosaurs[mission.rewards.unlock]) {
          player.value.unlockedDinosaurs.push(mission.rewards.unlock);
        }
      }
      
      player.value.completedQuests.push(missionId);
      player.value.currentQuest = null;
      
      // 检查成就
      checkAchievements();
    };
    
    // 对话系统
    const startDialogue = (npcId) => {
      const npc = npcs[npcId];
      if (!npc) return;
      
      currentDialogue.value = {
        npc: npc,
        text: npc.dialogues[0].text,
        options: npc.dialogues[0].options
      };
    };
    
    const handleDialogueChoice = (choice) => {
      if (choice.reward) {
        if (choice.reward.exp) gainExp(choice.reward.exp);
        if (choice.reward.items) {
          choice.reward.items.forEach(item => addToInventory(item));
        }
      }
      
      if (choice.next === 'end') {
        currentDialogue.value = null;
      } else {
        // 继续对话...
      }
    };
    
    // 收集物品
    const collectItem = (itemId) => {
      const item = collectibles[itemId];
      if (!item) return;
      
      addToInventory(itemId);
      
      // 应用效果
      if (item.effect) {
        if (item.effect.health) {
          player.value.health = Math.min(
            player.value.health + item.effect.health,
            player.value.maxHealth
          );
        }
        if (item.effect.energy) {
          player.value.energy = Math.min(
            player.value.energy + item.effect.energy,
            player.value.maxEnergy
          );
        }
        if (item.effect.exp) {
          gainExp(item.effect.exp);
        }
      }
    };
    
    // 添加到背包
    const addToInventory = (itemId) => {
      const existingItem = player.value.inventory.find(i => i.id === itemId);
      if (existingItem) {
        existingItem.count++;
      } else {
        const item = collectibles[itemId];
        player.value.inventory.push({
          id: itemId,
          emoji: item.emoji,
          count: 1,
          rarity: item.rarity
        });
      }
    };
    
    // 使用物品
    const useItem = (item) => {
      const itemData = collectibles[item.id];
      if (!itemData || item.count <= 0) return;
      
      // 应用效果
      if (itemData.effect) {
        if (itemData.effect.health) {
          player.value.health = Math.min(
            player.value.health + itemData.effect.health,
            player.value.maxHealth
          );
        }
        if (itemData.effect.energy) {
          player.value.energy = Math.min(
            player.value.energy + itemData.effect.energy,
            player.value.maxEnergy
          );
        }
      }
      
      item.count--;
      if (item.count === 0) {
        const index = player.value.inventory.indexOf(item);
        player.value.inventory.splice(index, 1);
      }
    };
    
    // 解锁知识
    const unlockKnowledge = (knowledgeId) => {
      if (!player.value.collectedKnowledge.includes(knowledgeId)) {
        player.value.collectedKnowledge.push(knowledgeId);
        
        // 马门溪龙特殊能力：地质共鸣 - 获得双倍经验
        const expBonus = player.value.dinosaur === 'mamenchisaurus' ? 30 : 15;
        gainExp(expBonus);
        
        if (player.value.dinosaur === 'mamenchisaurus') {
          console.log('🦕 马门溪龙的地质共鸣能力激活! 获得双倍经验!');
        }
      }
    };
    
    // 查看知识
    const viewKnowledge = (knowledgeId) => {
      // 从知识图谱加载数据
      viewingKnowledge.value = {
        id: knowledgeId,
        title: '知识卡片',
        content: '这里是知识内容...'
      };
    };
    
    // 获得经验
    const gainExp = (amount) => {
      player.value.exp += amount;
      
      // 检查升级
      while (player.value.exp >= player.value.expToNextLevel) {
        player.value.exp -= player.value.expToNextLevel;
        player.value.level++;
        player.value.expToNextLevel = Math.floor(player.value.expToNextLevel * 1.5);
        
        // 升级奖励
        player.value.maxHealth += 10;
        player.value.maxEnergy += 10;
        player.value.health = player.value.maxHealth;
        player.value.energy = player.value.maxEnergy;
      }
    };
    
    // 检查随机事件
    const checkRandomEvent = () => {
      const random = Math.random();
      
      if (random < 0.1) {
        // 遇到校园猫咪
        alert('🐱 你遇到了校园猫咪!它看起来很友好。');
      }
    };
    
    // 检查成就
    const checkAchievements = () => {
      // 检查探索成就
      if (player.value.visitedLocations.length === campusMap.locations.length) {
        unlockAchievement('explorer');
      }
      
      // 检查知识成就
      if (player.value.collectedKnowledge.length >= totalKnowledgeCount.value) {
        unlockAchievement('historian');
      }
    };
    
    // 解锁成就
    const unlockAchievement = (achievementId) => {
      if (player.value.achievements.includes(achievementId)) return;
      
      const achievement = achievements[achievementId];
      if (!achievement) return;
      
      player.value.achievements.push(achievementId);
      
      // 显示成就弹窗
      recentAchievement.value = achievement;
      setTimeout(() => {
        recentAchievement.value = null;
      }, 3000);
      
      // 给予奖励
      if (achievement.rewards) {
        if (achievement.rewards.exp) gainExp(achievement.rewards.exp);
      }
    };
    
    // 技能图标
    const getSkillIcon = (skillId) => {
      const icons = {
        // 马门溪龙技能
        '天眼通视': '👁️',
        '历史回溯': '⏪',
        '地质共鸣': '💎',
        '四川之魂': '🏔️',
        '守护光环': '✨',
        // 其他恐龙技能
        '破坏力': '💥',
        '咆哮': '📢',
        '追踪': '🔍',
        '护盾': '🛡️',
        '冲撞': '⚡',
        '坚韧': '💪',
        '高处视野': '👁️',
        '长颈优势': '🦒',
        '智慧': '🧠',
        '疾速': '⚡',
        '灵巧': '🤸',
        '连击': '👊',
        '解谜大师': '🧩',
        '记忆': '📝',
        '分析': '🔬'
      };
      return icons[skillId] || '⭐';
    };
    
    // ==================== 导航方法 ====================
    const goBack = () => {
      router.push('/');
    };
    
    // ==================== 生命周期 ====================
    onMounted(() => {
      // 验证数据加载
      console.log('游戏初始化开始...');
      console.log('恐龙数据:', Object.keys(dinosaurs).length, '个');
      console.log('地图位置:', campusMap.locations?.length || 0, '个');
      console.log('主线任务:', missions.mainQuests?.length || 0, '个');
      
      if (Object.keys(dinosaurs).length === 0) {
        console.error('⚠️ 警告：恐龙数据未加载！');
      }
      
      // 初始化游戏
      currentWeather.value = getRandomWeather();
      
      // 自动保存
      setInterval(() => {
        saveGame();
      }, 60000); // 每分钟保存一次
      
      // 能量恢复
      setInterval(() => {
        if (player.value.energy < player.value.maxEnergy) {
          player.value.energy = Math.min(player.value.energy + 1, player.value.maxEnergy);
        }
      }, 5000); // 每5秒恢复1点能量
      
      console.log('游戏初始化完成！');
    });
    
    // 随机天气
    const getRandomWeather = () => {
      const weather = specialEvents.weather || {};
      const rand = Math.random();
      if (rand < 0.6) return weather.sunny || { name: '晴天', emoji: '☀️' };
      if (rand < 0.8) return weather.cloudy || { name: '多云', emoji: '☁️' };
      return weather.rainy || { name: '雨天', emoji: '🌧️' };
    };
    
    // 保存游戏
    const saveGame = () => {
      localStorage.setItem('dinoGameSave', JSON.stringify(player.value));
    };
    
    // 加载游戏
    const loadGame = () => {
      const saved = localStorage.getItem('dinoGameSave');
      if (saved) {
        const loadedData = JSON.parse(saved);
        Object.assign(player.value, loadedData);
      }
    };
    
    // 尝试加载存档
    loadGame();
    
    return {
      // 数据
      dinosaurs,
      campusMap,
      missions,
      collectibles,
      achievements,
      
      // 标签
      mainTabs,
      currentTab,
      
      // 玩家
      player,
      currentDinoData,
      healthPercent,
      energyPercent,
      expPercent,
      totalKnowledgeCount,
      currentMission,
      
      // 状态
      gameDataLoaded,
      currentWeather,
      currentDialogue,
      viewingKnowledge,
      showSettings,
      recentAchievement,
      
      // 方法
      handleMove,
      handleInteract,
      selectDinosaur,
      acceptMission,
      completeMission,
      handleDialogueChoice,
      useItem,
      viewKnowledge,
      getSkillIcon,
      goBack
    };
  }
};
</script>

<style scoped>
/* 返回按钮 */
.back-section {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 25px;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-btn:hover {
  background: #4a90e2;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
}

.back-btn i {
  font-size: 14px;
}

/* 主容器 */
.dino-game-container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-rows: auto auto 1fr;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 头部 */
.game-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 99;
}

.game-title {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dino-icon {
  font-size: 32px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.header-right {
  display: flex;
  gap: 10px;
}

.header-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.header-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* 导航标签 */
.main-nav {
  grid-column: 1 / -1;
  display: flex;
  gap: 5px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 2px solid #e2e8f0;
}

.nav-tab {
  flex: 1;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #4a5568;
}

.nav-tab:hover {
  background: #f7fafc;
  border-color: #667eea;
}

.nav-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.tab-icon {
  font-size: 24px;
}

/* 内容区域 */
.game-content {
  grid-column: 1;
  grid-row: 3;
  padding: 20px;
  overflow-y: auto;
}

.content-panel {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  min-height: 100%;
}

/* 侧边栏 */
.game-sidebar {
  grid-column: 2;
  grid-row: 2 / -1;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  overflow-y: auto;
  border-left: 2px solid #e2e8f0;
}

/* 玩家卡片 */
.player-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 20px;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.player-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.dino-avatar {
  font-size: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-name {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.dino-name {
  margin: 5px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

/* 属性条 */
.stats-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-bar {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
}

.bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s;
  border-radius: 10px;
}

.bar-fill.health {
  background: #f56565;
}

.bar-fill.energy {
  background: #48bb78;
}

.bar-fill.exp {
  background: #ecc94b;
}

/* 技能槽 */
.skill-slots {
  margin-top: 15px;
}

.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: bold;
  opacity: 0.9;
}

.skills {
  display: flex;
  gap: 10px;
}

.skill-slot {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.skill-slot:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.skill-icon {
  font-size: 24px;
}

.skill-level {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 10px;
  font-weight: bold;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 任务追踪器 */
.mission-tracker {
  background: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mission-title {
  margin: 10px 0 5px;
  font-size: 16px;
  color: #2d3748;
}

.mission-desc {
  margin: 0 0 15px;
  font-size: 13px;
  color: #718096;
}

.objectives {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.objective {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4a5568;
}

.objective.completed {
  color: #48bb78;
  text-decoration: line-through;
}

.mission-nav {
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
  font-size: 12px;
  color: #4a5568;
}

.mission-nav p {
  margin: 5px 0;
}

/* 背包 */
.inventory {
  background: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 10px 0;
}

.inventory-item {
  position: relative;
  aspect-ratio: 1;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.inventory-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.inventory-item.rarity-rare {
  border-color: #4299e1;
  background: #ebf8ff;
}

.inventory-item.rarity-epic {
  border-color: #9f7aea;
  background: #faf5ff;
}

.inventory-item.rarity-legendary {
  border-color: #f6ad55;
  background: #fffaf0;
}

.item-icon {
  font-size: 28px;
}

.item-count {
  position: absolute;
  bottom: 2px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 10px;
}

.inventory-stats {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
  font-size: 14px;
  color: #4a5568;
}

.inventory-stats p {
  margin: 5px 0;
}

/* 成就弹窗 */
.achievement-popup {
  position: fixed;
  top: 100px;
  right: 350px;
  background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(237, 137, 54, 0.5);
  animation: slideIn 0.5s, slideOut 0.5s 2.5s;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

.achievement-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.achievement-icon {
  font-size: 36px;
}

.achievement-label {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.achievement-name {
  margin: 5px 0 0;
  font-size: 16px;
  font-weight: bold;
}

/* 天气显示 */
.weather-display {
  position: fixed;
  top: 100px;
  left: 30px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  z-index: 50;
}

.weather-icon {
  font-size: 24px;
}

/* 小地图 */
.mini-map {
  position: fixed;
  bottom: 30px;
  left: 30px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

/* 加载提示 */
.loading-panel {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  font-size: 80px;
  animation: spin 2s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-content h2 {
  margin: 0 0 10px;
  font-size: 24px;
  color: #2d3748;
}

.loading-content p {
  margin: 0;
  color: #718096;
  font-size: 16px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .dino-game-container {
    grid-template-columns: 1fr 280px;
  }
}

@media (max-width: 768px) {
  .back-section {
    top: 10px;
    left: 10px;
  }
  
  .back-btn {
    padding: 10px 15px;
    font-size: 12px;
  }
  
  .dino-game-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
  }
  
  .game-sidebar {
    grid-column: 1;
    grid-row: 4;
    border-left: none;
    border-top: 2px solid #e2e8f0;
    max-height: 300px;
  }
}
</style>

