<template>
  <div id="integral_statistic_container" ref="integral_statistic_container">
    <div class="allStatistic">
      <div class="allStatisticTitle">总体统计</div>
      <div class="searchLine">
        <div class="searchTitle">选择时间</div>
        <a-range-picker class="pickTimeClass" v-model="totalDateArray" :format="dateFormatList"></a-range-picker>
        <a-button
          type="primary"
          style="margin: 0 10px;"
          @click="goSearchTotalData"
          v-permission="'/creditsEmployeeLog/employeeIntegralAll@get'"
        >查询</a-button>
        <a-button @click="goResetTotalData" v-permission="'/creditsEmployeeLog/employeeIntegralAll@get'">重置</a-button>
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
            v-model="searchDetailInfo.employeeIdList"
          />
        </div>
        <div class="singleSearch">
          <div class="singleSearchTitle">选择时间</div>
          <a-range-picker class="pickTimeClass" v-model="detailDateArray" :format="dateFormatList" @change="changeDetailDate"></a-range-picker>
        </div>
        <div class="singleSearch">
          <div class="singleSearchTitle">变动原因</div>
          <a-select
            :allowClear="true"
            class="pickSelectClass"
            placeholder="请选择"
            mode="multiple"
            v-model="searchDetailInfo.changeCauseList"
            :maxTagCount="2"
            :maxTagPlaceholder="`+${searchDetailInfo.changeCauseList.length - 2}`">
            <a-select-option v-for="item in reasonList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
          </a-select>
        </div>
        <div class="singleSearch">
          <div class="singleSearchTitle">商品名称</div>
          <!-- <div class="noGoodsClass" @click="chooseGoods">请选择商品</div> -->
          <div class="goodsContentDiv" @click="chooseGoods">
            <div v-if="goodsList.length === 0" class="noGoodsDiv">请选择商品</div>
            <div v-else class="tagDiv">
              <div v-for="item in goodsList.slice(0,1)" :key="item.id" class="singleTagDiv">
                <!-- {{ item.name }} -->
                {{ item.name.length > 2 ? item.name.slice(0, 2) + '...' : item.name }}
                <div class="delete" @click.stop="deleteSingleTag(item)">+</div>
              </div>
              <div v-if="goodsList.length > 1" class="singleTagDiv">{{ `+${goodsList.length - 1}` }}</div>
              <div v-if="goodsList.length !== 0" class="clearTagDiv" @click.stop="clearTagMethod">X</div>
            </div>
          </div>
        </div>
      </div>
      <div class="searchButtonLine">
        <a-button
          type="primary"
          style="margin: 0 10px;"
          @click="searchDetailMethod"
          v-permission="'/creditsEmployeeLog/employeeIntegralPage@post'"
        >查询</a-button>
        <a-button
          style="margin-right: 10px;"
          @click="resetDetailMethod"
          v-permission="'/creditsEmployeeLog/employeeIntegralPage@post'"
        >重置</a-button>
        <a-button
          type="primary"
          @click="exportDetailData"
          v-permission="'/creditsEmployeeLog/employeeIntegralExcel@post'"
        >导出</a-button>
      </div>
      <a-table
        :loading="tableLoading"
        :row-key="record => record.id"
        :data-source="tableData"
        :columns="tableColumns"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedKeyList, onChange: onSelectionChange }"
        class="tableBox"
        :scroll="{ x: 1500}"
        @change="handleTableChange">
        <div slot="adjustCause" slot-scope="text">
          <a-popover title="理由" v-if="text !== ''&& text.length > 10">
            <template slot="content">
              <div class="labelBox">
                {{ text }}
              </div>
            </template>
            <div>{{ text.slice(0, 10) + '...' }}</div>
          </a-popover>
          <div v-else-if="text !== ''&& text.length <= 10">{{ text }}</div>
          <div v-else>-</div>
        </div>
        <div slot="createdEmployeeName" slot-scope="text, record">
          <template>
            {{ record.createdEmployeeName ? record.createdEmployeeName : '-' }}
          </template>
        </div>
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
import { deepClonev2 } from '@/utils/util'
import moment from 'moment'
import goodsManager from './goodsManager.vue'
import { getDict } from '@/api/common'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
import { totalIntegralStatisticApi, integralDetailListApi, exportIntegralDetailListApi } from '@/api/integralManager'
export default {
  name: 'BackendIntegralStatistic',
  data () {
    return {
      // 商品库选择后显示标签数组
      goodsList: [],
      selectedKeyList: [],
      deepClonev2,
      // 总体时间组件绑定数组
      totalDateArray: [],
      // 积分明细时间组件绑定数组
      detailDateArray: [],
      // 变动原因列表
      reasonList: [],
      dateFormatList: ['YYYY-MM-DD', 'YYYY-MM-DD'],
      // 总体数据统计
      totalInfo: {
        integralTotal: '2,290',
        allIntegralTotal: '5,700',
        consumptionIntegralTotal: '3,410'
      },
      // 查询总体数据对象
      searchTotalInfo: {},
      // 查询积分明细数据对象
      searchDetailInfo: {},
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
          dataIndex: 'changeCauseName',
          align: 'center',
          width: 200
        },
        {
          title: '交易前积分',
          dataIndex: 'beforeIntegral',
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
          scopedSlots: { customRender: 'adjustCause' },
          width: 200
        },
        {
          title: '操作人',
          dataIndex: 'createdEmployeeName',
          align: 'center',
          scopedSlots: { customRender: 'createdEmployeeName' },
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
  created () {
    console.log('积分统计数据')
    this.getIntegralTotalData()
    this.getChangeCauseList()
    this.$set(this.searchDetailInfo, 'employeeIdList', [])
    this.$set(this.searchDetailInfo, 'changeCauseList', [])
    this.detailDateArray = []
    this.goodsList = []
    // this.$set(this.searchDetailInfo, 'changeCauseList', [])
    // this.$set(this.searchDetailInfo, 'goodsIdList', [])
    this.getTableData()
  },
  methods: {
    // 单击某一行的回调
    onSelectionChange (selectedRowKeys) {
      console.log(selectedRowKeys, '单击某一行的回调')
      // this.sendArray = record.listTaskInfo
      // const tempIdArray = []
      // tempIdArray.push(record.id)
      // this.selectedList = Object.assign([], tempIdArray)
      this.selectedKeyList = selectedRowKeys
    },
    // 获取积分统计总体数据
    getIntegralTotalData () {
      if (this.totalDateArray.length === 0) {
        console.log('无搜索日期', this.searchTotalInfo)
        this.$delete(this.searchTotalInfo, 'beginTime')
        this.$delete(this.searchTotalInfo, 'endTime')
      } else {
        this.$set(this.searchTotalInfo, 'beginTime', moment(this.totalDateArray[0]._d).format('YYYY-MM-DD HH:mm:ss'))
        this.$set(this.searchTotalInfo, 'endTime', moment(this.totalDateArray[1]._d).format('YYYY-MM-DD HH:mm:ss'))
      }
      console.log(this.searchTotalInfo, '请求接口前验证')
      totalIntegralStatisticApi(this.searchTotalInfo).then(response => {
        this.totalInfo = response.data
      })
    },
    // 获取变动原因列表 integra_change_cause
    getChangeCauseList () {
      const params = { dictType: 'integra_change_cause' }
      getDict(params).then(response => {
        this.reasonList = response.data
      })
    },
    // 获取积分统计列表数据
    async getTableData () {
      this.tableLoading = true
      // 设置时间段字段
      if (this.detailDateArray.length === 0) {
        this.$delete(this.searchDetailInfo, 'beginTime')
        this.$delete(this.searchDetailInfo, 'endTime')
      } else {
        this.$set(this.searchDetailInfo, 'beginTime', moment(this.detailDateArray[0]._d).format('YYYY-MM-DD HH:mm:ss'))
        this.$set(this.searchDetailInfo, 'endTime', moment(this.detailDateArray[1]._d).format('YYYY-MM-DD HH:mm:ss'))
      }
      if (this.goodsList.length === 0) {
        this.$set(this.searchDetailInfo, 'goodsIdList', [])
      } else {
        this.$set(this.searchDetailInfo, 'goodsIdList', this.goodsList.map(item => item.id))
      }
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        ...this.searchDetailInfo
      }
      console.log(params, '提交前查看传值是否准确')
      // debugger
      // console.log(params, '查询数据提交接口的对象')
      await integralDetailListApi(params).then(response => {
        this.tableLoading = false
        console.log(response, '获取积分明细列表')
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
    // 数据统计切换页码
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
      this.getTableData()
    },
    // 改变积分明细查询数据时间段
    changeDetailDate (e) {
      // console.log(e[0], e[1], '总体时间段回调')
      // let tempArray = this.deepClonev2(e)
      console.log(this.detailDateArray, '积分明细时间段改变回调')
    },
    // 清空商品库选择
    clearTagMethod () {
      this.goodsList = []
    },
    // 删除商品库选择单个标签
    deleteSingleTag (item) {
      const deleteIndex = this.goodsList.findIndex(info => info.id === item.id)
      this.goodsList.splice(deleteIndex, 1)
    },
    // 点击总体数据查询按钮
    goSearchTotalData () {
      console.log('点击总体数据查询按钮')
      this.getIntegralTotalData()
    },
    // 点击总体数据重置按钮
    goResetTotalData () {
      console.log('点击总体数据重置按钮')
      this.totalDateArray = []
      this.getIntegralTotalData()
    },
    // 点击添加商品
    chooseGoods () {
      console.log('点击添加商品')
      this.chooseGoodsManagerShowStatus = true
    },
    // 商品库回调
    submitGoodsConfirm (e) {
      console.log(e, '选择商品库返回')
      for (const item of e) {
        if (this.goodsList.length !== 0) {
          const tempIndex = this.goodsList.findIndex(info => info.id === item.id)
          if (tempIndex === -1) {
            this.goodsList.push(item)
          }
        } else {
          this.goodsList.push(item)
        }
      }
      // this.goodsList = this.deepClonev2(e)
    },
    // 点击搜索积分明细
    searchDetailMethod () {
      this.$set(this.pagination, 'current', 1)
      console.log(this.searchDetailInfo, '点击搜索积分明细')
      this.getTableData()
    },
    // 点击重置积分明细搜索
    resetDetailMethod () {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.searchDetailInfo, 'employeeIdList', [])
      this.$set(this.searchDetailInfo, 'changeCauseList', [])
      this.detailDateArray = []
      this.goodsList = []
      console.log(this.searchDetailInfo, '点击重置积分明细搜索')
      this.getTableData()
    },
    // 导出积分明细数据
    exportDetailData () {
      // this.searchDetailInfo
      // selectedKeyList
      // const checkedIncreaseIdList = this.selectedKeyList.filter(item => item.changeCause === '1' ||
      //   item.changeCause === '2' || item.changeCause === '3' || item.changeCause === '4' || item.changeCause === '5')
      // const checkedDecreaseIdList = this.selectedKeyList.filter(item => item.changeCause === '6' ||
      //   item.changeCause === '7' || item.changeCause === '8' || item.changeCause === '9')
      const tempArray = this.tableData.filter(item => this.selectedKeyList.indexOf(item.id) !== -1)
      console.log(tempArray)
      const checkedIncreaseIdList = tempArray.filter(item => item.changeCause === '1' ||
        item.changeCause === '2' || item.changeCause === '3' || item.changeCause === '4' || item.changeCause === '5').map(info => info.id)
      const checkedDecreaseIdList = tempArray.filter(item => item.changeCause === '6' ||
        item.changeCause === '7' || item.changeCause === '8' || item.changeCause === '9').map(info => info.id)
      this.$set(this.searchDetailInfo, 'checkedIncreaseIdList', checkedIncreaseIdList)
      this.$set(this.searchDetailInfo, 'checkedDecreaseIdList', checkedDecreaseIdList)
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        ...this.searchDetailInfo
      }
      console.log(this.searchDetailInfo, '积分明细导出')
      debugger
      exportIntegralDetailListApi(params).then(response => {
        console.log(response)
        callDownLoadByBlob(response, '积分明细')
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../css/integralStatistic.less');
</style>
