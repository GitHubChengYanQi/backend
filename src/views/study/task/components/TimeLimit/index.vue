<template>
  <div>
    <a-radio-group
      v-model="timeType"
      :default-value="0"
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
      <a-range-picker @change="date" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    value: {
      type: Array,
      default: _ => []
    }
  },
  data () {
    return {
      time: [],
      timeType: 0
    }
  },
  methods: {
    date (date, dateString) {
      if (Array.isArray(dateString) && dateString.length > 0) {
        this.$emit('change', [
          moment(dateString[0]).format('YYYY/MM/DD 00:00:00'),
          moment(dateString[1]).format('YYYY/MM/DD 23:59:59')
        ])
      } else {
        this.$emit('change', dateString)
      }
    },
    change ({ target: { value } }) {
      this.$emit('dateType', value)
      this.time = []
      this.$emit('change', [])
    }
  }
}
</script>;
