<template>
  <div class="loading" :style="{'height': height, 'align-items': loading ? 'center' : 'start'}">
    <div class="box" v-show="!loading">
      <slot/>
    </div>
    <div v-show="loading">
      <a-spin/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '400px'
    }
  }
}
</script>

<style lang="less" scoped>
.loading {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
}

.box {
  width: 100%;
}
</style>
