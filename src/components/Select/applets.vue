<template>
  <div class="add-applets">
    <a-modal v-model="modalShow" on-ok="handleOk" :width="637">
      <template slot="title">
        添加小程序
      </template>
      <div class="form">
        <div class="item">
          <span class="title">
            <span class="required">*</span>
            小程序标题：
          </span>
          <div class="input">
            <a-input placeholder="请输入小程序标题" v-model="form.title"></a-input>
          </div>
        </div>
        <div class="item">
          <span class="title">
            <span class="required">*</span>
            小程序APPID：
          </span>
          <div class="input">
            <a-input placeholder="请输入小程序APPID" v-model="form.appid"></a-input>
            <div class="tips">
              <a href="#">如何获取小程序APPID？</a>
            </div>
          </div>
        </div>
        <div class="item">
          <span class="title">
            <span class="required">*</span>
            小程序路径：
          </span>
          <div class="input">
            <a-input placeholder="请输入小程序路径" v-model="form.path"></a-input>
            <div class="tips">
              <a href="#">如何获取小程序路径？</a>
            </div>
          </div>
        </div>
        <div class="item">
          <span class="title">
            <span class="required">*</span>
            小程序封面：
          </span>
          <div class="input">
            <!--            <m-upload ref="upload"/>-->
            <upload ref="upload" v-model="form.image" @success="uploadAppletCover" />
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button key="back" @click="hide">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="addClick">
          添加
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import upload from '@/components/MaUpload'
export default {
  components: {
    upload
  },
  data () {
    return {
      modalShow: false,
      loading: false,
      form: {
        title: '',
        appid: '',
        path: '',
        image: '',
        imagePath: ''
      }
    }
  },
  methods: {
    show () {
      this.modalShow = true
    },

    hide () {
      this.modalShow = false
    },
    uploadAppletCover (res) {
      this.form.imagePath = res.fullPath
      console.log(res.fullPath, 'image.url')
    },
    addClick () {
      if (!this.form.title) {
        this.$message.warning('标题未填写')
        return false
      }
      if (!this.form.appid) {
        this.$message.warning('APPID未填写')
        return false
      }
      if (!this.form.path) {
        this.$message.warning('路径未填写')
        return false
      }
      if (!this.form.image) {
        this.$message.warning('图片未上传')
        return false
      }

      console.log(this.form.image, 'form.image')

      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.hide()
        this.$message.success('添加成功')
        this.$emit('change', this.form)
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-modal-title {
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
}

.form {
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .title {
      width: 104px;
      margin-right: 10px;
    }

    .required {
      font-size: 14px;
      color: #ff2929;
    }

    .input {
      flex: 1;
    }

    .tips {
      display: flex;
      justify-content: flex-end;
      margin-top: 5px;
      font-size: 13px;
    }
  }
}
</style>
