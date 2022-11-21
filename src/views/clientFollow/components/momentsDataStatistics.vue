<template>
  <div class="momentsDataStatistics-page-container">
    <div class="echartsContainer">
      <div class="searchLine">
        <div class="item">
          <span class="label">选择日期区间</span>
          <a-range-picker
            dropdownClassName="momentsDataStatistics-page-container_rangePickerDropdown"
            v-model="searchObj.date"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :ranges="searchDateItemRanges"
            :disabled-date="e => disabledBeforeDate(e, 'date', true)"
            :disabled-time="e => disabledBeforeDate(e, 'time', true)"
            :allowClear="false"
            @change="(_, values) => {this.searchObj.date = values}" />
        </div>
        <div class="item">
          <span class="label">选择成员</span>
          <selectPersonnel
            style="margin-top: 5px;width:200px"
            :changeId="true"
            :num="1"
            v-model="searchObj.employeeIds"/>
        </div>
        <div class="item">
          <span class="label">任务类型</span>
          <a-select v-model="searchObj.type" style="width: 120px">
            <a-select-option value="1">企业发表</a-select-option>
            <a-select-option value="2">自主下发</a-select-option>
          </a-select>
        </div>
        <div class="btns" style="margin-top: 5px;">
          <a-button type="primary" style="width: 80px;" @click="handleSearch()">查询</a-button>
          <a-button @click="resetChartSearch" style="width: 80px;margin: 0 10px;">重置</a-button>
        </div>
      </div>
      <div class="echartsBox">
        <div class="switchLineType">
          <div
            v-for="(item, index) in lineArrs"
            :class="index === selectLineType ? 'items' : 'items disabled'"
            :key="index"
            @click="selectLineType = index">
            <div class="dot" :style="`background: rgb(${item.theme});`"></div>{{ item.name }}
          </div>
        </div>
        <v-chart v-if="defaultEchartOptions.xAxis[0].data.length" style="width: 100%;" :options="defaultEchartOptions" ref="chart"></v-chart>
        <div class="contranstLine">
          <selectPersonnel
            v-if="treeData"
            :record="treeData"
            class="selectPersonnelCom selectPersonnelCom_dashed"
            type="button"
            name="选择成员"
            v-model="contrastIds"
            @getVal="contrastIdsChange" />
          <div class="show"><div class="dot"></div>对比员工</div>
        </div>
      </div>
    </div>
    <div class="statisticsContainer">
      <p class="title">统计详情</p>
      <div class="searchLine">
        <div class="item">
          <span class="label">选择日期区间</span>
          <a-range-picker
            dropdownClassName="momentsDataStatistics-page-container_rangePickerDropdown"
            v-model="statisticsSearchObj.date"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :ranges="searchDateItemRanges"
            :allowClear="false"
            @change="(_, values) => {this.statisticsSearchObj.date = values}" />
        </div>
        <div class="item">
          <span class="label">选择成员</span>
          <selectPersonnel
            style="margin-top: 5px;"
            v-if="treeData"
            :record="treeData"
            class="selectPersonnelCom"
            type="button"
            name="选择成员"
            v-model="statisticsSearchObj.employeeIds"
            @getVal="(e) => {this.statisticsSearchObj.employeeIds = e}" />
        </div>
        <div class="item">
          <span class="label">任务类型</span>
          <a-select v-model="statisticsSearchObj.type" style="width: 120px">
            <a-select-option value="1">企业发表</a-select-option>
            <a-select-option value="2">自主下发</a-select-option>
          </a-select>
        </div>
        <div class="btns" style="margin-top: 5px;">
          <a-button type="primary" style="width: 80px;" @click="handleStatisticsSearch">查询</a-button>
          <a-button style="width: 80px;margin: 0 10px;" @click="resettTableListSearch">重置</a-button>
          <a-dropdown style="width: 100px;">
            <a-button type="primary" v-permission="'/moments/exportChartEmpExcel#post'">导出</a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <span @click="getTableList('exp_cur')">导出当前</span>
                </a-menu-item>
                <a-menu-item>
                  <span @click="getTableList('exp_all')">导出全部</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <a-table
        class="tableBox"
        :columns="tableColunms"
        :data-source="tableData"
        :pagination="pagination"
        @change="handleTableChange">
        <div slot="username" slot-scope="text, record" class="usernameBox">
          <img :src="record.avatar" alt="" class="face">
          <div class="txt">
            {{ text }}
          </div>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { deepClonev2 } from '@/utils/util'
