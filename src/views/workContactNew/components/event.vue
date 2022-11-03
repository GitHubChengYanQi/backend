<template>
  <div class="event-box">
    <a-modal v-model="modalShow" :width="600" :footer="false" centered title="查看事件">
      <div class="user-info mb16 flex">
        <div class="avatar mr6">
          <img :src="userInfo.avatar">
        </div>
        <div class="nickname">
          {{ userInfo.nickname }}
        </div>
      </div>
      <div class="flex mb8">
        <div class="title flex">
          <div class="bor mr6"></div>
          全部事件
        </div>
        <a-divider type="vertical" class="mt3"/>
        <div class="flex">
          <a-checkbox v-model="filter">
            查看本次筛选事件
          </a-checkbox>
        </div>
      </div>
      <div class="tips-text mb16" v-if="filter">
        <span v-if="form.startTime">筛选条件：{{ form.startTime }}至{{ form.endTime }}之间，</span>
        {{ title }}事件
      </div>

      <div class="step-box">
        <loading :loading="loading" height="100%">
          <StepNews v-model="list"/>
        </loading>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { track } from '@/api/workContact'

export default {
  data () {
    return {
      modalShow: false,
      form: {
        contactId: '',
        event: '',
        startTime: '',
        endTime: ''
      },
      userInfo: {
        nickname: '',
        avatar: ''
      },
      title: '',
      filter: true,
      loading: true,
      list: []
    }
  },
  watch: {
    filter () {
      this.getData()
    }
  },
  methods: {
    show (contactId, event, userInfo, time) {
      this.form.contactId = contactId
      this.form.event = event.event
      this.form.startTime = time[0]
      this.form.endTime = time[1]

      this.title = event.title
      this.userInfo = userInfo

      this.getData()

      this.modalShow = true
    },

    getData () {
      this.loading = true

      let params = {}

      if (this.filter) params = this.form

      if (!this.filter) {
        params = {}
        params.contactId = this.form.contactId
        params.event = 0
      }

      track(params).then(res => {
        this.list = res.data

        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-info {
  .avatar img {
    width: 34px;
    height: 34px;
    border-radius: 2px;
  }
}

.title {
  .bor {
    background: #1890ff;
    width: 3px;
    height: 14px;
  }
}

.tips-text {
  color: #00000072;
  background: #f9f9f9;
  padding: 8px 13px;
  font-size: 13px;
}

.step-box{
  max-height: 660px;
  overflow: auto;
}

/deep/ .ant-modal-body {
  padding-top: 10px;
}
</style>
