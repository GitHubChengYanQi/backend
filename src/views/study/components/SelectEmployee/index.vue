<template>
  <div>
    <a-select
      :options="options"
      show-search
      :filterOption="false"
      :placeholder="placeholder"
      style="width: 200px"
      v-model="id"
      allowClear
      @change="handleChange"
      @search="search"
    >
      <a-spin v-if="loading" slot="notFoundContent" size="small" />
    </a-select>
  </div>
</template>

<script>
import { enterMembersList } from '@/api/workEmployee'

export default {
  props: {
    placeholder: {
      type: String,
      default: _ => '请选择'
    },
    value: {
      type: Number,
      default: _ => null
    }
  },
  watch: {
    value () {
      this.id = this.value
    }
  },
  data () {
    return {
      options: [],
      loading: false,
      id: undefined
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    handleChange (value) {
      this.id = value
      this.$emit('input', value)
    },
    search (value) {
      this.getUserList(value)
    },
    getUserList (name) {
      this.options = []
      this.loading = true
      enterMembersList({ name }).then((res) => {
        this.options = res.data.list.map(item => ({ label: item.name, value: item.id }))
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
