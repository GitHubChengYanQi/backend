<template>
  <div class="selectBox">
    <p>
      <a-button size="small" @click="handleAdd" icon="plus">添加</a-button>&nbsp;
      <!-- <a-select
        v-if="show"
        show-search
        placeholder="请选择药品"
        option-filter-prop="children"
        style="width: 300px"
        :filter-option="filterOption"
        @change="handleChange"
      >
        <a-select-option v-for="(item, index) in (drugList)" :key="index" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select> -->
      <a-select
        mode="multiple"
        v-if="show"
        :value="value"
        placeholder="请选择药品"
        style="width: 300px"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        @search="fetchUser"
        @change="handleChange"
      >
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="item in drugList" :key="item.id">
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
import { getCommonNameList } from '@/api/mall'
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
    }
  },
  data () {
    return {
      show: false,
      value: [],
      list: [],
      drugList: [],
      fetching: false
    }
  },
  methods: {
    /**
     * 获取通用名列表
     * @param {*} id
     */
    //  getCommonNameList (name) {
    //   const param = {
    //     name
    //   }
    //   getCommonNameList(param).then(res => {
    //     console.log(11111, res.data)
    //     this.drugList = res.data
    //   })
    // },
    handleChange (value, e) {
      const arr = this.list
      let flag = false
      for (let i = 0; i < arr.length; i++) {
        if (value[0] === arr[i].id) {
          flag = true
          break
        }
      }
      if (!flag) {
        this.show = false
        this.list.push({
          id: value[0],
          name: e[0].componentOptions.children[0].text
        })
      }
    },
    fetchUser (value) {
      this.drugList = []
      this.fetching = true
      const param = {
        name: value
      }
      getCommonNameList(param).then(res => {
        this.drugList = res.data
        this.fetching = false
      })
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
