<template>
  <div class="TaskChart_Component_Container">
    <ChartContainer name="任务发送情况占比" :width="'60%'" style="margin-right: 1%;">
      <template #searchTab>
        <span style="font-weight: bold;">任务总数 {{ (data.tasksend_reports && data.tasksend_reports.totalnum) || '-' }}</span>
      </template>
      <div style="height: 410px;display: flex;justify-content: space-around;">
        <div class="circleItem">
          <FanDiagram :type="1" :dataArr="data.tasksendChart1" />
        </div>
        <div class="circleItem">
          <FanDiagram :type="1" :dataArr="data.tasksendChart2" />
        </div>
        <div class="circleItem">
          <FanDiagram :type="1" :dataArr="data.tasksendChart3" />
        </div>
      </div>
    </ChartContainer>
    <ChartContainer width="39%" name="任务类型占比情况">
      <template #rightTop>
        <span style="font-weight: bold;">未发送任务总量：{{ (data.tasktab_reports && data.tasktab_reports.num) || '-' }}</span>
      </template>
      <template #searchTab>
        <a-radio-group
          default-value="1"
          button-style="solid"
          @change="({ target: { value } }) => handleChartItemChange({tasktab: value, targetdata: 2}, 'tasktab_reports')"
        >
          <a-radio-button value="1">总任务</a-radio-button>
          <a-radio-button value="2">已发送任务</a-radio-button>
          <a-radio-button value="3">超时发送任务</a-radio-button>
          <a-radio-button value="4">未发送任务</a-radio-button>
        </a-radio-group>
      </template>
      <div style="height: 400px;" v-if="data.tasktab_reports">
        <FanDiagram :type="0" :dataArr="data.tasktab_reports.chartData" />
      </div>
    </ChartContainer>
    <ChartContainer name="任务数据对比情况">
      <template #searchTab>
        <a-radio-group
          default-value="1"
          button-style="solid"
          @change="({ target: { value } }) => handleChartItemChange({taskpertab: value, targetdata: 3}, 'taskpertab_reports')"
        >
          <a-radio-button value="1">任务数</a-radio-button>
          <a-radio-button value="2">发送数</a-radio-button>
          <a-radio-button value="3">超时发送数</a-radio-button>
          <a-radio-button value="4">未发送数</a-radio-button>
        </a-radio-group>
      </template>
      <div style="height: 250px;" v-if="data.taskpertab_reports">
        <FanDiagram
          :type="4"
          :dataObj="{
            xAxis: data.taskpertab_reports.xaxis,
            data: data.taskpertab_reports.data
          }"
        />
      </div>
    </ChartContainer>
    <ChartContainer name="任务各类型数据情况">
      <template #searchTab>
        <a-radio-group
          v-model="chart4Value"
          button-style="solid"
          @change="({ target: { value } }) => handleChartItemChange({tasktype: value, targetdata: 4}, 'tasktype_reports')"
        >
          <a-radio-button value="1">问卷</a-radio-button>
          <a-radio-button value="2">患教</a-radio-button>
          <a-radio-button value="3">嘱托</a-radio-button>
        </a-radio-group>
      </template>
      <div style="height: 250px;" v-if="data.tasktype_reports">
        <FanDiagram
          :type="5"
          :dataObj="{
            xAxis: data.tasktype_reports.xaxis,
            data:data.tasktype_reports.data
          }"
          @getClick="e => chart4Value === '1' && showModel(e)"
        />
      </div>
    </ChartContainer>
    <a-modal
      width="700px"
      class="viewModal"
      :visible="isShow"
      :closable="false"
      :footer="null"
      @cancel="()=>{
        isShow = false
      }"
    >
      <template slot="title">
        <div class="header">
          <div>问卷任务情况明细</div>
          <a-button
            @click="()=>{
              isShow = false
            }"
            key="back">返回</a-button>
        </div>
      </template>
      <div class="modal_box">
        <div class="table_box">
          <a-table
            :row-key="record => record.id"
            :columns="columns"
            :data-source="tableData"
            :pagination="pagination"
            @change="handleTableChange"
            class="table"
          ></a-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import FanDiagram from './FanDiagram'
import ChartContainer from './chartContainer.vue'
import { getChartItemTableDataReq } from '@/api/followData'
import { deepClonev2 } from '@/utils/util'
import { fixTaskSearchObj } from '../defaultData'
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
    },
    searchParams: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      isShow: false,
      chart4Value: '1',
      columns: [{
        align: 'center',
        title: '片区名称',
        dataIndex: 'name',
        width: 110
      },
      {
        align: 'center',
        title: '应发任务量',
        dataIndex: 'num',
        width: 110
      },
      {
        align: 'center',
        title: '实际发送量',
        dataIndex: 'num_send',
        width: 110
      },
      {
        align: 'center',
        title: '用户完成量',
        dataIndex: 'num_finish',
        width: 110
      },
      {
        align: 'center',
        title: '任务发送率',
        dataIndex: 'send_per',
        width: 110
      },
      {
        align: 'center',
        title: '任务完成率',
        dataIndex: 'finish_per',
        width: 110
      }],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      tableData: [],
      chart4Name: ''
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  methods: {
    // item级搜索
    handleChartItemChange (params, key) {
      this.$parent.handleChartItemChange(params, key)
    },
    showModel ({ name }) {
      this.chart4Name = name
      this.getTableData()
      this.isShow = true
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    getTableData () {
      const newSearchObj = deepClonev2(this.searchParams)
      newSearchObj.planids = newSearchObj.planids.join(',')
      newSearchObj[newSearchObj.range1] = newSearchObj.range2
      newSearchObj.starttime = this.chart4Name
      newSearchObj.endtime = this.chart4Name
      delete newSearchObj.range1
      delete newSearchObj.range2
      delete newSearchObj.reportTrack
      const { pageSize, current } = this.pagination
      newSearchObj.size = pageSize
      newSearchObj.current = current
      const allSearchObj = fixTaskSearchObj(newSearchObj)
      getChartItemTableDataReq(allSearchObj).then(res => {
        console.log(res, 'res')
        this.tableData = res.data.datas
        this.pagination.total = res.data.total
      })
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

.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #333333;
  font-family: 'Arial Normal', 'Arial', sans-serif;
  font-weight: 400;
  font-style: normal;
}

::v-deep(.ant-modal-body) {
  padding: 0;
}
.modal_box {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 370px;
  .table_box {
    min-width: 600px;
    min-height: 370px;
    .table {
      min-height: 370px;
    }
  }
}
</style>
