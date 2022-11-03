<template>
  <div class="add-event">
    <a-modal
      v-model="modalShow"
      :width="412"
      :footer="false"
      centered
      title="关闭席位"
    >
      <div class="text">
        当前席位在该模块中可能有进行中的任务，席位关闭后进行中的任务将无法正常执行，您可以选择结束或删除相应任务后关闭席位。
      </div>

      <div class="footer">
        <a-button class="mr8" @click="modalShow = false">取消</a-button>
        <a-button type="primary" @click="confirm">仍要关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { statusUpdate } from '@/api/workEmployee'
export default {
  data () {
    return {
      modalShow: false,
      id: ''
    }
  },
  methods: {
    confirm () {
      this.modalShow = false
      statusUpdate({
        id: this.id,
        status: 3
      }).then(res => {
        this.$message.success('关闭成功')
        this.$emit('change')
      })
    },

    $show (id = '') {
      this.id = id
      this.modalShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
}

.text {
  color: #000000d9;
  font-size: 14px;
}

/deep/ .ant-modal-body {
  padding-top: 6px;
}

/deep/ .ant-select {
  width: 100%;
}
</style>
