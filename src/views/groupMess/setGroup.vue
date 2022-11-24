<template>
  <div class="A_page">
    <a-card class="A_card">
      <div class="A_content">
        <div
          class="A_input_box"
          v-for="(item,index) in input.inputArr"
          :key="index"
        >
          <div class="title"><span class="hint">*</span><span class="txt">{{ item.title }}</span></div>
          <div class="A_input">
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
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
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
          date: ''
        }
      }
    }
  },
  methods: {
    moment,
    onChange (value, dateString) {
      this.input.data.date = dateString
    },
    disabledDate (current) {
      return current && current < moment().endOf('day')
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
      .A_input_box {
        margin-bottom: 35px;
        width: 100%;
        display: flex;
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
          width: 100%;
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
        }
      }
    }
  }
}
</style>
