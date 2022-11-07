<template>
  <div class="lossAnalysis_page">
    <div class="A_header_title">
      <span>
        数据更新频次
      </span>
    </div>
    <div class="A_lineChart_box">
      <div class="A_lineChart_header">
        <div class="A_lineChart_search">
          <span class="title"><span>流失分析</span><span class="wire"></span></span>
          <span class="lineChart_search_box">
            <span
              class="search_box"
              v-for="(item,index) in search.lineChart"
              :key="index"
            >
              <span class="search_title">{{ item.title }}</span>
              <span class="search_input">
                <SelectDepartment
                  class="input"
                  :treeCheckStrictly="true"
                  :placeholder="item.placeholder"
                  @getDept="getDept"
                  v-model="search.lineChartData[item.key]"
                  v-if="item.type == 'selct_checkbox'"
                />
                <selectPersonnel
                  class="input"
                  v-model="search.lineChartData[item.key]"
                  :changeId="true"
                  :num="1"
                  :type="'selector'"
                  v-if="item.type == 'model'"
                />
                <a-range-picker
                  class="input"
                  v-model="search.lineChartData[item.key]"
                  v-if="item.type == 'date'"
                />
              </span>
            </span>
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: {
        lineChart: [
          {
            title: '所属机构',
            type: 'selct_checkbox',
            key: 'selection_mechanism',
            placeholder: '请输入机构'
          },
          {
            title: '所属门店',
            type: 'selct_checkbox',
            key: 'select_store',
            placeholder: '请输入门店'
          },
          {
            title: '所属员工',
            type: 'model',
            key: 'select_staff',
            placeholder: '请选择员工'
          },
          {
            title: '选择时间',
            type: 'date',
            key: 'select_time'
          }
        ],
        lineChartData: {
          selection_mechanism: [],
          select_store: [],
          select_staff: [],
          select_time: []
        }
      }
    }
  },
  methods: {
    getDept (e) {
      this.storeIds = e
    }
  }
}
</script>

<style lang="less" scoped>
.lossAnalysis_page {
  width: 100%;
  position: relative;
  .A_header_title {
    position: absolute;
    top: -36px;
    left: 165px;
    font-size: 13px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #03b976;
    line-height: 24px;
  }
  .A_lineChart_box {
    width: 100%;
    .A_lineChart_header {
      width: 100%;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: 16px;
      padding: 16px 48px 48px 16px;
      .A_lineChart_search {
        display: flex;
        align-items: center;
        .title {
          position: relative;
          font-size: 16px;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #444444;
          line-height: 27px;
          .wire {
            position: absolute;
            left: -16px;
            top: 50%;
            transform: translateY(-50%);
            width: 2px;
            height: 10px;
            background: #03b976;
          }
        }
        .lineChart_search_box {
          margin-left: auto;
          display: flex;
          height: 30px;
          .search_box {
            display: flex;
            align-items: center;
            .search_title {
              margin-left: 32px;
              margin-right: 10px;
              flex-shrink: 0;
              font-size: 14px;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #444444;
              line-height: 21px;
            }
            .search_input {
              width: 170px;
              .input {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
