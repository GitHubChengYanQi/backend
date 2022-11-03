<template>
  <div>
    <a-tabs v-model="active">
      <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.name"></a-tab-pane>
    </a-tabs>
    <div>
      <order v-if="active==='1'" />
      <actor v-if="active==='2'"/>
      <rights v-if="active==='3'" />
      <record v-if="active==='4'" />
    </div>
  </div>
</template>

<script>
import actor from './components/actor'
import order from './components/order'
import record from './components/record'
import rights from './components/rights'
export default {
  components: {
    actor,
    order,
    record,
    rights
  },
  data () {
    return {
      active: '1',
      tabs: [
        {
          key: '1',
          name: '协作人订单'
        },
        {
          key: '2',
          name: '客户协作人列表'
        },
        {
          key: '3',
          name: '主维护人权益分配'
        },
        {
          key: '4',
          name: '分配记录'
        }
      ]
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
