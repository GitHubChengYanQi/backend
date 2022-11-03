<template>
  <img v-if="!sideCollapsed" class="logo" :src="src"/>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      src: require('@/assets/logo.png')
    }
  },
  computed: {
    ...mapState({
      sideCollapsed: state => state.app.sideCollapsed
    })
  }
}
</script>

<style lang="less" scoped>
  .logo{
    width:200px;
    height:auto;
  }
</style>
