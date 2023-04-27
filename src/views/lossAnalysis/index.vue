<template>
  <div class="lossAnalysis_page">
    <div class="lossAnalysis_header_title">
      <span>
        数据更新频次
      </span>
      <a-tooltip placement="right">
        <template #title>
          <div class="title_box">
            <div>更新频率:</div>
            <div>每两分钟更新一次</div>
          </div>
        </template>
        <div class="icon">?</div>
      </a-tooltip>

    </div>
    <div class="lossAnalysis_lineChart_box">
      <div class="lossAnalysis_lineChart_header">
        <div class="lossAnalysis_lineChart_search">
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
                  @getDept="(e)=>{
                    setValue(e,item.key,'lineChartData')}"
                  class="input"
                  :treeCheckStrictly="true"
                  :placeholder="item.placeholder"
                  v-model="search.lineChartData[item.key]"
                  v-if="item.type == 'selct_checkbox'"
                />
                <selectPersonnel
                  @getVal="(e)=>{
                    setValue(e,item.key,'lineChartData')}"
                  class="input"
                  v-model="search.lineChartData[item.key]"
                  :changeId="true"
                  :num="1"
                  :type="'selector'"
                  v-if="item.type == 'model'"
                />
                <a-range-picker
                  @change="setSearchData('lineChartData')"
                  class="input"
                  v-model="search.lineChartData[item.key]"
                  v-if="item.type == 'date'"
                />
              </span>
            </span>
          </span>
        </div>
        <div class="lossAnalysis_lineChart_tabBox">
          <span
            class="lineChart_tab"
            @click="setLineChartTab(index)"
            v-for="(item,index) in ['流失人数','流失会员人数']"
            :style="index == lineChart.tab ? {color:'#1890ff'}:{}"
            :key="index"
          ><span>{{ item }}</span>
            <div
              class="wire"
              v-if="index == lineChart.tab"
            ></div>
          </span>
        </div>
        <div class="lossAnalysis_lineChart">
          <v-chart
            v-if="state.lineChartState"
            style="width:100%;height:100%"
            :options="lineChart.options[lineChart.tab]"
            ref="chars"
          ></v-chart>
          <div
            class="no_datlossAnalysis_box"
            v-else
          >
            <img
              style="width:200px;height:auto;margin-bottom:5px;"
              :src="require('@/assets/no_data.png')"
              alt=""
            >
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    <div class="lossAnalysis_sectorChart_box">
      <div class="lossAnalysis_leftChart_box">
        <div class="hearder_box">
          <span class="title"><span>机构对比</span><span class="wire"></span>
            <a-tooltip placement="right">
              <template #title>
                <div class="title_box">
                  <div>单个机构流失数/所选机构总流失数</div>
                </div>
              </template>
              <div class="icon">?</div>
            </a-tooltip>
          </span>
          <div class="input_box">
            <span
              class="search_box"
              v-for="(item,index) in search.leftChart"
              :key="index"
            >
              <span class="search_title">{{ item.title }}</span>
              <span class="search_input">
                <SelectDepartment
                  @getDept="(e)=>{
                    setValue(e,item.key,'leftChartData')}"
                  class="input"
                  :treeCheckStrictly="true"
                  :placeholder="item.placeholder"
                  v-model="search.leftChartData[item.key]"
                  v-if="item.type == 'selct_checkbox'"
                />
                <selectPersonnel
                  @getVal="(e)=>{
                    setValue(e,item.key,'leftChartData')}"
                  class="input"
                  v-model="search.leftChartData[item.key]"
                  :changeId="true"
                  :num="1"
                  :type="'selector'"
                  v-if="item.type == 'model'"
                />
                <a-range-picker
                  @change="setSearchData('leftChartData')"
                  class="input"
                  v-model="search.leftChartData[item.key]"
                  v-if="item.type == 'date'"
                />
              </span>
            </span>
          </div>
        </div>
        <div class="leftChart">
          <v-chart
            v-if="state.leftChartState"
            style="width:100%;height:100%"
            :options="sectorChart.leftChart.options"
          ></v-chart>
          <div
            class="no_datlossAnalysis_box"
            v-else
          >
            <img
              style="width:200px;height:auto;margin-bottom:5px;"
              :src="require('@/assets/no_data.png')"
              alt=""
            >
            <span>暂无数据</span>
          </div>
        </div>
      </div>
      <div class="lossAnalysis_rightChart_box">
        <div class="hearder_box">
          <span class="title"><span>门店对比</span><span class="wire"></span>
            <a-tooltip placement="right">
              <template #title>
                <div class="title_box">
                  <div>单个门店流失数/所选门店总流失数</div>
                </div>
              </template>
              <div class="icon">?</div>
            </a-tooltip>
          </span>
          <div class="input_box">
            <span
              class="search_box"
              v-for="(item,index) in search.rightChart"
              :key="index"
            >
              <span class="search_title">{{ item.title }}</span>
              <span class="search_input">
                <SelectDepartment
                  @getDept="(e)=>{
                    setValue(e,item.key,'rightChart')}"
                  class="input"
                  :treeCheckStrictly="true"
                  :placeholder="item.placeholder"
                  v-model="search.rightChartData[item.key]"
                  v-if="item.type == 'selct_checkbox'"
                />
                <selectPersonnel
                  @getVal="(e)=>{
                    setValue(e,item.key,'rightChart')}"
                  class="input"
                  v-model="search.rightChartData[item.key]"
                  :changeId="true"
                  :num="1"
                  :type="'selector'"
                  v-if="item.type == 'model'"
                />
                <a-range-picker
                  @change="setSearchData('rightChartData')"
                  class="input"
                  v-model="search.rightChartData[item.key]"
                  v-if="item.type == 'date'"
                />
              </span>
            </span>
          </div>
        </div>
        <div class="rightChart">
          <v-chart
            v-if="state.rightChartState"
            style="width:100%;height:100%"
            :options="sectorChart.rightChart.options"
          ></v-chart>
          <div
            class="no_datlossAnalysis_box"
            v-else
          >
            <img
              style="width:200px;height:auto;margin-bottom:5px;"
              :src="require('@/assets/no_data.png')"
              alt=""
            >
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    <div class="lossAnalysis_table_box">
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
        <div class="table_title_box">
          <span class="title">数据更新频次</span>
          <a-tooltip placement="right">
            <template #title>
              <div class="title_box">
                <div>更新频率:</div>
                <div>每五分钟更新一次</div>
              </div>
            </template>
            <div class="icon">?</div>
          </a-tooltip>
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
            v-permission="'/lossAnalysis/index@search'"
            @click="getSearch"
          >查询</a-button>
          <a-button
            type="primary"
            ghost
            class="button"
            @click="reset"
          >重置</a-button>
          <a-dropdown
            :trigger="['click']"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
          >
            <a-button
              class="button"
              type="primary"
              v-permission="'/lossAnalysis/index@exports'"
              @click.prevent
            >导出</a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item style="border-bottom:1px solid #ccc;">
                  <div
                    class="down_select"
                    @click="exportsElxe(2)"
                  >导出当前页</div>
                </a-menu-item>
                <a-menu-item>
                  <div
                    class="down_select"
                    @click="exportsElxe(1)"
                  >导出所有</div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
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
  </div>
