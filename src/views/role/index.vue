<template>
  <div>
    <a-card title="角色管理">
      <a-row>
        <div class="top-btn">
          <a-button
            v-permission="'/role/index@add'"
            class="batch"
            type="primary"
            @click="add"
          >新增角色</a-button>
        </div>
      </a-row>
      <a-row>
        <a-col :span="6">
          <div style="display:flex;align-items: center;">
            <label style="width: 88px;">角色名称：</label>
            <a-input
              v-model="search.roleName"
              placeholder="请输入角色名称"
              style="width: 180px;"
            />
          </div>
          <!-- <a-input
            v-model="search.roleName"
            placeholder="请输入角色名称"
          ></a-input> -->
        </a-col>
        <a-col
          :span="3"
          :offset="1"
        >
          <div style="display:flex;align-items: center;">
            <label style="width: 80px;">角色状态：</label>
            <a-select
              default-value="未启用"
              style="width: 100px"
              v-model="search.status"
            >
              <a-select-option
                v-for="item in statusList"
                :key="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
          <!-- <a-button
            v-permission="'/role/index@search'"
            type="primary"
            style="marginRight:10px"
            @click="searchData"
          >查询</a-button>
          <a-button @click="reset">重置</a-button> -->
        </a-col>
        <a-col
          :span="12"
          :offset="1"
        >
          <div style="display:flex;align-items: center;">
            <label style="width: 80px;">更新日期：</label>
            <a-range-picker
              format="YYYY/MM/DD"
              :showToday="false"
              v-model="search.creationDate"
              :placeholder="['请选择开始日期','请选择结束日期']"
              style="width: 460px; height:100%;"
            />
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col style="display:flex; justify-content: flex-end;margin: 40px 0 28px 0">
          <a-button
            v-permission="'/role/index@search'"
            type="primary"
            style="marginRight:10px"
            @click="searchData"
          >查询</a-button>
          <a-button @click="reset">重置</a-button>
        </a-col>
      </a-row>
      <div class="table-wrapper">
        <a-table
          bordered
          rowKey="roleId"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <div
            slot="employeeNum"
            slot-scope="text, record"
          >
            <template>
              <a-button
                v-permission="'/role/index@checkMember'"
                type="link"
                @click="showMemberData(record.roleId)"
              >{{ text }}</a-button>
            </template>
          </div>
          <div
            slot="status"
            slot-scope="text, record"
          >
            <template>
              <a-switch
                :checked="judgeChecked(text)"
                @click="checkChange($event, record)"
                checked-children="开"
                un-checked-children="关"
                v-permission="'/role/index@use'"
              />
              <!-- <a-checkbox
                v-permission="'/role/index@use'"
                :checked="judgeChecked(text)"
                @change="checkChange($event, record)"
              ></a-checkbox> -->
            </template>
          </div>
          <div
            slot="isDefault"
            slot-scope="text, record"
          >
            <template>
              <a-checkbox
                v-permission="'/role/index@use'"
                :checked="judgeChecked(text)"
                @change="isDefaultChange($event, record)"
              ></a-checkbox>
            </template>
          </div>
          <div
            slot="action"
            slot-scope="text, record"
          >
            <template>
              <div class="action">
                <!-- <a-button
                  v-permission="'/role/permissionShow'"
                  type="link"
                  @click="detail(record.roleId)"
                >设置权限</a-button> -->
                <a-button
                  v-permission="'/role/index@copy'"
                  type="link"
                  @click="copyRole(record)"
                >复制权限</a-button>
                <a-button
                  v-permission="'/role/index@edit'"
                  type="link"
                  @click="edit(record.roleId)"
                >编辑</a-button>
                <a-button
                  v-permission="'/role/index@delete'"
                  type="link"
                  :style="{
                    color:record.employeeNum == 0 ? '':'#ccc',
                    pointerEvents:record.employeeNum == 0 ? '':'none'
                  }"
                  @click="deleteRole(record.roleId)"
                >删除</a-button>
                <a-button
                  v-permission="'/role/index@use'"
                  type="link"
                  :style="{
                    color:record.isDefault == 0 ? '':'#ccc',
                    pointerEvents:record.isDefault == 0 ? '':'none'
                  }"
                  @click="isDefaultChange($event, record)"
                >{{ record.isDefault == '0' ? '设置默认角色':'默认角色' }}</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </div>
    </a-card>
    <a-modal
      :title="moduleTitle"
      :maskClosable="false"
      :width="1260"
      :visible="roleInfoShow"
      :confirm-loading="confirmLoading"
      @ok="roleSubmit"
      @cancel="resetRole"
    >
      <div class="roleName">
        <div class="title">
          <span class="star">*</span>
          <span class="txt">角色名称：</span>
        </div>
        <a-input
          v-model="roleName"
          style="width:380px;"
          class="input"
          :maxLength="10"
          placeholder="请输入角色名称"
        ></a-input>
        <span class="length">{{ roleName.length + '/' + 10 }}</span>
      </div>
      <div class="background_permissions">
        <div class="title">
          <span class="star">*</span>
          <span class="txt">后台权限：</span>
        </div>
        <div class="box">
          <div class="left">
            <a-tree
              v-if="treeData[0].children"
              :treeData="treeData"
              v-model="expandedKeys"
              checkable
              :replaceFields="{title:'name',key:'id',children:'children'}"
              @select="getSelect"
              @check="getCheck"
              ref="tree"
            >
            </a-tree>
          </div>
          <div class="right">
            <div
              class="select"
              v-if="rightData.id && rightData.level == 2"
            >
              <div class="header">
                {{ rightData.name }}
              </div>
              <a-select
                style="width: 100px"
                size="small"
                v-model="dataPermission"
              >
                <a-select-option
                  v-for="item in selectData.scope"
                  :value="item.code"
                  :key="item.code"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div
              class="checkBox"
              v-for="(item,index) in rightData.children"
              :key="index"
            >
              <div class="check_header">
                <a-checkbox
                  :checked="item.children.length > 0 ? setHeader(item.children):expandedKeys.includes(item.id)"
                  :indeterminate="expandedKeys.includes(item.id) ? false:setState(item.children)"
                  @change="setExpendedKEys(item.id,item.children,index)"
                >{{ item.name }}</a-checkbox>
              </div>
              <div
                class="check_content"
                v-if="item.children != 0"
              >
                <div
                  class="check"
                  v-for="(items,indexs) in item.children"
                  :key="indexs"
                >
                  <a-checkbox
                    :checked="expandedKeys.includes(items.id)"
                    @change="setExpendedKEys(items.id,items.children,index)"
                  >{{ items.name }}</a-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sider_permissions">
        <div class="title">
          <span class="star">*</span>
          <span class="txt">侧边栏权限：</span>
        </div>
        <div class="box">
          <div class="check_box">
            <a-checkbox
              :checked="siderKey.length == siderData.length && siderData.length > 0"
              :indeterminate="siderKey.length > 0 && siderKey.length != siderData.length"
              @change="setSiderKey(0)"
            >全部</a-checkbox>
          </div>
          <div
            class="check_box"
            v-for="(item,index) in siderData"
            :key="index"
          >
            <a-checkbox
              :checked="siderKey.includes(item.id)"
              @change="setSiderKey(item.id)"
            >{{ item.name }}</a-checkbox>
          </div>
        </div>
      </div>
      <!-- <a-form-model-item label="角色描述">
          <a-textarea v-model="remarks" class="input" placeholder="请输入角色描述" :rows="4" />
        </a-form-model-item>
        <a-form-model-item label="部门数据全览">
          <a-radio-group v-model="dataPermission">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="2">
              否
            </a-radio>
          </a-radio-group>
        </a-form-model-item> -->
    </a-modal>

    <a-modal
      title="角色人员"
      :maskClosable="false"
      :width="600"
      :visible="memberShow"
      :footer="null"
      @cancel="memberShow = false"
    >
      <a-table
        bordered
        rowKey="employeeId"
        :columns="memberColumns"
        :data-source="memberData"
        :pagination="memberPagination"
        @change="handleMemberChange"
      >
      </a-table>
    </a-modal>
  </div>

