<template>
  <div class="detailBox">
    <a-row :gutter="20">
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>商品编码：</span>{{ data.code }}
        <!-- 12321131 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>商品名称：</span>{{ data.name }}
        <!-- 罗红霉素片 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>商品规格：</span>{{ data.specifications }}
        <!-- 150mg*6t -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>生产企业：</span>{{ data.manufacturing }}
        <!-- 吉林省精鑫药业集团有限公司 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>个性标识：</span>{{ data.flag }}
        <!-- 罗红霉素片 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>产地：</span>{{ data.origin_place }}
        <!-- 吉林 -->
      </a-col>

      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>最新进价：</span>{{ data.purchase_price }}
        <!-- 2.3 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>最新售价：</span>{{ data.newest_price }}
        <!-- 2.3 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>建议零售价：</span>{{ data.proposal_retail_price }}
        <!-- 2.3 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>毛利率：</span>{{ data.margin }}
        <!-- 0 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>会员价：</span>{{ data.member_price }}
        <!-- 2.3 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>功能定义分类：</span>{{ data.function_classify }}
        <!-- 抗菌消炎口服西药 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>采购状态：</span>{{ data.purchase_type }}
        <!-- 正常采购 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>销售状态：</span>{{ data.sale_status }}
        <!-- 正常销售 -->
      </a-col>

      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>促销类型：</span>{{ data.promotion_type }}
        <!-- 0 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>促销价：</span>{{ data.promotion_price }}
        <!-- 0 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>销售积分：</span>{{ data.sale_integral }}
        <!-- 2.3 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>是否医保：</span>{{ data.medical_insurance }}
        <!-- 1 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>医保编码：</span>{{ data.medical_insurance_code }}
        <!-- XJ01FAL262A001010203521 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>医保名称：</span>{{ data.medical_insurance_name }}
        <!-- 正常销售 -->
      </a-col>

      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>批准文号：</span>{{ data.approval_no }}
        <!-- 国药准字H20020493 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>注册证号：</span>{{ data.register_no }}
        <!-- 0 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>条形码：</span>{{ data.bar_code }}
        <!-- 6940308186027 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>助记码：</span>{{ data.mnemonic_code }}
        <!-- lhmsp -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>商品简称：</span>{{ data.short_name }}
        <!-- 罗红霉素片 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>经营方式：</span>{{ data.business_mode }}
        <!-- 购销 -->
      </a-col>

      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>每件数量：</span>{{ data.each_num }}
        <!-- 400 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>注册效期：</span>{{ data.register_effective }}
        <!-- 0 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>中包装数量：</span>{{ data.medium_num }}
        <!-- 10 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>拆零单位：</span>{{ data.dismounted_num }}
        <!-- 1 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>拆零比率：</span>{{ data.dismounted_ratio }}
        <!-- 1 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>失效天数：</span>{{ data.invalid_dyas }}
        <!-- 730 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>进项税率：</span>{{ data.income_tax_rate }}
        <!-- 13 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>销项税率：</span>{{ data.output_tax_rate }}
        <!-- 13 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>商品状态：</span>{{ data.status }}
        <!-- 使用 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>相近商品：</span>{{ data.similar_goods }}
        <!-- 1 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>标准单位：</span>{{ data.unit }}
        <!-- 1 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>最高零售价：</span>{{ data.highest_retail_price }}
        <!-- 730 -->
      </a-col>

      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>进场时间：</span>{{ data.site_entrance_time }}
        <!-- 2016/10/28 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>最终修改人：</span>{{ data.update_user }}
        <!-- 张执智 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>最终修改时间：</span>{{ data.update_date }}
        <!-- 2022/3/5 0:00 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>柜组：</span>{{ data.cabinet_group }}
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>建档时间：</span>{{ data.establish_time }}
        <!-- 2016/11/1 0:00 -->
      </a-col>

      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>商品大类：</span>{{ data.category }}
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>上市许可持有人：</span>{{ data.permit_person }}
        <!-- 吉林省精鑫药业集团有限公司 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>最后入库日期：</span>{{ data.last_put_date }}
        <!-- 2022/3/5 0:00 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>采购员：</span>{{ data.purchase_person }}
        <!-- 李秦 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>WMS出库：</span>{{ data.wms_put }}
        <!-- 1 -->
      </a-col>
      <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <span>单品提成单价：</span>{{ data.goods_commission }}
        <!-- 2016/11/1 0:00 -->
      </a-col>
      <a-col :span="24">
        <span>功能疗效：</span>{{ data.efficacy }}
        <!-- 本品适用于化脓性链球菌引起的咽炎及扁桃体炎、敏感菌所致的鼻窦炎、中耳炎、急性支气管炎、慢性支气管炎 -->
      </a-col>
      <a-col :span="24">
        <span>备注：</span>{{ data.remarks }}
        <!-- 20191123+合理转正常经营 20190916+合理零库存 -->
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
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
      }
    }
  },
  data () {
    return {
      form: {}
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  .detailBox{
    height:400px;
    overflow:hidden;
    overflow-y: auto;
    .ant-col{
      margin-bottom:20px;
      span{
        display:inline-block;
        width:120px;
      }
    }
  }
</style>
