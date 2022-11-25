<template>
  <div id="cluster_template_container" ref="cluster_template_container">
    <button @click="addGroupChat()">添加群聊</button>
    <div class="searchLine">
      <div class="searchBox">
        <div class="item">
          <span>SOP名称:</span>
          <a-input placeholder="请输入SOP名称" v-model="searchValue" class="inputClass" />
          <!-- style="width: 200px; height: 35px" -->
        </div>
        <div class="item">
          <span>创建人:</span>
          <selectPersonnel
            v-if="treeData"
            :record="treeData"
            class="selectPersonnelCom"
            name="选择成员"
            v-model="employeeIds"
            @getVal="employeeIdsChange"
          />
        </div>
        <a-button
          type="primary"
          style="width: 54px;height: 34px;margin: 0 10px;"
          @click="goSearch"
        >查询</a-button>
        <a-button
          style="width: 54px;height: 34px;margin-right: 10px;"
          @click="goReset"
        >重置</a-button>
      </div>
      <div class="handlesBox">
        <div class="btn" @click="goAdd">创建SOP模板</div>
      </div>
    </div>
    <a-table
      :loading="tableLoading"
      class="tableBox"
      :row-key="record => record.id"
      :data-source="tableData"
      :columns="tableColumns"
      :pagination="pagination"
      :scroll="{ x: 1500}"
      @change="getChangeList">
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: space-around;">
            <a-button type="link" @click="addGroupChat(record)">添加群聊</a-button>
            <a-button type="link" @click="editItem(record)">编辑</a-button>
            <a-button type="link" @click="copyItem(record)">复制</a-button>
            <a-button type="link" @click="deleteItem(record.id)">删除</a-button>
          </div>
        </template>
      </div>
    </a-table>
    <a-modal
      title="添加群聊"
      :maskClosable="false"
      :width="1400"
      :visible="addGroupChatShowStatus"
      class="addGroupChatClass"
      @cancel="closeGroupChat()"
      :getContainer="() => $refs['cluster_template_container']"
    >
      <span>选择执行群(SOP话术将推送给群主,由群主发送到所选择的群)</span>
      <div class="filter-input-row flex-between">
        <div class="item">
          <div class="title">群主：</div>
          <a-input placeholder="请输入要搜索的客户" v-model="groupChatSearchInfo.personName"/>
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
          <SelectTagInput v-model="groupChatSearchInfo.tags" :screentags="true" :changeId="true" ref="SelectTagInput" />
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
          <a-button type="primary" @click="confirmGroupChat()">查询</a-button>
          <a-button @click="confirmGroupChat()">重置</a-button>
        </div>

      </div>
      <a-table
        :row-key="record => record.id"
        :loading="groupChatLoading"
        :columns="groupChatColumns"
        :data-source="groupChatDataList"
        :pagination="groupChatPagination"
        :pageSizeOptions="['10', '20', '30', '50']"
        :row-selection="{ selectedRowKeys: groupChatSelectedRowKeys, onChange: onGroupChatSelectChange }"
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
import { departmentEmp } from '@/api/common.js'
export default {
  name: 'ClusterSopTemplate',
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
      // 表格加载效果
      tableLoading: false,
      // 表格数据
      tableData: [],
      // 树列表数据
      treeData: [],
      // 员工选择数组
      employeeIds: [],
      // 模糊搜索
      searchValue: '',
      tableColumns: [
        {
          title: 'SOP名称',
          dataIndex: 'sopName',
          align: 'center',
          width: 150
        },
        {
          title: '创建人',
          dataIndex: 'createdByName',
          align: 'center',
          width: 150
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          align: 'center',
          width: 200
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      groupChatLoading: false, // 添加群聊弹框列表加载
      groupChatDataList: [],
      groupChatColumns: [
        {
          title: '群名称',
          dataIndex: 'groupName',
          align: 'center',
          width: 150
        },
        {
          title: '群主',
          dataIndex: 'personName',
          align: 'center',
          width: 150
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
          align: 'center',
          width: 150
        },
        {
          title: '群标签',
          dataIndex: 'tags',
          align: 'center',
          width: 150
        },
        {
          title: '执行中的SOP',
          dataIndex: 'openingSop',
          align: 'center',
          width: 150
        },
        {
          title: '执行中的群日历',
          dataIndex: 'openingCalendar',
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
      },
      // 分页对象
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  created () {
    this.departmentEmp()
  },
  methods: {
    // 群聊列表切换选中状态
    onGroupChatSelectChange () {},
    // 群聊列表分页信息
    groupChatHandleTableChange () {},
    onSelectChange () {},
    // 关闭添加群聊弹框
    closeGroupChat () {
      this.addGroupChatShowStatus = false
    },
    // 提交添加群聊
    confirmGroupChat () {
      console.log('提交添加群聊')
    },
    // 拉取部门数据
    departmentEmp () {
      departmentEmp().then(res => {
        this.treeData = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    // 切换员工选择
    employeeIdsChange (e) {
      console.log(e)
    },
    // 切换列表,翻页
    getChangeList () {

    },
    // 搜索
    goSearch () {},
    // 重置
    goReset () {},
    // 创建sop模板
    goAdd () {
      this.$router.push({
        path: '/sop/addClusterSop',
        query: {
          id: -1
        }
      })
    },
    // 添加群聊
    addGroupChat () {
      this.addGroupChatShowStatus = true
      this.groupChatSearchInfo.tagType = 0
    },
    // 复制
    copyItem () {},
    // 删除sop
    deleteItem () {

    },
    // 编辑sop
    editItem () {}
  }
}
</script>

<style lang="less" scoped>
.searchLine {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 15px 5px;
    .searchBox {
      display: flex;
      align-items: center;
      .item {
        display: flex;
        align-items: center;
        margin-right: 15px;
        .selectPersonnelCom {
          width: 200px;
          margin-left: 10px;
        }
        .inputClass {
          width: 200px;
          margin-left: 10px;
        }
      }
    }
    .explan {
      margin-left: 20px;
    }
    .handlesBox {
      margin-right: 10px;
      .btn {
        height: 40px;
        padding: 0 15px;
        font-family: 'FontAwesome', sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 15px;
        color: #333333;
        line-height: 40px;
        cursor: pointer;
        background-color: rgba(52, 112, 255, 1);
        border-radius: 4px;
        color: #fff;
      }
    }
  }
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
