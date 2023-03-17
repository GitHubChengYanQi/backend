<template>
  <div>
    <breadcrumb v-if="!select" :titles="['课程管理']"></breadcrumb>
    <a-card :bordered="false" class="my-table-search" :body-style="{padding:select ? 0 : 24}">
      <a-form layout="inline">

        <a-form-item :label="select ? '' : '课程名称'">
          <a-input v-model="screenData.name" placeholder="请输入课程名称" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item :label="select ? '' : '课程分类'">
          <a-cascader
            change-on-select
            v-if="!classTreeLoading"
            v-model="screenData.courseClassId"
            :options="classTree"
            placeholder="请选择课程分类"
          />
          <a-spin v-else />
        </a-form-item>

        <a-form-item :label="select ? '' : '创建时间'">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item
          v-if="!select"
          :label="select ? '' : '创建人'"
        >
          <div style="width: 200px">
            <SelectEmployee v-model="screenData.userName" placeholder="请输入创建人" />
          </div>
        </a-form-item>

        <a-form-item
          v-if="!select"
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
            <a-button v-if="!select" type="primary" :loading="excelLoading" @click="excel">导出</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <div class="my-table-wrapper">
      <div class="btn" v-if="!select">
        <a-button
          v-permission="'coursewareList'"
          type="primary"
          ghost
          @click="() => $router.push('/study/lesson/Courseware')">
          课件管理
        </a-button>
        <a-button
          v-permission="'LessonClass'"
          type="primary"
          ghost
          @click="openLessonClass">
          课程分类
        </a-button>
        <a-button
          v-permission="'LessonCreate'"
          type="primary"
          @click="() => $router.push('/study/lesson/create')">
          新建课程
        </a-button>
      </div>
      <a-spin :spinning="loading">
        <a-table
          :scroll="{ x: 'max-content'}"
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.courseId"
          :pagination="pagination"
          :row-selection="!select ? null : {...rowSelection,selectedRowKeys}"
          @change="handleTableChange">
          <div slot="name" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img height="50" width="50" :src="record.coverImageUrl+'?x-oss-process=image/resize,m_fill,h_50,w_50'">
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
          <div slot="note" slot-scope="text">
            <div class="introduction">
              <div>{{ text.replace(/<.*?>/g, '') }}</div>
            </div>
          </div>
          <div slot="tag" slot-scope="text,row">
            <template>
              <a-popover title="适用员工" v-if="row.applicableObject === 2">
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
                  :disabled="record.edit === 0"
                  :class="{warnButton:true,disabledButton:record.edit === 0}"
                  @click="() => $router.push(`/study/lesson/detail?courseId=${record.courseId}`)"
                >
                  详情
                </a-button>
                <a-button
                  :disabled="record.edit === 0"
                  :class="{successButton:true,disabledButton:record.edit === 0}"
                  class=""
                  @click="() => $router.push(`/study/lesson/create?id=${record.courseId}`)"
                >
                  编辑
                </a-button>

                <a-button
                  :disabled="record.edit === 0"
                  :class="{delButton:true,disabledButton:record.edit === 0}"
                  @click="deleteAttribute(record.courseId)"
                >
                  删除
                </a-button>
              </div>
            </template>
          </div>
        </a-table>
      </a-spin>
    </div>
    <a-modal
      centered
      destroyOnClose
      v-model="lessonClassVisible"
      title="课程分类"
      :footer="null"
    >
      <div>
        <lessonClass></lessonClass>
      </div>
    </a-modal>
  </div>
</template>

<script>
import TagName from '@/views/workContactNew/components/tagName'
import breadcrumb from '../components/Breadcrumd/index'
import SelectEmployee from '../components/SelectEmployee/index'
import lessonClass from './components/LessonClass'
import { courseDelete, courseExcelExport, courseList } from '@/api/study/course'
import moment from 'moment'
import { courseClassTreeView } from '@/api/study/lessonClass'
import { message } from 'ant-design-vue'
import { excelExport } from '@/utils/downloadUtil'

