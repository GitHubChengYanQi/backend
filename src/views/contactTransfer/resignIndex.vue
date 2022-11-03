<template>
  <div>
    <a-tabs v-model="active">
      <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.name"></a-tab-pane>
    </a-tabs>
    <div>
      <leaveClient v-if="active==='1'" />
      <leaveGroup v-if="active==='2'"/>
    </div>
  </div>
</template>

<script>
import leaveClient from './components/leaveClient'
import leaveGroup from './components/leaveGroup'
export default {
  components: {
    leaveClient,
    leaveGroup
  },
  data () {
    return {
      active: '1',
      tabs: [
        {
          key: '1',
          name: '待分配客户'
        },
        {
          key: '2',
          name: '待分配群聊'
        }
      ]
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>

</style>
