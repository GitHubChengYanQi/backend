<!-- 话术分类 - 组件 -->
<template>
  <div class="component-wrap">
    <a-spin
      :spinning="isSaving"
      :indicator="indicator"
    >
      <a-card
        :title="mode === 'operator' ? '话术分类' : ''"
        :class="mode !== 'operator' ? 'no-padding' : ''"
      >
        <a-button
          type="primary"
          slot="extra"
          @click="addFolder()"
          v-if="mode === 'operator' && permission.includes(addFolderPermission[tableIndex])"
        >添加话术文件夹</a-button>

        <!-- 部门切换 -->
        <a-select
          :default-value="currentDept"
          class="dept-switcher"
          @change="handleChangeDept"
          v-if="type === '部门话术' && deptList.length > 0 && mode !== 'selector'"
        >
          <a-select-option
            v-for="(dept, index) in deptList"
            :key="index"
            :value="dept.departmentId"
          >
            {{ dept.departmentName }}
          </a-select-option>
        </a-select>

        <!-- defaultSelectedKeys 用与默认选择第一个 -->
        <a-tree
          ref="tree"
          :tree-data="folderList"
          :draggable="mode === 'operator'"
          expandAction="click"
          :replace-fields="replaceFields"
          :expandedKeys.sync="expandKeys"
          :selectedKeys.sync="selectedKeys"
          @select="onSelect"
          @drop="onDrop"
          @dragend="onDragend"
        >

          <template
            slot="title"
            slot-scope="item"
          >
            <a-row>
              <a-col :span="23">
                <div class="folder-title">
                  <img
                    class="folder-icon"
                    :src="require('@/assets/speechcraft/folder_icon.png')"
                    alt="folder_icon"
                    v-if="item.id !== 0"
                  >
                  <img
                    class="folder-icon"
                    :src="require('@/assets/speechcraft/recycle_bin_icon.png')"
                    alt="recycle_bin_icon"
                    v-else
                  >
                  {{ item.categoryName }}
                </div>
              </a-col>
              <a-col :span="1">
                <!-- 2、点击一级文件夹，右侧出现三个图标，功能分别为，新增子文件夹，修改一级文件夹名称，删除一级文件夹； -->
                <!-- 3、点击二级文件夹，右侧出现二个图标，功能分别为，修改二级文件夹名称，删除二级文件夹； -->
                <a-button-group
                  style="float:right"
                  v-if="item.selected && item.id !== 0 && mode === 'operator'"
                >
                  <a-button
                    v-permission="addPermission"
                    size="small"
                    icon="plus-circle"
                    @click.stop="addFolder(item)"
                    v-if="item.level === 1"
                  />
                  <a-button
                    v-permission="editPermission"
                    size="small"
                    icon="edit"
                    @click.stop="renameFolder(item)"
                  />
                  <a-button
                    v-permission="deletePermission"
                    size="small"
                    icon="delete"
                    @click.stop="deleteFolder(item)"
                  />
                </a-button-group>
              </a-col>
            </a-row>
          </template>
        </a-tree>

        <a-pagination
          style="margin-top: 13px;"
          size="small"
          show-quick-jumper
          :hideOnSinglePage="true"
          :total="total"
          :show-total="i => `共${i}条`"
          @change="onChangePage"
          :page-size.sync="pageSize"
        />
      </a-card>
    </a-spin>

    <!-- 添加话术文件夹对话框 -->
    <a-modal
      centered
      :title="modalTitle"
      :visible="addVisible"
      @ok="addOrEditFolderHandler"
      @cancel="addVisible=false"
    >
      <a-form-model
        ref="addCategoryForm"
        :model="folder"
        :rules="rules"
      >
        <a-form-model-item prop="categoryName">
          <a-input
            placeholder="请输入话术文件夹名称"
            v-model="folder.categoryName"
            :maxLength="20"
            :suffix="`${folder.categoryName.length}/20`"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable */
