<template>
  <div class="record_layout">
    <div class="record_layout_box">
      <a-card style="margin-top: 16px;">
        <div class="info_box">
          <div class="title">
            基本信息
          </div>
          <div class="info">
            <div class="info_left">
              <div
                class="infoList_box"
                v-for="(item , index) in infoArr[table]"
                :key="index">
                <div
                  class="creator"
                  v-if="item.type == 'userLabel'">
                  <span class="creator_title">{{ item.title }}</span>
                  <span class="user_box">
                    <svg-icon />
                    <span class="user_name">{{ info[item.key] }}</span>
                  </span>
                </div>
                <div
                  class="members"
                  v-if="item.type == 'labelBox'">
                  <div class="members_title">{{ item.title }}</div>
                  <div class="members_input">
                    <span
                      class="members_box"
                      v-for="(items ,indexs) in info[item.key]"
                      :key="indexs">
                      <svg-icon />
                      <span class="members_name">{{ items }}</span>
                    </span>
                  </div>
                </div>
                <div
                  class="creationTime"
                  v-if="item.type == 'text'">
                  <span class="creationTime_title">{{ item.title }}</span>
                  <span class="creationTime_txt">{{ item.txt || info[item.key] }}</span>
                </div>
                <div
                  class="autoLabel"
                  v-if="item.type == 'label' && info[item.key]">
                  <span class="autoLabel_title">{{ item.title }}</span>
                  <span
                    class="label"
                    v-for="(items ,indexs) in info[item.key]"
                    :key="indexs">{{ items.labelGroupName }}</span>
                </div>
                <div
                  class="ruleSate"
                  v-if="item.type == 'ruleState'">
                  <span class="ruleSate_title">{{ item.title }}</span>
                  <span class="rule">
                    <a-switch :checked="info[item.key] == 1" />
                    <span style="margin-left:8px;">{{ info[item.key] == 1 ? '已开启' : '已关闭' }}</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="info_right">
              <div
                class="rulesSetting_title"
                v-if="info.rules
                ">规则设置：共{{ info.rules
                  .length }}条规则</div>
              <div class="rules_box">
                <div
                  class="rules"
                  v-for="(item ,index) in info.rules"
                  :key="index">
                  <div class="rules_title">
                    规则{{ index + 1 }}
                  </div>
                  <div
                    class="rules_content"
                    v-if="table == 0">为每<span class="aggravate">{{ item.timeUnitName }}</span>触发关键词<span class="aggravate">{{ item.labelRuleCount }}</span>次的客户自动打上<span
                      class="rules_label"
                      v-for="(items ,indexs) in item.labelIdGroup"
                      :key="indexs">{{ items.name }}</span>&nbsp;
                    标签
                  </div>
                  <div
                    class="rules_content"
                    v-if="table == 1">
                    用户加入群聊 <span class="rules_label" v-for="(items,indexs) in item.roomIdGroup" :key="indexs">{{ items.name }}</span>时，打上标签
                    <span
                      class="rules_label"
                      v-for="(group ,groupIndexs) in item.labelIdGroup"
                      :key="groupIndexs + 'labelIdGroup'">{{ group.name }}</span>
                  </div>
                  <div
                    class="rules_content"
                    v-if="table == 2">
                    客户在每 <span class="aggravate">{{ item.timeUnitName }}</span>的<span class="aggravate" v-for="(cycle,cycleIndex) in item.timeCycle" :key="cycleIndex">{{ cycle.name }}</span>{{ '【' + item.startTime + '-' + item.endTime + '】' }} 内添加生效成员时， 将会被自动打上
                    <span
                      class="rules_label"
                      v-for="(items ,indexs) in item.autoLabelGroups"
                      :key="indexs">{{ items.labelGroupName }}</span>&nbsp;
                    标签
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <a-card style="margin-top: 16px;">
        <div class="data_statistics_box">
          <div class="title">
            数据统计
          </div>
          <div class="content">
            <div
              class="data_box"
              v-for="(item ,index) in dataArr"
              :key="index"
              :style="{'border-right':index == 0 ? '1px solid #e9e9e9' :''}">
              <div class="number">{{ info[item.key] }}</div>
              <div class="title_key">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </a-card>
      <!-- <a-card style="margin-top: 16px;">
        <div class="table_box">
          <div
            class="searchBox"
            v-for="(item,index) in searchData[table]"
            :key="index">
            <span class="search_title">{{ item.title }}</span>
            <span
              class="search_input"
              v-if="item.type == 'input'">
              <a-input
                :value="value"
                :placeholder="item.placeholder"
                @search="onSearch"
                style="width:200px; height:36px;"></a-input>
            </span>
            <span
              class="search_input"
              v-if="item.type == 'select'">
              <a-select
                v-model="cardAttr.select"
                :placeholder="item.placeholder"
                style="width:200px; height:36px;">
                <a-select-option
                  v-for="( items , indexs ) in selectChildern[item.childerKey]"
                  :key="indexs">
                  {{ items.label }}
                </a-select-option>
              </a-select>
            </span>
            <span
              class="search_input"
              v-if="item.type == 'date' ">
              <a-range-picker
                v-model="date"
                style="width:220px; height:36px;" />
            </span>
          </div>
          <a-button
            class="query"
            type="primary"
            @click="onSearch">
            查询
          </a-button>
          <a-button
            class="reset"
            @click="()=>{
              this.cardAttr ={} }">重置</a-button>
        </div>
        <div class="table_info">
          <span class="number">共0个客户</span>
          <span class="update">
            <svg-icon :state="1" />更新数据
          </span>
        </div>
        <a-table
          style="marginTop: 20px"
          :row-key="record => record.id"
          :columns="columns[table]"
          :data-source="tableDate"
          :pagination="pagination"
          @change="handleTableChange">
          <div
            slot="operation"
            slot-scope="text, record">
            <template>
              <a-button
                type="link"
                @click="particulars(record)">{{ table == 3 ? '编辑':'详情' }}</a-button>
              <a-button
                type="link"
                @click="remove(record)">删除</a-button>
            </template>
          </div>
        </a-table>
      </a-card> -->
    </div>
  </div>
