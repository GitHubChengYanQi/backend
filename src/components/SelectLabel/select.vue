<template>
  <div>
    <div class="select" @click="openLabel">
      <span>请选择</span>
      <a-tag closable @close="handleDelete" v-for="(item, index) in data" :key="index">
        {{ item.name }}
      </a-tag>
    </div>
    <selectLabel
      :state="visible"
      :addState="true"
      @input="inputFn"
      ref="labelSelect"
    />
  </div>

</template>

<script>
import selectLabel from './index.vue'
export default {
  components: {
    selectLabel
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      visible: false,
      data: []
    }
  },
  created () {

  },
  watch: {
    value: {
      handler (val, oldval) {
        this.data = val.value
      },
      deep: true
    }
  },
  methods: {
    /**
     * 打开select
     */
    openLabel () {
      this.visible = true
      console.log(11111111111, this.visible)
    },
    /**
     * 删除
     * @param {*} e
     */
    handleDelete (e) {
      console.log(1111, e)
    },
    /**
     * 选择回调
     * @param {*} e
     */
    inputFn (e) {
      console.log(333333333, e)
      this.visible = false
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="less" scoped>
.select{
  width:100%;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  padding: 6px 11px;
  line-height: 1.5;
  span{
    color:#ccc;
  }
}
</style>
