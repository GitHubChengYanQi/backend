<template>
  <div>
    <a-card v-if="!select" :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="视频名称：">
          <a-input v-model="screenData.name" placeholder="请输入视频名称" :maxLength="50"></a-input>
        </a-form-item>

        <a-form-item
          label="上传时间：">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item
          label="上传人：">
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
            <a-button type="primary" @click="reset">导出</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>

    <div class="my-table-wrapper">
      <div v-if="!select" class="btn">
        <a-button type="primary" @click="() => $router.push('/study/lesson/createVideo')">
          上传视频
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
                  @click="() => $router.push(`/study/lesson/createVideo?id=${record.courseWareId}`)"
                >
                  编辑
                </a-button>
                <a-button class="linkButton">预览</a-button>
                <a-popconfirm
                  disabled
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

  </div>
</template>

<script>

import { courseWareDelete, courseWareList } from '@/api/study/courseWare'
import moment from 'moment'
import { message } from 'ant-design-vue'

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
          title: '大小',
          width: '200px',
          dataIndex: 'size',
          align: 'center'
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
      tableData: [],
      checkIds: [],
      upLoadRes: {},
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
    selectChange (row) {
      this.checkIds = row
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
        courseWareType: 'video'
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
