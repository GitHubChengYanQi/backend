<template>
  <div class="momentsOperation-component_Container" ref="momentsOperation-component_Container">
    <div class="searchBar">
      <div class="searchItem">
        <a-select ref="select" v-model="searchObj.time_type" style="width: 120px">
          <a-select-option value="1">开始时间</a-select-option>
          <a-select-option value="2">创建时间</a-select-option>
        </a-select>
        <a-range-picker
          dropdownClassName="momentsOperation-component_Container_rangePickerDropdown"
          v-model="searchObj.date"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :ranges="searchDateItemRanges"
          @change="searchDateChange" />
      </div>
      <div class="searchItem">
        <span class="label">内容：</span>
        <a-input v-model="searchObj.content" style="width: 200px;" placeholder="请输入朋友圈内容关键词" />
        <a-select ref="select" v-model="searchObj.status" style="width: 110px;margin-left: 10px;" placeholder="任务状态">
          <a-select-option value="0">未开始</a-select-option>
          <a-select-option value="1">未完成</a-select-option>
          <a-select-option value="2">已完成</a-select-option>
        </a-select>
      </div>
      <a-button
        type="primary"
        style=" height: 30px;"
        @click="() => {
          this.pagination.current = 1
          getTableList()
        }">查询</a-button>
      <a-button
        style="margin-left: 10px; height: 30px;"
        @click="() => {
          this.searchObj = {
            time_type: '1',
            date: [],
            content: '',
            status: undefined
          }; this.getTableList()
        }">重置</a-button>
      <div class="rigBox">
        <a-button type="primary" @click="createMoments" v-permission="'/moments/add#post'">创建朋友圈</a-button>
        <a-dropdown style="margin-left: 10px;width: 90px;">
          <a-button type="primary" v-permission="'/moments/exportExcel#post'">导出</a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <span @click="getTableList('exp_cur')">导出当前</span>
              </a-menu-item>
              <a-menu-item>
                <span @click="getTableList('exp_all')">导出全部</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <a-table
      class="tableBox"
      :columns="tableColunms"
      :data-source="tableData"
      :scroll="{ x: 1300 }"
      :pagination="pagination"
      @change="handleTableChange">
      <div slot="content" slot-scope="text">
        <div class="txt">
          {{ text }}
        </div>
      </div>
      <div slot="operation" slot-scope="text, record">
        <div class="btns">
          <span class="btn" @click="editItem(text)" v-permission="'/moments/edit#post'">编辑</span>
          <span
            class="btn"
            @click="$refs['MomentsTableItemInfoToastRef'].open(record)"
            v-permission="'/moments/emplist#post'">详情</span>
          <span
            class="btn"
            @click="handleDelete(text)"
            v-permission="'/moments/delete#post'">删除</span>
        </div>
      </div>
    </a-table>
    <MomentsTableItemInfoToast ref="MomentsTableItemInfoToastRef" />
  </div>
</template>

<script>
import moment from 'moment'
import { getMomentsListReq, deleteMomentsItemReq, momentsListExportReq } from '@/api/momentsOperation'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
import MomentsTableItemInfoToast from './momentsTableItemInfoToast.vue'

