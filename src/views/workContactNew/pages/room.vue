<template>
  <div class="box">
    <div class="card mb16 filter-box">
      <div class="filter-box flex">
        <div class="item flex">
          <div class="title" style="width: 110px;">所属群聊：</div>
          <SelectGroupInput v-model="filter.form.roomId" :changeId="true"/>
        </div>
        <div class="item ml16">
          <a-button type="primary" class="mr16" @click="getData">确定</a-button>
          <a-button @click="resetFilter">重置</a-button>
        </div>
      </div>
    </div>
    <div class="card">
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
            <a-icon type="redo" />
            更新数据
          </div>
        </div>
        <div class="right" style="display: flex">
          <addTag v-model="table.selects" @change="getData"/>
          <removeTag v-model="table.selects" @change="getData"/>
          <a-button
            v-if="table.data.length > 0"
            :loading="loadingDownLoad"
            type="primary"
            ghost
            class="mr16"
            @click="excel">导出Excel</a-button>
        </div>
      </div>
      <div class="table-content mt23">
        <a-table
          :columns="table.col"
          :data-source="table.data"
          :row-selection="{ onChange: selectChange }"
          :pagination="false"
          :loading="loading"
          :scroll="{ x: 1500 }"
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
              {{ row.employeeName }}
            </a-tag>
          </div>
          <div slot="departmentName" slot-scope="row">
            <span v-for="(v,i) in row.departmentName" :key="i">
              {{ v }}
              {{ row.departmentName.length !== i + 1 ? '、' : '' }}
            </span>
          </div>
          <div slot="roomName" slot-scope="row">
            <template>
              <TagName :tag="row.roomName"></TagName>
            </template>
          </div>
          <div slot="tag" slot-scope="row">
            <template>
              <TagName :tag="row.tag"></TagName>
            </template>
          </div>
          <div slot="operation" slot-scope="row">
            <a @click="$router.push(`/workContact/contactFieldPivot?id=${row.id}`)">详情</a>
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
    </div>
    <ExportExcel ref="ExportExcel" />
  </div>
</template>

<script>
import { synContact, workContactList } from '@/api/workContact'
import addTag from '@/views/workContactNew/components/addTag'
import removeTag from '@/views/workContactNew/components/removeTag'
import TagName from '@/views/workContactNew/components/tagName'

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
            title: '所在群聊',
            scopedSlots: { customRender: 'roomName' },
            width: 120
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
            title: '添加时间',
            dataIndex: 'createTime',
            width: 130
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'operation' },
            width: 70,
            fixed: 'right'
          }
        ],
        data: [],
        page: {
          page: 1,
          perPage: 20
        },
        selects: []
      },
      total: 0,
      loading: false,
      filter: {
        form: {
          roomId: []
        }
      },
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
        this.getData()
      }
    }
  },
  methods: {
    updateData () {
      this.$message.info('更新数据')

      synContact().then(this.getData)
    },

    resetFilter () {
      this.filter.form = {
        roomId: []
      }

      this.getData()
    },

    selectChange (indexs, rows) {
      this.table.selects = rows
    },

    exportData () {
      const filter = JSON.parse(JSON.stringify(this.filter.form))
      this.loadingDownLoad = true
      filter.roomId = filter.roomId.join(',')

      workContactList({
        page: 1,
        perPage: this.total,
        ...filter
      }).then(res => {
        this.exportList = res.data.list
        this.excel()
      })
    },

    getData () {
      this.loading = true

      const filter = JSON.parse(JSON.stringify(this.filter.form))

      filter.roomId = filter.roomId.join(',')

      workContactList({
        ...this.table.page,
        ...filter
      }).then(res => {
        this.total = res.data.page.total
        this.table.data = res.data.list

        this.loading = false
      })
    },

    async excel () {
      const data = {
        tTitle: '客户列表数据导出',
        tHeader: ['客户', '所属员工', '员工所属部门', '标签', '客户状态', '添加时间', '上次对话时间', '添加渠道'],
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
    }
  },
  components: { addTag, removeTag, TagName }
}
</script>

<style lang="less" scoped>
.table-card {
  min-height: calc(100vh - 433px);
}

.table-content {
  min-height: calc(100vh - 470px);
}

.ant-table-wrapper {
  min-height: calc(100vh - 525px);
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

.box {
  .filter {
    background: #fff;
  }
}

.filter-input-row {
  .item {
    width: 283px;
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

  .rek {
    color: #bababa;
  }
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
</style>
