<!-- 编辑方案 -- 随访方案编辑 -->

<template>
  <div class="editDetail">
    <div class="currentState flex-row-center">
      当前状态：
      <span class="state-text status0" v-if="pageData.status == 0">待启用</span>
      <span class="state-text status1" v-if="pageData.status == 1">执行中</span>
      <span class="state-text status2" v-if="pageData.status == 2">已删除</span>
      <a-button
        type="primary"
        style="margin: 0 10px"
        @click="suspendOrContinue"
        v-permission="'/healthManage/currentProgrammeDetail/editDetail#open'"
        v-if="pageData.status == 0"
        :loading="loading"> 启动 </a-button>
      <a-button
        type="danger"
        style="margin: 0 10px"
        @click="suspendOrContinue"
        v-permission="'/healthManage/currentProgrammeDetail/editDetail#stop'"
        v-if="pageData.status == 1"
        :loading="loading"> 暂停 </a-button>
      <template v-if="pageData.status == 1">
        停止后，患者将停止随访方案执行，医生可在停止后编辑随访方案内容.
      </template>
    </div>
    <div class="editContent flex-row-center" style="color: #ec808d">
      <a-button
        type="primary"
        style="margin-right: 10px"
        @click="goEditProgramme(pageData.planId)"
        v-permission="'/healthManage/currentProgrammeDetail/editDetail#edit'"
        :disabled="!(pageData.status == 0 && pageData.isDefault == 0)">
        编辑方案
      </a-button>
      <template v-if="pageData.isDefault != 0">
        本方案为企业/平台方案，不可进行编辑。
      </template>
    </div>
    <div class="moduleTitle flex-row-center">
      <div class="chunk"></div>
      方案起始条件
    </div>
    <div class="editContent flex-row-center">方案描述：{{ pageData.description }}</div>
    <div class="editContent flex-row-center">随访起始日期：患者加入后即刻开始</div>
    <div class="moduleTitle flex-row-center">
      <div class="chunk"></div>
      方案详情
    </div>
    <div class="programme-detail flex-row-center">
      <div class="programme-detail-l">
        <!-- ----------------------------------------------------------------------------------------- -->
        <div class="titleContent flex-row-center">
          <img class="titleContent-img1" :src="require('@/assets/healthManage/u3067.png')" alt="" />
          问卷
        </div>
        <template v-for="item in pageData.processs">
          <a-row :key="item.questionnaire.formId" v-if="item.questionnaire">
            <a-col class="contentItem" :span="12">
              <span class="flex-row-center" @click="getQuestionResults(item.questionnaire.formId)">
                <div class="contentItem-tip"></div>
                {{ item.questionnaire.name }}
              </span>
            </a-col>
            <a-col :span="12"> 推送方案：{{ dateText(item.sendConditionType, item) }} </a-col>
          </a-row>
        </template>
        <!-- ----------------------------------------------------------------------------------------- -->
        <div class="titleContent flex-row-center">
          <img class="titleContent-img1" :src="require('@/assets/healthManage/u804.png')" alt="" />
          嘱托
        </div>
        <template v-for="item in pageData.processs">
          <div :key="`${item.entrust.formId}--`" v-if="item.entrust">
            <a-row style="margin-bottom: 15px">
              <a-col class="contentItem flex-row-center" :span="12" @click="openDetailModal(item.entrust,'嘱托')">
                <div class="contentItem-tip"></div>
                {{ item.entrust.name }}
              </a-col>
              <a-col :span="12">
                <a-row style="margin-bottom: 2px">
                  推送方案：{{ dateText(item.sendConditionType, item) }}
                </a-row>
                <a-row>
                  提醒内容：{{ item.entrust.content }}
                </a-row>
              </a-col>
            </a-row>
          </div>
        </template>
        <!-- ----------------------------------------------------------------------------------------- -->
        <div class="titleContent flex-row-center">
          <img class="titleContent-img1" :src="require('@/assets/healthManage/u804.png')" alt="" />
          患教
        </div>
        <template v-for="item in pageData.processs">
          <a-row :key="`${item.article.formId}-`" v-if="item.article">
            <a-col class="contentItem flex-row-center" :span="12" @click="openDetailModal(item.article,'患教')">
              <div class="contentItem-tip"></div>
              {{ item.article.name }}
            </a-col>
          </a-row>
        </template>
        <!-- ----------------------------------------------------------------------------------------- -->

      </div>
      <div class="programme-detail-r">
        <div class="titleContent flex-row-center">
          <img class="titleContent-img1" :src="require('@/assets/healthManage/u3091.png')" alt="" />
          预警服务
        </div>
      </div>
    </div>
    <a-modal title="问卷" v-model="visible" :footer="null">
      <div class="questionnairecontent">
        <QuestionnaireDetail :questionnaireArr="questionnaireArr" :questionnaireName="questionnaireName" />
      </div>
    </a-modal>
    <a-modal :title="detailObj.name" v-model="visible1" :footer="null">
      <div class="detail-content">
        {{ detailObj.content }}
      </div>
    </a-modal>
    <a-modal :title="detailObj.name" v-model="visible2" :footer="null" destroyOnClose>
      <div class="detail-content" style="height: 580px;max-height: 580px">
        <template v-if="detailObj.mediumContent">
          <!-- 文本-->
          <template v-if="detailObj.mediumContent.type_id == 1">
            <div v-html="detailObj.mediumContent.content"></div>
          </template>
          <!-- 图片-->
          <template v-if="detailObj.mediumContent.type_id == 2">
            <img class="currentImg" :src="detailObj.mediumContent.imageFullPath">
          </template>
          <!-- 图文-->
          <template v-if="detailObj.mediumContent.type_id == 3">
            <!--            <div class="typeId3">-->
            <!--              <img :src="detailObj.mediumContent.imageFullPath" />-->
            <!--              <a :href="detailObj.mediumContent.imageLink" target="_blank">{{ detailObj.mediumContent.imageLink }}</a>-->
            <!--            </div>-->
            <iframe width="100%" height="100%" :src="detailObj.mediumContent.imageLink" />
          </template>
          <!-- 音频-->
          <template v-if="detailObj.mediumContent.type_id == 4">
            <div class="typeId3">
              <audio :src="detailObj.mediumContent.voiceFullPath" controls />
            </div>
          </template>
          <!-- 视频-->
          <template v-if="detailObj.mediumContent.type_id == 5">
            <div class="typeId3">
              <video :src="detailObj.mediumContent.videoFullPath" controls="controls" style="width: 100%;"></video>
            </div>
          </template>
          <!-- 小程序-->
          <template v-if="detailObj.mediumContent.type_id == 6">
            <div class="typeId3">
              <div class="applets">
                <img :src="require('@/assets/healthManage/u7336.png')" />
                <div class="text1">{{ detailObj.mediumContent.title }}</div>
                <div class="text2">{{ detailObj.mediumContent.maintitle }}</div>
                <img class="appletsImg" :src="detailObj.mediumContent.imageFullPath" />
              </div>
            </div>
          </template>
        </template>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { planPlanDetail, planPlanUpdateStatus, diagnosisCareQuestionnaireDetail } from '@/api/healthManage'
