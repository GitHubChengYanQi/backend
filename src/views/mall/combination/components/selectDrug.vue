<template>
  <div class="selectBox">
    <p>
      <a-button size="small" @click="handleAdd" icon="plus">添加</a-button>&nbsp;
      <a-select
        v-if="show"
        show-search
        placeholder="请选择药品"
        option-filter-prop="children"
        style="width: 300px"
        :filter-option="filterOption"
        @change="handleChange"
      >
        <a-select-option v-for="(item, index) in drugList" :key="index" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </p>
    <p>
      <a-tag :closable="show ? false : true" v-for="(item, index) in list" :key="item.id" @close="handleDelete(index)">
        {{ item.name }}
      </a-tag>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    drug: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        this.list = val
      }
    },
    drug: {
      immediate: true,
      deep: true,
      handler (val) {
        this.drugList = val
      }
    }
  },
  data () {
    return {
      show: false,
      list: [],
      drugList: []
    }
  },
  methods: {
    handleChange (value, e) {
      const arr = this.list
      let flag = false
      for (let i = 0; i < arr.length; i++) {
        if (value === arr[i].id) {
          flag = true
          break
        }
      }
      if (!flag) {
        this.show = false
        this.list.push({
          id: value,
          name: e.componentOptions.children[0].text
        })
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleAdd () {
      this.show = true
    },
    handleDelete (e) {
      this.list.splice(e, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.selectBox{
  width:100%;
  overflow: hidden;
  p{
    margin-right:10px;
  }
}
</style>
