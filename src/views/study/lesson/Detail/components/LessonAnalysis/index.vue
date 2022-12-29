<template>
  <div class="lessonAnalysis">
    <div class="head">
      <div class="headImg">
        <img
          height="220"
          src="data:image/jpeg;base64,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"
        >
        <div class="info">
          <span>共13个课件</span>
          <span style="float: right">12:23:23</span>
        </div>
      </div>
      <div class="column">
        <div class="title">标题</div>
        <div class="space">
          <div>分类：默认分类</div>
          <div>创建时间：2022.10.1</div>
          <div v-if="task">限定时长：2022.10.1</div>
        </div>
        <div class="count">
          <div>
            <div class="number"><span class="num">73</span>人</div>
            已学完
          </div>
          <div>
            <div class="number"><span class="num">73</span>人</div>
            未学完
          </div>
          <div>
            <div class="number"><span class="num">73</span>人</div>
            进行中
          </div>
          <div>
            <div class="number"><span class="num">73</span>人</div>
            已考试
          </div>
          <div>
            <div class="number"><span class="num">73</span>人</div>
            已通过
          </div>
          <div>
            <div class="number"><span class="num">73</span>人</div>
            未通过
          </div>
          <div v-if="task">
            <div class="number"><span class="num">73</span>人</div>
            完成率
          </div>
          <div v-if="task">
            <div class="number"><span class="num">73</span>人</div>
            参与率
          </div>
        </div>
        <div class="note">
          本次课程..............................
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
          <div style="width: 200px">
            <SelectDepartment :treeCheckStrictly="true" v-model="screenData.storeIds" />
          </div>
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

        <a-form-item
          label="学习状态：">
          <a-select
            :options="[{value:0,label:'全部'},{value:1,label:'已学习'},{value:2,label:'未学习'},{value:3,label:'学习中'}]"
            v-model="screenData.gender1"
            style="width: 200px"
            placeholder="请选择学习状态"
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
          :rowKey="record => record.key"
          :pagination="pagination"
          @change="handleTableChange"
        />
      </a-spin>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import { courseEmployeeBindList, courseTaskBindList } from '@/api/study/course'
import router from '@/router'
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
          title: '学习状态',
          dataIndex: '4',
          align: 'center',
          customRender (value, record) {
            switch (record.learningStatusResult && record.learningStatusResult.status) {
              case 1:
                return '学习中'
              case 2:
                return '已学习'
              default:
                return '未学习'
            }
          }
        },
        {
          title: '学习进度',
          dataIndex: 'doneStatusDetail',
          align: 'center',
          sorter: true,
          customRender (value, record) {
            const doneStatusDetail = record.doneStatusDetail || 0
            const statusDetail = record.statusDetail || 0
            const num = Math.round((doneStatusDetail / statusDetail) * 100) || 0
            return num + '%'
          }
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
          title: '上次学习',
          dataIndex: 'lastLearningTime',
          align: 'center',
          sorter: true,
          customRender (value) {
            return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        },
        {
          title: '完成时间',
          dataIndex: 'doneTime',
          align: 'center',
          sorter: true,
          customRender (value) {
            return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        },
        {
          title: '总考状态',
          dataIndex: '9',
          align: 'center',
          customRender (value, record) {
            return record.learningStatusResult && record.learningStatusResult.a || '-'
          }
        },
        {
          title: '考试结果',
          dataIndex: '10',
          align: 'center',
          customRender (value, record) {
            return record.learningStatusResult && record.learningStatusResult.a || '-'
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
    async getTableData () {
      this.loading = true
      const data = {
        ...this.screenData,
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
        res = await courseTaskBindList(data, params)
      } else {
        res = await courseEmployeeBindList(data, params)
      }
      if (res.code === 0) {
        this.tableData = res.data.map((item, index) => ({ ...item, key: index }))
        this.pagination.total = res.count
      }
      this.loading = false
    },
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.sorter = sorter
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
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
.lessonAnalysis {

  .title {
    font-weight: bold;
    font-size: 24px;
  }

  .space {
    display: flex;
    gap: 24px;
  }

  .head {
    padding: 24px;
    background-color: #fff;
    display: flex;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
  }

  .note {
    border-radius: 4px;
    padding: 12px;
    color: #a4a1a4;
    font-size: 12px;
  }

  .headImg {
    display: inline-block;
    width: 300px;
    position: relative;

    img {
      max-width: 300px;
      border-radius: 2px;
    }

    .info {
      padding: 12px;
      color: #fff;
      border-top: solid 1px #fff;
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }

  .count {
    background-color: #fbfbfb;
    padding: 12px 24px;
    border-radius: 8px;
    display: flex;
    width: max-content;

    > div {
      width: 100px;
    }

    .number {
      font-weight: bold;

      .num {
        font-size: 18px;
      }
    }
  }

  .my-table-search {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
