<template>
  <div id="cluster_template_container" ref="cluster_template_container">
    <!-- <button @click="addGroupChat()">临时测试添加群聊</button> -->
    <div class="searchLine">
      <div class="searchBox">
        <div class="item">
          <span>群日历名称:</span>
          <a-input placeholder="请输入群日历名称" v-model="searchInfo.sopName" class="inputClass" />
          <!-- style="width: 200px; height: 35px" -->
        </div>
        <div class="item">
          <span>创建人:</span>
          <!-- v-if="treeData" :record="treeData" -->
          <selectPersonnel
            class="selectPersonnelCom"
            name="请选择创建者"
            :changeId="true"
            :num="1"
            v-model="searchInfo.employeeIds"
          />
        </div>
        <a-button
          type="primary"
          style="margin: 0 10px;"
          @click="goSearch"
          v-permission="'/sopClusterCalendarTemplate/index@get'"
        >查询</a-button>
        <a-button
          style="margin-right: 10px;"
          @click="goReset"
          v-permission="'/sopClusterCalendarTemplate/index@get'"
        >重置</a-button>
      </div>
      <div class="handlesBox">
        <!-- <div class="btn" @click="goAdd" v-permission="'/sopClusterCalendarTemplate/add@post'">创建群日历</div> -->
        <a-button type="primary" @click="goAdd" v-permission="'/sopClusterCalendarTemplate/add@post'">创建群日历</a-button>
      </div>
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
      <div slot="beginAndEnd" slot-scope="text, record">
        <template>
          <div>
            {{ record.beginTime + '-' + record.endTime }}
          </div>
        </template>
      </div>
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: space-around;">
            <a-button type="link" v-if="isShowButton(record)" @click="addGroupChat(record)" v-permission="'/sopClusterCalendarTemplate/sopBindCluster@post'">添加群聊</a-button>
            <a-button type="link" v-if="isShowButton(record)" @click="editItem(record)" v-permission="'/sopClusterCalendarTemplate/update@post'">编辑</a-button>
            <a-button type="link" @click="deleteItem(record.id)" v-permission="'/sopClusterCalendarTemplate/delete@delete'">删除</a-button>
          </div>
        </template>
      </div>
    </a-table>
    <GroupChatList :showStatus.sync="addGroupChatShowStatus" :permissionText="'/sopClusterTemplate/getClusterList@post'" :typeInfo="bindGroupChatInfo" @submitGroupChat="submitGroupChatMethod"/>
  </div>
</template>

