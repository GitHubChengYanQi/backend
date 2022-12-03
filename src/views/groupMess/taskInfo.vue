<template>
  <div class="A_page">
    <a-card class="A_card">
      <div class="A_header">
        <div
          class="A_info_box"
          v-for="(item,index) in info.type"
          :key="index"
        >
          <div class="info_title">{{ item.title }}</div>
          <div class="info_content">
            <span
              class="button"
              v-if="item.type == 'button'"
            >
              <span class="text">
                {{ info.data[item.key] }}
              </span>
              <span
                class="btn_box"
                :style="`background-color:${info.btnState[info.data.btn].color}`"
              >{{ info.btnState[info.data.btn].txt }}</span>
              <span
                class="hint"
                v-if="info.data.btn == 3 && cause.length > 0"
              >
                <img
                  style="margin-right:10px;"
                  :src="require('@/assets/warning.svg')"
                  alt=""
                >
                {{ cause }}
              </span>
            </span>
            <span
              class="content"
              v-else-if="item.type == 'content'"
            >
              <span
                class="text"
                v-for="(items,indexs) in info.data[item.key]"
                :key="indexs"
              >
                {{ info.state[items - 1] + (indexs + 1 != info.data[item.key].length ? '+' : '') }}
              </span>
              <span
                class="btn"
                @click="()=>{
                  keepState = true
                }"
              >预览消息</span>
            </span>
            <span
              class="txt"
              v-else
            >{{ info.data[item.key] }}</span>
          </div>
        </div>
      </div>
      <div class="A_table_box">
        <div class="A_tab_box">
          <div
            class="A_tab"
            v-for="(item,index) in table.tabArr"
            :key="index"
            @click="setTab(index)"
            :style="table.tab == index ? {color:'rgb(0, 82, 217)',borderBottom:'1px solid rgb(0, 82, 217)'}:{}"
          >
            {{ item }}
          </div>
          <a-button
            type="primary"
            class="button"
            @click="exportsElxe"
          >导出</a-button>
        </div>
        <div class="A_table">
          <a-table
            :columns="table.columns[table.tab]"
            :data-source="table.tableData"
            rowKey="id"
            :row-selection="{selectedRowKeys:table.rowSelection,onChange: onSelectChange}"
            :pagination="table.pagination"
            @change="handleTableChange"
          ></a-table>
        </div>
      </div>
    </a-card>
    <div
      class="A_keep_out"
      @mousewheel="mousewheel"
      v-if="keepState"
    >
      <div class="preview">
        <div class="header">
          客户群名称
          <span
            class="close"
            @click="()=>{
              keepState =false
            }"
          >+</span>
        </div>
        <div
          class="content_box"
          @mousewheel="previewMouse"
        >
          <div
            class="box"
            v-for="(item,index) in contentArray"
            :key="index"
          >
            <div class="user">
              <img
                src="./images/user.png"
                alt=""
              >
            </div>
            <div class="content">
              <div
                class="text"
                v-if="item.type === 1"
              >
                <!-- style="max-width:100%;max-height:300px" -->
                {{ item.textData }}
              </div>
              <div
                class="image"
                v-if="item.type === 2"
              >
                <!-- style="max-width:100%;max-height:300px" -->
                <img
                  class="img"
                  :src="item.photoUrl"
                  alt
                />
              </div>
              <div
                class="video"
                v-if="item.type === 3"
              >
                <div
                  class="poster"
                  v-if="item.showPoster"
                >{{ returnErrorText(item.videoUrl) }}</div>
                <video
                  v-else
                  class="poster"
                  :src="item.videoUrl"
                  @error="videoLoadErr(index)"
                  alt
                />
              </div>
              <div
                class="link"
                v-if="item.type === 4"
              >
                <div class="lef">
                  <span class="til">{{ item.linkTitle }}</span>
                  <span class="desc">{{ item.linkUrl ? item.linkUrl: '' }}</span>
                  <span class="desc">{{ item.linkShow ? item.linkShow: '' }}</span>
                </div>
                <img
                  :src="item.linkPhoto"
                  alt
                  class="image"
                />
              </div>
              <div
                class="embed"
                v-else-if="item.type === 5"
              >
                <div class="line">
                  <img
                    src="./images/miniProgramIcon.svg"
                    alt
                    class="icon"
                  />
                  <span class="til">{{ '小程序标题' }}</span>
                </div>
                <div class="line desc">{{ item.appShow }}</div>
                <img
                  :src="item.appPhoto"
                  alt
                  class="image"
                />
                <div class="line">
                  <img
                    src="./images/miniProgramIcon.svg"
                    alt
                    class="icon"
                  />
                  <span class="say">小程序</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workRoomShiftLoad, workRoomShiftBack, workRoomShiftDown } from '@/api/groupMess.js'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

