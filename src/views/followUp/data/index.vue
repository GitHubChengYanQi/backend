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
        @click="handleCutTabIndex(index)"
        :key="index">{{ item }}</div>
    </div>
    <div class="conten_box">
      <div class="info_header">
        <div class="title">今日数据</div>
        <div class="time">{{ '更新时间：' + infoData.time }}</div>
        <div class="card_box">
          <a-card class="card" v-for="(item, index) in tabArr.cardArr[tab_header]" :key="index">
            <div class="number">{{ infoData.card[item.key] }}</div>
            <div class="title">{{ item.title }}
              <a-tooltip v-if="item.extra">
                <template slot="title">
                  {{ item.extra }}
                </template><img src="./components/question.svg" alt="" style="margin-left: 5px;width: 15px;">
              </a-tooltip>
            </div>
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
      <div class="searchItem" v-if="tab_header === 0">
        <span class="label">方案状态：</span>
        <a-select
          v-model="searchObj.status"
          style="width: 200px"
          placeholder="请选择"
          :options="shemeStatusSelectOptions"></a-select>
      </div>
      <div class="searchItem" v-else>
        <span class="label">选择范围：</span>
        <a-select
          v-model="searchObj.range1"
          style="width: 150px"
          placeholder="请选择"
          :options="taskRange1SelectOptions"></a-select>
        <SelectDepartment
          v-if="searchObj.range1 !== '3'"
          class="input"
          :treeCheckStrictly="true"
          placeholder="请选择"
          v-model="searchObj.range2"
          style="width: 150px"
        />
        <selectPersonnel
          v-if="searchObj.range1 === '3'"
          class="input"
          v-model="searchObj.range2"
          :changeId="true"
          :num="1"
          :type="'selector'"
          style="width: 150px"
        />
      </div>
      <div class="searchItem" v-if="tab_header === 0">
        <span class="label">方案分类：</span>
        <a-select
          v-model="searchObj.classify"
          style="width: 200px"
          placeholder="请选择"
          :options="shemeClassifySelectOptions"></a-select>
      </div>
      <div class="searchItem" v-else>
        <span class="label">任务状态：</span>
        <a-select
          v-model="searchObj.status"
          style="width: 150px"
          placeholder="请选择"
          :options="taskStatusSelectOptions"></a-select>
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
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button @click="searchObj = { ...defaultSearchObj }">重置</a-button>
      </div>
    </div>
    <div class="chartBox" :is="tab_header === 0 ? 'scheme-chart' : 'task-chart'" :data="{ a: 1 }">
    </div>
    <!-- <div class="tableBox" style="margin-top: 20px;">
      <SelfTable
        :tableColunms="tab_header === 0 ? tableColunms1 : tableColunms2"
        :tableData="tableData"
        :colunmsSlots="['name']"
        :titleSlots="['customName']"
        @getTableList="(params) => getTableList(false, params)"
        @exportTableList="(params) => getTableList(true, params)">
        <template #name="{ text }">
          <div class="btns" style="color: #2589FF;cursor: pointer;" @click="goTableDetail(1, 3)">
            {{ text }}
          </div>
        </template>
        <template #customName>
          <div class="btns" style="color: #2589FF;cursor: pointer;" @click="goTableDetail(2, 4)">
            {{ tab_header === 0 ? '使用方案员工数' : '任务数' }}
          </div>
        </template>
      </SelfTable>
    </div> -->
  </div>
</template>

<script>
import moment from 'moment'

import SchemeChart from './components/schemeChart.vue'
import TaskChart from './components/taskChart.vue'
import SelfTable from './components/selfTable.vue'

import { defaultSearchObj, defaultSearchObj2, shemeStatusSelectOptions, tableColunms1, tableColunms2, taskRange1SelectOptions, taskStatusSelectOptions } from './defaultData'
export default {
  components: {
    SchemeChart,
    TaskChart,
    SelfTable
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
            { title: '随访任务总数', key: '0', extra: '本模块的任务总数是指应发任务总数' },
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
      searchObj: { ...defaultSearchObj },
      shemeStatusSelectOptions,
      shemeClassifySelectOptions: [],
      taskRange1SelectOptions,
      taskRange2SelectOptions: [],
      taskStatusSelectOptions,
      tableColunms1,
      tableColunms2,
      tableData: [{
        ownerName: '12'
      }]
    }
  },
  created () {
    this.tab_header = +this.$route.query.tab || 0
  },
  watch: {
    tab_header () {
      this.resetSearch()
    },
    'searchObj.range1' () {
      this.searchObj.range2 = []
    }
  },
  methods: {
    handleCutTabIndex (index) {
      this.tab_header = index
      history.replaceState(null, '', `/followUp/data/index?tab=${index}`)
    },
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
    resetSearch () {
      if (this.tab_header === 0) {
        this.searchObj = { ...defaultSearchObj }
      } else {
        this.searchObj = { ...defaultSearchObj2 }
      }
    },
    handleSearch () {
      console.log(this.searchObj)
    },
    handleChartItemChange (value, key) {
      console.log(value, key, this.searchObj)
    },
    async getTableList (isExport, { pagination, ids }) {
      if (isExport) {
        // const data = await groupListExportReq(this.handleParam(obj))
        // callDownLoadByBlob(data, '群列表')
      } else {
        // const { data } = await workRoomList(this.handleParam(obj))
        // this.tableData = data.list
        // this.pagination.total = data.page.total
      }
      console.log('getTableList', isExport, pagination, ids)
    },
    goTableDetail (one, two) {
      this.$router.push({
        path: `/followUp/data/tableItemDetail`,
        query: { type: this.tab_header === 0 ? one : two, tab: this.tab_header }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
