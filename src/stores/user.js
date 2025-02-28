import { defineStore } from 'pinia'
import { login } from '@/api/user'
import { setToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: '',
      roles: '',
      userinfo: {},
      need_reset_password: false,
    }
  },
  actions: {
    login(data) {
      return login(data)
        .then((res) => {
          const { access_token, expired_in } = res.data
          setToken(access_token, expired_in)
        })
    },
    getUserInfo() {},
    getUserMenu() {}
  },
})
