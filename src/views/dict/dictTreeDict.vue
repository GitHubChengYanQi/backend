<template>
  <div>
    <a-card title="数据筛选">
      <!-- <a-row>
        <a-col :span="6">
          <a-input v-model="searchInfo.typeCode" placeholder="请输入分类编码"></a-input>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-input v-model="searchInfo.typeName" placeholder="请输入字典编码"></a-input>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-button type="primary" style="marginRight:10px" @click="search" v-permission="'/dictType/tree/getList@post'">查询</a-button>
          <a-button @click="resetSearch" v-permission="'/dictType/tree/getList@post'">重置</a-button>
        </a-col>
      </a-row> -->
      <div class="table-wrapper">
        <!-- <div class="top-btn">
          <a-button class="batch" type="primary" @click="add('addType')" v-permission="'/dictType/tree/addTree@post'">新增字典</a-button>
        </div> -->
        <!-- :expandIconColumnIndex="4" -->
        <!-- :expandIcon="expandIcon" -->
        <a-table
          bordered
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange"
          :expandIconColumnIndex="4"
          :expandIcon="expandIcon"
          :row-key="record => record.id"
        >
          <div slot="options" slot-scope="record">
            <template>
              <div style="display: flex;justify-content: space-around;">
                <a-button type="link" v-permission="'/dictType/tree/addTree@post'" @click="add('addData', record)">新增字典</a-button>
                <a-button type="link" v-permission="'/dictType/tree/modifyTree@post'" @click="editItem(record)">编辑</a-button>
                <a-button type="link" @click="deleteItem(record.id)" v-permission="'/dictType/tree/deleteTree@get'">删除</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </div>
    </a-card>
    <a-modal
      :title="modelShowTitle"
      :maskClosable="false"
      :width="500"
      :visible="modelDictShowStatus"
      @cancel="resetForm"
    >
      <a-form-model
        class="formDict"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 14 }"
        :model="addDictInfo"
        :rules="dictRules"
        ref="ruleDictForm">
        <a-form-model-item
          label="分类编码"
          prop="typeCode"
          required>
          <a-input v-model.trim="addDictInfo.typeCode" :maxLength="10" placeholder="请输入分类编码"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="父节点编码"
          prop="parentDictCode"
          required>
          <a-input v-model.trim="addDictInfo.parentDictCode" :maxLength="10" placeholder="请输入父节点编码"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="字典编码"
          prop="typeCode"
          required>
          <a-input v-model.trim="addDictInfo.dictCode" :maxLength="10" placeholder="请输入字典编码"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="字典名称"
          prop="typeName"
          required>
          <a-input v-model.trim="addDictInfo.dictName" placeholder="请输入字典名称"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="字典排序"
          prop="typeSort"
          required>
          <a-input-number class="inputNumberDiv" v-model.trim="addDictInfo.dictSort" placeholder="请输入字典排序"></a-input-number>
        </a-form-model-item>
        <a-form-model-item
          label="字典描述"
          prop="dictDesc"
          required>
          <a-textarea v-model.trim="addDictInfo.dictDesc" placeholder="请输入字典描述"></a-textarea>
        </a-form-model-item>
      </a-form-model>
      <div slot="footer" class="footer">
        <template>
          <a-button
            type="link"
            @click="submitDict"
            v-permission="'/dictType/tree/addTree@post'">
            确认
          </a-button>
          <a-button
            type="link"
            @click="resetForm">
            取消
          </a-button>
        </template>
      </div>
    </a-modal>
  </div>
</template>

<script>
import IconSelector from '@/components/IconSelector/IconSelector'
import { getDictTreeData, addDictTreeData, editDictTreeData, deleteDictTreeData } from '@/api/dict'

