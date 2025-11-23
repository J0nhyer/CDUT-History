<template>
  <div class="history-container">
    <!-- 加载遮罩层 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- 主要内容（加载完成后显示） -->
    <div v-show="!isLoading">
      <!-- 背景图片层1 -->
      <div 
        class="background-layer background-layer-1" 
        :style="{ 
          backgroundImage: currentBackgroundImage ? `url(${currentBackgroundImage})` : 'none',
          opacity: backgroundOpacity
        }"
      ></div>
      <!-- 背景图片层2 -->
      <div 
        class="background-layer background-layer-2" 
        :style="{ 
          backgroundImage: nextBackgroundImage ? `url(${nextBackgroundImage})` : 'none',
          opacity: 0
        }"
      ></div>
      
      <!-- 多个弹跳的不规则变换线条图形（物理引擎 + 混沌系统控制） -->
      <svg 
        v-for="shape in shapes"
        :key="shape.id"
        class="bouncing-shape" 
        width="150" 
        height="150" 
        viewBox="0 0 150 150"
        :style="{
          left: shape.x + 'px',
          top: shape.y + 'px',
          transform: `translate(-50%, -50%) rotate(${shape.rotation}deg) scale(${shape.scale})`,
          opacity: shape.opacity
        }">
        <path class="morphing-path"
              :d="shape.path" 
              fill="transparent" 
              stroke-linecap="round"
              stroke-linejoin="round" />
      </svg>
      
      <!-- 顶部Logo和标题 -->
      <div class="header">
      <div class="logo-section">
        <div class="logo-icon">
          <img :src="cdutLogo" alt="成都理工大学" class="logo-img" />
    </div>
        <div class="logo-text">
          <div class="university-name">成都理工大学</div>
          <div class="subtitle">CDUT 数字校史馆</div>
          </div>
        </div>
      <div class="header-right">
        <button @click="togglePlayPause" class="control-btn">
              <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            </button>
        <button @click="goHome" class="control-btn close-btn">
          <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

      <!-- 主要内容区域：连续滚动 -->
      <div class="main-content">
      <div class="timeline-wrapper" :style="{ left: translateX + 'px' }">
        <div
          v-for="(event, index) in events"
          :key="index"
          class="event-card"
          @click="viewEventDetail(event.year)"
          style="cursor: pointer;"
        >
          <div class="event-year" :style="{ visibility: isFirstOccurrenceOfYear(index) ? 'visible' : 'hidden' }">{{ getYearForEvent(index) }}</div>
          <div class="event-image-container">
            <img :src="event.image || eventImage" alt="事件" class="event-image" />
            <div class="image-overlay"></div>
            <div class="event-hover-overlay">
              <i class="fas fa-search-plus"></i>
              <span>查看详情</span>
            </div>
          </div>
          <div class="event-description" v-if="event.title">{{ event.title }}</div>
          </div>
        </div>
      </div>

      <!-- 底部时间轴 -->
      <div class="timeline-bottom">
      <!-- 棕色泥土路面 -->
      <div class="dirt-road">
      </div>
      <!-- 恐龙时间轴指示器 -->
      <div 
        class="dino-timeline-container" 
        :style="{ left: dinoPosition + 'px' }"
        @mousedown="handleDinoDragStart"
        @touchstart="handleDinoDragStart"
      >
        <div class="dino-year-display">{{ currentYear }}</div>
        <img 
          :src="dinoGif" 
          alt="恐龙" 
          class="dino-gif"
          :style="{ transform: isReversing ? 'scaleX(-1)' : 'scaleX(1)' }"
        />
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import eventImageSrc from '@/assets/艺术大楼.jpg'
import cdutLogoImg from '@/assets/CDUT.png'
import dinoGifSrc from '@/assets/dinomove.gif'

// 动态导入 history 目录下的所有图片（用于背景轮播）
const historyModules = import.meta.glob('@/assets/history/*.jpg', { eager: true })
// 提取图片URL并排序
const historyImages = Object.entries(historyModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, module]) => {
    // Vite导入的图片模块返回的是对象，需要取default属性
    return module?.default || module
  })
  .filter(Boolean) // 过滤掉无效值

// 动态导入 events 目录下的所有图片（用于事件卡片）
const eventModules = import.meta.glob('@/assets/events/*.{jpg,jpeg,png}', { eager: true })
// 创建事件图片映射
const eventImageMap = {}
Object.entries(eventModules).forEach(([path, module]) => {
  const fileName = path.split('/').pop() || ''
  const imageUrl = module?.default || module
  if (fileName && imageUrl) {
    // 移除扩展名，作为键名
    const key = fileName.replace(/\.(jpg|jpeg|png)$/i, '')
    eventImageMap[key] = imageUrl
  }
})

const router = useRouter()

// 数据配置
const startYear = 1956
const endYear = 2025
const isPlaying = ref(true)
const translateX = ref(0)
const scrollSpeed = 0.5 // 每帧移动的像素数（正常速度）
const isReversing = ref(false) // 是否正在倒播
const reverseDelayTimer = ref(null) // 倒播延迟定时器
const resumeDelayTimer = ref(null) // 恢复播放延迟定时器
const isDragging = ref(false) // 是否正在拖拽恐龙
const dragStartX = ref(0)
const dragStartDinoX = ref(0)
const dragStartTranslateX = ref(0)

// 卡片尺寸配置
const cardWidth = 480 // 卡片宽度
const gap = 120 // 卡片间距

// 使用艺术大楼图片
const eventImage = eventImageSrc
const cdutLogo = cdutLogoImg
const dinoGif = dinoGifSrc

// 背景图片轮播相关 - 完全重新实现
const backgroundImageIndex = ref(0)
const currentBackgroundImage = ref(historyImages.length > 0 ? historyImages[0] : '')
const nextBackgroundImage = ref('')
const backgroundOpacity = ref(1) // layer-1的透明度
const backgroundTimer = ref(null)
const SLIDE_INTERVAL = 6000 // 每张图片显示6秒（包括过渡时间）

