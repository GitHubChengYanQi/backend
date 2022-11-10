<template>
  <div>
    <a-modal v-model="visible" :title="title" @ok="handleOk" :width="400" :destroyOnClose="true">
      <div class="dateContent" v-if="type == 3">
        <span style="width:135px">选择发送日期 : </span>
        <a-date-picker v-model="dateTime" format="YYYY-MM-DD" />
        <a-time-picker v-model="time" format="HH:mm" :minuteStep="15" :allowClear="false" />
      </div>
      <a-input-search :placeholder="placeholder" v-model="searchVal" @search="onSearch" @change="nameChange"/>
      <a-spin :spinning="loading">
        <div
          class="demo-infinite-container"
          style="margin-top: 0"
          v-infinite-scroll="getList"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10"
        >
          <a-radio-group v-model="currentId" style="width: 100%">
            <a-list :data-source="list" v-if="type == 1">
              <a-list-item slot="renderItem" slot-scope="item" :key="item.planId">
                <a-list-item-meta :description="item.planName"></a-list-item-meta>
                <div>
                  <a-radio :value="item.planId"> </a-radio>
                </div>
              </a-list-item>
            </a-list>
            <a-list :data-source="list" v-if="type == 3">
              <a-list-item slot="renderItem" slot-scope="item" v-if="type == 3" :key="item.questionnaireName">
                <a-list-item-meta :description="item.questionnaireName"></a-list-item-meta>
                <div>
                  <a-radio :value="item.questionnaireId"> </a-radio>
                </div>
              </a-list-item>
            </a-list>
          </a-radio-group>
          <Empty v-if="!list.length" />
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { planPlanList, planBindAddBatch, diagnosisCareQuestionnaireList, taskAdd } from '@/api/healthManage'
import infiniteScroll from '@/utils/directive'
import moment from 'moment'
export default {
  // eslint-disable-next-line
  props: ['contactId'],
  directives: { infiniteScroll },
  data () {
    return {
      currentId: '', // 选中ID
      list: [], // 列表
      visible: false,
      type: '', // 1:随访方案  2:分组管理
      searchVal: '', // 搜索内容
      isDel: false, // 是否是删除
      title: '',
      id: '', // 所需ID
      placeholder: '',
      dateTime: '',
      time: '',
      loading: false,
      busy: false,
      userListPagination: {
        page: 0,
        total: 0,
        totalPage: 0
      }
    }
  },
  methods: {
    open (type, isDel, id) {
      this.type = type
      console.log(this.type, 'this.type')
      this.isDel = isDel
      this.id = id
      this.currentId = ''
      this.searchVal = ''
      if (type == 1) {
        this.onSearch()
        this.title = '添加随访方案'
        this.placeholder = '输入方案名称'
      }
      if (type == 3) {
        this.onSearch()
        this.title = '添加任务'
        this.placeholder = '输入问卷名称'
      }
      this.visible = true
    },
    // 搜索
    nameChange () {
      this.onSearch()
    },
    onSearch () {
      this.busy = false
      this.list = []
      this.userListPagination = {
        page: 0,
        total: 0,
        totalPage: 0
      }
      if (this.type == 1) {
        this.planPlanList()
      }
      if (this.type == 3) {
        this.getDiagnosisCareQuestionnaireList()
      }
    },
    getList () {
      if (this.type == 1) {
        this.busy = true
        // this.planPlanList()
      }
      if (this.type == 3) {
        this.getDiagnosisCareQuestionnaireList()
      }
    },
    // 方案列表
    async planPlanList () {
      if (this.loading) return
      const { totalPage, page } = this.userListPagination
      this.userListPagination.page = page + 1
      if (totalPage && page >= totalPage) {
        this.busy = true
        return
      }
      const params = {
        page: this.userListPagination.page,
        size: 20
      }
      this.loading = true
      const { code, data } = await planPlanList({ planName: this.searchVal, status: 1, contactId: this.id }, params)
      if (code == 200) {
        const arr = this.list
        this.list = arr.concat(data.records)
        this.userListPagination.totalPage = Math.ceil(data.total / 20)
      }
      this.loading = false
    },
    // 问卷列表
    async getDiagnosisCareQuestionnaireList () {
      if (this.loading) return
      const { totalPage, page } = this.userListPagination
      this.userListPagination.page = page + 1
      if (totalPage && page >= totalPage) {
        this.busy = true
        return
      }
      const params = {
        page: this.userListPagination.page,
        size: 20
      }
      this.loading = true
      try {
        const { code, data } = await diagnosisCareQuestionnaireList({ questionnaireName: this.searchVal, contactId: this.id }, params)
        if (code == 200) {
          const arr = this.list
          this.list = arr.concat(data.records)
          this.userListPagination.totalPage = Math.ceil(data.total / 20)
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },

    // 确定
    handleOk () {
      if (this.type == 1) {
        this.addPlan()
      }
      if (this.type == 3) {
        this.addQuestionnaire()
      }
    },
    async addPlan () {
      const { code } = await planBindAddBatch({
        planId: this.currentId,
        workContactIds: [this.id]
      })
      this.visible = false
      if (code === 200) {
        this.$message.success('添加成功')
      } else {
        this.$message.error('添加失败')
      }
      this.$emit('updataPage')
    },
    async addQuestionnaire () {
      let date = ''
      if (this.dateTime && this.time) {
        date = moment(this.dateTime).format('YYYY-MM-DD') + ' ' + moment(this.time).format('HH:mm') + ':00'
      } else {
        this.$message.error('请选择发送日期')
      }
      const { code } = await taskAdd({
        formId: this.currentId,
        type: 1,
        contactId: this.contactId,
        planId: this.id,
        startTime: date
      })
      this.visible = false
      if (code === 200) {
        this.$message.success('添加成功')
      } else {
        this.$message.error('添加失败')
      }
      this.$emit('updataPage')
    }
  }
}
</script>

<style lang="less">
.dateContent {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &>span {
    margin-right: 15px;
  }
}

.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 330px;
  margin-top: 20px;
}
</style>
