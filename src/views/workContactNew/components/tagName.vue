<template>
  <div
    class="label_box"
    v-if="tag"
  >
    <span
      class="label"
      v-for=" (item ,index) in tag.slice(0,1)"
      :key="index"
    >{{ item }}</span>
    <span
      class="spread"
      v-if="tag.length > 1"
      @mouseenter="show = true"
    >
      <svg-icon :state="3" />
    </span>
    <div
      class="hidden_div"
      @mouseleave="show = false"
      v-show="show"
    >
      <div
        class="hidden_span"
        v-for=" (item , index) in tag"
        :key="index"
      >{{ item }}</div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/views/clientFollow/components/SvgIcon'

export default {
  name: 'TagName',
  components: { SvgIcon },
  data () {
    return {
      show: false
    }
  },
  props: {
    tag: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.label_box {
  position: relative;
  box-sizing: border-box;
  padding: 0 10px 0 10px;
  overflow-wrap: break-word;
.label {
  display: inline-block;
  margin-left: 10px;
  margin-bottom: 5px;
  max-width: 80px;
  padding: 3px 10px;
  margin: 5px;
  white-space: nowrap;
  background-color: #f7f7f7;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 5px;
  height: 28px;
  font-size: 14px;
  background: #f7f7f7;
  border-radius: 4px;
  border: 1px solid #e9e9e9;
}
.spread {
  transform: rotate(180deg);
  position: absolute;
  top: 8px;
  right: 0;
  font-size: 14px;
  color: #000;
  cursor: pointer;
}
.hidden_div {
  z-index: 1;
  max-height: 130px;
  color: #000000a6;
  position: absolute;
  bottom: -23px;
  right: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  letter-spacing: 1px;
  line-height: 26px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ccc;
  overflow: auto;

.hidden_span {
  min-width: 117px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
  font-size: 16px;
  letter-spacing: 1px;
  line-height: 26px;
  white-space: nowrap;
  background: #f7f7f7;
  border-radius: 4px;
  border: 1px solid #e9e9e9;
}
}
}
</style>
