<template>
  <div>
    <breadcrumb :titles="['考试管理','新建考试']" back></breadcrumb>

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
            v-decorator="['questionnaireId', { rules: [{ required: true, message: '请选择试卷选择!' }],initialValue: '' }]" />
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
            placeholder="请输入通过分数"
            v-decorator="['passScore', { rules: [{ required: true, message: '请输入通过分数!' }] ,initialValue: 0}]"
          />
          分
        </a-form-item>
        <a-form-item label="试用员工">
          <Employee
            v-decorator="['applicableObject', { rules: [{ required: true, message: '请选择试用员工!' }],initialValue:['all'] }]"
          >
          </Employee>
        </a-form-item>
        <a-form-item label="考试说明">
          <VueQuillEditor
            :height="'auto'"
            placeholder="请输入考试说明"
            v-decorator="['note', { rules: [{ required: true, message: '请输入考试说明!' }],initialValue:'' }]"
          />
        </a-form-item>
        <div style="text-align: center">
          <a-button :loading="loading" style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
        </div>
      </a-form>
    </div>
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
import { examAdd } from '@/api/study/exam'

export default {
  components: { breadcrumb, VueQuillEditor, ImgUpload, Employee, SelectTestPager, TimeLimit },
  data () {
    return {
      data: {},
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log({
          ...values,
          questionnaireIds: [values.questionnaireId],
          applicableObject: values.applicableObject[0] === 'all' ? 1 : 2,
          empIds: values.applicableObject[0] === 'all' ? [] : values.applicableObject
        })
        if (!err) {
          this.loading = true
          examAdd({
            ...values,
            questionnaireIds: [values.questionnaireId],
            applicableObject: values.applicableObject[0] === 'all' ? 1 : 2,
            empIds: values.applicableObject[0] === 'all' ? [] : values.applicableObject
          }).then(() => {
            router.back()
            message.success('考试创建成功！')
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
