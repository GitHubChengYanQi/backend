<template>
  <div class="fanDiagram">
    <v-chart class="chart" :options="options[type]" @click="getLink"></v-chart>
  </div>
</template>

<script>
/**
 * @param {Number} type 类型 0 扇形图 1 圆环 2 横柱状图 3 折线图带范围 4 折线图多条不带范围 5 多条柱状图
 * @param {Array} dataArr 数据 扇形图格式  0 ：[[数据名称, 数据]]  1 ：[[数据名称, 数据],[数据名称, 数据]] 第一个默认为圆环中心数据 2 [[数据名称, 数据]] 3 [[数据名称, 数据]]
 * @param {Object} dataObj 4,5 折线图多条不带范围数据 {
          xAxis: ['2021-1', '2021-2'],
          data:{
            'A片区': [200, 300, 400 ],
            'B片区': [230, 330, 430 ]
          }
        }
   @param {Function} getClick // 获取点击事件数据
 */

export default {
  name: 'FanDiagram',
  props: {
    type: {
      type: Number,
      default: 0
    },
    dataArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      options: {
        0: {
          color: ['#5CCDA1', '#5D8CEA', '#6F60DA', '#E8B520', '#5F708F'],
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const { data = {}, marker, percent } = params
              const { name, value } = data
              return `${marker}${name}:${value}(${percent})%`
            }
          },
          legend: {
            icon: 'circle',
            orient: 'horizontal',
            itemHeight: 10,
            data: [],
            x: 'center',
            y: 'bottom'
          },
          series: [
            {
              type: 'pie',
              radius: '40%',
              minAngle: 5,
              avoidLabelOverlap: true,
              data: [],
              label: {
                color: '#444444',
                fontSize: 14,
                formatter: '{d}%'
              }
            }
          ]
        },
        1: {
          color: ['#5D8CEA', '#EAEEEE'],
          series: [
            {
              type: 'pie',
              radius: ['80%', '100%'],
              data: [],
              silent: true,
              labelLine: {
                show: false
              },
              label: {
                normal: {// 默认不显示数据
                  show: false,
                  position: 'center',
                  color: '#333333'
                }
              }
            }
          ]
        },
        2: {
          grid: {
            left: '5%',
            right: '2%',
            width: '80%',
            bottom: '2%',
            top: '8%',
            containLabel: true
          },
          xAxis: {
            show: false,
            type: 'value'
          },
          yAxis: [
            {
              type: 'category',
              inverse: true,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            },
            {
              type: 'category',
              axisTick: 'none',
              inverse: true,
              axisLine: 'none',
              show: true,
              axisLabel: {
                align: 'right',
                verticalAlign: 'bottom',
                lineHeight: 32,
                textStyle: {
                  color: '#333',
                  fontSize: '16'
                }
              },
              // ------------------右侧展示的具体内容----------------------------
              data: []
            },
            {// 名称
              type: 'category',
              offset: -10,
              position: 'left',
              axisLine: {
                show: false
              },
              inverse: false,
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                color: ['#333'],
                align: 'left',
                verticalAlign: 'bottom',
                lineHeight: 32,
                fontSize: 16
              },
              // ------------------文字描述----------------------------
              data: []
            }
          ],
          series: [
            {
              zlevel: 1,
              silent: true,
              type: 'bar',
              barWidth: 10,
              animationDuration: 1500,
              itemStyle: {
                color: '#1890ff'
              },
              showBackground: true,
              backgroundStyle: {
                color: '#E4E4E4'
              },
              // ------------------数据及其样式----------------------------
              data: [],
              align: 'center'
            },
            {
              type: 'bar',
              silent: true,
              barWidth: 10,
              barGap: '-100%',
              margin: '20',
              // ------------------背景按最大值----------------------------
              data: [],
              textStyle: {
                // 图例文字的样式
                fontSize: 10,
                color: '#fff'
              },
              itemStyle: {
                normal: {
                  color: '#E4E4E4',
                  // width:"100%",
                  fontSize: 10
                }
              }
            }
          ]
        },
        3: {
          color: ['#55CB9C'],
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            top: '10%',
            left: '5%',
            right: '5%',
            bottom: '20%'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            offset: 10
          },
          yAxis: {
            type: 'value',
            boundaryGap: true,
            splitNumber: 2,
            min: 0,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            offset: 5
          },
          series: [
            {
              type: 'line',
              symbol: 'none',
              areaStyle: {
                color: '#C9E7DB'
              },
              data: [['2019-10-10', 200], ['2019-10-11', 500]]
            }
          ]
        },
        4: {
          color: ['#55CB9C', '#1890ff'],
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            top: '10%',
            left: '5%',
            right: '5%',
            bottom: '20%'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: ['111', '222'],
            offset: 10
          },
          yAxis: {
            type: 'value',
            min: 0,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            offset: 5
          },
          series: [
            {
              type: 'line',
              data: [200, 500]
            }
          ]
        },
        5: {
          color: ['#1890ff', '#55CB9C', '#586589', '#E8B215'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: '10%',
            left: '5%',
            right: '5%',
            bottom: '20%'
          },
          legend: {
            icon: 'rect',
            itemHeight: 14,
            itemWidth: 14,
            data: ['任务总数', '发送数', '超时发送数', '未发送数'],
            top: 'bottom'
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar', 'stack'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          xAxis: {
            type: 'category',
            axisTick: { show: false },
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '任务总数',
              type: 'bar',
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              barWidth: 20,
              data: [320, 332, 301, 334, 390]
            },
            {
              name: '发送数',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              barWidth: 20,
              data: [220, 182, 191, 234, 290]
            },
            {
              name: '超时发送数',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              barWidth: 20,
              data: [150, 232, 201, 154, 190]
            },
            {
              name: '未发送数',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              barWidth: 20,
              data: [98, 77, 101, 99, 40]
            }
          ]
        }
      }
    }
  },
  watch: {
    dataArr (val) {
      this.setOptions(val)
    },
    dataObj (val) {
      if (this.type == 4) {
        this.line(this.dataObj)
      } else {
        this.columnar(this.dataObj)
      }
    },
    type (val) {
      if (this.type == 4) {
        this.line(this.dataObj)
      } else if (this.type == 5) {
        this.columnar(this.dataObj)
      } else {
        this.setOptions(this.dataArr)
      }
    }
  },
  created () {
    if (this.type == 4 || this.type == 5) {
      if (this.type == 4) {
        this.line(this.dataObj)
      } else {
        this.columnar(this.dataObj)
      }
    } else {
      this.setOptions(this.dataArr)
    }
  },
  methods: {
    setOptions (arr) {
      if (this.type == 0 || this.type == 1) {
        this.sector(arr)
      } else if (this.type == 2) {
        this.across(arr)
      } else if (this.type == 3) {
        this.line(arr)
      }
    },
    sector (arr) {
      const newArr = arr.map((item, index) => {
        const obj = {}
        obj.name = item[0]
        obj.value = item[1]
        if (this.type == 1 && index == 0) {
          obj.label = {
            show: true, // 单独显示该数据项
            formatter: '{b}:{c}\n{d}%'
          }
        }
        return obj
      })
      if (this.type == 0) {
        this.options[this.type].legend.data = newArr.map(item => { return item.name })
      }
      this.options[this.type].series[0].data = newArr
    },
    across (arr) {
      const titleArr = arr.map(item => { return item[0] })
      const dataArr = arr.map(item => { return item[1] })
      this.options[this.type].yAxis[1].data = dataArr
      this.options[this.type].yAxis[2].data = titleArr
      this.options[this.type].series[0].data = dataArr
      this.options[this.type].series[1].data = arr.map(item => {
        return this.sum(dataArr)
      })
    },
    line (data = []) {
      if (this.type == 3) {
        this.options[this.type].series[0].data = data
      } else {
        this.options[this.type].xAxis.data = data.xAxis
        const arr = []
        for (const key in data.data) {
          const obj = {}
          obj.name = key
          obj.type = 'line'
          obj.data = data.data[key]
          arr.push(obj)
        }
        this.options[this.type].series = arr
      }
    },
    columnar (data) {
      this.options[this.type].xAxis.data = data.xAxis
      this.options[this.type].xAxis.data = data.xAxis
      const arr = []
      const titleArr = []
      for (const key in data.data) {
        const obj = {}
        obj.name = key
        obj.type = 'bar'
        obj.barGap = 0
        obj.barWidth = 20
        obj.emphasis = {
          focus: 'series'
        }
        obj.data = data.data[key]
        titleArr.push(key)
        arr.push(obj)
      }
      this.options[this.type].legend.data = titleArr
      this.options[this.type].series = arr
      console.log(this.options[this.type])
    },
    sum (arr) {
      var s = 0
      arr.forEach(val => {
        s += val
      }, 0)
      return s
    },
    getLink (e) {
      this.$emit('getClick', e)
    }
  }
}
</script>

<style lang="less" scoped>
.fanDiagram {
  width: 100%;
  height: 100%;
  .chart {
    min-width: 200px;
    min-height: 100px;
    width: 100%;
    height: 100%;
  }
}
</style>
