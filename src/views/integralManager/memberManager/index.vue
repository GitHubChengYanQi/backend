<template>
  <div>
    <!-- 会员列表 -->
    <a-form :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
      <a-row :gutter="16">
        <a-col :lg="6">
          <a-form-item label="搜索会员:">
            <a-input v-model="screenData.name" placeholder="请输入要搜索的会员姓名"></a-input>
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="手机号:">
            <a-input v-model="screenData.phone" placeholder="请输入要搜索的手机号"></a-input>
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="开卡员工:">
            <selectPersonnel
              class="selectPersonnelCom"
              name="请选择员工"
              :changeId="true"
              :num="1"
              v-model="screenData.employeeIdList"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="企业标签:">
            <!-- <a-input v-model="searchInfo.name" placeholder="请输入要搜索的会员姓名"></a-input> -->
            <!-- :maxTagPlaceholder="`+${searchInfo.changeCauseList.length - 2}`" -->
            <a-select
              :allowClear="true"
              class="pickSelectClass"
              placeholder="请选择"
              mode="multiple"
              v-model="screenData.changeCauseList"
              :maxTagCount="2"
            >
              <!-- <a-select-option v-for="item in reasonList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :lg="6">
          <a-form-item label="开卡方式:">
            <!-- :maxTagPlaceholder="`+${searchInfo.changeCauseList.length - 2}`" -->
            <a-select
              :allowClear="true"
              class="pickSelectClass"
              placeholder="请选择"
              mode="multiple"
              v-model="screenData.changeCauseList"
              :maxTagCount="2"
            >
              <!-- <a-select-option v-for="item in reasonList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="开卡时间:">
            <a-range-picker
              class="pickTimeClass"
              v-model="detailDateArray"
              :defaultPickerValue="defaultDateArray">
            </a-range-picker>
            <!-- <a-input v-model="searchInfo.phone" placeholder="请输入要搜索的手机号"></a-input> -->
          </a-form-item>
        </a-col>
        <a-col :lg="6">
          <a-form-item label="是否为企微好友:">
            <!-- :maxTagPlaceholder="`+${searchInfo.changeCauseList.length - 2}`" -->
            <a-select
              :allowClear="true"
              class="pickSelectClass"
              placeholder="请选择"
              mode="multiple"
              v-model="screenData.changeCauseList"
              :maxTagCount="2"
            >
              <!-- <a-select-option v-for="item in reasonList" :key="item.code" :value="item.code">{{ item.name }}</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- <a-row :justify="`end`" :gutter="16">
                <a-col>
                    <a-button
                        type="primary"
                        style="margin: 0 10px;"
                    >查询</a-button>
                    <a-button
                        style="margin-right: 10px;"
                    >重置</a-button>
                </a-col>
            </a-row> -->
      <div class="searchButtonWrapper">
        <a-button
          type="primary"
          style="margin: 0 10px;"
          @click="goSearchData"
        >查询</a-button>
        <a-button
          style="margin-right: 10px;"
          @click="goResetData"
        >重置</a-button>
      </div>
    </a-form>
    <div class="tableWrapper">
      <div class="topTableDiv">
        <div class="topDivText">
          {{ `共${tableDataList.length}个客户,已选择${selectedKeyList.length}个客户` }}
        </div>
        <div class="topRightDiv">
          <a-button style="margin: 0 10px;">导出</a-button>
          <a-button style="margin: 0 10px;">批量打标签</a-button>
          <a-button style="margin: 0 10px;">批量移除标签</a-button>
        </div>
      </div>
      <a-table
        :loading="tableLoading"
        :row-key="record => record.id"
        :data-source="tableDataList"
        :columns="tableColumns"
        :pagination="tablePagination"
        :row-selection="{ selectedRowKeys: selectedKeyList, onChange: onSelectionChange }"
        @change="handleTableChange"
        class="tableBox"
        :scroll="{ x: 1500}">
        <!-- <div slot="state" slot-scope="text, record, index">
        <template>
          <div class="isOn">
          <a-switch
            v-permission="'/sopRegular/updateState@post'"
            :checked="record.state === 1 ? true : false"
            @change="sopItemChange(record, index)"
            checked-children="开"
            un-checked-children="关"
          />
          </div>
        </template>
        </div> -->
        <div slot="sysRuleType" slot-scope="text, record">
          <template>
            {{ record.sysRuleType === '1' ? '系统类型' : '' }}
          </template>
        </div>
        <div slot="showExecuteVal" slot-scope="text">
          <a-popover title="执行字段">
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
        <div slot="state" slot-scope="text, record">
          <template>
            <!-- {{ record.sysRuleType === '1' ? '系统类型' : ''}} -->
            <a-tag color="#1890ff" v-if="record.state === '1'">已启用</a-tag>
            <a-tag color="#d1d1d1" v-if="record.state === '0'">未启用</a-tag>
          </template>
        </div>
        <div slot="options">
          <template>
            <div style="display: flex;justify-content: space-between;">
              <a-button type="link" v-permission="'/creditsRule/setCreditsRule@post'">设置</a-button>
            </div>
          </template>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackendIndex',
  data () {
    return {
    // 表格加载动画
      tableLoading: false,
      // 选中的数组
      selectedKeyList: [],
      // 表格数组
      tableDataList: [],
      // 表格表头
      tableColumns: [
        {
          title: '规则名称',
          dataIndex: 'ruleName',
          align: 'center',
          width: 200
        },
        {
          title: '积分余额',
          dataIndex: 'integral',
          align: 'center',
          sortDirections: ['descend', 'ascend'],
          sorter: true,
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'state',
          align: 'center',
          scopedSlots: { customRender: 'state' },
          width: 200
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      // 表格翻页信息
      // 模板页面分页对象
      tablePagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      // 搜索对象
      screenData: {},
      detailDateArray: [],
      defaultDateArray: ['YYYY-MM-DD', 'YYYY-MM-DD']
    }
  },

  created () {
    // this.getData()
  },

  methods: {
    // 获取数据列表
    async getData () {
      this.tableLoading = true
      const params = {
        page: this.tablePagination.current,
        perPage: this.tablePagination.pageSize,
        ...this.screenData
      }
      console.log(params)
      // await getCustomerIntegralApi(params).then(response => {
      //   this.tableLoading = false
      //   console.log(response, '获取员工积分列表')
      //   this.tableData = response.data.list
      //   this.$set(this.tablePagination, 'total', Number(response.data.page.total))
      //   if (this.tableData.length === 0) {
      //     // 列表中没有数据
      //     if (this.tablePagination.total !== 0) {
      //       // 总数据有,但当前页没有
      //       // 重新将页码换成1
      //       this.$set(this.tablePagination, 'current', 1)
      //       this.getData()
      //     } else {
      //       // 是真没有数据
      //     }
      //   }
      // }).catch(() => {
      //   this.tableLoading = false
      // })
    },
    // 单击某一行的回调
    onSelectionChange (selectedRowKeys) {
      console.log(selectedRowKeys, '单击某一行的回调')
      // this.sendArray = record.listTaskInfo
      // const tempIdArray = []
      // tempIdArray.push(record.id)
      // this.selectedList = Object.assign([], tempIdArray)
      this.selectedKeyList = selectedRowKeys
    },
    // 查询数据
    goSearchData () {
      this.$set(this.tablePagination, 'current', 1)
      this.getData()
    },
    // 重置数据
    goResetData () {
      this.$set(this.tablePagination, 'current', 1)
      this.getData()
    },
    // 导出员工积分
    exportData () {
      const params = {
        ...this.screenData,
        page: this.tablePagination.current,
        perPage: this.tablePagination.pageSize
      }
      console.log(params, 'params')
      //   exportCustomerIntegralApi(params).then(response => {
      // 	// console.log(response, '导出成功')
      // 	// 导出的文件名
      // 	callDownLoadByBlob(response, '员工积分')
      //   })
    },
    // 表格监听事件
    handleTableChange ({ current, pageSize }, filters, sorter) {
      let currentTypeText = ''
      console.log(sorter, 'sorter')
      // 获取点击的是那一列排序
      currentTypeText = sorter.columnKey + 'Sort'
      // debugger
      if (sorter.order) {
        // this.$set(this.screenData, 'orderBySortCode', currentTypeText)
        if (sorter.order === 'ascend') {
        // 正序
          this.$set(this.screenData, `${currentTypeText}`, 'asc')
        } else {
        // 逆序
          this.$set(this.screenData, `${currentTypeText}`, 'desc')
        }
      } else {
        // 无需排序
        this.$delete(this.screenData, `${currentTypeText}`)
      }
      for (const key in this.screenData) {
        if (key.indexOf('Sort') !== -1 && key !== currentTypeText) {
        // key带Sort,并且key不是当前点击的key
          this.$delete(this.screenData, `${key}`)
        }
      }
      this.tablePagination.current = current
      this.tablePagination.pageSize = pageSize
      this.getData()
      // this.pagination.current = current
      // this.pagination.pageSize = pageSize
      // console.log(sorter, 'sorter')
      // if (sorter.order) {
      //   if (sorter.order === 'ascend') {
      //     this.sorter = 'asc'
      //   } else {
      //     this.sorter = 'desc'
      //   }
      // } else {
      //   this.sorter = ''
      // }
      // this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
.searchButtonWrapper {
    display: flex;
    justify-content: flex-end;
    padding-right: 30px;
}
.topTableDiv {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .topDivText {
        font-size: 14px;
    }
}
</style>
