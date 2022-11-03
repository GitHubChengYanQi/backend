<!--
  基础设置
-->
<template>
  <div class="box">
    <a-form-model ref="baseForm" :model="form" :rules="rules">

      <!--参与公众号设置-->
      <div class="item">
        <h2>参与公众号设置</h2>
        <div class="list">
          <p class="head">
            <span class="s1">公众号</span>
            <span class="s2">操作</span>
          </p>
          <p v-if="selAcc.nickName">
            <span class="s1"><img :src="selAcc.headImg" />{{ selAcc.nickName }}</span>
            <span class="s2" @click="delAcc"><a>移除</a></span>
          </p>
        </div>
        <div class="handle" v-if="!selAcc.headImg">
          <a-button @click="addAcc">+ 选择参与活动的公众号</a-button>
          <a-form-model-item prop="mpId">
            <a-input v-model="form.mpId" v-show="false" placeholder="请选择参与公众号" />
          </a-form-model-item>
        </div>
      </div>
      <!--end 参与公众号设置-->

      <!--活动信息-->
      <div class="item">
        <h2>活动信息</h2>
        <a-form-model-item label="活动名称" prop="name">
          <a-input v-model="form.name" :maxLength="10" placeholder="请输入活动名称" />
        </a-form-model-item>
        <a-form-model-item label="活动时间" prop="time">
          <a-range-picker
            v-model="form.time"
            :disabled-date="disabledDate"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['活动开始日期', '活动结束日期']"
            @change="onOk"
          />
        </a-form-model-item>
      </div>
      <!--end 活动信息-->

      <!--奖品设置-->
      <div class="item">
        <h2>活动奖品设置<span>（邀请人数一旦发布，不可修改）</span></h2>
        <a-row>
          <a-col :span="12">
            <span>
              活动任务奖品阶梯&nbsp;
              <a-tooltip>
                <template slot="title">
                  根据用户邀请人数不同，设立不同的奖励阶梯
                </template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </span>
          </a-col>
          <a-col :span="12" class="radioGroup">
            <a-radio-group v-model="curLevel" @change="tapLevel">
              <a-radio :value="item.id" v-for="item in prizeTabs" :Key="item.id" :disabled="$parent.isPublish === '1' && Number(oldLevel) > Number(item.id)">
                {{ item.name }}
              </a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <div class="prizeList">
          <p v-for="(item, index) in form.prizeList" :key="index">
            <span>{{ numMap[item.prizeLevel - 1] }}级：邀请</span>
            <span class="formBox">
              <a-form-model-item
                :prop="`prizeList.${index}.peopleNum`"
                :rules="rules.peopleNum">
                <a-input-number v-model="item.peopleNum" :min="1" :disabled="$parent.isPublish === '1' && Number(oldLevel) >= Number(index + 1)" :max="999999" style="width:100px" />
              </a-form-model-item>
            </span>
            <span>人扫码助力，领取奖励</span>
            <span class="formBox">
              <a-form-model-item
                :prop="`prizeList.${index}.prizeId`"
                :rules="{
                  required: true,
                  message: `请选择${numMap[index]}级奖品`,
                  trigger: 'blur',
                }">
                <a-select v-model="item.prizeId" optionFilterProp="children" placeholder="请选择奖品" showSearch style="width:160px">
                  <a-select-option v-for="items in prizeList" :key="items.code">{{ items.name }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </span>
            <span>数量</span>
            <span class="formBox">
              <a-form-model-item
                :prop="`prizeList.${index}.prizeNum`"
                :rules="{
                  required: true,
                  message: '请输入奖品数量',
                  trigger: 'blur',
                }">
                <a-input-number v-model="item.prizeNum" :min="1" :max="999999" style="width:100px" />
              </a-form-model-item>
            </span>
            <span>件</span>
          </p>
        </div>
        <div>
          自动结束任务：
          <a-checkbox-group :options="options" v-model="selOptions" @change="onChange" />
        </div>
      </div>
      <!--end 奖品设置-->

      <!--操作-->
      <div class="handle">
        <a-button type="primary" @click="nextFn">
          下一步
        </a-button>
        <a-button type="primary" style="margin-left: 10px;" @click="saveFn">
          保存并发布
        </a-button>
      </div>
      <!--end 操作-->
    </a-form-model>

    <!--选择公众号-->
    <a-modal :visible="modalVisible" @cancel="cancel" title="选择公众号">
      <div v-if="accList.length>0">
        <div class="accList">
          <ul>
            <li v-for="(item,index) in accList" :class="modalActive===index?'active':''" @click="tapAcc(index, item)" :key="index">
              <span class="img"><img :src="item.headImg" /></span>
              <div class="txt">
                <h2>{{ item.nickName }}<span class="s1">{{ item.serviceType==='0'?'订阅号':'服务号' }}</span><span :class="item.verifyType==='1'?'s2':'s2 hide'">{{ item.verifyType==='1'?'已认证':'未认证' }}</span></h2>
                <p>{{ item.principalName }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="noList">
        <h2>暂无授权的公众号</h2>
        <a-button type="primary" @click="linkTo('/wxCustomer/publicAccountsAuthorization')">授权公众号</a-button>
      </div>
      <template slot="footer">
        <a-button key="submit" @click="submitAcc" type="primary">确定</a-button>
        <a-button @click="cancel" key="back">取消</a-button>
      </template>
    </a-modal>
    <!--end 选择公众号-->
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import { containsNumber } from '@/utils/validate'
import { mpList, prizeList, getQrcode } from '@/api/wxCustomer'
export default {
  name: 'ScrmBase',
  data () {
    const validateName = (rule, value, callback) => {
      if (containsNumber(value)) {
        return callback(new Error('只能输入中文、英文、符号'))
      } else {
        callback()
      }
    }
    const validatePeopleNum = (rule, value, callback) => {
      const curIndex = Number(rule.field.split('.')[1])
      const arr = this.form.prizeList
      if (arr[curIndex - 1] && arr[curIndex - 1].peopleNum >= arr[curIndex].peopleNum) {
        return callback(new Error('需大于上级人数'))
      } else if (arr[curIndex + 1] && arr[curIndex].peopleNum >= arr[curIndex + 1].peopleNum) {
        return callback(new Error('需小于下级人数'))
      } else {
        callback()
      }
    }
    return {
      qrcode: '',
      modalVisible: false,
      modalActive: null,
      curAcc: {},
      selAcc: {},
      prizeList: [],
      prizeTabs: [
        {
          id: '1',
          name: '一级'
        },
        {
          id: '2',
          name: '二级'
        },
        {
          id: '3',
          name: '三级'
        }
      ],
      accList: [],
      curLevel: '1',
      oldLevel: null, // 记录本次奖品级别
      form: {
        name: '', // 活动名称
        time: [],
        startTime: '', // 活动开始时间
        endTime: '', // 活动结束时间
        mpId: '', // 公众号ID
        prizeList: [ // 奖品列表
          {
            prizeLevel: 1,
            peopleNum: 5,
            prizeId: undefined,
            prizeNum: 10,
            zeroEnd: 1
          }
        ]
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        mpId: [
          { required: true, message: '请选择参与公众号', trigger: 'change' }
        ],
        peopleNum: [
          { required: true, message: '请输入邀请人数', trigger: 'blur' },
          { validator: validatePeopleNum, trigger: 'blur' }
        ],
        prizeNum: [
          { required: true, message: '请输入奖品数量', trigger: 'blur' }
        ],
        prizeId: [
          { required: true, message: '请选择活动奖品', trigger: 'change' }
        ]
      },
      numMap: {
        0: '一',
        1: '二',
        2: '三',
        3: '四',
        4: '五',
        5: '六',
        6: '七',
        7: '八',
        8: '九',
        9: '十'
      },
      selOptions: ['0'],
      options: [
        { label: '一级奖品库存为0时', value: '0' }
      ]
    }
  },
  created () {
    this.initFn()
  },
  mounted () {},
  methods: {
    ...mapActions(['setPrizeData']),
    /**
     * 拉取公众号列表，奖品列表
     */
    initFn () {
      mpList().then(res => {
        this.accList = res.data
      })
      prizeList().then(res => {
        this.prizeList = res.data
      })
      getQrcode().then(res => {
        this.qrcode = res.data
      })
    },
    /**
     * 路由跳转
     */
    linkTo (path) {
      this.$router.push({
        path
      })
    },
    /**
     * 选择多选框
     * @param {*} checkedValues
     */
    onChange () {
      const val = this.selOptions
      const arr = this.form.prizeList
      for (let i = 0; i < arr.length; i++) {
        if (val.indexOf(i + '') > -1) {
          arr[i].zeroEnd = 1
        } else {
          arr[i].zeroEnd = 0
        }
      }
    },
    /**
     * 根据奖品数据，设置选中数据selOptions
     */
    setSelOption (arr) {
      const res = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].zeroEnd === 1) {
          res.push(i + 1)
        }
      }
      return res
    },
    /**
     * 切换活动级别
     */
    tapLevel (e) {
      // this.form.prizeList = []
      // this.options = []
      const num = Number(e.target.value)
      if (this.form.prizeList.length >= num) {
        this.form.prizeList = this.form.prizeList.slice(0, num)
        this.options = this.options.slice(0, num)
        this.setSelOption(this.options)
      } else {
        for (let i = 0; i < num; i++) {
          if (!this.form.prizeList[i]) {
            const store = { label: this.numMap[i] + '级奖品库存为0时', value: i + '' }
            this.options.push(store)
            this.selOptions.push(i + '')
            const item = {
              prizeLevel: i + 1,
              peopleNum: 5,
              prizeId: undefined,
              prizeNum: 10,
              zeroEnd: 1
            }
            this.form.prizeList.push(item)
          }
        }
      }
      this.createTab()
    },
    /**
     * 根据奖品设置级别，更新进度页面tab
     */
    createTab () {
      const level = this.form.prizeList.length
      const arr = []
      const prizeArr = {
        prize: [],
        personNum: [],
        stock: []
      }
      for (let i = 0; i < level; i++) {
        arr.push(`${this.numMap[i]}级任务完成，领取奖励`)
        prizeArr.prize.push(`${this.numMap[i]}级任务奖品`)
        prizeArr.personNum.push(`达成${this.numMap[i]}级条件需要人数`)
        prizeArr.stock.push(`${this.numMap[i]}级奖品库存`)
      }
      this.$parent.$refs.ScrmProgress.$refs.SpreadUser.steps = ['好友助力提醒', ...arr, '更多设置']
      setTimeout(() => {
        this.setPrizeData(prizeArr)
      }, 100)
    },
    /**
     * 公众号选择弹框
     */
    addAcc () {
      this.modalVisible = true
    },
    /**
     * 确认选择
     */
    submitAcc () {
      if (!this.curAcc.verifyType) {
        this.$message.error('请选择参与活动的公众号')
        return false
      }
      if (this.curAcc.verifyType === '1') {
        this.modalVisible = false
        this.selAcc = this.curAcc
        this.form.mpId = this.selAcc.id
        this.$refs['baseForm'].validateField(['mpId'])
        this.cancel()
      } else {
        this.$message.error('未认证的公众号不能参与活动')
      }
    },
    /**
     * 选择公众号
     * @param {*} index
     * @param {*} item
     */
    tapAcc (index, item) {
      this.modalActive = index
      this.curAcc = item
    },
    /**
     * 删除公众号
     */
    delAcc () {
      if (this.$parent.isPublish === '1') {
        this.$message.error('活动已发布，不能移除公众号！')
      } else {
        this.form.mpId = ''
        this.$refs['baseForm'].validateField(['mpId'])
        this.selAcc = {}
      }
    },
    /**
     * 取消
     */
    cancel () {
      this.modalVisible = false
      this.modalActive = null
    },
    /**
     * 日期可选日期
     */
    disabledDate (current) {
      return current && current < moment().subtract(1, 'days') // 包含当天
      // return current && current < moment().endOf('day') // 不包含当天
    },
    /**
     * 日期选择
     * @param {*} value
     */
    onOk (value) {
      this.form.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
      this.form.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    /**
     * 下一步
     */
    nextFn () {
      this.$emit('toStep', {
        type: 'next',
        nav: 1
      })
    },
    /**
     * 保存并发布
     */
    saveFn () {
      this.$parent.saveFn('basic')
    }
  }
}
</script>

