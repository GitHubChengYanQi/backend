<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="6">
              <a-form-item label="客户姓名：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-input v-model="screenData.contactName" placeholder="请输入客户姓名"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="协作人门店：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <SelectDepartment :treeCheckStrictly="true" @getDept="getDept" v-model="screenData.storeIds" />
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="协作人：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <selectPersonnel
                  v-model="screenData.collaboratorIds"
                  v-if="treeData"
                  :record="treeData"
                  :multiple="true"
                  :num="1"
                  :type="'selector'"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="主维护人：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <selectPersonnel
                  v-model="screenData.maintainerIds"
                  v-if="treeData"
                  :record="treeData"
                  :multiple="true"
                  :num="1"
                  :type="'selector'"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="订单提成金额：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <p class="inputBox">
                  <span class="input">
                    <a-input v-model="screenData.orderCommissionMinAmount" type="number" placeholder="请输入"></a-input>
                  </span>
                  <span class="sign">-</span>
                  <span class="input">
                    <a-input v-model="screenData.orderCommissionMaxAmount" type="number" placeholder="请输入"></a-input>
                  </span>
                </p>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item class="labelBody" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <div slot="label" class="labelBox" style="float: left">
                  <!-- <a-select default-value="1" style="width: 90px" @change="handleChange">
                    <a-select-option value="1"> 主维护佣金 </a-select-option>
                    <a-select-option value="2"> 协作人佣金 </a-select-option>
                  </a-select> -->
                  <a-dropdown>
                    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                      {{ roleType==='1'?'主维护佣金':'协作人佣金' }} <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a href="javascript:;" @click="handleChange('1')">主维护佣金</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;" @click="handleChange('2')">协作人佣金</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
                <p class="inputBox" v-if="roleType === '1'">
                  <span class="input">
                    <a-input v-model="screenData.maintainerMinAmount" type="number" placeholder="请输入"></a-input>
                  </span>
                  <span class="sign">-</span>
                  <span class="input">
                    <a-input v-model="screenData.maintainerMaxAmount" type="number" placeholder="请输入"></a-input>
                  </span>
                </p>
                <p class="inputBox" v-if="roleType === '2'">
                  <span class="input">
                    <a-input v-model="screenData.collaboratorMinAmount" type="number" placeholder="请输入"></a-input>
                  </span>
                  <span class="sign">-</span>
                  <span class="input">
                    <a-input v-model="screenData.collaboratorMaxAmount" type="number" placeholder="请输入"></a-input>
                  </span>
                </p>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item class="labelBody" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <div slot="label" class="labelBox" style="float: left">
                  <a-dropdown>
                    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                      {{ orderType==='1'?'订单编号':'erp订单编号' }} <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a href="javascript:;" @click="orderHandleChange('1')">订单编号</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;" @click="orderHandleChange('2')">erp订单编号</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
                <p class="inputBox" v-if="orderType === '1'">
                  <span class="input">
                    <a-input v-model="screenData.orderNo" type="text" placeholder="请输入"></a-input>
                  </span>
                </p>
                <p class="inputBox" v-if="orderType === '2'">
                  <span class="input">
                    <a-input v-model="screenData.erpOrderNo" type="number" placeholder="请输入"></a-input>
                  </span>
                </p>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="订单日期：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-range-picker
                  style="width: 265px"
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
          <div class="fl">
            <span>当前合计提成金额：{{ currentAmount }}元</span>
            <span>总合计提成金额：{{ totalAmount }}元</span>
          </div>
          <div class="fr">
            <a-button type="primary" @click="search" v-permission="'/customer/list@search'">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
            <a-button type="primary" :loading="loading" @click="exportFn" v-permission="'/customer/list@export'">导出</a-button>
          </div>
        </div>
        <a-table
          rowKey="erpOrderNo"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :pageSizeOptions="['10', '20', '30', '50']"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <div slot="status" slot-scope="text">
            <template>
              {{ text === '0' ? '启用' : '禁用' }}
            </template>
          </div>
          <div slot="type" slot-scope="text">
            <template>
              {{ text }}
            </template>
          </div>
          <div slot="prize" slot-scope="record">
            <template>
              <ul>
                <li v-for="(item, index) in record" :key="index">
                  {{ item.prizeLevel }}&nbsp;{{ item.completedNum }}/{{ item.prizeNum }}
                </li>
              </ul>
            </template>
          </div>
          <div slot="action" class="action" slot-scope="text, record">
            <template>
              <a @click="detailFn(record)" v-permission="'/customer/list@detail'">详情</a>
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->

      <!--modal-->
      <a-modal width="1000px" :visible="modalVisible" @cancel="reset" :footer="null" title="订单详情">
        <div class="modalBox">
          <div class="head">
            <p class="fl">
              <span>订单状态：{{ curRecord.orderState }}</span>
              <span>ERP销售单号：{{ curRecord.erpOrderNo }}</span>
              <span>订单编号：{{ curRecord.orderNo }}</span>
            </p>
            <p class="fr">
              <span>应收总额：{{ curRecord.orderActualAmount || 0 }}元</span>
              <span>实收总额：{{ curRecord.orderReceivableAmount || 0 }}元</span>
            </p>
          </div>
          <a-table
            rowKey="goodName"
            :loading="loading"
            :columns="columns2"
            :pagination="false"
            :data-source="tableData2"
          >
            <div slot="type" slot-scope="text">
              <template>
                {{ text }}
              </template>
            </div>
          </a-table>
        </div>
      </a-modal>
      <!--end modal-->
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { departmentEmp } from '@/api/common.js'
import { acOrderList, getTotalAmount, orderExport, acOrderDetail } from '@/api/actor'
import { deepClone } from '@/utils/util'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
export default {
  data () {
    return {
      loading: false,
      modalVisible: false,
      modalType: '', // add edit
      selectedRowKeys: [], // 选中key
      selectedRows: [], // 选中row
      screenData: {},
      storeIds: [],
      roleType: '1',
      orderType: '1',
      columns: [
        {
          title: '协作人',
          dataIndex: 'collaboratorName',
          align: 'center',
          width: 150
        },
        {
          title: '协作人机构',
          dataIndex: 'collaboratorDepartmentName',
          width: 200,
          align: 'left',
          scopedSlots: { customRender: 'collaboratorDepartmentName' }
        },
        {
          title: '协作人门店',
          dataIndex: 'collaboratorStoreName',
          align: 'left',
          width: 250,
          scopedSlots: { customRender: 'collaboratorStoreName' }
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
          width: 200
        },
        {
          title: '主维护人门店',
          dataIndex: 'maintainerStoreName',
          align: 'center',
          width: 250
        },
        {
          title: '客户姓名',
          dataIndex: 'contactName',
          align: 'center',
          width: 150
        },
        {
          title: '订单日期',
          dataIndex: 'orderTime',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '订单状态',
          dataIndex: 'orderState',
          align: 'center',
          width: 150
        },
        {
          title: '订单提成金额',
          dataIndex: 'orderCommissionAmount',
          align: 'center',
          width: 150
        },
        {
          title: '执行规则',
          dataIndex: 'ruleName',
          align: 'center',
          width: 150
        },
        {
          title: '协作人佣金',
          dataIndex: 'collaboratorAmount',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '主维护人佣金',
          dataIndex: 'maintainerAmount',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '订单编号',
          dataIndex: 'orderNo',
          align: 'center',
          width: 200
        },
        {
          title: 'ERP销售单号',
          dataIndex: 'erpOrderNo',
          align: 'center',
          width: 200
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
      columns2: [
        {
          title: '商品名称',
          dataIndex: 'goodName',
          align: 'center',
          width: 200
        },
        {
          title: '规格',
          dataIndex: 'goodSpecifications',
          width: 80,
          align: 'left',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '数量',
          dataIndex: 'goodNum',
          align: 'center',
          width: 80
        },
        {
          title: '应收金额',
          dataIndex: 'orderActualAmount',
          align: 'center',
          width: 100
        },
        {
          title: '实收金额',
          dataIndex: 'orderReceivableAmount',
          align: 'center',
          width: 100
        }
      ],
      tableData: [],
      tableData2: [],
      curRecord: {},
      currentAmount: 0,
      totalAmount: 0,
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
      },
      treeData: undefined
    }
  },
  created () {
    this.initFn()
    this.departmentEmp()
  },
  methods: {
    deepClone,
    /**
     * 拉取部门数据
     */
    departmentEmp () {
      departmentEmp().then(res => {
        this.treeData = res.data
      })
    },
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
      params.storeIds = this.storeIds.length !== 0 ? this.storeIds.join(',') : ''
      params.collaboratorIds = params.collaboratorIds ? params.collaboratorIds.join(',') : ''
      params.maintainerIds = params.maintainerIds ? params.maintainerIds.join(',') : ''
      acOrderList(params).then((res) => {
        this.loading = false
        this.tableData = res.data.page.records
        this.pagination.total = res.data.page.total
        this.currentAmount = res.data.currentAmount
      })
      getTotalAmount(params).then((res) => {
        this.totalAmount = res.data
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
      this.$delete(this.screenData, 'orderNo')
      this.$delete(this.screenData, 'erpOrderNo')
      this.selectedRowKeys = []
      this.selectedRows = []
      this.screenData.erpOrderNos = ''
      this.storeIds = []
      this.screenData = {}
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.selectedRowKeys = []
      this.selectedRows = []
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
    },
    /**
     * 切换类型
     */
    changeType (e) {
      this.curOpt = this.opts[e.target.value]
    },
    /**
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      this.screenData.orderStartTime = moment(value[0]).format('YYYY-MM-DD')
      this.screenData.orderEndTime = moment(value[1]).format('YYYY-MM-DD')
    },
    /**
     * 详情
     */
    detailFn (record) {
      const param = {
        erpOrderNo: record.erpOrderNo
      }
      this.curRecord = record
      acOrderDetail(param).then(res => {
        this.modalVisible = true
        this.tableData2 = res.data
      })
    },
    /**
     * 切换角色
     */
    handleChange (e) {
      this.roleType = e
      if (e === '1') {
        delete this.screenData.collaboratorMaxAmount
        delete this.screenData.collaboratorMinAmount
      } else {
        delete this.screenData.maintainerMaxAmount
        delete this.screenData.maintainerMinAmount
      }
    },
    /**
     * 切换订单号
     */
    orderHandleChange (e) {
      this.orderType = e
      if (e === '1') {
        delete this.screenData.erpOrderNo
      } else {
        delete this.screenData.orderNo
      }
    },
    /**
     * 导出
     */
    exportFn () {
      this.loading = true
      const params = {
        ...this.screenData
      }
      if (this.selectedRowKeys.length > 0) {
        params.erpOrderNos = this.selectedRowKeys.join(',')
      } else {
        params.storeIds = this.storeIds.length !== 0 ? this.storeIds.join(',') : ''
        params.collaboratorIds = params.collaboratorIds ? params.collaboratorIds.join(',') : ''
        params.maintainerIds = params.maintainerIds ? params.maintainerIds.join(',') : ''
      }
      orderExport(params).then((res) => {
        this.loading = false
        callDownLoadByBlob(res, '协作人订单')
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
