<template>
  <div>
    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">
        <a-form-item
          label="课件名称：">
          <a-input v-model="screenData.name" placeholder="请输入课件名称" :maxLength="20"></a-input>
        </a-form-item>
        <a-form-item
          label="关联考试：">
          <a-select
            :options="[{value:'all',label:'全部'},{value:'true',label:'是'},{value:'false',label:'否'}]"
            v-model="screenData.haveExam"
            style="width: 200px"
            placeholder="请选择考试状态"
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
            <a-button type="primary" @click="reset">导出</a-button>
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
          :rowKey="record => record.courseWareBindId"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="name" slot-scope="text">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img
                  height="50"
                  v-if="['jpg','png'].includes(text && text.suffix)"
                  :src="(text && text.coverImageUrl || text && text.mediaUrl) +'?x-oss-process=image/resize,m_fill,h_50,w_100'"
                >
                <a-icon v-if="['doc','docx'].includes(text && text.suffix)" type="file-word" style="font-size: 24px" />
                <a-icon v-if="['ppt','pptx'].includes(text && text.suffix)" type="file-ppt" style="font-size: 24px" />
                <a-icon v-if="['pdf'].includes(text && text.suffix)" type="file-pdf" style="font-size: 24px" />
              </div>
              <div class="nickname">
                <a-tooltip overlayClassName="myTooltip">
                  <template slot="title">
                    {{ text && text.fileName || text && text.title }}
                  </template>
                  {{ text && text.fileName || text && text.title }}
                </a-tooltip>
              </div>
            </div>
          </div>
          <div slot="introduction" slot-scope="text">
            <div class="introduction">
              <a-tooltip overlayClassName="myTooltip">
                <template slot="title">
                  {{ text }}
                </template>
                {{ text }}
              </a-tooltip>
            </div>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div>
                <a-button type="link" @click="setVisible(record.name)">重命名</a-button>
                <a-button type="link">下载</a-button>
                <a-button type="link">预览</a-button>
                <a-button type="link" @click="deleteAttribute(record.id)">删除</a-button>
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
import { courseTaskBindDetailList, courseWareBindList } from '@/api/study/course'
import { getTimeDifference } from '@/utils/util'

export default {
  props: {
    task: Boolean
  },
  data () {
    return {
      loading: false,
      screenData: {},
      columns: [
        {
          title: '章节',
          dataIndex: 'index',
          align: 'center',
          width: '100px',
          customRender (value, record, index) {
            return index + 1
          }
        },
        {
          title: '课件',
          width: '200px',
          dataIndex: 'courseWareResult',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '时长',
          dataIndex: 'createTime',
          align: 'center',
          customRender (value, record) {
            return (record.hour < 10 ? '0' + record.hour || 0 : record.hour || 0) + ':' + (record.minute < 10 ? '0' + record.minute || 0 : record.minute || 0) + ':' + (record.second < 10 ? '0' + record.second || 0 : record.second || 0)
          }
        },
        {
          title: '已学完人数',
          dataIndex: 'doneLearningstatusCount',
          align: 'center',
          sorter: true
        },
        {
          title: '未学人数',
          dataIndex: 'noLearningstatusCount',
          align: 'center',
          sorter: true
        },
        {
          title: '进行中人数',
          dataIndex: 'learningstatusCount',
          align: 'center',
          sorter: true
        },
        {
          title: '累计学习时长',
          dataIndex: 'learningTime',
          align: 'center',
          sorter: true,
          customRender (value) {
            return value ? getTimeDifference(value) : '-'
          }
        },
        {
          title: '关联考试',
          dataIndex: 'examId',
          align: 'center',
          customRender (value) {
            return value ? '是' : '否'
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
    this.getTableData()
  },
  methods: {
    async getTableData () {
      this.loading = true
      const data = {
        ...this.screenData,
        haveExam: this.screenData.haveExam === 'all' ? null : this.screenData.haveExam,
        courseId: router.history.current.query.courseId
      }
      const params = {
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        sorter: {
          field: this.sorter.field,
          order: this.sorter.order
        }
      }
      let res = {}
      if (this.task) {
        res = await courseTaskBindDetailList(data, params)
      } else {
        res = await courseWareBindList(data, params)
      }
      this.tableData = res.data
      this.pagination.total = res.count
      this.loading = false
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
