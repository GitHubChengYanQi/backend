<!-- 当前随访详情 -->
<template>
  <div>
    <a-card>
      <a-row type="flex" justify="space-between">
        <div>
          {{ planName }}
        </div>
        <div>
          创建人：{{ creatorName }}
        </div>
      </a-row>
      <a-divider style="height: 0;"></a-divider>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="患者管理">
          <PatientTable v-if="currentKey == '1'" :planId="planId" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="随访任务">
          <FollowUpTable v-if="currentKey == '2'" :planId="planId" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="编辑方案">
          <EditProgramme v-if="currentKey == '3'" :planId="planId" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import PatientTable from './components/patientTable.vue'
import FollowUpTable from './components/followUpTable.vue'
import EditProgramme from './components/editProgramme.vue'
export default {
  components: {
    PatientTable,
    FollowUpTable,
    EditProgramme
  },
  data () {
    return {
      planId: '',
      planName: '',
      creatorName: '',
      currentKey: '1'
    }
  },
  created () {
    const { planId, planName, creatorName } = this.$route.query
    this.planId = planId
    this.planName = planName
    this.creatorName = creatorName
  },
  beforeDestroy () {
  },
  methods: {
    callback (key) {
      this.currentKey = key
    }

  }
}
</script>
