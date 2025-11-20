<template>
  <div class="timeline-flip-book">
    <!-- 翻页容器 -->
    <div class="book-wrap" ref="bookWrap">
      <!-- 页面堆栈 -->
      <div
        v-for="(event, index) in visibleEvents"
        :key="event.event_id"
        :class="['page', `page-${index}`, { flipped: flippedPages.includes(index) }]"
        :data-index="index"
        :style="getPageStyle(index)"
        @pointerdown="onPointerDown($event, index)"
      >
        <!-- 正面 -->
        <div class="face front">
          <div class="page-content">
            <!-- 时间标签 -->
            <div class="timeline-year">{{ event.year }}</div>
            
            <!-- 标题 -->
            <h1 class="event-title">{{ event.title }}</h1>
            
            <!-- 分类标签 -->
            <div class="event-category">
              <i :class="getCategoryIcon(event.event_category)"></i>
              <span>{{ getCategoryName(event.event_category) }}</span>
            </div>
            
            <!-- 描述内容 -->
            <div class="event-description">
              <p>{{ event.description }}</p>
            </div>
            
            <!-- 重要性标识 -->
            <div v-if="event.importance === 'high'" class="importance-badge">
              <i class="fas fa-star"></i>
              <span>重要事件</span>
            </div>
            
            <!-- 底部提示 -->
            <div class="flip-hint" v-if="index === currentPageIndex">
              <i class="fas fa-hand-pointer"></i>
              <span>向上拖动翻页</span>
            </div>
          </div>
          
          <!-- 背景装饰 -->
          <div class="page-decoration">
            <div class="decoration-circle"></div>
            <div class="decoration-line"></div>
          </div>
        </div>

        <!-- 背面 -->
        <div class="face back">
          <div class="page-content">
            <!-- 时间标签 -->
            <div class="timeline-year back-year">{{ event.year }}</div>
            
            <!-- 背面标题 -->
            <h2 class="back-title">更多信息</h2>
            
            <!-- 人物名称 -->
            <div class="person-info">
              <i class="fas fa-user-circle"></i>
              <span>{{ event.person_name }}</span>
            </div>
            
            <!-- 数据来源 -->
            <div class="event-meta">
              <div class="meta-item">
                <i class="fas fa-tag"></i>
                <span>{{ event.event_category }}</span>
              </div>
              <div class="meta-item" v-if="event.source">
                <i class="fas fa-book"></i>
                <span>{{ event.source }}</span>
              </div>
            </div>
            
            <!-- 继续提示 -->
            <div class="continue-hint">
              <i class="fas fa-arrow-down"></i>
              <span>继续向上翻阅下一页</span>
            </div>
          </div>
        </div>

        <!-- 阴影层 -->
        <div class="page-shadow"></div>
      </div>

      <!-- 完成提示 -->
      <div v-if="allPagesFlipped" class="completion-message">
        <i class="fas fa-check-circle"></i>
        <h2>已阅读完所有事件</h2>
        <p>共 {{ totalEvents }} 个重要时刻</p>
        <button @click="resetBook" class="reset-btn">
          <i class="fas fa-redo"></i>
          重新阅读
        </button>
      </div>

      <!-- 加载提示 -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>加载时间线数据...</p>
      </div>
    </div>

    <!-- 进度指示器 -->
    <div class="progress-indicator">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">
        {{ currentPageIndex + 1 }} / {{ totalEvents }}
      </div>
    </div>

    <!-- 操作提示 -->
    <div class="hint-panel">
      <div class="hint-item">
        <i class="fas fa-hand-pointer"></i>
        <span>拖动翻页</span>
      </div>
      <div class="hint-item">
        <i class="fas fa-keyboard"></i>
        <span>↑键快捷翻页</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimelineFlipBook',
  props: {
    personId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      events: [],
      flippedPages: [],
      currentPageIndex: 0,
      loading: true,
      
      // 拖动状态
      active: null,
      startY: 0,
      dragging: false,
      lastAngle: 0,
      
      // 配置
      flipThresholdAngle: 60,
      minFlipDistance: 24,
      maxVisiblePages: 3
    }
  },
  computed: {
    visibleEvents() {
      return this.events.slice(0, this.currentPageIndex + this.maxVisiblePages)
    },
    totalEvents() {
      return this.events.length
    },
    allPagesFlipped() {
      return this.flippedPages.length === this.totalEvents && this.totalEvents > 0
    },
    progressPercentage() {
      if (this.totalEvents === 0) return 0
      return (this.currentPageIndex / this.totalEvents) * 100
    }
  },
  async mounted() {
    await this.loadEvents()
    this.attachEvents()
  },
  beforeUnmount() {
    this.detachEvents()
  },
  methods: {
    async loadEvents() {
      this.loading = true
      try {
        const response = await fetch(`http://localhost:8080/api/person/${this.personId}/events`)
        if (!response.ok) throw new Error('加载失败')
        
        const result = await response.json()
        const data = result.data || []
        this.events = data.sort((a, b) => a.sort_order - b.sort_order)
        
        console.log(`✅ 加载了 ${this.events.length} 个时间线事件`)
      } catch (error) {
        console.error('❌ 加载时间线事件失败:', error)
        this.events = []
      } finally {
        this.loading = false
      }
    },
    
    getPageStyle(index) {
      const offset = index - this.currentPageIndex
      if (offset < 0) return { display: 'none' }
      
      const zIndex = 30 - offset
      const translateY = offset * 8
      const scale = 1 - offset * 0.006
      
      return {
        zIndex,
        transform: `translateY(${translateY}px) scale(${scale})`
      }
    },
    
    getCategoryIcon(category) {
      const icons = {
        birth: 'fas fa-birthday-cake',
        education: 'fas fa-graduation-cap',
        career: 'fas fa-briefcase',
        honor: 'fas fa-trophy',
        achievement: 'fas fa-medal',
        death: 'fas fa-cross'
      }
      return icons[category] || 'fas fa-circle'
    },
    
    getCategoryName(category) {
      const names = {
        birth: '出生',
        education: '教育',
        career: '职业',
        honor: '荣誉',
        achievement: '成就',
        death: '逝世'
      }
      return names[category] || category
    },
    
    // 拖动相关方法
    onPointerDown(e, index) {
      if (index !== this.currentPageIndex) return
      if (this.flippedPages.includes(index)) return
      
      e.preventDefault()
      const targetPage = e.currentTarget
      
      this.active = targetPage
      this.active.setPointerCapture && this.active.setPointerCapture(e.pointerId)
      this.startY = e.clientY
      this.dragging = false
      this.lastAngle = 0
      
      this.active.style.transition = ''
      this.active.classList.add('dragging')
    },
    
    onPointerMove(e) {
      if (!this.active) return
      
      const dy = e.clientY - this.startY
      if (!this.dragging && Math.abs(dy) < this.minFlipDistance) return
      
      this.dragging = true
      e.preventDefault()
      
      const h = this.$refs.bookWrap.clientHeight
      let angle = -Math.max(0, Math.min(h, -dy)) / h * 180
      
      if (angle > 180) angle = 180
      if (angle < 0) angle = 0
      
      this.lastAngle = -angle
      this.applyAngle(this.active, -angle)
    },
    
    onPointerUp(e) {
      if (!this.active) return
      
      this.active.releasePointerCapture && this.active.releasePointerCapture(e.pointerId)
      
      if (!this.dragging) {
        this.resetPage(this.active)
        this.active = null
        return
      }
      
      const angleAbs = Math.abs(this.lastAngle)
      if (angleAbs >= this.flipThresholdAngle) {
        this.finishFlip(this.active, this.currentPageIndex)
      } else {
        this.resetPage(this.active)
      }
      
      this.dragging = false
      this.active = null
    },
    
    applyAngle(page, angle) {
      // 获取页面索引
      const index = parseInt(page.dataset.index)
      const offset = index - this.currentPageIndex
      const translateY = offset * 8
      const scale = 1 - offset * 0.006
      
      // 组合所有transform效果
      page.style.transform = `translateY(${translateY}px) scale(${scale}) rotateX(${angle}deg)`
      
      const shadow = page.querySelector('.page-shadow')
      if (shadow) {
        const opacity = Math.min(1, Math.abs(angle) / 90)
        shadow.style.opacity = (opacity * 0.9).toFixed(3)
      }
    },
    
    resetPage(page) {
      page.classList.remove('dragging')
      page.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1), opacity 300ms'
      this.applyAngle(page, 0)
      
      setTimeout(() => {
        page.style.transition = ''
        const shadow = page.querySelector('.page-shadow')
        if (shadow) shadow.style.opacity = 0
      }, 430)
    },
    
    finishFlip(page, index) {
      page.classList.add('flipped')
      page.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1), opacity 300ms'
      this.applyAngle(page, -180)
      
      this.flippedPages.push(index)
      this.currentPageIndex++
      
      setTimeout(() => {
        page.style.opacity = '0'
      }, 350)
      
      setTimeout(() => {
        page.style.display = 'none'
      }, 480)
    },
    
    attachEvents() {
      window.addEventListener('pointermove', this.onPointerMove, { passive: false })
      window.addEventListener('pointerup', this.onPointerUp)
      window.addEventListener('pointercancel', this.onPointerUp)
      document.addEventListener('keydown', this.onKeyDown)
    },
    
    detachEvents() {
      window.removeEventListener('pointermove', this.onPointerMove)
      window.removeEventListener('pointerup', this.onPointerUp)
      window.removeEventListener('pointercancel', this.onPointerUp)
      document.removeEventListener('keydown', this.onKeyDown)
    },
    
    onKeyDown(e) {
      if (e.key === 'ArrowUp' && this.currentPageIndex < this.totalEvents) {
        const topPage = this.$refs.bookWrap.querySelector(`.page-${this.currentPageIndex}`)
        if (topPage && !this.flippedPages.includes(this.currentPageIndex)) {
          this.finishFlip(topPage, this.currentPageIndex)
        }
      }
    },
    
    resetBook() {
      this.flippedPages = []
      this.currentPageIndex = 0
      
      const pages = this.$refs.bookWrap.querySelectorAll('.page')
      pages.forEach(page => {
        page.style.display = ''
        page.style.opacity = '1'
        page.classList.remove('flipped', 'dragging')
        page.style.transform = ''
        page.style.transition = ''
      })
    }
  }
}
</script>

