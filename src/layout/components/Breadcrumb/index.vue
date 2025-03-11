<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
      <a @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      this.levelList = this.$route.matched.filter((item) => item.meta?.title)
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        return this.$router.push(redirect)
      }
      this.$router.push(this.pathCompile(path))
    },
  },
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  font-size: 14px;
  padding-top: 2px;
  display: flex;
  width: 100%;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }

  .notice {
    flex: 1;
    margin-left: 50px;
    margin-right: 60px;
    overflow: hidden;
    width: 100%;
    > div {
      margin-right: 50px;
      a {
        color: #cc0a0a;
      }
    }
  }

  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      a,
      span {
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }
  .el-breadcrumb__item:last-child {
    .el-breadcrumb__inner {
      a,
      span {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
}
</style>
