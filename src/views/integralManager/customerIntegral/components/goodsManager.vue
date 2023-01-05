<template>
  <div id="goods_manager_container" ref="goods_manager_container" v-if="goodsManagerShowStatus">
    <a-modal
      title="选择商品"
      :maskClosable="false"
      :width="500"
      :visible="goodsManagerShowStatus"
      class="goodsManagerClass"
      @cancel="closeGoodsManager()"
      :dialogStyle="dialogStyle"
      :getContainer="() => $refs['goods_manager_container']"
    >
      <a-spin :spinning="modalLoadingStatus"></a-spin>
      <template slot="footer">
        <a-button
          :disabled="modalLoadingStatus"
          @click="closeGoodsManager()"
        >取消</a-button>
        <a-button type="primary" :disabled="modalLoadingStatus" @click="confirmGoodsManager">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { erpGoods } from '@/api/integralManager'
export default {
  name: 'GoodsManager',
  data () {
    return {
      screenData: {},
      dialogStyle: {
        left: '130px'
      },
      // 选择商品库弹框显示状态
      goodsManagerShowStatus: false,
      // 弹框加载中
      modalLoadingStatus: false,
      // 群聊弹框分页信息
      goodsManagerPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  props: {
    permissionText: {
      type: String,
      default: ''
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    isRadioStatus: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showStatus () {
      console.log(this.showStatus, 'showStatus')
      this.goodsManagerShowStatus = this.showStatus
      if (this.goodsManagerShowStatus) {
        this.modalLoadingStatus = true
        this.getData()
      }
    }
  },
  created () {
    console.log('created商品库组件')
  },
  mounted () {

  },

  methods: {
    getData () {
      const params = {
        page: this.goodsManagerPagination.current,
        perPage: this.goodsManagerPagination.pageSize,
        ...this.screenData
      }
      erpGoods(params).then(res => {
        console.log(res, '获取商品库数据')
      })
    },
    closeGoodsManager () {
      this.goodsManagerShowStatus = false
      this.$emit('update:showStatus', this.goodsManagerShowStatus)
    },
    confirmGoodsManager () {
      this.goodsManagerShowStatus = false
      this.$emit('update:showStatus', this.goodsManagerShowStatus)
      this.$emit('submitConfirm', 'yes')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
