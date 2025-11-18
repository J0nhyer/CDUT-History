<template>
  <div class="star-map-container">
    <!-- 深空背景 -->
    <div class="space-background" ref="spaceBackground"></div>
    
    <!-- 顶部标题栏 -->
    <div class="top-bar">
      <div class="nav-left">
        <button @click="goHome" class="back-btn">
          <i class="fas fa-home"></i>
          返回首页
        </button>
      </div>
      <div class="nav-center">
        <h1 class="main-title">
          <span class="title-icon">🌠</span>
          成都理工大学校史知识星图
          <span class="title-icon">🌠</span>
        </h1>
      </div>
      <div class="nav-right">
        <div class="placeholder"></div>
      </div>
    </div>

    <!-- 左侧控制面板 -->
    <div class="left-control-panel">
      <!-- 搜索栏 -->
      <div class="control-section">
        <div class="section-header">
          <span class="section-icon">🔍</span>
          <span class="section-title">智能搜索</span>
        </div>
        <input 
          type="text" 
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="搜索节点..."
          class="search-input"
        />
        <div v-if="searchSuggestions.length > 0" class="suggestions">
          <div 
            v-for="suggestion in searchSuggestions.slice(0, 5)" 
            :key="suggestion.id"
            @click="selectNode(suggestion)"
            class="suggestion-item"
          >
            {{ suggestion.name }}
          </div>
        </div>
      </div>

      <!-- 实体类型筛选 -->
      <div class="control-section">
        <div class="section-header">
          <span class="section-icon">📊</span>
          <span class="section-title">实体类型</span>
        </div>
        <div class="filter-list">
          <label 
            v-for="type in entityTypes" 
            :key="type.id"
            class="filter-item"
          >
            <input 
              type="checkbox" 
              v-model="type.visible"
              @change="updateFilters"
            />
            <span class="filter-color" :style="{ backgroundColor: type.color }"></span>
            <span class="filter-label">{{ type.name }}</span>
            <span class="filter-count">({{ type.count }})</span>
          </label>
        </div>
      </div>

      <!-- 时间轴 -->
      <div class="control-section">
        <div class="section-header">
          <span class="section-icon">⏱️</span>
          <span class="section-title">时间轴</span>
        </div>
        <div class="time-slider">
          <label class="time-label">{{ timeRange.start }} - {{ timeRange.end }}</label>
          <input 
            type="range" 
            v-model="timeRange.start"
            :min="1956"
            :max="timeRange.end"
            @input="updateTimeFilter"
            class="slider"
          />
          <input 
            type="range" 
            v-model="timeRange.end"
            :min="timeRange.start"
            :max="2024"
            @input="updateTimeFilter"
            class="slider"
          />
        </div>
      </div>

      <!-- 视图控制 -->
      <div class="control-section">
        <div class="section-header">
          <span class="section-icon">🧭</span>
          <span class="section-title">视图控制</span>
        </div>
        <div class="view-controls">
          <button @click="resetView" class="control-btn">
            <span>🔄</span> 重置视角
          </button>
          <button @click="focusCenter" class="control-btn">
            <span>🎯</span> 聚焦中心
          </button>
          <button @click="toggleOverview" class="control-btn">
            <span>📡</span> 全览模式
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧3D图谱区域 -->
    <div class="graph-container" ref="graphContainer"></div>

    <!-- 节点详情卡片 -->
    <div v-if="selectedNode" class="detail-card">
      <div class="card-header">
        <h3 class="card-title">{{ selectedNode.name }}</h3>
        <button @click="closeDetailCard" class="close-btn">×</button>
      </div>
      <div class="card-body">
        <div class="card-info">
          <div class="info-row">
            <span class="info-label">类型:</span>
            <span class="info-value">{{ selectedNode.type }}</span>
          </div>
          <div v-if="selectedNode.period" class="info-row">
            <span class="info-label">时期:</span>
            <span class="info-value">{{ selectedNode.period }}</span>
          </div>
          <div v-if="selectedNode.year" class="info-row">
            <span class="info-label">年份:</span>
            <span class="info-value">{{ selectedNode.year }}</span>
          </div>
        </div>
        <div v-if="selectedNode.description" class="card-description">
          <p>{{ selectedNode.description }}</p>
        </div>
        <div v-if="selectedNode.achievements && selectedNode.achievements.length > 0" class="card-achievements">
          <h4>成就</h4>
          <ul>
            <li v-for="(achievement, index) in selectedNode.achievements" :key="index">
              {{ achievement }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div 
      v-if="hoveredNode && !selectedNode" 
      class="tooltip"
      :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }"
    >
      <div class="tooltip-title">{{ hoveredNode.name }}</div>
      <div class="tooltip-type">{{ hoveredNode.type }}</div>
      <div v-if="hoveredNode.description" class="tooltip-desc">
        {{ hoveredNode.description.substring(0, 80) }}...
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend">
      <div class="legend-title">图例</div>
      <div v-for="type in entityTypes" :key="type.id" class="legend-item">
        <span class="legend-color" :style="{ backgroundColor: type.color }"></span>
        <span class="legend-label">{{ type.name }}</span>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">节点数:</span>
        <span class="stat-value">{{ visibleNodesCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">关系数:</span>
        <span class="stat-value">{{ visibleLinksCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">时间跨度:</span>
        <span class="stat-value">{{ timeRange.start }}-{{ timeRange.end }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import ForceGraph3D from '3d-force-graph'
import * as THREE from 'three'
import { historyGraphData } from './data/historyGraphData.js'
import gsap from 'gsap'

const router = useRouter()

// 响应式数据
const graphContainer = ref(null)
const spaceBackground = ref(null)
const searchQuery = ref('')
const searchSuggestions = ref([])
const selectedNode = ref(null)
const hoveredNode = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })
const timeRange = ref({ start: 1956, end: 2024 })
const isOverviewMode = ref(false)

// 实体类型配置 - 只保留人物
const entityTypes = ref([
  { id: '人物', name: '人物', color: '#00C9FF', visible: true, count: 0 }
])

// Graph实例
let graph = null
let particleSystem = null

// 计算属性
const visibleNodesCount = computed(() => {
  return filteredData.value.nodes.length
})

const visibleLinksCount = computed(() => {
  return filteredData.value.links.length
})

const filteredData = computed(() => {
  // 只筛选人物节点
  const nodes = historyGraphData.nodes.filter(node => {
    // 只保留人物类型
    if (node.type !== '人物') return false
    // 时间筛选
    if (node.year && (node.year < timeRange.value.start || node.year > timeRange.value.end)) {
      return false
    }
    return true
  })

  const nodeIds = new Set(nodes.map(n => n.id))
  
  // 只保留人物之间的关系（source和target都是人物节点）
  let links = historyGraphData.links.filter(link => {
    // source和target都是字符串ID
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id || link.source
    const targetId = typeof link.target === 'string' ? link.target : link.target.id || link.target
    
    // 确保source和target都是人物节点
    const sourceNode = nodes.find(n => n.id === sourceId)
    const targetNode = nodes.find(n => n.id === targetId)
    
    return sourceNode && targetNode && 
           sourceNode.type === '人物' && 
           targetNode.type === '人物'
  }).map(link => {
    // 确保source和target都是字符串ID
    return {
      ...link,
      source: typeof link.source === 'string' ? link.source : link.source.id || link.source,
      target: typeof link.target === 'string' ? link.target : link.target.id || link.target
    }
  })

  return { nodes, links }
})

// 更新实体类型计数
function updateEntityCounts() {
  entityTypes.value.forEach(type => {
    // 只计算人物类型
    if (type.name === '人物') {
      type.count = historyGraphData.nodes.filter(n => n.type === '人物').length
    } else {
      type.count = 0
    }
  })
}


// 初始化3D图谱
function initGraph() {
  if (!graphContainer.value) return

  graph = ForceGraph3D()(graphContainer.value)
    .graphData(filteredData.value)
    .nodeLabel(node => `${node.name}\n${node.type}`)
    .nodeColor(node => {
      const typeConfig = entityTypes.value.find(t => t.name === node.type)
      return typeConfig ? typeConfig.color : '#ffffff'
    })
    .nodeVal(node => {
      // 根据节点类型设置大小
      if (node.isCenter) return 15
      if (node.type === '人物') return 8
      if (node.type === '组织机构') return 6
      return 5
    })
    .nodeOpacity(0.9)
    .nodeResolution(16)
    .linkColor(() => 'rgba(255, 255, 255, 0.4)')
    .linkWidth(0.6)
    .backgroundColor('#020611')
    .nodeThreeObject(node => {
      // 根据节点类型创建不同的3D对象
      const typeConfig = entityTypes.value.find(t => t.name === node.type)
      const nodeColor = typeConfig ? typeConfig.color : '#ffffff'
      const group = new THREE.Group()
      
      // 节点大小
      const nodeSize = node.isCenter ? 8 : (node.val || 4)
      
      // 主球体
      const geometry = new THREE.SphereGeometry(nodeSize, 16, 16)
      const material = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: node.isCenter ? 0.8 : 0.5,
        metalness: 0.2,
        roughness: 0.6
      })
      const sphere = new THREE.Mesh(geometry, material)
      group.add(sphere)
      
      // 为中心节点添加光晕环
      if (node.isCenter) {
        const ringGeometry = new THREE.RingGeometry(nodeSize, nodeSize + 4, 32)
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: nodeColor,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.rotation.x = Math.PI / 2
        group.add(ring)
        
        // 旋转动画
        gsap.to(ring.rotation, {
          z: Math.PI * 2,
          duration: 10,
          repeat: -1,
          ease: 'none'
        })
      }
      
      // 添加文字标签（节点名称）
      const nameLabel = createTextLabel(node.name, nodeColor)
      nameLabel.position.set(0, nodeSize + 4, 0)
      // 存储引用以便后续更新朝向
      nameLabel.userData = { type: 'label', needsUpdate: true }
      group.add(nameLabel)
      
      // 存储节点组引用以便更新标签朝向
      group.userData = { nodeId: node.id, labels: [nameLabel] }
      
      // 添加脉冲动画（仅非中心节点）
      if (!node.isCenter) {
        const pulseScale = { value: 1 }
        gsap.to(pulseScale, {
          value: 1.15,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          onUpdate: () => {
            sphere.scale.setScalar(pulseScale.value)
          }
        })
      }
      
      return group
    })
    .linkLabel(link => link.type || '')
    .linkThreeObjectExtend(true)
    .linkThreeObject(link => {
      // 创建关系类型标签
      if (link.type) {
        const sprite = createLinkLabelSprite(link.type, getLinkColor(link.type))
        // 标签位置会在linkPositionUpdate中设置
        sprite.position.set(0, 0, 0)
        return sprite
      }
      return new THREE.Object3D()
    })
    .linkPositionUpdate((sprite, { start, end }) => {
      if (sprite && start && end) {
        // 计算连线中点位置
        const middleX = (start.x + end.x) / 2
        const middleY = (start.y + end.y) / 2
        const middleZ = (start.z + end.z) / 2
        sprite.position.set(middleX, middleY, middleZ)
        
        // 面向摄像机
        if (graph) {
          const camera = graph.camera()
          if (camera) {
            sprite.lookAt(camera.position)
          }
        }
      }
    })
    .linkColor(link => {
      return getLinkColor(link.type || 'default')
    })
    .linkWidth(0.6)
    .onNodeClick(node => {
      selectNode(node)
      // 聚焦到节点
      const distance = 120
      const distRatio = 1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0)
      graph.cameraPosition(
        { 
          x: (node.x || 0) * distRatio, 
          y: (node.y || 0) * distRatio, 
          z: (node.z || 0) * distRatio 
        },
        node,
        3000
      )
    })
    .onNodeHover(node => {
      hoveredNode.value = node
      if (node && graphContainer.value) {
        const rect = graphContainer.value.getBoundingClientRect()
        tooltipPosition.value = {
          x: rect.left + rect.width / 2,
          y: rect.top + 20
        }
      }
    })
    .onNodeDragEnd(node => {
      node.fx = node.x
      node.fy = node.y
      node.fz = node.z
    })

  // 添加发光效果
  const scene = graph.scene()
  
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  // 点光源
  const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 1000)
  pointLight1.position.set(100, 100, 100)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0x4A90E2, 0.6, 1000)
  pointLight2.position.set(-100, 100, -100)
  scene.add(pointLight2)

  // 创建粒子背景
  createParticleBackground(scene)
  
  // 添加渲染循环以更新标签朝向摄像机
  if (graph) {
    const updateLabels = () => {
      const scene = graph.scene()
      const camera = graph.camera()
      
      if (camera && scene) {
        // 遍历场景中的所有对象
        scene.traverse((object) => {
          if (object.userData && object.userData.needsUpdate) {
            // 更新标签朝向摄像机
            if (object.type === 'Sprite') {
              object.lookAt(camera.position)
            }
          }
        })
      }
      requestAnimationFrame(updateLabels)
    }
    updateLabels()
  }
}


