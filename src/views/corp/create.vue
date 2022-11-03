<template>
  <div class="page-style">
    <div style="width: 100%;" v-if="current === 0">
      <a-card class="card-box">
        <div class="title">
          请选择授权模式
        </div>
        <a-divider class="mt16 mb16"/>
        <div class="row flex-between">
          <div class="left flex">
            <div class="icon mr16">内</div>
            <div>
              <div class="mou-title mb6">内部开发模式</div>
              <div class="desc">适合企业私有化自用的企业客户</div>
            </div>
          </div>
          <div class="right">
            <a-button @click="current = 1">立即授权</a-button>
          </div>
        </div>
        <a-divider/>
        <div class="row flex-between">
          <div class="left flex">
            <div class="icon mr16" style="background: #1A89FA">代</div>
            <div>
              <div class="mou-title mb6">自建应用代开发模式</div>
              <div class="desc">适合使用SaaS产品的企业客户</div>
            </div>
          </div>
          <div class="right">
            <a-button @click="current = 2">立即授权</a-button>
          </div>
        </div>
      </a-card>
    </div>

    <internal v-if="current === 1"/>
    <auth v-if="current === 2"/>
  </div>
</template>

<script>
import internal from '@/views/corp/components/create/internal'
import auth from '@/views/corp/components/create/auth'

export default {
  data () {
    return {
      current: 0
    }
  },
  components: { internal, auth }
}
</script>

<style lang="less" scoped>
.card-box {
  .title {
    width: 100%;
    color: #2e2e2e;
    font-size: 16px;
    padding-left: 12px;
    font-weight: bold;
  }

  .row {
    margin-left: 16px;
    margin-right: 16px;
    margin-bottom: 16px;

    .icon {
      width: 55px;
      height: 55px;
      background: #02BF56;
      border-radius: 3px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .mou-title {
    font-size: 16px;
    color: #222;
  }

  .desc {
    font-size: 13px;
  }

  .ant-btn {
    padding: 0 29px;
    background: #F9F9F9;
    color: #1a89fa;
    border: none;
  }
}
</style>
