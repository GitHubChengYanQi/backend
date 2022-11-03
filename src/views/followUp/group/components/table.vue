<template>
  <div>
    <a-card>
      <!--table-->
      <div class="table-wrapper">
        <a-table
          rowKey="bindId"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <div slot="contactData" slot-scope="contactData">
            <div>{{ contactData.name }}</div>
            <div>{{ contactData.nickName }}</div>
          </div>
          <div slot="mobile" slot-scope="mobile,record">
            <div>{{ record.contactData.mobile }}</div>
          </div>

          <div slot="createdAt" slot-scope="createdAt">
            <div>{{ timeFormat(createdAt) }}</div>
          </div>
          <div slot="action" class="action" slot-scope="text, record">
            <template>
              <div class="handle">
                <a-button type="primary" ghost @click="detail(record)">详情</a-button>
                <a-dropdown v-permission="'/categoryBind/edit#post'">
                  <a-menu slot="overlay">
                    <a-menu-item key="1" @click="open(1,record)" v-permission="'/categoryBind/add#post'"> 添加患者分组 </a-menu-item>
                    <a-menu-item key="2" v-if="record.categoryId != 0" @click="delItem(record)" v-permission="'/categoryBind/remove#post'"> 移除患者 </a-menu-item>
                    <a-menu-item key="3" @click="open(2,record)" v-permission="'/categoryBind/move#post'"> 移动患者分组 </a-menu-item>
                  </a-menu>
                  <a-button type="primary" ghost>调整分组<a-icon type="down" /></a-button>
                </a-dropdown>
              </div>
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->
      <GroupingSelectModal ref="groupingSelectModal" @updateList="initFn" />
    </a-card>
  </div>
</template>

<script>
import { categoryBindList, categoryBindDelete } from '@/api/healthManage'
import GroupingSelectModal from './groupingSelectModal'
import moment from 'moment'
export default {
  components: {
    GroupingSelectModal
  },
  data () {
    return {
      id: '',
      loading: false,
      screenData: {},
      statistics: {},
      columns: [
        {
          title: '患者信息',
          dataIndex: 'contactData',
          scopedSlots: { customRender: 'contactData' }
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          scopedSlots: { customRender: 'mobile' }
        },
        {
          title: '加入分组日期',
          sorterKey: 'createdAt',
          sorter: true,
          dataIndex: 'createdAt',
          align: 'center',
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
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
      sorter: {},
      categoryId: ''
    }
  },
  methods: {
    /**
     * 初始化
     */
    initFn (categoryId = '') {
      if (categoryId !== '') this.categoryId = categoryId
      this.search()
    },
    /**
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      // eslint-disable-next-line
      let params = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      const { order, column } = this.sorter
      params.sort = `createdAt desc`
      if (order === 'ascend') {
        params.sort = `${column.sorterKey} asc`
        // params[column.sorterKey] = 'ASC'
      } else if (order === 'descend') {
        // params[column.sorterKey] = 'DESC'
        params.sort = `${column.sorterKey} desc`
      }
      categoryBindList({ categoryId: this.categoryId }, params).then((res) => {
        console.log(res, '绑定患者列表')
        this.loading = false
        this.tableData = res.data.data.records
        this.pagination.total = res.data.data.total || 0
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
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.sorter = sorter
      this.getTableData()
    },
    /**
     * 详情
     */
    detail (row) {
      const {
        contactId
      } = row
      this.$router.push(`/healthManage/patientDetails1?contactId=${contactId}`)
    },
    /**
     * 添加患者分组 / 移动患者分组
     */
    open (type, item) {
      this.$refs.groupingSelectModal.open(type, item)
    },
    timeFormat (e) {
      return moment(e).format('YYYY-MM-DD')
    },
    /**
     * 删除操作
     */
    delItem (item) {
      const _self = this
      this.$confirm({
        content: '是否确认将患者从该分组中移除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const { code } = await categoryBindDelete({ bindId: item.bindId })
          if (code == 200) {
            _self.$message.success('操作成功')
            _self.initFn()
          } else {
            _self.$message.error('操作失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.handle {
  button {
    margin-right: 10px;
  }
}
</style>
