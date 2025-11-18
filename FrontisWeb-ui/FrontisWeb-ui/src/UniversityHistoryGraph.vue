<template>
  <div id="history-graph" ref="container">
    <!-- 星空粒子背景层 -->
    <canvas ref="particleCanvas" class="particle-background"></canvas>
    
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="nav-left">
        <button @click="goHome" class="back-btn">
          <i class="fas fa-home"></i>
          返回首页
        </button>
      </div>
      <div class="nav-center">
        <h1 class="graph-title">
          成都理工大学校史知识图谱
        </h1>
      </div>
      <div class="nav-right">
        <div class="placeholder"></div>
      </div>
    </div>

    <!-- 左侧控制面板 -->
    <div class="control-panel">
      <div class="panel-section">
        <h3 class="section-title">
          <i class="fas fa-layer-group"></i>
          实体类型
        </h3>
        <div class="filter-list">
          <div v-for="type in entityTypes" :key="type.name" class="filter-item">
            <label class="filter-checkbox">
              <input 
                type="checkbox" 
                v-model="type.visible"
                @change="updateVisibility"
              />
              <span class="filter-icon" :style="{ color: type.color }">
                {{ type.icon }}
              </span>
              <span class="filter-label">{{ type.name }}</span>
              <span class="filter-count">({{ type.count }})</span>
            </label>
          </div>
        </div>
      </div>

      <div class="panel-section">
        <h3 class="section-title">
          <i class="fas fa-filter"></i>
          时间轴
        </h3>
        <div class="time-range">
          <label>起始：{{ startYear }}</label>
          <input 
            type="range" 
            v-model="startYear" 
            :min="1956" 
            :max="currentYear"
            @input="updateTimeFilter"
          />
        </div>
        <div class="time-range">
          <label>结束：{{ endYear }}</label>
          <input 
            type="range" 
            v-model="endYear" 
            :min="1956" 
            :max="currentYear"
            @input="updateTimeFilter"
          />
        </div>
      </div>

      <div class="panel-section">
        <h3 class="section-title">
          <i class="fas fa-search"></i>
          搜索节点
        </h3>
        <input 
          type="text" 
          v-model="searchText" 
          @input="handleSearch"
          placeholder="搜索人物、组织、事件..."
          class="search-input"
        />
      </div>
    </div>

    <!-- 右侧信息面板 -->
    <div class="info-panel" v-if="selectedNode">
      <div class="panel-header">
        <h3 class="panel-title">{{ selectedNode.type }}</h3>
        <button @click="closePanel" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="panel-content">
        <div class="node-header">
          <div class="node-icon" :style="{ background: selectedNode.color }">
            {{ selectedNode.icon }}
          </div>
          <h2 class="node-name">{{ selectedNode.name }}</h2>
        </div>
        
        <div v-if="selectedNode.description" class="info-section">
          <h4>简介</h4>
          <p>{{ selectedNode.description }}</p>
        </div>

        <div v-if="selectedNode.period" class="info-section">
          <h4>时间</h4>
          <p>{{ selectedNode.period }}</p>
        </div>

        <div v-if="selectedNode.achievements && selectedNode.achievements.length > 0" class="info-section">
          <h4>重要成就</h4>
          <ul>
            <li v-for="(achievement, idx) in selectedNode.achievements" :key="idx">
              {{ achievement }}
            </li>
          </ul>
        </div>

        <div v-if="selectedNode.relatedEntities && selectedNode.relatedEntities.length > 0" class="info-section">
          <h4>相关实体</h4>
          <div class="related-entities">
            <div 
              v-for="entity in selectedNode.relatedEntities" 
              :key="entity.id"
              @click="selectNode(entity.id)"
              class="entity-tag"
            >
              {{ entity.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend-panel">
      <h4>图例</h4>
      <div class="legend-items">
        <div v-for="type in entityTypes" :key="type.name" class="legend-item">
          <div class="legend-color" :style="{ background: type.color }"></div>
          <span>{{ type.name }}</span>
        </div>
      </div>
    </div>

    <!-- 重置视图按钮 -->
    <button @click="resetView" class="reset-view-btn">
      <i class="fas fa-redo"></i>
      重置视图
    </button>

    <!-- 导航提示 -->
    <div class="navigation-hint">
      <h4>操作指南</h4>
      <div class="hint-items">
        <p>🖱️ 拖动：平移视图</p>
        <p>🔍 滚轮：缩放视图</p>
        <p>⭐ 点击：查看节点详情</p>
        <p>🎯 拖拽：移动节点位置</p>
      </div>
    </div>

    <!-- 底部统计信息 -->
    <div class="stats-bar">
      <div class="stat-item">
        <i class="fas fa-users"></i>
        <span>实体：{{ visibleNodes.length }}</span>
      </div>
      <div class="stat-item">
        <i class="fas fa-project-diagram"></i>
        <span>关系：{{ visibleLinks.length }}</span>
      </div>
      <div class="stat-item">
        <i class="fas fa-clock"></i>
        <span>时间跨度：{{ startYear }}-{{ endYear }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as d3 from 'd3'
import { historyGraphData } from '@/data/historyGraphData.js'
import cdutLogo from '@/assets/CDUT.png'

const router = useRouter()
const route = useRoute()
const container = ref(null)
const particleCanvas = ref(null)
let particleAnimation = null

// 实体类型配置
const entityTypes = ref([
  { name: '人物', icon: '👤', color: '#4A90E2', count: 0, visible: true },
  { name: '组织机构', icon: '🏢', color: '#50C878', count: 0, visible: true },
  { name: '历史事件', icon: '📅', color: '#F5A623', count: 0, visible: true },
  { name: '学术成就', icon: '🏆', color: '#F15C5C', count: 0, visible: true },
  { name: '精神文化', icon: '💎', color: '#9013FE', count: 0, visible: true }
])

const startYear = ref(1956)
const endYear = ref(2024)
const currentYear = ref(2024)
const searchText = ref('')
const selectedNode = ref(null)
const nodes = ref([])
const links = ref([])
const visibleNodes = ref([])
const visibleLinks = ref([])

let simulation = null
let svg = null
let g = null
let centerNodeData = null
// 缓存选择，避免每帧查询 DOM
let linkSel = null
let linkLabelSel = null
let nodeSel = null
// 拖拽节流
let dragRafId = null
let pendingDrag = null
// 性能优化：tick更新节流
let tickRafId = null
let pendingTick = null
let lastTickTime = 0
const TICK_THROTTLE_MS = 16 // 约60fps，可以根据性能调整
// 标签更新计数器
let labelUpdateCounter = 0

// 计算可见节点和链接
const updateVisibility = () => {
  applyFilters()
}

const updateTimeFilter = () => {
  applyFilters()
}

// 性能优化：搜索防抖，避免频繁过滤
let searchTimeout = null
const handleSearch = () => {
  // 清除之前的定时器
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  // 延迟执行过滤，避免输入时频繁更新
  searchTimeout = setTimeout(() => {
    applyFilters()
    searchTimeout = null
  }, 300) // 300ms防抖
}

// 性能优化：使用Set代替数组查找，提升过滤性能
const applyFilters = () => {
  // 应用实体类型过滤
  const visibleTypes = new Set(entityTypes.value.filter(t => t.visible).map(t => t.name))
  
  // 应用时间过滤
  const timeFiltered = nodes.value.filter(node => {
    const nodeYear = node.year || 1956
    return nodeYear >= startYear.value && nodeYear <= endYear.value
  })
  
  // 应用搜索过滤（优化：只在有搜索文本时才执行）
  const searchFiltered = searchText.value
    ? timeFiltered.filter(node => {
        const searchLower = searchText.value.toLowerCase()
        return node.name.toLowerCase().includes(searchLower) ||
               (node.description && node.description.toLowerCase().includes(searchLower))
      })
    : timeFiltered
  
  // 应用类型过滤 - 使用Set查找，性能更好
  const typeFiltered = searchFiltered.filter(node => 
    visibleTypes.has(node.type)
  )
  
  visibleNodes.value = typeFiltered
  
  // 创建可见节点ID的Set，提升链接过滤性能
  const visibleNodeIds = new Set(visibleNodes.value.map(n => n.id))
  
  // 更新可见链接（兼容 d3.forceLink 将 source/target 替换为对象的情况）
  visibleLinks.value = links.value.filter(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source
    const targetId = typeof link.target === 'object' ? link.target.id : link.target
    return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId)
  })
  
  updateGraph()
}

// 性能优化：创建节点ID到节点的Map，提升查找性能
let nodesMap = null
const buildNodesMap = () => {
  nodesMap = new Map(nodes.value.map(node => [node.id, node]))
}

const selectNode = (nodeId) => {
  // 使用Map查找，性能更好（O(1) vs O(n)）
  const node = nodesMap ? nodesMap.get(nodeId) : nodes.value.find(n => n.id === nodeId)
  if (node) {
    selectedNode.value = {
      ...node,
      relatedEntities: getRelatedEntities(nodeId)
    }
  }
}

const getRelatedEntities = (nodeId) => {
  const relatedNodeIds = new Set()
  
  // 找到所有相关的链接
  visibleLinks.value.forEach(link => {
    if (link.source === nodeId || link.source.id === nodeId) {
      const targetId = typeof link.target === 'object' ? link.target.id : link.target
      relatedNodeIds.add(targetId)
    }
    if (link.target === nodeId || link.target.id === nodeId) {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source
      relatedNodeIds.add(sourceId)
    }
  })
  
  // 返回相关实体
  return Array.from(relatedNodeIds)
    .map(id => visibleNodes.value.find(n => n.id === id))
    .filter(Boolean)
    .map(node => ({ id: node.id, name: node.name }))
}

const closePanel = () => {
  selectedNode.value = null
}

const resetView = () => {
  startYear.value = 1956
  endYear.value = 2024
  searchText.value = ''
  selectedNode.value = null
  applyFilters()
  
  if (simulation) {
    simulation.alpha(1).restart()
  }
}

const goHome = () => {
  router.push('/')
}

// 初始化星空粒子背景
const initParticleBackground = () => {
  if (!particleCanvas.value) return
  
  const canvas = particleCanvas.value
  const ctx = canvas.getContext('2d')
  
  // 设置canvas尺寸
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // 粒子配置
  const particleCount = 80
  const particles = []
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  
  // 创建粒子类
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.vx = (Math.random() - 0.5) * 0.5
      this.vy = (Math.random() - 0.5) * 0.5
      this.radius = Math.random() * 1.5 + 0.5
      this.opacity = Math.random() * 0.5 + 0.2
    }
    
    update() {
      this.x += this.vx
      this.y += this.vy
      
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1
    }
    
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`
      ctx.fill()
    }
  }
  
  // 初始化粒子
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }
  
  // 绘制连接线
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 150)})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
      
      // 连接到鼠标
      const dx = particles[i].x - mouse.x
      const dy = particles[i].y - mouse.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 200) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - distance / 200)})`
        ctx.lineWidth = 0.5
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
      }
    }
  }
  
  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    particles.forEach(particle => {
      particle.update()
      particle.draw()
    })
    
    drawLines()
    particleAnimation = requestAnimationFrame(animate)
  }
  
  // 监听鼠标移动
  const handleMouseMove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }
  window.addEventListener('mousemove', handleMouseMove)
  
  animate()
  
  // 保存清理函数
  window.__particleCleanup = () => {
    window.removeEventListener('resize', resizeCanvas)
    window.removeEventListener('mousemove', handleMouseMove)
    if (particleAnimation) {
      cancelAnimationFrame(particleAnimation)
    }
  }
}

