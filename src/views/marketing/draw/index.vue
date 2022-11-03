<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="6">
              <a-form-item label="活动名称：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-input v-model="screenData.name" placeholder="请输入活动名称"></a-input>
              </a-form-item>
            </a-col>
            <!-- <a-col :lg="12">
              <a-form-item label="活动时间：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-range-picker
                  style="width: 300px"
                  v-model="time"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期', '结束日期']"
                  @change="onOk"
                />
              </a-form-item>
            </a-col> -->
            <a-col :lg="6">
              <a-form-item
                label="活动状态："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }" >
                <a-select v-model="screenData.status" placeholder="请选择">
                  <a-select-option v-for="(item,index) in statusList" :key="index" :value="item.code">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="6">

            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--end search-->

      <!--table-->
      <div class="table-wrapper">
        <div class="table-head">
          <div class="fl">
            <a-button type="primary" :loading="loading" v-permission="'/activityVideoInfo/index@create'" @click="addFn">新建活动</a-button>
          </div>
          <div class="fr">
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
          :pageSizeOptions="['10', '20', '30', '50']"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <div slot="action" class="action" slot-scope="text, record">
            <template>
              <a v-permission="'/activityVideoInfo/index@data'" @click="dataFn(record)">数据</a>
              <a v-permission="'/activityVideoInfo/index@edit'" @click="editFn(record)">编辑</a>
              <a v-if="record.status!=='2'" v-permission="'/activityVideoInfo/index@del'" @click="delFn(record)">删除</a>
              <a v-permission="'/activityVideoInfo/index@copy'" @click="copyFn(record)">复制链接</a>
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { activityVideoInfo, activityVideoInfoDelete } from '@/api/marketing'
import { getDict } from '@/api/common'
import { deepClone } from '@/utils/util'
export default {
  data () {
    return {
      loading: false,
      screenData: {},
      statusList: [],
      time: [],
      columns: [
        {
          title: '活动名称',
          dataIndex: 'name',
          align: 'center',
          width: 300,
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          width: 200,
          align: 'left',
          sorter: true,
          sortName: 'orderByCreateAt'
        },
        {
          title: '创建者',
          dataIndex: 'createdBy',
          align: 'left',
          width: 200
        },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          align: 'center',
          sorter: true,
          width: 200,
          sortName: 'orderByStartTime'
        },
        {
          title: '结束时间',
          dataIndex: 'endTIme',
          align: 'center',
          sorter: true,
          width: 200,
          sortName: 'orderByEndTime'
        },
        {
          title: '活动状态',
          dataIndex: 'statusName',
          align: 'center',
          width: 100
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 300,
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
      this.getDict()
      this.getTableData()
    },
    /**
     * 获取字典
     */
    getDict () {
      getDict({ dictType: 'video_activity_status' }).then(res => {
        this.statusList = res.data
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
      activityVideoInfo(params).then((res) => {
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
      this.time = []
      this.screenData = {}
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      const sort = {}
      console.log(sorter.order)
      if (sorter.order) {
        if (sorter.order === 'ascend') {
          sort[sorter.column.sortName] = 'ASC'
        } else {
          sort[sorter.column.sortName] = 'DESC'
        }
      }
      delete this.screenData.orderByCreateAt
      delete this.screenData.orderByStartTime
      delete this.screenData.orderByEndTime
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
     * 详情
     */
    detailFn (record) {
      this.$router.push({
        path: '/marketing/drawDetail',
        query: {
          id: record.id
        }
      })
    },
    /**
     * 数据
     */
    dataFn (record) {
      this.$router.push({
        path: '/marketing/drawData',
        query: {
          id: record.id
        }
      })
    },
    /**
     * 新增
     */
    addFn () {
      console.log('新增')
      this.$router.push({
        path: '/marketing/drawAdd'
      })
    },
    /**
     * 编辑
     */
    editFn (record) {
      console.log('编辑')
      this.$router.push({
        path: '/marketing/drawEdit',
        query: {
          id: record.id,
          state: record.status
        }
      })
    },
    /**
     * 删除
     */
    delFn (record) {
      console.log('删除', record)
      const _this = this
      this.$confirm({
        title: '确定删除该活动？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          activityVideoInfoDelete({ id: record.id }).then(res => {
            _this.$message.success('删除成功！')
            _this.getTableData()
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    /**
     * 复制链接
     */
    copyFn (record) {
      this.$copyText(record.hyperlink).then(message => {
        console.log('copy', message)
        this.$message.success('复制完毕')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
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
