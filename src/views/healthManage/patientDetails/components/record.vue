<template>
  <div class="record_">
    <a-form labelAlign="left" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="查看方案：">
        <Space>
          <a-select v-model="selectVal" style="width: 400px" @change="handleChange">
            <a-select-option :value="item.planId" v-for="item in planList" :key="`-${item.planId}`">
              {{ item.planName }}
            </a-select-option>
          </a-select>
          <a-button type="primary" :disabled="!planList.length || planList[0].isDefault === 2" @click="openMoadl" v-permission="'/healthManage/patientDetails/addTask#post'"> 添加随访任务 </a-button>
        </Space>
      </a-form-item>
      <a-form-item label="分类查看：">
        <a-radio-group v-model="radioVal" @change="radioChange">
          <a-radio-button value=""> 全部 </a-radio-button>
          <a-radio-button value="2"> 仅看已回答问卷 </a-radio-button>
          <a-radio-button value="1"> 仅看未回答问卷 </a-radio-button>
          <!-- <a-radio-button value="d">
                        仅看预警信息
                    </a-radio-button> -->
        </a-radio-group>
      </a-form-item>
      <a-spin :spinning="loading">
        <a-form-item label="">
          <div style="position: relative">
            <img class="goTop" :src="require('@/assets/healthManage/u5793.png')" @click.stop="goTop" v-if="taskObj.data" />
            <div class="programmeDetail" ref="programmeDetail" v-if="taskObj.data">
              <div class="createdTime">加入随访日期 {{ timeFormat(taskObj.joinTime) }}</div>
              <div class="taskItem" v-for="(item, index) in taskObj.data" :key="`${index}-`">
                <div class="title" v-if="!item.joinDay && !item.manualEntry">
                  <template v-if="!item.withinAWeek">
                    加入计划后第{{ item.weekNumber }}周
                  </template>
                </div>
                <div class="title" v-if="item.joinDay && !item.manualEntry">加入当天</div>
                <div class="title" v-if="item.manualEntry">手动录入</div>
                <div class="division">
                  <img :src="require('@/assets/healthManage/u442.svg')" alt="" />
                </div>
                <div class="taskList-content">
                  <Space>
                    <div class="time">{{ timeFormat(item.startTime) }}</div>
                    <div class="state" :style="stateStyle(item.status)" v-if="item.status == 0">未开始</div>
                    <div class="state" :style="stateStyle(item.status)" v-if="item.status == 1">进行中</div>
                    <div class="state" :style="stateStyle(item.status)" v-if="item.status == 2">已完成</div>
                    <div class="state" :style="stateStyle(item.status)" v-if="item.status == 3">已停止</div>
                    <div class="state" :style="stateStyle(item.status)" v-if="item.status == 4">已停止</div>
                  <!-- 未开始 进行中  已完成 已停止 已过期 -->
                  </Space>
                  <div class="taskList">
                    <div
                      v-for="(obj, indexs) in item.taskDetailResults"
                      :class="{ item: true, 'flex-row-center': true, 'btm-border': indexs > 0 }"
                      :key="`${indexs}--`">
                      <div class="flex-row-center">
                        <div class="tip" v-if="obj.type == 1">问卷</div>
                        <div class="tip" v-if="obj.type == 2">患教</div>
                        <div class="tip" v-if="obj.type == 3">嘱托</div>
                        <span style="cursor:pointer;" @click="getQuestionResults(obj, true)">
                          {{ obj.name }}
                        </span>
                      </div>
                      <div class="btns flex-row-center">
                        <div class="edit" v-if="obj.type == 1 && obj.status == 1" @click="getQuestionResults(obj, true)">编辑
                        </div>
                        <div class="del" v-if="planList[0].isDefault !== 2" @click="delTask(obj)">删除</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-form-item>
      </a-spin>
    </a-form>
    <!-- 添加任务 -->
    <ProgrammeMoadl
      ref="programmeMoadl"
      :contactId="contactId"
      @updataPage="getTaskContactDetailTasks(selectVal, contactId)" />
    <!-- 问卷 -->
    <a-modal title="问卷" v-model="visible" :footer="null" :width="430" :destroyOnClose="true">
      <div class="questionnairecontent" style="height:500px;overflow-y: auto;">
        <QuestionnaireDetail
          :questionnaireArr="detailObj.questionResults"
          :questionnaireName="detailObj.questionnaireName"
          :detailObj="detailObj"
          :currentObj="currentObj"
          :isSubmit="isSubmit"
          @updateList="radioChange"
          @close="visible = false"
        />
      </div>
    </a-modal>
    <a-modal :title="currentObj.name" v-model="visible1" :footer="null">
      <div class="detail-content">
        {{ mediumContent.content }}
      </div>
    </a-modal>
    <a-modal :title="mediumContent.title" v-model="visible2" :footer="null" destroyOnClose>
      <div class="detail-content" style="height: 580px;max-height: 580px">
        <template>
          <!-- 文本-->
          <template v-if="mediumContent.type_id == 1">
            <div v-html="mediumContent.content"></div>
          </template>
          <!-- 图片-->
          <template v-if="mediumContent.type_id == 2">
            <img class="currentImg" :src="mediumContent.imageFullPath">
          </template>
          <!-- 图文-->
          <template v-if="mediumContent.type_id == 3">
            <iframe width="100%" height="100%" :src="mediumContent.imageLink" />
          </template>
          <!-- 音频-->
          <template v-if="mediumContent.type_id == 4">
            <div class="typeId3">
              <audio :src="mediumContent.voiceFullPath" controls />
            </div>
          </template>
          <!-- 视频-->
          <template v-if="mediumContent.type_id == 5">
            <div class="typeId3">
              <video :src="mediumContent.videoFullPath" controls="controls" style="width: 100%;"></video>
            </div>
          </template>
          <!-- 小程序-->
          <template v-if="mediumContent.type_id == 6">
            <div class="typeId3">
              <div class="applets">
                <img :src="require('@/assets/healthManage/u7336.png')" />
                <div class="text1">{{ mediumContent.title }}</div>
                <div class="text2">{{ mediumContent.maintitle }}</div>
                <img class="appletsImg" :src="mediumContent.imageFullPath" />
              </div>
            </div>
          </template>
        </template>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { Space } from 'ant-design-vue'
