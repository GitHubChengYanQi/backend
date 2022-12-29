<template>
  <div class="create">
    <breadcrumb :titles="['考试管理','试卷管理','创建试卷']" back back-tip></breadcrumb>

    <a-spin :spinning="detailLoading">
      <div>
        <div class="head">
          <div class="total">
            <div class="box">
              <a-icon type="form" class="icon" />
              <div>
                <div class="num">{{ questions.length }}</div>
                总题数
              </div>
            </div>
            <div class="box">
              <a-icon type="form" class="icon" />
              <div>
                <div class="num">{{ totalFen }}</div>
                当前总分
              </div>
            </div>
          </div>
          <div class="set">
            <div :style="{width: '120px'}">每题相同分：</div>
            <a-switch :disabled="disabled" v-model="sname" @change="switchChange" />
            <a-input-number :disabled="disabled" class="input" v-model="number" @change="numberChange" />
            分
          </div>

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
                  v-decorator="['name', { rules: [{ required: true, message: '请输入课程名称!' }],initialValue:'' }]"
                />
              </a-form-item>
            </div>
            <el-tree
              class="tree"
              :data="questions"
              icon-class="icon"
              node-key="index"
              @node-drag-over="handleDragOver"
              @node-drop="handleDrop"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag">
              <div
                class="custom-tree-node"
                slot-scope="{ node, data:questionItem }"
              >
                <div
                  class="questionItem"
                >
                  <div class="question">
                    <div class="questionTitle">问题{{ questionItem.index + 1 }}</div>
                    <div class="questionContent">
                      <a-form-item label="试卷题目">
                        <a-textarea
                          auto-size
                          :max-length="100"
                          placeholder="请输入试卷名称"
                          v-decorator="[`questions[${questionItem.index}].name`, { rules: [{ required: true, message: '请输入课程名称!' }] ,initialValue:''}]"
                        />
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
                        <el-tree
                          class="tree optionTree"
                          :data="Object.keys(questionItem.options || {'A':''}).map(item=>({option:item,key:questionItem.index}))"
                          icon-class="icon"
                          node-key="option"
                          @node-drag-over="optionsHandleDragOver"
                          @node-drop="optionsHandleDrop"
                          draggable
                          :allow-drop="optionsAlowDrop"
                          :allow-drag="(node)=>optionsAllowDrag(node.data.option+questionItem.index)">
                          <div
                            class="custom-tree-node"
                            slot-scope="{ node, data:{option} }"
                          >
                            <a-form-item
                              class="optionItem"
                              :label="option"
                              :label-col="{ span: 2 }"
                              :wrapper-col="{ span: 12 }"
                            >
                              <div class="option">
                                <a-textarea
                                  auto-size
                                  :max-length="100"
                                  placeholder="请输入选项"
                                  v-decorator="[`questions[${questionItem.index}].options.${option}`, { rules: [{ required: true, message: '请输入选项!' }],initialValue:'' }]"
                                />
                                <div class="other" v-if="!disabled">
                                  <div class="actions">
                                    <a-icon
                                      v-if="Object.keys(questionItem.options || {'A':''}).length < 6"
                                      type="plus-square"
                                      @click="addOption(option,questionItem.index)"
                                    />
                                    <a-icon
                                      v-if="Object.keys(questionItem.options || {'A':''}).length !== 1"
                                      type="minus-square"
                                      @click="removeOption(option,questionItem.index)" />
                                    <div
                                      @mouseenter="optionMouseenter(option+questionItem.index)"
                                      @mouseleave="optionMouseleave()"
                                    >
                                      <DragIcon
                                        :width="24"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a-form-item>
                          </div>
                        </el-tree>
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
                            :options="questionItem.type === 'judge' ? [{label: '正确',value:'true'},{label: '错误',value:'false'}] : Object.keys(questionItem.options).map(item=>({label:item,value:item}))"
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
                      v-if="questionItem.index === questions.length - 1"
                      type="plus-square"
                      @click="addQuestion"
                    />
                    <a-icon type="delete" v-if="questions.length !== 1" @click="removeQuestion(questionItem.index)" />
                    <div
                      @mouseenter="mouseenter(questionItem)"
                      @mouseleave="mouseleave(questionItem)"
                    >
                      <DragIcon
                        :width="24"
                      />
                    </div>

                  </div>
                </div>
              </div>
            </el-tree>
            <div class="submit">
              <a-button :loading="loading" style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
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
        options: {
          'A': ''
        }
      }]
    }
  },
  mounted () {
    if (router.history.current.query.id) {
      this.getDetail(router.history.current.query.id)
    }
  },
  components: { breadcrumb, DragIcon },
  methods: {
    getDetail (id) {
      this.detailLoading = true
      learningQuestionnaireCheckBind({ questionnaireId: id, type: 'edit' }).then((res) => {
        console.log(res.data)
        this.disabled = res.data
      })
      learningQuestionnaireDetail({ questionnaireId: id }).then((res) => {
        const detail = res.data || {}
        const questionResults = detail.questionResults || []
        this.questions = questionResults.map((item, index) => {
          const options = {};
          (item.answerResults || []).forEach((optionItem, index) => {
            options[String.fromCharCode(65 + index)] = optionItem.answerContent
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
                    answer = optionItem.answerContent
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
      setTimeout(() => {
        const questions = this.form.getFieldValue('questions')
        this.form.setFieldsValue({
          questions: questions.map((item, index) => {
            if (index === questions.length - 1) {
              return {
                ...item,
                fen: checked ? this.number : 0
              }
            }
            return item
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
        if (!err) {
          this.loading = true
          const data = {
            questionnaireName: values.name,
            sameScore: this.sname ? 1 : 0,
            questionScore: this.number,
            questionParams: values.questions.map((item, index) => {
              return {
                questionContent: item.name,
                questionType: item.type,
                sort: index,
                score: item.fen,
                answerParams: item.type === 'judge' ? [{
                  answerContent: 'true',
                  isTrue: item.answer === 'true' ? 1 : 0,
                  sort: 0
                }, {
                  answerContent: 'false',
                  isTrue: item.answer === 'false' ? 1 : 0,
                  sort: 1
                }] : Object.keys(item.options).map((optionItem, optionIndex) => {
                  let answer = false
                  switch (item.type) {
                    case 'single':
                      answer = item.answer === optionItem
                      break
                    case 'multiple':
                      answer = item.answer.find(answer => answer === optionItem)
                      break
                  }
                  return {
                    answerContent: item.options[optionItem],
                    isTrue: answer ? 1 : 0,
                    sort: optionIndex
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
      this.questions = this.questions.map((item, index) => {
        if (index === key) {
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
        options: {
          'A': ''
        }
      })
      this.switchChange(this.sname)
    },
    removeQuestion (key) {
      const question = this.form.getFieldValue('questions')
      this.questions = this.questions.filter((item, index) => index !== key).map((item, index) => ({ ...item, index }))
      setTimeout(() => {
        this.form.setFieldsValue({ questions: question.filter((item, index) => index !== key) })
        this.count()
      }, 0)
    },
    addOption (char = '', key) {
      const updateFileds = {}
      const newOption = String.fromCharCode(char.charCodeAt(0) + 1)
      const question = this.form.getFieldValue(`questions[${key}]`)
      const newOptions = { ...question.options }
      this.questions = this.questions.map((item, index) => {
        if (key === index) {
          Object.keys(question.options).forEach(option => {
            if (option.charCodeAt(0) > char.charCodeAt(0)) {
              const newOption = String.fromCharCode(option.charCodeAt(0) + 1)
              newOptions[newOption] = ''
              updateFileds[`questions[${index}].options.${newOption}`] = question.options[option]
            }
          })
          return { ...item, options: { ...newOptions, [newOption]: '' } }
        }
        return item
      })
      setTimeout(() => {
        this.form.setFieldsValue({ ...updateFileds, [`questions[${key}].options.${newOption}`]: '' })
      }, 0)
    },
    removeOption (char = '', key) {
      const updateFileds = {}
      const options = this.form.getFieldValue(`questions[${key}].options`)
      const newOptions = {}
      this.questions = this.questions.map((item, index) => {
        if (key === index) {
          Object.keys(options).forEach((option, optionIndex) => {
            if (optionIndex === Object.keys(options).length - 1) {
              if (char !== option) {
                const newOption = String.fromCharCode(option.charCodeAt(0) - 1)
                updateFileds[`questions[${index}].options.${newOption}`] = options[option]
              }
            } else if (option.charCodeAt(0) > char.charCodeAt(0)) {
              const newOption = String.fromCharCode(option.charCodeAt(0) - 1)
              updateFileds[`questions[${index}].options.${newOption}`] = options[option]
              newOptions[option] = ''
            } else {
              newOptions[option] = options[option]
            }
          })
          return { ...item, options: newOptions }
        }
        return item
      })
      setTimeout(() => {
        this.form.setFieldsValue(updateFileds)
      }, 0)
    },
    mouseenter (node) {
      this.dragQuestions = node.index
    },
    mouseleave () {
      this.dragQuestions = -1
    },
    optionMouseenter (key) {
      this.dragOptions = key
    },
    optionMouseleave () {
      this.dragOptions = -1
    },
    handleDragOver (draggingNode, dropNode, ev) {

    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      this.questions = this.questions.map((item, index) => {
        return { ...item, index }
      })

      const startQuestion = this.form.getFieldValue(`questions[${draggingNode.data.index}]`)
      const endQuestion = this.form.getFieldValue(`questions[${dropNode.data.index}]`)

      setTimeout(() => {
        this.form.setFieldsValue({
          [`questions[${draggingNode.data.index}]`]: endQuestion,
          [`questions[${dropNode.data.index}]`]: startQuestion
        })
      }, 0)
    },
    allowDrop (draggingNode, dropNode, type) {
      return type !== 'inner'
    },
    allowDrag (draggingNode) {
      return draggingNode.data.index === this.dragQuestions
    },

    optionsHandleDragOver (draggingNode, dropNode, ev) {

    },
    optionsHandleDrop (draggingNode, dropNode, dropType, ev) {
      this.questions = this.questions.map((item) => {
        return item
      })

      const startOption = this.form.getFieldValue(`questions[${draggingNode.data.key}].options.${draggingNode.data.option}`)
      const endOption = this.form.getFieldValue(`questions[${dropNode.data.key}].options.${dropNode.data.option}`)

      setTimeout(() => {
        this.form.setFieldsValue({
          [`questions[${draggingNode.data.key}].options.${draggingNode.data.option}`]: endOption,
          [`questions[${dropNode.data.key}].options.${dropNode.data.option}`]: startOption
        })
      }, 0)
    },
    optionsAlowDrop (draggingNode, dropNode, type) {
      return type !== 'inner'
    },
    optionsAllowDrag (key) {
      return key === this.dragOptions
    }
  }
}
</script>

<style lang="less" scoped>

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
      padding: 24px;
      background-color: #fbfbfe;
      gap: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-items: center;

      .icon {
        font-size: 56px;
        box-shadow: 0 0 5px 0 #02020275;
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
</style>
