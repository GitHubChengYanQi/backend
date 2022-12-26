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
      <a-button type="primary">
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
      if (file.status === 'uploading') {
        this.loading = true
        return
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
        this.$emit('upload')
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
<style lang="less">

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
