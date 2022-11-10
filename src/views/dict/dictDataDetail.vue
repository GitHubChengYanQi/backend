<template>
  <div>
    <a-card title="数据筛选">
      <a-row>
        <a-col :span="6">
          <a-input v-model="searchInfo.dictCode" placeholder="请输入字典编码"></a-input>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-input v-model="searchInfo.dictName" placeholder="请输入字典名称"></a-input>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-button type="primary" style="marginRight:10px" @click="search" v-permission="'/dictType/common/getDataList@post'">查询</a-button>
          <a-button @click="resetSearch" v-permission="'/dictType/common/getDataList@post'">重置</a-button>
        </a-col>
      </a-row>
      <div class="table-wrapper">
        <div class="top-btn">
          <a-button class="batch" type="primary" @click="add" v-permission="'/dictType/common/addData@post'">添加</a-button>
        </div>
        <a-table
          :loading="tableLoading"
          bordered
          :row-key="record => record.id"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <div slot="isDefault" slot-scope="text, record">
            <template>
              <div>{{ returnDefault(record.isDefault) }}</div>
            </template>
          </div>
          <div slot="options" slot-scope="record">
            <template>
              <div style="display: flex;justify-content: space-around;">
                <a-button type="link" @click="editItem(record)" v-permission="'/dictType/common/modifyData@post'">编辑</a-button>
                <a-button type="link" @click="deleteItem(record.id)" v-permission="'/dictType/common/deleteData@get'">删除</a-button>
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
      :visible="modelShowStatus"
      @cancel="resetForm"
    >
      <a-form-model
        class="form"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 14 }"
        :model="info"
        :rules="rules"
        ref="ruleForm">
        <a-form-model-item
          label="分类编码"
          prop="typeCode"
          required>
          <a-input disabled v-model.trim="info.typeCode" placeholder="请输入分类编码"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="字典编码"
          prop="dictCode"
          required>
          <a-input :disabled="modelShowTitle === '修改字典'" v-model.trim="info.dictCode" :maxLength="10" placeholder="请输入字典编码"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="字典名称"
          prop="dictName"
          required>
          <a-input v-model.trim="info.dictName" placeholder="请输入字典名称"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="字典排序"
          prop="dictSort"
          required>
          <a-input-number class="inputNumberDiv" v-model.trim="info.dictSort" placeholder="请输入字典排序"></a-input-number>
        </a-form-model-item>
        <a-form-model-item
          label="字典描述"
          prop="dictDesc">
          <a-textarea v-model.trim="info.dictDesc" placeholder="请输入字典描述"></a-textarea>
        </a-form-model-item>
        <a-form-model-item
          label="是否默认"
          prop="isDefault">
          <a-switch :checked="Boolean(info.isDefault)" :checkedValue="1" :unCheckedValue="0" @change="changeSwitch"/>
          <!-- <a-textarea v-model.trim="info.dictDesc" placeholder="请输入字典描述"></a-textarea> -->
        </a-form-model-item>
      </a-form-model>
      <div slot="footer" class="footer">
        <template>
          <a-button
            v-if="modelShowTitle === '新增字典'"
            type="link"
            @click="submit"
            v-permission="'/dictType/common/addData@post'">
            确认
          </a-button>
          <a-button
            v-if="modelShowTitle === '修改字典'"
            type="link"
            @click="submit"
            v-permission="'/dictType/common/modifyData@post'">
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
import { getDictData, addDictData, editDictData, deleteDictData } from '@/api/dict'

