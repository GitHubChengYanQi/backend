<template>
  <div class="SelfTable_Component_Container">
    <div class="headerBar">
      <div class="left">
        <!-- 单选tab -->
        <slot name="radioTab" :params="{ pagination: pagination }"></slot>
      </div>
      <div class="right">
        <a-button type="primary" @click="getTableList(true)" style="width: 120px;">导出</a-button>
      </div>
    </div>
    <a-table
      :columns="tableColunms"
      :data-source="tableData"
      :scroll="{ x: 1300 }"
      :pagination="pagination"
      :row-selection="{ selectedRowKeys: selectedTableRowKeys, onChange: onSelectTableItemChange }"
      @change="handleTableChange">
      <!-- 表头 -->
      <slot v-for="key in titleSlots" :name="key" :slot="key"></slot>
      <!-- 表格 -->
      <slot v-for="key in colunmsSlots" :name="key" :slot="key" slot-scope="text" :text="text"></slot>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'SelfTable',
  components: {},
  props: {
    tableColunms: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    colunmsSlots: {
      type: Array,
      default: () => []
    },
    titleSlots: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `第 ${Math.ceil(range[1] / this.pagination.pageSize)}页/共${total}条数据 `
      },
      selectedTableRowKeys: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getTableList()
  },
  methods: {
    onSelectTableItemChange (rows) {
      this.selectedTableRowKeys = rows
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableList()
    },
    getTableList (isExport) {
      if (isExport) {
        let ids = ''
        if (this.selectedTableRowKeys.length) {
          ids = this.selectedTableRowKeys.join(',')
        }
        // const data = await groupListExportReq(this.handleParam(obj))
        // callDownLoadByBlob(data, '群列表')
        this.$emit('exportTableList', { pagination: this.pagination, ids })
      } else {
        this.$emit('getTableList', { pagination: this.pagination })
      }
    },
    // 提供父组件更改total
    changePegaination (total) {
      this.pagination.total = total
    }
  }
}
</script>
<style lang='less'>

</style>
<style lang='less' scoped>
.headerBar {
  display: flex;
  justify-content: space-between;
}
</style>
