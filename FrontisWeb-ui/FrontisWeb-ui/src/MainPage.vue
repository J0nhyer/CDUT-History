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

      <!-- 第三页：成都地质勘探学院成立 固定背景 -->
      <div
        v-else-if="currentPage === 2"
        class="background-static third-bg"
        :style="{ backgroundImage: `url(${foundingImage})` }"
      >
        <div class="second-bg-gradient"></div>
      </div>

      <!-- 第四页：1990年油气藏重点实验室获批建设 固定背景 -->
      <div
        v-else-if="currentPage === 3"
        class="background-static fourth-bg"
        :style="{ backgroundImage: `url(${lab1990Image})` }"
      >
        <div class="second-bg-gradient"></div>
      </div>

      <!-- 第五页：1993年学校更名庆祝大会 固定背景 -->
      <div
        v-else-if="currentPage === 4"
        class="background-static rename1993-bg"
        :style="{ backgroundImage: `url(${rename1993Image})` }"
      >
        <div class="second-bg-gradient"></div>
      </div>

      <!-- 第六页：人物/事件列表，可按需继续用纯色背景，这里简单给一个淡背景 -->
      <div
        v-else-if="currentPage === 5"
        class="background-static sixth-bg"
        :style="{ backgroundImage: `url(${libraryImage})` }"
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
              <div class="logo-circle">
                <img :src="cdutLogo" alt="成都理工大学" class="university-logo" />
              </div>
              <div class="logo-text">
                <div class="logo-kicker">CHENGDU UNIVERSITY OF TECHNOLOGY</div>
                <h1 class="main-logo">成都理工大学数字校史馆</h1>
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
              成理人物
            </router-link>
            <router-link
              to="/digital-history"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/digital-history') }"
            >
              成理历史
            </router-link>
            <router-link
              to="/universe"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/universe') }"
            >
              学术星图
            </router-link>
            <router-link
              to="/keyword-rain"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/keyword-rain') }"
            >
              倾听雨声
            </router-link>
            <router-link
              to="/draw-reveal"
              class="nav-link"
              :class="{ active: $route.path.startsWith('/draw-reveal') }"
            >
              涂鸦画板
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
            ref="heroSection"
            @mousemove="handleHeroMouseMove"
          >
            <div class="hero-overlay"></div>

            <div class="hero-inner">
              <div class="hero-content" :style="heroContentStyle">
                <div class="hero-kicker">
                  成都理工大学 · 数字校史馆
                </div>
                <h1 class="hero-title">
                  穷究于理 · 成就于工
                </h1>
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

          <!-- 第 2 页：1956 首届开学典礼 -->
          <section class="page-section second-section">
            <div class="second-inner">
              <div class="second-text-block">
                <div class="second-label-row">
                  <div class="second-label-line"></div>
                  <div class="second-label-text">
                    <div class="second-label-top">1956 · 首届开学典礼</div>
                    <div class="second-label-sub">成理办学的起点</div>
                  </div>
                </div>
                <p class="second-description">
                  1956 年，成都地质勘探学院在这里迎来了首届开学典礼。一代又一代成理学子由此走进校园、走向矿野与前线，在地质找矿、防灾减灾、能源资源等领域接续奋斗。
                  这一刻，不只是办学历史的起点，也是“穷究于理，成就于工”精神在西南大地生根发芽的原点。
                </p>
              </div>
            </div>
          </section>

          <!-- 第 3 页：成都地质勘探学院成立 -->
          <section class="page-section third-section">
            <div class="third-inner">
              <div class="third-text-block">
                <div class="third-label-row">
                  <div class="third-label-line"></div>
                  <div class="third-label-text">
                    <div class="third-label-top">1956 · 成都地质勘探学院成立</div>
                    <div class="third-label-sub">新中国地质高等教育的重要一笔</div>
                  </div>
                </div>
                <p class="third-description">
                  为服务新中国地质找矿和能源建设需要，成都地质勘探学院在西南腹地创立。
                  自此，来自全国各地的青年学子汇聚于此，在板块构造、矿产勘查、地震地质等领域扎根钻研，将个人理想与国家需求紧紧相连。
                  这所学院，也在时代的推进中逐步成长为今日的成都理工大学。
                </p>
              </div>
            </div>
          </section>

          <!-- 第 4 页：1990 实验室（使用独立组件，只做前景内容） -->
          <section class="page-section fourth-section">
            <HomeOilGasLab1990 />
          </section>

          <!-- 第 5 页：1993 更名庆祝大会 -->
          <section class="page-section rename1993-section">
            <HomeRename1993 />
          </section>

          <!-- 第 6 页：人物 & 历史事件板块（从第一份代码整合进来） -->
          <section class="page-section content-blocks-section">
            <div class="content-blocks-inner container">
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
                      <div
                        class="card-tags"
                        v-if="person.keyTagsList && person.keyTagsList.length"
                      >
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
                        <span class="event-importance" v-if="event.importance">
                          {{ event.importance }}
                        </span>
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
        @pointerdown.stop.prevent="startAIDrag"
        @click="handleFabClick"
      >
        <div class="ai-fab-avatar-wrap">
          <img :src="aiAvatar" alt="AI助手" class="ai-fab-avatar" />
        </div>
        <div class="ai-fab-text">
          <span class="ai-fab-title">AI 助手</span>
          <span class="ai-fab-subtitle">问问成理校史</span>
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
import HomeOilGasLab1990 from '@/components/home/HomeOilGasLab1990.vue'
import HomeRename1993 from '@/components/home/HomeRename1993.vue'

