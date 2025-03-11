<template>
  <div class="navbar">
    <div class="left-menu">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb class="breadcrumb-container" />
    </div>
    <div class="right-menu"></div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import useAppStore from '@/stores/app'
import Hamburger from './Hamburger'
import Breadcrumb from './Breadcrumb'

export default {
  components: {
    Hamburger,
    Breadcrumb
  },
  computed: {
    ...mapState(useAppStore, ['sidebar'])
  },
  methods: {
    toggleSideBar() {
      useAppStore().toggleSideBar()
    }
  }
}
</script>

<style lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  .left-menu {
    padding: 12px 0;
    .hamburger-container {
      display: inline-block;
      vertical-align: middle;
    }
    .breadcrumb-container {
      display: inline-block;
      vertical-align: middle;
      width: auto !important;
    }
  }
}
</style>
