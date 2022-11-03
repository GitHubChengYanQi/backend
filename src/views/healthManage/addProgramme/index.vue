/* eslint-disable */
<!-- 添加方案 -->
<template>
  <div>
    <a-card>
      <a-form
        :form="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
        labelAlign="left"
        @submit="handleSubmit"
      >
        <div style="padding:0 15px">
          <a-form-item label="随访方案名称：">
            <a-input
              v-decorator="['planName', { rules: [{ required: true, message: '请输入方案名称' }] }]"
              placeholder="不超过15个字"
              :maxLength="15"
              onkeyup="this.value=this.value.replace(/[, ]/g,'')"
            />
          </a-form-item>
          <a-form-item label="方案描述：">
            <a-input
              v-decorator="['description']"
              placeholder="对方案的简单描述，不超过50个字"
              :maxLength="50"
              onkeyup="this.value=this.value.replace(/[, ]/g,'')"
            />
          </a-form-item>
          <a-form-item label="方案分类：" v-if="pageType == 'enterprise'">
            <a-select style="width: 300px" v-decorator="['dictCode']" >
              <a-select-option v-for="item in classList" :key="item.code"> {{ item.name }} </a-select-option>
            </a-select>
          </a-form-item>
          <!-- <a-form-item label="患者自动加入条件：">
                    <a-input v-decorator="['tip1']" placeholder="对方案的简单描述，不超过50个字" :maxLength="15"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')" />
                </a-form-item> -->
          <a-form-item label="随访起始日期：">
            <a-select v-decorator="['startWith']">
              <a-select-option :value="1"> 患者加入后即刻开始</a-select-option>
            <!-- <a-select-option value="2">
                            远程视频问诊日期
                        </a-select-option> -->
            </a-select>
          </a-form-item>
        </div>
        <div class="taskList">
          <div class="taskList-titleContent flex-row-center">
            <div class="chunk"></div>
            随访任务列表
          </div>
          <div class="taskList-listContent">
            <div class="listContent-item" v-for="(item, index) in taskList" :key="item.id || item.processId">
              <h3>任务设置</h3>
              <h4>周期设置</h4>
              <div class="listContent-item-close" v-if="index" @click="openDelModal(index)">X</div>
              <a-form-item label="周期类型：">
                <a-select v-model="item['sendConditionType']" style="width: 375px">
                  <a-select-option value="1"> 指定日期发送</a-select-option>
                  <a-select-option value="2"> 固定间隔发送</a-select-option>
                  <a-select-option value="3"> 加入当天仅执行1次的任务</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="推送日期：" v-show="item.sendConditionType == 1">
                <div class="flex-row-center">
                  <div class="mr-10">第</div>
                  <a-input class="mr-10" v-model="item.processCondition['sendDate']" @input="sendDateChange($event,index)" />
                  <a-select class="mr-10" style="width: 100px" v-model="item.processCondition['sendDateUnit']">
                    <!-- eslint-disable-next-line-->
                    <a-select-option :value="item.id" v-for="item in unitList" :key="item.id">
                      {{ item.title }}
                    </a-select-option>
                  </a-select>
                  <a-tooltip placement="right">
                    <template slot="title">
                      <span>日期只能输入数组，中间以”,“分隔</span>
                    </template>
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </div>
              </a-form-item>
              <a-form
                layout="inline"
                :label-col="{ span: 10 }"
                :wrapper-col="{ span: 14 }"
                labelAlign="left"
                v-show="item.sendConditionType == 2"
              >
                <a-form-item label="间隔周期：">
                  <div class="flex-row-center">
                    <a-input class="mr-10" style="width: 52px" v-model="item.processCondition['interval']" oninput="value=value.replace(/[^0-9]/g, '')"/>
                    <a-select class="mr-10" style="width: 90px" v-model="item.processCondition['intervalUnit']">
                      <!-- eslint-disable-next-line-->
                      <a-select-option :value="item.id" v-for="item in unitList" :key="item.id">
                        {{ item.title }}
                      </a-select-option>
                    </a-select>
                  </div>
                </a-form-item>
                <a-form-item label="执行期限：">
                  <div class="flex-row-center">
                    <a-input class="mr-10" style="width: 52px" v-model="item.processCondition['endInterval']" oninput="value=value.replace(/[^0-9]/g, '')"/>
                    <a-select class="mr-10" style="width: 90px" v-model="item.processCondition['endIntervalUnit']">
                      <!-- eslint-disable-next-line-->
                      <a-select-option :value="item.id" v-for="item in unitList" :key="item.id">
                        {{ item.title }}
                      </a-select-option>
                    </a-select>
                  </div>
                </a-form-item>
              </a-form>
              <h3>任务内容</h3>
              <a-form-item label="任务通知时间：">
                <!--                <a-select style="width: 100px" v-model="item['sendTime']">-->
                <!--                  <a-select-option :value="item.id" v-for="item in timeList" :key="item.id">-->
                <!--                    {{ item.title }}-->
                <!--                  </a-select-option>-->
                <!--                </a-select>-->
                <a-time-picker v-model="item['sendTime']" format="HH:mm" :minuteStep="15" :allowClear="false" />
              </a-form-item>
              <div class="listContent-item-btns flex-row-center">
                <div class="btnItem" @click="openQuestionnaire(index)" v-if="item.questionnaire">
                  <img
                    v-show="item.questionnaire.name"
                    :src="require('@/assets/healthManage/u3493.png')"
                    @click.stop="delObj(index, 1)"
                    alt=""
                  />
                  <div class="btnItem-content">
                    {{ item.questionnaire.name ? `问卷：${stre(item.questionnaire.name)}` : '添加问卷' }}
                  </div>
                </div>
                <div class="btnItem" @click="openQuestionnaire(index)" v-else>
                  <div class="btnItem-content">添加问卷</div>
                </div>
                <div class="btnItem" @click="openArticle(index)" v-if="item.article">
                  <img
                    v-show="item.article.name"
                    :src="require('@/assets/healthManage/u3493.png')"
                    @click.stop="delObj(index, 2)"
                    alt=""
                  />
                  <div class="btnItem-content">
                    {{ item.article.name ? `患教：${stre(item.article.name)}` : '添加患教' }}
                  </div>
                </div>
                <div class="btnItem" @click="openArticle(index)" v-else>
                  <div class="btnItem-content">添加患教</div>
                </div>
                <div class="btnItem" @click="openEentrust(index)" v-if="item.entrust">
                  <img
                    v-show="item.entrust.name"
                    :src="require('@/assets/healthManage/u3493.png')"
                    @click.stop="delObj(index, 3)"
                    alt=""
                  />
                  <div class="btnItem-content">
                    {{ item.entrust.name ? `嘱托：${stre(item.entrust.name)}` : '添加嘱托' }}
                  </div>
                </div>
                <div class="btnItem" @click="openEentrust(index)" v-else>
                  <div class="btnItem-content">添加嘱托</div>
                </div>
              </div>
            </div>
            <a-button icon="plus" type="primary" block @click="addTask"> 新建随访任务</a-button>
          </div>
        </div>
        <a-form-item :wrapper-col="{ span: 6, offset: 9 }">
          <a-row type="flex" justify="space-between">
            <a-button @click="back"> 取消</a-button>
            <a-button
              type="primary"
              html-type="submit"
              v-permission="'/healthManage/addProgramme@submit'"
              v-if="type != 'look'"
            >
              保存
            </a-button>
          </a-row>
        </a-form-item>
      </a-form>
      <a-modal v-model="visible" :footer="null" :width="1000" :destroyOnClose="true">
        <div style="height: 687px">
          <Questionnaire :isAdd="false" @close="closeModal" />
        </div>
      </a-modal>
      <a-modal v-model="visible1" :footer="null" :width="1000" :destroyOnClose="true">
        <div style="height: 687px">
          <Article :isAdd="false" @close="closeModal" />
        </div>
      </a-modal>
      <a-modal v-model="visible2" :footer="null" :width="1000" :destroyOnClose="true">
        <div style="height: 687px">
          <Eentrust :isAdd="false" @close="closeModal" />
        </div>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
