<template>
  <div>
    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="课程名称">
          <a-input v-model="screenData.name" placeholder="请输入课程名称" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item
          label="课程分类">
          <a-cascader
            change-on-select
            v-if="!classTreeLoading"
            v-model="screenData.courseClassId"
            :options="classTree"
            placeholder="请选择课程分类"
          />
          <a-spin v-else />
        </a-form-item>

        <a-form-item
          label="创建时间">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item
          label="创建人">
          <div style="width: 200px">
            <SelectEmployee v-model="screenData.employeeId" placeholder="请选择创建人" />
          </div>
        </a-form-item>

        <a-form-item
          label="关联考试">
          <a-select
            :options="[{value:'all',label:'全部'},{value:'true',label:'是'},{value:'false',label:'否'}]"
            v-model="screenData.haveExam"
            style="width: 200px"
            placeholder="请选择关联考试"
          ></a-select>
        </a-form-item>

        <a-form-item>
          <div>
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
      <div class="btn">
        <SelectCourse v-permission="'createCourseTask'" @success="success" />
      </div>
      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :scroll="{ x: 'max-content'}"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.courseTaskId"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="name" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img
                  height="50"
                  :src="(record.courseResult && record.courseResult.coverImageUrl)+'?x-oss-process=image/resize,m_fill,h_50,w_100'"
                >
              </div>
              <div class="nickname">
                <a-tooltip overlayClassName="myTooltip">
                  <template slot="title">
                    {{ record.courseResult && record.courseResult.name }}
                  </template>
                  {{ record.courseResult && record.courseResult.name }}
                </a-tooltip>
              </div>
            </div>
          </div>
          <div slot="note" slot-scope="text,record">
            <div class="introduction">
              <a-tooltip overlayClassName="myTooltip">
                <template slot="title">
                  <div class="ql-editor" v-html="record.courseResult && record.courseResult.note"></div>
                </template>
                <div>
                  {{ record.courseResult && record.courseResult.note && record.courseResult.note.replace(/<.*?>/g, '')
                  }}
                </div>
              </a-tooltip>
            </div>
          </div>
          <div slot="tag" slot-scope="text,row">
            <template>
              <a-popover title="试用员工" v-if="row.applicableObject === 2">
                <template slot="content">
                  <div class="myLabelBox">
                    <a-tag v-for="(item, index) in row.bindEmpList" :key="index">{{ item.name }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <a-tag type="button" v-else>
                全部员工
              </a-tag>
            </template>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button
                  class="warnButton"
                  @click="() => $router.push(`/study/lesson/detail?courseTaskId=${record.courseTaskId}&courseId=${record.courseId}&type=task`)"
                >
                  详情
                </a-button>
                <a-button class="delButton" @click="deleteAttribute(record.courseTaskId)">删除</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>

import SelectCourse from './components/SelectCourse'
import { courseTaskDelete, courseTaskExcelExport, courseTaskList } from '@/api/study/task'
import moment from 'moment'
import { message } from 'ant-design-vue'
import { courseClassTreeView } from '@/api/study/lessonClass'
import SelectEmployee from '../../../components/SelectEmployee/index'
import { courseExcelExport } from '@/api/study/course'
import { excelExport } from '@/utils/downloadUtil'

export default {
  components: { SelectCourse, SelectEmployee },
  data () {
    return {
      loading: false,
      imgUrl: '',
      imgName: '',
      excelLoading: false,
      uploadVisible: false,
      fileName: String,
      visible: false,
      screenData: {},
      classTreeLoading: false,
      classTree: [],
      columns: [
        {
          title: '课程名称',
          fixed: 'left',
          dataIndex: 'name',
          width: '200px',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '课程简介',
          dataIndex: 'note',
          width: '200px',
          scopedSlots: { customRender: 'note' },
          align: 'center'
        },
        {
          title: '课程分类',
          dataIndex: 'class',
          width: '150px',
          align: 'center',
          customRender (value, record) {
            return record.courseResult && record.courseResult.courseClassResult && record.courseResult.courseClassResult.name
          }
        },
        {
          title: '考核员工',
          width: '150px',
          dataIndex: 'tag',
          align: 'center',
          scopedSlots: { customRender: 'tag' }
        },
        {
          title: '考核总人数',
          dataIndex: 'allCount',
          width: '150px',
          align: 'center',
          sorter: true
        },
        {
          title: '完成人数',
          width: '150px',
          dataIndex: 'doneCount',
          align: 'center',
          sorter: true
        },
        {
          title: '参与人数',
          width: '150px',
          dataIndex: 'participantsCount',
          align: 'center',
          sorter: true
        },
        {
          title: '参与率',
          width: '150px',
          dataIndex: 'rate',
          align: 'center',
          sorter: true,
          customRender (value) {
            return value + '%'
          }
        },
        {
          title: '课件数',
          width: '150px',
          dataIndex: 'courseWareBindResults',
          align: 'center',
          customRender (value, record) {
            return record.courseResult && record.courseResult.courseWareBindResults && record.courseResult.courseWareBindResults.length
          }
        },
        {
          title: '关联考试',
          width: '150px',
          dataIndex: '5',
          align: 'center',
          customRender (value, record) {
            return (record.courseResult && record.courseResult.examResults && record.courseResult.examResults[0]) ? '是' : '否'
          }
        },
        {
          title: '创建人',
          width: '150px',
          dataIndex: 'employeeEntity',
          align: 'center',
          customRender (value) {
            return value && value.name
          }
        },
        {
          title: '创建时间',
          width: '200px',
          align: 'center',
          sorter: true,
          dataIndex: 'createdAt',
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          }
        },
        {
          title: '操作',
          width: 150,
          fixed: 'right',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      checkIds: [],
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
    this.getTreeData()
  },
  methods: {
    async excel () {
      this.excelLoading = true
      const time = this.screenData.time || []
      const data = {
        ...this.screenData,
        startTime: time[0] ? moment(time[0]).format('YYYY/MM/DD 00:00:00') : null,
        endTime: time[1] ? moment(time[1]).format('YYYY/MM/DD 23:59:59') : null,
        haveExam: this.screenData.haveExam === 'all' ? null : this.screenData.haveExam,
        courseClassId: Array.isArray(this.screenData.courseClassId) && this.screenData.courseClassId.length > 0 ? this.screenData.courseClassId[this.screenData.courseClassId.length - 1] : null
      }
      courseTaskExcelExport(data, {
        limit: 6500,
        page: 1
      }).then((res) => {
        excelExport(res, '课程任务列表数据导出.xlsx')
        message.success('导出成功!')
      }).finally(() => {
        this.excelLoading = false
      })
    },
    getTreeData () {
      this.classTreeLoading = true
      courseClassTreeView().then((res) => {
        this.classTree = res.data
      }).finally(() => {
        this.classTreeLoading = false
      })
    },
    deleteAttribute (id) {
      const thisData = this
      this.$confirm({
        title: '删除数据后不可恢复，是否确认删除?',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        centered: true,
        onOk () {
          return courseTaskDelete({ courseTaskId: id }).then(() => {
            message.success('删除成功！')
            thisData.getTableData()
          })
        },
        onCancel () {

        }
      })
    },
    success () {
      this.sorter = {}
      this.pagination.current = 1
      this.getTableData()
    },
    getTableData () {
      this.loading = true
      const time = this.screenData.time || []
      const data = {
        ...this.screenData,
        startTime: time[0] ? moment(time[0]).format('YYYY/MM/DD 00:00:00') : null,
        endTime: time[1] ? moment(time[1]).format('YYYY/MM/DD 23:59:59') : null,
        haveExam: this.screenData.haveExam === 'all' ? null : this.screenData.haveExam,
        courseClassId: Array.isArray(this.screenData.courseClassId) && this.screenData.courseClassId.length > 0 ? this.screenData.courseClassId[this.screenData.courseClassId.length - 1] : null
      }
      courseTaskList(data, {
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        sorter: {
          field: this.sorter.field,
          order: this.sorter.order
        }
      }).then(res => {
        this.tableData = res.data.map((item, index) => ({ ...item, key: index }))
        this.pagination.total = res.count
      }).finally(() => {
        this.loading = false
      })
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

.modal {
  /deep/ .ant-modal-footer {
    text-align: center;
  }
}

.my-table-search {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.table-wrapper {

  .news {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
    }

    .weixin {
      color: #86CE76
    }
  }
}

.user-info {

  img {
    border-radius: 2px;
  }

  .nickname {
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
  }
}

.introduction {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
