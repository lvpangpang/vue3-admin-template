<template>
  <div class="has-logo">
    <logo :collapse="!sidebar.opened" />
    <div class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="!sidebar.opened"
        background-color="#2c2c2c"
        text-color="#a1a3a9"
        active-text-color="#fff"
      >
        <sidebar-item v-for="route in menu[0].children" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import useUserStore from '@/stores/user'
import useAppStore from '@/stores/app'
import Logo from './Logo'
import SidebarItem from './SidebarItem.vue'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(useUserStore, ['menu']),
    ...mapState(useAppStore, ['sidebar']),
    activeMenu() {
      const { meta, path } = this.$route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return !path.endsWith('/') ? path : path.substring(0, path.length - 1)
    }
  }
}
</script>
