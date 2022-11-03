<template>
  <div class="statistics">
    <div class="card mb16">
      <div class="flex mb16">
        <span>渠道码：</span>
        <a-select
          v-model="code.current"
          style="width: 180px;"
          @change="codeSwitchChange"
        >
          <a-select-option
            :value="v.id"
            v-for="v in code.list"
            :key="v.id"
          >
            {{ v.name }}
          </a-select-option>
        </a-select>
        <a-spin class="ml16" v-if="loading.chart"/>
      </div>
      <div class="flex">
        <div class="data-panel mr32">
          <div class="data">
            <div class="item">
              <div class="count">{{ data.chart.form.addNum }}</div>
              <div class="desc">今日添加客户数(人)</div>
            </div>
            <div class="item">
              <div class="count">{{ data.chart.form.deleteNum }}</div>
              <div class="desc">今日流失客户数(人)</div>
            </div>
          </div>
        </div>
        <div class="data-panel">
          <div class="data">
            <div class="item">
              <div class="count">{{ data.chart.form.totalAdd }}</div>
              <div class="desc">总添加客户数(人)</div>
            </div>
            <div class="item">
              <div class="count">{{ data.chart.form.totalLoss }}</div>
              <div class="desc">总流失客户数(人)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb16">
      <div class="card-title">
        图表数据
      </div>
      <div class="mb16">
        <a-radio-group v-model="data.chart.countType">
          <a-radio-button :value="0">新增客户数</a-radio-button>
          <a-radio-button :value="1">净增客户数</a-radio-button>
          <a-radio-button :value="2">流失客户数</a-radio-button>
        </a-radio-group>
      </div>
      <div class="mb16">
        <div class="flex-between">
          <div class="left">
            <a-select class="mr16" v-model="data.chart.dateType" style="width: 105px;">
              <a-select-option :value="0">今日</a-select-option>
              <a-select-option :value="1">近一周</a-select-option>
              <a-select-option :value="2">近一月</a-select-option>
            </a-select>
            <a-range-picker
              class="mr16"
              v-model="data.chart.time"
              style="width: 210px;"
            />
          </div>
          <div class="right">
            <a-button @click="resetChart">重置</a-button>
          </div>
        </div>
      </div>
      <div class="chart-box">
        <div id="chart"/>
      </div>
    </div>

    <div class="card">
      <div class="card-title">
        表格数据
      </div>
      <a-table
        :columns="table.date.col"
        :data-source="table.date.data"
        :pagination="false"
        :loading="loading.table"
        bordered
      />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getCodeList, getStatistics, getStatisticsTable } from '@/api/channelCodeNew'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'

