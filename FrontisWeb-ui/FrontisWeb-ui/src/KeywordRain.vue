<template>
  <div class="keyword-rain-page">
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>

    <!-- 3D入口按钮 -->
    <button class="enter-3d-button" @click="enter3D">
      <i class="fas fa-cube"></i>
      <span>进入3D世界</span>
      <div class="button-glow"></div>
    </button>

    <!-- 标题区域 -->
    <div class="rain-header">
      <h1 class="rain-title">倾听雨声</h1>
      <p class="rain-subtitle">点击接住飘落的关键词，探索成理历史</p>
    </div>

    <!-- 关键词雨容器 -->
    <div class="keyword-rain-container" ref="rainContainer">
      <div
        v-for="keyword in activeKeywords"
        :key="keyword.id"
        class="keyword-item"
        :class="{ 'catching': keyword.isCatching }"
        :data-type="keyword.type"
        :style="keyword.style"
        @click="catchKeyword(keyword)"
        @mouseenter="keyword.isHovering = true"
        @mouseleave="keyword.isHovering = false"
        @animationend="onAnimationEnd(keyword)"
      >
        <span class="keyword-text">{{ keyword.name }}</span>
        <span class="keyword-hint" v-if="keyword.isHovering">点击查看</span>
      </div>
    </div>


    <!-- 提示信息 -->
    <div class="hint-text">
      <i class="fas fa-hand-pointer"></i>
      移动鼠标到关键词上并点击，即可接住并查看详情
    </div>

    <!-- 学院信息弹窗 -->
    <div class="institute-modal" v-if="selectedInstitute" @click="closeInstitute">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeInstitute">×</button>
        <div class="institute-info">
          <h2>{{ selectedInstitute.name }}</h2>
          <p class="title" v-if="selectedInstitute.title">{{ selectedInstitute.title }}</p>
          <div class="description" v-if="selectedInstitute.description">{{ selectedInstitute.description }}</div>
        </div>
      </div>
    </div>

    <!-- 专业信息弹窗 -->
    <div class="major-modal" v-if="selectedMajor" @click="closeMajor">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeMajor">×</button>
        <div class="major-info">
          <h2>{{ selectedMajor.name }}</h2>
          <p class="major-level" v-if="selectedMajor.level">层次：{{ selectedMajor.level }}</p>
          <div class="description" v-if="selectedMajor.description">{{ selectedMajor.description }}</div>
        </div>
      </div>
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
      availableKeywords: [], // 可用的关键词池（用于避免重复）
      selectedInstitute: null, // 选中的学院信息
      selectedMajor: null, // 选中的专业信息
      activeKeywords: [],    // 当前显示的关键词
      maxKeywords: 30,       // 同时显示的最大关键词数
      caughtKeywords: new Set(), // 已接住的关键词ID
      caughtCount: 0,        // 接住计数
      rainInterval: null     // 雨水定时器
    };
  },
  computed: {
  },
  mounted() {
    this.loadAllKeywords();
    this.adjustMaxKeywords();
    window.addEventListener('resize', this.adjustMaxKeywords);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustMaxKeywords);
    if (this.rainInterval) {
      clearInterval(this.rainInterval);
    }
  },
  methods: {
    async loadAllKeywords() {
      try {
        // 并发加载所有类型的数据
        const [personsRes, eventsRes, nodesRes, majorsRes] = await Promise.allSettled([
          axios.get('/api/person'),
          axios.get('/api/history/events'),
          axios.get('/api/academic-universe/nodes'),
          axios.get('/api/academic-universe/majors')
        ]);

        this.keywords = [];

        // 1. 加载人物 - 直接返回数组
        if (personsRes.status === 'fulfilled' && personsRes.value.data) {
          const personData = Array.isArray(personsRes.value.data) ? personsRes.value.data : [];
          const persons = personData
            .filter(p => p.name && p.personId)
            .map(p => ({
              id: `person-${p.personId}`,
              name: p.name,
              type: 'person',
              route: `/person/${p.personId}`
            }));
          this.keywords.push(...persons);
        }

        // 2. 加载历史事件 - 返回包装对象 {success, data}
        if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
          const eventData = eventsRes.value.data.data || eventsRes.value.data;
          const events = (Array.isArray(eventData) ? eventData : [])
            .filter(e => e.title && e.id && e.year)
            .map(e => ({
              id: `event-${e.id}`,
              name: e.title,
              type: 'event',
              year: e.year,
              route: `/event/${e.year}`
            }));
          this.keywords.push(...events);
        }

        // 3. 加载学院/研究院 - 返回包装对象 {success, data}
        if (nodesRes.status === 'fulfilled' && nodesRes.value.data) {
          const nodeData = nodesRes.value.data.data || nodesRes.value.data;
          const nodes = (Array.isArray(nodeData) ? nodeData : [])
            .filter(n => n.name && n.nodeId)
            .map(n => ({
              id: `node-${n.nodeId}`,
              name: n.name,
              type: 'institute',
              route: `/academic-universe?node=${n.nodeId}`
            }));
          this.keywords.push(...nodes);
        }

        // 4. 加载专业 - 直接返回数组
        if (majorsRes.status === 'fulfilled' && majorsRes.value.data) {
          const majorData = Array.isArray(majorsRes.value.data) ? majorsRes.value.data : [];
          const majors = majorData
            .filter(m => m.name && m.majorId)
            .map(m => ({
              id: `major-${m.majorId}`,
              name: m.name,
              type: 'major',
              route: `/academic-universe?major=${m.majorId}`
            }));
          this.keywords.push(...majors);
        }

        const stats = {
          total: this.keywords.length,
          person: this.keywords.filter(k => k.type === 'person').length,
          event: this.keywords.filter(k => k.type === 'event').length,
          institute: this.keywords.filter(k => k.type === 'institute').length,
          major: this.keywords.filter(k => k.type === 'major').length
        };
        console.log('✅ 关键词雨数据加载完成:', stats);
        
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
      // 初始化关键词池（打乱顺序）
      this.refillKeywordPool();
      
      // 初始化显示的关键词（逐个错开出现）
      const initialCount = Math.min(15, this.maxKeywords);
      for (let i = 0; i < initialCount; i++) {
        setTimeout(() => {
          this.addKeyword();
        }, i * 150); // 每个关键词间隔150ms
      }
      
      // 持续添加新关键词，保持雨水连贯
      this.rainInterval = setInterval(() => {
        this.addKeyword();
      }, 600); // 每0.6秒添加一个新关键词
    },
    
    // 重新填充关键词池（打乱顺序避免重复）
    refillKeywordPool() {
      // 复制并打乱关键词数组
      this.availableKeywords = [...this.keywords].sort(() => Math.random() - 0.5);
      console.log('关键词池已重新填充，共', this.availableKeywords.length, '个关键词');
    },

    addKeyword() {
      if (this.keywords.length === 0) return;

      // 如果关键词池空了，重新填充
      if (this.availableKeywords.length === 0) {
        this.refillKeywordPool();
      }

      // 从池中取出一个关键词（避免重复）
      const keyword = this.availableKeywords.shift();
      if (!keyword) return;
      
      // 调试日志（可选）
      // console.log('添加关键词:', keyword.name, '剩余池:', this.availableKeywords.length);

      // 随机生成样式参数
      const duration = 6 + Math.random() * 12; // 动画时长 6-18秒
      const fontSize = 14 + Math.random() * 21; // 字体大小 14-35px
      const opacity = 0.5 + Math.random() * 0.4; // 透明度 0.5-0.9
      
      const style = this.generateKeywordStyle(keyword, duration, fontSize, opacity);

      const uniqueId = `${keyword.id}-${Date.now()}-${Math.random()}`;
      const newKeyword = {
        ...keyword,
        originalId: keyword.id, // 保存原始ID用于统计
        id: uniqueId, // 确保唯一ID
        style,
        isHovering: false,
        isCatching: false
      };

      this.activeKeywords.push(newKeyword);

      // 控制最大数量，防止内存泄漏
      if (this.activeKeywords.length > this.maxKeywords * 2) {
        // 移除未被接住且不在视图中的旧关键词
        this.activeKeywords = this.activeKeywords.filter((k, idx) => {
          return k.isCatching || idx >= this.activeKeywords.length - this.maxKeywords;
        });
      }
    },

    generateKeywordStyle(keyword, duration, fontSize, opacity) {
      const delay = 0; // 无延迟，立即开始
      const xPosition = Math.random() * 90; // 水平位置 0-90%
      const drift = (Math.random() - 0.5) * 60; // 左右漂移 -30px到30px

      // 根据类型设置不同颜色组，每次随机选择
      const colorGroups = {
        person: ['#ffffff', '#f0f8ff', '#fffacd', '#ffe4e1', '#e6e6fa', '#ffefd5'],      // 人物 - 白色系
        event: ['#ffd700', '#ffb347', '#ffa500', '#ff8c00', '#ffdf00', '#ffc107'],       // 事件 - 金橙色系
        institute: ['#87ceeb', '#87cefa', '#00bfff', '#5f9ea0', '#4682b4', '#6495ed'],   // 学院 - 蓝色系
        major: ['#98fb98', '#90ee90', '#00fa9a', '#7fffd4', '#66cdaa', '#3cb371']        // 专业 - 绿色系
      };

      const colors = colorGroups[keyword.type] || colorGroups.person;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      return {
        '--duration': `${duration}s`,
        '--drift': `${drift}px`,
        '--delay': `${delay}s`,
        fontSize: `${fontSize}px`,
        left: `${xPosition}%`,
        opacity: opacity,
        color: randomColor,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
      };
    },

    onAnimationEnd(keyword) {
      // 动画结束时，如果未被接住，则移除并放回关键词池
      if (!keyword.isCatching) {
        const index = this.activeKeywords.findIndex(k => k.id === keyword.id);
        if (index > -1) {
          this.activeKeywords.splice(index, 1);
          
          // 将原始关键词放回池中（在末尾），让它可以再次出现
          const originalKeyword = this.keywords.find(k => k.id === keyword.originalId);
          if (originalKeyword) {
            this.availableKeywords.push(originalKeyword);
          }
        }
      }
    },

    catchKeyword(keyword) {
      keyword.isCatching = true;
      
      if (!this.caughtKeywords.has(keyword.originalId)) {
        this.caughtKeywords.add(keyword.originalId);
        this.caughtCount++;
      }

      setTimeout(() => {
        const index = this.activeKeywords.indexOf(keyword);
        if (index > -1) {
          this.activeKeywords.splice(index, 1);
        }

        if (keyword.type === 'institute') {
          this.showInstituteDetail(keyword);
        } else if (keyword.type === 'major') {
          this.showMajorDetail(keyword);
        } else if (keyword.type === 'person') {
          this.$router.push({
            path: keyword.route,
            query: { from: 'keyword-rain', personId: keyword.originalId.replace('person-', '') }
          });
        } else if (keyword.type === 'event') {
          this.$router.push({
            path: keyword.route,
            query: { from: 'keyword-rain' }
          });
        } else {
          this.$router.push(keyword.route);
        }
      }, 300);
    },

    async showInstituteDetail(keyword) {
      try {
        const nodeId = keyword.originalId.replace('node-', '');
        const response = await axios.get(`/api/academic-universe/nodes/${nodeId}`);
        this.selectedInstitute = response.data;
      } catch (error) {
        console.error('获取学院详情失败:', error);
        this.$router.push(keyword.route);
      }
    },

    closeInstitute() {
      this.selectedInstitute = null;
    },

    async showMajorDetail(keyword) {
      try {
        const majorId = keyword.originalId.replace('major-', '');
        const response = await axios.get(`/api/academic-universe/majors/${majorId}`);
        this.selectedMajor = response.data;
      } catch (error) {
        console.error('获取专业详情失败:', error);
        this.$router.push(keyword.route);
      }
    },

    closeMajor() {
      this.selectedMajor = null;
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
    },

    enter3D() {
      this.$router.push('/keyword-rain-3d');
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

/* 3D入口按钮 */
.enter-3d-button {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 1000;
  padding: 12px 24px;
  background: rgba(100, 120, 200, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: normal;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: none;
  overflow: hidden;
}

.enter-3d-button i {
  font-size: 18px;
}

.enter-3d-button:hover {
  background: rgba(100, 120, 200, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}

.enter-3d-button:active {
  transform: translateY(0);
}

.button-glow {
  display: none;
}

/* 标题区域 */
.rain-header {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 120px 20px 60px;
  pointer-events: none;
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
  animation: keywordFall var(--duration) linear forwards;
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

/* 学院信息弹窗 */
.institute-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  position: relative;
  background: linear-gradient(135deg, #1a2847 0%, #0a1428 100%);
  border-radius: 20px;
  border: 2px solid rgba(135, 206, 235, 0.5);
  padding: 40px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.institute-info h2 {
  color: #87ceeb;
  font-size: 28px;
  margin: 0 0 10px 0;
}

.institute-info .title {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin: 0 0 20px 0;
}

.institute-info .description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  margin-bottom: 25px;
}

/* 专业信息弹窗 */
.major-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
}

.major-info h2 {
  color: #98fb98;
  font-size: 28px;
  margin: 0 0 10px 0;
}

.major-info .major-level {
  color: #ffd700;
  font-size: 16px;
  margin: 0 0 20px 0;
  font-weight: bold;
}

.major-info .description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  margin-bottom: 25px;
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
