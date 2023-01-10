<template>
  <div>
    <breadcrumb :titles="['课程管理','课件管理','编辑图文']" back back-tip></breadcrumb>
    <a-spin :spinning="detailLoading">
      <div class="content">
        <div style="padding-bottom: 16px;display: flex">
          <div style="font-size: 16px;font-weight: bold;flex-grow: 1">编辑图文</div>
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
              :suffix="`${form.getFieldValue('title') ? form.getFieldValue('title').length : 0} / 50`"
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
              建议尺寸：750 × 750
            </div>
          </a-form-item>
          <a-form-item label="课程详情">
            <div style="height: 500px">
              <VueQuillEditor
                width="400px"
                v-if="!detailLoading"
                :height="'auto'"
                placeholder="请输入课程详情"
                v-decorator="['note', { rules: [{ required: true, message: '请输入课程详情!' }], initialValue:detail.note }]"
              />
              <a-spin v-else />
            </div>
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
        <img v-if="url" class="img" :src="url" alt="avatar" width="283" />
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
.my-space {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-search {
  .ant-form-inline {
    .ant-form-item {
      margin-bottom: 24px;
    }
  }
}

.warnButton {
  color: rgba(255, 152, 0, 1);
  background-color: rgba(252, 192, 104, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.linkButton {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.delButton {
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.successButton {
  color: #01ba77;
  background-color: rgba(1, 186, 119, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.my-table-search {
  border-radius: 8px;

  .ant-form-inline .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-input,
  .ant-select-selection,
  .ant-time-picker-input {
    border-radius: 8px !important;
  }

  .ant-btn {
    margin-right: 10px;
    border-radius: 8px;
  }
}

.my-table-wrapper {
  border-radius: 8px;

  .btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 24px;

    > .ant-btn {
      margin-left: 12px;
      border-radius: 8px;
    }
  }
}

.my-table {
  background-color: #fff;

  .ant-table-pagination {
    padding: 24px;
    float: none;
    text-align: center;
  }
}

.myTooltip {
  background-color: #fff;

  .ant-tooltip-inner {
    color: #000;
    background-color: #fff;
  }

  .ant-tooltip-arrow::before {
    background-color: #fff;
  }
}

.myLabelBox {
  width: 400px;

  span {
    margin-bottom: 10px;
  }
}

.my-modal {
  .ant-modal-footer {
    padding: 24px;
    text-align: center;

    .ant-btn {
      padding: 0 24px;
      border-radius: 8px;
    }

    .ant-modal-footer button + button {
      margin-left: 24px;
    }
  }
}
.content {
  border-radius: 8px;
  padding: 24px;
  background-color: #fff;
}
</style>
