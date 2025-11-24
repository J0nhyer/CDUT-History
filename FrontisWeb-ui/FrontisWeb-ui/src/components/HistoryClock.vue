<template>
  <div class="history-clock-container">
    <!-- 钟表悬挂链条 -->
    <div class="clock-chain" :style="{ height: (50 + pendantOffset) + 'px', transition: isDragging ? 'none' : 'height 0.3s ease' }"></div>
    
    <!-- 古典钟表 -->
    <div class="clock-frame" :style="{ transform: `translateY(${pendantOffset}px)`, transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }">
      <!-- 链条连接器 -->
      <div class="chain-connector"></div>
      
      <!-- 钟表外框装饰 -->
      <div class="clock-ornament top-ornament"></div>
      
      <!-- 钟表主体 -->
      <div class="clock-body" :class="{ shaking: isShaking }">
        <!-- 钟表表盘 -->
        <div class="clock-face">
          <!-- 表盘刻度和年份 -->
          <div 
            v-for="(year, index) in yearMarks" 
            :key="year"
            class="year-mark"
            :style="getYearMarkStyle(index)"
          >
            <div class="year-text">{{ year }}</div>
            <div class="year-dot"></div>
          </div>
          
          <!-- 中心装饰圆 -->
          <div class="center-ornament">
            <div class="center-ring"></div>
            <div class="center-dot"></div>
          </div>
          
          <!-- 钟表指针 -->
          <div 
            class="clock-hand" 
            :style="{ 
              transform: `rotate(${handRotation}deg)`,
              transition: isSpinning ? 'none' : 'transform 0.1s linear'
            }"
          >
            <div class="hand-pointer"></div>
          </div>
          
          <!-- 表盘中心文字 -->
          <div class="clock-title">成理校史</div>
        </div>
        
        <!-- 钟表底部装饰 -->
        <div class="clock-bottom-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-pattern"></div>
        </div>
      </div>
      
      <!-- 挂坠链条 -->
      <div class="pendant-chain-wrapper" :style="{ height: '180px', transform: `translateY(${pendantOffset}px)`, transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }">
        <svg class="pendant-chain" height="180" width="8" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="chainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:rgb(101,84,63);stop-opacity:0.6" />
              <stop offset="50%" style="stop-color:rgb(139,115,85);stop-opacity:1" />
              <stop offset="100%" style="stop-color:rgb(101,84,63);stop-opacity:0.6" />
            </linearGradient>
            <filter id="chainShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
              <feOffset dx="1" dy="1" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g v-for="(link, index) in chainLinks" :key="index">
            <ellipse 
              :cy="link.y" 
              cx="4" 
              rx="2.5" 
              ry="4" 
              fill="url(#chainGradient)" 
              stroke="#4a3829" 
              stroke-width="0.5"
              filter="url(#chainShadow)"
            />
          </g>
        </svg>
      </div>
      
      <!-- 可拉动的挂坠 -->
      <div 
        class="pendant"
        :style="{ transform: `translateY(${pendantOffset}px)`, transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <div class="pendant-hook"></div>
        <div class="pendant-body">
          <div class="pendant-decoration"></div>
          <div class="pendant-text">拉我</div>
        </div>
      </div>
    </div>
    
    <!-- 历史事件展示卡片 -->
    <transition name="event-fade">
      <div v-if="showEvent && currentEvent" class="event-card">
        <div class="event-close" @click="closeEvent">
          <i class="fas fa-times"></i>
        </div>
        <div class="event-content">
          <div class="event-left">
            <div class="event-image-wrapper">
              <img :src="currentEvent.image" :alt="currentEvent.title" class="event-image" />
              <div class="event-year-badge">{{ currentEvent.year }}</div>
            </div>
          </div>
          <div class="event-right">
            <h3 class="event-title">{{ currentEvent.title }}</h3>
            <div class="event-divider"></div>
            <p class="event-description">{{ currentEvent.description }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'HistoryClock',
  data() {
    return {
      // 历史事件数据（从后端API获取）
      historyEvents: [],
      
      // 指针旋转角度（-90度让指针指向12点方向）
      handRotation: -90,
      
      // 挂坠相关
      pendantOffset: 0,
      isDragging: false,
      dragStartY: 0,
      dragStartOffset: 0,
      maxPullDistance: 70,
      
      // 动画状态
      isSpinning: false,
      isShaking: false,
      
      // 当前事件
      currentEvent: null,
      showEvent: false
    }
  },
  
  computed: {
    // 计算链环位置
    chainLinks() {
      const linkHeight = 8 // 每个链环高度
      const linkCount = Math.ceil(180 / linkHeight) // 固定180px高度
      const links = []
      for (let i = 0; i < linkCount; i++) {
        links.push({
          y: i * linkHeight + 4
        })
      }
      return links
    },
    
    // 动态生成年份刻度（从历史事件中提取）
    yearMarks() {
      if (!this.historyEvents || this.historyEvents.length === 0) {
        // 如果没有数据，返回默认年份
        return [1956, 1960, 1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022, 2024, 2025]
      }
      // 从历史事件中提取年份并排序
      const years = this.historyEvents.map(e => e.year).sort((a, b) => a - b)
      // 如果事件少于12个，返回所有年份；否则均匀选择12个
      if (years.length <= 12) {
        return years
      }
      // 均匀选择12个年份点
      const step = years.length / 12
      const selectedYears = []
      for (let i = 0; i < 12; i++) {
        selectedYears.push(years[Math.floor(i * step)])
      }
      return selectedYears
    }
  },
  
  methods: {
    // 获取年份刻度位置
    getYearMarkStyle(index) {
      const angle = (index * 360 / this.yearMarks.length) - 90
      const radius = 125
      const x = Math.cos(angle * Math.PI / 180) * radius
      const y = Math.sin(angle * Math.PI / 180) * radius
      
      return {
        transform: `translate(${x}px, ${y}px)`
      }
    },
    
    // 开始拖拽挂坠
    startDrag(e) {
      if (this.isSpinning) return
      
      this.isDragging = true
      this.dragStartY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
      this.dragStartOffset = this.pendantOffset
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.endDrag)
      document.addEventListener('touchmove', this.onDrag)
      document.addEventListener('touchend', this.endDrag)
    },
    
    // 拖拽中
    onDrag(e) {
      if (!this.isDragging) return
      
      const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
      const deltaY = currentY - this.dragStartY
      
      // 限制拉动范围
      this.pendantOffset = Math.max(0, Math.min(this.maxPullDistance, this.dragStartOffset + deltaY))
      
      // 钟表轻微晃动
      if (this.pendantOffset > 7) {
        this.isShaking = true
      }
    },
    
    // 结束拖拽
    endDrag() {
      if (!this.isDragging) return
      
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.endDrag)
      document.removeEventListener('touchmove', this.onDrag)
      document.removeEventListener('touchend', this.endDrag)
      
      // 如果拉动超过一定距离，触发旋转
      if (this.pendantOffset > 40) {
        this.spinClock()
      }
      
      // 挂坠回弹
      this.pendantOffset = 0
      this.isShaking = false
    },
    
    // 旋转钟表指针
    spinClock() {
      if (this.isSpinning) return
      
      this.isSpinning = true
      this.showEvent = false
      
      // 随机旋转圈数 + 随机角度
      const baseRotation = this.handRotation
      const extraSpins = 3 + Math.floor(Math.random() * 3) // 3-5圈
      const randomAngle = Math.floor(Math.random() * 360)
      const targetRotation = baseRotation + (extraSpins * 360) + randomAngle
      
      // 执行旋转动画
      const duration = 3000 // 3秒
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // 缓动函数：先加速后减速
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
        
        const currentRotation = baseRotation + (targetRotation - baseRotation) * eased
        this.handRotation = currentRotation
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // 动画完成，先归一化角度
          this.handRotation = targetRotation % 360
          // 延迟一帧后再重置状态，确保最后一帧渲染完成
          requestAnimationFrame(() => {
            this.isSpinning = false
            this.showRandomEvent()
          })
        }
      }
      
      animate()
    },
    
    // 显示随机历史事件
    showRandomEvent() {
      // 检查是否有历史事件数据
      if (!this.historyEvents || this.historyEvents.length === 0) {
        console.error('没有历史事件数据')
        return
      }
      
      // 根据指针角度确定对应的年份索引
      // handRotation = -90 对应 12点方向（index=0）
      // 需要将角度调整到 0-360 范围，并且 0度 对应 index=0
      const adjustedAngle = ((this.handRotation + 90) % 360 + 360) % 360
      const degreesPerMark = 360 / this.yearMarks.length
      const index = Math.floor((adjustedAngle + degreesPerMark / 2) / degreesPerMark) % this.yearMarks.length
      const selectedYear = this.yearMarks[index]
      
      console.log('🎯 指针角度:', this.handRotation.toFixed(1), '° | 调整后:', adjustedAngle.toFixed(1), '° | 索引:', index, '| 年份:', selectedYear)
      
      // 查找对应年份的事件
      let event = this.historyEvents.find(e => e.year === selectedYear)
      
      if (!event) {
        console.warn('⚠️ 未找到', selectedYear, '年的事件，查找最接近的年份')
        // 找最接近的年份事件
        event = this.historyEvents.reduce((prev, curr) => {
          return Math.abs(curr.year - selectedYear) < Math.abs(prev.year - selectedYear) ? curr : prev
        })
        console.log('✅ 选中最接近的事件:', event.year, '-', event.title)
      } else {
        console.log('✅ 选中事件:', event.year, '-', event.title)
      }
      
      this.currentEvent = event
      
      // 延迟显示事件卡片
      setTimeout(() => {
        this.showEvent = true
      }, 300)
    },
    
    // 关闭事件卡片
    closeEvent() {
      this.showEvent = false
    },
    
    // 从后端API获取历史事件数据
    async fetchHistoryEvents() {
      try {
        const response = await fetch('http://localhost:8080/api/history/events/importance/high')
        const result = await response.json()
        
        console.log('API返回完整数据:', JSON.stringify(result, null, 2))
        console.log('result.success:', result.success)
        console.log('result.data:', result.data)
        console.log('result.data类型:', typeof result.data)
        console.log('result.data是数组吗:', Array.isArray(result.data))
        
        if (result.success && result.data) {
          const dataArray = Array.isArray(result.data) ? result.data : [result.data]
          
          if (dataArray.length > 0) {
            // 处理数据：转换年份为数字，处理图片路径
            this.historyEvents = dataArray.map(event => {
              // 处理图片路径：移除 @/assets/ 前缀
              let imagePath = event.imageUrl || event.image_url || event.image || ''
              
              // 移除 @/assets/ 前缀，得到相对于 assets 的路径
              if (imagePath.startsWith('@/assets/')) {
                imagePath = imagePath.replace('@/', '')
              }
              
              // 使用 Vite 的动态 import 获取图片
              let imageUrl = ''
              try {
                // 动态导入图片
                imageUrl = new URL(`../${imagePath}`, import.meta.url).href
              } catch (e) {
                console.warn('图片路径解析失败:', imagePath, e)
                imageUrl = ''
              }
              
              return {
                year: parseInt(event.year) || parseInt(event.startYear) || 2000,
                title: event.title || event.eventName || '未知事件',
                description: event.description || event.detail || '暂无描述',
                image: imageUrl
              }
            })
            
            console.log('✅ 历史事件加载成功:', this.historyEvents.length, '条数据')
            console.log('📊 数据示例:', this.historyEvents.slice(0, 3))
            return
          }
        }
        
        console.warn('没有获取到历史事件数据，使用模拟数据')
        this.historyEvents = this.getMockEvents()
        console.log('使用模拟数据:', this.historyEvents.length, '条')
      } catch (error) {
        console.error('获取历史事件失败:', error)
        // 使用模拟数据
        this.historyEvents = this.getMockEvents()
        console.log('使用模拟数据:', this.historyEvents.length, '条')
      }
    },
    
    // 获取模拟数据（用于调试）
    getMockEvents() {
      return [
        { year: 1956, title: '成都地质勘探学院成立', description: '学校正式成立，开启成理历史新篇章', image: '/src/assets/history/1956.jpg' },
        { year: 1960, title: '发展壮大', description: '学校规模不断扩大，教学质量稳步提升', image: '/src/assets/history/1960.jpg' },
        { year: 1978, title: '改革开放', description: '学校迎来改革开放新时期', image: '/src/assets/history/1978.jpg' },
        { year: 1993, title: '更名成都理工学院', description: '学校正式更名为成都理工学院', image: '/src/assets/history/1993.jpg' },
        { year: 2001, title: '更名成都理工大学', description: '学校正式更名为成都理工大学', image: '/src/assets/history/2001.jpg' },
        { year: 2010, title: '跨越式发展', description: '学校进入快速发展新阶段', image: '/src/assets/history/2010.jpg' },
        { year: 2017, title: '双一流建设', description: '学校入选世界一流学科建设高校', image: '/src/assets/history/2017.jpg' }
      ]
    }
  },
  
  mounted() {
    // 组件挂载后加载历史事件数据
    this.fetchHistoryEvents()
  }
}
</script>

