<template>
  <div class="person-list-page">
    <!-- 背景层：根据当前页切换背景 -->
    <div class="background-layer">
      <!-- 首页：背景轮播 -->
      <div v-if="currentPage === 0" class="background-slider">
        <div
          v-for="(bg, index) in backgroundImages"
          :key="index"
          class="background-slide"
          :class="{
            active: index === currentBackgroundIndex,
            next: index === nextBackgroundIndex,
            prev: index === prevBackgroundIndex
          }"
          :style="{ backgroundImage: `url(${bg})` }"
        ></div>
        <div class="background-gradient top"></div>
        <div class="background-gradient bottom"></div>
      </div>

      <!-- 第二页：1956年首届开学典礼 固定背景 -->
      <div
        v-else-if="currentPage === 1"
        class="background-static second-bg"
        :style="{ backgroundImage: `url(${openingCeremonyImage})` }"
      >
        <div class="second-bg-gradient"></div>
      </div>

      <!-- 第三页：历史时钟 苏式建筑背景 -->
      <div
        v-else-if="currentPage === 2"
        class="background-static third-bg"
        :class="{ 'bg-active': currentPage === 2 }"
        :style="{ backgroundImage: `url(${sovietBuilding1Image})` }"
      >
      </div>

      <!-- 第四页：1990年油气藏重点实验室获批建设 固定背景 -->
      <div
        v-else-if="currentPage === 3"
        class="background-static fourth-bg"
        :style="{ backgroundImage: `url(${lab1990Image})` }"
      >
        <div class="second-bg-gradient"></div>
      </div>


    </div>

    <!-- 页面头部 -->
    <header class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-container">
              <img :src="cdutLogo" alt="成都理工大学" class="university-logo" />
              <div class="logo-text">
                <img :src="cdutEnglishName" alt="Chengdu University of Technology" class="english-name-image" />
                <img :src="cdutChineseName" alt="成都理工大学" class="chinese-name-image" />
              </div>
            </div>
          </div>
          <nav class="main-nav">
            <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
              首页
            </router-link>
            <router-link
              to="/persons"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/persons') }"
            >
              杏坛群英
            </router-link>
            <router-link
              to="/digital-history"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/digital-history') }"
            >
              流金岁月
            </router-link>
            <router-link
              to="/universe"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/universe') }"
            >
              学科星河
            </router-link>
            <router-link
              to="/keyword-rain"
              class="nav-link"
              :class="{ active: $route.path === '/keyword-rain' }"
            >
              词林雨露
            </router-link>
            <router-link
              to="/draw-reveal"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/draw-reveal') }"
            >
              像素岁月
            </router-link>
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
          <!-- /用户认证区域 -->
        </div>
      </div>
    </header>

    <!-- 主体：全屏翻页容器 -->
    <main class="main-content">
      <div
        class="fullpage-wrapper"
        ref="fullpageWrapper"
        tabindex="0"
        @wheel.prevent="onWheel"
        @keydown="onKeyDown"
        @touchstart="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="fullpage-inner" :style="fullpageStyle">
          <!-- 第 1 页：Hero -->
          <section
            class="page-section hero-section"
            :class="{ 'page-active': currentPage === 0 }"
            ref="heroSection"
          >
            <div class="hero-overlay"></div>

            <div class="hero-inner">
              <img 
                src="@/assets/mainpage/11学校校训反白(横式).png" 
                alt="穷究于理 成就于工" 
                class="hero-title-image"
              />
              <div class="hero-content">
                <div class="hero-kicker">
                  成都理工大学 · 数字校史馆
                </div>
                <p class="hero-subtitle">
                  以影像与档案，串联起成理从建校肇始到今日的每一段时光。
                </p>
                <div class="hero-meta">
                  <span class="meta-pill">始建 1956</span>
                  <span class="meta-dot"></span>
                  <span class="meta-text">成都地质勘探学院</span>
                </div>
              </div>
            </div>

            <!-- 底部小提示：只在第一页显示 -->
            <div v-if="currentPage === 0" class="scroll-indicator">
              <span>向下滑动，走进成理校史</span>
              <div class="scroll-arrow"></div>
            </div>
          </section>

          <!-- 第 2 页：人物卡片 -->
          <section class="page-section second-section" :class="{ 'page-active': currentPage === 1 }">
            <div class="grid-container">
              <router-link to="/person/xuqiang" class="grid-box person-card box-1">
                <h3>许强</h3>
                <p class="person-intro">察地表毫厘之变，守万家平安之门</p>
              </router-link>
              <router-link to="/person/xiongshengqing" class="grid-box person-card box-2">
                <h3>熊盛青</h3>
                <p class="person-intro">俯瞰九州寻地脉，翱翔万里探矿藏</p>
              </router-link>
              <router-link to="/person/zhangzhuoyuan" class="grid-box person-card box-3">
                <h3>张倬元</h3>
                <p class="person-intro">拓工程地质之学，筑成理基业之石</p>
              </router-link>
              <router-link to="/person/liubaojun" class="grid-box person-card box-4">
                <h3>刘宝珺</h3>
                <p class="person-intro">览古今沉积之痕，绘华夏地理之卷</p>
              </router-link>
            </div>
          </section>

          <!-- 第 3 页：历史时钟 -->
          <section class="page-section third-section" :class="{ 'page-active': currentPage === 2 }">
            <!-- 城堡背景装饰 -->
            <div class="castle-background">
              <!-- 欧式建筑主体 -->
              <div class="brick-building">
                <!-- 人字形屋顶 -->
                <div class="roof-gable">
                  <div class="roof-triangle"></div>
                  <div class="roof-trim"></div>
                  <!-- 屋顶窗户 -->
                  <div class="roof-windows">
                    <div class="roof-window"></div>
                    <div class="roof-window"></div>
                    <div class="roof-window"></div>
                  </div>
                </div>
                
                <!-- 红砖墙体 -->
                <div class="brick-wall">
                  <!-- 门廊装饰 -->
                  <div class="portico">
                    <div class="portico-top"></div>
                    <div class="column column-left"></div>
                    <div class="column column-right"></div>
                  </div>
                  
                  <!-- 三个拱形门 -->
                  <div class="arched-doors">
                    <div class="arched-door">
                      <div class="door-arch"></div>
                      <div class="door-panel"></div>
                    </div>
                    <div class="arched-door">
                      <div class="door-arch"></div>
                      <div class="door-panel"></div>
                    </div>
                    <div class="arched-door">
                      <div class="door-arch"></div>
                      <div class="door-panel"></div>
                    </div>
                  </div>
                </div>
                
                <!-- 底部栏杆 -->
                <div class="balustrade">
                  <div class="baluster"></div>
                  <div class="baluster"></div>
                  <div class="baluster"></div>
                  <div class="baluster"></div>
                  <div class="baluster"></div>
                  <div class="baluster"></div>
                  <div class="baluster"></div>
                  <div class="baluster"></div>
                  <div class="baluster"></div>
                  <div class="baluster"></div>
                </div>
                
                <!-- 台阶 -->
                <div class="steps">
                  <div class="step step-1"></div>
                  <div class="step step-2"></div>
                  <div class="step step-3"></div>
                </div>
              </div>
              
              <!-- 底部渐变 -->
              <div class="castle-foundation"></div>
            </div>
            
            <!-- 历史时钟（在城堡之上） -->
            <div class="history-clock-wrapper">
              <HistoryClock />
            </div>
          </section>

          <!-- 第 4 页：三分斜线分割 -->
          <section class="page-section fourth-section" :class="{ 'page-active': currentPage === 3 }">
            <div class="split-container">
              <!-- 左侧部分 -->
              <router-link to="/universe" class="split-section left-section">
                <div class="split-content">
                  <h2>学科星河</h2>
                </div>
              </router-link>
              <!-- 中间部分 -->
              <router-link to="/draw-reveal" class="split-section middle-section">
                <div class="split-content">
                  <h2>像素岁月</h2>
                </div>
              </router-link>
              <!-- 右侧部分 -->
              <router-link to="/keyword-rain" class="split-section right-section">
                <div class="split-content">
                  <h2>词林雨露</h2>
                </div>
              </router-link>
              <!-- 斜线 -->
              <div class="diagonal-line"></div>
            </div>
          </section>


        </div>

        <!-- 右侧翻页指示点 -->
        <div class="page-indicators">
          <button
            v-for="index in totalPages"
            :key="index"
            class="indicator-dot"
            :class="{ active: currentPage === index - 1 }"
            @click="goToPage(index - 1)"
          ></button>
        </div>
      </div>
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

    <!-- AI 助手弹窗 + 小图标 -->
    <div
      class="ai-assistant"
      ref="aiContainer"
    >
      <!-- 聊天窗口 -->
      <transition name="ai-popup-fade">
        <div v-if="aiWindowOpen" class="ai-popup" ref="aiPopup">
          <div class="ai-popup-header">
            <div class="ai-header-info">
              <video 
                autoplay 
                loop 
                muted 
                playsinline 
                disablepictureinpicture
                controlslist="nodownload nofullscreen noremoteplayback"
                class="ai-header-avatar"
              >
                <source src="@/assets/ai/sit.webm" type="video/webm">
              </video>
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
              <!-- 快速问题建议 -->
              <div v-if="aiMessages.length === 0 && !aiLoading" class="ai-quick-questions">
                <div class="quick-question-title">你可能想问：</div>
                <button 
                  v-for="(question, idx) in quickQuestions" 
                  :key="idx"
                  class="quick-question-btn"
                  @click="handleQuickQuestion(question)"
                >
                  {{ question }}
                </button>
              </div>

              <div
                v-for="(msg, index) in aiMessages"
                :key="index"
                class="ai-message-row"
                :class="msg.role === 'user' ? 'is-user' : 'is-assistant'"
              >
                <div class="ai-message-avatar" v-if="msg.role === 'assistant'">
                  <video 
                    autoplay 
                    loop 
                    muted 
                    playsinline 
                    disablepictureinpicture
                    controlslist="nodownload nofullscreen noremoteplayback"
                    class="ai-message-video"
                  >
                    <source src="@/assets/ai/sit.webm" type="video/webm">
                  </video>
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
                  <!-- AI消息的满意度反馈 -->
                  <div v-if="msg.role === 'assistant'" class="ai-message-feedback">
                    <button 
                      class="feedback-btn" 
                      :class="{ active: msg.feedback === 'like' }"
                      @click="handleFeedback(index, 'like')"
                      title="这个回答有帮助"
                    >
                      <i class="fas fa-thumbs-up"></i>
                    </button>
                    <button 
                      class="feedback-btn" 
                      :class="{ active: msg.feedback === 'dislike' }"
                      @click="handleFeedback(index, 'dislike')"
                      title="这个回答需要改进"
                    >
                      <i class="fas fa-thumbs-down"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="aiLoading" class="ai-typing-indicator">
                <span></span><span></span><span></span>
              </div>

              <!-- 相关问题推荐 -->
              <div v-if="relatedQuestions.length > 0 && !aiLoading" class="ai-related-questions">
                <div class="related-title">您还可以问：</div>
                <button 
                  v-for="(question, idx) in relatedQuestions" 
                  :key="idx"
                  class="related-question-btn"
                  @click="handleQuickQuestion(question)"
                >
                  {{ question }}
                </button>
              </div>
            </div>
          </div>

          <div class="ai-popup-footer">
            <textarea
              v-model="aiInput"
              class="ai-input"
              rows="2"
              placeholder="可以试着问：成理是哪一年建校的？ / 校史馆里有哪些模块？"
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

      <!-- 浮动按钮 -->
      <button
        class="ai-fab"
        @click="handleFabClick"
      >
        <video 
          :key="aiVideoSrc"
          autoplay 
          loop 
          muted 
          playsinline 
          disablepictureinpicture
          controlslist="nodownload nofullscreen noremoteplayback"
          class="ai-fab-avatar"
        >
          <source :src="aiVideoSrc" type="video/webm">
        </video>
      </button>
    </div>
  </div>
