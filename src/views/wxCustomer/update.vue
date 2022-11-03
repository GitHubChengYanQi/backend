<template>
  <div class="wrapper">
    <div :class="`fl s${active+1}`">
      <ul>
        <li v-for="item in nav" :key="item.num" :class="active===item.num?'active':''" @click="tapNav({type:null,nav:item.num})"><i>{{ item.num + 1 }}</i>{{ item.name }}</li>
      </ul>
    </div>
    <div class="fr">
      <ScrmBase ref="ScrmBase" @toStep="tapNav" v-show="active===0" />
      <ScrmBill ref="ScrmBill" @toStep="tapNav" v-show="active===1" />
      <ScrmProgress ref="ScrmProgress" @toStep="tapNav" v-show="active===2" />
      <ScrmOther ref="ScrmOther" @toStep="tapNav" v-show="active===3" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ScrmBase from './components/base.vue'
import ScrmBill from './components/bill.vue'
import ScrmProgress from './components/progress.vue'
import ScrmOther from './components/other.vue'
import { activityDetail, activityUpdate, mpList } from '@/api/wxCustomer'
export default {
  components: {
    ScrmBase,
    ScrmBill,
    ScrmProgress,
    ScrmOther
  },
  data () {
    return {
      type: '', // add edit
      id: '',
      isPublish: '',
      active: 0,
      nav: [
        {
          num: 0,
          name: '基础设置'
        }, {
          num: 1,
          name: '海报设置'
        }, {
          num: 2,
          name: '进度设置'
        }, {
          num: 3,
          name: '其他设置'
        }
      ],
      navMap: {
        0: 'basic',
        1: 'poster',
        2: 'progress',
        3: 'other'
      },
      numMap: {
        0: '一',
        1: '二',
        2: '三',
        3: '四',
        4: '五',
        5: '六',
        6: '七',
        7: '八',
        8: '九',
        9: '十'
      },
      errors: []
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.type = 'edit'
      this.activityDetail()
    } else {
      this.type = 'add'
      setTimeout(() => {
        this.$refs.ScrmBill.form.qrcodePosition = '61.39x78.13'
        this.$refs.ScrmBill.form.qrcodeSize = '33.33x18.75'
      }, 100)
    }
  },
  methods: {
    /**
     * 点击导航
     */
    tapNav (obj) {
      if (obj.nav === 2) {
        // 是否选择公众号
        const flag = this.isAppId()
        this.$refs.ScrmProgress.show = flag
      }
      // 暂存后切换
      this.backup(this.navMap[this.active], () => {
        if (obj.nav === 2 && obj.type === 'prev') {
          this.$refs.ScrmProgress.active = 2
        }
        this.active = obj.nav
      })
    },
    /**
     * 暂存
     * 不需校验，只提交本表单数据
     */
    backup (type, callback) {
      const param = {}
      param[type] = this.getValue(type)
      param['isPublish'] = 0
      if (this.id && this.id.length > 0) {
        param.id = this.id
      }
      activityUpdate(param).then(res => {
        if (res.code === 200) {
          this.id = res.data + ''
          callback()
        }
      })
    },
    /**
     * 保存并发布
     * 校验所有数据，提交本表单数据
     */
    saveFn (type) {
      const flag = this.validateFn()
      if (flag) {
        const param = {}
        param[type] = this.getValue(type)
        param['isPublish'] = 1
        if (this.id.length > 0) {
          param.id = this.id
        }
        delete param[type].time
        const _this = this
        this.$confirm({
          content: '您是否确认活动已编辑完成？是否确认现在发布？',
          onOk () {
            activityUpdate(param).then(res => {
              if (res.code === '200001') {
                _this.errors = JSON.parse(res.msg)
              }
              if (res.code === 200) {
                _this.$router.push({
                  path: '/wxCustomer/index'
                })
              }
            })
          },
          okText: '发布',
          cancelText: '取消',
          onCancel () {
            console.log('取消')
          }
        })
      }
    },
    /**
     * 校验数据
     */
    validateFn () {
      let flag = true
      let errors = {}
      this.$refs.ScrmBase.$refs.baseForm.validate((valid, values) => {
        if (!valid) {
          errors = { ...errors, ...values }
          flag = false
        }
      })
      this.$refs.ScrmBill.$refs.posterForm.validate((valid, values) => {
        if (!valid) {
          errors = { ...errors, ...values }
          flag = false
        }
      })
      this.$refs.ScrmProgress.$refs.SpreadUser.$refs.progressForm1.validate((valid, values) => {
        if (!valid) {
          errors = { ...errors, ...values }
          flag = false
        }
      })
      this.$refs.ScrmProgress.$refs.HelpUser.$refs.progressForm2.validate((valid, values) => {
        if (!valid) {
          errors = { ...errors, ...values }
          flag = false
        }
      })
      this.$refs.ScrmOther.$refs.otherForm.validate((valid, values) => {
        if (!valid) {
          errors = { ...errors, ...values }
          flag = false
        }
      })
      if (!flag) {
        this.showTip(errors)
      }
      return flag
    },
    /**
     * 弹出错误提示
     */
    showTip (errors) {
      const obj = errors
      const _this = this
      for (const i in obj) {
        (function (a) {
          setTimeout(() => {
            _this.$notification.error({
              key: 'key' + a,
              message: '更新错误',
              description: obj[a][0].message,
              placement: 'bottomRight',
              bottom: '50px'
            })
          }, 400 * i)
        })(i)
      }
    },
    /**
     * 获取表单数据
     * @param {*} type [all, basic, poster, progress, other]
     */
    getValue (type) {
      const form = {
        basic: this.$refs.ScrmBase.form,
        poster: this.$refs.ScrmBill.form,
        progress: { ...this.$refs.ScrmProgress.$refs.SpreadUser.form, ...this.$refs.ScrmProgress.$refs.HelpUser.form },
        other: this.$refs.ScrmOther.form
      }
      if (type === 'all') {
        return form
      } else {
        return form[type]
      }
    },
    /**
     * 是否选择公众号
     */
    isAppId () {
      const data = this.getValue('basic')
      if (data.mpId && (data.mpId + '').length > 0) {
        return true
      } else {
        return false
      }
    },
    /**
     * 获取活动详情
     */
    activityDetail () {
      const param = {
        id: this.$route.query.id
      }
      activityDetail(param).then(res => {
        this.id = res.data.id + ''
        this.isPublish = res.data.isPublish
        this.formatBasic(res.data)
        this.formatPoster(res.data)
        this.formatProgress(res.data)
        this.formatOther(res.data)
      })
    },
    /**
     * basic回显数据处理
     */
    formatBasic (data) {
      const { basic } = data
      this.$refs.ScrmBase.form = basic
      if (basic.startTime && basic.endTime) {
        const time = [moment(basic.startTime), moment(basic.endTime)]
        this.$set(this.$refs.ScrmBase.form, 'time', time)
      }
      this.$refs.ScrmBase.curLevel = basic.prizeList.length + ''
      this.$refs.ScrmBase.oldLevel = basic.prizeList.length + ''
      const arr = []
      const opts = []
      for (let i = 0; i < basic.prizeList.length; i++) {
        if (basic.prizeList[i].prizeId === 0) {
          basic.prizeList[i].prizeId = undefined
        } else {
          basic.prizeList[i].prizeId = basic.prizeList[i].prizeId + ''
        }
        if (basic.prizeList[i].zeroEnd === '1') {
          arr.push(i + '')
        }
        opts.push({
          label: `${this.numMap[i]}级奖品库存为0时`,
          value: i + ''
        })
      }
      this.$refs.ScrmBase.selOptions = arr
      this.$refs.ScrmBase.options = opts
      mpList().then(res => {
        const arr = res.data
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === basic.mpId + '') {
            this.$refs.ScrmBase.selAcc = arr[i]
          }
        }
      })
    },
    /**
     * poster回显数据处理
     */
    formatPoster (data) {
      const { poster } = data
      this.$refs.ScrmBill.form = {
        callbackKeyword: poster.callbackKeyword,
        posterUrl: poster.posterUrl,
        qrcodePosition: poster.qrcodePosition === '' ? '61.39x78.13' : poster.qrcodePosition,
        qrcodeSize: poster.qrcodeSize === '' ? '33.33x18.75' : poster.qrcodeSize,
        ruleDescribe: poster.ruleDescribe ? poster.ruleDescribe : this.$refs.ScrmBill.editOpt.content
      }
      this.$refs.ScrmBill.editOpt.content = poster.ruleDescribe ? poster.ruleDescribe : this.$refs.ScrmBill.editOpt.content
    },
    /**
     * progress回显数据处理
     */
    formatProgress (data) {
      const { progress } = data
      console.log('回显数据', progress)
      this.$refs.ScrmBase.createTab()
      this.$refs.ScrmProgress.$refs.SpreadUser.form = {
        helpText: progress.helpText ? progress.helpText : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt1.content,
        oneLevelCompleteTips: progress.oneLevelCompleteTips ? progress.oneLevelCompleteTips : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt2.content,
        twoLevelCompleteTips: progress.twoLevelCompleteTips ? progress.twoLevelCompleteTips : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt3.content,
        threeLevelCompleteTips: progress.threeLevelCompleteTips ? progress.threeLevelCompleteTips : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt4.content,
        endNewMemberText: progress.endNewMemberText ? progress.endNewMemberText : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt5.content,
        helpCancelText: progress.helpCancelText ? progress.helpCancelText : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt6.content,
        oneLevelPushImg: progress.oneLevelPushImg,
        twoLevelPushImg: progress.twoLevelPushImg,
        threeLevelPushImg: progress.threeLevelPushImg,
        oneLevelPushExchangeCode: progress.oneLevelPushExchangeCode,
        twoLevelPushExchangeCode: progress.twoLevelPushExchangeCode,
        threeLevelPushExchangeCode: progress.threeLevelPushExchangeCode,
        helpCancelInvalid: Number(progress.helpCancelInvalid)
      }
      this.$refs.ScrmProgress.$refs.SpreadUser.editOpt1.content = progress.helpText ? progress.helpText : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt1.content
      this.$refs.ScrmProgress.$refs.SpreadUser.editOpt2.content = progress.oneLevelCompleteTips ? progress.oneLevelCompleteTips : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt2.content
      this.$refs.ScrmProgress.$refs.SpreadUser.editOpt3.content = progress.twoLevelCompleteTips ? progress.twoLevelCompleteTips : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt3.content
      this.$refs.ScrmProgress.$refs.SpreadUser.editOpt4.content = progress.threeLevelCompleteTips ? progress.threeLevelCompleteTips : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt4.content
      this.$refs.ScrmProgress.$refs.SpreadUser.editOpt5.content = progress.endNewMemberText ? progress.endNewMemberText : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt5.content
      this.$refs.ScrmProgress.$refs.SpreadUser.editOpt6.content = progress.helpCancelText ? progress.helpCancelText : this.$refs.ScrmProgress.$refs.SpreadUser.editOpt6.content

      this.$refs.ScrmProgress.$refs.HelpUser.form = {
        helpSuccessText: progress.helpSuccessText ? progress.helpSuccessText : this.$refs.ScrmProgress.$refs.HelpUser.editOpt7.content,
        helpRepeatText: progress.helpRepeatText ? progress.helpRepeatText : this.$refs.ScrmProgress.$refs.HelpUser.editOpt7.content,
        newMemberInvalidText: progress.newMemberInvalidText ? progress.newMemberInvalidText : this.$refs.ScrmProgress.$refs.HelpUser.editOpt7.content,
        mustNewMember: Number(progress.mustNewMember)
      }
      this.$refs.ScrmProgress.$refs.HelpUser.editOpt7.content = progress.helpSuccessText ? progress.helpSuccessText : this.$refs.ScrmProgress.$refs.HelpUser.editOpt7.content
      this.$refs.ScrmProgress.$refs.HelpUser.editOpt8.content = progress.helpRepeatText ? progress.helpRepeatText : this.$refs.ScrmProgress.$refs.HelpUser.editOpt8.content
      this.$refs.ScrmProgress.$refs.HelpUser.editOpt9.content = progress.newMemberInvalidText ? progress.newMemberInvalidText : this.$refs.ScrmProgress.$refs.HelpUser.editOpt9.content
    },
    /**
     * other回显数据处理
     */
    formatOther (data) {
      const { other } = data
      this.$refs.ScrmOther.form = {
        noDisturbNumber: other.noDisturbNumber,
        noDisturbText: other.noDisturbText ? other.noDisturbText : this.$refs.ScrmOther.editOpt10.content,
        endText: other.endText ? other.endText : this.$refs.ScrmOther.editOpt11.content,
        endImg: other.endImg
      }
      this.$refs.ScrmOther.editOpt10.content = other.noDisturbText ? other.noDisturbText : this.$refs.ScrmOther.editOpt10.content
      this.$refs.ScrmOther.editOpt11.content = other.endText ? other.endText : this.$refs.ScrmOther.editOpt11.content
    }
  }
}
</script>

