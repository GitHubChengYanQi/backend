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
                  <a-select-option v-for="item in effectiveList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
                  <!-- <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="1">有效</a-select-option>
                  <a-select-option value="0">失效</a-select-option> -->
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
              v-permission="'/erpGoods/list@get'"
              type="primary"
              @click="search">查询</a-button>
            <a-button @click="resetSearch" v-permission="'/erpGoods/list@get'">重置</a-button>
            <a-upload
              name="file"
              v-permission="'/erpGoods/importExcel@post'"
              accept=".xlsx"
              :showUploadList="false"
              :customRequest="importFn"
            >
              <a-button :loading="loading">导入</a-button>
            </a-upload>
            <a-button
              type="primary"
              :loading="loading"
              v-permission="'/erpGoods/export@get'"
              @click="exportFn()"
              :disbaled="tableData.length === 0">导出</a-button>
          </div>
        </div>
        <a-table
          :rowClassName="setRowClassName"
          :row-key="record => record.id"
          :loading="tableLoading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 1500}"
          @change="handleTableChange">
          <div
            slot="effective"
            slot-scope="text, record">
            <template>
              <a-switch
                :checked="record.effective === '1' ? true : false"
                @click="setRules(record)"
                v-permission="'/erpGoods/status@put'"
                checked-children="开"
                un-checked-children="关"
                :disabled="record.status === '2' || record.saleStatus === '0'"
              />
            </template>
          </div>
          <!-- <div
            slot="effective"
            slot-scope="record">
            <template>
              <a-switch
                :checked="record.effective === 1 ? true : false"
                @click="setRules(record)"
                v-permission="'/erpGoods/status@put'"
                checked-children="开"
                un-checked-children="关"
              />
            </template>
          </div> -->
          <div
            slot="action"
            class="action"
            slot-scope="text, record">
            <!-- <template>
              <a @click="editFn(record)" v-permission="'/erpGoods/detail@get'">编辑</a>
              <a @click="detailFn(record)" v-permission="'/erpGoods/detailAll@get'">详情</a>
            </template> -->
            <div style="display: flex;justify-content: space-around;">
              <a-button type="link" @click="editFn(record)" v-permission="'/erpGoods/detail@get'">编辑</a-button>
              <a-button type="link" @click="detailFn(record)" v-permission="'/erpGoods/detailAll@get'">详情</a-button>
            </div>
          </div>
        </a-table>
      </div>
      <!--end table-->

    </a-card>

    <!-- edit -->
    <a-modal
      :visible="showEdit"
      title="编辑"
      :width="800"
      :maskClosable="false"
      @cancel="closeEditModal"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="药品名称">
          <span>{{ editInfo.name }}</span>
        </a-form-item>
        <a-form-item label="批准文号">
          <span>{{ editInfo.approvalNo }}</span>
        </a-form-item>
        <a-form-item label="药品通用名">
          <a-select
            showSearch
            placeholder="请选择药品通用名"
            style="width: 200px"
            v-model="editInfo.commonNameId"
            @change="handleChange"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchSearch"
          >
            <a-spin slot="notFoundContent" v-if="fetching" />
            <a-select-option v-for="item in commonNameList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            <!-- <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
              {{ (i + 9).toString(36) + i }}
            </a-select-option> -->
          </a-select>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <div class="btn">
          <a-button @click="closeEditModal">取消</a-button>
          <a-button type="primary" @click="editSubmitSure" :loading="loading" v-permission="'/erpGoods/update@put'">确定</a-button>
        </div>
      </template>
    </a-modal>
    <!-- end edit -->

    <!-- detail -->
    <a-modal
      width="70%"
      title="商品详情"
      :visible="showDetailStatus"
      :confirm-loading="confirmLoading"
      :footer="null"
      @cancel="onClose"
    >
      <detail :data="detailInfo" />
    </a-modal>
    <!-- end detail -->
  </div>
</template>

