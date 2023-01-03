<template>
  <div>
    <breadcrumb :titles="['课程管理','课件管理','创建图文']" back back-tip></breadcrumb>
    <a-spin :spinning="detailLoading">
      <div class="content">
        <div style="padding-bottom: 16px;display: flex">
          <div style="font-size: 16px;font-weight: bold;flex-grow: 1">创建图文</div>
          <div>
            <a-button style="border-radius: 8px" type="primary" @click="openPreview">预览</a-button>
          </div>
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
              :maxLength="50"
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
              width="400px"
              v-if="!detailLoading"
              :height="'auto'"
              placeholder="请输入课程详情"
              v-decorator="['note', { rules: [{ required: true, message: '请输入课程详情!' }], initialValue:detail.note }]"
            />
            <a-spin v-else />
          </a-form-item>
        </a-form>

        <div style="text-align: center">
          <a-button :loading="loading" style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
        </div>
      </div>
    </a-spin>

    <Preview
      :title="previewTitle"
      :preview="preview"
      @close="preview = false"
      :content="content"
    >
      <div>
        <img class="img" :src="url" alt="avatar" width="283" />
      </div>
    </Preview>
  </div>
</template>

<script>
import breadcrumb from '../../../../../components/Breadcrumd'
import VueQuillEditor from '../../../../../components/VueQuillEditor'
import ImgUpload from '../../../../../components/ImgUpload/index'
import { courseWareAdd, courseWareDetail, courseWarEdit } from '@/api/study/courseWare'
import router from '@/router'
import { message } from 'ant-design-vue'
import Preview from '../../../../../components/Preview'

export default {
  components: { breadcrumb, VueQuillEditor, ImgUpload, Preview },
  data () {
    return {
      detail: {},
      content: '',
      url: '',
      previewTitle: '',
      preview: false,
      loading: false,
      detailLoading: false,
      data: {},
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  mounted () {
    if (router.history.current.query.id) {
      this.getDetail(router.history.current.query.id)
    }
  },
  methods: {
    openPreview () {
      this.preview = true
      this.previewTitle = this.form.getFieldValue('title')
      this.content = this.form.getFieldValue('note')
      this.url = this.form.getFieldValue('coverImageUrl')
    },
    getDetail (id) {
      this.detailLoading = true
      courseWareDetail({ courseWareId: id }).then((res) => {
        const detail = res.data || {}
        this.detail = detail
        this.form.setFieldsValue({
          title: detail.title,
          coverImageUrl: detail.coverImageUrl,
          note: detail.note
        })
      }).finally(() => {
        this.detailLoading = false
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          const data = {
            courseWareType: 'text',
            suffix: 'jpg',
            ...values
          }
          if (router.history.current.query.id) {
            courseWarEdit({ ...data, courseWareId: router.history.current.query.id }).then(() => {
              router.back()
              message.success('课件修改成功！')
            }).finally(() => {
              this.loading = false
            })
          } else {
            courseWareAdd(data).then(() => {
              router.back()
              message.success('课件创建成功！')
            }).finally(() => {
              this.loading = false
            })
          }
        } else {
          message.warn('请检查必填项！')
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
