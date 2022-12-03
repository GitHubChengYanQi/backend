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
            <span class="title"><span
              class="icon"
              v-if="item.title"
            >*</span><span class="text">{{ item.title }}</span></span>
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
                <div>
                  <img
                    class="cover_img"
                    @click="setMedium(2)"
                    v-if="setData.inputData[item.key].length != 0"
                    :src="setData.inputData[item.key]"
                    alt=""
                  >
                  <div
                    v-else
                    class="add_img_box"
                    @click="setMedium(2)"
                  >
                    <img
                      class="add_icon"
                      :src="require('@/assets/add_icon.svg')"
                      alt=""
                    >
                  </div>
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
                  @click="setMedium(7)"
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
                  @setMedium="setMedium"
                  :value="setData.inputData[item.key]"
                  ref="editor"
                />
              </span>
              <span
                class="button_box"
                v-else-if="item.type == 'button'"
              >
                <a-button
                  type="primary"
                  class="button"
                  @click="setMedium(3)"
                >{{ item.btnText }}</a-button>
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
    <a-modal
      v-model="modalState"
      :title="modalTitle"
      centered
      width="700px"
      @ok="setCatalog"
      @cancel="setMedium(-1)"
    >
      <div class="model_input_box">
        <div class="model_tab_box">
          <div
            class="model_tab"
            :style="modelTab == index ? { color:'#1c96f0',borderBottom:'1px solid #1c96f0' }:{}"
            @click="setModelTab(item.key)"
            v-for="(item,index) in isImageText ? tabArr.slice(1,2) : tabArr"
            :key="index"
          >{{ item.title }}</div>
        </div>
        <div class="model_content">
          <div
            class="upload_box"
            v-if="modelTab == 0"
          >
            <div
              v-if="uploadUrl.length == 0"
              class="upload_btn"
              @click="getLink"
            >
              <img
                class="upload_icon"
                :src="require('@/assets/upload.svg')"
                alt=""
              >
              <span class="upload_text">{{ modalTitle }}</span>
            </div>
            <img
              v-else
              class="upload_image"
              :src="uploadUrl"
              alt=""
              @click="getLink"
            >
          </div>
          <div
            class="material_library_box"
            v-else
          >
            <div class="search_box">
              <div class="hint">共有{{ medium.pagination.total }}个素材</div>
              <div class="seach">
                <a-input
                  class="input"
                  v-model="modelSearch"
                  placeholder="输入要搜素的内容"
                ></a-input>
                <a-button
                  type="primary"
                  class="button"
                  @click="searchMedium"
                >搜索</a-button>
                <a-button
                  class="button"
                  @click="resetMedium"
                >清空</a-button>
              </div>
            </div>
            <div class="table_box">
              <a-table
                :columns="medium.columns"
                :row-selection="rowSelection"
                :row-key="record => record.id"
                :data-source="medium.data"
                :pagination="medium.pagination"
                @change="handleTableChange"
              >
                <div
                  slot="contents"
                  slot-scope="text, record"
                >
                  <template>
                    <img
                      :src="record.content.imageFullPath"
                      alt=""
                      style="width:80px;height:80px;"
                    >
                  </template>
                </div>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <input
      style="display:none"
      type="file"
      accept="image/jpeg, image/png"
      ref="uploadPhotoRef"
      @change="uploadPhoto"
      class="uploadFileInp"
    />
  </div>
</template>