import {
  taskContactDetailTasks,
  taskDetailDelete,
  diagnosisCareQuestionnaireDetail,
  diagnosisCareResultDetail,
  taskDetailGetMediumDetail
} from '@/api/healthManage'
import moment from 'moment'
import ProgrammeMoadl from './programmeMoadl'
import QuestionnaireDetail from '../../components/questionnaireDetail/index.vue'
import pako from 'pako'
export default {
  props: {
    planList: {
      type: Array,
      default: () => {
        return []
      }
    },
    contactId: {
      type: [Number, String],
      default: ''
    },
    contactData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    Space,
    ProgrammeMoadl,
    QuestionnaireDetail
  },
  computed: {},
  data () {
    return {
      selectVal: '',
      taskObj: {},
      radioVal: '',
      visible: false,
      isSubmit: false, // 是否显示提交
      currentObj: {}, // 答卷所需信息
      detailObj: {},
      visible1: false,
      visible2: false,
      loading: false,
      mediumContent: {}
    }
  },
  mounted () {
    this.selectVal = this.planList[0].planId
    this.getTaskContactDetailTasks(this.planList[0].planId, this.contactId)
  },
  methods: {
    handleChange (e) {
      this.selectVal = e
      this.getTaskContactDetailTasks(this.selectVal, this.contactId)
    },
    radioChange () {
      this.getTaskContactDetailTasks(this.selectVal, this.contactId)
    },
    // 任务详情
    async getTaskContactDetailTasks (planId, contactId) {
      // planId+contactId
      this.loading = true
      const data = await taskContactDetailTasks({ planId, contactId, questionnaireStatus: this.radioVal })
      const strData = atob(data.data)
      // Convert binary string to character-number array
      const charData = strData.split('').map(function (x) {
        return x.charCodeAt(0)
      })
      // Turn number array into byte-array
      var binData = new Uint8Array(charData)
      // // unzip
      var _data = pako.inflate(binData, { to: 'string' })
      this.taskObj = JSON.parse(_data)
      this.loading = false
    },
    /**
     * 点击问卷查询详情
     */
    async getQuestionResults (item, state) {
      console.log(',,,,,,,,,,,,,,,,,', this.currentObj)
      console.log(',,,,,,,,,,,,,,,,,', this.contactData)
      console.log(item, state)
      this.currentObj = item
      this.currentObj.contactData = this.contactData
      console.log(',,,,,,,,,,,,,,,,,', this.currentObj)
      if (item.type != 1) {
        this.openDetailModal()
        return
      }
      this.visible = true
      let data
      try {
        if (item.status == 2) {
          this.isSubmit = false
          data = await diagnosisCareResultDetail({ id: item.taskDetailId })
        } else {
          this.isSubmit = true
          data = await diagnosisCareQuestionnaireDetail({ id: item.formId })
        }
        console.log(data.data, 'datadatadatadatadata')
        this.detailObj = data.data
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 打开患教  嘱托
     */
    openDetailModal () {
      console.log(this.currentObj, 'this.currentObj')
      if (this.currentObj.type == 2) {
        taskDetailGetMediumDetail({ taskDetailId: this.currentObj.taskDetailId }).then(res => {
          this.mediumContent = res.data.mediumContent
          this.visible2 = true
        })
      } else {
        this.visible1 = true
      }
    },
    // 删除任务
    delTask ({ taskDetailId }) {
      const _self = this
      this.$confirm({
        content: '患者从方案中删除后不可恢复继续执行方案是否确认删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const { code } = await taskDetailDelete({ taskDetailId })
          if (code == 200) {
            _self.$message.success('操作成功')
          } else {
            _self.$message.error('操作失败')
          }
          _self.getTaskContactDetailTasks(_self.selectVal, _self.contactId)
        }
      })
    },
    timeFormat (e) {
      const y = moment(e).format('YYYY')
      const m = moment(e).format('MM')
      const d = moment(e).format('DD')
      return `${y}年${m}月${d}日`
    },
    // 添加问卷
    openMoadl () {
      this.$refs.programmeMoadl.open(3, false, this.selectVal)
    },
    // 样式
    stateStyle (e) {
      if (e == 0) {
        return 'color: #7F7F7F; background-color: rgb(129,211,248);'
      }
      if (e == 1) {
        return 'color: #578A04; background-color: rgb(200,249,228);'
      }
      if (e == 2) {
        return 'color: #fff; background-color: rgb(2,167,240);'
      }
      if (e == 3) {
        return 'color: #fff; background-color: rgb(236,128,141);'
      }
      if (e == 4) {
        return 'color: #7F7F7F; background-color: rgb(215,215,215);'
      }
    },
    // 回到顶部
    goTop () {
      this.$refs.programmeDetail.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.record_ {
  padding: 15px;
  .goTop{
    width: 50px;
    height: 50px;
    cursor: pointer;
    position: absolute;
    left: 630px;
    bottom: 15px;
    z-index: 4;
  }
  .programmeDetail {
    height: 500px;
    width: 700px;
    overflow-y: auto;
    position: relative;

    .createdTime {
      padding: 20px 0;
      text-align: center;
      font-size: 14px;
      color: #555;
    }

    .taskItem {
      display: flex;
      flex-direction: row;
      align-items: stretch;

      .title {
        line-height: 14px;
        font-size: 14px;
        color: #555;
        margin-right: 15px;
        min-width: 150px;
        width: 150px;
        text-align: right;
      }

      .division {
        position: relative;
        width: 1px;
        background-color: rgb(121, 121, 121);
        margin-right: 15px;

        img {
          position: absolute;
          top: 0;
          left: -7px;
        }
      }

      .taskList-content {
        line-height: 1;

        .time {
          font-size: 14px;
          color: #555;
        }

        .state {
          font-size: 12px;
          padding: 4px;
          border-radius: 5px;
        }

        .taskList {
          padding: 15px 15px 0 15px;
          border-radius: 10px;
          border: 1px solid #e8e8e8;
          width: 426px;
          margin-top: 15px;
          margin-bottom: 20px;

          .item {
            justify-content: space-between;
            padding-bottom: 15px;

            div {
              color: #333;
              line-height: 1.3;
            }

            .tip {
              background: #d7d9f9;
              padding: 2px 4px;
              border-radius: 5px;
              color: #03a7f0;
              font-size: 12px;
              margin-right: 10px;
              min-width: 32px;
            }

            .btns {
              div {
                padding: 2px 15px;
                cursor: pointer;
                min-width: 58px;
              }

              .edit {
                color: #03a7f0;
                font-size: 12px;
                border-right: 2px solid #e8e8e8;
              }

              .del {
                color: #333;
                font-size: 12px;
              }
            }
          }

          .btm-border {
            padding-top: 15px;
            border-top: 1px solid #e8e8e8;
          }
        }
      }
    }
  }

}
.detail-content{
  width: 100%;
  height: 500px;
  max-height: 500px;
  overflow-y: auto;
  line-height: 1.4;
  color: #333;
  .typeId3{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img{
      height: 224px;
      width: 200px;
    }
    a{
      margin-top: 15px;
    }
    .applets{
      width: 287px;
      height: 309px;
      position: relative;
      img{
        position: absolute;
        top: 0;
        left: 0;
        width: 287px;
        height: 309px;
      }
      .text1{
        color: #333;
        z-index: 2;
        position: absolute;
        font-size: 14px;
        left: 40px;
        top: 13px;
      }
      .text2{
        color: #333;
        z-index: 2;
        position: absolute;
        font-size: 14px;
        left: 20px;
        top: 40px;
        width: calc(100% - 40px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .appletsImg{
        position: absolute;
        width: 247px;
        left: 20px;
        top: 64px;
        height: 202px;
      }
    }
  }
}
</style>
