<template>
  <pro-layout
    :menus="sideMenus"
    :collapsed="sideCollapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :logo="logoRender"
    v-bind="settings">
    <template v-slot:rightContentRender>
      <global-header
        :is-mobile="isMobile"
        :theme="settings.theme"></global-header>
    </template>
    <template v-slot:footerRender>
      <!-- <div class="footer">
        Powered by
        <a
          class="沛芝堂"
          href="https://mo.chat/"
          target="_blank">沛芝堂</a>
      </div> -->
    </template>
    <div
      v-if="!breadcrumb.find(item=>item === 'hiddenBreadcrumb')"
      class="breadcrumb-wrapper"
    >
      <div class="chunk"></div>
      <div class="breadcrumb">
        <a-breadcrumb>
          <a-breadcrumb-item
            v-for="(item, index) in breadcrumb"
            :key="'a' + index">
            <router-link
              :to="{path: returnPath}"
              v-if="item === true">
              <span class="return_lt"></span>
              <span class="return">返回</span>
            </router-link>
            <div
              style="display: inline-block;cursor:pointer;"
              @click.stop="$router.back(-1)"
              v-if="item === 'isBack'">
              <span class="return_lt"></span>
              <span class="return">返回</span>
            </div>
            <span
              v-if="item != true && item != 'isBack'"
              :class="index + 1 == breadcrumb.length ? 'pitch':'default'">
              {{ item }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <router-view />
  </pro-layout>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import GlobalHeader from '@/components/GlobalHeader/index'
import Logo from '@/components/Logo'

export default {
  name: 'BasicLayout',
  components: {
    GlobalHeader
  },
  data () {
    return {
      // 侧栏收起状态
      collapsed: false,
      settings: {
        // 布局类型
        layout: 'sidemenu', // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: 'Fluid',
        // 主题 'dark' | 'light'
        theme: 'dark',
        // 主色调
        primaryColor: '#1890ff',
        fixSiderbar: true,
        fixedHeader: true
      },
      // 媒体查询
      query: {},
      // 是否手机模式
      isMobile: false,
      breadcrumbText: ''
    }
  },
  computed: {
    ...mapState({
      sideMenus: (state) => state.permission.sideMenus,
      sideCollapsed: (state) => state.app.sideCollapsed
    }),
    ...mapGetters(['breadcrumb', 'returnPath', 'isBreadcrumb'])
  },
  created () {
    // 处理侧栏收起状态
    // this.$watch('collapsed', () => {
    //   this.sidebarType(this.collapsed)
    // })
    this.$watch('isMobile', () => {
      this.toggleMobileType(this.isMobile)
    })
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.sidebarType(!this.sideCollapsed)
        setTimeout(() => {
          this.sidebarType(!this.sideCollapsed)
        }, 16)
      })
    }
  },
  methods: {
    ...mapMutations({
      sidebarType: 'SIDEBAR_TYPE',
      toggleMobileType: 'TOGGLE_MOBILE_TYPE'
    }),
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.sidebarType(false)
        this.settings.contentWidth = 'Fluid'
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.sidebarType(val)
    },
    logoRender () {
      return <Logo></Logo>
    }
  }
}
</script>

<style lang="less">
@import './BasicLayout.less';
</style>
