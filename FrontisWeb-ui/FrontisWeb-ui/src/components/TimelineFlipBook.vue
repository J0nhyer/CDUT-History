<template>
  <div class="timeline-flip-book">
    <!-- 翻页容器 -->
    <div class="book-wrap" ref="bookWrap">
      <!-- 页面堆栈 -->
      <div
        v-for="(event, index) in visibleEvents"
        :key="event.event_id"
        :class="['page', `page-${index}`]"
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
            
            <!-- 底部提示 - 已隐藏 -->
            <!-- <div class="flip-hint" v-if="index === currentPageIndex">
              <i class="fas fa-hand-pointer"></i>
              <span>👆向上翻页 👇向下返回</span>
            </div> -->
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
            
            <!-- 继续提示 - 已隐藏 -->
            <!-- <div class="continue-hint">
              <i class="fas fa-arrow-up"></i>
              <span>继续向上翻阅下一页</span>
            </div> -->
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
        <span>拖动翻页</span>
      </div>
      <!-- 键盘翻页功能已移除，不再显示键盘提示 -->
      <!-- <div class="hint-item">
        <i class="fas fa-keyboard"></i>
        <span>↑/↓键翻页（循环）</span>
      </div> -->
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
      flipThresholdAngle: 120,  // 360度翻转需要更大的阈值（原来180度用60，现在360度用120）
      minFlipDistance: 24,
      enableLoop: true // 启用循环
    }
  },
  computed: {
    visibleEvents() {
      console.log('🔍 visibleEvents computed, events count:', this.events.length)
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
    console.log('📦 TimelineFlipBook mounted, personId:', this.personId)
    await this.loadEvents()
    console.log('✅ Events loaded:', this.events.length, 'events')
    console.log('📋 First event:', this.events[0])
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
      
      // 上一页（已翻过360度，隐藏在下方，但可以拖回来）
      if (offset === -1) {
        return {
          zIndex: 25,
          transform: `translateY(0px) scale(1) rotateX(0deg)`,  // 360度后回到0度
          opacity: 0.3,  // 降低透明度
          pointerEvents: 'auto'
        }
      }
      
      // 更早的页面（完全隐藏）
      if (offset < -1) {
        return {
          zIndex: 10 + offset,
          transform: `translateY(0px) scale(0.95) rotateX(0deg)`,
          opacity: 0,
          pointerEvents: 'none'
        }
      }
      
      // 当前及后续页面
      const zIndex = 30 - offset
      const translateY = offset * 4  // 减少Y偏移，从8px改为4px，减少层级间隙
      const scale = 1 - offset * 0.006
      
      return {
        zIndex,
        transform: `translateY(${translateY}px) scale(${scale}) rotateX(0deg)`,
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
        // 拖动当前页：向上翻到下一页（360度翻转）
        if (dy < 0 && this.canGoForward) {
          const distance = Math.max(0, Math.min(h, -dy))
          let angle = (distance / h) * 360  // 改为360度完整翻转
          this.dragDirection = 1
          this.lastAngle = angle
          this.applyAngle(this.active, angle)
        }
      } else if (this.activeIndex === this.currentPageIndex - 1) {
        // 拖动上一页：向下翻回上一页（360度翻转）
        if (dy > 0 && this.canGoBack) {
          const distance = Math.max(0, Math.min(h, dy))
          let angle = -360 + (distance / h) * 360  // 从-360度翻回到0度
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
        // 向前翻页（0到360度）
        if (this.lastAngle >= this.flipThresholdAngle) {
          this.finishFlipForward(this.active)
        } else {
          this.resetPage(this.active)
        }
      } else if (this.dragDirection === -1) {
        // 向后翻页（-360到0度）
        if (this.lastAngle <= -this.flipThresholdAngle) {
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
      
      // 动态调整z-index：翻过180度后移到最底层（优化：只在跨越临界点时改变）
      const currentZIndex = parseInt(page.style.zIndex) || 50
      const targetZIndex = Math.abs(angle) >= 180 ? 5 : 50
      
      if (currentZIndex !== targetZIndex) {
        page.style.zIndex = targetZIndex
      }
      
      // 对于已翻过的页面（上一页），保持在原位
      if (offset === -1) {
        page.style.transform = `translateY(0px) scale(1) rotateX(${angle}deg)`
      } else {
        // 当前及后续页面的堆叠效果
        const translateY = offset * 4  // 与getPageStyle保持一致，从8改为4
        const scale = 1 - offset * 0.006
        
        // 在旋转时添加轻微的translateZ，让页面远离视角，减少突起
        const translateZ = Math.abs(angle) > 0 ? -Math.abs(Math.sin(angle * Math.PI / 180)) * 30 : 0
        page.style.transform = `translateY(${translateY}px) translateZ(${translateZ}px) scale(${scale}) rotateX(${angle}deg)`
      }
      
      const shadow = page.querySelector('.page-shadow')
      if (shadow) {
        // 360度翻转，阴影在180度时最大
        const opacity = Math.min(1, Math.abs(angle) / 180)
        shadow.style.opacity = (opacity * 0.9).toFixed(3)
      }
    },
    
    resetPage(page) {
      page.classList.remove('dragging')
      page.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1), opacity 300ms'
      
      const index = parseInt(page.dataset.index)
      const offset = index - this.currentPageIndex
      
      // 重置回到0度，使用平滑动画
      this.applyAngle(page, 0)
      
      // 使用requestAnimationFrame避免卡顿
      setTimeout(() => {
        requestAnimationFrame(() => {
          // 清除inline样式，让Vue的getPageStyle接管
          page.style.transition = ''
          page.style.transform = ''
          page.style.zIndex = ''
          
          // 清除阴影
          const shadow = page.querySelector('.page-shadow')
          if (shadow) shadow.style.opacity = 0
          
          // 强制Vue重新应用正确的样式
          this.$forceUpdate()
        })
      }, 420)
    },
    
    finishFlipForward(page) {
      page.classList.remove('dragging')
      page.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1), opacity 300ms'
      
      // 使用requestAnimationFrame确保transition先生效，再设置transform，触发动画
      requestAnimationFrame(() => {
        this.applyAngle(page, 360)  // 改为360度，完整翻转一圈
      })
      
      // 使用requestAnimationFrame避免卡顿
      setTimeout(() => {
        requestAnimationFrame(() => {
          // 先更新索引（Vue响应式）
          this.currentPageIndex++
          
          // 循环逻辑
          if (this.enableLoop && this.currentPageIndex >= this.totalEvents) {
            this.currentPageIndex = 0
          }
          
          // 在下一帧清除样式，避免卡顿
          requestAnimationFrame(() => {
            // 清除inline样式，让Vue的getPageStyle接管
            page.style.transition = ''
            page.style.transform = ''
            page.style.zIndex = ''
            
            // 清除阴影
            const shadow = page.querySelector('.page-shadow')
            if (shadow) shadow.style.opacity = 0
            
            // 强制Vue重新应用正确的样式
            this.$forceUpdate()
          })
        })
      }, 420)
    },
    
    finishFlipBackward(page) {
      page.classList.remove('dragging')
      page.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1), opacity 300ms'
      
      // 使用requestAnimationFrame确保transition先生效，再设置transform，触发动画
      requestAnimationFrame(() => {
        this.applyAngle(page, -360)  // 向后翻转也是360度（负方向）
      })
      
      // 使用requestAnimationFrame避免卡顿
      setTimeout(() => {
        requestAnimationFrame(() => {
          // 先更新索引（Vue响应式）
          this.currentPageIndex--
          
          // 循环逻辑
          if (this.enableLoop && this.currentPageIndex < 0) {
            this.currentPageIndex = this.totalEvents - 1
          }
          
          // 在下一帧清除样式，避免卡顿
          requestAnimationFrame(() => {
            // 清除inline样式，让Vue的getPageStyle接管
            page.style.transition = ''
            page.style.transform = ''
            page.style.zIndex = ''
            
            // 清除阴影
            const shadow = page.querySelector('.page-shadow')
            if (shadow) shadow.style.opacity = 0
            
            // 强制Vue重新应用正确的样式
            this.$forceUpdate()
          })
        })
      }, 420)
    },
    
    attachEvents() {
      window.addEventListener('pointermove', this.onPointerMove, { passive: false })
      window.addEventListener('pointerup', this.onPointerUp)
      window.addEventListener('pointercancel', this.onPointerUp)
      // document.addEventListener('keydown', this.onKeyDown)  // 已禁用键盘交互
    },
    
    detachEvents() {
      window.removeEventListener('pointermove', this.onPointerMove)
      window.removeEventListener('pointerup', this.onPointerUp)
      window.removeEventListener('pointercancel', this.onPointerUp)
      // document.removeEventListener('keydown', this.onKeyDown)  // 已禁用键盘交互
    },
    
    // onKeyDown(e) {
    //   if (e.key === 'ArrowUp' && this.canGoForward) {
    //     // 向前翻页
    //     const currentPage = this.$refs.bookWrap.querySelector(`.page-${this.currentPageIndex}`)
    //     if (currentPage) {
    //       this.finishFlipForward(currentPage)
    //     }
    //   } else if (e.key === 'ArrowDown' && this.canGoBack) {
    //     // 向后翻页
    //     const prevPage = this.$refs.bookWrap.querySelector(`.page-${this.currentPageIndex - 1}`)
    //     if (prevPage) {
    //       this.finishFlipBackward(prevPage)
    //     }
    //   }
    // },
    
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
  min-height: 100vh; /* 保持100vh，让页面居中显示 */
  background: #000000; /* 纯黑色背景 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px; /* 从40px改为30px，适度减少间距 */
  position: relative;
}