</template>

<script>
import {
  roleList,
  roleShowEmployee,
  rolePermissionStore,
  statusUpdate,
  roleDelete,
  isDefaultUpdate,
  rolePermission
} from '@/api/role'
import { getDict } from '@/api/common.js'

import moment from 'moment'

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 80,
    customRender: (text, record, index) => `${index + 1}`
  },
  {
    title: '角色名称',
    dataIndex: 'name'
  },
  {
    title: '员工数量',
    dataIndex: 'employeeNum',
    scopedSlots: { customRender: 'employeeNum' }
  },
  // {
  //   title: '角色描述',
  //   dataIndex: 'remarks',
  //   ellipsis: true
  // },
  {
    title: '更新时间',
    dataIndex: 'updatedAt'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  // {
  //   title: '默认',
  //   dataIndex: 'isDefault',
  //   width: 100,
  //   scopedSlots: { customRender: 'isDefault' }
  // },
  {
    title: '操作',
    dataIndex: 'action',
    width: '320px',
    scopedSlots: { customRender: 'action' }
  }
]
const memberColumns = [
  {
    title: '姓名',
    dataIndex: 'employeeName'
  },
  {
    title: '手机号码',
    dataIndex: 'phone'
  },
  {
    title: '邮箱地址',
    dataIndex: 'email'
  },
  {
    title: '部门',
    dataIndex: 'department'
  }
]
export default {
  data () {
    const createValidate = (callback, value, message) => {
      if (!value) {
        return callback(new Error(message))
      } else {
        callback()
      }
    }
    const createFunc = (func, change) => {
      return {
        validator: func,
        trigger: change || 'blur'
      }
    }
    const vname = (rule, value, callback) => {
      value = this.name
      createValidate(callback, value, '请输入角色名称')
    }
    return {
      moduleTitle: '新增角色',
      columns,
      memberColumns,
      statusList: [
        {
          label: '开启',
          value: 1
        },
        {
          label: '关闭',
          value: 2
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true
      },
      search: {
        roleName: '',
        status: '',
        creationDate: []
      },
      roleInfoShow: false,
      formData: {},
      name: '',
      remarks: '',
      dataPermission: '1',
      rules: {
        name: createFunc(vname, 'change')
      },
      roleInfoType: 'add',
      copyRoleId: '',
      editRoleId: '',
      memberShow: false,
      memberData: [],
      memberId: '',
      memberPagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      confirmLoading: false,
      roleName: '',
      treeData: [
        {
          name: '全部',
          id: '0',
          isLeaf: false,
          selectable: false
        }
      ], // 树状图选择序号
      expandedKeys: [],
      selectData: {
        scope: []
      },
      rightData: {},
      siderData: [],
      siderKey: [],
      propsKey: [],
      siderPropsKey: 608
    }
  },
  watch: {
    roleInfoShow (value) {
      if (!value) {
        this.name = ''
        this.remarks = ''
        this.dataPermission = '1'
      }
    }
  },
  created () {
    this.getTableData()
    this.getSelectData('data_permission_scope', 'scope')
  },
  methods: {
    getCheck (e, i) {
      console.log(e, i)
      console.log(i.halfCheckedKeys)
    },
    resetRole () {
      this.roleInfoShow = false
      this.siderData = []
      this.siderKey = []
      this.treeData = [
        {
          name: '全部',
          id: '0',
          isLeaf: false,
          selectable: false
        }
      ]
      this.rightData = {}
      this.expandedKeys = []
      this.roleName = ''
    },
    setSiderKey (e) {
      if (e == 0) {
        if (this.siderKey.length != this.siderData.length) {
          this.siderKey = this.siderData.map((item) => {
            return item.id
          })
        } else {
          this.siderKey = []
        }
      } else {
        if (this.siderKey.includes(e)) {
          this.siderKey = this.siderKey.filter((item) => {
            return item != e
          })
        } else {
          this.siderKey = [...this.siderKey, e]
        }
      }
    },
    setHeader (e) {
      const data = e.map((item) => {
        return item.id
      })

      const newData = data.filter((e) => {
        return this.expandedKeys.includes(e)
      })
      return newData.length == data.length
    },
    setState (e) {
      const data = e.map((item) => {
        return item.id
      })

      const newData = data.filter((e) => {
        return this.expandedKeys.includes(e)
      })
      return newData.length > 0 && newData.length != data.length
    },
    setExpendedKEys (e, arr = [], i) {
      if (arr.length == 0) {
        if (this.expandedKeys.includes(e)) {
          this.expandedKeys = this.expandedKeys.filter((item) => {
            return item != e
          })
          const data = this.rightData.children[i].children.map((item) => {
            return item.id
          })
          const newData = data.filter((e) => {
            return this.expandedKeys.includes(e)
          })
          if (data.length != newData.length && this.expandedKeys.includes(this.rightData.children[i].id)) {
            this.expandedKeys = this.expandedKeys.filter((item) => {
              return item != this.rightData.children[i].id
            })
          }
        } else {
          this.expandedKeys = [...new Set([...this.expandedKeys, e])]
          const data = this.rightData.children[i].children.map((item) => {
            return item.id
          })
          const newData = data.filter((e) => {
            return this.expandedKeys.includes(e)
          })
          if (data.length == newData.length) {
            this.expandedKeys = [...new Set([...this.expandedKeys, this.rightData.children[i].id])]
          }
        }
      } else {
        const newKey = []
        const fiveKey = []
        arr = arr.map((item) => {
          if (this.expandedKeys.includes(item.id)) {
            newKey.push(item.id)
          }
          const obj = {}
          obj.id = item.id
          obj.children = []
          if (item.level == 4 && item.children.length > 0) {
            item.children.map((items) => {
              obj.children.push(items.id)
            })
          }
          fiveKey.push(obj)
          return item.id
        })
        console.log(fiveKey)
        if (newKey.length == arr.length) {
          // arr.map((item) => {
          //   this.expandedKeys = this.expandedKeys.filter((items) => {
          //     return items != item
          //   })
          // })
          fiveKey.map(item => {
            this.expandedKeys = this.expandedKeys.filter((items) => {
              return items != item.id
            })
            item.children.map(items => {
              this.expandedKeys = this.expandedKeys.filter(iteme => {
                return iteme != items
              })
            })
          })
          this.expandedKeys = this.expandedKeys.filter((item) => {
            return item != e
          })
        } else {
          const newKey = []
          fiveKey.map(item => {
            newKey.push(item.id)
            item.children.map(items => {
              newKey.push(items)
            })
          })
          this.expandedKeys = [...new Set([...this.expandedKeys, e, ...newKey])]
        }
      }
      this.expandedKeys = this.expandedKeys.filter((item) => {
        return !this.propsKey.includes(item)
      })
      console.log(this.propsKey)
      console.log(this.expandedKeys)
      // console.log(new Set(this.expandedKeys))
    },
    getSelectData (e, key) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        console.log(res)
        this.selectData[key] = res.data
      })
    },
    getSelect (e, i) {
      console.log(e, i)
      if (i.selected) {
        const data = i.node._props.dataRef
        this.rightData = data
        console.log(data)
      } else {
        this.rightData = {}
      }
    },
    getTreeData (e = '0', i = 0) {
      const data = {
        roleId: e
      }
      if (i != 0) {
        data.isDetail = 1
      }
      rolePermission(data).then((res) => {
        console.log(res)
        if (i != 0) {
          this.roleName = res.data.roleName
          this.dataPermission = res.data.dataPermission ? res.data.dataPermission.toString() : '1'
          let newData = this.treeData
          newData = newData.map((item) => {
            item.children = res.data.roleMenu.slice(0, 2).map((items) => {
              items.selectable = !(items.level == 1)
              this.propsKey = [...this.propsKey, items.id]
              if (items.checked == 2) {
                this.expandedKeys = [...this.expandedKeys, items.id]
              }
              items.children = items.children.map((itemx) => {
                if (itemx.checked == 2) {
                  this.expandedKeys = [...this.expandedKeys, itemx.id]
                }
                this.propsKey = [...this.propsKey, itemx.id]
                itemx.children = itemx.children.map((iteme) => {
                  if (iteme.checked == 2) {
                    this.expandedKeys = [...this.expandedKeys, iteme.id]
                  }
                  if (iteme.children.length > 0) {
                    this.propsKey = [...this.propsKey, iteme.id]
                  }
                  iteme.isLeaf = iteme.level == 3
                  iteme.selectable = iteme.children.length > 0
                  iteme.children.map((itemz) => {
                    itemz.selectable = itemz.children.length > 0
                    if (itemz.checked == 2) {
                      this.expandedKeys = [...this.expandedKeys, itemz.id]
                    }
                    itemz.children = itemz.children.map((itemc) => {
                      itemc.selectable = itemc.children.length > 0
                      if (itemc.checked == 2) {
                        this.expandedKeys = [...this.expandedKeys, itemc.id]
                      }
                      return itemc
                    })
                    return itemz
                  })
                  return iteme
                })
                return itemx
              })
              return items
            })
            return item
          })
          console.log(this.expandedKeys)
          console.log(new Set(this.expandedKeys))
          console.log(newData)
          this.treeData = newData
          const data = []
          res.data.roleMenu.slice(2, 3).map((item) => {
            item.children.map((items) => {
              if (items.checked == 2) {
                this.siderKey = [...this.siderKey, items.id]
              }
              data.push(items)
            })
          })
          console.log(data)
          this.siderData = data
        } else {
          let newData = this.treeData
          newData = newData.map((item) => {
            item.children = res.data.slice(0, 2).map((items) => {
              items.selectable = !(items.level == 1)
              this.propsKey = [...this.propsKey, items.id]
              items.children = items.children.map((itemx) => {
                this.propsKey = [...this.propsKey, itemx.id]

                itemx.children = itemx.children.map((iteme) => {
                  if (iteme.children.length > 0) {
                    this.propsKey = [...this.propsKey, iteme.id]
                  }
                  iteme.isLeaf = iteme.level == 3
                  return iteme
                })
                return itemx
              })
              return items
            })
            return item
          })
          console.log(this.expandedKeys)
          console.log(newData)
          this.treeData = newData
          const data = []
          res.data.slice(2, 3).map((item) => {
            this.siderPropsKey = item.id
            item.children.map((items) => {
              if (items.checked == 2) {
                this.siderKey = [...this.siderKey, items.id]
              }
              data.push(items)
            })
          })
          console.log(data)
          this.siderData = data
        }
      })
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    handleMemberChange ({ current, pageSize }) {
      this.memberPagination.current = current
      this.memberPagination.pageSize = pageSize
      this.getMemberData()
    },
    searchData () {
      this.pagination.current = 1
      this.getTableData()
    },
    async getTableData () {
      const { roleName, status, creationDate } = this.search
      const params = {
        name: roleName,
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      if (status) {
        params.status = status
      }
      if (creationDate.length > 0) {
        params.start = moment(creationDate[0]).format('YYYY-MM-DD')
        params.cease = moment(creationDate[1]).format('YYYY-MM-DD')
      }
      console.log(params)
      try {
        const data = await roleList(params)
        this.pagination.total = Number(data.data.page.total)
        this.tableData = data.data.list
      } catch (e) {
        console.log(e)
      }
    },
    async statusChange (param) {
      console.log(param)
      if (param.status == 2) {
        this.$confirm({
          title: '关闭角色',
          content: '确认要关闭该角色吗？',
          onOk: async () => {
            try {
              await statusUpdate(param).then((res) => {
                console.log(res)
                this.$message.success('角色已禁用')
              })
              this.getTableData()
            } catch (e) {
              console.log(e)
            }
          },
          onCancel () {}
        })
      } else {
        try {
          await statusUpdate(param).then((res) => {
            console.log(res)
            this.$message.success('角色已启用')
          })
          this.getTableData()
        } catch (e) {
          console.log(e)
        }
      }
    },
    async isDefaultUpdate (param) {
      try {
        const data = await isDefaultUpdate(param)
        await this.getTableData()
        this.$message.success(data.data)
        return data.data
      } catch (e) {
        console.log(e)
      }
    },
    isDefaultChange (e, record) {
      const { roleId, isDefault } = record
      if (isDefault == '1') {
        this.isDefaultUpdate({ roleId, isDefault: 0 })
      } else {
        this.isDefaultUpdate({ roleId, isDefault: 1 })
      }
    },
    checkChange (e, record) {
      const { roleId, status, employeeNum } = record
      if (status == 1) {
        if (employeeNum > 0) {
          this.$message.warn('此角色不可以禁用')
        } else {
          this.statusChange({ roleId, status: 2 })
          // this.$message.success('角色已禁用')
        }
      } else {
        this.statusChange({ roleId, status: 1 })
        // this.$message.success('角色已启用')
      }
    },
    judgeChecked (text) {
      return text == 1
    },
    detail (roleId) {
      this.$router.push({ path: '/role/permissionShow', query: { roleId } })
    },
    showMemberData (roleId) {
      this.memberShow = true
      this.memberId = roleId
      this.memberPagination.current = 1
      this.getMemberData()
    },
    async getMemberData () {
      const params = {
        roleId: this.memberId,
        page: this.memberPagination.current,
        perPage: this.memberPagination.pageSize
      }
      try {
        const data = await roleShowEmployee(params)
        // { page: { total }, list }
        this.memberPagination.total = Number(data.data.page.total)
        this.memberData = data.data.list
      } catch (e) {
        console.log(e)
      }
    },
    reset () {
      this.search = { roleName: '', creationDate: [] }
      this.getTableData()
    },
    add (e) {
      this.roleInfoType = 'add'
      this.moduleTitle = '新增角色'
      this.roleInfoShow = true
      this.getTreeData()
    },
    async edit (roleId) {
      this.roleInfoType = 'edit'
      this.roleInfoShow = true
      this.moduleTitle = '编辑角色'
      this.editRoleId = roleId
      this.getTreeData(roleId, 1)
    },
    copyRole (record) {
      this.roleInfoShow = true
      this.roleInfoType = 'copy'
      this.moduleTitle = '复制权限'
      this.getTreeData(record.roleId, 1)
    },
    deleteRole (roleId) {
      this.$confirm({
        title: '删除角色',
        content: '确认要删除当前角色吗？',
        onOk: async () => {
          try {
            await roleDelete({ roleId })
            this.getTableData()
          } catch (e) {
            console.log(e)
          }
        },
        onCancel () {}
      })
    },
    async roleSubmit () {
      const newSiderKey = this.siderKey.length > 0 ? [...this.siderKey, this.siderPropsKey] : this.siderKey

      try {
        let message = ''

        const params = {
          roleName: this.roleName,
          dataPermission: this.dataPermission,
          menuIds: [
            ...new Set([
              ...newSiderKey,
              ...this.$refs.tree.$children[0]._data._checkedKeys,
              ...this.$refs.tree.$children[0]._data._halfCheckedKeys
            ])
          ].filter((item) => {
            return item != '0'
          })
        }
        if (params.menuIds.length == 0) return this.$message.error('请至少选择一个功能权限')
        console.log(params)
        this.confirmLoading = true
        if (this.roleInfoType == 'add') {
          await rolePermissionStore(params)
          message = '添加成功'
        } else if (this.roleInfoType == 'copy') {
          await rolePermissionStore(params)
          message = '复制成功'
        } else {
          params.roleId = this.editRoleId
          await rolePermissionStore(params)
          message = '修改成功'
        }
        this.$message.success(message)
        this.roleInfoShow = false
        this.confirmLoading = false
        this.resetRole()
        this.getTableData()
      } catch (e) {
        this.confirmLoading = false
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.top-btn {
  display: flex;
  margin-bottom: 30px;
}
.roleName {
  display: flex;
  align-items: center;
  position: relative;

  .length {
    color: #ccc;
    position: absolute;
    top: 50%;
    left: 440px;
    transform: translateY(-50%);
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100px;
    height: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    .txt {
      margin: 0 0 0 5px;
    }
  }
}
.star {
  font-size: 20px;
  color: red;
  padding-top: 8px;
}
.form-item {
  position: relative;
}
.input {
  max-width: 400px;
}
.action {
  display: flex;
}

.background_permissions {
  margin-top: 30px;
  width: 100%;
  display: flex;

  .title {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 110px;
    height: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    .txt {
      margin: 0 0 0 5px;
    }
  }

  .box {
    width: 100%;
    display: flex;
    .left {
      flex-shrink: 0;
      min-width: 187px;
      height: 519px;
      overflow: auto;
      background: inherit;
      background-color: rgba(255, 255, 255, 1);
      box-sizing: border-box;
      border-width: 1px;
      border-style: solid;
      border-color: #ccc;
      border-radius: 6px;
    }
    .right {
      flex-grow: 1;
      height: 519px;
      overflow: auto;
      border: 1px solid #ccc;
      margin-left: 15px;
      padding: 25px 20px;
      box-sizing: border-box;
      .select {
        display: flex;
        align-items: center;
        .header {
          margin-right: 20px;
          font-size: 16px;
        }
      }
      .checkBox {
        margin-top: 20px;
        .check_header {
          width: 100%;
        }
        .check_content {
          margin-top: 10px;
          width: 100%;
          min-height: 40px;
          padding: 20px 10px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          background-color: rgb(241, 241, 241);
          border-radius: 8px;
          .check {
            margin-bottom: 20px;
            width: 25%;
          }
        }
      }
    }
  }
}

.sider_permissions {
  margin-top: 20px;
  display: flex;
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 110px;
    height: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    .txt {
      margin: 0 0 0 5px;
    }
  }
  .box {
    width: 100%;
    min-height: 89px;
    border: 1px solid #ccc;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 20px 30px;
    flex-wrap: wrap;
  }
}
</style>
