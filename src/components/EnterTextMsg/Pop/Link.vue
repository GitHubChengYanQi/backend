<template>
  <div class="applet">
    <a-modal @cancel="show = false" :title="`${edit ? '编辑' : '添加'}链接`" :visible="show" width="620px">
      <div class="content">
        <div class="row flex">
          <span>
            <span class="red">*</span>
            链接地址：
          </span>
          <div class="input">
            <a-input placeholder="请输入链接地址" v-model="form.imageLink"/>
          </div>
        </div>
        <div class="row flex">
          <span>
            <span class="red">*</span>
            链接标题：
          </span>
          <div class="input">
            <a-input placeholder="请输入链接标题" v-model="form.title"/>
          </div>
        </div>
        <div class="row flex">
          <span>
            <span class="red">*</span>
            链接描述：
          </span>
          <div class="input">
            <a-input placeholder="请输入链接描述" v-model="form.description"/>
          </div>
        </div>
        <div class="row flex">
          <span>
            <span class="red">*</span>
            链接封面：
          </span>
          <div class="input">
            <Upload v-model="form.imagePath"/>
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
import { addMaterialLibrary } from '@/api/mediumGroup'
import Upload from '@/components/Upload/Upload'

export default {
  data () {
    return {
      show: false,
      edit: false,
      form: {
        mediumId: '',
        imageLink: '',
        title: '',
        description: '',
        imagePath: ''
      }
    }
  },
  methods: {
    confirm () {
      if (!this.form.imageLink) {
        this.$message.error('链接地址未填写')

        return false
      }

      if (!this.form.title) {
        this.$message.error('链接标题未填写')

        return false
      }

      if (!this.form.description) {
        this.$message.error('链接描述未填写')

        return false
      }

      if (!this.form.imagePath) {
        this.$message.error('链接封面未填写')

        return false
      }

      const form = JSON.parse(JSON.stringify(this.form))

      form.imagePath = form.imagePath.path

      addMaterialLibrary({
        type: 3,
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
        this.form.imageLink = data.imageLink
        this.form.title = data.title
        this.form.description = data.description
        this.form.imagePath = data.imagePath

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
