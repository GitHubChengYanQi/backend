<!--
  进度设置
-->
<template>
  <div class="box" id="boxs">
    <div v-show="show">
      <div class="tabs">
        <ul>
          <li v-for="item in tabs" :key="item.key" @click="tapNav(item.key)" :class="active===item.key?'active':''">{{ item.name }}</li>
        </ul>
      </div>
      <SpreadUser ref="SpreadUser" v-show="active===1" />
      <HelpUser ref="HelpUser" v-show="active===2" />
      <div class="handle">
        <a-button @click="prevFn">上一步</a-button>
        <a-button @click="nextFn" type="primary">下一步</a-button>
        <a-button @click="saveFn" type="primary">保存并发布</a-button>
      </div>
    </div>
    <div class="tipbox" v-show="!show">
      <div class="content">
        <h2>暂未选择任何服务号</h2>
        <a-button icon="plus" type="primary" @click="returnBasic">去添加</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import ScrmEditor from './editor.vue'
import SpreadUser from './spreadUser.vue'
import HelpUser from './helpUser.vue'

export default {
  name: 'ScrmProgress',
  components: {
    ScrmEditor,
    SpreadUser,
    HelpUser
  },
  data () {
    return {
      show: true,
      active: 1,
      tabs: [
        {
          key: 1,
          name: '推广用户'
        },
        {
          key: 2,
          name: '助力用户'
        }
      ]
    }
  },
  mounted () {},
  methods: {
    tapNav (key) {
      this.active = key
    },
    prevFn () {
      if (this.active === 1) {
        const num = this.$refs.SpreadUser.stepActive
        if (num === 1) {
          this.$emit('toStep', {
            type: 'prev',
            nav: 1
          })
        } else {
          this.$refs.SpreadUser.stepActive--
        }
      } else {
        this.active = 1
        const arr = this.$refs.SpreadUser.steps
        this.$refs.SpreadUser.stepActive = arr.length
      }
    },
    nextFn () {
      if (this.active === 2) {
        this.$emit('toStep', {
          type: 'next',
          nav: 3
        })
      } else {
        const arr = this.$refs.SpreadUser.steps
        if (arr.length === this.$refs.SpreadUser.stepActive) {
          this.active = 2
        } else {
          this.$refs.SpreadUser.stepActive++
        }
      }
    },
    returnBasic () {
      this.$emit('toStep', {
        type: 'prev',
        nav: 0
      })
    },
    /**
     * 保存并发布
     */
    saveFn () {
      this.$parent.saveFn('progress')
    }
  }
}
</script>

<style lang="less" scoped>
.box{
  width:90%;
  margin:0 auto;
  .tabs{
    width:450px;
    height:40px;
    margin:0 auto;
    margin-bottom:30px;
    li{
      background:#fff;
      display:inline-block;
      width:50%;
      height:40px;
      line-height:40px;
      text-align: center;
      font-size:19px;
      cursor:pointer;
    }
    li.active{
      background:#3470ff;
      color:#fff;
    }
  }
  .handle{
    margin-top:20px;
    button{
      margin-right:10px;
    }
  }
  .tipbox{
    width:100%;
    min-height:600px;
    background:#fff;
    position: relative;
    .content{
      width:300px;
      height:50px;
      position:absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      text-align: center;
    }
  }
}
</style>
