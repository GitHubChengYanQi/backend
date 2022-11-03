<template>
  <div class="details">
    <a-modal v-model="modalShow" :width="800" :footer="false" centered :maskClosable="false">
      <template slot="title">活动详情</template>
      <div class="content">
        <loading :loading="loading" v-if="loading" />
        <div class="flex" style="align-items: start; width: 100%" v-else>
          <div class="left-content">
            <div class="qr">
              <img :src="listData.qrcodeUrl" style="width: 133px" />
            </div>
            <div class="name">
              {{ listData.name }}
            </div>
            <div class="btn">
              <a-button type="primary" block @click="downQrCode"> 下载活码 </a-button>
            </div>
            <div class="btn">
              <a-button block @click="$router.push('/channelCodeNew/store?id=' + id)">修改</a-button>
            </div>
          </div>
          <div class="right-content">
            <div class="block-title">
              <div class="bar" />
              基本设置
            </div>
            <div class="block">
              <div class="title">创建时间：</div>
              <div class="block-content">
                {{ listData.createdAt | dayjs }}
              </div>
            </div>
            <div class="block">
              <div class="title">使用成员：</div>
              <div class="block-content">
                <a-tag class="mb6" v-for="(v, i) in listData.employees" :key="i">
                  {{ v }}
                </a-tag>
              </div>
            </div>
            <!-- <div class="block">
              <div class="title">备用成员：</div>
              <div class="block-content">
                <div class="time" v-if="data.drainageEmployee.specialPeriod.length">
                  <a-tag v-for="v in data.drainageEmployee.specialPeriod" :key="v.id">
                    {{ v.name }}
                  </a-tag>
                </div>
                <span v-else>无</span>
              </div>
            </div> -->
            <!-- <div class="block">
              <div class="title">员工添加上限：</div>
              <div class="block-content">
                {{ data.drainageEmployee.addMax.status === 1 ? '开启' : '关闭' }}
              </div>
            </div> -->
            <div class="block">
              <div class="title">自动通过好友：</div>
              <div class="block-content">
                {{ data.baseInfo.autoAddFriend === 1 ? '开启' : '关闭' }}
              </div>
            </div>
            <!-- <div class="block-title mt16 mb12">
              <div class="bar" />
              欢迎语设置
            </div> -->
            <!-- <div class="mb16">
              <div class="mb6" v-if="data.type == 1">渠道码欢迎语</div>
              <div class="mb6" v-if="data.type == 2">默认欢迎语</div>
              <div class="mb6" v-if="data.type == 3">不发送欢迎语</div>
              <div class="wec-card" v-if="data.type == 1">
                欢迎语1：
                <span v-if="!data.welcomeMessage.words && !data.welcomeMessage.content.length"> 不回复欢迎语 </span>
                <a v-else @click="previewDefShow(data.welcomeMessage.words, data.welcomeMessage.mediumId)">
                  查看全部
                </a>
              </div>
            </div> -->
            <!-- <div class="mb16" v-if="data.spanWelcomeStatus !== 0">
              <div class="mb6">分时段欢迎语</div>
              <div class="wec-card" v-for="(v, i) in data.spanWelcome" :key="i">
                <div class="flex mb16" style="align-items: start">
                  <span style="min-width: 56px">时段{{ i + 1 }}：</span>
                  <div class="flex" style="width: 332px; flex-wrap: wrap">
                    <a-tag v-for="week in v.week" :key="week" class="week-tag mb3">
                      {{ map.week[week] }}
                    </a-tag>
                  </div>
                  <div class="ml6">{{ v.startTime }} - {{ v.endTime }}</div>
                </div>
                <div class="flex">
                  欢迎语：
                  <a @click="previewDefShow(v.msg.words, v.msg.mediumId)">查看全部</a>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </a-modal>

    <div class="phone-pop" v-show="preview.show">
      <div class="bg" />
      <div class="p-content">
        <m-preview ref="preview" />
        <div class="close-icon pointer" @click="preview.show = false">
          <a-icon type="close-circle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCodeDetail } from '@/api/channelCodeNew'

