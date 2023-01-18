<template>
  <div class="TaskPage_ChildPage_Container">
    <div class="conten_box">
      <div class="info_header">
        <div class="title">今日数据</div>
        <div class="time">{{ '更新时间：' + infoData.time }}</div>
        <div class="card_box">
          <a-card class="card" v-for="(item, index) in cardArr" :key="index">
            <div class="number">{{ infoData.card[item.key] || '-' }}</div>
            <div class="title">{{ item.title }}
              <a-tooltip v-if="item.extra">
                <template slot="title">
                  {{ item.extra }}
                </template><img src="./question.svg" alt="" style="margin-left: 5px;width: 15px;">
              </a-tooltip>
            </div>
          </a-card>
        </div>
      </div>
    </div>
    <div class="searchBar">
      <div class="searchItem">
        <span class="label">方案名称：</span>
        <a-select v-model="searchObj.planids" mode="multiple" style="width: 300px" :maxTagCount="2" placeholder="请选择">
          <a-select-option v-for="item in searchSchemeNameSelectOptions" :key="item.planId" :value="item.planId">
            {{ item.planName }}
          </a-select-option>
        </a-select>
      </div>
      <div class="searchItem">
        <span class="label">选择范围：</span>
        <a-select
          v-model="searchObj.range1"
          style="width: 150px"
          placeholder="请选择"
          :options="taskRange1SelectOptions"></a-select>
        <SelectDepartment
          v-if="searchObj.range1 !== 'empids'"
          class="input"
          :treeCheckStrictly="true"
          placeholder="请选择"
          v-model="searchObj.range2"
          style="width: 150px" />
        <selectPersonnel
          v-if="searchObj.range1 === 'empids'"
          class="input"
          v-model="searchObj.range2"
          :changeId="true"
          :num="1"
          :type="'selector'"
          style="width: 150px" />
      </div>
      <div class="searchItem">
        <span class="label">任务状态：</span>
        <a-select
          v-model="searchObj.status"
          style="width: 150px"
          placeholder="请选择"
          :options="taskStatusSelectOptions"></a-select>
      </div>
      <div class="searchItem">
        <a-radio-group class="chooseDateTypeRadio" v-model="searchObj.reporttype" button-style="solid">
          <a-radio-button value="10">日</a-radio-button>
          <a-radio-button value="7">月</a-radio-button>
          <a-radio-button value="4">年</a-radio-button>
        </a-radio-group>
        <a-range-picker v-model="searchObj.reportTrack" valueFormat="YYYY-MM-DD" :disabled-date="disabledSearchDate" />
      </div>
      <div class="searchBtn">
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button @click="reset">重置</a-button>
      </div>
    </div>
    <TaskChart class="chartBox" :data="chartsDataObj" :searchParams="searchObj" />
    <div class="tableBox" style="margin-top: 20px;">
      <SelfTable
        :tableColunms="tableColunms2"
        :tableData="tableData"
        :colunmsSlots="['name']"
        :titleSlots="['customName', 'customName2']"
        :tableTotal="pagination.total"
        :exportPermission="'/diagnosiscareanalysisday/exportreportlist#POST'"
        @getTableList="(params) => getTableList(false, params)"
        @exportTableList="(params) => getTableList(true, params)">
        <template #customName>
          <div class="btns" style="color: #2589FF;cursor: pointer;" @click="goTableDetail('3')">
            {{ '任务数' }}
          </div>
        </template>
        <template #customName2>
          <span>
            {{ searchObj.range1 === 'organids' ? '机构' : searchObj.range1 === 'shopids' ? '门店' : '员工' }}名称
          </span>
        </template>
        <template #name="{ text }">
          <div class="btns" style="color: #2589FF;cursor: pointer;" @click="goTableDetail('4', text.record)">
            {{ text.text }}
          </div>
        </template>
      </SelfTable>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getSearchSchemeNameSelectOptionsReq, getTaskChartsDataReq, getExcelTaskTableDataReq, getDayinfoReq, getTaskTableDataReq } from '@/api/followData'
import { defaultSearchObj2, tableColunms2, taskRange1SelectOptions, taskStatusSelectOptions, fixTaskSearchObj, generatorChartsData } from '../defaultData'
import { deepClonev2 } from '@/utils/util'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

