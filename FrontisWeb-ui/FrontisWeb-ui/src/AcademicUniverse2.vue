<template>
  <div id="academic-universe" ref="container">
    <div v-if="isLoadingData" class="data-status-overlay">
      <p>正在加载学术星图数据…</p>
    </div>
    <div v-else-if="loadError" class="data-status-overlay warning">
      <p>{{ loadError }}</p>
    </div>
    <!-- 时间轴 -->
    <div class="time-control-panel">
      <!-- 自转控制 -->
      <div class="rotation-controls">
        <button @click="toggleRotation" class="rotation-btn">
          {{ isRotating ? '⏹️' : '🔄' }} {{ isRotating ? '停止自转' : '开始自转' }}
        </button>
        <div class="speed-control" v-if="isRotating">
          <span>速度:</span>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            :value="rotationSpeed"
            @input="rotationSpeed = parseFloat($event.target.value)"
            class="speed-slider"
          />
          <span>{{ (rotationSpeed * (1 / 0.3)).toFixed(1) }}x</span>
        </div>
      </div>

      <!-- 视觉效果控制 -->
      <div class="visual-controls">
        <button @click="toggleEffects" class="effects-btn">
          {{ showEffects ? '🌌 隐藏效果' : '✨ 显示效果' }}
        </button>
        <button @click="toggleBackground" class="background-btn">
          {{ showBackground ? '🌙 暗色背景' : '☀️ 亮色背景' }}
        </button>
      </div>
    </div>

    <!-- 右侧信息面板 -->
    <div class="info-panel" v-if="selectedNode">
      <button class="close-btn" @click="closePanel">×</button>
      <div class="node-info">
        <h2>{{ selectedNode.name }}</h2>
        <p class="title">{{ selectedNode.title }}</p>
        <div class="description">{{ selectedNode.description }}</div>

        <!-- 专业列表 -->
        <div
          class="majors"
          v-if="selectedNode.majors && selectedNode.majors.length"
        >
          <h3>开设专业</h3>
          <ul class="major-list">
            <li v-for="m in selectedNode.majors" :key="m.id || m.name">
              <span class="major-name">{{ m.name }}</span>
              <span class="major-level" v-if="m.level">（{{ m.level }}）</span>
            </li>
          </ul>
        </div>

        <div class="relations" v-if="selectedNode.relations">
          <h3>重要关联</h3>
          <div
            v-for="rel in selectedNode.relations"
            :key="rel.target"
            class="relation-item"
          >
            <span class="relation-type">{{ rel.type }}</span>
            <span class="relation-target">{{ rel.target }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 全屏 / 返回 -->
    <div class="vr-controls">
      <router-link to="/" class="back-btn">← 返回首页</router-link>
      <button @click="toggleFullscreen" class="vr-btn">
        {{ isFullscreen ? '⤓ 退出全屏' : '⛶ 全屏显示' }}
      </button>
    </div>

    <!-- 导航提示 -->
    <div class="navigation-hint">
      <p>🖱️ 拖动查看</p>
      <p>🔍 滚轮缩放</p>
      <p>⭐ 点击节点查看详情</p>
    </div>

    <!-- 星空标题 -->
    <div class="universe-title">
      <h1>学术星空</h1>
      <p>成都理工大学学术传承与发展</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { gsap } from 'gsap'
const resolveApiBase = () => {
  const raw = (import.meta.env.VITE_API_BASE_URL || '').trim()
  if (raw) {
    return raw.replace(/\/+$/, '')
  }
  if (import.meta.env.DEV) {
    return ''
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
}
const API_BASE_URL = resolveApiBase()
const UNIVERSE_API_ENDPOINT = `${API_BASE_URL}/api/academic-universe/data`

const isLoadingData = ref(true)
const loadError = ref(null)
let universeData = null

/* ------------------ 状态 ------------------ */
const container = ref(null)
const currentYear = ref(1956)
const minYear = 1956
const maxYear = 2024
const isAutoPlaying = ref(false)
const isFullscreen = ref(false)
const selectedNode = ref(null)
const isRotating = ref(true)
const rotationSpeed = ref(0.3)
const showEffects = ref(true)
const showBackground = ref(true)

// 全局定格控制
const isPaused = ref(false)
let prevStates = { autoRotate: true, isRotating: true, rotationSpeed: 0.3 }

// 聚焦前的相机状态（用于关闭时恢复）
let preFocusCameraPos = null
let preFocusTarget = null

/* ------------------ Three 基础对象 ------------------ */
let scene, camera, renderer, controls, composer
let starFar = null,
  starNear = null,
  nebulas = []
let nodes = []
let labels = []
let initialPositions = []
let driftRAF = 0
let particleSystems = []
let planets = []
let glowEffects = []

// 中央星球
let centerMesh = null
let centerSize = 0
let centerLabel = null

// 当前聚焦星球
let focusedMesh = null

// 命名小星球环的最大半径（用于把特效行星放在外圈）
let outerRingRadius = 0

// 每个学院的“专业视觉组”：粒子环 + 专业小星球
let majorVisualGroups = [] // { collegeId, collegeMesh, particleRing, majorMeshes, orbitRadius, angleOffset, majors }
let activeMajorGroup = null

/* ------------------ 参数 ------------------ */
const TONE_MAPPING_EXPOSURE = 0.8
const BLOOM_STRENGTH = 0.6
const BLOOM_RADIUS = 0.2
const BLOOM_THRESHOLD = 0.8

const NODE_SIZE_SCALE = 10
const LABEL_SIZE_SCALE = 1.5
const SMALL_BODY_SCALE = 1.7

/* ------------------ 生命周期 ------------------ */
onMounted(async () => {
  await loadUniverseData()
  if (!universeData) return
  initializeUniverseScene()
})

async function loadUniverseData () {
  isLoadingData.value = true
  loadError.value = null
  try {
    const response = await fetch(UNIVERSE_API_ENDPOINT, {
      headers: { Accept: 'application/json' }
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const payload = await response.json()
    if (payload?.success && payload?.data) {
      universeData = payload.data
      return
    }
    throw new Error(payload?.message || '未获取到学术星图数据')
  } catch (error) {
    console.error('加载学术星图数据失败', error)
    loadError.value = '无法加载学术星图数据，请检查服务器或网络连接。'
    universeData = null
  } finally {
    isLoadingData.value = false
  }
}

function initializeUniverseScene () {
  initScene()
  createBackground()
  createUniverse()
  createParticleEffects()
  createPlanetarySystem()
  fitView(2.6)
  setupEventListeners()
  // 初始化全屏状态
  handleFullscreenChange()
  animate()
}
onUnmounted(() => cleanup())

/* ------------------ 场景/后期/控制器 ------------------ */
function initScene () {
  const { clientWidth: w, clientHeight: h } = container.value
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x030a14)
  scene.fog = new THREE.FogExp2(0x030a14, 0.0012)

  camera = new THREE.PerspectiveCamera(60, w / h, 0.01, 8000)
  camera.position.set(0, 50, 120)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE
  container.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.minDistance = 8
  controls.maxDistance = 2000
  controls.zoomSpeed = 1.2
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.35
  // 限制垂直旋转角度，防止越过极点导致翻转
  controls.minPolarAngle = 0.2 // 限制俯视角度，防止完全俯视导致翻转
  controls.maxPolarAngle = Math.PI - 0.2 // 限制仰视角度，防止完全仰视导致翻转

  // 灯光
  const amb = new THREE.AmbientLight(0xffffff, 0.4)
  const key = new THREE.DirectionalLight(0x9fd0ff, 1.2)
  key.position.set(300, 400, 200)
  const rim = new THREE.DirectionalLight(0xffa070, 0.8)
  rim.position.set(-250, 200, -350)
  const fill = new THREE.DirectionalLight(0x4a7bff, 0.5)
  fill.position.set(150, 100, 300)
  scene.add(amb, key, rim, fill)

  const pointLight = new THREE.PointLight(0xffaa00, 1.5, 1000)
  pointLight.position.set(0, 0, 0)
  scene.add(pointLight)

  // 后期
  composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  const fxaa = new ShaderPass(FXAAShader)
  fxaa.material.uniforms['resolution'].value.set(1 / w, 1 / h)
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(w, h),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD
  )
  composer.addPass(renderPass)
  composer.addPass(fxaa)
  composer.addPass(bloom)

  startDrift()
}

/* ------------------ 背景星空 ------------------ */
function createBackground () {
  const makeStars = (count, spread, size, opacity, hue = 0.58) => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread
      const c = new THREE.Color().setHSL(
        hue + Math.random() * 0.12,
        0.5,
        0.6 + Math.random() * 0.35
      )
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const m = new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    return new THREE.Points(g, m)
  }
  starFar = makeStars(90000, 12000, 0.9, 0.6)
  starNear = makeStars(30000, 6500, 1.8, 0.9)
  scene.add(starFar, starNear)

  const makeNebula = (size, color, opacity, pos, euler) => {
    const cvs = document.createElement('canvas')
    cvs.width = 1024
    cvs.height = 1024
    const ctx = cvs.getContext('2d')
    const grd = ctx.createRadialGradient(512, 512, 80, 512, 512, 520)
    grd.addColorStop(0, color)
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 1024, 1024)
    const tex = new THREE.CanvasTexture(cvs)
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    const geo = new THREE.PlaneGeometry(size, size)
    const m = new THREE.Mesh(geo, mat)
    m.position.copy(pos)
    m.rotation.set(euler.x, euler.y, euler.z)
    m.renderOrder = -2
    scene.add(m)
    nebulas.push(m)
  }
  const S = 2800
  makeNebula(
    3000,
    'rgba(0,201,255,0.18)',
    0.5,
    new THREE.Vector3(S * 0.1, -S * 0.2, -S * 0.2),
    new THREE.Euler(-0.3, 0.2, 0)
  )
  makeNebula(
    2400,
    'rgba(184,107,255,0.16)',
    0.45,
    new THREE.Vector3(-S * 0.22, S * 0.15, -S * 0.25),
    new THREE.Euler(0.25, -0.1, 0.1)
  )
  makeNebula(
    2000,
    'rgba(255,90,121,0.14)',
    0.42,
    new THREE.Vector3(0, S * 0.18, S * 0.1),
    new THREE.Euler(-0.15, 0.25, -0.1)
  )
  makeNebula(
    1800,
    'rgba(0,255,180,0.12)',
    0.4,
    new THREE.Vector3(S * 0.3, S * 0.1, -S * 0.1),
    new THREE.Euler(0.1, -0.2, 0.3)
  )
  makeNebula(
    2200,
    'rgba(255,200,0,0.1)',
    0.35,
    new THREE.Vector3(-S * 0.1, -S * 0.25, S * 0.2),
    new THREE.Euler(-0.2, 0.1, -0.2)
  )
}

