import service from '@/utils/request/index'

/**
 * 登录
 * @param {*} data
 * @returns
 */
export function login(data) {
  return service.post('/admin-module/auth/login', data)
}

export function authLogin(data) {
  return service.post('/admin-module/auth/oauth', data, false)
}

/**
 * 获取用户信息
 * @returns
 */
export function getInfo() {
  return service.post('/admin-module/auth/profile', {}, false)
}

/**
 * 获取菜单
 * @returns
 */
export function getMenu(data) {
  return service.post('/admin-module/account/slugMenu', data)
}

/**
 * 刷新token
 * @returns
 */
export function refreshAuth() {
  return service.post('/admin-module/auth/refresh', false)
}

/**
 * 登出
 * @returns
 */
export function logout() {
  return service.post('/admin-module/auth/logout')
}

/**
 * 修改密码
 * @param {*} data
 * @returns
 */
export function postAuthPassword(data) {
  return service.post('/admin-module/auth/password', data, false)
}

/**
 * 获取全局配置文件
 * @param {*} data
 * @returns
 */
export function getConfig() {
  return service.post('/center-module/config/list', {}, false)
}


