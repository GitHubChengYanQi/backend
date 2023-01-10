<template>
  <div class="data_page">
    <div class="header">
      <div class="title">随访数据统计</div>
      <span class="hint">数据更新频次</span>
      <a-tooltip placement="right">
        <template #title>
          <div class="title_box">
            <div>数据更新时间截止至当天05:00</div>
          </div>
        </template>
        <div class="icon">?</div>
      </a-tooltip>
    </div>
    <div class="tab_box">
      <div
        class="tab"
        :style="tab_header == index ? {color:'rgba(2, 125, 180, 0.86)',textDecoration:'underline'}:{}"
        v-for="(item,index) in tabArr.header"
        @click="()=>{ tab_header = index }"
        :key="index"
      >{{ item }}</div>
    </div>
    <div class="conten_box">
      <div class="info_header">
        <div class="title">今日数据</div>
        <div class="time">{{ '更新时间：' + infoData.time }}</div>
        <div class="card_box">
          <a-card class="card" v-for="(item,index) in tabArr.cardArr[tab_header]" :key="index">
            <div class="number">{{ infoData.card[item.key] }}</div>
            <div class="title">{{ item.title }}</div>
          </a-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabArr: {
        header: ['随访方案数据', '随访任务数据'], // 头部切换
        cardArr: {
          0: [
            { title: '方案总数', key: '0' },
            { title: '新增方案数', key: '1' },
            { title: '累计用户使用方案数', key: '2' },
            { title: '新增用户使用方案数', key: '3' },
            { title: '方案累计触发预警次数', key: '4' },
            { title: '累计触达用户的预警数', key: '5' }
          ],
          1: [
            { title: '随访任务总数', key: '0' },
            { title: '新增任务数', key: '1' },
            { title: '进行中任务数', key: '2' },
            { title: '完成任务数', key: '3' },
            { title: '任务发送率', key: '4' },
            { title: '任务完成率', key: '5' }
          ]
        }
      },
      tab_header: 0,
      infoData: {
        time: '2022-09-22 05:00',
        card: [0, 1, 3, 3, 4, 5, 6]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.data_page {
  width: 100%;
  min-height: 100vh;
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #333333;
    margin-bottom: 45px;
    .hint {
      margin-left: 25px;
      font-size: 12px;
      font-weight: 400;
      color: #333333;
    }
    .icon {
      margin-left: 20px;
      width: 15px;
      height: 15px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ccc;
      border-radius: 50%;
      font-size: 12px;
    }
  }
  .tab_box {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 15px;
    color: #333333;
    .tab {
      cursor: pointer;
      margin-right: 35px;
    }
  }
  .conten_box {
    width: 100%;
    .info_header {
      width: 100%;
      font-family: 'Arial Normal', 'Arial', sans-serif;
      font-weight: 400;
      color: #333333;
      .title {
        font-size: 14px;
        line-height: 25px;
      }
      .time {
        font-size: 12px;
      }
      .card_box {
        margin-top: 10px;
        display: flex;
        align-items: center;
        .card {
          border-radius: 15px;
          width: 200px;
          height: 100px;
          margin-right: 40px;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          color: #333333;
          font-family: 'Arial Normal', 'Arial', sans-serif;
          font-weight: 400;
          .number {
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-transform: none;
            text-align: center;
            font-size: 16px;
            line-height: normal;
          }
          .title {
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 15px;
            white-space: nowrap;
            text-transform: none;
            font-size: 18px;
            line-height: normal;
          }
        }
      }
    }
  }
}
</style>