export default {
  props: {
    rows: {
      type: Array,
      default: _ => []
    },
    select: Boolean
  },
  components: { TagName, breadcrumb, lessonClass, SelectEmployee },
  data () {
    return {
      rowKey: 'courseId',
      selectedRowKeys: [],
      checkedRows: [],
      rowSelection: {
        onSelect: (record, selected) => {
          if (selected) {
            this.onChangeRows([...this.checkedRows, record])
          } else {
            this.onChangeRows(this.checkedRows.filter(item => item[this.rowKey] !== record[this.rowKey]))
          }
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          if (selected) {
            this.onChangeRows([...this.checkedRows, ...changeRows])
          } else {
            const deleteIds = changeRows.map((item) => {
              return item[this.rowKey]
            })
            this.onChangeRows(this.checkedRows.filter(item => !deleteIds.some(deleKey => item[this.rowKey] === deleKey)))
          }
        }
      },
      loading: false,
      lessonClassVisible: false,
      screenData: {},
      columns: [
        {
          fixed: 'left',
          title: '课程名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center',
          width: '200px'
        },
        {
          title: '课程简介',
          width: '200px',
          dataIndex: 'note',
          scopedSlots: { customRender: 'note' },
          align: 'center'
        },
        {
          title: '课程分类',
          dataIndex: 'courseClassResult',
          align: 'center',
          customRender (value) {
            if (!value) {
              return ''
            }
            return (value.parent ? `${value.parent.name}/` : '') + value.name
          }
        },
        {
          title: '适用员工',
          dataIndex: 'tag',
          scopedSlots: { customRender: 'tag' },
          align: 'center'
        },
        {
          title: '适用总人数',
          dataIndex: 'allCount',
          align: 'center'
        },
        {
          title: '完成人数',
          dataIndex: 'doneNumber',
          align: 'center',
          sorter: true
        },
        {
          title: '参与人数',
          dataIndex: 'participantsCount',
          align: 'center',
          sorter: true
        },
        {
          title: '课件数',
          dataIndex: 'courseWareBindResults',
          align: 'center',
          customRender (value) {
            return value && value.length
          }
        },
        {
          title: '关联考试',
          align: 'center',
          dataIndex: 'examResults',
          customRender: (examResults, record) => {
            const isExam = record.courseWareBindResults && record.courseWareBindResults.find(item => item.examId)
            return (isExam || (examResults && examResults.length > 0)) ? '是' : '否'
          }
        },
        {
          title: '创建人',
          dataIndex: 'employeeEntity',
          align: 'center',
          customRender: (text) => {
            return text && text.name
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          },
          align: 'center',
          sorter: true
        },
        {
          fixed: 'right',
          title: '操作',
          width: 200,
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
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
      },
      classTreeLoading: false,
      classTree: [],
      excelLoading: false
    }
  },
  created () {
    this.checkedRows = this.rows
    this.selectedRowKeys = this.rows.map(item => item[this.rowKey])
    this.getTableData()
    this.getTreeData()
    if (this.select) {
      this.columns = [
        {
          title: '课程名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: '200px'
        },
        {
          title: '课程分类',
          dataIndex: 'courseClassResult',
          align: 'center',
          customRender (value) {
            if (!value) {
              return ''
            }
            return (value.parent ? `${value.parent.name}/` : '') + value.name
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          },
          align: 'center',
          sorter: true
        },
        {
          title: '创建人',
          dataIndex: 'employeeEntity',
          align: 'center',
          customRender: (text) => {
            return text && text.name
          }
        }
      ]
    }
  },
  methods: {
    async excel () {
      this.excelLoading = true
      const time = this.screenData.time || []
      const isUserId = this.screenData.userName && this.screenData.userName.indexOf('id:') !== -1
      const data = {
        ...this.screenData,
        employeeId: isUserId ? this.screenData.userName.split('id:')[1] : null,
        userName: isUserId ? null : this.screenData.userName,
        startTime: time[0] ? moment(time[0]).format('YYYY/MM/DD 00:00:00') : null,
        endTime: time[1] ? moment(time[1]).format('YYYY/MM/DD 23:59:59') : null,
        haveExam: this.screenData.haveExam === 'all' ? null : this.screenData.haveExam,
        courseClassId: Array.isArray(this.screenData.courseClassId) && this.screenData.courseClassId.length > 0 ? this.screenData.courseClassId[this.screenData.courseClassId.length - 1] : null
      }
      courseExcelExport(data, {
        limit: 6500,
        page: 1,
        sorter: {
          field: this.sorter.field,
          order: this.sorter.order
        }
      }).then((res) => {
        excelExport(res, '课程列表数据导出.xlsx')
        message.success('导出成功!')
      }).finally(() => {
        this.excelLoading = false
      })
    },
    onChangeRows (rows) {
      this.selectedRowKeys = rows.map(item => item[this.rowKey])
      this.checkedRows = rows
      this.$emit('selectRows', rows)
    },
    getTreeData () {
      this.classTreeLoading = true
      courseClassTreeView().then((res) => {
        this.classTree = res.data.map(item => {
          return {
            ...item,
            children: (Array.isArray(item.children) && item.children.length > 0) ? item.children.map(item => ({
              ...item,
              children: null
            })) : null
          }
        })
      }).finally(() => {
        this.classTreeLoading = false
      })
    },
    openLessonClass () {
      this.lessonClassVisible = true
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
          return courseDelete({ courseId: id }).then(() => {
            message.success('删除成功！')
            thisData.getTableData()
          })
        },
        onCancel () {

        }
      })
    },
    getTableData () {
      this.loading = true
      const time = this.screenData.time || []
      const isUserId = this.screenData.userName && this.screenData.userName.indexOf('id:') !== -1
      const data = {
        ...this.screenData,
        employeeId: isUserId ? this.screenData.userName.split('id:')[1] : null,
        userName: isUserId ? null : this.screenData.userName,
        startTime: time[0] ? moment(time[0]).format('YYYY/MM/DD 00:00:00') : null,
        endTime: time[1] ? moment(time[1]).format('YYYY/MM/DD 23:59:59') : null,
        haveExam: this.screenData.haveExam === 'all' ? null : this.screenData.haveExam,
        courseClassId: Array.isArray(this.screenData.courseClassId) && this.screenData.courseClassId.length > 0 ? this.screenData.courseClassId[this.screenData.courseClassId.length - 1] : null
      }
      courseList(data, {
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        sorter: {
          field: this.sorter.field,
          order: this.sorter.order
        }
      }).then(res => {
        this.tableData = res.data
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

.disabledButton {
  color: rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
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
  max-height: 20vh;
  overflow: auto;

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

.my-table-wrapper {
  border-radius: 8px;

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
  min-height: 50px;

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
