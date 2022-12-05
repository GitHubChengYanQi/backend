<template>
  <div>
    <div class="breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <div
            style="display: inline-block;cursor:pointer;"
            @click.stop="$router.back(-1)">
            <span class="return_lt"></span>
            <span class="return">返回</span>
          </div>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <span class="pitch">课程详情</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="courseware">
      <div class="tabButton">
        <a-button :type="key === '1' ? 'primary' : 'default'" @click="setKey('1')">课程分析</a-button>
        <a-button :type="key === '2' ? 'primary' : 'default'" @click="setKey('2')">课件分析</a-button>
        <a-button :type="key === '3' ? 'primary' : 'default'" @click="setKey('3')">考试分析</a-button>
      </div>
      <LessonAnalysis v-if="key === '1'" />
      <CoursewareAnalysis v-if="key === '2'" />
      <ExaminationAnalysis v-if="key === '3'" />
    </div>
  </div>
</template>

<script>
import LessonAnalysis from './components/LessonAnalysis/index'
import CoursewareAnalysis from './components/CoursewareAnalysis/index'
import ExaminationAnalysis from './components/ExaminationAnalysis/index'

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
  components: { LessonAnalysis, CoursewareAnalysis, ExaminationAnalysis }
}
</script>

<style lang="less" scoped>

.courseware {
  background-color: #fff;
  padding: 24px;
  margin-top: 12px;

  .tabButton {
    display: flex;

    button {
      width: 200px;
    }
  }
}

</style>
