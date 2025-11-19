<template>
  <div class="keyword-rain-page">
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>

    <!-- 标题区域 -->
    <div class="rain-header">
      <h1 class="rain-title">倾听雨声</h1>
      <p class="rain-subtitle">点击接住飘落的关键词，探索成理历史</p>
    </div>

    <!-- 关键词雨容器 -->
    <div class="keyword-rain-container" ref="rainContainer">
      <div
        v-for="(keyword, index) in activeKeywords"
        :key="index"
        class="keyword-item"
        :class="{ 'catching': keyword.isCatching }"
        :data-type="keyword.type"
        :style="keyword.style"
        @click="catchKeyword(keyword, index)"
        @mouseenter="keyword.isHovering = true"
        @mouseleave="keyword.isHovering = false"
      >
        <span class="keyword-text">{{ keyword.name }}</span>
        <span class="keyword-hint" v-if="keyword.isHovering">点击查看</span>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="rain-stats">
      <div class="stat-item">
        <span class="stat-label">总关键词</span>
        <span class="stat-value">{{ totalCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">已接住</span>
        <span class="stat-value">{{ caughtCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">接住率</span>
        <span class="stat-value">{{ catchRate }}%</span>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="hint-text">
      <i class="fas fa-hand-pointer"></i>
      移动鼠标到关键词上并点击，即可接住并查看详情
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'KeywordRain',
  data() {
    return {
      keywords: [],          // 所有关键词数据（包含人物、事件、学院、专业）
      activeKeywords: [],    // 当前显示的关键词
      maxKeywords: 30,       // 同时显示的最大关键词数
      caughtKeywords: new Set(), // 已接住的关键词ID
      caughtCount: 0         // 接住计数
    };
  },
  computed: {
    catchRate() {
      if (this.keywords.length === 0) return 0;
      return Math.round((this.caughtCount / this.keywords.length) * 100);
    },
    totalCount() {
      return this.keywords.length;
    }
  },
  mounted() {
    this.loadAllKeywords();
    this.adjustMaxKeywords();
    window.addEventListener('resize', this.adjustMaxKeywords);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustMaxKeywords);
  },
  methods: {
    async loadAllKeywords() {
      try {
        // 并发加载所有类型的数据
        const [personsRes, eventsRes, nodesRes, majorsRes] = await Promise.allSettled([
          axios.get('/api/persons'),
          axios.get('/api/history/events'),
          axios.get('/api/academic/nodes'),
          axios.get('/api/academic/majors')
        ]);

        this.keywords = [];

        // 1. 加载人物
        if (personsRes.status === 'fulfilled' && personsRes.value.data) {
          const persons = personsRes.value.data
            .filter(p => p.name && p.person_id)
            .map(p => ({
              id: `person-${p.person_id}`,
              name: p.name,
              type: 'person',
              route: `/person/${p.person_id}`
            }));
          this.keywords.push(...persons);
        }

        // 2. 加载历史事件
        if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
          const events = eventsRes.value.data
            .filter(e => e.title && e.event_id)
            .map(e => ({
              id: `event-${e.event_id}`,
              name: e.title,
              type: 'event',
              route: `/history/${e.event_id}`
            }));
          this.keywords.push(...events);
        }

        // 3. 加载学院/研究院
        if (nodesRes.status === 'fulfilled' && nodesRes.value.data) {
          const nodes = nodesRes.value.data
            .filter(n => n.name && n.node_id)
            .map(n => ({
              id: `node-${n.node_id}`,
              name: n.name,
              type: 'institute',
              route: `/academic-universe?node=${n.node_id}`
            }));
          this.keywords.push(...nodes);
        }

        // 4. 加载专业
        if (majorsRes.status === 'fulfilled' && majorsRes.value.data) {
          const majors = majorsRes.value.data
            .filter(m => m.name && m.major_id)
            .map(m => ({
              id: `major-${m.major_id}`,
              name: m.name,
              type: 'major',
              route: `/academic-universe?major=${m.major_id}`
            }));
          this.keywords.push(...majors);
        }

        console.log(`成功加载 ${this.keywords.length} 个关键词`);
        console.log(`人物: ${this.keywords.filter(k => k.type === 'person').length}`);
        console.log(`事件: ${this.keywords.filter(k => k.type === 'event').length}`);
        console.log(`学院: ${this.keywords.filter(k => k.type === 'institute').length}`);
        console.log(`专业: ${this.keywords.filter(k => k.type === 'major').length}`);
        
        // 启动关键词雨
        this.startRain();
      } catch (error) {
        console.error('加载关键词数据失败:', error);
        // 使用默认数据
        this.useDefaultKeywords();
        this.startRain();
      }
    },

    useDefaultKeywords() {
      this.keywords = [
        { id: 'person-1', name: '刘宝珺', type: 'person', route: '/person/liubaojun' },
        { id: 'person-2', name: '黄润秋', type: 'person', route: '/person/huangrunqiu' },
        { id: 'event-1', name: '成都理工大学建校', type: 'event', route: '/history/event-1956' },
        { id: 'institute-1', name: '地球科学学院', type: 'institute', route: '/academic-universe?node=u01' },
        { id: 'major-1', name: '地质学', type: 'major', route: '/academic-universe?major=u01-m1' }
      ];
    },

    startRain() {
      // 初始化显示的关键词
      for (let i = 0; i < this.maxKeywords; i++) {
        this.addKeyword();
      }
    },

    addKeyword() {
      if (this.keywords.length === 0) return;

      const keyword = this.keywords[Math.floor(Math.random() * this.keywords.length)];
      const style = this.generateKeywordStyle(keyword);

      this.activeKeywords.push({
        ...keyword,
        style,
        isHovering: false,
        isCatching: false
      });

      // 移除最早添加的关键词
      if (this.activeKeywords.length > this.maxKeywords) {
        this.activeKeywords.shift();
      }
    },

    generateKeywordStyle(keyword) {
      const duration = 8 + Math.random() * 4;
      const delay = Math.random() * 2;
      const xPosition = Math.random() * 90;
      const fontSize = 12 + Math.random() * 6;
      const drift = (Math.random() - 0.5) * 50;
      const opacity = 0.3 + Math.random() * 0.5; // 随机透明度 0.3-0.8

      // 根据类型设置不同颜色
      const colorMap = {
        person: '#ffffff',      // 人物 - 白色
        event: '#ffd700',       // 事件 - 金色
        institute: '#87ceeb',   // 学院 - 天蓝色
        major: '#98fb98'        // 专业 - 淡绿色
      };

      return {
        '--duration': `${duration}s`,
        '--drift': `${drift}px`,
        '--delay': `${delay}s`,
        fontSize: `${fontSize}px`,
        left: `${xPosition}%`,
        opacity: opacity,
        color: colorMap[keyword.type] || '#ffffff',
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
      };
    },

    catchKeyword(keyword, index) {
      // 标记为接住状态
      keyword.isCatching = true;
      
      // 记录接住
      if (!this.caughtKeywords.has(keyword.id)) {
        this.caughtKeywords.add(keyword.id);
        this.caughtCount++;
      }

      // 延迟后跳转到目标页面
      setTimeout(() => {
        this.$router.push(keyword.route);
      }, 300);
    },

    adjustMaxKeywords() {
      const width = window.innerWidth;
      if (width < 768) {
        this.maxKeywords = 15;
      } else if (width < 1024) {
        this.maxKeywords = 20;
      } else {
        this.maxKeywords = 30;
      }
    },

    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.keyword-rain-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1428 0%, #1a2847 100%);
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 返回按钮 */
.back-button {
  position: fixed;
  top: 30px;
  left: 30px;
  z-index: 1000;
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  font-size: 16px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
}

/* 标题区域 */
.rain-header {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 120px 20px 60px;
}

.rain-title {
  font-size: 56px;
  font-weight: 300;
  color: white;
  margin: 0 0 20px;
  letter-spacing: 8px;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.rain-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  letter-spacing: 2px;
}

/* 关键词雨容器 */
.keyword-rain-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 关键词元素 */
.keyword-item {
  position: absolute;
  top: -10%;
  white-space: nowrap;
  will-change: transform;
  animation: keywordFall var(--duration) linear var(--delay) infinite;
  user-select: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.keyword-item:hover {
  opacity: 1 !important;
  animation-play-state: paused;
}

.keyword-item.catching {
  animation: catchAnimation 0.3s ease-out forwards;
}

.keyword-text {
  display: block;
  font-weight: 300;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.keyword-hint {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  margin-top: 4px;
  text-align: center;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

@keyframes keywordFall {
  0% {
    transform: translateY(-10vh) translateX(0);
  }
  100% {
    transform: translateY(110vh) translateX(var(--drift));
  }
}

@keyframes catchAnimation {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

/* 统计信息 */
.rain-stats {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 15px 30px;
  border-radius: 12px;
  z-index: 10;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

/* 提示文本 */
.hint-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
  text-align: center;
  pointer-events: none;
  z-index: 5;
  animation: hintPulse 2s ease-in-out infinite;
}

.hint-text i {
  display: block;
  font-size: 24px;
  margin-bottom: 10px;
}

@keyframes hintPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .rain-title {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .rain-subtitle {
    font-size: 14px;
  }

  .rain-stats {
    flex-wrap: wrap;
    gap: 20px;
    padding: 15px 25px;
    bottom: 20px;
  }

  .stat-item {
    min-width: 80px;
  }

  .stat-value {
    font-size: 20px;
  }

  .back-button {
    top: 20px;
    left: 20px;
    padding: 10px 20px;
    font-size: 13px;
  }

  .keyword-item {
    font-size: 13px !important;
  }

  .hint-text {
    font-size: 12px;
  }

  .hint-text i {
    font-size: 20px;
  }
}
</style>
