<template>
  <a-upload
    name="file"
    list-type="picture-card"
    :class="'img-avatar-uploader'"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <div>
      {{ buttonText }}
      <!-- <div v-if="value && !loading" class="img-wrapper">
        <img v-if="fileType === 1" class="img" :src="value" alt="avatar" />
        <div v-if="fileType === 3">
          <video :src="value" style="width: 200px" controls></video>
          <a-button type="link">重新上传</a-button>
        </div>
      </div>
      <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
      </div> -->
    </div>
  </a-upload>
</template>
<script>
import storage from 'store'
import { mediaGetToken, ossUpload } from '@/api/common'
export default {
  props: {
    buttonText: {
      type: String,
      default: ''
    },
    fileMaxSize: {
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
    dealUploadMethod (info, fileInfo) {
      // this.$emit('update:isLoadingStatus', true)
      const tempFormData = new FormData()
      for (const i in info) {
        console.log(i, 'iii')
        tempFormData.append(i, info[i])
      }
      tempFormData.append('file', fileInfo.file)
      ossUpload(tempFormData).then(res => {
        this.$emit('successUpload', this.oss)
        this.$emit('loadingMethod', false)
      })
      // const headerOptions = {
      //   method: 'POST',
      //   url: `${info.host}/`,
      //   headers: {
      //     Accept: 'application/json',
      //     Authorization: storage.get('ACCESS_TOKEN')
      //   },
      //   data: tempFormData
      // }
      // axios(headerOptions).then(res => {
      //   console.log(res, '上传文件')
      //   this.$emit('successUpload', this.oss)
      // })
    },
    async handleChange (info) {
      // console.log(info, '选择视频完成')
      const fileSize = info.file.size / 1024 / 1024
      if (fileSize > this.fileMaxSize) {
        this.$message.error('上传文件大于200M')
        return false
      } else if (fileSize <= 10) {
        this.$emit('successUpload', info.file)
        return false
      } else {
        this.$emit('loadingMethod', true)
        await mediaGetToken({ type: info.file.name }).then(res => {
          // console.log(res, '获取ossToken')
          this.oss = { ...res.data, key: res.data.key }
          this.dealUploadMethod(this.oss, info)
        }).catch(() => {
          this.$message.error('获取ossToken失败')
        })
      }
    },
    beforeUpload (file) {
      return false
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
