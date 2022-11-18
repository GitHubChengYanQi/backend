<template>
  <div>
    <a-card title="数据筛选">
      <a-row>
        <a-col :span="6">
          <a-input v-model="searchInfo.typeCode" placeholder="请输入分类编码"></a-input>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-input v-model="searchInfo.typeName" placeholder="请输入分类名称"></a-input>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-button type="primary" style="marginRight:10px" @click="search" v-permission="'/dictType/common/getList@post'">查询</a-button>
          <a-button @click="resetSearch" v-permission="'/dictType/common/getList@post'">重置</a-button>
        </a-col>
      </a-row>
      <div class="table-wrapper">
        <div class="top-btn">
          <a-button class="batch" type="primary" @click="add" v-permission="'/dictType/common/add@post'">添加</a-button>
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
          <div slot="options" slot-scope="record">
            <template>
              <div style="display: flex;justify-content: space-around;">
                <a-button type="link" @click="goDetail(record)">详情</a-button>
                <a-button type="link" @click="editItem(record)" v-permission="'/dictType/common/modify@post'">编辑</a-button>
                <a-button type="link" @click="deleteItem(record.id)" v-permission="'/dictType/common/delete@get'">删除</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </div>
    </a-card>
    <a-modal
      :title="modelShowType"
      :maskClosable="false"
      :width="500"
      :visible="modelShow"
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
          <a-input :disabled="modelShowType === '修改字典分类'" v-model.trim="info.typeCode" :maxLength="20" placeholder="请输入分类编码"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="分类名称"
          prop="typeName"
          required>
          <a-input v-model.trim="info.typeName" :maxLength="20" placeholder="请输入分类名称"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="分类排序"
          prop="typeSort"
          required>
          <a-input-number v-model.trim="info.typeSort" :min="1" placeholder="请输入分类排序" class="inputNumberDiv"></a-input-number>
        </a-form-model-item>
        <a-form-model-item
          label="分类描述"
          prop="typeDesc">
          <a-textarea v-model.trim="info.typeDesc" placeholder="请输入分类描述"></a-textarea>
        </a-form-model-item>
      </a-form-model>
      <div slot="footer" class="footer">
        <template>
          <a-button
            v-if="modelShowType === '新增字典分类'"
            type="link"
            @click="submit"
            v-permission="'/dictType/common/add@post'">
            确认
          </a-button>
          <a-button
            v-if="modelShowType === '修改字典分类'"
            type="link"
            @click="submit"
            v-permission="'/dictType/common/modify@post'">
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
import { getDictTypeData, addDictType, editDictType, deleteDictType } from '@/api/dict'

const columns = [
  {
    title: '分类编码',
    align: 'center',
    dataIndex: 'typeCode'
  },
  {
    title: '分类名称',
    align: 'center',
    dataIndex: 'typeName'
  },
  {
    title: '分类排序',
    dataIndex: 'typeSort',
    align: 'center'
  },
  {
    title: '分类描述',
    align: 'center',
    dataIndex: 'typeDesc'
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
    const vTypeName = (rule, value, callback) => {
      value = this.info.typeName
      createValidate(callback, value, '请输入分类名称')
    }
    const vTypeSort = (rule, value, callback) => {
      value = this.info.typeSort
      createValidate(callback, value, '请输入分类排序')
    }
    return {
      // 表格加载动画
      tableLoading: false,
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
      modelShow: false,
      // 弹框标题
      modelShowType: '',
      // 表单提交规则
      rules: {
        typeCode: createFunc(vTypeCode, 'change'),
        typeName: createFunc(vTypeName, 'change'),
        typeSort: createFunc(vTypeSort, 'change')
      },
      usedIconList: []
    }
  },
  watch: {
    modelShow (value) {
      if (!value) {
        this.$refs.ruleForm.clearValidate()
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
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
        typeCode: this.searchInfo.typeCode ? this.searchInfo.typeCode : '',
        typeName: this.searchInfo.typeName ? this.searchInfo.typeName : '',
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      console.log(params, '查询数据提交接口的对象')
      await getDictTypeData(params).then(response => {
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
          deleteDictType(params).then(response => {
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
    // 搜索
    search () {
      this.pagination.current = 1
      this.getTableData()
    },
    // 修改数据
    async editItem (record) {
      console.log(record)
      this.modelShow = true
      this.modelShowType = '修改字典分类'
      const tempIndex = this.tableData.findIndex(item => item.id === record.id)
      this.info = Object.assign({}, this.tableData[tempIndex])
    //   this.modelShow = true
    //   this.modelShowType = '编辑菜单'
    //   try {
    //     const { data } = await menuDetail({ menuId })
    //     Object.assign(this, data)
    //     this.firstMenuChange()
    //     this.secondMenuChange()
    //     this.thirdMenuChange()
    //   } catch (e) {
    //     console.log(e)
    //   }
    },
    // 查看字典详情
    goDetail (info) {
      console.log(info)
      this.$router.push({
        path: '/dict/dictDataDetail',
        query: {
          importString: JSON.stringify(info)
        }
      })
    },
    // 重置搜索
    resetSearch () {
      this.$delete(this.searchInfo, 'typeName')
      this.$delete(this.searchInfo, 'typeCode')
      this.$set(this.pagination, 'page', 1)
      this.$set(this.pagination, 'perPage', 10)
      this.getTableData()
    },
    // 重置提交表单
    resetForm () {
      this.modelShow = false
      this.info = {}
    },
    // 添加
    add () {
      this.modelShow = true
      this.modelShowType = '新增字典分类'
      // this.$refs.ruleForm.clearValidate()
      this.info = {}
    },
    // 提交
    submit () {
      console.log('提交')
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          console.log('可以提交', this.info)
          if (this.modelShowType === '新增字典分类') {
            addDictType(this.info).then(response => {
              this.modelShow = false
              if (response.code === 200) {
                this.$message.success('添加成功')
                this.$set(this.pagination, 'page', 1)
                this.$set(this.pagination, 'perPage', 10)
                this.getTableData()
              }
            }).catch(() => {
              this.modelShow = false
            })
          } else if (this.modelShowType === '修改字典分类') {
            editDictType(this.info).then(response => {
              this.modelShow = false
              if (response.code === 200) {
                this.$message.success('修改成功')
                this.getTableData()
              }
            }).catch(() => {
              this.modelShow = false
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
