<template>
  <div>
    <a-form-model
      ref="baseForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="活动名称" prop="name">
        <div class="item">
          <a-input v-model="form.name" :maxLength="10" />
          <span>最多可输入10个字</span>
        </div>
      </a-form-model-item>
      <a-form-model-item label="活动时间" prop="date">
        <a-range-picker
          v-model="form.date"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          :placeholder="['开始日期', '结束日期']"
          @change="onOk"
        />
      </a-form-model-item>
      <a-form-model-item label="活动介绍" prop="introduceImage">
        <a-input v-show="false" v-model="form.introduceImage"/>
        <UploadImg @changeImg="(e)=>{getImg(e, 'introduceImage')}" :imgUrl="introduceImageFullPath" :fileType="1" />
        <span>尺寸建议为:宽750px,格式为jpg/png/jpeg;</span>
      </a-form-model-item>
      <a-form-model-item label="奖品图片" prop="prizeImage">
        <a-input v-show="false" v-model="form.prizeImage"/>
        <UploadImg @changeImg="(e)=>{getImg(e, 'prizeImage')}" :imgUrl="prizeImageFullPath" :fileType="1" />
        <span>尺寸建议为:宽750px,格式为jpg/png/jpeg;</span>
      </a-form-model-item>
      <a-form-model-item label="员工二维码" prop="employeeQrcodeImage">
        <a-input v-show="false" v-model="form.employeeQrcodeImage"/>
        <UploadImg @changeImg="(e)=>{getImg(e, 'employeeQrcodeImage')}" :imgUrl="employeeQrcodeImageFullPath" :fileType="1" />
        <span>尺寸建议为:750px*750px,格式为jpg/png/jpeg;</span>
      </a-form-model-item>
      <a-form-model-item label="优惠券文案" prop="text">
        <div class="item">
          <a-input v-model="form.couponIntroduce" :maxLength="20" />
          <span>最多可输入20个字</span>
        </div>
      </a-form-model-item>
      <a-form-model-item label="活动分享介绍" prop="shareIntroduce">
        <div class="item">
          <a-input v-model="form.shareIntroduce" :maxLength="35" />
          <span>最多可输入35个字</span>
        </div>
      </a-form-model-item>
      <a-form-model-item label="活动分享图标" prop="shareIcon">
        <a-input v-show="false" v-model="form.shareIcon"/>
        <UploadImg @changeImg="(e)=>{getImg(e, 'shareIcon')}" :imgUrl="shareIconFullPath" :fileType="1" />
        <span>尺寸建议为:200px*200px,格式为jpg/png/jpeg;</span>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment'
import UploadImg from './upload'
export default {
  name: 'TabBase',
  components: {
    UploadImg
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading: false,
      form: {
        name: '',
        date: null,
        startTime: '',
        endTime: '',
        introduceImage: '',
        prizeImage: '',
        employeeQrcodeImage: '',
        couponIntroduce: '',
        shareIntroduce: '',
        shareIcon: ''
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        introduceImage: [{ required: true, message: '请上传活动介绍', trigger: 'blur' }],
        employeeQrcodeImage: [{ required: true, message: '请上传员工二维码', trigger: 'blur' }],
        shareIntroduce: [{ required: true, message: '请输入活动分享介绍', trigger: 'change' }],
        shareIcon: [{ required: true, message: '请上传活动分享图标', trigger: 'blur' }]
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        this.form.name = val.name
        this.form.couponIntroduce = val.couponIntroduce
        this.form.introduceImage = val.introduceImage
        this.form.prizeImage = val.prizeImage
        this.form.employeeQrcodeImage = val.employeeQrcodeImage
        if (val.startTime) {
          this.form.date = [moment(val.startTime), moment(val.endTime)]
        }
        this.form.startTime = val.startTime
        this.form.endTime = val.endTime
        this.form.shareIntroduce = val.shareIntroduce
        this.form.shareIcon = val.shareIcon
        this.employeeQrcodeImageFullPath = val.employeeQrcodeImageFullPath
        this.introduceImageFullPath = val.introduceImageFullPath
        this.prizeImageFullPath = val.prizeImageFullPath
        this.shareIconFullPath = val.shareIconFullPath
      }
    }
  },
  methods: {
    /**
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      this.form.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
      this.form.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    /**
     * 图片回调
     * @param {*} img
     */
    getImg (img, type) {
      this.form[type] = img.path
      this[type + 'FullPath'] = img.fullPath
      this.$refs['baseForm'].validateField(['content'])
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
    display:flex;
    input{
      width:400px;
    }
    span{
      flex:1;
      margin-left:20px;
      line-height:40px;
    }
  }
</style>