import SelfTable from './selfTable.vue'
import TaskChart from './taskChart.vue'
export default {
  name: 'TaskPage',
  components: {
    SelfTable,
    TaskChart
  },
  data () {
    return {
      cardArr: [
        { title: '随访任务总数', key: '0', extra: '本模块的任务总数是指应发任务总数' },
        { title: '新增任务数', key: '1' },
        { title: '进行中任务数', key: '2' },
        { title: '完成任务数', key: '3' },
        { title: '任务发送率', key: '4' },
        { title: '任务完成率', key: '5' }
      ],
      infoData: {
        time: '-',
        card: [0, 0, 0, 0, 0, 0]
      },
      searchObj: { ...defaultSearchObj2 },
      searchSchemeNameSelectOptions: [],
      taskRange1SelectOptions,
      taskStatusSelectOptions,
      chartsDataObj: {},
      tableColunms2,
      tableData: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      }
    }
  },
  computed: {},
  watch: {
    'searchObj.range1' () {
      this.searchObj.range2 = []
    },
    'searchObj.range2' (e) {
      if (e.length > 30) {
        this.searchObj.range2 = e.slice(0, 30)
      }
    },
    'searchObj.planids' (e) {
      if (e.length > 30) {
        this.searchObj.planids = e.slice(0, 30)
      }
    }
  },
  created () {
    this.init()
  },
  mounted () { },
  methods: {

    init () {
      getDayinfoReq({}).then(res => {
        this.infoData = {
          card: res.data.data,
          time: res.data.time
        }
      })
      getSearchSchemeNameSelectOptionsReq({}).then(res => {
        this.searchSchemeNameSelectOptions = res.data.datas
      })
      this.handleSearch()
    },
    disabledSearchDate (current) {
      let num = 90
      let type = 'days'
      if (this.searchObj.reporttype === '7') {
        num = 36
        type = 'months'
      } else if (this.searchObj.reporttype === '4') {
        num = 3
        type = 'years'
      }
      const targetDate = moment().subtract(num, type).valueOf()
      const currentDate = current.valueOf()
      return (current > moment().endOf('day')) || (currentDate < targetDate)
    },
    handleSearch (otherObj = {}, chartKey) {
      const newSearchObj = deepClonev2(this.searchObj)
      newSearchObj.planids = newSearchObj.planids.join(',')
      newSearchObj[newSearchObj.range1] = newSearchObj.range2
      const [starttime = '', endtime = ''] = newSearchObj.reportTrack
      newSearchObj.starttime = starttime
      newSearchObj.endtime = endtime
      delete newSearchObj.range1
      delete newSearchObj.range2
      delete newSearchObj.reportTrack
      const allSearchObj = fixTaskSearchObj({ ...newSearchObj, ...otherObj })
      getTaskChartsDataReq(allSearchObj).then(res => {
        console.log(res, 'res')
        const data = generatorChartsData(res.data)
        if (chartKey) {
          this.chartsDataObj[chartKey] = data[chartKey]
        } else {
          this.chartsDataObj = data
          this.searchObj.reportTrack = res.data.time
          this.getTableList(false, {})
        }
      })
    },
    handleChartItemChange (params, key) {
      this.handleSearch(params, key)
    },
    async getTableList (isExport, { pagination = false, ids }) {
      const newSearchObj = deepClonev2(this.searchObj)
      newSearchObj.planids = newSearchObj.planids.join(',')
      newSearchObj[newSearchObj.range1] = newSearchObj.range2.map(it => it.value || it).join(',')
      delete newSearchObj.range1
      delete newSearchObj.range2
      const [starttime = '', endtime = ''] = newSearchObj.reportTrack
      newSearchObj.starttime = starttime
      newSearchObj.endtime = endtime

      if (pagination) {
        this.pagination = pagination
      }
      const { pageSize, current } = pagination || this.pagination
      newSearchObj.size = pageSize
      newSearchObj.current = current

      newSearchObj.tasktab = 1
      newSearchObj.taskpertab = 1
      newSearchObj.tasktype = 1
      if (isExport) {
        // newSearchObj.excelType = 'horizontal'
        if (ids) {
          newSearchObj.ids = ids
          newSearchObj.expstatus = 'exp_cur'
        }
        newSearchObj.expstatus = 'exp_all'
        const data = await getExcelTaskTableDataReq(newSearchObj)
        callDownLoadByBlob(data, '随访任务数据')
      } else {
        console.log(newSearchObj, 'newSearchObj')
        getTaskTableDataReq(newSearchObj).then(res => {
          // console.log(res, 'res')
          this.tableData = res.data.datas
          this.pagination.total = res.data.total
        })
      }
    },
    goTableDetail (type, otherData = {}) {
      if (this.searchObj.reporttype === '10') return
      const searchParams = deepClonev2(this.searchObj)
      if (type === '4') {
        searchParams[searchParams.range1] = otherData.oid
      }
      searchParams.reporttype = searchParams.reporttype === '4' ? '7' : '10'
      this.$router.push({
        path: `/followUp/data/tableItemDetail`,
        query: { type, tab: 0, searchParams: encodeURIComponent(JSON.stringify({ ...searchParams, exportPermission: type === '3' ? '/diagnosiscareanalysisday/exporttasknumlist#POST' : '/diagnosiscareanalysisday/exportonamelist#POST', name: otherData.name })) }
      })
    },
    reset () {
      this.searchObj = { ...defaultSearchObj2 }
    }
  }
}
</script>
<style lang='less'>

</style>
<style lang='less' scoped>
@import '../index.less';
</style>
