<template>
  <a-upload
    name="file"
    :headers="headers"
    :multiple="true"
    method="post"
    :show-upload-list="false"
    :action="uploadApi"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <a-button> <a-icon type="upload" /> 上传 </a-button>
  </a-upload>
</template>
<script>
import storage from 'store'

export default {
  props: {
    fileType: {
      type: Number || Array,
      default: 1
    }
  },
  data () {
    return {
      loading: false,
      FileTypeArr: [
        '',
        ['jpg', 'png', 'jpeg'],
        ['amr'],
        ['mp4'],
        ['doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'pdf', 'xmind', 'zip', 'rar']
      ],
      uploadApi: process.env.VUE_APP_API_BASE_URL + '/common/upload'
    }
  },
  computed: {
    headers () {
      const token = storage.get('ACCESS_TOKEN')
      return {
        Accept: `application/json`,
        Authorization: token
      }
    }
  },
  created () {
  },
  methods: {
    handleChange (info) {
      console.log(info)
      if (info.file.status === 'done') {
        const data = info.file.response.data
        this.$emit('successDefine', data)
      }
      if (info.file.status === 'error') {
        if (info.file.response) {
          const data = info.file.response
          this.$message.error(data.msg)
        }
      }
    },
    beforeUpload (file) {
      const fileSuffix = this._getFileSuffix(file.name).toLowerCase()
      const file2M = file.size / 1024 / 1024 < 2
      const file10M = file.size / 1024 / 1024 < 10
      const file20M = file.size / 1024 / 1024 < 20
      let ary = []
      if (this.fileType instanceof Array) {
        this.fileType.map(item => {
          ary.concat(this.FileTypeArr[item])
        })
      } else {
        ary = this.FileTypeArr[this.fileType]
      }
      const flag = ary.includes(fileSuffix)
      if (!flag) {
        this.$message.error(`您只能上传以下类型： ${ary.join(',')}`)
        return false
      }
      // filetype === 2, 最大上传 2M
      if (this.fileType === 2) {
        if (!file2M) {
          this.$message.error('上传文件过大')
        }
        return flag && file2M
      }

      // filetype === 3, 最大上传 10M
      if (this.fileType === 3) {
        if (!file10M) {
          this.$message.error('上传文件过大')
        }
        return flag && file10M
      }

      // filetype === 4, 最大上传 20M
      if (this.fileType === 4) {
        if (!file20M) {
          this.$message.error('上传文件过大')
        }
        return flag && file20M
      }

      if (!file2M) {
        this.$message.error('上传文件过大')
      }
      return flag && file2M
    },
    // 获取文件后缀
    _getFileSuffix (imgName) {
      return imgName.substring(imgName.lastIndexOf('.') + 1)
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

</style>
