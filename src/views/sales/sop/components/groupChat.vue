<template>
  <div id="group_chat_container" ref="group_chat_container" v-if="addGroupChatShowStatus">
    <a-modal
      title="添加群聊"
      :maskClosable="false"
      :width="1400"
      :visible="addGroupChatShowStatus"
      class="addGroupChatClass"
      @cancel="closeGroupChat()"
      :getContainer="() => $refs['group_chat_container']"
    >
      <a-spin :spinning="modalLoadingStatus">
        <span>选择执行群(SOP话术将推送给群主,由群主发送到所选择的群)</span>
        <div class="filter-input-row flex-between">
          <div class="item">
            <div class="title">群主：</div>
            <selectPersonnel
              class="selectPersonnelCom"
              name="请选择创建者"
              :changeId="true"
              :num="1"
              style="width: 200px"
              v-model="groupChatSearchInfo.employeeIds"
            />
          </div>
          <div class="item">
            <div class="title">群名称：</div>
            <a-input placeholder="请输入要搜索的客户" v-model="groupChatSearchInfo.workRoomName"/>
          </div>
          <div class="item">
            <div class="title">标签：</div>
            <a-select
              placeholder="请选择"
              v-model="groupChatSearchInfo.tagMatchType"
              style="width: 200px"
            >
              <a-select-option :value="tagsTypeItem.value" v-for="tagsTypeItem in tagsTypeList" :key="tagsTypeItem.id">{{ tagsTypeItem.name }}</a-select-option>
            </a-select>
            <SelectTagInput v-model="groupChatSearchInfo.tagsList" :screentags="true" :changeId="true" ref="SelectTagInput" />
          </div>
          <div class="item">
            <div class="title">群创建日期：</div>
            <a-range-picker
              style="width: 265px"
              v-model="groupChatSearchInfo.time"
              format="YYYY-MM-DD"
              :placeholder="['开始日期', '结束日期']"
            />
          </div>
          <div class="item">
            <a-button type="primary" @click="searchGroupChatMethod()" v-permission="'/sopClusterTemplate/getClusterList@post'">查询</a-button>
            <a-button @click="resetGroupChatMethod()" v-permission="'/sopClusterTemplate/getClusterList@post'">重置</a-button>
          </div>
        </div>
        <a-table
          :row-key="record => record.workRoomId"
          :columns="groupChatColumns"
          :data-source="groupChatDataList"
          :pagination="groupChatPagination"
          :row-selection="{ selectedRowKeys: groupChatSelectedRowKeys, onChange: onGroupChatSelectChange, getCheckboxProps: getCheckboxProps }"
          :scroll="{ x: 1500 }"
          @change="groupChatHandleTableChange"
        >
          <div slot="tagListStr" slot-scope="text">
            <a-popover title="群标签">
              <template slot="content">
                <div class="labelBox">
                  {{ text }}
                </div>
              </template>
              <a-tag type="button">
                查看
              </a-tag>
            </a-popover>
          </div>
          <div slot="sopNameListStr" slot-scope="text">
            <a-popover title="执行中的SOP">
              <template slot="content">
                <div class="labelBox">
                  {{ text }}
                </div>
              </template>
              <a-tag type="button">
                查看
              </a-tag>
            </a-popover>
          </div>
          <div slot="calendarNameListStr" slot-scope="text">
            <a-popover title="执行中的群日历">
              <template slot="content">
                <div class="labelBox">
                  {{ text }}
                </div>
              </template>
              <a-tag type="button">
                查看
              </a-tag>
            </a-popover>
          </div>
        </a-table>
      </a-spin>
      <template slot="footer">
        <a-button
          :disabled="modalLoadingStatus"
          @click="closeGroupChat()"
        >取消</a-button>
        <a-button type="primary" :disabled="modalLoadingStatus" @click="confirmGroupChat" v-permission="permissionText">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getGroupChatListMethod } from '@/api/cluster'
