<template>
  <section class="app-main">
    <router-view />
  </section>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>

<style scoped>
.app-main {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding-top: 60px; /* 85px */
  background: #eff2f5;
}
.fixed-header + .app-main {
  padding-bottom: 10px;
}
</style>
