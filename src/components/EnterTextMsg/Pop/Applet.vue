<template>
  <div class="applet">
    <a-modal @cancel="show = false" :title="`${edit ? '编辑' : '添加'}小程序`" :visible="show" width="620px">
      <div class="content">
        <div class="row flex">
          <span>
            <span class="red">*</span>
            小程序标题：
          </span>
          <div class="input">
            <a-input placeholder="请输入小程序标题" v-model="form.title"/>
          </div>
        </div>
        <div class="row flex">
          <span>
            <span class="red">*</span>
            小程序APPID：
          </span>
          <div class="input">
            <a-input placeholder="请输入小程序APPID" v-model="form.appid"/>
          </div>
        </div>
        <div class="row flex">
          <span>
            <span class="red">*</span>
            小程序路径：
          </span>
          <div class="input">
            <a-input placeholder="请输入小程序路径" v-model="form.page"/>
          </div>
        </div>
        <div class="row flex">
          <span>
            <span class="red">*</span>
            小程序封面：
          </span>
          <div class="input">
            <Upload v-model="form.image"/>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="show = false">
          取消
        </a-button>
        <a-button type="primary" @click="confirm">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import Upload from '@/components/Upload/Upload'
import { addMaterialLibrary } from '@/api/mediumGroup'

export default {
  data () {
    return {
      edit: false,
      show: false,
      form: {
        mediumId: '',
        title: '',
        appid: '',
        page: '',
        image: ''
      }
    }
  },
  methods: {
    confirm () {
      if (!this.form.title) {
        this.$message.error('标题未填写')

        return false
      }
      if (!this.form.appid) {
        this.$message.error('appid未填写')

        return false
      }
      if (!this.form.page) {
        this.$message.error('路径未填写')

        return false
      }
      if (!this.form.image) {
        this.$message.error('图片未填写')

        return false
      }

      const form = JSON.parse(JSON.stringify(this.form))

      form.imageName = form.image.name
      form.imagePath = form.image.path

      addMaterialLibrary({
        type: 6,
        mediumGroupId: 0,
        content: form
      }).then(res => {
        this.$message.success('添加成功')

        this.show = false

        this.form.mediumId = res.data.id

        const sendParams = {
          form: this.form
        }

        this.$emit('input', sendParams)
        this.$emit(this.edit ? 'edit' : 'change', sendParams)
      })
    },

    $show (data = null) {
      if (data) {
        this.form.mediumId = data.id
        this.form.title = data.title
        this.form.appid = data.appid
        this.form.page = data.page
        this.form.image = data.image

        this.edit = true
      } else {
        this.form.mediumId = ''
        this.form.imageLink = ''
        this.form.title = ''
        this.form.description = ''
        this.form.imagePath = ''

        this.edit = false
      }

      this.show = true
    }
  },
  components: { Upload }
}
</script>

<style lang="less" scoped>
.row {
  margin-bottom: 18px;

  .red {
    color: #ff2929;
  }

  .input {
    width: 100%;
  }

  & > span {
    width: 130px;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
