<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="6">
              <a-form-item
                label="群名称："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-input v-model="screenData.roomName" placeholder="请输入要搜索的群名称"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item
                label="群主："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 17} }">
                <a-input v-model="screenData.owner" placeholder="请输入要搜索的群主"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" class="btnBox">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button @click="resetSearch">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--end search-->

      <!--table-->
      <div class="table-wrapper">
        <div class="table-head">
          <div class="fl">
            <span class="f-blod">共{{ unassignedNum }}个待分配群</span>
          </div>
          <div class="fr">
            <!-- <a-button type="primary" ghost @click="distributionGroup" v-permission="'/contactTransfer/resignIndex@distributionGroup'">分配群聊</a-button>-->
            <SelectPersonnel
              v-model="treeData"
              @getVal="acceptData"
              type="buttonGhost"
              name="分配群聊"
              :multiple="false"
              :fieldNames="{ children: 'children', title: 'title', key: 'key' }"
              v-permission="'/contactTransfer/resignIndex@distributionGroup'" />
            <a-button type="primary" ghost @click="$router.push('/contactTransfer/resignAllotRecord')" v-permission="'/contactTransfer/resignIndex@resignAllotRecord'">分配记录</a-button>
            <selectStaff ref="choiceStaff" @change="acceptData" />
          </div>
        </div>
        <a-table
          rowKey="chatId"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <div slot="employeeName" slot-scope="text">
            <a-tag><a-icon type="user" />{{ text }}</a-tag>
          </div>
          <div slot="tags" slot-scope="text,row">
            <template>
              <div
                class="label_box"
                v-if="row.tags"
              >
                <span
                  class="label"
                  v-for=" (item ,index) in row.tags.slice(0,1)"
                  :key="index"
                >{{ item }}</span>
                <span
                  class="spread"
                  v-if="row.tags.length > 1"
                  @mouseenter="setSpread(row,'tag')"
                >
                  <svg-icon :state="3" />
                </span>
                <div
                  class="hidden_div"
                  @mouseleave="setSpread(row,'tag')"
                  v-if="spread['tag'].includes(row.tagKey)"
                >
                  <div
                    class="hidden_span"
                    v-for=" (item , index) in row.tags"
                    :key="index"
                  >{{ item }}</div>
                </div>
              </div>
            </template>
          </div>
          <div slot="state" slot-scope="text">
            <span v-if="text==1">接替完毕</span>
            <span v-if="text==2">等待接替</span>
            <span v-if="text==3">客户拒绝</span>
            <span v-if="text==4">接替成员客户达到上限</span>
            <span v-if="text==5">无接替记录</span>
          </div>
          <div slot="operation" slot-scope="text,record">
            <a @click="$router.push({ path: '/workContact/contactFieldPivot?contactId='+record.contactId+'&employeeId=&isContact=2'})">客户详情</a>
          </div>
        </a-table>
      </div>
      <!--end table-->

    </a-card>
  </div>
</template>

