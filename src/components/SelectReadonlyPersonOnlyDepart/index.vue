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
  * 调用实例：<SelectPersonNew v-model="screenData.ids" :name="请选择" :multiple="false" :num="5" :type="link" @getVal="getIds" />
  */
-->

<template>
  <div :class="layout==='inline'?'selector inline':'selector block'" ref="addSop_Page_Container">
    <a-select
      :loading="loading"
      label-in-value
      v-model="rows"
      mode="tags"
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
    <a-button
      :loading="loading"
      :style="buttonStyle"
      :disabled="disabled"
      @click.native="openModal"
      type="default"
      v-if="type==='default'">{{ name }}</a-button>
    <a-button :loading="loading" ghost @click.native="openModal" type="primary" v-if="type==='buttonGhost'">{{ name }}</a-button>
    <div class="list" v-if="type==='button' || type==='default'">
      <template v-if="num">
        <a-tag :closable="!disabled" @close="(e)=>{closeTagFn(e,item)}" v-for="(item,index) in rows.slice(0,num)" :key="index">
          <img src="@/assets/person.png" v-if="item.isLeaf === '1'">
          <img src="@/assets/bolder.png" v-if="item.isLeaf === '0'">
          {{ item.title }}
        </a-tag>
        <a-tag v-if="rows.length>num">+ {{ rows.length - num }} ...</a-tag>
      </template>
      <template v-else>
        <a-tag :closable="!disabled" @close="(e)=>{closeTagFn(e,item)}" v-for="(item,index) in rows" :key="index">
          <img src="@/assets/person.png" v-if="item.isLeaf === '1'">
          <img src="@/assets/bolder.png" v-if="item.isLeaf === '0'">
          {{ item.title }}
        </a-tag>
      </template>
    </div>
    <!-- <SelectModal
      @output="getKeys"
      :selectedKeys="keys"
      :selectedRows="rows"
      :placeholder="searchPlaceholder"
      :list="treeData"
      :fieldNames="fieldNames"
      :transferTip="transferTip"
      ref="SelectPersonnel" /> -->
    <ChooseTree :showStatus.sync="chooseCustomStatus" :list="treeData" :selectRows="rows" @output="getKeys"></ChooseTree>
  </div>
</template>

