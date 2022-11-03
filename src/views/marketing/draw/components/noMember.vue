<template>
  <div>
    <!--search-->
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row :gutter="16">
          <a-col :lg="6">
            <a-form-item label="点击时间：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
              <a-range-picker
                style="width: 300px"
                v-model="screenData.time"
                format="YYYY-MM-DD"
                :placeholder="['开始日期', '结束日期']"
                @change="onOk"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="6" style="text-align: center;">

          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--end search-->

    <!--table-->
    <div class="table-wrapper">
      <div class="table-head">
        <div class="fl"></div>
        <div class="fr">
          <a-button type="primary" @click="search">查询</a-button>&nbsp;
          <a-button @click="resetSearch">重置</a-button>&nbsp;
          <a-button type="primary" :loading="loading" @click="exportFn">导出</a-button>
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
import { activityVideoInfoNoMemberIndex, noMemberExportExcel } from '@/api/marketing'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
export default {
  name: 'DrawData',
  data () {
    return {
      loading: false,
      screenData: {},
      columns: [
        {
          title: '点击时间',
          dataIndex: 'awardTime',
          align: 'center',
          width: 300
        },
        {
          title: '微信昵称',
          dataIndex: 'nickName',
          width: 200,
          align: 'left'
        }
        // {
        //   title: '手机号',
        //   dataIndex: 'phone',
        //   align: 'left',
        //   width: 200
        // }
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
    /**
     * 初始化
     */
    initFn () {
      this.screenData.activityId = this.$route.query.id
      this.getTableData()
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
      activityVideoInfoNoMemberIndex(params).then((res) => {
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
    },
    /**
     * 重置查询
     */
    resetSearch () {
      this.screenData = {}
      this.screenData.activityId = this.$route.query.id
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      const sort = {}
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
     * 表格选择监听
     * @param {*} selectedRowKeys
     */
    onSelectChange (selectedRowKeys, row) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = row
      this.screenData.erpOrderNos = selectedRowKeys.join(',')
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
    exportFn () {
      delete this.screenData.time
      this.loading = true
      noMemberExportExcel(this.screenData).then((res) => {
        this.loading = false
        callDownLoadByBlob(res, '非会员数据')
      })
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

      span {
        font-size: 16px;
        margin-right: 10px;
      }

      button {
        margin-right: 10px;
      }
    }

    .fr {
      float: right;
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