const columns = [
  {
    title: '分类编码',
    align: 'center',
    dataIndex: 'typeCode'
  },
  {
    title: '字典编码',
    align: 'center',
    dataIndex: 'dictCode'
  },
  {
    title: '字典名称',
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
    title: '是否默认',
    align: 'center',
    dataIndex: 'isDefault',
    scopedSlots: { customRender: 'isDefault' }
  },
  {
    title: '操作',
    align: 'center',
    width: 200,
    fixed: 'right',
    scopedSlots: { customRender: 'options' },
    all: true
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
    const vTypeCode = (rule, value, callback) => {
      value = this.info.typeCode
      createValidate(callback, value, '请输入分类编码')
    }
    const vDictCode = (rule, value, callback) => {
      value = this.info.dictCode
      createValidate(callback, value, '请输入字典编码')
    }
    const vDictName = (rule, value, callback) => {
      value = this.info.dictName
      createValidate(callback, value, '请输入字典名称')
    }
    const vDictSort = (rule, value, callback) => {
      value = this.info.dictSort
      createValidate(callback, value, '请输入字典排序')
    }
    return {
      tableLoading: false,
      // 从上页传入的对象
      importInfo: JSON.parse(this.$route.query.importString),
      // 搜索对象
      searchInfo: {},
      // 表单新增/修改对象
      info: {},
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
      // 弹框显示状态
      modelShowStatus: false,
      // 弹框标题
      modelShowTitle: '',
      loading: false,
      // 表单提交规则
      rules: {
        typeCode: createFunc(vTypeCode, 'change'),
        dictCode: createFunc(vDictCode, 'change'),
        dictName: createFunc(vDictName, 'change'),
        dictSort: createFunc(vDictSort, 'change')
      }
    }
  },
  watch: {
    modelShowStatus (value) {
      if (!value) {
        this.$refs.ruleForm.clearValidate()
      }
    }
  },
  created () {
    // console.log(this.$route.query, '传递的参数')
    if (this.importInfo.typeCode) {
      console.log(this.importInfo, 'this.importInfo')
      this.getTableData()
    } else {
      this.$message.error('缺少参数')
    }
  },
  methods: {
    returnDefault (text) {
      let tempText = ''
      if (Number(text) === 1) {
        tempText = '是'
      } else {
        tempText = '否'
      }
      return tempText
    },
    // 切换开关
    changeSwitch (e) {
      console.log(e, '切换开关')
      if (e) {
        // 为true
        this.$set(this.info, 'isDefault', 1)
      } else {
        // 为false
        this.$set(this.info, 'isDefault', 0)
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
      this.tableLoading = true
      const params = {
        dictCode: this.searchInfo.dictCode ? this.searchInfo.dictCode : '',
        dictName: this.searchInfo.dictName ? this.searchInfo.dictName : '',
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        typeCode: this.importInfo.typeCode
      }
      console.log(params, '查询数据提交接口的对象')
      await getDictData(params).then(response => {
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
    // 修改数据
    async editItem (record) {
      this.modelShowStatus = true
      this.modelShowTitle = '修改字典'
      const tempIndex = this.tableData.findIndex(item => item.id === record.id)
      this.info = Object.assign({}, this.tableData[tempIndex])
      this.$set(this.info, 'isDefault', Number(this.info.isDefault))
    },
    // 重置搜索
    resetSearch () {
      this.$delete(this.searchInfo, 'dictName')
      this.$delete(this.searchInfo, 'dictCode')
      this.$set(this.pagination, 'page', 1)
      this.$set(this.pagination, 'perPage', 10)
      this.getTableData()
    },
    // 重置提交表单
    resetForm () {
      this.modelShowStatus = false
      this.info = {}
    },
    // 添加
    add () {
      this.modelShowStatus = true
      this.modelShowTitle = '新增字典'
      // this.$set(this.info, 'typeCode', this.importInfo.typeCode)
      this.info = { typeCode: this.importInfo.typeCode, isDefault: 0 }
    },
    // 删除字典类型
    deleteItem (id) {
      const params = { id }
      this.$confirm({
        title: '确定删除所选内容?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          deleteDictData(params).then(response => {
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
    // 提交
    submit () {
      console.log('提交')
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          console.log('可以提交', this.info)
          if (this.modelShowTitle === '新增字典') {
            addDictData(this.info).then(response => {
              this.modelShowStatus = false
              if (response.code === 200) {
                this.$message.success('添加成功')
                this.$set(this.pagination, 'page', 1)
                this.$set(this.pagination, 'perPage', 10)
                this.getTableData()
              }
            }).catch(() => {
              this.modelShowStatus = false
            })
          } else if (this.modelShowTitle === '修改字典') {
            editDictData(this.info).then(response => {
              this.modelShowStatus = false
              if (response.code === 200) {
                this.$message.success('修改成功')
                this.getTableData()
              }
            }).catch(() => {
              this.modelShowStatus = false
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
