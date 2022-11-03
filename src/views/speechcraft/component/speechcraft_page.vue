<!-- 话术页面 -->
<template>
  <div>
    <a-input-search
      v-model="value"
      class="search-input"
      :allowClear="true"
      placeholder="查询标题/内容"
      @search="onSearch"
    >
      <a-button slot="enterButton" type="primary">搜索</a-button>
    </a-input-search>

    <a-row :gutter="16">
      <a-col :span="6">
        <SpeechcraftCategory
          :type="type"
          :add-permission="getAddFolderPermission()"
          :edit-permission="getEditFolderPermission()"
          :delete-permission="getDeleteFolderPermission()"
          @selectChange="selectChange"
          @deptChange="deptChange"
          ref="category"
        />
      </a-col>
      <a-col :span="18">
        <SpeechcraftView
          :type="type"
          :add-permission="getAddSpeechcraftPermission()"
          :edit-permission="getEditSpeechcraftPermission()"
          :delete-permission="getDeleteSpeechcraftPermission()"
          :import-permission="getImportSpeechcraftPermission()"
          :categoryId="categoryId"
          :deptId="deptId"
          :keyword="keyword"
          :is-searching="globalSearching"
          ref="search"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: 'SpeechcraftPage',
  components: {
    'SpeechcraftCategory': () => import('../component/speechcraft_category.vue'),
    'SpeechcraftView': () => import('../component/speechcraft_view.vue')
  },
  props: {
    type: {
      type: String,
      default: '公司话术'
    },
  },
  data() {
    return {
      // 当前查看的话术分类ID
      categoryId: null,
      // 当前选中的部门ID
      deptId: null,
      // 搜索框的内容
      value: '',
      // 搜索的内容
      keyword: '',
      // 是否正在搜索
      globalSearching: false,
    }
  },
  methods: {
    // 左侧话术分类点击切换
    selectChange: function (folder) {
      this.categoryId = folder.id
      // 左侧选择文件夹 则退出全局搜索状态
      this.globalSearching = false
    },
    // 部门话术时 切换部门
    deptChange: function (deptId) {
      this.deptId = deptId
    },
    // 搜索按钮点击
    onSearch: function () {
      // 判断是否有输入内容
      if (this.value) {
        // 进入全局搜索状态
        this.globalSearching = true
        // 修改关键字 触发搜索
        this.keyword = this.value

        this.$nextTick(() => {
          // 全局搜索时取消左侧文件夹选择
          this.$refs.category.deselected()
          // 清空已选分类 保证再次选择此分类时可以正常加载数据
          this.categoryId = null
        })
      } else {
        // 没有输入 直接退出全局搜索状态
        this.globalSearching = false
        // 清空关键字 重置列表
        this.keyword = ''
        // 退出搜索 重新加载第一页数据
        this.$nextTick(() => {
          this.$refs.category.onChangePage(1)
        })
      }
    },
    // 按照类别计算创建文件夹权限名
    getAddFolderPermission: function () {
      switch (this.type) {
        case '公司话术':
          return '/speechcraft/company@addCompanyFolder'
        case '部门话术':
          return '/speechcraft/department@addDepartmentFolder'
        case '个人话术':
          return '/speechcraft/individual@addIndividualFolder'
        default:
          return null
      }
    },
    // 按照类别计算修改文件夹权限名
    getEditFolderPermission: function () {
      switch (this.type) {
        case '公司话术':
          return '/speechcraft/company@renameCompanyFolder'
        case '部门话术':
          return '/speechcraft/department@renameDepartmentFolder'
        case '个人话术':
          return '/speechcraft/individual@renameIndividualFolder'
        default:
          return null
      }
    },
    // 按照类别计算删除文件夹权限名
    getDeleteFolderPermission: function () {
      switch (this.type) {
        case '公司话术':
          return '/speechcraft/company@deleteCompanyFolder'
        case '部门话术':
          return '/speechcraft/department@deleteDepartmentFolder'
        case '个人话术':
          return '/speechcraft/individual@deleteIndividualFolder'
        default:
          return null
      }
    },
    // 按照类别计算创建话术权限名
    getAddSpeechcraftPermission: function () {
      switch (this.type) {
        case '公司话术':
          return '/speechcraft/company@addCompanySpeechcraft'
        case '部门话术':
          return '/speechcraft/department@addDepartmentSpeechcraft'
        case '个人话术':
          return '/speechcraft/individual@addIndividualSpeechcraft'
        default:
          return null
      }
    },
    // 按照类别计算修改话术权限名
    getEditSpeechcraftPermission: function () {
      switch (this.type) {
        case '公司话术':
          return '/speechcraft/company@editCompanySpeechcraft'
        case '部门话术':
          return '/speechcraft/department@editDepartmentSpeechcraft'
        case '个人话术':
          return '/speechcraft/individual@editIndividualSpeechcraft'
        default:
          return null
      }
    },
    // 按照类别计算删除话术权限名
    getDeleteSpeechcraftPermission: function () {
      switch (this.type) {
        case '公司话术':
          return '/speechcraft/company@deleteCompanySpeechcraft'
        case '部门话术':
          return '/speechcraft/department@deleteDepartmentSpeechcraft'
        case '个人话术':
          return '/speechcraft/individual@deleteIndividualSpeechcraft'
        default:
          return null
      }
    },
    // 按照类别计算导入话术权限名
    getImportSpeechcraftPermission: function () {
      switch (this.type) {
        case '公司话术':
          return '/speechcraft/company@importCompanySpeechcraft'
        case '部门话术':
          return '/speechcraft/department@importDepartmentSpeechcraft'
        case '个人话术':
          return '/speechcraft/individual@importIndividualSpeechcraft'
        default:
          return null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-input {
  width: 345px;
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 7px;
}
</style>
