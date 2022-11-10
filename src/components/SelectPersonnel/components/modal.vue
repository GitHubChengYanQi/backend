<template>
  <div class="select">
    <a-modal
      v-model="modalShow"
      :width="636"
      @ok="handleOk"
      @cancel="handleCancel"
      centered
      :maskClosable="false">

      <template slot="title">
        选择部门/成员
      </template>

      <div class="content">
        <div class="fl">
          <!-- tree -->
          <a-input-search v-model="searchStr" :placeholder="placeholder" @search="onSearch"></a-input-search>
          <!-- selectedKeys是选中项key的集合，expandedKeys是展开项key的集合 -->
          <a-tree
            multiple
            v-model="checkedKeys"
            :treeData="treeData"
            :expandedKeys="expandedKeys"
            @expand="onExpand"
            :autoExpandParent="autoExpandParent"
            :replaceFields="replaceFields"
            @check="onCheck"
            checkable
          >
            <template slot="title" slot-scope="{name}">
              <span v-if="name" v-html="name.replace(new RegExp(searchValue,'g'),'<span style=color:#40a9ff>'+ searchValue +'</span>')"></span>
            </template>
          </a-tree>
          <!-- end tree -->
        </div>
        <div class="fr">
          <h2>已选择成员({{ checkedNodes.length }}人)<span @click="clearAll"><a-icon type="delete" theme="twoTone" />清空</span></h2>
          <ul>
            <li v-for="item in checkedNodes" :key="item.key">{{ item.name }}<a-icon @click="delFn(item.key)" type="close" /></li>
          </ul>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { deepClonev2 } from '@/utils/util'
