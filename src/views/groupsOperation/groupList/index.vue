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
          style="width: 120px"
          :default-active-first-option="false"
          :filter-option="false"
          :options="nameSearchOptions"
          @search="searchChangeDebounceFn"
          @change="handleChange" />
      </div>
      <div class="searchItem">
        <span class="label">群标签：</span>
        <a-select
          style="width: 130px;"
          ref="select"
          v-model="searchObj.tagMatchType"
        >
          <a-select-option value="1">至少满足一项</a-select-option>
          <a-select-option value="2">同时满足</a-select-option>
        </a-select>
        <div class="selectLabelBox">
          <span class="selectBtn" @click="openGroupSelectModal('searchObj.labels')">
            <span class="emptyBtn" v-if="searchObj.labels.length == 0">+ 添加标签</span>
            <span class="label_input_title" v-for="(item, index) in searchObj.labels.slice(0, 2)" :key="index">
              {{ item.itemName }}
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
          style="width:330px;"
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
            labels: [],
            tagMatchType: '1'
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
          <span class="btn" @click="getTableList(true)">导出</span>
          <span class="btn" @click="batchSettingLabels('add')">批量打标签</span>
          <span class="btn" @click="batchSettingLabels('remove')">批量移除标签</span>
        </div>
      </div>
      <a-table
        :rowKey="record => record.workRoomId"
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
        <div slot="operation" slot-scope="text">
          <div class="btns">
            <span class="btn" @click="openSettingModel(text)">设置</span>
            <span
              class="btn"
              @click="$router.push({
                path: `/groupsOperation/groupList/groupItemDetail`,
                query: {id:text }
              })">详情</span>
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
    <!-- <GroupTags :state="chooseUserTagsModalShow" :addState="false" ref="labelSelect" /> -->
    <a-modal v-model="groupTagsModalShow" centered @ok="handleAddGroupTagsOk" width="60%">
      <GroupTags v-model="groupTagsSelectList" />
    </a-modal>
  </div>
</template>

<script>
import GroupTags from '../components/tags.vue'
import { getSearchGroupNameOptionsListReq, batchSetTagsReq, batchRemoveTagsReq, groupListExportReq, getListItemSettingInfoReq, saveListItemSettingInfoReq } from '@/api/groupsOperation'
import { debounce, trasnfromOptions } from '../groupUtils'
import { workRoomList } from '@/api/workRoom'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

