<template>
  <!-- 主维护人权益分配 -->
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="6">
              <a-form-item label="客户昵称：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-input v-model="screenData.contactName" placeholder="请输入客户昵称"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="主维护人：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <selectPersonnel
                  v-model="screenData.maintainerIds"
                  v-if="treeData"
                  :num="1"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="机构门店：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <div class="select-employee-input">
                  <a-tree-select
                    v-model="screenData.storeIds"
                    style="width: 100%"
                    :tree-data="deptTreeData"
                    tree-checkable
                    placeholder="请选择机构"
                    :maxTagCount="1"
                    show-checked-strategy="SHOW_ALL"
                    :replaceFields="replaceFields"
                    allowClear
                  />
                </div>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="随访任务：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-select ref="select" v-model="screenData.followUpTask" placeholder="请选择随访任务" allowClear>
                  <a-select-option value="1">有</a-select-option>
                  <a-select-option value="0">无</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item label="添加时间：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 17 } }">
                <a-range-picker
                  v-model="screenData.time"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                  :placeholder="['开始日期', '结束日期']"
                  @change="onOk"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--end search-->

      <!--table-->
      <div class="table-wrapper">
        <div class="table-head">
          <div class="fl">
            <span>待分配客户数 {{ this.selectedRowKeys.length }}个</span>
          </div>
          <div class="fr">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
            <selectPersonnel
              :name="'批量分配客户'"
              :multiple="false"
              :num="5"
              :type="'buttonLink'"
              :layout="'inline'"
              @getVal="batchAllocate"
            />
          </div>
        </div>
        <a-table
          :rowKey="(record,index)=>{return index}"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <div slot="news" slot-scope="text, record">
            <div class="news">
              <img :src="record.avatar" @click="getContactDetail(record)" :style="' cursor: pointer'" />
              <div class="name">
                {{ record.contactName }}
                <br />
                {{ record.remark }}
              </div>
            </div>
          </div>
          <div slot="type" slot-scope="text">
            <template>
              {{ text }}
            </template>
          </div>
          <div slot="action" class="action" slot-scope="text, record">
            <template>
              <a @click="detailFn(record)">交易详情</a>
              <selectPersonnel
                :name="'分配'"
                v-if="treeData"
                :type="'link'"
                :multiple="false"
                :num="1"
                :layout="'inline'"
                @getVal="
                  (ids) => {
                    getIds(ids, record)
                  }
                "
              />
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->

      <!--detail modal-->
      <a-modal width="80%" :visible="detailModalVisible" @cancel="cancel" title="交易详情">
        <div class="modalBox">
          <a-table :rowKey="(record,index)=>{return index}" @change="orderTableChange" :loading="loading" :columns="columns2" :data-source="detailTableData">
            <div slot="action" class="action" slot-scope="text, record">
              <template>
                <a @click="allocateCollaborator(record)">分配</a>
              </template>
            </div>
          </a-table>
        </div>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { getMaintainerList, allocateContact, getOrderDetailList } from '@/api/maintainer'
import { deepClone } from '@/utils/util'
import { departmentList } from '@/api/common.js'

