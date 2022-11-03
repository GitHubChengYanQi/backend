<template>
  <div>
    <template v-if="currentData.isLeaf == 0">
      <div class="deptItem_" @click.stop="openChange">
        <div class="dept_ flex-row-center">
          <a-icon :type="!currentData.open ? 'caret-up' : 'caret-down'" />
          <img class="deptIcon" :src="require('@/assets/healthManage/u2011.png')" alt="" />
          {{ currentData.title }}
        </div>
        <div v-show="currentData.open">
          <ItemTree v-for="item in currentData.children" :currentData="item" :key="item.id" />
        </div>
      </div>
    </template>
    <template v-if="currentData.isLeaf == 1">
      <div class="tree-user-content flex-row-center" @click.stop="">
        <div class="flex-row-center">
          <img class="ree-user-head" :src="currentData.icon" alt="">
          <span>{{ currentData.title }}</span>
        </div>
        <a-checkbox :value="currentData"></a-checkbox>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ItemTree',
  props: {
    currentData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: { ItemTree: _ => import('./item.vue') },
  mounted () { },
  methods: {
    openChange () {
      this.currentData.open = !this.currentData.open
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
  .flex-row-center{
    display: flex;
  flex-direction: row;
  align-items: center;
  }
.deptItem_ {
  margin-left: 15px;
}

.dept_ {
  margin-bottom: 5px;
}

.deptIcon {
  margin: 0 5px;
  width: 25px;
  height: 25px;
}

.tree-user-content {
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
  justify-content: space-between;
}

.ree-user-head {
  height: 30px;
  width: 30px;
  margin-right: 10px;
}
</style>
