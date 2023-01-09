<template>
  <div>
    <!-- 图片上传组件辅助-->
    <a-upload
      :loading="loading"
      class="avatar-uploader"
      :action="serverUrl"
      name="file"
      :headers="headers"
      method="post"
      :showUploadList="false"
      list-type="picture-card"
      :before-upload="beforeUpload"
      @change="handleChange"
      :data="{time:1}"></a-upload>
    <quill-editor
      class="myQuillEditor"
      v-model="content"
      ref="editor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @change="onEditorChange($event)"></quill-editor>
  </div>
</template>
<script>
import { quillEditor, Quill } from 'vue-quill-editor'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import storage from 'store'

import { addQuillTitle } from './quill-title.js'

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote'], // 引用  代码块, 'code-block'
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进  //
  [{ direction: 'rtl' }], // 文本方向
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ['clean'], // 清除文本格式
  ['link', 'image'] // 链接、图片、视频
]
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)

export default {
  components: {
    quillEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      content: this.value,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          imageDrop: true, // 图片拖拽
          imageResize: {
            // 放大缩小
            displaySize: true
          },
          // theme:'snow',
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      },
      serverUrl: process.env.VUE_APP_API_BASE_URL + '/common/upload', // 这里写你要上传的图片服务器地址
      isShowCropper: false,
      loading: false,
      // imageUrl: '',
      FileTypeArr: [
        '',
        ['jpg', 'png', 'jpeg'],
        ['mp3', 'amr'],
        ['mp4'],
        ['doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'pdf', 'Xmind']
      ],
      fileType: []
    }
  },
  computed: {
    headers () {
      const token = storage.get('ACCESS_TOKEN')
      return {
        Accept: `application/json`,
        Authorization: token
      }
    }
  },
  methods: {
    // 富文本内容改变事件
    onEditorChange ({ editor, html, text }) {
      this.$emit('editorChange', html)
      this.$emit('change', html)
    },
    // 失去焦点事件
    onEditorBlur () {
    },
    // 获得焦点事件
    onEditorFocus () {
    },
    // 富文本图片上传前
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('支持JPG、PNG格式的图片，大小不得超过2M')
      }
      if (!isLt2M) {
        this.$message.error('文件最大不得超过2M')
      }
      return isJPG && isLt2M
    },
    // 上传图片
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        const res = info.file.response
        const quill = this.$refs.myQuillEditor.quill
        const length = quill.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        if (res.code == 200) {
          quill.insertEmbed(length, 'image', res.data.fullPath)
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          this.$message.error('文件上传失败')
        }
        this.$emit('success', res.data)
        this.loading = false
      }
      if (info.file.status === 'error') {
        if (info.file.response) {
          const data = info.file.response
          this.$message.error(data.msg)
        }
      }
    },
    HandleCustomMatcher (node, Delta) {
      const ops = []

      Delta.ops.forEach((op) => {
        if (op.insert && typeof op.insert === 'string') {
          ops.push({
            insert: op.insert
          })
        } else {
          ops.push({
            insert: op.insert
          })
          console.log(op.insert)
        }
      })

      Delta.ops = ops

      return Delta
    }
  },
  mounted () {
    this.$nextTick(() => {
      addQuillTitle()
    })
  }
}
</script>
//汉化样式

<style lang="less">

.avatar-uploader {
  display: none;
}

.myQuillEditor {
  line-height: normal !important;
  height: 354px;
}

.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker .ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}

ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: '等宽字体';
}
</style>
