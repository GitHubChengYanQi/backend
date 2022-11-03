<template>
  <div id="userSop_Page_Container" ref="userSop_Page_Container">
    <div class="tagsBar">
      <a-tabs v-model="selectTagIndex" @change="tagChange">
        <a-tab-pane :tab="item.name" v-for="(item, index) in topTags" :key="index"></a-tab-pane>
      </a-tabs>
      <!-- <div
        v-for="(item, index) in topTags"
        :class="index === selectTagIndex ? 'tagItemBox active' : 'tagItemBox'"
        @click="tagChange(index)"
        :key="index"
      >{{ item.name }}</div>-->
    </div>
    <div class="searchLine">
      <div class="seeaerchBox">
        <a-input placeholder="请输入SOP名称" v-model="searchValue" style="width: 290px; height: 35px" />
        <a-button
          type="primary"
          style="width: 54px;height: 34px;margin: 0 10px;"
          @click="getList({current: 1})"
        >查询</a-button>
        <a-button
          style="width: 54px;height: 34px;margin-right: 10px;"
          @click="() => {searchValue = '';getList({current: 1})}"
        >重置</a-button>
        <span class="explan">{{ topTags[selectTagIndex].explan }}</span>
      </div>
      <div class="handlesBox">
        <div
          class="btn"
          @click="$router.push(`/salesManagement/addSop?type=${selectTagIndex}&id=-1`)"
        >创建{{ topTags[selectTagIndex].name }}</div>
      </div>
    </div>
    <a-table
      class="tableBox"
      :row-key="record => record.id"
      :data-source="tableData"
      :columns="tableColumns"
      :pagination="pagination"
      :scroll="{ x: 1500}"
      @change="getList"
    >
      <!-- <div slot="startToEndDate" slot-scope="text, record, index">
        <template>
          <div class="startToEndDate" v-if="[0, 1, 5].includes(+index)">
            <span>{{ record.startDate }}-{{ record.endDate }}</span>
          </div>
        </template>
      </div>-->
      <div slot="isOn" slot-scope="text, record, index">
        <template>
          <div class="isOn">
            <a-switch
              :checked="record.open"
              @change="sopItemChange(record.id, index)"
              checked-children="开"
              un-checked-children="关"
            />
          </div>
        </template>
      </div>
      <div slot="options" slot-scope="text, record">
        <template>
          <div style="display: flex;justify-content: space-around;">
            <a-button
              v-if="[1, 2, 3, 4].includes(selectTagIndex)"
              type="link"
              @click="showItemData(record)"
            >数据</a-button>
            <a-button type="link" @click="editItem(record)">编辑</a-button>
            <a-button type="link" @click="delItem(record.id)">删除</a-button>
          </div>
        </template>
      </div>
    </a-table>
    <a-modal
      class="dataModalContainer"
      :getContainer="() => $refs['userSop_Page_Container']"
      :title="`SOP名称:${selectDataObj.name}`"
      :width="800"
      :visible="dataModalShow"
      :maskClosable="false"
      :footer="null"
      @cancel="closeDataModal"
    >
      <div class="searchBar">
        <a-input-search
          v-model="dataModalSearchVal"
          placeholder="筛选员工"
          style="width: 230px"
          @search="dataModalSearch"
        />
        <a-button @click="$message.warn('暂无数据！')">导出</a-button>
      </div>
      <div class="tableBox">
        <a-table
          :row-key="record => record.id"
          :data-source="modalTableData"
          :columns="modalTableColumns"
          :pagination="toastPagination"
        >
          <div slot="executionPerson" slot-scope="text, record">
            <template>
              <div class="executionPersonBox">
                <img :src="record.face" alt class="face" />
                <span class="name">{{ text }}</span>
              </div>
            </template>
          </div>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { delSopItemReq, sopItemOpenReq, userSopListReq } from '@/api/salesManagement'
