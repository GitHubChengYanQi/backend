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
      show-search
      placeholder="Select a person"
      option-filter-prop="children"
      :filter-option="filterOption"
      @change="handleChange"
    >
      <a-select-option value="jack">
        Jack
      </a-select-option>
      <a-select-option value="lucy">
        Lucy
      </a-select-option>
      <a-select-option value="tom">
        Tom
      </a-select-option>
    </a-select>
    <!-- end head -->
    <!-- list -->
    <div class="content">
      <ul>
        <li v-for="(item, index) in goods" :key="index">
          <h2>{{ item.name }}</h2>
          <p>
            <span>售价 ￥{{ item.price }}</span>
            <span>毛利率 {{ item.gain }}%</span>
          </p>
          <a-icon class="btn" type="close-circle" />
        </li>
      </ul>
    </div>
    <!-- end list -->
  </div>
</template>

<script>
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
      goods: [
        {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }, {
          name: '(会限)利君沙/琥乙红霉素片 10片/板*2板/盒',
          price: '23.03',
          gain: '20'
        }
      ]
    }
  },
  created () {
  },
  watch: {
    value (val, oldval) {
      console.log(1111, val)
    }
  },
  methods: {
    /**
     * select搜索
     * @param {*} input
     * @param {*} option
     */
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
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
