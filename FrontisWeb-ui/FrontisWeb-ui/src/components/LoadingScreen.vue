<template>
  <transition name="loading-fade">
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-spinner"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingScreen',
  props: {
    isLoading: {
      type: Boolean,
      default: true
    },
    progress: {
      type: Number,
      default: 0
    },
    loadingText: {
      type: String,
      default: '加载中'
    }
  }
}
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #000000;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.3s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>
