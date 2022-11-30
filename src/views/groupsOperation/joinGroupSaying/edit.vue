<template>
  <div
    id="groupOperation_joinGroupSayingItemEdit-page-container"
    ref="groupOperation_joinGroupSayingItemEdit-page-container">
    <div class="sendJoinSays" @click="sendJoinSays">保存</div>
    <a-alert class="tips" message="因企业微信限制，入群欢迎语创建上限为100条，在企业微信后台创建的也将计入其中" show-icon type="warning" />
    <div class="formBox">
      <div class="leftForm">
        <div class="formItem mutiple">
          <span class="label">欢迎语文本</span>
          <div class="values">
            <div class="messageBox">
              <div class="handleKeysBar">
                插入：
                <div class="insertBox">
                  <span class="item" @click="insertContent('用户昵称')">用户昵称</span>
                </div>
              </div>
              <div
                id="messageInput"
                class="messageInput"
                contenteditable
                @click="getRange"
                @keyup="e => sendMessage(e, false)"
              />
              <span class="numCount">{{ msgContent.length }} / 1000</span>
            </div>
          </div>
        </div>
        <div class="formItem mutiple">
          <span class="label">欢迎语素材</span>
          <div class="values">
            <div class="handleBox">
              <div style="display: flex;position: relative;">
                <div
                  v-for="(item, index) in handleBtnArr"
                  :key="index"
                  :class="mediaList.type ? 'handleBtn disabled' : 'handleBtn'"
                  @click="chooseSendType(item.type)">+ {{
                    item.name
                  }}</div>
                <span class="say">(最多添加1个素材)</span>
              </div>
            </div>
            <div class="mediaCntainer">
              <div class="noData" v-if="!mediaList.type">
                点击上方,添加发送内容
              </div>
              <div class="contentItem" v-if="mediaList.type">
                <!-- <div class="idx"></div> -->
                <div :class="`content ${mediaList.type}`" v-if="mediaList.type === 'image'">
                  <img :src="mediaList.content.imgUrl" alt />
                </div>
                <div :class="`content ${mediaList.type}`" v-else-if="mediaList.type === 'video'">
                  <div class="posterTxt" v-if="mediaList.showPoster">{{
                    mediaList.content.mediaName
                  }}</div>
                  <a-icon class="poster" type="play-circle" style="color: #fff;" />
                  <video :src="mediaList.content.videoUrl" @error="videoLoadErr" alt />
                </div>
                <div :class="`content ${mediaList.type}`" v-else-if="mediaList.type === 'link'">
                  <div class="lef">
                    <span class="til">{{ mediaList.content.title }}</span>
                    <span class="desc">{{ mediaList.content.desc }}</span>
                  </div>
                  <img :src="mediaList.content.pic.url" alt class="image" />
                </div>
                <div :class="`content ${mediaList.type}`" v-else-if="mediaList.type === 'embed'">
                  <div class="line">
                    <img src="./images/miniProgramIcon.svg" alt class="icon" />
                    <span class="til">{{ '小程序标题' }}</span>
                  </div>
                  <div class="line desc">{{ mediaList.content.desc }}</div>
                  <img :src="mediaList.content.pic.url" alt class="image" />
                  <div class="line">
                    <img src="./images/miniProgramIcon.svg" alt class="icon" />
                    <span class="say">小程序</span>
                  </div>
                </div>
                <div class="handlesBox">
                  <img
                    src="./images/edit.svg"
                    alt
                    class="icon"
                    @click="handleEditClick()" />
                  <img src="./images/del.svg" alt class="icon" @click="handleDelClick()" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="formItem">
          <span class="label">消息提醒</span>
          <div class="values" style="display: flex;align-items: center;">
            <a-switch v-model="msgReminder" />
            <span style="margin-left: 15px;">开启后，新建该条欢迎语会通过「客户群」群发通知企业全部员工：“管理员创建了新的入群欢迎语”</span>
          </div>
        </div>
      </div>
      <div class="rigPhone">
        <span class="txt">预览</span>
        <div class="phoneBox">
          <div class="header">客户</div>
          <div class="content-wrapper">
            <div class="messageItem">
              <img :src="userInfo ? userInfo.employeeThumbAvatar : ''" alt="" class="face">
              <div class="content">
                <p class="text">我通过了你的好友验证请求，现在我们可以开始聊天了</p>
              </div>
            </div>
            <div class="messageItem" v-if="this.msgContent">
              <img :src="userInfo ? userInfo.employeeThumbAvatar : ''" alt="" class="face">
              <div class="content">
                <p class="text">{{ this.msgContent }}</p>
              </div>
            </div>
            <div class="messageItem" v-if="mediaList.type">
              <img :src="userInfo ? userInfo.employeeThumbAvatar : ''" alt="" class="face">
              <div class="content">
                <img :src="mediaList.content.imgUrl" alt="" class="image" v-if="mediaList.type === 'image'" />
                <div class="videoBox" v-else-if="mediaList.type === 'video'">
                  <a-icon class="poster" type="play-circle" />
                  <video :src="mediaList.content.videoUrl" class="video" />
                </div>
                <div class="linkBox" v-else-if="mediaList.type === 'link'">
                  <div class="lef">
                    <span class="til">{{ mediaList.content.title }}</span>
                    <span class="desc">{{ mediaList.content.desc }}</span>
                  </div>
                  <img :src="mediaList.content.pic.url" alt class="image" />
                </div>
                <div :class="`content ${mediaList.type}`" v-else-if="mediaList.type === 'embed'">
                  <div class="line">
                    <img src="./images/miniProgramIcon.svg" alt class="icon" />
                    <span class="til">{{ '小程序标题' }}</span>
                  </div>
                  <div class="line desc">{{ mediaList.content.desc }}</div>
                  <img :src="mediaList.content.pic.url" alt class="image" />
                  <div class="line">
                    <img src="./images/miniProgramIcon.svg" alt class="icon" />
                    <span class="say">小程序</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input type="file" accept="image/*" ref="uploadPhoto" @change="uploadPhoto" class="uploadFileInp" />

    <a-modal
      title="新增链接"
      :maskClosable="false"
      :width="600"
      :visible="contentLinkModalShow"
      class="contentLinkModal"
      :getContainer="() => $refs['groupOperation_joinGroupSayingItemEdit-page-container']"
      @cancel="closeContentModal('contentLinkModalShow', 'contentLinkObj', {
        title: '',
        url: '',
        desc: '',
        pic: ''
      })">
      <div class="modalFormBox">
        <div class="line">
          <a-input v-model="modalLinkObj.title" placeholder="请输入链接标题（必填）" />
          <span class="len">{{ modalLinkObj.title.length || '0' }}/200</span>
        </div>
        <div class="line">
          <a-input v-model="modalLinkObj.url" placeholder="输入http或https开头的链接地址（必填）" />
          <span class="len">{{ modalLinkObj.url.length || '0' }}/500</span>
        </div>
        <div class="line textarea">
          <a-textarea v-model="modalLinkObj.desc" autoSize placeholder="请输入内容简介（选填）" />
          <span class="len">{{ modalLinkObj.desc.length || '0' }}/170</span>
        </div>
      </div>
      <div class="pic">
        <div class="addPic image" v-if="!modalLinkObj.pic.url" @click="openSelectPhoto('addLinkPhoto')">+</div>
        <img class="image" v-else :src="modalLinkObj.pic.url" @click="openSelectPhoto('addLinkPhoto')" />
        <span class="tip">图片限制在2MB以内</span>
      </div>
      <template slot="footer">
        <a-button
          @click="closeContentModal('contentLinkModalShow', 'contentLinkObj', {
            title: '',
            url: '',
            desc: '',
            pic: ''
          })">取消</a-button>
        <a-button type="primary" @click="confirmContentLink">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="新增小程序"
      :maskClosable="false"
      :width="600"
      :visible="contentMiniModalShow"
      class="contentLinkModal"
      :getContainer="() => $refs['groupOperation_joinGroupSayingItemEdit-page-container']"
      @cancel="closeContentModal('contentMiniModalShow', 'contentMiniObj', {
        appid: '',
        path: '',
        desc: '',
        pic: ''
      })">
      <p class="tip top">
        请填写企业微信后台绑定的小程序，否则会造成发送失败
        <a
          class="click"
          href="https://www.yuque.com/docs/share/9def95f9-bce5-4c66-b800-9f3cbef4fe50"
          target="_blank">查看如何绑定</a>
      </p>
      <div class="modalFormBox">
        <div class="line">
          <a-input v-model="contentMiniObj.appid" placeholder="输入小程序APPID（必填）" />
          <span class="len">{{ contentMiniObj.appid.length || '0' }}/200</span>
          <p class="tip">
            <a
              class="click"
              href="https://www.yuque.com/docs/share/6b55b4d7-7e59-4a0a-bdd6-fb4dd0d2f2e5"
              target="_blank">如何获取APPID</a>
          </p>
        </div>
        <div class="line">
          <a-input v-model="contentMiniObj.path" placeholder="输入小程序页面路径（必填）" />
          <span class="len">{{ contentMiniObj.path.length || '0' }}/500</span>
          <p class="tip">
            <a
              class="click"
              href="https://www.yuque.com/docs/share/dd225b88-7778-463e-82a2-37bff08e1119"
              target="_blank">如何获取小程序路径</a>
          </p>
        </div>
        <div class="line textarea">
          <a-textarea v-model="contentMiniObj.desc" autoSize placeholder="输入小程序的描述（必填）" />
          <span class="len">{{ contentMiniObj.desc.length || '0' }}/170</span>
        </div>
      </div>
      <div class="pic">
        <div class="addPic image" v-if="!contentMiniObj.pic.url" @click="openSelectPhoto('addMiniPhoto')">+</div>
        <img class="image" v-else :src="contentMiniObj.pic.url" @click="openSelectPhoto('addMiniPhoto')" />
        <span class="photoTip">图片限制在2MB以内</span>
      </div>
      <template slot="footer">
        <a-button
          @click="closeContentModal('contentMiniModalShow', 'contentMiniObj', {
            appid: '',
            path: '',
            desc: '',
            pic: ''
          })">取消</a-button>
        <a-button type="primary" @click="confirmContentMini">确定</a-button>
      </template>
    </a-modal>
    <!-- 添加素材库弹窗 -->
    <a-modal v-model="contentLibraryModalShow" centered @ok="handleAddLibraryOk" width="95%">
      <MediumGroup :is-component="true" v-if="contentLibraryModalShow" @materialSelect="librarySelectChange" />
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { upLoad } from '@/api/common'
import { defaultLinkObj, defaultLibraryObj, isUrl, defaultMiniObj, getMediaData, transformLibraryData } from '../groupUtils'
import { addJoinSayItemReq, getJoinSayItemInfoReq, setJoinSayItemInfoReq } from '@/api/groupsOperation'

