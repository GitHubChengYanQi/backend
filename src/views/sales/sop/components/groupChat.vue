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
      <span>选择执行群(SOP话术将推送给群主,由群主发送到所选择的群)</span>
      <div class="filter-input-row flex-between">
        <div class="item">
          <div class="title">群主：</div>
          <selectPersonnel
            class="selectPersonnelCom"
            name="请选择创建者"
            :changeId="true"
            :num="1"
            v-model="groupChatSearchInfo.employeeIds"
          />
        </div>
        <div class="item">
          <div class="title">群名称：</div>
          <a-input placeholder="请输入要搜索的客户" v-model="groupChatSearchInfo.personName"/>
        </div>
        <div class="item">
          <div class="title">标签：</div>
          <a-select
            placeholder="请选择"
            v-model="groupChatSearchInfo.tagType"
            style="width: 200px"
          >
            <a-select-option :value="tagsTypeItem.id" v-for="tagsTypeItem in tagsTypeList" :key="tagsTypeItem.id">{{ tagsTypeItem.name }}</a-select-option>
          </a-select>
          <SelectTagInput v-model="groupChatSearchInfo.workRoomTagIds" :screentags="true" :changeId="true" ref="SelectTagInput" />
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
          <a-button type="primary" @click="searchGroupChatMethod()">查询</a-button>
          <a-button @click="resetGroupChatMethod()">重置</a-button>
        </div>

      </div>
      <a-table
        :row-key="record => record.workRoomId"
        :loading="groupChatLoading"
        :columns="groupChatColumns"
        :data-source="groupChatDataList"
        :pagination="groupChatPagination"
        :pageSizeOptions="['10', '20', '30', '50']"
        :row-selection="{ selectedRowKeys: groupChatSelectedRowKeys, onChange: onGroupChatSelectChange, getCheckboxProps: getCheckboxProps }"
        :scroll="{ x: 1500 }"
        @change="groupChatHandleTableChange"
      ></a-table>
      <template slot="footer">
        <a-button
          @click="closeGroupChat()"
        >取消</a-button>
        <a-button type="primary" @click="confirmGroupChat()">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
// import { getGroupChatListMethod } from '@/api/cluster'
import moment from 'moment'
export default {
  name: 'GroupChat',
  data () {
    return {
      groupChatSelectedRowKeys: [],
      groupChatSearchInfo: {}, // 群聊查询对象
      // 添加群聊弹框显示状态
      addGroupChatShowStatus: false,
      tagsTypeList: [
        {
          id: 0,
          name: '同时满足'
        },
        {
          id: 1,
          name: '至少满足一项'
        }
      ],
      groupChatLoading: false, // 添加群聊弹框列表加载
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
          width: 150
        },
        {
          title: '执行中的SOP',
          dataIndex: 'sopNameListStr',
          align: 'center',
          width: 150
        },
        {
          title: '执行中的群日历',
          dataIndex: 'calendarNameListStr',
          align: 'center',
          width: 150
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
    showStatus: {
      type: Boolean,
      default: false
    },
    selectArrayString: {
      type: String,
      default: ''
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
        this.$set(this.groupChatSearchInfo, 'employeeIds', [])
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
      this.groupChatDataList = [
        {
          workRoomId: 0,
          roomName: '测试群1',
          ownerName: '测试群主1',
          sopNameListStr: '执行SOP1',
          calendarNameListStr: '执行日历1',
          createTime: '2022-10-30'
        },
        {
          workRoomId: 1,
          roomName: '测试群2',
          ownerName: '测试群主2',
          sopNameListStr: '执行SOP2',
          calendarNameListStr: '执行日历2',
          createTime: '2022-09-30'
        }
      ]
    },
    /**
     * 选择框的默认属性配置
     */
    getCheckboxProps (record) {
      return ({
        props: {
          disabled: this.groupChatSelectedRowKeys.some(item => item === record.workRoomId)
        }
      })
    },
    // 群聊列表切换选中状态
    onGroupChatSelectChange (e) {
      console.log(e, 'eeee')
      this.groupChatSelectedRowKeys = e
    },
    // 群聊列表分页信息
    groupChatHandleTableChange () {},
    onSelectChange () {},
    // 搜索群聊
    searchGroupChatMethod () {
      this.$set(this.groupChatSearchInfo, 'workRoomOwnerId', this.groupChatSearchInfo.employeeIds.length !== 0 ? this.groupChatSearchInfo.employeeIds.join(',') : '')
      const tempTimeArray = this.groupChatSearchInfo.time
      this.$set(this.groupChatSearchInfo, 'startTime', moment(tempTimeArray[0]).format('YYYY-MM-DD'))
      this.$set(this.groupChatSearchInfo, 'endTime', moment(tempTimeArray[1]).format('YYYY-MM-DD'))
      console.log(this.groupChatSearchInfo, 'groupChatSearchInfo')
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
      this.$emit('submitGroupChat', this.groupChatSelectedRowKeys.join(','))
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
