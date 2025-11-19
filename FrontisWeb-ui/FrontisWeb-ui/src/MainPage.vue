<template>
  <div class="person-list-page">
    <!-- 固定背景图片轮播 -->
    <div class="background-slider">
      <div
        v-for="(image, index) in backgroundImages"
        :key="index"
        class="background-slide"
        :class="{
          active: index === currentBackgroundIndex,
          next: index === nextBackgroundIndex,
          prev: index === prevBackgroundIndex
        }"
        :style="{ backgroundImage: `url(${image})` }"
      ></div>
    </div>

    <!-- 页面头部 -->
    <header class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-container">
              <img :src="cdutLogo" alt="成都理工大学" class="university-logo" />
              <div class="logo-text">
                <h1 class="main-logo">成都理工大学数字校史馆</h1>
              </div>
            </div>
          </div>
          <nav class="main-nav">
            <router-link to="/" class="nav-link active">首页</router-link>
            <router-link to="/persons" class="nav-link">成理人物</router-link>
            <router-link to="/digital-history" class="nav-link">成理历史</router-link>
            <router-link to="/universe" class="nav-link">学术星图</router-link>
            <router-link to="/keyword-rain" class="nav-link">倾听雨声</router-link>
            <router-link to="/draw-reveal" class="nav-link">涂鸦画板</router-link>
          </nav>
          <!-- 用户认证区域 -->
          <div class="auth-section">
            <div v-if="!isLoggedIn" class="auth-buttons">
              <button class="auth-btn login-btn" @click="showLoginModal = true">
                <i class="fas fa-sign-in-alt"></i>
                登录
              </button>
              <button class="auth-btn register-btn" @click="showRegisterModal = true">
                <i class="fas fa-user-plus"></i>
                注册
              </button>
            </div>
            <div v-else class="user-info">
              <div class="user-avatar">
                <img :src="userInfo.avatar || defaultAvatar" :alt="userInfo.username" />
              </div>
              <div class="user-details">
                <span class="username">{{ userInfo.username }}</span>
                <div class="user-menu">
                  <button class="user-menu-btn" @click="toggleUserMenu">
                    <i class="fas fa-chevron-down"></i>
                  </button>
                  <div v-if="showUserMenu" class="user-dropdown">
                    <a href="javascript:void(0)" @click.prevent="goToProfile">
                      <i class="fas fa-user"></i>
                      个人中心
                    </a>
                    <a href="javascript:void(0)" @click.prevent="logout">
                      <i class="fas fa-sign-out-alt"></i>
                      退出登录
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- 1. 顶部Hero区域 -->
      <section class="hero-section" ref="heroSection" @mousemove="handleHeroMouseMove">
        <div class="hero-overlay"></div>
        <div class="hero-content" :style="heroContentStyle">
          <div class="hero-layer hero-layer-foreground">
            <h1 class="hero-title">穷究于理 · 成就于工</h1>
          </div>
        </div>
      </section>

      <!-- 2. 人物和事件板块 -->
      <section class="content-blocks-section">
        <div class="container">
          <!-- 人物板块 -->
          <div class="content-block">
            <div class="block-header">
              <div class="block-icon">👤</div>
              <h2 class="block-title">成理人物</h2>
              <router-link to="/persons" class="block-more">
                更多 >
              </router-link>
            </div>
            <div class="block-content">
              <div 
                v-for="person in featuredPersons" 
                :key="person.personId"
                class="content-card person-card"
                @click="goToPersonDetail(person.personId)"
              >
                <div class="card-image">
                  <img :src="person.imageUrl" :alt="person.name" />
                </div>
                <div class="card-info">
                  <h3 class="card-title">{{ person.name }}</h3>
                  <p class="card-subtitle">{{ person.subtitle }}</p>
                  <div class="card-tags" v-if="person.keyTagsList && person.keyTagsList.length">
                    <span 
                      v-for="(tag, index) in person.keyTagsList.slice(0, 3)" 
                      :key="index"
                      class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="featuredPersons.length === 0" class="empty-state">
                暂无人物数据
              </div>
            </div>
          </div>

          <!-- 事件板块 -->
          <div class="content-block">
            <div class="block-header">
              <div class="block-icon">📅</div>
              <h2 class="block-title">历史事件</h2>
              <router-link to="/digital-history" class="block-more">
                更多 >
              </router-link>
            </div>
            <div class="block-content">
              <div 
                v-for="event in featuredEvents" 
                :key="event.eventId"
                class="content-card event-card"
                @click="goToEventDetail(event.eventId)"
              >
                <div class="event-year">{{ event.year }}</div>
                <div class="card-info">
                  <h3 class="card-title">{{ event.title }}</h3>
                  <p class="card-description">{{ event.description }}</p>
                  <div class="event-meta">
                    <span class="event-type" v-if="event.eventType">{{ event.eventType }}</span>
                    <span class="event-importance" v-if="event.importance">{{ event.importance }}</span>
                  </div>
                </div>
              </div>
              <div v-if="featuredEvents.length === 0" class="empty-state">
                暂无事件数据
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 媒体灯箱 -->
    <MediaLightbox
      :is-open="mediaLightboxOpen"
      :media="currentMedia"
      :media-list="mediaList"
      :initial-index="mediaIndex"
      @close="closeMediaLightbox"
    />

    <!-- 登录注册弹窗 -->
    <AuthModal
      :show-login-modal="showLoginModal"
      :show-register-modal="showRegisterModal"
      :show-forgot-password-modal="showForgotPasswordModal"
      @close-login="closeLoginModal"
      @close-register="closeRegisterModal"
      @close-forgot-password="closeForgotPasswordModal"
      @switch-to-register="switchToRegister"
      @switch-to-login="switchToLogin"
      @switch-to-forgot-password="switchToForgotPassword"
      @login-success="handleLoginSuccess"
      @register-success="handleRegisterSuccess"
    />

    <!-- AI 助手弹窗 + 小图标：一体拖动 -->
    <div
      class="ai-assistant"
      ref="aiContainer"
      :style="{
        top: aiPopupPosition.top + 'px',
        left: aiPopupPosition.left + 'px'
      }"
    >
      <!-- 聊天窗口 -->
      <transition name="ai-popup-fade">
        <div v-if="aiWindowOpen" class="ai-popup" ref="aiPopup">
          <div class="ai-popup-header" @pointerdown.stop.prevent="startAIDrag">
            <div class="ai-header-info">
              <img :src="aiAvatar" alt="AI助手" class="ai-header-avatar" />
              <div class="ai-header-text">
                <div class="ai-header-title">成理 · AI 学术助手</div>
                <div class="ai-header-subtitle">和你一起探索成都理工的故事</div>
              </div>
            </div>
            <button class="ai-header-close" @click="onCloseAIWindow">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="ai-popup-body">
            <div class="ai-messages" ref="aiMessagesContainer">
              <div
                v-for="(msg, index) in aiMessages"
                :key="index"
                class="ai-message-row"
                :class="msg.role === 'user' ? 'is-user' : 'is-assistant'"
              >
                <div class="ai-message-avatar" v-if="msg.role === 'assistant'">
                  <img :src="aiAvatar" alt="AI助手" />
                </div>
                <div class="ai-message-avatar user" v-else>
                  <i class="fas fa-user"></i>
                </div>
                <div class="ai-message-bubble">
                  <p class="ai-message-content">
                    {{ msg.content }}
                  </p>
                  <span class="ai-message-meta">
                    {{ msg.time }}
                  </span>
                </div>
              </div>

              <!-- 打字中的动画 -->
              <div v-if="aiLoading" class="ai-typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <div class="ai-popup-footer">
            <textarea
              v-model="aiInput"
              class="ai-input"
              rows="2"
              placeholder="可以试着问：成理是哪一年建校的？ / 学术星图是做什么的？"
              @keyup.enter.exact.prevent="handleAISend"
              @keyup.shift.enter.stop
            ></textarea>
            <div class="ai-footer-actions">
              <span class="ai-hint">按 Enter 发送 · Shift+Enter 换行</span>
              <button
                class="ai-send-btn"
                :disabled="!aiInput.trim() || aiLoading"
                @click="handleAISend"
              >
                <i class="fas fa-paper-plane"></i>
                <span>发送</span>
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- 浮动按钮（也可拖拽，弹窗一起动） -->
      <button
        class="ai-fab"
        @pointerdown.stop.prevent="startAIDrag"
        @click="handleFabClick"
      >
        <div class="ai-fab-avatar-wrap">
          <img :src="aiAvatar" alt="AI助手" class="ai-fab-avatar" />
        </div>
        <div class="ai-fab-text">
          <span class="ai-fab-title">AI 助手</span>
          <span class="ai-fab-subtitle">问问成理校史 / 学术</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import cdutLogo from '@/assets/CDUT.png'
