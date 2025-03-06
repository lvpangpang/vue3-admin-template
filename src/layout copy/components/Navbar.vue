<template>
  <div :class="['navbar', notInHome ? 'dl-flex dl-flex-jc-between' : 'in-home']" :style="{ background: notInHome ? '#fff' : '#2a7afb' }">
    <div v-if="rightMenuWidth > 0" class="left-menu dl-flex dl-flex-ai-center" :style="{ width: notInHome ? leftMenuWidth : 'auto' }">
      <span v-show="inHome">
        <slot name="platform-name-slot"></slot>
      </span>
      <hamburger v-if="notInHome" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb v-show="notInHome" class="breadcrumb-container" />
    </div>
    <div ref="rightMenu" class="right-menu dl-flex dl-flex-ai-center dl-flex-jc-end" :class="notInHome ? 'right-menu-nohome' : 'right-menu'">
      <div class="avatar-dropdown right-menu-item dl-flex dl-flex-ai-center" trigger="click">
        <div class="avatar-container dl-flex dl-flex-ai-center">
          <img src="@/assets/images/navbar-avatar.png" />
          <span :style="{ color: notInHome ? '#333333' : '#fff' }"> {{ name }} </span>
        </div>
      </div>
      <el-dropdown class="avatar-dropdown" trigger="hover" style="padding-left: 10px">
        <div class="avatar-container dl-flex dl-flex-ai-center" style="padding-right: 10px">
          <svg-icon class="svg-icon" :icon-class="inHome ? 'operation-reverse' : 'operation'" style="font-size: 20px; cursor: pointer" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <template v-if="changeRoleEnable2">
            <el-dropdown-item @click.native="handleChangeRole">
              <span style="display: block">{{ nextRoleName }}</span>
            </el-dropdown-item>
          </template>
          <template v-if="!authEnv">
            <el-dropdown-item v-if="inHome && userinfo && userinfo.tenants && userinfo.tenants.length > 1" @click.native="showModifyCompanyDialog">
              <span style="display: block">切换企业</span>
            </el-dropdown-item>
            <el-dropdown-item :divided="changeRoleEnable2 || (inHome && userinfo && userinfo.tenants && userinfo.tenants.length > 1)" @click.native="showModifyPasswordDialog">
              <span style="display: block">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </template>
          <el-dropdown-item v-else divided @click.native="refreshConfig">
            <span style="display: block">刷新</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="handlerAbout">
            <span style="display: block">关于</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-show="inHome" class="home-search-container dl-flex dl-flex-jc-center dl-flex-ai-center">
      <slot name="home-search-input"></slot>
    </div>
    <el-dialog
      class="dl-dialog update-password-dialog"
      title="修改密码"
      :visible.sync="modifyPwdVisible"
      :modal-append-to-body="false"
      :show-close="!need_reset_password"
      :close-on-click-modal="false"
      @close="resetform()"
    >
      <el-form ref="passwordForm" class="dl-form" :rules="rules" :model="passwordForm" label-position="top">
        <el-form-item label="旧密码" prop="password">
          <el-input v-model="passwordForm.password" class="dl-input" placeholder="请输入旧密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="passwordForm.new_password" class="dl-input" placeholder="请输入6位以上新密码" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPassword">
          <el-input v-model="passwordForm.confirmNewPassword" class="dl-input" placeholder="请确认新密码" show-password />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="need_reset_password" class="dl-button dl-button-cancel" icon="el-icon-circle-close" @click="logout"> 退 出 </el-button>
        <el-button v-show="!need_reset_password" class="dl-button dl-button-cancel" icon="el-icon-circle-close" @click="modifyPwdVisible = false"> 取 消 </el-button>
        <el-button type="primary" class="dl-button dl-button-primary" icon="el-icon-circle-check" :loading="passwordLoading" @click="updatePassword"> 确 定 </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="aboutDialogVisible" class="dl-dialog about-dialog" width="500px" :append-to-body="true">
      <div class="about">关于</div>
      <div class="dialog-bc">
        <img :src="inHome ? require('../../assets/images/about-slug.png') : chekAboutMsg.icon" alt="" />
        <div class="dialog-bc-span">
          <div v-if="inHome">
            <slot name="platform-name-slot" class="slot-name"></slot>
          </div>
          <div v-else>
            <span>{{ chekAboutMsg.title }}</span>
          </div>
          <span class="version">版本：{{ version }}_{{ time }}</span>
        </div>
      </div>
    </el-dialog>

    <!-- 切换企业 -->
    <el-dialog :visible.sync="modifyCompanyVisible" class="dl-dialog company-dialog" width="500px" :append-to-body="true" :close-on-click-modal="false" title="切换企业">
      <div v-if="userinfo" class="company-list">
        <div v-for="item in userinfo.tenants" :key="item.id" :class="['item']" @click="updateCompany(item.id)">
          <div class="company-logo">{{ item.name.slice(0, 1) }}</div>
          <div class="company-name">{{ item.name }}</div>
          <el-tag v-if="chooseCompany === item.id" effect="plain" size="mini" type="success" style="">当前</el-tag>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import watermark from '@/utils/watermark'