import Questionnaire from '../knowledgeBase/components/questionnaire.vue' // 问卷
import Article from '../knowledgeBase/components/article.vue' // 患教
import Eentrust from '../knowledgeBase/components/entrust.vue' // 嘱托
import {
  planPlanAdd,
  planPlanDetail,
  planPlanEdit,
  planTemplateAdd,
  planTemplateDetail,
  planTemplateEdit
} from '@/api/healthManage'
import moment from 'moment'
import { getDict } from '@/api/common'
export default {
  components: {
    Questionnaire,
    Article,
    Eentrust
  },
  data () {
    return {
      form: this.$form.createForm(this),
      planId: '',
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
          id: 4,
          title: '月'
        },
        {
          id: 3,
          title: '年'
        }
      ],
      timeList: [
        {
          id: '07:00',
          title: '7:00'
        },
        {
          id: '08:00',
          title: '8:00'
        },
        {
          id: '09:00',
          title: '9:00'
        },
        {
          id: '10:00',
          title: '10:00'
        },
        {
          id: '11:00',
          title: '11:00'
        },
        {
          id: '12:00',
          title: '12:00'
        },
        {
          id: '13:00',
          title: '13:00'
        },
        {
          id: '14:00',
          title: '14:00'
        }
      ],
      taskList: [],
      visible: false,
      currentIndex: null,
      type: '',
      pageType: '',
      visible1: false,
      visible2: false,
      classList: []
    }
  },
  mounted () {
    const { planId, type, pageType } = this.$route.query
    // type: add edit look
    // pageType: 个人：personal， 企业：enterprise
    this.type = type
    this.pageType = pageType
    if (planId) {
      this.planId = planId
      if (pageType == 'enterprise') {
        this.getClass()
      } else {
        this.getDetail(planId)
      }
    } else {
      this.getClass()
      this.addTask()
      this.$nextTick(() => {
        this.form.setFieldsValue({
          startWith: 1
        })
      })
    }
  },
  methods: {
    moment,
    // 获取方案分类
    async getClass () {
      const { data } = await getDict({ dictType: 'diagnosis_care_plan_template_type' })
      this.classList = data
      if (this.planId) this.getDetail(this.planId)
    },
    // 新增任务模块
    addTask () {
      this.taskList.push({
        id: Math.round(new Date() / 1000),
        sendConditionType: '1',
        sendTime: moment('10:00', 'HH:mm'),
        processCondition: {
          sendDate: '1,3',
          sendDateUnit: 1,
          interval: '1',
          intervalUnit: 2,
          endInterval: '1',
          endIntervalUnit: 4
        },
        questionnaire: {
          formId: '',
          name: ''
        },
        article: {
          formId: '',
          name: ''
        },
        entrust: {
          formId: '',
          name: ''
        }
      })
    },
    // 打开问卷弹窗
    openQuestionnaire (index) {
      this.currentIndex = index
      this.visible = true
    },
    // 打开患教弹窗
    openArticle (index) {
      this.currentIndex = index
      this.visible1 = true
    },
    // 打开嘱托弹窗
    openEentrust (index) {
      this.currentIndex = index
      this.visible2 = true
    },
    // 删除任务模块
    openDelModal (index) {
      const _self = this
      this.$confirm({
        content: '确定要删除此随访任务模块吗？',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          _self.taskList.splice(index, 1)
        }
      })
    },
    // 保存方案
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log(this.taskList, 'taskList')
          console.log(values, 'values')
          // eslint-disable-next-line
          let arr = []
          this.taskList.forEach(ele => {
            arr.push({
              ...ele,
              sendTime: moment(ele.sendTime).format('HH:mm')
            })
          })
          // eslint-disable-next-line no-unreachable
          const requestData = {
            ...values,
            processs: arr
          }
          if (this.planId) {
            let data
            if (this.pageType == 'personal') {
              data = await planPlanEdit({ ...requestData, planId: this.planId })
            } else if (this.pageType == 'enterprise') {
              data = await planTemplateEdit({ ...requestData, planId: this.planId })
            }
            if (data.code === 200) {
              this.$message.success('修改成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000)
            } else {
              this.$message.error('修改失败')
            }
          } else {
            let data
            if (this.pageType == 'personal') {
              data = await planPlanAdd(requestData)
            } else if (this.pageType == 'enterprise') {
              data = await planTemplateAdd({ ...requestData, planId: this.planId })
            }
            if (data.code === 200) {
              this.$message.success('添加成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000)
            } else {
              this.$message.error('添加失败')
            }
          }
        } else {
          console.log(err, 'err')
        }
      })
    },
    // 添加 问卷 / 患教 / 嘱托 信息并关闭弹窗清空 currentIndex
    closeModal (item, state) {
      this.visible = false
      this.visible1 = false
      this.visible2 = false
      if (item == null || !item) return
      if (state == 1) {
        this.taskList[this.currentIndex].questionnaire = {
          name: item.questionnaireName,
          formId: item.questionnaireId
        }
      }
      if (state == 2) {
        this.taskList[this.currentIndex].article = {
          name: item.content.title,
          formId: item.id
        }
      }
      if (state == 3) {
        this.taskList[this.currentIndex].entrust = {
          name: item.content.title,
          formId: item.id
        }
      }
      console.log(this.taskList[this.currentIndex])
      this.currentIndex = null
    },
    // 删除指定类型信息
    delObj (index, state) {
      // 问卷
      if (state == 1) {
        this.taskList[index].questionnaire = {
          name: '',
          formId: ''
        }
      }
      // 患教
      if (state == 2) {
        this.taskList[index].article = {
          name: '',
          formId: ''
        }
      }
      // 嘱托
      if (state == 3) {
        this.taskList[index].entrust = {
          name: '',
          formId: ''
        }
      }
    },
    // 查看详情
    async getDetail (planId) {
      let data
      if (this.pageType == 'personal') {
        data = await planPlanDetail({ planId })
      } else if (this.pageType == 'enterprise') {
        data = await planTemplateDetail({ planId })
      }
      const { planName, description, startWith, processs, dictCode } = data.data
      this.form.setFieldsValue({
        planName, // 方案名
        description, // 描述
        startWith, // 随访起始日期
        dictCode // 方案分类
      })
      processs.forEach(ele => {
        ele.sendTime = moment(ele.sendTime, 'HH:mm')
      })
      this.taskList = processs
    },
    // 取消按钮
    back () {
      this.$router.go(-1)
    },
    stre (data) {
      if (data.length > 15) {
        return `${data.substring(0, 15)}...`
      } else {
        return data
      }
    },
    sendDateChange (e, index) {
      var reg = /^(\d+,?)+$/
      if (reg.test(e.data)) {
        let s_ = false
        if (e.target.value.length && e.target.value.indexOf(',') != -1) {
          // eslint-disable-next-line camelcase
          const _s_t_r = `${e.target.value}`
          const newStr = _s_t_r.slice(0, _s_t_r.length - 1)
          const _oL = _s_t_r.split(',')
          const _cL = newStr.split(',')
          console.log(_oL[_oL.length - 1], '最后一个值')
          console.log(_cL, '当前数组')
          _cL.forEach(ele => {
            if (ele == _oL[_oL.length - 1]) {
              s_ = true
              this.$message.error('不能填写相同的日期')
            }
          })
          if (!s_) {
            e.target.value = e.target.value.replace(/[^0-9,]/g, '')
            this.taskList[index].processCondition.sendDate = e.target.value.replace(/[^0-9,]/g, '')
            this.$forceUpdate()
          } else {
            e.target.value = newStr
            this.taskList[index].processCondition.sendDate = newStr
            this.$forceUpdate()
          }
          console.log('输入合法')
        }
      } else {
        console.log('输入不合法')
        e.target.value = e.target.value.replace(/[^0-9,]/g, '')
        this.taskList[index].processCondition.sendDate = e.target.value.replace(/[^0-9,]/g, '')
        this.$forceUpdate()
      }
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

.taskList {
  margin-bottom: 20px;

  &-titleContent {
    color: #000000;
    height: 30px;
    font-size: 18px;
    .chunk{
      width: 7px;
      height: 24px;
    }
  }

  &-listContent {
    margin-top: 20px;
    padding: 30px;
    background-color: #f2f2f2;
    border-radius: 10px;

    .listContent-item {
      padding: 30px;
      border-radius: 5px;
      background-color: #ffffff;
      margin-bottom: 20px;
      position: relative;

      h3,
      h4 {
        margin-bottom: 15px;
      }

      &-close {
        font-size: 20px;
        font-weight: bold;
        position: absolute;
        top: 15px;
        right: 30px;
        user-select: none;
        cursor: pointer;
      }

      .mr-10 {
        margin-right: 10px;
      }

      &-btns {
        flex: 1;
        justify-content: space-between;

        .btnItem {
          width: 30%;
          height: 46px;
          border: 1px solid rgb(215, 215, 215);
          border-radius: 5px;
          cursor: pointer;
          position: relative;

          &-content {
            position: absolute;
            left: 0;
            top: 0;
            padding: 0 30px;
            height: 46px;
            line-height: 46px;
            width: 100%;
            text-align: center;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          img {
            width: 16px;
            height: 16px;
            position: absolute;
            top: -8px;
            right: -8px;
          }
        }
      }
    }
  }
}
</style>