onMounted(() => {
  initParticleBackground()
  initializeGraph()
  loadData()
  applyModeFromQuery(route.query.mode)
})

onUnmounted(() => {
  // 清理粒子系统
  if (window.__particleCleanup) {
    window.__particleCleanup()
    delete window.__particleCleanup
  }
  
  if (simulation) {
    simulation.stop()
    simulation.on('tick', null) // 清除所有监听器
    simulation.on('end', null)
  }
  // 清理所有requestAnimationFrame
  if (dragRafId != null) {
    cancelAnimationFrame(dragRafId)
    dragRafId = null
  }
  if (tickRafId != null) {
    cancelAnimationFrame(tickRafId)
    tickRafId = null
  }
  // 清理防抖定时器
  if (searchTimeout != null) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }
  // 清理pending状态
  pendingDrag = null
  pendingTick = null
})

const initializeGraph = () => {
  // 创建SVG - 性能优化版本
  svg = d3.select(container.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('shape-rendering', 'optimizeSpeed') // 性能优化：降低渲染质量以提升速度
    .style('text-rendering', 'optimizeSpeed') // 文本渲染优化
  
  g = svg.append('g')
    .style('shape-rendering', 'optimizeSpeed')
  
  // 添加缩放功能 - 性能优化：节流缩放事件
  let zoomTimeout = null
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      // 节流缩放更新，避免频繁重绘
      if (zoomTimeout) return
      zoomTimeout = requestAnimationFrame(() => {
        g.attr('transform', event.transform)
        zoomTimeout = null
      })
    })
  
  svg.call(zoom)
  
  // 添加全局defs用于clipPath
  const defs = svg.append('defs')
  defs.append('clipPath')
    .attr('id', 'centerCircleClip')
    .append('circle')
    .attr('r', 50)
    .attr('cx', 0)
    .attr('cy', 0)
  
  // 创建力导向图 - 性能优化版本
  simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance((d) => {
      // 根据关系强度调整距离
      // value越高，距离越近
      const baseDistance = 200
      const strength = d.value || 1
      return baseDistance / Math.sqrt(strength)
    }).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-450))
    .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .force('collision', d3.forceCollide().radius(d => {
      // 根据节点大小调整碰撞半径
      return (d.isCenter ? 70 : 50)
    }))
    .force('x', d3.forceX().strength(0.15))
    .force('y', d3.forceY().strength(0.15))
    .alphaDecay(0.05)
    .velocityDecay(0.4) // 稍微增加速度衰减，让节点更快稳定
}

