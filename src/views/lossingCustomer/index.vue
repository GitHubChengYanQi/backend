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
                :value="items.code"
                :key="indexs"
              >{{ items.name }}</a-select-option>
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
            v-permission="'/lossingCustomer/index@search'"
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
              v-permission="'/lossingCustomer/index@exports'"
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
          <div
            slot="contactInfoName"
            slot-scope="text,row"
          >
            <template>
              <div class="client_box">
                <img
                  :src="row.contactInfoAvatar"
                  alt=""
                  class="client_img"
                >
                <div class="client_info">
                  <div class="nickname f-blod fz13">
                    <a-tooltip>
                      {{  row.contactInfoNick?.length > 0 ? row.contactInfoNick : '--' }}
                    </a-tooltip>
                  </div>
                  <div class="rek fz12">
                    备注：
                    <a-tooltip>
                      {{ row.nexusContactRemark.length > 0 ? row.nexusContactRemark : '--' }}
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div
            slot="nexusContactPivot"
            slot-scope="text,row"
          >
            <template>
              <a-popover
                title="标签"
                v-if="row.nexusContactPivot && row.nexusContactPivot.length > 0"
              >
                <template slot="content">
                  <div class="labelBox">
                    <a-tag
                      v-for="(item, index) in row.nexusContactPivot"
                      :key="index"
                    >{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span
                class="nolabel"
                v-else
              >无标签</span>
            </template>
          </div>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'
import { wastageContactFind, wastageContactDown } from '@/api/lossingCustomer.js'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

export default {
  data () {
    return {
      search: {
        inputType: [
          {
            title: '客户姓名：',
            type: 'input',
            key: 'contactInfoName',
            placeholder: '请输入客户姓名'
          },
          {
            title: '选择机构：',
            type: 'selct_checkbox',
            key: 'employeeAgencyId',
            placeholder: '请输入机构'
          },
          {
            title: '选择门店：',
            type: 'selct_checkbox',
            key: 'employeeOutletId',
            placeholder: '请输入门店'
          },
          {
            title: '选择员工：',
            type: 'model',
            key: 'employeeInfoId',
            placeholder: '请选择员工'
          },
          {
            title: '会员状态：',
            type: 'select',
            key: 'tradeStatusStr',
            selectKey: 'member'
          },
          {
            title: '流失原因：',
            type: 'select',
            key: 'loseType',
            selectKey: 'reason'
          },
          {
            title: '是否为主维护人：',
            type: 'select',
            key: 'nexusMaintainerId',
            selectKey: 'maintainer'
          },
          {
            title: '流失时间：',
            type: 'date',
            key: 'loseOccur'
          },
          {
            title: '成为会员时间：',
            type: 'date',
            key: 'tradeApplyDate'
          },
          {
            title: '添加时间：',
            type: 'date',
            key: 'createdAt'
          },
          {
            title: '最后一次成单时间：',
            type: 'date',
            key: 'tradeConsumeLast'
          }
        ],
        data: {
          contactInfoName: '',
          employeeAgencyId: [],
          employeeOutletId: [],
          employeeInfoId: [],
          tradeStatusStr: '0',
          nexusMaintainerId: '0',
          loseType: '0',
          loseOccur: [],
          tradeApplyDate: [],
          createdAt: [],
          tradeConsumeLast: []
        }
      },
      selectArr: {
        member: [
          {
            code: '0',
            name: '全部'
          },
          {
            code: '1',
            name: '是'
          },
          {
            code: '2',
            name: '未授权'
          }
        ],
        maintainer: [
          {
            code: '0',
            name: '全部'
          },
          {
            code: '1',
            name: '是'
          },
          {
            code: '2',
            name: '否'
          }
        ],
        reason: []
      },
      table: {
        columns: [
          {
            align: 'center',
            title: '客户',
            dataIndex: 'contactInfoName',
            scopedSlots: { customRender: 'contactInfoName' },
            width: 150
          },
          {
            align: 'center',
            title: '手机号',
            dataIndex: 'contactInfoMobile',
            width: 150
          },
          {
            align: 'center',
            title: '标签',
            dataIndex: 'nexusContactPivot',
            scopedSlots: { customRender: 'nexusContactPivot' },
            width: 150
          },
          {
            align: 'center',
            title: '添加时间',
            dataIndex: 'createdAt',
            width: 150
          },
          {
            align: 'center',
            title: '所属机构',
            dataIndex: 'employeeAgencyName',
            width: 150
          },
          {
            align: 'center',
            title: '所属门店',
            dataIndex: 'employeeOutletName',
            width: 150
          },
          {
            align: 'center',
            title: '所属员工',
            dataIndex: 'employeeInfoName',
            width: 150
          },
          {
            align: 'center',
            title: '是否为主维护人',
            dataIndex: 'nexusMaintainerId',
            width: 150
          },
          {
            align: 'center',
            title: '流失原因',
            dataIndex: 'loseReason',
            width: 150
          },
          {
            align: 'center',
            title: '流失时间',
            dataIndex: 'loseOccur',
            width: 150
          },
          {
            align: 'center',
            title: '最近一次成交时间',
            dataIndex: 'tradeConsumeLast',
            width: 200
          },
          {
            align: 'center',
            title: '累计消费金额（元）',
            dataIndex: 'tradeConsumeAmount',
            width: 200
          },
          {
            align: 'center',
            title: '积分',
            dataIndex: 'tradeIntegralAmount',
            width: 150
          },
          {
            align: 'center',
            title: '会员状态',
            dataIndex: 'tradeStatusStr',
            scopedSlots: { customRender: 'tradeStatusStr' },
            width: 150
          },
          {
            align: 'center',
            title: '成为会员时间',
            dataIndex: 'tradeApplyDate',
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
  created () {
    this.getSelect('loss_reason', 'reason')
    this.getTable()
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
    getSearch () {
      this.table.pagination.current = 1
      this.getTable()
    },
    reset () {
      this.search.data = {
        contactInfoName: '',
        employeeAgencyId: [],
        employeeOutletId: [],
        employeeInfoId: [],
        tradeStatusStr: '0',
        nexusMaintainerId: '0',
        loseType: '0',
        loseOccur: [],
        tradeApplyDate: [],
        createdAt: [],
        tradeConsumeLast: []
      }
      this.table.pagination.current = 1
      this.table.pagination.pageSize = 10
      this.getTable()
    },
    handleTableChange ({ current, pageSize }) {
      this.table.pagination.current = current
      this.table.pagination.pageSize = pageSize
      this.getTable()
    },
    getTable () {
      const { pagination } = this.table
      const newSearch = this.getNewSearch()
      const obj = { current: pagination.current, size: pagination.pageSize, ...newSearch }
      console.log(obj)
      wastageContactFind(obj).then((res) => {
        console.log(res)
        const codeArr = [
          'employeeAgencyName',
          'employeeOutletName',
          'employeeInfoName',
          'tradeConsumeLast',
          'tradeConsumeAmount',
          'tradeIntegralAmount',
          'tradeApplyDate',
          'contactInfoMobile'
        ]
        this.table.tableData = res.data.datas.map((item) => {
          for (const key in item) {
            if (codeArr.includes(key) && item[key].length == 0) {
              item[key] = '--'
            }
          }
          item.nexusMaintainerId = item.nexusMaintainerId == 1 ? '是' : '否'
          item.tradeStatusStr = item.tradeStatusStr.length > 0 ? item.tradeStatusStr : '未授权'
          return item
        })
        this.table.pagination.total = res.data.total
      })
    },
    exportsElxe (e) {
      if (e == 1) {
        const newSearch = this.getNewSearch()
        const obj = { ...newSearch }
        wastageContactDown(obj).then((res) => {
          callDownLoadByBlob(res, '流失客户信息')
        })
      } else {
        const { pagination } = this.table
        const newSearch = this.getNewSearch()
        const obj = { current: pagination.current, size: pagination.pageSize, ...newSearch }
        console.log(obj)
        wastageContactDown(obj).then((res) => {
          callDownLoadByBlob(res, '流失客户信息')
        })
      }
    },
    // 处理搜索参数
    getNewSearch () {
      const newSearch = {}
      const searchData = this.search.data
      const arrKey = ['loseOccur', 'tradeApplyDate', 'createdAt', 'tradeConsumeLast']
      const idKey = ['employeeAgencyId', 'employeeOutletId']
      for (const key in searchData) {
        if (arrKey.includes(key) && searchData[key].length > 0) {
          newSearch[key] = searchData[key].map((item) => {
            return item.format('YYYY-MM-DD')
          })
        } else if (idKey.includes(key) && searchData[key].length > 0) {
          newSearch[key] = searchData[key]
            .map((item) => {
              return item.value
            })
            .join(',')
        } else if (key == 'employeeInfoId' && searchData[key].length > 0) {
          newSearch[key] = searchData[key].join(',')
        } else if (key == 'tradeStatusStr' && searchData[key] != '0') {
          newSearch[key] = searchData[key] == '1' ? '是' : '未授权'
        } else if (key == 'nexusMaintainerId' && searchData[key] != '0') {
          newSearch[key] = searchData[key] == '1' ? searchData[key] : '0'
        } else if (key == 'contactInfoName' || key == 'loseType') {
          newSearch[key] = searchData[key]
        }
      }
      return newSearch
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
    .lossingCustomer_table_box {
      margin-top: 20px;
      .client_box {
        display: flex;
        align-items: center;
        .client_img {
          width: 30px;
          height: 30px;
        }
        .client_info {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .nickname {
            white-space: nowrap;
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .rek {
            white-space: nowrap;
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
