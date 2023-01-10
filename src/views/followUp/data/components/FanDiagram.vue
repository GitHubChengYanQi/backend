<template>
  <div class="fanDiagram">
    <v-chart class="chart" :options="options[type]"></v-chart>
  </div>
</template>

<script>
export default {
  name: 'FanDiagram',
  props: {
    type: {
      type: Number,
      default: 0
    },
    titleArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataArr: { // ["北京公司", 3]
      type: Array,
      default: () => {
        return []
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
            orient: 'vertical',
            bottom: 'left',
            data: []
          },
          series: [
            {
              type: 'pie',
              data: []
            }
          ]
        }
      }
    }
  },
  watch: {
    titleArr (val) {
      console.log(val)
    },
    dataArr (val) {
      console.log(val)
    }
  },
  created () {
    this.setOptions(this.titleArr, 'titleArr')
    this.setOptions(this.dataArr, 'dataArr')
  },
  methods: {
    setOptions (arr, key) {
      const newArr = arr.map((item) => {
        const obj = {}
        obj.name = item[0]
        obj.value = item[1]
        obj.label = {
          color: '#444444',
          fontSize: 14,
          formatter: '{b}({d}%)'
        }
        return obj
      })
      this.options[this.type].legend.data = newArr.map(item => { return item.name })
      this.options[this.type].series[0].data = newArr
    }
  }
}
</script>

<style lang="less" scoped>
.fanDiagram {
  width: 100%;
  height: 100%;
}
</style>
