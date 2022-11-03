<template>
  <div>
    <a-modal v-model="visible" :title="title" :footer="null">
      <a-form
        :form="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        labelAlign="right"
        @submit="handleSubmit"
      >
        <a-form-item label="分组名称:">
          <a-input
            placeholder="请输入分组名称"
            :maxLength="15"
            v-decorator="['name', { rules: [{ required: true, message: '请输入分组名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="分组描述：">
          <a-textarea v-decorator="['description']" placeholder="请输分组描述，不超过50个字" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24 }">
          <a-row type="flex" justify="center">
            <Space>
              <a-button @click="visible = false"> 取消 </a-button>
              <a-button type="primary" html-type="submit"> 确定 </a-button>
            </Space>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { Space } from 'ant-design-vue'
import { categoryAdd, categoryEdit } from '@/api/healthManage'
export default {
  components: { Space },
  data () {
    return {
      form: this.$form.createForm(this),
      title: '添加分组',
      visible: false,
      type: 'add',
      categoryId: ''
    }
  },
  methods: {
    open (type, obj) {
      this.type = type
      this.visible = true
      this.$nextTick(() => {
        if (this.type == 'edit') {
          this.categoryId = obj.categoryId
          this.form.setFieldsValue({
            name: obj.name,
            description: obj.description
          })
        } else {
          this.form.setFieldsValue({
            name: '',
            description: ''
          })
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          let data
          if (this.type == 'add') {
            data = await categoryAdd(values)
          } else if (this.type == 'edit') {
            data = await categoryEdit({ ...values, categoryId: this.categoryId })
          }
          if (data.code == 200) {
            this.$message.success('操作成功')
            this.visible = false
            this.$emit('updateList')
          } else {
            this.$message.success('操作失败')
          }
        }
      })
    }
  }
}
</script>

<style>
</style>
