<template>
  <div class="lessonAnalysis">
    <a-spin :spinning="detailLoading">
      <div class="head">
        <div class="headImg">
          <img
            height="220"
            :src="detail.coverImageUrl+'?x-oss-process=image/resize,m_fill,h_220,w_300'"
          >
          <div class="info">
            <span>共{{ Array.isArray(detail.courseWareBindResults) ? detail.courseWareBindResults.length : 0 }}个课件</span>
            <span style="float: right">{{ detail.time }}</span>
          </div>
        </div>
        <div class="column">
          <div class="title">标题</div>
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
          <div class="count">
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
            <div>{{ detail.note && detail.note.replace(/<.*?>/g, '') }}</div>
          </div>
        </div>
      </div>
    </a-spin>

    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="员工姓名：">
          <div style="width: 200px">
            <SelectEmployee v-model="screenData.employeeId" placeholder="请选择员工" />
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
            <a-button type="primary" @click="reset">导出</a-button>
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
import { courseDetail, courseEmployeeBindList, courseTaskBindList } from '@/api/study/course'
import router from '@/router'
import { getTimeDifference } from '@/utils/util'
import { courseTaskDetail } from '@/api/study/task'
import SelectEmployee from '../../../../components/SelectEmployee/index'

export default {
  components: { SelectEmployee },
  props: {
    task: Boolean
  },
  data () {
    return {
      moment,
      loading: false,
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
          dataIndex: 'doneStatusDetail',
          align: 'center',
          sorter: true,
          customRender (value, record) {
            const doneStatusDetail = record.doneStatusDetail || 0
            const statusDetail = record.statusDetail || 0
            const num = Math.round((doneStatusDetail / statusDetail) * 100) || 0
            return num + '%'
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
          title: '总考状态',
          dataIndex: 'haveCourseExam',
          align: 'center',
          customRender (value) {
            return value !== 0 ? '是' : '否'
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
    async getCourseDetail () {
      this.detailLoading = true
      let detail = {}
      if (this.task) {
        const res = await courseTaskDetail({ courseTaskId: router.history.current.query.courseTaskId })
        const data = res.data || {}
        detail = { ...(data.courseResult || {}), ...data }
      } else {
        const res = await courseDetail({ courseId: router.history.current.query.courseId })
        detail = res.data || {}
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
        courseId: router.history.current.query.courseId,
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
        res = await courseTaskBindList(data, params)
      } else {
        res = await courseEmployeeBindList(data, params)
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
    }
  }
}
</script>

<style lang="less" scoped>
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
