<template>
  <div>

    <breadcrumb v-if="!task" :titles="['课程管理','课程详情','考试详情']" back></breadcrumb>

    <div class="head" :style="this.task ? {borderTopLeftRadius:0,borderTopRightRadius:0} : {}">
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">{{ examCount }}</div>
          考试人数
        </div>
      </div>
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">{{ passExamCount }}</div>
          通过人数
        </div>
      </div>
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">{{ noPassExamCount }}</div>
          未通过人数
        </div>
      </div>
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">{{ inExamCount }}</div>
          考试中人数
        </div>
      </div>
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">{{ passingRate }}</div>
          通过率
        </div>
      </div>
    </div>

    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="员工姓名：">
          <SelectEmployee v-model="screenData.employeeId" placeholder="请选择员工" />
        </a-form-item>

        <a-form-item
          label="所属机构：">
          <div style="width: 200px">
            <SelectDepartment :treeCheckStrictly="true" v-model="screenData.deptIds" />
          </div>
        </a-form-item>

        <a-form-item
          label="所属门店：">
          <div style="width: 200px">
            <SelectDepartment :treeCheckStrictly="true" v-model="screenData.storeIds" />
          </div>
        </a-form-item>

        <a-form-item
          label="考试状态：">
          <a-select
            :options="[{value:'all',label:'全部'},{value:1,label:'是'},{value:2,label:'否'}]"
            v-model="screenData.examStatus"
            style="width: 200px"
            placeholder="请选择考试状态"
          ></a-select>
        </a-form-item>

        <a-form-item
          label="考试结果：">
          <a-select
            :options="[{value:'all',label:'全部'},{value:1,label:'通过'},{value:2,label:'未通过'},{value:3,label:'未考试'}]"
            v-model="screenData.examIsPass"
            style="width: 200px"
            placeholder="请选择考试结果"
          ></a-select>
        </a-form-item>

        <a-form-item>
          <div class="my-space">
            <a-button @click="reset">重置</a-button>
            <a-button
              type="primary"
              ghost
              @click="() => { this.pagination.current = 1; this.getTableData() }"
            >
              查询
            </a-button>
            <a-button type="primary" :loading="excelLoading" @click="excel">导出</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>

    <div class="my-table-wrapper">
      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.key"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="name" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <a-icon type="file-word" style="font-size: 24px" />
              </div>
              <div class="nickname">
                <a-tooltip overlayClassName="myTooltip">
                  <template slot="title">
                    {{ record.name }}
                  </template>
                  {{ record.name }}
                </a-tooltip>
              </div>
            </div>
          </div>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../../../../../components/Breadcrumd/index'
import router from '@/router'
import {
  courseExamBindExamBindPageExcelExport,
  courseExamBindExamBindPageList,
  courseExcelExport,
  examTaskBindList
} from '@/api/study/course'
import moment from 'moment'
import SelectEmployee from '../../../../../components/SelectEmployee/index'
import { excelExport } from '@/utils/downloadUtil'
import { message } from 'ant-design-vue'