const dayNum = 1000 * 60 * 60 * 24
const maxDayNum = dayNum * 365 // 最大搜索天数不超过一年
export default {
  name: 'MomentsTable',
  components: {
    MomentsTableItemInfoToast
  },
  data () {
    return {
      searchObj: {
        time_type: '1',
        date: [],
        content: '',
        status: undefined
      },
      searchDateItemRanges: {
        '今天': [moment().startOf('day'), moment().endOf('day')],
        '昨天': [moment().add(-1, 'days').startOf('day'), moment().add(-1, 'days').endOf('day')],
        '最近七天': [moment().add(-6, 'days').startOf('day'), moment().endOf('day')],
        '最近一个月': [moment().add(-1, 'months'), moment()],
        '最近三个月': [moment().add(-3, 'months'), moment()],
        '最近一年': [moment().add(-1, 'years'), moment()]
      },
      tableSortStr: '',
      tableColunms: [
        {
          title: '朋友圈内容',
          width: 300,
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' },
          fixed: 'left',
          class: 'contentBox'
        },
        {
          title: '任务状态',
          width: 120,
          align: 'center',
          dataIndex: 'status'
        },
        {
          title: '完成率',
          width: 120,
          align: 'center',
          dataIndex: 'completion_rates'
        },
        {
          title: '员工完成情况',
          width: 150,
          align: 'center',
          dataIndex: 'emp_comple'
        },
        {
          title: '发送客户情况',
          width: 150,
          align: 'center',
          dataIndex: 'contact_comple'
        },
        {
          title: '客户点赞量',
          width: 120,
          align: 'center',
          dataIndex: 'like_num'
        },
        {
          title: '客户评论量',
          width: 120,
          align: 'center',
          dataIndex: 'comment_num'
        },
        {
          title: '开始时间',
          width: 180,
          align: 'center',
          sorter: true,
          dataIndex: 'start_time'
        },
        {
          title: '创建人',
          width: 120,
          align: 'center',
          dataIndex: 'create_user'
        },
        {
          title: '创建时间',
          width: 180,
          align: 'center',
          sorter: true,
          dataIndex: 'create_time'
        },
        {
          title: '操作',
          width: 160,
          align: 'center',
          dataIndex: 'id',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right'
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `第 ${Math.ceil(range[1] / this.pagination.pageSize)}页/共${total}条数据 `
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    if (sessionStorage.getItem('momentPage')) {
      this.pagination.current = Number(sessionStorage.getItem('momentPage'))
    } else {
      this.pagination.current = 1
    }
    if (sessionStorage.getItem('momentPageSize')) {
      this.pagination.pageSize = Number(sessionStorage.getItem('momentPageSize'))
    } else {
      this.pagination.pageSize = 10
    }
    const tempSearchInfo = sessionStorage.getItem('momentSearchData')
    if (tempSearchInfo) {
      this.searchObj = JSON.parse(tempSearchInfo)
    }
    sessionStorage.removeItem('momentPage')
    sessionStorage.removeItem('momentPageSize')
    sessionStorage.removeItem('momentSearchData')
    this.getTableList()
  },
  methods: {
    async getTableList (expstatus) {
      const { date, status = '', ...args } = this.searchObj
      if (date.length === 2) {
        const [starttime, endtime] = date
        const targetNum = new Date(endtime).valueOf() - new Date(starttime).valueOf()
        if (targetNum > maxDayNum) {
          this.$message.warn('日期区间最多选择一年!')
          return
        }
      }
      const { current, pageSize } = this.pagination
      const obj = {
        ...args,
        starttime: date[0] || '',
        endtime: date[1] || '',
        status,
        current,
        size: pageSize,
        order: this.tableSortStr
      }
      if (expstatus) {
        obj.expstatus = expstatus
      }
      if (expstatus) {
        const data = await momentsListExportReq(obj)
        callDownLoadByBlob(data, '朋友圈任务列表')
      } else {
        const { data } = await getMomentsListReq(obj)
        this.tableData = data.datas
        this.pagination.total = data.total
      }
    },
    createMoments () {
      this.$router.push('/clientFollow/momentsOperation/add')
    },
    searchDateChange (_, values) {
      this.searchObj.date = values
    },
    editItem (id) {
      sessionStorage.setItem('momentSearchData', JSON.stringify(this.searchObj))
      this.$router.push(`/clientFollow/momentsOperation/edit?id=${id}`)
      sessionStorage.setItem('momentPage', this.pagination.current)
      sessionStorage.setItem('momentPageSize', this.pagination.pageSize)
    },
    handleTableChange ({ current, pageSize }, _, { columnKey, order }) {
      let str = ''
      let first = ''
      if (columnKey) {
        // first = columnKey === 'start_time' ? 'Create' : 'Start'
        first = columnKey === 'start_time' ? 'Start' : 'Create'
      }
      if (order === 'ascend') {
        str = `${first}AtAsc`
      } else if (order === 'descend') {
        str = `${first}AtDesc`
      }
      this.tableSortStr = str
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableList()
    },
    handleDelete (id) {
      this.$confirm({
        title: '提示',
        content: '是否删除',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          await deleteMomentsItemReq({ id })
          this.$message.success('删除成功')
          this.getTableList()
        },
        onCancel () { }
      })
    }
  }
}
</script>
<style lang='less'>
.momentsOperation-component_Container {
  .tableBox {
    .ant-table {
      background-color: #fff;
    }
  }
}
.momentsOperation-component_Container_rangePickerDropdown{
  .ant-calendar-footer {
    padding: 0 6px;
  }
}
</style>
<style lang='less' scoped>
@import './momentsTable.less';
</style>
