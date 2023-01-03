<template>
  <div>
    <!-- :action="action" :headers="headers" method="post" -->
    <a-upload-dragger
      name="file"
      :multiple="false"
      :default-file-list="defaultFileList"
      @change="handleChange"
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
    handleChange({file, fileList}) {
      if (fileList.length > 1) {
        // 限制只能上传一个文件 再次上传时则替换(覆盖)以前的文件
        fileList.splice(0, 1)
      }

      let ext = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (this.accept.length > 1 && !this.accept.includes(ext.toLowerCase())) {
        file.status = 'beforeUploadReject'
        file.statusText = '文件格式错误'
        fileList.splice(0, 1)
        this.$notification.error({
          message: '提示',
          description: `只能上传${this.accept.join(',')}格式的文件`
        })
      }

      // if (file.name.length > 20) {
      //   file.status = 'beforeUploadReject'
      //   file.statusText = `文件名长度不能大于20`
      //   fileList.splice(0, 1)
      //   this.$notification.error({
      //     message: '提示',
      //     description: `文件名长度不能大于20`
      //   })
      // }

      let isLtmb = file.size / 1024 / 1024 < this.fileSize
      if (!isLtmb && file.status !== 'removed') {
        file.status = 'beforeUploadReject'
        file.statusText = `文件大小不能大于${this.fileSize}MB`
        fileList.splice(0, 1)
        this.$notification.error({
          message: '提示',
          description: `文件大小不能大于${this.fileSize}MB`
        })
      }

      // 上传完成
      if (file.status === 'done') {
        const data = file.response.data
        this.fileList = fileList
        this.$emit('upload', data)
      }
    },
  }
}
</script>

<style scoped>

</style>
