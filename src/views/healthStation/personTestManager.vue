<template>
  <div>
    <div class="topSearchWrapper">
      <div class="searchInputLine">
        <div class="singleSearchDiv">
          <div class="singleLabelDiv">机构/员工:</div>
          <SelectPersonAll
            class="singleInputDiv"
            name="请输入机构/员工"
            :changeId="true"
            :num="1"
            v-model="screenData.employeeIds"
            @getVal="employeeIdsChange"
          />
          <!-- <a-input class="singleInputDiv" v-model="screenData.name" placeholder="请输入机构/员工" :allowClear="true"></a-input> -->
        </div>
        <div class="singleSearchDiv">
          <div class="singleLabelDiv">检测时间:</div>
          <a-range-picker class="pickTimeClass" v-model="totalDateArray" :format="dateFormatList" @change="changeRange"></a-range-picker>
        </div>
        <div class="singleSearchDiv">
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
    </div>
    <!-- :row-key="record => record.id" -->
    <a-table
      :row-key="record => record.empId"
      :loading="tableLoading"
      :data-source="tableDataList"
      :columns="tableColumns"
      :pagination="tablePagination"
      :row-selection="{ selectedRowKeys: selectedKeyList, onChange: onSelectionChange }"
      @change="handleTableChange"
      class="tableBox"
      :scroll="{ x: 1500}">
      <div slot="empName" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="orgName" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="detectionPeopleNumAll" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="detectionMemberUserNumAll" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="detectionAllNumAll" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="detectionBloodPressureNumAll" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="detectionBloodGlucoseNumAll" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="devicesBloodFatNumAll" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="detectionUricAcidNumAll" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
    </a-table>
  </div>
</template>
<script>
import moment from 'moment'
import { deepClonev2 } from '@/utils/util'
import { managerTestApi, exportManagerTestApi } from '@/api/healthTest'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
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
      // 列表表头
      tableColumns: [
        {
          title: '员工姓名',
          dataIndex: 'empName',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'empName' }
        },
        {
          title: '所属机构',
          dataIndex: 'orgName',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'orgName' }
        },
        {
          title: '检测人数',
          dataIndex: 'detectionPeopleNumAll',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'detectionPeopleNumAll' }
        },
        {
          title: '检测会员数',
          dataIndex: 'detectionMemberUserNumAll',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'detectionMemberUserNumAll' }
        },
        {
          title: '检测总次数',
          dataIndex: 'detectionAllNumAll',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'detectionAllNumAll' }
        },
        {
          title: '检测血压次数',
          dataIndex: 'detectionBloodPressureNumAll',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'detectionBloodPressureNumAll' }
        },
        {
          title: '检测血糖次数',
          dataIndex: 'detectionBloodGlucoseNumAll',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'detectionBloodGlucoseNumAll' }
        },
        {
          title: '检测血脂次数',
          dataIndex: 'devicesBloodFatNumAll',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'devicesBloodFatNumAll' }
        },
        {
          title: '检测尿酸次数',
          dataIndex: 'detectionUricAcidNumAll',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'detectionUricAcidNumAll' }
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
    this.screenData = {
      employeeIds: []
    }
    this.getData()
  },

  methods: {
    // 单击某一行的回调
    onSelectionChange (selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, '单击某一行的回调', selectedRows)
      // this.sendArray = record.listTaskInfo
      // const tempIdArray = []
      // tempIdArray.push(record.id)
      // this.selectedList = Object.assign([], tempIdArray)
      this.selectedKeyList = selectedRowKeys
    },
    // 日期选择回调
    changeRange (e) {
      this.$set(this.screenData, 'beginTime', moment(e[0]).format('YYYY-MM-DD'))
      this.$set(this.screenData, 'endTime', moment(e[1]).format('YYYY-MM-DD'))
    },
    // 获取数据
    getData () {
      const params = {
        page: this.tablePagination.current,
        perPage: this.tablePagination.pageSize,
        ...this.screenData
      }
      console.log(params, '查询列表提交对象')
      this.tableLoading = true
      // 这里请求接口
      managerTestApi(params).then(response => {
        // this.tableDataList = response.data.list
        this.tableLoading = false
        console.log(response, '获取员工检测数据')
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
      this.getData()
    },
    // 表格为空时显示"-"验证
    returnTableText (text) {
      const tempText = text || '-'
      return tempText
    },
    // 导出按钮
    exportData () {
      // const params = {
      //   ...this.screenData,
      //   idStr: this.selectedKeyList.length !== 0 ? this.selectedKeyList.join(',') : ''
      // }
      const params = {
        page: this.tablePagination.current,
        perPage: this.tablePagination.pageSize,
        idStr: this.selectedKeyList.length !== 0 ? this.selectedKeyList.join(',') : '',
        ...this.screenData
      }
      this.tableLoading = true
      exportManagerTestApi(params).then(response => {
        this.tableLoading = false
        callDownLoadByBlob(response, '员工检测数据')
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./css/customerTestTop.less');
</style>