// 物理引擎 - 多个弹跳图形
const shapes = ref([]) // 存储多个图形
const minShapes = 3 // 最少保持3个图形
const maxShapes = 6 // 最多6个图形
const shapeSize = 150 // 图形尺寸
const bounceAnimationId = ref(null)

// 图片映射配置（前端本地资源）
const imageMapping = {
  '1956': '1956_01_成都地质勘探学院成立',
  '1958': '1958年更名为成都地质学院',
  '1990': '1990年油气藏重点实验室获批建设',
  '1993': '1993年学校更名庆祝大会',
  '1995': '1995年油气藏重点实验室通过验收',
  '2000': '2000年乐山分院挂牌暨开学典礼',
  '2001': '2001年成都理工大学组建成立大会',
  '2005': '2005年三代理工人共同托举红灿灿的集体成果',
  '2007': '2007年地质灾害防治与地质环境保护国家重点实验室被正式批准建设',
  '2008': '2008年学校多位专家赴汶川地震实地考察',
  '2010': '2010年国土资源部与四川省共建成都理工大学签字仪式',
  '2011': '2011年党代会现场',
  '2012': '2012年学校毕业生就业工作获表彰',
  '2013': '2013年理工东苑奠基仪式现场',
  '2015': '2015年地质工程评估小组与评审专家合影',
  '2016': '2016年学校东区航拍图',
  '2019': '2019年英国牛津布鲁克斯大学校长阿里斯特･菲特致辞',
  '2020': '2020年仪式现场',
  '2022': '2022年成都自然博物馆正式开放',
  '2023': '2023年会议现场',
  '2024': '2024年国家科技进步二等奖',
  '2025': '2025年签署战略合作协议现场'
}

// 历史事件数据 - 从后端API获取
const events = ref([])
const eventCount = ref(0) // 使用ref而不是computed，避免初始化时为0

// 从后端API加载历史事件数据
const loadHistoryEvents = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/history/events')
    if (response.data && response.data.success) {
      const eventsData = response.data.data || []
      
      // 转换数据格式
      events.value = eventsData.map(event => {
        const year = event.year
        
        // 根据年份从imageMapping获取图片名称
        let imageUrl = eventImage // 默认图片
        const imageName = imageMapping[year]
        if (imageName && eventImageMap[imageName]) {
          imageUrl = eventImageMap[imageName]
        }
        
        return {
          title: event.title,
          description: event.description || '',
          year: year,
          image: imageUrl
        }
      })
      
      eventCount.value = events.value.length
      console.log('历史事件数据加载成功:', events.value.length)
    } else {
      console.error('加载历史事件失败:', response.data?.message)
    }
  } catch (error) {
    console.error('加载历史事件数据出错:', error)
  }
}

// 计算每个事件对应的年份
const getYearForEvent = (index) => {
  return events.value[index]?.year || startYear
}

// 判断该年份是否是第一次出现
const isFirstOccurrenceOfYear = (index) => {
  const currentYear = events.value[index]?.year
  if (!currentYear) return false
  
  // 检查前面是否有相同年份的事件
  for (let i = 0; i < index; i++) {
    if (events.value[i]?.year === currentYear) {
      return false
    }
  }
  return true
}

// 窗口宽度（响应式）
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)

// 计算总滚动距离（当最后一个卡片完全从右边消失时）
const totalScrollDistance = computed(() => {
  const totalCardWidth = cardWidth + gap
  // 初始位置：第一个卡片从右边出现（translateX = windowWidth/2）
  // 最终位置：最后一个卡片完全从左边消失
  // 需要滚动的距离 = 所有卡片的总宽度 + 屏幕宽度（让最后一个卡片完全消失）
  return totalCardWidth * eventCount.value + windowWidth.value
})

// 计算滚动进度（0到1）
const scrollProgress = computed(() => {
  const initialX = windowWidth.value / 2
  const currentScrollDistance = initialX - translateX.value
  const progress = Math.max(0, Math.min(1, currentScrollDistance / totalScrollDistance.value))
  return progress
})

// 计算当前年份（基于屏幕中间的事件卡片）
const currentYear = computed(() => {
  if (events.value.length === 0) return startYear
  
  const centerX = windowWidth.value / 2
  const cardWidthWithGap = cardWidth + gap
  
  // 计算每个卡片相对于屏幕中心的位置，找出最接近屏幕中心的卡片
  // timeline-wrapper的left位置是translateX，所以卡片的实际位置是：
  // 卡片左边位置 = translateX + index * cardWidthWithGap
  // 卡片中心位置 = 卡片左边位置 + cardWidth / 2
  let closestIndex = 0
  let minDistance = Infinity
  
  events.value.forEach((event, index) => {
    // 计算卡片的中心位置
    const cardLeft = translateX.value + index * cardWidthWithGap
    const cardCenter = cardLeft + cardWidth / 2
    const distance = Math.abs(cardCenter - centerX)
    
    if (distance < minDistance) {
      minDistance = distance
      closestIndex = index
    }
  })
  
  const index = Math.max(0, Math.min(events.value.length - 1, closestIndex))
  return events.value[index]?.year || startYear
})

// 计算恐龙位置（从最左边到最右边，与滚动进度同步）
const dinoPosition = computed(() => {
  // 恐龙宽度的一半（因为使用了translateX(-50%)，所以需要从恐龙宽度的一半开始）
  const dinoWidth = 200 // 恐龙GIF的宽度
  const dinoOffset = dinoWidth / 2
  
  // 恐龙从屏幕左边开始，到屏幕右边结束
  // 起始位置：dinoOffset（确保恐龙完全可见）
  // 结束位置：windowWidth - dinoOffset（确保恐龙完全可见）
  const startPos = dinoOffset
  const endPos = windowWidth.value - dinoOffset
  
  // 根据滚动进度计算位置
  return startPos + scrollProgress.value * (endPos - startPos)
})

