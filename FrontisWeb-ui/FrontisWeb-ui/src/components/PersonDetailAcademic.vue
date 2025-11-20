<template>
  <div class="person-detail-academic">
    <!-- 顶部导航栏 -->
    <nav class="academic-nav">
      <div class="nav-wrapper">
        <!-- 左上角返回按钮 -->
        <button @click="goBack" class="back-btn-left">
            <i class="fas fa-arrow-left"></i>
            返回
        </button>
        
        <!-- 中间导航项 -->
        <div class="nav-tabs">
          <button 
            @click="scrollToSection('knowledge')" 
            class="nav-tab-item"
            :class="{ active: activeSection === 'knowledge' }"
          >
            <i class="fas fa-file-alt"></i>
            <span>人物信息</span>
          </button>
          <button 
            @click="scrollToSection('relationship')" 
            class="nav-tab-item"
            :class="{ active: activeSection === 'relationship' }"
          >
            <i class="fas fa-project-diagram"></i>
            <span>关系图谱</span>
          </button>
          <button 
            @click="scrollToSection('timeline')" 
            class="nav-tab-item"
            :class="{ active: activeSection === 'timeline' }"
          >
            <i class="fas fa-clock"></i>
            <span>时间轴</span>
          </button>
          <button 
            @click="scrollToSection('achievements')" 
            class="nav-tab-item"
            :class="{ active: activeSection === 'achievements' }"
          >
            <i class="fas fa-trophy"></i>
            <span>荣誉成就</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主要内容区 -->
    <main class="main-content" id="introduction-section" v-show="activeSection !== 'relationship' && activeSection !== 'timeline' && activeSection !== 'achievements'">
      <div class="content-wrapper">
        <!-- 左侧栏 - 人物照片 -->
        <aside class="person-sidebar">
          <div class="person-photo">
            <div class="photo-placeholder" v-if="!imageLoaded">
              <i class="fas fa-user"></i>
            </div>
            <img 
              :src="displayImage" 
              :alt="personData.name"
              class="photo-image"
              :class="{ loaded: imageLoaded }"
              @load="onImageLoad"
              @error="onImageError"
            />
          </div>
          
          <!-- 人物标题 -->
          <header class="person-header-sidebar">
            <h1 class="person-name-sidebar">{{ personData.name }}</h1>
            <p class="person-subtitle-sidebar" v-if="personData.subtitle">{{ personData.subtitle }}</p>
          </header>
        </aside>

        <!-- 右侧主内容区 -->
        <div class="person-main-content">
          <!-- 人物简介 -->
          <section class="person-biography">
            <h2 class="section-heading">人物简介</h2>
            
            <!-- 调试信息 -->
            <div v-if="!getBiographyParagraphs() || getBiographyParagraphs().length === 0" style="padding: 20px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; margin-bottom: 20px;">
              <p style="margin: 0; color: #856404;">⚠️ 暂无人物简介数据</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #856404;">Biography数据: {{ personData.biography ? `存在${personData.biography.length}条记录` : '不存在' }}</p>
            </div>
            
            <div class="biography-content">
              <!-- 从biography或summary中提取内容 -->
              <div 
                v-for="(paragraph, index) in getBiographyParagraphs()" 
                :key="index"
                class="bio-paragraph"
              >
                <p v-html="formatParagraph(paragraph)"></p>
              </div>
            </div>
          </section>

          <!-- 教育经历（如果有） -->
          <section class="education-section" v-if="personData.educationHistory && personData.educationHistory.length > 0">
            <h2 class="section-heading">教育经历</h2>
            <ul class="education-list">
              <li 
                v-for="(edu, index) in personData.educationHistory" 
                :key="index"
                class="education-item"
              >
                <span class="edu-year">{{ edu.year }}</span>
                <span class="edu-content">{{ edu.content }}</span>
              </li>
            </ul>
          </section>

          <!-- 工作经历（如果有） -->
          <section class="career-section" v-if="personData.careerHistory && personData.careerHistory.length > 0">
            <h2 class="section-heading">工作经历</h2>
            <ul class="career-list">
              <li 
                v-for="(career, index) in personData.careerHistory" 
                :key="index"
                class="career-item"
              >
                <span class="career-year">{{ career.year }}</span>
                <span class="career-content">{{ career.content }}</span>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </main>

    <!-- 人物关系图谱 - 使用v-if控制显示 -->
    <section 
      class="relationship-section-fullwidth" 
      id="relationship-section"
      v-if="activeSection === 'relationship'"
    >
      <RelationshipGraph ref="relationshipGraph" :personId="personData.id" />
    </section>

    <!-- 荣誉成就区域 - 点击荣誉成就按钮时显示 -->
    <section class="achievements-section-fullwidth" id="achievements-section" v-if="activeSection === 'achievements'">
      <div class="achievements-container-fullwidth">
        <h2 class="achievements-title">荣誉成就</h2>
        <div class="achievements-list-fullwidth" v-if="personData.keyTags && personData.keyTags.length > 0">
          <div 
            v-for="(tag, index) in personData.keyTags" 
            :key="index"
            class="achievement-item-fullwidth"
          >
            <div class="achievement-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="achievement-content">
              <h3 class="achievement-title">{{ tag }}</h3>
            </div>
          </div>
        </div>
        <div v-else class="no-achievements-data">
          <i class="fas fa-info-circle"></i>
          <p>暂无荣誉成就数据</p>
        </div>
      </div>
    </section>

    <!-- 时间轴区域 - 使用胶片式时间轴 -->
    <section class="timeline-section-fullwidth" id="timeline-section" v-if="activeSection === 'timeline'">
      <!-- 加载中状态 -->
      <div v-if="isLoadingEvents" class="loading-timeline-data">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
      
      <!-- 胶片时间轴 -->
      <FilmTimeline 
        v-else-if="timelineEvents && timelineEvents.length > 0" 
        :timelineEvents="timelineEvents"
      />
      
      <!-- 无数据状态 -->
      <div v-else class="no-timeline-data">
        <i class="fas fa-info-circle"></i>
        <p>暂无时间轴数据</p>
      </div>
    </section>

    <!-- 页脚 - 只在非关系图谱、时间轴和荣誉成就模式下显示 -->
    <footer class="academic-footer" v-if="activeSection !== 'relationship' && activeSection !== 'timeline' && activeSection !== 'achievements'">
      <div class="footer-content">
        <p>版权所有 ©成都理工大学数字校史馆</p>
        <p>地址：四川省成都市成华区二仙桥东三路1号 邮编：610059</p>
        <p>预约服务电话：028-84079999 电子邮箱：xsg@cdut.edu.cn</p>
      </div>
    </footer>
  </div>
