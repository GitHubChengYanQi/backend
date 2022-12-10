<template>
  <div>
    <a-button v-if="!name" style="width: 200px;border-radius: 8px" class="add" @click="visible = true">
      <a-icon type="plus" />
      添加试卷
    </a-button>
    <div v-else>
      <a-badge>
        <div slot="count">
          <a-icon type="close-circle" style="cursor: pointer" @click="remove" />
        </div>
        <a-button style="width: 200px;border-radius: 8px" class="linkButton">
          {{ name }}
        </a-button>
      </a-badge>
      <a-button type="link">
        预览
      </a-button>
    </div>
    <a-modal
      :footer="null"
      destroyOnClose
      :width="1200"
      title="选择试卷"
      :visible="visible"
      @cancel="visible = false"
    >
      <a-form layout="inline">

        <a-form-item
          label="试卷名称">
          <a-input placeholder="请输入试卷名称" />
        </a-form-item>

        <a-form-item
          label="创建时间">
          <a-range-picker />
        </a-form-item>

        <a-form-item>
          <div>
            <a-button
              type="primary"
              ghost
              @click="() => { this.pagination.current = 1; this.getTableData() }"
            >
              查询
            </a-button>
          </div>
        </a-form-item>
      </a-form>
      <a-table
        class="my-table"
        bordered
        :columns="columns"
        :data-source="tableData"
        :rowKey="record => record.id"
        :pagination="pagination"
        :rowSelection="{type:'radio', onChange: selectChange}"
        @change="handleTableChange">
      </a-table>
      <div style="text-align: center">
        <a-button
          type="primary"
          style="border-radius: 8px"
          class="add"
          @click="submit"
        >
          确定
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '试卷名称',
          dataIndex: 'name',
          align: 'center',
          width: '200px'
        },
        {
          title: '总题数',
          width: '200px',
          dataIndex: 'introduction',
          align: 'center'
        },
        {
          title: '总分数 ',
          dataIndex: 'class',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'total',
          align: 'center',
          sorter: true
        }
      ],
      tableData: [],
      selectId: '',
      selectRow: {},
      name: '',
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      },
      visible: false
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    remove () {
      this.name = ''
      this.$emit('change', null)
    },
    submit () {
      this.name = this.selectRow.name || '试卷试卷试卷'
      this.$emit('change', this.selectId)
      this.visible = false
    },
    selectChange (ids, rows) {
      this.selectId = ids[0]
      this.selectRow = rows[0] || {}
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    getTableData () {
      this.tableData = new Array(999).fill('').map((item, index) => ({ id: index }))
      this.pagination.total = 999
    }
  }
}
</script>