import { deepClonev2 } from '@/utils/util'
const topTags = [
  {
    name: '群发助手SOP',
    id: 'General',
    explan: '员工根据任务，通过群发助手一键群发内容给客户'
  },
  {
    name: '群发活动SOP',
    id: 'Activity',
    explan: '向指定的客户，在指定的时间点，发送指定的消息'
  },
  {
    name: '定期提醒SOP',
    id: 'Regular',
    explan: '当客户状态满足设定的条件时，开始定期给客户发送指定的消息'
  },
  {
    name: '新增好友SOP',
    id: 'Friend',
    explan: '对新增好友，定期发送指定的消息'
  },
  {
    name: '生日SOP',
    id: 'Birthday',
    explan: '客户生日时，给客户发送指定的生日祝福'
  },
  {
    name: '群SOP',
    id: 'Cluster',
    explan: '员工根据任务，通过群发助手一键群发内容到客户群'
  }
]
const tableColumns = [
  {
    title: 'SOP名称',
    dataIndex: 'name',
    align: 'center',
    width: 150,
    all: true
  },
  {
    title: '创建人',
    dataIndex: 'userName',
    align: 'center',
    width: 150,
    all: true
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    align: 'center',
    width: 200,
    all: true
  },
  {
    title: '执行字段',
    dataIndex: 'words',
    align: 'center',
    width: 200,
    has: [2]
  },
  {
    title: '起止时间',
    align: 'center',
    dataIndex: 'occur',
    width: 250,
    // scopedSlots: { customRender: 'startToEndDate' },
    has: [0, 1, 5]
  },
  {
    title: '启用',
    dataIndex: 'isOn',
    align: 'center',
    width: 150,
    scopedSlots: { customRender: 'isOn' },
    has: [2, 3, 4]
  },
  {
    title: '应发客户数',
    dataIndex: 'expect',
    align: 'center',
    width: 120,
    has: [1, 2, 3, 4]
  },
  {
    title: '未发客户数',
    dataIndex: 'waited',
    align: 'center',
    width: 120,
    has: [1, 2, 3, 4]
  },
  {
    title: '操作',
    align: 'center',
    width: 200,
    fixed: 'right',
    scopedSlots: { customRender: 'options' },
    all: true
  }
]
export default {
  components: {},
  data () {
    return {
      topTags,
      selectTagIndex: 0,
      searchValue: '',
      tableData: [],
      tableColumns: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `共${range[0]}页/${total}条数据`
      },
      toastPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `共${range[0]}页/${total}条数据`
      },
      dataModalShow: false,
      selectDataObj: {},
      dataModalSearchVal: '',
      modalTableData: [],
      modalTableColumns: [
        {
          title: '执行员工',
          dataIndex: 'executionPerson',
          align: 'center',
          scopedSlots: { customRender: 'executionPerson' }
        },
        {
          title: '应发客户数',
          dataIndex: 'shouldSendNum',
          align: 'center',
          width: 150
        },
        {
          title: '未完成客户数',
          dataIndex: 'unfinishedSendNum',
          align: 'center',
          width: 150
        },
        {
          title: '未开始客户数',
          dataIndex: 'notStartSendNum',
          align: 'center',
          width: 150
        }
      ]
    }
  },
  computed: {},
  watch: {
    selectTagIndex () {
      this.updateTableColunms(this.selectTagIndex)
      this.searchValue = ''
      this.getList({ current: 1 })
    }
  },
  beforeCreate () { },
  created () {
    if (!this.$route.query.type || this.$route.query.type === '0') {
      this.getList({ current: 1 })
    }
    this.selectTagIndex = +this.$route.query.type || 0
    this.updateTableColunms(this.selectTagIndex)
  },
  beforeMount () { },
  mounted () { },
  methods: {
    getList (e = {}) {
      const pageSize = e.pageSize || this.pagination.pageSize
      const current = e.current
      const that = this
      userSopListReq({
        name: this.searchValue,
        size: pageSize,
        current: current,
        type: this.topTags[this.selectTagIndex].id
      }).then(res => {
        that.pagination.total = res.data.total
        that.pagination.current = current
        that.pagination.pageSize = pageSize
        that.tableData = res.data.datas
      }).catch(err => {
        console.log('get sop list err:', err)
      })
    },
    tagChange (index) {
      history.replaceState(null, '', `/salesManagement/userSop?type=${index}`)
    },
    editItem (info) {
      this.$router.push(`/salesManagement/editSop?type=${this.selectTagIndex}&id=${info.id}`)
    },
    delItem (id) {
      const that = this
      this.$confirm({
        title: '删除将无法找回确定要删除吗？',
        cancelText: '取消',
        okText: '删除',
        okType: 'danger',
        closable: true,
        onOk: async () => {
          await delSopItemReq({ id })
          this.getList({ current: that.pagination.current })
          this.$message.success('删除成功')
        },
        class: 'test'
      })
    },
    updateTableColunms (nowTagIdx) {
      this.tableColumns = tableColumns.filter(item => item.all || item.has.includes(nowTagIdx))
    },
    async sopItemChange (id, index) {
      const res = await sopItemOpenReq({ id })
      const nowD = deepClonev2(this.tableData)
      nowD[index].open = res.data.open
      this.tableData = nowD
      console.log(res, 'res')
    },
    showItemData (info) {
      this.dataModalShow = true
      this.selectDataObj = info
    },
    closeDataModal () {
      this.dataModalShow = false
      this.selectDataObj = {}
    },
    dataModalSearch () {
      console.log(this.dataModalSearchVal)
    }
  }
}
</script>
<style lang="less">
#userSop_Page_Container {
  .tableBox {
    background: #fff;
  }
  .dataModalContainer {
    .searchBar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .tableBox {
      .executionPersonBox {
        display: flex;
        align-items: center;
        .face {
          width: 25px;
          height: 25px;
          border-radius: 3px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import './userSop.less';
</style>
