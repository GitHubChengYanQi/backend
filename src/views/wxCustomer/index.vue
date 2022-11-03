<template>
  <div>
    <a-card>
      <!--search-->
      <div class="table-page-search-wrapper">
        <a-form>
          <a-row :gutter="16">
            <a-col :lg="6">
              <a-form-item
                label="活动名称："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 14} }">
                <a-input v-model="screenData.name" placeholder="请输入活动名称"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item
                label="活动状态："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 14} }">
                <a-select
                  allowClear
                  placeholder="请选择活动状态"
                  v-model="screenData.activityType">
                  <a-select-option
                    v-for="item in statusDict"
                    :key="item.code">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="6">
              <a-form-item
                label="是否发布："
                :labelCol="{lg: {span: 7} }"
                :wrapperCol="{lg: {span: 14} }">
                <a-select
                  allowClear
                  placeholder="请选择是否发布"
                  v-model="screenData.isPublish">
                  <a-select-option
                    v-for="item in isPublishDict"
                    :key="item.code">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--end search-->

      <!--table-->
      <div class="table-wrapper">
        <div class="table-head">
          <div class="fl">
            <a-button
              type="primary"
              @click="editFn()">创建活动</a-button>
            <a-button
              type="link"
              @click="() => {this.modalVisible = true}">查看获客流程</a-button>
          </div>
          <div class="fr">
            <a-button
              type="primary"
              @click="search">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
            <a-button
              type="primary"
              v-permission="'/wxCustomer/publicAccountsAuthorization'"
              @click="()=>{this.$router.push('/wxCustomer/publicAccountsAuthorization')}">公众号授权</a-button>
          </div>
        </div>
        <a-table
          rowKey="id"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :scroll="{ x: 1500}"
          @change="handleTableChange">
          <div
            slot="isPublish"
            slot-scope="text,record">
            <template>
              <a-switch
                :checked="record.isPublish==='1'?true:false"
                @click="changeFn(record)"
                checked-children="开"
                un-checked-children="关" />
            </template>
          </div>
          <div
            slot="partakeTotal"
            slot-scope="text,record">
            <template>
              <p>{{ record.partakeTotal }}</p>
              <p>今日+({{ record.partakeToday }})</p>
            </template>
          </div>
          <div
            slot="prize"
            slot-scope="record">
            <template>
              <ul>
                <li
                  v-for="(item,index) in record"
                  :key="index">
                  {{ item.prizeLevel }}&nbsp;{{ item.completedNum }}/{{ item.prizeNum }}
                </li>
              </ul>
            </template>
          </div>
          <div
            slot="action"
            class="action"
            slot-scope="text, record">
            <template>
              <a
                :disabled="record.isPublish === '0'"
                v-permission="'/wxCustomer/popularize'"
                @click="toPath(record)">推广</a>
              <a @click="toData(record)">数据</a>
              <a @click="editFn(record)">编辑</a>
              <a
                v-if="record.isPublish === '0'"
                @click="delFn(record)">删除</a>
            </template>
          </div>
        </a-table>
      </div>
      <!--end table-->

      <!--modal-->
      <a-modal
        width="1000px"
        :visible="modalVisible"
        @cancel="reset"
        title="获客流程">
        <div class="box">
          <img src="@/assets/processImg.jpg" />
        </div>
        <template slot="footer">
          <a-button
            @click="reset"
            key="back">关闭</a-button>
        </template>
      </a-modal>
      <!--end modal-->
    </a-card>
  </div>
</template>

