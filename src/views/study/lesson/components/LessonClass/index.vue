<template>
  <div style="width: 100%; height: 100%;">
    <dragTree
      ref="dragTree"
      @node-contextmenu="handleContextMenu"
      @tree-click="treeClick"
      @tree-drop="treeDrop"
      @close-menu="closeMenu"
      :data="data"
      :props="defaultProps"
      :draggable="true"
    >
    </dragTree>
    <div class="drag-tree-popover" :style="style" v-if="isShowPopover">
      <div
        class="drag-tree-popover-item"
        v-for="(item, index) in popoverList"
        :key="index"
        @click="menuClick(item)"
      >
        <i class="iconfont" :class="'icon-' + item.type"></i>
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import dragTree from '../../../components/DragTree'

export default {
  components: { dragTree },
  data () {
    return {
      parent_id: '0',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      popoverLeft: 0, // 距离左边的距离
      popoverTop: 0, // 距离顶部的距离
      isShowPopover: false, // 是否展示右键内容
      popoverList: [
        { name: '新增', type: 'xinzeng' },
        { name: '编辑', type: 'bianji' },
        { name: '删除', type: 'shanchu' }
      ],
      treeNode: null,
      activeId: 0
    }
  },
  created () {
    this.getTreeData()
  },
  computed: {
    // 计算出距离
    style () {
      return {
        left: this.popoverLeft + 'px',
        top: this.popoverTop + 'px'
      }
    }
  },
  methods: {
    // 显示自定义菜单
    handleContextMenu (event, node, that) {
      this.popoverLeft = event.clientX + 10
      this.popoverTop = event.clientY
      this.isShowPopover = true
    },
    // 关闭菜单
    closeMenu () {
      this.isShowPopover = false
    },
    treeClick (data) {
      this.activeId = data.id
    },
    treeDrop (node, data, ev, startId, targetId, dropType, root) {
      console.log(startId, targetId, dropType, root)
    },
    // 菜单某一项被点击
    menuClick (item) {
      // 操作
      this.closeMenu()
    },
    // 判断activeId是否存在
    findIdIsExit (data, id) {
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === id) {
            return true
          }
          if (data[i].children && data[i].children.length) {
            let s = this.findIdIsExit(data[i].children, id)
            if (s === true) {
              return true
            }
          }
        }
      }
    },
    async getTreeData () {
      this.data = [
        { label: '默认分类1', id: 1, children: [{ label: '第一分类1', id: 1 - 1 }] },
        { label: '默认分类2', id: 2, children: [{ label: '第一分类2', id: 2 - 1 }] }
      ]
      // this.activeId = this.data[0].id
      // this.$refs.dragTree.activeId = this.activeId
    }
  }
}
</script>
