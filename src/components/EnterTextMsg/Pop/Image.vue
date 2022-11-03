<template>
  <div class="image">
    <a-modal @cancel="overShow" :title="`${edit ? '编辑' : '添加'}图片`" :visible="show">
      <a-form-model ref="imageForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 18}">
        <a-form-model-item label="图片标题：">
          <a-input v-model="form.title" placeholder="请输入图片标题（选填）"></a-input>
        </a-form-model-item>
        <a-form-model-item required label="图片">
          <Upload :accept="'image/*'" v-model="form.image"/>
        </a-form-model-item>
      </a-form-model>
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
        title: '',
        image: null
      }
    }
  },
  methods: {
    confirm () {
      if (!this.form.image) {
        this.$message.error('未上传图片')

        return false
      }

      this.show = false

      const content = JSON.parse(JSON.stringify(this.form.image))

      content.imagePath = content.path
      content.imageName = content.name

      addMaterialLibrary({
        type: 2,
        mediumGroupId: 0,
        content
      }).then(res => {
        this.$message.success('操作成功')

        this.show = false

        this.form.mediumId = res.data.id
        if (!this.form.title) {
          this.form.title = '未命名图片'
        }
        const sendParams = {
          form: JSON.parse(JSON.stringify(this.form))
        }

        this.$emit('input', sendParams)
        this.$emit(this.edit ? 'edit' : 'change', sendParams)
      })
    },

    $show (data = null) {
      if (data) {
        this.form.mediumId = data.id
        this.form.title = data.title
        this.form.image = data.image

        this.edit = true
      } else {
        this.form.mediumId = ''
        this.form.title = ''
        this.form.image = null

        this.edit = false
      }

      this.show = true
    },

    overShow () {
      console.log('cs ')
      this.show = false
    }
  },
  components: { Upload }
}
</script>

<style lang="less" scoped>
.file {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px dashed #d9d9d9;

  &:hover {
    border-color: #1890ff;
    background: #f6fbff;
    color: #1890ff;

    svg {
      fill: #1890ff
    }
  }
}
</style>

<style>
.ant-upload-select-picture-card {
  background: #fff !important;
}
</style>
