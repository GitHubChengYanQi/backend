<template>
  <div
    class="labelSelect_box"
    @mousewheel="mousewheel"
    v-if="visible">
    <div
      class="label_content"
      @mousewheel="previewMouse">
      <div class="label_header">
        <span class="label_title">选择标签</span>
        <span
          class="close"
          @click="close">+</span>
      </div>
      <a-input-search
        v-model="search"
        placeholder="请输入标签"
        @search="onSearch"
        style="height:36px;"></a-input-search>
      <div
        class="label_date_box"
        @mousewheel="previewMouse">
        <div
          class="data_content"
          v-for="(item,index) in labelDate"
          :key="index">
          <div class="data_title">{{ item.groupName }}</div>
          <div class="data_main_box">
            <div
              class="data_add_box"
              v-if="addState"
              @click="setInput(index)">
              <a-icon type="plus" />&nbsp;添加
            </div>
            <span
              class="data_input_box"
              v-if="isInput == index">
              <a-input
                v-model="addRule"
                placeholder="输入后回车"
                @blur="setInput(-1)"
                @keyup.enter.native="searchAllCompany(index)" />
            </span>
            <span
              class="data_main"
              @click="setArr(items.id,index)"
              :style="{borderColor: idArr.includes(items.id) ? '#1890ff':'',pointerEvents:excludeId.includes(items.id) ? 'none':'',color:excludeId.includes(items.id) ? '#ccc':''}"
              v-for="(items,indexs) in item.tags"
              :key="indexs">{{ items.name }}</span>
          </div>
        </div>
      </div>
      <div class="label_btn">
        <span
          class="add_ruleGroup"
          @click="setModal(-1)"
          v-if="addState">
          <a-icon type="plus" />&nbsp;新建标签组
        </span>
        <a-button @click="close">取消</a-button>
        <a-button
          type="primary"
          style="margin-left:10px;"
          @click="getDate">确定</a-button>
      </div>
    </div>
    <a-modal
      :visible="isModal"
      title="新建标签组"
      ok-text="确认"
      cancel-text="取消"
      @ok="addGroup()"
      @cancel="setModal(-1)">
      <div class="add_tigs">
        <a-icon type="exclamation-circle" />
        管理员可根据不同部门选择展示不同的标签组，部门管理员可创建部门可见的标签
      </div>
      <div class="input_box">
        <span
          class="input_title"
          style="width:100px;">
          标签组名称：
        </span>
        <a-input
          style="width:354px;height:36px;"
          v-model="tigs"
          placeholder="请输入标签组名称" />
      </div>
      <div class="input_box">
        <span
          class="input_title"
          style="width:100px;">
          标签名：
        </span>
        <a-input
          style="width:354px;height:36px"
          v-model="ruleName"
          placeholder="请输入标签组名称" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getContactTagGroup, addContactTagGroup, addContactTag } from '@/api/workContactTag'
