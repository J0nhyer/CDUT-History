<template>
  <div class="dino-campus-3d">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack">
      ←
    </button>

    <!-- 3D场景容器 -->
    <div ref="container" class="scene-container"></div>

    <!-- UI覆盖层 -->
    <div class="ui-overlay">
    </div>

    <!-- 建筑信息弹窗 -->
    <div class="building-modal" v-if="selectedBuilding" @click.self="closeBuildingModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeBuildingModal">×</button>
        <div class="modal-header">
          <span class="building-emoji">{{ selectedBuilding.emoji }}</span>
          <div>
            <h2>{{ selectedBuilding.name }}</h2>
            <p class="building-name-en">{{ selectedBuilding.nameEn }}</p>
          </div>
        </div>
        <div class="modal-body">
          <p class="building-description">{{ selectedBuilding.description }}</p>
          
          <div v-if="selectedBuilding.tasks" class="building-tasks">
            <h3>可执行任务</h3>
            <div 
              v-for="task in selectedBuilding.tasks" 
              :key="task"
              class="task-option"
              @click="startBuildingTask(task)"
            >
              {{ getTaskName(task) }}
            </div>
          </div>

          <div class="modal-actions">
            <button class="action-btn primary" @click="moveToBuilding">
              🚶 前往此处
            </button>
            <button class="action-btn" @click="exploreBuilding">
              🔍 探索建筑
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <div class="settings-modal" v-if="showSettings" @click.self="showSettings = false">
      <div class="modal-content settings-content">
        <h2>⚙️ 游戏设置</h2>
        <div class="settings-group">
          <label>图形质量</label>
          <select v-model="graphicsQuality">
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
        <div class="settings-group">
          <label>音效</label>
          <input type="range" v-model="soundVolume" min="0" max="100" />
          <span>{{ soundVolume }}%</span>
        </div>
        <button class="close-btn" @click="showSettings = false">关闭</button>
      </div>
    </div>

    <!-- 加载提示 -->
    <div class="loading-screen" v-if="isLoading">
      <div class="loading-content">
        <div class="loading-spinner">🦕</div>
        <h2>正在加载3D校园...</h2>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import campusData from './data/dinoCampus3DData.js'
import detailedCampusData from './data/detailedCampusData.js'
import beautifulData from './data/detailedCampusData.js'
import {
  createHighQualityBuilding,
  createHighQualityRoad,
  createHighQualityRiver,
  createHighQualityPark,
  createStadium,
  createTree
} from './utils/beautifulSceneGenerator.js'

