<template>
  <div class="simple-person-graph">
    <!-- 顶部标题与返回 -->
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

    <!-- 图谱区域 -->
    <div class="graph-container" ref="graphContainer">
      <svg
        ref="svgElement"
        class="graph-svg"
        :width="svgWidth"
        :height="svgHeight"
        @mousedown="startPan"
        @wheel="handleWheel"
      >
        <!-- 背景与滤镜 -->
        <defs>
          <radialGradient id="bg-gradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#0b1220"/>
            <stop offset="60%" stop-color="#0a0f1a"/>
            <stop offset="100%" stop-color="#000000"/>
          </radialGradient>
          <filter id="label-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.6"/>
          </filter>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- 平移 + 缩放 -->
        <g :transform="`translate(${panX},${panY}) scale(${zoomLevel})`">
          <!-- 背景 -->
          <rect :x="world.left" :y="world.top" :width="world.width" :height="world.height" fill="url(#bg-gradient)"/>

          <!-- 同心层级圈（仅保留圈线，不再绘制文字） -->
          <g class="level-rings">
            <circle
              v-for="ring in levelRingSpecs"
              :key="`ring-${ring.level}`"
              :cx="layoutCenter.x"
              :cy="layoutCenter.y"
              :r="ring.radius"
              :stroke="ring.stroke"
              :stroke-width="ring.strokeWidth"
              :stroke-dasharray="ring.dash"
              :opacity="ring.opacity"
              fill="none"
            />
          </g>

          <!-- 关系连线：仅渲染可见集合中的边 -->
          <g class="links-group">
            <line
              v-for="link in visibleLinksRendered"
              :key="`${link.source}-${link.target}`"
              :x1="getNodeX(link.source)"
              :y1="getNodeY(link.source)"
              :x2="getNodeX(link.target)"
              :y2="getNodeY(link.target)"
              class="link-line"
              :class="[
                `link-${link.linkType || link.relation}`,
                `link-${link.strength || 'medium'}`,
                link.__emphasis ? 'link-emphasis' : 'link-dim'
              ]"
              :stroke-dasharray="link.linkType === 'same-level' ? '6,6' : '0'"
            />
            <!-- 关系标签（需要可留） -->
            <g
              v-for="link in visibleLinksRendered"
              :key="`label-${link.source}-${link.target}`"
              class="relation-label-group"
              :class="link.__emphasis ? 'label-emphasis' : 'label-dim'"
              filter="url(#label-shadow)"
            >
              <rect
                :x="(getNodeX(link.source) + getNodeX(link.target)) / 2 - 26"
                :y="(getNodeY(link.source) + getNodeY(link.target)) / 2 - 10"
                width="52"
                height="20"
                rx="6"
                class="relation-label-bg"
              />
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

          <!-- 节点（只渲染可见集合） -->
          <g v-for="node in allNodesRendered" :key="node.id" :transform="`translate(${node.x},${node.y})`">
            <g
              class="graph-node"
              :class="[ `node-${node.nodeType}`, node.__emphasis ? 'node-emphasis' : 'node-dim' ]"
              @click.stop="onNodeClick(node)"
              @dblclick.stop="goPerson(node)"
            >
              <!-- 人物 -->
              <g v-if="node.nodeType === 'person'">
                <defs>
                  <clipPath :id="`clip-${node.id}`"><circle :r="node.radius"/></clipPath>
                </defs>

                <circle v-if="node.hasHonor" class="honor-glow" :r="node.radius + 10" :fill="node.borderColor" opacity="0.25" filter="url(#node-glow)"/>
                <circle class="person-circle" :r="node.radius" :fill="node.color" :stroke="node.borderColor" :stroke-width="node.hasHonor ? 5 : 3"/>
                <image
                  :href="node.image"
                  :width="node.radius * 2.3"
                  :height="node.radius * 2.3"
                  :x="-node.radius * 1.15"
                  :y="-node.radius * 1.15"
                  :clip-path="`url(#clip-${node.id})`"
                  preserveAspectRatio="xMidYMid slice"
                />
                <text class="person-name" :y="node.radius + 24" text-anchor="middle" :fill="node.textColor">{{ node.name }}</text>

                <!-- 等级徽记 -->
                <circle class="influence-badge" :cx="node.radius * 0.74" :cy="-node.radius * 0.74" r="12" :fill="badgeBg(node)" :stroke="node.borderColor" stroke-width="1.5"/>
                <text :x="node.radius * 0.74" :y="-node.radius * 0.74" class="badge-text" text-anchor="middle" dominant-baseline="middle">{{ node.influenceLevel }}</text>
              </g>

              <!-- 中介（接口保留） -->
              <g v-else>
                <rect :x="-node.width / 2" :y="-node.height / 2" :width="node.width" :height="node.height" rx="10" :fill="node.color" :stroke="node.borderColor" stroke-width="2" class="mediator-node"/>
                <text class="mediator-name" text-anchor="middle" dominant-baseline="middle" :fill="node.textColor">{{ node.name }}</text>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>

    <!-- 详情卡 -->
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
          <div class="detail-actions">
            <button @click="toggleExpand(selectedPerson.id)" class="expand-btn">
              {{ isBranchExpanded(selectedPerson.id) ? '折叠分支' : '展开分支' }}
            </button>
            <button @click="viewFullDetail" class="view-detail-btn">查看完整资料</button>
          </div>
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
      // 从数据库加载的人物数据
      personsDetailDataAdvanced: {},
      isLoadingData: true,
      svgWidth: window.innerWidth,
      svgHeight: window.innerHeight,

      // 平移
      panX: 0, panY: 0, isPanning: false, panStartX: 0, panStartY: 0,

      // 缩放（以0.47为100%）
      zoomLevel: 0.47, minZoom: 0.15, maxZoom: 2.0,

      // 选择/展开
      selectedPerson: null,
      expandedIds: new Set(),     // 用户通过按钮主动展开的 id
      lockedLevel1Ids: new Set(), // Level 1 始终可见

      // 缓存
      cachedNodes: null,
      cachedLinks: null
    }
  },
  computed: {
    displayZoomPercent() { return Math.round((this.zoomLevel / 0.47) * 100) },
    world() { return { left: -2000, top: -2000, width: 4000, height: 4000 } },
    layoutCenter() { return { x: 1200, y: 800 } },
    levelRadiiMap() { return { 1: 0, 2: 250, 3: 480, 4: 700, 5: 920 } },
    levelRingSpecs() {
      const r = this.levelRadiiMap
      return [
        { level: 1, radius: 140, stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1, dash: '8,10', opacity: 0.7 },
        { level: 2, radius: r[2], stroke: 'rgba(255,255,255,0.25)', strokeWidth: 1, dash: '6,6', opacity: 0.6 },
        { level: 3, radius: r[3], stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1, dash: '8,10', opacity: 0.5 },
        { level: 4, radius: r[4], stroke: 'rgba(255,255,255,0.14)', strokeWidth: 1, dash: '0',    opacity: 0.4 },
        { level: 5, radius: r[5], stroke: 'rgba(255,255,255,0.1)',  strokeWidth: 1, dash: '2,10', opacity: 0.3 }
      ]
    },

    personsRaw() {
      const data = this.personsDetailDataAdvanced || {}
      return Object.values(data)
    },

    // 预计算节点位置：Level1 用“等角圆环 + 自适应半径”避免重叠
    preLayoutNodes() {
      if (this.cachedNodes) return this.cachedNodes
      const centerX = this.layoutCenter.x, centerY = this.layoutCenter.y
      const groups = { 1: [], 2: [], 3: [], 4: [], 5: [] }
      this.personsRaw.forEach(p => groups[this.getInfluenceLevel(p)].push(p))

      const nodes = []
      Object.keys(groups).forEach(k => {
        const level = +k, list = groups[level]; if (!list.length) return
        const rNode = this.getNodeRadiusByLevel(level), ringR = this.levelRadiiMap[level]

        if (level === 1) {
          // 根据数量和节点直径估算圆环半径，避免重叠
          const gap = 16
          const diameter = rNode * 2
          const minR = 120
          const R = Math.max(minR, ((diameter + gap) * list.length) / (2 * Math.PI))
          const total = list.length
          const step = (Math.PI * 2) / Math.max(total, 1)
          list.forEach((p, i) => {
            const ang = i * step
            const x = centerX + Math.cos(ang) * R
            const y = centerY + Math.sin(ang) * R
            nodes.push(this.buildPersonNode(p, x, y, rNode))
          })
          return
        }

        // 其他层级仍在各自环上
        const total = list.length, step = (Math.PI * 2) / Math.max(total, 1)
        list.forEach((p, i) => {
          const ang = i * step
          const jA = this.seedNoise(p.id, 0.25)
          const jR = this.seedNoise(p.id + 'r', 28)
          const x = centerX + Math.cos(ang + jA) * (ringR + jR)
          const y = centerY + Math.sin(ang + jA) * (ringR + jR)
          nodes.push(this.buildPersonNode(p, x, y, rNode))
        })
      })

      this.cachedNodes = nodes
      return nodes
    },

    persons() { return this.preLayoutNodes },
    mediatorNodes() { return [] },
    allNodes() { return [...this.mediatorNodes, ...this.persons] },

    nodeMap() {
      const m = new Map(); this.allNodes.forEach(n => m.set(n.id, n)); return m
    },

    // 全量边（只算一次）
    linksAll() {
      if (this.cachedLinks) return this.cachedLinks
      const data = this.personsDetailDataAdvanced || {}
      const links = []
      const nameToId = {}; this.persons.forEach(p => nameToId[p.name] = p.id)
      const ensureId = (name) => {
        let id = nameToId[name]; if (id) return id
        const clean = (name || '').trim().replace(/[，。、\s]/g, '')
        for (const n in nameToId) {
          const cmp = n.replace(/\s/g, '')
          if (clean.includes(cmp) || cmp.includes(clean)) return nameToId[n]
        }
        return null
      }

      Object.keys(data).forEach(pid => {
        const rels = Array.isArray(data[pid]?.relationships) ? data[pid].relationships : []
        if (!this.nodeMap.has(pid)) return
        rels.forEach(rel => {
          if (/(理工大学|学校|母校)/.test(rel.name || '')) return
          const tid = ensureId(rel.name); if (!tid || tid === pid) return
          const dup = links.some(l => (l.source === pid && l.target === tid) || (l.source === tid && l.target === pid))
          if (dup) return

          const s = this.nodeMap.get(pid), t = this.nodeMap.get(tid)
          const dl = Math.abs((s?.influenceLevel || 5) - (t?.influenceLevel || 5))
          let linkType = 'cross-level', strength = 'medium', label = rel.relation || '关系'
          if (rel.type === 'mentor' || rel.type === 'teacher') {
            label = '导师'; if (dl === 1) {linkType='hierarchical'; strength='strong'} else if (dl===0){linkType='same-level'; strength='weak'}
          } else if (rel.type === 'student') {
            label = '学生'; if (dl === 1) {linkType='hierarchical'; strength='strong'} else if (dl===0){linkType='same-level'; strength='weak'}
          } else if (dl === 1) { linkType='hierarchical'; strength='strong' }
          else if (dl === 0) { linkType='same-level'; strength='weak' }

          links.push({ source: pid, target: tid, relation: rel.type || 'other', label, linkType, strength })
        })
      })

      this.cachedLinks = links
      return links
    },

    // Level 1 id 集合（用于锁定可见）
    level1Ids() {
      const s = new Set()
      this.persons.forEach(n => { if (n.influenceLevel === 1) s.add(n.id) })
      return s
    },

    // 可见节点集合：Level1 ∪ 一度邻居(仅来自“按钮触发展开”的节点)
    visibleNodeIdSet() {
      const visible = new Set(this.lockedLevel1Ids)
      if (this.expandedIds.size === 0) return visible
      const exp = this.expandedIds
      this.linksAll.forEach(l => {
        if (exp.has(l.source) || exp.has(l.target)) {
          visible.add(l.source); visible.add(l.target)
        }
      })
      return visible
    },

    // 渲染节点：只渲染可见集合
    allNodesRendered() {
      const visible = this.visibleNodeIdSet
      return this.allNodes
        .filter(n => visible.has(n.id))
        .map(n => ({ ...n, __emphasis: this.expandedIds.has(n.id) || this.lockedLevel1Ids.has(n.id) }))
    },

    // 渲染边：两端都在可见集合时渲染
    visibleLinksRendered() {
      const visible = this.visibleNodeIdSet
      return this.linksAll
        .filter(l => visible.has(l.source) && visible.has(l.target))
        .map(l => ({ ...l, __emphasis: this.expandedIds.has(l.source) || this.expandedIds.has(l.target) || this.lockedLevel1Ids.has(l.source) || this.lockedLevel1Ids.has(l.target) }))
    }
  },

  async mounted() {
    await this.loadPersonsData()
    window.addEventListener('resize', this.handleResize, { passive: true })
    document.addEventListener('mousemove', this.onPan)
    document.addEventListener('mouseup', this.endPan)

    // —— 初始：只显示 Level 1 —— //
    this.lockedLevel1Ids = new Set(this.level1Ids) // Level1 可见
    this.expandedIds = new Set()                   // 不自动/不点击节点展开邻居

    this.handleResize()
    this.resetView()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('mousemove', this.onPan)
    document.removeEventListener('mouseup', this.endPan)
  },

  methods: {
    async loadPersonsData() {
      try {
        console.log('[SimplePersonGraph2] 开始加载人物数据...')
        this.personsDetailDataAdvanced = await getAllPersonProfiles()
        console.log('[SimplePersonGraph2] 人物数据加载完成:', Object.keys(this.personsDetailDataAdvanced).length)
        this.isLoadingData = false
      } catch (error) {
        console.error('[SimplePersonGraph2] 加载人物数据失败:', error)
        this.personsDetailDataAdvanced = {}
        this.isLoadingData = false
      }
    },
    // 工具
    handleResize() { this.svgWidth = window.innerWidth; this.svgHeight = window.innerHeight },
    seedNoise(seed, amp = 1) { const s = Array.from(String(seed)).reduce((a,c)=>a+c.charCodeAt(0),0); const r = Math.sin(s*91.345)*10000; return (r - Math.floor(r) - 0.5) * amp },
    badgeBg(n) { return n.hasHonor ? 'rgba(255,215,0,0.85)' : 'rgba(255,255,255,0.12)' },

    // 构造节点
    buildPersonNode(person, x, y, radius) {
      const level = this.getInfluenceLevel(person)
      const color = this.getNodeColorByCollege(person)
      const honor = this.hasHonor(person)
      return {
        id: person.id, name: person.name, image: person.image,
        description: person.description, period: person.period, achievements: person.achievements,
        radius, x, y, color: color + '66', borderColor: honor ? '#FFD700' : color, textColor: '#fff',
        badgeColor: this.getBadgeColor(person), influenceLevel: level, nodeType: 'person', hasHonor: honor
      }
    },

    // 坐标访问
    getNodeX(id){ return this.nodeMap.get(id)?.x || 0 },
    getNodeY(id){ return this.nodeMap.get(id)?.y || 0 },

    // 分支展开状态
    isBranchExpanded(id){ return this.expandedIds.has(id) },

    // 切换分支（仅由按钮触发）
    toggleExpand(id){
      const s = new Set(this.expandedIds)
      if (s.has(id)) s.delete(id); else s.add(id)
      this.expandedIds = s
    },

    // 节点点击：只选中，不再展开分支
    onNodeClick(node){
      if (this.isPanning) return
      if (node.nodeType === 'person') {
        this.selectedPerson = this.nodeMap.get(node.id) || node
        // —— 不再自动展开 —— //
        // this.toggleExpand(node.id)
      }
    },

    // 打开人物详情页
    goPerson(node){ if (node?.nodeType === 'person') this.router.push(`/person/${node.id}`) },
    closeDetail(){ this.selectedPerson = null },
    viewFullDetail(){ if (this.selectedPerson?.id) this.router.push(`/person/${this.selectedPerson.id}`) },
    goBack(){ this.router.push('/') },

    // ==== 平移/缩放 ====
    startPan(e){
      // 若点击在节点上，则不触发拖拽；否则进入拖拽
      const target = e.target
      if (target && typeof target.closest === 'function' && target.closest('.graph-node')) return
      this.isPanning = true
      this.panStartX = e.clientX - this.panX
      this.panStartY = e.clientY - this.panY
      e.preventDefault()
    },
    onPan(e){
      if (!this.isPanning) return
      this.panX = e.clientX - this.panStartX
      this.panY = e.clientY - this.panStartY
    },
    endPan(){ this.isPanning = false },

    handleWheel(e){
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel * factor))
      const rect = this.$refs.svgElement.getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top, k = newZoom / this.zoomLevel
      this.panX = mx - (mx - this.panX) * k
      this.panY = my - (my - this.panY) * k
      this.zoomLevel = newZoom
    },
    zoomIn(){ this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel * 1.2) },
    zoomOut(){ this.zoomLevel = Math.max(this.minZoom, this.zoomLevel / 1.2) },
    resetView(){
      this.zoomLevel = 0.47
      const cx = this.layoutCenter.x * this.zoomLevel, cy = this.layoutCenter.y * this.zoomLevel
      this.panX = (this.svgWidth - cx) / 2
      this.panY = (this.svgHeight - cy) / 2
    },

    // —— 原有业务判断接口（保持不变）——
    getBadgeColor(person){
      const id = person.id
      if (['wangchengshan','duoji','tangjuxing','cuiperng','huruizhong'].includes(id)) return '#FF6347'
      if (['xuqiang','tuoxianguo','huangqi','lichao'].includes(id)) return '#4169E1'
      return null
    },
    getInfluenceLevel(person){
      const pd = this.personsDetailDataAdvanced[person.id]; if (!pd) return 5
      const subtitle = pd.subtitle || '', keyTags = pd.keyTags || [], period = pd.period || '', description = pd.description || ''
      const allText = `${subtitle} ${keyTags.join(' ')} ${description} ${period}`.toLowerCase()
      if (allText.includes('五大学科奠基人') || allText.includes('学科奠基人') || allText.includes('奠基人') || allText.includes('建校') || allText.includes('创校') || (allText.includes('校长') && (period.includes('1956') || period.includes('1960') || period.includes('1970')))) return 1
      if (allText.includes('院士') || allText.includes('academician') || allText.includes('学科带头人') || allText.includes('学术权威') || allText.includes('国家级人才') || allText.includes('长江学者') || allText.includes('杰出青年') || allText.includes('千人计划')) return 2
      if (allText.includes('院长') || allText.includes('副院长') || allText.includes('所长') || allText.includes('副所长') || allText.includes('主任') || allText.includes('教研室主任') || allText.includes('系主任') || allText.includes('项目负责人')) return 3
      if (allText.includes('教授') || allText.includes('研究员') || allText.includes('高级工程师') || allText.includes('博导') || allText.includes('博士生导师') || allText.includes('校友') || allText.includes('杰出校友')) return 4
      return 5
    },
    getNodeColorByCollege(person){
      const colleges = this.getPersonColleges(person)
      const colors = {
        'college-earth': '#4A90E2',
        'college-material': '#26E077',
        'college-nuclear': '#B86BFF',
        'college-engineering': '#FFAA00',
        'college-chemistry': '#FF5A79',
        'college-computer': '#00C9FF'
      }
      const p = colleges[0] || 'college-earth'
      return colors[p] || '#4A90E2'
    },
    getNodeRadiusByLevel(level){ return ({1:80,2:70,3:60,4:50,5:45}[level] || 50) },
    hasHonor(person){
      const pd = this.personsDetailDataAdvanced[person.id]; if (!pd) return false
      const subtitle = pd.subtitle || '', keyTags = pd.keyTags || []
      const allText = `${subtitle} ${keyTags.join(' ')}`.toLowerCase()
      return allText.includes('院士') || allText.includes('奠基人') || allText.includes('校长') || allText.includes('李四光奖') || allText.includes('国家级') || allText.includes('特殊贡献')
    },
    getPersonColleges(person){
      const arr = [], name = person.name || '', description = person.description || '', subtitle = person.subtitle || ''
      const t = `${name} ${description} ${subtitle}`.toLowerCase()
      if (t.includes('地球') || t.includes('地质') || t.includes('沉积')) arr.push('college-earth')
      if (t.includes('材料') || t.includes('化学')) { arr.push('college-material'); arr.push('college-chemistry') }
      if (t.includes('核') || t.includes('核技术')) arr.push('college-nuclear')
      if (t.includes('工程') || t.includes('技术')) arr.push('college-engineering')
      if (t.includes('计算机') || t.includes('信息')) arr.push('college-computer')
      if (!arr.length) arr.push('college-earth')
      return arr
    }
  }
}
</script>

