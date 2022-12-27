<template>
  <div class="work-employee">
    <div class="alter">
      <span style="color: #023d81">部门数据与企业微信同步，若需要修改员工部门请前往企业微信设置， <a
        style="color: #4BA9FF"
        href="https://work.weixin.qq.com/wework_admin/frame#contacts"
        target="_blank"
      >去设置</a></span>
    </div>
    <div class="add-btn">
      <div class="add-btn-left">
        <a-button
          type="primary"
          ghost
          @click="syncEmployee"
          style="background: #fff!important;"
        >
          同步
        </a-button>
        <label>共{{ pagination.total }}个成员</label>
      </div>
      <div class="add-btn-right">
        <div>
          <label>员工姓名：</label>
          <a-input
            v-model="screenData.name"
            style="width: 111px;"
          />
        </div>
        <div>
          <label style="width: 88px;">手机号码：</label>
          <a-input
            v-model="screenData.mobile"
            style="width: 111px;"
          />
        </div>
        <div>
          <label style="width: 60px;">状态：</label>
          <a-select
            default-value="未启用"
            style="width: 100px"
            v-model="screenData.status"
          >
            <a-select-option
              v-for="item in statusList"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <label style="width: 60px;">角色：</label>
          <a-select
            style="width: 150px"
            v-model="screenData.roleId"
          >
            <a-select-option
              v-for="item in roleList"
              :key="item.roleId"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
        <a-button
          type="primary"
          @click="getTableData(true)"
        >查询</a-button>
        <a-button @click="reset">重置</a-button>
      </div>
    </div>
    <div class="vip-box">
      <!-- <img
        src="@/assets/vip-bg.png"
        class="bg"
      > -->
      <div class="flex-between">
        <div class="left">
          <!-- <div
            class="flex"
            v-if="tenant"
          >
            可用席位：
            <span class="ct">{{ tenant.maxEmployee == 999999 ? '不限' : tenant.maxEmployee }}</span>
            <a-divider type="vertical" />
            已配置席位：
            <span class="ct">{{ tenant.useEmployee }}</span>
            <a-divider type="vertical" />
            未配置席位：
            <span class="ct">{{ tenant.maxEmployee == 999999 ? '不限' : tenant.notUseEmployee }}</span>
            <a-divider type="vertical" />
            到期时间：
            <span class="ct">{{ tenant.expiredAt }}</span>
          </div> -->
        </div>
        <div class="right">
          <!-- <div
            class="btn"
            @click="$refs.pay.$show()"
            v-if="false"
          >购买席位</div> -->
          <a-button
            type="primary"
            @click="()=>{
              if(table.rowSelection.length == 0) return $message.error('至少选择一个角色')
              $refs.role.$show(table.rowSelection.join(','))
            }"
            style="margin-right:20px;"
          >批量设置角色</a-button>
          <a-dropdown
            :trigger="['click']"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
          >
            <a-button
              type="primary"
              @click.prevent
            >导出</a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <div @click="exportsElxe()">导出当前</div>
                </a-menu-item>
                <a-menu-item>
                  <div @click="exportsElxe(1)">导出全部</div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
    <div
      class="flex"
      style="height: 100%;align-items: start"
    >
      <div
        style="padding-right: 20px;min-width: 195px; overflow: auto;"
        class="card-boxs left-box"
      >
        <div
          class="title-dep"
          style="white-space: nowrap"
        >
          部门信息
        </div>
        <Departments @change="departmentChange" />
      </div>
      <div
        class="card-boxs right-box"
        style="flex: 1;"
      >
        <a-card :body-style="{padding:0}">
          <a-table
            :columns="table.columns"
            :data-source="table.data"
            :customRow="customRow"
            rowKey="id"
            :row-selection="{selectedRowKeys:table.rowSelection,onChange: onSelectChange}"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <div
              slot="vipState"
              slot-scope="text,record"
            >
              <a-switch
                size="small"
                @change="vipSwitchChange($event,record)"
                :checked="record.authStatus==1"
              />
              <span
                class="ml6"
                v-if="record.authStatus==1"
              >已开启</span>
              <span
                class="ml6"
                v-else
              >未开启</span>
            </div>
            <div
              slot="userName"
              slot-scope="text,record"
            >
              <div style="display: flex">
                <img
                  style="height: 36px;margin-right: 6px"
                  :src="record.thumbAvatar || defaultAvatar"
                />
                <div style="display: flex;flex-direction: column;justify-content: space-between">
                  <label
                    :title="record.name"
                    style="font-size: 13px; width: 160px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; "
                  >{{ record.name }}</label>
                  <p style="color: #bababa;font-size: 12px;line-height: 20px;margin-bottom: 0">
                    共{{ record.contactCount }}个客户
                  </p>
                </div>
              </div>
            </div>
            <div
              slot="contactAuth"
              slot-scope="text"
            >
              <div
                v-if="text==1"
                style="display: flex;align-items: center;justify-content: start"
              >
                <img
                  style="height: 16px;margin-right: 4px"
                  :src="require('@/assets/Authorized.svg')"
                  alt=""
                />
                <div>已授权</div>
              </div>
              <div
                v-if="text==2"
                style="display: flex;align-items: center;justify-content: start"
              >
                <img
                  style="height: 13px;margin-right: 4px"
                  :src="require('@/assets/Unauthorized.svg')"
                  alt=""
                />
                <div>未授权</div>
              </div>
            </div>
            <!-- <div slot="department" slot-scope="text, record">
              <div v-for="item in record.department" :key="item.departmentId">{{ item.departmentName }}</div>
            </div> -->
            <div
              slot="department"
              slot-scope="text"
            >
              <div>{{ text.departmentName }}</div>
            </div>
            <div
              slot="action"
              slot-scope="text, record"
            >
              <a @click="$refs.role.$show(record.id, record.roleId)">设置角色</a>
              <a-divider type="vertical" />
              <a @click="rowResetBtn(record)">重置密码</a>
            </div>
          </a-table>
        </a-card>
      </div>
    </div>
    <a-modal
      title="修改状态"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <label style="margin-right: 20px">状态:</label>
      <a-radio-group v-model="userData.status">
        <a-radio :value="1">
          启用
        </a-radio>
        <a-radio :value="3">
          未启用
        </a-radio>
      </a-radio-group>
    </a-modal>

    <a-modal
      v-model="resetPopup"
      title="重置密码"
      :footer="null"
      :maskClosable="false"
      width="450px"
      @cancel="cancelBtn"
    >
      <div style="display: flex;justify-content:center;">
        <div style="line-height: 31px;width: 75px;text-align: right;">新密码：</div>
        <a-input
          placeholder="请输入新密码"
          type="password"
          v-model="resetPassData.newPassword"
          style="width: 240px;"
        />
      </div>
      <div style="display: flex;justify-content:center;margin-top: 15px;">
        <div style="line-height: 31px;width: 75px;text-align: right;">确认密码：</div>
        <a-input
          placeholder="请再次确认密码"
          type="password"
          v-model="resetPassData.confirmPassword"
          style="width: 240px;"
        />
      </div>
      <div style="display: flex;justify-content:center;margin-top: 15px;">
        <a-button
          style="margin-right: 40px;"
          @click="cancelBtn"
        >取消</a-button>
        <a-button
          type="primary"
          @click="confirmReset"
        >确认修改</a-button>
      </div>
    </a-modal>

    <pay ref="pay" />
    <close
      ref="close"
      @change="getTableData"
    />
    <role
      ref="role"
      @change="getTableData"
    />
  </div>