<style lang="less" scoped>
  .wrapper{
    width:100%;
    height:auto;
    display:flex;
    .fr{
      flex:1;
    }
    .fl{
      width:150px;
      background:#fff;
      &::after{
        position: absolute;
        left:30px;
        content:'';
        width:2px;
        background:#3470ff;
      }
      &.s1::after{
        top:0px;
        height:0px;
      }
      &.s2::after{
        top:80px;
        height:50px;
      }
      &.s3::after{
        top:80px;
        height:100px;
      }
      &.s4::after{
        top:80px;
        height:160px;
      }
      &::before{
        position: absolute;
        top:100px;
        left:30px;
        content:'';
        width:2px;
        height:150px;
        background:#ccc;
      }
      ul{
        width:auto;
        padding:30px 15px;
        position: absolute;
        z-index: 1;
        li{
          width:100%;
          height:50px;
          font-size:14px;
          text-align: left;
          cursor: pointer;
          i{
            width:30px;
            height:30px;
            display:inline-block;
            border:2px solid #3470ff;
            color:#3470ff;
            text-align: center;
            line-height:28px;
            border-radius: 50%;
            font-style:normal;
            margin-right:10px;
            background:#fff;
          }
        }
        li.active{
          color:#3470ff;
          i{
            background:#3470ff;
            color:#fff;
          }
        }
      }
    }
  }
</style>
