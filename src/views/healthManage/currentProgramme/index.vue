<!-- 已用随访方案 -->
<template>
  <div>
    <a-card>
      <a-row type="flex" justify="space-between">
        <div class="flex-row-center">
          <div>已用随访方案：</div>
          <a-radio-group v-model="searchData.status" button-style="solid" @change="search">
            <a-radio-button
              v-for="item in btnList"
              :key="item.value"
              :value="item.value"
            >{{ item.title }}
            </a-radio-button>
          </a-radio-group>
        </div>
        <div>
          <a-input-search
            class="searchInput"
            v-model="searchData.planName"
            placeholder="输入方案名称"
            enter-button
            @search="search"
          />
          <a-button type="primary" v-permission="'/healthManage/addProgramme#add'" @click="$router.push('/healthManage/addProgramme?type=add&pageType=personal')">创建随访方案</a-button>
        </div>
      </a-row>
      <a-divider></a-divider>
      <a-spin :spinning="loading">
        <div
          :class="{'list_content_':true,'view-center':!list.length}"
          v-infinite-scroll="getList"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10">
          <template v-if="list.length">
            <ProgrammeItemrog v-for="item in list" :planName="item.planName" :isDefault="item.isDefault" :key="item.planId">
              <template v-slot:body>
                <div class="content">
                  <div class="content-item">
                    <div class="content-item-num">{{ item.allCount }}</div>
                    <div class="content-item-title">参与人数</div>
                  </div>
                  <div class="content-item">
                    <div class="content-item-num">{{ item.doneCount }}</div>
                    <div class="content-item-title">完成人数</div>
                  </div>
                </div>
              </template>
              <template v-slot:footer>
                <div class="operationContent flex-row-center">
                  <div class="operationState status0" v-if="item.status == 0">待启用</div>
                  <div class="operationState status1" v-if="item.status == 1">执行中</div>
                  <div class="operationState status2" v-if="item.status == 2">已删除</div>
                  <div class="operationContent-buts">
                    <a-button type="primary" ghost v-permission="'/healthManage/addProgramme#detail'" @click="goProgrammeDetail(item)"> 详情 </a-button>
                    <a-dropdown v-if="item.status != 2">
                      <a-menu slot="overlay" v-if="item.status != 2">
                        <a-menu-item key="1" v-if="item.status == 0" v-permission="'/healthManage/addProgramme#update1'" @click="suspendOrContinue(item)">启用</a-menu-item>
                        <a-menu-item key="1" v-if="item.status == 1" v-permission="'/healthManage/addProgramme#update2'" @click="suspendOrContinue(item)">暂停</a-menu-item>
                        <a-menu-item key="2" v-if="item.isDefault !== 2" @click="delItem(item)" v-permission="'/healthManage/addProgramme#update3'">删除</a-menu-item>
                        <a-menu-item key="3" v-if="item.isDefault != 1 && item.status != 1" @click="goEditProgramme(item.planId)" v-permission="'/healthManage/addProgramme#edit'">编辑</a-menu-item>
                      </a-menu>
                      <a-button type="primary" ghost style="margin-left: 8px">
                        操作
                        <a-icon type="down" />
                      </a-button>
                    </a-dropdown>
                  </div>
                </div>
              </template>
            </ProgrammeItemrog>
          </template>
          <Empty v-else />
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import ProgrammeItemrog from '../components/programmeItem/index.vue'
import { planPlanList, planPlanUpdateStatus } from '@/api/healthManage'
import infiniteScroll from '@/utils/directive'
import { Empty } from 'ant-design-vue'
export default {
  name: 'CurrentProgramme',
  directives: { infiniteScroll },
  components: {
    ProgrammeItemrog,
    Empty
  },
  data () {
    return {
      searchData: {
        status: '',
        planName: ''
      },
      btnList: [
        {
          title: '全部',
          value: ''
        },
        {
          title: '待启用',
          value: 0
        },
        {
          title: '执行中',
          value: 1
        },
        {
          title: '已删除',
          value: 2
        }
      ],
      list: [],
      busy: false,
      loading: false,
      userListPagination: {
        page: 0,
        total: 0,
        totalPage: 0
      }
    }
  },
  created () {
    this.search()
  },
  beforeDestroy () {},
  methods: {
    // 已用随访方案详情
    goProgrammeDetail ({ planId, planName, creatorName }) {
      this.$router.push(`/healthManage/currentProgrammeDetail?planId=${planId}&planName=${planName}&creatorName=${creatorName}`)
    },
    // 编辑方案
    goEditProgramme (planId) {
      this.$router.push(`/healthManage/addProgramme?planId=${planId}&type=edit&pageType=personal`)
    },
    search () {
      this.busy = false
      this.userListPagination.page = 0
      this.list = []
      this.getList()
    },
    // 列表
    async getList () {
      if (this.loading) return
      const { totalPage, page } = this.userListPagination
      this.userListPagination.page = page + 1
      if (totalPage && page >= totalPage) {
        this.busy = true
        return
      }
      const params = {
        page: this.userListPagination.page,
        size: 40
      }
      this.loading = true
      const { code, data } = await planPlanList(this.searchData, params)
      console.log(data)
      if (code == 200) {
        const arr = this.list
        this.list = arr.concat(data.records)
        this.userListPagination.totalPage = data.pages
      }
      this.loading = false
    },
    suspendOrContinue ({ planId, status }) {
      let data
      const _self = this
      this.$confirm({
        content: status == 0 ? '随访方案启用后，患者开始执行随访方案。医生则不能编辑方案' : '停止后，患者将停止随访方案执行，医生可在停止后编辑随访方案内容',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          if (status == 0) {
            console.log('启用')
            data = await planPlanUpdateStatus({ planId, status: 1 })
          } else {
            console.log('暂停')
            data = await planPlanUpdateStatus({ planId, status: 0 })
          }
          if (data.code == 200) {
            _self.$message.success('操作成功')
            _self.list.forEach((ele, index) => {
              if (ele.planId == planId) {
                _self.list[index].status = status == 0 ? 1 : 0
              }
            })
          } else {
            _self.$message.error('操作失败')
          }
          // _self.search()
        }
      })
    },
    /**
     * 删除操作
     */
    delItem (item) {
      const _self = this
      this.$confirm({
        content: '随访方案删除后，可以查看患者提交的数据，但不能再次使用此方案',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const data = await planPlanUpdateStatus({ planId: item.planId, status: 2 })
          if (data.code == 200) {
            _self.$message.success('删除成功')
            _self.list.forEach((ele, index) => {
              if (ele.planId == item.planId) {
                _self.list[index].status = 2
              }
            })
          } else {
            _self.$message.error('删除失败')
          }
          // _self.search()
        }
      })
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

.searchInput {
  width: 270px;
  margin-right: 20px;
}

.list_content_ {
  width: 100%;
  height: calc(100vh - 270px);
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  .content {
    flex: 1;
    padding: 0 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 15px;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      &-num {
        font-size: 16px;
        font-weight: bold;
      }

      &-title {
        font-size: 16px;
      }
    }
  }

  .operationContent {
    height: 100%;
    width: 100%;
    justify-content: space-between;

    .operationState {
      font-size: 14px;
      font-weight: bold;
    }
    .status0 {
      color: #f59a23;
    }
    .status1 {
      color: #70b603;
    }
    .status2 {
      color: #7f7f7f;
    }
  }

  // .describe {
  //     margin-top: 10px;
  //     font-size: 14px;
  //     height: calc(100% - 80px);
  //     height: 42px;
  //     display: -webkit-box;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     -webkit-line-clamp: 2;
  //     -webkit-box-orient: vertical;
  // }
}
.view-center{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
