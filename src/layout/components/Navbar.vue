<template>
  <div class="navbar">
    <div class="left-menu">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    </div>
    <div class="right-menu"></div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import useAppStore from '@/stores/app'
import Hamburger from './Hamburger'

export default {
  components: {
    Hamburger
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
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  .left-menu {
    padding: 10px 0;
  }
}
</style>