/* ------------------ 背景粒子带 ------------------ */
function createParticleEffects () {
  const particleCount = 600
  const particles = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const rotations = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const distanceFromCenter = centerSize * (1.5 + Math.random() * 8)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)

    positions[i3] = distanceFromCenter * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = distanceFromCenter * Math.sin(phi) * Math.sin(theta) * 0.5
    positions[i3 + 2] = distanceFromCenter * Math.cos(phi)

    const color = new THREE.Color()
    if (Math.random() > 0.5) color.setHSL(0.6, 0.8, 0.7 + Math.random() * 0.3)
    else color.setHSL(0.12, 0.8, 0.6 + Math.random() * 0.4)

    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    sizes[i] = 0.5 + Math.random() * 1.5

    const distanceFactor = 1 - Math.min(1, distanceFromCenter / (centerSize * 8))
    rotations[i] = 0.002 + distanceFactor * 0.008
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  particles.setAttribute('rotationSpeed', new THREE.BufferAttribute(rotations, 1))

  const particleMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  const particleSystem = new THREE.Points(particles, particleMaterial)
  particleSystem.userData.particleData = { positions, rotations }
  scene.add(particleSystem)
  particleSystems.push(particleSystem)
}

/* ------------------ 行星系统（未命名特效星球） ------------------ */
function createPlanetarySystem () {
  const planetCount = 4
  const baseOrbit =
    outerRingRadius > 0 ? outerRingRadius + centerSize * 1.6 : centerSize * 6

  for (let i = 0; i < planetCount; i++) {
    const planetSize =
      centerSize * (0.15 + Math.random() * 0.1) * SMALL_BODY_SCALE
    let distance = baseOrbit + i * centerSize * 0.8
    if (i === 1) distance += centerSize * 1.5 // 稍微往外推一点
    const speed = 0.5 + Math.random() * 0.5

    const geometry = new THREE.SphereGeometry(planetSize, 32, 32)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
      metalness: 0.3,
      roughness: 0.4,
      emissive: new THREE.Color().setHSL(Math.random(), 0.5, 0.2),
      emissiveIntensity: 0.2
    })

    const planet = new THREE.Mesh(geometry, material)
    const angle = (i / planetCount) * Math.PI * 2
    planet.position.set(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * distance * 0.3,
      Math.sin(angle) * distance
    )

    scene.add(planet)
    planets.push({ mesh: planet, distance, angle, speed })

    // ⭐ 已按你的要求删除“白色小卫星”，不再调用 createSatellite
    if (Math.random() > 0.5) createPlanetRings(planet, planetSize)
  }
}