export default {
  data () {
    return {
      info: {
        type: [
          {
            title: '任务名称：',
            type: 'button',
            key: 'taskName'
          },
          {
            title: '创建时间：',
            type: 'txt',
            key: 'createdAt'
          },
          {
            title: '开始时间：',
            type: 'txt',
            key: 'occur'
          },
          {
            title: '消息内容：',
            type: 'content',
            key: 'content'
          }
        ],
        data: {
          taskName: '',
          createdAt: '',
          occur: '',
          content: [],
          btn: '0'
        },
        state: ['文本内容', '【图片】', '【视频】', '【链接】', '【小程序】'],
        btnState: [
          {
            txt: '任务待开始',
            color: '#df742c'
          },
          {
            txt: '正在进行',
            color: '#004dcc'
          },
          {
            txt: '已完成',
            color: '#009e69'
          },
          {
            txt: '创建失败',
            color: '#d64854'
          }
        ]
      },
      table: {
        tab: 0,
        tabArr: ['未执行', '已执行', '无法执行'],
        columns: {
          0: [
            {
              title: '员工',
              dataIndex: 'name'
            },
            {
              title: '预计送达客户群数',
              dataIndex: 'data$0'
            }
          ],
          1: [
            {
              title: '员工',
              dataIndex: 'name'
            },
            {
              title: '预计送达客户群数',
              dataIndex: 'data$0'
            },
            {
              title: '实际送达客户群数',
              dataIndex: 'data$1'
            },
            {
              title: '送达时间',
              dataIndex: 'time'
            }
          ],
          2: [
            {
              title: '员工',
              dataIndex: 'name'
            },
            {
              title: '无法执行客户群数',
              dataIndex: 'data$0'
            }
          ]
        },
        tableData: [],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共${total}条数据 `,
          pageSizeOptions: ['10', '20', '30', '50']
        },
        rowSelection: []
      },
      contentArray: [],
      keepState: false,
      tableId: -1,
      cause: ''
    }
  },
  created () {
    this.getUrl()
  },
  methods: {
    returnErrorText (url) {
      return '暂不支持显示 .avi 格式的视频'
    },
    videoLoadErr (index) {
      console.log(index)
      this.contentArray[index].showPoster = true
      this.$forceUpdate()
    },
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('id')) return
      this.tableId = object.id
      this.type = object.type
      this.getTableData()
      this.getInfo()
    },
    getInfo () {
      const obj = {
        id: this.tableId
      }
      console.log(obj)
      workRoomShiftLoad(obj).then((res) => {
        console.log(res)
        const { data } = res
        this.contentArray = data.plain.length > 0 ? [
          {
            type: 1,
            textData: data.plain
          },
          ...data.stuff
        ] : data.stuff
        this.info.data.content = this.contentArray.map((item) => {
          return item.type
        })
        this.info.data.taskName = data.name
        this.info.data.occur = data.occur
        this.info.data.createdAt = data.createdAt
        this.info.data.btn = data.state - 1
        this.cause = data.cause
      })
    },
    setTab (e) {
      this.table.tab = e
      this.table.rowSelection = []
      this.table.pagination.current = 1
      this.table.pagination.pageSize = 10
      this.getTableData()
    },
    previewMouse (e) {
      e.stopPropagation()
    },
    exportsElxe () {
      const obj = {
        id: this.tableId,
        index: this.table.tab,
        kagi: this.table.rowSelection.join(',')
      }
      console.log(obj)
      workRoomShiftDown(obj).then((res) => {
        console.log(res)
        callDownLoadByBlob(res, '群发数据')
      })
    },
    onSelectChange (e) {
      this.table.rowSelection = e
    },
    mousewheel (e) {
      e.preventDefault()
    },
    handleTableChange ({ current, pageSize }) {
      console.log(current, pageSize)
      this.table.pagination.pageSize = pageSize
      this.table.pagination.current = current
      this.getTableData()
    },
    getTableData () {
      const { current, pageSize } = this.table.pagination
      const obj = {
        id: this.tableId,
        index: this.table.tab,
        current,
        size: pageSize
      }
      const tabArr = ['todo', 'done', 'undo']
      workRoomShiftBack(obj).then((res) => {
        console.log(res)
        this.table.tableData = res.data[tabArr[this.table.tab]]
        console.log(this.table.tableData)
        this.table.pagination.total = res.data.total
      })
    }
  }
}
</script>

<style lang="less" scoped>
.A_page {
  width: 100%;
  .A_card {
    width: 100%;
    .A_header {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 0;
      border-bottom: 1px solid #ccc;
      .A_info_box {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 14px;
        text-align: left;
        font-family: '微软雅黑', sans-serif;
        font-weight: 400;
        margin-bottom: 20px;
        .info_title {
          margin-left: 50px;
          white-space: nowrap;
        }
        .info_content {
          flex-shrink: 1;
          white-space: nowrap;
          .button {
            display: flex;
            align-items: center;

            .btn_box {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 10px;
              padding: 2px 10px;
              border-radius: 5px;
              min-width: 75px;
              height: 35px;
              color: #fff;
            }
            .hint {
              display: flex;
              align-items: center;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.8980392156862745);
              margin-left: 20px;
              max-width: 817px;
              padding: 15px 20px;
              border-radius: 5px;
              background-color: rgba(249, 224, 199, 1);
            }
          }
        }

        .btn {
          margin-left: 20px;
          cursor: pointer;
          color: #3470ff;
        }
      }
    }
    .A_table_box {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 50px;
      .A_tab_box {
        display: flex;
        align-items: center;
        .A_tab {
          text-align: center;
          line-height: 48px;
          width: 88px;
          height: 48px;
          cursor: pointer;
        }
        .button {
          margin-left: auto;
        }
      }
    }
  }
  .A_keep_out {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100vh;
    .preview {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 384px;
      height: 628px;
      border-radius: 20px;
      margin-top: 20px;
      background-color: #e8eaed;
      .header {
        position: relative;
        font-size: 15px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px 20px 0 0;
        width: 100%;
        height: 60px;
        background-color: #5286d9;
        .close {
          cursor: pointer;
          position: absolute;
          top: 50%;
          right: 20px;
          font-size: 22px;
          transform: rotate(45deg) translate(-50%, -50%);
        }
      }
      .content_box {
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        padding-top: 10px;
        height: 550px;
        overflow: auto;
        // background-color: pink;
        .box {
          min-width: 200px;
          min-height: 50px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;

          .content {
            position: relative;
            .video {
              max-width: 200px;
              min-height: 100px;
              .poster {
                background: #fff;
                width: 100%;
                min-width: 200px;
                min-height: 100px;
                height: auto;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .link {
              width: 250px;
              height: 80px;
              border: 1px solid #cdcdcd;
              background-color: #fff;
              border-radius: 5px;
              flex: none;
              padding: 10px;
              display: flex;
              .lef {
                width: 160px;
                margin-right: 10px;
                font-size: 13px;
                .til {
                  width: 100%;
                  color: #4074f6;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                  display: inline-block;
                }
                .desc {
                  width: 100%;
                  white-space: nowrap;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
              .image {
                flex: 1;
                height: 100%;
                max-width: 58px;
              }
            }
            .embed {
              background-color: #fff;
              width: 230px;
              border: 1px solid #cdcdcd;
              flex: none;
              display: flex;
              flex-direction: column;
              padding: 8px 10px;
              .line {
                width: 100%;
                display: flex;
                align-items: center;
                .icon {
                  width: 17px;
                  height: 17px;
                }
                .til {
                  color: #4074f6;
                }
              }
              .desc {
                font-size: 13px;
                margin-top: 3px;
              }
              .image {
                height: 180px;
                margin: 3px 0;
              }
            }
            .image {
              max-width: 200px;
              min-height: 50px;
              .img {
                background-color: #fff;
                width: auto;
                height: auto;
                max-width: 100%;
                max-height: 100%;
              }
            }
            .text {
              background-color: #fff;
              border-radius: 10px;
              padding: 10px;
              width: 200px;
              word-wrap: break-word;
              table-layout: fixed;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}
</style>
