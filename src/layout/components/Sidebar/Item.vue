<template>
  <span>
    <el-icon v-if="icon"><Folder /></el-icon>
    <span slot="title">{{ title }}</span>
  </span>
</template>

<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
