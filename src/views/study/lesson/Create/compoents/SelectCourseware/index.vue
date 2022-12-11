<template>
  <div>
    <a-button style="width: 200px;border-radius: 8px" class="add" @click="visible = true">
      <a-icon type="plus" />
      添加
    </a-button>

    <div class="table" :hidden="tableView.length === 0">
      <el-table
        :data="tableView"
        row-key="id"
        style="width: 100%"
        border
        header-row-class-name="header"
      >
        <el-table-column prop="index" width="70">
          <template slot-scope="{ row, column, $index}">
            目录{{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="sortNo" label="标题" />
        <el-table-column prop="date" label="学习时长" width="418">
          <template slot-scope="{ row, column, $index}">
            <div class="my-space">
              <div class="time" style="gap: 0">
                <a-input-number v-model="row.date.h" id="inputNumber" />
                <span class="unit">时</span>
              </div>
              <div class="time" style="gap: 0">
                <a-input-number v-model="row.date.m" id="inputNumber" />
                <span class="unit">分</span>
              </div>
              <div class="time" style="gap: 0">
                <a-input-number v-model="row.date.s" id="inputNumber" />
                <span class="unit">秒</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" width="270">
          <template slot-scope="scope">
            <div class="my-space">
              <button class="linkButton">预览</button>
              <button class="delButton">删除</button>
              <button class="successButton">关联考试</button>
              <div class="my-handle">
                <DragIcon :width="24" />
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <a-modal
      :footer="null"
      destroyOnClose
      :width="1200"
      title="选择考试"
      :visible="visible"
      @cancel="visible = false"
    >
      <a-tabs v-model="key" class="tabs">
        <a-tab-pane key="1" tab="文件" />
        <a-tab-pane key="2" tab="视频" />
        <a-tab-pane key="3" tab="图文" />
      </a-tabs>
      <div class="my-table-search">
        <a-form layout="inline">

          <a-form-item
            label="考试名称">
            <a-input placeholder="请输入试卷名称" />
          </a-form-item>

          <a-form-item
            label="考试时间">
            <a-range-picker />
          </a-form-item>

          <a-form-item
            label="创建人">
            <a-input placeholder="请输入创建人" />
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
      </div>

      <a-table
        class="my-table"
        bordered
        :columns="columns"
        :data-source="tableData"
        :rowKey="record => record.id"
        :pagination="pagination"
        :rowSelection="{type:'checkbox', onChange: selectChange}"
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
import Sortable from 'sortablejs'
import DragIcon from '../../../../components/DragIcon/index'

export default {
  components: { DragIcon },
  data () {
    return {
      key: '1',
      columns: [
        {
          title: '考试名称',
          dataIndex: 'name',
          align: 'center',
          width: '200px'
        },
        {
          title: '试卷名称',
          width: '200px',
          dataIndex: 'introduction',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'total',
          align: 'center',
          sorter: true
        },
        {
          title: '创建人',
          dataIndex: 'user',
          align: 'center'
        }
      ],
      tableData: [],
      selectRows: [],
      name: '',
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      },
      visible: false,
      tableView: []
    }
  },
  watch: {
    tableView: {
      handler () {
        this.$emit('change', this.tableView)
      },
      deep: true
    }
  },
  mounted () {
    // 获取 tbody 节点
    const tbody = document.querySelector('.el-table__body-wrapper tbody')
    // 拖拽排序
    Sortable.create(tbody, {
      delay: 0,
      handle: '.my-handle',
      animation: 300, // 拖拽延时，效果更好看
      onEnd: async (evt) => {
        this.tableView.splice(evt.newIndex, 0, this.tableView.splice(evt.oldIndex, 1)[0])
        // 接口(param).then((res) => {})
      }
    })
    this.getTableData()
  },
  methods: {
    submit () {
      this.tableView = [
        {
          id: 1,
          sortNo: 2,
          date: { h: 1, m: 1, s: 1 },
          name: 'Tom'
        },
        {
          id: 2,
          sortNo: 3,
          date: { h: 1, m: 1, s: 1 },
          name: 'Tom'
        },
        {
          id: 3,
          sortNo: 1,
          date: { h: 1, m: 1, s: 1 },
          name: 'Tom'
        },
        {
          id: 4,
          sortNo: 4,
          date: { h: 1, m: 1, s: 1 },
          name: 'Tom'
        }
      ]
      this.visible = false
    },
    selectChange (ids, rows) {
      this.selectRows = rows
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

<style lang="less">
.table {
  margin-top: 12px;

  .el-table--border {
    border-radius: 8px;
  }

  th {
    background-color: #f5f6fa !important;
    text-align: center !important;
    padding: 0 !important;
  }

}

.time {
  display: flex;
}

.unit {
  padding: 0 11px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  border-left: none;
}

.my-handle {
  line-height: 0;
}
</style>