// 播放控制
let animationFrameId = null

// 连续滚动动画
const animateScroll = () => {
  if (!isPlaying.value) return
  
  // 检查是否到达结尾或开头
  const initialX = windowWidth.value / 2
  const currentScrollDistance = initialX - translateX.value
  
  // 到达结尾，延迟1秒后开始倒播
  if (currentScrollDistance >= totalScrollDistance.value && !isReversing.value) {
    // 停止播放和动画
    isPlaying.value = false
    stopAutoScroll()
    
    // 清除之前的延迟定时器
    if (reverseDelayTimer.value) {
      clearTimeout(reverseDelayTimer.value)
    }
    
    // 1秒后开始倒播
    reverseDelayTimer.value = setTimeout(() => {
      isReversing.value = true
      isPlaying.value = true
      startAutoScroll()
    }, 1000) // 1秒延迟
    
    return // 停止继续执行动画
  }
  // 到达开头，延迟1秒后恢复正常播放
  else if (translateX.value >= initialX && isReversing.value) {
    // 停止播放和动画
    isPlaying.value = false
    stopAutoScroll()
    
    // 清除之前的延迟定时器
    if (resumeDelayTimer.value) {
      clearTimeout(resumeDelayTimer.value)
    }
    
    // 1秒后恢复播放
    resumeDelayTimer.value = setTimeout(() => {
      isReversing.value = false
      isPlaying.value = true
      startAutoScroll()
    }, 1000) // 1秒延迟
    
    return // 停止继续执行动画
  }
  
  // 正常播放或倒播
  if (isReversing.value) {
    translateX.value += scrollSpeed * 50 // 倒播：向右移动，速度加快50倍
    } else {
    translateX.value -= scrollSpeed // 正常播放：向左移动
  }
  
  animationFrameId = requestAnimationFrame(animateScroll)
}

// 开始滚动
const startAutoScroll = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (isPlaying.value) {
    animateScroll()
  }
}

// 停止滚动
const stopAutoScroll = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// 暂停/继续
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoScroll()
      } else {
    stopAutoScroll()
  }
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 查看事件详情
const viewEventDetail = (year) => {
  router.push({
    path: `/event/${year}`,
    query: { from: 'digital-history' }
  })
}

// 背景图片轮播 - 完全重新实现
const startBackgroundSlide = () => {
  // 如果没有图片或只有一张，不启动轮播
  if (historyImages.length <= 1) return
  
  // 停止之前的定时器
  stopBackgroundSlide()
  
  // 预加载所有图片，避免切换时闪烁
  historyImages.forEach(imgUrl => {
    if (imgUrl) {
      const img = new Image()
      img.src = imgUrl
    }
  })
  
  // 启动轮播定时器
  backgroundTimer.value = setInterval(() => {
    switchBackground()
  }, SLIDE_INTERVAL)
}

// 切换背景图片
const switchBackground = () => {
  if (historyImages.length <= 1) return
  
  // 计算下一张图片索引
  const nextIndex = (backgroundImageIndex.value + 1) % historyImages.length
  const nextImgUrl = historyImages[nextIndex]
  
  if (!nextImgUrl) return
  
  // 第一步：先隐藏当前背景（让背景为空）
  backgroundOpacity.value = 0
  
  // 等待过渡完成后再更新图片和显示
  setTimeout(() => {
    // 第二步：更新当前层的图片URL为新图片
    currentBackgroundImage.value = nextImgUrl
    
    // 第三步：显示新背景
    backgroundOpacity.value = 1
    
    // 更新索引
    backgroundImageIndex.value = nextIndex
    
    // 预加载下下张图片（提前准备）
    const nextNextIndex = (nextIndex + 1) % historyImages.length
    const nextNextImgUrl = historyImages[nextNextIndex]
    if (nextNextImgUrl) {
      // 预加载图片
      const img = new Image()
      img.src = nextNextImgUrl
    }
  }, 800) // 等待0.8秒过渡时间完成
}

// 停止背景轮播
const stopBackgroundSlide = () => {
  if (backgroundTimer.value) {
    clearInterval(backgroundTimer.value)
    backgroundTimer.value = null
  }
}

// 处理恐龙拖拽开始
const handleDinoDragStart = (e) => {
  e.preventDefault()
  isDragging.value = true
  stopAutoScroll() // 停止自动滚动，但不改变isPlaying状态
  
  // 获取起始位置
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  dragStartX.value = clientX
  dragStartDinoX.value = dinoPosition.value
  dragStartTranslateX.value = translateX.value
  
  // 添加事件监听
  document.addEventListener('mousemove', handleDinoDrag)
  document.addEventListener('mouseup', handleDinoDragEnd)
  document.addEventListener('touchmove', handleDinoDrag)
  document.addEventListener('touchend', handleDinoDragEnd)
}

// 处理恐龙拖拽中
const handleDinoDrag = (e) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const deltaX = clientX - dragStartX.value
  
  // 计算新的恐龙位置（限制在有效范围内）
  const dinoWidth = 200
  const dinoOffset = dinoWidth / 2
  const startPos = dinoOffset
  const endPos = windowWidth.value - dinoOffset
  const newDinoX = Math.max(startPos, Math.min(endPos, dragStartDinoX.value + deltaX))
  
  // 根据恐龙位置计算滚动进度
  const newProgress = (newDinoX - startPos) / (endPos - startPos)
  
  // 根据滚动进度计算 translateX
  const initialX = windowWidth.value / 2
  const currentScrollDistance = newProgress * totalScrollDistance.value
  translateX.value = initialX - currentScrollDistance
}

