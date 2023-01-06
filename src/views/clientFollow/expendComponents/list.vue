<template>
  <div>
    <!--search-->
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row :gutter="16">
          <a-col :lg="8" :md="6">
            <a-form-item label="搜索用户：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
              <a-input v-model="screenData.nickName" />
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="6">
            <a-form-item
              label="下单时间范围："
              :labelCol="{lg: {span: 7} }"
              :wrapperCol="{lg: {span: 17} }">
              <a-range-picker
                :allowClear="false"
                v-model="date"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
                @change="handleChange"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="6">
            <a-button type="primary" @click="search">查询</a-button>&nbsp;
            <a-button @click="resetSearch">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--end search-->

    <!--table-->
    <div class="table-wrapper">
      <!-- <div class="table-head">
          <div class="fl"></div>
          <div class="fr">
            <a-button
              type="primary"
              @click="search">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
          </div>
        </div> -->
      <a-table
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :scroll="{ x: 1500}">
      </a-table>
    </div>
    <!--end table-->

  </div>
</template>

<script>
import { consumeAutoLabelRuleDetailIndex } from '@/api/clientFollow.js'
export default {
  data () {
    return {
      loading: false,
      date: [],
      screenData: {
        nickName: '',
        startTime: '',
        endTime: ''
      },
      columns: [
        {
          title: '客户昵称',
          dataIndex: 'nickName',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'nickName' }
        },
        {
          title: '触发规则的订单编号',
          dataIndex: 'orderNo',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'orderNo' }
        },
        {
          title: '下单时间',
          dataIndex: 'orderTime',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'orderTime' }
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
    /**
       * 初始化
       */
    initFn () {
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
      consumeAutoLabelRuleDetailIndex(params).then((res) => {
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
      this.selectedRowKeys = []
      this.selectedRows = []
      // this.screenData.erpOrderNos = ''
      this.getTableData()
    },
    /**
       * 重置查询
       */
    resetSearch () {
      this.screenData = {
        nickName: '',
        startTime: '',
        endTime: ''
      }
      this.date = ''
      this.search()
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
       * 时间回调
       * @param {*} e
       */
    handleChange (e) {
      this.screenData.startTime = e[0]
      this.screenData.endTime = e[1]
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
    .table-head {
      height: 50px;
      & > div {
        width: 50%;
      }
      .fl {
        float: left;
        span{
          font-size:16px;
          margin-right:10px;
        }
        button{
          margin-right:10px;
        }
      }
      .fr {
        float: right;
        text-align: right;
        & > * {
          margin-left: 10px;
        }
        .labelSpan{
          font-style:normal;
          margin-right:10px;
          &::after{
            content:'>';
            margin-left:10px;
          }
        }
        .labelSpan:last-child{
          &::after{
            content:'';
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
  .inputNum{
    width:400px;
  }
  .modalBox{
    .total{
      margin-top:10px;
      text-align: right;
    }
  }
  .inputBox{
    display:flex;
    span.input{
      flex:1;
    }
    span.sign{
      width:20px;
      text-align: center;
    }
  }
  .news {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      //img {
      //  width: 40px;
      //  height: 40px;
      //}
    }
    .labelBox{
      width:500px;
      span{
        margin-bottom:8px;
      }
    }
  </style>
