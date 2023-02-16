<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form :form="form">
          <a-row :gutter="16">
            <a-col :lg="5">
              <a-form-item label="患者：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 14 } }">
                <a-input v-model="screenData.contactName" placeholder="请输入姓名"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="5">
              <a-form-item label="手机号：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 14 } }">
                <a-input v-model="screenData.mobile" placeholder="请输入手机号"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="5">
              <a-form-item label="患者分组：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 14 } }">
                <a-select
                  style="width:180px"
                  mode="multiple"
                  v-decorator="['classNames']"
                  :open="false"
                  :showArrow="true"
                  :allowClear="true"
                  placeholder="请选择分组"
                  @click.native="openClass"
                  :maxTagCount="3"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="5">
              <a-form-item label="所属员工：" :labelCol="{ lg: { span: 7 } }" :wrapperCol="{ lg: { span: 14 } }">
                <!-- <SelectEmployeeInput v-model="employeeIds" :changeId="true"/> -->
                <selectPersonnel
                  class="input"
                  v-model="employeeIds"
                  :changeId="true"
                  :num="1"
                  :type="'selector'"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="4">
              <div class="handle">
                <a-button type="primary" @click="search" v-permission="'/ollowUp/patient1#search'">查询</a-button>
                <a-button @click="resetSearch">重置</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--end search-->

      <!--table-->
      <div class="table-wrapper">
        <a-table
          rowKey="id"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <div slot="name" slot-scope="name, record">
            <div>{{ record.name }}</div>
            <div>{{ record.nickName }}</div>
          </div>
          <div slot="mobile" slot-scope="mobile">
            <div>{{ mobile }}</div>
          </div>
          <div slot="employeeNames" slot-scope="employeeNames">
            <template>
              <a-popover title="所属员工" v-if="employeeNames.length > 0">
                <template slot="content">
                  <div class="labelBox">
                    <a-tag v-for="(item, index) in employeeNames" :key="index">{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span class="nolabel" v-else>无员工</span>
            </template>
          </div>
          <div slot="createdAt" slot-scope="createdAt">
            <div>{{ timeFormat(createdAt) }}</div>
          </div>
          <div slot="categoryResults" slot-scope="categoryResults">
            <template>
              <a-popover title="患者分组" v-if="categoryResults.length > 0">
                <template slot="content">
                  <div class="labelBox">
                    <a-tag v-for="(item, index) in categoryResults" :key="index">{{ item.name }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span class="nolabel" v-else>无分组</span>
            </template>
          </div>
          <div slot="planList" slot-scope="planList">
            <template>
              <a-popover title="随访方案" v-if="planList.length > 0">
                <template slot="content">
                  <div class="labelBox">
                    <a-tag v-for="(item, index) in planList" class="tag-box" style="color: #1890ff;" :key="index" @click="toDetail(item)">{{ item.planName }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span class="nolabel" v-else>无方案</span>
            </template>
          </div>
          <div slot="action" class="action" slot-scope="text, record">
            <template>
              <div class="handle">
                <a-button type="primary" ghost @click="detail(record)" v-permission="'/ollowUp/patient1#detail'">详情</a-button>
                <a-dropdown v-permission="'/ollowUp/patient1#update'">
                  <a-menu slot="overlay">
                    <a-menu-item key="1" v-permission="'/ollowUp/patient1#detail1'" @click="open(1,record)"> 添加患者分组 </a-menu-item>
                    <a-menu-item key="2" v-permission="'/ollowUp/patient1#detail2'" @click="open(3,record)"> 删除患者分组 </a-menu-item>
                    <a-menu-item key="3" v-permission="'/ollowUp/patient1#detail3'" @click="open(4,record)"> 添加随访方案 </a-menu-item>
                    <a-menu-item key="4" v-permission="'/ollowUp/patient1#detail4'" @click="open(5,record)"> 健康档案 </a-menu-item>
                  </a-menu>
                  <a-button type="primary" ghost>更多<a-icon type="down" /></a-button>
                </a-dropdown>
              </div>
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->
      <GroupingSelectModal ref="groupingSelectModal" @updateList="initFn" />
      <ProgrammeMoadl ref="programmeMoadl" @updataPage="initFn" />
      <UserTree ref="userTree" @setUserIds="setUserIds" />
      <a-modal :visible="visible" title="选择分组" @ok="handleOk" :width="450" @cancel="visible = false">
        <div style="height: 450px;overflow-y: auto;padding: 0 10px">
          <a-list :data-source="[1]">
            <a-list-item slot="renderItem" slot-scope="item" style="border-bottom:1px solid #e8e8e8">
              <a-list-item-meta description="全部分组"></a-list-item-meta>
              <div>
                <a-checkbox :value="item" :checked="isAllCategory" @change="boxChange"></a-checkbox>
              </div>
            </a-list-item>
          </a-list>
          <a-checkbox-group v-model="categoryIds" style="width: 100%" @change="boxChange1">
            <a-list :data-source="categoryArr">
              <a-list-item slot="renderItem" slot-scope="item" >
                <a-list-item-meta :description="item.name"></a-list-item-meta>
                <div>
                  <a-checkbox :value="item.categoryId"></a-checkbox>
                </div>
              </a-list-item>
            </a-list>
          </a-checkbox-group>
        </div>
      </a-modal>
      <a-modal :visible="archives" title="健康档案" :footer="null" :width="1100" @cancel="archives = false">
        <HealthRecord :is-component="true" :contact-id="currentId" v-if="archives" />
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { categoryList, planBindContactList } from '@/api/healthManage'
import moment from 'moment'
import GroupingSelectModal from '../../group/components/groupingSelectModal.vue'
import ProgrammeMoadl from '../../../healthManage/patientDetails/components/programmeMoadl'
import UserTree from './userTree.vue'
import HealthRecord from '@/views/workContactNew/detailComponents/healthRecord'
export default {
  components: {
    GroupingSelectModal,
    ProgrammeMoadl,
    UserTree,
    HealthRecord
  },
  data () {
    return {
      form: this.$form.createForm(this),
      id: '',
      loading: false,
      screenData: {},
      statistics: {},
      columns: [
        {
          title: '患者信息',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          with: 400
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          align: 'center',
          scopedSlots: { customRender: 'mobile' }
        },
        {
          title: '所属员工',
          dataIndex: 'employeeNames',
          align: 'left',
          width: 220,
          scopedSlots: { customRender: 'employeeNames' }
        },
        {
          title: '加入管理日期',
          dataIndex: 'createdAt',
          sorterKey: 'createdAt',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: '患者分组',
          dataIndex: 'categoryResults',
          align: 'center',
          width: 220,
          scopedSlots: { customRender: 'categoryResults' }
        },
        // {
        //   title: '近期预警',
        //   dataIndex: 'partakeTime',
        //   align: 'center'
        // },
        {
          title: '随访方案',
          dataIndex: 'planList',
          align: 'center',
          width: 220,
          scopedSlots: { customRender: 'planList' }
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
      chanelDict: [],
      categoryArr: [],
      employeeIds: [],
      visible: false,
      categoryIds: [],
      isAllCategory: true,
      archives: false,
      currentId: ''
    }
  },
  created () {
    this.initFn()
    this.getCategoryList()
  },
  mounted () {
    this.form.setFieldsValue({
      classNames: ['全部分组']
    })
  },
  methods: {
    /**
     * 初始化
     */
    initFn () {
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
      if (order === 'ascend') {
        params.sort = `bind.${column.sorterKey} asc`
        // params[column.sorterKey] = 'ASC'
      } else if (order === 'descend') {
        // params[column.sorterKey] = 'DESC'
        params.sort = `bind.${column.sorterKey} desc`
      }
      planBindContactList({ isAuth: 1, employeeIds: this.employeeIds, ...this.screenData, categoryIds: this.categoryIds }, params).then((res) => {
        this.loading = false
        this.tableData = res.data.data.list
        this.pagination.total = res.data.data.page.total
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
      this.employeeIds = []
      this.categoryIds = []
      this.isAllCategory = true
      this.screenData = {}
      this.$refs.userTree.userList = []
      this.form.setFieldsValue({
        names: '',
        classNames: ['全部分组']
      })
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
     * 详情
     */
    detail ({ id }) {
      this.$router.push(`/healthManage/patientDetails?contactId=${id}`)
    },
    timeFormat (e) {
      return moment(e).format('YYYY-MM-DD')
    },
    // 查询分组列表
    async getCategoryList () {
      const {
        data: { data }
      } = await categoryList()
      this.categoryArr = data
    },
    // 详情
    toDetail ({ planId, planName, creatorName }) {
      this.$router.push(`/healthManage/currentProgrammeDetail?planId=${planId}&planName=${planName}&creatorName=${creatorName}`)
    },
    /**
     * 添加患者分组 / 移动患者分组 / 添加方案
     */
    open (type, item) {
      if (type == 5) {
        this.currentId = item.id + ''
        this.archives = true
        return
      }
      if (type == 4) {
        this.$refs.programmeMoadl.open(1, false, item.id)
        return
      }
      this.$refs.groupingSelectModal.open(type, item, item.categoryResults)
    },
    // 打开用户树
    openTreeList () {
      this.$refs.userTree.open()
    },
    openClass () {
      this.visible = true
    },
    handleOk () {
      const name = []
      if (!this.isAllCategory) {
        this.categoryArr.forEach(ele => {
          if (this.categoryIds.includes(ele.categoryId)) {
            name.push(ele.name)
          }
        })
        this.form.setFieldsValue({
          classNames: name
        })
      }
      this.visible = false
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
    // 选择用户后返回的数组
    setUserIds (list) {
      // eslint-disable-next-line
      let arr = []
      let name = ''
      list.forEach(ele => {
        arr.push(ele.id)
        name += `${ele.title};`
      })
      this.form.setFieldsValue({
        names: name
      })
      this.employeeIds = arr
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
.labelBox{
  width:400px;
  span{
    margin-bottom:10px;
  }
}
</style>
