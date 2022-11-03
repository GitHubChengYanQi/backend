<!-- 基础信息 -->
<template>
  <div class="basicInformation">
    <div class="title-content flex-row-center">
      <div class="chunk"></div>
      基础信息
    </div>
    <a-divider></a-divider>
    <div class="page-centent">
      <table>
        <tr>
          <td class="title">身高(cm)</td>
          <td class="content">170</td>
        </tr>
        <tr>
          <td class="title">体重(kg)</td>
          <td class="content">170</td>
        </tr>
        <tr>
          <td class="title">BMI(km/㎡)</td>
          <td class="content">170</td>
        </tr>
        <tr>
          <td class="title">腰围(cm)</td>
          <td class="content">170</td>
        </tr>
        <tr>
          <td class="title">臀围(cm)</td>
          <td class="content">170</td>
        </tr>
        <tr>
          <td class="title">记录时间</td>
          <td class="content">170</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {

  data () {
    return {
      visible: false
    }
  },
  mounted () { },
  methods: {
    open (id) {
      this.visible = true
    },
    handleOk () {

    }
  }
}
</script>
<style lang="less" scoped>
.basicInformation {
    width: 100%;
    height: 537px;

    .title-content {
        font-size: 16px;
        color: #555;
        margin: 10px 0;
    }

    .page-centent {
        padding-left: 45px;
        padding-top: 25px;
        box-sizing: border-box;
        table,
        th,
        td {
            border: 1px solid rgba(215, 215, 215, 1);
        }
        .title{
            width: 106px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background-color: #f2f2f2;
            color: #333;
            font-size: 14px;
        }
        .content{
            width: 483px;
            height: 40px;
            line-height: 40px;
            color: #333;
            font-size: 14px;
            padding-left: 15px;
            box-sizing: border-box;
        }
    }
}
</style>
