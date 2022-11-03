<template>
  <div id="addSop_Page_Container" ref="addSop_Page_Container">
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
      <div class="line multiple" v-if="$route.query.type !== '5'">
        <span class="label">
          <span style="color: red">*</span>选择执行员工
        </span>
        <selectPersonnel
          v-if="treeData"
          :record="treeData"
          class="selectPersonnelCom"
          type="button"
          name="选择成员"
          v-model="employeeIds"
          @getVal="employeeIdsChange"
        />
      </div>
      <div class="line" v-if="['0', '1', '4'].includes($route.query.type)">
        <span class="label">
          <span style="color: red">*</span>选择执行客户
        </span>
        <div class="selectUserBox">
          <a-radio-group v-model="selectUserType">
            <a-radio :value="1">筛选客户</a-radio>
            <a-radio :value="2">全部客户</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="line multiple" v-if="$route.query.type === '0' && selectUserType === 1">
        <span class="label">包含标签</span>
        <div class="selectBox">
          <span class="selectBtn" @click="showBox(0)">
            <span class="emptyBtn" v-if="selectTagList.length == 0">+ 编辑</span>
            <span class="label_input_title" v-for="(item,index) in selectTagList" :key="index">
              {{ item.name }}
              <span class="delete" @click.stop="delTagHandle(item.id,0, index)">+</span>
            </span>
          </span>
        </div>
      </div>
      <div
        class="line multiple"
        v-if="['1', '4'].includes($route.query.type) && selectUserType === 1"
      >
        <span class="label"></span>
        <div class="selectBox">
          <div class="operationMode" v-if="filterUserObj.list.length > 1">
            <span
              :class="filterUserObj.mode === '1' && 'active'"
              @click="filterUserObj.mode = '1'"
            >且</span>
            <span
              :class="filterUserObj.mode === '2' && 'active'"
              @click="filterUserObj.mode = '2'"
            >或</span>
          </div>
          <div class="filterListBox" v-for="(list, index) in filterUserObj.list" :key="index">
            <a-select
              v-model="filterUserObj.list[index].type"
              style="width: 200px"
              @change="() => {filterUserObj.list[index].include = undefined;filterUserObj.list[index].target = undefined}"
            >
              <a-select-option
                value="1"
              >标签</a-select-option>
              <a-select-option
                value="2"
              >客户阶段</a-select-option>
            </a-select>
            <a-select
              placeholder="请选择"
              v-model="filterUserObj.list[index].include"
              style="width: 120px"
            >
              <a-select-option
                v-for="(item, idx) in list.type === '1' ? include1TypeSelectOptions : include2TypeSelectOptions"
                :key="idx"
                :value="item.value"
              >{{ item.label }}</a-select-option>
            </a-select>
            <div v-show="!['IsNull', 'IsNotNull'].includes(filterUserObj.list[index].include)">
              <div class="selectTags" v-if="list.type === '1'" @click="showBox(index)">
                <span class="emptyBtn" v-if="!(list.target && list.target.length)">选择标签</span>
                <span class="label_input_title" v-for="(item,idx) in list.target" :key="idx">
                  {{ item.name }}
                  <span
                    class="delete"
                    @click.stop="delTagHandle(item.id,index, idx)"
                  >+</span>
                </span>
              </div>
              <a-select
                v-else
                placeholder="请选择"
                v-model="filterUserObj.list[index].target"
                style="width: 300px;min-height: 40px;"
              >
                <a-select-option
                  v-for="(item, idx) in include2TargetSelectOptions"
                  :key="idx"
                  :value="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
            </div>
            <div
              class="handle"
              v-if="index === 0 && filterUserObj.list.length < 10"
              @click="addNewFilterList()"
            >+</div>
            <div class="handle" v-if="index !== 0" @click="delFilterList(index)">-</div>
          </div>
        </div>
      </div>
      <div class="line multiple" v-if="$route.query.type === '2'">
        <span class="label">
          <span style="color: red">*</span>客户条件
        </span>
        <div class="selectBox">
          <div class="filterListBox" v-if="filterUserObj.list[1]">
            <a-select v-model="filterUserObj.list[1].type" style="width: 200px">
              <a-select-option value="2">客户阶段</a-select-option>
            </a-select>
            <a-select
              placeholder="请选择"
              mode="multiple"
              v-model="filterUserObj.list[1].target"
              style="width: 300px;min-height: 40px;"
            >
              <a-select-option
                v-for="(item, idx) in include2TargetSelectOptions"
                :key="idx"
                :value="item.code"
              >{{ item.name }}</a-select-option>
            </a-select>
          </div>
          <div class="filterListBox">
            <span class="selectBtn" @click="showBox(0)">
              <span
                class="emptyBtn"
                v-if="!(filterUserObj.list[0].target && filterUserObj.list[0].target.length)"
              >+ 添加标签</span>
              <span
                class="label_input_title"
                v-for="(item,index) in filterUserObj.list[0].target"
                :key="index"
              >
                {{ item.name }}
                <span class="delete" @click.stop="delTagHandle(item.id,0, index)">+</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="line multiple" v-if="$route.query.type === '2'">
        <span class="label">排除标签</span>
        <div class="selectBox">
          <!-- excludeId -->
          <span class="selectBtn" @click="showBox(-2)">
            <span class="emptyBtn" v-if="!excludeUserObj.excludeList.length">+ 添加标签</span>
            <span
              class="label_input_title"
              v-for="(item,index) in excludeUserObj.excludeList"
              :key="index"
            >
              {{ item.name }}
              <span class="delete" @click.stop="delTagHandle(item.id, -2, index)">+</span>
            </span>
          </span>
        </div>
      </div>
      <div class="line" v-if="['0', '1'].includes($route.query.type)">
        <span class="label"></span>
        <span class="finallyNum">
          预计人数：{{ sopExpectNum }}
          <span class="reload" @click="reloadExpectNum()">刷新</span>
        </span>
      </div>
      <div class="line" v-if="['5'].includes($route.query.type)">
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
      <div class="line multiple" v-if="$route.query.type === '5'">
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
      <div class="line" v-if="$route.query.type === '5'">
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
          {{ generateDateTitle(item, $route.query.type) }}
          <span
            v-if="sopList.length !== 1"
            class="del"
            @click.stop="delSopItem(index, item.id)"
          >×</span>
        </div>
      </div>
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
            <div class="chooseDateBox1" v-else-if="['2', '3'].includes($route.query.type)">
              <p class="tip">当客户条件为所选内容时</p>
              <div class="chooseDateBoxRadio">
                <div class="line-wrapper">
                  <a-radio
                    :checked="+sopList[selectSopItemIdx].dateType === 1"
                    @click="chooseDateRadioClick(1)"
                  />当天
                  <a-input-number
                    v-model="sopList[selectSopItemIdx].dateArr[0][0]"
                    :min="0"
                    :max="23"
                    style="width: 70px;"
                    @blur="dateNumberChange(0)"
                  />小时
                  <a-input-number
                    v-model="sopList[selectSopItemIdx].dateArr[0][1]"
                    :min="sopList[selectSopItemIdx].dateArr[0][0] === 0 ? 3 : 1"
                    :max="59"
                    style="width: 60px;"
                    @blur="dateNumberChange(0)"
                  />分钟后发送
                </div>
                <div class="line-wrapper">
                  <a-radio
                    :checked="+sopList[selectSopItemIdx].dateType === 2"
                    @click="chooseDateRadioClick(2)"
                  />第
                  <a-input-number
                    v-model="sopList[selectSopItemIdx].dateArr[1][0]"
                    :min="1"
                    :max="100"
                    style="width: 70px;"
                    @blur="dateNumberChange(1)"
                  />天
                  <a-time-picker
                    :allowClear="false"
                    v-model="sopList[selectSopItemIdx].dateArr[1][1]"
                    valueFormat="HH:mm"
                    format="HH:mm"
                    :disabled-hours="() => sopList[selectSopItemIdx].dateArr[1][0] === 1 && disabledBeforeDate(null, 'hour')"
                    :disabled-minutes="(e) => sopList[selectSopItemIdx].dateArr[1][0] === 1 &&disabledBeforeDate(e, 'minute')"
                    @change="dateNumberChange(1)"
                  />发送
                  <span class="tip">(注：第一天就是当天，过时不发送）</span>
                </div>
              </div>
            </div>
            <div class="chooseDateBox2" v-else-if="['4'].includes($route.query.type)">
              <a-select
                placeholder="请选择"
                v-model="sopList[selectSopItemIdx].dateType"
                style="width: 150px"
                @change="() => {dateNumberChange(-1, false);resetDateTime()}"
              >
                <a-select-option value="1">生日当天</a-select-option>
                <a-select-option value="2">生日提前</a-select-option>
                <a-select-option value="3">生日过后</a-select-option>
              </a-select>
              <a-input-number
                v-if="sopList[selectSopItemIdx].dateType !== '1'"
                v-model="sopList[selectSopItemIdx].date"
                :min="1"
                :max="100"
                style="width: 70px;height: 35px"
                @blur="dateNumberChange(-1, true)"
              />
              <span v-if="sopList[selectSopItemIdx].dateType !== '1'">天</span>
              <a-time-picker
                :allowClear="false"
                v-model="sopList[selectSopItemIdx].time"
                valueFormat="HH:mm"
                format="HH:mm"
                @change="dateNumberChange(-1, true)"
              />发送
            </div>
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
                  <img src="./images/miniProgramIcon.svg" alt class="icon" />
                  <span class="til">{{ '小程序标题' }}</span>
                </div>
                <div class="line desc">{{ item.content.desc }}</div>
                <img :src="item.content.pic" alt class="image" />
                <div class="line">
                  <img src="./images/miniProgramIcon.svg" alt class="icon" />
                  <span class="say">小程序</span>
                </div>
              </div>
              <div class="handlesBox" v-if="sopList[selectSopItemIdx].isEdit">
                <img
                  src="./images/move.svg"
                  alt
                  :class="index === 0 ? 'icon move disabled' : 'icon move'"
                  @click="handleMoveClick(index, 'up')"
                />
                <img
                  src="./images/move.svg"
                  style="transform: rotate(180deg)"
                  alt
                  :class="(sopList[selectSopItemIdx].content.length - 1) === index ? 'icon move disabled' : 'icon move'"
                  @click="handleMoveClick(index, 'down')"
                />
                <img
                  src="./images/edit.svg"
                  alt
                  class="icon"
                  @click="handleEditClick(item.type, item.content, index)"
                />
                <img src="./images/del.svg" alt class="icon" @click="handleDelClick(index)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input
      type="file"
      accept="image/jpeg, image/png"
      ref="uploadPhoto"
      @change="uploadPhoto"
      class="uploadFileInp"
    />
    <input
      type="file"
      accept="video/*"
      ref="uploadVideo"
      @change="uploadVideo"
      class="uploadFileInp"
    />
    <label-select
      :state="chooseUserTagsModalShow"
      :addState="false"
      :excludeId="filterUserObj.list[0].target ? filterUserObj.list[0].target.map(it => +it.id) : []"
      ref="labelSelect"
    />

    <ChooseGroupTransferModal
      :title="chooseGroupType === 1 ? '选择群主' : '选择客户群'"
      :mode="chooseGroupType === 1 ? 'people' : 'group'"
      :visible="chooseGroupTransferModalShow"
      :list="chooseGroupsList"
      @confirm="confirmChooseGroupTransfer"
      @close="closeChooseGroupTransferModal"
    />
    <a-modal
      title="添加文本"
      :maskClosable="false"
      :width="600"
      :visible="contentTextModalShow"
      class="contentTextModal"
      :getContainer="() => $refs['addSop_Page_Container']"
      @cancel="closeContentModal('contentTextModalShow', 'contentText', '')"
    >
      <a-textarea v-model="contentText" autoSize placeholder="请输入内容" />
      <template slot="footer">
        <a-button @click="closeContentModal('contentTextModalShow', 'contentText', '')">取消</a-button>
        <a-button type="primary" @click="confirmContentText">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="新增链接"
      :maskClosable="false"
      :width="600"
      :visible="contentLinkModalShow"
      class="contentLinkModal"
      :getContainer="() => $refs['addSop_Page_Container']"
      @cancel="closeContentModal('contentLinkModalShow', 'contentLinkObj', {
        title: '',
        url: '',
        desc: '',
        pic: ''
      })"
    >
      <div class="formBox">
        <div class="line">
          <a-input v-model="contentLinkObj.title" placeholder="请输入链接标题（必填）" />
          <span class="len">{{ contentLinkObj.title.length || '0' }}/200</span>
        </div>
        <div class="line">
          <a-input v-model="contentLinkObj.url" placeholder="输入http或https开头的链接地址（必填）" />
          <span class="len">{{ contentLinkObj.url.length || '0' }}/500</span>
        </div>
        <div class="line textarea">
          <a-textarea v-model="contentLinkObj.desc" autoSize placeholder="请输入内容简介（选填）" />
          <span class="len">{{ contentLinkObj.desc.length || '0' }}/170</span>
        </div>
      </div>
      <div class="pic">
        <div
          class="addPic image"
          v-if="!contentLinkObj.pic"
          @click="openSelectPhoto('addLinkPhoto')"
        >+</div>
        <img
          class="image"
          v-else
          :src="contentLinkObj.pic"
          @click="openSelectPhoto('addLinkPhoto')"
        />
        <span class="tip">图片限制在2MB以内</span>
      </div>
      <template slot="footer">
        <a-button
          @click="closeContentModal('contentLinkModalShow', 'contentLinkObj', {
            title: '',
            url: '',
            desc: '',
            pic: ''
          })"
        >取消</a-button>
        <a-button type="primary" @click="confirmContentLink">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="新增小程序"
      :maskClosable="false"
      :width="600"
      :visible="contentMiniModalShow"
      class="contentLinkModal"
      :getContainer="() => $refs['addSop_Page_Container']"
      @cancel="closeContentModal('contentMiniModalShow', 'contentMiniObj',{
        appid: '',
        path: '',
        desc: '',
        pic: ''
      } )"
    >
      <p class="tip top">
        请填写企业微信后台绑定的小程序，否则会造成发送失败
        <a
          class="click"
          href="https://www.yuque.com/docs/share/9def95f9-bce5-4c66-b800-9f3cbef4fe50"
          target="_blank"
        >查看如何绑定</a>
      </p>
      <div class="formBox">
        <div class="line">
          <a-input v-model="contentMiniObj.appid" placeholder="输入小程序APPID（必填）" />
          <span class="len">{{ contentMiniObj.appid.length || '0' }}/200</span>
          <p class="tip">
            <a
              class="click"
              href="https://www.yuque.com/docs/share/6b55b4d7-7e59-4a0a-bdd6-fb4dd0d2f2e5"
              target="_blank"
            >如何获取APPID</a>
          </p>
        </div>
        <div class="line">
          <a-input v-model="contentMiniObj.path" placeholder="输入小程序页面路径（必填）" />
          <span class="len">{{ contentMiniObj.path.length || '0' }}/500</span>
          <p class="tip">
            <a
              class="click"
              href="https://www.yuque.com/docs/share/dd225b88-7778-463e-82a2-37bff08e1119"
              target="_blank"
            >如何获取小程序路径</a>
          </p>
        </div>
        <div class="line textarea">
          <a-textarea v-model="contentMiniObj.desc" autoSize placeholder="输入小程序的描述（必填）" />
          <span class="len">{{ contentMiniObj.desc.length || '0' }}/170</span>
        </div>
      </div>
      <div class="pic">
        <div
          class="addPic image"
          v-if="!contentMiniObj.pic"
          @click="openSelectPhoto('addMiniPhoto')"
        >+</div>
        <img
          class="image"
          v-else
          :src="contentMiniObj.pic"
          @click="openSelectPhoto('addMiniPhoto')"
        />
        <span class="photoTip">图片限制在2MB以内</span>
      </div>
      <template slot="footer">
        <a-button
          @click="closeContentModal('contentMiniModalShow', 'contentMiniObj',{
            appid: '',
            path: '',
            desc: '',
            pic: ''
          } )"
        >取消</a-button>
        <a-button type="primary" @click="confirmContentMini">确定</a-button>
      </template>
    </a-modal>
    <!-- 添加素材库弹窗 -->
    <a-modal v-model="contentLibraryModalShow" centered @ok="handleAddLibraryOk" width="95%">
      <MediumGroup
        :is-component="true"
        v-if="contentLibraryModalShow"
        @materialSelect="librarySelectChange"
      />
    </a-modal>
  </div>
