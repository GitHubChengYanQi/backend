<template>
  <div class="publicAccountsAuthorization">
    <a-card>
      <div class="pubil">
        <div
          class="pubil_div"
          v-for="(item,index) in publicData"
          :key="'a' + index">
          <img
            class="pubil_img"
            :src="item.head_img"
            alt />
          <div class="pubil_info">
            <div class="pubill_top">
              <div class="pubill_name">{{ item.nick_name }}</div>
              <div class="service">{{ item.service_type !== 2 ? "订阅号" : "服务号" }}</div>
              <div
                class="authentication"
                :style="item.verify_type == -1 ? {
                  backgroundColor:'#ccc'
                }:{}">{{ item.verify_type == -1 ? '未认证' : '已认证' }}</div>
            </div>
            <div class="pubill_buttom">{{ item.principal_name }}</div>
          </div>
        </div>
        <div
          class="pubil_operation"
          @click="skipAuthorization">+ 授权公众号（需使用已认证的服务号）</div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { wxmpAuthUrl, wxmpAuthList, wxmpAuthMappupdate } from '@/api/wxCustomer'

export default {
  data () {
    return {
      publicData: []
    }
  },
  created () {
    this.getData()
    this.getUrl()
  },
  methods: {
    getData () {
      wxmpAuthList().then((res) => {
        // console.log(res)
        if (res.code !== 200) this.$message.error(res.msg)
        this.publicData = res.data.apps
      })
    },
    // 跳转授权
    skipAuthorization () {
      const url = window.location.href
      const data = {
        redirect_uri: url
      }
      if (url.indexOf('?') != -1) {
        data.redirect_uri = url.split('?')[0]
      }
      wxmpAuthUrl(data).then((res) => {
        if (res.code !== 200) {
          this.$message.error(res.msg)
          return
        }
        window.location = res.data.url
      })
    },
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符串
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('auth_code')) return
      console.log(object)
      const params = {
        auth_code: object.auth_code
      }
      console.log(params)
      wxmpAuthMappupdate(params).then((res) => {
        this.getData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.publicAccountsAuthorization {
  .pubil {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .pubil_div {
      box-sizing: border-box;
      padding: 0 30px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      min-width: 494px;
      height: 169px;
      visibility: inherit;
      border: 1px solid #ccc;
      border-radius: 10px;

      .pubil_img {
        border-radius: 50%;
        width: 80px;
        height: 80px;
      }

      .pubil_info {
        margin-left: 20px;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .pubill_top {
          display: flex;
          align-items: center;

          .pubill_name {
            white-space: nowrap;
            font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
            font-weight: 700;
            font-style: normal;
            font-size: 16px;
            line-height: 33px;
          }

          .service {
            margin-left: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 92px;
            height: 33px;
            font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
            font-weight: 700;
            font-style: normal;
            background-color: rgba(245, 154, 35, 1);
            color: #fff;
            border-radius: 5px;
          }

          .authentication {
            margin-left: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 92px;
            height: 33px;
            font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
            font-weight: 700;
            font-style: normal;
            background-color: rgba(112, 182, 3, 1);
            color: #fff;
            border-radius: 5px;
          }
        }

        .pubill_buttom {
          font-size: 15px;
          color: #333333;
          font-family: 'Arial Normal', 'Arial';
          font-weight: 400;
        }
      }
    }

    .pubil_operation {
      margin-top: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "'微软雅黑 Regular', 微软雅黑";
      font-weight: 400;
      font-style: normal;
      color: rgb(255, 255, 255);
      width: 429px;
      height: 60px;
      background-color: #1890ff;
    }
  }
}
</style>
