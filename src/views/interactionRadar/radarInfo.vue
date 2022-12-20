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
          :style="item.type ? {width:'100%'}:{}"
        >
          <span class="title">{{ item.title }}</span>
          <span
            class="arrData"
            v-if="item.type"
          >
            <span
              v-if="radarInfo.data[item.key].length != 0"
              class="tabs_box"
            >
              <span
                class="tabs"
                v-for="(items,indexs) in radarInfo.data[item.key] "
                :key="indexs"
              >{{ items.name }}</span>
            </span>
            <span v-else>
              无标签
            </span>
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
            v-for="(item,index) in ['客户数据','渠道数据','员工数据']"
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
              <a-select
                :maxTagCount="1"
                allowClear
                mode="multiple"
                placeholder="请选择"
                class="input"
                v-model="search.tableData[table.tab][item.key]"
                v-if="item.type == 'select'"
              >
                <a-select-option
                  v-for="(items,indexs) in selectArr[item.selectKey]"
                  :value="items.id"
                  :key="indexs"
                >{{ items.name }}</a-select-option>
              </a-select>
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
import moment from 'moment'
import {
  scrmRadarVisitorIndex,
  scrmRadarVisitorChart,
  scrmRadarVisitorVisit,
  scrmRadarVisitorDitch,
  scrmRadarVisitorShift,
  scrmRadarVisitorExcel
} from '@/api/setRadar.js'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

