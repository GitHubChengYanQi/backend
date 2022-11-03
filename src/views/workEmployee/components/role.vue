<template>
  <div class="add-event">
    <a-modal
      v-model="modalShow"
      :width="412"
      :footer="false"
      centered
      title="权限设置"
    >
      <span>设置角色：</span>
      <a-select style="width: 293px" v-model="roleId">
        <a-select-option v-for="item in roleList" :key="item.roleId">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <div class="footer">
        <a-button class="mr8" @click="modalShow = false">取消</a-button>
        <a-button type="primary" @click="confirm">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { roleSelectValidList, roleUpdate } from '@/api/user'
export default {
  data () {
    return {
      modalShow: false,
      userId: '',
      roleId: '',
      roleList: []
    }
  },
  methods: {
    confirm () {
      this.modalShow = false
      roleUpdate({
        userId: this.userId,
        roleId: this.roleId === '' ? 0 : this.roleId
      }).then((res) => {
        this.$emit('change')
      })
    },

    getRoleList () {
      roleSelectValidList().then(res => {
        this.roleList = res.data
      })
    },

    $show (userId = '', roleId = '') {
      this.getRoleList()
      this.userId = userId
      this.roleId = roleId ? Number(roleId) : ''
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

/deep/ .ant-modal-body {
  padding-top: 6px;
}

/deep/ .ant-select {
  width: 100%;
}
</style>
