<template>
  <div class="box">
    <div class="card mb16 filter-box">
      <div class="filter-box flex">
        <div class="item flex">
          <a-button @click="visible= true" type="primary">
            设置筛选条件
          </a-button>
          <span
            @click="()=>{
              filter = {
                condition: 'and',
                rules: [
                  {
                    fieldId: '',
                    queryType: 'null',
                    fieldValue: ''
                  }
                ]
              }
              getData()
            }"
            style="color:#1890ff;margin-left: 15px;cursor: pointer">重置</span>
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
            @click="exportData">导出Excel</a-button>
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
    <a-modal
      title="筛选客户"
      :visible="visible"
      okText="确定"
      cancelText="取消"
      @cancel="visible = !visible"
      @ok="serchOk"
    >
      <div class="custom-option">
        <div class="label">自定义筛选</div>
        <div class="content">
          <div class="top">
            <div class="top-body">
              <div
                class="operator"
                @click="()=>{
                  if(filter.condition == 'and'){
                    filter.condition = 'or'
                  }else{
                    filter.condition = 'and'
                  }
                }">
                <span>{{ filter.condition == 'and' ? '且' : '或' }}</span>
              </div>
              <div class="condition">
                <div
                  class="data"
                  v-for="(item, index) in filter.rules"
                  :key="index">
                  <div style="flex: .99">
                    <a-select
                      style="width: 215px;"
                      placeholder="请选择自定义字段"
                      @change="(e)=>{
                        filter.rules[index].fieldId = e
                      }">
                      <a-select-option v-for="(i, vindex) in conditionData.customField" :key="vindex" :value="i.id">
                        {{ i.label }}
                      </a-select-option>
                    </a-select>

                    <a-select
                      style="width: 100px;    margin-left: 12px;
    margin-right: 12px;"
                      :defaultValue="item.queryType"
                      @change="(e)=>{
                        filter.rules[index].queryType = e
                      }"
                    >
                      <a-select-option v-for="(i, sindex) in conditionData.fieldCondition" :key="sindex" :value="i.queryType">
                        {{ i.name }}
                      </a-select-option>
                    </a-select>

                    <a-input v-if="item.queryType != 'null' && item.queryType != 'notNull'" style="width: 215px" v-model="item.fieldValue" placeholder="请输入" />
                  </div>

                  <a-icon v-if="filter.rules.length > 1" @click="filter.rules.splice(index, 1)" style="color: rgba(0,0,0,.65)" type="minus-circle" />
                </div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <span @click="addConditionData">
              <a-icon type="plus-circle" />
              添加筛选条件
            </span>
            <span>最多可设置10个筛选条件</span>
          </div>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script>
import { synContact, workContactList, contactField } from '@/api/workContact'
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
      loadingDownLoad: false,
      visible: false,
      conditionData: {
        customField: [],
        fieldCondition: [
          {
            name: '为空',
            queryType: 'null'
          },
          {
            name: '不为空',
            queryType: 'notNull'
          },
          {
            name: '等于',
            queryType: 'equal'
          },
          {
            name: '不等于',
            queryType: 'notEqual'
          },
          {
            name: '包含',
            queryType: 'like'
          },
          {
            name: '不包含',
            queryType: 'notLike'
          }
        ],
        value: ''
      },
      filter: {
        condition: 'and',
        rules: [
          {
            fieldId: '',
            queryType: 'null',
            fieldValue: ''
          }
        ]
      },
      exportList: []
    }
  },
  mounted () {
    this.getData()
    this.customFieldList()
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
      this.loadingDownLoad = true
      const fieldList = encodeURIComponent(JSON.stringify({
        ...this.filter
      }))
      workContactList({
        page: 1,
        perPage: this.total,
        fieldList: fieldList
      }).then(res => {
        this.exportList = res.data.list
        this.excel()
      })
    },

    getData () {
      this.loading = true
      const fieldList = encodeURIComponent(JSON.stringify({
        ...this.filter
      }))
      workContactList({
        ...this.table.page,
        fieldList: fieldList
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
    },

    customScreen () {
    },

    addConditionData () {
      this.filter.rules.push({
        fieldId: '',
        queryType: 'null',
        fieldValue: ''
      })
    },

    customFieldList () {
      contactField({ status: 1, page: 1, perPage: 1000 }).then(res => {
        this.conditionData.customField = res.data.list
      })
    },
    serchOk () {
      var isReturn = false
      this.filter.rules.forEach((i, v) => {
        if (!i.fieldId) {
          isReturn = true
          this.$message.warning(`第${v + 1}条筛选条件未选择自定义字段`)
        } else if (i.queryType != 'null' && i.queryType != 'notNull' && !i.fieldValue) {
          isReturn = true
          this.$message.warning(`第${v + 1}条筛选条件填写筛选值`)
        }
      })
      if (isReturn) {
        return
      }
      this.getData()
      this.visible = false
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

.custom-option{
  .label{
    position: relative;
    padding-left: 11px;
    font-size: 14px;
    color: rgba(0,0,0,.85);
    &:before{
      position: absolute;
      width: 3px;
      height: 12px;
      background: #1990ff;
      top: 4px;
      left: 0;
      content: "";
      z-index: 1;
    }
  }
  .content{
    margin-top: 7px;
    background: #fbfbfb;
    border-radius: 2px;
    border: 1px solid #eee;
    min-height: 219px;
    align-items: center;
    display: -webkit-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0;
    .top{
      width: 100%;
      max-height: 400px;
      overflow: auto;
      scroll-behavior: smooth;
      flex: 1;
      .top-body{
        height: 100%;
        &:before{
          position: absolute;
          height: calc(100% - 24px);
          width: 1px;
          background: #e0f0ff;
          left: 19px;
          top: 12px;
          content: "";
        }
        padding: 12px;
        position: relative;
        align-items: center;
        display: flex;
        justify-content: flex-start;
        .operator{
          width: 19px;
          margin-right: 8px;
          position: relative;
          height: 100%;
          cursor: pointer;
          -webkit-user-select: none;
          span{
            background: #e6f3ff;
            border-radius: 2px;
            border: 1px solid #bbdeff;
            display: inline-block;
            width: 19px;
            height: 19px;
            z-index: 2;
            transform: translateZ(10px);
            color: #1890ff;
            font-width: 600;
            line-height: 18px;
            text-align: center;
            padding-left: 1px;
          }
        }
        .condition{
          flex: 1;
          .data{
            display: flex;
            align-items: center;
            width: 100%;
            margin-bottom: 12px;
          }
        }
      }
    }
    .bottom{
      height: 36px;
      border-top: 1px dashed #eee;
      padding-left: 16px;
      width: 100%;
      display: flex;
      align-items: center;
      span:nth-child(1){
        font-size: 14px;
        color: #1890ff;
      }
      span:nth-child(2){
        margin-left: 8px;
        font-size: 13px;
        color: rgba(0, 0, 0, .45);
      }
    }
  }
}
/deep/.ant-modal-content{
  width: 696px;
}

</style>
