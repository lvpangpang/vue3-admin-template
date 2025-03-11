import { defineStore } from 'pinia'
import { getInfo, getMenu } from '@/api/user'

const useUserStore = defineStore('user', {
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
      return getMenu({ slug: 'energy' }).then((res) => {
        this.menu = res.data
      })
    },
  },
})

export default useUserStore
