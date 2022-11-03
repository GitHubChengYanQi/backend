<template>
  <div class="batch-group">
    <a-modal
      title="批量分组"
      v-model="modalShow"
      :width="512"
      :footer="false"
      centered
      :maskClosable="false">
      <div class="flex mb16">
        <span style="width: 100px">选择分组：</span>
        <div style="width: 100%">
          <a-popover trigger="click" placement="bottom" v-model="popShow">
            <template slot="content">
              <div class="add-group-btn" @click="add = !add">
                <a-icon type="plus-circle" class="mr6" />
                添加分组
              </div>
              <div class="add-group-input" v-if="add">
                <a-input placeholder="输入名称后回车" v-model="name" @keyup.enter="addGroupClick" />
              </div>
              <div class="groups">
                <div
                  :class="{ item: true, 'flex-between': true, active: v.groupId == group.current.groupId }"
                  v-for="v in list"
                  :key="v.id"
                  @click="selectGroup(v)"
                >
                  <div class="name">
                    {{ v.name }}
                  </div>
                  <div class="count">
                    {{ v.total }}
                  </div>
                </div>
              </div>
            </template>
            <a-select v-if="select.show" :default-value="select.name" :open="false" style="width: 100%" />
          </a-popover>
        </div>
      </div>
      <div class="flex-end">
        <a-button class="mr16" @click="modalShow = false"> 取消 </a-button>
        <a-button key="submit" type="primary" @click="confirm"> 确定 </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { addGroup, getGroupList, move } from '@/api/channelCodeNew'

export default {
  data () {
    return {
      modalShow: false,
      list: [],
      add: false,
      popShow: false,
      name: '',
      select: {
        show: true,
        name: '',
        id: ''
      },
      group: {
        current: {
          groupId: '',
          groupName: ''
        }
      },
      selectCodes: []
    }
  },
  methods: {
    $show (list) {
      if (!list.length) {
        this.$message.error('请选择活码')

        return false
      }

      this.getGroupList()

      this.selectCodes = list

      this.modalShow = true
    },

    selectGroup (data) {
      this.select.id = data.groupId
      this.select.name = data.name

      this.popShow = false

      this.select.show = false

      setTimeout(() => {
        this.select.show = true
      }, 0)
    },

    addGroupClick () {
      if (!this.name) {
        this.$message.error('未填写分组名')

        return false
      }

      this.add = false

      addGroup({
        name: [this.name]
      }).then((res) => {
        this.getGroupList()
        this.$message.success('添加成功')
        this.group.current.groupId = res.data[0]
        this.group.current.groupName = this.name
      })
    },

    getGroupList () {
      getGroupList().then(res => {
        this.list = res.data
        this.select.id = this.group.current.groupId ? this.group.current.groupId : this.list[0].groupId
        this.select.name = this.group.current.groupName ? this.group.current.groupName : this.list[0].name

        this.select.show = false

        setTimeout(() => {
          this.select.show = true
        }, 0)
      })
    },

    confirm () {
      this.modalShow = false
      move({
        ids: this.selectCodes,
        groupId: this.select.id
      }).then(() => {
        this.$message.success('批量分组成功')

        this.$emit('change')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.groups {
  height: 200px;
  overflow-y: auto;
  .item {
    height: 48px;
    padding: 0 22px;
    color: #000000d9;
    cursor: pointer;

    .name {
      color: #000000a6;
    }

    .count {
      color: #00000040;
      font-size: 13px;
    }

    &:hover {
      background: #e6f7ff;
    }
  }
  .active {
    background: #effaff;
    color: #1890ff;
    position: relative;

    &:after {
      content: '';
      display: block;
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #1890ff;
    }
  }
}

.add-group-btn {
  padding-left: 22px;
  height: 51px !important;
  border-bottom: 1px dashed #eaeaea;
  color: #1890ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.add-group-input {
  padding: 16px 22px 6px;

  .ant-input {
    background: #fbfbfb;
    height: 32px;
    border: 1px solid #eee;
  }
}
</style>

<style>
.ant-popover {
  width: 362px;
}

.ant-popover-inner-content {
  padding: 0;
}
</style>