</template>

<script>
import { departmentEmp } from '@/api/common.js'
import Department from '@/components/department'
import LabelSelect from '../clientFollow/components/LabelSelect.vue'
import ChooseGroupTransferModal from './components/ChooseGroupTransferModal.vue'
import { deepClonev2 } from '@/utils/util'
import { delSopTaskItemReq, getExpectNumReq, getUserSopReq, userSopSettingReq, userSopTaskItemSettingReq } from '@/api/salesManagement'
import { getDict, upLoad } from '@/api/common'
import { defaultLinkObj, defaultMiniObj, defaultLibraryObj, include1TypeSelectOptions, include2TypeSelectOptions, handleBtnArr, getNowDate, isUrl, disabledBeforeDate, generaType, transformTaskItemEntry, transformTaskDate, generateDateTitle, returnPageTitle, transformTargetData, transformLibraryData } from './sopUtils'
export default {
  components: {
    Department,

    ChooseGroupTransferModal,
    'label-select': LabelSelect,
    'MediumGroup': () => import('@/views/mediumGroup/index.vue')
  },
  data () {
    return {
      treeData: [],
      isControlerDisabled: false,
      isInit: false, // 是否初始化完成，避免多余的保存
      sopId: this.$route.query.id,
      SOPName: '',
      // 企业成员选择
      employeeIds: [],
      // 预计人数
      sopExpectNum: 0,
      // 执行客户radio
      selectUserType: 1,
      // 执行客户标签弹窗
      chooseUserTagsModalShow: false,
      chooseWithTagsModalIndex: -1,
      // type-0 包含标签
      selectTagList: [],
      // type-1 包含组 list.item.type 1-标签 target-Array 2-客户阶段 target-String
      filterUserObj: {
        mode: '1',
        list: [
          {
            type: '1',
            include: undefined,
            target: undefined
          }
        ]
      },
      include1TypeSelectOptions,
      include2TypeSelectOptions,
      // 客户阶段
      include2TargetSelectOptions: [],
      // type-2 isOpenExclude-是否为添加排除 excludeList-排除列表
      excludeUserObj: {
        isOpenExclude: false,
        excludeList: []
      },
      // type-5
      chooseGroupType: 1,
      chooseGroupExplan: '',
      chooseGroupTransferModalShow: false,
      chooseGroupsList: [],

      // date选择
      chooseDate1Type: 1,
      // 任务列表
      // type-015 type、date、content  type-23 dateArr[h/d, m/h:m] content type-4 type、date、time
      sopList: [],
      selectSopItemIdx: 0,
      handleBtnArr,
      // 发送内容
      uploadPhotoType: '',
      contentTextModalShow: false,
      contentText: '',
      contentLinkModalShow: false,
      contentLinkObj: { ...defaultLinkObj },
      contentMiniModalShow: false,
      contentMiniObj: { ...defaultMiniObj },
      contentLibraryModalShow: false,
      contentLibraryObj: { ...defaultLibraryObj },
      disabledBeforeDate,
      generateDateTitle,
      sopIsEdit: false // 是否编辑过-控制返回是否显示弹窗提示
    }
  },
  computed: {},
  watch: {
    SOPName (e) {
      if (e.length > 18) {
        this.SOPName = e.slice(0, 18)
      }
    },
    chooseGroupExplan (e) {
      if (e.length > 50) {
        this.chooseGroupExplan = e.slice(0, 50)
      }
    },
    selectUserType (e) {
      if (e === 2) {
        if (this.selectTagList.length) {
          this.selectTagList = []
        }
      }
      const id = this.$route.query.id === '-1' ? null : this.$route.query.id
      this.reloadExpectNum(this.isInit ? null : id)
    },
    contentText (e) {
      if (e.length > 1000) {
        this.contentText = e.slice(0, 1000)
      }
    },
    'contentLinkObj.title' (e) {
      if (e.length > 200) {
        this.contentLinkObj.title = e.slice(0, 200)
      }
    },
    'contentLinkObj.url' (e) {
      if (e.length > 500) {
        this.contentLinkObj.url = e.slice(0, 500)
      }
    },
    'contentLinkObj.desc' (e) {
      if (e.length > 170) {
        this.contentLinkObj.desc = e.slice(0, 170)
      }
    },
    'contentMiniObj.appid' (e) {
      if (e.length > 200) {
        this.contentMiniObj.appid = e.slice(0, 200)
      }
    },
    'contentMiniObj.path' (e) {
      if (e.length > 500) {
        this.contentMiniObj.path = e.slice(0, 500)
      }
    },
    'contentMiniObj.desc' (e) {
      if (e.length > 170) {
        this.contentMiniObj.desc = e.slice(0, 170)
      }
    },
    employeeIds () {
      // 成员变动就进行获取
      const id = this.$route.query.id === '-1' ? null : this.$route.query.id
      this.reloadExpectNum(this.isInit ? null : id)
    },
    selectTagList () {
      const id = this.$route.query.id === '-1' ? null : this.$route.query.id
      this.reloadExpectNum(this.isInit ? null : id)
    },
    filterUserObj: {
      deep: true,
      handler () {
        const id = this.$route.query.id === '-1' ? null : this.$route.query.id
        this.reloadExpectNum(this.isInit ? null : id)
      }
    },
    chooseGroupsList () {
      if (this.chooseGroupType === 1) {
        const id = this.$route.query.id === '-1' ? null : this.$route.query.id
        this.reloadExpectNum(this.isInit ? null : id)
      }
    }
  },
  beforeCreate () { },
  created () {
    this.departmentEmp()
    let typeTxt = '创建'
    if (this.sopId !== '-1') {
      typeTxt = '编辑'
      this.getSopDetail()
    } else {
      this.createSop()
    }
    returnPageTitle(typeTxt, this.$route.query.type)
    this.getDicts()
  },
  beforeMount () { },
  mounted () {
    window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
  },
  beforeRouteLeave (_, __, next) {
    // 导航离开当前路由的时候被调用，this可以被访问到
    if (!this.sopIsEdit) {
      next()
    } else {
      this.$confirm({
        title: '返回后，将不再保存已编辑的内容',
        onOk () {
          next()
        }
      })
    }
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.beforeunloadHandler, false)
  },
  methods: {
    beforeunloadHandler (e) {
      return '关闭'
    },
    /**
     * 拉取部门数据
     */
    departmentEmp () {
      departmentEmp().then(res => {
        this.treeData = res.data
      })
    },
    // 创建SOP
    async createSop () {
      const obj = this.generateSendObj()
      const res = await userSopSettingReq(obj)
      // .then(res => {
      this.sopId = res.data.id
      if (this.$route.query.type === '2') {
        // 需要多加一个对象
        const nowD = deepClonev2(this.filterUserObj)
        nowD.list.push({
          type: '2',
          include: undefined,
          target: undefined
        })
        this.filterUserObj = nowD
      } else {
        // 监听会自动触发，防止多次
        this.reloadExpectNum(res.data.id)
      }
      await this.addSop()
      this.isInit = true
      this.sopIsEdit = false
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    // 获取sop详情
    async getSopDetail () {
      const pageType = this.$route.query.type
      try {
        const { data } = await getUserSopReq({ id: this.sopId })
        // console.log('res', data)
        this.isControlerDisabled = data.carry
        this.sopList = data.datas.map(item => {
          const obj = {
            id: item.id,
            isEdit: item.alter,
            content: transformTaskItemEntry(item.entry, 'from')
          }
          if (['0', '1', '5'].includes(pageType)) {
            obj.date = transformTaskDate(pageType, item, 'from')
          } else if (['2', '3'].includes(pageType)) {
            const { dateArr, dateType } = transformTaskDate(pageType, item, 'from')
            obj.dateArr = dateArr
            obj.dateType = dateType
          } else {
            // 生日SOP
            const { dateType, date, time } = transformTaskDate(pageType, item, 'from')
            obj.dateType = dateType
            obj.date = date
            obj.time = time
          }
          return obj
        })
        this.SOPName = data.name
        this.employeeIds = data.source.employeeIds.map(it => it.employeeId)
        if (['0', '1', '2', '4', '5'].includes(pageType)) {
          this.selectUserType = data.target.length === 0 ? 2 : 1
        }
        const targetDatas = transformTargetData(pageType, data.target, 'from')
        if (pageType === '0') {
          this.selectTagList = targetDatas.labelObjs
        } else if (['1', '2', '4'].includes(pageType)) {
          this.filterUserObj = targetDatas
          if (pageType === '2') {
            this.excludeUserObj.excludeList = data.reject
          }
        } else if (pageType === '5') {
          this.chooseGroupExplan = data.source.explain
          this.chooseGroupType = data.source.ownerIds.length ? 1 : 2
          this.chooseGroupsList = data.source.ownerIds.length ? data.source.ownerIds : data.source.roomIds
        }
      } catch (e) {
        console.log('get userSopDetail err', e)
      }
      this.$nextTick(() => {
        this.isInit = true
        this.sopIsEdit = false
      })
    },
    // 获取字典
    getDicts () {
      getDict({ dictType: 'follow_up_status' }).then(res => {
        this.include2TargetSelectOptions = res.data
      })
    },
    // 成员选择
    employeeIdsChange (e) {
      this.employeeIds = e
    },
    // 执行客户筛选组
    addNewFilterList () {
      this.filterUserObj.list.push({
        type: this.filterUserObj.list[0].type === '1' ? '2' : '1',
        include: undefined,
        target: undefined
      })
    },
    delFilterList (index) {
      this.filterUserObj.list.splice(index, 1)
    },
    // 选择标签内调用父组件事件集
    // -1 默认 空 正数 多个标签选值 -2 排除标签
    showBox (e) {
      if (e != -1) {
        const pageType = this.$route.query.type
        let filterIdArr = []
        let filterInputArr = []
        if (e >= 0) {
          if (pageType === '0') {
            filterIdArr = this.selectTagList.map(item => item.id)
            filterInputArr = this.selectTagList
          } else if (['1', '2', '4'].includes(pageType)) {
            this.chooseWithTagsModalIndex = e
            const labels = this.filterUserObj.list[e].target || []
            filterIdArr = labels.map(item => item.id)
            filterInputArr = labels
          }
        } else if (e === -2) {
          this.excludeUserObj.isOpenExclude = true
          filterIdArr = this.excludeUserObj.excludeList.map(item => item.id)
          filterInputArr = this.excludeUserObj.excludeList
        }
        this.$refs.labelSelect.idArr = filterIdArr
        this.$refs.labelSelect.inputArr = filterInputArr
      }
      this.chooseUserTagsModalShow = !this.chooseUserTagsModalShow
    },
    transmitLabel (e) {
      const pageType = this.$route.query.type
      // 排除标签
      if (this.excludeUserObj.isOpenExclude) {
        this.excludeUserObj.excludeList = e
        this.excludeUserObj.isOpenExclude = false
        return
      }
      if (pageType === '0') {
        this.selectTagList = e
      } else if (['1', '2', '4'].includes(pageType)) {
        const nowD = deepClonev2(this.filterUserObj)
        nowD.list[this.chooseWithTagsModalIndex].target = e
        this.filterUserObj = nowD
        this.chooseWithTagsModalIndex = -1
      }
    },
    // -1 默认 -2 排除 -3 群组
    delTagHandle (id, fIdx, index) {
      const pageType = this.$route.query.type
      let filterIdArr = []
      let filterInputArr = []
      if (fIdx === -2) {
        filterIdArr = this.excludeUserObj.excludeList.map((item) => item.id)
        filterInputArr = this.excludeUserObj.excludeList
        this.excludeUserObj.excludeList = this.excludeUserObj.excludeList.filter((_, i) => i != index)
      } else if (fIdx === -3) {
        this.chooseGroupsList.splice(index, 1)
      } else {
        if (pageType === '0') {
          filterIdArr = this.selectTagList.map((item) => item.id)
          filterInputArr = this.selectTagList
          this.selectTagList = this.selectTagList.filter((_, i) => i != index)
        } else if (['1', '2', '4'].includes(pageType)) {
          if (pageType === '2' && this.excludeUserObj.isOpenExclude) {
            this.excludeUserObj.excludeList = 'list'
          } else {
            const nowD = deepClonev2(this.filterUserObj)
            nowD.list[fIdx].target.splice(index, 1)
            this.filterUserObj = nowD
          }
        }
      }
      this.$refs.labelSelect.setArr(id, index)
      this.$refs.labelSelect.idArr = filterIdArr
      this.$refs.labelSelect.inputArr = filterInputArr
    },
    // 客户群modal组
    confirmChooseGroupTransfer (list) {
      this.chooseGroupsList = list
      this.closeChooseGroupTransferModal()
    },
    closeChooseGroupTransferModal () {
      this.chooseGroupTransferModalShow = false
    },
    // 任务列表
    chooseSopItem (index) {
      if (this.selectSopItemIdx === index) return
      this.selectSopItemIdx = index
    },
    // 更新sop item 时间
    sendDateChange (val) {
      const nowD = deepClonev2(this.sopList)
      nowD[this.selectSopItemIdx].date = val
      this.sopList = nowD
      this.generateUpdateTaskItemObj(nowD[this.selectSopItemIdx])
    },
    // type-2,3,4 时间输入框变动 noIdx-4使用
    dateNumberChange (index, noIdx = false) {
      const nowItem = this.sopList[this.selectSopItemIdx]
      if (((nowItem.dateType - 1) === index) || noIdx) {
        this.generateUpdateTaskItemObj(nowItem)
      }
    },
    // 重置时间（生日sop）
    resetDateTime () {
      this.sopList[this.selectSopItemIdx].time = '10:00'
      this.generateUpdateTaskItemObj(this.sopList[this.selectSopItemIdx])
    },
    chooseDateRadioClick (radioKey) {
      this.sopList[this.selectSopItemIdx].dateType = radioKey
      this.generateUpdateTaskItemObj(this.sopList[this.selectSopItemIdx])
    },
    // 新增sop item
    async addSop () {
      if (!this.sopList.every(it => (it.content && it.content.length) > 0)) {
        this.$message.error('每一个时间节点都至少添加一个内容才可以新增')
        return
      }
      const pageType = this.$route.query.type
      let defaultSopObj = {
        id: '',
        content: [],
        isEdit: true
      }
      if (['0', '1', '5'].includes(pageType)) {
        const date = getNowDate()
        defaultSopObj = {
          ...defaultSopObj,
          date
        }
      } else if (['2', '3'].includes(pageType)) {
        defaultSopObj = {
          ...defaultSopObj,
          dateType: 1,
          dateArr: [[0, 10], [1, '10:00']]
        }
      } else {
        // 生日SOP
        defaultSopObj = {
          ...defaultSopObj,
          dateType: '1',
          date: 1,
          time: '10:00'
        }
      }
      const id = await this.generateUpdateTaskItemObj(defaultSopObj)
      defaultSopObj.id = id
      this.sopList.push(defaultSopObj)
      this.selectSopItemIdx = this.sopList.length - 1
    },
    delSopItem (index, id) {
      if (!this.sopList[index].isEdit && this.isControlerDisabled) return this.$message.warn('执行后不可修改！')
      const that = this
      this.$confirm({
        title: '确定删除当前时间点?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const nowD = deepClonev2(this.sopList)
          nowD.splice(index, 1)
          await delSopTaskItemReq({ id })
          this.$message.success('删除成功')
          if (index <= this.selectSopItemIdx) {
            this.selectSopItemIdx -= 1
          }
          that.sopList = nowD
        }
      })
    },
    // 发送内容集合
    // 选择单个发送类型
    chooseSendType (type, isEdit = false) {
      if (!isEdit && this.sopList[this.selectSopItemIdx].content.length === 10) {
        return this.$message.warn('最多只可添加10条内容！')
      } else if (!isEdit && this.sopList[this.selectSopItemIdx].content.some(it => it.type === 'text') && type === 'text') {
        return this.$message.warn('只能添加一条文本内容！')
      }
      if (type === 'text') {
        this.contentTextModalShow = true
      } else if (type === 'image') {
        this.uploadPhotoType = 'addContent'
        this.openSelectPhoto('addContent')
      } else if (type === 'video') {
        this.$refs['uploadVideo'].click()
      } else if (type === 'link') {
        this.contentLinkModalShow = true
      } else if (type === 'library') {
        this.contentLibraryModalShow = true
      } else if (type === 'embed') {
        this.contentMiniModalShow = true
      }
    },
    // 打开图片选择
    openSelectPhoto (type) {
      this.uploadPhotoType = type
      this.$refs['uploadPhoto'].click()
    },
    // 文字modal确认选择
    async confirmContentText () {
      await this.setSopListContent(this.isEditingItem ? 'edit' : 'add', 'text', this.editIdx === -1 ? null : this.editIdx, this.contentText)
      this.closeContentModal('contentTextModalShow', 'contentText', '')
    },
    // 上传图片
    async uploadPhoto (e) {
      if (!this.uploadPhotoType) return
      const file = e.target.files[0]
      const splitArr = file.name.split('.')

      if (!['jpg', 'png'].includes(splitArr[splitArr.length - 1])) {
        return this.$message.warn('请上传 jpg, png 格式的图片文件')
      }
      if (file.size > 2 * 1000 * 1000) {
        return this.$message.warn('请上传小于2MB的图片文件')
      }
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('time', 1)
        const res = await upLoad(formData)
        const params = {
          imgUrl: res.data.fullPath,
          mediaName: file.name
        }
        if (this.uploadPhotoType === 'addContent') {
          await this.setSopListContent(this.isEditingItem ? 'edit' : 'add', 'image', this.editIdx === -1 ? null : this.editIdx, params)
          this.isEditingItem = false
          this.editIdx = -1
        } else if (this.uploadPhotoType === 'addLinkPhoto') {
          this.contentLinkObj.pic = res.data.fullPath
        } else if (this.uploadPhotoType === 'addMiniPhoto') {
          this.contentMiniObj.pic = res.data.fullPath
        }
      } catch (e) {
        console.log(e, 'upload err')
      }
      e.target.value = ''
    },
    // 上传视频
    async uploadVideo (e) {
      const file = e.target.files[0]
      if (file.size > 10 * 1000 * 1000) {
        return this.$message.warn('请上传小于10MB的视频文件')
      }
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('time', 1)
        const res = await upLoad(formData)
        const params = {
          videoUrl: res.data.fullPath,
          mediaName: res.data.name
        }
        await this.setSopListContent(this.isEditingItem ? 'edit' : 'add', 'video', this.editIdx === -1 ? null : this.editIdx, params)
      } catch (e) {
        console.log(e, 'upload video err')
      }
      this.isEditingItem = false
      this.editIdx = -1
      e.target.value = ''
    },
    videoLoadErr (index) {
      const nowD = deepClonev2(this.sopList)
      nowD[this.selectSopItemIdx].content[index].showPoster = true
      this.sopList = nowD
    },
    // modal 关闭
    closeContentModal (modalName, dataName, clearVal) {
      this[modalName] = false
      this[dataName] = clearVal
      this.isEditingItem = false
      this.editIdx = -1
    },
    // 链接框输入确认
    async confirmContentLink () {
      if (!this.contentLinkObj.title) {
        return this.$message.warn('请输入链接标题！')
      } else if (!this.contentLinkObj.url) {
        return this.$message.warn('请输入链接地址！')
      } else if (!isUrl(this.contentLinkObj.url)) {
        return this.$message.warn('请输入正确的链接地址！')
      } else if (!this.contentLinkObj.pic) {
        return this.$message.warn('请上传封面图片！')
      }
      await this.setSopListContent(this.isEditingItem ? 'edit' : 'add', 'link', this.editIdx === -1 ? null : this.editIdx, this.contentLinkObj)
      this.closeContentModal('contentLinkModalShow', 'contentLinkObj', {
        title: '',
        url: '',
        desc: '',
        pic: ''
      })
    },
    // 小程序框输入确认
    async confirmContentMini () {
      if (!this.contentMiniObj.appid) {
        return this.$message.warn('请输入小程序appid！')
      } else if (!this.contentMiniObj.path) {
        return this.$message.warn('请输入小程序页面路径！')
      } else if (!this.contentMiniObj.desc) {
        return this.$message.warn('请输入小程序描述！')
      } else if (!this.contentMiniObj.pic) {
        return this.$message.warn('请上传小程序封面图片！')
      }
      await this.setSopListContent(this.isEditingItem ? 'edit' : 'add', 'embed', this.editIdx === -1 ? null : this.editIdx, this.contentMiniObj)
      this.closeContentModal('contentMiniModalShow', 'contentMiniObj', {
        appid: '',
        path: '',
        desc: '',
        pic: ''
      })
    },
    // 素材库弹窗确认
    async handleAddLibraryOk () {
      if (this.contentLibraryObj.temporaryStroageArr.some(it => [4, 7].includes(it.type_id))) {
        this.$message.warning('暂不支持文件、音频类型素材！')
        return
      }
      if ((this.sopList[this.selectSopItemIdx].content.length + this.contentLibraryObj.temporaryStroageArr.length) > 10) {
        this.$message.warning('发送条数不能超过十条！')
        return
      }
      const sopTxtItemIdx = this.sopList[this.selectSopItemIdx].content.findIndex(it => it.type === 'text')
      for (const item of this.contentLibraryObj.temporaryStroageArr) {
        const { type, data } = transformLibraryData(item)
        if (sopTxtItemIdx !== -1 && type === 'text') {
          // 文字进行合并，否则新增
          await this.setSopListContent('edit', 'text', sopTxtItemIdx, this.sopList[this.selectSopItemIdx].content[sopTxtItemIdx].content + data)
        } else {
          await this.setSopListContent('add', type, null, data)
        }
        this.contentLibraryModalShow = false
      }
    },
    // 素材库选择Change
    librarySelectChange (e) {
      console.log(e, ' e')
      this.contentLibraryObj.temporaryStroageArr = e
    },
    // 处理数据
    async setSopListContent (handle, type, index, content) {
      const nowD = deepClonev2(this.sopList)
      if (handle === 'add') {
        nowD[this.selectSopItemIdx].isEdit = true // 是否允许编辑，如果已发送则禁止编辑
        nowD[this.selectSopItemIdx].content.push({
          type,
          content
        })
      } else if (handle === 'edit') {
        nowD[this.selectSopItemIdx].content[index].content = content
      }
      const item = nowD[this.selectSopItemIdx]
      await this.generateUpdateTaskItemObj(item)
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
    // 刷新人数
    async reloadExpectNum (nowId) {
      try {
        const obj = this.generateSendObj(false, true)
        let id
        if (!nowId) {
          const { data } = await userSopSettingReq(obj)
          id = data.id
          // id = this.sopId
        } else {
          id = nowId
        }
        const { data: { total } } = await getExpectNumReq({ id })
        this.sopExpectNum = total
      } catch (e) {
        console.log(e, 'reload err')
        this.$message.error('刷新失败，请重试！')
      }
    },
    // 执行
    sendSop () {
      const pageType = this.$route.query.type
      if (!this.SOPName.trim()) {
        this.$message.error('请输入SOP名称！')
        return
      }
      if (!this.employeeIds.length && pageType !== '5') {
        this.$message.error('至少选择一名执行员工！')
        return
      }
      if (pageType === '0') {
        if (this.selectUserType === 1 && !this.selectTagList.length) {
          this.$message.error('至少选择一项用户包含标签')
          return
        }
      } else if (['1', '2', '4'].includes(pageType)) {
        if (this.selectUserType === 1 && !this.filterUserObj.list.every(it => it.include)) {
          this.$message.error('每行条件都需要选择包含类型！')
          return
        }
        // 定期提醒二选一即可
        if (pageType === '2') {
          console.log(this.filterUserObj.list, 'this.filterUserObj.list')
          if (!this.filterUserObj.list.some(({ target }) => target && target.length)) {
            this.$message.error('至少一个条件需要选择包含目标！')
            return
          }
        } else {
          if (this.selectUserType === 1 && this.filterUserObj.list.some(({ target, include }) => !(['IsNull', 'IsNotNull'].includes(include) || (target && target.length)))) {
            this.$message.error('每行条件都需要选择包含目标！')
            return
          }
        }
      } else if (pageType === '5') {
        if (!this.chooseGroupsList.length) {
          this.$message.error('请选择执行群！')
          return
        }
      }
      if (!this.sopList.length) {
        this.$message.error('至少添加一项任务才可以执行！')
        return
      }
      if (!this.sopList.every(item => item.content.length)) {
        this.$message.error('每项任务都至少添加一项发送内容才可以执行！')
        return
      }
      const obj = this.generateSendObj(true)
      userSopSettingReq(obj).then(() => {
        window.removeEventListener('beforeunload', this.beforeunloadHandler, false)
        this.$message.success('执行成功！')
        this.sopIsEdit = false
        this.$nextTick(() => {
          this.$router.go(-1)
        })
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
    },
    // 生成执行接口的参数
    generateSendObj (isExecution = false, isGetNum = false) {
      const pageType = this.$route.query.type
      const type = generaType(pageType)
      const id = this.sopId === '-1' ? '' : this.sopId
      const name = this.SOPName
      const source = {
        employeeIds: this.employeeIds.map(it => ({ employeeId: it }))
      }
      let target = []
      const finallyObj = {
        id,
        type,
        name,
        source,
        carry: isExecution
      }
      if (isExecution || isGetNum) {
        let obj = {}
        if (pageType === '0') {
          obj = {
            selectUserType: this.selectUserType,
            selectTagList: this.selectTagList
          }
        } else if (['1', '2', '4'].includes(pageType)) {
          obj = {
            selectUserType: this.selectUserType,
            filterUserObj: this.filterUserObj
          }
          if (pageType === '2') {
            finallyObj.reject = this.excludeUserObj.excludeList
            // type === 2 的时候，需要传递默认值，页面没有可供选择项
            obj.filterUserObj.list[0].include = 'AllIn'
            obj.filterUserObj.list[1].include = 'In'
          }
        } else if (pageType === '5') {
          finallyObj.source[this.chooseGroupType === 1 ? 'ownerIds' : 'roomIds'] = this.chooseGroupsList
          finallyObj.source.explain = this.chooseGroupExplan
        }
        target = transformTargetData(pageType, obj, 'to')
      }
      finallyObj.target = target
      this.sopIsEdit = true
      return finallyObj
    }
  }
}
</script>
<style lang='less'>
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
@import './addSop.less';
</style>