</template>

<script>
import 'echarts/lib/component/toolbox'
import moment from 'moment'
import { wastageContactLine, wastageContactCake, wastageContactCalc, wastageContactCome } from '@/api/lossAnalysis.js'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
import { deepClonev2 } from '@/utils/util'

export default {
  data () {
    return {
      search: {
        // 折线图选择类型,
        lineChart: [
          {
            title: '所属机构',
            type: 'selct_checkbox',
            key: 'employeeAgencyId',
            placeholder: '请选择机构'
          },
          {
            title: '所属门店',
            type: 'selct_checkbox',
            key: 'employeeOutletId',
            placeholder: '请选择门店'
          },
          {
            title: '所属员工',
            type: 'model',
            key: 'employeeInfoId',
            placeholder: '请选择员工'
          },
          {
            title: '选择时间',
            type: 'date',
            key: 'loseOccur'
          }
        ],
        lineChartData: {
          employeeAgencyId: [],
          employeeOutletId: [],
          employeeInfoId: [],
          loseOccur: []
        },
        // 饼状图选择类型，
        leftChart: [
          {
            title: '选择时间',
            type: 'date',
            key: 'loseOccur'
          },
          {
            title: '所属机构',
            type: 'selct_checkbox',
            key: 'employeeAgencyId',
            placeholder: '请选择机构'
          }
        ],
        leftChartData: {
          loseOccur: [],
          employeeAgencyId: []
        },
        rightChart: [
          {
            title: '选择时间',
            type: 'date',
            key: 'loseOccur'
          },
          {
            title: '所属门店',
            type: 'selct_checkbox',
            key: 'employeeOutletId',
            placeholder: '请选择门店'
          }
        ],
        rightChartData: {
          loseOccur: [],
          employeeOutletId: []
        },
        // 表格选择类型
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
      },
      lineChart: {
        tab: 0,
        options: [
          {
            dataZoom: [
              {
                type: 'inside',
                filterMode: 'none',
                xAxisIndex: [0],
                show: true,
                start: 0,
                end: 100,
                minValueSpan: 3600 * 1000 * 24 * 4,
                maxValueSpan: 3600 * 1000 * 24 * 30
              },
              {
                type: 'inside',
                filterMode: 'none',
                yAxisIndex: [0],
                show: true
              }
            ],
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
            toolbox: {
              show: true, // 是否显示工具栏组件
              orient: 'vertical', // 工具栏icon的布局朝向
              itemSize: 18, // 工具栏icon的大小
              itemGap: 20, // item之间的间距
              top: 60,
              right: 20, // toolbox的定位位置
              feature: {
                dataView: { // 数据视图
                  show: false
                },
                restore: { // 重置
                  show: true
                },
                dataZoom: { // 数据缩放视图
                  show: true
                },
                saveAsImage: {// 保存图片
                  show: true,
                  name: '流失统计图'
                },
                magicType: {// 动态类型切换
                  show: false
                }
              }
            },
            legend: {
              right: 0,
              icon: 'circle',
              top: 15,
              data: ['员工删除客户', '客户删除员工', '离职继承失败', '累计流失人数']
            },
            grid: {
              left: '6%',
              right: '6%',
              bottom: '8%',
              width: 'auto'
            },
            xAxis: {
              type: 'time',
              boundaryGap: false,
              data: [],
              axisLabel: {
                hideOverlap: true
                // formatter: {
                //   year: '{MM}-{dd}',
                //   month: '{MM}-{dd}',
                //   day: '{MM}-{dd}',
                //   hour: '{HH}:{mm}',
                //   minute: '{HH}:{mm}',
                //   second: '{HH}:{mm}',
                //   millisecond: '{HH}:{mm}'
                // }
                // formatter: function (v) {
                //   return moment(v).format('YYYY-MM-DD')
                // }
              },
              // axisLabel: {
              //   interval: 'auto',
              //   rotate: 0,
              //   margin: 20,
              //   textStyle: {
              //     color: '#868B98'
              //   }
              // },
              axisLine: {
                show: true
              },
              axisTick: {
                show: true
              },
              splitLine: {
                show: false
              }
            },
            yAxis: {
              name: '累计：0人',
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
                show: true
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
                name: '员工删除客户',
                type: 'line',
                data: [],
                smooth: true,
                stack: 'Total',
                showSymbol: false,
                symbol: 'circle',
                itemStyle: {
                  normal: {
                    color: '#61DDAA',
                    lineStyle: {
                      color: '#61DDAA'
                    }
                  }
                }
              },
              {
                name: '客户删除员工',
                type: 'line',
                smooth: true,
                data: [],
                showSymbol: false,
                symbol: 'circle',
                itemStyle: {
                  normal: {
                    color: '#3D9EFF',
                    lineStyle: {
                      color: '#3D9EFF'
                    }
                  }
                }
              },
              {
                name: '离职继承失败',
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
              },
              {
                name: '累计流失人数',
                type: 'line',
                smooth: true,
                data: [],
                showSymbol: false,
                symbol: 'circle',
                itemStyle: {
                  normal: {
                    color: '#DFDFDF',
                    lineStyle: {
                      color: '#DFDFDF'
                    }
                  }
                }
              }
            ]
          },
          {
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
              right: 0,
              icon: 'circle',
              top: 15,
              data: ['员工删除客户', '客户删除员工', '离职继承失败', '累计流失会员人数']
            },
            grid: {
              left: '6%',
              right: '6%',
              bottom: '8%',
              width: 'auto'
            },
            xAxis: {
              type: 'time',
              boundaryGap: false,
              data: [],
              axisLabel: {
                hideOverlap: true,
                // formatter: {
                //   year: '{MM}-{dd}',
                //   month: '{MM}-{dd}',
                //   day: '{MM}-{dd}',
                //   hour: '{HH}:{mm}',
                //   minute: '{HH}:{mm}',
                //   second: '{HH}:{mm}',
                //   millisecond: '{HH}:{mm}'
                // }
                formatter: function (v) {
                  return moment(v).format('YYYY-MM-DD')
                }
              },
              axisLine: {
                show: true
              },
              axisTick: {
                show: true
              },
              splitLine: {
                show: false
              }
            },
            yAxis: {
              name: '累计：0人',
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
                show: true
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
                name: '员工删除客户',
                type: 'line',
                data: [],
                smooth: true,
                stack: 'Total',
                showSymbol: false,
                symbol: 'circle',
                itemStyle: {
                  normal: {
                    color: '#61DDAA',
                    lineStyle: {
                      color: '#61DDAA'
                    }
                  }
                }
              },
              {
                name: '客户删除员工',
                type: 'line',
                smooth: true,
                data: [],
                showSymbol: false,
                symbol: 'circle',
                itemStyle: {
                  normal: {
                    color: '#3D9EFF',
                    lineStyle: {
                      color: '#3D9EFF'
                    }
                  }
                }
              },
              {
                name: '离职继承失败',
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
              },
              {
                name: '累计流失会员人数',
                type: 'line',
                smooth: true,
                data: [],
                showSymbol: false,
                symbol: 'circle',
                itemStyle: {
                  normal: {
                    color: '#DFDFDF',
                    lineStyle: {
                      color: '#DFDFDF'
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      sectorChart: {
        leftChart: {
          options: {
            center: ['50%', '50%'],
            color: ['#1890ff', '#5bD0A0', '#EF8E18', '#cccccc'],
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              bottom: 'bottom',
              data: ['用户总资金', '公司总资金', '公司总借款', '用户总还款', '用户总投资']
            },
            series: [
              {
                name: '机构对比',
                type: 'pie',
                radius: ['40%', '70%'],
                tadius: ['50%', '60%'],
                data: []
              }
            ]
          }
        },
        rightChart: {
          options: {
            center: ['50%', '50%'],
            color: ['#1890ff', '#5bD0A0', '#EF8E18', '#cccccc'],
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              bottom: 'bottom',
              data: ['用户总资金', '公司总资金', '公司总借款', '用户总还款', '用户总投资']
            },
            series: [
              {
                name: '门店对比',
                type: 'pie',
                radius: ['40%', '70%'],
                tadius: ['50%', '60%'],
                data: []
              }
            ]
          }
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
      timer: '',
      tableTimer: '',
      state: {
        lineChartState: false,
        leftChartState: false,
        rightChartState: false
      }
    }
  },
  created () {
    this.getLineData()
    this.getCakeData('employee_agency_id')
    this.getCakeData('employee_outlet_id')
    this.createdTimer()
    this.getTableData()
  },
  methods: {
    createdTimer () {
      this.timer = setInterval(this.update, 120000)
      this.tableTimer = setInterval(this.getTableData, 300000)
    },
    update () {
      this.getLineData(this.getNewSearch(this.search.lineChartData))
      this.getCakeData('employee_agency_id', this.getNewSearch(this.search.leftChartData))
      this.getCakeData('employee_outlet_id', this.getNewSearch(this.search.rightChartData))
    },
    setValue (e, key, i) {
      this.search[i][key] = e
      const data = this.search[i]
      if (i == 'lineChartData') {
        this.getLineData(this.getNewSearch(data))
      } else {
        this.getCakeData(i == 'leftChartData' ? 'employee_agency_id' : 'employee_outlet_id', this.getNewSearch(data))
      }
    },
    getCakeData (type, e = {}) {
      const obj = {
        cakeType: type,
        ...e
      }
      wastageContactCake(obj).then((res) => {
        // console.log(res)
        if (type == 'employee_agency_id') {
          this.state.leftChartState = res.data.data.length > 0
          this.sectorChart.leftChart.options.series[0].data = res.data.data.map((item) => {
            const obj = {}
            obj.name = item[0]
            obj.value = item[1]
            obj.label = {
              color: '#444444',
              fontSize: 14,
              formatter: '{b}({d}%)'
            }
            return obj
          })
        } else {
          this.state.rightChartState = res.data.data.length > 0
          this.sectorChart.rightChart.options.series[0].data = res.data.data.map((item) => {
            const obj = {}
            obj.name = item[0]
            obj.value = item[1]
            obj.label = {
              color: '#444444',
              fontSize: 14,
              formatter: '{b}({d}%)'
            }
            return obj
          })
        }
      })
    },
    setLineChartTab (e) {
      this.lineChart.tab = e
      this.search.lineChartData = {
        employeeAgencyId: [],
        employeeOutletId: [],
        employeeInfoId: [],
        loseOccur: []
      }
      this.getLineData()
    },
    setTableTab (e) {
      this.table.tab = e
      this.table.tableData = []
      this.reset()
      this.getTableData()
    },
    exportsElxe (e) {
      this.getTableData(e)
    },
    getSearch () {
      this.table.pagination.current = 1
      this.getTableData()
    },
    getTableData (e = 0) {
      const typeArr = ['employee_agency_id', 'employee_outlet_id', 'employee_info_id']
      const { pagination } = this.table
      const { tab, order } = this.table
      const { tableData } = this.search
      const searchKey = {
        infoEmployeeCount: 'info_employee_count',
        infoContactCount: 'info_contact_coun',
        contactLoseCount: 'contact_lose_count',
        fellowLoseCount: 'fellow_lose_count',
        deleteClientCount: 'delete_client_count',
        deleteStaffCount: 'delete_staff_count',
        deleteOverCount: 'delete_over_count'
      }

      const obj = {
        calcType: typeArr[tab]
      }
      if (e != 1) {
        obj.current = pagination.current
        obj.size = pagination.pageSize
      }
      if (order.order) {
        obj.order = searchKey[order.columnKey]
        obj.queue = order.order == 'ascend'
      }
      const saerchArr = ['employeeAgencyId', 'employeeOutletId', 'employeeInfoId']
      if (tableData[tab][saerchArr[tab]].length > 0) {
        // 需要特殊处理
        if (saerchArr[tab] == 'employeeInfoId') {
          obj[saerchArr[tab]] = tableData[tab][saerchArr[tab]].join(',')
        } else {
          obj[saerchArr[tab]] = tableData[tab][saerchArr[tab]]
            .map((item) => {
              return item.value
            })
            .join(',')
        }
      }
      console.log(obj)
      if (e == 0) {
        wastageContactCalc(obj).then((res) => {
          console.log(res)
          this.table.tableData = res.data.datas.map((item) => {
            const keyArr = [
              'contactLoseRatio',
              'fellowLoseRatio',
              'deleteClientRatio',
              'deleteStaffRatio',
              'deleteOverRatio'
            ]
            for (const key in item) {
              if (keyArr.includes(key)) {
                item[key] = item[key] + '%'
              }
            }
            return item
          })
          this.table.pagination.total = res.data.total
        })
      } else {
        wastageContactCome(obj).then((res) => {
          callDownLoadByBlob(res, '流失客户信息')
        })
      }
    },
    reset () {
      this.search.tableData = {
        0: { employeeAgencyId: [] },
        1: { employeeOutletId: [] },
        2: { employeeInfoId: [] }
      }
      this.table.order = {}
      this.table.pagination.current = 1
      this.table.pagination.pageSize = 10
      this.getTableData()
    },
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.table.pagination.current = current
      this.table.pagination.pageSize = pageSize
      this.table.order = sorter
      this.getTableData()
    },
    getLineData (e = {}) {
      const obj = { ...e }
      if (this.lineChart.tab != 0) {
        obj.tradeStatusStr = '是'
      }
      console.log(obj, obj.loseOccur)
      wastageContactLine(obj).then((res) => {
        // console.log(res)
        this.state.lineChartState = res.data.accumulated.length !== 0 || res.data.contactDelEmp.length !== 0 || res.data.empDelContact.length !== 0 || res.data.extends.length !== 0
        // this.lineChart.options[this.lineChart.tab].xAxis.min = res.data.xData[0]
        // this.lineChart.options[this.lineChart.tab].xAxis.max = res.data.xData[res.data.xData.length - 1]
        // const currentInfo = deepClonev2(res.data)
        // for (let singleKey in currentInfo) {
        //   currentInfo[singleKey].map(item => item.lossTime)
        // }
        this.lineChart.options[this.lineChart.tab].series = this.lineChart.options[this.lineChart.tab].series.map(
          (item, index) => {
            if (item.name === '员工删除客户') {
              item.data = this.commonDataMethod(deepClonev2(res.data.empDelContact))
            } else if (item.name === '客户删除员工') {
              item.data = this.commonDataMethod(deepClonev2(res.data.contactDelEmp))
            } else if (item.name === '离职继承失败') {
              item.data = this.commonDataMethod(deepClonev2(res.data.extends))
            } else if (item.name === '累计流失会员人数') {
              item.data = this.commonDataMethod(deepClonev2(res.data.accumulated))
            }
            // const tempArray = res.data[index].map((yItem, yIndex) => {
            //   const tempInfo = []
            //   tempInfo[0] = res.data.xData[yIndex]
            //   tempInfo[1] = yItem
            //   return tempInfo
            // })
            // item.data = tempArray
            return item
          }
        )
        console.log(this.lineChart.options[this.lineChart.tab], '处理后的echarts数据')
        this.lineChart.options[this.lineChart.tab].yAxis.name = '累计：' + res.data.totalNum + '人'
      })
    },
    commonDataMethod (array) {
      const tempArray = array.map(item => {
        const singleArray = []
        singleArray[0] = item.lossTime
        singleArray[1] = item.num
        return singleArray
      })
      return tempArray
    },
    setSearchData (e) {
      const data = this.search[e]
      if (e == 'lineChartData') {
        this.getLineData(this.getNewSearch(data))
      } else {
        this.getCakeData(e == 'leftChartData' ? 'employee_agency_id' : 'employee_outlet_id', this.getNewSearch(data))
      }
    },
    // 处理搜索参数
    getNewSearch (data) {
      const newSearch = {}
      const searchData = data
      const arrKey = ['loseOccur']
      const idKey = ['employeeAgencyId', 'employeeOutletId', 'employeeInfoId']
      for (const key in searchData) {
        if (arrKey.includes(key) && searchData[key].length > 0) {
          newSearch[key] = searchData[key].map((item) => {
            return item.format('YYYY-MM-DD')
          })
        } else if (idKey.includes(key) && searchData[key].length > 0) {
          if (typeof (searchData[key][0]) !== 'object') {
            newSearch[key] = searchData[key].join(',')
          } else {
            newSearch[key] = searchData[key].map(item => item.value).join(',')
          }
        }
      }
      return newSearch
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.tableTimer)
  }
}
</script>

<style lang="less" scoped>
.lossAnalysis_page {
  width: 100%;
  position: relative;
  .lossAnalysis_header_title {
    position: absolute;
    top: -36px;
    left: 165px;
    font-size: 13px;
    display: flex;
    align-items: center;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #188fff;
    line-height: 24px;
    .icon {
      font-size: 10px;
      margin-left: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      color: #1890ff;
      border: 1px solid #188fff4c;
    }
  }
  .lossAnalysis_lineChart_box {
    width: 100%;
    .lossAnalysis_lineChart_header {
      width: 100%;
      min-width: 800px;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: 16px;
      padding: 16px 48px 48px 16px;
      .lossAnalysis_lineChart_search {
        display: flex;
        align-items: center;
        .title {
          flex-shrink: 0;
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
            background: #1890ff;
          }
        }
        .lineChart_search_box {
          margin-left: auto;
          display: flex;
          flex-wrap: wrap;
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
      .lossAnalysis_lineChart_tabBox {
        width: 100%;
        height: 33px;
        display: flex;
        align-items: center;
        .lineChart_tab {
          height: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          margin-right: 40px;
          font-size: 14px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #868b98;
          line-height: 21px;
          .wire {
            margin-top: 3px;
            width: 50%;
            height: 2px;
            background: #1890ff;
          }
        }
      }
      .lossAnalysis_lineChart {
        width: 100%;
        height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        .no_datlossAnalysis_box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
    }
  }
  .lossAnalysis_sectorChart_box {
    margin-top: 16px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .lossAnalysis_leftChart_box {
      margin-bottom: 16px;
      box-sizing: border-box;
      padding: 16px 20px 14px 16px;
      width: 49%;
      min-width: 700px;
      margin-right: 16px;
      height: 500px;
      flex-shrink: 0;
      background: #ffffff;
      border-radius: 8px;
      .hearder_box {
        display: flex;
        align-items: center;
        .title {
          display: flex;
          align-items: center;
          flex-shrink: 0;
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
            background: #1890ff;
          }

          .icon {
            font-size: 10px;
            margin-left: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            color: #1890ff;
            border: 1px solid #1890ff;
          }
        }

        .input_box {
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
      .leftChart {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .no_datlossAnalysis_box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
    }
    .lossAnalysis_rightChart_box {
      margin-bottom: 16px;
      box-sizing: border-box;
      flex-shrink: 0;
      padding: 16px 20px 14px 16px;
      width: 49%;
      min-width: 700px;
      height: 500px;
      background: #ffffff;
      border-radius: 8px;
      .hearder_box {
        display: flex;
        align-items: center;
        .title {
          display: flex;
          align-items: center;
          flex-shrink: 0;
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
            background: #1890ff;
          }

          .icon {
            font-size: 10px;
            margin-left: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            color: #1890ff;
            border: 1px solid #1890ff;
          }
        }
        .input_box {
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
      .rightChart {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .no_datlossAnalysis_box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
    }
  }
  .lossAnalysis_table_box {
    width: 100%;
    min-height: 710px;
    background: #ffffff;
    border-radius: 8px;
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
    .table_title_box {
      display: flex;
      align-items: center;
      .title {
        font-size: 13px;
        display: flex;
        align-items: center;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #1890ff;
        line-height: 24px;
      }

      .icon {
        font-size: 10px;
        margin-left: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        color: #1890ff;
        border: 1px solid #1890ff;
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
</style>
