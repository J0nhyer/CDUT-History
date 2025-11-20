<template>
  <div class="history-bg-canvas">
    <!-- 旧纸纹理背景 -->
    <div class="paper-texture" :style="{ background: props.bgColor }"></div>
    <!-- Canvas 画布 -->
    <canvas ref="canvasRef" class="canvas-layer"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 可调参数配置
const props = defineProps({
  // 线条配置
  lineCount: { type: Number, default: 5 },
  lineColor: { type: String, default: 'rgba(40, 40, 40, 0.6)' },
  lineWidthMin: { type: Number, default: 2 },
  lineWidthMax: { type: Number, default: 5 },
  lineBlur: { type: Number, default: 8 },
  lineSpeed: { type: Number, default: 0.3 }, // 流动速度系数
  
  // 光束配置
  beamCount: { type: Number, default: 3 },
  beamColor: { type: String, default: '#f4e4c1' },
  beamOpacity: { type: Number, default: 0.15 },
  beamBlur: { type: Number, default: 20 },
  beamSpeed: { type: Number, default: 0.2 },
  
  // 粒子配置
  particleCount: { type: Number, default: 40 },
  particleColor: { type: String, default: 'rgba(244, 228, 193, 0.8)' },
  particleRadiusMin: { type: Number, default: 1 },
  particleRadiusMax: { type: Number, default: 3 },
  particleSpeed: { type: Number, default: 0.5 },
  
  // 背景配置
  bgColor: { type: String, default: '#0a0a0a' },
  
  // 性能配置
  fps: { type: Number, default: 30 }, // 帧率限制
})

const canvasRef = ref(null)
let ctx = null
let animationId = null
let lastTime = 0

// 线条数据
class FlowLine {
  constructor(canvas, index) {
    this.canvas = canvas
    this.index = index
    this.y = 150 + index * 180
    this.width = props.lineWidthMin + Math.random() * (props.lineWidthMax - props.lineWidthMin)
    this.opacity = 0.4 + Math.random() * 0.3
    this.offset = Math.random() * Math.PI * 2
    this.phase = Math.random() * Math.PI * 2
    this.amplitude = 30 + Math.random() * 40
    this.frequency = 0.0008 + Math.random() * 0.0004
  }
  
  update(time) {
    this.phase += props.lineSpeed * 0.001
  }
  
  draw(ctx) {
    ctx.save()
    ctx.strokeStyle = props.lineColor
    ctx.lineWidth = this.width
    ctx.globalAlpha = this.opacity
    ctx.shadowBlur = props.lineBlur
    ctx.shadowColor = props.lineColor
    ctx.globalCompositeOperation = 'multiply'
    
    ctx.beginPath()
    ctx.moveTo(0, this.y)
    
    for (let x = 0; x <= this.canvas.width; x += 10) {
      const wave = Math.sin(x * this.frequency + this.phase + this.offset) * this.amplitude
      const y = this.y + wave
      ctx.lineTo(x, y)
    }
    
    ctx.stroke()
    ctx.restore()
  }
}

// 光束数据
class LightBeam {
  constructor(canvas, index) {
    this.canvas = canvas
    this.index = index
    this.x = 300 + index * 500
    this.width = 80 + Math.random() * 60
    this.opacity = props.beamOpacity * (0.8 + Math.random() * 0.4)
    this.opacityPhase = Math.random() * Math.PI * 2
    this.sway = Math.random() * 20
    this.swayPhase = Math.random() * Math.PI * 2
  }
  
  update(time) {
    this.opacityPhase += props.beamSpeed * 0.001
    this.swayPhase += props.beamSpeed * 0.0008
  }
  
