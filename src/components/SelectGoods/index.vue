<!--
  名称 = 选择标签组件
  输入 = ids[Array]
  输出 = ids[Array]
  调用方法 = <LabelGoods v-model="form.label" />
-->
<template>
  <div class="goodsBox">
    <!-- head -->
    <a-select
      class="select"
      :value="val"
      show-search
      placeholder="请输入商品名称"
      :default-active-first-option="false"
      :filter-option="false"
      :not-found-content="null"
      @search="handleSearch"
      @change="handleChange"
    >
      <a-select-option v-for="item in option" :key="item.id" :value="item.id" :disabled="isSelect(item.id)">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <!-- end head -->
    <!-- list -->
    <div class="content">
      <ul>
        <li v-for="(item, index) in goods" :key="index">
          <h2>{{ item.name }}</h2>
          <p>
            <span>售价 ￥{{ item.newestPrice ? (Number(item.newestPrice)).toFixed(2) : '' }}</span>
            <span>毛利率 {{ item.margin ? (Number(item.margin)).toFixed(2) : '' }}%</span>
          </p>
          <a-icon class="btn" @click="handleDel(index)" type="close-circle" />
        </li>
      </ul>
    </div>
    <!-- end list -->
  </div>
</template>

<script>
import {
  consumeAutoLabelErpGoodList
} from '@/api/clientFollow.js'
export default {
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
      val: undefined,
      option: [], // 备选列表
      goods: [] // 商品列表
    }
  },
  created () {
    this.goods = this.value
  },
  watch: {
    value (val, oldval) {
      this.goods = val
    },
    goods (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    /**
     * 返回是否已选
     */
    isSelect (id) {
      const arr = this.goods
      let flag = false
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          flag = true
          break
        }
      }
      return flag
    },
    /**
     * 获取药品列表
     * @param {*} e
     */
    getList (name) {
      if (name) {
        const param = {
          name
        }
        consumeAutoLabelErpGoodList(param).then(res => {
          this.option = res.data
        })
      } else {
        this.option = []
      }
    },
    /**
     * 搜索回调
     * @param {*} e
     */
    handleSearch (e) {
      this.getList(e)
    },
    /**
     * 选择药品回调
     * @param {*} e
     */
    handleChange (e) {
      this.getGoods(e)
    },
    /**
     * 删除药品
     * @param {*} item
     */
    handleDel (index) {
      this.goods.splice(index, 1)
    },
    /**
     * 根据id查药品
     */
    getGoods (id) {
      const arr = this.option
      const goods = this.goods
      for (let i = 0; i < arr.length; i++) {
        if (id === arr[i].id) {
          let flag = false
          for (let j = 0; j < goods.length; j++) {
            if (id === goods[j].id) {
              flag = true
            }
          }
          if (!flag) {
            goods.unshift(arr[i])
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.goodsBox{
  width:100%;
  margin-bottom:20px;
  .select{
    width:400px;
    margin:10px auto;
  }
  .content{
    width:100%;
    height:200px;
    border: 1px solid #ccc;
    overflow: auto;
    box-sizing: border-box;
    ul{
      overflow: hidden;
      margin:0px;
      padding:20px;
      li{
        width:300px;
        float:left;
        margin-right:20px;
        margin-bottom:20px;
        background:#f4f4f4;
        padding:10px;
        box-sizing: border-box;
        border-radius: 5px;
        position: relative;
        .btn{
          font-size:20px;
          background:#a0a1a7;
          color:#fff;
          position: absolute;
          right:-10px;
          top:-10px;
          cursor:pointer;
          border-radius: 50%;
        }
        h2{
          width:100%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          font-size:16px;
          color:#7F7F7F;
          margin-bottom:10px;
        }
        p{
          display:flex;
          span{
            flex:1;
          }
          span:last-child{
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
