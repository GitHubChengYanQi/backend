<!-- 问卷统计 -->
<template>
  <div>
    <a-card>
      <Space>
        <a-radio-group v-model="dateType" button-style="solid" @change="radioChange">
          <a-radio-button value="1">
            最近一年
          </a-radio-button>
          <a-radio-button value="2">
            最近一月
          </a-radio-button>
          <a-radio-button value="3">
            最近一周
          </a-radio-button>
        </a-radio-group>
        <a-range-picker v-model="times" @change="onChange" />
      </Space>
      <a-spin :spinning="chartLoading">
        <div class="chrats-content">
          <v-chart style="width: 100%;" :options="options" ref="chars"></v-chart>
        </div>
      </a-spin>
      <div class="table-content">
        <div class="title">详细数据</div>
        <a-table
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange">
          <!-- eslint-disable-next-line-->
          <div slot="percentage" slot-scope="percentage, record">
            <div>{{ (record.doneCount / record.allCount * 100).toFixed(0) }}%</div>
          </div>
        </a-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { Space } from 'ant-design-vue'
import { taskDetailTaskView, taskDetailTaskViewList } from '@/api/healthManage'
import moment from 'moment'
export default {
  components: {
    Space
  },
  data () {
    return {
      dateType: '3',
      times: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      loading: false,
      chartLoading: false,
      tableData: [],
      columns: [
        {
          title: '日期',
          dataIndex: 'date',
          key: 'date',
          align: 'center'
        },
        {
          title: '应随访问卷数量',
          dataIndex: 'allCount',
          key: 'allCount',
          align: 'center'
        },
        {
          title: '实际完成随访问卷数量',
          dataIndex: 'doneCount',
          key: 'doneCount',
          align: 'center'
        },
        {
          title: '完成率',
          dataIndex: 'percentage',
          key: 'percentage',
          align: 'center',
          scopedSlots: { customRender: 'percentage' }
        }
      ],
      options: {
        grid: {
        },
        tooltip: {
          trigger: 'axis',
          padding: 20,
          backgroundColor: '#ffffff',
          borderColor: '#d9d9d9',
          textStyle: {
            color: 'black', // 设置文字颜色
            lineHeight: 18,
            height: 20
          }
        },
        color: ['rgba(115,160,250,0.8)', 'rgba(115,222,179,0.8)'],
        legend: {
          data: ['应随访问卷数量', '实际完成问卷数量']
        },
        xAxis: {
          type: 'category',
          data: [],
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '应随访问卷数量',
            type: 'bar',
            barWidth: 35,
            data: []
          },
          {
            name: '实际完成问卷数量',
            type: 'bar',
            barWidth: 35,
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    this.getList()
    this.getChart()
  },
  methods: {
    onChange () {
      this.dateType = ''
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getChart()
      this.getList()
    },
    radioChange () {
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getChart()
      this.getList()
    },
    // 列表
    async getList () {
      this.loading = true
      const { data } = await taskDetailTaskView({
        page: this.pagination.current,
        size: this.pagination.pageSize
      }, {
        dateType: this.dateType,
        times: this.times
      })
      this.tableData = data.data.records
      this.pagination.total = data.data.total
      this.loading = false
    },
    async getChart () {
      this.chartLoading = true
      const { data } = await taskDetailTaskViewList({
        dateType: this.dateType,
        times: this.times
      })
      this.options.series[0].data = data.data.allCounts
      this.options.series[1].data = data.data.doneCounts
      this.options.xAxis.data = data.data.dates
      this.chartLoading = false
    },

    /**
         * 表格监听事件
         */
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.sorter = sorter
      this.getList()
    },
    timeFormat (e) {
      return moment(e).format('YYYY-MM')
    }
  }
}
</script>
<style lang="less" scoped>
.chrats-content {
    margin: 30px 20px 0 20px;
    width: calc(100% - 40px);
    height: 447px;
    border: 1px solid #d9d9d9;
    padding-top: 40px;
}

.table-content {
    .title {
        font-size: 18px;
        color: #7f7f7f;
        padding: 25px 0;
    }
}
</style>
<style>
.tooltipContent {
    width: 200px;
    height: 125px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    background-color: #ffffff;
}
</style>