<style scoped>
.history-clock-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 50px;
  overflow: hidden;
  background: transparent;
  pointer-events: none;
  transform: scale(0.95);
  transform-origin: center top;
}

.history-clock-container > * {
  pointer-events: auto;
}

/* 钟表悬挂链条 */
.clock-chain {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 50px;
  background: linear-gradient(to bottom, 
    rgba(139, 115, 85, 0.9), 
    rgba(101, 84, 63, 1)
  );
  box-shadow: 
    inset 1px 0 1px rgba(255, 255, 255, 0.3),
    2px 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  z-index: 0;
}

/* 链条连接器 */
.chain-connector {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 30% 30%, #8b7355, #654c3f);
  border-radius: 50%;
  border: 2px solid #4a3829;
  box-shadow: 
    inset 0 2px 3px rgba(255, 255, 255, 0.3),
    0 3px 6px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.chain-connector::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #3e2f23;
  border-radius: 50%;
}

.chain-connector::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 12px;
  background: linear-gradient(to bottom, 
    rgba(101, 84, 63, 1),
    rgba(101, 84, 63, 0.8)
  );
  border-radius: 2px;
  z-index: 1;
}

/* 钟表框架 */
.clock-frame {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  margin-top: 0;
}

.clock-body.shaking {
  animation: shake 0.3s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
}

