<template>
  <div style="text-align: center">
    <a-form
      class="form"
      labelAlign="right"
      :form="form"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-item label="选择员工">
        <Employee
          v-decorator="['applicableObject', { rules: [{ required: true, message: '请选择员工!' }],initialValue:['all'] }]"
        >
        </Employee>
      </a-form-item>
      <a-form-item label="限定时长">
        <TimeLimit
          v-decorator="['timeLimit', { initialValue: [] }]"
        >
        </TimeLimit>
      </a-form-item>
    </a-form>

    <a-button
      type="primary"
      style="border-radius: 8px"
      class="add"
      @click="submit"
    >
      确定
    </a-button>
  </div>
</template>

<script>
import Employee from '../../../components/Employee'
import TimeLimit from '../TimeLimit'

export default {
  components: { Employee, TimeLimit },
  data () {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    submit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('onSubmit', values)
        }
      })
    }
  }
}
</script>
