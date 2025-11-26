<template>
  <div class="face-recognition-page">
    <!-- 背景渐变 -->
    <div class="background-gradient"></div>
    
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack" title="返回首页">
      <i class="fas fa-arrow-left"></i>
    </button>

    <!-- 左侧标题区域 -->
    <div class="page-header">
      <i class="fas fa-camera"></i>
      <h1>像素岁月</h1>
      <h2>校史人物识别</h2>
      <p>开启摄像头，识别成理历史人物</p>
    </div>

    <!-- 右侧摄像头区域 -->
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
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  position: relative;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%),
    repeating-linear-gradient(0deg, #0e0e0e 0px, #1a1a1a 2px, #0e0e0e 4px),
    linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%);
  z-index: -1;
  animation: scanlines 8s linear infinite;
}

@keyframes scanlines {
  0% { background-position: 0 0, 0 0, 0 0; }
  100% { background-position: 0 0, 0 100px, 0 0; }
}

/* 返回按钮 */
.back-btn {
  position: fixed;
  top: 24px;
  left: 24px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.95), rgba(41, 128, 185, 0.95));
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  font-size: 22px;
  color: white;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 100;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: linear-gradient(135deg, rgba(41, 128, 185, 1), rgba(52, 152, 219, 1));
  transform: translateY(-4px) scale(1.1);
  box-shadow: 
    0 10px 30px rgba(52, 152, 219, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
}

.back-btn:active {
  transform: translateY(-2px) scale(1.05);
}

/* 页面标题 - 左侧固定 */
.page-header {
  position: fixed;
  left: 0;
  top: 0;
  width: 380px;
  height: 100vh;
  padding: 100px 40px 40px;
  color: white;
  background: linear-gradient(135deg, rgba(41, 128, 185, 0.15), rgba(52, 152, 219, 0.1));
  backdrop-filter: blur(10px);
  border-right: 2px solid rgba(52, 152, 219, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 50;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(52, 152, 219, 0.15) 0%, transparent 70%);
  pointer-events: none;
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

.page-header i {
  font-size: 80px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #3498db, #2ecc71, #f39c12, #e74c3c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pixel-pulse 2s ease-in-out infinite, rainbow-shift 5s linear infinite;
  filter: drop-shadow(0 0 20px rgba(52, 152, 219, 0.5));
  position: relative;
  z-index: 1;
  display: block;
  text-align: center;
  width: 100%;
}

@keyframes pixel-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@keyframes rainbow-shift {
  0% { filter: hue-rotate(0deg) drop-shadow(0 0 20px rgba(52, 152, 219, 0.5)); }
  100% { filter: hue-rotate(360deg) drop-shadow(0 0 20px rgba(52, 152, 219, 0.5)); }
}

.page-header h1 {
  font-size: 52px;
  font-weight: 900;
  margin: 0 0 10px;
  text-shadow: 
    0 0 10px rgba(52, 152, 219, 0.8),
    0 0 20px rgba(52, 152, 219, 0.6),
    0 0 30px rgba(52, 152, 219, 0.4),
    2px 2px 0 rgba(0, 0, 0, 0.3);
  letter-spacing: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  z-index: 1;
  line-height: 1.2;
}

.page-header h2 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 30px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
}

@keyframes line-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.page-header p {
  font-size: 17px;
  opacity: 0.9;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  font-weight: 400;
  line-height: 1.8;
  position: relative;
  z-index: 1;
}

/* 摄像头容器 - 右侧 */
.camera-container {
  margin-left: 380px;
  width: calc(100% - 380px);
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(145deg, #2c3e50, #34495e);
  box-shadow: 
    inset 0 0 100px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow-y: auto;
}


.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 900px;
  aspect-ratio: 4 / 3;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 
    inset 0 0 50px rgba(0, 0, 0, 0.8),
    0 10px 40px rgba(0, 0, 0, 0.4);
  border: 3px solid rgba(52, 152, 219, 0.3);
  position: relative;
}

.video-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.03) 2px,
      rgba(255, 255, 255, 0.03) 4px
    );
  pointer-events: none;
  z-index: 10;
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  0% { transform: translateY(0); }
  100% { transform: translateY(100%); }
}

.video-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;
  z-index: 11;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.1) brightness(0.95);
}

/* 识别框架 */
.face-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
  height: 340px;
  pointer-events: none;
  z-index: 20;
  animation: frame-pulse 2s ease-in-out infinite;
}

@keyframes frame-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.02); opacity: 1; }
}

