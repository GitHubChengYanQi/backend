<template>
  <div id="data_modal_container" ref="data_modal_container">
    <a-modal
      class="dataModalContainer"
      :getContainer="() => $refs['data_modal_container']"
      :title="`SOP名称:${currentSearchInfo.sopName}`"
      :width="1000"
      :visible="dataModalShow"
      :maskClosable="false"
      :footer="null"
      @cancel="closeDataModal"
    >
      <div class="searchBar">
        <a-input-search
          class="input"
          v-model="currentSearchInfo.sendEmpName"
          placeholder="筛选员工"
          @search="dataModalSearch"
        />
        <div>
          <a-button @click="exportData" style="margin-right: 10px;" v-permission="'/sopTaskDetail/getSopTaskDetailListExcel@post'">导出</a-button>
        </div>
      </div>
      <div class="tableBox">
        <a-table
          :loading="tableLoading"
          :row-key="record => record.empId"
          :data-source="modalTableData"
          :columns="modalTableColumns"
        >
          <template slot="employeeMainDeptOrgName" slot-scope="text, record">
            <div>
              {{ record.employeeMainDeptOrgName ? record.employeeMainDeptOrgName : '-' }}
            </div>
          </template>
          <template slot="employeeMainDeptName" slot-scope="text, record">
            <div>
              {{ record.employeeMainDeptName ? record.employeeMainDeptName : '-' }}
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { exportDataList, exportDataMethod } from '@/api/salers'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
import { deepClonev2 } from '@/utils/util'
export default {
  name: 'BackendSopDataModal',

  data () {
    return {
      tableLoading: false,
      // 弹框显示状态
      dataModalShow: false,
      // 弹框表格数据载体
      modalTableData: [],
      currentSearchInfo: {},
      // 表格列表表头
      modalTableColumns: [
        {
          title: '员工姓名',
          dataIndex: 'empName',
          align: 'center',
          width: 150,
          all: true
        },
        {
          title: '应发客户数',
          dataIndex: 'suedNum',
          align: 'center',
          width: 150,
          all: true
        },
        {
          title: '未完成客户数',
          dataIndex: 'outUnsentNum',
          align: 'center',
          width: 200,
          all: true
        },
        {
          title: '所属机构',
          dataIndex: 'employeeMainDeptOrgName',
          align: 'center',
          width: 200,
          all: true,
          scopedSlots: { customRender: 'employeeMainDeptOrgName' }
        },
        {
          title: '所属门店',
          dataIndex: 'employeeMainDeptName',
          align: 'center',
          width: 200,
          all: true,
          scopedSlots: { customRender: 'employeeMainDeptName' }
        }
      ]
    }
  },
  watch: {
    showModal () {
      this.dataModalShow = this.showModal
      if (this.showModal) {
        this.$delete(this.currentSearchInfo, 'sendEmpName')
        console.log(this.searchTypeInfo, 'searchTypeInfo')
        this.currentSearchInfo = deepClonev2(this.searchTypeInfo)
        this.commonMethod()
      }
    },
    searchTypeInfo () {
      // console.log(this.searchTypeInfo, 'searchTypeInfo')
      // this.commonMethod()
    }
  },
  props: {
    searchTypeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showModal: {
      type: Boolean,
      default: false
    }
  },
  mounted () {

  },

  methods: {
    // 数据模糊搜索
    dataModalSearch () {
      console.log(this.currentSearchInfo, '添加模糊搜索后的对象')
      this.commonMethod()
    },
    // 公共的请求
    commonMethod () {
      this.tableLoading = true
      exportDataList(this.currentSearchInfo).then(response => {
        console.log(response, '获取数据')
        this.modalTableData = response.data
        this.tableLoading = false
      })
    },
    // 关闭弹框
    closeDataModal () {
      this.dataModalShow = false
      this.$emit('update:showModal', false)
    },
    // 查询数据
    goSearch () {
      console.log('搜索')
      this.commonMethod()
    },
    // 重置数据
    goReset () {
      console.log('重置')
      this.$delete(this.currentSearchInfo, 'sendEmpName')
      this.commonMethod()
    },
    // 导出数据
    exportData () {
      console.log('导出数据')
      if (this.modalTableData.length != 0) {
        exportDataMethod(this.currentSearchInfo).then(response => {
          // console.log(response, '点击导出')
          callDownLoadByBlob(response, '导出数据记录')
        })
      } else {
        this.$message.warning('当前没有数据可导出')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.searchBar {
    .input {
        width: 200px;
    }
}
</style>
