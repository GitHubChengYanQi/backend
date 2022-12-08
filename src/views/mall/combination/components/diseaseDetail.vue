<template>
  <div>
    <div class="head">
      <p class="fl">
        <span>主维护人：{{ data.maintainerName }}</span>
        <span>客户姓名：{{ data.contactName }}</span>
      </p>
      <p class="fr">
        <span>添加时间：{{ data.createdAt }}</span>
        <span>订单金额总计：{{ record.commissionAmount }}</span>
        <span>主维护人佣金总计：{{ record.maintainerAmount }}</span>
        <span>协作人佣金总计：{{ record.collaboratorAmount }}</span>
        <a-button
          type="primary"
          :loading="loading"
          @click="exportFn()">导出</a-button>
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
import { contactDetail, contactDetailStat, contactDetailExport } from '@/api/actor'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
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
        this.createdAt = val.createdAt
        this.getTableData()
        this.contactDetailStat()
      }
    }
  },
  data () {
    return {
      loading: false,
      id: '',
      createdAt: '',
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
        // {
        //   title: '规则创建时间',
        //   dataIndex: 'ruleCreatedTime',
        //   align: 'center',
        //   width: 80
        // },
        // {
        //   title: '规则起始时间',
        //   dataIndex: 'ruleStartTime',
        //   align: 'center',
        //   width: 80
        // },
        {
          title: '订单笔数',
          dataIndex: 'orderNum',
          sorter: true,
          align: 'center',
          width: 100
        },
        {
          title: '订单提成金额',
          dataIndex: 'orderCommissionAmount',
          align: 'center',
          width: 80
        },
        {
          title: '主维护人佣金',
          dataIndex: 'maintainerAmount',
          align: 'center',
          width: 100
        },
        {
          title: '协作人佣金',
          dataIndex: 'collaboratorAmount',
          align: 'center',
          width: 100
        }
      ],
      tableData: [],
      record: {},
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
     * 拉取统计数据
     */
    contactDetailStat () {
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        contactId: this.id
      }
      contactDetailStat(params).then(res => {
        this.record = res.data
      })
    },
    /**
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        contactId: this.id,
        sort: this.pagination.sort
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
      let orderSort = ''
      if (sorter.order == 'ascend') {
        orderSort = `${sorter.field}Asc`
      } else {
        orderSort = `${sorter.field}Desc`
      }
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.pagination.sort = orderSort
      this.getTableData()
      this.contactDetailStat()
    },
    /**
     * 导出
     */
    exportFn () {
      this.loading = true
      const param = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        contactId: this.id
      }
      contactDetailExport(param).then((res) => {
        this.loading = false
        callDownLoadByBlob(res, '客户协作人详情')
      })
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
    height:60px;
    .fl{
      float:left;
      span{
        margin-right:10px;
      }
    }
    .fr{
      float:right;
      span{
        margin-right:10px;
      }
    }
  }
</style>
