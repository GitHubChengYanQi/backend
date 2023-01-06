<template>
  <div>
    <a-radio-group
      v-model="timeType"
      :default-value="0"
      @change="change"
    >
      <a-radio :value="0">
        限定时长
      </a-radio>
      <a-radio :value="-1">
        不限定时长
      </a-radio>
    </a-radio-group>
    <div v-if="timeType === 0">
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
      default: _ => -1
    }
  },
  data () {
    return {
      min: 60,
      timeType: -1
    }
  },
  watch: {
    value () {
      this.timeType = this.value > -1 ? 0 : -1
      this.min = this.value
    },
    min () {
      this.$emit('change', this.min)
    }
  },
  methods: {
    change ({ target: { value } }) {
      this.min = 0
      this.$emit('change', value === -1 ? -1 : 0)
    }
  }
}
</script>;
