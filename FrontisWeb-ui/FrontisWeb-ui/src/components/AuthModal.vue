<template>
  <div>
    <!-- 登录模态框 -->
    <div v-if="showLoginModal" class="modal-overlay" @mousedown="handleOverlayMouseDown($event, 'login')" @mouseup="handleOverlayMouseUp($event, 'login')">
      <div class="modal-content auth-modal" @mousedown.stop @mouseup.stop>
        <div class="modal-header">
          <h3>用户登录</h3>
          <button class="modal-close" @click="closeLoginModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label for="login-username">用户名或邮箱</label>
              <input 
                type="text" 
                id="login-username"
                v-model="loginForm.username" 
                placeholder="请输入用户名或邮箱"
                required
              >
            </div>
            <div class="form-group password-group">
              <label for="login-password">密码</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showLoginPassword ? 'text' : 'password'" 
                  id="login-password"
                  v-model="loginForm.password" 
                  placeholder="请输入密码"
                  autocomplete="current-password"
                  required
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showLoginPassword = !showLoginPassword"
                  tabindex="-1"
                >
                  <i :class="showLoginPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="loginForm.remember">
                <span>记住我</span>
              </label>
              <a href="javascript:void(0)" class="forgot-password" @click.prevent="switchToForgotPassword">忘记密码？</a>
            </div>
            <button type="submit" class="submit-btn" :disabled="isLoggingIn">
              <i v-if="isLoggingIn" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-sign-in-alt"></i>
              {{ isLoggingIn ? '登录中...' : '登录' }}
            </button>
          </form>
          <div class="auth-switch">
            还没有账号？<a href="javascript:void(0)" @click.prevent="switchToRegister">立即注册</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 注册模态框 -->
    <div v-if="showRegisterModal" class="modal-overlay" @mousedown="handleOverlayMouseDown($event, 'register')" @mouseup="handleOverlayMouseUp($event, 'register')">
      <div class="modal-content auth-modal" @mousedown.stop @mouseup.stop>
        <div class="modal-header">
          <h3>用户注册</h3>
          <button class="modal-close" @click="closeRegisterModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleRegister" class="auth-form">
            <div class="form-group">
              <label for="register-username">用户名</label>
              <input 
                type="text" 
                id="register-username"
                v-model="registerForm.username" 
                placeholder="请输入用户名"
                required
              >
            </div>
            <div class="form-group">
              <label for="register-email">邮箱</label>
              <input 
                type="email" 
                id="register-email"
                v-model="registerForm.email" 
                placeholder="请输入邮箱地址"
                required
              >
            </div>
            <div class="form-group password-group">
              <label for="register-password">密码</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showRegisterPassword ? 'text' : 'password'" 
                  id="register-password"
                  v-model="registerForm.password" 
                  placeholder="请输入密码（至少6位）"
                  required
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showRegisterPassword = !showRegisterPassword"
                  tabindex="-1"
                >
                  <i :class="showRegisterPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="form-group password-group">
              <label for="register-confirm">确认密码</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showRegisterConfirmPassword ? 'text' : 'password'" 
                  id="register-confirm"
                  v-model="registerForm.confirmPassword" 
                  placeholder="请再次输入密码"
                  required
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showRegisterConfirmPassword = !showRegisterConfirmPassword"
                  tabindex="-1"
                >
                  <i :class="showRegisterConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="isRegistering">
              <i v-if="isRegistering" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-user-plus"></i>
              {{ isRegistering ? '注册中...' : '注册' }}
            </button>
          </form>
          <div class="auth-switch">
            已有账号？<a href="javascript:void(0)" @click.prevent="switchToLogin">立即登录</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 忘记密码模态框 -->
    <div v-if="showForgotPasswordModal" class="modal-overlay" @mousedown="handleOverlayMouseDown($event, 'forgot')" @mouseup="handleOverlayMouseUp($event, 'forgot')">
      <div class="modal-content auth-modal" @mousedown.stop @mouseup.stop>
        <div class="modal-header">
          <h3>忘记密码</h3>
          <button class="modal-close" @click="closeForgotPasswordModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleForgotPassword" class="auth-form">
            <div class="form-group">
              <label for="forgot-username">用户名</label>
              <input 
                type="text" 
                id="forgot-username"
                v-model="forgotPasswordForm.username" 
                placeholder="请输入用户名"
                required
              >
            </div>
            <div class="form-group password-group">
              <label for="forgot-new-password">新密码</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showForgotNewPassword ? 'text' : 'password'" 
                  id="forgot-new-password"
                  v-model="forgotPasswordForm.newPassword" 
                  placeholder="请输入新密码（至少6位）"
                  required
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showForgotNewPassword = !showForgotNewPassword"
                  tabindex="-1"
                >
                  <i :class="showForgotNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="form-group password-group">
              <label for="forgot-confirm-password">确认新密码</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showForgotConfirmPassword ? 'text' : 'password'" 
                  id="forgot-confirm-password"
                  v-model="forgotPasswordForm.confirmPassword" 
                  placeholder="请再次输入新密码"
                  required
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showForgotConfirmPassword = !showForgotConfirmPassword"
                  tabindex="-1"
                >
                  <i :class="showForgotConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="isForgotPassword">
              <i v-if="isForgotPassword" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-key"></i>
              {{ isForgotPassword ? '修改中...' : '确认修改' }}
            </button>
          </form>
          <div class="auth-switch">
            想起密码了？<a href="javascript:void(0)" @click.prevent="switchToLogin">返回登录</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码模态框 -->
    <div v-if="showChangePasswordModal" class="modal-overlay" @mousedown="handleOverlayMouseDown($event, 'change')" @mouseup="handleOverlayMouseUp($event, 'change')">
      <div class="modal-content auth-modal" @mousedown.stop @mouseup.stop>
        <div class="modal-header">
          <h3>修改密码</h3>
          <button class="modal-close" @click="closeChangePasswordModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleChangePassword" class="auth-form">
            <div class="form-group password-group">
              <label for="old-password">旧密码</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showChangeOldPassword ? 'text' : 'password'" 
                  id="old-password"
                  v-model="changePasswordForm.oldPassword" 
                  placeholder="请输入当前密码"
                  required
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showChangeOldPassword = !showChangeOldPassword"
                  tabindex="-1"
                >
                  <i :class="showChangeOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="form-group password-group">
              <label for="new-password">新密码</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showChangeNewPassword ? 'text' : 'password'" 
                  id="new-password"
                  v-model="changePasswordForm.newPassword" 
                  placeholder="请输入新密码（至少6位）"
                  required
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showChangeNewPassword = !showChangeNewPassword"
                  tabindex="-1"
                >
                  <i :class="showChangeNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="form-group password-group">
              <label for="confirm-new-password">确认新密码</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showChangeConfirmPassword ? 'text' : 'password'" 
                  id="confirm-new-password"
                  v-model="changePasswordForm.confirmNewPassword" 
                  placeholder="请再次输入新密码"
                  required
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showChangeConfirmPassword = !showChangeConfirmPassword"
                  tabindex="-1"
                >
                  <i :class="showChangeConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="isChangingPassword">
              <i v-if="isChangingPassword" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-key"></i>
              {{ isChangingPassword ? '修改中...' : '确认修改' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register, updatePassword, forgotPassword } from '../api/user'

export default {
  name: 'AuthModal',
  props: {
    showLoginModal: {
      type: Boolean,
      default: false
    },
    showRegisterModal: {
      type: Boolean,
      default: false
    },
    showChangePasswordModal: {
      type: Boolean,
      default: false
    },
    showForgotPasswordModal: {
      type: Boolean,
      default: false
    },
    currentUsername: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoggingIn: false,
      isRegistering: false,
      isChangingPassword: false,
      isForgotPassword: false,
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      changePasswordForm: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      forgotPasswordForm: {
        username: '',
        newPassword: '',
        confirmPassword: ''
      },
      // 用于跟踪鼠标按下位置
      mouseDownOnOverlay: {
        login: false,
        register: false,
        forgot: false,
        change: false
      },
      // 显示密码状态
      showLoginPassword: false,
      showRegisterPassword: false,
      showRegisterConfirmPassword: false,
      showForgotNewPassword: false,
      showForgotConfirmPassword: false,
      showChangeOldPassword: false,
      showChangeNewPassword: false,
      showChangeConfirmPassword: false
    }
  },
  methods: {
    // 处理遮罩层鼠标按下事件
    handleOverlayMouseDown(e, modalType) {
      // 检查点击是否在模态框内容区域外（即遮罩层上）
      const modalContent = e.currentTarget.querySelector('.modal-content');
      if (modalContent) {
        const rect = modalContent.getBoundingClientRect();
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        // 检查点击是否在模态框内容区域外
        const isOutsideContent = (
          clickX < rect.left ||
          clickX > rect.right ||
          clickY < rect.top ||
          clickY > rect.bottom
        );
        
        if (isOutsideContent) {
          this.mouseDownOnOverlay[modalType] = true;
        }
      }
    },
    
    // 处理遮罩层鼠标释放事件
    handleOverlayMouseUp(e, modalType) {
      // 只有当按下和释放都在遮罩层上时，才关闭弹窗
      if (this.mouseDownOnOverlay[modalType]) {
        const modalContent = e.currentTarget.querySelector('.modal-content');
        if (modalContent) {
          const rect = modalContent.getBoundingClientRect();
          const clickX = e.clientX;
          const clickY = e.clientY;
          
          // 检查释放是否也在模态框内容区域外
          const isOutsideContent = (
            clickX < rect.left ||
            clickX > rect.right ||
            clickY < rect.top ||
            clickY > rect.bottom
          );
          
          if (isOutsideContent) {
            // 关闭对应的模态框
            switch(modalType) {
              case 'login':
                this.closeLoginModal();
                break;
              case 'register':
                this.closeRegisterModal();
                break;
              case 'forgot':
                this.closeForgotPasswordModal();
                break;
              case 'change':
                this.closeChangePasswordModal();
                break;
            }
          }
        }
      }
      // 重置状态
      this.mouseDownOnOverlay[modalType] = false;
    },
    
    // 关闭登录模态框
    closeLoginModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.$emit('close-login');
      // 清空表单
      this.loginForm = {
        username: '',
        password: '',
        remember: false
      };
      // 保持显示密码状态，不清空
    },
    
    // 从本地存储加载记住的信息（使用 localStorage）
    loadRememberedInfo() {
      try {
        const rememberedData = localStorage.getItem('rememberedLoginInfo');
        if (rememberedData) {
          const data = JSON.parse(rememberedData);
          if (data.remember) {
            // 如果之前勾选了记住我，填充表单
            this.loginForm.username = data.username || '';
            this.loginForm.password = data.password || '';
            this.loginForm.remember = true;
          } else {
            // 如果没有勾选，清空表单
            this.loginForm = {
              username: '',
              password: '',
              remember: false
            };
          }
        } else {
          // 没有记住的信息，清空表单
          this.loginForm = {
            username: '',
            password: '',
            remember: false
          };
        }
      } catch (error) {
        console.error('加载记住信息失败:', error);
        // 出错时清空表单
        this.loginForm = {
          username: '',
          password: '',
          remember: false
        };
      }
    },
    
    // 关闭注册模态框
    closeRegisterModal() {
      this.$emit('close-register');
      this.registerForm = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
      // 保持显示密码状态，不清空
    },
    
    // 切换到注册
    switchToRegister(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.$emit('switch-to-register');
    },
    
    // 切换到登录
    switchToLogin(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.$emit('switch-to-login');
    },
    
    // 切换到忘记密码
    switchToForgotPassword(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.$emit('switch-to-forgot-password');
    },
    
    // 关闭忘记密码模态框
    closeForgotPasswordModal() {
      this.$emit('close-forgot-password');
      this.forgotPasswordForm = {
        username: '',
        newPassword: '',
        confirmPassword: ''
      };
      // 保持显示密码状态，不清空
    },
    
    // 处理忘记密码
    async handleForgotPassword() {
      if (!this.forgotPasswordForm.username || !this.forgotPasswordForm.newPassword || !this.forgotPasswordForm.confirmPassword) {
        this.showToast('请填写完整信息', 'error');
        return;
      }
      
      if (this.forgotPasswordForm.newPassword !== this.forgotPasswordForm.confirmPassword) {
        this.showToast('两次输入的新密码不一致', 'error');
        return;
      }
      
      if (this.forgotPasswordForm.newPassword.length < 6) {
        this.showToast('密码长度不能少于6位', 'error');
        return;
      }
      
      this.isForgotPassword = true;
      
      try {
        // 调用后端API
        const response = await forgotPassword(
          this.forgotPasswordForm.username,
          this.forgotPasswordForm.newPassword
        );
        
        if (response.success) {
          this.closeForgotPasswordModal();
          this.showToast('密码修改成功！请使用新密码登录', 'success');
          // 自动切换到登录页面
          setTimeout(() => {
            this.$emit('switch-to-login');
          }, 1500);
        } else {
          this.showToast(response.message || '密码修改失败', 'error');
        }
      } catch (error) {
        console.error('忘记密码失败:', error);
        this.showToast('修改密码失败，请重试', 'error');
      } finally {
        this.isForgotPassword = false;
      }
    },
    
    // 处理登录
    async handleLogin() {
      if (!this.loginForm.username || !this.loginForm.password) {
        this.showToast('请填写完整信息', 'error');
        return;
      }
      
      this.isLoggingIn = true;
      
      try {
        // 调用后端API
        const response = await login(this.loginForm.username, this.loginForm.password);
        
        if (response.success) {
          const userInfo = {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            remember: this.loginForm.remember
          };
          
          // 保存或清除记住的信息到本地存储（localStorage）
          try {
            if (this.loginForm.remember) {
              // 如果勾选了记住我，保存到 localStorage
              const rememberData = {
                username: this.loginForm.username,
                password: this.loginForm.password,
                remember: true
              };
              localStorage.setItem('rememberedLoginInfo', JSON.stringify(rememberData));
            } else {
              // 如果没有勾选，清除本地存储
              localStorage.removeItem('rememberedLoginInfo');
            }
          } catch (error) {
            console.error('保存记住信息失败:', error);
            // 不影响登录流程，只记录错误
          }
          
          // 先触发登录成功事件
          this.$emit('login-success', userInfo);
          
          // 延迟关闭模态框，确保事件已处理
          this.$nextTick(() => {
            this.closeLoginModal();
            this.showToast('登录成功！', 'success');
          });
        } else {
          this.showToast(response.message || '用户名或密码错误', 'error');
        }
      } catch (error) {
        console.error('登录失败:', error);
        this.showToast('登录失败，请重试', 'error');
      } finally {
        this.isLoggingIn = false;
      }
    },
    
    // 处理注册
    async handleRegister() {
      if (!this.registerForm.username || !this.registerForm.email || !this.registerForm.password) {
        this.showToast('请填写完整信息', 'error');
        return;
      }
      
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.showToast('两次输入的密码不一致', 'error');
        return;
      }
      
      if (this.registerForm.password.length < 6) {
        this.showToast('密码长度不能少于6位', 'error');
        return;
      }
      
      this.isRegistering = true;
      
      try {
        // 调用后端API
        const response = await register(
          this.registerForm.username,
          this.registerForm.email,
          this.registerForm.password
        );
        
        if (response.success) {
          const userInfo = {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email
          };
          
          this.$emit('register-success', userInfo);
          this.closeRegisterModal();
          this.showToast('注册成功！欢迎加入成都理工大学数字记忆平台', 'success');
        } else {
          this.showToast(response.message || '注册失败', 'error');
        }
      } catch (error) {
        console.error('注册失败:', error);
        this.showToast('注册失败，请重试', 'error');
      } finally {
        this.isRegistering = false;
      }
    },
    
    // 关闭修改密码模态框
    closeChangePasswordModal() {
      this.$emit('close-change-password');
      this.changePasswordForm = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      };
      // 保持显示密码状态，不清空
    },
    
    // 处理修改密码
    async handleChangePassword() {
      if (!this.changePasswordForm.oldPassword || !this.changePasswordForm.newPassword || !this.changePasswordForm.confirmNewPassword) {
        this.showToast('请填写完整信息', 'error');
        return;
      }
      
      if (this.changePasswordForm.newPassword !== this.changePasswordForm.confirmNewPassword) {
        this.showToast('两次输入的新密码不一致', 'error');
        return;
      }
      
      if (this.changePasswordForm.newPassword.length < 6) {
        this.showToast('密码长度不能少于6位', 'error');
        return;
      }
      
      this.isChangingPassword = true;
      
      try {
        // 调用后端API
        const response = await updatePassword(
          this.currentUsername,
          this.changePasswordForm.oldPassword,
          this.changePasswordForm.newPassword
        );
        
        if (response.success) {
          this.$emit('password-change-success');
          this.closeChangePasswordModal();
          this.showToast('密码修改成功！', 'success');
        } else {
          this.showToast(response.message || '密码修改失败', 'error');
        }
      } catch (error) {
        console.error('修改密码失败:', error);
        this.showToast('修改密码失败，请重试', 'error');
      } finally {
        this.isChangingPassword = false;
      }
    },
    
    // 显示提示信息
    showToast(message, type = 'info') {
      // 创建提示元素
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      
      // 添加样式
      Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'
      });
      
      document.body.appendChild(toast);
      
      // 显示动画
      setTimeout(() => {
        toast.style.transform = 'translateX(0)';
      }, 100);
      
      // 自动隐藏
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (toast.parentNode) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 3000);
    }
  },
  watch: {
    // 监听登录模态框的显示状态
    showLoginModal(newVal) {
      if (newVal) {
        // 当登录模态框打开时，从数据库加载记住的信息
        this.loadRememberedInfo();
      }
    }
  }
}
</script>

<style scoped>
/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

.auth-modal {
  max-width: 400px;
  width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 25px;
}

.auth-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.password-group {
  position: relative;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
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

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.checkbox-label a {
  color: #4a90e2;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.forgot-password {
  color: #4a90e2;
  text-decoration: none;
  font-size: 13px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #357abd;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.auth-switch {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.auth-switch a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.auth-switch a:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>