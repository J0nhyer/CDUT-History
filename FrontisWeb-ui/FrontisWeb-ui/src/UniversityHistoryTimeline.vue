<template>
  <div class="history-timeline-container">
    <!-- Canvas背景粒子 -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    
    <!-- 顶部导航 -->
    <div class="top-bar">
      <button @click="goHome" class="back-btn">
        <i class="fas fa-home"></i> 返回首页
      </button>
      <h1 class="page-title">成都理工大学数字校史馆</h1>
      <div class="placeholder"></div>
    </div>

    <!-- 主时间轴控制区域 -->
    <div class="timeline-control-area">
      <!-- 左侧：详细历史数据 -->
      <div class="timeline-detail-panel" v-if="currentEvent">
        <div class="event-image-container">
          <div class="event-image-placeholder" :style="{ backgroundImage: getEventImage(currentEvent.id) }">
            <div class="image-overlay"></div>
          </div>
          <div class="event-badge">{{ currentEvent.year }}</div>
        </div>
        <div class="event-content">
          <h2 class="event-title">{{ currentEvent.title }}</h2>
          <p class="event-description">{{ currentEvent.description }}</p>
          <div class="event-achievements" v-if="currentEvent.achievements">
            <h3>重要成就</h3>
            <ul>
              <li v-for="(ach, idx) in currentEvent.achievements" :key="idx">{{ ach }}</li>
            </ul>
          </div>
          <div class="event-tags" v-if="currentEvent.tags">
            <span class="tag" v-for="tag in currentEvent.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- 中间：动态时间轴 -->
      <div class="timeline-main-container">
        <div class="timeline-header">
          <h2>发展历程</h2>
          <div class="play-controls">
            <button @click="togglePlay" class="play-btn">
              <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
              {{ isPlaying ? '暂停' : '播放' }}
            </button>
            <button @click="resetTimeline" class="reset-btn">
              <i class="fas fa-redo"></i>
              重置
            </button>
          </div>
        </div>

        <!-- 可视化时间轴 -->
        <div class="timeline-visual-container" ref="timelineContainer">
          <svg class="timeline-svg" :width="timelineWidth" :height="timelineHeight">
            <!-- 时间轴主线 -->
            <line
              class="timeline-main-line"
              :x1="0"
              :y1="timelineHeight / 2"
              :x2="timelineWidth"
              :y2="timelineHeight / 2"
              stroke="#4A90E2"
              stroke-width="6"
            />
            
            <!-- 进度指示线 -->
            <line
              class="timeline-progress-line"
              :x1="0"
              :y1="timelineHeight / 2"
              :x2="progressPosition"
              :y2="timelineHeight / 2"
              stroke="#FFD700"
              stroke-width="8"
            />

            <!-- 事件标记点 -->
            <g v-for="(event, index) in timelineEvents" :key="event.id">
              <circle
                class="timeline-marker"
                :class="{ active: currentEventIndex >= index, current: currentEventIndex === index }"
                :cx="getEventXPosition(index)"
                :cy="timelineHeight / 2"
                r="12"
                @click="jumpToEvent(index)"
                @mouseenter="showPreview(index)"
                @mouseleave="hidePreview"
              >
                <title>{{ event.year }} - {{ event.title }}</title>
              </circle>
              
              <!-- 事件标签 -->
              <text
                class="event-label"
                :x="getEventXPosition(index)"
                :y="timelineHeight / 2 + 35"
                text-anchor="middle"
                :class="{ active: currentEventIndex >= index }"
              >
                {{ event.year }}
              </text>
            </g>

            <!-- 当前进度点 -->
            <circle
              class="progress-indicator"
              cx="0"
              cy="timelineHeight / 2"
              r="8"
              :style="{ transform: `translateX(${progressPosition}px)` }"
            />

            <!-- 悬停预览 -->
            <g v-if="hoverPreview" class="hover-preview">
              <rect
                :x="hoverPreviewX - 80"
                :y="timelineHeight / 2 - 40"
                width="160"
                height="30"
                rx="5"
                fill="rgba(74, 144, 226, 0.95)"
              />
              <text
                :x="hoverPreviewX"
                :y="timelineHeight / 2 - 20"
                text-anchor="middle"
                fill="white"
                font-size="12"
              >
                {{ hoverPreview.year }} - {{ hoverPreview.title }}
              </text>
            </g>
          </svg>

          <!-- 时间刻度 -->
          <div class="time-scale">
            <span class="scale-start">{{ minYear }}</span>
            <span class="scale-end">{{ maxYear }}</span>
          </div>
          
          <!-- 加载提示 -->
          <div v-if="timelineEvents.length === 0" class="loading-tip">
            <i class="fas fa-spinner fa-spin"></i> 正在加载历史数据...
          </div>
        </div>

        <!-- 播放进度条 -->
        <div class="progress-bar-container">
          <input
            type="range"
            class="progress-slider"
            :min="0"
            :max="timelineEvents.length - 1"
            :value="currentEventIndex"
            @input="onProgressChange"
            step="1"
          />
          <div class="progress-info">
            <span>{{ currentEventIndex + 1 }} / {{ timelineEvents.length }}</span>
            <span class="play-speed">
              <i class="fas fa-tachometer-alt"></i>
              {{ playSpeed }}x
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧：相关人物/成就 -->
      <div class="related-items-panel">
        <h3>相关人物</h3>
        <div class="related-people">
          <div v-for="person in relatedPeople" :key="person.id" class="person-card">
            <div class="person-avatar" :style="{ background: person.color }">
              {{ person.icon }}
            </div>
            <div class="person-info">
              <h4>{{ person.name }}</h4>
              <p>{{ person.description }}</p>
            </div>
          </div>
        </div>

        <h3>重要成就</h3>
        <div class="related-achievements">
          <div v-for="(ach, idx) in relatedAchievements" :key="idx" class="achievement-card">
            <i class="fas fa-trophy"></i>
            <span>{{ ach }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部：章节选择 -->
    <div class="chapter-selector" v-if="chapters.length > 0">
      <button
        v-for="chapter in chapters"
        :key="chapter.id"
        @click="jumpToChapter(chapter.id)"
        :class="{ active: currentChapter === chapter.id }"
        class="chapter-btn"
      >
        <i :class="chapter.icon"></i>
        <span>{{ chapter.name }}</span>
      </button>
    </div>

    <!-- 背景音乐控制（可选） -->
    <div class="audio-controls">
      <button @click="toggleMusic" class="audio-btn">
        <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const particleCanvas = ref(null)
const timelineContainer = ref(null)

// 时间轴配置
const timelineWidth = ref(800)
const timelineHeight = ref(200)
const isPlaying = ref(false)
const currentEventIndex = ref(0)
const playSpeed = ref(1)
const isMuted = ref(false)
const currentChapter = ref('era1')
const hoverPreview = ref(null)
const hoverPreviewX = ref(0)

// 年份范围
const minYear = ref(1956)
const maxYear = ref(2026)

// 播放控制
let playInterval = null

// 时间轴事件数据（从API获取）
const timelineEvents = ref([])

// 从后端API加载历史事件数据
const loadHistoryEvents = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/history/events')
    if (response.data.success) {
      timelineEvents.value = response.data.data
      
      // 更新年份范围
      if (timelineEvents.value.length > 0) {
        const years = timelineEvents.value.map(e => parseInt(e.year)).filter(y => !isNaN(y))
        if (years.length > 0) {
          minYear.value = Math.min(...years)
          maxYear.value = Math.max(...years)
        }
      }
    }
  } catch (error) {
    console.error('加载历史事件失败:', error)
    // 使用默认数据作为后备
    timelineEvents.value = []
  }
}

