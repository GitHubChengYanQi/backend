<template>
  <div id="clusterExecute_Page_Container" ref="clusterExecute_Page_Container">
    <div class="leftContainer">
      <div class="searchLine">
        <div class="searchBox">
          <div class="item">
            <span>群名称:</span>
            <a-input placeholder="请输入群名称" v-model="searchValue" class="inputClass" />
            <!-- style="width: 200px; height: 35px" -->
          </div>
          <div class="item">
            <span>SOP名称:</span>
            <a-input placeholder="请输入SOP名称" v-model="searchValue" class="inputClass" />
          </div>
          <a-button
            type="primary"
            style="width: 54px;height: 34px;margin: 0 10px;"
            @click="goSearch"
          >查询</a-button>
          <a-button
            style="width: 54px;height: 34px;margin-right: 10px;"
            @click="goReset"
          >重置</a-button>
        </div>
      </div>
      <a-table
        :loading="tableLoading"
        class="tableBox"
        :row-key="record => record.id"
        :data-source="tableData"
        :columns="tableColumns"
        :pagination="pagination"
        :scroll="{ x: 1500}"
        @change="getChangeList">
        <div slot="options" slot-scope="text, record">
          <template>
            <div style="display: flex;justify-content: space-around;">
              <a-button type="link" @click="deleteItem(record.id)">删除</a-button>
            </div>
          </template>
        </div>
      </a-table>
    </div>
    <div class="rightContainer">
      <div class="rightTitleDiv">推送内容</div>
      <div class="contentBox">
        <div
          class="contentItem"
          v-for="(item, index) in sendContentArray"
          :key="index"
        >
          <div class="idx">{{ index + 1 }}</div>
          <div :class="`content ${item.type === 1 ? 'text' : ''}`" v-if="item.type === 1">{{ item.textData }}</div>
          <div :class="`content ${item.type === 2 ? 'image': ''}`" v-else-if="item.type === 2">
            <!-- style="max-width:100%;max-height:300px" -->
            <img :src="item.photoUrl" alt />
          </div>
          <div :class="`content ${item.type === 3 ? 'video' : ''}`" v-else-if="item.type === 3">
            <!-- v-if="sopList[selectSopItemIdx].content[index].showPoster" -->
            <div class="poster" v-if="item.showPoster">{{ returnErrorText(item.videoUrl) }}</div>
            <video :src="item.videoUrl" @error="videoLoadErr(index)" alt />
          </div>
          <div :class="`content ${item.type === 4 ? 'link' : ''}`" v-else-if="item.type === 4">
            <div class="lef">
              <span class="til">{{ item.linkTitle }}</span>
              <span class="desc">{{ item.content ? item.content.linkUrl: '' }}</span>
              <span class="desc">{{ item.content ? item.content.linkShow: '' }}</span>
            </div>
            <img :src="item.linkPhoto" alt class="image" />
          </div>
          <div :class="`content ${item.type === 5 ? 'embed' : ''}`" v-else-if="item.type === 5">
            <div class="line">
              <img src="../../images/miniProgramIcon.svg" alt class="icon" />
              <span class="til">{{ '小程序标题' }}</span>
            </div>
            <div class="line desc">{{ item.appShow }}</div>
            <img :src="item.appPhoto" alt class="image" />
            <div class="line">
              <img src="../../images/miniProgramIcon.svg" alt class="icon" />
              <span class="say">小程序</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClusterSopExecute',

  data () {
    return {
      sendContentArray: [
        {
          'appId': '',
          'appPhoto': '',
          'appShow': '',
          'appUrl': '',
          'linkPhoto': '',
          'linkShow': '',
          'linkTitle': '',
          'linkUrl': '',
          'mediaId': '',
          'photoUrl': '',
          'sort': '',
          'textData': 'tyherg',
          'type': 1,
          'videoUrl': ''
        },
        {
          'appId': '',
          'appPhoto': '',
          'appShow': '',
          'appUrl': '',
          'linkPhoto': '',
          'linkShow': '',
          'linkTitle': '',
          'linkUrl': '',
          'mediaId': '',
          'photoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672941616550425946.jpg?Expires=1669196294&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=fSXV0zXRklRh3F26M8TIEv%2FkC%2BA%3D',
          'sort': '',
          'textData': '',
          'type': 2,
          'videoUrl': ''
        },
        {
          'appId': '',
          'appPhoto': '',
          'appShow': '',
          'appUrl': '',
          'linkPhoto': '',
          'linkShow': '',
          'linkTitle': '',
          'linkUrl': '',
          'mediaId': '',
          'photoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672941665650473901.jpg?Expires=1669196294&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=TYGFV45pwBdHTVdi4RHkKESdQB8%3D',
          'sort': '',
          'textData': '',
          'type': 2,
          'videoUrl': ''
        },
        {
          'appId': '',
          'appPhoto': '',
          'appShow': '',
          'appUrl': '',
          'linkPhoto': '',
          'linkShow': '',
          'linkTitle': '',
          'linkUrl': '',
          'mediaId': '',
          'photoUrl': '',
          'sort': '',
          'textData': '',
          'type': 3,
          'videoUrl': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672941863590178957.mp4?Expires=1669196294&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=w0TWpe8Ir2k28eIcRlZ%2Bus5dg1A%3D'
        },
        {
          'appId': '',
          'appPhoto': '',
          'appShow': '',
          'appUrl': '',
          'linkPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942043510266707.jpg?Expires=1669196294&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=uLbP5TmpeR6PdGch9JGemGS%2BTZY%3D',
          'linkShow': 'rtertgr5t',
          'linkTitle': 'tertert',
          'linkUrl': 'http://www.baidu.com',
          'mediaId': '',
          'photoUrl': '',
          'sort': '',
          'textData': '',
          'type': 4,
          'videoUrl': ''
        },
        {
          'appId': 'rget',
          'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942157610933056.jpg?Expires=1669196294&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=l1BY%2BdwInjzQD5VQbxRrAOwZlgc%3D',
          'appShow': 'egretg',
          'appUrl': 'edrtre',
          'linkPhoto': '',
          'linkShow': '',
          'linkTitle': '',
          'linkUrl': '',
          'mediaId': '',
          'photoUrl': '',
          'sort': '',
          'textData': '',
          'type': 5,
          'videoUrl': ''
        },
        {
          'appId': 'tetge',
          'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942331420746873.jpg?Expires=1669196294&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=C3brlWBSBvUMSPOnSzYFduENaME%3D',
          'appShow': 'egyegt',
          'appUrl': 'egegt',
          'linkPhoto': '',
          'linkShow': '',
          'linkTitle': '',
          'linkUrl': '',
          'mediaId': '',
          'photoUrl': '',
          'sort': '',
          'textData': '',
          'type': 5,
          'videoUrl': ''
        },
        {
          'appId': 'egret',
          'appPhoto': 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16672942597290638888.jpg?Expires=1669196294&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=hjEz13a0lZwpeM6fdjAKG1Ikn8M%3D',
          'appShow': 'eghet',
          'appUrl': 'eryge',
          'linkPhoto': '',
          'linkShow': '',
          'linkTitle': '',
          'linkUrl': '',
          'mediaId': '',
          'photoUrl': '',
          'sort': '',
          'textData': '',
          'type': 5,
          'videoUrl': ''
        }
      ],
      contentList: [
        {
          id: 0,
          time: '第一天0小时10分',
          contentText: ''
        }
      ],
      searchValue: '',
      tableLoading: false,
      tableData: [],
      tableColumns: [
        {
          title: '群名称',
          dataIndex: 'groupName',
          align: 'center',
          width: 150
        },
        {
          title: 'SOP名称',
          dataIndex: 'sopName',
          align: 'center',
          width: 150
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          align: 'center',
          width: 200
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      // 分页对象
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  created () {
  },
  mounted () {

  },

  methods: {
    getChangeList () {},
    goSearch () {},
    goReset () {},
    deleteItem () {},
    // 视频错误时显示
    videoLoadErr (index) {
      // const nowD = deepClonev2(this.sopList)
      // nowD[this.selectSopItemIdx].content[index].showPoster = true
      // this.sopList = nowD
      this.sendContentArray[index].showPoster = true
    }
  }
}
</script>

<style lang="less" scoped>
  #clusterExecute_Page_Container {
    display: flex;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 10px;
    justify-content: space-between;
    .leftContainer {
      width: calc(100% - 510px);
      background-color: white;
      height: auto;
      margin-right: 10px;
      .searchLine {
        width: calc(100% - 30px);
        display: flex;
        justify-content: space-between;
        padding: 15px;
        .searchBox {
          display: flex;
          align-items: center;
          .item {
            display: flex;
            align-items: center;
            margin-right: 20px;
            .selectPersonnelCom {
              width: 200px;
              margin-left: 10px;
            }
            .inputClass {
              width: 200px;
              margin-left: 10px;
            }
          }
        }
        .explan {
          margin-left: 20px;
        }
        .handlesBox {
          margin-right: 10px;
          .btn {
            height: 40px;
            padding: 0 15px;
            font-family: 'FontAwesome', sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 15px;
            color: #333333;
            line-height: 40px;
            cursor: pointer;
            background-color: rgba(52, 112, 255, 1);
            border-radius: 4px;
            color: #fff;
          }
        }
      }
    }
    .rightContainer {
      width: calc(500px - 40px);
      background-color: white;
      height: calc(700px - 40px);
      padding: 20px;
      overflow-y: auto;
      .rightTitleDiv {
        font-size: 16px;
      }
      .contentBox {
        width: 100%;
        display: flex;
        flex-direction: column;
        .contentItem {
          display: flex;
          padding: 5px;
          width: 100%;
          align-items: center;
          border-radius: 5px;

          .idx {
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #eef2fc;
            color: #4074f6;
          }
          .content {
            max-width: 750px;
            margin-left: 10px;
          }
          .text {
            word-wrap: break-word;
            padding: 5px 0;
          }
          .image,
          .video {
            img,
            video {
              max-height: 300px;
              max-width: 100%;
            }
          }
          .video {
            position: relative;
            .poster {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0, 0, 0, 0.1);
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          .link {
            width: 250px;
            height: 80px;
            border: 1px solid #cdcdcd;
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
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
              }
            }
            .image {
              flex: 1;
              height: 100%;
              max-width: 58px;
            }
          }
          .embed {
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
          .handlesBox {
            display: none;
            // display: flex;
            margin: auto;
            margin-right: 30px;
            .icon {
              width: 30px;
              height: 30px;
              margin-left: 10px;
              cursor: pointer;
            }
            .move {
              width: 35px;
              height: 35px;
            }
            .disabled {
              cursor: no-drop;
            }
          }
        }
        .contentItem:hover {
          background-color: #2a66ff1f;
          .handlesBox {
            display: flex;
          }
        }
      }
    }
  }
</style>
