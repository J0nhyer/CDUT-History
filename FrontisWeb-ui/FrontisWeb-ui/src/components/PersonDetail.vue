<template>
  <div id="app" class="person-detail-page">
    <!-- 返回按钮 -->
    <div class="back-section">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        返回人物列表
      </button>
    </div>
    
    <!-- 主页面内容 -->
    <div class="main-page">
      <!-- 顶部核心识别区 -->
      <header class="header-section">
        <div class="container">
          <div class="header-content">
            <div class="platform-logo">
              <span class="logo-text">成都理工大学数字校史馆</span>
              <span class="logo-subtitle">成理人物档案</span>
            </div>
            
            <div class="resource-info">
              <h1 class="main-title">{{ personData.name }}</h1>
              <p class="subtitle">{{ personData.subtitle }}</p>
              <p class="archive-number">馆藏号：{{ personData.archiveNumber }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- 主要内容区 -->
      <main class="main-content">
        <div class="container">
          <div class="content-grid">
            <!-- 左侧图片区 -->
            <aside class="image-section">
              <div class="image-container">
                <img :src="personData.image" :alt="personData.name" class="main-image" @click="showFullImage = true">
                <p class="image-caption" v-if="personData.imageCaption">{{ personData.imageCaption }}</p>
              </div>
            </aside>

            <!-- 右侧信息区 -->
            <section class="info-section">
              <!-- 基本信息 -->
              <div class="info-card basic-info-card">
                <h2 class="card-title">
                  <i class="fas fa-user"></i>
                  基本信息
                </h2>
                <div class="info-list">
                  <div v-for="(value, key) in personData.basicInfo" :key="key" class="info-item">
                    <span class="info-label">{{ key }}：</span>
                    <span class="info-value">{{ value }}</span>
                  </div>
                </div>
              </div>

              <!-- 核心任职 -->
              <div class="info-card">
                <h2 class="card-title">
                  <i class="fas fa-briefcase"></i>
                  核心任职
                </h2>
                <ul class="info-list">
                  <li v-for="(position, index) in personData.corePositions" :key="index" class="list-item">
                    <i class="fas fa-check-circle"></i>
                    {{ position }}
                  </li>
                </ul>
              </div>

              <!-- 学术成就 -->
              <div class="info-card">
                <h2 class="card-title">
                  <i class="fas fa-trophy"></i>
                  学术成就
                </h2>
                <ul class="info-list">
                  <li v-for="(achievement, index) in personData.academicAchievements" :key="index" class="list-item">
                    <i class="fas fa-star"></i>
                    {{ achievement }}
                  </li>
                </ul>
              </div>

              <!-- 教育贡献 -->
              <div class="info-card">
                <h2 class="card-title">
                  <i class="fas fa-graduation-cap"></i>
                  教育贡献
                </h2>
                <ul class="info-list">
                  <li v-for="(contribution, index) in personData.educationContributions" :key="index" class="list-item">
                    <i class="fas fa-heart"></i>
                    {{ contribution }}
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <!-- 关系图谱 -->
      <section class="relationship-section">
        <div class="container">
          <RelationshipGraph :personId="personData.id" />
        </div>
      </section>
    </div>

    <!-- 全屏图片查看 -->
    <div v-if="showFullImage" class="full-image-modal" @click="showFullImage = false">
      <img :src="personData.image" :alt="personData.name" class="full-image">
      <button class="close-btn" @click="showFullImage = false">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
import RelationshipGraph from './RelationshipGraph.vue'

export default {
  name: 'PersonDetail',
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
      showFullImage: false
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
@import '@/styles/PersonDetailStyles.css';

.full-image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: pointer;
}

.full-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}
</style>

