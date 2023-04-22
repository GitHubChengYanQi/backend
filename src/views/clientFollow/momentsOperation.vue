<template>
  <div class="momentsOperation-page_Container">
    <div class="tabsBar">
      <a-tabs v-model="activeTab">
        <a-tab-pane key="1" tab="朋友圈任务" v-permission="'/moments/list#post'">
          <MomentsTable />
        </a-tab-pane>
        <a-tab-pane key="2" tab="数据统计" force-render v-permission="'/moments/chartdatas#post'">
          <MomentsDataStatistics />
        </a-tab-pane>
      </a-tabs>
      <span class="explain">
        <a-tooltip placement="leftTop">
          <template #title>
            <p>【朋友圈任务-企业发表】员工完成情况数据、发送客户情况数据，30分钟更新一次。</p>
            <p>
              朋友圈任务的评论/点赞数据，只统计发布后7天内的数据;发表后24小时内点赞/评论每2小时自动更新一次，之后按照每天凌晨2:10分自动更新一次。
            </p>
            <p>
              自主下发、自主发表的朋友圈情况、评论、点赞，每天凌晨2:10分自动更新一次。评论/点赞最长统计发表后7天的数据。
            </p>
          </template>
          <div class="txt">
            数据更新规则
            <img class="tipIcon" :src="require('@/assets/systemHomePage/search-icon.png')" alt />
          </div>
        </a-tooltip>
      </span>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
import MomentsTable from '@/views/clientFollow/components/momentsTable.vue'
import MomentsDataStatistics from '@/views/clientFollow/components/momentsDataStatistics.vue'
export default {
  name: '',
  components: {
    MomentsTable,
    MomentsDataStatistics
  },
  data () {
    return {
      activeTab: '1'
    }
  },
  computed: {},
  watch: {},
  // 路由守卫离开路由之前
  beforeRouteLeave (to, from, next) {
    console.log(from, '从哪里来', to, '跳到哪里')
    if (to.path === '/clientFollow/momentsOperation/edit') {
    } else {
      sessionStorage.removeItem('momentPage')
      sessionStorage.removeItem('momentSearchData')
    }
    next()
  },
  beforeCreate () { },
  created () { },
  beforeMount () { },
  mounted () { },
  methods: {},
  beforeUpdate () { },
  updated () { },
  beforeUnmount () { },
  unmounted () { }
}
</script>
<style lang='less'>
</style>
<style lang='less' scoped>
.tabsBar {
  position: relative;

  .explain {
    position: absolute;
    right: 30px;
    top: 12px;

    .txt {
      display: flex;
      align-items: center;

      .tipIcon {
        margin-left: 5px;
        width: 10px;
        height: 10px;
      }
    }
  }
}
</style>