<script>
import moment from 'moment'
import detail from './detail.vue'
import { erpGoods, erpGoodsExport, getErpDrugInformation, getCommonNameList, editErpGoodsDetail, getErpGoodsDetail, getDictData, erpStatusChange, erpGoodsImport } from '@/api/mall'
import { deepClone } from '@/utils/util'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
export default {
  components: {
    detail
  },
  data () {
    return {
      // 失效商品id列表
      invalidRowIdList: {},
      // 商品状态列表
      effectiveList: [],
      // 通用名列表
      commonNameList: [],
      fetching: false,
      detailInfo: {}, // 详情查询对象
      // 修改药品信息对象
      editInfo: {},
      // 编辑药品信息弹框
      showEdit: false,
      // 查看药品详情弹框
      showDetailStatus: false,
      loading: false,
      confirmLoading: false,
      selectedRowKeys: [], // 选中key
      selectedRows: [], // 选中row
      // 搜索对象
      screenData: {},
      curParam: {},
      storeIds: [],
      tableLoading: false, // 表格加载动画
      // 表头
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
          title: '条形码',
          dataIndex: 'barCode',
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
          title: '销售状态',
          dataIndex: 'saleStatusName',
          align: 'center',
          width: 150
        },
        {
          title: '商品状态',
          dataIndex: 'statusName',
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
      // 表格数据载体
      tableData: [],
      // 表格翻页
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      // 编辑对象
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
    setRowClassName (record) {
      return this.invalidRowIdList.indexOf(record.id) !== -1 ? 'clickRowStyle' : 'rowColor'// 赋予点击行样式
    },
    deepClone,
    // 获取商品状态
    async getDictDataList () {
      const params = { dictType: 'good_effective' }
      await getDictData(params).then(response => {
        // console.log(response, '商品状态字典')
        this.effectiveList = this.returnEffectiveList(response.data)
      })
      this.$set(this.screenData, 'effective', this.effectiveList[0].code)
      this.getTableData()
    },
    // 返回完整的数据
    returnEffectiveList (list) {
      const tempList = Object.assign([], list)
      const tempInfo = { code: '-1', name: '请选择' }
      tempList.unshift(tempInfo)
      return tempList
    },
    /**
     * 初始化
     */
    initFn () {
      this.getDictDataList()
    },
    // 拉取列表
    getTableData () {
      this.tableLoading = true
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        ...this.screenData
      }
      if (params.effective === '-1') {
        // 为-1时,选择的是全部
        this.$delete(params, 'effective')
      }
      // params.storeIds = this.storeIds.length !== 0 ? this.storeIds.join(',') : ''
      // params.maintainerIds = params.maintainerIds ? params.maintainerIds.join(',') : ''
      erpGoods(params).then((response) => {
        this.tableLoading = false
        this.tableData = response.data.list
        this.$set(this.pagination, 'total', Number(response.data.page.total))
        if (this.tableData.length === 0) {
          // 列表中没有数据
          if (this.pagination.total !== 0) {
            // 总数据有,但当前页没有
            // 重新将页码换成1
            this.$set(this.pagination, 'current', 1)
            this.getTableData()
          } else {
            // 是真没有数据
          }
        } else {
          const tempList = this.tableData.filter(item => (item.status === '2' || item.saleStatus === '0'))
          if (tempList.length !== 0) {
            this.invalidRowIdList = tempList.map(item => item.id)
          } else {
            this.invalidRowIdList = []
          }
        }
      }).catch(() => {
        this.tableLoading = false
      })
    },
    /**
     * 表格监听事件
     */
    handleTableChange ({ current, pageSize }, filters, sorter) {
      // console.log(current, pageSize, sorter, '监听的信息')
      this.selectedRowKeys = []
      this.selectedRows = []
      let currentTypeText = ''
      if (sorter.order) {
        // 获取点击的是那一列排序
        currentTypeText = sorter.column.dataIndex
        this.$set(this.screenData, 'orderBySortCode', currentTypeText)
        if (sorter.order === 'ascend') {
          // 正序
          this.$set(this.screenData, 'orderBySort', 'asc')
        } else {
          // 逆序
          this.$set(this.screenData, 'orderBySort', 'desc')
        }
      } else {
        // 无需排序
        this.$delete(this.screenData, 'orderBySort')
        this.$delete(this.screenData, 'orderBySortCode')
      }
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    // 编辑弹框选择药品通用名
    handleChange (e) {
      console.log(e, '选择药品通用名')
    },
    // 编辑弹框点击确定
    async editSubmitSure () {
      console.log(this.editInfo, '提交的对象')
      await editErpGoodsDetail(this.editInfo).then(response => {
        console.log(response, '提交修改')
        if (response.code === 200) {
          this.$message.success('修改成功')
          this.showEdit = false
          this.getTableData()
        }
      })
    },
    // 编辑弹框关闭
    closeEditModal () {
      this.showEdit = false
      this.editInfo = {}
    },
    // 切换商品状态
    setRules (info) {
      console.log(info, 'info')
      const tempInfo = { id: info.id }
      if (info.effective === '0') {
        tempInfo.effective = '1'
      } else {
        tempInfo.effective = '0'
      }
      this.tableLoading = true
      erpStatusChange(tempInfo).then(response => {
        this.tableLoading = false
        if (response.code === 200) {
          this.$message.success('切换成功')
          this.getTableData()
        }
      }).catch(() => {
        this.tableLoading = false
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
    // 表格选中
    onSelectChange (selectedRowKeys, row) {
      console.log(selectedRowKeys, row, '表格选择监听')
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
      // this.curParam = record
      this.showDetailStatus = true
      const params = { id: record.id }
      getErpGoodsDetail(params).then(response => {
        this.$nextTick(() => {
          this.detailInfo = response.data
        })
      })
    },
    // 关闭详情弹框
    onClose () {
      this.detailInfo = {}
      this.showDetailStatus = false
    },
    // 输入框输入查询
    fetchSearch (value) {
      if (value) {
        this.fetching = true
        console.log(value, 'value')
        const params = { name: value }
        getCommonNameList(params).then(response => {
          console.log(response, '获取通用名列表')
          this.commonNameList = response.data
          this.fetching = false
        })
      }
    },
    /**
     *
     * @param {编辑} record
     */
    editFn (record) {
      const params = { id: record.id }
      getErpDrugInformation(params).then(response => {
        console.log(response)
        this.showEdit = true
        this.$nextTick(() => {
          this.editInfo = response.data
          if (this.editInfo.commonName && this.editInfo.commonNameId) {

          } else {
            this.$delete(this.editInfo, 'commonNameId')
            this.$delete(this.editInfo, 'commonName')
          }
        })
      }).catch(() => {
        this.showEdit = true
        this.editInfo = {}
      })
    },
    /**
     * 导入
     */
    importFn (e) {
      this.tableLoading = true
      console.log(e.file, 'e.file')
      const formData = new FormData()
      formData.append('file', e.file)
      erpGoodsImport(formData).then(response => {
        if (response.code === 200) {
          this.$message.success('导入成功')
          this.tableLoading = false
          // 重新将页码换成1
          this.$set(this.pagination, 'current', 1)
          this.getTableData()
        }
        console.log(response)
      }).catch((error) => {
        console.log(error)
        // console.log(error.message, '导入失败message')
        // console.log(error.response.data.error, '导入失败response')
        // console.log(error.request, '导入失败request')
        // console.log(error.status, '导入失败status')
        this.tableLoading = false
      })
    },
    /**
     * 导出
     */
    exportFn () {
      this.tableLoading = true
      this.loading = true
      const param = {
        ...this.screenData
      }
      if (this.selectedRowKeys.length > 0) {
        param.ids = this.selectedRowKeys.join(',')
      } else {
        param.ids = ''
        // param.contactIds = this.selectedRowKeys.join(',')
        // param.storeIds = this.storeIds.length !== 0 ? this.storeIds.join(',') : ''
        // param.maintainerIds = this.screenData.maintainerIds ? this.screenData.maintainerIds.join(',') : ''
      }
      erpGoodsExport(param).then((res) => {
        this.loading = false
        this.tableLoading = false
        callDownLoadByBlob(res, '商品库')
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-table-tbody .clickRowStyle {
  background-color: #e6f7ff !important;
}
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
  /deep/.ant-table-tbody .clickRowStyle {
    background-color: yellow !important;
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
