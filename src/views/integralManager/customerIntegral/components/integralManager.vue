<template>
  <div id="integral_manager_container" ref="integral_manager_container">
    <div class="searchLine">
      <div class="searchItem">
        <div class="searcTitle">选择员工</div>
        <selectPersonnel
          class="selectPersonnelCom"
          name="请选择员工"
          :changeId="true"
          :num="1"
          v-model="employeeIds"
        />
      </div>
      <a-button
        type="primary"
        style="margin: 0 10px;"
      >查询</a-button>
      <a-button
        style="margin-right: 10px;"
      >重置</a-button>
      <a-button
        style="margin-right: 10px;"
      >导出</a-button>
    </div>
    <div class="searchLine">
      <a-button class="batchButtonDiv" @click="goBatchChangeIntegral">批量调整积分</a-button>
    </div>
    <a-table
      :loading="tableLoading"
      :row-key="record => record.id"
      :data-source="tableData"
      :columns="tableColumns"
      :pagination="pagination"
      class="tableBox"
      :scroll="{ x: 1500}"
      @change="handleTableChange">
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: space-around;">
            <a-button type="link" @click="setIntegral(record)">调整积分</a-button>
          </div>
        </template>
      </div>
    </a-table>
    <a-modal
      title="批量调整积分"
      :maskCloseable="false"
      :width="1000"
      :visible="integralBatchShowStatus"
      class="batchModalClass"
      @cancel="closeIntegralBatchModal()"
      :getContainer="() => $refs['integral_manager_container']"
    >
      <div class="formDivContent">
        <div class="formDivText">将给 1 位员工调整积分，员工可在积分统计查看相应调整记录</div>
        <div class="singleFormRulesDiv">
          <div class="singleFormTitle">调整积分</div>
          <div class="singleFormContent">
            <div class="singleRulesContent">
              <a-select class="singleInputClass" placeholder="请选择" v-model="batchInfo.changeType"></a-select>
              <a-input addon-after="积分" v-model="batchInfo.integral" default-value="10" class="singleInputClass"></a-input>
              <!-- <div class="singleFormText">好友查看了</div> -->
              <!-- <a-input placeholder="请选择互动雷达"></a-input> -->
            </div>
            <div class="singleRulesText">当扣减的积分大于员工积分余额时，员工积分将会直接调整为0</div>
          </div>
        </div>
        <div class="singleFormRulesDiv">
          <div class="singleFormTitle">调整原因</div>
          <div class="singleFormContent">
            <div class="singleRulesContent">
              <a-textarea placeholder="请输入原因" class="rasonTextareaDiv" v-model="batchInfo.changeCause"></a-textarea>
              <div class="len">0/18</div>
            </div>
            <div class="singleReasonContent">
              <div class="reasonTopDiv">
                <div class="reasonTitle">历史调整原因</div>
                <div class="reasonEditButton">编辑</div>
              </div>
              <div class="reasonTagDiv">
                <div class="singleReasonTag">显示历史调整原因</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button
          @click="closeIntegralBatchModal"
        >取消</a-button>
        <a-button type="primary" @click="confirmIntegralBatch">确定</a-button>
      </template>
    </a-modal>
    <!-- <SelectModal
      @output="getKeys"
      :selectedKeys="keys"
      :selectedRows="rows"
      :placeholder="searchPlaceholder"
      :list="treeData"
      :fieldNames="fieldNames"
      :transferTip="transferTip"
      ref="SelectPersonnel" /> -->
    <SelectModal
      :selectedKeys="keys"
      :selectedRows="rows"
      @output="getKeys"
      :list="treeData"
      ref="SelectPersonnel" />
  </div>
</template>