</template>

<script>
import cdutLogo from '@/assets/mainpage/01标示标准彩色图形反白.png'
import cdutChineseName from '@/assets/mainpage/02中文校名规范01反白横.png'
import cdutEnglishName from '@/assets/mainpage/03英文校名规范01反白横.png'
import defaultAvatar from '@/assets/default-avatar.png'
import AuthModal from '@/components/AuthModal.vue'
import MediaLightbox from '@/components/MediaLightbox.vue'
import HistoryClock from '@/components/HistoryClock.vue'
import { getAllPersonProfiles } from '@/services/personDataService'
import { getPersonImage } from '@/utils/imageLoader'
import HomeOilGasLab1990 from '@/components/home/HomeOilGasLab1990.vue'
import HomeRename1993 from '@/components/home/HomeRename1993.vue'

// 背景图片
import libraryImageSrc from '@/assets/mainbg/新图书馆.jpg'
import buildingImageSrc from '@/assets/mainbg/东区教学楼.jpg'
import openingCeremonyImageSrc from '@/assets/events/1956年首届开学典礼.jpg'
import foundingImageSrc from '@/assets/events/1956_01_成都地质勘探学院成立.png'
import lab1990ImageSrc from '@/assets/events/1990年油气藏重点实验室获批建设.jpg'
import rename1993ImageSrc from '@/assets/events/1993年学校更名庆祝大会.jpg'
import sovietBuilding1ImageSrc from '@/assets/mainpage/苏式建筑1.jpg'
import aiSitVideoSrc from '@/assets/ai/sit.webm'
import aiStandVideoSrc from '@/assets/ai/stand.webm'
import aiBgImage from '@/assets/ai/bg.png'

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

const API_BASE = resolveApiBase()

