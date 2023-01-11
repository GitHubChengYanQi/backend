<template>
  <div class="SchemeChart_Component_Container">
    <ChartContainer width="49%" name="方案占比" style="margin-right: 1%;">
      <template #rightTop>
        <span class="label">选择范围：</span>
        <a-select default-value="0" style="width: 80px" @change="handleSchemeRangeSelectChange">
          <a-select-option v-for="(item, index) in schemeRangeSelectOptions" :value="item.value" :key="index">
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-select default-value="0" style="width: 100px" @change="handleSchemeTargetSelectChange">
          <a-select-option v-for="(item, index) in schemeTargetSelectOptions" :value="item.value" :key="index">
            {{ item.label }}
          </a-select-option>
        </a-select>
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
      <FanDiagram :type="0" :dataArr="[['北京公司', 3], ['北京公', 3], ['北京', 3]]" />
    </ChartContainer>
    <ChartContainer width="50%" name="启用方案TOP5">

    </ChartContainer>
    <ChartContainer
      width="49%"
      style="margin-right: 1%;"
      extra="所选时间范围内，使用方案的用户总人数"
      name="使用方案用户总人数"
      :rightTop="`用户总人数 ${1867}`">
    </ChartContainer>
    <ChartContainer
      width="50%"
      name="使用方案总次数"
      extra="所选时间范围内，使用方案总次数"
      :rightTop="`方案总数 ${1867}`">
    </ChartContainer>
    <ChartContainer
      width="49%"
      style="margin-right: 1%;"
      name="完成方案总次数"
      extra="所选时间范围内，用户完成方案的次数">
    </ChartContainer>
    <ChartContainer
      width="50%"
      name="使用方案员工总人数"
      extra="所选时间范围内，使用方案的员工人数"
      :rightTop="`员工总人数 ${1867}`">
    </ChartContainer>
    <ChartContainer
      width="49%"
      style="margin-right: 1%;"
      name="方案总数（个）"
      extra="所选时间范围内，方案总个数">
    </ChartContainer>
    <ChartContainer
      width="50%"
      name="方案预警次数"
      extra="所选时间范围内，方案预警次数">
    </ChartContainer>
  </div>
</template>

<script>
import FanDiagram from './FanDiagram'
import ChartContainer from './chartContainer.vue'

const schemeRangeSelectOptions = [
  { value: '0', label: '片区' },
  { value: '1', label: '门店' },
  { value: '2', label: '员工' }
]
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
      schemeRangeSelectOptions,
      schemeTargetSelectOptions: []
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  methods: {
    // item级搜索
    handleChartItemChange (value, key) {
      this.$parent.handleChartItemChange(value, key)
    },
    // 方案select change
    handleSchemeRangeSelectChange (e) {
      console.log(e, 'e')
    },
    // 方案精准select change
    handleSchemeTargetSelectChange (e) {
      console.log(e, 'e')
      // 单体搜索
    }
  }
}
</script>
<style lang='less'>

</style>
<style lang='less' scoped>

</style>
