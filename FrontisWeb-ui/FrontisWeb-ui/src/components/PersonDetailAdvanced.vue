<template>
  <div class="person-detail-advanced" ref="pageContainer">
    <!-- 返回按钮 -->
    <div class="back-section">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        返回成理人物
      </button>
    </div>

    <!-- 固定侧边导航 -->
    <aside class="sticky-sidebar" :class="{ 'show': showSidebar }">
      <nav class="section-nav">
        <button 
          v-for="section in sections" 
          :key="section.id"
          :class="['nav-item', { active: activeSection === section.id }]"
          @click="scrollToSection(section.id)"
        >
          <i :class="section.icon"></i>
          <span>{{ section.name }}</span>
        </button>
      </nav>
      <button class="back-to-top" @click="scrollToTop" v-show="showBackToTop">
        <i class="fas fa-arrow-up"></i>
      </button>
    </aside>

    <!-- 首屏 Banner - 视差滚动效果 -->
    <section class="banner-section parallax-section" id="banner" ref="banner">
      <div class="parallax-bg" :style="parallaxStyle">
        <div class="bg-overlay"></div>
        <div class="particle-container" ref="particles"></div>
      </div>
      
      <div class="banner-content" :style="bannerContentStyle">
        <div class="avatar-container" data-aos="zoom-in">
          <div class="avatar-frame">
            <img :src="personData.image" :alt="personData.name" class="avatar-image">
            <div class="avatar-glow"></div>
          </div>
        </div>
        
        <h1 class="person-name" data-aos="fade-up" data-aos-delay="200">
          {{ personData.name }}
        </h1>
        
        <p class="person-title" data-aos="fade-up" data-aos-delay="300">
          {{ personData.subtitle }}
        </p>
        
        <div class="key-tags" data-aos="fade-up" data-aos-delay="400">
          <span 
            v-for="(tag, index) in personData.keyTags" 
            :key="index"
            class="tag-item"
            :style="{ animationDelay: `${0.5 + index * 0.1}s` }"
          >
            {{ tag }}
          </span>
        </div>
        
        <div class="scroll-indicator" @click="scrollToNextSection">
          <i class="fas fa-chevron-down"></i>
          <span>探索更多</span>
        </div>
      </div>
    </section>

    <!-- 人物概览 - 交互时间轴 -->
    <!-- 🔍 调试：检查section是否渲染 -->
    <section class="overview-section" id="overview" style="background: white; min-height: 500px; padding: 100px 0;">
      <div class="container">
        <h2 class="section-title" data-aos="fade-right" style="color: #2c3e50; font-size: 36px; margin-bottom: 50px;">
          <span class="title-icon"><i class="fas fa-clock"></i></span>
          生平时间轴
        </h2>
        
        <div class="timeline-container">
          <div class="timeline-controls">
            <button @click="timelineMode = 'horizontal'" :class="{ active: timelineMode === 'horizontal' }">
              <i class="fas fa-arrows-alt-h"></i> 横向
            </button>
            <button @click="timelineMode = 'vertical'" :class="{ active: timelineMode === 'vertical' }">
              <i class="fas fa-arrows-alt-v"></i> 纵向
            </button>
          </div>
          
          <div :class="['timeline', timelineMode]" ref="timeline">
            <!-- 调试信息 -->
            <div v-if="!personData.timeline || personData.timeline.length === 0" style="padding: 40px; text-align: center; color: #999;">
              <p>⚠️ 时间轴数据加载中或暂无数据</p>
              <p style="font-size: 12px;">Timeline数据: {{ personData.timeline ? '存在但为空' : '不存在' }}</p>
            </div>
            <div 
              v-for="(event, index) in (personData.timeline || [])" 
              :key="index"
              :class="['timeline-item', { 'active': expandedEvent === index }]"
              @click="toggleEvent(index)"
              :data-aos="timelineMode === 'vertical' ? 'fade-up' : 'fade-left'"
              :data-aos-delay="index * 100"
            >
              <div class="timeline-dot" :class="getEventImportance(event.importance)">
                <div class="dot-pulse"></div>
              </div>
              
              <div class="timeline-content">
                <div class="timeline-year">{{ event.year }}</div>
                <div class="timeline-title">{{ event.title }}</div>
                
                <transition name="expand">
                  <div v-if="expandedEvent === index" class="timeline-detail">
                    <div class="detail-grid">
                      <div class="detail-text">
                        <p>{{ event.description }}</p>
                        <ul v-if="event.achievements">
                          <li v-for="(achievement, i) in event.achievements" :key="i">
                            {{ achievement }}
                          </li>
                        </ul>
                      </div>
                      <div class="detail-media" v-if="event.media">
                        <img v-if="event.media.type === 'image'" :src="event.media.url" :alt="event.title">
                        <video v-else-if="event.media.type === 'video'" :src="event.media.url" controls></video>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 生平详情 - 分屏滚动 -->
    <!-- 🔍 调试：检查section是否渲染 -->
    <section class="biography-section" id="biography" style="background: #f5f7fa; min-height: 500px; padding: 100px 0;">
      <div class="split-screen-container">
        <!-- 调试信息 -->
        <div v-if="!personData.biography || personData.biography.length === 0" style="padding: 40px; text-align: center; color: #999;">
          <p>⚠️ 生平详情数据加载中或暂无数据</p>
          <p style="font-size: 12px;">Biography数据: {{ personData.biography ? '存在但为空' : '不存在' }}</p>
        </div>
        <div 
          v-for="(chapter, index) in (personData.biography || [])" 
          :key="index"
          class="chapter-block"
        >
          <div class="chapter-content">
            <div class="text-side" data-aos="fade-right">
              <h3 class="chapter-title">{{ chapter.title }}</h3>
              <div class="chapter-text" v-html="chapter.content"></div>
              <div class="chapter-tags" v-if="chapter.tags">
                <span v-for="tag in chapter.tags" :key="tag" class="bio-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <div class="media-side" data-aos="fade-left" data-aos-delay="200">
              <div class="media-frame sticky-media">
                <img v-if="chapter.mediaType === 'image'" :src="chapter.mediaUrl" :alt="chapter.title">
                <video v-else-if="chapter.mediaType === 'video'" :src="chapter.mediaUrl" controls></video>
                <div v-else-if="chapter.mediaType === '360'" class="panorama-viewer">
                  <iframe :src="chapter.mediaUrl" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 代表成就/作品 - 卡片网格 -->
    <!-- 🔍 调试：检查section是否渲染 -->
    <section class="achievements-section" id="achievements" style="background: white; min-height: 500px; padding: 100px 0;">
      <div class="container">
        <h2 class="section-title" data-aos="fade-right" style="color: #2c3e50; font-size: 36px; margin-bottom: 50px;">
          <span class="title-icon"><i class="fas fa-trophy"></i></span>
          代表成就与作品
        </h2>
        
        <div class="filter-tabs">
          <button 
            v-for="category in achievementCategories" 
            :key="category"
            :class="['filter-btn', { active: selectedCategory === category }]"
            @click="filterAchievements(category)"
          >
            {{ category }}
          </button>
        </div>
        
        <!-- 调试信息 -->
        <div v-if="!filteredAchievements || filteredAchievements.length === 0" style="padding: 40px; text-align: center; color: #999;">
          <p>⚠️ 成就数据加载中或暂无数据</p>
          <p style="font-size: 12px;">Achievements数据: {{ personData.achievements ? (personData.achievements.length || '存在但为空') : '不存在' }}</p>
        </div>
        <div class="achievements-grid">
          <div 
            v-for="(item, index) in (filteredAchievements || [])" 
            :key="index"
            class="achievement-card"
            @click="showAchievementDetail(item)"
            data-aos="zoom-in"
            :data-aos-delay="index * 50"
          >
            <div class="card-icon">
              <i :class="getAchievementIcon(item.type)"></i>
            </div>
            <h4 class="card-title">{{ item.title }}</h4>
            <p class="card-year">{{ item.year }}</p>
            <p class="card-summary">{{ item.summary }}</p>
            <div class="card-tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="card-hover-overlay">
              <i class="fas fa-search-plus"></i>
              <span>查看详情</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 多媒体互动 -->
    <section class="multimedia-section" id="multimedia">
      <div class="container">
        <h2 class="section-title" data-aos="fade-right">
          <span class="title-icon"><i class="fas fa-photo-video"></i></span>
          多媒体资源
        </h2>
        
        <div class="media-tabs">
          <button 
            v-for="tab in mediaTabs" 
            :key="tab.id"
            :class="['media-tab', { active: activeMediaTab === tab.id }]"
            @click="activeMediaTab = tab.id"
          >
            <i :class="tab.icon"></i>
            {{ tab.name }}
          </button>
        </div>
        
        <div class="media-content">
          <!-- 视频讲座 -->
          <div v-if="activeMediaTab === 'videos'" class="video-gallery">
            <div 
              v-for="video in personData.videos" 
              :key="video.id"
              class="video-item"
              @click="playVideo(video)"
              data-aos="fade-up"
            >
              <div class="video-thumbnail">
                <img :src="video.thumbnail" :alt="video.title">
                <div class="play-overlay">
                  <i class="fas fa-play-circle"></i>
                </div>
                <span class="video-duration">{{ video.duration }}</span>
              </div>
              <h4>{{ video.title }}</h4>
              <p>{{ video.description }}</p>
            </div>
          </div>
          
          <!-- 音频故事 -->
          <div v-if="activeMediaTab === 'audios'" class="audio-gallery">
            <div 
              v-for="audio in personData.audios" 
              :key="audio.id"
              class="audio-item"
              data-aos="fade-up"
            >
              <div class="audio-player">
                <button class="play-btn" @click="toggleAudio(audio)">
                  <i :class="currentAudio === audio.id && isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
                </button>
                <div class="audio-info">
                  <h4>{{ audio.title }}</h4>
                  <p>{{ audio.description }}</p>
                </div>
                <div class="audio-duration">{{ audio.duration }}</div>
              </div>
            </div>
          </div>
          
          <!-- VR/360漫游 -->
          <div v-if="activeMediaTab === 'vr'" class="vr-gallery">
            <div 
              v-for="vr in personData.vrScenes" 
              :key="vr.id"
              class="vr-item"
              @click="openVR(vr)"
              data-aos="zoom-in"
            >
              <div class="vr-preview">
                <img :src="vr.preview" :alt="vr.title">
                <div class="vr-overlay">
                  <i class="fas fa-vr-cardboard"></i>
                  <span>360° 全景</span>
                </div>
              </div>
              <h4>{{ vr.title }}</h4>
              <p>{{ vr.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 趣闻轶事 - 翻牌卡片 -->
    <section class="anecdotes-section" id="anecdotes">
      <div class="container">
        <h2 class="section-title" data-aos="fade-right">
          <span class="title-icon"><i class="fas fa-lightbulb"></i></span>
          趣闻轶事
        </h2>
        
        <div class="flip-cards-grid">
          <div 
            v-for="(story, index) in personData.anecdotes" 
            :key="index"
            :class="['flip-card', { flipped: flippedCards.includes(index) }]"
            @click="toggleFlip(index)"
            data-aos="flip-up"
            :data-aos-delay="index * 100"
          >
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="card-icon-large">
                  <i :class="story.icon || 'fas fa-star'"></i>
                </div>
                <h4>{{ story.title }}</h4>
                <p class="flip-hint">点击翻转</p>
              </div>
              <div class="flip-card-back">
                <div class="story-content">
                  <p>{{ story.content }}</p>
                  <div class="story-tags" v-if="story.tags">
                    <span v-for="tag in story.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 人物关系图谱 - 放在所有介绍内容之后 -->
    <section class="relationship-section" id="relationships">
      <div class="container">
        <h2 class="section-title" data-aos="fade-right">
          <span class="title-icon"><i class="fas fa-project-diagram"></i></span>
          人物关系图谱
        </h2>
        
        <!-- 使用统一的关系图谱组件 -->
        <RelationshipGraph :personId="personData.id" />
      </div>
    </section>

    <!-- 底部导航 & 互动入口 -->
    <footer class="page-footer">
      <div class="footer-actions">
        <button class="action-btn" @click="addToFavorites">
          <i :class="isFavorited ? 'fas fa-heart' : 'far fa-heart'"></i>
          <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
        </button>
        <button class="action-btn" @click="shareProfile">
          <i class="fas fa-share-alt"></i>
          <span>分享</span>
        </button>
        <button class="action-btn" @click="printProfile">
          <i class="fas fa-print"></i>
          <span>打印档案</span>
        </button>
        <button class="action-btn" @click="bookVisit">
          <i class="fas fa-calendar-check"></i>
          <span>预约参观</span>
        </button>
      </div>
      
      <div class="footer-nav">
        <button @click="goToHome">
          <i class="fas fa-home"></i>
          校史馆首页
        </button>
        <button @click="goToPersonList">
          <i class="fas fa-users"></i>
          其他人物
        </button>
        <button @click="goToDigitalMuseum">
          <i class="fas fa-globe"></i>
          数字馆
        </button>
      </div>
    </footer>

    <!-- 成就详情模态框 -->
    <transition name="modal">
      <div v-if="showAchievementModal" class="modal-overlay" @click="closeAchievementModal">
        <div class="modal-content achievement-modal" @click.stop>
          <button class="modal-close" @click="closeAchievementModal">
            <i class="fas fa-times"></i>
          </button>
          
          <div v-if="selectedAchievement" class="achievement-detail">
            <div class="detail-header">
              <div class="detail-icon">
                <i :class="getAchievementIcon(selectedAchievement.type)"></i>
              </div>
              <div class="detail-title-group">
                <h3>{{ selectedAchievement.title }}</h3>
                <p class="detail-year">{{ selectedAchievement.year }}</p>
              </div>
            </div>
            
            <div class="detail-body">
              <p class="detail-description">{{ selectedAchievement.description }}</p>
              
              <div v-if="selectedAchievement.highlights" class="detail-highlights">
                <h4>主要亮点</h4>
                <ul>
                  <li v-for="(highlight, i) in selectedAchievement.highlights" :key="i">
                    {{ highlight }}
                  </li>
                </ul>
              </div>
              
              <div v-if="selectedAchievement.resources" class="detail-resources">
                <h4>相关资源</h4>
                <div class="resource-links">
                  <a 
                    v-for="(resource, i) in selectedAchievement.resources" 
                    :key="i"
                    :href="resource.url"
                    target="_blank"
                    class="resource-link"
                  >
                    <i :class="getResourceIcon(resource.type)"></i>
                    {{ resource.name }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 视频播放器模态框 -->
    <transition name="modal">
      <div v-if="showVideoModal" class="modal-overlay" @click="closeVideoModal">
        <div class="modal-content video-modal" @click.stop>
          <button class="modal-close" @click="closeVideoModal">
            <i class="fas fa-times"></i>
          </button>
          <div class="video-player-container">
            <video v-if="currentVideo" :src="currentVideo.url" controls autoplay></video>
          </div>
          <div v-if="currentVideo" class="video-info">
            <h3>{{ currentVideo.title }}</h3>
            <p>{{ currentVideo.description }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AOS from 'aos'
import 'aos/dist/aos.css'
import RelationshipGraph from './RelationshipGraph.vue'

export default {
  name: 'PersonDetailAdvanced',
  components: {
    RelationshipGraph
  },
  props: {
    personData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 导航
      showSidebar: false,
      showBackToTop: false,
      activeSection: 'banner',
      sections: [
        { id: 'banner', name: '首页', icon: 'fas fa-home' },
        { id: 'overview', name: '时间轴', icon: 'fas fa-clock' },
        { id: 'biography', name: '生平', icon: 'fas fa-book' },
        { id: 'achievements', name: '成就', icon: 'fas fa-trophy' },
        { id: 'multimedia', name: '多媒体', icon: 'fas fa-photo-video' },
        { id: 'relationships', name: '关系网', icon: 'fas fa-project-diagram' },
        { id: 'anecdotes', name: '趣闻', icon: 'fas fa-lightbulb' }
      ],
      
      // 视差效果
      scrollY: 0,
      
      // 时间轴
      timelineMode: 'horizontal',
      expandedEvent: null,
      
      // 成就筛选
      selectedCategory: '全部',
      achievementCategories: ['全部', '论文', '专著', '项目', '奖项'],
      
      // 多媒体
      activeMediaTab: 'videos',
      mediaTabs: [
        { id: 'videos', name: '视频讲座', icon: 'fas fa-video' },
        { id: 'audios', name: '音频故事', icon: 'fas fa-microphone' },
        { id: 'vr', name: 'VR漫游', icon: 'fas fa-vr-cardboard' }
      ],
      currentAudio: null,
      isPlaying: false,
      
      // 翻牌卡片
      flippedCards: [],
      
      // 模态框
      showAchievementModal: false,
      selectedAchievement: null,
      showVideoModal: false,
      currentVideo: null,
      
      // 其他
      isFavorited: false
    }
  },
  computed: {
    parallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * 0.5}px)`
      }
    },
    bannerContentStyle() {
      return {
        transform: `translateY(${this.scrollY * 0.3}px)`,
        opacity: 1 - (this.scrollY / 800)
      }
    },
    filteredAchievements() {
      if (this.selectedCategory === '全部') {
        return this.personData.achievements || []
      }
      return (this.personData.achievements || []).filter(
        item => item.type === this.selectedCategory
      )
    }
  },
  mounted() {
    // 调试信息 - 检查数据完整性
    console.log('🎨 PersonDetailAdvanced 组件已挂载')
    console.log('📊 数据检查:', {
      hasPersonData: !!this.personData,
      name: this.personData?.name,
      timeline: this.personData?.timeline?.length || 0,
      biography: this.personData?.biography?.length || 0,
      achievements: this.personData?.achievements?.length || 0,
      fullPersonData: this.personData
    })
    
    // 初始化AOS动画
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    })
    
    // 监听滚动
    window.addEventListener('scroll', this.handleScroll)
    
    // 初始化粒子效果
    this.initParticles()
    
    // 初始化关系网络
    this.$nextTick(() => {
      this.initRelationshipNetwork()
      
      // 再次检查DOM元素是否存在
      setTimeout(() => {
        const overviewSection = document.querySelector('#overview')
        const biographySection = document.querySelector('#biography')
        const achievementsSection = document.querySelector('#achievements')
        
        console.log('🔍 DOM元素检查:', {
          overviewSection: !!overviewSection,
          biographySection: !!biographySection,
          achievementsSection: !!achievementsSection,
          overviewHeight: overviewSection?.offsetHeight || 0,
          biographyHeight: biographySection?.offsetHeight || 0
        })
        
        if (!overviewSection) {
          console.error('❌ 时间轴section不存在！')
        }
        if (!biographySection) {
          console.error('❌ 生平section不存在！')
        }
      }, 1000)
    })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    goBack() {
      this.$router.push('/persons')
    },
    
    handleScroll() {
      this.scrollY = window.pageYOffset
      this.showBackToTop = this.scrollY > 300
      this.showSidebar = this.scrollY > 100
      
      // 更新活动section
      this.updateActiveSection()
    },
    
    updateActiveSection() {
      const sections = this.sections.map(s => s.id)
      for (let id of sections) {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            this.activeSection = id
            break
          }
        }
      }
    },
    
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    
    scrollToNextSection() {
      this.scrollToSection('overview')
    },
    
    // 时间轴
    toggleEvent(index) {
      this.expandedEvent = this.expandedEvent === index ? null : index
    },
    
    getEventImportance(importance) {
      const levels = {
        high: 'importance-high',
        medium: 'importance-medium',
        low: 'importance-low'
      }
      return levels[importance] || 'importance-medium'
    },
    
    // 成就卡片
    filterAchievements(category) {
      this.selectedCategory = category
    },
    
    getAchievementIcon(type) {
      const icons = {
        '论文': 'fas fa-file-alt',
        '专著': 'fas fa-book',
        '项目': 'fas fa-project-diagram',
        '奖项': 'fas fa-award'
      }
      return icons[type] || 'fas fa-star'
    },
    
    showAchievementDetail(item) {
      this.selectedAchievement = item
      this.showAchievementModal = true
    },
    
    closeAchievementModal() {
      this.showAchievementModal = false
      setTimeout(() => {
        this.selectedAchievement = null
      }, 300)
    },
    
    getResourceIcon(type) {
      const icons = {
        pdf: 'fas fa-file-pdf',
        link: 'fas fa-link',
        video: 'fas fa-video',
        image: 'fas fa-image'
      }
      return icons[type] || 'fas fa-file'
    },
    
    // 多媒体
    playVideo(video) {
      this.currentVideo = video
      this.showVideoModal = true
    },
    
    closeVideoModal() {
      this.showVideoModal = false
      setTimeout(() => {
        this.currentVideo = null
      }, 300)
    },
    
    toggleAudio(audio) {
      if (this.currentAudio === audio.id) {
        this.isPlaying = !this.isPlaying
      } else {
        this.currentAudio = audio.id
        this.isPlaying = true
      }
      // 这里应该实际控制音频播放
    },
    
    openVR(vr) {
      window.open(vr.url, '_blank')
    },
    
    // 翻牌卡片
    toggleFlip(index) {
      const idx = this.flippedCards.indexOf(index)
      if (idx > -1) {
        this.flippedCards.splice(idx, 1)
      } else {
        this.flippedCards.push(index)
      }
    },
    
    // 粒子效果
    initParticles() {
      // 这里可以使用particles.js或自定义粒子效果
      // 简化版本，实际项目中可以使用第三方库
    },
    
    // 关系网络
    initRelationshipNetwork() {
      // 这里使用D3.js或vis.js创建力导向图
      // 由于篇幅限制，这里提供简化版本
      // 实际实现需要引入相关库
    },
    
    // 底部操作
    addToFavorites() {
      this.isFavorited = !this.isFavorited
      this.$emit('favorite-changed', this.isFavorited)
    },
    
    shareProfile() {
      if (navigator.share) {
        navigator.share({
          title: this.personData.name,
          text: this.personData.subtitle,
          url: window.location.href
        })
      } else {
        // 降级处理
        alert('分享链接: ' + window.location.href)
      }
    },
    
    printProfile() {
      window.print()
    },
    
    bookVisit() {
      alert('预约参观功能开发中')
    },
    
    goToHome() {
      this.$router.push('/')
    },
    
    goToPersonList() {
      this.$router.push('/persons')
    },
    
    goToDigitalMuseum() {
      this.$router.push('/explore')
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.person-detail-advanced {
  background: #f5f7fa;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 确保所有section都可见 */
section {
  position: relative;
  z-index: 1;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 特别确保非banner的section可见 */
.overview-section,
.biography-section,
.achievements-section,
.multimedia-section,
.relationship-section,
.anecdotes-section {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 200px !important;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* 固定侧边导航 */
.sticky-sidebar {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%) translateX(-100%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 0 15px 15px 0;
  padding: 20px 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.sticky-sidebar.show {
  transform: translateY(-50%) translateX(0);
}

.section-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  font-size: 14px;
}

.nav-item:hover {
  background: #f0f0f0;
  color: #4a90e2;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.back-to-top {
  margin-top: 20px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.back-to-top:hover {
  transform: translateY(-3px);
}

/* 首屏Banner - 视差效果 */
.banner-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
}

.parallax-bg {
  position: absolute;
  top: -50px;
  left: -50px;
  right: -50px;
  bottom: -50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
  background-position: center;
  will-change: transform;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.banner-content {
  position: relative;
  z-index: 10;
  text-align: center;
  will-change: transform, opacity;
}

.avatar-container {
  margin-bottom: 40px;
}

.avatar-frame {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
  border-radius: 50%;
  padding: 8px;
  background: linear-gradient(45deg, #fff, transparent);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
}

.avatar-glow {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.person-name {
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.person-title {
  font-size: 24px;
  margin-bottom: 40px;
  opacity: 0.95;
}

.key-tags {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.tag-item {
  padding: 10px 25px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  font-size: 16px;
  animation: fadeInUp 0.6s ease-out backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.scroll-indicator i {
  font-size: 32px;
}

/* 通用section标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 36px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 50px;
}

.title-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
  font-size: 28px;
}

/* 时间轴样式 */
.overview-section {
  padding: 100px 0;
  background: white;
}

.timeline-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 40px;
}

.timeline-controls button {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-controls button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.timeline {
  position: relative;
  padding: 40px 0;
}

.timeline.horizontal {
  display: flex;
  gap: 40px;
  overflow-x: auto;
  padding-bottom: 60px;
}

.timeline.vertical {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.timeline.vertical::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #667eea, #764ba2);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  min-width: 300px;
  cursor: pointer;
}

.timeline.vertical .timeline-item {
  display: flex;
  gap: 40px;
  min-width: auto;
}

.timeline.vertical .timeline-item:nth-child(even) {
  flex-direction: row-reverse;
}

.timeline-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #667eea;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}

.timeline.vertical .timeline-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.timeline.horizontal .timeline-dot {
  margin: 0 auto 20px;
}

.dot-pulse {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: inherit;
  opacity: 0.3;
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.importance-high {
  background: #e74c3c;
  box-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
}

.importance-medium {
  background: #f39c12;
}

.importance-low {
  background: #95a5a6;
}

.timeline-content {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.timeline.vertical .timeline-content {
  flex: 1;
  max-width: 45%;
}

.timeline-item:hover .timeline-content {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.timeline-year {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 10px;
}

.timeline-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
}

.timeline-detail {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.detail-text p {
  line-height: 1.8;
  color: #555;
}

.detail-text ul {
  margin-top: 15px;
  padding-left: 20px;
}

.detail-text li {
  margin-bottom: 10px;
  color: #666;
}

.detail-media img,
.detail-media video {
  width: 100%;
  border-radius: 10px;
}

/* 展开动画 */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ============ 引入完整样式文件（非scoped） ============ */
</style>

<style>
/* 引入完整的样式文件 - 注意：这里使用非scoped的style块 */
@import '@/styles/PersonDetailAdvanced.css';
</style>

