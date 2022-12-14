<template>
  <div>
    <breadcrumb v-if="!select" :titles="['考试管理','试卷管理']" back></breadcrumb>
    <a-card v-if="!select" :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="试卷名称">
          <a-input v-model="screenData.name" placeholder="请输入试卷名称" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item
          label="创建时间">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item
          label="创建人">
          <a-input v-model="screenData.user" style="width: 200px" placeholder="请输入创建人名称" :maxLength="10"></a-input>
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
      <div v-if="!select" class="btn">
        <a-button
          type="primary"
          ghost
          @click="() => $router.push('/study/lesson/Courseware')">
          导入试卷
        </a-button>
        <a-button
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
          <div slot="questionnaireName" slot-scope="text">
            <div class="user-info flex">
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
                  @click="() => $router.push(`/study/testPaper/create?id=${record.questionnaireId}`)"
                >
                  编辑
                </a-button>

                <a-popconfirm
                  title="是否确认删除"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deleteAttribute(record.questionnaireId)"
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
import TagName from '@/views/workContactNew/components/tagName'
import breadcrumb from '../../components/Breadcrumd/index'
import { learningQuestionnaireDelete, learningQuestionnaireList } from '@/api/study/testPager'
import moment from 'moment'
import { message } from 'ant-design-vue'

export default {
  components: { TagName, breadcrumb },
  props: {
    select: Boolean
  },
  data () {
    return {
      loading: false,
      lessonClassVisible: false,
      screenData: {
        gender: 3,
        addWay: '全部',
        fieldId: 0
      },
      columns: [
        {
          title: '试卷名称',
          dataIndex: 'questionnaireName',
          scopedSlots: { customRender: 'questionnaireName' },
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
          dataIndex: 'class',
          align: 'center'
        },
        {
          title: '创建人',
          dataIndex: 'tag',
          scopedSlots: { customRender: 'tag' },
          align: 'center'
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
    getTableData () {
      this.loading = true
      const data = {}
      learningQuestionnaireList(data, {
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
    selectChange (ids, rows) {
      this.$emit('selectRow', rows[0])
    },
    deleteAttribute (id) {
      learningQuestionnaireDelete({ questionnaireId: id }).then(() => {
        message.success('删除成功！')
        this.getTableData()
      })
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
  text-align: center;
  justify-content: center;

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
