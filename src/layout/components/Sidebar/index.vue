<template>
  <div class="has-logo">
    <logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        background-color="#2c2c2c"
        text-color="#a1a3a9"
        active-text-color="#fff"
      >
        <sidebar-item v-for="route in menu[0].children" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { mapState } from 'pinia'
import Logo from './Logo'
import SidebarItem from './SidebarItem.vue'
import { useUserStore } from '@/stores/user'

export default {
  components: { SidebarItem, Logo },
  computed: {
    // ...mapGetters(['sidebar', 'roles', 'sidebar_routes']),
    ...mapState(useUserStore, ['menu']),
    routes() {
      const { routes } = this.$router.options
      return routes
    },
    activeMenu() {
      const { meta, path } = this.$route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return !path.endsWith('/') ? path : path.substring(0, path.length - 1)
    },
    showLogo() {
      // return this.$store.state.settings.sidebarLogo
    }
  },
  mounted() {
    console.log(useUserStore().menu[0].children)
  }
}
</script>
