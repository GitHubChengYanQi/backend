<template>
  <div>
    <a-card>
      <!--table-->
      <div class="table-wrapper">
        <a-table
          rowKey="resultsId"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="questionnaireName" slot-scope="questionnaireName">
            <template>
              {{ questionnaireName }}
            </template>
          </div>
          <div slot="createdAt" slot-scope="createdAt">
            <div>{{ timeFormat(createdAt) }}</div>
          </div>
        </a-table>
      </div>
      <!--end table-->
    </a-card>
  </div>
</template>

<script>
import { diagnosisCareResultList } from '@/api/healthManage'
import moment from 'moment'
export default {
  // eslint-disable-next-line
  props: ['contactId'],
  data () {
    return {
      id: '',
      loading: false,
      columns: [
        {
          title: '问卷内容',
          dataIndex: 'questionnaireName',
          align: 'questionnaireName',
          scopedSlots: { customRender: 'questionnaireName' }
        },
        {
          title: '任务完成日期',
          sorter: true,
          sorterKey: 'createdAt',
          dataIndex: 'createdAt',
          align: 'center',
          width: 300,
          scopedSlots: { customRender: 'createdAt' }
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      sorter: {}
    }
  },
  created () {
    this.initFn()
  },
  methods: {
    /**
         * 初始化
         */
    initFn () {
      this.search()
    },
    /**
         * 拉取列表
         */
    getTableData () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      const { order, column } = this.sorter
      if (order === 'ascend') {
        params.sort = `${column.sorterKey} asc`
        // params[column.sorterKey] = 'ASC'
      } else if (order === 'descend') {
        // params[column.sorterKey] = 'DESC'
        params.sort = `${column.sorterKey} desc`
      }
      diagnosisCareResultList(params, { contactId: this.contactId }).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.pagination.total = res.data.total
      })
    },
    /**
         * 查询
         */
    search () {
      this.pagination.current = 1
      this.getTableData()
    },
    /**
         * 表格监听事件
         */
    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.sorter = sorter
      this.getTableData()
    },
    timeFormat (e) {
      return moment(e).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="less" scoped>
.handle {
    button {
        margin-right: 10px;
    }
}
</style>