export default {
  name: 'MainPage',
  components: {
    AuthModal,
    MediaLightbox,
    HistoryClock,
    HomeOilGasLab1990,
    HomeRename1993
  },
  data() {
    return {
      cdutLogo,
      cdutChineseName,
      cdutEnglishName,
      defaultAvatar,
      libraryImage: libraryImageSrc || cdutLogo,
      openingCeremonyImage: openingCeremonyImageSrc,
      foundingImage: foundingImageSrc,
      lab1990Image: lab1990ImageSrc,
      rename1993Image: rename1993ImageSrc,
      sovietBuilding1Image: sovietBuilding1ImageSrc,

      backgroundImages: [libraryImageSrc, buildingImageSrc],
      currentBackgroundIndex: 0,
      nextBackgroundIndex: 1,
      prevBackgroundIndex: -1,
      backgroundTimer: null,

      isLoggedIn: false,
      showLoginModal: false,
      showRegisterModal: false,
      showForgotPasswordModal: false,
      showUserMenu: false,
      userInfo: {
        username: '',
        avatar: ''
      },

      persons: [],
      allPersonsData: {},

      mouseX: 0,
      mouseY: 0,
      heroContentStyle: {},

      mediaLightboxOpen: false,
      currentMedia: {},
      mediaList: [],
      mediaIndex: 0,

      aiMessages: [],
      aiInput: '',
      aiLoading: false,
      aiWindowOpen: false,
      quickQuestions: [
        '学校是哪一年建立的？',
        '现任校长是谁？',
        '校史馆收录了多少人物？',
        '学校有几位院士？',
        '五大学科奠基人是谁？'
      ],
      relatedQuestions: [],
      aiVideoSrc: aiSitVideoSrc,
      aiAbortController: null,
      aiStreamingIndex: null,

      currentIndex: 0,
      isScrolling: false,
      scrollInterval: null,

      apiBase: API_BASE,

      currentPage: 0,
      totalPages: 4, // 四页：Hero + 3 静态
      isPageAnimating: false,
      touchStartY: 0,
      touchDeltaY: 0,
      lastScrollTime: 0
    }
  },

  computed: {
    fullpageStyle() {
      return {
        transform: `translateY(-${this.currentPage * 100}%)`,
        transition: this.isPageAnimating
          ? 'transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)'
          : 'none'
      }
    }
  },

  methods: {
    // 登录 / 用户相关
    toggleUserMenu(e) {
      if (e) e.stopPropagation()
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

    // Hero 视差
    handleHeroMouseMove(e) {
      const heroSection = this.$refs.heroSection
      if (!heroSection || this.currentPage !== 0) return

      const rect = heroSection.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      this.mouseX = (e.clientX - centerX) / rect.width
      this.mouseY = (e.clientY - centerY) / rect.height

      const parallaxX = this.mouseX * 25
      const parallaxY = this.mouseY * 14

      this.heroContentStyle = {
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        transition: 'transform 0.12s ease-out'
      }
    },

    // 背景轮播
    startBackgroundSlider() {
      this.backgroundTimer = setInterval(() => {
        this.nextBackground()
      }, 12000)
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

    // Toast
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

    // 媒体灯箱
    openMediaLightbox(media, mediaList = [], index = 0) {
      this.currentMedia = media
      this.mediaList = mediaList.length > 0 ? mediaList : [media]
      this.mediaIndex = index
      this.mediaLightboxOpen = true
    },
    closeMediaLightbox() {
      this.mediaLightboxOpen = false
    },

    // AI 助手
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
        // 如果是第一次打开，添加欢迎消息
        if (this.aiMessages.length === 0) {
          this.aiMessages.push({
            role: 'assistant',
            content: '你好！我是成都理工大学的AI校史助手，很高兴为你服务。我专门回答关于学校历史、人物、事件等问题。如果您有关于我校发展历程、重要人物或校园文化等方面的问题，欢迎随时向我提问！',
            time: this.formatTime()
          })
        }
        this.$nextTick(() => {
          this.scrollAIMessagesToBottom()
        })
      }
    },
    handleFabClick() {
      // 切换视频
      if (this.aiWindowOpen) {
        this.aiVideoSrc = aiSitVideoSrc
      } else {
        this.aiVideoSrc = aiStandVideoSrc
      }
      this.toggleAIWindow()
    },
    onCloseAIWindow() {
      this.aiWindowOpen = false
      this.aiVideoSrc = aiSitVideoSrc
      this.cancelAIStream()
    },
    handleQuickQuestion(question) {
      this.aiInput = question
      this.handleAISend()
    },
    handleFeedback(index, type) {
      if (this.aiMessages[index].feedback === type) {
        this.aiMessages[index].feedback = null
      } else {
        this.aiMessages[index].feedback = type
      }
      console.log(`用户对第${index}条消息的反馈：${type}`)
    },
    updateRelatedQuestions(lastResponse) {
      // 根据AI回答内容智能推荐相关问题
      const relatedMap = {
        '院士': ['五大学科奠基人有哪些？', '介绍一下许强校长'],
        '建校': ['学校的校训是什么？', '学校有哪些优势学科？'],
        '校长': ['党委书记是谁？', '许强有什么成就？'],
        '人物': ['介绍一下刘宝珺院士', '八大教授是谁？'],
        '学科': ['地质学专业怎么样？', '学校有哪些学院？']
      }
      
      this.relatedQuestions = []
      for (const [keyword, questions] of Object.entries(relatedMap)) {
        if (lastResponse.includes(keyword)) {
          this.relatedQuestions = questions.slice(0, 2)
          break
        }
      }
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
      this.cancelAIStream()

      this.aiLoading = true
      const idx = this.aiMessages.push({
        role: 'assistant',
        content: '',
        time: this.formatTime()
      }) - 1
      this.aiStreamingIndex = idx
      this.scrollAIMessagesToBottom()

      const payload = {
        question: userText,
        history: this.aiMessages.slice(0, -1).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        useKnowledgeBase: true,
        sessionId: null,  // 可以后续实现会话管理
        userId: null      // 可以后续实现用户识别
      }

      const url = `${this.apiBase}/api/ai/chat-with-context`
      const controller = new AbortController()
      this.aiAbortController = controller

      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        })

        if (!resp.ok || !resp.body) {
          throw new Error(`请求失败：${resp.status} ${resp.statusText}`)
        }

        const reader = resp.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''

        const commitChunk = text => {
          if (!text) return
          this.aiMessages[this.aiStreamingIndex].content += text
          this.scrollAIMessagesToBottom()
        }

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          let idxSep
          while ((idxSep = buffer.indexOf('\n\n')) !== -1) {
            const rawEvent = buffer.slice(0, idxSep)
            buffer = buffer.slice(idxSep + 2)

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
              commitChunk(`\n[错误] ${data}`)
            }
          }
        }
      } catch (err) {
        console.error('AI 请求失败：', err)
        if (this.aiStreamingIndex != null) {
          this.aiMessages[this.aiStreamingIndex].content += `\n[连接中断] ${err?.message || ''}`
        }
      } finally {
        this.aiLoading = false
        this.aiAbortController = null
        // 更新相关问题推荐
        if (this.aiStreamingIndex != null && this.aiMessages[this.aiStreamingIndex]) {
          this.updateRelatedQuestions(this.aiMessages[this.aiStreamingIndex].content)
        }
        this.aiStreamingIndex = null
        this.scrollAIMessagesToBottom()
      }
    },

    // 窗口大小变化处理
    handleWindowResize() {
      // 窗口大小变化处理，固定位置无需调整
    },

    // 人物数据（逻辑保留）
    async loadPersonsData() {
      try {
        const allPersonsData = await getAllPersonProfiles()
        const allPersonsList = Object.values(allPersonsData).map(personData =>
          this.mapPersonToDisplayFormat(personData)
        )
        this.persons = allPersonsList.slice(0, 2)
        this.allPersonsData = allPersonsData
      } catch (error) {
        console.error('加载人物数据失败:', error)
        this.persons = []
        this.allPersonsData = {}
      }
    },
    mapPersonToDisplayFormat(personData) {
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

      let badge = '教授'
      let badgeClass = 'badge-professor'

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

      const keyTags = personData.keyTags || []
      if (keyTags.some(tag => tag.includes('院士'))) {
        badge = '院士'
        badgeClass = 'badge-president'
      } else if (
        keyTags.some(tag => tag.includes('奠基') || tag.includes('建校元勋') || tag.includes('五大奠基人'))
      ) {
        badge = '奠基人'
        badgeClass = 'badge-founder'
      }

      return {
        id: personData.id,
        name: personData.name,
        title: personData.subtitle || '成都理工大学人物',
        period,
        image: personData.image,
        badge,
        badgeClass,
        tags: keyTags.slice(0, 3)
      }
    },

    // 全屏翻页逻辑
    goToPage(target) {
      if (target === this.currentPage || target < 0 || target >= this.totalPages) return
      if (this.isPageAnimating) return
      this.isPageAnimating = true
      this.currentPage = target
      this.lastScrollTime = Date.now()
      setTimeout(() => {
        this.isPageAnimating = false
      }, 750)
    },
    nextPage() {
      this.goToPage(this.currentPage + 1)
    },
    prevPage() {
      this.goToPage(this.currentPage - 1)
    },
    onWheel(e) {
      if (this.isPageAnimating) return
      const now = Date.now()
      if (now - this.lastScrollTime < 700) return

      const delta = e.deltaY
      const threshold = 30

      if (delta > threshold) {
        this.nextPage()
      } else if (delta < -threshold) {
        this.prevPage()
      }
    },
    onKeyDown(e) {
      if (this.isPageAnimating) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        this.nextPage()
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        this.prevPage()
      }
    },
    onTouchStart(e) {
      if (!e.touches || e.touches.length === 0) return
      this.touchStartY = e.touches[0].clientY
      this.touchDeltaY = 0
    },
    onTouchMove(e) {
      if (!e.touches || e.touches.length === 0) return
      const currentY = e.touches[0].clientY
      this.touchDeltaY = currentY - this.touchStartY
    },
    onTouchEnd() {
      const threshold = 60
      if (this.isPageAnimating) return
      if (this.touchDeltaY < -threshold) {
        this.nextPage()
      } else if (this.touchDeltaY > threshold) {
        this.prevPage()
      }
      this.touchStartY = 0
      this.touchDeltaY = 0
    }
  },

  async mounted() {
    try {
      this.checkLoginStatus()
      document.addEventListener('click', this.handleClickOutside)

      this.startBackgroundSlider()
      await this.loadPersonsData()

      this.$nextTick(() => {
        if (this.$refs.fullpageWrapper) {
          this.$refs.fullpageWrapper.focus()
        }
      })

      ;(async () => {
        try {
          const profiles = await getAllPersonProfiles()
          console.log('[MainPage] 人物简介预加载完成：', Object.keys(profiles || {}).length)
        } catch (preloadError) {
          console.error('[MainPage] 预加载人物数据失败:', preloadError)
        }
      })()

      // 监听窗口大小变化，重新计算AI弹窗位置
      window.addEventListener('resize', this.handleWindowResize)
    } catch (error) {
      console.error('MainPage mounted error:', error)
    }
  },

  beforeUnmount() {
    try {
      this.stopBackgroundSlider()
      document.removeEventListener('click', this.handleClickOutside)
      window.removeEventListener('resize', this.handleWindowResize)
      this.cancelAIStream()
    } catch (error) {
      console.error('MainPage beforeUnmount error:', error)
    }
  }
}
</script>

