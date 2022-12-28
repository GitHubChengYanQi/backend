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
          <a-input v-model="screenData.remark	" placeholder="请选择课程分类"></a-input>
        </a-form-item>

        <a-form-item
          label="创建时间">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item
          label="创建人">
          <a-input v-model="screenData.user" style="width: 200px" placeholder="请输入创建人名称" :maxLength="10"></a-input>
        </a-form-item>

        <a-form-item
          label="关联考试">
          <a-select
            :options="[{value:0,label:'全部'},{value:1,label:'是'},{value:2,label:'否'}]"
            v-model="screenData.gender1"
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
      <div class="btn">
        <SelectCourse v-permission="'createCourseTask'" @success="success" />
      </div>
      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :scroll="{ x: 'max-content' }"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.key"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="name" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img height="50" :src="record.courseResult && record.courseResult.coverImageUrl">
              </div>
              <div class="nickname">
                <a-tooltip>
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
              <a-tooltip>
                <template slot="title">
                  <div v-html="record.courseResult && record.courseResult.note"></div>
                </template>
                <div v-html="record.courseResult && record.courseResult.note"></div>
              </a-tooltip>
            </div>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button
                  class="warnButton"
                  @click="() => $router.push(`/study/lesson/detail?courseId=${record.courseId}&type=task`)"
                >
                  详情
                </a-button>
                <a-button class="delButton" @click="deleteAttribute(record.id)">删除</a-button>
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
import { courseTaskList } from '@/api/study/task'
import moment from 'moment'

export default {
  components: { SelectCourse },
  data () {
    return {
      loading: false,
      imgUrl: '',
      imgName: '',
      uploadVisible: false,
      fileName: String,
      visible: false,
      screenData: {
        gender: 3,
        addWay: '全部',
        fieldId: 0
      },
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
          align: 'center'
        },
        {
          title: '考核总人数',
          dataIndex: 'allEmp',
          width: '150px',
          align: 'center',
          sorter: true
        },
        {
          title: '完成人数',
          width: '150px',
          dataIndex: '1',
          align: 'center',
          sorter: true
        },
        {
          title: '参与人数',
          width: '150px',
          dataIndex: '2',
          align: 'center',
          sorter: true
        },
        {
          title: '参与率',
          width: '150px',
          dataIndex: '3',
          align: 'center',
          sorter: true
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
            return record.courseResult && record.courseResult.examResults && record.courseResult.examResults[0] && record.courseResult.examResults[0].name
          }
        },
        {
          title: '创建人',
          width: '150px',
          dataIndex: '6',
          align: 'center'
        },
        {
          title: '创建时间',
          width: '150px',
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
  },
  methods: {
    deleteAttribute (id) {
      console.log(id)
      const thisData = this
      this.$confirm({
        title: '删除数据后不可恢复，是否确认删除?',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        centered: true,
        onOk () {

        },
        onCancel () {

        }
      })
    },
    success () {
      this.getTableData()
    },
    getTableData () {
      this.loading = true
      const data = {}
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
      this.screenData = {
        gender: 3,
        addWay: '全部',
        fieldId: 0
      }
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
