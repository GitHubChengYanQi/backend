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
            <div class="label">
              <span>*</span> 规则名称：
            </div>
            <a-input
              style="width: 500px; height: 36px"
              placeholder="请填写规则名称，仅内部可见"
              v-model="form.name"
              :maxLength="30"
              :suffix="`${form.name.length}/30`"
            ></a-input>
          </div>
          <!-- end 规则名称 -->

          <!-- 选择标签 -->
          <div class="item">
            <div class="label">
              <span>*</span> 选择标签：
            </div>
            <LabelSelect v-model="form.labelIdGroup" :addState="true" style="width:500px;" />
          </div>
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
            <clientAttr v-model="form.customerRule" :customerAttributeRef="form.customerAttributeRef" v-if="form.customerAttributeSelect === '1'" @relation="(e) => {getRelation(e, 'client')}" />
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
            <goodsAttr v-model="form.consumeRule" :consumeAttributeRef="form.consumeAttributeRef" @relation="(e) => {getRelation(e, 'goods')}" />
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
          @click="addRule('save')"
        >保存</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="addRule('task')"
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
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item v-for="(item, index) in valiForm.consumeRuleVal" :key="index" :label="valMap[item.columnName]">
            <a-date-picker
              v-model="item.val"
              type="date"
              placeholder="请选择"
              valueFormat="YYYY-MM-DD"
              style="width: 100%;"
              v-if="item.columnName === 'purchase_time'"
            />
            <a-input v-model="item.val" v-if="item.columnName === 'purchase_number'" suffix="次" />
            <a-input v-model="item.val" v-if="item.columnName === 'good_amount'" suffix="元" />
            <a-input v-model="item.val" v-if="item.columnName === 'good_number'" />
          </a-form-model-item>
        </a-form-model>
        <p>已按照您设置的规则进行验证，验证结果为：</p>
        <p class="result">
          <span class="success" v-if="validateRes === 1">标签添加成功!</span>
          <span class="warn" v-if="validateRes === 0">标签添加失败!</span>
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
import { mapGetters } from 'vuex'

export default {
  components: { LabelSelect, clientAttr, GoodsSelect, goodsAttr },
  computed: {
    ...mapGetters([
      'permissionList'
    ])
  },
  data () {
    return {
      loading: false,
      btnShow: false,
      id: '', // 类别
      label: '', // id
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      labelShow: false,
      goodBounds: [],
      visible: false,
      validateRes: 2,
      form: {
        name: '',
        labelIdGroup: [], // 规则标签
        customerAttributeSelect: '0', // 是否包含客户属性
        customerAttributeRef: 'and', // 客户属性关系
        customerRule: [], // 客户属性
        goodBounds: '0', // 是否限制商品
        erpGoodIds: [], // 商品
        consumeAttributeRef: 'and', // 消费属性关系
        consumeRule: [] // 消费属性
      },
      valiForm: {
        consumeRuleVal: []
      },
      valMap: {
        'purchase_time': '购买时间',
        'purchase_number': '购买次数',
        'good_amount': '商品金额',
        'good_number': '商品数量'
      }
    }
  },
  watch: {},
  created () {
    this.id = this.$route.query.id
    this.label = this.$route.query.label
    this.getDict('good_bounds')
    this.getDetail()
    // 根据sop权限判断是否显示按钮“保存并创建跟客任务”
    const permissinon = this.permissionList[0].routes
    if (permissinon.indexOf('/sales/sop') > -1) {
      this.btnShow = true
    } else {
      this.btnShow = false
    }
  },
  methods: {
    deepClonev2,
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
      const arr = data // this.deepClonev2(data)
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
    addRule (type) {
      if (this.label && this.label.length > 0) {
        // console.log('编辑')
        const flag = this.validateFn(this.formatSaveData())
        if (flag) {
          this.loading = true
          const param = {
            id: this.label,
            ...this.formatSaveData()
          }
          consumeAutoLabelUpdate(param).then(res => {
            this.loading = false
            if (res.code === 200) {
              if (type === 'save') {
                this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.id}`)
              } else {
                if (this.btnShow) {
                  sessionStorage.setItem('activeType', 'Regular')
                  this.$router.push('/sales/sop')
                } else {
                  this.$message.error('暂无创建sop权限，可联系管理员开通此权限。')
                }
              }
            }
          }).catch(err => {
            this.loading = false
          })
        }
      } else {
        // console.log('创建')
        const flag = this.validateFn(this.formatSaveData())
        if (flag) {
          this.loading = true
          const param = {
            ...this.formatSaveData()
          }
          consumeAutoLabelAdd(param).then(res => {
            this.loading = false
            if (res.code === 200) {
              if (type === 'save') {
                this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.id}`)
              } else {
                if (this.btnShow) {
                  sessionStorage.setItem('activeType', 'Regular')
                  this.$router.push('/sales/sop')
                } else {
                  this.$message.error('暂无创建sop权限，可联系管理员开通此权限。')
                }
              }
            }
          }).catch(err => {
            this.loading = false
          })
        }
      }
    },
    /**
     * 保存校验
     */
    validateFn (data) {
      if (data.name === '') {
        this.$message.error('请输入规则名称')
        return false
      }
      if (data.labelIdGroup.length === 0) {
        this.$message.error('请至少选择一个标签')
        return false
      }
      if (data.customerAttributeSelect === '1') {
        for (let i = 0; i < data.customerRule.length; i++) {
          const item = data.customerRule[i]
          if (!item.judgmentConditions || !item.val) {
            this.$message.error('请选择客户属性')
            return false
          }
        }
      }
      if (data.goodBounds === '1' && data.erpGoodIds.length === 0) {
        this.$message.error('请选择商品')
        return false
      }
      for (let i = 0; i < data.consumeRule.length; i++) {
        const item = data.consumeRule[i]
        if (!item.columnName || !item.judgmentConditions || !item.val) {
          this.$message.error('请输入消费属性')
          return false
        }
      }
      return true
    },
    /**
     * 提交数据格式化
     */
    formatSaveData () {
      const data = this.deepClonev2(this.form)
      // 标签
      const labels = []
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
        const res = []
        data.customerRule[i].sort = i
        for (let j = 0; j < arr.length; j++) {
          res.push(arr[j].id)
        }
        data.customerRule[i].val = res.join(',')
      }
      // 商品
      const goods = []
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
      const data = this.formatSaveData()
      // 检验属性数据
      for (let i = 0; i < data.consumeRule.length; i++) {
        const item = data.consumeRule[i]
        if (!item.columnName || !item.judgmentConditions || !item.val) {
          this.$message.error('请输入消费属性')
          return false
        }
      }
      // 打开表单，生成表单数据
      this.visible = true
      let res = []
      for (let i = 0; i < data.consumeRule.length; i++) {
        res.push(data.consumeRule[i].columnName)
      }
      res = Array.from(new Set(res))
      const arr = []
      for (let i = 0; i < res.length; i++) {
        arr.push({
          columnName: res[i],
          val: undefined
        })
      }
      this.valiForm.consumeRuleVal = arr
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
      const data = this.formatSaveData() // 规则数据
      const arr = this.valiForm.consumeRuleVal // 验证数据
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].val) {
          this.$message.error(`请输入${this.valMap[arr[i].columnName]}`)
          return false
        }
      }
      this.loading = true
      const param = {
        consumeAttributeRef: data.consumeAttributeRef,
        consumeRule: data.consumeRule,
        ...this.valiForm
      }
      consumeAutoLabelValidRule(param).then(res => {
        this.loading = false
        this.validateRes = res.data
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