<script>
import { getCalendarTemplateListMethod, deleteCalendarTemplateMethod, bindCalendarTemplateMethod } from '@/api/cluster'
// import { getTempSopList, deleteCalendarTemplateMethod, bindCalendarTemplateMethod } from '@/api/cluster'
import GroupChatList from '../groupChat.vue'
import moment from 'moment'
export default {
  name: 'ClusterSopTemplate',
  components: {
    GroupChatList
  },
  data () {
    return {
      bindGroupChatInfo: {}, // 群日历模板绑定群聊对象
      selectArrayString: '',
      searchInfo: {}, // 查询列表对象
      // 表格加载效果
      tableLoading: false,
      // 表格数据
      tableData: [],
      // 树列表数据
      treeData: [],
      // 员工选择数组
      employeeIds: [],
      // 模糊搜索
      searchValue: '',
      tableColumns: [
        {
          title: '群日历名称',
          dataIndex: 'sopName',
          align: 'center',
          width: 200
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          align: 'center',
          width: 200
        },
        {
          title: '创建人',
          dataIndex: 'createdByName',
          align: 'center',
          width: 200
        },
        {
          title: '起止时间',
          dataIndex: 'beginAndEnd',
          align: 'center',
          width: 250,
          scopedSlots: { customRender: 'beginAndEnd' }
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
      addGroupChatShowStatus: false,
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
    // 获取缓存中的页码
    const tempPage = sessionStorage.getItem('calendarTemplatePage')
    this.$set(this.searchInfo, 'employeeIds', [])
    if (tempPage) {
      this.$set(this.pagination, 'current', Number(tempPage))
    } else {
      this.$set(this.pagination, 'current', 1)
    }
    this.getTableData()
  },
  methods: {
    // 是否显示按钮(添加群聊/修改)
    isShowButton (info) {
      const currentDate = moment().format('YYYY-MM-DD HH:mm')
      return moment(currentDate).isBefore(info.endTime, 'minute')
    },
    // 获取数据
    async getTableData () {
      // 临时注释掉
      this.tableLoading = true
      const params = {
        sopName: this.searchInfo.sopName,
        idsStr: this.searchInfo.employeeIds.join(','),
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      // console.log(params, '查询数据提交接口的对象')
      await getCalendarTemplateListMethod(params).then(response => {
        this.tableLoading = false
        console.log(response, '获取群日历模板信息')
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
    // 群日历模板切换页码
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    // 搜索
    goSearch () {
      // 重新将页码换成1
      this.$set(this.pagination, 'current', 1)
      this.getTableData()
    },
    // 重置
    goReset () {
      // 重新将页码换成1
      this.$set(this.pagination, 'current', 1)
      this.searchInfo = {}
      this.$set(this.searchInfo, 'employeeIds', [])
      this.getTableData()
    },
    // 添加群聊
    addGroupChat (info) {
      this.addGroupChatShowStatus = true
      this.$set(this.bindGroupChatInfo, 'soptype', 'ClusterCalendar')
      this.$set(this.bindGroupChatInfo, 'id', info.id)
      // this.groupChatSearchInfo.tagType = 0
    },
    // 绑定群聊回调
    submitGroupChatMethod (arrayText) {
      console.log(arrayText, '提交的绑定群聊')
      this.tableLoading = true
      this.$set(this.bindGroupChatInfo, 'clusterIds', JSON.parse(arrayText))
      bindCalendarTemplateMethod(this.bindGroupChatInfo).then(response => {
        console.log(response, '绑定群聊返回状态')
        if (response.code === 200) {
          this.$message.success('绑定成功')
          this.getTableData()
        } else {
          this.tableLoading = false
        }
      }).catch(() => {
        this.tableLoading = false
        // this.getTableData()
      })
    },
    // 创建群日历模板
    goAdd () {
      // 将页码缓存移除
      sessionStorage.removeItem('calendarTemplatePage')
      this.$router.push({
        path: '/sop/addClusterCalendar',
        query: {
          id: -1,
          type: 'add'
        }
      })
    },
    // 删除群日历模板
    deleteItem (id) {
      const that = this
      const params = { id }
      this.$confirm({
        title: '确定删除所选内容?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          that.tableLoading = true
          deleteCalendarTemplateMethod(params).then(response => {
            console.log(response, '删除数据')
            if (response.code === 200) {
              this.$message.success('删除成功')
              // this.pageIndex = 1
              // this.sopName = ''
              this.tableLoading = false
              this.getTableData()
            }
          })
        }
      })
    },
    // 编辑群日历模板
    editItem (info) {
      // 将当前的页码存入缓存中
      sessionStorage.setItem('calendarTemplatePage', this.pagination.current)
      this.$router.push({
        path: '/sop/editClusterCalendar',
        query: {
          id: info.id,
          type: 'edit'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.searchLine {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 15px 5px;
    .searchBox {
      display: flex;
      align-items: center;
      .item {
        display: flex;
        align-items: center;
        margin-right: 15px;
        .selectPersonnelCom {
          width: 200px;
          margin-left: 10px;
        }
        .inputClass {
          width: 200px;
          margin-left: 10px;
        }
      }
    }
    .explan {
      margin-left: 20px;
    }
    .handlesBox {
      margin-right: 10px;
      .btn {
        height: 36px;
        padding: 0 15px;
        font-family: 'FontAwesome', sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: #333333;
        line-height: 36px;
        cursor: pointer;
        background-color: #1890ff;
        border-radius: 2px;
        color: #fff;
      }
    }
  }
.tableBox {
  background-color: white;
}
</style>
