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
import VueQuillEditor from '../../components/VueQuillEditor'
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
