<template>
  <div class="attrBox">
    <div class="box" v-if="data.length > 1">
      <p>
        <span v-for="item in relation" :key="item.code" @click="tapFn(item.code)" :class="item.code == active ? 'active': ''">{{ item.name }}</span>
      </p>
    </div>
    <ul>
      <li v-for="(item, index) in data" :key="index">
        <span>客户标签：</span>
        <span>
          <a-select placeholder="请选择" v-model="item.judgmentConditions" style="width: 120px">
            <a-select-option v-for="item in option" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
          </a-select>
        </span>
        <span class="label"><LabelSelect v-model="item.val" :addState="true" style="width:300px" /></span>
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
import { getDict } from '@/api/common.js'
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
      active: 'and',
      option: [],
      relation: []
    }
  },
  created () {
    this.init(this.value)
  },
  watch: {
    value (val) {
      this.init(val)
    },
    data () {
      this.$emit('input', this.data)
    }
  },
  methods: {
    /**
     * 初始化
     * @param {*} data
     */
    init (data) {
      this.getDict('auto_lable_customer_condition')
      this.getDict('auto_lable_number_relationship')
      if (data.length === 0) {
        this.data = [
          {
            judgmentConditions: undefined,
            val: []
          }
        ]
      } else {
        this.data = data
      }
    },
    /**
     * 添加
     */
    handleAdd () {
      this.data.push({
        judgmentConditions: undefined,
        val: []
      })
    },
    /**
     * 删除
     * @param {*} index
     */
    handleDel (index) {
      this.data.splice(index, 1)
    },
    /**
     * 切换关系
     * @param {*} key
     */
    tapFn (key) {
      this.active = key
      this.$emit('relation', key)
    },
    /**
     * 拉取字典
     * @param {*} e
     * @param {*} key
     */
    getDict (e) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        if (e === 'auto_lable_customer_condition') {
          this.option = res.data
        }
        if (e === 'auto_lable_number_relationship') {
          this.relation = res.data
        }
      })
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
    margin:18px 5px 26px 0px;
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
      span.label{
        vertical-align: middle;
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
