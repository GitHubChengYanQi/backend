<template>
  <div>
    <a-card :bordered="false" class="my-table-search" :body-style="{padding:select ? 0 : 24}">

      <a-form layout="inline">

        <a-form-item :label="select ? '' : '文件名称'">
          <a-input v-model="screenData.fileName" placeholder="请输入文件名称" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item :label="select ? '' : '上传时间'">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item :label="select ? '' : '上传人'">
          <div style="width: 200px">
            <SelectEmployee v-model="screenData.employeeId" placeholder="请选择上传人" />
          </div>
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
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <div class="my-table-wrapper">
      <div v-if="!select" class="btn">
        <div v-permission="'uploadFile'">
          <a-tooltip>
            <template slot="title">
              上传文件支持格式: jpg、png、ppt、pptx、pdf、doc、docx文件大小不超过100M
            </template>
            <a-icon type="question-circle" />
          </a-tooltip>
          <upload
            :max-size="100"
            @upload="upload"
            @on-percent="onPercent"
            :default-file-type-list="['jpg','png','ppt','pptx','pdf','doc','docx']"
            style="display: inline-block"
            @success="uploadSuccess"
            :file-type="1"
          />
        </div>

        <a-button v-permission="'bathDownload'" type="primary" ghost @click="download(checkedRows)">
          批量下载
        </a-button>
      </div>
      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.courseWareId"
          :pagination="pagination"
          :row-selection="{...rowSelection,selectedRowKeys}"
          @change="handleTableChange"
        >
          <div slot="fileName" slot-scope="text,record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img height="50" width="50" v-if="['jpg','png'].includes(record.suffix)" :src="record.mediaUrl">
                <a-icon v-if="['doc','docx'].includes(record.suffix)" type="file-word" style="font-size: 24px" />
                <a-icon v-if="['ppt','pptx'].includes(record.suffix)" type="file-ppt" style="font-size: 24px" />
                <a-icon v-if="['pdf'].includes(record.suffix)" type="file-pdf" style="font-size: 24px" />
              </div>
              <div class="nickname">
                <a-tooltip overlayClassName="myTooltip">
                  <template slot="title">
                    {{ text }}
                  </template>
                  {{ text }}
                </a-tooltip>
              </div>
            </div>
          </div>
          <div slot="size" slot-scope="text">
            <template>
              <div class="statistics">
                <a-statistic :value="text" suffix="kb" :valueStyle="{fontSize:'14px'}" />
              </div>
            </template>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button class="warnButton" @click="setVisible(record)">重命名</a-button>
                <a-button class="successButton" disabled>预览</a-button>
                <a-button class="linkButton" @click="download([record])">下载</a-button>
                <a-button @click="deleteAttribute(record.courseWareId)" class="delButton">删除</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </a-spin>
    </div>

    <a-modal
      centered
      v-model="visible"
      title="修改名称"
      :okButtonProps="{props:{loading:updateLoading}}"
      @ok="handleOk"
      class="my-modal"
    >
      <a-input v-model="fileName"></a-input>
    </a-modal>

    <a-modal
      centered
      destroyOnClose
      v-model="uploadVisible"
      title="上传中"
      :footer="[]"
    >
      <a-progress :percent="percent" />
    </a-modal>
  </div>
</template>

<script>

import upload from '../upload'
import { message } from 'ant-design-vue'
import {
  courseWareAdd,
  courseWareCheckBind,
  courseWareDelete,
  courseWarEdit,
  courseWareList
} from '@/api/study/courseWare'
import moment from 'moment'
import FilePreview from '../../../../components/FilePreview/index'
import SelectEmployee from '../../../../components/SelectEmployee/index'

export default {
  props: {
    selectRows: {
      type: Array,
      default () {
        return []
      }
    },
    select: Boolean
  },
  data () {
    return {
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
      rowKey: 'courseWareId',
      loading: false,
      percent: 0,
      imgUrl: '',
      imgName: '',
      excelLoading: false,
      uploadVisible: false,
      updateLoading: false,
      fileName: String,
      fileId: '',
      visible: false,
      screenData: {},
      columns: [
        {
          title: '文件名称',
          dataIndex: 'fileName',
          scopedSlots: { customRender: 'fileName' },
          align: 'center',
          width: '200px'
        },
        {
          title: '大小',
          width: '200px',
          dataIndex: 'size',
          align: 'center',
          scopedSlots: { customRender: 'size' }
        },
        {
          title: '上传时间',
          dataIndex: 'createdAt',
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          },
          align: 'center',
          sorter: true
        },
        {
          title: '上传人',
          dataIndex: 'employee',
          align: 'center',
          customRender: (text) => {
            return text && text.name
          }
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
    this.checkedRows = this.selectRows
    this.selectedRowKeys = this.selectRows.map(item => item[this.rowKey])
    if (!this.select) {
      this.columns.push({
        title: '操作',
        align: 'center',
        width: 270,
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
    upload () {
      this.percent = 0
      this.uploadVisible = true
    },
    onPercent (percent) {
      if (percent > this.percent) {
        this.percent = percent
      }
    },
    download (records = []) {
      if (records.length === 0) {
        message.warn('请选择想要下载的文件！')
      } else {
        records.forEach(item => {
          window.open(item.mediaUrl)
        })
      }
    },
    uploadSuccess (data = []) {
      const file = data[0] || {}
      courseWareAdd({
        courseWareType: 'file',
        fileName: file.name,
        fileType: file.type,
        suffix: file.name && file.name.split('.')[file.name.split('.').length - 1],
        size: file.size,
        mediaUrl: file.fullPath
      }).then(() => {
        message.success('上传成功！')
        this.getTableData()
      }).finally(() => {
        this.uploadVisible = false
        this.percent = 0
      })
      this.imgUrl = file.fullPath
      this.imgName = file.name
    },
    setVisible (record) {
      this.fileName = record.fileName
      this.fileId = record.courseWareId
      this.visible = true
    },
    handleOk () {
      this.updateLoading = true
      courseWarEdit({ fileName: this.fileName, courseWareId: this.fileId }).then(() => {
        message.success('修改成功！')
        this.getTableData()
        this.visible = false
      }).finally(() => {
        this.updateLoading = false
      })
    },
    deleteAttribute (id) {
      const thisData = this
      courseWareCheckBind({ courseWareId: id, type: 'delete' }).then(() => {
        this.$confirm({
          title: '删除数据后不可恢复，是否确认删除?',
          okText: '删除',
          okType: 'danger',
          cancelText: '取消',
          centered: true,
          onOk () {
            return courseWareDelete({ courseWareId: id }).then(() => {
              message.success('删除成功！')
              thisData.getTableData()
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
        endTime: time[1] ? moment(time[1]).format('YYYY/MM/DD 23:59:59') : null,
        courseWareType: 'file'
      }
      courseWareList(data, {
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
  },
  components: { upload, FilePreview, SelectEmployee }
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

.user-info {

  img {
    border-radius: 2px;
  }

  .nickname {
    white-space: nowrap;
    max-width: 208px;
    overflow: hidden;
    text-overflow: ellipsis;
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

.statistics {
  /deep/ span {
    font-size: 14px !important;
  }
}
</style>
