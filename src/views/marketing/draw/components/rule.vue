<template>
  <div>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="奖励机会获得" prop="name"></a-form-model-item>

      <a-form-model-item label="" :prop="item + index" v-for="(item, index) in form.rewardList" :key="index">
        <a-row v-if="item.type==='1'">
          <a-col :span="4"></a-col>
          <a-col :span="20" class="item">
            <a-checkbox :checked="item.isOpen==='1' ? true : false" @change="change(item)" :disabled="state!=='1'&&state!==''"></a-checkbox>
            <span>每天单个视频观看结束，且正确回答对应的全部问题 1 次，获得</span>
            <span><a-input-number :min="0" :precision="0" v-model="item.rewardTimes" :disabled="(state!=='1'&&state!=='') || !item.isOpen || item.isOpen==='0'" type="number"></a-input-number></span>
            <span>次获奖机会</span>
          </a-col>
          <a-col :span="4"></a-col>
          <a-col :span="20" class="item"><p>（注：每天每条视频仅首次完成答题可以获得获奖机会）</p></a-col>
        </a-row>
        <a-row v-if="item.type==='2'">
          <a-col :span="4"></a-col>
          <a-col :span="20" class="item">
            <a-checkbox :checked="item.isOpen==='1' ? true : false" @change="change(item)" :disabled="state!=='1'&&state!==''"></a-checkbox>
            <span>每天分享的链接被好友点击1 次，获得</span>
            <span><a-input-number :min="0" :precision="0" v-model="item.rewardTimes" type="number" :disabled="(state!=='1'&&state!=='') || !item.isOpen || item.isOpen==='0'"></a-input-number></span>
            <span>次获奖机会</span>
          </a-col>
          <a-col :span="4"></a-col>
          <a-col :span="20" class="item"><p>（注：每人每天只能获得同一个好友的一次点击助力奖励）</p></a-col>
        </a-row>
        <a-row v-if="item.type==='3'">
          <a-col :span="4"></a-col>
          <a-col :span="20" class="item">
            <a-checkbox :checked="item.isOpen==='1' ? true : false" @change="change(item)" :disabled="state!=='1'&&state!==''"></a-checkbox>
            <span>每天好友通过助力观看视频且答题正确1次，获得</span>
            <span><a-input-number :min="0" :precision="0" v-model="item.rewardTimes" type="number" :disabled="(state!=='1'&&state!=='') || !item.isOpen || item.isOpen==='0'"></a-input-number></span>
            <span>次获奖机会</span>
          </a-col>
          <a-col :span="4"></a-col>
          <a-col :span="20" class="item"><p>（注：每天每个好友单个视频仅能助力一次）</p></a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="配置地址" prop="location">
        <div class="item">
          <a-input v-model="form.location" :disabled="state!=='1'&&state!==''" />
        </div>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'Rule',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    state: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading: false,
      disabled: false,
      addDisbled: false,
      form: {
        rewardList: [
          {
            type: '1',
            conditionTimes: '0'
          },
          {
            type: '2',
            conditionTimes: '0'
          },
          {
            type: '3',
            conditionTimes: '0'
          }
        ],
        location: ''
      },
      rules: {
        location: [{ required: true, message: '请输入配置地址', trigger: 'change' }]
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        if (JSON.stringify(val) !== '{}') {
          this.form.rewardList = val.rewardList
          this.disabled = true
        }
        this.form.location = val.location
      }
    }
  },
  methods: {
    /**
     * 获取字典
     */
    // getDict () {
    //   getDict({ dictType: 'video_activity_reward' }).then(res => {
    //     this.statusList = res.data
    //   })
    // },
    change (item) {
      if (item.isOpen === '1') {
        this.$set(item, 'isOpen', '0')
      } else {
        this.$set(item, 'isOpen', '1')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  h2{
    font-size:18px;
    i{
      margin-right:10px;
      cursor:pointer;
    }
  }
  .head{
    .fl{
      span{
        margin-right:10px;
      }
    }
  }
  .item{
    input{
      width:200px;
      float:left;
    }
    span{
      flex:1;
      margin-left:20px;
      line-height:40px;
    }
    p{
      width:100%;
      text-indent:40px;
      margin:0;
      padding:0;
    }
  }
</style>
