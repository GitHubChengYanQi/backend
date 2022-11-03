<!--
  海报设置
-->
<template>
  <a-form-model ref="posterForm" class="box" :model="form" :rules="rules">
    <div class="fl">
      <div class="poster-preview">
        <div class="user">
          <p class="img" />
          <p>
            <span>微信昵称</span>
            <span>邀请您一起参与</span>
          </p>
        </div>
        <p class="txt" v-if="!form.posterUrl">
          <span>① 建议尺寸：720px*1280px，大小不超过2M</span>
          <span>② [二维码】元素需要空出</span>
          <span>③ 海报其他部分皆可自定义设计</span>
          <span>④ 注意二维码位置不能与微信昵称头像重叠</span>
        </p>
        <img
          :src="form.posterUrl"
          class="bg"
          v-if="form.posterUrl">
        <vue-drag-resize
          v-if="qrcodeOpt.w"
          :w="qrcodeOpt.w"
          :h="qrcodeOpt.h"
          :x="qrcodeOpt.x"
          :y="qrcodeOpt.y"
          :sticks="['br','tl','tr','bl']"
          :aspectRatio="true"
          @resizing="qrcodeZoom"
          @dragging="qrcodeZoom"
        >
          <div class="qr-code">
            <img src="../../../assets/qr-preview.png">
          </div>
        </vue-drag-resize>
      </div>
      <div class="handle">
        <a-form-model-item prop="posterUrl">
          <PosterLoader :btnVal="form.posterUrl?'更换海报':'上传海报'" imageType=".jpg,.png" @changeImg="getImg" style="width:100%;" :btnType="false" />
          <a-input v-show="false" v-model="form.posterUrl" />
        </a-form-model-item>
      </div>
    </div>
    <div class="fr">
      <div class="item">
        <a-form-model-item prop="callbackKeyword">
          <span slot="label"><h2>海报生成关键字<span>（选填） 用与工作人员在公众号回复关键词，获取活动启动海报。</span></h2></span>
          <a-input v-model="form.callbackKeyword" :maxLength="10" placeholder="请输入名称" />
        </a-form-model-item>
        <a-form-model-item prop="ruleDescribe">
          <span slot="label"><h2>活动规则描述<span>（和海报一起弹出，用于对活动的规则描述）</span></h2></span>
          <a-input v-show="false" v-model="form.ruleDescribe" />
          <ScrmEditor @outputRes="getContent" :inputOpt="editOpt" />
        </a-form-model-item>
      </div>
      <div class="handle" style="margin-top:20px;">
        <a-button @click="prevFn">上一步</a-button>
        <a-button type="primary" @click="nextFn">下一步</a-button>
        <a-button type="primary" @click="saveFn">保存并发布</a-button>
      </div>
    </div>
  </a-form-model>
</template>

<script>
import ScrmEditor from './editor.vue'
import DataList from './msg.json'
import PosterLoader from './upload.vue'
import { containsNumber } from '@/utils/validate'
import { getLength } from '@/utils/util'
export default {
  name: 'ScrmBill',
  components: {
    ScrmEditor,
    PosterLoader
  },
  data () {
    const validateName = (rule, value, callback) => {
      if (containsNumber(value)) {
        return callback(new Error('只能输入中文、英文、符号'))
      } else {
        callback()
      }
    }
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
      editOpt: {
        id: 'ruleDescribe',
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
        content: DataList['活动规则描述'], // 回显内容
        height: '360px' // 编辑器高度
      },
      qrcodeOpt: {},
      form: {
        callbackKeyword: '',
        posterUrl: '',
        qrcodePosition: '',
        qrcodeSize: '',
        ruleDescribe: DataList['活动规则描述']
      },
      rules: {
        callbackKeyword: [
          // { required: true, message: '请输入海报生成关键字', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        ruleDescribe: [
          { required: true, message: '请输入活动规则描述', trigger: 'change' },
          { validator: validateDescribe, trigger: 'blur' }
        ],
        posterUrl: [
          { required: true, message: '请上传海报背景图片', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    form: {
      immediate: true,
      deep: true,
      handler (val) {
        const w = 360
        const h = 640
        this.qrcodeOpt = {
          w: Number(val.qrcodeSize.split('x')[0]) * w / 100,
          h: Number(val.qrcodeSize.split('x')[1]) * h / 100,
          x: Number(val.qrcodePosition.split('x')[0]) * w / 100,
          y: Number(val.qrcodePosition.split('x')[1]) * h / 100
        }
      }
    }
  },
  mounted () {},
  methods: {
    /**
     * 编辑器回调
     */
    getContent (res) {
      this.form[res.id] = res.content
      this.$refs['posterForm'].validateField(['ruleDescribe'])
    },
    /**
     * 图片回调
     * @param {*} img
     */
    getImg (img) {
      this.form.posterUrl = img
      this.$refs['posterForm'].validateField(['posterUrl'])
    },
    /**
     * 拖拽监听
     * @param {*} e
     */
    qrcodeZoom (e) {
      const w = 360
      const h = 640
      const qrcode = {
        w: (e.width * 100 / w).toFixed(2),
        h: (e.height * 100 / h).toFixed(2),
        x: (e.left * 100 / w).toFixed(2),
        y: (e.top * 100 / h).toFixed(2)
      }
      this.form.qrcodePosition = `${qrcode.x}x${qrcode.y}`
      this.form.qrcodeSize = `${qrcode.w}x${qrcode.h}`
    },
    /**
     * 下一步
     */
    nextFn () {
      this.$emit('toStep', {
        type: 'next',
        nav: 2
      })
    },
    /**
     * 上一步
     */
    prevFn () {
      this.$emit('toStep', {
        type: 'prev',
        nav: 0
      })
    },
    /**
     * 保存并发布
     */
    saveFn () {
      this.$parent.saveFn('poster')
    }
  }
}
</script>

<style lang="less" scoped>
  .box{
    width:90%;
    margin:0 auto;
    display:flex;
    .handle{
      button{
        margin-right:10px;
      }
    }
    .fl{
      width:360px;
      margin-right:20px;
      .poster-preview {
        width: 360px;
        height: 640px;
        background: #ccc;
        border: 1px solid #ededed;
        box-shadow: 0 1px 3px rgb(43 43 43 / 6%);
        position: relative;
        overflow: hidden;
        .user{
          width:200px;
          height:50px;
          position: absolute;
          left:20px;
          top:30px;
          z-index:2;
          p.img{
            width:50px;
            height:50px;
            background:#fff url(../../../assets/avatar.png) center no-repeat;
            background-size:70% 80%;
            float:left;
            margin-right:10px;
          }
          p{
            float:right;
            width:140px;
            span{
              display:block;
            }
          }
        }
        .txt{
          width:80%;
          margin:200px auto;
          span{
            display:block;
          }
        }
        .bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .qr-code img {
        width: 100%;
        height: auto;
        z-index: 10;
        min-height: 60px;
        min-width: 60px;
      }
      button{
        width:100%;
      }
    }
    .fr{
      flex:1;
      .item{
        padding:20px 30px;
        background:#fff;
        h2{
          font-size:16px;
          font-weight:bold;
          display: inline;
          word-break: break-all;
          white-space: pre-wrap;
          text-align: left;
          span{
            font-size:14px;
            color:#aaa;
            font-weight:normal;
          }
        }
      }
    }
  }
  :deep(.ant-form-item-label) > label::after{
    display:none;
  }
  .fl :deep(.ant-form-explain){
    margin-top:20px;
  }
  :deep(.ant-form-item-label){
    line-height:24px;
    text-align: left;
  }
  :deep(.ant-form-item){
    margin-bottom:10px;
  }
</style>
