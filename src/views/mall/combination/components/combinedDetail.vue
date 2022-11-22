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
            v-model="form.name"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="选择分类" prop="region">
          <a-cascader :options="options" placeholder="Please select" @change="onChange" />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-textarea disabled>1111</a-textarea>
        </a-form-model-item>

        <a-form-model-item label="设置主药及辅药">
          <a-button @click="addDrug" type="primary">添加辅助用药</a-button>
        </a-form-model-item>

        <a-form-model-item class="drugItem" label="主药">
          <selectDrug></selectDrug>
        </a-form-model-item>

        <a-form-model-item class="drugItem" v-for="(item,index) in otherList" :key="index" :label="`辅助用药${numMap[index+1]}`">
          <a-button class="del" type="danger" @click="delFn(index)">删除</a-button>
          <selectDrug></selectDrug>
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
import selectDrug from './selectDrug.vue'
export default {
  components: {
    selectDrug
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        this.id = val.contactId
        this.createdAt = val.createdAt
        this.getTableData()
        this.contactDetailStat()
      }
    }
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      otherList: [{}],
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake'
                }
              ]
            }
          ]
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men'
                }
              ]
            }
          ]
        }
      ],
      rules: {
        name: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
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
  methods: {
    onChange () {

    },
    addDrug () {
      if (this.otherList.length === 10) {
        this.$message.error('只能添加10条数据')
      } else {
        this.otherList.push({})
      }
    },
    delFn (index) {
      const len = this.otherList.length
      if (len === 1) {
        this.$message.error('至少保留一条数据！')
      } else {
        this.otherList.splice(index, 1)
      }
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
</style>
