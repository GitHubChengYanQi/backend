<template>
  <div ref="addSop_Page_Container">
    <a-modal
      :maskClosable="false"
      :width="1000"
      title="需选择组织机构"
      :bodyStyle="dialogStyle"
      :visible="chooseTreeVisible"
      class="modalClass"
      :dialogStyle="dialogStyle"
      :getContainer="() => $refs['addSop_Page_Container']"
      @cancel="cancelModal">
      <div class="modalBody">
        <div class="left">
          <!-- <a-input placeholder="请输入部门/人员姓名" allow-clear class="inputClass" v-model="inputName"></a-input> -->
          <!-- :load-options="loadOptions" -->
          <!-- :append-to-body="true" -->
          <!-- :valueConsistsOf="`LEAF_PRIORITY`" -->
          <treeselect
            :limit="0"
            :limitText="() => ''"
            :multiple="true"
            :options="options"
            :value-consists-of="'LEAF_PRIORITY'"
            placeholder="请选择"
            v-model="valueArray"
            :maxHeight="1000"
            :clearable="false"
            :flat="false"
            :default-expand-level="1"
            :valueFormat="`object`"
            :searchable="true"
            :open-on-click="true"
            :alwaysOpen="true"
            :sort-value-by="'INDEX'"
          >
            <div slot="option-label" slot-scope="{ node }" >
              <img src="@/assets/person.png" v-if="node.raw.isLeaf === true">
              <img src="@/assets/bolder.png" v-if="node.raw.isLeaf === false">
              {{ node.raw.title }}
            </div>
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.title }}</div>
          </treeselect>
        </div>
        <div class="right">
          <div class="rightTitleDiv">
            <div class="rightTitle">已选择的部门或成员</div>
            <div class="rightButton" @click="clearSelect">清除</div>
          </div>
          <div class="tagDivWrapper">
            <div class="singleTagDiv" v-for="item in valueArray.filter(info => info.isLeaf === true)" :key="item.id">
              <div class="singleTagContent">
                <img src="@/assets/person.png" v-if="item.isLeaf === true">
                <img src="@/assets/bolder.png" v-else>
                <div class="singleTagText">{{ item.title }}</div>
              </div>
              <div class="deleteIconDiv" @click="deletePerson(item)">x</div>
            </div>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button
          @click="cancelModal"
        >取消</a-button>
        <a-button
          :disabled="valueArray.length === 0"
          @click="sureModal"
          type="primary"
        >确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
