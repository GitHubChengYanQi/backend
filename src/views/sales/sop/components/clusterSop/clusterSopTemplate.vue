<template>
  <div>
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
  </div>
</template>

<script>
import { departmentEmp } from '@/api/common.js'
export default {
  name: 'ClusterSopTemplate',
  data () {
    return {
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
    goAdd () {},
    // 添加群聊
    addGroupChat () {},
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
        margin-right: 20px;
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
</style>
