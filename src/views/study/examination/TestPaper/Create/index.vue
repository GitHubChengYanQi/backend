<template>
  <div class="create">
    <breadcrumb :titles="['考试管理','试卷管理',`${$router.history.current.query.id ? '编辑' : '创建'}试卷`]" back back-tip />

    <a-spin :spinning="detailLoading">
      <div>
        <div class="head">
          <div class="total">
            <div class="box">
              <img :src="require('@/assets/study/createTestPager01.png')">
              <div>
                <div class="num">{{ questions.length }}</div>
                总题数
              </div>
            </div>
            <div class="box">
              <img :src="require('@/assets/study/createTestPager02.png')">
              <div>
                <div class="num">{{ totalFen }}</div>
                当前总分
              </div>
            </div>
          </div>
          <div class="set">
            <div :style="{width: '120px'}">每题相同分：</div>
            <a-switch :disabled="disabled" v-model="sname" @change="switchChange" />
            <a-input-number :disabled="disabled" class="input" v-model="number" @change="numberChange" :min="0" />
            分
          </div>

          <a-button :loading="loading" style="border-radius: 8px" type="primary" @click="handleSubmit">
            保存
          </a-button>

        </div>

        <div class="content">
          <a-form
            class="form"
            :form="form"
            labelAlign="right"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 10 }"
          >
            <div class="name">
              <a-form-item label="试卷名称">
                <a-input
                  :maxLength="20"
                  placeholder="请输入试卷名称"
                  :suffix="`${form.getFieldValue('name') ? form.getFieldValue('name').length : 0} / 20`"
                  v-decorator="['name', { rules: [{ required: true, message: '请输入课程名称!' }],initialValue:'' }]"
                />
              </a-form-item>
            </div>
            <div class="questions">
              <div v-for="(questionItem,index) in questions" :key="questionItem.index">
                <div
                  class="custom-tree-node"
                >
                  <div
                    class="questionItem"
                  >
                    <div class="question">
                      <div class="questionTitle">问题{{ index + 1 }}</div>
                      <div class="questionContent">
                        <a-form-item label="试卷题目">
                          <div class="quesituionTextArea">
                            <a-textarea
                              auto-size
                              :max-length="100"
                              placeholder="试卷题目"
                              v-decorator="[`questions[${questionItem.index}].name`, { rules: [{ required: true, message: '请输入课程名称!' }] ,initialValue:''}]"
                            />
                            <div class="suffix">
                              {{ `${form.getFieldValue(`questions[${questionItem.index}].name`) ? form.getFieldValue(`questions[${questionItem.index}].name`).length : 0} / 100`
                              }}
                            </div>
                          </div>

                        </a-form-item>
                        <a-form-item label="题目类型" style="margin-bottom: 12px">
                          <a-radio-group
                            :disabled="disabled"
                            v-decorator="[`questions[${questionItem.index}].type`, { rules: [{ required: true, message: '请选择题目类型!' }],initialValue:'single' }]"
                            name="radioGroup"
                            @change="({target:{value}})=>updateType(value,questionItem.index)"
                          >
                            <a-radio value="single">
                              单选题
                            </a-radio>
                            <a-radio value="multiple">
                              多选题
                            </a-radio>
                            <a-radio value="judge">
                              判断题
                            </a-radio>
                          </a-radio-group>
                        </a-form-item>
                        <div v-if="questionItem.type !== 'judge'">
                          <Options
                            :form="form"
                            :item-index="index"
                            :options="questionItem.options"
                            :question-item-index="questionItem.index"
                            :disabled="disabled"
                            @addOption="addOption"
                            @removeOption="removeOption"
                            @updateQuestions="updateQuestions"
                          />
                        </div>
                        <a-form-item
                          style="margin-top: 12px"
                          label="正确答案"
                          :label-col="{ span: 2 }"
                          :wrapper-col="{ span: 12 }"
                        >
                          <div class="option">
                            <a-select
                              :disabled="disabled"
                              :mode="questionItem.type === 'multiple' ? 'multiple' : 'default'"
                              style="width: 597px"
                              :options="questionItem.type === 'judge' ? [{label: '正确',value:'true'},{label: '错误',value:'false'}] : questionItem.options.map((item,index)=>({label:String.fromCharCode(65 + index),value:String.fromCharCode(65 + index)}))"
                              placeholder="请选择正确答案"
                              v-decorator="[`questions[${questionItem.index}].answer`, { rules: [{ required: true, message: '请选择正确答案!' }] ,initialValue:[]}]"
                            >
                            </a-select>
                            <div class="other">
                              <div class="fen">
                                <div :style="{width: '42px'}">分值：</div>
                                <a-form-item
                                  :label-col="{ span: 2 }"
                                  :wrapper-col="{ span: 12 }"
                                >
                                  <a-input-number
                                    :disabled="sname || disabled"
                                    @change="count"
                                    class="input"
                                    :min="0"
                                    v-decorator="[`questions[${questionItem.index}].fen`, { initialValue:0 }]"
                                  />
                                </a-form-item>
                                分
                              </div>
                            </div>
                          </div>
                        </a-form-item>
                      </div>
                    </div>
                    <div class="actions" v-if="!disabled">
                      <a-icon
                        v-if="index === questions.length - 1"
                        type="plus-square"
                        @click="addQuestion"
                      />
                      <a-icon
                        type="delete"
                        v-if="questions.length !== 1"
                        @click="removeQuestion(questionItem.index)"
                      />
                      <DragIcon
                        class="my-handle"
                        :width="24"
                      />

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-form>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import breadcrumb from '../../../components/Breadcrumd'
import DragIcon from '../../../components/DragIcon'
import {
  learningQuestionnaireAdd,
  learningQuestionnaireCheckBind,
  learningQuestionnaireDetail,
  learningQuestionnaireEdit
} from '@/api/study/testPager'
import { message } from 'ant-design-vue'
import router from '@/router'
import Sortable from 'sortablejs'
import Options from './components/Options/index'

