<template>
  <div>
    <a-tabs v-model="active">
      <a-tab-pane v-for="item in tabs" :key="item.id" :tab="item.name"></a-tab-pane>
    </a-tabs>
    <div>
      <clusterSopTemplate v-if="active==='Template'" :activeInfo="getAciveMethod('Template')"/>
      <clusterSopExecute v-if="active==='Execute'" :activeInfo="getAciveMethod('Execute')"/>
      <clusterSopRecord v-if="active==='Record'" :activeInfo="getAciveMethod('Record')"/>
    </div>
  </div>
</template>

<script>
import clusterSopTemplate from './components/clusterSop/clusterSopTemplate'
import clusterSopExecute from './components/clusterSop/clusterSopExecute'
import clusterSopRecord from './components/clusterSop/clusterSopRecord'
export default {
  components: {
    clusterSopTemplate,
    clusterSopExecute,
    clusterSopRecord
  },
  data () {
    return {
      visible: false,
      twoVisible: false,
      active: 'Template',
      tabs: [
        {
          name: 'SOP模板',
          id: 'Template'
        },
        {
          name: '执行中的SOP',
          id: 'Execute'
        },
        {
          name: '执行记录',
          id: 'Record'
        }
      ]
    }
  },
  watch: {
    active () {
      sessionStorage.setItem('clusterSopActiveType', this.active)
    }
  },
  // 路由守卫离开路由之前
  beforeRouteLeave (to, from, next) {
    console.log(from, '从哪里来', to, '跳到哪里')
    if (to.path === '/sop/editClusterSop') {
    } else {
      sessionStorage.removeItem('sopTemplatePage')
    }
    next()
  },
  // 页面销毁前
  beforeDestroy () {
    console.log('index页面销毁前')
    console.log(this.$router, '看看能得到路由么')
    const nextRouterLink = this.$router.currentRoute.path
    console.log(nextRouterLink, 'nextRouterLink')
    if (nextRouterLink.indexOf('ClusterSop') === -1) {
      // 跳转的路由非sales的路由
      sessionStorage.removeItem('clusterSopActiveType')
    }
  },
  created () {
    console.log('created页面')
    const activeType = sessionStorage.getItem('clusterSopActiveType')
    // 如果sessionStorage中没有activeType缓存,直接显示General,如果有,直接赋值
    this.active = activeType || 'Template'
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
