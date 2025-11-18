<template>
  <section class="timeline-preview-section">
    <div class="timeline-preview-container">
      <div class="timeline-header">
        <h2 class="timeline-title">历史时光轴</h2>
        <p class="timeline-subtitle">拖动探索学校发展历程</p>
      </div>
      
      <div class="timeline-track" ref="trackRef" @mousedown="handleDragStart" @touchstart="handleDragStart">
        <div 
          class="timeline-thumb" 
          :style="{ left: thumbPosition + 'px' }"
          ref="thumbRef"
        >
          <div class="thumb-handle"></div>
          <div class="thumb-year">{{ currentYear }}</div>
        </div>
        
        <div class="timeline-years">
          <div 
            v-for="(mark, index) in timelineMarks" 
            :key="index"
            class="year-mark"
            :style="{ left: (index / (timelineMarks.length - 1)) * 100 + '%' }"
            @click="jumpToYear(mark.year)"
          >
            <div class="mark-dot"></div>
            <div class="mark-year">{{ mark.year }}</div>
          </div>
        </div>
        
        <div class="timeline-preview-card" v-if="previewEvent" :style="{ right: previewCardRight + 'px' }">
          <div class="preview-image" v-if="previewEvent.image">
            <img :src="previewEvent.image" :alt="previewEvent.title" />
          </div>
          <div class="preview-content">
            <div class="preview-year">{{ previewEvent.year }}</div>
            <div class="preview-title">{{ previewEvent.title }}</div>
            <div class="preview-desc">{{ previewEvent.description }}</div>
            <button class="preview-btn" @click="goToTimeline">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TimelinePreview',
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isDragging: false,
      startX: 0,
      startLeft: 0,
      thumbPosition: 0,
      trackWidth: 0,
      previewEvent: null,
      previewCardRight: -320,
      timelineMarks: [
        { year: '1956', title: '建校', description: '成都地质勘探学院成立' },
        { year: '1958', title: '更名', description: '更名为成都地质学院' },
        { year: '1993', title: '发展', description: '更名为成都理工学院' },
        { year: '2001', title: '跨越', description: '正式更名为成都理工大学' },
        { year: '2017', title: '双一流', description: '地球科学进入世界一流学科建设' },
        { year: '2025', title: '现在', description: '持续发展，迈向新征程' }
      ]
    }
  },
  computed: {
    currentYear() {
      const progress = this.thumbPosition / this.trackWidth
      const startYear = 1956
      const endYear = 2025
      const year = Math.floor(startYear + progress * (endYear - startYear))
      return Math.max(startYear, Math.min(endYear, year))
    }
  },
  mounted() {
    this.updateTrackWidth()
    window.addEventListener('resize', this.updateTrackWidth)
    this.updatePreview()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateTrackWidth)
    document.removeEventListener('mousemove', this.handleDrag)
    document.removeEventListener('mouseup', this.handleDragEnd)
    document.removeEventListener('touchmove', this.handleDrag)
    document.removeEventListener('touchend', this.handleDragEnd)
  },
  methods: {
    updateTrackWidth() {
      if (this.$refs.trackRef) {
        this.trackWidth = this.$refs.trackRef.offsetWidth - 20
        this.thumbPosition = this.trackWidth * 0.3 // 初始位置在30%
      }
    },
    handleDragStart(e) {
      e.preventDefault()
      this.isDragging = true
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      this.startX = clientX
      this.startLeft = this.thumbPosition
      
      document.addEventListener('mousemove', this.handleDrag)
      document.addEventListener('mouseup', this.handleDragEnd)
      document.addEventListener('touchmove', this.handleDrag)
      document.addEventListener('touchend', this.handleDragEnd)
    },
    handleDrag(e) {
      if (!this.isDragging) return
      e.preventDefault()
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const deltaX = clientX - this.startX
      const trackRect = this.$refs.trackRef.getBoundingClientRect()
      const newPosition = this.startLeft + deltaX
      
      this.thumbPosition = Math.max(0, Math.min(this.trackWidth, newPosition))
      this.updatePreview()
    },
    handleDragEnd() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.handleDrag)
      document.removeEventListener('mouseup', this.handleDragEnd)
      document.removeEventListener('touchmove', this.handleDrag)
      document.removeEventListener('touchend', this.handleDragEnd)
    },
    jumpToYear(year) {
      const startYear = 1956
      const endYear = 2025
      const progress = (year - startYear) / (endYear - startYear)
      this.thumbPosition = progress * this.trackWidth
      this.updatePreview()
    },
    updatePreview() {
      // 根据当前位置找到最近的事件
      const year = this.currentYear
      const nearestMark = this.timelineMarks.reduce((prev, curr) => {
        return Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev
      })
      
      this.previewEvent = {
        year: nearestMark.year,
        title: nearestMark.title,
        description: nearestMark.description,
        image: null
      }
      
      // 计算预览卡片位置（在右侧显示）
      this.previewCardRight = -320
      if (this.thumbPosition < this.trackWidth * 0.7) {
        this.previewCardRight = 20
      }
    },
    goToTimeline() {
      this.$emit('navigate', 'timeline')
      this.$nextTick(() => {
        this.$router.push('/digital-history').catch(err => {
          // 忽略导航重复的错误
          if (err.name !== 'NavigationDuplicated') {
            console.error('路由跳转失败:', err)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.timeline-preview-section {
  padding: 60px 80px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 1;
}

.timeline-preview-container {
  max-width: 1200px;
  margin: 0 auto;
}

.timeline-header {
  text-align: center;
  margin-bottom: 40px;
}

.timeline-title {
  font-size: 2rem;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.timeline-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.timeline-track {
  position: relative;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  padding: 0 10px;
  cursor: grab;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.timeline-track:active {
  cursor: grabbing;
}

.timeline-thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  z-index: 10;
}

.timeline-thumb:hover {
  transform: translateY(-50%) translateX(-50%) scale(1.1);
}

.timeline-thumb:active {
  cursor: grabbing;
}

.thumb-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-handle::before {
  content: '';
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
}

.thumb-year {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: 700;
  color: white;
  background: rgba(102, 126, 234, 0.9);
  padding: 4px 12px;
  border-radius: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.timeline-years {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.year-mark {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  cursor: pointer;
  pointer-events: all;
  transition: transform 0.2s ease;
}

.year-mark:hover {
  transform: translateY(-50%) translateX(-50%) scale(1.2);
}

.mark-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  margin: 0 auto 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.mark-year {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

.timeline-preview-card {
  position: absolute;
  top: -180px;
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: right 0.3s ease;
  z-index: 20;
}

.preview-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-content {
  padding: 20px;
}

.preview-year {
  font-size: 12px;
  color: #667eea;
  font-weight: 700;
  margin-bottom: 8px;
}

.preview-title {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.preview-desc {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 16px;
  line-height: 1.5;
}

.preview-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.preview-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .timeline-preview-section {
    padding: 40px 20px;
  }
  
  .timeline-track {
    height: 60px;
  }
  
  .timeline-thumb {
    width: 50px;
    height: 50px;
  }
  
  .timeline-preview-card {
    width: 280px;
    top: -160px;
  }
}
</style>

