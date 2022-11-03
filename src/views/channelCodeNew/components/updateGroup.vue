<template>
  <a-modal
    title="修改分组名称"
    v-model="modalShow"
    :width="512"
    :footer="false"
    centered
    :maskClosable="false"
  >
    <div class="flex mb16">
      <span style="width: 95px;">分组名称：</span>
      <a-input placeholder="请输入分组名" v-model="name"/>
    </div>
    <div class="flex-end">
      <a-button class="mr16" @click="modalShow = false">
        取消
      </a-button>
      <a-button key="submit" type="primary" @click="confirm">
        确定
      </a-button>
    </div>
  </a-modal>
</template>

<script>
import { updateGroup } from '@/api/channelCodeNew'

export default {
  data () {
    return {
      modalShow: false,
      name: '',
      id: ''
    }
  },
  methods: {
    confirm () {
      if (!this.name) {
        this.$message.error('请填写分组名称')

        return false
      }

      if (this.name.length > 15) {
        this.$message.error('名称字数过长')

        return false
      }

      updateGroup({
        groupId: this.id,
        name: this.name
      }).then(() => {
        this.$message.success('修改成功')

        this.modalShow = false

        this.$emit('change')
      })
    },

    $show (id, name = '') {
      this.id = id
      this.name = name
      this.modalShow = true
    }
  }
}
</script>

<style scoped>

</style>
