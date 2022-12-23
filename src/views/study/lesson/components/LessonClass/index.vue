<template>
  <div class="lessonClass">
    <a-spin :spinning="tableLoading">
      <el-tree
        class="tree"
        :data="data"
        icon-class="icon"
        node-key="key"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
      >
        <div
          class="custom-tree-node"
          slot-scope="{ node, data }"
          @mouseenter="mouseenter(node)"
          @mouseleave="mouseleave(node)"

        >
          <div>
            <DragIcon></DragIcon>
            <span>{{ data.title }}</span>
          </div>
          <div class="my-space">
            <div v-if="visible === node.key" style="padding-right: 8px">
              <el-button
                v-if="data.level === 1"
                type="text"
                size="mini"
                @click="() => {
                  className = ''
                  parentClassId = data.key
                  openAddChildrenClass = true
                }">
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
    </a-spin>

    <a-button
      icon="plus"
      style="width: 100%;margin-top: 12px;border-radius: 4px;position: sticky;bottom: 0"
      @click="()=>{
        className = ''
        openAddClass = true
      }"
    >
      添加分类
    </a-button>

    <a-modal
      centered
      v-model="openAddClass"
      title="新建分类"
      class="my-modal"
      :okButtonProps="{props:{loading}}"
      @ok="addClass()"
    >
      <div class="my-space">
        <div style="width: 100px">分类名称：</div>
        <a-input v-model="className" placeholder="请输入分类名称"></a-input>
      </div>
    </a-modal>

    <a-modal
      centered
      v-model="openAddChildrenClass"
      title="新建子分类"
      class="my-modal"
      :okButtonProps="{props:{loading}}"
      @ok="addClass(parentClassId)"
    >
      <div class="my-space">
        <div style="width: 100px">分类名称：</div>
        <a-input v-model="className" placeholder="请输入分类名称"></a-input>
      </div>
    </a-modal>

    <a-modal
      centered
      v-model="openUpdateClass"
      title="编辑分类"
      class="my-modal"
      :okButtonProps="{props:{loading}}"
      @ok="edit"
    >
      <div class="my-space">
        <div style="width: 100px">分类名称：</div>
        <a-input v-model="updateClass.title" placeholder="请输入分类名称"></a-input>
      </div>
    </a-modal>

    <a-modal
      centered
      v-model="openDelClass"
      title="提示"
      class="my-modal"
      :okButtonProps="{props:{loading}}"
      @ok="deleteClass"
    >
      <div class="my-space">
        <a-icon type="exclamation-circle" theme="filled" style="color: red;font-size: 24px;" />
        <div>
          删除该分类后，分类下的子分类及创建的课程列表都会被删除确定删除“{{ delClass.title }}”分类吗?
        </div>
      </div>
    </a-modal>
  </div>

</template>

<script>
import DragIcon from '../../../components/DragIcon'
import {
  courseClassAdd,
  courseClassDelete,
  courseClassSort,
  courseClassTreeView,
  courseClassUpdate
} from '@/api/study/lessonClass'
import { message } from 'ant-design-vue'

export default {
  data () {
    return {
      tableLoading: false,
      loading: false,
      className: '',
      delClass: {},
      addChildrenClassName: '',
      updateClass: {},
      parentClassId: '',
      openUpdateClass: false,
      openAddClass: false,
      openDelClass: false,
      openAddChildrenClass: false,
      visible: -1,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    getTreeData () {
      this.tableLoading = true
      courseClassTreeView().then((res) => {
        const formatTree = (data, level) => {
          if (!Array.isArray(data)) {
            return []
          }
          return data.map(item => ({ ...item, level, children: formatTree(item.children, level + 1) }))
        }
        this.data = formatTree(res.data, 1)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    addClass (pid) {
      if (!this.className) {
        return this.$message.warning('请输入分类名称！')
      }
      this.loading = true
      courseClassAdd({ name: this.className, pid: pid || 0 }).then((res) => {
        this.$message.success('添加成功!')
        this.openAddClass = false
        this.openAddChildrenClass = false
        this.getTreeData()
      }).finally(() => {
        this.loading = false
      })
    },
    edit () {
      if (!this.updateClass.title) {
        return this.$message.warning('请输入分类名称！')
      }
      this.loading = true
      courseClassUpdate({ courseClassId: this.updateClass.key, name: this.updateClass.title }).then((res) => {
        this.$message.success('修改成功!')
        this.openUpdateClass = false
        this.getTreeData()
      }).finally(() => {
        this.loading = false
      })
    },
    deleteClass () {
      this.loading = true
      courseClassDelete({ courseClassId: this.delClass.key }).then((res) => {
        this.$message.success('删除成功!')
        this.getTreeData()
        this.openDelClass = false
      }).finally(() => {
        this.loading = false
      })
    },
    mouseenter (node) {
      this.visible = node.key
    },
    mouseleave (node) {
      this.visible = -1
    },
    update (node) {
      this.updateClass = { ...node.data }
      this.openUpdateClass = true
    },
    remove (node) {
      this.delClass = node.data
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
    handleDragEnd () {
      const newData = []
      const formatTree = (data) => {
        if (!Array.isArray(data)) {
          return []
        }
        return data.forEach((item, index) => {
          newData.push({
            name: item.title,
            courseClassId: item.key,
            sort: index
          })
          formatTree(item.children)
        })
      }
      formatTree(this.data)
      this.tableLoading = true
      courseClassSort({ params: newData }).then(() => {
        message.success('排序成功！')
        this.getTreeData()
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {

    },
    allowDrop (draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        return type !== 'inner'
      } else {
        return false
      }
    }
  },
  components: { DragIcon }
}
</script>

<style lang="less" scoped>
.lessonClass {
  max-height: 400px;
  overflow: auto;
}

.tree {
  /deep/ .el-tree-node__content {
    height: auto;
    width: 100%;
    align-items: normal;

    .custom-tree-node {
      width: 100%;
      padding: 0 12px;
    }

    .el-tree-node__expand-icon {
      padding: 0;
    }

    .el-tree-node__expand-icon.is-leaf {
      min-height: 100%;
      padding: 0;
    }
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
</style>