<style scoped>
.person-list-page {
  position: relative;
  height: 100vh;
  background: #02030a;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', system-ui,
    sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 背景层 */
.background-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.background-slider {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.background-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.72) contrast(1.08);
  transform: scale(1.04) translateX(100%);
  opacity: 0;
  transition:
    transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.9s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform, opacity;
  z-index: 1;
}

.background-slide.active {
  transform: scale(1.03) translateX(0) !important;
  opacity: 1 !important;
  z-index: 2;
}
.background-slide.next {
  transform: scale(1.04) translateX(100%);
  opacity: 0;
  z-index: 1;
}
.background-slide.prev {
  transform: scale(1.04) translateX(-100%) !important;
  opacity: 0 !important;
  z-index: 0;
}

.background-gradient {
  position: absolute;
  inset-inline: 0;
  pointer-events: none;
  z-index: 3;
}
.background-gradient.top {
  top: 0;
  height: 38%;
  background: linear-gradient(to bottom, rgba(4, 6, 20, 0.96), rgba(4, 6, 20, 0.35), transparent);
}
.background-gradient.bottom {
  bottom: 0;
  height: 35%;
  background: linear-gradient(to top, rgba(4, 6, 20, 0.98), rgba(4, 6, 20, 0.3), transparent);
}

/* 固定背景页（2~6） */
.background-static.second-bg,
.background-static.third-bg,
.background-static.fourth-bg,
.background-static.rename1993-bg,
.background-static.sixth-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  transform: scale(1.03);
  transition: transform 0.9s ease-out;
}

/* 第三页苏式建筑背景 */
.background-static.third-bg {
  background-color: #000000;
  animation: bgFadeIn 0.8s ease-out forwards;
}

@keyframes bgFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.second-bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% 75%, rgba(2, 3, 10, 0.2), transparent 55%),
    linear-gradient(to right, rgba(2, 3, 10, 0.2), rgba(2, 3, 10, 0.78) 55%, rgba(2, 3, 10, 0.94));
}

/* 头部导航 */
.page-header {
  position: sticky;
  top: 0;
  background: linear-gradient(to bottom, rgba(2, 3, 12, 0.96), rgba(2, 3, 12, 0.78), transparent);
  backdrop-filter: blur(18px);
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 28px 40px;
  position: relative;
}

.logo-section {
  position: absolute;
  width: 0;
  height: 0;
  overflow: visible;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.university-logo {
  position: fixed;
  top: 16px;
  left: 40px;
  width: 70px;
  height: 70px;
  object-fit: contain;
  z-index: 9999;
  transition: all 0.3s ease;
}

.logo-text {
  position: fixed;
  top: 23px;
  left: 130px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 9999;
  pointer-events: none;
}

.title-image {
  height: 42px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 16px rgba(0, 0, 0, 0.45));
}

.chinese-name-image {
  height: 36px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 16px rgba(0, 0, 0, 0.45));
}

.english-name-image {
  height: 18px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 16px rgba(0, 0, 0, 0.45));
  margin-bottom: 5px;
}

.logo-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(200, 210, 255, 0.76);
  margin-bottom: 2px;
}

.main-logo {
  font-size: 1.4rem;
  color: #ffffff;
  margin: 0;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
}

/* 导航链接 */
.main-nav {
  display: flex;
  gap: 18px;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: rgba(235, 238, 255, 0.84);
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 999px;
  transition: all 0.25s ease;
  font-size: 0.92rem;
  border: 1px solid transparent;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
}

