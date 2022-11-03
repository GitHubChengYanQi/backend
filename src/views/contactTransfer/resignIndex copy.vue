<template>
  <div class="resign-index">
    <div class="tab">
      <a-tabs default-active-key="1" class="w-tabs" v-model="currentTab" @change="tabSwitch">
        <a-tab-pane key="0" tab="待分配客户"/>
        <a-tab-pane key="1" tab="待分配群聊"/>
      </a-tabs>
    </div>
    <a-card class="mb16">
      <a-form>
        <a-row :gutter="16" v-if="currentTab === '0'">
          <a-col :lg="6" :md="6">
            <a-form-item
              label="客户姓名："
              :labelCol="{lg: {span: 7} }"
              :wrapperCol="{lg: {span: 17} }">
              <a-input v-model="screenData.contactName" placeholder="请输入客户姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="6">
            <a-form-item
              label="所属员工："
              :labelCol="{lg: {span: 7} }"
              :wrapperCol="{lg: {span: 17} }">
              <selectPersonnel v-model="screenData.employeeId" :multiple="true" :num="1" :type="'selector'" />
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="6">
            <a-form-item
              label="添加日期："
              :labelCol="{lg: {span: 7} }"
              :wrapperCol="{lg: {span: 17} }">
              <a-range-picker
                style="width:300px"
                v-model="time"
                format="YYYY-MM-DD"
                :placeholder="['开始日期', '结束日期']"
                @change="onOk"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="6" style="text-align: center;">
            <a-button @click="retrievalClient" style="margin-right:20px;">搜索</a-button>
            <a-button @click="resetBtn">重置</a-button>
          </a-col>
        </a-row>
        <a-row v-if="currentTab === '1'">
          <a-col :lg="6" :md="6">
            <a-form-item
              label="群名称："
              :labelCol="{lg: {span: 7} }"
              :wrapperCol="{lg: {span: 17} }">
              <a-input v-model="screenData.roomName" placeholder="请输入要搜索的群名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="6" style="text-align: center;">
            <a-button @click="retrievalClient" style="margin-right:20px;">搜索</a-button>
            <a-button @click="resetBtn">重置</a-button>
          </a-col>
        </a-row>
      </a-form>

    </a-card>
    <a-card>
      <div class="flex">
        <div class="info-box">
          <span class="f-blod">共{{ table.data.length }}个待分配客户</span>
          <a-divider type="vertical"/>
          <span class="desc-text" v-if="currentTab==0">上次同步时间：{{ synchroTime }}</span>
        </div>
        <div class="btn-box">
          <a-button
            type="primary"
            ghost
            v-if="currentTab==0"
            @click="allocation"
            v-permission="'/contactTransfer/resignIndex@allocation'"
          >分配客户</a-button>
          <a-button type="primary" ghost v-else @click="distributionGroup" v-permission="'/contactTransfer/resignIndex@distributionGroup'">分配群聊</a-button>
          <a-button type="primary" ghost @click="$router.push('/contactTransfer/resignAllotRecord')" v-permission="'/contactTransfer/resignIndex@resignAllotRecord'">分配记录</a-button>
          <a-button type="primary" ghost v-if="currentTab==0" @click="updateTo" v-permission="'/contactTransfer/resignIndex@updateTo'">同步</a-button>
        </div>
        <!--        选择员工、群聊弹窗-->
        <selectStaff ref="choiceStaff" @change="acceptData" />
      </div>
      <div class="table mt20">
        <a-table
          :columns="currentTab==0?table.clientCol:table.groupCol"
          :data-source="table.data"
          :row-selection="{selectedRowKeys:table.rowSelection,onChange: onSelectChange}"
          :pagination="pagination"
          @change="table.rowSelection = []"
        >
          <!--     待分配客户     -->
          <div slot="employeeName" slot-scope="text">
            <a-tag><a-icon type="user" />{{ text }}</a-tag>
          </div>
          <div slot="tags" slot-scope="text,row">
            <!--            <a-tag v-for="(item,index) in text" :key="index">{{ item }}</a-tag>-->
            <template>
              <div
                class="label_box"
                v-if="row.tags"
              >
                <span
                  class="label"
                  v-for=" (item ,index) in row.tags.slice(0,1)"
                  :key="index"
                >{{ item }}</span>
                <span
                  class="spread"
                  v-if="row.tags.length > 1"
                  @mouseenter="setSpread(row,'tag')"
                >
                  <svg-icon :state="3" />
                </span>
                <div
                  class="hidden_div"
                  @mouseleave="setSpread(row,'tag')"
                  v-if="spread['tag'].includes(row.tagKey)"
                >
                  <div
                    class="hidden_span"
                    v-for=" (item , index) in row.tags"
                    :key="index"
                  >{{ item }}</div>
                </div>
              </div>
            </template>
          </div>
          <div slot="state" slot-scope="text">
            <span v-if="text==1">接替完毕</span>
            <span v-if="text==2">等待接替</span>
            <span v-if="text==3">客户拒绝</span>
            <span v-if="text==4">接替成员客户达到上限</span>
            <span v-if="text==5">无接替记录</span>
          </div>
          <div slot="operation" slot-scope="text,record">
            <a @click="$router.push({ path: '/workContact/contactFieldPivot?contactId='+record.contactId+'&employeeId=&isContact=2'})">客户详情</a>
          </div>
          <!--     群聊     -->
          <div slot="owner" slot-scope="text">
            <a-tag><a-icon type="user" />{{ text }}</a-tag>
          </div>
          <!--          <div slot="handGroup" slot-scope="text,record">-->
          <!--            <a @click="$router.push(`/workRoom/statistics?workRoomId=${record.roomId}`)">-->
          <!--              群聊详情-->
          <!--            </a>-->
          <!--          </div>-->
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import { unassignedListApi, roomApi, saveUnassignedListApi, allotContactApi, allotRoomApi } from '@/api/contactTransfer'
import selectStaff from '@/components/addlabel/selectStaff'
import SvgIcon from '../clientFollow/components/SvgIcon.vue'
export default {
  components: { selectStaff, SvgIcon },
  data () {
    return {
      time: [],
      synchroTime: '',
      currentTab: '0',
      // 展示员工数据
      showEmployee: [],
      // 展示筛选时间
      showTimeSearch: [],
      // 请求数据 客户
      paramsAskClient: {
        employeeId: '',
        contactName: '',
        addTimeStart: '',
        addTimeEnd: ''
      },
      // 选中表格数据
      tableSelectClient: [],
      // 请求群组
      paramsAskGroup: {
        roomName: ''
      },
      table: {
        // 离职待分配客户列表
        clientCol: [
          {
            key: 'nickName',
            dataIndex: 'nickName',
            title: '客户昵称'
          },
          {
            key: 'employeeName',
            dataIndex: 'employeeName',
            title: '所属员工',
            scopedSlots: { customRender: 'employeeName' }
          },
          {
            key: 'tags',
            dataIndex: 'tags',
            title: '客户标签',
            scopedSlots: { customRender: 'tags' }
          },
          {
            key: 'addTime',
            dataIndex: 'addTime',
            title: '添加时间'
          },
          {
            key: 'lastMsgTime',
            dataIndex: 'lastMsgTime',
            title: '上次对话时间'
          },
          {
            key: 'addWay',
            dataIndex: 'addWay',
            title: '添加渠道'
          },
          {
            dataIndex: 'state',
            title: '接替状态',
            scopedSlots: { customRender: 'state' }
          },
          {
            key: 'operation',
            dataIndex: 'operation',
            title: '操作',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        // 离职待分配客户群
        groupCol: [
          {
            key: 'roomName',
            dataIndex: 'roomName',
            title: '群聊名称'
          },
          {
            key: 'owner',
            dataIndex: 'owner',
            title: '群主',
            scopedSlots: { customRender: 'owner' }
          },
          {
            key: 'userNum',
            dataIndex: 'userNum',
            title: '群人数'
          },
          {
            key: 'addNum',
            dataIndex: 'addNum',
            title: '今日入群'
          },
          {
            key: 'quitNum',
            dataIndex: 'quitNum',
            title: '今日退群'
          },
          {
            key: 'createTime',
            dataIndex: 'createTime',
            title: '创群时间'
          },
          {
            key: 'handGroup',
            dataIndex: 'handGroup',
            title: '操作',
            scopedSlots: { customRender: 'handGroup' }
          }
        ],
        data: [],
        // 离职待分配
        rowSelection: []
      },
      spread: {
        tag: []
      },
      screenData: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  created () {
    if (this.currentTab == 0) {
      this.getClientTableData(this.paramsAskClient)
    } else if (this.currentTab == 1) {
      this.getGroupTable(this.paramsAskGroup)
    }
  },
  methods: {
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      const sort = {}
      if (sorter.order) {
        if (sorter.order === 'ascend') {
          sort.sort = `${sorter.field}Asc`
        } else {
          sort.sort = `${sorter.field}Desc`
        }
      }
      this.screenData = { ...this.screenData, ...sort }
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getTableData()
    },
    setSpread (e, key) {
      if (!this.spread[key].includes(e.tagKey)) {
        this.spread[key] = [...this.spread[key], e.tagKey]
      } else {
        this.spread[key] = this.spread[key].filter((item) => {
          return item != e.tagKey
        })
      }
      this.$forceUpdate()
    },
    // 同步
    updateTo () {
      this.table.data = []
      saveUnassignedListApi().then((res) => {
        this.getClientTableData(this.paramsAskClient)
        this.$message.success('同步成功')
      })
    },
    // 获取待分配客户表格数据
    getClientTableData (params) {
      this.table.rowSelection = []
      this.table.data = []
      unassignedListApi(params).then((res) => {
        this.table.data = res.data.list
        this.synchroTime = res.data.lastTime
      })
    },
    // 获取当前时间
    getCurrentTime () {
      const date = new Date()
      const year = date.getFullYear()
      const month = new Date().getMonth() + 1
      const day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      const hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      return year + '-' + month + '-' + day + ' ' + hh + ':' + mm
    },
    // 获取选中的表格数据
    onSelectChange (e) {
      this.tableSelectClient = []
      this.table.rowSelection = e
      if (this.currentTab == 0) {
        e.forEach((item) => {
          const askRowData = {
            employeeWxId: '',
            contactWxId: ''
          }
          askRowData.employeeWxId = this.table.data[item].employeeWxId
          askRowData.contactWxId = this.table.data[item].contactWxId
          this.tableSelectClient.push(askRowData)
        })
      } else {
        e.forEach((item, index) => {
          this.tableSelectClient[index] = this.table.data[item].chatId
        })
      }
    },
    // 待分配客户
    // 分配客户
    allocation () {
      if (this.tableSelectClient == '') {
        this.$message.warning('请选择客户')
        return false
      }
      this.$refs.choiceStaff.show(0)
    },
    // 分配群聊
    distributionGroup () {
      if (this.tableSelectClient == '') {
        this.$message.warning('请选择群聊')
        return false
      }
      this.$refs.choiceStaff.show(0)
    },
    // 接收组件传值
    acceptData (e) {
      if (this.currentTab == 0) {
        const params = {
          type: 1,
          list: JSON.stringify(this.tableSelectClient),
          takeoverUserId: e
        }
        allotContactApi(params).then((res) => {
          // let successNum = 0
          // let errNum = 0
          // res.data.forEach((item, index) => {
          //   if (item.errcode == 0) {
          //     successNum++
          //   } else {
          //     errNum++
          //   }
          // })
          this.$message.info('分配成功')
          this.table.rowSelection = []
          this.getClientTableData(this.paramsAskClient)
        })
      } else {
        const params = {
          type: 1,
          list: JSON.stringify(this.tableSelectClient),
          takeoverUserId: e
        }
        allotRoomApi(params).then((res) => {
          // let successNum = 0
          // let errNum = 0
          // res.data.forEach((item, index) => {
          //   if (item.errcode == 0) {
          //     successNum++
          //   } else {
          //     errNum++
          //   }
          // })
          this.$message.info('分配成功')
          this.table.rowSelection = []
          this.getGroupTable(this.paramsAskGroup)
        })
      }
    },
    // 重置
    resetBtn () {
      this.paramsAskClient = {}
      this.showEmployee = []
      this.showTimeSearch = []
      this.paramsAskGroup = {}
      if (this.currentTab == 0) {
        this.getClientTableData(this.paramsAskClient)
      } else if (this.currentTab == 1) {
        this.getGroupTable(this.paramsAskGroup)
      }
    },
    // 接收成员组件数据
    effectStaff (e) {
      this.showEmployee = e
      this.paramsAskClient.employeeId = e.join(',')
    },
    // 搜索客户
    retrievalClient () {
      if (this.currentTab == 0) {
        this.getClientTableData(this.paramsAskClient)
      } else if (this.currentTab == 1) {
        this.getGroupTable(this.paramsAskGroup)
      }
    },
    // 清空客户输入框
    emptyClientIpt () {
      // if (this.paramsAskClient.contactName == '') {
      // this.getClientTableData(this.paramsAskClient)
      // }
    },
    // 检索日期
    retrievalDate (date, dateString) {
      this.paramsAskClient.addTimeStart = dateString[0]
      this.paramsAskClient.addTimeEnd = dateString[1]
      // this.getClientTableData(this.paramsAskClient)
    },
    // 待分配群聊
    // 搜索群名称
    retrievalGroup () {
      this.getGroupTable(this.paramsAskGroup)
    },
    // 清空群名称
    emptyGroupIpt () {
      // if (this.paramsAskGroup.roomName == '') {
      //   this.getGroupTable(this.paramsAskGroup)
      // }
    },
    // 获取分配群列表数据
    getGroupTable (params) {
      roomApi(params).then((res) => {
        this.table.data = res.data
      })
    },
    // 切换面板
    tabSwitch (e) {
      this.currentTab = e
      this.table.data = []
      this.table.rowSelection = []
      if (this.currentTab == 0) {
        this.getClientTableData(this.paramsAskClient)
      } else if (this.currentTab == 1) {
        this.getGroupTable(this.paramsAskGroup)
      }
    },
    /**
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      this.screenData.addTimeStart = moment(value[0]).format('YYYY-MM-DD')
      this.screenData.addTimeEnd = moment(value[1]).format('YYYY-MM-DD')
    }
  }
}
</script>
<style lang="less" scoped>
.filter-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .item {
    min-width: 266px;
    padding-right: 33px;
    box-sizing: content-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0;

    .input {
      width: 208px;
      padding-left: 12px;
    }
    .belongTo{
      padding-left: 7px;
      border: 1px solid #D9D9D9;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      .tips{
        color: #BFBFBF;
      }
    }
    .ant-select {
      width: 100%;
    }
  }
}
.info-box {
  flex: 1;
}
.btn-box {
  .ant-btn {
    margin-right: 10px;
  }
}
.tab {
  background: #fff;
}
/deep/ .ant-tabs-bar {
  margin-bottom: 0 !important;
}
.label_box {
  position: relative;
  box-sizing: border-box;
  padding: 0 10px 0 10px;
  overflow-wrap: break-word;
  .label {
    display: inline-block;
    margin-left: 10px;
    margin-bottom: 5px;
    max-width: 80px;
    padding: 3px 10px;
    margin: 5px;
    white-space: nowrap;
    background-color: #f7f7f7;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 5px;
    height: 28px;
    font-size: 14px;
    background: #f7f7f7;
    border-radius: 4px;
    border: 1px solid #e9e9e9;
  }
  .spread {
    transform: rotate(180deg);
    position: absolute;
    top: 8px;
    right: 0;
    font-size: 14px;
    color: #000;
    cursor: pointer;
  }
  .hidden_div {
    z-index: 1;
    max-height: 130px;
    color: #000000a6;
    position: absolute;
    bottom: -23px;
    right: 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    letter-spacing: 1px;
    line-height: 26px;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #ccc;
    overflow: auto;

    .hidden_span {
      min-width: 117px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 5px 0;
      font-size: 16px;
      letter-spacing: 1px;
      line-height: 26px;
      white-space: nowrap;
      background: #f7f7f7;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
    }
  }
}
</style>
