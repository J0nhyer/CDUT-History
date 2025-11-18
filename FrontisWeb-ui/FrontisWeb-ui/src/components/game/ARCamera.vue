<template>
  <div class="ar-camera">
    <div class="ar-header">
      <h2 class="ar-title">📱 AR增强现实模式</h2>
      <button @click="$emit('close')" class="close-btn">关闭</button>
    </div>
    
    <div class="ar-container">
      <!-- 摄像头预览区 -->
      <div class="camera-preview">
        <video ref="videoElement" autoplay playsinline class="video-feed"></video>
        
        <!-- AR覆盖层 -->
        <div class="ar-overlay">
          <!-- 扫描框 -->
          <div class="scan-frame">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>
          
          <!-- 扫描提示 -->
          <div class="scan-hint">
            <p v-if="!isScanning">{{ scanHint }}</p>
            <div v-else class="scanning-indicator">
              <div class="spinner"></div>
              <p>正在识别...</p>
            </div>
          </div>
          
          <!-- AR恐龙 -->
          <transition name="fade">
            <div v-if="showDino" class="ar-dino">
              <div class="dino-model">{{ currentDino }}</div>
              <div class="dino-info">
                <h3>{{ dinoName }}</h3>
                <p>{{ dinoDesc }}</p>
              </div>
            </div>
          </transition>
          
          <!-- AR知识点 -->
          <transition name="slide-up">
            <div v-if="showKnowledge" class="ar-knowledge">
              <div class="knowledge-card">
                <div class="card-icon">{{ knowledgeIcon }}</div>
                <h4>{{ knowledgeTitle }}</h4>
                <p>{{ knowledgeDesc }}</p>
                <button @click="collectKnowledge" class="collect-btn">
                  收集 🟡
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
      
      <!-- AR控制面板 -->
      <div class="ar-controls">
        <button @click="toggleScanning" class="control-btn">
          <span class="icon">{{ isScanning ? '⏸️' : '▶️' }}</span>
          {{ isScanning ? '暂停' : '开始' }}扫描
        </button>
        
        <button @click="switchCamera" class="control-btn">
          <span class="icon">🔄</span>
          切换摄像头
        </button>
        
        <button @click="capturePhoto" class="control-btn">
          <span class="icon">📸</span>
          拍照
        </button>
        
        <button @click="toggleFlashlight" class="control-btn">
          <span class="icon">{{ flashlightOn ? '🔦' : '💡' }}</span>
          闪光灯
        </button>
      </div>
      
      <!-- AR使用说明 -->
      <div class="ar-guide">
        <h3>🎯 使用指南</h3>
        <ul>
          <li>📱 对准特定二维码解锁隐藏内容</li>
          <li>🏛️ 扫描校园建筑显示虚拟恐龙</li>
          <li>📚 发现校史知识点收集琥珀</li>
          <li>📸 拍照记录你的AR探险</li>
        </ul>
      </div>
      
      <!-- 扫描历史 -->
      <div v-if="scanHistory.length" class="scan-history">
        <h3>📋 扫描记录</h3>
        <div class="history-list">
          <div 
            v-for="(item, index) in scanHistory" 
            :key="index"
            class="history-item"
          >
            <span class="item-icon">{{ item.icon }}</span>
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-time">{{ item.time }}</div>
            </div>
            <span class="item-badge">{{ item.type }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button @click="requestCameraPermission" class="retry-btn">
        重试
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ARCamera',
  
  emits: ['close', 'collect'],
  
  setup(props, { emit }) {
    const videoElement = ref(null);
    const isScanning = ref(false);
    const showDino = ref(false);
    const showKnowledge = ref(false);
    const flashlightOn = ref(false);
    const error = ref('');
    const scanHint = ref('将摄像头对准二维码或校园建筑');
    
    const currentDino = ref('🦖');
    const dinoName = ref('霸王龙');
    const dinoDesc = ref('在校园中漫步的恐龙');
    
    const knowledgeIcon = ref('🏛️');
    const knowledgeTitle = ref('成都理工大学校门');
    const knowledgeDesc = ref('建于1956年,见证了学校的发展历程');
    
    const scanHistory = ref([]);
    
    let mediaStream = null;
    let facingMode = 'environment'; // 'user' or 'environment'
    
    // 请求摄像头权限
    const requestCameraPermission = async () => {
      try {
        error.value = '';
        
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoElement.value) {
          videoElement.value.srcObject = mediaStream;
        }
        
        // 模拟AR功能
        simulateARDetection();
        
      } catch (err) {
        console.error('摄像头访问失败:', err);
        error.value = '无法访问摄像头,请检查权限设置';
      }
    };
    
    // 切换摄像头
    const switchCamera = async () => {
      facingMode = facingMode === 'user' ? 'environment' : 'user';
      
      // 停止当前流
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      
      // 重新请求
      await requestCameraPermission();
    };
    
    // 切换扫描状态
    const toggleScanning = () => {
      isScanning.value = !isScanning.value;
      
      if (isScanning.value) {
        scanHint.value = '正在扫描...';
        // 模拟检测
        setTimeout(() => {
          if (Math.random() > 0.5) {
            detectDino();
          } else {
            detectKnowledge();
          }
        }, 2000);
      } else {
        scanHint.value = '将摄像头对准二维码或校园建筑';
        showDino.value = false;
        showKnowledge.value = false;
      }
    };
    
    // 检测恐龙
    const detectDino = () => {
      const dinos = [
        { emoji: '🦖', name: '霸王龙', desc: '强大的攻击型恐龙' },
        { emoji: '🦕', name: '腕龙', desc: '温和的探索型恐龙' },
        { emoji: '🦏', name: '三角龙', desc: '坚韧的防御型恐龙' }
      ];
      
      const dino = dinos[Math.floor(Math.random() * dinos.length)];
      currentDino.value = dino.emoji;
      dinoName.value = dino.name;
      dinoDesc.value = dino.desc;
      
      showDino.value = true;
      isScanning.value = false;
      
      // 添加到历史
      addToHistory({
        icon: dino.emoji,
        name: dino.name,
        type: '恐龙',
        time: new Date().toLocaleTimeString()
      });
    };
    
    // 检测知识点
    const detectKnowledge = () => {
      const knowledges = [
        { icon: '🏛️', title: '校门', desc: '建于1956年的历史建筑' },
        { icon: '📚', title: '图书馆', desc: '知识的海洋' },
        { icon: '🌊', title: '砚湖', desc: '校园最美的景观' }
      ];
      
      const knowledge = knowledges[Math.floor(Math.random() * knowledges.length)];
      knowledgeIcon.value = knowledge.icon;
      knowledgeTitle.value = knowledge.title;
      knowledgeDesc.value = knowledge.desc;
      
      showKnowledge.value = true;
      isScanning.value = false;
      
      // 添加到历史
      addToHistory({
        icon: knowledge.icon,
        name: knowledge.title,
        type: '知识点',
        time: new Date().toLocaleTimeString()
      });
    };
    
    // 收集知识点
    const collectKnowledge = () => {
      emit('collect', {
        title: knowledgeTitle.value,
        type: 'knowledge'
      });
      showKnowledge.value = false;
    };
    
    // 拍照
    const capturePhoto = () => {
      if (!videoElement.value) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.value.videoWidth;
      canvas.height = videoElement.value.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoElement.value, 0, 0);
      
      // 转换为图片并下载
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ar-photo-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
      
      // 拍照动画
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        opacity: 0.8;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 100);
    };
    
    // 切换闪光灯
    const toggleFlashlight = async () => {
      if (!mediaStream) return;
      
      try {
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        
        if (capabilities.torch) {
          flashlightOn.value = !flashlightOn.value;
          await track.applyConstraints({
            advanced: [{ torch: flashlightOn.value }]
          });
        } else {
          alert('当前设备不支持闪光灯');
        }
      } catch (err) {
        console.error('闪光灯控制失败:', err);
      }
    };
    
    // 添加到历史记录
    const addToHistory = (item) => {
      scanHistory.value.unshift(item);
      if (scanHistory.value.length > 10) {
        scanHistory.value.pop();
      }
    };
    
    // 模拟AR检测
    const simulateARDetection = () => {
      // 在实际应用中,这里应该使用计算机视觉库如AR.js或TensorFlow.js
      // 来检测二维码或图像标记
    };
    
    // 生命周期
    onMounted(() => {
      requestCameraPermission();
    });
    
    onUnmounted(() => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    });
    
    return {
      videoElement,
      isScanning,
      showDino,
      showKnowledge,
      flashlightOn,
      error,
      scanHint,
      currentDino,
      dinoName,
      dinoDesc,
      knowledgeIcon,
      knowledgeTitle,
      knowledgeDesc,
      scanHistory,
      requestCameraPermission,
      switchCamera,
      toggleScanning,
      collectKnowledge,
      capturePhoto,
      toggleFlashlight
    };
  }
};
</script>

