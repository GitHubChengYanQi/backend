<template>
  <div>
    <a-tabs v-model="active">
      <a-tab-pane v-for="item in tabs" :key="item.value" :tab="item.name"></a-tab-pane>
    </a-tabs>
    <div>
      <bloodPressureTest v-if="active==='pressure'" :activeInfo="getAciveMethod('pressure')"/>
      <bloodSugarTest v-if="active==='sugar'" :activeInfo="getAciveMethod('sugar')"/>
      <bloodFlatTest v-if="active==='flat'" :activeInfo="getAciveMethod('flat')"/>
      <uricAcidTest v-if="active==='uric'" :activeInfo="getAciveMethod('uric')"/>
    </div>
  </div>
</template>
<script>
import bloodPressureTest from './components/bloodPressureTest.vue'
import bloodSugarTest from './components/bloodSugarTest.vue'
import bloodFlatTest from './components/bloodFlatTest.vue'
import uricAcidTest from './components/uricAcidTest.vue'
export default {
  name: 'CustomerTestManager',
  components: {
    bloodPressureTest,
    bloodSugarTest,
    bloodFlatTest,
    uricAcidTest
  },
  data () {
    return {
      active: '',
      tabs: [
        {
          id: 0,
          name: '血压',
          value: 'pressure'
        },
        {
          id: 1,
          name: '血糖',
          value: 'sugar'
        },
        {
          id: 2,
          name: '血脂',
          value: 'flat'
        },
        {
          id: 3,
          name: '尿酸',
          value: 'uric'
        }
      ]
    }
  },
  watch: {
    active () {
      sessionStorage.setItem('customerTestType', this.active)
    }
  },
  // 页面销毁前
  beforeDestroy () {
    console.log('index页面销毁前')
    console.log(this.$router, '看看能得到路由么')
    const nextRouterLink = this.$router.currentRoute.path
    console.log(nextRouterLink, 'nextRouterLink')
    if (nextRouterLink.indexOf('customerTestManager') === -1) {
      // 跳转的路由非customerIntegral的路由
      sessionStorage.removeItem('customerTestType')
    }
    // sessionStorage.removeItem('activeType')
  },
  created () {
    console.log('created页面')
    const activeType = sessionStorage.getItem('customerTestType')
    // 如果sessionStorage中没有activeType缓存,直接显示General,如果有,直接赋值
    this.active = activeType || 'pressure'
  },
  methods: {
    getAciveMethod (text) {
      this.active = text
    }
  }
}
</script>
