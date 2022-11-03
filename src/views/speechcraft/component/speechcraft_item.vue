<!-- 单个话术 - 组件 -->
<template>
  <div class="speechcraft-item-component">
    <!-- 编辑模式 -->
    <template v-if="mode === 'edit'">
      <!-- 文本显示 -->
      <template v-if="item.type === 'text'">
        <div class="textarea-wrap">
          <a-textarea
            :rows="4"
            :maxLength="maxLength"
            v-model="item.text"
            placeholder="请输入文本"
          />
          <a-button
            class="delete-btn"
            size="small"
            icon="delete"
            @click="deleteItem"
            v-if="allowRemove"
          />
        </div>
        <div class="toolbar">
          <a-popover
            trigger="click"
            overlayClassName="speechcraft-emoji"
          >
            <template slot="content">
              <picker
                :i18n="emojiZhCn"
                :showSearch="false"
                :showPreview="false"
                :showCategories="false"
                @select="addEmoji"
              />
            </template>
            <a-button
              size="small"
              icon="smile"
            />
          </a-popover>
          <span>{{ `${item.text.length}/${maxLength}` }}</span>
        </div>
      </template>

      <!-- 图片显示 -->
      <template v-if="item.type === 'image'">
        <div class="file-wrap">
          <div class="upload-area">
            <ItemUpload
              :default-file-list="getFileList(item)"
              @upload="uploadItem"
              :accept="['png', 'jpg', 'jpeg']"
              icon="file-image"
              tip="单击或拖动图片到该区域进行上传"
            />
          </div>
          <a-button
            class="delete-btn"
            size="small"
            icon="delete"
            @click="deleteItem"
            v-if="allowRemove"
          />
          <span class="upload-tip">(图片大小不能超过5M)</span>
        </div>
      </template>

      <!-- 视频显示 -->
      <template v-if="item.type === 'video'">
        <div class="file-wrap">
          <div class="upload-area">
            <ItemUpload
              :default-file-list="getFileList(item)"
              @upload="uploadItem"
              :accept="['mp4', 'avi', 'mov']"
              :file-size="10"
              icon="video-camera"
              tip="单击或拖动视频到该区域进行上传"
            />
          </div>
          <a-button
            class="delete-btn"
            size="small"
            icon="delete"
            @click="deleteItem"
            v-if="allowRemove"
          />
          <span class="upload-tip">(视频大小不能超过10M)</span>
        </div>
      </template>

      <!-- 文件显示 -->
      <template v-if="item.type === 'file'">
        <div class="file-wrap">
          <div class="upload-area">
            <ItemUpload
              :default-file-list="getFileList(item)"
              @upload="uploadItem"
              :accept="[]"
              icon="file-add"
              tip="单击或拖动文件到该区域进行上传"
            />
          </div>
          <a-button
            class="delete-btn"
            size="small"
            icon="delete"
            @click="deleteItem"
            v-if="allowRemove"
          />
          <span class="upload-tip">(文件大小不能超过5M)</span>
        </div>
      </template>

      <!-- 链接显示 -->
      <template v-if="item.type === 'link'">
        <div class="common-wrap">
          <div class="common-content">
            <a-card
              hoverable
              style="width: 240px"
              @click="editLinkShow"
            >
              <img
                slot="cover"
                alt="thumbnail"
                :src="item.attachmentUrl"
              />
              <a-card-meta
                :title="item.linkTitle"
                :description="item.linkUrl"
              ></a-card-meta>
            </a-card>
            <a-button
              class="delete-btn"
              size="small"
              icon="delete"
              @click="deleteItem"
              v-if="allowRemove"
            />
          </div>
        </div>
      </template>

      <!-- 小程序显示 -->
      <template v-if="item.type === 'mini-app'">
        <div class="common-wrap">
          <div class="common-content">
            <a-card
              hoverable
              style="width: 240px"
              @click="editMiniappShow"
            >
              <img
                slot="cover"
                alt="thumbnail"
                :src="item.attachmentUrl"
              />
              <a-card-meta
                :title="item.miniappAppid"
                :description="item.miniappDesc"
              ></a-card-meta>
            </a-card>
            <a-button
              class="delete-btn"
              size="small"
              icon="delete"
              @click="deleteItem"
              v-if="allowRemove"
            />
          </div>
        </div>
      </template>

      <!-- 素材库显示 -->
      <template v-if="item.type === 'material'">
        <div class="common-wrap">
          <div class="common-content">
            <a-card
              hoverable
              style="width: 300px"
            >
              <img
                slot="cover"
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
              <a-card-meta
                title="Card title"
                description="This is the description"
              >
                <a-avatar
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </a-card-meta>
            </a-card>
            <a-button
              class="delete-btn"
              size="small"
              icon="delete"
              @click="deleteItem"
              v-if="allowRemove"
            />
          </div>
        </div>
      </template>
    </template>
    <!-- 查看模式 -->
    <template v-else>
      <!-- 文本显示 -->
      <template v-if="item.type === 'text'">
        <div class="textarea-wrap">
          {{ item.text }}
          <a-button-group class="delete-btn-group">
            <a-button
              size="small"
              icon="edit"
              @click="editItem"
              v-if="categoryId !== -1 && permission.includes(editFolder[tableIndex])"
            />
            <a-button
              v-permission="deletePermission"
              size="small"
              icon="delete"
              @click="shiftDeleteItem"
              v-if="permission.includes(deleteFolder[tableIndex])"
            />
          </a-button-group>
        </div>
      </template>

      <!-- 图片显示 -->
      <template v-if="item.type === 'image'">
        <div class="file-wrap">
          <div class="file-item">
            <viewer :images="[item.attachmentUrl]">
              <img
                v-for="src in [item.attachmentUrl]"
                :key="src"
                :src="src"
              >
            </viewer>
          </div>
          <span>{{ item.attachmentName }}</span>
          <a-button-group class="delete-btn-group">
            <a-button
              size="small"
              icon="edit"
              @click="editItem"
              v-if="categoryId !== -1 && permission.includes(editFolder[tableIndex])"
            />
            <a-button
              size="small"
              icon="delete"
              @click="shiftDeleteItem"
              v-if="permission.includes(deleteFolder[tableIndex])"
            />
          </a-button-group>
        </div>
      </template>

      <!-- 视频显示 -->
      <template v-if="item.type === 'video'">
        <div class="file-wrap">
          <div
            class="file-item"
            @click="previewVideoFunction"
          >
            <video
              :src="item.attachmentUrl"
              width="100%"
              height="100%"
            />
          </div>
          <span>{{ item.attachmentName }}</span>
          <a-button-group class="delete-btn-group">
            <a-button
              size="small"
              icon="edit"
              @click="editItem"
              v-if="categoryId !== -1 && permission.includes(editFolder[tableIndex])"
            />
            <a-button
              size="small"
              icon="delete"
              @click="shiftDeleteItem"
              v-if="permission.includes(deleteFolder[tableIndex])"
            />
          </a-button-group>
        </div>
      </template>

      <!-- 文件显示 -->
      <template v-if="item.type === 'file'">
        <div class="file-wrap">
          <div
            class="file-item"
            @click="downloadFunction"
            style="text-align: center;"
          >
            <a-icon
              type="file-text"
              style="font-size: 80px;"
            />
          </div>
          <span>{{ item.attachmentName }}</span>
          <a-button-group class="delete-btn-group">
            <a-button
              size="small"
              icon="edit"
              @click="editItem"
              v-if="categoryId !== -1 && permission.includes(editFolder[tableIndex])"
            />
            <a-button
              size="small"
              icon="delete"
              @click="shiftDeleteItem"
              v-if="permission.includes(deleteFolder[tableIndex])"
            />
          </a-button-group>
        </div>
      </template>

      <!-- 链接显示 -->
      <template v-if="item.type === 'link'">
        <div class="common-wrap">
          <a-card
            hoverable
            style="width: 240px"
            @click="openLink"
          >
            <img
              slot="cover"
              alt="thumbnail"
              :src="item.attachmentUrl"
            />
            <a-card-meta
              :title="item.linkTitle"
              :description="item.linkUrl"
            ></a-card-meta>
          </a-card>
          <a-button-group class="delete-btn-group">
            <a-button
              size="small"
              icon="edit"
              @click="editItem"
              v-if="categoryId !== -1 && permission.includes(editFolder[tableIndex])"
            />
            <a-button
              size="small"
              icon="delete"
              @click="shiftDeleteItem"
              v-if="permission.includes(deleteFolder[tableIndex])"
            />
          </a-button-group>
        </div>
      </template>

      <!-- 小程序显示 -->
      <template v-if="item.type === 'mini-app'">
        <div class="common-wrap">
          <a-card
            hoverable
            style="width: 240px"
          >
            <img
              slot="cover"
              alt="thumbnail"
              :src="item.attachmentUrl"
            />
            <a-card-meta
              :title="item.miniappAppid"
              :description="item.miniappDesc"
            ></a-card-meta>
          </a-card>
          <a-button-group class="delete-btn-group">
            <a-button
              size="small"
              icon="edit"
              @click="editItem"
              v-if="categoryId !== -1 && permission.includes(editFolder[tableIndex])"
            />
            <a-button
              size="small"
              icon="delete"
              @click="shiftDeleteItem"
              v-if="permission.includes(deleteFolder[tableIndex])"
            />
          </a-button-group>
        </div>
      </template>

      <!-- 视频预览窗口 -->
      <a-modal
        :visible="previewVideoVisible"
        :footer="null"
        @cancel="previewVideoVisible = false"
        centered
        width="600"
      >
        <video
          alt="preview"
          style="width: 100%"
          :src="previewVideo"
          controls
        />
      </a-modal>
    </template>

    <!-- 修改话术对话框 -->
    <a-modal
      width="830px"
      centered
      title="修改话术"
      :visible="editVisible"
      :confirm-loading="editLoading"
      @ok="handleEditItem"
      @cancel="editVisible=false"
    >
      <div>
        <!-- 修改模式 可以编辑 但不显示删除按钮 -->
        <SpeechcraftItem
          :item="editObj"
          :allow-remove="false"
          class="speechcraft-item"
        />
      </div>
    </a-modal>

    <!-- 编辑链接弹窗 修改此处同样需要修改speechcraft_view.vue中的新增弹窗 -->
    <a-modal
      v-model="editLinkVisible"
      centered
      title="修改链接"
      @ok="handleEditLinkOk"
      :width="700"
    >
      <a-row>
        <a-col :span="18">
          <a-form-model
            ref="editLinkForm"
            :model="editObj"
            :rules="editItemRules"
          >
            <a-form-model-item prop="linkTitle">
              <a-input
                v-model="editObj.linkTitle"
                placeholder="请输入链接标题(必填)"
                :maxLength="20"
                :suffix="`${(editObj.linkTitle || []).length}/20`"
                class="suffix-padding"
              />
            </a-form-model-item>
            <a-form-model-item prop="linkUrl">
              <a-input
                v-model="editObj.linkUrl"
                placeholder="请输入http或https开头的链接地址(必填)"
              />
            </a-form-model-item>
            <a-form-model-item>
              <a-textarea
                v-model="editObj.linkDesc"
                placeholder="请输入内容简介(选填)"
                :rows="5"
                :maxLength="200"
              />
              <span class="textarea-suffix">{{ `${(editObj.linkDesc || []).length}/200` }}</span>
            </a-form-model-item>
          </a-form-model>
        </a-col>
        <a-col :span="6">
          <div class="thumbnail-upload">
            <ItemUpload
              :default-file-list="getFileList(editObj)"
              @upload="editUploadItem"
              :accept="['png', 'jpg', 'jpeg']"
              icon="plus"
              tip="上传图片"
            />
            <span>图片限制在2MB以内</span>
          </div>
        </a-col>
      </a-row>
    </a-modal>

    <!-- 编辑小程序弹窗 修改此处同样需要修改speechcraft_view.vue中的新增弹窗 -->
    <a-modal
      v-model="editMiniappVisible"
      centered
      title="修改小程序"
      @ok="handleEditMiniappOk"
      :width="700"
    >
      <p>请填写企业微信后台绑定的小程序，否则会造成发送失败</p>
      <a-row>
        <a-col :span="18">
          <a-form-model
            ref="editMiniappForm"
            :model="editObj"
            :rules="editItemRules"
          >
            <a-form-model-item prop="miniappAppid">
              <a-input
                v-model="editObj.miniappAppid"
                placeholder="请输入小程序APPID(必填)"
                :maxLength="200"
                :suffix="`${(editObj.miniappAppid || []).length}/200`"
                class="suffix-padding"
              />
            </a-form-model-item>
            <a-form-model-item prop="miniappPath">
              <a-input
                v-model="editObj.miniappPath"
                placeholder="请输入小程序页面路径(必填)"
                :maxLength="200"
                :suffix="`${(editObj.miniappPath || []).length}/200`"
                class="suffix-padding"
              />
            </a-form-model-item>
            <a-form-model-item prop="miniappDesc">
              <a-textarea
                v-model="editObj.miniappDesc"
                placeholder="请输入小程序的描述(必填)"
                :rows="5"
                :maxLength="20"
              />
              <span class="textarea-suffix">{{ `${(editObj.miniappDesc || []).length}/20` }}</span>
            </a-form-model-item>
          </a-form-model>
        </a-col>
        <a-col :span="6">
          <div class="thumbnail-upload">
            <ItemUpload
              :default-file-list="getFileList(editObj)"
              @upload="editUploadItem"
              :accept="['png', 'jpg', 'jpeg']"
              icon="plus"
              tip="上传图片"
            />
            <span>图片限制在2MB以内</span>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable */
