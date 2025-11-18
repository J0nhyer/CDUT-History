<template>
  <div class="simple-person-graph">
    <div v-if="isLoadingData" class="data-status-overlay">
      <p>正在加载人物数据…</p>
    </div>
    <div v-else-if="loadError" class="data-status-overlay warning">
      <p>{{ loadError }}</p>
    </div>
    <div class="graph-header">
      <div class="back-section">
        <button @click="goBack" class="back-btn">
          <i class="fas fa-arrow-left"></i>
          返回首页
        </button>
      </div>
      <div class="header-center">
        <h2 class="graph-title">成都理工大学人物关系图谱</h2>
      </div>
    </div>
    
    <div class="graph-container" ref="graphContainer">
      <svg 
        ref="svgElement" 
        class="graph-svg"
        :width="svgWidth" 
        :height="svgHeight"
        @mousedown="startPan"
        @wheel="handleWheel"
      >
        <g 
          ref="panGroup"
          :transform="`translate(${panX},${panY}) scale(${zoomLevel})`"
        >
          <!-- 关系连线 -->
          <g class="links-group">
            <line
              v-for="link in visibleLinks"
              :key="`${link.source}-${link.target}`"
              :x1="getNodeX(link.source)"
              :y1="getNodeY(link.source)"
              :x2="getNodeX(link.target)"
              :y2="getNodeY(link.target)"
              class="link-line"
              :class="[
                `link-${link.linkType || link.relation}`,
                `link-${link.strength || 'medium'}`
              ]"
              :stroke-dasharray="link.linkType === 'same-level' ? '5,5' : '0'"
            />
            <!-- 关系标签 -->
            <g
              v-for="link in visibleLinks"
              :key="`label-${link.source}-${link.target}`"
              class="relation-label-group"
            >
              <!-- 标签背景 -->
              <rect
                :x="(getNodeX(link.source) + getNodeX(link.target)) / 2 - 20"
                :y="(getNodeY(link.source) + getNodeY(link.target)) / 2 - 8"
                width="40"
                height="16"
                rx="3"
                class="relation-label-bg"
              />
              <!-- 标签文字 -->
              <text
                :x="(getNodeX(link.source) + getNodeX(link.target)) / 2"
                :y="(getNodeY(link.source) + getNodeY(link.target)) / 2"
                class="relation-label"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                {{ link.label }}
              </text>
            </g>
          </g>
          
          <!-- 所有节点（人物、学院、项目、事件） -->
          <g
            v-for="node in allNodes"
            :key="node.id"
            :transform="`translate(${node.x},${node.y})`"
          >
            <g
              class="graph-node"
              :class="`node-${node.nodeType}`"
              @click="selectNode(node)"
            >
              <!-- 人物节点 -->
              <g v-if="node.nodeType === 'person'">
            <defs>
                <clipPath :id="`clip-${node.id}`">
                  <circle :r="node.radius" />
              </clipPath>
                <!-- 光晕效果（用于有荣誉的节点） -->
                <filter v-if="node.hasHonor" :id="`glow-${node.id}`" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
            </defs>
              
              <!-- 光晕环（有荣誉的节点） -->
              <circle
                v-if="node.hasHonor"
                class="honor-glow"
                :r="node.radius + 8"
                :fill="node.borderColor"
                :opacity="0.3"
                :filter="`url(#glow-${node.id})`"
              />
            
            <circle
              class="person-circle"
                :r="node.radius"
                :fill="node.color"
                :stroke="node.borderColor"
                :stroke-width="node.hasHonor ? 5 : 3"
            />
            
            <image
                :href="node.image"
                :width="node.radius * 2.4"
                :height="node.radius * 2.4"
                :x="-node.radius * 1.2"
                :y="-node.radius * 1.2"
                :clip-path="`url(#clip-${node.id})`"
              preserveAspectRatio="xMidYMid slice"
            />
            
            <!-- 名字 -->
            <text
              class="person-name"
                :y="node.radius + 25"
              text-anchor="middle"
                :fill="node.textColor"
            >
                {{ node.name }}
            </text>
            </g>
            
              <!-- 中介节点（学院、项目、事件） -->
              <g v-else>
                <rect
                  :x="-node.width / 2"
                  :y="-node.height / 2"
                  :width="node.width"
                  :height="node.height"
                  rx="8"
                  :fill="node.color"
                  :stroke="node.borderColor"
                  stroke-width="2"
                  class="mediator-node"
                />
                <text
                  class="mediator-name"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  :fill="node.textColor"
                >
                  {{ node.name }}
                </text>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
    
    <!-- 选中人物详情卡片 -->
    <transition name="slide">
      <div v-if="selectedPerson" class="person-detail-card">
        <div class="card-header">
          <h3>{{ selectedPerson.name }}</h3>
          <button @click="closeDetail" class="close-btn">×</button>
        </div>
        <div class="card-body">
          <img :src="selectedPerson.image" :alt="selectedPerson.name" class="detail-image" />
          <p class="detail-description">{{ selectedPerson.description }}</p>
          <div class="detail-info">
            <div class="info-item">
              <span class="info-label">时期：</span>
              <span class="info-value">{{ selectedPerson.period }}</span>
            </div>
            <div v-if="selectedPerson.achievements && selectedPerson.achievements.length > 0" class="info-item">
              <span class="info-label">成就：</span>
              <span class="info-value">{{ selectedPerson.achievements.slice(0, 3).join('、') }}</span>
            </div>
          </div>
          <button @click="viewFullDetail" class="view-detail-btn">查看完整资料</button>
        </div>
      </div>
    </transition>
    
    <!-- 缩放控制 -->
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn">+</button>
      <div class="zoom-level">{{ displayZoomPercent }}%</div>
      <button @click="zoomOut" class="zoom-btn">−</button>
      <button @click="resetView" class="reset-btn">重置</button>
    </div>
  </div>
