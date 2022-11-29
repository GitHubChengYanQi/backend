<template>
  <div id="groupOperation_joinGroupSaying-page-container" ref="groupOperation_joinGroupSaying-page-container_Ref">
    <div class="searchBar">
      <div class="searchItem">
        <span class="label">关键字：</span>
        <a-input v-model="searchContent" placeholder="请输入文本内容关键字" />
      </div>
      <a-button
        type="primary"
        @click="() => {
          this.pagination.current = 1
          getTableList()
        }">查询</a-button>
      <div class="rigBox">
        <a-button type="primary" @click="$router.push('/groupsOperation/joinGroupSaying/add')">创建欢迎语</a-button>
      </div>
    </div>
    <div class="tableBox">
      <a-table :columns="tableColunms" :data-source="tableData" :pagination="pagination" @change="handleTableChange">
        <div slot="content" slot-scope="text">
          <div class="txt">
            {{ text }}
          </div>
        </div>
        <div slot="operation" slot-scope="text">
          <div class="btns">
            <span
              class="btn"
              @click="$router.push({
                path: `/groupsOperation/joinGroupSaying/edit`,
                query: {id: text}
              })">编辑</span>
            <span
              class="btn"
              @click="handleDelete(text)">删除</span>
          </div>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { deleteJoinSayItemReq, getJoinSayListReq } from '@/api/groupsOperation'

export default {
  name: '',
  data () {
    return {
      searchContent: '',
      tableColunms: [
        {
          title: '入群欢迎语',
          width: '40%',
          dataIndex: 'content'
        },
        {
          title: '创建人',
          width: '20%',
          align: 'center',
          dataIndex: 'create_user'
        },
        {
          title: '创建时间',
          width: '20%',
          align: 'center',
          sorter: true,
          dataIndex: 'create_time'
        },
        {
          title: '操作',
          width: '20%',
          align: 'center',
          dataIndex: 'id',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tableData: [],
      tableSortStr: '',
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
    this.getTableList()
  },
  methods: {
    async getTableList (expstatus) {
      const { current, pageSize } = this.pagination
      const obj = {
        content: this.searchContent,
        current,
        size: pageSize,
        order: this.tableSortStr
      }
      console.log(obj, 'obj')
      const { data } = await getJoinSayListReq(obj)
      this.tableData = data.datas
      this.pagination.total = data.total
    },
    handleTableChange ({ current, pageSize }, _, { columnKey, order }) {
      let str = ''
      if (order === 'ascend') {
        str = 'CreateAtAsc'
      } else if (order === 'descend') {
        str = 'CreateAtDesc'
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
          await deleteJoinSayItemReq({ id })
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

</style>
<style lang='less' scoped>
@import './index.less';
</style>
