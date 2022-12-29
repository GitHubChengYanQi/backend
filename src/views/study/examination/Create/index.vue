<template>
  <div>
    <breadcrumb :titles="['考试管理','新建考试']" back back-tip></breadcrumb>
    <a-spin :spinning="detailLoading">
      <div class="content">
        <div style="padding-bottom: 16px;display: flex">
          <div style="font-size: 16px;font-weight: bold;flex-grow: 1">新建考试</div>
        </div>

        <a-form
          class="form"
          labelAlign="left"
          :form="form"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 10 }"
        >
          <a-form-item label="考试名称">
            <a-input
              :maxLength="20"
              placeholder="请输入考试名称"
              v-decorator="['name', { rules: [{ required: true, message: '请输入考试名称!' }] ,initialValue: '' }]"
            />
          </a-form-item>
          <a-form-item label="重复考试">
            <a-radio-group
              v-decorator="['reexam', { rules: [{ required: true, message: '请选择重复考试!' }] ,initialValue: 1}]"
              name="radioGroup"
            >
              <a-radio :value="1">
                允许重复考试
              </a-radio>
              <a-radio :value="2">
                不允许重复考试
              </a-radio>
              <a-radio :value="3">
                仅允许未通过的重复考试
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="试卷选择">
            <SelectTestPager
              :disabled="!!$router.history.current.query.id"
              v-decorator="['questionnaire', { rules: [{ required: true, message: '请选择试卷选择!' }],initialValue: {} }]" />
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
          <a-form-item label="答卷时长">
            <TimeLimit
              v-decorator="['timeLimit', { rules: [{ required: true, message: '请选择答卷时长!' }],initialValue: 0 }]"
            >
            </TimeLimit>
          </a-form-item>
          <a-form-item label="通过分数">
            <a-input-number
              :disabled="!!$router.history.current.query.id"
              placeholder="请输入通过分数"
              v-decorator="['passScore', { rules: [{ required: true, message: '请输入通过分数!' }] ,initialValue: 0}]"
            />
            分
          </a-form-item>
          <a-form-item label="试用员工">
            <Employee
              v-if="!detailLoading"
              :employees="employees"
              v-decorator="['applicableObject', { rules: [{ required: true, message: '请选择试用员工!' }],initialValue:['all'] }]"
            />
            <a-spin v-else />
          </a-form-item>
          <a-form-item label="考试说明">
            <VueQuillEditor
              width="400px"
              v-if="!detailLoading"
              :height="'auto'"
              placeholder="请输入考试说明"
              v-decorator="['note', { rules: [{ required: true, message: '请输入考试说明!' }],initialValue:'' }]"
            />
            <a-spin v-else />
          </a-form-item>
          <div style="text-align: center">
            <a-button :loading="loading" style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
          </div>
        </a-form>
      </div>
    </a-spin>
  </div>
</template>

<script>
import breadcrumb from '../../components/Breadcrumd'
import VueQuillEditor from '@/components/VueQuillEditor'
import ImgUpload from '../../components/ImgUpload/index'
import Employee from '../../components/Employee/index'
import SelectTestPager from './components/SelectTestPager'
import router from '@/router'
import { message } from 'ant-design-vue'
import TimeLimit from './components/TimeLimit'
import { examAdd, examDetail, examEdit } from '@/api/study/exam'

export default {
  components: { breadcrumb, VueQuillEditor, ImgUpload, Employee, SelectTestPager, TimeLimit },
  data () {
    return {
      detailLoading: false,
      data: {},
      employees: [],
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  mounted () {
    if (router.history.current.query.id) {
      this.getDetail(router.history.current.query.id)
    }
    // this.form.setFieldsValue({
    //   note: '<h1>123</h1>'
    // })
  },
  methods: {
    getDetail (id) {
      this.detailLoading = true
      examDetail({ examId: id }).then((res) => {
        const detail = res.data || {}
        this.employees = detail.bindEmpList ? detail.bindEmpList.map(item => item.name) : []
        this.form.setFieldsValue({
          name: detail.name,
          reexam: detail.reexam,
          questionnaire: detail.questionnaireResults && detail.questionnaireResults[0],
          coverImageUrl: detail.coverImageUrl,
          timeLimit: detail.timeLimit,
          passScore: detail.passScore,
          applicableObject: detail.applicableObject === 1 ? ['all'] : detail.bindEmpList ? detail.bindEmpList.map(item => item.id) : [],
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
            ...values,
            questionnaireIds: [values.questionnaire.questionnaireId],
            applicableObject: values.applicableObject[0] === 'all' ? 1 : 2,
            empIds: values.applicableObject[0] === 'all' ? [] : values.applicableObject
          }
          if (router.history.current.query.id) {
            examEdit({ ...data, examId: router.history.current.query.id }).then(() => {
              router.back()
              message.success('考试修改成功！')
            }).finally(() => {
              this.loading = false
            })
          } else {
            examAdd(data).then(() => {
              router.back()
              message.success('考试创建成功！')
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
