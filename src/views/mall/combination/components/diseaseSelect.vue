<template>
  <div>
    <a-select
      style="width:240px"
      show-search
      @change="(e)=>{handleChange(1, e)}"
      :filter-option="filterOption"
      placeholder="请选择"
      v-model="val1">
      <a-select-option v-for="(item, index) in dataList" :value="index" :key="index">
        {{ item.name }}
      </a-select-option>
    </a-select>
    -
    <a-select
      style="width:240px"
      show-search
      @change="(e)=>{handleChange(2, e)}"
      :filter-option="filterOption"
      placeholder="请选择"
      v-model="val2">
      <a-select-option v-for="(item, index) in dataList2" :value="index" :key="index">
        {{ item.name }}
      </a-select-option>
    </a-select>
  </div>
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
      default: 0
    }
  },
  data () {
    return {
      val1: undefined,
      val2: undefined,
      dataList: [],
      dataList2: []
    }
  },
  watch: {
    value (nVal) {
      if (!nVal) {
        this.val1 = undefined
        this.val2 = undefined
      }
    }
  },
  created () {
    this.getDiseaseList()
  },
  methods: {
    /**
     * 切换回调
     * @param {*} type 1=1级 2=2级
     * @param {*} e
     */
    handleChange (type, e) {
      if (type === 1) {
        this.val1 = e
        this.val2 = undefined
        this.dataList2 = this.dataList[e].children || []
        this.$emit('change', this.dataList[e].id)
      }
      if (type === 2) {
        this.val2 = e
        this.$emit('change', this.dataList2[e].id)
      }
    },
    /**
     * 搜索
     * @param {*} input
     * @param {*} option
     */
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    /**
     * 拉取字典
     */
    getDiseaseList () {
      treeList().then((res) => {
        this.dataList = res.data.children
      })
    }
  }
}
</script>

<style>

</style>
