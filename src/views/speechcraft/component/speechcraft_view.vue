<!-- 话术列表 - 组件 -->
<template>
  <div>
    <a-spin
      :spinning="loading"
      :indicator="indicator"
    >
      <a-card
        :title="!isSearching ? '营销话术' : ''"
        class="card-container"
      >
        <template
          slot="extra"
          v-if="!isSearching"
        >
          <a-form layout="inline">
            <a-form-item>
              <a-button
                v-permission="addPermission"
                type="primary"
                slot="extra"
                :disabled="disableAllFunction"
                @click="addSpeechcraft()"
              >添加话术</a-button>
            </a-form-item>
            <a-form-item>
              <a-button
                v-permission="importPermission"
                type="primary"
                slot="extra"
                :disabled="disableAllFunction"
                @click="importSpeechcraft()"
              >导入话术</a-button>
            </a-form-item>
          </a-form>
        </template>

        <div v-if="dataList.length === 0">
          <a-list :data-source="[]" />
        </div>
        <transition-group
          class="transition-wrapper"
          name="sort"
          v-else
        >
          <a-card
            size="small"
            class="sort-item"
            v-for="(item) in dataList"
            :key="item.id"
            :title="item.title"
            :draggable="true"
            @dragstart="dragStart(item)"
            @dragenter="dragEnter(item, $event)"
            @dragend="dragEnd(item, $event)"
            @dragover="dragOver($event)"
          >
            <template slot="extra">
              <span style="margin-right: 20px;">{{ item.sendCount }} 次点击发送</span>
              <!-- 回收站之外的按钮 修改 + 回收站 + 转移 -->
              <a-button-group v-if="categoryId !== -1">
                <a-button
                  v-permission="editPermission"
                  size="small"
                  :disabled="disableAllFunction"
                  icon="edit"
                  @click.stop="editSpeechcraft(item)"
                />
                <a-button
                  v-permission="deletePermission"
                  size="small"
                  :disabled="disableAllFunction"
                  icon="delete"
                  @click.stop="deleteSpeechcraft(item)"
                />
                <a-button
                  v-if="permission.includes(transferPermisson[tableIndex])"
                  size="small"
                  :disabled="disableAllFunction"
                  icon="swap"
                  @click.stop="swapSpeechcraftShow(item)"
                />
              </a-button-group>
              <!-- 回收站中的按钮 还原 + 彻底删除 -->
              <a-button-group v-else>
                <a-button
                  v-if="permission.includes(restorePermission[tableIndex])"
                  size="small"
                  icon="undo"
                  @click.stop="recoverSpeechcraftShow(item)"
                />
                <a-button
                  v-permission="deletePermission"
                  size="small"
                  icon="delete"
                  @click.stop="deleteSpeechcraft(item, true)"
                />
              </a-button-group>
            </template>
            <div>
              <!-- 查看模式 悬浮可显示修改和删除按钮 传入categoryId用于区分是否查看的回收站 -->
              <SpeechcraftItem
                mode="view"
                :edit-permission="editPermission"
                :delete-permission="deletePermission"
                :item="item1"
                :key="`itemView${index1}`"
                v-for="(item1, index1) in item.speechcraftItemList"
                class="speechcraft-item-view"
                :category-id="categoryId"
                @remove="deleteItem"
              />
            </div>
          </a-card>
        </transition-group>

        <a-pagination
          style="margin-top: 20px;"
          size="small"
          show-quick-jumper
          :hideOnSinglePage="true"
          :total="total"
          :show-total="i => `共${i}条`"
          @change="onChangePage"
          :page-size.sync="pageSize"
        />
      </a-card>
    </a-spin>

    <!-- 添加话术对话框 -->
    <a-modal
      width="830px"
      centered
      title="添加话术"
      :visible="addVisible"
      :confirm-loading="addLoading"
      @ok="handleAddSpeechcraft"
      @cancel="addVisible=false"
    >
      <a-form-model
        ref="addSpeechcraftForm"
        :model="speechcraft"
        :rules="rules"
      >
        <a-form-model-item prop="title">
          <a-input
            placeholder="请输入标题"
            v-model="speechcraft.title"
            :maxLength="20"
            :suffix="`${speechcraft.title.length}/20`"
          />
        </a-form-model-item>
      </a-form-model>

      <div v-if="itemList.length === 0">
        <div class="ant-list ant-list-split">
          <div class="ant-spin-nested-loading">
            <div class="ant-spin-container">
              <div class="ant-list-empty-text">
                <div class="ant-empty ant-empty-normal">
                  <div class="ant-empty-image">
                    <svg
                      width="64"
                      height="41"
                      viewBox="0 0 64 41"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        transform="translate(0 1)"
                        fill="none"
                        fillRule="evenodd"
                      >
                        <ellipse
                          fill="#F5F5F5"
                          cx="32"
                          cy="33"
                          rx="32"
                          ry="7"
                        ></ellipse>
                        <g
                          fillRule="nonzero"
                          stroke="#D9D9D9"
                        >
                          <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                          <path
                            d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                            fill="#FAFAFA"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <p class="ant-empty-description">点击下方可添加多条话术，组成话术组</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style="min-height: 166px;"
        v-else
      >
        <!-- 新增模式 可以编辑 悬浮显示删除按钮(前端移除) -->
        <SpeechcraftItem
          :item="item"
          :key="item.uuid + index"
          v-for="(item, index) in itemList"
          class="speechcraft-item"
          @remove="removeItem"
        />
      </div>

      <div class="add-btn-group">
        <a-button @click="addText">+ 文本</a-button>
        <a-button @click="addImage">+ 图片</a-button>
        <a-button @click="addVideo">+ 视频</a-button>
        <a-button @click="addFile">+ 文件</a-button>
        <a-button @click="addLink">+ 链接</a-button>
        <a-button @click="addMiniApp">+ 小程序</a-button>
        <a-button @click="addMaterialLibrary">+ 素材库</a-button>
      </div>
    </a-modal>

    <!-- 修改话术对话框 -->
    <a-modal
      width="830px"
      centered
      title="修改话术"
      :visible="editVisible"
      :confirm-loading="editLoading"
      @ok="handleEditSpeechcraft"
      @cancel="editVisible=false"
    >
      <!-- 修改话术名称 -->
      <a-form-model
        ref="editSpeechcraftForm"
        :model="editSpeechcraftObject"
        :rules="rules"
      >
        <a-form-model-item prop="title">
          <a-input
            placeholder="请输入标题"
            v-model="editSpeechcraftObject.title"
            :maxLength="20"
            :suffix="`${editSpeechcraftObject.title.length}/20`"
          />
        </a-form-model-item>
      </a-form-model>

      <div v-if="(editSpeechcraftObject.speechcraftItemList || []).length === 0">
        <a-list :data-source="[]" />
      </div>
      <div
        style="min-height: 166px;"
        v-else
      >
        <!-- 修改模式 可以编辑 但不显示删除按钮 -->
        <SpeechcraftItem
          :item="item"
          :key="index"
          v-for="(item, index) in editSpeechcraftObject.speechcraftItemList"
          :allow-remove="false"
          class="speechcraft-item"
          @remove="removeItem"
        />
      </div>
    </a-modal>

    <!-- 导入话术对话框 -->
    <a-modal
      width="600px"
      centered
      title="导入话术"
      :visible="importVisible"
      :confirm-loading="importLoading"
      @ok="handleUpload"
      @cancel="importVisible=false"
    >
      <div style="margin-bottom: 30px;">
        <p class="import-text">下载模板</p>
        <p class="import-tip">导入话术前请下载模板，按照模板格式导入。</p>
        <a-button
          type="primary"
          @click="downloadTemplate"
        >下载模板</a-button>
      </div>
      <div>
        <p class="import-text">上传文件</p>
        <p class="import-tip">仅支持xlsx格式，文件最大100MB</p>
        <a-upload
          :file-list="importFileList"
          :remove="handleImportRemove"
          :before-upload="beforeImportUpload"
          @change="handleImportChange"
        >
          <a-button type="primary">上传文件</a-button>
        </a-upload>
      </div>
    </a-modal>

    <!-- 添加链接弹窗 修改此处同样需要修改speechcraft_item.vue中的修改弹窗 -->
    <a-modal
      v-model="addLinkVisible"
      centered
      title="添加链接"
      @ok="handleAddLinkOk"
      :width="700"
    >
      <a-row>
        <a-col :span="18">
          <a-form-model
            ref="addLinkForm"
            :model="formItem"
            :rules="addItemRules"
          >
            <a-form-model-item prop="linkTitle">
              <a-input
                v-model="formItem.linkTitle"
                placeholder="请输入链接标题(必填)"
                :maxLength="20"
                :suffix="`${(formItem.linkTitle || []).length}/20`"
                class="suffix-padding"
              />
            </a-form-model-item>
            <a-form-model-item prop="linkUrl">
              <a-input
                v-model="formItem.linkUrl"
                placeholder="请输入http或https开头的链接地址(必填)"
              />
            </a-form-model-item>
            <a-form-model-item>
              <a-textarea
                v-model="formItem.linkDesc"
                placeholder="请输入内容简介(选填)"
                :rows="5"
                :maxLength="200"
              />
              <span class="textarea-suffix">{{ `${(formItem.linkDesc || []).length}/200` }}</span>
            </a-form-model-item>
          </a-form-model>
        </a-col>
        <a-col :span="6">
          <div class="thumbnail-upload">
            <ItemUpload
              @upload="uploadThumbnail"
              :accept="['png', 'jpg', 'jpeg']"
              icon="plus"
              tip="上传图片"
            />
            <span>图片限制在2MB以内</span>
          </div>
        </a-col>
      </a-row>
    </a-modal>

    <!-- 添加小程序弹窗 修改此处同样需要修改speechcraft_item.vue中的修改弹窗 -->
    <a-modal
      v-model="addMiniappVisible"
      centered
      title="添加小程序"
      @ok="handleAddMiniappOk"
      :width="700"
    >
      <p>请填写企业微信后台绑定的小程序，否则会造成发送失败</p>
      <a-row>
        <a-col :span="18">
          <a-form-model
            ref="addMiniappForm"
            :model="formItem"
            :rules="addItemRules"
          >
            <a-form-model-item prop="miniappAppid">
              <a-input
                v-model="formItem.miniappAppid"
                placeholder="请输入小程序APPID(必填)"
                :maxLength="200"
                :suffix="`${(formItem.miniappAppid || []).length}/200`"
                class="suffix-padding"
              />
            </a-form-model-item>
            <a-form-model-item prop="miniappPath">
              <a-input
                v-model="formItem.miniappPath"
                placeholder="请输入小程序页面路径(必填)"
                :maxLength="200"
                :suffix="`${(formItem.miniappPath || []).length}/200`"
                class="suffix-padding"
              />
            </a-form-model-item>
            <a-form-model-item prop="miniappDesc">
              <a-textarea
                v-model="formItem.miniappDesc"
                placeholder="请输入小程序的描述(必填)"
                :rows="5"
                :maxLength="20"
              />
              <span class="textarea-suffix">{{ `${(formItem.miniappDesc || []).length}/20` }}</span>
            </a-form-model-item>
          </a-form-model>
        </a-col>
        <a-col :span="6">
          <div class="thumbnail-upload">
            <ItemUpload
              @upload="uploadThumbnail"
              :accept="['png', 'jpg', 'jpeg']"
              icon="plus"
              tip="上传图片"
            />
            <span>图片限制在2MB以内</span>
          </div>
        </a-col>
      </a-row>
    </a-modal>

    <!-- 添加素材库弹窗 修改此处同样需要修改speechcraft_item.vue中的修改弹窗 -->
    <a-modal
      title="素材库"
      v-model="addMaterialVisible"
      centered
      @ok="handleAddMaterialOk"
      width="95%"
    >
      <MediumGroup
        :is-component="true"
        v-if="addMaterialVisible"
        @materialSelect="materialSelectChange"
      />
    </a-modal>

    <!-- 还原弹窗 -->
    <a-modal
      title="还原"
      centered
      v-model="recoverVisible"
      :width="550"
      :ok-button-props="{ props: { disabled: !recoverCategory } }"
      @ok="handleRecoverOk"
      :confirm-loading="recoverLoading"
    >
      <div>
        <SpeechcraftCategory
          mode="selector"
          @selectChange="recoverChange"
          :type="type"
          :selector-dept="deptId"
          v-if="recoverVisible"
        />
        <a-row>
          <a-col :span="16"><span v-if="recoverCategory">您已选择: {{ recoverCategory.path }}</span></a-col>
          <a-col :span="8"><span class="recover-tip">若无满足项，请先创建分组。</span></a-col>
        </a-row>
      </div>
    </a-modal>

    <!-- 转移分组弹窗 -->
    <a-modal
      title="转移分组"
      centered
      v-model="swapVisible"
      :width="550"
      :ok-button-props="{ props: { disabled: !swapCategory } }"
      @ok="handleSwapOk"
      :confirm-loading="swapLoading"
    >
      <div>
        <SpeechcraftCategory
          mode="selector"
          @selectChange="swapChange"
          :type="type"
          :selector-dept="deptId"
          v-if="swapVisible"
        />
        <a-row>
          <a-col :span="16"><span v-if="swapCategory">您已选择: {{ swapCategory.path }}</span></a-col>
          <a-col :span="8"><span class="recover-tip">若无满足项，请先创建分组。</span></a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
