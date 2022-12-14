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
      <a-button type="link">
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
  </div>
</template>

<script>
import examination from '../../../../examination/index'

export default {
  components: { examination },
  props: {
    value: {
      type: Object,
      default: _ => {
      }
    }
  },
  data () {
    return {
      selectRow: {},
      name: '',
      visible: false
    }
  },
  created () {
    if (this.value) {
      this.name = this.value.name
      this.selectRow = this.value
    }
  },
  watch: {
    value (value) {
      if (value) {
        this.name = this.value.name
        this.selectRow = value
      }
    }
  },
  methods: {
    selectExamination (row) {
      this.selectRow = row
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
