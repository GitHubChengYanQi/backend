<template>
  <div class="warning_rule">
    <!-- 搜索 -->
    <div class="search_card">
      <a-card>
        <div class="search_box">
          <div
            class="search_input_box"
            v-for="(item,index) in searchInput"
            :key="index"
          >
            <span class="search_title">{{ item.title }}</span>
            <span
              class="input_box"
              v-if="item.type == 'input'"
            >
              <a-input
                :placeholder="item.placeholder"
                v-model="searchData[item.key]"
                :style="item.style"
              ></a-input>
            </span>
            <span
              class="select_box"
              v-if="item.type == 'select'"
            >
              <a-select
                :placeholder="item.placeholder"
                v-model="searchData[item.key]"
                :style="item.style"
              >
                <a-select-option
                  v-for="( items , indexs ) in selectData[item.select]"
                  :value="items.code"
                  :key="indexs"
                >
                  {{ items.name }}
                </a-select-option>
              </a-select>
            </span>
          </div>

          <div class="search_button_box">
            <a-button
              type="primary"
              style="width: 54px;height: 34px;margin-right: 10px;"
              @click="getDate"
            >查询</a-button>
            <a-button
              style="width: 54px;height: 34px;margin-right: 10px;"
              @click="close"
            >重置</a-button>
          </div>
        </div>
      </a-card>
    </div>
    <!-- 跳转 -->
    <div class="skip_box">
      <div
        class="skip_button"
        @click="goPath(0)"
        v-permission="'/warn_strategy/add@post'"
      >创建预警规则</div>
    </div>
    <!-- 表格 -->
    <div class="table_box">
      <a-table
        :row-key="record => record.id"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :scroll="{ x: 1500}"
        @change="handleTableChange"
      >
        <div
          slot="labelName"
          slot-scope="text, record"
        >
          <template>
            <div class="label_box">
              {{ record.labelName }}
            </div>
          </template>
        </div>
        <div
          slot="is_open"
          slot-scope="text, record"
        >
          <template>
            <div class="on_state">
              <a-switch
                :checked="record.is_open == 1"
                @click="setRules(record)"
                v-permission="'/warn_strategy/open@post'"
                checked-children="开"
                un-checked-children="关"
              />
            </div>
          </template>
        </div>
        <div
          slot="operation"
          slot-scope="text, record"
        >
          <template>
            <a-tooltip
              placement="left"
              trigger="click"
            >
              <template #title>
                <span>{{ record.brief }}</span>
              </template>
              <a-button
                type="link"
                v-permission="'/warn_strategy/list@post'"
              >描述</a-button>
            </a-tooltip>
            <a-button
              type="link"
              v-permission="'/warn_strategy/info@post'"
              @click="goPath(1,record)"
            >编辑</a-button>
            <a-button
              type="link"
              v-permission="'/warn_strategy/delete@post'"
              @click="remove(record)"
            >删除</a-button>
          </template>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'
import { warnStrategyList, warnStrategyDelte, warnStrategyOpen } from '@/api/riskEarlyWarning.js'

export default {
  data () {
    return {
      // 搜索盒子信息参数
      searchInput: [
        {
          title: '规则名：',
          type: 'input',
          key: 'name',
          placeholder: '请输入规则名称',
          style: 'width: 239px;height: 35px;'
        },
        {
          title: '预警分类：',
          type: 'select',
          key: 'warn_code',
          placeholder: '请选择预警分类',
          select: 'scoreModelClass',
          style: 'width: 172px;height: 40px;'
        },
        {
          title: '监测范围：',
          type: 'select',
          placeholder: '请选择监测范围',
          key: 'detect_code',
          select: 'detectionRange',
          style: 'width: 152px;height: 40px;'
        }
      ], // 搜索参数
      searchData: {
        rule_name: '',
        orderBy: 'CreateAtDesc'
      }, // 表头
      columns: [
        {
          align: 'center',
          className: 'table_header',
          title: '规则名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '创建人',
          dataIndex: 'create_user',
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '创建时间',
          sorter: true,
          dataIndex: 'create_time',
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '预警分类',
          dataIndex: 'warn_code_name',
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '监测范围',
          dataIndex: 'detect_code_name',
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '规则状态',
          dataIndex: 'is_open',
          scopedSlots: { customRender: 'is_open' },
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'operation' }
        }
      ], // 表格数据
      tableData: [
      ], // 页脚
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `共 ${Math.ceil(range[1] / this.pagination.pageSize)}页/${total}条数据 `
      }, // 需要用到的公用选项
      selectData: {
        scoreModelClass: [],
        detectionRange: []
      }
    }
  },
  created () {
    this.getSelectData('warning_classification', 'scoreModelClass')
    this.getSelectData('detection_range', 'detectionRange')
    this.getTableData()
  },
  methods: {
    // 搜索
    getDate () {
      this.getTableData()
    },
    // 重置
    close () {
      this.searchData = {
        name: '',
        order: this.searchData.order
      }
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getTableData()
    },
    // 分页
    handleTableChange ({ current, pageSize }, filters, sorter) {
      if (sorter.order) {
        this.searchData.order = sorter.order == 'ascend' ? 'CreateAtAsc' : 'CreateAtDesc'
        console.log(this.searchData.orderBy)
      }
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    // 获取表单数据
    getTableData () {
      const data = {
        ...this.searchData,
        current: this.pagination.current,
        size: this.pagination.pageSize
      }
      console.log(data)
      warnStrategyList(data).then((res) => {
        console.log(res)
        this.tableData = res.data.datas
        this.pagination.total = res.data.total
      })
    },
    // 改变状态
    setRules (e) {
      console.log(e)
      this.setOpen(e.id, e.is_open)
    },
    // 跳转
    goPath (e, record) {
      const pathData = ['/riskEarlyWarning/creatingWarningRule', '/riskEarlyWarning/creatingWarningRule']
      if (e == 1) {
        pathData[e] = pathData[e] + '?id=' + record.id
      }
      this.$router.push(pathData[e])
    }, // 删除
    remove (e) {
      this.$confirm({
        title: '删除规则',
        content: '是否确定删除规则？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.del(e.id)
        },
        onCancel () {}
      })
    },
    // 删除
    del (e) {
      const data = {
        id: e
      }
      warnStrategyDelte(data).then((res) => {
        this.getTableData()
      })
    }, // 获取公用选择数据
    getSelectData (e, key) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        console.log(res)
        this.selectData[key] = res.data
      })
    },
    setOpen (e, open) {
      const obj = {
        id: e,
        is_open: open == 1 ? 0 : 1
      }
      warnStrategyOpen(obj).then(res => {
        this.getTableData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.warning_rule {
  width: 100%;
  // 搜索卡片试图
  .search_card {
    overflow: auto;
    width: 100%;
    .search_box {
      display: flex;
      align-items: center;
      .search_input_box {
        margin-right: 20px;
        flex-shrink: 0;
        overflow: auto;
      }
      .search_button_box {
        margin-left: auto;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
  // 跳转
  .skip_box {
    width: 100%;
    padding: 20px 0;
    box-sizing: border-box;
    .skip_button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 130px;
      height: 39px;
      background: inherit;
      background-color: rgba(52, 112, 255, 1);
      border: none;
      border-radius: 5px;
      box-shadow: none;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      color: #ffffff;
      cursor: pointer;

      &:hover {
        background-color: #1890ff;
      }
    }
  }
  ::v-deep(.table_box) {
    .label_box {
      color: #1890ff;
    }
    th.table_header {
      background-color: #f0f2f5 !important;
    }
    td.table_header {
      background-color: #fff !important;
    }
  }
}
</style>