<style scoped>
.ar-camera {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 2000;
  overflow-y: auto;
}

.ar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.ar-title {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  padding: 8px 20px;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.ar-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.camera-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: #1a1a1a;
  border-radius: 15px;
  overflow: hidden;
}

.video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.scan-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border: 2px solid rgba(102, 126, 234, 0.5);
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid #667eea;
}

.corner.top-left {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

.scan-hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
}

.scanning-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ar-dino {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: auto;
}

.dino-model {
  font-size: 120px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.dino-info {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px 25px;
  border-radius: 15px;
  margin-top: 20px;
}

.dino-info h3 {
  margin: 0 0 8px;
  font-size: 20px;
}

.dino-info p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.ar-knowledge {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  pointer-events: auto;
}

.knowledge-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.card-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.knowledge-card h4 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #2d3748;
}

.knowledge-card p {
  margin: 0 0 15px;
  font-size: 14px;
  color: #4a5568;
}

.collect-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

.ar-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.control-btn {
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #667eea;
}

.icon {
  font-size: 18px;
}

.ar-guide,
.scan-history {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
  color: white;
}

.ar-guide h3,
.scan-history h3 {
  margin: 0 0 15px;
  font-size: 18px;
}

.ar-guide ul {
  margin: 0;
  padding-left: 25px;
}

.ar-guide li {
  margin-bottom: 10px;
  line-height: 1.6;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.item-icon {
  font-size: 28px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
}

.item-time {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
}

.item-badge {
  padding: 4px 10px;
  background: #667eea;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  max-width: 400px;
}

.error-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 15px;
}

.error-message p {
  margin: 0 0 20px;
  color: #2d3748;
}

.retry-btn {
  padding: 10px 25px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateX(-50%) translateY(100px);
  opacity: 0;
}
</style>



