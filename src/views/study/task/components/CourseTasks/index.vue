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
        <SelectCourse />
      </div>
      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.courseTaskId"
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
                  <div class="ql-editor" v-html="record.courseResult && record.courseResult.note"></div>
                </template>
                <div class="ql-editor" v-html="record.courseResult && record.courseResult.note"></div>
              </a-tooltip>
            </div>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button class="warnButton">详情</a-button>
                <a-popconfirm
                  disabled
                  title="是否确认删除"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deleteAttribute(record.id)"
                >
                  <a-button class="delButton" @click="$message.warning('课件已被xxx，xxx课程引用，不可删除');">删除</a-button>
                </a-popconfirm>
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
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '课程简介',
          dataIndex: 'note',
          scopedSlots: { customRender: 'note' },
          align: 'center'
        },
        {
          title: '课程分类',
          dataIndex: 'class',
          align: 'center',
          customRender (value, record) {
            return record.courseResult && record.courseResult.courseClassResult && record.courseResult.courseClassResult.name
          }
        },
        {
          title: '考核员工',
          dataIndex: 'tag',
          align: 'center'
        },
        {
          title: '考核总人数',
          dataIndex: 'allEmp',
          align: 'center',
          sorter: true
        },
        {
          title: '完成人数',
          dataIndex: '1',
          align: 'center',
          sorter: true
        },
        {
          title: '参与人数',
          dataIndex: '2',
          align: 'center',
          sorter: true
        },
        {
          title: '参与率',
          dataIndex: '3',
          align: 'center',
          sorter: true
        },
        {
          title: '课件数',
          dataIndex: 'courseWareBindResults',
          align: 'center',
          customRender (value, record) {
            return record.courseResult && record.courseResult.courseWareBindResults && record.courseResult.courseWareBindResults.length
          }
        },
        {
          title: '关联考试',
          dataIndex: '5',
          align: 'center',
          customRender (value, record) {
            return record.courseResult && record.courseResult.examResults && record.courseResult.examResults[0] && record.courseResult.examResults[0].name
          }
        },
        {
          title: '创建人',
          dataIndex: '6',
          align: 'center'
        },
        {
          title: '创建时间',
          align: 'center',
          sorter: true,
          dataIndex: 'createdAt',
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          }
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
      checkIds: [],
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
    },
    getTableData () {
      this.loading = true
      const data = {}
      courseTaskList(data, {
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
</style>
