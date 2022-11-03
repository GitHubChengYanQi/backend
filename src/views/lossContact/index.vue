<template>
  <div class="loss-customers">
    <!--    <div class="loss-contact">-->
    <!--      <a-button-->
    <!--        v-permission="'/lossContact/index@choose'"-->
    <!--        @click="$refs.selectEmployee.$show([],200,true)"-->
    <!--      >-->
    <!--        选择部门成员-->
    <!--      </a-button>-->
    <!--    </div>-->
    <a-card class="mb16" v-permission="'/lossContact/index@choose'">
      <div class="filter-form filter-input-row flex-between">
        <!--        所属员工-->
        <div class="item">
          <div class="title" style="margin-right: 16px;">选择部门成员:</div>
          <selectPersonnel
            style="width: 100%;"
            ref="selectPersonnel"
            v-permission="'/lossContact/index@choose'"
            name="选择部门成员"
            v-model="employeeIdLists"
            @getVal="peopleChange"
            :num="2"
          />
        </div>
        <div class="item">
          <a-button type="primary" class="mr16" @click="getTableData()">查询</a-button>
        </div>
      </div>
    </a-card>
    <div class="table-wrapper">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :rowKey="record => record.id"
        :pagination="pagination"
        @change="handleTableChange">
        <div slot="detail" slot-scope="text, record">
          <div class="detail-box">
            <img :src="record.avatar"/>
            <span>{{ record.name }}</span>
            <span style="color: #3CD389">@微信</span>
          </div>
        </div>
        <!-- <div slot="tag" slot-scope="text, record">
            <span v-if="record.tag.length !== 0">{{ record.tag.join(',') }}</span>
            <span v-else>--</span>
          </div> -->
        <div slot="tag" slot-scope="text,row">
          <!--            <More :show="row.tag.length >= 3" :height="26">-->
          <!--              <a-tag v-for="(v,i) in row.tag" :key="i" class="tag-box">-->
          <!--                {{ v }}-->
          <!--              </a-tag>-->
          <!--            </More>-->
          <template>
            <a-popover title="标签" v-if="row.tag && row.tag.length > 0">
              <template slot="content">
                <div class="labelBox">
                  <a-tag v-for="(item, index) in row.tag" :key="index">{{ item }}</a-tag>
                </div>
              </template>
              <a-tag type="button">
                查看
              </a-tag>
            </a-popover>
            <span class="nolabel" v-else>无标签</span>
          </template>
        </div>
      </a-table>
    </div>
  </div>

  <!--    <selectEmployee ref="selectEmployee" @change="peopleChange"/>-->
</template>

<script>
import { getLossContactList } from '@/api/lossContact'
import Department from '@/components/department'
import SvgIcon from '../clientFollow/components/SvgIcon.vue'

export default {
  components: {
    Department,
    SvgIcon
  },
  data () {
    return {
      spread: {
        tag: []
      },
      columns: [
        {
          title: '客户信息',
          dataIndex: 'detail',
          align: 'center',
          scopedSlots: { customRender: 'detail' }
        },
        {
          title: '标签',
          dataIndex: 'tag',
          align: 'center',
          scopedSlots: { customRender: 'tag' }
        },
        {
          title: '归属成员',
          dataIndex: 'employeeName',
          align: 'center',
          scopedSlots: { customRender: 'employeeName' }

        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        },
        {
          title: '删除时间',
          dataIndex: 'deletedAt',
          align: 'center'
        }
      ],
      tableData: [],
      choosePeopleShow: false,
      employeeIdList: '',
      employeeIdLists: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      employees: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      if (this.employeeIdLists) {
        this.employeeIdList = this.employeeIdLists.join(',')
      }
      const params = {
        employeeId: this.employeeIdList,
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      getLossContactList(params).then(res => {
        this.tableData = res.data.list
        this.pagination.total = res.data.page.total
      })
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    // 成员选择
    peopleChange (data) {
      // const arr = []
      // data.map(item => {
      //   arr.push(item.id)
      // })
      this.employeeIdList = data.join(',')
      // this.getTableData()
    },
    setSpread (e, key) {
      if (!this.spread[key].includes(e.key)) {
        this.spread[key] = [...this.spread[key], e.key]
      } else {
        this.spread[key] = this.spread[key].filter((item) => {
          return item != e.key
        })
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
.loss-customers {
  .table-wrapper {
    background: #fff;
    margin-top: 20px;
    .detail-box {
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
      }
      span {
        margin-left: 20px;
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
    bottom: 0;
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
.filter-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .item {
    min-width: 266px;
    padding-right: 33px;
    box-sizing: content-box;
    display: -webkit-box;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0;

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
.labelBox{
  width:400px;
  span{
    margin-bottom:10px;
  }
}
</style>