.nav-link.active {
  color: #0b1024;
  background: linear-gradient(135deg, #fdfdff, #dfe6ff);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.6);
}

/* 登录/用户 */
.auth-section {
  display: flex;
  align-items: center;
  position: absolute;
  right: 80px;
}

.auth-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(10, 16, 40, 0.8);
  border: 1px solid rgba(200, 210, 255, 0.4);
  color: rgba(238, 241, 255, 0.96);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  backdrop-filter: blur(16px);
}

.auth-btn:hover {
  background: radial-gradient(circle at 0% 0%, #ffffff, #aebeff);
  color: #050816;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(235, 238, 255, 0.85);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.user-menu {
  position: relative;
}

.user-menu-btn {
  background: rgba(7, 14, 40, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(200, 210, 255, 0.6);
  border-radius: 999px;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.16);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(14, 18, 40, 0.96);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(180, 190, 255, 0.35);
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
}

.user-dropdown a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: rgba(235, 239, 255, 0.96);
  text-decoration: none;
  font-size: 13px;
  transition: background 0.18s ease;
}
.user-dropdown a:hover {
  background: rgba(255, 255, 255, 0.06);
}

/* 主内容 */
.main-content {
  position: relative;
  flex: 1;
  padding: 0;
  background: transparent;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.fullpage-wrapper {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
}

.fullpage-inner {
  width: 100%;
  height: 100%;
}

.page-section {
  width: 100%;
  height: 100%;
  position: relative;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  pointer-events: none;
}

.page-section.page-active {
  opacity: 1;
  pointer-events: auto;
}

/* Hero 区 */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
}

.hero-section .hero-content > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.hero-section.page-active .hero-content > * {
  opacity: 1;
  transform: translateY(0);
}

.hero-section.page-active .hero-kicker {
  transition-delay: 0.2s;
}

.hero-section.page-active .hero-title {
  transition-delay: 0.3s;
}

.hero-section.page-active .hero-subtitle {
  transition-delay: 0.4s;
}

.hero-section.page-active .hero-meta {
  transition-delay: 0.5s;
}

.hero-overlay {
  position: absolute;
  inset: 0;
}

.hero-inner {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1180px;
  padding: 0 64px;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 64px;
  transform: translateY(-50%);
  z-index: 2;
  text-align: left;
  color: white;
  will-change: transform;
  max-width: 560px;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  margin-bottom: 100px;
  border-radius: 999px;
  border: 1px solid rgba(220, 228, 255, 0.4);
  background: radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.16), rgba(3, 6, 24, 0.85));
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(231, 235, 255, 0.92);
}

.hero-title {
  font-size: 3.1rem;
  margin: 0 0 16px 0;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-family: 'Times New Roman', 'Noto Serif SC', serif;
  text-shadow:
    0 10px 30px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(12, 19, 56, 0.8);
}

.hero-title-image {
  position: absolute;
  top: 50%;
  left: 64px;
  transform: translateY(-80%);
  max-width: 600px;
  width: auto;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 40px rgba(12, 19, 56, 0.8));
  z-index: 5;
  opacity: 0;
  transition: opacity 0.6s ease-out;
  pointer-events: none;
}

.hero-section.page-active .hero-title-image {
  opacity: 1;
  transition-delay: 0.3s;
}

.hero-subtitle {
  font-size: 1.05rem;
  margin: 0 0 20px 0;
  opacity: 0.96;
  line-height: 1.9;
  color: rgba(234, 239, 255, 0.96);
}

/* Hero 底部元信息 */
.hero-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: rgba(215, 224, 255, 0.9);
}

.meta-pill {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(5, 9, 30, 0.9);
  border: 1px solid rgba(202, 210, 255, 0.7);
}

.meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(233, 237, 255, 0.95);
}
.meta-text {
  opacity: 0.9;
}

/* 底部滚动提示 */
.scroll-indicator {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(228, 233, 255, 0.92);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.scroll-arrow {
  width: 20px;
  height: 32px;
  border-radius: 999px;
  border: 1.5px solid rgba(237, 241, 255, 0.95);
  margin-top: 6px;
  position: relative;
  overflow: hidden;
}
.scroll-arrow::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 6px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(243, 246, 255, 0.98);
  transform: translateX(-50%);
  animation: scroll-dot 1.4s infinite ease-out;
}

@keyframes scroll-dot {
  0% {
    transform: translate(-50%, 0px);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 16px);
    opacity: 0;
  }
}

/* 第二页内容（右下角） */
.second-section {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.second-inner {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1200px;
  padding: 40px 64px;
}

.second-text-block {
  position: absolute;
  right: 8%;
  bottom: 13%;
  max-width: 460px;
  color: #ffffff;
}

.second-label-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.second-label-line {
  width: 2px;
  border-radius: 999px;
  height: 40px;
  background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.2));
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.8);
}

.second-label-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.second-label-top {
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.9;
}

.second-label-sub {
  font-size: 13px;
  opacity: 0.9;
}

.second-description {
  margin: 0;
  margin-top: 8px;
  font-size: 0.98rem;
  line-height: 1.9;
  text-align: left;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}

/* 田字形布局 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 1300px;
  height: 80%;
  max-height: 700px;
  padding: 0;
}

.second-section .grid-box {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.second-section.page-active .grid-box {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.second-section.page-active .box-1 {
  transition-delay: 0.1s;
}

.second-section.page-active .box-2 {
  transition-delay: 0.2s;
}

.second-section.page-active .box-3 {
  transition-delay: 0.3s;
}

.second-section.page-active .box-4 {
  transition-delay: 0.4s;
}

.grid-box {
  position: relative;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-height: 250px;
  text-decoration: none;
  cursor: pointer;
}

.second-section.page-active .grid-box:hover {
  transform: translateY(-5px) scale(1);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.grid-box h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #ffffff;
  background: linear-gradient(135deg, #ffffff, #c7d2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.grid-box p {
  font-size: 1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}

/* 人物卡片样式 */
.person-card {
  gap: 12px;
}

/* 第一个方框的背景图 */
.box-1 {
  background-image: url('@/assets/mainpage/xuqiang.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
}

.box-1::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  z-index: 0;
  transition: background 0.3s ease;
}

.box-1:hover::before {
  background: rgba(0, 0, 0, 0.3);
}

.box-1 > * {
  position: relative;
  z-index: 1;
}

/* 第二个方框的背景图 */
.box-2 {
  background-image: url('@/assets/mainpage/xiongshengqing.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
}

.box-2::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  z-index: 0;
  transition: background 0.3s ease;
}

.box-2:hover::before {
  background: rgba(0, 0, 0, 0.3);
}

.box-2 > * {
  position: relative;
  z-index: 1;
}

/* 第三个方框的背景图 */
.box-3 {
  background-image: url('@/assets/mainpage/zhangzhuoyuan.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
}

.box-3::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  z-index: 0;
  transition: background 0.3s ease;
}

.box-3:hover::before {
  background: rgba(0, 0, 0, 0.3);
}

.box-3 > * {
  position: relative;
  z-index: 1;
}

