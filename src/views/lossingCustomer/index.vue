<template>
  <div class="lossingCustomer">
    <a-card class="lossingCustomer_card">
      <div class="lossingCustomer_search_box">
        <div
          class="lossingCustomer_search"
          v-for="(item,index) in search.inputType"
          :key="index"
        >
          <span class="search_title">{{ item.title }}</span>
          <span class="search_input">
            <a-input
              class="input"
              v-model="search.data[item.key]"
              :placeholder="item.placeholder"
              v-if="item.type == 'input'"
            ></a-input>
            <SelectDepartment
              class="input"
              :treeCheckStrictly="true"
              :placeholder="item.placeholder"
              v-model="search.data[item.key]"
              v-if="item.type == 'selct_checkbox'"
            />
            <selectPersonnel
              class="input"
              v-model="search.data[item.key]"
              :changeId="true"
              :num="1"
              :type="'selector'"
              v-if="item.type == 'model'"
            />
            <a-select
              class="input"
              v-model="search.data[item.key]"
              v-if="item.type == 'select'"
            >
              <a-select-option
                v-for="(items,indexs) in selectArr[item.selectKey]"
                :value="items.value"
                :key="indexs"
              >{{ items.table }}</a-select-option>
            </a-select>
            <a-range-picker
              class="input"
              v-model="search.data[item.key]"
              v-if="item.type == 'date'"
            />
          </span>
        </div>
        <div class="lossingCustomer_search_button">
          <a-button
            type="primary"
            class="button"
            @click="getSearch"
          >查询</a-button>
          <a-button
            class="button"
            @click="reset"
          >重置</a-button>
          <a-dropdown
            :trigger="['click']"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
          >
            <a-button
              class="button"
              type="primary"
              @click.prevent
            >导出</a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item style="border-bottom:1px solid #ccc;">
                  <div
                    class="down_select"
                    @click="exportsElxe()"
                  >导出当前页</div>
                </a-menu-item>
                <a-menu-item>
                  <div
                    class="down_select"
                    @click="exportsElxe(1)"
                  >导出所有</div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="lossingCustomer_table_box">
        <a-table
          :row-key="record => record.id"
          :columns="table.columns"
          :data-source="table.tableData"
          :pagination="table.pagination"
          :scroll="{ x: 1500}"
          @change="handleTableChange"
        >
          <div slot="tag" slot-scope="text,row">
            <template>
              <a-popover title="标签" v-if="row.tag && row.tag.length > 0">
                <template slot="content">
                  <div class="labelBox">
                    <a-tag v-for="(item, index) in row.tag" :key="index">{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span class="nolabel" v-else>无标签</span>
            </template>
          </div>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: {
        inputType: [
          {
            title: '客户姓名：',
            type: 'input',
            key: 'customer_name',
            placeholder: '请输入客户姓名'
          },
          {
            title: '选择机构：',
            type: 'selct_checkbox',
            key: 'selection_mechanism',
            placeholder: '请输入机构'
          },
          {
            title: '选择门店：',
            type: 'selct_checkbox',
            key: 'select_store',
            placeholder: '请输入门店'
          },
          {
            title: '选择员工：',
            type: 'model',
            key: 'select_staff',
            placeholder: '请选择员工'
          },
          {
            title: '会员状态：',
            type: 'select',
            key: 'member_state',
            selectKey: 'member'
          },
          {
            title: '流失原因：',
            type: 'select',
            key: 'loss_reason',
            selectKey: 'reason'
          },
          {
            title: '是否为主维护人：',
            type: 'select',
            key: 'is_maintainer',
            selectKey: 'maintainer'
          },
          {
            title: '流失时间：',
            type: 'date',
            key: 'loss_time'
          },
          {
            title: '成为会员时间：',
            type: 'date',
            key: 'time_membership'
          },
          {
            title: '添加时间：',
            type: 'date',
            key: 'add_time'
          },
          {
            title: '最后依次成单时间：',
            type: 'date',
            key: 'last_time'
          }
        ],
        data: {
          customer_name: '',
          selection_mechanism: [],
          select_store: [],
          select_staff: [],
          member_state: '0',
          is_maintainer: '0',
          loss_reason: '0',
          loss_time: [],
          time_membership: [],
          add_time: [],
          last_time: []
        }
      },
      selectArr: {
        member: [
          {
            value: '0',
            table: '全部'
          },
          {
            value: '1',
            table: '是'
          },
          {
            value: '2',
            table: '未授权'
          }
        ],
        maintainer: [
          {
            value: '0',
            table: '全部'
          },
          {
            value: '1',
            table: '是'
          },
          {
            value: '2',
            table: '否'
          }
        ],
        reason: [
          {
            value: '0',
            table: '全部'
          },
          {
            value: '1',
            table: '员工删除客户'
          },
          {
            value: '2',
            table: '客户删除员工'
          },
          {
            value: '3',
            table: '离职继承原因'
          }
        ]
      },
      table: {
        columns: [
          {
            align: 'center',
            title: '客户',
            dataIndex: 'client',
            scopedSlots: { customRender: 'client' },
            width: 150
          },
          {
            align: 'center',
            title: '手机号',
            dataIndex: 'phone',
            width: 150
          },
          {
            align: 'center',
            title: '标签',
            dataIndex: 'tag',
            scopedSlots: { customRender: 'tag' },
            width: 150
          },
          {
            align: 'center',
            title: '添加时间',
            dataIndex: 'add_time',
            width: 150
          },
          {
            align: 'center',
            title: '所属机构',
            dataIndex: 'subsidiary_organ',
            width: 150
          },
          {
            align: 'center',
            title: '所属门店',
            dataIndex: 'subsidiary_stores',
            width: 150
          },
          {
            align: 'center',
            title: '所属员工',
            dataIndex: 'subsidiary_staff',
            width: 150
          },
          {
            align: 'center',
            title: '是否为主维护人',
            dataIndex: 'is_staff',
            width: 150
          },
          {
            align: 'center',
            title: '流失原因',
            dataIndex: 'loss_why',
            width: 150
          },
          {
            align: 'center',
            title: '流失时间',
            dataIndex: 'warn_code_name',
            width: 150
          },
          {
            align: 'center',
            title: '最近一次成交时间',
            dataIndex: 'last_time',
            width: 200
          },
          {
            align: 'center',
            title: '累计消费金额（元）',
            dataIndex: 'detect_code_name',
            width: 200
          },
          {
            align: 'center',
            title: '积分',
            dataIndex: 'integral',
            width: 150
          },
          {
            align: 'center',
            title: '会员状态',
            dataIndex: 'is_open',
            scopedSlots: { customRender: 'is_open' },
            width: 150
          },
          {
            align: 'center',
            title: '成为会员时间',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200
          }
        ],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '50']
        },
        tableData: []
      }
    }
  },
  methods: {
    getSearch () {
      console.log(this.search.data)
    },
    reset () {
      this.search.data = {
        customer_name: '',
        selection_mechanism: [],
        select_store: [],
        select_staff: [],
        member_state: '0',
        is_maintainer: '0',
        loss_reason: '0',
        loss_time: [],
        time_membership: [],
        add_time: [],
        last_time: []
      }
    },
    handleTableChange (page, filters, sorter, current) {
      console.log(page, filters, sorter, current)
    },
    exportsElxe (e) {
    }
  }
}
</script>

<style lang="less" scoped>
.lossingCustomer {
  .lossingCustomer_card {
    width: 100%;
    .lossingCustomer_search_box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .lossingCustomer_search {
        margin-bottom: 20px;
        flex: 0 0 20%;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        .search_title {
          width: 130px;
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
      .lossingCustomer_search_button {
        margin-left: auto;
        .button {
          width: 95px;
          margin-right: 20px;
        }
        .down_select {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
