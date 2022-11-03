<template>
  <div class="preview">
    <div class="phone">
      <img src="../../assets/phone.png" class="bg">
      <div class="content">
        <div v-for="(v,i) in list" :key="i">
          <div class="item" v-if="v.type === 'text' && v.data.text">
            <img
              class="avatar"
              src="../../assets/avatar-default.svg">
            <div class="msg">
              {{ v.data.text }}
            </div>
          </div>
          <div class="item" v-if="v.type === 'image'">
            <img
              class="avatar"
              src="../../assets/avatar-default.svg">
            <div class="msg">
              <img :src="v.data.imageUrl">
            </div>
          </div>
          <div class="item" v-if="v.type === 'link'">
            <img
              class="avatar"
              src="../../assets/avatar-default.svg">
            <div class="msg link">
              <div class="title">
                {{ v.data.title }}
              </div>
              <div class="desc">
                <span>
                  {{ v.data.desc }}
                </span>
                <img :src="v.data.image" v-if="v.data.image">
                <img src="../../assets/default-cover.png" v-else>
              </div>
            </div>
          </div>
          <div class="item applets" v-if="v.type === 'applets'">
            <img
              class="avatar"
              src="../../assets/avatar-default.svg">
            <div class="msg link">
              <div class="title">
                {{ v.data.title }}
              </div>
              <div class="image">
                <img :src="v.data.image">
              </div>
              <div class="applets-logo">
                <img src="../../assets/link.jpg">
                小程序
              </div>
            </div>
          </div>
        </div>
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      imageUrl: '',
      link: {
        title: '',
        desc: '',
        image: ''
      },
      applets: {
        title: '',
        image: ''
      },
      list: []
    }
  },
  methods: {
    clean () {
      this.list = []
    },

    setApplets (title = '', image = '') {
      if (image && title) {
        this.list.push({
          type: 'applets',
          data: {
            title,
            image
          }
        })
      }
      this.list = this.getUnique(this.list)
    },

    setLink (title = '', desc = '', image = '') {
      if (image && desc && title) {
        this.list.push({
          type: 'link',
          data: {
            title,
            desc,
            image
          }
        })
      }
      this.list = this.getUnique(this.list)
    },

    setText (text = '', e) {
      const i = this.list.findIndex((i, v) => { return i.type == 'text' })
      if (i != -1) {
        this.list.splice(i, 1)
        this.list.unshift({
          type: 'text',
          data: {
            text
          }
        })
      } else {
        this.list.push({
          type: 'text',
          data: {
            text
          }
        })
      }
    },

    setImage (url = '') {
      if (url) {
        this.list.push({
          type: 'image',
          data: {
            imageUrl: url
          }
        })
      }
      this.list = this.getUnique(this.list)
    },
    getUnique (array) {
      const obj = {}
      return array.filter((item, index) => {
        // 防止key重复
        const newItem = item + JSON.stringify(item)
        const arr = Object.prototype.hasOwnProperty.call(obj, newItem) ? false : obj[newItem] = true
        return arr
      })
    }
  }
}
</script>

<style lang="less" scoped>
.phone {
  width: 280px;
  height: 500px;
  position: relative;

  .bg {
    width: 274px;
    position: absolute;
    z-index: 1;
  }

  .content {
    width: 235px;
    height: 343px;
    padding: 10px 7px 7px;
    background: transparent;
    position: relative;
    z-index: 2;
    left: 20px;
    top: 98px;
    display: flex;
    flex-direction: column;
    overflow: auto;

    .item {
      display: flex;
      margin-bottom: 15px;

      .avatar {
        width: 26px;
        height: 26px;
        margin-right: 8px;
      }

      .msg {
        max-width: 183px;
        background: #fff;
        border-radius: 2px;
        display: flex;
        align-items: center;
        padding: 7px 11px;
        font-size: 12px;
        word-break: break-all;
        white-space: pre-wrap;
        position: relative;

        img {
          max-width: 128px;
          max-height: 128px;
        }
      }

      .link {
        width: 100%;
        flex-direction: column;

        .title {
          width: 100%;
          font-size: 12px;
          text-align: left;
          max-height: 38px;
          margin: 0 0 5px;
          overflow: hidden;
        }

        .desc {
          width: 100%;
          max-height: 54px;
          display: flex;

          span {
            flex: 1;
            overflow: hidden;
            margin-right: 5px;
            word-break: break-all;
            color: rgba(0, 0, 0, .45);
          }

          img {
            width: 40px;
            height: 40px;
          }
        }
      }
    }

    .applets {
      max-width: 145px;

      .title {
        font-size: 12px !important;
        font-weight: 500;
        margin-bottom: 5px !important;
      }

      .image{
        width: 100%;

        img{
          max-width: 88px;
          border-radius: 2px;
        }
      }
      .applets-logo {
        width: 100%;
        border-top: 1px solid #E7E7E7;
        margin-top: 9px;
        padding-top: 2px;
        font-size: 11px;
        display: flex;
        align-items: center;

        img {
          width: 17px;
        }
      }
    }
  }
}
</style>