// 处理恐龙拖拽结束
const handleDinoDragEnd = (e) => {
  if (!isDragging.value) return
  
  isDragging.value = false
  
  // 移除事件监听
  document.removeEventListener('mousemove', handleDinoDrag)
  document.removeEventListener('mouseup', handleDinoDragEnd)
  document.removeEventListener('touchmove', handleDinoDrag)
  document.removeEventListener('touchend', handleDinoDragEnd)
  
  // 拖拽结束后恢复自动播放（如果之前在播放的话）
  if (isPlaying.value) {
    startAutoScroll()
  }
}

// 图片预加载相关
const isLoading = ref(true)
const loadingProgress = ref(0)
const totalImages = ref(0)
const loadedImages = ref(0)

// 收集所有需要加载的图片URL
const collectAllImages = () => {
  const allImages = []
  const imageSet = new Set() // 用于去重
  
  // 1. 收集历史背景图片
  historyImages.forEach(imgUrl => {
    if (imgUrl && !imageSet.has(imgUrl)) {
      allImages.push(imgUrl)
      imageSet.add(imgUrl)
    }
  })
  
  // 2. 收集事件图片
  events.value.forEach(event => {
    if (event.image && !imageSet.has(event.image)) {
      allImages.push(event.image)
      imageSet.add(event.image)
    }
  })
  
  // 3. 收集固定图片
  if (cdutLogo && !imageSet.has(cdutLogo)) {
    allImages.push(cdutLogo)
    imageSet.add(cdutLogo)
  }
  if (dinoGif && !imageSet.has(dinoGif)) {
    allImages.push(dinoGif)
    imageSet.add(dinoGif)
  }
  if (eventImage && !imageSet.has(eventImage)) {
    allImages.push(eventImage)
    imageSet.add(eventImage)
  }
  
  return allImages
}

// 预加载所有图片
const preloadAllImages = async () => {
  const allImages = collectAllImages()
  totalImages.value = allImages.length
  loadedImages.value = 0
  
  if (totalImages.value === 0) {
    isLoading.value = false
    return
  }
  
  // 创建Promise数组来加载所有图片
  const loadPromises = allImages.map((imgUrl, index) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        loadedImages.value++
        loadingProgress.value = (loadedImages.value / totalImages.value) * 100
        resolve(imgUrl)
      }
      img.onerror = () => {
        // 即使加载失败也计数，避免卡住
        loadedImages.value++
        loadingProgress.value = (loadedImages.value / totalImages.value) * 100
        console.warn(`图片加载失败: ${imgUrl}`)
        resolve(imgUrl) // 仍然resolve，避免阻塞其他图片加载
      }
      img.src = imgUrl
    })
  })
  
  // 等待所有图片加载完成
  try {
    await Promise.all(loadPromises)
    // 所有图片加载完成后，延迟一小段时间再显示页面（让用户看到100%）
    setTimeout(() => {
      isLoading.value = false
      // 页面加载完成后，初始化内容
      nextTick(() => {
        translateX.value = windowWidth.value / 2
        // 启动滚动
        if (isPlaying.value) {
          startAutoScroll()
        }
        // 启动背景图片轮播
        startBackgroundSlide()
      })
    }, 300)
  } catch (error) {
    console.error('图片预加载出错:', error)
    // 即使出错也显示页面，避免一直卡在加载页面
    isLoading.value = false
  }
}

// 创建单个图形对象
const createShape = (x = null, y = null) => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  
  // 随机位置（如果没有指定）
  const posX = x !== null ? x : Math.random() * (vw - shapeSize) + shapeSize / 2
  const posY = y !== null ? y : Math.random() * (vh - shapeSize) + shapeSize / 2
  
  // 随机速度
  const speed = 1.5 + Math.random() * 2
  const angle = Math.random() * Math.PI * 2
  
  const numPoints = 3 + Math.floor(Math.random() * 10) // 3-12个顶点
  const points = []
  const phases = []
  
  for (let i = 0; i < numPoints; i++) {
    const pointAngle = (i / numPoints) * Math.PI * 2
    const radius = 50 + Math.random() * 20
    points.push({
      angle: pointAngle,
      radius: radius,
      baseRadius: radius,
      radiusSpeed: 0.3 + Math.random() * 0.5,
      angleSpeed: 0.01 + Math.random() * 0.02,
      chaosX: Math.random() * 10 - 5,
      chaosY: Math.random() * 10 - 5,
      chaosSpeedX: (Math.random() - 0.5) * 0.3,
      chaosSpeedY: (Math.random() - 0.5) * 0.3
    })
    phases.push(Math.random() * Math.PI * 2)
  }
  
  return {
    id: Date.now() + Math.random(),
    x: posX,
    y: posY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    rotation: Math.random() * 360,
    rotationSpeed: 1 + Math.random() * 2,
    scale: 0.8 + Math.random() * 0.5,
    scaleSpeed: 0.005 + Math.random() * 0.01,
    opacity: 0.5 + Math.random() * 0.3,
    numPoints: numPoints,
    points: points,
    phases: phases,
    path: '',
    lifetime: 10000 + Math.random() * 20000, // 10-30秒生命周期
    createdAt: Date.now()
  }
}

