<template>
  <div>
    <el-tree
      class="tree"
      :data="data"
      icon-class="icon"
      node-key="id"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag">
      <div
        class="custom-tree-node"
        slot-scope="{ node, data }"
        @mouseenter="mouseenter(node)"
        @mouseleave="mouseleave(node)"
      >
        <div>
          <div class="Action">
            <svg viewBox="0 0 20 20" width="12">
              <path
                d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
            </svg>
          </div>
          <span>{{ node.label }}</span>
        </div>
        <div class="my-space">
          <div v-if="visible === node.id" style="padding-right: 8px">
            <el-button
              type="text"
              size="mini"
              @click="() => addChildren(node, data)">
              <a-icon type="plus-circle" />
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => update(node, data)">
              <a-icon type="edit" />
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              <a-icon type="delete" />
            </el-button>
          </div>
          <div v-if="Array.isArray(data.children) && data.children.length > 0">
            <el-button
              v-if="!node.expanded"
              type="text"
              size="mini"
            >
              <a-icon type="left" />
            </el-button>
            <el-button
              v-else
              type="text"
              size="mini"
            >
              <a-icon type="down" />
            </el-button>
          </div>
        </div>
      </div>
    </el-tree>

    <a-button
      icon="plus"
      style="width: 100%;margin-top: 12px;border-radius: 4px"
      @click="()=>openAddClass = true"
    >
      添加分类
    </a-button>

    <a-modal centered v-model="openAddClass" title="新建分类" class="my-modal">
      <div class="my-space">
        <div style="width: 100px">分类名称：</div>
        <a-input v-model="addClassName" placeholder="请输入分类名称"></a-input>
      </div>
    </a-modal>

    <a-modal centered v-model="openAddChildrenClass" title="新建子分类" class="my-modal">
      <div class="my-space">
        <div style="width: 100px">分类名称：</div>
        <a-input v-model="addChildrenClassName" placeholder="请输入分类名称"></a-input>
      </div>
    </a-modal>

    <a-modal centered v-model="openUpdateClass" title="编辑分类" class="my-modal">
      <div class="my-space">
        <div style="width: 100px">分类名称：</div>
        <a-input v-model="updateClassName" placeholder="请输入分类名称"></a-input>
      </div>
    </a-modal>

    <a-modal centered v-model="openDelClass" title="提示" class="my-modal">
      <div class="my-space">
        <a-icon type="exclamation-circle" theme="filled" style="color: red;font-size: 24px;" />
        <div>
          删除该分类后，分类下的子分类及创建的课程列表都会被删除确定删除“1234”分类吗?
        </div>
      </div>
    </a-modal>
  </div>

</template>

<script>
export default {
  data () {
    return {
      addClassName: '',
      addChildrenClassName: '',
      updateClassName: '',
      openUpdateClass: false,
      openAddClass: false,
      openDelClass: false,
      openAddChildrenClass: false,
      visible: -1,
      data: [{
        id: 1,
        label: '一级 1',
        level: 1,
        children: [{
          id: 4,
          label: '二级 1-1',
          level: 2
        }]
      }, {
        id: 2,
        label: '一级 2',
        level: 1,
        children: [{
          id: 5,
          label: '二级 2-1',
          level: 2
        }, {
          id: 6,
          label: '二级 2-2',
          level: 2
        }]
      }, {
        id: 3,
        label: '一级 3',
        level: 1,
        children: [{
          id: 7,
          label: '二级 3-1',
          level: 2
        }, {
          id: 8,
          label: '二级 3-2',
          level: 2
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    mouseenter (node) {
      this.visible = node.id
    },
    mouseleave (node) {
      this.visible = -1
    },
    addChildren (node, data) {
      this.openAddChildrenClass = true
    },
    update (node) {
      this.updateClassName = node.label
      this.openUpdateClass = true
    },
    remove () {
      this.openDelClass = true
    },
    handleDragStart (node, ev) {

    },
    handleDragEnter (draggingNode, dropNode, ev) {

    },
    handleDragLeave (draggingNode, dropNode, ev) {

    },
    handleDragOver (draggingNode, dropNode, ev) {

    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {

    },
    handleDrop (draggingNode, dropNode, dropType, ev) {

    },
    allowDrop (draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        return type !== 'inner'
      } else {
        return false
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1
    }
  }
}
</script>

<style lang="less" scoped>

.tree {
  /deep/ .el-tree-node__content {
    height: auto;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 8px 12px 8px 0;
  height: 40px
}

.Action {
  display: inline-block;
  padding-right: 15px;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  touch-action: none;
  cursor: var(--cursor, pointer);
  border-radius: 5px;
  border: none;
  outline: none;
  appearance: none;
  background-color: transparent;
  -webkit-tap-highlight-color: transparent;

  svg {
    flex: 0 0 auto;
    margin: auto;
    height: 100%;
    overflow: visible;
    fill: #919eab;
  }
}
</style>
