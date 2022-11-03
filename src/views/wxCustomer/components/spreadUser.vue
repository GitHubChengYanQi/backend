<!--
  进度设置
-->
<template>
  <a-form-model ref="progressForm1" :model="form" :rules="rules">
    <!--tabs-->
    <div class="steps">
      <ul>
        <li v-for="(item, index) in steps" :key="index" @click="tapStep(index + 1)" :class="stepActive===index + 1?'active':''">{{ item }}</li>
      </ul>
    </div>
    <!--end tabs-->

    <!--item01-->
    <div class="item" v-show="stepActive===1">
      <h2 class="title">文本消息</h2>
      <a-form-model-item prop="helpText">
        <span slot="label"><h2>收到助力好友成功助力的提醒文案</h2></span>
        <a-input v-show="false" v-model="form.helpText" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt1" />
      </a-form-model-item>
    </div>
    <!--end item01-->

    <!--item02-->
    <div class="item" v-if="steps.length>=3" v-show="stepActive===2">
      <h2 class="title">文本消息</h2>
      <a-form-model-item prop="oneLevelCompleteTips">
        <span slot="label"><h2>完成一级任务，领取奖励文本消息</h2></span>
        <a-input v-show="false" v-model="form.oneLevelCompleteTips" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt2" />
      </a-form-model-item>
      <a-form-model-item>
        <a-checkbox :checked="form.oneLevelPushExchangeCode===1?true:false" @change="getVal($event, 'oneLevelPushExchangeCode')">
          完成任务自动推送奖品兑换码
        </a-checkbox>
      </a-form-model-item>
      <a-form-model-item prop="oneLevelPushImg">
        <span slot="label"><h2>完成一级任务，推送图片<span class="s2">（选填）</span></h2></span>
        <p class="uploadBox">
          <ScrmLoader ref="uploadImg1" :imgUrl="form.oneLevelPushImg" class="uploadImg" @changeImg="(e) => {getImg(e,1)}" />
          <span class="txt">
            <i>可以上传微信个人号/群二维码，企业微信个人号/群二维码【推荐使用活码】</i>jpg/png格式，1M以内
          </span>
        </p>
        <a-input v-show="false" v-model="form.oneLevelPushImg" />
      </a-form-model-item>
    </div>
    <!--end item02-->

    <!--item03-->
    <div class="item" v-if="steps.length>=4" v-show="stepActive===3">
      <h2 class="title">文本消息</h2>
      <a-form-model-item prop="twoLevelCompleteTips">
        <span slot="label"><h2>完成二级任务，领取奖励文本消息</h2></span>
        <a-input v-show="false" v-model="form.twoLevelCompleteTips" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt3" />
      </a-form-model-item>
      <a-form-model-item>
        <a-checkbox :checked="form.twoLevelPushExchangeCode===1?true:false" @change="getVal($event, 'twoLevelPushExchangeCode')">
          完成任务自动推送奖品兑换码
        </a-checkbox>
      </a-form-model-item>
      <a-form-model-item prop="twoLevelPushImg">
        <span slot="label"><h2>完成二级任务，推送图片<span class="s2">（选填）</span></h2></span>
        <p class="uploadBox">
          <ScrmLoader ref="uploadImg2" :imgUrl="form.twoLevelPushImg" class="uploadImg" @changeImg="(e) => {getImg(e,2)}" />
          <span class="txt">
            <i>可以上传微信个人号/群二维码，企业微信个人号/群二维码【推荐使用活码】</i>jpg/png格式，1M以内
          </span>
        </p>
        <a-input v-show="false" v-model="form.twoLevelPushImg" />
      </a-form-model-item>
    </div>
    <!--end item03-->

    <!--item04-->
    <div class="item" v-if="steps.length===5" v-show="stepActive===4">
      <h2 class="title">文本消息</h2>
      <a-form-model-item prop="threeLevelCompleteTips">
        <span slot="label"><h2>完成三级任务，领取奖励文本消息</h2></span>
        <a-input v-show="false" v-model="form.threeLevelCompleteTips" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt4" />
      </a-form-model-item>
      <a-form-model-item>
        <a-checkbox :checked="form.threeLevelPushExchangeCode===1?true:false" @change="getVal($event, 'threeLevelPushExchangeCode')">
          完成任务自动推送奖品兑换码
        </a-checkbox>
      </a-form-model-item>
      <a-form-model-item prop="threeLevelPushImg">
        <span slot="label"><h2>完成三级任务，推送图片<span class="s2">（选填）</span></h2></span>
        <p class="uploadBox">
          <ScrmLoader ref="uploadImg3" :imgUrl="form.threeLevelPushImg" class="uploadImg" @changeImg="(e) => {getImg(e,3)}" />
          <span class="txt">
            <i>可以上传微信个人号/群二维码，企业微信个人号/群二维码【推荐使用活码】</i>jpg/png格式，1M以内
          </span>
        </p>
        <a-input v-show="false" v-model="form.threeLevelPushImg" />
      </a-form-model-item>
    </div>
    <!--end item04-->

    <!--item05-->
    <div class="item" v-show="stepActive===steps.length">
      <a-form-model-item prop="endNewMemberText">
        <span slot="label"><h2>活动完成后继续有新成员加入提醒</h2></span>
        <a-input v-show="false" v-model="form.endNewMemberText" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt5" />
      </a-form-model-item>
      <div class="head">
        <h2>用户取消关注则助力失效<span class="s2">（开启此功能后，当助力好友取消关注时，则推送此处文案提醒上级用户）</span></h2>
        <br />
        <a-radio-group v-model="form.helpCancelInvalid" class="raido">
          <a-radio :value="1">
            开启
          </a-radio>
          <a-radio :value="0">
            关闭
          </a-radio>
        </a-radio-group>
      </div>
      <a-form-model-item prop="helpCancelText" v-show="form.helpCancelInvalid === 1">
        <a-input v-show="false" v-model="form.helpCancelText" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt6" />
      </a-form-model-item>
    </div>
    <!--end item05-->

  </a-form-model>