// 更新单个图形的路径 - 混沌变化
const updateShapePath = (shape) => {
  const centerX = 75
  const centerY = 75
  
  // 更新每个点的位置（混沌变化）
  shape.points.forEach((point, i) => {
    // 相位更新
    shape.phases[i] += point.angleSpeed
    
    // 半径振荡（类似摆动）
    point.radius = point.baseRadius + Math.sin(shape.phases[i]) * 15
    
    // 角度微调（产生扭曲）
    point.angle += point.angleSpeed * 0.5
    
    // 混沌偏移更新
    point.chaosX += point.chaosSpeedX
    point.chaosY += point.chaosSpeedY
    
    // 混沌偏移边界（避免偏移太大）
    if (Math.abs(point.chaosX) > 15) point.chaosSpeedX *= -1
    if (Math.abs(point.chaosY) > 15) point.chaosSpeedY *= -1
    
    // 随机扰动（增加混沌感）
    if (Math.random() > 0.98) {
      point.chaosSpeedX += (Math.random() - 0.5) * 0.2
      point.chaosSpeedY += (Math.random() - 0.5) * 0.2
    }
  })
  
  // 随机改变顶点数量（3到12之间）
  if (Math.random() > 0.995) {
    const newNumPoints = 3 + Math.floor(Math.random() * 10)
    const newPoints = []
    const newPhases = []
    
    for (let i = 0; i < newNumPoints; i++) {
      const pointAngle = (i / newNumPoints) * Math.PI * 2
      const radius = 50 + Math.random() * 20
      newPoints.push({
        angle: pointAngle,
        radius: radius,
        baseRadius: radius,
        radiusSpeed: 0.3 + Math.random() * 0.5,
        angleSpeed: 0.01 + Math.random() * 0.02,
        chaosX: Math.random() * 10 - 5,
        chaosY: Math.random() * 10 - 5,
        chaosSpeedX: (Math.random() - 0.5) * 0.3,
        chaosSpeedY: (Math.random() - 0.5) * 0.3
      })
      newPhases.push(Math.random() * Math.PI * 2)
    }
    
    shape.numPoints = newNumPoints
    shape.points = newPoints
    shape.phases = newPhases
  }
  
  // 生成SVG路径
  let path = ''
  shape.points.forEach((point, i) => {
    const x = centerX + Math.cos(point.angle) * point.radius + point.chaosX
    const y = centerY + Math.sin(point.angle) * point.radius + point.chaosY
    
    if (i === 0) {
      path += `M ${x},${y}`
    } else {
      path += ` L ${x},${y}`
    }
  })
  path += ' Z' // 闭合路径
  
  shape.path = path
}

// 物理引擎 - 更新所有弹跳图形
const updateBouncingShape = () => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const now = Date.now()
  const halfSize = shapeSize / 2
  
  // 更新每个图形
  shapes.value.forEach((shape) => {
    // 更新位置
    shape.x += shape.vx
    shape.y += shape.vy
    
    // 左右边界反弹
    if (shape.x - halfSize <= 0) {
      shape.x = halfSize
      shape.vx = Math.abs(shape.vx)
      shape.rotationSpeed *= -1
    } else if (shape.x + halfSize >= vw) {
      shape.x = vw - halfSize
      shape.vx = -Math.abs(shape.vx)
      shape.rotationSpeed *= -1
    }
    
    // 上下边界反弹
    if (shape.y - halfSize <= 0) {
      shape.y = halfSize
      shape.vy = Math.abs(shape.vy)
      shape.rotationSpeed *= -1
    } else if (shape.y + halfSize >= vh) {
      shape.y = vh - halfSize
      shape.vy = -Math.abs(shape.vy)
      shape.rotationSpeed *= -1
    }
    
    // 更新旋转
    shape.rotation += shape.rotationSpeed
    
    // 更新缩放
    shape.scale += shape.scaleSpeed
    if (shape.scale >= 1.3 || shape.scale <= 0.7) {
      shape.scaleSpeed *= -1
    }
    
    // 更新透明度
    if (Math.random() > 0.95) {
      shape.opacity = 0.5 + Math.random() * 0.3
    }
    
    // 更新形状路径
    updateShapePath(shape)
  })
  
  // 管理图形数量：移除过期的图形
  shapes.value = shapes.value.filter(shape => {
    const age = now - shape.createdAt
    return age < shape.lifetime
  })
  
  // 确保至少有minShapes个图形
  while (shapes.value.length < minShapes) {
    shapes.value.push(createShape())
  }
  
  // 随机添加新图形（如果少于maxShapes）
  if (shapes.value.length < maxShapes && Math.random() > 0.99) {
    shapes.value.push(createShape())
  }
  
  // 继续动画
  bounceAnimationId.value = requestAnimationFrame(updateBouncingShape)
}

// 启动物理引擎
const startBounceAnimation = () => {
  if (bounceAnimationId.value) {
    cancelAnimationFrame(bounceAnimationId.value)
  }
  
  // 初始化最少数量的图形
  shapes.value = []
  for (let i = 0; i < minShapes; i++) {
    shapes.value.push(createShape())
  }
  
  updateBouncingShape()
}

// 停止物理引擎
const stopBounceAnimation = () => {
  if (bounceAnimationId.value) {
    cancelAnimationFrame(bounceAnimationId.value)
    bounceAnimationId.value = null
  }
}

// 窗口大小变化处理
let resizeHandler = null

onMounted(async () => {
  // 更新窗口宽度
  windowWidth.value = window.innerWidth
  
  // 监听窗口大小变化
  resizeHandler = () => {
    windowWidth.value = window.innerWidth
  }
  window.addEventListener('resize', resizeHandler)
  
  // 先加载历史事件数据
  await loadHistoryEvents()
  
  // 然后预加载所有图片
  preloadAllImages()
  
  // 启动物理引擎
  startBounceAnimation()
})

onUnmounted(() => {
  stopAutoScroll()
  stopBackgroundSlide()
  stopBounceAnimation()
  // 清理窗口大小监听
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  // 清理倒播延迟定时器
  if (reverseDelayTimer.value) {
    clearTimeout(reverseDelayTimer.value)
  }
  // 清理恢复播放延迟定时器
  if (resumeDelayTimer.value) {
    clearTimeout(resumeDelayTimer.value)
  }
})
</script>

<style scoped>
.history-container {
  position: relative;
  min-height: 100vh;
  background: #000000; /* 黑色背景 */
  font-family: 'Arial', sans-serif;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 加载遮罩层 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 背景图片层 */
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #000000; /* 黑色底色 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.8s ease-in-out;
  /* 轻微模糊 + 大幅降低亮度 + 保留色彩 */
  filter: brightness(0.3) blur(1px) saturate(0.6);
  opacity: 0.6;
}

.background-layer-1 {
  z-index: 0;
}

.background-layer-2 {
  z-index: -1;
}

