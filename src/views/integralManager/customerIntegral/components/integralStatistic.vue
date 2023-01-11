<template>
  <div id="integral_statistic_container" ref="integral_statistic_container">
    <div class="allStatistic">
      <div class="allStatisticTitle">总体统计</div>
      <div class="searchLine">
        <div class="searchTitle">选择时间</div>
        <a-range-picker class="pickTimeClass"></a-range-picker>
        <a-button>查询</a-button>
        <a-button>重置</a-button>
      </div>
      <div class="statisticCardDiv">
        <div class="singleStatisticCard">
          <div class="cardTopClass">
            <div class="cardTopTitle">可用积分总额</div>
          </div>
          <div class="cardNumberClass">{{ totalInfo.integralTotal }}</div>
        </div>
        <div class="singleStatisticCard">
          <div class="cardTopClass">
            <div class="cardTopTitle">发放积分</div>
          </div>
          <div class="cardNumberClass">{{ totalInfo.allIntegralTotal }}</div>
        </div>
        <div class="singleStatisticCard">
          <div class="cardTopClass">
            <div class="cardTopTitle">消耗积分</div>
          </div>
          <div class="cardNumberClass">{{ totalInfo.consumptionIntegralTotal }}</div>
        </div>
      </div>
    </div>
    <div class="integralStatistic">
      <div class="integralStatisticTitle">积分明细</div>
      <div class="searchLine">
        <div class="singleSearch">
          <div class="singleSearchTitle">选择员工</div>
          <selectPersonnel
            class="selectPersonnelCom"
            name="请选择员工"
            :changeId="true"
            :num="1"
            v-model="employeeIds"
          />
        </div>
        <div class="singleSearch">
          <div class="singleSearchTitle">选择时间</div>
          <a-range-picker class="pickTimeClass"></a-range-picker>
        </div>
        <div class="singleSearch">
          <div class="singleSearchTitle">变动原因</div>
          <a-select class="pickSelectClass" placeholder="请选择"></a-select>
        </div>
        <div class="singleSearch">
          <div class="singleSearchTitle">商品名称</div>
          <div class="noGoodsClass">请选择商品</div>
        </div>
      </div>
      <div class="searchButtonLine">
        <a-button
          type="primary"
          style="margin: 0 10px;">查询</a-button>
        <a-button
          style="margin-right: 10px;"
        >重置</a-button>
        <a-button type="primary">导出</a-button>
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
      </a-table>
    </div>
    <goodsManager
      :isRadioStatus="false"
      :showStatus.sync="chooseGoodsManagerShowStatus"
      :permissionText="''"
      @submitConfirm="submitGoodsConfirm">
    </goodsManager>
  </div>
</template>

<script>
import goodsManager from './goodsManager.vue'
import { totalIntegralStatisticApi, integralDetailListApi, exportIntegralDetailListApi } from '@/api/integralManager'
export default {
  name: 'BackendIntegralStatistic',
  data () {
    return {
      // 总体数据统计
      totalInfo: {
        integralTotal: '2,290',
        allIntegralTotal: '5,700',
        consumptionIntegralTotal: '3,410'
      },
      chooseGoodsManagerShowStatus: false,
      employeeIds: [],
      // 表格加载效果
      tableLoading: false,
      // 表格数据
      tableData: [],
      tableColumns: [
        {
          title: '员工名称',
          dataIndex: 'employeeIdName',
          align: 'center',
          width: 200
        },
        {
          title: '交易时间',
          dataIndex: 'grantTime',
          align: 'center',
          width: 200
        },
        {
          title: '交易类型',
          dataIndex: 'tradeTypeName',
          align: 'center',
          width: 200
        },
        {
          title: '交易积分',
          dataIndex: 'realityTradeIntegral',
          align: 'center',
          width: 200
        },
        {
          title: '变动原因',
          dataIndex: 'changeReason',
          align: 'center',
          width: 200
        },
        {
          title: '交易前积分',
          dataIndex: 'changeCauseName',
          align: 'center',
          width: 200
        },
        {
          title: '交易后积分',
          dataIndex: 'afterIntegral',
          align: 'center',
          width: 200
        },
        {
          title: '理由',
          dataIndex: 'adjustCause',
          align: 'center',
          width: 200
        },
        {
          title: '操作人',
          dataIndex: 'createdEmployeeName',
          align: 'center',
          width: 200
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
  components: {
    goodsManager
  },
  mounted () {
    console.log('积分统计数据')
  },
  methods: {
    chooseGoods () {
      console.log('点击添加商品')
      this.chooseGoodsManagerShowStatus = true
    },
    submitGoodsConfirm (e) {
      console.log(e, '选择商品库返回')
    },
    // 获取积分统计总体数据
    getIntegralTotalData () {
      totalIntegralStatisticApi().then(response => {
        this.totalInfo = response.data
      })
    },
    // 获取积分统计列表数据
    async getTableData () {
      this.tableLoading = true
      const params = {
        employeeIdList: [],
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        ...this.searchInfo
      }
      // console.log(params, '查询数据提交接口的对象')
      await integralDetailListApi(params).then(response => {
        this.tableLoading = false
        console.log(response, '获取群SOP模板信息')
        this.tableData = response.data.list
        this.$set(this.pagination, 'total', Number(response.data.page.total))
        if (this.tableData.length === 0) {
          // 列表中没有数据
          if (this.pagination.total !== 0) {
            // 总数据有,但当前页没有
            // 重新将页码换成1
            this.$set(this.pagination, 'current', 1)
            this.getTableData()
          } else {
            // 是真没有数据
          }
        }
      }).catch(() => {
        this.tableLoading = false
      })
      // 临时接收假数据
      // this.tableData = getTempSopList()
    },
    // 导出数据
    exportData () {
      const params = {
        ...this.searchInfo
      }
      exportIntegralDetailListApi(params).then(response => {
        console.log(response)
      })
    },
    // 群SOP模板切换页码
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      console.log(sorter, 'sorter')
      if (sorter.order) {
        if (sorter.order === 'ascend') {
          this.sorter = 'asc'
        } else {
          this.sorter = 'desc'
        }
      } else {
        this.sorter = ''
      }
      // this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../css/integralStatistic.less');
</style>