export default {
  data () {
    return {
      modalShow: false,
      loading: false,
      selected: [],
      replaceFields: { title: 'name' },
      expandedKeys: [],
      backupsExpandedKeys: [],
      autoExpandParent: false,
      checkedKeys: [],
      checkedNodes: [],
      searchValue: '',
      treeData: [],
      searchStr: ''
    }
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedKeys: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedRows: {
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请输入搜索项'
    }
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler (val) {
        this.treeData = val
      }
    },
    selectedKeys: {
      immediate: true,
      deep: true,
      handler (val) {
        this.checkedKeys = val
      }
    },
    selectedRows: {
      immediate: true,
      deep: true,
      handler (val) {
        this.checkedNodes = val
      }
    }
  },
  methods: {
    deepClonev2,
    handleOk () {
      const Multiple = this.$parent.multiple
      if (!Multiple && this.checkedKeys.length > 1) {
        this.$message.error('只能选择一个成员！')
      } else {
        this.$emit('output', this.checkedKeys, 'ok')
        sessionStorage.removeItem(this.$parent.curId)
        this.modalShow = false
      }
    },
    handleCancel () {
      this.$emit('output', JSON.parse(sessionStorage.getItem(this.$parent.curId)), 'cancel')
      sessionStorage.removeItem(this.$parent.curId)
      this.modalShow = false
    },
    onSearch () {
      this.searchValue = this.searchStr
      if (this.searchValue === '') {
        this.expandedKeys = []
        this.setDisplay(this.treeData, [])
      } else {
        this.expandedKeys = []
        this.backupsExpandedKeys = []
        const candidateKeysList = this.getkeyList(this.searchValue, this.treeData, [])

        candidateKeysList.forEach(
          (item) => {
            const key = this.getParentKey(item, this.treeData)
            // eslint-disable-next-line no-shadow
            if (key && !this.backupsExpandedKeys.some((item) => item === key)) this.backupsExpandedKeys.push(key)
          }
        )
        const { length } = this.backupsExpandedKeys
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < length; i++) {
          this.getAllParentKey(this.backupsExpandedKeys[i], this.treeData)
        }
        this.expandedKeys = this.backupsExpandedKeys.slice()
        this.setDisplay(this.treeData, [...candidateKeysList, ...this.expandedKeys])
      }
    },
    // 获取节点中含有value的所有key集合
    getkeyList (value, tree, keyList) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.name.indexOf(value) > -1) {
          keyList.push(node.key)
        }
        if (node.children) {
          this.getkeyList(value, node.children, keyList)
        }
      }
      return keyList
    },
    // 获取所选nodes
    getNodes (tree, keyList) {
      const nodes = []
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (keyList.indexOf(node.key) > -1) {
          nodes.push(node)
        }
        if (node.children) {
          this.getNodes(node.children, keyList)
        }
      }
      return nodes
    },
    // 设置显示/隐藏
    setDisplay (tree, keyList) {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (keyList.length === 0) {
          delete node.style
        } else {
          if (keyList.indexOf(node.key) > -1) {
            node['style'] = 'display: block'
          } else {
            node['style'] = 'display: none'
          }
        }
        if (node.children) {
          this.setDisplay(node.children, keyList)
        }
      }
    },
    // 该递归主要用于获取key的父亲节点的key值
    getParentKey (key, tree) {
      let parentKey
      let temp
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some((item) => item.key === key)) {
            parentKey = node.key
            // eslint-disable-next-line no-cond-assign
          } else if (temp = this.getParentKey(key, node.children)) {
            parentKey = temp
          }
        }
      }
      return parentKey
    },
    // 获取该节点的所有祖先节点
    getAllParentKey (key, tree) {
      let parentKey
      if (key) {
        parentKey = this.getParentKey(key, tree)
        if (parentKey) {
          if (!this.backupsExpandedKeys.some((item) => item === parentKey)) {
            this.backupsExpandedKeys.push(parentKey)
          }
          this.getAllParentKey(parentKey, tree)
        }
      }
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys, info) {
      const arr = []
      for (let i = 0; i < info.checkedNodes.length; i++) {
        arr.push(info.checkedNodes[i].data.props.dataRef)
      }
      this.checkedKeys = this.formatRes(arr)[0]
      this.checkedNodes = this.formatRes(arr)[1]
    },
    /**
     * 过滤组织
     */
    formatRes (data) {
      const keys = []
      const rows = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].leaf === '1') {
          keys.push(data[i].key)
          rows.push(data[i])
        }
      }
      return [keys, rows]
    },
    clearAll () {
      this.checkedKeys = []
      this.checkedNodes = []
    },
    delFn (key) {
      const arr = this.checkedNodes
      const keys = this.checkedKeys
      arr.splice(
        arr.findIndex(
          (item) => item.key === key
        ),
        1
      )
      keys.splice(
        keys.findIndex(
          (item) => item === key
        ),
        1
      )
      this.checkedNodes = arr
      this.checkedKeys = keys
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.ant-modal-body) {
  padding: 0px;
}
.content {
  width: 100%;
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  overflow: hidden;
  .fl {
    width: 50%;
    height: 400px;
    float: left;
    border-right: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding: 16px;
    overflow-y: auto;
  }
  .fr {
    width: 50%;
    height: 400px;
    float: right;
    overflow-y: auto;
    h2 {
      font-size: 14px;
      font-weight: bold;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      margin-bottom: 10px;
      position: -webkit-sticky;
      position: sticky;
      top: 0px;
      background: #fff;
      box-shadow: 0 0 8px #ddd;
      -moz-box-shadow: 0 0 8px #ddd;
      -webkit-box-shadow: 0 0 8px #ddd;
      span {
        float: right;
        color: #40a9ff;
        cursor: pointer;
        i {
          position: relative;
          top: 1px;
        }
      }
    }
    ul {
      width: 90%;
      padding: 0;
      margin: 0 auto;
      li {
        margin-bottom: 5px;
        border-bottom: 1px dashed #eee;
        padding: 5px 0;
        cursor: pointer;
        i {
          color: #ff0000;
          float: right;
        }
      }
    }
  }
}
</style>
