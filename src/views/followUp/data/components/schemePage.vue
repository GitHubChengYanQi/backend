<template>
  <div class="SchemePage_ChildPage_Container">
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
        <a-select v-model="searchObj.planId" mode="multiple" style="width: 300px" :maxTagCount="2" placeholder="请选择">
          <a-select-option v-for="item in searchSchemeNameSelectOptions" :key="item.planId" :value="item.planId">
            {{ item.planName }}
          </a-select-option>
        </a-select>
      </div>
      <div class="searchItem">
        <span class="label">方案状态：</span>
        <a-select
          v-model="searchObj.planStatus"
          style="width: 200px"
          allowClear
          placeholder="请选择"
          :options="shemeStatusSelectOptions"></a-select>
      </div>
      <div class="searchItem">
        <span class="label">方案分类：</span>
        <a-select v-model="searchObj.planType" style="width: 200px" placeholder="请选择">
          <a-select-option v-for="item in shemeClassifySelectOptions" :key="item.code" :value="item.code">
            {{ item.name }}
          </a-select-option></a-select>
      </div>
      <div class="searchItem">
        <a-radio-group class="chooseDateTypeRadio" v-model="searchObj.reportIndex" button-style="solid">
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
    <SchemeChart class="chartBox" :data="chartsDataObj" />
    <div class="tableBox" style="margin-top: 20px;">
      <SelfTable
        :tableColunms="tableColunms1"
        :tableData="tableData"
        :colunmsSlots="['planName']"
        :titleSlots="['fateEmployee']"
        :tableTotal="pagination.total"
        :exportPermission="'/scrm_diagnosis_care_analysis_project/excel#POST'"
        @getTableList="(params) => getTableList(false, params)"
        @exportTableList="(params) => getTableList(true, params)">
        <template #fateEmployee>
          <div class="btns" style="color: #2589FF;cursor: pointer;" @click="goTableDetail('1')">
            {{ '使用方案员工数' }}
          </div>
        </template>
        <template #planName="{ text }">
          <div class="btns" style="color: #2589FF;cursor: pointer;" @click="goTableDetail('2', text.record)">
            {{ text.text }}
          </div>
        </template>
      </SelfTable>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getSearchSchemeNameSelectOptionsReq, getDataDetailItemsReq, getChartsDataReq, getTableDetailDataReq, getExcelTableDetailDataReq } from '@/api/followData'
import { defaultSearchObj, shemeStatusSelectOptions, tableColunms1 } from '../defaultData'
import { getDict } from '@/api/common'
import { deepClonev2 } from '@/utils/util'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

import SelfTable from './selfTable.vue'
import SchemeChart from './schemeChart.vue'
export default {
  name: 'SchemePage',
  components: {
    SelfTable,
    SchemeChart
  },
  data () {
    return {
      cardArr: [{ title: '方案总数', key: '0' },
        { title: '新增方案数', key: '1' },
        { title: '累计用户使用方案数', key: '2' },
        { title: '新增用户使用方案数', key: '3' },
        { title: '方案累计触发预警次数', key: '4' },
        { title: '累计触达用户的预警数', key: '5' }],
      infoData: {
        time: '-',
        card: [0, 0, 0, 0, 0, 0]
      },
      searchObj: { ...defaultSearchObj },
      searchSchemeNameSelectOptions: [],
      shemeClassifySelectOptions: [],
      shemeStatusSelectOptions,
      chartsDataObj: {},
      tableColunms1,
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
    }
  },
  created () {
    this.init()
  },
  mounted () { },
  methods: {

    init () {
      getDataDetailItemsReq({}).then(res => {
        this.infoData = {
          card: res.data.data,
          time: res.data.time
        }
      })
      getSearchSchemeNameSelectOptionsReq({}).then(res => {
        this.searchSchemeNameSelectOptions = res.data.datas
      })
      getDict({ dictType: 'diagnosis_care_plan_template_type' }).then(res => {
        this.shemeClassifySelectOptions = res.data
      })
      this.handleSearch()
    },
    disabledSearchDate (current) {
      let num = 90
      let type = 'days'
      if (this.searchObj.reportIndex === '7') {
        num = 36
        type = 'months'
      } else if (this.searchObj.reportIndex === '4') {
        num = 3
        type = 'years'
      }
      const targetDate = moment().subtract(num, type).valueOf()
      const currentDate = current.valueOf()
      return (current > moment().endOf('day')) || (currentDate < targetDate)
    },
    handleSearch (otherObj = {}) {
      const newSearchObj = deepClonev2(this.searchObj)
      newSearchObj.planId = newSearchObj.planId.join(',')
      const allSearchObj = { ...newSearchObj, ...otherObj }
      // 处理默认值
      if (!allSearchObj.pieField) {
        allSearchObj.pieField = 'fate_together'
      }
      getChartsDataReq(allSearchObj).then(res => {
        // console.log(res, 'res')
        const data = { ...res.data }
        this.searchObj.reportTrack = data.reportTrack
        if (otherObj.reportKagi) {
          this.chartsDataObj[otherObj.reportKagi] = data[otherObj.reportKagi]
        } else {
          this.chartsDataObj = data
        }
      })

      this.getTableList(false, {})
    },
    async getTableList (isExport, { pagination = false, ids }) {
      const newSearchObj = deepClonev2(this.searchObj)
      newSearchObj.planId = newSearchObj.planId.join(',')
      if (pagination) {
        this.pagination = pagination
      }
      const { pageSize, current } = pagination || this.pagination
      newSearchObj.size = pageSize
      newSearchObj.current = current
      if (isExport) {
        newSearchObj.excelType = 'horizontal'
        if (ids) {
          newSearchObj.excelKagi = ids
        }
        const data = await getExcelTableDetailDataReq(newSearchObj)
        callDownLoadByBlob(data, '随访方案数据')
      } else {
        getTableDetailDataReq(newSearchObj).then(res => {
          this.tableData = res.data.datas
          this.pagination.total = res.data.total
        })
      }
    },
    goTableDetail (type, otherData = {}) {
      if (this.searchObj.reportIndex === '10') return
      const searchParams = deepClonev2(this.searchObj)
      if (type === '2') {
        searchParams.planId = otherData.planId
      } else {
        searchParams.planId = searchParams.planId.join(',')
      }
      searchParams.reportIndex = searchParams.reportIndex === '4' ? '7' : '10'
      this.$router.push({
        path: `/followUp/data/tableItemDetail`,
        query: { type, tab: 0, searchParams: encodeURIComponent(JSON.stringify({ ...searchParams, exportPermission: '/scrm_diagnosis_care_analysis_project/excel#POST', name: otherData.planName })) }
      })
    },
    handleChartItemChange (value, key) {
      this.handleSearch({ ...value, reportKagi: key })
    },
    reset () {
      this.searchObj = { ...defaultSearchObj }
    }
  }
}
</script>
<style lang='less'>

</style>
<style lang='less' scoped>
@import '../index.less';
</style>
