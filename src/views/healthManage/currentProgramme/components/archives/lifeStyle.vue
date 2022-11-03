<!-- 生活方式 -->
<template>
  <div class="basicInformation">
    <div class="title-content flex-row-center">
      <div class="chunk"></div>
      生活方式
    </div>
    <a-divider></a-divider>
    <div class="page-content">
      <div class="page-title">饮食习惯</div>
      <div class="row-view">
        <div class="title">一日三餐是否规律(字数过多换行显示)</div>
        <Space class="content" direction="vertical">
          <div :class="{'item':true,'active': item == 6}" v-for="item in 14" :key="item">偶尔(小于1次/周)</div>
        </Space>
      </div>
      <div class="row-view">
        <div class="title">一日三餐是否规律(字数过多换行显示)</div>
        <div class="custom">您还可以补充输入您的疾病史</div>
      </div>
      <a-divider></a-divider>
      <div class="row-view">
        <div class="title">一日三餐是否规律(字数过多换行显示)</div>
        <Space class="content" direction="vertical">
          <div :class="{'item':true,'active': item == 6}" v-for="item in 14" :key="item">偶尔(小于1次/周)</div>
        </Space>
      </div>
      <div class="row-view">
        <div class="title">一日三餐是否规律(字数过多换行显示)</div>
        <div class="custom">您还可以补充输入您的疾病史</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Space } from 'ant-design-vue'
export default {
  components: {
    Space
  },
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
    overflow-y: auto;

    .title-content {
        font-size: 16px;
        color: #555;
        margin: 10px 0;
    }

    .page-content {
        padding: 0 15px;

        .page-title {
            font-size: 14px;
            font-weight: bold;
            color: #555;
            margin-bottom: 15px;
        }

        .row-view {
            display: flex;
            flex-direction: row;
            margin-bottom: 15px;

            .title {
                font-size: 14px;
                color: #333;
                width: 145px;
                min-width: 145px;
                max-width: 145px;
                margin-right: 35px;
                padding-top: 6px;
            }

            .content {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
            }

            .item {
                padding: 4px 8px;
                border: 1px solid #d9d9d9;
                border-radius: 10px;
                color: #333;
                font-size: 14px;
                margin-right: 10px;
            }

            .active {
                border: none;
                background-color: rgb(60, 143, 235);
                color: #fff !important;
            }

            .custom {
                width: 100%;
                min-height: 63px;
                border: 1px solid rgba(215, 215, 215, 1);
                border-radius: 5px;
                padding: 8px 5px;
                box-sizing: border-box;
                color: #7f7f7f;
                font-size: 14px;
                line-height: 1.5;
            }
        }
    }

}
</style>
