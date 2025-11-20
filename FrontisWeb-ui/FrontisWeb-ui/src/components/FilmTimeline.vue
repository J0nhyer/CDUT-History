<template>
  <div class="film-timeline-container">
    <!-- 标题区域 -->
    <div class="timeline-header">
      <h2 class="timeline-title">
        <i class="fas fa-film"></i>
        时光胶片
      </h2>
      <p class="timeline-subtitle">滑动查看历史时刻</p>
    </div>

    <!-- 胶片轨道 -->
    <div class="film-track-wrapper" ref="trackWrapper">
      <!-- 左右导航按钮 -->
      <button 
        @click="scrollFilm('left')" 
        class="nav-arrow left"
        :disabled="currentIndex === 0"
        v-show="timelineEvents.length > 3"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button 
        @click="scrollFilm('right')" 
        class="nav-arrow right"
        :disabled="currentIndex >= timelineEvents.length - 1"
        v-show="timelineEvents.length > 3"
      >
        <i class="fas fa-chevron-right"></i>
      </button>

      <!-- 胶片条 -->
      <div class="film-track" ref="filmTrack">
        <div 
          class="film-strip" 
          :style="filmStripStyle"
          @mousedown="startDrag"
          @touchstart="startDrag"
        >
          <div 
            v-for="(event, index) in timelineEvents" 
            :key="event.eventId || index"
            class="film-frame"
            :class="{ 
              active: currentIndex === index,
              important: event.importance === 'high',
              'has-image': event.imageUrl
            }"
            @click="selectFrame(index)"
          >
            <!-- 上方穿孔 -->
            <div class="sprocket-holes top">
              <span v-for="i in 6" :key="'top-' + i" class="hole"></span>
            </div>
            
            <!-- 胶片内容区 -->
            <div class="frame-content">
              <!-- 有图片：显示图片 -->
              <div v-if="event.imageUrl" class="frame-image">
                <img :src="event.imageUrl" :alt="event.title" @error="handleImageError" />
              </div>
              
              <!-- 无图片：显示美化的占位符 -->
              <div v-else class="frame-placeholder">
                <div class="placeholder-bg">
                  <!-- 渐变背景 -->
                  <div class="gradient-layer"></div>
                  <!-- 几何图案 -->
                  <div class="pattern-layer">
                    <div class="pattern-circle"></div>
                    <div class="pattern-lines"></div>
                  </div>
                  <!-- 年份大字 -->
                  <div class="year-display">{{ event.year }}</div>
                  <!-- 图标 -->
                  <div class="icon-layer">
                    <i class="fas fa-clock"></i>
                  </div>
                </div>
              </div>
              
              <!-- 年份角标 -->
              <div class="frame-year-badge">{{ event.year }}</div>
              
              <!-- 重要事件星标 -->
              <div v-if="event.importance === 'high'" class="importance-star">
                <i class="fas fa-star"></i>
              </div>
            </div>
            
            <!-- 下方穿孔 -->
            <div class="sprocket-holes bottom">
              <span v-for="i in 6" :key="'bottom-' + i" class="hole"></span>
            </div>
            
            <!-- 事件标题 -->
            <div class="frame-title">{{ event.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 进度指示器 -->
    <div class="progress-indicator" v-show="timelineEvents.length > 0">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">
        {{ currentIndex + 1 }} / {{ timelineEvents.length }}
      </div>
    </div>

    <!-- 详情卡片 -->
    <transition name="detail-slide">
      <div v-if="selectedEvent" class="detail-panel">
        <button @click="closeDetail" class="detail-close">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="detail-content">
          <div class="detail-header">
            <div class="detail-year">{{ selectedEvent.year }}</div>
            <h3 class="detail-title">{{ selectedEvent.title }}</h3>
          </div>
          
          <div class="detail-body">
            <p v-if="selectedEvent.description" class="detail-description">
              {{ selectedEvent.description }}
            </p>
            
            <div 
              v-if="selectedEvent.achievementsList && selectedEvent.achievementsList.length > 0" 
              class="detail-achievements"
            >
              <h4><i class="fas fa-trophy"></i> 重要成就</h4>
              <ul>
                <li v-for="(achievement, i) in selectedEvent.achievementsList" :key="i">
                  {{ achievement }}
                </li>
              </ul>
            </div>
            
            <div 
              v-if="selectedEvent.tagsList && selectedEvent.tagsList.length > 0" 
              class="detail-tags"
            >
              <span v-for="(tag, i) in selectedEvent.tagsList" :key="i" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FilmTimeline',
  props: {
    timelineEvents: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      selectedEvent: null,
      isDragging: false,
      dragStartX: 0,
      dragCurrentX: 0,
      scrollStartX: 0
    }
  },
  computed: {
    filmStripStyle() {
      const offset = this.currentIndex * 340
      return {
        transform: `translateX(-${offset}px)`
      }
    },
    progressPercentage() {
      if (this.timelineEvents.length === 0) return 0
      return ((this.currentIndex + 1) / this.timelineEvents.length) * 100
    }
  },
  methods: {
    selectFrame(index) {
      if (this.isDragging) return
      this.currentIndex = index
      this.selectedEvent = this.timelineEvents[index]
    },
    scrollFilm(direction) {
      if (direction === 'left' && this.currentIndex > 0) {
        this.currentIndex--
      } else if (direction === 'right' && this.currentIndex < this.timelineEvents.length - 1) {
        this.currentIndex++
      }
    },
    closeDetail() {
      this.selectedEvent = null
    },
    handleImageError(e) {
      e.target.style.display = 'none'
    },
    startDrag(e) {
      this.isDragging = true
      this.dragStartX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
      this.scrollStartX = this.currentIndex
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.endDrag)
      document.addEventListener('touchmove', this.onDrag)
      document.addEventListener('touchend', this.endDrag)
    },
    onDrag(e) {
      if (!this.isDragging) return
      this.dragCurrentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
      const diff = this.dragStartX - this.dragCurrentX
      const framesToMove = Math.round(diff / 340)
      const newIndex = Math.max(0, Math.min(this.timelineEvents.length - 1, this.scrollStartX + framesToMove))
      this.currentIndex = newIndex
    },
    endDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.endDrag)
      document.removeEventListener('touchmove', this.onDrag)
      document.removeEventListener('touchend', this.endDrag)
    }
  },
  mounted() {
    // 键盘导航
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.scrollFilm('left')
      } else if (e.key === 'ArrowRight') {
        this.scrollFilm('right')
      } else if (e.key === 'Escape') {
        this.closeDetail()
      }
    })
  }
}
</script>

