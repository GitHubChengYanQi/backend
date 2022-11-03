<template>
  <div class="box">
    <div class="flex">
      <div class="left">
        <div class="block mb23">
          <div class="title">
            <a-icon type="user-add" class="mr3" />添加员工信息
          </div>
          <div class="table">
            <a-table
              size="middle"
              bordered
              :columns="table.member.col"
              :data-source="table.member.data"
              :pagination="false"
            />
          </div>
        </div>
        <div class="block">
          <div class="title">
            <a-icon type="tag" class="mr3" />基本信息
            <span class="edit" v-if="!isInfoEdit" @click="isInfoEdit = true">编辑</span>
            <span class="edit" v-else @click="infoSave">保存</span>
          </div>
          <div class="info-table flex">
            <div class="item">
              <span class="label">姓名</span>
              <span class="content">{{ basicData.name || '-' }}</span>
            </div>
            <div class="item">
              <span class="label">身份证</span>
              <span class="content">{{ basicData.idCard || '-' }}</span>
            </div>
            <div class="item">
              <span class="label">电话</span>
              <span class="content">{{ basicData.mobile || '-' }}</span>
            </div>
            <div class="item">
              <span class="label">性别</span>
              <span
                class="content"
              >{{ basicData.gender === 0 ? '未知' : basicData.gender === 1 ? '男性' : '女性' }}</span>
            </div>
            <div class="item">
              <span class="label">年龄</span>
              <span class="content">{{ basicData.ageNum || '-' }}</span>
            </div>
            <div class="item" v-for="(item,index) in info" :key="index">
              <div
                class="label"
              >{{ item.name }} {{ item.secData.type === 'checkbox' ? '(多选)' : '' }}</div>
              <div class="content" v-if="!isInfoEdit">
                {{ item.dataName || '-' }}
                <!-- <input
                  v-model="v.dataName"
                  type="text"
                  class="content-input"
                  placeholder="-"
                  @blur="updateInfo(v)"
                  @keyup.enter="updateInfo(v)"
                >-->
              </div>
              <div class="content selectBox" v-else>
                <a-select
                  :value="item.secData.type === 'checkbox' ? item.dataName ? item.dataName.split(',') : [] : item.dataName"
                  :mode="item.secData.type === 'checkbox' ? 'multiple' : 'default'"
                  @change="(value) => userInfoSelectChange(value, item.secData.type, index, item.secData.records)"
                >
                  <a-select-option
                    v-for="(it, idx) in item.secData.records"
                    :key="idx"
                    :value="it.name"
                  >{{ it.name }}</a-select-option>
                </a-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right step-box mt16">
        <div class="header-box flex-between mb23">
          <span class="title">
            <a-icon type="fire" class="mr3" />客户动态
          </span>
          <span class="down" @click="$emit('goNews')">
            查看更多
            <a-icon type="right" />
          </span>
        </div>
        <stepNews v-model="track" />
      </div>
    </div>
  </div>
</template>

<script>
import stepNews from '@/components/StepNews/StepNews'
import { track, editUserPortrait, saveUserInfoReq } from '@/api/workContact'
import { deepClonev2 } from '@/utils/util'

export default {
  data () {
    return {
      table: {
        member: {
          col: [
            {
              title: '所属员工',
              dataIndex: 'employeeName'
            },
            {
              title: '客户来源',
              dataIndex: 'addWay'
            },
            {
              title: '添加时间',
              dataIndex: 'createTime'
            },
            {
              title: '最近沟通时间',
              dataIndex: 'lastMessageTime'
            }
          ],
          data: []
        }
      },
      basicData: {},
      info: {},
      isInfoEdit: false,
      track: [],
      contactId: 0,
      employeeId: 0
    }
  },
  methods: {
    getContactId () {
      if (this.$route.query.contactId !== undefined) {
        this.contactId = this.$route.query.contactId
      } else if (this.$route.query.id !== undefined) {
        this.contactId = this.$route.query.id
      }
    },
    updateInfo (e) {
      e.name = e.label
      if (!e.value) {
        return
      }
      this.getContactId()
      editUserPortrait({
        employeeId: this.employeeId,
        userPortrait: [e],
        contactId: this.contactId
      }).then(() => {
        this.$message.success('编辑成功')
      })
    },

    getTrackData () {
      this.getContactId()
      track({
        contactId: this.contactId,
        type: 2
      }).then(res => {
        this.track = res.data
      })
    },

    setData (member, info) {
      this.getTrackData()
      this.table.member.data = member
      const data = deepClonev2(info)
      this.info = data.addInfo
      delete data.addInfo
      this.basicData = data
    },
    getEmployeeId (e) {
      this.employeeId = e
    },

    userInfoSelectChange (value, type, index, options) {
      const infoNowD = deepClonev2(this.info)
      let findIdx, val, dataVal
      if (type === 'checkbox') {
        val = options.filter(it => value.includes(it.name)).map(it => it.key).join(',')
        dataVal = value.join(',')
      } else {
        findIdx = options.findIndex(it => it.name === value)
        val = options[findIdx].key
        dataVal = value
      }
      infoNowD[index].data = val
      infoNowD[index].dataName = dataVal
      this.info = infoNowD
    },

    async infoSave () {
      const processInfo = this.info.map(({ key, name, data, dataName }) => ({
        key,
        name,
        data,
        dataName
      }))
      const data = {
        contactId: this.contactId,
        source: 4,
        secList: processInfo
      }
      await saveUserInfoReq(data)
      this.$message.success('保存成功！')
      this.isInfoEdit = false
    }
  },
  components: { stepNews }
}
</script>

<style lang="less" scoped>
.box > .flex {
  align-items: start;
}

.content-input {
  border: none;
  outline: none;
  padding-bottom: 3px;

  &:hover {
    border-bottom: 1px solid #333;
  }
}

.left {
  flex: 1;

  .title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
    .edit {
      float: right;
      padding: 1px 10px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      cursor: pointer;
    }
  }
}

.right {
  margin-left: 70px;
  width: 420px;
  min-width: 420px;
  padding-right: 12px;
}

.info-table {
  width: 100%;
  border-bottom: none;
  flex-wrap: wrap;
  border-top: 1px solid #f2f2f2;

  .item {
    width: 50%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;

    &:nth-child(1n) {
      border-left: 1px solid #f2f2f2;
    }

    &:nth-child(2n) {
      border-right: 1px solid #f2f2f2;
    }

    &:last-child {
      border-right: 1px solid #f2f2f2;
    }
  }

  .label {
    display: flex;
    align-items: stretch;
    background: #fbfbfb;
    width: 30%;
    padding: 12px 16px;
    margin-right: 1px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
    border-right: 1px solid #f2f2f2;
  }

  .content {
    width: 70%;
    padding: 12px 16px;
    display: flex;
    align-items: stretch;
    background: #fff;
    color: rgba(0, 0, 0, 0.85);
    font-size: 12px;
    flex-direction: column;
    .show {
    }
  }
  .selectBox {
    padding: 0 16px;
  }
}

.step-box {
  max-height: 500px;
  overflow: auto;

  .title {
    color: #000000d9;
    font-size: 13px;
    font-weight: 700;
  }

  .down {
    cursor: pointer;
    font-size: 12px;
    color: #00000073;
  }
}

/deep/ .ant-table-thead th {
  background: #fbfbfb !important;
  color: #000000a6;
  font-size: 14px !important;
}

/deep/ .ant-table-bordered .ant-table-thead > tr > th {
  border-right: 1px solid #f2f2f2;
}

/deep/ .ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px solid #f2f2f2;
}
</style>
