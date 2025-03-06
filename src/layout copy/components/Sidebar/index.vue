<template>
  <div :class="[showLogo ? 'has-logo' : '']">
    <logo v-if="showLogo" :collapse="!sidebar.opened" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="!sidebar.opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
      >
        <sidebar-item v-for="route in sidebar_routes" :key="route.path" :item="route" :base-path="route.path" />
        <!-- <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" /> -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'roles', 'sidebar_routes']),
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
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    }
  }
}
</script>
