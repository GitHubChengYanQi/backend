<template>
  <div id="groupOperation_list-page-container" ref="groupOperation_list-page-container_Ref">
    <div class="searchBar">
      <div class="searchItem">
        <span class="label">选择群主：</span>
        <selectPersonnel
          style="margin-top: 5px;width:200px"
          :changeId="true"
          :num="1"
          v-model="searchObj.employeeIds" />
      </div>
      <div class="searchItem">
        <span class="label">群名称：</span>
        <a-select
          v-model="searchObj.name"
          show-search
          placeholder="请输入群名称"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="nameSearchOptions"
          @search="handleSearch"
          @change="handleChange" />
      </div>
      <div class="searchItem">
        <span class="label">群标签：</span>
        <div class="selectLabelBox">
          <span class="selectBtn" @click="showBox(0, 'searchObj.labels')">
            <span class="emptyBtn" v-if="searchObj.labels.length == 0">+ 添加标签</span>
            <span class="label_input_title" v-for="(item, index) in searchObj.labels.slice(0, 2)" :key="index">
              {{ item.name }}
              <span class="delete" @click.stop="delTagHandle(item.id, index)">+</span>
            </span>
            <span class="label_input_title" v-if="searchObj.labels.length > 2">
              + {{ searchObj.labels.length - 2 }}
            </span>
          </span>
        </div>
      </div>
      <div class="searchItem">
        <span class="label">群创建时间：</span>
        <a-range-picker
          v-model="searchObj.date"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          @change="searchDateChange" />
      </div>
      <a-button
        type="primary"
        @click="() => {
          this.pagination.current = 1
          getTableList()
        }">查询</a-button>
      <a-button
        style="margin-left: 10px;"
        @click="() => {
          this.searchObj = {
            employeeIds: [],
            name: '',
            date: [],
            labels: []
          }; this.getTableList()
        }">重置</a-button>
    </div>
    <div class="tableBox">
      <div class="previewBar">
        <div class="lef">
          <span class="total">共{{ pagination.total }}个群聊</span>
          <span class="select">已选择{{ selectedTableRowKeys.length }}个群聊</span>
          <span class="refresh">更新数据</span>
        </div>
        <div class="rig">
          <a-dropdown style="margin-left: 10px;width: 90px;">
            <span class="btn">导出</span>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <span @click="getTableList('exp_cur')">导出当前</span>
                </a-menu-item>
                <a-menu-item>
                  <span @click="getTableList('exp_all')">导出全部</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <span class="btn" @click="batchSettingLabels('add')">批量打标签</span>
          <span class="btn" @click="batchSettingLabels('remove')">批量移除标签</span>
        </div>
      </div>
      <a-table
        :columns="tableColunms"
        :data-source="tableData"
        :scroll="{ x: 1300 }"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedTableRowKeys, onChange: onSelectTableItemChange }"
        @change="handleTableChange">
        <div slot="groupLabels" slot-scope="text" class="groupLabels">
          <div class="labelItem" v-for="(item, index) in text" :key="index">
            {{ item }}
          </div>
        </div>
        <!-- text, record -->
        <div slot="operation" slot-scope="">
          <div class="btns">
            <span class="btn" @click="groupItemSettingModal.visible = true">设置</span>
            <span class="btn" @click="$router.push(`/groupsOperation/groupList/groupItemDetail`)">详情</span>
          </div>
        </div>
      </a-table>
    </div>
    <a-modal
      class="groupItemSettingModal"
      v-model="groupItemSettingModal.visible"
      title="设置群日历、群SOP"
      :width="600"
      okText="保存"
      :getContainer="() => this.$refs['groupOperation_list-page-container_Ref']"
      @cancel="handleCancel"
      @ok="handleOk">
      <div class="itemBox">
        <span class="label">请选择群日历：</span>
        <a-select
          v-model="groupItemSettingModal.dateSelect"
          mode="multiple"
          placeholder="请选择"
          :max-tag-count="2"
          :options="groupItemSettingModal.dateOptions">
        </a-select>
      </div>
      <div class="itemBox">
        <span class="label">请选择群SOP：</span>
        <a-select
          v-model="groupItemSettingModal.sopSelect"
          mode="multiple"
          placeholder="请选择"
          :max-tag-count="2"
          :options="groupItemSettingModal.sopOptions">
        </a-select>
      </div>
    </a-modal>
    <label-select :state="chooseUserTagsModalShow" :addState="false" ref="labelSelect" />
  </div>
</template>

<script>
import LabelSelect from '@/views/clientFollow/components/LabelSelect.vue'
import { returnLabelJSONData } from '../groupUtils'

