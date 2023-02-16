<!-- 患教 -->
<template>
  <div class="article">
    <div class="content">
      <div class="l-list">
        <div class="titleContent">
          <a-row type="flex" class="flex-row-center">
            <a-col class="title flex-row-center" :span="6">
              <div class="chunk"></div>
              选择患教
            </a-col>
            <a-col :span="18">
            </a-col>
          </a-row>
        </div>

        <!-- nav -->
        <a-radio-group v-model="selectListMode" @change="handleRadio" class="selectListModeBox">
          <a-radio-button value="1" :disabled="spinning">素材库</a-radio-button>
          <a-radio-button value="2" :disabled="spinning">互动雷达</a-radio-button>
        </a-radio-group>
        <!-- end nav -->

        <!-- search -->
        <a-form-model :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="选择分组" v-if="selectListMode === '1'">
            <a-tree-select
              v-model="editGroupId"
              style="width: 100%"
              :dropdown-style="{ maxWidth: '400px', maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择分组"
              allow-clear
              tree-default-expand-all
              :replaceFields="{
                children: 'children',
                title: 'name',
                key: 'id',
                value: 'id'
              }"
              @change="onSearch"
              :treeData="treeData">
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="雷达分组" v-if="selectListMode === '2'">
            <a-select @change="handleChange('group')" v-model="radarGroupId">
              <a-select-option v-for="item in radarGroupArr" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="雷达分类" v-if="selectListMode === '2'">
            <a-select @change="handleChange('class')" v-model="radarType">
              <a-select-option v-for="item in typeArr" :key="item.code" :value="item.code">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
        <a-input-search placeholder="输入患教名称" v-model="searchVal" @search="onSearch" @change="onSearch" />
        <!-- end search -->
        <!-- v-infinite-scroll="handleInfiniteOnLoad" :infinite-scroll-disabled="busy" :infinite-scroll-distance="10" -->

        <!-- list -->
        <a-spin :spinning="spinning">
          <div
            class="demo-infinite-container"
            style="margin-top: 0"
            v-infinite-scroll="getList"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10">
            <a-list :data-source="selectListMode === '1' ? currentList : list">
              <a-list-item slot="renderItem" slot-scope="item, index" @click.stop="listChange(item, index)">
                <div :class="{ item: true, active: index === activeIndex }">
                  <div class="text" v-if="selectListMode === '1'">
                    {{ item.content.title || item.content.fileName }}
                  </div>
                  <div class="text" v-if="selectListMode === '2'">
                    {{ item.title }}
                  </div>
                  <a-select
                    v-if="selectListMode === '2'"
                    size="small"
                    style="width: 112px;"
                    v-model="item.selectChannel"
                    placeholder="请选择渠道"
                    @change="handleChannel"
                  >
                    <a-select-option v-for="items in item.ditch" :key="items.id" :value="items.id">
                      {{ items.name }}
                    </a-select-option>
                  </a-select>
                </div>
              </a-list-item>
            </a-list>
          </div>
        </a-spin>
        <!-- end list -->
      </div>

      <!-- detail -->
      <div class="r-detail">
        <div class="titleContent">
          <a-row>
            <a-col class="title flex-row-center" :span="6">
              <div class="chunk"></div>
              患教详情
            </a-col>
          </a-row>
        </div>
        <div class="r-detail-content" v-if="selectListMode === '1'">
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
          <Empty class="emptyCenter" v-else description="请选择患教" />
        </div>
        <div class="r-detail-content" v-if="selectListMode === '2'">
          <template v-if="`${activeIndex}`">
            <!-- 图文-->
            <template v-if="currentItem.type_id == 3">
              <div class="typeId3">
                <img :src="currentItem.linkImg" />
                <a :href="currentItem.radarLink" target="_blank">{{ currentItem.linkTitle }}</a>
              </div>
            </template>
            <!-- 文件-->
            <template v-if="currentItem.type_id == 7">
              <div class="typeId3">
                <a :href="currentItem.radarPDF" target="_blank">{{ currentItem.linkTitle }}</a>
              </div>
            </template>
          </template>
          <Empty class="emptyCenter" v-else description="请选择患教" />
        </div>
      </div>
      <!-- end detail -->
    </div>

    <!-- handle -->
    <div class="addBtns flex-row-center" v-if="!isAdd">
      <Space>
        <a-button @click="closeModal(false)"> 取消 </a-button>
        <a-button type="primary" @click="closeModal(true)"> 确定 </a-button>
      </Space>
    </div>
    <!-- end handle -->
  </div>
</template>

