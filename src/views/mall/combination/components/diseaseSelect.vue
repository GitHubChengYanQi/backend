<template>
  <a-cascader
    :field-names="{ label: 'name', value: 'id', children: 'children' }"
    v-model="value"
    @change="onChange"
    :options="dataList"
    :placeholder="placeholder" />
</template>
<script>
import { treeList } from '@/api/mall'
export default {
  props: ['placeholder', 'value'],
  data () {
    return {
      dataList: []
    }
  },
  mounted () {
    this.getDiseaseList()
  },
  methods: {
    onChange (value) {
      this.$emit('change', value)
    },
    getDiseaseList () {
      // 过滤下children为空的字段
      treeList().then((res) => {
        this.dataList = res.data.children
      })
    }
  }
}
</script>

<style>

</style>
