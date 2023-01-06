<template>
  <div>
    <a-card :bordered="false" class="my-table-search" :body-style="{padding:select ? 0 : 24}">
      <a-form layout="inline">

        <a-form-item :label="select ? '' : '标题名称'">
          <a-input v-model="screenData.title" placeholder="请输入标题名称" :maxLength="50"></a-input>
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
        <a-button
          v-permission="'createImgText'"
          type="primary"
          @click="() => $router.push('/study/lesson/createImageText')"
        >
          创建图文
        </a-button>
      </div>
      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.courseWareId"
          :pagination="pagination"
          :row-selection="!select ? null :{...rowSelection,selectedRowKeys}"
          @change="handleTableChange">
          <div slot="titleRender" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img height="50" :src="record.coverImageUrl+'?x-oss-process=image/resize,m_fill,h_50,w_100'">
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
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button
                  class="successButton"
                  @click="() => edit(record.courseWareId)">
                  编辑
                </a-button>
                <a-button class="linkButton" @click="openPreview(record)">预览</a-button>
                <a-button @click="deleteAttribute(record.courseWareId)" class="delButton">删除</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </a-spin>
    </div>

    <Preview
      :title="previewTitle"
      :preview="preview"
      @close="preview = false"
      :content="content"
    >
      <div>
        <img class="img" :src="url" alt="avatar" width="283" />
      </div>
    </Preview>
  </div>
</template>

<script>

import upload from '../upload'
import vpload from '../vpload'
import { message } from 'ant-design-vue'
import moment from 'moment'
import { courseWareCheckBind, courseWareDelete, courseWareList } from '@/api/study/courseWare'
import Preview from '../../../../components/Preview/index'
import SelectEmployee from '../../../../components/SelectEmployee/index'
import router from '@/router'
import { courseExcelExport } from '@/api/study/course'
import { excelExport } from '@/utils/downloadUtil'

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
      content: '',
      url: '',
      excelLoading: false,
      previewTitle: '',
      preview: false,
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
      tableData: [],
      loading: false,
      visible: false,
      screenData: {},
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'titleRender' },
          align: 'center',
          width: '200px'
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
    edit (id) {
      courseWareCheckBind({ courseWareId: id, type: 'edit' }).then(() => {
        router.push(`/study/lesson/createImageText?id=${id}`)
      })
    },
    openPreview (record) {
      this.preview = true
      this.previewTitle = record.title
      this.content = record.note
      this.url = record.coverImageUrl
    },
    onChangeRows (rows) {
      this.selectedRowKeys = rows.map(item => item[this.rowKey])
      this.checkedRows = rows
      this.$emit('selectRows', rows)
    },
    uploadVisibleOpen (edit) {
      if (edit) {
        message.warn('课件已被xxx，xxx课程引用，不可编辑')
      } else {
        this.uploadDefine = false
        this.uploadVisible = true
      }
    },
    uploadSuccess (data) {
      this.upLoadRes.voicePath = data.path
      this.upLoadRes.voiceName = data.name
      this.uploadDefine = true
    },
    setVisible (visible) {
      this.fileName = visible
      this.visible = true
    },
    handleOk () {
      console.log('ok')
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
        courseWareType: 'text'
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
  components: { upload, vpload, Preview, SelectEmployee }
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
    max-width: 160px;
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
</style>
