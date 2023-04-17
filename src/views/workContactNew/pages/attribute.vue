<template>
  <div class="box">
    <div class="card mb16 filter-box">
      <div class="filter-input-row flex-between">
        <div class="item">
          <div class="title">搜索客户：</div>
          <a-input placeholder="请输入要搜索的客户" v-model="filter.form.keyWords"/>
        </div>
        <div class="item">
          <div class="title">所属员工：</div>
          <selectPersonnel style="width: 100%;" v-model="filter.form.employeeId" :changeId="true" :num="1"/>
        </div>
        <div class="item">
          <div class="title">企业标签：</div>
          <SelectTagInput v-model="filter.form.tags" :screentags="true" :changeId="true" ref="SelectTagInput" />
        </div>
      </div>
      <div class="filter-input-row flex-between">
        <div class="item">
          <div class="title">添加时间：</div>
          <a-range-picker v-model="filter.form.time"/>
        </div>
        <div class="item">
          <div class="title">备注：</div>
          <a-input placeholder="请输入要搜索的备注" v-model="filter.form.remark"/>
        </div>
        <div class="item">
          <div class="title">添加渠道：</div>
          <a-select placeholder="请选择添加渠道" v-model="filter.form.addWay" style="width: 295px;">
            <a-select-option v-for="item in customersSourceList" :key="item.addWay">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>

      </div>
      <div class="filter-input-row be-row flex-between">
        <!-- <div class="item">
          <div class="title">性别：</div>
          <a-select placeholder="请选择性别" v-model="filter.form.gender">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option value="1">
              男
            </a-select-option>
            <a-select-option value="2">
              女
            </a-select-option>
          </a-select>
        </div> -->
        <!-- <div class="item">
          <div class="title flex" style="width: 150px;margin-left: -12px;">
            流失状态
            <a-popover class="ml3">
              <template slot="content">
                <div class="tips-content">
                  仅可统计员工授权沛芝堂企微后的流失客户
                </div>
              </template>
              <a-icon type="question-circle"/>
            </a-popover>
            ：
          </div>
          <a-select placeholder="请选择流失状态" v-model="filter.form.lossStatus" style="margin-left: -27px;">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option value="1">
              未流失
            </a-select-option>
            <a-select-option value="2">
              已流失
            </a-select-option>
          </a-select>
        </div> -->
        <div class="item">
        </div>
      </div>
      <div class="filter-input-row be-row flex-between">
        <div class="item btn" style="flex: 1">
          <a-button type="primary" v-permission="'/workContact/index@search'" class="mr16" @click="getData(true)">查询</a-button>
          <a-button @click="resetFilter">重置</a-button>
        </div>
      </div>
    </div>

    <div class="card table-card">
      <div class="flex-between table-header">
        <div class="left flex">
          <div class="total f-blod mr10">
            共{{ total }}个客户
          </div>
          <div class="select">
            已选择{{ table.selects.length }}个客户
          </div>
          <a-divider type="vertical"/>
          <div class="update-btn pointer" @click="updateData">
            <a-icon type="redo"/>
            更新数据
          </div>
        </div>
        <div class="right" style="display: flex">
          <addTag v-model="table.selects" :selectRows="table.selectRows" @change="getData" v-permission="'/workContact/index@addTag'"/>
          <removeTag v-model="table.selects" :selectRows="table.selectRows" @change="getData" v-permission="'/workContact/index@removeTag'"/>
          <!-- <a-button
            v-if="table.data.length > 0"
            :loading="loadingDownLoad"
            type="primary"
            ghost
            class="mr16"
            @click="exportData"
            v-permission="'/workContact/index@exportData'">导出Excel</a-button> -->
        </div>
      </div>
      <!--      <div class="flex-between table-header">-->
      <!--        <span>-->
      <!--          排除重复客户-->
      <!--          <a-popover>-->
      <!--            <template slot="content">-->
      <!--              <p>该数据为去重后的客户数，若客户添加了多个员工只会统计为1个客户</p>-->
      <!--            </template>-->
      <!--            <a-icon type="question-circle" />-->
      <!--          </a-popover>-->
      <!--          ：-->
      <!--          <span v-if="!repeatTotal" @click="exceptRepeat" style="cursor: pointer;color: #1890ff">查看</span>-->
      <!--          <span v-else>{{ repeatTotal }}</span>-->
      <!--        </span>-->
      <!--      </div>-->
      <div class="table-content mt23">
        <a-table
          :columns="table.col"
          :data-source="table.data"
          :row-selection="{ selectedRowKeys: table.selects, onChange: selectChange}"
          :pagination="false"
          :loading="loading"
          :scroll="{ x: 1500 }"
          :rowKey="(record) => record.id"
        >
          <div slot="name" slot-scope="row">
            <div class="user-info flex">
              <div class="avatar mr12">
                <img :src="row.avatar">
              </div>
              <div class="info">
                <div class="nickname f-blod fz13">
                  <a-tooltip>
                    <template slot="title">
                      {{ row.name }}
                    </template>
                    {{ row.name }}
                  </a-tooltip>
                </div>
                <div class="rek fz12">
                  备注：
                  <a-tooltip>
                    <template slot="title">
                      {{ row.remark }}
                    </template>
                    {{ row.remark }}
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div slot="employeeName" slot-scope="row">
            <a-tag class="employee-tag">
              <a-icon type="user" class="mr6"/>
              <span style="max-width: 115px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">{{ row.employeeName }}</span>
            </a-tag>
          </div>
          <div slot="departmentName" slot-scope="row">
            <span v-for="(v,i) in row.departmentName" :key="i">
              {{ v }}
              {{ row.departmentName.length !== i + 1 ? '、' : '' }}
            </span>
          </div>
          <div slot="tag" slot-scope="text,row">
            <!--            <More :show="row.tag.length >= 3" :height="26">-->
            <!--              <a-tag v-for="(v,i) in row.tag" :key="i" class="tag-box">-->
            <!--                {{ v }}-->
            <!--              </a-tag>-->
            <!--            </More>-->
            <template>
              <a-popover title="添加的标签" v-if="row.tag && row.tag.length > 0">
                <template slot="content">
                  <div class="labelBox">
                    <a-tag v-for="(item, index) in row.tag" :key="index">{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span class="nolabel" style="align-items:center;" v-else>无标签</span>
            </template>
          </div>
          <div slot="operation" slot-scope="row">
            <a @click="$router.push(`/workContact/contactFieldPivot?id=${row.contactId}`)" v-permission="'/workContact/index@contactFieldPivot'">详情</a>
            <a style="margin-left: 10px" v-if="row.inBind == 1" @click="addFollowUp(row.contactId)" v-permission="'/workContact/index@addFollowUp'">加入随访</a>
          </div>
        </a-table>

        <div class="flex-end mt16">
          <a-pagination
            show-size-changer
            v-model="table.page.page"
            :total="total"
            :pageSizeOptions="['20','30','50','100']"
            :defaultPageSize="table.page.perPage"
            @showSizeChange="(c,size) => table.page.perPage = size"
          />
        </div>
      </div>

      <ExportExcel ref="ExportExcel" />
      <SelectTag ref="selectTag" @change="selectChange"/>

    </div>
  </div>
</template>

<script>
import { workContactList, synContact, contactDistinctCount } from '@/api/workContact'
import addTag from '@/views/workContactNew/components/addTag'
import TagName from '@/views/workContactNew/components/tagName'
import removeTag from '@/views/workContactNew/components/removeTag'
import { planBindAddBatch } from '@/api/healthManage'
import SvgIcon from '../../clientFollow/components/SvgIcon.vue'
import moment from 'moment'

export default {
  data () {
    return {
      table: {
        col: [
          {
            title: '客户',
            scopedSlots: { customRender: 'name' },
            width: 200,
            fixed: 'left'
          },
          {
            title: '所属员工',
            scopedSlots: { customRender: 'employeeName' },
            width: 120
          },
          {
            title: '员工所属部门',
            scopedSlots: { customRender: 'departmentName' },
            width: 150
          },
          {
            title: '标签',
            scopedSlots: { customRender: 'tag' },
            width: 120
          },
          {
            title: '客户状态',
            dataIndex: 'followUpStatus',
            width: 90
          },
          {
            title: '添加时间',
            dataIndex: 'createTime',
            width: 130
          },
          // {
          //   title: '上次对话时间',
          //   dataIndex: 'lastMessageTime',
          //   width: 130
          // },
          {
            title: '添加渠道',
            dataIndex: 'addWayText',
            width: 100
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'operation' },
            width: 120,
            fixed: 'right'
          }
        ],
        data: [],
        page: {
          page: 1,
          perPage: 20
        },
        selects: [],
        selectRows: {},
        selectKeep: false
      },
      total: 0,
      filter: {
        form: {
          keyWords: '',
          tags: [],
          employeeId: [],
          gender: '',
          time: [],
          remark: '',
          lossStatus: '',
          addWay: []
        }
      },
      loading: false,
      customersSourceList: [
        { chose: true, addWay: 0, name: '其他渠道' },
        { chose: true, addWay: 1, name: '扫码二维码' },
        { chose: true, addWay: 2, name: '搜索手机号' },
        { chose: true, addWay: 3, name: '名片分享' },
        { chose: true, addWay: 4, name: '群聊' },
        { chose: false, addWay: 5, name: '手机通讯录' },
        { chose: false, addWay: 6, name: '微信联系人' },
        { chose: false, addWay: 7, name: '来自微信的添加好友申请' },
        { chose: false, addWay: 8, name: '安装第三方应用时添加的员工人员' },
        { chose: false, addWay: 9, name: '搜索邮箱' },
        { chose: false, addWay: 201, name: '内部成员共享' },
        { chose: false, addWay: 202, name: '管理员/负责人分配' },
        { chose: false, addWay: 1001, name: '渠道活码' },
        { chose: false, addWay: 1002, name: '自动拉群' },
        { chose: false, addWay: 1003, name: '裂变引流' }
      ],
      repeatTotal: '',
      loadingDownLoad: false,
      exportList: []

    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    'table.page': {
      deep: true,
      handler: function () {
        this.selectKeep = true
        this.getData()
      }
    }
  },
  methods: {
    updateData () {
      this.$message.info('更新数据')
      this.repeatTotal = ''
      synContact().then(this.getData)
    },

    selectChange (indexs, rows) {
      this.table.selects = indexs
      const key = this.table.page.page
      this.table.selectRows[key] = rows
    },

    resetFilter () {
      this.filter.form = {
        keyWords: '',
        tags: [],
        employeeId: [],
        gender: '',
        time: [],
        remark: '',
        lossStatus: ''
      }
      this.$refs.SelectTagInput.tagShowData = []
      this.getData()
    },
    exportData () {
      const filter = JSON.parse(JSON.stringify(this.filter.form))
      this.loadingDownLoad = true
      if (filter.time.length) {
        filter.startTime = moment(filter.time[0]).format('YYYY-MM-DD')
        filter.endTime = moment(filter.time[1]).format('YYYY-MM-DD')
      }
      if (filter.tags.tagIds) {
        filter.tags.tagIds = filter.tags.tagIds.map(i => {
          return i.id
        })
      }
      filter.employeeId = filter.employeeId.join(',')
      console.log(this.table.selectRows, this.table.page.page)
      // debugger
      if (this.table.selectRows[this.table.page.page].length !== 0) {
        this.exportList = JSON.parse(JSON.stringify(this.table.selectRows[this.table.page.page]))
        this.excel()
      } else {
        workContactList({
          page: 1,
          perPage: this.total,
          ...filter
        }).then(res => {
          this.exportList = res.data.list
          this.excel()
        })
      }
    },
    getData (search) {
      this.loading = true
      this.repeatTotal = ''
      if (!this.table.selectKeep) {
        this.table.selectRows = {}
        this.table.selects = []
        this.table.selectKeep = false
      }
      if (search) {
        this.table.page.page = 1
      }
      const filter = JSON.parse(JSON.stringify(this.filter.form))

      if (filter.time.length) {
        filter.startTime = moment(filter.time[0]).format('YYYY-MM-DD')
        filter.endTime = moment(filter.time[1]).format('YYYY-MM-DD')
        filter.time = []
      }
      if (filter.tags.tagIds) {
        filter.tags.tagIds = filter.tags.tagIds.map(i => {
          return i.id
        })
      }
      filter.tags = encodeURIComponent(JSON.stringify(filter.tags))
      filter.employeeId = filter.employeeId.join(',')

      workContactList({
        ...this.table.page,
        ...filter
      }).then(res => {
        this.total = res.data.page.total
        this.table.data = res.data.list

        this.loading = false
      })
    },

    exceptRepeat () {
      const filter = JSON.parse(JSON.stringify(this.filter.form))

      if (filter.time.length) {
        filter.startTime = moment(filter.time[0]).format('YYYY-MM-DD')
        filter.endTime = moment(filter.time[1]).format('YYYY-MM-DD')
      }
      if (filter.tags.tagIds) {
        filter.tags.tagIds = filter.tags.tagIds.map(i => {
          return i.id
        })
      }
      filter.employeeId = filter.employeeId.join(',')

      contactDistinctCount({
        ...this.table.page,
        ...filter
      }).then(res => {
        this.repeatTotal = res.data.total + ''
      })
    },

    async excel () {
      const data = {
        tTitle: '客户列表数据导出',
        // tHeader: ['客户', '所属员工', '员工所属部门', '标签', '客户状态', '添加时间', '上次对话时间', '添加渠道'],
        tHeader: ['客户', '所属员工', '员工所属部门', '标签', '客户状态', '添加时间', '添加渠道'],
        filterVal: ['name', 'employeeName', 'departmentName', 'tag', 'followUpStatus', 'createTime', 'addWayText'],
        list: this.exportList.map(i => {
          return {
            name: i.name,
            employeeName: i.employeeName,
            departmentName: String(i.departmentName),
            tag: String(i.tag),
            followUpStatus: i.followUpStatus,
            createTime: i.createTime,
            addWayText: i.addWayText
          }
        })
      }
      await this.$refs.ExportExcel.export2Excel(data.tTitle, data.tHeader, data.filterVal, data.list)
      this.loadingDownLoad = false
      this.$message.success('导出成功')
    },
    addFollowUp (id) {
      const _self = this
      this.$confirm({
        content: '是否将该客户加入随访',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const data = await planBindAddBatch({ workContactIds: [ id ] })
          if (data.code == 200) {
            _self.$message.success('操作成功')
            _self.getData()
          } else {
            _self.$message.error('操作失败')
          }
        }
      })
    }
  },
  components: { addTag, removeTag, SvgIcon, TagName }
}
</script>