</template>

<script>
import { getAllPersonProfiles } from '@/services/personDataService.js'
import { useRouter } from 'vue-router'

export default {
  name: 'SimplePersonGraph',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      svgWidth: window.innerWidth,
      svgHeight: window.innerHeight,
      selectedPerson: null,
      // 画布平移
      panX: 0,
      panY: 0,
      isPanning: false,
      panStartX: 0,
      panStartY: 0,
      // 缩放 - 将47%时的页面大小设置为100%的默认大小
      zoomLevel: 0.47,
      minZoom: 0.15,
      maxZoom: 2.0,
      // 从数据库加载的人物数据
      personsDetailDataAdvanced: {},
      isLoadingData: true,
      loadError: null
    }
  },
  async mounted() {
    await this.loadPersonsData()
  },
  computed: {
    // 显示的缩放百分比（以0.47为100%基准）
    displayZoomPercent() {
      return Math.round((this.zoomLevel / 0.47) * 100)
    },
    // 中介节点（学院、项目、事件）
    mediatorNodes() {
      const centerX = 1200
      const centerY = 800
      
      // 定义中介节点
      const mediators = []
      
      // 如果没有中介节点，返回空数组
      return mediators.map(mediator => {
        const distance = mediator.distance || (mediator.level === 1 ? 200 : 400)
        const x = centerX + Math.cos(mediator.angle) * distance
        const y = centerY + Math.sin(mediator.angle) * distance
        
        return {
          id: mediator.id,
          name: mediator.name,
          nodeType: 'mediator',
          type: mediator.type,
          x: x,
          y: y,
          width: 120,
          height: 40,
          radius: 0,
          color: mediator.color + '33', // 添加透明度
          borderColor: mediator.color,
          textColor: '#fff',
          level: mediator.level
        }
      })
    },
    
    persons() {
      const data = this.personsDetailDataAdvanced
      const personsList = Object.values(data)
        const radius = 60
      const minDistance = radius * 3.5 // 增加节点之间的最小距离（210px），让节点更分散
      const centerX = 1200
        const centerY = 800
        
      // 第一步：按等级分组人物（5个等级）
      const levelGroups = { 1: [], 2: [], 3: [], 4: [], 5: [] }
      personsList.forEach(person => {
        const level = this.getInfluenceLevel(person)
        if (!levelGroups[level]) {
          levelGroups[level] = []
        }
        if (!levelGroups[level].find(p => p.id === person.id)) {
          levelGroups[level].push(person)
        }
      })
      
      // 第二步：为每个等级群体分配中心位置（放射状层级布局，更分散）
      const levelCenters = {}
      // 增大各等级圈的半径，让节点更分散
      // 根据节点大小（半径），确保圆圈越大越靠近中心
      const levelRadii = {
        1: 0,     // Level 1：创校与奠基人物（半径80） - 最中心
        2: 250,   // Level 2：学科带头人/院士（半径70） - 第一圈（250 = 80+70+100间距）
        3: 480,   // Level 3：学院领导（半径60） - 第二圈（480 = 250+70+60+100间距）
        4: 700,   // Level 4：优秀校友（半径50） - 第三圈（700 = 480+60+50+110间距）
        5: 920    // Level 5：青年科研者（半径45） - 最外圈（920 = 700+50+45+125间距）
      }
      
      // 为每个等级分配角度（放射状均匀分布）
      Object.keys(levelGroups).forEach(levelStr => {
        const level = parseInt(levelStr)
        const personsInLevel = levelGroups[level] || []
        const levelRadius = levelRadii[level]
        
        // 如果该等级有人物，为该等级计算布局
        if (personsInLevel.length > 0) {
          if (level === 1) {
            // Level 1 放在最中心，小范围分布
            levelCenters[level] = {
              x: centerX,
              y: centerY,
              radius: 0, // 中心点
              startAngle: 0,
              angleRange: Math.PI * 2
            }
        } else {
            // 其他等级围绕中心均匀放射状分布
            levelCenters[level] = {
              x: centerX,
              y: centerY,
              radius: levelRadius,
              startAngle: 0, // 从0度开始，均匀分布
              angleRange: Math.PI * 2 // 整圈均匀分布
            }
          }
        }
      })
      
      // 第三步：为每个人物节点生成初始位置（放射状层级布局）
      const nodes = personsList.map((person, index) => {
        const level = this.getInfluenceLevel(person)
        const levelCenter = levelCenters[level]
        
        // 根据等级获取节点半径和颜色
        const nodeRadius = this.getNodeRadiusByLevel(level)
        const nodeColor = this.getNodeColorByCollege(person)
        const hasHonorFlag = this.hasHonor(person)
        
        let baseX, baseY
        
        if (levelCenter) {
          if (level === 1) {
            // Level 1 放在中心，小范围分布
            const groupPersons = levelGroups[level] || []
            const personIndexInLevel = groupPersons.findIndex(p => p.id === person.id)
            const totalInLevel = groupPersons.length
            const angle = (personIndexInLevel * Math.PI * 2) / Math.max(totalInLevel, 1)
            const centerOffset = Math.min(totalInLevel * 10, 60) // 中心偏移距离
            
            baseX = levelCenter.x + Math.cos(angle) * centerOffset
            baseY = levelCenter.y + Math.sin(angle) * centerOffset
          } else {
            // 其他等级围绕中心均匀放射状分布（更分散）
            const groupPersons = levelGroups[level] || []
            const personIndexInLevel = groupPersons.findIndex(p => p.id === person.id)
            const totalInLevel = groupPersons.length
            
            // 计算在该等级圈上的位置（均匀分布在整个圆周上）
            const angleStep = (Math.PI * 2) / Math.max(totalInLevel, 1)
            const angle = personIndexInLevel * angleStep
            
            // 根据该等级的人数，调整分布半径（人多时稍微外扩）
            const clusterSpread = Math.max(0, (totalInLevel - 1) * 20) // 每增加1人，半径增加20px
            const distributionRadius = levelCenter.radius + clusterSpread
            
            // 添加轻微的随机偏移，增加分散效果
            const seed = person.id.charCodeAt(0) + (person.id.charCodeAt(person.id.length - 1) || 0)
            const pseudoRandom = ((seed * 9301 + 49297) % 233280) / 233280
            const angleOffset = (pseudoRandom - 0.5) * 0.3 // 增大角度偏移
            const radiusOffset = (pseudoRandom - 0.5) * 30 // 增加半径偏移，让节点更分散
            
            baseX = levelCenter.x + Math.cos(angle + angleOffset) * (distributionRadius + radiusOffset)
            baseY = levelCenter.y + Math.sin(angle + angleOffset) * (distributionRadius + radiusOffset)
          }
        } else {
          // 如果没有找到等级中心，使用默认位置
          const goldenAngle = 2.399963229728653
          const angle = index * goldenAngle
          const distance = 600 + (index % 10) * 50
          baseX = centerX + Math.cos(angle) * distance
          baseY = centerY + Math.sin(angle) * distance
        }
        
        return {
          id: person.id,
          name: person.name,
          image: person.image,
          description: person.description,
          period: person.period,
          achievements: person.achievements,
          radius: nodeRadius, // 根据等级调整大小
          x: baseX,
          y: baseY,
          color: nodeColor + '66', // 根据学院设置颜色（增加透明度，在黑色背景上可见）
          borderColor: hasHonorFlag ? '#FFD700' : nodeColor, // 有荣誉的用亮金色边框
          textColor: '#fff', // 白色文字
          badgeColor: this.getBadgeColor(person),
          influenceLevel: level, // 保存等级
          hasHonor: hasHonorFlag, // 是否有荣誉
          // 用于碰撞检测
          vx: 0, // 速度分量
          vy: 0
        }
      })
      
      // 第四步：碰撞检测和避让算法（带等级分组逻辑，更分散）
      const maxIterations = 150 // 增加迭代次数，确保充分分散
      const damping = 0.85
      const repulsionStrength = 0.8 // 增大排斥力，让节点更分散
      const attractionStrength = 0.15 // 减小同等级吸引力，让节点更分散
      const levelRepulsionStrength = 0.5 // 增大不同等级排斥力
      
      for (let iteration = 0; iteration < maxIterations; iteration++) {
        let hasCollision = false
        
        // 遍历所有节点对，计算力
        for (let i = 0; i < nodes.length; i++) {
          let fx = 0, fy = 0 // 力的分量
          
          // 计算该节点所属等级群体的中心位置（用于吸引力）
          const nodeLevel = nodes[i].influenceLevel
          const sameLevelNodes = nodes.filter(n => n.influenceLevel === nodeLevel)
          const groupCenterX = sameLevelNodes.reduce((sum, n) => sum + n.x, 0) / sameLevelNodes.length
          const groupCenterY = sameLevelNodes.reduce((sum, n) => sum + n.y, 0) / sameLevelNodes.length
          
          // 向等级群体中心施加吸引力（较弱，让同等级人物聚集）
          const dxToCenter = groupCenterX - nodes[i].x
          const dyToCenter = groupCenterY - nodes[i].y
          const distToCenter = Math.sqrt(dxToCenter * dxToCenter + dyToCenter * dyToCenter)
          if (distToCenter > 0) {
            const attractionForce = Math.min(distToCenter / 200, 1) * attractionStrength // 距离越远，吸引力越强
            fx += (dxToCenter / distToCenter) * attractionForce
            fy += (dyToCenter / distToCenter) * attractionForce
          }
          
          for (let j = 0; j < nodes.length; j++) {
            if (i === j) continue
            
            const dx = nodes[j].x - nodes[i].x
            const dy = nodes[j].y - nodes[i].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const minDistBetween = minDistance
            
            // 如果距离太近，产生排斥力（避免重叠）
            if (distance > 0 && distance < minDistBetween) {
              hasCollision = true
              const force = (minDistBetween - distance) / distance * repulsionStrength
              fx -= dx * force
              fy -= dy * force
            }
            
            // 不同等级之间施加排斥力（让群体分散）
            const levelI = nodes[i].influenceLevel
            const levelJ = nodes[j].influenceLevel
            
            if (levelI !== levelJ && distance > 0 && distance < 300) {
              // 不同等级且距离较近时，产生排斥力
              const levelRepulsionForce = (300 - distance) / 300 * levelRepulsionStrength
              fx -= (dx / distance) * levelRepulsionForce
              fy -= (dy / distance) * levelRepulsionForce
            } else if (levelI === levelJ && distance > 0 && distance < 250) {
              // 同等级且距离较近时，施加轻微吸引力（让同等级聚集）
              const levelAttractionForce = (250 - distance) / 250 * attractionStrength * 0.5
              fx += (dx / distance) * levelAttractionForce
              fy += (dy / distance) * levelAttractionForce
            }
          }
          
          // 更新速度和位置
          nodes[i].vx = (nodes[i].vx + fx) * damping
          nodes[i].vy = (nodes[i].vy + fy) * damping
          nodes[i].x += nodes[i].vx
          nodes[i].y += nodes[i].vy
        }
        
        // 如果没有碰撞，提前结束
        if (!hasCollision && iteration > 10) {
          break
        }
      }
      
      // 第五步：移除临时属性，返回最终节点
      return nodes.map(node => ({
        id: node.id,
        name: node.name,
        image: node.image,
        description: node.description,
        period: node.period,
        achievements: node.achievements,
        radius: node.radius,
        x: node.x,
        y: node.y,
        color: node.color,
        borderColor: node.borderColor,
        textColor: node.textColor,
        badgeColor: node.badgeColor,
        influenceLevel: node.influenceLevel,
        nodeType: 'person' // 标记为人物节点
      }))
    },
    
    // 合并所有节点（人物 + 中介节点）
    allNodes() {
      return [...this.mediatorNodes, ...this.persons]
    },
    visibleLinks() {
      const links = []
      const personsMap = {}
      const nameToIdMap = {}
      
      // 建立人物ID映射和姓名到ID的映射
      this.persons.forEach(person => {
        personsMap[person.id] = person
        nameToIdMap[person.name] = person.id
      })
      
      // 从数据文件中读取所有人物及其关系
      const data = personsDetailDataAdvanced
      const processedPersonMediator = new Map() // 人物到中介节点的映射
      
      // 遍历所有人物，建立人物与中介节点的连接
      Object.keys(data).forEach(personId => {
        const person = data[personId]
        
        // 如果人物不存在于当前显示的人物列表中，跳过
        if (!personsMap[personId]) return
        
        // 处理人物关系，建立层级间连接和同级弱连接
        if (person.relationships && Array.isArray(person.relationships)) {
          person.relationships.forEach(rel => {
            // 跳过与学校的关系
            if (rel.name.includes('理工大学') || rel.name.includes('学校') || rel.name.includes('母校')) {
              return
            }
            
            // 通过姓名查找目标人物ID（支持模糊匹配）
            let targetId = nameToIdMap[rel.name]
            
            // 如果直接匹配找不到，尝试模糊匹配（去除空格、标点等）
            if (!targetId) {
              const cleanName = rel.name.trim().replace(/[，。、]/g, '')
              for (const [name, id] of Object.entries(nameToIdMap)) {
                if (name.includes(cleanName) || cleanName.includes(name)) {
                  targetId = id
                  break
                }
              }
            }
            
            if (targetId && targetId !== personId) {
              // 避免重复连线
              const exists = links.some(link => 
                (link.source === personId && link.target === targetId) ||
                (link.source === targetId && link.target === personId)
              )
              
              if (!exists) {
                // 获取两个人的等级
                const sourcePerson = personsMap[personId]
                const targetPerson = personsMap[targetId]
                const sourceLevel = sourcePerson ? sourcePerson.influenceLevel : 5
                const targetLevel = targetPerson ? targetPerson.influenceLevel : 5
                const levelDiff = Math.abs(sourceLevel - targetLevel)
                
                // 根据关系类型和层级差异确定连接类型
                let linkType = 'cross-level'
                let strength = 'medium'
                let label = rel.relation || '关系'
                
                // 师生关系（优先处理）
                if (rel.type === 'mentor' || rel.type === 'teacher') {
                  label = '导师'
                  if (levelDiff === 1) {
                    linkType = 'hierarchical'
                    strength = 'strong'
                  } else if (levelDiff === 0) {
                    linkType = 'same-level'
                    strength = 'weak'
                  } else {
                    linkType = 'cross-level'
                    strength = 'medium'
                  }
                } else if (rel.type === 'student') {
                  label = '学生'
                  if (levelDiff === 1) {
                    linkType = 'hierarchical'
                    strength = 'strong'
                  } else if (levelDiff === 0) {
                    linkType = 'same-level'
                    strength = 'weak'
                } else {
                    linkType = 'cross-level'
                    strength = 'medium'
                  }
                }
                // 层级间连接（相差1级）- 传承关系
                else if (levelDiff === 1) {
                  linkType = 'hierarchical'
                  strength = 'strong'
                  
                  // 根据等级关系确定标签
                  if (sourceLevel < targetLevel) {
                    // 高等级向低等级：传承、培养、引领
                    if (sourceLevel === 1) label = '传承'
                    else if (sourceLevel === 2) label = '引领'
                    else if (sourceLevel === 3) label = '影响'
                  } else {
                    // 低等级向高等级：继承、学习
                    label = '继承'
                  }
                  
                  // 如果有关系描述，使用描述
                  if (rel.relation) {
                    label = rel.relation
                  }
                }
                // 同级弱连接（相同等级）
                else if (levelDiff === 0) {
                  linkType = 'same-level'
                  strength = 'weak'
                  label = rel.type === 'colleague' ? '协作' : (rel.relation || '关系')
                }
                // 跨级连接（相差多级）
                else {
                  linkType = 'cross-level'
                  strength = 'medium'
                  label = rel.relation || '关系'
                }
                
                // 添加连接
                links.push({
                  source: personId,
                  target: targetId,
                  relation: rel.type || 'other',
                  label: label,
                  linkType: linkType,
                  strength: strength
                })
              }
            }
          })
        }
      })
      
      return links
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    document.addEventListener('mousemove', this.onPan)
    document.addEventListener('mouseup', this.endPan)
    document.addEventListener('mouseleave', this.endPan)
    this.handleResize()
    this.resetView()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('mousemove', this.onPan)
    document.removeEventListener('mouseup', this.endPan)
    document.removeEventListener('mouseleave', this.endPan)
  },
  methods: {
    async loadPersonsData() {
      try {
        console.log('[SimplePersonGraph] 开始加载人物数据...')
        this.personsDetailDataAdvanced = await getAllPersonProfiles()
        const dataCount = Object.keys(this.personsDetailDataAdvanced).length
        console.log('[SimplePersonGraph] 人物数据加载完成:', dataCount)
        
        if (dataCount === 0) {
          this.loadError = '未能获取人物数据，请检查后端服务或网络连接'
        }
        
        this.isLoadingData = false
      } catch (error) {
        console.error('[SimplePersonGraph] 加载人物数据失败:', error)
        this.personsDetailDataAdvanced = {}
        this.loadError = '加载人物数据失败，已使用本地示例数据'
        this.isLoadingData = false
      }
    },
    handleResize() {
      this.svgWidth = window.innerWidth
      this.svgHeight = window.innerHeight
    },
    getColorByIndex(index) {
      const colors = [
        'rgba(255, 215, 0, 0.3)',
        'rgba(102, 126, 234, 0.3)',
        'rgba(46, 204, 113, 0.3)',
        'rgba(255, 107, 107, 0.3)',
        'rgba(52, 152, 219, 0.3)',
        'rgba(155, 89, 182, 0.3)',
        'rgba(26, 188, 156, 0.3)',
        'rgba(230, 126, 34, 0.3)',
        'rgba(46, 134, 222, 0.3)'
      ]
      return colors[index % colors.length]
    },
    getBadgeColor(person) {
      const id = person.id
      if (['wangchengshan', 'duoji', 'tangjuxing', 'cuiperng', 'huruizhong'].includes(id)) {
        return '#FF6347'
      }
      if (['xuqiang', 'tuoxianguo', 'huangqi', 'lichao'].includes(id)) {
        return '#4169E1'
      }
      return null
    },
    getInfluenceLevel(person) {
      // 根据层级设计方案划分5个等级
      const personData = this.personsDetailDataAdvanced[person.id]
      if (!personData) return 5
      
      const subtitle = personData.subtitle || ''
      const keyTags = personData.keyTags || []
      const period = personData.period || ''
      const description = personData.description || ''
      // 合并所有文本，确保包含所有信息
      const allText = `${subtitle} ${keyTags.join(' ')} ${description} ${period}`.toLowerCase()
      
      // Level 1：创校与奠基人物（最高优先级）- 最中心
      // 优先检查五大学科奠基人和学科奠基人（即使同时是院士也应该是Level 1）
      if (allText.includes('五大学科奠基人') || allText.includes('学科奠基人') ||
          allText.includes('奠基人') || allText.includes('建校') || allText.includes('创校') ||
          (allText.includes('校长') && (period.includes('1956') || period.includes('1960') || period.includes('1970')))) {
        return 1
      }
      
      // Level 2：学科带头人/两院院士（国家级人才、学术权威）- 环绕第一层
      // 注意：如果已经是Level 1（奠基人），不会到这里
      if (allText.includes('院士') || allText.includes('academician') ||
          allText.includes('学科带头人') || allText.includes('学术权威') ||
          allText.includes('国家级人才') || allText.includes('长江学者') ||
          allText.includes('杰出青年') || allText.includes('千人计划')) {
        return 2
      }
      
      // Level 3：学院领导/教研室主任（学院建设、科研项目骨干）- 第三圈
      if (allText.includes('院长') || allText.includes('副院长') ||
          allText.includes('所长') || allText.includes('副所长') ||
          allText.includes('主任') || allText.includes('教研室主任') ||
          allText.includes('系主任') || allText.includes('项目负责人')) {
        return 3
      }
      
      // Level 4：优秀校友/青年教师代表（行业影响人物、社会代表）- 第四圈
      if (allText.includes('教授') || allText.includes('研究员') ||
          allText.includes('高级工程师') || allText.includes('博导') ||
          allText.includes('博士生导师') || allText.includes('校友') ||
          allText.includes('杰出校友')) {
        return 4
      }
      
      // Level 5：学生、青年科研者（默认）- 最外层
      return 5
    },
    
    // 根据学院获取节点颜色
    getNodeColorByCollege(person) {
      const colleges = this.getPersonColleges(person)
      const collegeColors = {
        'college-earth': '#4A90E2',      // 地球科学学院 - 蓝色
        'college-material': '#26E077',    // 材料学院 - 绿色
        'college-nuclear': '#B86BFF',     // 核技术学院 - 紫色
        'college-engineering': '#FFAA00', // 工程技术学院 - 橙色
        'college-chemistry': '#FF5A79',  // 材料与化学学院 - 粉红色
        'college-computer': '#00C9FF'     // 计算机学院 - 青色
      }
      const primaryCollege = colleges[0] || 'college-earth'
      return collegeColors[primaryCollege] || '#4A90E2'
    },
    
    // 根据等级获取节点半径（等级越高越大）
    getNodeRadiusByLevel(level) {
      const radiusMap = {
        1: 80,  // Level 1：创校与奠基人物 - 最大
        2: 70,  // Level 2：学科带头人/院士 - 较大
        3: 60,  // Level 3：学院领导 - 中等
        4: 50,  // Level 4：优秀校友 - 较小
        5: 45   // Level 5：青年科研者 - 最小
      }
      return radiusMap[level] || 50
    },
    
    // 判断是否有荣誉（院士、特殊贡献等）
    hasHonor(person) {
      const personData = this.personsDetailDataAdvanced[person.id]
      if (!personData) return false
      
      const subtitle = personData.subtitle || ''
      const keyTags = personData.keyTags || []
      const allText = `${subtitle} ${keyTags.join(' ')}`.toLowerCase()
      
      return allText.includes('院士') || allText.includes('奠基人') ||
             allText.includes('校长') || allText.includes('李四光奖') ||
             allText.includes('国家级') || allText.includes('特殊贡献')
    },
    getNodeX(nodeId) {
      const node = this.allNodes.find(n => n.id === nodeId)
      return node ? node.x : 0
    },
    getNodeY(nodeId) {
      const node = this.allNodes.find(n => n.id === nodeId)
      return node ? node.y : 0
    },
    // 根据人物信息推断所属学院
    getPersonColleges(person) {
      const colleges = []
      const name = person.name || ''
      const description = person.description || ''
      const subtitle = person.subtitle || ''
      const allText = `${name} ${description} ${subtitle}`.toLowerCase()
      
      // 根据关键词判断所属学院
      if (allText.includes('地球') || allText.includes('地质') || allText.includes('沉积')) {
        colleges.push('college-earth')
      }
      if (allText.includes('材料') || allText.includes('化学')) {
        colleges.push('college-material')
        colleges.push('college-chemistry')
      }
      if (allText.includes('核') || allText.includes('核技术')) {
        colleges.push('college-nuclear')
      }
      if (allText.includes('工程') || allText.includes('技术')) {
        colleges.push('college-engineering')
      }
      if (allText.includes('计算机') || allText.includes('信息')) {
        colleges.push('college-computer')
      }
      
      // 如果没有匹配到，默认分配一个学院
      if (colleges.length === 0) {
        colleges.push('college-earth')
      }
      
      return colleges
    },
    // 根据人物时期推断所属历史事件
    getPersonEvents(person) {
      const events = []
      const period = person.period || ''
      
      // 根据时期判断
      if (period.includes('1956') || period.includes('建校') || period.includes('1950')) {
        events.push('event-1956')
      }
      if (period.includes('1980') || period.includes('改革')) {
        events.push('event-1980s')
      }
      if (period.includes('2000') || period.includes('21世纪') || period.includes('国际化')) {
        events.push('event-2000s')
      }
      
      // 如果没有匹配到，根据时间推断
      if (events.length === 0) {
        const yearMatch = period.match(/\d{4}/)
        if (yearMatch) {
          const year = parseInt(yearMatch[0])
          if (year < 1980) {
            events.push('event-1956')
          } else if (year < 2000) {
            events.push('event-1980s')
          } else {
            events.push('event-2000s')
          }
        } else {
          // 默认添加建校事件
          events.push('event-1956')
        }
      }
      
      return events
    },
    // 拖动画布
    startPan(event) {
      if (event.target.tagName === 'circle' || event.target.tagName === 'image' || event.target.tagName === 'text') {
        return // 点击节点不拖动
      }
      this.isPanning = true
      this.panStartX = event.clientX - this.panX
      this.panStartY = event.clientY - this.panY
      event.preventDefault()
    },
    onPan(event) {
      if (!this.isPanning) return
      this.panX = event.clientX - this.panStartX
      this.panY = event.clientY - this.panStartY
    },
    endPan() {
      this.isPanning = false
    },
    // 滚轮缩放
    handleWheel(event) {
      event.preventDefault()
      const delta = event.deltaY > 0 ? 0.9 : 1.1
      const newZoom = this.zoomLevel * delta
      
      if (newZoom >= this.minZoom && newZoom <= this.maxZoom) {
        // 以鼠标位置为中心缩放
        const rect = this.$refs.svgElement.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
        
        const zoomChange = newZoom / this.zoomLevel
        this.panX = mouseX - (mouseX - this.panX) * zoomChange
        this.panY = mouseY - (mouseY - this.panY) * zoomChange
        
        this.zoomLevel = newZoom
      }
    },
    // 缩放控制
    zoomIn() {
      if (this.zoomLevel < this.maxZoom) {
        const newZoom = Math.min(this.maxZoom, this.zoomLevel * 1.2)
        this.zoomLevel = newZoom
      }
    },
    zoomOut() {
      if (this.zoomLevel > this.minZoom) {
        const newZoom = Math.max(this.minZoom, this.zoomLevel / 1.2)
        this.zoomLevel = newZoom
      }
    },
    resetView() {
      this.zoomLevel = 0.47  // 100%时显示的内容大小等于之前47%时的大小
      // 居中显示图谱（中心点在1200, 800），然后往左上角移动更多，再稍微往下调整
      this.panX = (this.svgWidth - 1200 * 0.47) / 2 - 300  // 往左移动300px
      this.panY = (this.svgHeight - 800 * 0.47) / 2 - 200  // 往上移动200px（比之前少50px，相当于往下移动50px）
    },
    selectNode(node) {
      if (this.isPanning) return
      // 只有人物节点才跳转到详情页面
      if (node.nodeType === 'person') {
        this.router.push(`/person/${node.id}`)
      } else {
        // 中介节点只显示基本信息
        this.selectedPerson = {
          name: node.name,
          description: node.type === 'college' ? '学院节点' : '历史事件节点',
          period: node.type === 'event' ? node.name : '',
          achievements: []
        }
      }
    },
    closeDetail() {
      this.selectedPerson = null
    },
    viewFullDetail() {
      if (this.selectedPerson) {
        this.router.push(`/person/${this.selectedPerson.id}`)
      }
    },
    goBack() {
      this.router.push('/')
    }
  }
}
</script>

