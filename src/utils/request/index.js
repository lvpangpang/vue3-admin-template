import axios from 'axios'
import { ElMessage } from 'element-plus'
import requestConfig from './config'
import { getToken, removeToken } from '../auth'
import { getSignature } from './signature'
import { getFileName, downloadFile } from './download'

const { timeout, independentBaseUrl } = requestConfig
console.log(import.meta.env.VITE_BASE_URL)
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
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
    const res = response.data
    const { code } = res
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
      const isBlob = toString.call(res) === '[object Blob]'
      if (res) {
        if (isBlob) {
          downloadFile(new Blob([res], { type: response.headers['content-type'] }), decodeURI(getFileName(response.headers['content-disposition'])))
        }
      }
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