export default {
  name: 'DinoCampus3D',
  setup() {
    const router = useRouter()
    const container = ref(null)
    
    // 场景对象
    let scene, camera, renderer, controls
    let dino, buildings = [], roads = [], trees = []
    let raycaster, mouse
    let clickMarker = null // 点击位置的光标标记
    
    // 游戏状态
    const isLoading = ref(true)
    const loadingMessage = ref('初始化场景...')
    const showSettings = ref(false)
    const autoWalk = ref(false)
    const selectedBuilding = ref(null)
    
    // 玩家数据
    const playerLevel = ref(1)
    const playerScore = ref(0)
    const currentDino = ref(campusData.dinosaurs.mamenchisaurus)
    const achievements = ref([
      { id: 'first_step', name: '第一步', icon: '👣', unlocked: true },
      { id: 'museum_visit', name: '参观校史馆', icon: '🏛️', unlocked: false },
      { id: 'ten_buildings', name: '探索十座建筑', icon: '🏢', unlocked: false }
    ])
    
    // 设置
    const graphicsQuality = ref('high')
    const soundVolume = ref(50)
    
    // 相机控制
    let cameraTarget = new THREE.Vector3(0, 0, 0)
    let cameraDistance = 400
    const cameraDistanceMin = 50  // 缩小下限（最小距离）
    const cameraDistanceMax = 1500 // 放大上限（最大距离，从800提升到1500）
    let cameraAngle = Math.PI / 4
    let isManualCameraControl = false // 标记是否手动控制相机（滚轮缩放）
    let manualCameraTimeout = null // 手动控制超时，恢复自动跟随
    
    // 鼠标中键旋转控制
    let isMiddleMouseDown = false // 是否按下鼠标中键
    let lastMousePosition = { x: 0, y: 0 } // 上次鼠标位置
    let cameraRotation = {
      horizontal: 0, // 水平角度（绕Y轴，弧度）
      vertical: Math.PI / 4 // 垂直角度（与水平面的夹角，弧度，0到π）
    }
    const rotationSpeed = 0.005 // 旋转速度（弧度/像素）
    const minVerticalAngle = 0.1 // 最小垂直角度（接近水平视角，从侧面看）
    const maxVerticalAngle = Math.PI / 2 - 0.05 // 最大垂直角度（恰好俯视，不能再继续俯视）
    
    // 恐龙移动控制
    let isDinoMoving = false
    let dinoMoveAnimationId = null
    
    // WASD键盘控制
    const keys = {
      w: false,
      a: false,
      s: false,
      d: false
    }
    let dinoMoveSpeed = 2.0 // 移动速度（提升4倍，更快移动）
    let dinoRotation = 0 // 恐龙朝向角度
    
    // 动画相关
    let frameCount = 0 // 帧计数器，用于性能优化
    const clock = new THREE.Clock() // 时钟对象，用于动画

    // 初始化场景
    function initScene() {
      try {
        loadingMessage.value = '创建3D场景...'
        
        if (!container.value) {
          console.error('❌ 容器元素未找到，无法初始化场景')
          return false
        }
        
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x87CEEB) // 天空蓝
        scene.fog = new THREE.FogExp2(0x87CEEB, 0.001)
        
        const width = container.value.clientWidth
        const height = container.value.clientHeight
        
        if (width === 0 || height === 0) {
          console.error('❌ 容器尺寸无效：', { width, height })
          return false
        }
        
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 5000)
        
        // 相机初始位置（稍后根据场景类型调整）
        // 默认使用数据中的位置，如果是简化场景会在createSimpleScene中调整
        camera.position.set(
          campusData.camera.initialPosition.x,
          campusData.camera.initialPosition.y,
          campusData.camera.initialPosition.z
        )
        camera.lookAt(0, 0, 0)
        
        // 性能优化：禁用抗锯齿以大幅提升性能
        try {
          renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
        } catch (error) {
          console.error('❌ WebGL渲染器创建失败，尝试使用基础渲染器：', error)
          // 如果WebGL不可用，尝试使用基础配置
          renderer = new THREE.WebGLRenderer({ antialias: false })
        }
        
        renderer.setSize(width, height)
        // 性能优化：限制像素比到1.0以大幅提升性能
        renderer.setPixelRatio(1.0)
        // 性能优化：使用BasicShadowMap以提升性能
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.BasicShadowMap
        
        // 确保容器是空的或清除旧的渲染器
        if (container.value.firstChild && container.value.firstChild.tagName === 'CANVAS') {
          container.value.removeChild(container.value.firstChild)
        }
        
        container.value.appendChild(renderer.domElement)
        
        // 灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(50, 100, 50)
        directionalLight.castShadow = true
        directionalLight.shadow.camera.left = -100
        directionalLight.shadow.camera.right = 100
        directionalLight.shadow.camera.top = 100
        directionalLight.shadow.camera.bottom = -100
        // 性能优化：大幅降低阴影贴图分辨率以提升性能
        directionalLight.shadow.mapSize.width = 512
        directionalLight.shadow.mapSize.height = 512
        scene.add(directionalLight)
        
        // 添加太阳光
        const sunLight = new THREE.DirectionalLight(0xFFD700, 0.4)
        sunLight.position.set(-50, 100, -50)
        scene.add(sunLight)
        
        // 射线投射器（用于点击检测）
        raycaster = new THREE.Raycaster()
        mouse = new THREE.Vector2()
        
        console.log('✅ 场景初始化成功', { width, height })
        return true
      } catch (error) {
        console.error('❌ 场景初始化失败：', error)
        loadingMessage.value = '场景初始化失败：' + error.message
        return false
      }
    }

    // 创建地面
    function createGround() {
      loadingMessage.value = '创建地面...'
      
      const groundGeometry = new THREE.PlaneGeometry(
        campusData.worldSize.width,
        campusData.worldSize.depth
      )
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x90EE90, // 草地绿
        roughness: 0.8,
        metalness: 0.1
      })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = 0
      ground.receiveShadow = true
      ground.userData = { type: 'ground' } // 标记为地面，用于点击检测
      scene.add(ground)
    }

    // 创建道路
    function createRoads() {
      loadingMessage.value = '创建道路网络...'
      
      campusData.roads.forEach(road => {
        const points = road.path.map(p => new THREE.Vector3(p[0], 0.01, p[1]))
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: road.width })
        const line = new THREE.Line(geometry, material)
        scene.add(line)
        
        // 创建道路平面
        points.forEach((point, i) => {
          if (i < points.length - 1) {
            const roadPlane = new THREE.PlaneGeometry(road.width, points[i].distanceTo(points[i + 1]))
            const roadMat = new THREE.MeshStandardMaterial({ color: 0x666666 })
            const roadMesh = new THREE.Mesh(roadPlane, roadMat)
            roadMesh.rotation.x = -Math.PI / 2
            
            const midPoint = new THREE.Vector3()
            midPoint.addVectors(points[i], points[i + 1])
            midPoint.multiplyScalar(0.5)
            
            roadMesh.position.copy(midPoint)
            roadMesh.rotation.z = Math.atan2(
              points[i + 1].z - points[i].z,
              points[i + 1].x - points[i].x
            )
            scene.add(roadMesh)
            roads.push(roadMesh)
          }
        })
      })
    }

    // 创建河流
    function createRivers() {
      campusData.rivers.forEach(river => {
        const points = river.path.map(p => new THREE.Vector3(p[0], 0, p[1]))
        const curve = new THREE.CatmullRomCurve3(points)
        const geometry = new THREE.TubeGeometry(curve, 64, river.width / 2, 8, false)
        const material = new THREE.MeshStandardMaterial({
          color: river.color,
          transparent: true,
          opacity: 0.8,
          metalness: 0.3,
          roughness: 0.1
        })
        const riverMesh = new THREE.Mesh(geometry, material)
        scene.add(riverMesh)
      })
    }

    // 尝试加载 Blender 生成的精美校园地图（如果存在）
    function loadCampusModel() {
      loadingMessage.value = '尝试加载精美校园地图...'
      
      // 标记为未使用外部模型（默认值）
      window.useExternalCampusModel = false
      
      // 动态导入 GLTFLoader
      import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
        const loader = new GLTFLoader()
        const modelPath = '/models/campus.glb' // 放在 public/models/ 目录
        
        console.log('🔍 尝试加载模型文件:', modelPath)
        console.log('📁 文件应该位于: public/models/campus.glb')
        
        loader.load(
          modelPath,
          // 成功加载
          (gltf) => {
            console.log('✅ 精美校园地图模型加载成功！')
            const campus = gltf.scene
            
            // 遍历所有网格，启用阴影，并添加标签
            campus.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                
                // 如果有自定义属性（建筑信息），保存并添加标签
                if (child.userData && child.userData.buildingId) {
                  const buildingData = campusData.buildings.find(
                    b => b.id === child.userData.buildingId
                  )
                  if (buildingData) {
                    child.userData.building = buildingData
                    
                    // 获取建筑高度和位置（用于标签位置）
                    child.updateMatrixWorld(true)
                    const boundingBox = new THREE.Box3().setFromObject(child)
                    const worldPosition = new THREE.Vector3()
                    child.getWorldPosition(worldPosition)
                    
                    // 为Blender模型的建筑添加标签（在场景中独立添加，不修改模型结构）
                    const labelText = buildingData.name || buildingData.id || '建筑'
                    const canvas = document.createElement('canvas')
                    const context = canvas.getContext('2d')
                    canvas.width = 512
                    canvas.height = 128
                    
                    // 绘制背景和文字
                    context.fillStyle = 'rgba(0, 0, 0, 0.7)'
                    context.fillRect(0, 0, canvas.width, canvas.height)
                    context.strokeStyle = 'rgba(255, 255, 255, 0.8)'
                    context.lineWidth = 4
                    context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)
                    context.fillStyle = '#FFFFFF'
                    context.font = 'bold 48px Arial, "Microsoft YaHei", sans-serif'
                    context.textAlign = 'center'
                    context.textBaseline = 'middle'
                    context.fillText(labelText, canvas.width / 2, canvas.height / 2)
                    
                    // 创建标签sprite
                    const texture = new THREE.CanvasTexture(canvas)
                    texture.needsUpdate = true
                    const material = new THREE.SpriteMaterial({
                      map: texture,
                      transparent: true,
                      depthTest: false,
                      depthWrite: false
                    })
                    const sprite = new THREE.Sprite(material)
                    sprite.scale.set(40, 10, 1)
                    sprite.position.copy(worldPosition)
                    sprite.position.y = boundingBox.max.y + 8 // 悬浮在建筑顶部上方
                    sprite.userData.type = 'label'
                    sprite.userData.building = buildingData
                    
                    // 添加到场景
                    scene.add(sprite)
                    
                    // 添加到 buildings 数组以便点击检测
                    buildings.push({
                      ...buildingData,
                      mesh: child,
                      boundingBox: boundingBox
                    })
                  }
                }
              }
            })
            
            // 调整缩放和位置（根据实际情况调整）
            // 如果模型太大，调小这个值；如果太小，调大这个值
            campus.scale.set(0.1, 0.1, 0.1) // 根据 Blender 导出尺寸调整
            campus.position.set(0, 0, 0)
            
            scene.add(campus)
            
            // 标记为使用外部模型
            window.useExternalCampusModel = true
            
            console.log('精美校园地图已添加到场景！')
            console.log('💡 提示：如果需要调整模型大小，修改 campus.scale.set() 的值')
          },
          // 加载进度
          (progress) => {
            const percent = (progress.loaded / progress.total * 100).toFixed(0)
            loadingMessage.value = `加载校园地图模型 ${percent}%...`
          },
          // 加载失败（不再使用程序化生成）
          (error) => {
            console.error('❌ Blender 校园地图模型加载失败！')
            console.error('错误详情:', error)
            console.error('💡 提示：将 Blender 导出的 campus.glb 放入 public/models/ 目录')
            console.error('📁 文件路径应该是：', modelPath)
            console.error('📁 详细步骤请参考：BLENDER_CAMPUS_MAP_GUIDE.md')
            loadingMessage.value = '错误：校园地图模型加载失败！请查看控制台获取帮助'
            // 标记为未使用外部模型
            window.useExternalCampusModel = false
          }
        )
      }).catch((error) => {
        console.error('❌ GLTFLoader 加载失败:', error)
        console.error('💡 请确保已安装 @react-three/drei 或 three/examples/jsm/loaders/GLTFLoader.js')
        window.useExternalCampusModel = false
      })
    }

    // ========== 简化版地图场景创建（基于React代码设计）==========
    // 创建简化的校园场景：简单建筑（Box）、道路连接、简化恐龙
    
    // 校园节点数据（类似React代码中的campusNodes）
    const campusNodes = [
      { id: 'mainGate', name: '正门', pos: [0, 0, -30], size: [12, 8, 2], color: '#cc9966' },
      { id: 'library', name: '图书馆', pos: [-30, 0, 10], size: [18, 12, 18], color: '#8899bb' },
      { id: 'histMuseum', name: '校史馆', pos: [20, 0, 10], size: [14, 10, 12], color: '#bb8855' },
      { id: 'geology', name: '地质楼', pos: [0, 0, 20], size: [16, 12, 14], color: '#66bb99' },
      { id: 'stadium', name: '运动场', pos: [40, 0, -5], size: [28, 2, 20], color: '#66cc66' },
    ]
    
    // 道路连接数据
    const roadConnections = [
      { from: [0, 0, -30], to: [-30, 0, 10], width: 6 },
      { from: [0, 0, -30], to: [20, 0, 10], width: 6 },
      { from: [0, 0, -30], to: [0, 0, 20], width: 6 },
    ]
    
    // 创建简化的地面
    function createSimpleGround() {
      loadingMessage.value = '创建地面...'
      const groundGeometry = new THREE.PlaneGeometry(500, 500)
      const groundMaterial = new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 0,
        color: '#e9f5d9' // 浅绿色草地
      })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = -0.01
      ground.receiveShadow = true
      ground.userData = { type: 'ground' }
      scene.add(ground)
    }
    
    // 创建简化的道路（使用BoxGeometry，连接两点）
    function createSimpleRoad(from, to, width) {
      const mid = [
        (from[0] + to[0]) / 2,
        0.01,
        (from[2] + to[2]) / 2
      ]
      const dx = to[0] - from[0]
      const dz = to[2] - from[2]
      const len = Math.sqrt(dx * dx + dz * dz)
      const angle = Math.atan2(dz, dx)
      
      const roadGeometry = new THREE.BoxGeometry(len, 0.02, width)
      const roadMaterial = new THREE.MeshStandardMaterial({
        color: '#d3d3d3', // 灰色道路
        metalness: 0.2,
        roughness: 0.9
      })
      const road = new THREE.Mesh(roadGeometry, roadMaterial)
      road.position.set(mid[0], mid[1], mid[2])
      road.rotation.y = -angle
      road.receiveShadow = true
      scene.add(road)
      roads.push(road)
    }
    
    // 创建建筑文字标签（悬浮在上方，始终朝向相机）
    function createBuildingLabel(buildingGroup, buildingData, height) {
      const labelText = buildingData.name || buildingData.id || '建筑'
      
      // 创建Canvas用于渲染文字
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 512
      canvas.height = 128
      
      // 绘制背景（半透明黑色背景，白色边框）
      context.fillStyle = 'rgba(0, 0, 0, 0.7)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      context.lineWidth = 4
      context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)
      
      // 绘制文字
      context.fillStyle = '#FFFFFF'
      context.font = 'bold 48px Arial, "Microsoft YaHei", sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(labelText, canvas.width / 2, canvas.height / 2)
      
      // 创建纹理和材质
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false, // 始终显示在前面
        depthWrite: false
      })
      
      // 创建Sprite（始终朝向相机的2D平面）
      const sprite = new THREE.Sprite(material)
      sprite.scale.set(40, 10, 1) // 标签大小
      sprite.position.y = height + 8 // 悬浮在建筑上方
      sprite.userData = { type: 'label', building: buildingData }
      
      // 添加到建筑组
      buildingGroup.add(sprite)
      
      return sprite
    }
    
    // 创建简化的建筑（使用BoxGeometry）
    function createSimpleBuilding(node) {
      const [w, h, d] = node.size
      const group = new THREE.Group()
      
      // 建筑主体
      const buildingGeometry = new THREE.BoxGeometry(w, h, d)
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        roughness: 0.7
      })
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial)
      building.position.y = h / 2
      building.castShadow = true
      building.receiveShadow = true
      group.add(building)
      
      // 建筑标签（3D文字位置标记）
      building.userData = {
        building: {
          id: node.id,
          name: node.name,
          type: 'building'
        }
      }
      
      // 创建建筑名称标签（悬浮在上方）
      createBuildingLabel(group, {
        id: node.id,
        name: node.name
      }, h)
      
      group.position.set(node.pos[0], 0, node.pos[2])
      scene.add(group)
      
      buildings.push({
        id: node.id,
        name: node.name,
        mesh: group,
        position: { x: node.pos[0], z: node.pos[2] },
        boundingBox: new THREE.Box3().setFromObject(group)
      })
      
      return group
    }
    
    // 创建简化的马门溪龙（使用基础几何体拼合，类似React代码）
    function createSimpleMamenchiDino(position = [0, 0, 0], scale = 0.8) {
      loadingMessage.value = '创建简化的马门溪龙...'
      
      const dinoGroup = new THREE.Group()
      
      // 身体（圆柱体）
      const bodyGeometry = new THREE.CylinderGeometry(
        0.6 * scale,
        0.8 * scale,
        2.2 * scale,
        14
      )
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: '#8aa26f',
        roughness: 0.6
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.castShadow = true
      dinoGroup.add(body)
      
      // 颈部（细圆柱）
      const neckGeometry = new THREE.CylinderGeometry(
        0.22 * scale,
        0.26 * scale,
        1.0 * scale,
        12
      )
      const neck = new THREE.Mesh(neckGeometry, bodyMaterial)
      neck.position.set(0, 0.9 * scale, 0.9 * scale)
      neck.castShadow = true
      dinoGroup.add(neck)
      
      // 头部（球体）
      const headGeometry = new THREE.SphereGeometry(0.26 * scale, 12, 12)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: '#7b8f5d',
        roughness: 0.6
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 1.1 * scale, 1.6 * scale)
      head.castShadow = true
      dinoGroup.add(head)
      
      // 四肢（盒子）
      const legGeometry = new THREE.BoxGeometry(
        0.25 * scale,
        0.6 * scale,
        0.35 * scale
      )
      const legMaterial = new THREE.MeshStandardMaterial({
        color: '#6f8a4f'
      })
      
      // 前左腿
      const legFL = new THREE.Mesh(legGeometry, legMaterial)
      legFL.position.set(0.6 * scale, -0.45 * scale, 0.4 * scale)
      legFL.castShadow = true
      dinoGroup.add(legFL)
      
      // 前右腿
      const legFR = new THREE.Mesh(legGeometry, legMaterial)
      legFR.position.set(-0.6 * scale, -0.45 * scale, 0.4 * scale)
      legFR.castShadow = true
      dinoGroup.add(legFR)
      
      // 后左腿
      const legBL = new THREE.Mesh(legGeometry, legMaterial)
      legBL.position.set(0.6 * scale, -0.45 * scale, -0.6 * scale)
      legBL.castShadow = true
      dinoGroup.add(legBL)
      
      // 后右腿
      const legBR = new THREE.Mesh(legGeometry, legMaterial)
      legBR.position.set(-0.6 * scale, -0.45 * scale, -0.6 * scale)
      legBR.castShadow = true
      dinoGroup.add(legBR)
      
      // 尾巴（细长圆柱）
      const tailGeometry = new THREE.CylinderGeometry(
        0.12 * scale,
        0.18 * scale,
        1.8 * scale,
        10
      )
      const tail = new THREE.Mesh(tailGeometry, bodyMaterial)
      tail.position.set(0, 0.2 * scale, -1.1 * scale)
      tail.rotation.x = 0.15
      tail.castShadow = true
      dinoGroup.add(tail)
      
      // 设置位置
      dinoGroup.position.set(position[0], 0.25 * scale, position[2])
      
      // 添加简单的摆动动画（类似React代码中的useFrame）
      dinoGroup.userData.animationOffset = Math.random() * Math.PI * 2
      dinoGroup.userData.initialPosition = { x: position[0], z: position[2] }
      
      scene.add(dinoGroup)
      dino = dinoGroup
      
      console.log('✅ 简化的马门溪龙创建完成')
    }
    
    // 更新简化恐龙的动画（类似React代码中的useFrame）
    function updateSimpleDinoAnimation(clock) {
      if (!dino || !dino.userData.initialPosition) return
      
      const t = clock.getElapsedTime()
      const offset = dino.userData.animationOffset || 0
      
      // 简单行走摆动：身体上下、轻微摆动
      const initialX = dino.userData.initialPosition.x
      const initialZ = dino.userData.initialPosition.z
      
      dino.position.x = initialX + Math.sin((t + offset) * 0.6) * 0.2
      dino.position.z = initialZ + Math.cos((t + offset) * 0.6) * 0.2
      dino.rotation.y = Math.sin((t + offset) * 0.3) * 0.08
      
      // 尾巴摆动（如果有尾部子对象）
      const tail = dino.children.find(child => child.geometry && child.geometry.type === 'CylinderGeometry')
      if (tail && tail.rotation) {
        tail.rotation.x = 0.15 + Math.sin((t + offset) * 0.5) * 0.1
        tail.rotation.z = Math.sin((t + offset) * 0.4) * 0.1
      }
    }
    
    // ========== 精美大规模校园场景创建 ==========
    // 根据真实地图创建超大规模、细节丰富的精美校园场景
    
    function createBeautifulScene() {
      loadingMessage.value = '创建精美的超大规模校园场景...'
      console.log('🏗️ 开始创建精美校园场景（基于真实地图数据）')
      console.log(`📐 场景尺寸：${beautifulData.worldSize.width}x${beautifulData.worldSize.depth}`)
      console.log(`🏢 建筑数量：${beautifulData.buildings.length}`)
      
      // 调整相机位置以适应大规模场景
      camera.position.set(
        beautifulData.camera.initialPosition.x,
        beautifulData.camera.initialPosition.y,
        beautifulData.camera.initialPosition.z
      )
      camera.fov = 60
      camera.updateProjectionMatrix()
      
      // 1. 创建大规模地面
      createBeautifulGround()
      
      // 2. 创建河流（沱江）
      beautifulData.rivers.forEach(river => {
        const riverGroup = createHighQualityRiver(river)
        scene.add(riverGroup)
      })
      
      // 3. 创建道路网络
      beautifulData.roads.forEach(road => {
        const roadGroup = createHighQualityRoad(road.path, road.width)
        scene.add(roadGroup)
        roads.push(roadGroup)
      })
      
      // 4. 创建公园和绿地
      beautifulData.parks.forEach(park => {
        const parkGroup = createHighQualityPark(park)
        scene.add(parkGroup)
      })
      
      // 5. 创建体育场
      beautifulData.stadiums.forEach(stadium => {
        const stadiumGroup = createStadium(stadium)
        scene.add(stadiumGroup)
      })
      
      // 6. 创建高质量建筑（分批加载以提高性能）
      let buildingIndex = 0
      const loadBuildings = () => {
        const batchSize = 5
        for (let i = 0; i < batchSize && buildingIndex < beautifulData.buildings.length; i++) {
          const buildingData = beautifulData.buildings[buildingIndex]
          const buildingGroup = createHighQualityBuilding(buildingData)
          
          // 为建筑添加名称标签（悬浮在上方）
          createBuildingLabel(buildingGroup, buildingData, buildingData.size.height)
          
          scene.add(buildingGroup)
          
          // 添加到建筑列表以便点击检测
          buildings.push({
            ...buildingData,
            mesh: buildingGroup,
            boundingBox: new THREE.Box3().setFromObject(buildingGroup)
          })
          
          buildingIndex++
        }
        
        if (buildingIndex < beautifulData.buildings.length) {
          loadingMessage.value = `创建精美建筑 ${buildingIndex}/${beautifulData.buildings.length}...`
          setTimeout(loadBuildings, 50)
        } else {
          console.log('✅ 所有精美建筑创建完成！')
          
          // 7. 添加环境装饰（树木等）
          addEnvironmentDecorations()
          
          // 8. 创建精美的马门溪龙（可移动）
          console.log('🦕 创建马门溪龙...')
          createDino()
          console.log('✅ 马门溪龙创建完成！可以使用WASD移动')
          
          console.log('🎨 精美校园场景创建完成！')
          console.log(`✨ 共创建 ${beautifulData.buildings.length} 座精美建筑`)
          console.log(`🌊 ${beautifulData.rivers.length} 条河流`)
          console.log(`🛣️ ${beautifulData.roads.length} 条道路`)
          console.log(`🌳 ${beautifulData.parks.length} 个公园`)
          console.log('🦕 1 个可移动的马门溪龙（使用WASD键控制）')
        }
      }
      
      loadBuildings()
    }
    
    // 创建精美地面
    function createBeautifulGround() {
      loadingMessage.value = '创建大规模地面...'
      const groundGeometry = new THREE.PlaneGeometry(
        beautifulData.worldSize.width,
        beautifulData.worldSize.depth,
        100,
        100 // 增加细分以提高质量
      )
      
      // 创建地面材质（带纹理）
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x90EE90, // 草地绿
        roughness: 0.9,
        metalness: 0.0
      })
      
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = 0
      ground.receiveShadow = true
      ground.userData = { type: 'ground' }
      scene.add(ground)
    }
    
    // 添加环境装饰
    function addEnvironmentDecorations() {
      loadingMessage.value = '添加环境装饰...'
      
      // 性能优化：大幅减少环境装饰，提升性能
      // 在道路两侧添加树木（减少90%）
      beautifulData.roads.forEach(road => {
        const points = road.path
        for (let i = 0; i < points.length - 1; i++) {
          // 性能优化：完全移除路边树木以大幅提升性能
          // 树木生成代码已被移除以提升性能
        }
      })
      
      console.log(`🌲 添加了 ${trees.length} 棵环境树木`)
    }
    
    // 简化场景（保留作为后备）
    function createSimpleScene() {
      loadingMessage.value = '创建简化的校园场景...'
      console.log('🏗️ 创建简化版地图场景（基于React代码设计）')
      
      // 调整相机位置以适应简化场景
      camera.position.set(60, 40, 60)
      camera.fov = 45
      camera.updateProjectionMatrix()
      
      // 创建地面
      createSimpleGround()
      
      // 创建道路
      roadConnections.forEach(road => {
        createSimpleRoad(road.from, road.to, road.width)
      })
      
      // 创建建筑
      campusNodes.forEach(node => {
        createSimpleBuilding(node)
      })
      
      // 创建简化的马门溪龙
      createSimpleMamenchiDino([0, 0, 0], 1.2)
      
      console.log('✅ 简化场景创建完成！')
      console.log('📐 场景尺寸：500x500，5个建筑节点')
    }
    
    /* 已禁用 - 原程序化建筑生成
    function createBuildings() {
      loadingMessage.value = '创建精美的建筑模型...'
      console.log('开始创建精美的程序化建筑...')
      
      let createdCount = 0
      campusData.buildings.forEach((buildingData, index) => {
        const building = createBuilding(buildingData)
        if (building) {
          scene.add(building.group)
          buildings.push({
            ...buildingData,
            mesh: building.group,
            boundingBox: building.boundingBox
          })
          createdCount++
        }
        
        if (index % 5 === 0) {
          loadingMessage.value = `创建精美建筑 ${index + 1}/${campusData.buildings.length}...`
        }
      })
      
      console.log(`✅ 精美建筑创建完成！共 ${createdCount} 个建筑`)
      console.log('✨ 特性：窗户装饰、PBR材质、法线贴图、屋顶细节')
    }

    // 已禁用 - 创建单个建筑
    function createBuilding(data) {
      const group = new THREE.Group()
      
      // 建筑主体（使用更精细的几何体）
      const geometry = new THREE.BoxGeometry(
        data.size.width,
        data.size.height,
        data.size.depth,
        2, // widthSegments - 增加细分
        2, // heightSegments
        2  // depthSegments
      )
      
      // 改进材质（更精美的PBR效果）
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.6,  // 降低粗糙度，更光滑
        metalness: 0.2,
        emissive: new THREE.Color(data.color).multiplyScalar(0.05), // 轻微自发光
        envMapIntensity: 1.0
      })
      
      const building = new THREE.Mesh(geometry, material)
      building.position.y = data.size.height / 2
      building.castShadow = true
      building.receiveShadow = true
      
      // 添加法线细节（让表面更有质感）
      const noiseTexture = new THREE.DataTexture(
        new Uint8Array(32 * 32).map(() => Math.random() * 255),
        32,
        32,
        THREE.LuminanceFormat
      )
      noiseTexture.needsUpdate = true
      noiseTexture.wrapS = THREE.RepeatWrapping
      noiseTexture.wrapT = THREE.RepeatWrapping
      material.normalMap = noiseTexture
      material.normalScale = new THREE.Vector2(0.2, 0.2)
      
      group.add(building)
      
      // 建筑屋顶（特殊建筑有更精美的屋顶）
      if (data.special) {
        // 使用更精细的屋顶几何体
        const roofGeometry = new THREE.ConeGeometry(
          data.size.width * 0.7,
          data.size.height * 0.3,
          8  // 增加边数，更圆滑
        )
        // 创建深色版本的屋顶颜色
        const roofColor = new THREE.Color(data.color)
        roofColor.multiplyScalar(0.7) // 更深色
        const roofMaterial = new THREE.MeshStandardMaterial({
          color: roofColor,
          roughness: 0.8,
          metalness: 0.1
        })
        const roof = new THREE.Mesh(roofGeometry, roofMaterial)
        roof.position.y = data.size.height + data.size.height * 0.15
        roof.rotation.y = Math.PI / 4
        roof.castShadow = true
        group.add(roof)
      } else {
        // 普通建筑也添加简单屋顶
        const flatRoofGeometry = new THREE.BoxGeometry(
          data.size.width * 1.05,
          data.size.height * 0.1,
          data.size.depth * 1.05
        )
        const roofColor = new THREE.Color(data.color)
        roofColor.multiplyScalar(0.8)
        const flatRoofMaterial = new THREE.MeshStandardMaterial({
          color: roofColor,
          roughness: 0.9
        })
        const flatRoof = new THREE.Mesh(flatRoofGeometry, flatRoofMaterial)
        flatRoof.position.y = data.size.height
        flatRoof.castShadow = true
        group.add(flatRoof)
      }
      
      // 添加窗户装饰（给建筑添加细节）
      if (data.size.width > 5 && data.size.depth > 5) {
        const windowCountX = Math.floor(data.size.width / 3)
        const windowCountZ = Math.floor(data.size.depth / 3)
        
        for (let i = 0; i < windowCountX; i++) {
          for (let j = 0; j < 2; j++) { // 两层窗户
            const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2)
            const windowMaterial = new THREE.MeshStandardMaterial({
              color: 0x4682B4, // 蓝色窗户
              emissive: 0x1a4a6b,
              emissiveIntensity: 0.3,
              roughness: 0.3,
              metalness: 0.8
            })
            const window = new THREE.Mesh(windowGeometry, windowMaterial)
            
            // 窗户位置
            const offsetX = (i / (windowCountX - 1) - 0.5) * (data.size.width - 1)
            const windowY = (j + 1) * (data.size.height / 3)
            const offsetZ = data.size.depth / 2 + 0.1
            
            window.position.set(offsetX, windowY, offsetZ)
            group.add(window)
          }
        }
      }
      
      // 建筑标识（用于点击检测）
      const labelGeometry = new THREE.BoxGeometry(
        data.size.width + 2,
        2,
        data.size.depth + 2
      )
      const labelMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        visible: false
      })
      const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial)
      labelMesh.position.y = 1
      labelMesh.userData = { building: data }
      group.add(labelMesh)
      
      // 建筑位置
      group.position.set(data.position.x, 0, data.position.z)
      
      // 创建边界框
      const box = new THREE.Box3().setFromObject(group)
      
      return { group, boundingBox: box }
    }
    */ // 程序化建模函数结束

    // 创建树木装饰
    function createTrees() {
      loadingMessage.value = '添加环境装饰...'
      
      // 在公园区域创建树木
      campusData.parks.forEach(park => {
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i
          const distance = park.size.width * 0.3
          const x = park.position.x + Math.cos(angle) * distance
          const z = park.position.z + Math.sin(angle) * distance
          
          const tree = createTree(new THREE.Vector3(x, 0, z))
          if (tree) {
            scene.add(tree)
            trees.push(tree)
          }
        }
      })
      
      // 随机添加一些树木
      for (let i = 0; i < 30; i++) {
        const x = (Math.random() - 0.5) * campusData.worldSize.width * 0.8
        const z = (Math.random() - 0.5) * campusData.worldSize.depth * 0.8
        
        // 检查是否在建筑附近
        const tooClose = buildings.some(b => {
          const dx = x - b.position.x
          const dz = z - b.position.z
          return Math.sqrt(dx * dx + dz * dz) < 10
        })
        
        if (!tooClose) {
          const tree = createTree(new THREE.Vector3(x, 0, z))
          if (tree) {
            scene.add(tree)
            trees.push(tree)
          }
        }
      }
    }

    // 创建单棵树
    function createTree(position) {
      const treeGroup = new THREE.Group()
      
      // 树干
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 6) // 从8减少到6
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
      trunk.position.y = 1.5
      // 性能优化：禁用树木阴影投射以大幅提升性能
      trunk.castShadow = false
      treeGroup.add(trunk)
      
      // 树冠
      const crownGeometry = new THREE.ConeGeometry(2, 4, 6) // 从8减少到6
      const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 })
      const crown = new THREE.Mesh(crownGeometry, crownMaterial)
      crown.position.y = 4
      // 性能优化：禁用树木阴影投射以大幅提升性能
      crown.castShadow = false
      treeGroup.add(crown)
      
      treeGroup.position.copy(position)
      
      return treeGroup
    }

    // 创建超精美的马门溪龙模型（优化版 - 更大更精美）
    function createDino() {
      loadingMessage.value = '创建超精美的马门溪龙模型...'
      
      const dinoGroup = new THREE.Group()
      
      // 整体缩放系数（更大）
      const scaleMultiplier = 2.5 // 从2.5倍放大
      
      // 创建高质量的黄金黄色PBR材质（更精美的皮肤质感）
      const createDinoMaterial = () => {
        const material = new THREE.MeshStandardMaterial({
          color: 0xFAC82A, // 黄金黄色
          roughness: 0.65,  // 更粗糙以模拟皮肤质感
          metalness: 0.05,   // 轻微金属感
          emissive: new THREE.Color(0xFAC82A).multiplyScalar(0.02), // 轻微自发光
          emissiveIntensity: 0.02,
          envMapIntensity: 1.2 // 增强环境反射
        })
        return material
      }
      
      const dinoMaterial = createDinoMaterial()
      
      // === 创建身体主体（更大、更精细的椭圆体）===
      // 性能优化：大幅减少细分以提升性能
      const bodyGeometry = new THREE.SphereGeometry(1.5 * scaleMultiplier, 12, 10) // 从24,18减少到12,10
      const body = new THREE.Mesh(bodyGeometry, dinoMaterial)
      body.scale.set(1.3, 0.95, 1.8) // 更大更自然的身体
      // 修复：身体在中心，头在前（负Z），尾在后（正Z）
      body.position.set(0, 1.5 * scaleMultiplier, 0.5 * scaleMultiplier)
      body.castShadow = true
      body.receiveShadow = true
      dinoGroup.add(body)
      
      // === 创建躯干中段（更大、更精细）===
      // 性能优化：大幅减少细分
      const torsoGeometry = new THREE.SphereGeometry(1.0 * scaleMultiplier, 12, 10) // 从24,18减少到12,10
      const torso = new THREE.Mesh(torsoGeometry, dinoMaterial)
      torso.scale.set(1.0, 0.85, 1.3)
      // 修复：躯干连接身体和脖子，朝向头部方向（负Z）
      torso.position.set(0, 2.2 * scaleMultiplier, -1.2 * scaleMultiplier)
      torso.castShadow = true
      dinoGroup.add(torso)
      
      // === 创建长脖子（马门溪龙的标志性特征）===
      // 性能优化：减少段数以提升性能
      const neckSegments = 6 // 从10减少到6
      const neckHeight = 5.5 * scaleMultiplier
      const neckBaseRadius = 0.5 * scaleMultiplier
      const neckTopRadius = 0.35 * scaleMultiplier
      
      for (let i = 0; i < neckSegments; i++) {
        const t = i / (neckSegments - 1)
        const radius = neckBaseRadius * (1 - t * 0.3) // 逐渐变细
        const segmentHeight = neckHeight / neckSegments
        const segmentGeometry = new THREE.CylinderGeometry(radius, radius * 1.1, segmentHeight, 8) // 从16减少到8
        const segment = new THREE.Mesh(segmentGeometry, dinoMaterial)
        
        // 位置和旋转，形成自然弯曲
        // 修复：脖子从躯干向前延伸到头部（负Z方向）
        const baseY = 2.5 * scaleMultiplier + i * segmentHeight
        const bend = Math.sin(t * Math.PI) * 0.4 * scaleMultiplier // 更明显的S型弯曲
        segment.position.set(bend, baseY, -1.8 * scaleMultiplier - t * 3.5 * scaleMultiplier)
        segment.rotation.z = -0.15 * Math.sin(t * Math.PI)
        segment.rotation.x = 0.08 * Math.cos(t * Math.PI)
        
        segment.castShadow = true
        dinoGroup.add(segment)
      }
      
      // === 创建头部（更大、更精细）===
      // 性能优化：减少细分
      const headGeometry = new THREE.SphereGeometry(0.6 * scaleMultiplier, 12, 10) // 从24,18减少到12,10
      const head = new THREE.Mesh(headGeometry, dinoMaterial)
      head.scale.set(1.2, 0.9, 0.9) // 更大的头部
      // 修复：头部在脖子前端（负Z方向，前方）
      head.position.set(0, 6.0 * scaleMultiplier, -6.2 * scaleMultiplier)
      head.castShadow = true
      dinoGroup.add(head)
      
      // 创建下颚（更精细）
      const jawGeometry = new THREE.BoxGeometry(0.5 * scaleMultiplier, 0.2 * scaleMultiplier, 0.4 * scaleMultiplier, 4, 2, 4)
      const jaw = new THREE.Mesh(jawGeometry, dinoMaterial)
      // 修复：下颚在头部前方（更负Z）
      jaw.position.set(0, 5.7 * scaleMultiplier, -6.5 * scaleMultiplier)
      jaw.castShadow = true
      dinoGroup.add(jaw)
      
      // === 创建眼睛（性能优化：减少细分）===
      const eyeGeometry = new THREE.SphereGeometry(0.1 * scaleMultiplier, 8, 8) // 从16,16减少到8,8
      
      // 眼白材质
      const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.2
      })
      
      // 眼球材质（黑色，有光泽）
      const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.1,
        metalness: 0.3
      })
      
      // 左眼
      const eyeWhiteL = new THREE.Mesh(
        new THREE.SphereGeometry(0.12 * scaleMultiplier, 8, 8), // 从16,16减少到8,8
        eyeWhiteMaterial
      )
      eyeWhiteL.position.set(0.25 * scaleMultiplier, 6.1 * scaleMultiplier, -6.0 * scaleMultiplier)
      dinoGroup.add(eyeWhiteL)
      
      const eyeL = new THREE.Mesh(eyeGeometry, eyeMaterial)
      eyeL.position.set(0.25 * scaleMultiplier, 6.1 * scaleMultiplier, -6.0 * scaleMultiplier)
      dinoGroup.add(eyeL)
      
      // 右眼
      const eyeWhiteR = new THREE.Mesh(
        new THREE.SphereGeometry(0.12 * scaleMultiplier, 16, 16),
        eyeWhiteMaterial
      )
      eyeWhiteR.position.set(-0.25 * scaleMultiplier, 6.1 * scaleMultiplier, -6.0 * scaleMultiplier)
      dinoGroup.add(eyeWhiteR)
      
      const eyeR = new THREE.Mesh(eyeGeometry, eyeMaterial)
      eyeR.position.set(-0.25 * scaleMultiplier, 6.1 * scaleMultiplier, -6.0 * scaleMultiplier)
      dinoGroup.add(eyeR)
      
      // === 添加鼻孔细节 ===
      const nostrilGeometry = new THREE.SphereGeometry(0.05 * scaleMultiplier, 12, 12)
      const nostrilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
      
      const nostrilL = new THREE.Mesh(nostrilGeometry, nostrilMaterial)
      nostrilL.position.set(0.15 * scaleMultiplier, 5.9 * scaleMultiplier, -6.4 * scaleMultiplier)
      dinoGroup.add(nostrilL)
      
      const nostrilR = new THREE.Mesh(nostrilGeometry, nostrilMaterial)
      nostrilR.position.set(-0.15 * scaleMultiplier, 5.9 * scaleMultiplier, -6.4 * scaleMultiplier)
      dinoGroup.add(nostrilR)
      
      // === 创建长尾巴（更多段、更精细）===
      const tailSegments = 12 // 从8增加到12，更流畅
      const tailLength = 4.5 * scaleMultiplier
      const tailBaseRadius = 0.4 * scaleMultiplier
      
      for (let i = 0; i < tailSegments; i++) {
        const t = i / tailSegments
        const radius = tailBaseRadius * (1 - t * 0.75)
        const segmentHeight = tailLength / tailSegments
        const segmentGeometry = new THREE.CylinderGeometry(radius, radius * 1.15, segmentHeight, 8) // 从16减少到8
        const segment = new THREE.Mesh(segmentGeometry, dinoMaterial)
        
        const baseY = 0.8 * scaleMultiplier + i * segmentHeight * 0.7
        const tailBend = Math.sin(t * Math.PI * 0.5) * 0.5 * scaleMultiplier
        // 修复：尾巴在身体后方（正Z方向）
        segment.position.set(0, baseY, 2.5 * scaleMultiplier + t * 3.5 * scaleMultiplier)
        segment.rotation.x = 0.25 + t * 0.2
        segment.rotation.z = tailBend / scaleMultiplier
        
        segment.castShadow = true
        dinoGroup.add(segment)
      }
      
      // === 创建四肢（更大、更精细，带爪子细节）===
      const createLimb = (name, basePos, direction, length, baseRadius, topRadius, scaleMultiplier) => {
        // 主腿部分
        const limbGeometry = new THREE.CylinderGeometry(topRadius, baseRadius, length, 8) // 从16减少到8
        const limb = new THREE.Mesh(limbGeometry, dinoMaterial)
        
        limb.position.copy(basePos)
        limb.position.y += length / 2
        
        // 根据方向旋转
        if (direction.x > 0) {
          limb.rotation.z = 0.2
        } else {
          limb.rotation.z = -0.2
        }
        limb.rotation.x = 0.15
        
        limb.castShadow = true
        
        // 创建脚部（更大的脚）
        const footGeometry = new THREE.BoxGeometry(
          topRadius * 1.8, 
          length * 0.2, 
          topRadius * 1.8,
          4, 2, 4
        )
        const foot = new THREE.Mesh(footGeometry, dinoMaterial)
        foot.position.copy(basePos)
        foot.position.y += length * 0.1
        foot.rotation.x = 0.15
        foot.castShadow = true
        
        // 创建爪子（每个脚3个爪子）
        const clawGroup = new THREE.Group()
        const clawGeometry = new THREE.ConeGeometry(topRadius * 0.3, length * 0.15, 6) // 从8减少到6
        const clawMaterial = new THREE.MeshStandardMaterial({
          color: 0x8B4513, // 棕色爪子
          roughness: 0.5,
          metalness: 0.2
        })
        
        for (let i = 0; i < 3; i++) {
          const claw = new THREE.Mesh(clawGeometry, clawMaterial)
          claw.position.set(
            (i - 1) * topRadius * 0.5,
            -length * 0.1,
            -topRadius * 0.8
          )
          claw.rotation.x = -0.5
          claw.castShadow = true
          clawGroup.add(claw)
        }
        
        clawGroup.position.copy(basePos)
        clawGroup.position.y += length * 0.15
        clawGroup.rotation.x = 0.15
        
        const limbGroup = new THREE.Group()
        limbGroup.add(limb)
        limbGroup.add(foot)
        limbGroup.add(clawGroup)
        
        return limbGroup
      }
      
      // 前腿（更大）- 在前方（负Z）
      const frontLeft = createLimb('FrontLeft', 
        new THREE.Vector3(0.9 * scaleMultiplier, 0, -2.8 * scaleMultiplier), 
        new THREE.Vector3(1, 0, 0), 
        2.6 * scaleMultiplier, 0.35 * scaleMultiplier, 0.25 * scaleMultiplier,
        scaleMultiplier)
      frontLeft.userData.originalRotation = { x: frontLeft.rotation.x, z: frontLeft.rotation.z }
      dinoGroup.add(frontLeft)
      
      const frontRight = createLimb('FrontRight', 
        new THREE.Vector3(-0.9 * scaleMultiplier, 0, -2.8 * scaleMultiplier), 
        new THREE.Vector3(-1, 0, 0), 
        2.6 * scaleMultiplier, 0.35 * scaleMultiplier, 0.25 * scaleMultiplier,
        scaleMultiplier)
      frontRight.userData.originalRotation = { x: frontRight.rotation.x, z: frontRight.rotation.z }
      dinoGroup.add(frontRight)
      
      // 后腿（更大）- 在后方（正Z）
      const backLeft = createLimb('BackLeft', 
        new THREE.Vector3(1.1 * scaleMultiplier, 0, 0.3 * scaleMultiplier), 
        new THREE.Vector3(1, 0, 0), 
        3.2 * scaleMultiplier, 0.45 * scaleMultiplier, 0.32 * scaleMultiplier,
        scaleMultiplier)
      backLeft.userData.originalRotation = { x: backLeft.rotation.x, z: backLeft.rotation.z }
      dinoGroup.add(backLeft)
      
      const backRight = createLimb('BackRight', 
        new THREE.Vector3(-1.1 * scaleMultiplier, 0, 0.3 * scaleMultiplier), 
        new THREE.Vector3(-1, 0, 0), 
        3.2 * scaleMultiplier, 0.45 * scaleMultiplier, 0.32 * scaleMultiplier,
        scaleMultiplier)
      backRight.userData.originalRotation = { x: backRight.rotation.x, z: backRight.rotation.z }
      dinoGroup.add(backRight)
      
      // 保存腿部引用以便行走动画使用
      dinoGroup.userData.legs = {
        frontLeft,
        frontRight,
        backLeft,
        backRight
      }
      dinoGroup.userData.walkAnimationTime = 0 // 行走动画时间
      dinoGroup.userData.isWalking = false // 是否在行走
      
      // === 添加高级皮肤纹理细节（性能优化：降低纹理分辨率）===
      // 创建优化的皮肤纹理
      const createSkinTexture = () => {
        const size = 64 // 性能优化：降低到64以提升性能
        const data = new Uint8Array(size * size)
        for (let i = 0; i < data.length; i++) {
          // 使用简化的噪声生成
          const x = i % size
          const y = Math.floor(i / size)
          const value = (
            Math.sin(x * 0.1) * Math.cos(y * 0.1) * 64 +
            Math.random() * 32
          ) % 256
          data[i] = value
        }
        return new THREE.DataTexture(data, size, size, THREE.LuminanceFormat)
      }
      
      const skinTexture = createSkinTexture()
      skinTexture.needsUpdate = true
      skinTexture.wrapS = THREE.RepeatWrapping
      skinTexture.wrapT = THREE.RepeatWrapping
      
      // 修改材质以包含细节
      dinoMaterial.normalMap = skinTexture
      dinoMaterial.normalScale = new THREE.Vector2(0.3, 0.3) // 减少法线效果以提升性能
      
      // 性能优化：减少斑点数量以提升性能
      // === 添加皮肤斑点/花纹（减少数量以提升性能）===
      for (let i = 0; i < 8; i++) { // 从15减少到8
        const spotGeometry = new THREE.SphereGeometry(
          0.05 * scaleMultiplier * (0.5 + Math.random() * 0.5),
          6, 6 // 减少细分
        )
        const spotMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xFAC82A).multiplyScalar(0.85),
          roughness: 0.7
        })
        const spot = new THREE.Mesh(spotGeometry, spotMaterial)
        
        // 随机分布在身体上
        spot.position.set(
          (Math.random() - 0.5) * 2 * scaleMultiplier,
          1 + Math.random() * 1.5 * scaleMultiplier,
          (Math.random() - 0.5) * 2 * scaleMultiplier
        )
        spot.castShadow = false // 性能优化：斑点不投射阴影
        dinoGroup.add(spot)
      }
      
      // === 设置组的位置和缩放（使用更大的基础缩放）===
      dinoGroup.position.set(0, 0, 0)
      // 使用更大的缩放系数
      const baseScale = (currentDino.value.size.scale || 2.5) * 1.2 // 再放大20%
      dinoGroup.scale.set(baseScale, baseScale, baseScale)
      // 修复：初始化旋转，确保头部朝向正确（负Z方向，前方）
      dinoGroup.rotation.y = 0 // 确保初始朝向负Z方向（前方）
      
      // === 添加轻微的呼吸动画 ===
      dinoGroup.userData.breathingAnimation = () => {
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.02
        body.scale.set(1.2 * scale, 0.9 * scale, 1.6 * scale)
      }
      
      // === 添加行走动画函数 ===
      dinoGroup.userData.walkingAnimation = (deltaTime) => {
        if (!dinoGroup.userData.isWalking) {
          // 如果不在行走，重置腿部到原始位置
          const legs = dinoGroup.userData.legs
          if (legs) {
            legs.frontLeft.rotation.x = legs.frontLeft.userData.originalRotation.x
            legs.frontLeft.rotation.z = legs.frontLeft.userData.originalRotation.z
            legs.frontRight.rotation.x = legs.frontRight.userData.originalRotation.x
            legs.frontRight.rotation.z = legs.frontRight.userData.originalRotation.z
            legs.backLeft.rotation.x = legs.backLeft.userData.originalRotation.x
            legs.backLeft.rotation.z = legs.backLeft.userData.originalRotation.z
            legs.backRight.rotation.x = legs.backRight.userData.originalRotation.x
            legs.backRight.rotation.z = legs.backRight.userData.originalRotation.z
          }
          return
        }
        
        // 更新行走动画时间（基于真实时间，确保帧率无关）
        dinoGroup.userData.walkAnimationTime += deltaTime * 4 // 行走速度因子
        
        const legs = dinoGroup.userData.legs
        if (!legs) return
        
        // 计算行走周期（使用正弦波）
        // 对角腿同步：frontLeft + backRight 一组，frontRight + backLeft 一组
        const time1 = dinoGroup.userData.walkAnimationTime
        const time2 = dinoGroup.userData.walkAnimationTime + Math.PI // 相位差180度
        
        // 腿部摆动幅度（弧度）
        const swingAmplitude = 0.4 // 前后摆动幅度
        const liftAmplitude = 0.15 // 抬腿幅度
        
        // 前腿摆动（X轴旋转：前后摆动）
        // 左前腿和右后腿同步（time1）
        legs.frontLeft.rotation.x = legs.frontLeft.userData.originalRotation.x + Math.sin(time1) * swingAmplitude
        legs.backRight.rotation.x = legs.backRight.userData.originalRotation.x - Math.sin(time1) * swingAmplitude
        
        // 右前腿和左后腿同步（time2，相位差180度）
        legs.frontRight.rotation.x = legs.frontRight.userData.originalRotation.x + Math.sin(time2) * swingAmplitude
        legs.backLeft.rotation.x = legs.backLeft.userData.originalRotation.x - Math.sin(time2) * swingAmplitude
        
        // 抬腿效果（稍微调整Y轴位置，通过改变旋转来模拟）
        // 使用绝对值的正弦波来控制抬腿
        const lift1 = Math.max(0, Math.sin(time1)) * liftAmplitude
        const lift2 = Math.max(0, Math.sin(time2)) * liftAmplitude
        
        // 前腿稍微向前抬
        legs.frontLeft.rotation.z = legs.frontLeft.userData.originalRotation.z + (Math.sin(time1) > 0 ? lift1 : 0)
        legs.frontRight.rotation.z = legs.frontRight.userData.originalRotation.z + (Math.sin(time2) > 0 ? lift2 : 0)
        
        // 后腿稍微向后抬
        legs.backLeft.rotation.z = legs.backLeft.userData.originalRotation.z - (Math.sin(time2) > 0 ? lift2 : 0)
        legs.backRight.rotation.z = legs.backRight.userData.originalRotation.z - (Math.sin(time1) > 0 ? lift1 : 0)
      }
      
      scene.add(dinoGroup)
      dino = dinoGroup
      
      console.log('精美的马门溪龙模型创建完成！')
    }
    
    // 动画循环
    function animate() {
      requestAnimationFrame(animate)
      
      // 更新简化恐龙的动画（如果使用简化场景）
      // 只在未移动且是简化恐龙时播放摆动动画
      if (dino && dino.userData.initialPosition && !isDinoMoving && !keys.w && !keys.a && !keys.s && !keys.d) {
        updateSimpleDinoAnimation(clock)
      }
      
      // 相机跟随恐龙（缩放后延迟恢复跟随，或在恐龙移动时立即恢复）
      if (dino) {
        // 修复：只有在恐龙移动时才恢复自动跟随，但不影响中键旋转
        // 如果正在使用中键旋转，不要恢复自动跟随
        if ((isDinoMoving || keys.w || keys.a || keys.s || keys.d) && !isMiddleMouseDown) {
          // 恐龙移动时，清除手动控制状态（但不影响正在使用中键的情况）
          isManualCameraControl = false
          if (manualCameraTimeout) {
            clearTimeout(manualCameraTimeout)
            manualCameraTimeout = null
          }
        }
        
        // 仅在未手动控制且未使用中键旋转时跟随
        if (!isManualCameraControl && !isMiddleMouseDown) {
          const dinoPosition = dino.position
          
          if (!isDinoMoving) {
            // 更新相机位置（跟随恐龙，适应更大的场景）
            const targetX = dinoPosition.x
            const targetZ = dinoPosition.z + cameraDistance * 0.6 // 使用 cameraDistance 而不是固定值
            
            camera.position.x += (targetX - camera.position.x) * 0.05
            camera.position.z += (targetZ - camera.position.z) * 0.05
            camera.lookAt(dinoPosition.x, dinoPosition.y + 5, dinoPosition.z)
            
            // 更新旋转角度，以便下次使用中键时从当前位置开始
            updateCameraRotationFromPosition()
          } else {
            // 移动时也跟随相机，但使用不同的平滑度
            const targetX = dinoPosition.x
            const targetZ = dinoPosition.z + cameraDistance * 0.6
            
            camera.position.x += (targetX - camera.position.x) * 0.1
            camera.position.z += (targetZ - camera.position.z) * 0.1
            camera.lookAt(dinoPosition.x, dinoPosition.y + 5, dinoPosition.z)
            
            // 更新旋转角度
            updateCameraRotationFromPosition()
          }
        }
      }
      
      // 性能优化：移除树木旋转动画以提升性能
      // trees.forEach(tree => {
      //   tree.rotation.y += 0.001
      // })
      
      // 性能优化：降低动画更新频率（每2帧更新一次）
      if (frameCount % 2 === 0) {
        // 获取deltaTime用于动画（只调用一次）
        const deltaTime = clock.getDelta() * 2 // 乘以2以补偿跳帧
        
        // 恐龙呼吸动画（仅在未移动时）
        if (dino && dino.userData.breathingAnimation && !isDinoMoving && !keys.w && !keys.a && !keys.s && !keys.d) {
          dino.userData.breathingAnimation()
        }
        
        // 行走动画（移动时）
        if (dino && dino.userData.walkingAnimation) {
          // 判断是否在移动
          const isMoving = isDinoMoving || keys.w || keys.a || keys.s || keys.d
          dino.userData.isWalking = isMoving
          
          // 更新行走动画（使用相同的deltaTime）
          dino.userData.walkingAnimation(deltaTime)
        }
        
        // 点击标记脉冲动画
        if (clickMarker && clickMarker.userData.pulseAnimation) {
          clickMarker.userData.pulseAnimation()
        }
        
        // WASD移动控制
        handleDinoMovement()
      }
      
      // 更新建筑标签朝向（始终面向相机）
      updateBuildingLabels()
      
      // 每帧都渲染（确保renderer、scene、camera都存在）
      if (renderer && scene && camera) {
        try {
          renderer.render(scene, camera)
        } catch (error) {
          console.error('❌ 渲染错误：', error)
        }
      }
      frameCount++
    }
    
    // 更新建筑标签朝向（Billboard效果）
    function updateBuildingLabels() {
      // 遍历场景中的所有标签sprite（包括独立添加的和建筑组内的）
      scene.traverse((child) => {
        if (child.userData && child.userData.type === 'label' && child.isSprite) {
          // Sprite自动朝向相机，但我们可以手动控制以确保正确朝向
          child.lookAt(camera.position)
        }
      })
      
      // 也遍历建筑组内的标签
      buildings.forEach(building => {
        if (building.mesh && building.mesh.traverse) {
          building.mesh.traverse((child) => {
            if (child.userData && child.userData.type === 'label' && child.isSprite) {
              child.lookAt(camera.position)
            }
          })
        }
      })
    }

    // 事件处理
    function setupEventListeners() {
      // 鼠标点击（选择建筑）
      container.value.addEventListener('click', onMouseClick)
      
      // 鼠标滚轮（缩放）
      container.value.addEventListener('wheel', onMouseWheel)
      
      // 鼠标中键按下、移动、释放（旋转相机）
      container.value.addEventListener('mousedown', onMouseDown)
      container.value.addEventListener('mousemove', onMouseMove)
      container.value.addEventListener('mouseup', onMouseUp)
      container.value.addEventListener('mouseleave', onMouseLeave) // 鼠标移出容器时释放
      container.value.addEventListener('contextmenu', onContextMenu) // 防止右键菜单
      
      // 全局鼠标释放（防止鼠标移出容器后卡住）
      window.addEventListener('mouseup', onGlobalMouseUp)
      
      // 键盘控制（WASD移动）
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      
      // 窗口大小调整
      window.addEventListener('resize', onWindowResize)
    }
    
    // 鼠标按下事件
    function onMouseDown(event) {
      // 鼠标中键（button === 1）
      if (event.button === 1) {
        event.preventDefault()
        isMiddleMouseDown = true
        lastMousePosition.x = event.clientX
        lastMousePosition.y = event.clientY
        
        // 标记为手动控制相机
        isManualCameraControl = true
        
        // 清除自动跟随超时
        if (manualCameraTimeout) {
          clearTimeout(manualCameraTimeout)
          manualCameraTimeout = null
        }
        
        // 关键修复：在按下中键时立即从当前相机位置计算角度
        // 确保角度正确初始化，不会跳跃
        updateCameraRotationFromPosition()
        
        // 添加调试信息（开发时可用）
        console.log('🖱️ 中键按下，角度初始化：', {
          horizontal: (cameraRotation.horizontal * 180 / Math.PI).toFixed(2) + '°',
          vertical: (cameraRotation.vertical * 180 / Math.PI).toFixed(2) + '°',
          cameraPos: {
            x: camera.position.x.toFixed(2),
            y: camera.position.y.toFixed(2),
            z: camera.position.z.toFixed(2)
          },
          dinoPos: dino ? {
            x: dino.position.x.toFixed(2),
            y: dino.position.y.toFixed(2),
            z: dino.position.z.toFixed(2)
          } : null
        })
        
        // 阻止默认行为（防止页面滚动）
        return false
      }
    }
    
    // 鼠标移动事件
    function onMouseMove(event) {
      if (isMiddleMouseDown) {
        event.preventDefault()
        
        // 计算鼠标移动距离
        const deltaX = event.clientX - lastMousePosition.x
        const deltaY = event.clientY - lastMousePosition.y
        
        // 更新角度（水平方向：左右移动，垂直方向：上下移动）
        // 确保角度已经初始化（防止未初始化的情况）
        if (cameraRotation.horizontal === undefined || isNaN(cameraRotation.horizontal)) {
          updateCameraRotationFromPosition()
        }
        
        // 更新水平角度（无限制）
        cameraRotation.horizontal -= deltaX * rotationSpeed // 水平旋转（Y轴，左减右加）
        
        // 修复：上下移动视角的逻辑（鼠标向上=向上看=减少垂直角度，鼠标向下=向下看=增加垂直角度）
        // 计算新的垂直角度（注意：deltaY > 0表示鼠标向下移动，应该增加vertical角度）
        const newVertical = cameraRotation.vertical + deltaY * rotationSpeed
        
        // 检查当前角度是否接近边界
        const isNearMin = cameraRotation.vertical <= minVerticalAngle + 0.02
        const isNearMax = cameraRotation.vertical >= maxVerticalAngle - 0.02
        
        // 严格限制：只有在有效范围内才允许更新
        if (newVertical >= minVerticalAngle && newVertical <= maxVerticalAngle) {
          // 角度在有效范围内，允许更新
          cameraRotation.vertical = newVertical
          // 更新相机位置
          updateCameraPositionFromRotation()
        } else if (newVertical < minVerticalAngle && isNearMin) {
          // 已达到最低角度（接近水平视角），完全阻止继续向下看，防止视角突变
          // 不更新垂直角度，只更新水平角度（通过updateCameraPositionFromRotation）
          updateCameraPositionFromRotation()
        } else if (newVertical > maxVerticalAngle && isNearMax) {
          // 已达到最高角度（恰好俯视），完全阻止继续向上看（继续俯视），防止视角突变
          // 不更新垂直角度，只更新水平角度（通过updateCameraPositionFromRotation）
          updateCameraPositionFromRotation()
        } else {
          // 从中间位置快速移动到边界，允许移动到边界但不超过
          const clampedVertical = Math.max(
            minVerticalAngle,
            Math.min(maxVerticalAngle, newVertical)
          )
          cameraRotation.vertical = clampedVertical
          updateCameraPositionFromRotation()
        }
        
        // 更新上次鼠标位置
        lastMousePosition.x = event.clientX
        lastMousePosition.y = event.clientY
      }
    }
    
    // 鼠标释放事件
    function onMouseUp(event) {
      if (event.button === 1 && isMiddleMouseDown) {
        event.preventDefault()
        releaseMiddleMouse()
        return false
      }
    }
    
    // 全局鼠标释放事件（防止鼠标移出容器后卡住）
    function onGlobalMouseUp(event) {
      if (event.button === 1 && isMiddleMouseDown) {
        releaseMiddleMouse()
      }
    }
    
    // 鼠标移出容器事件
    function onMouseLeave(event) {
      // 如果鼠标移出容器时正在拖动，释放中键状态
      if (isMiddleMouseDown) {
        releaseMiddleMouse()
      }
    }
    
    // 释放中键的通用函数
    function releaseMiddleMouse() {
      if (isMiddleMouseDown) {
        isMiddleMouseDown = false
        
        // 修复：不要自动恢复跟随，保持手动控制状态
        // 只有恐龙移动时才会恢复自动跟随（在动画循环中处理）
        // 这样用户旋转相机后，相机会保持在手动控制状态，不会自动切换
      }
    }
    
    // 阻止右键菜单（当使用鼠标中键时）
    function onContextMenu(event) {
      // 如果正在使用中键旋转，阻止右键菜单
      if (isMiddleMouseDown) {
        event.preventDefault()
        return false
      }
    }
    
    // 从当前相机位置计算旋转角度（确保从当前位置正确计算）
    function updateCameraRotationFromPosition() {
      if (!camera || !camera.position) {
        return // 相机未初始化时退出
      }
      
      // 保存当前角度作为后备（如果计算失败）
      const oldHorizontal = cameraRotation.horizontal
      const oldVertical = cameraRotation.vertical
      
      try {
        if (!dino) {
          // 没有恐龙时，基于原点计算
          const dx = camera.position.x
          const dz = camera.position.z
          const dy = camera.position.y
          
          const horizontalDistance = Math.sqrt(dx * dx + dz * dz)
          
          // 修复：正确计算水平角度（相机位置相对于原点的角度）
          if (horizontalDistance > 0.01) {
            // 计算从原点到相机的方向
            // horizontal 角度：从正Z轴方向逆时针旋转的角度（使用 atan2(dx, dz)）
            cameraRotation.horizontal = Math.atan2(dx, dz)
            // vertical 角度：从水平面向上的角度（0 是水平，π/2 是垂直向上）
            cameraRotation.vertical = Math.atan2(dy, horizontalDistance)
            
            // 更新相机距离（从当前位置计算）
            const totalDistance = Math.sqrt(dx * dx + dz * dz + dy * dy)
            if (totalDistance > 0.01) {
              cameraDistance = totalDistance
              cameraDistance = Math.max(cameraDistanceMin, Math.min(cameraDistanceMax, cameraDistance))
            }
          }
        } else {
          // 有恐龙时，基于恐龙位置计算
          const dinoPosition = dino.position
          const dx = camera.position.x - dinoPosition.x
          const dz = camera.position.z - dinoPosition.z
          const dy = camera.position.y - dinoPosition.y
          
          const horizontalDistance = Math.sqrt(dx * dx + dz * dz)
          const totalDistance = Math.sqrt(dx * dx + dz * dz + dy * dy)
          
          // 修复：正确计算水平角度（相机位置相对于恐龙的角度）
          if (horizontalDistance > 0.01) {
            // 计算从恐龙指向相机的方向
            cameraRotation.horizontal = Math.atan2(dx, dz)
            cameraRotation.vertical = Math.atan2(dy, horizontalDistance)
            
            // 更新相机距离（从当前位置计算）
            if (totalDistance > 0.01) {
              cameraDistance = totalDistance
              cameraDistance = Math.max(cameraDistanceMin, Math.min(cameraDistanceMax, cameraDistance))
            }
          }
        }
        
        // 确保垂直角度在有效范围内（严格限制，防止视角突变）
        if (cameraRotation.vertical !== undefined && !isNaN(cameraRotation.vertical)) {
          const clampedVertical = Math.max(
            minVerticalAngle,
            Math.min(maxVerticalAngle, cameraRotation.vertical)
          )
          
          // 如果角度被限制，说明已接近边界
          if (Math.abs(clampedVertical - cameraRotation.vertical) > 0.01) {
            // 角度被限制，确保不超过边界
            cameraRotation.vertical = clampedVertical
          } else {
            cameraRotation.vertical = clampedVertical
          }
        } else {
          // 如果计算失败，使用旧值
          cameraRotation.vertical = oldVertical !== undefined ? oldVertical : Math.PI / 4
        }
        
        // 确保水平角度有效
        if (cameraRotation.horizontal === undefined || isNaN(cameraRotation.horizontal)) {
          // 如果计算失败，使用旧值
          cameraRotation.horizontal = oldHorizontal !== undefined ? oldHorizontal : 0
        }
        
        // 确保垂直角度有效
        if (cameraRotation.vertical === undefined || isNaN(cameraRotation.vertical)) {
          cameraRotation.vertical = Math.PI / 4
        }
      } catch (error) {
        // 如果计算出错，保持旧的角度值
        console.warn('⚠️ 角度计算出错，保持当前角度：', error)
        if (oldHorizontal !== undefined && !isNaN(oldHorizontal)) {
          cameraRotation.horizontal = oldHorizontal
        }
        if (oldVertical !== undefined && !isNaN(oldVertical)) {
          cameraRotation.vertical = oldVertical
        }
      }
    }
    
    // 从旋转角度更新相机位置
    function updateCameraPositionFromRotation() {
      // 确保角度有效
      if (cameraRotation.horizontal === undefined || isNaN(cameraRotation.horizontal)) {
        cameraRotation.horizontal = 0
      }
      if (cameraRotation.vertical === undefined || isNaN(cameraRotation.vertical)) {
        cameraRotation.vertical = Math.PI / 4
      }
      
      if (!dino) {
        // 没有恐龙时，围绕原点旋转
        const target = new THREE.Vector3(0, 0, 0)
        
        // 使用球面坐标系计算相机位置
        // 注意：horizontal 是绕Y轴的角度，vertical 是与水平面的夹角
        const horizontalDistance = cameraDistance * Math.cos(cameraRotation.vertical)
        const verticalDistance = cameraDistance * Math.sin(cameraRotation.vertical)
        
        // 修复：使用正确的三角函数计算位置
        camera.position.x = target.x + horizontalDistance * Math.sin(cameraRotation.horizontal)
        camera.position.z = target.z + horizontalDistance * Math.cos(cameraRotation.horizontal)
        camera.position.y = target.y + verticalDistance
        
        camera.lookAt(target)
      } else {
        // 有恐龙时，围绕恐龙位置旋转
        const dinoPosition = dino.position
        
        // 使用球面坐标系计算相机位置
        const horizontalDistance = cameraDistance * Math.cos(cameraRotation.vertical)
        const verticalDistance = cameraDistance * Math.sin(cameraRotation.vertical)
        
        // 修复：使用正确的三角函数计算位置
        camera.position.x = dinoPosition.x + horizontalDistance * Math.sin(cameraRotation.horizontal)
        camera.position.z = dinoPosition.z + horizontalDistance * Math.cos(cameraRotation.horizontal)
        camera.position.y = dinoPosition.y + verticalDistance
        
        camera.lookAt(dinoPosition.x, dinoPosition.y + 5, dinoPosition.z)
      }
    }

    function onMouseClick(event) {
      // 忽略鼠标中键和右键的点击事件（只处理左键点击）
      if (event.button !== 0) {
        return
      }
      
      // 优化：立即显示反馈，提升响应感
      event.preventDefault() // 阻止默认行为，让响应更快
      
      const rect = container.value.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)
      
      let clickedBuilding = false
      
      for (let intersect of intersects) {
        if (intersect.object.userData.building) {
          selectedBuilding.value = intersect.object.userData.building
          clickedBuilding = true
          break
        }
        
        // 如果点击地面，移动到该位置
        if (intersect.object === scene.children.find(child => child.userData && child.userData.type === 'ground')) {
          const groundIntersect = intersects.find(i => i.object.userData && i.object.userData.type === 'ground')
          if (groundIntersect) {
            // 显示点击标记
            showClickMarker(groundIntersect.point.x, groundIntersect.point.z)
            // 移动恐龙到点击位置
            animateToPosition(groundIntersect.point.x, groundIntersect.point.z)
            return
          }
        }
      }
      
      // 如果点击地面（没有点击建筑），移动到点击位置
      if (!clickedBuilding && intersects.length > 0) {
        const groundIntersect = intersects[intersects.length - 1] // 通常是地面
        if (groundIntersect.point) {
          // 显示点击标记
          showClickMarker(groundIntersect.point.x, groundIntersect.point.z)
          // 移动恐龙到点击位置
          animateToPosition(groundIntersect.point.x, groundIntersect.point.z)
        }
      }
    }

    function onMouseWheel(event) {
      event.preventDefault()
      
      // 计算缩放方向（deltaY > 0 向下滚动 = 拉近，deltaY < 0 向上滚动 = 拉远）
      const zoomSpeed = 10
      const delta = event.deltaY > 0 ? zoomSpeed : -zoomSpeed
      
      // 标记为手动控制相机
      isManualCameraControl = true
      
      // 清除之前的超时
      if (manualCameraTimeout) {
        clearTimeout(manualCameraTimeout)
        manualCameraTimeout = null
      }
      
      // 修复：滚轮缩放后也保持手动控制状态，不自动恢复
      // 只有恐龙移动时才会恢复自动跟随（在动画循环中处理）
      
      // 修复：基于当前相机的实际距离进行增量调整，而不是重置
      // 如果正在使用中键旋转，需要先更新角度
      if (isMiddleMouseDown) {
        updateCameraRotationFromPosition()
      }
      
      if (dino) {
        const dinoPosition = dino.position
        
        // 计算当前相机到恐龙的实际距离和方向
        const dx = camera.position.x - dinoPosition.x
        const dz = camera.position.z - dinoPosition.z
        const dy = camera.position.y - dinoPosition.y // 高度差
        const currentDistance = Math.sqrt(dx * dx + dz * dz)
        
        if (currentDistance > 0.01) {
          // 归一化方向向量
          const dirX = dx / currentDistance
          const dirZ = dz / currentDistance
          
          // 基于当前实际距离进行增量调整（这才是关键修复！）
          const newDistance = Math.max(
            cameraDistanceMin, 
            Math.min(cameraDistanceMax, currentDistance + delta)
          )
          
          // 更新全局cameraDistance变量，保持同步
          cameraDistance = newDistance
          
          // 如果正在使用中键旋转，使用角度系统更新位置
          if (isMiddleMouseDown) {
            updateCameraPositionFromRotation()
          } else {
            // 否则，保持相同的方向，使用新的距离
            const newX = dinoPosition.x + dirX * newDistance
            const newZ = dinoPosition.z + dirZ * newDistance
            
            // 保持高度比例不变（按新距离缩放高度差）
            const heightRatio = dy / currentDistance
            const newY = dinoPosition.y + heightRatio * newDistance
            
            camera.position.set(newX, newY, newZ)
            camera.lookAt(dinoPosition.x, dinoPosition.y + 5, dinoPosition.z)
          }
        }
      } else {
        // 没有恐龙时，基于原点缩放（保持角度）
        const dx = camera.position.x
        const dz = camera.position.z
        const currentDistance = Math.sqrt(dx * dx + dz * dz)
        
        if (currentDistance > 0.01) {
          // 归一化方向向量
          const dirX = dx / currentDistance
          const dirZ = dz / currentDistance
          
          // 基于当前实际距离进行增量调整
          const newDistance = Math.max(
            cameraDistanceMin, 
            Math.min(cameraDistanceMax, currentDistance + delta)
          )
          
          // 更新全局cameraDistance变量
          cameraDistance = newDistance
          
          // 如果正在使用中键旋转，使用角度系统更新位置
          if (isMiddleMouseDown) {
            updateCameraPositionFromRotation()
          } else {
            // 否则，保持相同的角度，使用新的距离
            camera.position.x = dirX * newDistance
            camera.position.z = dirZ * newDistance
            camera.lookAt(0, 0, 0)
          }
        }
      }
    }
    
    // 键盘按下事件
    function onKeyDown(event) {
      const key = event.key.toLowerCase()
      
      switch(key) {
        case 'w':
          keys.w = true
          event.preventDefault()
          break
        case 'a':
          keys.a = true
          event.preventDefault()
          break
        case 's':
          keys.s = true
          event.preventDefault()
          break
        case 'd':
          keys.d = true
          event.preventDefault()
          break
      }
    }
    
    // 键盘释放事件
    function onKeyUp(event) {
      const key = event.key.toLowerCase()
      
      switch(key) {
        case 'w':
          keys.w = false
          break
        case 'a':
          keys.a = false
          break
        case 's':
          keys.s = false
          break
        case 'd':
          keys.d = false
          break
      }
    }
    
    // 处理恐龙移动（WASD控制）
    function handleDinoMovement() {
      if (!dino) return
      
      let moveX = 0
      let moveZ = 0
      
      // 计算移动方向（修复：确保与头部方向一致）
      // 头部在负Z方向（前方），所以：
      // W = 向前 = 负Z方向
      // S = 向后 = 正Z方向
      // A = 向左 = 负X方向
      // D = 向右 = 正X方向
      if (keys.w) {
        moveZ -= dinoMoveSpeed // 向前（负Z）
      }
      if (keys.s) {
        moveZ += dinoMoveSpeed // 向后（正Z）
      }
      if (keys.a) {
        moveX -= dinoMoveSpeed // 向左（负X）
      }
      if (keys.d) {
        moveX += dinoMoveSpeed // 向右（正X）
      }
      
      // 如果有移动，更新位置和朝向
      if (moveX !== 0 || moveZ !== 0) {
        // 更新恐龙位置（直接使用速度值，每帧移动）
        dino.position.x += moveX
        dino.position.z += moveZ
        
        // 计算目标旋转角度
        const targetRotation = Math.atan2(-moveX, -moveZ)
        
        // 平滑旋转过渡（而不是立即设置）
        let currentRotation = dino.rotation.y
        let rotationDiff = targetRotation - currentRotation
        
        // 处理旋转角度跨越问题（-π 到 π）
        if (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI
        if (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI
        
        // 使用线性插值平滑旋转（旋转速度：约180度/秒，即π弧度/秒）
        // 使用固定的旋转步长，基于60fps假设
        const rotationSpeed = Math.PI * 0.03 // 约180度/60帧 = π/60 ≈ 0.052弧度/帧，但使用0.03更快响应
        if (Math.abs(rotationDiff) > 0.01) {
          const rotationStep = Math.sign(rotationDiff) * Math.min(Math.abs(rotationDiff), rotationSpeed)
          dino.rotation.y = currentRotation + rotationStep
        } else {
          // 当接近目标角度时，直接设置以避免抖动
          dino.rotation.y = targetRotation
        }
        
        // 如果正在执行点击移动动画，取消它
        if (isDinoMoving && dinoMoveAnimationId !== null) {
          cancelAnimationFrame(dinoMoveAnimationId)
          isDinoMoving = false
          dinoMoveAnimationId = null
        }
      }
    }

    function onWindowResize() {
      const width = container.value.clientWidth
      const height = container.value.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    // UI交互函数
    function goBack() {
      router.push('/')
    }

    function closeBuildingModal() {
      selectedBuilding.value = null
    }

    // 创建点击标记（光标提示）
    function showClickMarker(x, z) {
      // 如果已存在标记，先移除
      if (clickMarker) {
        scene.remove(clickMarker)
        clickMarker = null
      }
      
      // 创建标记组
      const markerGroup = new THREE.Group()
      
      // 创建外圈（脉冲效果）
      const outerRingGeometry = new THREE.RingGeometry(2, 3, 32)
      const outerRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      })
      const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial)
      outerRing.rotation.x = -Math.PI / 2
      outerRing.position.y = 0.1
      markerGroup.add(outerRing)
      
      // 创建内圈（固定）
      const innerRingGeometry = new THREE.RingGeometry(0.5, 1.5, 32)
      const innerRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      })
      const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial)
      innerRing.rotation.x = -Math.PI / 2
      innerRing.position.y = 0.11
      markerGroup.add(innerRing)
      
      // 创建中心点
      const centerGeometry = new THREE.CircleGeometry(0.5, 32)
      const centerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.9
      })
      const center = new THREE.Mesh(centerGeometry, centerMaterial)
      center.rotation.x = -Math.PI / 2
      center.position.y = 0.12
      markerGroup.add(center)
      
      // 创建箭头指示方向
      const arrowGeometry = new THREE.ConeGeometry(1, 2, 8)
      const arrowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.7
      })
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial)
      arrow.position.set(0, 1.5, -2)
      arrow.rotation.x = Math.PI / 2
      markerGroup.add(arrow)
      
      // 设置标记位置
      markerGroup.position.set(x, 0, z)
      
      // 添加脉冲动画
      let pulseScale = 1
      const pulseSpeed = 0.02
      markerGroup.userData.pulseAnimation = () => {
        pulseScale += pulseSpeed
        if (pulseScale > 1.3) pulseScale = 1
        outerRing.scale.set(pulseScale, 1, pulseScale)
        outerRingMaterial.opacity = 0.6 * (1.3 - pulseScale) / 0.3
      }
      
      // 添加到场景
      scene.add(markerGroup)
      clickMarker = markerGroup
      
      // 3秒后自动隐藏标记（如果还没有到达）
      setTimeout(() => {
        if (clickMarker === markerGroup) {
          scene.remove(clickMarker)
          clickMarker = null
        }
      }, 3000)
    }

    function moveToBuilding() {
      if (selectedBuilding.value && dino) {
        const target = selectedBuilding.value.position
        // 显示点击标记
        showClickMarker(target.x, target.z)
        // 简单的移动动画
        animateToPosition(target.x, target.z)
        closeBuildingModal()
      }
    }

    function animateToPosition(targetX, targetZ) {
      if (!dino) {
        console.warn('恐龙对象不存在')
        return
      }
      
      // 如果正在移动，取消之前的移动
      if (isDinoMoving && dinoMoveAnimationId !== null) {
        cancelAnimationFrame(dinoMoveAnimationId)
      }
      
      isDinoMoving = true
      const startX = dino.position.x
      const startZ = dino.position.z
      
      // 计算距离，根据距离动态调整移动时间
      const distance = Math.sqrt(
        Math.pow(targetX - startX, 2) + Math.pow(targetZ - startZ, 2)
      )
      
      // 优化：提高基础速度，降低最小时长，让响应更快
      const baseSpeed = 150 // 提高基础移动速度（从80提升到150，单位/秒）
      const duration = Math.max(200, Math.min(4000, (distance / baseSpeed) * 1000)) // 降低最小时长到200ms，提高响应速度
      
      const startTime = performance.now()
      const startRotation = dino.rotation.y
      
      // 计算目标旋转角度
      const dx = targetX - startX
      const dz = targetZ - startZ
      let targetRotation = Math.atan2(-dx, -dz)
      
      // 处理旋转角度跨越问题（-π 到 π）
      let rotationDiff = targetRotation - startRotation
      if (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI
      if (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI
      
      // 优化：立即旋转朝向目标（更快响应）
      // 小角度（小于90度）立即旋转，大角度在动画中快速旋转
      const maxInstantRotation = Math.PI / 2 // 90度
      if (Math.abs(rotationDiff) <= maxInstantRotation) {
        // 小角度立即设置，立即响应
        dino.rotation.y = targetRotation
        rotationDiff = 0
      }
      // 大角度会在动画中快速旋转（使用加速旋转）
      
      console.log('开始移动恐龙:', { startX, startZ, targetX, targetZ, distance, duration: duration.toFixed(0) + 'ms' })
      
      function updatePosition() {
        const elapsed = performance.now() - startTime
        let progress = Math.min(elapsed / duration, 1)
        
        // 优化：使用更快的缓动函数 - ease-out-quad，开始快，结束平滑
        // 这会让初始移动更快，响应更快
        progress = 1 - (1 - progress) * (1 - progress) // ease-out-quad
        
        // 插值位置
        dino.position.x = startX + (targetX - startX) * progress
        dino.position.z = startZ + (targetZ - startZ) * progress
        
        // 如果还有剩余旋转，继续旋转（基于进度快速完成）
        if (Math.abs(rotationDiff) > 0.01) {
          // 旋转速度更快，在移动的前30%就完成旋转
          const rotationProgress = Math.min(1, progress * 3) // 旋转在进度前33%完成
          const rotationEase = rotationProgress * rotationProgress // ease-out-quad for rotation
          dino.rotation.y = startRotation + rotationDiff * rotationEase
          
          // 如果接近完成，直接设置目标角度
          if (rotationProgress >= 0.95) {
            dino.rotation.y = targetRotation
            rotationDiff = 0
          }
        }
        
        if (progress < 1) {
          dinoMoveAnimationId = requestAnimationFrame(updatePosition)
        } else {
          // 确保最终位置和旋转精确
          dino.position.x = targetX
          dino.position.z = targetZ
          dino.rotation.y = targetRotation
          
          // 移动完成，隐藏标记
          if (clickMarker) {
            scene.remove(clickMarker)
            clickMarker = null
          }
          // 移动完成
          isDinoMoving = false
          dinoMoveAnimationId = null
          console.log('恐龙移动完成:', dino.position)
        }
      }
      
      updatePosition()
    }

    function exploreBuilding() {
      if (selectedBuilding.value) {
        playerScore.value += 10
        // 这里可以触发建筑探索逻辑
        closeBuildingModal()
      }
    }

    function startBuildingTask(taskName) {
      // 处理任务开始
      console.log('开始任务:', taskName)
      closeBuildingModal()
    }

    function getTaskName(taskId) {
      const taskNames = {
        'explore_gym': '探索体育馆',
        'collect_sports_artifact': '收集体育文物',
        'solve_math_puzzle': '解答数学谜题',
        'find_dinosaur_fossil': '寻找恐龙化石',
        'museum_tour': '参观校史馆',
        'find_mamenchisaurus': '寻找马门溪龙化石'
      }
      return taskNames[taskId] || taskId
    }

    function resetCamera() {
      cameraDistance = 400 // 重置到默认距离
      isManualCameraControl = false // 重置手动控制标记
      
      // 清除超时
      if (manualCameraTimeout) {
        clearTimeout(manualCameraTimeout)
        manualCameraTimeout = null
      }
      
      if (dino) {
        camera.position.set(
          dino.position.x,
          300,
          dino.position.z + cameraDistance * 0.6
        )
        camera.lookAt(dino.position.x, dino.position.y + 5, dino.position.z)
      } else {
        camera.position.set(
          campusData.camera.initialPosition.x,
          campusData.camera.initialPosition.y,
          campusData.camera.initialPosition.z
        )
        camera.lookAt(0, 0, 0)
      }
      cameraAngle = Math.PI / 4
    }

    function toggleAutoWalk() {
      autoWalk.value = !autoWalk.value
      // 实现自动漫游逻辑
    }


    // 初始化
    onMounted(() => {
      // 确保容器已准备好
      if (!container.value) {
        console.error('❌ 容器元素未找到！')
        return
      }
      
      // 确保容器有尺寸
      if (container.value.clientWidth === 0 || container.value.clientHeight === 0) {
        console.warn('⚠️ 容器尺寸为0，等待DOM渲染...')
        setTimeout(() => {
          if (container.value && container.value.clientWidth > 0 && container.value.clientHeight > 0) {
            const initSuccess = initScene()
            if (initSuccess) {
              startLoading()
            } else {
              loadingMessage.value = '场景初始化失败'
            }
          } else {
            console.error('❌ 容器仍未准备好！')
            loadingMessage.value = '错误：容器未准备好'
          }
        }, 100)
        return
      }
      
      const initSuccess = initScene()
      if (!initSuccess) {
        loadingMessage.value = '场景初始化失败，请刷新页面重试'
        return
      }
      startLoading()
    })
    
    // 启动加载流程
    function startLoading() {
      // 默认使用精美场景（除非找到Blender模型）
      window.useSimpleScene = false
      window.useBeautifulScene = false
      
      // 优先尝试加载 Blender 生成的精美模型
      loadCampusModel()
      
      // 延迟检查是否使用了外部模型，如果没有则创建精美程序化场景
      // 使用 Promise 确保加载检查完成
      const checkModelLoaded = () => {
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (window.useExternalCampusModel !== undefined) {
              clearInterval(checkInterval)
              resolve(window.useExternalCampusModel)
            }
          }, 100)
          
          // 最大等待时间 2 秒
          setTimeout(() => {
            clearInterval(checkInterval)
            resolve(window.useExternalCampusModel || false)
          }, 2000)
        })
      }
      
      // 优先尝试加载 Blender 模型，失败则使用精美程序化场景
      checkModelLoaded().then((useExternal) => {
        if (!useExternal) {
          console.warn('⚠️ 未找到 Blender 生成的校园地图模型！')
          console.log('🎨 使用精美程序化生成场景（基于真实地图数据）')
          // 标记使用精美场景
          window.useSimpleScene = false
          window.useBeautifulScene = true
          // 使用精美场景 - 这会创建地面、道路、河流、建筑等所有内容
          createBeautifulScene()
        } else {
          console.log('✅ 使用 Blender 生成的精美校园地图模型')
          console.log('🎨 已移除程序化建模，只使用 Blender 高质量模型')
          // 如果使用 Blender 模型，需要创建基础场景元素（旧方法，保留兼容性）
          createGround()
          createRoads()
          createRivers()
          // 创建恐龙和树木
          createTrees()
          createDino()
        }
        
        // 设置事件监听器
        setupEventListeners()
        
        // 延迟启动动画循环
        setTimeout(() => {
          // 初始化相机旋转角度（基于当前相机位置）
          updateCameraRotationFromPosition()
          
          isLoading.value = false
          loadingMessage.value = '场景加载完成！'
          animate()
        }, 1000)
      })
    }

    onUnmounted(() => {
      // 取消移动动画
      if (isDinoMoving && dinoMoveAnimationId !== null) {
        cancelAnimationFrame(dinoMoveAnimationId)
      }
      
      // 清理渲染器
      if (renderer) {
        renderer.dispose()
      }
      
      // 移除事件监听器
      if (container.value) {
        container.value.removeEventListener('click', onMouseClick)
        container.value.removeEventListener('wheel', onMouseWheel)
        container.value.removeEventListener('mousedown', onMouseDown)
        container.value.removeEventListener('mousemove', onMouseMove)
        container.value.removeEventListener('mouseup', onMouseUp)
        container.value.removeEventListener('mouseleave', onMouseLeave)
        container.value.removeEventListener('contextmenu', onContextMenu)
      }
      window.removeEventListener('mouseup', onGlobalMouseUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onWindowResize)
    })

    return {
      container,
      isLoading,
      loadingMessage,
      showSettings,
      selectedBuilding,
      playerLevel,
      playerScore,
      currentDino,
      achievements,
      graphicsQuality,
      soundVolume,
      goBack,
      closeBuildingModal,
      moveToBuilding,
      exploreBuilding,
      startBuildingTask,
      getTaskName,
      resetCamera,
    }
  }
}
</script>

<style scoped>
.dino-campus-3d {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000;
}

.scene-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.back-btn:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.ui-overlay > * {
  pointer-events: auto;
}





.building-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #7f8c8d;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #ecf0f1;
  color: #e74c3c;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
}

.building-emoji {
  font-size: 64px;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.building-name-en {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 5px;
}

.building-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
}

.building-tasks {
  margin: 20px 0;
}

.building-tasks h3 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.task-option {
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid #3498db;
}

.task-option:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.action-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.action-btn.primary {
  background: #3498db;
  color: white;
}

.action-btn.primary:hover {
  background: #2980b9;
}

.action-btn {
  background: #ecf0f1;
  color: #2c3e50;
}

.action-btn:hover {
  background: #d5dbdb;
}

.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.settings-content {
  width: 400px;
}

.settings-content h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.settings-group {
  margin-bottom: 20px;
}

.settings-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: bold;
}

.settings-group select,
.settings-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  font-size: 80px;
  animation: spin 2s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-content h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
}

.loading-content p {
  font-size: 16px;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 响应式样式 */
}
</style>