<style lang="less" scoped>
.box {
  .filter {
    background: #fff;
  }
}

.table-card {
  min-height: calc(100vh - 433px);
}

.table-content {
  min-height: calc(100vh - 540px);
}

.ant-table-wrapper {
  min-height: calc(100vh - 595px);
}

/deep/ .ant-spin-nested-loading,
/deep/ .ant-spin-spinning,
/deep/ .ant-spin-container,
/deep/ .ant-table,
/deep/ .ant-table-content {
  min-height: calc(100vh - 595px) !important;
}

/deep/ .ant-table-placeholder {
  min-height: calc(100vh - 674px) !important;
}

/deep/ .ant-table-placeholder {
  border-bottom: none;
}

.filter-input-row {
  .item {
    width: 300px;
    margin-bottom: 0;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.filter-box {
  padding-top: 6px;
}

.user-info {
  img {
    max-height: 33px;
    max-width: 33px;
    border-radius: 2px;
  }

  .nickname {
    width: 135px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rek {
    width: 135px;
    color: #bababa;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.filter-box {
  padding-top: 16px;
  padding-bottom: 0;

  .filter-input-row {
    margin-top: 0;
  }

  .item {
    margin-bottom: 16px;
  }
}

.tips-content {
  padding: 12px;
}

/deep/ .ant-table-tbody {
  font-size: 12px;
}

/deep/ .employee-tag {
  background-color: #fff !important;
  border-color: #e9e9e9 !important;
  padding: 0 9px;
  font-size: 12px;
}

/deep/ .tag-box {
  font-size: 12px;
  padding: 0 6px;
  height: 23px;
  margin-bottom: 4px;
}

/deep/ .ant-table-wrapper {
  border: 1px solid #e8e8e8;
}

.labelBox{
  width:400px;
  span{
    margin-bottom:10px;
  }
}
</style>
