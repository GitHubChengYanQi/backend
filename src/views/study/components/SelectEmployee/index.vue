<template>
  <div>
    <AutoComplete
      v-model="name"
      :data-source="options"
      style="width: 200px"
      :placeholder="placeholder"
      @search="search"
      @change="handleChange"
    />
    <!--    <a-select-->
    <!--      :options="options"-->
    <!--      show-search-->
    <!--      :filterOption="false"-->
    <!--      :placeholder="placeholder"-->
    <!--      style="width: 200px"-->
    <!--      v-model="id"-->
    <!--      allowClear-->
    <!--      @change="handleChange"-->
    <!--      @search="search"-->
    <!--    >-->
    <!--      <a-spin v-if="loading" slot="notFoundContent" size="small" />-->
    <!--    </a-select>-->
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
        this.options = res.data.list.map(item => (item.name))
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