<script>
import { getDict } from '@/api/common'
import { activityList, activityPublish, activityDel } from '@/api/wxCustomer'
export default {
  data () {
    return {
      loading: false,
      screenData: {},
      modalVisible: false,
      columns: [
        {
          title: '活动名称',
          dataIndex: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '发布',
          dataIndex: 'isPublish',
          align: 'center',
          width: 80,
          scopedSlots: { customRender: 'isPublish' }
        },
        {
          title: '状态',
          dataIndex: 'activityTypeName',
          width: 100,
          align: 'left'
        },
        {
          title: '总参与人数',
          sorter: true,
          sorterKey: 'orderByPartakeTotal',
          dataIndex: 'partakeTotal',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'partakeTotal' }
        },
        {
          title: '任务奖品情况',
          dataIndex: 'prize',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'prize' }
        },
        {
          title: '开始时间',
          sorter: true,
          sorterKey: 'orderByStartTime',
          dataIndex: 'starTime',
          width: 200,
          align: 'center'
        },
        {
          title: '结束时间',
          sorter: true,
          sorterKey: 'orderByEndTime',
          dataIndex: 'endTime',
          width: 200,
          align: 'center'
        },
        {
          title: '创建时间',
          sorter: true,
          sorterKey: 'orderByCreateBy',
          dataIndex: 'createdAt',
          width: 200,
          align: 'center'
        },
        {
          title: '创建者',
          dataIndex: 'createdBy',
          width: 150,
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      statusDict: [],
      isPublishDict: [],
      sorter: {}
    }
  },
  created () {
    this.initFn()
  },
  methods: {
    /**
     * 初始化
     */
    initFn () {
      this.getTableData()
      getDict({ dictType: 'yes_no' }).then((res) => {
        this.isPublishDict = res.data
      })
      getDict({ dictType: 'activity_type' }).then((res) => {
        this.statusDict = res.data
      })
    },
    /**
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      const params = {
        name: this.screenData.name,
        activityType: this.screenData.activityType,
        isPublish: this.screenData.isPublish,
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      const { order, column } = this.sorter
      if (order === 'ascend') {
        params[column.sorterKey] = 'ASC'
      } else if (order === 'descend') {
        params[column.sorterKey] = 'DESC'
      }
      activityList(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.pagination.total = res.data.page.total
      })
    },
    /**
     * 查询
     */
    search () {
      this.pagination.current = 1
      this.getTableData()
    },
    /**
     * 重置查询
     */
    resetSearch () {
      this.screenData = {}
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.sorter = sorter
      this.getTableData()
    },
    /**
     * 删除最后一页数据分页处理
     */
    isFillList () {
      const totalPage = Math.ceil((this.pagination.total - 1) / this.pagination.pageSize) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
      this.getTableData()
    },
    /**
     * 取消
     */
    reset () {
      this.modalVisible = false
    },
    /**
     * 切换活动状态
     */
    changeFn (item) {
      const _this = this
      if (item.isPublish === '1') {
        this.$confirm({
          title: '提示',
          content: '确定要修改发布状态吗？',
          onOk () {
            const params = {
              id: item.id,
              status: item.isPublish === '1' ? 0 : 1
            }
            activityPublish(params).then((res) => {
              if (res.code === 200) {
                _this.getTableData()
              }
            })
          }
        })
      } else {
        const params = {
          id: item.id,
          status: item.isPublish === '1' ? 0 : 1
        }
        activityPublish(params).then((res) => {
          if (res.code === 200) {
            _this.getTableData()
          }
        })
      }
    },
    /**
     * 编辑
     */
    editFn (item) {
      if (item) {
        this.$router.push({
          path: '/wxCustomer/edit',
          query: {
            id: item.id
          }
        })
      } else {
        this.$router.push({
          path: '/wxCustomer/add'
        })
      }
    },
    /**
     * 数据统计
     * @param {*} e
     */
    toData (e) {
      this.$router.push({
        path: '/wxCustomer/data',
        query: {
          id: e.id
        }
      })
    },
    /**
     * 删除
     * @param {*} e
     */
    delFn (e) {
      const _this = this
      this.$confirm({
        title: '提示',
        content: '确认删除？',
        onOk () {
          activityDel({ id: e.id }).then((res) => {
            _this.isFillList()
          })
        },
        onCancel () {
          console.log('cancel')
        }
      })
    },
    toPath (e) {
      this.$router.push(`/wxCustomer/popularize?id=${e.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.alter {
  width: 80%;
  height: 50px;
  background: #e6f7ff;
  border: 1px solid #c2eaff;
  padding: 0 15px;
  span {
    line-height: 50px;
    margin-left: 10px;
  }
}
.table-wrapper {
  margin-top: 20px;
  .table-head {
    height: 50px;
    & > div {
      width: 50%;
    }
    .fl {
      float: left;
    }
    .fr {
      float: right;
      text-align: right;
      & > * {
        margin-left: 10px;
      }
    }
  }
  .flagTxt {
    span {
      position: relative;
      padding-left: 20px;
      &::before {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        content: '';
        position: absolute;
        left: -5px;
        top: 3px;
        display: block;
      }
    }
    .green {
      background: #42b136;
    }
    .gray {
      background: #aaa;
    }
    .orange {
      background: #f59a23;
    }
  }
}
.box {
  img {
    width: 100%;
    height: auto;
  }
}
.action {
  a {
    margin-right: 5px;
  }
}
</style>
