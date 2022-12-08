<!--
  /**
  * 组件:[选择人员]
  *
  * 输入[v-model] = ['100','101','102']
  * 输入[type] = 'button' //按钮; 'link' //链接; 'selector' //下拉框; 'buttonLink' //按钮没有已选labal
  * 输入[num] = 5 //5个以后省略
  * 输入[multiple] = true //是否多选
  * 输入[name] = '请选择' //按钮名称
  * 输入[layout] = 'inline'//不换行;'block'//换行
  * 输入[record] = [] //备选数据 <selectPersonnel v-if="treeData" :record="treeData" />
  * 输入[fieldNames] = { children: 'children', title: 'title', key: 'key' } // 替换 treeNode 中 title,key,children 字段为 treeData 中对应的字段
  * 输入[transferTip] = true //转接提示
  *
  * 输出:getVal = ['100','101','102']
  *
  * 调用实例：<selectPersonnel v-model="screenData.ids" :name="请选择" :multiple="false" :num="5" :type="link" @getVal="getIds" />
  */
-->

<template>
  <div :class="layout==='inline'?'selector inline':'selector block'">
    <a-select
      :loading="loading"
      label-in-value
      v-model="rows"
      mode="multiple"
      :open="false"
      :showArrow="true"
      :allowClear="true"
      style="width:100%"
      @click.native="openModal"
      @change="onChange"
      placeholder="请选择员工"
      :maxTagCount="num"
      v-if="type==='selector'"
    />
    <a-button :loading="loading" @click.native="openModal" type="primary" v-if="type==='button'">{{ name }}</a-button>
    <a-button :loading="loading" @click.native="openModal" type="link" v-if="type==='link'">{{ name }}</a-button>
    <a-button :loading="loading" @click.native="openModal" type="primary" v-if="type==='buttonLink'">{{ name }}</a-button>
    <a-button :loading="loading" ghost @click.native="openModal" type="primary" v-if="type==='buttonGhost'">{{ name }}</a-button>
    <div class="list" v-if="type==='button'">
      <template v-if="num">
        <a-tag closable @close="(e)=>{closeTagFn(e,item)}" v-for="(item,index) in rows.slice(0,num)" :key="index">{{ item.name }}</a-tag>
        <a-tag v-if="rows.length>num">+ {{ rows.length - num }} ...</a-tag>
      </template>
      <template v-else>
        <a-tag closable @close="(e)=>{closeTagFn(e,item)}" v-for="(item,index) in rows" :key="index">{{ item.name }}</a-tag>
      </template>
    </div>
    <SelectModal
      @output="getKeys"
      :selectedKeys="keys"
      :selectedRows="rows"
      :placeholder="searchPlaceholder"
      :list="treeData"
      :fieldNames="fieldNames"
      :transferTip="transferTip"
      ref="SelectPersonnel"/>
  </div>
</template>