export default {
  data () {
    return {
      disabled: false,
      detailLoading: false,
      loading: false,
      totalFen: 0,
      dragQuestions: -1,
      dragOptions: -1,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      number: 0,
      sname: false,
      questions: [{
        index: 0,
        type: 'single',
        options: [
          {
            label: 'A',
            value: 0
          }
        ]
      }]
    }
  },
  mounted () {
    if (router.history.current.query.id) {
      this.getDetail(router.history.current.query.id)
    }
    const questions = document.querySelector('.questions')
    // 拖拽排序
    Sortable.create(questions, {
      delay: 0,
      handle: '.my-handle',
      animation: 300, // 拖拽延时，效果更好看
      onEnd: async (evt) => {
        this.questions.splice(evt.newIndex, 0, this.questions.splice(evt.oldIndex, 1)[0])
        // this.handleDrop(evt.newIndex, evt.oldIndex)
      }
    })
  },
  components: { breadcrumb, DragIcon, Options },
  methods: {
    getDetail (id) {
      this.detailLoading = true
      learningQuestionnaireCheckBind({ questionnaireId: id, type: 'edit' }).then((res) => {
        this.disabled = res.data
      })
      learningQuestionnaireDetail({ questionnaireId: id }).then((res) => {
        const detail = res.data || {}
        const questionResults = detail.questionResults || []
        this.questions = questionResults.map((item, index) => {
          const options = [];
          (item.answerResults || []).forEach((optionItem, index) => {
            options.push({
              label: String.fromCharCode(65 + index),
              value: index
            })
          })
          return {
            index,
            type: item.questionType,
            options
          }
        })
        this.sname = detail.sameScore === 1
        this.number = detail.questionScore

        setTimeout(() => {
          this.form.setFieldsValue({
            name: detail.questionnaireName,
            questions: questionResults.map((item, index) => {
              let answer = []
              const options = {};
              (item.answerResults || []).forEach((optionItem, index) => {
                if (optionItem.isTrue) {
                  if (item.questionType === 'multiple') {
                    answer.push(String.fromCharCode(65 + index))
                  } else if (item.questionType === 'single') {
                    answer = String.fromCharCode(65 + index)
                  } else {
                    answer = optionItem.answerContent === '正确' ? 'true' : 'false'
                  }
                }
                if (item.questionType === 'judge') {
                  return
                }
                options[String.fromCharCode(65 + index)] = optionItem.answerContent
              })
              return {
                name: item.questionContent,
                type: item.questionType,
                fen: item.score,
                options,
                answer
              }
            })
          })
          this.count()
          // this.switchChange(this.sname)
        }, 0)
      }).finally(() => {
        this.detailLoading = false
      })
    },
    switchChange (checked) {
      if (!checked) {
        return
      }
      setTimeout(() => {
        const questions = this.form.getFieldValue('questions')
        this.form.setFieldsValue({
          questions: questions.map((item, index) => {
            return {
              ...item,
              fen: this.number
            }
          })
        })
        this.count()
      }, 0)
    },
    numberChange (number) {
      if (this.sname) {
        const questions = this.form.getFieldValue('questions')
        this.form.setFieldsValue({ questions: questions.map((item) => ({ ...item, fen: number })) })
        this.count()
      }
    },
    count () {
      setTimeout(() => {
        const questions = this.form.getFieldValue('questions')
        if (!Array.isArray(questions)) {
          return
        }
        if (this.sname) {
          this.totalFen = questions.length * this.number
          return
        }
        let num = 0
        questions.forEach(item => {
          num += item.fen
        })
        this.totalFen = num
      }, 0)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        const questions = []
        this.questions.forEach(item => {
          questions.push(values.questions[item.index])
        })
        if (!err) {
          this.loading = true
          const data = {
            questionnaireName: values.name,
            sameScore: this.sname ? 1 : 0,
            questionScore: this.number,
            questionParams: questions.map((item, index) => {
              return {
                questionContent: item.name,
                questionType: item.type,
                sort: index,
                score: item.fen,
                answerResults: item.type === 'judge' ? [{
                  answerContent: 'true',
                  isTrue: item.answer === 'true' ? 1 : 0,
                  sort: 0,
                  prefix: 'A'
                }, {
                  answerContent: 'false',
                  isTrue: item.answer === 'false' ? 1 : 0,
                  sort: 1,
                  prefix: 'B'
                }] : this.questions[index].options.map((optionItem, optionIndex) => {
                  let answer = false
                  switch (item.type) {
                    case 'single':
                      answer = item.answer === String.fromCharCode(65 + optionIndex)
                      break
                    case 'multiple':
                      answer = item.answer.find(answer => answer === String.fromCharCode(65 + optionIndex))
                      break
                  }
                  return {
                    answerContent: item.options[optionItem.label],
                    isTrue: answer ? 1 : 0,
                    sort: optionIndex,
                    prefix: String.fromCharCode(65 + optionIndex)
                  }
                })
              }
            })
          }
          if (router.history.current.query.id) {
            learningQuestionnaireEdit({ ...data, questionnaireId: router.history.current.query.id }).then(() => {
              router.back()
              message.success('修改试卷成功!')
            }).finally(() => {
              this.loading = false
            })
          } else {
            learningQuestionnaireAdd(data).then(() => {
              router.back()
              message.success('创建试卷成功!')
            }).finally(() => {
              this.loading = false
            })
          }
        } else {
          message.warn('请检查必填项！')
        }
      })
    },
    updateType (value, key) {
      this.questions = this.questions.map((item) => {
        if (item.index === key) {
          return { ...item, type: value }
        }
        return item
      })
      this.form.setFieldsValue({ [`questions[${key}].answer`]: [] })
    },
    addQuestion () {
      this.questions.push({
        index: this.questions.length,
        type: 'single',
        options: [
          {
            label: 'A',
            value: 0
          }
        ]
      })
      this.switchChange(this.sname)
    },
    removeQuestion (key) {
      const question = this.form.getFieldValue('questions')
      this.questions = this.questions.filter(item => item.index !== key).map(item => {
        if (key < item.index) {
          return { ...item, index: item.index - 1 }
        }
        return item
      })
      setTimeout(() => {
        this.form.setFieldsValue({ questions: question.filter((item, index) => index !== key) })
        this.count()
      }, 0)
    },
    addOption (value, key, target) {
      const updateFileds = {}
      const question = this.form.getFieldValue(`questions[${key}]`)
      this.questions = this.questions.map((item, index) => {
        if (key === item.index) {
          Object.keys(question.options).forEach(option => {
            if (option.charCodeAt(0) > (65 + value)) {
              const newOption = String.fromCharCode(option.charCodeAt(0) + 1)
              updateFileds[`questions[${item.index}].options.${newOption}`] = question.options[option]
            }
          })
          const newOptions = item.options.map(item => {
            if (item.value > value) {
              return { label: String.fromCharCode(item.label.charCodeAt(0) + 1), value: item.value + 1 }
            }
            return item
          })
          newOptions.splice(value + 1, 0, {
            label: String.fromCharCode(65 + value + 1),
            value: value + 1
          })
          return {
            ...item,
            options: newOptions
          }
        }
        return item
      })
      setTimeout(() => {
        const textArea = document.getElementsByClassName(target).item(0)
        textArea.focus()
        this.form.setFieldsValue({
          ...updateFileds,
          [`questions[${key}].options.${String.fromCharCode(65 + value + 1)}`]: '',
          [`questions[${key}].answer`]: []
        })
      }, 0)
    },
    removeOption (value, key, optionValue) {
      const updateFileds = {}
      const options = this.form.getFieldValue(`questions[${key}].options`)
      this.questions = this.questions.map((item) => {
        if (key === item.index) {
          item.options.forEach((option, index) => {
            if (index > value || index < value) {
              const newValue = options[option.label]
              if (option.value > optionValue) {
                const newOption = String.fromCharCode(option.label.charCodeAt(0) - 1)
                updateFileds[`questions[${item.index}].options.${newOption}`] = newValue
              } else {
                updateFileds[`questions[${item.index}].options.${option.label}`] = newValue
              }
            }
          })
          const newOptions = item.options.filter(item => item.value !== optionValue)
          return {
            ...item,
            options: newOptions.map(item => {
              if (item.value > optionValue) {
                return { label: String.fromCharCode(item.label.charCodeAt(0) - 1), value: item.value - 1 }
              }
              return item
            })
          }
        }
        return item
      })
      this.form.setFieldsValue({ ...updateFileds, [`questions[${key}].answer`]: [] })
    },
    updateQuestions (questionItemIndex, newIndex, oldIndex) {
      let questionsIndex = 0
      this.questions.forEach((item, index) => {
        if (item.index === questionItemIndex) {
          questionsIndex = index
        }
      })
      const append = this.questions[questionsIndex].options.splice(oldIndex, 1)[0]
      this.questions[questionsIndex].options.splice(newIndex, 0, append)
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

.create {

}

.tree {
  /deep/ .el-tree-node__content {
    height: auto;
    width: 100%;
    background-color: #fff;
    align-items: normal;

    .custom-tree-node {
      width: 100%;
    }

    .el-tree-node__expand-icon.is-leaf {
      min-height: 100%;
      padding: 0;
    }
  }
}

.head {
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: #fff;
  margin-bottom: 24px;
  gap: 24px;
  border-radius: 8px;

  .total {
    display: flex;
    width: 50%;
    gap: 24px;

    .box {
      border-radius: 8px;
      flex-grow: 1;
      padding: 12px;
      background-color: #fbfbfe;
      gap: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-items: center;

      img {
        width: 80px;
        height: 80px;
      }

      > div {
        padding-bottom: 16px;
      }

      .num {
        font-weight: bold;
        font-size: 32px;
      }
    }
  }

}

.set {
  width: 50%;
  display: flex;
  align-items: center;

  .input {
    height: 40px;
    border-radius: 4px;
    margin: 0 12px;
    width: 100px;
    border: none;
    background-color: #F5F6FA;

    /deep/ input {
      height: 40px;
      text-align: center;
    }
  }
}

.fen {
  display: flex;
  align-items: center;

  /deep/ .ant-form-item {
    margin-bottom: 0;
  }

  .input {
    height: 40px;
    border-radius: 4px;
    margin: 0 12px;
    width: 100px;
    border: none;
    background-color: #F5F6FA;

    /deep/ input {
      height: 40px;
      text-align: center;
    }
  }
}

.content {
  padding: 24px 0;
  background-color: #fff;
  border-radius: 8px;

  .name {
    padding: 0 24px;
  }

  .questionItem {
    display: flex;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 24px;

    .question {
      width: 70%;

      .questionTitle {
        border-left: solid 2px #1890ff;
        padding-left: 8px;
      }

      .questionContent {
        border: solid 1px #DCDFE6;
        border-radius: 8px;
        padding: 24px;
        margin: 24px 0 0 24px;

        .option {
          display: flex;
          align-items: center;
          gap: 24px;

          /deep/ .ant-select-selection {

          }

          .other {
            display: inline-block;
          }

        }
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 24px;

      i, div {
        font-size: 24px;
        line-height: 40px;
      }
    }
  }
}

.optionItem {
  margin: 0;
  padding: 12px 0;
}

.submit {
  padding: 24px;
  text-align: center;
}

.quesituionTextArea {
  position: relative;

  .suffix {
    position: absolute;
    bottom: 0;
    right: 12px;
  }

  /deep/ textarea {
    padding-right: 70px;
  }
}
</style>
