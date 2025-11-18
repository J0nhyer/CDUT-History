import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 使用vite代理，请求会转发到 http://localhost:8080
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加token等
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('❌ API请求错误:', error)
    console.error('❌ 错误详情:', {
      message: error.message,
      code: error.code,
      response: error.response,
      request: error.request,
      config: error.config
    })
    
    // 如果是网络错误，提供更友好的错误信息
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('❌ 网络连接失败，请检查：')
      console.error('   1. 后端服务是否启动（http://localhost:8080）')
      console.error('   2. Vite代理配置是否正确')
      console.error('   3. 防火墙是否阻止了连接')
    }
    
    // 如果是超时错误
    if (error.code === 'ECONNABORTED') {
      console.error('❌ 请求超时，请检查后端服务响应速度')
    }
    
    return Promise.reject(error)
  }
)

export default api