.corner {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 4px solid #2ecc71;
  box-shadow: 
    0 0 10px rgba(46, 204, 113, 0.6),
    0 0 20px rgba(46, 204, 113, 0.4),
    inset 0 0 10px rgba(46, 204, 113, 0.3);
  animation: corner-glow 1.5s ease-in-out infinite;
}

@keyframes corner-glow {
  0%, 100% { 
    border-color: #2ecc71;
    box-shadow: 
      0 0 10px rgba(46, 204, 113, 0.6),
      0 0 20px rgba(46, 204, 113, 0.4),
      inset 0 0 10px rgba(46, 204, 113, 0.3);
  }
  50% { 
    border-color: #3498db;
    box-shadow: 
      0 0 15px rgba(52, 152, 219, 0.8),
      0 0 30px rgba(52, 152, 219, 0.6),
      inset 0 0 15px rgba(52, 152, 219, 0.4);
  }
}

.corner-tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
}

.corner-tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-radius: 0 4px 0 0;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 4px;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-radius: 0 0 4px 0;
}

/* 识别中覆盖层 */
.recognizing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 15;
  backdrop-filter: blur(5px);
}

.recognizing-overlay p {
  margin-top: 25px;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  animation: text-pulse 1.5s ease-in-out infinite;
}

@keyframes text-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* 未开启摄像头提示 */
.camera-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #95a5a6;
  z-index: 5;
}