/* 翻页容器 */
.book-wrap {
  width: min(720px, 90vw);
  height: min(480px, 55vh); /* 调小高度：600px→480px，70vh→55vh */
  perspective: 2000px; /* 增大透视距离，减少变形 */
  perspective-origin: 50% 80%; /* 调整视角到更低的位置，减少突起 */
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
  transform-origin: 50% 0%; /* 精确定位到顶部边缘中心，减少突起 */
  transition: none; /* 移除默认transition，避免翻页后的额外动画 */
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
  padding: 30px; /* 从40px调小到30px，更紧凑 */
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
  font-size: 56px; /* 从72px调小到56px */
  font-weight: 900;
  color: transparent;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  margin-bottom: 16px; /* 从20px调小到16px */
  letter-spacing: -2px;
  line-height: 1;
}

.back-year {
  font-size: 38px; /* 从48px调小到38px */
  margin-bottom: 24px; /* 从30px调小到24px */
}

/* 事件标题 */
.event-title {
  font-size: 28px; /* 从36px调小到28px */
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0; /* 从20px调小到16px */
  line-height: 1.3;
}

/* 分类标签 */
.event-category {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px; /* 从8px 16px调小到6px 14px */
  background: rgba(102, 126, 234, 0.1);
  border-radius: 20px;
  font-size: 13px; /* 从14px调小到13px */
  font-weight: 600;
  color: #667eea;
  margin-bottom: 18px; /* 从24px调小到18px */
  width: fit-content;
}

.event-category i {
  font-size: 16px;
}

/* 描述内容 */
.event-description {
  flex: 1;
  font-size: 16px; /* 从18px调小到16px */
  line-height: 1.7; /* 从1.8调小到1.7 */
  color: #444;
  margin-bottom: 16px; /* 从20px调小到16px */
}

.event-description p {
  margin: 0;
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
  transition: none; /* 移除transition，避免额外动画 */
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
  bottom: 80px; /* 从30px改为80px，往上移动50px */
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
