<template>
  <div id="integral_rules_container" ref="integral_rules_container">
    <div class="commonRulesDiv">
      <div class="headTitleDiv">通用设置</div>
      <!-- :scroll="{ x: 1500}" -->
      <a-table
        :loading="commonTableLoading"
        :row-key="record => record.id"
        :data-source="commonTableData"
        :columns="commonTableColumns"
        :pagination="false"
        class="tableBox">
        <div slot="options" slot-scope="text, record">
          <template>
            <div style="display: flex;justify-content: space-around;">
              <a-button type="link" @click="setCommonMethod(record)" v-permission="'/creditsSet/setCreditsSet@post'">设置</a-button>
            </div>
          </template>
        </div>
      </a-table>
    </div>
    <a-modal
      :maskClosable="false"
      :width="700"
      :visible="commonValidityShowStatus"
      class="validityModalClass"
      @cancel="closeCommonValidityModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <div slot="title" class="titleSlot">
        <div>积分有效期</div>
        <a-popover title="">
          <template slot="content">
            <div class="labelBox">
              积分有效期规则仅适用于规则生效后发放的积分，不影响历史已发放积分
            </div>
          </template>
          <img src="@/assets/integral/question.png" alt="" class="questionClass">
        </a-popover>
      </div>
      <a-spin :spinning="commonRulesValidityLoading">
        <a-radio-group
          class="radioValityGroupDiv"
          v-if="commonRulesInfo.creditsSetDeatilVo &&
            commonRulesInfo.creditsSetDeatilVo.restrictionType"
          v-model="commonRulesInfo.creditsSetDeatilVo.restrictionType"
          @change="changeValidity">
          <a-radio class="singleRadioDiv" :value="'1'">
            <div class="singleRadioTitle">永久有效</div>
          </a-radio>
          <a-radio class="singleRadioDiv" :value="'2'">
            <div class="singleRegularTopDiv">
              <div class="singleRadioTitle">定期清零</div>
              <div class="regularText">可设置清零时间与清零周期，例：每年9月1号，清零去年8月1号到今年7月31号获得的积分。</div>
            </div>
            <div class="regularContentView">
              <div class="singleRegularContent">
                每年
                <a-date-picker
                  :getCalendarContainer="() => $refs['integral_rules_container']"
                  dropdownClassName="dropdownClassName"
                  :disabled="commonRulesInfo.creditsSetDeatilVo.restrictionType !== '2'"
                  valueFormat="MM-DD"
                  format="MM-DD"
                  v-model="commonRulesInfo.creditsSetDeatilVo.monthDay"
                  @change="changeMonthDay"
                ></a-date-picker>
                定期清零
              </div>
              <div class="singleRegularContent">
                去年
                <!-- <a-date-picker
                  :disabled="commonValidityTypeInfo.restrictionType !== '2' || !commonValidityTypeInfo.monthDay"
                  valueFormat="MM-DD"
                  format="MM-DD"
                  :disabled-date="e => disableBeforeDate(commonValidityTypeInfo.monthDay, e)"
                  v-model="commonValidityTypeInfo.lastYearMonthDay"
                  @change="changePreviousDate"
                ></a-date-picker> -->
                <a-date-picker
                  :getCalendarContainer="() => $refs['integral_rules_container']"
                  dropdownClassName="dropdownClassName"
                  :disabled-date="e => disableBeforeDate(commonRulesInfo.creditsSetDeatilVo.monthDay, e)"
                  :disabled="commonRulesInfo.creditsSetDeatilVo.restrictionType !== '2' || !commonRulesInfo.creditsSetDeatilVo.monthDay"
                  valueFormat="MM-DD"
                  format="MM-DD"
                  v-model="commonRulesInfo.creditsSetDeatilVo.lastYearMonthDay"
                  @change="changePreviousDate"
                ></a-date-picker>
                至下一年
                <a-date-picker
                  :disabled="true"
                  valueFormat="MM-DD"
                  format="MM-DD"
                  v-model="commonRulesInfo.creditsSetDeatilVo.nextYearMonthDay"
                ></a-date-picker>
              </div>
            </div>
          </a-radio>
          <a-radio class="singleRadioDiv" :value="'3'">
            <!-- <div class="singleRadioTitle">每笔积分有效期</div> -->
            <div class="singleRadioContent">
              <div class="singleRadioTitle">每笔积分有效期为</div>
              <a-input-number
                :value="commonRulesInfo.creditsSetDeatilVo.ytdNum ? Number(commonRulesInfo.creditsSetDeatilVo.ytdNum) : 1"
                placeholder="请输入"
                :min="1"
                :disabled="commonRulesInfo.creditsSetDeatilVo.restrictionType !== '3'"
                @change="changeSingleIntegralNumber"
                class="inputSelectClass">
              </a-input-number>
              <!-- <a-input-number
                v-if="commonRulesInfo.creditsSetDeatilVo.ytdType === '2'"
                :value="commonRulesInfo.creditsSetDeatilVo.ytdNum ? Number(commonRulesInfo.creditsSetDeatilVo.ytdNum) : 1"
                placeholder="请输入"
                :min="1"
                :max="18"
                :disabled="commonRulesInfo.creditsSetDeatilVo.restrictionType !== '3'"
                @change="changeSingleIntegralNumber"
                class="inputSelectClass">
              </a-input-number> -->
              <!-- <a-input-number
                v-if="commonRulesInfo.creditsSetDeatilVo.ytdType === '3'"
                :value="commonRulesInfo.creditsSetDeatilVo.ytdNum ? Number(commonRulesInfo.creditsSetDeatilVo.ytdNum) : 1"
                placeholder="请输入"
                :min="1"
                :max="365"
                :disabled="commonRulesInfo.creditsSetDeatilVo.restrictionType !== '3'"
                @change="changeSingleIntegralNumber"
                class="inputSelectClass">
              </a-input-number> -->
              <!-- v-if="commonRulesInfo.creditsSetDeatilVo && commonRulesInfo.creditsSetDeatilVo.ytdType" -->
              <a-select
                v-if="singleIntegralValidityTypeList[0] && singleIntegralValidityTypeList[0].code"
                placeholder="请选择"
                :value="commonRulesInfo.creditsSetDeatilVo.ytdType || singleIntegralValidityTypeList[0].code"
                :disabled="commonRulesInfo.creditsSetDeatilVo.restrictionType !== '3'"
                class="inputSelectClass"
                @change="changeSingleValidateType">
                <a-select-option v-for="integralItem in singleIntegralValidityTypeList" :key="integralItem.code" :value="integralItem.code">{{ integralItem.name }}</a-select-option>
              </a-select>
              <!-- <a-input-number placeholder="请输入" :disabled="commonValidityTypeInfo.restrictionType !== '3'">
                <a-select slot="addonAfter" v-model="singlgeIntegralName" :disabled="commonValidityTypeInfo.restrictionType !== '3'">
                  <a-select-option v-for="integralItem in singleIntegralValidityList" :key="integralItem.id" :value="integralItem.name">
                    {{ integralItem.name }}
                  </a-select-option>
                </a-select>
              </a-input-number> -->
            </div>
            <div class="singleContentText">
              <div class="contentText">“年”支持1~3年，“月”支持1~18个月，“日”支持1~365日；</div>
              <div class="contentText">例，有效期为1年，1月1日获得10积分，则该笔积分将在次年1月1日过期</div>
            </div>
          </a-radio>
        </a-radio-group>
      </a-spin>
      <template slot="footer">
        <a-button
          :disabled="commonRulesValidityLoading === true"
          @click="closeCommonValidityModal()"
        >取消</a-button>
        <a-button
          type="primary"
          v-permission="'/creditsSet/setCreditsSet@post'"
          @click="confirmCommonValidity"
          :disabled="commonRulesValidityLoading === true"
        >确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="积分上限"
      :maskCloseable="false"
      :width="600"
      :visible="commonLimitShowStatus"
      class="limitModalClass"
      @cancel="closeCommonLimitModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <a-spin :spinning="commonRulesLimitLoading">
        <a-radio-group
          v-if="commonRulesInfo.creditsSetDeatilVo && commonRulesInfo.creditsSetDeatilVo.restrictionType"
          class="radioLimitGroupDiv"
          v-model="commonRulesInfo.creditsSetDeatilVo.restrictionType"
          @change="changeLimit">
          <a-radio class="singleRadioDiv" :value="'4'">
            <div class="singleRadioTitle">不限制</div>
          </a-radio>
          <a-radio class="singleRadioDiv" :value="'5'">
            <div class="singleRadioContent">
              <div class="singleRadioTitle">员工每日获取积分上限</div>
              <a-input-number
                :value="commonRulesInfo.creditsSetDeatilVo.integralMaxNum ?
                  Number(commonRulesInfo.creditsSetDeatilVo.integralMaxNum) : 1"
                placeholder="请输入"
                :min="1"
                :max="99999"
                :disabled="commonRulesInfo.creditsSetDeatilVo.restrictionType !== '5'"
                class="inputSelectClass"
                @change="changeLimitNumber">
              </a-input-number>
            </div>
          </a-radio>
        </a-radio-group>
      </a-spin>
      <!-- <a-radio-group class="radioLimitGroupDiv" v-model="limitTypeName">
        <a-radio class="singleRadioDiv" v-for="item in commonLimitTypeList" :key="item.id" :value="item.value">
          <div class="singleRadioTitle" v-if="item.value === 'noLimit'">{{ item.name }}</div>
          <div class="singleRadioContent" v-if="item.value === 'limit'">
            <div class="singleRadioTitle">{{ item.name }}</div>
            <a-input></a-input>
          </div>
        </a-radio>
      </a-radio-group> -->
      <template slot="footer">
        <a-button
          :disabled="commonRulesLimitLoading === true"
          @click="closeCommonLimitModal()"
        >取消</a-button>
        <a-button
          type="primary"
          v-permission="'/creditsSet/setCreditsSet@post'"
          :disabled="commonRulesLimitLoading === true"
          @click="confirmCommonLimit"
        >确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="到期提醒"
      :maskCloseable="false"
      :width="600"
      :visible="commonRemindShowStatus"
      class="remindModalClass"
      @cancel="closeCommonRemindModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <a-spin :spinning="commonRulesRemindLoading">
        <a-radio-group
          v-if="commonRulesInfo.creditsSetDeatilVo && commonRulesInfo.creditsSetDeatilVo.restrictionType"
          class="radioRemindGroupDiv"
          v-model="commonRulesInfo.creditsSetDeatilVo.restrictionType"
          @change="changeRemind">
          <a-radio class="singleRadioDiv" :value="'6'">
            <div class="singleRadioTitle">不提醒</div>
          </a-radio>
          <a-radio class="singleRadioDiv" :value="'7'">
            <div class="singleRadioContent">
              <div class="singleRadioTitle">到期前</div>
              <a-input-number
                :value="commonRulesInfo.creditsSetDeatilVo.beforeDayNum ? Number(commonRulesInfo.creditsSetDeatilVo.beforeDayNum) : 1"
                placeholder="请输入"
                :min="1"
                :max="100"
                :disabled="commonRulesInfo.creditsSetDeatilVo.restrictionType !== '7'"
                class="inputSelectClass"
                @change="changeBeforeDayNum">
              </a-input-number>
              <div class="singleRadioText">天</div>
              <a-time-picker
                v-model="commonRulesInfo.creditsSetDeatilVo.beforeDayTime"
                :disabled="commonRulesInfo.creditsSetDeatilVo.restrictionType !== '7'"
                placeholder="请输入时间"
                class="inputSelectClass"
                valueFormat="HH:mm"
                format="HH:mm"
              ></a-time-picker>
              <div class="singleRadioText">提醒员工</div>
            </div>
          </a-radio>
        </a-radio-group>
      </a-spin>
      <!-- <a-radio-group class="radioRemindGroupDiv" v-model="remindTypeName">
        <a-radio class="singleRadioDiv" v-for="item in commonRemindTypeList" :key="item.id" :value="item.value">
          <div class="singleRadioTitle" v-if="item.value === 'noRemind'">{{ item.name }}</div>
          <div class="singleRadioContent" v-if="item.value === 'remind'">
            <div class="singleRadioTitle">{{ item.name }}</div>
            <a-input></a-input>
            <div class="singleRadioText">天</div>
            <a-date-picker></a-date-picker>
            <div class="singleRadioText">提醒员工</div>
          </div>
        </a-radio>
      </a-radio-group> -->
      <template slot="footer">
        <a-button
          :disabled="commonRulesRemindLoading === true"
          @click="closeCommonRemindModal()"
        >取消</a-button>
        <a-button
          :disabled="commonRulesRemindLoading === true"
          type="primary"
          @click="confirmCommonRemind"
          v-permission="'/creditsSet/setCreditsSet@post'"
        >确定</a-button>
      </template>
    </a-modal>
    <integralRulesData></integralRulesData>
  </div>
