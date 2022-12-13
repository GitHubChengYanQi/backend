<template>
  <div>
    <a-radio-group
      v-model="timeType"
      :default-value="1"
      @change="change"
    >
      <a-radio :value="1">
        限定时长
      </a-radio>
      <a-radio :value="0">
        不限定时长
      </a-radio>
    </a-radio-group>
    <div v-if="timeType === 1">
      时长
      <a-input-number v-model="min" />
      分钟
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: _ => 0
    }
  },
  data () {
    return {
      min: 60,
      timeType: 1
    }
  },
  created () {
    this.timeType = this.value > 0 ? 1 : 0
    this.min = this.value
  },
  watch: {
    min () {
      this.$emit('change', this.min)
    }
  },
  methods: {
    change ({ target: { value } }) {
      this.min = 60
      this.$emit('change', value === 0 ? 0 : 60)
    }
  }
}
</script>;
