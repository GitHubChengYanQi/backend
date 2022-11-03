<template>
  <div class="wrapper">
    <a-card>
      <a-tabs v-model="active">
        <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.name"></a-tab-pane>
      </a-tabs>
      <SignIn v-if="active === '1'" />
      <SignOut v-if="active === '2'" />
    </a-card>
  </div>
</template>

<script>
import SignIn from './components/signIn.vue'
import SignOut from './components/signOut.vue'
export default {
  name: 'Patient',
  components: {
    SignIn,
    SignOut
  },
  data () {
    return {
      active: '1',
      tabs: [
        {
          key: '1',
          name: '认证用户'
        },
        {
          key: '2',
          name: '未认证用户'
        }
      ]
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
.wrapper {
}
</style>
