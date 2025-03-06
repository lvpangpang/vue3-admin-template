<template>
  <div v-if="needRender">
    <!-- 当前route children长度为1 或 没有children -->
    <template v-if="hasOneShowingChild(item.children, item) && onlyOneChild.noShowingChildren">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :icon="onlyOneChild.meta.icon" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 当前route 至少有两个子route -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item :icon="item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
// import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    // route对象
    item: {
      type: Object,
      required: true
    },
    // route是否是嵌套的，存在多个子菜单时为true
    isNest: {
      type: Boolean,
      default: false
    },
    // 当前route的 base路径
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    return {}
  },
  computed: {
    ...mapGetters(['roles']),
    needRender: function () {
      const hasMeta = 'meta' in this.item // 有meta
      const metaIsHidden = hasMeta && this.item.meta.hidden // meta.hidden 为true
      return !metaIsHidden
    }
  },
  methods: {
    /**
     * 当前节点有且只有一个showing children
     */
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.length > 0 ? children.filter(item => !item.meta.hidden) : []
      const showingChildrenLength = showingChildren.length

      if (showingChildrenLength > 1) {
        return false
      }

      // When there is only one child router, the child router is displayed by default
      if (showingChildrenLength === 1) {
        const parentNoShowingChildren = 'noShowingChildren' in parent ? parent.noShowingChildren : true
        this.onlyOneChild = showingChildren[0] // Temp set(will be used if only has one showing child)
        if (Array.isArray(this.onlyOneChild.children)) {
          const len = this.onlyOneChild.children.filter(item => !item.meta.hidden).length
          if (len === 0) {
            this.onlyOneChild.noShowingChildren = parentNoShowingChildren
          } else {
            this.onlyOneChild.noShowingChildren = false
          }
        } else {
          this.onlyOneChild.noShowingChildren = parentNoShowingChildren
        }
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildrenLength === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
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
    }
  }
}
</script>
