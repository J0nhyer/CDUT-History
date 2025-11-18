import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ⚠️ 注释掉全局引入人物详情页样式，改为在需要的组件中单独引入
// import '@/styles/PersonDetailAdvanced.css'

// 创建Vue应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')

// 页面加载完成后的初始化
console.log('人物介绍系统已加载')