<template>
  <div>
    <breadcrumb :titles="['任务管理']"></breadcrumb>
    <a-tabs v-model="key" class="tabs">
      <a-tab-pane key="1" tab="课程任务">
        <CourseTasks />
      </a-tab-pane>
      <a-tab-pane key="2" tab="考试任务">
        <ExaminationTasks />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import breadcrumb from '../components/Breadcrumd'
import CourseTasks from './components/CourseTasks'
import ExaminationTasks from './components/ExaminationTasks'

export default {
  data () {
    return {
      key: '1'
    }
  },
  methods: {
    setKey (key) {
      this.key = key
    }
  },
  components: { breadcrumb, CourseTasks, ExaminationTasks }
}
</script>

<style lang="less" scoped>

.tabs {

  /deep/ .ant-tabs-bar {
    background-color: #fff;
    padding: 0 12px;
    margin: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
}

</style>
