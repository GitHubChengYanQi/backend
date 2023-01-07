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
          <div style="width: 200px">
            <SelectEmployee v-model="screenData.employeeId" placeholder="请选择创建人" />
          </div>
        </a-form-item>

        <a-form-item
          label="考试类别">
          <a-select
            :options="[{value:'all',label:'全部'},{value:0,label:'定向考'},{value:1,label:'章节考'},{value:2,label:'总考'}]"
            v-model="screenData.bindType"
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
        <SelectExamination v-permission="'createExaminationTask'" @success="success" />
      </div>
      <a-spin :spinning="loading">
        <a-table
          :scroll="{ x: 'max-content'}"
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.examTaskId"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="name" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img
                  height="50"
                  :src="(record.examResult && record.examResult.coverImageUrl)+'?x-oss-process=image/resize,m_fill,h_50,w_100'"
                >
              </div>
              <div class="nickname">
                <a-tooltip overlayClassName="myTooltip">
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
              <a-tooltip overlayClassName="myTooltip">
                <template slot="title">
                  {{
                    record.examResult && record.examResult.questionnaireResults && record.examResult.questionnaireResults[0] && record.examResult.questionnaireResults[0].questionnaireName
                  }}
                </template>
                {{ record.examResult && record.examResult.questionnaireResults && record.examResult.questionnaireResults[0] && record.examResult.questionnaireResults[0].questionnaireName
                }}
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
                  @click="() => $router.push(`/study/examination/detail?id=${record.examTaskId}&examId=${record.examId}&type=task&examCount=${record.examCount || 0}&passExamCount=${record.passExamCount || 0}&noPassExamCount=${record.noPassExamCount || 0}&inExamCount=${record.inExamCount || 0}`)"
                >
                  详情
                </a-button>
                <a-button class="delButton" @click="deleteAttribute(record.examTaskId)">删除</a-button>
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
import { examTaskDelete, examTaskExcelExport, examTaskList } from '@/api/study/task'
import moment from 'moment'
import { message } from 'ant-design-vue'
import SelectEmployee from '../../../components/SelectEmployee/index'
import { excelExport } from '@/utils/downloadUtil'

export default {
  components: { SelectExamination, SelectEmployee },
  data () {
    return {
      loading: false,
      excelLoading: false,
      screenData: {},
      columns: [
        {
          fixed: 'left',
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
          dataIndex: 'examResult',
          align: 'center',
          customRender (value) {
            return (value && value.timeLimit) >= 0 ? (value.timeLimit) + '分钟' : '不限定时长'
          }
        },
        {
          title: '考核员工',
          dataIndex: 'tag',
          scopedSlots: { customRender: 'tag' },
          align: 'center'
        },
        {
          title: '考试类别',
          dataIndex: 'bindType',
          align: 'center',
          customRender (value, record) {
            switch (record.examResult && record.examResult.bindType) {
              case 1:
                return '章节考'
              case 2:
                return '总考'
              default:
                return '定向考'
            }
          }
        },
        {
          title: '考核总人数',
          dataIndex: 'examCount',
          align: 'center',
          sorter: true
        },
        {
          title: '未通过人数',
          dataIndex: 'noPassExamCount',
          align: 'center',
          sorter: true
        },
        {
          title: '通过人数',
          dataIndex: 'passExamCount',
          align: 'center',
          sorter: true
        },
        {
          title: '通过率',
          dataIndex: 'rate',
          align: 'center',
          sorter: true,
          customRender (value) {
            return (value || 0) + '%'
          }
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'employeeEntity',
          customRender: (value) => {
            return value ? value.name : '-'
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createdAt',
          sorter: true,
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          }
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
    async excel () {
      this.excelLoading = true
      const time = this.screenData.time || []
      const data = {
        ...this.screenData,
        startTime: time[0] ? moment(time[0]).format('YYYY/MM/DD 00:00:00') : null,
        endTime: time[1] ? moment(time[1]).format('YYYY/MM/DD 23:59:59') : null,
        bindType: this.screenData.bindType === 'all' ? null : this.screenData.bindType
      }
      examTaskExcelExport(data, {
        limit: 6500,
        page: 1
      }).then((res) => {
        excelExport(res, '考试任务列表数据导出.xlsx')
        message.success('导出成功!')
      }).finally(() => {
        this.excelLoading = false
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
          return examTaskDelete({ examTaskId: id }).then(() => {
            message.success('删除成功！')
            thisData.getTableData()
          })
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
      const time = this.screenData.time || []
      const data = {
        ...this.screenData,
        startTime: time[0] ? moment(time[0]).format('YYYY/MM/DD 00:00:00') : null,
        endTime: time[1] ? moment(time[1]).format('YYYY/MM/DD 23:59:59') : null,
        bindType: this.screenData.bindType === 'all' ? null : this.screenData.bindType
      }
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