<style scoped>
.simple-person-graph {
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  background: #000000; /* 保持黑色背景 */
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.data-status-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 30px 50px;
  border-radius: 15px;
  border: 2px solid rgba(74, 144, 226, 0.5);
  z-index: 10000;
  text-align: center;
}

.data-status-overlay p {
  color: #fff;
  font-size: 18px;
  margin: 0;
  font-weight: 500;
}

.data-status-overlay.warning {
  border-color: rgba(255, 193, 7, 0.6);
}

.data-status-overlay.warning p {
  color: #ffc107;
}

.graph-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin: 0;
  background: transparent;
  z-index: 100;
  pointer-events: none;
}

.graph-header > * {
  pointer-events: auto;
}

.back-section {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  width: 100%;
  pointer-events: none;
}

.header-center h2 {
  pointer-events: auto;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 25px;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: #4a90e2;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
}

.back-btn i {
  font-size: 16px;
}

.graph-title {
  font-size: 2rem;
  color: white; /* 白色文字 */
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.graph-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: #000000; /* 保持黑色背景 */
}

.graph-svg {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 0;
  background: #000000; /* 保持黑色背景 */
  backdrop-filter: none;
  border: none;
  cursor: grab;
  user-select: none;
}

.graph-svg:active {
  cursor: grabbing;
}

