<template>
  <div class="app-wrapper clearfix">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Sidebar, Navbar, AppMain } from './components'
// import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'LayoutIndex',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  // mixins: [ResizeMixin],
  computed: {
    // sidebar() {
    //   return this.$store.state.app.sidebar
    // },
    // device() {
    //   return this.$store.state.app.device
    // },
    // fixedHeader() {
    //   return this.$store.state.settings.fixedHeader
    // },
    // classObj() {
    //   return {
    //     hideSidebar: !this.sidebar.opened,
    //     openSidebar: this.sidebar.opened,
    //     withoutAnimation: this.sidebar.withoutAnimation
    //   }
    // }
  },
  methods: {
    handleClickOutside() {
      // this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - #{$hideSideBarWidth});
}

.mobile .fixed-header {
  width: 100%;
}
</style>