/* 顶部装饰 */
.clock-ornament.top-ornament {
  width: 60px;
  height: 30px;
  background: radial-gradient(ellipse at center, 
    #8b7355 0%, 
    #654c3f 50%, 
    #3e2f23 100%
  );
  border-radius: 50% 50% 0 0;
  border: 2px solid #4a3829;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.6);
  position: relative;
  margin-top: 12px;
  z-index: 1;
}

/* 钟表主体 */
.clock-body {
  position: relative;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle at 30% 30%, 
    #8b7355, 
    #654c3f 40%, 
    #3e2f23 80%
  );
  border-radius: 50%;
  border: 7px solid #4a3829;
  box-shadow: 
    inset 0 0 30px rgba(0, 0, 0, 0.8),
    inset -10px -10px 20px rgba(0, 0, 0, 0.4),
    inset 10px 10px 20px rgba(139, 115, 85, 0.3),
    0 15px 40px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

/* 表盘 */
.clock-face {
  position: relative;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle at center,
    #f5f1e8 0%,
    #e8dcc8 30%,
    #d4c4a8 70%,
    #b8a888 100%
  );
  border-radius: 50%;
  box-shadow: 
    inset 0 0 40px rgba(0, 0, 0, 0.15),
    inset 0 5px 15px rgba(0, 0, 0, 0.1),
    0 0 20px rgba(0, 0, 0, 0.3);
}

