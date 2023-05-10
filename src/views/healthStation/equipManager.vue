<template>
  <div ref="equip_container">
    <div class="topSearchDiv">
      <div class="singleSearchDiv">
        <div class="singleLabelDiv">设备名称:</div>
        <a-input class="singleInputDiv" v-model="screenData.mobileDevicesName" placeholder="请输入设备名称" :allowClear="true"></a-input>
      </div>
      <div class="singleSearchDiv">
        <div class="singleLabelDiv">设备SN码:</div>
        <a-input class="singleInputDiv" v-model="screenData.snCode" placeholder="请输入设备SN码" :allowClear="true"></a-input>
      </div>
      <div class="singleSearchDiv">
        <div class="singleLabelDiv">是否关联机构:</div>
        <a-select
          :allowClear="true"
          class="pickSelectClass"
          placeholder="请选择"
          v-model="screenData.isOrg"
        >
          <a-select-option v-for="item in equipRelativeList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="singleSearchDiv">
        <a-button
          type="primary"
          style="margin: 0 10px;"
          @click="goSearchData"
          v-permission="`/healthWorkstationDevices/index@get`"
        >查询</a-button>
        <a-button
          @click="goResetData"
          style="margin: 0 10px;"
          v-permission="`/healthWorkstationDevices/index@get`"
        >重置</a-button>
      </div>
    </div>
    <a-table
      :loading="tableLoading"
      :row-key="record => record.id"
      :data-source="tableDataList"
      :columns="tableColumns"
      :pagination="tablePagination"
      @change="handleTableChange"
      class="tableBox"
      :scroll="{ x: 1500}">
      <div slot="snCode" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="mobileDevicesName" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="isOrg" slot-scope="text">
        {{ returnOrgTableText(text) }}
      </div>
      <div slot="departmentName" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: center;">
            <a-button type="link" @click="goEdit(record)" v-permission="`/healthWorkstationDevices/getDevicesById@get`">编辑</a-button>
          </div>
        </template>
      </div>
    </a-table>
    <a-modal
      title="编辑设备"
      :maskCloseable="false"
      :width="500"
      :visible="editModalShowStatus"
      class="limitModalClass"
      @cancel="closeEditModal()"
      :getContainer="() => $refs['equip_container']"
    >
      <a-spin :spinning="editModalLoading">
        <a-form-model
          ref="editForm"
          :model="editInfo"
          :rules="editRules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-model-item label="设备SN码:" prop="snCode">
            <a-input class="singleInputDiv" v-model="editInfo.snCode" placeholder="请输入设备SN码" :disabled="true"></a-input>
          </a-form-model-item>
          <a-form-model-item label="设备名称:" prop="mobileDevicesName" class="deviceNameClass">
            <a-input
              class="singleInputDiv"
              v-model="editInfo.mobileDevicesName"
              placeholder="请输入设备名称">
            </a-input>
            <span class="len">{{ editInfo.mobileDevicesName && editInfo.mobileDevicesName.length ? editInfo.mobileDevicesName.length :'0' }}/10</span>
          </a-form-model-item>
          <a-form-model-item label="绑定机构:" prop="departmentId">
            <SelectReadonlyPersonOnlyDepart
              class="selectPersonnelCom"
              name="请选择机构"
              :changeId="true"
              :num="1"
              v-model="editInfo.departmentId"
              @getVal="employeeIdsChange"
            />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
      <template slot="footer">
        <a-button
          :disabled="editModalLoading === true"
          @click="closeEditModal()"
        >取消</a-button>
        <a-button
          type="primary"
          :disabled="editModalLoading === true"
          @click="confirmEditMethod"
          v-permission="`/healthWorkstationDevices/update@post`"
        >确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { deepClonev2 } from '@/utils/util'