</template>

<script>
import integralRulesData from './integralRulesData.vue'
import { deepClonev2 } from '@/utils/util'
import moment from 'moment'
import { getDict } from '@/api/common'
import { getCommonRulesApi, setCommonRulesApi } from '@/api/integralManager'
export default {
  name: 'BackendIntegralRules',
  data () {
    return {
      deepClonev2,
      // 通用规则列表加载动画
      commonTableLoading: false,
      // 通用规则列表数据
      commonTableData: [],
      // 通用规则列表表头
      commonTableColumns: [
        {
          title: '规则名称',
          dataIndex: 'setName',
          align: 'center'
          // width: 200
        },
        {
          title: '规则详情',
          dataIndex: 'setDetail',
          align: 'center'
          // width: 300
        },
        {
          title: '更新时间',
          dataIndex: 'updatedAt',
          align: 'center'
          // width: 200
        },
        {
          title: '操作',
          align: 'center',
          width: 250,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      commonRulesInfo: {}, // 通用规则设置对象
      commonRulesValidityLoading: false, // 通用规则有效期弹框加载动画
      commonRulesLimitLoading: false, // 通用规则积分上限弹框加载动画
      commonRulesRemindLoading: false, // 通用规则到期提醒弹框加载动画
      commonValidityTypeInfo: {}, // 通用规则设置有效期对象
      commonRuleTypeList: [], // 通用规则限制类型列表
      // 通用规则积分到期提醒单选value值
      remindTypeName: 'noRemind',
      // 通用规则积分到期提醒弹框
      commonRemindShowStatus: false,
      // 通用规则设置积分过期提醒选项列表
      commonRemindTypeList: [],
      // 通用规则积分上限单选value值
      limitTypeName: 'noLimit',
      // 通用规则有效期单选value值
      validityTypeName: '',
      singleIntegralName: '年',
      // 通用规则设置有效期弹框
      commonValidityShowStatus: false,
      // 通用规则设置有效期选项列表
      commonValidityTypeList: [],
      // 通用规则设置积分上限弹框
      commonLimitShowStatus: false,
      // 通用规则设置积分上限选项列表
      commonLimitTypeList: [],
      // 通用规则每笔积分有效期维度列表
      singleIntegralValidityTypeList: []
    }
  },
  components: {
    integralRulesData
  },
  created () {
    // 获取通用规则数据
    this.getCommonRulesData()
    // 获取积分规则数据
    // this.getIntegralRulesData()
    // // this.getCommonRuleLimitData()
    // // 正式的通用规则数据
    // // this.getCommonRulesData()
    // // 正式的积分规则数据
    // // this.getIntegralRulesData()
    // this.integralTableData = getTempIntegralData()
  },
  methods: {
    // 获取通用规则数据
    getCommonRulesData () {
      this.commonTableLoading = true
      getCommonRulesApi().then(response => {
        console.log(response, '获取通用规则设置')
        this.commonTableData = response.data
        this.commonTableLoading = false
      })
    },
    // 点击通用规则设置
    setCommonMethod (info) {
      console.log(info, '点击通用规则设置')
      if (info.setType === '1') {
        // 点击的是有效期
        this.commonValidityShowStatus = true
        // 获取每笔积分有效期类型(年月日)
        this.getIntegralValidateType()
      } else if (info.setType === '2') {
        // 点击的是积分上限
        this.commonLimitShowStatus = true
      } else if (info.setType === '3') {
        // 点击的是到期提醒
        this.commonRemindShowStatus = true
      }
      this.$nextTick(() => {
        this.commonRulesInfo = this.deepClonev2(info)
      })
    },
    // 获取每笔积分有效期类型(年月日)
    getIntegralValidateType () {
      const params = { dictType: 'ytd_type' }
      getDict(params).then(response => {
        this.singleIntegralValidityTypeList = response.data
      })
    },
    // 切换有效期选项
    changeValidity (e) {
      console.log(e, '切换有效期选项')
      const targetValue = e.target.value
      // 将其他字段清空
      for (const item in this.commonRulesInfo.creditsSetDeatilVo) {
        if (item !== 'restrictionType') {
          this.$set(this.commonRulesInfo.creditsSetDeatilVo, `${item}`, '')
        }
      }
      console.log(this.commonRulesInfo.creditsSetDeatilVo)
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'isChecked', '1')
      if (targetValue === '3') {
        // 为3,表示是每笔积分设置
        // 选项值为年
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'ytdType', this.singleIntegralValidityTypeList[0].code)
        // 最小值为1
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'minNumber', 1)
        // 最大值为3
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'maxNumber', 3)
        // 初始值为1
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'ytdNum', 1)
      }
      // const targetIndex = this.commonValidityTypeList.findIndex(item => item.restrictionType === targetValue)
      // const tempArray = this.commonValidityTypeList.map(item => {
      //   item.isChecked = '0'
      //   return item
      // })
      // this.$set(tempArray[targetIndex], 'isChecked', '1')
      // this.commonValidityTypeList = Object.assign([], tempArray)
    },
    // 切换每次清空去年和下一年时间
    changeMonthDay (e) {
      console.log(e, '切换每次清空时间')
      // this.$set(this.commonValidityTypeInfo, 'lastYearMonthDay', '')
      // this.$set(this.commonValidityTypeInfo, 'nextYearMonthDay', '')
      // commonRulesInfo.creditsSetDeatilVo
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'lastYearMonthDay', '')
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'nextYearMonthDay', '')
    },
    // 切换去年时间
    changePreviousDate () {
      console.log('切换去年时间')
      const tempNextMonthDay = moment(this.commonRulesInfo.creditsSetDeatilVo.lastYearMonthDay).subtract(1, 'd')
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'nextYearMonthDay', moment(tempNextMonthDay).format('MM-DD'))
    },
    // 判断日期是否可选
    disableBeforeDate (targetDate, currentDate) {
      // targetDate 为固定值,currentDate为变化值
      const tempTargetDate = moment(targetDate).format('MM-DD')
      const tempTargetAllDate = '2023-' + tempTargetDate
      const tempCurrentDate = moment(currentDate).format('MM-DD')
      const tempCurrentAllDate = '2023-' + tempCurrentDate
      const targetMinDate = moment('2023-01-01').format('YYYY-MM-DD')
      if (moment(targetMinDate).valueOf() <= moment(tempCurrentAllDate).valueOf() &&
        moment(tempTargetAllDate).valueOf() >= moment(tempCurrentAllDate).valueOf()
      ) {
        // 大于当年最小时间,小于等于设置的时间
        return false
      } else {
        return true
      }
    },
    // 切换每笔积分类型
    changeSingleValidateType (e) {
      console.log(e, '切换每笔积分类型')
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'ytdType', String(e))
      // debugger
      const tempValue = e
      if (tempValue === '1') {
        // 为年,最小值为1,最大值为3,初始值为1
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'minNumber', 1)
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'maxNumber', 3)
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'ytdNum', '1')
        // ytdType
      } else if (tempValue === '2') {
        // 为月,最小值为1,最大值为18
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'minNumber', 1)
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'maxNumber', 18)
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'ytdNum', '1')
      } else if (tempValue === '3') {
        // 为日,最小值为1,最大值为365
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'minNumber', 1)
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'maxNumber', 365)
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'ytdNum', '1')
      }
    },
    // 改变每一笔积分有效期
    changeSingleIntegralNumber (e) {
      console.log(e, '每一笔积分有效期')
      let text = String(e)
      let isValidStatus = false
      debugger
      if (!/^[0-9]+$/.test(text)) {
        // 将不符合的部分清除
        // console.log('有效期有问题', text.replace(/\D/g,''))
        // console.log()
        text = text.replace(/\D/g, '')
        isValidStatus = true
        // text = ''
      }
      if (this.commonRulesInfo.creditsSetDeatilVo.ytdType === '1') {
        // 年
        if (Number(text) > 3 || (isValidStatus && String(e).length > 3)) {
          text = 3
        }
      } else if (this.commonRulesInfo.creditsSetDeatilVo.ytdType === '2') {
        // 月
        if (Number(text) > 18 || (isValidStatus && String(e).length > 3)) {
          text = 18
        }
      } else if (this.commonRulesInfo.creditsSetDeatilVo.ytdType === '3') {
        // 日
        if (Number(text) > 365 || (isValidStatus && String(e).length > 3)) {
          text = 365
        }
      }
      if (!text) {
        text = '1'
      }
      // console.log(text, 'text')
      // debugger
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'ytdNum', String(text))
    },
    // 通用规则有效期点击取消
    closeCommonValidityModal () {
      if (!this.commonRulesValidityLoading) {
        this.commonValidityShowStatus = false
      }
    },
    // 通用规则有效期点击确定
    confirmCommonValidity () {
      const tempInfo = this.commonRulesInfo.creditsSetDeatilVo
      // const tempType = this.commonRulesInfo.creditsSetDeatilVo.restrictionType
      if (tempInfo.restrictionType === '2') {
        // 选择的为定期清零
        if (tempInfo.monthDay && tempInfo.lastYearMonthDay && tempInfo.nextYearMonthDay) {
          // 可以提交
          console.log(this.commonRulesInfo, '定期清空提交对象')
        } else {
          // 不可提交
          this.$message.error('请填写全部数据')
          return false
        }
      } else if (tempInfo.restrictionType === '3') {
        // 选择的为每笔积分有效期
        if (tempInfo.ytdType && tempInfo.ytdNum) {
          // 可以提交
          console.log(this.commonRulesInfo, '每笔积分提交对象')
        } else {
          // 不可提交
          this.$message.error('请填写全部数据')
          return false
        }
      } else {
        console.log(this.commonRulesInfo, '永久有效提交对象')
      }
      // console.log(this.commonValidityTypeInfo, '有效期提交对象')
      // debugger
      // this.commonValidityShowStatus = false
      this.commonRulesSendMethod()
    },
    // 通用规则提交方法
    commonRulesSendMethod () {
      const tempInfo = {}
      for (const key in this.integralRulesTypeInfo) {
        if (key === 'id' || key === 'state' || key === 'creditsRuleJsonDetailVo' || key === 'employeeId') {
          this.$set(tempInfo, `${key}`, this.integralRulesTypeInfo[key])
        }
      }
      this.integralRulesTypeInfo = Object.assign({}, tempInfo)
      console.log(this.integralRulesTypeInfo)
      this.commonRulesRemindLoading = true
      this.commonRulesValidityLoading = true
      this.commonRulesLimitLoading = true
      setCommonRulesApi(this.commonRulesInfo).then(response => {
        console.log(response, '更新积分规则')
        if (response.code === 200) {
          this.commonValidityShowStatus = false
          this.commonRulesValidityLoading = false
          this.commonLimitShowStatus = false
          this.commonRulesLimitLoading = false
          this.commonRemindShowStatus = false
          this.commonRulesRemindLoading = false
          this.getCommonRulesData()
        }
      }).catch(() => {
        this.commonRulesValidityLoading = false
        this.commonRulesLimitLoading = false
        this.commonRulesRemindLoading = false
      })
    },
    // 切换积分上限
    changeLimit () {
      if (this.commonRulesInfo.creditsSetDeatilVo.restrictionType === '5') {
        // 选择的是积分上限
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'integralMaxNum', '10')
      } else {
        // 无上限
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'integralMaxNum', '')
      }
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'isChecked', '1')
    },
    // 改变积分上限数字
    changeLimitNumber (e) {
      // commonRulesInfo.creditsSetDeatilVo.integralMaxNum
      let text = String(e)
      if (!/^[0-9]+$/.test(text)) {
        // 将不符合的部分清除
        // console.log('有效期有问题', text.replace(/\D/g,''))
        // console.log()
        text = text.replace(/\D/g, '')
      }
      if (Number(text) > 99999) {
        text = '99999'
      }
      if (!text) {
        text = '1'
      }
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'integralMaxNum', String(text))
    },
    // 通用规则积分上限点击确定
    confirmCommonLimit () {
      // this.commonLimitShowStatus = false
      const tempInfo = this.commonRulesInfo.creditsSetDeatilVo
      // const tempType = this.commonValidityTypeInfo.restrictionType
      if (tempInfo.restrictionType === '5') {
        // 选择的为积分上限
        if (tempInfo.integralMaxNum) {
          // 可以提交
          console.log(this.commonRulesInfo, '积分上限提交对象')
        } else {
          // 不可提交
          this.$message.error('请填写全部数据')
          return false
        }
      } else {
        console.log(this.commonRulesInfo, '积分上限提交对象')
      }
      // console.log(this.commonValidityTypeInfo, '有效期提交对象')
      // debugger
      // this.commonLimitShowStatus = false
      this.commonRulesSendMethod()
    },
    // 通用规则积分上限点击取消
    closeCommonLimitModal () {
      if (!this.commonRulesLimitLoading) {
        this.commonLimitShowStatus = false
      }
    },
    // 切换到期提醒
    changeRemind () {
      if (this.commonRulesInfo.creditsSetDeatilVo.restrictionType === '7') {
        // 选择的是到期提醒
        // this.$set(this.commonValidityTypeInfo, 'beforeDayNum', '1')
        // this.$set(this.commonValidityTypeInfo, 'beforeDayTime', moment('2022-10-10 10:00:00').format('HH:mm'))
        // commonRulesInfo.creditsSetDeatilVo
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'beforeDayNum', '1')
        // this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'beforeDayTime', '1')
        // debugger
      } else {
        // 不提醒
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'beforeDayNum', '')
        this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'beforeDayTime', '')
      }
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'isChecked', '1')
    },
    // 改变到期提醒天数
    changeBeforeDayNum (e) {
      console.log(e, '改变到期天数')
      // debugger
      let text = String(e)
      if (!/^[0-9]+$/.test(text)) {
        // 将不符合的部分清除
        // console.log('有效期有问题', text.replace(/\D/g,''))
        // console.log()
        text = text.replace(/\D/g, '')
      }
      if (Number(text) > 99999) {
        text = '99999'
      }
      if (!text) {
        text = '1'
      }
      this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'beforeDayNum', String(text))
      // this.$set(this.commonRulesInfo.creditsSetDeatilVo, 'beforeDayNum', e ? String(e) : '1')
    },
    // 通用规则积分到期提醒点击确定
    confirmCommonRemind () {
      // this.commonRemindShowStatus = false
      const tempInfo = this.commonRulesInfo.creditsSetDeatilVo
      // const tempType = this.commonValidityTypeInfo.restrictionType
      if (tempInfo.restrictionType === '7') {
        // 选择的为到期提醒
        if (this.commonRulesInfo.creditsSetDeatilVo.beforeDayNum && this.commonRulesInfo.creditsSetDeatilVo.beforeDayTime) {
          // 可以提交
          console.log(this.commonRulesInfo, '到期提醒提交对象')
        } else {
          // 不可提交
          this.$message.error('请填写全部数据')
          return false
        }
      } else {
        console.log(this.commonRulesInfo, '到期提醒提交对象')
      }
      // console.log(this.commonValidityTypeInfo, '有效期提交对象')
      // this.commonRemindShowStatus = false
      this.commonRulesSendMethod()
    },
    // 通用规则积分过期提醒点击取消
    closeCommonRemindModal () {
      if (!this.commonRulesRemindLoading) {
        this.commonRemindShowStatus = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../css/integralRules.less');;
</style>