/* 第四个方框的背景图 */
.box-4 {
  background-image: url('@/assets/mainpage/liubaojun.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
}

.box-4::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  z-index: 0;
  transition: background 0.3s ease;
}

.box-4:hover::before {
  background: rgba(0, 0, 0, 0.3);
}

.box-4 > * {
  position: relative;
  z-index: 1;
}

.person-card h3 {
  font-size: 2rem;
  margin-bottom: 16px;
}

.person-intro {
  font-size: 1.1rem !important;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9) !important;
  line-height: 1.8 !important;
  font-style: italic;
  letter-spacing: 0.5px;
}

/* 里程碑卡片样式 */
.milestone-card {
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.milestone-year {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
}

.milestone-card h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.milestone-intro {
  font-size: 0.95rem !important;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85) !important;
  line-height: 1.7 !important;
  letter-spacing: 0.3px;
}

/* 里程碑卡片背景渐变 */
.milestone-1 {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.15));
  border-color: rgba(99, 102, 241, 0.3);
}

.milestone-1:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(59, 130, 246, 0.25));
  border-color: rgba(99, 102, 241, 0.5);
}

.milestone-2 {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.15));
  border-color: rgba(139, 92, 246, 0.3);
}

.milestone-2:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(168, 85, 247, 0.25));
  border-color: rgba(139, 92, 246, 0.5);
}

.milestone-3 {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(219, 39, 119, 0.15));
  border-color: rgba(236, 72, 153, 0.3);
}

.milestone-3:hover {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(219, 39, 119, 0.25));
  border-color: rgba(236, 72, 153, 0.5);
}

.milestone-4 {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15));
  border-color: rgba(34, 197, 94, 0.3);
}

.milestone-4:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.25));
  border-color: rgba(34, 197, 94, 0.5);
}

/* 科研卡片样式 */
.research-card {
  gap: 20px;
}

.research-icon {
  font-size: 3.5rem;
  margin-bottom: 10px;
}

.research-card h3 {
  font-size: 1.4rem;
  margin-bottom: 12px;
}

.research-intro {
  font-size: 0.95rem !important;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85) !important;
  line-height: 1.7 !important;
}

.research-1 {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15));
  border-color: rgba(239, 68, 68, 0.3);
}

.research-1:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.25));
  border-color: rgba(239, 68, 68, 0.5);
}

.research-2 {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
  border-color: rgba(59, 130, 246, 0.3);
}

.research-2:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.25));
  border-color: rgba(59, 130, 246, 0.5);
}

.research-3 {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(147, 51, 234, 0.15));
  border-color: rgba(168, 85, 247, 0.3);
}

.research-3:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(147, 51, 234, 0.25));
  border-color: rgba(168, 85, 247, 0.5);
}

.research-4 {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(202, 138, 4, 0.15));
  border-color: rgba(234, 179, 8, 0.3);
}

.research-4:hover {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(202, 138, 4, 0.25));
  border-color: rgba(234, 179, 8, 0.5);
}

/* 第三页内容 */
.third-section {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 城堡背景容器 */
.castle-background {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 0;
  pointer-events: none;
  opacity: 1;
  transform: translateY(0);
}

/* 红砖欧式建筑 */
.brick-building {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
}

/* 人字形屋顶 */
.roof-gable {
  position: relative;
  margin-bottom: -2px;
  z-index: 3;
}

.roof-triangle {
  width: 0;
  height: 0;
  border-left: 585px solid transparent;
  border-right: 585px solid transparent;
  border-bottom: 234px solid #8b4513;
  filter: drop-shadow(0 -5px 15px rgba(0, 0, 0, 0.5));
}

.roof-trim {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 1200px;
  height: 24px;
  background: linear-gradient(to right,
    #d4a76a,
    #c9a362,
    #d4a76a
  );
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

/* 屋顶窗户 */
.roof-windows {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 120px;
}

.roof-window {
  width: 90px;
  height: 105px;
  background: radial-gradient(ellipse at center,
    rgba(255, 240, 200, 0.5),
    rgba(139, 115, 85, 0.3)
  );
  border: 3px solid #8b4513;
  border-radius: 5px 5px 0 0;
  box-shadow: 
    inset 0 2px 10px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 240, 200, 0.2);
}

.roof-window::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  background: #8b4513;
}

/* 红砖墙体 */
.brick-wall {
  position: relative;
  width: 1130px;
  height: 400px;
  background: 
    repeating-linear-gradient(
      0deg,
      #b85450 0px,
      #b85450 16px,
      #9a4542 16px,
      #9a4542 20px,
      #a84a47 20px,
      #a84a47 36px,
      #9a4542 36px,
      #9a4542 40px
    ),
    repeating-linear-gradient(
      90deg,
      #b85450 0px,
      #b85450 115px,
      #9a4542 115px,
      #9a4542 120px
    );
  box-shadow: 
    inset 0 0 40px rgba(0, 0, 0, 0.2),
    inset 0 20px 30px rgba(255, 255, 255, 0.05),
    0 15px 40px rgba(0, 0, 0, 0.6);
  border-left: 6px solid #8b4513;
  border-right: 6px solid #8b4513;
}

/* 门廊 */
.portico {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 780px;
  height: 280px;
}

.portico-top {
  position: absolute;
  top: 0;
  width: 100%;
  height: 58px;
  background: linear-gradient(to bottom,
    #e8dcc8,
    #d4c4a8
  );
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.3),
    inset 0 2px 5px rgba(255, 255, 255, 0.3);
}

.portico-top::before {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom,
    #d4c4a8,
    #c4b498
  );
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.column {
  position: absolute;
  top: 78px;
  width: 78px;
  height: 202px;
  background: linear-gradient(to right,
    #f5f0e8,
    #e8dcc8,
    #f5f0e8
  );
  box-shadow: 
    inset -3px 0 8px rgba(0, 0, 0, 0.15),
    inset 3px 0 8px rgba(255, 255, 255, 0.2),
    3px 5px 15px rgba(0, 0, 0, 0.3);
}

.column-left {
  left: 32px;
}

.column-right {
  right: 32px;
}

.column::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -10px;
  right: -10px;
  height: 28px;
  background: linear-gradient(to bottom,
    #f5f0e8,
    #e8dcc8
  );
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.column::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: -10px;
  right: -10px;
  height: 28px;
  background: linear-gradient(to bottom,
    #e8dcc8,
    #d4c4a8
  );
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 三个拱形门 */
.arched-doors {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
}

.arched-door {
  position: relative;
  width: 215px;
  height: 280px;
}

.door-arch {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,
    rgba(200, 200, 200, 0.3),
    rgba(150, 150, 150, 0.4)
  );
  border: 8px solid #d4c4a8;
  border-bottom: none;
  border-radius: 107px 107px 0 0;
  box-shadow: 
    inset 0 5px 15px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(0, 0, 0, 0.3);
}

.door-panel {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 88%;
  height: 92%;
  background: linear-gradient(to bottom,
    #5c3a29,
    #4a2f22,
    #3a251b
  );
  border: 6px solid #2a1810;
  border-bottom: none;
  border-radius: 98px 98px 0 0;
  box-shadow: 
    inset 0 3px 12px rgba(0, 0, 0, 0.7),
    inset 0 -5px 10px rgba(139, 115, 85, 0.1);
}