/* eslint-disable */
import { downLoadBlobByParam } from '@/utils/downloadUtil.js'
import store from '@/store'

export default {
  name: 'SpeechcraftView',
  components: {
    SpeechcraftCategory: () => import('./speechcraft_category.vue'),
    SpeechcraftItem: () => import('./speechcraft_item.vue'),
    ItemUpload: () => import('./item_upload.vue'),
    MediumGroup: () => import('@/views/mediumGroup/index.vue')
  },
  props: {
    type: {
      type: String,
      default: '公司话术'
    },
    categoryId: {
      type: Number,
      default: null
    },
    deptId: {
      type: Number,
      default: null
    },
    // 是否正在全局搜索 全局搜索时不显示标题与按钮 categoryId无效 点击左侧文件夹进入文件夹搜索 退出此状态
    isSearching: {
      type: Boolean,
      default: false
    },
    // 搜索的关键字 全局搜索或文件夹搜索的时候都有效
    keyword: {
      type: String,
      default: ''
    },
    // 增加权限
    addPermission: {
      type: String,
      required: true
    },
    // 修改+拖拽权限
    editPermission: {
      type: String,
      required: true
    },
    // 删除权限
    deletePermission: {
      type: String,
      required: true
    },
    // 导入权限
    importPermission: {
      type: String,
      required: true
    }
  },
  watch: {
    categoryId: {
      immediate: true,
      handler: function (val) {
        // 查看的分类发生改变 重新加载数据
        if (val) {
          this.getDataList()
        }
      }
    },
    keyword: {
      immediate: true,
      handler: function (val) {
        this.pageIndex = 1
        if (this.isSearching) {
          this.getAllList()
        } else {
          this.getDataList()
        }
      }
    }
  },
  computed: {
    disableAllFunction() {
      return this.categoryId === -1
    }
  },
  data() {
    return {
      formItem: {},
      loading: true,
      indicator: <a-icon type="loading" style="font-size: 24px" spin />,
      // 添加话术可见性
      addVisible: false,
      // 导入话术可见性
      importVisible: false,
      // 修改话术可见性
      editVisible: false,
      // 添加话术对话框中 添加链接子对话框可见性
      addLinkVisible: false,
      // 添加话术对话框中 添加小程序子对话框可见性
      addMiniappVisible: false,
      // 添加话术对话框中 添加素材库子对话框可见性
      addMaterialVisible: false,
      // 回收站内 还原话术对话框可见性
      recoverVisible: false,
      // 转移话数组对话框可见性
      swapVisible: false,
      // 添加话术对象
      speechcraft: {
        title: ''
      },
      // 修改话术对象
      editSpeechcraftObject: {
        title: ''
      },
      // 话术组
      dataList: [],
      // 添加/编辑话术组时单个话术组中的话术集合
      itemList: [],
      // 页码
      pageIndex: 1,
      // 分页大小
      pageSize: 10,
      // 总数据数
      total: 0,
      oldData: null,
      newData: null,
      addLoading: false,
      editLoading: false,
      importLoading: false,
      rules: {
        title: [{ required: true, message: '话术标题不能为空', trigger: 'blur' }]
      },
      addItemRules: {
        linkTitle: [{ required: true, message: '链接标题不能为空', trigger: 'blur' }],
        linkUrl: [{ required: true, message: '链接地址不能为空', trigger: 'blur' }],
        miniappAppid: [{ required: true, message: '小程序APPID不能为空', trigger: 'blur' }],
        miniappPath: [{ required: true, message: '小程序页面路径不能为空', trigger: 'blur' }],
        miniappDesc: [{ required: true, message: '小程序描述不能为空', trigger: 'blur' }]
      },
      // 导入话术上传文件
      importFileList: [],
      // 还原时 选中的分类
      recoverCategory: null,
      // 准备还原的话术组
      recoverSpeechcraft: null,
      // 还原中
      recoverLoading: false,
      // 转移话术转移中
      swapLoading: false,
      // 转移话术时 选中的分类
      swapCategory: null,
      // 准备转移话术到的话术组
      swapSpeechcraft: null,
      // 素材库已选条目
      materialSelectedItems: [],
      // 页面权限
      permission: [],
      // 根据路由获取按钮绑定的权限
      transferPermisson: [
        '/speechcraft/company@transfer',
        '/speechcraft/department@transfer',
        '/speechcraft/individual@transfer'
      ],
      restorePermission: [
        '/speechcraft/company@restoreFolder',
        '/speechcraft/department@restoreFolder',
        '/speechcraft/individual@restoreFolder'
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
      // console.log(this.permission);
      },
    getDataList: function () {
      if (!this.categoryId) {
        return
      }
      this.loading = true
      let param = {
        params: {
          page: this.pageIndex,
          size: this.pageSize,
          keyword: this.keyword
        }
      }
      // 如果this.categoryId === -1 则继续传递 type和deptId 用于区分回收站内不同的数据(因为回收站的ID都是-1)
      if (this.categoryId === -1) {
        param.params.type = this.type
        param.params.deptId = this.deptId
      }

      this.$http.get(`/speechcraft/getByCategoryId/${this.categoryId}`, param).then((response) => {
        this.dataList = response.data.records || []
        this.total = response.data.total || 0
        setTimeout(() => (this.loading = false), 500)
      })
    },
    // 全局搜索 根据keyword筛选查询所有categoryId中数据
    getAllList: function () {
      this.loading = true
      let param = {
        params: {
          page: this.pageIndex,
          size: this.pageSize,
          keyword: this.keyword
        }
      }
      // 如果this.categoryId === -1 则继续传递 type和deptId 用于区分回收站内不同的数据(因为回收站的ID都是-1)
      if (this.categoryId === -1) {
        param.params.type = this.type
        param.params.deptId = this.deptId
      }

      this.$http.get(`/speechcraft/getAllCategory`, param).then((response) => {
        this.dataList = response.data.records || []
        this.total = response.data.total || 0
        this.loading = false
      })
    },
    // 切换页码
    onChangePage: function (index) {
      this.pageIndex = index
      if (this.isSearching) {
        this.getAllList()
      } else {
        this.getDataList()
      }
    },
    // 添加话术按钮点击 打开弹窗
    addSpeechcraft: function () {
      this.addVisible = true
    },
    // 导入话术按钮点击 打开弹窗
    importSpeechcraft: function () {
      this.importVisible = true
    },
    // 修改话术按钮点击 打开修改弹窗
    editSpeechcraft: function (item) {
      // 断开引用 防止修改的时候影响后面列表
      this.editSpeechcraftObject = JSON.parse(JSON.stringify(item))
      this.editVisible = true
    },
    dragStart(value) {
      this.oldData = value
    },
    // 记录移动过程中信息
    dragEnter(value, e) {
      this.newData = value
      e.preventDefault()
    },
    // 拖拽最终操作
    dragEnd(value, e) {
      let actionList = this.$route.meta.actionList || []
      if (actionList.length === 0 || !actionList.includes(this.editPermission)) {
        return
      }

      if (this.categoryId === -1) {
        // 回收站内不能拖动
        this.$message.warning('回收站内不能进行排序')
        return
      }
      if (this.keyword) {
        this.$message.warning('搜索时不能进行排序')
        return
      }
      if (this.oldData !== this.newData) {
        let oldIndex = this.dataList.indexOf(this.oldData)
        let newIndex = this.dataList.indexOf(this.newData)
        let newItems = [...this.dataList]
        // 删除老的节点
        newItems.splice(oldIndex, 1)
        // 在列表中目标位置增加新的节点
        newItems.splice(newIndex, 0, this.oldData)
        this.dataList = [...newItems]

        // 持久化
        let param = {
          page: this.pageIndex,
          size: this.pageSize,
          categoryId: this.categoryId,
          list: this.dataList,
          deptId: this.deptId
        }
        this.loading = true
        this.$http.put(`/speechcraft/saveSort`, param).then((response) => {
          this.loading = false
        })
      }
    },
    // 拖动事件 (主要是为了拖动时鼠标光标不变为禁止)
    dragOver(e) {
      e.preventDefault()
    },
    // 添加文本
    addText: function () {
      this.itemList.unshift({
        uuid: this.uuid(),
        type: 'text',
        text: ''
      })
    },
    // 添加图片
    addImage: function () {
      this.itemList.unshift({
        uuid: this.uuid(),
        type: 'image',
        url: ''
      })
    },
    // 添加视频
    addVideo: function () {
      this.itemList.unshift({
        uuid: this.uuid(),
        type: 'video',
        url: ''
      })
    },
    // 添加文件
    addFile: function () {
      this.itemList.unshift({
        uuid: this.uuid(),
        type: 'file',
        url: ''
      })
    },
    // 添加链接
    addLink: function () {
      this.addLinkVisible = true
    },
    // 添加小程序
    addMiniApp: function () {
      this.addMiniappVisible = true
    },
    // 添加素材库
    addMaterialLibrary: function () {
      this.materialSelectedItems = []
      this.addMaterialVisible = true
    },
    // 确定添加话术组
    handleAddSpeechcraft: function () {
      // 检查标题
      this.$refs.addSpeechcraftForm.validate((valid) => {
        if (valid) {
          // 检查是否有话术
          if (this.itemList.length === 0) {
            this.$notification.error({
              message: '提示',
              description: `请至少添加一条话术`
            })
            return
          }

          for (let item of this.itemList) {
            switch (item.type) {
              case 'text':
                // 检查纯文本
                if (!item.text) {
                  this.$notification.error({
                    message: '提示',
                    description: `请填写话术内容`
                  })
                  return
                }
                break
              case 'image':
              case 'video':
              case 'file':
                // 检查上传的附件
                if (!item.attachmentKey || !item.attachmentName) {
                  this.$notification.error({
                    message: '提示',
                    description: `请上传文件`
                  })
                  return
                }
                break
              case 'link':
              case 'mini-app':
                // 检查上传的附件
                if (!item.attachmentKey || !item.attachmentName) {
                  this.$notification.error({
                    message: '提示',
                    description: `请上传图片`
                  })
                  return
                }
                break
            }
          }
          this.addLoading = true
          let param = JSON.parse(JSON.stringify(this.speechcraft))
          param.categoryId = this.categoryId
          param.type = this.type
          param.deptId = this.deptId
          param.speechcraftItemList = this.itemList

          this.$http.post(`/speechcraft/add`, param).then((response) => {
            this.addLoading = false
            if (response.code === 200) {
              this.addVisible = false
              // 添加成功
              this.$notification.success({
                message: '提示',
                description: '添加成功'
              })
              // 重新加载列表
              this.getDataList()
              // 添加成功后清空填写的数据
              this.itemList = []
              this.speechcraft = {
                title: ''
              }
            } else {
              // 添加失败
              this.$notification.error({
                message: '提示',
                description: response.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 添加话术 - 删除已添加的话术Item
    removeItem: function (x) {
      if (x.uuid) {
        // 新建的时候 还没入库 用uuid来标识单条item
        this.itemList = this.itemList.filter((item) => item.uuid !== x.uuid)
      } else {
        // 修改的时候 使用主键来标识
        this.editSpeechcraftObject.speechcraftItemList = this.editSpeechcraftObject.speechcraftItemList.filter(
          (item) => item.id !== x.id
        )
      }
    },
    // 生成随机UUID 用来标识Item 删除时能找到删除的是哪个
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
    // 上传链接/小程序 封面图片
    uploadThumbnail: function (ossFile) {
      // 临时访问URL 没啥用
      this.$set(this.formItem, 'attachmentUrl', ossFile.fullPath)
      // oss路径 查看附件时需要用此值换取临时URL
      this.$set(this.formItem, 'attachmentKey', ossFile.path)
      // 文件名
      this.$set(this.formItem, 'attachmentName', ossFile.name)
      // 文件扩展名
      this.$set(this.formItem, 'attachmentExt', ossFile.name.substring(ossFile.name.lastIndexOf('.') + 1))
    },
    // 添加链接点击OK
    handleAddLinkOk: function () {
      // 先检查可用性
      this.$refs.addLinkForm.validate((valid) => {
        if (valid) {
          // 检查URL合法性
          if (!this.formItem.linkUrl.startsWith('http://') && !this.formItem.linkUrl.startsWith('https://')) {
            this.$notification.error({
              message: '提示',
              description: `请输入正确的链接地址`
            })
            return
          }

          // 基本项校验通过 再检查图片是否上传
          if (!this.formItem.attachmentUrl || !this.formItem.attachmentKey) {
            this.$notification.error({
              message: '提示',
              description: `请上传图片`
            })
            return
          }
          // 校验通过
          this.$set(this.formItem, 'uuid', this.uuid())
          this.$set(this.formItem, 'type', 'link')
          let item = JSON.parse(JSON.stringify(this.formItem))
          this.itemList.unshift(item)
          // 清空表单
          this.formItem = {}
          // 关闭弹窗
          this.addLinkVisible = false
        } else {
          return false
        }
      })
    },
    // 修改话术入库
    handleEditSpeechcraft: function () {
      // 将editSpeechcraftObject发送给后台更新 是个VO 包含了子表集合

      // 检查标题
      this.$refs.editSpeechcraftForm.validate((valid) => {
        if (valid) {
          // 检查是否有话术
          if ((this.editSpeechcraftObject.speechcraftItemList || []).length === 0) {
            this.$notification.error({
              message: '提示',
              description: `请至少添加一条话术`
            })
            return
          }

          // 检查每条话术是否合格
          for (let item of this.editSpeechcraftObject.speechcraftItemList) {
            switch (item.type) {
              case 'text':
                // 检查纯文本
                if (!item.text) {
                  this.$notification.error({
                    message: '提示',
                    description: `请填写话术内容`
                  })
                  return
                }
                break
              case 'image':
              case 'video':
              case 'file':
                // 检查上传的附件
                if (!item.attachmentKey || !item.attachmentName) {
                  this.$notification.error({
                    message: '提示',
                    description: `请上传文件`
                  })
                  return
                }
                break
              case 'link':
              case 'mini-app':
                // 检查上传的附件
                if (!item.attachmentKey || !item.attachmentName) {
                  this.$notification.error({
                    message: '提示',
                    description: `请上传图片`
                  })
                  return
                }
                break
            }
          }
          this.editLoading = true

          this.$http.put(`/speechcraft/update`, this.editSpeechcraftObject).then((response) => {
            this.editLoading = false
            if (response.code === 200) {
              this.editVisible = false
              // 修改成功
              this.$notification.success({
                message: '提示',
                description: '修改成功'
              })
              // 重新加载列表
              this.getDataList()
            } else {
              // 修改失败
              this.$notification.error({
                message: '提示',
                description: response.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 添加小程序点击OK
    handleAddMiniappOk: function () {
      // 先检查可用性
      this.$refs.addMiniappForm.validate((valid) => {
        if (valid) {
          // 基本项校验通过 再检查图片是否上传
          if (!this.formItem.attachmentUrl || !this.formItem.attachmentKey) {
            this.$notification.error({
              message: '提示',
              description: `请上传图片`
            })
            return
          }
          // 校验通过
          this.$set(this.formItem, 'uuid', this.uuid())
          this.$set(this.formItem, 'type', 'mini-app')
          let item = JSON.parse(JSON.stringify(this.formItem))
          this.itemList.unshift(item)
          // 清空表单
          this.formItem = {}
          // 关闭弹窗
          this.addMiniappVisible = false
        } else {
          return false
        }
      })
    },
    // 添加素材库点击OK
    handleAddMaterialOk: function () {
      if (this.materialSelectedItems.length === 0) {
        this.$notification.error({
          message: '提示',
          description: `请选择素材`
        })
        return
      }

      for (let item of this.materialSelectedItems) {
        // 文本素材
        if (item.type === '文本') {
          this.itemList.unshift({
            uuid: this.uuid(),
            type: 'text',
            text: item.content.content,
            materialId: item.id
          })
        }

        // 图片素材
        if (item.type === '图片') {
          this.itemList.unshift({
            uuid: this.uuid(),
            type: 'image',
            attachmentName: item.content.imageName,
            attachmentUrl: item.content.imageFullPath,
            attachmentKey: item.content.imagePath,
            attachmentExt: item.content.imagePath.substring(item.content.imagePath.lastIndexOf('.') + 1),
            materialId: item.id
          })
        }

        // 图文素材(链接)
        if (item.type === '图文') {
          this.itemList.unshift({
            uuid: this.uuid(),
            type: 'link',
            attachmentName: item.content.imagePath, // 此处没返回文件名 使用key来代替
            attachmentUrl: item.content.imageFullPath,
            attachmentKey: item.content.imagePath,
            attachmentExt: item.content.imagePath.substring(item.content.imagePath.lastIndexOf('.') + 1),
            linkTitle: item.content.title,
            linkUrl: item.content.imageLink,
            linkDesc: item.content.description,
            materialId: item.id
          })
        }

        // 音频素材(当作文件保存)
        if (item.type === '音频') {
          this.itemList.unshift({
            uuid: this.uuid(),
            type: 'file',
            attachmentName: item.content.voiceName,
            attachmentUrl: item.content.voiceFullPath,
            attachmentKey: item.content.voicePath,
            attachmentExt: item.content.voicePath.substring(item.content.voicePath.lastIndexOf('.') + 1),
            linkTitle: item.content.title,
            linkUrl: item.content.imageLink,
            linkDesc: item.content.description,
            materialId: item.id
          })
        }

        // 视频素材
        if (item.type === '视频') {
          this.itemList.unshift({
            uuid: this.uuid(),
            type: 'video',
            attachmentName: item.content.videoName,
            attachmentUrl: item.content.videoFullPath,
            attachmentKey: item.content.videoPath,
            attachmentExt: item.content.videoPath.substring(item.content.videoPath.lastIndexOf('.') + 1),
            materialId: item.id
          })
        }

        // 小程序素材
        if (item.type === '小程序') {
          this.itemList.unshift({
            uuid: this.uuid(),
            type: 'mini-app',
            attachmentName: item.content.imageName,
            attachmentUrl: item.content.imageFullPath,
            attachmentKey: item.content.imagePath,
            attachmentExt: item.content.imagePath.substring(item.content.imagePath.lastIndexOf('.') + 1),
            miniappAppid: item.content.appid,
            miniappPath: item.content.page,
            miniappDesc: item.content.title,
            materialId: item.id
          })
        }

        // 文件素材
        if (item.type === '文件') {
          this.itemList.unshift({
            uuid: this.uuid(),
            type: 'file',
            attachmentName: item.content.fileName,
            attachmentUrl: item.content.fileFullPath,
            attachmentKey: item.content.filePath,
            attachmentExt: item.content.filePath.substring(item.content.filePath.lastIndexOf('.') + 1),
            materialId: item.id
          })
        }
      }

      this.addMaterialVisible = false
    },
    // 下载模板
    downloadTemplate: function () {
      downLoadBlobByParam('/speechcraft/downloadTemplate', null, `话术模板.xlsx`)
    },
    // 限制只能上传一个导入文件
    handleImportChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url
        }
        return file
      })

      if (!info.file.name.endsWith('.xlsx')) {
        info.file.status = 'beforeUploadReject'
        info.file.statusText = '文件格式错误'
        fileList.splice(0, 1)
        this.$notification.error({
          message: '提示',
          description: `只能上传xlsx格式的文件`
        })
      }

      if (info.file.size / 1024 / 1024 > 100 && info.file.status !== 'removed') {
        info.file.status = 'beforeUploadReject'
        info.file.statusText = `文件大小不能大于100MB`
        fileList.splice(0, 1)
        this.$notification.error({
          message: '提示',
          description: `文件大小不能大于100MB`
        })
      }

      this.importFileList = fileList
    },
    // 导入话术文件删除
    handleImportRemove(file) {
      const index = this.importFileList.indexOf(file)
      const newFileList = this.importFileList.slice()
      newFileList.splice(index, 1)
      this.importFileList = newFileList
    },
    // 导入话术文件选择
    beforeImportUpload(file) {
      this.importFileList = [...this.importFileList, file]
      return false
    },
    // 确定导入话术文件
    handleUpload() {
      const { importFileList } = this
      const formData = new FormData()
      formData.append('file', importFileList[0].originFileObj)

      this.importLoading = true
      this.$http.post(`/speechcraft/importSpeechcraft/${this.categoryId}`, formData).then((response) => {
        if (response.code === 200) {
          this.importFileList = []
          this.importLoading = false
          this.importVisible = false
          // 重新加载列表
          this.getDataList()
          this.$message.success('导入成功')
        } else {
          this.importLoading = false
          this.$message.error('导入失败')
        }
      })
    },
    // 回收站内还原话术按钮点击
    recoverSpeechcraftShow: function (item) {
      this.recoverSpeechcraft = item
      this.recoverCategory = null
      this.recoverVisible = true
    },
    // 还原时文件夹切换
    recoverChange: function (category) {
      this.recoverCategory = category
    },
    // 确定还原
    handleRecoverOk: function () {
      this.recoverLoading = true
      this.$http
        .put(`/speechcraft/transfer/${this.recoverSpeechcraft.id}/to/${this.recoverCategory.id}`)
        .then((response) => {
          if (response.code === 200) {
            this.recoverVisible = false
            // 还原成功
            this.$notification.success({
              message: '提示',
              description: '还原成功'
            })
            // 重新加载列表
            this.getDataList()
          } else {
            // 还原失败
            this.$notification.error({
              message: '提示',
              description: response.msg
            })
          }
          this.recoverLoading = false
        })
    },
    // 转移时文件夹切换
    swapChange: function (category) {
      this.swapCategory = category
    },
    // 转移话术按钮点击
    swapSpeechcraftShow: function (item) {
      this.swapSpeechcraft = item
      this.swapCategory = null
      this.swapVisible = true
    },
    // 确定转移话术组
    handleSwapOk: function () {
      this.swapLoading = true
      this.$http.put(`/speechcraft/transfer/${this.swapSpeechcraft.id}/to/${this.swapCategory.id}`).then((response) => {
        if (response.code === 200) {
          this.swapVisible = false
          // 转移成功
          this.$notification.success({
            message: '提示',
            description: '转移成功'
          })
          // 重新加载列表
          this.getDataList()
        } else {
          // 还原失败
          this.$notification.error({
            message: '提示',
            description: response.msg
          })
        }
        this.swapLoading = false
      })
    },
    // 删除话术组
    deleteSpeechcraft: function (item, permanent = false) {
      let that = this
      let content
      let url
      if (permanent) {
        // 回收站内彻底删除话术组按钮点击 永久删除
        content = '删除回收站下的话术组，将彻底删除词条话术组。'
        url = `/speechcraft/delete?speechcraftId=${item.id}`
      } else {
        // 普通文件夹内 将整个话术组移动到回收站内
        content = '删除话术后，您可在回收站内找到该条话术。'
        url = `/speechcraft/moveToRecycleBin?speechcraftId=${item.id}`
      }
      this.$confirm({
        centered: true,
        title: '确定删除？',
        content: content,
        onOk() {
          that.$http.delete(url).then((response) => {
            if (response.code === 200) {
              // 删除成功
              that.$notification.success({
                message: '提示',
                description: '删除成功'
              })
              // 重新加载列表
              that.getDataList()
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
    // 查看页面 点击删除按钮删除单条话术
    deleteItem: function () {
      this.getDataList()
    },
    // 素材库多选改变
    materialSelectChange: function (list) {
      this.materialSelectedItems = list
    }
  }
}
</script>

<style lang="less" scoped>
.sort-item {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.sort-move {
  transition: transform 0.3s;
}

.speechcraft-item {
  margin-bottom: 20px;

  &:first-child {
    margin-top: 20px;
  }
}

.speechcraft-item-view {
  border-bottom: 1px solid #e8e8e8;
  padding: 20px 10px;

  &:first-child {
    padding-top: 10px;
  }

  &:last-child {
    padding-bottom: 10px;
    border-bottom: 0;
  }
}

.add-btn-group {
  display: flex;
  justify-content: space-between;

  .ant-btn {
    width: 100px;
    height: 40px;
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

.import-text {
  margin: 0;
}
.import-tip {
  margin-top: 5px;
  color: #aaaaaa;
}

.recover-tip {
  font-size: 12px;
  color: #999999;
}
</style>
