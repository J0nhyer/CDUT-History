<template>
  <div class="person-detail-advanced-page">
    <!-- 使用北大校史馆风格的学术型人物详情组件 -->
    <PersonDetailAcademic 
      v-if="personData" 
      :personData="personData"
    />
    
    <!-- 加载状态 -->
    <div v-else-if="isLoading" class="loading-screen">
      <div class="loading-animation">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    </div>
    
    <!-- 404状态 -->
    <div v-else class="not-found-screen">
      <div class="not-found-content">
        <i class="fas fa-user-slash"></i>
        <h2>未找到该人物信息</h2>
        <p>抱歉，您访问的人物信息不存在或已被删除</p>
        <button @click="goBack" class="back-button">
          <i class="fas fa-arrow-left"></i>
          返回人物列表
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// 使用北大校史馆风格的学术型人物详情组件
import PersonDetailAcademic from '@/components/PersonDetailAcademic.vue'
// ⭐ 从数据库加载人物数据
import { getPersonDetail } from '@/services/personDataService.js'

export default {
  name: 'PersonDetailAdvancedPage',
  components: {
    PersonDetailAcademic
    // 其他可用组件：
    // PersonDetailNarrative: () => import('@/components/PersonDetailNarrative.vue') - 叙事化风格
    // PersonDetailAdvanced: () => import('@/components/PersonDetailAdvanced.vue') - 高级版
  },
  data() {
    return {
      personData: null,
      isLoading: true
    }
  },
  created() {
    this.loadPersonData()
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadPersonData()
      },
      immediate: true
    }
  },
  methods: {
    async loadPersonData() {
      this.isLoading = true
      
      try {
        const personId = this.$route.params.id
        
        // ⭐ 从数据库API获取人物数据
        console.log(`[PersonDetailAdvancedPage] 开始加载人物数据: ${personId}`);
        const rawData = await getPersonDetail(personId)
        
        // 调试信息 - 详细检查数据完整性
        console.log('🔍 [PersonDetailAdvancedPage] 加载人物数据结果:', {
          personId,
          found: !!rawData,
          name: rawData?.name,
          id: rawData?.id,
          hasBiography: !!rawData?.biography,
          biographyLength: rawData?.biography?.length,
          biographyType: Array.isArray(rawData?.biography) ? 'array' : typeof rawData?.biography,
          hasRelationships: !!rawData?.relationships,
          relationshipsLength: rawData?.relationships?.length,
          hasImage: !!rawData?.image,
          imagePath: rawData?.image
        })
        
        // 详细检查biography数据
        if (rawData?.biography && rawData.biography.length > 0) {
          console.log('📝 [PersonDetailAdvancedPage] Biography详细信息:')
          rawData.biography.forEach((bio, index) => {
            console.log(`  [${index}]`, {
              title: bio.title,
              hasContent: !!bio.content,
              contentLength: bio.content?.length,
              contentPreview: bio.content?.substring(0, 50),
              mediaType: bio.mediaType,
              mediaUrl: bio.mediaUrl,
              tags: bio.tags || bio.tagsList
            })
          })
        } else {
          console.warn('⚠️ [PersonDetailAdvancedPage] Biography数据为空或不存在')
        }
        
        console.log('📦 [PersonDetailAdvancedPage] 完整数据:', JSON.stringify(rawData, null, 2))
        
        // 确保数据对象存在且为响应式
        this.personData = rawData
        
        if (!this.personData) {
          console.error(`❌ 未找到人物数据: ${personId}`)
        } else {
          // 确保数据完整 - 如果没有某些字段，添加默认值
          if (!this.personData.biography) {
            console.warn('⚠️ 缺少biography数据')
            this.personData.biography = []
          }
          if (!this.personData.relationships) {
            this.personData.relationships = []
          }
          // 这些字段已被移除，但为了兼容性保留空数组
          if (!this.personData.timeline) {
            this.personData.timeline = []
          }
          if (!this.personData.achievements) {
            this.personData.achievements = []
          }
          if (!this.personData.videos) {
            this.personData.videos = []
          }
          if (!this.personData.audios) {
            this.personData.audios = []
          }
          if (!this.personData.vrScenes) {
            this.personData.vrScenes = []
          }
          if (!this.personData.anecdotes) {
            this.personData.anecdotes = []
          }
        }
      } catch (error) {
        console.error('加载人物数据失败:', error)
        this.personData = null
      } finally {
        this.isLoading = false
      }
    },
    
    goBack() {
      this.$router.push('/persons')
    }
  }
}
</script>

<style scoped>
.person-detail-advanced-page {
  min-height: 100vh;
}

/* 加载屏幕 */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: white;
}

.loading-animation {
  text-align: center;
  color: #333;
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 30px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-animation p {
  font-size: 20px;
  font-weight: 600;
}

/* 404屏幕 */
.not-found-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  color: white;
  max-width: 600px;
}

.not-found-content i {
  font-size: 120px;
  margin-bottom: 40px;
  opacity: 0.8;
}

.not-found-content h2 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
}

.not-found-content p {
  font-size: 18px;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 40px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.back-button i {
  font-size: 20px;
}
</style>

