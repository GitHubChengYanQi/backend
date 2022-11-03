<template>
  <div id="userSop_Page_Container" ref="userSop_Page_Container">
    <topHeader
      :searchPermission="'/sopActivity/index@get'"
      :addPermission="'/sopActivity/add@post'"
      :activeInfo="activeInfo"
      @operation="goOperation"
      @search="goSearch"/>
    <a-table
      :loading="tableLoading"
      class="tableBox"
      :row-key="record => record.id"
      :data-source="tableData"
      :columns="tableColumns"
      :pagination="pagination"
      :scroll="{ x: 1500}"
      @change="getChangeList">
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: space-around;">
            <a-button type="link" v-permission="'/sopTaskDetail/getSopTaskDetailList@post'" @click="goExportData(record)">数据</a-button>
            <a-button type="link" @click="editItem(record)" v-permission="'/sopActivity/detail@get'">编辑</a-button>
            <a-button type="link" @click="deleteItem(record.id)" v-permission="'/sopActivity/delete@delete'">删除</a-button>
          </div>
        </template>
      </div>
    </a-table>
    <a-modal
      class="dataModalContainer"
      :getContainer="() => $refs['userSop_Page_Container']"
      :title="`SOP名称:${selectDataObj.sopName}`"
      :width="800"
      :visible="dataModalShow"
      :maskClosable="false"
      :footer="null"
      @cancel="closeDataModal"
    >
      <div class="searchBar">
        <a-input-search
          v-model="exportDataObj.sendEmpName"
          placeholder="筛选员工"
          style="width: 230px"
          @search="dataModalSearch"
        />
        <a-button @click="exportData" v-permission="'/sopTaskDetail/getSopTaskDetailListExcel@post'">导出</a-button>
      </div>
      <div class="tableBox">
        <a-table
          :row-key="record => record.empId"
          :data-source="modalTableData"
          :columns="modalTableColumns"
        >
        </a-table>
      </div>
    </a-modal>
  </div>
