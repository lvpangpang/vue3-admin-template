<!-- <template>
  <div class="sidebar-logo" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <a key="expand" class="sidebar-logo-link" href="javascript:void(0);">
        <img src="@/assets/images/favicon1.png" alt="" @click="jumpToHome" />
        <div class="content-div">
          <h1 class="sidebar-title" @click="jumpToHome">
            {{ title }}
          </h1>
          <span class="sidebar-title-small" @click="jumpToHome"> {{ titleSmall }} </span>
        </div>
      </a>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { moduleIconBgcConfig } from '@/utils/moduleConfig'
import { isAuthEnv } from '@/utils'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      moduleIconBgcConfig,
      titleSmall: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'title'])
  },
  mounted() {
    this.showTitle()
  },
  methods: {
    showTitle() {
      const currentUrl = window.location.href
      const dataIndex = Object.keys(moduleIconBgcConfig).find(e => currentUrl.includes(e))
      if (dataIndex) {
        this.titleSmall = moduleIconBgcConfig[dataIndex].title
      } else {
        this.titleSmall = ''
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    jumpToHome() {
      const needGoHome = !isAuthEnv()
      needGoHome && history.pushState(null, '', '/home')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  background: $menuBg;
  text-align: center;
  overflow: hidden;

  &-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-top: 5px;
      margin-right: 12px;
    }
    img {
      width: 36px;
      height: 36px;
      margin-right: 8px;
      vertical-align: middle;
    }
    .content-div {
      display: inline-block;
      position: relative;
      bottom: 8px;
      .sidebar-title {
        display: inline-block;
        margin: 0;
        color: #fff;
        font-weight: 600;
        padding-top: 5px;
        line-height: 50px;
        font-size: 16px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
        span {
          font-size: 14px;
        }
      }
      .sidebar-title-small {
        color: #93959a;
        font-size: 14px;
        position: absolute;
        left: 23%;
        top: 24px;
      }
    }

    & .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: right;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: black;
      }
    }
  }
}

.collapse {
  .hamburger-container {
    width: 100%;
  }
}
</style> -->


<script>
export default {}
</script>