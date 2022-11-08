<template>
  <div>
    <a-card title="数据筛选">
      <a-row>
        <a-col :span="6">
          <a-input v-model="searchInfo.typeCode" placeholder="请输入分类编码"></a-input>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-input v-model="searchInfo.typeName" placeholder="请输入字典编码"></a-input>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-button type="primary" style="marginRight:10px" @click="search">查询</a-button>
          <a-button @click="resetSearch">重置</a-button>
        </a-col>
      </a-row>
      <div class="table-wrapper">
        <div class="top-btn">
          <a-button class="batch" type="primary" @click="add">添加</a-button>
        </div>
        <a-table
          bordered
          :row-key="record => record.id"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <div slot="options" slot-scope="text, record">
            <template>
              <div style="display: flex;justify-content: space-around;">
                <a-button type="link" @click="goDetail(record)">详情</a-button>
                <a-button type="link" @click="editItem(record)">编辑</a-button>
                <a-button type="link" @click="deleteItem(record.id)">删除</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </div>
    </a-card>
    <a-modal
      :title="menuShowTitle"
      :maskClosable="false"
      :width="500"
      :visible="menuShow"
      @cancel="menuShow = false"
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
          <a-input v-model.trim="info.typeCode" :maxLength="10" placeholder="请输入分类编码"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="字典编码"
          prop="typeName"
          required>
          <a-input v-model.trim="info.typeName" placeholder="请输入字典编码"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="字典排序"
          prop="typeSort"
          required>
          <a-input-number v-model.trim="info.typeSort" placeholder="请输入字典排序" class="inputNumberDiv"></a-input-number>
        </a-form-model-item>
        <a-form-model-item
          label="字典描述"
          prop="typeDesc"
          required>
          <a-textarea v-model.trim="info.typeDesc" placeholder="请输入字典描述"></a-textarea>
        </a-form-model-item>
      </a-form-model>
      <div slot="footer" class="footer">
        <template>
          <a-button
            type="link"
            @click="submit"
            :loading="loading">
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
// import { getDictData } from '@/api/dict'

const columns = [
  {
    title: '分类编码',
    align: 'center',
    dataIndex: 'typeCode'
  },
  {
    title: '字典编码',
    align: 'center',
    dataIndex: 'typeName'
  },
  {
    title: '字典排序',
    dataIndex: 'typeSort',
    align: 'center'
  },
  {
    title: '字典描述',
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
      createValidate(callback, value, '请输入字典编码')
    }
    const vTypeSort = (rule, value, callback) => {
      value = this.info.typeSort
      createValidate(callback, value, '请输入字典排序')
    }
    const vTypeDesc = (rule, value, callback) => {
      value = this.info.typeDesc
      createValidate(callback, value, '请输入字典描述')
    }
    return {
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
      menuShow: false,
      // 弹框标题
      menuShowTitle: '',
      loading: false,
      // 表单提交规则
      rules: {
        typeCode: createFunc(vTypeCode, 'change'),
        typeName: createFunc(vTypeName, 'change'),
        typeSort: createFunc(vTypeSort, 'change'),
        typeDesc: createFunc(vTypeDesc, 'change')
      },
      usedIconList: []
    }
  },
  watch: {
    menuShow (value) {
      if (!value) {
        this.loading = false
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
      const params = {
        typeCode: this.searchInfo.typeCode ? this.searchInfo.typeCode : '',
        typeName: this.searchInfo.typeName ? this.searchInfo.typeName : '',
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      console.log(params, '查询数据提交接口的对象')
    //   try {
    //     const data = await menuList(params)
    //     this.pagination.total = Number(data.data.page.total)
    //     this.tableData = data.data.list
    //   } catch (e) {
    //     console.log(e)
    //   }
    },
    // 搜索
    search () {
      this.pagination.current = 1
      this.getTableData()
    },
    // 修改数据
    async editItem (menuId) {
      console.log(menuId)
      this.menuShow = true
      this.menuShowType = 'edit'
      this.menuShowTitle = '修改字典'
    //   this.menuShow = true
    //   this.menuShowType = 'edit'
    //   this.menuShowTitle = '编辑菜单'
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
      this.$router.push({ path: '/dict/dictDataDetail' })
    },
    // 重置搜索
    resetSearch () {
      this.$delete(this.searchInfo, 'typeName')
      this.$delete(this.searchInfo, 'typeCode')
    },
    // 重置提交表单
    resetForm () {
      this.info = {}
    },
    // 添加
    add () {
      this.menuShow = true
      this.menuShowType = 'add'
      this.menuShowTitle = '新增字典'
    },
    // 提交
    submit () {
      console.log('提交')
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          console.log('可以提交', this.info)
        //   this.loading = true
        //   try {
        //     if (this.menuShowType == 'add') {
        //       this.menuShow = false
        //       this.$message.success('添加成功')
        //       this.getTableData()
        //     } else {
        //       this.menuShow = false
        //       this.$message.success('修改成功')
        //       this.getTableData()
        //     }
        //   } catch (e) {
        //     console.log(e)
        //     this.loading = false
        //   }
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