<style scoped>
.film-timeline-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #2c2c2c 0%, #1a1a1a 100%);
  padding: 60px 20px 80px;
  position: relative;
  overflow: hidden;
}

/* 标题区域 */
.timeline-header {
  text-align: center;
  margin-bottom: 50px;
}

.timeline-title {
  font-size: 42px;
  font-weight: 700;
  color: #f5f5f5;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.timeline-title i {
  color: #fbbf24;
  font-size: 38px;
}

.timeline-subtitle {
  font-size: 16px;
  color: #999;
  margin: 0;
  font-family: 'Courier New', monospace;
}

/* 胶片轨道 */
.film-track-wrapper {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;
}

.film-track {
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
}

.film-strip {
  display: flex;
  gap: 20px;
  padding: 0 50px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: grab;
}

.film-strip:active {
  cursor: grabbing;
}

/* 单个胶片框 */
.film-frame {
  flex-shrink: 0;
  width: 320px;
  background: #3a3a3a;
  border-radius: 8px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.5;
  transform: scale(0.92);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  position: relative;
}

.film-frame:hover {
  opacity: 0.8;
  transform: scale(0.95) translateY(-8px);
}

.film-frame.active {
  opacity: 1;
  transform: scale(1) translateY(-15px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
  z-index: 10;
}

/* 重要事件金色边框 */
.film-frame.important::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
  border-radius: 10px;
  z-index: -1;
  opacity: 0.6;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.9; }
}

/* 穿孔 */
.sprocket-holes {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
}

.hole {
  width: 12px;
  height: 12px;
  background: #1a1a1a;
  border-radius: 2px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.8);
}

