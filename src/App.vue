<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { getToken } from '@/utils/auth'

onMounted(() => {
})
</script>
