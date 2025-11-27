<template>
  <div class="everest-achievement">
    <!-- 3D场景容器 -->
    <div ref="containerRef" class="scene-container"></div>
    
    <!-- 成就信息面板 -->
    <div class="achievement-info" v-if="hoveredAchievement">
      <h3>{{ hoveredAchievement.award_name || hoveredAchievement.awardName }}</h3>
      <p class="year" v-if="hoveredAchievement.award_year || hoveredAchievement.awardYear">
        {{ hoveredAchievement.award_year || hoveredAchievement.awardYear }}年
      </p>
      <p class="type" v-if="hoveredAchievement.award_type || hoveredAchievement.awardType">
        <span class="label">类型:</span> {{ hoveredAchievement.award_type || hoveredAchievement.awardType }}
      </p>
      <p class="level" v-if="hoveredAchievement.award_level || hoveredAchievement.awardLevel">
        <span class="label">级别:</span> {{ hoveredAchievement.award_level || hoveredAchievement.awardLevel }}
      </p>
      <p class="description" v-if="hoveredAchievement.award_description || hoveredAchievement.awardDescription">
        {{ hoveredAchievement.award_description || hoveredAchievement.awardDescription }}
      </p>
    </div>
    
    <!-- 控制面板 -->
    <div class="controls">
      <button @click="resetCamera" class="control-btn">
        <i class="fas fa-sync-alt"></i> 重置视角
      </button>
      <button @click="toggleAutoRotate" class="control-btn">
        <i class="fas" :class="autoRotate ? 'fa-pause' : 'fa-play'"></i>
        {{ autoRotate ? '暂停' : '旋转' }}
      </button>
    </div>
    
    <!-- 加载提示 -->
    <div class="loading" v-if="loading">
      <div class="loading-spinner"></div>
      <p>正在加载珠峰模型...</p>
    </div>
    
    <!-- 调试信息 (开发时可启用) -->
    <!-- <div class="debug-info" v-if="!loading && everestModel">
      <p>模型已加载</p>
      <p>尺寸: {{ modelSize.x.toFixed(2) }} × {{ modelSize.y.toFixed(2) }} × {{ modelSize.z.toFixed(2) }}</p>
      <p>缩放: {{ modelScale.toFixed(3) }}</p>
      <p>成就数: {{ achievements.length }}</p>
    </div> -->
  </div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { markRaw } from 'vue'

