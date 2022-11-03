<template>
  <div id="ChooseGroupTransferModal_Component">
    <a-modal
      :title="title"
      :maskClosable="false"
      :width="1000"
      :visible="visible"
      id="ChooseGroupTransferModal_Component_Container"
      @cancel="closeModal"
    >
      <a-transfer
        class="chooseGroupTransferBox"
        :data-source="tablesData"
        :target-keys="targetKeys"
        :rowKey="record => mode === 'people' ? record.ownerId.toString() : record.id.toString()"
        :show-search="true"
        :locale="{searchPlaceholder: mode === 'people' ? '请输入群主名称' : '请输入群名称'}"
        :filter-option="(inputValue, item) => item.ownerName.indexOf(inputValue) !== -1"
        :show-select-all="false"
        @change="onChange"
      >
        <template
          slot="children"
          slot-scope="{
            props: { direction, filteredItems, selectedKeys },
            on: { itemSelectAll: onItemSelectAll, itemSelect: onItemSelect },
          }"
        >
          <a-cascader
            v-model="departmentSelect"
            v-if="direction === 'left'"
            class="chooseDepartmentBtn"
            :options="departmentList"
            placeholder="请选择"
            change-on-select
            :fieldNames="{label: 'name', value: 'id', children: 'son'}"
            @change="departmentSelectChange"
          />
          <a-table
            :row-selection="
              getRowSelection({
                filteredItems,
                selectedKeys,
                onItemSelectAll,
                onItemSelect,
              })
            "
            :columns="tableColumns"
            :data-source="filteredItems"
            size="small"
          />
        </template>
      </a-transfer>
      <template slot="footer">
        <a-button @click="closeModal">取消</a-button>
        <a-button type="primary" @click="confirmChooseUserTags">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getDepartmentGroupListReq, getDepartmentListReq } from '@/api/salesManagement'
const recur = (arr) => {
  for (let i = 0; i++; i < arr.length) {
    if (arr[i].son.length) {
      arr[i].son = recur(arr[i].son)
    }
  }
  return arr
}

const propleColumns = [
  {
    dataIndex: 'ownerName',
    title: '群主'
  },
  {
    dataIndex: 'memberNum',
    title: '群数'
  }
]

const groupColumns = [
  {
    dataIndex: 'name',
    title: '群名称'
  },
  {
    dataIndex: 'memberNum',
    title: '群人数'
  },
  {
    dataIndex: 'ownerName',
    title: '群主'
  }
]

export default {
  name: 'ChooseGroupTransferModal',
  props: {
    title: {
      type: String,
      default: '选择群组'
    },
    mode: {
      type: String,
      default: 'people'
    },
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      nowMode: '',
      tablesData: [],
      targetKeys: [],
      tableColumns: [],
      getRowSelection ({
        selectedKeys,
        onItemSelectAll,
        onItemSelect
      }) {
        return {
          // 选择框的默认属性配置
          onSelectAll (selected, selectedRows) {
            const treeSelectedKeys = selectedRows.map(({
              key
            }) => key)
            onItemSelectAll(treeSelectedKeys, selected)
          },
          onSelect ({
            key
          }, selected) {
            onItemSelect(key, selected)
          },
          selectedRowKeys: selectedKeys
        }
      },
      isDepartmentInit: false,
      departmentList: [],
      departmentSelect: []
    }
  },
  computed: {},
  watch: {
    async visible (e) {
      if (e) {
        if (!this.isDepartmentInit) {
          const { data: { department } } = await getDepartmentListReq({ searchKeyWords: '' })
          this.departmentList = recur(department)
          if (!this.departmentSelect.length) {
            this.departmentSelect = [department[0].id]
          }
          this.isDepartmentInit = true
        } else {
          if (!this.departmentSelect.length) {
            this.departmentSelect = [this.departmentList[0].id]
          }
        }
        await this.getDepartmentList(e[e.length - 1])
        this.targetKeys = this.list.map(it => it.key.toString())
      } else {
        this.tablesData = []
      }
    },
    mode (e) {
      if (e !== this.nowMode) {
        this.targetKeys = []
      }
    }
  },
  async created () {
    this.nowMode = this.mode
  },
  mounted () { },
  methods: {
    onChange (nextTargetKeys) {
      this.targetKeys = nextTargetKeys
    },
    confirmChooseUserTags () {
      const filArr = this.tablesData.filter(it => this.targetKeys.includes(it.key))
      this.$emit('confirm', filArr)
      this.targetList = []
      this.departmentSelect = [this.departmentList[0].id]
    },
    closeModal () {
      this.targetList = []
      this.departmentSelect = [this.departmentList[0].id]
      this.$emit('close')
    },
    departmentSelectChange (e) {
      this.departmentSelect = e
      this.getDepartmentList(e[e.length - 1])
    },
    async getDepartmentList (departmentId) {
      try {
        const { data: { datas } } = await getDepartmentGroupListReq({ departmentId, room: this.mode === 'group' })
        this.tableColumns = this.mode === 'people' ? propleColumns : groupColumns
        this.tablesData = datas
      } catch (e) {
        console.log(e, 'errr')
      }
    }
  }
}
</script>
<style lang='less'>
#ChooseGroupTransferModal_Component_Container {
  .ant-modal-body {
    display: flex;
    padding: 0;
    .ant-transfer {
      width: 100%;
      padding: 0 10px;
      .ant-transfer-list-body-search-wrapper {
        width: 50%;
        margin-left: 50%;
      }
      .chooseDepartmentBtn {
        width: 50%;
        position: absolute;
        top: 12px;
        left: 10px;
      }
    }
  }
}
</style>
<style lang='less' scoped>
</style>
