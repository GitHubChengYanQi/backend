<template>
  <div class="select-group">
    <a-modal v-model="modalShow" on-ok="handleOk" :width="526" :footer="false">
      <template slot="title">
        选择群聊（{{ groups.length }}）
      </template>
      <div class="content">
        <div class="mb12 mt6">
          <a-input-search placeholder="请输入群聊名" v-model="name" @search="getData(null,true)"/>
        </div>
        <div>
          <loading :loading="loading" height="370px" v-if="loading"/>
          <div class="groups" v-else>
            <div class="item" v-for="(v,i) in groups" :key="i" v-if="resetFlag">
              <div class="icon">
                <img src="../../assets/avatar-room-default.svg">
              </div>
              <div class="info">
                <div class="name">
                  {{ v.roomName }}
                </div>
                <!--                <div class="count">-->
                <!--                  {{ v.contact_num }} / {{ v.roomMax }}-->
                <!--                </div>-->
              </div>
              <div>
                <div class="select">
                  <a-checkbox
                    v-if="resetFlag"
                    @change="selectChange($event,v)"
                    :checked="v.select"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="confirm">
          <a-button class="mr10" @click="modalShow = false">取消</a-button>
          <a-button type="primary" @click="confirm">确定</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { optCroup } from '@/api/workRoom'

export default {
  data () {
    return {
      modalShow: false,
      loading: false,
      groups: [],
      currentData: {},
      selectGroup: [],
      name: '',
      resetFlag: true
    }
  },
  methods: {
    getData (fn = null, syncSelect = false) {
      this.loading = true

      optCroup({
        roomGroupId: 0,
        page: 1,
        perPage: 1000,
        workRoomName: this.name
      }).then(res => {
        this.groups = res.data.list

        if (syncSelect) {
          this.selectGroup.forEach(v => {
            const find = this.groups.find(v2 => {
              return v.workRoomId === v2.workRoomId
            })

            find.select = true
          })
        }

        if (fn) fn()

        this.loading = false
      })
    },

    reset () {
      for (const group of this.groups) {
        group.select = false
      }
    },

    setSelect (data, currentData = {}) {
      this.currentData = currentData
      this.getData(_ => {
        this.reset()
        if (data) {
          this.groups.forEach(v2 => {
            data.forEach(v => {
              if (v.workRoomId === v2.workRoomId) {
                v2.select = true
              }
            })
          })
        }
      })
      this.modalShow = true
    },

    selectChange (e, data) {
      this.resetFlag = false
      data.select = e.target.checked
      this.resetFlag = true
      console.log(this.selectGroup)
      if (!data.select) {
        this.selectGroup.deleteObj('workRoomId', data.workRoomId)

        return false
      }

      this.selectGroup.push(data)
    },

    confirm () {
      this.hide()
      const select = this.groups.filter(v => {
        return v.select === true
      })
      this.$emit('change', select, this.currentData)
    },

    show (data = []) {
      this.getData(_ => {
        if (!data.length) return false

        this.groups.forEach(v2 => {
          data.forEach(v => {
            if (v.workRoomId === v2.workRoomId) {
              v2.select = true
            }
          })
        })
      })

      this.reset()
      this.modalShow = true
    },

    hide () {
      this.modalShow = false
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-modal-content {
  height: 549px !important;
}

.groups {
  margin-top: 16px;
  width: 100%;
  height: 366px;
  overflow: auto;

  .item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .icon img {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      margin-right: 11px;
    }

    .info {
      flex: 1;

      .name {
        color: #222;
        font-size: 14px;
        font-weight: 500;
      }

      .count {
        color: #999;
        opacity: .85;
      }
    }

    .select {
      margin-right: 20px;
    }
  }
}

.confirm {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

/deep/ .search {
  width: 100%;
}

/deep/ .ant-modal-title {
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
}

/deep/ .ant-modal-body {
  padding-right: 16px;
  padding-top: 0;
}
</style>
