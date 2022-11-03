<template>
  <div id="addSop_Page_Container" ref="addSop_Page_Container">
    新增群SOP
    <!-- 群发助手新增 -->
    <div class="chooseUsersContainer">
      <div class="disabledBox" v-if="isControlerDisabled" @click="$message.warn('执行后不可修改！')"></div>
      <div class="line">
        <span class="label">
          <span style="color: red">*</span>
          SOP名称
        </span>
        <div class="input">
          <a-input v-model="SOPName" placeholder="请输入SOP名称" />
          <span class="len">{{ SOPName.length || '0' }}/18</span>
        </div>
      </div>
      <div class="line">
        <span class="label">
          <span style="color: red">*</span>选择执行群
        </span>
        <div class="selectUserBox">
          <a-radio-group v-model="chooseGroupType" @change="chooseGroupsList = []">
            <a-radio :value="1">选择群主</a-radio>
            <a-radio :value="2">选择客户群</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="line multiple">
        <span class="label"></span>
        <div class="selectBox">
          <div class="selectBtn" @click="() => { chooseGroupTransferModalShow = true }">
            <span
              class="emptyBtn"
              v-if="!chooseGroupsList.length"
            >+ 选择{{ chooseGroupType === 1 ? '群主' : '客户群' }}</span>
            <span class="label_input_title" v-for="(item,index) in chooseGroupsList" :key="index">
              {{ chooseGroupType === 1 ? item.ownerName : item.name }}
              <span
                class="delete"
                @click.stop="delTagHandle(item.id, -3, index)"
              >+</span>
            </span>
          </div>
          <div class="selectList" v-if="chooseGroupType === 1">
            预计送达客户群数：{{ sopExpectNum }}个
            <span class="reload" @click="reloadExpectNum()">刷新</span>
          </div>
        </div>
      </div>
      <div class="line">
        <span class="label">说明</span>
        <div class="input">
          <a-input
            :disabled="isControlerDisabled"
            v-model="chooseGroupExplan"
            placeholder="只会推送给执行者，不会发送到客户群"
          />
          <span class="len">{{ chooseGroupExplan.length || '0' }}/50</span>
        </div>
      </div>
      <div class="execution" @click="sendSop()">开始执行</div>
    </div>
    <div class="sendSOPInfoContainer">
      <div class="sendSOPList">
        <div class="addSop" @click="addSop">+ 添加</div>
        <div
          :class="selectSopItemIdx === index ? 'sopItem active' : 'sopItem'"
          v-for="(item, index) in sopList"
          :key="index"
          @click="chooseSopItem(index)"
        >
          <!-- {{ generateDateTitle(item) }} -->
          <span
            v-if="sopList.length !== 1"
            class="del"
            @click.stop="delSopItem(index, item.id)"
          >×</span>
        </div>
      </div>
      <!-- v-if="sopList.length" -->
      <div class="sendItemContent" v-if="sopList.length">
        <div class="chooseSendDate">
          <div class="til">
            <span style="color: red;font-weight: 500;">*</span>发送时间
          </div>
          <div class="pickerBox" style="display: inline-block;position:relative">
            <div
              class="disabledBox"
              v-if="!sopList[selectSopItemIdx].isEdit && isControlerDisabled"
              @click="$message.warn('执行后不可修改！')"
            ></div>
            <a-date-picker
              dropdownClassName="addSop_Page_Container_selectSopItemDateBox"
              :allowClear="false"
              :showToday="false"
              v-if="['0', '1', '5'].includes($route.query.type)"
              v-model="sopList[selectSopItemIdx].date"
              :disabled-date="e => disabledBeforeDate(e, 'date')"
              :disabled-time="e => disabledBeforeDate(e, 'time')"
              valueFormat="YYYY-MM-DD HH:mm"
              format="YYYY-MM-DD HH:mm"
              show-time
              :getPopupContainer="() => $refs['addSop_Page_Container']"
              @change="sendDateChange"
            />
          </div>
        </div>
        <div class="sendContent">
          <div class="tilBar">
            <span class="til">
              <span style="color: red;font-weight: 500;">*</span>发送内容
            </span>
            <div class="handleBox">
              <div
                v-for="(item, index) in handleBtnArr"
                :key="index"
                :class="(
                  (item.type === 'text' && sopList[selectSopItemIdx].content.some(it => it.type === 'text')) ||
                  sopList[selectSopItemIdx].content.length === 10) ?
                  'handleBtn disabled' :
                  'handleBtn'"
                @click="chooseSendType(item.type)"
              >+ {{ item.name }}</div>
              <div
                class="disabledBox"
                v-if="!sopList[selectSopItemIdx].isEdit && isControlerDisabled"
                @click="$message.warn('执行后不可修改！')"
              ></div>
            </div>
          </div>
          <div class="contentBox">
            <div
              class="contentItem"
              v-for="(item, index) in sopList[selectSopItemIdx].content"
              :key="index"
            >
              <div class="idx">{{ index + 1 }}</div>
              <div :class="`content ${item.type}`" v-if="item.type === 'text'">{{ item.content }}</div>
              <div :class="`content ${item.type}`" v-else-if="item.type === 'image'">
                <img :src="item.content.imgUrl" alt />
              </div>
              <div :class="`content ${item.type}`" v-else-if="item.type === 'video'">
                <div
                  class="poster"
                  v-if="sopList[selectSopItemIdx].content[index].showPoster"
                >{{ item.content.mediaName }}</div>
                <video :src="item.content.videoUrl" @error="videoLoadErr(index)" alt />
              </div>
              <div :class="`content ${item.type}`" v-else-if="item.type === 'link'">
                <div class="lef">
                  <span class="til">{{ item.content.title }}</span>
                  <span class="desc">{{ item.content.desc }}</span>
                </div>
                <img :src="item.content.pic" alt class="image" />
              </div>
              <div :class="`content ${item.type}`" v-else-if="item.type === 'embed'">
                <div class="line">
                  <img src="../images/miniProgramIcon.svg" alt class="icon" />
                  <span class="til">{{ '小程序标题' }}</span>
                </div>
                <div class="line desc">{{ item.content.desc }}</div>
                <img :src="item.content.pic" alt class="image" />
                <div class="line">
                  <img src="../images/miniProgramIcon.svg" alt class="icon" />
                  <span class="say">小程序</span>
                </div>
              </div>
              <div class="handlesBox" v-if="sopList[selectSopItemIdx].isEdit">
                <img
                  src="../images/move.svg"
                  alt
                  :class="index === 0 ? 'icon move disabled' : 'icon move'"
                  @click="handleMoveClick(index, 'up')"
                />
                <img
                  src="../images/move.svg"
                  style="transform: rotate(180deg)"
                  alt
                  :class="(sopList[selectSopItemIdx].content.length - 1) === index ? 'icon move disabled' : 'icon move'"
                  @click="handleMoveClick(index, 'down')"
                />
                <img
                  src="../images/edit.svg"
                  alt
                  class="icon"
                  @click="handleEditClick(item.type, item.content, index)"
                />
                <img src="../images/del.svg" alt class="icon" @click="handleDelClick(index)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//  import { departmentEmp } from '@/api/common.js'
