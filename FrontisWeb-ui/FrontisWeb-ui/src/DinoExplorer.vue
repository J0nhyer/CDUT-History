<template>
  <div id="dino-explorer" ref="container">
    <!-- 顶部HUD -->
    <div class="hud">
      <div class="hud-left">
        <div class="collectibles-count">
          <span class="icon">🦴</span>
          <span>{{ collectedFragments }}/{{ totalFragments }}</span>
        </div>
        <div class="achievement-badge" v-if="achievements.length > 0">
          <span class="icon">🏆</span>
          <span>{{ achievements.length }}</span>
        </div>
      </div>
      <div class="hud-center">
        <h2 class="location-name">{{ currentLocation }}</h2>
      </div>
      <div class="hud-right">
        <button @click="takePhoto" class="photo-btn">
          📸 合影
        </button>
        <button @click="backToMain" class="exit-btn">
          🚪 退出
        </button>
      </div>
    </div>

    <!-- 控制说明 -->
    <div class="controls-hint" v-if="showHint">
      <h3>🦖 欢迎来到成理探索之旅！</h3>
      <p><strong>WASD</strong> - 移动小恐龙</p>
      <p><strong>鼠标</strong> - 调整视角</p>
      <p><strong>走到</strong> - 兴趣点自动触发</p>
      <p><strong>E键</strong> - 收集历史碎片</p>
      <button @click="showHint = false" class="start-btn">开始探索</button>
    </div>

    <!-- 兴趣点信息面板 -->
    <div class="interest-panel" v-if="currentInterestPoint">
      <button class="close-panel" @click="closePanel">✕</button>
      <div class="panel-content">
        <div class="interest-icon">{{ currentInterestPoint.icon }}</div>
        <h3>{{ currentInterestPoint.title }}</h3>
        <p>{{ currentInterestPoint.description }}</p>
        <div class="interest-details" v-if="currentInterestPoint.details">
          <ul>
            <li v-for="detail in currentInterestPoint.details" :key="detail">
              {{ detail }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 收集通知 -->
    <div class="collection-toast" v-if="collectionToast.show">
      {{ collectionToast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { gsap } from 'gsap'

const router = useRouter()

const container = ref(null)
const currentLocation = ref('成都理工大学 - 探索校园')
const collectedFragments = ref(0)
const totalFragments = ref(10)
const achievements = ref([])
const showHint = ref(true)
const currentInterestPoint = ref(null)
const collectionToast = ref({ show: false, message: '' })

let scene, camera, renderer
let dino = null
let controls = {}
let isWalking = false
let velocity = new THREE.Vector3()
let clock = new THREE.Clock()
let interestPoints = []
let collectibles = []

// 兴趣点数据
const interestPointsData = [
  {
    id: 'liubaojun',
    name: '刘宝珺院士纪念馆',
    icon: '💎',
    title: '刘宝珺院士',
    description: '沉积地质学家、中国科学院院士',
    details: [
      '创建了中国沉积盆地层序地层学分析的理论框架',
      '提出了"沉积矿产"的新概念',
      '获得李四光地质科学奖',
      '主编《沉积盆地》等经典教材'
    ],
    position: new THREE.Vector3(-10, 0, -5),
    radius: 3
  },
  {
    id: 'zhangzhuoyuan',
    name: '张倬元教授纪念碑',
    icon: '⛰️',
    title: '张倬元教授',
    description: '工程地质学家、教授',
    details: [
      '工程地质学科体系的奠基人之一',
      '提出了多个工程地质评价方法',
      '培养了大批工程地质专业人才'
    ],
    position: new THREE.Vector3(10, 0, -5),
    radius: 3
  },
  {
    id: 'museum',
    name: '恐龙博物馆',
    icon: '🦕',
    title: '恐龙博物馆',
    description: '成都理工大学自然博物馆，镇馆之宝马门溪龙',
    details: [
      '中国西部地区最大的地质类博物馆',
      '馆藏马门溪龙化石举世闻名',
      '展示地球演化和古生物变迁'
    ],
    position: new THREE.Vector3(0, 0, -15),
    radius: 4
  },
  {
    id: 'library',
    name: '图书馆',
    icon: '📚',
    title: '理工图书馆',
    description: '知识的海洋，学术的殿堂',
    position: new THREE.Vector3(-8, 0, 8),
    radius: 3
  },
  {
    id: 'lake',
    name: '砚湖',
    icon: '🏞️',
    title: '砚湖',
    description: '校园最美一景，学子心中的宁静',
    position: new THREE.Vector3(8, 0, 10),
    radius: 3
  },
  {
    id: 'archives',
    name: '校史馆/档案馆',
    icon: '📜',
    title: '校史馆/档案馆',
    description: '收藏学校重要档案、校刊原件、老照片等历史资料。',
    details: [ '校史陈列', '口述历史', '数字化档案' ],
    position: new THREE.Vector3(-15, 0, 6),
    radius: 3
  },
  {
    id: 'gym',
    name: '体育馆',
    icon: '🏟️',
    title: '体育馆',
    description: '大型体育运动与活动场所。',
    position: new THREE.Vector3(15, 0, 6),
    radius: 3
  },
  {
    id: 'auditorium',
    name: '大礼堂',
    icon: '🎭',
    title: '大礼堂',
    description: '重要会议与演出场地，承载集体记忆。',
    position: new THREE.Vector3(14, 0, -10),
    radius: 3
  },
  {
    id: 'innovation',
    name: '创新创业园',
    icon: '💡',
    title: '创新创业园',
    description: '孵化与产业化平台，产学研深度融合。',
    position: new THREE.Vector3(-14, 0, -12),
    radius: 3
  },
  {
    id: 'lab_building',
    name: '实验楼群',
    icon: '🔬',
    title: '实验楼群',
    description: '地球化学、信息与遥感等实验平台集中区。',
    position: new THREE.Vector3(0, 0, 14),
    radius: 4
  },
  {
    id: 'yibin',
    name: '宜宾校区信息点',
    icon: '🧭',
    title: '宜宾校区',
    description: '产业技术学院所在地，支撑产教融合。',
    position: new THREE.Vector3(-18, 0, 0),
    radius: 3
  }
]

onMounted(() => {
  console.log('开始初始化...')
  try {
    initScene()
    console.log('✓ 场景初始化完成')
    
    createWorld()
    console.log('✓ 世界创建完成')
    
    createDino()
    console.log('✓ 恐龙创建完成')
    
    createInterestPoints()
    console.log('✓ 兴趣点创建完成')
    
    createCollectibles()
    console.log('✓ 收集品创建完成')
    
    setupControls()
    setupEventListeners()
    
    console.log('✓ 开始动画循环')
    animate()
  } catch (error) {
    console.error('❌ 初始化错误：', error)
  }
})

onUnmounted(() => {
  cleanup()
})

function initScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)
  scene.fog = new THREE.FogExp2(0x87ceeb, 0.002)

  const width = container.value.clientWidth
  const height = container.value.clientHeight

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(0, 15, 30)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.value.appendChild(renderer.domElement)
  
  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(50, 50, 50)
  dirLight.castShadow = true
  dirLight.shadow.camera.left = -50
  dirLight.shadow.camera.right = 50
  dirLight.shadow.camera.top = 50
  dirLight.shadow.camera.bottom = -50
  scene.add(dirLight)
  
  console.log('场景已初始化', { width, height })
}

function createWorld() {
  // 创建地面
  const groundGeometry = new THREE.PlaneGeometry(100, 100)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x90ee90,
    roughness: 0.8,
    metalness: 0.2
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // 创建道路
  createRoad(new THREE.Vector3(0, 0.01, 0), 100, 8)
  
  // 创建建筑
  createBuilding(new THREE.Vector3(-10, 0, -5), '博物馆', 0xff6347)
  createBuilding(new THREE.Vector3(10, 0, -5), '教学楼', 0x4a90e2)
  createBuilding(new THREE.Vector3(-8, 0, 8), '图书馆', 0xffd700)
  createBuilding(new THREE.Vector3(8, 0, 10), '实验楼', 0x9370db)
  
  // 创建树木装饰
  for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 80
    const z = (Math.random() - 0.5) * 80
    if (Math.abs(x) > 10 || Math.abs(z) > 5) {
      createTree(new THREE.Vector3(x, 0, z))
    }
  }
}

