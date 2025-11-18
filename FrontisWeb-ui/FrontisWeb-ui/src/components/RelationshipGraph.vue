<template>
  <div class="relationship-graph-container">
    <div v-if="hasData" ref="graphContainer" class="graph-wrapper">
      <!-- 图谱内部的控制按钮 -->
      <div class="graph-controls-inner">
        <button @click="zoomIn" class="control-btn" title="放大">
          <i class="fas fa-search-plus"></i>
        </button>
        <button @click="zoomOut" class="control-btn" title="缩小">
          <i class="fas fa-search-minus"></i>
        </button>
        <button @click="resetZoom" class="control-btn" title="重置">
          <i class="fas fa-redo"></i>
        </button>
        <button @click="toggleFullscreen" class="control-btn" title="全屏">
          <i class="fas fa-expand"></i>
        </button>
      </div>
      <svg ref="svg" class="graph-svg"></svg>
      <div v-if="selectedNode" class="node-info-panel">
        <button @click="closeNodeInfo" class="close-info-btn">
          <i class="fas fa-times"></i>
        </button>
        <h3>{{ selectedNode.name }}</h3>
        <p class="node-type">{{ getNodeTypeLabel(selectedNode.type) }}</p>
      </div>
    </div>
    <div v-else class="no-data-message">
      <i class="fas fa-info-circle"></i>
      <p>暂无关系图谱数据</p>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { getRelationshipDataByPersonId } from '@/data/relationshipData.js'
import unknownImg from '@/assets/persons/unknown.png'

// 动态导入所有人物图片
const personImageModules = import.meta.glob('@/assets/persons/*.png', { eager: true })
// 创建人物图片映射
const personImageMap = {}
Object.entries(personImageModules).forEach(([path, module]) => {
  const fileName = path.split('/').pop() || ''
  const personId = fileName.replace('.png', '')
  const imageUrl = module?.default || module
  if (personId && imageUrl) {
    personImageMap[personId] = imageUrl
  }
})

