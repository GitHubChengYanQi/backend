<template>
  <div class="a_page">
    <div class="a_card">
      <div class="a_content">
        <div class="title">
          基础设置
        </div>
        <div class="content">
          <div class="input_box" v-for="(item,index) in setData.inputType" :key="index">
            <span class="title">{{ item.title }}</span>
            <span class="input">
              <span class="box">
                <a-input v-model="setData.inputData[item.key]" :maxLength="item.fontNumber"></a-input>
                <span class="hint">{{ setData.inputData[item.key].length + '/' + item.fontNumber }}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'

export default {
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
          changeData: {
            1: {
              radarLink: '',
              linkTitle: '',
              linkDigest: '',
              linkImg: ''
            },
            2: {
              radarPDF: ''
            },
            3: {
              type: '0',
              0: {
                txt: '',
                imgLink: ''
              },
              1: {
                articleLink: '',
                txt: '',
                imgLink: ''
              },
              2: {
                linkTitle: '',
                linkDigest: '',
                linkImg: '',
                content: ''
              }
            },
            4: {
              linkTitle: '',
              linkDigest: '',
              linkImg: '',
              content: ''
            }
          }
        }
      },
      selectArr: {
        type: [],
        grouping: [],
        channel: [],
        sourceType: [{ type: 0, title: '素材库' }, { type: 1, title: '公众号' }, { type: 2, title: '新建' }]
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
            key: 'linkImg'
          }
        ],
        2: [
          {
            title: '雷达PDF：',
            type: 'uploading',
            key: 'radarPDF'
          }
        ],
        3: {
          type: [{
            title: '内容来源：',
            type: 'radio',
            key: 'contentSource',
            selectKey: 'sourceType'
          }],
          0: [
            {
              title: '素材：'
            }
          ],
          1: [
            {
              title: '文章链接：',
              type: 'inputBtn',
              placeholder: '已绑定的公众号文章链接',
              btnTxt: '生成雷达文章',
              key: 'articleLink'
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
              key: 'linkImg'
            },
            {
              title: '具体内容：',
              type: 'quillEditor',
              key: 'content'
            }
          ]
        },
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
            key: 'linkImg'
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
    this.getSelect('radar_type', 'type')
  },
  methods: {
    getSelect (e, key) {
      if (key == 'type') {
        const obj = {
          dictType: e
        }
        getDict(obj).then((res) => {
          console.log(res)
          const { data } = res
          this.selectArr[key] = data.slice(1, data.length)
          console.log(this.selectArr)
        })
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
    padding: 20px 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 20px;
    .a_content {
    }
  }
}
</style>
