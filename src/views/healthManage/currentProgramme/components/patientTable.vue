<!-- 患者管理 -->
<template>
  <div>
    <a-row type="flex" justify="space-between" class="flex-row-center">
      <div>
        <a-form :form="form" layout="inline" @submit="handleSubmit">
          <a-form-item label="患者:">
            <a-input placeholder="请输入姓名" v-decorator="['contactName']" style="width: 120px" />
          </a-form-item>
          <a-form-item label="手机号:">
            <a-input placeholder="请输入手机号" v-decorator="['mobile']" style="width: 120px" />
          </a-form-item>
          <a-form-item label="患者分组：">
            <a-select
              style="width:180px"
              mode="multiple"
              v-decorator="['classNames']"
              :open="false"
              :showArrow="true"
              :allowClear="true"
              placeholder="请选择分组"
              @click.native="openClass"
              :maxTagCount="3" />
          </a-form-item>
          <a-form-item label="随访状态">
            <a-select style="width: 120px" v-decorator="['status']">
              <a-select-option value=""> 全部 </a-select-option>
              <a-select-option value="0"> 进行中 </a-select-option>
              <a-select-option value="99"> 已完成 </a-select-option>
              <a-select-option value="50"> 已暂停 </a-select-option>
              <a-select-option value="-1"> 已删除 </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              v-permission="'/healthManage/currentProgrammeDetail/patientTable#search'"> 查询 </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset"> 重置 </a-button>
          </a-form-item>
        </a-form>
      </div>
      <div>
        <a-button
          type="primary"
          @click="openMoadl"
          v-permission="'/healthManage/currentProgrammeDetail/patientTable#add'"> 添加患者 </a-button>
      </div>
    </a-row>
    <a-divider style="height: 0"></a-divider>

    <a-table
      rowKey="planBind"
      :loading="loading"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      @change="handleTableChange">
      <div slot="contactData" slot-scope="contactData">
        <div>{{ contactData.name }}</div>
        <div>{{ contactData.nickName }}</div>
      </div>
      <div slot="contactId" slot-scope="contactId, record">
        <div>{{ record.contactData.mobile }}</div>
      </div>
      <div slot="createdAt" slot-scope="createdAt">
        <div>{{ timeFormat(createdAt) }}</div>
      </div>
      <div slot="categoryNames" slot-scope="categoryNames">
        <template>
          <a-popover title="患者分组" v-if="categoryNames.length > 0">
            <template slot="content">
              <div class="labelBox">
                <a-tag v-for="(item, index) in categoryNames" :key="index">{{ item.name }}</a-tag>
              </div>
            </template>
            <a-tag type="button">
              查看
            </a-tag>
          </a-popover>
          <span class="nolabel" v-else>无分组</span>
        </template>
      </div>
      <div slot="status" slot-scope="status">
        <div v-if="status == 0">进行中</div>
        <div v-if="status == 99">已完成</div>
        <div v-if="status == 50">已暂停</div>
        <div v-if="status == -1">已删除</div>
      </div>
      <!-- eslint-disable-next-line-->
      <div slot="deletePlanList" slot-scope="deletePlanList, record">
        <template>
          <a-popover title="所属员工" v-if="record.contactData.employeeNames.length > 0">
            <template slot="content">
              <div class="labelBox">
                <a-tag v-for="(item, index) in record.contactData.employeeNames" :key="index">{{ item }}</a-tag>
              </div>
            </template>
            <a-tag type="button">
              查看
            </a-tag>
          </a-popover>
          <span class="nolabel" v-else>无员工</span>
        </template>
      </div>
      <!-- eslint-disable-next-line-->
      <div slot="planId" slot-scope="planId, record">
        <a-row class="flex-row-center">
          <a-button
            type="primary"
            ghost
            @click="toDetail(record)"
            v-permission="'/healthManage/currentProgrammeDetail/patientTable#detail'">详情</a-button>
          <!-- 进行中： 详情，暂停， 删除 ， 健康档案 0
                    已完成： 详情，健康档案 99
                    已暂停： 详情，继续，删除，健康档案 50
                    已删除： 详情 , 删除记录 -1 -->
          <a-dropdown
            v-if="record.status != -1"
            v-permission="'/healthManage/currentProgrammeDetail/patientTable#update'">
            <a-menu slot="overlay">
              <a-menu-item v-if="record.status == 0" @click="suspendOrContinue(record)"> 暂停 </a-menu-item>
              <a-menu-item v-if="record.status == 50" @click="suspendOrContinue(record)"> 继续 </a-menu-item>
              <a-menu-item v-if="record.status != 99" @click="delUser(record)"> 删除 </a-menu-item>
              <a-menu-item @click="openArchives(record)"> 健康档案 </a-menu-item>
            </a-menu>
            <a-button type="primary" ghost style="margin-left: 8px">
              更多
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
          <a-button
            style="margin-left: 8px"
            v-else
            type="danger"
            @click="delRow(record)"
            v-permission="'/healthManage/currentProgrammeDetail/patientTable#remove'"> 删除记录 </a-button>
        </a-row>
      </div>
    </a-table>
    <a-modal v-model="visible" title="选择患者" @ok="handleOk" :width="400" :destroyOnClose="true">
      <a-input-search placeholder="输入患者名称" v-model="searchVal" @search="searchUser" @change="searchUser" />
      <div
        class="demo-infinite-container"
        v-infinite-scroll="getUser"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10">
        <a-spin :spinning="userListLoading">
          <a-checkbox-group v-model="userIdList" style="width: 100%">
            <a-list :data-source="userData">
              <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta :description="item.mobile">
                  <a slot="title" href="https://www.antdv.com/">{{ item.name }}</a>
                  <a-avatar size="large" slot="avatar" :src="item.avatar" />
                </a-list-item-meta>
                <div>
                  <a-checkbox :value="item.id"> </a-checkbox>
                </div>
              </a-list-item>
              <div v-if="listLoading" class="demo-loading-container">
                <a-spin />
              </div>
            </a-list>
          </a-checkbox-group>
        </a-spin>
      </div>
    </a-modal>
    <a-modal :visible="visible1" title="选择分组" @ok="handleOk1" :width="450" @cancel="visible1 = false">
      <div style="height: 450px;overflow-y: auto;padding: 0 10px">
        <a-list :data-source="[1]">
          <!-- eslint-disable-next-line-->
          <a-list-item slot="renderItem" slot-scope="item" style="border-bottom:1px solid #e8e8e8">
            <a-list-item-meta description="全部分组"></a-list-item-meta>
            <div>
              <a-checkbox :value="true" :checked="isAllCategory" @change="boxChange"></a-checkbox>
            </div>
          </a-list-item>
        </a-list>
        <a-checkbox-group v-model="categoryIds" style="width: 100%" @change="boxChange1">
          <a-list :data-source="categoryArr">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta :description="item.name"></a-list-item-meta>
              <div>
                <a-checkbox :value="item.categoryId"></a-checkbox>
              </div>
            </a-list-item>
          </a-list>
        </a-checkbox-group>
      </div>
    </a-modal>
    <a-modal :visible="archives" title="健康档案" :footer="null" :width="950" @cancel="archives = false">
      <HealthRecord :is-component="true" :contact-id="currentId" v-if="archives" />
    </a-modal>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue'
