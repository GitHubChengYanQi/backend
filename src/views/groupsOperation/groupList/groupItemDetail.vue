<template>
  <div class="groupOperation_itemDetail-page-container">
    <div class="cardsBox">
      <div class="cardItem card1">
        <span class="til">
          今日新增成员数
        </span>
        <span class="num">{{ cardData.addIntoNum || 0 }}</span>
      </div>
      <div class="cardItem card2">
        <span class="til">
          今日退群成员数
        </span>
        <span class="num">{{ cardData.quitNum || 0 }}</span>
      </div>
      <div class="cardItem card3">
        <span class="til">
          当前群成员数
        </span>
        <span class="num">{{ cardData.curNum || 0 }}</span>
      </div>
      <div class="cardItem card4">
        <span class="til">
          累计退群成员数
        </span>
        <span class="num">{{ cardData.totalNum || 0 }}</span>
      </div>
    </div>
    <div class="echartsContainer">
      <div class="searchLine">
        <div class="item">
          <span class="label">选择日期</span>
          <a-range-picker
            dropdownClassName="groupOperation_itemDetail-page-container_rangePickerDropdown"
            v-model="echartDate"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :ranges="searchDateItemRanges"
            :disabled-date="e => disabledBeforeDate(e, 'date', true)"
            :disabled-time="e => disabledBeforeDate(e, 'time', true)"
            :allowClear="true"
            @change="handleRangePicker"
            @ok="handleSearch" />
        </div>
      </div>
      <div class="echartsBox">
        <div class="switchLineType">
          <div
            v-for="(item, index) in lineArrs"
            :class="index === selectLineType ? 'items' : 'items disabled'"
            :key="index"
            @click="selectLineType = index">
            <div class="dot" :style="`background: rgb(${item.theme});`"></div>{{ item.name }}
          </div>
        </div>
        <v-chart style="width: 100%;" :options="defaultEchartOptions" ref="chart"></v-chart>
      </div>
    </div>
    <div class="detailTableDataBox">
      <div class="title">详细数据</div>
      <a-table
        class="tableBox"
        :row-key="record => record.id"
        :data-source="tableData"
        :columns="tableColumns"
        :pagination="pagination"
        @change="handleTableChange">
      </a-table>
    </div>
  </div>
</template>

<script>
import { disabledBeforeDate, searchDateItemRanges, chartDefaultOptions, returnChartData } from '../groupUtils'
import { getGroupDetailTopInfoReq, getItemChartInfoReq, getItemChartdaysReq } from '@/api/groupsOperation'
import { deepClonev2 } from '@/utils/util'

const dayNum = 1000 * 60 * 60 * 24
const maxDayNum = dayNum * 365 // 最大搜索天数不超过一年
export default {
  name: '',
  components: {},
  data () {
    return {
      cardData: {},
      echartDate: [],
      selectLineType: 0,
      lineArrs: [
        {
          theme: '43 111 253',
          name: '新增成员'
        },
        {
          theme: '244 176 62',
          name: '离开成员'
        }
      ],
      searchDateItemRanges,
      disabledBeforeDate,
      defaultEchartOptions: chartDefaultOptions,
      tableColumns: [
        {
          title: '时间',
          dataIndex: 'day',
          align: 'center',
          width: '20%'
        },
        {
          title: '新增成员数',
          dataIndex: 'add_into_num',
          align: 'center',
          width: '20%'
        },
        {
          title: '退群人数',
          dataIndex: 'quit_num',
          align: 'center',
          width: '20%'
        },
        {
          title: '当前群成员数',
          dataIndex: 'cur_num',
          align: 'center',
          width: '20%'
        },
        {
          title: '累计退群成员数',
          dataIndex: 'total_num',
          align: 'center',
          width: '20%'
        }
      ],
      tableData: [],
      // 分页对象
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
  computed: {},
  watch: {
    selectLineType (e) {
      this.chartLineChange(e)
    }
  },
  created () {
    const id = this.$route.query.id
    this.getFirstData(id)
    this.getChartData(id)
    // this.getTableList()
  },
  methods: {
    async getFirstData (id) {
      const { data } = await getGroupDetailTopInfoReq({ id })
      this.cardData = data
    },
    handleSearch () {
      this.getChartData()
    },
    async getChartData () {
      const id = this.$route.query.id
      const [starttime, endtime] = this.echartDate
      // let timeType = '1'
      const targetNum = new Date(endtime).valueOf() - new Date(starttime).valueOf()
      if (targetNum > maxDayNum) {
        this.$message.warn('日期区间最多选择一年!')
        return
      }
      if (targetNum < dayNum) {
        // timeType = '2'
      }
      const obj = {
        roomid: id,
        // time_type: timeType,
        starttime,
        endtime,
        data_type: this.selectLineType + 1
      }
      const { data } = await getItemChartInfoReq(obj)
      const { xName, xData } = returnChartData(data.days)
      const oldD = deepClonev2(this.defaultEchartOptions)
      oldD.xAxis[0].data = xName
      oldD.series[0].data = xData
      this.defaultEchartOptions = oldD
      console.log(xName, xData, 'obj', data)
      this.getTableList()
    },
    chartLineChange (index) {
      const { theme, name } = this.lineArrs[index]
      this.defaultEchartOptions.series[0].name = name
      this.defaultEchartOptions.series[0].lineStyle.color = `rgb(${theme})`
      this.defaultEchartOptions.series[0].itemStyle.color = `rgb(${theme})`
      this.handleSearch()
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableList()
    },
    async getTableList () {
      const id = this.$route.query.id
      const { current, pageSize } = this.pagination
      const [starttime, endtime] = this.echartDate
      const obj = {
        roomid: id,
        starttime,
        endtime,
        current,
        size: pageSize,
        data_type: this.selectLineType + 1
      }
      const { data } = await getItemChartdaysReq(obj)
      this.tableData = data.datas
      this.pagination.total = data.total
    },
    handleRangePicker (_, values) {
      this.echartDate = values
      if (!values[0] && !values[1]) {
      // 清空
        this.handleSearch()
      }
    }
  }
}
</script>
<style lang='less'>
.groupOperation_itemDetail-page-container_rangePickerDropdown {
  .ant-calendar-footer {
    padding: 0 6px;
  }
}
</style>
<style lang='less' scoped>
@import './groupItemDetail.less';
</style>
