<template>
  <div>
    <div v-if="btnType && imageUrl" class="img-preview">
      <div class="box">
        <a @click="viewFn">查看</a>
        <a @click="delFn">删除</a>
      </div>
      <img v-if="fileType===1" :src="imageUrl" />
      <video v-if="fileType===3" :src="imageUrl">
        您的浏览器不支持 video 标签。
      </video>
    </div>
    <a-upload
      v-else
      name="file"
      list-type="picture-card"
      :class="btnType ? 'avatar-uploader' : 'btn-type'"
      :headers="headers"
      method="post"
      :show-upload-list="false"
      :action="uploadApi"
      :before-upload="beforeUpload"
      @change="handleChange"
      :data="{time:1}"
      :accept="accept">
      <div v-if="btnType">
        <div v-if="imageUrl" class="img-wrapper">
          <img class="img" :src="imageUrl" alt="avatar" />
        </div>
        <div v-else>
          <a-icon :type="loading ? 'loading' : 'plus'" />
        </div>
      </div>
      <a-button type="primary" v-else >{{ btnVal }}</a-button>
    </a-upload>
    <!--modal-->
    <a-modal
      width="800px"
      class="viewModal"
      :visible="modalVisible"
      @cancel="reset"
      title="附件预览">
      <div class="box">
        <img v-if="fileType===1" :src="imageUrl" />
        <video v-if="fileType===3" :src="imageUrl" controls="controls">
          您的浏览器不支持 video 标签。
        </video>
      </div>
      <template slot="footer">
        <a-button
          @click="reset"
          key="back">关闭</a-button>
      </template>
    </a-modal>
    <!--end modal-->
  </div>
</template>
<script>
import storage from 'store'

export default {
  model: {
    prop: 'modelVal',
    event: 'changeImg'
  },
  props: {
    btnVal: {
      default: '上传图片',
      type: String
    },
    fileType: {
      type: Number || Array,
      default: 1
    },
    modelVal: {
      default: '',
      type: String
    },
    imageType: {
      default: '',
      type: String
    },
    btnType: {
      type: Boolean,
      default: true
    },
    imgUrl: {
      default: '',
      type: String
    }
  },
  watch: {
    imgUrl: {
      immediate: true,
      deep: true,
      handler (val) {
        this.imageUrl = val
      }
    },
    fileType: {
      immediate: true,
      deep: true,
      handler (val) {
        const arr = this.FileTypeArr[Number(val)]
        for (let i = 0; i < arr.length; i++) {
          arr[i] = '.' + arr[i]
        }
        this.accept = arr.join(',')
      }
    }
  },
  data () {
    return {
      modalVisible: false,
      loading: false,
      imageUrl: '',
      accept: '',
      FileTypeArr: [
        '',
        ['jpg', 'png', 'jpeg'],
        ['mp3', 'amr'],
        ['mp4'],
        ['doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'pdf', 'Xmind']
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
    delFn () {
      this.imageUrl = ''
      this.$emit('changeImg', '')
    },
    reset () {
      this.modalVisible = false
    },
    viewFn () {
      this.modalVisible = true
    },
    showImg (img) {
      this.imageUrl = img
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        const data = info.file.response.data
        this.$emit('success', data)
        this.$emit('changeImg', data)
        this.imageUrl = data
        this.loading = false
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
      const fileType = file.type.split('/')[0]
      const file2M = file.size / 1024 / 1024 < 2
      // const file10M = file.size / 1024 / 1024 < 10
      const file200M = file.size / 1024 / 1024 < 10 * 20
      let ary = []
      if (this.fileType instanceof Array) {
        this.fileType.map(item => {
          ary.concat(this.FileTypeArr[item])
        })
      } else {
        ary = this.FileTypeArr[this.fileType]
      }
      const flag = ary.includes('.' + fileSuffix)
      if (!flag) {
        this.$message.error(`您只能上传以下类型： ${ary.join(',')}`)
        return false
      }
      if (fileType === 'video') {
        if (!file200M) {
          this.$message.error('上传文件过大')
        }
        return flag && file200M
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
<style lang="less">
.avatar-uploader > .ant-upload {
  width: 100px;
  height: 100px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.img-preview {
  width:100px;
  height:100px;
  position: relative;
  border:1px dotted #ccc;
  padding:10px;
  box-sizing: border-box;
  img, video{
    width:100%;
    height:100%;
  }
  .box{
    width:100%;
    height:100%;
    position: absolute;
    z-index: 999;
    top:0;
    left:0;
    background: rgba(0,0,0,.5);
    display:none;
    text-align: center;
    a{
      line-height:100px;
      color:#fff;
      padding:0 5px;
    }
  }
  &:hover>.box{
    display:block;
  }
}
.img-wrapper {
  position: relative;
  .img {
    width: 100px;
    height: 100px;
  }
}
.btn-type {
  width: 0;
  height: auto;
  .ant-upload {
    padding:0 !important;
    width: 100%;
    height: auto;
    border: 0;
    background: none;
    button{
      width:100%;
    }
  }
}
.viewModal{
  .box{
    width:100%;
    height:100%;
    text-align: center;
    img,video{
      width:100%;
      height:auto;
    }
  }
}
</style>