<style scoped>
/* 容器样式 */
.timeline-flip-book {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f1724 0%, #071022 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

/* 翻页容器 */
.book-wrap {
  width: min(720px, 90vw);
  height: min(600px, 70vh);
  perspective: 1600px;
  position: relative;
}

/* 页面样式 */
.page {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform-origin: bottom center;
  transition: transform 420ms cubic-bezier(.2, .9, .3, 1), box-shadow 300ms, opacity 300ms;
  cursor: grab;
  user-select: none;
  touch-action: none;
  border-radius: 16px;
  will-change: transform, opacity;
}

.page:active {
  cursor: grabbing;
}

.page.dragging {
  cursor: grabbing;
  transition: none !important;
}

.page.flipped {
  transform: rotateX(-180deg) !important;
  pointer-events: none;
}

/* 正面与背面 */
.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.6);
}

.front {
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fb 100%);
  color: #0b1220;
}

.back {
  background: linear-gradient(135deg, #eaf0ff 0%, #d6e7ff 100%);
  color: #061233;
  transform: rotateX(180deg);
}

/* 页面内容 */
.page-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 时间标签 */
.timeline-year {
  font-size: 72px;
  font-weight: 900;
  color: transparent;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  margin-bottom: 20px;
  letter-spacing: -2px;
  line-height: 1;
}

.back-year {
  font-size: 48px;
  margin-bottom: 30px;
}

/* 事件标题 */
.event-title {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

/* 分类标签 */
.event-category {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 24px;
  width: fit-content;
}

.event-category i {
  font-size: 16px;
}

/* 描述内容 */
.event-description {
  flex: 1;
  font-size: 18px;
  line-height: 1.8;
  color: #444;
  margin-bottom: 20px;
}

.event-description p {
  margin: 0;
}

/* 重要性标识 */
.importance-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  width: fit-content;
  margin-bottom: 16px;
}

/* 翻页提示 */
.flip-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(102, 126, 234, 0.1);
  border: 2px dashed rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}

