<template>
  <div id="integral_statistic_container" ref="integral_statistic_container">
    积分统计
    <a-button @click="chooseGoods()">选择商品</a-button>
    <goodsManager
      :showStatus.sync="chooseGoodsManagerShowStatus"
      :permissionText="''"
      @submitConfirm="submitGoodsConfirm">
    </goodsManager>
  </div>
</template>

<script>
import goodsManager from './goodsManager.vue'
export default {
  name: 'BackendIntegralStatistic',
  data () {
    return {
      chooseGoodsManagerShowStatus: false
    }
  },
  components: {
    goodsManager
  },
  mounted () {
    console.log('积分统计数据')
  },
  methods: {
    chooseGoods () {
      console.log('点击添加商品')
      this.chooseGoodsManagerShowStatus = true
    },
    submitGoodsConfirm (e) {
      console.log(e, '选择商品库返回')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