import { getDict } from '@/api/common'
import { equipListApi, getEquipDetailApi, updateEquipApi } from '@/api/healthTest'
export default {
  name: 'BackendEquipManager',
  data () {
    return {
      // 列表查询对象
      screenData: {},
      // 是否关联机构字典
      equipRelativeList: [],
      // 列表加载动画
      tableLoading: true,
      // 列表数据
      tableDataList: [],
      // 列表翻页对象
      tablePagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      // 列表表头数据
      tableColumns: [
        {
          title: '设备名称',
          dataIndex: 'mobileDevicesName',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'mobileDevicesName' }
        },
        {
          title: '设备SN码',
          dataIndex: 'snCode',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'snCode' }
        },
        {
          title: '是否关联机构',
          dataIndex: 'isOrg',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'isOrg' }
        },
        {
          title: '关联机构名称',
          dataIndex: 'departmentName',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'departmentName' }
        },
        {
          title: '操作',
          dataIndex: 'options',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'options' }
        }
      ],
      // 修改弹框显示状态
      editModalShowStatus: false,
      // 修改弹框动画加载
      editModalLoading: false,
      // 修改弹框展示对象
      editInfo: {},
      // 修改弹框表单验证规则
      editRules: {
        snCode: [
          { required: true, message: '请输入SN码', trigger: 'change' }
        ],
        mobileDevicesName: [
          { required: true, message: '请输入设备名称', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getEquipRelativeMethod()
  },
  watch: {
    'editInfo.mobileDevicesName' (e) {
      if (e && e.length > 10) {
        this.editInfo.mobileDevicesName = e.slice(0, 10)
      }
    }
  },
  methods: {
    // 获取是否关联机构
    async getEquipRelativeMethod () {
      const params = { dictType: 'yes_no' }
      await getDict(params).then(response => {
        this.equipRelativeList = response.data
      })
      this.getData()
    },
    // 获取数据
    getData () {
      const params = {
        page: this.tablePagination.current,
        perPage: this.tablePagination.pageSize,
        ...this.screenData
      }
      this.tableLoading = true
      console.log(params, '查询列表提交对象')
      equipListApi(params).then(response => {
        // this.tableDataList = response.data.list
        this.tableLoading = false
        console.log(response, '获取设备列表')
        this.tableDataList = response.data.list
        this.$set(this.tablePagination, 'total', Number(response.data.page.total))
        if (this.tableDataList.length === 0) {
          // 列表中没有数据
          if (this.tablePagination.total !== 0) {
            // 总数据有,但当前页没有
            // 重新将页码换成1
            this.$set(this.tablePagination, 'current', 1)
            this.getData()
          } else {
            // 是真没有数据
          }
        }
      })
    },
    // 翻页操作
    handleTableChange ({ current, pageSize }, filters, sorter) {
      if (current) {
        this.selectedKeyList = []
      }
      this.tablePagination.current = current
      this.tablePagination.pageSize = pageSize
      this.getData()
    },
    // 查询数据
    goSearchData () {
      this.$set(this.tablePagination, 'current', 1)
      this.getData()
    },
    // 重置数据
    goResetData () {
      this.$set(this.tablePagination, 'current', 1)
      this.screenData = {}
      this.getData()
    },
    // 表格为空时显示"-"验证
    returnTableText (text) {
      const tempText = text || '-'
      return tempText
    },
    returnOrgTableText (text) {
      const tempArray = this.equipRelativeList.filter(item => item.code === text)
      return tempArray[0].name
    },
    // 点击编辑
    goEdit (record) {
      const params = {
        id: record.id
      }
      this.editInfo = {}
      getEquipDetailApi(params).then(response => {
        this.editModalShowStatus = true
        this.editInfo = response.data
        if ((this.editInfo.departmentId === 0) || (this.editInfo.departmentId === null)) {
          this.$set(this.editInfo, 'departmentId', [])
        } else {
          const tempIdArray = []
          tempIdArray.push(String(this.editInfo.departmentId))
          this.$set(this.editInfo, 'departmentId', tempIdArray)
          const tempNameArray = []
          tempNameArray.push(this.editInfo.departmentName)
          this.$set(this.editInfo, 'departmentName', tempNameArray)
        }
      })
    },
    // 组织机构选择回调
    employeeIdsChange (e) {
      console.log(e, '组织机构选择回调')
      // this.$set(this.editInfo, 'departmentId', e.map(item => item.id))
      // this.$set(this.editInfo, 'departmentName', e.map(item => item.title))
      if (e.length !== 0) {
        const tempArray = deepClonev2(e)
        if (typeof tempArray[0] === 'object') {
          this.$set(this.editInfo, 'departmentId', tempArray.map(item => item.id))
          this.$set(this.editInfo, 'departmentName', tempArray.map(item => item.title))
        }
      } else {
        this.$set(this.editInfo, 'departmentId', [])
        this.$set(this.editInfo, 'departmentName', '')
      }
    },
    // 点击关闭编辑弹框
    closeEditModal () {
      this.editModalShowStatus = false
      this.editForm = {}
    },
    // 编辑弹框点击确定
    confirmEditMethod () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editModalLoading = true
          console.log('能提交', this.editInfo)
          const tempInfo = deepClonev2(this.editInfo)
          if (tempInfo.departmentId.length !== 0) {
            tempInfo.departmentId = tempInfo.departmentId.join(',')
          } else {
            this.$delete(tempInfo, 'departmentId')
          }
          if (tempInfo.departmentName.length !== 0) {
            tempInfo.departmentName = tempInfo.departmentName.join(',')
          } else {
            this.$delete(tempInfo, 'departmentName')
          }
          // tempInfo.departmentId = tempInfo.departmentId.length !== 0 ? tempInfo.departmentId.join(',') : ''
          // tempInfo.departmentName = tempInfo.departmentName.length !== 0 ? tempInfo.departmentName.join(',') : ''
          updateEquipApi(tempInfo).then(response => {
            console.log(response, '修改设备')
            if (response.code === 200) {
              this.editModalLoading = false
              this.editModalShowStatus = false
              this.$message.success('修改成功')
              this.$set(this.tablePagination, 'current', 1)
              this.getData()
            } else {
              this.editModalLoading = false
            }
          }).catch(error => {
            console.log(error)
            this.editModalLoading = false
          })
        } else {
          console.log('不能提交')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./css/equipManager.less');
</style>
