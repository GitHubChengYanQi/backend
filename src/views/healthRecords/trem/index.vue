<template>
  <div>
    <a-card>

      <!--table-->
      <div class="table-wrapper">
        <div class="table-head">
          <div class="fl">
            <a-button
              icon="plus"
              type="primary"
              v-permission="'/business_terms/store@post'"
              @click="updateFn('add')">新增</a-button>
            <a-button
              icon="edit"
              type="primary"
              v-permission="'/business_terms/update@post'"
              @click="updateFn('edit')">修改</a-button>
            <a-button
              icon="delete"
              type="danger"
              v-permission="'/business_terms/destroy@delete'"
              @click="delFn()">删除</a-button>
          </div>
          <div class="fr">
            <span>当前术语：</span>
            <span><i class="labelSpan" v-for="(item, index) in labels" :key="index">{{ item.name.length>=10?(item.name).slice(0,10)+'...':item.name }}</i></span>
            <a-button
              v-if="labels.length>1"
              icon="left"
              @click="backFn()">返回</a-button>
          </div>
        </div>
        <a-table
          rowKey="id"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
              {{ typeMap[text] }}
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
              <a v-permission="'/business_terms/show@get'" v-if="record.type==='web' || record.type==='module' || record.type==='casette' || record.type==='list' || record.type==='tab' || record.type==='lable'" @click="detailFn(record)">子列表管理</a>
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->

      <!--modal-->
      <a-modal
        width="800px"
        :visible="modalVisible"
        @cancel="reset"
        title="信息内容">
        <a-form-model
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20}"
          :model="formData"
          :rules="rules"
          ref="ruleForm">
          <a-form-model-item class="form-item" label="名称" prop="name">
            <a-input v-model="formData.name" class="input" :maxLength="20" placeholder="请输入名称"></a-input>
          </a-form-model-item>
          <a-form-model-item class="form-item" label="标识" prop="value">
            <a-input v-model="formData.value" class="input" :disabled="modalType === 'edit'" :maxLength="12" placeholder="请输入标识(英文字母或下划线)"></a-input>
          </a-form-model-item>
          <a-form-model-item label="状态">
            <a-radio-group v-model="formData.status">
              <a-radio :value="0">
                启用
              </a-radio>
              <a-radio :value="1">
                禁用
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item class="form-item" label="优先级" prop="sort">
            <a-input-number v-model="formData.sort" class="inputNum" :min="0" :max="999999" placeholder="请输入优先级"></a-input-number>
          </a-form-model-item>
          <a-form-model-item label="区分" v-if="labels.length === 1">
            <a-radio-group :disabled="modalType === 'edit'" v-model="formData.differentiate" @change="changeType">
              <a-radio value="personal">
                个人
              </a-radio>
              <a-radio value="record">
                档案记录
              </a-radio>
              <a-radio value="tag">
                标签
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="类型" v-show="labels.length >= 1">
            <a-radio-group :disabled="modalType === 'edit'" v-model="formData.type">
              <a-radio :value="item.id" v-for="(item, index) in curOpt" :key="index">
                {{ item.name }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <div v-if="labels.length > 1 && (this.formData.type === 'rangeDouble' || this.formData.type === 'range')">
            <a-form-model-item class="form-item" label="整数位最大值" prop="max">
              <a-input-number
                v-model="formData.max"
                class="inputNum"
                :min="0"
                :max="9999"
                :precision="0"
                placeholder="请输入整数位最大值"></a-input-number>
            </a-form-model-item>
            <a-form-model-item class="form-item" label="整数位间隔" prop="interval">
              <a-input-number
                v-model="formData.interval"
                class="inputNum"
                :min="0"
                :max="9999"
                :precision="0"
                placeholder="请输入整数位间隔"></a-input-number>
            </a-form-model-item>
            <a-form-model-item class="form-item" label="整数位最小值" prop="min">
              <a-input-number
                v-model="formData.min"
                class="inputNum"
                :min="0"
                :max="9999"
                :precision="0"
                placeholder="请输入整数位最小值"></a-input-number>
            </a-form-model-item>
          </div>
          <a-form-model-item label="是否拉取网络数据">
            <a-radio-group v-model="formData.isPull">
              <a-radio :value="0">
                否
              </a-radio>
              <a-radio :value="1">
                是
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
        <template slot="footer">
          <a-button type="primary" @click="saveFn">保存</a-button>
          <a-button @click="reset">取消</a-button>
        </template>
      </a-modal>
      <!--end modal-->
    </a-card>
  </div>
</template>

<script>
import { businessTerms, businessTermsAdd, businessTermsUpdate, businessTermsDestroy, businessTermsShow } from '@/api/healthRecords'
import { checkTitle } from '@/utils/validate'
import { deepClone } from '@/utils/util'
export default {
  data () {
    const validateValue = (rule, value, callback) => {
      if (checkTitle(value)) {
        callback()
      } else {
        return callback(new Error('请输入英文字母或下划线'))
      }
    }
    return {
      loading: false,
      modalVisible: false,
      modalType: '', // add edit
      selectedRowKeys: [], // 选中key
      selectedRows: [], // 选中row
      labels: [
        {
          name: '根目录',
          id: 0
        }
      ],
      curOpt: [],
      opts: {
        root: [
          {
            id: 'personal',
            name: '个人'
          },
          {
            id: 'record',
            name: '档案记录'
          },
          {
            id: 'tag',
            name: '标签'
          }
        ],
        personal: [
          {
            id: 'module',
            name: '模块'
          }
        ],
        record: [
          {
            id: 'casette',
            name: '卡式'
          },
          {
            id: 'list',
            name: '列表'
          }
        ],
        tag: [
          {
            id: 'web',
            name: '页面'
          }
        ],
        module: [
          {
            id: 'radio',
            name: '单选框'
          },
          {
            id: 'checkbox',
            name: '多选框'
          },
          {
            id: 'select',
            name: '下拉框'
          }
        ],
        casette: [
          {
            id: 'input',
            name: '输入框'
          },
          {
            id: 'date',
            name: '日期'
          },
          {
            id: 'web',
            name: '页面'
          }
        ],
        list: [
          {
            id: 'module',
            name: '模块'
          },
          {
            id: 'date',
            name: '日期'
          },
          {
            id: 'range',
            name: '范围(整数)'
          },
          {
            id: 'rangeDouble',
            name: '范围(小数)'
          }
        ],
        web: [
          {
            id: 'tab',
            name: '页签'
          },
          {
            id: 'text',
            name: '文本框'
          }
        ],
        tab: [
          {
            id: 'radio',
            name: '单选框'
          },
          {
            id: 'checkbox',
            name: '多选框'
          }
        ]
      },
      typeMap: {
        web: '页面',
        module: '模块',
        checkbox: '多选框',
        radio: '单选框',
        select: '下拉框',
        text: '文本框',
        casette: '卡式',
        list: '列表',
        tab: '页签',
        lable: '标签',
        input: '输入框',
        date: '日期',
        range: '范围(整数)',
        rangeDouble: '范围(小数)',
        bm: '自动计算'
      },
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100,
          align: 'left',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'left',
          width: 150,
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '排序',
          dataIndex: 'sort',
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true
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
          { required: true, message: '请输入标识', trigger: 'blur' },
          { validator: validateValue, trigger: 'blur' }
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
        parentId: (this.labels[this.labels.length - 1]).id
      }
      businessTerms(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
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
      this.formData = {
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
      }
      this.selectedRows = []
      this.selectedRowKeys = []
      this.$refs.ruleForm.clearValidate()
      this.modalVisible = false
    },
    /**
     * 编辑
     */
    updateFn (type) {
      this.modalType = type
      this.curOpt = this.opts[(this.labels[this.labels.length - 1]).type]
      if (type === 'add') {
        if (this.curOpt) {
          this.formData.type = this.curOpt[0].id
        } else {
          this.curOpt = [
            {
              id: 'module',
              name: '模块'
            }
          ]
          this.formData.type = 'module'
        }
      }
      if (type === 'edit') {
        if (this.selectedRows.length === 1) {
          const param = {
            id: this.selectedRowKeys[0]
          }
          businessTermsShow(param).then(res => {
            deepClone(this.formData, res.data)
            if (!this.curOpt) {
              this.curOpt = this.opts[this.formData.differentiate]
            }
            this.formData.status = Number(this.selectedRows[0].status)
            this.formData.isPull = Number(this.selectedRows[0].isPull)
          })
        } else if (this.selectedRows.length === 0) {
          this.$message.error('请选择数据')
          return false
        } else {
          this.$message.error('只能编辑一条数据')
          return false
        }
      }
      this.modalVisible = true
    },
    /**
     * 删除
     */
    delFn () {
      const _this = this
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择数据')
        return false
      }
      this.$confirm({
        title: '提示',
        content: '确认删除？',
        onOk () {
          const param = {
            id: _this.selectedRowKeys.join(',')
          }
          businessTermsDestroy(param).then(res => {
            if (res.code === 200) {
              _this.search()
              _this.reset()
            } else {
              _this.$message.error(res.msg)
            }
          })
        },
        onCancel () {
          console.log('cancel')
        }
      })
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
     * 保存
     */
    saveFn () {
      this.formData.parentId = (this.labels[this.labels.length - 1]).id
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.modalType === 'add') {
            businessTermsAdd(this.formData).then(res => {
              if (res.code === 200) {
                this.search()
                this.reset()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            businessTermsUpdate(this.formData).then(res => {
              if (res.code === 200) {
                this.search()
                this.reset()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      })
    },
    /**
     * 下一级列表
     */
    detailFn (item) {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.labels.push(item)
      this.search()
    },
    /**
     * 返回
     */
    backFn () {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.labels.pop()
      this.search()
    },
    /**
     * 切换类型
     */
    changeType (e) {
      this.curOpt = this.opts[e.target.value]
      this.formData.type = this.curOpt[0].id
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
</style>
