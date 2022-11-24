<template>
  <div class="groupMess_page">
    <a-card class="groupMess_card">
      <div class="groupMess_content">
        <div class="groupMess_search_box">
          <span
            class="groupMess_search"
            v-for="(item,index) in search.inputType"
            :key="index"
          >
            <span class="search_title">{{ item.title }}</span>
            <span class="search_input">
              <a-select
                class="input"
                v-model="search.data[item.key]"
                v-if="item.type == 'select'"
              >
                <a-select-option
                  v-for="(items,indexs) in selectArr[item.selectKey]"
                  :value="items.code"
                  :key="indexs"
                >{{ items.name }}</a-select-option>
              </a-select>
              <a-input
                class="input"
                v-model="search.data[item.key]"
                v-else
              ></a-input>
            </span>
          </span>
          <div class="groupMess_search_button">
            <a-button
              type="primary"
              class="button"
              @click="getSearch"
            >查询</a-button>
            <a-button
              class="button"
              @click="reset"
            >重置</a-button>
            <a-button
              type="primary"
              class="goPage"
              @click="goPage(0)"
            >新建群聊</a-button>
          </div>
        </div>
        <div class="groupMess_table_box">
          <a-table
            :row-key="record => record.id"
            :columns="table.columns"
            :data-source="table.tableData"
            :pagination="table.pagination"
            :scroll="{ x: 1500}"
            @change="handleTableChange"
            ref="table"
          >
            <div
              slot="operation"
              slot-scope="text, record"
            >
              <template>
                <a-button
                  type="link"
                  @click="goPage(3,record)"
                >详情</a-button>
                <a-button
                  type="link"
                  @click="goPage(1,record)"
                >编辑</a-button>
                <a-button
                  type="link"
                  @click="goPage(2,record)"
                >复制</a-button>
                <a-button
                  type="link"
                  @click="remove(record)"
                >删除</a-button>
              </template>
            </div>
          </a-table>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'

export default {
  data () {
    return {
      search: {
        inputType: [
          {
            title: '任务名称：',
            type: 'input',
            key: 'name'
          },
          {
            title: '任务状态：',
            type: 'select',
            selectKey: 'state',
            key: 'state'
          }
        ],
        data: {
          name: '',
          state: ''
        }
      },
      selectArr: {
        state: []
      },
      table: {
        columns: [
          {
            align: 'center',
            title: '任务名称',
            dataIndex: 'employeeAgencyName',
            width: 150
          },
          {
            align: 'center',
            title: '开始时间',
            sorter: true,
            dataIndex: 'infoEmploye',
            width: 150
          },
          {
            align: 'center',
            title: '执行发送群主',
            dataIndex: 'infoEmployee',
            width: 150
          },
          {
            align: 'center',
            title: '未执行发送群主',
            dataIndex: 'infoEmployeeC',
            width: 150
          },
          {
            align: 'center',
            title: '已送达群聊',
            dataIndex: 'infoEmployeeCo',
            width: 150
          },
          {
            align: 'center',
            title: '未送达群聊',
            dataIndex: 'infoEmployeeCou',
            width: 150
          },
          {
            align: 'center',
            title: '任务状态',
            dataIndex: 'infoEmployeeCoun',
            width: 150
          },
          {
            align: 'center',
            className: 'table_header',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 250,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        tableData: [{ id: '1' }],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共${total}条数据 `,
          pageSizeOptions: ['10', '20', '30', '50']
        }
      }
    }
  },
  created () {
    this.getSelect('group_mess_state', 'state')
  },
  methods: {
    getSelect (e, key) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        console.log(res)
        this.selectArr[key] = res.data
      })
    },
    getSearch () {},
    reset () {},
    goPage (e, id) {
      console.log(e, id)
      this.$router.push(`/groupMess/setGroup?type=${e}`)
    },
    remove (e) {
      this.$confirm({
        title: '删除规则',
        content: '是否确定删除规则？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {},
        onCancel () {}
      })
    },
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.table.pagination.current = current
      this.table.pagination.pageSize = pageSize
      this.table.order = sorter
      this.getTableData()
    },
    getTableData () {}
  }
}
</script>

<style lang="less" scoped>
.groupMess_page {
  width: 100%;
  .groupMess_card {
    width: 100%;
    .groupMess_content {
      width: 100%;
      .groupMess_search_box {
        width: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .groupMess_search {
          margin-bottom: 20px;
          flex: 0 0 20%;
          display: flex;
          flex-shrink: 0;
          align-items: center;
          .search_title {
            width: 85px;
            text-align: end;
            flex-shrink: 0;
          }
          .search_input {
            width: 170px;
            .input {
              width: 100%;
            }
          }
        }
        .groupMess_search_button {
          display: flex;
          justify-content: space-between;
          margin-left: 20px;
          flex-grow: 1;
          margin-bottom: 20px;
          .button {
            width: 60px;
            margin-right: 20px;
          }
          .goPage {
            width: 125px;
            margin-left: auto;
          }
        }
      }
    }
  }
}
</style>
