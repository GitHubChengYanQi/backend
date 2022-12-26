<template>
  <a-upload
    name="file"
    list-type="picture-card"
    :class="'img-avatar-uploader'"
    :headers="headers"
    method="post"
    :show-upload-list="false"
    :data="oss"
    :action="oss.host"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <div>
      <div v-if="value && !loading" class="img-wrapper">
        <img v-if="fileType === 1" class="img" :src="value" alt="avatar" />
        <div v-if="fileType === 3">
          <video :src="value" style="width: 200px" controls></video>
          <a-button type="link">重新上传</a-button>
        </div>
      </div>
      <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
      </div>
    </div>
  </a-upload>
</template>
<script>
import storage from 'store'
import { mediaGetToken } from '@/api/study/courseWare'

export default {
  props: {
    fileSize: {
      type: Number,
      default: 10
    },
    value: {
      type: String,
      default: ''
    },
    fileType: {
      type: Number || Array,
      default: 1
    },
    btnType: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      oss: {},
      loading: false,
      // imageUrl: '',
      FileTypeArr: [
        '',
        ['jpg', 'png', 'jpeg'],
        ['mp3', 'amr'],
        ['mp4'],
        ['doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'pdf', 'Xmind']
      ]
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
      if (info.file.status === 'done') {
        this.$emit('change', `${this.oss.host}/${this.oss.key}`)
        this.$emit('success', info.file)
        this.loading = false
      }
      if (info.file.status === 'error') {
        if (info.file.response) {
          const data = info.file.response
          this.$message.error(data.msg)
        }
        this.loading = false
      }
    },
    beforeUpload (file) {
      const fileSuffix = this._getFileSuffix(file.name).toLowerCase()
      const fileType = file.type.split('/')[0]
      const file2M = file.size / 1024 / 1024 < 2
      const fileSize = file.size / 1024 / 1024 < this.fileSize
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
      if (fileType === 'video') {
        if (!fileSize) {
          this.$message.error('上传文件过大')
        }
        return flag && fileSize
      }

      if (!file2M) {
        this.$message.error('上传文件过大')
      }

      if (flag && file2M) {
        this.loading = true
        return new Promise((resolve, reject) => {
          mediaGetToken({ type: file.name }).then((res) => {
            this.oss = { ...res.data, key: res.data.key }
            resolve()
          }).catch(() => {
            this.loading = false
            reject(new Error('获取ossToken失败！'))
          })
        })
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
.img-avatar-uploader {
  width: max-content;
}

.img-avatar-uploader > .ant-upload {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: none;
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
