<template>
  <div class="box">
    <!-- :row-key="record => record.id" -->
    <a-table
      bordered
      :columns="table.col"
      :data-source="table.data"
      :pagination="false"
      size="middle"
    >
      <div slot="name" slot-scope="row">
        <img src="../../../assets/avatar-room-default.svg" class="mr3" style="width: 40px;">
        {{ row.roomName }}
      </div>
      <div slot="ownerName" slot-scope="row">
        <a-tag class="name-tag">
          <a-icon type="user" class="mr3"/>
          {{ row.ownerName }}
        </a-tag>
      </div>
      <div slot="isJoin" slot-scope="row">
        <div class="is-join">
          {{ map.isJoin[row.isJoin] }}
        </div>
      </div>
      <!--      <div slot="operation" slot-scope="row">-->
      <!--        <a @click="$router.push(`/workRoom/detail?workRoomId=${row.id}`)">详情</a>-->
      <!--      </div>-->
    </a-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      table: {
        col: [
          {
            title: '群名称',
            scopedSlots: { customRender: 'name' }
          },
          {
            title: '群主',
            scopedSlots: { customRender: 'ownerName' }
          },
          // {
          //   title: '群人数',
          //   dataIndex: ''
          // },
          {
            title: '客户入群时间',
            dataIndex: 'joinTime'
          },
          {
            title: '状态',
            scopedSlots: { customRender: 'isJoin' }
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt'
          }
          // {
          //   title: '操作',
          //   scopedSlots: { customRender: 'operation' }
          // }
        ],
        data: []
      },
      map: {
        isJoin: {
          1: '我在群聊',
          0: '我不在群聊'
        }
      }
    }
  },
  methods: {
    setData (data) {
      this.table.data = data
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-thead th {
  background: #fbfbfb !important;
  color: #000000a6;
  font-size: 14px !important;
}

/deep/ .ant-table-bordered .ant-table-thead > tr > th {
  border-right: none;
}

/deep/ .ant-table-bordered .ant-table-tbody > tr > td {
  border-right: none;
}

.name-tag {
  border-color: #e9e9e9;
  font-size: 13px;
  margin-bottom: 5px;
  padding: 2px 10px;
  background: #fff;
}

.is-join {
  width: 90px;
  height: 30px;
  background: #f5faff;
  color: #1890ff;
  border-radius: 2px;
  border: 1px solid #6eb9ff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
