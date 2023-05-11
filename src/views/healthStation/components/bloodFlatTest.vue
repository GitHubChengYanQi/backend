<template>
  <div>
    <div class="topSearchWrapper">
      <div class="searchInputLine">
        <div class="singleSearchDiv">
          <div class="singleLabelDiv">机构/员工:</div>
          <SelectPersonAll
            class="singleInputDiv"
            name="请选择机构/员工"
            :changeId="true"
            :num="1"
            v-model="screenData.employeeIds"
            @getVal="employeeIdsChange"
          />
          <!-- <a-input class="singleInputDiv" v-model="screenData.name" placeholder="请输入机构/员工" :allowClear="true"></a-input> -->
        </div>
        <div class="singleSearchDiv">
          <div class="singleLabelDiv">客户名称:</div>
          <a-input class="singleInputDiv" v-model="screenData.customerName" placeholder="请输入客户名称" :allowClear="true"></a-input>
        </div>
        <div class="singleSearchDiv">
          <div class="singleLabelDiv">是否会员:</div>
          <a-select
            class="pickSelectClass"
            placeholder="请选择"
            v-model="screenData.isMemberCenterUser"
          >
            <a-select-option v-for="item in memberRelativeList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
          </a-select>
        </div>
        <div class="singleSearchDiv">
          <div class="singleLabelDiv">检测时间:</div>
          <a-range-picker class="pickTimeClass" v-model="totalDateArray" :format="dateFormatList" @change="changeRange"></a-range-picker>
        </div>
      </div>
      <div class="searchButtonLine">
        <a-button
          type="primary"
          style="margin: 0 10px;"
          @click="searchMethod"
        >查询</a-button>
        <a-button
          style="margin-right: 10px;"
          @click="resetMethod"
        >重置</a-button>
        <a-button
          type="primary"
          @click="exportData"
        >导出</a-button>
      </div>
    </div>
    <a-table
      :loading="tableLoading"
      :row-key="record => record.id"
      :data-source="tableDataList"
      :columns="tableColumns"
      :pagination="tablePagination"
      :row-selection="{ selectedRowKeys: selectedKeyList, onChange: onSelectionChange }"
      @change="handleTableChange"
      class="tableBox"
      :scroll="{ x: 1500}">
      <div slot="orgName" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="empName" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="devicesCustomerName" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="phone" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="isMemberCenterUserStr" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="detectionTimeStr" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="tcStr" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="tgStr" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="hdlStr" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="ldlStr" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="dataSources" slot-scope="text">
        {{ returnDataSourceText(text) }}
      </div>
      <div slot="bloodFatDiagnosisResultVo" slot-scope="text, record">
        <div
          :style="{color: record.bloodFatDiagnosisResultVo.color}"
          v-if="record.bloodFatDiagnosisResultVo
            && record.bloodFatDiagnosisResultVo.diagnosticResultsName">
          {{ record.bloodFatDiagnosisResultVo.diagnosticResultsName }}
        </div>
      </div>
    </a-table>
  </div>
