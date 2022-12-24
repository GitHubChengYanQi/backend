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
            <SelectEmployee v-model="screenData.employeeId" placeholder="请选择创建人" />
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
            <a-button type="primary" @click="reset">导出</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <div class="my-table-wrapper">
      <div class="btn" v-if="!select">
        <a-button
          type="primary"
          ghost
          @click="() => $router.push('/study/lesson/Courseware')">
          课件管理
        </a-button>
        <a-button
          type="primary"
          ghost
          @click="openLessonClass">
          课程分类
        </a-button>
        <a-button
          type="primary"
          @click="() => $router.push('/study/lesson/create')">
          新建课程
        </a-button>
      </div>
      <a-spin :spinning="loading">
        <a-table
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
                <img height="50" :src="record.coverImageUrl">
              </div>
              <div class="nickname">
                <a-tooltip>
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
              <a-tooltip>
                <template slot="title">
                  <div class="ql-editor" v-html="text"></div>
                </template>
                <div v-html="text"></div>
              </a-tooltip>
            </div>
          </div>
          <div slot="tag" slot-scope="text,row">
            <template>
              <a-popover title="添加的标签" v-if="row.tag && row.tag.length > 0">
                <template slot="content">
                  <div class="labelBox">
                    <a-tag v-for="(item, index) in row.tag" :key="index">{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span class="nolabel" style="align-items:center;" v-else>无标签</span>
            </template>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button class="warnButton" @click="() => $router.push(`/study/lesson/detail?id=${record.courseId}`)">
                  详情
                </a-button>
                <a-button
                  class="successButton"
                  @click="() => $router.push(`/study/lesson/create?id=${record.courseId}`)"
                >
                  编辑
                </a-button>

                <a-popconfirm
                  title="是否确认删除"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deleteAttribute(record.courseId)"
                >
                  <a-button class="delButton">删除</a-button>
                </a-popconfirm>
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
import { courseDelete, courseList } from '@/api/study/course'
import moment from 'moment'
import { courseClassTreeView } from '@/api/study/lessonClass'
import { message } from 'ant-design-vue'

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
            return value && value.name || '-'
          }
        },
        {
          title: '试用员工',
          dataIndex: 'tag',
          scopedSlots: { customRender: 'tag' },
          align: 'center'
        },
        {
          title: '试用总人数',
          dataIndex: 'total',
          align: 'center',
          sorter: true
        },
        {
          title: '完成人数',
          dataIndex: 'employeeName',
          align: 'center',
          sorter: true
        },
        {
          title: '参与人数',
          dataIndex: 'createTime',
          align: 'center',
          sorter: true
        },
        {
          title: '课件数',
          align: 'center'
        },
        {
          title: '关联考试',
          align: 'center',
          dataIndex: 'examResults',
          customRender: (examResults) => {
            return examResults && examResults.length > 0 ? '是' : '否'
          }
        },
        {
          title: '创建人',
          align: 'center'
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
          title: '操作',
          width: 200,
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      },
      classTreeLoading: false,
      classTree: []
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
          align: 'center',
          width: '200px'
        },
        {
          title: '课程分类',
          dataIndex: 'courseClassResult',
          align: 'center',
          customRender (value) {
            return value && value.name || '-'
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
          align: 'center'
        }
      ]
    }
  },
  methods: {
    onChangeRows (rows) {
      this.selectedRowKeys = rows.map(item => item[this.rowKey])
      this.checkedRows = rows
      this.$emit('selectRows', rows)
    },
    getTreeData () {
      this.classTreeLoading = true
      courseClassTreeView().then((res) => {
        this.classTree = res.data
      }).finally(() => {
        this.classTreeLoading = false
      })
    },
    openLessonClass () {
      this.lessonClassVisible = true
    },
    deleteAttribute (id) {
      courseDelete({ courseId: id }).then(() => {
        message.success('删除成功！')
        this.getTableData()
      })
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
      courseList(data, {
        limit: this.pagination.pageSize,
        page: this.pagination.current
      }).then(res => {
        this.tableData = res.data
        this.pagination.total = res.count
      }).finally(() => {
        this.loading = false
      })
    },
    handleTableChange ({ current, pageSize }) {
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
  text-align: center;
  justify-content: center;

  img {
    max-height: 33px;
    max-width: 33px;
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
