<template>
  <div class="select-employee-input">
    <a-select
      mode="multiple"
      v-model="employeeShowData"
      :open="false"
      :showArrow="true"
      :allowClear="true"
      placeholder="请选择员工"
      @click.native="$refs.selectEmployee.$show(selectEmployee)"
      @deselect="delChange"
      @change="change"
    />
    <SelectEmployee ref="selectEmployee" @change="selectEmployeeChange" :maxCount="count"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      employeeShowData: [],
      selectEmployee: [],
      count: this.maxCount
    }
  },
  props: {
    changeId: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: _ => []
    },
    maxCount: {
      type: Number,
      default: 200
    }
  },
  watch: {
    value () {
      if (this.value.length === 0) {
        this.employeeShowData = []
        this.selectEmployee = []
      }
    }
  },
  methods: {
    change () {
      if (this.employeeShowData.length === 0) {
        this.selectEmployee = []

        this.emit()
      }
    },

    delChange (e) {
      this.selectEmployee.deleteObj('name', e)

      this.emit()
    },

    selectEmployeeChange (e) {
      this.selectShowData = e

      const names = e.map(v => {
        return v.name
      })

      this.selectEmployee = e
      this.employeeShowData = names

      this.emit()
    },

    emit () {
      if (this.changeId) {
        const ids = this.selectEmployee.map(v => {
          return v.id
        })

        this.$emit('input', ids)

        return false
      }

      this.$emit('input', this.selectEmployee)
    }
  }
}
</script>

<style lang="less" scoped>
.select-employee-input {
  width: 100%;
}
/deep/.ant-select{
  width: 100%;
}
/deep/ .ant-select-selection__rendered ul {
  position: absolute;
  display: flex;
  overflow: hidden;
  width: 184px;
}
</style>
