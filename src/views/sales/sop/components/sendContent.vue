<template>
  <div id="send_content_container" ref="send_content_container">
    <div class="sendSOPInfoContainer">
      <div class="sendContent">
        <div class="tilBar">
          <span class="til">
            <span style="color: red;font-weight: 500;">*</span>发送内容
          </span>
          <div class="handleBox">
            <div
              v-for="(item, index) in handleBtnArr"
              :class="((sendContentArray.length === 10 || (sendContentArray.findIndex(it => (it.type === 1 && item.type === 'text')) != -1)) || isDisableEdit === true)?
                'handleBtn disabled' :
                'handleBtn'"
              :key="index"
              @click="chooseSendType(item.type)"
            >+ {{ item.name }}</div>
            <div
              class="disabledBox"
              v-if="isDisableEdit === true"
              @click="$message.warn('执行后不可修改！')"
            ></div>
          </div>
        </div>
        <div class="contentBox">
          <div
            class="contentItem"
            v-for="(item, index) in sendContentArray"
            :key="index"
          >
            <div class="idx">{{ index + 1 }}</div>
            <div :class="`content ${item.type === 1 ? 'text' : ''}`" v-if="item.type === 1">{{ item.textData }}</div>
            <div :class="`content ${item.type === 2 ? 'image': ''}`" v-else-if="item.type === 2">
              <img :src="item.photoUrl" alt />
            </div>
            <div :class="`content ${item.type === 3 ? 'video' : ''}`" v-else-if="item.type === 3">
              <div class="poster" v-if="item.showPoster">{{ returnErrorText(item.videoUrl) }}</div>
              <video :src="item.videoUrl" @error="videoLoadErr(index)" alt />
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
                <img src="../images/miniProgramIcon.svg" alt class="icon" />
                <span class="til">{{ '小程序标题' }}</span>
              </div>
              <div class="line desc">{{ item.appShow }}</div>
              <img :src="item.appPhoto" alt class="image" />
              <div class="line">
                <img src="../images/miniProgramIcon.svg" alt class="icon" />
                <span class="say">小程序</span>
              </div>
            </div>
            <div class="handlesBox" v-if="sendContentArray && sendContentArray[selectSopItemIdx] && isDisableEdit === false">
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
                :class="(sendContentArray.length - 1 === index) ? 'icon move disabled' : 'icon move'"
                @click="handleMoveClick(index, 'down')"
              />
              <img
                src="../images/edit.svg"
                alt
                class="icon"
                @click="handleEditClick(item, index)"
              />
              <img src="../images/del.svg" alt class="icon" @click="handleDelClick(index)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <input
      type="file"
      accept="image/jpeg, image/png"
      ref="uploadPhotoRef"
      @change="uploadPhoto"
      class="uploadFileInp"
    />
    <input
      type="file"
      accept="video/*"
      ref="uploadVideoRef"
      @change="uploadVideo"
      class="uploadFileInp"
    />
    <a-modal
      title="添加文本"
      :maskClosable="false"
      :width="600"
      :visible="contentTextModalShow"
      @cancel="closeContentTextModal()"
      :getContainer="() => $refs['send_content_container']"
    >
      <div class="contentTextModal">
        <a-textarea v-model="contentText" autoSize placeholder="请输入内容" />
        <span class="len">{{ contentText.length ? contentText.length : '0' }}/1000</span>
      </div>
      <template slot="footer">
        <a-button @click="closeContentTextModal()">取消</a-button>
        <a-button type="primary" @click="confirmContentText">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="新增链接"
      :maskClosable="false"
      :width="600"
      :visible="contentLinkModalShow"
      @cancel="closeLinkModal()"
      :getContainer="() => $refs['send_content_container']"
    >
      <div class="contentLinkModal">
        <div class="formBox">
          <div class="line">
            <a-input v-model="contentLinkObj.linkTitle" placeholder="请输入链接标题（必填）" />
            <span class="len">{{ (contentLinkObj.linkTitle && contentLinkObj.linkTitle.length) ? contentLinkObj.linkTitle.length : '0' }}/200</span>
          </div>
          <div class="line">
            <a-input v-model="contentLinkObj.linkUrl" placeholder="输入http或https开头的链接地址（必填）" />
            <span class="len">{{ (contentLinkObj.linkUrl && contentLinkObj.linkUrl.length) ? contentLinkObj.linkUrl.length : '0' }}/500</span>
          </div>
          <div class="line textarea">
            <a-textarea v-model="contentLinkObj.linkShow" autoSize placeholder="请输入内容简介（选填）" />
            <span class="len">{{ (contentLinkObj.linkShow && contentLinkObj.linkShow.length) ? contentLinkObj.linkShow.length : '0' }}/170</span>
          </div>
        </div>
        <div class="pic">
          <div
            class="addPic image"
            v-if="!contentLinkObj.linkPhoto"
            @click="openSelectPhoto('addLinkPhoto')"
          >+</div>
          <img
            class="image"
            v-else
            :src="contentLinkObj.linkPhoto"
            @click="openSelectPhoto('addLinkPhoto')"
          />
          <span class="tip">图片限制在2MB以内</span>
        </div>
      </div>
      <template slot="footer">
        <a-button
          @click="closeLinkModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmContentLink">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="新增小程序"
      :maskClosable="false"
      :width="600"
      :visible="contentMiniModalShow"
      @cancel="closeMiniModal()"
      :getContainer="() => $refs['send_content_container']"
    >
      <p class="tip top">
        请填写企业微信后台绑定的小程序，否则会造成发送失败
        <!-- <a
            class="click"
            href="https://www.yuque.com/docs/share/9def95f9-bce5-4c66-b800-9f3cbef4fe50"
            target="_blank"
          >查看如何绑定</a> -->
      </p>
      <div class="contentLinkModal">
        <div class="formBox">
          <div class="line">
            <a-input v-model="contentMiniObj.appId" placeholder="输入小程序APPID（必填）" />
            <span class="len">{{ contentMiniObj.appId && contentMiniObj.appId.length ? contentMiniObj.appId.length :'0' }}/200</span>
            <p class="tip">
              <!-- <a
                class="click"
                href="https://www.yuque.com/docs/share/6b55b4d7-7e59-4a0a-bdd6-fb4dd0d2f2e5"
                target="_blank"
              >如何获取APPID</a> -->
            </p>
          </div>
          <div class="line">
            <a-input v-model="contentMiniObj.appUrl" placeholder="输入小程序页面路径（必填）" />
            <span class="len">{{ contentMiniObj.appUrl && contentMiniObj.appUrl ? contentMiniObj.appUrl.length :'0' }}/500</span>
            <p class="tip">
              <!-- <a
                class="click"
                href="https://www.yuque.com/docs/share/dd225b88-7778-463e-82a2-37bff08e1119"
                target="_blank"
              >如何获取小程序路径</a> -->
            </p>
          </div>
          <div class="line textarea">
            <a-textarea v-model="contentMiniObj.appShow" autoSize placeholder="输入小程序的描述（必填）" />
            <span class="len">{{ contentMiniObj.appShow && contentMiniObj.appShow.length ? contentMiniObj.appShow.length :'0' }}/170</span>
          </div>
        </div>
        <div class="pic">
          <div
            class="addPic image"
            v-if="!contentMiniObj.appPhoto"
            @click="openSelectPhoto('addMiniPhoto')"
          >+</div>
          <img
            class="image"
            v-else
            :src="contentMiniObj.appPhoto"
            @click="openSelectPhoto('addMiniPhoto')"
          />
          <span class="photoTip">图片限制在2MB以内</span>
        </div>
      </div>
      <template slot="footer">
        <a-button
          @click="closeMiniModal()"
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
    <!-- 雷达选择toast -->
    <RadarChoose v-model="radarVisible" @handleAddRadarOk="handleAddRadarOk" />
  </div>
