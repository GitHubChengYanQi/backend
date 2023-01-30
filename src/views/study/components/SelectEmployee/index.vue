<template>
  <div>
    <AutoComplete
      v-model="name"
      style="width: 200px"
      :placeholder="placeholder"
      @search="search"
      @change="handleChange"
    >
      <template slot="dataSource">
        <a-select-option
          v-for="item in options"
          :key="'id:'+item.id"
          class="show-all"
        >{{ item.name }}</a-select-option>
      </template>
    </AutoComplete>
  </div>
</template>

<script>
import { enterMembersList } from '@/api/workEmployee'
import { AutoComplete } from 'ant-design-vue'

export default {
  components: { AutoComplete },
  props: {
    placeholder: {
      type: String,
      default: _ => '请选择'
    },
    value: {
      type: String,
      default: _ => ''
    }
  },
  watch: {
    value () {
      this.name = this.value
    }
  },
  data () {
    return {
      options: [],
      loading: false,
      name: undefined
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    handleChange (value) {
      this.name = value
      this.$emit('input', value)
    },
    search (value) {
      this.getUserList(value)
    },
    getUserList (name) {
      this.options = []
      this.loading = true
      enterMembersList({ name }).then((res) => {
        this.options = res.data.list
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