import defaultAvatar from '@/assets/default-avatar.png'
import AuthModal from '@/components/AuthModal.vue'
import MediaLightbox from '@/components/MediaLightbox.vue'
import { getAllPersonProfiles } from '@/services/personDataService'
import { getPersonImage } from '@/utils/imageLoader'

// 导入背景图片
import libraryImageSrc from '@/assets/mainbg/新图书馆.jpg'
import buildingImageSrc from '@/assets/mainbg/东区教学楼.jpg'

const resolveApiBase = () => {
  const raw = (import.meta.env.VITE_API_BASE_URL || '').trim()
  if (raw) {
    return raw.replace(/\/+$/, '')
  }
  if (import.meta.env.DEV) {
    // 开发环境下走 Vite 代理（相对路径）
    return ''
  }
  // 生产环境默认同源
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
}

const API_BASE = resolveApiBase()

export default {
  name: 'MainPage',
  components: {
    AuthModal,
    MediaLightbox
  },
  data() {
    return {
      // 基础图片
      cdutLogo,
      defaultAvatar,
      libraryImage: libraryImageSrc || cdutLogo,

      // 背景图片轮播
      backgroundImages: [libraryImageSrc, buildingImageSrc],
      currentBackgroundIndex: 0,
      nextBackgroundIndex: 1,
      prevBackgroundIndex: -1,
      backgroundTimer: null,

      // 登录相关数据
      isLoggedIn: false,
      showLoginModal: false,
      showRegisterModal: false,
      showForgotPasswordModal: false,
      showUserMenu: false,
      userInfo: {
        username: '',
        avatar: ''
      },

      // 轮播相关数据
      currentIndex: 0,
      isScrolling: false,
      scrollInterval: null,

      // 著名人物数据（从数据库加载）
      persons: [],
      allPersonsData: {}, // 存储从数据库加载的所有人物数据
      
      // 首页展示的人物和事件
      featuredPersons: [],
      featuredEvents: [],

      // 历史重要时期数据
      historyPeriods: [
        {
          year: '1956',
          title: '建校初期 · 艰辛起步',
          description: '成都地质勘探学院创建，开启理工人奋斗之路',
          events: [
            '1956年3月，成都地质勘探学院创建',
            '开设地质测量、石油天然气等专业',
            '奠定了地质学科特色基础'
          ]
        },
        {
          year: '1958-1993',
          title: '发展壮大 · 砥砺前行',
          description: '更名为成都地质学院，学科体系不断完善',
          events: [
            '1958年更名为成都地质学院',
            '1978年恢复研究生招生',
            '1993年更名为成都理工学院'
          ]
        },
        {
          year: '2001',
          title: '改革与跨越 · 升格大学',
          description: '正式更名为成都理工大学，进入快速发展期',
          events: [
            '2001年正式更名为成都理工大学',
            '学校进入崭新的发展阶段',
            '办学规模与层次显著提升'
          ]
        },
        {
          year: '2017-至今',
          title: '双一流建设 · 再创辉煌',
          description: '进入地学领域国家一流学科建设，迈向新征程',
          events: [
            '2017年进入地学领域国家一流学科建设',
            '持续提升高水平大学建设',
            '深化产学研结合与地方发展'
          ]
        }
      ],

      // 办学特色成果标签页
      activeTab: 0,
      achievementTabs: [
        {
          name: '学科建设',
          icon: 'fas fa-book',
          items: [
            {
              icon: 'fas fa-globe',
              title: '地球科学',
              desc: '国家一流学科建设，ESI全球排名前1%'
            },
            {
              icon: 'fas fa-oil-can',
              title: '石油与天然气工程',
              desc: '国家重点学科，行业特色鲜明'
            },
            {
              icon: 'fas fa-mountain',
              title: '地质资源与地质工程',
              desc: '国家重点学科，服务资源勘探'
            },
            {
              icon: 'fas fa-atom',
              title: '核技术应用',
              desc: '特色优势学科，服务科技支撑'
            }
          ]
        },
        {
          name: '科研成果',
          icon: 'fas fa-flask',
          items: [
            {
              icon: 'fas fa-award',
              title: '国家科技进步奖',
              desc: '荣获国家级科技奖励成果'
            },
            {
              icon: 'fas fa-microscope',
              title: '国家重点实验室',
              desc: '地质灾害防治与地质环境保护'
            },
            {
              icon: 'fas fa-satellite',
              title: '遥感技术应用',
              desc: '地球观测与信息提取领域'
            },
            {
              icon: 'fas fa-chart-line',
              title: '产学研合作',
              desc: '服务行业企业与科研成果转化平台'
            }
          ]
        },
        {
          name: '人才培养',
          icon: 'fas fa-user-graduate',
          items: [
            {
              icon: 'fas fa-chalkboard-teacher',
              title: '拔尖人才培养',
              desc: '参与拔尖创新人才培养计划'
            },
            {
              icon: 'fas fa-lightbulb',
              title: '创新创业教育',
              desc: '国家级创新创业示范基地'
            },
            {
              icon: 'fas fa-hands-helping',
              title: '校企协同育人',
              desc: '产教深度融合，协同育人'
            },
            {
              icon: 'fas fa-globe-americas',
              title: '国际化培养',
              desc: '开展国际校际合作交流项目'
            }
          ]
        },
        {
          name: '社会服务',
          icon: 'fas fa-handshake',
          items: [
            {
              icon: 'fas fa-house-damage',
              title: '地质灾害防治',
              desc: '服务国家级防灾减灾战略'
            },
            {
              icon: 'fas fa-industry',
              title: '能源资源保障',
              desc: '支撑国家资源安全'
            },
            {
              icon: 'fas fa-tree',
              title: '生态环境保护',
              desc: '服务生态文明建设'
            },
            {
              icon: 'fas fa-city',
              title: '助力地方发展',
              desc: '校地合作推动区域经济发展'
            }
          ]
        }
      ],

      // Hero区域样式
      mouseX: 0,
      mouseY: 0,
      heroContentStyle: {},

      // 媒体灯箱相关数据
      mediaLightboxOpen: false,
      currentMedia: {},
      mediaList: [],
      mediaIndex: 0,

      // AI 助手相关数据
      aiWindowOpen: false,
      aiInput: '',
      aiLoading: false,
      aiAvatar: defaultAvatar,
      aiMessages: [
        {
          role: 'assistant',
          content:
            '你好！我是成理 · AI 学术助手，可以帮助你了解成都理工大学的校史、人物与学术星图。',
          time: ''
        }
      ],

      // AI 助手弹窗位置（右下角）
      aiPopupPosition: {
        top: typeof window !== 'undefined' ? window.innerHeight - 450 : 100,
        left: typeof window !== 'undefined' ? window.innerWidth - 420 : 100
      },
      aiDragging: false,
      aiDragStartX: 0,
      aiDragStartY: 0,
      aiDragMoved: false,

      // API 基础地址
      apiBase: API_BASE,
      aiAbortController: null,
      aiStreamingIndex: null
    }
  },
  methods: {
    viewPerson(personId) {
      if (personId === 'zhangzhuoyuan') {
        this.$router.push('/zhangzhuoyuan')
      } else if (personId === 'liubaojun') {
        this.$router.push('/liubaojun')
      } else {
        this.showToast(`正在查看${personId}的详细信息`, 'info')
      }
    },

    // Hero区域鼠标移动事件
    enterDigitalMuseum() {
      this.$router.push('/digital-history')
    },

    scrollToHistory() {
      const element = document.getElementById('history')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },

    openUniverse() {
      this.$router.push('/universe')
    },

    // 用户菜单切换
    toggleUserMenu(e) {
      if (e) {
        e.stopPropagation()
      }
      this.showUserMenu = !this.showUserMenu
    },

    handleClickOutside(e) {
      const userMenu = this.$el?.querySelector('.user-menu')
      if (userMenu && !userMenu.contains(e.target) && this.showUserMenu) {
        this.showUserMenu = false
      }
    },

    goToProfile(e) {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      this.showUserMenu = false
      this.$nextTick(() => {
        this.$router.push('/profile').catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            console.error('路由跳转错误:', err)
          }
        })
      })
    },

    logout() {
      this.isLoggedIn = false
      this.userInfo = { username: '', avatar: '' }
      this.showUserMenu = false

      localStorage.removeItem('userInfo')
      sessionStorage.removeItem('userInfo')

      this.showToast('已退出登录', 'success')
    },

    checkLoginStatus() {
      let savedUser = localStorage.getItem('userInfo')
      if (!savedUser) {
        savedUser = sessionStorage.getItem('userInfo')
      }

      if (savedUser) {
        try {
          this.userInfo = JSON.parse(savedUser)
          this.isLoggedIn = true
        } catch (error) {
          console.error('解析用户信息失败:', error)
          localStorage.removeItem('userInfo')
          sessionStorage.removeItem('userInfo')
        }
      }
    },

    closeLoginModal() {
      this.showLoginModal = false
    },

    closeRegisterModal() {
      this.showRegisterModal = false
    },

    closeForgotPasswordModal() {
      this.showForgotPasswordModal = false
    },

    switchToRegister() {
      this.showLoginModal = false
      this.showForgotPasswordModal = false
      this.showRegisterModal = true
    },

    switchToLogin() {
      this.showRegisterModal = false
      this.showForgotPasswordModal = false
      this.showLoginModal = true
    },

    switchToForgotPassword() {
      this.showLoginModal = false
      this.showRegisterModal = false
      this.showForgotPasswordModal = true
    },

    handleLoginSuccess(userInfo) {
      this.userInfo = userInfo
      this.isLoggedIn = true

      if (userInfo.remember) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        sessionStorage.removeItem('userInfo')
      } else {
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        localStorage.removeItem('userInfo')
      }
    },

    handleRegisterSuccess(userInfo) {
      this.userInfo = userInfo
      this.isLoggedIn = true
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      localStorage.removeItem('userInfo')
    },

    // 轮播相关方法
    startAutoScroll() {
      this.scrollInterval = setInterval(() => {
        if (!this.isScrolling) {
          this.nextPerson()
        }
      }, 5000)
    },

    stopAutoScroll() {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval)
        this.scrollInterval = null
      }
    },

    nextPerson() {
      this.currentIndex = (this.currentIndex + 1) % this.persons.length
    },

    pauseScroll() {
      this.isScrolling = true
      this.stopAutoScroll()
    },

    resumeScroll() {
      this.isScrolling = false
      this.startAutoScroll()
    },

    // Hero区域鼠标移动事件
    handleHeroMouseMove(e) {
      const heroSection = this.$refs.heroSection
      if (!heroSection) return

      const rect = heroSection.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      this.mouseX = (e.clientX - centerX) / rect.width
      this.mouseY = (e.clientY - centerY) / rect.height

      const parallaxX = this.mouseX * 30
      const parallaxY = this.mouseY * 30

      this.heroContentStyle = {
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        transition: 'transform 0.1s ease-out'
      }
    },

    handleScrollParallax() {
      const heroSection = this.$refs.heroSection
      if (!heroSection) return

      const scrollY = window.scrollY
      const heroHeight = heroSection.offsetHeight
      const scrollProgress = Math.min(scrollY / heroHeight, 1)

      if (scrollProgress < 0.5) {
        const opacity = 1 - scrollProgress * 2
        this.heroContentStyle.opacity = opacity
      }
    },

    openMediaLightbox(media, mediaList = [], index = 0) {
      this.currentMedia = media
      this.mediaList = mediaList.length > 0 ? mediaList : [media]
      this.mediaIndex = index
      this.mediaLightboxOpen = true
    },

    closeMediaLightbox() {
      this.mediaLightboxOpen = false
    },

    showToast(message, type = 'info') {
      const toast = document.createElement('div')
      toast.className = `toast toast-${type}`
      toast.textContent = message

      Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        fontSize: '14px',
        maxWidth: '300px',
        wordWrap: 'break-word'
      })

      const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
      }
      toast.style.backgroundColor = colors[type] || colors.info

      document.body.appendChild(toast)

      setTimeout(() => {
        toast.style.transform = 'translateX(0)'
      }, 100)

      setTimeout(() => {
        toast.style.transform = 'translateX(100%)'
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast)
          }
        }, 300)
      }, 3000)
    },

    // 背景图片轮播相关方法
    startBackgroundSlider() {
      this.backgroundTimer = setInterval(() => {
        this.nextBackground()
      }, 10000)
    },

    stopBackgroundSlider() {
      if (this.backgroundTimer) {
        clearInterval(this.backgroundTimer)
        this.backgroundTimer = null
      }
    },

    nextBackground() {
      const nextIndex = (this.currentBackgroundIndex + 1) % this.backgroundImages.length
      const currentIndex = this.currentBackgroundIndex

      if (this.nextBackgroundIndex !== nextIndex) {
        this.nextBackgroundIndex = nextIndex
      }

      this.$nextTick(() => {
        requestAnimationFrame(() => {
          this.prevBackgroundIndex = currentIndex
          this.currentBackgroundIndex = nextIndex

          setTimeout(() => {
            this.prevBackgroundIndex = -1
            this.nextBackgroundIndex = (nextIndex + 1) % this.backgroundImages.length
          }, 800)
        })
      })
    },

    // 时间格式化
    formatTime() {
      try {
        return new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (e) {
        return ''
      }
    },

    // AI 助手相关方法
    scrollAIMessagesToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.aiMessagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },

    toggleAIWindow() {
      this.aiWindowOpen = !this.aiWindowOpen
      if (this.aiWindowOpen) {
        this.scrollAIMessagesToBottom()
      }
    },
    handleFabClick() {
      // 如果拖动了浮动按钮，则不切换弹窗状态
      if (this.aiDragMoved) {
        this.aiDragMoved = false
        return
      }
      this.toggleAIWindow()
    },

    onCloseAIWindow() {
      this.aiWindowOpen = false
      this.cancelAIStream()
    },

    handleAISend() {
      const text = this.aiInput.trim()
      if (!text || this.aiLoading) return

      this.aiMessages.push({
        role: 'user',
        content: text,
        time: this.formatTime()
      })
      this.aiInput = ''
      this.scrollAIMessagesToBottom()

      this.requestAIReply(text)
    },

    cancelAIStream() {
      try {
        if (this.aiAbortController) {
          this.aiAbortController.abort()
          this.aiAbortController = null
        }
      } catch (_) {}
    },

    async requestAIReply(userText) {
      // 取消上一次请求
      this.cancelAIStream()

      this.aiLoading = true

      // 添加助手回复占位符
      const idx = this.aiMessages.push({
        role: 'assistant',
        content: '',
        time: this.formatTime()
      }) - 1
      this.aiStreamingIndex = idx
      this.scrollAIMessagesToBottom()

      // 构造请求数据
      const payload = {
        question: userText,  
        history: this.aiMessages.slice(0, -1).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        useKnowledgeBase: true  
      }

      const url = `${this.apiBase}/api/ai/chat`
      const controller = new AbortController()
      this.aiAbortController = controller

      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            // 如果需要 cookie，取消注释：
            // 'Authorization': `Bearer ${yourToken}`
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
          // 如果需要 cookie，取消注释：
          // credentials: 'include'
        })

        if (!resp.ok || !resp.body) {
          throw new Error(`请求失败：${resp.status} ${resp.statusText}`)
        }

        const reader = resp.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''

        const commitChunk = (text) => {
          if (!text) return
          this.aiMessages[this.aiStreamingIndex].content += text
          this.scrollAIMessagesToBottom()
        }

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          // SSE 使用 \n\n 分隔事件
          let idxSep
          while ((idxSep = buffer.indexOf('\n\n')) !== -1) {
            const rawEvent = buffer.slice(0, idxSep)
            buffer = buffer.slice(idxSep + 2)

            // 解析单个事件
            const lines = rawEvent.split('\n')
            let eventName = 'message'
            let dataLines = []

            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventName = line.slice(6).trim()
              } else if (line.startsWith('data:')) {
                dataLines.push(line.slice(5))
              }
            }
            const data = dataLines.join('\n')

            if (eventName === 'message') {
              commitChunk(data)
            } else if (eventName === 'error') {
              // 处理后端 error 事件
              commitChunk(`\n[错误] ${data}`)
            }
          }
        }
      } catch (err) {
        console.error('AI 请求失败：', err)
        this.aiMessages[this.aiStreamingIndex].content += `\n[连接中断] ${err?.message || ''}`
      } finally {
        this.aiLoading = false
        this.aiAbortController = null
        this.aiStreamingIndex = null
        this.scrollAIMessagesToBottom()
      }
    },

    // AI 助手：开始拖拽（支持弹窗 + 浮标，系统一起动：大窗口 + 小图标）
    startAIDrag(e) {
      const container = this.$refs.aiContainer
      if (!container) return

      this.aiDragging = true
      this.aiDragMoved = false

      const rect = container.getBoundingClientRect()

      this.aiDragStartX = e.clientX - rect.left
      this.aiDragStartY = e.clientY - rect.top

      window.addEventListener('pointermove', this.onAIDrag)
      window.addEventListener('pointerup', this.endAIDrag)
    },

    // AI 助手：拖拽中
    onAIDrag(e) {
      if (!this.aiDragging) return

      const container = this.$refs.aiContainer
      if (!container) return

      const vw = window.innerWidth
      const vh = window.innerHeight
      const padding = 8
      const width = container.offsetWidth
      const height = container.offsetHeight

      let newLeft = e.clientX - this.aiDragStartX
      let newTop = e.clientY - this.aiDragStartY

      const dx = e.movementX || 0
      const dy = e.movementY || 0
      if (Math.abs(dx) + Math.abs(dy) > 2) {
        this.aiDragMoved = true
      }

      newLeft = Math.max(padding, Math.min(vw - width - padding, newLeft))
      newTop = Math.max(padding, Math.min(vh - height - padding, newTop))

      this.aiPopupPosition.left = newLeft
      this.aiPopupPosition.top = newTop
    },

    // AI 助手：结束拖拽
    endAIDrag() {
      if (!this.aiDragging) return

      this.aiDragging = false
      window.removeEventListener('pointermove', this.onAIDrag)
      window.removeEventListener('pointerup', this.endAIDrag)
    },

    // 加载人物数据
    async loadPersonsData() {
      try {
        console.log('[MainPage] 开始加载人物数据...')
        // 加载所有人物数据
        this.allPersonsData = await getAllPersonProfiles()
        console.log('[MainPage] 原始数据:', this.allPersonsData)
        
        // 转换数据格式并选择前2个重要人物
        const allPersonsList = Object.values(this.allPersonsData).map(personData => 
          this.mapPersonToDisplayFormat(personData)
        )
        
        console.log('[MainPage] 转换后的数据列表:', allPersonsList)
        
        // 选择前2个作为首页展示人物
        this.persons = allPersonsList.slice(0, 2)
        
        console.log('✅ 人物数据加载完成:', {
          total: allPersonsList.length,
          displayPersons: this.persons.length,
          persons: this.persons
        })
      } catch (error) {
        console.error('❌ 加载人物数据失败:', error)
        this.persons = []
        this.allPersonsData = {}
      }
    },

    // 加载首页展示的人物数据
    async loadFeaturedPersons() {
      try {
        const url = `${this.apiBase}/api/person/list`
        const response = await fetch(url)
        const result = await response.json()
        
        if (result.success && result.data) {
          // 解析keyTags字段
          const persons = result.data.map(person => {
            try {
              if (person.keyTags) {
                person.keyTagsList = JSON.parse(person.keyTags)
              } else {
                person.keyTagsList = []
              }
            } catch (e) {
              person.keyTagsList = []
            }
            
            // 处理图片路径 - 使用imageLoader
            if (person.imageUrl) {
              if (person.imageUrl.startsWith('http://') || person.imageUrl.startsWith('https://')) {
                // HTTP URL直接使用
                person.imageUrl = person.imageUrl
              } else {
                // 使用imageLoader加载本地图片
                person.imageUrl = getPersonImage(person.imageUrl)
              }
            } else {
              person.imageUrl = getPersonImage(null)
            }
            
            return person
          })
          
          // 取前4个人物
          this.featuredPersons = persons.slice(0, 4)
          console.log('✅ 首页人物数据加载完成:', this.featuredPersons)
        }
      } catch (error) {
        console.error('❌ 加载首页人物数据失败:', error)
        this.featuredPersons = []
      }
    },

    // 加载首页展示的事件数据
    async loadFeaturedEvents() {
      try {
        const url = `${this.apiBase}/api/history/events`
        const response = await fetch(url)
        const result = await response.json()
        
        if (result.success && result.data) {
          // 取前4个重要事件
          this.featuredEvents = result.data
            .filter(event => event.importance === 'high' || event.importance === '重要')
            .slice(0, 4)
          
          console.log('✅ 首页事件数据加载完成:', this.featuredEvents)
        }
      } catch (error) {
        console.error('❌ 加载首页事件数据失败:', error)
        this.featuredEvents = []
      }
    },

    // 跳转到人物详情
    goToPersonDetail(personId) {
      this.$router.push(`/person/${personId}`)
    },

    // 跳转到事件详情
    goToEventDetail(eventId) {
      // 目前跳转到历史页面，可以根据需要修改
      this.$router.push('/digital-history')
    },
    
    // 将数据库人物数据转换为显示格式
    mapPersonToDisplayFormat(personData) {
      // 获取时间信息
      let period = ''
      if (personData.biography && personData.biography.length > 0) {
        const firstBio = personData.biography[0]
        if (firstBio.content) {
          const yearMatch = firstBio.content.match(/(\d{4})/)
          if (yearMatch) {
            period = `${yearMatch[1]}—`
          }
        }
      }
      
      // 根据标签和subtitle判断学科和成就
      let badge = '教授'
      let badgeClass = 'badge-professor'
      
      // 优先从subtitle中提取头衔信息
      if (personData.subtitle) {
        const subtitle = personData.subtitle.toString()
        if (subtitle.includes('院士')) {
          badge = '院士'
          badgeClass = 'badge-president'
        } else if (subtitle.includes('名誉校长') || subtitle.includes('校长')) {
          badge = '名誉校长'
          badgeClass = 'badge-president'
        } else if (subtitle.includes('奠基人')) {
          badge = '奠基人'
          badgeClass = 'badge-founder'
        } else if (subtitle.includes('部长') || subtitle.includes('厅长')) {
          badge = '部长'
          badgeClass = 'badge-president'
        } else if (subtitle.includes('烈士')) {
          badge = '烈士'
          badgeClass = 'badge-founder'
        }
      }
      
      // 从keyTags中补充判断
      const keyTags = personData.keyTags || []
      if (keyTags.some(tag => tag.includes('院士'))) {
        badge = '院士'
        badgeClass = 'badge-president'
      } else if (keyTags.some(tag => tag.includes('奠基') || tag.includes('建校元勋') || tag.includes('五大奠基人'))) {
        badge = '奠基人'
        badgeClass = 'badge-founder'
      }
      
      return {
        id: personData.id,
        name: personData.name,
        title: personData.subtitle || '成都理工大学人物',
        period: period,
        image: personData.image,
        badge: badge,
        badgeClass: badgeClass,
        tags: keyTags.slice(0, 3)
      }
    }
  },

  async mounted() {
    try {
      this.checkLoginStatus()

      document.addEventListener('click', this.handleClickOutside)
      window.addEventListener('scroll', this.handleScrollParallax, { passive: true })

      this.startBackgroundSlider()

      // 加载人物数据
      await this.loadPersonsData()

      // 初始化 AI 弹窗位置（右下角）
      if (typeof window !== 'undefined') {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const popupWidth = 220
        const totalHeight = 120 // 弹窗 + 小图标上下高度
        const margin = 10

        this.aiPopupPosition.left = vw - popupWidth - margin
        this.aiPopupPosition.top = vh - totalHeight - margin
      }

      if (this.aiMessages.length > 0 && !this.aiMessages[0].time) {
        this.aiMessages[0].time = this.formatTime()
      }

      ;(async () => {
        try {
          console.log('[MainPage] 开始预加载人物简介信息...')
          const profiles = await getAllPersonProfiles()
          console.log('[MainPage] 人物简介信息预加载完成，数量:', Object.keys(profiles || {}).length)
        } catch (preloadError) {
          console.error('[MainPage] 预加载人物数据失败:', preloadError)
        }
      })()

      // 加载首页展示的人物和事件数据
      this.loadFeaturedPersons()
      this.loadFeaturedEvents()
    } catch (error) {
      console.error('MainPage mounted error:', error)
    }
  },

  beforeUnmount() {
    try {
      this.stopAutoScroll()
      this.stopBackgroundSlider()
      window.removeEventListener('scroll', this.handleScrollParallax)
      document.removeEventListener('click', this.handleClickOutside)
      this.endAIDrag()
      this.cancelAIStream()
    } catch (error) {
      console.error('MainPage beforeUnmount error:', error)
    }
  }
}
</script>

