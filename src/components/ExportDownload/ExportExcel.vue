<template>
  <div></div>
</template>
<script>
export default {
  data () {
    return {
      statisticData: [
        {
          lc_hz: 1,
          sl: 1
        },
        {
          lc_hz: 1,
          sl: 1
        },
        {
          lc_hz: 1,
          sl: 1
        }
      ]
    }
  },
  methods: {
    export2Excel (tTitle, tHeader, filterVal, list) {
      require.ensure([], () => {
        const { exportExcel } = require('@/utils/Export2Excel') // 路径需要自行修改
        const data = this.formatJson(filterVal, list)
        exportExcel(tHeader, data, tTitle)
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    }
  },
  mounted () {}
}
</script>
