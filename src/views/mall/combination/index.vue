<template>
    <a-card>
      <a-tabs v-model="active">
        <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.name"></a-tab-pane>
      </a-tabs>
      <div>
        <combined v-if="active==='1'" />
        <disease v-if="active==='2'"/>
      </div>
    </a-card>
  </template>
  
  <script>
  import combined from './components/combined'
  import disease from './components/disease'
  export default {
    components: {
      combined,
      disease
    },
    data () {
      return {
        active: '1',
        tabs: [
          {
            key: '1',
            name: '设置联合用药'
          },
          {
            key: '2',
            name: '疾病分类'
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
  