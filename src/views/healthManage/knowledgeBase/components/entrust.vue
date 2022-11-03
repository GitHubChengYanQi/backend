<!-- 嘱托 -->
<template>
  <div class="article">
    <div class="content">
      <div class="l-list">
        <div class="titleContent">
          <a-row type="flex" class="flex-row-center">
            <a-col class="title flex-row-center" :span="6">
              <div class="chunk"></div>
              选择嘱托
            </a-col>
            <a-col :span="18">
            </a-col>
          </a-row>
        </div>
        <a-form-model :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="选择分组">
            <a-tree-select
              v-model="editGroupId"
              style="width: 100%"
              :dropdown-style="{ maxWidth: '400px', maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择分组"
              allow-clear
              tree-default-expand-all
              :replaceFields="{
                children:'children',
                title:'name',
                key:'id',
                value: 'id'
              }"
              @change="onSearch"
              :treeData="treeData">
            </a-tree-select>
          </a-form-model-item>
        </a-form-model>
        <a-input-search placeholder="输入嘱托名称" v-model="searchVal" @search="onSearch" @change="onSearch" />
        <a-spin :spinning="spinning">
          <div
            class="demo-infinite-container"
            style="margin-top: 0"
            v-infinite-scroll="getList"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10">
            <a-list :data-source="currentList">
              <a-list-item slot="renderItem" slot-scope="item, index" @click="listChange(item, index)">
                <div :class="{ item: true, active: index === activeIndex }">
                  <!-- <div class="tip flex-row-center"
                                :style="{ 'background': index == 0 ? '' : 'rgb(2, 167, 240)' }">
                                {{ index == 0 ? '平台' : '个人' }}
                            </div> -->
                  <div class="text">
                    {{ item.content.title || item.content.fileName }}
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </div>
        </a-spin>
      </div>
      <div class="r-detail">
        <div class="titleContent">
          <a-row>
            <a-col class="title flex-row-center" :span="6">
              <div class="chunk"></div>
              嘱托详情
            </a-col>
          </a-row>
        </div>
        <div class="r-detail-content">
          <template v-if="`${activeIndex}`">
            <!-- 文本-->
            <template v-if="currentItem.type_id == 1">
              <div v-html="currentItem.content.content"></div>
            </template>
            <!-- 图片-->
            <template v-if="currentItem.type_id == 2">
              <img class="currentImg" :src="currentItem.content.imageFullPath">
            </template>
            <!-- 图文-->
            <template v-if="currentItem.type_id == 3">
              <div class="typeId3">
                <img :src="currentItem.content.imageFullPath" />
                <a :href="currentItem.content.imageLink" target="_blank">{{ currentItem.content.imageLink }}</a>
              </div>
            </template>
            <!-- 音频-->
            <template v-if="currentItem.type_id == 4">
              <div class="typeId3">
                <video controls>
                  <source :src="currentItem.content.voiceFullPath" type="audio/mpeg">
                </video>
              </div>
            </template>
            <!-- 视频-->
            <template v-if="currentItem.type_id == 5">
              <div class="typeId3">
                <video :src="currentItem.content.videoFullPath" controls="controls" style="width: 100%;"></video>
              </div>
            </template>
            <!-- 小程序-->
            <template v-if="currentItem.type_id == 6">
              <div class="typeId3">
                <div class="applets">
                  <img :src="require('@/assets/healthManage/u7336.png')" />
                  <div class="text1">{{ currentItem.content.title }}</div>
                  <div class="text2">{{ currentItem.content.maintitle }}</div>
                  <img class="appletsImg" :src="currentItem.content.imageFullPath" />
                </div>
              </div>
            </template>
            <!-- 文件-->
            <template v-if="currentItem.type_id == 7">
              <div class="typeId3">
                <a :href="currentItem.content.fileFullPath" target="_blank">{{ currentItem.content.fileName }}</a>
              </div>
            </template>
          </template>
          <Empty class="emptyCenter" v-else description="请选择嘱托" />
        </div>
      </div>
    </div>
    <!-- 新建方案按钮 -->
    <div class="addBtns flex-row-center" v-if="!isAdd">
      <Space>
        <a-button @click="closeModal(false)"> 取消 </a-button>
        <a-button type="primary" @click="closeModal(true)"> 确定 </a-button>
      </Space>
    </div>
  </div>
</template>

