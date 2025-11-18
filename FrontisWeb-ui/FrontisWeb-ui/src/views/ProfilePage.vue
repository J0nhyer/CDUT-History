<template>
  <div class="profile-page">
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <i class="fas fa-arrow-left"></i>
      返回
    </button>

    <!-- 主要内容区 -->
    <main class="main-content">
      <div class="container">
        <!-- 用户信息卡片 -->
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar-wrapper">
              <img :src="defaultAvatar" :alt="userInfo.username || '用户'" class="avatar-image">
            </div>
            <h1 class="username">{{ userInfo.username || '用户' }}</h1>
            <p class="user-email">{{ userInfo.email || '未设置邮箱' }}</p>
          </div>
        </div>

        <!-- 功能菜单卡片 -->
        <div class="menu-card">
          <h2 class="card-title">
            <i class="fas fa-cog"></i>
            账户设置
          </h2>
          <div class="menu-list">
            <div class="menu-item" @click="showChangePassword = true">
              <div class="menu-item-icon">
                <i class="fas fa-lock"></i>
              </div>
              <div class="menu-item-content">
                <h3>修改密码</h3>
                <p>更改您的登录密码</p>
              </div>
              <div class="menu-item-arrow">
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
            <div class="menu-item" @click="showEmailEdit = true">
              <div class="menu-item-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="menu-item-content">
                <h3>邮箱信息</h3>
                <p>{{ userInfo.email || '未设置邮箱' }}</p>
              </div>
              <div class="menu-item-arrow">
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>


        <!-- 退出登录按钮 -->
        <div class="logout-section">
          <button class="logout-btn" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            退出登录
          </button>
        </div>
      </div>
    </main>

    <!-- 修改密码模态框 -->
    <div v-if="showChangePassword" class="modal-overlay" @mousedown="handleOverlayMouseDown($event, 'password')" @mouseup="handleOverlayMouseUp($event, 'password')">
      <div class="modal-content" @mousedown.stop @mouseup.stop>
        <div class="modal-header">
          <h2>修改密码</h2>
          <button class="modal-close" @click="showChangePassword = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group password-group">
            <label>原密码</label>
            <div class="password-input-wrapper">
              <input 
                :type="showOldPassword ? 'text' : 'password'" 
                v-model="passwordForm.oldPassword" 
                placeholder="请输入原密码"
                class="form-input"
              >
              <button 
                type="button" 
                class="password-toggle" 
                @click="showOldPassword = !showOldPassword"
                tabindex="-1"
              >
                <i :class="showOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          <div class="form-group password-group">
            <label>新密码</label>
            <div class="password-input-wrapper">
              <input 
                :type="showNewPassword ? 'text' : 'password'" 
                v-model="passwordForm.newPassword" 
                placeholder="请输入新密码（至少6位）"
                class="form-input"
              >
              <button 
                type="button" 
                class="password-toggle" 
                @click="showNewPassword = !showNewPassword"
                tabindex="-1"
              >
                <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          <div class="form-group password-group">
            <label>确认新密码</label>
            <div class="password-input-wrapper">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                v-model="passwordForm.confirmPassword" 
                placeholder="请再次输入新密码"
                class="form-input"
              >
              <button 
                type="button" 
                class="password-toggle" 
                @click="showConfirmPassword = !showConfirmPassword"
                tabindex="-1"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showChangePassword = false">取消</button>
          <button class="btn-submit" @click="handleChangePassword">确认修改</button>
        </div>
      </div>
    </div>

    <!-- 修改邮箱模态框 -->
    <div v-if="showEmailEdit" class="modal-overlay" @mousedown="handleOverlayMouseDown($event, 'email')" @mouseup="handleOverlayMouseUp($event, 'email')">
      <div class="modal-content" @mousedown.stop @mouseup.stop>
        <div class="modal-header">
          <h2>修改邮箱</h2>
          <button class="modal-close" @click="showEmailEdit = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>新邮箱</label>
            <input 
              type="email" 
              v-model="emailForm.newEmail" 
              placeholder="请输入新邮箱地址"
              class="form-input"
              required
            >
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showEmailEdit = false">取消</button>
          <button class="btn-submit" @click="handleChangeEmail">确认修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { updatePassword, updateEmail } from '@/api/user'
import defaultAvatarImg from '@/assets/default-avatar.png'