function createRoad(center, length, width) {
  const roadGeometry = new THREE.PlaneGeometry(length, width)
  const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 })
  const road = new THREE.Mesh(roadGeometry, roadMaterial)
  road.rotation.x = -Math.PI / 2
  road.position.copy(center)
  scene.add(road)
}

function createBuilding(position, name, color) {
  const height = 5 + Math.random() * 5
  const geometry = new THREE.BoxGeometry(6, height, 6)
  const material = new THREE.MeshStandardMaterial({ color })
  const building = new THREE.Mesh(geometry, material)
  building.position.copy(position)
  building.position.y = height / 2
  building.castShadow = true
  building.receiveShadow = true
  building.userData = { name, type: 'building' }
  scene.add(building)

  // 添加屋顶
  const roofGeometry = new THREE.ConeGeometry(4, 2, 4)
  const roofMaterial = new THREE.MeshStandardMaterial({ color: color * 0.8 })
  const roof = new THREE.Mesh(roofGeometry, roofMaterial)
  roof.position.copy(position)
  roof.position.y = height + 1
  roof.rotation.y = Math.PI / 4
  scene.add(roof)
}

function createTree(position) {
  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2)
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
  trunk.position.copy(position)
  trunk.position.y = 1
  trunk.castShadow = true
  scene.add(trunk)

  const leavesGeometry = new THREE.SphereGeometry(1.5)
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 })
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial)
  leaves.position.copy(position)
  leaves.position.y = 3
  leaves.castShadow = true
  scene.add(leaves)
}

