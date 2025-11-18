<template>
  <div class="person-detail-page">
    <PersonDetail v-if="personData" :personData="personData" />
    <div v-else class="loading-container">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p>加载中...</p>
    </div>
    
    <!-- 如果人物不存在，显示404 -->
    <div v-if="!personData && !isLoading" class="not-found">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>未找到该人物信息</h2>
      <button @click="goToPersonsList" class="back-to-list-btn">
        <i class="fas fa-arrow-left"></i>
        返回人物列表
      </button>
    </div>
  </div>
</template>

<script>
import PersonDetail from '@/components/PersonDetail.vue'
import { getPersonDetail } from '@/services/personDataService.js'

export default {
  name: 'PersonDetailPage',
  components: {
    PersonDetail
  },
  data() {
    return {
      personData: null,
      isLoading: true
    }
  },
  created() {
    this.loadPersonData();
  },
  watch: {
    // 监听路由参数变化，重新加载数据
    '$route.params.id': {
      handler() {
        this.loadPersonData();
      },
      immediate: true
    }
  },
  methods: {
    async loadPersonData() {
      this.isLoading = true;
      const personId = this.$route.params.id;
      
      try {
        this.personData = await getPersonDetail(personId);
      } catch (error) {
        console.error('加载人物详情失败:', error);
        this.personData = null;
      } finally {
        this.isLoading = false;
      }
    },
    
    goToPersonsList() {
      this.$router.push('/persons');
    }
  }
}
</script>

<style scoped>
.person-detail-page {
  min-height: 100vh;
  background-color: white;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: white;
  color: #333;
}

.loading-spinner {
  font-size: 48px;
  margin-bottom: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-container p {
  font-size: 18px;
  font-weight: 500;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 20px;
}

.not-found i {
  font-size: 80px;
  margin-bottom: 30px;
  color: #ffc107;
}

.not-found h2 {
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: 600;
}

.back-to-list-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-to-list-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.back-to-list-btn i {
  font-size: 18px;
}
</style>

