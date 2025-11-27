<template>
  <div class="achievement-peak-trail">
    <!-- 3D渲染容器 -->
    <div ref="container" class="canvas-container"></div>
    
    <!-- 顶部信息栏 -->
    <div class="info-overlay">
      <h1 class="peak-title">攀登者 · 精神丰碑</h1>
      <p class="peak-subtitle">{{ personName }} 的成就轨迹</p>
      <div class="stats">
        <span class="stat-item">
          <i class="fas fa-mountain"></i>
          成就节点: {{ achievements.length }}
        </span>
        <span class="stat-item">
          <i class="fas fa-route"></i>
          攀登高度: {{ climbHeight }}m
        </span>
      </div>
    </div>

    <!-- 成就详情卡片 -->
    <transition name="card-fade">
      <div v-if="selectedAchievement" class="achievement-card" :style="cardPosition">
        <button class="card-close" @click="closeCard">
          <i class="fas fa-times"></i>
        </button>
        <div class="card-header" :class="`type-${selectedAchievement.typeClass}`">
          <i :class="selectedAchievement.icon"></i>
          <span class="card-type">{{ selectedAchievement.awardType }}</span>
        </div>
        <h3 class="card-title">{{ selectedAchievement.awardName }}</h3>
        <p class="card-desc" v-if="selectedAchievement.awardDescription">
          {{ selectedAchievement.awardDescription }}
        </p>
        <div class="card-meta">
          <span v-if="selectedAchievement.awardYear">
            <i class="fas fa-calendar"></i> {{ selectedAchievement.awardYear }}年
          </span>
          <span v-if="selectedAchievement.awardingOrganization">
            <i class="fas fa-building"></i> {{ selectedAchievement.awardingOrganization }}
          </span>
        </div>
      </div>
    </transition>

    <!-- 控制提示 -->
    <div class="controls-hint">
      <p><i class="fas fa-mouse"></i> 拖动旋转视角</p>
      <p><i class="fas fa-search"></i> 滚轮缩放</p>
      <p><i class="fas fa-hand-pointer"></i> 点击节点查看详情</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>正在构建攀登轨迹...</p>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { markRaw } from 'vue'