const applyModeFromQuery = (mode) => {
  if (!mode) return
  const modeMap = {
    person: ['人物'],
    org: ['组织机构'],
    event: ['历史事件'],
    achievement: ['学术成就'],
    culture: ['精神文化']
  }
  const allowed = modeMap[String(mode).toLowerCase()]
  if (!allowed) return
  entityTypes.value.forEach(t => { t.visible = allowed.includes(t.name) })
  applyFilters()
}

watch(() => route.query.mode, (newMode) => {
  applyModeFromQuery(newMode)
})

const loadData = () => {
  // 从数据文件加载
  nodes.value = historyGraphData.nodes
  links.value = historyGraphData.links
  
  // 构建节点Map以提升查找性能
  buildNodesMap()
  
  // 创建类型Map以提升查找性能
  const typeMap = new Map(entityTypes.value.map(t => [t.name, t]))
  
  // 统计每种类型的数量（优化：使用reduce代替多次filter）
  const typeCounts = new Map()
  nodes.value.forEach(node => {
    const count = typeCounts.get(node.type) || 0
    typeCounts.set(node.type, count + 1)
  })
  entityTypes.value.forEach(type => {
    type.count = typeCounts.get(type.name) || 0
  })
  
  // 初始化节点位置（优化：使用已创建的typeMap）
  nodes.value.forEach(node => {
    const type = typeMap.get(node.type)
    if (type) {
      node.color = type.color
      node.icon = type.icon
    }
  })
  
  applyFilters()
}