<style lang="less" scoped>
  .box{
    width:744px;
    margin:0 auto;
    .item{
      width:auto;
      padding:20px 30px;
      background:#fff;
      margin-bottom:10px;
      *{
        font-size:14px;
      }
      h2{
        font-size:16px;
        font-weight:bold;
        span{
          font-size:12px;
          font-weight:normal;
          color:#D9001B;
        }
      }
      .list{
        width:100%;
        font-size:12px;
        p{
          width:auto;
          padding:0 10px;
          height:30px;
          line-height:30px;
          span.s1{
            float:left;
            img{
              width:30px;
              height:30px;
              background:#f3f3f3;
              border-radius: 50%;
              overflow: hidden;
              margin-right:10px;
            }
          }
          span.s2{
            float:right;
          }
        }
        p.head{
          background:#f3f3f3;
        }
      }
      .handle{
        button{
          width:100%;
          border:1px dotted #333;
          background:#fff;
          font-size:12px;
          border-radius: 5px;
          height:30px;
          cursor: pointer;
        }
      }
      .ant-form-item{
        margin-bottom:0;
      }
      .radioGroup{
        text-align: right;
      }
      .prizeList{
        margin-top:20px;
        p{
          width:100%;
          span{
            display:inline-block;
            vertical-align: middle;
          }
          span.formBox{
            padding:0 10px;
          }
        }
      }
    }
  }
  .accList{
    ul{
      padding:0;
      li{
        width:100%;
        overflow: hidden;
        margin-bottom:10px;
        border:1px solid #f3f3f3;
        border-radius: 8px;
        cursor:pointer;
        box-sizing: border-box;
        padding:10px 20px;
        .img{
          width:60px;
          height:60px;
          overflow:hidden;
          border-radius: 50%;
          margin-right:20px;
          float:left;
          img{
            width:100%;
            height:100%;
          }
        }
        .txt{
          width:300px;
          float:left;
          h2{
            margin-bottom:5px;
            span{
              font-size:14px;
              color:#fff;
              padding:3px 10px;
              border-radius: 5px;
              margin-left:10px;
            }
            span.s1{
              background:#f59a23;
            }
            span.s2{
              background:#70b603;
            }
            span.s2.hide{
              background:#ccc;
              color:#333;
            }
          }
          p{
            margin:0;
          }
        }
      }
      li:hover{
        border:1px solid #086bff;
      }
      li.active{
        border:1px solid #086bff;
      }
    }
  }
  .noList{
    text-align: center;
    h2{
      font-size:16px;
    }
  }
</style>
