<template>
  <div class="chartContainer_Comoonent" :style="{ width }">
    <div class="flexBox">
      <div class="header">
        <a-tooltip v-if="extra" class="name">
          <template slot="title">
            {{ extra }}
          </template>
          {{ name }} <img src="./question.svg" alt="" style="margin-left: 5px;width: 15px;">
        </a-tooltip>
        <span v-else class="name">{{ name }}</span>
        <div class="right">
          <span class="rightTxt" v-if="rightTop">{{ rightTop }}</span>
          <slot name="rightTop" v-else></slot>
        </div>
      </div>
      <slot name="searchTab" class="searchTab"></slot>
    </div>
  </div>
</template>

<script>
/**
 * @param {String} width 宽度
 * @param {String} extra 描述
 * @param {String} name 名称
 * @param {String} rightTop 右侧内容 有限props，其次slot
 *
 * @slot rightTop 右上侧内容
 * @slot searchTab 名称下搜索tab占位
 */
export default {
  name: 'ChartContainer',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    name: {
      type: String,
      default: ''
    },
    rightTop: {
      type: String,
      default: ''
    },
    extra: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  beforeCreate () { },
  created () { },
  beforeMount () { },
  mounted () { },
  methods: {},
  beforeUpdate () { },
  updated () { },
  beforeUnmount () { },
  unmounted () { }
}
</script>
<style lang='less'>

</style>
<style lang='less' scoped>
.chartContainer_Comoonent {
  height: auto;

  .flexBox {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #d7d7d7;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .name {
        display: flex;
        align-items: center;
      }
    }

    .searchTab {
      margin-top: 5px;
    }
  }
}
</style>
