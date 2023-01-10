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
  </div>
</template>

<script>
export default {

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
}
</style>
