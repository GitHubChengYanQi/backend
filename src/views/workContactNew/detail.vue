<template>
  <div class="box">
    <div :class="{'card': true, 'l-h': loading}">
      <loading :loading="loading" height="100%">
        <div class="top flex">
          <div class="total">已添加{{ data.employeeCount }}个员工</div>
          <a-divider type="vertical" />
          <div class="members flex">
            <div
              :class="{'item': true, 'active': !currentEmployee.employeeId}"
              @click="switchEmployee({})"
            >客户信息汇总</div>
            <div
              :class="{'item': true, 'active': currentEmployee.employeeId == v.employeeId}"
              v-for="v in data.addEmployees"
              :key="v.id"
              @click="switchEmployee(v)"
            >{{ v.employeeName }}</div>
          </div>
        </div>

        <div class="user-info">
          <div class="flex-between">
            <div class="left flex">
              <div class="avatar mr12">
                <img :src="data.avatar" />
              </div>
              <div class="info mt3">
                <div class="nickname flex">
                  <span class="f-blod fz16">{{ data.name }}</span>
                </div>
                <div class="source mt4">@微信</div>
              </div>
            </div>
            <!--            <div class="right">-->
            <!--              <a-button type="primary" ghost @click="$refs.addEvent.show()">添加事件</a-button>-->
            <!--            </div>-->
          </div>
        </div>

        <div class="tag">
          <div class="flex">
            <div class="title">客户标签：</div>
            <div class="tags" v-if="data.contactCorpTag.length">
              <span v-for="group in data.contactCorpTag" :key="group.id">
                <a-tag v-for="tag in group.tags" :key="tag.tagId">{{ tag.tagName }}</a-tag>
              </span>
              <!--              <span v-if="currentEmployee.employeeId" @click="tagsEdit" style="color: #1890ff;cursor: pointer;"><a-icon type="edit" />编辑</span>-->
            </div>
            <div class="tags" v-else>
              暂无标签
              <!--              <span v-if="currentEmployee.employeeId" @click="tagsEdit" style="color: #1890ff;cursor: pointer;"><a-icon type="edit" />编辑</span>-->
            </div>
          </div>
          <!--          <div class="flex" style="margin-top: 15px;">-->
          <!--            <div class="title">个人标签：</div>-->
          <!--            <div class="tags" v-if="data.contactEmployeeTag.length">-->

          <!--              <a-tag v-for="tag in data.contactEmployeeTag" :key="tag.id">-->
          <!--                {{ tag.name }}-->
          <!--              </a-tag>-->

          <!--              <span v-if="currentEmployee.employeeId" @click="personalTagsEdit" style="color: #1890ff;cursor: pointer;"><a-icon type="edit" />编辑</span>-->
          <!--            </div>-->
          <!--            <div class="tags" v-else>-->
          <!--              暂无标签-->
          <!--              <span v-if="currentEmployee.employeeId" @click="personalTagsEdit" style="color: #1890ff;cursor: pointer;"><a-icon type="edit" />编辑</span>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
        <div class="tag" v-if="currentEmployee.employeeId">
          <div class="flex">
            <div class="title">个人标签：</div>
            <div class="tags" v-if="data.employeeCustomLabelList.length">
              <span v-for="group in data.employeeCustomLabelList" :key="group.id">
                <a-tag>{{ group.tagName }}</a-tag>
              </span>
              <!--              <span v-if="currentEmployee.employeeId" @click="tagsEdit" style="color: #1890ff;cursor: pointer;"><a-icon type="edit" />编辑</span>-->
            </div>
            <div class="tags" v-else>
              暂无标签
              <!--              <span v-if="currentEmployee.employeeId" @click="tagsEdit" style="color: #1890ff;cursor: pointer;"><a-icon type="edit" />编辑</span>-->
            </div>
          </div>
          <!--          <div class="flex" style="margin-top: 15px;">-->
          <!--            <div class="title">个人标签：</div>-->
          <!--            <div class="tags" v-if="data.contactEmployeeTag.length">-->

          <!--              <a-tag v-for="tag in data.contactEmployeeTag" :key="tag.id">-->
          <!--                {{ tag.name }}-->
          <!--              </a-tag>-->

          <!--              <span v-if="currentEmployee.employeeId" @click="personalTagsEdit" style="color: #1890ff;cursor: pointer;"><a-icon type="edit" />编辑</span>-->
          <!--            </div>-->
          <!--            <div class="tags" v-else>-->
          <!--              暂无标签-->
          <!--              <span v-if="currentEmployee.employeeId" @click="personalTagsEdit" style="color: #1890ff;cursor: pointer;"><a-icon type="edit" />编辑</span>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
        <div class="step">
          <div class="mt8" v-if="!stepLoading">
            <div class="item flex" v-for="v in stepData" :key="v.employeeId">
              <div class="title mr8">
                <a-tag>
                  <a-icon type="user" class="mr6" />
                  {{ v.employeeName }}
                </a-tag>
              </div>
              <a-steps>
                <a-step
                  status="finish"
                  v-for="(v2,i2) in v.list"
                  :title="v2.name"
                  :key="v2.id"
                  class="pointer"
                  @click.stop="updateStageManage(v2.id,v.employeeId)"
                >
                  <a-icon slot="icon" theme="filled" type="check-circle" v-if="v2.flag" />
                  <div slot="icon" style="color: #b8b8b8" v-else>{{ i2 + 1 }}</div>
                </a-step>
              </a-steps>
            </div>
          </div>
          <div class="loading" v-else>
            <a-spin />
          </div>
        </div>

        <a-tabs default-active-key="1" v-model="currentTab">
          <a-tab-pane key="1" tab="客户概况" />
          <a-tab-pane key="2" tab="客户动态" />
          <a-tab-pane key="3" tab="所在群聊" />
          <a-tab-pane key="4" tab="健康档案" />
        </a-tabs>

        <div class="info-box">
          <info ref="info" v-show="currentTab === '1'" @goNews="currentTab= '2'" />
          <news ref="news" v-show="currentTab === '2'" />
          <group ref="group" v-show="currentTab === '3'" />
          <health-record ref="healthRecord" v-show="currentTab === '4'" />
        </div>
      </loading>
    </div>

    <addEvent ref="addEvent" />
    <selectTags ref="selectTag" @choiceTagsArr="tagsEditChange" />
    <personalTag ref="personalTags" @change="personalTagsChange" />
  </div>
