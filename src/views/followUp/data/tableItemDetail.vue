<template>
  <div class="TableItemDetail_Page_Container">
    <SelfTable
      :tableColunms="['1', '3'].includes(type) ? tableColunms : type === '2' ? type2Colunms : type4Colunms"
      :tableData="tableData"
      :tableTotal="pagination.total"
      @getTableList="(params) => getTableList(false, params)"
      @exportTableList="(params) => getTableList(true, params)">
      <template #radioTab="params" v-if="type === '3'">
        <a-radio-group
          v-model="taskTitleTableVal"
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
import { getExcelTableDetailDataReq, getTableDetailDataReq, getTableItemDetailDataReq, getTaskTableItemDataReq, getTaskTableTitleItemDataReq, getExportTaskTableItemDataReq, getExportTaskTableTitleItemDataReq } from '@/api/followData'
import { deepClonev2 } from '@/utils/util'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

export default {
  components: {
    SelfTable
  },
  data () {
    return {
      type: '1', // 1-方案-员工 2-方案-名称 3-任务-任务 4-任务-片区
      searchParams: {},
      tableColunms: [],
      tableData: [],
      type2Colunms: [
        {
          title: '时间',
          width: 120,
          dataIndex: 'planOccur',
          align: 'center'
        },
        {
          title: '方案使用员工数',
          width: 140,
          dataIndex: 'fateEmployee',
          align: 'center'
        },
        {
          title: '方案使用用户数',
          width: 140,
          dataIndex: 'fateContact',
          align: 'center'
        },
        {
          title: '方案使用次数',
          width: 140,
          dataIndex: 'fateTogether',
          align: 'center'
        },
        {
          title: '方案预警次数',
          width: 140,
          dataIndex: 'fateWarning',
          align: 'center'
        },
        {
          title: '方案完成次数',
          width: 140,
          dataIndex: 'fateComplete',
          align: 'center'
        }
      ],
      type4Colunms: [
        {
          title: '时间',
          width: 120,
          dataIndex: 'day',
          align: 'center'
        },
        {
          title: '任务数',
          width: 120,
          dataIndex: 'num',
          align: 'center'
        },
        {
          title: '任务发送数',
          width: 120,
          dataIndex: 'num_send',
          align: 'center'
        },
        {
          title: '超时发送数',
          width: 120,
          dataIndex: 'num_expsend',
          align: 'center'
        },
        {
          title: '任务发送率',
          width: 120,
          dataIndex: 'send_per',
          align: 'center'
        },
        {
          title: '任务完成率',
          width: 120,
          dataIndex: 'finish_per',
          align: 'center'
        },
        {
          title: '随访用户数',
          width: 120,
          dataIndex: 'num_join',
          align: 'center'
        },
        {
          title: '随访用户比例',
          width: 120,
          dataIndex: 'join_per',
          align: 'center'
        },
        {
          title: '预警次数',
          width: 120,
          dataIndex: 'num_warn',
          align: 'center'
        },
        {
          title: '预警次数占比',
          width: 120,
          dataIndex: 'warn_per',
          align: 'center'
        }
      ],
      taskTitleTableVal: '1',
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      }
    }
  },
  created () {
    this.type = this.$route.query.type
    this.searchParams = JSON.parse(decodeURIComponent(this.$route.query.searchParams))
    this.getTableList(false, { })
  },
  methods: {
    async getTableList (isExport, params) {
      const { pagination = false, ids } = params
      const newSearchObj = deepClonev2(this.searchParams)
      if (['1', '2'].includes(this.type)) {
        newSearchObj.planId = newSearchObj.planId.join(',')
      } else {
        newSearchObj.planids = newSearchObj.planids.join(',')
        const [starttime = '', endtime = ''] = newSearchObj.reportTrack
        newSearchObj.starttime = starttime
        newSearchObj.endtime = endtime
        delete newSearchObj.range1
        delete newSearchObj.range2
        delete newSearchObj.reportTrack

        newSearchObj.taskpertab = this.taskTitleTableVal
      }
      if (pagination) {
        this.pagination = pagination
      }
      const { pageSize, current } = pagination || this.pagination
      newSearchObj.size = pageSize
      newSearchObj.current = current
      console.log(newSearchObj, 'newSearchObj')
      if (isExport) {
        if (this.type === '1') {
          newSearchObj.excelType = 'vertical'
        } else if (this.type === '2') {
          newSearchObj.excelType = 'horizontal'
        } else if (this.type === '3') {
        } else if (this.type === '4') {
        }
        if (['1', '2'].includes(this.type)) {
          if (ids) {
            newSearchObj.excelKagi = ids
          }
          const data = await getExcelTableDetailDataReq(newSearchObj)
          callDownLoadByBlob(data, this.type === '1' ? '各个方案被使用数' : '随访方案报表明细')
        } else {
          if (ids) {
            newSearchObj.days = ids
            newSearchObj.expstatus = 'exp_cur'
          } else {
            newSearchObj.expstatus = 'exp_all'
          }
          if (this.type === '3') {
            const data = await getExportTaskTableTitleItemDataReq(newSearchObj)
            callDownLoadByBlob(data, '各个方案被使用数')
          } else {
            const data = await getExportTaskTableItemDataReq(newSearchObj)
            console.log(data, 'data')
            callDownLoadByBlob(data, '任务数明细列表')
          }
        }
      } else {
        if (['1', '2'].includes(this.type)) {
          if (this.type === '2') {
            getTableDetailDataReq(newSearchObj).then(res => {
              this.tableData = res.data.datas
            })
          } else {
            getTableItemDetailDataReq(newSearchObj).then(res => {
              if (['1', '3'].includes(this.type)) {
                this.tableColunms = res.data.head.map(it => ({ ...it, width: 130, align: 'center' }))
              }
              this.tableData = res.data.line
              this.pagination.total = res.data.total
            })
          }
        } else if (this.type === '3') {
          getTaskTableTitleItemDataReq(newSearchObj).then(res => {
            this.tableColunms = res.data.head.map(it => ({ ...it, dataIndex: it.dataindex, width: 130, align: 'center' }))
            this.tableData = res.data.datas
          })
        } else if (this.type === '4') {
          getTaskTableItemDataReq(newSearchObj).then(res => {
            this.tableData = res.data.datas
          })
        }
      }
    }
  }
}
</script>
<style lang='less' scoped>

</style>