// 背景图片
import libraryImageSrc from '@/assets/mainbg/新图书馆.jpg'
import buildingImageSrc from '@/assets/mainbg/东区教学楼.jpg'
import openingCeremonyImageSrc from '@/assets/events/1956年首届开学典礼.jpg'
import foundingImageSrc from '@/assets/events/1956_01_成都地质勘探学院成立.png'
import lab1990ImageSrc from '@/assets/events/1990年油气藏重点实验室获批建设.jpg'
import rename1993ImageSrc from '@/assets/events/1993年学校更名庆祝大会.jpg'

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
    HomeOilGasLab1990,
    HomeRename1993
  },
  data() {
    return {
      cdutLogo,
      defaultAvatar,
      libraryImage: libraryImageSrc || cdutLogo,
      openingCeremonyImage: openingCeremonyImageSrc,
      foundingImage: foundingImageSrc,
      lab1990Image: lab1990ImageSrc,
      rename1993Image: rename1993ImageSrc,

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
      featuredPersons: [],
      featuredEvents: [],

      mouseX: 0,
      mouseY: 0,
      heroContentStyle: {},

      mediaLightboxOpen: false,
      currentMedia: {},
      mediaList: [],
      mediaIndex: 0,

      aiWindowOpen: false,
      aiInput: '',
      aiLoading: false,
      aiAvatar: defaultAvatar,
      aiMessages: [
        {
          role: 'assistant',
          content:
            '你好！我是成理 · AI 学术助手，可以帮助你了解成都理工大学的校史与人物故事。',
          time: ''
        }
      ],
      aiPopupPosition: {
        top: typeof window !== 'undefined' ? window.innerHeight - 450 : 100,
        left: typeof window !== 'undefined' ? window.innerWidth - 420 : 100
      },
      aiDragging: false,
      aiDragStartX: 0,
      aiDragStartY: 0,
      aiDragMoved: false,
      aiAbortController: null,
      aiStreamingIndex: null,

      currentIndex: 0,
      isScrolling: false,
      scrollInterval: null,

      apiBase: API_BASE,

      currentPage: 0,
      totalPages: 6, // 六页：Hero + 3 静态 + 2 组件 + 人物/事件
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
        this.scrollAIMessagesToBottom()
      }
    },
    handleFabClick() {
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
        this.aiStreamingIndex = null
        this.scrollAIMessagesToBottom()
      }
    },

    // AI 拖拽
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
    endAIDrag() {
      if (!this.aiDragging) return
      this.aiDragging = false
      window.removeEventListener('pointermove', this.onAIDrag)
      window.removeEventListener('pointerup', this.endAIDrag)
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
    async loadFeaturedPersons() {
      try {
        const url = `${this.apiBase}/api/person/list`
        const response = await fetch(url)
        const result = await response.json()

        if (result.success && result.data) {
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

            if (person.imageUrl) {
              if (
                person.imageUrl.startsWith('http://') ||
                person.imageUrl.startsWith('https://')
              ) {
                person.imageUrl = person.imageUrl
              } else {
                person.imageUrl = getPersonImage(person.imageUrl)
              }
            } else {
              person.imageUrl = getPersonImage(null)
            }

            return person
          })
          this.featuredPersons = persons.slice(0, 4)
        }
      } catch (error) {
        console.error('加载首页人物数据失败:', error)
        this.featuredPersons = []
      }
    },
    async loadFeaturedEvents() {
      try {
        const url = `${this.apiBase}/api/history/events`
        const response = await fetch(url)
        const result = await response.json()

        if (result.success && result.data) {
          this.featuredEvents = result.data
            .filter(event => event.importance === 'high' || event.importance === '重要')
            .slice(0, 4)
        }
      } catch (error) {
        console.error('加载首页事件数据失败:', error)
        this.featuredEvents = []
      }
    },
    goToPersonDetail(personId) {
      this.$router.push(`/person/${personId}`)
    },
    goToEventDetail() {
      this.$router.push('/digital-history')
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

      if (typeof window !== 'undefined') {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const popupWidth = 220
        const totalHeight = 120
        const margin = 10

        this.aiPopupPosition.left = vw - popupWidth - margin
        this.aiPopupPosition.top = vh - totalHeight - margin
      }

      if (this.aiMessages.length > 0 && !this.aiMessages[0].time) {
        this.aiMessages[0].time = this.formatTime()
      }

      ;(async () => {
        try {
          const profiles = await getAllPersonProfiles()
          console.log('[MainPage] 人物简介预加载完成：', Object.keys(profiles || {}).length)
        } catch (preloadError) {
          console.error('[MainPage] 预加载人物数据失败:', preloadError)
        }
      })()

      this.loadFeaturedPersons()
      this.loadFeaturedEvents()
    } catch (error) {
      console.error('MainPage mounted error:', error)
    }
  },

  beforeUnmount() {
    try {
      this.stopBackgroundSlider()
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
  justify-content: space-between;
  align-items: center;
  padding: 14px 40px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  padding: 2px;
  background: radial-gradient(circle at 0% 0%, #ffffff, #9fb3ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.5),
    0 10px 25px rgba(0, 0, 0, 0.35);
}

.university-logo {
  width: 58px;
  height: 58px;
  object-fit: contain;
  border-radius: 50%;
  background: #ffffff;
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  margin-left: 80px;
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
  margin-left: auto;
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
}

/* Hero 区 */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.hero-content {
  position: relative;
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
  margin-bottom: 14px;
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
  align-items: stretch;
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

/* 第三页内容（左下角） */
.third-section {
  z-index: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
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

/* 人物和事件板块样式（整合自第一份代码，作为第六页内容） */
.content-blocks-section {
  position: relative;
  padding: 60px 0 120px 0;
  background: white;
  z-index: 2;
}

.content-blocks-section .content-blocks-inner {
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
  padding: 20px 0;
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
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
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
  gap: 20px;
  padding: 0;
}

.event-year {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  min-width: 70px;
}

.card-description {
  font-size: 1rem;
  color: #666;
  margin: 0 0 10px 0;
  line-height: 1.6;
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

/* AI 助手样式（包含弹窗，整合自第一份代码） */
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
  background: radial-gradient(circle at 0% 0%, rgba(140, 170, 255, 0.98), rgba(75, 110, 220, 0.98));
  color: #fff;
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(240, 244, 255, 0.7);
  backdrop-filter: blur(16px);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;
}

.ai-fab:hover {
  transform: translateY(-2px);
  box-shadow:
    0 22px 55px rgba(0, 0, 0, 0.65),
    0 0 0 1px rgba(255, 255, 255, 0.9);
}

.ai-fab-avatar-wrap {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.18);
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
  font-size: 13px;
  font-weight: 700;
}

.ai-fab-subtitle {
  font-size: 11px;
  opacity: 0.9;
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
  .content-blocks-section .content-blocks-inner {
    padding: 0 24px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .logo-circle {
    width: 54px;
    height: 54px;
  }
  .university-logo {
    width: 48px;
    height: 48px;
  }

  .main-logo {
    font-size: 1.2rem;
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

  .content-blocks-section {
    padding: 40px 0 80px 0;
  }

  .content-blocks-section .content-blocks-inner {
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

  .ai-popup {
    width: 92vw;
    max-height: 70vh;
  }
}
</style>