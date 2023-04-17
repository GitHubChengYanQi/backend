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
        @select="getGroups">
        <template slot="custom" slot-scope="item">
          <div class="tree-view-item">
            <span
              class="tree-view-left"
              v-html="
                item.title.replace(
                  new RegExp(searchValue, 'g'),
                  '<span style=color:#f50>' + searchValue + '</span>'
                )
              "></span>
            <span class="tree-view-right" v-if="selectKey.includes(item.key)">
            </span>
          </div>
        </template>
      </a-tree>
    </div>
    <div class="groupTag_right_box">
      <div class="groupTag_content_box" v-if="selectKey.length > 0 && selectKey[0] != '0'">
        <div class="groupTag_content">
          <span
            v-for="(item, index) in tabArr"
            :class="groupTagsSelectList.findIndex(it => it.id === item.id) === -1 ? 'tab_box' : 'tab_box tab_box_select'"
            :key="index"
            @click="handleSelect(item)"><span class="tab_txt">{{ item.itemName }}</span></span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {
  workRoomLabelTree,
  workRoomLabelLoad
} from '@/api/groupTag.js'
import { deepClonev2 } from '@/utils/util'

export default {
  name: 'GroupTags',
  props: {
    groupTagsSelectList: {
      default: () => [],
      type: Array
    }
  },
  model: {
    prop: 'groupTagsSelectList',
    event: 'groupChange'
  },
  data () {
    return {
      searchStr: '',
      searchValue: '',
      expandedKeys: [],
      backupsExpandedKeys: [],
      groupData: [],
      selectKey: [],
      titleData: [],
      tabArr: []
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
    onSearch () {
      this.searchValue = this.searchStr
      console.log(this.searchValue)
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
    },
    handleSelect (item) {
      const findIdx = this.groupTagsSelectList.findIndex(it => it.id === item.id)
      const oldD = deepClonev2(this.groupTagsSelectList)
      if (findIdx === -1) {
        oldD.push(item)
      } else {
        oldD.splice(findIdx, 1)
      }
      this.$emit('groupChange', oldD)
    },
    getTree (e) {
      const obj = {}
      workRoomLabelTree(obj).then((res) => {
        console.log(res)
        this.groupData = [res.data.root]
        let path = []
        if (e && e.length > 0) {
          path = e.map((item) => {
            return item.id.toString()
          })
          this.expandedKeys = [...path]
        } else {
          this.expandedKeys = ['0']
        }
        console.log(this.expandedKeys)
      })
    },
    // 获取节点中含有value的所有key集合
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
      if (this.selectKey[0] == '0' || this.selectKey.length == 0) return
      this.titleData = []
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
    }
  }
}
</script>

<style lang="less" scoped>
.groupTag_page {
  width: 100%;
  height: 70vh;
  display: flex;

  .groupTag_left_box {
    width: 230px;
    overflow: auto;
    max-height: 100%;
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
          display: flex;
          align-items: center;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.8980392156862745);

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
          cursor: pointer;

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

        .tab_box_select {
          background-color: rgba(0, 0, 0, .4);
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
