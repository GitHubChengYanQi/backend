<!-- 随访任务 -->
<template>
  <div>
    <a-row type="flex" justify="space-between" class="flex-row-center">
      <div>
        <a-form :form="form" layout="inline" @submit="handleSubmit">
          <a-form-item label="患者:">
            <a-input placeholder="请输入姓名" v-decorator="['contactName']" style="width: 120px" />
          </a-form-item>
          <a-form-item label="手机号:">
            <a-input placeholder="请输入手机号" v-decorator="['mobile']" style="width: 120px" />
          </a-form-item>
          <a-form-item label="任务状态:">
            <a-select style="width: 120px" v-decorator="['status']">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="0">未开始</a-select-option>
              <a-select-option value="1">进行中</a-select-option>
              <a-select-option value="2">已完成</a-select-option>
              <a-select-option value="3">已停止</a-select-option>
              <a-select-option value="4">已过期</a-select-option>
            </a-select>
          </a-form-item>
          <!--          <a-form-item label="：">-->
          <!--            <a-select style="width: 120px" v-decorator="['contactTagIds']">-->
          <!--              <a-select-option value="全部分组"> 全部分组 </a-select-option>-->
          <!--              <a-select-option value="高血压一组"> 高血压一组 </a-select-option>-->
          <!--              <a-select-option value="糖尿病一组"> 糖尿病一组 </a-select-option>-->
          <!--              <a-select-option value="贫血一组"> 贫血一组 </a-select-option>-->
          <!--            </a-select>-->
          <!--          </a-form-item>-->
          <a-form-item label="任务内容：">
            <a-select
              label-in-value
              mode="multiple"
              :maxTagCount="3"
              placeholder="请选择任务内容"
              v-decorator="['formIds']"
              option-filter-prop="children"
              style="width: 150px"
            >
              <a-select-option v-for="item in taskArr" :key="item.formId">{{ item.name }}</a-select-option>
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />
                <div style="padding: 4px 8px; cursor: pointer" @mousedown="(e) => e.preventDefault()">
                  <a-button @click="selectState(1)">全选</a-button>
                  <a-button @click="selectState(2)">清空</a-button>
                </div>
              </div>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" v-permission="'/healthManage/currentProgrammeDetail/followUpTable#search'"> 查询 </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset"> 重置 </a-button>
          </a-form-item>
        </a-form>
      </div>
      <div>
        <a-radio-group default-value="1" button-style="solid" v-model="radioVal" @change="initFn">
          <a-radio-button value="1"> 随访问卷 </a-radio-button>
          <a-radio-button value="2"> 随访患教 </a-radio-button>
        </a-radio-group>
      </div>
    </a-row>
    <a-divider style="height: 0"></a-divider>
    <a-table
      rowKey="taskId"
      :loading="loading"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <div slot="contactData" slot-scope="contactData">
        <div>{{ contactData.name }}</div>
        <div>{{ contactData.nickName }}</div>
      </div>
      <div slot="mobile" slot-scope="mobile, record">
        <div>{{ record.contactData.mobile }}</div>
      </div>
      <!-- <div slot="tag" slot-scope="tag">
                <div v-for="(item,index) in tag" :key="index">{{ item }}</div>
            </div> -->
      <div slot="status" slot-scope="status">
        <div v-if="status == 0">未开始</div>
        <div v-if="status == 1">进行中</div>
        <div v-if="status == 2">已完成</div>
        <div v-if="status == 3">已停止</div>
        <div v-if="status == 4">已过期</div>
      </div>
      <div slot="startTime" slot-scope="startTime">
        <div>{{ timeFormat(startTime) }}</div>
      </div>
      <div slot="doneAt" slot-scope="doneAt">
        <div>{{ timeFormat(doneAt) }}</div>
      </div>
      <div slot="employeeName" slot-scope="employeeName, record">
        {{ record.contactData.employeeName }}
        <!-- <a-popover placement="bottom" trigger="click">
                    <template slot="content">
                        <div v-for="(item, index) in yg" :key="index" v-if="index">{{ item }}</div>
                    </template>
                    <div>{{ yg[0] }}
                        <a-icon style="margin:15px 0 0 5px" type="down" />
                    </div>
                </a-popover> -->
      </div>
      <!-- eslint-disable-next-line-->
      <div slot="planId" slot-scope="planId, record">
        <Space>
          <a-button type="primary" ghost v-if="record.status == 2 && record.type == 1" @click="getQuestionResults(record, false)" v-permission="'/healthManage/currentProgrammeDetail/followUpTable#get'">
            查看
          </a-button>
          <a-button type="primary" ghost v-if="record.type == 1" @click="getQuestionResults(record, true)" v-permission="'/healthManage/currentProgrammeDetail/followUpTable#edit'">
            编辑
          </a-button>
          <a-button type="primary" ghost @click="toDetail(record)" v-permission="'/healthManage/currentProgrammeDetail/followUpTable#detail'"> 详情 </a-button>
        </Space>
      </div>
    </a-table>
    <a-modal title="问卷" v-model="visible" :footer="null" :width="430">
      <div class="questionnairecontent">
        <QuestionnaireDetail
          :questionnaireArr="detailObj.questionResults"
          :questionnaireName="detailObj.questionnaireName"
          :detailObj="detailObj"
          :currentObj="currentObj"
          :isSubmit="isSubmit"
          @updateList="getTableData"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { Empty, Space } from 'ant-design-vue'