export default {
  name: 'AchievementPeakTrail',
  props: {
    personName: {
      type: String,
      default: '校友'
    },
    achievements: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: true,
      // 使用null初始化，稍后用markRaw包装
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      pathCurve: null,
      markers: [],
      mountainWire: null,
      pathMesh: null,
      starMesh: null,
      raycaster: null,
      mouse: null,
      selectedAchievement: null,
      cardPosition: {},
      climbHeight: 0
    }
  },
  mounted() {
    this.initScene()
    this.createMountain()
    this.createClimbPath()
    this.createAchievementMarkers()
    this.createEnvironment()
    this.setupInteraction()
    this.animate()
    this.loading = false
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    initScene() {
      // 场景初始化 - 使用markRaw避免Vue响应式包装
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x020205)
      scene.fog = new THREE.FogExp2(0x020205, 0.002)
      this.scene = markRaw(scene)

      // 相机
      const camera = new THREE.PerspectiveCamera(
        45,
        this.$refs.container.clientWidth / this.$refs.container.clientHeight,
        1,
        2000
      )
      camera.position.set(100, 80, 200)
      this.camera = markRaw(camera)

      // 渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(this.$refs.container.clientWidth, this.$refs.container.clientHeight)
      renderer.shadowMap.enabled = true
      this.$refs.container.appendChild(renderer.domElement)
      this.renderer = markRaw(renderer)

      // 控制器
      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.maxPolarAngle = Math.PI / 2 - 0.1
      this.controls = markRaw(controls)

      // 灯光
      const ambientLight = new THREE.AmbientLight(0x404040, 2)
      this.scene.add(ambientLight)

      const dirLight = new THREE.DirectionalLight(0xffffff, 3)
      dirLight.position.set(-100, 100, 50)
      dirLight.castShadow = true
      this.scene.add(dirLight)

      const spotLight = new THREE.SpotLight(0x0088ff, 10)
      spotLight.position.set(0, 50, 0)
      this.scene.add(spotLight)

      // 窗口resize监听
      window.addEventListener('resize', this.onWindowResize)
    },

    createMountain() {
      // 生成山峰高度图
      const mountainTexture = this.generateMountainTexture()

      // 山体几何
      const planeSize = 200
      const geometry = new THREE.PlaneGeometry(planeSize, planeSize, 256, 256)

      // 实体材质
      const terrainMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a2b3c,
        roughness: 0.8,
        metalness: 0.2,
        displacementMap: mountainTexture,
        displacementScale: 60,
        flatShading: true
      })

      const mountain = new THREE.Mesh(geometry, terrainMaterial)
      mountain.rotation.x = -Math.PI / 2
      mountain.castShadow = true
      mountain.receiveShadow = true
      this.scene.add(mountain)

      // 全息线框覆盖层
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x4facfe,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        displacementMap: mountainTexture,
        displacementScale: 60
      })

      const mountainWire = new THREE.Mesh(geometry, wireframeMaterial)
      mountainWire.rotation.x = -Math.PI / 2
      mountainWire.position.y = 0.2
      this.scene.add(mountainWire)
      this.mountainWire = markRaw(mountainWire)
    },

    generateMountainTexture() {
      const size = 512
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext('2d')
      context.fillStyle = '#000000'
      context.fillRect(0, 0, size, size)

      const imgData = context.getImageData(0, 0, size, size)
      const data = imgData.data

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const x = (i / size - 0.5) * 2
          const y = (j / size - 0.5) * 2
          const dist = Math.sqrt(x * x + y * y)

          // 简化的噪声
          let noise = Math.sin(x * 5) * Math.cos(y * 5) * 0.3
          let height = (1 - dist) + noise * 0.3
          height = Math.pow(Math.max(0, height), 2.5)

          const colorVal = Math.floor(height * 255)
          const index = (i + j * size) * 4
          data[index] = colorVal
          data[index + 1] = colorVal
          data[index + 2] = colorVal
          data[index + 3] = 255
        }
      }
      context.putImageData(imgData, 0, 0)
      return new THREE.CanvasTexture(canvas)
    },

    createClimbPath() {
      const pathPoints = []
      const numPoints = 100
      
      // 螺旋上升路径
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints
        const angle = t * Math.PI * 4 // 绕2圈
        const radius = 60 * (1 - t) + 5
        const height = t * 50 + 5
        
        pathPoints.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ))
      }

      const pathCurve = new THREE.CatmullRomCurve3(pathPoints)
      this.pathCurve = markRaw(pathCurve)
      this.climbHeight = Math.floor(pathPoints[pathPoints.length - 1].y)

      // 金色轨迹管道
      const tubeGeometry = new THREE.TubeGeometry(this.pathCurve, 100, 0.4, 8, false)
      const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 })
      const pathMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)
      this.scene.add(pathMesh)
      this.pathMesh = markRaw(pathMesh)
    },

    createAchievementMarkers() {
      if (!this.achievements || this.achievements.length === 0) return

      const achievementCount = this.achievements.length
      const sphereGeo = new THREE.SphereGeometry(1.5, 32, 32)

      this.achievements.forEach((achievement, index) => {
        const t = (index + 1) / (achievementCount + 1) // 均匀分布在路径上
        const point = this.pathCurve.getPoint(t)

        // 根据成就类型选择颜色
        const color = this.getAchievementColor(achievement.awardType)
        const glowMat = new THREE.MeshBasicMaterial({ color })

        const marker = new THREE.Mesh(sphereGeo, glowMat)
        marker.position.copy(point)
        marker.userData = { achievement, index }
        this.scene.add(marker)
        this.markers.push(markRaw(marker))

        // 点光源
        const light = new THREE.PointLight(color, 1, 20)
        light.position.copy(point)
        this.scene.add(light)

        // 为成就添加图标和类型类
        achievement.icon = this.getAchievementIcon(achievement.awardType)
        achievement.typeClass = this.getTypeClass(achievement.awardType)
      })
    },

    getAchievementColor(type) {
      const colorMap = {
        '院士': 0xFF6B6B,
        '国家级奖项': 0xFFA726,
        '省部级奖项': 0xFFEB3B,
        '人才计划': 0x66BB6A,
        '学术职务': 0x26C6DA,
        '教学荣誉': 0x42A5F5,
        '其他荣誉': 0xAB47BC
      }
      return colorMap[type] || 0xFFFFFF
    },

    getAchievementIcon(type) {
      const iconMap = {
        '院士': 'fas fa-crown',
        '国家级奖项': 'fas fa-trophy',
        '省部级奖项': 'fas fa-medal',
        '学术职务': 'fas fa-users',
        '教学荣誉': 'fas fa-chalkboard-teacher',
        '人才计划': 'fas fa-user-graduate',
        '其他荣誉': 'fas fa-star'
      }
      return iconMap[type] || 'fas fa-award'
    },

    getTypeClass(type) {
      const classMap = {
        '院士': 'S',
        '国家级奖项': 'A',
        '省部级奖项': 'B',
        '人才计划': 'C',
        '学术职务': 'D',
        '教学荣誉': 'E',
        '其他荣誉': 'F'
      }
      return classMap[type] || 'F'
    },

    createEnvironment() {
      // 星空背景
      const starsGeo = new THREE.BufferGeometry()
      const starsCount = 2000
      const posArray = new Float32Array(starsCount * 3)

      for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 800
      }
      starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      const starsMat = new THREE.PointsMaterial({ size: 0.5, color: 0xffffff })
      const starMesh = new THREE.Points(starsGeo, starsMat)
      this.starMesh = markRaw(starMesh)
      this.scene.add(this.starMesh)
    },

    setupInteraction() {
      // 鼠标点击检测
      this.raycaster = markRaw(new THREE.Raycaster())
      this.mouse = markRaw(new THREE.Vector2())

      this.renderer.domElement.addEventListener('click', this.onMarkerClick)
    },

    onMarkerClick(event) {
      const rect = this.renderer.domElement.getBoundingClientRect()
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersects = this.raycaster.intersectObjects(this.markers)

      if (intersects.length > 0) {
        const marker = intersects[0].object
        this.selectedAchievement = marker.userData.achievement
        
        // 计算卡片位置
        const vector = marker.position.clone()
        vector.project(this.camera)
        
        this.cardPosition = {
          left: (vector.x * 0.5 + 0.5) * this.$refs.container.clientWidth + 'px',
          top: (-vector.y * 0.5 + 0.5) * this.$refs.container.clientHeight + 'px'
        }
      }
    },

    closeCard() {
      this.selectedAchievement = null
    },

    animate() {
      requestAnimationFrame(this.animate)
      
      if (this.controls) this.controls.update()
      
      // 星星旋转
      if (this.starMesh) {
        this.starMesh.rotation.y += 0.0002
      }
      
      // 线框呼吸效果
      if (this.mountainWire) {
        this.mountainWire.material.opacity = 0.15 + Math.sin(Date.now() * 0.001) * 0.05
      }
      
      // 标记点脉冲效果
      this.markers.forEach((marker, index) => {
        const scale = 1 + Math.sin(Date.now() * 0.002 + index) * 0.2
        marker.scale.set(scale, scale, scale)
      })

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
      }
    },

    onWindowResize() {
      if (!this.$refs.container) return
      
      this.camera.aspect = this.$refs.container.clientWidth / this.$refs.container.clientHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.$refs.container.clientWidth, this.$refs.container.clientHeight)
    },

    cleanup() {
      window.removeEventListener('resize', this.onWindowResize)
      if (this.renderer) {
        this.renderer.domElement.removeEventListener('click', this.onMarkerClick)
        this.$refs.container?.removeChild(this.renderer.domElement)
        this.renderer.dispose()
      }
      if (this.scene) {
        this.scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose()
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(m => m.dispose())
            } else {
              object.material.dispose()
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.achievement-peak-trail {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #020205;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

/* 顶部信息栏 */
.info-overlay {
  position: absolute;
  top: 30px;
  left: 30px;
  color: white;
  pointer-events: none;
  z-index: 10;
}

.peak-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(79, 172, 254, 0.3);
}

.peak-subtitle {
  font-size: 16px;
  color: #aaa;
  margin: 8px 0 0 0;
  font-weight: 300;
}

.stats {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.stat-item {
  font-size: 14px;
  color: #4facfe;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item i {
  font-size: 16px;
}

/* 成就详情卡片 */
.achievement-card {
  position: absolute;
  transform: translate(-50%, -120%);
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 100;
  pointer-events: all;
}

.card-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.card-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.card-header.type-S {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
  color: white;
}

.card-header.type-A {
  background: linear-gradient(135deg, #FFA726 0%, #FF9800 100%);
  color: white;
}

.card-header.type-B {
  background: linear-gradient(135deg, #FFEB3B 0%, #FDD835 100%);
  color: #333;
}

.card-header.type-C {
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
  color: white;
}

.card-header.type-D {
  background: linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%);
  color: white;
}

.card-header.type-E {
  background: linear-gradient(135deg, #42A5F5 0%, #2196F3 100%);
  color: white;
}

.card-header.type-F {
  background: linear-gradient(135deg, #AB47BC 0%, #9C27B0 100%);
  color: white;
}

.card-header i {
  font-size: 24px;
}

.card-type {
  font-size: 14px;
  font-weight: 600;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px 0;
}

.card-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #999;
}

.card-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.3s ease;
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%) scale(0.9);
}

/* 控制提示 */
.controls-hint {
  position: absolute;
  bottom: 30px;
  right: 30px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  text-align: right;
  pointer-events: none;
  z-index: 10;
}

.controls-hint p {
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.controls-hint i {
  font-size: 14px;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(2, 2, 5, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(79, 172, 254, 0.2);
  border-top-color: #4facfe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  margin-top: 20px;
  color: #4facfe;
  font-size: 14px;
}

/* 响应式 */
@media (max-width: 768px) {
  .info-overlay {
    top: 20px;
    left: 20px;
  }

  .peak-title {
    font-size: 20px;
  }

  .peak-subtitle {
    font-size: 14px;
  }

  .stats {
    flex-direction: column;
    gap: 10px;
  }

  .achievement-card {
    width: calc(100% - 40px);
    left: 20px !important;
    transform: translateY(-120%);
  }

  .controls-hint {
    display: none;
  }
}
</style>
