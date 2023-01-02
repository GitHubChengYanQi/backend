<template>
  <div>
    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">
        <a-form-item
          label="考试名称：">
          <a-input v-model="screenData.name" placeholder="请输入考试名称" :maxLength="20"></a-input>
        </a-form-item>
        <a-form-item
          label="考试类别：">
          <a-select
            :options="[{value:'all',label:'全部'},{value:0,label:'定向考'},{value:1,label:'章节考'},{value:2,label:'总考'}]"
            v-model="screenData.bindType"
            style="width: 200px"
            placeholder="请选择考试类别"
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
              <div>
                <a-button
                  class="successButton"
                  @click="() => $router.push(`/study/examinationAnalysis/examintionDetail?examId=${record.examId}&courseId=${$router.history.current.query.courseId}&examCount=${record.examCount || 0}&passExamCount=${record.passExamCount || 0}&noPassExamCount=${record.noPassExamCount || 0}&inExamCount=${record.inExamCount || 0}`)"
                >
                  查看详情
                </a-button>
              </div>
            </template>
          </div>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>

import router from '@/router'
import { courseExcelExport, examCourseBindPageExcelExport, examCourseBindPageList } from '@/api/study/course'
import moment from 'moment'
import { excelExport } from '@/utils/downloadUtil'
import { message } from 'ant-design-vue'

export default {
  data () {
    return {
      loading: false,
      excelLoading: false,
      screenData: {},
      columns: [
        {
          title: '考试名称',
          dataIndex: 'name',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '试卷名称',
          width: '200px',
          dataIndex: 'questionnaireName',
          align: 'center'
        },
        {
          title: '考试类别',
          dataIndex: 'bindType',
          align: 'center',
          customRender (value) {
            switch (value) {
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
          title: '答卷时长',
          dataIndex: 'timeLimit',
          align: 'center',
          customRender (value) {
            return value + '分钟'
          }
        },
        {
          title: '试卷总分',
          dataIndex: 'questionnaireResults',
          align: 'center',
          customRender (value) {
            return value && value[0] && value[0].score || 0
          }
        },
        {
          title: '考试人数',
          dataIndex: 'examCount',
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
          title: '未通过人数',
          dataIndex: 'noPassExamCount',
          align: 'center',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
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
      const data = {
        ...this.screenData,
        bindType: this.screenData.bindType === 'all' ? null : this.screenData.bindType,
        courseId: router.history.current.query.courseId
      }
      examCourseBindPageExcelExport(data, {
        limit: 6500,
        page: 1
      }).then((res) => {
        excelExport(res, '考试分析数据导出.xlsx')
        message.success('导出成功!')
      }).finally(() => {
        this.excelLoading = false
      })
    },
    getTableData () {
      this.loading = true
      const data = {
        ...this.screenData,
        bindType: this.screenData.bindType === 'all' ? null : this.screenData.bindType,
        courseId: router.history.current.query.courseId
      }
      examCourseBindPageList(data, {
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
    // 重置
    reset () {
      this.screenData = {}
    }
  }
}
</script>

<style lang="less" scoped>

.my-table-search {
  margin-bottom: 24px;
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
</style>