<script>
import { Space, Empty } from 'ant-design-vue'
import { mediumIndex } from '@/api/healthManage'
import { mediumGroup } from '@/api/mediumGroup'
import { getDict } from '@/api/common'
import { scrmRadarArticleFind, scrmRadarLabelFind } from '@/api/setRadar'
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
      treeData: [], // 素材库树
      currentItem: {},
      busy: false,
      userListPagination: {
        page: 0,
        total: 0,
        totalPage: 0
      },
      // 新增雷达选择列表
      selectListMode: '1', // 1:素材库 2:雷达
      radarGroupArr: [],
      radarType: '', // 雷达分类
      radarGroupId: '', // 组id
      typeArr: [] // 互动雷达分类字典
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () { },
  methods: {
    /**
     * 初始化
     */
    init () {
      this.activeIndex = ''
      this.userListPagination = {
        page: 0,
        total: 0,
        totalPage: 0
      }
      this.getDict()
      this.getList()
      this.getGroupList()
    },
    /**
     * 获取字典
     */
    getDict () {
      getDict({ dictType: 'radar_type' }).then((res) => {
        this.typeArr = res.data
      })
    },
    /**
     * 素材库/互动雷达 切换回调
     */
    handleRadio () {
      this.searchVal = ''
      this.editGroupId = ''
      this.onSearch()
    },
    /**
     * 互动雷达select回调
     * type 'group/class'
     */
    handleChange (type) {
      this.onSearch()
    },
    /**
     * 切换渠道回调
     */
    handleChannel (e) {
      this.currentItem.radarDitchId = e
    },
    // 按名称搜索问卷
    onSearch () {
      this.currentItem = {}
      this.activeIndex = ''
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
        let res = {}
        if (this.selectListMode === '1') {
          res = await mediumIndex({ searchStr: this.searchVal, type: 0, mediumGroupId: this.editGroupId, ...params })
          if (res.code == 200) {
            const arr = this.list
            this.list = arr.concat(res.data.list)
            this.userListPagination.totalPage = res.data.page.totalPage
          }
        }
        if (this.selectListMode === '2') {
          res = await scrmRadarArticleFind({ title: this.searchVal,
            shape: this.radarType,
            unitId: this.radarGroupId,
            ...{
              current: params.page,
              size: params.perPage
            } })
          if (res.code == 200) {
            const arr = this.list
            this.list = arr.concat(res.data.datas)
            this.userListPagination.totalPage = res.data.pages
          }
        }

        this.spinning = false
      } catch (error) {
        this.spinning = false
      }
    },
    // 点击问卷查询详情
    async listChange (item, index) {
      this.activeIndex = index
      if (this.selectListMode === '1') {
        this.currentItem = item
      }
      if (this.selectListMode === '2') {
        if (item.shape === '链接' || item.shape === '图文' || item.shape === '自定义视频' || item.shape === '模板视频') {
          item.entry.type_id = '3'
        }
        if (item.shape === 'PDF') {
          item.entry.type_id = '7'
        }
        this.currentItem = {
          ...item.entry,
          radarDitchId: item.selectChannel,
          id: item.id,
          title: item.title
        }
      }
    },
    // 获取分组列表
    getGroupList () {
      const param = {
        left: 1
      }
      scrmRadarLabelFind(param).then(res => {
        this.radarGroupArr = res.data.group
      })
      mediumGroup().then(res => {
        this.treeData = res.data
      })
    },
    // 调用新建方案关闭弹窗
    closeModal (state) {
      const keys = Object.keys(this.currentItem)
      if (!keys.length && state) {
        this.$message.error('请选择患教')
        return
      }
      if (this.selectListMode === '1') {
        this.currentItem.secondType = 'M'
      }
      if (this.selectListMode === '2') {
        this.currentItem.secondType = 'R'
      }
      if (!this.currentItem.radarDitchId) {
        this.$message.error('请选择渠道')
        return false
      }
      this.$emit('close', keys.length ? this.currentItem : '', 2)
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
    height: 620px;

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

    .selectListModeBox {
      width: 100%;
      margin-bottom: 10px;
      display: flex;
      .ant-radio-button-wrapper {
        width: 50%;
        display: flex;
        justify-content: center;
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
        padding-bottom:200px !important;
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
          .text {
            max-height: 81px;
            overflow: hidden;
            text-overflow: ellipsis;
            /* 超出部分省略号 */
            word-break: break-all;
            /* break-all(允许在单词内换行。) */
            display: -webkit-box;
            /* 对象作为伸缩盒子模型显示 */
            -webkit-box-orient: vertical;
            /* 设置或检索伸缩盒对象的子元素的排列方式 */
            -webkit-line-clamp: 2;
            /* 显示的行数 */
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

        .currentImg {
          max-width: 100%;
        }

        .typeId3 {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          img {
            height: 224px;
            width: 200px;
          }

          a {
            margin-top: 15px;
          }

          .applets {
            width: 287px;
            height: 309px;
            position: relative;

            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 287px;
              height: 309px;
            }

            .text1 {
              color: #333;
              z-index: 2;
              position: absolute;
              font-size: 14px;
              left: 40px;
              top: 13px;
            }

            .text2 {
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

            .appletsImg {
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

.addBtns {
  justify-content: center;
}
</style>
<style lang="less">
.ant-list-item {
  padding: 0;
  .item{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
