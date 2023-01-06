<template>
  <div class="attrBox">
    <div class="box" v-if="data.length > 1">
      <p>
        <span v-for="item in relation" :key="item.code" @click="tapFn(item.code)" :class="item.code == active ? 'active': ''">{{ item.name }}</span>
      </p>
    </div>
    <ul>
      <li v-for="(item, index) in data" :key="index">
        <!-- 类别 -->
        <span>
          <a-select placeholder="请选择" v-model="item.columnName" @change="onColumnChange(item)" style="width: 120px">
            <a-select-option v-for="items in option" :key="items.code" :value="items.code">{{ items.name }}</a-select-option>
          </a-select>
        </span>
        <!-- end 类别 -->

        <!-- 区间 -->
        <span v-if="item.columnName !== 'purchase_time'">
          <a-select placeholder="请选择" v-model="item.judgmentConditions" style="width: 120px">
            <a-select-option v-for="items in range" :key="items.code" :value="items.code">{{ items.name }}</a-select-option>
          </a-select>
        </span>
        <!-- end 区间 -->

        <!-- 时间 -->
        <span v-if="item.columnName === 'purchase_time'">
          <a-range-picker v-model="item.val" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
        </span>
        <!-- end 时间 -->

        <!-- 正常值 -->
        <span v-else>
          <a-input-number placeholder="请输入" v-model="item.val" :min="1" :max="10" />
          <i v-if="item.columnName === 'purchase_number'">次</i>
          <i v-if="item.columnName === 'good_amount'">元</i>
        </span>
        <!-- end 正常值 -->

        <span class="btn">
          <a-icon @click="handleAdd" type="plus-circle" />
          <a-icon v-if="index > 0" @click="handleDel(index)" type="minus-circle" />
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'
export default {
  components: { },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    consumeAttributeRef: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      data: [],
      active: 'and',
      option: [],
      range: [],
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
    init (data) {
      this.getDict('auto_lable_number_relationship')
      this.getDict('consume_filed')
      this.getDict('auto_lable_consume_condition')
      if (data.length === 0) {
        this.data = [
          {
            columnName: undefined,
            judgmentConditions: undefined,
            val: ''
          }
        ]
      } else {
        this.data = data
      }
      this.active = this.consumeAttributeRef
    },
    handleAdd () {
      this.data.push({
        columnName: undefined,
        judgmentConditions: undefined,
        val: ''
      })
      this.$emit('input', this.data)
    },
    handleDel (index) {
      this.data.splice(index, 1)
      this.$emit('input', this.data)
    },
    tapFn (key) {
      this.active = key
      this.$emit('relation', key)
    },
    /**
     * 时间回调
     */
    // onChange (e, item) {
    //   item.val = moment(e[0]).format('YYYY-MM-DD hh:mm:ss') + ',' + moment(e[1]).format('YYYY-MM-DD hh:mm:ss')
    // },
    /**
     * 类别回调
     */
    onColumnChange (e) {
      console.log(e, e.columnName)
      if (e.columnName === 'purchase_time') {
        e.judgmentConditions = 'between'
        e.val = []
      } else {
        e.judgmentConditions = ''
      }
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
        if (e === 'auto_lable_number_relationship') {
          this.relation = res.data
        }
        if (e === 'consume_filed') {
          this.option = res.data
        }
        if (e === 'auto_lable_consume_condition') {
          this.range = res.data
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
        i{
          font-style:normal;
          margin-left:10px;
        }
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
