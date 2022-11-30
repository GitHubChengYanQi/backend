<template>
  <div id="addSop_Page_Container" ref="addSop_Page_Container">
    <a-spin :spinning="loadingStatus">
      <div class="chooseUsersContainer">
        <div class="line">
          <span class="label">
            <span style="color: red">*</span>
            SOP名称
          </span>
          <div class="input">
            <a-input v-model="addInfo.sopName" placeholder="请输入SOP名称" @change="changeSopName"/>
            <span class="len">{{ addInfo.sopName && addInfo.sopName.length ? addInfo.sopName.length :'0' }}/18</span>
          </div>
        </div>
        <div class="execution" v-permission="'/sopClusterCalendarTemplate/add@post'" v-if="(pageType === 'add') || (pageType === 'copy')" @click="sendSop()">保存</div>
        <div class="execution" v-permission="'/sopClusterCalendarTemplate/update@post'" v-else @click="sendSop()">保存</div>
      </div>
      <div class="sendSOPInfoContainer">
        <div class="sendSOPList" v-if="addInfo.listTaskInfo && addInfo.listTaskInfo.length && currentShowTabId === 1">
          <div class="addSop" @click="addSop">+ 添加</div>
          <div
            :class="selectSopItemIndex === index ? 'sopItem active' : 'sopItem'"
            v-for="(item, index) in addInfo.listTaskInfo"
            :key="item.tempId ? item.tempId : item.id"
            @click="chooseSopItem(item,index)"
          >
            {{ returnSopText(item) }}
            <span
              v-if="addInfo.listTaskInfo.length !== 1"
              class="del"
              @click.stop="delSopItem(index, item)"
            >×</span>
          </div>
        </div>
        <div class="sendItemContent">
          <div class="tabWrapperDiv">
            <div class="singleTabDiv" @click="changeTabMethod(item)" :class="currentShowTabId === item.id ? 'activeTabDiv' : ''" v-for="item in showTabList" :key="item.id">{{ item.name }}</div>
          </div>
          <div class="calendarDivWrapper">
            <a-calendar @select.self="chooseDateMethod" valueFormat="YYYY-MM-DD" v-if="currentShowTabId === 0">
              <ul slot="dateCellRender" slot-scope="value" class="events">
                <li v-for="item in getCalendarTaskData(value)" :key="item.tempId ? item.tempId : item.id" class="singleDiv" @click.stop="chooseTimeContent(item)">
                  <div class="singleContentTaskDiv">{{ returnCalendarTask(item) }}</div>
                  <span class="delDiv" @click.stop="deleteCalendarTask(item)" v-if="getCalendarTaskData(value).length > 1">X</span>
                </li>
              </ul>
            </a-calendar>
          </div>
          <div class="chooseSendDate" v-if="addInfo.listTaskInfo && addInfo.listTaskInfo.length && currentShowTabId === 1">
            <div class="singleSendContentItem">
              <div class="singleSendContentTitle">发送时间:</div>
              <a-date-picker
                dropdownClassName="addSop_Page_Container_selectSopItemDateBox"
                :allowClear="false"
                :showToday="false"
                v-model="addInfo.listTaskInfo[selectSopItemIndex].sendTime"
                valueFormat="YYYY-MM-DD HH:mm"
                format="YYYY-MM-DD HH:mm"
                show-time
                :getPopupContainer="() => $refs['div_wrapper_container']"
                @change="sendDateChange"
              />
            </div>
            <div class="singleSendContentItem">
              <div class="singleSendContentTitle">内容标题:</div>
              <a-input v-model="addInfo.listTaskInfo[selectSopItemIndex].sendTitle" placeholder="请输入标题,标题不发给客户" @change="changeSopName"/>
            </div>
          </div>
          <SendContent
            v-show="currentShowTabId === 1"
            :contentArray.sync="contentArray"
            :isSopEdit.sync="isSopEdit"
            :isDisableEdit="false"/>
        </div>
      </div>
    </a-spin>
    <a-modal
      title="定时发送内容"
      :maskClosable="false"
      :width="1000"
      :visible="sendCalendarContentModalShow"
      class="sendContentModal"
      @cancel="closeCalendarSendContentModal()"
      :getContainer="() => $refs['addSop_Page_Container']"
    >
      <div>
        <a-form layout="horizontal">
          <a-form-item label="发送时间" :labelCol="{span: 2}" :wrapperCol="{span: 14}">
            <a-date-picker
              dropdownClassName="addSop_Page_Container_selectSopItemDateBox"
              :allowClear="false"
              :showToday="false"
              v-model="addCalendarContentInfo.sendTime"
              valueFormat="YYYY-MM-DD HH:mm"
              format="YYYY-MM-DD HH:mm"
              show-time
              :getPopupContainer="() => $refs['div_wrapper_container']"
              @change="sendDateChange"
            />
          </a-form-item>
          <a-form-item label="内容标题" :labelCol="{span: 2}" :wrapperCol="{span: 20}">
            <a-input v-model="addCalendarContentInfo.sendTitle" placeholder="请输入标题,标题不发给客户" @change="changeSopName"/>
          </a-form-item>
        </a-form>
        <div class="sendCalendarSOPInfoContainer">
          <div class="sendContent">
            <div class="tilBar">
              <span class="til">
                <span style="color: red;font-weight: 500;">*</span>发送内容
              </span>
              <div class="handleBox">
                <div
                  v-for="(item, index) in handleCalendarBtnArr"
                  :class="((sendCalendarContentArray.length === 10 || (sendCalendarContentArray.findIndex(it => (it.type === 1 && item.type === 'text')) != -1)) || isCalendarDisableEdit === true)?
                    'handleBtn disabled' :
                    'handleBtn'"
                  :key="index"
                  @click="chooseCalendarSendType(item.type)"
                >+ {{ item.name }}</div>
                <div
                  class="disabledBox"
                  v-if="isCalendarDisableEdit === true"
                  @click="$message.warn('执行后不可修改！')"
                ></div>
              </div>
            </div>
            <div class="contentBox">
              <div
                class="contentItem"
                v-for="(item, index) in sendCalendarContentArray"
                :key="index"
              >
                <div class="idx">{{ index + 1 }}</div>
                <div :class="`content ${item.type === 1 ? 'text' : ''}`" v-if="item.type === 1">{{ item.textData }}</div>
                <div :class="`content ${item.type === 2 ? 'image': ''}`" v-else-if="item.type === 2">
                  <img :src="item.photoUrl" alt />
                </div>
                <div :class="`content ${item.type === 3 ? 'video' : ''}`" v-else-if="item.type === 3">
                  <div class="poster" v-if="item.showPoster">{{ returnCalendarErrorText(item.videoUrl) }}</div>
                  <video :src="item.videoUrl" @error="videoCalendarLoadErr(index)" alt />
                </div>
                <div :class="`content ${item.type === 4 ? 'link' : ''}`" v-else-if="item.type === 4">
                  <div class="lef">
                    <span class="til">{{ item.linkTitle }}</span>
                    <span class="desc">{{ item.content ? item.content.linkUrl: '' }}</span>
                    <span class="desc">{{ item.content ? item.content.linkShow: '' }}</span>
                  </div>
                  <img :src="item.linkPhoto" alt class="image" />
                </div>
                <div :class="`content ${item.type === 5 ? 'embed' : ''}`" v-else-if="item.type === 5">
                  <div class="line">
                    <img src="./images/miniProgramIcon.svg" alt class="icon" />
                    <span class="til">{{ '小程序标题' }}</span>
                  </div>
                  <div class="line desc">{{ item.appShow }}</div>
                  <img :src="item.appPhoto" alt class="image" />
                  <div class="line">
                    <img src="./images/miniProgramIcon.svg" alt class="icon" />
                    <span class="say">小程序</span>
                  </div>
                </div>
                <div class="handlesBox" v-if="sendCalendarContentArray && sendCalendarContentArray[selectCalendarSopItemIdx] && isCalendarDisableEdit === false">
                  <img
                    src="./images/move.svg"
                    alt
                    :class="index === 0 ? 'icon move disabled' : 'icon move'"
                    @click="handleCalendarMoveClick(index, 'up')"
                  />
                  <img
                    src="./images/move.svg"
                    style="transform: rotate(180deg)"
                    alt
                    :class="(sendCalendarContentArray.length - 1 === index) ? 'icon move disabled' : 'icon move'"
                    @click="handleCalendarMoveClick(index, 'down')"
                  />
                  <img
                    src="./images/edit.svg"
                    alt
                    class="icon"
                    @click="handleCalendarEditClick(item, index)"
                  />
                  <img src="./images/del.svg" alt class="icon" @click="handleCalendarDelClick(index)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <input
          type="file"
          accept="image/jpeg, image/png"
          ref="uploadCalendarPhotoRef"
          @change="uploadCalendarPhoto"
          class="uploadFileInp"
        />
        <input
          type="file"
          accept="video/*"
          ref="uploadCalendarVideoRef"
          @change="uploadCalendarVideo"
          class="uploadFileInp"
        />
        <!-- :getContainer="() => $refs['addSop_Page_Container']" -->
        <!-- div_wrapper_container -->
        <a-modal
          title="添加文本"
          :maskClosable="false"
          :width="600"
          :visible="contentCalendarTextModalShow"
          class="contentTextModal"
          @cancel="closeCalendarContentTextModal()"
          :getContainer="() => $refs['addSop_Page_Container']"
        >
          <a-textarea v-model="contentCalendarText" autoSize placeholder="请输入内容" />
          <span class="len">{{ contentCalendarText.length ? contentCalendarText.length : '0' }}/1000</span>
          <template slot="footer">
            <a-button @click="closeCalendarContentTextModal()">取消</a-button>
            <a-button type="primary" @click="confirmCalendarContentText">确定</a-button>
          </template>
        </a-modal>
        <a-modal
          title="新增链接"
          :maskClosable="false"
          :width="600"
          :visible="contentCalendarLinkModalShow"
          @cancel="closeCalendarLinkModal()"
          :getContainer="() => $refs['addSop_Page_Container']"
        >
          <div class="contentLinkModal">
            <div class="formBox">
              <div class="line">
                <a-input v-model="contentCalendarLinkObj.linkTitle" placeholder="请输入链接标题（必填）" />
                <span class="len">{{ (contentCalendarLinkObj.linkTitle && contentCalendarLinkObj.linkTitle.length) ? contentCalendarLinkObj.linkTitle.length : '0' }}/200</span>
              </div>
              <div class="line">
                <a-input v-model="contentCalendarLinkObj.linkUrl" placeholder="输入http或https开头的链接地址（必填）" />
                <span class="len">{{ (contentCalendarLinkObj.linkUrl && contentCalendarLinkObj.linkUrl.length) ? contentCalendarLinkObj.linkUrl.length : '0' }}/500</span>
              </div>
              <div class="line textarea">
                <a-textarea v-model="contentCalendarLinkObj.linkShow" autoSize placeholder="请输入内容简介（选填）" />
                <span class="len">{{ (contentCalendarLinkObj.linkShow && contentCalendarLinkObj.linkShow.length) ? contentCalendarLinkObj.linkShow.length : '0' }}/170</span>
              </div>
            </div>
            <div class="pic">
              <div
                class="addPic image"
                v-if="!contentCalendarLinkObj.linkPhoto"
                @click="openCalendarSelectPhoto('addLinkPhoto')"
              >+</div>
              <img
                class="image"
                v-else
                :src="contentCalendarLinkObj.linkPhoto"
                @click="openCalendarSelectPhoto('addLinkPhoto')"
              />
              <span class="tip">图片限制在2MB以内</span>
            </div>
          </div>
          <!-- <div class="formBox">
            <div class="line">
              <a-input v-model="contentCalendarLinkObj.linkTitle" placeholder="请输入链接标题（必填）" />
              <span class="len">{{ (contentCalendarLinkObj.linkTitle && contentCalendarLinkObj.linkTitle.length) ? contentCalendarLinkObj.linkTitle.length : '0' }}/200</span>
            </div>
            <div class="line">
              <a-input v-model="contentCalendarLinkObj.linkUrl" placeholder="输入http或https开头的链接地址（必填）" />
              <span class="len">{{ (contentCalendarLinkObj.linkUrl && contentCalendarLinkObj.linkUrl.length) ? contentCalendarLinkObj.linkUrl.length : '0' }}/500</span>
            </div>
            <div class="line textarea">
              <a-textarea v-model="contentCalendarLinkObj.linkShow" autoSize placeholder="请输入内容简介（选填）" />
              <span class="len">{{ (contentCalendarLinkObj.linkShow && contentCalendarLinkObj.linkShow.length) ? contentCalendarLinkObj.linkShow.length : '0' }}/170</span>
            </div>
          </div>
          <div class="pic">
            <div
              class="addPic image"
              v-if="!contentCalendarLinkObj.linkPhoto"
              @click="openCalendarSelectPhoto('addLinkPhoto')"
            >+</div>
            <img
              class="image"
              v-else
              :src="contentCalendarLinkObj.linkPhoto"
              @click="openCalendarSelectPhoto('addLinkPhoto')"
            />
            <span class="tip">图片限制在2MB以内</span>
          </div> -->
          <template slot="footer">
            <a-button
              @click="closeCalendarLinkModal()"
            >取消</a-button>
            <a-button type="primary" @click="confirmCalendarContentLink">确定</a-button>
          </template>
        </a-modal>
        <a-modal
          title="新增小程序"
          :maskClosable="false"
          :width="600"
          :visible="contentCalendarMiniModalShow"
          @cancel="closeCalendarMiniModal()"
          :getContainer="() => $refs['addSop_Page_Container']"
        >
          <div class="contentLinkModal">
            <p class="tip top">
              请填写企业微信后台绑定的小程序，否则会造成发送失败
            <!-- <a
          class="click"
          href="https://www.yuque.com/docs/share/9def95f9-bce5-4c66-b800-9f3cbef4fe50"
          target="_blank"
        >查看如何绑定</a> -->
            </p>
            <div class="formBox">
              <div class="line">
                <a-input v-model="contentCalendarMiniObj.appId" placeholder="输入小程序APPID（必填）" />
                <span class="len">{{ contentCalendarMiniObj.appId && contentCalendarMiniObj.appId.length ? contentCalendarMiniObj.appId.length :'0' }}/200</span>
                <p class="tip">
                <!-- <a
              class="click"
              href="https://www.yuque.com/docs/share/6b55b4d7-7e59-4a0a-bdd6-fb4dd0d2f2e5"
              target="_blank"
            >如何获取APPID</a> -->
                </p>
              </div>
              <div class="line">
                <a-input v-model="contentCalendarMiniObj.appUrl" placeholder="输入小程序页面路径（必填）" />
                <span class="len">{{ contentCalendarMiniObj.appUrl && contentCalendarMiniObj.appUrl ? contentCalendarMiniObj.appUrl.length :'0' }}/500</span>
                <p class="tip">
                <!-- <a
              class="click"
              href="https://www.yuque.com/docs/share/dd225b88-7778-463e-82a2-37bff08e1119"
              target="_blank"
            >如何获取小程序路径</a> -->
                </p>
              </div>
              <div class="line textarea">
                <a-textarea v-model="contentCalendarMiniObj.appShow" autoSize placeholder="输入小程序的描述（必填）" />
                <span class="len">{{ contentCalendarMiniObj.appShow && contentCalendarMiniObj.appShow.length ? contentCalendarMiniObj.appShow.length :'0' }}/170</span>
              </div>
            </div>
            <div class="pic">
              <div
                class="addPic image"
                v-if="!contentCalendarMiniObj.appPhoto"
                @click="openCalendarSelectPhoto('addMiniPhoto')"
              >+</div>
              <img
                class="image"
                v-else
                :src="contentCalendarMiniObj.appPhoto"
                @click="openCalendarSelectPhoto('addMiniPhoto')"
              />
              <span class="photoTip">图片限制在2MB以内</span>
            </div>
          </div>

          <template slot="footer">
            <a-button
              @click="closeCalendarMiniModal()"
            >取消</a-button>
            <a-button type="primary" @click="confirmCalendarContentMini">确定</a-button>
          </template>
        </a-modal>
        <!-- 添加素材库弹窗 -->
        <a-modal v-model="contentCalendarLibraryModalShow" centered @ok="handleCalendarAddLibraryOk" width="95%">
          <MediumGroup
            :is-component="true"
            v-if="contentCalendarLibraryModalShow"
            @materialSelect="libraryCalendarSelectChange"
          />
        </a-modal>
        <!-- <SendContent
        :contentArray.sync="contentArray"
        :isSopEdit.sync="isSopEdit"
        :isDisableEdit="false"/> -->
      </div>

      <template slot="footer">
        <a-button
          @click="closeCalendarSendContentModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmCalendarSendSure">确定</a-button>
      </template>
    </a-modal>

  </div>
