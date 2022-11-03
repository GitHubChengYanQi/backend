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
                v-model="searchData[item.key]"
                placeholder="请选择模型分类"
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
        v-permission="'/judge_former/add@post'"
      >创建评分模板</div>
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
          slot="name"
          slot-scope="text, record"
        >
          <template>
            <div class="label_box">
              {{ record.name }}
            </div>
          </template>
        </div>
        <div
          slot="open"
          slot-scope="text, record"
        >
          <template>
            <div class="on_state">
              <a-switch
                :checked="record.open"
                @click="setRules(record)"
                v-permission="'/judge_former/open@post'"
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
            <div class="table_button">
              <a-tooltip
                placement="left"
                trigger="click"
              >
                <template #title>
                  <span>{{ record.brief }}</span>
                </template>
                <a-button
                  type="link"
                  v-permission="'/judge_former/find@post'"
                >描述</a-button>
              </a-tooltip>
              <a-button
                type="link"
                v-permission="'/judge_former/save@post'"
                @click="goPath(1,record)"
              >编辑</a-button>
              <a-button
                type="link"
                v-permission="'/judge_former/drop@post'"
                @click="remove(record)"
              >删除</a-button>
            </div>
          </template>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'
import { judgeFormerFind, judgeFormerDrop, judgeFormerOpen } from '@/api/riskEarlyWarning.js'

export default {
  data () {
    return {
      // 搜索盒子信息参数
      searchInput: [
        {
          title: '模型名称：',
          type: 'input',
          key: 'name',
          placeholder: '请输入评分模型名称',
          style: 'width: 239px;height: 35px;'
        },
        {
          title: '模型分类：',
          type: 'select',
          key: 'type',
          select: 'scoreModelClass',
          style: 'width: 172px;height: 40px;'
        }
      ], // 搜索参数
      searchData: {
        name: '',
        order: 'CreateAtDesc'
      }, // 表头
      columns: [
        {
          align: 'center',
          className: 'table_header',
          title: '评分模型名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '创建人',
          dataIndex: 'userName',
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '创建时间',
          sorter: true,
          dataIndex: 'createdAt',
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '模型分类',
          dataIndex: 'type',
          width: 150
        },
        {
          align: 'center',
          className: 'table_header',
          title: '模型状态',
          dataIndex: 'open',
          scopedSlots: { customRender: 'open' },
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
      tableData: [],
      // 页脚
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `共 ${Math.ceil(range[1] / this.pagination.pageSize)}页/${total}条数据 `
      }, // 需要用到的公用选项
      selectData: {
        scoreModelClass: []
      }
    }
  },
  created () {
    this.getSelectData('score_model_classification', 'scoreModelClass')
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
      }
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    // 获取表单数据
    getTableData () {
      console.log(this.searchData)
      const data = {
        ...this.searchData,
        current: this.pagination.current,
        size: this.pagination.pageSize
      }
      console.log(data)
      judgeFormerFind(data).then((res) => {
        console.log(res)
        this.tableData = res.data.datas
        this.tableData = this.tableData.map((item) => {
          // console.log(item.type)
          let txt = ''
          this.selectData.scoreModelClass.map((items) => {
            if (items.code == item.type) {
              txt = items.name
            }
          })
          item.type = txt
          return item
        })
        this.pagination.total = res.data.total
      })
    },
    // 改变状态
    setRules (e) {
      if (e.open) {
        this.$confirm({
          title: '关闭模型',
          content: '评分模型关闭后，引用该模型的相关模块都将失效是否确定关闭？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.setOpen(e.id)
          },
          onCancel () {}
        })
      } else {
        this.setOpen(e.id)
      }
      console.log(e)
    },
    // 跳转
    goPath (e, record) {
      const pathData = ['/riskEarlyWarning/creatingScoringTemplate', '/riskEarlyWarning/creatingScoringTemplate']
      if (e == 1) {
        pathData[e] = pathData[e] + '?id=' + record.id
      }
      this.$router.push(pathData[e])
    },
    // 获取公用选择数据
    getSelectData (e, key) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        console.log(res)
        this.selectData[key] = res.data
        this.getTableData()
      })
    },
    // 删除
    remove (e) {
      this.$confirm({
        title: '删除模型',
        content: '是否确定删除评分模型？',
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
      judgeFormerDrop(data).then((res) => {
        this.getTableData()
      })
    },
    // 修改状态
    setOpen (e) {
      const obj = {
        id: e
      }
      judgeFormerOpen(obj).then(res => {
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
    width: 100%;
    overflow: auto;
    .search_box {
      display: flex;
      align-items: center;
      .search_input_box {
        margin-right: 20px;
        flex-shrink: 0;
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
