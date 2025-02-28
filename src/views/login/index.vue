<template>
  <div
    v-loading="loginLoading"
    element-loading-text="登录中"
    class="login-page dl-flex-c dl-flex-jc-center"
    :style="{ 'background-image': 'url(' + background + ')' }"
  >
    <div class="login-container dl-flex dl-flex-jc-center">
      <div class="login-title">
        <span>{{ title }}</span>
      </div>
      <div class="login-container-left" :style="{ 'background-image': 'url(' + logo + ')' }"></div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        :class="['dl-form login-form', hasMutiTenant ? 'has-three-form' : '']"
        hide-required-asterisk
        auto-complete="on"
        label-position="left"
      >
        <div class="login-form-title">欢迎登录</div>

        <el-form-item prop="username" label="账号">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          >
            <template slot="prepend">
              <svg-icon icon-class="user" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password" label="密码" class="form-pwd">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          >
            <template slot="prepend">
              <svg-icon icon-class="password" />
            </template>
            <template slot="append">
              <span style="cursor: pointer" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item class="remember-username">
          <el-checkbox v-model="rememberUsername">记住登录名</el-checkbox>
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          class="dl-button dl-button-primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
      </el-form>
    </div>
    <div class="platform-information">
      <span>{{ copyright || '' }}</span>
      <el-divider v-if="copyright && recordNumber" direction="vertical" />
      <el-link :href="recordLink" target="_blank">{{ recordNumber || '' }}</el-link>
      <el-divider v-if="recordNumber && networkSecurityNumber" direction="vertical" />
      <el-divider v-if="!recordNumber && copyright && networkSecurityNumber" direction="vertical" />
      <el-link :href="networkSecurityLink" target="_blank">{{
        networkSecurityNumber || ''
      }}</el-link>
    </div>
  </div>
</template>

<script>
import { getConfig } from '@/api/user'
import { removeSecurityToken, setToken } from '@/utils/auth'
import encrypt from '@/utils/encrypt'
import { login } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度至少为六位'))
      } else {
        callback()
      }
    }
    const validateTenant = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择企业'))
      } else {
        callback()
      }
    }
    const loginRules = Object.freeze({
      username: [{ required: true, trigger: ['blur', 'change'], validator: validateUsername }],
      password: [{ required: true, trigger: ['blur', 'change'], validator: validatePassword }],
      tenant: [{ required: true, trigger: ['blur', 'change'], validator: validateTenant }],
    })
    return {
      // background: require('@/assets/images/login/background.png'),
      // logo: require('@/assets/images/login/info.png'),
      loginForm: {
        username: '',
        password: '',
      },
      loginRules,
      loading: false,
      passwordType: 'password',
      rememberUsername: false,
      redirect: undefined,
      copyright: null,
      recordNumber: null,
      recordLink: null,
      networkSecurityNumber: null,
      networkSecurityLink: null,
      loginLoading: false,
      tenantList: [],
      showLoginBtn: false,
    }
  },
  computed: {
    // ...mapGetters(['title']),
    hasMutiTenant: function () {
      return this.tenantList.length > 1
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      getConfig().then((res) => {
        if (res.data.length > 0) {
          const configs = {}
          res.data.forEach((i) => {
            configs[i.name] = i.data
          })
          this.copyright = configs['copyright']
          this.recordNumber = configs['recordNumber']
          this.recordLink = configs['recordLink']
          this.networkSecurityNumber = configs['networkSecurityNumber']
          this.networkSecurityLink = configs['networkSecurityLink']
          this.logo = configs['logo'] || this.logo
          this.background = configs['background'] || this.background
          sessionStorage.setItem('configs', JSON.stringify(configs))
          const title = configs['name']
          document.title = title
          localStorage.setItem('title', title)
          localStorage.setItem('icon-theme', configs.icon)
        }
      })
      const username = localStorage.getItem('dlAttendanceUsername')
      if (username) {
        this.loginForm.username = username
        this.rememberUsername = true
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.loading = true
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.rememberUsername) {
            localStorage.setItem('dlAttendanceUsername', this.loginForm.username)
          } else {
            localStorage.removeItem('dlAttendanceUsername')
          }
          const params = {
            username: this.loginForm.username.trim(),
            password: encrypt(this.loginForm.password),
          }
          login(params)
            .then((res) => {
              const { access_token, expired_in } = res.data
              setToken(access_token, expired_in)
            })
            .then(() => {
              this.$router.push({ path: '/' })
              this.loading = false
              removeSecurityToken() // 清空安全数据token
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.loading = false
        }
      })
    },
  },
}
</script>

<style lang="scss">
.platform-information {
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translate(-50%, 50%);
  font-size: 14px;
  color: #666666;
  .el-divider--vertical {
    background: #666;
  }
  .el-link--inner {
    font-size: 14px;
    font-weight: 400;
    color: #666;
    &:hover {
      color: #3662ec;
    }
  }
}
@media screen and (max-height: 700px) {
  .platform-information {
    bottom: 15px;
  }
}
</style>
