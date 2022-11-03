<template>
  <div class="box">
    <div class="mb16">
      <a-button
        type="primary"
        class="mr12"
        v-permission="'/channelCodeNew/index@addCode'"
        @click="
          $router.push({
            path: '/channelCodeNew/store',
            query: { groupId: group.current.groupId, groupName: group.current.name }
          })
        ">新建活码</a-button>
      <a-button v-permission="'/channelCodeNew/index@batchGroup'" type="primary" ghost class="mr12" @click="$refs.batchGroup.$show(table.select)">批量分组</a-button>
    </div>
    <div class="card-box flex">
      <div class="left card">
        <div class="add-group mb8" v-permission="'/channelCodeNew/index@addGroup'" @click="addGroup.show = !addGroup.show">
          <a-icon type="plus-circle" class="mr6" />
          添加分组
        </div>
        <div class="add-input-box" v-if="addGroup.show">
          <a-input placeholder="输入名称后回车" v-model="addGroup.name" @keyup.enter="addGroupClick" />
        </div>
        <div class="groups">
          <div
            :class="{ item: true, 'flex-between': true, active: v.groupId == group.current.groupId }"
            v-for="v in group.list"
            :key="v.id"
            @click="switchGroup(v)"
          >
            <div class="title">
              <a-icon type="folder" />
              {{ v.name }}
            </div>
            <div class="count flex ml6">
              <span>
                {{ v.total }}
              </span>
              <div class="more ml3">
                <a-popover overlayClassName="pop-menu-box">
                  <template slot="content">
                    <div class="pop-menu">
                      <div class="item" v-permission="'/channelCodeNew/index@editName'" @click="$refs.updateGroup.$show(v.groupId, v.name)">修改名称</div>
                      <div class="item" v-permission="'/channelCodeNew/index@deleteGroup'" @click="delGroupClick(v)">删除分组</div>
                    </div>
                  </template>
                  <a-icon type="more" />
                </a-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right card">
        <a-table
          size="middle"
          :columns="table.col"
          :data-source="table.data"
          row-key="channelCodeId"
          :pagination="pagination"
          @change="handleTableChange"
          :loading="table.loading"
          :row-selection="{ selectedRowKeys: table.select, onChange: onSelectChange }"
        >
          <div slot="name" slot-scope="row">
            <div class="name-box f-blod fz13">
              <a-tooltip>
                <template slot="title">
                  {{ row.name }}
                </template>
                {{ row.name }}
              </a-tooltip>
            </div>
          </div>
          <div slot="qrCode" slot-scope="row">
            <img :src="row.qrcodeUrl" style="width: 53px" />
          </div>
          <div slot="tags" slot-scope="row">
            <template>
              <a-popover title="标签" v-if="row.tags.length > 0">
                <template slot="content">
                  <div class="popoverBox">
                    <a-tag v-for="(item, index) in row.tags" :key="index">{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span class="nolabel" v-else>无标签</span>
            </template>
          </div>
          <div slot="drainageEmployee" slot-scope="row">
            <template>
              <a-popover title="使用成员" v-if="row.employees.length > 0">
                <template slot="content">
                  <div class="popoverBox">
                    <a-tag v-for="(item, index) in row.employees" :key="index">{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag type="button">
                  查看
                </a-tag>
              </a-popover>
              <span class="nolabel" v-else>无成员</span>
            </template>
          </div>
          <div slot="operation" class="fz13" slot-scope="row">
            <!-- <a @click="$router.push('/channelCode/statistics?id=' + row.id)">数据统计</a> -->
            <a-divider type="vertical" />
            <a @click="$refs.detail.$show(row)" v-permission="'/channelCodeNew/index@info'">详情</a>
            <a-divider type="vertical" />
            <a @click="downQrCode(row)" v-permission="'/channelCodeNew/index@download'">下载</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link" v-permission="'/channelCodeNew/index@editor'">
                编辑
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-permission="'/channelCodeNew/index@modify'">
                  <a
                    @click="
                      $router.push({
                        path: '/channelCodeNew/store',
                        query: { id: row.channelCodeId, groupId: group.current.groupId, groupName: group.current.name }
                      })
                    ">修改
                  </a>
                </a-menu-item>
                <a-menu-item v-permission="'/channelCodeNew/index@delete'">
                  <a @click="delCodeClick(row)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-table>
      </div>
    </div>

    <batchGroup ref="batchGroup" @change="batchGroupChange" />
    <detail ref="detail" />
    <updateGroup ref="updateGroup" @change="getGroupData(false)" />
  </div>
</template>

<script>
import moment from 'moment'
import { getGroupList, addGroup, getCodeList, delCode, delGroup } from '@/api/channelCodeNew'
import batchGroup from '@/views/channelCodeNew/components/batchGroup'
import detail from '@/views/channelCodeNew/components/detail'
import updateGroup from '@/views/channelCodeNew/components/updateGroup'

export default {
  data () {
    return {
      table: {
        col: [
          {
            title: '名称',
            fixed: 'left',
            width: 100,
            scopedSlots: { customRender: 'name' }
          },
          {
            title: '二维码',
            width: 125,
            scopedSlots: { customRender: 'qrCode' },
            align: 'center'
          },
          {
            title: '扫码次数',
            width: 100,
            dataIndex: 'contactNum'
          },
          {
            title: '添加时间',
            dataIndex: 'createdAt',
            align: 'center',
            sorter: true,
            width: 150,
            customRender: (text) => {
              return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
            }
          },
          {
            title: '使用成员',
            width: 150,
            scopedSlots: { customRender: 'drainageEmployee' }
          },
          {
            title: '标签',
            width: 150,
            scopedSlots: { customRender: 'tags' }
          },
          {
            title: '操作',
            width: 220,
            fixed: 'right',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        data: [],
        select: [],
        loading: true
      },
      addGroup: {
        name: '',
        show: false
      },
      group: {
        list: [],
        current: {
          groupId: '',
          name: ''
        }
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      sort: {}
    }
  },
  mounted () {
    if (this.$route.query.groupId) {
      this.group.current.groupId = this.$route.query.groupId
      this.group.current.name = this.$route.query.groupName
    }
    this.getGroupData()
    window.tabChange = (e) => {
      if (e === 1) this.$router.push('/channelCodeNew/statistics')
    }
  },
  methods: {
    delGroupClick (data) {
      const _this = this

      this.$confirm({
        title: '确定要删除该分组吗？',
        onOk () {
          delGroup({ groupId: data.groupId }).then((res) => {
            _this.$message.success('删除成功')

            _this.getGroupData()
          })
        }
      })
    },

    downQrCode (data) {
      const image = new Image()
      image.src = data.qrcodeUrl

      image.setAttribute('crossOrigin', 'anonymous')

      image.onload = () => {
        const canvasNode = document.createElement('canvas')

        canvasNode.width = image.width
        canvasNode.height = image.height

        const ctx = canvasNode.getContext('2d')

        ctx.drawImage(image, 0, 0, image.width, image.height)

        const url = canvasNode.toDataURL('image/png')

        const aNode = document.createElement('a')

        aNode.href = url
        aNode.download = `门店活码-${data.name}`

        aNode.click()
      }
    },

    batchGroupChange () {
      this.getCodeData()
      this.getGroupData(false)
      this.table.select = []
    },

    delCodeClick (data) {
      const _this = this

      this.$confirm({
        title: `确定要删除(${data.name})吗?`,
        onOk () {
          delCode({
            id: data.channelCodeId
          }).then(() => {
            _this.$message.success('删除成功')

            _this.getGroupData(false)
            _this.getCodeData()
          })
        }
      })
    },

    addGroupClick () {
      this.addGroup.show = false

      addGroup({
        name: [this.addGroup.name]
      }).then((res) => {
        this.$message.success('添加分组成功')

        this.group.current.groupId = res.data[0]
        this.addGroup.name = ''

        this.getGroupData(true)
      })
    },

    switchGroup (data) {
      if (this.group.current.groupId === data.groupId) return false

      this.group.current = data
      this.getCodeData()
    },
    handleTableChange (page, filters, sorter) {
      if (sorter.order) {
        this.sort.orderBy = sorter.field
        if (sorter.order === 'ascend') {
          this.sort.sort = 'asc'
        } else {
          this.sort.sort = 'desc'
        }
      }
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.getCodeData()
    },

    getCodeData () {
      if (this.group.list.length === 0) {
        this.table.loading = false
        return
      }
      this.table.loading = true
      if (this.sort.orderBy) {

      }
      const params = {
        groupId: this.group.current.groupId,
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        orderBy: this.sort.orderBy,
        sort: this.sort.sort
      }
      getCodeList(params).then((res) => {
        this.table.data = res.data.list
        this.pagination.total = res.data.page.total
        this.table.loading = false
      })
    },

    getGroupData (setGroup = true) {
      getGroupList().then((res) => {
        this.group.list = res.data
        if (!this.group.current.groupId) {
          this.group.current = res.data[0]
        }
        if (setGroup) {
          this.getCodeData()
        }
      })
    },
    onSelectChange (e) {
      this.table.select = e
    }
  },
  components: { batchGroup, detail, updateGroup }
}
</script>

<style lang="less" scoped>
.name-box {
  width: 90px;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-box {
  height: calc(100vh - 190px);

  .card {
    box-shadow: 0 1px 3px 0 #0000000d;
    height: 100%;
    padding: 0;
    border-radius: 2px;
  }

  .left {
    width: 220px;
    margin-right: 8px;
    position: relative;
    overflow: hidden;
    .add-input-box{
      background:#fff;
      position: absolute;
      top:50px;
      left:0;
      z-index: 9;
      border-bottom:1px solid #eee;
    }
  }

  .right {
    flex: 1;
    overflow: auto;
  }
}

.add-group {
  height: 50px;
  border-bottom: 1px dashed #eeeff0;
  padding-left: 24px;
  background: #fff;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.add-input-box {
  padding: 10px 16px 16px;
}

.groups {
  height: 90%;
  overflow-x: hidden;
  overflow-y: scroll;
  .item {
    width: 100%;
    cursor: pointer;
    padding: 10px 10px 10px 15px;

    .title {
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .more {
      display: none;
    }

    .count {
      font-size: 13px;
      color: #00000040;
    }

    &:hover {
      background: #effaff;

      .more {
        display: block;
      }
    }
  }

  .active {
    background: #effaff;
    color: #1890ff;
    position: relative;

    &:after {
      content: '';
      display: block;
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #1890ff;
    }
  }
}

/deep/.ant-empty-normal {
  margin: 32% 0 !important;
}

/deep/ .ant-table-thead th {
  background: #fbfbfb !important;
  color: #000000a6;
  font-size: 14px !important;
}

/deep/ .ant-table-tbody > tr > td {
  height: 80px;
}

/deep/ .ant-table-bordered .ant-table-thead > tr > th {
  border-right: none;
}

/deep/ .ant-table-bordered .ant-table-tbody > tr > td {
  border-right: none;
}
</style>
<style lang="less">
.pop-menu-box {
  width: 98px !important;

  .pop-menu {
    .item {
      height: 41px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        background: #1890ff0f;
      }
    }
  }
}

.ant-table-body {
  overflow: auto;
}
.popoverBox{
  padding:10px;
}
</style>
