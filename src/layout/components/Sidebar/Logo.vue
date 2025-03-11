<template>
  <div class="sidebar-logo">XX管理系统</div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  }
}
</script>

<style lang="scss">
.sidebar-logo {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  background: #2c2c2c;
  text-align: center;
  overflow: hidden;
  color: #fff;
  font-size: 22px;
}
</style>
