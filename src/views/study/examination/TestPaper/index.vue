<template>
  <div>
    <breadcrumb v-if="!select" :titles="['考试管理','试卷管理']" back></breadcrumb>
    <a-card :bordered="false" class="my-table-search" :body-style="{padding:select ? 0 : 24}">
      <a-form layout="inline">

        <a-form-item :label="select ? '' : '试卷名称'">
          <a-input v-model="screenData.questionnaireName" placeholder="请输入试卷名称" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item :label="select ? '' : '创建时间'">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item v-if="!select" label="创建人">
          <SelectEmployee v-model="screenData.userName" placeholder="请输入创建人" />
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
          v-permission="'importTestPaper'"
          type="primary"
          ghost
          @click="importTestPaperClick">
          导入试卷
        </a-button>
        <a-button
          v-permission="'createTestPaper'"
          type="primary"
          @click="() => $router.push('/study/testPaper/create')">
          创建试卷
        </a-button>
      </div>
      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.questionnaireId"
          :rowSelection="select ? {type:'radio', onChange: selectChange} : null"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button
                  class="successButton"
                  @click="() => $router.push(`/study/testPaper/create?id=${record.questionnaireId}`)"
                >
                  编辑
                </a-button>

                <a-button @click="deleteAttribute(record.questionnaireId)" class="delButton">删除</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </a-spin>

      <a-modal
        centered
        destroyOnClose
        v-model="importTestPaper"
        title="导入试卷"
        class="my-modal"
        :okButtonProps="{props:{loading:importLoading,disabled:!uploadTemplateSuccess}}"
        @ok="onImportTestPaper"
      >
        <div class="importTestPaper">
          <div class="title">
            <a-badge :offset="[-64,0]">
              <a-icon slot="count" type="cloud-download" />
              下载模板
            </a-badge>
          </div>
          <div class="content">
            <div>导入试卷前请下载模板，按照模板格式导入</div>
            <a-button
              :loading="downloadTemplateLoading"
              type="primary"
              style="border-radius: 8px"
              @click="downloadTemplate"
            >
              下载模板
            </a-button>
          </div>
          <div class="title">
            <a-badge :offset="[-64,0]">
              <a-icon slot="count" type="cloud-download" />
              上传文件
            </a-badge>
          </div>
          <div class="content">
            <div>仅支持xlsx/xls.文件最大100MB</div>
            <upload
              :max-size="100"
              :default-file-type-list="['xlsx','xls']"
              style="display: inline-block"
              @success="uploadSuccess"
              @upload="upload"
              :file-type="1">
              <a-button style="border-radius: 8px">选择文件</a-button>
            </upload>
          </div>
          <div class="fileName">
            {{ fileName }}
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import TagName from '@/views/workContactNew/components/tagName'
import breadcrumb from '../../components/Breadcrumd/index'
import SelectEmployee from '../../components/SelectEmployee/index'
import {
  learningQuestionnaireCheckBind,
  learningQuestionnaireDelete, learningQuestionnaireDownloadTemplate, learningQuestionnaireImportQuestionnaire,
  learningQuestionnaireList
} from '@/api/study/testPager'
import moment from 'moment'
import { message } from 'ant-design-vue'
import upload from '../../lesson/Courseware/components/upload'
import { excelExport } from '@/utils/downloadUtil'

export default {
  components: { TagName, breadcrumb, upload, SelectEmployee },
  props: {
    select: Boolean
  },
  data () {
    return {
      fileName: '文件名',
      importTestPaper: false,
      uploadTemplateSuccess: false,
      loading: false,
      importLoading: false,
      screenData: {},
      columns: [
        {
          title: '试卷名称',
          dataIndex: 'questionnaireName',
          align: 'center',
          width: '200px'
        },
        {
          title: '总题数',
          width: '200px',
          dataIndex: 'questionResults',
          align: 'center',
          customRender: (questionResults) => {
            return (questionResults || []).length
          }
        },
        {
          title: '总分数',
          dataIndex: 'score',
          align: 'center'
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
          align: 'center',
          sorter: true,
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          }
        }
      ],
      tableData: [],
      sorter: {},
      file: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      },
      downloadTemplateLoading: false
    }
  },
  created () {
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
    importTestPaperClick () {
      console.log(1)
      this.importTestPaper = true
      this.uploadTemplateSuccess = false
    },
    downloadTemplate () {
      this.downloadTemplateLoading = true
      learningQuestionnaireDownloadTemplate().then((res) => {
        console.log(res)
        excelExport(res, '试卷模板.xlsx')
        message.success('导出成功!')
      }).finally(() => {
        this.downloadTemplateLoading = false
      })
    },
    onImportTestPaper () {
      this.importLoading = true
      const formData = new FormData()
      formData.append('file', this.file)
      learningQuestionnaireImportQuestionnaire(formData).then(() => {
        this.importTestPaper = false
        this.uploadTemplateSuccess = false
        this.getTableData()
        message.success('导入成功!')
      }).finally(() => {
        this.importLoading = false
      })
    },
    upload (file) {
      this.file = file
    },
    uploadSuccess (data = []) {
      const file = data[0] || {}
      this.fileName = file.name
      this.uploadTemplateSuccess = true
    },
    getTableData () {
      this.loading = true
      const time = this.screenData.time || []
      const order = this.sorter.order === 'ascend' ? 'asc' : 'desc'
      const isUserId = this.screenData.userName && this.screenData.userName.indexOf('id:') !== -1
      const data = {
        ...this.screenData,
        employeeId: isUserId ? this.screenData.userName.split('id:')[1] : null,
        userName: isUserId ? null : this.screenData.userName,
        sorter: (this.sorter.field && this.sorter.order) ? this.sorter.field + ' ' + order : null,
        startTime: time[0] ? moment(time[0]).format('YYYY/MM/DD 00:00:00') : null,
        endTime: time[1] ? moment(time[1]).format('YYYY/MM/DD 23:59:59') : null
      }
      learningQuestionnaireList(data, {
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
      this.$emit('selectRow', rows[0])
    },
    deleteAttribute (id) {
      const getTableData = () => {
        this.getTableData()
      }
      learningQuestionnaireCheckBind({ questionnaireId: id, type: 'delete' }).then(() => {
        this.$confirm({
          title: '删除数据后不可恢复，是否确认删除?',
          okText: '删除',
          okType: 'danger',
          cancelText: '取消',
          centered: true,
          onOk () {
            return learningQuestionnaireDelete({ questionnaireId: id }).then(() => {
              message.success('删除成功！')
              getTableData()
            })
          },
          onCancel () {

          }
        })
      })
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

.importTestPaper {
  padding: 0 24px;
}

.title {
  font-weight: bold;
}

.content {
  display: flex;
  padding-bottom: 24px;
  align-items: center;

  div {
    flex-grow: 1;
  }
}

.fileName {
  background-color: #F5F6FA;
  color: #868B98;
  padding: 14px;
  border-radius: 8px;
}

.user-info {

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
