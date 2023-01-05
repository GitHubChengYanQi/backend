<template>
  <div class="lessonClass">
    <a-spin :spinning="tableLoading">
      <div class="lessonClass1">
        <div v-for="data in treeData" :key="data.key">
          <div
            class="custom-tree-node"
            :style="{backgroundColor:visible === data.key ? '#eee' : '#fff'}"
            @mouseenter="mouseenter(data)"
            @mouseleave="mouseleave(data)"
          >
            <div class="classRow">
              <DragIcon class="my-handle"></DragIcon>
              <span class="className">{{ data?.title }}</span>
            </div>
            <div class="my-space">
              <div v-if="visible === data.key">
                <a-button
                  type="link"
                  @click="add(data)">
                  <a-icon type="plus-circle" />
                </a-button>
                <a-button
                  type="link"
                  @click="() => update(data)">
                  <a-icon type="edit" />
                </a-button>
                <a-button
                  type="link"
                  @click="() => remove(data)">
                  <a-icon type="delete" />
                </a-button>
              </div>
              <div v-if="Array.isArray(data.children) && data.children.length > 0">
                <a-button
                  type="link"
                  @click="expanded(data,data.key === expandedKey)"
                >
                  <a-icon v-if="data.key !== expandedKey" type="left" />
                  <a-icon v-else type="down" />
                </a-button>
              </div>
            </div>
          </div>

          <div class="lessonClass2" v-if="data.key === expandedKey">
            <div
              v-for="childrenItem in data.children"
              :key="childrenItem.key"
              :style="{backgroundColor:visible === childrenItem.key ? '#eee' : '#fff',paddingLeft: '18px'}"
            >
              <div
                class="custom-tree-node"
                @mouseenter="mouseenter(childrenItem)"
                @mouseleave="mouseleave(childrenItem)"
              >
                <div class="classRow">
                  <DragIcon class="my-handle"></DragIcon>
                  <span class="className">{{ childrenItem?.title }}</span>
                </div>
                <div class="my-space">
                  <div v-if="visible === childrenItem.key" style="padding-right: 8px">
                    <a-button
                      type="link"
                      @click="() => update(childrenItem)">
                      <a-icon type="edit" />
                    </a-button>
                    <a-button
                      type="link"
                      @click="() => remove(childrenItem)">
                      <a-icon type="delete" />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        <a-input v-model="className" placeholder="请输入分类名称" :maxLength="8"></a-input>
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
        <a-input v-model="className" placeholder="请输入分类名称" :maxLength="8"></a-input>
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
        <a-input v-model="updateClass.title" placeholder="请输入分类名称" :maxLength="8"></a-input>
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
import Sortable from 'sortablejs'

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
      expandedKey: 0,
      treeData: [],
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
        this.treeData = formatTree(res.data, 1)
      }).finally(() => {
        this.tableLoading = false
        // 获取节点
        const node = document.querySelector('.lessonClass1')
        // 拖拽排序
        Sortable.create(node, {
          delay: 0,
          handle: '.my-handle',
          animation: 300, // 拖拽延时，效果更好看
          onEnd: async (evt) => {
            this.treeData.splice(evt.newIndex, 0, this.treeData.splice(evt.oldIndex, 1)[0])
            this.handleDragEnd()
          }
        })
      })
    },
    addClass (pid) {
      if (!this.className) {
        return this.$message.warning('请输入分类名称！')
      }
      this.loading = true
      courseClassAdd({ name: this.className, pid: pid || 0 }).then((res) => {
        this.$message.success('分类创建成功!')
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
        this.$message.success('分类修改成功!')
        this.openUpdateClass = false
        this.getTreeData()
      }).finally(() => {
        this.loading = false
      })
    },
    deleteClass () {
      this.loading = true
      courseClassDelete({ courseClassId: this.delClass.key }).then((res) => {
        this.$message.success('分类删除成功!')
        this.getTreeData()
        this.openDelClass = false
      }).finally(() => {
        this.loading = false
      })
    },
    mouseenter (data) {
      this.visible = data.key
    },
    mouseleave () {
      this.visible = -1
    },
    add (data) {
      this.className = ''
      this.parentClassId = data.key
      this.openAddChildrenClass = true
    },
    update (data) {
      this.updateClass = { ...data }
      this.openUpdateClass = true
    },
    remove (data) {
      this.delClass = data
      this.openDelClass = true
    },
    expanded (data, expanded) {
      this.expandedKey = expanded ? 0 : data.key
      if (!expanded) {
        setTimeout(() => {
          // 获取节点
          const node = document.querySelector('.lessonClass2')
          // 拖拽排序
          Sortable.create(node, {
            delay: 0,
            handle: '.my-handle',
            animation: 300, // 拖拽延时，效果更好看
            onEnd: async (evt) => {
              const newTreeData = this.treeData.map((item) => {
                if (item.key === data.key) {
                  const children = item.children || []
                  children.splice(evt.newIndex, 0, children.splice(evt.oldIndex, 1)[0])
                  return { ...item, children }
                }
                return item
              })
              this.treeData = newTreeData
              this.handleDragEnd()
            }
          })
        }, 0)
      }
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
      formatTree(this.treeData)
      this.tableLoading = true
      courseClassSort({ params: newData }).then(() => {
        message.success('排序成功！')
      }).catch(() => {
        this.getTreeData()
      }).finally(() => {
        this.tableLoading = false
      })
    }
  },
  components: { DragIcon }
}
</script>

<style lang="less" scoped>
.my-space {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-search {
  .ant-form-inline {
    .ant-form-item {
      margin-bottom: 24px;
    }
  }
}

.warnButton {
  color: rgba(255, 152, 0, 1);
  background-color: rgba(252, 192, 104, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.linkButton {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.delButton {
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.successButton {
  color: #01ba77;
  background-color: rgba(1, 186, 119, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.my-table-search {
  border-radius: 8px;

  .ant-form-inline .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-input,
  .ant-select-selection,
  .ant-time-picker-input {
    border-radius: 8px !important;
  }

  .ant-btn {
    margin-right: 10px;
    border-radius: 8px;
  }
}

.my-table-wrapper {
  border-radius: 8px;

  .btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 24px;

    > .ant-btn {
      margin-left: 12px;
      border-radius: 8px;
    }
  }
}

.my-table {
  background-color: #fff;

  .ant-table-pagination {
    padding: 24px;
    float: none;
    text-align: center;
  }
}

.myTooltip {
  background-color: #fff;

  .ant-tooltip-inner {
    color: #000;
    background-color: #fff;
  }

  .ant-tooltip-arrow::before {
    background-color: #fff;
  }
}

.myLabelBox {
  width: 400px;

  span {
    margin-bottom: 10px;
  }
}

.my-modal {
  .ant-modal-footer {
    padding: 24px;
    text-align: center;

    .ant-btn {
      padding: 0 24px;
      border-radius: 8px;
    }

    .ant-modal-footer button + button {
      margin-left: 24px;
    }
  }
}

.lessonClass {
  max-height: 440px;
  overflow: auto;

  .ant-btn {
    padding: 0 4px;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 8px 12px;
  height: 40px;
}

.classRow {
  display: flex;
  align-items: center;

  .className {
    display: inline-block;
    white-space: nowrap;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

</style>
