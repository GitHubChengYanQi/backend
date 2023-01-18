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
          v-model="screenData.employeeIdList"
        />
      </div>
      <a-button
        type="primary"
        style="margin: 0 10px;"
        @click="goSearchData"
        v-permission="'/creditsEmployee/creditsEmployeePage@post'"
      >查询</a-button>
      <a-button
        style="margin-right: 10px;"
        @click="goResetData"
        v-permission="'/creditsEmployee/creditsEmployeePage@post'"
      >重置</a-button>
      <a-button
        style="margin-right: 10px;"
        @click="exportData"
        v-permission="'/creditsEmployee/creditsEmployeeExcel@post'"
      >导出</a-button>
    </div>
    <div class="searchLine">
      <a-button
        class="batchButtonDiv"
        @click="goBatchChangeIntegral"
        v-permission="'/creditsEmployee/updateCreditsEmployee@post'"
      >批量调整积分</a-button>
    </div>
    <a-table
      :loading="tableLoading"
      :row-key="record => record.id"
      :data-source="tableData"
      :columns="tableColumns"
      :pagination="pagination"
      :row-selection="{ selectedRowKeys: selectedKeyList, onChange: onSelectionChange }"
      class="tableBox"
      :scroll="{ x: 1500}"
      @change="handleTableChange">
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: space-around;">
            <a-button type="link" @click="setIntegral(record)" v-permission="'/creditsEmployee/updateCreditsEmployee@post'">调整积分</a-button>
          </div>
        </template>
      </div>
    </a-table>
    <a-modal
      :title="dialogTitle"
      :maskCloseable="false"
      :width="600"
      :visible="integralBatchShowStatus"
      class="batchModalClass"
      @cancel="closeIntegralBatchModal()"
      :getContainer="() => $refs['integral_manager_container']"
    >
      <a-spin :spinning="batchInfoModalLoading">
        <div class="formDivContent">
          <div class="formDivText" v-if="batchInfo.employeeIdList && batchInfo.employeeIdList.length !== 0">{{ `将给${batchInfo.employeeIdList.length}位员工调整积分，员工可在积分统计查看相应调整记录` }}</div>
          <div class="formDivText" v-if="batchInfo.checkedRuleIdList && batchInfo.checkedRuleIdList.length !== 0">{{ `将给${batchInfo.checkedRuleIdList.length}位员工调整积分，员工可在积分统计查看相应调整记录` }}</div>
          <div class="singleFormRulesDiv">
            <div class="singleFormTitle">调整积分</div>
            <div class="singleFormContent">
              <div class="singleRulesContent">
                <a-select class="singleInputClass" placeholder="请选择" v-model="batchInfo.changeType">
                  <a-select-option v-for="item in changeTypeList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
                </a-select>
                <a-input-number
                  placeholder="请输入积分"
                  :min="1"
                  :value="batchInfo.integral ? Number(batchInfo.integral) : 1"
                  class="singleInputClass"
                  @change="changeIntegralNumber">
                </a-input-number>
                <div class="singleRulesContentText">积分</div>
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
                <a-textarea placeholder="请输入原因" class="rasonTextareaDiv" v-model="batchInfo.adjustCause"></a-textarea>
                <div class="len">{{ `${ batchInfo.adjustCause && batchInfo.adjustCause.length ? batchInfo.adjustCause.length : '0' }/50` }}</div>
              </div>
              <div class="singleReasonContent">
                <div class="reasonTopDiv">
                  <div class="reasonTitle">历史调整原因</div>
                  <div class="reasonEditButton" @click="goDeleteReason" v-permission="'/creditsChangeCause/delete@post'">编辑</div>
                </div>
                <div class="reasonTagDiv" v-if="historyReasonList.length !== 0">
                  <a-tag :closable="isCloseReason" v-for="item in historyReasonList" :key="item" @click="chooseHistoryTag(item)" @close="deleteHistoryTag($event, item)">
                    <a-popover title="" v-if="item.length > 10">
                      <template slot="content">
                        <div class="labelBox">
                          {{ item }}
                        </div>
                      </template>
                      <div>{{ returnReasonText(item) }}</div>
                    </a-popover>
                    <div v-else-if="item.length <= 10">{{ item }}</div>
                  </a-tag>
                  <!-- <div class="singleReasonTag" v-for="item in historyReasonList" :key="item">{{ item }}
                    <div class="singleDelete">X</div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
      <template slot="footer">
        <a-button
          :disabled="batchInfoModalLoading === true"
          @click="closeIntegralBatchModal"
        >取消</a-button>
        <a-button
          :disabled="batchInfoModalLoading === true"
          type="primary"
          @click="confirmIntegralBatch"
          v-permission="'/creditsEmployee/updateCreditsEmployee@post'">确定</a-button>
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
import { deepClonev2 } from '@/utils/util'
import { departmentEmp, getDict } from '@/api/common.js'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
import SelectModal from '@/components/SelectPersonnel/components/modal'
import { getCustomerIntegralApi, exportCustomerIntegralApi, batchCustomerIntegralApi, getHistoryReasonApi, deleteHistoryReasonApi } from '@/api/integralManager'
export default {
  name: 'BackendIntegralManager',
  components: {
    SelectModal
  },
  watch: {
    'batchInfo.adjustCause' (e) {
      if (e && e.length > 50) {
        this.batchInfo.adjustCause = e.slice(0, 50)
      }
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dialogTitle: '',
      isCloseReason: false, // 历史调整原因是否可删除
      historyReasonList: [],
      deepClonev2,
      // 批量处理积分弹框加载动画
      batchInfoModalLoading: false,
      // 调整类型列表
      changeTypeList: [],
      // 选中的表格数据
      selectedKeyList: [],
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
    // this.$set(this.screenData, 'employeeIdList', [])
    // if (tempPage) {
    //   this.$set(this.pagination, 'current', Number(tempPage))
    // } else {
    //   this.$set(this.pagination, 'current', 1)
    // }
    // this.getTableData()
    // this.tableData = getTempIntegralManagerData()
    // 获取正式的数据
    this.getDataList()
  },

  methods: {
    // 返回调整原因(最多显示10个字)
    returnReasonText (text) {
      if (text.length > 10) {
        return text.slice(0, 10) + '...'
      } else {
        return text
      }
    },
    // 点击历史标签
    chooseHistoryTag (item) {
      console.log(item, '选择标签')
      const oldText = this.batchInfo.adjustCause
      let newText = oldText + item
      if (newText.length > 50) {
        // 合成的新长度大于50
        newText = newText.slice(0, 50)
      }
      this.$set(this.batchInfo, 'adjustCause', newText)
    },
    // 去删除原因
    goDeleteReason () {
      this.isCloseReason = !this.isCloseReason
    },
    // 获取历史调整原因
    getHistoryList () {
      getHistoryReasonApi().then(response => {
        this.historyReasonList = response.data.causeName.slice(0, 10)
      })
    },
    // 删除历史原因
    deleteHistoryTag (e, text) {
      this.batchInfoModalLoading = true
      const params = { causeName: text }
      // debugger
      e.preventDefault()
      deleteHistoryReasonApi(params).then(response => {
        if (response.code === 200) {
          this.batchInfoModalLoading = false
          this.getHistoryList()
        }
      }).catch(() => {
        this.batchInfoModalLoading = false
      })
    },
    // 获取数据
    async getDataList () {
      this.tableLoading = true
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        ...this.screenData,
        employeeIdList: this.screenData.employeeIdList && this.screenData.employeeIdList.length !== 0
          ? this.screenData.employeeIdList : []
      }
      // debugger
      // console.log(params, '查询数据提交接口的对象')
      await getCustomerIntegralApi(params).then(response => {
        this.tableLoading = false
        console.log(response, '获取员工积分列表')
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
    // 查询数据
    goSearchData () {
      this.$set(this.pagination, 'current', 1)
      this.getDataList()
    },
    // 重置数据
    goResetData () {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.screenData, 'employeeIdList', [])
      this.getDataList()
    },
    // 导出员工积分
    exportData () {
      const params = {
        ...this.screenData,
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        checkedRuleIdList: this.selectedKeyList.length !== 0 ? this.selectedKeyList : []
      }
      exportCustomerIntegralApi(params).then(response => {
        // console.log(response, '导出成功')
        callDownLoadByBlob(response, '员工积分')
      })
    },
    // 获取调整类型字典数据(发放,增加)
    async getChangeType () {
      const params = { dictType: 'integral_change_type' }
      await getDict(params).then(response => {
        console.log(response)
        this.changeTypeList = response.data
        this.$set(this.batchInfo, 'changeType', this.changeTypeList[0].code)
      })
      this.getHistoryList()
    },
    // 改变积分数字
    changeIntegralNumber (e) {
      let text = String(e)
      if (!/^[0-9]+$/.test(text)) {
        // 将不符合的部分清除
        // console.log('有效期有问题', text.replace(/\D/g,''))
        // console.log()
        text = text.replace(/\D/g, '')
      }
      if (Number(text) > 99999) {
        text = '99999'
      }
      if (!text) {
        text = '1'
      }
      this.$set(this.batchInfo, 'integral', String(text))
      // this.$set(this.batchInfo, 'integral', e ? String(e) : '1')
    },
    // 表格监听事件
    handleTableChange ({ current, pageSize }, filters, sorter) {
      let currentTypeText = ''
      console.log(sorter, 'sorter')
      // 获取点击的是那一列排序
      currentTypeText = sorter.columnKey + 'Sort'
      // debugger
      if (sorter.order) {
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
      for (const key in this.screenData) {
        if (key.indexOf('Sort') !== -1 && key !== currentTypeText) {
          // key带Sort,并且key不是当前点击的key
          this.$delete(this.screenData, `${key}`)
        }
      }
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getDataList()
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
    // 单击某一行的回调
    onSelectionChange (selectedRowKeys) {
      console.log(selectedRowKeys, '单击某一行的回调')
      // this.sendArray = record.listTaskInfo
      // const tempIdArray = []
      // tempIdArray.push(record.id)
      // this.selectedList = Object.assign([], tempIdArray)
      this.selectedKeyList = selectedRowKeys
    },
    // 调整积分弹框点击取消
    closeIntegralBatchModal () {
      if (!this.batchInfoModalLoading) {
        this.integralBatchShowStatus = false
      }
    },
    // 调整积分弹框点击确定
    confirmIntegralBatch () {
      if (!this.batchInfo.integral) {
        this.$message.error('请输入调整的积分值')
        return false
      }
      if (!this.batchInfo.adjustCause) {
        this.$message.error('请输入调整原因')
        return false
      }
      console.log(this.batchInfo, 'batchInfo')
      this.batchInfoModalLoading = true
      debugger
      batchCustomerIntegralApi(this.batchInfo).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.$message.success('批量处理成功')
          this.integralBatchShowStatus = false
          this.batchInfoModalLoading = false
          this.$set(this.pagination, 'current', 1)
          this.getDataList()
        }
      }).catch(() => {
        this.batchInfoModalLoading = false
      })
    },
    // 点击调整积分
    setIntegral (record) {
      this.batchInfo = {}
      this.integralBatchShowStatus = true
      this.getChangeType()
      this.dialogTitle = '调整积分'
      this.$nextTick(() => {
        const tempArray = []
        tempArray.push(record.id)
        this.$set(this.batchInfo, 'checkedRuleIdList', tempArray)
        this.$set(this.batchInfo, 'employeeIdList', [])
        this.$set(this.batchInfo, 'integral', '10')
      })
    },
    // 点击批量调整按钮
    goBatchChangeIntegral () {
      this.batchInfo = {}
      this.keys = []
      this.rows = []
      if (this.selectedKeyList.length !== 0) {
        // 有选项,直接弹出调整弹框
        this.integralBatchShowStatus = true
        this.getChangeType()
        this.$nextTick(() => {
          this.dialogTitle = '批量调整积分'
          this.$set(this.batchInfo, 'checkedRuleIdList', this.selectedKeyList)
          this.$set(this.batchInfo, 'employeeIdList', [])
          this.$set(this.batchInfo, 'integral', '10')
        })
      } else {
        // 无选项,先弹组织架构
        this.$refs.SelectPersonnel.modalShow = true
        departmentEmp().then(res => {
          // this.treeData = res.data
          // this.loading = false
          this.treeData = this.formatTree(res.data)
          // this.rows = this.getNodes(this.treeData, this.value)[0]
          // sessionStorage.setItem(this.curId, JSON.stringify(this.keys))
          // this.$refs.SelectPersonnel.modalShow = !state
        })
      }
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
      if (e && e.length !== 0) {
        this.$refs.SelectPersonnel.modalShow = false
        this.integralBatchShowStatus = true
        this.getChangeType()
        this.$nextTick(() => {
          this.dialogTitle = '批量调整积分'
          const tempArray = this.deepClonev2(e)
          this.$set(this.batchInfo, 'employeeIdList', tempArray)
          this.$set(this.batchInfo, 'checkedRuleIdList', [])
          this.$set(this.batchInfo, 'integral', '10')
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../css/integralManager.less');
</style>