export default {
  name: '',
  components: {
    'label-select': LabelSelect
  },
  data () {
    return {
      searchObj: {
        employeeIds: [],
        name: '',
        date: [],
        labels: []
      },
      // 联想选择组
      nameSearchOptions: [],
      // 选择标签弹窗
      chooseUserTagsModalShow: false,
      // 标签赋值类型
      lablesModalType: '',
      tableColunms: [
        {
          title: '群名称',
          width: 120,
          dataIndex: 'groupName',
          align: 'center'
        },
        {
          title: '群主',
          width: 120,
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '所属门店',
          width: 120,
          align: 'center',
          dataIndex: 'from'
        },
        {
          title: '所属机构',
          width: 120,
          align: 'center',
          dataIndex: 'from2'
        },
        {
          title: '创建时间',
          width: 180,
          align: 'center',
          sorter: true,
          dataIndex: 'create_time'
        },
        {
          title: '群标签',
          width: 200,
          align: 'center',
          dataIndex: 'groupLabels',
          scopedSlots: { customRender: 'groupLabels' }
        },
        {
          title: '群人数',
          width: 100,
          align: 'center',
          sorter: true,
          dataIndex: 'num1'
        },
        {
          title: '当日入群数',
          width: 130,
          align: 'center',
          sorter: true,
          dataIndex: 'num2'
        },
        {
          title: '当日退群数',
          width: 130,
          align: 'center',
          sorter: true,
          dataIndex: 'num3'
        },
        {
          title: '操作',
          width: 130,
          align: 'center',
          dataIndex: 'id',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tableData: [
        {
          id: 1,
          groupName: 'group',
          name: 'Arthas',
          from: 'm78',
          from2: '01',
          create_time: '2022-23-12 33:33:33',
          groupLabels: ['标签1', '标签2', '标签3'],
          num1: 1,
          num2: 2,
          num3: 3
        },
        {
          id: 2,
          groupName: 'group',
          name: 'Arthas',
          from: 'm78',
          from2: '01',
          create_time: '2022-23-12 33:33:33',
          groupLabels: [],
          num1: 1,
          num2: 2,
          num3: 3
        }
      ],
      tableSortStr: '',
      selectedTableRowKeys: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `第 ${Math.ceil(range[1] / this.pagination.pageSize)}页/共${total}条数据 `
      },
      groupItemSettingModal: {
        visible: false,
        dateSelect: [],
        dateOptions: [
          {
            value: 1,
            label: '11'
          },
          {
            value: 2,
            label: '22'
          },
          {
            value: 3,
            label: '33'
          },
          {
            value: 4,
            label: '44'
          }
        ],
        sopSelect: [],
        sopOptions: [
          {
            value: 1,
            label: '11'
          },
          {
            value: 2,
            label: '22'
          },
          {
            value: 3,
            label: '33'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    searchDateChange (_, values) {
      this.searchObj.date = values
    },
    // 选择标签回调用父组件事件集
    showBox (e, targetLables) {
      if (e != -1) {
        let filterIdArr = []
        let filterInputArr = []
        if (e === 0 && targetLables === 'searchObj.labels') {
          filterIdArr = this.searchObj.labels.map(item => item.id)
          filterInputArr = this.searchObj.labels
        }
        this.$refs.labelSelect.idArr = filterIdArr
        this.$refs.labelSelect.inputArr = filterInputArr
        this.lablesModalType = targetLables
      }
      this.chooseUserTagsModalShow = !this.chooseUserTagsModalShow
    },
    // 标签弹窗确认
    transmitLabel (e) {
      if (this.lablesModalType === 'searchObj.labels') {
        this.searchObj.labels = e
      } else {
        if (this.lablesModalType === 'add') {

        } else if (this.lablesModalType === 'remove') {

        }
        console.log(this.lablesModalType, e)
      }
    },
    // 删除item
    // -1 默认 -2 排除 -3 群组
    delTagHandle (id, index) {
      let filterIdArr = []
      let filterInputArr = []
      filterIdArr = this.searchObj.labels.map((item) => item.id)
      filterInputArr = this.searchObj.labels
      this.searchObj.labels = this.searchObj.labels.filter((_, i) => i != index)
      this.$refs.labelSelect.setArr(id, index)
      this.$refs.labelSelect.idArr = filterIdArr
      this.$refs.labelSelect.inputArr = filterInputArr
    },
    handleSearch (val) {
      console.log('handleSearch', val)
    },
    handleChange (val) {
      console.log('handleChange', val)
      this.searchObj.name = val
    },
    async getTableList (expstatus) {
      const { date, employeeIds, labels, name } = this.searchObj
      const { current, pageSize } = this.pagination
      const obj = {
        name,
        starttime: date[0] || '',
        endtime: date[1] || '',
        employeeIds: employeeIds.join(','),
        labels: returnLabelJSONData(labels),
        current,
        size: pageSize,
        order: this.tableSortStr
      }
      if (expstatus) {
        obj.expstatus = expstatus
      }
      console.log(obj, 'obj')
      if (expstatus) {
        // const data = await momentsListExportReq(obj)
        // callDownLoadByBlob(data, '朋友圈任务列表')
      } else {
        // const { data } = await getMomentsListReq(obj)
        // this.tableData = data.datas
        // this.pagination.total = data.total
      }
    },
    onSelectTableItemChange (rows) {
      this.selectedTableRowKeys = rows
    },
    handleTableChange ({ current, pageSize }, _, { columnKey, order }) {
      let str = ''
      let first = ''
      if (columnKey) {
        first = columnKey === 'start_time' ? 'Create' : 'Start'
      }
      if (order === 'ascend') {
        str = `${first}AtAsc`
      } else if (order === 'descend') {
        str = `${first}AtDesc`
      }
      this.tableSortStr = str
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableList()
    },
    batchSettingLabels (t) {
      if (!this.selectedTableRowKeys.length) {
        this.$message.warn('请选择群聊')
        return
      }
      this.showBox(0, t)
    },
    handleCancel () {
      this.groupItemSettingModal.visible = false
      this.groupItemSettingModal.dateSelect = []
      this.groupItemSettingModal.sopSelect = []
    },
    handleOk () {
      console.log(this.groupItemSettingModal.dateSelect, this.groupItemSettingModal.sopSelect)

      // this.groupItemSettingModal.visible = false
    }
  }
}
</script>
<style lang='less'>

</style>
<style lang='less' scoped>
@import './index.less';
</style>
