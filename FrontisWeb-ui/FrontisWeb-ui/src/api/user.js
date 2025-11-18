import api from './axios'

/**
 * 用户登录
 */
export const login = (username, password) => {
  return api.post('/user/login', { username, password })
}

/**
 * 用户注册
 */
export const register = (username, email, password) => {
  return api.post('/user/register', { username, email, password })
}

/**
 * 重置密码
 */
export const resetPassword = (email, newPassword) => {
  return api.post('/user/resetPassword', { email, newPassword })
}

/**
 * 修改密码
 */
export const updatePassword = (username, oldPassword, newPassword) => {
  return api.post('/user/updatePassword', { username, oldPassword, newPassword })
}

/**
 * 忘记密码
 */
export const forgotPassword = (username, newPassword) => {
  return api.post('/user/forgotPassword', { username, newPassword })
}

/**
 * 修改邮箱
 */
export const updateEmail = (username, newEmail) => {
  return api.post('/user/updateEmail', { username, newEmail })
}

