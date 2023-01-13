<template>
  <div class="SchemeChart_Component_Container">
    <ChartContainer name="方案占比">
      <template #rightTop>
        <div style="display: flex;align-items: center;">
          <span class="label">选择范围：</span>
          <div style="display: flex;align-items: center;">
            <a-select v-model="chart1RangeSelect" style="width: 80px" :options="taskRange1SelectOptions">
            </a-select>
            <SelectDepartment
              v-if="chart1RangeSelect !== '3'"
              class="input"
              :treeCheckStrictly="true"
              placeholder="请选择"
              v-model="chart1RangeDetailSelect"
              style="width: 150px" />
            <selectPersonnel
              v-if="chart1RangeSelect === '3'"
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
          default-value="1"
          button-style="solid"
          @change="({ target: { value } }) => handleChartItemChange({ value }, 'key')">
          <a-radio-button value="1">
            使用情况
          </a-radio-button>
          <a-radio-button value="2">
            完成情况
          </a-radio-button>
          <a-radio-button value="3">
            预警情况
          </a-radio-button>
        </a-radio-group>
      </template>
      <div style="height: 400px;">
        <FanDiagram :type="0" :dataArr="[['北京公司', 3], ['北京公', 3], ['北京', 3]]" />
      </div>
    </ChartContainer>
    <ChartContainer name="启用方案TOP5">
      <div style="height: 450px;">
        <FanDiagram :type="2" :dataArr="[['北京公司', 3], ['北京公', 4], ['北京', 5]]" />
      </div>
    </ChartContainer>
    <ChartContainer extra="所选时间范围内，使用方案的用户总人数" name="使用方案用户总人数" :rightTop="`用户总人数 ${1867}`">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="[['北京公司', 3], ['北京公', 4], ['北京', 5]]" />
      </div>
    </ChartContainer>
    <ChartContainer name="使用方案总次数" extra="所选时间范围内，使用方案总次数" :rightTop="`方案总数 ${1867}`">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="[['北京公司', 3], ['北京公', 4], ['北京', 5]]" />
      </div>
    </ChartContainer>
    <ChartContainer name="完成方案总次数" extra="所选时间范围内，用户完成方案的次数">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="[['北京公司', 3], ['北京公', 4], ['北京', 5]]" />
      </div>
    </ChartContainer>
    <ChartContainer name="使用方案员工总人数" extra="所选时间范围内，使用方案的员工人数" :rightTop="`员工总人数 ${1867}`">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="[['北京公司', 3], ['北京公', 4], ['北京', 5]]" />
      </div>
    </ChartContainer>
    <ChartContainer name="方案总数（个）" extra="所选时间范围内，方案总个数">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="[['北京公司', 3], ['北京公', 4], ['北京', 5]]" />
      </div>
    </ChartContainer>
    <ChartContainer name="方案预警次数" extra="所选时间范围内，方案预警次数">
      <div style="height: 150px;">
        <FanDiagram :type="3" :dataArr="[['北京公司', 3], ['北京公', 4], ['北京', 5]]" />
      </div>
    </ChartContainer>
  </div>
</template>

<script>
import FanDiagram from './FanDiagram'
import ChartContainer from './chartContainer.vue'

import { taskRange1SelectOptions } from '../defaultData'

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
      chart1RangeSelect: '1',
      chart1RangeDetailSelect: [],
      taskRange1SelectOptions
    }
  },
  computed: {},
  watch: {
    chart1RangeSelect (e) {
      this.chart1RangeDetailSelect = []
      this.handleChartItemChange({ chart1RangeSelect: e, chart1RangeDetailSelect: [] }, 'key')
    },
    chart1RangeDetailSelect (e) {
      if (e.length) {
        this.handleChartItemChange({ chart1RangeDetailSelect: e }, 'key')
      }
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