</template>

<script>
import RelationshipGraph from './RelationshipGraph.vue'
import FilmTimeline from './FilmTimeline.vue'
import { getPersonImage, getUnknownImage } from '@/utils/imageLoader'
import { getPersonEvents } from '@/services/personDataService'

const unknownImg = getUnknownImage()

export default {
  name: 'PersonDetailAcademic',
  components: {
    RelationshipGraph,
    FilmTimeline
  },
  props: {
    personData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imageLoaded: false,
      // 当前激活的标签
      activeSection: 'knowledge', // 'knowledge' | 'relationship' | 'timeline' | 'achievements'
      unknownImg: unknownImg,
      // 时间轴事件数据
      timelineEvents: [],
      isLoadingEvents: false
    }
  },
  computed: {
    // 处理人物图片 - 使用imageLoader统一加载
    displayImage() {
      console.log('🖼️ [displayImage] personData.image:', this.personData?.image)
      console.log('🖼️ [displayImage] personData.id:', this.personData?.id)
      
      if (!this.personData || !this.personData.image) {
        console.log('🖼️ [displayImage] 没有图片数据，使用unknown')
        return unknownImg
      }
      
      // 使用imageLoader加载图片
      const image = getPersonImage(this.personData.image)
      console.log('🖼️ [displayImage] 加载结果:', image)
      
      return image || unknownImg
    }
  },
  async mounted() {
    // 组件挂载完成
    console.log('✅ [PersonDetailAcademic] 组件已挂载')
    console.log('📊 [PersonDetailAcademic] 接收到的personData:', this.personData)
    console.log('📊 [PersonDetailAcademic] personData.name:', this.personData?.name)
    console.log('📊 [PersonDetailAcademic] personData.biography长度:', this.personData?.biography?.length)
    
    if (!this.personData) {
      console.error('❌ [PersonDetailAcademic] personData为空！')
    }
    
    if (!this.personData?.biography || this.personData.biography.length === 0) {
      console.warn('⚠️ [PersonDetailAcademic] biography数据为空')
    }
    
    // 加载时间轴事件数据
    await this.loadTimelineEvents()
  },
  methods: {
    goBack() {
      // 检查来源参数
      const from = this.$route.query.from;
      
      if (from === 'keyword-rain') {
        // 从倾听雨声来的，返回倾听雨声
        this.$router.push('/keyword-rain');
      } else if (from === 'draw-reveal') {
        // 从涂鸦揭秘来的，返回涂鸦揭秘
        this.$router.push('/draw-reveal');
      } else if (from === 'persons') {
        // 从人物列表来的，返回人物列表
        this.$router.push('/persons');
      } else {
        // 默认返回人物列表
        this.$router.push('/persons');
      }
    },
    
    // 加载时间轴事件
    async loadTimelineEvents() {
      if (!this.personData || !this.personData.id) {
        console.warn('[PersonDetailAcademic] 无法加载事件：personData或id不存在')
        return
      }
      
      this.isLoadingEvents = true
      try {
        console.log(`[PersonDetailAcademic] 开始加载人物事件: ${this.personData.id}`)
        const events = await getPersonEvents(this.personData.id)
        console.log(`[PersonDetailAcademic] 获取到 ${events.length} 条事件:`, events)
        this.timelineEvents = events
      } catch (error) {
        console.error('[PersonDetailAcademic] 加载事件失败:', error)
        this.timelineEvents = []
      } finally {
        this.isLoadingEvents = false
      }
    },
    
    // 滚动到指定区域
    scrollToSection(section) {
      this.activeSection = section
      
      // 如果是关系图谱或时间轴，直接显示，不需要滚动
      if (section === 'relationship' || section === 'timeline') {
        // 关系图谱或时间轴直接显示，隐藏人物介绍
        this.$nextTick(() => {
          // 滚动到顶部，确保内容可见
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
          
          // 如果是关系图谱，延迟调用居中方法
          if (section === 'relationship') {
            setTimeout(() => {
              if (this.$refs.relationshipGraph && this.$refs.relationshipGraph.triggerCenter) {
                this.$refs.relationshipGraph.triggerCenter()
              }
            }, 500)
          }
        })
        return
      }
      
      // 其他区域需要滚动
      let targetElement = null
      if (section === 'knowledge') {
        targetElement = document.getElementById('introduction-section')
      } else if (section === 'achievements') {
        // 荣誉成就 - 切换到荣誉成就视图
        this.activeSection = 'achievements'
        return
      }
      
      if (targetElement) {
        // 使用原生平滑滚动
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    },
    getBiographyParagraphs() {
      const paragraphs = []
      
      console.log('[PersonDetailAcademic] 开始处理biography数据')
      console.log('[PersonDetailAcademic] personData:', this.personData)
      
      // 优先使用summary
      if (this.personData.summary) {
        console.log('[PersonDetailAcademic] 使用summary:', this.personData.summary)
        paragraphs.push(this.personData.summary)
      }
      
      // 从biography中提取段落
      if (this.personData.biography && this.personData.biography.length > 0) {
        console.log('[PersonDetailAcademic] biography数组长度:', this.personData.biography.length)
        console.log('[PersonDetailAcademic] biography数据:', JSON.stringify(this.personData.biography, null, 2))
        
        this.personData.biography.forEach((bio, index) => {
          console.log(`[PersonDetailAcademic] 处理第${index}个biography:`, bio)
          console.log(`[PersonDetailAcademic] bio.content存在:`, !!bio.content)
          console.log(`[PersonDetailAcademic] bio.content类型:`, typeof bio.content)
          console.log(`[PersonDetailAcademic] bio.content长度:`, bio.content?.length)
          
          if (bio.content) {
            // 保留HTML格式，直接使用content
            paragraphs.push(bio.content)
            console.log(`[PersonDetailAcademic] 已添加第${index}个content`)
          } else {
            console.warn(`[PersonDetailAcademic] 第${index}个biography没有content`)
          }
        })
      } else {
        console.warn('[PersonDetailAcademic] biography为空或不存在')
        console.warn('[PersonDetailAcademic] biography值:', this.personData.biography)
      }
      
      console.log('[PersonDetailAcademic] 提取到的paragraphs数量:', paragraphs.length)
      
      // 如果没有内容，生成默认介绍
      if (paragraphs.length === 0) {
        console.warn('[PersonDetailAcademic] 没有biography数据，使用默认介绍')
        paragraphs.push(
          `${this.personData.name}${this.personData.subtitle ? `，${this.personData.subtitle}` : ''}。是一位杰出的学者和教育家，在学术研究和人才培养方面做出了卓越的贡献。`,
          `在学术领域，${this.personData.name}长期致力于科研工作，取得了一系列重要的研究成果，为学科发展做出了重要贡献。`,
          `除了学术成就，${this.personData.name}还致力于教育事业，培养了大批优秀的学生和科研人才，他们在各自的领域都取得了显著的成就。`,
          `${this.personData.name}的品格和精神，激励着一代又一代的学者和学生，是学术界的典范和楷模。`
        )
      }
      
      return paragraphs
    },
    getRelatedLinks() {
      const links = []
      
      // 可以从achievements中的resources提取链接
      if (this.personData.achievements) {
        this.personData.achievements.forEach(achievement => {
          if (achievement.resources) {
            achievement.resources.forEach(resource => {
              if (resource.type === 'link' && resource.url) {
                links.push({
                  title: resource.name || achievement.title,
                  url: resource.url
                })
              }
            })
          }
        })
      }
      
      return links
    },
    onImageLoad() {
      this.imageLoaded = true
    },
    onImageError() {
      this.imageLoaded = false
    },
    formatParagraph(text) {
      // 格式化段落，确保标点符号正确
      if (!text) return ''
      // 如果已经包含HTML标签，直接返回
      if (text.includes('<') && text.includes('>')) {
        return text
      }
      // 否则包装成段落
      return `<p>${text}</p>`
    }
  }
}
</script>

