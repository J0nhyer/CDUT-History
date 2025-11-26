<template>
  <div class="face-recognition-page">
    <!-- 背景渐变 -->
    <div class="background-gradient"></div>
    
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack" title="返回首页">
      <i class="fas fa-arrow-left"></i>
    </button>

    <!-- 标题 -->
    <div class="page-header">
      <i class="fas fa-camera"></i>
      <h1>像素岁月 · 校史人物</h1>
      <p>开启摄像头，识别成理历史人物</p>
    </div>

    <!-- 摄像头区域 -->
    <div class="camera-container">
      <div class="video-wrapper">
        <video ref="video" autoplay playsinline></video>
        <canvas ref="canvas" style="display: none;"></canvas>
        
        <!-- 识别框架 -->
        <div v-if="isCameraActive && !isRecognizing" class="face-frame">
          <div class="corner corner-tl"></div>
          <div class="corner corner-tr"></div>
          <div class="corner corner-bl"></div>
          <div class="corner corner-br"></div>
        </div>
        
        <!-- 识别中提示 -->
        <div v-if="isRecognizing" class="recognizing-overlay">
          <div class="spinner"></div>
          <p>正在识别人物...</p>
        </div>
        
        <!-- 未开启摄像头提示 -->
        <div v-if="!isCameraActive" class="camera-hint">
          <i class="fas fa-video"></i>
          <p>点击下方按钮开启摄像头</p>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="camera-controls">
        <button v-if="!isCameraActive" class="control-btn start-btn" @click="startCamera">
          <i class="fas fa-video"></i>
          <span>开启摄像头</span>
        </button>
        <button v-else class="control-btn stop-btn" @click="stopCamera">
          <i class="fas fa-video-slash"></i>
          <span>关闭摄像头</span>
        </button>
        <button v-if="isCameraActive" class="control-btn capture-btn" @click="captureAndRecognize" :disabled="isRecognizing">
          <i class="fas fa-camera"></i>
          <span>拍照识别</span>
        </button>
      </div>
    </div>

    <!-- 识别结果卡片 -->
    <transition name="card-fade">
      <div v-if="showResultCard" class="result-overlay" @click="closeResultCard">
        <div class="result-card" @click.stop>
          <button class="close-btn" @click="closeResultCard">
            <i class="fas fa-times"></i>
          </button>
          
          <div v-if="recognitionResult" class="card-content">
            <!-- 识别成功 -->
            <div v-if="recognitionResult.recognized" class="recognition-section">
              <div class="recognition-header">
                <i class="fas fa-check-circle"></i>
                <span>识别成功</span>
                <span class="confidence-badge">置信度 {{ recognitionResult.confidence }}%</span>
              </div>
              
              <!-- 人物照片 -->
              <div class="person-image">
                <img 
                  v-if="recognitionResult.imageUrl" 
                  :src="recognitionResult.imageUrl" 
                  :alt="recognitionResult.name"
                  @error="handleImageError"
                />
                <div v-else class="no-image-placeholder">
                  <i class="fas fa-user-circle"></i>
                  <p>暂无人物照片</p>
                </div>
              </div>
              
              <!-- 人物信息 -->
              <div class="person-info">
                <h2 class="person-name">{{ recognitionResult.name }}</h2>
                <p class="person-title">{{ recognitionResult.title }}</p>
                <p class="person-period" v-if="recognitionResult.period">{{ recognitionResult.period }}</p>
                
                <div class="db-source">
                  <i class="fas fa-database"></i>
                  <span>数据来源：person表 (ID: {{ recognitionResult.id }})</span>
                </div>
                
                <div class="person-description">
                  <p>{{ recognitionResult.description }}</p>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="card-actions">
                <button class="detail-btn" @click="goToPersonDetail">
                  查看完整介绍 <i class="fas fa-arrow-right"></i>
                </button>
                <button class="retry-btn" @click="retryRecognition">
                  <i class="fas fa-redo"></i> 重新识别
                </button>
              </div>
            </div>
            
            <!-- 识别失败 -->
            <div v-else class="no-recognition">
              <i class="fas fa-exclamation-circle"></i>
              <h3>未能识别</h3>
              <p>暂未识别出相关校史人物，请调整角度后重试</p>
              <button class="retry-btn" @click="retryRecognition">
                <i class="fas fa-redo"></i> 重新识别
              </button>
            </div>
          </div>

          <div v-else class="loading-state">
            <div class="spinner"></div>
            <p>正在识别中...</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getPersonImage } from '@/utils/imageLoader'

