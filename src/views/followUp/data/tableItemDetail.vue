<template>
  <div class="TableItemDetail_Page_Container">111
    <SelfTable
      :tableColunms="['1', '3'].includes(type) ? tableColunms : type === '2' ? type2Colunms : type4Colunms"
      :tableData="tableData"
      @getTableList="(params) => getTableList(false, params)"
      @exportTableList="(params) => getTableList(true, params)">
      <template #radioTab="params" v-if="type === '3'">
        <a-radio-group
          default-value="1"
          button-style="solid"
          @change="({ target: { value } }) => getTableList(false, { tabVal: value, ...params.params })">
          <a-radio-button value="1">任务数</a-radio-button>
          <a-radio-button value="2">任务发送数</a-radio-button>
          <a-radio-button value="3">任务超时发送数</a-radio-button>
          <a-radio-button value="4">任务未发送数</a-radio-button>
        </a-radio-group>
      </template>
    </SelfTable>
  </div>
</template>

<script>
import SelfTable from './components/selfTable.vue'

const mockDH = [
  {
    title: 'A方案',
    dataIndex: 'planA'
  },
  {
    title: 'B方案',
    dataIndex: 'planB'
  },
  {
    title: 'C方案',
    dataIndex: 'planC'
  }
]
const mockD = [
  {
    planA: '12',
    planB: '34',
    planC: '56',
    date: '2022-12-12'
  },
  {
    planA: '12',
    planB: '34',
    planC: '56',
    date: '2022-12-12'
  },
  {
    planA: '12',
    planB: '34',
    planC: '56',
    date: '2022-12-12'
  }
]
export default {
  components: {
    SelfTable
  },
  data () {
    return {
      type: '1', // 1-方案-员工 2-方案-名称 3-任务-任务 4-任务-片区
      tableColunms: [],
      tableData: [],
      type2Colunms: [
        {
          title: '时间',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '方案使用员工数',
          width: 140,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '方案使用用户数',
          width: 140,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '方案使用次数',
          width: 140,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '方案预警次数',
          width: 140,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '方案完成次数',
          width: 140,
          dataIndex: 'date',
          align: 'center'
        }
      ],
      type4Colunms: [
        {
          title: '时间',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '任务数',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '任务发送数',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '超时发送数',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '任务发送率',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '任务完成率',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '随访用户数',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '随访用户比例',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '预警次数',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        },
        {
          title: '预警次数占比',
          width: 120,
          dataIndex: 'date',
          align: 'center'
        }
      ]
    }
  },
  created () {
    this.type = this.$route.query.type
    this.getTableList(false, { pagination: { current: 1, size: 10, total: 0 } })
  },
  methods: {
    async getTableList (isExport, params) {
      console.log(params, 'params')
      const { pagination, ids } = params
      if (isExport) {
        // const data = await groupListExportReq(this.handleParam(obj))
        // callDownLoadByBlob(data, '群列表')
      } else {
        // const { data } = await workRoomList(this.handleParam(obj))
        // this.tableData = data.list
        // this.pagination.total = data.page.total
      }
      this.tableColunms = [{ title: '时间', dataIndex: 'date' }, ...mockDH]
      this.tableData = mockD
      // console.log('getTableList', isExport, pagination, ids)
    }
  }
}
</script>
<style lang='less' scoped>

</style>