export default {
  props: {
    state: {
      type: Boolean,
      default: false
    },
    addState: {
      type: Boolean,
      default: false
    },
    excludeId: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      visible: false,
      labelDate: [],
      search: '',
      idArr: [],
      inputArr: [],
      addRule: '',
      isInput: -1,
      isModal: false,
      tigs: '',
      ruleName: ''
    }
  },
  created () {
    this.getLabelData()
  },
  watch: {
    state: {
      handler (val, oldval) {
        this.visible = val
        this.getLabelData()
      },
      deep: true
    }
  },
  methods: {
    getLabelData (e) {
      if (e == -1) {
        getContactTagGroup().then((res) => {
          const newData = res.data.tagGroupList
          console.log(newData)
          this.labelDate = newData.map((item) => {
            item.tags = item.tags.filter((items) => {
              return items.name.indexOf(this.search) != -1
            })
            return item
          })
          this.labelDate = this.labelDate.filter(item => {
            return item.tags.length > 0 || item.groupName.indexOf(this.search) != -1
          })
        })
      } else {
        getContactTagGroup().then((res) => {
          this.labelDate = res.data.tagGroupList
        })
      }
    },
    addGroup () {
      const data = {
        groupName: this.tigs,
        groupOrder: this.labelDate.length + 1,
        tags: [
          {
            name: this.ruleName,
            order: 1
          }
        ]
      }
      addContactTagGroup(data).then((res) => {
        this.getLabelData()
        this.tigs = ''
        this.ruleName = ''
        this.setModal(-1)
      })
    },
    close () {
      this.inputArr = []
      this.idArr = []
      this.isInput = -1
      this.search = ''
      // this.$emit('close', -1)
      this.visible = false
    },
    searchAllCompany (e) {
      const data = {
        groupId: this.labelDate[e].groupId,
        tag: {
          name: this.addRule
        }
      }
      console.log(data)
      addContactTag(data).then((res) => {
        this.search = ''
        this.getLabelData()
      })
      this.addRule = ''
      this.isInput = -1
    },
    setInput (e) {
      this.addRule = ''
      this.isInput = e
    },
    setModal (e) {
      if (e == -1) {
        this.isModal = !this.isModal
        this.tigs = ''
        this.ruleName = ''
      } else {
        this.setModal(-1)
      }
    },
    onSearch () {
      this.getLabelData(-1)
    },
    mousewheel (e) {
      e.preventDefault()
    },
    setArr (e, i) {
      if (this.idArr.includes(e)) {
        this.idArr = this.idArr.filter((item) => {
          if (item != e) return item
        })
        this.inputArr = this.inputArr.filter((item) => {
          if (item.id !== e) return item
        })
      } else {
        const arr = this.labelDate[i].tags.filter((item) => {
          if (item.id === e) return item
        })
        this.inputArr = [...this.inputArr, ...arr]
        this.idArr = [...this.idArr, e]
      }
    },
    previewMouse (e) {
      e.stopPropagation()
    },
    getDate () {
      this.$emit('input', this.inputArr)
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
.labelSelect_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 10;
  .label_content {
    width: 520px;
    max-height: 90vh;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 0 24px 24px;
    background-color: #fff;
    .label_header {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .label_title {
        color: #000;
        text-align: center;
        font-size: 17px;
        font-weight: 600;
      }
      .close {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        font-size: 40px;
        transform: rotate(45deg);
        color: #ccc;

        &:hover {
          color: #000;
        }
      }
    }
    .label_date_box {
      box-sizing: border-box;
      padding: 24px;
      width: 100%;
      height: 636px;
      max-height: 60vh;
      overflow-x: auto;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        width: 6px;
        background-color: rgba(204, 204, 204, 0.1);
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(204, 204, 204, 0.5);
        background-clip: padding-box;
        min-height: 28px;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(204, 204, 204, 1);
      }

      .data_content {
        margin-top: 10px;
        .data_title {
          font-size: 13px;
          color: #999;
          white-space: nowrap;
        }

        .data_main_box {
          width: 100%;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .data_add_box {
            display: flex;
            align-items: center;
            margin-top: 10px;
            margin-right: 10px;
            border: 1px solid #d9d9d9;
            height: 28px;
            line-height: 28px;
            text-align: center;
            margin-right: 10px;
            font-size: 13px;
            padding: 0 5px;
            cursor: pointer;

            .svg_add {
              font-size: 20px;
            }
          }

          .data_input_box {
            margin-top: 10px;
            margin-right: 10px;
          }

          .data_main {
            margin-top: 10px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f7f7f7;
            height: 28px;
            line-height: 15px;
            padding: 5px 14px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            border: 1px solid #e9e9e9;
          }
        }
      }
    }
    .label_btn {
      margin-top: 10px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .add_ruleGroup {
        margin-right: auto;
        font-size: 13px;
        color: #1890ff;
        cursor: pointer;
        .svg_add {
          font-size: 16px;
        }
      }
      .cancel {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 32px;
        background: inherit;
        background-color: rgba(0, 82, 217, 1);
        border: none;
        border-radius: 3px;
        color: #fff;
      }

      .confirm {
        margin-left: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0052d9;
        width: 60px;
        height: 32px;
        background: inherit;
        background-color: rgba(255, 255, 255, 1);
        box-sizing: border-box;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(0, 82, 217, 1);
        border-radius: 3px;
      }
    }
  }
}
::v-deep(.add_tigs) {
  background: #effaff;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 18px;
  padding: 8px 12px;
  margin-bottom: 24px;
  .svg_smal {
    color: #1890ff;
  }
}

::v-deep(.input_box) {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>
