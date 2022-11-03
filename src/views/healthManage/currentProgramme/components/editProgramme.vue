<!-- 编辑方案 -->
<template>
  <div>
    <a-tabs type="card">
      <a-tab-pane key="1" tab="随访方案编辑">
        <EditDetail :planId="planId" />
      </a-tab-pane>
      <!--      <a-tab-pane key="2" tab="知情同意书编辑">-->
      <!--        null-->
      <!--      </a-tab-pane>-->
    </a-tabs>

  </div>
</template>
<script>
import EditDetail from './editDetail.vue'
export default {
  components: {
    EditDetail
  },
  // eslint-disable-next-line
  props: ['planId'],
  data () {
    return {

    }
  }
}
</script>
<style lang="less">
</style>
