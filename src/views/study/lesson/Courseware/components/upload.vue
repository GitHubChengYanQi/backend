<template>
  <a-upload
    class="my-upload"
    name="file"
    list-type="picture"
    :class="btnType ? 'avatar-uploader' : 'btn-type'"
    :headers="headers"
    :file-list="fileList"
    method="post"
    :show-upload-list="false"
    :data="oss"
    :action="oss.host"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <slot>
      <a-button :loading="loading" type="primary">
        上传文件
      </a-button>
    </slot>
  </a-upload>
</template>
<script>
import storage from 'store'
import { mediaGetToken } from '@/api/study/courseWare'

export default {
  props: {
    maxSize: {
      type: Number,
      default () {
        return 100
      }
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    btnType: {
      type: Boolean,
      default: true
    },
    defaultFileTypeList: {
      type: Array,
      default () {
        return ['jpg', 'jpeg']
      }
    }
  },
  data () {
    return {
      oss: {},
      fileSize: 0,
      fileList: [],
      loading: false,
      FileTypeArr: []
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
    this.FileTypeArr = this.defaultFileTypeList
    this.fileList = this.value
  },
  methods: {
    handleChange ({ fileList, file, event }) {
      this.$emit('on-percent', event ? event.percent : 0)
      this.fileList = fileList.length > 0 ? [fileList[fileList.length - 1]] : []

      if (this.fileList.length === 0) {
        this.$emit('success', [])
      }
      if (file.status === 'done') {
        this.$emit('success', this.fileList.map(item => ({
          ...item,
          fullPath: `${this.oss.host || ''}/${this.oss.key || ''}`
        })))
        this.loading = false
      }
      if (file.status === 'error') {
        if (file.response) {
          const data = file.response
          this.$message.error(data.msg)
        }
        this.loading = false
      }
    },
    beforeUpload (file) {
      const fileSuffix = this._getFileSuffix(file.name).toLowerCase()
      const fileMaxSize = file.size / 1024 / 1024 < this.maxSize
      const ary = this.FileTypeArr
      const flag = ary.includes(fileSuffix)
      if (!flag) {
        setTimeout(() => {
          this.fileList = []
        }, 0)
        this.$message.error(`您只能上传以下类型： ${ary.join(',')}`)
        return false
      }

      if (!fileMaxSize) {
        setTimeout(() => {
          this.fileList = []
        }, 0)
        this.$message.error('上传文件过大')
      }
      const res = flag && fileMaxSize
      if (res) {
        this.loading = true
        this.$emit('upload', file)
        return new Promise((resolve, reject) => {
          mediaGetToken({ type: file.name }).then((res) => {
            this.oss = { ...res.data, key: res.data.key }
            resolve()
          }).catch(() => {
            this.loading = false
            reject(new Error('获取ossToken失败！'))
          })
        })
      } else {
        return false
      }
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

.my-upload {
  //width: 100%;
  .ant-btn {
    margin-left: 12px;
    border-radius: 8px
  }
}

.avatar-uploader > .ant-upload {
  width: 100%;
  //height: 100px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.img-wrapper {
  .img {
    width: 100px;
    height: 100px;
  }
}

.btn-type {
  width: 0;
  height: 0;

  .ant-upload {
    width: 0;
    height: 0;
    border: 0;
    background: #fff;
  }
}
</style>