<style scoped>
/* 基础样式 - 仿北大校史馆风格 */
.person-detail-academic {
  background: #ffffff;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'SimSun', serif;
  color: #333333;
  overflow-x: hidden;
}

/* 顶部导航栏 */
.academic-nav {
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  gap: 40px;
  height: 60px;
}

/* 左上角返回按钮 */
.back-btn-left {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  color: #666;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.back-btn-left:hover {
  background: #f5f5f5;
  color: #333;
}

.back-btn-left i {
  font-size: 14px;
}

/* 中间导航项 */
.nav-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
  justify-content: center;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-tabs::-webkit-scrollbar {
  display: none;
}

.nav-tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: transparent;
  color: #666;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
}

.nav-tab-item:hover {
  color: #0066cc;
  background: #f8f9fa;
}

.nav-tab-item.active {
  color: #0066cc;
  border-bottom-color: #0066cc;
}

.nav-tab-item i {
  font-size: 16px;
}

.nav-tab-item span {
  font-size: 14px;
}

/* 主内容区 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  margin-top: 20px;
}

/* 左侧栏 */
.person-sidebar {
  height: fit-content;
  align-self: start;
}

.person-photo {
  width: 100%;
  max-width: 280px;
  height: 300px;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
  background: #f0f0f0;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 60px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.photo-image {
  width: 100%;
  height: auto;
  max-width: 280px;
  max-height: 400px;
  object-fit: contain;
  display: block;
  opacity: 0;
  transition: opacity 0.5s ease;
  position: relative;
  z-index: 2;
}

