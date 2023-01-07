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
          <a-form-model
            ref="name"
            :model="form"
            :rules="formRules"
          >
            <!-- 规则名称 -->
            <a-form-model-item label="规则名称" prop="name">
              <a-input
                style="width: 400px; height: 36px"
                placeholder="请填写规则名称，仅内部可见"
                v-model="form.name"
                :maxLength="30"
                :suffix="`${form.name.length}/30`"
              ></a-input>
            </a-form-model-item>
            <!-- end 规则名称 -->
            <!-- 选择标签 -->
            <a-form-model-item label="选择标签" prop="labelIdGroup">
              <!-- <input v-model="form.labelIdGroup" /> -->
              <LabelSelect v-model="form.labelIdGroup" :addState="true" style="width:400px" />
            </a-form-model-item>
            <!-- end 选择标签 -->
          </a-form-model>

          <!-- 选择标签 -->
          <!-- <div class="item">
            <div class="label"><span>*</span> 选择标签： </div>
            <LabelSelect v-model="form.labelIdGroup" :addState="true" style="width:400px" />
          </div> -->
          <!-- end 选择标签 -->

          <!-- 设置打标签规则 -->
          <div class="item">
            <div class="label">
              设置打标签规则：
              <a-tooltip placement="right">
                <template slot="title">
                  <span>且：多个条件需要被同时满足才会被打上标签，<br />
                    或：多个条件只要满足其中一个条件会被打上标签。</span>
                </template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </div>
            <div class="tip">注：客户属性与消费属性同时勾选时，客户需要同时满足客户属性条件与消费属性条件才会被打上标签。</div>
            <a-checkbox @change="onChange" :checked="form.customerAttributeSelect === '1' ? true : false">
              客户属性
            </a-checkbox>
            <clientAttr v-model="form.customerRule" v-if="form.customerAttributeSelect === '1'" @relation="(e) => {getRelation(e, 'client')}" />
          </div>
          <!-- end 设置打标签规则 -->

          <!-- 消费属性 -->
          <div class="item">
            <div class="label">
              消费属性：
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
            <a-radio-group v-model="form.goodBounds" @change="onGoodChange">
              <a-radio :value="item.code" v-for="item in goodBounds" :key="item.code">
                {{ item.name }}
              </a-radio>
            </a-radio-group>
            <div v-if="form.goodBounds === '1'">
              <GoodsSelect v-model="form.erpGoodIds" />
            </div>
            <goodsAttr v-model="form.consumeRule" @relation="(e) => {getRelation(e, 'goods')}" />
          </div>
          <!-- end 消费属性 -->

        </div>
      </div>
      <div class="handle">
        <a-button
          :loading="loading"
          @click="openValid()"
        >验证</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="addRule()"
        >保存</a-button>
        <a-button
          type="primary"
          :loading="loading"
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
          :model="valiForm"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="购买时间" prop="">
            <a-date-picker
              v-model="valiForm.purchase_time"
              type="date"
              placeholder="请选择"
              style="width: 100%;"
            />
          </a-form-model-item>
          <a-form-model-item label="购买次数" prop="">
            <a-input v-model="valiForm.purchase_number" suffix="次" />
          </a-form-model-item>
          <a-form-model-item label="商品金额" prop="">
            <a-input v-model="valiForm.good_amount" suffix="元" />
          </a-form-model-item>
          <a-form-model-item label="商品数量" prop="">
            <a-input v-model="valiForm.good_number" />
          </a-form-model-item>
        </a-form-model>
        <p>已按照您设置的规则进行验证，验证结果为：</p>
        <p class="result">
          <span class="success">标签添加成功!</span>
          <span class="warn">标签添加失败!</span>
        </p>
      </div>
      <div class="handle">
        <a-button type="primary" @click="handleValid">点击验证</a-button>
      </div>
    </a-modal>
    <!--end modal-->
  </div>
</template>

<script>
import moment from 'moment'
import LabelSelect from '../../components/SelectLabel/index.vue'
import GoodsSelect from '../../components/SelectGoods/index.vue'
import clientAttr from './expendComponents/clientAttr'
import goodsAttr from './expendComponents/goodsAttr'
import { getDict } from '@/api/common.js'
import { isObjectValueEqual, deepClonev2 } from '@/utils/util'
import {
  consumeAutoLabelAdd,
  consumeAutoLabelDetail,
  consumeAutoLabelUpdate,
  consumeAutoLabelValidRule
} from '@/api/clientFollow.js'