</template>

<script>
import ScrmEditor from './editor.vue'
import ScrmLoader from './upload.vue'
import DataList from './msg.json'
import { getLength } from '@/utils/util'
export default {
  name: 'SpeadUser',
  components: {
    ScrmEditor,
    ScrmLoader
  },
  watch: {
    steps (newV) {
      console.log('原始数据', this.form.oneLevelCompleteTips)
      console.log(this.$parent.$parent.type)
      if (newV.length === 5) {
        this.form.threeLevelPushExchangeCode = Number(this.form.threeLevelPushExchangeCode) || 1
        this.form.twoLevelPushExchangeCode = Number(this.form.twoLevelPushExchangeCode) || 1
        this.form.oneLevelPushExchangeCode = Number(this.form.oneLevelPushExchangeCode) || 1

        if (this.$parent.$parent.type === 'edit') {
          this.editOpt2.content = this.form.oneLevelCompleteTips
          this.editOpt3.content = this.form.twoLevelCompleteTips
        } else {
          this.form.threeLevelCompleteTips = DataList['完成三级任务，领取奖励文本消息']
          this.form.oneLevelCompleteTips = DataList['完成一级任务，领取奖励文本消息'] + this.joinTxt('二')
          this.form.twoLevelCompleteTips = DataList['完成二级任务，领取奖励文本消息'] + this.joinTxt('三')
          this.editOpt2.content = DataList['完成一级任务，领取奖励文本消息'] + this.joinTxt('二')
          this.editOpt3.content = DataList['完成二级任务，领取奖励文本消息'] + this.joinTxt('三')
        }
      }
      if (newV.length === 4) {
        this.form.threeLevelPushExchangeCode = ''
        this.form.threeLevelCompleteTips = ''
        this.form.twoLevelPushExchangeCode = Number(this.form.twoLevelPushExchangeCode) || 1
        this.form.oneLevelPushExchangeCode = Number(this.form.oneLevelPushExchangeCode) || 1
        if (this.$parent.$parent.type === 'edit') {
          this.editOpt2.content = this.form.oneLevelCompleteTips
          this.editOpt3.content = this.form.twoLevelCompleteTips
        } else {
          this.form.oneLevelCompleteTips = DataList['完成一级任务，领取奖励文本消息'] + this.joinTxt('二')
          this.form.twoLevelCompleteTips = DataList['完成二级任务，领取奖励文本消息']
          this.editOpt2.content = DataList['完成一级任务，领取奖励文本消息'] + this.joinTxt('二')
          this.editOpt3.content = DataList['完成二级任务，领取奖励文本消息']
        }
      }
      if (newV.length === 3) {
        this.form.threeLevelPushExchangeCode = ''
        this.form.threeLevelCompleteTips = ''
        this.form.twoLevelPushExchangeCode = ''
        this.form.twoLevelCompleteTips = ''
        this.form.oneLevelPushExchangeCode = Number(this.form.oneLevelPushExchangeCode) || 1
        this.form.oneLevelCompleteTips = DataList['完成一级任务，领取奖励文本消息']
        this.editOpt2.content = this.form.oneLevelCompleteTips || DataList['完成一级任务，领取奖励文本消息']
      }
    }
  },
  data () {
    const validateDescribe = (rule, value, callback) => {
      // 替换链接个数
      const num1 = value.match(/##活动地址##/g) ? value.match(/##活动地址##/g).length : 0
      const num5 = value.match(/##助力好友昵称##/g) ? value.match(/##助力好友昵称##/g).length : 0
      const num6 = value.match(/##用户昵称##/g) ? value.match(/##用户昵称##/g).length : 0
      const num7 = value.match(/##戳此查看好友助力情况##/g) ? value.match(/##戳此查看好友助力情况##/g).length : 0
      const len = getLength(value)
      const num = (num1 + num5 + num6 + num7) * 200 - (getLength('##活动地址##') * num1) - (getLength('##助力好友昵称##') * num5) - (getLength('##用户昵称##') * num6) - (getLength('##戳此查看好友助力情况##') * num7)
      if ((len + num) > 1600) {
        return callback(new Error('内容过长，请重新编辑'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      stepActive: 1,
      steps: [ '好友助力提醒', '一级任务完成，领取奖励', '更多设置' ],
      numMap: {
        1: '一',
        2: '二',
        3: '三'
      },
      editOpt1: {
        id: 'helpText',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'incomplete',
            name: '未完成任务量',
            data: null
          },
          {
            type: 'complete',
            name: '已完成任务量',
            data: null
          },
          {
            type: 'personNum',
            name: '达成条件需要人数',
            data: ['达成一级条件需要人数']
          },
          {
            type: 'stock',
            name: '库存剩余',
            data: ['一级奖品库存']
          },
          {
            type: 'progress',
            name: '助力进度/领奖',
            data: null
          },
          {
            type: 'link',
            name: '链接',
            data: null
          }
        ],
        content: DataList['收到助力好友成功助力的提醒文案'], // 回显内容
        height: '200px' // 编辑器高度
      },
      editOpt2: {
        id: 'oneLevelCompleteTips',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'incomplete',
            name: '未完成任务量',
            data: null
          },
          {
            type: 'complete',
            name: '已完成任务量',
            data: null
          },
          {
            type: 'progress',
            name: '助力进度/领奖',
            data: null
          },
          {
            type: 'prize',
            name: '奖品',
            data: ['一级任务奖品']
          },
          {
            type: 'link',
            name: '链接',
            data: null
          }
        ],
        content: DataList['完成一级任务，领取奖励文本消息'], // 回显内容
        height: '200px' // 编辑器高度
      },
      editOpt3: {
        id: 'twoLevelCompleteTips',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'incomplete',
            name: '未完成任务量',
            data: null
          },
          {
            type: 'complete',
            name: '已完成任务量',
            data: null
          },
          {
            type: 'progress',
            name: '助力进度/领奖',
            data: null
          },
          {
            type: 'prize',
            name: '奖品',
            data: ['一级任务奖品']
          },
          {
            type: 'link',
            name: '链接',
            data: null
          }
        ],
        content: DataList['完成二级任务，领取奖励文本消息'], // 回显内容
        height: '200px' // 编辑器高度
      },
      editOpt4: {
        id: 'threeLevelCompleteTips',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'incomplete',
            name: '未完成任务量',
            data: null
          },
          {
            type: 'complete',
            name: '已完成任务量',
            data: null
          },
          {
            type: 'progress',
            name: '助力进度/领奖',
            data: null
          },
          {
            type: 'prize',
            name: '奖品',
            data: ['一级任务奖品']
          },
          {
            type: 'link',
            name: '链接',
            data: null
          }
        ],
        content: DataList['完成三级任务，领取奖励文本消息'], // 回显内容
        height: '200px' // 编辑器高度
      },
      editOpt5: {
        id: 'endNewMemberText',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'complete',
            name: '已完成任务量',
            data: null
          },
          {
            type: 'progress',
            name: '助力进度/领奖',
            data: null
          },
          {
            type: 'prize',
            name: '奖品',
            data: ['一级任务奖品']
          },
          {
            type: 'link',
            name: '链接',
            data: null
          }
        ],
        content: DataList['活动完成后继续有新成员加入提醒'], // 回显内容
        height: '200px' // 编辑器高度
      },
      editOpt6: {
        id: 'helpCancelText',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'complete',
            name: '已完成任务量',
            data: null
          },
          {
            type: 'progress',
            name: '助力进度/领奖',
            data: null
          },
          {
            type: 'prize',
            name: '奖品',
            data: ['一级任务奖品']
          },
          {
            type: 'link',
            name: '链接',
            data: null
          }
        ],
        content: DataList['用户取消关注则助力失效'], // 回显内容
        height: '200px' // 编辑器高度
      },
      form: {
        helpText: DataList['收到助力好友成功助力的提醒文案'],
        oneLevelCompleteTips: DataList['完成一级任务，领取奖励文本消息'],
        twoLevelCompleteTips: '',
        threeLevelCompleteTips: '',
        endNewMemberText: DataList['活动完成后继续有新成员加入提醒'],
        helpCancelText: DataList['用户取消关注则助力失效'],
        oneLevelPushImg: '',
        twoLevelPushImg: '',
        threeLevelPushImg: '',
        oneLevelPushExchangeCode: 1,
        twoLevelPushExchangeCode: 1,
        threeLevelPushExchangeCode: 1,
        helpCancelInvalid: 0
      },
      rules: {
        helpText: [
          { required: true, message: '请输入收到助力好友成功助力的提醒文案', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        oneLevelCompleteTips: [
          { required: true, message: '请输入完成一级任务，领取奖励文本消息', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        twoLevelCompleteTips: [
          { required: true, message: '请输入完成二级任务，领取奖励文本消息', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        threeLevelCompleteTips: [
          { required: true, message: '请输入完成三级任务，领取奖励文本消息', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        endNewMemberText: [
          { required: true, message: '请输入活动完成后继续有新成员加入提醒', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        helpCancelText: [
          { required: true, message: '请输入用户取消关注则助力失效', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ]
        // oneLevelPushImg: [
        //   { required: true, message: '请上传完成一级任务推送图片', trigger: 'change' }
        // ],
        // twoLevelPushImg: [
        //   { required: true, message: '请上传完成二级任务推送图片', trigger: 'change' }
        // ],
        // threeLevelPushImg: [
        //   { required: true, message: '请上传完成三级任务推送图片', trigger: 'change' }
        // ]
      }
    }
  },
  mounted () {},
  methods: {
    /**
     * 根据奖品等级，拼接文案
     */
    joinTxt (num) {
      const txt = '\n------\n继续邀请' + num + '级未完成任务量人，可领取<a href="##活动地址##">[XXX奖品]</a>'
      return txt
    },
    /**
     * 根据奖品级别，拼接文案返回
     * @param {*} level 级别
     */
    joinTips (level) {
      const num = this.steps.length
      let txt = ''
      txt = DataList['完成' + this.numMap[level] + '级任务，领取奖励文本消息']
      const JoinTxt = '\n------\n继续邀请' + this.numMap[(level + 1)] + '级未完成任务量人，可领取<a href="##活动地址##">[XXX奖品]</a>'
      if (num === 5) {
        if (level === 1 || level === 2) {
          txt = txt + JoinTxt
        }
      }
      if (num === 4) {
        if (level === 1) {
          txt = txt + JoinTxt
        }
      }
      return txt
    },
    /**
     * checkbox回调
     */
    getVal (e, type) {
      if (e) {
        this.form[type] = 1
      } else {
        this.form[type] = 0
      }
    },
    /**
     * 图片回调
     * @param {*} img
     */
    getImg (img, type) {
      if (type === 1) {
        this.form.oneLevelPushImg = img
        this.$refs['progressForm1'].validateField(['oneLevelPushImg'])
      } else if (type === 2) {
        this.form.twoLevelPushImg = img
        this.$refs['progressForm1'].validateField(['twoLevelPushImg'])
      } else if (type === 3) {
        this.form.threeLevelPushImg = img
        this.$refs['progressForm1'].validateField(['threeLevelPushImg'])
      }
    },
    /**
     * 编辑器回调
     */
    getContent (res) {
      this.form[res.id] = res.content
      this.$refs.progressForm1.validate(() => {})
    },
    /**
     * 切换tab
     * @param {*} key
     */
    tapStep (key) {
      this.stepActive = key
    }
  }
}
</script>

<style lang="less" scoped>
.box{
  width:90%;
  margin:0 auto;
  .steps{
    width:100%;
    margin:0px auto 10px;
    ul{
      padding:0;
      height:auto;
      overflow: hidden;
      li{
        padding:0 20px;
        text-align: center;
        font-size:18px;
        font-weight:bold;
        cursor: pointer;
        position: relative;
        float:left;
        margin-bottom:20px;
        &::after{
          content:'>>>>';
          color:#D7D7D7;
          position: relative;
          right:-20px;
          font-weight:bold;
        }
      }
      li:last-child{
        &::after{
          display:none;
        }
      }
      li.active{
        color:#3470FF;
        &::before{
          content:'';
          width:60px;
          height:4px;
          background:#3470FF;
          position: absolute;
          bottom:-8px;
          left:50%;
          transform: translate(-50%);
          border-radius: 2px;
        }
        &::after{
          content:'>>>>';
          color:#3470FF;
        }
      }
    }
  }
  .steps2{
    width:100%;
    margin:0px auto 10px;
    ul{
      padding:0;
      height:auto;
      overflow: hidden;
      li{
        padding:0 7px;
        text-align: center;
        font-size:14px;
        font-weight:bold;
        cursor: pointer;
        position: relative;
        float:left;
        margin-bottom:20px;
        &::after{
          content:'>';
          color:#D7D7D7;
          position: relative;
          right:-5px;
          font-weight:bold;
        }
      }
      li:last-child{
        &::after{
          display:none;
        }
      }
      li.active{
        color:#3470FF;
        &::before{
          content:'';
          width:60px;
          height:4px;
          background:#3470FF;
          position: absolute;
          bottom:-8px;
          left:50%;
          transform: translate(-50%);
          border-radius: 2px;
        }
        &::after{
          content:'>';
          color:#3470FF;
        }
      }
    }
  }
  .item{
    background:#fff;
    padding:20px 30px;
    .head{
      height:50px;
      &::before{
        display: inline-block;
        margin-right: 4px;
        color: #f5222d;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
    }
    h2{
      font-size:16px;
      font-weight:bold;
      display: inline;
      span{
        font-size:14px;
        font-weight:normal;
        color:#888;
      }
    }
    h2.title{
      color:#3470FF;
      font-size:18px;
      font-weight:bold;
      border-bottom:1px solid #ccc;
      line-height:50px;
      display:block;
    }
    .uploadBox{
      .uploadImg{
        float:left;
        width:130px;
      }
      .txt{
        vertical-align: bottom;
        i{
          font-style:normal;
          display:block;
          color:#D9001B;
        }
      }
    }
  }
  .handle{
    margin-top:20px;
    button{
      margin-right:10px;
    }
  }
}
:deep(.ant-form-item-label) > label::after{
  display:none;
}
</style>