<script>
import { Space, Empty } from 'ant-design-vue'
import { mediumIndex } from '@/api/healthManage'
import { mediumGroup } from '@/api/mediumGroup'
import infiniteScroll from '@/utils/directive'
export default {
  props: {
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  directives: { infiniteScroll },
  components: {
    Space,
    Empty
  },
  computed: {
    currentList () {
      return this.list.filter(ele => {
        return ele.type_id != 7
      })
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      list: [],
      upLoadData: {},
      activeIndex: '',
      spinning: false,
      searchVal: '',
      editGroupId: '',
      treeData: [],
      currentItem: {},
      busy: false,
      userListPagination: {
        page: 0,
        total: 0,
        totalPage: 0
      }
    }
  },
  created () {
    this.activeIndex = ''
    this.userListPagination = {
      page: 0,
      total: 0,
      totalPage: 0
    }
    this.getList()
    this.getGroupList()
  },
  beforeDestroy () {},
  methods: {
    // 按名称搜索问卷
    onSearch () {
      this.busy = false
      this.list = []
      this.userListPagination.page = 0
      this.userListPagination.totalPage = 0
      this.getList()
    },
    // 问卷列表
    async getList () {
      if (this.spinning) return
      const { totalPage, page } = this.userListPagination
      this.userListPagination.page = page + 1
      if (totalPage && page >= totalPage) {
        this.busy = true
        return
      }
      const params = {
        page: this.userListPagination.page,
        perPage: 20
      }
      this.spinning = true
      try {
        const { code, data } = await mediumIndex({ searchStr: this.searchVal, type: 1, mediumGroupId: this.editGroupId, ...params })
        if (code == 200) {
          const arr = this.list
          this.list = arr.concat(data.list)
          this.userListPagination.totalPage = data.page.totalPage
        }
        this.spinning = false
      } catch (error) {
        this.spinning = false
      }
    },
    // 点击问卷查询详情
    async listChange (item, index) {
      this.activeIndex = index
      this.currentItem = item
    },
    // 获取分组列表
    getGroupList () {
      mediumGroup().then(res => {
        this.treeData = res.data
      })
    },
    // 调用新建方案关闭弹窗
    closeModal (state) {
      const keys = Object.keys(this.currentItem)
      if (!keys.length && state) {
        this.$message.error('请选择嘱托')
        return
      }
      this.$emit('close', keys.length ? this.currentItem : '', 3)
    }
  }
}
</script>
<style lang="less" scoped>
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.article {
  .content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    height:620px;
    .titleContent {
      margin: 20px 0;

      .title {
        font-size: 18px;
        font-weight: bold;
      }

      .btns {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    }

    .l-list {
      width: 365px;

      .demo-infinite-container {
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: auto;
        //height: 500px;
        height: 434px;
        padding: 0px !important;

        .item {
          width: 100%;
          max-width: 100%;
          position: relative;
          padding: 15px 15px 15px 30px;

          // .tip {
          //     position: absolute;
          //     left: 0;
          //     top: 0;
          //     background: rgb(236, 128, 141);
          //     color: #fff;
          //     width: 17px;
          //     height: 100%;
          //     font-size: 12px;
          //     text-align: center;
          // }
          .text{
            max-height: 81px;
            overflow: hidden;
            text-overflow: ellipsis;  /* 超出部分省略号 */
            word-break: break-all;  /* break-all(允许在单词内换行。) */
            display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
            -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
            -webkit-line-clamp: 2; /* 显示的行数 */
          }
        }

        .active {
          background-color: rgb(2, 167, 240);
          color: #fff;
        }
      }

      .demo-loading-container {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
      }
    }

    .r-detail {
      width: calc(100% - 385px);

      &-content {
        width: 100%;
        height: 536px;
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        padding: 15px;
        overflow-y: auto;
        word-break: break-all;
        div {
          font-size: 16px;
          line-height: 1.5;
        }
        .currentImg{
          max-width: 100%;
        }
        .typeId3{
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          img{
            height: 224px;
            width: 200px;
          }
          a{
            margin-top: 15px;
          }
          .applets{
            width: 287px;
            height: 309px;
            position: relative;
            img{
              position: absolute;
              top: 0;
              left: 0;
              width: 287px;
              height: 309px;
            }
            .text1{
              color: #333;
              z-index: 2;
              position: absolute;
              font-size: 14px;
              left: 40px;
              top: 13px;
            }
            .text2{
              color: #333;
              z-index: 2;
              position: absolute;
              font-size: 14px;
              left: 20px;
              top: 40px;
              width: calc(100% - 40px);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .appletsImg{
              position: absolute;
              width: 247px;
              left: 20px;
              top: 64px;
              height: 202px;
            }
          }
        }
        .emptyCenter {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
.wj-preview {
  padding: 0 15px;
  box-sizing: border-box;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  height: 460px;
  width: 100%;
}
.addBtns{
  justify-content: center;
}
</style>
<style>
.ant-list-item {
  padding: 0;
}
</style>