// 章节配置（动态计算索引范围）
const chapters = computed(() => {
  if (timelineEvents.value.length === 0) return []
  
  const totalEvents = timelineEvents.value.length
  const chapterSize = Math.ceil(totalEvents / 4)
  
  return [
    { id: 'era1', name: '建校初创', icon: 'fas fa-building', start: 0, end: Math.min(chapterSize - 1, totalEvents - 1) },
    { id: 'era2', name: '学科建设', icon: 'fas fa-graduation-cap', start: chapterSize, end: Math.min(chapterSize * 2 - 1, totalEvents - 1) },
    { id: 'era3', name: '发展提升', icon: 'fas fa-chart-line', start: chapterSize * 2, end: Math.min(chapterSize * 3 - 1, totalEvents - 1) },
    { id: 'era4', name: '新时代', icon: 'fas fa-rocket', start: chapterSize * 3, end: totalEvents - 1 }
  ]
})

// 计算当前事件
const currentEvent = computed(() => {
  return timelineEvents.value[currentEventIndex.value]
})

// 计算进度位置
const progressPosition = computed(() => {
  return (currentEventIndex.value / (timelineEvents.value.length - 1)) * timelineWidth.value
})

// 获取事件X位置
const getEventXPosition = (index) => {
  return (index / (timelineEvents.value.length - 1)) * timelineWidth.value
}

