<template>
  <a-cascader
    :field-names="{ label: 'name', value: 'id', children: 'children' }"
    v-model="data"
    @change="onChange"
    :options="dataList"
    :placeholder="placeholder" />
</template>
<script>
import { treeList } from '@/api/mall'
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: undefined
    }
  },
  data () {
    return {
      val: undefined,
      data: [],
      dataList: []
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (val) {
        this.val = val
      }
    }
  },
  created () {
    this.getDiseaseList()
  },
  methods: {
    onChange (value) {
      this.$emit('change', value[value.length - 1])
    },
    getDiseaseList () {
      // 过滤下children为空的字段
      treeList().then((res) => {
        this.dataList = res.data.children
        // console.log(111111, this.dataList)
        this.formatData(this.dataList)
        this.getPathById(this.dataList, this.val)
      })
    },
    /**
     * 过滤数据
     */
    formatData (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length === 0) {
          delete arr[i].children
        }
        if (arr[i].children) {
          this.formatData(arr[i].children)
        }
      }
    },
    /**
     * 获取路径
    */
    getPathById (tree, id, path) {
      if (!path) {
        path = []
      }
      for (let i = 0, len = tree.length; i < len; i++) {
        const tempPath = [...path]
        tempPath.push(tree[i].id)
        if (tree[i].id === id) {
          this.data = tempPath
        }
        if (tree[i].children && tree[i].children.length > 0) {
          this.getPathById(tree[i].children, id, tempPath)
        }
      }
    }
  }
}
</script>

<style>

</style>
