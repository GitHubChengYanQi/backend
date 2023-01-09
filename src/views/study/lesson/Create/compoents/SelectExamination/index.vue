<template>
  <div>
    <div @click="visible = true" v-if="!name">
      <a-button v-if="type === '1'" style="width: 200px;border-radius: 8px" class="add">
        <a-icon type="plus" />
        关联
      </a-button>
      <a-button v-if="type === '2'" class="successButton">
        关联考试
      </a-button>
    </div>
    <div v-else>
      <a-badge>
        <div slot="count">
          <a-icon type="close-circle" style="cursor: pointer" @click="remove" />
        </div>
        <a-button style="width: 200px;border-radius: 8px" :class="type === '2' ? 'successButton' : 'linkButton'">
          <div class="selectTestPager">{{ name }}</div>
        </a-button>
      </a-badge>
      <a-button type="link" @click="preview = true">
        预览
      </a-button>
    </div>
    <a-modal
      :footer="null"
      destroyOnClose
      :width="1200"
      title="选择考试"
      :visible="visible"
      @cancel="visible = false"
    >
      <examination
        select
        @selectRow="selectExamination"
      />
      <div style="text-align: center">
        <a-button
          type="primary"
          style="border-radius: 8px"
          class="add"
          @click="submit"
        >
          确定
        </a-button>
      </div>
    </a-modal>

    <a-modal
      :footer="null"
      destroyOnClose
      :width="1200"
      :title="'试卷名称：'+questionnaire.questionnaireName"
      :visible="preview"
      @cancel="preview = false"
    >
      <TestPaperDetail preview :questionResults="questionnaire.questionResults" />
    </a-modal>
  </div>
</template>

<script>
import examination from '../../../../examination/index'
import TestPaperDetail from '../../../../examination/Detail/components/TestPaperDetail/index'

export default {
  components: { examination, TestPaperDetail },
  props: {
    value: {
      type: Object,
      default: _ => {
      }
    },
    showStyle: {
      type: String,
      default: _ => ''
    },
    type: {
      type: String,
      default: _ => '1'
    }
  },
  data () {
    return {
      preview: false,
      selectRow: null,
      name: '',
      questionnaire: {},
      visible: false
    }
  },
  created () {
    if (this.value) {
      this.name = this.value.name
      this.selectRow = this.value
      if (this.value.questionnaireResults) {
        this.questionnaire = this.value.questionnaireResults[0] || {}
      }
    }
  },
  watch: {
    value (value) {
      if (value) {
        this.name = value.name
        this.selectRow = value
        if (value.questionnaireResults) {
          this.questionnaire = this.value.questionnaireResults[0] || {}
        }
      }
    }
  },
  methods: {
    selectExamination (row) {
      this.selectRow = row
      this.questionnaire = row.questionnaireResults[0] || {}
    },
    remove () {
      this.name = ''
      this.$emit('change', null)
      this.$emit('input', null)
    },
    submit () {
      this.name = this.selectRow ? this.selectRow.name : ''
      this.$emit('change', this.selectRow)
      this.$emit('input', this.selectRow)
      this.visible = false
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

.selectTestPager {
  display: inline-block;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 16px;
}

.successButton {
  color: #01ba77;
  background-color: rgba(1, 186, 119, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

</style>