export default {
  name: '',
  components: {
    GroupTags
  },
  data () {
    return {
      namesss: '',
      searchObj: {
        employeeIds: [],
        name: '',
        date: [],
        labels: [],
        tagMatchType: '1'
      },
      // 联想选择组
      nameSearchOptions: [],
      searchChangeDebounceFn: debounce(this.handleSearch, 300),
      // 选择标签弹窗
      chooseUserTagsModalShow: false,
      // 标签赋值类型
      lablesModalType: '',
      tableColunms: [
        {
          title: '群名称',
          width: 120,
          dataIndex: 'roomName',
          align: 'center'
        },
        {
          title: '群主',
          width: 120,
          align: 'center',
          dataIndex: 'ownerName'
        },
        {
          title: '所属门店',
          width: 120,
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '所属机构',
          width: 120,
          align: 'center',
          dataIndex: 'parentDepart'
        },
        {
          title: '创建时间',
          width: 180,
          align: 'center',
          sorter: true,
          dataIndex: 'createTime'
        },
        {
          title: '群标签',
          width: 200,
          align: 'center',
          dataIndex: 'tagList',
          scopedSlots: { customRender: 'groupLabels' }
        },
        {
          title: '群人数',
          width: 100,
          align: 'center',
          sorter: true,
          dataIndex: 'memberNum'
        },
        {
          title: '当日入群数',
          width: 130,
          align: 'center',
          sorter: true,
          dataIndex: 'inRoomNum'
        },
        {
          title: '当日退群数',
          width: 130,
          align: 'center',
          sorter: true,
          dataIndex: 'outRoomNum'
        },
        {
          title: '操作',
          width: 130,
          align: 'center',
          dataIndex: 'workRoomId',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tableData: [],
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
        selectId: '',
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
      },
      groupTagsModalShow: false,
      groupTagsSelectList: []
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.getTableList()
  },
  methods: {
    searchDateChange (_, values) {
      this.searchObj.date = values
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
    async handleSearch (val) {
      if (!val) {
        this.nameSearchOptions = []
        return
      }
      const { data } = await getSearchGroupNameOptionsListReq({ name: val })
      this.nameSearchOptions = data.map(it => ({ label: it.name, value: it.name }))
    },
    handleChange (val) {
      console.log('handleChange', val)
    },
    async getTableList (isExport) {
      const { date, employeeIds, labels, name, tagMatchType } = this.searchObj
      const { current, pageSize } = this.pagination
      const obj = {
        tagMatchType,
        workRoomName: name,
        workRoomOwnerId: employeeIds.join(','),
        startTime: date[0] || '',
        endTime: date[1] || '',
        workRoomTagIds: labels.map(it => it.id).join(','),
        page: current,
        perPage: pageSize,
        order: this.tableSortStr
      }
      if (isExport) {
        console.log(this.selectedTableRowKeys, 'selectedTableRowKeys')
        if (this.selectedTableRowKeys.length) {
          obj.ids = this.selectedTableRowKeys.join(',')
        }
        const data = await groupListExportReq(this.handleParam(obj))
        callDownLoadByBlob(data, '群列表')
      } else {
        const { data } = await workRoomList(this.handleParam(obj))
        this.tableData = data.list
        this.pagination.total = data.page.total
      }
    },
    handleParam (obj) {
      for (const item in obj) {
        const data = obj[item]
        if (!data && data !== 0) {
          delete obj[item]
        }
      }
      return obj
    },
    onSelectTableItemChange (rows) {
      this.selectedTableRowKeys = rows
    },
    handleTableChange ({ current, pageSize }, _, { columnKey, order }) {
      let str = ''
      let first = ''
      if (columnKey) {
        if (columnKey === 'createTime') {
          first = 'CreateAt'
        } else if (columnKey === 'memberNum') {
          first = 'Memnum'
        } else if (columnKey === 'inRoomNum') {
          first = 'Innum'
        } else if (columnKey === 'outRoomNum') {
          first = 'Outnum'
        }
      }
      if (order === 'ascend') {
        str = `${first}Asc`
      } else if (order === 'descend') {
        str = `${first}Desc`
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
      this.openGroupSelectModal(t)
    },
    handleCancel () {
      this.groupItemSettingModal.visible = false
      this.groupItemSettingModal.dateSelect = []
      this.groupItemSettingModal.sopSelect = []
    },
    async handleOk () {
      console.log(this.groupItemSettingModal.dateSelect, this.groupItemSettingModal.sopSelect)
      await saveListItemSettingInfoReq({
        id: this.groupItemSettingModal.selectId,
        clusterTemplateIds: this.groupItemSettingModal.dateSelect,
        calendarTemplateIds: this.groupItemSettingModal.sopSelect
      })
      this.$message.success('保存成功！')
    },
    async openSettingModel (id) {
      this.groupItemSettingModal.visible = true
      this.groupItemSettingModal.selectId = id
      const res = await getListItemSettingInfoReq({ id })
      const { clusterCalendarList = [], clusterTemplateList = [] } = res.data
      const calendarObj = trasnfromOptions(clusterCalendarList)
      this.groupItemSettingModal.dateOptions = calendarObj.list
      this.groupItemSettingModal.dateSelect = calendarObj.value
      const sopObj = trasnfromOptions(clusterTemplateList)
      this.groupItemSettingModal.sopOptions = sopObj.list
      this.groupItemSettingModal.sopSelect = sopObj.value
    },
    openGroupSelectModal (t) {
      let filterInputArr = []
      if (t === 'searchObj.labels') {
        filterInputArr = this.searchObj.labels
      }
      this.groupTagsSelectList = filterInputArr
      this.lablesModalType = t
      this.groupTagsModalShow = true
    },
    // 标签弹窗确认
    async handleAddGroupTagsOk () {
      console.log('handleAddGroupTagsOk')
      console.log(this.groupTagsSelectList, 'this.groupTagsSelectList')
      if (this.lablesModalType === 'searchObj.labels') {
        this.searchObj.labels = this.groupTagsSelectList
      } else {
        if (this.lablesModalType === 'add') {
          await batchSetTagsReq({
            ids: this.selectedTableRowKeys.join(','),
            tagids: this.groupTagsSelectList.length ? this.groupTagsSelectList.map(it => it.id).join(',') : ''
          })
        } else if (this.lablesModalType === 'remove') {
          await batchRemoveTagsReq({
            ids: this.selectedTableRowKeys.join(','),
            tagids: this.groupTagsSelectList.length ? this.groupTagsSelectList.map(it => it.id).join(',') : ''
          })
        }
        this.getTableList()
        this.$message.success('设置成功')
      }
      this.selectedTableRowKeys = []
      this.groupTagsSelectList = []
      this.groupTagsModalShow = false
    }
  }
}
</script>
<style lang='less'>

</style>
<style lang='less' scoped>
@import './index.less';
</style>
