<template>
  <div class="more-box">
    <div v-if="show">
      <div
        :class="{'ct': true, 'active': down}"
        :style="{'max-height': `${height}px`}"
      >
        <slot/>
      </div>
      <div class="down" @click="down = !down">
        {{ down ? '收起' : '展开' }}
        <a-icon :type="down ? 'up' : 'down'"/>
      </div>
    </div>
    <div v-else>
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      default: true,
      type: Boolean
    },
    height: {
      default: 76,
      type: Number
    }
  },
  data () {
    return {
      down: false
    }
  }
}
</script>

<style lang="less" scoped>
.ct {
  max-height: 76px;
  overflow: hidden;
}

.down {
  cursor: pointer;
  font-size: 12px;
  color: #000000a6;
  margin-top: 4px;
}

.active {
  max-height: unset!important;
}
</style>