export default {
  data () {
    return {
      radarInfo: {
        type: [
          { title: '雷达标题：', key: 'title' },
          { title: '创建人：', key: 'userName' },
          { title: '所属分组：', key: 'unitName' },
          { title: '行为通知：', key: 'officeAction' },
          { title: '创建时间：', key: 'createdAt' },
          { title: '动态通知：', key: 'dynamicInform' },
          { title: '客户标签：', key: 'customersTag', type: 'tabs' }
        ],
        data: {
          title: '',
          userName: '',
          unitName: '',
          officeAction: '',
          createdAt: '',
          dynamicInform: '',
          customersTag: []
        }
      },
      dataOverview: {
        type: [
          {
            title: '发送总次数',
            key: '0',
            hint: '当前雷达在侧边栏被员工发送的总次数（sop/朋友圈以任务完成计算次数）。'
          },
          {
            title: '查看总次数',
            key: '1',
            hint: '当前雷达被客户打开的总次数，不去重。'
          },
          {
            title: '查看总人数',
            key: '2',
            hint: '当前雷达被客户打开的总人数，去重。'
          },
          {
            title: '今日发送总次数',
            key: '3',
            hint: '今日当前雷达在侧边栏被员工发送的总次数（sop/朋友圈以任务完成计算次数）。'
          },
          {
            title: '今日查看总次数',
            key: '4',
            hint: '今日当前雷达被客户打开的总次数，不去重。'
          },
          {
            title: '今日查看总人数',
            key: '5',
            hint: '今日当前雷达被客户打开的总人数，去重。'
          }
        ],
        data: {
          0: '0',
          1: '0',
          2: '0',
          3: '0',
          4: '0',
          5: '0'
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
              data: [],
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
      selectArr: {
        channel: []
      },
      table: {
        tab: 0,
        columns: {
          0: [
            {
              align: 'center',
              title: '客户昵称',
              fixed: 'left',
              dataIndex: 'contactNick',
              width: 150
            },
            {
              align: 'center',
              title: '是否是企业用户',
              dataIndex: 'contactExist',
              width: 150
            },
            {
              align: 'center',
              title: '查看时间',
              dataIndex: 'createdAt',
              width: 150
            },
            {
              align: 'center',
              title: '查看渠道',
              dataIndex: 'viewingChannels',
              width: 150
            },
            {
              align: 'center',
              title: '客户查看次数',
              sorter: true,
              dataIndex: 'viewingNumber',
              width: 150
            },
            {
              align: 'center',
              title: '客户查看时长（分钟）',
              sorter: true,
              dataIndex: 'viewingDuration',
              width: 150
            }
          ],
          1: [
            {
              align: 'center',
              title: '渠道名称',
              fixed: 'left',
              dataIndex: 'ditchName',
              width: 150
            },
            {
              align: 'center',
              title: '本链接查看次数',
              sorter: true,
              dataIndex: 'linkNumber',
              width: 150
            },
            {
              align: 'center',
              title: '本链接查看人数',
              sorter: true,
              dataIndex: 'linkPeopleNumber',
              width: 150
            },
            {
              align: 'center',
              sorter: true,
              title: '渠道总查看次数',
              dataIndex: 'channelNumber',
              width: 150
            },
            {
              align: 'center',
              sorter: true,
              title: '渠道总查看人数',
              dataIndex: 'channelPeopleNumber',
              width: 150
            }
          ],
          2: [
            {
              align: 'center',
              title: '发送员工',
              fixed: 'left',
              dataIndex: 'employeeName',
              width: 150
            },
            {
              align: 'center',
              title: '所属门店',
              dataIndex: 'outletName',
              width: 150
            },
            {
              align: 'center',
              title: '所属机构',
              dataIndex: 'agencyName',
              width: 150
            },
            {
              align: 'center',
              title: '发送本链接次数',
              dataIndex: 'sendLinkNumber',
              sorter: true,
              width: 150
            },
            {
              align: 'center',
              title: '查看本链接人数',
              dataIndex: 'lookLinkNumber',
              width: 150
            },
            {
              align: 'center',
              title: '本链接使用渠道数',
              sorter: true,
              dataIndex: 'linkChannelNumber',
              width: 150
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
        order: {},
        articleId: -1
      },
      search: {
        table: {
          0: [
            {
              title: '点击渠道：',
              type: 'select',
              key: 'channel',
              selectKey: 'channel',
              placeholder: '请选择机构'
            }
          ],
          1: [
            {
              title: '时间筛选：',
              type: 'date',
              key: 'createdAt',
              placeholder: '请选择门店'
            },
            {
              title: '点击渠道：',
              type: 'select',
              selectKey: 'channel',
              key: 'channel',
              placeholder: '请选择门店'
            }
          ],
          2: [
            {
              title: '选择机构：',
              type: 'selct_checkbox',
              key: 'agencyId',
              placeholder: '请选择机构'
            },
            {
              title: '选择门店：',
              type: 'selct_checkbox',
              key: 'outletId',
              placeholder: '请选择门店'
            },
            {
              title: '时间筛选：',
              type: 'date',
              key: 'createdAt',
              placeholder: '请选择门店'
            },
            {
              title: '发送员工：',
              type: 'model',
              key: 'employeeId',
              placeholder: '请选择员工'
            }
          ]
        },
        tableData: {
          0: { channel: [] },
          1: { channel: [], createdAt: [] },
          2: { agencyId: [], outletId: [], createdAt: [], employeeId: [] }
        }
      }
    }
  },
  created () {
    this.getUrl()
  },
  methods: {
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('id')) return
      this.articleId = object.id
      this.getInfo()
      this.setDate(0)
      this.getTableData()
    },
    getInfo () {
      if (this.articleId == -1) return
      const obj = {
        articleId: this.articleId
      }
      scrmRadarVisitorIndex(obj).then((res) => {
        console.log(res, '111111111')
        const obj = {}
        const { data } = res
        this.radarInfo.data = data.data
        this.radarInfo.data.customersTag = data.data.track.linkState
        this.radarInfo.data.officeAction = data.data.track.linkType.includes('0') ? '已开启' : '未开启'
        this.radarInfo.data.dynamicInform = data.data.track.linkType.includes('1') ? '已开启' : '未开启'
        this.selectArr.channel = data.ditch
        data.total.concat(data.today).map((item, index) => {
          obj[index] = item
        })
        this.dataOverview.data = obj
      })
    },
    setSearchData (e, string) {
      console.log(e, string)
      if (this.dataDetails.data.length == 0) return
      this.getChart(string)
      console.log(this.dataDetails.data)
    },
    setDate (e) {
      this.dataDetails.date = e
      console.log(e)
      if (e != 2) {
        const date = [
          e == 0 ? moment().add(-6, 'd').format('YYYY-MM-DD') : moment().subtract(1, 'months').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD')
        ]
        this.getChart(date)
      }
    },
    getChart (createdAt) {
      scrmRadarVisitorChart({ createdAt, articleId: this.articleId }).then((res) => {
        console.log(res)
        this.dataDetails.lineChart.xAxis.data = res.data.xData
        this.dataDetails.lineChart.series = this.dataDetails.lineChart.series.map((item, index) => {
          item.data = res.data.yData[index]
          return item
        })
      })
    },
    getSearch () {
      this.getTableData()
    },
    exportsElxe () {
      const { tab, order } = this.table
      const { tableData } = this.search

      const searchKey = {
        viewingNumber: 'id',
        viewingDuration: 'shift_id',
        linkNumber: 'data$0',
        linkPeopleNumber: 'data$1',
        channelNumber: 'data$2',
        channelPeopleNumber: 'data$3',
        sendLinkNumber: 'id',
        linkChannelNumber: 'ditch_id'
      }

      const obj = {
        articleId: this.articleId,
        attchData: {},
        type: tab
      }
      obj.attchData = {
        order: order.columnKey ? searchKey[order.columnKey] : '',
        queue: order.order ? order.order == 'ascend' : ''
      }
      if (tableData[tab].createdAt && tableData[tab].createdAt.length > 0) {
        obj.attchData.createdAt = tableData[tab].createdAt.map((item) => {
          return moment(item).format('YYYY-MM-DD')
        })
      }
      if (tableData[tab].channel && tableData[tab].channel.length > 0) {
        obj.attchData.ditchId = tableData[tab].channel.join(',')
      }
      if (tab == 2) {
        const setArr = ['agencyId', 'outletId', 'employeeId']
        for (const key in tableData[tab]) {
          if (setArr.includes(key) && tableData[tab][key].length > 0) {
            if (key != 'employeeId') {
              obj.attchData[key] = tableData[tab][key]
                .map((item) => {
                  return item.value
                })
                .join(',')
            } else {
              obj.attchData[key] = tableData[tab][key].join(',')
            }
          }
        }
      }
      obj.attchData = JSON.stringify(obj.attchData)
      console.log(obj)
      const title = ['客户数据', '渠道数据', '员工数据']
      scrmRadarVisitorExcel(obj).then((res) => {
        callDownLoadByBlob(res, title[tab])
      })
    },
    reset () {
      this.search.tableData = {
        0: { channel: [] },
        1: { channel: [], createdAt: [] },
        2: { agencyId: [], outletId: [], createdAt: [], employeeId: [] }
      }
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
    setTableTab (e) {
      this.table.tab = e
      this.search.tableData = {
        0: { channel: [] },
        1: { channel: [], createdAt: [] },
        2: { agencyId: [], outletId: [], createdAt: [], employeeId: [] }
      }
      this.table.pagination.current = 1
      this.table.pagination.pageSize = 10
      this.getTableData()
    },
    getTableData () {
      const { pagination, tab, order } = this.table
      const { tableData } = this.search
      console.log(tableData[tab], '111111111')
      console.log(order)
      const searchKey = {
        viewingNumber: 'id',
        viewingDuration: 'shift_id',
        linkNumber: 'data$0',
        linkPeopleNumber: 'data$1',
        channelNumber: 'data$2',
        channelPeopleNumber: 'data$3',
        sendLinkNumber: 'id',
        linkChannelNumber: 'ditch_id'
      }
      const obj = {
        articleId: this.articleId,
        current: pagination.current,
        size: pagination.pageSize,
        order: order.columnKey ? searchKey[order.columnKey] : '',
        queue: order.order ? order.order == 'ascend' : ''
      }
      if (tableData[tab].createdAt && tableData[tab].createdAt.length > 0) {
        obj.createdAt = tableData[tab].createdAt.map((item) => {
          return moment(item).format('YYYY-MM-DD')
        })
      }
      if (tableData[tab].channel && tableData[tab].channel.length > 0) {
        obj.ditchId = tableData[tab].channel.join(',')
      }
      if (tab == 2) {
        const setArr = ['agencyId', 'outletId', 'employeeId']
        for (const key in tableData[tab]) {
          if (setArr.includes(key) && tableData[tab][key].length > 0) {
            if (key != 'employeeId') {
              obj[key] = tableData[tab][key]
                .map((item) => {
                  return item.value
                })
                .join(',')
            } else {
              obj[key] = tableData[tab][key].join(',')
            }
          }
        }
      }
      console.log(obj)
      const apiArr = [scrmRadarVisitorVisit, scrmRadarVisitorDitch, scrmRadarVisitorShift]
      apiArr[tab](obj).then((res) => {
        const { data } = res
        console.log(res)
        const tableArr = {
          0: ['viewingNumber', 'viewingDuration'],
          1: ['linkNumber', 'linkPeopleNumber', 'channelNumber', 'channelPeopleNumber'],
          2: ['sendLinkNumber', 'lookLinkNumber', 'linkChannelNumber']
        }
        this.table.tableData = data.datas.map((item, index) => {
          item.id = index
          if (tab == 0 && item.ditchList.length > 0) {
            item.viewingChannels = item.ditchList[0].name
          }
          item.data.map((items, indexs) => {
            item[tableArr[tab][indexs]] = items
          })
          return item
        })
        this.table.pagination.total = data.total
      })
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
          white-space: nowrap;
        }
        .arrData {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
        .tabs_box {
          display: flex;
          flex-wrap: wrap;
        }
        .tabs {
          margin: 5px 5px;
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
        flex-wrap: wrap;
        .search_box {
          margin-bottom: 10px;
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
