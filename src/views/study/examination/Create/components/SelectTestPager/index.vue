<template>
  <div>
    <a-button v-if="!name" style="width: 200px;border-radius: 8px" class="add" @click="visible = true">
      <a-icon type="plus" />
      添加试卷
    </a-button>
    <div v-else>
      <a-badge>
        <div v-if="!disabled" slot="count">
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
      title="选择试卷"
      :visible="visible"
      @cancel="visible = false"
    >
      <TestPaper
        select
        @selectRow="selectTestPager"
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
      :title="'试卷名称：'+name"
      :visible="preview"
      @cancel="preview = false"
    >
      <TestPaperDetail preview :questionResults="selectRow.questionResults" />
    </a-modal>
  </div>
</template>

<script>
import TestPaper from '../../../TestPaper/index'
import TestPaperDetail from '../../../Detail/components/TestPaperDetail/index'

export default {
  props: {
    disabled: Boolean,
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: { TestPaper, TestPaperDetail },
  data () {
    return {
      preview: false,
      selectRow: {},
      name: '',
      sorter: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      },
      visible: false
    }
  },
  watch: {
    value (value) {
      if (value) {
        this.name = value.questionnaireName
        this.selectRow = value
      }
    }
  },
  methods: {
    selectTestPager (row) {
      this.selectRow = row
    },
    remove () {
      this.name = ''
      this.$emit('change', null)
    },
    submit () {
      this.name = this.selectRow.questionnaireName
      this.$emit('change', this.selectRow)
      this.visible = false
    }
  }
}
</script>
