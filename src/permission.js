import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to) => {
  NProgress.start()
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      return { name: 'home' }
    }
    // 判断有没有用户信息+菜单，没有则请求用户信息+菜单
    if (true) {
      console.log(1111111)
    }
  } else {
    if (!whiteList.includes(to.path)) {
      return { name: 'login' }
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
