<template>
  <div id="integral_manager_container" ref="integral_manager_container">
    <div class="searchLine">
      <div class="searchItem">
        <div class="searcTitle">选择员工</div>
        <selectPersonnel
          class="selectPersonnelCom"
          name="请选择员工"
          :changeId="true"
          :num="1"
          v-model="employeeIds"
        />
      </div>
      <a-button
        type="primary"
        style="margin: 0 10px;"
      >查询</a-button>
      <a-button
        style="margin-right: 10px;"
      >重置</a-button>
      <a-button
        style="margin-right: 10px;"
      >导出</a-button>
    </div>
    <a-table
      :loading="tableLoading"
      :row-key="record => record.id"
      :data-source="tableData"
      :columns="tableColumns"
      :pagination="pagination"
      class="tableBox"
      :scroll="{ x: 1500}"
      @change="handleTableChange">
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: space-around;">
            <a-button type="link" @click="setIntegral(record)">调整积分</a-button>
          </div>
        </template>
      </div>
    </a-table>
  </div>
</template>

<script>
import { getTempIntegralManagerData } from '@/api/integralManager'
export default {
  name: 'BackendIntegralManager',

  data () {
    return {
      searchInfo: {},
      employeeIds: [],
      // 表格加载效果
      tableLoading: false,
      // 表格数据
      tableData: [],
      tableColumns: [
        {
          title: '员工名称',
          dataIndex: 'managerName',
          align: 'center',
          width: 200
        },
        {
          title: '积分余额',
          dataIndex: 'integralTotal',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '已发放积分',
          dataIndex: 'integralSend',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '已消耗积分',
          dataIndex: 'integralUse',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '已过期积分',
          dataIndex: 'integralOver',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '操作',
          align: 'center',
          width: 250,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      // 模板页面分页对象
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  created () {
    // // 获取缓存中的页码
    // const tempPage = sessionStorage.getItem('sopIntegralManagerPage')
    // this.$set(this.searchInfo, 'employeeIds', [])
    // if (tempPage) {
    //   this.$set(this.pagination, 'current', Number(tempPage))
    // } else {
    //   this.$set(this.pagination, 'current', 1)
    // }
    // this.getTableData()
    this.tableData = getTempIntegralManagerData()
  },

  methods: {
    // // 获取数据
    // async getTableData () {
    //   this.tableLoading = true
    //   const params = {
    //     sopName: this.searchInfo.sopName,
    //     idsStr: this.searchInfo.employeeIds.join(','),
    //     page: this.pagination.current,
    //     perPage: this.pagination.pageSize,
    //     sort: this.sorter
    //   }
    //   // console.log(params, '查询数据提交接口的对象')
    //   await getSopTemplateListMethod(params).then(response => {
    //     this.tableLoading = false
    //     console.log(response, '获取群SOP模板信息')
    //     this.tableData = response.data.list
    //     this.$set(this.pagination, 'total', Number(response.data.page.total))
    //     if (this.tableData.length === 0) {
    //       // 列表中没有数据
    //       if (this.pagination.total !== 0) {
    //         // 总数据有,但当前页没有
    //         // 重新将页码换成1
    //         this.$set(this.pagination, 'current', 1)
    //         this.getTableData()
    //       } else {
    //         // 是真没有数据
    //       }
    //     }
    //   }).catch(() => {
    //     this.tableLoading = false
    //   })
    //   // 临时接收假数据
    //   // this.tableData = getTempSopList()
    // },
    // // 群SOP模板切换页码
    // handleTableChange ({ current, pageSize }, filters, sorter) {
    //   this.pagination.current = current
    //   this.pagination.pageSize = pageSize
    //   console.log(sorter, 'sorter')
    //   if (sorter.order) {
    //     if (sorter.order === 'ascend') {
    //       this.sorter = 'asc'
    //     } else {
    //       this.sorter = 'desc'
    //     }
    //   } else {
    //     this.sorter = ''
    //   }
    //   this.getTableData()
    // },
    // // 搜索
    // goSearch () {
    //   // 重新将页码换成1
    //   this.$set(this.pagination, 'current', 1)
    //   this.getTableData()
    // },
    // // 重置
    // goReset () {
    //   // 重新将页码换成1
    //   this.$set(this.pagination, 'current', 1)
    //   this.searchInfo = {}
    //   this.$set(this.searchInfo, 'employeeIds', [])
    //   this.getTableData()
    // }
  }
}
</script>

<style lang="less" scoped>
@import url('../css/integralManager.less');
</style>
