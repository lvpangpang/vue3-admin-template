<template>
  <div class="home-box app-container">
    <div class="name">欢迎来到我的空间</div>
    <!-- <el-button type="primary" :loading="exportLoading" @click="handleExport">导出</el-button> -->
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
  padding: 10px;
}
</style>