import moment from 'moment'
export default {
  name: 'GroupChat',
  data () {
    return {
      modalLoadingStatus: false, // 弹框加载中显示状态
      groupChatSelectedRowKeys: [],
      groupChatSearchInfo: {}, // 群聊查询对象
      // 添加群聊弹框显示状态
      addGroupChatShowStatus: false,
      tagsTypeList: [
        {
          id: 1,
          value: 1,
          name: '至少满足一项'
        },
        {
          id: 2,
          value: 2,
          name: '同时满足'
        }
      ],
      groupChatDataList: [],
      groupChatColumns: [
        {
          title: '群名称',
          dataIndex: 'roomName',
          align: 'center',
          width: 150
        },
        {
          title: '群主',
          dataIndex: 'ownerName',
          align: 'center',
          width: 150
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          width: 150
        },
        {
          title: '群标签',
          dataIndex: 'tagListStr',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'tagListStr' }
        },
        {
          title: '执行中的SOP',
          dataIndex: 'sopNameListStr',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'sopNameListStr' }
        },
        {
          title: '执行中的群日历',
          dataIndex: 'calendarNameListStr',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'calendarNameListStr' }
        }
      ],
      // 群聊弹框分页信息
      groupChatPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  props: {
    permissionText: {
      type: String,
      default: ''
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    typeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    selectArrayString () {
      console.log('selectArrayString', this.selectArrayString)
      this.groupChatSelectedRowKeys = this.selectArrayString ? JSON.parse(this.selectArrayString) : []
    },
    showStatus () {
      this.addGroupChatShowStatus = this.showStatus
      if (this.addGroupChatShowStatus) {
        // getGroupChatListMethod(this.groupChatSearchInfo).then(response => {
        //   console.log(response, '获取群聊列表')
        // })
        this.modalLoadingStatus = true
        this.$set(this.groupChatSearchInfo, 'employeeIds', [])
        this.$set(this.groupChatSearchInfo, 'tagsList', [])
        this.$set(this.groupChatSearchInfo, 'tagsList', [])
        this.$set(this.groupChatSearchInfo, 'templateId', this.typeInfo.id)
        this.$set(this.groupChatSearchInfo, 'soptype', this.typeInfo.soptype)
        this.$set(this.groupChatSearchInfo, 'tagMatchType', this.tagsTypeList[0].value)
        this.getDataList()
      }
    }
  },
  created () {
    console.log('组件创建')
  },
  mounted () {
    console.log('组件挂载')
    this.$set(this.groupChatSearchInfo, 'tagType', 0)
  },
  updated () {
    console.log('组件更新')
  },
  beforeDestroy () {
    console.log('组件卸载之前')
  },
  methods: {
    getDataList () {
      // this.groupChatDataList = [
      //   {
      //     workRoomId: 0,
      //     roomName: '测试群1',
      //     ownerName: '测试群主1',
      //     sopNameListStr: '执行SOP1',
      //     calendarNameListStr: '执行日历1',
      //     createTime: '2022-10-30'
      //   },
      //   {
      //     workRoomId: 1,
      //     roomName: '测试群2',
      //     ownerName: '测试群主2',
      //     sopNameListStr: '执行SOP2',
      //     calendarNameListStr: '执行日历2',
      //     createTime: '2022-09-30'
      //   }
      // ]
      const params = {
        ...this.groupChatSearchInfo,
        page: this.groupChatPagination.current,
        perPage: this.groupChatPagination.pageSize
      }
      this.modalLoadingStatus = true
      getGroupChatListMethod(params).then(response => {
        console.log(response, '获取群聊列表')
        this.groupChatDataList = response.data.list
        this.modalLoadingStatus = false
      }).catch(() => {
        this.modalLoadingStatus = false
      })
    },
    /**
     * 选择框的默认属性配置
     */
    getCheckboxProps (record) {
      console.log(record, 'record')
      return ({
        props: {
          // disabled: this.groupChatSelectedRowKeys.some(item => item === record.workRoomId)
          disabled: record.checked === '1'
        }
      })
    },
    // 群聊列表切换选中状态
    onGroupChatSelectChange (e) {
      console.log(e, 'eeee')
      this.groupChatSelectedRowKeys = e
    },
    // 群聊列表分页信息
    groupChatHandleTableChange ({ current, pageSize }) {
      this.groupChatPagination.current = current
      this.groupChatPagination.pageSize = pageSize
      this.getTableData()
    },
    onSelectChange () {},
    // 搜索群聊
    searchGroupChatMethod () {
      console.log(this.groupChatSearchInfo, 'this.groupChatSearchInfo')
      debugger
      this.$set(this.groupChatSearchInfo, 'workRoomOwnerId', this.groupChatSearchInfo.employeeIds.length !== 0 ? this.groupChatSearchInfo.employeeIds.join(',') : '')
      const tempTimeArray = this.groupChatSearchInfo.time
      if (tempTimeArray && tempTimeArray.length === 2) {
        this.$set(this.groupChatSearchInfo, 'startTime', moment(tempTimeArray[0]).format('YYYY-MM-DD'))
        this.$set(this.groupChatSearchInfo, 'endTime', moment(tempTimeArray[1]).format('YYYY-MM-DD'))
      } else {
        this.$delete(this.groupChatSearchInfo, 'startTime')
        this.$delete(this.groupChatSearchInfo, 'endTime')
      }
      console.log(this.groupChatSearchInfo, 'groupChatSearchInfo')
      this.getDataList()
      // 执行搜索方法
    },
    // 重置搜索群聊
    resetGroupChatMethod () {
      this.groupChatSearchInfo = {}
      // 执行搜索方法
    },
    // 关闭添加群聊弹框
    closeGroupChat () {
      this.addGroupChatShowStatus = false
      this.$emit('update:showStatus', this.addGroupChatShowStatus)
    },
    // 提交添加群聊
    confirmGroupChat () {
      console.log('提交添加群聊')
      console.log(this.groupChatSelectedRowKeys)
      this.addGroupChatShowStatus = false
      this.$emit('update:showStatus', this.addGroupChatShowStatus)
      // debugger
      this.$emit('submitGroupChat', JSON.stringify(this.groupChatSelectedRowKeys))
    }
  }
}
</script>

<style lang="less" scoped>
.filter-input-row {
    .item {
      display: flex;
      align-items: center;
      .title {
        flex-shrink: 0;
        text-align: left;
        width: auto;
      }
    }
    .ant-btn:nth-last-child(1) {
      margin-left: 4px;
    }
  }
</style>
