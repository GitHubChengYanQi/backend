<template>
  <div>
    <a-form-model
      ref="baseForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!--============第一屏==============-->
      <div class="card">
        <!--活动名称-->
        <a-form-model-item label="活动名称" prop="name">
          <a-input style="width:350px;" v-model="form.name" :maxLength="10" :suffix="`${form.name ? form.name.length : 0}/10`" />
        </a-form-model-item>
        <!--活动时间-->
        <a-form-model-item label="活动时间" prop="date">
          <a-range-picker
            v-model="form.date"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始日期', '结束日期']"
            @change="onOk"
          />
        </a-form-model-item>
        <!--活动介绍-->
        <a-form-model-item label="活动介绍" prop="introduceImage">
          <a-input v-show="false" v-model="form.introduceImage"/>
          <UploadImg @changeImg="(e)=>{getImg(e, 'introduceImage')}" :imgUrl="introduceImageFullPath" :fileType="1" />
          <span>尺寸建议为:宽750px,格式为jpg/png/jpeg;</span>
        </a-form-model-item>
      </div>

      <!--============第二屏==============-->
      <div class="card">
        <div class="fl">
          <h2 class="title">活动首页</h2>
          <!--多图区一-->
          <a-form-model-item label="多图区一" prop="Image01">
            <a-input v-show="false" v-model="form.prizeImage"/>
            <div class="formBox">
              <UploadImg @changeImg="(e)=>{getImg(e, 'Image01')}" :imgUrl="Image01FullPath" :btnType="false" :fileType="1" />
              <span>最多可上传3张图片，单张图片大小不超过5M，尺寸：宽375px，格式为jpg/png/jpeg；</span>
            </div>
          </a-form-model-item>
          <!--视频专区名称-->
          <a-form-model-item label="视频专区名称" prop="text">
            <a-input style="width:350px;" v-model="form.couponIntroduce" :maxLength="8" :suffix="`${form.couponIntroduce ? form.couponIntroduce.length : 0}/8`" />
          </a-form-model-item>
          <a-form-model-item prop="videoBg" :wrapper-col="{ span: 14, offset: 4 }">
            <a-input v-show="false" v-model="form.videoBg"/>
            <div class="formBox">
              <UploadImg @changeImg="(e)=>{getImg(e, 'videoBg')}" :imgUrl="videoBgFullPath" :btnType="false" :fileType="1" />
              <span>图片大小不超过5M，尺寸为：宽375px*275px，格式为jpg/png/jpeg；</span>
            </div>
          </a-form-model-item>
          <!--走马灯开关-->
          <a-form-model-item label="走马灯开关" prop="text">
            <div class="item">
              <a-checkbox v-model="form.roll" @change="onChange">
                显示
              </a-checkbox>
            </div>
          </a-form-model-item>
          <a-form-model-item prop="rollBg" :wrapper-col="{ span: 14, offset: 4 }">
            <a-input v-show="false" v-model="form.videoBg"/>
            <div class="formBox">
              <UploadImg @changeImg="(e)=>{getImg(e, 'rollBg')}" :imgUrl="rollBgFullPath" :btnType="false" :fileType="1" />
              <span>图片大小不超过5M，尺寸为：宽375px*275px，格式为jpg/png/jpeg；</span>
            </div>
          </a-form-model-item>
          <!--多图区二-->
          <a-form-model-item label="多图区二" prop="Image02">
            <a-input v-show="false" v-model="form.prizeImage"/>
            <div class="formBox">
              <UploadImg @changeImg="(e)=>{getImg(e, 'Image02')}" :imgUrl="Image02FullPath" :btnType="false" :fileType="1" />
              <span>最多可上传3张图片，单张图片大小不超过5M，尺寸：宽375px，格式为jpg/png/jpeg；</span>
            </div>
          </a-form-model-item>
          <!--按钮一-->
          <a-form-model-item label="按钮文案" prop="text">
            <a-input style="width:350px;" v-model="form.btn01Txt" :maxLength="6" :suffix="`${form.btn01Txt ? form.btn01Txt.length : 0}/6`" />
          </a-form-model-item>
          <a-form-model-item label="按钮链接" prop="rollBg">
            <div class="formBox">
              <div style="width:280px;margin-right:10px;"><a-input placeholder="外部链接直接粘贴在这里需要以https://开头" v-model="form.btn01Link"/></div>
              <a href="">在已有页面中选</a>
            </div>
          </a-form-model-item>
          <!--按钮二-->
          <a-form-model-item label="按钮文案" prop="text">
            <a-input style="width:350px;" v-model="form.btn02Txt" :maxLength="6" :suffix="`${form.btn02Txt ? form.btn01Txt.length : 0}/6`" />
          </a-form-model-item>
          <a-form-model-item label="按钮链接" prop="rollBg">
            <div class="formBox">
              <div style="width:280px;margin-right:10px;"><a-input placeholder="外部链接直接粘贴在这里需要以https://开头" v-model="form.btn02Link"/></div>
              <a href="">在已有页面中选</a>
            </div>
          </a-form-model-item>
        </div>
        <div class="fr">
          <div class="phone">
            <div class="box">
              <div class="head">活动首页</div>
              <draggable v-model="homePage" :options="{ group: { name: 'tt', pull: 'clone' }, sort: true, }" animation="300">
                <transition-group>
                  <div class="items" v-for="item in homePage" :key="item.type">{{ item.typeName }}</div>
                </transition-group>
              </draggable>
              <div class="handle">
                <a-button>按钮一</a-button>
                <a-button>按钮二</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--============第三屏==============-->
      <div class="card">
        <div class="fl">
          <h2>答题页身份认证</h2>
          <!--答题页主题色-->
          <a-form-model-item label="答题页主题色" prop="text">
            <div class="item">
              <a-radio-group name="radioGroup" class="styleSelect" v-model="form.style">
                <a-radio :value="1">
                  主题一<div><i class="i01"></i></div>
                </a-radio>
                <a-radio :value="2">
                  主题二<div><i class="i02"></i></div>
                </a-radio>
                <a-radio :value="3">
                  主题三<div><i class="i03"></i></div>
                </a-radio>
                <a-radio :value="4">
                  主题四<div><i class="i04"></i></div>
                </a-radio>
              </a-radio-group>
            </div>
          </a-form-model-item>
          <!--注册会员文案-->
          <a-form-model-item label="注册会员文案" prop="text">
            <a-input style="width:350px;" v-model="form.couponIntroduce" :maxLength="20" :suffix="`${form.couponIntroduce ? form.couponIntroduce.length : 0}/20`" />
          </a-form-model-item>
          <!--客服二维码-->
          <a-form-model-item label="客服二维码" prop="employeeQrcodeImage">
            <a-input v-show="false" v-model="form.employeeQrcodeImage"/>
            <UploadImg @changeImg="(e)=>{getImg(e, 'employeeQrcodeImage')}" :btnType="false" :imgUrl="employeeQrcodeImageFullPath" :fileType="1" />
            <span>尺寸：114px*114px，格式为jpg/png/jpeg；</span>
          </a-form-model-item>
          <!--优惠券文案-->
          <a-form-model-item label="优惠券文案" prop="text">
            <a-input style="width:350px;" v-model="form.couponIntroduce" :maxLength="20" :suffix="`${form.couponIntroduce ? form.couponIntroduce.length : 0}/20`" />
          </a-form-model-item>
        </div>
        <div class="fr">
          <div class="phone">
            <div class="box">
              <div class="head">答题页身份认证</div>
              <div class="demo">
                <h3>示例问题：什么可以溶解陈旧性血栓斑块？</h3>
                <ul>
                  <li>A  纳豆激酶</li>
                  <li>B  维生素K</li>
                </ul>
                <p>请输入会员卡号（确认信息无误，结果将影响您最终是否获得奖品）*</p>
                <a-input placeholder="请输入会员卡号" />
              </div>
              <draggable v-model="answerPage" :options="{ group: { name: 'tt', pull: 'clone' }, sort: true, }" animation="300">
                <transition-group>
                  <div class="items" v-for="item in answerPage" :key="item.type">{{ item.typeName }}</div>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
      </div>

    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment'
