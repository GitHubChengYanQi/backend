<template>
  <div>
    <a-card>
      <a-table
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :data-source="tableData"
        @change="handleTableChange">
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { collaboratorRulesRelationPeople } from '@/api/collaboratorRules'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      columns: [
        {
          title: '员工姓名',
          dataIndex: 'employeeName',
          align: 'center',
          width: 150
        },
        {
          title: '机构名称',
          dataIndex: 'departmentName',
          width: 150,
          align: 'center'
        },
        {
          title: '门店名称',
          dataIndex: 'storeName',
          align: 'center',
          width: 150
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      }
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    /**
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        id: this.id
      }
      collaboratorRulesRelationPeople(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.pagination.total = res.data.page.total
      })
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
  h2{
    font-size:18px;
    i{
      margin-right:10px;
      cursor:pointer;
    }
  }
  .head{
    .fl{
      span{
        margin-right:10px;
      }
    }
  }
</style>