/* 顶部Header */
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 2px solid rgba(139, 69, 19, 0.2);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.university-name {
  font-size: 24px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: white;
  font-weight: 600;
  letter-spacing: 2px;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 15px;
}

.control-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #5C4033;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
}

/* 主要内容区域 */
.main-content {
  position: absolute;
  top: 120px;
  left: 0;
  right: 0;
  bottom: 120px; /* 为底部时间轴留出空间 */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5; /* 确保内容在线条流动层之上 */
  background: transparent !important; /* 关键：设置透明背景 */
}

/* 底部时间轴 */
.timeline-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 140px; /* 从120px增加到140px，适应更高的路面 */
  z-index: 10;
  background: transparent;
}

/* 棕色泥土路面 */
.dirt-road {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px; /* 降低高度 */
  overflow: hidden;
  /* 添加起伏的上边缘 - 使用SVG路径创建波浪效果 */
  clip-path: polygon(
    0% 25%,
    5% 20%,
    10% 22%,
    15% 18%,
    20% 24%,
    25% 19%,
    30% 23%,
    35% 17%,
    40% 21%,
    45% 25%,
    50% 19%,
    55% 23%,
    60% 18%,
    65% 22%,
    70% 20%,
    75% 24%,
    80% 19%,
    85% 23%,
    90% 18%,
    95% 22%,
    100% 25%,
    100% 100%,
    0% 100%
  );
  /* 基础渐变背景 - 半透明 */
  background: linear-gradient(to bottom,
    rgba(139, 111, 71, 0.6) 0%,
    rgba(122, 96, 66, 0.6) 15%,
    rgba(107, 85, 56, 0.6) 30%,
    rgba(95, 74, 51, 0.6) 45%,
    rgba(92, 69, 48, 0.6) 60%,
    rgba(82, 62, 40, 0.6) 75%,
    rgba(74, 54, 36, 0.6) 100%
  );
  box-shadow: 
    inset 0 -10px 20px rgba(0, 0, 0, 0.3),
    inset 0 5px 10px rgba(139, 111, 71, 0.2);
  z-index: 1;
  opacity: 0.8; /* 整体半透明效果 */
}

/* 沙砾纹理层 - 使用::before添加大颗粒 */
.dirt-road::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  /* 大颗粒沙砾 - 增强可见度 */
  background-image: 
    /* 第一层：大颗粒 */
    radial-gradient(circle at 12% 28%, rgba(74, 54, 36, 1) 3px, transparent 3px),
    radial-gradient(circle at 68% 72%, rgba(92, 69, 48, 1) 3px, transparent 3px),
    radial-gradient(circle at 38% 52%, rgba(107, 85, 56, 1) 2.5px, transparent 2.5px),
    radial-gradient(circle at 82% 32%, rgba(74, 54, 36, 1) 3px, transparent 3px),
    radial-gradient(circle at 52% 88%, rgba(92, 69, 48, 1) 3px, transparent 3px),
    radial-gradient(circle at 28% 68%, rgba(107, 85, 56, 1) 2.5px, transparent 2.5px),
    radial-gradient(circle at 72% 18%, rgba(74, 54, 36, 1) 3px, transparent 3px),
    radial-gradient(circle at 45% 48%, rgba(92, 69, 48, 1) 2.5px, transparent 2.5px),
    /* 第二层：中等颗粒 */
    radial-gradient(circle at 18% 35%, rgba(139, 111, 71, 0.9) 2px, transparent 2px),
    radial-gradient(circle at 58% 65%, rgba(107, 85, 56, 0.9) 2px, transparent 2px),
    radial-gradient(circle at 35% 58%, rgba(92, 69, 48, 0.9) 2px, transparent 2px),
    radial-gradient(circle at 88% 25%, rgba(74, 54, 36, 0.9) 2px, transparent 2px),
    radial-gradient(circle at 48% 75%, rgba(139, 111, 71, 0.9) 2px, transparent 2px),
    radial-gradient(circle at 25% 42%, rgba(107, 85, 56, 0.9) 2px, transparent 2px),
    radial-gradient(circle at 75% 55%, rgba(92, 69, 48, 0.9) 2px, transparent 2px),
    radial-gradient(circle at 62% 38%, rgba(74, 54, 36, 0.9) 2px, transparent 2px);
  background-size: 
    150px 150px,
    140px 140px,
    130px 130px,
    145px 145px,
    135px 135px,
    155px 155px,
    125px 125px,
    160px 160px,
    120px 120px,
    110px 110px,
    115px 115px,
    125px 125px,
    118px 118px,
    128px 128px,
    132px 132px,
    122px 122px;
  background-position: 
    0 0,
    50px 30px,
    100px 60px,
    150px 90px,
    200px 120px,
    250px 150px,
    300px 180px,
    350px 210px,
    0 20px,
    80px 50px,
    160px 80px,
    240px 110px,
    320px 140px,
    400px 170px,
    480px 200px,
    560px 230px;
  pointer-events: none;
  mix-blend-mode: multiply;
}

