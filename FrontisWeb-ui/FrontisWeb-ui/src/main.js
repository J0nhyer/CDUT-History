import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 创建Vue应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')

// 页面加载完成后的初始化
console.log('人物介绍系统已加载')