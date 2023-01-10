<template>
  <div class="fanDiagram">
    <v-chart class="chart" :options="options[type]"></v-chart>
  </div>
</template>

<script>
export default {
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
    dataArr: {
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
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            bottom: 'bottom',
            data: []
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              tadius: ['50%', '60%'],
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
      if (key == 'titleArr') {
        this.options[this.type].legend.data = arr
      } else if (key == 'dataArr') {
        this.options[this.type].series.data = arr
      }
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
