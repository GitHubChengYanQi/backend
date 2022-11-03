<template>
  <div>
    <div class="head">
      <p class="fl">
        <span>主维护人：{{ data.maintainerName }}</span>
        <span>客户姓名：{{ data.contactName }}</span>
      </p>
    </div>
    <a-table
      :rowKey="(record,index)=>{return index}"
      :loading="loading"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      @change="handleTableChange">
      <div slot="type" slot-scope="text">
        <template>
          {{ text }}
        </template>
      </div>
    </a-table>
  </div>
</template>

<script>
import { contactDetail } from '@/api/actor'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        this.id = val.contactId
        this.getTableData()
      }
    }
  },
  data () {
    return {
      loading: false,
      id: '',
      columns: [
        {
          title: '协作人',
          dataIndex: 'collaboratorName',
          align: 'center',
          width: 200
        },
        {
          title: '协作人所属机构',
          dataIndex: 'collaboratorDepartmentName',
          width: 80,
          align: 'left',
          scopedSlots: { customRender: 'collaboratorDepartmentName' }
        },
        {
          title: '协作人所属门店',
          dataIndex: 'collaboratorStoreName',
          align: 'left',
          width: 100,
          scopedSlots: { customRender: 'collaboratorStoreName' }
        },
        {
          title: '规则创建时间',
          dataIndex: 'ruleCreatedTime',
          align: 'center',
          width: 80
        },
        {
          title: '规则起始时间',
          dataIndex: 'ruleStartTime',
          align: 'center',
          width: 80
        },
        {
          title: '订单笔数',
          dataIndex: 'orderNum',
          align: 'center',
          width: 100
        },
        {
          title: '订单总额',
          dataIndex: 'totalAmount',
          align: 'center',
          width: 80
        },
        {
          title: '协作人佣金',
          dataIndex: 'collaboratorAmount',
          align: 'center',
          width: 100
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
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
        contactId: this.id
      }
      contactDetail(params).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.pagination.total = res.data.total
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
