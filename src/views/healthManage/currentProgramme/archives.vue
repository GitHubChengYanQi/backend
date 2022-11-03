<!-- 健康档案 -->
<template>
  <div>
    <a-modal v-model="visible" :footer="null" :width="1052">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="基础信息">
          <BasicInformation />
        </a-tab-pane>
        <a-tab-pane key="2" tab="生活方式">
          <LifeStyle />
        </a-tab-pane>
        <a-tab-pane key="3" tab="健康史">
          <HealthHistory />
        </a-tab-pane>
        <a-tab-pane key="4" tab="血压记录">
        </a-tab-pane>
        <a-tab-pane key="5" tab="血糖记录">
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import BasicInformation from './components/archives/basicInformation.vue' // 基础信息
import LifeStyle from './components/archives/lifeStyle.vue' // 生活方式
import HealthHistory from './components/archives/healthHistory.vue' // 健康史
export default {
  components: {
    BasicInformation,
    LifeStyle,
    HealthHistory
  },
  data () {
    return {
      visible: false
    }
  },
  mounted () { },
  methods: {
    open (id) {
      this.visible = true
    },
    handleOk () {

    }
  }
}
</script>
<style lang="less" scoped>

</style>