/* 胶片内容区 */
.frame-content {
  aspect-ratio: 16/10;
  position: relative;
  overflow: hidden;
  background: #2a2a2a;
  border-radius: 6px;
  margin: 6px 0;
}

/* 有图片的样式 */
.frame-image {
  width: 100%;
  height: 100%;
}

.frame-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.2) contrast(1.1);
  transition: filter 0.3s ease;
}

.film-frame.active .frame-image img {
  filter: sepia(0) contrast(1);
}

/* 无图片占位符 - 优化设计 */
.frame-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.placeholder-bg {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 渐变背景层 */
.gradient-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 50%, 
    #f093fb 100%
  );
  opacity: 0.8;
}

.film-frame.important .gradient-layer {
  background: linear-gradient(135deg, 
    #fbbf24 0%, 
    #f59e0b 50%, 
    #d97706 100%
  );
}

/* 图案层 */
.pattern-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.15;
}

.pattern-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  border: 3px solid white;
  border-radius: 50%;
}

.pattern-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, transparent 45%, white 45%, white 55%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, white 45%, white 55%, transparent 55%);
  background-size: 40px 40px;
  opacity: 0.3;
}

/* 年份大字显示 */
.year-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 56px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.2);
  font-family: 'Arial Black', sans-serif;
  letter-spacing: 2px;
  z-index: 1;
}

/* 图标层 */
.icon-layer {
  position: relative;
  z-index: 2;
  color: white;
  font-size: 42px;
  opacity: 0.9;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 年份角标 */
.frame-year-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.85);
  color: #fbbf24;
  padding: 6px 14px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 3;
}

/* 重要星标 */
.importance-star {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(251, 191, 36, 0.95);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  z-index: 3;
  animation: rotate-star 4s linear infinite;
}

@keyframes rotate-star {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 事件标题 */
.frame-title {
  padding: 14px 10px 10px;
  color: #e0e0e0;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  line-height: 1.4;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 导航箭头 */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(251, 191, 36, 0.9);
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(251, 191, 36, 0.4);
}

.nav-arrow.left {
  left: 20px;
}

.nav-arrow.right {
  right: 20px;
}

.nav-arrow:hover:not(:disabled) {
  background: rgba(251, 191, 36, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.6);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 进度指示器 */
.progress-indicator {
  max-width: 600px;
  margin: 40px auto 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 5px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
}

.progress-text {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  color: #fbbf24;
  min-width: 70px;
  text-align: right;
}

/* 详情面板 */
.detail-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 45px;
  max-height: 65vh;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.5);
}

.detail-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-close:hover {
  background: #e0e0e0;
  color: #333;
  transform: rotate(90deg);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid #f0f0f0;
}

.detail-year {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 22px;
  border-radius: 10px;
  font-size: 28px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.detail-title {
  flex: 1;
  font-size: 30px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

.detail-description {
  font-size: 17px;
  line-height: 1.9;
  color: #444;
  margin-bottom: 30px;
  text-align: justify;
}

.detail-achievements h4 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-achievements h4 i {
  color: #fbbf24;
}

.detail-achievements ul {
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
}

.detail-achievements li {
  padding: 12px 0 12px 35px;
  position: relative;
  font-size: 16px;
  line-height: 1.7;
  color: #555;
  border-bottom: 1px dashed #e0e0e0;
}

.detail-achievements li:last-child {
  border-bottom: none;
}

.detail-achievements li::before {
  content: '◆';
  position: absolute;
  left: 10px;
  color: #667eea;
  font-weight: bold;
  font-size: 14px;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.detail-tags .tag {
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 3px 8px rgba(139, 92, 246, 0.3);
}

/* 过渡动画 */
.detail-slide-enter-active, .detail-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-slide-enter-from, .detail-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .timeline-title {
    font-size: 32px;
  }
  
  .film-strip {
    padding: 0 20px;
  }
  
  .film-frame {
    width: 280px;
  }
  
  .nav-arrow {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
  
  .detail-panel {
    padding: 35px 20px;
  }
  
  .detail-year {
    font-size: 22px;
    padding: 10px 16px;
  }
  
  .detail-title {
    font-size: 24px;
  }
}
</style>
