<template>
  <div class="person-detail-wrapper">
    <!-- 
      注意：此文件已被新的统一路由系统替代
      请使用 /person/liubaojun 访问刘宝珺详情页
      此文件保留仅用于向后兼容
    -->
    <PersonDetailAdvanced 
      v-if="personData" 
      :personData="personData" 
    />
    <div v-else-if="isLoading" class="loading">
      <p>加载中...</p>
    </div>
    <div v-else class="loading">
      <p>未找到该人物信息</p>
    </div>
  </div>
</template>

<script>
// 使用新的统一组件
import PersonDetailAdvanced from '@/components/PersonDetailAdvanced.vue'
import { getPersonDetail } from '@/services/personDataService.js'

export default {
  name: 'LiuBaoJunDetail',
  components: {
    PersonDetailAdvanced
  },
  data() {
    return {
      personData: null,
      isLoading: true
    }
  },
  async mounted() {
    // 从数据库加载数据
    this.isLoading = true
    try {
      this.personData = await getPersonDetail('liubaojun')
      // 确保有默认值
      if (this.personData) {
        if (!this.personData.timeline) this.personData.timeline = []
        if (!this.personData.achievements) this.personData.achievements = []
        if (!this.personData.videos) this.personData.videos = []
        if (!this.personData.audios) this.personData.audios = []
        if (!this.personData.vrScenes) this.personData.vrScenes = []
        if (!this.personData.anecdotes) this.personData.anecdotes = []
      }
    } catch (error) {
      console.error('加载人物数据失败:', error)
    } finally {
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.loading {
  padding: 40px;
  text-align: center;
}
</style>