/* 小颗粒纹理层 - 使用::after添加细颗粒和纹理 */
.dirt-road::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  /* 小颗粒沙砾 - 密集分布 */
  background-image: 
    /* 密集小颗粒层 */
    radial-gradient(circle at 8% 22%, rgba(74, 54, 36, 0.8) 1.5px, transparent 1.5px),
    radial-gradient(circle at 15% 45%, rgba(92, 69, 48, 0.8) 1px, transparent 1px),
    radial-gradient(circle at 22% 68%, rgba(107, 85, 56, 0.8) 1.2px, transparent 1.2px),
    radial-gradient(circle at 30% 35%, rgba(74, 54, 36, 0.8) 1px, transparent 1px),
    radial-gradient(circle at 38% 58%, rgba(92, 69, 48, 0.8) 1.3px, transparent 1.3px),
    radial-gradient(circle at 45% 82%, rgba(107, 85, 56, 0.8) 1px, transparent 1px),
    radial-gradient(circle at 52% 28%, rgba(74, 54, 36, 0.8) 1.2px, transparent 1.2px),
    radial-gradient(circle at 60% 52%, rgba(92, 69, 48, 0.8) 1px, transparent 1px),
    radial-gradient(circle at 68% 75%, rgba(107, 85, 56, 0.8) 1.3px, transparent 1.3px),
    radial-gradient(circle at 75% 42%, rgba(74, 54, 36, 0.8) 1px, transparent 1px),
    radial-gradient(circle at 82% 65%, rgba(92, 69, 48, 0.8) 1.2px, transparent 1.2px),
    radial-gradient(circle at 88% 88%, rgba(107, 85, 56, 0.8) 1px, transparent 1px),
    /* 极细颗粒层 */
    radial-gradient(circle at 10% 30%, rgba(139, 111, 71, 0.6) 0.8px, transparent 0.8px),
    radial-gradient(circle at 20% 55%, rgba(107, 85, 56, 0.6) 0.7px, transparent 0.7px),
    radial-gradient(circle at 30% 78%, rgba(92, 69, 48, 0.6) 0.8px, transparent 0.8px),
    radial-gradient(circle at 40% 38%, rgba(74, 54, 36, 0.6) 0.7px, transparent 0.7px),
    radial-gradient(circle at 50% 62%, rgba(139, 111, 71, 0.6) 0.8px, transparent 0.8px),
    radial-gradient(circle at 60% 85%, rgba(107, 85, 56, 0.6) 0.7px, transparent 0.7px),
    radial-gradient(circle at 70% 48%, rgba(92, 69, 48, 0.6) 0.8px, transparent 0.8px),
    radial-gradient(circle at 80% 72%, rgba(74, 54, 36, 0.6) 0.7px, transparent 0.7px),
    radial-gradient(circle at 90% 95%, rgba(139, 111, 71, 0.6) 0.8px, transparent 0.8px);
  background-size: 
    80px 80px,
    75px 75px,
    85px 85px,
    70px 70px,
    90px 90px,
    65px 65px,
    95px 95px,
    72px 72px,
    88px 88px,
    68px 68px,
    92px 92px,
    78px 78px,
    50px 50px,
    55px 55px,
    48px 48px,
    52px 52px,
    45px 45px,
    58px 58px,
    42px 42px,
    60px 60px,
    47px 47px;
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0.9;
}

/* 小草和小花装饰层 */
.grass-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  z-index: 4;
  pointer-events: none;
}