import { ScheduleControl } from '@/utils/schedule'
import { mapGetters } from 'vuex'
import { postAuthPassword, tenantLogin, getConfig } from '@/api/user'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import { encrypt, isAuthEnv } from '@/utils'
import { formatTimeStr } from '@/utils/dl-date'
import { getManagerRolesBySlug, getUserRolesBySlug } from '@/config/auth'
import { setToken } from '@/utils/auth'

const authEnv = isAuthEnv()

export default {
  components: {
    Hamburger,
    Breadcrumb
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.passwordForm.confirmNewPassword !== '') {
          this.$refs.passwordForm.validateField('confirmNewPassword')
        }
        if (value.length < 6) {
          callback(new Error('密码最小6位'))
        } else {
          if (value === this.passwordForm.password) {
            callback(new Error('旧密码和新密码一致'))
          } else {
            callback()
          }
        }
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      } else if (value !== this.passwordForm.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const rules = Object.freeze({
      password: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        { min: 6, message: '密码最小6位', trigger: 'blur' }
      ],
      new_password: [{ validator: validatePass, trigger: 'blur' }],
      confirmNewPassword: [{ validator: validatePass2, trigger: 'blur' }]
    })
    const data_ = {
      text: null,
      timer: null,
      passwordForm: {
        password: '',
        new_password: '',
        confirmNewPassword: ''
      },
      openOrClose: 'off',
      modifyPwdVisible: false,
      passwordLoading: false,
      aboutDialogVisible: false,
      rules,
      badgeNum: 0,
      rightMenuWidth: 0,
      time: null,
      chekAboutMsg: ' ',
      version: null,
      authEnv,
      changeRoleEnable2: false,
      currentIsUserRole: false,
      currentIsManagerRole: false,
      nextRoleName: '',
      modifyCompanyVisible: false,
      chooseCompany: null,
      companyLoading: false,
      scheduleControl: null
    }
    return data_
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'roles', 'need_reset_password', 'changeRoleEnable', 'userinfo']),
    notInHome() {
      return this.$route.name !== 'home'
    },
    inHome() {
      return this.$route.name === 'home'
    },
    leftMenuWidth() {
      return `calc(100% - ${this.rightMenuWidth}px)`
    }
  },
  watch: {
    need_reset_password: {
      immediate: true,
      handler: function (newVal) {
        this.modifyPwdVisible = newVal
      }
    },
    changeRoleEnable: {
      immediate: true,
      handler: function (newVal) {
        this.changeRoleEnable2 = newVal
      }
    }
  },
  beforeDestroy() {
    this.scheduleControl && this.scheduleControl.destoryLoop()
  },
  created() {
    const slug = this.$route.meta.slug
    if (slug === 'property') {
      const currentRoles = JSON.parse(localStorage.getItem('currentRoles') || '[]')
      this['currentIsUserRole'] = getUserRolesBySlug(this.$route.meta.slug).some(i => currentRoles.indexOf(i) > -1)
      this['currentIsManagerRole'] = getManagerRolesBySlug(this.$route.meta.slug).some(i => currentRoles.indexOf(i) > -1)
      this.nextRoleName = this.currentIsUserRole ? '切换至管理员' : ''
      this.nextRoleName = this.currentIsManagerRole ? '切换至用户端' : this.nextRoleName
    }
    this.chooseCompany = this.userinfo?.tenant_id
  },
  mounted() {
    const status = JSON.parse(sessionStorage.getItem('configs'))
    this.openOrClose = status?.watermark
    if (this.openOrClose === 'off' || !status?.watermark) {
      this.scheduleControl && this.scheduleControl.destoryLoop()
      watermark.remove()
    } else {
      this.scheduleControl = new ScheduleControl(this.showTimer, 1000)
      this.scheduleControl.startLoop()
    }
    this.version = process.env.versions
    this.time = formatTimeStr(process.env.times).slice(0, 10).replace(/-/g, '')
    this.$nextTick(() => {
      this.rightMenuWidth = this.$refs['rightMenu'].offsetWidth
      this.chekAboutMsg = JSON.parse(localStorage.getItem('aboutMsg')) || ''
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    /**
     * 退出登录状态
     */
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push('/login')
      history.pushState(null, '', '/login')
    },
    /**
     * 显示秘码弹出框
     */
    showModifyPasswordDialog() {
      this.modifyPwdVisible = true
    },
    /**
     * 重置修改密码form
     */
    resetform() {
      this.$refs['passwordForm'].resetFields()
    },
    /**
     * 确认修改密码
     */
    updatePassword() {
      this.passwordLoading = true
      this.$refs['passwordForm'].validate(valid => {
        if (valid) {
          const params = {
            ...this.passwordForm
          }
          params.password = encrypt(params.password)
          params.new_password = encrypt(params.new_password)
          delete params.confirmNewPassword
          postAuthPassword(params)
            .then(() => {
              this.$message({
                message: '修改密码成功',
                type: 'success'
              })
              this.passwordLoading = false
              this.modifyPwdVisible = false
              this.$store.commit('user/SET_NEED_RESET_PASSWORD', false)
            })
            .catch(() => {
              this.passwordLoading = false
            })
        } else {
          this.passwordLoading = false
        }
      })
    },
    handlerAbout() {
      this.aboutDialogVisible = true
    },
    /**
     * 返回
     */
    async handleChangeRole() {
      let nextRoles = []
      const managerRoles = getManagerRolesBySlug('property')
      const userRoles = getUserRolesBySlug('property')
      if (this.currentIsUserRole) {
        nextRoles = this.roles.map(i => i.slug).filter(i => managerRoles.indexOf(i) > -1)
      } else if (this.currentIsManagerRole) {
        nextRoles = this.roles.map(i => i.slug).filter(i => userRoles.indexOf(i) > -1)
      }
      try {
        await this.$store.dispatch('auth/getMenu', nextRoles)
        this.currentIsUserRole = !this.currentIsUserRole
        this.currentIsManagerRole = !this.currentIsManagerRole
        this.nextRoleName = this.currentIsUserRole ? '切换至管理员' : ''
        this.nextRoleName = this.currentIsManagerRole ? '切换至用户端' : this.nextRoleName
        this.$message.success('切换成功')
        localStorage.setItem('currentRoles', JSON.stringify(nextRoles))
        setTimeout(() => {
          this.$router.push('/')
        }, 500)
      } catch (err) {
        console.log(err)
      }
    },
    showTimer() {
      const time = formatTimeStr(new Date().getTime())
      watermark.set(this.name, time, this.dom)
    },

    /*
      切换企业
    */
    showModifyCompanyDialog() {
      this.modifyCompanyVisible = true
    },
    updateCompany(id) {
      const chooseCompany = this.chooseCompany
      if (chooseCompany === id) {
        this.modifyCompanyVisible = false
        return
      }
      if (!this.companyLoading) {
        this.companyLoading = true
        tenantLogin({
          tenantId: id
        })
          .then(async res => {
            const { access_token, expired_in } = res.data
            this.chooseCompany = id
            setToken(access_token, expired_in)
            await this.$store.dispatch('user/getInfo')
            this.Emit.$emit('changeCompany')
            this.modifyCompanyVisible = false
          })
          .finally(() => {
            this.companyLoading = false
          })
      }
    },
    async refreshConfig() {
      const { data } = await getConfig()
      if (data.length > 0) {
        const configs = {}
        data.forEach(i => {
          configs[i.name] = i.data
        })
        sessionStorage.setItem('configs', JSON.stringify(configs))
        const title = configs['name']
        document.title = title
        localStorage.setItem('title', title)
        localStorage.setItem('icon-theme', configs.icon)
        this.$store.commit('settings/CHANGE_TITLE', title)
      }
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  .home-search-container {
    // width: 20%;
    height: 50px;
    margin-right: 30px;
    float: right;
    .dl-input {
      background-color: #eeeeee;
      width: 200px;
    }
  }
  .left-menu {
    height: 100%;
    &-nohome {
      background-color: #fff;
    }
  }

  .right-menu {
    height: 100%;
    &-nohome {
      background-color: #fff;
    }
    .right-menu-item {
      // margin-right: 30px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
    }
    .right-menu-item:nth-child(1),
    .right-menu-item:nth-child(2) {
      padding-top: 6px;
      padding-bottom: 5px;
    }

    .avatar-dropdown .avatar-container {
      img {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
      .span-name {
        display: inline-block;
        font-size: 12px;
        margin-left: 5px;
        line-height: 24px;
        height: 24px;
        flex: 1;
        &-nohome {
          display: inline-block;
          font-size: 12px;
          color: #666;
          margin-left: 5px;
          line-height: 24px;
          height: 24px;
          flex: 1;
        }
      }
    }
  }
}
.about-dialog {
  ::v-deep .el-dialog {
    border-radius: 5px;
    overflow: hidden;
    margin-top: 25vh !important;
    .el-dialog__header {
      height: 0;
      .el-dialog__headerbtn {
        z-index: 999;
      }
    }
    .el-dialog__body {
      font-size: 16px;
      .about {
        font-size: 14px !important;
        color: #333333;
        position: absolute;
        left: 10px;
        top: 10px;
      }
      background: url('../../assets/images/about-background.png') no-repeat;
      text-align: center;
      padding: 0;
      position: relative;
      .dialog-bc {
        font-weight: 400;
        color: #333333;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        img {
          width: 65px;
          height: 68px;
        }
        &-span {
          padding-top: 18px;
          line-height: 22px;
          .slot-name {
            font-size: 16px !important;
          }
          .version {
            font-size: 14px !important;
            opacity: 0.7;
          }
        }
      }
    }
  }
}
.in-home {
  position: fixed;
  width: 100%;
  z-index: 5;
  top: 0;

  .left-menu {
    float: left;
  }
  .right-menu {
    float: right;
  }
}
.company-dialog {
  .company-list {
    margin-top: 50px;
    color: #1a1a1a;
    .item {
      display: flex;
      align-items: center;
      min-height: 80px;
      margin-bottom: 10px;
      border: 1px solid #fff;
      padding: 12px 15px;
      cursor: pointer;
      border-radius: 6px;
      .company-logo {
        width: 50px;
        height: 50px;
        line-height: 50px;
        border-radius: 4px;
        background: #409eff;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
      .company-name {
        flex: 1;
        margin: 0 13px;
        color: #1a1a1a;
        font-size: 18px;
      }
    }
    .item:hover {
      border-color: #409eff;
    }
    .item-choose {
      border-color: #409eff;
    }
  }
}
</style>