const updateGraph = () => {
  if (!g) return
  
  // 重置标签计数器
  labelUpdateCounter = 0
  
  // 停止之前的模拟（如果正在运行）
  if (simulation) {
    simulation.on('tick', null) // 清除之前的tick监听器
  }
  
  // 清空现有元素
  g.selectAll('*').remove()
  
  // 创建链接容器
  const linkContainer = g.append('g').attr('class', 'links')
  
  // 绘制链接 - 性能优化：使用CSS transform和will-change
  linkSel = linkContainer
    .selectAll('line')
    .data(visibleLinks.value)
    .enter()
    .append('line')
    .attr('stroke', d => getLinkColor(d.type))
    .attr('stroke-opacity', d => {
      // 根据关系强度调整透明度
      return Math.min(0.9, 0.4 + (d.value || 1) * 0.1)
    })
    .attr('stroke-width', d => {
      // 根据关系强度调整线宽
      const minWidth = 1.5
      const maxWidth = 4
      const value = d.value || 1
      return minWidth + (value / 5) * (maxWidth - minWidth)
    })
    .attr('stroke-dasharray', d => getLinkDashArray(d.type))
    .style('will-change', 'transform')
    .style('pointer-events', 'none') // 减少事件处理开销
  
  // 创建标签容器
  const labelContainer = g.append('g').attr('class', 'link-labels')
  
  // 绘制链接标签（仅显示强关系）- 性能优化：减少标签数量
  linkLabelSel = labelContainer
    .selectAll('text')
    .data(visibleLinks.value.filter(d => d.value >= 4)) // 只显示非常强的关系，减少标签
    .enter()
    .append('text')
    .text(d => d.type)
    .attr('font-size', '11px')
    .attr('fill', '#444')
    .attr('text-anchor', 'middle')
    .style('pointer-events', 'none')
    .style('filter', 'drop-shadow(0 0 3px rgba(255,255,255,0.8))')
    .style('will-change', 'transform')
  
  // 创建节点容器
  const nodeContainer = g.append('g').attr('class', 'nodes')
  
  // 绘制节点
  nodeSel = nodeContainer
    .selectAll('g')
    .data(visibleNodes.value)
    .enter()
    .append('g')
    .attr('class', 'node')
    .on('click', (event, d) => {
      selectNode(d.id)
    })

  // 仅为非中心节点绑定拖拽行为
  nodeSel
    .filter(d => !d.isCenter)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
  
  // 添加节点圆圈 - 性能优化：使用will-change和GPU加速
  nodeSel.append('circle')
    .attr('r', d => getNodeRadius(d))
    .attr('fill', d => d.color || '#4A90E2')
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
    .style('cursor', d => d.isCenter ? 'default' : 'pointer')
    .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))') // 简化滤镜，提升性能
    .style('will-change', 'transform')
    .style('transform', 'translateZ(0)') // 启用GPU加速
    .style('backface-visibility', 'hidden') // 隐藏背面，减少渲染
  
  // 为中心节点添加圆形裁剪和logo图片
  const centerNode = nodeSel.filter(d => d.isCenter)
  
  // 复用全局 clipPath，避免重复创建 defs 导致 DOM 膨胀
  
  // 添加logo图片，使用圆形裁剪
  centerNode.append('image')
    .attr('xlink:href', cdutLogo)
    .attr('x', d => -getNodeRadius(d) * 1.2)
    .attr('y', d => -getNodeRadius(d) * 1.2)
    .attr('width', d => getNodeRadius(d) * 2.4)
    .attr('height', d => getNodeRadius(d) * 2.4)
    .attr('clip-path', 'url(#centerCircleClip)')
    .style('opacity', 0.95)
  
  // 添加节点文本 - 性能优化：使用will-change
  nodeSel.append('text')
    .text(d => d.name)
    .attr('x', 0)
    .attr('y', d => getNodeRadius(d) + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#333')
    .attr('font-size', d => getNodeFontSize(d))
    .attr('font-weight', '600')
    .style('pointer-events', 'none')
    .style('filter', 'drop-shadow(1px 1px 2px rgba(255,255,255,0.8))')
    .style('will-change', 'transform') // GPU加速
  
  // 更新模拟
  simulation.nodes(visibleNodes.value)
  simulation.force('link').links(visibleLinks.value)
  
  // 固定中心节点到画布中心
  centerNodeData = visibleNodes.value.find(n => n.isCenter)
  if (centerNodeData) {
    centerNodeData.fx = window.innerWidth / 2
    centerNodeData.fy = window.innerHeight / 2
  }
  
  simulation.alpha(1).restart()
  
  // 性能优化的tick更新函数
  const updatePositions = () => {
    // 保持中心节点在中心
    if (centerNodeData) {
      centerNodeData.fx = window.innerWidth / 2
      centerNodeData.fy = window.innerHeight / 2
    }
    
    // 批量更新链接线位置 - 使用原生DOM操作提升性能
    if (linkSel && linkSel.size() > 0) {
      const links = linkSel.nodes()
      const linkData = linkSel.data()
      // 使用for循环代替forEach，性能更好
      for (let i = 0; i < links.length; i++) {
        const lineEl = links[i]
        const d = linkData[i]
        if (d && d.source && d.target && d.source.x !== undefined && d.source.y !== undefined) {
          // 批量设置属性，减少重排
          lineEl.setAttribute('x1', d.source.x)
          lineEl.setAttribute('y1', d.source.y)
          lineEl.setAttribute('x2', d.target.x)
          lineEl.setAttribute('y2', d.target.y)
        }
      }
    }
    
    // 延迟更新链接标签（非关键更新）- 降低更新频率提升性能
    if (linkLabelSel && linkLabelSel.size() > 0) {
      labelUpdateCounter++
      // 每10帧更新一次标签（约6fps的标签更新频率，不影响整体性能）
      if (labelUpdateCounter % 10 === 0) {
        const labels = linkLabelSel.nodes()
        labels.forEach((labelEl, i) => {
          const d = linkLabelSel.data()[i]
          if (d && d.source && d.target) {
            const dx = d.target.x - d.source.x
            const dy = d.target.y - d.source.y
            labelEl.setAttribute('x', d.source.x + dx / 2)
            labelEl.setAttribute('y', d.source.y + dy / 2 - 5)
          }
        })
      }
    }
    
    // 批量更新节点位置 - 使用for循环和原生DOM操作，性能最优
    if (nodeSel && nodeSel.size() > 0) {
      const nodes = nodeSel.nodes()
      const nodeData = nodeSel.data()
      // 使用for循环代替forEach，性能更好
      for (let i = 0; i < nodes.length; i++) {
        const nodeEl = nodes[i]
        const d = nodeData[i]
        if (d && d.x !== undefined && d.y !== undefined) {
          // 直接设置transform属性，使用原生DOM API
          nodeEl.setAttribute('transform', `translate(${d.x},${d.y})`)
        }
      }
    }
  }
  
  // 使用requestAnimationFrame节流tick更新 - 性能优化版
  simulation.on('tick', () => {
    const now = performance.now()
    
    // 使用时间节流，确保至少16ms更新一次（约60fps）
    if (now - lastTickTime >= TICK_THROTTLE_MS) {
      updatePositions()
      lastTickTime = now
      pendingTick = null
      tickRafId = null
    } else if (!pendingTick && tickRafId == null) {
      // 如果距离上次更新时间不够，安排下一次更新
      pendingTick = true
      tickRafId = requestAnimationFrame(() => {
        const timeSinceLastUpdate = performance.now() - lastTickTime
        if (timeSinceLastUpdate >= TICK_THROTTLE_MS) {
          updatePositions()
          lastTickTime = performance.now()
        }
        pendingTick = null
        tickRafId = null
      })
    }
  })
  
  // 当模拟接近稳定时，降低更新频率以节省性能
  simulation.on('end', () => {
    // 模拟结束后，降低更新频率
    if (simulation) {
      simulation.alphaTarget(0.05) // 保持轻微的运动
      simulation.restart()
    }
  })
}

