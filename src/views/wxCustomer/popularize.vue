<template>
  <div class="popularize">
    <a-card>
      <div
        class="operation"
        v-permission="'customer_activity_prize_detail/make@post'">
        <div
          class="add"
          @click="()=>{this.hiddentState = true}">新建员工推广渠道</div>
      </div>
      <a-table
        :columns="columns"
        :row-key="(record, index) => index"
        :data-source="tableData"
        :pagination="pagination"
        @change="handleTableChange">
        <div
          slot="action"
          slot-scope="text, record">
          <template>
            <a-button
              type="link"
              v-permission="'customer_activity_prize_detail/cors@post'"
              @click="setHidden(record)">生成海报</a-button>
            <a-button
              type="link"
              v-permission="'customer_activity_prize_detail/card@post'"
              @click="editFn(record)">编辑</a-button>
          </template>
        </div>
      </a-table>
    </a-card>
    <div
      class="hiddent_box"
      v-if="hiddentState"
      @mousewheel="mousewheel">
      <div class="preview_box">
        <div class="preview_header">
          <div
            class="preview_close"
            @click="()=>{
              this.hiddentState = false
            }">+</div>
        </div>
        <div class="input_box">
          <span class="input_title">渠道名称：</span>
          <span class="input_div">
            <a-input
              v-model="previewName"
              placeholder="请输入渠道名称"
              :max-length="20"></a-input>
          </span>
        </div>
        <div class="preview_button">
          <span
            class="cancel"
            @click="()=>{
              this.previewName = ''
              this.openState = -1
              this.hiddentState = false
            }">取消</span>
          <span
            class="affirm"
            @click="()=>{
              this.setMake(this.openState)
            }">确认</span>
        </div>
      </div>
    </div>
    <div
      class="poster_hiddent_box"
      :style="{display: posterState ? 'flex':'none' }"
      @mousewheel="mousewheel">
      <div
        class="poster_content"
        id="posterHtml">
        <img
          src="@/assets/close.png"
          alt
          class="close_img"
          @click="()=>{this.posterState = false}" />
        <img
          :src="'data:image/png;base64,' + bgImgURL "
          alt=""
          class="poster_img">
        <!-- 二维码 -->
        <div
          class="qrcodeBox"
          :style="{top:positionArr[1]+ '%' , left: positionArr[0] + '%', width: this.sizeArr[0] + '%',height:0,paddingBottom:this.sizeArr[0] + '%'}">
          <img
            id="qrcodeImg"
            alt=""
            class="qrCode"
            :src="'data:image/png;base64,'+ qrCodeBase">
        </div>
        <div class="button_box">
          <span
            class="download_qrCode"
            @click="createQrcodeImg()">下载渠道二维码</span>
          <span
            class="download_poster"
            @click="createPoster()">下载渠道海报</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { popularizeMake, popularizeCard, popularizeCors } from '@/api/wxCustomer'

