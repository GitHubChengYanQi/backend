<!-- 患者详情 -->
<template>
  <div>
    <a-card class="my-card_">
      <div class="patient-content">
        <div class="user flex-row-center" v-if="pageData.contactData">
          <img class="header" :src="pageData.contactData.avatar" alt="" />
          <div class="detail">
            <div class="t">
              <span class="name">{{ pageData.contactData.name || pageData.contactData.nickName }}</span>
              <span class="sex" v-if="pageData.contactData.gender != 0">{{
                pageData.contactData.gender == 1 ? '男' : '女'
              }}</span>
              <span class="age">{{ pageData.contactData.ageNum }}岁</span>
            </div>
            <div class="b">{{ pageData.contactData.mobile }}</div>
          </div>
        </div>
        <a-divider />
        <div class="information-content">
          <div class="title">分组信息：</div>
          <Space class="detail_content">
            <div class="item" v-for="(item,index) in pageData.categoryNames" :key="index+999">{{ item.name }}</div>
            <a-dropdown :trigger="['click']" v-permission="'/healthManage/patientDetails/grouping#post'">
              <a class="ant-dropdown-link" @click.prevent>
                <img :src="require('@/assets/healthManage/u5995.png')" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="0" @click="openMoadl(2,false)"> 添加患者分组 </a-menu-item>
                  <a-menu-item key="1" @click="openMoadl(3,true)"> 删除患者分组 </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </Space>
        </div>
        <div class="information-content">
          <div class="title">随访方案：</div>
          <Space class="detail_content">
            <div class="item faItem" v-for="(item, index) in pageData.planList" :key="index" @click="toProgramme(item)">{{ item.planName }}</div>
            <img :src="require('@/assets/healthManage/u5995.png')" @click="openMoadl(1,false,pageData.contactData.id)" v-permission="'/healthManage/patientDetails/programme#post'"/>
          </Space>
        </div>
        <div class="information-content">
          <div class="title">曾用方案：</div>
          <Space class="detail_content" v-if="pageData.deletePlanList && pageData.deletePlanList.length">
            <template v-for="(item, index) in pageData.deletePlanList">
              <div :class="{'item':true, faItem: item.planDoneFlag}" v-if="index < more" :key="index">{{ item.planName }}</div>
            </template>
            <div class="loadMore" v-if="pageData.deletePlanList.length > more && more == 4" @click="more = 9999999">
              <a-icon type="down" />
              加载更多
            </div>
          </Space>
        </div>
      </div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="随访记录">
          <Record ref="record" v-if="pageData.planList" :planList="pageData.planList" :contactId="contactId" :contactData="pageData.contactData"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="历史问卷">
          <HistoryTable :contactId="contactId" />
        </a-tab-pane>
      </a-tabs>
      <ProgrammeMoadl ref="programmeMoadl" @updataPage="getDetail" />
      <GroupingSelectModal ref="groupingSelectModal" @updateList="getDetail" />
    </a-card>
  </div>
</template>

<script>
import { Space } from 'ant-design-vue'
import Record from './components/record.vue'
import HistoryTable from './components/historyTable.vue'
import { getContactPlans } from '@/api/healthManage'
import ProgrammeMoadl from './components/programmeMoadl'
import GroupingSelectModal from '../../followUp/group/components/groupingSelectModal'
export default {
  components: {
    Space,
    Record,
    HistoryTable,
    ProgrammeMoadl,
    GroupingSelectModal
  },
  data () {
    return {
      more: 4,
      contactId: '',
      pageData: {}
    }
  },
  mounted () {
    this.contactId = this.$route.query.contactId
    this.getDetail()
  },
  methods: {
    // 查询详情
    async getDetail () {
      const { data } = await getContactPlans({ contactId: this.contactId })
      this.pageData = data
      console.log(data, '患者详情')
    },
    // 打开弹层
    openMoadl (type, isDel = false) {
      if (type == 1) {
        this.$refs.programmeMoadl.open(1, isDel, this.contactId)
      }
      if (type == 2) {
        this.$refs.groupingSelectModal.open(1, { contactId: this.contactId })
      }
      if (type == 3) {
        this.$refs.groupingSelectModal.open(3, { contactId: this.contactId }, this.pageData.categoryNames)
      }
    },
    // 去方案详情
    toProgramme ({ planId, planName, creatorName }) {
      this.$router.push(`/healthManage/currentProgrammeDetail?planId=${planId}&planName=${planName}&creatorName=${creatorName}`)
    }
  }
}
</script>
<style lang="less">
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.my-card_ {
  padding: 10px;

  .patient-content {
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 15px;

    .user {
      .header {
        width: 62px;
        height: 62px;
        margin-right: 25px;
      }

      .detail {
        display: flex;
        flex-direction: column;
        height: 52px;
        justify-content: space-between;

        .t {
          display: flex;
          flex-direction: row;
          align-items: flex-end;

          span {
            margin-right: 50px;
            color: #333333;
          }

          .name {
            font-size: 16px;
            font-weight: bold;
          }

          .sex {
            font-size: 14px;
          }

          .age {
            font-size: 14px;
          }
        }

        .b {
          font-size: 14px;
          color: #333333;
        }
      }
    }

    .information-content {
      display: flex;
      flex-direction: row;
      margin-bottom: 20px;

      .title {
        font-size: 16px;
        color: #333333;
        height: 38px;
      }

      .detail_content {
        display: flex;
        flex: 1;
        margin-left: 20px;
        flex-direction: row;
        flex-wrap: wrap;
        .item {
          height: 24px;
          line-height: 24px;
          padding: 0 10px;
          font-size: 14px;
          text-align: center;
          border: 1px solid rgba(215, 215, 215, 1);
          border-radius: 5px;
          margin-bottom: 15px;
        }
        .faItem{
          border: 1px solid rgb(2, 167, 240) !important;
          color: rgb(2, 167, 240) !important;
          cursor:pointer;
        }

        img {
          width: 25px;
          height: 25px;
          margin-bottom: 14px;
          cursor: pointer;
        }

        .loadMore {
          height: 24px;
          line-height: 24px;
          margin-bottom: 15px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
