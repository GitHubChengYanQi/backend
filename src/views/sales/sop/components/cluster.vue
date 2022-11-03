<template>
  <div>
    <topHeader :activeInfo="activeInfo" @operation="goOperation" @search="goSearch"/>
    <a-table
      class="tableBox"
      :row-key="record => record.id"
      :data-source="tableData"
      :columns="tableColumns"
      :pagination="pagination"
      :scroll="{ x: 1500}"
      @change="getList">
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: space-around;">
            <a-button type="link" @click="editItem(record)">编辑</a-button>
            <a-button type="link" @click="deleteItem(record.id)">删除</a-button>
          </div>
        </template>
      </div>
    </a-table>
  </div>
</template>
<script>
import topHeader from './topHeader'
export default {
  data () {
    return {
      // 列表数据
      tableData: [],
      // 列表表头
      tableColumns: [
        {
          title: 'SOP名称',
          dataIndex: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '创建人',
          dataIndex: 'userName',
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
          title: '起止时间',
          align: 'center',
          dataIndex: 'occur',
          width: 250
        }
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `共${range[0]}页/${total}条数据`
      }
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
  beforeDestroy () {
    console.log('页面销毁前')
    sessionStorage.setItem('activeType', 'Cluster')
  },
  methods: {
    // 操作数据
    goOperation (value) {
      console.log(value)
      // sessionStorage.setItem('activeType', 'Cluster')
      this.$router.push({
        path: '/sales/clusterAdd'
      })
    },
    // 去搜索
    goSearch (value) {
      console.log(value)
    },
    // 获取数据列表
    getList () {

    },
    // 编辑数据
    editItem () {},
    // 删除数据
    deleteItem () {}
  }
}
</script>
<style lang="less" scoped>
@import '../index.less';
</style>
