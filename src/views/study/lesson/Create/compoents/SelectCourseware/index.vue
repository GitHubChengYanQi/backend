<template>
  <div>
    {{ value }}
    <a-button @click="add">
      <a-icon type="plus" />
      添加
    </a-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array || null,
      default () {
        return []
      }
    }
  },
  created () {

  },
  methods: {
    add () {
      this.$emit('onChange', 123)
    }
  }
}
</script>
