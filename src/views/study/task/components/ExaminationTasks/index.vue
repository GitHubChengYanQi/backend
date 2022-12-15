<template>
  <div>
    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="课程名称">
          <a-input v-model="screenData.name" placeholder="请输入课程名称" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item
          label="创建时间">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item
          label="创建人">
          <a-input v-model="screenData.user" style="width: 200px" placeholder="请输入创建人名称" :maxLength="10"></a-input>
        </a-form-item>

        <a-form-item
          label="考试类别">
          <a-select
            :options="[{value:0,label:'全部'},{value:1,label:'是'},{value:2,label:'否'}]"
            v-model="screenData.gender1"
            style="width: 200px"
            placeholder="请选择关联考试"
          ></a-select>
        </a-form-item>

        <a-form-item>
          <div>
            <a-button @click="reset">重置</a-button>
            <a-button
              type="primary"
              ghost
              @click="() => { this.pagination.current = 1; this.getTableData() }"
            >
              查询
            </a-button>
            <a-button type="primary" @click="reset">导出</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <div class="my-table-wrapper">
      <div class="btn">
        <SelectExamination />
      </div>
      <a-table
        class="my-table"
        :columns="columns"
        :data-source="tableData"
        :rowKey="record => record.id"
        :pagination="pagination"
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
            <div class="my-space">
              <a-button class="warnButton">详情</a-button>
              <a-popconfirm
                disabled
                title="是否确认删除"
                ok-text="确认"
                cancel-text="取消"
                @confirm="deleteAttribute(record.id)"
              >
                <a-button class="delButton" @click="$message.warning('课件已被xxx，xxx课程引用，不可删除');">删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>

import { message } from 'ant-design-vue'
import SelectExamination from './components/SelectExamination'

export default {
  components: { SelectExamination },
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
          title: '课程名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '试卷名称',
          dataIndex: 'introduction',
          scopedSlots: { customRender: 'introduction' },
          align: 'center'
        },
        {
          title: '答卷时长',
          dataIndex: 'class',
          align: 'center'
        },
        {
          title: '考核员工',
          dataIndex: 'tag',
          scopedSlots: { customRender: 'tag' },
          align: 'center'
        },
        {
          title: '考试类别',
          dataIndex: 'ta1g',
          scopedSlots: { customRender: 'tag' },
          align: 'center'
        },
        {
          title: '考核总人数',
          dataIndex: 'total',
          align: 'center',
          sorter: true
        },
        {
          title: '未通过人数',
          dataIndex: '1',
          align: 'center',
          sorter: true
        },
        {
          title: '通过人数',
          dataIndex: '2',
          align: 'center',
          sorter: true
        },
        {
          title: '通过率',
          dataIndex: '3',
          align: 'center',
          sorter: true
        },
        {
          title: '参与人数',
          dataIndex: '4',
          align: 'center',
          sorter: true
        },
        {
          title: '参与率',
          dataIndex: '5',
          align: 'center',
          sorter: true
        },
        {
          title: '创建人',
          align: 'center'
        },
        {
          title: '创建时间',
          align: 'center',
          sorter: true
        },
        {
          title: '操作',
          width: 200,
          align: 'center',
          dataIndex: 'action',
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
    download () {
      if (this.checkIds.length === 0) {
        message.warn('请选择想要下载的文件！')
      } else {
        console.log(this.checkIds)
      }
    },
    uploadVisibleOpen () {
      this.imgUrl = ''
      this.imgName = ''
      this.uploadVisible = true
    },
    uploadSuccess (data = []) {
      const file = data[0] || {}
      console.log(file)
      this.imgUrl = file.fullPath
      this.imgName = file.name
    },
    setVisible (visible) {
      this.fileName = visible
      this.visible = true
    },
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

<style lang="less" scoped>

.modal {
  /deep/ .ant-modal-footer {
    text-align: center;
  }
}

.my-table-search {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.table-wrapper {

  .news {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
    }

    .weixin {
      color: #86CE76
    }
  }
}
</style>