</template>
<script>
import moment from 'moment'
import { getDict } from '@/api/common'
import { bloodFlatTestApi, exportBloodFlatTestApi } from '@/api/healthTest'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
import { deepClonev2 } from '@/utils/util'
export default {
  name: 'BackendBloodPressureTest',
  data () {
    return {
      // 搜索对象
      screenData: {},
      // 检测时间段数组
      totalDateArray: [],
      // 检测时间格式化数组
      dateFormatList: ['YYYY-MM-DD', 'YYYY-MM-DD'],
      // 是否为会员关系数组(字典)
      memberRelativeList: [],
      // 列表加载动画
      tableLoading: true,
      // 列表数据
      tableDataList: [],
      // 列表表头数据
      tableColumns: [
        {
          title: '机构名称',
          dataIndex: 'orgName',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'orgName' }
        },
        {
          title: '检测员工',
          dataIndex: 'empName',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'empName' }
        },
        {
          title: '客户',
          dataIndex: 'devicesCustomerName',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'devicesCustomerName' }
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'phone' }
        },
        {
          title: '是否会员',
          dataIndex: 'isMemberCenterUserStr',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'isMemberCenterUserStr' }
        },
        {
          title: '检测时间',
          dataIndex: 'detectionTimeStr',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'detectionTimeStr' }
        },
        {
          title: '总胆固醇',
          dataIndex: 'tcStr',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'tcStr' }
        },
        {
          title: '甘油三酯',
          dataIndex: 'tgStr',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'tgStr' }
        },
        {
          title: '高密度脂蛋白',
          dataIndex: 'hdlStr',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'hdlStr' }
        },
        {
          title: '低密度脂蛋白',
          dataIndex: 'ldlStr',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'ldlStr' }
        },
        {
          title: '数据来源',
          dataIndex: 'dataSources',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'dataSources' }
        },
        {
          title: '诊断结果',
          dataIndex: 'bloodFatDiagnosisResultVo',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'bloodFatDiagnosisResultVo' }
        }
      ],
      // 已选中列表
      selectedKeyList: [],
      // 列表翻页对象
      tablePagination: {
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
    console.log('created')
    this.screenData = {
      employeeIds: []
    }
    this.getMemberRelativeMethod()
  },

  methods: {
    returnIsMemberTableText (text) {
      const tempArray = this.memberRelativeList.filter(item => item.code === text)
      return tempArray[0].name
    },
    // 返回数据来源
    returnDataSourceText (text) {
      if (text === '1') {
        return '智能设备'
      } else {
        return '-'
      }
    },
    // 单击某一行的回调
    onSelectionChange (selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, '单击某一行的回调', selectedRows)
      // this.sendArray = record.listTaskInfo
      // const tempIdArray = []
      // tempIdArray.push(record.id)
      // this.selectedList = Object.assign([], tempIdArray)
      this.selectedKeyList = selectedRowKeys
    },
    // 获取是否关联机构
    async getMemberRelativeMethod () {
      const params = { dictType: 'yes_no' }
      await getDict(params).then(response => {
        this.memberRelativeList = response.data
        this.memberRelativeList.unshift({
          code: '-1',
          name: '全部'
        })
      })
      this.$set(this.screenData, 'isMemberCenterUser', this.memberRelativeList[0].code)
      this.getData()
    },
    // 获取数据
    getData () {
      const params = {
        page: this.tablePagination.current,
        perPage: this.tablePagination.pageSize,
        ...this.screenData
      }
      params.isMemberCenterUser = params.isMemberCenterUser === '-1' ? '' : params.isMemberCenterUser
      this.tableLoading = true
      console.log(params, '查询列表提交对象')
      // 这里请求接口
      bloodFlatTestApi(params).then(response => {
        // this.tableDataList = response.data.list
        this.tableLoading = false
        console.log(response, '获取血脂列表')
        this.tableDataList = response.data.list
        this.$set(this.tablePagination, 'total', Number(response.data.page.total))
        if (this.tableDataList.length === 0) {
          // 列表中没有数据
          if (this.tablePagination.total !== 0) {
            // 总数据有,但当前页没有
            // 重新将页码换成1
            this.$set(this.tablePagination, 'current', 1)
            this.getData()
          } else {
            // 是真没有数据
          }
        }
      })
    },
    // 翻页操作
    handleTableChange ({ current, pageSize }, filters, sorter) {
      if (current) {
        this.selectedKeyList = []
      }
      this.tablePagination.current = current
      this.tablePagination.pageSize = pageSize
      this.getData()
    },
    // 组织机构选择回调
    employeeIdsChange (e) {
      console.log(e, '组织机构选择回调')
      // debugger
      const tempArray = deepClonev2(e)
      if (typeof tempArray[0] === 'object') {
        const tempPersonList = tempArray.filter(item => item.isLeaf === '1')
        const tempDepartList = tempArray.filter(item => item.isLeaf === '0')
        this.$set(this.screenData, 'orgIdStr', tempPersonList.map(item => item.id).join(','))
        this.$set(this.screenData, 'empIdStr', tempDepartList.map(item => item.id).join(','))
      }
      // this.$set(this.screenData, 'employeeIds', e)
    },
    // 日期选择回调
    changeRange (e) {
      this.$set(this.screenData, 'beginTime', moment(e[0]).format('YYYY-MM-DD'))
      this.$set(this.screenData, 'endTime', moment(e[1]).format('YYYY-MM-DD'))
    },
    // 查询按钮
    searchMethod () {
      this.$set(this.tablePagination, 'current', 1)
      this.getData()
    },
    // 重置按钮
    resetMethod () {
      this.$set(this.tablePagination, 'current', 1)
      this.screenData = {}
      this.$set(this.screenData, 'employeeIds', [])
      this.totalDateArray = []
      this.$set(this.screenData, 'isMemberCenterUser', this.memberRelativeList[0].code)
      this.getData()
    },
    // 表格为空时显示"-"验证
    returnTableText (text) {
      const tempText = text || '-'
      return tempText
    },
    // 导出按钮
    exportData () {
      const params = {
        ...this.screenData,
        idStr: this.selectedKeyList.length !== 0 ? this.selectedKeyList.join(',') : ''
      }
      params.isMemberCenterUser = params.isMemberCenterUser === '-1' ? '' : params.isMemberCenterUser
      this.tableLoading = true
      exportBloodFlatTestApi(params).then(response => {
        this.tableLoading = false
        callDownLoadByBlob(response, '血脂数据')
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../css/customerTestTop.less');
</style>
