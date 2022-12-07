<template>
  <div>
    <breadcrumb :titles="['课程管理','课件管理','创建图文']" back></breadcrumb>

    <div class="content">
      <div style="padding-bottom: 16px;display: flex">
        <div style="font-size: 16px;font-weight: bold;flex-grow: 1">创建图文</div>
      </div>

      <a-form
        class="form"
        labelAlign="left"
        :form="form"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-item label="标题">
          <a-input
            placeholder="请输入标题"
            v-decorator="['note', { rules: [{ required: true, message: '请输入标题!' }] }]"
          />
        </a-form-item>
        <a-form-item label="封面图">
          <div class="my-space">
            <ImgUpload
              placeholder="请选择封面图"
              v-decorator="['fmt', { rules: [{ required: true, message: '请选择封面图!'}],initialValue: '' }]"
            />
            建议尺寸：750 × 1448
          </div>
        </a-form-item>
        <a-form-item label="课程详情">
          <VueQuillEditor
            :height="'auto'"
            placeholder="请输入课程详情"
            v-decorator="['kcjj', { rules: [{ required: true, message: '请输入课程详情!' }],initialValue:'' }]"
          />
        </a-form-item>
      </a-form>

      <div style="text-align: center">
        <a-button style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../../../../../components/Breadcrumd'
import VueQuillEditor from '@/components/VueQuillEditor'
import ImgUpload from '../../../../../components/ImgUpload/index'

export default {
  components: { breadcrumb, VueQuillEditor, ImgUpload },
  data () {
    return {
      data: {},
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  border-radius: 8px;
  padding: 24px;
  background-color: #fff;
}
</style>