.camera-hint i {
  font-size: 100px;
  margin-bottom: 25px;
  opacity: 0.6;
  color: #7f8c8d;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.camera-hint p {
  font-size: 20px;
  margin: 0;
  font-weight: 500;
  color: #bdc3c7;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* 控制按钮 */
.camera-controls {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.control-btn {
  padding: 16px 36px;
  border: none;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.control-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.control-btn:hover::before {
  width: 300px;
  height: 300px;
}

.control-btn i {
  font-size: 20px;
  z-index: 1;
}

.control-btn span {
  z-index: 1;
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
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
}

.start-btn:hover {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 10px 30px rgba(46, 204, 113, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.stop-btn {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
}

.stop-btn:hover {
  background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 10px 30px rgba(231, 76, 60, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.capture-btn {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  position: relative;
}

.capture-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2980b9 0%, #21618c 100%);
  transform: translateY(-3px) scale(1.08);
  box-shadow: 
    0 12px 35px rgba(52, 152, 219, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.capture-btn:active:not(:disabled) {
  transform: translateY(-1px) scale(1.05);
  box-shadow: 
    0 5px 15px rgba(52, 152, 219, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
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
  background: linear-gradient(145deg, #34495e, #2c3e50);
  border-radius: 24px;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 30px 90px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(52, 152, 219, 0.3);
  animation: card-appear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes card-appear {
  0% { 
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  100% { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.8), rgba(192, 57, 43, 0.8));
  border: 2px solid rgba(255, 255, 255, 0.3);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
  color: white;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.close-btn:hover {
  background: linear-gradient(135deg, rgba(192, 57, 43, 1), rgba(169, 50, 38, 1));
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.5);
}

.card-content {
  padding: 50px 40px 40px;
}

/* 识别成功内容 */
.recognition-section {
  text-align: center;
}

.recognition-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  font-size: 22px;
  font-weight: 700;
  color: #2ecc71;
  text-shadow: 0 2px 10px rgba(46, 204, 113, 0.3);
  animation: success-bounce 0.6s ease-out;
}

@keyframes success-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.recognition-header i {
  font-size: 24px;
}

.confidence-badge {
  margin-left: auto;
  padding: 8px 18px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.3), rgba(39, 174, 96, 0.3));
  border-radius: 25px;
  font-size: 15px;
  font-weight: 700;
  color: #2ecc71;
  border: 2px solid rgba(46, 204, 113, 0.4);
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.3);
}

/* 人物照片 */
.person-image {
  width: 100%;
  height: 380px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.4),
    inset 0 0 0 2px rgba(52, 152, 219, 0.3);
  border: 3px solid rgba(52, 152, 219, 0.2);
  position: relative;
  background: linear-gradient(135deg, #34495e, #2c3e50);
}

.person-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;
}

.person-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.person-image:hover img {
  transform: scale(1.05);
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, rgba(52, 73, 94, 0.3), rgba(44, 62, 80, 0.5));
  color: #95a5a6;
  backdrop-filter: blur(10px);
}

.no-image-placeholder i {
  font-size: 120px;
  margin-bottom: 25px;
  opacity: 0.4;
  color: #7f8c8d;
}

.no-image-placeholder p {
  font-size: 19px;
  margin: 0;
  font-weight: 500;
  color: #bdc3c7;
}

/* 人物信息 */
.person-info {
  text-align: left;
}

.person-name {
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px;
  text-shadow: 0 2px 20px rgba(52, 152, 219, 0.3);
  letter-spacing: 1px;
}

.person-title {
  font-size: 19px;
  color: #ecf0f1;
  margin: 0 0 10px;
  font-weight: 500;
  opacity: 0.9;
}

.person-period {
  font-size: 16px;
  color: #bdc3c7;
  margin: 0 0 25px;
  font-style: italic;
  opacity: 0.85;
}

.db-source {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  margin-bottom: 25px;
  font-size: 14px;
  font-weight: 600;
  color: #2ecc71;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.2));
  border: 2px solid rgba(46, 204, 113, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.2);
}

.person-description {
  background: linear-gradient(135deg, rgba(52, 73, 94, 0.5), rgba(44, 62, 80, 0.5));
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 30px;
  border: 1px solid rgba(52, 152, 219, 0.2);
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.person-description p {
  font-size: 17px;
  line-height: 1.9;
  color: #ecf0f1;
  margin: 0;
  text-align: justify;
}

/* 识别失败内容 */
.no-recognition {
  text-align: center;
  padding: 40px 20px;
}

.no-recognition i {
  font-size: 90px;
  color: #e74c3c;
  margin-bottom: 25px;
  animation: shake 0.5s ease-in-out;
  filter: drop-shadow(0 0 20px rgba(231, 76, 60, 0.5));
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.no-recognition h3 {
  font-size: 28px;
  color: #ecf0f1;
  margin: 0 0 20px;
  font-weight: 700;
}

.no-recognition p {
  font-size: 17px;
  color: #bdc3c7;
  margin: 0 0 35px;
  line-height: 1.8;
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
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}

.detail-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 30px rgba(52, 152, 219, 0.5);
  background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%);
}

.retry-btn {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  color: white;
  box-shadow: 0 6px 20px rgba(127, 140, 141, 0.3);
}

.retry-btn:hover {
  background: linear-gradient(135deg, #7f8c8d, #6c7a89);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 30px rgba(127, 140, 141, 0.5);
}

/* 加载状态 */
.loading-state {
  padding: 60px 40px;
  text-align: center;
}

.spinner {
  width: 70px;
  height: 70px;
  margin: 0 auto 24px;
  border: 5px solid rgba(52, 152, 219, 0.2);
  border-top: 5px solid #3498db;
  border-right: 5px solid #2ecc71;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 
    0 0 20px rgba(52, 152, 219, 0.4),
    inset 0 0 20px rgba(52, 152, 219, 0.2);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 19px;
  color: #ecf0f1;
  font-weight: 500;
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
@media (max-width: 1200px) {
  .page-header {
    width: 320px;
    padding: 80px 30px 30px;
  }
  
  .page-header h1 {
    font-size: 42px;
  }
  
  .page-header h2 {
    font-size: 24px;
  }
  
  .page-header i {
    font-size: 60px;
  }
  
  .camera-container {
    margin-left: 320px;
    width: calc(100% - 320px);
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .face-recognition-page {
    flex-direction: column;
  }
  
  .page-header {
    position: relative;
    width: 100%;
    height: auto;
    padding: 80px 20px 30px;
    border-right: none;
    border-bottom: 2px solid rgba(52, 152, 219, 0.3);
  }
  
  .page-header h1 {
    font-size: 36px;
    letter-spacing: 2px;
  }
  
  .page-header h2 {
    font-size: 20px;
  }
  
  .page-header i {
    font-size: 50px;
  }
  
  .page-header p {
    font-size: 15px;
  }
  
  .camera-container {
    margin-left: 0;
    width: 100%;
    padding: 30px 20px;
    min-height: auto;
  }
  
  .video-wrapper {
    max-width: 100%;
  }
  
  .camera-controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .control-btn {
    width: 100%;
    padding: 14px 28px;
    font-size: 16px;
  }
  
  .card-content {
    padding: 40px 25px 30px;
  }
  
  .person-name {
    font-size: 26px;
  }
  
  .person-image {
    height: 280px;
  }
  
  .face-frame {
    width: 280px;
    height: 280px;
  }
  
  .corner {
    width: 40px;
    height: 40px;
  }
  
  .back-btn {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style>