const dragstarted = (event) => {
  // 不允许拖拽中心节点
  if (event.subject.isCenter) {
    return
  }
  
  if (!event.active) simulation.alphaTarget(0.4).restart()
  event.subject.fx = event.subject.x
  event.subject.fy = event.subject.y
  // 拖拽时禁用重滤镜以提升性能
  if (g) {
    g.classed('dragging', true)
  }
}

const dragged = (event) => {
  // 使用 rAF 进行节流 - 同时直接更新DOM位置，提升拖拽响应性
  if (!event.subject.isCenter) {
    // 直接更新位置，提升拖拽时的响应速度
    const draggedNode = nodeSel?.filter(d => d.id === event.subject.id)
    if (draggedNode && draggedNode.size() > 0) {
      draggedNode.node().setAttribute('transform', `translate(${event.x},${event.y})`)
    }
  }
  
  // 更新力导向图位置（节流）
  pendingDrag = { node: event.subject, x: event.x, y: event.y }
  if (dragRafId == null) {
    dragRafId = requestAnimationFrame(() => {
      if (pendingDrag) {
        pendingDrag.node.fx = pendingDrag.x
        pendingDrag.node.fy = pendingDrag.y
        pendingDrag = null
      }
      dragRafId = null
    })
  }
}

const dragended = (event) => {
  if (!event.active) simulation.alphaTarget(0)
  event.subject.fx = null
  event.subject.fy = null
  if (g) {
    g.classed('dragging', false)
  }
}

