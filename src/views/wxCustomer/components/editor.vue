<!--
  组件名称：规则编辑器
  接收参数：
  inputOpt == {
    btnOpt: [
      {
        type: 'emoji',//表情
        data: null
      },
      {
        type: 'prize',//奖品
        data: {}
      },
      {
        type: 'complete',//已完成任务量
        data: {}
      },
      {
        type: 'incomplete',//未完成任务量
        data: {}
      },
      {
        type: 'personNum',//达成条件需要人数
        data: {}
      },
      {
        type: 'stock',//库存剩余
        data: {}
      },
      {
        type: 'progress', //助力进度/领奖
        data: null
      },
      {
        type: 'link',//链接
        data: null
      },
      {
        type: 'reply',//自动回复
        data: null
      }
    ],
    content:'', // 回显内容
    height: '360px' // 编辑器高度
  }

  输出参数：
  output == {
    content:'' //内容
  }
-->
<template>
  <div class="editorBox">

    <!--编辑器头部-->
    <div class="head">
      插入：
      <span v-for="item in btnOpt" :key="item.type">
        <a-popover trigger="click" v-if="item.type === 'emoji' || item.type === 'prize' || item.type === 'personNum' || item.type === 'stock'" placement="bottomLeft" v-model="popoverVisible[item.type]">
          <template slot="content">
            <ul class="emojiList" v-if="item.type === 'emoji'">
              <li @click="insertFn('emoji', items)" v-for="(items,index) in EmojiLIst" :key="index">{{ items }}</li>
            </ul>
            <ul class="selectList" v-if="item.type === 'prize'">
              <li @click="tapFn('prize', items)" v-for="(items,index) in item.data" :key="index">{{ items }}</li>
            </ul>
            <ul class="selectList" v-if="item.type === 'personNum'">
              <li @click="insertFn('personNum', items)" v-for="(items,index) in item.data" :key="index">{{ items }}</li>
            </ul>
            <ul class="selectList" v-if="item.type === 'stock'">
              <li @click="insertFn('stock', items)" v-for="(items,index) in item.data" :key="index">{{ items }}</li>
            </ul>
          </template>
          <a-button>
            {{ item.name }}
          </a-button>
        </a-popover>
        <a-button v-else-if="item.type === 'complete' || item.type === 'incomplete'" @click="insertFn(item.type, '')">
          {{ item.name }}
        </a-button>
        <a-button v-else @click="tapFn(item.type)">
          {{ item.name }}
        </a-button>
      </span>
      <!-- <span>
        <a-button @click="tapFn('html')">
          {{ mode ? 'text' : 'html' }}
        </a-button>
      </span> -->
    </div>
    <!--end 编辑器头部-->

    <!--编辑器输入框-->
    <div
      class="editBox"
      :id="inputOpt.id"
      @click="getSelection"
      :style="`height:${inputOpt.height}`"
      contenteditable></div>
    <!--end 编辑器输入框-->

    <!--弹框-->
    <a-modal
      :class="dialogData.type==='link'?'dialogBox link':'dialogBox'"
      @cancel="reset"
      :visible="dialogData.visible"
      :title="dialogData.title">
      <a-form-model ref="ruleForm" :model="dialogData" v-bind="dialogData.type==='reply'?'':layout">
        <div class="info" v-if="dialogData.type==='reply'">
          <h2>功能介绍：用户点击链接文案，自动给公众号发消息</h2>
          <p>由于微信限制，用户扫码后，必须回复消息，公众号才能在48小时内自动给客户发送消息（限20条）；</p>
          <p>通过以下设置，仅需用户点击链接文案，即可实现自动给公众号自动发送消息（激活公众号在48小时内可以给用户自动发送20条消息）</p>
        </div>
        <div v-for="(item, index) in dialogData.data" :key="index">
          <p v-if="dialogData.type === 'progress'" class="progress">
            <a-form-model-item
              :prop="`data.${index}.value`"
              :label="item.name"
              :rules="{
                required: true,
                message: '请输入显示文案',
                trigger: 'blur',
              }">
              <a-input v-model="item.value" :maxLength="20" style="width:300px;"></a-input>
            </a-form-model-item>
          </p>
          <p v-if="dialogData.type === 'link'" class="link">
            <a-form-model-item
              :prop="`data.${index}.value`"
              :rules="{
                required: true,
                message: item.validate,
                trigger: 'blur',
              }">
              <span slot="label">
                {{ item.name }}&nbsp;
                <a-tooltip v-if="item.name === '链接文本'" title="用户该段文本跳转到链接网页">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
              <a-input v-model="item.value" v-if="item.name === '链接文本'" :maxLength="20" :placeholder="item.placeholder" style="width:300px;"></a-input>
              <a-input v-model="item.value" v-if="item.name === '链接地址'" :maxLength="200" :placeholder="item.placeholder" style="width:300px;"></a-input>
            </a-form-model-item>
          </p>
          <p v-if="dialogData.type === 'reply'">
            <a-form-model-item
              :prop="`data.${index}.value`"
              :rules="{
                required: true,
                message: item.validate,
                trigger: 'blur',
              }">
              <span slot="label">
                {{ item.name }}&nbsp;<span class="subName">{{ item.subName }}</span>
              </span>
              <a-input v-model="item.value" :maxLength="20" :placeholder="item.placeholder" style="width:100%;"></a-input>
            </a-form-model-item>
          </p>
          <p v-if="dialogData.type === 'prize'" class="prize">
            <a-form-model-item
              :prop="`data.${index}.value`"
              :rules="{
                required: true,
                message: '请输入奖品文案',
                trigger: 'blur',
              }">
              <span slot="label">
                {{ item.name }}
              </span>
              <a-input v-model="item.value" :maxLength="20" :placeholder="item.placeholder" style="width:300px;"></a-input>
            </a-form-model-item>
          </p>
        </div>
      </a-form-model>
      <template slot="footer">
        <a-button key="submit" @click="insertFn(dialogData.type,dialogData.data)" type="primary">
          确定
        </a-button>
        <a-button @click="reset" key="back">
          取消
        </a-button>
      </template>
    </a-modal>
    <!--end 弹框-->

  </div>