<style scoped>
/* 页面布局 */
.person-list-page {
  position: relative;
  min-height: 100vh;
  background: transparent;
  font-family: 'Arial', sans-serif;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 背景图片轮播容器 */
.background-slider {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* 背景图片单个幻灯片 */
.background-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: brightness(0.6);
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, opacity;
  z-index: 1;
}

/* 当前显示的图片 - 正中间位置 */
.background-slide.active {
  transform: translateX(0) !important;
  opacity: 1 !important;
  z-index: 2;
}

/* 下一张要显示的图片 - 在右侧等待 */
.background-slide.next {
  transform: translateX(100%);
  opacity: 0;
  z-index: 1;
}

/* 下一张图片同时是active时 - 从右侧滑入 */
.background-slide.next.active {
  transform: translateX(0) !important;
  opacity: 1 !important;
  z-index: 2;
}

/* 上一张图片 - 左侧滑出（已滑出） */
.background-slide.prev {
  transform: translateX(-100%) !important;
  opacity: 0 !important;
  z-index: 0;
}

/* 页面头部 */
.page-header {
  position: sticky;
  top: 0;
  background: transparent;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  z-index: 100;
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 0;
}

.university-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.main-logo {
  font-size: 1.8rem;
  color: #ffffff;
  margin: 0;
  font-weight: bold;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.main-nav {
  display: flex;
  gap: 20px;
  margin-left: 100px;
}

.nav-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.nav-link.highlight {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: #2c3e50;
  font-weight: 700;
  border-color: #ffd700;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

/* 用户认证区域样式 */
.auth-section {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.auth-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.auth-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.login-btn {
  background: rgba(52, 152, 219, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.login-btn:hover {
  background: rgba(52, 152, 219, 0.4);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

.register-btn {
  background: rgba(52, 152, 219, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.register-btn:hover {
  background: rgba(52, 152, 219, 0.4);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

/* 用户信息显示 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-menu {
  position: relative;
}

.user-menu-btn {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  cursor: pointer;
  padding: 6px 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.user-dropdown a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: #2c3e50;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.user-dropdown a:hover {
  background: rgba(74, 144, 226, 0.1);
  color: #4a90e2;
}

.user-dropdown a i {
  width: 18px;
  text-align: center;
}

/* 主要内容 */
.main-content {
  position: relative;
  padding: 0;
  background: transparent;
  z-index: 1;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  transform: translateY(-80px);
  will-change: transform;
}

.hero-layer {
  position: relative;
  z-index: 1;
}

.hero-layer-foreground {
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-logo-img {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  background: white;
  padding: 0;
  object-fit: cover;
}

.hero-title {
  font-size: 3rem;
  margin: 0 0 20px 0;
  font-weight: 700;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  opacity: 0.95;
}

.hero-slogan {
  font-size: 1.4rem;
  margin: 0 0 40px 0;
  font-weight: 500;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.hero-btn {
  padding: 15px 40px;
  font-size: 1.1rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-btn.primary {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.hero-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  backdrop-filter: blur(10px);
}

/* 通用Section样式 */
section {
  padding: 60px 40px;
  position: relative;
  z-index: 1;
}

.section-header-main {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(102, 126, 234, 0.6);
  backdrop-filter: blur(10px);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.section-title-main {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-weight: 700;
}

.section-divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  margin: 0 auto 20px;
  border-radius: 2px;
}

.section-desc {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

/* About Section */
.about-section {
  position: relative;
  background: transparent;
  backdrop-filter: blur(5px);
}

.about-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

/* Timeline Section */
.timeline-section {
  position: relative;
  background: transparent;
  backdrop-filter: blur(5px);
}

.timeline-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.timeline-content {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Achievements Section */
.achievements-section {
  position: relative;
  background: transparent;
  backdrop-filter: blur(5px);
}

.achievement-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #2c3e50;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 35px 25px;
  border-radius: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Digital Museum Section */
.digital-museum-section {
  background: transparent;
  color: white;
}

.digital-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.digital-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  padding: 40px 30px;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  cursor: pointer;
  transition: all 0.4s ease;
}

.digital-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

/* Vision Section */
.vision-section {
  position: relative;
  background: transparent;
  backdrop-filter: blur(5px);
}

.vision-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 60px;
}

.vision-goals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.goal-item {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 35px 25px;
  border-radius: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.container {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

/* AI 助手样式 */
.ai-assistant {
  position: fixed;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* 浮动按钮 */
.ai-fab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: radial-gradient(circle at 0% 0%, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
  color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(14px);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;
}

.ai-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
}

.ai-fab-avatar-wrap {
  width: 60px;   
  height: 60px;  
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-fab-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-fab-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.ai-fab-title {
  font-size: 14px;
  font-weight: 700;
}

.ai-fab-subtitle {
  font-size: 11px;
  opacity: 0.86;
}

/* 聊天窗口 */
.ai-popup {
  width: 400px;
  height: 350px;
  max-height: 600px;
  background: rgba(11, 22, 43, 0.96);
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-popup-header {
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.22), rgba(118, 75, 162, 0.18));
  cursor: move;
}

.ai-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.ai-header-text {
  display: flex;
  flex-direction: column;
}

.ai-header-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.ai-header-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.78);
}

.ai-header-close {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.09);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.ai-header-close:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: rotate(8deg);
}

/* 消息区域 */
.ai-popup-body {
  flex: 1;
  padding: 10px 12px;
  overflow: hidden;
}

.ai-messages {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.ai-message-row.is-assistant {
  justify-content: flex-start;
}

.ai-message-row.is-user {
  justify-content: flex-end;
}

.ai-message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
}

.ai-message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-message-avatar.user {
  color: #fff;
  font-size: 14px;
}

.ai-message-bubble {
  max-width: 75%;
  border-radius: 14px;
  padding: 8px 11px;
  font-size: 13px;
  line-height: 1.4;
  position: relative;
}

.ai-message-row.is-assistant .ai-message-bubble {
  background: radial-gradient(circle at 0% 0%, rgba(102, 126, 234, 0.6), rgba(75, 108, 183, 0.65));
  color: #fff;
  border-bottom-left-radius: 4px;
}

.ai-message-row.is-user .ai-message-bubble {
  background: rgba(255, 255, 255, 0.92);
  color: #111827;
  border-bottom-right-radius: 4px;
}

.ai-message-content {
  margin: 0 0 4px 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.ai-message-meta {
  font-size: 10px;
  opacity: 0.78;
}

/* 打字指示器 */
.ai-typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  margin-top: 4px;
  margin-left: 32px;
}

.ai-typing-indicator span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  animation: ai-bounce 1s infinite ease-in-out;
}

.ai-typing-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.ai-typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes ai-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* 底部输入区域 */
.ai-popup-footer {
  padding: 8px 10px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(circle at 0% 0%, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.94));
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ai-input {
  width: 100%;
  resize: none;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.85);
  padding: 6px 8px;
  color: #e5e7eb;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.ai-input::placeholder {
  color: rgba(148, 163, 184, 0.85);
}

.ai-input:focus {
  border-color: rgba(129, 140, 248, 0.9);
  box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.8);
  background: rgba(15, 23, 42, 0.98);
}

.ai-footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ai-hint {
  font-size: 10px;
  color: rgba(148, 163, 184, 0.92);
}

.ai-send-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(55, 65, 81, 0.8);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.ai-send-btn i {
  font-size: 12px;
}

.ai-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.ai-send-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 30px rgba(55, 65, 81, 0.9);
}

.ai-popup-fade-enter-active,
.ai-popup-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.ai-popup-fade-enter-from,
.ai-popup-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* 人物和事件板块样式 */
.content-blocks-section {
  position: relative;
  padding: 60px 0 120px 0;
  background: white;
  min-height: 80vh;
  z-index: 2;
}

.content-blocks-section .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

.content-block {
  background: white;
  padding: 30px;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.block-icon {
  font-size: 1.5rem;
}

.block-title {
  flex: 1;
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.block-more {
  color: #666;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
}

.block-more:hover {
  color: #333;
  text-decoration: underline;
}

.block-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.content-card {
  background: white;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.content-card:hover {
  background: #fafafa;
}

.content-card:last-child {
  border-bottom: none;
}

.person-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-image {
  display: none;
}

.card-info {
  padding: 0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.card-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 8px 0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background: #f5f5f5;
  color: #666;
  font-size: 0.8rem;
  font-weight: 400;
}

.event-card {
  display: flex;
  gap: 15px;
  padding: 0;
}

.event-year {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  min-width: 60px;
}

.card-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-meta {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.event-type,
.event-importance {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.8rem;
  font-weight: 400;
}

.event-type {
  background: #f5f5f5;
  color: #666;
}

.event-importance {
  background: #f5f5f5;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 0.95rem;
}

/* 响应式适配 */
@media (max-width: 768px) {
  section {
    padding: 40px 20px;
  }

  .header-content {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
  }

  .university-logo {
    width: 60px;
    height: 60px;
  }

  .main-logo {
    font-size: 1.4rem;
  }

  .main-nav {
    margin-left: 0;
    gap: 10px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-slogan {
    font-size: 1.2rem;
  }

  .about-content, .vision-content {
    grid-template-columns: 1fr;
  }

  .ai-popup {
    width: 92vw;
    max-height: 70vh;
  }

  /* 人物和事件板块响应式 */
  .content-blocks-section {
    padding: 40px 0;
  }

  .content-blocks-section .container {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 0 20px;
  }

  .block-title {
    font-size: 1.3rem;
  }

  .event-year {
    font-size: 1rem;
    min-width: 50px;
  }
}
</style>