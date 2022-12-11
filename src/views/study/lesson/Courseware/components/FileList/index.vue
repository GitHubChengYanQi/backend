<template>
  <div>
    <a-card :bordered="false" class="my-table-search">
      <a-form layout="inline">

        <a-form-item
          label="文件名称：">
          <a-input v-model="screenData.name" placeholder="请输入文件名称" :maxLength="20"></a-input>
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
        <a-icon type="question-circle" />
        <upload
          @upload="upload"
          @on-percent="onPercent"
          :default-file-type-list="['jpg','png','ppt','pptx','pdf','doc','docx']"
          style="display: inline-block"
          @success="uploadSuccess"
          :file-type="1" />
        <a-button type="primary" ghost @click="download">
          批量下载
        </a-button>
      </div>
      <a-spin :spinning="loading">
        <a-table
          class="my-table"
          :columns="columns"
          :data-source="tableData"
          :rowKey="record => record.courseWareId"
          :pagination="pagination"
          :row-selection="{ onChange: selectChange }"
          @change="handleTableChange">
          <div slot="fileName" slot-scope="text">
            <div class="user-info flex">
              <div class="avatar mr12">
                <a-icon type="file-word" style="font-size: 24px" />
              </div>
              <div class="nickname">
                <a-tooltip>
                  <template slot="title">
                    {{ text }}
                  </template>
                  {{ text }}
                </a-tooltip>
              </div>
            </div>
          </div>
          <div slot="action" slot-scope="text, record">
            <template>
              <div class="my-space">
                <a-button class="warnButton" @click="setVisible(record.name)">重命名</a-button>
                <a-button class="successButton">预览</a-button>
                <a-button class="linkButton">下载</a-button>
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
      </a-spin>
    </div>

    <a-modal centered v-model="visible" title="修改名称" @ok="handleOk" class="my-modal">
      <a-input v-model="fileName"></a-input>
    </a-modal>

    <a-modal
      centered
      destroyOnClose
      v-model="uploadVisible"
      title="上传中"
      :footer="[]"
    >
      <a-progress :percent="percent" />
    </a-modal>
  </div>
</template>

<script>

import upload from '../upload'
import { message } from 'ant-design-vue'
import { courseWareAdd, courseWareList } from '@/api/study/courseWare'
import moment from 'moment'

export default {
  data () {
    return {
      loading: false,
      percent: 0,
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
          title: '文件名称',
          dataIndex: 'fileName',
          scopedSlots: { customRender: 'fileName' },
          align: 'center',
          width: '200px'
        },
        {
          title: '大小',
          width: '200px',
          dataIndex: 'size',
          align: 'center',
          customRender: (text) => {
            return text + 'kb'
          }
        },
        {
          title: '上传时间',
          dataIndex: 'createdAt',
          customRender: (text) => {
            return (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-')
          },
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
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    upload () {
      this.percent = 0
      this.uploadVisible = true
    },
    onPercent (percent) {
      if (percent > this.percent) {
        this.percent = percent
      }
    },
    download () {
      if (this.checkIds.length === 0) {
        message.warn('请选择想要下载的文件！')
      } else {
        console.log(this.checkIds)
      }
    },
    uploadSuccess (data = []) {
      setTimeout(() => {
        this.uploadVisible = false
        this.percent = 0
      }, 1000)
      const file = data[0] || {}
      const fileSize = file.size / 1024
      courseWareAdd({
        courseWareType: 'file',
        fileName: file.name,
        fileType: file.mimeType,
        suffix: file.name.split('.')[file.name.split('.').length - 1],
        size: fileSize,
        mediaUrl: file.fullPath
      }).then(() => {
        message.success('上传成功！')
        this.getTableData()
      })
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
      this.loading = true
      courseWareList({}, {
        limit: this.pagination.pageSize,
        page: this.pagination.current
      }).then(res => {
        this.roomIdList = []
        this.employeeIdList = ''
        this.employees = []
        this.tableData = res.data
        this.pagination.total = res.count
      }).finally(() => {
        this.loading = false
      })
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
  components: { upload }
}
</script>

<style lang="less" scoped>

.user-info {
  text-align: center;
  justify-content: center;

  img {
    max-height: 33px;
    max-width: 33px;
    border-radius: 2px;
  }

  .nickname {
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
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
