<!--
  助力用户
-->
<template>
  <a-form-model ref="progressForm2" :model="form" :rules="rules">
    <div class="item">
      <a-form-model-item prop="helpSuccessText">
        <span slot="label"><h2>成功助力好友推送文案</h2></span>
        <a-input v-show="false" v-model="form.helpSuccessText" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt7" />
      </a-form-model-item>
    </div>
    <div class="item">
      <a-form-model-item prop="helpRepeatText">
        <span slot="label"><h2>重复助力好友提醒文案</h2></span>
        <a-input v-show="false" v-model="form.helpRepeatText" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt8" />
      </a-form-model-item>
    </div>
    <div class="item">
      <div class="head">
        <h2>新关注用户才能给好友助力<span class="s2">（开启此功能后，已关注公众号的用户无法给好友助力，但可正常生成推广海报参与活动）</span></h2>
        <br />
        <a-radio-group v-model="form.mustNewMember" class="raido">
          <a-radio :value="1">
            开启
          </a-radio>
          <a-radio :value="0">
            关闭
          </a-radio>
        </a-radio-group>
      </div>
      <a-form-model-item prop="newMemberInvalidText" v-show="form.mustNewMember === 1">
        <a-input v-show="false" v-model="form.newMemberInvalidText" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt9" />
      </a-form-model-item>
    </div>
  </a-form-model>
</template>

<script>
import ScrmEditor from './editor.vue'
import DataList from './msg.json'
import { getLength } from '@/utils/util'
export default {
  name: 'HelpUser',
  components: {
    ScrmEditor
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
      editOpt7: {
        id: 'helpSuccessText',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'prize',
            name: '奖品',
            data: ['一级任务奖品']
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
          },
          {
            type: 'reply',
            name: '自动回复',
            data: null
          }
        ],
        content: DataList['成功助力好友推送文案'], // 回显内容
        height: '200px' // 编辑器高度
      },
      editOpt8: {
        id: 'helpRepeatText',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'prize',
            name: '奖品',
            data: ['一级任务奖品']
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
          },
          {
            type: 'reply',
            name: '自动回复',
            data: null
          }
        ],
        content: DataList['重复助力好友提醒文案'], // 回显内容
        height: '200px' // 编辑器高度
      },
      editOpt9: {
        id: 'newMemberInvalidText',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'prize',
            name: '奖品',
            data: ['一级任务奖品']
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
          },
          {
            type: 'reply',
            name: '自动回复',
            data: null
          }
        ],
        content: DataList['新关注用户才能给好友助力'], // 回显内容
        height: '200px' // 编辑器高度
      },
      form: {
        helpSuccessText: DataList['成功助力好友推送文案'],
        helpRepeatText: DataList['重复助力好友提醒文案'],
        newMemberInvalidText: DataList['新关注用户才能给好友助力'],
        mustNewMember: 0
      },
      rules: {
        helpSuccessText: [
          { required: true, message: '请输入成功助力好友推送文案', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        helpRepeatText: [
          { required: true, message: '请输入重复助力好友提醒文案', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        newMemberInvalidText: [
          { required: true, message: '请输入新关注用户才能给好友助力', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ]
      }
    }
  },
  created () {},
  methods: {
    /**
     * 编辑器回调
     */
    getContent (res) {
      this.form[res.id] = res.content
      this.$refs.progressForm2.validate(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.box{
  width:90%;
  margin:0 auto;
  .item{
    background:#fff;
    padding:20px 30px;
    margin-bottom:20px;
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
  }
}
:deep(.ant-form-item-label) > label::after{
  display:none;
}
</style>