</template>
<script>
// transformTaskItemEntry, transformTaskDate,
import { handleBtnArr, isUrl } from '../sopUtils'
// import { deepClonev2 } from '@/utils/util'
// import { userSopTaskItemSettingReq } from '@/api/salesManagement'
import { upLoad } from '@/api/common'
import RadarChoose from '../../../clientFollow/components/radarToastComponent.vue'
export default {
  name: 'SendContent',
  data () {
    return {
      radarVisible: false, // 互动雷达弹框
      isSopEditStatus: false,
      chooseEditIndex: '', // 当前选择编辑的下标
      submitType: '', // 提交状态,新增与修改
      selectSopItemIdx: 0,
      sendContentArray: [],
      // 链接/小程序上传类型
      uploadPhotoType: '',
      handleBtnArr,
      // 添加文字弹框
      contentTextModalShow: false,
      contentText: '',
      // 添加链接弹框
      contentLinkModalShow: false,
      // 新增链接对象
      contentLinkObj: {},
      // 添加小程序弹框
      contentMiniModalShow: false,
      // 新增小程序对象
      contentMiniObj: {},
      // 素材库选择数组
      contentLibraryArray: [],
      // 添加素材库弹框
      contentLibraryModalShow: false
    }
  },
  components: {
    RadarChoose,
    'MediumGroup': () => import('@/views/mediumGroup/index.vue')
  },
  props: {
    isDisableEdit: {
      type: Boolean,
      default: false
    },
    isSopEdit: {
      type: Boolean,
      default: false
    },
    contentArray: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    contentText (e) {
      if (e && e.length > 1000) {
        this.contentText = e.slice(0, 1000)
      }
    },
    // 内容区是否被禁用
    isDisableEdit () {
      console.log(this.isDisableEdit, '内容区域是否可编辑')
    },
    // 内容区是否被编辑
    isSopEdit () {
      this.isSopEditStatus = this.isSopEdit
    },
    'contentLinkObj.linkTitle' (e) {
      if (e && e.length > 200) {
        this.contentLinkObj.linkTitle = e.slice(0, 200)
      }
    },
    'contentLinkObj.linkUrl' (e) {
      if (e && e.length > 500) {
        this.contentLinkObj.linkUrl = e.slice(0, 500)
      }
    },
    'contentLinkObj.linkShow' (e) {
      if (e && e.length > 170) {
        this.contentLinkObj.linkShow = e.slice(0, 170)
      }
    },
    'contentMiniObj.appId' (e) {
      if (e && e.length > 200) {
        this.contentMiniObj.appId = e.slice(0, 200)
      }
    },
    'contentMiniObj.appUrl' (e) {
      if (e && e.length > 500) {
        this.contentMiniObj.appUrl = e.slice(0, 500)
      }
    },
    'contentMiniObj.appShow' (e) {
      if (e && e.length > 170) {
        this.contentMiniObj.appShow = e.slice(0, 170)
      }
    },
    contentArray: {
      deep: true,
      handler (newValue) {
        console.log(newValue, '列表模式子组件contentArray数组')
        this.sendContentArray = Object.assign([], newValue)
      }
    }
  },
  methods: {
    // 选择互动雷达回调
    handleAddRadarOk (e) {
      console.log(e, '选择互动雷达回调')
      if ((this.sendContentArray.length + e.length) > 10) {
        this.$message.warning('发送条数不能超过十条！')
        return
      }
      this.isSopEditStatus = true
      for (const item of e) {
        const singleInfo = { type: 4 }
        singleInfo.linkTitle = item.entry.linkTitle
        singleInfo.linkUrl = item.link
        singleInfo.linkPhoto = item.entry.linkImg
        singleInfo.desc = item.entry.linkDigest
        singleInfo.radarLink = '1'
        singleInfo.radarName = item.channelTxt
        this.sendContentArray.push(singleInfo)
        // title: content.linkTitle,
        // url: target.link,
        // pic: { url: content.linkImg, path: content.linkImgPath || content.linkImg.slice(43, content.linkImg.indexOf('?')) },
        // desc: content.linkDigest,
        // radarLink: '1',
        // radarName: target.channelTxt
      }
      this.radarVisible = false
      this.$emit('update:isSopEdit', this.isSopEditStatus)
      this.$emit('update:contentArray', this.sendContentArray)
    },
    returnErrorText (url) {
      return '暂不支持显示 .avi 格式的视频'
    },
    // 链接或小程序上传图片
    openSelectPhoto (type) {
      this.$refs.uploadPhotoRef.value = ''
      console.log(type, 'type')
      this.uploadPhotoType = type
      this.$nextTick(() => {
        this.$refs['uploadPhotoRef'].click()
      })
    },
    // 点击不同的标签,添加不同的内容
    chooseSendType (type) {
      if (this.isDisableEdit) {
        return
      } else if (this.sendContentArray.length === 10) {
        this.$message.warn('最多只可添加10条内容！')
        return
      } else if (this.sendContentArray.some(it => it.type === 1) && type === 'text') {
        this.$message.warn('只能添加一条文本内容！')
        return
      }
      // console.log(this.sendContentArray, 'sendContentArray')
      // console.log(this.sendContentArray.some(it => it.type === 1))
      // debugger
      this.submitType = 'add'
      console.log(type, 'type')
      switch (type) {
        case 'text':
          this.contentTextModalShow = true
          break
        case 'image':
          this.chooseImage()
          break
        case 'video':
          this.chooseVideo()
          break
        case 'link':
          this.contentLinkModalShow = true
          break
        case 'library':
          this.contentLibraryModalShow = true
          break
        case 'embed':
          this.contentMiniModalShow = true
          break
        case 'radar':
          this.radarVisible = true
          break
      }
    },
    // 提交文字
    confirmContentText () {
      console.log('提交')
      if (!this.contentText) {
        return this.$message.warn('请输入内容！')
      }
      if (this.submitType === 'add') {
        const postInfo = {
          type: 1,
          textData: this.contentText
        }
        this.sendContentArray.push(postInfo)
      } else {
        this.sendContentArray[this.chooseEditIndex].textData = this.contentText
      }
      this.isSopEditStatus = true
      this.$emit('update:isSopEdit', this.isSopEditStatus)
      this.$emit('update:contentArray', this.sendContentArray)
      this.submitType = ''
      // 清空输入框内容,关闭弹框
      this.closeContentTextModal()
    },
    // 关闭文字弹框
    closeContentTextModal () {
      this.contentTextModalShow = false
      this.contentText = ''
      this.submitType = ''
    },
    // 选择图片
    chooseImage () {
      this.$refs.uploadPhotoRef.value = ''
      this.$nextTick(() => {
        this.$refs['uploadPhotoRef'].click()
      })
    },
    // 选择音频
    chooseVideo () {
      this.$refs.uploadVideoRef.value = ''
      // this.$refs['uploadVideo'].click()
      this.$nextTick(() => {
        this.$refs['uploadVideoRef'].click()
      })
    },
    // 视频错误时显示
    videoLoadErr (index) {
      this.sendContentArray[index].showPoster = true
      this.$emit('update:contentArray', this.sendContentArray)
    },
    // 关闭弹框
    closeContentModal () {
      console.log('关闭弹框')
    },
    // 提交链接
    confirmContentLink () {
      console.log('提交链接')
      if (!this.contentLinkObj.linkTitle) {
        return this.$message.warn('请输入链接标题！')
      } else if (!this.contentLinkObj.linkUrl) {
        return this.$message.warn('请输入链接地址！')
      } else if (!isUrl(this.contentLinkObj.linkUrl)) {
        return this.$message.warn('请输入正确的链接地址！')
      } else if (!this.contentLinkObj.linkPhoto) {
        return this.$message.warn('请上传封面图片！')
      }
      this.$set(this.contentLinkObj, 'type', 4)
      // this.contentLinkModalShow = false
      // this.sendContentArray.push(this.contentLinkObj)
      // this.$emit('update:contentArray', this.sendContentArray)
      this.isSopEditStatus = true
      this.$emit('update:isSopEdit', this.isSopEditStatus)
      if (this.submitType === 'add') {
        this.sendContentArray.push(this.contentLinkObj)
      } else {
        this.sendContentArray.splice(this.chooseEditIndex, 1, this.contentLinkObj)
      }
      this.contentLinkModalShow = false
      this.submitType = ''
      this.uploadPhotoType = ''
      this.$emit('update:contentArray', this.sendContentArray)
      this.contentLinkObj = {}
    },
    // 关闭链接弹框
    closeLinkModal () {
      this.contentLinkModalShow = false
      this.contentLinkObj = {}
      this.submitType = ''
      this.uploadPhotoType = ''
    },
    // 提交小程序
    confirmContentMini () {
      if (!this.contentMiniObj.appId) {
        return this.$message.warn('请输入小程序appid！')
      } else if (!this.contentMiniObj.appUrl) {
        return this.$message.warn('请输入小程序页面路径！')
      } else if (!this.contentMiniObj.appShow) {
        return this.$message.warn('请输入小程序描述！')
      } else if (!this.contentMiniObj.appPhoto) {
        return this.$message.warn('请上传小程序封面图片！')
      }
      this.$set(this.contentMiniObj, 'type', 5)
      if (this.submitType === 'add') {
        this.sendContentArray.push(this.contentMiniObj)
      } else {
        this.sendContentArray.splice(this.chooseEditIndex, 1, this.contentMiniObj)
      }
      this.isSopEditStatus = true
      this.$emit('update:isSopEdit', this.isSopEditStatus)
      this.contentMiniModalShow = false
      this.submitType = ''
      this.uploadPhotoType = ''
      this.$emit('update:contentArray', this.sendContentArray)
      this.contentMiniObj = {}
    },
    // 关闭小程序弹框
    closeMiniModal () {
      this.contentMiniModalShow = false
      this.contentMiniObj = {}
      this.submitType = ''
      this.uploadPhotoType = ''
    },
    // 添加素材框确认
    handleAddLibraryOk () {
      this.dealLibraryArrayMethod()
    },
    // 素材库选择Change
    librarySelectChange (e) {
      console.log(e, '素材库选择的对象')
      this.contentLibraryArray = e
    },
    // 处理素材库数组
    dealLibraryArrayMethod () {
      if (this.contentLibraryArray.some(it => it.type === '文件' || it.type === '音频')) {
        this.$message.warning('暂不支持文件、音频类型素材！')
        return
      }
      if ((this.sendContentArray.length + this.contentLibraryArray.length) > 10) {
        this.$message.warning('发送条数不能超过十条！')
        return
      }
      for (const item of this.contentLibraryArray) {
        if (item.type === '图片') {
          const imageInfo = {
            type: 2,
            photoUrl: item.content.imageFullPath
          }
          this.sendContentArray.push(imageInfo)
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
          this.sendContentArray.push(linkInfo)
        } else if (item.type === '视频') {
          const videoInfo = {
            type: 3,
            videoUrl: item.content.videoFullPath
          }
          this.sendContentArray.push(videoInfo)
        } else if (item.type === '文本') {
          const textInfo = {
            type: 1,
            textData: item.content.content
          }
          // 查看列表中是否存在文本
          const tempIndex = this.sendContentArray.findIndex(it => it.type === 1)
          if (tempIndex === -1) {
            // 不存在,就加一个
            this.sendContentArray.push(textInfo)
          } else {
            // 如果原文字信息的长度大于1000
            if (this.sendContentArray[tempIndex].textData.length > 1000) {
              this.$message.warn('原文字长度大于1000,无法添加')
              return
            } else {
              // 存在,就与存在的拼接在一起,并截取到1000个字
              const tempText = this.sendContentArray[tempIndex].textData + item.content.content
              this.sendContentArray[tempIndex].textData = tempText.slice(0, 1000)
            }
          }
        }
      }
      this.isSopEditStatus = true
      this.$emit('update:isSopEdit', this.isSopEditStatus)
      this.contentLibraryModalShow = false
      this.$emit('update:contentArray', this.sendContentArray)
    },
    // 移动某一个item
    async handleMoveClick (index, type) {
      if (type === 'up' && index === 0) {
        return
      } else if (type === 'down' && index === (this.sendContentArray.length - 1)) {
        return
      }
      // 先生成一个全新的数组
      const nowArray = Object.assign([], this.sendContentArray)
      // 得到全新的当前移动的对象
      // const nowItemInfo = Object.assign([],nowArray[index])
      // 先将当前选择的元素移除数组
      const delItemInfo = nowArray.splice(index, 1)[0]
      if (type === 'up') {
        nowArray.splice(index - 1, 0, delItemInfo)
      } else {
        nowArray.splice(index + 1, 0, delItemInfo)
      }
      this.isSopEditStatus = true
      this.$emit('update:isSopEdit', this.isSopEditStatus)
      this.sendContentArray = Object.assign([], nowArray)
      this.$emit('update:contentArray', this.sendContentArray)
    },
    // 编辑单个item
    handleEditClick (info, index) {
      this.chooseEditIndex = index
      this.submitType = 'edit'
      const singleType = info.type
      if (singleType === 1) {
        console.log(singleType, '编辑单个item')
        this.contentText = info.textData
        this.contentTextModalShow = true
      } else if (singleType === 4) {
        this.contentLinkObj = { ...info }
        console.log(this.contentLinkObj, '编辑链接回显')
        this.contentLinkModalShow = true
      } else if (singleType === 5) {
        this.contentMiniObj = { ...info }
        this.contentMiniModalShow = true
        console.log(this.contentLinkObj, '编辑小程序回显')
      } else if (singleType === 2) {
        this.chooseImage()
      } else if (singleType === 3) {
        this.chooseVideo()
      }
      // this.isEditingItem = true
      // this.editIdx = index
      // if (type === 'text') {
      //   this.contentText = value
      // } else if (type === 'link') {
      //   this.contentLinkObj = { ...value }
      // } else if (type === 'embed') {
      //   this.contentMiniObj = { ...value }
      // }
      // this.chooseSendType(type, true)
    },
    // 删除某一个item
    handleDelClick (index) {
      const that = this
      const nowD = Object.assign([], this.sendContentArray)
      this.$confirm({
        title: '确定删除所选内容?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          nowD.splice(index, 1)
          this.$message.success('删除成功')
          that.sendContentArray = Object.assign([], nowD)
          that.$emit('update:contentArray', this.sendContentArray)
          this.isSopEditStatus = true
          this.$emit('update:isSopEdit', this.isSopEditStatus)
        }
      })
    },
    // 上传图片
    async uploadPhoto (e) {
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
        if (this.uploadPhotoType === 'addLinkPhoto') {
          this.$set(this.contentLinkObj, 'linkPhoto', res.data.fullPath)
          this.uploadPhotoType = ''
          return
        }
        if (this.uploadPhotoType === 'addMiniPhoto') {
          this.$set(this.contentMiniObj, 'appPhoto', res.data.fullPath)
          this.uploadPhotoType = ''
          return
        }
        const imageInfo = {
          type: 2,
          photoUrl: res.data.fullPath
        }
        if (this.submitType === 'add') {
          this.sendContentArray.push(imageInfo)
        } else {
          this.sendContentArray.splice(this.chooseEditIndex, 1, imageInfo)
        }
        this.isSopEditStatus = true
        this.$emit('update:isSopEdit', this.isSopEditStatus)
        this.$emit('update:contentArray', this.sendContentArray)
        this.submitType = ''
        this.$refs.uploadPhotoRef.value = ''
      } else {
        console.log(e)
      }
    },
    // 上传视频
    async uploadVideo (e) {
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
        if (this.submitType === 'add') {
          this.sendContentArray.push(videoInfo)
        } else {
          this.sendContentArray.splice(this.chooseEditIndex, 1, videoInfo)
        }
        this.isSopEditStatus = true
        this.$emit('update:isSopEdit', this.isSopEditStatus)
        this.$emit('update:contentArray', this.sendContentArray)
        this.$refs.uploadVideoRef.value = ''
      } else {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="less" scoped>
#send_content_container {
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
  }
  .contentTextModal {
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
.sendSOPInfoContainer {
  width: 100%;
  margin-top: 10px;
  display: flex;
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
}
.uploadFileInp {
  position: fixed;
  left: -100000px;
  top: -100000px;
  opacity: 0;
  width: 1px;
  height: 1px;
}
</style>
