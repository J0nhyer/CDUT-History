<template>
  <div class="draw-reveal-page">
    <!-- 背景渐变 -->
    <div class="background-gradient"></div>
    
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack" title="返回首页">
      <i class="fas fa-arrow-left"></i>
    </button>

    <!-- 模式选择器 -->
    <div class="mode-selector">
      <button 
        class="mode-btn" 
        :class="{ active: drawMode === 'person' }"
        @click="changeMode('person')"
        title="画人物">
        <i class="fas fa-user"></i>
        <span>画人物</span>
      </button>
      <button 
        class="mode-btn" 
        :class="{ active: drawMode === 'event' }"
        @click="changeMode('event')"
        title="画学校">
        <i class="fas fa-school"></i>
        <span>画学校</span>
      </button>
    </div>

    <!-- 画笔工具栏 -->
    <div class="toolbar">
      <button class="toolbar-toggle" @click="showToolbar = !showToolbar" title="画笔工具">
        <i class="fas fa-palette"></i>
      </button>
      
      <div v-if="showToolbar" class="toolbar-panel">
        <!-- 画笔颜色 -->
        <div class="tool-section">
          <label>画笔颜色</label>
          <div class="color-picker">
            <div v-for="color in colors" :key="color" 
                 class="color-item" 
                 :class="{ active: strokeColor === color }"
                 :style="{ backgroundColor: color }"
                 @click="changeColor(color)">
            </div>
            <div class="custom-color-wrapper" title="自定义颜色">
              <input type="color" v-model="strokeColor" @change="updateBrush" class="custom-color-input">
              <div class="custom-color-display"></div>
            </div>
          </div>
        </div>

        <!-- 画笔粗细 -->
        <div class="tool-section">
          <label>画笔粗细 ({{ lineWidth }}px)</label>
          <input type="range" v-model="lineWidth" @input="updateBrush" min="1" max="20" class="slider">
        </div>

        <!-- 画笔种类 -->
        <div class="tool-section">
          <label>画笔种类</label>
          <div class="brush-types">
            <button v-for="type in brushTypes" :key="type.value" 
                    class="brush-btn"
                    :class="{ active: brushType === type.value }"
                    @click="changeBrushType(type.value)"
                    :title="type.name">
              <i :class="type.icon"></i>
            </button>
          </div>
        </div>

        <!-- 背景颜色 -->
        <div class="tool-section">
          <label>背景颜色</label>
          <div class="color-picker">
            <div v-for="bg in backgrounds" :key="bg" 
                 class="color-item" 
                 :class="{ active: backgroundColor === bg }"
                 :style="{ backgroundColor: bg }"
                 @click="changeBackground(bg)">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 画布区域 - 全屏 -->
    <div class="canvas-wrapper">
      <canvas 
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="stopDrawing"
      ></canvas>
      
      <!-- 画布提示 -->
      <div v-if="!hasDrawn" class="canvas-hint">
        <i class="fas fa-paint-brush"></i>
        <p>一笔一划绘出成理色彩...</p>
      </div>
    </div>

    <!-- 控制按钮 - 右下角 -->
    <div class="control-buttons">
      <button class="control-btn undo-btn" @click="undo" :disabled="pathHistory.length === 0" title="撤销">
        <i class="fas fa-undo"></i>
      </button>
      <button class="control-btn clear-btn" @click="clearCanvas" title="清空">
        <i class="fas fa-eraser"></i>
      </button>
      <button class="control-btn submit-btn" @click="submitDrawing" :disabled="!hasDrawn" title="提交涂鸦">
        <i class="fas fa-magic"></i>
      </button>
    </div>

    <!-- 结果卡片弹窗 -->
    <transition name="card-fade">
      <div v-if="showResultCard" class="result-overlay" @click="closeResultCard">
        <div class="result-card" @click.stop>
          <button class="close-btn" @click="closeResultCard">
            <i class="fas fa-times"></i>
          </button>
          
          <div v-if="currentResult" class="card-content">
            <!-- AI图像识别结果 (仅画人物时显示) -->
            <div v-if="drawMode === 'person' && currentResult.recognition && currentResult.recognition.recognized" class="recognition-section">
              <div class="recognition-header">
                <i class="fas fa-search"></i>
                <span>AI识别结果</span>
                <span class="confidence-badge">置信度 {{ currentResult.recognition.confidence }}%</span>
              </div>
              
              <!-- 人物/事件图片 - 来自数据库image_url字段 -->
              <div class="recognition-image">
                <img 
                  v-if="currentResult.recognition.imageUrl" 
                  :src="currentResult.recognition.imageUrl" 
                  :alt="currentResult.recognition.name"
                  @error="handleImageError"
                />
                <div v-else class="no-image-placeholder">
                  <i :class="currentResult.recognition.type === 'person' ? 'fas fa-user-circle' : 'fas fa-calendar-alt'"></i>
                  <p>{{ currentResult.recognition.type === 'person' ? '暂无人物照片' : '暂无事件图片' }}</p>
                  <small>数据库image_url字段为空</small>
                </div>
                <div class="image-overlay">
                  <div class="overlay-top">
                    <div class="event-category">{{ currentResult.recognition.category }}</div>
                    <div class="content-type-badge">{{ currentResult.recognition.type === 'person' ? '人物' : '事件' }}</div>
                  </div>
                  <div v-if="currentResult.recognition.imageUrl" class="image-source-badge">
                    <i class="fas fa-database"></i> 图片来自数据库image_url字段
                  </div>
                </div>
              </div>
              
              <div class="recognition-content">
                <h3 class="recognition-title">{{ currentResult.recognition.name }}</h3>
                <p v-if="currentResult.recognition.type === 'person'" class="recognition-time">{{ currentResult.recognition.title }}</p>
                <p v-if="currentResult.recognition.type === 'event'" class="recognition-time">{{ currentResult.recognition.time }}</p>
                
                <!-- 显示数据库来源信息 -->
                <div v-if="currentResult.recognition.id || currentResult.recognition.dbSource" class="db-source-info">
                  <i class="fas fa-database"></i>
                  <span v-if="currentResult.recognition.type === 'person'">
                    数据来源：person表 (ID: {{ currentResult.recognition.id }})
                  </span>
                  <span v-else>
                    数据来源：history_event表 (ID: {{ currentResult.recognition.id }})
                  </span>
                </div>
                
                <p class="recognition-interpretation">{{ currentResult.recognition.interpretation }}</p>
              </div>
            </div>

            <!-- AI评分 (仅画学校时显示) -->
            <div v-if="drawMode === 'event' && currentResult.aiScore" class="ai-score-section">
              <div class="score-badge">
                <div class="score-label">AI评分</div>
                <div class="score-value">{{ currentResult.aiScore.score }}</div>
                <div class="score-stars">
                  <i v-for="n in 5" :key="n" 
                     class="fas fa-star" 
                     :class="{ 'active': n <= Math.round(currentResult.aiScore.score / 20) }">
                  </i>
                </div>
              </div>
              <div class="score-comment">{{ currentResult.aiScore.comment }}</div>
            </div>

            <!-- 操作按钮 -->
            <div class="card-actions">
              <button v-if="drawMode === 'person' && currentResult.type === 'person' && currentResult.id" class="detail-btn" @click="goToPersonDetail">
                查看完整人物介绍 <i class="fas fa-arrow-right"></i>
              </button>
              <button class="retry-btn" @click="retryDraw">
                <i class="fas fa-redo"></i> 再画一次
              </button>
            </div>
          </div>

          <div v-else class="loading-state">
            <div class="spinner"></div>
            <p>正在唤醒校史故事...</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getPersonImage, getEventImage } from '@/utils/imageLoader'

