<template>
  <div class="attrBox">
    <div class="box" v-if="data.length > 1">
      <p>
        <span v-for="(val, key) in relation" :key="key" @click="tapFn(key)" :class="key == active ? 'active': ''">{{ val }}</span>
      </p>
    </div>
    <ul>
      <li v-for="(item, index) in data" :key="index">
        <span>{{ item.name }}：</span>
        <span>
          <a-select v-model="item.range" style="width: 120px">
            <a-select-option v-for="(val, key) in option" :key="key" :value="key">{{ val }}</a-select-option>
          </a-select>
        </span>
        <span><LabelSelect v-model="item.label" :addState="true" style="width:300px" /></span>
        <span class="btn">
          <a-icon @click="handleAdd" type="plus-circle" />
          <a-icon v-if="index > 0" @click="handleDel(index)" type="minus-circle" />
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import LabelSelect from '../../../components/SelectLabel/index.vue'
export default {
  components: { LabelSelect },
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
      data: [],
      active: 1,
      option: {
        1: '包含所有',
        2: '包含',
        3: '不包含',
        4: '为空',
        5: '不为空'
      },
      relation: {
        1: '且',
        2: '或'
      }
    }
  },
  created () {
    this.init(this.value)
  },
  watch: {
    value (val) {
      this.init(val)
    }
  },
  methods: {
    init (data) {
      if (data.length === 0) {
        this.data = [
          {
            name: '客户标签',
            range: 1,
            label: []
          }
        ]
      } else {
        this.data = data
      }
    },
    handleAdd () {
      this.data.push({
        name: '客户标签',
        range: '1',
        label: []
      })
      this.$emit('input', this.data)
    },
    handleDel (index) {
      this.data.splice(index, 1)
      this.$emit('input', this.data)
    },
    tapFn (key) {
      this.active = key
    }
  }
}
</script>

<style lang="less" scoped>
.attrBox{
  width:100%;
  margin:10px auto;
  display:flex;
  box-sizing: border-box;
  .box{
    width:30px;
    margin:22px 5px 30px 0px;
    border: 1px solid #ccc;
    border-right:0;
    position: relative;
    p{
      height:40px;
      width:20px;
      position: absolute;
      top:50%;
      left:0;
      transform: translate(-10px, -50%);
      span{
        width:20px;
        height:20px;
        display:block;
        background:#ccc;
        color:#fff;
        line-height:20px;
        text-align: center;
        cursor: pointer;
      }
      span.active{
        background:#1890ff;
      }
    }
  }
  ul{
    flex:1;
    padding:0;
    margin:0;
    li{
      margin-bottom:10px;
      span{
        display:inline-block;
        margin-right:10px;
      }
      span.btn{
        font-size:20px;
        cursor: pointer;
        i{
          margin-right:6px;
        }
      }
    }
  }
}
</style>