export default {
  data () {
    return {
      columns: [
        {
          title: '渠道名称',
          dataIndex: 'cardName',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      poster: {},
      hiddentState: false,
      previewName: '',
      posterState: false,
      contentData: '',
      bgImgURL: '',
      posterImgURL: '', // 生成海报的url地址
      qrcodeImgURL: '',
      screentData: {},
      positionArr: [],
      sizeArr: [],
      openState: -1,
      qrCodeBase: ''
    }
  },
  created () {
    this.getUrl()
  },
  beforeDestroy () {
    localStorage.removeItem('popularize')
  },
  methods: {
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    editFn (e) {
      this.hiddentState = true
      this.previewName = e.cardName
      this.openState = e.id
    },
    setMake (e) {
      let params = {}
      if (e == -1) {
        params = {
          cardName: this.previewName,
          activityId: this.screentData.activityId
        }
      } else {
        params = {
          cardName: this.previewName,
          activityId: this.screentData.activityId,
          id: this.openState
        }
      }
      if (this.previewName.length === 0) return this.$message.error('请输入渠道名称')

      popularizeMake(params).then((res) => {
        if (res.code !== 200) {
          this.$message.error(res.msg)
          return
        }
        this.previewName = ''
        this.hiddentState = false
        this.getTableData()
      })
    },
    getTableData () {
      const params = {
        ...this.screentData,
        size: this.pagination.pageSize,
        current: this.pagination.current
      }
      popularizeCard(params).then((res) => {
        if (res.data.datas.length === 0) return
        if (res.code !== 200) this.$message.error(res.msg)
        this.tableData = res.data.datas
        this.poster = res.data.poster
        this.pagination.total = res.data.total
        this.getImage(this.poster.posterUrl)
        this.getQrcodeSize()
      })
    },
    getQrcodeSize () {
      const positionArr = this.poster.qrcodePosition.split('x')
      const sizeArr = this.poster.qrcodeSize.split('x')
      this.positionArr = positionArr
      this.sizeArr = sizeArr
    },
    mousewheel (e) {
      e.preventDefault()
    },
    setHidden (e) {
      this.posterState = true
      this.getQrcode(e.cardCode)
    },
    // 生成海报
    createPoster () {
      const that = this
      const posterDOM = document.getElementById('posterHtml')
      html2canvas(posterDOM, {
        width: posterDOM.offsetWidth * 0.85,
        height: posterDOM.offsetHeight * 0.85,
        backgroundColor: null,
        // 按比例增加分辨率
        useCORS: true, // （图片跨域相关）
        allowTaint: false, // 允许跨域（图片跨域相关）
        logging: false,
        letterRendering: true,
        scale: 5, // 处理模糊问题
        dpi: window.devicePixelRatio * 2 // 处理模糊问题
      }).then((canvas) => {
        that.posterImgURL = canvas.toDataURL('image/png')
        this.downloadPoster(that.posterImgURL)
      })
    },
    // 生成二维码图片
    createQrcodeImg () {
      const that = this
      const qrcodeImgDOM = document.getElementById('qrcodeImg')
      html2canvas(qrcodeImgDOM, {
        width: qrcodeImgDOM.offsetWidth * 0.85,
        height: qrcodeImgDOM.offsetHeight * 0.85,
        backgroundColor: null,
        // 按比例增加分辨率
        useCORS: true, // （图片跨域相关）
        allowTaint: true, // 允许跨域（图片跨域相关）
        logging: false,
        letterRendering: true,
        scale: 5, // 处理模糊问题
        dpi: window.devicePixelRatio * 2 // 处理模糊问题
      }).then((canvas) => {
        that.qrcodeImgURL = canvas.toDataURL('image/png')
        this.downloadPoster(that.qrcodeImgURL)
      })
    },
    // 下载海报
    downloadPoster (url) {
      const a = document.createElement('a')
      a.download = `${new Date().getTime()}.png`
      a.href = url
      a.dispatchEvent(new MouseEvent('click'))
    },
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符串
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return this.$router.push(`/wxCustomer/index`)
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('id')) return this.$message.error('活动id不能为空')
      this.screentData = {
        activityId: object.id,
        hasPoster: true
      }
      this.getTableData()
    },
    getImage (url) {
      const data = {
        link: url
      }
      popularizeCors(data).then((res) => {
        if (res.code !== 200) this.$message.error(res.msg)
        this.bgImgURL = res.data.data
      })
    },
    getQrcode (url) {
      const data = {
        link: url
      }
      popularizeCors(data).then((res) => {
        this.qrCodeBase = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.popularize {
  .operation {
    cursor: pointer;
    width: 123px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(52, 112, 255);
    font-family: "'微软雅黑 Regular', 微软雅黑";
    font-weight: 400;
    font-style: normal;
    color: rgb(255, 255, 255);
    border-radius: 3px;
    margin-bottom: 20px;
  }
  .hiddent_box {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;

    .preview_box {
      width: 411px;
      height: 164px;
      background-color: rgb(255, 255, 255);
      box-sizing: border-box;
      padding: 5px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(215, 215, 215);
      border-radius: 7px;

      .preview_header {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .preview_close {
          cursor: pointer;
          width: 30px;
          height: 30px;
          transform: rotate(45deg);
          font-size: 36px;
        }
      }

      .input_box {
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
        padding: 20px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .preview_button {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 50px;
        .cancel {
          border-radius: 5px;
          cursor: pointer;
          width: 80px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          color: #333333;
        }

        .affirm {
          margin-left: 10px;
          border-radius: 5px;
          cursor: pointer;
          width: 80px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgb(22, 155, 213);
          color: #fff;
          border: 1px solid #ccc;
        }
      }
    }
  }
  .poster_hiddent_box {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;

    #posterHtml {
      width: 360px;
      height: 640px;
      transform: scale(0.85);
      transform-origin: 50% 50%;
    }

    .poster_content {
      width: 360px;
      height: 640px;
      background-color: #fff;
      display: flex;
      align-items: center;
      // background-size: 100% 100%;
      // background-size: 100% auto;
      // background-repeat: no-repeat;
      // background-position: center;
      position: relative;

      .close_img {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: auto;
        transform: translate(100%, -100%);
      }

      .poster_img {
        width: 100%;
        height: auto;
      }

      /*二维码*/
      .qrcodeBox {
        position: absolute;
        bottom: 10px;
        right: 10px;
        .qrCode {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          max-width: 360px;
          max-height: 360px;
        }
      }

      .button_box {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        position: absolute;
        bottom: -65px;
        font-size: 16px;
        font-family: 'Arial Normal', 'Arial';

        .download_qrCode {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 100%;
          background: inherit;
          background-color: rgba(255, 255, 255, 1);
          border: none;
          border-radius: 5px;
          color: #333333;
        }

        .download_poster {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 100%;
          background: inherit;
          background-color: rgb(52, 112, 255);
          color: #fff;
          border: none;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
