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
            <LabelSelect v-model="form.label" :addState="true" style="width:400px" />
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
            <clientAttr v-model="form.clientAttr" v-if="ruleShow" />
          </div>
          <!-- end 设置打标签规则 -->

          <!-- 消费属性 -->
          <div class="item">
            <div class="label">
              <span class="necessary">*</span> 消费属性：
              <a-tooltip placement="right">
                <template slot="title">
                  <span>
                    1.购买次数按下单次数计算<br />
                    2.选择多个商品时，按同一类商品，计算购买次数、商品金额、商品数量和购买时间。
                  </span>
                </template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </div>
            <a-radio-group v-model="goodShow" @change="onGoodChange">
              <a-radio :value="1">
                不限商品
              </a-radio>
              <a-radio :value="2">
                选择商品
              </a-radio>
            </a-radio-group>
            <div v-if="goodShow === 2">
              <GoodsSelect v-model="form.goods" />
            </div>
            <goodsAttr v-model="form.expendAttr" />
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
    <!--modal-->
    <a-modal
      title="规则验证"
      class="modalBox"
      @cancel="handleCancel"
      :footer="null"
      :visible="visible"
    >
      <p>默认客户属性满足要求</p>
      <div class="content">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="购买时间" required prop="date1">
            <a-date-picker
              v-model="form.date"
              show-time
              type="date"
              placeholder="Pick a date"
              style="width: 100%;"
            />
          </a-form-model-item>
          <a-form-model-item label="购买次数" prop="name">
            <a-input v-model="form.name" suffix="次" />
          </a-form-model-item>
          <a-form-model-item label="商品金额" prop="name">
            <a-input v-model="form.name" suffix="元" />
          </a-form-model-item>
          <a-form-model-item label="商品数量" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
        </a-form-model>
        <p>已按照您设置的规则进行验证，验证结果为：</p>
        <p class="result">
          <span class="success">标签添加成功!</span>
          <span class="warn">标签添加失败!</span>
        </p>
      </div>
      <div class="handle">
        <a-button type="primary" @click="handleOk">点击验证</a-button>
      </div>
    </a-modal>
    <!--end modal-->
  </div>
</template>

<script>
import LabelSelect from '../../components/SelectLabel/index.vue'
import GoodsSelect from '../../components/SelectGoods/index.vue'
import clientAttr from './expendComponents/clientAttr'
import goodsAttr from './expendComponents/goodsAttr'
import { getDict } from '@/api/common.js'
import { isObjectValueEqual } from '@/utils/util'

export default {
  components: { LabelSelect, clientAttr, GoodsSelect, goodsAttr },
  data () {
    return {
      id: '',
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      labelShow: false,
      ruleShow: true,
      goodShow: 1, // 1=不限商品 2=选择商品
      visible: false,
      form: {
        name: '',
        label: [], // 规则标签
        clientAttr: [], // 客户属性
        goodsAttr: [], // 商品
        expendAttr: [] // 消费属性
      },
      valiForm: {
        date: '',
        num: '',
        price: '',
        order: ''
      }
    }
  },
  watch: {},
  created () {
    this.id = this.$route.query.id
  },
  methods: {
    isObjectValueEqual,
    /**
     * 返回列表，判断是否有操作
     */
    returnPage () {
      try {
        const state = true
        // if () {
        //   state = false
        // }
        if (state) {
          this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.id}`)
        } else {
          this.$confirm({
            title: '提示',
            content: '退出后无法保存',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.id}`)
            },
            onCancel () {}
          })
        }
      } catch (error) {

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
      console.log('保存', this.form)
      this.visible = true
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
     * 开启商品选择
     */
    onGoodChange (e) {
      console.log(111111, e.target.value)
      this.goodShow = e.target.value
    },
    /**
     * 验证
     */
    handleOk () {
      this.visible = false
    },
    /**
     * 关闭验证
     */
    handleCancel () {
      this.visible = false
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
          margin-bottom:10px;
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
.modalBox{
  .result{
    font-size:17px;
    .success{
      color:#00cb35;
    }
    .warn{
      color:#ff0000;
    }
  }
  .handle{
    text-align: center;
  }
}
</style>