<script>
import QuillEditor from './components/QuillEditor'
import { upLoad } from '@/api/common'
import { materialLibraryList } from '@/api/mediumGroup'

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
              type: 'button',
              btnText: '从素材库中引用',
              key: 'material'
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
      },
      modalState: false,
      modalTitle: '上传图片',
      modelTab: 0,
      uploadUrl: '',
      modelSearch: '',
      isImageText: false,
      tabArr: [
        { title: '本地上传', key: 0 },
        { title: '素材库', key: 1 }
      ],
      medium: {
        type: 2, // 类型 2图片 3图文 5 视频 7 文件
        columns: [
          {
            title: '标题',
            dataIndex: 'title',
            align: 'center'
          },
          {
            title: '内容',
            dataIndex: 'contents',
            align: 'center',
            scopedSlots: { customRender: 'contents' },
            ellipsis: true,
            width: 100
          },
          {
            title: '上传者',
            dataIndex: 'userName',
            align: 'center',
            width: 100
          },
          {
            title: '发送次数',
            dataIndex: 'sendCount',
            align: 'center'
          },
          {
            title: '素材来源',
            dataIndex: 'mediumGroupName',
            align: 'center',
            width: 100
          },
          {
            title: '类型',
            dataIndex: 'type',
            align: 'center',
            width: 100
          },
          {
            title: '添加时间',
            dataIndex: 'createdAt',
            align: 'center',
            width: 120
          }
        ],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10,
          showSizeChanger: true
        },
        data: []
      },
      radio: {
        id: -1,
        content: {},
        idArr: []
      },
      isEditor: false
    }
  },
  created () {
    this.setType()
  },
  computed: {
    dataListSelectionKeys () {
      return this.radio.idArr || []
    },
    rowSelection () {
      return {
        type: 'radio', // 单选按钮定义
        selectedRowKeys: this.dataListSelectionKeys,
        onChange: (key, row) => {
          this.getRadio(key, row[0])
        },
        getCheckboxProps: (record) => ({
          props: {
            // 全部默认禁止选中
            disabled: record.type == '文件' ? record.content.fileName.split('.')[1] != 'pdf' : false
          }
        })
      }
    }
  },
  methods: {
    handleTableChange ({ current, pageSize }) {
      this.medium.pagination.current = current
      this.medium.pagination.pageSize = pageSize
      this.getMedium()
    },
    async uploadPhoto (e) {
      console.log(e, '上传图片对象')
      if (e && e.target && e.target.files.length !== 0) {
        const file = e.target.files[0]
        const fileArray = file.name.split('.')
        const suffix = fileArray[fileArray.length - 1]
        if (!['jpg', 'jpeg', 'png'].includes(suffix)) {
          return this.$message.warn('请上传 JPG、JPEG及PNG格式的图片文件')
        }
        if (file.size > 10 * 1000 * 1000) {
          return this.$message.warn('请上传小于10MB的图片文件')
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('time', 1)
        const res = await upLoad(formData)
        console.log(res)
        this.uploadUrl = res.data.fullPath
      } else {
        console.log(e)
      }
    },
    getRadio (key, row) {
      console.log(key, row)
      this.radio.idArr = key
      this.radio.id = key[0]
      this.radio.content = row.content
    },
    getLink () {
      this.$refs.uploadPhotoRef.value = ''
      this.$nextTick(() => {
        this.$refs['uploadPhotoRef'].click()
      })
    },
    setModelTab (e) {
      this.modelTab = e
      if (e == 1) {
        this.getMedium()
      } else {
        this.radio = {
          id: -1,
          content: {},
          idArr: []
        }
      }
    },
    setCatalog () {
      if (this.modelTab == 0) {
        if (this.medium.type == 2) {
          if (!this.isEditor) {
            this.setData.inputData.linkImg = this.uploadUrl
          } else {
            this.$refs.editor[0].getEditorData('image', this.uploadUrl)
          }
          this.uploadUrl = ''
        }
      } else {
        if (this.radio.id == -1) return this.$message.warn('至少选择一个图片')
        this.setData.inputData.linkImg = this.radio.content.imageFullPath
        this.radio = {
          id: -1,
          content: {},
          idArr: []
        }
        this.modelTab = 0
      }

      this.modalState = false
    },
    editorChange (html) {
      // console.log(html)
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
        this.setData.inputData.contentSource = '0'
        this.$set(this.setData, 'changeType', newInputType)
      }
      this.setData.inputData.linkImg = ''
    },
    searchMedium () {
      this.medium.pagination.current = 1
      this.getMedium()
    },
    resetMedium () {
      this.medium.pagination.current = 1
      this.medium.pagination.pageSize = 10
      this.modelSearch = ''
      this.getMedium()
    },
    getMedium () {
      const { current, pageSize } = this.medium.pagination
      const obj = {
        page: current,
        perPage: pageSize,
        type: this.medium.type,
        searchStr: this.modelSearch
      }
      materialLibraryList(obj).then((res) => {
        const { page, list } = res.data
        console.log(res)
        this.medium.pagination.total = page.total
        this.medium.data = list.map((item) => {
          item.title = item.content.title
          return item
        })
      })
    },
    setMedium (e, isEditor = false) {
      this.isEditor = isEditor
      const title = {
        2: {
          title: '上传图片'
        },
        3: {
          title: '选择图文'
        },
        5: {
          title: '上传视频'
        },
        7: {
          title: '上传PDF'
        }
      }
      this.medium.type = e == -1 ? 2 : e
      this.modalTitle = e == -1 ? '上传图片' : title[e].title
      this.modalState = e != -1
      if (e == -1) {
        this.uploadUrl = ''
        this.medium.data = []
        this.modelTab = 0
        this.isImageText = false
      } else if (e == 3) {
        this.modelTab = 1
        this.isImageText = true
        this.getMedium()
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
    // min-height: 770px;
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
            min-width: 70px;
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
              .cover_img {
                cursor: pointer;
                width: 80px;
                height: 80px;
              }
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
.model_input_box {
  width: 700px;
  height: 490px;
  .model_tab_box {
    width: 100%;
    height: 50px;
    font-family: 'Arial Normal', 'Arial';
    font-weight: 400;
    font-style: normal;
    font-size: 13px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    .model_tab {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 20px;
      cursor: pointer;
    }
  }
  .model_content {
    height: 440px;
    overflow: auto;
    .upload_box {
      margin-top: 10px;
      width: 100%;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .upload_btn {
        width: 115px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #1c96f0;
        border-radius: 5px;
        color: #fff;
        .upload_icon {
          margin-right: 5px;
          height: 15px;
          width: auto;
        }
      }

      .upload_image {
        cursor: pointer;
        width: 80px;
        height: auto;
      }
    }
    .material_library_box {
      width: 100%;
      height: 440px;
      overflow: auto;
      .search_box {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 18px;
        .hint {
          margin-bottom: 8px;
        }
        .seach {
          display: flex;
          align-items: center;
          .input {
            width: 165px;
            height: 25px;
          }
          .button {
            width: auto;
            height: 25px;
          }
        }
      }
    }
  }
}
::v-deep(.ant-modal-header) {
  font-size: 14px;
  text-align: start;
  font-family: 'Arial Normal', 'Arial';
  font-weight: 400;
  color: #333333;
  background-color: #e9e9e9;
}

::v-deep(.ant-modal-body) {
  padding: 0;
}
</style>
