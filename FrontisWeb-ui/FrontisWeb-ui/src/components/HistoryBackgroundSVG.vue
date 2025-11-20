<template>
  <div class="history-bg-svg">
    <!-- 旧纸纹理背景 -->
    <div class="paper-texture"></div>
    
    <!-- SVG 容器 -->
    <svg class="svg-canvas" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      <!-- 定义滤镜 -->
      <defs>
        <!-- 模糊滤镜 - 用于线条 -->
        <filter id="blur-line">
          <feGaussianBlur in="SourceGraphic" :stdDeviation="config.lineBlur" />
        </filter>
        
        <!-- 发光滤镜 - 用于光束 -->
        <filter id="glow">
          <feGaussianBlur in="SourceGraphic" :stdDeviation="config.lightBlur" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <!-- 光束渐变 -->
        <linearGradient 
          v-for="(beam, index) in lightBeams" 
          :key="`grad-${index}`"
          :id="`beam-gradient-${index}`"
          :x1="beam.gradientX1" 
          :y1="beam.gradientY1" 
          :x2="beam.gradientX2" 
          :y2="beam.gradientY2"
        >
          <stop offset="0%" :stop-color="config.beamColor" stop-opacity="0" />
          <stop offset="50%" :stop-color="config.beamColor" :stop-opacity="beam.opacity * 0.3" />
          <stop offset="100%" :stop-color="config.beamColor" stop-opacity="0" />
        </linearGradient>
      </defs>
      
      <!-- 流动线条层 -->
      <g class="flow-lines-group" filter="url(#blur-line)">
        <path 
          v-for="(line, index) in flowLines" 
          :key="`line-${index}`"
          :d="line.path"
          :class="`flow-line flow-line-${index}`"
          :style="{
            stroke: config.lineColor,
            strokeWidth: line.width,
            opacity: line.opacity,
            animationDuration: `${line.duration}s`,
            animationDelay: `${line.delay}s`
          }"
        />
      </g>
      
      <!-- 光束层 -->
      <g class="light-beams-group" filter="url(#glow)">
        <path 
          v-for="(beam, index) in lightBeams" 
          :key="`beam-${index}`"
          :d="beam.path"
          :class="`light-beam light-beam-${index}`"
          :fill="`url(#beam-gradient-${index})`"
          :style="{
            opacity: beam.opacity,
            animationDuration: `${beam.duration}s`,
            animationDelay: `${beam.delay}s`
          }"
        />
      </g>
      
      <!-- 光斑粒子层 -->
      <g class="particles-group">
        <circle 
          v-for="(particle, index) in particles" 
          :key="`particle-${index}`"
          :cx="particle.x"
          :cy="particle.y"
          :r="particle.radius"
          :class="`particle particle-${index}`"
          :style="{
            fill: config.particleColor,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 可调参数配置
const props = defineProps({
  // 线条配置
  lineCount: { type: Number, default: 5 },
  lineColor: { type: String, default: 'rgba(40, 40, 40, 0.6)' },
  lineWidthMin: { type: Number, default: 2 },
  lineWidthMax: { type: Number, default: 5 },
  lineBlur: { type: Number, default: 8 },
  lineSpeedMin: { type: Number, default: 15 },
  lineSpeedMax: { type: Number, default: 25 },
  
  // 光束配置
  beamCount: { type: Number, default: 3 },
  beamColor: { type: String, default: '#f4e4c1' },
  lightBlur: { type: Number, default: 15 },
  beamSpeedMin: { type: Number, default: 8 },
  beamSpeedMax: { type: Number, default: 15 },
  
  // 粒子配置
  particleCount: { type: Number, default: 30 },
  particleColor: { type: String, default: 'rgba(244, 228, 193, 0.8)' },
  particleRadiusMin: { type: Number, default: 1 },
  particleRadiusMax: { type: Number, default: 3 },
  particleSpeedMin: { type: Number, default: 10 },
  particleSpeedMax: { type: Number, default: 20 },
  
  // 背景配置
  bgColor: { type: String, default: '#0a0a0a' },
})

const config = ref({
  lineColor: props.lineColor,
  lineBlur: props.lineBlur,
  beamColor: props.beamColor,
  lightBlur: props.lightBlur,
  particleColor: props.particleColor,
})

