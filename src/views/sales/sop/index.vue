<template>
  <div>
    <a-tabs v-model="active">
      <a-tab-pane v-for="item in tabs" :key="item.id" :tab="item.name"></a-tab-pane>
    </a-tabs>
    <div>
      <general v-if="active==='General'" :activeInfo="getAciveMethod('General')"/>
      <activity v-if="active==='Activity'" :activeInfo="getAciveMethod('Activity')"/>
      <regular v-if="active==='Regular'" :activeInfo="getAciveMethod('Regular')"/>
      <friend v-if="active==='Friend'" :activeInfo="getAciveMethod('Friend')"/>
      <birthday v-if="active==='Birthday'" :activeInfo="getAciveMethod('Birthday')"/>
    </div>
  </div>
</template>

<script>
import general from './components/general'
import activity from './components/activity'
import regular from './components/regular'
import friend from './components/friend'
import birthday from './components/birthday'
export default {
  components: {
    general,
    activity,
    regular,
    friend,
    birthday
  },
  data () {
    return {
      active: 'General',
      tabs: [
        {
          name: '群发助手SOP',
          id: 'General',
          explan: '员工根据任务，通过群发助手一键群发内容给客户'
        },
        {
          name: '群发活动SOP',
          id: 'Activity',
          explan: '向指定的客户，在指定的时间点，发送指定的消息'
        },
        {
          id: 'Regular',
          name: '定期提醒SOP',
          explan: '当客户状态满足设定的条件时，开始定期给客户发送指定的消息'
        },
        {
          id: 'Friend',
          name: '好友SOP',
          explan: '对新增好友，定期发送指定的消息'
        },
        {
          id: 'Birthday',
          name: '生日SOP',
          explan: '客户生日时，给客户发送指定的生日祝福'
        }
      ]
    }
  },
  watch: {
    active () {
      sessionStorage.setItem('activeType', this.active)
    }
  },
  // 页面销毁前
  beforeDestroy () {
    console.log('index页面销毁前')
    console.log(this.$router, '看看能得到路由么')
    const nextRouterLink = this.$router.currentRoute.path
    console.log(nextRouterLink, 'nextRouterLink')
    if (nextRouterLink.indexOf('/sales') === -1) {
      // 跳转的路由非sales的路由
      sessionStorage.removeItem('activeType')
    }
    // sessionStorage.removeItem('activeType')
  },
  created () {
    console.log('created页面')
    const activeType = sessionStorage.getItem('activeType')
    // 如果sessionStorage中没有activeType缓存,直接显示General,如果有,直接赋值
    this.active = activeType || 'General'
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