</template>

<script>
import EmojiLIst from './emoji.json'
import { mapGetters } from 'vuex'
export default {
  name: 'Editor',
  props: {
    inputOpt: {
      type: Object,
      default: () => {
        return {
          id: '', // 组件ID
          btnOpt: [], // 按钮配置
          content: '', // 回显内容
          height: '200px' // 编辑器高度
        }
      }
    }
  },
  watch: {
    inputOpt: {
      immediate: true,
      deep: true,
      handler (val) {
        const { btnOpt, content } = val
        this.btnOpt = btnOpt
        this.content = content
        setTimeout(() => {
          const editBox = document.getElementById(this.inputOpt.id)
          editBox.innerHTML = this.content
        }, 100)
      }
    },
    prizeLevel (data) {
      const arr = this.inputOpt.btnOpt
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === 'prize') {
          arr[i].data = data.prize
        }
        if (arr[i].type === 'personNum') {
          arr[i].data = data.personNum
        }
        if (arr[i].type === 'stock') {
          arr[i].data = data.stock
        }
      }
    }
  },
  computed: {
    ...mapGetters(['prizeLevel'])
  },
  data () {
    return {
      EmojiLIst,
      mode: true,
      popoverVisible: {
        emoji: false,
        eprize: false,
        personNum: false,
        complete: false,
        incomplete: false,
        reply: false,
        link: false,
        progress: false,
        stock: false
      },
      dialogData: {
        type: '',
        title: '',
        data: [],
        visible: false
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      urlMap: {
        path: '##活动地址##',
        progress: '##好友助力情况##',
        reply: '##自动回复##',
        nickname: '##用户昵称##',
        friend: '##助力好友昵称##',
        complete: '##已完成任务量##',
        incomplete: '##未完成任务量##',
        incomplete2: '##二级未完成任务量##',
        incomplete3: '##三级未完成任务量##',
        personNum: '##达成一级条件需要人数##',
        personNum2: '##达成二级条件需要人数##',
        personNum3: '##达成三级条件需要人数##'
      },
      selection: null, // 保存光标位置
      btnOpt: [], // 编辑器按钮配置
      content: '', // 编辑器内容
      numMap: {
        0: '一',
        1: '二',
        2: '三',
        3: '四',
        4: '五',
        5: '六',
        6: '七',
        7: '八',
        8: '九',
        9: '十'
      },
      rules: {
        prizeName: [
          { required: true, message: '请上传海报背景图片', trigger: 'change' }
        ]
      }
    }
  },
  created () {},
  mounted () {
    this.onInputEditor()
  },
  methods: {
    /**
     * 尾部插入内容
     * type: str dom
     */
    endInsert (val, type) {
      const editBox = document.getElementById(this.inputOpt.id)
      if (type === 'str') {
        editBox.innerHTML = editBox.innerHTML + val
      } else {
        editBox.appendChild(val)
      }
    },
    /**
     * 插入标签
     * @param {*} type
     * @param {*} value
     */
    insertFn (type, value) {
      this.restoreSelection((range) => {
        if (type === 'emoji') {
          const dom = document.createTextNode(value)
          if (range) {
            range.insertNode(dom)
          } else {
            this.endInsert(value, 'str')
          }
        }
        if (type === 'prize') {
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              const dom = document.createElement('a')
              // dom.setAttribute('contenteditable', false)
              dom.setAttribute('href', `##活动地址##`)
              dom.innerHTML = `[${value[0].value}]`
              if (range) {
                range.insertNode(dom)
              } else {
                this.endInsert(dom, 'dom')
              }
              this.dialogData = {
                type: '',
                title: '',
                data: [],
                visible: false
              }
            }
          })
        }
        if (type === 'personNum') {
          const dom = document.createElement('font')
          dom.setAttribute('color', `#1890ff`)
          dom.innerHTML = value
          if (range) {
            range.insertNode(dom)
          } else {
            this.endInsert(dom, 'dom')
          }
        }
        if (type === 'stock') {
          const dom = document.createElement('font')
          dom.setAttribute('color', `#1890ff`)
          dom.innerHTML = value
          if (range) {
            range.insertNode(dom)
          } else {
            this.endInsert(dom, 'dom')
          }
        }
        if (type === 'progress') {
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              const dom = document.createElement('a')
              // dom.setAttribute('contenteditable', false)
              dom.setAttribute('href', `##${value[0].value}##`)
              dom.innerHTML = value[0].value
              if (range) {
                range.insertNode(dom)
              } else {
                this.endInsert(dom, 'dom')
              }
              this.dialogData = {
                type: '',
                title: '',
                data: [],
                visible: false
              }
            }
          })
        }
        if (type === 'link') {
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              const str = value[1].value
              if (str.indexOf('http://') > -1 || str.indexOf('https://') > -1) {
                const dom = document.createElement('a')
                // dom.setAttribute('contenteditable', false)
                dom.setAttribute('href', `${value[1].value}`)
                // dom.setAttribute('target', `_blank`)
                dom.innerHTML = value[0].value
                if (range) {
                  range.insertNode(dom)
                } else {
                  this.endInsert(dom, 'dom')
                }
                this.dialogData = {
                  type: '',
                  title: '',
                  data: [],
                  visible: false
                }
              } else {
                this.$message.error('请输入http://或https://地址')
              }
            }
          })
        }
        if (type === 'reply') {
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              const dom = document.createElement('a')
              // dom.setAttribute('contenteditable', false)
              dom.setAttribute('href', `weixin://bizmsgmenu?msgmenucontent=${value[1].value}&msgmenuid=1`)
              dom.innerHTML = value[0].value
              if (range) {
                range.insertNode(dom)
              } else {
                this.endInsert(dom, 'dom')
              }
              this.dialogData = {
                type: '',
                title: '',
                data: [],
                visible: false
              }
            }
          })
        }
        if (type === 'complete') {
          const dom = document.createElement('font')
          dom.setAttribute('color', `#1890ff`)
          dom.innerHTML = '已完成任务量'
          if (range) {
            range.insertNode(dom)
          } else {
            this.endInsert(dom, 'dom')
          }
        }
        if (type === 'incomplete') {
          const dom = document.createElement('font')
          dom.setAttribute('color', `#1890ff`)
          dom.innerHTML = '未完成任务量'
          if (range) {
            range.insertNode(dom)
          } else {
            this.endInsert(dom, 'dom')
          }
        }
        this.popoverVisible[type] = false
        this.selection = null
        this.output()
      })
    },
    /**
     * 打开弹框
     */
    tapFn (type, value) {
      if (type === 'progress') {
        this.dialogData = {
          type,
          title: '插入助力进度',
          data: [
            {
              name: '显示文案',
              value: '戳此查看好友助力情况',
              placeholder: ''
            }
          ],
          visible: true
        }
      }
      if (type === 'link') {
        this.dialogData = {
          type,
          title: '插入链接',
          data: [
            {
              name: '链接文本',
              value: '',
              placeholder: '请输入链接显示的文字',
              validate: '请输入链接显示的文字'
            },
            {
              name: '链接地址',
              value: '',
              placeholder: 'https://或http://开头',
              validate: '请输入链接地址'
            }
          ],
          visible: true
        }
      }
      if (type === 'reply') {
        this.dialogData = {
          type,
          title: '自动回复设置',
          data: [
            {
              name: '设置链接文案',
              subName: '（需要用户点击的文案展示）',
              value: '',
              placeholder: '请输入链接显示的文字',
              validate: '请输入链接显示的文字'
            },
            {
              name: '设置回复内容',
              subName: '（点击后，用户自动给公众号发送的内容）',
              value: '',
              placeholder: '请输入回复内容',
              validate: '请输入回复内容'
            }
          ],
          visible: true
        }
      }
      if (type === 'prize') {
        this.dialogData = {
          type,
          title: value,
          data: [
            {
              name: '显示文案',
              value: value,
              placeholder: '请输入显示文案'
            }
          ],
          visible: true
        }
      }
      if (type === 'html') {
        this.mode = !this.mode
        const editBox = document.getElementById(this.inputOpt.id)
        const content = editBox.innerHTML
        if (this.mode) {
          editBox.innerHTML = content
        } else {
          editBox.innerText = content
        }
      }
    },
    reset () {
      this.dialogData.visible = false
      this.$refs.ruleForm.resetFields()
    },
    /**
     * 获取光标位置
     */
    getSelection () {
      this.selection = this.saveSelection()
    },
    /**
     * 保存光标位置
     */
    saveSelection () {
      if (window.getSelection) {
        const sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          return sel.getRangeAt(0)
        }
      } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange()
      }
      return null
    },
    /**
     * 重置光标位置
     * @param {*} callback
     */
    restoreSelection (callback) {
      const range = this.selection
      if (range) {
        if (window.getSelection) {
          const sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
          callback(range)
        } else if (document.selection && range.select) {
          range.select()
          callback(range)
        }
      } else {
        callback()
      }
    },
    /**
     * 监听编辑器
     */
    onInputEditor () {
      document.getElementById(this.inputOpt.id).addEventListener('input', () => {
        this.output()
        this.selection = this.saveSelection()
      })
    },
    /**
     * 输出结果
     */
    output () {
      let res = document.getElementById(this.inputOpt.id).innerHTML
      res = res.replace(/<br>/g, '')
      res = res.replace(/&amp;/g, '&')
      this.$emit('outputRes', {
        id: this.inputOpt.id,
        content: res
      })
    }
  }
}
</script>

