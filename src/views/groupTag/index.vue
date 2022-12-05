<template>
  <div class="groupTag_page">
    <div class="groupTag_left_box">
      <a-input-search
        v-model="searchStr"
        @change="onSearch"
        style="margin-bottom: 8px"
        placeholder="请输入分组名称"
      />
      <a-tree
        v-if="groupData.length"
        :treeData="groupData"
        @expand="onExpand"
        :selectedKeys="selectKey"
        :expandedKeys="expandedKeys"
        :defaultExpandAll="true"
        @select="getGroups"
      >
        <template
          slot="custom"
          slot-scope="item"
        >
          <div class="tree-view-item">
            <span
              class="tree-view-left"
              v-html="
                item.title.replace(
                  new RegExp(searchValue, 'g'),
                  '<span style=color:#f50>' + searchValue + '</span>'
                )
              "
            ></span>
            <span
              class="tree-view-right"
              v-if="selectKey.includes(item.key)"
            >
              <a-dropdown
                :trigger="['click']"
                placement="bottomLeft"
              >
                <img
                  @click.stop
                  class="icon"
                  :src="require('@/assets/set.png')"
                  alt=""
                />
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-if="item.operation ? item.operation.includes(0) : false">
                      <div
                        class="down_select"
                        @click="setGroup(0,item)"
                      >新建子分类</div>
                    </a-menu-item>
                    <a-menu-item v-if="item.operation ? item.operation.includes(1) : false">
                      <div
                        class="down_select"
                        @click="setGroup(1,item)"
                      >修改分类</div>
                    </a-menu-item>
                    <a-menu-item v-if="item.operation ? item.operation.includes(2) : false">
                      <div
                        class="down_select"
                        @click="setGroup(2,item)"
                      >删除分类</div>
                    </a-menu-item>
                    <a-menu-item v-if="item.operation ? item.operation.includes(3) : false">
                      <div
                        class="down_select"
                        @click="setGroup(3,item)"
                      >向上移动</div>
                    </a-menu-item>
                    <a-menu-item v-if="item.operation ? item.operation.includes(4) : false">
                      <div
                        class="down_select"
                        @click="setGroup(4,item)"
                      >向下移动</div>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </span>
          </div>
        </template>
      </a-tree>
    </div>
    <div class="groupTag_right_box">
      <div
        class="groupTag_content_box"
        v-if="selectKey.length > 0"
      >
        <div class="groupTag_header_box">
          <div
            class="title"
            :style="index + 1 != titleData.length ? {}:{color:'#000'}"
            v-for="(item,index) in titleData"
            @click="getGroups([item.id.toString()])"
            :key="index"
          >
            <span class="icon">
              <img
                class="img"
                :src=" index == 0 ? require('@/assets/branch_start.svg') : require('@/assets/branch_icon.svg')"
                alt=""
              >
            </span>
            {{ item.unitName }}
            <span
              class="division"
              v-if="index + 1 < titleData.length"
            >></span>
          </div>
        </div>
        <div class="groupTag_content">
          <span
            class="add_box"
            v-if="add.addState"
            @click="()=>{
              add.addState = !add.addState
            }"
          >
            <span class="add_icon">+</span>
            <span class="add_txt">添加标签</span>
          </span>
          <span
            class="input_box"
            v-else
          >
            <a-input
              v-model="add.addInput"
              style="height:24px;"
              :maxLength="10"
              @keyup.enter.native="searchAllCompany"
              placeholder="请输入"
            ></a-input>
          </span>
          <span
            class="tab_box"
            v-for="(item,index) in tabArr"
            :key="index"
          ><span class="tab_txt">{{ item.itemName }}</span><span
            class="tab_icon"
            @click="delTab(item.id)"
          >+</span></span>
        </div>
      </div>
    </div>
    <a-modal
      v-model="modelData.state"
      :title="modelData.title"
      width="591px"
      @ok="setName"
      @cancel="()=>{
        modelData.state = false
        modelData.unitName = ''
      }"
    >
      <div class="model_input_box">
        <span class="model_input_title"> <span class="model_input_icon">* </span> 标签组名称：</span>
        <a-input
          v-model="modelData.unitName"
          :maxLength="15"
        ></a-input>
        <span class="hint">{{ modelData.unitName.length + '/15' }}</span>
      </div>
    </a-modal>
  </div>

