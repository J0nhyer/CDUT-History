<template>
  <div class="person-detail-narrative" ref="pageContainer">
    <!-- 顶部导航（面包屑、返回、搜索、分享） -->
    <nav class="top-navigation">
      <div class="nav-container">
        <div class="breadcrumb">
          <button @click="goBack" class="nav-btn">
            <i class="fas fa-arrow-left"></i>
            <span>返回人物列表</span>
          </button>
          <span class="separator">/</span>
          <span class="current-person">{{ personData.name }}</span>
        </div>
        
        <div class="nav-actions">
          <button @click="toggleSearch" class="action-btn" title="搜索">
            <i class="fas fa-search"></i>
          </button>
          <button @click="shareProfile" class="action-btn" title="分享">
            <i class="fas fa-share-alt"></i>
          </button>
          <button @click="toggleFavorite" class="action-btn" :class="{ active: isFavorited }" title="收藏">
            <i :class="isFavorited ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero区（首屏） -->
    <section class="hero-section" id="hero">
      <div 
        class="hero-background" 
        :class="{ loaded: heroImageLoaded }"
        :style="{ backgroundImage: heroImageLoaded ? `url(${personData.heroImage || personData.image})` : 'none' }"
      >
        <div class="hero-overlay"></div>
      </div>
      
      <div class="hero-content">
        <div class="avatar-container" @mouseenter="avatarHover = true" @mouseleave="avatarHover = false">
          <div class="avatar-frame" :class="{ hovered: avatarHover }">
            <div class="avatar-placeholder" v-if="!avatarImageLoaded">
              <i class="fas fa-user"></i>
            </div>
            <img 
              v-show="avatarImageLoaded"
              :src="personData.image" 
              :alt="personData.name"
              class="avatar-image"
              @load="avatarImageLoaded = true"
              @error="handleImageError('avatar')"
            />
            <div class="avatar-glow"></div>
          </div>
        </div>
        
        <h1 class="person-name">{{ personData.name }}</h1>
        <p class="person-title">{{ getPersonTitle() }}</p>
        
        <div class="quick-actions">
          <button @click="playVoice" class="quick-action-btn" title="听其语音">
            <i class="fas fa-microphone"></i>
            <span>语音</span>
          </button>
          <button @click="playVideo" class="quick-action-btn" title="播放微纪录片">
            <i class="fas fa-video"></i>
            <span>纪录片</span>
          </button>
          <button @click="scrollToTimeline" class="quick-action-btn" title="查看时间轴">
            <i class="fas fa-clock"></i>
            <span>时间轴</span>
          </button>
        </div>
      </div>
      
      <div class="scroll-indicator" @click="scrollToNextSection">
        <i class="fas fa-chevron-down"></i>
      </div>
    </section>

    <!-- 关键信息卡 -->
    <section class="info-cards-section" id="info-cards">
      <div class="container">
        <div class="info-cards-grid">
          <div class="info-card" v-if="personData.birthDate || personData.birthPlace">
            <div class="card-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="card-content">
              <h3 class="card-label">出生信息</h3>
              <p class="card-value">{{ formatBirthInfo() }}</p>
            </div>
          </div>
          
          <div class="info-card" v-if="personData.titles && personData.titles.length > 0">
            <div class="card-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="card-content">
              <h3 class="card-label">职务/职称</h3>
              <p class="card-value">{{ personData.titles.join('、') }}</p>
            </div>
          </div>
          
          <div class="info-card" v-if="personData.achievements && personData.achievements.length > 0">
            <div class="card-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="card-content">
              <h3 class="card-label">代表作品</h3>
              <p class="card-value">{{ personData.achievements.length }}项成就</p>
            </div>
          </div>
          
          <div class="info-card" v-if="personData.awards && personData.awards.length > 0">
            <div class="card-icon">
              <i class="fas fa-award"></i>
            </div>
            <div class="card-content">
              <h3 class="card-label">主要奖项</h3>
              <p class="card-value">{{ personData.awards.length }}个奖项</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 交互时间轴 -->
    <section class="timeline-section" id="timeline">
      <div class="container">
        <h2 class="section-title">
          <span class="title-icon"><i class="fas fa-clock"></i></span>
          生平时间轴
        </h2>
        
        <div class="timeline-controls">
          <button 
            @click="timelineMode = 'horizontal'" 
            :class="['mode-btn', { active: timelineMode === 'horizontal' }]"
          >
            <i class="fas fa-arrows-alt-h"></i> 横向视图
          </button>
          <button 
            @click="timelineMode = 'vertical'" 
            :class="['mode-btn', { active: timelineMode === 'vertical' }]"
          >
            <i class="fas fa-arrows-alt-v"></i> 纵向视图
          </button>
          <div class="zoom-controls">
            <button @click="zoomTimeline(-0.1)" class="zoom-btn" title="缩小">
              <i class="fas fa-search-minus"></i>
            </button>
            <span class="zoom-level">{{ Math.round(timelineZoom * 100) }}%</span>
            <button @click="zoomTimeline(0.1)" class="zoom-btn" title="放大">
              <i class="fas fa-search-plus"></i>
            </button>
          </div>
        </div>
        
        <div class="timeline-wrapper" ref="timelineWrapper">
          <div 
            :class="['timeline-container', timelineMode]"
            :style="{ transform: `scale(${timelineZoom})` }"
            ref="timelineContainer"
          >
            <div 
              v-for="(event, index) in (personData.timeline || [])" 
              :key="index"
              :class="['timeline-node', { active: expandedNode === index }]"
              @click="toggleNode(index)"
            >
              <div class="node-dot" :class="getEventImportanceClass(event.importance)">
                <div class="dot-ripple"></div>
              </div>
              
              <div class="node-content">
                <div class="node-year">{{ event.year }}</div>
                <h3 class="node-title">{{ event.title }}</h3>
                
                <transition name="expand">
                  <div v-if="expandedNode === index" class="node-detail">
                    <p class="detail-description">{{ event.description }}</p>
                    
                    <div v-if="event.achievements && event.achievements.length > 0" class="detail-achievements">
                      <h4>重要成就：</h4>
                      <ul>
                        <li v-for="(achievement, i) in event.achievements" :key="i">{{ achievement }}</li>
                      </ul>
                    </div>
                    
                    <div v-if="event.media" class="detail-media">
                      <img 
                        v-if="event.media.type === 'image'" 
                        :src="event.media.url" 
                        :alt="event.title"
                        loading="lazy"
                        class="timeline-media-img"
                        @load="onImageLoad"
                        @error="onImageError"
                      >
                      <video v-else-if="event.media.type === 'video'" :src="event.media.url" controls preload="metadata"></video>
                    </div>
                    
                    <div v-if="event.citation" class="detail-citation">
                      <i class="fas fa-quote-left"></i>
                      <span>来源：{{ event.citation }}</span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 深度资料区（Tabbed） -->
    <section class="resources-section" id="resources">
      <div class="container">
        <h2 class="section-title">
          <span class="title-icon"><i class="fas fa-archive"></i></span>
          深度资料
        </h2>
        
        <div class="resource-tabs">
          <button 
            v-for="tab in resourceTabs" 
            :key="tab.id"
            :class="['resource-tab', { active: activeResourceTab === tab.id }]"
            @click="activeResourceTab = tab.id"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.name }}</span>
            <span v-if="getResourceCount(tab.id) > 0" class="tab-count">{{ getResourceCount(tab.id) }}</span>
          </button>
        </div>
        
        <div class="resource-content">
          <!-- 文献Tab -->
          <div v-if="activeResourceTab === 'documents'" class="resource-panel">
            <div class="document-list">
              <div 
                v-for="(doc, index) in getDocuments()" 
                :key="index"
                class="document-item"
                @click="viewDocument(doc)"
              >
                <div class="doc-icon">
                  <i class="fas fa-file-pdf"></i>
                </div>
                <div class="doc-info">
                  <h4>{{ doc.title }}</h4>
                  <p class="doc-meta">
                    <span v-if="doc.year">{{ doc.year }}</span>
                    <span v-if="doc.source"> · 来源：{{ doc.source }}</span>
                  </p>
                  <p v-if="doc.summary" class="doc-summary">{{ doc.summary }}</p>
                  <div v-if="doc.citation" class="doc-citation">
                    <i class="fas fa-bookmark"></i> 档号：{{ doc.citation }}
                  </div>
                </div>
                <button class="doc-action" @click.stop="downloadDocument(doc)">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 音频Tab -->
          <div v-if="activeResourceTab === 'audio'" class="resource-panel">
            <div class="audio-list">
              <div 
                v-for="(audio, index) in (personData.audios || [])" 
                :key="index"
                class="audio-item"
              >
                <div class="audio-player-mini">
                  <button 
                    @click="toggleAudio(audio.id || index)"
                    class="play-button"
                    :class="{ playing: currentAudio === (audio.id || index) && isPlaying }"
                  >
                    <i :class="currentAudio === (audio.id || index) && isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
                  </button>
                </div>
                <div class="audio-info">
                  <h4>{{ audio.title }}</h4>
                  <p>{{ audio.description }}</p>
                  <div class="audio-meta">
                    <span v-if="audio.duration"><i class="fas fa-clock"></i> {{ audio.duration }}</span>
                    <span v-if="audio.source"> · 来源：{{ audio.source }}</span>
                  </div>
                  <div v-if="audio.chapters && audio.chapters.length > 0" class="audio-chapters">
                    <span class="chapters-label">章节：</span>
                    <button 
                      v-for="(chapter, i) in audio.chapters" 
                      :key="i"
                      @click="jumpToChapter(audio.id || index, chapter.time)"
                      class="chapter-btn"
                    >
                      {{ chapter.title }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 视频Tab -->
          <div v-if="activeResourceTab === 'video'" class="resource-panel">
            <div class="video-grid">
              <div 
                v-for="(video, index) in (personData.videos || [])" 
                :key="index"
                class="video-item"
                @click="playVideoModal(video)"
              >
                <div class="video-thumbnail">
                  <div class="thumbnail-placeholder" v-if="!video.thumbnail">
                    <i class="fas fa-video"></i>
                  </div>
                  <img 
                    :src="video.thumbnail || personData.image" 
                    :alt="video.title"
                    loading="lazy"
                    class="video-thumb-img"
                    @load="onImageLoad"
                    @error="onImageError"
                  >
                  <div class="play-overlay">
                    <i class="fas fa-play-circle"></i>
                  </div>
                  <span v-if="video.duration" class="video-duration">{{ video.duration }}</span>
                </div>
                <div class="video-info">
                  <h4>{{ video.title }}</h4>
                  <p>{{ video.description }}</p>
                  <div class="video-meta">
                    <span v-if="video.source">来源：{{ video.source }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 原件Tab -->
          <div v-if="activeResourceTab === 'originals'" class="resource-panel">
            <div class="original-gallery">
              <div 
                v-for="(item, index) in getOriginals()" 
                :key="index"
                class="original-item"
                @click="viewOriginal(item)"
              >
                <div class="original-image">
                  <div class="original-placeholder" v-if="!item.url && !item.image">
                    <i class="fas fa-file-image"></i>
                  </div>
                  <img 
                    :src="item.url || item.image" 
                    :alt="item.title"
                    loading="lazy"
                    @load="onImageLoad"
                    @error="onImageError"
                  >
                  <div class="original-overlay">
                    <i class="fas fa-search-plus"></i>
                    <span>查看高清</span>
                  </div>
                </div>
                <div class="original-info">
                  <h4>{{ item.title }}</h4>
                  <p v-if="item.description">{{ item.description }}</p>
                  <div class="original-meta">
                    <span v-if="item.type"><i class="fas fa-tag"></i> {{ item.type }}</span>
                    <span v-if="item.date"> · {{ item.date }}</span>
                    <span v-if="item.source"> · 来源：{{ item.source }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 人物关系网（知识图谱） -->
    <section class="relationships-section" id="relationships">
      <div class="container">
        <h2 class="section-title">
          <span class="title-icon"><i class="fas fa-project-diagram"></i></span>
          人物关系网络
        </h2>
        
        <div class="network-container" ref="networkContainer">
          <div class="network-canvas" ref="networkCanvas"></div>
          <div class="network-legend">
            <div class="legend-item">
              <span class="legend-dot mentor"></span>
              <span>导师</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot student"></span>
              <span>学生</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot colleague"></span>
              <span>同事</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot other"></span>
              <span>其他</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 地点地图 -->
    <section class="map-section" id="locations" v-if="personData.geoTags && personData.geoTags.length > 0">
      <div class="container">
        <h2 class="section-title">
          <span class="title-icon"><i class="fas fa-map-marker-alt"></i></span>
          重要地点
        </h2>
        
        <div class="map-container">
          <div class="map-canvas" ref="mapCanvas" id="personMap"></div>
          <div class="location-list">
            <div 
              v-for="(location, index) in personData.geoTags" 
              :key="index"
              class="location-item"
              @click="highlightLocation(index)"
            >
              <div class="location-icon">
                <i class="fas fa-map-pin"></i>
              </div>
              <div class="location-info">
                <h4>{{ location.name }}</h4>
                <p v-if="location.note">{{ location.note }}</p>
                <p class="location-coords">
                  <i class="fas fa-location-dot"></i>
                  {{ location.coords ? `${location.coords[0]}, ${location.coords[1]}` : '' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学术引用/参考与下载 -->
    <section class="citations-section" id="citations">
      <div class="container">
        <h2 class="section-title">
          <span class="title-icon"><i class="fas fa-quote-left"></i></span>
          学术引用与参考
        </h2>
        
        <div class="citation-export">
          <div class="export-buttons">
            <button @click="exportCitation('APA')" class="export-btn">
              <i class="fas fa-file-alt"></i>
              导出 APA 格式
            </button>
            <button @click="exportCitation('MLA')" class="export-btn">
              <i class="fas fa-file-alt"></i>
              导出 MLA 格式
            </button>
            <button @click="exportCitation('Chicago')" class="export-btn">
              <i class="fas fa-file-alt"></i>
              导出 Chicago 格式
            </button>
            <button @click="exportPDF" class="export-btn primary">
              <i class="fas fa-file-pdf"></i>
              导出 PDF
            </button>
          </div>
          
          <div class="citations-list">
            <h3>参考文献</h3>
            <div 
              v-for="(citation, index) in getCitations()" 
              :key="index"
              class="citation-item"
              @click="copyCitation(citation)"
            >
              <div class="citation-icon">
                <i class="fas fa-book"></i>
              </div>
              <div class="citation-content">
                <p>{{ citation.text || citation }}</p>
                <div class="citation-meta">
                  <span v-if="citation.source">来源：{{ citation.source }}</span>
                  <span v-if="citation.url">
                    <a :href="citation.url" target="_blank" @click.stop>
                      <i class="fas fa-external-link-alt"></i> 查看原文
                    </a>
                  </span>
                </div>
              </div>
              <button class="citation-copy" @click.stop="copyCitation(citation)" title="复制">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 互动结尾区 -->
    <section class="interaction-section" id="interaction">
      <div class="container">
        <h2 class="section-title">
          <span class="title-icon"><i class="fas fa-comments"></i></span>
          互动交流
        </h2>
        
        <div class="interaction-content">
          <div class="comments-panel">
            <h3>评论与讨论</h3>
            <div class="comments-list">
              <div class="empty-state">
                <i class="fas fa-comment-slash"></i>
                <p>暂无评论，快来成为第一个评论者吧！</p>
              </div>
            </div>
            
            <div class="comment-form">
              <textarea 
                v-model="newComment" 
                placeholder="写下您的评论或见解..."
                class="comment-input"
                rows="4"
              ></textarea>
              <div class="comment-actions">
                <button @click="submitComment" class="submit-btn" :disabled="!newComment.trim()">
                  <i class="fas fa-paper-plane"></i>
                  提交评论
                </button>
              </div>
            </div>
          </div>
          
          <div class="contribution-panel">
            <h3>贡献档案</h3>
            <p class="contribution-desc">如果您有与{{ personData.name }}相关的档案资料、照片或文档，欢迎上传分享。</p>
            
            <div class="upload-area" @click="triggerFileUpload">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>点击或拖拽文件到此处上传</p>
              <span class="upload-hint">支持 PDF、图片、视频等格式</span>
              <input 
                type="file" 
                ref="fileInput"
                @change="handleFileUpload"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.mp4,.mp3"
                style="display: none"
              >
            </div>
            
            <div v-if="uploadedFiles.length > 0" class="uploaded-files">
              <h4>已上传文件：</h4>
              <div 
                v-for="(file, index) in uploadedFiles" 
                :key="index"
                class="uploaded-file-item"
              >
                <i class="fas fa-file"></i>
                <span>{{ file.name }}</span>
                <button @click="removeFile(index)" class="remove-file-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 扇子展开人物介绍区 -->
    <section class="fan-section" id="fan-intro">
      <div class="container">
        <div class="fan-container" ref="fanContainer">
          <!-- 扇子背景 -->
          <div class="fan-background" :class="{ expanded: fanExpanded }">
            <div 
              v-for="i in 20" 
              :key="i"
              class="fan-blade"
              :style="getFanBladeStyle(i)"
            >
              <div class="blade-pattern"></div>
            </div>
          </div>
          
          <!-- 触发按钮 -->
          <div class="fan-trigger" v-if="!fanExpanded" @click="expandFan">
            <div class="trigger-icon">
              <i class="fas fa-hand-pointer"></i>
            </div>
            <p class="trigger-text">展开扇子，了解更多</p>
          </div>
          
          <!-- 人物介绍内容 -->
          <transition name="fan-content">
            <div v-if="fanExpanded" class="fan-content">
              <div class="fan-title">
                <h2>{{ personData.name }}</h2>
                <p class="fan-subtitle">{{ personData.subtitle || '人物简介' }}</p>
              </div>
              
              <div class="fan-text-content">
                <div 
                  v-for="(paragraph, index) in getPersonIntroduction()" 
                  :key="index"
                  class="intro-paragraph"
                  :style="{ animationDelay: `${index * 0.2}s` }"
                >
                  <div class="paragraph-number">{{ String(index + 1).padStart(2, '0') }}</div>
                  <div class="paragraph-text">
                    <p v-html="paragraph"></p>
                  </div>
                </div>
              </div>
              
              <button class="fan-close-btn" @click="collapseFan">
                <i class="fas fa-times"></i>
                收起扇子
              </button>
            </div>
          </transition>
        </div>
      </div>
    </section>

    <!-- 视频播放模态框 -->
    <transition name="modal">
      <div v-if="currentVideoModal" class="modal-overlay" @click="closeVideoModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeVideoModal">
            <i class="fas fa-times"></i>
          </button>
          <div class="video-player-container">
            <video 
              v-if="currentVideoModal.url" 
              :src="currentVideoModal.url" 
              controls 
              autoplay
              class="modal-video"
            ></video>
          </div>
          <div class="video-modal-info">
            <h3>{{ currentVideoModal.title }}</h3>
            <p>{{ currentVideoModal.description }}</p>
            <div class="video-modal-meta" v-if="currentVideoModal.source">
              <i class="fas fa-info-circle"></i>
              <span>来源：{{ currentVideoModal.source }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'PersonDetailNarrative',
  props: {
    personData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      avatarHover: false,
      isFavorited: false,
      showSearch: false,
      // 时间轴
      timelineMode: 'horizontal', // 'horizontal' | 'vertical'
      expandedNode: null,
      timelineZoom: 1,
      // 资源Tab
      activeResourceTab: 'documents',
      resourceTabs: [
        { id: 'documents', name: '文献', icon: 'fas fa-file-pdf' },
        { id: 'audio', name: '口述史', icon: 'fas fa-microphone' },
        { id: 'video', name: '影像', icon: 'fas fa-video' },
        { id: 'originals', name: '手稿/信件', icon: 'fas fa-file-alt' }
      ],
      // 媒体播放
      currentAudio: null,
      isPlaying: false,
      currentVideoModal: null,
      // 互动相关
      newComment: '',
      uploadedFiles: [],
      // 图片加载状态
      heroImageLoaded: false,
      avatarImageLoaded: false,
      // 扇子展开状态
      fanExpanded: false
    }
  },
  watch: {
    // 监听personData变化，预加载图片
    personData: {
      handler(newVal) {
        if (newVal) {
          this.preloadImages(newVal)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initRelationshipNetwork()
    this.initMap()
    if (this.personData) {
      this.preloadImages(this.personData)
    }
  },
  methods: {
    goBack() {
      this.$router.push('/persons')
    },
    getPersonTitle() {
      if (this.personData.subtitle) return this.personData.subtitle
      if (this.personData.titles && this.personData.titles.length > 0) {
        return this.personData.titles[0] + (this.personData.birthDate ? ` · ${this.personData.birthDate}` : '')
      }
      return ''
    },
    formatBirthInfo() {
      const parts = []
      if (this.personData.birthPlace) parts.push(this.personData.birthPlace)
      if (this.personData.birthDate) parts.push(this.personData.birthDate)
      return parts.join(' · ') || '信息不详'
    },
    playVoice() {
      // TODO: 播放语音
      console.log('播放语音')
    },
    playVideo() {
      this.scrollToSection('resources')
    },
    scrollToTimeline() {
      this.scrollToSection('timeline')
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    scrollToNextSection() {
      this.scrollToSection('info-cards')
    },
    toggleSearch() {
      this.showSearch = !this.showSearch
    },
    shareProfile() {
      if (navigator.share) {
        navigator.share({
          title: this.personData.name,
          text: this.personData.subtitle || '',
          url: window.location.href
        })
      } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('链接已复制到剪贴板')
        })
      }
    },
    toggleFavorite() {
      this.isFavorited = !this.isFavorited
    },
    // 时间轴相关
    toggleNode(index) {
      this.expandedNode = this.expandedNode === index ? null : index
    },
    getEventImportanceClass(importance) {
      const classes = {
        high: 'importance-high',
        medium: 'importance-medium',
        low: 'importance-low'
      }
      return classes[importance] || 'importance-medium'
    },
    zoomTimeline(delta) {
      this.timelineZoom = Math.max(0.5, Math.min(2, this.timelineZoom + delta))
    },
    // 资源相关
    getResourceCount(tabId) {
      switch(tabId) {
        case 'documents':
          return this.getDocuments().length
        case 'audio':
          return (this.personData.audios || []).length
        case 'video':
          return (this.personData.videos || []).length
        case 'originals':
          return this.getOriginals().length
        default:
          return 0
      }
    },
    getDocuments() {
      // 从achievements中提取文档，或使用resources字段
      const docs = []
      if (this.personData.achievements) {
        this.personData.achievements.forEach(achievement => {
          if (achievement.type === '论文' || achievement.type === '专著') {
            docs.push({
              title: achievement.title,
              year: achievement.year,
              summary: achievement.summary || achievement.description,
              source: achievement.source || '档案馆',
              citation: achievement.citation || `档案号 ${achievement.type}${achievement.year}`,
              resources: achievement.resources
            })
          }
        })
      }
      return docs
    },
    getOriginals() {
      // 获取手稿/信件等原件
      return (this.personData.originals || []).map(item => ({
        title: item.title || item.name,
        description: item.description,
        url: item.url || item.image,
        type: item.type || '手稿',
        date: item.date,
        source: item.source || '档案馆'
      }))
    },
    viewDocument(doc) {
      // 查看文档详情
      if (doc.resources && doc.resources.length > 0) {
        const pdfResource = doc.resources.find(r => r.type === 'pdf')
        if (pdfResource) {
          window.open(pdfResource.url, '_blank')
        }
      }
    },
    downloadDocument(doc) {
      // 下载文档
      if (doc.resources && doc.resources.length > 0) {
        const pdfResource = doc.resources.find(r => r.type === 'pdf')
        if (pdfResource) {
          const link = document.createElement('a')
          link.href = pdfResource.url
          link.download = `${doc.title}.pdf`
          link.click()
        }
      }
    },
    // 音频相关
    toggleAudio(audioId) {
      if (this.currentAudio === audioId) {
        this.isPlaying = !this.isPlaying
      } else {
        this.currentAudio = audioId
        this.isPlaying = true
        // TODO: 实际播放音频
      }
    },
    jumpToChapter(audioId, time) {
      this.currentAudio = audioId
      this.isPlaying = true
      // TODO: 跳转到指定时间
      console.log('跳转到章节:', time)
    },
    // 视频相关
    playVideoModal(video) {
      this.currentVideoModal = video
    },
    closeVideoModal() {
      this.currentVideoModal = null
    },
    // 关系网相关
    initRelationshipNetwork() {
      // TODO: 使用D3.js或vis.js初始化关系图谱
      // 这里提供简化版本
      const canvas = this.$refs.networkCanvas
      if (!canvas || !this.personData.relationships) return
      
      // 实际实现需要引入D3.js等库
      console.log('初始化关系网络', this.personData.relationships)
    },
    // 地图相关
    initMap() {
      // TODO: 使用地图API（如高德、百度地图）初始化地图
      // 这里提供简化版本
      const mapCanvas = this.$refs.mapCanvas
      if (!mapCanvas || !this.personData.geoTags) return
      
      console.log('初始化地图', this.personData.geoTags)
    },
    highlightLocation(index) {
      // 高亮指定地点
      console.log('高亮地点', index)
    },
    // 引用相关
    getCitations() {
      return this.personData.citations || []
    },
    exportCitation(format) {
      // 导出指定格式的引用
      const citation = this.formatCitation(format)
      this.copyToClipboard(citation)
      alert(`${format} 格式引用已复制到剪贴板`)
    },
    formatCitation(format) {
      const name = this.personData.name
      const title = `${name} - ${this.personData.subtitle || '人物档案'}`
      const url = window.location.href
      const date = new Date().toISOString().split('T')[0]
      
      switch(format) {
        case 'APA':
          return `${name}. (${this.personData.birthDate || 'n.d.'}). ${title}. 成都理工大学数字校史馆. ${url}`
        case 'MLA':
          return `${name}. "${title}." 成都理工大学数字校史馆, ${date}, ${url}.`
        case 'Chicago':
          return `${name}. "${title}." 成都理工大学数字校史馆. ${date}. ${url}.`
        default:
          return `${name}. ${title}. ${url}`
      }
    },
    exportPDF() {
      // 导出PDF
      window.print()
      // 实际实现可以使用jsPDF等库
    },
    copyCitation(citation) {
      const text = typeof citation === 'string' ? citation : (citation.text || '')
      this.copyToClipboard(text)
      alert('引用已复制到剪贴板')
    },
    copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
      } else {
        // 降级方案
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
    },
    // 互动相关
    submitComment() {
      if (!this.newComment.trim()) return
      
      // TODO: 提交评论到后端
      console.log('提交评论', this.newComment)
      alert('评论已提交，待审核后发布')
      this.newComment = ''
    },
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        this.uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        })
      })
      
      // TODO: 实际上传文件到服务器
      console.log('上传文件', this.uploadedFiles)
    },
    removeFile(index) {
      this.uploadedFiles.splice(index, 1)
    },
    // 扇子相关
    expandFan() {
      this.fanExpanded = true
      // 滚动到扇子区域
      this.$nextTick(() => {
        const fanSection = document.getElementById('fan-intro')
        if (fanSection) {
          fanSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    },
    collapseFan() {
      this.fanExpanded = false
    },
    getFanBladeStyle(index) {
      const total = 20
      const maxAngle = 180 // 扇子展开的最大角度
      const angleStep = maxAngle / (total - 1)
      const startAngle = -90 // 从正上方开始
      const currentAngle = startAngle + (index - 1) * angleStep - maxAngle / 2
      const delay = (index - 1) * 0.03
      
      // 未展开时：扇叶聚集在一起（几乎垂直）
      // 展开时：扇叶分散成扇形
      const rotationAngle = this.fanExpanded ? currentAngle : startAngle
      
      return {
        transform: `rotate(${rotationAngle}deg)`,
        transformOrigin: 'center bottom',
        transitionDelay: `${delay}s`,
        opacity: this.fanExpanded ? 0.9 : 0.4,
        transition: `all 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`
      }
    },
    getPersonIntroduction() {
      // 从biography或summary中提取介绍段落
      const intro = []
      
      if (this.personData.summary) {
        intro.push(this.personData.summary)
      }
      
      if (this.personData.biography && this.personData.biography.length > 0) {
        this.personData.biography.forEach(bio => {
          if (bio.content) {
            // 提取文本段落，去除HTML标签（简化版）
            const textContent = bio.content.replace(/<[^>]*>/g, '').trim()
            if (textContent) {
              const paragraphs = textContent.split(/\n+/).filter(p => p.trim())
              paragraphs.forEach(p => {
                if (p.trim().length > 50) { // 只添加较长的段落
                  intro.push(p.trim())
                }
              })
            }
          }
        })
      }
      
      // 如果没有内容，使用默认介绍
      if (intro.length === 0) {
        intro.push(
          `${this.personData.name}${this.personData.subtitle ? `，${this.personData.subtitle}` : ''}，是一位杰出的学者和教育家。`,
          `在学术领域，${this.personData.name}做出了卓越的贡献，其研究成果影响深远，为学科发展奠定了重要基础。`,
          `除了学术成就，${this.personData.name}还致力于人才培养，培养了大批优秀的学生，他们在各自的领域都取得了显著的成就。`,
          `${this.personData.name}的品格和精神，激励着一代又一代的学子，是学术界的典范和楷模。`
        )
      }
      
      return intro.slice(0, 4) // 最多显示4段
    },
    // 图片预加载
    preloadImages(personData) {
      // 重置加载状态
      this.heroImageLoaded = false
      this.avatarImageLoaded = false
      
      // 预加载背景图
      const heroImageUrl = personData.heroImage || personData.image
      if (heroImageUrl) {
        const heroImg = new Image()
        heroImg.onload = () => {
          this.heroImageLoaded = true
        }
        heroImg.onerror = () => {
          this.heroImageLoaded = false
        }
        heroImg.src = heroImageUrl
      }
      
      // 预加载头像
      if (personData.image) {
        const avatarImg = new Image()
        avatarImg.onload = () => {
          this.avatarImageLoaded = true
        }
        avatarImg.onerror = () => {
          this.handleImageError('avatar')
        }
        avatarImg.src = personData.image
      }
    },
    // 图片加载错误处理
    handleImageError(type) {
      if (type === 'avatar') {
        this.avatarImageLoaded = false
      }
    },
    // 通用图片加载处理
    onImageLoad(event) {
      // 图片加载完成，添加淡入效果
      const img = event.target
      // 确保图片已经加载完成
      if (img.complete && img.naturalHeight !== 0) {
        // 添加loaded类来触发淡入动画
        img.classList.add('loaded')
        // 如果图片已经有opacity样式，移除它让CSS类生效
        img.style.opacity = ''
      }
    },
    onImageError(event) {
      // 图片加载失败，可以显示占位符
      console.warn('图片加载失败:', event.target.src)
      // 可以设置一个默认占位图
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.person-detail-narrative {
  min-height: 100vh;
  background: #fafafa;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* 顶部导航 */
.top-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #4a90e2;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #f0f7ff;
  color: #357abd;
}

.separator {
  color: #ccc;
  margin: 0 5px;
}

.current-person {
  color: #2c3e50;
  font-weight: 500;
}

.nav-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.action-btn:hover {
  background: #f0f0f0;
  color: #4a90e2;
}

.action-btn.active {
  color: #e74c3c;
}

/* Hero区 */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.7);
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.hero-background.loaded {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding-top: 80px;
}

.avatar-container {
  margin-bottom: 30px;
}

.avatar-frame {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 50%;
  padding: 5px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
}

.avatar-frame.hovered {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 60px;
  border: 4px solid white;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  opacity: 0;
  animation: fadeInAvatar 0.5s ease-in-out forwards;
}

@keyframes fadeInAvatar {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.person-name {
  font-size: 56px;
  font-weight: 700;
  margin: 0 0 15px 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.person-title {
  font-size: 20px;
  margin: 0 0 40px 0;
  opacity: 0.95;
  font-weight: 400;
}

.quick-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  min-width: 100px;
}

.quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
}

.quick-action-btn i {
  font-size: 24px;
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 24px;
  cursor: pointer;
  animation: bounce 2s ease-in-out infinite;
  z-index: 10;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

/* 关键信息卡 */
.info-cards-section {
  padding: 80px 0;
  background: white;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.info-card {
  display: flex;
  gap: 20px;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.card-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-radius: 12px;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.card-value {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
  line-height: 1.4;
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
  padding-top: 80px;
}

.title-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-radius: 15px;
  color: white;
  font-size: 28px;
}

/* 时间轴样式 */
.timeline-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.mode-btn:hover {
  border-color: #4a90e2;
  color: #4a90e2;
}

.mode-btn.active {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-color: transparent;
  color: white;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  border: 2px solid #e0e0e0;
}

.zoom-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.zoom-btn:hover {
  background: #f0f0f0;
  color: #4a90e2;
}

.zoom-level {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  min-width: 50px;
  text-align: center;
}

.timeline-wrapper {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 40px 0;
  -webkit-overflow-scrolling: touch;
}

.timeline-container {
  position: relative;
  min-height: 400px;
}

.timeline-container.horizontal {
  display: flex;
  gap: 60px;
  padding: 0 40px;
  min-width: max-content;
}

.timeline-container.vertical {
  display: flex;
  flex-direction: column;
  gap: 60px;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-container.vertical::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #4a90e2, #357abd);
  transform: translateX(-50%);
  z-index: 0;
}

.timeline-node {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
}

.timeline-container.horizontal .timeline-node {
  min-width: 320px;
  max-width: 400px;
}

.timeline-container.vertical .timeline-node {
  display: flex;
  gap: 40px;
  width: 100%;
}

.timeline-container.vertical .timeline-node:nth-child(even) {
  flex-direction: row-reverse;
}

.node-dot {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4a90e2;
  flex-shrink: 0;
  z-index: 10;
}

.timeline-container.horizontal .node-dot {
  margin: 0 auto 20px;
}

.timeline-container.vertical .node-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.node-dot.importance-high {
  background: #e74c3c;
  box-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
  width: 28px;
  height: 28px;
}

.node-dot.importance-medium {
  background: #f39c12;
}

.node-dot.importance-low {
  background: #95a5a6;
}

.dot-ripple {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: inherit;
  opacity: 0.3;
  animation: ripple 2s ease-out infinite;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.node-content {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.timeline-container.vertical .node-content {
  flex: 1;
  max-width: 45%;
}

.timeline-node:hover .node-content {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.node-year {
  font-size: 18px;
  font-weight: 700;
  color: #4a90e2;
  margin-bottom: 10px;
}

.node-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.node-detail {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.detail-description {
  line-height: 1.8;
  color: #555;
  margin: 0 0 15px 0;
}

.detail-achievements {
  margin: 15px 0;
}

.detail-achievements h4 {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 10px 0;
}

.detail-achievements ul {
  margin: 0;
  padding-left: 20px;
}

.detail-achievements li {
  margin-bottom: 8px;
  color: #666;
  line-height: 1.6;
}

.detail-media {
  margin: 20px 0;
}

.detail-media img,
.timeline-media-img {
  width: 100%;
  border-radius: 10px;
  max-height: 300px;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
}

.detail-media img.loaded,
.timeline-media-img.loaded {
  opacity: 1;
}

.detail-media video {
  width: 100%;
  border-radius: 10px;
  max-height: 300px;
  object-fit: cover;
  opacity: 1;
}

.detail-citation {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 15px;
}

.detail-citation i {
  color: #4a90e2;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  margin-top: 0;
}

/* 深度资料区样式 */
.resources-section {
  padding: 80px 0;
  background: white;
}

.resource-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.resource-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 25px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.resource-tab:hover {
  background: #f0f0f0;
  color: #4a90e2;
}

.resource-tab.active {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border-color: transparent;
}

.tab-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.resource-content {
  min-height: 400px;
}

.resource-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 文献列表 */
.document-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.document-item {
  display: flex;
  gap: 20px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.document-item:hover {
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transform: translateX(5px);
}

.doc-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e74c3c;
  border-radius: 12px;
  color: white;
  font-size: 28px;
  flex-shrink: 0;
}

.doc-info {
  flex: 1;
}

.doc-info h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.doc-meta {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 10px 0;
}

.doc-summary {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.doc-citation {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #7f8c8d;
}

.doc-action {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.doc-action:hover {
  border-color: #4a90e2;
  color: #4a90e2;
  background: #f0f7ff;
}

/* 音频列表 */
.audio-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.audio-item {
  display: flex;
  gap: 20px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.audio-item:hover {
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.audio-player-mini {
  flex-shrink: 0;
}

.play-button {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.play-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}

.play-button.playing {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.audio-info {
  flex: 1;
}

.audio-info h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.audio-info p {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.audio-meta {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.audio-meta span {
  margin-right: 15px;
}

.audio-chapters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.chapters-label {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}

.chapter-btn {
  padding: 4px 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 15px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chapter-btn:hover {
  border-color: #4a90e2;
  color: #4a90e2;
  background: #f0f7ff;
}

/* 视频网格 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.video-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-item:hover {
  transform: translateY(-5px);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
}

.video-thumbnail {
  position: relative;
}

.thumbnail-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 48px;
}

.video-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
}

.video-thumbnail img.loaded {
  opacity: 1;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  color: white;
  font-size: 36px;
  transition: all 0.3s ease;
}

.video-item:hover .play-overlay {
  background: rgba(74, 144, 226, 0.9);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.video-info h4 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.video-info p {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 8px 0;
}

.video-meta {
  font-size: 12px;
  color: #7f8c8d;
}

/* 原件画廊 */
.original-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.original-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.original-item:hover {
  transform: translateY(-5px);
}

.original-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
}

.original-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 48px;
}

.original-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
}

.original-image img.loaded {
  opacity: 1;
}

.original-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: all 0.3s ease;
}

.original-item:hover .original-overlay {
  opacity: 1;
}

.original-overlay i {
  font-size: 32px;
  margin-bottom: 8px;
}

.original-info h4 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.original-info p {
  font-size: 13px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 8px 0;
}

.original-meta {
  font-size: 12px;
  color: #7f8c8d;
}

.original-meta span {
  margin-right: 10px;
}

/* 人物关系网样式 */
.relationships-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.network-container {
  position: relative;
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  min-height: 500px;
}

.network-canvas {
  width: 100%;
  height: 500px;
  background: #fafafa;
  border-radius: 10px;
  border: 2px dashed #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}

.network-legend {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-dot.mentor {
  background: #e74c3c;
}

.legend-dot.student {
  background: #4a90e2;
}

.legend-dot.colleague {
  background: #f39c12;
}

.legend-dot.other {
  background: #95a5a6;
}

/* 地点地图样式 */
.map-section {
  padding: 80px 0;
  background: white;
}

.map-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.map-canvas {
  width: 100%;
  height: 500px;
  background: #f0f0f0;
  border-radius: 15px;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.location-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.location-item:hover {
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateX(5px);
}

.location-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-radius: 10px;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}

.location-info {
  flex: 1;
}

.location-info h4 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.location-info p {
  font-size: 13px;
  color: #555;
  margin: 0 0 5px 0;
  line-height: 1.5;
}

.location-coords {
  font-size: 12px;
  color: #7f8c8d;
}

/* 学术引用样式 */
.citations-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.citation-export {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.export-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.export-btn:hover {
  border-color: #4a90e2;
  color: #4a90e2;
  background: #f0f7ff;
}

.export-btn.primary {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-color: transparent;
  color: white;
}

.export-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
}

.citations-list {
  margin-top: 40px;
}

.citations-list h3 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 25px 0;
  font-weight: 600;
}

.citation-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.citation-item:hover {
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateX(5px);
}

.citation-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e74c3c;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
}

.citation-content {
  flex: 1;
}

.citation-content p {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.citation-meta {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #7f8c8d;
  flex-wrap: wrap;
}

.citation-meta a {
  color: #4a90e2;
  text-decoration: none;
  transition: all 0.3s ease;
}

.citation-meta a:hover {
  text-decoration: underline;
}

.citation-copy {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.citation-copy:hover {
  border-color: #4a90e2;
  color: #4a90e2;
  background: #f0f7ff;
}

/* 互动结尾区样式 */
.interaction-section {
  padding: 80px 0;
  background: white;
}

.interaction-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.comments-panel,
.contribution-panel {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px;
}

.comments-panel h3,
.contribution-panel h3 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 25px 0;
  font-weight: 600;
}

.comments-list {
  min-height: 200px;
  margin-bottom: 25px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
  text-align: center;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.comment-form {
  margin-top: 25px;
}

.comment-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.comment-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.contribution-desc {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 25px 0;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 15px;
  padding: 60px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.upload-area:hover {
  border-color: #4a90e2;
  background: #f0f7ff;
}

.upload-area i {
  font-size: 48px;
  color: #4a90e2;
  margin-bottom: 20px;
}

.upload-area p {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-weight: 500;
}

.upload-hint {
  font-size: 12px;
  color: #7f8c8d;
}

.uploaded-files {
  margin-top: 25px;
}

.uploaded-files h4 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  background: white;
  border-radius: 10px;
  margin-bottom: 10px;
}

.uploaded-file-item i {
  color: #4a90e2;
  font-size: 18px;
}

.uploaded-file-item span {
  flex: 1;
  font-size: 14px;
  color: #555;
}

.remove-file-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #e74c3c;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-file-btn:hover {
  background: #fee;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 15px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20px;
}

.modal-close:hover {
  background: #e0e0e0;
  color: #e74c3c;
}

.video-player-container {
  width: 100%;
  margin-bottom: 25px;
}

.modal-video {
  width: 100%;
  border-radius: 10px;
}

.video-modal-info {
  text-align: center;
}

.video-modal-info h3 {
  font-size: 22px;
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.video-modal-info p {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

.video-modal-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: #7f8c8d;
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* 扇子展开区域样式 */
.fan-section {
  padding: 100px 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #e8e9ea 100%);
  min-height: 600px;
  position: relative;
  overflow: hidden;
}

.fan-container {
  position: relative;
  width: 100%;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
}

.fan-background {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  transform-origin: center bottom;
}

.fan-blade {
  position: absolute;
  width: 6px;
  height: 450px;
  background: linear-gradient(180deg, 
    rgba(139, 69, 19, 0.95) 0%, 
    rgba(210, 105, 30, 0.85) 35%,
    rgba(244, 164, 96, 0.9) 70%,
    rgba(255, 228, 181, 0.75) 100%
  );
  border-radius: 3px;
  transform-origin: center bottom;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.4),
    inset 0 0 15px rgba(255, 255, 255, 0.25);
  z-index: 1;
  left: 50%;
  bottom: 0;
  margin-left: -3px;
}

.fan-blade::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 30%;
  background: linear-gradient(180deg, rgba(139, 69, 19, 0.8), transparent);
  border-radius: 2px 2px 0 0;
}

.blade-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 1px,
      rgba(255, 255, 255, 0.1) 1px,
      rgba(255, 255, 255, 0.1) 2px
    );
  opacity: 0.3;
}

.fan-trigger {
  position: relative;
  z-index: 10;
  text-align: center;
  cursor: pointer;
  padding: 50px 60px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(74, 144, 226, 0.2);
}

.fan-trigger:hover {
  transform: scale(1.08) translateY(-5px);
  box-shadow: 0 20px 60px rgba(74, 144, 226, 0.25);
  border-color: rgba(74, 144, 226, 0.4);
  background: rgba(255, 255, 255, 1);
}

.trigger-icon {
  width: 90px;
  height: 90px;
  margin: 0 auto 25px;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.4);
  transition: all 0.3s ease;
}

.fan-trigger:hover .trigger-icon {
  transform: scale(1.1);
  box-shadow: 0 10px 30px rgba(74, 144, 226, 0.5);
}

.trigger-text {
  font-size: 20px;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
  letter-spacing: 1px;
}

.fan-content {
  position: relative;
  z-index: 20;
  max-width: 900px;
  width: 100%;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.fan-title {
  text-align: center;
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 3px solid #e8e9ea;
}

.fan-title h2 {
  font-size: 42px;
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-weight: 700;
  letter-spacing: 2px;
}

.fan-subtitle {
  font-size: 18px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 400;
}

.fan-text-content {
  margin-bottom: 40px;
}

.intro-paragraph {
  display: flex;
  gap: 25px;
  margin-bottom: 35px;
  padding: 25px;
  background: #fafafa;
  border-radius: 15px;
  border-left: 4px solid #4a90e2;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  transition: all 0.3s ease;
}

.intro-paragraph:hover {
  background: #f0f7ff;
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.paragraph-number {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-radius: 50%;
  color: white;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.paragraph-text {
  flex: 1;
}

.paragraph-text p {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin: 0;
  text-align: justify;
  letter-spacing: 0.5px;
}

.fan-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 auto;
  padding: 15px 40px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.fan-close-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.fan-close-btn i {
  font-size: 18px;
}

/* 扇子内容动画 */
.fan-content-enter-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fan-content-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(30px);
}

.fan-content-leave-active {
  transition: all 0.5s ease;
}

.fan-content-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 扇子展开时的背景效果 */
.fan-background.expanded::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(74, 144, 226, 0.1) 0%, transparent 70%);
  pointer-events: none;
  animation: fanGlow 2s ease-in-out infinite;
}

@keyframes fanGlow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-container {
    grid-template-columns: 1fr;
  }
  
  .interaction-content {
    grid-template-columns: 1fr;
  }
  
  .export-buttons {
    flex-direction: column;
  }
  
  .export-btn {
    width: 100%;
    justify-content: center;
  }
  
  .timeline-container.horizontal {
    flex-direction: column;
  }
  
  .person-name {
    font-size: 36px;
  }
  
  .quick-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .quick-action-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .fan-container {
    height: 500px;
  }
  
  .fan-blade {
    height: 300px;
  }
  
  .fan-content {
    padding: 40px 25px;
  }
  
  .fan-title h2 {
    font-size: 32px;
  }
  
  .intro-paragraph {
    flex-direction: column;
    gap: 15px;
  }
  
  .paragraph-number {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>

