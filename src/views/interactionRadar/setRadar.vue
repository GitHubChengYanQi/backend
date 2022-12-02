<template>
  <div class="a_page">
    <div class="a_card">
      <div class="a_content">
        <div class="a_title">
          基础设置
        </div>
        <div class="content">
          <div
            class="row"
            :style="item.type == 'cover'|| item.type == 'quillEditor' ? {alignItems:'flex-start'}:{}"
            v-for="(item,index) in setData.changeType"
            :key="index"
          >
            <span class="title"><span class="icon">*</span><span class="text">{{ item.title }}</span></span>
            <span class="import_box">
              <span
                class="select_box"
                v-if="item.type == 'select'"
              >
                <a-select
                  class="select"
                  v-model="setData.inputData[item.key]"
                  v-if="item.type == 'select'"
                >
                  <a-select-option
                    v-for="(items,indexs) in selectArr[item.selectKey]"
                    :value="items.code"
                    :key="indexs"
                  >{{ items.name }}</a-select-option>
                </a-select>
              </span>
              <span
                class="checkbox_box"
                v-else-if="item.type == 'checkbox'"
              >
                <a-select
                  class="checkbox"
                  allowClear
                  mode="multiple"
                  :placeholder="item.placeholder"
                  v-model="setData.inputData[item.key]"
                >
                  <a-select-option
                    v-for="(items,indexs) in selectArr[item.selectKey]"
                    :value="items.code"
                    :key="indexs"
                  >{{ items.name }}</a-select-option>
                </a-select>
              </span>
              <span
                class="radio_box"
                v-else-if="item.type == 'radio'"
              >
                <a-radio-group
                  @change="setType"
                  class="radio"
                  v-model="setData.inputData[item.key]"
                >
                  <a-radio
                    :value="items.code"
                    v-for="(items,indexs) in selectArr[item.selectKey]"
                    :key="indexs"
                  >{{ items.name }}</a-radio>
                </a-radio-group>
              </span>
              <span
                class="cover_box"
                v-else-if="item.type == 'cover'"
              >
                <div class="add_img_box">
                  <img
                    class="add_icon"
                    :src="require('@/assets/add_icon.svg')"
                    alt=""
                  >
                </div>
                <div
                  class="hint"
                  v-if="item.hint"
                >{{ item.hint }}</div>
              </span>
              <span
                class="uploading_box"
                v-else-if="item.type == 'uploading'"
              >
                <img
                  class="uploading_icon"
                  :src="require('@/assets/upload_btn.png')"
                  alt=""
                >
                <div
                  class="hint"
                  v-if="item.hint"
                >{{ item.hint }}</div>
              </span>
              <span
                class="quillEditor_box"
                v-else-if="item.type == 'quillEditor'"
              >
                <quill-editor
                  @editorChange="editorChange"
                  :value="setData.inputData[item.key]"
                />
              </span>
              <span
                class="input_box"
                v-else
              >
                <a-input
                  class="input"
                  :placeholder="item.placeholder"
                  v-model="setData.inputData[item.key]"
                  :maxLength="item.fontNumber"
                ></a-input>
                <span
                  class="hint"
                  v-if="item.fontNumber"
                >{{ setData.inputData[item.key].length + '/' + item.fontNumber }}</span>
                <a-button
                  v-if="item.btnState"
                  type="primary"
                  class="button"
                >生成雷达文章</a-button>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuillEditor from './components/QuillEditor'
