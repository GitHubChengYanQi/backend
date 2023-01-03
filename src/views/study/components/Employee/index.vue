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
    <div>
      <a-button
        :disabled="disabled"
        v-if="userType === 2"
        style="width: 200px"
        class="add"
        @click="$refs.selectEmployee.$show(selectEmployee)">
        <a-icon
          type="plus"
        />
        添加
      </a-button>
    </div>
    <div>
      <a-tag v-for="employee in employeeShowData" color="blue">
        {{ employee }}
      </a-tag>
    </div>
    <SelectEmployee ref="selectEmployee" @change="selectEmployeeChange" />
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    value: {
      type: Array,
      default: _ => []
    },
    employees: {
      type: Array,
      default: _ => []
    }
  },
  data () {
    return {
      employeeShowData: this.employees,
      selectEmployee: [],
      userType: this.value[0] === 'all' ? 1 : 2
    }
  },
  methods: {
    change ({ target: { value } }) {
      this.employeeShowData = []
      this.$emit('change', value === 1 ? ['all'] : null)
    },
    selectEmployeeChange (e) {
      this.selectShowData = e

      const names = e.map(v => {
        return v.name
      })

      this.selectEmployee = e
      this.employeeShowData = names
      const ids = this.selectEmployee.map(v => {
        return v.id
      })
      this.$emit('change', ids)
    }
  }
}
</script>;
