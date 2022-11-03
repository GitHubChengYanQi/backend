<template>
  <!-- 分配记录 -->
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="6">
              <a-form-item label="客户昵称：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-input v-model="screenData.contactName" placeholder="请输入客户昵称"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="现主维护人：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <selectPersonnel :num="1" v-model="screenData.maintainerIds" @getVal="changeMaintainerIds" />
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="主维护人门店：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <SelectDepartment :treeCheckStrictly="true" @getDept="getDept" v-model="screenData.storeIds" />
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="分配人：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <selectPersonnel :num="1" v-model="screenData.assigneeIds" @getVal="changeAssigneeIds" />
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="分配时间" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-range-picker
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
          <div class="fr">
            <a-button type="primary" @click="search" v-permission="'/maintainerRecord/pageList@search'">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
            <!-- <a-button type="primary" :loading="loading" @click="exportFn">导出</a-button> -->
          </div>
        </div>
        <a-table
          rowKey="id"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
          <div slot="news" slot-scope="text, record">
            <div class="news">
              <img :src="record.contactAvatar" :style="'cursor: pointer'" />
              <div class="name">
                {{ record.contactName }}
                <br />
                <!-- {{ record.contactRemark }} -->
              </div>
            </div>
          </div>
          <div slot="oldMaintainerName" slot-scope="text">
            {{ text ? text : '-' }}
          </div>
          <div slot="newMaintainerName" slot-scope="text">
            {{ text ? text : '-' }}
          </div>
          <div slot="newMaintainerDepartmentName" slot-scope="text">
            {{ text ? text : '-' }}
          </div>
          <div slot="newMaintainerStoreName" slot-scope="text">
            {{ text ? text : '-' }}
          </div>
          <div slot="assigneeName" slot-scope="text">
            {{ text ? text : '-' }}
          </div>
        </a-table>
      </div>
      <!--end table-->
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { getRecordList, exportRecord } from '@/api/maintainer'
import { deepClone } from '@/utils/util'
import { departmentList } from '@/api/common.js'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
export default {
  data () {
    return {
      loading: false,
      screenData: {
        maintainerIds: [],
        storeIds: [],
        assigneeIds: [],
        ids: []
      },
      time: [],
      storeIds: [],
      selectedRowKeys: [], // 选中key
      selectedRows: [], // 选中row
      columns: [
        {
          title: '客户昵称',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'news' }
        },
        {
          title: '原主维护人',
          dataIndex: 'oldMaintainerName',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'oldMaintainerName' }
        },
        {
          title: '现主维护人',
          dataIndex: 'newMaintainerName',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'newMaintainerName' }
        },
        {
          title: '现主维护人所属机构',
          dataIndex: 'newMaintainerDepartmentName',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'newMaintainerDepartmentName' }
        },
        {
          title: '所属门店',
          dataIndex: 'newMaintainerStoreName',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'newMaintainerStoreName' }
        },
        {
          title: '分配人',
          dataIndex: 'assigneeName',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'assigneeName' }
        },
        {
          title: '分配时间',
          dataIndex: 'allocateTime',
          align: 'center',
          width: 150,
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          }
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
      deptTreeData: [],
      replaceFields: {
        children: 'childDepartment',
        title: 'name',
        key: 'wxDepartmentId',
        value: 'id'
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
      this.getTableData()
      this.departmentList()
    },
    departmentList () {
      departmentList().then(res => {
        this.deptTreeData = res.data
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
        maintainerIds: this.screenData.maintainerIds,
        assigneeIds: this.screenData.assigneeIds,
        contactName: this.screenData.contactName,
        ...this.screenData
      }
      params.storeIds = this.storeIds
      getRecordList(params).then((res) => {
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
      this.screenData.erpOrderNos = ''
      this.getTableData()
    },
    /**
     * 重置查询
     */
    resetSearch () {
      this.time = []
      this.storeIds = []
      this.screenData = {}
      this.selectedRowKeys = []
      this.selectedRows = []
      this.screenData.erpOrderNos = ''
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getTableData()
    },
    /**
     * 表格选择监听
     * @param {*} selectedRowKeys
     */
    onSelectChange (selectedRowKeys, row) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = row
      this.screenData.ids = selectedRowKeys
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
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      this.screenData.startTime = moment(value[0]).format('YYYY-MM-DD')
      this.screenData.endTime = moment(value[1]).format('YYYY-MM-DD')
    },
    changeMaintainerIds (e) {
      this.screenData.maintainerIds = e
    },
    changeAssigneeIds (e) {
      this.screenData.assigneeIds = e
    },
    // getContactDetail (record) {
    //   this.$router.push(
    //     {
    //       path: '/workContact/contactFieldPivot',
    //       query: {
    //         contactId: record.contactId,
    //         employeeId: record.maintainerId,
    //         isContact: 2

    //       }
    //     })
    // },
    exportFn () {
      this.loading = true
      exportRecord(this.screenData).then((res) => {
        this.loading = false
        callDownLoadByBlob(res, '导出分配记录')
      })
    },
    /**
     * 部门回调
     */
    getDept (e) {
      this.storeIds = e
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
  .news {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
    }
  }
}
.box {
  img {
    width: 100%;
    height: auto;
  }
}
</style>
