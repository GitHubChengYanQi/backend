<template>
  <div class="createNotice_page_container">
    <div class="formBox">
      <div class="handleSave" @click="handleSave">保存</div>
      <div class="line">
        <span class="label">
          <span class="require">*</span>
          模板名称：
        </span>
        <div class="valueBox">
          <a-input v-model="formData.name" placeholder="请输入模板名称" />
        </div>
      </div>
      <div class="line">
        <span class="label">模板分类：</span>
        <div class="valueBox">
          <a-cascader
            v-model="formData.classify"
            :options="tempSelectOptions"
            :field-names="{ label: 'name', value: 'code', children: 'child' }"
            placeholder="请选择模板分类"
          />
        </div>
      </div>
      <div class="line">
        <span class="label">是否启用：</span>
        <div class="valueBox">
          <a-switch v-model="formData.isUse" checked-children="启用" un-checked-children="关闭" />
        </div>
      </div>
      <div class="line">
        <span class="label">
          <span class="require">*</span>
          通知人群：
        </span>
        <div class="valueBox">
          <a-radio-group v-model="formData.noticeType" @change="formData.noticeArr = []">
            <!-- <a-radio value="0">用户</a-radio> -->
            <a-radio value="1">员工</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="line">
        <span class="label">
          <span class="require">*</span>
          通知渠道：
        </span>
        <div class="valueBox">
          <a-checkbox-group v-model="formData.noticeArr" style="width: 100%">
            <!-- <a-checkbox value="0" :disabled="formData.noticeType === '1'">公众号</a-checkbox> -->
            <a-checkbox value="1" :disabled="formData.noticeType === '0'">企微消息</a-checkbox>
            <!-- <a-checkbox value="2" :disabled="formData.noticeType === '1'">短信</a-checkbox>
            <a-checkbox value="3" :disabled="formData.noticeType === '0'">站内信</a-checkbox>
            <a-checkbox value="4" :disabled="formData.noticeType === '0'">邮件</a-checkbox>
            <a-checkbox value="5" :disabled="true">app</a-checkbox> -->
          </a-checkbox-group>
        </div>
      </div>
    </div>
    <div style="display: flex;">
      <div class="sendMessageContainer">
        <div class="sendMessageBox">
          <div class="line">
            <span class="label">
              <span class="require">*</span>
              消息标题：
            </span>
            <div class="valueBox">
              <a-input v-model="msgTitle" :maxLength="20" placeholder="请输入消息标题" />
            </div>
          </div>
          <div class="line top">
            <span class="label">
              <span class="require">*</span>
              消息内容：
            </span>
            <div class="valueBox">
              <div
                id="messageBox"
                class="messageBox"
                contenteditable
                @click="getRange"
                @keyup="sendMessage"
              />
            </div>
          </div>
        </div>
        <div class="handleControlerBox">
          <div class="msgType">
            <a-select v-model="msgType" style="width: 100%;">
              <a-select-option
                :value="item.code"
                v-for="(item, index) in insertSelectOptions"
                :key="index"
              >{{ item.name }}</a-select-option>
              <!-- <a-select-option value="1">通用类</a-select-option>
              <a-select-option value="2">消息提醒类</a-select-option>
              <a-select-option value="3">订单类</a-select-option>-->
            </a-select>
          </div>
          <div class="insertVariable">
            <div class="til">插入变量：</div>
            <div class="insertBox" v-if="insertSelectOptions.length">
              <span
                class="item"
                v-for="(item, index) in insertSelectOptions.find(it => it.code === msgType).child"
                :key="index"
                @click="insertContent(item.name)"
              >{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="msgPreviewBox" v-if="formData.noticeArr.length">
        <img src="./image/arrow.svg" @click="handleSet('minus')" alt class="arrow left" />
        <img src="./image/arrow.svg" @click="handleSet('plus')" alt class="arrow" />
        <div class="bar"></div>
        <div class="bar bottom"></div>
        <div class="contentBox">
          <!-- 公众号 站内信 -->
          <div class="officialAccount" v-if="['0', '3'].includes(formData.noticeArr[previewIndex])">
            <div class="til">{{ msgTitle || '消息标题' }}</div>
            <div class="content">{{ msgContent }}</div>
          </div>
          <!-- 企微 -->
          <div class="wechatPlus" v-if="formData.noticeArr[previewIndex] === '1'">
            <img src="./image/user.svg" alt class="user" />
            <div class="content">{{ msgContent }}</div>
          </div>
          <!-- 短信 -->
          <div class="shortMsg" v-if="formData.noticeArr[previewIndex] === '2'">
            <div
              class="date"
            >{{ new Date().getMonth() + 1 + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() }}</div>
            <div class="content">{{ msgContent }}</div>
          </div>
          <!-- 邮件 -->
          <div class="email" v-if="formData.noticeArr[previewIndex] === '4'">
            <div class="til">{{ msgTitle || '消息标题' }}</div>
            <div class="user">
              <img src="./image/user.svg" alt class="icon" />
              <span class="name">{{ userInfo.userName || '用户名' }}</span>
            </div>
            <div class="content">{{ msgContent }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="tipsBox">
      <p class="tip">注意事项：</p>
      <p class="tip">1 禁止发送金融相关的所有内容，禁止发送房产、移民政治、色情暴力等违法内容。</p>
      <p class="tip">2 一条短信最多67个字符，超过67个字符会按照2条收费。</p>
    </div>
  </div>
</template>

<script>
import { getDictTree } from '@/api/common'
import { mapGetters } from 'vuex'
import { createNoticeReq, getNoticeInfoReq, updateNoticeReq } from '@/api/templateLibrary'
export default {
  components: {},
  data () {
    return {
      formData: {
        name: '',
        classify: [],
        isUse: true,
        noticeType: '1',
        noticeArr: []
      },
      tempSelectOptions: [],
      msgTitle: '',
      msgType: '',
      insertSelectOptions: [],
      msgContent: '',
      insertArr: [],
      range: null,
      previewIndex: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    'formData.name' (e) {
      if (e.length > 20) {
        this.formData.name = e.slice(0, 20)
      }
    }
  },
  created () {
    this.getDicts()
    if (this.$route.query.id !== '-1') {
      this.getData()
    }
  },
  mounted () {
    this.onInputEditor()
  },
  methods: {
    getDicts () {
      const that = this
      getDictTree({ dictType: 'model_classification' }).then(res => {
        that.tempSelectOptions = res.data
      })
      getDictTree({ dictType: 'message_classification' }).then(res => {
        that.insertSelectOptions = res.data
        if (res.data[0]) { that.msgType = res.data[0].code }
      })
    },
    async getData () {
      const { data } = await getNoticeInfoReq({ id: this.$route.query.id })
      this.formData = {
        name: data.name,
        classify: [data.firstClass, data.secondClass],
        isUse: data.enableState === '1',
        noticeType: data.noticeCrowd,
        noticeArr: data.noticeChannels ? data.noticeChannels.split(',') : []
      }
      this.msgTitle = data.title
      this.msgContent = data.content
      document.querySelector('#messageBox').innerHTML = data.content.replace(/#{2}.*?#{2}/g, '<font color="#1890ff" contenteditable="false">$&</font>')
    },
    async handleSave () {
      const { name, isUse, classify, noticeType, noticeArr } = this.formData
      const [firstClass, secondClass] = classify
      const submitParams = {
        name,
        enableState: isUse ? '1' : '0',
        firstClass,
        secondClass,
        noticeCrowd: noticeType,
        noticeChannels: noticeArr.join(','),
        title: this.msgTitle,
        content: this.msgContent
      }
      console.log('handle save', submitParams)
      if (this.$route.query.id !== '-1') {
        submitParams.id = this.$route.query.id
        await updateNoticeReq(submitParams)
        this.$message.success('编辑成功！')
      } else {
        await createNoticeReq(submitParams)
        this.$message.success('新增成功！')
      }
      this.$router.go(-1)
    },
    // 获取光标
    getRange () {
      this.range = this.savePosition()
    },
    // 返回光标信息
    savePosition () {
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
    // 重置光标位置
    restoreSelection (callback) {
      const range = this.range
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
    async insertContent (value) {
      this.restoreSelection((range) => {
        const dom = document.createElement('a')
        dom.setAttribute('color', '#1890ff')
        dom.setAttribute('href', `##${value}##`)
        dom.innerHTML = `##${value}##`
        if (range) {
          range.insertNode(dom)
        } else {
          this.endInsert(dom)
        }
        this.range = null
        this.sendMessage()
      })
    },
    endInsert (val) {
      const editBox = document.getElementById('messageBox')
      editBox.appendChild(val)
    },
    onInputEditor () {
      document.getElementById('messageBox').addEventListener('input', () => {
        this.range = this.savePosition()
      })
    },
    sendMessage (e) {
      const target = document.querySelector('#messageBox')
      let str = ((e && e.target) || target).innerHTML.replace(/<[^>]*>/g, '')
      str = str.replace(/&nbsp;/g, ' ')
      str = str.replace(/&amp;/g, '&')
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      this.msgContent = str
    },
    handleSet (type) {
      if (this.formData.noticeArr.length === 1) return
      if (type === 'minus') {
        if (this.previewIndex === 0) {
          this.previewIndex = this.formData.noticeArr.length - 1
        } else {
          this.previewIndex -= 1
        }
      } else {
        if (this.previewIndex === this.formData.noticeArr.length - 1) {
          this.previewIndex = 0
        } else {
          this.previewIndex += 1
        }
      }
    }
  }
}
</script>
<style lang='less'>
</style>
<style lang='less' scoped>
@import './createNotice.less';
</style>
