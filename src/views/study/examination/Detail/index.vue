<template>
  <div>
    <breadcrumb :titles="['考试管理','考试详情']" back></breadcrumb>
    <a-tabs v-model="key" class="tabs">
      <a-tab-pane key="1" tab="试卷详情">
        <TestPaperDetail />
      </a-tab-pane>
      <a-tab-pane key="2" tab="考试分析">
        <ExamintionDetail />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ExamintionDetail from '../../lesson/Detail/components/ExaminationAnalysis/ExamintionDetail/index'
import TestPaperDetail from './components/TestPaperDetail/index'
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
  components: { TestPaperDetail, ExamintionDetail, breadcrumb }
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