export default {
  name: 'EverestAchievement',
  props: {
    // 人物的成就数据
    achievements: {
      type: Array,
      default: () => []
    },
    // 人物ID,用于生成唯一的路径
    personId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: true,
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      everestModel: null,
      achievementPath: null,
      achievementMarkers: [],
      hoveredAchievement: null,
      autoRotate: false, // 默认不自动旋转
      animationId: null,
      raycaster: null,
      mouse: null, // 将在mounted中初始化
      hoveredMarker: null,
      initialCameraPosition: { x: 5, y: 10, z: 8 }, // 提高初始视角高度
      modelSize: { x: 5, y: 5, z: 5 }, // 模型的实际大小
      modelScale: 1 // 模型的缩放比例
    }
  },
  mounted() {
    this.initScene()
    this.loadEverestModel()
    this.animate()
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.onWindowResize)
    
    // 监听鼠标移动
    window.addEventListener('mousemove', this.onMouseMove)
  },
  beforeUnmount() {
    // 清理资源
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('mousemove', this.onMouseMove)
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    if (this.renderer) {
      this.renderer.dispose()
    }
    if (this.controls) {
      this.controls.dispose()
    }
  },
  methods: {
    // 初始化3D场景
    initScene() {
      const container = this.$refs.containerRef
      if (!container) return
      
      const width = container.clientWidth
      const height = container.clientHeight
      
      // 创建场景 - 使用markRaw防止Vue响应式包装
      this.scene = markRaw(new THREE.Scene())
      this.scene.background = new THREE.Color(0x87CEEB) // 天空蓝
      
      // 添加雾效（调整距离以适应更大的模型）
      this.scene.fog = new THREE.Fog(0x87CEEB, 50, 600)
      
      // 创建相机（增大far值以适应更大的模型）
      this.camera = markRaw(new THREE.PerspectiveCamera(60, width / height, 0.1, 2000))
      this.camera.position.set(5, 10, 8) // 提高视角高度 y: 3 -> 10
      this.camera.lookAt(0, 0, 0)
      
      // 创建渲染器
      this.renderer = markRaw(new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
      }))
      this.renderer.setSize(width, height)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      // 暂时禁用阴影以避免Vue响应式冲突
      this.renderer.shadowMap.enabled = false
      // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      container.appendChild(this.renderer.domElement)
      
      // 添加控制器
      this.controls = markRaw(new OrbitControls(this.camera, this.renderer.domElement))
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      this.controls.autoRotate = false // 关闭自动旋转
      this.controls.autoRotateSpeed = 1.0
      this.controls.minDistance = 1
      this.controls.maxDistance = 500 // 增大最大距离以适应更大的模型
      this.controls.maxPolarAngle = Math.PI * 0.85 // 允许更大的俯视角度
      
      // 添加光源
      this.addLights()
      
      // 初始化射线投射器和鼠标向量
      this.raycaster = markRaw(new THREE.Raycaster())
      this.mouse = markRaw(new THREE.Vector2())
      
      // 添加辅助网格(调试用)
      // const gridHelper = new THREE.GridHelper(10, 10)
      // this.scene.add(gridHelper)
      
      // 添加坐标轴辅助(调试用)
      // const axesHelper = new THREE.AxesHelper(5)
      // this.scene.add(axesHelper)
    },
    
    // 添加光源
    addLights() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      this.scene.add(ambientLight)
      
      // 主光源 (模拟太阳) - 调整位置以适应更大的模型
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(200, 300, 100)
      directionalLight.castShadow = true
      directionalLight.shadow.camera.left = -200
      directionalLight.shadow.camera.right = 200
      directionalLight.shadow.camera.top = 200
      directionalLight.shadow.camera.bottom = -200
      this.scene.add(directionalLight)
      
      // 补光
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
      fillLight.position.set(-100, 100, -100)
      this.scene.add(fillLight)
    },
    
    // 加载珠峰模型
    loadEverestModel() {
      const loader = new GLTFLoader()
      // 使用相对于public目录的路径,或使用绝对路径
      const modelPath = new URL('../assets/3D/3d66.com_22937130.glb', import.meta.url).href
      
      loader.load(
        modelPath,
        (gltf) => {
          this.everestModel = markRaw(gltf.scene)
          
          // 计算模型的包围盒
          const box = new THREE.Box3().setFromObject(this.everestModel)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          
          // 将模型移到场景中心
          this.everestModel.position.x = -center.x
          this.everestModel.position.y = -center.y
          this.everestModel.position.z = -center.z
          
          // 根据模型大小调整缩放比例
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = (5 * 20) / maxDim // 目标大小为100个单位（放大20倍）
          this.everestModel.scale.setScalar(scale)
          
          // 保存模型大小和缩放信息
          this.modelSize = {
            x: size.x * scale,
            y: size.y * scale,
            z: size.z * scale
          }
          this.modelScale = scale
          
          // 遍历模型优化材质
          this.everestModel.traverse((child) => {
            if (child.isMesh) {
              // 暂时禁用阴影
              // child.castShadow = true
              // child.receiveShadow = true
            }
          })
          
          this.scene.add(this.everestModel)
          
          // 保持固定的相机位置（不随模型大小变化）
          this.camera.position.set(5, 10, 8) // 提高视角高度
          this.camera.lookAt(0, 0, 0)
          this.controls.target.set(0, 0, 0)
          this.controls.update()
          
          // 保存初始相机位置用于重置
          this.initialCameraPosition = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
          }
          
          // 加载完成后创建成就路径
          this.createAchievementPath()
          
          this.loading = false
          
          console.log('模型已加载 - 尺寸:', size, '缩放:', scale)
        },
        (progress) => {
          console.log('加载进度:', (progress.loaded / progress.total * 100) + '%')
        },
        (error) => {
          console.error('模型加载失败:', error)
          this.loading = false
        }
      )
    },
    
    // 创建成就路径
    createAchievementPath() {
      if (!this.achievements || this.achievements.length === 0) return
      
      // 根据personId生成唯一的路径偏移
      const pathOffset = this.getPathOffset(this.personId)
      
      // 创建路径点 - 从山脚到山顶
      const pathPoints = this.generatePathPoints(pathOffset)
      
      // 创建路径线 - 已隐藏
      // const curve = new THREE.CatmullRomCurve3(pathPoints)
      // const tubeGeometry = new THREE.TubeGeometry(
      //   curve,
      //   pathPoints.length * 2, // 细分段数
      //   this.modelScale * 0.02, // 管道半径
      //   8, // 径向分段数
      //   false // 是否闭合
      // )
      // const tubeMaterial = new THREE.MeshStandardMaterial({
      //   color: 0xff6b6b,
      //   emissive: 0xff6b6b,
      //   emissiveIntensity: 0.1,
      //   roughness: 0.5,
      //   metalness: 0.3
      // })
      // this.achievementPath = markRaw(new THREE.Mesh(tubeGeometry, tubeMaterial))
      // this.scene.add(this.achievementPath)
      
      // 在路径上创建成就标记点
      this.createAchievementMarkers(pathPoints)
    },
    
    // 根据personId生成路径偏移
    getPathOffset(personId) {
      // 使用personId的哈希值生成0-360度的角度偏移
      const hash = String(personId).split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0)
      }, 0)
      
      const angle = (hash % 360) * Math.PI / 180
      const radius = 0.3 + (hash % 5) * 0.1 // 0.3-0.7的径向偏移
      
      return {
        angle,
        radius,
        // 添加一些随机性但保持确定性
        xOffset: Math.cos(angle) * radius,
        zOffset: Math.sin(angle) * radius
      }
    },
    
    // 生成路径点
    generatePathPoints(offset) {
      const points = []
      const numPoints = 20 // 路径点数量
      
      // 根据模型大小计算路径范围
      const modelHeight = this.modelSize.y
      const modelRadius = Math.max(this.modelSize.x, this.modelSize.z) / 2
      
      // 山体的高度范围 (从底部到接近顶部)
      const baseHeight = -modelHeight * 0.4
      const peakHeight = modelHeight * 0.35 // 不到顶部，留一点空间
      
      for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1)
        
        // 高度从山脚到山顶的插值
        const y = baseHeight + t * (peakHeight - baseHeight)
        
        // 随着高度增加,半径逐渐减小(模拟山体收缩)
        const radius = modelRadius * (1 - t * 0.6) + offset.radius * modelRadius * 0.2
        
        // 螺旋上升的路径
        const spiralAngle = offset.angle + t * Math.PI * 0.5
        const x = Math.cos(spiralAngle) * radius + offset.xOffset * (1 - t) * modelRadius * 0.1
        const z = Math.sin(spiralAngle) * radius + offset.zOffset * (1 - t) * modelRadius * 0.1
        
        // 添加一些随机波动使路径更自然
        const noise = Math.sin(t * Math.PI * 4) * 0.1
        
        points.push(new THREE.Vector3(x + noise, y, z))
      }
      
      return points
    },
    
    // 创建成就标记点
    createAchievementMarkers(pathPoints) {
      // 清除之前的标记
      this.achievementMarkers.forEach(marker => {
        this.scene.remove(marker)
      })
      this.achievementMarkers = []
      
      // 为每个成就创建标记
      const achievementCount = Math.min(this.achievements.length, pathPoints.length - 1)
      
      for (let i = 0; i < achievementCount; i++) {
        const achievement = this.achievements[i]
        
        // 计算标记在路径上的位置 (越后面的成就越靠近山顶)
        const pathIndex = Math.floor((i / achievementCount) * (pathPoints.length - 1))
        const position = pathPoints[pathIndex]
        
        // 创建标记几何体 - 使用球体和锥体组合
        const markerGroup = new THREE.Group()
        
        // 根据模型大小调整标记大小
        const markerScale = Math.min(this.modelSize.x, this.modelSize.y, this.modelSize.z) * 0.03
        
        // 底座球体
        const sphereGeometry = new THREE.SphereGeometry(markerScale, 16, 16)
        const sphereMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffd700,
          emissive: 0xffd700,
          emissiveIntensity: 0.3,
          metalness: 0.8,
          roughness: 0.2
        })
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        markerGroup.add(sphere)
        
        // 旗帜
        const flagGeometry = new THREE.ConeGeometry(markerScale * 0.6, markerScale * 3.5, 4)
        const flagMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xff4444,
          emissive: 0xff4444,
          emissiveIntensity: 0.2
        })
        const flag = new THREE.Mesh(flagGeometry, flagMaterial)
        flag.position.y = markerScale * 2.5
        flag.rotation.z = Math.PI / 4
        markerGroup.add(flag)
        
        markerGroup.position.copy(position)
        
        // 添加悬浮动画
        markerGroup.userData = {
          achievement,
          originalY: position.y,
          animationPhase: i * 0.5
        }
        
        // 使用markRaw防止Vue响应式包装
        const rawMarkerGroup = markRaw(markerGroup)
        this.scene.add(rawMarkerGroup)
        this.achievementMarkers.push(rawMarkerGroup)
      }
    },
    
    // 动画循环
    animate() {
      this.animationId = requestAnimationFrame(this.animate)
      
      const time = Date.now() * 0.001
      
      // 更新标记动画
      this.achievementMarkers.forEach(marker => {
        const phase = marker.userData.animationPhase
        const floatAmount = this.modelScale * 0.02 // 根据模型大小调整悬浮幅度
        marker.position.y = marker.userData.originalY + Math.sin(time * 2 + phase) * floatAmount
        marker.rotation.y = time + phase
      })
      
      // 更新控制器
      if (this.controls) {
        this.controls.update()
      }
      
      // 渲染场景
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
      }
    },
    
    // 重置相机
    resetCamera() {
      this.camera.position.set(
        this.initialCameraPosition.x,
        this.initialCameraPosition.y,
        this.initialCameraPosition.z
      )
      this.camera.lookAt(0, 0, 0)
      this.controls.target.set(0, 0, 0)
      this.controls.update()
    },
    
    // 切换自动旋转
    toggleAutoRotate() {
      this.autoRotate = !this.autoRotate
      this.controls.autoRotate = this.autoRotate
    },
    
    // 窗口大小改变
    onWindowResize() {
      const container = this.$refs.containerRef
      if (!container) return
      
      const width = container.clientWidth
      const height = container.clientHeight
      
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      
      this.renderer.setSize(width, height)
    },
    
    // 鼠标移动事件
    onMouseMove(event) {
      const container = this.$refs.containerRef
      if (!container || !this.raycaster || !this.mouse || !this.camera) return
      
      const rect = container.getBoundingClientRect()
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // 更新射线投射器
      this.raycaster.setFromCamera(this.mouse, this.camera)
      
      // 检测与成就标记的交互
      const intersects = this.raycaster.intersectObjects(this.achievementMarkers, true)
      
      // 重置之前悬停的标记
      if (this.hoveredMarker) {
        this.hoveredMarker.scale.set(1, 1, 1)
        this.hoveredMarker = null
        this.hoveredAchievement = null
      }
      
      // 如果有交互对象
      if (intersects.length > 0) {
        // 找到最近的标记组
        let markerGroup = intersects[0].object
        while (markerGroup.parent && markerGroup.parent.type !== 'Scene') {
          markerGroup = markerGroup.parent
        }
        
        if (markerGroup.userData && markerGroup.userData.achievement) {
          this.hoveredMarker = markerGroup
          this.hoveredAchievement = markerGroup.userData.achievement
          
          // 放大标记
          markerGroup.scale.set(1.3, 1.3, 1.3)
          
          // 改变鼠标样式
          container.style.cursor = 'pointer'
        }
      } else {
        container.style.cursor = 'default'
      }
    }
  }
}
</script>

