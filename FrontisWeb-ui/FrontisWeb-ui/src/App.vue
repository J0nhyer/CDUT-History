<template>
  <div id="app">
    <!-- 加载屏 -->
    <LoadingScreen 
      :isLoading="isLoading" 
      :progress="loadingProgress" 
      :loadingText="loadingText" 
    />
    
    <main class="page-container" v-show="!isLoading">
      <router-view></router-view>
    </main>

  </div>
  
</template>

<script>
import LoadingScreen from './components/LoadingScreen.vue'

export default {
  name: 'App',
  components: { 
    LoadingScreen
  },
  data() {
    return { 
      isLoading: true,
      loadingProgress: 0,
      loadingText: '正在加载资源'
    }
  },
  methods: {
    // 预加载图片资源
    async preloadImages() {
      // 动态导入图片资源
      const imageModules = import.meta.glob('@/assets/**/*.{png,jpg,jpeg,gif}', { eager: true })
      
      const images = []
      
      // 收集关键图片路径
      for (const path in imageModules) {
        // 只加载关键资源：Logo、头像、主页背景
        if (path.includes('CDUT.png') || 
            path.includes('default-avatar.png') || 
            path.includes('mainbg/')) {
          const module = imageModules[path]
          if (module.default) {
            images.push(module.default)
          }
        }
      }
      
      let loadedCount = 0
      const totalImages = Math.max(images.length, 1) // 避免除以0
      
      if (images.length === 0) {
        console.log('没有找到需要预加载的图片')
        this.loadingProgress = 80
        return
      }
      
      const loadPromises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = () => {
            loadedCount++
            this.loadingProgress = Math.floor((loadedCount / totalImages) * 80) // 图片占80%
            this.loadingText = `加载图片资源 ${loadedCount}/${totalImages}`
            resolve()
          }
          img.onerror = () => {
            console.warn(`图片加载失败: ${src}`)
            loadedCount++
            this.loadingProgress = Math.floor((loadedCount / totalImages) * 80)
            resolve() // 即使失败也继续
          }
          img.src = src
        })
      })
      
      await Promise.all(loadPromises)
    },
    
    // 预加载AI资源（检查API连接）
    async preloadAI() {
      try {
        this.loadingText = '初始化AI助手'
        this.loadingProgress = 85
        
        // 尝试预加载AI API（超时3秒）
        const resolveApiBase = () => {
          const raw = (import.meta.env.VITE_API_BASE_URL || '').trim()
          if (raw) return raw.replace(/\/+$/, '')
          if (import.meta.env.DEV) return ''
          if (typeof window !== 'undefined' && window.location?.origin) {
            return window.location.origin
          }
          return ''
        }
        
        const apiBase = resolveApiBase()
        if (apiBase) {
          try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 3000)
            
            await fetch(`${apiBase}/api/health`, {
              method: 'GET',
              signal: controller.signal
            }).catch(() => {})
            
            clearTimeout(timeoutId)
          } catch (e) {
            console.log('API预检查完成（可能离线）')
          }
        }
        
        this.loadingProgress = 95
        this.loadingText = '准备就绪'
      } catch (error) {
        console.warn('AI预加载警告:', error)
        this.loadingProgress = 95
      }
    },
    
    // 预加载关键数据
    async preloadData() {
      try {
        this.loadingText = '加载数据'
        this.loadingProgress = 90
        
        // 预加载人物数据（如果有）
        if (typeof window !== 'undefined' && window.getAllPersonProfiles) {
          try {
            await window.getAllPersonProfiles()
          } catch (e) {
            console.log('人物数据预加载（可选）')
          }
        }
        
        this.loadingProgress = 93
      } catch (error) {
        console.warn('数据预加载警告:', error)
      }
    },
    
    // 主预加载流程
    async preloadResources() {
      const startTime = Date.now()
      const minLoadingTime = 1500 // 最小加载时间1.5秒，避免一闪而过
      
      try {
        this.loadingProgress = 10
        this.loadingText = '开始加载'
        
        // 预加载图片
        await this.preloadImages()
        
        // 预加载AI
        await this.preloadAI()
        
        // 预加载数据
        await this.preloadData()
        
        // 完成
        this.loadingProgress = 100
        this.loadingText = '加载完成'
        
        // 确保最小加载时间
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime))
        }
        
        // 等待一小段时间再隐藏加载屏
        await new Promise(resolve => setTimeout(resolve, 300))
        
        this.isLoading = false
      } catch (error) {
        console.error('资源预加载失败:', error)
        
        // 确保最小加载时间后再隐藏
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime))
        }
        
        this.isLoading = false
      }
    }
  },
  
  mounted() {
    // 开始预加载
    this.preloadResources()
    
    // 安全兜底：10秒后强制显示页面（避免无限加载）
    setTimeout(() => {
      if (this.isLoading) {
        console.warn('预加载超时，强制显示页面')
        this.isLoading = false
      }
    }, 10000)
  }
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  width: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.page-container {
  min-height: 100vh;
  width: 100%;
}
</style>