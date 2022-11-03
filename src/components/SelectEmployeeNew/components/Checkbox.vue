<template>
  <div class="checkbox">
    <div
      :class="{'box': true, 'active': select}"
    >
      <svg
        t="1638983969720"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3508"
        data-spm-anchor-id="a313x.7781069.0.i5">
        <path
          d="M817.728 198.72l111.744 114.56-545.216 532.128-285.92-273.024 110.528-115.712 174.176 166.336z"
          p-id="3509"
          data-spm-anchor-id="a313x.7781069.0.i6"
          class="selected"
          fill="#ffffff"></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    select: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    updateView () {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #dfdfdf;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 8px;

  svg {
    width: 10px;
    height: 10px;
  }
}

.active {
  color: #fff;
  border: 1px solid #1890ff;
  background: #1890ff;
}
</style>
