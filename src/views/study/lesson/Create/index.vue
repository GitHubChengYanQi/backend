<template>
  <div>
    <breadcrumb :titles="['课程管理','新建课程']" back></breadcrumb>

    <div class="content">
      <div style="padding-bottom: 16px;display: flex">
        <div style="font-size: 16px;font-weight: bold;flex-grow: 1">新建课程</div>
        <div>
          <a-button style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
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
            v-decorator="['note', { rules: [{ required: true, message: '请输入课程名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="模板分类">
          <a-cascader
            :options="[]"
            placeholder="请选择模板分类"
            v-decorator="['class', { rules: [{ required: true, message: '请选择模板分类!' }] }]"
          />
        </a-form-item>
        <a-form-item
          label="选择课件"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 19 }"
        >
          <selectCourseware
            placeholder="请选择课件"
            v-decorator="['kejian', { rules: [{ required: true, message: '请选择课件!' }],initialValue:[] }]"
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
        <a-form-item label="试用员工">
          <Employee
            v-decorator="['syyg', { rules: [{ required: true, message: '请选择试用员工!' }],initialValue:['all'] }]"></Employee>
        </a-form-item>
        <a-form-item label="关联考试">
          <SelectExamination
            placeholder="请选择关联考试"
            v-decorator="['glks', { rules: [{ required: true, message: '请选择关联考试!' }],initialValue:'' }]"
          />
        </a-form-item>
        <a-form-item label="课程简介">
          <VueQuillEditor
            :height="'auto'"
            placeholder="请输入课程简介"
            v-decorator="['kcjj', { rules: [{ required: true, message: '请输入课程简介!' }],initialValue:'' }]"
          />
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../../components/Breadcrumd'
import selectCourseware from './compoents/SelectCourseware'
import SelectExamination from './compoents/SelectExamination'
import VueQuillEditor from '@/components/VueQuillEditor'
import ImgUpload from '../../components/ImgUpload/index'
import Employee from '../../components/Employee/index'

export default {
  components: { breadcrumb, selectCourseware, VueQuillEditor, ImgUpload, SelectExamination, Employee },
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
        console.log(values)
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
