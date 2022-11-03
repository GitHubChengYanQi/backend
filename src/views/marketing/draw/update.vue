<template>
  <div>
    <a-card>
      <!--search-->
      <a-steps :current="active" class="steps" @change="onChange">
        <a-step v-for="item in nav" :key="item.key" :title="item.name" />
      </a-steps>
      <!--end search-->
      <!--table-->
      <Base ref="base" :data="record" v-show="active === 0"></Base>
      <Content ref="content" :data="record" v-show="active === 1"></Content>
      <Rule ref="rule" :state="state" :data="record" v-show="active === 2"></Rule>
      <!--end table-->
      <!--handel-->
      <div class="handle">
        <a-button type="default" v-if="active === 1 || active === 2" @click="prevFn">上一步</a-button>
        <a-button type="primary" v-if="active === 0 || active === 1" @click="nextFn">下一步</a-button>
        <a-button type="primary" v-if="active === 2" @click="onSubmit">保存</a-button>
      </div>
      <!--end handel-->
    </a-card>
  </div>
</template>

<script>
import { activityVideoInfoAdd, activityVideoInfoUpdate, activityVideoInfoDetail } from '@/api/marketing'
import Base from './components/base'
import Content from './components/content'
import Rule from './components/rule'
export default {
  name: 'DrawUpdate',
  components: {
    Base,
    Content,
    Rule
  },
  created () {
    this.id = this.$route.query.id
    this.state = this.$route.query.state
    if (this.id) {
      this.activityVideoInfoDetail()
    }
  },
  data () {
    return {
      id: '',
      state: '',
      loading: false,
      active: 0,
      nav: [
        {
          key: 0,
          name: '基础设置'
        }, {
          key: 1,
          name: '配置内容'
        }, {
          key: 2,
          name: '设置规则'
        }
      ],
      record: {}
    }
  },
  methods: {
    /**
     * 拉取活动详情
     */
    activityVideoInfoDetail () {
      this.loading = true
      const params = {
        id: this.id
      }
      activityVideoInfoDetail(params).then((res) => {
        this.loading = false
        this.record = res.data
      })
    },
    prevFn () {
      this.active--
    },
    nextFn () {
      this.active++
    },
    /**
     * 提交
     */
    onSubmit () {
      const flag = this.validateFn()
      if (flag) {
        const data = this.getData()
        delete data.date
        const param = this.formatData(data)
        if (this.id) {
          param.id = this.id
          activityVideoInfoUpdate(param).then(res => {
            this.$router.push({
              path: '/marketing/draw'
            })
          })
        } else {
          activityVideoInfoAdd(param).then(res => {
            this.$router.push({
              path: '/marketing/draw'
            })
          })
        }
      }
    },
    /**
     * 处理数据sort
     */
    formatData (data) {
      const arr = data.confList
      for (let i = 0; i < arr.length; i++) {
        arr[i].sort = i
        for (let j = 0; j < arr[i].questionList.length; j++) {
          arr[i].questionList[j].sort = j
          for (let k = 0; k < arr[i].questionList[j].answerList.length; k++) {
            arr[i].questionList[j].answerList[k].sort = k
          }
        }
      }
      return data
    },
    /**
     * 校验数据
     */
    validateFn () {
      let flag = true
      let errors = {}
      this.$refs.base.$refs.baseForm.validate((valid, values) => {
        if (!valid) {
          errors = { ...errors, ...values }
          flag = false
        }
      })
      this.$refs.content.$refs.contentForm.validate((valid, values) => {
        if (!valid) {
          errors = { ...errors, ...values }
          flag = false
        }
      })
      this.$refs.rule.$refs.ruleForm.validate((valid, values) => {
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
     * 获取数据
     */
    getData () {
      const data = { ...this.$refs.base.form, ...this.$refs.content.form, ...this.$refs.rule.form }
      return data
    },
    /**
     * 切换进度
     */
    onChange (e) {
      this.active = e
    }
  }
}
</script>

<style lang="less" scoped>
  .steps{
    width:100%;
    margin:20px auto 40px;
  }
  .handle{
    width:100%;
    text-align: center;
    margin-top:40px;
    button{
      margin-right:20px;
    }
  }
</style>