import store from '@/store'

export default {
  name: 'SpeechcraftCategory',
  props: {
    type: {
      type: String,
      default: '公司话术'
    },
    // selector=回收站还原时选择器 默认=左侧分类组件
    mode: {
      type: String,
      default: 'operator'
    },
    selectorDept: {
      type: Number,
      default: null
    },
    // 增加权限
    addPermission: {
      type: String,
      required: true
    },
    // 重命名+拖拽权限
    editPermission: {
      type: String,
      required: true
    },
    // 删除权限
    deletePermission: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      indicator: <a-icon type="loading" style="font-size: 24px" spin />,
      modalTitle: '添加话术文件夹',
      // 添加话术文件夹对话框可见性
      addVisible: false,
      folder: {
        categoryName: ''
      },
      dataList: [],
      // 当前选中的部门
      currentDept: null,
      // 当前用户部门信息集合
      deptList: [],
      // 文件夹数组
      folderList: [],
      expandKeys: [],
      // 选中的节点
      selectedKeys: [],
      replaceFields: {
        title: 'categoryName'
      },
      // 是否正在保存
      isSaving: true,
      // 页码
      pageIndex: 1,
      // 分页大小
      pageSize: 30,
      // 总数据数
      total: 0,
      rules: {
        categoryName: [{ required: true, message: '话术文件夹名称不能为空', trigger: 'blur' }]
      },
      // 重命名时保存旧文件夹名使用 用于判断是否有改动 如果没有改动直接提示成功
      oldCategoryName: null,
      // 页面权限
      permission: [],
      // 根据路由获取按钮绑定的权限
      addFolderPermission: [
        '/speechcraft/company@addFloader',
        '/speechcraft/department@addFloader',
        '/speechcraft/individual@addFloader'
      ],
      tableIndex: 0,
      pageRouter:[
        '/speechcraft/company',
        '/speechcraft/department',
        '/speechcraft/individual'
      ]
    }
  },
  created() {
    this.getPermission()
  },
  mounted() {
    if (this.type === '部门话术') {
      // 部门话术需要先 读取部门信息 获取到选择的部门ID后再读取选中部门下的所有文件夹
      this.$http.get(`/speechcraftCategory/getUserDept`).then((response) => {
        this.deptList = response.data.department || []
        if (this.deptList) {
          if (this.selectorDept) {
            // 如果明确指定了哪个部门 则使用指定部门 (用户部门话术回收站 还原时还原到指定部门下)
            this.currentDept = this.selectorDept
          } else {
            // 否则默认第一个部门(除管理员以外的用户也只能有一个部门)
            this.currentDept = this.deptList[0].departmentId
          }
          this.$emit('deptChange', this.currentDept)
          // 有了部门ID 再读取数据
          this.loadCategory()
        } else {
          // 无部门
          this.$message.error('无部门数据')
        }
      })
    } else {
      // 不是部门话术 直接按类型加载所有文件夹
      this.loadCategory()
    }
  },
  methods: {
    getPermission() {
      this.tableIndex = this.pageRouter.indexOf(this.$route.path)
      const sideMenus = store.state.permission.permissionList
      sideMenus[0].children.map((item) => {
        if (item.children.length > 0) {
          item.children.map((items) => {
            if (items.path == this.$route.path) {
              this.permission = items.meta.actionList
            }
          })
        }
      })
    },
    // 加载分类
    loadCategory: function () {
      this.isSaving = true
      this.$http
        .post(`/speechcraftCategory/getCategoryByType?page=${this.pageIndex}&size=${this.pageSize}`, {
          type: this.type,
          deptId: this.currentDept
        })
        .then((response) => {
          this.dataList = response.data.records || []
          this.total = response.data.total || 0
          // 使用每条数据的主键当作key
          for (let data of this.dataList) {
            this.$set(data, 'key', data.id)
          }
          // 筛选一级文件夹
          this.folderList = this.dataList.filter((item) => item.pid === null && item.markAsDeleted === false) //.sort((a, b) => b.sort - a.sort)
          // 关联二级文件夹
          for (let folder of this.folderList) {
            let children = this.dataList.filter((item) => item.pid === folder.id && item.markAsDeleted === false) //.sort((a, b) => b.sort - a.sort)
            // 设置二级文件夹等级
            for (let child of children) {
              this.$set(child, 'level', 2)
            }
            this.$set(folder, 'children', children)
            this.$set(folder, 'level', 1)
          }

          if (this.mode === 'operator') {
            // 添加回收站
            this.folderList.push({
              key: -1,
              categoryName: '回收站',
              id: 0,
              children: this.dataList.filter((item) => item.markAsDeleted === true)
            })
            // 7、默认展开第一个一级文件夹下第一个子文件夹内容，其他一级文件夹收起，右侧默认显示第一个一级文件夹下第一个子文件夹内容；
            // 至少有一个回收站
            let firstFolder = this.folderList[0]
            if (this.folderList.length > 1 && firstFolder.children.length > 0) {
              // 展开第一个节点
              this.expandKeys = [firstFolder.key]
              // 如果有子节点 则选中子节点
              this.selectedKeys = [firstFolder.children[0].key]
            } else {
              // 没有子节点或者长度不大于1(只有回收站) 选中自己
              this.selectedKeys = [firstFolder.key]
            }
            // 触发选中事件 获取当前文件夹信息
            let folder = this.dataList.find((item) => item.key === this.selectedKeys[0])
            if (!folder) {
              // 点击的是回收站
              folder = {
                id: -1,
                markAsDeleted: true
              }
            }
            // 如果点击的是二级文件夹 给一级文件夹的名也带出去 转移分组 回收站恢复的时候都能用到
            if (folder.level === 2) {
              let parentFolder = this.dataList.find((item) => item.key === folder.pid)
              folder.path = parentFolder.categoryName + ' > ' + folder.categoryName
            } else {
              folder.path = folder.categoryName
            }
            this.$emit('selectChange', folder)
          }

          // 展开所有节点
          //this.expandKeys = this.dataList.map(item => item.key)

          // 结束loading
          this.isSaving = false
        })
    },
    // 部门下拉切换 (用户有多个部门时)
    handleChangeDept(value) {
      this.currentDept = value
      this.$emit('deptChange', value)
      this.pageIndex = 1
      this.loadCategory()
    },
    // 切换页码
    onChangePage: function (index) {
      this.pageIndex = index
      this.loadCategory()
    },
    // 添加文件夹
    addFolder: function (item = {}) {
      this.modalTitle = '添加话术文件夹'
      this.folder = {
        categoryName: ''
      }
      if (item.id) {
        // 设置新建的文件夹父分类为点击的主键
        this.$set(this.folder, 'pid', item.id)
      } else {
        // 清空父分类
        this.$set(this.folder, 'pid', null)
      }
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.addCategoryForm.clearValidate()
      })
    },
    // 重命名文件夹
    renameFolder: function (item) {
      this.modalTitle = '编辑话术文件夹名称'
      this.folder = item

      this.addVisible = true
      // 记录旧文件夹名称 用于判断是否有改动
      this.oldCategoryName = this.folder.categoryName
      this.$nextTick(() => {
        this.$refs.addCategoryForm.clearValidate()
      })
    },
    // 处理新建或修改文件夹名
    addOrEditFolderHandler: function () {
      // 校验
      this.$refs.addCategoryForm.validate((valid) => {
        if (valid) {
          if (this.modalTitle === '编辑话术文件夹名称') {
            if (this.oldCategoryName === this.folder.categoryName) {
              // 没有任何改动 不走接口 直接返回成功
              this.$notification.success({
                message: '提示',
                description: '修改成功'
              })
              // 关闭弹窗
              this.addVisible = false
              // 清空临时变量
              this.oldCategoryName = null
              return
            }
            // 修改
            this.$http
              .put(`/speechcraftCategory/rename`, {
                type: this.type,
                deptId: this.currentDept,
                categoryName: this.folder.categoryName,
                id: this.folder.id
              })
              .then((response) => {
                if (response.code === 200) {
                  this.addVisible = false
                  // 修改成功
                  this.$notification.success({
                    message: '提示',
                    description: '修改成功'
                  })
                  // 重新加载列表
                  this.loadCategory()
                } else {
                  // 修改失败
                  this.$notification.error({
                    message: '提示',
                    description: response.msg
                  })
                }
              })
          } else {
            // 新建
            let param = {
              pid: this.folder.pid, // 所属一级文件夹ID
              deptId: this.currentDept,
              categoryName: this.folder.categoryName,
              type: this.type
            }
            this.$http.put(`/speechcraftCategory/addCategory`, param).then((response) => {
              if (response.code === 200) {
                this.addVisible = false
                // 添加成功
                this.$notification.success({
                  message: '提示',
                  description: '添加成功'
                })
                // 重新加载列表
                this.loadCategory()
              } else {
                // 添加失败
                this.$notification.error({
                  message: '提示',
                  description: response.msg
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 删除文件夹
    deleteFolder: function (item) {
      let that = this
      this.$confirm({
        centered: true,
        title: '确定删除？',
        content: '删除文件夹将同时删除文件夹下的话术, 您可在回收站内找到该条话术。',
        onOk() {
          that.$http.delete(`/speechcraftCategory/deleteCategory?id=${item.id}`).then((response) => {
            if (response.code === 200) {
              // 删除成功
              that.$notification.success({
                message: '提示',
                description: '删除成功'
              })
              // 重新加载列表
              that.loadCategory()
            } else {
              // 删除失败
              that.$notification.error({
                message: '提示',
                description: response.msg
              })
            }
          })
        },
        onCancel() {}
      })
    },
    // 选择节点
    onSelect: function (selectedKeys, event) {
      // 当前点击的key
      let key = selectedKeys[0]

      if (!this.expandKeys.includes(key)) {
        event.node.onExpand()
      }

      if (event.selected) {
        // 获取当前文件夹信息
        let folder = this.dataList.find((item) => item.key === key)
        if (!folder) {
          // 点击的是回收站
          folder = {
            id: -1,
            markAsDeleted: true
          }
        }

        // 如果点击的是二级文件夹 给一级文件夹的名也带出去 转移分组 回收站恢复的时候都能用到
        if (folder.level === 2) {
          let parentFolder = this.dataList.find((item) => item.key === folder.pid)
          folder.path = parentFolder.categoryName + ' > ' + folder.categoryName
        } else {
          folder.path = folder.categoryName
        }

        this.$emit('selectChange', folder)
      }
    },
    // 拖动结束展开所有节点
    onDragend: function () {
      //this.expandKeys = this.dataList.map(item => item.key)
    },
    // 拖拽移动算法
    onDrop: function (info) {
      // 校验权限 只有编辑权限才能拖动
      let actionList = this.$route.meta.actionList || []
      if (actionList.length === 0 || !actionList.includes(this.editPermission)) {
        return
      }
      // 拖拽后自动展开所有节点
      //this.expandKeys = this.dataList.map(item => item.key)

      // info.dragNodesKeys 移动的所有主键

      // 丢下的key
      const dropKey = info.node.eventKey
      // 拖动的key
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }

      // 移动的是回收站(key=-1) 直接返回
      if (dragKey === -1) {
        return
      }

      // 丢在回收站上
      if (dropKey === -1) {
        return
      }

      // 拖动的文件夹对象
      let move = this.dataList.find((item) => item.key === dragKey)
      // 目标文件夹对象
      let target = this.dataList.find((item) => item.key === dropKey)

      if (!info.dropToGap) {
        // 丢到文件夹上
        if (target.level > 1) {
          // 不能向二级菜单中继续添加文件夹
          return
        }
        if (move.level === 1) {
          // 一级文件夹不能拖动进其他文件夹
          return
        }
      } else {
        // 丢到缝隙上
        if (move.level === 1 && target.level > 1) {
          // 一级文件夹不能向二级文件夹排序
          return
        }
        if (move.level > 1 && target.level === 1) {
          // 二级文件夹也不能向一级文件夹排序
          return
        }
      }

      const data = [...this.folderList]

      // 获取dragObject
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })

      if (!info.dropToGap) {
        // 丢到文件夹上
        loop(data, dropKey, (item) => {
          item.children = item.children || []
          // PRD要求添加到第一个位置
          item.children.unshift(dragObj)
        })
      } else {
        // 丢到缝隙上
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.folderList = data
      this.saveCategorySort()
    },
    // 拖动后保存顺序
    saveCategorySort: function () {
      this.isSaving = true

      for (let i = 0; i < this.folderList.length; i++) {
        let folder = this.folderList[i]
        // 保证数据正确性
        folder.level = 1
        // 保证数据正确性
        folder.pid = null
        // 重新计算顺序 (倒序) 序号扣掉回收站(0) 入库的数据sort最小值是1
        folder.sort = this.folderList.length - i - 1

        // 如果有二级目录 继续计算二级顺序
        if (folder.children) {
          for (let j = 0; j < folder.children.length; j++) {
            let child = folder.children[j]
            // 保证数据正确性
            child.level = 2
            // 保证数据正确性
            child.pid = folder.id
            // 重新计算顺序 (倒序) 入库的数据sort最小值是1
            child.sort = folder.children.length - j
          }
        }
      }

      let param = {
        page: this.pageIndex,
        size: this.pageSize,
        type: this.type,
        dept: this.currentDept,
        list: this.folderList.filter((item) => item.key !== -1)
      }
      // 持久化 (排除掉回收站) 带页码 后台重新排序 前台有分页了 计算的sort不再准确 (但二级菜单的排序 还是依赖前端计算的sort)
      this.$http.post(`/speechcraftCategory/saveCategorySort`, param).then((response) => {
        this.isSaving = false
      })
    },
    // 取消选择任何文件夹 父组件主动调用
    deselected: function () {
      this.selectedKeys = []
    }
  }
}
</script>

<style lang="less" scoped>

.dept-switcher {
  width: 100%;
  margin-bottom: 10px;
}

.folder-title {
  height: 24px;
  line-height: 24px;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;

  .folder-icon {
    width: 21px;
    margin-right: 6px;
  }
}

::v-deep .ant-tree-switcher {
  display: none !important;
}

::v-deep .ant-tree li ul {
  padding: 0 0 0 38px !important;
}

::v-deep .ant-tree li .ant-tree-node-content-wrapper:hover {
  background-color: #f5f5fe !important;
}

::v-deep .ant-tree-node-selected {
  background-color: #f5f5fe !important;

  color: #02a7f0 !important;
}

::v-deep .ant-tree-node-content-wrapper {
  background-color: #f7f7f7;
  width: 100% !important;
  padding: 10px !important;
  height: initial !important;
}

::v-deep .ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper::before,
::v-deep
  .ant-tree.ant-tree-directory
  .ant-tree-child-tree
  > li.ant-tree-treenode-selected
  > span.ant-tree-node-content-wrapper::before {
  background-color: transparent !important;
}

::v-deep .ant-tree.ant-tree-directory > li span.ant-tree-node-content-wrapper:hover::before,
::v-deep .ant-tree.ant-tree-directory .ant-tree-child-tree > li span.ant-tree-node-content-wrapper:hover::before {
  background-color: transparent !important;
}

.no-padding {
  border: 0 !important;

  ::v-deep .ant-card-body {
    padding: 0 !important;
  }
}
</style>
