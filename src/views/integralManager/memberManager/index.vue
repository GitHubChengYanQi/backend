<template>
  <div>
    <!-- 会员列表 -->
    <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-row :gutter="10">
        <a-col :lg="6">
          <a-form-item label="搜索会员:">
            <a-input v-model="screenData.name" placeholder="请输入要搜索的会员姓名"></a-input>
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="手机号:">
            <a-input v-model="screenData.phone" placeholder="请输入要搜索的手机号"></a-input>
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="开卡员工:">
            <selectPersonnel
              class="selectPersonnelCom"
              name="请选择员工"
              :changeId="true"
              :num="1"
              v-model="screenData.employeeIdList"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="开卡方式:">
            <a-select
              :allowClear="true"
              class="pickSelectClass"
              placeholder="请选择"
              v-model="screenData.makeCardType"
            >
              <a-select-option v-for="item in openCardTypeList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="开卡方式:">
            <a-select
              :allowClear="true"
              class="pickSelectClass"
              placeholder="请选择"
              v-model="screenData.makeCardType"
            >
              <a-select-option v-for="item in openCardTypeList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="开卡时间:">
            <a-range-picker
              class="pickTimeClass"
              v-model="detailDateArray"
              :defaultPickerValue="defaultDateArray">
            </a-range-picker>
          </a-form-item>
        </a-col>
        <!-- <a-col :lg="6">
          <a-form-item label="企业标签:">
            <SelectTagInput v-model="screenData.typeInfo" :screentags="true" :changeId="true" ref="SelectTagInput" />
          </a-form-item>
        </a-col> -->
      </a-row>
      <div class="searchButtonWrapper">
        <a-button
          type="primary"
          style="margin: 0 10px;"
          @click="goSearchData"
        >查询</a-button>
        <a-button
          style="margin-right: 10px;"
          @click="goResetData"
        >重置</a-button>
      </div>
    </a-form>
    <div class="tableWrapper">
      <div class="topTableDiv">
        <div class="topDivText">
          {{ `共${tableDataList.length}个客户,已选择${selectedKeyList.length}个客户` }}
        </div>
        <div class="topRightDiv">
          <a-button style="margin: 0 10px;" @click="exportData">导出Excel</a-button>
          <!-- <a-button style="margin: 0 10px;" @click="batchMakeTag" :disabled="selectedKeyList.length === 0">批量打标签</a-button>
          <a-button style="margin: 0 10px;" @click="batchRemoveTag" :disabled="selectedKeyList.length === 0">批量移除标签</a-button> -->
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
        <!-- <div slot="nameContent" slot-scope="text, record">
            <div>{{ record.name }}</div>
            <div>{{ record.nickName }}</div>
          </div> -->
        <div slot="makeCardEmployeeName" slot-scope="text">
          {{ returnTableText(text) }}
        </div>
        <div slot="pztOrgName" slot-scope="text">
          {{ returnTableText(text) }}
        </div>
        <div slot="pztOrgExpoSite" slot-scope="text">
          {{ returnTableText(text) }}
        </div>
        <!-- <div slot="isQVFriend" slot-scope="text">
            {{ returnDictText(text, qvFriendTypeList) }}
          </div> -->
        <!-- <div slot="tagNameList" slot-scope="text">
            <a-popover title="客户标签">
              <template slot="content">
                <div class="labelBox">
                  {{ text.split(',') }}
                </div>
              </template>
              <a-tag type="button">
                查看
              </a-tag>
            </a-popover>
          </div> -->
        <div slot="makeCardTypeStr" slot-scope="text">
          {{ returnDictText(text, openCardTypeList) }}
        </div>
        <!-- <div slot="state" slot-scope="text, record">
            <template>
              <a-tag color="#1890ff" v-if="record.state === '1'">已启用</a-tag>
              <a-tag color="#d1d1d1" v-if="record.state === '0'">未启用</a-tag>
            </template>
          </div> -->
        <div slot="options" slot-scope="text, record">
          <template>
            <div style="display: flex;justify-content: space-between;">
              <a-button type="link" @click="goRecord(record)">消费记录</a-button>
            </div>
          </template>
        </div>
      </a-table>
    </div>
    <memberBuyRecord :showStatus.sync="memberBuyRecordShowStatus" :id="chooseRecordInfo.memberUserId"></memberBuyRecord>
  </div>
</template>