export default {
  name: 'RelationshipGraph',
  props: {
    personId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      svg: null,
      simulation: null,
      zoom: null,
      selectedNode: null,
      isFullscreen: false,
      hasCentered: false // 居中标志，确保每次初始化时重置
    }
  },
  computed: {
    graphData() {
      return getRelationshipDataByPersonId(this.personId)
    },
    hasData() {
      return this.graphData && 
             this.graphData.nodes && 
             this.graphData.nodes.length > 0 &&
             this.graphData.links &&
             this.graphData.links.length > 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.graphData && this.graphData.nodes && this.graphData.nodes.length > 0) {
        // 延迟初始化，确保容器尺寸正确
        setTimeout(() => {
          this.initGraph()
        }, 100)
      }
    })
  },
  beforeUnmount() {
    if (this.simulation) {
      this.simulation.stop()
    }
    // 重置居中标志，确保下次进入时重新居中
    this.hasCentered = false
  },
  methods: {
    initGraph() {
      if (!this.graphData) return
      
      // 重置居中标志，确保每次初始化时重新居中
      this.hasCentered = false
      
      const container = this.$refs.graphContainer
      const svgElement = this.$refs.svg
      
      if (!container || !svgElement) return
      
      const width = container.clientWidth
      const height = container.clientHeight || window.innerHeight
      
      // 清空SVG
      d3.select(svgElement).selectAll('*').remove()
      
      // 创建SVG
      const svg = d3.select(svgElement)
        .attr('width', width)
        .attr('height', height)
      
      this.svg = svg
      
      // 创建缩放和平移（禁用滚轮缩放）
      const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .filter((event) => {
          // 只允许拖拽和平移，禁止滚轮缩放
          return event.type !== 'wheel'
        })
        .on('zoom', (event) => {
          g.attr('transform', event.transform)
        })
      
      // 创建主容器
      const g = svg.append('g')
        .attr('transform', 'translate(0,0)') // 确保初始位置为0,0
      
      // 先设置zoom，但不立即应用transform，等力导向图稳定后再居中
      svg.call(zoom)
      this.zoom = zoom
      
      // 初始化时重置缩放和平移，确保没有之前的变换
      svg.call(zoom.transform, d3.zoomIdentity)
      
      // 确保g容器也没有transform
      g.attr('transform', 'translate(0,0)')
      
      // 创建箭头标记和裁剪路径
      const defs = svg.append('defs')
      
      // 箭头标记
      const arrowMarker = defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
      
      arrowMarker.append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#9ca3af')
      
      // 准备节点数据（包含中心人物）
      const allNodes = [
        { ...this.graphData.centerPerson, isCenter: true },
        ...this.graphData.nodes
      ]
      
      // 直接设置中心位置
      const centerX = width / 2
      const centerY = height / 2
      
      // 初始化节点位置到中心
      allNodes.forEach(node => {
        if (!node.x) node.x = centerX
        if (!node.y) node.y = centerY
      })
      
      // 准备链接数据
      const links = this.graphData.links.map(link => ({
        source: typeof link.source === 'string' ? link.source : link.source.id,
        target: typeof link.target === 'string' ? link.target : link.target.id,
        label: link.label,
        type: link.type
      }))
      
      // 创建力导向图，直接设置中心位置
      const simulation = d3.forceSimulation(allNodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(centerX, centerY))
        .force('collision', d3.forceCollide().radius(50))
      
      this.simulation = simulation
      
      // 创建链接
      const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke', '#9ca3af')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)')
      
      // 创建链接标签背景
      const linkLabelBg = g.append('g')
        .attr('class', 'link-label-bg')
        .selectAll('rect')
        .data(links.filter(d => d.label))
        .enter().append('rect')
        .attr('width', d => d.label.length * 8 + 8)
        .attr('height', 18)
        .attr('x', d => -(d.label.length * 8 + 8) / 2)
        .attr('y', -9)
        .attr('rx', 4)
        .attr('fill', 'rgba(255, 255, 255, 0.9)')
        .attr('stroke', 'rgba(236, 72, 153, 0.3)')
        .attr('stroke-width', 1)
      
      // 创建链接标签
      const linkLabels = g.append('g')
        .attr('class', 'link-labels')
        .selectAll('text')
        .data(links.filter(d => d.label))
        .enter().append('text')
        .attr('class', 'link-label')
        .attr('font-size', '11px')
        .attr('fill', '#6b7280')
        .attr('text-anchor', 'middle')
        .attr('dy', 4)
        .text(d => d.label)
      
      // 创建节点
      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(allNodes)
        .enter().append('g')
        .attr('class', d => `node ${d.type} ${d.isCenter ? 'center' : ''}`)
        .call(this.drag(simulation))
        .on('click', (event, d) => {
          this.selectedNode = d
          event.stopPropagation()
        })
      
      // 保存组件实例的引用，以便在回调中使用
      const self = this
      
      // 根据节点类型创建不同形状
      node.each(function(d) {
        const nodeGroup = d3.select(this)
        
        if (d.type === 'event') {
          // 事件节点：矩形
          nodeGroup.append('rect')
            .attr('width', 80)
            .attr('height', 40)
            .attr('x', -40)
            .attr('y', -20)
            .attr('rx', 5)
            .attr('class', 'node-shape')
            .attr('fill', d.isCenter ? '#fce7f3' : '#e5e7eb')
            .attr('stroke', d.isCenter ? '#ec4899' : '#9ca3af')
            .attr('stroke-width', d.isCenter ? 3 : 2)
          
          // 添加文档图标
          nodeGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', -5)
            .attr('font-size', '14px')
            .text('📄')
        } else if (d.type === 'location') {
          // 地点节点：圆形带图标
          nodeGroup.append('circle')
            .attr('r', d.isCenter ? 30 : 25)
            .attr('class', 'node-shape')
            .attr('fill', '#fbbf24')
            .attr('stroke', '#f59e0b')
            .attr('stroke-width', d.isCenter ? 3 : 2)
          
          nodeGroup.append('text')
            .attr('class', 'location-icon')
            .attr('text-anchor', 'middle')
            .attr('dy', 5)
            .attr('font-size', '16px')
            .text('🎯')
        } else {
          // 人物节点：圆形带图片
          const radius = d.isCenter ? 30 : 25
          
          // 创建圆形背景
          nodeGroup.append('circle')
            .attr('r', radius)
            .attr('class', 'node-shape')
            .attr('fill', d.isCenter ? '#fce7f3' : '#f3f4f6')
            .attr('stroke', d.isCenter ? '#ec4899' : '#6b7280')
            .attr('stroke-width', d.isCenter ? 3 : 2)
          
          // 创建裁剪路径（圆形）- 使用节点ID作为clipId（每个节点ID唯一）
          const clipId = `clip-${d.id}`
          // 检查是否已存在该clipPath，避免重复创建
          let clipPath = defs.select(`#${clipId}`)
          if (clipPath.empty()) {
            clipPath = defs.append('clipPath')
              .attr('id', clipId)
            clipPath.append('circle')
              .attr('r', radius - 2) // 稍微小一点，留出边框
          }
          
          // 添加人物图片 - 使用组件实例的方法
          const imageUrl = self.getPersonImageUrl(d.id)
          
          const imageElement = nodeGroup.append('image')
            .attr('x', -radius + 2)
            .attr('y', -radius + 2)
            .attr('width', (radius - 2) * 2)
            .attr('height', (radius - 2) * 2)
            .attr('clip-path', `url(#${clipId})`)
            .attr('href', imageUrl)
            .attr('xlink:href', imageUrl) // 兼容旧版SVG
            .attr('class', 'person-image')
            .on('error', function() {
              // 图片加载失败时，使用默认图片
              const defaultUrl = typeof unknownImg === 'string' ? unknownImg : (unknownImg?.default || unknownImg)
              d3.select(this)
                .attr('href', defaultUrl)
                .attr('xlink:href', defaultUrl)
            })
        }
        
        // 添加节点文本
        nodeGroup.append('text')
          .attr('class', 'node-label')
          .attr('text-anchor', 'middle')
          .attr('dy', d.type === 'event' ? 50 : 40)
          .attr('font-size', d.isCenter ? '14px' : '12px')
          .attr('font-weight', d.isCenter ? 'bold' : 'normal')
          .attr('fill', d.isCenter ? '#fff' : '#e5e7eb')
          .text(d.name)
      })
      
      // 更新函数
      simulation.on('tick', () => {
        link
          .attr('x1', d => {
            const sourceNode = typeof d.source === 'object' ? d.source : allNodes.find(n => n.id === d.source)
            return sourceNode ? sourceNode.x : 0
          })
          .attr('y1', d => {
            const sourceNode = typeof d.source === 'object' ? d.source : allNodes.find(n => n.id === d.source)
            return sourceNode ? sourceNode.y : 0
          })
          .attr('x2', d => {
            const targetNode = typeof d.target === 'object' ? d.target : allNodes.find(n => n.id === d.target)
            return targetNode ? targetNode.x : 0
          })
          .attr('y2', d => {
            const targetNode = typeof d.target === 'object' ? d.target : allNodes.find(n => n.id === d.target)
            return targetNode ? targetNode.y : 0
          })
        
        linkLabelBg
          .attr('x', d => {
            const sourceNode = typeof d.source === 'object' ? d.source : allNodes.find(n => n.id === d.source)
            const targetNode = typeof d.target === 'object' ? d.target : allNodes.find(n => n.id === d.target)
            if (sourceNode && targetNode) {
              return (sourceNode.x + targetNode.x) / 2 - (d.label.length * 8 + 8) / 2
            }
            return 0
          })
          .attr('y', d => {
            const sourceNode = typeof d.source === 'object' ? d.source : allNodes.find(n => n.id === d.source)
            const targetNode = typeof d.target === 'object' ? d.target : allNodes.find(n => n.id === d.target)
            if (sourceNode && targetNode) {
              return (sourceNode.y + targetNode.y) / 2 - 9
            }
            return 0
          })
        
        linkLabels
          .attr('x', d => {
            const sourceNode = typeof d.source === 'object' ? d.source : allNodes.find(n => n.id === d.source)
            const targetNode = typeof d.target === 'object' ? d.target : allNodes.find(n => n.id === d.target)
            if (sourceNode && targetNode) {
              return (sourceNode.x + targetNode.x) / 2
            }
            return 0
          })
          .attr('y', d => {
            const sourceNode = typeof d.source === 'object' ? d.source : allNodes.find(n => n.id === d.source)
            const targetNode = typeof d.target === 'object' ? d.target : allNodes.find(n => n.id === d.target)
            if (sourceNode && targetNode) {
              return (sourceNode.y + targetNode.y) / 2
            }
            return 0
          })
        
        node.attr('transform', d => `translate(${d.x || width / 2},${d.y || height / 2})`)
      })
      
      // 点击空白处取消选择
      svg.on('click', () => {
        this.selectedNode = null
      })
    },
    
    drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }
      
      function dragged(event) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    },
    
    zoomIn() {
      if (this.zoom) {
        this.svg.transition().call(this.zoom.scaleBy, 1.5)
      }
    },
    
    zoomOut() {
      if (this.zoom) {
        this.svg.transition().call(this.zoom.scaleBy, 0.75)
      }
    },
    
    resetZoom() {
      if (this.zoom && this.svg) {
        this.svg.transition().call(this.zoom.transform, d3.zoomIdentity)
      }
    },
    
    toggleFullscreen() {
      const container = this.$refs.graphContainer
      if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
          this.isFullscreen = true
          this.resizeGraph()
        })
      } else {
        document.exitFullscreen().then(() => {
          this.isFullscreen = false
          this.resizeGraph()
        })
      }
    },
    
  resizeGraph() {
    this.$nextTick(() => {
      if (this.hasData) {
        this.initGraph()
      }
    })
  },
    
    closeNodeInfo() {
      this.selectedNode = null
    },
    
    
    getNodeTypeLabel(type) {
      const labels = {
        person: '人物',
        event: '事件',
        location: '地点'
      }
      return labels[type] || type
    },
    
    // 获取人物图片URL（返回字符串URL）
    getPersonImageUrl(personId) {
      if (!personId) {
        return typeof unknownImg === 'string' ? unknownImg : (unknownImg?.default || unknownImg)
      }
      
      // 许强本人，正常加载
      if (personId === 'xuqiang') {
        const xuqiangImg = personImageMap['xuqiang'] || unknownImg
        return typeof xuqiangImg === 'string' ? xuqiangImg : (xuqiangImg?.default || xuqiangImg)
      }
      
      // 其他人物：检查是否有对应图片
      const imageUrl = personImageMap[personId]
      if (imageUrl) {
        // 检查图片URL是否指向xuqiang的图片（通过比较URL路径）
        const imageUrlStr = imageUrl.toString()
        // 如果图片路径包含xuqiang，说明使用了xuqiang的照片，返回unknown
        if (imageUrlStr.includes('xuqiang')) {
          return typeof unknownImg === 'string' ? unknownImg : (unknownImg?.default || unknownImg)
        }
        // 返回字符串URL
        return typeof imageUrl === 'string' ? imageUrl : (imageUrl?.default || imageUrl)
      }
      
      // 如果找不到对应图片，返回默认图片
      return typeof unknownImg === 'string' ? unknownImg : (unknownImg?.default || unknownImg)
    }
  },
  
  watch: {
    personId() {
      this.$nextTick(() => {
        if (this.hasData) {
          this.initGraph()
        }
      })
    }
  }
}
</script>

