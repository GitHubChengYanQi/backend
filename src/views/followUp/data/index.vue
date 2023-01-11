<template>
  <div class="data_page">
    <div class="header">
      <div class="title">随访数据统计</div>
      <span class="hint">数据更新频次</span>
      <a-tooltip placement="right">
        <template #title>
          <div class="title_box">
            <div>数据更新时间截止至当天05:00</div>
          </div>
        </template>
        <div class="icon">?</div>
      </a-tooltip>
    </div>
    <div class="tab_box">
      <div
        class="tab"
        :style="tab_header == index ? { color: 'rgba(2, 125, 180, 0.86)', textDecoration: 'underline' } : {}"
        v-for="(item,index) in tabArr.header"
        @click="() => { tab_header = index }"
        :key="index">{{ item }}</div>
    </div>
    <div class="conten_box">
      <div class="info_header">
        <div class="title">今日数据</div>
        <div class="time">{{ '更新时间：' + infoData.time }}</div>
        <div class="card_box">
          <a-card class="card" v-for="(item, index) in tabArr.cardArr[tab_header]" :key="index">
            <div class="number">{{ infoData.card[item.key] }}</div>
            <div class="title">{{ item.title }}</div>
          </a-card>
        </div>
      </div>
    </div>
    <div class="searchBar">
      <div class="searchItem">
        <span class="label">方案名称：</span>
        <a-select
          v-model="searchObj.name"
          mode="multiple"
          style="width: 300px"
          :maxTagCount="2"
          placeholder="请选择"
          :options="[...Array(10)].map((_, i) => ({ value: i, label: 'name' + i }))"></a-select>
      </div>
      <div class="searchItem">
        <span class="label">方案状态：</span>
        <a-select
          v-model="searchObj.status"
          style="width: 200px"
          placeholder="请选择"
          :options="[...Array(10)].map((_, i) => ({ value: i, label: 'name' + i }))"></a-select>
      </div>
      <div class="searchItem">
        <span class="label">方案分类：</span>
        <a-select
          v-model="searchObj.classify"
          style="width: 200px"
          placeholder="请选择"
          :options="[...Array(10)].map((_, i) => ({ value: i, label: 'name' + i }))"></a-select>
      </div>
      <div class="searchItem">
        <a-radio-group class="chooseDateTypeRadio" v-model="searchObj.dateType" button-style="solid">
          <a-radio-button value="day">日</a-radio-button>
          <a-radio-button value="month">月</a-radio-button>
          <a-radio-button value="year">年</a-radio-button>
        </a-radio-group>
        <a-range-picker v-model="searchObj.date" :disabled-date="disabledSearchDate" />
      </div>
      <div class="searchBtn">
        <a-button type="primary" @click="handleSearch">
          查询
        </a-button>
        <a-button @click="searchObj = { ...defaultSearchObj }">重置</a-button>
      </div>
    </div>
    <div class="box">
      <!-- <FanDiagram :type="0" :dataArr="[['北京公司', 3],['北京公', 3],['北京', 3]]" /> -->
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import FanDiagram from './components/fanDiagram'
const defaultSearchObj = {
  name: [],
  status: '',
  classify: '',
  dateType: 'day',
  date: []
}
export default {
  components: {
    FanDiagram
  },
  data () {
    return {
      tabArr: {
        header: ['随访方案数据', '随访任务数据'], // 头部切换
        cardArr: {
          0: [
            { title: '方案总数', key: '0' },
            { title: '新增方案数', key: '1' },
            { title: '累计用户使用方案数', key: '2' },
            { title: '新增用户使用方案数', key: '3' },
            { title: '方案累计触发预警次数', key: '4' },
            { title: '累计触达用户的预警数', key: '5' }
          ],
          1: [
            { title: '随访任务总数', key: '0' },
            { title: '新增任务数', key: '1' },
            { title: '进行中任务数', key: '2' },
            { title: '完成任务数', key: '3' },
            { title: '任务发送率', key: '4' },
            { title: '任务完成率', key: '5' }
          ]
        }
      },
      tab_header: 0,
      infoData: {
        time: '2022-09-22 05:00',
        card: [0, 1, 3, 3, 4, 5, 6]
      },
      searchObj: { ...defaultSearchObj }
    }
  },
  methods: {
    disabledSearchDate (current) {
      let num = 90
      let type = 'days'
      if (this.searchObj.dateType === 'month') {
        num = 36
        type = 'months'
      } else if (this.searchObj.dateType === 'year') {
        num = 3
        type = 'years'
      }
      const targetDate = moment().subtract(num, type).valueOf()
      const currentDate = current.valueOf()
      return (current > moment().endOf('day')) || (currentDate < targetDate)
    },
    handleSearch () {
      console.log(this.searchObj)
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