/* 连线样式 */
.links-group {
  pointer-events: none;
}

.link-line {
  pointer-events: none;
  transition: all 0.3s ease;
}

/* 层级间连接（粗实线） */
.link-hierarchical {
  stroke: #FFD700; /* 亮金色实线 */
  stroke-width: 3;
}

/* 同级连接（细虚线） */
.link-same-level {
  stroke: rgba(255, 255, 255, 0.5); /* 亮色虚线 */
  stroke-width: 1.5;
}

/* 跨级连接（中等粗细） */
.link-cross-level {
  stroke: rgba(255, 255, 255, 0.7); /* 亮色线 */
  stroke-width: 2;
}

/* 根据强度调整 */
.link-strong {
  stroke-width: 3;
  opacity: 0.9;
}

.link-medium {
  stroke-width: 2;
  opacity: 0.7;
}

.link-weak {
  stroke-width: 1;
  opacity: 0.4;
}

.relation-label-group {
  pointer-events: none;
}

.relation-label-bg {
  fill: rgba(0, 0, 0, 0.75); /* 黑色背景 */
  stroke: rgba(255, 255, 255, 0.3); /* 亮色边框 */
  stroke-width: 1;
}

.relation-label {
  fill: white; /* 白色文字 */
  font-size: 11px;
  font-weight: 600;
  pointer-events: none;
}