export default {
  name: 'ProfilePage',
  setup() {
    const router = useRouter()
    const userInfo = ref({ username: '', email: '', avatar: '' })
    const showChangePassword = ref(false)
    const showEmailEdit = ref(false)
    const defaultAvatar = defaultAvatarImg
    
    const passwordForm = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // 显示密码状态
    const showOldPassword = ref(false)
    const showNewPassword = ref(false)
    const showConfirmPassword = ref(false)
    
    const emailForm = ref({
      newEmail: ''
    })
    
    // 用于跟踪鼠标按下位置
    const mouseDownOnOverlay = ref({
      password: false,
      email: false
    })

    // 处理遮罩层鼠标按下事件
    const handleOverlayMouseDown = (e, modalType) => {
      // 检查点击是否在模态框内容区域外（即遮罩层上）
      const modalContent = e.currentTarget.querySelector('.modal-content')
      if (modalContent) {
        const rect = modalContent.getBoundingClientRect()
        const clickX = e.clientX
        const clickY = e.clientY
        
        // 检查点击是否在模态框内容区域外
        const isOutsideContent = (
          clickX < rect.left ||
          clickX > rect.right ||
          clickY < rect.top ||
          clickY > rect.bottom
        )
        
        if (isOutsideContent) {
          mouseDownOnOverlay.value[modalType] = true
        }
      }
    }
    
    // 处理遮罩层鼠标释放事件
    const handleOverlayMouseUp = (e, modalType) => {
      // 只有当按下和释放都在遮罩层上时，才关闭弹窗
      if (mouseDownOnOverlay.value[modalType]) {
        const modalContent = e.currentTarget.querySelector('.modal-content')
        if (modalContent) {
          const rect = modalContent.getBoundingClientRect()
          const clickX = e.clientX
          const clickY = e.clientY
          
          // 检查释放是否也在模态框内容区域外
          const isOutsideContent = (
            clickX < rect.left ||
            clickX > rect.right ||
            clickY < rect.top ||
            clickY > rect.bottom
          )
          
          if (isOutsideContent) {
            // 关闭对应的模态框
            if (modalType === 'password') {
              showChangePassword.value = false
            } else if (modalType === 'email') {
              showEmailEdit.value = false
            }
          }
        }
      }
      // 重置状态
      mouseDownOnOverlay.value[modalType] = false
    }

    // 加载用户信息
    const loadUserInfo = () => {
      // 优先从 localStorage 读取（记住我的用户）
      let savedUser = localStorage.getItem('userInfo')
      if (!savedUser) {
        // 如果没有，则从 sessionStorage 读取（未记住我的用户）
        savedUser = sessionStorage.getItem('userInfo')
      }
      
      if (savedUser) {
        try {
          userInfo.value = JSON.parse(savedUser)
        } catch (error) {
          console.error('解析用户信息失败:', error)
          // 如果解析失败，跳转到首页
          router.push('/')
        }
      } else {
        // 如果没有用户信息，跳转到首页
        router.push('/')
      }
    }

    // 返回
    const goBack = () => {
      router.back()
    }

    // 修改密码
    const handleChangePassword = async () => {
      if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
        alert('请填写完整信息')
        return
      }
      
      if (passwordForm.value.newPassword.length < 6) {
        alert('密码长度不能少于6位')
        return
      }
      
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        alert('两次输入的新密码不一致')
        return
      }

      try {
        const response = await updatePassword(
          userInfo.value.username,
          passwordForm.value.oldPassword,
          passwordForm.value.newPassword
        )
        
        // axios 拦截器已经返回了 response.data，所以直接使用 response
        if (response.success) {
          alert('密码修改成功，请重新登录')
          // 清空用户信息（清除所有存储）
          localStorage.removeItem('userInfo')
          sessionStorage.removeItem('userInfo')
          // 清空表单
          passwordForm.value = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
          showChangePassword.value = false
          // 跳转到首页
          router.push('/')
        } else {
          // 在个人中心修改密码时，用户已登录，所以只显示"原密码错误"
          let errorMessage = response.message || '密码修改失败'
          if (errorMessage.includes('原密码错误或用户不存在')) {
            errorMessage = '原密码错误'
          }
          alert(errorMessage)
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        // 在个人中心修改密码时，用户已登录，所以只显示"原密码错误"
        let errorMessage = error.response?.data?.message || error.message || '修改密码失败，请稍后重试'
        if (errorMessage.includes('原密码错误或用户不存在')) {
          errorMessage = '原密码错误'
        } else if (!errorMessage.includes('原密码错误')) {
          errorMessage = '修改密码失败，请稍后重试：' + errorMessage
        }
        alert(errorMessage)
      }
    }

    // 修改邮箱
    const handleChangeEmail = async () => {
      if (!emailForm.value.newEmail) {
        alert('请填写完整信息')
        return
      }
      
      // 如果新邮箱和当前邮箱相同，提示用户
      if (emailForm.value.newEmail === userInfo.value.email) {
        alert('新邮箱与当前邮箱相同')
        showEmailEdit.value = false
        return
      }

      try {
        const response = await updateEmail(
          userInfo.value.username,
          emailForm.value.newEmail
        )
        
        // axios 拦截器已经返回了 response.data，所以直接使用 response
        if (response.success) {
          alert('邮箱修改成功')
          // 更新用户信息
          if (response.user) {
            userInfo.value.email = response.user.email
            // 更新本地存储的用户信息
            const savedUser = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')
            if (savedUser) {
              const userData = JSON.parse(savedUser)
              userData.email = response.user.email
              if (localStorage.getItem('userInfo')) {
                localStorage.setItem('userInfo', JSON.stringify(userData))
              } else {
                sessionStorage.setItem('userInfo', JSON.stringify(userData))
              }
            }
          }
          // 清空表单
          emailForm.value.newEmail = ''
          showEmailEdit.value = false
        } else {
          alert(response.message || '邮箱修改失败')
        }
      } catch (error) {
        console.error('修改邮箱失败:', error)
        alert('修改邮箱失败，请稍后重试：' + (error.response?.data?.message || error.message))
      }
    }

     // 退出登录
     const handleLogout = () => {
       if (confirm('确定要退出登录吗？')) {
         // 清除所有存储的用户信息
         localStorage.removeItem('userInfo')
         sessionStorage.removeItem('userInfo')
         router.push('/')
       }
     }

    onMounted(() => {
      loadUserInfo()
    })

    return {
      userInfo,
      showChangePassword,
      showEmailEdit,
      passwordForm,
      emailForm,
      defaultAvatar,
      showOldPassword,
      showNewPassword,
      showConfirmPassword,
      goBack,
      handleChangePassword,
      handleChangeEmail,
      handleLogout,
      handleOverlayMouseDown,
      handleOverlayMouseUp
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  position: relative;
  overflow-x: hidden;
  padding-bottom: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

/* 返回按钮 */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: white;
  transform: translateX(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

/* 主要内容 */
.main-content {
  padding: 60px 20px 40px;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}

.container {
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* 用户信息卡片 */
.profile-card {
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-wrapper {
  margin-bottom: 20px;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 30px rgba(74, 144, 226, 0.3);
  border: 4px solid #ffffff;
}

.username {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.user-email {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

/* 菜单卡片 */
.menu-card {
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-title i {
  color: #4a90e2;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.menu-item:hover {
  background: #f7fafc;
  border-color: #e2e8f0;
  transform: translateX(4px);
}

.menu-item-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a90e2;
  font-size: 20px;
  margin-right: 16px;
}

.menu-item-content {
  flex: 1;
}

.menu-item-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.menu-item-content p {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.menu-item-arrow {
  color: #cbd5e0;
  font-size: 14px;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f7fafc;
  color: #718096;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #edf2f7;
  color: #2c3e50;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.password-group {
  position: relative;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-input {
  padding-right: 45px;
}

/* 禁用浏览器原生的显示密码功能 - Chrome/Safari */
.password-input-wrapper input::-webkit-credentials-auto-fill-button,
.password-input-wrapper input::-webkit-strong-password-auto-fill-button,
.password-input-wrapper input::-webkit-inner-spin-button,
.password-input-wrapper input::-webkit-outer-spin-button {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  position: absolute !important;
  right: -9999px !important;
}

/* 隐藏Edge/IE浏览器的显示密码按钮 */
.password-input-wrapper input::-ms-reveal,
.password-input-wrapper input::-ms-clear {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  position: absolute !important;
  right: -9999px !important;
}

/* 针对所有浏览器的密码输入框，禁用原生显示密码按钮 */
.password-input-wrapper input[type="password"],
.password-input-wrapper input[type="text"] {
  /* 确保我们的自定义按钮在最上层 */
  position: relative;
}

/* 隐藏Chrome的新显示密码图标（如果存在） */
.password-input-wrapper input::after {
  display: none !important;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  z-index: 10;
  /* 确保按钮在浏览器原生按钮之上 */
}

.password-toggle:hover {
  color: #4a90e2;
}

.password-toggle:focus {
  outline: none;
}

.password-toggle i {
  font-size: 16px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #edf2f7;
}

.btn-submit {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border: none;
  color: #ffffff;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

/* 退出登录 */
.logout-section {
  width: 100%;
  max-width: 900px;
  margin-top: 8px;
}

.logout-btn {
  width: 100%;
  padding: 16px;
  background: #ffffff;
  border: 2px solid #fed7d7;
  border-radius: 12px;
  color: #e53e3e;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logout-btn:hover {
  background: #fed7d7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 50px 15px 20px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .profile-card,
  .menu-card {
    padding: 24px 20px;
  }
  
  .avatar-image {
    width: 100px;
    height: 100px;
  }
  
  .username {
    font-size: 24px;
  }
}
</style>

