import { defineStore } from 'pinia'
import { getInfo, getMenu } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {},
      menu: []
    }
  },
  actions: {
    getInfo() {
      return getInfo().then((res) => {
        this.userInfo = res.data
      })
    },
    getMenu() {
      return getMenu({ slug: 'park' }).then((res) => {
        this.menu = res.data
      })
    },
  },
})
