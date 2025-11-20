# 历史背景动效组件使用说明

## 两种实现方式对比

### 方案一：SVG + CSS (`HistoryBackgroundSVG.vue`)
**优点：**
- 代码简洁，CSS动画性能好
- 向量图形，任意缩放不失真
- 易于调试和修改
- 浏览器硬件加速支持好

**缺点：**
- 复杂路径动画在某些浏览器可能不流畅
- 粒子数量多时DOM元素过多

**适用场景：**
- 追求代码简洁
- 粒子数量较少（<50个）
- 需要响应式缩放

---

### 方案二：Canvas + JS (`HistoryBackgroundCanvas.vue`)
**优点：**
- 性能更好，可处理大量粒子
- 动画更流畅自然
- 完全的动画控制
- 更丰富的视觉效果（渐变、发光）

**缺点：**
- 代码复杂度较高
- 需要手动处理响应式
- 调试相对困难

**适用场景：**
- 需要大量粒子（>50个）
- 追求极致性能
- 需要复杂动画效果

---

## 使用方法

### 1. 基础使用（默认参数）

#### SVG 版本
```vue
<template>
  <div class="page">
    <HistoryBackgroundSVG />
    <div class="content">
      <!-- 你的内容 -->
    </div>
  </div>
</template>

<script setup>
import HistoryBackgroundSVG from '@/components/HistoryBackgroundSVG.vue'
</script>
```

#### Canvas 版本
```vue
<template>
  <div class="page">
    <HistoryBackgroundCanvas />
    <div class="content">
      <!-- 你的内容 -->
    </div>
  </div>
</template>

<script setup>
import HistoryBackgroundCanvas from '@/components/HistoryBackgroundCanvas.vue'
</script>
```

---

### 2. 自定义参数

#### 完整参数示例
```vue
<template>
  <HistoryBackgroundCanvas 
    :line-count="6"
    line-color="rgba(30, 30, 30, 0.7)"
    :line-width-min="2"
    :line-width-max="6"
    :line-blur="10"
    :line-speed="0.5"
    
    :beam-count="4"
    beam-color="#e6d7b8"
    :beam-opacity="0.2"
    :beam-blur="25"
    :beam-speed="0.3"
    
    :particle-count="60"
    particle-color="rgba(230, 215, 184, 0.7)"
    :particle-radius-min="1.5"
    :particle-radius-max="4"
    :particle-speed="0.8"
    
    bg-color="#0d0d0d"
    :fps="30"
  />
</template>
```

---

## 参数详解

### 线条参数 (Flow Lines)

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `lineCount` | Number | 5 | 线条数量 (建议 3-6) |
| `lineColor` | String | 'rgba(40,40,40,0.6)' | 线条颜色 |
| `lineWidthMin` | Number | 2 | 线条最小宽度 (px) |
| `lineWidthMax` | Number | 5 | 线条最大宽度 (px) |
| `lineBlur` | Number | 8 | 模糊强度 (px) |
| `lineSpeed` | Number | 0.3 (Canvas) | 流动速度系数 |
| `lineSpeedMin` | Number | 15 (SVG) | 最小动画时长 (秒) |
| `lineSpeedMax` | Number | 25 (SVG) | 最大动画时长 (秒) |

---

### 光束参数 (Light Beams)

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `beamCount` | Number | 3 | 光束数量 (建议 2-4) |
| `beamColor` | String | '#f4e4c1' | 光束颜色 (hex) |
| `beamOpacity` | Number | 0.15 | 光束基础透明度 |
| `beamBlur` | Number | 20 (Canvas) | 发光强度 |
| `lightBlur` | Number | 15 (SVG) | 发光强度 |
| `beamSpeed` | Number | 0.2 (Canvas) | 光束速度系数 |
| `beamSpeedMin` | Number | 8 (SVG) | 最小动画时长 (秒) |
| `beamSpeedMax` | Number | 15 (SVG) | 最大动画时长 (秒) |

---

### 粒子参数 (Particles)

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `particleCount` | Number | 30 (SVG) / 40 (Canvas) | 粒子数量 |
| `particleColor` | String | 'rgba(244,228,193,0.8)' | 粒子颜色 |
| `particleRadiusMin` | Number | 1 | 粒子最小半径 (px) |
| `particleRadiusMax` | Number | 3 | 粒子最大半径 (px) |
| `particleSpeed` | Number | 0.5 (Canvas) | 粒子速度系数 |
| `particleSpeedMin` | Number | 10 (SVG) | 最小动画时长 (秒) |
| `particleSpeedMax` | Number | 20 (SVG) | 最大动画时长 (秒) |

