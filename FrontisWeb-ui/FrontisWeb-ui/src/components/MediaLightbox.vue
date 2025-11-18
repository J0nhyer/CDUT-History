<template>
  <transition name="lightbox">
    <div v-if="isOpen" class="media-lightbox" @click.self="close">
      <button class="close-lightbox-btn" @click="close">
        <i class="fas fa-times"></i>
      </button>
      
      <button class="nav-btn prev-btn" @click="prevMedia" v-if="mediaList.length > 1">
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <div class="lightbox-content">
        <div v-if="currentMedia.type === 'image'" class="media-container">
          <img :src="currentMedia.url" :alt="currentMedia.title || '图片'" class="media-image" />
        </div>
        
        <div v-if="currentMedia.type === 'video'" class="media-container">
          <video :src="currentMedia.url" controls class="media-video" ref="videoRef"></video>
        </div>
        
        <div v-if="currentMedia.type === 'audio'" class="media-container">
          <div class="audio-wrapper">
            <div class="audio-visualizer"></div>
            <audio :src="currentMedia.url" controls class="media-audio" ref="audioRef"></audio>
          </div>
        </div>
        
        <div v-if="currentMedia.title || currentMedia.description" class="media-info">
          <h3 class="media-title">{{ currentMedia.title }}</h3>
          <p class="media-description">{{ currentMedia.description }}</p>
          <div class="media-meta" v-if="currentMedia.meta">
            <span v-for="(value, key) in currentMedia.meta" :key="key" class="meta-item">
              <strong>{{ key }}:</strong> {{ value }}
            </span>
          </div>
        </div>
      </div>
      
      <button class="nav-btn next-btn" @click="nextMedia" v-if="mediaList.length > 1">
        <i class="fas fa-chevron-right"></i>
      </button>
      
      <div v-if="mediaList.length > 1" class="media-counter">
        {{ currentIndex + 1 }} / {{ mediaList.length }}
      </div>
      
      <!-- 视频时间轴控制（如果支持） -->
      <div v-if="currentMedia.type === 'video' && showTimeline" class="video-timeline-controls">
        <input
          type="range"
          min="0"
          :max="videoDuration || 100"
          :value="videoCurrentTime"
          @input="seekVideo"
          class="timeline-slider"
        />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MediaLightbox',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    media: {
      type: Object,
      default: () => ({})
    },
    mediaList: {
      type: Array,
      default: () => []
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: 0,
      videoDuration: 0,
      videoCurrentTime: 0,
      showTimeline: false
    }
  },
  computed: {
    currentMedia() {
      if (this.mediaList.length > 0) {
        return this.mediaList[this.currentIndex] || this.media
      }
      return this.media
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.currentIndex = this.initialIndex
        document.body.style.overflow = 'hidden'
        this.addKeyboardListeners()
        
        // 如果是视频，加载元数据
        if (this.currentMedia.type === 'video') {
          this.$nextTick(() => {
            if (this.$refs.videoRef) {
              this.$refs.videoRef.addEventListener('loadedmetadata', () => {
                this.videoDuration = this.$refs.videoRef.duration
                this.showTimeline = true
              })
              this.$refs.videoRef.addEventListener('timeupdate', () => {
                this.videoCurrentTime = this.$refs.videoRef.currentTime
              })
            }
          })
        }
      } else {
        document.body.style.overflow = ''
        this.removeKeyboardListeners()
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    nextMedia() {
      if (this.mediaList.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.mediaList.length
      }
    },
    prevMedia() {
      if (this.mediaList.length > 0) {
        this.currentIndex = (this.currentIndex - 1 + this.mediaList.length) % this.mediaList.length
      }
    },
    handleKeydown(e) {
      if (!this.isOpen) return
      
      switch(e.key) {
        case 'Escape':
          this.close()
          break
        case 'ArrowLeft':
          this.prevMedia()
          break
        case 'ArrowRight':
          this.nextMedia()
          break
      }
    },
    addKeyboardListeners() {
      document.addEventListener('keydown', this.handleKeydown)
    },
    removeKeyboardListeners() {
      document.removeEventListener('keydown', this.handleKeydown)
    },
    seekVideo(e) {
      if (this.$refs.videoRef) {
        this.$refs.videoRef.currentTime = parseFloat(e.target.value)
      }
    }
  },
  beforeUnmount() {
    this.removeKeyboardListeners()
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.media-lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.close-lightbox-btn {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-lightbox-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.media-container {
  position: relative;
  max-width: 100%;
  max-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.media-video {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.audio-wrapper {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.audio-visualizer {
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.audio-visualizer::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.media-audio {
  width: 100%;
}

.media-info {
  text-align: center;
  color: white;
  max-width: 800px;
}

.media-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.media-description {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.media-meta {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 14px;
  opacity: 0.8;
}

.meta-item {
  display: flex;
  gap: 8px;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 30px;
}

.next-btn {
  right: 30px;
}

.media-counter {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.video-timeline-controls {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 800px;
}

.timeline-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
}

.timeline-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.timeline-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .media-lightbox {
    padding: 20px;
  }
  
  .close-lightbox-btn {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .nav-btn {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .prev-btn {
    left: 15px;
  }
  
  .next-btn {
    right: 15px;
  }
  
  .audio-wrapper {
    width: 100%;
    max-width: 320px;
  }
}
</style>

