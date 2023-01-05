<template>
  <div>
    <a-radio-group
      v-model="userType"
      :disabled="disabled"
      :default-value="1"
      @change="change"
    >
      <a-radio :value="1">
        全体员工
      </a-radio>
      <a-radio :value="2">
        部分员工
      </a-radio>
    </a-radio-group>
    <selectPersonnel
      v-model="ids"
      :disabled="disabled"
      v-if="userType === 2"
      name="添加"
      :button-style="{width: '200px'}"
      :num="5"
      :type="'default'"
      @getVal="selectEmployeeChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    value: {
      type: Array,
      default: _ => []
    }
  },
  data () {
    return {
      ids: [],
      userType: this.value[0] === 'all' ? 1 : 2
    }
  },
  created () {
    this.ids = this.value.map(item => item + '')
  },
  methods: {
    change ({ target: { value } }) {
      this.ids = []
      this.$emit('change', value === 1 ? ['all'] : null)
    },
    selectEmployeeChange (ids) {
      this.$emit('change', ids)
    }
  }
}
</script>;
