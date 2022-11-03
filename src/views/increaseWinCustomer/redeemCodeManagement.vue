<!-- eslint-disable no-unused-vars -->
<template>
  <div class="redeemCodeMangement">
    <a-card>
      <a-form
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 14 }">
        <a-row :gutter="16">
          <a-col :lg="6">
            <a-form-item label="活动名称：">
              <a-input
                v-model="screentData.activityName"
                placeholder="请输入活动名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item label="用户昵称：">
              <a-input
                v-model="screentData.winnerName"
                placeholder="请输入用户昵称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item label="发放状态：">
              <a-select
                v-model="screentData.sendStatus"
                placeholder="请选择发放状态">
                <a-select-option
                  v-for="(item, index) in methodList"
                  :key="index">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item label="核销状态：">
              <a-select
                v-model="screentData.writedStatus"
                placeholder="请选择核销状态">
                <a-select-option
                  v-for="(item, index) in verificationList"
                  :key="index">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item label>
              <a-button
                type="primary"
                @click="searchTable">查询</a-button>
              <a-button
                style="marginLeft:5px"
                @click="reset">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        style="marginTop: 20px"
        :row-key="record => record.id"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        @change="handleTableChange">
        <div
          slot="winnerName"
          slot-scope="text, record">
          <template>
            <span>{{ record.winnerName.length == 0 ? '--' : record.winnerName }}</span>
          </template>
        </div>
        <div
          slot="sendStatus"
          slot-scope="text, record">
          <template>
            <span>{{ record.sendStatus == '0' ? '未发放' : '已发放' }}</span>
          </template>
        </div>
        <div
          slot="sendTime"
          slot-scope="text, record">
          <template>
            <span>{{ record.sendTime.length == 0 ? '--' : record.sendTime }}</span>
          </template>
        </div>
        <div
          slot="writedStatus"
          slot-scope="text, record">
          <template>
            <span>{{ writedStatusObj[record.writedStatus] }}</span>
          </template>
        </div>
        <div
          slot="writedTime"
          slot-scope="text, record">
          <template>
            <span>{{ record.writedTime.length == 0 ? '--' : record.writedTime }}</span>
          </template>
        </div>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { setPrizeGive } from '@/api/increaseWinCustomer.js'

export default {
  data () {
    return {
      tableData: [],
      methodList: [
        {
          label: '未发放',
          value: 0
        },
        {
          label: '已发放',
          value: 1
        }
      ],
      verificationList: [
        {
          label: '未核销',
          value: 0
        },
        {
          label: '已核销',
          value: 1
        },
        {
          label: '未核销（活动结束）',
          value: 2
        },
        {
          label: '已核销（活动结束）',
          value: 3
        }
      ],
      writedStatusObj: {
        0: '未核销',
        1: '已核销',
        2: '未核销（活动已结束）',
        3: '已核销（活动已结束）'
      },
      screentData: {},
      columns: [
        {
          align: 'center',
          title: '兑换码',
          dataIndex: 'redeemCode'
        },
        {
          align: 'center',
          title: '关联活动',
          dataIndex: 'activityName'
        },
        {
          align: 'center',
          title: '发放状态',
          dataIndex: 'sendStatus',
          scopedSlots: { customRender: 'sendStatus' }
        },
        {
          align: 'center',
          title: '发放用户',
          dataIndex: 'winnerName',
          scopedSlots: { customRender: 'winnerName' }

        },
        {
          align: 'center',
          title: '发放时间',
          dataIndex: 'sendTime',
          scopedSlots: { customRender: 'sendTime' }
        },
        {
          align: 'center',
          title: '核销状态',
          dataIndex: 'writedStatus',
          scopedSlots: { customRender: 'writedStatus' }
        },
        {
          align: 'center',
          title: '核销时间',
          dataIndex: 'writedTime',
          scopedSlots: { customRender: 'writedTime' }
        }
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      prizeId: ''
    }
  },
  created () {
    this.getUrl()
  },
  beforeDestroy () {
    localStorage.removeItem('prizeDesc')
  },
  methods: {
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    reset () {
      this.screentData = {}
      this.getTableData()
    },
    searchTable () {
      this.pagination.current = 1
      this.getTableData()
    },
    getTableData () {
      const params = {
        prizeId: this.prizeId,
        activityName: this.screentData.activityName,
        winnerName: this.screentData.winnerName,
        sendStatus: this.screentData.sendStatus,
        writedStatus: this.screentData.writedStatus,
        current: this.pagination.current,
        size: this.pagination.pageSize
      }
      // console.log(params)
      setPrizeGive(params).then((res) => {
        // console.log(res)
        if (res.code !== 200) this.$message.error(res.msg)
        this.tableData = res.data.datas
        this.pagination.total = res.data.total
      })
    },
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符串
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return this.$router.push(`/increaseWinCustomer/taskPrize`)
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('id')) return this.$message.error('奖品id为空')
      const data = JSON.parse(localStorage.getItem('prizeDesc'))
      this.screentData = {
        prizeId: data.id
      }
      this.prizeId = data.id
      this.getTableData()
      return object
    }
  }
}
</script>

<style lang="less" scoped>
</style>
