<template>
  <div class="home-box">
    <div class="name">首页</div>
    <router-link to="/test1">test1</router-link>
    <router-link to="/test2">test2</router-link>
    <el-button type="primary" :loading="exportLoading" @click="handleExport">导出</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { exportData } from '@/api/home'

const exportLoading = ref(false)
function handleExport() {
  exportLoading.value = true
  exportData({
    ids: [3, 2, 1],
    org_id: 60
  }).then(() => {
    exportLoading.value = false
  })
}
</script>

<style lang="scss">
.home-box {
  .name {
    color: red;
  }
}
</style>