export default {
  name: 'DrawReveal',
  data() {
    return {
      drawMode: 'person', // 'person' 或 'event'
      canvas: null,
      ctx: null,
      isDrawing: false,
      lastX: 0,
      lastY: 0,
      pathHistory: [], // 记录每一笔的路径
      currentPath: [],
      hasDrawn: false,
      showResultCard: false,
      currentResult: null,
      lineWidth: 3,
      strokeColor: '#2c3e50',
      backgroundColor: '#ffffff',
      brushType: 'normal',
      showToolbar: false,
      colors: [
        '#000000', '#2c3e50', '#34495e', '#7f8c8d', 
        '#e74c3c', '#c0392b', '#e67e22', '#d35400',
        '#f39c12', '#f1c40f', '#2ecc71', '#27ae60',
        '#1abc9c', '#16a085', '#3498db', '#2980b9',
        '#9b59b6', '#8e44ad', '#e91e63', '#ff69b4'
      ],
      backgrounds: [
        '#ffffff', '#f8f9fa', '#fff3cd', '#d1ecf1', '#f8d7da', '#d4edda', 
        '#1a1a1a', '#2c3e50', '#34495e', '#424242', '#283593', '#1b5e20', '#b71c1c'
      ],
      brushTypes: [
        { value: 'normal', name: '普通画笔', icon: 'fas fa-pen' },
        { value: 'spray', name: '喷枪', icon: 'fas fa-spray-can' },
        { value: 'marker', name: '马克笔', icon: 'fas fa-marker' },
        { value: 'brush', name: '毛笔', icon: 'fas fa-paint-brush' }
      ]
    }
  },
  mounted() {
    this.initCanvas()
    window.addEventListener('resize', this.resizeCanvas)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeCanvas)
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas
      this.ctx = this.canvas.getContext('2d')
      this.resizeCanvas()
      this.updateBrush()
    },
    
    updateBrush() {
      if (!this.ctx) return
      this.ctx.lineWidth = this.lineWidth
      this.ctx.strokeStyle = this.strokeColor
      
      // 根据画笔类型设置样式
      switch(this.brushType) {
        case 'normal':
          this.ctx.lineCap = 'round'
          this.ctx.lineJoin = 'round'
          this.ctx.globalAlpha = 1
          break
        case 'spray':
          this.ctx.lineCap = 'round'
          this.ctx.lineJoin = 'round'
          this.ctx.globalAlpha = 0.3
          break
        case 'marker':
          this.ctx.lineCap = 'square'
          this.ctx.lineJoin = 'miter'
          this.ctx.globalAlpha = 0.7
          break
        case 'brush':
          this.ctx.lineCap = 'round'
          this.ctx.lineJoin = 'round'
          this.ctx.globalAlpha = 0.8
          break
      }
    },
    
    changeColor(color) {
      this.strokeColor = color
      this.updateBrush()
    },
    
    changeBrushType(type) {
      this.brushType = type
      this.updateBrush()
    },
    
    changeBackground(color) {
      this.backgroundColor = color
      this.redrawAll()
    },
    
    changeMode(mode) {
      this.drawMode = mode
      console.log('切换模式:', mode === 'person' ? '画人物' : '画学校')
    },
    
    resizeCanvas() {
      const wrapper = this.canvas.parentElement
      this.canvas.width = wrapper.offsetWidth
      this.canvas.height = wrapper.offsetHeight
      
      // 重绘所有路径
      this.redrawAll()
    },
    
    startDrawing(e) {
      this.isDrawing = true
      const rect = this.canvas.getBoundingClientRect()
      this.lastX = e.clientX - rect.left
      this.lastY = e.clientY - rect.top
      this.currentPath = [{ x: this.lastX, y: this.lastY }]
      this.hasDrawn = true
    },
    
    draw(e) {
      if (!this.isDrawing) return
      
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      this.ctx.beginPath()
      this.ctx.moveTo(this.lastX, this.lastY)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
      
      this.currentPath.push({ x, y })
      this.lastX = x
      this.lastY = y
    },
    
    stopDrawing() {
      if (this.isDrawing && this.currentPath.length > 0) {
        // 保存路径和样式
        this.pathHistory.push({
          points: [...this.currentPath],
          style: {
            lineWidth: this.lineWidth,
            color: this.strokeColor,
            lineCap: this.ctx.lineCap,
            lineJoin: this.ctx.lineJoin,
            alpha: this.ctx.globalAlpha
          }
        })
        this.currentPath = []
      }
      this.isDrawing = false
    },
    
    handleTouchStart(e) {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = this.canvas.getBoundingClientRect()
      this.isDrawing = true
      this.lastX = touch.clientX - rect.left
      this.lastY = touch.clientY - rect.top
      this.currentPath = [{ x: this.lastX, y: this.lastY }]
      this.hasDrawn = true
    },
    
    handleTouchMove(e) {
      e.preventDefault()
      if (!this.isDrawing) return
      
      const touch = e.touches[0]
      const rect = this.canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      
      this.ctx.beginPath()
      this.ctx.moveTo(this.lastX, this.lastY)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
      
      this.currentPath.push({ x, y })
      this.lastX = x
      this.lastY = y
    },
    
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.pathHistory = []
      this.currentPath = []
      this.hasDrawn = false
    },
    
    undo() {
      if (this.pathHistory.length === 0) return
      
      this.pathHistory.pop()
      this.redrawAll()
      
      if (this.pathHistory.length === 0) {
        this.hasDrawn = false
      }
    },
    
    redrawAll() {
      // 填充背景色
      this.ctx.fillStyle = this.backgroundColor
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      
      // 重绘所有路径
      this.pathHistory.forEach(path => {
        if (path.length < 2 || !path.style) return
        
        // 恢复该路径的样式
        this.ctx.lineWidth = path.style.lineWidth
        this.ctx.strokeStyle = path.style.color
        this.ctx.lineCap = path.style.lineCap
        this.ctx.lineJoin = path.style.lineJoin
        this.ctx.globalAlpha = path.style.alpha
        
        this.ctx.beginPath()
        this.ctx.moveTo(path.points[0].x, path.points[0].y)
        
        for (let i = 1; i < path.points.length; i++) {
          this.ctx.lineTo(path.points[i].x, path.points[i].y)
        }
        
        this.ctx.stroke()
      })
      
      // 恢复当前画笔设置
      this.updateBrush()
    },
    
    async submitDrawing() {
      if (!this.hasDrawn) {
        console.log('没有绘画内容')
        return
      }
      
      console.log('开始提交画作...')
      this.showResultCard = true
      this.currentResult = null
      
      try {
        // 获取画布数据
        const canvasData = this.canvas.toDataURL('image/png')
        
        // 计算画作特征
        const drawingFeatures = this.analyzeDrawing()
        console.log('画作特征:', drawingFeatures)
        
        const apiBase = this.resolveApiBase()
        console.log('API地址:', apiBase)
        
        // 调用AI图像识别接口（传递当前选择的模式）
        console.log('调用AI图像识别接口，模式:', this.drawMode)
        const recognizeResponse = await fetch(`${apiBase}/api/draw-reveal/recognize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            canvasData: canvasData,
            features: drawingFeatures,
            drawMode: this.drawMode  // 传递用户选择的模式
          })
        })
        const recognizeResult = await recognizeResponse.json()
        console.log('AI识别结果:', recognizeResult)
        
        // 调用AI打分接口（仅在画学校模式下调用）
        let scoreResult = { success: false, data: null }
        if (this.drawMode === 'event') {
          console.log('调用AI打分接口（画学校模式）...')
          const scoreResponse = await fetch(`${apiBase}/api/draw-reveal/score`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              canvasData: canvasData,
              features: drawingFeatures
            })
          })
          scoreResult = await scoreResponse.json()
          console.log('AI评分结果:', scoreResult)
        } else {
          console.log('画人物模式，跳过AI打分')
        }
        
        // 根据模式处理结果
        if (this.drawMode === 'person') {
          // 画人物模式：需要识别结果
          if (recognizeResult.success && recognizeResult.data && recognizeResult.data.recognized) {
            // 处理图片路径
            const recognitionData = { ...recognizeResult.data }
            if (recognitionData.imageUrl) {
              console.log('原始图片路径:', recognitionData.imageUrl)
              recognitionData.imageUrl = getPersonImage(recognitionData.imageUrl)
              console.log('处理后图片路径:', recognitionData.imageUrl)
            }
            
            this.currentResult = {
              ...recognitionData,
              recognition: recognitionData
            }
            console.log('最终结果（画人物）:', this.currentResult)
          } else {
            console.log('AI未能识别人物，提示用户重试')
            alert('AI暂未识别出相关人物，请重新绘制')
            this.closeResultCard()
          }
        } else {
          // 画学校模式：只需要评分，不需要识别结果
          if (scoreResult.success && scoreResult.data) {
            this.currentResult = {
              aiScore: scoreResult.data
            }
            console.log('最终结果（画学校）:', this.currentResult)
          } else {
            console.log('AI评分失败')
            alert('AI评分失败，请重试')
            this.closeResultCard()
          }
        }
      } catch (error) {
        console.error('提交失败:', error)
        alert('网络错误: ' + error.message)
        this.closeResultCard()
      }
    },
    
    analyzeDrawing() {
      // 分析画作特征
      const totalStrokes = this.pathHistory.length
      let totalPoints = 0
      let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0
      
      this.pathHistory.forEach(path => {
        // 现在path是对象，包含points和style
        const points = path.points || []
        totalPoints += points.length
        points.forEach(point => {
          minX = Math.min(minX, point.x)
          minY = Math.min(minY, point.y)
          maxX = Math.max(maxX, point.x)
          maxY = Math.max(maxY, point.y)
        })
      })
      
      const coverageWidth = maxX - minX
      const coverageHeight = maxY - minY
      const canvasArea = this.canvas.width * this.canvas.height
      const coverageArea = coverageWidth * coverageHeight
      const coverageRatio = canvasArea > 0 ? (coverageArea / canvasArea) : 0
      
      return {
        strokeCount: totalStrokes,
        pointCount: totalPoints,
        coverageRatio: coverageRatio,
        averageStrokeLength: totalStrokes > 0 ? (totalPoints / totalStrokes) : 0
      }
    },
    
    resolveApiBase() {
      const raw = (import.meta.env.VITE_API_BASE_URL || '').trim()
      if (raw) return raw.replace(/\/+$/, '')
      if (import.meta.env.DEV) return ''
      if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin
      }
      return ''
    },
    
    handleImageError(event) {
      console.error('图片加载失败，图片路径来自数据库image_url字段:', event.target.src)
      event.target.style.display = 'none'
      // 可以在这里添加占位图逻辑
    },
    
    closeResultCard() {
      this.showResultCard = false
      setTimeout(() => {
        this.currentResult = null
      }, 300)
    },
    
    retryDraw() {
      this.closeResultCard()
      this.clearCanvas()
    },
    
    goToPersonDetail() {
      if (this.currentResult && this.currentResult.id) {
        this.$router.push({
          path: `/person/${this.currentResult.id}`,
          query: { from: 'draw-reveal' }
        })
      }
    },
    
    goToHistoryTimeline() {
      this.$router.push('/digital-history')
    },
    
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.draw-reveal-page {
  min-height: 100vh;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -1;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #667eea;
  transition: all 0.3s;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* 模式选择器 */
.mode-selector {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.mode-btn {
  padding: 12px 24px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-btn i {
  font-size: 18px;
}

.mode-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.mode-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.mode-btn.active:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 画笔工具栏 */
.toolbar {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.toolbar-toggle {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  color: #667eea;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-toggle:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.toolbar-panel {
  position: absolute;
  top: 70px;
  right: 0;
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-width: 280px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-section {
  margin-bottom: 20px;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.tool-section label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 10px;
}

.color-picker {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.color-item {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.active {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.custom-color-wrapper {
  position: relative;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: visible;
}

.custom-color-wrapper:hover {
  transform: scale(1.1);
}

.custom-color-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
  border: none;
  outline: none;
}

.custom-color-input::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
}

.custom-color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.custom-color-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ff0000 0deg,
    #ff7f00 51deg,
    #ffff00 102deg,
    #00ff00 153deg,
    #00ffff 204deg,
    #0000ff 255deg,
    #ff00ff 306deg,
    #ff0000 360deg
  );
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  z-index: 1;
}

.custom-color-display::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border: 3px solid white;
  border-radius: 50%;
  z-index: 2;
}

.custom-color-wrapper:hover .custom-color-display {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  transition: all 0.3s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.brush-types {
  display: flex;
  gap: 8px;
}

.brush-btn {
  flex: 1;
  padding: 10px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  color: #495057;
  transition: all 0.3s;
}

.brush-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.brush-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.canvas-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.canvas-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #adb5bd;
  pointer-events: none;
}

.canvas-hint i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.canvas-hint p {
  font-size: 18px;
  font-weight: 300;
}

.control-buttons {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 50;
}

.control-btn {
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.control-btn i {
  margin: 0;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.undo-btn {
  background: #6c757d;
  color: white;
}

.undo-btn:hover:not(:disabled) {
  background: #5a6268;
  transform: scale(1.1);
}

.clear-btn {
  background: #dc3545;
  color: white;
}

.clear-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

.submit-btn {
  background: #28a745;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #218838;
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(40, 167, 69, 0.5);
}

/* 结果卡片样式 */
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.result-card {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.card-content {
  padding: 40px;
}

.recognition-section {
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
}

.recognition-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.recognition-header i {
  font-size: 20px;
  color: #667eea;
}

.confidence-badge {
  margin-left: auto;
  padding: 4px 12px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
}

.recognition-image {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.recognition-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #7f8c8d;
}

.no-image-placeholder i {
  font-size: 80px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.no-image-placeholder p {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.no-image-placeholder small {
  font-size: 12px;
  color: #95a5a6;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
}

.overlay-top {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.event-category {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.content-type-badge {
  padding: 6px 16px;
  background: rgba(102, 126, 234, 0.9);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.image-source-badge {
  padding: 4px 12px;
  background: rgba(40, 167, 69, 0.9);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: auto;
}

.image-source-badge i {
  font-size: 11px;
}

.recognition-content {
  text-align: left;
}

.recognition-title {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.recognition-time {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 12px;
}

.db-source-info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #28a745;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 6px;
}

.db-source-info i {
  font-size: 13px;
}

.recognition-interpretation {
  font-size: 15px;
  line-height: 1.6;
  color: #495057;
  background: white;
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.ai-score-section {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 15px;
  color: #000;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.score-badge {
  margin-bottom: 12px;
}

.score-label {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
}

.score-value {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 12px;
  color: #000;
}

.score-stars {
  display: flex;
  gap: 6px;
  justify-content: center;
  font-size: 20px;
}

.score-stars i {
  color: rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.score-stars i.active {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.score-comment {
  font-size: 15px;
  font-weight: 400;
  color: #333;
  font-style: italic;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.card-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
}

.card-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.card-body {
  text-align: left;
}

.person-info,
.event-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 14px;
  color: #495057;
}

.info-item i {
  color: #667eea;
}

.description {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 24px;
}

.description p {
  font-size: 16px;
  line-height: 1.8;
  color: #495057;
  margin: 0;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-btn,
.retry-btn {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.detail-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.retry-btn {
  background: #6c757d;
  color: white;
}

.retry-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.loading-state {
  padding: 60px 40px;
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 24px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 18px;
  color: #495057;
}

/* 过渡动画 */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.3s;
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
}

.card-fade-enter-active .result-card,
.card-fade-leave-active .result-card {
  transition: transform 0.3s;
}

.card-fade-enter-from .result-card {
  transform: scale(0.9);
}

.card-fade-leave-to .result-card {
  transform: scale(0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar {
    top: 70px;
    right: 10px;
  }

  .toolbar-toggle {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .toolbar-panel {
    min-width: 240px;
  }

  .control-buttons {
    bottom: 15px;
    right: 15px;
    gap: 10px;
  }

  .control-btn {
    width: 42px;
    height: 42px;
    font-size: 16px;
  }

  .back-btn {
    top: 10px;
    left: 10px;
    width: 42px;
    height: 42px;
    font-size: 18px;
  }

  .card-content {
    padding: 30px 20px;
  }

  .card-title {
    font-size: 24px;
  }
}
</style>