// 创建图标sprite
function createIconSprite(icon, color) {
  const canvas = document.createElement('canvas')
  const size = 64
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  
  // 绘制背景圆形
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2)
  ctx.fill()
  
  // 绘制图标（emoji或文字）
  ctx.font = '36px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(icon, size / 2, size / 2)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true,
    opacity: 0.9
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(3, 3, 1)
  
  return sprite
}

// 创建文字标签
function createTextLabel(text, color) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 48
  const ctx = canvas.getContext('2d')
  
  // 绘制背景
  ctx.fillStyle = `rgba(2, 6, 17, 0.8)`
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制边框
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.strokeRect(0, 0, canvas.width, canvas.height)
  
  // 绘制文字
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 文字过长时截断
  const maxLength = 12
  const displayText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  ctx.fillText(displayText, canvas.width / 2, canvas.height / 2)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true,
    opacity: 0.95
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(8, 1.5, 1)
  
  return sprite
}

// 创建连线标签sprite
function createLinkLabelSprite(text, color) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  
  // 绘制背景
  ctx.fillStyle = `rgba(2, 6, 17, 0.85)`
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制边框
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.strokeRect(0, 0, canvas.width, canvas.height)
  
  // 绘制文字
  ctx.fillStyle = color
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 文字过长时截断
  const maxLength = 8
  const displayText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  ctx.fillText(displayText, canvas.width / 2, canvas.height / 2)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true,
    opacity: 0.9
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(4, 1, 1)
  
  return sprite
}

