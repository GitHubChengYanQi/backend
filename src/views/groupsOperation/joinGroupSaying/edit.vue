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
              <div id="messageInput" class="messageInput" contenteditable @click="getRange" @keyup="sendMessage" />
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
                  :class="mediaList.length === 9 ? 'handleBtn disabled' : 'handleBtn'"
                  @click="chooseSendType(item.type)">+ {{
                    item.name
                  }}</div>
                <span class="say">(最多添加9个素材)</span>
              </div>
            </div>
            <div class="mediaCntainer">
              <div class="noData" v-if="!mediaList.length">
                点击上方,添加发送内容
              </div>
              <div class="contentItem" v-for="(item, index) in mediaList" :key="index">
                <div class="idx">{{ index + 1 }}</div>
                <div :class="`content ${item.type}`" v-if="item.type === 'image'">
                  <img :src="item.content.imgUrl" alt />
                </div>
                <div :class="`content ${item.type}`" v-else-if="item.type === 'video'">
                  <div class="posterTxt" v-if="item.showPoster">{{
                    item.content.mediaName
                  }}</div>
                  <a-icon class="poster" type="play-circle" style="color: #fff;" />
                  <video :src="item.content.videoUrl" @error="videoLoadErr(index)" alt />
                </div>
                <div :class="`content ${item.type}`" v-else-if="item.type === 'link'">
                  <div class="lef">
                    <span class="til">{{ item.content.title }}</span>
                    <span class="desc">{{ item.content.desc }}</span>
                  </div>
                  <img :src="item.content.pic" alt class="image" />
                </div>
                <div class="handlesBox">
                  <img
                    src="./images/move.svg"
                    alt
                    :class="index === 0 ? 'icon move disabled' : 'icon move'"
                    @click="handleMoveClick(index, 'up')" />
                  <img
                    src="./images/move.svg"
                    style="transform: rotate(180deg)"
                    alt
                    :class="(mediaList.length - 1) === index ? 'icon move disabled' : 'icon move'"
                    @click="handleMoveClick(index, 'down')" />
                  <img
                    src="./images/edit.svg"
                    alt
                    class="icon"
                    @click="handleEditClick(item.type, item.content, index)" />
                  <img src="./images/del.svg" alt class="icon" @click="handleDelClick(index)" />
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
            <div class="messageItem" v-for="(item, index) in mediaList" :key="index">
              <img :src="userInfo ? userInfo.employeeThumbAvatar : ''" alt="" class="face">
              <div class="content">
                <img :src="item.content.imgUrl" alt="" class="image" v-if="item.type === 'image'" />
                <div class="videoBox" v-else-if="item.type === 'video'">
                  <a-icon class="poster" type="play-circle" />
                  <video :src="item.content.videoUrl" class="video" />
                </div>
                <div class="linkBox" v-else-if="item.type === 'link'">
                  <div class="lef">
                    <span class="til">{{ item.content.title }}</span>
                    <span class="desc">{{ item.content.desc }}</span>
                  </div>
                  <img :src="item.content.pic" alt class="image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input type="file" accept="image/png,image/jpg" ref="uploadPhoto" @change="uploadPhoto" class="uploadFileInp" />
    <input type="file" accept="video/mp4" ref="uploadVideo" @change="uploadVideo" class="uploadFileInp" />

    <a-modal
      title="新增链接"
      :maskClosable="false"
      :width="600"
      :visible="contentLinkModalShow"
      class="contentLinkModal"
      :getContainer="() => $refs['groupOperation_joinGroupSayingItemEdit-page-container']"
      @cancel="closeLinkModal">
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
        <div class="addPic image" v-if="!modalLinkObj.pic" @click="openSelectPhoto('addLinkPhoto')">+</div>
        <img class="image" v-else :src="modalLinkObj.pic" @click="openSelectPhoto('addLinkPhoto')" />
        <span class="tip">图片限制在2MB以内</span>
      </div>
      <template slot="footer">
        <a-button @click="closeLinkModal">取消</a-button>
        <a-button type="primary" @click="confirmContentLink">确定</a-button>
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
import { deepClonev2 } from '@/utils/util'
import { transformLibraryData } from '@/views/salesManagement/sopUtils'
import { defaultLinkObj, defaultLibraryObj, isUrl } from '../groupUtils'

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
        {
          name: '视频',
          type: 'video'
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
      // 发送内容
      mediaList: [
        // {
        //   type: 'image',
        //   content: {
        //     imgUrl: 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16693474558600560582.jpg?Expires=1984707456&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=JxZssVfKhT%2BJh41YwjYQ9kydb08%3D',
        //     mediaName: 'face'
        //   }
        // },
        // {
        //   type: 'video',
        //   content: {
        //     videoUrl: 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16693475240280230118.mp4?Expires=1984707524&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=Ahu9vPZ9ZHPqg86xEsQhDfdT5vU%3D',
        //     mediaName: 'test'
        //   }
        // },
        // {
        //   type: 'link',
        //   content: {
        //     title: 'link title',
        //     desc: 'link decsc',
        //     pic: 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16693474558600560582.jpg?Expires=1984707456&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=JxZssVfKhT%2BJh41YwjYQ9kydb08%3D',
        //     url: 'https://12'
        //   }
        // }
      ],
      uploadPhotoType: '',
      isEditingItem: false,
      selectMeidaItemIdx: -1,
      contentLinkModalShow: false,
      modalLinkObj: { ...defaultLinkObj },
      contentLibraryModalShow: false,
      contentLibraryObj: { ...defaultLibraryObj },
      msgReminder: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
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
    }
  },
  mounted () {
    window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
  },
  beforeRouteLeave (_, __, next) {
    // 导航离开当前路由的时候被调用，this可以被访问到
    if (this.mediaList.length || this.msgContent) {
      this.$confirm({
        title: '返回后，将不再保存已编辑的内容',
        onOk () {
          next()
        }
      })
    } else {
      next()
    }
  },
  created () { },
  methods: {
    beforeunloadHandler (e) {
      return '关闭'
    },
    async getData () {
      // const { data } = await getNoticeInfoReq({ id: this.$route.query.id })
      // this.formData = {
      //   name: data.name,
      //   classify: [data.firstClass, data.secondClass],
      //   isUse: data.enableState === '1',
      //   noticeType: data.noticeCrowd,
      //   noticeArr: data.noticeChannels ? data.noticeChannels.split(',') : []
      // }
      // this.msgTitle = data.title
      // this.msgContent = data.content
      // this.transfromHTMLMsg(data.content)
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
        this.sendMessage()
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
    sendMessage (e) {
      const target = document.querySelector('#messageInput')
      let str = ((e && e.target) || target).innerHTML.replace(/<[^>]*>/g, '')
      str = str.replace(/&nbsp;/g, ' ')
      str = str.replace(/&amp;/g, '&')
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      this.msgContent = str
      this.getRange()
    },
    // 发送内容集合
    // 选择单个发送类型
    chooseSendType (type, isEdit = false) {
      if (!isEdit && this.mediaList.length === 9) {
        return this.$message.warn('最多只可添加9条内容！')
      }
      if (type === 'image') {
        this.openSelectPhoto('addContent')
      } else if (type === 'video') {
        this.$refs['uploadVideo'].click()
        this.mediaFormLibrary = false
      } else if (type === 'link') {
        this.contentLinkModalShow = true
        this.mediaFormLibrary = false
      } else if (type === 'library') {
        this.contentLibraryModalShow = true
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
          mediaName: file.name
        }
        if (this.uploadPhotoType === 'addContent') {
          await this.setMediaItemContent(this.isEditingItem ? 'edit' : 'add', 'image', params)
          this.isEditingItem = false
        } else if (this.uploadPhotoType === 'addLinkPhoto') {
          this.modalLinkObj.pic = res.data.fullPath
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
        await this.setMediaItemContent(this.isEditingItem ? 'edit' : 'add', 'video', params)
      } catch (e) {
        console.log(e, 'upload video err')
      }
      this.isEditingItem = false
      e.target.value = ''
    },
    // 处理数据
    async setMediaItemContent (handle, type, content) {
      const nowD = deepClonev2(this.mediaList)
      if (handle === 'add') {
        nowD.push({
          type,
          content
        })
      } else if (handle === 'edit') {
        nowD[this.selectMeidaItemIdx].content = content
      }
      this.mediaList = nowD
    },
    videoLoadErr (index) {
      this.mediaList[index].showPoster = true
    },
    // 编辑单个item
    handleEditClick (type, value, index) {
      this.isEditingItem = true
      this.selectMeidaItemIdx = index
      if (type === 'link') {
        this.modalLinkObj = { ...value }
      }
      this.chooseSendType(type, true)
    },
    // 移动某一个item
    async handleMoveClick (index, type) {
      if (type === 'up' && index === 0) {
        return
      } else if (type === 'down' && index === (this.mediaList.length - 1)) {
        return
      }
      const nowD = deepClonev2(this.mediaList)
      const delItem = nowD.splice(index, 1)[0]
      if (type === 'up') {
        nowD.splice(index - 1, 0, delItem)
      } else {
        nowD.splice(index + 1, 0, delItem)
      }
      this.mediaList = nowD
    },
    // 删除某一个item
    handleDelClick (index) {
      const that = this
      this.$confirm({
        title: '确定删除所选内容?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          that.mediaList.splice(index, 1)
          that.$message.success('删除成功')
        }
      })
    },
    closeLinkModal () {
      this.contentLinkModalShow = false
      this.isEditingItem = false
      this.modalLinkObj = { ...defaultLinkObj }
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
      this.setMediaItemContent(this.isEditingItem ? 'edit' : 'add', 'link', this.modalLinkObj)
      this.closeLinkModal()
    },
    // 素材库弹窗确认
    async handleAddLibraryOk () {
      if (this.contentLibraryObj.temporaryStroageArr.some(it => [4, 6, 7].includes(it.type_id))) {
        this.$message.warning('暂不支持文件、小程序、音频类型素材！')
        return
      }
      if ((this.mediaList.length + this.contentLibraryObj.temporaryStroageArr.length) > 9) {
        this.$message.warning('发送条数不能超过九条！')
        return
      }
      for (const item of this.contentLibraryObj.temporaryStroageArr) {
        const { type, data } = transformLibraryData(item)
        if (type === 'text') {
          // 文字进行合并，否则新增
          this.transfromHTMLMsg(this.msgContent + data)
        } else {
          console.log(type, data)
          await this.setMediaItemContent('add', type, data)
        }
        this.contentLibraryModalShow = false
      }
    },
    // 素材库选择Change
    librarySelectChange (e) {
      console.log(e, ' e')
      this.contentLibraryObj.temporaryStroageArr = e
    },
    transfromHTMLMsg (content) {
      document.querySelector('#messageInput').innerHTML = content.replace(/#{2}.*?#{2}/g, '<font color="#1890ff" contenteditable="false">$&</font>')
    },
    sendJoinSays () {
      console.log(this.msgContent, this.mediaList, this.msgReminder)
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
