<template>
  <div class="work-index">
    <a-card class="mb16">
      <div class="filter-form filter-input-row flex-between">
        <!--        客户昵称-->
        <div class="item">
          <label>客户昵称：</label>
          <div class="input">
            <a-input
              placeholder="请输入要搜索的客户"
              v-model="searchData.contactName"
              @search="retrievalTable"
              :allowClear="true"
            ></a-input>
          </div>
        </div>
        <!--        所属员工-->
        <div class="item">
          <div class="title">所属员工：</div>
          <!--          <label>所属员工：</label>-->
          <!--          <div class="input belongTo" @click="$refs.selectMember.show()">-->
          <!--            <span class="tips" v-if="showEmployee.length==0">请选择员工</span>-->
          <!--            <a-tag v-for="(item,index) in showEmployee" :key="index">{{ item.name }}</a-tag>-->
          <!--          </div>-->
          <selectPersonnel
            v-model="showEmployee"
            class="resign_Container"
            style="width: 100%;"
            @getVal="effectStaff"
            :changeId="true"
            :num="1"/>
        </div>
        <!--        <selectMember ref="selectMember" @change="effectStaff"/>-->
        <!--        添加时间-->
        <div class="item">
          <label>添加时间：</label>
          <div class="input"><a-range-picker @change="retrievalDate" v-model="showTimeSearch"/></div>
        </div>
        <div class="item">
          <a-button type="primary" class="mr16" @click="getTableData(true)">查询</a-button>
          <a-button @click="resetBtn">重置</a-button>
        </div>
      </div>
    </a-card>
    <a-card>
      <div class="flex mb20">
        <div class="info-box">
          <span class="f-blod">共{{ dataTotal }}个待分配客户</span>
        </div>
        <div class="btn-box">
          <!--          <a-button type="primary" ghost @click="allocation" v-permission="'/contactTransfer/workIndex@allocation'">分配客户</a-button>-->
          <SelectPersonnel
            v-model="treeData"
            @getVal="acceptData"
            type="buttonGhost"
            name="分配客户"
            :multiple="false"
            :transferTip="true"
            :fieldNames="{ children: 'children', title: 'title', key: 'wxUserId' }"
            v-permission="'/contactTransfer/workIndex@allocation'" />
          <!--          wxUserId-->
          <a-button type="primary" ghost @click="$router.push('/contactTransfer/workAllotRecord')" v-permission="'/contactTransfer/workIndex@workAllotRecord'">分配记录</a-button>
        </div>
        <!-- <selectStaff ref="choiceStaff" @change="acceptData" />-->
      </div>
      <div class="table">
        <a-table
          :columns="table.col"
          :data-source="table.data"
          :row-selection="{selectedRowKeys: table.rowSelection, onChange: onSelectChange}"
          :pagination="false">
          <div slot="employeeName" slot-scope="text">
            <a-tag><a-icon type="user" />{{ text }}</a-tag>
          </div>
          <div slot="tags" slot-scope="text,row">
            <!--            <a-tag v-for="(item,index) in text" :key="index">{{ item }}</a-tag>-->
            <template>
              <a-popover title="客户标签" v-if="row.tags.length > 0">
                <template slot="content">
                  <div class="labelBox">
                    <a-tag v-for="(item, index) in row.tags" :key="index">{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
            </template>
          </div>
          <div slot="operating" slot-scope="text,record">
            <!-- <a
              @click="$router.push({ path: '/workContact/contactFieldPivot?contactId='+record.contactId+'&employeeId='+ record.employeeId +'&isContact=2'})"
            >客户详情</a> -->
            <a @click="$router.push({ path: '/workContact/contactFieldPivot?id='+record.contactId})">客户详情</a>
          </div>
        </a-table>
        <div style="display: flex;justify-content:flex-end;margin-top: 30px;">
          <a-pagination
            :total="dataTotal"
            :showSizeChanger="true"
            :pageSizeOptions="['10', '20', '30', '50']"
            v-model="searchData.page"
            :defaultPageSize="searchData.perPage"
            @change="changePage"
            @showSizeChange="changePage"/>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { infoApi, allotContactApi } from '@/api/contactTransfer'
import selectMember from '@/components/Select/member'
import selectStaff from '@/components/addlabel/selectStaff'
import SvgIcon from '../clientFollow/components/SvgIcon.vue'

export default {
  components: { selectMember, selectStaff, SvgIcon },
  data () {
    return {
      spread: {
        tag: []
      },
      // 总条数
      dataTotal: 0,
      // 展示员工数据
      showEmployee: [],
      // 展示时间
      showTimeSearch: [],
      searchData: {
        page: 1,
        // 客户昵称
        contactName: '',
        // 起始时间
        addTimeStart: '',
        // 结束时间
        addTimeEnd: '',
        // 员工
        employeeId: '',
        perPage: 10
      },
      // 表格选中的客户
      tableSelectClient: [],
      table: {
        col: [
          {
            key: 'nickName',
            dataIndex: 'nickName',
            title: '客户昵称',
            width: 200
          },
          {
            key: 'employeeName',
            dataIndex: 'employeeName',
            title: '所属员工',
            scopedSlots: { customRender: 'employeeName' }
          },
          {
            key: 'tags',
            dataIndex: 'tags',
            title: '客户标签',
            scopedSlots: { customRender: 'tags' }
          },
          // {
          //   key: 'transferState',
          //   dataIndex: 'transferState',
          //   title: '转接状态'
          // },
          {
            key: 'addTime',
            dataIndex: 'addTime',
            title: '添加时间'
          },
          {
            key: 'lastMsgTime',
            dataIndex: 'lastMsgTime',
            title: '上次对话时间'
          },
          {
            key: 'addWay',
            dataIndex: 'addWay',
            title: '添加渠道'
          },
          {
            key: 'operating',
            dataIndex: 'operating',
            title: '操作',
            scopedSlots: { customRender: 'operating' }
          }
        ],
        data: [],
        rowSelection: [],
        treeData: []
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    setSpread (e, key) {
      if (!this.spread[key].includes(e.keys)) {
        this.spread[key] = [...this.spread[key], e.keys]
      } else {
        this.spread[key] = this.spread[key].filter((item) => {
          return item != e.keys
        })
      }
      this.$forceUpdate()
    },
    //  获取在职转接表格数据
    getTableData (search) {
      if (search) {
        this.searchData.page = 1
      }
      this.table.rowSelection = []
      this.table.data = []
      infoApi(this.searchData).then((res) => {
        this.dataTotal = res.data.page.total
        this.table.data = res.data.list
      })
    },
    // 分页
    changePage (e) {
      this.getTableData()
    },
    // 分配客户
    allocation () {
      if (this.table.rowSelection == '') {
        this.$message.warning('请选择客户')
        return false
      }
      this.$refs.choiceStaff.show(0)
    },
    // 接收子组件传值
    acceptData (e = []) {
      if (!e.length) return
      if (this.tableSelectClient === '' || this.tableSelectClient.length == 0) {
        this.$message.warning('请选择客户')
        return false
      }
      const params = {
        type: 2,
        list: JSON.stringify(this.tableSelectClient),
        takeoverUserId: e[0]
      }
      this.treeData = e
      allotContactApi(params).then((res) => {
        const successNum = res.data.successNum
        const errNum = res.data.errNum
        this.$message.info('已成功分配' + successNum + '位客户，分配失败' + errNum + '位客户')
        this.table.rowSelection = []
        this.getTableData()
      })
    },
    // 获取表格选中值
    onSelectChange (e) {
      this.tableSelectClient = []
      this.table.rowSelection = e
      e.forEach((item) => {
        const askRowData = {
          employeeWxId: '',
          contactWxId: ''
        }
        askRowData.employeeWxId = this.table.data[item].employeeWxId
        askRowData.contactWxId = this.table.data[item].contactWxId
        this.tableSelectClient.push(askRowData)
      })
    },
    // 重置
    resetBtn () {
      this.searchData = {}
      this.showEmployee = []
      this.showTimeSearch = []
      this.searchData.page = 1
      this.searchData.perPage = 10
      this.getTableData()
    },
    // 接收子组件数据
    effectStaff (e) {
      this.showEmployee = e
      const askServiceData = []
      e.forEach((item, index) => {
        askServiceData[index] = item.id
      })
      this.searchData.employeeId = encodeURIComponent(JSON.stringify(e))
      this.searchData.page = 1
      // this.getTableData()
    },
    // 检索日期
    retrievalDate (date, dateString) {
      this.searchData.addTimeStart = dateString[0]
      this.searchData.addTimeEnd = dateString[1]
      this.searchData.page = 1
      // this.getTableData()
    },
    //  搜索客户名称
    retrievalTable () {
      this.searchData.page = 1
      // this.getTableData()
    },
    // 清空搜索框
    emptyNickIpt () {
      if (this.searchData.contactName == '') {
        this.searchData.page = 1
        // this.getTableData()
      }
    }
  }
}
</script>

<style lang="less">
.filter-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .item {
    min-width: 266px;
    padding-right: 33px;
    box-sizing: content-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .input {
      width: 208px;
      padding-left: 12px;
    }
    .belongTo{
      padding-left: 7px;
      border: 1px solid #D9D9D9;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      .tips{
        color: #BFBFBF;
      }
    }
    .ant-select {
      width: 100%;
    }
  }
}

.info-box {
  flex: 1;
}

.btn-box {
  display: flex;
  flex-direction: row;
  .ant-btn {
    margin-right: 10px;
  }
}

.client-info {
  display: flex;
  align-items: center;

  .avatar img {
    width: 36px;
    height: 36px;
    border-radius: 2px;
    margin-right: 6px;
  }

  .info {
    .name {
      font-size: 13px;
    }

    .company {
      font-size: 12px;
      color: #5ec75d;
    }

    .nickname {
      font-size: 12px;
      color: rgba(0, 0, 0, .45);
    }
  }
}
.message-wrapper {
  .message-content {
    margin: 0;
    padding: 0;
    max-height: 540px;
    overflow-y: auto;
    .message-item {
      margin: 20px 0 20px 10px;
      .people-self {
        flex-direction: row-reverse;
        margin-right: 10px
      }
      .people-wrapper {
        display: flex;
        .people-avatar {
          flex: 0 0 50px;
          .img {
            width: 45px;
            height: 45px;
          }
        }
        .people-info {
          margin-left: 10px;
          // flex: 1;
          max-width: 50%;
          .name-wrapper {
            .name {
              margin-right: 20px;
            }
          }
          .self-name-wrapper {
            display: flex;
            flex-direction: row-reverse;
            .name {
              margin-left: 20px;
            }
          }
          .info {
            padding: 15px;
            word-break: break-word;
            background: rgba(0,0,0,.1);
            border-radius: 10px;
          }
          .self-info {
            margin-right: 10px;
            background: #1890ff;
            color: #fff;
            justify-content: flex-end;
          }
          .info-item {
            padding: 10px;
          }
          .white {
            background: none;
            display: flex;
            .img {
              width: 200px
            }
            .video {
              width: 50%
            }
            .little {
              width: 80%;
              border: 1px solid rgba(0,0,0,.3);
              border-radius: 10px;
              color: black;
              display: flex;
              .wrpper {
                width: 60px;
                height:60px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin: 5px;
                background: rgba(0,0,0,0.01);
                border: 1px solid rgba(0,0,0,.3);
              }
              .title-wrapper {
                flex: 1;
                .title,.name,.description {
                  word-break: break-word;
                  margin-bottom: 10px;
                  padding: 5px
                }
                .title {
                  text-align: center;
                }
              }
            }
            .other {
              display: flex;
              align-items: center;
              .file {
                font-size: 40px;
              }
              .file-name {
                color: black;
              }
            }
          }
        }
      }
    }
  }
}
.label_box {
  position: relative;
  box-sizing: border-box;
  padding: 0 10px 0 10px;
  overflow-wrap: break-word;
  .label {
    display: inline-block;
    margin-left: 10px;
    margin-bottom: 5px;
    max-width: 80px;
    padding: 3px 10px;
    margin: 5px;
    white-space: nowrap;
    background-color: #f7f7f7;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 5px;
    height: 28px;
    font-size: 14px;
    background: #f7f7f7;
    border-radius: 4px;
    border: 1px solid #e9e9e9;
  }
  .spread {
    transform: rotate(180deg);
    position: absolute;
    top: 8px;
    right: 0;
    font-size: 14px;
    color: #000;
    cursor: pointer;
  }
  .hidden_div {
    z-index: 1;
    max-height: 130px;
    color: #000000a6;
    position: absolute;
    bottom: -23px;
    right: 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    letter-spacing: 1px;
    line-height: 26px;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #ccc;
    overflow: auto;

    .hidden_span {
      min-width: 117px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 5px 0;
      font-size: 16px;
      letter-spacing: 1px;
      line-height: 26px;
      white-space: nowrap;
      background: #f7f7f7;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
    }
  }
}
.labelBox{
  width:400px;
  span{
    margin-bottom:10px;
  }
}
</style>
