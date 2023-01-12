<template>
  <div>
    <a-card>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="name" label="联合用药名称" prop="name">
          <a-input
            :disabled="id.length > 0 ? true : false"
            v-model="form.name"
            :maxLength="15"
            :suffix="`${form.name.length}/15`"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="选择分类" prop="symptomDiseaseClassifyId">
          <disease-cascader placeholder="请选择疾病分类" @change="onChange" v-model="form.symptomDiseaseClassifyId" />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-textarea disabled v-model="salesGuidance"></a-textarea>
        </a-form-model-item>

        <a-form-model-item label="设置主药及辅药">
          <a-button @click="addDrug" type="primary">添加辅助用药</a-button>
        </a-form-model-item>

        <a-form-model-item class="drugItem">
          <template slot="label"><span class="formTitle"></span>主药</template>
          <selectDrug :data="form.mainDrug" :drug="drugList"></selectDrug>
        </a-form-model-item>

        <a-form-model-item class="drugItem" v-for="(item,index) in form.adjuvants" :key="index">
          <template slot="label"><span class="formTitle"></span>{{ `辅助用药${numMap[index+1]}` }}</template>
          <a-button class="del" type="danger" @click="delFn(index)">删除</a-button>
          <selectDrug :data="item.drugs" :drug="drugList"></selectDrug>
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button @click="resetForm">
            取消
          </a-button>
          <a-button type="primary" style="margin-left: 10px;" @click="onSubmit">
            保存
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import { combinDetail, searchSalesGuidance, getCommonNameList, combinUpdate, combinAdd } from '@/api/mall'
import diseaseCascader from './diseaseCascader'
import selectDrug from './selectDrug.vue'
import { deepClonev2 } from '@/utils/util'
export default {
  components: {
    selectDrug,
    diseaseCascader
  },
  data () {
    return {
      id: '',
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      otherList: [{}],
      drugList: [],
      salesGuidance: '',
      form: {
        name: '',
        symptomDiseaseClassifyId: undefined,
        mainDrug: [], // 主药
        adjuvants: [] // 辅药
      },
      rules: {
        name: [
          { required: true, message: '请填写联合用药名称', trigger: 'blur' }
        ],
        symptomDiseaseClassifyId: [
          { required: true, message: '请选择疾病分类', trigger: 'select' }
        ]
      },
      numMap: {
        1: 'A',
        2: 'B',
        3: 'C',
        4: 'D',
        5: 'E',
        6: 'F',
        7: 'G',
        8: 'H',
        9: 'I',
        10: 'J'
      }
    }
  },
  mounted () {
    if (this.$route.query.combinedId) {
      this.id = this.$route.query.combinedId
      this.getCombined(this.id)
    }
    this.getCommonNameList()
  },
  watch: {
    '$route.query.combinedId': {
      handler (newVal) {
        if (newVal) {
          this.id = newVal
          this.getCombined(this.id)
          this.getCommonNameList()
        }
      }
    },
    deep: true
  },
  methods: {
    deepClonev2,
    /**
     * 获取通用名列表
     * @param {*} id
     */
    getCommonNameList (name) {
      const param = {
        name
      }
      getCommonNameList(param).then(res => {
        this.drugList = res.data
      })
    },
    /**
     * 获取用药推荐
     * @param {*} id
     */
    searchSalesGuidance (id) {
      const param = {
        id
      }
      searchSalesGuidance(param).then(res => {
        this.salesGuidance = res.data.salesGuidance
      }).catch(() => {
        this.salesGuidance = ''
      })
    },
    /**
     * 获取联合用药详情
     * @param {*} id
     */
    getCombined (id) {
      const param = {
        id
      }
      combinDetail(param).then(res => {
        this.form = res.data
        this.searchSalesGuidance(this.form.symptomDiseaseClassifyId)
      })
    },
    /**
     * 选择分类回调
     */
    onChange (e) {
      this.form.symptomDiseaseClassifyId = e
      this.searchSalesGuidance(e)
    },
    addDrug () {
      const len = this.form.adjuvants.length
      if (len === 10) {
        this.$message.error('只能添加10条数据')
      } else {
        this.form.adjuvants.push({
          drugs: [],
          group: ''
        })
      }
    },
    delFn (index) {
      this.$confirm({
        title: '确定删除?',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          this.form.adjuvants.splice(index, 1)
          // const len = this.form.adjuvants.length
          // if (len === 1) {
          //   this.$message.error('至少保留一条数据！')
          // } else {
          //   this.form.adjuvants.splice(index, 1)
          // }
        }
      })
    },
    /**
     * 重新计算序号
     */
    countIndex () {
      const arr = this.form.adjuvants
      for (let i = 0; i < arr.length; i++) {
        arr[i].group = this.numMap[i + 1]
      }
    },
    /**
     * 校验辅药
     * type: main=主药; adjuvants=辅药
     */
    validateFn (type) {
      if (type === 'adjuvants') {
        const arr = this.form.adjuvants
        let flag = false
        let index
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].drugs.length === 0) {
            flag = true
            index = i + 1
            break
          }
        }
        if (flag) {
          this.$message.error(`辅助用药${this.numMap[index]}不能为空！`)
          return false
        } else {
          return true
        }
      }
      if (type === 'main') {
        const arr = this.form.mainDrug
        if (arr.length === 0) {
          this.$message.error('主药不能为空！')
          return false
        } else {
          return true
        }
      }
    },
    /**
     * 药品ID处理
    */
    formatData () {
      const { name, symptomDiseaseClassifyId, mainDrug, adjuvants } = this.form
      const data = {
        name,
        symptomDiseaseClassifyId,
        mainDrug: '',
        adjuvants: []
      }
      // 主药Id处理
      const mainArr = []
      for (let i = 0; i < mainDrug.length; i++) {
        mainArr.push(mainDrug[i].id)
      }
      data.mainDrug = mainArr.join(',')
      // 辅药Id处理
      const viceArr = this.deepClonev2(adjuvants)
      for (let i = 0; i < viceArr.length; i++) {
        const item = viceArr[i].drugs
        const arr = []
        for (let j = 0; j < item.length; j++) {
          arr.push(item[j].id)
        }
        viceArr[i].drugsIds = arr.join(',')
        delete viceArr[i].drugs
      }
      data.adjuvants = viceArr
      return data
    },
    /**
     * 格式化
     */
    onSubmit () {
      const mainRes = this.validateFn('main')
      const adjuvantsRes = this.validateFn('adjuvants')
      if (mainRes && adjuvantsRes) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.countIndex()
            const data = this.formatData()
            if (this.id.length > 0) {
              console.log('编辑')
              data.id = this.id
              combinUpdate(data).then(res => {
                if (res.code === 200) {
                  this.$message.success('操作成功！')
                  this.$router.push({
                    path: '/mall/combination'
                  })
                }
              })
            } else {
              console.log('新增')
              combinAdd(data).then(res => {
                if (res.code === 200) {
                  this.$message.success('操作成功！')
                  this.$router.push({
                    path: '/mall/combination'
                  })
                }
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    resetForm () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
  .drugItem{
    position: relative;
    .del{
      position: absolute;
      right:10px;
      top:0;
    }
    /deep/ .ant-form-item-control-wrapper{
      background:#f9f9f9;
      padding: 10px 0 0 10px;
    }
  }
  .formTitle::before{
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
</style>