// 根据关系类型获取颜色
function getLinkColor(relationType) {
  const relationColors = {
    '建校': '#FFAA00',
    '重组': '#FFAA00',
    '双一流': '#FFAA00',
    '学术领袖': '#00C9FF',
    '学术传承': '#00C9FF',
    '师承': '#00C9FF',
    '组织架构': '#26E077',
    '隶属': '#26E077',
    '任职': '#26E077',
    '科研平台': '#B86BFF',
    '学科建设': '#B86BFF',
    '重大贡献': '#B86BFF',
    '参与办学': '#FFAA00',
    '参与事件': '#FFAA00',
    '求学': '#00C9FF',
    '重大成就': '#B86BFF',
    '校训': '#FF5A79',
    '体现': '#FF5A79',
    '孕育': '#FF5A79',
    '演变': '#26E077',
    '发展': '#FFAA00',
    '推动': '#FFAA00',
    '支撑': '#B86BFF',
    '拥有': '#26E077',
    '合作': '#B86BFF',
    '主办': '#B86BFF',
    '获奖': '#B86BFF',
    '收藏于': '#FF5A79',
    '出版': '#26E077',
    '奠基': '#00C9FF',
    '奠定基础': '#FFAA00',
    '延续': '#B86BFF',
    '提升': '#B86BFF',
    '促进': '#26E077',
    '关联': '#B86BFF',
    '负责人': '#00C9FF',
    '表现': '#FF5A79',
    '传承': '#FF5A79',
    '位于': '#26E077',
    '默认': 'rgba(255, 255, 255, 0.4)'
  }
  
  return relationColors[relationType] || relationColors['默认']
}