</template>

<script>
import { departmentIndex, editSubManagement, passwordResetApi, roleSelectList } from '@/api/user'
import { enterMembersList, statusUpdate, syncEmployee, exportExcel } from '@/api/workEmployee'
import Departments from '@/components/Departments/Departments'
import pay from '@/views/workEmployee/components/pay'
import close from '@/views/workEmployee/components/close'
import role from '@/views/workEmployee/components/role'
import defaultAvatar from '@/assets/systemHomePage/enterpriseMembers-icon.png'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

export default {
  components: { Departments, pay, close, role },
  data () {
    return {
      defaultAvatar,
      loading: false,
      // 重置密码弹窗
      resetPopup: false,
      resetPassData: {
        newPassword: '',
        confirmPassword: ''
      },
      userName: '',
      // 修改id
      resetRowId: '',
      // 启用数量
      usingNum: '',
      tenant: {
        maxEmployee: 999999,
        useEmployee: 0,
        notUseEmployee: 0,
        expiredAt: ''
      },
      departmentId: '',
      departmentData: [],
      forbiddenNum: '',
      screenData: {},
      visible: false,
      table: {
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 80,
            customRender: (text, record, index) => `${index + 1}`
          },
          {
            title: '员工姓名',
            dataIndex: 'name',
            align: 'left',
            scopedSlots: {
              customRender: 'userName'
            },
            width: 240
          },
          // {
          //   title: '企微接口许可',
          //   dataIndex: 'license',
          //   fixed: 'left',
          //   scopedSlots: {
          //     customRender: 'license'
          //   },
          //   width: 240
          // },
          {
            title: '所属部门',
            dataIndex: 'department',
            width: 110,
            scopedSlots: { customRender: 'department' }
          },
          // {
          //   title: '企微账号',
          //   dataIndex: 'Enterprise',
          //   width: 110
          // },
          {
            title: '角色',
            dataIndex: 'roleName',
            width: 110
          },
          {
            title: '员工账号',
            dataIndex: 'authStatus',
            scopedSlots: { customRender: 'vipState' },
            width: 110
          },
          {
            title: '手机号',
            dataIndex: 'mobile',
            width: 115
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 115
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {
              customRender: 'action'
            },
            width: 240,
            fixed: 'right'
          }
        ],
        data: [],
        rowSelection: []
      },
      userId: '',
      userData: {
        status: ''
      },
      statusList: [
        {
          label: '开启',
          value: 1
        },
        {
          label: '关闭',
          value: 3
        }
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true
      },
      roleList: []
    }
  },
  computed: {},
  created () {
    this.getTableData()
    this.getDepartmentData()
    this.getRoleList()
  },
  methods: {
    exportsElxe (e) {
      if (e == 1 || this.table.rowSelection.length == 0) {
        const params = {
          name: this.screenData.name,
          mobile: this.screenData.mobile,
          status: this.screenData.status,
          roleId: this.screenData.roleId,
          page: this.pagination.current || 1,
          perPage: this.pagination.pageSize,
          departmentId: this.screenData.departmentId,
          expstatus: e == 1 ? 'exp_all' : 'exp_cur'
        }

        exportExcel(params).then((res) => {
          callDownLoadByBlob(res, '员工信息')
        })
      } else {
        const data = {
          userids: this.table.rowSelection.join(','),
          expstatus: 'exp_cur'
        }
        exportExcel(data).then((res) => {
          callDownLoadByBlob(res, '员工信息')
        })
      }
    },
    syncEmployee () {
      syncEmployee().then((res) => {
        this.$message.success('同步成功')
        setTimeout(() => {
          this.getTableData()
        }, 3000)
      })
    },
    vipSwitchChange (e, data) {
      if (!e) {
        this.$refs.close.$show(data.id)
      } else {
        if (data.mobile === '' || data.mobile === '40412345678') {
          this.$message.warning('当前员工未填写手机号，无法开通席位！请在企业微信通迅录中补充员工手机号。')
          return false
        }

        statusUpdate({
          id: data.id,
          status: 1
        }).then((res) => {
          this.$message.success('开启成功')
          this.getTableData()
        })
      }
    },

    getRoleList () {
      roleSelectList().then((res) => {
        this.roleList = res.data
      })
    },

    // 获取部门列表
    getDepartmentData () {
      departmentIndex({}).then((res) => {
        console.log(res)
        this.departmentData = res.data
      })
    },
    departmentChange (e) {
      this.screenData.departmentId = e.id
      enterMembersList(this.screenData).then((res) => {
        this.loadTable = false
        this.table.data = res.data.list
        // this.tenant = res.data.tenant
        this.pagination.total = res.data.page.total
      })
    },
    handleTableChange ({ current }) {
      this.pagination.pageSize = arguments[0].pageSize
      this.pagination.current = current
      this.getTableData()
    },
    //  获取列表数据
    getTableData (e) {
      this.loading = true
      this.loadTable = true

      const params = {
        name: this.screenData.name,
        mobile: this.screenData.mobile,
        status: this.screenData.status,
        roleId: this.screenData.roleId,
        page: e ? 1 : this.pagination.current,
        perPage: this.pagination.pageSize,
        departmentId: this.screenData.departmentId
      }

      enterMembersList(params).then((res) => {
        console.log(res)
        this.loadTable = false
        this.loading = false
        this.table.data = res.data.list
        // this.tenant = res.data.tenant
        this.pagination.total = res.data.page.total
      })
    },

    reset () {
      this.screenData = {}
      this.getTableData()
    },

    // 选择
    onSelectChange (e) {
      this.tableSelectID = []
      this.table.rowSelection = e
    },
    // 取消按钮
    cancelBtn () {
      this.resetPopup = false
      this.resetPassData.newPassword = ''
      this.resetPassData.confirmPassword = ''
    },
    // 显示弹窗
    rowResetBtn (record) {
      this.resetRowId = record.userId
      this.resetPopup = true
    },
    // 确认修改
    confirmReset () {
      if (this.resetPassData.newPassword == '') {
        this.$message.warning('新密码不能为空')
        return false
      }
      if (this.resetPassData.confirmPassword == '') {
        this.$message.warning('请再次确认密码')
        return false
      }
      if (this.resetPassData.newPassword != this.resetPassData.confirmPassword) {
        this.$message.warning('两次密码不一致，请确认密码')
        this.resetPassData.newPassword = ''
        this.resetPassData.confirmPassword = ''
        return false
      }
      passwordResetApi({
        id: this.resetRowId,
        newPassword: this.resetPassData.newPassword
      }).then((res) => {
        this.$message.success('修改成功')
        this.resetPassData = {}
        this.resetPopup = false
      })
    },

    customRow (record, index) {
      return {
        style: {
          // 字体颜色
          color: record.remarkDesc ? record.remarkDesc.fontColor : '#262626',
          // 行背景色
          'background-color': index % 2 == 0 ? '#FFFFFF' : '#FCFCFC'
        }
      }
    },
    showModal (record) {
      this.userId = record.userId
      this.userData.status = record.authStatus
      this.visible = true
    },
    handleOk () {
      editSubManagement({
        userId: this.userId,
        status: this.userData.status
      }).then(() => {
        this.visible = false
        this.getTableData()
      })
    },
    handleCancel (e) {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.vip-box {
  margin-bottom: 8px;
  position: relative;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 #0000000d;
  border-radius: 2px;
  height: 52px;
  padding: 0 25px 0 18px;
  display: flex;
  align-items: center;

  .ct {
    color: #000000d9;
  }

  // .bg {
  //   position: absolute;
  //   right: 0;
  //   top: 0;
  //   z-index: 1;
  //   width: 107px;
  //   height: 56px;
  // }

  .flex-between {
    width: 100%;
    z-index: 2;
    .right {
      display: flex;
      align-items: center;
    }
  }

  .btn {
    width: 82px;
    height: 30px;
    background: linear-gradient(315deg, #cf9b68, #f5cfb6);
    box-shadow: 4px 5px 9px 0 #e9c3a6;
    line-height: 30px;
    padding: 0;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    color: #8e4f1c;
    border-radius: 2px;
  }

  .ant-divider {
    position: relative;
    top: 1px;
  }
}

.title-dep {
  font-size: 15px;
  font-weight: 500;
  color: #000000d9;
  padding: 18px 16px 0;
}

.card-boxs {
  box-shadow: 0 1px 3px 0 #0000000d;
}

.alter {
  height: 46px;
  background: #e6f0ff;
  border: 1px solid #7db3f2;
  padding: 0 15px;
  margin: 10px 0 14px;
  color: #023d81;

  a {
    color: #1890ff !important;
  }

  span {
    line-height: 46px;
    margin-left: 10px;
  }
}

.work-employee {
  // overflow: hidden;

  .add-btn {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;

    .add-btn-right {
      label {
        width: 120px;
        text-align: right;
      }

      div {
        display: flex;
        align-items: center;
      }

      display: flex;
    }

    button {
      width: 80px;
      height: 32px;
      margin-right: 10px;
      font-size: 14px;
    }
  }
}

.left-box {
  background-color: #fff;
  /*height: calc(100vh - 340px);*/
  height: 780px;
  margin-right: 16px;
}

.right-box {
  /*height: calc(100vh - 340px);*/
  min-height: 780px;
}

.ant-card {
  /*height: calc(100vh - 340px);*/
  height: 780px;
}

/deep/ .ant-select-selection {
  width: 100px;
}

/deep/ .ant-table-tbody > tr > td {
  border-bottom: 1px solid #f6f6f6;
}

/deep/ .ant-table-pagination.ant-pagination {
  padding-right: 20px;
}

/deep/ .ant-table-thead > tr > th {
  border-bottom: 1px solid #f6f6f6;
}

/deep/ .main-box {
  background-color: #f0f2f5;
}
</style>