<script>
import { callDownLoadByBlob } from '@/utils/downloadUtil'
import memberBuyRecord from './component/memberBuyRecord.vue'
import moment from 'moment'
import { getDict } from '@/api/common'
import { getMemberListData, exportMemberListData } from '@/api/member'
export default {
  name: 'BackendIndex',
  data () {
    return {
      // 当前选择的消费记录对象
      chooseRecordInfo: {},
      // 消费记录弹框显示状态
      memberBuyRecordShowStatus: false,
      // 开卡方式数组
      openCardTypeList: [],
      // 表格加载动画
      tableLoading: false,
      // 选中的数组
      selectedKeyList: [],
      // 表格数组
      tableDataList: [],
      // 表格表头
      tableColumns: [
        {
          title: '会员姓名',
          dataIndex: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '开卡员工',
          dataIndex: 'makeCardEmployeeName',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'makeCardEmployeeName' }
        },
        {
          title: '所属门店',
          dataIndex: 'pztOrgName',
          align: 'center',
          scopedSlots: { customRender: 'pztOrgName' },
          width: 200
        },
        {
          title: '所属机构',
          dataIndex: 'pztOrgExpoSite',
          align: 'center',
          scopedSlots: { customRender: 'pztOrgExpoSite' },
          width: 150
        },
        {
          title: '开卡时间',
          dataIndex: 'makeCardTimeStr',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          align: 'center',
          width: 200
        },
        {
          title: '开卡方式',
          dataIndex: 'makeCardTypeStr',
          align: 'center',
          scopedSlots: { customRender: 'makeCardTypeStr' },
          width: 200
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      // 表格翻页信息
      // 模板页面分页对象
      tablePagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      // 搜索对象
      screenData: {},
      detailDateArray: [],
      defaultDateArray: ['YYYY-MM-DD', 'YYYY-MM-DD']
    }
  },
  components: {
    memberBuyRecord
  },
  created () {
    this.getOpenCardType()
    // this.getData()
  },
  methods: {
    // 获取消费记录
    goRecord (info) {
      // console.log(id, '获取消费记录')
      this.memberBuyRecordShowStatus = true
      this.$nextTick(() => {
        this.chooseRecordInfo = Object.assign({}, info)
      })
    },
    // 获取开卡方式字典
    async getOpenCardType () {
      const params = { dictType: 'make_card_type' }
      await getDict(params).then(response => {
        this.openCardTypeList = response.data
      })
    },
    // 根据字典返回字段
    returnDictText (text, array) {
      const tempArray = array.filter(item => item.code === text)
      return tempArray[0].name
    },
    // 返回表格中的数据
    returnTableText (text) {
      const tempText = text || '/'
      return tempText
    },
    // 获取数据列表
    async getData () {
      this.tableLoading = true
      if (this.screenData.employeeIdList.length !== 0) {
        this.$set(this.screenData, 'makeCardEmployeeIdStr', this.screenData.employeeIdList.join(','))
      } else {
        this.$set(this.screenData, 'makeCardEmployeeIdStr', '')
      }
      if (this.detailDateArray.length === 0) {
        // 时间段数组长度为0
        this.$delete(this.screenData, 'beginTime')
        this.$delete(this.screenData, 'endTime')
      } else {
        const tempStartDate = moment(this.detailDateArray[0]).format('YYYY-MM-DD') + ' 00:00:00'
        const tempEndDate = moment(this.detailDateArray[1]).format('YYYY-MM-DD') + ' 00:00:00'
        this.$set(this.screenData, 'beginTime', tempStartDate)
        this.$set(this.screenData, 'endTime', tempEndDate)
      }
      const params = {
        page: this.tablePagination.current,
        perPage: this.tablePagination.pageSize,
        ...this.screenData
      }
      console.log(params, '查询列表提交对象')
      await getMemberListData(params).then(response => {
        this.tableLoading = false
        console.log(response, '获取员工积分列表')
        this.tableData = response.data.list
        this.$set(this.tablePagination, 'total', Number(response.data.page.total))
        if (this.tableData.length === 0) {
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
      }).catch(() => {
        this.tableLoading = false
      })
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
    // 查询数据
    goSearchData () {
      this.$set(this.tablePagination, 'current', 1)
      this.getData()
    },
    // 重置数据
    goResetData () {
      this.$set(this.tablePagination, 'current', 1)
      this.screenData = {}
      this.defaultDateArray = []
      // this.screenData.employeeIdList
      this.$set(this.screenData, 'employeeIdList', [])
      this.getData()
    },
    // 导出会员列表
    exportData () {
      const params = {
        ...this.screenData,
        page: this.tablePagination.current,
        perPage: this.tablePagination.pageSize
      }
      console.log(params, 'params')
      exportMemberListData(params).then(response => {
        // console.log(response, '导出成功')
        // 导出的文件名
        callDownLoadByBlob(response, '会员列表')
      })
    },
    // 表格监听事件
    handleTableChange ({ current, pageSize }, filters, sorter) {
      console.log(sorter, 'sorter')
      // 获取点击的是那一列排序
      // currentTypeText = sorter.columnKey + 'Sort'
      // debugger
      if (sorter.order) {
        // this.$set(this.screenData, 'orderBySortCode', currentTypeText)
        if (sorter.order === 'ascend') {
        // 正序
          this.$set(this.screenData, 'markCardSort', 'ASC')
        } else {
        // 逆序
          this.$set(this.screenData, 'markCardSort', 'DESC')
        }
      } else {
        // 无需排序
        this.$delete(this.screenData, 'markCardSort')
      }
      // for (const key in this.screenData) {
      //   if (key.indexOf('Sort') !== -1 && key !== currentTypeText) {
      //   // key带Sort,并且key不是当前点击的key
      //     this.$delete(this.screenData, `${key}`)
      //   }
      // }
      this.tablePagination.current = current
      this.tablePagination.pageSize = pageSize
      this.getData()
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
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./css/index.less');
</style>
