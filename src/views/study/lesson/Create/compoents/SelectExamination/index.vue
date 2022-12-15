<template>
  <div>
    <a-button v-if="!name" style="width: 200px;border-radius: 8px" class="add" @click="visible = true">
      <a-icon type="plus" />
      关联
    </a-button>
    <div v-else>
      <a-badge>
        <div slot="count">
          <a-icon type="close-circle" style="cursor: pointer" @click="remove" />
        </div>
        <a-button style="width: 200px;border-radius: 8px" class="linkButton">
          {{ name }}
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
    }
  },
  data () {
    return {
      preview: false,
      selectRow: {},
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
    },
    submit () {
      this.name = this.selectRow.name
      this.$emit('change', this.selectRow)
      this.$emit('input', this.selectRow)
      this.visible = false
    }
  }
}
</script>