.photo-image.loaded {
  opacity: 1;
}

/* 左侧栏人物标题 */
.person-header-sidebar {
  margin-bottom: 20px;
}

.person-name-sidebar {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px 0;
  letter-spacing: 0.5px;
  line-height: 1.3;
}

.person-subtitle-sidebar {
  font-size: 14px;
  color: #666;
  margin: 0 0 15px 0;
  line-height: 1.6;
}

.person-tags-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag-item-sidebar {
  display: inline-block;
  padding: 5px 12px;
  background: #f0f7ff;
  color: #0066cc;
  border: 1px solid #cce5ff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.basic-info-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.6;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  min-width: 80px;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  font-weight: 500;
  flex: 1;
}

/* 右侧主内容 */
.person-main-content {
  min-height: 600px;
}

/* 右侧主内容区域不再需要person-header样式，已移至左侧栏 */

/* 章节标题 */
.section-heading {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 18px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #0066cc;
  position: relative;
  overflow: hidden;
}

.section-heading::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 2px;
  background: #0066cc;
}

/* 人物简介 */
.person-biography {
  margin-bottom: 30px;
}

.biography-content {
  font-size: 16px;
  line-height: 2;
  color: #444;
  text-align: justify;
}

.bio-paragraph {
  margin-bottom: 25px;
  text-indent: 2em;
}

