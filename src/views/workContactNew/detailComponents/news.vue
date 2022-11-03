<template>
  <div class="box">
    <div class="mb23">
      <a-radio-group :options="options" v-model="radioValue"/>
    </div>

    <loading :loading="loading" height="100%">
      <stepNews v-model="trackData"/>
    </loading>
  </div>
</template>

<script>
import { track } from '@/api/workContact'
import stepNews from '@/components/StepNews/StepNews'

export default {
  data () {
    return {
      options: [
        { label: '全部动态', value: '0' },
        { label: '添加客户', value: '1' },
        { label: '打标签', value: '2' },
        { label: '修改客户信息', value: '3' },
        { label: '编辑用户画像', value: '4' },
        { label: '跟进状态', value: '5' },
        { label: '跟进记录', value: '6' },
        { label: '跟进模板记录', value: '7' },
        { label: '待办事项', value: '8' },
        { label: '朋友圈互动', value: '9' },
        { label: '取消标签', value: '10' }
      ],
      radioValue: '0',
      trackData: [],
      loading: true,
      contactId: 0
    }
  },
  watch: {
    radioValue () {
      this.getData()
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getContactId () {
      if (this.$route.query.contactId !== undefined) {
        this.contactId = this.$route.query.contactId
      } else if (this.$route.query.id !== undefined) {
        this.contactId = this.$route.query.id
      }
    },
    getData () {
      this.loading = true
      this.getContactId()
      track({
        contactId: this.contactId,
        event: this.radioValue
      }).then(res => {
        this.trackData = res.data

        this.loading = false
      })
    }
  },
  components: { stepNews }
}
</script>

<style scoped>

</style>