</template>

<script>
import SvgIcon from './components/SvgIcon.vue'
import { groupAutoLabelDetail, timeAutoLabelDetail } from '@/api/clientFollow.js'
import { departmentEmp } from '@/api/common.js'

export default {
  components: { 'svg-icon': SvgIcon },
  data () {
    return {
      table: 0,
      info: {
      },
      dataArr: [
        { title: '打标签总数', key: 'labeledNum' },
        { title: '今日打标签数', key: 'todayLabeledNum' }
      ],
      value: '',
      cardAttr: {},
      selectChildern: {
        cardType: [
          {
            label: '全部方式',
            value: 0
          },
          {
            label: '群成员直接邀请进群',
            value: 1
          }, {
            label: '群成员通过链接邀请进群',
            value: 2
          },
          {
            label: '通过扫描二维码入群',
            value: 3
          }
        ],
        kefuArr: []
      },
      date: [],
      tableDate: [],
      columns: [
        [
          {
            align: 'left',
            title: '客户',
            dataIndex: 'client'
          },
          {
            align: 'center',
            title: '所属员工',
            dataIndex: 'itsEmployees'
          },
          {
            align: 'center',
            title: '最近触发关键词',
            dataIndex: 'triggeredKeywords',
            scopedSlots: { customRender: 'triggeredKeywords' }
          },
          {
            align: 'center',
            title: '添加标签时间',
            dataIndex: 'labelTime'
          },
          {
            align: 'center',
            title: '添加好友时间',
            dataIndex: 'addFriendsTime'
          },
          {
            align: 'center',
            title: '操作',
            dataIndex: 'operation',
            width: '250px',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        [
          {
            align: 'left',
            title: '客户',
            dataIndex: 'client'
          },
          {
            align: 'center',
            title: '所属员工',
            dataIndex: 'itsEmployees'
          },
          {
            align: 'center',
            title: '用户添加群聊',
            dataIndex: 'triggeredKeywords',
            scopedSlots: { customRender: 'triggeredKeywords' }
          },
          {
            align: 'center',
            title: '入群方式',
            dataIndex: 'labelTime'
          },
          {
            align: 'center',
            title: '加入群聊时间',
            dataIndex: 'addFriendsTime'
          },
          {
            align: 'center',
            title: '操作',
            dataIndex: 'operation',
            width: '250px',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        [
          {
            align: 'left',
            title: '客户',
            dataIndex: 'client'
          },
          {
            align: 'center',
            title: '所属员工',
            dataIndex: 'itsEmployees'
          },
          {
            align: 'center',
            title: '生效规则',
            dataIndex: 'labelTime'
          },
          {
            align: 'center',
            title: '添加好友时间',
            dataIndex: 'addFriendsTime'
          },
          {
            align: 'center',
            title: '操作',
            dataIndex: 'operation',
            width: '250px',
            scopedSlots: { customRender: 'operation' }
          }
        ]
      ], // 下方数据表头
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      searchData: [
        [
          { title: '搜索用户：', key: 'searchUser', type: 'input', placeholder: '请输入要搜索的客户' },
          {
            title: '所属员工：',
            key: 'customerService',
            type: 'select',
            childerKey: 'kefuArr',
            placeholder: '所属员工'
          },
          { title: '添加好友时间：', key: 'addFriendsTime', type: 'date' }
        ],
        [
          { title: '搜索用户：', key: 'searchUser', type: 'input', placeholder: '请输入要搜索的客户' },
          {
            title: '所属员工：',
            key: 'customerService',
            type: 'select',
            childerKey: 'kefuArr',
            placeholder: '所属员工'
          },
          { title: '群聊名称：', key: 'groupNumber', type: 'input', placeholder: '请输入群聊名称' },
          { title: '加入群聊时间：', key: 'addFriendsTime', type: 'date' },
          {
            title: '入群方式：',
            key: 'groupMethod',
            type: 'select',
            childerKey: 'cardType',
            placeholder: '请选择入群方式'
          }
        ],
        [
          { title: '搜索用户：', key: 'searchUser', type: 'input', placeholder: '请输入要搜索的客户' },
          {
            title: '所属员工：',
            key: 'customerService',
            type: 'select',
            childerKey: 'kefuArr',
            placeholder: '所属员工'
          },
          { title: '添加好友时间：', key: 'addFriendsTime', type: 'date' }
        ]
      ], // 搜索选项
      infoArr: [
        [
          { title: '创建人：', key: 'userName', type: 'userLabel' },
          { title: '生效成员：', key: 'employeeIdNameGroup', type: 'labelBox' },
          { title: '创建时间：', key: 'createTime', type: 'text' },
          { title: '自动添加标签：', key: 'addRule', type: 'label' }
        ],
        [
          { title: '规则名称：', key: 'name', type: 'text' },
          { title: '打标签方式：', key: 'type', type: 'text' },
          { title: '创建人：', key: 'createBy', type: 'userLabel' },
          { title: '创建时间：', key: 'createTime', type: 'text' },
          { title: '规则状态：', key: 'status', type: 'ruleState' }
        ],
        [
          { title: '规则名称：', key: 'name', type: 'text' },
          { title: '打标签方式：', key: 'type', type: 'text' },
          { title: '创建人：', key: 'createBy', type: 'userLabel' },
          { title: '生效成员：', key: 'employeeIdNameGroup', type: 'labelBox' },
          { title: '创建时间：', key: 'createTime', type: 'text' },
          { title: '自动添加标签：', key: 'addRule', type: 'label' },
          { title: '规则状态：', key: 'status', type: 'ruleState' }
        ]
      ],
      labelId: ''
    }
  },
  created () {
    this.getUrl()
    // this.getMembers()
  },
  methods: {
    getMembers () {
      departmentEmp().then(res => {
        const arr = []
        res.data[0].children.map((item) => {
          item.children.map((items) => {
            items.value = items.id
            items.label = items.title
            arr.push(items)
          })
        })
        this.selectChildern.kefuArr = arr
      })
    },
    onSearch () {
      console.log('ok')
    },
    getInfo () {
      const data = {
        id: this.labelId
      }
      const apiArr = ['', groupAutoLabelDetail, timeAutoLabelDetail]
      apiArr[this.table](data).then(res => {
        console.log(res)
        this.info = res.data
      })
    },
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.filters = filters
      if (sorter.order) {
        this.screentData.orderBy = sorter.order === 'ascend' ? 'CreatedAtAsc' : ''
        // this.getTableData()
        return
      }
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      //   this.getTableData()
    },
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符串
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return this.$router.push(`${'/clientFollow/autoLabel'}?id=0`)
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('id') || !object.hasOwnProperty('label')) return this.$message.error('参数错误')
      this.table = object.id
      this.labelId = object.label
      this.getInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.record_layout {
  width: 100%;
  .record_layout_box {
    width: 100%;
    display: flex;
    flex-direction: column;

    .info_box {
      box-sizing: border-box;
      width: 100%;
      background: #fff;
      .title {
        font-size: 15px;
        line-height: 21px;
        color: rgba(0, 0, 0, 0.85);
        border-bottom: 1px solid #e9ebf3;
        padding-bottom: 16px;
        margin-bottom: 16px;
        position: relative;
      }
      .info {
        display: flex;
        .info_left {
          flex: 0.4;

          .infoList_box {
            margin-bottom: 10px;
            .creator {
              display: flex;
              align-items: center;
              width: 100%;
              .creator_title {
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
              }
              .user_box {
                padding: 0 14px;
                height: 28px;
                max-width: 200px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                background: #f7f7f7;
                border-radius: 4px;
                border: 1px solid #e9e9e9;
                .user_name {
                  white-space: nowrap;
                  font-size: 14px;
                }
              }
            }
            .members {
              // margin-top: 16px;
              display: flex;
              flex-direction: column;
              .members_title {
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
              }
              .members_input {
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;
                width: 200px;
                min-height: 130px;
                max-height: 300px;
                overflow: auto;
                border: 1px solid #e9e9e9;
                box-sizing: border-box;
                padding: 8px;
                .members_box {
                  height: 28px;
                  font-size: 14px;
                  padding: 0 14px;
                  margin: 0 8px 8px 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #f7f7f7;
                  border-radius: 4px;
                  border: 1px solid #e9e9e9;
                  .members_name {
                    white-space: nowrap;
                  }
                }
              }
            }
            .creationTime {
              // margin-top: 16px;
              display: flex;
              align-items: center;
              color: rgba(0, 0, 0, 0.65);
              font-size: 14px;
            }
            .autoLabel {
              // margin-top: 16px;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              color: rgba(0, 0, 0, 0.65);
              font-size: 14px;
              .autoLabel_title {
                margin-top: 8px;
              }
              .label {
                height: 28px;
                font-size: 14px;
                padding: 0 14px;
                margin: 8px 8px 0 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f7f7f7;
                border-radius: 4px;
                border: 1px solid #e9e9e9;
              }
            }
          }
        }
        .info_right {
          flex: 1.6;
          background-color: #f6f6f6;
          border: 1px solid #e7e7e7;
          min-height: 260px;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
          display: flex;
          flex-direction: column;
          .rulesSetting_title {
            box-sizing: border-box;
            padding: 0 12px;
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
          }
          .rules_box {
            box-sizing: border-box;
            padding-left: 84px;
            width: 100%;
            display: flex;
            flex-direction: column;
            .rules_title {
              padding-left: 8px;
              border-left: 3px solid #8d8d8d;
              margin-bottom: 4px;
              color: #000;
            }
            .rules_content {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              align-content: flex-start;
              color: rgba(0, 0, 0, 0.65);
              margin-bottom: 10px;
              .aggravate {
                margin: 0 5px;
                font-weight: 700;
              }
              .rules_label {
                font-weight: 700;
                height: 28px;
                font-size: 14px;
                padding: 0 14px;
                margin-left: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f7f7f7;
                border-radius: 4px;
                border: 1px solid #e9e9e9;
              }
            }
          }
        }
      }
    }
    .data_statistics_box {
      box-sizing: border-box;
      width: 100%;
      background: #fff;
      .title {
        font-size: 15px;
        line-height: 21px;
        color: rgba(0, 0, 0, 0.85);
        border-bottom: 1px solid #e9ebf3;
        padding-bottom: 16px;
        margin-bottom: 16px;
        position: relative;
      }
      .content {
        width: 500px;
        height: 125px;
        background: #fbfdff;
        border: 1px solid #daedff;
        display: flex;
        align-items: center;

        .data_box {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          .number {
            font-size: 24px;
            font-weight: 500;
            text-align: center;
          }
          .title_key {
            font-size: 13px;
            text-align: center;
          }
        }
      }
    }
    .table_box {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .searchBox {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 20px 20px 0;
        .search_title {
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
        }
      }

      .query {
        margin-left: auto;
      }
      .reset {
        margin-left: 10px;
        &:hover {
          color: #40a9ff;
          border-color: #40a9ff;
        }
      }
    }
    .table_info {
      width: 100%;
      height: 71px;
      display: flex;
      align-items: center;
      .number {
        box-sizing: border-box;
        padding-right: 8px;
        border-right: 1px solid #ccc;
      }
      .update {
        cursor: pointer;
        margin-left: 8px;
      }
    }
  }
}
</style>