// 跳转到事件
const jumpToEvent = (index) => {
  currentEventIndex.value = index
  if (playInterval) {
    clearInterval(playInterval)
    isPlaying.value = false
  }
}

// 进度滑块变化
const onProgressChange = (event) => {
  currentEventIndex.value = parseInt(event.target.value)
  if (playInterval) {
    clearInterval(playInterval)
    isPlaying.value = false
  }
}

// 切换播放状态
const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  
  if (isPlaying.value) {
    playInterval = setInterval(() => {
      if (currentEventIndex.value < timelineEvents.value.length - 1) {
        currentEventIndex.value++
      } else {
        clearInterval(playInterval)
        isPlaying.value = false
      }
    }, 3000 / playSpeed.value) // 每个事件3秒（可调速）
  } else {
    if (playInterval) {
      clearInterval(playInterval)
    }
  }
}

// 重置时间轴
const resetTimeline = () => {
  currentEventIndex.value = 0
  if (playInterval) {
    clearInterval(playInterval)
    isPlaying.value = false
  }
}

// 跳转到章节
const jumpToChapter = (chapterId) => {
  currentChapter.value = chapterId
  const chapter = chapters.value.find(c => c.id === chapterId)
  if (chapter) {
    jumpToEvent(chapter.start)
  }
}

// 显示预览
const showPreview = (index) => {
  hoverPreview.value = timelineEvents.value[index]
  hoverPreviewX.value = getEventXPosition(index)
}

// 隐藏预览
const hidePreview = () => {
  hoverPreview.value = null
}

