<template>
  <div>
    <a-spin :spinning="detailLoading">
      <div v-if="!preview" class="lessonAnalysis">
        <div class="head">
          <div class="headImg" style="min-height: 190px">
            <img
              v-if="!detailLoading"
              height="190"
              :src="detail.coverImageUrl ? detail.coverImageUrl+'?x-oss-process=image/resize,m_fill,h_190,w_270' : require('@/assets/study/examImg.png')"
            >
          </div>
          <div class="column">
            <div class="title">{{ detail.name }}</div>
            <div class="space">
              <div>
                <div>创建人：{{ detail.employeeEntity && detail.employeeEntity.name }}</div>
                <div>
                  试卷分数：
                  {{
                    detail.questionnaireResults && detail.questionnaireResults[0] && detail.questionnaireResults[0].score
                  }}
                </div>
                <div>答卷时长：{{ detail.timeLimit > -1 ? detail.timeLimit + '分钟' : '不限制时长' }}</div>
                <div>重复考试：{{ detail.reexam }}</div>
              </div>
              <div>
                <div>创建时间：{{ detail.createTime }}</div>
                <div>通过分数：{{ detail.passScore }}</div>
                <div v-if="task">
                  限定时长：
                  {{
                    detail.haveTimeLimit === 1 ? '不限制时长' : (moment(detail.startTime).format('YYYY-MM-DD') + ' - ' + (moment(detail.endTime).format('YYYY-MM-DD')))
                  }}
                </div>
                <div>试卷名称：{{ detail.questionnaireResult && detail.questionnaireResult.questionnaireName }}</div>
              </div>
            </div>
            <div class="note">
              <div>{{ detail.note && detail.note.replace(/<.*?>/g, '') }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="examinationContent" :style="{paddingTop:preview ? 0 : 24}">
        <div class="title" v-if="!preview">考试内容</div>

        <div
          class="question"
          v-for="(question,index) in detail.questionResults"
          :key="index"
        >
          <div class="questionName">
            <div class="name">
              <div class="nameShow">{{ index + 1 }}.{{ question.questionContent }}</div>
            </div>
            <div class="my-space">
              <div style="min-width: 100px;text-align: right">（{{ question.score }}分）</div>
              <a-tag color="#108ee9">
                {{ questionType(question.questionType) }}
              </a-tag>
            </div>
          </div>
          <div class="options" v-if="question.questionType !== 'judge'">
            <div
              style="display: flex;padding-bottom: 16px"
              v-for="(answer,answerIndex) in question.answerResults"
              :key="answerIndex"
            >
              <a-radio
                :style="radioStyle"
                :checked="answer.isTrue === 1"
              />
              {{ String.fromCharCode(65 + answerIndex) }}.{{ answer.answerContent }}
            </div>

          </div>
          <div class="answer" :style="{marginTop:question.questionType === 'judge' ? '24px' : 0}">
            <div class="tip">正确答案</div>
            <div v-if="question.questionType !== 'judge'">
              <div
                v-for="(answer,answerIndex) in question.answerResults.map((item,index)=>({...item,option:String.fromCharCode(65 + index) })).filter(item=>item.isTrue === 1)"
                :key="answerIndex"
                style="padding-bottom: 8px"
              >
                {{ answer.option }}.{{ answer.answerContent }}
              </div>
            </div>
            <div v-else>
              {{ question.answerResults.find(item => item.isTrue === 1) && (question.answerResults.find(item => item.isTrue === 1).answerContent === '正确' || question.answerResults.find(item => item.isTrue === 1).answerContent === 'true') ? '正确' : '错误' }}
            </div>
          </div>
        </div>

      </div>
    </a-spin>
  </div>
</template>

<script>

import router from '@/router'
import { examDetail } from '@/api/study/exam'
import moment from 'moment'
import { examTaskDetail } from '@/api/study/task'

export default {
  props: {
    preview: Boolean,
    task: Boolean,
    questionResults: {
      type: Array,
      default: _ => []
    }
  },
  data () {
    return {
      moment,
      detailLoading: false,
      createTime: '',
      detail: {},
      radioStyle: {
        display: 'block',
        height: '50px'
      }
    }
  },
  created () {
    if (!this.preview) {
      this.getDetail()
    }
    if (this.preview) {
      this.detail.questionResults = this.questionResults
    }
  },
  methods: {
    questionType (value) {
      switch (value) {
        case 'single':
          return '单选'
        case 'multiple':
          return '多选'
        case 'judge':
          return '判断'
      }
    },
    reexam (value) {
      switch (value) {
        case 1:
          return '允许重复考试'
        case 2:
          return '不允许重复考试'
        case 3:
          return '仅允许未通过的重复考试'
      }
    },
    async getDetail () {
      this.detailLoading = true
      let detail = {}
      if (this.task) {
        const res = await examTaskDetail({ examTaskId: router.history.current.query.id })
        if (res.data) {
          detail = { ...res.data.examResult, ...res.data }
        }
      } else {
        const res = await examDetail({ examId: router.history.current.query.examId })
        if (res.data) {
          detail = res.data || {}
        }
      }
      const questionnaireResult = (detail.questionnaireResults ? detail.questionnaireResults[0] : {}) || {}
      this.detail = {
        ...detail,
        createTime: detail.createdAt ? moment(detail.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-',
        questionnaireResult,
        reexam: this.reexam(detail.reexam),
        questionResults: questionnaireResult.questionResults || []
      }
      this.detailLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.my-space {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-search {
  .ant-form-inline {
    .ant-form-item {
      margin-bottom: 24px;
    }
  }
}

.warnButton {
  color: rgba(255, 152, 0, 1);
  background-color: rgba(252, 192, 104, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.linkButton {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.delButton {
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.successButton {
  color: #01ba77;
  background-color: rgba(1, 186, 119, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.my-table-search {
  border-radius: 8px;

  .ant-form-inline .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-input,
  .ant-select-selection,
  .ant-time-picker-input {
    border-radius: 8px !important;
  }

  .ant-btn {
    margin-right: 10px;
    border-radius: 8px;
  }
}

.my-table-wrapper {
  border-radius: 8px;

  .btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 24px;

    > .ant-btn {
      margin-left: 12px;
      border-radius: 8px;
    }
  }
}

.my-table {
  background-color: #fff;

  .ant-table-pagination {
    padding: 24px;
    float: none;
    text-align: center;
  }
}

.myTooltip {
  background-color: #fff;

  .ant-tooltip-inner {
    color: #000;
    background-color: #fff;
  }

  .ant-tooltip-arrow::before {
    background-color: #fff;
  }
}

.myLabelBox {
  width: 400px;

  span {
    margin-bottom: 10px;
  }
}

.my-modal {
  .ant-modal-footer {
    padding: 24px;
    text-align: center;

    .ant-btn {
      padding: 0 24px;
      border-radius: 8px;
    }

    .ant-modal-footer button + button {
      margin-left: 24px;
    }
  }
}

.lessonAnalysis {

  .title {
    font-weight: bold;
    font-size: 24px;
  }

  .space {
    display: flex;
    gap: 24px;
  }

  .head {
    padding: 24px;
    background-color: #fff;
    display: flex;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
  }

  .note {
    border-radius: 4px;
    padding: 12px;
    color: #a4a1a4;
    font-size: 12px;
  }

  .headImg {
    display: inline-block;
    width: 270px;
    position: relative;

    img {
      max-width: 270px;
      border-radius: 2px;
    }

    .info {
      padding: 12px;
      color: #fff;
      border-top: solid 1px #fff;
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }

  .count {
    background-color: #fbfbfb;
    padding: 12px 24px;
    border-radius: 8px;
    display: flex;
    width: max-content;

    > div {
      width: 100px;
    }

    .number {
      font-weight: bold;

      .num {
        font-size: 18px;
      }
    }
  }
}

.examinationContent {
  border-radius: 8px;
  background-color: #fff;
  padding: 24px 0;

  .title {
    border-left: solid 2px #1890ff;
    padding-left: 8px;
  }

  .question {
    padding-top: 24px;

    .questionName {
      padding: 24px 40px 24px 110px;
      background-color: #FBFBFB;
      display: flex;
      align-items: center;

      .name {
        flex-grow: 1;

        .nameShow {
          max-width: 90%;
        }
      }
    }

    .options {
      padding: 24px 110px 0;

      ///deep/ span {
      //  display: inline-block;
      //  max-width: 100%;
      //  white-space: break-spaces;
      //}
    }

    .answer {
      padding: 18px 110px 18px 24px;
      margin-left: 110px;
      background-color: rgba(16, 142, 233, 0.1);
      display: inline-block;
      border-radius: 8px;

      .tip {
        color: #108ee9;
        padding-bottom: 8px;
      }
    }
  }
}
</style>
