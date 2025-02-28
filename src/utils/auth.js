import Cookies from 'js-cookie'
import dayjs from 'dayjs'

const beforeExpireTime = 10 * 60 * 1000 // min
const TokenKey = 'dl_token'
const TokenExpireKey = 'dl_token_expire'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expires) {
  Cookies.set(TokenExpireKey, expires)
  return Cookies.set(TokenKey, token, { expires: new Date(expires) })
}

export function removeToken() {
  Cookies.remove(TokenExpireKey)
  return Cookies.remove(TokenKey)
}

export function needRefreshToken() {
  const hasToken = !!getToken()
  if (hasToken) {
    const currentTime = dayjs(new Date()).unix() * 1000
    const expireTime = dayjs(Cookies.get(TokenExpireKey)).unix() * 1000
    return currentTime + beforeExpireTime >= expireTime
  } else {
    return false
  }
}

// 加密数据token
const SecurityTokenKey = 'dl_security_token'
export function getSecurityToken() {
  return Cookies.get(SecurityTokenKey)
}
export function setSecurityToken(token, expires) {
  return Cookies.set(SecurityTokenKey, token, { expires })
}
export function removeSecurityToken() {
  return Cookies.remove(SecurityTokenKey)
}
