<template>
  <div>
    <a-button style="width: 200px;border-radius: 8px" class="add" @click="visible = true">
      <a-icon type="plus" />
      添加
    </a-button>

    <div class="table" :hidden="tableView.length === 0">
      <el-table
        :data="tableView"
        row-key="courseWareId"
        style="width: 100%"
        border
        header-row-class-name="header"
      >
        <el-table-column prop="index" width="70">
          <template slot-scope="{ row, column, $index}">
            目录{{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="sortNo" label="标题" minWidth="200">
          <template slot-scope="{ row}">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img height="50" v-if="['jpg','png'].includes(row.suffix)" :src="row.coverImageUrl || row.mediaUrl">
                <a-icon v-if="['doc','docx'].includes(row.suffix)" type="file-word" style="font-size: 24px" />
                <a-icon v-if="['ppt','pptx'].includes(row.suffix)" type="file-ppt" style="font-size: 24px" />
                <a-icon v-if="['pdf'].includes(row.suffix)" type="file-pdf" style="font-size: 24px" />
              </div>
              <div class="nickname">
               <a-tooltip overlayClassName="myTooltip">
                  <template slot="title">
                    {{ row.fileName || row.title }}
                  </template>
                  {{ row.fileName || row.title }}
                </a-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="学习时长" width="418">
          <template slot-scope="{row}">
            <div class="my-space">
              <div class="time" style="gap: 0">
                <a-input-number v-model="row.hour" id="inputNumber" />
                <span class="unit">时</span>
              </div>
              <div class="time" style="gap: 0">
                <a-input-number v-model="row.minute" id="inputNumber" />
                <span class="unit">分</span>
              </div>
              <div class="time" style="gap: 0">
                <a-input-number v-model="row.second" id="inputNumber" />
                <span class="unit">秒</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="!hiddenExam" align="center" prop="action" label="关联考试" minWidth="200">
          <template slot-scope="{row}">
            <SelectExamination
              v-model="row.exam"
              placeholder="请选择关联考试"
            />
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" width="180">
          <template slot-scope="{row}">
            <div class="my-space" style="cursor: pointer">
              <a-button class="linkButton" :disabled="row.courseWareType === 'file'" @click="openPreview(row)">预览</a-button>
              <a-button class="delButton" @click="remove(row)">删除</a-button>
              <div class="my-handle">
                <DragIcon :width="24" />
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Preview
      :title="previewTitle"
      :preview="preview"
      @close="preview = false"
      :content="content"
    >
      <div>
        <img v-if="previewType === 'text'" class="img" :src="url" alt="avatar" width="283" />
        <video v-if="previewType === 'video'" :src="url" style="width: 100%" controls></video>
      </div>
    </Preview>

    <a-modal
      :footer="null"
      destroyOnClose
      :width="1200"
      title="选择考试"
      :visible="visible"
      @cancel="visible = false"
    >
      <a-tabs v-model="key" class="tabs">
        <a-tab-pane key="1" tab="文件" />
        <a-tab-pane key="2" tab="视频" />
        <a-tab-pane key="3" tab="图文" />
      </a-tabs>

      <FileList
        :selectRows="courseWares['fileList']"
        select
        v-if="key === '1'"
        @selectRows="(rows)=>selectRows('fileList',rows)"
      />
      <VideoList
        :selectRows="courseWares['videoList']"
        select
        v-if="key === '2'"
        @selectRows="(rows)=>selectRows('videoList',rows)"
      />
      <ImageTextList
        :selectRows="courseWares['imageTextList']"
        select
        v-if="key === '3'"
        @selectRows="(rows)=>selectRows('imageTextList',rows)"
      />

      <div style="text-align: center">
        <a-button
          type="primary"
          style="border-radius: 8px"
          class="add"
          @click="submit"
        >
          确定
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import DragIcon from '../../../../components/DragIcon/index'
import FileList from '../../../Courseware/components/FileList/index'
import VideoList from '../../../Courseware/components/VideoList/index'
import ImageTextList from '../../../Courseware/components/ImageTextList/index'
import SelectExamination from '../SelectExamination/index'
import Preview from '../../../../components/Preview'

export default {
  props: {
    value: Array,
    hiddenExam: Boolean
  },
  components: { DragIcon, FileList, VideoList, ImageTextList, SelectExamination, Preview },
  data () {
    return {
      content: '',
      url: '',
      previewTitle: '',
      preview: false,
      previewType: '',
      courseWares: {},
      key: '1',
      tableData: [],
      name: '',
      visible: false,
      tableView: []
    }
  },
  created () {
    if (this.value.length <= 0) {
      return
    }
    const tableView = this.value.map(item => ({
      ...item,
      ...(item.courseWareResult || {}),
      exam: item.examResult
    }))
    this.courseWares = {
      fileList: tableView.filter(item => item.courseWareType === 'file'),
      videoList: tableView.filter(item => item.courseWareType === 'video'),
      imageTextList: tableView.filter(item => item.courseWareType === 'text')
    }
    this.tableView = tableView
  },
  watch: {
    tableView: {
      handler () {
        this.$emit('change', this.tableView.map((item) => ({ ...item, examId: item.exam && item.exam.examId })))
      },
      deep: true
    }
  },
  mounted () {
    // 获取 tbody 节点
    const tbody = document.querySelector('.el-table__body-wrapper tbody')
    // 拖拽排序
    Sortable.create(tbody, {
      delay: 0,
      handle: '.my-handle',
      animation: 300, // 拖拽延时，效果更好看
      onEnd: async (evt) => {
        this.tableView.splice(evt.newIndex, 0, this.tableView.splice(evt.oldIndex, 1)[0])
        // 接口(param).then((res) => {})
      }
    })
  },
  methods: {
    openPreview (record) {
      this.previewType = record.courseWareType
      this.preview = true
      this.previewTitle = record.title
      this.content = record.note
      this.url = record.mediaUrl || record.coverImageUrl
    },
    remove (row) {
      this.courseWares = {
        fileList: (this.courseWares.fileList || []).filter(item => item.courseWareId !== row.courseWareId),
        videoList: (this.courseWares.videoList || []).filter(item => item.courseWareId !== row.courseWareId),
        imageTextList: (this.courseWares.imageTextList || []).filter(item => item.courseWareId !== row.courseWareId)
      }
      this.tableView = this.tableView.filter(item => item.courseWareId !== row.courseWareId)
    },
    selectRows (type, rows) {
      this.courseWares[type] = rows
    },
    submit () {
      this.tableView = [
        ...(this.courseWares.fileList || []),
        ...(this.courseWares.videoList || []),
        ...(this.courseWares.imageTextList || [])
      ]
      this.visible = false
    },
    selectChange (ids, rows) {
      this.selectRows = rows
    },
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.sorter = sorter
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
.my-space {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-search {
  .ant-form-inline {
    .ant-form-item {
      margin-bottom: 24px;
    }
  }
}

.warnButton {
  color: rgba(255, 152, 0, 1);
  background-color: rgba(252, 192, 104, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.linkButton {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.delButton {
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.successButton {
  color: #01ba77;
  background-color: rgba(1, 186, 119, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.my-table-search {
  border-radius: 8px;

  .ant-form-inline .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-input,
  .ant-select-selection,
  .ant-time-picker-input {
    border-radius: 8px !important;
  }

  .ant-btn {
    margin-right: 10px;
    border-radius: 8px;
  }
}

.my-table-wrapper {
  border-radius: 8px;

  .btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 24px;

    > .ant-btn {
      margin-left: 12px;
      border-radius: 8px;
    }
  }
}

.my-table {
  background-color: #fff;

  .ant-table-pagination {
    padding: 24px;
    float: none;
    text-align: center;
  }
}

.myTooltip {
  background-color: #fff;

  .ant-tooltip-inner {
    color: #000;
    background-color: #fff;
  }

  .ant-tooltip-arrow::before {
    background-color: #fff;
  }
}

.myLabelBox {
  width: 400px;

  span {
    margin-bottom: 10px;
  }
}

.my-modal {
  .ant-modal-footer {
    padding: 24px;
    text-align: center;

    .ant-btn {
      padding: 0 24px;
      border-radius: 8px;
    }

    .ant-modal-footer button + button {
      margin-left: 24px;
    }
  }
}

.user-info {

  img {
    border-radius: 2px;
  }

  .nickname {
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.table {
  margin-top: 12px;

  .el-table--border {
    border-radius: 8px;
  }

  th {
    background-color: #f5f6fa !important;
    text-align: center !important;
    padding: 0 !important;
  }

}

.time {
  display: flex;
}

.unit {
  padding: 0 11px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  border-left: none;
}

.my-handle {
  line-height: 0;
}
</style>
