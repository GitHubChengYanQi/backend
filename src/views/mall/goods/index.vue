<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="8" :md="6">
              <a-form-item
                label="通用名："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-input v-model="screenData.commonName" placeholder="请输入药品通用名"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="6">
              <a-form-item
                label="商品名称："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-input v-model="screenData.name" placeholder="请输入商品名称"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="6">
              <a-form-item
                label="商品状态："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-select v-model="screenData.effective">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="1">有效</a-select-option>
                  <a-select-option value="0">失效</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="6">
              <a-form-item
                label="批准文号："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-input v-model="screenData.approvalNo" placeholder="请输入批准文号"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="6">
              <a-form-item
                label="ERP商品编码："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-input v-model="screenData.code" placeholder="请输入ERP商品编码"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="6">
              <a-form-item
                label="条形码："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-input v-model="screenData.barCode" placeholder="请输入条形码"></a-input>
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
              v-permission="'/mall/goods@search'"
              type="primary"
              @click="search">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
            <a-upload
              name="file"
              v-permission="'/mall/goods@import'"
              accept=".xlsx"
              :showUploadList="false"
              :customRequest="importFn"
            >
              <a-button :loading="loading">导入</a-button>
            </a-upload>
            <a-button
              type="primary"
              :loading="loading"
              v-permission="'/mall/goods@export'"
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
            slot="effective"
            slot-scope="record">
            <template>
              <a-switch
                :checked="record.status == 1"
                @click="setRules(record)"
                v-permission="'/mall/goods@state'"
                checked-children="开"
                un-checked-children="关"
              />
            </template>
          </div>
          <div
            slot="action"
            class="action"
            slot-scope="text, record">
            <template>
              <a @click="editFn(record)" v-permission="'/mall/goods@edit'">编辑</a>
              <a @click="detailFn(record)" v-permission="'/mall/goods@detail'">详情</a>
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->

    </a-card>

    <!-- edit -->
    <a-modal v-model="showEdit" title="编辑">
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="药品名称">
          <span>美林</span>
        </a-form-item>
        <a-form-item label="批准文号">
          <span>国药准字H19980087</span>
        </a-form-item>
        <a-form-item label="药品通用名">
          <a-select
            mode="multiple"
            placeholder="Please select"
            :default-value="['a1', 'b2']"
            style="width: 200px"
            v-model="formData.groupName"
            @change="handleChange"
          >
            <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
              {{ (i + 9).toString(36) + i }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <div class="btn">
          <a-button @click="showEdit = false">取消</a-button>
          <a-button type="primary" @click="ok" :loading="loading">确定</a-button>
        </div>
      </template>
    </a-modal>
    <!-- end edit -->

    <!-- detail -->
    <a-modal
      width="70%"
      title="商品详情"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :footer="null"
      @cancel="onClose"
    >
      <detail :data="curParam" />
    </a-modal>
    <!-- end detail -->
  </div>
</template>

<script>
import moment from 'moment'
import detail from './detail.vue'
import { erpGoods, erpGoodsSync } from '@/api/mall'
import { deepClone } from '@/utils/util'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
export default {
  components: {
    detail
  },
  data () {
    return {
      showEdit: false,
      visible: false,
      loading: false,
      confirmLoading: false,
      selectedRowKeys: [], // 选中key
      selectedRows: [], // 选中row
      screenData: {},
      curParam: {},
      storeIds: [],
      columns: [
        {
          title: '平台编码',
          dataIndex: 'platformCode',
          sorter: true,
          align: 'center',
          width: 200
        },
        {
          title: 'ERP商品编码',
          dataIndex: 'code',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '通用名',
          dataIndex: 'commonName',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '商品规格',
          dataIndex: 'specifications',
          align: 'center',
          width: 150
        },
        {
          title: '批准文号',
          dataIndex: 'approvalNo',
          align: 'center',
          width: 150
        },
        {
          title: '毛利率',
          dataIndex: 'margin',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '失效天数',
          dataIndex: 'invalidDyas',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '单品提成',
          dataIndex: 'goodsCommission',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '更新时间',
          dataIndex: 'createdAt',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '状态',
          dataIndex: 'effective',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'effective' }
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
      params.storeIds = this.storeIds.length !== 0 ? this.storeIds.join(',') : ''
      params.maintainerIds = params.maintainerIds ? params.maintainerIds.join(',') : ''
      erpGoods(params).then((res) => {
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
      this.selectedRowKeys = []
      this.selectedRows = []
      this.screenData.erpOrderNos = ''
      this.getTableData()
    },
    /**
     * 重置查询
     */
    resetSearch () {
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
    /**
     *
     * @param {编辑} record
     */
    editFn (record) {
      this.curParam = record
      this.showEdit = true
    },
    onClose () {
      this.curParam = {}
      this.visible = false
    },
    /**
     * 导入
     */
    importFn (e) {
      console.log(e)
    },
    /**
     * 导出
     */
    exportFn () {
      this.loading = true
      const param = {
        ...this.screenData
      }
      if (this.selectedRowKeys.length > 0) {
        param.contactIds = this.selectedRowKeys.join(',')
      } else {
        param.contactIds = this.selectedRowKeys.join(',')
        param.storeIds = this.storeIds.length !== 0 ? this.storeIds.join(',') : ''
        param.maintainerIds = this.screenData.maintainerIds ? this.screenData.maintainerIds.join(',') : ''
      }
      erpGoodsExport(param).then((res) => {
        this.loading = false
        callDownLoadByBlob(res, '客户协作人')
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
    justify-content: space-between;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
    }
  }
</style>