import {
  taskDetailList,
  diagnosisCareQuestionnaireDetail,
  diagnosisCareResultDetail,
  taskSelectList
} from '@/api/healthManage'
import moment from 'moment'
import QuestionnaireDetail from '../../components/questionnaireDetail/index.vue'
const columns = [
  {
    title: '患者信息',
    dataIndex: 'contactData',
    key: 'contactData',
    scopedSlots: { customRender: 'contactData' },
    with: 400
  },
  {
    title: '任务内容',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '任务状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '任务计划日期',
    sorter: true,
    dataIndex: 'startTime',
    align: 'center',
    sorterKey: 'startTime',
    scopedSlots: { customRender: 'startTime' }
  },
  {
    title: '任务完成日期',
    sorter: true,
    dataIndex: 'doneAt',
    align: 'center',
    sorterKey: 'doneAt',
    scopedSlots: { customRender: 'doneAt' }
  },
  {
    title: '操作',
    key: 'planId',
    dataIndex: 'planId',
    align: 'center',
    width: 270,
    scopedSlots: { customRender: 'planId' }
  }
]
export default {
  components: {
    Empty,
    QuestionnaireDetail,
    Space,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  // eslint-disable-next-line
  props: ['planId'],
  data () {
    return {
      form: this.$form.createForm(this),
      columns,
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      sorter: {},
      searchObj: {},
      visible: false,
      isSubmit: false, // 是否显示提交
      currentObj: {}, // 答卷所需当前任务信息
      detailObj: {}, // 问卷信息
      radioVal: '1',
      taskArr: []
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
      this.pagination.current = 1
      this.getTableData()
      this.getTaskList()
    },
    /**
     * 拉取列表
     */
    getTableData () {
      // contactTagIds//分组id集合
      // contactName//姓名
      // mobile//手机号
      // planId//计划id
      this.loading = true
      this.visible = false
      const { order, column } = this.sorter
      console.log(this.sorter)
      let orderBy
      if (order === 'ascend') {
        orderBy = `${column.sorterKey} asc`
      } else if (order === 'descend') {
        orderBy = `${column.sorterKey} desc`
      }
      const params = {
        page: this.pagination.current,
        size: this.pagination.pageSize,
        sort: orderBy
        // sorts:orderBy
      }
      console.log(params, 'params')
      taskDetailList(
        {
          planId: this.planId,
          type: this.radioVal,
          ...this.searchObj
        },
        params
      ).then((res) => {
        this.loading = false
        this.tableData = res.data.data.records
        this.pagination.total = res.data.data.total
      })
    },
    /**
     * 查询
     */
    handleSubmit (e) {
      e.preventDefault()
      this.pagination.current = 1
      this.form.validateFields((err, values) => {
        if (!err) {
          const arr = []
          if (values.formIds) {
            values.formIds.forEach((element) => {
              arr.push(element.key)
            })
          }
          this.searchObj = {
            ...values,
            formIds: arr
          }
          this.getTableData()
        }
      })
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.sorter = sorter
      console.log(this.sorter)
      this.getTableData()
    },
    /**
     * 详情
     */
    toDetail (row) {
      const {
        contactData: { id }
      } = row
      this.$router.push(`/healthManage/patientDetails?contactId=${id}`)
    },
    /**
     * 重置
     */
    handleReset () {
      this.searchObj = {}
      this.pagination.current = 1
      this.form.resetFields()
      this.getTableData()
    },
    timeFormat (e) {
      if (!e) return ''
      return moment(e).format('YYYY-MM-DD')
    },
    /**
     * 打开健康档案弹窗
     */
    openArchives () {
      this.$refs.archives.open()
    },
    /**
     * 点击问卷查询详情
     */
    async getQuestionResults (item, state) {
      this.currentObj = item
      this.visible = true
      this.isSubmit = state
      let data
      try {
        if (item.status == 2) {
          data = await diagnosisCareResultDetail({ id: item.taskDetailId })
        } else {
          data = await diagnosisCareQuestionnaireDetail({ id: item.formId })
        }
        this.detailObj = data.data
      } catch (error) {
        console.log(error)
      }
    },
    // 查询分组列表
    async getTaskList () {
      const { data } = await taskSelectList({
        planId: this.planId,
        type: this.radioVal
      })
      this.taskArr = data
    },
    // 全选
    selectState (type) {
      const arr = []
      if (type == 1) {
        this.taskArr.forEach((element) => {
          arr.push({
            key: element.formId,
            label: element.name
          })
        })
      }
      this.form.setFieldsValue({
        formIds: arr
      })
    }
  }
}
</script>
<style lang="less">
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 330px;
  margin-top: 20px;
}

.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}

.ant-list-item-meta {
  padding: 6px 0;
}
</style>
