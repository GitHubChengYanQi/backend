<template>
  <div>
    <!--search-->
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row :gutter="16">
          <a-col :lg="6">
            <a-form-item label="手机号：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
              <a-input v-model="screenData.phone" placeholder="请输入手机号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item label="会员卡号：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
              <a-input v-model="screenData.memberNo" placeholder="请输入活会员卡号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item label="参与时间：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
              <a-range-picker
                style="width: 300px"
                v-model="time"
                format="YYYY-MM-DD"
                :placeholder="['开始日期', '结束日期']"
                @change="onOk"
              />
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
          <span>活动名称：{{ record.activityName }}</span>
          <span>累计产生获奖机会次数：{{ record.awardTimes }}次</span>
          <span>累计分享次数：{{ record.shareTimes }}次</span>
          <span>活累计参与人数：{{ record.partakeNum }}人</span>
          <span>累计点击人数：{{ record.clickNum }}人</span>
          <span>活动转化率：{{ record.coverRate }}%</span>
        </div>
        <div class="fr">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button @click="resetSearch">重置</a-button>
          <!-- <a-button type="primary" :loading="loading" @click="exportFn">导出</a-button> -->
          <a-dropdown>
            <a-menu slot="overlay" @click="exportFn">
              <a-menu-item key="Execl"> Execl </a-menu-item>
              <a-menu-item key="Text"> Text </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 导出 <a-icon type="down" /> </a-button>
          </a-dropdown>
        </div>
      </div>
      <a-table
        rowKey="erpOrderNo"
        :loading="loading"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :pageSizeOptions="['10', '20', '30', '50']"
        :scroll="{ x: 1500 }"
        @change="handleTableChange"
      >
      </a-table>
    </div>
    <!--end table-->
  </div>
</template>

<script>
import moment from 'moment'
import { activityVideoInfoMemberStatistics, activityVideoInfoMemberIndex, memberExportExcel, memberExportTxt } from '@/api/marketing'
import { deepClone } from '@/utils/util'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
export default {
  name: 'DrawData',
  data () {
    return {
      loading: false,
      screenData: {},
      record: {},
      time: [],
      columns: [
        {
          title: '参与时间',
          dataIndex: 'awardTime',
          align: 'center',
          width: 300
        },
        {
          title: '会员卡号',
          dataIndex: 'memberNo',
          width: 200
        },
        {
          title: '微信昵称',
          dataIndex: 'nickName',
          align: 'left',
          width: 200
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          align: 'center',
          width: 200
        },
        {
          title: '获得方式',
          dataIndex: 'awardChannel',
          align: 'center',
          width: 200
        },
        {
          title: '获得次数',
          dataIndex: 'awardTimes',
          align: 'center',
          width: 100
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  created () {
    this.initFn()
  },
  methods: {
    deepClone,
    /**
     * 初始化
     */
    initFn () {
      this.screenData.activityId = this.$route.query.id
      this.getData()
      this.getTableData()
    },
    /**
     * 拉取统计
     */
    getData () {
      this.loading = true
      activityVideoInfoMemberStatistics(this.screenData).then((res) => {
        this.loading = false
        this.record = res.data
      })
    },
    /**
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        ...this.screenData
      }
      delete params.time
      activityVideoInfoMemberIndex(params).then((res) => {
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
      this.getData()
      this.getTableData()
    },
    /**
     * 重置查询
     */
    resetSearch () {
      this.time = []
      this.screenData = {}
      this.screenData.activityId = this.$route.query.id
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      const sort = {}
      if (sorter.order) {
        if (sorter.order === 'ascend') {
          sort.sort = `${sorter.field}Asc`
        } else {
          sort.sort = `${sorter.field}Desc`
        }
      }
      this.screenData = { ...this.screenData, ...sort }
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getTableData()
    },
    /**
     * 删除最后一页数据分页处理
     */
    isFillList () {
      const totalPage = Math.ceil((this.pagination.total - 1) / this.pagination.pageSize) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
      this.getTableData()
    },
    /**
     * 取消
     */
    reset () {
      this.modalVisible = false
    },
    /**
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      if (value.length > 0) {
        this.screenData.startTime = moment(value[0]).format('YYYY-MM-DD')
        this.screenData.endTime = moment(value[1]).format('YYYY-MM-DD')
      } else {
        delete this.screenData.startTime
        delete this.screenData.endTime
      }
    },
    /**
     * 导出
     */
    exportFn (type) {
      console.log('导出', type)
      delete this.screenData.time
      if (type.key === 'Execl') {
        this.loading = true
        memberExportExcel(this.screenData).then((res) => {
          this.loading = false
          callDownLoadByBlob(res, '会员数据')
        })
      } else {
        this.loading = true
        memberExportTxt(this.screenData).then((res) => {
          this.loading = false
          callDownLoadByBlob(res, '会员数据')
        })
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
    display: flex;

    .fl {
      flex:1;
      span {
        font-size: 14px;
        margin-right: 15px;
      }

      button {
        margin-right: 10px;
      }
    }

    .fr {
      width:300px;
      text-align: right;

      & > * {
        margin-left: 10px;
      }

      .labelSpan {
        font-style: normal;
        margin-right: 10px;

        &::after {
          content: '>';
          margin-left: 10px;
        }
      }

      .labelSpan:last-child {
        &::after {
          content: '';
        }
      }
    }
  }

  .flagTxt {
    span {
      position: relative;
      padding-left: 20px;

      &::before {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        content: '';
        position: absolute;
        left: -5px;
        top: 3px;
        display: block;
      }
    }

    .green {
      background: #42b136;
    }

    .gray {
      background: #aaa;
    }

    .orange {
      background: #f59a23;
    }
  }
}

.box {
  img {
    width: 100%;
    height: auto;
  }
}

.action {
  a {
    margin-right: 5px;
  }
}

.inputNum {
  width: 400px;
}

.modalBox {
  .head {
    .fl {
      float: left;

      span {
        display: block;
      }
    }

    .fr {
      float: right;
      margin-top: 40px;

      span {
        margin-right: 10px;
      }
    }
  }
}

.inputBox {
  display: flex;

  span.input {
    flex: 1;
  }

  span.sign {
    width: 20px;
    text-align: center;
  }
}

.labelBody{
  /deep/ .ant-form-item-label{
    label{
      text-align: center;
      .labelBox{
        float:initial !important;
      }
      &::after{
        display:none;
      }
    }
  }
}
</style>