---

### 背景参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `bgColor` | String | '#0a0a0a' | 背景颜色 |
| `fps` | Number | 30 (Canvas only) | 帧率限制 (性能优化) |

---

## 预设配置方案

### 方案 A：轻柔优雅（适合展示历史人物）
```vue
<HistoryBackgroundCanvas 
  :line-count="4"
  line-color="rgba(50, 40, 30, 0.5)"
  :line-blur="12"
  :line-speed="0.2"
  
  :beam-count="2"
  beam-color="#f0e6d2"
  :beam-opacity="0.1"
  
  :particle-count="25"
  particle-color="rgba(240, 230, 210, 0.6)"
  :particle-speed="0.3"
  
  bg-color="#0f0e0d"
/>
```

### 方案 B：动感醒目（适合时间轴页面）
```vue
<HistoryBackgroundCanvas 
  :line-count="6"
  line-color="rgba(40, 40, 40, 0.7)"
  :line-blur="8"
  :line-speed="0.6"
  
  :beam-count="4"
  beam-color="#f4e4c1"
  :beam-opacity="0.2"
  
  :particle-count="50"
  particle-color="rgba(244, 228, 193, 0.8)"
  :particle-speed="0.7"
  
  bg-color="#0a0a0a"
/>
```

### 方案 C：沉稳厚重（适合校史介绍）
```vue
<HistoryBackgroundCanvas 
  :line-count="5"
  line-color="rgba(30, 30, 30, 0.8)"
  :line-blur="6"
  :line-speed="0.15"
  
  :beam-count="2"
  beam-color="#d4c4a8"
  :beam-opacity="0.08"
  
  :particle-count="20"
  particle-color="rgba(212, 196, 168, 0.5)"
  :particle-speed="0.25"
  
  bg-color="#121212"
/>
```

---

## 性能优化建议

### 1. 低性能设备
```vue
<HistoryBackgroundCanvas 
  :line-count="3"
  :beam-count="2"
  :particle-count="20"
  :fps="24"
  :line-blur="5"
  :beam-blur="15"
/>
```

### 2. 移动端
```vue
<HistoryBackgroundSVG 
  :line-count="3"
  :beam-count="1"
  :particle-count="15"
  :line-blur="6"
/>
```

### 3. 高性能设备
```vue
<HistoryBackgroundCanvas 
  :line-count="8"
  :beam-count="5"
  :particle-count="80"
  :fps="60"
/>
```

---

## 在 CdutDigitalHistory.vue 中使用

替换现有的流动背景层：

```vue
<template>
  <div class="history-container">
    <!-- 加载遮罩层 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- 主要内容 -->
    <div v-show="!isLoading">
      <!-- 背景图片层1 -->
      <div class="background-layer background-layer-1" ...></div>
      <div class="background-layer background-layer-2" ...></div>
      
      <!-- 替换为新的背景动效组件 -->
      <HistoryBackgroundCanvas 
        :line-count="5"
        :beam-count="3"
        :particle-count="40"
        bg-color="transparent"
      />
      
      <!-- 其他内容... -->
    </div>
  </div>
</template>

<script setup>
import HistoryBackgroundCanvas from '@/components/HistoryBackgroundCanvas.vue'
// ...
</script>
```

---

## 常见问题

### Q: 线条看不见？
A: 尝试调整 `lineColor` 为更深的颜色，或增加 `lineWidthMax`

### Q: 动画太快/太慢？
A: 
- Canvas 版本：调整 `lineSpeed`, `beamSpeed`, `particleSpeed`
- SVG 版本：调整 `lineSpeedMin/Max`, `beamSpeedMin/Max` 等

### Q: 性能不好，卡顿？
A: 
1. 减少 `particleCount`
2. 降低 `fps` (Canvas)
3. 减少 `lineBlur` 和 `beamBlur`
4. 使用 SVG 版本

### Q: 想要更多粒子？
A: 使用 Canvas 版本，设置 `:particle-count="100+"` 性能更好

---

## 技术说明

### SVG 版本实现原理
- 使用 SVG `<path>` 绘制线条
- CSS `@keyframes` 控制 `transform` 动画
- SVG `<filter>` 实现模糊和发光
- `mix-blend-mode` 实现图层混合

### Canvas 版本实现原理
- 使用 `CanvasRenderingContext2D` 绘制
- `requestAnimationFrame` 驱动动画循环
- 数学函数（sin, cos）实现自然流动
- `globalCompositeOperation` 实现混合模式
- 帧率限制优化性能

---

## 许可
MIT License - 自由使用和修改
