<template>
  <div class="a_page">
    <a-card class="a_radarInfo_card">
      <div class="a_radarInfo">
        <div class="radarInfo_title">
          雷达链接信息
        </div>
        <div
          class="radarInfo"
          v-for="(item,index) in radarInfo.type"
          :key="index"
        >
          <span class="title">{{ item.title }}</span>
          <span
            class="arrData"
            v-if="item.type"
          >
            <span
              class="tabs"
              v-for="(items,indexs) in radarInfo.data[item.key] "
              :key="indexs"
            >{{ items }}</span>
          </span>
          <span
            class="data"
            v-else
          >{{ radarInfo.data[item.key] }}</span>
        </div>
      </div>
    </a-card>
    <a-card class="a_dataOverview_card">
      <div class="a_dataOverview">
        <div class="dataOverview_title">
          数据总览
        </div>
        <div class="data_box">
          <div class="left_box">
            <div
              class="data"
              v-for="(item,index) in dataOverview.type.slice(0,3)"
              :key="index"
            >
              <div class="number">{{ dataOverview.data[item.key] }}</div>
              <div class="title"><span class="text">{{ item.title }}</span>
                <a-tooltip placement="bottom">
                  <template #title>
                    <div class="title_box">
                      <div>{{ item.hint }}</div>
                    </div>
                  </template>
                  <div class="icon">?</div>
                </a-tooltip>
              </div>
            </div>
          </div>
          <div class="right_box">
            <div
              class="data"
              v-for="(item,index) in dataOverview.type.slice(3,6)"
              :key="index"
            >
              <div class="number">{{ dataOverview.data[item.key] }}</div>
              <div class="title"><span class="text">{{ item.title }}</span>
                <a-tooltip placement="bottom">
                  <template #title>
                    <div class="title_box">
                      <div>{{ item.hint }}</div>
                    </div>
                  </template>
                  <div class="icon">?</div>
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card class="a_dataDetails_card">
      <div class="a_dataDetails">
        <div class="dataDetails_title">
          数据详情
        </div>
        <div class="dataDetails_lineChart_box">
          <div class="date_box">
            <div
              class="date"
              :style="dataDetails.date == index ? index < 2 ?
                {borderRight:'none',background:'#388fd8',color:'#fff'}:
                {background:'#388fd8',color:'#fff'}:index < 2 ? {borderRight:'none'}:{}"
              v-for="(item,index) in ['近一周','近一月','自定义']"
              :key="index"
              @click="setDate(index)"
            >{{ item }}</div>
            <a-range-picker
              v-if="dataDetails.date == 2"
              @change="setSearchData"
              class="input"
              v-model="dataDetails.data"
            />
          </div>
          <div class="lineChart_box">
            <v-chart
              style="width:100%;height:100%"
              :options="dataDetails.lineChart"
              ref="chars"
            ></v-chart>
          </div>
        </div>
      </div>
    </a-card>
    <a-card class="a_table_card">
      <div class="a_table_box">
        <div class="table_tab_box">
          <div
            class="tab_box"
            @click="setTableTab(index)"
            v-for="(item,index) in ['机构数据','门店数据','员工数据']"
            :key="index"
          >
            <span>{{ item }}</span>
            <div
              class="wire"
              v-if="table.tab == index"
            ></div>
          </div>
        </div>
        <div class="table_search_box">
          <span
            class="search_box"
            v-for="(item,index) in search.table[table.tab]"
            :key="index"
          >
            <span class="search_title">{{ item.title }}</span>
            <span class="search_input">
              <SelectDepartment
                class="input"
                :treeCheckStrictly="true"
                :placeholder="item.placeholder"
                v-model="search.tableData[table.tab][item.key]"
                v-if="item.type == 'selct_checkbox'"
              />
              <selectPersonnel
                class="input"
                v-model="search.tableData[table.tab][item.key]"
                :changeId="true"
                :num="1"
                :type="'selector'"
                v-if="item.type == 'model'"
              />
              <a-range-picker
                class="input"
                v-model="search.tableData[table.tab][item.key]"
                v-if="item.type == 'date'"
              />
            </span>
          </span>
          <div class="button_box">
            <a-button
              class="button"
              @click="getSearch"
            >查询</a-button>
            <a-button
              type="primary"
              ghost
              class="button"
              @click="reset"
            >重置</a-button>
            <a-button
              class="button"
              type="primary"
              @click="exportsElxe"
            >导出</a-button>
          </div>
        </div>
        <div
          class="table_box"
          v-for="item in 3"
          :key="item"
        >
          <a-table
            v-if="item - 1 == table.tab"
            :row-key="record => record.id"
            :columns="table.columns[table.tab]"
            :data-source="table.tableData"
            :pagination="table.pagination"
            :scroll="{ x: 1500}"
            @change="handleTableChange"
            ref="table"
          >
          </a-table>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radarInfo: {
        type: [
          { title: '雷达标题：', key: 'radarTitle' },
          { title: '创建人：', key: 'creator' },
          { title: '所属分组：', key: 'Group' },
          { title: '行为通知：', key: 'officeAction' },
          { title: '创建时间：', key: 'creationTime' },
          { title: '动态通知：', key: 'dynamicInform' },
          { title: '客户标签：', key: 'customersTag', type: 'tabs' }
        ],
        data: {
          radarTitle: '111',
          creator: '111',
          Group: '111',
          officeAction: '2222',
          creationTime: '1111',
          dynamicInform: '1111',
          customersTag: ['222', '111']
        }
      },
      dataOverview: {
        type: [
          {
            title: '发送总次数',
            key: '1',
            hint: '当前雷达在侧边栏被员工发送的总次数（sop/朋友圈以任务完成计算次数）。'
          },
          {
            title: '查看总次数',
            key: '2',
            hint: '当前雷达被客户打开的总次数，不去重。'
          },
          {
            title: '查看总人数',
            key: '3',
            hint: '当前雷达被客户打开的总人数，去重。'
          },
          {
            title: '今日发送总次数',
            key: '4',
            hint: '今日当前雷达在侧边栏被员工发送的总次数（sop/朋友圈以任务完成计算次数）。'
          },
          {
            title: '今日查看总次数',
            key: '5',
            hint: '今日当前雷达被客户打开的总次数，不去重。'
          },
          {
            title: '今日查看总人数',
            key: '6',
            hint: '今日当前雷达被客户打开的总人数，去重。'
          }
        ],
        data: {
          1: '0',
          2: '0',
          3: '0',
          4: '0',
          5: '0',
          6: '0'
        }
      },
      dataDetails: {
        date: 0,
        data: [],
        lineChart: {
          dataZoom: {
            type: 'inside',
            show: true,
            start: 0,
            end: 100
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#03B976' // 显示竖线颜色
              }
            },
            backgroundColor: '#FFFFFF', // tooltip背景色
            borderColor: '#03B976', // tooltip边框颜色
            borderWidth: 1,
            textStyle: {
              color: '#444444' // 设置文字颜色
            }
          },
          legend: {
            right: 'center',
            icon: 'circle',
            bottom: 0,
            data: ['发送次数', '查看次数', '查看人数']
          },
          grid: {
            left: '6%',
            right: '6%',
            bottom: '20%',
            width: 'auto'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['0', '1', '2'],
            axisLabel: {
              interval: 'auto',
              rotate: 0,
              margin: 20,
              textStyle: {
                color: '#868B98'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            nameTextStyle: {
              color: '#444444',
              fontSize: 18,
              padding: [0, 0, 10, 0]
            },
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#868B98'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#EEEEEE'
              }
            }
          },
          series: [
            {
              name: '发送次数',
              type: 'line',
              data: [0, 1, 2],
              smooth: true,
              stack: 'Total',
              showSymbol: false,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#0162f0',
                  lineStyle: {
                    color: '#0162f0'
                  }
                }
              }
            },
            {
              name: '查看次数',
              type: 'line',
              smooth: true,
              data: [],
              showSymbol: false,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#31cab8',
                  lineStyle: {
                    color: '#31cab8'
                  }
                }
              }
            },
            {
              name: '查看人数',
              type: 'line',
              smooth: true,
              data: [],
              showSymbol: false,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#FE9719',
                  lineStyle: {
                    color: '#FE9719'
                  }
                }
              }
            }
          ]
        }
      },
      table: {
        tab: 0,
        columns: {
          0: [
            {
              align: 'center',
              title: '机构名称',
              fixed: 'left',
              dataIndex: 'employeeAgencyName',
              width: 150
            },
            {
              align: 'center',
              title: '员工数量',
              sorter: true,
              // sortOrder: this.table.order.columnKey === 'name' && this.table.order,
              dataIndex: 'infoEmployeeCount',
              width: 150
            },
            {
              align: 'center',
              title: '总客户数',
              sorter: true,
              dataIndex: 'infoContactCount',
              width: 150
            },
            {
              align: 'center',
              title: '总流失客户数',
              sorter: true,
              dataIndex: 'contactLoseCount',
              width: 150
            },
            {
              align: 'center',
              title: '总流失率',
              dataIndex: 'contactLoseRatio',
              width: 150
            },
            {
              align: 'center',
              title: '总流失会员数',
              sorter: true,
              dataIndex: 'fellowLoseCount',
              width: 150
            },
            {
              align: 'center',
              title: '流失会员占比',
              dataIndex: 'fellowLoseRatio',
              width: 150
            },
            {
              align: 'center',
              title: '员工删除客户流失人数',
              sorter: true,
              dataIndex: 'deleteClientCount',
              width: 200
            },
            {
              align: 'center',
              title: '员工删除客户流失占比',
              dataIndex: 'deleteClientRatio',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失人数',
              sorter: true,
              dataIndex: 'deleteStaffCount',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失占比',
              dataIndex: 'deleteStaffRatio',
              width: 200
            },
            {
              align: 'center',
              sorter: true,
              title: '离职继承失败流失人数',
              dataIndex: 'deleteOverCount',
              width: 200
            },
            {
              align: 'center',
              title: '离职继承失败流失占比',
              dataIndex: 'deleteOverRatio',
              width: 200
            }
          ],
          1: [
            {
              align: 'center',
              title: '门店名称',
              fixed: 'left',
              dataIndex: 'employeeOutletName',
              width: 150
            },
            {
              align: 'center',
              title: '所属机构',
              dataIndex: 'employeeAgencyName',
              width: 150
            },
            {
              align: 'center',
              title: '员工数量',
              sorter: true,
              dataIndex: 'infoEmployeeCount',
              width: 150
            },
            {
              align: 'center',
              sorter: true,
              title: '总客户数',
              dataIndex: 'infoContactCount',
              width: 150
            },
            {
              align: 'center',
              sorter: true,
              title: '总流失客户数',
              dataIndex: 'contactLoseCount',
              width: 150
            },
            {
              align: 'center',
              title: '总流失率',
              dataIndex: 'contactLoseRatio',
              width: 150
            },
            {
              align: 'center',
              title: '总流失会员数',
              dataIndex: 'fellowLoseCount',
              width: 150
            },
            {
              align: 'center',
              title: '流失会员占比',
              dataIndex: 'fellowLoseRatio',
              width: 150
            },
            {
              align: 'center',
              sorter: true,
              title: '员工删除客户流失人数',
              dataIndex: 'deleteClientCount',
              width: 200
            },
            {
              align: 'center',
              title: '员工删除客户流失占比',
              dataIndex: 'deleteClientRatio',
              width: 200
            },
            {
              align: 'center',
              sorter: true,
              title: '客户删除员工流失人数',
              dataIndex: 'deleteStaffCount',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失占比',
              dataIndex: 'deleteStaffRatio',
              width: 200
            },
            {
              align: 'center',
              sorter: true,
              title: '离职继承失败流失人数',
              dataIndex: 'deleteOverCount',
              width: 200
            },
            {
              align: 'center',
              title: '离职继承失败流失占比',
              dataIndex: 'deleteOverRatio',
              width: 200
            }
          ],
          2: [
            {
              align: 'center',
              title: '员工名称',
              fixed: 'left',
              dataIndex: 'employeeInfoName',
              width: 150
            },
            {
              align: 'center',
              title: '所属门店',
              dataIndex: 'employeeOutletName',
              width: 150
            },
            {
              align: 'center',
              title: '所属机构',
              dataIndex: 'employeeAgencyName',
              width: 150
            },
            {
              align: 'center',
              title: '总客户数',
              dataIndex: 'infoContactCount',
              sorter: true,
              width: 150
            },
            {
              align: 'center',
              title: '总流失客户数',
              sorter: true,
              dataIndex: 'contactLoseCount',
              width: 150
            },
            {
              align: 'center',
              title: '总流失率',
              dataIndex: 'contactLoseRatio',
              width: 150
            },
            {
              align: 'center',
              title: '总流失会员数',
              dataIndex: 'fellowLoseCount',
              width: 150
            },
            {
              align: 'center',
              title: '流失会员占比',
              dataIndex: 'fellowLoseRatio',
              width: 150
            },
            {
              align: 'center',
              title: '员工删除客户流失人数',
              sorter: true,
              dataIndex: 'deleteClientCount',
              width: 200
            },
            {
              align: 'center',
              title: '员工删除客户流失占比',
              dataIndex: 'deleteClientRatio',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失人数',
              sorter: true,
              dataIndex: 'deleteStaffCount',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失占比',
              dataIndex: 'deleteStaffRatio',
              width: 200
            },
            {
              align: 'center',
              title: '离职继承失败流失人数',
              dataIndex: 'deleteOverCount',
              sorter: true,
              width: 200
            },
            {
              align: 'center',
              title: '离职继承失败流失占比',
              dataIndex: 'deleteOverRatio',
              width: 200
            }
          ]
        },
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '50']
        },
        tableData: [],
        order: {}
      },
      search: {
        table: {
          0: [
            {
              title: '所属机构',
              type: 'selct_checkbox',
              key: 'employeeAgencyId',
              placeholder: '请选择机构'
            }
          ],
          1: [
            {
              title: '所属门店',
              type: 'selct_checkbox',
              key: 'employeeOutletId',
              placeholder: '请选择门店'
            }
          ],
          2: [
            {
              title: '所属员工',
              type: 'model',
              key: 'employeeInfoId',
              placeholder: '请选择员工'
            }
          ]
        },
        tableData: {
          0: { employeeAgencyId: [] },
          1: { employeeOutletId: [] },
          2: { employeeInfoId: [] }
        }
      }
    }
  },
  methods: {
    setSearchData (e, string) {
      console.log(e, string)
      console.log(this.dataDetails.data)
    },
    setDate (e) {
      this.dataDetails.date = e
    },
    getSearch () {

    },
    exportsElxe () {

    },
    reset () {

    },
    handleTableChange () {

    },
    setTableTab (e) {
      this.table.tab = e
    }
  }
}
</script>

