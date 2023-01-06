<template>
  <div class="ruleBox" v-if="info.rule">
    <a-card class="item">
      <div class="title">
        基本信息
      </div>
      <div class="content">
        <div class="left">
          <p>
            <span>规则名称：</span>
            <span>{{ info.name }}</span>
          </p>
          <p>
            <span>打标签方式：</span>
            <span>{{ info.type }}</span>
          </p>
          <p>
            <span>创建人：</span>
            <span>{{ info.createBy }}</span>
          </p>
          <p>
            <span>创建时间：</span>
            <span>{{ info.createTime }}</span>
          </p>
          <p>
            <p>自动添加标签：</p>
            <span>
              <a-tag class="label" v-for="(item, index) in info.labelIdNameGroup" :key="index">{{ item }}</a-tag>
            </span>
          </p>
        </div>
        <div class="right">
          <h2>规则设置：共 {{ info.rule ? info.rule.ruleNum : 0 }} 条规则</h2>
          <p>
            <span>商品范围：</span>
            <a-button v-if="info.rule && info.rule.goodBounds === '0'" type="primary">全部商品</a-button>
            <a-button v-else type="primary" @click="showGoods">查看商品</a-button>
          </p>
          <ul v-if="info.rule">
            <li v-for="(item, index) in info.rule.ruleList" :key="index">
              <h3>{{ item.ruleName }}</h3>
              <p>
                <span v-for="(item1, index1) in item.customerRule" :key="`customerRule${index1}`">
                  {{ item1.judgmentConditions }}
                  <a-tag color="green" v-for="(item11, index11) in item1.labelGroup" :key="index11">{{ item11 }}</a-tag>
                  <i v-if="index1 < item1.labelGroup.length">且</i>
                </span>
                标签的客户在购买商品时，
                <span v-for="(item2, index2) in item.consumeRule" :key="`consumeRule${index2}`">
                  <span v-if="item2.columnName === '购买时间'">{{ item2.columnName }}为{{ item2.val }}</span>
                  <span v-if="item2.columnName === '购买次数'">{{ item2.columnName }}{{ item2.judgmentConditions }}{{ item2.val }}次</span>
                  <span v-if="item2.columnName === '商品金额'">{{ item2.columnName }}{{ item2.judgmentConditions }}{{ item2.val }}元</span>
                  <span v-if="item2.columnName === '商品数量'">{{ item2.columnName }}{{ item2.judgmentConditions }}{{ item2.val }}</span>
                  <i v-if="index2 < item.consumeRule.length - 1" class="i01">且</i>
                </span>
                时，将会被打上
                <a-tag color="green" v-for="(item3, index3) in item.labelGroup" :key="`labelGroup${index3}`">{{ item3 }}</a-tag>
                标签。
              </p>
            </li>
          </ul>
        </div>
      </div>
    </a-card>
    <a-card class="item">
      <div class="title">
        数据统计
      </div>
      <div class="content">
        <div class="box">
          <div class="item">
            <div class="number">{{ info.statistics ? info.statistics.allCnt : 0 }}</div>
            <div class="title_key">打标签总次数</div>
          </div>
          <div class="item">
            <div class="number">{{ info.statistics ? info.statistics.todayCnt : 0 }}</div>
            <div class="title_key">今日打标签次数</div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card>
      <RuleTable />
    </a-card>
    <!--modal-->
    <a-modal
      title="查看商品"
      class="modalBox"
      @cancel="handleCancel"
      :footer="null"
      :visible="visible"
      width="800px"
    >
      <div class="content">
        <ul>
          <li v-for="(item, index) in info.rule.erpGood" :key="index">
            <h2>{{ item.name }}</h2>
            <p>
              <span>售价 ￥{{ Number(item.newestPrice).toFixed(2) }}</span>
              <span>毛利率 {{ Number(item.margin).toFixed(2) }}%</span>
            </p>
          </li>
        </ul>
      </div>
      <div class="handle">
        <a-button type="primary" @click="handleCancel">关闭</a-button>
      </div>
    </a-modal>
    <!--end modal-->
  </div>
</template>

<script>
import RuleTable from './expendComponents/list.vue'
import { consumeAutoLabelRuleDetail } from '@/api/clientFollow.js'

export default {
  components: { RuleTable },
  data () {
    return {
      info: {},
      labelId: '',
      visible: false
    }
  },
  created () {
    this.labelId = this.$route.query.label
    this.getInfo()
  },
  methods: {
    showGoods () {
      this.visible = true
    },
    onSearch () {
      console.log('ok')
    },
    handleCancel () {
      this.visible = false
    },
    getInfo () {
      const data = {
        id: this.labelId
      }
      consumeAutoLabelRuleDetail(data).then(res => {
        console.log(res)
        this.info = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ruleBox {
  .item{
    margin-bottom:16px;
    .title{
      border-bottom:1px solid #ccc;
      padding:0px 0px 10px;
      margin-bottom:20px;
      font-size:16px;
    }
    .content{
      display:flex;
      .left{
        width:300px;
        .label{
            margin-bottom:5px;
          }
      }
      .right{
        flex:1;
        background:#f2f2f2;
        padding:20px;
        h2{
          font-size:16px;
        }
        h3{
          font-size:14px;
        }
        ul{
          margin:0;
          padding:0;
          li{
            line-height:30px;
          }
        }
        i{
          font-style:normal
        }
        i.i01{
          margin:0 8px;
        }
      }
      .box{
        width: 500px;
        height: 125px;
        background: #fbfdff;
        border: 1px solid #daedff;
        .item{
          width:50%;
          float:left;
          text-align: center;
          margin-top:40px;
          box-sizing: border-box;
          .number{
            font-size:20px;
          }
        }
        .item:first-child{
          border-right:1px solid #ccc;
        }
      }
    }
  }
}
.modalBox{
  width:800px;
  .content{
    width:650px;
    margin:0 auto;
    overflow: hidden;
    height:400px;
    overflow: auto;
    ul{
      margin:0;
      padding:0;
    }
    li{
      width:300px;
      float:left;
      background:#f2f2f2;
      padding:5px 15px;
      margin-bottom:10px;
      margin-right:50px;
      border-radius: 5px;
      h2{
        font-size:14px;
        margin-top:10px;
        text-overflow: ellipsis; //文字隐藏后添加省略号
        white-space: nowrap; //强制不换行
        max-height: 50px; //Ie浏览器加行高
        overflow: hidden;
      }
      p{
        display:flex;
        span{
          flex:1;
        }
        span:last-child{
          text-align: right;
        }
      }
    }
    li:nth-child(2n){
      margin-right:0;
    }
  }
  .handle{
    text-align: center;
  }
}
</style>
