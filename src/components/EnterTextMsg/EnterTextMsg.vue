<template>
  <div class="enter-text-msg">
    <div class="box">
      <div class="header">
        <div class="item" @click="addName">
          插入客户名称
        </div>
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link">
            <div class="item">
              添加附件
            </div>
          </a>
          <a-menu slot="overlay">
            <a-menu-item @click="$refs.image.$show()">
              <img src="../../assets/image-icon.png"/>
              <span>图片</span>
            </a-menu-item>
            <a-menu-item @click="$refs.link.$show()">
              <img src="../../assets/link-icon.png"/>
              <span>链接</span>
            </a-menu-item>
            <a-menu-item @click="$refs.applet.$show()">
              <img src="../../assets/applet-icons.png"/>
              <span>小程序</span>
            </a-menu-item>
            <!-- <a-menu-item @click="$refs.luck.$show()">
              <img src="../../assets/luck-paw.png"/>
              <span>抽奖活动</span>
            </a-menu-item> -->
          </a-menu>
        </a-dropdown>
      </div>
      <div class="content">
        <textarea ref="textarea" v-model="text" @input="emitData"/>
      </div>
      <div class="files" v-if="files.length">
        <div class="item flex-between" v-for="(v,i) in files" :key="i">
          <div class="left">
            【{{ fileMap[v.type].text }}】：{{ v.title ? v.title : '-' }}
          </div>
          <div class="right fz16">
            <a-icon type="form" class="mr12 pointer" @click="editFileShow(v)"/>
            <a-icon type="delete" class="pointer" @click="delFile(i)"/>
          </div>
        </div>
      </div>
    </div>

    <z-image ref="image" @change="fileChange($event,'image')" @edit="fileUpdateChange($event,'image')"/>
    <z-link ref="link" @change="fileChange($event,'link')" @edit="fileUpdateChange($event,'link')"/>
    <!-- <z-luck ref="luck" @change="fileChange($event,'luck')" @edit="fileUpdateChange($event,'luck')"/> -->
    <z-applet ref="applet" @change="fileChange($event,'applet')" @edit="fileUpdateChange($event,'applet')"/>
  </div>
</template>

<script>
import Image from '@/components/EnterTextMsg/Pop/Image'
import Link from '@/components/EnterTextMsg/Pop/Link'
// import Luck from '@/components/EnterTextMsg/Pop/Luck'
import Applet from '@/components/EnterTextMsg/Pop/Applet'

export default {
  data () {
    return {
      text: '',
      files: [],
      fileMap: {
        image: { text: '图片', type: 1 },
        link: { text: '链接', type: 2 },
        // luck: { text: '抽奖活动', type: 2 },
        applet: { text: '小程序', type: 3 }
        // radar: { text: '互动雷达', type: 3 }
      },
      currentEditId: ''
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value'],
  watch: {
    value () {
      if (this.value.type === 'emit') return false

      this.setData(this.value)
    }
  },
  methods: {
    delFile (i) {
      this.files.splice(i, 1)

      this.emitData()
    },

    editFileShow (e) {
      this.currentEditId = e.data.id

      this.$refs[e.type].$show(e.data)
    },

    fileUpdateChange (e, type) {
      const def = () => {
        this.updateFileData(type, e.form.title, {
          id: e.form.mediumId,
          ...e.form
        })
      }

      // const luck = () => {
      //   this.updateFileData('luck', e.old[0].name, {
      //     id: e.ids[0],
      //     old: e.old
      //   })
      // }

      const map = {
        image: def,
        link: def,
        applet: def
        // luck
      }

      map[type]()

      this.emitData()
    },

    fileChange (e, type) {
      const def = () => {
        this.addFileData(type, e.form.title, {
          id: e.form.mediumId,
          ...e.form
        })
      }

      // const luck = () => {
      //   this.addFileData('luck', e.old[0].name, {
      //     id: e.ids[0],
      //     old: e.old
      //   })
      // }

      const map = {
        image: def,
        link: def,
        applet: def
        // luck
      }

      map[type]()

      this.emitData()
    },

    updateFileData (type, title, data) {
      const find = this.files.find(v => {
        return v.data.id === this.currentEditId
      })

      if (!find) {
        this.$message.error('编辑错误')

        return false
      }

      find.type = type
      find.title = title
      find.data = data
    },

    addFileData (type, title, data) {
      this.files.push({
        type,
        title,
        data
      })
    },

    addName () {
      const value = '##客户名称##'

      const textarea = this.$refs.textarea

      const startPos = parseInt(textarea.selectionStart)

      this.text = `${this.text.slice(0, startPos)}${value}${this.text.substr(startPos)}`

      this.emitData()
    },

    emitData () {
      const params = {
        words: this.text,
        mediumId: JSON.parse(JSON.stringify(this.files)),
        type: 'emit'
      }

      params.mediumId.forEach(v => {
        v.data.oldType = v.type
        v.type = this.fileMap[v.type].type
        v.id = v.data.id
      })

      this.$emit('input', params)
    },

    setData (data) {
      this.text = data.words

      const files = JSON.parse(JSON.stringify(data.mediumId))

      files.forEach(v => {
        v.type = v.data.oldType
      })

      this.files = files
    }
  },
  components: {
    'z-image': Image,
    'z-link': Link,
    // 'z-luck': Luck,
    'z-applet': Applet
  }
}
</script>

<style lang="less" scoped>
.enter-text-msg {
  width: 100%;
}

.box {
  width: 100%;
  border: 1px solid #eee;
  background: #fbfbfb;
}

.files {
  padding: 12px 0;
  border-top: 1px solid #eee;

  .item {
    padding: 0 16px;
    margin-bottom: 12px;

    .left {
      color: #565656;
    }

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
}

.header {
  border-bottom: 1px dashed #e9e9e9;
  padding: 8px 16px;

  .item {
    display: inline-flex;
    padding: 4px 13px;
    cursor: pointer;
    border-radius: 50px;
    background: #f1f2f3;
    font-size: 12px;
    box-shadow: 0 2px 2px #0000001f;
    transition: .2s;
    margin-right: 12px;
    color: #4b4b4b;

    &:hover {
      box-shadow: 0 1px 1px #0000001f;
    }

    &:active {
      transform: translateY(3px);
      box-shadow: 0 1px 1px #0000001f;
    }
  }
}

.content {
  padding: 8px 16px;
  height: 330px;

  textarea {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
  }
}

.option {
  padding: 8px 16px;
  color: #1890ff;
  font-size: 14px;
  border-top: 1px solid #eee;
  cursor: pointer;
}

/deep/ .ant-dropdown-menu-item {
  padding: 12px;
  font-size: 14px;

  img {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }
}
</style>
