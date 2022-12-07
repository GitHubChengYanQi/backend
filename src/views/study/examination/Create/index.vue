<template>
  <div>
    <breadcrumb :titles="['考试管理','创建试卷']" back></breadcrumb>

    <div>
      <div class="head">
        <div class="total">
          <div class="box">
            <a-icon type="form" class="icon" />
            <div>
              <div class="num">155</div>
              总题数
            </div>
          </div>
          <div class="box">
            <a-icon type="form" class="icon" />
            <div>
              <div class="num">155</div>
              当前总分
            </div>
          </div>
        </div>
        <div class="set">
          <div :style="{width: '120px'}">每题相同分：</div>
          <a-switch />
          <a-input-number class="input" v-model="number" />
          分
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../../components/Breadcrumd/index'

export default {
  data () {
    return {
      number: 0
    }
  },
  components: { breadcrumb }
}
</script>

<style lang="less" scoped>
.head {
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: #fff;
  margin-bottom: 24px;
  gap: 24px;
  border-radius: 8px;

  .total {
    display: flex;
    width: 50%;

    .box {
      border-radius: 8px;
      flex-grow: 1;
      padding: 24px;
      background-color: #fbfbfe;
      gap: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-items: center;

      .icon {
        font-size: 56px;
        box-shadow: 0 0 5px 0 #02020275;
      }

      .num {
        font-weight: bold;
        font-size: 32px;
      }
    }
  }

  .set {
    width: 50%;
    display: flex;
    align-items: center;

    .input {
      height: 40px;
      border-radius: 4px;
      margin: 0 12px;
      width: 100px;
      border: none;
      background-color: #F5F6FA;

      /deep/ input {
        height: 40px;
        text-align: center;
      }
    }
  }
}
</style>
