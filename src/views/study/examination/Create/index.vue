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
            v-decorator="['note', { rules: [{ required: true, message: '请输入考试名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="重复考试">
          <a-radio-group
            v-decorator="['cfks', { rules: [{ required: true, message: '请选择重复考试!' }] }]"
            name="radioGroup"
            :default-value="1"
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
          <SelectTestPager v-decorator="['sj', { rules: [{ required: true, message: '请选择试卷选择!' }] }]" />
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
        <a-form-item label="答卷时长">
          <a-radio-group
            v-decorator="['djsc', { rules: [{ required: true, message: '请选择答卷时长!' }] }]"
            name="radioGroup"
            :default-value="1"
          >
            <a-radio :value="1">
              限定时长
            </a-radio>
            <a-radio :value="2">
              不限定时长
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="通过分数">
          <a-input-number
            placeholder="请输入通过分数"
            v-decorator="['note', { rules: [{ required: true, message: '请输入通过分数!' }] }]"
          />
          分
        </a-form-item>
        <a-form-item label="试用员工">
          <Employee
            v-decorator="['syyg', { rules: [{ required: true, message: '请选择试用员工!' }],initialValue:['all'] }]"></Employee>
        </a-form-item>
        <a-form-item label="考试说明">
          <VueQuillEditor
            :height="'auto'"
            placeholder="请输入考试说明"
            v-decorator="['kcjj', { rules: [{ required: true, message: '请输入考试说明!' }],initialValue:'' }]"
          />
        </a-form-item>
        <div style="text-align: center">
          <a-button style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
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

export default {
  components: { breadcrumb, VueQuillEditor, ImgUpload, Employee, SelectTestPager },
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
