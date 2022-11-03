<!--
  /**
  * 组件:[选择部门]
  * 调用实例：<SelectDepartment v-model="screenData.dept" />
  * treeCheckStrictly === true 需使用@getDept手动赋值
  */
-->
<template>
  <div class="select-employee-input">
    <a-tree-select
      v-model="data"
      style="width: 100%"
      :tree-data="treeData"
      tree-checkable
      placeholder="请选择门店"
      :maxTagCount="1"
      :show-checked-strategy="SHOW_PARENT"
      :replaceFields="replaceFields"
      :treeCheckStrictly="treeCheckStrictly"
      allowClear
      @change="onChange"
    />
  </div>
</template>

<script>
import { departmentList } from '@/api/common.js'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    treeCheckStrictly: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (val) {
        this.data = val
      }
    }
  },
  mounted () {
    this.departmentList()
  },
  data () {
    return {
      treeData: [],
      data: [],
      SHOW_PARENT,
      replaceFields: {
        children: 'childDepartment',
        title: 'name',
        key: 'wxDepartmentId',
        value: 'id'
      }
    }
  },
  methods: {
    departmentList () {
      departmentList().then(res => {
        this.treeData = res.data
      })
    },
    onChange (e) {
      if (this.treeCheckStrictly) {
        const arr = []
        for (let i = 0; i < e.length; i++) {
          arr.push(e[i].value)
        }
        this.$emit('getDept', arr)
      }
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