<script>
import SelectModal from './components/modal'
import { departmentEmp } from '@/api/common.js'
// import { deepClone, deepClonev2 } from '@/utils/util'
export default {
  components: {
    SelectModal
  },
  data () {
    return {
      loading: false,
      treeData: [],
      keys: [],
      rows: [],
      temp: [],
      curId: 'keys',
      btnType: ''// ok cancel
    }
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'selector'
    },
    name: {
      type: String,
      default: '请选择'
    },
    num: {
      type: Number,
      default: undefined
    },
    multiple: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: 'block'
    },
    record: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchPlaceholder: {
      type: String,
      default: '请输入成员昵称'
    },
    fieldNames: {
      type: Object,
      default: () => {
        return { children: 'children', title: 'title', key: 'key' }
      }
    },
    transferTip: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (val) {
        console.log(val)
        this.setValue(val)
      }
    },
    record: {
      immediate: true,
      deep: true,
      handler (val) {
        this.treeData = this.formatTree(this.deepCopy(val))
        this.rows = this.getNodes(this.treeData, this.value)[0]
      }
    }
  },
  created () {
    this.openModal(true, true)
  },
  methods: {
    deepCopy (data) {
      if (data && typeof data === 'object') {
        if (typeof data === 'function') {
          const tempFunc = data.bind(null)
          tempFunc.prototype = this.deepCopy(data.prototype)
          return tempFunc
        }
        switch (Object.prototype.toString.call(data)) {
          case '[object String]':
            return data.toString()
          case '[object Number]':
            return Number(data.toString())
          case '[object Boolean]':
            return Boolean(data.toString())
          case '[object Date]':
            return new Date(data.getTime())
          case '[object Array]':
            var arr = []
            for (let i = 0; i < data.length; i++) {
              arr[i] = this.deepCopy(data[i])
            }
            return arr
          case '[object Object]':
            var obj = {}
            for (const key in data) {
              obj[key] = this.deepCopy(data[key])
            }
            return obj
        }
      } else {
        return data
      }
    },
    setValue (val) {
      this.$set(this, 'keys', val)
      this.rows = this.getNodes(this.treeData, val)[0]
    },
    openModal (e = false, state = false) {
      if (this.record.length === 0) {
        this.loading = true
        departmentEmp().then(res => {
          this.loading = false
          this.treeData = this.formatTree(res.data)
          this.rows = this.getNodes(this.treeData, this.value)[0]
          sessionStorage.setItem(this.curId, JSON.stringify(this.keys))
          this.$refs.SelectPersonnel.modalShow = !state
        })
      } else {
        sessionStorage.setItem(this.curId, JSON.stringify(this.keys))
        this.$refs.SelectPersonnel.modalShow = true
      }
    },
    // departmentEmp () {
    //   departmentEmp().then(res => {
    //     this.treeData = this.formatTree(res.data)
    //     this.rows = this.getNodes(this.treeData, this.value)[0]
    //   })
    // },
    formatTree (data) {
      const arr = []
      for (let i = 0; i < data.length; i++) {
        data[i].leaf = data[i].isLeaf
        delete data[i].isLeaf
        data[i].name = data[i].title
        data[i].label = data[i].title
        data[i].scopedSlots = { title: 'title' }
        arr.push(data[i])
        if (data[i].children.length === 0 && data[i].leaf === '0') {
          data[i].disabled = true
        }
        if (data[i].children && data[i].children.length > 0) {
          this.formatTree(data[i].children)
        }
      }
      return arr
    },
    getKeys (e, type) {
      this.$set(this, 'keys', e)
      const arr = this.getNodes(this.treeData, this.keys)
      console.log(arr)
      sessionStorage.setItem(this.curId, JSON.stringify(this.keys))
      this.rows = arr[0]
      if (type === 'ok') {
        this.$emit('getVal', this.keys)
        this.$emit('getRows', this.rows)
        this.$emit('input', this.keys)
      }
    },
    getNodes (tree, keys) {
      let nodes = []
      let ids = []
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (keys.indexOf(node.key) > -1) {
          nodes.push(node)
          ids.push(node.id)
        }
        if (node.children) {
          nodes = [...nodes, ...this.getNodes(node.children, keys)[0]]
          ids = [...ids, ...this.getNodes(node.children, keys)[1]]
        }
      }
      return [nodes, ids]
    },
    onChange (e) {
      if (e.length === 0) {
        this.keys = []
        this.rows = []
        this.$emit('input', [])
        this.$emit('getRows', [])
        this.$emit('getVal', [])
      } else {
        const keys = []
        for (let i = 0; i < e.length; i++) {
          keys.push(e[i].key)
        }
        this.$set(this, 'keys', keys)
        this.$set(this, 'rows', e)
        this.$emit('input', this.keys)
      }
      sessionStorage.removeItem(this.curId)
    },
    closeTagFn (e, item) {
      e.preventDefault()
      const arr = this.rows
      const keys = []
      const rows = []
      for (let i = 0; i < arr.length; i++) {
        if (item.id !== arr[i].id) {
          keys.push(arr[i].id)
          rows.push(arr[i])
        }
      }
      this.$set(this, 'keys', keys)
      this.$set(this, 'rows', rows)
      this.$emit('getVal', this.keys)
      this.$emit('input', this.keys)
    }
  }
}
</script>

<style lang="less" scoped>
  .selector{
    &.inline{
      display:inline-block;
    }
    &.block{
      display:block;
    }
    .list{
      margin-top:10px;
      span{
        margin-bottom:10px;
      }
    }
  }
</style>