const columns = [
  {
    title: '分类编码',
    align: 'center',
    dataIndex: 'dictCode'
  },
  {
    title: '字典编码',
    align: 'center',
    dataIndex: 'dictName'
  },
  {
    title: '字典排序',
    dataIndex: 'dictSort',
    align: 'center'
  },
  {
    title: '字典描述',
    align: 'center',
    dataIndex: 'dictDesc'
  },
  {
    title: '操作',
    align: 'center',
    width: '150px',
    // fixed: 'right',
    scopedSlots: { customRender: 'options' }
  }
]

export default {
  components: {
    IconSelector
  },
  data () {
    const createValidate = (callback, value, message) => {
      if (!value) {
        return callback(new Error(message))
      } else {
        callback()
      }
    }
    const createFunc = (func, change) => {
      return {
        validator: func,
        trigger: change || 'blur'
      }
    }
    const vDictTypeCode = (rule, value, callback) => {
      value = this.addDictInfo.typeCode
      createValidate(callback, value, '请输入字典编码')
    }
    const vDictCode = (rule, value, callback) => {
      value = this.addDictInfo.dictCode
      createValidate(callback, value, '请输入字典编码')
    }
    const vDictName = (rule, value, callback) => {
      value = this.addDictInfo.dictName
      createValidate(callback, value, '请输入字典名称')
    }
    const vDictSort = (rule, value, callback) => {
      value = this.addDictInfo.dictSort
      createValidate(callback, value, '请输入字典排序')
    }
    const vDictDesc = (rule, value, callback) => {
      value = this.addDictInfo.dictDesc
      createValidate(callback, value, '请输入字典描述')
    }
    const vParentDictCode = (rule, value, callback) => {
      value = this.addDictInfo.parentDictCode
      createValidate(callback, value, '请输入父节点编码')
    }
    return {
      // 搜索对象
      searchInfo: {},
      // 分类表单新增/修改对象
      addTypeInfo: {},
      // 字典表单新增/修改对象
      addDictInfo: {},
      // 表格表头数据
      columns,
      // 表格数据
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      // 分类弹框显示状态
      modelTypeShowStatus: false,
      // 字典弹框显示状态
      modelDictShowStatus: false,
      // 弹框标题
      modelShowTitle: '',
      // 字典表单提交规则
      dictRules: {
        parentDictCode: createFunc(vParentDictCode, 'change'),
        typeCode: createFunc(vDictTypeCode, 'change'),
        dictCode: createFunc(vDictCode, 'change'),
        dictName: createFunc(vDictName, 'change'),
        dictSort: createFunc(vDictSort, 'change'),
        dictDesc: createFunc(vDictDesc, 'change')
      }
    }
  },
  watch: {
    modelDictShowStatus (value) {
      if (!value) {
        this.$refs.ruleDictForm.clearValidate()
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 菜单展开
    expandIcon (props) {
      if (!props.record.children) {
        return
      }
      if (props.record.children.length > 0) {
        if (props.expanded) {
          return <a class="expand-wrapper" onClick={e => {
            props.onExpand(props.record, e)
          }}>收起</a>
        } else {
          return <a class="expand-wrapper" onClick={e => {
            props.onExpand(props.record, e)
          }}>展开</a>
        }
      }
    },
    // 切换页码
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    // 获取数据
    async getTableData () {
      const params = {
        typeCode: this.searchInfo.typeCode ? this.searchInfo.typeCode : '',
        typeName: this.searchInfo.typeName ? this.searchInfo.typeName : '',
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      console.log(params, '查询数据提交接口的对象')
      await getDictTreeData(params).then(response => {
        this.tableLoading = false
        console.log(response, '获取字典列表数据')
        this.tableData = response.data.records
        this.$set(this.pagination, 'total', Number(response.data.total))
        this.$set(this.pagination, 'current', Number(response.data.current))
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
        }
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 搜索
    search () {
      this.pagination.current = 1
      this.getTableData()
    },
    // 删除字典数据
    deleteItem (id) {
      const params = { id }
      this.$confirm({
        title: '确定删除所选内容?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          deleteDictTreeData(params).then(response => {
            console.log(response, '删除数据')
            if (response.code === 200) {
              this.$message.success('删除成功')
              // this.pageIndex = 1
              // this.sopName = ''
              this.getTableData()
            }
          })
        }
      })
    },
    // 修改数据
    async editItem (record) {
      // console.log(menuId)
      console.log(record)
      // let tempIndex = ''
      // const tempId = record.id.split('_')[1]
      // const tempType = record.id.split('_')[0]
      // if (tempType === 'type') {
      //   // 为分类标签
      //   this.modelTypeShowStatus = true
      //   this.modelShowTitle = '修改分类'
      //   tempIndex = this.tableData.findIndex(item => item.id === record.id)
      // }
      // this.modelShowStatus = true
      // this.menuShowType = 'edit'
      // this.modelShowTitle = '修改字典'
      // const tempIndex = this.tableData.findIndex(item => item.id === record.id)
      // this.info = Object.assign({}, this.tableData[tempIndex])
    },
    // 重置搜索
    resetSearch () {
      this.$delete(this.searchInfo, 'typeName')
      this.$delete(this.searchInfo, 'typeCode')
    },
    // 取消按钮,清空提交表单
    resetForm () {
      this.addTypeInfo = {}
      this.addDictInfo = {}
      this.modelDictShowStatus = false
      this.modelTypeShowStatus = false
    },
    // 添加
    add (type, info) {
      if (type === 'addType') {
        // 表示分类新增/修改
        this.modelTypeShowStatus = true
        if (info) {
          // 表示修改
          this.modelShowTitle = '修改分类'
          console.log(info, '修改分类')
        } else {
          this.modelShowTitle = '新增分类'
          this.addTypeInfo = {}
        }
      } else if (type === 'addData') {
        console.log(info, '分类新增/修改')
        this.modelDictShowStatus = true
        // 表示数据新增
        if (info) {
          // 表示修改
          this.modelShowTitle = '修改字典'
        } else {
          this.modelShowTitle = '新增字典'
        }
      }
    },
    // 字典提交
    submitDict () {
      this.$refs.ruleDictForm.validate(async valid => {
        if (valid) {
          console.log('字典可以提交', this.addDictInfo)
          if (this.modelShowTitle === '新增字典') {
            await addDictTreeData(this.addDictInfo).then(response => {
              this.modelDictShowStatus = false
              if (response.code === 200) {
                this.$message.success('添加成功')
                this.$set(this.pagination, 'page', 1)
                this.$set(this.pagination, 'perPage', 10)
                this.getTableData()
              }
            }).catch(() => {
              this.modelDictShowStatus = false
            })
          } else if (this.modelShowTitle === '修改字典') {
            await editDictTreeData(this.addDictInfo).then(response => {
              this.modelDictShowStatus = false
              if (response.code === 200) {
                this.$message.success('添加成功')
                this.$set(this.pagination, 'page', 1)
                this.$set(this.pagination, 'perPage', 10)
                this.getTableData()
              }
            }).catch(() => {
              this.modelDictShowStatus = false
            })
          }
        }
      })
    }
  }
}
</script>

    <style lang="less" scoped>
    .top-btn{
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
      .batch{
        // margin-right: 20px;
      }
    }
    .table-wrapper {
      .icon {
        text-align: center;
        font-size: 25px;
      }
      .text {
        font-size: 14px;
      }
      .second {
        color: #1890ff
      }
      .third {
        color: red
      }
      .fourth {
        color: rgb(201, 154, 240)
      }
      .fif {
        color:  rgb(105, 236, 100)
      }
    }
    .inputNumberDiv {
        width: 100%;
    }
    .expand-wrapper {
      width: 60px;
      padding: 0 16px;
      display: inline-block;
    }
    .footer {
      text-align: left;
    }
    </style>
