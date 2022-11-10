<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="6">
              <a-form-item
                label="创建人："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <selectPersonnel v-model="screenData.ids" :multiple="true" :num="10" :type="'selector'" />
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item
                label="规则名称："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-input v-model="screenData.ruleName" />
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item
                label="状态："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }" >
                <a-select v-model="screenData.ruleState" >
                  <a-select-option value="1">
                    启用
                  </a-select-option>
                  <a-select-option value="0">
                    禁用
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item
                label="创建时间："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-range-picker
                  v-model="screenData.time"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期', '结束日期']"
                  :style="'width: 100%'"
                  @change="onOk"
                />
              </a-form-item>
            </a-col>
            <!-- <a-col :lg="6">
              <a-form-item
                label="执行人数："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }" >
                <a-select v-model="screenData.relPeopleNum" >
                  <a-select-option value="1">
                    1-10
                  </a-select-option>
                  <a-select-option value="2">
                    10-20
                  </a-select-option>
                  <a-select-option value="3">
                    20-50
                  </a-select-option>
                  <a-select-option value="4">
                    50-100
                  </a-select-option>
                  <a-select-option value="5">
                    100人以上
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
          </a-row>
        </a-form>
      </div>
      <!--end search-->

      <!--table-->
      <div class="table-wrapper">
        <div class="table-head">
          <div class="fr">
            <a-button
              type="primary"
              @click="search"
              v-permission="'/collaborator_rules@search'">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
            <a-button
              type="primary"
              @click="addFn('add')"
              v-permission="'/collaborator_rules@add'">创建协作人规则</a-button>
          </div>
        </div>
        <a-table
          rowKey="id"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :scroll="{ x: 1500}"
          @change="handleTableChange">
          <div slot="ruleState" slot-scope="text,record">
            <a-switch
              :checked="record.ruleState===1"
              v-permission="'/collaborator_rules@state'"
              @click="onChange(record)"
              checked-children="开"
              un-checked-children="关" />
          </div>
          <div slot="relPeopleNum" slot-scope="text,record">
            <a-button type="link" v-permission="'/collaborator_rules@person'" @click="showPersonDetail(record)">{{ text }}</a-button>
          </div>
          <div
            slot="action"
            class="action"
            slot-scope="text, record">
            <template>
              <a @click="editFn(record)" v-permission="'/collaborator_rules@edit'">编辑</a>
              <a @click="detailFn(record)" v-permission="'/collaborator_rules@detail'">查看</a>
              <a v-show="record.ruleState == 0" @click="destoryFn(record)" v-permission="'/collaborator_rules@delete'">删除</a>
            </template>
          </div>
          <div
            slot="relationPeople"
            slot-scope="text, record">
            <template>
              <a @click="showRelationPeople(record)">{{ record.relationPeople }}</a>
            </template>
          </div>
          <div
            slot="startEndTime"
            slot-scope="text, record">
            {{ record.startTime }} - {{ record.endTime }}
          </div>
        </a-table>
      </div>
      <!--end table-->
      <!--modal-->
      <a-modal
        width="800px"
        :visible="modalVisible"
        @cancel="reset"
        :title="modalType==='add'?'创建协作人规则':'编辑协作人规则'">
        <div class="modalBox" v-if="modalVisible">
          <a-form-model ref="ruleForm" :rules="rules" :model="formData">
            <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-model-item
                  label="规则名称："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }"
                  prop="ruleName">
                  <a-input v-model="formData.ruleName" :disabled="edit" placeholder="请输入规则名称" :maxLength="15" :suffix="`${formData.ruleName ? formData.ruleName.length+'' : '0'}/15`" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-model-item
                  label="功能描述："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }"
                  prop="noted">
                  <a-textarea v-model="formData.noted" :disabled="edit" :rows="4" placeholder="请输入" :maxLength="300" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-model-item
                  label="以下人员允许开启协作人："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }">
                  <selectPersonnel
                    v-model="ids"
                    v-if="treeData"
                    :record="treeData"
                    :multiple="true"
                    :num="15"
                    type="button" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <div v-if="indexPeople" style="margin-left:60px;margin-bottom:10px;color:red;">(请输入至少一条协作人信息)</div>
            <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-model-item
                  v-if="modalType==='add'"
                  label="协作人抽成比例："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }"
                  prop="proportion">
                  协作人提成:
                  <a-input :disabled="edit" v-model="formData.proportion" style="width: 100px"></a-input>
                  %
                </a-form-model-item>
                <a-form-model-item
                  v-else
                  label="协作人抽成比例："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }">
                  协作人提成:
                  <a-input :disabled="edit" v-model="formData.proportion" style="width: 100px"></a-input>
                  %
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-model-item
                  v-if="modalType==='add'"
                  label="生效起止时间："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }"
                  prop="time">
                  <a-range-picker
                    :disabled="edit"
                    v-model="formData.time"
                    format="YYYY-MM-DD"
                    :placeholder="['开始日期', '结束日期']"
                    @change="onOkByFormData"
                  />
                </a-form-model-item>
                <a-form-model-item
                  v-else
                  label="生效起止时间："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }">
                  <a-range-picker
                    :disabled="edit"
                    v-model="formData.time"
                    format="YYYY-MM-DD"
                    :placeholder="['开始日期', '结束日期']"
                    @change="onOkByFormData"
                  />
                </a-form-model-item>
              </a-col>
            </a-row> -->
          </a-form-model>
        </div>
        <template slot="footer">
          <a-button key="back" @click="reset">
            取 消
          </a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="saveFn">
            确 定
          </a-button>
        </template>
      </a-modal>
      <!--end modal-->

      <!--modal-->
      <a-modal
        width="800px"
        :footer="null"
        :visible="modalVisibleShow"
        @cancel="resetByShow"
        title="协作人规则详情">
        <div class="modalBox" v-if="modalVisibleShow">
          <a-form>
            <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-model-item
                  label="规则名称："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }"
                  prop="ruleName">
                  <a-input v-model="formData.ruleName" disabled placeholder="请输入规则名称" :maxLength="15" :suffix="`${formData.ruleName ? formData.ruleName.length+'' : '0'}/15`" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-item
                  label="功能描述："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }">
                  <a-textarea disabled v-model="formData.noted" :rows="4" placeholder="请输入" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-model-item
                  label="以下人员允许开启协作人："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }">
                  <selectPersonnel
                    v-model="ids"
                    v-if="treeData"
                    :record="treeData"
                    :multiple="true"
                    :num="15"
                    type="button" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-item
                  label="协作人抽成比例："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }">
                  协作人提成:
                  <a-input disabled v-model="formData.proportion" style="width: 100px"></a-input>
                  %
                </a-form-item>
              </a-col>
            </a-row>
            <!-- <a-row :gutter="16">
              <a-col :lg="20">
                <a-form-item
                  label="生效起止时间："
                  :labelCol="{lg: {span: 7} }"
                  :wrapperCol="{lg: {span: 17} }">
                  <a-range-picker
                    disabled
                    v-model="formData.time"
                    :show-time="{ format: 'yyyy-MM-dd' }"
                    format="YYYY-MM-DD"
                    :placeholder="['开始日期', '结束日期']"
                    @change="onOkByFormData"
                  />
                </a-form-item>
              </a-col>
            </a-row> -->
          </a-form>
        </div>
      </a-modal>
      <!--end modal-->

      <!--modal-->
      <a-modal
        width="900px"
        :footer="null"
        :visible="modalRelationPeopleVisible"
        @cancel="resetRelationPeople"
        title="协作机制执行人">
        <div class="modalBox" v-if="modalRelationPeopleVisible">
          <actorDetail :id="curId" />
        </div>
      </a-modal>
      <!--end modal-->

      <!--repeatModal-->
      <a-modal
        width="900px"
        :footer="null"
        :visible="repeatModalVisible"
        @cancel="cancelFn"
        title="">
        <div class="modalBox" v-if="repeatModalVisible">
          <p style="color:#ff0000;">警告：同一人员只能同时执行一个规则。以下成员正在执行其他规则，和此规则发生冲突。</p>
          <a-table
            rowKey="id"
            :loading="loading"
            :columns="repeatColumns"
            :pagination="false"
            :data-source="repeatTableData"
            :scroll="{ y: 400 }">
          </a-table>
        </div>
        <div class="handleBox">
          <a-button @click="cancelFn">取消{{ repeatModalType === 'state' ? '开启' : '保存' }}</a-button>
          <a-button @click="delFn" type="danger">移除冲突人员并{{ repeatModalType === 'state' ? '开启' : '保存' }}规则</a-button>
          <a-button @click="holdFn" type="primary">保留冲突人员并{{ repeatModalType === 'state' ? '开启' : '保存' }}规则</a-button>
        </div>
      </a-modal>
      <!--end repeatModal-->

      <!--repeatModal-->
      <a-modal
        width="900px"
        :footer="null"
        :visible="personModalVisible"
        @cancel="cancelPerson"
        title="协作机制执行人">
        <div class="modalBox" v-if="personModalVisible">
          <a-table
            rowKey="employeeName"
            :loading="loading"
            :columns="personColumns"
            :data-source="personTableData"
            :pagination="personPagination"
            @change="personHandleTableChange"
            :scroll="{ x: 800}">
          </a-table>
        </div>
      </a-modal>
      <!--end repeatModal-->

    </a-card>
  </div>
