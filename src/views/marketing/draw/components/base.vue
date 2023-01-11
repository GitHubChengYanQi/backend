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
        <a-form-model-item label="活动介绍" prop="introduceImageFullPath">
          <a-input v-show="false" v-model="form.introduceImageFullPath"/>
          <UploadImg @changeImg="(e)=>{getImg(e, 'introduceImageFullPath')}" :imgUrl="form.introduceImageFullPath" :fileType="1" />
          <span>尺寸建议为:宽750px,格式为jpg/png/jpeg;</span>
        </a-form-model-item>
      </div>

      <!--============第二屏==============-->
      <div class="card">
        <div class="fl">
          <h2 class="title">活动首页</h2>
          <!--多图区一-->
          <a-form-model-item label="多图区一" prop="image01FullPath">
            <a-input v-show="false" v-model="form.image01FullPath"/>
            <div class="formBox">
              <UploadImg @changeImg="(e)=>{getImg(e, 'image01FullPath')}" :imgUrl="form.image01FullPath" :btnType="false" :fileType="1" />
              <span>最多可上传3张图片，单张图片大小不超过5M，尺寸：宽375px，格式为jpg/png/jpeg；</span>
            </div>
          </a-form-model-item>
          <!--视频专区名称-->
          <!-- <a-form-model-item label="视频背景" prop="couponIntroduce">
            <a-input style="width:350px;" v-model="form.couponIntroduce" :maxLength="8" :suffix="`${form.couponIntroduce ? form.couponIntroduce.length : 0}/8`" />
          </a-form-model-item> -->
          <a-form-model-item label="视频背景" prop="videoBgFullPath">
            <a-input v-show="false" v-model="form.videoBgFullPath"/>
            <div class="formBox">
              <UploadImg @changeImg="(e)=>{getImg(e, 'videoBgFullPath')}" :imgUrl="form.videoBgFullPath" :btnType="false" :fileType="1" />
              <span>图片大小不超过5M，尺寸为：宽375px*275px，格式为jpg/png/jpeg；</span>
            </div>
          </a-form-model-item>
          <!--走马灯开关-->
          <a-form-model-item label="走马灯开关" prop="rollShow">
            <div class="item">
              <a-checkbox v-model="form.rollShow" @change="handleChangeRoll">
                显示
              </a-checkbox>
              <span style="margin-left:35px;">示例：昵称为“温如清风”的用户参加了活动！</span>
            </div>
          </a-form-model-item>
          <a-form-model-item prop="rollBgFullPath" :wrapper-col="{ span: 14, offset: 4 }">
            <a-input v-show="false" v-model="form.rollBgFullPath"/>
            <div class="formBox">
              <UploadImg @changeImg="(e)=>{getImg(e, 'rollBgFullPath')}" :imgUrl="form.rollBgFullPath" :btnType="false" :fileType="1" />
              <span>图片大小不超过5M，尺寸为：宽375px*275px，格式为jpg/png/jpeg；</span>
            </div>
          </a-form-model-item>
          <!--多图区二-->
          <a-form-model-item label="多图区二" prop="image02FullPath">
            <a-input v-show="false" v-model="form.image02FullPath"/>
            <div class="formBox">
              <UploadImg @changeImg="(e)=>{getImg(e, 'image02FullPath')}" :imgUrl="form.image02FullPath" :btnType="false" :fileType="1" />
              <span>最多可上传3张图片，单张图片大小不超过5M，尺寸：宽375px，格式为jpg/png/jpeg；</span>
            </div>
          </a-form-model-item>
          <!--按钮1-->
          <div class="btnList">
            <p class="title">
              <a-checkbox v-model="form.showBtn01" @change="(e) => {handleChangeBtn(e, 'showBtn01')}">按钮一</a-checkbox>
            </p>
            <p class="ctx">
              <a-form-model-item label="按钮文案" prop="text">
                <a-input style="width:300px;" v-model="form.btn01Txt" :maxLength="6" :suffix="`${form.btn01Txt ? form.btn01Txt.length : 0}/6`" />
              </a-form-model-item>
              <a-form-model-item label="按钮链接" prop="rollBg">
                <div class="formBox">
                  <div style="width:240px;margin-right:10px;"><a-input placeholder="外部链接直接粘贴在这里需要以https://开头" v-model="form.btn01Link"/></div>
                  <a href="">选择</a>
                </div>
              </a-form-model-item>
            </p>
          </div>

          <!--按钮2-->
          <div class="btnList">
            <p class="title">
              <a-checkbox v-model="form.showBtn02" @change="(e) => {handleChangeBtn(e, 'showBtn02')}">按钮二</a-checkbox>
            </p>
            <p class="ctx">
              <a-form-model-item label="按钮文案" prop="text">
                <a-input style="width:300px;" v-model="form.btn02Txt" :maxLength="6" :suffix="`${form.btn02Txt ? form.btn02Txt.length : 0}/6`" />
              </a-form-model-item>
              <a-form-model-item label="按钮链接" prop="rollBg">
                <div class="formBox">
                  <div style="width:240px;margin-right:10px;"><a-input placeholder="外部链接直接粘贴在这里需要以https://开头" v-model="form.btn02Link"/></div>
                  <a href="">选择</a>
                </div>
              </a-form-model-item>
            </p>
          </div>
        </div>
        <div class="fr">
          <div class="phone">
            <div class="box">
              <div class="head">活动首页</div>
              <draggable v-model="homePage" :options="{ group: { name: 'tt', pull: 'clone' }, sort: true, }" animation="300">
                <transition-group>
                  <div class="items" v-show="item.show" v-for="item in homePage" :key="item.type">
                    <h2>{{ item.typeName }}</h2>
                    <img :src="item.url" />
                  </div>
                </transition-group>
              </draggable>
              <div class="handle">
                <a-button v-if="form.showBtn01">{{ form.btn01Txt }}</a-button>
                <a-button v-if="form.showBtn02">{{ form.btn02Txt }}</a-button>
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
          <a-form-model-item label="答题页主题色" prop="style">
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
          <a-form-model-item label="注册会员文案" prop="regTxt">
            <a-input style="width:350px;" v-model="form.regTxt" @input="handleInput('regTxt')" :maxLength="20" :suffix="`${form.regTxt ? form.regTxt.length : 0}/20`" />
          </a-form-model-item>
          <!--客服二维码-->
          <a-form-model-item label="客服二维码" prop="employeeQrcodeImageFullPath">
            <a-input v-show="false" v-model="form.employeeQrcodeImageFullPath"/>
            <UploadImg @changeImg="(e)=>{getImg(e, 'employeeQrcodeImageFullPath')}" :btnType="false" :imgUrl="form.employeeQrcodeImageFullPath" :fileType="1" />
            <span>尺寸：114px*114px，格式为jpg/png/jpeg；</span>
          </a-form-model-item>
          <!--优惠券文案-->
          <a-form-model-item label="优惠券文案" prop="ticketTxt">
            <a-input style="width:350px;" v-model="form.ticketTxt" @input="handleInput('ticketTxt')" :maxLength="20" :suffix="`${form.ticketTxt ? form.ticketTxt.length : 0}/20`" />
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
                  <div class="items" v-show="item.show" v-for="item in answerPage" :key="item.type">
                    <h2>{{ item.typeName }}</h2>
                    <p v-if="item.value">{{ item.value }}</p>
                    <img :src="item.url" />
                  </div>
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
      default: {}
    }
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      loading: false,
      homePage: [
        {
          type: 'image01FullPath',
          typeName: '多图区一',
          value: '',
          url: '',
          show: true
        }, {
          type: 'videoBgFullPath',
          typeName: '视频背景',
          value: '',
          url: '',
          show: true
        }, {
          type: 'rollBgFullPath',
          typeName: '走马灯',
          value: '',
          url: '',
          show: true
        }, {
          type: 'image02FullPath',
          typeName: '多图区二',
          value: '',
          url: '',
          show: true
        }
      ],
      answerPage: [
        {
          type: 'regTxt',
          typeName: '注册会员文案',
          value: '',
          url: '',
          show: true
        }, {
          type: 'employeeQrcodeImageFullPath',
          typeName: '客服二维码',
          value: '',
          url: '',
          show: true
        }, {
          type: 'ticketTxt',
          typeName: '优惠券文案',
          value: '',
          url: '',
          show: true
        }
      ],
      form: {
        // 基础信息
        name: '',
        date: null,
        startTime: '',
        endTime: '',
        introduceImageFullPath: '',
        // 活动首页
        image01FullPath: '',
        // couponIntroduce: '',
        videoBgFullPath: '',
        rollShow: true,
        rollBgFullPath: '',
        image02FullPath: '',
        showBtn01: true,
        btn01Txt: '按钮一',
        btn01Link: '',
        showBtn02: true,
        btn02Txt: '按钮二',
        btn02Link: '',
        // 答题页身份认证
        style: 1,
        regTxt: '',
        employeeQrcodeImageFullPath: '',
        ticketTxt: ''
      },
      rules: {
        // 基础信息
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        introduceImageFullPath: [{ required: true, message: '请上传活动介绍', trigger: 'blur' }],
        // 活动首页
        // couponIntroduce: [{ required: true, message: '请输入视频专区名称', trigger: 'blur' }],
        // 答题页身份认证
        style: [{ required: true, message: '请选主题', trigger: 'change' }],
        regTxt: [{ required: true, message: '注册会员文案', trigger: 'blur' }],
        employeeQrcodeImageFullPath: [{ required: true, message: '请上传客服二维码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        this.form = { ...this.form, ...val }
        if (val.startTime) {
          this.form.date = [moment(val.startTime), moment(val.endTime)]
        }
        this.form.startTime = val.startTime
        this.form.endTime = val.endTime
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
      this.form[type] = img.fullPath
      // this.$refs['baseForm'].validateField(['content'])
      let arr = []
      if (type === 'employeeQrcodeImageFullPath') {
        arr = this.answerPage
      } else {
        arr = this.homePage
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === type) {
          arr[i].url = img.fullPath
        }
      }
    },
    /**
     * 走马灯回调
     */
    handleChangeRoll (e) {
      const arr = this.homePage
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === 'rollBgFullPath') {
          arr[i].show = e.target.checked
        }
      }
    },
    /**
     * 切换按钮显示
     */
    handleChangeBtn (e, type) {
      this.form[type] = e.target.checked
    },
    /**
     * 输入回调
     */
    handleInput (type) {
      const arr = this.answerPage
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === type) {
          arr[i].value = this.form[type]
        }
      }
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
          overflow: auto;
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
            padding: 0;
            background: #f4f6fc;
            border: 1px solid #f4f6fc;
            text-align: left;
            position: relative;
            width:100%;
            height:auto;
            min-height:40px;
            h2{
              position: absolute;
              top:50%;
              left:50%;
              transform: translate(-50%, -50%);
              padding:0px 5px;
              background:rgba(0, 0, 0, .7);
              font-size:14px;
              z-index: 99;
              color:#fff;
              border-radius: 2px;
            }
            img{
              width:100%;
            }
            p{
              padding:10px;
            }
            i{
              margin-right:10px;
            }
            &:hover{
              border:1px dashed #409eff;
              color:#409eff;
              cursor: move;
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
          .handle{
            width:100%;
            display:flex;
            button{
              flex:1;
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
  .btnList{
    display:flex;
    p.title{
      font-size:14px;
      width:15%;
      text-align: right;
    }
    p.ctx{
      flex:1;
    }
  }
</style>