// 创建粒子背景
function createParticleBackground(scene) {
  const particleCount = 1000
  const particles = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2000
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.6
  })

  particleSystem = new THREE.Points(particles, particleMaterial)
  scene.add(particleSystem)

  // 粒子动画
  const animate = () => {
    if (!particleSystem) return
    const positions = particleSystem.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += 0.1
      if (positions[i + 1] > 1000) {
        positions[i + 1] = -1000
      }
    }
    particleSystem.geometry.attributes.position.needsUpdate = true
    requestAnimationFrame(animate)
  }
  animate()
}

// 搜索功能
function handleSearch() {
  if (!searchQuery.value.trim()) {
    searchSuggestions.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  searchSuggestions.value = historyGraphData.nodes.filter(node => {
    return node.name.toLowerCase().includes(query) || 
           (node.description && node.description.toLowerCase().includes(query))
  }).slice(0, 10)
}

// 选择节点
function selectNode(node) {
  selectedNode.value = node
  searchQuery.value = ''
  searchSuggestions.value = []
  
  // 聚焦到节点
  if (graph && node.x !== undefined) {
    const distance = 120
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
    graph.cameraPosition(
      { 
        x: node.x * distRatio, 
        y: node.y * distRatio, 
        z: node.z * distRatio 
      },
      node,
      2000
    )
  }
}

// 关闭详情卡片
function closeDetailCard() {
  selectedNode.value = null
}

// 更新筛选
function updateFilters() {
  if (graph) {
    graph.graphData(filteredData.value)
  }
}

// 更新时间筛选
function updateTimeFilter() {
  updateFilters()
}

// 返回首页
function goHome() {
  router.push('/')
}

// 重置视图
function resetView() {
  if (graph) {
    graph.cameraPosition({ x: 0, y: 0, z: 300 }, { x: 0, y: 0, z: 0 }, 2000)
  }
  selectedNode.value = null
}

// 聚焦中心
function focusCenter() {
  if (graph) {
    const centerNode = filteredData.value.nodes.find(n => n.isCenter)
    if (centerNode) {
      selectNode(centerNode)
    } else {
      resetView()
    }
  }
}

// 全览模式
function toggleOverview() {
  isOverviewMode.value = !isOverviewMode.value
  if (graph) {
    if (isOverviewMode.value) {
      // 拉远视角
      graph.cameraPosition({ x: 0, y: 0, z: 800 }, { x: 0, y: 0, z: 0 }, 2000)
    } else {
      resetView()
    }
  }
}

// 创建深空背景
function createSpaceBackground() {
  if (!spaceBackground.value) return
  
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#020611')
  gradient.addColorStop(1, '#09132E')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 添加星星
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const size = Math.random() * 2
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  
  spaceBackground.value.appendChild(canvas)
  
  // 动态星星
  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() * canvas.width + Date.now() * 0.01) % canvas.width
      const y = (Math.random() * canvas.height + Date.now() * 0.005) % canvas.height
      const size = Math.random() * 2
      const opacity = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    requestAnimationFrame(animateStars)
  }
  
  animateStars()
}