function createDino() {
  const dinoGroup = new THREE.Group()

  // 恐龙身体
  const bodyGeometry = new THREE.BoxGeometry(1.5, 1, 2)
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xfff44f })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.castShadow = true
  dinoGroup.add(body)

  // 恐龙头部
  const headGeometry = new THREE.SphereGeometry(0.6)
  const head = new THREE.Mesh(headGeometry, bodyMaterial)
  head.position.set(0, 0.5, 1.2)
  head.castShadow = true
  dinoGroup.add(head)

  // 恐龙四肢
  const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.8)
  const legPositions = [
    { pos: [-0.5, -0.5, 0.5], rot: 0 },
    { pos: [0.5, -0.5, 0.5], rot: 1 },
    { pos: [-0.5, -0.5, -0.5], rot: 2 },
    { pos: [0.5, -0.5, -0.5], rot: 3 }
  ]
  
  const legs = []
  legPositions.forEach(({ pos, rot }) => {
    const leg = new THREE.Mesh(legGeometry, bodyMaterial)
    leg.position.set(pos[0], pos[1], pos[2])
    leg.castShadow = true
    dinoGroup.add(leg)
    legs.push(leg)
    
    // 添加行走动画
    const direction = (rot % 2 === 0) ? 1 : -1
    gsap.to(leg.rotation, { 
      z: direction * 0.5, 
      duration: 0.5, 
      repeat: -1, 
      yoyo: true 
    })
  })

  // 添加小帽子
  const hatGeometry = new THREE.ConeGeometry(0.4, 0.6, 8)
  const hatMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 })
  const hat = new THREE.Mesh(hatGeometry, hatMaterial)
  hat.position.set(0, 1, 0.3)
  hat.rotation.x = -Math.PI / 2
  dinoGroup.add(hat)

  // 添加小眼睛
  const eyeGeometry = new THREE.SphereGeometry(0.08)
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
  
  const eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial)
  eye1.position.set(0.2, 0.6, 1.3)
  dinoGroup.add(eye1)
  
  const eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial)
  eye2.position.set(-0.2, 0.6, 1.3)
  dinoGroup.add(eye2)

  // 恐龙位置在地面上
  dinoGroup.position.set(0, 1, 0)
  scene.add(dinoGroup)
  dino = dinoGroup
  
  // 打印恐龙位置和场景信息
  console.log('恐龙已创建！位置：', dinoGroup.position)
  console.log('场景对象数量：', scene.children.length)
}