/* 背面样式 */
.back-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

.person-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.person-info i {
  font-size: 24px;
  color: #667eea;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #555;
}

.meta-item i {
  color: #667eea;
  width: 20px;
}

.continue-hint {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  color: #667eea;
  font-weight: 600;
}

/* 页面装饰 */
.page-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.1;
}

.decoration-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
  top: -100px;
  right: -100px;
}

.decoration-line {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(102, 126, 234, 0.3), transparent);
  left: 60px;
}

/* 阴影层 */
.page-shadow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(3, 9, 25, 0.55);
  opacity: 0;
  transition: opacity 250ms;
}

.page.dragging .page-shadow {
  opacity: 0.85;
}

/* 完成提示 */
.completion-message {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  text-align: center;
  padding: 40px;
}

.completion-message i {
  font-size: 80px;
  margin-bottom: 24px;
  animation: checkBounce 0.6s ease-out;
}

@keyframes checkBounce {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.completion-message h2 {
  font-size: 32px;
  margin: 0 0 12px 0;
}

.completion-message p {
  font-size: 18px;
  opacity: 0.9;
  margin: 0 0 32px 0;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  color: #667eea;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay p {
  font-size: 16px;
  font-weight: 600;
}

/* 进度指示器 */
.progress-indicator {
  margin-top: 40px;
  width: min(720px, 90vw);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.progress-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
}

/* 操作提示 */
.hint-panel {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  backdrop-filter: blur(10px);
}

.hint-item i {
  font-size: 14px;
}

/* 响应式 */
@media (max-width: 768px) {
  .timeline-year {
    font-size: 56px;
  }
  
  .event-title {
    font-size: 28px;
  }
  
  .event-description {
    font-size: 16px;
  }
  
  .hint-panel {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
