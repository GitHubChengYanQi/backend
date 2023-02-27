<template>
  <div>
    <breadcrumb :titles="['课程管理',`${$router.history.current.query.id ? '编辑' : '创建'}课程`]" back back-tip></breadcrumb>
    <a-spin :spinning="detailLoading">
      <div class="content">
        <div style="padding-bottom: 16px;display: flex">
          <div style="font-size: 16px;font-weight: bold;flex-grow: 1">
            {{ `${$router.history.current.query.id ? '编辑' : '创建'}课程` }}
          </div>
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
              :suffix="`${form.getFieldValue('name') ? form.getFieldValue('name').length : 0} / 20`"
              placeholder="请输入课程名称"
              v-decorator="['name', { rules: [{ required: true, message: '请输入课程名称!' }] }]"
            />
          </a-form-item>
          <a-form-item label="课程分类">
            <a-cascader
              change-on-select
              v-if="!classTreeLoading"
              :options="classTree"
              placeholder="请选择课程分类"
              v-decorator="['courseClassId', { rules: [{ required: true, message: '请选择课程分类!' }] }]"
            />
            <a-spin v-else />
          </a-form-item>
          <a-form-item
            label="选择课件"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <selectCourseware
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
              建议尺寸：750 × 750
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
            <div style="height: 500px">
              <VueQuillEditor
                width="400px"
                v-if="!detailLoading"
                :height="'auto'"
                placeholder="请输入课程简介"
                v-decorator="['note', { rules: [{ required: true, message: '请输入课程简介!' }],initialValue:'' }]"
              />
              <a-spin v-else />
            </div>
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
import VueQuillEditor from '../../components/VueQuillEditor'
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
        this.hiddenExam = !(detail.examResults && detail.examResults[0])
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
        this.classTree = res.data.map(item => {
          return {
            ...item,
            children: (Array.isArray(item.children) && item.children.length > 0) ? item.children.map(item => ({
              ...item,
              children: null
            })) : null
          }
        })
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
            wareBindParams: values.wareBindParams ? values.wareBindParams.map((item, index) => ({
              ...item,
              sort: index,
              examId: item.exam ? item.examId : null
            })) : [],
            courseClassId: values.courseClassId ? values.courseClassId[values.courseClassId.length - 1] : null,
            questionnaireIds: values.questionnaireId ? [values.questionnaireId] : [],
            examIds: (values.exam && values.exam.examId) ? [values.exam.examId] : [],
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
