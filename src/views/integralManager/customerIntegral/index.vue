<template>
  <div>
    <a-tabs v-model="active">
      <a-tab-pane v-for="item in tabs" :key="item.id" :tab="item.name"></a-tab-pane>
    </a-tabs>
    <div>
      <integralRules v-if="active==='Rules'" :activeInfo="getAciveMethod('Rules')"/>
      <integralManager v-if="active==='Manager'" :activeInfo="getAciveMethod('Manager')"/>
      <integralStatistic v-if="active==='Statistic'" :activeInfo="getAciveMethod('Statistic')"/>
    </div>
  </div>
</template>

<script>
import integralRules from './components/integralRules'
import integralManager from './components/integralManager'
import integralStatistic from './components/integralStatistic'
export default {
  components: {
    integralRules,
    integralManager,
    integralStatistic
  },
  data () {
    return {
      visible: false,
      twoVisible: false,
      active: 'Rules',
      tabs: [
        {
          name: '积分规则',
          id: 'Rules'
        },
        {
          name: '积分管理',
          id: 'Manager'
        },
        {
          name: '积分统计',
          id: 'Statistic'
        }
      ]
    }
  },
  watch: {
    active () {
      sessionStorage.setItem('integralActiveType', this.active)
    }
  },
  // 页面销毁前
  beforeDestroy () {
    console.log('index页面销毁前')
    console.log(this.$router, '看看能得到路由么')
    const nextRouterLink = this.$router.currentRoute.path
    console.log(nextRouterLink, 'nextRouterLink')
    if (nextRouterLink.indexOf('customerIntegral') === -1) {
      // 跳转的路由非customerIntegral的路由
      sessionStorage.removeItem('integralActiveType')
    }
    // sessionStorage.removeItem('activeType')
  },
  created () {
    console.log('created页面')
    const activeType = sessionStorage.getItem('integralActiveType')
    // 如果sessionStorage中没有activeType缓存,直接显示General,如果有,直接赋值
    this.active = activeType || 'Rules'
  },
  methods: {
    // 显示第一层弹框
    showModal () {
      this.visible = true
    },
    // 关闭第一层弹框
    handleOk () {
      this.visible = false
    },
    // 展示第二层弹框
    showTwoModal () {
      this.twoVisible = true
    },
    // 关闭第二层弹框
    handleTwoOk () {
      this.twoVisible = false
    },
    // 返回当前生效的对象
    getAciveMethod (text) {
      const tempArray = this.tabs.filter(item => item.id === text)
      console.log(tempArray)
      return tempArray[0]
    }
  }
}
</script>

    <style lang="less" scoped>
    </style>
