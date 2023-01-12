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
          @change="({ target: { value } }) => handleChartItemChange({ value }, 'key')"
        >
          <a-radio-button value="1">总任务</a-radio-button>
          <a-radio-button value="2">已发送任务</a-radio-button>
          <a-radio-button value="3">超时发送任务</a-radio-button>
          <a-radio-button value="4">未发送任务</a-radio-button>
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
          @change="({ target: { value } }) => handleChartItemChange({ value }, 'key')"
        >
          <a-radio-button value="1">任务数</a-radio-button>
          <a-radio-button value="2">发送数</a-radio-button>
          <a-radio-button value="3">超时发送数</a-radio-button>
          <a-radio-button value="4">未发送数</a-radio-button>
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
          }"
        />
      </div>
    </ChartContainer>
    <ChartContainer name="任务各类型数据情况">
      <template #searchTab>
        <a-radio-group
          v-model="chart4Value"
          button-style="solid"
          @change="({ target: { value } }) => handleChartItemChange({ value }, 'key')"
        >
          <a-radio-button value="1">问卷</a-radio-button>
          <a-radio-button value="2">患教</a-radio-button>
          <a-radio-button value="3">嘱托</a-radio-button>
        </a-radio-group>
      </template>
      <div style="height: 250px;">
        <FanDiagram
          :type="5"
          :dataObj="{
            xAxis: ['2021-1', '2021-2','2021-3'],
            data:{
              'A片区': [200, 300, 400 ],
              'B片区': [230, 330, 430 ]
            }
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
      isShow: false,
      chart4Value: '1',
      columns: [{
        align: 'center',
        title: '片区名称',
        dataIndex: 'contactNick',
        width: 110
      },
      {
        align: 'center',
        title: '应发任务量',
        dataIndex: 'contactExist',
        width: 110
      },
      {
        align: 'center',
        title: '实际发送量',
        dataIndex: 'createdAt',
        width: 110
      },
      {
        align: 'center',
        title: '用户完成量',
        dataIndex: 'viewingChannels',
        width: 110
      },
      {
        align: 'center',
        title: '任务发送率',
        dataIndex: 'viewingNumber',
        width: 110
      },
      {
        align: 'center',
        title: '任务完成率',
        dataIndex: 'viewingDuration',
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
      tableData: [{ id: 1 }]
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
    showModel (e) {
      console.log(e.dataIndex)
      this.isShow = true
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    getTableData () {}
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