</template>

<script>
import { upLoad } from '@/api/common'
import { handleBtnArr, isUrl } from './sopUtils'
import { addCalendarTemplateMethod, getCalendarTemplateDetailMethod, editCalendarTemplateMethod } from '@/api/cluster'
import SendContent from './components/sendContent.vue'
import moment from 'moment'
import { Calendar } from 'ant-design-vue'
export default {
  name: 'AddClusterSop',
  components: {
    SendContent,
    aCalendar: Calendar,
    'MediumGroup': () => import('@/views/mediumGroup/index.vue')
  },
  data () {
    return {
      // 日历弹框开始
      sendCalendarContentModalShow: false,
      sendTime: '',
      isCalendarDisableEdit: false, // 日历弹框是否编辑状态
      chooseCalendarEditIndex: '', // 当前选择编辑的下标
      submitCalendarType: '', // 日历模式提交状态,新增与修改
      selectCalendarSopItemIdx: 0,
      sendCalendarContentArray: [], // 日历弹框内容数组
      // 日历模式链接/小程序上传类型
      uploadCalendarPhotoType: '',
      // 用在日历模式弹框中
      handleCalendarBtnArr: handleBtnArr,
      // 添加文字弹框
      contentCalendarTextModalShow: false,
      contentCalendarText: '',
      // 日历模式添加链接弹框
      contentCalendarLinkModalShow: false,
      // 日历模式新增链接对象
      contentCalendarLinkObj: {},
      // 日历模式添加小程序弹框
      contentCalendarMiniModalShow: false,
      // 日历模式新增小程序对象
      contentCalendarMiniObj: {},
      // 日历模式素材库选择数组
      contentCalendarLibraryArray: [],
      // 日历模式添加素材库弹框
      contentCalendarLibraryModalShow: false,
      // 日历弹框结束
      contentCalendarArray: [],
      addCalendarContentInfo: {},
      sendContentModalShow: false,
      isCalendarEdit: false,
      pageType: '', // 当前页面状态
      // 显示加载中
      loadingStatus: false,
      isSopEdit: false, // 判断页面是否被编辑过
      selectSopItemIdx: '', // 选中的时间id
      selectSopItemIndex: '', // 时间标签选择下标
      pageTypeId: 0, // 从上页传入的id,新增为-1,修改为真实id
      addInfo: {}, // 新增/修改数据对象
      timeArray: [], // 时间段数组
      isControlerDisabled: false,
      contentArray: [], // 内容数组
      chooseDate: '', // 时间选择器选择的时间
      SOPName: '',
      sopList: [],
      treeData: [],
      currentShowTabId: '',
      // 显示模式: 日历/列表
      showTabList: [
        {
          id: 0,
          name: '日历视图'
        },
        {
          id: 1,
          name: '列表视图'
        }
      ]
    }
  },
  created () {
    this.currentShowTabId = 0
    this.pageType = this.$route.query.type
    if (this.pageType === 'add') {
      // 新增模式,无需处理
      this.pageTypeId = -1
    } else if (this.pageType === 'edit' || this.pageType === 'copy') {
      // 修改模式/复制模式
      this.pageTypeId = Number(this.$route.query.id)
    }
    this.initMethod()
  },
  // 页面销毁前
  beforeDestroy () {
    console.log('新增群SOP模板页面销毁前')
    console.log(this.$router, '看看能得到路由么')
    const nextRouterLink = this.$router.currentRoute.path
    console.log(nextRouterLink, 'nextRouterLink')
    if (nextRouterLink.indexOf('clusterSop') === -1) {
      // 跳转的路由,非群SOP模板页
      sessionStorage.removeItem('sopTemplatePage')
    }
    // sessionStorage.removeItem('activeType')
  },
  watch: {
    'addInfo.sopName' (e) {
      if (e && e.length > 18) {
        this.addInfo.sopName = e.slice(0, 18)
      }
    },
    contentArray () {
      console.log(this.contentArray, '监听contentArray改变')
      console.log(this.addInfo.listTaskInfo, 'this.addInfo.listTaskInfo')
      // const tempIndex = this.addInfo.listTaskInfo.findIndex(item => (item.tempId ? (item.tempId === this.currentTimeId) : (item.id === this.currentTimeId)))
      const tempIndex = this.addInfo.listTaskInfo.findIndex(item => (item.tempId ? (item.tempId === this.selectSopItemIdx) : (item.id === this.selectSopItemIdx)))
      console.log(tempIndex, 'tempIndex')
      if (tempIndex !== -1) {
        this.$set(this.addInfo.listTaskInfo[tempIndex], 'sendContentList', this.contentArray)
      }
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      // this.$set(this.addInfo.listTaskInfo[tempIndex], 'sendContentList', this.contentArray)
    }
  },
  mounted () {

  },
  beforeRouteLeave (_, __, next) {
    // 导航离开当前路由的时候被调用，this可以被访问到
    if (!this.isSopEdit) {
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
  methods: {
    // 日历模式下删除任务
    deleteCalendarTask (info) {
      const that = this
      const nowCalendarList = Object.assign([], this.addInfo.listTaskInfo)
      this.$confirm({
        title: '确定删除此任务?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          let tempCalendarIndex = ''
          if (info.tempId) {
            tempCalendarIndex = nowCalendarList.findIndex(item => info.tempId === (item.tempId ? item.tempId : item.id))
          } else {
            tempCalendarIndex = nowCalendarList.findIndex(item => info.id === (item.tempId ? item.tempId : item.id))
          }
          nowCalendarList.splice(tempCalendarIndex, 1)
          that.$set(this.addInfo, 'listTaskInfo', nowCalendarList)
        }
      })
    },
    // 日历模式视频显示错误提示
    returnCalendarErrorText (url) {
      return '暂不支持显示 .avi 格式的视频'
    },
    // 日历模式链接或小程序上传图片
    openCalendarSelectPhoto (type) {
      this.$refs.uploadCalendarPhotoRef.value = ''
      console.log(type, 'type')
      this.uploadCalendarPhotoType = type
      this.$nextTick(() => {
        this.$refs['uploadCalendarPhotoRef'].click()
      })
    },
    // 日历模式点击不同的标签,添加不同的内容
    chooseCalendarSendType (type) {
      if (this.isCalendarDisableEdit) {
        return
      } else if (this.sendCalendarContentArray.length === 10) {
        this.$message.warn('最多只可添加10条内容！')
        return
      } else if (this.sendCalendarContentArray.some(it => it.type === 1) && type === 'text') {
        this.$message.warn('只能添加一条文本内容！')
        return
      }
      this.submitCalendarType = 'add'
      console.log(type, 'type')
      switch (type) {
        case 'text':
          this.contentCalendarTextModalShow = true
          break
        case 'image':
          this.chooseCalendarImage()
          break
        case 'video':
          this.chooseCalendarVideo()
          break
        case 'link':
          this.contentCalendarLinkModalShow = true
          break
        case 'library':
          this.contentCalendarLibraryModalShow = true
          break
        case 'embed':
          this.contentCalendarMiniModalShow = true
          break
      }
    },
    // 日历模式提交文字
    confirmCalendarContentText () {
      console.log('提交')
      if (!this.contentCalendarText) {
        return this.$message.warn('请输入内容！')
      }
      if (this.submitCalendarType === 'add') {
        const postInfo = {
          type: 1,
          textData: this.contentCalendarText
        }
        this.sendCalendarContentArray.push(postInfo)
      } else {
        this.sendCalendarContentArray[this.chooseCalendarEditIndex].textData = this.contentCalendarText
      }
      this.isCalendarSopEditStatus = true
      this.submitCalendarType = ''
      // 清空输入框内容,关闭弹框
      this.closeCalendarContentTextModal()
    },
    // 日历模式关闭文字弹框
    closeCalendarContentTextModal () {
      this.contentCalendarTextModalShow = false
      this.contentCalendarText = ''
      this.submitCalendarType = ''
    },
    // 日历模式选择图片
    chooseCalendarImage () {
      this.$refs.uploadCalendarPhotoRef.value = ''
      this.$nextTick(() => {
        this.$refs['uploadCalendarPhotoRef'].click()
      })
    },
    // 日历模式选择音频
    chooseCalendarVideo () {
      this.$refs.uploadCalendarVideoRef.value = ''
      this.$nextTick(() => {
        this.$refs['uploadCalendarVideoRef'].click()
      })
    },
    // 日历模式视频错误时显示
    videoCalendarLoadErr (index) {
      this.sendCalendarContentArray[index].showPoster = true
    },
    // 日历模式提交链接
    confirmCalendarContentLink () {
      console.log('提交链接')
      if (!this.contentCalendarLinkObj.linkTitle) {
        return this.$message.warn('请输入链接标题！')
      } else if (!this.contentCalendarLinkObj.linkUrl) {
        return this.$message.warn('请输入链接地址！')
      } else if (!isUrl(this.contentCalendarLinkObj.linkUrl)) {
        return this.$message.warn('请输入正确的链接地址！')
      } else if (!this.contentCalendarLinkObj.linkPhoto) {
        return this.$message.warn('请上传封面图片！')
      }
      this.$set(this.contentCalendarLinkObj, 'type', 4)
      // this.contentLinkModalShow = false
      // this.sendContentArray.push(this.contentLinkObj)
      // this.$emit('update:contentArray', this.sendContentArray)
      this.isCalendarSopEditStatus = true
      if (this.submitCalendarType === 'add') {
        this.sendCalendarContentArray.push(this.contentCalendarLinkObj)
      } else {
        this.sendCalendarContentArray.splice(this.chooseCalendarEditIndex, 1, this.contentCalendarLinkObj)
      }
      this.contentCalendarLinkModalShow = false
      this.submitCalendarType = ''
      this.uploadCalendarPhotoType = ''
      this.contentCalendarLinkObj = {}
    },
    // 日历模式关闭链接弹框
    closeCalendarLinkModal () {
      this.contentCalendarLinkModalShow = false
      this.contentCalendarLinkObj = {}
      this.submitCalendarType = ''
      this.uploadCalendarPhotoType = ''
    },
    // 日历模式提交小程序
    confirmCalendarContentMini () {
      if (!this.contentCalendarMiniObj.appId) {
        return this.$message.warn('请输入小程序appid！')
      } else if (!this.contentCalendarMiniObj.appUrl) {
        return this.$message.warn('请输入小程序页面路径！')
      } else if (!this.contentCalendarMiniObj.appShow) {
        return this.$message.warn('请输入小程序描述！')
      } else if (!this.contentCalendarMiniObj.appPhoto) {
        return this.$message.warn('请上传小程序封面图片！')
      }
      this.$set(this.contentCalendarMiniObj, 'type', 5)
      if (this.submitCalendarType === 'add') {
        this.sendCalendarContentArray.push(this.contentCalendarMiniObj)
      } else {
        this.sendCalendarContentArray.splice(this.chooseCalendarEditIndex, 1, this.contentCalendarMiniObj)
      }
      this.isCalendarSopEditStatus = true
      this.contentCalendarMiniModalShow = false
      this.submitCalendarType = ''
      this.uploadCalendarPhotoType = ''
      this.contentCalendarMiniObj = {}
    },
    // 日历模式关闭小程序弹框
    closeCalendarMiniModal () {
      this.contentCalendarMiniModalShow = false
      this.contentCalendarMiniObj = {}
      this.submitCalendarType = ''
      this.uploadCalendarPhotoType = ''
    },
    // 日历模式添加素材框确认
    handleCalendarAddLibraryOk () {
      this.dealCalendarLibraryArrayMethod()
    },
    // 日历模式素材库选择Change
    libraryCalendarSelectChange (e) {
      console.log(e, '素材库选择的对象')
      this.contentCalendarLibraryArray = e
    },
    // 日历模式处理素材库数组
    dealCalendarLibraryArrayMethod () {
      if (this.contentCalendarLibraryArray.some(it => it.type === '文件' || it.type === '音频')) {
        this.$message.warning('暂不支持文件、音频类型素材！')
        return
      }
      if ((this.sendCalendarContentArray.length + this.contentCalendarLibraryArray.length) > 10) {
        this.$message.warning('发送条数不能超过十条！')
        return
      }
      for (const item of this.contentCalendarLibraryArray) {
        if (item.type === '图片') {
          const imageInfo = {
            type: 2,
            photoUrl: item.content.imageFullPath
          }
          this.sendCalendarContentArray.push(imageInfo)
        } else if (item.type === '小程序') {
          const miniInfo = {
            type: 5,
            appId: item.content.appid,
            appUrl: item.content.page,
            appShow: item.content.maintitle,
            appPhoto: item.content.imageFullPath
          }
          this.sendContentArray.push(miniInfo)
        } else if (item.type === '图文') {
          const linkInfo = {
            type: 4,
            linkTitle: item.content.maintitle,
            linkPhoto: item.content.imageFullPath,
            linkUrl: item.content.imageLink,
            linkShow: item.content.description
          }
          this.sendCalendarContentArray.push(linkInfo)
        } else if (item.type === '视频') {
          const videoInfo = {
            type: 3,
            videoUrl: item.content.videoFullPath
          }
          this.sendCalendarContentArray.push(videoInfo)
        } else if (item.type === '文本') {
          const textInfo = {
            type: 1,
            textData: item.content.content
          }
          // 查看列表中是否存在文本
          const tempIndex = this.sendCalendarContentArray.findIndex(it => it.type === 1)
          if (tempIndex === -1) {
            // 不存在,就加一个
            this.sendCalendarContentArray.push(textInfo)
          } else {
            // 如果原文字信息的长度大于1000
            if (this.sendCalendarContentArray[tempIndex].textData.length > 1000) {
              this.$message.warn('原文字长度大于1000,无法添加')
              return
            } else {
              // 存在,就与存在的拼接在一起,并截取到1000个字
              const tempText = this.sendCalendarContentArray[tempIndex].textData + item.content.content
              this.sendCalendarContentArray[tempIndex].textData = tempText.slice(0, 1000)
            }
          }
        }
      }
      this.isCalendarSopEditStatus = true
      this.contentCalendarLibraryModalShow = false
    },
    // 日历模式移动某一个item
    async handleCalendarMoveClick (index, type) {
      if (type === 'up' && index === 0) {
        return
      } else if (type === 'down' && index === (this.sendCalendarContentArray.length - 1)) {
        return
      }
      // 先生成一个全新的数组
      const nowArray = Object.assign([], this.sendCalendarContentArray)
      // 得到全新的当前移动的对象
      // const nowItemInfo = Object.assign([],nowArray[index])
      // 先将当前选择的元素移除数组
      const delItemInfo = nowArray.splice(index, 1)[0]
      if (type === 'up') {
        nowArray.splice(index - 1, 0, delItemInfo)
      } else {
        nowArray.splice(index + 1, 0, delItemInfo)
      }
      this.isCalendarSopEditStatus = true
      this.sendCalendarContentArray = Object.assign([], nowArray)
    },
    // 日历模式编辑单个item
    handleCalendarEditClick (info, index) {
      this.chooseCalendarEditIndex = index
      this.submitCalendarType = 'edit'
      const singleType = info.type
      if (singleType === 1) {
        console.log(singleType, '编辑单个item')
        this.contentCalendarText = info.textData
        this.contentCalendarTextModalShow = true
      } else if (singleType === 4) {
        this.contentCalendarLinkObj = { ...info }
        console.log(this.contentCalendarLinkObj, '编辑链接回显')
        this.contentCalendarLinkModalShow = true
      } else if (singleType === 5) {
        this.contentCalenarMiniObj = { ...info }
        this.contentCalendarMiniModalShow = true
        console.log(this.contentCalendarLinkObj, '编辑小程序回显')
      } else if (singleType === 2) {
        this.chooseCalendarImage()
      } else if (singleType === 3) {
        this.chooseCalendarVideo()
      }
    },
    // 日历模式删除某一个item
    handleCalendarDelClick (index) {
      const that = this
      const nowD = Object.assign([], this.sendCalendarContentArray)
      this.$confirm({
        title: '确定删除所选内容?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          nowD.splice(index, 1)
          this.$message.success('删除成功')
          that.sendCalendarContentArray = Object.assign([], nowD)
          this.isCalendarSopEditStatus = true
        }
      })
    },
    // 日历模式上传图片
    async uploadCalendarPhoto (e) {
      console.log(e, '上传图片对象')
      if (e && e.target && e.target.files.length !== 0) {
        const file = e.target.files[0]
        const fileArray = file.name.split('.')
        const suffix = fileArray[fileArray.length - 1]
        if (!['jpg', 'png'].includes(suffix)) {
          return this.$message.warn('请上传 jpg, png 格式的图片文件')
        }
        if (file.size > 2 * 1000 * 1000) {
          return this.$message.warn('请上传小于2MB的图片文件')
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('time', 1)
        const res = await upLoad(formData)
        // const params = {
        //   imgUrl: res.data.fullPath,
        //   mediaName: file.name
        // }
        // console.log(params, '返回的对象')
        if (this.uploadCalendarPhotoType === 'addLinkPhoto') {
          this.$set(this.contentCalendarLinkObj, 'linkPhoto', res.data.fullPath)
          this.uploadCalendarPhotoType = ''
          return
        }
        if (this.uploadCalendarPhotoType === 'addMiniPhoto') {
          this.$set(this.contentCalendarMiniObj, 'appPhoto', res.data.fullPath)
          this.uploadCalendarPhotoType = ''
          return
        }
        const imageInfo = {
          type: 2,
          photoUrl: res.data.fullPath
        }
        if (this.submitCalendarType === 'add') {
          this.sendCalendarContentArray.push(imageInfo)
        } else {
          this.sendCalendarContentArray.splice(this.chooseCalendarEditIndex, 1, imageInfo)
        }
        this.isCalendarSopEditStatus = true
        this.submitCalendarType = ''
        this.$refs.uploadCalendarPhotoRef.value = ''
      } else {
        console.log(e)
      }
    },
    // 日历模式上传视频
    async uploadCalendarVideo (e) {
      console.log(e, '上传视频')
      // debugger
      if (e && e.target && e.target.files.length !== 0) {
        const file = e.target.files[0]
        if (file.size > 10 * 1000 * 1000) {
          return this.$message.warn('请上传小于10MB的视频文件')
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('time', 1)
        console.log(formData, 'formData')
        const res = await upLoad(formData)
        const videoInfo = {
          type: 3,
          videoUrl: res.data.fullPath
        }
        if (this.submitCalendarType === 'add') {
          this.sendCalendarContentArray.push(videoInfo)
        } else {
          this.sendCalendarContentArray.splice(this.chooseCalendarEditIndex, 1, videoInfo)
        }
        this.isCalendarSopEditStatus = true
        this.$refs.uploadCalendarVideoRef.value = ''
      } else {
        console.log(e)
      }
    },
    sendDateChange (val) {
      console.log(val, '更新时间')
      this.isSopEdit = true
    },
    // 日历模式关闭设置发送内容弹框
    closeCalendarSendContentModal () {
      this.sendCalendarContentModalShow = false
      this.addCalendarContentInfo = {}
      this.sendCalendarContentArray = []
    },
    // 日历模式添加发送内容点击确定
    confirmCalendarSendSure () {
      this.$set(this.addCalendarContentInfo, 'sendContentList', this.sendCalendarContentArray)
      console.log('点击确定添加发送内容')
      let tempIndex = ''
      if (!this.addCalendarContentInfo.sendTitle) {
        this.$message.error('请输入内容标题！')
        return
      }
      // if ((!this.addCalendarContentInfo.sendContentList) || (this.addCalendarContentInfo.sendContentList.length === 0)) {
      //   this.$message.error('每一个时间节点都至少添加一个内容才可以新增')
      //   return
      // }
      if (this.sendCalendarContentArray.length === 0) {
        this.$message.error('每一个时间节点都至少添加一个内容才可以新增')
        return
      }
      if (this.addCalendarContentInfo.tempId) {
        // 有tempId,表示为新增的元素提交
        tempIndex = this.addInfo.listTaskInfo.findIndex(item => this.addCalendarContentInfo.tempId === (item.tempId ? item.tempId : item.id))
      } else {
        // 没有tempId,表示为之前的元素提交
        tempIndex = this.addInfo.listTaskInfo.findIndex(item => this.addCalendarContentInfo.id === (item.tempId ? item.tempId : item.id))
      }
      if (tempIndex !== -1) {
        this.addInfo.listTaskInfo.splice(tempIndex, 1, this.addCalendarContentInfo)
      } else {
        this.addInfo.listTaskInfo.push(this.addCalendarContentInfo)
      }
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      this.contentArray = this.addInfo.listTaskInfo[0].sendContentList
      this.sendCalendarContentModalShow = false
      // this.selectSopItemIdx = this.addInfo.listTaskInfo[0].tempId ? this.addInfo.listTaskInfo[0].tempId : this.addInfo.listTaskInfo[0].id
      // this.contentListArray = Object.assign([], this.addInfo.listTaskInfo[0].sendContentList)
    },
    // 日历模式选择日期中的任务
    chooseTimeContent (info) {
      console.log(info, '点击日期中的任务')
      this.sendCalendarContentModalShow = true
      this.addCalendarContentInfo = Object.assign({}, info)
      this.sendCalendarContentArray = Object.assign([], this.addCalendarContentInfo.sendContentList)
    },
    sendCalendarDateChange () {},
    // 获取日历模式下任务列表
    getCalendarTaskData (value) {
      let listData = []
      if (this.addInfo && this.addInfo.listTaskInfo && (this.addInfo.listTaskInfo.length !== 0)) {
        // 格式化单条日期
        const currentValue = moment(value).format('YYYY-MM-DD')
        console.log(currentValue)
        // // 得到单条信息在时间点数组中的位置
        const tempList = this.addInfo.listTaskInfo.filter(item => moment(item.sendTime).isSame(currentValue, 'day') === true)
        // const tempTaskIndex = this.addInfo.listTaskInfo.findIndex(item => moment(item.sendTime).isSame(currentValue, 'day') === true)
        // // console.log(this.addInfo.listTaskInfo, currentValue, tempTaskIndex, '下标')
        // if (tempTaskIndex !== -1) {
        //   // 存在,就显示当前位置的发送内容
        //   listData.push(this.addInfo.listTaskInfo[tempTaskIndex])
        // } else {
        //   // 不存在,就显示空数组
        //   listData = []
        // }
        if (tempList.length !== 0) {
          console.log(tempList, 'tempList')
          listData = Object.assign([], tempList)
        } else {
          listData = []
        }
      } else {
        listData = []
      }
      // console.log(listData, 'listData')
      return listData
    },
    // 返回日历模式中的task
    returnCalendarTask (info) {
      // console.log(info, 'info')
      return moment(info.sendTime).format('HH:mm') + ' ' + info.sendTitle
    },
    // 切换日历视图/列表视图tab
    changeTabMethod (info) {
      console.log(info, 'infos')
      this.currentShowTabId = info.id
    },
    // 日历模式选择日期
    chooseDateMethod (e) {
      console.log(e, '选择日期')
      this.addCalendarContentInfo = {}
      this.sendCalendarContentModalShow = true
      const chooseCurrentDate = moment(e).format('YYYY-MM-DD')
      const tempCurrentTime = moment().format('HH:mm')
      const tempCurrentDate = chooseCurrentDate + ' ' + tempCurrentTime
      this.$set(this.addCalendarContentInfo, 'sendTime', moment(tempCurrentDate).format('YYYY-MM-DD HH:mm'))
      this.$set(this.addCalendarContentInfo, 'sendContentList', [])
      this.$set(this.addCalendarContentInfo, 'tempId', new Date().getTime())
    },
    // 监听用户输入框输入
    changeSopName (value) {
      this.isSopEdit = true
    },
    dateNumberChange () {
      this.isSopEdit = true
    },
    // 初始化方法
    async initMethod () {
      this.selectSopItemIndex = 0
      if (this.pageTypeId === -1) {
        // 新增
        this.setDefaultTime()
      } else {
        // 修改
        this.getDetail(this.pageTypeId)
      }
    },
    // 如果是新增,设置默认时间点
    setDefaultTime () {
      const tempTaskList = []
      const tempInfo = {
        tempId: new Date().getTime(),
        sendTime: moment().add(3, 'm').format('YYYY-MM-DD HH:mm'),
        sendTitle: '',
        sendContentList: []
      }
      tempTaskList.push(tempInfo)
      this.selectSopItemIdx = tempInfo.tempId
      this.$set(this.addInfo, 'listTaskInfo', tempTaskList)
    },
    // 获取详情
    async getDetail (id) {
      console.log(id, 'id')
      // this.currentTimeId = this.addInfo.listTaskInfo[0].id
      // this.selectSopItemIdx = this.addInfo.listTaskInfo[0].id
      // this.contentArray = this.addInfo.listTaskInfo[this.selectSopItemIndex].sendContentList
      this.loadingStatus = true
      const params = { id }
      await getCalendarTemplateDetailMethod(params).then(response => {
        this.loadingStatus = false
        console.log(response)
        this.addInfo = response.data
        this.contentArray = this.addInfo.listTaskInfo[this.selectSopItemIndex].sendContentList
        this.selectSopItemIdx = this.addInfo.listTaskInfo[0].id
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      // this.loadingStatus = false
    },
    // 返回时间列表字符串
    returnSopText (item) {
      console.log(item, '对当前的item进行组合处理')
      return `${moment(item.sendTime).format('YYYY-MM-DD HH:mm')}发送`
    },
    // 单击所选择的时间点
    chooseSopItem (info, index) {
      console.log(info, '单击所选择的时间点', index, '点击的下标')
      if (info.tempId) {
        // 有tempId
        this.selectSopItemIdx = info.tempId
      } else {
        this.selectSopItemIdx = info.id
      }
      // this.currentTimeId = this.selectSopItemIdx
      this.selectSopItemIndex = index
      const tempInfo = this.addInfo.listTaskInfo.find(item => (item.tempId ? item.tempId === this.selectSopItemIdx : item.id === this.selectSopItemIdx))
      console.log(tempInfo, 'tempInfo切换时间回调')
      this.contentArray = tempInfo.sendContentList
    },
    addSop () {
      if (!this.addInfo.listTaskInfo.every(item => item.sendContentList && item.sendContentList.length > 0)) {
        this.$message.error('每一个时间节点都至少添加一个内容才可以新增')
        return
      }
      this.isSopEdit = true
      // 获取最后一条的时间
      const previousTime = this.addInfo.listTaskInfo[this.addInfo.listTaskInfo.length - 1].sendTime
      // 将最后一条的时间格式化
      const previoutTimeFormat = moment(previousTime).format('YYYY-MM-DD HH:mm')
      // 获取当前的时间
      const currentTimeFormat = moment().format('YYYY-MM-DD HH:mm')
      const tempAddInfo = {
        sort: this.addInfo.listTaskInfo.length + 1,
        tempId: new Date().getTime(),
        sendTime: (previoutTimeFormat === currentTimeFormat) ? moment(previousTime).add(1, 'm').format('YYYY-MM-DD HH:mm') : moment(currentTimeFormat).add(3, 'm').format('YYYY-MM-DD HH:mm'),
        sendContentList: []
      }
      this.addInfo.listTaskInfo.push(tempAddInfo)
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      console.log(this.addInfo, '新增时间点后的对象')
      this.chooseSopItem(tempAddInfo, this.addInfo.listTaskInfo.length - 1)
    },
    // 删除时间节点
    delSopItem (index, info) {
      console.log(index, '删除的下标', info, '删除的info')
      const that = this
      const nowSopList = Object.assign([], this.addInfo.listTaskInfo)
      this.$confirm({
        title: '确定删除此时间?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          this.isSopEdit = true
          // 当前选中的内容
          const selectItem = nowSopList[this.selectSopItemIndex]
          let selectId = ''
          if (selectItem.tempId) {
            // 当前选中内容有tempId
            selectId = nowSopList[this.selectSopItemIndex].tempId
          } else {
            // 当前选中的id
            selectId = nowSopList[this.selectSopItemIndex].id
          }

          nowSopList.splice(index, 1)
          this.$message.success('删除成功')
          // console.log(this.selectSopItemIdx, index, '比较')
          // 删除的为后加的元素
          if (info.tempId) {
            // 删除的为选中的元素
            if (that.selectSopItemIdx === info.tempId) {
              // 取第一个元素的id
              that.selectSopItemIdx = nowSopList[0].tempId ? nowSopList[0].tempId : nowSopList[0].id
              that.selectSopItemIndex = 0
            } else {
              const selectIndex = nowSopList.findIndex(item => (item.tempId ? item.tempId === selectId : item.id === selectId))
              console.log('删除后加的元素')
              // debugger
              that.selectSopItemIndex = selectIndex
              that.selectSopItemIdx = nowSopList[selectIndex].tempId ? nowSopList[selectIndex].tempId : nowSopList[selectIndex].id
            }
          } else {
            // 删除之前的元素
            // 删除的为选中的元素
            if (that.selectSopItemIdx === info.id) {
              // 取第一个元素的id
              that.selectSopItemIdx = nowSopList[0].tempId ? nowSopList[0].tempId : nowSopList[0].id
              that.selectSopItemIndex = 0
            } else {
              const selectIndex = nowSopList.findIndex(item => (item.tempId ? item.tempId === selectId : item.id === selectId))
              console.log('删除之前的元素')
              // debugger
              that.selectSopItemIndex = selectIndex
              that.selectSopItemIdx = nowSopList[selectIndex].tempId ? nowSopList[selectIndex].tempId : nowSopList[selectIndex].id
            }
          }
          this.$set(this.addInfo, 'listTaskInfo', nowSopList)
        }
      })
    },
    // 开始执行
    sendSop () {
      if (!(this.addInfo.sopName && this.addInfo.sopName.trim())) {
        this.$message.error('请输入SOP名称！')
        return
      }
      if (this.addInfo.listTaskInfo && this.addInfo.listTaskInfo.length != 0) {
        for (const singleTimeInfo of this.addInfo.listTaskInfo) {
          if (singleTimeInfo.sendContentList.length === 0) {
            this.$message.error('每项任务都至少添加一项发送内容才可以执行！')
            return
          }
        }
      } else {
        this.$message.error('请选择时间点')
        return
      }
      // debugger
      // console.log(this.addInfo, 'this.addInfo')
      this.loadingStatus = true
      if (this.pageType === 'add' || this.pageType === 'copy') {
        console.log('新增操作', this.addInfo)
        this.newDataMethod(this.addInfo)
      } else {
        console.log('修改操作', this.addInfo)
        this.updataMethod(this.addInfo)
      }
    },
    // 新增操作
    newDataMethod (info) {
      console.log(info, '新增操作')
      addCalendarTemplateMethod(info).then(response => {
        this.loadingStatus = false
        console.log(response, '新增操作')
        if (response.code === 200) {
          this.isSopEdit = false
          this.$message.success('新增成功')
          this.$router.go(-1)
        }
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
    },
    // 修改操作
    updataMethod (info) {
      console.log(info, '修改操作')
      editCalendarTemplateMethod(info).then(response => {
        this.loadingStatus = false
        console.log(response, '修改操作')
        if (response.code === 200) {
          this.isSopEdit = false
          this.$message.success('修改成功')
          this.$router.go(-1)
        }
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
    }
  }
}
</script>
  <style lang='less' scoped>
  ul, li {
    padding: 0;
    margin: 0;
  }
   .contentLinkModal {
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
      // .ant-modal-body {
      //   display: flex;
      //   justify-content: space-between;
      //   align-items: flex-start;
      //   position: relative;
      //   .tip {
      //     margin: 0;
      //     .click {
      //       color: #4074f6;
      //       cursor: pointer;
      //     }
      //   }
      //   .top {
      //     position: absolute;
      //     top: 0;
      //   }
      //   .formBox {
      //     width: 65%;
      //     .line {
      //       position: relative;
      //       margin-bottom: 10px;
      //       .ant-input {
      //         height: 35px;
      //         padding-right: 60px;
      //       }
      //       .len {
      //         position: absolute;
      //         right: 5px;
      //         top: 8px;
      //       }
      //     }
      //     .textarea {
      //       .ant-input {
      //         min-height: 100px;
      //       }
      //       .len {
      //         bottom: 0;
      //         transform: translate(0, 100%);
      //       }
      //     }
      //   }
      //   .pic {
      //     flex: 1;
      //     margin-left: 20px;
      //     display: flex;
      //     flex-direction: column;
      //     align-items: center;
      //     .image {
      //       width: 170px;
      //       height: 170px;
      //       border-radius: 5px;
      //       overflow: hidden;
      //       cursor: pointer;
      //     }
      //     .addPic {
      //       border: 1px dashed #d1d1d1;
      //       display: flex;
      //       align-items: center;
      //       justify-content: center;
      //       font-size: 50px;
      //       font-weight: 100;
      //       color: #878787;
      //     }
      //     .photoTip {
      //       margin-top: 5px;
      //     }
      //     .file {
      //       position: fixed;
      //       left: 100000px;
      //       top: 100000px;
      //       opacity: 0;
      //       width: 1px;
      //       height: 1px;
      //     }
      //   }
      // }
    }
    .contentTextModal {
      .ant-modal-body {
        padding-top: 0;
        .ant-input {
          min-height: 100px;
        }
        .len {
          display: block;
          text-align: end;
        }
      }
    }
  /deep/.ant-fullcalendar-header {
    padding: 11px 16px;
    text-align: left;
  }
  /deep/.ant-radio-button-wrapper {
    display: none;
  }
.chooseUsersContainer {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  .line {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .label {
      width: 100px;
      text-align: right;
      margin-right: 10px;
    }
    .input {
      width: 300px;
      position: relative;
      .ant-input {
        width: 100%;
        padding: 4px 45px 4px 11px;
        background-color: transparent;
      }
      .len {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }
  .execution {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4074f6;
    color: #fff;
    width: 120px;
    height: 50px;
    cursor: pointer;
  }
}
.sendSOPInfoContainer {
      background-color: white;
      width: 100%;
      margin-top: 10px;
      display: flex;
      height: 100%;
      .sendSOPList {
        border-radius: 5px;
        padding: 20px;
        width: 300px;
        height: auto;
        // height: 460px;
        background-color: #fff;
        overflow-y: auto;
        .sopItem {
          height: 35px;
          width: 100%;
          display: flex;
          align-items: center;
          text-indent: 15px;
          cursor: pointer;
          border-radius: 5px;
          position: relative;
          .del {
            display: none;
            width: 35px;
            height: 35px;
            font-size: 16px;
            position: absolute;
            right: 0;
            top: 50%;
            align-items: center;
            justify-content: center;
            transform: translate(0, -50%);
          }
        }
        .sopItem:hover {
          .del {
            display: flex;
          }
        }
        .active {
          background: #eef2fc;
          color: #4074f6;
        }
        .addSop {
          margin-bottom: 20px;
          width: 100%;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          border: 1px dashed #8a8a8a;
          cursor: pointer;
        }
      }
      .sendItemContent {
        margin-left: 10px;
        flex: 1;
        height: 100%;
        position: relative;
        .tabWrapperDiv {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          .singleTabDiv {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 20px;
            font-size: 14px;
            background-color: rgba(242, 242, 242, 1);
            color: black;
            border-radius: 4px;
          }
          .activeTabDiv {
            background-color: #4074f6;
            color: white;
          }
        }
        .calendarDivWrapper {
          .events {
            width: 100%;
            .singleDiv {
              width: calc(100% - 8px);
              position: relative;
              padding: 2px 10px 2px 4px;
              border-bottom: 1px solid #d8d8d8;
              margin-top: 2px;
              font-size: 12px;
              display: flex;
              align-items: center;
              &::nth-child(1) {
                margin-top: 0px;
              }
              // .singleContentTaskDiv::before {
              //   content: '';
              //   display: block;
              //   width: 4px;
              //   height: 4px;
              //   border-radius: 4px;
              //   background-color: black;
              // }
              .delDiv{
                width: 10px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                visibility: hidden;
                position: absolute;
                right: 0;
                top: 0;
              }
              &:hover {
                background-color: white;
                .delDiv {
                  visibility: visible;
                }
              }
            }
            .singleDiv::before {
              content: '';
              display: block;
              width: 5px;
              height: 5px;
              border-radius: 5px;
              margin-right: 2px;
              background-color: black;
            }
          }
        }
        .chooseSendDate {
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          .til {
            font-weight: 600;
            margin-bottom: 10px;
          }
          .chooseDateBox1 {
            .chooseDateBoxRadio {
              display: flex;
              flex-direction: column;
              .line-wrapper {
                margin-bottom: 10px;
                .ant-time-picker {
                  width: 120px;
                }
              }
            }
          }
          .chooseDateBox2 {
            display: flex;
            align-items: center;
          }
        }

      }
}
.sendCalendarSOPInfoContainer {
    width: 100%;
    margin-top: 10px;
    display: flex;
    .sendSOPList {
      border-radius: 5px;
      padding: 20px;
      width: 300px;
      height: 460px;
      background-color: #fff;
      overflow-y: auto;
      .sopItem {
        height: 35px;
        width: 100%;
        display: flex;
        align-items: center;
        text-indent: 15px;
        cursor: pointer;
        border-radius: 5px;
        position: relative;
        .del {
          display: none;
          width: 35px;
          height: 35px;
          font-size: 16px;
          position: absolute;
          right: 0;
          top: 50%;
          align-items: center;
          justify-content: center;
          transform: translate(0, -50%);
        }
      }
      .sopItem:hover {
        .del {
          display: flex;
        }
      }
      .active {
        background: #eef2fc;
        color: #4074f6;
      }
      .addSop {
        margin-bottom: 20px;
        width: 100%;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
        border: 1px dashed #8a8a8a;
        cursor: pointer;
      }
    }
    .sendContent {
        margin-top: 10px;
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        width: 100%;
        min-height: 350px;
        .tilBar {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid #cdcdcd;
          .til {
            font-weight: 600;
          }
          .handleBox {
            width: auto;
            display: flex;
            position: relative;
            .handleBtn {
              margin-left: 5px;
              border-radius: 3px;
              padding: 5px 15px;
              border: 1px solid #a9a9a9;
              cursor: pointer;
              color: rgb(28, 28, 28);
            }
            .handleBtn:first-child {
              margin-left: 0;
            }
            .disabled {
              opacity: 0.5;
              cursor: no-drop;
            }
          }
        }
        .contentBox {
          width: 100%;
          display: flex;
          flex-direction: column;
          .contentItem {
            display: flex;
            padding: 5px;
            width: 100%;
            align-items: center;
            border-radius: 5px;

            .idx {
              width: 25px;
              height: 25px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              background: #eef2fc;
              color: #4074f6;
            }
            .content {
              max-width: 750px;
              margin-left: 10px;
            }
            .text {
              word-wrap: break-word;
              padding: 5px 0;
            }
            .image,
            .video {
              img,
              video {
                max-height: 300px;
                max-width: 100%;
              }
            }
            .video {
              position: relative;
              .poster {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.1);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .link {
              width: 250px;
              height: 80px;
              border: 1px solid #cdcdcd;
              border-radius: 5px;
              flex: none;
              padding: 10px;
              display: flex;
              .lef {
                width: 160px;
                margin-right: 10px;
                font-size: 13px;
                .til {
                  width: 100%;
                  color: #4074f6;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                  display: inline-block;
                }
                .desc {
                  width: 100%;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                }
              }
              .image {
                flex: 1;
                height: 100%;
                max-width: 58px;
              }
            }
            .embed {
              width: 230px;
              border: 1px solid #cdcdcd;
              flex: none;
              display: flex;
              flex-direction: column;
              padding: 8px 10px;
              .line {
                width: 100%;
                display: flex;
                align-items: center;
                .icon {
                  width: 17px;
                  height: 17px;
                }
                .til {
                  color: #4074f6;
                }
              }
              .desc {
                font-size: 13px;
                margin-top: 3px;
              }
              .image {
                height: 180px;
                margin: 3px 0;
              }
            }
            .handlesBox {
              display: none;
              // display: flex;
              margin: auto;
              margin-right: 30px;
              .icon {
                width: 30px;
                height: 30px;
                margin-left: 10px;
                cursor: pointer;
              }
              .move {
                width: 35px;
                height: 35px;
              }
              .disabled {
                cursor: no-drop;
              }
            }
          }
          .contentItem:hover {
            background-color: #2a66ff1f;
            .handlesBox {
              display: flex;
            }
          }
        }
      }
    .sendItemContent {
      margin-left: 10px;
      flex: 1;
      height: 100%;
      .chooseSendDate {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        .til {
          font-weight: 600;
          margin-bottom: 10px;
        }
        .chooseDateBox1 {
          .chooseDateBoxRadio {
            display: flex;
            flex-direction: column;
            .line-wrapper {
              margin-bottom: 10px;
              .ant-time-picker {
                width: 120px;
              }
            }
          }
        }
        .chooseDateBox2 {
          display: flex;
          align-items: center;
        }
      }
    }
  }
.uploadFileInp {
  position: fixed;
  left: -100000px;
  top: -100000px;
  opacity: 0;
  width: 1px;
  height: 1px;
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
  <!-- <style lang='less' scoped>
  @import './addSop.less';
  </style> -->