export default {
  data () {
    return {
      table: {
        date: {
          col: [
            {
              title: '日期',
              dataIndex: 'time'
            },
            {
              title: '新增人数',
              dataIndex: 'addNumRange'
            },
            {
              title: '净增人数',
              dataIndex: 'netNumRange'
            },
            {
              title: '流失人数',
              dataIndex: 'defriendNumRange'
            }
          ],
          data: []
        }
      },
      data: {
        chart: {
          countType: 0,
          dateType: 1,
          time: [
            moment(moment().subtract('days', 6).format('YYYY-MM-DD')),
            moment(moment().format('YYYY-MM-DD'))
          ],
          form: {
            addNum: '-',
            deleteNum: '-',
            totalAdd: '-',
            totalLoss: '-',
            list: []
          },
          curChartData: {
            date: [],
            count: []
          }
        }
      },
      code: {
        list: [],
        current: '-'
      },
      loading: {
        chart: true,
        table: true
      }
    }
  },
  mounted () {
    this.getCodeList()

    window.tabChange = e => {
      if (e === 0) this.$router.push('/channelCode/index')
    }
  },
  watch: {
    'data.chart.dateType' () {
      if (this.data.chart.dateType === 0) {
        this.data.chart.time = [
          moment(moment().format('YYYY-MM-DD')),
          moment(moment().format('YYYY-MM-DD'))
        ]

        return false
      }

      if (this.data.chart.dateType === 1) {
        this.data.chart.time = [
          moment(moment().subtract('days', 6).format('YYYY-MM-DD')),
          moment(moment().format('YYYY-MM-DD'))
        ]

        return false
      }

      if (this.data.chart.dateType === 2) {
        this.data.chart.time = [
          moment(moment().format('YYYY-MM-DD')).startOf('month'),
          moment(moment().format('YYYY-MM-DD'))
        ]

        return false
      }
    },
    'data.chart.time': {
      deep: true,
      handler: function () {
        this.getChartData()
        this.getTableData()
      }
    }
  },
  methods: {
    codeSwitchChange () {
      this.getChartData()
      this.getTableData()
    },

    getChartData () {
      this.loading.chart = true

      getStatistics({
        channelCodeId: this.code.current,
        type: 1,
        startTime: this.data.chart.time ? moment(this.data.chart.time[0]).format('YYYY-MM-DD') : '',
        endTime: this.data.chart.time ? moment(this.data.chart.time[1]).format('YYYY-MM-DD') : ''
      }).then(res => {
        this.data.chart.form = res.data
        this.loading.chart = false
        this.setChartData()
      })
    },

    getTableData () {
      this.loading.table = true

      getStatisticsTable({
        channelCodeId: this.code.current,
        type: 1,
        page: 1,
        perPage: 10000,
        startTime: this.data.chart.time ? moment(this.data.chart.time[0]).format('YYYY-MM-DD') : '',
        endTime: this.data.chart.time ? moment(this.data.chart.time[1]).format('YYYY-MM-DD') : ''
      }).then(res => {
        this.loading.table = false
        this.table.date.data = res.data.list
      })
    },

    getCodeList () {
      getCodeList({
        page: 1,
        perPage: 500
      }).then(res => {
        this.code.list = res.data.list

        if (this.$route.query.id) {
          this.code.current = parseInt(this.$route.query.id)
        } else {
          this.code.current = this.code.list[0].id
        }

        this.getChartData()
        this.getTableData()
      })
    },

    resetChart () {
      this.data.chart.dateType = 1
      this.data.chart.time = [
        moment(moment().format('YYYY-MM-DD')).startOf('week'),
        moment(moment().format('YYYY-MM-DD'))
      ]
    },

    setChartData () {
      const map = {
        0: 'addNumRange',
        1: 'netNumRange',
        2: 'defriendNumRange'
      }

      const date = []
      const count = []

      this.data.chart.form.list.forEach(v => {
        date.push(v.time)
        count.push(v[map[this.data.chart.countType]])
      })

      this.data.chart.curChartData.date = date
      this.data.chart.curChartData.count = count

      this.initChart()
    },

    initChart () {
      const lineX = this.data.chart.curChartData.date
      const value = this.data.chart.curChartData.count

      const myChart = echarts.init(document.getElementById('chart'))

      const charts = {
        unit: '数量',
        names: [''],
        lineX,
        value: [
          value
        ]
      }
      const color = ['rgba(91, 142, 251', 'rgba(91, 142, 251']
      const lineY = []

      for (let i = 0; i < charts.names.length; i++) {
        let x = i
        if (x > color.length - 1) {
          x = color.length - 1
        }
        const data = {
          name: charts.names[i],
          type: 'line',
          color: color[x] + ')',
          smooth: true,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: color[x] + ', 0.8)'
              }, {
                offset: 0.8,
                color: color[x] + ', 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          symbol: 'circle',
          symbolSize: 6,
          data: charts.value[i]
        }
        lineY.push(data)
      }

      const option = {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: charts.names,
          textStyle: {
            fontSize: 12,
            color: '#000'
          },
          right: '4%'
        },
        grid: {
          top: '14%',
          left: '4%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: charts.lineX,
          axisLabel: {
            textStyle: {
              color: '#000'
            },
            formatter: function (params) {
              return params.split(' ')[0]
            }
          }
        },
        yAxis: {
          name: charts.unit,
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#000'
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: lineY
      }

      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.data-panel {
  display: flex;
  align-items: center;
  justify-content: center;

  .data {
    width: 400px;
    height: 120px;
    background: #fbfdff;
    border: 1px solid #daedff;
    padding: 31px 16px;
    margin-right: 25px;
    display: flex;
    align-items: center;

    .item {
      flex: 1;
      border-right: 1px solid #e9e9e9;

      .count {
        font-size: 24px;
        font-weight: 500;
        text-align: center;
      }

      .desc {
        font-size: 13px;
        text-align: center;
      }

      &:last-child {
        border-right: 0;
      }
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.card-title {
  color: #333;
  line-height: 24px;
  font-size: 17px;
  margin-bottom: 16px;
}

.chart, #chart {
  width: 100%;
  height: 372px;

  canvas {
    width: 100%;
  }
}

.chart {
  position: relative;
  left: -15px;
}
</style>