// 辅助函数：获取节点半径
const getNodeRadius = (node) => {
  // 中心节点特别大
  if (node.isCenter) {
    return 40
  }
  
  const baseRadius = 12
  const typeMultiplier = {
    '人物': 1.2,
    '历史事件': 1.0,
    '组织机构': 1.1,
    '学术成就': 1.0,
    '精神文化': 0.9
  }
  return baseRadius * (typeMultiplier[node.type] || 1.0)
}

// 辅助函数：获取节点字体大小
const getNodeFontSize = (node) => {
  if (node.isCenter) {
    return '16px'
  }
  
  const baseSize = 12
  const typeMultiplier = {
    '人物': 1.1,
    '历史事件': 1.0,
    '组织机构': 1.0,
    '学术成就': 0.9,
    '精神文化': 0.9
  }
  return `${baseSize * (typeMultiplier[node.type] || 1.0)}px`
}

// 辅助函数：获取连接线颜色
const getLinkColor = (type) => {
  const colorMap = {
    '学术传承': '#4A90E2',
    '师承': '#4A90E2',
    '重大贡献': '#F15C5C',
    '参与事件': '#F5A623',
    '重大成就': '#F15C5C',
    '发展': '#50C878',
    '隶属': '#9013FE',
    '促进': '#50C878',
    '推动': '#50C878',
    '支撑': '#9013FE',
    '体现': '#9013FE',
    '孕育': '#F5A623',
    '传承': '#9013FE',
    '表现': '#F5A623',
    '基础': '#F5A623',
    '延续': '#F15C5C',
    '提升': '#F15C5C',
    '求学': '#4A90E2',
    '参与办学': '#4A90E2'
  }
  return colorMap[type] || '#999'
}

