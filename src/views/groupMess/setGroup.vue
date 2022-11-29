<template>
  <div class="setGroup_page">
    <a-card class="setGroup_card">
      <div class="setGroup_content">
        <div class="setGroup_left">
          <div
            class="setGroup_input_box"
            v-for="(item,index) in input.inputArr"
            :style="item.type == 'sendBox'? {alignItems:'flex-start'}:{} "
            :key="index"
          >
            <div class="title"><span class="hint">*</span><span class="txt">{{ item.title }}</span></div>
            <div
              class="setGroup_input"
              :style="item.type == 'selectBox'? {width:'100%'}:{} "
            >
              <!-- 输入框 -->
              <div
                class="input"
                v-if="item.type == 'input'"
              >
                <a-input
                  style="width:100%;height:100%;padding-right:60px;"
                  placeholder="请输入"
                  :maxLength="50"
                  v-model="input.data[item.key]"
                ></a-input>
                <span class="number">{{ input.data[item.key].length +'/50' }}</span>
              </div>
              <!-- 单选 -->
              <div
                class="radio"
                v-else-if="item.type == 'radio'"
              >
                <a-radio-group v-model="input.data[item.key]">
                  <a-radio value="0">立即发送</a-radio>
                  <a-radio value="1">定时发送</a-radio>
                  <a-date-picker
                    :disabledDate="disabledDate"
                    show-time
                    v-model="input.data.date"
                    placeholder="请选择日期时间"
                    v-if="input.data[item.key] == 1"
                  />
                </a-radio-group>
              </div>
              <!-- 群聊-->
              <div
                class="selectBox"
                v-if="item.type == 'selectBox'"
              >
                <div class="select_title"><span class="txt">选择群主 </span><span class="btn">
                  <selectPersonnel
                    type="button"
                    name="+ 添加"
                    v-model="mumbersArr"
                    @getVal="changeAssigneeIds"
                  />
                </span></div>
                <div class="hint">预计送达客户群数：{{ total }}个 <span
                  class="btn"
                  @click="getNumber"
                >刷新</span></div>
              </div>
              <!-- 内容 -->
              <div
                class="sendBox"
                v-if="item.type=='sendBox'"
              >
                <div class="hint">群发文本</div>
                <div class="textear_box">
                  <a-textarea
                    class="textear"
                    v-model="input.data.plain"
                    @change="setPlain"
                    :maxLength="1000"
                    placeholder="请输入"
                  ></a-textarea>

                  <div class="hint_number">
                    <a-popover trigger="click">
                      <template #content>
                        <ul class="emojiList">
                          <li
                            @click="insertFn(items)"
                            v-for="(items,indexs) in EmojiLIst"
                            :key="indexs"
                          >{{ items }}</li>
                        </ul>
                      </template>
                      <!-- <img
                        class="expression_icon"
                        :src="require('@/assets/expression.svg')"
                        alt=""
                      > -->
                    </a-popover><span class="txt">{{ input.data.plain.length + '/1000' }}</span>
                  </div>
                </div>
                <div class="sendContent_box">
                  <SendContent
                    :contentArray.sync="contentArray"
                    @getText="setText"
                    :isDisableEdit="false"
                  />
                </div>
              </div>
            </div>
          </div>
          <a-button
            type="primary"
            class="button"
            @click="setMess"
          >保存</a-button>
        </div>
        <div class="setGroup_right">
          <div class="title">
            预览：客户群收到的消息
          </div>
          <div class="preview">
            <img
              class="preview_img"
              :src="require('@/assets/preview.png')"
              alt=""
            >
            <div class="content_box">
              <div
                class="box"
                v-for="(item,index) in previewArr"
                :key="index"
              >
                <div class="user">
                  <img
                    src="./images/user.png"
                    alt=""
                  >
                </div>
                <div class="content">
                  <div
                    class="text"
                    v-if="item.type === 1"
                  >
                    <!-- style="max-width:100%;max-height:300px" -->
                    {{ item.textData }}
                  </div>
                  <div
                    class="image"
                    v-if="item.type === 2"
                  >
                    <!-- style="max-width:100%;max-height:300px" -->
                    <img
                      class="img"
                      :src="item.photoUrl"
                      alt
                    />
                  </div>
                  <div
                    class="video"
                    v-if="item.type === 3"
                  >
                    <!-- v-if="sopList[selectSopItemIdx].content[index].showPoster" -->
                    <div
                      class="poster"
                      v-if="item.showPoster"
                    >{{ returnErrorText(item.videoUrl) }}</div>
                    <video
                      class="poster"
                      :src="item.videoUrl"
                      @error="videoLoadErr(index)"
                      alt
                    />
                  </div>
                  <div
                    class="link"
                    v-if="item.type === 4"
                  >
                    <div class="lef">
                      <span class="til">{{ item.linkTitle }}</span>
                      <span class="desc">{{ item.linkUrl ? item.linkUrl: '' }}</span>
                      <span class="desc">{{ item.linkShow ? item.linkShow: '' }}</span>
                    </div>
                    <img
                      :src="item.linkPhoto"
                      alt
                      class="image"
                    />
                  </div>
                  <div
                    class="embed"
                    v-else-if="item.type === 5"
                  >
                    <div class="line">
                      <img
                        src="./images/miniProgramIcon.svg"
                        alt
                        class="icon"
                      />
                      <span class="til">{{ '小程序标题' }}</span>
                    </div>
                    <div class="line desc">{{ item.appShow }}</div>
                    <img
                      :src="item.appPhoto"
                      alt
                      class="image"
                    />
                    <div class="line">
                      <img
                        src="./images/miniProgramIcon.svg"
                        alt
                        class="icon"
                      />
                      <span class="say">小程序</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import EmojiLIst from './emoji.json'
