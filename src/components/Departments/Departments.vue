<template>
  <div class="department-box">
    <Department
      v-for="v in list"
      :key="v.id"
      :data="v"
      :current="currentCorp"
      @change="clickChange"
    />
  </div>
</template>

<script>
import { getDepartList } from '@/api/selectMember'
import Department from '@/components/Departments/Department'

export default {
  name: 'Departments',
  data () {
    return {
      list: [],
      currentCorp: {
        id: ''
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    clickChange (e) {
      this.currentCorp = e

      this.$emit('change', e)
    },

    getData () {
      getDepartList().then(res => {
        this.list = res.data

        this.list.forEach(v => {
          v.down = true
        })
      })
    }
  },
  components: { Department }
}
</script>

<style scoped>

</style>