export default {
  props: {
    task: Boolean
  },
  components: { breadcrumb, SelectEmployee },
  data () {
    return {
      examCount: 0,
      passExamCount: 0,
      noPassExamCount: 0,
      passingRate: 0,
      inExamCount: 0,
      loading: false,
      screenData: {},
      excelLoading: false,
      columns: [
        {
          title: '姓名',
          dataIndex: '1',
          align: 'center',
          width: '200px',
          customRender (value, record) {
            return record.employeeEntity && record.employeeEntity.name || '-'
          }
        },
        {
          title: '所属机构',
          width: '200px',
          dataIndex: '2',
          align: 'center',
          customRender (value, record) {
            return record.employeeEntity && record.employeeEntity.masterDepartmentName || '-'
          }
        },
        {
          title: '所属门店',
          dataIndex: '3',
          align: 'center',
          customRender (value, record) {
            return record.employeeEntity && record.employeeEntity.department && record.employeeEntity.department.departmentName || '-'
          }
        },
        {
          title: '考试状态',
          dataIndex: '4',
          align: 'center',
          customRender (value, record) {
            return record.examCount > 0 ? '是' : '否'
          }
        },
        {
          title: '考试分数',
          dataIndex: 'score',
          align: 'center',
          sorter: true,
          customRender (value, record) {
            return record.examCount > 0 ? value : '-'
          }
        },
        {
          title: '考试结果',
          dataIndex: 'status',
          align: 'center',
          customRender (value, record) {
            return record.examCount > 0 ? (value === 1 ? '通过' : '未通过') : '-'
          }
        },
        {
          title: '考试次数',
          dataIndex: 'examCount',
          align: 'center',
          customRender (value, record) {
            return record.examCount > 0 ? value : '-'
          }
        },
        {
          title: '答卷时长',
          dataIndex: 'resultTime',
          align: 'center',
          sorter: true,
          customRender (value, record) {
            return record.examCount > 0 ? value : '-'
          }
        },
        {
          title: '交卷时间',
          dataIndex: 'doneAt',
          align: 'center',
          sorter: true,
          customRender (value, record) {
            return (record.examCount > 0 && value) ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        }
      ],
      tableData: [],
      sorter: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      }
    }
  },
  created () {
    this.examCount = router.history.current.query.examCount || 0
    this.passExamCount = router.history.current.query.passExamCount || 0
    this.noPassExamCount = router.history.current.query.noPassExamCount || 0
    this.passingRate = Math.round((this.passExamCount / this.examCount) * 100) || 0
    this.inExamCount = router.history.current.query.inExamCount || 0
    this.getTableData()
  },
  methods: {
    async excel () {
      this.excelLoading = true
      const data = {
        ...this.screenData,
        examStatus: this.screenData.examStatus === 'all' ? null : this.screenData.examStatus,
        examIsPass: this.screenData.examIsPass === 'all' ? null : this.screenData.examIsPass,
        deptIds: (Array.isArray(this.screenData.deptIds) && this.screenData.deptIds.length > 0) ? this.screenData.deptIds.map(item => item.value) : null,
        storeIds: (Array.isArray(this.screenData.storeIds) && this.screenData.storeIds.length > 0) ? this.screenData.storeIds.map(item => item.value) : null,
        courseId: router.history.current.query.courseId,
        examId: router.history.current.query.examId
      }
      courseExamBindExamBindPageExcelExport(data, {
        limit: 6500,
        page: 1
      }).then((res) => {
        excelExport(res, '考试详情数据导出.xlsx')
        message.success('导出成功!')
      }).finally(() => {
        this.excelLoading = false
      })
    },
    async getTableData () {
      this.loading = true
      const data = {
        ...this.screenData,
        examStatus: this.screenData.examStatus === 'all' ? null : this.screenData.examStatus,
        examIsPass: this.screenData.examIsPass === 'all' ? null : this.screenData.examIsPass,
        deptIds: (Array.isArray(this.screenData.deptIds) && this.screenData.deptIds.length > 0) ? this.screenData.deptIds.map(item => item.value) : null,
        storeIds: (Array.isArray(this.screenData.storeIds) && this.screenData.storeIds.length > 0) ? this.screenData.storeIds.map(item => item.value) : null
      }
      const params = {
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        sorter: {
          field: this.sorter.field,
          order: this.sorter.order
        }
      }
      let res = {}
      // if (this.task) {
      //   res = await examTaskBindList({
      //     ...data,
      //     examTaskId: router.history.current.query.id
      //   }, params)
      // } else {
      res = await courseExamBindExamBindPageList({
        ...data,
        courseId: router.history.current.query.courseId,
        examId: router.history.current.query.examId
      }, params)
      // }
      this.tableData = res.data.map((item, index) => ({ ...item, key: index }))
      this.pagination.total = res.count
      this.loading = false
    },
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.sorter = sorter
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    // 群聊筛选
    // 重置
    reset () {
      this.screenData = {}
    }
  }
}
</script>

<style lang="less" scoped>

.head {
  padding: 24px;
  background-color: #fff;
  display: flex;
  margin-bottom: 24px;
  gap: 24px;
  border-radius: 8px;

  .box {
    border-radius: 8px;
    flex-grow: 1;
    padding: 24px;
    background-color: #fbfbfe;
    gap: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .icon {
      font-size: 56px;
      box-shadow: 0 0 5px 0 #02020275;
    }

    .num {
      font-weight: bold;
      font-size: 32px;
    }
  }
}

.my-table-search {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
