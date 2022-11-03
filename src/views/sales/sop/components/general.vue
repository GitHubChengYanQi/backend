<template>
  <div id="userSop_Page_Container" ref="userSop_Page_Container">
    <topHeader
      :activeInfo="activeInfo"
      :searchPermission="'/sopGeneral/index@get'"
      :addPermission="'/sopGeneral/add@post'"
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
            <a-button type="link" @click="editItem(record)" v-permission="'/sopGeneral/detail@get'">编辑</a-button>
            <a-button type="link" @click="deleteItem(record.id)" v-permission="'/sopGeneral/delete@delete'">删除</a-button>
          </div>
        </template>
      </div>
    </a-table>
  </div>
</template>
<script>
import { getGeneralList, delGeneralSop } from '@/api/salers'
import topHeader from './topHeader'
export default {
  data () {
    return {
      tableLoading: false, // 列表加载状态
      // 列表数据
      tableData: [],
      tablePagination: {}, // 列表分页信息
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
          title: '操作',
          align: 'center',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      //  showTotal: (total, range) => `共${range[0]}页/${total}条数据`
      // 分页对象
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
    const tempPageIndex = sessionStorage.getItem('generalPage')
    // this.getDataList({ page: tempPageIndex ? Number(tempPageIndex) : 1 })
    this.getDataList({ page: tempPageIndex || 1 })
    sessionStorage.removeItem('activityPage')
    sessionStorage.removeItem('regularPage')
    sessionStorage.removeItem('friendPage')
    sessionStorage.removeItem('birthdayPage')
  },
  beforeDestroy () {
    console.log('页面销毁前')
  },
  methods: {
    // 切换数据
    getChangeList ({ current, pageSize }) {
      // console.log(e, '监听回调数据')
      console.log(current, pageSize)
      this.getDataList({ page: current, perPage: pageSize, sopName: this.sopName })
    },
    // 获取列表数据
    getDataList ({ page = 1, perPage = 10, sopName = '' }) {
      this.tableLoading = true
      console.log(page, perPage, '传入的实参')
      const params = {
        page,
        perPage,
        sopName
      }
      this.pageIndex = Number(page)
      getGeneralList(params).then(response => {
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
            this.getDataList({ page: 1, perPage: 10, sopName: this.sopName })
          } else {
            // 是真没有数据

          }
        } else {

        }
        // this.$set(this.pagination, 'showTotal', () => {
        //   `共${this.tablePagination.totalPage}页/${this.tablePagination.total}条数据`
        // })
      })
    },

    // 新增数据
    goOperation (value) {
      console.log(value)
      // sessionStorage.setItem('activeType', 'General')
      sessionStorage.removeItem('generalPage')
      this.$router.push({
        path: '/sales/generalAdd',
        query: {
          id: -1
        }
      })
    },
    // 去搜索
    goSearch (value) {
      console.log(value, 'search')
      this.pageIndex = 1
      this.sopName = value
      this.getDataList({ page: this.pageIndex, sopName: this.sopName })
    },
    // 编辑数据
    editItem (info) {
      // console.log(info, '编辑数据对象')
      // sessionStorage.setItem('activeType', 'General')
      sessionStorage.setItem('generalPage', this.pageIndex)
      this.$router.push({
        path: '/sales/generalEdit',
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
          delGeneralSop(params).then(response => {
            console.log(response, '删除数据')
            if (response.code === 200) {
              this.$message.success('删除成功')
              // this.pageIndex = 1
              // this.sopName = ''
              this.getDataList({ page: this.pageIndex, sopName: this.sopName })
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