// 获取事件图片
const getEventImage = (eventId) => {
  // 可以根据事件ID返回不同的背景图片
  return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

// 获取相关人物
const relatedPeople = computed(() => {
  if (!currentEvent.value) return []
  // TODO: 从数据库获取关联人物
  return []
})

// 获取相关成就
const relatedAchievements = computed(() => {
  return currentEvent.value?.achievements || []
})

// 切换音乐
const toggleMusic = () => {
  isMuted.value = !isMuted.value
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 粒子背景初始化
const initParticleBackground = () => {
  if (!particleCanvas.value) return
  
  const canvas = particleCanvas.value
  const ctx = canvas.getContext('2d')
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  const particleCount = 100
  const particles = []
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.vx = (Math.random() - 0.5) * 0.8
      this.vy = (Math.random() - 0.5) * 0.8
      this.radius = Math.random() * 2 + 1
      this.opacity = Math.random() * 0.5 + 0.3
    }
    
    update() {
      this.x += this.vx
      this.y += this.vy
      
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1
    }
    
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(74, 144, 226, ${this.opacity})`
      ctx.fill()
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }
  
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(74, 144, 226, ${0.2 * (1 - distance / 150)})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    particles.forEach(particle => {
      particle.update()
      particle.draw()
    })
    
    drawLines()
    requestAnimationFrame(animate)
  }
  
  animate()
}

onMounted(() => {
  initParticleBackground()
  loadHistoryEvents()
})

onUnmounted(() => {
  if (playInterval) {
    clearInterval(playInterval)
  }
})
</script>

<style scoped>
.history-timeline-container {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #0D1117 0%, #111827 50%, #0D1117 100%);
  overflow-x: hidden;
}

.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.page-title {
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #4A90E2, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.placeholder {
  width: 120px;
}

.timeline-control-area {
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  gap: 30px;
  padding: 100px 40px 40px;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 200px);
}

.timeline-detail-panel {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.event-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
}

.event-image-placeholder {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.event-badge {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
}

.event-content h2 {
  color: white;
  font-size: 24px;
  margin-bottom: 15px;
  font-weight: 700;
}

.event-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: 20px;
}

.event-achievements h3 {
  color: #FFD700;
  font-size: 16px;
  margin-bottom: 10px;
}

.event-achievements ul {
  list-style: none;
  padding: 0;
}

.event-achievements li {
  color: rgba(255, 255, 255, 0.8);
  padding: 5px 0;
  display: flex;
  align-items: center;
}

.event-achievements li::before {
  content: '✓';
  color: #4A90E2;
  margin-right: 8px;
  font-weight: bold;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.tag {
  background: rgba(74, 144, 226, 0.2);
  color: #4A90E2;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
}

.timeline-main-container {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.timeline-header h2 {
  color: white;
  font-size: 28px;
  margin: 0;
}

.play-controls {
  display: flex;
  gap: 15px;
}

.play-btn, .reset-btn {
  background: linear-gradient(135deg, #4A90E2, #357ABD);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.play-btn:hover, .reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 144, 226, 0.4);
}

.timeline-visual-container {
  position: relative;
  padding: 20px 0;
}

.timeline-svg {
  width: 100%;
  height: 200px;
}

.timeline-main-line {
  filter: drop-shadow(0 2px 8px rgba(74, 144, 226, 0.5));
}

.timeline-progress-line {
  transition: all 0.5s ease;
  filter: drop-shadow(0 2px 8px rgba(255, 215, 0, 0.5));
}

.timeline-marker {
  fill: rgba(74, 144, 226, 0.5);
  stroke: white;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-marker:hover {
  r: 15;
  fill: #4A90E2;
}

.timeline-marker.active {
  fill: #4A90E2;
  r: 14;
}

.timeline-marker.current {
  fill: #FFD700;
  r: 16;
}

.event-label {
  fill: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
}

.event-label.active {
  fill: white;
  font-size: 16px;
}

.progress-indicator {
  fill: #FFD700;
  filter: drop-shadow(0 0 10px #FFD700);
  pointer-events: none;
}

.hover-preview {
  pointer-events: none;
}

.time-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.loading-tip {
  text-align: center;
  padding: 30px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

.loading-tip i {
  margin-right: 10px;
  color: #4A90E2;
}

.progress-bar-container {
  margin-top: 30px;
}

.progress-slider {
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FFD700;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.progress-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FFD700;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.play-speed {
  color: #FFD700;
}

.related-items-panel {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.related-items-panel h3 {
  color: white;
  font-size: 20px;
  margin-bottom: 20px;
  border-bottom: 2px solid #4A90E2;
  padding-bottom: 10px;
}

.related-people {
  margin-bottom: 30px;
}

.person-card {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.person-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.person-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.person-info h4 {
  color: white;
  margin: 0 0 5px 0;
  font-size: 16px;
}

.person-info p {
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-size: 14px;
}

.related-achievements {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  color: #FFD700;
  font-size: 14px;
  border-left: 3px solid #FFD700;
}

.chapter-selector {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.chapter-btn {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chapter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.chapter-btn.active {
  background: linear-gradient(135deg, #4A90E2, #357ABD);
  border-color: #4A90E2;
}

.audio-controls {
  position: fixed;
  bottom: 100px;
  right: 30px;
  z-index: 1001;
}

.audio-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.audio-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

@media (max-width: 1400px) {
  .timeline-control-area {
    grid-template-columns: 280px 1fr 280px;
  }
}

@media (max-width: 1200px) {
  .timeline-control-area {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .timeline-detail-panel,
  .related-items-panel {
    position: static;
  }
}
</style>

