<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="8" :md="6">
              <a-form-item
                label="客户姓名："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-input v-model="screenData.contactName" placeholder="请输入客户姓名"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="6">
              <a-form-item
                label="机构门店："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <SelectDepartment :treeCheckStrictly="true" @getDept="getDept" v-model="screenData.storeIds" />
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="6">
              <a-form-item
                label="主维护人："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <selectPersonnel v-model="screenData.maintainerIds" :multiple="true" :num="1" :type="'selector'" />
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="6">
              <a-form-item
                label="添加日期："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-range-picker
                  style="width:300px"
                  v-model="screenData.time"
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
          <div class="fl"></div>
          <div class="fr">
            <a-button
              type="primary"
              @click="search">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
            <a-button
              type="primary"
              :loading="loading"
              @click="exportFn()">导出</a-button>
          </div>
        </div>
        <a-table
          rowKey="contactId"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 1500}"
          @change="handleTableChange">
          <div
            slot="status"
            slot-scope="text">
            <template>
              {{ text === '0' ? '启用' : '禁用' }}
            </template>
          </div>
          <div
            slot="type"
            slot-scope="text">
            <template>
              {{ text }}
            </template>
          </div>
          <div
            slot="prize"
            slot-scope="record">
            <template>
              <ul>
                <li
                  v-for="(item,index) in record"
                  :key="index">
                  {{ item.prizeLevel }}&nbsp;{{ item.completedNum }}/{{ item.prizeNum }}
                </li>
              </ul>
            </template>
          </div>
          <div
            slot="action"
            class="action"
            slot-scope="text, record">
            <template>
              <a @click="detailFn(record)">详情</a>
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->

    </a-card>

    <!-- detail -->
    <a-drawer
      width="80%"
      title="详情"
      placement="right"
      v-if="visible"
      :closable="true"
      :visible="visible"
      @close="onClose"
    >
      <ActorDetail :data="curParam" />
    </a-drawer>
    <!-- end detail -->
  </div>
</template>

<script>
import moment from 'moment'
import ActorDetail from './actorDetail.vue'
import { relList, userRelExport } from '@/api/actor'
import { deepClone } from '@/utils/util'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
export default {
  components: {
    ActorDetail
  },
  data () {
    return {
      visible: false,
      loading: false,
      selectedRowKeys: [], // 选中key
      selectedRows: [], // 选中row
      screenData: {},
      curParam: {},
      storeIds: [],
      columns: [
        {
          title: '客户',
          dataIndex: 'contactName',
          align: 'center',
          width: 200
        },
        {
          title: '主维护人',
          dataIndex: 'maintainerName',
          align: 'center',
          width: 150
        },
        {
          title: '主维护人机构',
          dataIndex: 'maintainerDepartmentName',
          align: 'center',
          width: 150
        },
        {
          title: '主维护人门店',
          dataIndex: 'maintainerStoreName',
          align: 'center',
          width: 150
        },
        {
          title: '协作人数量',
          dataIndex: 'num',
          align: 'center',
          width: 150
        },
        {
          title: '主维护添加客户时间',
          dataIndex: 'createdAt',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 100,
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
      formData: {
        name: '',
        value: '',
        status: 0,
        sort: '',
        differentiate: 'personal',
        type: '',
        isPull: 0,
        interval: '1',
        max: '200',
        min: '70'
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入标识', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入优先级', trigger: 'blur' }
        ],
        interval: [
          { required: true, message: '请输入整数位间隔', trigger: 'blur' }
        ],
        max: [
          { required: true, message: '请输入整数位最大值', trigger: 'blur' }
        ],
        min: [
          { required: true, message: '请输入整数位最小值', trigger: 'blur' }
        ]
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
      params.storeIds = this.storeIds ? this.storeIds.join(',') : ''
      params.maintainerIds = params.maintainerIds ? params.maintainerIds.join(',') : ''
      relList(params).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.pagination.total = res.data.total
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
     * 表格选择监听
     * @param {*} selectedRowKeys
     */
    onSelectChange (selectedRowKeys, row) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = row
      this.screenData.contactIds = selectedRowKeys.join(',')
    },
    /**
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      this.screenData.createdAtStart = moment(value[0]).format('YYYY-MM-DD')
      this.screenData.createdAtEnd = moment(value[1]).format('YYYY-MM-DD')
    },
    /**
     * 详情
     */
    detailFn (record) {
      this.curParam = record
      this.visible = true
    },
    onClose () {
      this.curParam = {}
      this.visible = false
    },
    /**
     * 导出
     */
    exportFn () {
      this.loading = true
      userRelExport(this.screenData).then((res) => {
        this.loading = false
        callDownLoadByBlob(res, '客户协作人')
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
</style>
