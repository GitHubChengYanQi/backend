<template>
  <div class="lossAnalysis_page">
    <div class="A_header_title">
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
        <div class="A_lineChart_tabBox">
          <span
            class="lineChart_tab"
            @click="setLineChartTab(index)"
            v-for="(item,index) in ['流失人数','流失会员人数']"
            :style="index == lineChart.tab ? {color:'#0CBC8B'}:{}"
            :key="index"
          ><span>{{ item }}</span>
            <div
              class="wire"
              v-if="index == lineChart.tab"
            ></div>
          </span>
        </div>
        <div class="A_lineChart">
          <v-chart
            style="width:100%;height:100%"
            :options="lineChart.options[lineChart.tab]"
            ref="chars"
          ></v-chart>
        </div>
      </div>
    </div>
    <div class="A_sectorChart_box">
      <div class="A_leftChart_box">
        <div class="hearder_box">
          <span class="title"><span>机构对比</span><span class="wire"></span></span>
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
            style="width:100%;height:100%"
            :options="sectorChart.leftChart.options"
          ></v-chart>
        </div>
      </div>
      <div class="A_rightChart_box">
        <div class="hearder_box">
          <span class="title"><span>门店对比</span><span class="wire"></span></span>
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
            style="width:100%;height:100%"
            :options="sectorChart.rightChart.options"
          ></v-chart>
        </div>
      </div>
    </div>
    <div class="A_table_box">
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
          <a-dropdown
            :trigger="['click']"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
          >
            <a-button
              class="button"
              type="primary"
              @click.prevent
            >导出</a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item style="border-bottom:1px solid #ccc;">
                  <div
                    class="down_select"
                    @click="exportsElxe()"
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
      <div class="table_box">
        <a-table
          :row-key="record => record.id"
          :columns="table.columns[table.tab]"
          :data-source="table.tableData"
          :pagination="table.pagination"
          :row-selection="{selectedRowKeys:table.rowSelection,onChange: onSelectChange}"
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
import { wastageContactLine, wastageContactCake } from '@/api/lossAnalysis.js'

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
              key: 'selection_mechanism',
              placeholder: '请选择机构'
            },
            {
              title: '选择时间',
              type: 'date',
              key: 'select_time'
            }
          ],
          1: [
            {
              title: '所属门店',
              type: 'selct_checkbox',
              key: 'select_store',
              placeholder: '请选择门店'
            },
            {
              title: '选择时间',
              type: 'date',
              key: 'select_time'
            }
          ],
          2: [
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
          ]
        },
        tableData: {
          0: { selection_mechanism: [], select_time: [] },
          1: { select_store: [], select_time: [] },
          2: { select_staff: [], select_time: [] }
        }
      },
      lineChart: {
        tab: 0,
        options: [
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
              data: ['员工删除客户', '客户删除员工', '离职继承失败', '累计流失人数']
            },
            grid: {
              left: '6%',
              right: '6%',
              bottom: '8%',
              width: 'auto'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: [],
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
              type: 'category',
              boundaryGap: false,
              data: [],
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
            color: ['#64DDAB', '#C6F6E3', '#E2FFF4', '#B0EDD4'],
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
                data: [
                  {
                    name: '邮件营销',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  },
                  {
                    name: '邮件12',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  },
                  {
                    name: '邮件3',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  },
                  {
                    name: '邮件4',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  },
                  {
                    name: '邮件6',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  }
                ]
              }
            ]
          }
        },
        rightChart: {
          options: {
            center: ['50%', '50%'],
            color: ['#64DDAB', '#C6F6E3', '#E2FFF4', '#B0EDD4'],
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
                data: [
                  {
                    name: '邮件营销',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  },
                  {
                    name: '邮件12',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  },
                  {
                    name: '邮件3',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  },
                  {
                    name: '邮件4',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  },
                  {
                    name: '邮件6',
                    value: '335',
                    label: {
                      color: '#444444',
                      fontSize: 14,
                      formatter: '{b}({d}%)'
                    }
                  }
                ]
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
              dataIndex: 'phone',
              width: 150
            },
            {
              align: 'center',
              title: '员工数量',
              sorter: true,
              dataIndex: 'tag',
              width: 150
            },
            {
              align: 'center',
              title: '总客户数',
              sorter: true,
              dataIndex: 'add_time',
              width: 150
            },
            {
              align: 'center',
              title: '总流失客户数',
              sorter: true,
              dataIndex: 'subsidiary_organ',
              width: 150
            },
            {
              align: 'center',
              title: '总流失率',
              dataIndex: 'subsidiary_stores',
              width: 150
            },
            {
              align: 'center',
              title: '总流失会员数',
              sorter: true,
              dataIndex: 'subsidiary_staff',
              width: 150
            },
            {
              align: 'center',
              title: '流失会员占比',
              dataIndex: 'is_staff',
              width: 150
            },
            {
              align: 'center',
              title: '员工删除客户流失人数',
              sorter: true,
              dataIndex: 'loss_why',
              width: 200
            },
            {
              align: 'center',
              title: '员工删除客户流失占比',
              dataIndex: 'warn_code_name',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失人数',
              sorter: true,
              dataIndex: 'last_time',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失占比',
              dataIndex: 'detect_code_name',
              width: 200
            },
            {
              align: 'center',
              sorter: true,
              title: '离职继承失败流失人数',
              dataIndex: 'integral',
              width: 200
            },
            {
              align: 'center',
              title: '离职继承失败流失占比',
              dataIndex: 'is_open',
              scopedSlots: { customRender: 'is_open' },
              fixed: 'right',
              width: 200
            }
          ],
          1: [
            {
              align: 'center',
              title: '门店名称',
              dataIndex: 'client',
              scopedSlots: { customRender: 'client' },
              width: 150
            },
            {
              align: 'center',
              title: '所属机构',
              dataIndex: 'phone',
              width: 150
            },
            {
              align: 'center',
              title: '员工数量',
              dataIndex: 'tag',
              scopedSlots: { customRender: 'tag' },
              width: 150
            },
            {
              align: 'center',
              sorter: true,
              title: '总客户数',
              dataIndex: 'add_time',
              width: 150
            },
            {
              align: 'center',
              sorter: true,
              title: '总流失客户数',
              dataIndex: 'subsidiary_organ',
              width: 150
            },
            {
              align: 'center',
              title: '总流失率',
              dataIndex: 'subsidiary_stores',
              width: 150
            },
            {
              align: 'center',
              title: '总流失会员数',
              dataIndex: 'subsidiary_staff',
              width: 150
            },
            {
              align: 'center',
              title: '流失会员占比',
              dataIndex: 'is_staff',
              width: 150
            },
            {
              align: 'center',
              sorter: true,
              title: '员工删除客户流失人数',
              dataIndex: 'loss_why',
              width: 200
            },
            {
              align: 'center',
              title: '员工删除客户流失占比',
              dataIndex: 'warn_code_name',
              width: 200
            },
            {
              align: 'center',
              sorter: true,
              title: '客户删除员工流失人数',
              dataIndex: 'last_time',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失占比',
              dataIndex: 'detect_code_name',
              width: 200
            },
            {
              align: 'center',
              sorter: true,
              title: '离职继承失败流失人数',
              dataIndex: 'integral',
              width: 200
            },
            {
              align: 'center',
              title: '离职继承失败流失占比',
              dataIndex: 'is_open',
              scopedSlots: { customRender: 'is_open' },
              fixed: 'right',
              width: 200
            }
          ],
          2: [
            {
              align: 'center',
              title: '员工名称',
              dataIndex: 'client',
              scopedSlots: { customRender: 'client' },
              width: 150
            },
            {
              align: 'center',
              title: '所属门店',
              dataIndex: 'phone',
              width: 150
            },
            {
              align: 'center',
              title: '所属机构',
              dataIndex: 'tag',
              scopedSlots: { customRender: 'tag' },
              width: 150
            },
            {
              align: 'center',
              title: '总客户数',
              dataIndex: 'add_time',
              sorter: true,
              width: 150
            },
            {
              align: 'center',
              title: '总流失客户数',
              sorter: true,
              dataIndex: 'subsidiary_organ',
              width: 150
            },
            {
              align: 'center',
              title: '总流失率',
              dataIndex: 'subsidiary_stores',
              width: 150
            },
            {
              align: 'center',
              title: '总流失会员数',
              dataIndex: 'subsidiary_staff',
              width: 150
            },
            {
              align: 'center',
              title: '流失会员占比',
              dataIndex: 'is_staff',
              width: 150
            },
            {
              align: 'center',
              title: '员工删除客户流失人数',
              sorter: true,
              dataIndex: 'loss_why',
              width: 200
            },
            {
              align: 'center',
              title: '员工删除客户流失占比',
              dataIndex: 'warn_code_name',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失人数',
              sorter: true,
              dataIndex: 'last_time',
              width: 200
            },
            {
              align: 'center',
              title: '客户删除员工流失占比',
              dataIndex: 'detect_code_name',
              width: 200
            },
            {
              align: 'center',
              title: '离职继承失败流失人数',
              dataIndex: 'integral',
              sorter: true,
              width: 200
            },
            {
              align: 'center',
              title: '离职继承失败流失占比',
              dataIndex: 'is_open',
              scopedSlots: { customRender: 'is_open' },
              fixed: 'right',
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
        rowSelection: []
      },
      timer: ''
    }
  },
  created () {
    this.getLineData()
    this.getCakeData('employee_agency_id')
    this.getCakeData('employee_outlet_id')
    this.createdTimer()
  },
  methods: {
    createdTimer () {
      this.timer = setInterval(this.update, 120000)
    },
    update () {
      this.getLineData(this.getNewSearch(this.search.lineChartData))
      this.getCakeData('employee_agency_id', this.getNewSearch(this.search.leftChartData))
      this.getCakeData('employee_outlet_id', this.getNewSearch(this.search.rightChartData))
    },
    setValue (e, key, i) {
      this.search[i][key] = e
      const data = this.search[i]
      if (e == 'lineChart') {
        this.getLineData(this.getNewSearch(data))
      } else {
        this.getCakeData(e == 'leftChartData' ? 'employee_agency_id' : 'employee_outlet_id', this.getNewSearch(data))
      }
    },
    getCakeData (type, e = {}) {
      const obj = {
        cakeType: type,
        ...e
      }
      wastageContactCake(obj).then((res) => {
        console.log(res)
        if (type == 'employee_agency_id') {
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
    },
    exportsElxe (e) {
      console.log(e)
    },
    getSearch () {},
    reset () {},
    onSelectChange (e) {
      this.table.rowSelection = e
    },
    handleTableChange (pagination, filters, sorter, extra) {
      console.log(pagination, filters, sorter, extra)
    },
    getLineData (e = {}) {
      const obj = { ...e }
      if (this.lineChart.tab != 0) {
        obj.tradeStatusStr = '是'
      }
      console.log(obj)
      wastageContactLine(obj).then((res) => {
        console.log(res)
        this.lineChart.options[this.lineChart.tab].xAxis.data = res.data.xData
        this.lineChart.options[this.lineChart.tab].series = this.lineChart.options[this.lineChart.tab].series.map(
          (item, index) => {
            item.data = res.data.yData[index]
            return item
          }
        )
        this.lineChart.options[this.lineChart.tab].yAxis.name = '累计：' + res.data.total + '人'
      })
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
          newSearch[key] = searchData[key].join(',')
        }
      }
      return newSearch
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
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
    display: flex;
    align-items: center;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #03b976;
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
      color: #03b976;
      border: 1px solid #03b976;
    }
  }
  .A_lineChart_box {
    width: 100%;
    .A_lineChart_header {
      width: 100%;
      min-width: 1120px;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: 16px;
      padding: 16px 48px 48px 16px;
      .A_lineChart_search {
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
      .A_lineChart_tabBox {
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
            background: #0cbc8b;
          }
        }
      }
      .A_lineChart {
        width: 100%;
        height: 500px;
      }
    }
  }
  .A_sectorChart_box {
    margin-top: 16px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .A_leftChart_box {
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
            background: #03b976;
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
      }
    }
    .A_rightChart_box {
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
            background: #03b976;
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
      }
    }
  }
  .A_table_box {
    margin-top: 16px;
    width: 100%;
    height: 710px;
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
          background: #03b976;
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
</style>