import SendContent from './components/sendContent.vue'
import { workRoomShiftSave, workRoomShiftRoom, workRoomShiftLoad } from '@/api/groupMess.js'

export default {
  components: {
    SendContent
  },
  data () {
    return {
      EmojiLIst,
      input: {
        inputArr: [
          { title: '任务名称', type: 'input', key: 'name' },
          { title: '选择群聊', type: 'selectBox' },
          { title: '发送内容', type: 'sendBox' },
          { title: '群发时间', type: 'radio', key: 'timeTab' }
        ],
        data: {
          name: '',
          timeTab: '0',
          date: null,
          plain: ''
        }
      },
      mumbersArr: [],
      contentArray: [],
      previewArr: [],
      total: 0,
      tableId: -1,
      type: 0
    }
  },
  watch: {
    contentArray: {
      handler (val) {
        if (this.previewArr.length > 0 && this.previewArr[0].isText) {
          this.previewArr = [this.previewArr[0], ...val]
        } else {
          this.previewArr = val
        }
      }
    }
  },
  created () {
    this.getUrl()
  },
  methods: {
    moment,
    setText (e) {
      console.log(e)
      if (e.length == 0) return
      if (this.previewArr.length > 0 && this.previewArr[0].isText) {
        e.map(item => {
          if (item.textData.length > 1000) {
            this.$message.warn('原文字长度大于1000,无法添加')
          } else {
            const text = this.input.data.plain + item.textData
            this.input.data.plain = text.slice(0, 1000)
            console.log(this.input.data.plain)
            this.previewArr[0].textData = this.input.data.plain
          }
        })
      } else {
        e.map(item => {
          if (item.textData.length > 1000) {
            this.$message.warn('原文字长度大于1000,无法添加')
          } else {
            const text = this.input.data.plain + item.textData
            this.input.data.plain = text.slice(0, 1000)
          }
        })
        this.previewArr.unshift({
          type: 1,
          textData: this.input.data.plain,
          isText: true
        })
      }
    },
    getNumber () {
      if (this.mumbersArr.length == 0) return
      const obj = {
        owner: this.mumbersArr.join(',')
      }
      workRoomShiftRoom(obj).then((res) => {
        console.log(res)
        this.total = res.data.total
      })
    },
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('id')) return
      this.tableId = object.id
      this.type = object.type
      this.getInfo()
    },
    getInfo () {
      const obj = {
        id: this.tableId
      }
      console.log(obj)
      workRoomShiftLoad(obj).then((res) => {
        console.log(res)
        this.input.data.name = res.data.name
        this.input.data.timeTab = res.data.occur == '2099-12-31 23:59' ? '0' : '1'
        this.input.data.date = res.data.occur == '2099-12-31 23:59' ? '' : moment(res.data.occur, 'YYYY-MM-DD HH:mm:ss')
        this.mumbersArr = res.data.owner.split(',')
        this.getNumber()
        this.input.data.plain = res.data.plain
        this.previewArr.unshift({
          type: 1,
          textData: res.data.plain,
          isText: true
        })
        this.contentArray = res.data.stuff
      })
    },
    setPlain (e) {
      if (e.target.value.length > 0) {
        if (this.previewArr.length > 0 && this.previewArr[0].isText) {
          this.previewArr[0].textData = e.target.value
        } else {
          this.previewArr.unshift({
            type: 1,
            textData: e.target.value,
            isText: true
          })
        }
      } else {
        if (this.previewArr.length > 0 && this.previewArr[0].isText) {
          this.previewArr = this.previewArr.slice(1)
        }
      }
    },
    returnErrorText (url) {
      return '暂不支持显示 .avi 格式的视频'
    },
    videoLoadErr (index) {
      this.contentArray[index].showPoster = true
    },
    disabledDate (current) {
      return current && moment(current).valueOf() < moment().valueOf()
    },
    changeAssigneeIds (e) {
      this.mumbersArr = e
      if (e.length == 0) {
        this.total = 0
      }
      this.getNumber()
    },
    insertFn (e) {
      this.input.data.plain = this.input.data.plain + e
    },
    setMess () {
      const { name, plain, timeTab, date } = this.input.data
      const owner = this.mumbersArr.join(',')
      const obj = {
        name,
        owner,
        plain,
        stuff: this.contentArray,
        occur: timeTab == 0 ? '2099-12-31 23:59' : moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.tableId != -1 && this.type == 1) {
        obj.id = this.tableId
      }
      console.log(obj)
      workRoomShiftSave(obj).then((res) => {
        console.log(res)
        this.$router.push('/groupMess/index')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.setGroup_page {
  width: 100%;
  .setGroup_card {
    width: 100%;
    .setGroup_content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .setGroup_left {
        .setGroup_input_box {
          margin-bottom: 35px;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          .title {
            margin-right: 30px;
            white-space: nowrap;
            flex-shrink: 0;
            font-family: '微软雅黑 Bold';
            font-weight: 700;
            font-size: 14px;
            .hint {
              color: red;
            }
          }
          .setGroup_input {
            .input {
              position: relative;
              width: 500px;
              height: 32px;
              .number {
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
              }
            }
            .radio {
              display: flex;
              align-items: center;
              height: 36px;
              width: 100%;
            }
            .selectBox {
              width: 100%;
              box-sizing: border-box;
              padding-left: 10px;
              font-family: '微软雅黑', sans-serif;
              font-style: normal;
              font-size: 13px;
              letter-spacing: normal;
              color: #333333;
              .select_title {
                margin: 20px 0;
                display: flex;
                .txt {
                  white-space: nowrap;
                  margin-top: 5px;
                }
                .btn {
                  margin-left: 20px;
                }
              }
              .hint {
                display: flex;
                align-items: center;
                .btn {
                  margin-left: 10px;
                  cursor: pointer;
                  color: blue;
                }
              }
            }
            .sendBox {
              width: 100%;
              font-family: '微软雅黑', sans-serif;
              font-style: normal;
              font-size: 13px;
              letter-spacing: normal;
              color: #333333;
              .hint {
                margin-bottom: 10px;
              }
              .textear_box {
                width: 800px;
                height: 200px;
                border: 1px solid #ccc;
                border-radius: 5px;
                .textear {
                  resize: none;
                  width: 100%;
                  height: 100%;
                  padding: 20px;
                  border: none;
                }
                .hint_number {
                  padding: 10px 10px;
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  .expression_icon {
                    cursor: pointer;
                    width: 20px;
                    height: auto;
                  }
                }
              }
              .sendContent_box {
                width: 800px;
                display: flex;
                margin-top: 20px;
                align-items: center;
              }
            }
          }
        }

        .button {
          margin-left: 90px;
        }
      }
      .setGroup_right {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .title {
          font-family: '微软雅黑', sans-serif;
          font-style: normal;
          font-size: 13px;
          letter-spacing: normal;
          color: #333333;
        }
        .preview {
          position: relative;
          margin-top: 20px;
          .preview_img {
            width: 350px;
            height: auto;
          }
          .content_box {
            position: absolute;
            top: 71px;
            left: 0;
            width: 100%;
            padding-top: 10px;
            height: 600px;
            overflow: auto;
            // background-color: pink;
            .box {
              min-width: 200px;
              min-height: 50px;
              border-radius: 10px;
              margin-bottom: 20px;
              display: flex;

              .content {
                position: relative;
                .video {
                  max-width: 200px;
                  min-height: 100px;
                  .poster {
                    background: #fff;
                    width: 100%;
                    height: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                }
                .link {
                  width: 250px;
                  height: 80px;
                  border: 1px solid #cdcdcd;
                  background-color: #fff;
                  border-radius: 5px;
                  flex: none;
                  padding: 10px;
                  display: flex;
                  .lef {
                    width: 160px;
                    margin-right: 10px;
                    font-size: 13px;
                    .til {
                      width: 100%;
                      color: #4074f6;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                      display: inline-block;
                    }
                    .desc {
                      width: 100%;
                      white-space: nowrap;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 2;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                  .image {
                    flex: 1;
                    height: 100%;
                    max-width: 58px;
                  }
                }
                .embed {
                  background-color: #fff;
                  width: 230px;
                  border: 1px solid #cdcdcd;
                  flex: none;
                  display: flex;
                  flex-direction: column;
                  padding: 8px 10px;
                  .line {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    .icon {
                      width: 17px;
                      height: 17px;
                    }
                    .til {
                      color: #4074f6;
                    }
                  }
                  .desc {
                    font-size: 13px;
                    margin-top: 3px;
                  }
                  .image {
                    height: 180px;
                    margin: 3px 0;
                  }
                }
                .image {
                  max-width: 200px;
                  min-height: 50px;
                  .img {
                    background-color: #fff;
                    width: auto;
                    height: auto;
                    max-width: 100%;
                    max-height: 100%;
                  }
                }
                .text {
                  background-color: #fff;
                  border-radius: 10px;
                  padding: 10px;
                  width: 200px;
                  word-wrap: break-word;
                  table-layout: fixed;
                  word-break: break-all;
                }
              }
            }
          }
        }
      }
    }
  }
}

.emojiList {
  width: 300px;
  height: auto;
  padding: 0;
  overflow: hidden;
  li {
    float: left;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 24px;
  }
}
</style>