.door-panel::before,
.door-panel::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle,
    #c9a362,
    #8b6914
  );
  border: 2px solid #2a1810;
  border-radius: 50%;
  top: 50%;
  box-shadow: 
    0 0 8px rgba(201, 163, 98, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

.door-panel::before {
  left: 15%;
}

.door-panel::after {
  right: 15%;
}

/* 底部栏杆 */
.balustrade {
  position: absolute;
  bottom: -78px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 28px;
  padding: 0 40px;
  height: 85px;
  align-items: flex-end;
}

.baluster {
  width: 50px;
  height: 78px;
  background: linear-gradient(to right,
    #e8dcc8,
    #d4c4a8,
    #e8dcc8
  );
  box-shadow: 
    inset -2px 0 4px rgba(0, 0, 0, 0.1),
    inset 2px 0 4px rgba(255, 255, 255, 0.2),
    2px 3px 8px rgba(0, 0, 0, 0.3);
  position: relative;
}

.baluster::before {
  content: '';
  position: absolute;
  top: -16px;
  left: -6px;
  right: -6px;
  height: 16px;
  background: linear-gradient(to bottom,
    #f5f0e8,
    #e8dcc8
  );
  border-radius: 3px 3px 0 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.balustrade::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 16px;
  background: linear-gradient(to bottom,
    #f5f0e8,
    #e8dcc8
  );
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 台阶 */
.steps {
  position: absolute;
  bottom: -156px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.step {
  width: 100%;
  height: 28px;
  background: linear-gradient(to bottom,
    #9a9a9a,
    #808080
  );
  box-shadow: 
    0 3px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 3px rgba(255, 255, 255, 0.2);
  border-top: 2px solid #707070;
}

.step-1 {
  width: 1015px;
}

.step-2 {
  width: 1090px;
}

.step-3 {
  width: 1170px;
}

/* 城堡地基 */
.castle-foundation {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(to bottom,
    transparent,
    rgba(139, 115, 85, 0.08) 20%,
    rgba(30, 30, 35, 0.5) 40%,
    rgba(20, 20, 25, 0.75) 65%,
    rgba(10, 10, 15, 0.9) 85%,
    rgba(0, 0, 0, 1)
  );
  box-shadow: 
    0 -15px 40px rgba(139, 115, 85, 0.15),
    0 -5px 20px rgba(0, 0, 0, 0.6);
}

/* 历史时钟包装器 */
.history-clock-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  opacity: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

/* 第四页内容 - 斜线分割 */
.fourth-section {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* 分割容器 */
.split-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}

/* 分割区域 */
.split-section {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-decoration: none;
}

/* 确保router-link样式一致 */
a.split-section {
  color: inherit;
}

/* 左侧区域 - 使用clip-path创建斜线分割 */
.left-section {
  clip-path: polygon(0 0, 38% 0, 28% 100%, 0 100%);
}

/* 左侧背景图层（使用伪元素避免文字模糊） */
.left-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('@/assets/mainpage/xinghe.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.85) blur(3px) grayscale(1);
  z-index: -1;
  transition: filter 0.5s ease;
}

.left-section:hover::after {
  filter: brightness(0.85) blur(3px) grayscale(0);
}

/* 中间背景图层 - 暂时使用渐变背景，可以替换为像素风格的图片 */
.middle-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.85) blur(3px) grayscale(1);
  z-index: -1;
  transition: filter 0.5s ease;
}

.middle-section:hover::after {
  filter: brightness(0.85) blur(3px) grayscale(0);
}

/* 中间区域 */
.middle-section {
  clip-path: polygon(38% 0, 72% 0, 62% 100%, 28% 100%);
}

/* 右侧区域 */
.right-section {
  clip-path: polygon(72% 0, 100% 0, 100% 100%, 62% 100%);
}

/* 右侧背景图层（使用伪元素避免文字模糊） */
.right-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('@/assets/mainpage/yuling.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.85) blur(3px) grayscale(1);
  z-index: -1;
  transition: filter 0.5s ease;
}

.right-section:hover::after {
  filter: brightness(0.85) blur(3px) grayscale(0);
}

/* 斜线分割线 */
.diagonal-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  display: none;
}

/* 悬停效果 - 左侧 */
.left-section:hover {
  z-index: 5;
  backdrop-filter: blur(0px);
  transform: translateX(-10px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* 悬停效果 - 中间 */
.middle-section:hover {
  z-index: 5;
  backdrop-filter: blur(0px);
  transform: scale(1.05);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* 悬停效果 - 右侧 */
.right-section:hover {
  z-index: 5;
  backdrop-filter: blur(0px);
  transform: translateX(10px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* 当左侧悬停时，虚化中间和右侧 */
.split-container:has(.left-section:hover) .middle-section,
.split-container:has(.left-section:hover) .right-section {
  backdrop-filter: blur(8px);
}

/* 当中间悬停时，虚化左右两侧 */
.split-container:has(.middle-section:hover) .left-section,
.split-container:has(.middle-section:hover) .right-section {
  backdrop-filter: blur(8px);
}

/* 当右侧悬停时，虚化左侧和中间 */
.split-container:has(.right-section:hover) .left-section,
.split-container:has(.right-section:hover) .middle-section {
  backdrop-filter: blur(8px);
}

/* 左侧添加遮罩层用于虚化效果 */
.left-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.15);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

/* 中间添加遮罩层 */
.middle-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.15);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

/* 右侧添加遮罩层 */
.right-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.15);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.split-container:has(.left-section:hover) .middle-section::before,
.split-container:has(.left-section:hover) .right-section::before {
  background-color: rgba(0, 0, 0, 0.5);
}

.split-container:has(.middle-section:hover) .left-section::before,
.split-container:has(.middle-section:hover) .right-section::before {
  background-color: rgba(0, 0, 0, 0.5);
}

.split-container:has(.right-section:hover) .left-section::before,
.split-container:has(.right-section:hover) .middle-section::before {
  background-color: rgba(0, 0, 0, 0.5);
}

/* 内容样式 */
.split-content {
  text-align: center;
  color: #ffffff;
  z-index: 2;
  position: relative;
  transition: all 0.4s ease;
  opacity: 0;
  transform: scale(0.9);
}

.fourth-section.page-active .split-content {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.7s ease-out 0.3s, transform 0.7s ease-out 0.3s, all 0.4s ease;
}

/* 左侧内容居中 */
.left-section .split-content {
  margin-right: 50%;
  margin-left: -18%;
}

/* 中间内容居中 */
.middle-section .split-content {
  margin: 0;
}

/* 右侧内容居中 */
.right-section .split-content {
  margin-left: 50%;
  margin-right: -18%;
}

.fourth-section.page-active .split-section:hover .split-content {
  transform: scale(1.1) !important;
}

.split-content h2 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.1em;
}

.split-content p {
  font-size: 1.5rem;
  opacity: 0.9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
}

.third-inner {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1200px;
  padding: 40px 64px;
}

.third-text-block {
  position: absolute;
  left: 8%;
  bottom: 14%;
  max-width: 460px;
  color: #ffffff;
}

.third-label-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.third-label-line {
  width: 2px;
  border-radius: 999px;
  height: 40px;
  background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.2));
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.8);
}