import { planBindAddBatch, planBindList, planBindEdit, planBindDelete, categoryList, workContactList } from '@/api/healthManage'
import infiniteScroll from '@/utils/directive'
// import Archives from '../archives'
import moment from 'moment'
import HealthRecord from '@/views/workContactNew/detailComponents/healthRecord'
const columns = [
  {
    title: '患者信息',
    dataIndex: 'contactData',
    key: 'contactData',
    scopedSlots: { customRender: 'contactData' }
  },
  {
    title: '手机号',
    dataIndex: 'contactId',
    key: 'contactId',
    scopedSlots: { customRender: 'contactId' }
  },
  {
    title: '加入方案日期',
    sorter: true,
    dataIndex: 'createdAt',
    sorterKey: 'createdAt',
    align: 'center',
    width: 300,
    scopedSlots: { customRender: 'createdAt' }
  },
  {
    title: '患者分组',
    key: 'categoryNames',
    dataIndex: 'categoryNames',
    scopedSlots: { customRender: 'categoryNames' }
  },
  {
    title: '随访状态',
    key: 'status',
    dataIndex: 'status',
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '所属员工',
    key: 'deletePlanList',
    dataIndex: 'deletePlanList',
    width: 180,
    scopedSlots: { customRender: 'deletePlanList' }
  },
  {
    title: '操作',
    key: 'planId',
    dataIndex: 'planId',
    width: 210,
    scopedSlots: { customRender: 'planId' }
  }
]
export default {
  directives: { infiniteScroll },
  components: {
    Empty,
    HealthRecord,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  // eslint-disable-next-line
  props: ['planId'],
  data () {
    return {
      form: this.$form.createForm(this),
      columns,
      visible: false,
      visible1: false,
      userData: [],
      listLoading: false,
      busy: false,
      userIdList: [],
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      userListPagination: {
        size: 20,
        page: 0,
        total: 0,
        totalPage: 0
      },
      sorter: {},
      isGet: false,
      searchVal: '',
      searchObj: {},
      categoryArr: [],
      userListLoading: false,
      categoryIds: [],
      isAllCategory: true,
      currentId: '',
      archives: false
    }
  },
  watch: {
    visible (newVal, oldVal) {
      if (!newVal) this.userIdList = []
    }
  },
  created () {
    this.initFn()
    this.getCategoryList()
  },
  mounted () {
    this.form.setFieldsValue({
      status: '',
      classNames: ['全部分组']
    })
  },
  beforeDestroy () { },
  methods: {
    /**
     * 初始化
     */
    initFn () {
      this.getTableData()
    },
    /**
     * 拉取列表
     */
    getTableData () {
      // contactTagIds//分组id集合
      // contactName//姓名
      // mobile//手机号
      // planId//计划id
      this.loading = true
      const { order, column } = this.sorter

      const params = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      if (order === 'ascend') {
        params.sort = `bind.${column.sorterKey} asc`
        // params[column.sorterKey] = 'ASC'
      } else if (order === 'descend') {
        // params[column.sorterKey] = 'DESC'
        params.sort = `bind.${column.sorterKey} desc`
      }
      planBindList(
        {
          planId: this.planId,
          ...this.searchObj
        },
        params
      ).then((res) => {
        this.loading = false
        this.tableData = res.data.data.list
        this.pagination.total = res.data.data.page.total
      })
    },
    openClass () {
      this.visible1 = true
    },
    handleOk1 () {
      var name_ = []
      if (!this.isAllCategory) {
        this.categoryArr.forEach(ele => {
          if (this.categoryIds.includes(ele.categoryId)) {
            name_.push(ele.name)
          }
        })
        this.form.setFieldsValue({
          classNames: name_
        })
      }
      this.visible1 = false
    },
    boxChange (e) {
      this.isAllCategory = e.target.checked
      if (e.target.checked) {
        this.form.setFieldsValue({
          classNames: ['全部分组']
        })
        this.categoryIds = []
      }
    },
    boxChange1 () {
      this.isAllCategory = false
    },
    /**
     * 查询
     */
    handleSubmit (e) {
      e.preventDefault()
      this.pagination.current = 1
      this.form.validateFields((err, values) => {
        if (!err) {
          this.searchObj = {
            ...values,
            categoryIds: this.categoryIds
          }
          this.getTableData()
        }
      })
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.sorter = sorter
      console.log(this.sorter)
      this.getTableData()
    },
    /**
     * 详情
     */
    toDetail (row) {
      const {
        contactData: { id }
      } = row
      this.$router.push(`/healthManage/patientDetails?contactId=${id}`)
    },
    /**
     * 添加患者弹窗
     */
    openMoadl () {
      this.visible = true
      this.searchVal = ''
      this.userData = []
      this.userListPagination.page = 0
      this.userListPagination.current = 0
      this.userListPagination.totalPage = 0
      this.getTableData()
    },
    searchUser () {
      this.userListPagination.page = 0
      this.userListPagination.totalPage = 0
      this.userData = []
      this.getUser()
    },
    /**
     * 查询客户列表
     */
    async getUser (e) {
      if (this.isGet) return
      if (this.userListPagination.page == 0) {
        this.userListLoading = true
      }
      const { totalPage, page } = this.userListPagination
      this.userListPagination.page = page + 1
      if (totalPage && page >= totalPage) {
        this.busy = true
        return
      }
      this.isGet = true
      this.listLoading = true
      const params = {
        ...this.userListPagination
      }
      const { data } = await workContactList({ keyWords: this.searchVal, planId: this.planId }, params)
      const arr = this.userData
      this.userListLoading = false
      this.isGet = false
      this.listLoading = false
      this.userData = arr.concat(data.list)
      this.userListPagination.totalPage = data.page.total
    },
    /**
     * 添加患者确定按钮
     */
    async handleOk () {
      const { code } = await planBindAddBatch({
        planId: this.planId,
        workContactIds: this.userIdList
      })
      this.visible = false
      if (code === 200) {
        this.$message.success('添加成功')
      } else {
        this.$message.error('添加失败')
      }
      this.getTableData()
    },
    /**
     * 重置
     */
    handleReset () {
      this.searchObj = {}
      this.categoryIds = []
      this.isAllCategory = true
      this.form.setFieldsValue({
        classNames: ['全部分组']
      })
      this.pagination.current = 1
      this.form.resetFields()
      this.getTableData()
    },
    timeFormat (e) {
      return moment(e).format('YYYY-MM-DD hh:mm:ss')
    },
    /**
     * 打开健康档案弹窗
     */
    openArchives ({ contactId }) {
      this.currentId = contactId
      this.archives = true
    },
    /**
     * 启用or暂停操作
     */
    async suspendOrContinue ({ planBind, status, contactData: { id } }) {
      let data
      if (status == 0) {
        console.log('暂停')
        data = await planBindEdit({ planBind, id, status: 50 })
      } else {
        console.log('继续')
        data = await planBindEdit({ planBind, id, status: 0 })
      }
      if (data.code == 200) {
        this.$message.success('操作成功')
      } else {
        this.$message.error('操作失败')
      }
      this.getTableData()
    },
    /**
     * 删除患者
     */
    delUser ({ planBind }) {
      const _self = this
      this.$confirm({
        content: '患者从方案中删除后不可恢复继续执行方案是否确认删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const { code } = await planBindEdit({ planBind, status: -1 })
          if (code == 200) {
            _self.$message.success('操作成功')
          } else {
            _self.$message.error('操作失败')
          }
          _self.getTableData()
        }
      })
    },
    /**
     * 删除记录
     */
    delRow ({ planBind }) {
      const _self = this
      this.$confirm({
        content: '是否清除患者记录？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const { code } = await planBindDelete({ planBind })
          if (code == 200) {
            _self.$message.success('操作成功')
          } else {
            _self.$message.error('操作失败')
          }
          _self.getTableData()
        }
      })
    },
    // 查询分组列表
    async getCategoryList () {
      const {
        data: { data }
      } = await categoryList()
      this.categoryArr = data
    }
  }
}
</script>
<style lang="less" scoped>
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 330px;
  margin-top: 20px;
}

.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}

.ant-list-item-meta {
  padding: 6px 0;
}

/deep/ .employee-tag {
  background-color: #fff !important;
  border-color: #e9e9e9 !important;
  padding: 0 9px;
  font-size: 12px;
}

/deep/ .tag-box {
  font-size: 12px;
  padding: 0 6px;
  height: 23px;
  margin-bottom: 4px;
}
</style>