<script>
import ChooseTree from './components/chooseTree'
// import SelectModal from './components/modal'
import { departmentEmp } from '@/api/common.js'
import { deepClonev2 } from '@/utils/util'
// import { deepClonev2 } from '@/utils/util'
export default {
  components: {
    ChooseTree
    // SelectModal
  },
  data () {
    return {
      chooseCustomStatus: false,
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
    buttonStyle: {
      type: Object,
      default: () => {
        return {}
      }
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
    disabled: {
      type: Boolean,
      default: false
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
        // console.log(val, 'v-model属性')
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
      console.log(val, '已选中id数组')
      // this.$set(this, 'keys', val)
      this.rows = []
      this.getNodeInfo(this.treeData, val)
    },
    openModal (e = false, state = false) {
      if (this.record.length === 0) {
        this.loading = true
        departmentEmp().then(res => {
          // debugger
          this.loading = false
          // this.treeData = res.data
          this.treeData = this.formatTreeMethod(res.data)
          // this.treeData = res.data.filter(item => {
          //   if (item.isLeaf === '0') {
          //     return this.formatTreeMethod(item)
          //   }
          // })
          console.log(this.treeData, 'this.treeData')
          this.rows = []
          this.getNodeInfo(this.treeData, this.value)
          // this.getNodeInfo(this.treeData, val)
          // this.treeData = this.formatTree(res.data)
          // this.rows = this.getNodes(this.treeData, this.value)[0]
          // sessionStorage.setItem(this.curId, JSON.stringify(this.keys))
          // this.$refs.SelectPersonnel.modalShow = !state
          this.chooseCustomStatus = !state
        })
      } else {
        // sessionStorage.setItem(this.curId, JSON.stringify(this.keys))
        this.chooseCustomStatus = true
        // this.$refs.SelectPersonnel.modalShow = true
      }
    },
    // departmentEmp () {
    //   departmentEmp().then(res => {
    //     this.treeData = this.formatTree(res.data)
    //     this.rows = this.getNodes(this.treeData, this.value)[0]
    //   })
    // },
    // 格式化树结构
    formatTreeMethod (info) {
      // const haveChildren = Array.isArray(info.children) && info.children.length > 0
      var newTree = info.filter(item => item.isLeaf === '0')
      newTree.forEach(x => x.children && (x.children = this.formatTreeMethod(x.children)))
      return newTree
      // if (info.isLeaf === '0') {
      //   // 非叶子节点
      //   return {
      //     ...info,
      //     children: haveChildren ? info.children.filter(i => this.formatTreeMethod(i)) : []
      //   }
      // } else {
      //   // 叶子节点
      //   // console.log('叶子节点', info)
      //   return false
      // }
      // if (haveChildren) {
      //   return {
      //     ...info,
      //     children: haveChildren ? info.children.filter(i => {
      //       if (i.isLeaf === '0') {
      //         return this.formatTreeMethod(i)
      //       }
      //     }) : []
      //   }
      // } else {
      //   delete info.children
      //   return {
      //     ...info
      //   }
      // }
    },
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
    // 树节点选中回调
    getKeys (e) {
      // console.log(e, '获取已选中的机构')
      // debugger
      // this.$set(this, 'keys', e)
      this.rows = []
      this.getNodeInfo(this.treeData, e)
      console.log(this.rows, 'this.rows')
      // this.$emit('getVal', e)
      this.$emit('getVal', this.rows)
    },
    // 新的获取组织机构节点信息
    getNodeInfo (list, keyList) {
      // console.log(list, '循环数据', keyList, '已存在的id数组', this.rows, '已存在的数组')
      const tempArray = deepClonev2(list)
      for (let i = 0; i < tempArray.length; i++) {
        // let tempIndex = keyList.findIndex(info => info === singleItem.id)
        const tempIndex = keyList.findIndex(info => info === tempArray[i].id)
        if (tempIndex !== -1) {
          // tempArray[i].value = tempArray[i].title
          this.$set(tempArray[i], 'label', tempArray[i].title)
          this.rows.push(tempArray[i])
        }
        const tempInfo = tempArray[i]
        if (tempInfo && tempInfo.children && (tempInfo.children.length !== 0)) {
          this.getNodeInfo(tempInfo.children, keyList)
        }
      }
      // for (let singleItem of keyList) {
      //   let tempIndex = tempArray.findIndex(info => info.id === singleItem)
      //   if (tempIndex !== -1) {
      //     // 已选数组中存在
      //     this.rows.push(tempArray[tempIndex])
      //   }
      //   let tempChildrenList = tempArray[tempIndex]
      //   if (tempChildrenList && tempChildrenList.children && tempChildrenList.children.length !== 0) {
      //     this.getNodeInfo(tempChildrenList.children, keyList)
      //   }
      // }
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
      console.log(e, item, this.rows, '删除前打印的信息')
      const tempArray = deepClonev2(this.rows)
      const tempIndex = tempArray.findIndex(info => info.id === item.id)
      if (tempIndex !== -1) {
        tempArray.splice(tempIndex, 1)
      }
      this.rows = deepClonev2(tempArray)
      const tempIdList = this.rows.map(item => item.id)
      this.$emit('getVal', tempIdList)
      // debugger
      // const arr = this.rows
      // const keys = []
      // const rows = []
      // for (let i = 0; i < arr.length; i++) {
      //   if (item.id !== arr[i].id) {
      //     keys.push(arr[i].id)
      //     rows.push(arr[i])
      //   }
      // }
      // this.$set(this, 'keys', keys)
      // this.$set(this, 'rows', rows)
      // this.$emit('getVal', this.keys)
      // console.log(this.keys, this.rows, '关闭tag')
    }
  }
}
</script>

<style lang="less" scoped>
.selector {
  &.inline {
    display: inline-block;
  }

  &.block {
    display: block;
  }

  .list {
    margin-top: 10px;
    span {
      margin-bottom: 10px;
      img {
        width: 20px;
        margin-right: 4px;
      }
    }
  }
}
</style>
