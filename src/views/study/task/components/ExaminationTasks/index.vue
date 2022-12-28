<template>
  <div>
    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="课程名称">
          <a-input v-model="screenData.name" placeholder="请输入课程名称" :maxLength="20"></a-input>
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
          label="考试类别">
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
        <SelectExamination v-permission="'createExaminationTask'" @success="success" />
      </div>
      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.examTaskId"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="name" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img height="50" :src="record.examResult && record.examResult.coverImageUrl">
              </div>
              <div class="nickname">
                <a-tooltip>
                  <template slot="title">
                    {{ record.examResult && record.examResult.name }}
                  </template>
                  {{ record.examResult && record.examResult.name }}
                </a-tooltip>
              </div>
            </div>
          </div>
          <div slot="note" slot-scope="text,record">
            <div class="introduction">
              <a-tooltip>
                <template slot="title">
                  {{ record.examResult && record.examResult.questionnaireResults && record.examResult.questionnaireResults[0] && record.examResult.questionnaireResults[0].questionnaireName
                  }}
                </template>
                {{ record.examResult && record.examResult.questionnaireResults && record.examResult.questionnaireResults[0] && record.examResult.questionnaireResults[0].questionnaireName
                }}
              </a-tooltip>
            </div>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button
                  class="warnButton"
                  @click="() => $router.push(`/study/examination/detail?id=${record.examId}&type=task`)">
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

import SelectExamination from './components/SelectExamination'
import { examTaskList } from '@/api/study/task'

export default {
  components: { SelectExamination },
  data () {
    return {
      loading: false,
      screenData: {},
      columns: [
        {
          title: '考试名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '试卷名称',
          dataIndex: 'note',
          scopedSlots: { customRender: 'note' },
          align: 'center'
        },
        {
          title: '答卷时长',
          dataIndex: 'class',
          align: 'center'
        },
        {
          title: '考核员工',
          dataIndex: 'tag',
          scopedSlots: { customRender: 'tag' },
          align: 'center'
        },
        {
          title: '考试类别',
          dataIndex: 'ta1g',
          scopedSlots: { customRender: 'tag' },
          align: 'center'
        },
        {
          title: '考核总人数',
          dataIndex: 'total',
          align: 'center',
          sorter: true
        },
        {
          title: '未通过人数',
          dataIndex: '1',
          align: 'center',
          sorter: true
        },
        {
          title: '通过人数',
          dataIndex: '2',
          align: 'center',
          sorter: true
        },
        {
          title: '通过率',
          dataIndex: '3',
          align: 'center',
          sorter: true
        },
        {
          title: '参与人数',
          dataIndex: '4',
          align: 'center',
          sorter: true
        },
        {
          title: '参与率',
          dataIndex: '5',
          align: 'center',
          sorter: true
        },
        {
          title: '创建人',
          align: 'center'
        },
        {
          title: '创建时间',
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
      sorter: {},
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
      examTaskList(data, {
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
    selectChange (row) {
      this.checkIds = row
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
