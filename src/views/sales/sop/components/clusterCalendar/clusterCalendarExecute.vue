<template>
  <div id="clusterExecute_Page_Container" ref="clusterExecute_Page_Container">
    <div class="leftContainer">
      <div class="leftContainerTop">
        <a-form layout="inline">
          <a-form-item label="群名称:">
            <a-input placeholder="请输入群名称" v-model="searchInfo.clusterName" class="inputClass" />
          </a-form-item>
          <a-form-item label="SOP名称:">
            <a-input placeholder="请输入SOP名称" v-model="searchInfo.sopName" class="inputClass" />
          </a-form-item>
          <a-button
            type="primary"
            style="width: 54px;height: 34px;margin: 0 10px;"
            @click="goSearch"
            v-permission="'/sopClusterCalendar/getExecutionClusterCalendar@get'"
          >查询</a-button>
          <a-button
            style="width: 54px;height: 34px;margin-right: 10px;"
            @click="goReset"
            v-permission="'/sopClusterCalendar/getExecutionClusterCalendar@get'"
          >重置</a-button>
        </a-form>
      </div>
      <a-table
        :loading="tableLoading"
        class="tableBox"
        :row-key="record => record.id"
        :data-source="tableData"
        :columns="tableColumns"
        :pagination="pagination"
        :scroll="{ x: 1500}"
        :row-selection="{ selectedRowKeys: selectedList, onSelect: chooseSelection, type: 'radio' }"
        @change="handleTableChange">
        <div slot="options" slot-scope="text, record">
          <template>
            <div style="display: flex;justify-content: space-around;">
              <a-button type="link" @click="deleteItem(record.id)" v-permission="'/sopClusterCalendar/delete@delete'">删除</a-button>
            </div>
          </template>
        </div>
      </a-table>
    </div>
    <div class="rightContainer">
      <div class="rightTitleDiv">推送内容</div>
      <div class="sendContentList">
        <div class="singleSendContent" v-for="(item, index) in sendArray" :key="item.id">
          <div class="singleSendTitle">
            <span style="font-weight: Bolder">第{{ index + 1 }}条:</span>
            <span style="color: red">加入规则</span>
            <span>{{ returnTimeText(item) }}</span>
          </div>
          <div class="contentList">
            <div class="singleContent" v-for="(singleContentItem, singleContentIndex) in item.sendContentList" :key="singleContentIndex">
              <!-- 卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合 -->
              <div :class="`content ${singleContentItem.type === 1 ? 'text' : ''}`" v-if="singleContentItem.type === 1">{{ singleContentItem.textData }}</div>
              <div :class="`content ${singleContentItem.type === 2 ? 'image': ''}`" v-else-if="singleContentItem.type === 2">
                <div class="poster" v-if="singleContentItem.showImagePoster">{{ returnImageErrorText(singleContentItem.photoUrl) }}</div>
                <img :src="singleContentItem.photoUrl" @error="imageLoadErr(index, singleContentIndex)" alt />
              </div>
              <div :class="`content ${singleContentItem.type === 3 ? 'video' : ''}`" v-else-if="singleContentItem.type === 3">
                <div class="poster" v-if="singleContentItem.showVideoPoster">{{ returnVideoErrorText(singleContentItem.videoUrl) }}</div>
                <video :src="singleContentItem.videoUrl" @error="videoLoadErr(index, singleContentIndex)" alt />
              </div>
              <div :class="`content ${singleContentItem.type === 4 ? 'link' : ''}`" v-else-if="singleContentItem.type === 4">
                <div class="lef">
                  <span class="til">{{ singleContentItem.linkTitle }}</span>
                  <span class="desc">{{ singleContentItem.content ? singleContentItem.content.linkUrl: '' }}</span>
                  <span class="desc">{{ singleContentItem.content ? singleContentItem.content.linkShow: '' }}</span>
                </div>
                <img :src="singleContentItem.linkPhoto" alt class="image" />
              </div>
              <div :class="`content ${singleContentItem.type === 5 ? 'embed' : ''}`" v-else-if="singleContentItem.type === 5">
                <div class="line">
                  <img src="../../images/miniProgramIcon.svg" alt class="icon" />
                  <span class="til">{{ '小程序标题' }}</span>
                </div>
                <div class="line desc">{{ singleContentItem.appShow }}</div>
                <img :src="singleContentItem.appPhoto" alt class="image" />
                <div class="line">
                  <img src="../../images/miniProgramIcon.svg" alt class="icon" />
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
// import { getTempExecuteSopList, deleteExecutingSopMethod } from '@/api/cluster'
import { getExecutingCalendarListMethod, deleteExecutingCalendarMethod } from '@/api/cluster'
export default {
  name: 'ClusterSopExecute',
  data () {
    return {
      selectedList: [],
      sendArray: [
      ],
      searchInfo: {},
      tableLoading: false,
      tableData: [],
      tableColumns: [
        {
          title: '群名称',
          dataIndex: 'clusterName',
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
    this.getTableData()
  },
  mounted () {

  },

  methods: {
    // 返回文字信息
    returnTimeText (info) {
      return `${info.sendTime}提醒发送`
    },
    returnVideoErrorText (url) {
      return '暂不支持显示 .avi 格式的视频'
    },
    returnImageErrorText () {
      return '图片地址错误,暂不显示'
    },
    // 单击某一行的回调
    chooseSelection (record) {
      console.log(record, '单击某一行的回调')
      this.sendArray = record.listTaskInfo
      const tempIdArray = []
      tempIdArray.push(record.id)
      this.selectedList = Object.assign([], tempIdArray)
    },
    // 获取数据
    async getTableData () {
      // 临时注释掉
      this.tableLoading = true
      const params = {
        sopName: this.searchInfo.sopName,
        clusterName: this.searchInfo.clusterName,
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      console.log(params, '查询数据提交接口的对象')
      await getExecutingCalendarListMethod(params).then(response => {
        this.tableLoading = false
        console.log(response, '获取执行中列表数据')
        this.tableData = response.data.list
        // 设置默认选中的数据
        this.setDefaultSelect()
        this.$set(this.pagination, 'total', Number(response.data.page.total))
        if (this.tableData.length === 0) {
          // 列表中没有数据
          if (this.pagination.total !== 0) {
            // 总数据有,但当前页没有
            // 重新将页码换成1
            this.$set(this.pagination, 'current', 1)
            this.getTableData()
          } else {
            // 是真没有数据
          }
        }
      }).catch(() => {
        this.tableLoading = false
      })
      // 临时接收假数据
      // this.tableData = getTempExecuteSopList()
      // this.sendArray = this.tableData[0].listTaskInfo
      // const tempIdArray = []
      // tempIdArray.push(this.tableData[0].id)
      // this.selectedList = Object.assign([], tempIdArray)
    },
    setDefaultSelect () {
      if (this.selectedList.length === 0) {
        this.selectedList.push(this.tableData[0].id)
        this.sendArray = Object.assign([], this.tableData[0].listTaskInfo)
      }
    },
    // 群SOP模板切换页码
    handleTableChange ({ current, pageSize }) {
      this.selectedList = []
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    // 搜索
    goSearch () {
      // 重新将页码换成1
      this.$set(this.pagination, 'current', 1)
      this.getTableData()
    },
    // 重置
    goReset () {
      // 重新将页码换成1
      this.$set(this.pagination, 'current', 1)
      // 清空搜索对象
      this.searchInfo = {}
      this.getTableData()
    },
    // 删除执行中的SOP
    deleteItem (id) {
      const that = this
      const params = { id }
      this.$confirm({
        title: '确定删除所选内容?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          deleteExecutingCalendarMethod(params).then(response => {
            console.log(response, '删除数据')
            if (response.code === 200) {
              this.$message.success('删除成功')
              const tempIndex = that.selectedList.findIndex(item => item === id)
              if (tempIndex !== -1) {
                // 删除的为选中的任务
                this.selectedList = []
              }
              // this.pageIndex = 1
              // this.sopName = ''
              this.getTableData()
            }
          })
        }
      })
    },
    // 视频错误时显示
    videoLoadErr (index, contentIndex) {
      // const nowD = deepClonev2(this.sopList)
      // nowD[this.selectSopItemIdx].content[index].showPoster = true
      // this.sopList = nowD
      // this.sendArray[index].sendContentList[contentIndex].showPoster = true
      this.$set(this.sendArray[index].sendContentList[contentIndex], 'showVideoPoster', true)
      // this.$set(this.sendArray[index].sendContentList, '${contentIndex}', this.sendArray[index].sendContentList[contentIndex])
    },
    // 图片错误时显示
    imageLoadErr (index, contentIndex) {
      // const nowD = deepClonev2(this.sopList)
      // nowD[this.selectSopItemIdx].content[index].showPoster = true
      // this.sopList = nowD
      // this.sendArray[index].sendContentList[contentIndex].showPoster = true
      this.$set(this.sendArray[index].sendContentList[contentIndex], 'showImagePoster', true)
      // this.$set(this.sendArray[index].sendContentList, '${contentIndex}', this.sendArray[index].sendContentList[contentIndex])
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
      width: calc(100% - 430px);
      background-color: white;
      height: auto;
      margin-right: 10px;
      padding: 20px;
      .leftContainerTop {
        margin-bottom: 10px;
      }
    }
    .rightContainer {
      width: calc(450px - 40px);
      background-color: white;
      height: calc(700px - 40px);
      padding: 20px;
      overflow-y: auto;
      .rightTitleDiv {
        font-size: 16px;
      }
      .sendContentList {
        margin-top: 20px;
        .singleSendContent {
          .singleSendTitle {
            font-size: 15px;
            span {
              margin-right: 4px;
            }
          }
          .contentList {
            .singleContent {
              margin-top: 10px;
              border: 1px solid rgba(231, 231, 231, 1);
              border-radius: 4px;
              width: calc(100% - 40px);
              padding: 10px 20px;
            }
          }
        }
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