function createPlanetRings (planet, planetSize) {
  const ringCanvas = document.createElement('canvas')
  ringCanvas.width = 512
  ringCanvas.height = 48
  const rctx = ringCanvas.getContext('2d')
  const grd = rctx.createLinearGradient(0, 0, 512, 0)
  grd.addColorStop(0, 'rgba(255,170,0,0)')
  grd.addColorStop(0.5, 'rgba(255,220,150,0.9)')
  grd.addColorStop(1, 'rgba(255,170,0,0)')
  rctx.fillStyle = grd
  rctx.fillRect(0, 0, 512, 48)
  const tex = new THREE.CanvasTexture(ringCanvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 1)

  const radius = planetSize * 2.0
  const tube = planetSize * 0.35
  const geo = new THREE.TorusGeometry(radius, tube, 18, 96)
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    color: new THREE.Color(0xffd08a),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const ring = new THREE.Mesh(geo, mat)
  ring.rotation.x = Math.PI / 2.4
  planet.add(ring)

  gsap.to(ring.rotation, {
    z: ring.rotation.z + Math.PI * 2,
    duration: 26,
    repeat: -1,
    ease: 'none'
  })
}

function createNodeRing (mesh, size, color) {
  const ringRadius = size * 1.6
  const ringTube = size * 0.11
  const ringGeo = new THREE.TorusGeometry(ringRadius, ringTube, 14, 64)
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = Math.PI / 2.3 + (Math.random() - 0.5) * 0.4
  ring.rotation.z = (Math.random() - 0.5) * 0.6
  mesh.add(ring)
}

