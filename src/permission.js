import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import useUserStore from '@/stores/user'

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
    const userStore = useUserStore()
    if (!userStore.userInfo.id) {
      await userStore.getInfo()
      await userStore.getMenu()
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
