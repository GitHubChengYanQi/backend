<template>
  <div class="FollowUp_Data_Page_Container">
    <div class="header">
      <div class="title">随访数据统计</div>
      <span class="hint">数据更新频次</span>
      <a-tooltip placement="right">
        <template #title>
          <div class="title_box">
            <div>数据更新时间截止至当天05:00</div>
          </div>
        </template>
        <div class="icon">?</div>
      </a-tooltip>
    </div>
    <div class="tab_box">
      <div
        class="tab"
        :style="tab_header == index ? { color: 'rgba(2, 125, 180, 0.86)', textDecoration: 'underline' } : {}"
        v-for="(item,index) in tabArr.header"
        @click="handleCutTabIndex(index)"
        :key="index">{{ item }}</div>
    </div>
    <div :is="tab_header === 0 ? 'scheme-page' : 'task-page'"></div>
  </div>
</template>

<script>

import SchemePage from './components/schemePage.vue'
import TaskPage from './components/taskPage.vue'

export default {
  components: {
    SchemePage,
    TaskPage
  },
  data () {
    return {
      tabArr: {
        header: ['随访方案数据', '随访任务数据'] // 头部切换
      },
      tab_header: 0
    }
  },
  created () {
    this.tab_header = +this.$route.query.tab || 0
  },
  watch: {
  },
  methods: {
    handleCutTabIndex (index) {
      this.tab_header = index
      history.replaceState(null, '', `/followUp/data/index?tab=${index}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