/* ------------------ 大学星球 + 学院节点 ------------------ */
function createUniverse () {
  if (!universeData || !universeData.university) {
    console.warn('学术星图数据为空，无法创建场景。')
    return
  }
  const vh = container.value.clientHeight
  // 强制设置中心恒星为更大的固定值
  const baseSize = Math.max(
    120,  // 增大中心星球尺寸
    Math.floor(vh / 12)
  )
  centerSize = baseSize

  const uniG = new THREE.SphereGeometry(baseSize, 64, 64)
  const uniM = new THREE.MeshPhysicalMaterial({
    color: 0xffa640,
    emissive: 0x7f5a1a,
    emissiveIntensity: 0.5,
    metalness: 0.35,
    roughness: 0.25,
    clearcoat: 0.95,
    clearcoatRoughness: 0.12,
    sheen: 0.6,
    sheenRoughness: 0.5
  })
  const universityMesh = new THREE.Mesh(uniG, uniM)
  universityMesh.userData = {
    type: 'university',
    id: universeData.university.id,
    name: '成都理工大学'
  }
  scene.add(universityMesh)
  centerMesh = universityMesh

  createGlowEffect(universityMesh, baseSize * 1.1, 0xffaa00, 0.3)

  const atmG = new THREE.SphereGeometry(baseSize * 1.05, 48, 48)
  const atmM = new THREE.MeshBasicMaterial({
    color: 0xffa855,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  scene.add(new THREE.Mesh(atmG, atmM))

  const rimG = new THREE.SphereGeometry(baseSize * 1.06, 48, 48)
  const rimM = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(0xffd499) } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main(){
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position,1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }`,
    fragmentShader: `
      uniform vec3 color;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main(){
        vec3 V = normalize(cameraPosition - vWorldPos);
        float fres = pow(1.0 - max(dot(vNormal, V), 0.0), 3.0);
        gl_FragColor = vec4(color, fres * 0.6);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  scene.add(new THREE.Mesh(rimG, rimM))

  const makeRing3D = (
    R,
    tube,
    color,
    tilt = [Math.PI / 2.4, 0, 0],
    speed = 24
  ) => {
    const ringCanvas = document.createElement('canvas')
    ringCanvas.width = 1024
    ringCanvas.height = 64
    const rctx = ringCanvas.getContext('2d')
    const grd = rctx.createLinearGradient(0, 0, 1024, 0)
    grd.addColorStop(0, 'rgba(255,170,0,0)')
    grd.addColorStop(0.5, 'rgba(255,170,0,0.9)')
    grd.addColorStop(1, 'rgba(255,170,0,0)')
    rctx.fillStyle = grd
    rctx.fillRect(0, 0, 1024, 64)
    const tex = new THREE.CanvasTexture(ringCanvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(2, 1)

    const g = new THREE.TorusGeometry(R, tube, 24, 256)
    const m = new THREE.MeshBasicMaterial({
      map: tex,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const ring = new THREE.Mesh(g, m)
    ring.rotation.set(tilt[0], tilt[1], tilt[2])
    scene.add(ring)
    gsap.to(ring.rotation, {
      z: ring.rotation.z + Math.PI * 2,
      duration: speed,
      repeat: -1,
      ease: 'none'
    })
  }
  makeRing3D(
    centerSize * 1.9,
    centerSize * 0.12,
    '#ff9a1a',
    [Math.PI / 2.25, 0.2, 0.0],
    30
  )
  makeRing3D(
    centerSize * 1.45,
    centerSize * 0.1,
    '#ffc36a',
    [Math.PI / 2.0, -0.3, 0.6],
    24
  )

  const uniLabelColor = new THREE.Color(0xffa640)
  centerLabel = makeNameLabel('成都理工大学', uniLabelColor, 2.0)
  centerLabel.position.set(
    centerMesh.position.x,
    centerMesh.position.y + centerSize * 1.5,
    centerMesh.position.z
  )
  centerLabel.userData.baseScale = centerLabel.scale.clone()
  scene.add(centerLabel)

  const DATA_SCALE = centerSize / 4.0
  universeData.people.forEach(person => {
    const size = person.size * NODE_SIZE_SCALE * SMALL_BODY_SCALE
    const style = person.style || {}
    const color = new THREE.Color(person.color)

    let geo
    if (style.shape === 'sphere') geo = new THREE.SphereGeometry(size, 32, 28)
    else if (style.shape === 'hex') geo = new THREE.DodecahedronGeometry(size, 0)
    else if (style.shape === 'diamond') geo = new THREE.OctahedronGeometry(size, 0)
    else if (style.shape === 'triangle') geo = new THREE.TetrahedronGeometry(size, 0)
    else {
      switch (person.type) {
        case 'gem':
          geo = new THREE.OctahedronGeometry(size, 1)
          break
        case 'mountain':
          geo = new THREE.ConeGeometry(size, size * 1.6, 10)
          break
        default:
          geo = new THREE.IcosahedronGeometry(size, 1)
      }
    }

    const glowLevel =
      typeof style.glow === 'number'
        ? THREE.MathUtils.clamp(style.glow, 0, 1.2)
        : 0.6
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.35,
      roughness: 0.55 - glowLevel * 0.15,
      clearcoat: 0.35,
      clearcoatRoughness: 0.18,
      emissive: color.clone(),
      emissiveIntensity: 0.18 + glowLevel * 0.35
    })

    const mesh = new THREE.Mesh(geo, mat)

    let p = new THREE.Vector3(
      person.position.x * DATA_SCALE,
      person.position.y * DATA_SCALE,
      person.position.z * DATA_SCALE
    )

    const radialXZ = Math.sqrt(p.x * p.x + p.z * p.z)
    if (radialXZ > 0) {
      const extra = centerSize * 0.8
      const targetRadius = radialXZ + extra
      const scale = targetRadius / radialXZ
      p.x *= scale
      p.z *= scale
    }

    // 简单防碰撞
    const minGap = size * 3.0
    nodes.forEach(other => {
      const offset = p.clone().sub(other.position)
      const horiz = new THREE.Vector3(offset.x, 0, offset.z)
      const dist = horiz.length()
      if (dist > 0 && dist < minGap) {
        const push = horiz.normalize().multiplyScalar(minGap - dist)
        p.add(push)
      }
    })

    mesh.position.copy(p)

    mesh.userData = { ...person, meshType: 'person', scaledSize: size }
    scene.add(mesh)
    nodes.push(mesh)

    const radius = Math.sqrt(p.x * p.x + p.z * p.z)
    const angle = Math.atan2(p.z, p.x)
    initialPositions.push({ x: p.x, y: p.y, z: p.z, radius, angle })
    outerRingRadius = Math.max(outerRingRadius, radius)

    const haloSize = size * (1.15 + glowLevel * 0.3)
    const haloIntensity = 0.12 + glowLevel * 0.36
    createGlowEffect(mesh, haloSize, person.color, haloIntensity)

    if (style.ring) createNodeRing(mesh, size * 1.15, person.color)

    const label = makeNameLabel(person.name, color, LABEL_SIZE_SCALE)
    label.position.set(p.x, p.y + size * 2 + 4, p.z)
    label.userData.baseScale = label.scale.clone()
    labels.push(label)
    scene.add(label)

    // ⭐ 有 majors 的学院才创建“专业粒子环”
    if (Array.isArray(person.majors) && person.majors.length > 0) {
      const group = createMajorVisualGroup(mesh, person, size)
      majorVisualGroups.push(group)
    }
  })
}

/* ------------------ 专业粒子 & 专业星球 ------------------ */
function createMajorVisualGroup (collegeMesh, personData, size) {
  const color = new THREE.Color(personData.color || 0xffffff)
  const majors = personData.majors || []
  const orbitRadius = (collegeMesh.userData.scaledSize || size) * 2.4
  const particleRing = createMajorParticleRing(
    collegeMesh,
    orbitRadius,
    color,
    size,
    majors.length
  )

  return {
    collegeId: personData.id,
    collegeMesh,
    particleRing,
    majorMeshes: [],
    orbitRadius,
    angleOffset: Math.random() * Math.PI * 2,
    majors
  }
}

function createMajorParticleRing (collegeMesh, radius, color, size, majorCount) {
  // 粒子数量整体下调，让环更干净
  const count = Math.max(majorCount * 6, 20)

  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const r = radius * (0.9 + Math.random() * 0.2)
    const yJitter = (Math.random() - 0.5) * size * 0.5

    positions[i * 3] = Math.cos(angle) * r
    positions[i * 3 + 1] = yJitter
    positions[i * 3 + 2] = Math.sin(angle) * r
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const mat = new THREE.PointsMaterial({
    // 粒子尺寸整体放大，更清晰
    size: size * 0.45,
    color,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const ring = new THREE.Points(geo, mat)
  collegeMesh.add(ring)
  return ring
}

function spawnMajorsForCollege (group) {
  const { collegeMesh, majors, orbitRadius, angleOffset } = group
  if (!majors || majors.length === 0) return

  const baseColor = collegeMesh.material.color.clone()

  majors.forEach((m, idx) => {
    const majorSize =
      (collegeMesh.userData.scaledSize || centerSize * 0.35) * 0.45
    const geo = new THREE.SphereGeometry(majorSize, 24, 24)
    const color = m.color
      ? new THREE.Color(m.color)
      : baseColor.clone().offsetHSL((idx - 1) * 0.03, 0.1, 0.05)

    const mat = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.2,
      roughness: 0.35,
      emissive: color.clone(),
      emissiveIntensity: 0.35
    })

    const mesh = new THREE.Mesh(geo, mat)
    const angle = angleOffset + (idx / majors.length) * Math.PI * 2
    const r = orbitRadius
    mesh.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r)

    // 挂到学院星球上
    collegeMesh.add(mesh)

    // 专业名字：缩小版学院标签
    const labelColor = color.clone()
    const label = makeNameLabel(
      m.name || '',
      labelColor,
      LABEL_SIZE_SCALE * 0.7
    )
    label.position.set(0, majorSize * 2 + 2, 0)
    label.userData.baseScale = label.scale.clone()
    mesh.add(label)

    const baseScale = mesh.scale.clone()
    group.majorMeshes.push({
      mesh,
      label,
      angle,
      speed: 0.8 + idx * 0.15,
      baseScale
    })
  })
}

function switchCollegeMajors (collegeId) {
  if (!collegeId) return

  if (activeMajorGroup && activeMajorGroup.collegeId !== collegeId) {
    const g = activeMajorGroup
    if (g.particleRing) g.particleRing.visible = true
    if (g.majorMeshes) {
      g.majorMeshes.forEach(m => {
        m.mesh.visible = false
      })
    }
  }

  const group = majorVisualGroups.find(g => g.collegeId === collegeId)
  if (!group) {
    activeMajorGroup = null
    return
  }

  activeMajorGroup = group

  if (group.particleRing) group.particleRing.visible = false

  if (!group.majorMeshes || group.majorMeshes.length === 0) {
    spawnMajorsForCollege(group)
  } else {
    group.majorMeshes.forEach(m => {
      m.mesh.visible = true
    })
  }

  // 放大弹出动画
  group.majorMeshes.forEach(m => {
    m.mesh.scale.set(0.01, 0.01, 0.01)
    gsap.to(m.mesh.scale, {
      x: m.baseScale.x,
      y: m.baseScale.y,
      z: m.baseScale.z,
      duration: 0.6,
      ease: 'back.out(1.7)'
    })
  })
}

function resetMajorsDisplay () {
  if (!activeMajorGroup) return
  const g = activeMajorGroup
  if (g.particleRing) g.particleRing.visible = true
  if (g.majorMeshes) {
    g.majorMeshes.forEach(m => {
      m.mesh.visible = false
    })
  }
  activeMajorGroup = null
}

/* ------------------ 发光效果 ------------------ */
function createGlowEffect (mesh, size, color, intensity) {
  const glowGeometry = new THREE.SphereGeometry(size, 32, 32)
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      viewVector: {
        value: camera ? camera.position : new THREE.Vector3(0, 0, 1)
      },
      glowColor: { value: new THREE.Color(color) },
      intensityFactor: { value: intensity }
    },
    vertexShader: `
      uniform vec3 viewVector;
      uniform float intensityFactor;
      varying float vIntensity;
      void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * viewVector);
        vIntensity = pow(1.0 - dot(vNormal, vNormel), 2.0) * intensityFactor;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying float vIntensity;
      void main() {
        vec3 glow = glowColor * vIntensity;
        gl_FragColor = vec4(glow, vIntensity);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  })

  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  glow.scale.multiplyScalar(1.1)
  mesh.add(glow)
  glowEffects.push(glow)
}

/* ------------------ 贴近视图 ------------------ */
function fitView (mult = 2.6) {
  if (!centerMesh) return
  const d = centerSize * mult
  const t = centerMesh.position
  controls.minDistance = Math.max(centerSize * 0.7, 6)
  gsap.to(controls.target, {
    x: t.x,
    y: t.y,
    z: t.z,
    duration: 0.6,
    ease: 'power2.out'
  })
  gsap.to(camera.position, {
    x: t.x + d * 0.75,
    y: t.y + d * 0.55,
    z: t.z + d,
    duration: 0.6,
    ease: 'power2.out'
  })
}

/* ------------------ 标签 ------------------ */
function makeNameLabel (text, color, scaleMul = 1) {
  const cvs = document.createElement('canvas')
  cvs.width = 768
  cvs.height = 192
  const ctx = cvs.getContext('2d')
  ctx.strokeStyle = color.getStyle()
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.9
  roundRect(ctx, 10, 40, 748, 112, 20, false, true)
  ctx.shadowColor = 'rgba(255,255,255,0.35)'
  ctx.shadowBlur = 10
  ctx.fillStyle = '#eef5ff'
  ctx.font = '600 56px "Segoe UI", Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const max = 16
  const t =
    (text || '').length > max ? text.substring(0, max) + '…' : text || ''
  ctx.fillText(t, 384, 96)
  const tex = new THREE.CanvasTexture(cvs)
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    opacity: 0.92,
    depthWrite: false
  })
  const spr = new THREE.Sprite(mat)
  spr.scale.set(28 * scaleMul, 7 * scaleMul, 1)
  return spr
}
function roundRect (ctx, x, y, w, h, r, fill, stroke) {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  if (fill) ctx.fill()
  if (stroke) ctx.stroke()
}

/* ------------------ 时间轴联动 ------------------ */
function handleTimeChange (e) {
  currentYear.value = parseInt(e.target.value)
  updateUniverseForYear(currentYear.value)
}
function updateUniverseForYear (year) {
  nodes.forEach(n => {
    const start = n.userData.startYear || minYear
    const visible = year >= start
    const to = visible ? 1 : 0
    gsap.to(n.scale, {
      x: to,
      y: to,
      z: to,
      duration: 0.45,
      ease: 'power2.out'
    })
  })
}

/* ------------------ 交互：点击聚焦 ------------------ */
function selectNode (nodeData) {
  selectedNode.value = nodeData
  const mesh = nodes.find(n => n.userData.id === nodeData.id)
  if (!mesh || !centerMesh) return

  // 立即停止场景旋转
  freezeScene()

  focusedMesh = mesh
  if (!mesh.userData.origScale) mesh.userData.origScale = mesh.scale.clone()

  preFocusCameraPos = camera.position.clone()
  preFocusTarget = controls.target.clone()

  const nodePos = mesh.position.clone()

  const dirToCenter = centerMesh.position.clone().sub(nodePos).normalize()
  const centerToNodeDist = nodePos.distanceTo(centerMesh.position)

  const size =
    mesh.userData.scaledSize || (mesh.geometry.boundingSphere?.radius ?? 10)

  const minDist = Math.max(size * 8, centerSize * 1.2)
  const maxDist = centerToNodeDist * 0.9

  let desiredDist
  if (maxDist <= minDist) {
    desiredDist = maxDist * 0.6
  } else {
    desiredDist = centerToNodeDist * 0.35
    desiredDist = THREE.MathUtils.clamp(desiredDist, minDist, maxDist)
  }

  // 相机位置：从星球位置向外推一定距离
  const camOffset = new THREE.Vector3(
    nodePos.x * 0.3,
    size * 4,
    nodePos.z * 0.3
  )
  const newCamPos = nodePos.clone().add(camOffset)

  // 控制器目标直接对准星球中心
  const newTarget = nodePos.clone()

  const tl = gsap.timeline({ defaults: { duration: 1.0, ease: 'power2.out' } })
  tl.to(controls.target, { x: newTarget.x, y: newTarget.y, z: newTarget.z }, 0)
    .to(
      camera.position,
      { x: newCamPos.x, y: newCamPos.y, z: newCamPos.z },
      0
    )
    .to(
      mesh.scale,
      {
        x: mesh.userData.origScale.x * 1.6,
        y: mesh.userData.origScale.y * 1.6,
        z: mesh.userData.origScale.z * 1.6
      },
      0
    )
    .add(() => {
      if (Array.isArray(nodeData.majors) && nodeData.majors.length) {
        switchCollegeMajors(nodeData.id)
      } else {
        resetMajorsDisplay()
      }
    })
}

function closePanel () {
  selectedNode.value = null

  if (focusedMesh && focusedMesh.userData?.origScale) {
    gsap.to(focusedMesh.scale, {
      x: focusedMesh.userData.origScale.x,
      y: focusedMesh.userData.origScale.y,
      z: focusedMesh.userData.origScale.z,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  if (preFocusCameraPos && preFocusTarget) {
    const tl = gsap.timeline({ defaults: { duration: 0.9, ease: 'power2.out' } })
    tl.to(
      controls.target,
      {
        x: preFocusTarget.x,
        y: preFocusTarget.y,
        z: preFocusTarget.z
      },
      0
    ).to(
      camera.position,
      {
        x: preFocusCameraPos.x,
        y: preFocusCameraPos.y,
        z: preFocusCameraPos.z
      },
      0
    )
  }

  resetMajorsDisplay()
  focusedMesh = null
  resumeScene()
}

/* ------------------ 自动播放 ------------------ */
function toggleAutoPlay () {
  isAutoPlaying.value = !isAutoPlaying.value
  if (isAutoPlaying.value) startAutoPlay()
}
function startAutoPlay () {
  const tick = () => {
    if (!isAutoPlaying.value) return
    const next =
      currentYear.value < maxYear ? currentYear.value + 1 : minYear
    currentYear.value = next
    updateUniverseForYear(next)
    setTimeout(tick, 300)
  }
  tick()
}
function stopAutoPlay () {
  isAutoPlaying.value = false
}

/* ------------------ 其他按钮 ------------------ */
function toggleFullscreen () {
  if (!document.fullscreenElement) {
    // 进入全屏
    const element = container.value
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

// 监听全屏状态变化
function handleFullscreenChange () {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  )
}

function toggleRotation () {
  isRotating.value = !isRotating.value
  if (controls && !isPaused.value) {
    controls.autoRotate = isRotating.value
  }
}

function toggleEffects () {
  showEffects.value = !showEffects.value
  const visible = showEffects.value

  if (starFar) starFar.visible = visible
  if (starNear) starNear.visible = visible
  nebulas.forEach(n => {
    n.visible = visible
  })
  particleSystems.forEach(p => {
    p.visible = visible
  })

  planets.forEach(p => {
    if (p.mesh) p.mesh.visible = visible
  })
}

function toggleBackground () {
  showBackground.value = !showBackground.value
  if (!scene || !scene.fog) return
  if (showBackground.value) {
    scene.background = new THREE.Color(0x030a14)
    scene.fog.density = 0.0012
  } else {
    scene.background = new THREE.Color(0x000000)
    scene.fog.density = 0.0005
  }
}

/* ------------------ 窗口/渲染 ------------------ */
function setupEventListeners () {
  window.addEventListener('resize', onResize)
  renderer.domElement.addEventListener('click', onClick)
  // 监听全屏状态变化
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
}
function onResize () {
  const { clientWidth: w, clientHeight: h } = container.value
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
  composer.setSize(w, h)
  const fxaa = composer.passes.find(p => p.material?.uniforms?.resolution)
  if (fxaa) fxaa.material.uniforms['resolution'].value.set(1 / w, 1 / h)
  fitView(2.8)
}
function onClick (e) {
  const rect = renderer.domElement.getBoundingClientRect()
  const mouse = new THREE.Vector2(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    -((e.clientY - rect.top) / rect.height) * 2 + 1
  )
  const ray = new THREE.Raycaster()
  ray.setFromCamera(mouse, camera)
  const hit = ray.intersectObjects(nodes, false)
  if (hit.length) {
    const o = hit[0].object
    if (o.userData.meshType === 'person') {
      selectNode(o.userData)
    }
  }
}
function animate () {
  requestAnimationFrame(animate)

  if (isPaused.value) {
    controls.update()
    composer.render()
    return
  }

  if (isRotating.value) {
    nodes.forEach((node, index) => {
      if (initialPositions[index]) {
        const initial = initialPositions[index]
        const newAngle = initial.angle + rotationSpeed.value * 0.01
        initialPositions[index].angle = newAngle
        const newX = initial.radius * Math.cos(newAngle)
        const newZ = initial.radius * Math.sin(newAngle)
        node.position.set(newX, initial.y, newZ)

        if (labels[index]) {
          const offsetY = initial.y + node.userData.scaledSize * 2 + 4
          labels[index].position.set(newX, offsetY, newZ)
        }
      }
    })
  }

  particleSystems.forEach(system => {
    if (system.userData.particleData) {
      const positions = system.userData.particleData.positions
      const rotations = system.userData.particleData.rotations
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const z = positions[i3 + 2]
        const distance = Math.sqrt(x * x + z * z)
        if (distance < centerSize * 5) {
          const angle = Math.atan2(z, x)
          const newAngle = angle + rotations[i]
          positions[i3] = distance * Math.cos(newAngle)
          positions[i3 + 2] = distance * Math.sin(newAngle)
        }
      }
      system.geometry.attributes.position.needsUpdate = true
    }
    system.rotation.y += 0.0002
  })

  // 学院的专业粒子环旋转 + 专业星球绕学院转动
  majorVisualGroups.forEach(group => {
    if (group.particleRing) {
      group.particleRing.rotation.y += 0.002
    }
    if (group.majorMeshes && group.majorMeshes.length) {
      group.majorMeshes.forEach(m => {
        if (!m.mesh.visible) return
        m.angle += 0.003 * m.speed
        const r = group.orbitRadius
        m.mesh.position.set(Math.cos(m.angle) * r, 0, Math.sin(m.angle) * r)
      })
    }
  })

  planets.forEach(planet => {
    planet.angle += 0.001 * planet.speed
    planet.mesh.position.x = Math.cos(planet.angle) * planet.distance
    planet.mesh.position.z = Math.sin(planet.angle) * planet.distance
  })

  nebulas.forEach((nebula, index) => {
    const time = Date.now() * 0.0001
    nebula.rotation.y = Math.sin(time + index) * 0.1
    nebulas[index].rotation.x = Math.cos(time + index) * 0.05
  })

  for (const spr of labels) {
    const dist = camera.position.distanceTo(spr.position)
    const k = THREE.MathUtils.clamp(dist / (centerSize * 1.2), 0.7, 2.2)
    const b = spr.userData.baseScale || spr.scale
    spr.scale.set(b.x * k, b.y * k, 1)
  }
  if (centerLabel && centerMesh) {
    const dist = camera.position.distanceTo(centerLabel.position)
    const k = THREE.MathUtils.clamp(dist / (centerSize * 1.2), 0.7, 2.2)
    const b = centerLabel.userData.baseScale || centerLabel.scale
    centerLabel.scale.set(b.x * k, b.y * k, 1)
  }

  glowEffects.forEach(glow => {
    if (glow.material?.uniforms?.viewVector) {
      glow.material.uniforms.viewVector.value = camera.position
    }
  })

  controls.update()
  composer.render()
}

/* ------------------ 清理 ------------------ */
function cleanup () {
  stopAutoPlay()
  window.removeEventListener('resize', onResize)
  // 移除全屏状态监听器
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
  renderer?.dispose?.()
  stopDrift()
}

/* ------------------ 可控漂移 & 定格/恢复 ------------------ */
function startDrift () {
  if (driftRAF) return
  const drift = () => {
    camera.position.x += Math.sin(Date.now() * 0.00022) * 0.02
    camera.position.y += Math.cos(Date.now() * 0.00018) * 0.015
    driftRAF = requestAnimationFrame(drift)
  }
  driftRAF = requestAnimationFrame(drift)
}
function stopDrift () {
  if (driftRAF) {
    cancelAnimationFrame(driftRAF)
    driftRAF = 0
  }
}

function freezeScene () {
  if (isPaused.value) return
  prevStates = {
    autoRotate: controls?.autoRotate ?? true,
    isRotating: isRotating.value,
    rotationSpeed: rotationSpeed.value
  }
  isPaused.value = true
  isAutoPlaying.value = false

  isRotating.value = false
  if (controls) {
    controls.autoRotate = false
    controls.enableRotate = true
    controls.enableZoom = true
    controls.enablePan = true
  }
  stopDrift()
}

function resumeScene () {
  if (!isPaused.value) return
  isPaused.value = false
  isRotating.value = prevStates.isRotating
  rotationSpeed.value = prevStates.rotationSpeed
  if (controls) {
    controls.autoRotate = prevStates.autoRotate
    controls.enableRotate = true
    controls.enableZoom = true
    controls.enablePan = true
  }
  startDrift()
}
</script>

<style scoped>
#academic-universe {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background:
    radial-gradient(1400px 1000px at 70% 12%, rgba(26,46,100,0.28), transparent 70%),
    radial-gradient(1400px 900px at 20% 85%, rgba(14,32,70,0.22), transparent 70%),
    linear-gradient(180deg,#020611 0%,#07132b 100%);
}

/* 时间轴 */
.time-control-panel {
  position: absolute;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 100;
  padding: 16px 28px;
  border-radius: 50px;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0,201,255,0.35);
  box-shadow: 0 8px 28px rgba(0,201,255,0.2);
}
.time-display {
  font-size: 24px;
  font-weight: 800;
  min-width: 80px;
  text-align: center;
  color: #72e4ff;
  text-shadow: 0 0 10px rgba(114,228,255,0.6);
}
.time-slider {
  width: 420px;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(90deg, rgba(0,201,255,0.18), rgba(184,107,255,0.18));
  outline: none;
  appearance: none;
  border: 1px solid rgba(255,255,255,0.12);
}
.time-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #00C9FF, #B86BFF);
  box-shadow: 0 0 12px rgba(0,201,255,0.45);
}
.play-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #00C9FF;
  background: rgba(0,201,255,0.18);
  color: #72e4ff;
  font-size: 22px;
  font-weight: 800;
  cursor: pointer;
  transition: all .25s;
}
.play-btn:hover {
  transform: scale(1.06);
  background: rgba(0,201,255,0.28);
  box-shadow: 0 0 18px rgba(0,201,255,0.35);
}

/* 自转控制 */
.rotation-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 10px;
  padding-left: 15px;
  border-left: 1px solid rgba(255,255,255,0.2);
}
.rotation-btn {
  padding: 10px 16px;
  border-radius: 30px;
  font-weight: 800;
  cursor: pointer;
  transition: all .25s;
  background: rgba(100, 200, 100, 0.2);
  border: 2px solid #4CAF50;
  color: #4CAF50;
  white-space: nowrap;
}
.rotation-btn:hover {
  background: rgba(100, 200, 100, 0.35);
  transform: scale(1.04);
  box-shadow: 0 0 18px #4CAF50;
}
.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #72e4ff;
  font-size: 14px;
}
.speed-slider {
  width: 80px;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, rgba(76,175,80,0.3), rgba(76,175,80,0.6));
  outline: none;
  appearance: none;
}
.speed-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  background: #4CAF50;
  box-shadow: 0 0 8px rgba(76,175,80,0.6);
  cursor: pointer;
}

/* 视觉效果控制 */
.visual-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
  padding-left: 15px;
  border-left: 1px solid rgba(255,255,255,0.2);
}
.effects-btn,
.background-btn {
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  font-size: 12px;
  white-space: nowrap;
}
.effects-btn {
  background: rgba(184, 107, 255, 0.2);
  border: 1px solid #b86bff;
  color: #b86bff;
}
.effects-btn:hover {
  background: rgba(184, 107, 255, 0.35);
  transform: scale(1.04);
  box-shadow: 0 0 12px rgba(184, 107, 255, 0.4);
}
.background-btn {
  background: rgba(255, 170, 0, 0.2);
  border: 1px solid #ffaa00;
  color: #ffaa00;
}
.background-btn:hover {
  background: rgba(255, 170, 0, 0.35);
  transform: scale(1.04);
  box-shadow: 0 0 12px rgba(255, 170, 0, 0.4);
}

/* 信息侧栏 */
.info-panel {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  max-width: 420px;
  max-height: 80vh;
  overflow: auto;
  z-index: 100;
  padding: 26px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
  from {
    transform: translateY(-50%) translateX(40px);
    opacity: 0;
  }
  to {
    transform: translateY(-50%) translateX(0);
    opacity: 1;
  }
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  color: #000;
  font-size: 22px;
  background: rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;
}
.close-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  transform: rotate(90deg);
}
.node-info h2 {
  color: #000;
  margin-bottom: 10px;
  font-size: 26px;
  font-weight: 700;
}
.title {
  color: #333;
  margin-bottom: 12px;
}
.description {
  color: #000;
  line-height: 1.65;
}
.relations {
  margin-top: 14px;
}
.relations h3 {
  color: #000;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}
.relation-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
}
.relation-type {
  color: #000;
  font-weight: 800;
}
.relation-target {
  color: #333;
}

/* 专业列表 */
.majors {
  margin-top: 16px;
}
.majors h3 {
  color: #000;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}
.major-list {
  margin: 0;
  padding-left: 18px;
  color: #000;
  max-height: 220px;
  overflow-y: auto;
}
.major-name {
  font-weight: 500;
}
.major-level {
  color: #666;
  font-size: 13px;
}

/* 顶部按钮 */
.vr-controls {
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  gap: 14px;
  align-items: center;
}
.back-btn,
.vr-btn {
  padding: 12px 20px;
  border-radius: 30px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s;
}
.back-btn {
  background: rgba(100, 100, 200, 0.2);
  border: 2px solid #00aaff;
  color: #00aaff;
}
.back-btn:hover {
  background: rgba(100, 100, 200, 0.35);
  transform: scale(1.04);
  box-shadow: 0 0 18px #00aaff;
}
.vr-btn {
  background: rgba(255, 170, 0, 0.2);
  border: 2px solid #ffaa00;
  color: #ffaa00;
}
.vr-btn:hover {
  background: rgba(255, 170, 0, 0.35);
  transform: scale(1.04);
  box-shadow: 0 0 18px #ffaa00;
}

/* 右上提示 */
.navigation-hint {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 100;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.8;
  background: rgba(0, 0, 0, 0.6);
  color: #72e4ff;
  border: 1px solid rgba(0, 201, 255, 0.35);
  backdrop-filter: blur(12px);
}

/* 星空标题 */
.universe-title {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 100;
  color: white;
  text-shadow: 0 0 10px rgba(114, 228, 255, 0.7);
}
.universe-title h1 {
  font-size: 36px;
  margin: 0;
  background: linear-gradient(90deg, #00C9FF, #B86BFF);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}
.universe-title p {
  margin: 5px 0 0 0;
  font-size: 16px;
  color: #b86bff;
  font-weight: 600;
}

.data-status-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 28px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffffff;
  z-index: 200;
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  text-align: center;
  letter-spacing: 0.5px;
}

.data-status-overlay.warning {
  background: rgba(255, 170, 0, 0.85);
  color: #1e1e1e;
}
</style>