// import { getData } from '../person.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { deepClonev2 } from '@/utils/util'
export default {
  name: 'BackendtestChooseTree',
  components: { Treeselect },
  data () {
    return {
      chooseTreeVisible: false,
      options: [ {
        id: 'fruits',
        label: 'Fruits',
        children: [ {
          id: 'apple',
          label: 'Apple 🍎',
          isNew: true
        }, {
          id: 'grapes',
          label: 'Grapes 🍇'
        }, {
          id: 'pear',
          label: 'Pear 🍐'
        }, {
          id: 'strawberry',
          label: 'Strawberry 🍓'
        }, {
          id: 'watermelon',
          label: 'Watermelon 🍉'
        } ]
      }, {
        id: 'vegetables',
        label: 'Vegetables',
        children: [ {
          id: 'corn',
          label: 'Corn 🌽'
        }, {
          id: 'carrot',
          label: 'Carrot 🥕'
        }, {
          id: 'eggplant',
          label: 'Eggplant 🍆'
        }, {
          id: 'tomato',
          label: 'Tomato 🍅'
        } ]
      } ],
      valueArray: [
        // {
        //     id: '100',
        //     title: '卢柏言'
        // },
        // {
        //     id: '97',
        //     title: '冯博'
        // },
        // {
        //     id: '98',
        //     title: '弘毅'
        // },
        // {
        //     id: '103',
        //     title: '兰青'
        // }
      ],
      sortValueBy: 'ORDER_SELECTED',
      dialogStyle: {
        height: '500px'
      },
      tagList: []
    }
  },
  props: {
    showStatus: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectRows: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    selectRows () {
      // console.log(this.selectRows, 'this.selectRows')
      this.valueArray = deepClonev2(this.selectRows)
    },
    showStatus () {
      // console.log('监听showStatus', this.showStatus)
      if (this.showStatus) {
        this.options = deepClonev2(this.list).map(org => this.initMethod(org))
        // this.initPositionList(deepClonev2(this.list))
      }
      this.chooseTreeVisible = this.showStatus
    }
  },
  mounted () {

  },
  methods: {
    searchMethod (e) {
      console.log(e, 'eee')
    },
    // 选中
    selectMethod (info) {
      console.log(info, '选中info')
      // this.options = deepClonev2(this.list).map(org => this.initMethod(org))
    },
    // 未选中
    unSelectMethod (info) {
      console.log(info, '未选中info')
    },
    deletePerson (info) {
      const tempTagList = deepClonev2(this.valueArray)
      const tempIndex = tempTagList.findIndex(item => item.id === info.id)
      if (tempIndex !== -1) {
        // 点击的对象在已选择数组中,需要移除
        this.valueArray.splice(tempIndex, 1)
      }
    },
    // 弹框取消
    cancelModal () {
      this.chooseTreeVisible = false
      this.$emit('update:showStatus', false)
    },
    // 弹框点击确定
    sureModal () {
      const tempArray = deepClonev2(this.valueArray).map(item => item.id)
      // this.$emit('getVal', tempArray)
      this.$emit('output', tempArray)
      this.chooseTreeVisible = false
      this.$emit('update:showStatus', false)
    },
    // 清除已选中
    clearSelect () {
      this.valueArray = []
    },
    // 初始化数据
    initMethod (org) {
      // console.log('将空的children移除')
      const haveChildren = Array.isArray(org.children) && org.children.length > 0
      if (haveChildren) {
        // let tempInfo = Object.assign({}, org)
        // tempInfo.title = org.title
        // tempInfo.id = org.id
        // this.positionList.push(tempInfo)
        return {
          ...org,
          label: org.title,
          isLeaf: org.isLeaf !== '0',
          children: haveChildren ? org.children.map(i => this.initMethod(i)) : []
        }
      } else {
        delete org.children
        // let currentInfo = Object.assign({}, org)
        // // this.personList.push(org)
        // let tempArray = deepClonev2(this.positionList)
        // let tempPositionIndex = tempArray.findIndex(item => item.id === org.parentId)
        // currentInfo.parentName = tempArray[tempPositionIndex].title
        // this.personList.push(currentInfo)
        // // let currentChildren = org.children
        // // console.log(currentChildren, 'currentChildren')
        return {
          ...org,
          isLeaf: org.isLeaf !== '0',
          label: org.title
        }
      }
    },
    // 动态加载
    loadOptions ({ actions, parentNode, callback }) {
      console.log('actions:', actions, 'parentNode:', parentNode, 'callback:', callback)
    },
    closeModal () {
      this.chooseTreeVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.modalClass {
    .modalBody {
        display: flex;
        height: 100%;
        .left {
            width: 50%;
            flex-shrink: 0;
            height: 100%;
           .vue-treeselect {
                position: static;
                height: 100%;
           }
          //  .vue-treeselect__control {
          //       display: none;
          //  }
           .vue-treeselect__menu-container {
                position: static;
                height: 100%;
                .vue-treeselect__menu {
                    position: static;
                    height: 100%;
                    .vue-treeselect__list {
                        .vue-treeselect__list-item {
                            .vue-treeselect__option {
                                .vue-treeselect__label-container {
                                    img {
                                        width: 20px;
                                        margin-right: 10px;
                                    }
                                }
                            }
                        }
                    }
                }
           }
           .listWrapper {
            overflow-y: auto;
            height: 100%;
            .listUl {
                margin-top: 10px;
                &:nth-child(1) {
                    margin-top: 0px;
                }
                .ulTitle {
                    padding: 0px 10px;
                    font-size: 14px;
                    color: #a1a1a1;
                }
                .listLi {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 6px 10px;
                    background-color: white;
                    .liLeftDiv {
                        display: flex;
                        align-items: center;
                        div {
                            font-size: 14px;
                            color: #444444;
                            font-weight: bolder;
                        }
                        img {
                            width: 20px;
                            margin-right: 10px;
                        }
                    }
                    .liRightDiv {
                        font-size: 14px;
                        color: #a1a1a1;
                    }
                }
                .selectListLi {
                    background-color: #1890ff;
                    .liLeftDiv {
                        font-size: 14px;
                        color: #DCDCDC;
                        font-weight: bolder;
                    }
                    .liRightDiv {
                        font-size: 14px;
                        color: #DCDCDC;
                    }
                }
            }
           }
        }
        .right {
            flex: 1;
            margin-left: 20px;
            height: 100%;
            overflow-y: auto;
            .rightTitleDiv {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0px 10px;
                .rightTitle {
                    font-size: 14px;
                }
                .rightButton {
                    font-size: 15px;
                    color: #1890ff;
                }
                .rightButton:hover {
                    cursor: pointer;
                }
            }
            .tagDivWrapper {
                overflow-y: auto;
                .singleTagDiv {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 5px 10px;
                    .singleTagContent {
                        display: flex;
                        align-items: center;
                        img {
                            width: 20px;
                            margin-right: 10px;
                        }
                        .singleTagText {
                            font-size: 14px;
                            font-weight: bolder;
                        }
                    }
                    .deleteIconDiv {
                        font-size: 16px;
                        font-weight: bolder;
                    }
                    .deleteIconDiv:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
