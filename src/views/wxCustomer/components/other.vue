<!--
  其他设置
-->
<template>
  <a-form-model class="box" ref="otherForm" :model="form" :rules="rules">
    <div class="item">
      <a-form-model-item prop="noDisturbText">
        <span slot="label">
          <h2 class="title">免打扰设置</h2>
        </span>
        <a-input v-show="false" v-model="form.noDisturbText" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt10" />
      </a-form-model-item>
      <a-form-model-item prop="noDisturbNumber">
        <h2 class="title"><span class="s1">当助力人数达到<a-input-number style="margin:0 10px" v-model="form.noDisturbNumber" :min="1" :max="999999" />人，开启免打扰模式</span></h2>
      </a-form-model-item>
    </div>
    <div class="item">
      <a-form-model-item prop="endText">
        <span slot="label"><h2>活动结束文案</h2></span>
        <a-input v-show="false" v-model="form.endText" />
        <ScrmEditor @outputRes="getContent" :inputOpt="editOpt11" />
      </a-form-model-item>
      <a-form-model-item prop="endImg">
        <span slot="label"><h2 class="title">推送图片<span class="s2">（选填）jpg/png格式，1M以内</span></h2></span>
        <ScrmLoader :imgUrl="form.endImg" @changeImg="getImg" />
        <a-input v-show="false" v-model="form.endImg" />
      </a-form-model-item>
    </div>
    <div class="handle">
      <a-button @click="prevFn">上一步</a-button>
      <a-button @click="saveFn" type="primary">保存并发布</a-button>
    </div>
  </a-form-model>
</template>

<script>
import ScrmEditor from './editor.vue'
import ScrmLoader from './upload.vue'
import DataList from './msg.json'
import { getLength } from '@/utils/util'
export default {
  name: 'ScrmOther',
  components: {
    ScrmEditor,
    ScrmLoader
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
      editOpt10: {
        id: 'noDisturbText',
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
            type: 'link',
            name: '链接',
            data: null
          }
        ],
        content: DataList['免打扰设置'], // 回显内容
        height: '200px' // 编辑器高度
      },
      editOpt11: {
        id: 'endText',
        btnOpt: [
          {
            type: 'emoji',
            name: '表情',
            data: null
          },
          {
            type: 'link',
            name: '链接',
            data: null
          }
        ],
        content: DataList['活动结束文案'], // 回显内容
        height: '200px' // 编辑器高度
      },
      form: {
        noDisturbNumber: 10,
        noDisturbText: DataList['免打扰设置'],
        endText: DataList['活动结束文案'],
        endImg: ''
      },
      rules: {
        noDisturbText: [
          { required: true, message: '请输入免打扰设置', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        endText: [
          { required: true, message: '请输入活动结束文案', trigger: 'blur' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        noDisturbNumber: [
          { required: true, message: '请输入打扰模式人数', trigger: 'change' }
        ]
        // endImg: [
        //   { required: true, message: '请上传活动结束推送图片', trigger: 'change' }
        // ]
      }
    }
  },
  created () {},
  methods: {
    /**
     * 图片回调
     * @param {*} img
     */
    getImg (img) {
      this.form.endImg = img
      this.$refs.otherForm.validateField(['endImg'])
    },
    /**
     * 编辑器回调
     */
    getContent (res) {
      this.form[res.id] = res.content
      this.$refs.otherForm.validate(() => {})
    },
    prevFn () {
      this.$parent.backup('other', () => {
        this.$emit('toStep', {
          type: 'prev',
          nav: 2
        })
      })
    },
    /**
     * 保存并发布
     */
    saveFn () {
      this.$parent.saveFn('other')
    }
  }
}
</script>

<style lang="less" scoped>
.box{
    width:90%;
    margin:0 auto;
    .handle{
      margin-top:20px;
      button{
        margin-right:10px;
      }
    }
    .item{
      padding:20px 30px;
      background:#fff;
      margin-bottom:20px;
      h2{
        font-size:16px;
        font-weight:bold;
        display:inline;
      }
      h2.title{
        span.s1{
          input{
            width:100px;
            margin:0 10px;
          }
        }
        span{
          font-size:14px;
          color:#aaa;
          font-weight:normal;
        }
      }
    }
  }
  :deep(.ant-form-item-label) > label::after{
    display:none;
  }
</style>