function createInterestPoints() {
  interestPointsData.forEach(data => {
    const geometry = new THREE.CylinderGeometry(data.radius, data.radius, 0.1)
    const material = new THREE.MeshStandardMaterial({
      color: 0xfff44f,
      transparent: true,
      opacity: 0.3,
      emissive: 0xfff44f,
      emissiveIntensity: 0.5
    })
    const point = new THREE.Mesh(geometry, material)
    point.position.copy(data.position)
    point.position.y = 0.05
    point.rotation.x = -Math.PI / 2
    point.userData = data
    point.userData.type = 'interest'
    
    scene.add(point)
    interestPoints.push(point)

    // 添加发光效果
    const glowGeometry = new THREE.RingGeometry(data.radius * 0.8, data.radius)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff44f,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.copy(data.position)
    glow.position.y = 0.1
    glow.rotation.x = -Math.PI / 2
    
    gsap.to(glow.rotation, { z: Math.PI * 2, duration: 3, repeat: -1, ease: 'none' })
    scene.add(glow)

    // 添加文字标签
    const text = createTextSprite(data.name)
    text.position.copy(data.position)
    text.position.y = 2
    scene.add(text)
  })
}

function createTextSprite(text) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(0, 0, 256, 64)
  ctx.fillStyle = '#ffffff'
  ctx.font = '20px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 128, 32)
  
  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(5, 1.25, 1)
  return sprite
}

function createCollectibles() {
  const count = 10
  const positions = []
  
  while (positions.length < count) {
    const x = (Math.random() - 0.5) * 60
    const z = (Math.random() - 0.5) * 60
    if (Math.abs(x) > 5 && Math.abs(z) > 5) {
      positions.push(new THREE.Vector3(x, 0, z))
    }
  }

  positions.forEach((pos, index) => {
    const geometry = new THREE.TorusGeometry(0.3, 0.1, 8, 16)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.5
    })
    const collectible = new THREE.Mesh(geometry, material)
    collectible.position.copy(pos)
    collectible.position.y = 0.5
    collectible.userData = { type: 'collectible', index }
    collectible.castShadow = true
    
    gsap.to(collectible.rotation, {
      y: Math.PI * 2,
      duration: 2,
      repeat: -1,
      ease: 'none'
    })
    
    gsap.to(collectible.position, {
      y: 1,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
    
    scene.add(collectible)
    collectibles.push(collectible)
  })
}

function setupControls() {
  controls = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 5
  }
}

function setupEventListeners() {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('resize', onResize)
}

function onKeyDown(event) {
  switch (event.key.toLowerCase()) {
    case 'w': controls.forward = true; break
    case 's': controls.backward = true; break
    case 'a': controls.left = true; break
    case 'd': controls.right = true; break
    case 'e': tryCollect(); break
  }
}

function onKeyUp(event) {
  switch (event.key.toLowerCase()) {
    case 'w': controls.forward = false; break
    case 's': controls.backward = false; break
    case 'a': controls.left = false; break
    case 'd': controls.right = false; break
  }
}

function onResize() {
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

function tryCollect() {
  collectibles.forEach((collectible, index) => {
    if (collectible) {
      const distance = dino.position.distanceTo(collectible.position)
      if (distance < 2) {
        scene.remove(collectible)
        collectible = null
        collectibles[index] = null
        collectedFragments.value++
        showCollectionToast(`收集到历史碎片 ${collectedFragments.value}/${totalFragments.value}`)
        
        if (collectedFragments.value >= totalFragments.value) {
          achievements.value.push('历史收集者')
          showCollectionToast('🏆 解锁成就：历史收集者！')
        }
      }
    }
  })
}

function showCollectionToast(message) {
  collectionToast.value = { show: true, message }
  setTimeout(() => {
    collectionToast.value.show = false
  }, 3000)
}

function checkInterestPoints() {
  interestPoints.forEach(point => {
    if (point && dino) {
      const distance = dino.position.distanceTo(point.position)
      if (distance < point.userData.radius + 1) {
        if (!currentInterestPoint.value || currentInterestPoint.value.id !== point.userData.id) {
          openInterestPanel(point.userData)
        }
      }
    }
  })
}

function openInterestPanel(data) {
  currentInterestPoint.value = data
}

function closePanel() {
  currentInterestPoint.value = null
}

function takePhoto() {
  const screenshot = renderer.domElement.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `成理探索-${Date.now()}.png`
  link.href = screenshot
  link.click()
  showCollectionToast('📸 照片已保存！')
}

function backToMain() {
  router.push('/')
}

function cleanup() {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('resize', onResize)
}

function animate() {
  requestAnimationFrame(animate)
  
  try {
    const delta = clock.getDelta()
    
    // 移动恐龙
    velocity.set(0, 0, 0)
    
    if (controls.forward) velocity.z -= 1
    if (controls.backward) velocity.z += 1
    if (controls.left) velocity.x -= 1
    if (controls.right) velocity.x += 1
    
    velocity.normalize()
    velocity.multiplyScalar(controls.speed * delta)
    
    if (dino) {
      dino.position.add(velocity)
      dino.position.x = Math.max(-35, Math.min(35, dino.position.x))
      dino.position.z = Math.max(-35, Math.min(35, dino.position.z))
      
      if (velocity.length() > 0) {
        const lookDirection = new THREE.Vector3()
        lookDirection.copy(velocity).normalize()
        dino.lookAt(dino.position.clone().add(lookDirection))
      }
    }
    
    // 相机跟随恐龙（如果恐龙已创建）
    if (dino) {
      // 相机保持在固定位置，始终看向恐龙
      const idealOffset = new THREE.Vector3(0, 15, 20)
      const idealLookat = dino.position.clone()
      const idealPosition = idealOffset.clone().add(idealLookat)
      
      camera.position.lerp(idealPosition, 0.1)
      camera.lookAt(idealLookat)
    } else {
      // 如果恐龙还没创建，相机看向中央
      camera.lookAt(0, 0, 0)
    }
    
    checkInterestPoints()
    
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    } else {
      console.error('❌ 缺少必要对象：', { renderer: !!renderer, scene: !!scene, camera: !!camera })
    }
  } catch (error) {
    console.error('动画循环错误：', error)
  }
}
</script>

