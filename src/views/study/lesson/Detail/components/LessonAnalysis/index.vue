<template>
  <div class="lessonAnalysis">
    <a-spin :spinning="detailLoading">
      <div class="head">
        <div class="headImg">
          <img
            v-if="!detailLoading"
            height="220"
            :src="detail.coverImageUrl+'?x-oss-process=image/resize,m_fill,h_220,w_300'"
          >
          <div class="info">
            <span>共{{ Array.isArray(detail.courseWareBindResults) ? detail.courseWareBindResults.length : 0 }}个课件</span>
            <span style="float: right">{{ detail.time }}</span>
          </div>
        </div>
        <div class="column">
          <div class="title">{{ detail.name }}</div>
          <div class="space">
            <div>分类：{{ detail.courseClassResult && detail.courseClassResult.name }}</div>
            <div>创建时间：{{ moment(detail.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div v-if="task">
              限定时长：
              {{
                detail.haveTimeLimit === 1 ? '不限制时长' : (moment(detail.startTime).format('YYYY-MM-DD') + ' - ' + (moment(detail.endTime).format('YYYY-MM-DD')))
              }}
            </div>
          </div>
          <div class="count" v-if="detail.bindExam">
            <div>
              <div class="number"><span class="num">{{ detail.doneLearningStatusCount || 0 }}</span>人</div>
              已学完
            </div>
            <div>
              <div class="number"><span class="num">{{ detail.nolearningStatusCount || 0 }}</span>人</div>
              未学完
            </div>
            <div>
              <div class="number"><span class="num">{{ detail.learningStatusCount || 0 }}</span>人</div>
              进行中
            </div>
            <div>
              <div class="number"><span class="num">{{ detail.examCount || 0 }}</span>人</div>
              已考试
            </div>
            <div>
              <div class="number"><span class="num">{{ detail.passCount || 0 }}</span>人</div>
              已通过
            </div>
            <div>
              <div class="number"><span class="num">{{ detail.noPassCount || 0 }}</span>人</div>
              未通过
            </div>
            <div v-if="task">
              <div class="number"><span class="num">{{ detail.doneRate || 0 }}%</span></div>
              完成率
            </div>
            <div v-if="task">
              <div class="number"><span class="num">{{ detail.rate || 0 }}%</span></div>
              参与率
            </div>
          </div>
          <div class="note">
            <div>
              {{
                detail.note && detail.note.replace(/<.*?>/g, '').slice(0, 200)
              }}
              {{ (detail.note && detail.note.replace(/<.*?>/g, '').length > 200) ? '...' : '' }}
            </div>
          </div>
        </div>
      </div>
    </a-spin>

    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="员工姓名：">
          <div style="width: 200px">
            <SelectEmployee v-model="screenData.userName" placeholder="请输入员工" />
          </div>
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
            :options="[{value:0,label:'全部'},{value:1,label:'是'},{value:2,label:'否'}]"
            v-model="screenData.examStatus"
            style="width: 200px"
            placeholder="请选择考试状态"
          ></a-select>
        </a-form-item>

        <a-form-item
          label="考试结果：">
          <a-select
            :options="[{value:0,label:'全部'},{value:1,label:'通过'},{value:2,label:'未通过'},{value:3,label:'未考试'}]"
            v-model="screenData.examIsPass"
            style="width: 200px"
            placeholder="请选择考试结果"
          ></a-select>
        </a-form-item>

        <a-form-item
          label="学习状态：">
          <a-select
            :options="[{value:0,label:'全部'},{value:1,label:'已学习'},{value:2,label:'未学习'},{value:3,label:'学习中'}]"
            v-model="screenData.learningStatus"
            style="width: 200px"
            placeholder="请选择学习状态"
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
          @change="handleTableChange"
        />
      </a-spin>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import {
  courseDetail,
  courseEmployeeBindExcelExport,
  courseEmployeeBindList, courseTaskBindExcelExport,
  courseTaskBindList
} from '@/api/study/course'
import router from '@/router'
import { getTimeDifference } from '@/utils/util'
import { courseTaskDetail } from '@/api/study/task'
import SelectEmployee from '../../../../components/SelectEmployee/index'
import { excelExport } from '@/utils/downloadUtil'
import { message } from 'ant-design-vue'

export default {
  components: { SelectEmployee },
  props: {
    task: Boolean
  },
  data () {
    return {
      moment,
      loading: false,
      excelLoading: false,
      detail: {},
      detailLoading: false,
      screenData: {},
      columns: [
        {
          title: '姓名',
          dataIndex: '1',
          align: 'center',
          width: '200px',
          customRender (value, record) {
            return (record.employeeEntity && record.employeeEntity.name) || '-'
          }
        },
        {
          title: '所属机构',
          width: '200px',
          dataIndex: '2',
          align: 'center',
          customRender (value, record) {
            return (record.employeeEntity && record.employeeEntity.masterDepartmentName) || '-'
          }
        },
        {
          title: '所属门店',
          dataIndex: '3',
          align: 'center',
          customRender (value, record) {
            return (record.employeeEntity && record.employeeEntity.department && record.employeeEntity.department.departmentName) || '-'
          }
        },
        {
          title: '学习状态',
          dataIndex: '4',
          align: 'center',
          customRender (value, record) {
            switch (record.learningStatusResult && record.learningStatusResult.status) {
              case 1:
                return '学习中'
              case 2:
                return '已学习'
              default:
                return '未学习'
            }
          }
        },
        {
          title: '学习进度',
          dataIndex: 'rate',
          align: 'center',
          sorter: true,
          customRender (value) {
            return (value || 0) + '%'
          }
        },
        {
          title: '累计学习时长',
          dataIndex: 'learningTime',
          align: 'center',
          sorter: true,
          customRender (value) {
            return value ? getTimeDifference(value) : '-'
          }
        },
        {
          title: '上次学习',
          dataIndex: 'lastLearningTime',
          align: 'center',
          sorter: true,
          customRender (value) {
            return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        },
        {
          title: '完成时间',
          dataIndex: 'doneTime',
          align: 'center',
          sorter: true,
          customRender (value) {
            return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        },
        {
          title: '考试状态',
          dataIndex: 'score',
          align: 'center',
          customRender (value) {
            return typeof value === 'number' ? '是' : '否'
          }
        },
        {
          title: '考试结果',
          dataIndex: 'courseExamStatus',
          align: 'center',
          customRender (value) {
            return value !== 0 ? '通过' : '未通过'
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
    this.getTableData()
    this.getCourseDetail()
  },
  methods: {
    async excel () {
      this.excelLoading = true
      const data = {
        ...this.screenData,
        deptIds: (Array.isArray(this.screenData.deptIds) && this.screenData.deptIds.length > 0) ? this.screenData.deptIds.map(item => item.value) : null,
        storeIds: (Array.isArray(this.screenData.storeIds) && this.screenData.storeIds.length > 0) ? this.screenData.storeIds.map(item => item.value) : null
      }
      if (this.task) {
        courseTaskBindExcelExport({
          ...data,
          courseTaskId: router.history.current.query.courseTaskId
        }, {
          limit: 6500,
          page: 1
        }).then((res) => {
          excelExport(res, '课程分析数据导出.xlsx')
          message.success('导出成功!')
        }).finally(() => {
          this.excelLoading = false
        })
      } else {
        courseEmployeeBindExcelExport({
          ...data,
          courseId: router.history.current.query.courseId
        }, {
          limit: 6500,
          page: 1
        }).then((res) => {
          excelExport(res, '课程分析数据导出.xlsx')
          message.success('导出成功!')
        }).finally(() => {
          this.excelLoading = false
        })
      }
    },
    async getCourseDetail () {
      this.detailLoading = true
      let detail = {}
      if (this.task) {
        const res = await courseTaskDetail({ courseTaskId: router.history.current.query.courseTaskId })
        const data = res.data || {}
        const courseResult = data.courseResult || {}
        let bindExam = false
        if (Array.isArray(courseResult.examResults) && courseResult.examResults.length > 0) {
          bindExam = true
        } else if (courseResult.courseWareBindResults && courseResult.courseWareBindResults.find(item => item.examId)) {
          bindExam = true
        }

        detail = { ...courseResult, ...data, bindExam }
      } else {
        const res = await courseDetail({ courseId: router.history.current.query.courseId })
        const courseResult = res.data || {}
        let bindExam = false
        if (Array.isArray(courseResult.examResults) && courseResult.examResults.length > 0) {
          bindExam = true
        } else if (courseResult.courseWareBindResults && courseResult.courseWareBindResults.find(item => item.examId)) {
          bindExam = true
        }
        detail = { ...courseResult, bindExam }
      }
      let hour = 0
      let minute = 0
      let second = 0
      if (Array.isArray(detail.courseWareBindResults)) {
        detail.courseWareBindResults.forEach(item => {
          hour += item.hour
          minute += item.minute
          second += item.second
        })
      }
      minute += parseInt(second / 60)
      second = parseInt(second % 60)
      hour += parseInt(minute / 60)
      minute = parseInt(minute % 60)
      this.detail = {
        ...detail,
        time: (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
      }
      this.detailLoading = false
    },
    async getTableData () {
      this.loading = true
      const data = {
        ...this.screenData,
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
      if (this.task) {
        res = await courseTaskBindList({
          ...data,
          courseTaskId: router.history.current.query.courseTaskId
        }, params)
      } else {
        res = await courseEmployeeBindList({
          ...data,
          courseId: router.history.current.query.courseId
        }, params)
      }
      if (res.code === 0) {
        this.tableData = res.data.map((item, index) => ({ ...item, key: index }))
        this.pagination.total = res.count
      }
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
      this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
.my-space {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-search {
  .ant-form-inline {
    .ant-form-item {
      margin-bottom: 24px;
    }
  }
}

.warnButton {
  color: rgba(255, 152, 0, 1);
  background-color: rgba(252, 192, 104, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.linkButton {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.delButton {
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.successButton {
  color: #01ba77;
  background-color: rgba(1, 186, 119, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.my-table-search {
  border-radius: 8px;

  .ant-form-inline .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-input,
  .ant-select-selection,
  .ant-time-picker-input {
    border-radius: 8px !important;
  }

  .ant-btn {
    margin-right: 10px;
    border-radius: 8px;
  }
}

.my-table-wrapper {
  border-radius: 8px;

  .btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 24px;

    > .ant-btn {
      margin-left: 12px;
      border-radius: 8px;
    }
  }
}

.my-table {
  background-color: #fff;

  .ant-table-pagination {
    padding: 24px;
    float: none;
    text-align: center;
  }
}

.myTooltip {
  background-color: #fff;

  .ant-tooltip-inner {
    color: #000;
    background-color: #fff;
  }

  .ant-tooltip-arrow::before {
    background-color: #fff;
  }
}

.myLabelBox {
  width: 400px;

  span {
    margin-bottom: 10px;
  }
}

.my-modal {
  .ant-modal-footer {
    padding: 24px;
    text-align: center;

    .ant-btn {
      padding: 0 24px;
      border-radius: 8px;
    }

    .ant-modal-footer button + button {
      margin-left: 24px;
    }
  }
}

.lessonAnalysis {

  .title {
    font-weight: bold;
    font-size: 24px;
  }

  .space {
    display: flex;
    gap: 24px;
  }

  .head {
    padding: 24px;
    background-color: #fff;
    display: flex;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
  }

  .note {
    border-radius: 4px;
    padding: 12px;
    color: #a4a1a4;
    font-size: 12px;
  }

  .headImg {
    display: inline-block;
    width: 300px;
    height: 220px;
    position: relative;

    img {
      max-width: 300px;
      border-radius: 2px;
    }

    .info {
      padding: 12px;
      color: #fff;
      border-top: solid 1px #fff;
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }

  .count {
    background-color: #fbfbfb;
    padding: 12px 24px;
    border-radius: 8px;
    display: flex;
    width: max-content;

    > div {
      width: 100px;
    }

    .number {
      font-weight: bold;

      .num {
        font-size: 18px;
      }
    }
  }

  .my-table-search {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