import UploadImg from './upload'
import draggable from 'vuedraggable'
export default {
  name: 'TabBase',
  components: {
    UploadImg,
    draggable
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
      wrapperCol: { span: 18 },
      loading: false,
      homePage: [
        {
          type: 'Image01',
          typeName: '多图区一',
          value: ''
        }, {
          type: 'video',
          typeName: '视频专区名称',
          value: ''
        }, {
          type: 'roll',
          typeName: '走马灯'
        }, {
          type: 'Image02',
          typeName: '多图区二',
          value: ''
        }
      ],
      answerPage: [
        {
          type: 'txt1',
          typeName: '注册会员文案',
          value: ''
        }, {
          type: 'qrcode',
          typeName: '客服二维码',
          value: ''
        }, {
          type: 'txt2',
          typeName: '优惠券文案'
        }
      ],
      form: {
        name: '',
        date: null,
        startTime: '',
        endTime: '',
        introduceImage: '',
        Image01FullPath: '',
        // -----
        employeeQrcodeImage: '',
        couponIntroduce: '',
        introduceImageFullPath: '',
        Image01FullPath: '',
        videoBgFullPath: '',
        rollBgFullPath: '',
        Image02FullPath: ''
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        introduceImage: [{ required: true, message: '请上传活动介绍', trigger: 'blur' }],
        employeeQrcodeImage: [{ required: true, message: '请上传员工二维码', trigger: 'blur' }],
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
        // ---
        this.employeeQrcodeImageFullPath = val.employeeQrcodeImageFullPath
        this.introduceImageFullPath = val.introduceImageFullPath
        this.Image01FullPath = val.Image01FullPath
        this.videoBgFullPath = val.videoBgFullPath
        this.rollBgFullPath = val.rollBgFullPath
        this.Image02FullPath = val.Image02FullPath
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
    },
    /**
     * 走马灯回调
     */
    onChange (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less" scoped>
  .card{
    margin-bottom:30px;
    border-bottom: 1px solid #f2f2f2;
    overflow: hidden;
    .fl{
      float:left;
      width:60%;
    }
    .fr{
      float:right;
      width:40%;
      .phone{
        width:300px;
        height:573px;
        margin-top:50px;
        background:url(../../../../assets/phone.png);
        background-size:contain;
        position: relative;
        .box{
          width:264px;
          height:470px;
          background:#f2f2f2;
          position: absolute;
          top:40px;
          left:20px;
          .head{
            width:100%;
            height:30px;
            line-height:30px;
            background:#000;
            color:#fff;
            text-align: center;
          }
          .items {
            padding: 6px 12px;
            background: #f4f6fc;
            border: 1px solid #f4f6fc;
            text-align: left;
            margin-bottom: 5px;
            i{
              margin-right:10px;
            }
            &:hover{
              border:1px dashed #409eff;
              color:#409eff;
              cursor: move;
            }
          }
          .handle{
            width:100%;
            position: absolute;
            bottom:0;
            left:0;
            display:flex;
            button{
              flex:1;
            }
          }
          .demo{
            padding:10px;
            box-sizing: border-box;
            h3{
              font-size:14px;
            }
            ul{
              padding:0;
              margin:0;
              margin-bottom:30px;
            }
          }
        }
      }
    }
    .title{
      font-size:20px;
    }
    .formBox{
      display:flex;
      &>div{
        width:100px;
      }
      span{
        flex:1;
        line-height:24px;
      }
    }
    .styleSelect{
      div{
        width:100%;
        height:20px;
        margin-right:20px;
        i{
          background:#ff6600;
          width:40px;
          height:30px;
          display:block;
          margin-left:30px;
        }
        i.i01{
          background:#d9001b;
        }
        i.i02{
          background:#02a7f0;
        }
        i.i03{
          background:#70b603;
        }
        i.i04{
          background:#f59a23;
        }
      }
    }
  }
  h2{
    font-size:18px;
    margin-bottom:30px;
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
