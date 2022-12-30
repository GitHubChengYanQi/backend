<template>
  <div class="add_rule">
    <!-- 返回蒙层 -->
    <div
      class="back"
      @click="returnPage"
    ></div>
    <!-- 内容 -->
    <a-card>
      <div class="add_rule_box">
        <div class="title">{{ id.length == 0 ?'新建':'编辑' }}消费属性打标签</div>
        <div class="content">
          <!-- 规则名称 -->
          <div class="item">
            <span class="label"><span>*</span> 规则名称： </span>
            <a-input
              style="width: 400px; height: 36px"
              placeholder="请填写规则名称，仅内部可见"
              v-model="form.name"
            ></a-input>
          </div>
          <!-- end 规则名称 -->

          <!-- 选择标签 -->
          <div class="item">
            <div class="label"><span>*</span> 选择标签： </div>
            111111
          </div>
          <!-- end 选择标签 -->

          <!-- 设置打标签规则 -->
          <div class="item">
            <div class="label">
              <span class="necessary">*</span> 设置打标签规则：
              <a-tooltip placement="right">
                <template slot="title">
                  <span>且：多个条件需要被同时满足才会被打上标签，<br />
                    或：多个条件只要满足其中一个条件会被打上标签。</span>
                </template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </div>
            <div class="tip">注：客户属性与消费属性同时勾选时，客户需要同时满足客户属性条件与消费属性条件才会被打上标签。</div>
            <a-checkbox @change="onChange" :checked="ruleShow">
              客户属性
            </a-checkbox>
            <div v-if="ruleShow">
              11111111
            </div>
          </div>
          <!-- end 设置打标签规则 -->

          <!-- 消费属性 -->
          <div class="item">
            <div class="label">
              <span class="necessary">*</span> 消费属性：
              <a-tooltip placement="right">
                <template slot="title">
                  <span>且：多个条件需要被同时满足才会被打上标签，<br />
                    或：多个条件只要满足其中一个条件会被打上标签。</span>
                </template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </div>
            <a-radio-group v-model="goodShow" @change="onChange">
              <a-radio :value="1">
                不限商品
              </a-radio>
              <a-radio :value="2">
                选择商品
              </a-radio>
            </a-radio-group>
            <div v-if="ruleShow">
              11111111
            </div>
          </div>
          <!-- end 消费属性 -->

        </div>
      </div>
      <div class="handle">
        <a-button
          type="primary"
          @click="addRule()"
        >验证</a-button>
        <a-button
          type="primary"
          @click="addRule()"
        >保存</a-button>
        <a-button
          type="primary"
          @click="addRule()"
        >保存并创建跟客任务</a-button>
      </div>
    </a-card>
    <!-- 选择标签 -->
    <label-select
      :state="labelShow"
      :addState="true"
      ref="labelSelect"
    />
  </div>
</template>

<script>
import LabelSelect from './components/LabelSelect'
import SvgIcon from './components/SvgIcon.vue'
import { getDict, ossUpload } from '@/api/common.js'

export default {
  components: { 'svg-icon': SvgIcon, 'label-select': LabelSelect },
  data () {
    return {
      id: '',
      labelShow: true,
      ruleShow: true,
      goodShow: 1, // 1=不限商品 2=选择商品
      form: {
        name: ''
      }
    }
  },
  watch: {},
  created () {
    this.id = this.$route.query.id
    this.test()
  },
  methods: {
    /**
     * 上传测试
     */
    test () {
      const data = {
        OSSAccessKeyId: 'LTAIAX24MUz7rbXu',
        policy: 'eyJleHBpcmF0aW9uIjoiMjAyMi0xMi0yOVQwODozMjowNS4yMTRaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJ1cGxvYWQvMTY3MjMwMjY5NTIxNDIxMzg4MC5tcDQiXV19',
        Signature: 'qAMm18Ez4f/wOpz3lHUt5PNrJWs=',
        key: 'upload/1672302695214213880.mp4',
        host: 'https://yfscrm.oss-cn-beijing.aliyuncs.com',
        expire: 1672302725
      }
      ossUpload(data).then(res => {
        console.log(111, res)
      })
    },
    /**
     * 返回列表，判断是否有操作
     */
    returnPage () {
      let state = true
      if (this.input.length > 0 || this.dateRule.length > 0) {
        state = false
      }
      if (state) {
        this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.table}`)
      } else {
        this.$confirm({
          title: '提示',
          content: '退出后无法保存',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.table}`)
          },
          onCancel () {}
        })
      }
    },
    /**
     * 设置且或
     * @param {*} e
     */
    setRelation (e) {
      this.relationState = e
    },
    /**
     * 保存
     */
    addRule () {
      console.log('保存')
    },
    /**
     * 拉取字典
     * @param {*} e
     * @param {*} key
     */
    getSelectData (e, key) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        console.log(res)
        this[key] = res.data.map((item) => {
          item.label = item.name
          item.value = item.code
          return item
        })
        if (key == 'relationData') {
          this.relationState = this[key][0].value
        }
      })
    },
    /**
     * 开启客户属性规则
     * @param {*} e
     */
    onChange (e) {
      this.ruleShow = e.target.checked
    },
    /**
     * 标签选择回调
     */
    transmitLabel (e) {
      console.log(1111, e)
    },
    /**
     * 标签关闭回调
     * @param {*} e
     */
    showBox (e) {
      if (e === -1) {
        this.labelShow = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.add_rule {
  position: relative;
  width: 100%;

  .back {
    cursor: pointer;
    position: absolute;
    top: -40px;
    left: 0;
    z-index: 100;
    width: 70px;
    height: 30px;
  }

  .add_rule_box {
    display: flex;
    flex-direction: column;
    .title {
      font-size: 15px;
      line-height: 21px;
      color: rgba(0, 0, 0, 0.85);
      border-bottom: 1px solid #f1f1f1;
      padding-bottom: 16px;
      margin-bottom: 16px;
      position: relative;
    }
    .content{
      .item{
        margin-bottom:20px;
        .label{
          span{
            color:#ff0000;
          }
        }
        .tip{
          color:#ff0000;
          margin:10px auto;
        }
      }
    }
  }
  .handle {
    margin-top: 60px;
    button{
      margin-right:10px;
    }
  }
}
</style>