<style scoped>
.relationship-graph-container {
  width: 100%;
  max-width: 100%;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  margin: 0 auto;
  box-sizing: border-box;
  display: block;
  clear: both;
}

/* 图谱内部的控制按钮 */
.graph-controls-inner {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
}

.control-btn {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.control-btn:hover {
  background: rgba(102, 126, 234, 0.9);
  color: #fff;
  border-color: rgba(102, 126, 234, 0.9);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.graph-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  border: none;
  border-radius: 0;
  overflow: hidden;
  background: #1f2937;
  margin: 0 auto;
  display: block;
}

.graph-svg {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.graph-svg:active {
  cursor: grabbing;
}

.node-info-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  min-width: 200px;
  z-index: 10;
}

.close-info-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-info-btn:hover {
  background: #f3f4f6;
  color: #333;
}

.node-info-panel h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #2c3e50;
}

.node-type {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.no-data-message p {
  font-size: 16px;
  margin: 0;
  color: #999;
}

/* SVG 样式 */
:deep(.link) {
  stroke: #999;
  stroke-opacity: 0.6;
  stroke-width: 2;
}

:deep(.link-label) {
  font-size: 12px;
  fill: #666;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: 3px;
}

:deep(.node) {
  cursor: pointer;
}

:deep(.node:hover .node-shape) {
  stroke-width: 4;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4));
}

:deep(.node.center .node-shape) {
  filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.6));
}

:deep(.node-label) {
  pointer-events: none;
  user-select: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .relationship-graph-container {
    padding: 15px;
  }
  
  .graph-wrapper {
    height: 500px;
  }
  
  .graph-title {
    font-size: 20px;
  }
  
  .control-btn {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
  text-align: center;
}

.no-data-message i {
  font-size: 48px;
  margin-bottom: 15px;
  color: #ccc;
}

.no-data-message p {
  font-size: 16px;
  margin: 0;
  color: #999;
}
</style>