<script>
import { roomApi, allotRoomApi, getRoomStatistics } from '@/api/contactTransfer'
import selectStaff from '@/components/addlabel/selectStaff'
export default {
  components: {
    selectStaff
  },
  data () {
    return {
      unassignedNum: 0,
      loading: false,
      selectedRowKeys: [], // 选中key
      selectedRows: [], // 选中row
      screenData: {},
      columns: [
        {
          key: 'roomName',
          dataIndex: 'roomName',
          title: '群聊名称'
        },
        {
          key: 'owner',
          dataIndex: 'owner',
          title: '群主',
          scopedSlots: { customRender: 'owner' }
        },
        {
          key: 'userNum',
          dataIndex: 'userNum',
          title: '群人数'
        },
        {
          key: 'addNum',
          dataIndex: 'addNum',
          title: '今日入群'
        },
        {
          key: 'quitNum',
          dataIndex: 'quitNum',
          title: '今日退群'
        },
        {
          key: 'createTime',
          dataIndex: 'createTime',
          title: '创群时间'
        }
        // {
        //   key: 'handGroup',
        //   dataIndex: 'handGroup',
        //   title: '操作',
        //   scopedSlots: { customRender: 'handGroup' }
        // }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      treeData: undefined
    }
  },
  created () {
    this.initFn()
  },
  methods: {
    /**
     * 初始化
     */
    initFn () {
      this.getRoomStatistics()
      this.getTableData()
    },
    /**
     * 统计
     */
    getRoomStatistics () {
      getRoomStatistics().then((res) => {
        this.unassignedNum = res.data.unassignedNum
      })
    },
    /**
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        ...this.screenData
      }
      roomApi(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.pagination.total = res.data.page.total
      })
    },
    /**
     * 查询
     */
    search () {
      this.pagination.current = 1
      this.getTableData()
    },
    /**
     * 重置查询
     */
    resetSearch () {
      this.screenData = {}
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      const sort = {}
      if (sorter.order) {
        if (sorter.order === 'ascend') {
          sort.sort = `${sorter.field}Asc`
        } else {
          sort.sort = `${sorter.field}Desc`
        }
      }
      this.screenData = { ...this.screenData, ...sort }
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getTableData()
    },
    /**
     * 删除最后一页数据分页处理
     */
    isFillList () {
      const totalPage = Math.ceil((this.pagination.total - 1) / this.pagination.pageSize) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
      this.getTableData()
    },
    /**
     * 表格选择监听
     * @param {*} selectedRowKeys
     */
    onSelectChange (selectedRowKeys, row) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = row
      this.screenData.erpOrderNos = selectedRowKeys.join(',')
    },
    // 分配群聊
    distributionGroup () {
      if (this.selectedRowKeys === '' || this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择群聊')
        return false
      }
      this.$refs.choiceStaff.show(0)
    },
    /**
     * 接收组件传值
     * @param {*} e
     */
    acceptData (e = []) {
      if (!e.length) return
      const params = {
        type: 1,
        list: JSON.stringify(this.selectedRowKeys),
        takeoverUserId: e[0]
      }
      allotRoomApi(params).then((res) => {
        this.$message.info('分配成功')
        this.search()
        this.getRoomStatistics()
      })
    }
  }
}
</script>

<style lang="less" scoped>

.btnBox{
  text-align: center;
  button{
    margin-left:20px;
  }
}

.table-wrapper {
  margin-top: 20px;

  .table-head {
    height: 50px;

    & > div {
      width: 50%;
    }

    .fl {
      float: left;

      span {
        font-size: 14px;
        margin-right: 10px;
      }

      button {
        margin-right: 10px;
      }
    }

    .fr {
      display: flex;
      flex-direction: row;
      //float: right;
      text-align: right;
      justify-content: flex-end;

      & > * {
        margin-left: 10px;
      }

      .labelSpan {
        font-style: normal;
        margin-right: 10px;

        &::after {
          content: '>';
          margin-left: 10px;
        }
      }

      .labelSpan:last-child {
        &::after {
          content: '';
        }
      }
    }
  }

  .flagTxt {
    span {
      position: relative;
      padding-left: 20px;

      &::before {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        content: '';
        position: absolute;
        left: -5px;
        top: 3px;
        display: block;
      }
    }

    .green {
      background: #42b136;
    }

    .gray {
      background: #aaa;
    }

    .orange {
      background: #f59a23;
    }
  }
}

.box {
  img {
    width: 100%;
    height: auto;
  }
}

.action {
  a {
    margin-right: 5px;
  }
}

.inputNum {
  width: 400px;
}

.modalBox {
  .head {
    .fl {
      float: left;

      span {
        display: block;
      }
    }

    .fr {
      float: right;
      margin-top: 40px;

      span {
        margin-right: 10px;
      }
    }
  }
}

.inputBox {
  display: flex;

  span.input {
    flex: 1;
  }

  span.sign {
    width: 20px;
    text-align: center;
  }
}

.labelBody{
  /deep/ .ant-form-item-label{
    label{
      text-align: center;
      .labelBox{
        float:initial !important;
      }
      &::after{
        display:none;
      }
    }
  }
}
</style>
