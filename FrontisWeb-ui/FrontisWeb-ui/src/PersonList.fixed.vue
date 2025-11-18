<template>
  <div class="person-list-page">
    <!-- 此文件已被MainPage.vue替代 -->
    <!-- 保留此文件仅用于向后兼容 -->
    <MainPage />
  </div>
</template>

<script>
import MainPage from './MainPage.vue'

export default {
  name: 'PersonList',
  components: {
    MainPage
  }
}
</script>

<style scoped>
.person-list-page {
  width: 100%;
  min-height: 100vh;
}
</style>

