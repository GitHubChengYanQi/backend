<template>
  <div>
    <a-tabs v-model="active">
      <a-tab-pane v-for="item in tabs" :key="item.id" :tab="item.name"></a-tab-pane>
    </a-tabs>
    <div>
      <clusterCalendarTemplate v-if="active==='Template'" :activeInfo="getAciveMethod('Template')"/>
      <clusterCalendarExecute v-if="active==='Execute'" :activeInfo="getAciveMethod('Execute')"/>
      <clusterCalendarRecord v-if="active==='Record'" :activeInfo="getAciveMethod('Record')"/>
    </div>
  </div>
</template>

<script>
import clusterCalendarTemplate from './components/clusterCalendar/clusterCalendarTemplate'
import clusterCalendarExecute from './components/clusterCalendar/clusterCalendarExecute'
import clusterCalendarRecord from './components/clusterCalendar/clusterCalendarRecord'
export default {
  components: {
    clusterCalendarTemplate,
    clusterCalendarExecute,
    clusterCalendarRecord
  },
  data () {
    return {
      active: 'Template',
      tabs: [
        {
          name: '群日历模板',
          id: 'Template'
        },
        {
          name: '执行中的群日历',
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
      sessionStorage.setItem('clusterCalendarActiveType', this.active)
    }
  },
  // 路由守卫离开路由之前
  beforeRouteLeave (to, from, next) {
    console.log(from, '从哪里来', to, '跳到哪里')
    if (to.path === '/sop/editClusterCalendar') {
    } else {
      sessionStorage.removeItem('calendarTemplatePage')
    }
    next()
  },
  // 页面销毁前
  beforeDestroy () {
    console.log('index页面销毁前')
    console.log(this.$router, '看看能得到路由么')
    const nextRouterLink = this.$router.currentRoute.path
    console.log(nextRouterLink, 'nextRouterLink')
    if (nextRouterLink.indexOf('ClusterCalendar') === -1) {
      // 跳转的路由非sales的路由
      sessionStorage.removeItem('clusterCalendarActiveType')
    }
    // sessionStorage.removeItem('activeType')
  },
  created () {
    console.log('created页面')
    const activeType = sessionStorage.getItem('clusterCalendarActiveType')
    // 如果sessionStorage中没有activeType缓存,直接显示General,如果有,直接赋值
    this.active = activeType || 'Template'
  },
  methods: {
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
