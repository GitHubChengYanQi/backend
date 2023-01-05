<template>
  <div>
    <breadcrumb v-if="!select" :titles="['考试管理']"></breadcrumb>
    <a-card :bordered="false" class="my-table-search" :body-style="{padding:select ? 0 : 24}">
      <a-form layout="inline">

        <a-form-item :label="select ? '' : '考试名称'">
          <a-input v-model="screenData.name" placeholder="请输入考试名称" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item :label="select ? '' : '创建时间'">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item :label="select ? '' : '创建人'">
          <SelectEmployee v-model="screenData.employeeId" placeholder="请选择创建人" />
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
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <div class="my-table-wrapper">
      <div v-if="!select" class="btn">
        <a-button
          type="primary"
          v-permission="'testPaperList'"
          ghost
          @click="() => $router.push('/study/examination/testPaper')">
          试卷管理
        </a-button>
        <a-button
          type="primary"
          v-permission="'createExamination'"
          @click="() => $router.push('/study/examination/create')">
          新建考试
        </a-button>
      </div>

      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.examId"
          :rowSelection="select ? {...rowSelection,selectedRowKeys} : null"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="name" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img height="50" :src="record.coverImageUrl+'?x-oss-process=image/resize,m_fill,h_50,w_100'">
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
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button
                  class="warnButton"
                  @click="() => $router.push(`/study/examination/detail?examId=${record.examId}`)"
                >
                  详情
                </a-button>
                <a-button
                  class="successButton"
                  @click="edit(record.examId)"
                >
                  编辑
                </a-button>
                <a-button @click="deleteAttribute(record.examId)" class="delButton">删除</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>
import TagName from '@/views/workContactNew/components/tagName'
import breadcrumb from '../components/Breadcrumd/index'
import SelectEmployee from '../components/SelectEmployee/index'
import { examCheckBind, examDelete, examList } from '@/api/study/exam'
import moment from 'moment'
import { message } from 'ant-design-vue'
import router from '@/router'
import { courseExcelExport } from '@/api/study/course'
import { excelExport } from '@/utils/downloadUtil'

export default {
  components: { TagName, breadcrumb, SelectEmployee },
  props: {
    rows: {
      type: Array,
      default: _ => []
    },
    select: Boolean,
    checkbox: Boolean
  },
  data () {
    return {
      rowKey: 'examId',
      excelLoading: false,
      selectedRowKeys: [],
      checkedRows: [],
      rowSelection: {},
      loading: false,
      screenData: {},
      columns: [
        {
          title: '考试名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center',
          width: '200px'
        },
        {
          title: '试卷名称',
          width: '200px',
          dataIndex: 'questionnaireResults',
          align: 'center',
          customRender (value, record) {
            const questionnaireResults = record.questionnaireResults || []
            if (questionnaireResults.length > 0) {
              return questionnaireResults[0].questionnaireName
            } else {
              return '-'
            }
          }
        },
        {
          title: '重复考试',
          dataIndex: 'reexam',
          align: 'center',
          customRender (value) {
            switch (value) {
              case 1:
                return '允许重复考试'
              case 2:
                return '不允许重复考试'
              case 3:
                return '仅允许未通过的重复考试'
            }
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
            return (text ? moment(text).format('YYYY-MM-DD HH:mm') : '-')
          },
          align: 'center',
          sorter: true
        }
      ],
      sorter: {},
      tableData: [],
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
    if (this.checkbox) {
      this.rowSelection = {
        type: 'checkbox',
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
      }
    } else {
      this.rowSelection = {
        type: 'radio',
        onChange: this.selectChange
      }
    }
    this.checkedRows = this.rows
    this.selectedRowKeys = this.rows.map(item => item[this.rowKey])
    if (!this.select) {
      this.columns.push({
        title: '操作',
        width: 200,
        align: 'center',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' }
      })
    }
    this.getTableData()
  },
  methods: {
    onChangeRows (rows) {
      this.selectedRowKeys = rows.map(item => item[this.rowKey])
      this.checkedRows = rows
      this.$emit('selectRows', rows)
    },
    edit (id) {
      examCheckBind({ examId: id, type: 'edit' }).then(() => {
        router.push(`/study/examination/create?id=${id}`)
      })
    },
    deleteAttribute (id) {
      const getTableData = () => {
        this.getTableData()
      }
      examCheckBind({ examId: id, type: 'delete' }).then(() => {
        this.$confirm({
          title: '删除数据后不可恢复，是否确认删除?',
          okText: '删除',
          okType: 'danger',
          cancelText: '取消',
          centered: true,
          onOk () {
            return examDelete({ examId: id }).then(() => {
              message.success('删除成功！')
              getTableData()
            })
          },
          onCancel () {

          }
        })
      })
    },
    getTableData () {
      this.loading = true
      const time = this.screenData.time || []
      const data = {
        ...this.screenData,
        startTime: time[0] ? moment(time[0]).format('YYYY/MM/DD 00:00:00') : null,
        endTime: time[1] ? moment(time[1]).format('YYYY/MM/DD 23:59:59') : null
      }
      examList(data, {
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
    selectChange (ids, rows) {
      this.selectedRowKeys = ids
      this.$emit('selectRow', rows[0])
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