import { Picker } from 'emoji-mart-vue'
import store from '@/store'

export default {
  name: 'SpeechcraftItem',
  components: {
    Picker,
    ItemUpload: () => import('./item_upload.vue')
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: null
    },
    mode: {
      type: String,
      default: 'edit'
    },
    // 传入categoryId用于区分是否查看的回收站 仅查看时有效
    categoryId: {
      type: Number,
      default: null
    },
    // 编辑状态 虽然可以修改 但是不能删除
    allowRemove: {
      type: Boolean,
      default: true
    },
    // 查看模式下的修改权限
    editPermission: {
      type: String,
      default: null
    },
    // 查看模式下的删除权限
    deletePermission: {
      type: String,
      default: null
    }
  },
  watch: {},
  data() {
    return {
      emojiZhCn: {
        search: '搜索',
        notfound: '未找到Emoji',
        categories: {
          search: '搜索结果',
          recent: '最近使用',
          people: '人物',
          nature: '动物',
          foods: '食物',
          activity: '活动',
          places: '地点',
          objects: '物品',
          symbols: '符号',
          flags: '旗帜',
          custom: '自定义'
        }
      },
      // 文本允许的最大长度
      maxLength: 1000,
      // 视频预览窗口可见性
      previewVideoVisible: false,
      // 视频图片URL
      previewVideo: null,
      // 点击已添加的链接 编辑对话框可见性
      editLinkVisible: false,
      // 点击已添加的小程序 编辑对话框可见性
      editMiniappVisible: false,
      editItemRules: {
        linkTitle: [{ required: true, message: '链接标题不能为空', trigger: 'blur' }],
        linkUrl: [{ required: true, message: '链接地址不能为空', trigger: 'blur' }],
        miniappAppid: [{ required: true, message: '小程序APPID不能为空', trigger: 'blur' }],
        miniappPath: [{ required: true, message: '小程序页面路径不能为空', trigger: 'blur' }],
        miniappDesc: [{ required: true, message: '小程序描述不能为空', trigger: 'blur' }]
      },
      // 编辑单个item时复制的对象
      editObj: {},
      // 修改单条话术对话框可见性
      editVisible: false,
      // 单条话术修改中
      editLoading: false,
      // 页面权限
      permission: [],
      // 根据路由获取按钮绑定的权限
      editFolder: [
        '/speechcraft/company@editFolder',
        '/speechcraft/department@editFolder',
        '/speechcraft/individual@editFolder'
      ],
      deleteFolder: [
        '/speechcraft/company@deleteFolder',
        '/speechcraft/department@deleteFolder',
        '/speechcraft/individual@deleteFolder'
      ],
      tableIndex: 0,
      pageRouter: ['/speechcraft/company', '/speechcraft/department', '/speechcraft/individual']
    }
  },
  created() {
    this.getPermission()
  },
  methods: {
     getPermission() {
      this.tableIndex = this.pageRouter.indexOf(this.$route.path)
      const sideMenus = store.state.permission.permissionList
      sideMenus[0].children.map((item) => {
        if (item.children.length > 0) {
          item.children.map((items) => {
            if (items.path == this.$route.path) {
              this.permission = items.meta.actionList
            }
          })
        }
      })
    },
    // 选择表情
    addEmoji: function (e) {
      // 一个表情占2长度 在长度不超的情况下才添加
      if (this.item.text.length < this.maxLength - 2) {
        this.item.text += e.native
      }
    },
    // 删除当前
    deleteItem: function () {
      if (this.allowRemove) {
        this.$emit('remove', this.item)
      }
    },
    // 上传文件回调
    uploadItem: function (ossFile) {
      // 临时访问URL 没啥用
      this.$set(this.item, 'attachmentUrl', ossFile.fullPath)
      // oss路径 查看附件时需要用此值换取临时URL
      this.$set(this.item, 'attachmentKey', ossFile.path)
      // 文件名
      this.$set(this.item, 'attachmentName', ossFile.name)
      // 文件扩展名
      this.$set(this.item, 'attachmentExt', ossFile.name.substring(ossFile.name.lastIndexOf('.') + 1))
    },
    // 修改上传文件回调
    editUploadItem: function (ossFile) {
      // 临时访问URL 没啥用
      this.$set(this.editObj, 'attachmentUrl', ossFile.fullPath)
      // oss路径 查看附件时需要用此值换取临时URL
      this.$set(this.editObj, 'attachmentKey', ossFile.path)
      // 文件名
      this.$set(this.editObj, 'attachmentName', ossFile.name)
      // 文件扩展名
      this.$set(this.editObj, 'attachmentExt', ossFile.name.substring(ossFile.name.lastIndexOf('.') + 1))
    },
    // 打开视频预览窗口
    previewVideoFunction: function () {
      if (this.item.attachmentExt === 'avi') {
        this.$message.warning('浏览器不支持预览AVI格式，已为您自动下载文件。')
        this.downloadFunction()
      } else {
        // 打开预览
        this.previewVideoVisible = true
        this.previewVideo = this.item.attachmentUrl
      }
    },
    // 下载OSS文件
    downloadFunction: function () {
      this.getBlob(this.item.attachmentUrl).then((blob) => {
        this.saveAs(blob, this.item.attachmentName)
      })
    },
    /**
     * 获取 blob
     * @param  {String} url 目标文件地址
     * @return {Promise}
     */
    getBlob: function (url) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response)
          }
        }
        xhr.send()
      })
    },
    /**
     * 保存
     * @param  {Blob} blob
     * @param  {String} filename 想要保存的文件名称
     */
    saveAs: function (blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename)
      } else {
        const link = document.createElement('a')
        const body = document.querySelector('body')
        link.href = window.URL.createObjectURL(blob)
        link.download = filename
        link.style.display = 'none'
        body.appendChild(link)
        link.click()
        body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
      }
    },
    // 点击链接
    openLink: function () {
      window.open(this.item.linkUrl)
    },
    // 生成随机UUID
    uuid: function () {
      let s = []
      let hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'
      return s.join('')
    },
    // 编辑时将上传的附件还原回文件列表用以回显
    getFileList: function (item) {
      if (item.attachmentUrl && item.attachmentName) {
        return [
          {
            uid: item.id || this.uuid(),
            name: item.attachmentName,
            url: item.attachmentUrl,
            status: 'done'
          }
        ]
      } else {
        return []
      }
    },
    // 点击已有链接 打开编辑窗
    editLinkShow: function () {
      this.editObj = JSON.parse(JSON.stringify(this.item))
      this.editLinkVisible = true
    },
    // 点击已有小程序 打开编辑窗
    editMiniappShow: function () {
      this.editObj = JSON.parse(JSON.stringify(this.item))
      this.editMiniappVisible = true
    },
    // 编辑链接点击OK
    handleEditLinkOk: function () {
      // 先检查可用性
      this.$refs.editLinkForm.validate((valid) => {
        if (valid) {
          // 检查URL合法性
          if (!this.editObj.linkUrl.startsWith('http://') && !this.editObj.linkUrl.startsWith('https://')) {
            this.$notification.error({
              message: '提示',
              description: `请输入正确的链接地址`
            })
            return
          }

          // 基本项校验通过 再检查图片是否上传
          if (!this.editObj.attachmentUrl || !this.editObj.attachmentKey) {
            this.$notification.error({
              message: '提示',
              description: `请上传图片`
            })
            return
          }
          // 校验通过
          Object.assign(this.item, JSON.parse(JSON.stringify(this.editObj)))
          this.editLinkVisible = false
        } else {
          return false
        }
      })
    },
    // 编辑小程序点击OK
    handleEditMiniappOk: function () {
      // 先检查可用性
      this.$refs.editMiniappForm.validate((valid) => {
        if (valid) {
          // 基本项校验通过 再检查图片是否上传
          if (!this.editObj.attachmentUrl || !this.editObj.attachmentKey) {
            this.$notification.error({
              message: '提示',
              description: `请上传图片`
            })
            return
          }
          // 校验通过
          Object.assign(this.item, JSON.parse(JSON.stringify(this.editObj)))
          this.editMiniappVisible = false
        } else {
          return false
        }
      })
    },
    // 编辑单条Item
    editItem: function () {
      this.editObj = JSON.parse(JSON.stringify(this.item))
      this.editVisible = true
    },
    // 彻底删除单条Item
    shiftDeleteItem: function () {
      let that = this
      this.$confirm({
        centered: true,
        title: '确定删除？',
        content: '此项操作将彻底删除本条话术。',
        onOk() {
          that.$http.delete(`/speechcraftItem/deleteItem?itemId=${that.item.id}`).then((response) => {
            if (response.code === 200) {
              // 删除成功
              that.$notification.success({
                message: '提示',
                description: '删除成功'
              })
              that.$emit('remove', that.item)
            } else {
              // 删除失败
              that.$notification.error({
                message: '提示',
                description: response.msg
              })
            }
          })
        },
        onCancel() {}
      })
    },
    handleEditItem: function () {
      this.editLoading = true
      this.$http.put(`/speechcraft/update`, { speechcraftItemList: [this.editObj] }).then((response) => {
        this.editLoading = false
        if (response.code === 200) {
          this.editVisible = false
          // 修改成功
          this.$notification.success({
            message: '提示',
            description: '修改成功'
          })
          // 重新加载列表
          this.$emit('remove')
        } else {
          // 修改失败
          this.$notification.error({
            message: '提示',
            description: response.msg
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.speechcraft-item-component {
  overflow: hidden;

  .toolbar {
    float: right;
    margin-top: 5px;
  }
}

.textarea-wrap {
  position: relative;

  .delete-btn {
    display: none;
    position: absolute;
    top: 5px;
    right: 5px;
  }

  &:hover .delete-btn {
    display: block;
  }

  .delete-btn-group {
    display: none;
    position: absolute;
    top: 0;
    right: 5px;
  }

  &:hover .delete-btn-group {
    display: block;
  }
}

.file-wrap {
  position: relative;

  .upload-area {
    border: 1px solid #d9d9d9;
    padding: 10px;
    transition: all 0.3s, height 0s !important;

    &:hover {
      border-color: #40a9ff;
    }
  }

  .file-item {
    width: 100px;
    height: 100px;
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;

    div,
    img {
      width: 100%;
      height: 100%;
    }
  }

  .upload-tip {
    position: absolute;
    color: #999999;
    right: 15px;
    top: 120px;
    font-size: 13px;
  }

  .delete-btn {
    display: none;
    position: absolute;
    top: 5px;
    right: 5px;
  }

  &:hover .delete-btn {
    display: block;
  }

  .delete-btn-group {
    display: none;
    position: absolute;
    top: 0;
    right: 5px;
  }

  &:hover .delete-btn-group {
    display: block;
  }
}

.common-wrap {
  position: relative;

  .common-content {
    border: 1px solid #d9d9d9;
    padding: 10px;
    transition: all 0.3s, height 0s !important;

    &:hover {
      border-color: #40a9ff;
    }

    .delete-btn {
      display: none;
      position: absolute;
      top: 5px;
      right: 5px;
    }

    &:hover .delete-btn {
      display: block;
    }
  }

  .delete-btn-group {
    display: none;
    position: absolute;
    top: 0;
    right: 5px;
  }

  &:hover .delete-btn-group {
    display: block;
  }
}

.thumbnail-upload {
  width: 130px;
  margin: 0 auto;

  span {
    display: block;
    margin-top: 10px;
    font-size: 13px;
    text-align: center;
  }
}

.suffix-padding {
  ::v-deep input {
    padding-right: 70px !important;
  }
}

.textarea-suffix {
  position: absolute;
  bottom: -10px;
  right: 10px;
}
</style>

<style>
.speechcraft-emoji .ant-popover-inner-content {
  padding: 3px !important;
}
</style>