<style lang="less" scoped>
.editorBox{
  background:#fff;
  border:1px solid #ccc;
  padding:10px 20px;
  box-sizing: border-box;
  border-radius: 10px;
  margin:10px auto;
  .head{
    button{
      margin-right:10px;
      background:#eaf0ff;
      color:#3470ff;
      border-radius: 5px;
      user-select: none;
      white-space:nowrap;
      border:0;
      padding:5px 10px;
    }
  }
  .editBox{
    border:0;
    padding:0;
    outline: none;
    width:100%;
    line-height:24px;
    margin-top:10px;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: auto;
    -webkit-user-modify: read-write-plaintext-only;
  }
}
.emojiList{
  width:300px;
  height:auto;
  padding:0;
  overflow: hidden;
  li{
    float:left;
    width:30px;
    height:30px;
    cursor:pointer;
    font-size:24px;
  }
}
.selectList{
  width:200px;
  height:auto;
  padding:0;
  margin:0;
  overflow: hidden;
  li{
    width:100%;
    cursor:pointer;
    line-height:24px;
  }
  li:hover{
    color:#3470ff;
  }
}
.dialogBox{
  .info{
    background:#eee;
    box-sizing: border-box;
    padding:10px;
    margin-bottom:20px;
    h2{
      font-size:16px;
    }
    p{
      margin:0;
    }
  }
  p{
    span.subName{
      font-size:12px;
      color:#999;
    }
  }
}
.dialogBox.link{
  :deep(.ant-form-item-control-wrapper) {
    margin-left:100px;
  }
}
.prize, .progress{
  :deep(.ant-form-explain){
    margin-left:25%;
  }
}
.link{
  :deep(.ant-form-explain){
    margin-left:5%;
  }
}
</style>
