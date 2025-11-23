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
            @click="scrollToSection('achievements')" 
            class="nav-tab-item"
            :class="{ active: activeSection === 'achievements' }"
          >
            <i class="fas fa-trophy"></i>
            <span>荣誉成就</span>
          </button>
          <button 
            @click="scrollToSection('timeline')" 
            class="nav-tab-item"
            :class="{ active: activeSection === 'timeline' }"
          >
            <i class="fas fa-history"></i>
            <span>生平时间线</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主要内容区 -->
    <main class="main-content" id="introduction-section" v-show="activeSection !== 'relationship' && activeSection !== 'achievements' && activeSection !== 'timeline'">
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


    <!-- 荣誉成就区域 - 勋章墙式展示 -->
    <section class="achievements-section-fullwidth" id="achievements-section" v-if="activeSection === 'achievements'">
      <div class="medal-wall-container">
        <!-- 顶部统计区 -->
        <div class="statistics-area" data-aos="fade-down">
          <div class="stat-card">
            <div class="stat-number" :data-count="getTotalCount()">{{ animatedTotalCount }}</div>
            <div class="stat-label">荣誉总数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number highlight">{{ getHighestLevel() }}</div>
            <div class="stat-label">最高级别</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ getYearSpan() }}</div>
            <div class="stat-label">获奖跨度</div>
          </div>
        </div>

        <!-- 筛选栏 -->
        <div class="filter-bar" data-aos="fade-up" data-aos-delay="200">
          <div class="filter-group">
            <button 
              v-for="type in achievementTypes" 
              :key="type.id"
              :class="['filter-btn', { active: selectedType === type.id }]"
              @click="filterByType(type.id)"
            >
              <i :class="type.icon"></i>
              <span>{{ type.name }}</span>
              <span class="count" v-if="getCountByType(type.id) > 0">({{ getCountByType(type.id) }})</span>
            </button>
          </div>
          <div class="sort-controls">
            <select v-model="sortBy" class="sort-select">
              <option value="type">按类型</option>
              <option value="time-desc">时间从新到旧</option>
              <option value="time-asc">时间从旧到新</option>
            </select>
          </div>
        </div>

        <!-- 勋章墙主体 -->
        <div class="medal-wall-main" v-if="processedAchievements.length > 0">
          <transition-group 
            name="medal" 
            tag="div" 
            class="medal-grid"
          >
            <div 
              v-for="(achievement, index) in filteredAndSortedAchievements" 
              :key="achievement.awardId || index"
              :class="['medal-item', `type-${getTypeClass(achievement.awardType)}`, { hovered: hoveredMedal === achievement.awardId }]"
              :style="getMedalStyle(achievement)"
              @mouseenter="onMedalHover(achievement)"
              @mouseleave="onMedalLeave()"
              @click="openMedalDetail(achievement)"
              data-aos="zoom-in"
              :data-aos-delay="index * 50"
            >
              <!-- 勋章外框 -->
              <div class="medal-frame">
                <!-- 光晕效果 -->
                <div class="medal-glow" :class="`glow-${getTypeClass(achievement.awardType)}`"></div>
                
                <!-- 勋章主体 -->
                <div class="medal-body">
                  <!-- 图标 -->
                  <div class="medal-icon">
                    <i :class="getMedalIcon(achievement)"></i>
                  </div>
                  
                  <!-- 绸带装饰(所有等级都有) -->
                  <div class="medal-ribbon">
                    <div class="ribbon-left"></div>
                    <div class="ribbon-right"></div>
                  </div>
                </div>
                
                <!-- 勋章名称 -->
                <div class="medal-name">{{ achievement.awardName }}</div>
              </div>

              <!-- 悬浮提示卡片 -->
              <transition name="tooltip">
                <div 
                  v-if="hoveredMedal === achievement.awardId" 
                  class="medal-tooltip"
                  :style="getTooltipPosition(index)"
                >
                  <h4 class="tooltip-title">{{ achievement.awardName }}</h4>
                  <p class="tooltip-desc">{{ achievement.awardDescription || '暂无描述' }}</p>
                  <div class="tooltip-meta">
                    <span v-if="achievement.awardYear"><i class="fas fa-calendar"></i> {{ achievement.awardYear }}年</span>
                    <span v-if="achievement.awardingOrganization"><i class="fas fa-building"></i> {{ achievement.awardingOrganization }}</span>
                  </div>
                </div>
              </transition>
            </div>
          </transition-group>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <i class="fas fa-medal"></i>
          <p>{{ selectedType === 'all' ? '暂无荣誉成就数据' : '该类型暂无荣誉' }}</p>
          <button v-if="selectedType !== 'all'" @click="filterByType('all')" class="clear-filter-btn">
            查看全部荣誉
          </button>
        </div>
      </div>

      <!-- 详情模态框 -->
      <transition name="modal">
        <div v-if="selectedMedal" class="medal-modal-overlay" @click="closeMedalDetail">
          <div class="medal-modal" @click.stop>
            <button class="modal-close-btn" @click="closeMedalDetail">
              <i class="fas fa-times"></i>
            </button>
            
            <!-- 模态框头部 -->
            <div class="modal-header" :class="`header-${getTypeClass(selectedMedal.awardType)}`">
              <div class="modal-medal-icon">
                <i :class="getMedalIcon(selectedMedal)"></i>
              </div>
              <div class="modal-title-group">
                <h3 class="modal-title">{{ selectedMedal.awardName }}</h3>
                <span class="modal-level-badge" :class="`badge-${getTypeClass(selectedMedal.awardType)}`">
                  {{ selectedMedal.awardType }}
                </span>
              </div>
            </div>
            
            <!-- 模态框内容 -->
            <div class="modal-body">
              <div class="modal-description">
                <p>{{ selectedMedal.awardDescription || '暂无详细描述' }}</p>
              </div>
              
              <div class="modal-info-cards">
                <div class="info-card" v-if="selectedMedal.awardYear">
                  <i class="fas fa-calendar-alt"></i>
                  <div>
                    <div class="card-label">获得时间</div>
                    <div class="card-value">{{ selectedMedal.awardYear }}年</div>
                  </div>
                </div>
                <div class="info-card" v-if="selectedMedal.awardingOrganization">
                  <i class="fas fa-building"></i>
                  <div>
                    <div class="card-label">颁发机构</div>
                    <div class="card-value">{{ selectedMedal.awardingOrganization }}</div>
                  </div>
                </div>
                <div class="info-card" v-if="selectedMedal.awardRank">
                  <i class="fas fa-award"></i>
                  <div>
                    <div class="card-label">奖项等级</div>
                    <div class="card-value">{{ selectedMedal.awardRank }}</div>
                  </div>
                </div>
                <div class="info-card" v-if="selectedMedal.awardLevel">
                  <i class="fas fa-layer-group"></i>
                  <div>
                    <div class="card-label">荣誉级别</div>
                    <div class="card-value">{{ selectedMedal.awardLevel }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </section>

    <!-- 生平时间线区域 -->
    <section class="timeline-section-fullwidth" id="timeline-section" v-if="activeSection === 'timeline'">
      <TimelineFlipBook 
        v-if="personData && personData.id"
        :personId="personData.id"
      />
    </section>

    <!-- 页脚 - 只在非关系图谱、荣誉成就、时间线模式下显示 -->
    <footer class="academic-footer" v-if="activeSection !== 'relationship' && activeSection !== 'achievements' && activeSection !== 'timeline'">
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
import TimelineFlipBook from './TimelineFlipBook.vue'
import { getPersonImage, getUnknownImage } from '@/utils/imageLoader'

const unknownImg = getUnknownImage()

export default {
  name: 'PersonDetailAcademic',
  components: {
    RelationshipGraph,
    TimelineFlipBook
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
      activeSection: 'knowledge', // 'knowledge' | 'relationship' | 'achievements' | 'timeline'
      unknownImg: unknownImg,
      // 荣誉成就相关
      achievementTypes: [
        { id: 'all', name: '全部', icon: 'fas fa-list' },
        { id: '院士', name: '院士', icon: 'fas fa-crown' },
        { id: '国家级奖项', name: '国家级奖项', icon: 'fas fa-trophy' },
        { id: '省部级奖项', name: '省部级奖项', icon: 'fas fa-medal' },
        { id: '学术职务', name: '学术职务', icon: 'fas fa-users' },
        { id: '教学荣誉', name: '教学荣誉', icon: 'fas fa-chalkboard-teacher' },
        { id: '人才计划', name: '人才计划', icon: 'fas fa-user-graduate' },
        { id: '其他荣誉', name: '其他', icon: 'fas fa-star' }
      ],
      selectedType: 'all',
      sortBy: 'type',
      hoveredMedal: null,
      selectedMedal: null,
      animatedTotalCount: 0
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
    },
    
    // 处理荣誉成就数据
    processedAchievements() {
      if (!this.personData || !this.personData.awards || this.personData.awards.length === 0) {
        return []
      }
      
      // 直接返回awards数据
      return this.personData.awards
    },
    
    // 筛选和排序后的荣誉
    filteredAndSortedAchievements() {
      let filtered = this.processedAchievements
      
      // 按类型筛选
      if (this.selectedType !== 'all') {
        filtered = filtered.filter(a => a.awardType === this.selectedType)
      }
      
      // 排序
      if (this.sortBy === 'type') {
        // 按类型排序
        const typeOrder = { '院士': 0, '国家级奖项': 1, '省部级奖项': 2, '学术职务': 3, '教学荣誉': 4, '人才计划': 5, '其他荣誉': 6 }
        filtered.sort((a, b) => (typeOrder[a.awardType] || 999) - (typeOrder[b.awardType] || 999))
      } else if (this.sortBy === 'time-desc') {
        filtered.sort((a, b) => (b.awardYear || 0) - (a.awardYear || 0))
      } else if (this.sortBy === 'time-asc') {
        filtered.sort((a, b) => (a.awardYear || 0) - (b.awardYear || 0))
      }
      
      return filtered
    }
  },
  watch: {
    activeSection(newVal) {
      if (newVal === 'achievements') {
        this.$nextTick(() => {
          this.animateCount()
        })
      }
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
    
    // 滚动到指定区域
    scrollToSection(section) {
      this.activeSection = section
      
      // 如果是关系图谱，直接显示，不需要滚动
      if (section === 'relationship') {
        // 关系图谱直接显示，隐藏人物介绍
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
      
      // 时间线视图
      if (section === 'timeline') {
        this.$nextTick(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
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
    },
    
    // ========== 荣誉成就相关方法 ==========
    
    // 获取类型css类名
    getTypeClass(awardType) {
      const typeClassMap = {
        '院士': 'S',
        '国家级奖项': 'A',
        '省部级奖项': 'B',
        '学术职务': 'C',
        '教学荣誉': 'C',
        '人才计划': 'A',
        '其他荣誉': 'C'
      }
      return typeClassMap[awardType] || 'C'
    },
    
    // 获取勋章图标
    getMedalIcon(achievement) {
      const icons = {
        '院士': 'fas fa-crown',
        '国家级奖项': 'fas fa-trophy',
        '省部级奖项': 'fas fa-medal',
        '学术职务': 'fas fa-users',
        '教学荣誉': 'fas fa-chalkboard-teacher',
        '人才计划': 'fas fa-user-graduate',
        '其他荣誉': 'fas fa-star'
      }
      return icons[achievement.awardType] || 'fas fa-award'
    },
    
    // 获取勋章样式
    getMedalStyle(achievement) {
      // 可以根据需要添加自定义样式
      return {}
    },
    
    // 获取提示框位置
    getTooltipPosition(index) {
      // 简单的定位逻辑，可以根据实际情况优化
      return {
        // 默认在右侧显示
      }
    },
    
    // 统计相关方法
    getTotalCount() {
      return this.processedAchievements.length
    },
    
    getHighestLevel() {
      const types = this.processedAchievements.map(a => a.awardType)
      if (types.includes('院士')) return '院士'
      if (types.includes('国家级奖项')) return '国家级'
      if (types.includes('省部级奖项')) return '省部级'
      return '校级'
    },
    
    getYearSpan() {
      const years = this.processedAchievements
        .map(a => a.awardYear)
        .filter(y => y && y > 0)
      
      if (years.length === 0) return '-'
      if (years.length === 1) return years[0] + '年'
      
      const minYear = Math.min(...years)
      const maxYear = Math.max(...years)
      const span = maxYear - minYear
      return span > 0 ? `${span}年` : '同年'
    },
    
    getCountByType(typeId) {
      if (typeId === 'all') return this.processedAchievements.length
      return this.processedAchievements.filter(a => a.awardType === typeId).length
    },
    
    // 筛选方法
    filterByType(typeId) {
      this.selectedType = typeId
    },
    
    // 交互方法
    onMedalHover(achievement) {
      this.hoveredMedal = achievement.awardId
    },
    
    onMedalLeave() {
      this.hoveredMedal = null
    },
    
    openMedalDetail(achievement) {
      this.selectedMedal = achievement
    },
    
    closeMedalDetail() {
      this.selectedMedal = null
    },
    
    // 数字动画
    animateCount() {
      const target = this.getTotalCount()
      const duration = 1500
      const steps = 60
      const increment = target / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          this.animatedTotalCount = target
          clearInterval(timer)
        } else {
          this.animatedTotalCount = Math.floor(current)
        }
      }, duration / steps)
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
  margin-bottom: 10px;
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

/* ========== 荣誉成就 - 勋章墙样式 ========== */
.achievements-section-fullwidth {
  min-height: 100vh;
  padding: 60px 20px 80px;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(220, 20, 60, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  position: relative;
  overflow: hidden;
}

/* 动态背景效果 */
.achievements-section-fullwidth::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 20% 80%, rgba(123, 104, 238, 0.1) 0%, transparent 40%);
  animation: bg-pulse 10s ease-in-out infinite;
  pointer-events: none;
}

/* 星光粒子背景 */
.achievements-section-fullwidth::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, white, transparent),
    radial-gradient(2px 2px at 90% 60%, white, transparent),
    radial-gradient(1px 1px at 33% 80%, white, transparent),
    radial-gradient(1px 1px at 15% 90%, white, transparent);
  background-size: 200% 200%;
  animation: stars-twinkle 20s linear infinite;
  opacity: 0.6;
  pointer-events: none;
}

.medal-wall-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 顶部统计区 */
.statistics-area {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 30px 40px;
  min-width: 180px;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

.stat-card:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  transform: translateY(-10px) scale(1.05);
  box-shadow: 
    0 15px 50px rgba(255, 215, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 215, 0, 0.6);
}

.stat-number {
  font-size: 56px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
  font-family: 'Arial', sans-serif;
  text-shadow: 
    0 0 20px rgba(255, 215, 0, 0.8),
    0 0 40px rgba(255, 215, 0, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.5);
  animation: number-glow 2s ease-in-out infinite;
}

.stat-number.highlight {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 5px 20px rgba(255, 255, 255, 0.2);
}

.filter-btn:hover::before {
  width: 300px;
  height: 300px;
}

.filter-btn.active {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #1a1a1a;
  border-color: #FFD700;
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.6),
    0 5px 20px rgba(255, 215, 0, 0.3);
  font-weight: 600;
}