</template>

<script>
import info from './detailComponents/info'
import news from './detailComponents/news'
import group from './detailComponents/group'
import healthRecord from './detailComponents/healthRecord.vue'
import addEvent from '@/views/workContactNew/components/addEvent'
import selectTags from '@/components/addlabel/index'
import personalTag from '@/views/workContactNew/components/personalTag'

import {
  getWorkContactInfo,
  // getStageManageList,
  updateStageManageList,
  employeeCreateContactTag,
  employeeTagSet,
  getUserInfoReq
} from '@/api/workContact'

export default {
  data () {
    return {
      currentTab: '1',
      data: {
        contactCorpTag: [],
        contactEmployeeTag: []
      },
      currentEmployee: {
        employeeId: ''
      },
      stepData: {},
      stepLoading: false,
      loading: true,
      contactId: 0
    }
  },
  mounted () {
    if (this.$route.query.contactId !== undefined) {
      this.contactId = this.$route.query.contactId
    } else if (this.$route.query.id !== undefined) {
      this.contactId = this.$route.query.id
    }

    if (this.$route.query.employeeId !== undefined) {
      this.currentEmployee.employeeId = this.$route.query.employeeId
    }
    console.log('123123', this.currentEmployee.employeeId)

    this.getData()
  },
  methods: {
    switchEmployee (data) {
      this.currentEmployee = data
      this.$refs.info.getEmployeeId(this.currentEmployee.employeeId ? this.currentEmployee.employeeId : 0)
      this.getData(false)
    },

    updateStageManage (stageId, employeeId) {
      updateStageManageList({
        stageId,
        employeeId,
        contactId: this.contactId
      }).then(() => {
        this.$message.success('修改成功')

        this.getStageManageData()
      })
    },

    getStageManageData (loading = true) {
      // if (loading) this.stepLoading = true

      // getStageManageList({
      //   contactId: this.contactId,
      //   employeeIds: this.data.addEmployees.map(v => {
      //     return v.employeeId
      //   })
      // }).then(res => {
      //   this.stepData = res.data
      //
      //   this.stepLoading = false
      // })
    },

    async getData (loading = true) {
      if (loading) this.loading = true

      const res = await getWorkContactInfo({
        contactId: this.contactId,
        employeeId: this.currentEmployee.employeeId ? this.currentEmployee.employeeId : ''
      })

      // .then(res => {
      this.data = res.data

      const { data: userInfo } = await getUserInfoReq({ contactId: this.contactId })

      this.$refs.info.setData(this.data.employees, userInfo)
      this.$refs.group.setData(this.data.roomName)

      this.getStageManageData()

      this.loading = false
      // })
    },

    tagsEdit () {
      const ad = []
      this.data.contactCorpTag.forEach(i => {
        return i.tags.forEach(v => {
          ad.push({
            id: v.tagId,
            name: v.tagName,
            wxContactTagId: v.wxContactTagId,
            contactTagGroupId: v.contactTagGroupId
          })
        })
      })

      this.$refs.selectTag.show(ad)
    },
    tagsEditChange (e) {
      const data = {
        contactId: this.contactId,
        employeeId: this.currentEmployee.employeeId,
        tagIds: e.map(i => {
          return i.id
        })
      }
      employeeCreateContactTag(data).then(res => {
        this.getData()
      })
    },

    personalTagsEdit () {
      this.$refs.personalTags.show({
        contactId: this.contactId,
        employeeId: this.currentEmployee.employeeId
      }, this.data.contactEmployeeTag)
    },
    personalTagsChange (e) {
      const data = {
        tagIds: e.map(i => {
          return i.id
        }),
        contactId: this.contactId,
        employeeId: this.currentEmployee.employeeId
      }
      employeeTagSet(data).then(res => {
        this.getData()
      })
    },
    updataNews () {
      this.$refs.info.getTrackData()
    }
  },
  components: { info, news, group, healthRecord, addEvent, selectTags, personalTag }
}
</script>

