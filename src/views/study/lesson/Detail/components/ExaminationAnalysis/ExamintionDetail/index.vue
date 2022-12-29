<template>
  <div>

    <breadcrumb v-if="!task" :titles="['课程管理','课程详情','考试详情']" back></breadcrumb>

    <div class="head">
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">155</div>
          考试人数
        </div>
      </div>
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">155</div>
          通过人数
        </div>
      </div>
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">155</div>
          未通过人数
        </div>
      </div>
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">155</div>
          考试中人数
        </div>
      </div>
      <div class="box">
        <a-icon type="form" class="icon" />
        <div>
          <div class="num">155</div>
          通过率
        </div>
      </div>
    </div>

    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="员工姓名：">
          <a-input v-model="screenData.name" placeholder="请输入员工姓名" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item
          label="所属机构：">
          <a-input v-model="screenData.name" placeholder="请选择所属机构" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item
          label="所属门店：">
          <a-input v-model="screenData.name" placeholder="请选择所属门店" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item
          label="考试状态：">
          <a-select
            :options="[{value:0,label:'全部'},{value:1,label:'是'},{value:2,label:'否'}]"
            v-model="screenData.gender1"
            style="width: 200px"
            placeholder="请选择考试状态"
          ></a-select>
        </a-form-item>

        <a-form-item
          label="考试结果：">
          <a-select
            :options="[{value:0,label:'全部'},{value:1,label:'通过'},{value:2,label:'未通过'},{value:3,label:'未考试'}]"
            v-model="screenData.gender1"
            style="width: 200px"
            placeholder="请选择考试结果"
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
          :rowKey="record => record.id"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="name" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <a-icon type="file-word" style="font-size: 24px" />
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
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../../../../../components/Breadcrumd/index'
import router from '@/router'
import { courseExamBindExamBindPageList } from '@/api/study/course'
import moment from 'moment'

export default {
  props: {
    task: Boolean
  },
  components: { breadcrumb },
  data () {
    return {
      loading: false,
      screenData: {},
      columns: [
        {
          title: '姓名',
          dataIndex: '1',
          align: 'center',
          width: '200px',
          customRender (value, record) {
            return record.employeeEntity && record.employeeEntity.name || '-'
          }
        },
        {
          title: '所属机构',
          width: '200px',
          dataIndex: '2',
          align: 'center',
          customRender (value, record) {
            return record.employeeEntity && record.employeeEntity.masterDepartmentName || '-'
          }
        },
        {
          title: '所属门店',
          dataIndex: '3',
          align: 'center',
          customRender (value, record) {
            return record.employeeEntity && record.employeeEntity.department && record.employeeEntity.department.departmentName || '-'
          }
        },
        {
          title: '考试状态',
          dataIndex: '2',
          align: 'center',
          customRender (value, record) {
            return record.doneAt ? '是' : '否'
          }
        },
        {
          title: '考试分数',
          dataIndex: 'score',
          align: 'center',
          sorter: true,
          customRender (value, record) {
            return record.doneAt ? value : '-'
          }
        },
        {
          title: '考试结果',
          dataIndex: 'status',
          align: 'center',
          customRender (value, record) {
            return record.doneAt ? (value === 1 ? '通过' : '未通过') : '-'
          }
        },
        {
          title: '考试次数',
          dataIndex: 'examCount',
          align: 'center',
          customRender (value, record) {
            return record.doneAt ? value : '-'
          }
        },
        {
          title: '答卷时长',
          dataIndex: 'resultTime',
          align: 'center',
          sorter: true,
          customRender (value, record) {
            return record.doneAt ? value : '-'
          }
        },
        {
          title: '交卷时间',
          dataIndex: 'doneAt',
          align: 'center',
          sorter: true,
          customRender (value, record) {
            return (record.doneAt && value) ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        }
      ],
      tableData: [],
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
    getTableData () {
      this.loading = true
      const data = {
        ...this.screenData,
        courseId: router.history.current.query.courseId,
        examId: router.history.current.query.examId
      }
      courseExamBindExamBindPageList(data, {
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

.head {
  padding: 24px;
  background-color: #fff;
  display: flex;
  margin-bottom: 24px;
  gap: 24px;
  border-radius: 8px;

  .box {
    border-radius: 8px;
    flex-grow: 1;
    padding: 24px;
    background-color: #fbfbfe;
    gap: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .icon {
      font-size: 56px;
      box-shadow: 0 0 5px 0 #02020275;
    }

    .num {
      font-weight: bold;
      font-size: 32px;
    }
  }
}

.my-table-search {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