</template>

<script>
import {
  workRoomLabelTree,
  workRoomLabelSave,
  workRoomLabelDrop,
  workRoomLabelLoad,
  workRoomLabelMove
} from '@/api/groupTag.js'

export default {
  data () {
    return {
      expandedKeys: [],
      backupsExpandedKeys: [],
      searchStr: '',
      searchValue: '',
      groupData: [],
      selectKey: [],
      titleData: [],
      add: {
        addState: true,
        addInput: ''
      },
      tabArr: [],
      modelData: {
        title: '新增标签组',
        state: false,
        unitName: '',
        operation: 0
      }
    }
  },
  created () {
    this.getTree()
  },
  mounted () {
    document.addEventListener('click', this.setselectdiv)
  },
  destroyed () {
    document.removeEventListener('click', this.setselectdiv)
  },
  methods: {
    searchAllCompany (e) {
      if (this.selectKey.length > 0 && this.add.addInput.length > 0) {
        const obj = {
          itemName: this.add.addInput,
          parentId: this.selectKey[0]
        }
        workRoomLabelSave(obj).then((res) => {
          this.getTag()
        })
      }
      this.add.addState = true
      this.add.addInput = ''
    },
    getTree (e = []) {
      const obj = {}
      workRoomLabelTree(obj).then((res) => {
        console.log(res)
        this.groupData = [res.data.root]
        const path = e.map((item) => {
          return item.id.toString()
        })
        this.expandedKeys = e.length > 0 ? [...path] : ['0']
        console.log(this.expandedKeys)
      })
    },
    setName () {
      const { unitName, operation } = this.modelData
      const obj = {
        unitName
      }
      if (operation == 0) {
        obj.parentId = this.selectKey[0]
      } else {
        obj.id = this.selectKey[0]
      }
      console.log(obj)
      workRoomLabelSave(obj).then((res) => {
        console.log(res)
        this.getTree(this.titleData)
        this.modelData.state = false
      })
    },
    moveGroup (id, step) {
      const obj = {
        id,
        step
      }
      workRoomLabelMove(obj).then((res) => {
        console.log(res)
        this.getTree()
      })
    },
    delGrop (id) {
      const obj = {
        id
      }
      workRoomLabelDrop(obj).then((res) => {
        console.log(res)
      })
    },
    setGroup (e, item) {
      console.log(e, item)
      this.modelData.operation = e
      if (e == 0 || e == 1) {
        this.modelData.title = e == 0 ? '新增标签组' : '修改标签组'
        this.modelData.state = true
        this.modelData.unitName = e == 0 ? '' : item.title
      } else if (e == 2) {
        this.$confirm({
          title: '提示',
          content: '是否删除',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            const obj = {
              id: item.key
            }
            workRoomLabelDrop(obj).then((res) => {
              this.getTree()
            })
          },
          onCancel () {}
        })
      } else {
        this.moveGroup(item.key, e == 3 ? -1 : 1)
      }
    },
    onSearch () {
      this.searchValue = this.searchStr
      if (this.searchValue === '') {
        this.expandedKeys = []
      } else {
        this.expandedKeys = []
        this.backupsExpandedKeys = []
        const candidateKeysList = this.getkeyList(this.searchValue, this.groupData, [])
        candidateKeysList.forEach((item) => {
          const key = this.getParentKey(item, this.groupData)
          // eslint-disable-next-line no-shadow
          if (key && !this.backupsExpandedKeys.some((item) => item === key)) {
            this.backupsExpandedKeys.push(key)
          }
        })
        const { length } = this.backupsExpandedKeys
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < length; i++) {
          this.getAllParentKey(this.backupsExpandedKeys[i], this.groupData)
        }
        this.expandedKeys = this.backupsExpandedKeys.slice()
      }
    }, // 获取节点中含有value的所有key集合
    getkeyList (value, tree, keyList) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.title.indexOf(value) > -1) {
          keyList.push(node.key)
        }
        if (node.children) {
          this.getkeyList(value, node.children, keyList)
        }
      }
      return keyList
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
          } else if ((temp = this.getParentKey(key, node.children))) {
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
    getGroups (id) {
      this.selectKey = id
      if (this.selectKey.length == 0) return
      // this.titleData = []
      this.getTag()
    },
    getTag () {
      const obj = {
        id: this.selectKey[0]
      }
      console.log(obj)
      workRoomLabelLoad(obj).then((res) => {
        console.log(res)
        this.titleData = res.data.path
        this.tabArr = res.data.datas
      })
    },
    delTab (e) {
      const obj = {
        id: e
      }
      workRoomLabelDrop(obj).then((res) => {
        this.getTag()
      })
    },
    setselectdiv (e) {
      const thisClassName = e.target.className
      if (this.add.addState) return
      const txt = ['input_box', 'add_box', 'add_txt', 'add_icon', 'ant-input']
      if (!txt.includes(thisClassName)) {
        if (this.selectKey.length > 0 && this.add.addInput.length > 0) {
          const obj = {
            itemName: this.add.addInput,
            parentId: this.selectKey[0]
          }
          workRoomLabelSave(obj).then((res) => {
            this.getTag()
          })
        }
        this.add.addState = true
        this.add.addInput = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.groupTag_page {
  width: 100%;
  height: 100%;
  display: flex;
  .groupTag_left_box {
    width: 230px;
    overflow: auto;
    height: 744px;
    box-sizing: border-box;
    padding: 15px 5px;
    flex-shrink: 0;
    background-color: #fff;
    border-radius: 5px;
    .tree-view-right {
      position: relative;
      margin: 0 10px 0 80px;
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .groupTag_right_box {
    margin-left: 10px;
    flex-grow: 1;
    background-color: #fff;
    box-sizing: border-box;
    padding: 15px;
    .groupTag_content_box {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      .groupTag_header_box {
        box-sizing: border-box;
        padding-left: 25px;
        width: 100%;
        min-height: 45px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border-bottom: 1px solid #ccc;
        .title {
          cursor: pointer;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #ccc;

          &:hover{
            color: rgba(0, 82,217);
          }

          .icon {
            width: 14px;
            margin-right: 5px;
            position: relative;
            .img {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .division {
            color: #ccc;
            margin: 0 5px;
          }
        }
      }
      .groupTag_content {
        flex-grow: 1;
        box-sizing: border-box;
        padding: 40px 25px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        .add_box {
          cursor: pointer;
          margin-right: 20px;
          margin-bottom: 10px;
          height: 24px;
          display: flex;
          align-items: center;
          padding: 0 15px;
          border-radius: 5px;
          background-color: #e7e7e7;
          font-size: 13px;
          color: rgb(51, 51, 51);
          .add_icon {
            transform: translateY(-2px);
            width: 13px;
            margin-right: 5px;
            font-size: 18px;
            font-weight: 800;
          }
          .add_txt {
            white-space: nowrap;
          }
        }
        .input_box {
          margin-right: 20px;
          width: 90px;
          height: 24px;
        }
        .tab_box {
          position: relative;
          margin-right: 20px;
          margin-bottom: 10px;
          min-width: 84px;
          height: 24px;
          display: flex;
          align-items: center;
          padding: 0 15px;
          border-radius: 5px;
          background-color: #e7e7e7;
          font-size: 13px;
          color: rgb(51, 51, 51);
          .tab_txt {
            margin-right: 5px;
          }
          .tab_icon {
            cursor: pointer;
            position: absolute;
            top: 50%;
            right: 2px;
            transform: translateY(-50%) rotate(45deg);
            font-size: 20px;
          }
        }
      }
    }
  }
}
.model_input_box {
  height: 200px;
  display: flex;
  align-items: center;
  .model_input_title {
    position: relative;
    font-size: 13px;
    white-space: nowrap;
    .model_input_icon {
      color: red;
    }
  }
  .hint {
    position: absolute;
    top: 50%;
    right: 30px;
    transform: translate(0, -50%);
  }
}
</style>
