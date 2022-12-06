<template>
  <div class="a_page">
    <a-card class="a_radarInfo_card">
      <div class="a_radarInfo">
        <div class="radarInfo" v-for="(item,index) in radarInfo.type" :key="index"></div>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radarInfo: {
        type: [{ title: '雷达标题：', key: 'radarTitle' }, { title: '创建人：', key: 'creator' }, { title: '所属分组：', key: 'Group' }, { title: '行为通知：', key: 'officeAction' }, { title: '创建时间：', key: 'creationTime' }, { title: '动态通知：', key: 'dynamicInform' }, { title: '客户标签', key: 'customersTag' }],
        data: {
          radarTitle: '111',
          creator: '111',
          Group: '111',
          officeAction: '2222',
          creationTime: '1111',
          dynamicInform: '1111',
          customersTag: '222'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
