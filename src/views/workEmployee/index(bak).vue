<template>
  <div class="work-employee">
    <a-card>
      <div class="btn-box">
        <a-button v-permission="'/workEmployee/index@search'" type="primary" @click="() => {this.visible = true}">条件筛选</a-button>
        <div>
          <p>最后一次同步时间：{{ syncTime }}</p>
          <a-button v-permission="'/workEmployee/index@sync'" @click="() => { this.syncEmployeeDefine() }">同步企业微信通讯录</a-button>
        </div>
      </div>
      <div class="table-wrapper">
        <a-table
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.id"
          :pagination="pagination"
          @change="handleTableChange">
          <div class="msg-box" slot="name" slot-scope="text, record">
            <img v-if="record.thumbAvatar" :src="record.thumbAvatar" :onerror="errorImg" style="width:40px; height:40px"/>
            <a-icon v-if="!record.thumbAvatar" type="user" style="font-size:35px "/>
            <span style="marginRight: 10px">{{ record.name }}</span>
            <a-icon v-if="record.gender === '男'" type="man" />
            <a-icon v-if="record.gender === '女'" type="woman" />
          </div>
        </a-table>
      </div>
      <a-drawer
        title="条件筛选"
        placement="right"
        width="400"
        :closable="false"
        :visible="visible"
        :after-visible-change="afterVisibleChange"
        @close="onClose"
      >
        <a-form>
          <a-form-item label="选择成员">
            <a-input v-model="searchData.name"/>
          </a-form-item>
          <a-form-item label="成功状态">
            <a-select v-model="searchData.status">
              <a-select-option v-for="item in statusList" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="部门">
            <a-select v-model="searchData.dept">
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="item in deptList" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="外部联系人权限">
            <a-select v-model="searchData.contactAuth">
              <a-select-option v-for="item in contactAuth" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <div class="footer">
          <a-button style="marginRight: 5px" @click="() => {this.visible = false; this.searchData = {};this.getTableData()}">清除筛选条件</a-button>
          <a-button type="primary" @click="() => { this.pagination.current = 1; this.getTableData() }">确定</a-button>
        </div>
      </a-drawer>
    </a-card>
  </div>
</template>

<script>
import { enterMembersList, syncTime, syncEmployee } from '@/api/workEmployee'
export default {
  data () {
    return {
      visible: false,
      columns: [
        {
          title: 'ID',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '企业成员',
          align: 'center',
          dataIndex: 'name',
          width: '150px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '部门',
          align: 'center',
          dataIndex: 'deptName'
        },
        {
          title: '职务',
          align: 'center',
          dataIndex: 'position'
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'mobile'
        },
        {
          title: '邮箱',
          align: 'center',
          dataIndex: 'email'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'statusName'
        },
        {
          title: '外部联系人权限',
          align: 'center',
          dataIndex: 'contactAuthName'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createdAt'
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      },
      syncTime: '',
      searchData: {},
      statusList: [],
      contactAuth: [],
      deptList: [],
      errorImg: 'this.src="' + require('@/assets/avatar.png') + '"'
    }
  },
  created () {
    this.getTableData()
    this.getSyncTime()
  },
  methods: {
    getTableData () {
      const params = {
        status: this.searchData.status,
        name: this.searchData.name,
        contactAuth: this.searchData.contactAuth,
        deptId: this.searchData.dept,
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      enterMembersList(params).then(res => {
        this.tableData = res.data.list
        this.pagination.total = res.data.page.total
      })
    },
    // 同步时间获取-获取搜索条件数据
    getSyncTime () {
      syncTime().then(res => {
        this.syncTime = res.data.syncTime
        this.statusList = res.data.status
        this.contactAuth = res.data.contactAuth
        this.deptList = res.data.department
      })
    },
    // 同步企业微信
    syncEmployeeDefine () {
      syncEmployee().then(res => {
        this.$message.info('后台同步中,请稍等')
        setTimeout(() => {
          this.getTableData()
        }, 5000)
      })
    },
    onClose () {
      this.visible = false
    },
    afterVisibleChange () {

    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
.work-employee {
  .btn-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .ant-btn {
      width: 80px;
    }
    div {
      width: 500px;
      display: flex;
      align-items: center;
      p{
        margin: 0;
        font-size: 16px;
      }
      .ant-btn {
        margin-left: 20px;
        width: 160px;
      }
    }
  }
  .table-wrapper {
    .msg-box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
