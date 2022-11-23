<template>
  <div>
    群日历模板
    <button @click="addCalendar">添加群日历</button>
  </div>
</template>

<script>
export default {
  name: 'ClusterCalendarTemplate',

  data () {
    return {

    }
  },

  mounted () {

  },

  methods: {
    addCalendar () {
      this.$router.push({
        path: '/sop/addClusterCalendar',
        query: {
          id: -1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