.bio-paragraph:first-child {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.bio-paragraph p {
  margin: 0;
}

/* 教育经历 */
.education-section {
  margin-bottom: 30px;
}

.education-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.education-item {
  display: flex;
  gap: 30px;
  padding: 15px 0;
  border-bottom: 1px dotted #e0e0e0;
  font-size: 15px;
  line-height: 1.8;
}

.education-item:last-child {
  border-bottom: none;
}

.edu-year {
  color: #0066cc;
  font-weight: 600;
  min-width: 100px;
  flex-shrink: 0;
}

.edu-content {
  color: #444;
  flex: 1;
}

/* 工作经历 */
.career-section {
  margin-bottom: 30px;
}

.career-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.career-item {
  display: flex;
  gap: 30px;
  padding: 15px 0;
  border-bottom: 1px dotted #e0e0e0;
  font-size: 15px;
  line-height: 1.8;
}

.career-item:last-child {
  border-bottom: none;
}

.career-year {
  color: #0066cc;
  font-weight: 600;
  min-width: 100px;
  flex-shrink: 0;
}

.career-content {
  color: #444;
  flex: 1;
}

/* 时间轴样式 */
.timeline-section {
  margin-bottom: 50px;
}

.timeline-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px dotted #e0e0e0;
  font-size: 15px;
  line-height: 1.8;
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-year {
  color: #0066cc;
  font-weight: 600;
  min-width: 80px;
  flex-shrink: 0;
}

.timeline-content {
  color: #444;
  flex: 1;
}

/* 关系图谱样式 - 全宽全高显示 */
.relationship-section-fullwidth {
  width: 100%;
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  border: none;
  background: #f9f9f9;
  clear: both;
  text-align: center;
  min-height: calc(100vh - 60px);
  overflow: hidden;
}

.relationship-section-fullwidth :deep(.relationship-graph-container) {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  text-align: left;
  height: 100%;
}

/* 时间轴样式 - 全宽全高显示 */
.timeline-section-fullwidth {
  width: 100%;
  position: relative;
  display: block;
  margin: 0;
  padding: 40px 20px 20px 20px;
  border: none;
  background: #f9f9f9;
  clear: both;
  overflow-y: auto;
}

.timeline-container-fullwidth {
  max-width: 1200px;
  margin: 0 auto;
}

.timeline-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ec4899;
}

.timeline-list-fullwidth {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-item-fullwidth {
  display: flex;
  gap: 30px;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #e5e7eb;
}

.timeline-item-fullwidth:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateX(5px);
}

.timeline-item-fullwidth.important {
  border-left-color: #ec4899;
  background: linear-gradient(to right, #fce7f3 0%, white 10%);
}

.timeline-year-fullwidth {
  font-size: 24px;
  font-weight: bold;
  color: #ec4899;
  min-width: 100px;
  text-align: center;
  padding: 10px;
  background: #fce7f3;
  border-radius: 8px;
  height: fit-content;
}

.timeline-content-fullwidth {
  flex: 1;
}

.timeline-event-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.timeline-event-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.timeline-achievements {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.achievement-tag {
  display: inline-block;
  padding: 6px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 6px;
  font-size: 14px;
}

.no-timeline-data {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.no-timeline-data i {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
}

.no-timeline-data p {
  font-size: 18px;
}

/* 荣誉成就区域样式 */
.achievements-section-fullwidth {
  min-height: 100vh;
  padding: 80px 40px 40px;
  background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #e0e7ff 100%);
}

.achievements-container-fullwidth {
  max-width: 1200px;
  margin: 0 auto;
}

.achievements-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #f59e0b;
}

.achievements-list-fullwidth {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.achievement-item-fullwidth {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #f59e0b;
}

.achievement-item-fullwidth:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
  border-left-color: #dc2626;
}

.achievement-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.achievement-icon i {
  font-size: 24px;
  color: white;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.5;
}

.no-achievements-data {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.no-achievements-data i {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
}

.no-achievements-data p {
  font-size: 18px;
}

/* 时间轴加载状态 */
.loading-timeline-data {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.loading-timeline-data .spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid #f3f4f6;
  border-top-color: #ec4899;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-timeline-data p {
  font-size: 18px;
}

/* 时间轴标签样式 */
.timeline-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag-badge {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: white;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

/* 页脚 */
.academic-footer {
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  padding: 20px 0;
  margin-top: 30px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  text-align: center;
  font-size: 14px;
  color: #666;
  line-height: 2;
}

.footer-content p {
  margin: 5px 0;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .person-sidebar {
    position: static;
  }
  
  .person-photo {
    max-width: 300px;
    margin: 0 auto 25px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px;
  }
  
  .nav-wrapper {
    padding: 0 15px;
    gap: 15px;
    height: 50px;
  }
  
  .back-btn-left {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .nav-tabs {
    gap: 0;
    justify-content: flex-start;
  }
  
  .nav-tab-item {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .nav-tab-item i {
    font-size: 14px;
  }
  
  .nav-tab-item span {
    font-size: 13px;
  }
  
  .person-name {
    font-size: 28px;
  }
  
  .section-heading {
    font-size: 20px;
  }
  
  .bio-paragraph {
    text-indent: 0;
    margin-bottom: 20px;
  }
  
  .education-item,
  .career-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .edu-year,
  .career-year {
    min-width: auto;
  }
}
</style>