export default {
  components: { LabelSelect, clientAttr, GoodsSelect, goodsAttr },
  data () {
    return {
      loading: false,
      id: '', // 类别
      label: '', // id
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      labelShow: false,
      goodBounds: [],
      visible: false,
      form: {
        name: '',
        labelIdGroup: [], // 规则标签
        customerAttributeSelect: '0', // 是否包含客户属性
        customerAttributeRef: 'and', // 客户属性关系
        customerRule: [], // 客户属性
        goodBounds: '0', // 是否限制商品
        erpGoodIds: [], // 商品
        consumeAttributeRef: 'and', //消费属性关系
        consumeRule: [] // 消费属性
      },
      valiForm: {
        purchase_time: '',
        purchase_number: '',
        good_amount: '',
        good_number: ''
      },
      formRules: {
        name: [
          { required: true, message: '请填规则名称', trigger: 'blur' }
        ],
        labelIdGroup: [
          { required: true, message: '请选择标签', trigger: 'change' }
        ]
      },
      rules: {}
    }
  },
  watch: {},
  created () {
    this.id = this.$route.query.id
    this.label = this.$route.query.label
    this.getDict('good_bounds')
    this.getDetail()
  },
  methods: {
    deepClonev2,
    isObjectValueEqual,
    /**
     * 返回列表，判断是否有操作
     */
    returnPage () {
      try {
        let state = true
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
     * 获取详情
     */
    getDetail () {
      if (this.label && this.label.length > 0) {
        const param = {
          id: this.label
        }
        consumeAutoLabelDetail(param).then(res => {
          this.form = this.formatData(res.data)
        })
      }
    },
    /**
     * 回显数据格式化
     */
    formatData (data) {
      const arr = data //this.deepClonev2(data)
      // 格式化时间段
      for (let i = 0; i < arr.consumeRule.length; i++) {
        if (arr.consumeRule[i].columnName === 'purchase_time') {
          arr.consumeRule[i].val = (arr.consumeRule[i].val).split(',')
        }
      }
      return arr
    },
    /**
     * 保存
     */
    addRule () {
      this.loading = true
      if (this.label && this.label.length > 0) {
        console.log('编辑')
        const param = {
          id: this.label,
          ...this.formatSaveData()
        }
        consumeAutoLabelUpdate(param).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.id}`)
          }
        })
      } else {
        console.log('创建')
        const param = {
          ...this.formatSaveData()
        }
        consumeAutoLabelAdd(param).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.id}`)
          }
        })
      }
    },
    /**
     * 提交数据格式化
     */
    formatSaveData () {
      let data = this.deepClonev2(this.form)
      // 标签
      let labels = []
      for (let i = 0; i < data.labelIdGroup.length; i++) {
        labels.push(data.labelIdGroup[i].id)
      }
      data.labelIdGroup = labels.join(',')
      // 消费属性规则
      for (let i = 0; i < data.consumeRule.length; i++) {
        data.consumeRule[i].sort = i
        if (data.consumeRule[i].columnName === 'purchase_time') {
          data.consumeRule[i].val = (data.consumeRule[i].val).join(',')
        }
      }
      // 客户属性规则
      for (let i = 0; i < data.customerRule.length; i++) {
        const arr = data.customerRule[i].val
        let res = []
        data.customerRule[i].sort = i
        for (let j = 0; j < arr.length; j++) {
          res.push(arr[j].id)
        }
        data.customerRule[i].val = res.join(',')
      }
      // 商品
      let goods = []
      for (let i = 0; i < data.erpGoodIds.length; i++) {
        goods.push(data.erpGoodIds[i].id)
      }
      data.erpGoodIds = goods.join(',')
      return data
    },
    /**
     * 拉取字典
     * @param {*} e
     */
    getDict (e) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        if (e === 'good_bounds') {
          this.goodBounds = res.data
        }
      })
    },
    /**
     * 开启客户属性规则
     * @param {*} e
     */
    onChange (e) {
      if (e.target.checked) {
        this.form.customerAttributeSelect = '1'
      } else {
        this.form.customerAttributeSelect = '0'
        this.form.customerRule = []
      }
    },
    /**
     * 开启商品选择
     */
    onGoodChange (e) {
      this.form.goodBounds = e.target.value
    },
    /**
     * 打开验证窗口
     */
    openValid () {
      this.visible = true
    },
    /**
     * 关闭验证窗口
     */
    handleCancel () {
      this.visible = false
    },
    /**
     * 验证
     */
    handleValid () {
      const param = {
        ...this.valiForm
      }
      console.log(11111, param)
      consumeAutoLabelValidRule(param).then(res => {
        console.log(11111, res)
      })
    },
    /**
     * 客户属性关系回调
     */
    getRelation (e, type) {
      if (type === 'client') {
        this.form.customerAttributeRef = e
      } else {
        this.form.consumeAttributeRef = e
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
        margin-bottom:30px;
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
