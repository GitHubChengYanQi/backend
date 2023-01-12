<template>
  <div class="TaskChart_Component_Container">
    <ChartContainer name="任务发送情况占比" :width="'60%'" style="margin-right: 1%;">
      <template #searchTab>
        <span style="font-weight: bold;">任务总数 1682</span>
      </template>
      <div style="height: 410px;display: flex;justify-content: space-around;">
        <div class="circleItem">
          <FanDiagram :type="1" :dataArr="[['北京公司', 3], ['', 30]]" />
        </div>
        <div class="circleItem">
          <FanDiagram :type="1" :dataArr="[['北京公', 3], ['', 30]]" />
        </div>
        <div class="circleItem">
          <FanDiagram :type="1" :dataArr="[['北京', 3], ['', 30]]" />
        </div>
      </div>
    </ChartContainer>
    <ChartContainer width="39%" name="启用方案TOP5">
      <template #rightTop>
        <span style="font-weight: bold;">未发送任务总量：122</span>
      </template>
      <template #searchTab>
        <a-radio-group
          default-value="1"
          button-style="solid"
          @change="({ target: { value } }) => handleChartItemChange({ value }, 'key')">
          <a-radio-button value="1">
            总任务
          </a-radio-button>
          <a-radio-button value="2">
            已发送任务
          </a-radio-button>
          <a-radio-button value="3">
            超时发送任务
          </a-radio-button>
          <a-radio-button value="4">
            未发送任务
          </a-radio-button>
        </a-radio-group>
      </template>
      <div style="height: 400px;">
        <FanDiagram :type="0" :dataArr="[['北京', 3], ['北京q', 30]]" />
      </div>
    </ChartContainer>
    <ChartContainer name="任务数据对比情况">
      <template #searchTab>
        <a-radio-group
          default-value="1"
          button-style="solid"
          @change="({ target: { value } }) => handleChartItemChange({ value }, 'key')">
          <a-radio-button value="1">
            任务数
          </a-radio-button>
          <a-radio-button value="2">
            发送数
          </a-radio-button>
          <a-radio-button value="3">
            超时发送数
          </a-radio-button>
          <a-radio-button value="4">
            未发送数
          </a-radio-button>
        </a-radio-group>
      </template>
      <div style="height: 250px;">
        <FanDiagram
          :type="4"
          :dataObj="{
            xAxis: ['2021-1', '2021-2'],
            data: {
              'A片区': [200, 300, 400],
              'B片区': [230, 330, 430]
            }
          }" />
      </div>
    </ChartContainer>
    <ChartContainer name="任务各类型数据情况">
      <template #searchTab>
        <a-radio-group
          default-value="1"
          button-style="solid"
          @change="({ target: { value } }) => handleChartItemChange({ value }, 'key')">
          <a-radio-button value="1">
            问卷
          </a-radio-button>
          <a-radio-button value="2">
            患教
          </a-radio-button>
          <a-radio-button value="3">
            嘱托
          </a-radio-button>
        </a-radio-group>
      </template>
      <div style="height: 250px;">
        <FanDiagram
          :type="5"
          :dataObj="{
            xAxis: ['2021-1', '2021-2'],
            data:{
              'A片区': [200, 300, 400 ],
              'B片区': [230, 330, 430 ]
            }
          }" />
      </div>
    </ChartContainer>
  </div>
</template>

<script>
import FanDiagram from './FanDiagram'
import ChartContainer from './chartContainer.vue'
export default {
  name: 'TaskChart',
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
    }
  }
}
</script>
<style lang='less'>
.TaskChart_Component_Container {
  .chartContainer_Comoonent {
    margin-bottom: 15px;
  }
}
</style>
<style lang='less' scoped>
.circleItem {
  margin-right: 20px;
}

.circleItem:last-child {
  margin-right: 0;
}
</style>