import Department from '@/components/department'
import LabelSelect from '../../..//clientFollow/components/LabelSelect.vue'
import ChooseGroupTransferModal from './ChooseGroupTransferModal.vue'
import { deepClonev2 } from '@/utils/util'
//  delSopTaskItemReq, getExpectNumReq, getUserSopReq, userSopSettingReq,
import { userSopTaskItemSettingReq } from '@/api/salesManagement'
//  import { getDict, upLoad } from '@/api/common'
//  handleBtnArr, defaultLinkObj, defaultMiniObj, include1TypeSelectOptions, include2TypeSelectOptions, defaultLibraryObj, getNowDate, isUrl, disabledBeforeDate, generaType,generateDateTitle, returnPageTitle, transformTargetData, transformLibraryData
import { transformTaskItemEntry, transformTaskDate } from '../sopUtils'
export default {
  name: 'RegularAdd',
  components: {
    Department,
    ChooseGroupTransferModal,
    'label-select': LabelSelect,
    'MediumGroup': () => import('@/views/mediumGroup/index.vue')
  },
  data () {
    return {
      isControlerDisabled: false,
      SOPName: '',
      chooseGroupType: 1,
      chooseGroupTransferModalShow: false,
      chooseGroupsList: [],
      chooseGroupExplan: '',
      selectSopItemIdx: 0,
      sopList: [],
      sopExpectNum: 0
    }
  },

  mounted () {

  },

  methods: {
    // 成员选择
    employeeIdsChange (e) {
      this.employeeIds = e
    },
    showBox (e) {
      console.log(e, 'eee')
    },
    delTagHandle () {},
    reloadExpectNum () {},
    sendSop () {},
    addSop () {},
    // 任务列表
    chooseSopItem (index) {
      if (this.selectSopItemIdx === index) return
      this.selectSopItemIdx = index
    },
    videoLoadErr () {},
    // 移动某一个item
    async handleMoveClick (index, type) {
      if (type === 'up' && index === 0) {
        return
      } else if (type === 'down' && index === (this.sopList[this.selectSopItemIdx].content.length - 1)) {
        return
      }
      const nowD = deepClonev2(this.sopList)
      const nowItems = nowD[this.selectSopItemIdx].content
      const delItem = nowItems.splice(index, 1)[0]
      if (type === 'up') {
        nowItems.splice(index - 1, 0, delItem)
      } else {
        nowItems.splice(index + 1, 0, delItem)
      }
      nowD[this.selectSopItemIdx].content = nowItems
      await this.generateUpdateTaskItemObj(nowD[this.selectSopItemIdx])
      this.sopList = nowD
    },
    // 编辑单个item
    handleEditClick (type, value, index) {
      this.isEditingItem = true
      this.editIdx = index
      if (type === 'text') {
        this.contentText = value
      } else if (type === 'link') {
        this.contentLinkObj = { ...value }
      } else if (type === 'embed') {
        this.contentMiniObj = { ...value }
      }
      this.chooseSendType(type, true)
    },
    // 删除某一个item
    handleDelClick (index) {
      const that = this
      const nowD = deepClonev2(this.sopList)
      this.$confirm({
        title: '确定删除所选内容?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          nowD[that.selectSopItemIdx].content.splice(index, 1)
          await this.generateUpdateTaskItemObj(nowD[that.selectSopItemIdx])
          this.$message.success('删除成功')
          that.sopList = nowD
        }
      })
    },
    // 生成单个任务的参数
    async generateUpdateTaskItemObj (item) {
      const taskId = this.sopId
      const occur = transformTaskDate(this.$route.query.type, item, 'to')
      let entry = []
      if (item.id) {
        // 编辑
        entry = transformTaskItemEntry(item.content, 'to')
      }
      const res = await userSopTaskItemSettingReq({
        id: item.id,
        taskId,
        occur,
        entry
      })
      this.sopIsEdit = true
      if (!item.id) {
        return res.data.id
      }
    }
  }
}
</script>
  <style lang='less' scroped>
  #addSop_Page_Container {
    .selectPersonnelCom {
      width: 90%;
      .ant-btn {
        width: 180px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
        border: 1px dashed #8a8a8a;
        background: none;
        color: rgba(0, 0, 0, 0.6);
        text-shadow: none;
      }
    }
    .chooseSendDate {
      .ant-calendar-picker {
        .ant-input {
          height: 30px;
        }
      }
    }
    .contentTextModal {
      .ant-modal-body {
        padding-top: 0;
        .ant-input {
          min-height: 100px;
        }
      }
    }
    .contentLinkModal {
      .ant-modal-body {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
        .tip {
          margin: 0;
          .click {
            color: #4074f6;
            cursor: pointer;
          }
        }
        .top {
          position: absolute;
          top: 0;
        }
        .formBox {
          width: 65%;
          .line {
            position: relative;
            margin-bottom: 10px;
            .ant-input {
              height: 35px;
              padding-right: 60px;
            }
            .len {
              position: absolute;
              right: 5px;
              top: 8px;
            }
          }
          .textarea {
            .ant-input {
              min-height: 100px;
            }
            .len {
              bottom: 0;
              transform: translate(0, 100%);
            }
          }
        }
        .pic {
          flex: 1;
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .image {
            width: 170px;
            height: 170px;
            border-radius: 5px;
            overflow: hidden;
            cursor: pointer;
          }
          .addPic {
            border: 1px dashed #d1d1d1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 50px;
            font-weight: 100;
            color: #878787;
          }
          .photoTip {
            margin-top: 5px;
          }
          .file {
            position: fixed;
            left: 100000px;
            top: 100000px;
            opacity: 0;
            width: 1px;
            height: 1px;
          }
        }
      }
    }
  }
  .addSop_Page_Container_selectSopItemDateBox {
    .ant-calendar-time-picker-combobox {
      .ant-calendar-time-picker-select {
        width: 50%;
      }
      .ant-calendar-time-picker-select:last-child {
        display: none;
      }
    }
  }
  </style>
  <style lang='less' scoped>
  @import '../addSop.less';
  </style>
