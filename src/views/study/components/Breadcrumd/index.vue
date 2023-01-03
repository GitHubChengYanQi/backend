<template>
  <div class="breadcrumb" :style="{'padding-bottom':back ? '0' : '12px'}">
    <a-breadcrumb separator=">">
      <a-breadcrumb-item
        v-for="(item, index) in titles"
        :key="'a' + index"
      >
        {{ item }}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <div
      v-if="back"
      class="back"
      @click.stop="goBack">
      <span class="return_lt"></span>
      <span class="return">返回</span>
    </div>
  </div>
</template>

<script>
import router from '@/router'

export default {
  props: {
    titles: {
      type: Array,
      default () {
        return []
      }
    },
    back: Boolean,
    backTip: Boolean
  },
  methods: {
    goBack () {
      if (this.backTip) {
        this.$confirm({
          title: '当前内容未保存，确定离开?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          centered: true,
          onOk () {
            router.back(-1)
          },
          onCancel () {

          }
        })
        return
      }
      router.back(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.breadcrumb {
  padding: 12px 0 0;
}

.back {
  padding: 12px 0;
  display: inline-block;
  cursor: pointer;
}
</style>