// 生成流动线条数据
const flowLines = ref([])
const generateFlowLines = () => {
  const lines = []
  for (let i = 0; i < props.lineCount; i++) {
    const y = 200 + (i * 180)
    lines.push({
      path: `M0 ${y} C${400 + Math.random() * 200} ${y + (Math.random() - 0.5) * 100} ${1000 + Math.random() * 200} ${y + (Math.random() - 0.5) * 100} 1920 ${y}`,
      width: props.lineWidthMin + Math.random() * (props.lineWidthMax - props.lineWidthMin),
      opacity: 0.4 + Math.random() * 0.3,
      duration: props.lineSpeedMin + Math.random() * (props.lineSpeedMax - props.lineSpeedMin),
      delay: -Math.random() * 10
    })
  }
  flowLines.value = lines
}

// 生成光束数据
const lightBeams = ref([])
const generateLightBeams = () => {
  const beams = []
  for (let i = 0; i < props.beamCount; i++) {
    const startX = 300 + i * 600
    const startY = -100
    const endX = startX + 100 + Math.random() * 100
    const endY = 1180
    
    beams.push({
      path: `M${startX} ${startY} L${startX + 30} ${startY} L${endX + 30} ${endY} L${endX} ${endY} Z`,
      opacity: 0.15 + Math.random() * 0.15,
      duration: props.beamSpeedMin + Math.random() * (props.beamSpeedMax - props.beamSpeedMin),
      delay: -Math.random() * 8,
      gradientX1: '0%',
      gradientY1: '0%',
      gradientX2: '0%',
      gradientY2: '100%'
    })
  }
  lightBeams.value = beams
}

// 生成粒子数据
const particles = ref([])
const generateParticles = () => {
  const parts = []
  for (let i = 0; i < props.particleCount; i++) {
    parts.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      radius: props.particleRadiusMin + Math.random() * (props.particleRadiusMax - props.particleRadiusMin),
      opacity: 0.3 + Math.random() * 0.5,
      duration: props.particleSpeedMin + Math.random() * (props.particleSpeedMax - props.particleSpeedMin),
      delay: -Math.random() * 15
    })
  }
  particles.value = parts
}

onMounted(() => {
  generateFlowLines()
  generateLightBeams()
  generateParticles()
})
</script>

<style scoped>
.history-bg-svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  background: v-bind('props.bgColor');
}

/* 旧纸纹理背景 */
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

.svg-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 流动线条样式 */
.flow-line {
  fill: none;
  stroke-linecap: round;
  mix-blend-mode: multiply;
  animation: flowLineAnim ease-in-out infinite alternate;
  transform-origin: center;
}

/* 光束样式 */
.light-beam {
  mix-blend-mode: screen;
  animation: beamAnim ease-in-out infinite;
}

/* 粒子样式 */
.particle {
  mix-blend-mode: screen;
  animation: particleFloat ease-in-out infinite;
}

/* 线条流动动画 */
@keyframes flowLineAnim {
  0% {
    transform: translateY(0) translateX(0) scaleY(1);
    opacity: var(--start-opacity, 0.5);
  }
  50% {
    transform: translateY(-20px) translateX(15px) scaleY(1.08);
    opacity: var(--mid-opacity, 0.7);
  }
  100% {
    transform: translateY(10px) translateX(-10px) scaleY(0.95);
    opacity: var(--end-opacity, 0.4);
  }
}

/* 光束动画 */
@keyframes beamAnim {
  0%, 100% {
    opacity: 0.05;
    transform: translateX(0) scaleX(1);
  }
  50% {
    opacity: 0.2;
    transform: translateX(10px) scaleX(1.05);
  }
}

/* 粒子漂浮动画 */
@keyframes particleFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.2;
  }
  33% {
    transform: translate(20px, -30px) scale(1.2);
    opacity: 0.6;
  }
  66% {
    transform: translate(-15px, -60px) scale(0.9);
    opacity: 0.4;
  }
  100% {
    transform: translate(5px, -90px) scale(1.1);
    opacity: 0.1;
  }
}

/* 为每条线设置不同的动画变量 */
.flow-line-0 { --start-opacity: 0.5; --mid-opacity: 0.7; --end-opacity: 0.4; }
.flow-line-1 { --start-opacity: 0.4; --mid-opacity: 0.65; --end-opacity: 0.35; }
.flow-line-2 { --start-opacity: 0.45; --mid-opacity: 0.7; --end-opacity: 0.38; }
.flow-line-3 { --start-opacity: 0.48; --mid-opacity: 0.68; --end-opacity: 0.42; }
.flow-line-4 { --start-opacity: 0.43; --mid-opacity: 0.66; --end-opacity: 0.36; }
</style>