// 监听数据变化
watch(filteredData, (newData) => {
  if (graph) {
    graph.graphData(newData)
    updateEntityCounts()
  }
}, { deep: true })

// 生命周期
onMounted(() => {
  updateEntityCounts()
  createSpaceBackground()
  setTimeout(() => {
    initGraph()
  }, 100)
})

onUnmounted(() => {
  if (graph) {
    graph._destructor()
  }
})
</script>

<style scoped>
.star-map-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #020611 0%, #09132E 100%);
}

.space-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.space-background canvas {
  width: 100%;
  height: 100%;
}

/* 顶部标题栏 */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
  background: linear-gradient(180deg, rgba(2, 6, 17, 0.9) 0%, rgba(9, 19, 46, 0.5) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.placeholder {
  width: 100px;
}

/* 返回按钮 */
.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1001;
  position: relative;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.back-btn:active {
  transform: translateY(0);
}

.back-btn i {
  font-size: 16px;
}

.main-title {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0;
}

.title-icon {
  font-size: 32px;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

/* 左侧控制面板 */
.left-control-panel {
  position: absolute;
  left: 20px;
  top: 100px;
  width: 320px;
  max-height: calc(100vh - 120px);
  background: rgba(2, 6, 17, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 20px;
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.left-control-panel::-webkit-scrollbar {
  width: 6px;
}

.left-control-panel::-webkit-scrollbar-track {
  background: transparent;
}

.left-control-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.control-section {
  margin-bottom: 24px;
}

.control-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.section-icon {
  font-size: 18px;
  color: #ffffff;
}

.section-title {
  font-size: 15px;
  color: #ffffff;
  font-weight: 600;
}

/* 搜索输入框 */
.search-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #00C9FF;
  box-shadow: 0 0 10px rgba(0, 201, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.suggestions {
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  overflow: hidden;
}

.suggestion-item {
  padding: 10px 16px;
  color: #ffffff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.1);
  padding-left: 20px;
}

.suggestion-item:last-child {
  border-bottom: none;
}

/* 筛选列表 */
.filter-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.filter-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #00C9FF;
}

.filter-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.filter-label {
  flex: 1;
  color: #ffffff;
  font-size: 13px;
}

.filter-count {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

/* 时间滑块 */
.time-slider {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-label {
  color: #ffffff !important;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #00C9FF;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 201, 255, 0.6);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #00C9FF;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 201, 255, 0.6);
  border: none;
}

/* 视图控制 */
.view-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-btn {
  padding: 10px 16px;
  background: rgba(0, 201, 255, 0.1);
  border: 1px solid rgba(0, 201, 255, 0.3);
  border-radius: 8px;
  color: #ffffff !important;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn:hover {
  background: rgba(0, 201, 255, 0.2);
  border-color: #00C9FF;
  box-shadow: 0 0 15px rgba(0, 201, 255, 0.3);
  transform: translateY(-2px);
  color: #ffffff !important;
}

.control-btn span {
  color: #ffffff;
  font-size: 14px;
}

/* 3D图谱容器 */
.graph-container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* 节点详情卡片 */
.detail-card {
  position: absolute;
  right: 20px;
  top: 100px;
  width: 400px;
  max-height: calc(100vh - 120px);
  background: rgba(2, 6, 17, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  z-index: 100;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.detail-card::-webkit-scrollbar {
  width: 6px;
}

.detail-card::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.card-body {
  color: #ffffff;
}

.card-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-label {
  color: rgba(255, 255, 255, 0.7);
  margin-right: 8px;
  min-width: 60px;
}

.info-value {
  color: #ffffff;
  font-weight: 500;
}

.card-description {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  line-height: 1.6;
  font-size: 14px;
}

.card-achievements {
  margin-top: 20px;
}

.card-achievements h4 {
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 12px;
}

.card-achievements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-achievements li {
  padding: 8px 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 13px;
  border-left: 3px solid #00C9FF;
}

/* Tooltip */
.tooltip {
  position: absolute;
  padding: 12px 16px;
  background: rgba(2, 6, 17, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  z-index: 200;
  pointer-events: none;
  max-width: 250px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
}

.tooltip-type {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.tooltip-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

/* 图例 */
.legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(2, 6, 17, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  padding: 16px;
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 200px;
}

.legend-title {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
}

.legend-label {
  color: rgba(255, 255, 255, 0.8);
}

/* 统计信息 */
.stats {
  position: absolute;
  bottom: 20px;
  right: 240px;
  display: flex;
  gap: 16px;
  background: rgba(2, 6, 17, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  padding: 16px 20px;
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #00C9FF;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .left-control-panel {
    width: 280px;
  }
  
  .detail-card {
    width: 350px;
  }
}

@media (max-width: 1024px) {
  .left-control-panel {
    width: 260px;
    padding: 16px;
  }
  
  .detail-card {
    width: 320px;
    right: 10px;
    top: 90px;
  }
  
  .main-title {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .left-control-panel {
    width: 240px;
    font-size: 12px;
  }
  
  .detail-card {
    width: calc(100% - 40px);
    right: 20px;
    left: 20px;
  }
  
  .legend,
  .stats {
    position: relative;
    bottom: auto;
    right: auto;
    margin: 10px;
  }
  
  .stats {
    right: auto;
  }
}
</style>

