<template>
  <div class="editor" ref="editor">
    <Toolbar
      style="border: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden;border:1px solid #ccc;"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onChange="onChange"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
  name: 'Editoritem',
  components: { Editor, Toolbar },
  data () {
    return {
      insertInfo: {},
      html: this.value,
      toolbarConfig: {
        modalAppendToBody: false,
        excludeKeys: [
          'insertVideo',
          'insertImage'
        ]
      },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          'uploadImage': {
            customBrowseAndUpload: this.chooseImage
          },
          'uploadVideo': {
            customBrowseAndUpload: this.chooseVideo
          }
        },
        hoverbarKeys: {
          'image': {
            menuKeys: [
              'imageWidth30',
              'imageWidth50',
              'imageWidth100',
              'deleteImage'
            ]
          }
          // 'video': {
          //   menuKeys: [
          //     'imageWidth30',
          //     'imageWidth50',
          //     'imageWidth100',
          //     'deleteImage'
          //   ]
          // }
        }
      },
      mode: 'default',
      editor: null
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear (val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    }
    // value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  created () {
  },
  mounted () {
    this.seteditor()
    // this.editor.txt.html(this.value)
  },
  beforeDestroy () {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    // 监听富文本改变
    onChange (editor) {
      console.log(editor.getHtml(), '改变editor')
      this.$emit('editorChange', editor.getHtml())
    },
    // 选择图片
    chooseImage (insertFn, file) {
      console.log(insertFn, '选择图片')
      this.$set(this.insertInfo, 'insertFn', insertFn)
      // console.log(this.insertInfo, 'this.insertInfo')
      if (file) {
        insertFn(file, '图片')
      } else {
        this.$emit('editorInfo', 2, true, 'linkImg', '0', this.insertInfo)
      }
      // customBrowseAndUpload(insertFn) {
      //   console.log('1111', that)
      //   that.$emit('editorInfo', 2, true)
      //   // $emit('editorInfo', insertFn)
      // }
    },
    // 选择视频
    chooseVideo (insertFn, file) {
      console.log(insertFn, '选择视频')
      this.$set(this.insertInfo, 'insertFn', insertFn)
      // console.log(this.insertInfo, 'this.insertInfo')
      if (file) {
        insertFn(file, '视频')
      } else {
        this.$emit('editorInfo', 5, true, 'linkImg', '0', this.insertInfo)
      }
    },
    onCreated (editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      console.log(editor.getAllMenuKeys(), '全部子配置')
    },
    seteditor () {
      // this.html = this.value
      // console.log(DomEditor.getToolbar(), 'DomEditor')
      // console.log(this.editor, 'editor')
    }
  }
}
</script>
<style lang="less">
  .editor {
    width: 100%;
    margin: auto;
    position: relative;
    .textNeirong {
      .w-e-toolbar {
        background-color: white !important;
      }
    }
  }
</style>
<style src="@wangeditor/editor/dist/css/style.css"></style>
