<template>
  <div class="SchemeChart_Component_Container">
    <ChartContainer name="方案占比">
      <template #rightTop>
        <div style="display: flex;align-items: center;">
          <span class="label">选择范围：</span>
          <div style="display: flex;align-items: center;">
            <a-select v-model="chart1RangeSelect" style="width: 80px" :options="schemeRange1SelectOptions">
            </a-select>
            <SelectDepartment
              v-if="chart1RangeSelect && chart1RangeSelect !== 'pieEmployee'"
              class="input"
              :treeCheckStrictly="true"
              placeholder="请选择"
              v-model="chart1RangeDetailSelect"
              style="width: 150px" />
            <selectPersonnel
              v-if="chart1RangeSelect === 'pieEmployee'"
              class="input"
              v-model="chart1RangeDetailSelect"
              :changeId="true"
              :num="1"
              :type="'selector'"
              style="width: 150px" />
          </div>
        </div>
      </template>
      <template #searchTab>
        <a-radio-group
          v-model="useType"
          button-style="solid"
          @change="({ target: { value } }) => handleChartItemChange({ pieField: value, [chart1RangeSelect]: chart1RangeDetailSelect.map(it => it.value || it).join(',') }, 'pieRate')">
          <a-radio-button value="fate_together">
            使用情况
          </a-radio-button>
          <a-radio-button value="fate_contact">
            完成情况
          </a-radio-button>
          <a-radio-button value="fate_warning">
            预警情况
          </a-radio-button>
        </a-radio-group>
      </template>
      <div style="height: 400px;">
        <FanDiagram :type="0" :dataArr="data.pieRate" />
      </div>
    </ChartContainer>
    <ChartContainer name="启用方案TOP5">
      <div style="height: 450px;">
        <FanDiagram :type="2" :dataArr="data.rowRank || []" />
      </div>
    </ChartContainer>
    <ChartContainer extra="所选时间范围内，使用方案的用户总人数" name="使用方案用户总人数" :rightTop="`用户总人数 ${1867}`">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="data.dayContact" />
      </div>
    </ChartContainer>
    <ChartContainer name="使用方案总次数" extra="所选时间范围内，使用方案总次数" :rightTop="`方案总数 ${1867}`">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="data.dayTogether" />
      </div>
    </ChartContainer>
    <ChartContainer name="完成方案总次数" extra="所选时间范围内，用户完成方案的次数">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="data.dayComplete" />
      </div>
    </ChartContainer>
    <ChartContainer name="使用方案员工总人数" extra="所选时间范围内，使用方案的员工人数" :rightTop="`员工总人数 ${1867}`">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="data.dayEmployee" />
      </div>
    </ChartContainer>
    <ChartContainer name="方案总数（个）" extra="所选时间范围内，方案总个数">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="data.dayProject" />
      </div>
    </ChartContainer>
    <ChartContainer name="方案预警次数" extra="所选时间范围内，方案预警次数">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="data.dayWarning" />
      </div>
    </ChartContainer>
  </div>
</template>

<script>
import FanDiagram from './FanDiagram'
import ChartContainer from './chartContainer.vue'

import { schemeRange1SelectOptions } from '../defaultData'

export default {
  name: 'SchemeChart',
  components: {
    FanDiagram,
    ChartContainer
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      useType: 'fate_together',
      chart1RangeSelect: '',
      chart1RangeDetailSelect: [],
      schemeRange1SelectOptions
    }
  },
  computed: {},
  watch: {
    chart1RangeSelect () {
      this.chart1RangeDetailSelect = []
      // this.handleChartItemChange({ [e]: '' }, 'pieRate')
    },
    chart1RangeDetailSelect (e) {
      // if (e.length) {
      this.handleChartItemChange({ [this.chart1RangeSelect]: e.map(it => it.value || it).join(','), pieField: this.useType }, 'pieRate')
      // }
    }
  },
  created () {
  },
  methods: {
    // item级搜索
    handleChartItemChange (value, key) {
      this.$parent.handleChartItemChange(value, key)
    }
  }
}
</script>
<style lang='less'>
.SchemeChart_Component_Container {
  .chartContainer_Comoonent {
    margin-bottom: 15px;
  }

  .chartContainer_Comoonent:nth-child(odd) {
    width: 49% !important;
    margin-right: 1%;
  }

  .chartContainer_Comoonent:nth-child(even) {
    width: 50% !important;
  }
}
</style>
<style lang='less' scoped>

</style>