import moment from 'moment'
import { disabledBeforeDate, chartDefaultOptions, returnChartData } from './momentsUtils'
import { getMomentsChartDataReq, getMomentsStatisticsListReq, momentsStatisticsListExportReq } from '@/api/momentsOperation'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

const dayNum = 1000 * 60 * 60 * 24
const maxDayNum = dayNum * 365 // 最大搜索天数不超过一年
export default {
  name: 'MomentsDataStatistics',
  components: {},
  data () {
    return {
      searchObj: {
        date: [moment().add(-1, 'years').format('YYYY-MM-D HH:mm'), moment().format('YYYY-MM-D HH:mm')],
        employeeIds: [],
        type: ''
      },
      treeData: [],
      searchDateItemRanges: {
        '今天': [moment().startOf('day'), moment().endOf('day')],
        '昨天': [moment().add(-1, 'days').startOf('day'), moment().add(-1, 'days').endOf('day')],
        '最近七天': [moment().add(-6, 'days').startOf('day'), moment().endOf('day')],
        '最近一个月': [moment().add(-1, 'months'), moment()],
        '最近三个月': [moment().add(-3, 'months'), moment()],
        '最近一年': [moment().add(-1, 'years'), moment()]
      },
      disabledBeforeDate,
      selectLineType: 0,
      lineArrs: [
        {
          // rgba 颜色  阴影为 .4 透明度
          theme: '43 111 253',
          name: '朋友圈发表量'
        },
        {
          theme: '244 176 62',
          name: '客户点赞量'
        },
        {
          theme: '98 214 143',
          name: '客户评论数'
        }
      ],
      defaultEchartOptions: chartDefaultOptions,
      contrastIds: [],
      // 统计
      statisticsSearchObj: {
        date: [moment().add(-1, 'years').format('YYYY-MM-D HH:mm'), moment().format('YYYY-MM-D HH:mm')],
        employeeIds: [],
        type: ''
      },

      tableColunms: [
        {
          title: '员工姓名',
          width: 250,
          dataIndex: 'name',
          scopedSlots: { customRender: 'username' }
        },
        {
          title: '所属门店',
          width: 200,
          align: 'center',
          dataIndex: 'depart_name'
        },
        {
          title: '所属机构',
          width: 200,
          align: 'center',
          dataIndex: 'parent_depart'
        },
        {
          title: '朋友圈发表量',
          width: 160,
          align: 'center',
          dataIndex: 'c_num'
        },
        {
          title: '客户点赞量',
          width: 160,
          align: 'center',
          dataIndex: 'like_num'
        },
        {
          title: '客户评论量',
          width: 160,
          align: 'center',
          dataIndex: 'comment_num'
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `第 ${Math.ceil(range[1] / this.pagination.pageSize)}页/共${total}条数据 `
      }
    }
  },
  watch: {
    selectLineType (e) {
      this.chartLineChange(e)
    },
    contrastIds (e) {
      if (e.length === 0) {
        const oldD = deepClonev2(this.defaultEchartOptions)
        oldD.series.splice(1, 1)
        this.defaultEchartOptions = oldD
      } else {
        this.handleSearch('emp')
      }
    }
  },
  created () {
    this.getChartData()
    this.getTableList()
  },
  methods: {
    // tyoe-total 全部搜索  emp 对比员工搜索 next 进行下一轮获取数据
    async getChartData (type = 'total') {
      const [starttime, endtime] = this.searchObj.date
      let timeType = '1'
      const targetNum = new Date(endtime).valueOf() - new Date(starttime).valueOf()
      if (targetNum > maxDayNum) {
        this.$message.warn('日期区间最多选择一年!')
        return
      }
      if (targetNum < dayNum) {
        timeType = '2'
      }
      const obj = {
        time_type: timeType,
        starttime,
        endtime,
        create_type: this.searchObj.type || '2',
        data_type: this.selectLineType + 1,
        empids: type === 'emp' ? this.contrastIds.join(',') : this.searchObj.employeeIds.join(',')
      }
      const { data } = await getMomentsChartDataReq(obj)
      const { xName, xData } = returnChartData(data)
      const oldD = deepClonev2(this.defaultEchartOptions)
      if (type === 'total') {
        oldD.xAxis[0].data = xName
        oldD.series[0].data = xData
      } else {
        if (oldD.series.length === 1) {
          oldD.series.push({
            name: '对比员工',
            type: 'line',
            lineStyle: {
              color: 'rgb(89 30 181)'
            },
            itemStyle: {
              color: 'rgb(89 30 181)'
            },
            // 最新data
            data: xData
          })
        } else {
          oldD.series[1].data = xData
        }
      }
      this.defaultEchartOptions = oldD
    },
    handleSearch (t) {
      this.getChartData(t)
      if (this.contrastIds.length && t !== 'emp') {
        this.handleSearch('emp')
      }
    },
    resetChartSearch () {
      this.searchObj = {
        date: [moment().add(-1, 'years').format('YYYY-MM-D HH:mm'), moment().format('YYYY-MM-D HH:mm')],
        employeeIds: [],
        type: ''
      }
      this.handleSearch()
    },
    chartLineChange (index) {
      const { theme, name } = this.lineArrs[index]
      this.defaultEchartOptions.series[0].name = name
      this.defaultEchartOptions.series[0].areaStyle.color = `rgb(${theme})`
      this.defaultEchartOptions.series[0].itemStyle.color = `rgb(${theme})`
      this.handleSearch()
      if (this.contrastIds.length) {
        this.handleSearch('emp')
      }
    },
    contrastIdsChange (e) {
      this.contrastIds = e
      console.log('change')
    },
    handleStatisticsSearch () {
      this.getTableList()
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableList()
    },
    resettTableListSearch () {
      this.statisticsSearchObj = {
        date: [moment().add(-1, 'years').format('YYYY-MM-D HH:mm'), moment().format('YYYY-MM-D HH:mm')],
        employeeIds: [],
        type: ''
      }
      this.getTableList()
    },
    async getTableList (expstatus) {
      const [starttime, endtime] = this.statisticsSearchObj.date
      const targetNum = new Date(endtime).valueOf() - new Date(starttime).valueOf()
      if (targetNum > maxDayNum) {
        this.$message.warn('日期区间最多选择一年!')
        return
      }
      const { current, pageSize } = this.pagination
      const obj = {
        starttime,
        endtime,
        create_type: this.statisticsSearchObj.type || '2',
        empids: this.statisticsSearchObj.employeeIds.join(','),
        current,
        size: pageSize
      }
      if (expstatus) {
        obj.expstatus = expstatus
      }
      if (expstatus) {
        const data = await momentsStatisticsListExportReq(obj)
        callDownLoadByBlob(data, '朋友圈任务列表')
      } else {
        const { data } = await getMomentsStatisticsListReq(obj)
        this.tableData = data.datas
        this.pagination.total = data.total
      }
      const res = await getMomentsStatisticsListReq(obj)
      console.log(res, 'res')
    }
  }
}
</script>
<style lang='less'>
.momentsDataStatistics-page-container {
  margin: 10px;
  border-radius: 5px;
  padding: 20px;
  background-color: #fff;
  .selectPersonnelCom {
    .ant-btn {
      width: 180px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      border: 1px solid #8a8a8a;
      background: none;
      color: rgba(0, 0, 0, 0.6);
      text-shadow: none;
    }
  }

  .selectPersonnelCom_dashed {
    margin-left: 40px;
    margin-top: 20px;

    .ant-btn {
      border: 1px dashed #8a8a8a;
    }
  }
}
.momentsDataStatistics-page-container_rangePickerDropdown{
  .ant-calendar-footer{
    padding: 0 6px;
  }
}
</style>
<style lang='less' scoped>
@import './momentsDataStatistics.less';
</style>
