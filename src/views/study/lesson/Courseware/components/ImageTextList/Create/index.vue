<template>
  <div>
    <breadcrumb :titles="['课程管理','课件管理','创建图文']" back></breadcrumb>

    <a-spin :spinning="detailLoading">
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
              v-decorator="['title', { rules: [{ required: true, message: '请输入标题!' }] }]"
            />
          </a-form-item>
          <a-form-item label="封面图">
            <div class="my-space">
              <ImgUpload
                placeholder="请选择封面图"
                v-decorator="['coverImageUrl', { rules: [{ required: true, message: '请选择封面图!'}],initialValue: '' }]"
              />
              建议尺寸：750 × 1448
            </div>
          </a-form-item>
          <a-form-item label="课程详情">
            <VueQuillEditor
              :height="'auto'"
              placeholder="请输入课程详情"
              v-decorator="['note', { rules: [{ required: true, message: '请输入课程详情!' }],initialValue:'' }]"
            />
          </a-form-item>
        </a-form>

        <div style="text-align: center">
          <a-button :loading="loading" style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import breadcrumb from '../../../../../components/Breadcrumd'
import VueQuillEditor from '@/components/VueQuillEditor'
import ImgUpload from '../../../../../components/ImgUpload/index'
import { courseWareAdd, courseWareDetail } from '@/api/study/courseWare'
import router from '@/router'
import { message } from 'ant-design-vue'

export default {
  components: { breadcrumb, VueQuillEditor, ImgUpload },
  data () {
    return {
      loading: false,
      detailLoading: false,
      data: {},
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  created () {
    if (router.history.current.query.id) {
      this.getDetail(router.history.current.query.id)
    }
  },
  methods: {
    getDetail (id) {
      this.detailLoading = true
      courseWareDetail({ courseWareId: id }).then((res) => {
        console.log(res)
      }).finally(() => {
        this.detailLoading = false
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          courseWareAdd({
            courseWareType: 'text',
            suffix: 'jpg',
            ...values
          }).then(() => {
            router.back()
            message.success('课件创建成功！')
          }).finally(() => {
            this.loading = false
          })
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
