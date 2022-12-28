<template>
  <div>
    <breadcrumb :titles="['课程管理','新建课程']" back back-tip></breadcrumb>
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
              :maxLength="20"
              placeholder="请输入课程名称"
              v-decorator="['name', { rules: [{ required: true, message: '请输入课程名称!' }] }]"
            />
          </a-form-item>
          <a-form-item label="模板分类">
            <a-cascader
              change-on-select
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
              :hiddenExam="hiddenExam"
              v-if="!detailLoading"
              placeholder="请选择课件"
              v-decorator="['wareBindParams', { rules: [{ required: true, message: '请选择课件!' }],initialValue:[] }]"
            />
            <a-spin v-else />
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
              v-if="!detailLoading"
              :employees="employees"
              :disabled="!!this.$router.history.current.query.id"
              v-decorator="['applicableObject', { rules: [{ required: true, message: '请选择适用员工!' }],initialValue:['all'] }]"
            />
            <a-spin v-else />
          </a-form-item>
          <a-form-item label="关联考试">
            <SelectExamination
              placeholder="请选择关联考试"
              v-decorator="['exam', { initialValue:{} }]"
              @change="(exam)=> hiddenExam = !(exam && exam.examId)"
            />
          </a-form-item>
          <a-form-item label="课程简介">
            <VueQuillEditor
              v-if="!detailLoading"
              :height="'auto'"
              placeholder="请输入课程简介"
              v-decorator="['note', { rules: [{ required: true, message: '请输入课程简介!' }],initialValue:'' }]"
            />
            <a-spin v-else />
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
import { courseAdd, courseDetail, courseEdit } from '@/api/study/course'

export default {
  components: { breadcrumb, selectCourseware, VueQuillEditor, ImgUpload, SelectExamination, Employee },
  data () {
    return {
      hiddenExam: true,
      detailLoading: false,
      loading: false,
      classTreeLoading: false,
      classTree: [],
      employees: [],
      data: {},
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  created () {
    this.getTreeData()
  },
  mounted () {
    if (router.history.current.query.id) {
      this.getDetail(router.history.current.query.id)
    }
  },
  methods: {
    getParentValue (value, data) {
      if (!Array.isArray(data)) {
        return []
      }
      for (let i = 0; i < data.length; i++) {
        if (`${data[i].value}` === `${value}`) {
          return [`${value}`]
        }
        if (data[i].children.length > 0) {
          const values = this.getParentValue(value, data[i].children)
          if (values.length > 0) {
            return [`${data[i].value}`, ...values]
          }
        }
      }
      return []
    },
    getClassIds (value, dataSources) {
      let valueArray = []
      if ((value || value === 0) && typeof `${value}` === 'string') {
        const $tmpValue = `${value}`
        if ($tmpValue.indexOf(',') >= 0) {
          const tmpValue = $tmpValue.split(',')
          for (let i = 0; i < tmpValue.length; i++) {
            const item = tmpValue[i]
            if (item) {
              valueArray.push(item)
            }
          }
        } else {
          valueArray = this.getParentValue($tmpValue, dataSources)
        }
      } else if (Array.isArray(value)) {
        valueArray = value
      } else {
        valueArray = ''
      }
      return valueArray
    },
    getDetail (id) {
      this.detailLoading = true
      courseDetail({ courseId: id }).then((res) => {
        const detail = res.data || {}
        this.employees = detail.bindEmpList ? detail.bindEmpList.map(item => item.name) : []
        this.hiddenExam = !detail.examResults
        this.form.setFieldsValue({
          name: detail.name,
          courseClassId: this.getClassIds(detail.courseClassId, this.classTree),
          wareBindParams: detail.courseWareBindResults,
          coverImageUrl: detail.coverImageUrl,
          applicableObject: detail.applicableObject === 1 ? ['all'] : detail.bindEmpList ? detail.bindEmpList.map(item => item.id) : [],
          exam: detail.examResults && detail.examResults[0],
          note: detail.note
        })
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
          const data = {
            ...values,
            wareBindParams: values.wareBindParams.map((item, index) => ({ ...item, sort: index })),
            courseClassId: values.courseClassId[values.courseClassId.length - 1],
            questionnaireIds: [values.questionnaireId],
            examIds: [values.exam.examId],
            applicableObject: values.applicableObject[0] === 'all' ? 1 : 2,
            empIds: values.applicableObject[0] === 'all' ? [] : values.applicableObject
          }
          if (router.history.current.query.id) {
            courseEdit({ ...data, courseId: router.history.current.query.id }).then(() => {
              router.back()
              message.success('课程修改成功！')
            }).finally(() => {
              this.loading = false
            })
          } else {
            courseAdd(data).then(() => {
              router.back()
              message.success('课程创建成功！')
            }).finally(() => {
              this.loading = false
            })
          }
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