  draw(ctx) {
    ctx.save()
    
    const currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.opacityPhase))
    const currentSway = Math.sin(this.swayPhase) * this.sway
    
    // 创建渐变
    const gradient = ctx.createLinearGradient(this.x, 0, this.x, this.canvas.height)
    gradient.addColorStop(0, `${props.beamColor}00`)
    gradient.addColorStop(0.3, `${props.beamColor}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`)
    gradient.addColorStop(0.7, `${props.beamColor}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`)
    gradient.addColorStop(1, `${props.beamColor}00`)
    
    ctx.fillStyle = gradient
    ctx.shadowBlur = props.beamBlur
    ctx.shadowColor = props.beamColor
    ctx.globalCompositeOperation = 'lighter'
    
    // 绘制光束
    ctx.beginPath()
    ctx.moveTo(this.x + currentSway, 0)
    ctx.lineTo(this.x + this.width + currentSway, 0)
    ctx.lineTo(this.x + this.width + currentSway * 1.5, this.canvas.height)
    ctx.lineTo(this.x + currentSway * 1.5, this.canvas.height)
    ctx.closePath()
    ctx.fill()
    
    ctx.restore()
  }
}

// 粒子数据
class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
    this.y = Math.random() * canvas.height // 初始随机位置
  }
  
  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = this.canvas.height + 50
    this.radius = props.particleRadiusMin + Math.random() * (props.particleRadiusMax - props.particleRadiusMin)
    this.speedY = -0.3 - Math.random() * 0.5
    this.speedX = (Math.random() - 0.5) * 0.3
    this.opacity = 0.3 + Math.random() * 0.5
    this.opacityPhase = Math.random() * Math.PI * 2
    this.opacitySpeed = 0.01 + Math.random() * 0.02
  }
  
  update(time) {
    this.y += this.speedY * props.particleSpeed
    this.x += this.speedX * props.particleSpeed
    this.opacityPhase += this.opacitySpeed
    
    // 粒子超出画布时重置
    if (this.y < -50 || this.x < -50 || this.x > this.canvas.width + 50) {
      this.reset()
    }
  }
  
  draw(ctx) {
    ctx.save()
    
    const currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.opacityPhase))
    
    // 创建径向渐变
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2)
    const color = props.particleColor.replace(/[\d.]+\)$/g, `${currentOpacity})`)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.5, color.replace(/[\d.]+\)$/g, `${currentOpacity * 0.5})`))
    gradient.addColorStop(1, color.replace(/[\d.]+\)$/g, '0)'))
    
    ctx.fillStyle = gradient
    ctx.globalCompositeOperation = 'lighter'
    ctx.shadowBlur = this.radius * 2
    ctx.shadowColor = props.particleColor
    
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}

// 所有对象
const flowLines = ref([])
const lightBeams = ref([])
const particles = ref([])

// 初始化
const init = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  // 设置画布尺寸
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  ctx = canvas.getContext('2d', { alpha: false })
  
  // 创建流动线条
  flowLines.value = Array.from({ length: props.lineCount }, (_, i) => new FlowLine(canvas, i))
  
  // 创建光束
  lightBeams.value = Array.from({ length: props.beamCount }, (_, i) => new LightBeam(canvas, i))
  
  // 创建粒子
  particles.value = Array.from({ length: props.particleCount }, () => new Particle(canvas))
  
  // 开始动画
  animate(0)
}

// 动画循环
const animate = (currentTime) => {
  animationId = requestAnimationFrame(animate)
  
  // 帧率限制
  const frameInterval = 1000 / props.fps
  const deltaTime = currentTime - lastTime
  
  if (deltaTime < frameInterval) return
  
  lastTime = currentTime - (deltaTime % frameInterval)
  
  if (!ctx) return
  
  // 清空画布
  ctx.fillStyle = props.bgColor
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  
  // 更新和绘制光束
  lightBeams.value.forEach(beam => {
    beam.update(currentTime)
    beam.draw(ctx)
  })
  
  // 更新和绘制线条
  flowLines.value.forEach(line => {
    line.update(currentTime)
    line.draw(ctx)
  })
  
  // 更新和绘制粒子
  particles.value.forEach(particle => {
    particle.update(currentTime)
    particle.draw(ctx)
  })
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.history-bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
}

.paper-texture {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(101, 67, 33, 0.03) 0%, transparent 50%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(139, 69, 19, 0.01) 2px,
      rgba(139, 69, 19, 0.01) 4px
    );
  opacity: 0.3;
  pointer-events: none;
}

.canvas-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
