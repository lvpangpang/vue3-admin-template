import axios from 'axios'
import { ElMessage } from 'element-plus'
import requestConfig from './config'
import { getToken, removeToken } from '../auth'
import { getSignature } from './signature'

const { timeout, independentBaseUrl } = requestConfig
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout,
})

service.interceptors.request.use(
  (config) => {
    const { url, data, params } = config
    const timestamp = Date.parse(new Date()) / 1000

    if (independentBaseUrl.includes(url)) {
      config.baseURL = '/'
    }

    config.headers['Authorization'] = 'Bearer ' + getToken()

    const config_ = data || params || {}
    if (config_ instanceof FormData) {
      config_.append('timestamp', timestamp)
    }

    // 参数签名
    if (import.meta.env.VITE_IS_SIGNATURE) {
      const signatureParams = {
        ...config_,
        timestamp,
      }
      config.params = {
        timestamp,
        sign: getSignature(config.url, signatureParams),
        ...config.params,
      }
    }

    return config
  },
  (err) => {
    return err
  },
)

service.interceptors.response.use(
  (response) => {
    const { config } = response
    const res = response.data
    const { code } = res
    console.log(code)
    if (code) {
      if (code === 200) {
        return res
      }
      if (code === 401) {
        removeToken()
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
      ElMessage({
        message: res.message,
        type: 'error',
        duration: 3 * 1000,
      })
      return Promise.reject(res)
    } else {
      // 导出文件直接抛出，后续用独立的处理函数处理
      return res
    }
  },
  (error) => {
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 3 * 1000,
    })
    return Promise.reject(error)
  },
)

export default service
