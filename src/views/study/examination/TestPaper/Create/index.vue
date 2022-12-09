<template>
  <div>
    <breadcrumb :titles="['考试管理','试卷管理','创建试卷']" back></breadcrumb>

    <div>
      <div class="head">
        <div class="total">
          <div class="box">
            <a-icon type="form" class="icon" />
            <div>
              <div class="num">155</div>
              总题数
            </div>
          </div>
          <div class="box">
            <a-icon type="form" class="icon" />
            <div>
              <div class="num">155</div>
              当前总分
            </div>
          </div>
        </div>
        <div class="set">
          <div :style="{width: '120px'}">每题相同分：</div>
          <a-switch />
          <a-input-number class="input" v-model="number" />
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
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag">
            <div
              class="custom-tree-node"
              slot-scope="{ node, data:questionItem }"
              @mouseenter="mouseenter(node)"
              @mouseleave="mouseleave(node)"
            >
              <div
                class="questionItem"
              >
                <div class="question">
                  <div class="questionTitle">问题{{ questionItem.index }}</div>
                  <div class="questionContent">
                    <a-form-item label="试卷题目">
                      <a-input
                        placeholder="请输入试卷名称"
                        v-decorator="[`questions[${questionItem.index}].name`, { rules: [{ required: true, message: '请输入课程名称!' }] ,initialValue:''}]"
                      />
                    </a-form-item>
                    <a-form-item label="题目类型">
                      <a-radio-group
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
                      <a-form-item
                        v-for="(option,optionIndex) in Object.keys(questionItem.options || {'A':''})"
                        :key="optionIndex"
                        :label="option"
                        :label-col="{ span: 2 }"
                        :wrapper-col="{ span: 12 }"
                      >
                        <div class="option">
                          <a-input
                            placeholder="请输入选项"
                            v-decorator="[`questions[${questionItem.index}].options.${option}`, { rules: [{ required: true, message: '请输入选项!' }],initialValue:'' }]"
                          />
                          <div class="other">
                            <div class="actions">
                              <a-icon type="plus-square" @click="addOption(option,questionItem.index)" />
                              <a-icon
                                v-if="Object.keys(questionItem.options || {'A':''}).length !== 1"
                                type="minus-square"
                                @click="removeOption(option,questionItem.index)" />
                              <DragIcon :width="24" />
                            </div>
                          </div>
                        </div>
                      </a-form-item>
                    </div>


                    <a-form-item
                      label="正确答案"
                      :label-col="{ span: 2 }"
                      :wrapper-col="{ span: 12 }"
                    >
                      <div class="option">
                        <a-select
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
                <div class="actions">
                  <a-icon type="plus-square" @click="addQuestion" />
                  <a-icon type="delete" v-if="questions.length !== 1" @click="removeQuestion(questionItem.index)" />
                  <DragIcon :width="24" />
                </div>
              </div>
            </div>
          </el-tree>
          <div class="submit">
            <a-button style="border-radius: 8px" type="primary" @click="handleSubmit">保存</a-button>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../../../components/Breadcrumd'
import DragIcon from '../../../components/DragIcon'

export default {
  data () {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      number: 0,
      questions: [{
        index: 0,
        type: 'single',
        options: {
          'A': ''
        }
      }]
    }
  },
  components: { breadcrumb, DragIcon },
  methods: {
    handleSubmit () {
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          // console.log(values)
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
    },
    addQuestion () {
      this.questions.push({
        index: this.questions.length,
        type: 'single',
        options: {
          'A': ''
        }
      })
    },
    removeQuestion (key) {
      const question = this.form.getFieldValue('questions')
      this.form.setFieldsValue({ questions: question.filter((item, index) => index !== key) })
      this.questions = this.questions.filter((item, index) => index !== key).map((item, index) => ({ ...item, index }))
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
              const newOption = String.fromCharCode(option.charCodeAt(0) - 1)
              updateFileds[`questions[${index}].options.${newOption}`] = options[option]
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
      })

      setTimeout(() => {
        this.form.setFieldsValue(updateFileds)
      }, 0)
    },
    mouseenter (node) {
      this.visible = node.id
    },
    mouseleave (node) {
      this.visible = -1
    },
    handleDragStart (node, ev) {

    },
    handleDragEnter (draggingNode, dropNode, ev) {

    },
    handleDragLeave (draggingNode, dropNode, ev) {

    },
    handleDragOver (draggingNode, dropNode, ev) {

    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {

    },
    handleDrop (draggingNode, dropNode, dropType, ev) {

    },
    allowDrop (draggingNode, dropNode, type) {
      return type !== 'inner'
    },
    allowDrag (draggingNode) {
      return true
    }
  }
}
</script>

<style lang="less" scoped>

.tree {
  /deep/ .el-tree-node__content {
    height: auto;
    width: 100%;
    background-color: #fff;

    .custom-tree-node {
      width: 100%;
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

.submit {
  padding: 24px;
  text-align: center;
}
</style>
