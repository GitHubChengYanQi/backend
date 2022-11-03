<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="6">
              <a-form-item
                label="微信昵称："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 14} }"
              >
                <a-input v-model="screenData.userName" placeholder="请输入"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item
                label="活动参与情况："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 14} }"
              >
                <a-select v-model="screenData.partakeState" placeholder="请选择">
                  <a-select-option v-for="item in partakeStateDict" :key="item.code">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item
                label="渠道来源："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 14} }"
              >
                <a-select v-model="screenData.chanelName" placeholder="请选择">
                  <a-select-option v-for="item in chanelDict" :key="item.code">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item
                label="关注状态："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 14} }"
              >
                <a-select v-model="screenData.atStatus" placeholder="请选择">
                  <a-select-option v-for="item in atStatusDict" :key="item.code">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--end search-->

      <!--table-->
      <div class="table-wrapper">
        <div class="table-head">
          <div class="fl">
            活动时间：{{ statistics.activityTime }}
          </div>
          <div class="fr">
            总数与人数：{{ statistics.partakeNum }}人   总助力人数：{{ statistics.helpNum }}人    取关人数：{{ statistics.takeOffNum }}人
            <a-button type="primary" @click="search">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
          </div>
        </div>
        <a-table
          rowKey="id"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <div slot="userName" slot-scope="text,record">
            <template>
              <p class="userName">
                <img :src="record.headImg" />
                <span>{{ record.userName }}</span>
              </p>
            </template>
          </div>
          <div slot="appName" slot-scope="text,record">
            <template>
              <p>{{ record.appName }}</p>
              <p :class="record.atStatus === '1'?'green':''">{{ record.atStatus === '1' ? '(关注中)' : '(已取关)' }}</p>
            </template>
          </div>
          <div slot="invitedNum" slot-scope="text,record">
            <template>
              <p>{{ text }}人({{ record.takeOffNum }}人已取关)</p>
            </template>
          </div>
          <div slot="partakeState" slot-scope="text">
            <template>
              <p>{{ getPartakeState(text) }}</p>
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->
    </a-card>
  </div>
</template>

<script>
import { getDict } from '@/api/common'
import { queryStatistics, queryList, chanelList } from '@/api/wxCustomer'
export default {
  data () {
    return {
      id: '',
      loading: false,
      screenData: {},
      statistics: {},
      columns: [
        {
          title: '用户',
          dataIndex: 'userName',
          align: 'center',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '所属公众号',
          dataIndex: 'appName',
          align: 'center',
          scopedSlots: { customRender: 'appName' }
        },
        {
          title: '渠道来源',
          dataIndex: 'chanelName',
          align: 'left'
        },
        {
          title: '活动参与情况',
          dataIndex: 'partakeState',
          align: 'center',
          scopedSlots: { customRender: 'partakeState' }
        },
        {
          title: '邀请人数',
          sorter: true,
          sorterKey: 'orderByInvitedNum',
          dataIndex: 'invitedNum',
          align: 'center',
          scopedSlots: { customRender: 'invitedNum' }
        },
        {
          title: '参与活动时间',
          dataIndex: 'partakeTime',
          align: 'center'
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      partakeStateDict: [],
      atStatusDict: [],
      chanelDict: [],
      sorter: {}
    }
  },
  created () {
    this.initFn()
  },
  methods: {
    /**
     * 初始化
     */
    initFn () {
      this.id = this.$route.query.id
      this.queryStatistics()
      this.getTableData()
      getDict({ 'dictType': 'partake_state' }).then(res => {
        this.partakeStateDict = res.data
      })
      getDict({ 'dictType': 'at_status' }).then(res => {
        this.atStatusDict = res.data
      })
      chanelList({ 'activityId': this.id }).then(res => {
        this.chanelDict = res.data
      })
    },
    /**
     * 拉取统计数据
     */
    queryStatistics () {
      const params = {
        activityId: this.id,
        userName: this.screenData.userName,
        partakeState: this.screenData.partakeState,
        chanelName: this.screenData.chanelName,
        atStatus: this.screenData.atStatus
      }
      queryStatistics(params).then((res) => {
        this.statistics = res.data
      })
    },
    /**
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      const params = {
        activityId: this.id,
        userName: this.screenData.userName,
        partakeState: this.screenData.partakeState,
        chanelName: this.screenData.chanelName,
        atStatus: this.screenData.atStatus,
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      const { order, column } = this.sorter
      if (order === 'ascend') {
        params[column.sorterKey] = 'ASC'
      } else if (order === 'descend') {
        params[column.sorterKey] = 'DESC'
      }
      queryList(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.pagination.total = res.data.page.total
      })
    },
    /**
     * 查询
     */
    search () {
      this.pagination.current = 1
      this.getTableData()
      this.queryStatistics()
    },
    /**
     * 重置查询
     */
    resetSearch () {
      this.screenData = {}
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.sorter = sorter
      this.getTableData()
    },
    /**
     * 返回活动参与情况名称
     */
    getPartakeState (code) {
      const arr = this.partakeStateDict
      for (let i = 0; i < arr.length; i++) {
        if (code === arr[i].code) {
          return arr[i].name
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.alter {
  width: 80%;
  height: 50px;
  background: #e6f7ff;
  border: 1px solid #c2eaff;
  padding: 0 15px;
  span {
    line-height: 50px;
    margin-left: 10px;
  }
}
.table-wrapper {
  margin-top: 20px;
  .table-head {
    height: 50px;
    & > div {
      width: 50%;
    }
    .fl {
      float: left;
    }
    .fr {
      float: right;
      text-align: right;
      & > * {
        margin-left: 10px;
      }
    }
  }
  .userName{
    img{
      width:50px;
      height:50px;
      border-radius: 50%;
      margin-right:10px;
      border:1px solid #ccc;
    }
  }
  .green {
      color: #42b136;
    }
}
.box{
  img{
    width:100%;
    height:auto;
  }
}
</style>