<script>
import { departmentEmp } from '@/api/common.js'
import SelectModal from '@/components/SelectPersonnel/components/modal'
import { getCustomerIntegralApi, getTempIntegralManagerData } from '@/api/integralManager'
export default {
  name: 'BackendIntegralManager',
  components: {
    SelectModal
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      keys: [],
      rows: [],
      treeData: [],
      integralBatchShowStatus: false,
      screenData: {},
      employeeIds: [],
      // 表格加载效果
      tableLoading: false,
      // 表格数据
      tableData: [],
      // 批量处理对象
      batchInfo: {},
      tableColumns: [
        {
          title: '员工名称',
          dataIndex: 'employeeName',
          align: 'center',
          width: 200
        },
        {
          title: '积分余额',
          dataIndex: 'integral',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '已发放积分',
          dataIndex: 'allIntegral',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '已消耗积分',
          dataIndex: 'consumptionIntegral',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '已过期积分',
          dataIndex: 'overdueIntegral',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '操作',
          align: 'center',
          width: 250,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      // 模板页面分页对象
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  created () {
    // // 获取缓存中的页码
    // const tempPage = sessionStorage.getItem('sopIntegralManagerPage')
    // this.$set(this.searchInfo, 'employeeIds', [])
    // if (tempPage) {
    //   this.$set(this.pagination, 'current', Number(tempPage))
    // } else {
    //   this.$set(this.pagination, 'current', 1)
    // }
    // this.getTableData()
    this.tableData = getTempIntegralManagerData()
    // 获取正式的数据
    // this.getDataList()
  },

  methods: {
    // 获取数据
    async getDataList () {
      this.tableLoading = true
      const params = {
        idsStr: this.screenData.employeeIds.join(','),
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        ...this.screenData
      }
      // console.log(params, '查询数据提交接口的对象')
      await getCustomerIntegralApi(params).then(response => {
        this.tableLoading = false
        console.log(response, '获取群SOP模板信息')
        this.tableData = response.data.list
        this.$set(this.pagination, 'total', Number(response.data.page.total))
        if (this.tableData.length === 0) {
          // 列表中没有数据
          if (this.pagination.total !== 0) {
            // 总数据有,但当前页没有
            // 重新将页码换成1
            this.$set(this.pagination, 'current', 1)
            this.getTableData()
          } else {
            // 是真没有数据
          }
        }
      }).catch(() => {
        this.tableLoading = false
      })
      // 临时接收假数据
      // this.tableData = getTempSopList()
    },
    // 表格监听事件
    handleTableChange ({ current, pageSize }, filters, sorter) {
      let currentTypeText = ''
      if (sorter.order) {
        // 获取点击的是那一列排序
        currentTypeText = sorter.column.dataIndex
        // this.$set(this.screenData, 'orderBySortCode', currentTypeText)
        if (sorter.order === 'ascend') {
          // 正序
          this.$set(this.screenData, `${currentTypeText}`, 'asc')
        } else {
          // 逆序
          this.$set(this.screenData, `${currentTypeText}`, 'desc')
        }
      } else {
        // 无需排序
        this.$delete(this.screenData, `${currentTypeText}`)
      }
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
      // this.pagination.current = current
      // this.pagination.pageSize = pageSize
      // console.log(sorter, 'sorter')
      // if (sorter.order) {
      //   if (sorter.order === 'ascend') {
      //     this.sorter = 'asc'
      //   } else {
      //     this.sorter = 'desc'
      //   }
      // } else {
      //   this.sorter = ''
      // }
      // this.getTableData()
    },
    goBatchChangeIntegral () {
      this.$refs.SelectPersonnel.modalShow = true
      departmentEmp().then(res => {
        // this.treeData = res.data
        // this.loading = false
        this.treeData = this.formatTree(res.data)
        // this.rows = this.getNodes(this.treeData, this.value)[0]
        // sessionStorage.setItem(this.curId, JSON.stringify(this.keys))
        // this.$refs.SelectPersonnel.modalShow = !state
      })
      // this.$refs.selectEmployee.$show([])
    },
    formatTree (data) {
      const arr = []
      for (let i = 0; i < data.length; i++) {
        data[i].leaf = data[i].isLeaf
        delete data[i].isLeaf
        data[i].name = data[i].title
        data[i].label = data[i].title
        data[i].scopedSlots = { title: 'title' }
        arr.push(data[i])
        if (data[i].children.length === 0 && data[i].leaf === '0') {
          data[i].disabled = true
        }
        if (data[i].children && data[i].children.length > 0) {
          this.formatTree(data[i].children)
        }
      }
      return arr
    },
    getKeys (e, type) {
      console.log(e, type, '选中回调')
    },
    selectEmployeeChange (e) {
      console.log(e, '批量处理选择')
    },
    // 调整积分弹框点击取消
    closeIntegralBatchModal () {
      this.integralBatchShowStatus = false
    },
    // 调整积分弹框点击确定
    confirmIntegralBatch () {
      this.integralBatchShowStatus = false
    },
    // 点击调整积分
    setIntegral () {
      this.integralBatchShowStatus = true
    }
    // // 获取数据
    // async getTableData () {
    //   this.tableLoading = true
    //   const params = {
    //     sopName: this.searchInfo.sopName,
    //     idsStr: this.searchInfo.employeeIds.join(','),
    //     page: this.pagination.current,
    //     perPage: this.pagination.pageSize,
    //     sort: this.sorter
    //   }
    //   // console.log(params, '查询数据提交接口的对象')
    //   await getSopTemplateListMethod(params).then(response => {
    //     this.tableLoading = false
    //     console.log(response, '获取群SOP模板信息')
    //     this.tableData = response.data.list
    //     this.$set(this.pagination, 'total', Number(response.data.page.total))
    //     if (this.tableData.length === 0) {
    //       // 列表中没有数据
    //       if (this.pagination.total !== 0) {
    //         // 总数据有,但当前页没有
    //         // 重新将页码换成1
    //         this.$set(this.pagination, 'current', 1)
    //         this.getTableData()
    //       } else {
    //         // 是真没有数据
    //       }
    //     }
    //   }).catch(() => {
    //     this.tableLoading = false
    //   })
    //   // 临时接收假数据
    //   // this.tableData = getTempSopList()
    // },
    // // 搜索
    // goSearch () {
    //   // 重新将页码换成1
    //   this.$set(this.pagination, 'current', 1)
    //   this.getTableData()
    // },
    // // 重置
    // goReset () {
    //   // 重新将页码换成1
    //   this.$set(this.pagination, 'current', 1)
    //   this.searchInfo = {}
    //   this.$set(this.searchInfo, 'employeeIds', [])
    //   this.getTableData()
    // }
  }
}
</script>

<style lang="less" scoped>
@import url('../css/integralManager.less');
</style>
