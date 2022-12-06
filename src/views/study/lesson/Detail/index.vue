<template>
  <div>
    <breadcrumb :titles="['课程管理','课程详情']" back></breadcrumb>
    <a-tabs v-model="key" class="tabs">
      <a-tab-pane key="1" tab="课程分析">
        <LessonAnalysis />
      </a-tab-pane>
      <a-tab-pane key="2" tab="课件分析">
        <CoursewareAnalysis />
      </a-tab-pane>
      <a-tab-pane key="3" tab="考试分析">
        <ExaminationAnalysis />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import LessonAnalysis from './components/LessonAnalysis/index'
import CoursewareAnalysis from './components/CoursewareAnalysis/index'
import ExaminationAnalysis from './components/ExaminationAnalysis/index'
import breadcrumb from '../../components/Breadcrumd/index'

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
  components: { LessonAnalysis, CoursewareAnalysis, ExaminationAnalysis, breadcrumb }
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
