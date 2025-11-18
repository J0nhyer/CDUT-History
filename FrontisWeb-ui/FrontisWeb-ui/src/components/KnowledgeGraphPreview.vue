<template>
  <section class="kg-preview-section">
    <div class="kg-preview-container">
      <div class="section-header">
        <h2 class="section-title">知识图谱</h2>
        <p class="section-subtitle">探索人物、院系与事件的关联网络</p>
        <button class="view-full-btn" @click="goToFullGraph">查看完整图谱 →</button>
      </div>
      
      <div class="kg-canvas-wrapper" ref="canvasWrapper">
        <svg class="kg-canvas" :width="canvasWidth" :height="canvasHeight" ref="svgRef">
          <!-- 连线 -->
          <g class="links">
            <line
              v-for="(link, index) in displayLinks"
              :key="index"
              :x1="link.source.x"
              :y1="link.source.y"
              :x2="link.target.x"
              :y2="link.target.y"
              class="link-line"
              :style="{ strokeWidth: link.strength * 2 }"
            />
          </g>
          
          <!-- 节点 -->
          <g class="nodes">
            <g
              v-for="(node, index) in displayNodes"
              :key="node.id"
              class="node-group"
              :transform="`translate(${node.x},${node.y})`"
              @click="selectNode(node)"
              @mouseenter="highlightNode(node)"
              @mouseleave="unhighlightNode()"
            >
              <circle
                class="node-circle"
                :r="node.size"
                :class="{ highlighted: node.highlighted, selected: node.selected }"
                :style="{ fill: node.color }"
              />
              <text
                class="node-label"
                :y="node.size + 20"
                text-anchor="middle"
              >
                {{ node.name }}
              </text>
            </g>
          </g>
        </svg>
        
        <!-- 节点详情卡片 -->
        <transition name="fade">
          <div v-if="selectedNode" class="node-detail-card">
            <button class="close-card-btn" @click="closeCard">
              <i class="fas fa-times"></i>
            </button>
            <h3 class="card-title">{{ selectedNode.name }}</h3>
            <p class="card-type">{{ selectedNode.type }}</p>
            <div class="card-relations" v-if="selectedNode.relations">
              <div class="relation-item" v-for="rel in selectedNode.relations.slice(0, 3)" :key="rel.target">
                <span class="relation-target">{{ rel.target }}</span>
                <span class="relation-type">{{ rel.type }}</span>
              </div>
            </div>
            <button class="view-detail-btn" @click="viewNodeDetail">查看详情</button>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'KnowledgeGraphPreview',
  data() {
    return {
      canvasWidth: 800,
      canvasHeight: 500,
      selectedNode: null,
      highlightedNodeId: null,
      animationFrameId: null, // 存储动画帧ID用于清理
      displayNodes: [
        {
          id: 'cdut',
          name: '成都理工大学',
          type: '大学',
          x: 400,
          y: 250,
          size: 25,
          color: '#ffaa00',
          relations: [
            { target: '刘宝珺', type: '任职', strength: 1.0 },
            { target: '张倬元', type: '任职', strength: 1.0 }
          ]
        },
        {
          id: 'liubaojun',
          name: '刘宝珺',
          type: '人物',
          x: 250,
          y: 150,
          size: 20,
          color: '#667eea',
          relations: [
            { target: '成都理工大学', type: '任职', strength: 1.0 },
            { target: '沉积地质学', type: '研究领域', strength: 0.9 }
          ]
        },
        {
          id: 'zhangzhuoyuan',
          name: '张倬元',
          type: '人物',
          x: 550,
          y: 150,
          size: 20,
          color: '#667eea',
          relations: [
            { target: '成都理工大学', type: '任职', strength: 1.0 },
            { target: '工程地质学', type: '研究领域', strength: 0.9 }
          ]
        },
        {
          id: 'huangrunqiu',
          name: '黄润秋',
          type: '人物',
          x: 200,
          y: 350,
          size: 18,
          color: '#667eea',
          relations: [
            { target: '成都理工大学', type: '任职', strength: 0.8 },
            { target: '地质灾害', type: '研究领域', strength: 0.9 }
          ]
        },
        {
          id: 'sedimentology',
          name: '沉积地质学',
          type: '学科',
          x: 150,
          y: 80,
          size: 15,
          color: '#2ecc71',
          relations: [
            { target: '刘宝珺', type: '研究领域', strength: 0.9 }
          ]
        },
        {
          id: 'engineering',
          name: '工程地质学',
          type: '学科',
          x: 650,
          y: 80,
          size: 15,
          color: '#2ecc71',
          relations: [
            { target: '张倬元', type: '研究领域', strength: 0.9 }
          ]
        },
        {
          id: 'disaster',
          name: '地质灾害',
          type: '学科',
          x: 100,
          y: 400,
          size: 15,
          color: '#2ecc71',
          relations: [
            { target: '黄润秋', type: '研究领域', strength: 0.9 }
          ]
        }
      ],
      displayLinks: []
    }
  },
  mounted() {
    this.updateCanvasSize()
    this.generateLinks()
    this.animateNodes()
    window.addEventListener('resize', this.updateCanvasSize)
  },
  beforeUnmount() {
    // 清理动画帧
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    // 移除事件监听
    window.removeEventListener('resize', this.updateCanvasSize)
  },
  methods: {
    updateCanvasSize() {
      if (this.$refs.canvasWrapper) {
        this.canvasWidth = Math.min(800, this.$refs.canvasWrapper.offsetWidth)
        this.canvasHeight = 500
      }
    },
    generateLinks() {
      const links = []
      const nodeMap = {}
      this.displayNodes.forEach(node => {
        nodeMap[node.id] = node
      })
      
      this.displayNodes.forEach(node => {
        if (node.relations) {
          node.relations.forEach(rel => {
            const targetNode = Object.values(nodeMap).find(n => n.name === rel.target || n.id === rel.target)
            if (targetNode) {
              links.push({
                source: node,
                target: targetNode,
                strength: rel.strength || 0.5
              })
            }
          })
        }
      })
      
      this.displayLinks = links
    },
    animateNodes() {
      // 清理之前的动画帧
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }
      
      // 简单的力导向布局动画
      const animate = () => {
        this.displayNodes.forEach(node => {
          if (!node.fixed) {
            // 轻微随机移动，模拟力导向效果
            node.x += (Math.random() - 0.5) * 0.5
            node.y += (Math.random() - 0.5) * 0.5
            
            // 边界限制
            node.x = Math.max(node.size, Math.min(this.canvasWidth - node.size, node.x))
            node.y = Math.max(node.size + 20, Math.min(this.canvasHeight - node.size, node.y))
          }
        })
        this.animationFrameId = requestAnimationFrame(animate)
      }
      animate()
    },
    selectNode(node) {
      this.selectedNode = { ...node }
      this.displayNodes.forEach(n => {
        n.selected = n.id === node.id
      })
      this.generateLinks()
    },
    highlightNode(node) {
      this.highlightedNodeId = node.id
      this.displayNodes.forEach(n => {
        n.highlighted = n.id === node.id || 
          (n.relations && n.relations.some(r => r.target === node.name || r.target === node.id))
      })
      this.generateLinks()
    },
    unhighlightNode() {
      this.highlightedNodeId = null
      this.displayNodes.forEach(n => {
        n.highlighted = false
      })
      this.generateLinks()
    },
    closeCard() {
      this.selectedNode = null
      this.displayNodes.forEach(n => {
        n.selected = false
      })
    },
    viewNodeDetail() {
      if (this.selectedNode && this.selectedNode.type === '人物') {
        this.$router.push(`/person/${this.selectedNode.id}`).catch(err => {
          // 忽略导航重复的错误
          if (err.name !== 'NavigationDuplicated') {
            console.error('路由跳转失败:', err)
          }
        })
      } else {
        this.goToFullGraph()
      }
    },
    goToFullGraph() {
      this.$emit('navigate', 'graph')
      this.$nextTick(() => {
        this.$router.push('/history-graph').catch(err => {
          // 忽略导航重复的错误
          if (err.name !== 'NavigationDuplicated') {
            console.error('路由跳转失败:', err)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.kg-preview-section {
  padding: 80px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 1;
}

.kg-preview-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.section-title {
  font-size: 2.5rem;
  color: white;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.view-full-btn {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-full-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.kg-canvas-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.kg-canvas {
  width: 100%;
  height: 100%;
}

.link-line {
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 1.5;
  pointer-events: none;
}

.node-group {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.node-group:hover {
  transform: scale(1.1);
}

.node-circle {
  stroke: white;
  stroke-width: 2;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

.node-circle.highlighted {
  stroke: #ffd700;
  stroke-width: 3;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
}

.node-circle.selected {
  stroke: #ff6b6b;
  stroke-width: 4;
  filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.8));
}

.node-label {
  fill: white;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.node-detail-card {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.close-card-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #2c3e50;
  transition: all 0.2s ease;
}

.close-card-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.card-type {
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.card-relations {
  margin-bottom: 20px;
}

.relation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.relation-target {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.relation-type {
  font-size: 12px;
  color: #7f8c8d;
  padding: 2px 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
}

.view-detail-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.view-detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .kg-preview-section {
    padding: 40px 20px;
  }
  
  .kg-canvas-wrapper {
    height: 400px;
  }
  
  .node-detail-card {
    width: calc(100% - 40px);
    left: 20px;
  }
}
</style>

