<template>
  <div>
    <breadcrumb :titles="['课程管理','新建课程']" back></breadcrumb>
    <a-spin :spinning="detailLoading">
      <div class="content">
        <div style="padding-bottom: 16px;display: flex">
          <div style="font-size: 16px;font-weight: bold;flex-grow: 1">新建课程</div>
          <div>
            <a-button :loading="loading" style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
          </div>
        </div>

        <a-form
          class="form"
          labelAlign="left"
          :form="form"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 10 }"
        >
          <a-form-item label="课程名称">
            <a-input
              placeholder="请输入课程名称"
              v-decorator="['name', { rules: [{ required: true, message: '请输入课程名称!' }] }]"
            />
          </a-form-item>
          <a-form-item label="模板分类">
            <a-cascader
              v-if="!classTreeLoading"
              :options="classTree"
              placeholder="请选择模板分类"
              v-decorator="['courseClassId', { rules: [{ required: true, message: '请选择模板分类!' }] }]"
            />
            <a-spin v-else />
          </a-form-item>
          <a-form-item
            label="选择课件"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 19 }"
          >
            <selectCourseware
              placeholder="请选择课件"
              v-decorator="['wareBindParams', { rules: [{ required: true, message: '请选择课件!' }],initialValue:[] }]"
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
          <a-form-item label="适用员工">
            <Employee
              v-decorator="['applicableObject', { rules: [{ required: true, message: '请选择适用员工!' }],initialValue:['all'] }]"></Employee>
          </a-form-item>
          <a-form-item label="关联考试">
            <SelectExamination
              placeholder="请选择关联考试"
              v-decorator="['examId', { rules: [{ required: true, message: '请选择关联考试!' }],initialValue:'' }]"
            />
          </a-form-item>
          <a-form-item label="课程简介">
            <VueQuillEditor
              :height="'auto'"
              placeholder="请输入课程简介"
              v-decorator="['note', { rules: [{ required: true, message: '请输入课程简介!' }],initialValue:'' }]"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </div>
</template>

<script>
import breadcrumb from '../../components/Breadcrumd'
import selectCourseware from './compoents/SelectCourseware'
import SelectExamination from './compoents/SelectExamination'
import VueQuillEditor from '@/components/VueQuillEditor'
import ImgUpload from '../../components/ImgUpload/index'
import Employee from '../../components/Employee/index'
import { courseClassTreeView } from '@/api/study/lessonClass'
import router from '@/router'
import { message } from 'ant-design-vue'
import { courseAdd, courseDetail } from '@/api/study/course'

export default {
  components: { breadcrumb, selectCourseware, VueQuillEditor, ImgUpload, SelectExamination, Employee },
  data () {
    return {
      detailLoading: false,
      loading: false,
      classTreeLoading: false,
      classTree: [],
      data: {},
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  created () {
    if (router.history.current.query.id) {
      this.getDetail(router.history.current.query.id)
    }
    this.getTreeData()
  },
  methods: {
    getDetail (id) {
      this.detailLoading = true
      courseDetail({ courseId: id }).then((res) => {
        console.log(res)
      }).finally(() => {
        this.detailLoading = false
      })
    },
    getTreeData () {
      this.classTreeLoading = true
      courseClassTreeView().then((res) => {
        this.classTree = res.data
      }).finally(() => {
        this.classTreeLoading = false
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          courseAdd({
            ...values,
            courseClassId: values.courseClassId[0],
            questionnaireIds: [values.questionnaireId],
            examIds: [values.examId],
            applicableObject: values.applicableObject[0] === 'all' ? 1 : 2,
            empIds: values.applicableObject[0] === 'all' ? [] : values.applicableObject
          }).then(() => {
            router.back()
            message.success('课程创建成功！')
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