export default {
  components: {
    'MediumGroup': () => import('@/views/mediumGroup/index.vue')
  },
  data () {
    return {
      msgContent: '',
      range: null,
      // 素材可选按钮
      handleBtnArr: [
        {
          name: '图片',
          type: 'image'
        },
        // {
        //   name: '视频',
        //   type: 'video'
        // },,
        {
          name: '小程序',
          type: 'embed'
        },
        {
          name: '链接',
          type: 'link'
        },
        {
          name: '素材库',
          type: 'library'
        }
      ],
      isEdit: false,
      // 发送内容
      mediaList: {},
      uploadPhotoType: '',
      contentLinkModalShow: false,
      modalLinkObj: { ...defaultLinkObj },
      contentLibraryModalShow: false,
      contentLibraryObj: { ...defaultLibraryObj },
      contentMiniModalShow: false,
      contentMiniObj: { ...defaultMiniObj },
      msgReminder: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    'mediaList.type' (e) {
      if (!e) {
        this.isEdit = false
      } else {
        this.isEdit = true
      }
    },
    'msgContent' (e) {
      if (!e) {
        this.isEdit = false
      } else {
        this.isEdit = true
      }
      if (e.length > 1000) {
        this.msgContent = e.slice(0, 1000)
        this.transfromHTMLMsg(e.slice(0, 1000))
      }
    },
    'modalLinkObj.title' (e) {
      if (e.length > 200) {
        this.modalLinkObj.title = e.slice(0, 200)
      }
    },
    'modalLinkObj.url' (e) {
      if (e.length > 500) {
        this.modalLinkObj.url = e.slice(0, 500)
      }
    },
    'modalLinkObj.desc' (e) {
      if (e.length > 170) {
        this.modalLinkObj.desc = e.slice(0, 170)
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
    }
  },
  mounted () {
    window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
  },
  beforeRouteLeave (_, __, next) {
    // 导航离开当前路由的时候被调用，this可以被访问到
    if (!(this.mediaList.type || this.msgContent) || !this.isEdit) {
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
  created () {
    if (this.$route.query.id) {
      this.getData()
    }
  },
  methods: {
    beforeunloadHandler (e) {
      return '关闭'
    },
    async getData () {
      const { data } = await getJoinSayItemInfoReq({ id: this.$route.query.id })
      console.log(data, 'data')
      this.msgReminder = data.notice_status === 1
      this.msgContent = data.send_text
      this.mediaList = getMediaData('from', data.media_text)
      // this.formData = {
      //   name: data.name,
      //   classify: [data.firstClass, data.secondClass],
      //   isUse: data.enableState === '1',
      //   noticeType: data.noticeCrowd,
      //   noticeArr: data.noticeChannels ? data.noticeChannels.split(',') : []
      // }
      // this.msgTitle = data.title
      // this.msgContent = data.content
      this.transfromHTMLMsg(data.send_text)
    },
    // 文本输入组
    // 获取光标
    getRange () {
      this.range = this.savePosition()
    },
    // 返回光标信息
    savePosition () {
      if (window.getSelection) {
        const sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          return sel.getRangeAt(0)
        }
      } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange()
      }
      return null
    },
    // 重置光标位置
    restoreSelection (callback) {
      const range = this.range
      if (range) {
        if (window.getSelection) {
          const sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
          callback(range)
        } else if (document.selection && range.select) {
          range.select()
          callback(range)
        }
      } else {
        callback()
      }
    },
    async insertContent (value) {
      this.restoreSelection((range) => {
        const dom = document.createElement('a')
        dom.setAttribute('color', '#1890ff')
        dom.setAttribute('href', `##${value}##`)
        dom.innerHTML = `##${value}##`
        if (range) {
          range.insertNode(dom)
        } else {
          this.endInsert(dom)
        }
        this.range = null
        this.sendMessage(null, true)
      })
    },
    endInsert (val) {
      const editBox = document.getElementById('messageInput')
      editBox.appendChild(val)
    },
    onInputEditor () {
      document.getElementById('messageInput').addEventListener('input', () => {
        this.range = this.savePosition()
      })
    },
    sendMessage (e, isInsert) {
      const target = document.querySelector('#messageInput')
      let str = ((e && e.target) || target).innerHTML.replace(/<[^>]*>/g, '')
      str = str.replace(/&nbsp;/g, ' ')
      str = str.replace(/&amp;/g, '&')
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      this.msgContent = str
      if (!isInsert) {
        // 每次键入内容更新光标位置
        this.getRange()
      }
    },
    // 发送内容集合
    // 选择单个发送类型
    chooseSendType (type, isEdit = false) {
      if (!isEdit && this.mediaList.type) {
        return this.$message.warn('最多只可添加1条内容！')
      }
      if (type === 'image') {
        this.openSelectPhoto('addContent')
      } else if (type === 'link') {
        this.contentLinkModalShow = true
        this.mediaFormLibrary = false
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
    // 上传图片
    async uploadPhoto (e) {
      if (!this.uploadPhotoType) return
      const file = e.target.files[0]
      const splitArr = file.name.split('.')

      if (!['jpg', 'png', 'jpeg'].includes(splitArr[splitArr.length - 1])) {
        return this.$message.warn('请上传 jpg, png, jpeg 格式的图片文件')
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
          mediaName: file.name,
          path: res.data.path
        }
        if (this.uploadPhotoType === 'addContent') {
          await this.setMediaItemContent('image', params)
        } else if (this.uploadPhotoType === 'addLinkPhoto') {
          this.modalLinkObj.pic = { url: res.data.fullPath, path: res.data.path }
        } else if (this.uploadPhotoType === 'addMiniPhoto') {
          this.contentMiniObj.pic = { url: res.data.fullPath, path: res.data.path }
        }
      } catch (e) {
        console.log(e, 'upload err')
      }
      e.target.value = ''
    },
    // 处理数据
    async setMediaItemContent (type, content) {
      this.mediaList = {
        type,
        content
      }
    },
    videoLoadErr () {
      this.mediaList.showPoster = true
    },
    // 编辑单个item
    handleEditClick () {
      if (this.mediaList.type === 'link') {
        this.modalLinkObj = this.mediaList.content
      } else if (this.mediaList.type === 'embed') {
        this.contentMiniObj = this.mediaList.content
      }
      this.chooseSendType(this.mediaList.type, true)
    },
    // 删除某一个item
    handleDelClick () {
      const that = this
      this.$confirm({
        title: '确定删除所选内容?',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          that.mediaList = {
            type: '',
            content: {}
          }
          that.$message.success('删除成功')
        }
      })
    },
    closeLinkModal () {
      this.contentLinkModalShow = false
      this.modalLinkObj = { ...defaultLinkObj }
    },
    // modal 关闭
    closeContentModal (modalName, dataName, clearVal) {
      this[modalName] = false
      this[dataName] = clearVal
    },
    // 链接框输入确认
    async confirmContentLink () {
      if (!this.modalLinkObj.title) {
        return this.$message.warn('请输入链接标题！')
      } else if (!this.modalLinkObj.url) {
        return this.$message.warn('请输入链接地址！')
      } else if (!isUrl(this.modalLinkObj.url)) {
        return this.$message.warn('请输入正确的链接地址！')
      } else if (!this.modalLinkObj.pic) {
        return this.$message.warn('请上传封面图片！')
      }
      //  添加
      this.setMediaItemContent('link', this.modalLinkObj)
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
      this.setMediaItemContent('embed', this.contentMiniObj)
      this.closeContentModal('contentMiniModalShow', 'contentMiniObj', {
        appid: '',
        path: '',
        desc: '',
        pic: ''
      })
    },
    // 素材库弹窗确认
    async handleAddLibraryOk () {
      if (this.contentLibraryObj.temporaryStroageArr.some(it => [4, 5, 7].includes(it.type_id))) {
        this.$message.warning('暂不支持文件、视频、音频类型素材！')
        return
      }
      if (this.mediaList.type || (this.contentLibraryObj.temporaryStroageArr.length > 1)) {
        this.$message.warning('发送条数不能超过一条！')
        return
      }
      const item = this.contentLibraryObj.temporaryStroageArr[0]
      const { type, data } = transformLibraryData(item)
      if (type === 'text') {
        // 文字进行合并，否则新增
        this.transfromHTMLMsg(this.msgContent + data)
      } else {
        await this.setMediaItemContent(type, data)
      }
      this.contentLibraryModalShow = false
    },
    // 素材库选择Change
    librarySelectChange (e) {
      console.log(e, ' e')
      this.contentLibraryObj.temporaryStroageArr = e
    },
    transfromHTMLMsg (content) {
      document.querySelector('#messageInput').innerHTML = content.replace(/#{2}.*?#{2}/g, '<font color="#1890ff" contenteditable="false">$&</font>')
    },
    async sendJoinSays () {
      if (this.msgContent || this.mediaList.type) {
        const obj = {
          send_text: this.msgContent,
          media_text: getMediaData('to', this.mediaList),
          notice_status: this.msgReminder ? '1' : '0'
        }
        if (this.$route.query.id) {
          obj.id = this.$route.query.id
          await setJoinSayItemInfoReq(obj)
          this.$message.success('修改成功！')
        } else {
          await addJoinSayItemReq(obj)
          this.$message.success('保存成功！')
        }
        this.isEdit = false
        this.$nextTick(() => {
          this.$router.go(-1)
        })
      } else {
        this.$message.warning('至少选择一项输入！')
      }
    }
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.beforeunloadHandler, false)
  }
}
</script>
<style lang='less'>
#groupOperation_joinGroupSayingItemEdit-page-container {
  .tips {
    width: calc(100% - 120px);
    padding: 20px 35px;

    .ant-alert-icon {
      position: absolute;
      top: 50%;
      left: 16px;
      transform: translate(0, -50%);
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

      .modalFormBox {
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
</style>
<style lang='less' scoped>
@import './edit.less';
</style>
