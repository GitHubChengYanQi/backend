<template>
  <a-dropdown v-if="userName" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" :src="avatar || DefaultAvator" class="antd-pro-global-header-index-avatar" />
      <span>{{ userName }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <!-- <a-menu-divider v-if="menu" /> -->
        <a-menu-item key="user" @click="passwordUpdate">
          <a-icon type="user" />
          修改密码
        </a-menu-item>
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>

import store from '@/store'
import { mapGetters } from 'vuex'
import { logout, corpSelect, corpBind } from '@/api/login'
import DefaultAvator from '@/assets/members.jpg'
export default {
  name: 'AvatarDropdown',
  props: {
    menu: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      DefaultAvator,
      avatar: '',
      userName: ''
    }
  },
  created () {
    this.getInfo()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async getInfo () {
      try {
        await store.dispatch('GetInfo')
        this.avatar = this.userInfo.employeeThumbAvatar
        this.userName = this.userInfo.userName || 'user'
        let corpId = ''
        let corpName = ''
        if (this.userInfo.corpId) {
          corpId = this.userInfo.corpId
          corpName = this.userInfo.corpName
        } else {
          const { data } = await corpSelect()
          if (data[0]) {
            corpName = data[0].corpName
            corpId = data[0].corpId
            await corpBind({ corpId })
          } else {
            this.$router.push('/corp/index')
          }
        }
        store.commit('SET_CORP_ID', corpId)
        store.commit('SET_CORP_NAME', corpName)
      } catch (e) {
        console.log(e)
      }
    },
    handleLogout (e) {
      this.$confirm({
        title: '提示',
        content: '确认要离开吗',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          logout().then(res => {
            this.out()
          }).catch(e => {
            this.out()
          })
        },
        onCancel () {}
      })
    },
    out () {
      this.$store.dispatch('Logout').then(() => {
        this.$router.push({ name: 'login' })
      })
    },
    passwordUpdate () {
      this.$router.push('/passwordUpdate/index')
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  :deep(.action) {
    margin-right: 8px;
  }
  :deep(.ant-dropdown-menu-item) {
    min-width: 160px;
  }
}
</style>
