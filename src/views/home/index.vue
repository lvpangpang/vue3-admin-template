<template>
  <div class="home-box">
    <div class="name">首页</div>
    <router-link to='/test1'>test1</router-link>
    <router-link to='/test2'>test2</router-link>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

</script>

<style lang="scss">
.home-box {
  .name {
    color: red;
  }
}
</style>
