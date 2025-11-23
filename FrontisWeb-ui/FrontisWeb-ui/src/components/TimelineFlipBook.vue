<template>
  <div class="timeline-flip-book">
    <!-- 翻页容器 -->
    <div class="book-wrap" ref="bookWrap">
      <!-- 日历式旋转轴 -->
      <div class="calendar-binding">
        <div class="binding-spiral">
          <div class="spiral-ring" v-for="n in 15" :key="n"></div>
        </div>
        <div class="binding-shadow"></div>
      </div>
      
      <!-- 页面堆栈 -->
      <div
        v-for="(event, index) in visibleEvents"
        :key="event.event_id"
        :class="['page', `page-${index}`, { flipped: flippedPages.includes(index) }]"
        :data-index="index"
        :style="getPageStyle(index)"
        @pointerdown="onPointerDown($event, index)"
      >
        <!-- 装订孔 -->
        <div class="binding-holes">
          <div class="hole" v-for="n in 15" :key="n"></div>
        </div>
        
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
              <span>👆向上翻页 👇向下返回</span>
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
              <i class="fas fa-arrow-up"></i>
              <span>继续向上翻阅下一页</span>
            </div>
          </div>
        </div>

        <!-- 阴影层 -->
        <div class="page-shadow"></div>
      </div>

      <!-- 循环提示 -->
      <div v-if="allPagesRead && enableLoop" class="loop-message">
        <i class="fas fa-sync-alt"></i>
        <span>已阅读所有事件，继续翻页可循环浏览</span>
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
        <span v-if="currentPageIndex < totalEvents">第 {{ currentPageIndex + 1 }} 页 / 共 {{ totalEvents }} 页</span>
        <span v-else>已浏览完所有事件（支持循环）</span>
      </div>
    </div>

    <!-- 操作提示 -->
    <div class="hint-panel">
      <div class="hint-item">
        <i class="fas fa-hand-pointer"></i>
        <span>拖动翻页（支持双向）</span>
      </div>
      <div class="hint-item">
        <i class="fas fa-keyboard"></i>
        <span>↑/↓键翻页（循环）</span>
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
      currentPageIndex: 0,
      loading: true,
      
      // 拖动状态
      active: null,
      activeIndex: -1,
      startY: 0,
      dragging: false,
      lastAngle: 0,
      dragDirection: 0, // 1: 向前, -1: 向后
      
      // 配置
      flipThresholdAngle: 60,
      minFlipDistance: 24,
      enableLoop: true // 启用循环
    }
  },
  computed: {
    visibleEvents() {
      return this.events
    },
    totalEvents() {
      return this.events.length
    },
    allPagesRead() {
      return this.currentPageIndex === this.totalEvents && this.totalEvents > 0
    },
    progressPercentage() {
      if (this.totalEvents === 0) return 0
      return (this.currentPageIndex / this.totalEvents) * 100
    },
    canGoForward() {
      return this.enableLoop || this.currentPageIndex < this.totalEvents
    },
    canGoBack() {
      return this.enableLoop || this.currentPageIndex > 0
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
      
      // 上一页（已翻过，但可以拖回来）
      if (offset === -1) {
        return {
          zIndex: 25,
          transform: `translateY(0px) scale(1) rotateX(180deg)`,
          opacity: 0.5,
          pointerEvents: 'auto'
        }
      }
      
      // 更早的页面
      if (offset < -1) {
        return {
          zIndex: 10 + offset,
          transform: `translateY(0px) scale(1) rotateX(180deg)`,
          opacity: 0,
          pointerEvents: 'none'
        }
      }
      
      // 当前及后续页面
      const zIndex = 30 - offset
      const translateY = offset * 8
      const scale = 1 - offset * 0.006
      
      return {
        zIndex,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity: offset > 2 ? 0 : 1
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
      // 允许拖动当前页或上一页（用于返回）
      if (index !== this.currentPageIndex && index !== this.currentPageIndex - 1) return
      
      e.preventDefault()
      const targetPage = e.currentTarget
      
      this.active = targetPage
      this.activeIndex = index
      this.active.setPointerCapture && this.active.setPointerCapture(e.pointerId)
      this.startY = e.clientY
      this.dragging = false
      this.lastAngle = 0
      this.dragDirection = 0
      
      this.active.style.transition = ''
      this.active.classList.add('dragging')
      this.active.style.pointerEvents = 'auto'
    },
    
    onPointerMove(e) {
      if (!this.active) return
      
      const dy = e.clientY - this.startY
      if (!this.dragging && Math.abs(dy) < this.minFlipDistance) return
      
      this.dragging = true
      e.preventDefault()
      
      const h = this.$refs.bookWrap.clientHeight
      
      // 判断拖动方向
      if (this.activeIndex === this.currentPageIndex) {
        // 拖动当前页：向上翻到下一页
        if (dy < 0 && this.canGoForward) {
          const distance = Math.max(0, Math.min(h, -dy))
          let angle = (distance / h) * 180
          this.dragDirection = 1
          this.lastAngle = angle
          this.applyAngle(this.active, angle)
        }
      } else if (this.activeIndex === this.currentPageIndex - 1) {
        // 拖动上一页：向下翻回上一页
        if (dy > 0 && this.canGoBack) {
          const distance = Math.max(0, Math.min(h, dy))
          let angle = 180 - (distance / h) * 180
          this.dragDirection = -1
          this.lastAngle = angle
          this.applyAngle(this.active, angle)
        }
      }
    },
    
    onPointerUp(e) {
      if (!this.active) return
      
      this.active.releasePointerCapture && this.active.releasePointerCapture(e.pointerId)
      
      if (!this.dragging) {
        this.resetPage(this.active)
        this.active = null
        this.activeIndex = -1
        return
      }
      
      const angleAbs = Math.abs(this.lastAngle)
      
      if (this.dragDirection === 1) {
        // 向前翻页
        if (this.lastAngle >= this.flipThresholdAngle) {
          this.finishFlipForward(this.active)
        } else {
          this.resetPage(this.active)
        }
      } else if (this.dragDirection === -1) {
        // 向后翻页
        if (this.lastAngle <= 180 - this.flipThresholdAngle) {
          this.finishFlipBackward(this.active)
        } else {
          this.resetPage(this.active)
        }
      }
      
      this.dragging = false
      this.active = null
      this.activeIndex = -1
      this.dragDirection = 0
    },
    
    applyAngle(page, angle) {
      // 获取页面索引
      const index = parseInt(page.dataset.index)
      const offset = index - this.currentPageIndex
      
      // 对于已翻过的页面（上一页），保持在原位
      if (offset === -1) {
        page.style.transform = `translateY(0px) scale(1) rotateX(${angle}deg)`
      } else {
        // 当前及后续页面的堆叠效果
        const translateY = offset * 8
        const scale = 1 - offset * 0.006
        page.style.transform = `translateY(${translateY}px) scale(${scale}) rotateX(${angle}deg)`
      }
      
      const shadow = page.querySelector('.page-shadow')
      if (shadow) {
        const opacity = Math.min(1, Math.abs(angle) / 90)
        shadow.style.opacity = (opacity * 0.9).toFixed(3)
      }
    },
    
    resetPage(page) {
      page.classList.remove('dragging')
      page.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1), opacity 300ms'
      
      const index = parseInt(page.dataset.index)
      const offset = index - this.currentPageIndex
      
      if (offset === -1) {
        // 重置上一页回到180度
        this.applyAngle(page, 180)
      } else {
        // 重置当前页回到0度
        this.applyAngle(page, 0)
      }
      
      setTimeout(() => {
        page.style.transition = ''
        const shadow = page.querySelector('.page-shadow')
        if (shadow) shadow.style.opacity = 0
      }, 430)
    },
    
    finishFlipForward(page) {
      page.classList.remove('dragging')
      page.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1), opacity 300ms'
      this.applyAngle(page, 180)
      
      setTimeout(() => {
        this.currentPageIndex++
        
        // 循环逻辑
        if (this.enableLoop && this.currentPageIndex >= this.totalEvents) {
          this.currentPageIndex = 0
        }
      }, 250)
    },
    
    finishFlipBackward(page) {
      page.classList.remove('dragging')
      page.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1), opacity 300ms'
      this.applyAngle(page, 0)
      
      setTimeout(() => {
        this.currentPageIndex--
        
        // 循环逻辑
        if (this.enableLoop && this.currentPageIndex < 0) {
          this.currentPageIndex = this.totalEvents - 1
        }
      }, 250)
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
      if (e.key === 'ArrowUp' && this.canGoForward) {
        // 向前翻页
        const currentPage = this.$refs.bookWrap.querySelector(`.page-${this.currentPageIndex}`)
        if (currentPage) {
          this.finishFlipForward(currentPage)
        }
      } else if (e.key === 'ArrowDown' && this.canGoBack) {
        // 向后翻页
        const prevPage = this.$refs.bookWrap.querySelector(`.page-${this.currentPageIndex - 1}`)
        if (prevPage) {
          this.finishFlipBackward(prevPage)
        }
      }
    },
    
    resetBook() {
      this.currentPageIndex = 0
      
      const pages = this.$refs.bookWrap.querySelectorAll('.page')
      pages.forEach(page => {
        page.classList.remove('dragging')
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
  padding-top: 50px;
}

/* 日历式旋转轴 */
.calendar-binding {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 50px;
  z-index: 100;
  pointer-events: none;
}

.binding-spiral {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.spiral-ring {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #a8a8a8 100%);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.5),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
}

.spiral-ring::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, #2a2a2a 0%, #1a1a1a 70%);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.8);
}

.binding-shadow {
  position: absolute;
  top: 35px;
  left: 0;
  width: 100%;
  height: 15px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.05) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  filter: blur(3px);
}

/* 页面样式 */
.page {
  position: absolute;
  left: 0;
  top: 50px;
  width: 100%;
  height: calc(100% - 50px);
  transform-style: preserve-3d;
  transform-origin: top center;
  transition: transform 420ms cubic-bezier(.2, .9, .3, 1), box-shadow 300ms, opacity 300ms;
  cursor: grab;
  user-select: none;
  touch-action: none;
  border-radius: 0 0 16px 16px;
  will-change: transform, opacity;
}

.page::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 10px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.05), transparent);
  z-index: -1;
}

/* 装订孔 */
.binding-holes {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 30px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  z-index: 10;
  pointer-events: none;
}

.hole {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle, #d0d0d0 0%, #f5f5f5 40%, #fff 100%);
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.3),
    0 1px 1px rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.page:active {
  cursor: grabbing;
}

.page.dragging {
  cursor: grabbing;
  transition: none !important;
}

.page.flipped {
  transform: rotateX(180deg) !important;
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

/* 循环提示 */
.loop-message {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 50;
  animation: slideUp 0.5s ease-out;
}

.loop-message i {
  font-size: 16px;
  animation: rotate 2s linear infinite;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
