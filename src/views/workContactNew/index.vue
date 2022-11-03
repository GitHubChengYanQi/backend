<template>
  <div class="box">
    <div class="tab">
      <a-tabs default-active-key="1" class="w-tabs" v-model="currentTab">
        <a-tab-pane key="1" tab="客户属性筛选"/>
        <!--        <a-tab-pane key="2" tab="所在群聊筛选"/>-->
        <!--        <a-tab-pane key="3" tab="客户动态筛选"/>-->
        <!--        <a-tab-pane key="4" tab="自定义信息筛选"/>-->
      </a-tabs>
    </div>

    <attribute v-if="currentTab === '1'"/>
    <room v-if="currentTab === '2'"/>
    <event v-if="currentTab === '3'"/>
    <custom v-if="currentTab === '4'"/>
  </div>
</template>

<script>
import attribute from '@/views/workContactNew/pages/attribute'
import room from '@/views/workContactNew/pages/room'
import event from '@/views/workContactNew/pages/event'
import custom from '@/views/workContactNew/pages/custom'

export default {
  data () {
    return {
      currentTab: '1'
    }
  },
  components: { attribute, room, event, custom }
}
</script>

<style lang="less" scoped>
.box {
  min-height: calc(100vh - 276px) !important;
}

.tab {
  background: #fff;
}

/deep/ .ant-tabs-bar {
  margin-bottom: 0 !important;
}
</style>