<style scoped>
#dino-explorer {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: linear-gradient(to bottom, #87ceeb 0%, #e0f6ff 100%);
}

.hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.hud-left, .hud-right {
  display: flex;
  gap: 15px;
}

.collectibles-count, .achievement-badge {
  background: rgba(255, 215, 0, 0.2);
  padding: 10px 20px;
  border-radius: 25px;
  color: #ffd700;
  font-weight: bold;
  border: 2px solid rgba(255, 215, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-name {
  color: white;
  text-align: center;
  font-size: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.photo-btn, .exit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.photo-btn {
  background: rgba(100, 149, 237, 0.3);
  color: white;
  border: 2px solid #6495ed;
}

.photo-btn:hover {
  background: rgba(100, 149, 237, 0.5);
  transform: scale(1.05);
}

.exit-btn {
  background: rgba(220, 20, 60, 0.3);
  color: white;
  border: 2px solid #dc143c;
}

.exit-btn:hover {
  background: rgba(220, 20, 60, 0.5);
  transform: scale(1.05);
}

.controls-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 40px;
  border-radius: 20px;
  z-index: 2000;
  text-align: center;
  min-width: 400px;
  box-shadow: 0 8px 32px rgba(255, 244, 79, 0.3);
  border: 2px solid #fff44f;
}

.controls-hint h3 {
  color: #fff44f;
  margin-bottom: 20px;
  font-size: 24px;
}

.controls-hint p {
  margin: 10px 0;
  font-size: 16px;
}

.start-btn {
  margin-top: 20px;
  padding: 15px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.start-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.interest-panel {
  position: absolute;
  top: 100px;
  right: 30px;
  background: rgba(0, 0, 0, 0.9);
  padding: 30px;
  border-radius: 20px;
  max-width: 400px;
  z-index: 1500;
  animation: slideIn 0.5s ease-out;
  border: 2px solid #fff44f;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.close-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 30px;
  height: 30px;
}

.interest-icon {
  font-size: 60px;
  text-align: center;
  margin-bottom: 20px;
}

.panel-content h3 {
  color: #fff44f;
  margin-bottom: 10px;
  font-size: 24px;
}

.panel-content p {
  color: #cccccc;
  margin-bottom: 15px;
  line-height: 1.6;
}

.interest-details ul {
  list-style: none;
  padding: 0;
}

.interest-details li {
  color: #cccccc;
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
}

.interest-details li:before {
  content: '▶';
  position: absolute;
  left: 0;
  color: #fff44f;
}

.collection-toast {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 215, 0, 0.9);
  color: #000;
  padding: 15px 30px;
  border-radius: 25px;
  font-weight: bold;
  z-index: 2000;
  animation: toastPop 0.5s ease-out;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
}

@keyframes toastPop {
  from {
    transform: translateX(-50%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}
</style>

