import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  server: {
    port: 3000, // 设置端口为 3000
    host: '0.0.0.0', // 监听所有网络接口
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', // 使用127.0.0.1替代localhost，强制IPv4
        changeOrigin: true,
        // 保留 /api 前缀，确保请求能命中后端对应的接口
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 确保正确的字符编码
  build: {
    charset: 'utf8'
  },
  // 设置开发服务器编码
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  }
})
