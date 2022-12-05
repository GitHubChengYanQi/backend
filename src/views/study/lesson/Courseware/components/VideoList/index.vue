<template>
  <div>
    <a-card :bordered="false" class="table-search">
      <a-form layout="inline">

        <a-form-item
          label="视频名称：">
          <a-input v-model="screenData.name" placeholder="请输入视频名称" :maxLength="20"></a-input>
        </a-form-item>

        <a-form-item
          label="上传时间：">
          <a-range-picker v-model="screenData.time" />
        </a-form-item>

        <a-form-item
          label="上传人：">
          <a-input v-model="screenData.user" style="width: 200px" placeholder="请输入创建人名称" :maxLength="10"></a-input>
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
          </div>
        </a-form-item>
      </a-form>
      <div class="table-wrapper">
        <div class="btn">
          <a-button @click="uploadVisibleOpen(false)">
            上传视频
          </a-button>
        </div>
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
          <div slot="introduction" slot-scope="text">
            <div class="introduction">
              <a-tooltip>
                <template slot="title">
                  {{ text }}
                </template>
                {{ text }}
              </a-tooltip>
            </div>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div>
                <a-button type="link" @click="uploadVisibleOpen(true)">编辑</a-button>
                <a-button type="link">预览</a-button>
                <a-popconfirm
                  disabled
                  title="是否确认删除"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deleteAttribute(record.id)"
                >
                  <a-button type="link" @click="$message.warning('课件已被xxx，xxx课程引用，不可删除');">删除</a-button>
                </a-popconfirm>
              </div>
            </template>
          </div>
        </a-table>
      </div>
    </a-card>

    <a-modal
      destroyOnClose
      v-model="uploadVisible"
      title="上传视频"
      :okButtonProps="{props: {disabled:!uploadDefine}, on: {}}"
      @ok="handleOk"
    >
      <div style="text-align: center">
        <vpload
          @successDefine="uploadSuccess"
          :file-type="3"></vpload>
        <div>(视频上传大小不超过10M，支持MP4格式)</div>
        <div v-if="uploadDefine" style="color: red">上传成功</div>
      </div>
    </a-modal>
  </div>
</template>

<script>

import upload from '../upload'
import vpload from '../vpload'
import { message } from 'ant-design-vue'

export default {
  data () {
    return {
      uploadDefine: '',
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
          title: '标题',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center',
          width: '200px'
        },
        {
          title: '大小',
          width: '200px',
          dataIndex: 'size',
          align: 'center'
        },
        {
          title: '上传时间',
          dataIndex: 'createTime',
          align: 'center',
          sorter: true
        },
        {
          title: '上传人',
          dataIndex: 'user',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          width: 270,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      checkIds: [],
      upLoadRes: {},
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
    uploadVisibleOpen (edit) {
      if (edit) {
        message.warn('课件已被xxx，xxx课程引用，不可编辑')
      } else {
        this.uploadDefine = false
        this.uploadVisible = true
      }
    },
    uploadSuccess (data) {
      this.upLoadRes.voicePath = data.path
      this.upLoadRes.voiceName = data.name
      this.uploadDefine = true
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
  },
  components: { upload, vpload }
}
</script>

<style lang="less" scoped>
.table-wrapper {

  .btn {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;

    .ant-btn {
      margin-right: 10px;
    }
  }

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