</template>
<script>
import topHeader from './topHeader'
import { getActivityList, delActivitySop, exportDataList, exportDataMethod } from '@/api/salers'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
export default {
  data () {
    return {
      tableLoading: false,
      dataModalShow: false, // 导出数据弹框是否显示
      selectDataObj: {}, // 点击的导出数据对象
      exportDataObj: {}, // 导出数据接口需要的对象
      dataModalSearchVal: '', // 导出数据弹框模糊搜索
      modalTableData: [], // 导出数据弹框中列表数据
      // 导出数据列表表头
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
          title: '未开始客户数',
          dataIndex: 'notBeginNum',
          align: 'center',
          width: 200,
          all: true
        }
      ],
      tablePagination: {},
      // 列表数据
      tableData: [],
      // 列表表头
      tableColumns: [
        {
          title: 'SOP名称',
          dataIndex: 'sopName',
          align: 'center',
          width: 150
        },
        {
          title: '创建人',
          dataIndex: 'createdByName',
          align: 'center',
          width: 150
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          align: 'center',
          width: 200
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'beginTime',
          width: 250
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endTime',
          width: 250
        },
        {
          title: '应发客户数',
          align: 'center',
          dataIndex: 'suedNum',
          width: 250
        },
        {
          title: '未发客户数',
          align: 'center',
          dataIndex: 'unsentNum',
          width: 250
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      // 模糊查询字段
      sopName: '',
      // 页面显示条数
      pageSize: 10,
      // 页码
      pageIndex: 1
    }
  },
  props: {
    activeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    topHeader
  },
  created () {
    const tempPageIndex = sessionStorage.getItem('activityPage')
    this.getActivityDataList({ page: tempPageIndex || 1 })
    sessionStorage.removeItem('generalPage')
    sessionStorage.removeItem('regularPage')
    sessionStorage.removeItem('friendPage')
    sessionStorage.removeItem('birthdayPage')
  },
  beforeDestroy () {
    console.log('页面销毁前')
  },
  methods: {
    // 去获取导出的数据列表
    goExportData (record) {
      this.dataModalShow = true
      console.log(record, '导出数据传递的参数')
      this.$set(this.exportDataObj, 'sopId', record.id)
      this.$set(this.exportDataObj, 'sopType', 'Activity')
      this.$set(this.selectDataObj, 'sopName', record.sopName)
      this.$set(this.exportDataObj, 'sendEmpName', '')
      this.commonMethod()
      // this.$set(this.exportDataObj, 'sendEmpName', record.id)
      // const params = {
      //   sopId: record.id,
      //   sopType: 'Regular',
      //   sendEmpName: ''
      // }
    },
    // 公共的请求
    commonMethod () {
      exportDataList(this.exportDataObj).then(response => {
        console.log(response, '获取导出数据')
        this.modalTableData = response.data
      })
    },
    // 导出当前数据
    exportData () {
      if (this.modalTableData.length != 0) {
        exportDataMethod(this.exportDataObj).then(response => {
          // console.log(response, '点击导出')
          callDownLoadByBlob(response, '导出数据记录')
        })
      } else {
        this.$message.warning('当前没有数据可导出')
      }
    },
    // 关闭导出数据弹框
    closeDataModal () {
      this.dataModalShow = false
    },
    // 数据模糊搜索
    dataModalSearch () {
      console.log(this.exportDataObj, '添加模糊搜索后的对象')
      this.commonMethod()
    },
    // 切换数据
    getChangeList ({ current, pageSize }) {
      this.getActivityDataList({ page: current, perPage: pageSize, sopName: this.sopName })
    },
    // 获取群发活动列表数据
    getActivityDataList ({ page = 1, perPage = 10, sopName = '' }) {
      this.tableLoading = true
      const params = {
        page,
        perPage,
        sopName
      }
      this.pageIndex = Number(page)
      getActivityList(params).then(response => {
        console.log(response, 'response')
        this.tableLoading = false
        this.tableData = response.data.list
        this.tablePagination = response.data.page
        this.$set(this.pagination, 'total', this.tablePagination.total)
        this.$set(this.pagination, 'current', this.pageIndex)
        if (this.tableData.length === 0) {
          // 列表中没有数据
          if (this.pagination.total !== 0) {
            // 总数据有,但当前页没有
            // 重新将页码换成1
            this.getActivityDataList({ page: 1, perPage: 10, sopName: this.sopName })
          } else {
            // 是真没有数据

          }
        } else {

        }
      })
    },
    // 操作数据
    goOperation (value) {
      console.log(value)
      // sessionStorage.setItem('activeType', 'Activity')
      sessionStorage.removeItem('activityPage')
      this.$router.push({
        path: '/sales/activityAdd',
        query: {
          id: -1
        }
      })
    },
    // 去搜索
    goSearch (value) {
      console.log(value)
      this.pageIndex = 1
      this.sopName = value
      this.getActivityDataList({ page: this.pageIndex, sopName: this.sopName })
    },
    // 编辑数据
    editItem (info) {
      console.log(info, '编辑数据对象')
      // sessionStorage.setItem('activeType', 'Activity')
      sessionStorage.setItem('activityPage', this.pageIndex)
      this.$router.push({
        path: '/sales/activityEdit',
        query: {
          id: info.id
        }
      })
    },
    // 删除数据
    deleteItem (id) {
      const params = { id }
      this.$confirm({
        title: '确定删除所选内容?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          delActivitySop(params).then(response => {
            console.log(response, '删除数据')
            if (response.code === 200) {
              this.$message.success('删除成功')
              // this.pageIndex = 1
              // this.sopName = ''
              this.getActivityDataList({ page: this.pageIndex, sopName: this.sopName })
            }
          })
        }
      })
    }

  }
}
</script>
<style lang="less">
  #userSop_Page_Container {
  .tableBox {
    background: #fff;
  }
  .dataModalContainer {
    .searchBar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .tableBox {
      .executionPersonBox {
        display: flex;
        align-items: center;
        .face {
          width: 25px;
          height: 25px;
          border-radius: 3px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '../index.less';
</style>
