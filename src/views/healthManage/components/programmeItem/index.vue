/* eslint-disable */
<template>
  <div class="listContent-item">
    <!--    <div class="tip" v-if="isDefault == 0">个人</div>-->
    <!--    <div class="tip system" v-if="isDefault == 1">系统</div>-->
    <div class="tip" v-if="isDefault == 2">企业</div>
    <div class="flex-row-center title">
      <img :src="require('@/assets/healthManage/u1336.png')" />
      {{ planName }}
    </div>
    <slot name="body" />
    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line
  props: ['planName', 'isDefault'],
  data () {
    return {

    }
  },
  created () {
  },
  beforeDestroy () {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.flex-row-center {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.listContent-item {
    margin: 15px;
    // width: calc(33.33% - 30px);
    // height: 12vw;
    width: 300px;
    height: 170px;
    border-radius: 10px;
    box-shadow: 3px 2px 6px;
    padding: 20px 15px 0px 15px;
    position: relative;

    .tip {
        position: absolute;
        right: -1px;
        top: -1px;
        width: 38px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 0 10px 0 0;
        color: #1890ff;
        border: 1px solid #1890ff;
        font-size: 12px;
    }

    .system{
        color: rgba(217, 0, 27, 1) !important;
        border: 1px solid rgba(217, 0, 27, 0.6) !important;
    }

    .title {
        font-size: 14px;
        font-weight: bold;

        img {
            margin-right: 5px;
        }
    }

    .footer {
        border-top: 1px solid #e8e8e8;
        width: calc(100% - 30px);
        height: 50px;
        position: absolute;
        bottom: 0;
    }
}
</style>
