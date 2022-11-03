<template>
  <div class="addPrize">
    <div class="card">
      <div class="input_box">
        <span class="title">
          <span class="icon">*</span>奖品名称：
        </span>
        <a-input
          v-model="addPrize.prizeName"
          placeholder="请输入奖品名称，最大长度50"
          :max-length="50"></a-input>
      </div>
      <div class="input_box">
        <span class="title">奖品码：</span>
        <a-input
          v-model="addPrize.prizeCode"
          placeholder="请输入奖品码，最大长度为20"
          :max-length="20"></a-input>
      </div>
      <div
        class="input_box"
        style="align-items: flex-start;margin: 0 ;height: auto;">
        <span class="title">
          <span class="icon">*</span>奖品描述：
        </span>
        <div class="richText">
          <vue-quill-editor
            @editorChange="editorChange"
            :value="content" />
        </div>
      </div>
      <div class="operation_box">
        <div
          class="preview"
          @click="() => {
            this.hiddentState = true
          }">
          <img
            src="@/assets/preview.jpg"
            alt
            class="icon" />
          预览
        </div>
        <a-button
          type="primary"
          @click="accomplish">完成</a-button>
      </div>
    </div>
    <div
      class="hiddent_box"
      v-if="hiddentState"
      @mousewheel="mousewheel">
      <div
        class="preview_box"
        @mousewheel="previewMouse">
        <div class="preview_header">
          <div class="preview_title">奖品详情预览效果</div>
          <img
            class="preview_close"
            src="@/assets/close.png"
            alt
            @click="() => {
              this.hiddentState = false
            }" />
        </div>
        <div class="preview_content">
          <img
            class="preview_phone"
            src="@/assets/phone.png"
            alt />
          <div
            class="ql-editor"
            v-html="content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQuillEditor from '@/components/VueQuillEditor'
import { setPrize } from '@/api/increaseWinCustomer.js'

export default {
  components: { 'vue-quill-editor': VueQuillEditor },
  data () {
    return {
      addPrize: {},
      content: '',
      hiddentState: false
    }
  },
  created () {
    this.getUrl()
  },
  beforeDestroy () {
    localStorage.removeItem('prizeDesc')
  },
  methods: {
    editorChange: function (html) {
      this.content = html
    },
    mousewheel (e) {
      e.preventDefault()
    },
    accomplish () {
      var flag = /^[A-Za-z0-9]+$/
      if (this.addPrize.prizeCode) {
        if (this.addPrize.prizeCode.length > 0 && !flag.test(this.addPrize.prizeCode)) {
          return this.$message.error('奖品码不能包含特殊字符')
        }
      }

      const data = {
        ...this.addPrize,
        prizeDesc: this.content
      }

      setPrize(data).then((res) => {
        if (res.code == 200) {
          this.$router.push('/increaseWinCustomer/taskPrize')
          // store.commit('SER_PRIZE_DESC', {})
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    previewMouse (e) {
      e.stopPropagation()
    },
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符串
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('id')) return
      const data = JSON.parse(localStorage.getItem('prizeDesc'))
      this.addPrize = {
        id: data.id,
        prizeName: data.prizeName,
        prizeCode: data.prizeCode
      }
      this.content = data.prizeDesc
      // console.log(data)
      return object
    }
  }
}
</script>

<style lang="less">
.addPrize {
  width: 100%;

  .card {
    position: relative;
    padding: 24px;
    zoom: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    height: 100vh;
    .input_box {
      width: 544px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      box-sizing: border-box;
      .title {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        min-width: 80px;
        text-align: end;
        white-space: nowrap;
        .icon {
          color: red;
          font-size: 14px;
        }
      }

      .richText {
        flex-grow: 1;
        width: 50%;
      }
    }

    .operation_box {
      position: absolute;
      top: -41px;
      right: 0;
      display: flex;
      align-items: center;

      .preview {
        margin-right: 20px;
        cursor: pointer;

        .icon {
          margin-right: 10px;
          width: 20px;
          height: auto;
        }
      }
    }
  }

  .hiddent_box {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;

    .preview_box {
      position: relative;
      width: 416px;
      height: 500px;
      background-color: rgba(242, 242, 242, 1);
      box-sizing: border-box;
      padding: 20px;

      .preview_header {
        width: 100%;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;

        .preview_title {
          font-size: 16px;
          font-family: 'Arial Normal', 'Arial';
          font-weight: 400;
          font-style: normal;
        }

        .preview_close {
          cursor: pointer;
          width: 30px;
          height: auto;
        }
      }

      .preview_content {
        overflow-y: auto;
        margin-top: 10px;
        height: 420px;
        position: relative;
        .preview_phone {
          width: 100%;
          height: auto;
        }
        .ql-editor {
          position: absolute;
          top: 88px;
          left: 45px;
          word-wrap: break-word;
          width: 452px;
          height: 800px;
          overflow-x: auto;
          transform: scale(0.6);
          transform-origin: 0 0;

          img {
            max-width: 100%;
          }
        }
      }
    }
  }
}
</style>
