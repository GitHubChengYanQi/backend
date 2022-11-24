<template>
  <div class="A_page">
    <a-card class="A_card">
      <div class="A_content">
        <div class="A_left">
          <div
            class="A_input_box"
            v-for="(item,index) in input.inputArr"
            :style="item.type == 'sendBox'? {alignItems:'flex-start'}:{} "
            :key="index"
          >
            <div class="title"><span class="hint">*</span><span class="txt">{{ item.title }}</span></div>
            <div
              class="A_input"
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
                    placeholder="请选择日期时间"
                    @change="onChange"
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
                <div class="hint">预计送达客户群数：{{ 0 }}个 <span class="btn">刷新</span></div>
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
                    v-model="input.data.textear"
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
                      <img
                        class="expression_icon"
                        :src="require('@/assets/expression.svg')"
                        alt=""
                      >
                    </a-popover><span class="txt">{{ input.data.textear.length + '/1000' }}</span>
                  </div>
                </div>
                <div class="sendContent_box">
                  <SendContent
                    :contentArray.sync="contentArray"
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
        <div class="A_right">
          <div class="title">
            预览：客户群收到的消息
          </div>
          <div class="preview">
            <img
              class="preview_img"
              :src="require('@/assets/preview.png')"
              alt=""
            >
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

export default {
  components: {
    SendContent
  },
  data () {
    return {
      EmojiLIst,
      input: {
        inputArr: [
          { title: '任务名称', type: 'input', key: 'taskName' },
          { title: '选择群聊', type: 'selectBox' },
          { title: '发送内容', type: 'sendBox' },
          { title: '群发时间', type: 'radio', key: 'timeTab' }
        ],
        data: {
          taskName: '',
          timeTab: '0',
          date: '',
          textear: ''
        }
      },
      mumbersArr: [],
      contentArray: []
    }
  },
  created () {},
  methods: {
    moment,
    onChange (value, dateString) {
      this.input.data.date = dateString
    },
    disabledDate (current) {
      return current && moment(current).valueOf() < moment().valueOf()
    },
    changeAssigneeIds (e) {
      console.log(e)
    },
    insertFn (e) {
      this.input.data.textear = this.input.data.textear + e
    },
    setMess () {
      console.log(this.contentArray)
    }
  }
}
</script>

<style lang="less" scoped>
.A_page {
  width: 100%;
  .A_card {
    width: 100%;
    .A_content {
      width: 100%;
      display: flex;

      .A_left {
        .A_input_box {
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
          .A_input {
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
      .A_right {
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
          margin-top: 20px;
          .preview_img {
            width: 291px;
            height: auto;
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
