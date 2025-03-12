<template>
  <!-- 当前route children长度为1 或 没有children -->
  <template v-if="hasOneShowingChild(item.children, item) && onlyOneChild.noShowingChildren">
    <app-link :to="resolvePath(onlyOneChild.path)">
      <el-menu-item :index="resolvePath(onlyOneChild.path)">
        <el-icon v-if="onlyOneChild.icon"><Folder /></el-icon>
        <template #title>{{ onlyOneChild.title }}</template>
      </el-menu-item>
    </app-link>
  </template>
  <!-- 当前route 至少有两个子route -->
  <el-sub-menu v-else :index="resolvePath(item.path)">
    <template #title>
      <el-icon v-if="item.icon"><Folder /></el-icon>
      <span>{{ item.title }}</span>
    </template>
    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-sub-menu>
</template>

<script>
import { isExternal } from '@/utils/validate'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    // route对象
    item: {
      type: Object,
      required: true,
    },
    // route是否是嵌套的，存在多个子菜单时为true
    isNest: {
      type: Boolean,
      default: false,
    },
    // 当前route的 base路径
    basePath: {
      type: String,
      default: '',
    },
  },
  data() {
    this.onlyOneChild = null // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    return {}
  },
  computed: {
    needRender: function () {
      const hasMeta = 'meta' in this.item // 有meta
      const metaIsHidden = hasMeta && this.item.hidden // meta.hidden 为true
      return !metaIsHidden
    },
  },
  methods: {
    /**
     * 当前节点有且只有一个showing children
     */
    hasOneShowingChild(children = [], item) {
      const showingChildren = children.length > 0 ? children.filter((item) => !item.hidden) : []
      const showingChildrenLength = showingChildren.length

      if (showingChildrenLength === 0) {
        this.onlyOneChild = { ...item, path: '', noShowingChildren: true }
        return true
      }

      // 只有一个需要显示的子菜单，提升处理（icon需要写在子菜单里面）
      if (showingChildrenLength === 1) {
        this.onlyOneChild = showingChildren[0]
        if (Array.isArray(this.onlyOneChild.children)) {
          const len = this.onlyOneChild.children.filter((item) => !item.hidden).length
          this.onlyOneChild.noShowingChildren = len === 0 ? true : false
        } else {
          this.onlyOneChild.noShowingChildren = true
        }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      if (routePath === '') {
        return this.basePath
      } else {
        let basePath_ = this.basePath
        if (!this.basePath.includes('/')) {
          basePath_ = '/' + this.basePath
        }
        let routePath_ = routePath
        if (!routePath.includes('/')) {
          routePath_ = '/' + routePath
          return basePath_ + routePath_
        } else {
          return routePath_
        }
      }
    },
  },
}
</script>
