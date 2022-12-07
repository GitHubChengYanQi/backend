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
      @click.stop="$router.back(-1)">
      <span class="return_lt"></span>
      <span class="return">返回</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titles: {
      type: Array,
      default () {
        return []
      }
    },
    back: Boolean
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
  cursor:pointer;
}
</style>