/* 所有节点 */
.graph-node {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.graph-node:hover {
  transform: translateY(-5px);
}

/* 人物节点 */
.node-person {
  cursor: pointer;
}

.person-circle {
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

/* 光晕效果 */
.honor-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.person-name {
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* 深色阴影 */
  pointer-events: none;
  fill: white; /* 白色文字 */
}

/* 中介节点样式 */
.node-mediator {
  cursor: pointer;
}

.mediator-node {
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
}

.mediator-name {
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* 深色阴影 */
  pointer-events: none;
  fill: white; /* 白色文字 */
}

.influence-badge {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  pointer-events: none;
}

/* 详情卡片 */
.person-detail-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  max-width: 90vw;
  background: rgba(0, 0, 0, 0.95); /* 保持黑色背景 */
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2); /* 亮色边框 */
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* 亮色分割线 */
}

.card-header h3 {
  margin: 0;
  color: white; /* 白色文字 */
  font-size: 24px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: white; /* 白色 */
  font-size: 32px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1); /* 亮色背景 */
  transform: rotate(90deg);
}

.card-body {
  padding: 20px;
}

.detail-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1); /* 亮色边框 */
}

.detail-description {
  color: white; /* 白色文字 */
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 20px;
}

.detail-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  color: rgba(255, 255, 255, 0.6); /* 白色半透明 */
  font-size: 14px;
  min-width: 60px;
}