/* 年份刻度 */
.year-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -10px;
  margin-left: -20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.year-text {
  font-size: 13px;
  font-weight: 700;
  color: #3e2f23;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
  font-family: 'Georgia', serif;
  white-space: nowrap;
}

.year-dot {
  width: 5px;
  height: 5px;
  background: #3e2f23;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 中心装饰 */
.center-ornament {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.center-ring {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle, #8b7355, #654c3f);
  border: 3px solid #4a3829;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 4px 8px rgba(0, 0, 0, 0.4);
}

.center-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #3e2f23;
  border-radius: 50%;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.6),
    inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

/* 钟表指针 */
.clock-hand {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 130px;
  height: 5px;
  transform-origin: 0 center;
  margin-left: 0;
  z-index: 5;
}

.hand-pointer {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right,
    transparent 0%,
    #3e2f23 5%,
    #3e2f23 95%,
    #8b4513 100%
  );
  border-radius: 0 3px 3px 0;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
}

.hand-pointer::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid #8b4513;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.4));
}

/* 表盘标题 */
.clock-title {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 700;
  color: #3e2f23;
  font-family: 'KaiTi', '楷体', serif;
  letter-spacing: 4px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

/* 底部装饰 */
.clock-bottom-decoration {
  position: absolute;
  bottom: -25px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.decoration-line {
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, #654c3f, #3e2f23);
}

.decoration-pattern {
  width: 40px;
  height: 15px;
  background: #654c3f;
  border-radius: 0 0 50% 50%;
  border: 2px solid #4a3829;
  border-top: none;
}

/* 挂坠链条容器 */
.pendant-chain-wrapper {
  display: flex;
  justify-content: center;
  margin-top: -120px;
  position: relative;
  z-index: -1;
}

/* 挂坠链条SVG */
.pendant-chain {
  display: block;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
}

/* 挂坠 */
.pendant {
  position: relative;
  cursor: grab;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.pendant:active {
  cursor: grabbing;
}

/* 挂坠挂钩 */
.pendant-hook {
  position: relative;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle at 30% 30%, #8b7355, #654c3f);
  border-radius: 50%;
  border: 2px solid #4a3829;
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: -2px;
  margin-bottom: -4px;
  z-index: 2;
}

.pendant-hook::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: #3e2f23;
  border-radius: 50%;
}

.pendant-body {
  width: 55px;
  height: 70px;
  background: radial-gradient(ellipse at 40% 30%,
    #c9b037,
    #b8941f 40%,
    #8b6914 80%
  );
  border-radius: 28px 28px 10px 10px / 35px 35px 10px 10px;
  border: 3px solid #6b5310;
  box-shadow: 
    inset 0 3px 6px rgba(255, 255, 255, 0.4),
    inset 0 -3px 6px rgba(0, 0, 0, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.pendant-decoration {
  width: 26px;
  height: 26px;
  border: 2px solid #6b5310;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  margin-bottom: 6px;
}

.pendant-text {
  font-size: 13px;
  font-weight: 700;
  color: #3e2f23;
  font-family: 'KaiTi', '楷体', serif;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

/* 历史事件卡片 */
.event-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  max-width: 800px;
  background: rgba(14, 22, 40, 0.97);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  padding: 0;
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(139, 115, 85, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: white;
  z-index: 20;
  overflow: hidden;
}

/* 事件卡片内容布局 */
.event-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.event-left {
  width: 100%;
  position: relative;
  background: linear-gradient(135deg, rgba(139, 115, 85, 0.15), rgba(101, 76, 63, 0.15));
}

.event-image-wrapper {
  position: relative;
  width: 100%;
  height: 420px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.92;
  filter: brightness(0.88) contrast(1.08);
  transition: all 0.5s ease;
}

.event-card:hover .event-image {
  transform: scale(1.05);
  filter: brightness(0.92) contrast(1.12);
}

.event-year-badge {
  position: absolute;
  top: 25px;
  left: 25px;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(201, 176, 55, 0.96), rgba(180, 148, 31, 0.96));
  border-radius: 14px;
  font-size: 2rem;
  font-weight: 800;
  color: #2a1f1a;
  font-family: 'Georgia', serif;
  box-shadow: 
    0 5px 20px rgba(0, 0, 0, 0.6),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
}

.event-right {
  width: 100%;
  padding: 30px 40px 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.event-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f5f1e8;
  margin-bottom: 16px;
  font-family: 'KaiTi', '楷体', serif;
  line-height: 1.4;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.event-divider {
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, transparent, #c9b037 20%, #c9b037 80%, transparent);
  margin: 0 auto 22px;
}

.event-description {
  font-size: 1.1rem;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Microsoft YaHei', sans-serif;
  text-align: center;
  max-width: 90%;
}

.event-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(14, 22, 40, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 115, 85, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.event-close:hover {
  background: rgba(139, 115, 85, 0.3);
  border-color: rgba(139, 115, 85, 0.8);
  transform: rotate(90deg);
}

/* 事件卡片动画 */
.event-fade-enter-active {
  animation: eventFadeIn 0.5s ease-out;
}

.event-fade-leave-active {
  animation: eventFadeOut 0.3s ease-in;
}

@keyframes eventFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.85);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes eventFadeOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.85);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .clock-body {
    width: 300px;
    height: 300px;
  }
  
  .clock-face {
    width: 250px;
    height: 250px;
  }
  
  .year-text {
    font-size: 11px;
  }
  
  .clock-hand {
    width: 110px;
  }
  
  .event-card {
    width: 95%;
    max-width: 600px;
  }
  
  .event-image-wrapper {
    height: 250px;
  }
  
  .event-right {
    padding: 20px 25px 25px;
  }
  
  .event-year-badge {
    top: 15px;
    left: 15px;
    padding: 8px 16px;
    font-size: 1.5rem;
    letter-spacing: 1px;
  }
  
  .event-title {
    font-size: 1.4rem;
    margin-bottom: 14px;
  }
  
  .event-description {
    font-size: 1rem;
    line-height: 1.7;
  }
  
  .event-divider {
    margin-bottom: 16px;
  }
}
</style>
