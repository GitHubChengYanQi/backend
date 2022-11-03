<!-- <topHeader :activeInfo="activeInfo" @operation="goOperation" @search="goSearch"/>
    activeInfo 为当前激活的菜单信息,operation为操作回调,search为搜索回调
-->
<template>
  <div>
    <div class="searchLine">
      <div class="seeaerchBox">
        <a-input placeholder="请输入SOP名称" v-model="searchValue" style="width: 290px; height: 35px" />
        <a-button
          type="primary"
          style="width: 54px;height: 34px;margin: 0 10px;"
          @click="goSearch"
          v-permission="searchPermission"
        >查询</a-button>
        <a-button
          style="width: 54px;height: 34px;margin-right: 10px;"
          @click="goReset"
          v-permission="searchPermission"
        >重置</a-button>
        <span class="explan">{{ activeInfo.explan }}</span>
      </div>
      <!-- @click="$router.push(`/salesManagement/addSop?type=${selectTagIndex}&id=-1`)" -->
      <div class="handlesBox">
        <!-- {{ topTags[selectTagIndex].name }} -->
        <div class="btn" @click="goAdd" v-permission="addPermission">{{ `创建${activeInfo.name}` }}</div>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      searchValue: ''
    }
  },
  props: {
    // 新增权限
    addPermission: {
      type: String,
      default: ''
    },
    // 搜索权限
    searchPermission: {
      type: String,
      default: ''
    },
    activeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    // 将输入框内容传给父组件
    goSearch () {
      this.$emit('search', this.searchValue)
    },
    // 重置
    goReset () {
      this.searchValue = ''
      this.$emit('search', this.searchValue)
    },
    // 去新增
    goAdd () {
      console.log(this.searchPermission, this.addPermission)
      this.$emit('operation', 'add')
    },
    getList () {

    }
  }
}
</script>
<style lang="less" scoped>
@import '../index.less';
</style>
