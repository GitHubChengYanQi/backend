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
          <a-input placeholder="请输入部门/人员姓名" allow-clear class="inputClass" v-model="inputName"></a-input>
          <treeselect
            v-if="choosePersonStatus === 'tree'"
            :searchable="false"
            :noChildrenText="''"
            :valueFormat="`object`"
            :value-consists-of="'BRANCH_PRIORITY'"
            :allowSelectingDisabledDescendants="false"
            :maxHeight="1000"
            :alwaysOpen="true"
            :multiple="true"
            :options="options"
            :load-options="loadOptions"
            :matchKeys="['title']"
            :clearable="false"
            :flat="true"
            :limit="0"
            :limitText="() => ''"
            :sort-value-by="sortValueBy"
            :default-expand-level="1"
            placeholder="Try selecting some options."
            :value="valueArray"
            @select="selectMethod"
            @deselect="unSelectMethod"
            @open="openTree"
          >
            <div slot="option-label" slot-scope="{ node }" >
              <img src="@/assets/person.png" v-if="node.raw.isLeaf === '1'">
              <img src="@/assets/bolder.png" v-if="node.raw.isLeaf === '0'">
              {{ node.raw.title }}
            </div>
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.title }}</div>
          </treeselect>
          <div class="listWrapper" v-if="choosePersonStatus === 'list'">
            <div class="listUl">
              <div class="ulTitle">人员</div>
              <div :class="['listLi', judgeSelectStatus(item) !== -1 ? 'selectListLi' : '']" v-for="item in personList" :key="item.id" @click="choosePerson(item, 'person')">
                <div class="liLeftDiv">
                  <img src="@/assets/person.png">
                  <div>{{ item.title }}</div>
                </div>
                <div class="liRightDiv">{{ item.parentName }}</div>
              </div>
            </div>
            <div class="listUl">
              <div class="ulTitle">部门</div>
              <div :class="['listLi', judgeSelectStatus(item) !== -1 ? 'selectListLi' : '']" v-for="item in positionList" :key="item.id" @click="choosePerson(item, 'position')">
                <div class="liLeftDiv">
                  <img src="@/assets/bolder.png">
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="rightTitleDiv">
            <div class="rightTitle">已选择的部门或成员</div>
            <div class="rightButton" @click="clearSelect">清除</div>
          </div>
          <div class="tagDivWrapper">
            <div class="singleTagDiv" v-for="item in valueArray" :key="item.id">
              <div class="singleTagContent">
                <img src="@/assets/person.png" v-if="item.isLeaf === '1'">
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
import { deepClonev2 } from '@/utils/util'
export default {
  name: 'BackendtestChooseTree',
  components: { Treeselect },
  data () {
    return {
      personList: [
        // {
        //     id: 0,
        //     personName: '员工1',
        //     positionName: '部门1'
        // },
        // {
        //     id: 1,
        //     personName: '员工2',
        //     positionName: '部门2'
        // },
        // {
        //     id: 2,
        //     personName: '员工3',
        //     positionName: '部门3'
        // }
      ],
      // 部门列表数组
      positionList: [
        // {
        //     id: 10,
        //     personName: '部门8'
        // },
        // {
        //     id: 11,
        //     personName: '部门9'
        // },
        // {
        //     id: 12,
        //     personName: '部门10'
        // }
      ],
      // 选择人员模式,默认为tree
      choosePersonStatus: 'tree',
      inputName: '',
      initOptions: [],
      checkedKeys: [],
      expandedKeys: [],
      changeOptionList: [],
      chooseTreeVisible: false,
      autoExpandParent: false,
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
      options: [],
      dialogStyle: {
        height: '500px'
      },
      tagList: [
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
      ]
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
      console.log(this.selectRows, 'this.selectRows')
      this.valueArray = deepClonev2(this.selectRows)
    },
    // 监听输入框输入
    inputName () {
      console.log(this.inputName, '监听输入框输入')
      if (this.inputName) {
        // 输入框中有内容
        console.log(this.personList, this.positionList)
        this.choosePersonStatus = 'list'
        this.personList = []
        this.positionList = []
        this.initPositionList(deepClonev2(this.list))
        const tempPositionList = deepClonev2(this.positionList)
        this.positionList = tempPositionList.filter(item => item.title.indexOf(this.inputName) !== -1)
        const tempPersonList = deepClonev2(this.personList)
        this.personList = tempPersonList.filter(item => item.title.indexOf(this.inputName) > -1)
      } else {
        // 输入框中无内容
        this.choosePersonStatus = 'tree'
        this.personList = []
        this.positionList = []
        this.initPositionList(deepClonev2(this.list))
      }
    },
    showStatus () {
      console.log('监听showStatus', this.showStatus)
      if (this.showStatus) {
        this.inputName = ''
        this.personList = []
        this.positionList = []
        this.options = deepClonev2(this.list).map(org => this.initMethod(org))
        this.initPositionList(deepClonev2(this.list))
      }
      this.chooseTreeVisible = this.showStatus
    }
    // valueArray: {
    //     immediate: true,
    //     handler() {
    //         console.log(this.valueArray, 'valueArray')
    //         this.tagList = Object.assign([], this.valueArray)
    //     }
    // }
  },
  mounted () {

  },

  methods: {
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
    // 选择人员/部门
    choosePerson (info) {
      const tempTagList = deepClonev2(this.valueArray)
      const tempIndex = tempTagList.findIndex(item => item.id === info.id)
      if (tempIndex !== -1) {
        // 点击的对象在已选择数组中,需要移除
        this.valueArray.splice(tempIndex, 1)
      } else {
        // 点击的对象不在已选择数组中,需要添加
        this.valueArray.push(info)
      }
    },
    // 清除已选中
    clearSelect () {
      this.valueArray = []
    },
    // 判断当前对象是否在已选数组中
    judgeSelectStatus (info) {
      const tempTagList = deepClonev2(this.valueArray)
      const tempIndex = tempTagList.findIndex(item => item.id === info.id)
      console.log(tempIndex, 'tempIndex')
      return tempIndex
    },
    initPositionList (array) {
      for (const item of array) {
        if (item.isLeaf === '0') {
          this.positionList.push(item)
          if (item.children && item.children.length > 0) {
            this.initPositionList(item.children)
          }
        } else if (item.isLeaf === '1') {
          const tempInfo = Object.assign({}, item)
          const tempIndex = this.positionList.findIndex(org => org.id === item.parentId)
          tempInfo.parentName = this.positionList[tempIndex].title
          this.personList.push(tempInfo)
        }
        // if (item.children && item.children.length > 0) {
        //     // 有子集
        //     this.positionList.push(item)
        //     this.initPositionList(item.children)
        // } else {
        //     // 无子集
        //     if (item.isLeaf === '0') {
        //         this.positionList.push(item)
        //     }
        // }
      }
    },
    // 初始化数据
    initMethod (org) {
      const haveChildren = Array.isArray(org.children) && org.children.length > 0
      if (haveChildren) {
        // let tempInfo = Object.assign({}, org)
        // tempInfo.title = org.title
        // tempInfo.id = org.id
        // this.positionList.push(tempInfo)
        return {
          ...org,
          // isLeaf: org.isLeaf === '0' ? true : false,
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
          ...org
          // isLeaf: org.isLeaf === '0' ? true : false,
        }
      }
    },
    formArr (val) {
      // let newArray = []
      for (let i = 0; i < val.length; i++) {
        // debugger
        if ((Array.isArray(val[i].children)) && (val[i].children.length !== 0)) {
          this.changeOptionList.concat(this.formArr(val[i].children))
        } else {
          this.changeOptionList.push(val[i])
        }
      }
      return this.changeOptionList
    },
    // 动态加载
    loadOptions ({ actions, parentNode, callback }) {
      console.log('actions:', actions, 'parentNode:', parentNode, 'callback:', callback)
    },
    // 选中树节点
    selectMethod (info, id) {
      console.log(info, '选中的点', id)
      this.choosePerson(info)
      // this.tagList.push(info)
      // console.log(this.valueArray, 'value')
    },
    // 取消树节点
    unSelectMethod (info, id) {
      console.log(info, '取消选中的点', id)
      this.choosePerson(info)
    },
    // 展开树节点
    openTree (info) {
      console.log(info, '打开树节点')
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
            .inputClass {
                margin-bottom: 10px;
            }
           .vue-treeselect {
                position: static;
                height: 100%;
           }
           .vue-treeselect__control {
                display: none;
           }
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