<style scoped>
.everest-achievement {
  width: 100%;
  height: 100vh;
  position: relative;
  background: linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%);
  overflow: hidden;
}

.scene-container {
  width: 100%;
  height: 100%;
}

/* 成就信息面板 */
.achievement-info {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  backdrop-filter: blur(10px);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.achievement-info h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.achievement-info .year {
  color: #ff6b6b;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.achievement-info .type,
.achievement-info .level {
  color: #555;
  font-size: 13px;
  margin: 0 0 8px 0;
}

.achievement-info .label {
  font-weight: 600;
  color: #333;
}

.achievement-info .description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 10px 0 0 0;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

/* 控制面板 */
.controls {
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.control-btn i {
  font-size: 16px;
}

/* 加载提示 */
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #333;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 107, 107, 0.2);
  border-top-color: #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

/* 调试信息 */
.debug-info {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 15px;
  border-radius: 8px;
  font-size: 12px;
  font-family: monospace;
  line-height: 1.6;
}

.debug-info p {
  margin: 5px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .achievement-info {
    max-width: calc(100% - 40px);
    left: 20px;
    right: 20px;
  }
  
  .controls {
    bottom: 20px;
    right: 20px;
    flex-direction: column;
  }
  
  .control-btn {
    width: 100%;
    justify-content: center;
  }
  
  .debug-info {
    top: 10px;
    right: 10px;
    font-size: 10px;
    padding: 10px;
  }
}
</style>
