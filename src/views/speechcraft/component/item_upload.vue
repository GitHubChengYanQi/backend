<template>
  <div>
    <!-- :action="action" :headers="headers" method="post" -->
    <a-upload-dragger
      name="file"
      :multiple="false"
      :default-file-list="defaultFileList"
      @change="handleChange"
      :before-upload="beforeUpload"
      @preview="handlePreview"
    >
      <p class="ant-upload-drag-icon">
        <a-icon :type="icon"/>
      </p>
      <p class="ant-upload-text">
        {{ tip }}
      </p>
    </a-upload-dragger>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable */
import storage from 'store'
import { upLoad, mediaGetToken, ossUpload } from '@/api/common'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default {
  name: "item_upload",
  props: {
    defaultFileList: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 上传个数 (未使用)
    limit: {
      type: Number,
      default: 1
    },
    // 文件最大大小 单位mb
    fileSize: {
      type: Number,
      default: 5
    },
    // 上传文件类型
    accept: {
      type: Array,
      default() { return [] }
    },
    icon: {
      type: String,
      default: 'inbox'
    },
    // 上传提示
    tip: {
      type: String,
      default: '单击或拖动文件到该区域进行上传'
    }
  },
  data() {
    return {
      oss: {},
      action: `${process.env.VUE_APP_API_BASE_URL}/common/upload`,
      previewVisible: false,
      previewImage: '',
      fileList: []
    }
  },
  watch: {
    defaultFileList: function (v) {
      this.fileList = v || []
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
  methods: {
    beforeUpload () {
      return false
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    async handleChange({file, fileList}) {
      console.log(file, fileList)
      const tempFileType = file.type.split('/')[1]
      if (this.accept.length !== 0) {
        // 文件限制格式列表长度不为0
        if (this.accept.indexOf(tempFileType) === -1) {
          this.$message.error(`上传文件格式只能为${this.accept.join(',')}`)
          return false
        }
      }
      let fileSize = file.size / 1024 / 1024
      if (fileSize > 200) {
        this.$message.error('文件大小超过200M')
        return false
      } else if (fileSize < 10) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('time', 1)
          console.log(formData, 'formData')
          // const res = await upLoad(formData)
          this.$emit('update:isLoadingStatus', true)
          await upLoad(formData).then(res => {
            console.log(res, '小文件上传返回')
            this.$emit('upload', res.data)
        }) 
      } else {
          await mediaGetToken({ type: file.name }).then(res => {
            // console.log(res, '获取ossToken')
            this.oss = { ...res.data, key: res.data.key }
            this.dealUploadMethod(this.oss, file)
          }).catch(() => {
            this.$message.error('获取ossToken失败')
          })
      }
      // let ext = file.name.substring(file.name.lastIndexOf('.') + 1)
      // if (this.accept.length > 1 && !this.accept.includes(ext.toLowerCase())) {
      //   file.status = 'beforeUploadReject'
      //   file.statusText = '文件格式错误'
      //   fileList.splice(0, 1)
      //   this.$notification.error({
      //     message: '提示',
      //     description: `只能上传${this.accept.join(',')}格式的文件`
      //   })
      //   return false
      // }
      // let isLtmb = file.size / 1024 / 1024 < this.fileSize
      // if (!isLtmb && file.status !== 'removed') {
      //   file.status = 'beforeUploadReject'
      //   file.statusText = `文件大小不能大于${this.fileSize}MB`
      //   fileList.splice(0, 1)
      //   this.$notification.error({
      //     message: '提示',
      //     description: `文件大小不能大于${this.fileSize}MB`
      //   })
      //   return false
      // } else if (file.size / 1024 / 1024 > 10 && file.size / 1024 / 1024 < 200) {
      //   // 在10-200之间
      //   await mediaGetToken({ type: file.name }).then(res => {
      //     // console.log(res, '获取ossToken')
      //     this.oss = { ...res.data, key: res.data.key }
      //     this.dealUploadMethod(this.oss, file)
      //   }).catch(() => {
      //     this.$message.error('获取ossToken失败')
      //   })
      // } else {
      //   const formData = new FormData()
      //   formData.append('file', file)
      //   formData.append('time', 1)
      //   console.log(formData, 'formData')
      //   // const res = await upLoad(formData)
      //   this.$emit('update:isLoadingStatus', true)
      //   await upLoad(formData).then(res => {
      //     console.log(res, '小文件上传返回')
      //   }) 
      // }

      // // 上传完成
      // if (file.status === 'done') {
      //   const data = file.response.data
      //   this.fileList = fileList
      //   this.$emit('upload', data)
      // }
    },
    dealUploadMethod (info, fileInfo) {
      // this.$emit('update:isLoadingStatus', true)
      console.log(info, fileInfo, '大文件上传oss')
      // debugger
      const tempFormData = new FormData()
      for (const i in info) {
        console.log(i, 'iii')
        tempFormData.append(i, info[i])
      }
      tempFormData.append('file', fileInfo)
      ossUpload(tempFormData).then(res => {
        console.log(res, '大文件上传返回')
        this.$set(this.oss, 'fileName', fileInfo.name)
        this.$emit('upload', this.oss)
        // this.$emit('successUpload', this.oss)
        // this.$emit('loadingMethod', false)
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
  }
}
</script>

<style scoped>

</style>