.info-value {
  color: white; /* 白色文字 */
  font-size: 14px;
}

.view-detail-btn {
  width: 100%;
  background: rgba(74, 144, 226, 0.8);
  border: 2px solid rgba(74, 144, 226, 0.5);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-detail-btn:hover {
  background: rgba(74, 144, 226, 1);
  border-color: rgba(74, 144, 226, 0.8);
  transform: translateY(-2px);
}

/* 提示框 */
.hint-box {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 100;
}

.hint-box p {
  margin: 0;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

/* 缩放控制 */
.zoom-controls {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.zoom-btn {
  background: rgba(74, 144, 226, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.8);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 24px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-btn:hover {
  background: rgba(74, 144, 226, 1);
  transform: scale(1.05);
}

.zoom-level {
  color: white;
  font-size: 12px;
  text-align: center;
  padding: 5px;
}

.reset-btn {
  background: rgba(255, 107, 107, 0.6);
  border: 1px solid rgba(255, 107, 107, 0.8);
  color: white;
  width: 40px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: rgba(255, 107, 107, 1);
  transform: scale(1.05);
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

/* 响应式 */
@media (max-width: 768px) {
  .simple-person-graph {
    padding: 0;
  }
  
  .graph-title {
    font-size: 1.5rem;
  }
  
  .person-detail-card {
    width: 95vw;
  }
  
  .hint-box {
    bottom: 10px;
    font-size: 12px;
  }
  
  .hint-box p {
    font-size: 12px;
  }
  
  .zoom-controls {
    right: 10px;
    padding: 8px;
  }
  
  .zoom-btn {
    width: 35px;
    height: 35px;
    font-size: 20px;
  }
}
</style>