/* 小草样式 */
.grass {
  position: absolute;
  bottom: 55px; /* 与小恐龙底部齐平 */
  width: 3px;
  height: 20px;
  background: linear-gradient(to top, #3d7a2f 0%, #4a9a3f 50%, #5db055 100%);
  border-radius: 2px 2px 0 0;
  transform-origin: bottom center;
}

.grass::before {
  content: '';
  position: absolute;
  bottom: 15px;
  left: -2px;
  width: 2px;
  height: 12px;
  background: linear-gradient(to top, #3d7a2f 0%, #4a9a3f 50%, #5db055 100%);
  border-radius: 1px;
  transform-origin: bottom center;
  transform: rotate(-15deg);
}

.grass::after {
  content: '';
  position: absolute;
  bottom: 15px;
  right: -2px;
  width: 2px;
  height: 12px;
  background: linear-gradient(to top, #3d7a2f 0%, #4a9a3f 50%, #5db055 100%);
  border-radius: 1px;
  transform-origin: bottom center;
  transform: rotate(15deg);
}

/* 小花样式 */
.flower {
  position: absolute;
  bottom: 55px; /* 与小恐龙底部齐平 */
  width: 5px;
  height: 12px;
  background: #2d5016;
  border-radius: 2px 2px 0 0;
  transform-origin: bottom center;
}

.flower::before {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50% 50% 50% 0;
  background: radial-gradient(circle, #ffeb3b 30%, #ff9800 70%);
  box-shadow: 
    -6px 0 0 -1px #ffeb3b,
    6px 0 0 -1px #ffeb3b,
    0 -6px 0 -1px #ffeb3b,
    0 6px 0 -1px #ffeb3b;
  transform: translateX(-50%) rotate(45deg);
}

.flower::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #ff5722;
}

/* 红色小花样式 */
.red-flower {
  position: absolute;
  bottom: 55px; /* 与小恐龙底部齐平 */
  width: 5px;
  height: 12px;
  background: #2d5016;
  border-radius: 2px 2px 0 0;
  transform-origin: bottom center;
}

.red-flower::before {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50% 50% 50% 0;
  background: radial-gradient(circle, #ff4757 30%, #ff3838 70%);
  box-shadow: 
    -6px 0 0 -1px #ff4757,
    6px 0 0 -1px #ff4757,
    0 -6px 0 -1px #ff4757,
    0 6px 0 -1px #ff4757;
  transform: translateX(-50%) rotate(45deg);
}

.red-flower::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #fff;
}

/* 摇摆动画 */
@keyframes sway-left {
  0%, 100% { transform: rotate(-6deg); }
  50% { transform: rotate(6deg); }
}

@keyframes sway-right {
  0%, 100% { transform: rotate(6deg); }
  50% { transform: rotate(-6deg); }
}

@keyframes sway-slow {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

/* 小草和小花的位置及动画 */
.grass-1 {
  left: 8%;
  height: 18px;
  animation: sway-left 3s ease-in-out infinite;
}

.grass-2 {
  left: 15%;
  height: 22px;
  animation: sway-right 3.5s ease-in-out infinite;
}

.grass-3 {
  left: 23%;
  height: 20px;
  animation: sway-slow 4s ease-in-out infinite;
}

.flower-1 {
  left: 30%;
  animation: sway-left 3.2s ease-in-out infinite;
}

.grass-4 {
  left: 38%;
  height: 19px;
  animation: sway-right 3.8s ease-in-out infinite;
}

.flower-2 {
  left: 45%;
  animation: sway-slow 4.2s ease-in-out infinite;
}

.grass-5 {
  left: 52%;
  height: 21px;
  animation: sway-left 3.3s ease-in-out infinite;
}

.grass-6 {
  left: 58%;
  height: 17px;
  animation: sway-right 3.6s ease-in-out infinite;
}

.flower-3 {
  left: 65%;
  animation: sway-slow 4.1s ease-in-out infinite;
}

.grass-7 {
  left: 72%;
  height: 20px;
  animation: sway-left 3.4s ease-in-out infinite;
}

.grass-8 {
  left: 78%;
  height: 19px;
  animation: sway-right 3.7s ease-in-out infinite;
}

.flower-4 {
  left: 85%;
  animation: sway-slow 4.3s ease-in-out infinite;
}

.grass-9 {
  left: 90%;
  height: 18px;
  animation: sway-left 3.5s ease-in-out infinite;
}

.grass-10 {
  left: 95%;
  height: 22px;
  animation: sway-right 4s ease-in-out infinite;
}

.flower-5 {
  left: 88%;
  animation: sway-slow 3.9s ease-in-out infinite;
}

.red-flower-1 {
  left: 42%;
  animation: sway-left 3.6s ease-in-out infinite;
}

.red-flower-2 {
  left: 68%;
  animation: sway-right 3.9s ease-in-out infinite;
}

.red-flower-3 {
  left: 92%;
  animation: sway-slow 4.1s ease-in-out infinite;
}

.grass-11 {
  left: 12%;
  height: 19px;
  animation: sway-right 3.3s ease-in-out infinite;
}

.grass-12 {
  left: 40%;
  height: 21px;
  animation: sway-left 3.7s ease-in-out infinite;
}

.grass-13 {
  left: 50%;
  height: 18px;
  animation: sway-slow 3.8s ease-in-out infinite;
}

.grass-14 {
  left: 62%;
  height: 20px;
  animation: sway-left 3.5s ease-in-out infinite;
}

.grass-15 {
  left: 75%;
  height: 19px;
  animation: sway-right 3.6s ease-in-out infinite;
}

.grass-16 {
  left: 81%;
  height: 22px;
  animation: sway-slow 4s ease-in-out infinite;
}

.grass-17 {
  left: 86%;
  height: 18px;
  animation: sway-left 3.4s ease-in-out infinite;
}

.grass-18 {
  left: 93%;
  height: 20px;
  animation: sway-right 3.9s ease-in-out infinite;
}

.grass-19 {
  left: 5%;
  height: 21px;
  animation: sway-slow 3.2s ease-in-out infinite;
}

.grass-20 {
  left: 98%;
  height: 19px;
  animation: sway-left 3.7s ease-in-out infinite;
}

/* 恐龙时间轴容器 */
.dino-timeline-container {
  position: absolute;
  bottom: 40px; /* 向上移动恐龙位置 */
  transform: translateX(-50%); /* 让恐龙中心对齐位置 */
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab; /* 鼠标悬停时显示抓取手势 */
  user-select: none; /* 禁止文本选择 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.dino-timeline-container:active {
  cursor: grabbing; /* 拖拽时显示抓取手势 */
}

/* 年份显示 */
.dino-year-display {
  font-size: 24px; /* 从18px改为24px，更大一点 */
  font-weight: 700;
  color: #8B4513;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.9);
  margin-bottom: -10px; /* 向上移动年份位置 */
  font-family: 'Arial', sans-serif;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(139, 69, 19, 0.2);
}

/* 恐龙GIF */
.dino-gif {
  width: 100px;
  height: auto;
  image-rendering: crisp-edges;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.timeline-wrapper {
  position: absolute;
  top: 45%; /* 从50%改为45%，向上移动 */
  transform: translateY(-50%);
  left: 0;
  display: flex;
  gap: 120px; /* 图片之间的间距 */
  white-space: nowrap;
  background: transparent !important; /* 关键：设置透明背景 */
}

.event-card {
  flex-shrink: 0;
  width: 480px;
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
}

.event-year {
  padding: 15px 20px;
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  font-size: 48px;
  font-weight: 300;
  text-align: left;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.event-image-container {
  position: relative;
  width: 100%;
  height: 420px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .event-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
}

.event-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card:hover .event-hover-overlay {
  opacity: 1;
}

.event-hover-overlay i {
  font-size: 32px;
  margin-bottom: 5px;
}

.event-description {
  padding: 20px 20px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.95);
  text-align: left;
  line-height: 1.6;
  background: transparent;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  word-break: break-word;
}

/* 弹跳的不规则变换线条图形（物理引擎控制） */
.bouncing-shape {
  position: fixed;
  width: 150px;
  height: 150px;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
  transition: none; /* 移除过渡，物理引擎直接控制 */
}

/* 添加线条宽度和透明度随机变化 */
.morphing-path {
  stroke: rgba(0, 0, 0, 0.6);
  stroke-width: 3px;
  animation: stroke-variations 7s ease-in-out infinite;
}

@keyframes stroke-variations {
  0%, 100% { 
    stroke-width: 3px; 
    stroke: rgba(0, 0, 0, 0.6); 
  }
  15% { 
    stroke-width: 2px; 
    stroke: rgba(0, 0, 0, 0.7); 
  }
  30% { 
    stroke-width: 4px; 
    stroke: rgba(0, 0, 0, 0.5); 
  }
  45% { 
    stroke-width: 2.5px; 
    stroke: rgba(0, 0, 0, 0.8); 
  }
  60% { 
    stroke-width: 3.5px; 
    stroke: rgba(0, 0, 0, 0.55); 
  }
  75% { 
    stroke-width: 2.8px; 
    stroke: rgba(0, 0, 0, 0.65); 
  }
  90% { 
    stroke-width: 3.2px; 
    stroke: rgba(0, 0, 0, 0.7); 
  }
}
</style>
