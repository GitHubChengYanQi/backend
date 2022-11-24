<template>
  <div class="momentsTableItemInfoToast_momentsTable_component-container">
    <a-modal v-model="visible" :footer="null" :width="800" @cancel="handleCancel">
      <div class="topBar">
        <span class="label">任务状态：</span>
        <a-select ref="select" v-model="status" style="width: 350px;" placeholder="状态" @change="getTableList()">
          <a-select-option value="0">全部</a-select-option>
          <a-select-option value="1">未完成</a-select-option>
          <a-select-option value="2">已完成</a-select-option>
        </a-select>
        <a-dropdown class="export">
          <a-button type="primary" v-permission="'/moments/exportEmpExcel#post'">导出</a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <span @click="getTableList('exp_cur')">导出当前</span>
              </a-menu-item>
              <a-menu-item>
                <span @click="getTableList('exp_all')">导出全部</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <div style="display: flex;">
        <a-table
          class="tableBox"
          :columns="tableColunms"
          :data-source="tableData"
          :pagination="pagination"
          @change="handleTableChange">
          <span slot="executionUserTil">
            执行员工（{{ pagination.total }}人）
          </span>
          <span slot="executionUserInfo" slot-scope="text, record" class="executionUserInfo">
            <img :src="record.avatar" alt="" class="face">
            {{ text }}
          </span>
          <span slot="status" slot-scope="text" :class="`statusBox ${text === '已完成' ? 'statusBoxyes' : 'statusBoxno'}`">
            {{ text }}
          </span>
        </a-table>
        <div class="totalSay">
          <p class="line title">总计：</p>
          <p class="line">全部人数 {{ detailObj.total }} 人</p>
          <p class="line">已完成人数 {{ detailObj.doneNum }} 人</p>
          <p class="line">未完成人数 {{ detailObj.unfinishNum }} 人</p>
          <p class="line">完成率：{{ detailObj.completion_rates }}</p>
          <p class="line">员工完成情况：{{ detailObj.emp_comple }}</p>
          <p class="line">发送客户情况：{{ detailObj.contact_comple }}</p>
          <p class="line">客户点赞数：{{ detailObj.like_num }}</p>
          <p class="line">客户评论数：{{ detailObj.comment_num }}</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { momentsListItemExportReq, getMomentsItemListReq } from '@/api/momentsOperation'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
export default {
  name: 'MomentsTableItemInfoToast',
  components: {},
  data () {
    return {
      visible: false,
      status: '0',
      momentId: '',
      tableColunms: [
        {
          width: 150,
          dataIndex: 'name',
          align: 'center',
          slots: { title: 'executionUserTil' },
          scopedSlots: { customRender: 'executionUserInfo' }
        },
        {
          title: '所属门店',
          width: 120,
          align: 'center',
          dataIndex: 'depart_name'
        },
        {
          title: '所属机构',
          width: 120,
          align: 'center',
          dataIndex: 'parent_depart'
        },
        {
          title: '状态',
          width: 120,
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ],
      tableData: [],
      detailObj: {
        total: 0,
        doneNum: 0,
        unfinishNum: 0,
        completion_rates: '0%',
        emp_comple: '0/0',
        contact_comple: '0/0',
        like_num: 0,
        comment_num: 0
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `第 ${Math.ceil(range[1] / this.pagination.pageSize)}页/共${total}条数据 `
      }
    }
  },
  watch: {
    visible (e) {
      if (!e) {
        this.status = '0'
      }
    }
  },
  created () { },
  methods: {
    open (data) {
      // eslint-disable-next-line camelcase
      const { id, completion_rates, emp_comple, contact_comple, like_num, comment_num } = data
      const [doneNum, total] = emp_comple.split('/')
      this.detailObj = {
        completion_rates,
        emp_comple,
        contact_comple,
        like_num,
        comment_num,
        total,
        doneNum,
        unfinishNum: +total - +doneNum

      }
      this.momentId = id
      this.getTableList()
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableList()
    },
    // customHeaderCell (columns, index) {
    //   console.log(columns, index, 'columns, index')
    //   return {
    //     onClick: () => {
    //       console.log('click', columns, index)
    //     }
    //   }
    // },
    async getTableList (expstatus) {
      const { current, pageSize } = this.pagination
      const obj = {
        moment_id: this.momentId,
        status: this.status,
        current,
        size: pageSize
      }
      if (expstatus) {
        obj.expstatus = expstatus
        const data = await momentsListItemExportReq(obj)
        callDownLoadByBlob(data, '朋友圈任务详细列表')
      } else {
        const { data } = await getMomentsItemListReq(obj)
        this.tableData = data.datas
        this.pagination.total = data.total
      }
    }
  }
}
</script>
<style lang='less'>

</style>
<style lang='less' scoped>
.topBar {
  margin: 20px 0;
  display: flex;
  align-items: center;
  position: relative;

  .export {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translate(0, -50%);
    width: 100px;
  }
}

.tableBox {
  width: 70%;
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 5px;
  .executionUserInfo{
    display: flex;
    align-items: center;
    .face{
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
  .statusBoxno{
    color: #FCA24F;
  }
}

.totalSay {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 5px;
  margin-left: 15px;

  .line {
    padding: 15px 10px 0;
    text-align: center;
  }

  .title {
    width: 100%;
    padding: 15px 0;
    background-color: #fafafa;
  }
}
</style>
