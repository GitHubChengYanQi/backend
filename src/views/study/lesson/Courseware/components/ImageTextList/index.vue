<template>
  <div>
    <a-card :bordered="false" class="my-table-search" :body-style="{padding:select ? 0 : 24}">
      <a-form layout="inline">

        <a-form-item :label="select ? '' : '标题名称'">
          <a-input v-model="screenData.name" placeholder="请输入标题名称" :maxLength="50"></a-input>
        </a-form-item>

        <a-form-item :label="select ? '' : '上传时间'">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item :label="select ? '' : '上传人'">
          <a-input v-model="screenData.user" style="width: 200px" placeholder="请输入创建人名称" :maxLength="10"></a-input>
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
            <a-button v-if="!select" type="primary" @click="reset">导出</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>

    <div class="my-table-wrapper">
      <div v-if="!select" class="btn">
        <a-button type="primary" @click="() => $router.push('/study/lesson/createImageText')">
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
                <img height="50" :src="record.coverImageUrl">
              </div>
              <div class="nickname">
                <a-tooltip>
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
                  @click="() => $router.push(`/study/lesson/createImageText?id=${record.courseWareId}`)">
                  编辑
                </a-button>
                <a-button class="linkButton" @click="openPreview(record)">预览</a-button>
                <a-popconfirm
                  title="是否确认删除"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deleteAttribute(record.courseWareId)"
                >
                  <a-button class="delButton">删除</a-button>
                </a-popconfirm>
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
import { courseWareDelete, courseWareList } from '@/api/study/courseWare'
import Preview from '../../../../components/Preview/index'

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
      screenData: {
        gender: 3,
        addWay: '全部',
        fieldId: 0
      },
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
          dataIndex: 'user',
          align: 'center'
        }
      ],
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
      courseWareDelete({ courseWareId: id }).then(() => {
        message.success('删除成功！')
        this.getTableData()
      })
    },
    getTableData () {
      this.loading = true
      const data = {
        courseWareType: 'text'
      }
      courseWareList(data, {
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
  },
  components: { upload, vpload, Preview }
}
</script>

<style lang="less" scoped>

.user-info {
  text-align: center;
  justify-content: center;

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