import QuestionnaireDetail from '../../components/questionnaireDetail/index.vue'

export default {
  components: {
    QuestionnaireDetail
  },
  props: {
    // eslint-disable-next-line vue/require-prop-type-constructor
    planId: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
      default: ''
    }
  },
  data () {
    return {
      pageData: {},
      questionnaireArr: [],
      visible: false,
      visible1: false,
      visible2: false,
      questionnaireName: '',
      unitList: [
        {
          id: 1,
          title: '日'
        },
        {
          id: 2,
          title: '周'
        },
        {
          id: 3,
          title: '年'
        },
        {
          id: 4,
          title: '月'
        }
      ],
      loading: false,
      detailObj: {}
    }
  },
  mounted () {
    this.getDetail(this.planId)
  },
  methods: {
    // 查看详情
    async getDetail (planId) {
      const { data } = await planPlanDetail({ planId })
      this.pageData = data
    },
    // 点击问卷查询详情
    async getQuestionResults (id) {
      this.visible = true
      try {
        const {
          data: { questionResults, questionnaireName }
        } = await diagnosisCareQuestionnaireDetail({ id })
        this.questionnaireName = questionnaireName
        this.questionnaireArr = questionResults
      } catch (error) {
        console.log(error)
      }
    },
    // 启用 或 暂停
    async suspendOrContinue () {
      const { planId, status } = this.pageData
      let data
      this.loading = true
      if (status == 0) {
        console.log('启用')
        data = await planPlanUpdateStatus({ planId, status: 1 })
      } else {
        console.log('暂停')
        data = await planPlanUpdateStatus({ planId, status: 0 })
      }
      if (data.code == 200) {
        this.$message.success('操作成功')
      } else {
        this.$message.error('操作失败')
      }
      this.loading = false
      this.getDetail(this.planId)
    },
    dateText (key, item) {
      const {
        processCondition: { sendDate, sendDateUnit, interval, intervalUnit, endInterval, endIntervalUnit }
      } = item
      switch (Number(key)) {
        case 1:
          return `第${sendDate}${this.unit(sendDateUnit)}推送`
        case 2:
          return `间隔周期${interval}${this.unit(intervalUnit)}推送,执行期限${endInterval}${this.unit(endIntervalUnit)}`
        case 3:
          return '加入当天仅执行一次'
        default:
          break
      }
    },
    unit (key) {
      return this.unitList[key - 1].title
    },
    // 编辑方案
    goEditProgramme (planId) {
      this.$router.push(`/healthManage/addProgramme?planId=${planId}&type=edit&pageType=personal`)
    },
    openDetailModal (item, keyName) {
      this.detailObj = {
        ...item,
        keyName
      }
      if (keyName == '患教') {
        this.visible2 = true
      } else {
        this.visible1 = true
      }
      console.log(this.detailObj)
    }
  }
}
</script>
<style lang="less">
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.editDetail {
  padding: 0 15px;

  .currentState {
    height: 50px;
    border: 1px solid rgba(170, 170, 170, 1);
    border-radius: 5px 5px 5px 5px;
    padding: 0 15px;

    .state-text {
      font-weight: bold;
    }

    .status0 {
      color: #f59a23;
    }

    .status1 {
      color: #70b603;
    }

    .status2 {
      color: #7f7f7f;
    }
  }

  .editContent {
    margin: 20px 0;
  }

  .moduleTitle {
    font-size: 18px;
    font-weight: bold;
  }

  .programme-detail {
    margin-top: 20px;
    background-color: rgb(242, 242, 242);
    padding: 15px;
    border-radius: 10px;
    justify-content: space-between;
    align-items: stretch;

    &-l {
      width: 60%;
      max-width: 60%;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
      margin-right: 15px;

      .contentItem {
        font-size: 16px;
        color: #02a7f0;
        margin-bottom: 20px;
        cursor: pointer;

        &-tip {
          width: 10px;
          min-width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #02a7f0;
          margin-right: 10px;
        }
      }
      .entrust_text{
        overflow: hidden;
        text-overflow: ellipsis;  /* 超出部分省略号 */
        display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
        -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
        -webkit-line-clamp: 3; /* 显示的行数 */
        word-break: break-all;
      }
    }

    &-r {
      flex: 1;
      width: calc(40% - 15px);
      max-width: calc(40% - 15px);
      min-height: 100%;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
    }

    .titleContent {
      font-size: 18px;
      margin-bottom: 20px;

      &-img1 {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
  }
}

.questionnairecontent {
  width: 100%;
  height: 500px;
  max-height: 500px;
  overflow-y: auto;
}
.detail-content{
  width: 100%;
  height: 500px;
  max-height: 500px;
  overflow-y: auto;
  line-height: 1.4;
  color: #333;
  .currentImg{
    max-width: 100%;
  }
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
