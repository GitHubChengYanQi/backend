<template>
  <div :class="'option'+questionItemIndex">
    <div
      v-for="(option,index) in array"
      :key="option.value"
    >
      <div
        class="custom-tree-node"
      >
        <a-form-item
          class="optionItem"
          :label="String.fromCharCode(65 +index)"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 12 }"
        >
          <div class="option">
            <div class="quesituionTextArea">
              <a-textarea
                :class="'text'+questionItemIndex+index"
                @keydown="(event)=>keydown(event,'text'+questionItemIndex+(index+1),index,questionItemIndex,array)"
                auto-size
                :max-length="100"
                placeholder="请输入选项，回车自动创建下一个选项"
                v-decorator="[`questions[${questionItemIndex}].options.${option.label}`, { rules: [{ required: true, message: '请输入选项!' }],initialValue:'' }]"
              />
              <div class="suffix">
                {{
                  `${form.getFieldValue(`questions[${questionItemIndex}].options.${option.label}`) ? form.getFieldValue(`questions[${questionItemIndex}].options.${option.label}`).length : 0} / 100`
                }}
              </div>
            </div>
            <div class="other" v-if="!disabled">
              <div class="actions">
                <a-icon
                  v-if="options.length < 6"
                  type="plus-square"
                  @click="$emit('addOption',index,questionItemIndex,'text'+questionItemIndex+(index+1),index)"
                />
                <a-icon
                  v-if="options.length !== 1"
                  type="minus-square"
                  @click="$emit('removeOption',index,questionItemIndex,option.value)"
                />
                <DragIcon
                  class="my-handle"
                  :width="24"
                />
              </div>
            </div>
          </div>
        </a-form-item>
      </div>
    </div>
  </div>
</template>

<script>
import DragIcon from '../../../../../components/DragIcon'
import Sortable from 'sortablejs'

export default {
  components: { DragIcon },
  // eslint-disable-next-line vue/require-prop-types
  props: ['questionItemIndex', 'options', 'disabled', 'form', 'itemIndex'],
  data () {
    return {
      array: []
    }
  },
  created () {
    this.array = this.options
  },
  watch: {
    options (value) {
      this.array = value
    }
  },
  mounted () {
    const options = document.querySelector(`.option${this.questionItemIndex}`)
    // 拖拽排序
    Sortable.create(options, {
      delay: 0,
      handle: '.my-handle',
      animation: 300, // 拖拽延时，效果更好看
      onEnd: async (evt) => {
        this.$emit('updateQuestions', this.questionItemIndex, evt.newIndex, evt.oldIndex)
      }
    })
  },
  methods: {
    keydown (event, target, index, questionItemIndex, array) {
      if (event.keyCode === 13 && array.length < 6) {
        this.$emit('addOption', index, questionItemIndex, target)
        event.preventDefault()
      }
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
      }
    }
  }
}

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

.actions {
  display: flex;
  align-items: center;
  gap: 24px;

  i, div {
    font-size: 24px;
    line-height: 40px;
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
  flex-grow: 1;

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