export default {
  components: { 'quill-editor': QuillEditor },
  data () {
    return {
      setData: {
        inputType: [
          {
            title: '雷达标题：',
            type: 'input',
            key: 'radarTitle',
            fontNumber: 15
          },
          {
            title: '选择分组：',
            type: 'select',
            key: 'selectGrouping',
            selectKey: 'grouping'
          },
          {
            title: '选择渠道：',
            type: 'checkbox',
            key: 'selectChannel',
            selectKey: 'channel',
            placeholder: '未选中渠道'
          },
          {
            title: '内容类型：',
            type: 'radio',
            key: 'contentType',
            selectKey: 'type'
          }
        ],
        inputData: {
          radarTitle: '',
          selectGrouping: '',
          selectChannel: [],
          contentType: '1',
          radarLink: '',
          linkTitle: '',
          linkDigest: '',
          linkImg: '',
          radarPDF: '',
          content: '',
          contentSource: '0',
          articleLink: '',
          material: ''
        },
        articleArr: {
          0: [
            {
              title: '素材：',
              type: 'input',
              key: 'material',
              fontNumber: 15
            }
          ],
          1: [
            {
              title: '文章链接：',
              type: 'input',
              key: 'articleLink',
              fontNumber: 15,
              placeholder: '已绑定的公众号文章链接',
              btnState: true
            }
          ],
          2: [
            {
              title: '链接标题：',
              type: 'input',
              key: 'linkTitle',
              fontNumber: 15
            },
            {
              title: '链接摘要：',
              type: 'input',
              key: 'linkDigest',
              fontNumber: 30
            },
            {
              title: '链接封面：',
              type: 'cover',
              key: 'linkImg',
              hint: '图片大小不超过10M，支持JPG、JPEG及PNG格式'
            },
            {
              title: '具体内容：',
              type: 'quillEditor',
              key: 'content'
            }
          ]
        },
        changeType: []
      },
      selectArr: {
        type: [
          {
            code: '1',
            name: '链接'
          },
          {
            code: '2',
            name: 'PDF'
          },
          {
            code: '3',
            name: '图文/文章'
          },
          {
            code: '4',
            name: '视频'
          }
        ],
        grouping: [],
        channel: [],
        sourceType: [
          { code: '0', name: '素材库' },
          { code: '1', name: '公众号' },
          { code: '2', name: '新建' }
        ]
      },
      change: {
        1: [
          {
            title: '雷达链接：',
            type: 'input',
            key: 'radarLink'
          },
          {
            title: '链接标题：',
            type: 'input',
            key: 'linkTitle',
            fontNumber: 15
          },
          {
            title: '链接摘要：',
            type: 'input',
            key: 'linkDigest',
            fontNumber: 30
          },
          {
            title: '链接封面：',
            type: 'cover',
            key: 'linkImg',
            hint: '图片大小不超过10M，支持JPG、JPEG及PNG格式'
          }
        ],
        2: [
          {
            title: '雷达PDF：',
            type: 'uploading',
            key: 'radarPDF',
            hint: 'PDF文件大小不超过20M'
          }
        ],
        3: [
          {
            title: '内容来源：',
            type: 'radio',
            key: 'contentSource',
            selectKey: 'sourceType'
          }
        ],
        4: [
          {
            title: '链接标题：',
            type: 'input',
            key: 'linkTitle',
            fontNumber: 15
          },
          {
            title: '链接摘要：',
            type: 'input',
            key: 'linkDigest',
            fontNumber: 30
          },
          {
            title: '链接封面：',
            type: 'cover',
            key: 'linkImg',
            hint: '图片大小不超过10M，支持JPG、JPEG及PNG格式'
          },
          {
            title: '具体内容：',
            type: 'quillEditor',
            key: 'content'
          }
        ]
      }
    }
  },
  created () {
    this.setType()
  },
  methods: {
    editorChange (html) {
      console.log(html)
    },
    setType () {
      const { contentType, contentSource } = this.setData.inputData
      const { inputType, articleArr } = this.setData
      const newInputType = inputType.concat(this.change[contentType])
      if (contentType == 3) {
        const articleType = newInputType.concat(articleArr[contentSource])
        console.log(articleType)
        this.$set(this.setData, 'changeType', articleType)
      } else {
        this.$set(this.setData, 'changeType', newInputType)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.a_page {
  width: 100%;
  color: #333333;
  font-size: 14px;
  font-family: 'Arial Normal', 'Arial';
  font-weight: 400;
  font-style: normal;
  .a_card {
    width: 100%;
    min-height: 770px;
    box-sizing: border-box;
    padding: 20px 30px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 20px;
    .a_content {
      width: 100%;
      .a_title {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .content {
        width: 100%;
        .row {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .title {
            white-space: nowrap;
            margin-right: 10px;
            .icon {
              color: red;
            }
          }
          .import_box {
            .input_box {
              position: relative;
              display: flex;
              align-items: center;
              .input {
                width: 200px;
                height: 40px;
                padding-right: 60px;
              }
              .hint {
                position: absolute;
                top: 50%;
                right: 0;
                transform: translate(-50%, -50%);
              }
              .button {
                margin-left: 20px;
              }
            }
            .select_box {
              .select {
                width: 200px;
                height: 40px;
              }
            }
            .checkbox_box {
              .checkbox {
                width: 200px;
                height: 40px;
              }
            }
            .cover_box {
              display: flex;
              align-items: flex-end;
              .add_img_box {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 73px;
                height: 68px;
                background-color: #fff;
                border-radius: 5px;
                border: 1px solid #ccc;
                .add_icon {
                  width: 30px;
                  height: auto;
                }
              }
              .hint {
                margin-left: 20px;
                background-color: rgba(30, 159, 255, 0.2);
                padding: 10px;
                border-radius: 5px;
              }
            }
            .uploading_box {
              display: flex;
              .uploading_icon {
                cursor: pointer;
                width: auto;
                height: 36px;
              }
              .hint {
                width: 180px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                margin-left: 20px;
                background-color: rgba(30, 159, 255, 0.2);
                border-radius: 5px;
              }
            }
            .quillEditor_box {
              width: 650px;
              min-height: 350px;
            }
          }
        }
      }
    }
  }
}
</style>
