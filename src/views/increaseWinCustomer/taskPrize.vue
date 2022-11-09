<!-- eslint-disable vue/valid-v-on -->
<template>
  <div class="taskPrize">
    <a-card>
      <a-form
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 14 }">
        <a-row :gutter="16">
          <a-col :lg="7">
            <a-form-item label="奖品名称：">
              <a-input
                v-model="screentData.prizeName"
                placeholder="请输入奖品名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="7">
            <a-form-item label="奖品码：">
              <a-input
                v-model="screentData.prizeCode"
                placeholder="请输入奖品码"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="search">
        <router-link :to="{path: '/increaseWinCustomer/taskPrize/addPrize'}">
          <a-button
            type="primary"
            v-permission="'/customer_activity_prize_detail/save#post'">+新建奖品</a-button>
        </router-link>
        <div class="operation-box">
          <a-button
            type="primary"
            style="marginRight: 10px"
            v-permission="'/customer_activity_prize_detail/find#post'"
            @click="searchTable">查询</a-button>
          <a-button @click="reset">重置</a-button>
        </div>
      </div>
      <div class="operation_table">
        <a-table
          style="marginTop: 20px"
          :columns="columns"
          :data-source="tableData"
          :row-key="record => record.id"
          :pagination="pagination"
          @change="handleTableChange">
          <div
            slot="prizeName"
            slot-scope="text, record">
            <template>
              <ul class="prizeName_div">
                <li class="table_div">{{ record.prizeName }}</li>
                <li class="table_div">{{ record.prizeCode }}</li>
              </ul>
            </template>
          </div>
          <div
            slot="byActivity"
            slot-scope="text, record">
            <template>
              <a-popover title="已关联活动" v-if="record.byActivity.length > 0">
                <template slot="content">
                  <div class="labelBox">
                    <a-tag v-for="(item, index) in record.byActivity" :key="index">{{ item.name }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看（{{ record.byActivity.length }}）
                </a-tag>
              </a-popover>
              <span class="nolabel" v-else>无活动（{{ record.byActivity.length }}）</span>
            </template>
          </div>
          <div
            slot="action"
            slot-scope="text, record">
            <template>
              <a-button
                type="link"
                v-permission="'/customer_activity_prize_detail/compile#post'"
                @click="toPath('/increaseWinCustomer/taskPrize/redactPrize',record)">编辑</a-button>
              <a-button
                type="link"
                v-permission="'/customer_activity_prize_detail/give#post'"
                @click="toPath('/increaseWinCustomer/taskPrize/redeemCodeManagement',record)">兑换码管理</a-button>
            </template>
          </div>
        </a-table>
      </div>

    </a-card>
  </div>
</template>

<script>
import { setPrizeFind } from '@/api/increaseWinCustomer.js'

export default {
  data () {
    return {
      hiddenIndex: -1,
      channelCodeId: '',
      columns: [
        {
          align: 'center',
          title: '奖品名称/奖品码',
          dataIndex: 'prizeName',
          scopedSlots: { customRender: 'prizeName' }
        },
        {
          align: 'center',
          title: '已关联活动',
          dataIndex: 'byActivity',
          scopedSlots: { customRender: 'byActivity' }
        },
        {
          align: 'center',
          title: '创建时间',
          sorter: true,
          dataIndex: 'createdAt'
        },
        {
          align: 'center',
          title: '创建者',
          dataIndex: 'userName'
        },
        {
          align: 'center',
          title: '操作',
          width: '250px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      screentData: {},
      groupList: [],
      filters: {}
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      const params = {
        prizeName: this.screentData.prizeName,
        prizeCode: this.screentData.prizeCode,
        orderBy: this.screentData.orderBy,
        current: this.pagination.current,
        size: this.pagination.pageSize
      }
      // console.log(params)
      setPrizeFind(params).then((res) => {
        // console.log(res)
        if (res.code !== 200) this.$message.error(res.msg)
        this.tableData = res.data.datas
        this.pagination.total = res.data.total
      })
    },
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.filters = filters
      if (sorter.order) {
        this.screentData.orderBy = sorter.order === 'ascend' ? 'CreatedAtAsc' : ''
        this.getTableData()
        return
      }
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    setHiddenIndex (e) {
      // console.log(e)
      this.hiddenIndex = e
    },
    toPath (path, record) {
      localStorage.setItem('prizeDesc', JSON.stringify(record))
      this.$router.push(`${path}?id=${record.id}`)
    },
    reset () {
      this.screentData = {}
      this.getTableData()
    },
    searchTable () {
      const params = {
        prizeName: this.screentData.prizeName,
        prizeCode: this.screentData.prizeCode,
        orderBy: this.screentData.orderBy
      }
      this.pagination.current = 1
      // console.log(params)
      setPrizeFind(params).then((res) => {
        // console.log(res)
        if (res.code !== 200) this.$message.error(res.msg)
        this.tableData = res.data.datas
        this.pagination.total = res.data.total
      })
    }
  }
}
</script>

<style lang="less" scoped>
.taskPrize {
  .search {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .prizeName_div {
    display: flex;
    flex-direction: column;
    .table_div {
      max-width: 320px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .look_div {
    position: relative;
    display: flex;
    justify-content: center;

    .look_btn {
      margin-left: 20px;
      color: #3470ff;
      cursor: pointer;
    }
    .hidden_div {
      z-index: 1;
      max-height: 130px;
      color: #000000a6;
      position: absolute;
      padding: 10px;
      display: flex;
      flex-direction: column;
      font-size: 16px;
      letter-spacing: 1px;
      line-height: 26px;
      background-color: #fff;
      border-radius: 10px;
      border: 1px solid #ccc;
      overflow: auto;

      .hidden_span {
        min-width: 117px;
        display: flex;
        font-size: 16px;
        letter-spacing: 1px;
        line-height: 26px;
        white-space: nowrap;
      }
    }
  }
}
.labelBox{
  width:400px;
  span{
    margin-bottom:10px;
  }
}
</style>
