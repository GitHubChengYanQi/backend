<template>
  <div>
    <a-button class="add" @click="add">
      <a-icon type="plus" />
      添加
    </a-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default () {
        return ''
      }
    }
  },
  methods: {
    add () {
      this.$emit('change', '')
    }
  }
}
</script>

<style lang="less" scoped>
.add {
  width: 200px;
  border-radius: 4px;
}
</style>