</template>

<script>
import { departmentEmp } from '@/api/common.js'
import moment from 'moment'
// collaboratorRules, collaboratorRulesAdd,, collaboratorRulesUpdate, collaboratorRulesDestroy, collaboratorRulesUpdateState
import { collaboratorRulesShow } from '@/api/collaboratorRules'
import { collaboratorList, collaboratorStore, collaboratorModify, collaboratorRelation, collaboratorDestroy, collaboratorState, collaboratorRetain, collaboratorDetach, collaboratorDetachSave, collaboratorRetainSave } from '@/api/actor'
import { deepClone } from '@/utils/util'
import { checkNumber } from '@/utils/validate'
import actorDetail from './components/actorDetail.vue'
export default {
  components: {
    actorDetail
  },
  data () {
    const validateName = (rule, value, callback) => {
      if (checkNumber(value)) {
        callback()
      } else {
        return callback(new Error('只允许0-100之间,且最大保留4位小数'))
      }
    }
    const validateNoted = (rule, value, callback) => {
      if (value.length <= 300) {
        callback()
      } else {
        return callback(new Error('字数不能超过300字！'))
      }
    }
    return {
      treeData: [],
      loading: false,
      modalVisible: false,
      modalVisibleShow: false,
      modalRelationPeopleVisible: false,
      repeatModalVisible: false,
      repeatModalType: 'state', // state:点击状态  edit:点击编辑
      personModalVisible: false,
      modalType: 'add', // add edit
      screenData: {},
      relationscreenData: {},
      edit: false, // 页面是否不可编辑 false 可以编辑 true不可以编辑
      names: '', // 详情页返回协作人集合
      checked: true,
      button: 'button',
      curId: '',
      curRecord: {},
      curPersonItem: {},
      columns: [
        {
          title: '规则创建人',
          dataIndex: 'createdEmpName',
          align: 'center',
          width: 200
        },
        {
          title: '规则名称',
          dataIndex: 'ruleName',
          align: 'center',
          width: 200
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          sorter: true,
          width: 100,
          align: 'left'
        },
        {
          title: '执行人数(个)',
          dataIndex: 'relPeopleNum',
          sorter: true,
          align: 'left',
          width: 150,
          scopedSlots: { customRender: 'relPeopleNum' }
        },
        // {
        //   title: '起止时间',
        //   align: 'center',
        //   width: 200,
        //   scopedSlots: { customRender: 'startEndTime' }
        // },
        // {
        //   title: '已开启时间',
        //   dataIndex: 'used',
        //   align: 'center',
        //   width: 150
        // },
        // {
        //   title: '剩余时间',
        //   dataIndex: 'unused',
        //   align: 'center',
        //   width: 150
        // },
        {
          title: '是否生效',
          dataIndex: 'ruleState',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'ruleState' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns2: [
        {
          title: '员工姓名',
          dataIndex: 'employeeName',
          align: 'center',
          width: 150
        },
        {
          title: '机构名称',
          dataIndex: 'departmentName',
          width: 150,
          align: 'center'
        },
        {
          title: '门店名称',
          dataIndex: 'storeName',
          align: 'center',
          width: 150
        }
      ],
      repeatColumns: [
        {
          title: '成员名称',
          dataIndex: 'employeeName',
          align: 'center',
          width: 150
        },
        {
          title: '所属机构',
          dataIndex: 'departmentName',
          width: 150,
          align: 'center'
        },
        {
          title: '所属门店',
          dataIndex: 'storeName',
          align: 'center',
          width: 150
        },
        {
          title: '当前执行规则',
          dataIndex: 'ruleName',
          align: 'center',
          width: 150
        }
      ],
      personColumns: [
        {
          title: '姓名',
          dataIndex: 'employeeName',
          align: 'center',
          width: 150
        },
        {
          title: '所属机构',
          dataIndex: 'departmentName',
          width: 150,
          align: 'center'
        },
        {
          title: '所属门店',
          dataIndex: 'storeName',
          align: 'center',
          width: 150
        }
      ],
      tableData: [],
      repeatTableData: [],
      personTableData: [],
      ruleRelationPeopleData: [],
      indexPeople: false,
      relationpagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      personPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      ids: [],
      formData: {
        noted: ''
      },
      rules: {
        ruleName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        noted: [
          { required: true, message: '请输入规则描述', trigger: 'blur' },
          { validator: validateNoted, trigger: 'blur' }
        ],
        proportion: [
          { required: true, message: '请输入协作人抽成比例', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入生效起止时间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    ids: function (newData) {
      if (newData.length > 0) {
        this.indexPeople = false
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
      this.departmentEmp()
    },
    /**
     * 拉取部门数据
     */
    departmentEmp () {
      departmentEmp().then(res => {
        this.treeData = res.data
      })
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
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      Object.assign(params, ...[this.screenData])
      collaboratorList(params).then((res) => {
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
     * 规则关联协作人表格
     */
    showRelationPeople (record) {
      this.curId = record.id.toString()
      this.modalRelationPeopleVisible = true
    },
    /**
     * 保存
     */
    saveFn () {
      if (this.modalType == 'add') {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            if (this.ids.length < 1) {
              this.indexPeople = true
              return false
            }
            this.formData.ids = this.ids
            this.loading = true
            collaboratorStore(this.formData).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.reset()
                this.search()
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      } else if (this.modalType == 'edit') {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            console.log('edit')
            if (this.ids.length < 1) {
              this.indexPeople = true
              return false
            }
            this.formData.ids = this.ids
            this.loading = true
            collaboratorModify(this.formData).then(res => {
              this.loading = false
              if (res.code === 200) {
                if (res.data.status === '1') {
                  this.repeatModalVisible = true
                  this.repeatModalType = 'edit'
                  this.repeatTableData = res.data.clashList
                } else {
                  this.reset()
                  this.search()
                }
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    },
    onChange (record) {
      this.curRecord = record
      const _this = this
      this.$confirm({
        title: '提示',
        content: '确定要修改规则状态吗？',
        onOk () {
          const params = {
            id: record.id
          }
          collaboratorState(params).then((res) => {
            if (res.code === 200) {
              if (res.data.status === '1') {
                _this.repeatTableData = res.data.clashList
                _this.repeatModalVisible = true
              }
              _this.getTableData()
            }
          })
        }
      })
    },
    /**
     * 创建协作人规则
     */
    addFn (type) {
      this.modalType = type
      this.modalVisible = true
      this.edit = false
      this.formData = {}
      this.ids = []
      this.names = []
    },
    /**
     * 编辑协作人规则
     */
    editFn (record) {
      this.modalType = 'edit'
      this.curRecord = record
      this.edit = true
      const param = {
        id: record.id
      }
      this.formData = {}
      collaboratorRulesShow(param).then(res => {
        // deepClone(this.formData, res.data)
        this.formData = res.data
        const ids = []
        for (let i = 0; i < res.data.ids.length; i++) {
          ids.push(res.data.ids[i] + '')
        }
        this.ids = ids
        this.names = res.data.names
        this.formData.time = [moment(res.data.startTime).format('YYYY-MM-DD HH:mm:ss'), moment(res.data.endTime).format('YYYY-MM-DD HH:mm:ss')]
      })
      this.modalVisible = true
    },
    /**
     * 删除协作人规则
     */
    destoryFn (record) {
      const _this = this
      let msg = ''
      if (record.useStatus === 1) {
        msg = `该规则已经生成相关订单，删除后将对已生成订单造成影响。是否要删除规则：${record.ruleName}?`
      } else {
        msg = `是否要删除规则：${record.ruleName}?`
      }
      this.$confirm({
        title: '提示',
        content: msg,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          const param = {
            id: record.id
          }
          collaboratorDestroy(param).then(res => {
            _this.search()
          })
        }
      })
    },
    /**
     * 添加修改取消
     */
    reset () {
      this.indexPeople = false
      this.modalVisible = false
    },
    /**
     * 详情取消
     */
    resetByShow () {
      this.modalVisibleShow = false
    },
    /**
     * 关联人列表取消
     */
    resetRelationPeople () {
      this.modalRelationPeopleVisible = false
    },
    /**
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      if (value.length == 0) {
        this.screenData.startTime = ''
        this.screenData.endTime = ''
      } else {
        this.screenData.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
        this.screenData.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    /**
     * 日期选择
     * @param {*} value
     */
    onOkByFormData (value) {
      this.formData.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
      this.formData.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    /**
     * 详情
     */
    detailFn (record) {
      const param = {
        id: record.id
      }
      collaboratorRulesShow(param).then(res => {
        deepClone(this.formData, res.data)
        const ids = []
        for (let i = 0; i < res.data.ids.length; i++) {
          ids.push(res.data.ids[i] + '')
        }
        this.ids = ids
        this.names = res.data.names
        this.formData.time = [moment(res.data.startTime).format('YYYY-MM-DD HH:mm:ss'), moment(res.data.endTime).format('YYYY-MM-DD HH:mm:ss')]
      })
      this.modalVisibleShow = true
    },
    /**
     * 人员回调
     */
    getPersonIds (e) {
      this.screenData.keys = e
      console.log(222, e)
    },
    /**
     * 取消开启
     */
    cancelFn () {
      this.repeatModalVisible = false
    },
    /**
     * 移除冲突人员
     */
    delFn () {
      const _this = this
      this.$confirm({
        title: '提示',
        content: '是否将冲突人员从此规则中移除，然后开启规则？',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          _this.loading = true
          if (_this.repeatModalType === 'state') {
            const param = {
              id: _this.curRecord.id
            }
            collaboratorDetach(param).then(res => {
              _this.repeatModalVisible = false
              _this.modalVisible = false
              _this.repeatModalType = 'state'
              _this.search()
            })
          } else {
            const param = {
              id: _this.curRecord.id,
              ids: _this.ids
            }
            collaboratorDetachSave(param).then(res => {
              _this.repeatModalVisible = false
              _this.modalVisible = false
              _this.repeatModalType = 'state'
              _this.search()
            }).catch(() => {
              _this.repeatModalVisible = false
              _this.modalVisible = false
              _this.repeatModalType = 'state'
              _this.search()
            })
          }
        }
      })
    },
    /**
     * 保留冲突人员
     */
    holdFn () {
      const _this = this
      this.$confirm({
        title: '提示',
        content: '是否将冲突人员从原有规则中移除，然后开启规则？',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          _this.loading = true
          if (_this.repeatModalType === 'state') {
            const param = {
              id: _this.curRecord.id
            }
            collaboratorRetain(param).then(res => {
              _this.repeatModalVisible = false
              _this.modalVisible = false
              _this.repeatModalType = 'state'
              _this.search()
            })
          } else {
            const param = {
              id: _this.curRecord.id,
              ids: _this.ids
            }
            collaboratorRetainSave(param).then(res => {
              _this.repeatModalVisible = false
              _this.modalVisible = false
              _this.repeatModalType = 'state'
              _this.search()
            }).catch(() => {
              _this.repeatModalVisible = false
              _this.modalVisible = false
              _this.repeatModalType = 'state'
              _this.search()
            })
          }
        }
      })
    },
    /**
     * 弹框查人员
     */
    showPersonDetail (record) {
      this.personModalVisible = true
      this.personPagination = {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
      this.curPersonItem = record
      this.personDetail()
    },
    /**
     * 查看执行人
     */
    personDetail () {
      const param = {
        page: this.personPagination.current,
        perPage: this.personPagination.pageSize,
        id: this.curPersonItem.id
      }
      collaboratorRelation(param).then(res => {
        this.personTableData = res.data.list
        this.personPagination.total = res.data.page.total
      })
    },
    /**
     * 关闭人员弹框
     */
    cancelPerson () {
      this.personModalVisible = false
    },
    /**
     * 表格监听事件
     */
    personHandleTableChange (pagination, filters, sorter) {
      this.personPagination.current = pagination.current
      this.personPagination.pageSize = pagination.pageSize
      this.personDetail()
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
.handleBox{
  margin-top:30px;
  button{
    margin-right:10px;
  }
}
</style>