<style lang="less" scoped>
.a_page {
  width: 100%;
  .a_radarInfo_card {
    width: 100%;
    .a_radarInfo {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .radarInfo_title {
        width: 100%;
        height: 35px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
      }
      .radarInfo {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        width: 50%;
        .title {
          display: flex;
          justify-content: flex-end;
          width: 80px;
        }
        .arrData {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
        .tabs {
          margin-right: 5px;
          position: relative;
          padding: 0 10px;
          height: 20px;
          border-radius: 5px;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .a_dataOverview_card {
    margin-top: 15px;
    width: 100%;
    .a_dataOverview {
      width: 100%;
      .dataOverview_title {
        width: 100%;
        height: 35px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
      }
      .data_box {
        width: 100%;
        height: 100px;
        border-radius: 10px;
        border: 1px solid #cddff0;
        display: flex;
        align-items: center;
        .left_box {
          width: 50%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #ccc;
        }
        .right_box {
          width: 50%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .data {
          font-family: 'Arial Normal', 'Arial', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 13px;
          width: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .title {
            display: flex;
            align-items: center;
            .icon {
              margin-left: 5px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background-color: #252433;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .a_dataDetails_card {
    margin-top: 15px;
    width: 100%;
    .a_dataDetails {
      width: 100%;
      .dataDetails_title {
        width: 100%;
        height: 35px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
      }
      .dataDetails_lineChart_box {
        .date_box {
          width: 100%;
          height: 35px;
          display: flex;
          align-items: center;
          .date {
            cursor: pointer;
            width: 90px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          .input {
            margin-left: 28px;
            width: 330px;
            height: 35px;
          }
        }
        .lineChart_box {
          width: 100%;
          height: 400px;
        }
      }
    }
  }
  .a_table_card {
    width: 100%;
    .a_table_box {
      width: 100%;
      .table_tab_box {
        display: flex;
        align-items: center;
        width: 100%;
        height: 56px;
        border-bottom: 1px solid #eeeeee;
        .tab_box {
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 124px;
          height: 100%;
          font-size: 16px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #444444;
          line-height: 24px;
          .wire {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translate(-50%);
            width: 25%;
            height: 4px;
            border-radius: 4px;
            background: #1890ff;
          }
        }
      }
      .table_search_box {
        box-sizing: border-box;
        padding: 30px;
        width: 100%;
        display: flex;
        align-items: center;
        .search_box {
          display: flex;
          align-items: center;
          .search_title {
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
            margin-right: 32px;

            .input {
              width: 100%;
            }
          }
        }
        .button_box {
          margin-left: auto;
          display: flex;
          align-items: center;
          .button {
            margin-left: 16px;
          }
        }
      }
      .table_box {
        .table_header {
          cursor: pointer;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
