<template>
  <div ref="equip_container">
    <div class="topSearchDiv">
      <div class="singleSearchDiv">
        <div class="singleLabelDiv">设备名称:</div>
        <a-input class="singleInputDiv" v-model="screenData.name" placeholder="请输入设备名称" :allowClear="true"></a-input>
      </div>
      <div class="singleSearchDiv">
        <div class="singleLabelDiv">设备SN码:</div>
        <a-input class="singleInputDiv" v-model="screenData.name" placeholder="请输入设备SN码" :allowClear="true"></a-input>
      </div>
      <div class="singleSearchDiv">
        <div class="singleLabelDiv">是否关联机构:</div>
        <a-select
          :allowClear="true"
          class="pickSelectClass"
          placeholder="请选择"
          v-model="screenData.makeCardType"
        >
          <a-select-option v-for="item in equipRelativeList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="singleSearchDiv">
        <a-button
          type="primary"
          style="margin: 0 10px;"
          @click="goSearchData"
        >查询</a-button>
        <a-button
          @click="goResetData"
          style="margin: 0 10px;"
        >重置</a-button>
      </div>
    </div>
    <!-- :row-selection="{ selectedRowKeys: selectedKeyList, onChange: onSelectionChange }" -->
    <a-table
      :loading="tableLoading"
      :row-key="record => record.id"
      :data-source="tableDataList"
      :columns="tableColumns"
      :pagination="tablePagination"
      @change="handleTableChange"
      class="tableBox"
      :scroll="{ x: 1500}">
      <div slot="name" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="makeCardEmployeeName" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="pztOrgName" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="pztOrgExpoSite" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="makeCardTypeStr" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="phone" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="makeCardTypeStr" slot-scope="text">
        {{ returnTableText(text) }}
      </div>
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: center;">
            <a-button type="link" @click="goEdit(record)" >编辑</a-button>
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
        <!-- <div class="editSearchDiv">
            <div class="singleEditSearchDiv">
                <div class="singleEditLabelDiv">设备SN码:</div>
                <a-input class="singleInputDiv" v-model="editInfo.name" placeholder="请输入设备SN码" :disabled="true"></a-input>
            </div>
            <div class="singleEditSearchDiv">
                <div class="singleEditLabelDiv">设备名称:</div>
                <a-input class="singleInputDiv" v-model="editInfo.name" placeholder="请输入设备名称"></a-input>
            </div>
            <div class="singleEditSearchDiv">
                <div class="singleEditLabelDiv">绑定机构:</div>
                <a-input class="singleInputDiv" v-model="editInfo.name" placeholder="请输入绑定机构"></a-input>
            </div>
        </div> -->
        <!-- <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="设备SN码:">
                <a-input class="singleInputDiv" v-model="editInfo.name" placeholder="请输入设备SN码" :disabled="true"></a-input>
            </a-form-item>
            <a-form-item label="设备名称:">
                <a-input class="singleInputDiv" v-model="editInfo.name" placeholder="请输入设备名称"></a-input>
            </a-form-item>
            <a-form-item label="绑定机构:">
                <a-input class="singleInputDiv" v-model="editInfo.name" placeholder="请输入选择绑定机构"></a-input>
            </a-form-item>
        </a-form> -->
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
          <a-form-model-item label="设备名称:" ref="name" prop="name">
            <a-input
              class="singleInputDiv"
              v-model="editInfo.name"
              placeholder="请输入设备名称">
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="绑定机构:" prop="empName">
            <a-input class="singleInputDiv" v-model="editInfo.empName" placeholder="请绑定机构"></a-input>
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
        >确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { getDict } from '@/api/common'
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
        name: [
          { required: true, message: '请输入设备名称', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getEquipRelativeMethod()
  },

  methods: {
    // 获取是否关联机构
    async getEquipRelativeMethod () {
      const params = { dictType: 'make_card_type' }
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
      console.log(params, '查询列表提交对象')
      // 这里请求接口
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
      // this.$set(this.tablePagination, 'current', 1)
      // this.getData()
      this.editModalShowStatus = true
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
    // 点击编辑
    goEdit (record) {
      this.editModalShowStatus = true
    },
    // 点击关闭编辑弹框
    closeEditModal () {
      this.editModalShowStatus = false
    },
    // 编辑弹框点击确定
    confirmEditMethod () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          console.log('能提交')
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