export default {
  data () {
    return {
      loading: false,
      detailModalVisible: false,
      selectedRowKeys: [], // 选中key
      selectedRows: [], // 选中row
      screenData: {
        // storeIds: []
      },
      columns: [
        {
          title: '客户昵称',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'news' }
        },
        // {
        //   title: '会员等级',
        //   dataIndex: 'memberLevel',
        //   sorter: true,
        //   width: 100,
        //   align: 'center'
        // },
        {
          title: '主维护人',
          dataIndex: 'maintainerName',
          align: 'center',
          width: 150
        },
        {
          title: '所属机构',
          dataIndex: 'belongDept',
          align: 'center',
          width: 150
        },
        {
          title: '所在门店',
          dataIndex: 'belongStore',
          align: 'center',
          width: 150
        },
        {
          title: '随访任务',
          dataIndex: 'followUpTask',
          align: 'center',
          width: 150,
          customRender: (text) => {
            return text ? '有' : '无'
          }
        },
        {
          title: '添加时间',
          dataIndex: 'addTime',
          align: 'center',
          sorter: true,
          width: 150,
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          }
        },
        {
          title: '上次订单时间',
          dataIndex: 'latestOrderTime',
          align: 'center',
          sorter: true,
          width: 150,
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns2: [
        {
          title: '所属协作人',
          dataIndex: 'collaboratorName',
          align: 'center',
          width: 150
        },
        {
          title: '所属片区',
          dataIndex: 'collaboratorDepartmentName',
          width: 150,
          align: 'left',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '所属门店',
          dataIndex: 'collaboratorStoreName',
          align: 'left',
          width: 150,
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '订单笔数',
          dataIndex: 'orderNum',
          align: 'center',
          sorter: true,
          width: 100
        },
        {
          title: '销售金额',
          dataIndex: 'totalAmount',
          sorter: true,
          align: 'center',
          width: 100
        },
        {
          title: '协作人佣金',
          dataIndex: 'collaboratorAmount',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      detailTableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      contactId: null,
      sorter: {},
      treeData: undefined,
      deptTreeData: [],
      replaceFields: {
        children: 'childDepartment',
        title: 'name',
        key: 'wxDepartmentId',
        value: 'id'
      }
    }
  },
  created () {
    this.initFn()
  },
  methods: {
    deepClone,
    /**
     * 初始化
     */
    initFn () {
      this.departmentList()
      this.getTableData()
    },
    /**
 * 拉取部门数据
 */
    departmentList () {
      departmentList().then(res => {
        this.deptTreeData = res.data
        this.treeData = res.data
      })
    },
    /**
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      this.resetSelect()
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      // 添加排序
      const { order, column } = this.sorter
      if (column && column.dataIndex) {
        params['orderBy'] = column.dataIndex
        if (order === 'ascend') {
          params['sort'] = 'ASC'
        } else if (order === 'descend') {
          params['sort'] = 'DESC'
        }
      }
      // 添加查询参数
      Object.assign(params, ...[this.screenData])
      getMaintainerList(params).then((res) => {
        this.tableData = res.data.list
        this.pagination.total = res.data.page.total
        this.loading = false
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
      this.sorter = {}
      this.screenData = {}
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.sorter = sorter
      this.getTableData()
    },
    /**
     * 表格选择监听
     * @param {*} selectedRowKeys
     */
    onSelectChange (selectedRowKeys, row) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = row
    },
    resetSelect () {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    /**
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      this.screenData.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
      this.screenData.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    /**
      * 选择待分配人员回调
      */
    getIds (ids, record) {
      if (!ids || ids.length === 0) {
        this.$message.warning('请选择待分配协助人')
        return
      }
      const data = {
        entityList: [
          {
            id: record.id,
            contactId: record.contactId,
            maintainerId: parseInt(ids[0])
          }]
      }
      this.doAllocate(data)
    },
    /**
     * 订单详情
     */
    detailFn (record) {
      this.detailModalVisible = true
      this.contactId = record.contactId
      this.id = record.id
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        contactId: record.contactId,
        sort: 'numDesc'
      }
      getOrderDetailList(params).then((res) => {
        this.detailTableData = res.data.records
      })
    },
    /**
     * 批量分配
     */
    batchAllocate (ids) {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.warning('请选择客户')
        return
      }
      this.selectedRows.map((item) => {
        item.maintainerId = parseInt(ids[0])
      })
      const data = { entityList: this.selectedRows }
      this.doAllocate(data)
      this.resetSelect()
    },
    /**
     * 交易详情分配主维护人
     */
    allocateCollaborator (record) {
      const entity = {
        id: this.id,
        contactId: this.contactId,
        maintainerId: record.collaboratorId
      }
      const data = { entityList: [entity] }
      this.doAllocate(data)
      this.detailModalVisible = false
    },
    /**
     * 执行分配操作
     */
    doAllocate (data) {
      allocateContact(data).then((res) => {
        if (res.code === 200) {
          this.getTableData()
          this.$message.success('分配成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    cancel () {
      this.id = null
      this.contactId = null
      this.detailModalVisible = false
    },
    getContactDetail (record) {
      this.$router.push(
        {
          path: '/workContact/contactFieldPivot',
          query: {
            contactId: record.contactId,
            employeeId: record.maintainerId,
            isContact: 2

          }
        })
    },
    orderTableChange (page, filter, sort) {
      let orderSort = ''
      if (sort.order == 'ascend') {
        orderSort = `${sort.field}Asc`
      } else {
        orderSort = `${sort.field}Desc`
      }
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        contactId: this.contactId,
        sort: orderSort
      }
      getOrderDetailList(params).then((res) => {
        this.detailTableData = res.data.records
      })
    }
  }
}
</script>

<style lang="less" scoped>
.alter {
  width: 80%;
  height: 50px;
  background: #e6f7ff;
  border: 1px solid #c2eaff;
  padding: 0 15px;

  span {
    line-height: 50px;
    margin-left: 10px;
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
        font-size: 16px;
      }

      button {
        margin-right: 10px;
      }
    }

    .fr {
      float: right;
      text-align: right;

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
  .news {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
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
  .total {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