.filter-btn.active i {
  animation: icon-pulse 1.5s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.filter-btn .count {
  font-size: 12px;
  opacity: 0.8;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-select {
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  outline: none;
}

/* 勋章墙主体 */
.medal-wall-main {
  margin-top: 40px;
}

.medal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 60px 50px;
  justify-items: center;
  padding: 20px;
}

/* 勋章项 */
.medal-item {
  position: relative;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.medal-item:hover {
  transform: translateY(-20px) scale(1.2) rotateZ(5deg);
  z-index: 10;
  filter: brightness(1.2);
}

.medal-item:hover .medal-body {
  animation-play-state: paused;
}

.medal-item.hovered ~ .medal-item:not(.hovered) {
  opacity: 0.7;
}

/* 勋章外框 */
.medal-frame {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* 勋章主体 - 统一尺寸140px，更精美 */
.medal-body {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  animation: float-medal 4s ease-in-out infinite;
  border: 5px solid rgba(255, 255, 255, 0.9);
}

/* 勋章外层装饰环 - 统一精美效果 */
.medal-body::before {
  content: '';
  position: absolute;
  top: -12px;
  left: -12px;
  right: -12px;
  bottom: -12px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 0 30px rgba(255, 255, 255, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.2);
  animation: rotate-slow 20s linear infinite;
}

/* 勋章内层高光 - 统一精美效果 */
.medal-body::after {
  content: '';
  position: absolute;
  top: 12%;
  left: 12%;
  right: 12%;
  bottom: 12%;
  border-radius: 50%;
  background: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 30%, transparent 70%);
  animation: pulse-glow 3s ease-in-out infinite;
}

/* 金色勋章 - 院士 */
.medal-item.type-S .medal-body {
  background: 
    radial-gradient(circle at 28% 28%, #FFF9E6 0%, transparent 55%),
    radial-gradient(circle at 72% 72%, rgba(255, 200, 87, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, #FFD700 0%, #FFED4E 20%, #FFA500 40%, #FF8C00 60%, #FFA500 80%, #FFD700 100%);
  box-shadow: 
    0 0 45px rgba(255, 215, 0, 0.8),
    0 0 80px rgba(255, 215, 0, 0.5),
    0 15px 50px rgba(255, 215, 0, 0.6),
    inset 0 4px 20px rgba(255, 255, 255, 0.7),
    inset 0 -4px 15px rgba(218, 165, 32, 0.4);
}

.medal-item.type-S .medal-body::before {
  border-color: rgba(255, 215, 0, 0.8);
  box-shadow: 
    0 0 35px rgba(255, 215, 0, 0.5),
    inset 0 0 35px rgba(255, 215, 0, 0.3);
}

/* 红色勋章 - 国家级奖项、人才计划 */
.medal-item.type-A .medal-body {
  background: 
    radial-gradient(circle at 28% 28%, #FFE8E8 0%, transparent 55%),
    radial-gradient(circle at 72% 72%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, #FF6B6B 0%, #FF5252 20%, #DC143C 40%, #C41E3A 60%, #DC143C 80%, #FF6B6B 100%);
  box-shadow: 
    0 0 45px rgba(220, 20, 60, 0.8),
    0 0 80px rgba(220, 20, 60, 0.5),
    0 15px 50px rgba(220, 20, 60, 0.6),
    inset 0 4px 20px rgba(255, 255, 255, 0.7),
    inset 0 -4px 15px rgba(139, 0, 0, 0.4);
}

.medal-item.type-A .medal-body::before {
  border-color: rgba(255, 107, 107, 0.8);
  box-shadow: 
    0 0 35px rgba(220, 20, 60, 0.5),
    inset 0 0 35px rgba(220, 20, 60, 0.3);
}

/* 蓝色勋章 - 省部级奖项 */
.medal-item.type-B .medal-body {
  background: 
    radial-gradient(circle at 28% 28%, #E8F0FF 0%, transparent 55%),
    radial-gradient(circle at 72% 72%, rgba(106, 90, 205, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, #7B68EE 0%, #6A5ACD 20%, #4169E1 40%, #5B8DEE 60%, #4169E1 80%, #7B68EE 100%);
  box-shadow: 
    0 0 45px rgba(65, 105, 225, 0.8),
    0 0 80px rgba(65, 105, 225, 0.5),
    0 15px 50px rgba(65, 105, 225, 0.6),
    inset 0 4px 20px rgba(255, 255, 255, 0.7),
    inset 0 -4px 15px rgba(25, 25, 112, 0.4);
}

.medal-item.type-B .medal-body::before {
  border-color: rgba(123, 104, 238, 0.8);
  box-shadow: 
    0 0 35px rgba(65, 105, 225, 0.5),
    inset 0 0 35px rgba(65, 105, 225, 0.3);
}

/* 银色勋章 - 学术职务、教学荣誉、其他 */
.medal-item.type-C .medal-body {
  background: 
    radial-gradient(circle at 28% 28%, #FFFFFF 0%, transparent 55%),
    radial-gradient(circle at 72% 72%, rgba(192, 192, 192, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, #E8E8E8 0%, #D3D3D3 20%, #C0C0C0 40%, #BEBEBE 60%, #C0C0C0 80%, #E8E8E8 100%);
  box-shadow: 
    0 0 45px rgba(192, 192, 192, 0.8),
    0 0 80px rgba(192, 192, 192, 0.5),
    0 15px 50px rgba(192, 192, 192, 0.6),
    inset 0 4px 20px rgba(255, 255, 255, 0.7),
    inset 0 -4px 15px rgba(105, 105, 105, 0.4);
}

.medal-item.type-C .medal-body::before {
  border-color: rgba(211, 211, 211, 0.8);
  box-shadow: 
    0 0 35px rgba(192, 192, 192, 0.5),
    inset 0 0 35px rgba(192, 192, 192, 0.3);
}

/* 统一光晕效果 - 更大更明显 */
.medal-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  filter: blur(25px);
}

.medal-item:hover .medal-glow {
  opacity: 1;
}

/* 统一动画周期为2s，只改变颜色 */
.medal-item.type-S .medal-glow {
  background: 
    radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 215, 0, 0.5) 35%, transparent 70%);
  animation: glow-pulse-strong 2s ease-in-out infinite;
}

.medal-item.type-A .medal-glow {
  background: 
    radial-gradient(circle, rgba(220, 20, 60, 0.9) 0%, rgba(220, 20, 60, 0.5) 35%, transparent 70%);
  animation: glow-pulse-strong 2s ease-in-out infinite;
}

.medal-item.type-B .medal-glow {
  background: 
    radial-gradient(circle, rgba(65, 105, 225, 0.9) 0%, rgba(65, 105, 225, 0.5) 35%, transparent 70%);
  animation: glow-pulse-strong 2s ease-in-out infinite;
}

.medal-item.type-C .medal-glow {
  background: 
    radial-gradient(circle, rgba(192, 192, 192, 0.9) 0%, rgba(192, 192, 192, 0.5) 35%, transparent 70%);
  animation: glow-pulse-strong 2s ease-in-out infinite;
}

/* 勋章图标 - 统一大小和效果 */
.medal-icon {
  position: relative;
  z-index: 3;
  transition: all 0.3s ease;
}

.medal-item:hover .medal-icon {
  transform: scale(1.2) rotateY(15deg);
}

.medal-icon i {
  font-size: 60px;
  color: white;
  transition: all 0.3s ease;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
}

/* 统一图标闪光效果，只改变颜色，动画周期统一为3.5s */
.medal-item.type-S .medal-icon i {
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
          drop-shadow(0 0 25px rgba(255, 215, 0, 0.9));
  animation: icon-shine-gold 3.5s ease-in-out infinite;
}

.medal-item.type-A .medal-icon i {
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
          drop-shadow(0 0 25px rgba(220, 20, 60, 0.9));
  animation: icon-shine-red 3.5s ease-in-out infinite;
}

.medal-item.type-B .medal-icon i {
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
          drop-shadow(0 0 25px rgba(65, 105, 225, 0.9));
  animation: icon-shine-blue 3.5s ease-in-out infinite;
}

.medal-item.type-C .medal-icon i {
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
          drop-shadow(0 0 25px rgba(192, 192, 192, 0.9));
  animation: icon-shine-silver 3.5s ease-in-out infinite;
}

/* 统一图标闪光动画 - 只改变颜色，效果完全一致 */
@keyframes icon-shine-gold {
  0%, 100% {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
            drop-shadow(0 0 25px rgba(255, 215, 0, 0.9));
  }
  50% {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
            drop-shadow(0 0 45px rgba(255, 215, 0, 1))
            drop-shadow(0 0 70px rgba(255, 215, 0, 0.6));
  }
}

@keyframes icon-shine-red {
  0%, 100% {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
            drop-shadow(0 0 25px rgba(220, 20, 60, 0.9));
  }
  50% {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
            drop-shadow(0 0 45px rgba(220, 20, 60, 1))
            drop-shadow(0 0 70px rgba(220, 20, 60, 0.6));
  }
}

@keyframes icon-shine-blue {
  0%, 100% {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
            drop-shadow(0 0 25px rgba(65, 105, 225, 0.9));
  }
  50% {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
            drop-shadow(0 0 45px rgba(65, 105, 225, 1))
            drop-shadow(0 0 70px rgba(65, 105, 225, 0.6));
  }
}

@keyframes icon-shine-silver {
  0%, 100% {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
            drop-shadow(0 0 25px rgba(192, 192, 192, 0.9));
  }
  50% {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
            drop-shadow(0 0 45px rgba(192, 192, 192, 1))
            drop-shadow(0 0 70px rgba(192, 192, 192, 0.6));
  }
}

/* 绸带装饰 - 统一精美样式 */
.medal-ribbon {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 50px;
  display: flex;
  gap: 4px;
  z-index: 1;
}

.ribbon-left, .ribbon-right {
  width: 46px;
  height: 100%;
  clip-path: polygon(0 0, 100% 0, 88% 100%, 12% 100%);
  animation: ribbon-float 2.5s ease-in-out infinite;
  box-shadow: 
    0 5px 12px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  position: relative;
}

/* 绸带光泽效果 */
.ribbon-left::before, .ribbon-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 30%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%);
  border-radius: 50% 50% 0 0;
}

/* 金色绸带 */
.medal-item.type-S .ribbon-left,
.medal-item.type-S .ribbon-right {
  background: linear-gradient(180deg, #FFD700 0%, #FFC700 20%, #FF8C00 60%, #B8860B 100%);
}

/* 红色绸带 */
.medal-item.type-A .ribbon-left,
.medal-item.type-A .ribbon-right {
  background: linear-gradient(180deg, #FF6B6B 0%, #DC143C 20%, #B22222 60%, #8B0000 100%);
}

/* 蓝色绸带 */
.medal-item.type-B .ribbon-left,
.medal-item.type-B .ribbon-right {
  background: linear-gradient(180deg, #7B68EE 0%, #4169E1 20%, #1E3A8A 60%, #191970 100%);
}

/* 银色绸带 */
.medal-item.type-C .ribbon-left,
.medal-item.type-C .ribbon-right {
  background: linear-gradient(180deg, #E8E8E8 0%, #C0C0C0 20%, #A9A9A9 60%, #696969 100%);
}

.ribbon-left {
  animation-delay: 0.15s;
}

.ribbon-right {
  animation-delay: 0.35s;
}

/* 勋章名称 - 统一精美样式 */
.medal-name {
  font-size: 15px;
  color: white;
  text-align: center;
  font-weight: 700;
  max-width: 180px;
  line-height: 1.5;
  text-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.7),
    0 0 15px rgba(255, 255, 255, 0.4);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: all 0.3s ease;
  letter-spacing: 0.8px;
  margin-top: 8px;
}

.medal-item:hover .medal-name {
  text-shadow: 
    0 3px 8px rgba(0, 0, 0, 0.8),
    0 0 25px rgba(255, 255, 255, 0.9),
    0 0 40px rgba(255, 255, 255, 0.6);
  transform: scale(1.08);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.8);
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 20px;
}

.clear-filter-btn {
  padding: 12px 30px;
  background: white;
  border: none;
  border-radius: 8px;
  color: #667eea;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filter-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

/* 悬浮提示卡片 */
.medal-tooltip {
  position: absolute;
  top: 50%;
  left: calc(100% + 20px);
  transform: translateY(-50%);
  width: 300px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 100;
  pointer-events: none;
}

.tooltip-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.tooltip-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.tooltip-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tooltip-meta span {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tooltip-meta i {
  font-size: 10px;
}

/* 提示框动画 */
.tooltip-enter-active, .tooltip-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.tooltip-enter-from, .tooltip-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-10px);
}

/* 详情模态框 */
.medal-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.medal-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 650px;
  max-height: 80vh;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.modal-close-btn i {
  font-size: 18px;
  color: white;
}

.modal-header {
  padding: 40px 30px 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.modal-header.header-S {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.modal-header.header-A {
  background: linear-gradient(135deg, #DC143C 0%, #FF6B6B 100%);
}

.modal-header.header-B {
  background: linear-gradient(135deg, #4169E1 0%, #7B68EE 100%);
}

.modal-header.header-C {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
}

.modal-medal-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-medal-icon i {
  font-size: 40px;
  color: white;
}

.modal-title-group {
  flex: 1;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.modal-level-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
  max-height: calc(80vh - 160px);
}

.modal-description {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 25px;
}

.modal-info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.modal-info-cards .info-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.modal-info-cards .info-card i {
  font-size: 20px;
  color: #667eea;
  margin-top: 2px;
}

.modal-info-cards .card-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.modal-info-cards .card-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.modal-significance {
  background: #f0f4ff;
  border-left: 4px solid #667eea;
  border-radius: 8px;
  padding: 20px;
}

.modal-significance h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-significance h4 i {
  color: #667eea;
  font-size: 18px;
}

.modal-significance p {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  margin: 0;
}

/* 模态框动画 */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.35s ease;
}

.modal-enter-active .medal-modal,
.modal-leave-active .medal-modal {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .medal-modal {
  transform: scale(0.8);
  opacity: 0;
}

.modal-leave-to .medal-modal {
  transform: scale(0.8);
  opacity: 0;
}

/* 勋章过渡动画 */
.medal-enter-active, .medal-leave-active {
  transition: all 0.4s ease;
}

.medal-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}

.medal-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.medal-move {
  transition: transform 0.4s ease;
}

/* ========== 关键帧动画 ========== */

/* 背景脉冲 */
@keyframes bg-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* 星光闪烁 */
@keyframes stars-twinkle {
  0%, 100% {
    opacity: 0.5;
    background-position: 0% 0%;
  }
  50% {
    opacity: 0.8;
    background-position: 100% 100%;
  }
}

/* 统计卡片光泽 */
@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* 数字发光 */
@keyframes number-glow {
  0%, 100% {
    text-shadow: 
      0 0 20px rgba(255, 215, 0, 0.8),
      0 0 40px rgba(255, 215, 0, 0.4),
      0 4px 8px rgba(0, 0, 0, 0.5);
  }
  50% {
    text-shadow: 
      0 0 30px rgba(255, 215, 0, 1),
      0 0 60px rgba(255, 215, 0, 0.6),
      0 0 90px rgba(255, 215, 0, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.5);
  }
}

/* S级勋章脉冲 */
@keyframes pulse-S {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* S级勋章缓慢旋转 */
@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* S级边框旋转 */
@keyframes spin-border {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 统一勋章浮动动画 */
@keyframes float-medal {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-6px) rotate(1deg);
  }
  50% {
    transform: translateY(-3px) rotate(0deg);
  }
  75% {
    transform: translateY(-6px) rotate(-1deg);
  }
}

/* 内层光晕脉冲动画 */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* 强烈光晕脉冲 */
@keyframes glow-pulse-strong {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
}

/* 中等光晕脉冲 */
@keyframes glow-pulse-medium {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 0.8;
  }
}

/* 柔和光晕脉冲 */
@keyframes glow-pulse-soft {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.98);
    opacity: 0.4;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.6;
  }
}

/* 绸带飘动 */
@keyframes ribbon-float {
  0%, 100% {
    transform: translateY(0) rotateX(0deg);
  }
  25% {
    transform: translateY(-3px) rotateX(5deg);
  }
  75% {
    transform: translateY(-3px) rotateX(-5deg);
  }
}

/* 响应式 - 勋章墙 */
@media (max-width: 1200px) {
  .medal-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 50px 40px;
  }
  
  .medal-body {
    width: 120px;
    height: 120px;
  }
  
  .medal-icon i {
    font-size: 52px;
  }
}

@media (max-width: 768px) {
  .achievements-section-fullwidth {
    padding: 40px 15px 60px;
  }
  
  .statistics-area {
    gap: 20px;
  }
  
  .stat-card {
    padding: 20px 25px;
    min-width: 140px;
  }
  
  .stat-number {
    font-size: 36px;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: center;
  }
  
  .sort-controls {
    justify-content: center;
  }
  
  .medal-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 40px 30px;
  }
  
  .medal-body {
    width: 110px;
    height: 110px;
  }
  
  .medal-icon i {
    font-size: 46px;
  }
  
  .medal-name {
    font-size: 13px;
  }
  
  .medal-tooltip {
    position: fixed;
    top: auto;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
    max-width: 320px;
  }
  
  .medal-modal {
    max-width: 100%;
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 30px 20px 20px;
  }
  
  .modal-medal-icon {
    width: 60px;
    height: 60px;
  }
  
  .modal-medal-icon i {
    font-size: 30px;
  }
  
  .modal-title {
    font-size: 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
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

/* 时间线占位区域 */
.timeline-section-fullwidth {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-placeholder {
  text-align: center;
  color: white;
  padding: 60px 40px;
}

.timeline-placeholder i {
  font-size: 120px;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 30px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

.timeline-placeholder h2 {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.timeline-placeholder p {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
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