export default {
  data () {
    return {
      modalShow: false,
      loading: false,
      listData: {},
      data: {
        baseInfo: {
          autoAddFriend: 1
        },
        drainageEmployee: {
          specialPeriod: [],
          addMax: {
            status: 1
          }
        },
        welcomeMessage: {
          content: []
        }
      },
      preview: {
        show: false
      },
      map: {
        week: {
          1: '周一',
          2: '周二',
          3: '周三',
          4: '周四',
          5: '周五',
          6: '周六',
          0: '周日'
        }
      },
      id: ''
    }
  },
  methods: {
    downQrCode () {
      const image = new Image()

      image.src = this.listData.qrcodeUrl

      image.setAttribute('crossOrigin', 'anonymous')

      image.onload = () => {
        const canvasNode = document.createElement('canvas')

        canvasNode.width = image.width
        canvasNode.height = image.height

        const ctx = canvasNode.getContext('2d')

        ctx.drawImage(image, 0, 0, image.width, image.height)

        const url = canvasNode.toDataURL('image/png')

        const aNode = document.createElement('a')

        aNode.href = url
        aNode.download = `门店活码-${this.listData.name}`

        aNode.click()
      }
    },

    previewDefShow (text, files) {
      this.updatePreview(text, files)

      this.preview.show = true
    },

    updatePreview (text, files) {
      this.$refs.preview.clean()
      this.$refs.preview.setText(text)

      files.forEach(v => {
        if (v.data.oldType === 'image') {
          this.$refs.preview.setImage(v.data.image.fullPath)
        }

        if (v.data.oldType === 'link') {
          this.$refs.preview.setLink(v.data.title, v.data.description, v.data.imagePath.fullPath)
        }

        if (v.data.oldType === 'luck') {
          this.$refs.preview.setLink(v.data.old[0].name, v.data.old[0].description, require('../../../assets/lottery-default-cover.png'))
        }

        if (v.data.oldType === 'applet') {
          this.$refs.preview.setApplets(v.data.title, v.data.image.fullPath)
        }
      })
    },

    getDetailData () {
      this.loading = true

      getCodeDetail({
        channelCodeId: this.id
      }).then(res => {
        this.loading = false
        this.data = res.data
      })
    },

    $show (data) {
      this.id = data.channelCodeId
      this.listData = data

      this.getDetailData()

      this.modalShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.week-tag {
  padding: 3px 8px;
  background: #fff;
  border-radius: 2px;
  border: 1px solid #e9e9e9;
  margin-right: 8px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 18px;
}

.phone-pop {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;

  .p-content {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%);
  }

  .close-icon {
    position: absolute;
    right: -9%;
    top: -6%;
    color: #fff;
    font-size: 37px;
  }
}

.wec-card {
  background: #fbfbfb;
  border-radius: 2px;
  border: 1px solid #eee;
  padding: 16px;
  margin-top: 4px;
  margin-bottom: 12px;
}

.block-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  color: #333;

  .bar {
    display: block;
    width: 3px;
    height: 12px;
    margin-right: 4px;
    background: #1990ff;
  }
}

.content {
  margin-top: 24px;
  height: 500px;
  display: flex;
  justify-content: flex-start;

  .left-content {
    padding-left: 16px;
    padding-right: 40px;
    width: 230px;

    .qr-code {
      margin-bottom: 20px;
      text-align: center;

      img {
        width: 114px;
        height: 114px;
        display: inline-block;
      }
    }

    .name,
    .btn {
      text-align: center;
      margin-bottom: 16px;
    }
  }

  .right-content {
    width: 100%;
    height: 100%;
    border-left: 1px solid #e8e8e8;
    padding-left: 32px;
    padding-right: 16px;
    overflow: auto;

    .block {
      display: flex;
      align-items: center;
      margin-top: 16px;

      .title {
        font-size: 14px;
        min-width: 112px;
        text-align: left;
        color: rgba(0, 0, 0, 0.45);
      }

      .block-content {
        flex: 1;
      }
    }
  }
}

.copy-input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -10;
}

.block-content {
  color: #000000d9;

  .link-text {
    max-width: 350px;
  }

  .copy-text {
    color: #1890ff;
    cursor: pointer;
    word-break: keep-all;
  }

  .link-desc {
    padding: 10px;
    background: #f9f9f9;
    border-radius: 3px;
    margin-top: 7px;

    span,
    a {
      font-size: 12px;
    }
  }

  .account-box {
    width: 196px;
    height: 56px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding-left: 13px;
    padding-right: 13px;

    img {
      width: 30px;
      height: 30px;
      border: 1px solid #007aff;
      border-radius: 50%;
      margin-right: 10px;
    }

    .info {
      .name {
        font-size: 13px;
      }

      .type {
        font-size: 12px;
      }
    }
  }

  .time {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }

  .member {
    flex-wrap: wrap;

    .item {
      min-width: 108px;
      max-width: 130px;
      height: 42px;
      background: #f7fbff;
      border-radius: 2px;
      border: 1px solid #b4cbf8;
      padding: 0 12px;
      margin-right: 10px;
      margin-bottom: 3px;

      img {
        width: 25px;
        height: 25px;
        margin-right: 6px;
      }

      span {
        font-size: 14px;
      }
    }
  }

  .group {
    .list {
      margin-top: 8px;
      background: #fbfbfb;
      border-radius: 2px;
      border: 1px solid #eee;
      padding: 16px;

      .item {
        margin-bottom: 10px;

        .info {
          background: #fff;
          border-radius: 2px;
          border: 1px solid #e6e7e8;
          padding: 0 9px;
          margin-right: 8px;
          width: 157px;
          height: 38px;
          align-items: center;

          img {
            width: 20px;
            height: 20px;
            margin-right: 7px;
          }

          .names {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.85);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }

        .status {
          background: #f1f2f3;
          border: 1px solid #d0d1d2;
          height: 20px;
          padding: 1px 8px 0;
          border-radius: 2px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }

  .welcome-text {
    word-break: break-all;
    white-space: break-spaces;
    padding: 16px;
    background: #fbfbfb;
    border: 1px solid #eee;
  }

  .link-card {
    background: #fff;
    border: 1px solid #f0f0f0;
    width: 250px;
    height: 99px;
    padding: 10px 12px;

    .link-title {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.85);
    }

    .info {
      margin-top: 6px;
      align-items: end;

      .desc {
        font-size: 13px;
        flex: 1;
      }

      img {
        width: 47px;
        height: 47px;
        border-radius: 2px;
        background-color: #f6f6f6;
        margin-left: 4px;
        cursor: pointer;
      }
    }
  }
}

.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.col {
  flex: 1;
}

.ellipses {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  display: block;
}

/deep/ .ant-modal-title {
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
}

/deep/ .ant-modal-body {
  padding-top: 0;
}
</style>