// 辅助函数：获取连接线样式
const getLinkDashArray = (type) => {
  const dashMap = {
    '学术传承': '5,5',
    '师承': '8,4',
    '重大贡献': '0', // 实线
    '参与事件': '3,3',
    '重大成就': '0',
    '发展': '0',
    '隶属': '6,6',
    '促进': '4,4',
    '推动': '0',
    '支撑': '8,4',
    '体现': '3,6',
    '孕育': '0',
    '传承': '6,3',
    '表现': '0',
    '基础': '4,8',
    '延续': '0',
    '提升': '0',
    '求学': '2,2',
    '参与办学': '2,2'
  }
  return dashMap[type] || '0'
}
</script>

<style scoped>
#history-graph {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0D1117 0%, #111827 50%, #0D1117 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  /* 性能优化：启用硬件加速 */
  transform: translateZ(0);
  will-change: transform;
}

/* 星空粒子背景层 */
.particle-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
}

/* 确保SVG在粒子层之上 */
#history-graph :deep(svg) {
  position: relative;
  z-index: 1;
}

/* 性能优化：节点容器GPU加速 */
#history-graph :deep(.nodes) {
  transform: translateZ(0);
}

#history-graph :deep(.nodes g) {
  will-change: transform;
}

/* 性能优化：链接容器GPU加速 */
#history-graph :deep(.links) {
  transform: translateZ(0);
}

#history-graph :deep(.links line) {
  will-change: transform;
}

/* 性能优化：连接标签容器 */
#history-graph :deep(.link-labels) {
  transform: translateZ(0);
}

#history-graph :deep(.link-labels text) {
  will-change: transform;
}

/* 性能优化：SVG元素渲染优化 */
#history-graph :deep(svg) {
  shape-rendering: optimizeSpeed;
  text-rendering: optimizeSpeed;
}

/* 性能优化：减少重绘和重排 */
#history-graph :deep(.nodes g),
#history-graph :deep(.links line) {
  contain: layout style paint;
}

