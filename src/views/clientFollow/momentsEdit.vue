<template>
  <div class="momentsOperation_edit-page-container" ref="momentsOperation_edit-page-container">
    <div class="must formBox preview" style="padding-top: 50px;">
      <div
        :class="isDisabled ? 'sendMomments sendMommentsDisabled' : 'sendMomments'"
        @click="isDisabled ? disabledClickHandle() : send()">保存</div>
      <div class="leftForm">
        <div class="formItem mutiple">
          <span class="label">选择执行员工</span>
          <div class="values">
            <div v-if="isDisabled" class="disabledBox" style="width: 180px;height: 30px" @click="disabledClickHandle" />
            <selectPersonnel
              v-if="treeData"
              :record="treeData"
              :class="isDisabled ? 'selectPersonnelCom selectPersonnelComDisabled' : 'selectPersonnelCom'"
              type="button"
              name="选择成员"
              v-model="employeeIds"
              @getVal="employeeIdsChange" />
          </div>
        </div>
        <div class="formItem mutiple">
          <span class="label">选取客户</span>
          <div class="values">
            <div class="selectUserBox">
              <a-radio-group v-model="selectUserType" :disabled="isDisabled">
                <a-radio :value="1">筛选客户</a-radio>
                <a-radio :value="2">全部客户</a-radio>
              </a-radio-group>
            </div>
            <div class="includesLableBox" v-if="selectUserType === 1">
              <div v-if="isDisabled" class="disabledBox" @click="disabledClickHandle" />
              <span class="til">包含所有标签:</span>
              <div class="selectLabelBox">
                <span class="selectBtn" @click="showBox(0, 'selectTagList')">
                  <span class="emptyBtn" v-if="selectTagList.length == 0">+ 编辑</span>
                  <span class="label_input_title" v-for="(item, index) in selectTagList" :key="index">
                    {{ item.name }}
                    <span class="delete" @click.stop="delTagHandle(item.id, index, 'selectTagList')">+</span>
                  </span>
                </span>
              </div>
            </div>
            <div class="finallyNum">
              预计送达客户数: {{ expectedNum }} 个
              <span
                v-if="!isDisabled"
                class="reload"
                @click="getMomentsItemExpectedNum"
                v-permission="'/moments/countcontact#post'">刷新</span>
            </div>
          </div>
        </div>
        <div class="formItem mutiple">
          <span class="label">发送内容</span>
          <div class="values">
            <div class="textareaBox">
              <a-textarea
                ref="textareaRef"
                class="textarea"
                v-model="content"
                placeholder="请输入"
                :maxLength="1000"
                :disabled="isDisabled"
                :auto-size="{ minRows: 5, maxRows: 10 }" />
              <span class="numCount">{{ content.length }} / 1000</span>
            </div>
            <div class="mediasBox">
              <div
                v-if="isDisabled"
                class="disabledBox"
                :style="mediaType ? { height: '100px', top: '-10px' } : {}"
                @click="disabledClickHandle" />
              <div class="pics" v-if="mediaType === 'photo'">
                <div class="picItem" v-for="(item, index) in photos" :key="index">
                  <img :src="item.url" alt="" class="pic">
                  <span class="close" @click="deletePhoto(index)">
                    <span class="x">+</span>
                  </span>
                </div>
                <div class="picItem add" v-if="photos.length < 9" @click="addMorePhoto">
                  <span>上传图片</span>
                  <span>最大限制10M</span>
                </div>
              </div>
              <div class="videoBox" v-else-if="mediaType === 'video'">
                <a-icon class="poster" type="play-circle" />
                <video :src="videoUrl.url" alt />
                <div class="handleBtns">
                  <a-icon class="btn" type="form" @click="handleEditVideo" />
                  <a-icon class="btn" type="delete" @click="() => { this.mediaType = ''; this.videoUrl = {} }" />
                </div>
              </div>
              <div class="linkBox" v-else-if="mediaType === 'link'">
                <div class="lef">
                  <span class="til">{{ modalLinkObj.title }}</span>
                  <div class="desc">{{ modalLinkObj.desc }}</div>
                </div>
                <img :src="modalLinkObj.pic.url" alt class="image" />
                <div class="handleBtns">
                  <a-icon v-if="modalLinkObj.radarLink !== '1'" class="btn" type="form" @click="modalLinkEdit" />
                  <span v-else>{{ modalLinkObj.radarName }}</span>
                  <a-icon class="btn" type="delete" @click="deleteLink" />
                </div>
              </div>
            </div>
            <div class="handleBox">
              <div style="display: flex;position: relative;">
                <div v-if="isDisabled" class="disabledBox" @click="disabledClickHandle" />
                <div
                  v-for="(item, index) in handleBtnArr"
                  :key="index"
                  :class="mediaType ? 'handleBtn disabled' : 'handleBtn'"
                  @click="chooseSendType(item.type)">+ {{
                    item.name
                  }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="formItem">
          <span class="label">群发时间</span>
          <div class="values" style="display: flex;align-items:center;">
            <a-radio-group v-model="sendDateType" :disabled="isDisabled">
              <a-radio :value="1">立即发送</a-radio>
              <a-radio :value="2">定时发送</a-radio>
            </a-radio-group>
            <div class="chooseSendDate" v-if="sendDateType === 2">
              <a-date-picker
                :disabled="isDisabled"
                dropdownClassName="momentsOperation_edit-page-container-dateItem"
                :allowClear="false"
                :showToday="false"
                v-model="chooseSendDate"
                valueFormat="YYYY-MM-DD HH:mm"
                format="YYYY-MM-DD HH:mm"
                show-time
                :disabled-date="e => disabledBeforeDate(e, 'date')"
                :disabled-time="e => disabledBeforeDate(e, 'time')" />
            </div>
          </div>
        </div>
      </div>
      <div class="rigPhone">
        <span class="txt">朋友圈预览图</span>
        <div class="phoneBox">
          <img
            :src="userInfo ? userInfo.employeeThumbAvatar : ''"
            alt=""
            class="face"
            v-if="content || mediaType">
          <div class="flexBox" v-if="content || mediaType">
            <div class="topLine">
              <div class="name">
                <span class="employName">员工姓名</span>@{{ userInfo? userInfo.corpName : '' }}
              </div>
              <a-icon type="down" class="icon" />
            </div>
            <div class="textBox" v-if="content">
              {{ content }}
            </div>
            <div class="mediaBox">
              <div class="photos" v-if="mediaType === 'photo'">
                <img v-for="(item, index) in photos" :key="index" :src="item.url" alt="" class="picItem">
              </div>
              <div class="videoBox" v-else-if="mediaType === 'video'">
                <a-icon class="poster" type="play-circle" />
                <video :src="videoUrl.url" alt />
              </div>
              <div class="linkBox" v-else-if="mediaType === 'link'">
                <img v-if="modalLinkObj.pic.url" :src="modalLinkObj.pic.url" alt="" class="pic">
                <!-- <div class="pic" v-else></div> -->
                <div class="rig">
                  <div class="title clamp">{{ modalLinkObj.title }}</div>
                  <div class="desc clamp">{{ modalLinkObj.desc }}</div>
                </div>
              </div>
            </div>
            <div class="bottomBar">
              {{ date }}
              <span style="color: #5b6d93;margin-left: 5px;">删除</span>
              <a-icon type="ellipsis" class="icon right" />
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="formBox">
      <p class="title">其他设置<span class="say">（非必填）</span></p>
      <div class="formItem mutiple">
        <span class="label">自动打标签</span>
        <div class="values addLabels">
          <p class="desc">点赞本朋友圈的客户，打上以下标签</p>
          <div class="selectLabelBox">
            <span class="selectBtn" @click="showBox(0, 'likeAddLabel')">
              <div v-if="isDisabled" class="disabledBox" @click="disabledClickHandle" />
              <span class="emptyBtn" v-if="likeAddLabel.length == 0">+ 添加标签</span>
              <span class="label_input_title" v-for="(item, index) in likeAddLabel" :key="index">
                {{ item.name }}
                <span class="delete" @click.stop="delTagHandle(item.id, index, 'likeAddLabel')">+</span>
              </span>
            </span>
          </div>
          <p class="desc">评论本朋友圈的客户，打上以下标签</p>
          <div class="selectLabelBox">
            <span class="selectBtn" @click="showBox(0, 'commentLabel')">
              <div v-if="isDisabled" class="disabledBox" @click="disabledClickHandle" />
              <span class="emptyBtn" v-if="commentLabel.length == 0">+ 添加标签</span>
              <span class="label_input_title" v-for="(item, index) in commentLabel" :key="index">
                {{ item.name }}
                <span class="delete" @click.stop="delTagHandle(item.id, index, 'commentLabel')">+</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <input type="file" accept="image/*" ref="uploadPhoto" @change="uploadPhoto" class="uploadFileInp" />
    <input type="file" accept="video/mp4" ref="uploadVideo" @change="uploadVideo" class="uploadFileInp" />

    <a-modal
      title="新增链接"
      :maskClosable="false"
      :width="600"
      :visible="contentLinkModalShow"
      class="contentLinkModal"
      :getContainer="() => $refs['momentsOperation_edit-page-container']"
      @cancel="closeLinkModal">
      <div class="modalFormBox">
        <div class="line">
          <a-input v-model="modalLinkObj.title" placeholder="请输入链接标题（必填）" />
          <span class="len">{{ modalLinkObj.title.length || '0' }}/42</span>
        </div>
        <div class="line">
          <a-input v-model="modalLinkObj.url" placeholder="输入http或https开头的链接地址（必填）" />
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
        <a-button @click="closeLinkModal">取消</a-button>
        <a-button type="primary" @click="confirmContentLink">确定</a-button>
      </template>
    </a-modal>
    <!-- 添加素材库弹窗 -->
    <a-modal v-model="contentLibraryModalShow" centered @ok="handleAddLibraryOk" width="95%">
      <MediumGroup :is-component="true" v-if="contentLibraryModalShow" @materialSelect="librarySelectChange" />
    </a-modal>
    <!-- 雷达选择toast -->
    <RadarChoose v-model="radarVisible" @handleAddRadarOk="handleAddRadarOk" />
    <label-select :state="chooseUserTagsModalShow" :addState="false" ref="labelSelect" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { departmentEmp, upLoad } from '@/api/common'
import LabelSelect from './components/LabelSelect.vue'
import { defaultLinkObj, defaultLibraryObj, isUrl, getLibraryMediaType, disabledBeforeDate, getMediaData, returnLabelJSONData } from './components/momentsUtils'
import { addMomentsItemReq, getMomentsItemInfoReq, setMomentsItemInfoReq, getMomentsItemExpectedNumReq } from '@/api/momentsOperation'
import RadarChoose from './components/radarToastComponent.vue'
export default {
  components: {
    'label-select': LabelSelect,
    RadarChoose,
    'MediumGroup': () => import('@/views/mediumGroup/index.vue')
  },
  data () {
    return {
      isDone: false,
      isDisabled: false,
      sendBol: true,
      date: moment().format('YYYY-MM-DD HH:MM'),
      treeData: [],
      // 企业成员选择
      employeeIds: [],
      selectUserType: 2,
      selectTagList: [],
      lablesModalType: '',
      // 选择标签弹窗
      chooseUserTagsModalShow: false,
      expectedNum: 0, // 预计人数
      content: '',
      // textarea可选按钮
      handleBtnArr: [
        {
          name: '图片',
          type: 'photo'
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
        },
        {
          name: '雷达',
          type: 'radar'
        }
      ],
      // 发送内容
      mediaType: '',
      uploadPhotoType: '',
      photos: [],
      videoUrl: {},
      contentLinkModalShow: false,
      modalLinkObj: { ...defaultLinkObj },
      contentLibraryModalShow: false,
      mediaFormLibrary: false, // 媒体来源是否为素材库(二次修改添加判断)
      modalLibraryObj: { ...defaultLibraryObj },
      radarVisible: false,
      modalRadarObj: {

      },
      sendDateType: 1,
      chooseSendDate: '',
      disabledBeforeDate,
      likeAddLabel: [],
      commentLabel: []
    }
  },
  watch: {
    selectUserType (e) {
      if (e === 2) {
        this.selectTagList = []
      }
    },
    selectTagList (e) {
      this.getMomentsItemExpectedNum()
    },
    employeeIds () {
      this.getMomentsItemExpectedNum()
    },
    'modalLinkObj.title' (e) {
      if (e.length > 42) {
        this.modalLinkObj.title = e.slice(0, 42)
      }
    },
    'modalLinkObj.desc' (e) {
      if (e.length > 170) {
        this.modalLinkObj.desc = e.slice(0, 170)
      }
    }
  },
  created () {
    if (this.$route.query.id) {
      this.getInfo(this.$route.query.id)
      this.getDepartmentEmp()
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
  },
  beforeRouteLeave (_, __, next) {
    // 导航离开当前路由的时候被调用，this可以被访问到
    // 编辑完成直接退出
    if (this.isDone || this.isDisabled) {
      next()
      return
    }
    if ((this.selectTagList.length || this.content || this.photos.length || this.videoUrl.url || this.modalLinkObj.title || this.likeAddLabel.length || this.commentLabel.length || this.chooseSendDate)) {
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
  destroyed () {
    window.removeEventListener('beforeunload', this.beforeunloadHandler, false)
  },
  methods: {
    beforeunloadHandler (e) {
      return '关闭'
    },
    async getInfo (id) {
      const { data } = await getMomentsItemInfoReq({ id })
      this.expectedNum = data.contact_expnum
      this.employeeIds = data.emp_ids.split(',')
      this.selectUserType = data.select_type
      this.selectTagList = data.cuslable_text
      this.contact_expnum = data.contact_expnum
      this.content = data.send_text
      const { mediaType, mediaData, target } = getMediaData('from', { data: data.media_text })
      this.mediaType = mediaType
      this[target] = mediaData
      this.sendDateType = data.group_type
      this.chooseSendDate = data.group_time
      this.commentLabel = data.commentlab_text
      this.likeAddLabel = data.likelab_text
      this.isDisabled = data.status !== 0
    },
    // 成员选择
    employeeIdsChange (e) {
      this.employeeIds = e
    },
    // 选择标签回调用父组件事件集
    showBox (e, targetLables) {
      if (e != -1) {
        let filterIdArr = []
        let filterInputArr = []
        if (e === 0) {
          filterIdArr = this[targetLables].map(item => item.id)
          filterInputArr = this[targetLables]
        }
        this.$refs.labelSelect.idArr = filterIdArr
        this.$refs.labelSelect.inputArr = filterInputArr
        this.lablesModalType = targetLables
      }
      this.chooseUserTagsModalShow = !this.chooseUserTagsModalShow
    },
    // 标签弹窗确认
    transmitLabel (e) {
      this[this.lablesModalType] = e
    },
    // 删除item
    // -1 默认 -2 排除 -3 群组
    delTagHandle (id, index, type) {
      let filterIdArr = []
      let filterInputArr = []
      filterIdArr = this[type].map((item) => item.id)
      filterInputArr = this[type]
      this[type] = this[type].filter((_, i) => i != index)
      this.$refs.labelSelect.setArr(id, index)
      this.$refs.labelSelect.idArr = filterIdArr
      this.$refs.labelSelect.inputArr = filterInputArr
    },
    // 发送内容集合
    // 选择单个发送类型
    chooseSendType (type) {
      if (type === 'photo') {
        this.uploadPhotoType = 'addContent'
        this.openSelectPhoto('addContent')
      } else {
        if (this.mediaType) {
          return
        }
        if (type === 'video') {
          this.$refs['uploadVideo'].click()
          this.mediaFormLibrary = false
        } else if (type === 'link') {
          this.contentLinkModalShow = true
          this.mediaFormLibrary = false
        } else if (type === 'library') {
          this.contentLibraryModalShow = true
        } else if (type === 'radar') {
          this.radarVisible = true
        }
      }
    },
    // 打开图片选择
    openSelectPhoto (type) {
      this.uploadPhotoType = type
      if (type === 'addContent' && this.mediaType) {
        return
      }
      this.$refs['uploadPhoto'].click()
      this.mediaFormLibrary = false
    },
    // 添加更多图片
    addMorePhoto () {
      if (this.mediaFormLibrary) {
        this.contentLibraryModalShow = true
      } else {
        this.uploadPhotoType = 'addContent'
        this.$refs['uploadPhoto'].click()
      }
    },
    // 上传图片
    async uploadPhoto (e) {
      const file = e.target.files[0]
      const splitArr = file.name.split('.')

      if (!['jpg', 'png'].includes(splitArr[splitArr.length - 1])) {
        return this.$message.warn('请上传 jpg, png 格式的图片文件')
      }
      if (file.size > 10 * 1000 * 1000) {
        return this.$message.warn('请上传小于10MB的图片文件')
      }
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('time', 1)
        const res = await upLoad(formData)
        const bol = await this.checkImageSize(res.data.fullPath, res.data.name)
        if (!bol) {
          e.target.value = ''
          return
        }
        if (this.uploadPhotoType === 'addContent') {
          console.log(res.data, 'res.data')
          this.photos.push({ url: res.data.fullPath, path: res.data.path })
          this.mediaType = 'photo'
        } else if (this.uploadPhotoType === 'addLinkPhoto') {
          this.modalLinkObj.pic = { url: res.data.fullPath, path: res.data.path }
        }
      } catch (e) {
        console.log(e, 'upload err')
      }
      e.target.value = ''
    },
    deletePhoto (index) {
      this.photos.splice(index, 1)
      if (!this.photos.length) {
        this.mediaType = ''
      }
    },
    // 检查目标是否合格
    checkImageSize (url, name = '', type = 'photo') {
      let dom
      if (type === 'photo') {
        dom = new Image()
      } else if (type === 'video') {
        dom = document.createElement('video')
      }
      if (!dom) return false
      const that = this
      dom.src = url
      return new Promise((resolve) => {
        if (type === 'photo') {
          dom.onload = function () {
            // 图片原始尺寸
            const originWidth = parseInt(this.width)
            const originHeight = parseInt(this.height)
            // 最大尺寸限制
            const maxWidth = 1440
            const maxHeight = 1080
            if (originWidth * originHeight > (maxWidth * maxHeight)) {
              that.$message.warn(`${name} 图片过大，图片长*款总像素不能超过1555200`)
              resolve(false)
            } else {
              resolve(true)
            }
          }
        } else {
          dom.onloadedmetadata = function () {
            const maxSeconds = 30
            if (dom.duration > maxSeconds) {
              that.$message.warn(`${name} 视频过长，请选择30秒以内的视频`)
              resolve(false)
            } else {
              resolve(true)
            }
          }
        }
      })
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
        const bol = await this.checkImageSize(res.data.fullPath, res.data.name, 'video')
        if (!bol) {
          e.target.value = ''
          return
        }
        this.videoUrl = { url: res.data.fullPath, path: res.data.path }
        this.mediaType = 'video'
      } catch (e) {
        console.log(e, 'upload video err')
      }
      e.target.value = ''
    },
    handleEditVideo () {
      if (this.mediaFormLibrary) {
        this.contentLibraryModalShow = true
      } else {
        this.$refs['uploadVideo'].click()
      }
    },
    closeLinkModal () {
      this.contentLinkModalShow = false
      // this.modalLinkObj = { ...defaultLinkObj }
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
      this.mediaType = 'link'
      this.closeLinkModal()
    },
    modalLinkEdit () {
      // if (this.mediaFormLibrary) {
      //   this.contentLibraryModalShow = true
      // } else {
      this.contentLinkModalShow = true
      // }
    },
    deleteLink () {
      this.mediaType = ''
      this.modalLinkObj = { ...defaultLinkObj }
    },
    // 素材库弹窗确认
    /*
      二次添加/编辑时 根据 mediaFormLibrary 判断从素材库获取还是本地获取
    */
    async handleAddLibraryOk () {
      if (this.modalLibraryObj.temporaryStroageArr.some(it => [4, 6, 7].includes(it.type_id))) {
        this.$message.warning('暂不支持文件、音频、小程序类型素材！')
        return
      }
      const typeId = this.modalLibraryObj.temporaryStroageArr[0].type_id
      const type = getLibraryMediaType(typeId)
      if (!(this.modalLibraryObj.temporaryStroageArr.every(it => it.type_id === typeId) && (!this.mediaType || type === this.mediaType))) {
        this.$message.warning('只能选择相同类型的素材！')
        return
      }
      if (!type) {
        this.$message.warning('类型识别错误，请重新选择素材！')
        return
      }
      if (type === 'photo') {
        if ((this.modalLibraryObj.temporaryStroageArr.length + this.photos.length) > 9) {
          this.$message.warning('图片最多选择九张！')
          return
        }
      } else {
        if (this.modalLibraryObj.temporaryStroageArr.length > 1) {
          this.$message.warning('只能选择一项素材！')
          return
        }
      }
      const content = this.modalLibraryObj.temporaryStroageArr[0].content
      if (type === 'text') {
        const str = this.content + content.content
        this.content = str.slice(0, 1000)
      } else {
        if (type === 'photo') {
          const mapLibraryPhotos = this.modalLibraryObj.temporaryStroageArr.map(it => ({
            url: it.content.imageFullPath,
            path: it.content.imagePath,
            name: it.content.title
          }))
          const bols = []
          for (const item of mapLibraryPhotos) {
            const bol = await this.checkImageSize(item.url, item.name)
            bols.push(bol)
          }
          if (!bols.every(b => b)) return
          this.photos = [...this.photos, ...mapLibraryPhotos]
        } else if (type === 'video') {
          const bol = await this.checkImageSize(content.videoFullPath, content.title, 'video')
          if (!bol) return
          this.videoUrl = { url: content.videoFullPath, path: content.imagePath }
        } else if (type === 'link') {
          this.modalLinkObj = {
            title: content.title,
            url: content.imageLink,
            pic: { url: content.imageFullPath, path: content.imagePath },
            desc: content.description
          }
        }
        this.mediaFormLibrary = true
        this.mediaType = type
      }
      this.contentLibraryModalShow = false
    },
    // 素材库选择Change
    librarySelectChange (e) {
      this.modalLibraryObj.temporaryStroageArr = e
    },
    send () {
      if (this.sendBol) {
        this.sendMomments()
      }
    },
    async sendMomments () {
      const that = this
      if (!this.employeeIds.length) {
        this.$message.warning('请选择执行员工！')
        return
      } else if (this.selectUserType === 1 && !this.selectTagList.length) {
        this.$message.warning('请选择筛选条件！')
        return
      } else if (!this.content.trim() && !this.mediaType) {
        this.$message.warning('请输入内容！')
        this.$refs['textareaRef'].focus()
        return
      } else if (this.sendDateType === 2 && !this.chooseSendDate) {
        this.$message.warning('请选择发送时间！')
        return
      } else if (this.expectedNum === 0) {
        this.$message.warning('预计送达客户数为0，朋友圈不能创建！')
        return
      }
      this.sendBol = false
      const obj = {
        emp_ids: this.employeeIds.join(','),
        select_type: this.selectUserType,
        contact_expnum: this.expectedNum,
        send_text: this.content,
        media_text: getMediaData('to', {
          mediaType: this.mediaType, photos: this.photos, videoUrl: this.videoUrl, linkObj: this.modalLinkObj
        }),
        group_type: this.sendDateType,
        likelab_text: returnLabelJSONData(this.likeAddLabel),
        commentlab_text: returnLabelJSONData(this.commentLabel),
        cuslable_text: returnLabelJSONData(this.selectTagList)
      }
      if (this.sendDateType === 2) {
        obj.group_time = this.chooseSendDate
      }
      try {
        if (this.$route.query.id) {
          obj.id = this.$route.query.id
          await setMomentsItemInfoReq(obj).then(response => {
            console.log(response, 'response')
            if (response.code === 200) {
              this.$message.success('编辑成功！')
              this.$nextTick(() => {
                this.$router.go(-1)
                this.sendBol = true
              })
            }
          }).catch(error => {
            const errorFileReader = new FileReader()
            errorFileReader.readAsText(error.response.data)
            errorFileReader.onload = function () {
              try {
                const resErrorData = JSON.parse(errorFileReader.result)
                console.log(resErrorData, '请求失败得到处理后的参数')
                that.$message.error(resErrorData.msg)
              } catch (error) {
                console.log(error, 'error')
              }
            }
          })
          // console.log(obj, 'obj')
        } else {
          await addMomentsItemReq(obj).then(response => {
            console.log(response, 'response')
            if (response.code === 200) {
              this.$message.success('添加成功！')
              this.$nextTick(() => {
                this.$router.go(-1)
                this.sendBol = true
              })
            }
          }).catch(error => {
            const errorFileReader = new FileReader()
            errorFileReader.readAsText(error.response.data)
            errorFileReader.onload = function () {
              try {
                const resErrorData = JSON.parse(errorFileReader.result)
                console.log(resErrorData, '请求失败得到处理后的参数')
                that.$message.error(resErrorData.msg)
              } catch (error) {
                console.log(error, 'error')
              }
            }
          })
        }
      } catch (_) {
        this.sendBol = true
      }
      this.isDone = true
    },
    // 获取最新的预计人数
    async getMomentsItemExpectedNum () {
      if (!this.employeeIds.length && this.expectedNum === 0) {
        return
      }

      const res = await getMomentsItemExpectedNumReq({
        empids: this.employeeIds.join(','),
        tagids: this.selectTagList.map(it => it.id).join(',')
      })
      this.expectedNum = res.data.count
    },
    disabledClickHandle (e) {
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      this.$message.warn('该任务已在进行中，无法更改！')
    },
    // 获取员工列表
    async getDepartmentEmp () {
      const { data } = await departmentEmp()
      this.treeData = data
    },
    handleAddRadarOk (list) {
      if (list.length !== 1) {
        this.$message.warning('只能选择一条内容')
        return
      }
      const target = list[0]
      const content = target.entry
      const isDev = content.linkImg.indexOf('https://yfscrm.oss-cn-beijing.aliyuncs.com') !== -1
      const startLen = isDev ? 43 : 44
      this.modalLinkObj = {
        title: content.linkTitle,
        url: target.link,
        pic: { url: content.linkImg, path: content.linkImgPath || content.linkImg.slice(startLen, content.linkImg.indexOf('?')) },
        desc: content.linkDigest,
        radarLink: '1',
        radarName: target.channelTxt
      }
      console.log(this.modalLinkObj, 'this.modalLinkObj')
      this.mediaType = 'link'
      this.radarVisible = false
    }
  }
}
</script>
<style lang='less'>
.momentsOperation_edit-page-container-dateItem {
  .ant-calendar-time-picker-combobox {
    .ant-calendar-time-picker-select {
      width: 50%;
    }

    .ant-calendar-time-picker-select:last-child {
      display: none;
    }
  }
}

.momentsOperation_edit-page-container {
  .selectPersonnelCom {
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

  .selectPersonnelComDisabled {
    pointer-events: none;
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
            padding-right: 10px;
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
@import './momentsEdit.less';
</style>
