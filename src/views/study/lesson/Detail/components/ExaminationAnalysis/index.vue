<template>
  <div>
    <a-card :bordered="false" class="table-search">
      <a-form layout="inline">
        <a-form-item
          label="考试名称：">
          <a-input v-model="screenData.name" placeholder="请输入考试名称" :maxLength="20"></a-input>
        </a-form-item>
        <a-form-item
          label="考试类别：">
          <a-select
            :options="[{value:0,label:'全部'},{value:1,label:'是'},{value:2,label:'否'}]"
            v-model="screenData.gender1"
            style="width: 200px"
            placeholder="请选择考试类别"
          ></a-select>
        </a-form-item>
        <a-form-item>
          <div class="my-space">
            <a-button
              type="primary"
              @click="() => { this.pagination.current = 1; this.getTableData() }"
            >
              查询
            </a-button>
            <a-button @click="reset">重置</a-button>
            <a-button @click="reset">导出</a-button>
          </div>
        </a-form-item>
      </a-form>
      <div class="table-wrapper">
        <a-table
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.id"
          :pagination="pagination"
          :row-selection="{ onChange: selectChange }"
          @change="handleTableChange">
          <div slot="name" slot-scope="text, record">
            <div class="user-info flex">
              <div class="avatar mr12">
                <a-icon type="file-word" style="font-size: 24px" />
              </div>
              <div class="nickname">
                <a-tooltip>
                  <template slot="title">
                    {{ record.name }}
                  </template>
                  {{ record.name }}
                </a-tooltip>
              </div>
            </div>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div>
                <a-button type="link">查看详情</a-button>
              </div>
            </template>
          </div>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      imgUrl: '',
      imgName: '',
      uploadVisible: false,
      fileName: String,
      visible: false,
      screenData: {
        gender: 3,
        addWay: '全部',
        fieldId: 0
      },
      columns: [
        {
          title: '考试名称',
          dataIndex: 'name',
          align: 'center',
          width: '200px'
        },
        {
          title: '试卷名称',
          width: '200px',
          dataIndex: 'size',
          align: 'center'
        },
        {
          title: '考试类别',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '答卷时长',
          dataIndex: 'user',
          align: 'center'
        },
        {
          title: '试卷总分',
          dataIndex: '1',
          align: 'center'
        },
        {
          title: '考试人数',
          dataIndex: '5',
          align: 'center',
          sorter: true
        },
        {
          title: '通过人数',
          dataIndex: '6',
          align: 'center',
          sorter: true
        },
        {
          title: '未通过人数',
          dataIndex: '7',
          align: 'center',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      checkIds: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    handleOk () {
      console.log('ok')
    },
    deleteAttribute (id) {
      console.log(id)
    },
    getTableData () {
      // const params = {
      //   keyWords: this.screenData.keyWords,
      //   remark: this.screenData.remark,
      //   fieldId: this.screenData.fieldId,
      //   fieldType: Number(this.fieldType),
      //   fieldValue: this.fieldTypeText ? this.screenData.fieldValue : this.optionsSelect,
      //   gender: this.screenData.gender,
      //   addWay: this.screenData.addWay,
      //   roomId: this.roomIdList.join(','),
      //   groupNum: this.groupNum,
      //   employeeId: this.employeeIdList,
      //   startTime: this.screenData.startTime,
      //   endTime: this.screenData.endTime,
      //   businessNo: this.screenData.businessNo,
      //   page: this.pagination.current,
      //   perPage: this.pagination.pageSize
      // }
      // workContactList(params).then(res => {
      //   this.roomIdList = []
      //   this.employeeIdList = ''
      //   this.employees = []
      //   this.tableData = res.data.list
      //   this.pagination.total = res.data.page.total
      // })
      this.tableData = [{
        id: '123',
        name: '需求文档.dox',
        size: '856.6kb',
        createTime: '2022-12-05',
        user: 'me'
      }]
      this.pagination.total = 666
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    selectChange (row) {
      this.checkIds = row
    },
    // 群聊筛选
    // 重置
    reset () {
      this.screenData = {
        gender: 3,
        addWay: '全部',
        fieldId: 0
      }
    }
  }
}
</script>