<style lang="less" scoped>
/deep/.ant-tag {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 4px;
  padding: 4px 10px;
  height: 24px;
  border: 1px solid #d1e7ff;
  border-radius: 4px;
  background: #f6fbfe;
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
  line-height: 15px;
}

.card {
  padding: 0;
}

.l-h {
  height: 80vh;
}

.top {
  font-size: 14px;
  border-bottom: 1px solid #f2f2f2;
  padding: 13px;

  .total {
    color: #00000073;
  }

  .members {
    .item {
      width: 100px;
      text-align: center;
      cursor: pointer;
    }

    .active {
      color: #1890ff;
      position: relative;

      &:after {
        content: '';
        display: block;
        width: 43px;
        height: 3px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -14px;
        background: #1890ff;
      }
    }
  }
}

.user-info {
  padding: 16px;
  border-bottom: 1px dashed #f2f2f2;

  .avatar img {
    width: 56px;
    height: 56px;
    border-radius: 2px;
  }

  .left {
    align-items: start;

    .source {
      color: #5fc75d;
      font-size: 13px;
    }
  }
}

.tag {
  padding: 23px 16px;
  box-shadow: 0 1px 3px 0 #0000000d;

  .title {
    color: #00000073;
    font-size: 13px;
    margin-right: 6px;
    white-space: nowrap;
  }
}

.step {
  padding: 16px;

  .item {
    margin-bottom: 23px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.info-box {
  padding: 0 16px 16px;
}

.loading {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin-top: 16px;
}
</style>