export default {
  name: 'PixelTime',
  data() {
    return {
      isCameraActive: false,
      isRecognizing: false,
      showResultCard: false,
      recognitionResult: null,
      stream: null
    }
  },
  beforeUnmount() {
    this.stopCamera()
  },
  methods: {
    async startCamera() {
      try {
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        }
        
        this.stream = await navigator.mediaDevices.getUserMedia(constraints)
        this.$refs.video.srcObject = this.stream
        this.isCameraActive = true
        console.log('摄像头已开启')
      } catch (error) {
        console.error('无法访问摄像头:', error)
        alert('无法访问摄像头，请检查权限设置')
      }
    },
    
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
        this.stream = null
        this.isCameraActive = false
        console.log('摄像头已关闭')
      }
    },
    
    async captureAndRecognize() {
      if (!this.isCameraActive || this.isRecognizing) return
      
      this.isRecognizing = true
      
      try {
        // 捕获视频帧
        const canvas = this.$refs.canvas
        const video = this.$refs.video
        const ctx = canvas.getContext('2d')
        
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // 转换为base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        console.log('已捕获图像，准备发送识别请求')
        
        // 调用后端人脸识别API
        const apiBase = this.resolveApiBase()
        const response = await fetch(`${apiBase}/api/face-recognition/recognize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: imageData
          })
        })
        
        const result = await response.json()
        console.log('识别结果:', result)
        
        if (result.success && result.data) {
          // 处理图片路径
          const personData = { ...result.data }
          if (personData.imageUrl) {
            personData.imageUrl = getPersonImage(personData.imageUrl)
          }
          
          this.recognitionResult = personData
          this.showResultCard = true
        } else {
          // 识别失败
          this.recognitionResult = { recognized: false }
          this.showResultCard = true
        }
      } catch (error) {
        console.error('识别失败:', error)
        alert('识别失败: ' + error.message)
      } finally {
        this.isRecognizing = false
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
      console.error('图片加载失败:', event.target.src)
      event.target.style.display = 'none'
    },
    
    closeResultCard() {
      this.showResultCard = false
      setTimeout(() => {
        this.recognitionResult = null
      }, 300)
    },
    
    retryRecognition() {
      this.closeResultCard()
    },
    
    goToPersonDetail() {
      if (this.recognitionResult && this.recognitionResult.id) {
        this.$router.push({
          path: `/person/${this.recognitionResult.id}`,
          query: { from: 'face-recognition' }
        })
      }
    },
    
    goBack() {
      this.stopCamera()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.face-recognition-page {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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

/* 返回按钮 */
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

/* 页面标题 */
.page-header {
  text-align: center;
  margin: 60px 0 30px;
  color: white;
}

.page-header i {
  font-size: 48px;
  margin-bottom: 15px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.page-header p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* 摄像头容器 */
.camera-container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 识别框架 */
.face-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid #4CAF50;
}

.corner-tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-radius: 10px 0 0 0;
}

.corner-tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-radius: 0 10px 0 0;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 10px;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-radius: 0 0 10px 0;
}

/* 识别中覆盖层 */
.recognizing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.recognizing-overlay p {
  margin-top: 20px;
  font-size: 18px;
}

/* 未开启摄像头提示 */
.camera-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #888;
}

.camera-hint i {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.camera-hint p {
  font-size: 18px;
  margin: 0;
}

/* 控制按钮 */
.camera-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.control-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-btn {
  background: #4CAF50;
  color: white;
}

.start-btn:hover {
  background: #45a049;
}

.stop-btn {
  background: #f44336;
  color: white;
}

.stop-btn:hover {
  background: #da190b;
}

.capture-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.capture-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

/* 结果卡片 */
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

/* 识别成功内容 */
.recognition-section {
  text-align: center;
}

.recognition-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 600;
  color: #4CAF50;
}

.recognition-header i {
  font-size: 24px;
}

.confidence-badge {
  margin-left: auto;
  padding: 5px 15px;
  background: rgba(76, 175, 80, 0.2);
  border-radius: 20px;
  font-size: 14px;
  color: #4CAF50;
}

/* 人物照片 */
.person-image {
  width: 100%;
  height: 350px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.person-image img {
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
  font-size: 100px;
  margin-bottom: 20px;
  opacity: 0.3;
}

.no-image-placeholder p {
  font-size: 18px;
  margin: 0;
}

/* 人物信息 */
.person-info {
  text-align: left;
}

.person-name {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px;
}

.person-title {
  font-size: 18px;
  color: #7f8c8d;
  margin: 0 0 8px;
}

.person-period {
  font-size: 16px;
  color: #95a5a6;
  margin: 0 0 20px;
}

.db-source {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #28a745;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 8px;
}

.person-description {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 25px;
}

.person-description p {
  font-size: 16px;
  line-height: 1.8;
  color: #495057;
  margin: 0;
}

/* 识别失败内容 */
.no-recognition {
  text-align: center;
  padding: 40px 20px;
}

.no-recognition i {
  font-size: 80px;
  color: #f44336;
  margin-bottom: 20px;
}

.no-recognition h3 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0 0 15px;
}

.no-recognition p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 30px;
  line-height: 1.6;
}

/* 操作按钮 */
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

/* 加载状态 */
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
  .page-header h1 {
    font-size: 28px;
  }
  
  .camera-container {
    padding: 15px;
  }
  
  .camera-controls {
    flex-direction: column;
  }
  
  .control-btn {
    width: 100%;
  }
  
  .card-content {
    padding: 30px 20px;
  }
  
  .person-name {
    font-size: 24px;
  }
}
</style>