.third-label-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.third-label-top {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.9;
}

.third-label-sub {
  font-size: 13px;
  opacity: 0.9;
}

.third-description {
  margin: 0;
  margin-top: 8px;
  font-size: 0.98rem;
  line-height: 1.9;
  text-align: left;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}

/* 翻页指示点 */
.page-indicators {
  position: absolute;
  top: 50%;
  right: 28px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

.indicator-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  border: 1.5px solid rgba(222, 228, 255, 0.8);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.indicator-dot:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(248, 250, 255, 0.9);
}

.indicator-dot.active {
  background: rgba(249, 251, 255, 0.98);
  transform: scale(1.25);
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.9),
    0 0 0 4px rgba(255, 255, 255, 0.2);
}

/* AI 助手样式（包含弹窗，整合自第一份代码） */
.ai-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1200;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 16px;
}

/* 浮动按钮 */
.ai-fab {
  width: 120px;
  height: 120px;
  padding: 0;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: transparent;
  overflow: hidden;
  box-shadow: none;
}

.ai-fab-avatar {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
}

/* 聊天窗口 */
.ai-popup {
  width: 400px;
  height: 500px;
  max-height: 600px;
  background-image: url('@/assets/ai/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  background: linear-gradient(135deg, rgba(166, 116, 71, 0.88), rgba(200, 168, 130, 0.78));
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
  font-size: 16px;
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

/* 聊天框滚动条样式 */
.ai-messages::-webkit-scrollbar {
  width: 6px;
}

.ai-messages::-webkit-scrollbar-track {
  background: rgba(80, 60, 45, 0.3);
  border-radius: 3px;
}

.ai-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(166, 116, 71, 0.7), rgba(200, 168, 130, 0.6));
  border-radius: 3px;
}

.ai-messages::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(166, 116, 71, 0.9), rgba(200, 168, 130, 0.8));
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

.ai-message-avatar img,
.ai-message-avatar video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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
  background: linear-gradient(135deg, rgba(166, 116, 71, 0.95), rgba(200, 168, 130, 0.9));
  color: #fff;
  border-bottom-left-radius: 4px;
}

.ai-message-row.is-user .ai-message-bubble {
  background: rgba(245, 237, 228, 0.95);
  color: #3C2D23;
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

/* 满意度反馈按钮 */
.ai-message-feedback {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.feedback-btn {
  padding: 4px 8px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.feedback-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
}

.feedback-btn.active {
  background: rgba(166, 116, 71, 0.5);
  color: #fff;
}

.feedback-btn i {
  font-size: 12px;
}

/* 快速问题建议 */
.ai-quick-questions {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-question-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.quick-question-btn {
  padding: 10px 14px;
  background: linear-gradient(135deg, rgba(166, 116, 71, 0.4), rgba(200, 168, 130, 0.35));
  border: 1px solid rgba(200, 168, 130, 0.5);
  color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.quick-question-btn:hover {
  background: linear-gradient(135deg, rgba(166, 116, 71, 0.55), rgba(200, 168, 130, 0.5));
  border-color: rgba(200, 168, 130, 0.7);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(166, 116, 71, 0.3);
}

/* 相关问题推荐 */
.ai-related-questions {
  padding: 12px;
  margin-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(100, 75, 50, 0.35), rgba(80, 60, 45, 0.3));
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.related-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.related-question-btn {
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(166, 116, 71, 0.3), rgba(200, 168, 130, 0.25));
  border: 1px solid rgba(200, 168, 130, 0.4);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  text-align: left;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.related-question-btn:hover {
  background: linear-gradient(135deg, rgba(166, 116, 71, 0.45), rgba(200, 168, 130, 0.4));
  border-color: rgba(200, 168, 130, 0.6);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 10px rgba(166, 116, 71, 0.25);
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
  background: linear-gradient(135deg, rgba(100, 75, 50, 0.98), rgba(80, 60, 45, 0.95));
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ai-input {
  width: 100%;
  resize: none;
  border-radius: 10px;
  border: 1px solid rgba(200, 168, 130, 0.6);
  background: rgba(80, 60, 45, 0.85);
  padding: 6px 8px;
  color: #f5ede4;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.ai-input::placeholder {
  color: rgba(200, 168, 130, 0.65);
}

.ai-input:focus {
  border-color: rgba(166, 116, 71, 0.9);
  box-shadow: 0 0 0 1px rgba(166, 116, 71, 0.7);
  background: rgba(80, 60, 45, 0.95);
}

.ai-footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ai-hint {
  font-size: 10px;
  color: rgba(200, 168, 130, 0.85);
}

.ai-send-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #A67447, #C8A882);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(100, 70, 45, 0.6);
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
  box-shadow: 0 10px 30px rgba(100, 70, 45, 0.8);
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

/* 容器 */
.container {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

/* 响应式 */
@media (max-width: 1024px) {
  .header-content {
    padding: 12px 20px;
  }
  .hero-inner,
  .second-inner,
  .third-inner {
    padding-inline: 24px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .university-logo {
    top: 12px;
    left: 20px;
    width: 50px;
    height: 50px;
  }

  .logo-text {
    top: 17px;
    left: 85px;
  }

  .title-image {
    height: 32px;
  }
  
  .chinese-name-image {
    height: 20px;
  }

  .english-name-image {
    height: 13px;
  }

  .main-nav {
    margin-left: 0;
    gap: 8px;
    flex-wrap: wrap;
  }

  .nav-link {
    padding-inline: 12px;
    font-size: 0.85rem;
  }

  .hero-inner {
    padding-inline: 20px;
  }

  .hero-title {
    font-size: 2.4rem;
  }

  .hero-kicker {
    margin-bottom: 30px;
  }

  .hero-title-image {
    max-width: 80%;
    left: 20px;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .second-inner,
  .third-inner {
    padding-inline: 20px;
  }

  .second-text-block {
    right: 6%;
    bottom: 10%;
    max-width: 340px;
  }

  .third-text-block {
    left: 6%;
    bottom: 10%;
    max-width: 340px;
  }

  .second-description,
  .third-description {
    font-size: 0.94rem;
  }

  .page-indicators {
    right: 16px;
  }

  .event-year {
    font-size: 1rem;
    min-width: 50px;
  }

  .ai-popup {
    width: 92vw;
    max-height: 70vh;
  }

  .grid-container {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
    gap: 20px;
    padding: 20px;
    max-height: none;
  }

  .grid-box {
    min-height: 180px;
    padding: 30px 20px;
  }

  .grid-box h3 {
    font-size: 1.5rem;
  }

  .grid-box p {
    font-size: 0.9rem;
  }

  .person-card h3 {
    font-size: 1.5rem;
  }

  .person-intro {
    font-size: 0.95rem !important;
  }

  .milestone-year {
    font-size: 2rem;
  }

  .milestone-card h3 {
    font-size: 1.2rem;
  }

  .milestone-intro {
    font-size: 0.85rem !important;
  }

  /* 红砖建筑响应式调整 */
  .brick-building {
    transform: scale(0.45);
    margin-bottom: 0px;
  }

  .castle-foundation {
    height: 80px;
  }
}
</style>