/* 性能优化：拖拽时降低其他元素透明度，减少渲染负担 */
.dragging #history-graph :deep(.nodes g:not(.dragging)),
.dragging #history-graph :deep(.links line) {
  opacity: 0.6;
}

/* 性能优化：减少滤镜计算 */
#history-graph :deep(.nodes circle) {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

/* 顶部导航栏 */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.nav-left, .nav-right {
  position: absolute;
  left: 30px;
}

.nav-right {
  left: auto;
  right: 30px;
}

.nav-center {
  text-align: center;
}

.graph-title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.back-btn, .nav-btn {
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

.back-btn:hover, .nav-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.back-btn:active, .nav-btn:active {
  transform: translateY(0);
}

.placeholder {
  width: 100px;
}

/* 左侧控制面板 */
.control-panel {
  position: fixed;
  left: 0;
  top: 60px;
  width: 300px;
  height: calc(100vh - 60px);
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  padding: 20px;
  overflow-y: auto;
  z-index: 900;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
}

.panel-section {
  margin-bottom: 25px;
}

.section-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  cursor: pointer;
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.filter-checkbox:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-checkbox input {
  cursor: pointer;
}

.filter-icon {
  font-size: 18px;
}

.filter-label {
  flex: 1;
  font-size: 14px;
}

.filter-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.time-range {
  margin-bottom: 15px;
}

.time-range label {
  display: block;
  color: white;
  font-size: 12px;
  margin-bottom: 5px;
}

.time-range input[type="range"] {
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  font-size: 14px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* 右侧信息面板 */
.info-panel {
  position: fixed;
  right: 0;
  top: 60px;
  width: 350px;
  max-height: calc(100vh - 60px);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 900;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  color: white;
  font-size: 16px;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.panel-content {
  padding: 20px;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.node-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.node-name {
  color: white;
  font-size: 24px;
  margin: 0;
}

.info-section {
  margin-bottom: 20px;
}

.info-section h4 {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-bottom: 8px;
}

.info-section p {
  color: white;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.info-section ul {
  color: white;
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
  padding-left: 20px;
}

.related-entities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.entity-tag {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.entity-tag:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 底部统计信息 */
.stats-bar {
  position: fixed;
  bottom: 0;
  left: 300px;
  right: 0;
  height: 50px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 40px;
  z-index: 900;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  padding: 0 40px;
}

.stat-item {
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item i {
  font-size: 16px;
  color: #4A90E2;
}

/* 图例 */
.legend-panel {
  position: fixed;
  top: 140px;
  right: 20px;
  width: 200px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  padding: 15px;
  border-radius: 8px;
  z-index: 850;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.legend-panel h4 {
  color: white;
  font-size: 14px;
  margin: 0 0 10px 0;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: white;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* 重置视图按钮 */
.reset-view-btn {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 200px;
  background: rgba(74, 144, 226, 0.9);
  backdrop-filter: blur(15px);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 851;
  box-shadow: 0 4px 10px rgba(74, 144, 226, 0.4);
  transition: all 0.3s ease;
}

.reset-view-btn:hover {
  background: rgba(74, 144, 226, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(74, 144, 226, 0.6);
}

.reset-view-btn:active {
  transform: translateY(0);
}

/* 导航提示 */
.navigation-hint {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 200px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  padding: 15px;
  border-radius: 8px;
  z-index: 850;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.navigation-hint h4 {
  color: white;
  font-size: 14px;
  margin: 0 0 10px 0;
}

.hint-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hint-items p {
  color: white;
  font-size: 12px;
  margin: 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .control-panel {
    width: 250px;
  }
  
  .info-panel {
    width: 300px;
  }
  
  .stats-bar {
    left: 250px;
    right: 0;
  }
  
  .legend-panel {
    right: 300px;
  }
  
  .navigation-hint {
    left: 270px;
  }
}

@media (max-width: 768px) {
  .control-panel,
  .info-panel,
  .legend-panel,
  .navigation-hint {
    display: none;
  }
  
  .stats-bar {
    left: 0;
    right: 0;
    flex-wrap: wrap;
    gap: 15px;
    height: auto;
    padding: 10px;
  }
}
</style>

