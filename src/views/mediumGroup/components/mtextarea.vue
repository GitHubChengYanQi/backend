<template>
  <div class="textarea-wrapper">
    <a-textarea
      class="m-textarea"
      v-bind="$attrs"
      v-model="$attrs.value"
      @change="onChange"
    />
    <span v-if="showWordLimit" class="m-count">
      {{ textLength }}/
      <template v-if="$attrs.maxLength">{{ $attrs.maxLength }}</template>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    // 是否展示字数统计
    showWordLimit: {
      type: Boolean,
      default: false
    }
  },
  // v-model处理
  model: {
    prop: 'value',
    event: 'change'
  },

  computed: {
    textLength () {
      return (this.$attrs.value || '').length
    }
  },

  methods: {
    onChange (e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>

<style scoped lang="less">
.textarea-wrapper {

  position: relative;
  display: block;

  .m-textarea {
    padding: 8px 12px;
    height: 100%;
  }

  .m-count {
    color: #808080;
    background: #fff;
    position: absolute;
    font-size: 12px;
    bottom: 8px;
    right: 12px;
  }

}
</style>