<style scoped>
/* 基础布局 */
.simple-person-graph{position:fixed;inset:0;background:#000;overflow:hidden}
.graph-header{position:fixed;inset:0 auto auto 0;right:0;display:flex;justify-content:space-between;align-items:center;padding:12px 18px;background:transparent;z-index:100;pointer-events:none}
.graph-header>*{pointer-events:auto}
.back-section{position:fixed;top:20px;left:20px;z-index:1000}
.header-center{position:absolute;left:50%;top:20px;transform:translateX(-50%);width:100%;display:flex;justify-content:center}
.graph-title{font-size:2rem;color:#fff;margin:0;font-weight:800;letter-spacing:.2px;text-shadow:0 8px 24px rgba(0,0,0,.45)}
.back-btn{display:flex;align-items:center;gap:8px;padding:12px 20px;background:rgba(255,255,255,.95);border:none;border-radius:999px;color:#3569ff;font-size:14px;font-weight:600;cursor:pointer;transition:all .25s;box-shadow:0 12px 30px rgba(0,0,0,.18);backdrop-filter:blur(10px)}
.back-btn:hover{background:#3569ff;color:#fff;transform:translateY(-1px);box-shadow:0 16px 36px rgba(53,105,255,.35)}
.graph-container{position:absolute;inset:0;background:#000}
.graph-svg{width:100%;height:100%;display:block;cursor:grab;user-select:none}
.graph-svg:active{cursor:grabbing}

/* 层级圈 */
.level-rings circle{transition:opacity .3s ease}

/* 边 */
.links-group{pointer-events:none}
.link-line{pointer-events:none;transition:opacity .25s,stroke-width .25s}
.link-hierarchical{stroke:#FFD700;stroke-width:3}
.link-same-level{stroke:rgba(255,255,255,.65);stroke-width:1.6}
.link-cross-level{stroke:rgba(255,255,255,.8);stroke-width:2}
.link-strong{stroke-width:3;opacity:.95}
.link-medium{stroke-width:2;opacity:.75}
.link-weak{stroke-width:1;opacity:.45}
.link-emphasis{opacity:1;filter:drop-shadow(0 0 6px rgba(255,255,255,.25))}
.link-dim{opacity:.18}
.relation-label-group{pointer-events:none;transition:opacity .2s}
.relation-label-bg{fill:rgba(0,0,0,.7);stroke:rgba(255,255,255,.25);stroke-width:1}
.relation-label{fill:#fff;font-size:11px;font-weight:700}
.label-emphasis{opacity:1}
.label-dim{opacity:.15}

/* 节点 */
.graph-node{cursor:pointer;transition:transform .25s}
.graph-node:hover{transform:translateY(-4px) scale(1.01)}
.node-emphasis{filter:drop-shadow(0 8px 24px rgba(0,0,0,.35))}
.node-dim{opacity:1} /* 只渲染可见节点，无需置灰 */
.person-circle{filter:drop-shadow(0 6px 18px rgba(0,0,0,.35));transition:all .25s}
.honor-glow{animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.5;transform:scale(1.05)}}
.person-name{font-size:16px;font-weight:700;text-shadow:0 2px 6px rgba(0,0,0,.6);pointer-events:none;fill:#fff}
.mediator-node{filter:drop-shadow(0 6px 18px rgba(0,0,0,.35))}
.mediator-name{font-size:12px;font-weight:700;fill:#fff;text-shadow:0 2px 6px rgba(0,0,0,.6)}
.influence-badge{filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}
.badge-text{fill:#12161f;font-size:11px;font-weight:900}

/* 详情卡 */
.person-detail-card{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:520px;max-width:92vw;background:rgba(8,12,20,.92);backdrop-filter:blur(20px);border-radius:18px;border:1px solid rgba(255,255,255,.12);z-index:1000;box-shadow:0 28px 80px rgba(0,0,0,.55)}
.card-header{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.08)}
.card-header h3{margin:0;color:#fff;font-size:22px;font-weight:800}
.close-btn{background:none;border:none;color:#fff;font-size:28px;cursor:pointer;width:36px;height:36px;display:grid;place-items:center;border-radius:50%;transition:all .2s}
.close-btn:hover{background:rgba(255,255,255,.12);transform:rotate(90deg)}
.card-body{padding:18px 20px 20px}
.detail-image{width:100%;height:220px;object-fit:cover;border-radius:12px;margin-bottom:16px;border:1px solid rgba(255,255,255,.08)}
.detail-description{color:#f3f6ff;font-size:14px;line-height:1.85;opacity:.92;margin-bottom:14px}
.info-item{display:flex;gap:8px;margin-bottom:8px}
.info-label{color:rgba(255,255,255,.65);font-size:13px;min-width:60px}
.info-value{color:#fff;font-size:13px}
.detail-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.view-detail-btn,.expand-btn{width:100%;padding:12px 16px;border-radius:10px;border: 1px solid transparent;color:#fff;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s}
.view-detail-btn{background:rgba(74,144,226,.9);border-color:rgba(74,144,226,.65)}
.view-detail-btn:hover{background:rgba(74,144,226,1);transform:translateY(-1px)}
.expand-btn{background:rgba(30,201,119,.85);border-color:rgba(30,201,119,.6)}
.expand-btn:hover{background:rgba(30,201,119,1);transform:translateY(-1px)}
.slide-enter-active,.slide-leave-active{transition:all .25s}
.slide-enter-from,.slide-leave-to{opacity:0;transform:translate(-50%,-50%) scale(.94)}

/* 缩放控件 */
.zoom-controls{position:fixed;right:26px;top:50%;transform:translateY(-50%);background:rgba(8,12,20,.88);backdrop-filter:blur(12px);border-radius:14px;padding:10px;border:1px solid rgba(255,255,255,.12);z-index:100;display:flex;flex-direction:column;gap:8px;box-shadow:0 16px 50px rgba(0,0,0,.4)}
.zoom-btn,.reset-btn{background:rgba(53,105,255,.7);border:1px solid rgba(53,105,255,.85);color:#fff;width:42px;height:42px;border-radius:10px;cursor:pointer;font-size:22px;font-weight:800;transition:all .2s;display:grid;place-items:center}
.zoom-btn:hover{background:rgba(53,105,255,1);transform:translateY(-1px) scale(1.03)}
.zoom-level{color:#fff;font-size:12px;text-align:center;padding:4px 0;opacity:.85}
.reset-btn{height:32px;font-size:12px;font-weight:800;background:rgba(255,99,99,.7);border-color:rgba(255,99,99,.85)}
.reset-btn:hover{background:rgba(255,99,99,1);transform:translateY(-1px) scale(1.03)}
@media (max-width:768px){.graph-title{font-size:1.4rem}.person-detail-card{width:95vw}.zoom-controls{right:10px}}
</style>