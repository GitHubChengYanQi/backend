<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="6">
              <a-form-item label="客户姓名：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-input v-model="screenData.contactName" placeholder="请输入客户姓名"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" >
              <a-form-item label="所属员工：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-input v-model="screenData.employeeName" placeholder="请输入员工姓名"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="添加日期：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-range-picker
                  style="width: 300px"
                  v-model="time"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期', '结束日期']"
                  @change="onOk"
                />
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
            <span class="f-blod">共{{ data.unassignedNum }}个待分配客户</span>
            <span class="f-blod">上次同步时间：{{ data.lastUpdateTime }}</span>
          </div>
          <div class="fr">
            <!--            <a-button-->
            <!--              type="primary"-->
            <!--              ghost-->
            <!--              @click="allocation"-->
            <!--              v-permission="'/contactTransfer/resignIndex@allocation'"-->
            <!--            >分配客户</a-button>-->
            <SelectPersonnel
              v-model="treeData"
              @getVal="acceptData"
              type="buttonGhost"
              name="分配客户"
              :multiple="false"
              :fieldNames="{ children: 'children', title: 'title', key: 'key' }"
              :transferTip="true"
              v-permission="'/contactTransfer/resignIndex@allocation'" />
            <a-button type="primary" ghost @click="$router.push('/contactTransfer/resignAllotRecord')" v-permission="'/contactTransfer/resignIndex@resignAllotRecord'">分配记录</a-button>
            <a-button type="primary" ghost @click="updateTo" v-permission="'/contactTransfer/resignIndex@updateTo'">同步</a-button>
            <selectStaff ref="choiceStaff" @change="acceptData" />
          </div>
        </div>
        <a-table
          rowKey="contactWxId"
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
              <a-popover title="客户标签" v-if="row.tags.length > 0">
                <template slot="content">
                  <div class="labelBox">
                    <a-tag v-for="(item, index) in row.tags" :key="index">{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span class="nolabel" v-else>无标签</span>
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
            <!-- <a @click="$router.push({ path: '/workContact/contactFieldPivot?contactId='+record.contactId+'&employeeId='+ record.employeeId +'&isContact=2'})">客户详情</a> -->
            <a @click="$router.push({ path: '/workContact/contactFieldPivot?id='+record.contactId})">客户详情</a>
          </div>
        </a-table>
      </div>
      <!--end table-->

    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { unassignedListApi, saveUnassignedListApi, allotContactApi, getStatistics } from '@/api/contactTransfer'
import selectStaff from '@/components/addlabel/selectStaff'
export default {
  components: {
    selectStaff
  },
  data () {
    return {
      loading: false,
      selectedRowKeys: [], // 选中key
      selectedRows: [], // 选中row
      screenData: {},
      data: {},
      time: [],
      columns: [
        {
          key: 'nickName',
          dataIndex: 'nickName',
          title: '客户昵称'
        },
        {
          key: 'employeeName',
          dataIndex: 'employeeName',
          title: '所属员工',
          scopedSlots: { customRender: 'employeeName' }
        },
        {
          key: 'tags',
          dataIndex: 'tags',
          title: '客户标签',
          scopedSlots: { customRender: 'tags' }
        },
        {
          key: 'addTime',
          dataIndex: 'addTime',
          title: '添加时间'
        },
        {
          key: 'lastMsgTime',
          dataIndex: 'lastMsgTime',
          title: '上次对话时间'
        },
        {
          key: 'addWay',
          dataIndex: 'addWay',
          title: '添加渠道'
        },
        // {
        //   dataIndex: 'state',
        //   title: '接替状态',
        //   scopedSlots: { customRender: 'state' }
        // },
        {
          key: 'operation',
          dataIndex: 'operation',
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
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
      this.getStatistics()
      this.getTableData()
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
      params.employeeId = params.employeeId ? params.employeeId.join(',') : ''
      unassignedListApi(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.pagination.total = res.data.page.total
      })
    },
    /**
     * 拉取统计数据
     */
    getStatistics () {
      getStatistics().then(res => {
        this.data.lastUpdateTime = res.data.lastUpdateTime
        this.data.unassignedNum = res.data.unassignedNum
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
      this.time = []
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
     * 取消
     */
    reset () {
      this.modalVisible = false
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
    /**
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      this.screenData.addTimeStart = value.length > 0 ? moment(value[0]).format('YYYY-MM-DD') : ''
      this.screenData.addTimeEnd = value.length > 0 ? moment(value[1]).format('YYYY-MM-DD') : ''
    },
    /**
     * 分配客户
     */
    allocation () {
      if (this.selectedRowKeys === '' || this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择客户')
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
        list: '',
        takeoverUserId: e[0]
      }
      const arr = this.selectedRows
      const ids = []
      for (let i = 0; i < arr.length; i++) {
        ids.push({
          contactWxId: arr[i].contactWxId,
          employeeWxId: arr[i].employeeWxId
        })
      }
      params.list = JSON.stringify(ids)
      allotContactApi(params).then((res) => {
        this.$message.info('分配成功')
        this.search()
        this.getStatistics()
      })
    },
    /**
     * 同步
     */
    updateTo () {
      saveUnassignedListApi().then(() => {
        this.$message.success('同步成功')
        this.search()
        this.getStatistics()
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
    display: flex;
    flex-direction: row;
    & > div {
      width: 50%;
    }

    .fl {
      float: left;
      width: 50%;
      span {
        font-size: 14px;
        margin-right: 10px;
      }

      button {
        margin-right: 10px;
      }
    }

    .fr {
      width: 50%;
      flex-direction: row;
      //float: right;
      text-align: right;
      display: flex;
      flex-direction: row;
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
.labelBox{
  width:400px;
  span{
    margin-bottom:10px;
  }
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
