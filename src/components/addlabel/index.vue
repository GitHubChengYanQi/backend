<template>
  <div class="tagsModal">
    <a-modal v-model="modalShow" title="选择标签" @ok="handleOk" class="modelCard" :maskClosable="false">
      <div style="min-height: 300px; max-height: 600px; overflow: auto">
        <div class="labelRow" v-for="(item, index) in labelArr" :key="index">
          <div class="labelTitle">{{ item.groupName }}</div>
          <div class="labelContent">
            <div class="labeladdBtn" @click="showInput = item.id">
              <a-icon type="plus" />
              添加
            </div>
            <a-input
              class="lable_input"
              v-model="addlableCont"
              placeholder="输入后回车"
              v-if="showInput == item.id"
              @blur="closeInput"
              @pressEnter="inputLable(item.id, index)"
            ></a-input>
            <div
              class="labelSub"
              v-for="(obj, idx) in item.tags"
              :key="idx"
              :class="[choiceTagsArr.indexOf(JSON.stringify(obj)) != -1 ? 'labelSelect' : '']"
              @click="selectTags(obj)"
            >
              {{ obj.name }}
            </div>
          </div>
        </div>
        <span class="add_tags" @click="$refs.add.$show()">
          <a-icon type="plus" />
          新建标签组
        </span>
      </div>
    </a-modal>
    <!-- <a-modal v-model="addNewTags" title="新建标签组" @ok="handleNewTags"> -->
    <add ref="add" @change="getData" />
    <div class="add_tigs">
      <a-icon type="bell" theme="filled" />
      管理员可根据不同部门选择展示不同的标签组，部门管理员可创建部门可见的标签
    </div>
    <!-- <a-form-model :model="tagsform" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="标签组名称">
          <a-input v-model="tagsform.name" placeholder="请输入标签组名称"></a-input>
        </a-form-model-item>
      </a-form-model> -->
    <!-- </a-modal> -->
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import add from './addTagGroup'
import { setclientTags, clientTagsReceive, newTagGroup } from '@/api/roomClockIn'

export default {
  components: { add },
  data () {
    return {
      // 弹窗1
      modalShow: false,
      // 弹窗2
      addNewTags: false,
      // 控制输入框显示
      showInput: 0,
      addlableCont: '',
      labelArr: [],
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      // 新建标签表单
      tagsform: {
        name: '',
        resource: 1,
        // 选中的部门
        selectSection: []
      },
      list: [],
      tipsWarn: true,
      choiceTagsArr: []
    }
  },
  methods: {
    // 显示
    show (data) {
      this.choiceTagsArr = []
      if (data) {
        this.choiceTagsArr = data.map((item, index) => {
          const tagData = {
            id: item.id,
            wxContactTagId: item.wxContactTagId,
            name: item.name,
            contactTagGroupId: item.contactTagGroupId
          }
          return JSON.stringify(tagData)
        })
      }
      this.modalShow = true
      this.getClientTags()
    },
    // 获取后台设置的客户标签
    getClientTags () {
      clientTagsReceive({
        page: 1,
        perPage: 100
      }).then((res) => {
        this.labelArr = []
        this.labelArr = res.data.map((item, index) => {
          const tagCont = {
            id: item.id,
            wxGroupId: item.wxGroupId,
            groupName: item.groupName,
            tags: []
          }
          tagCont.tags = item.tags.map((obj, idex) => {
            return {
              id: obj.id,
              wxContactTagId: obj.wxContactTagId,
              name: obj.name,
              contactTagGroupId: obj.contactTagGroupId
            }
          })
          return tagCont
        })
      })
    },
    // 选中标签
    selectTags (obj) {
      const labelIndex = this.choiceTagsArr.indexOf(JSON.stringify(obj))
      if (labelIndex == -1) {
        this.choiceTagsArr.push(JSON.stringify(obj))
      } else {
        this.choiceTagsArr.splice(labelIndex, 1)
      }
    },
    // 添加公司
    memberSelectChange (e) {
      this.tagsform.selectSection = e
    },
    // 确定
    handleOk (e) {
      this.modalShow = false
      const selectTags = this.choiceTagsArr.map((item, index) => {
        return JSON.parse(item)
      })
      this.$emit('choiceTagsArr', selectTags)
    },
    // 弹窗2确定
    async handleNewTags () {
      if (this.tagsform.name == '') {
        this.$message.warning('标签组名称不能为空')
        return
      }
      newTagGroup({
        groupName: this.tagsform.name
      }).then((res) => {
        this.getClientTags()
        this.tagsform.name = ''
        this.$message.success('创建成功')
        this.addNewTags = false
      })
    },
    // 关闭输入框
    closeInput () {
      this.showInput = false
    },
    // 添加标签
    async inputLable (id, index) {
      const tags = this.labelArr[index].tags
      var addData = {
        groupId: id,
        tag: { name: this.addlableCont, order: tags.length ? tags.length : 0 }
      }
      // 添加标签
      await setclientTags(addData).then((res) => {
      })
      this.getClientTags()
      this.showInput = false
      this.addlableCont = ''
    },
    //  添加标签组
    getData (e) {
      this.getClientTags()
    }

  }
}
</script>

<style>
.tagsModal .ant-modal-title {
  text-align: center;
}

.modelCard {
  position: relative;
}

.add_tags {
  position: absolute;
  bottom: 15px;
  left: 18px;
  font-size: 13px;
  color: #1890ff;
  cursor: pointer;
}

.labelContent {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.labeladdBtn {
  border: 1px solid #d9d9d9;
  height: 28px;
  line-height: 28px;
  text-align: center;
  margin-right: 10px;
  font-size: 13px;
  padding: 0 5px;
  cursor: pointer;
}

.labeladdBtn i {
  font-size: 14px;
}

.labelSub {
  margin-bottom: 10px;
  padding: 5px 14px;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  font-size: 14px;
  line-height: 18px;
  box-sizing: border-box;
  height: 28px;
  margin-right: 10px;
  cursor: pointer;
  user-select: none;
  background: #f7f7f7;
  margin-left: 10px;
}

.labelSelect {
  color: #1890ff;
  background: #e7f7ff;
  border: 1px solid #1890ff;
}

.labelContent .lable_input {
  height: 28px;
  width: 120px;
}

.add_tigs {
  background: #effaff;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 18px;
  padding: 8px 12px;
  margin-bottom: 24px;
}

.add_tigs i {
  color: #1890ff;
}

.add_name {
  float: left;
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
}

.labelNewRow {
  margin-top: 15px;
  position: relative;
}

.labelNewRow:first-child {
  margin-top: 0px;
}

.labelNewRow i {
  font-size: 16px;
  position: absolute;
  right: -24px;
  top: 13px;
}

.selectClass {
  display: inline-block;
  color: #1890ff;
  border: 1px solid #1890ff;
}

.branchRow {
  display: flex;
  flex-wrap: wrap;
}

.branchElement {
  margin-right: 12px;
  position: relative;
  padding: 0 12px;
  background: #f9f9f9;
  border-radius: 2px;
  margin-top: 15px;
  min-width: 96px;
}

.delElement {
  position: absolute;
  right: -6px;
  top: -7px;
  font-size: 15px;
  cursor: pointer;
}

.branch_img {
  width: 17px;
  height: 17px;
  margin-right: 10px;
}
</style>
