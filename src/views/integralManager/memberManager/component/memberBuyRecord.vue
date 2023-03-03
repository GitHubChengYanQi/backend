<template>
  <div id="buy_record_container" ref="buy_record_container" v-if="buyRecordShowStatus">
    <a-modal
      title="消费记录"
      :maskClosable="false"
      :width="1700"
      centered
      :visible="buyRecordShowStatus"
      :footer="null"
      class="buyRecordClass"
      @cancel="closeBuyRecord"
      :dialogStyle="dialogStyle"
      :getContainer="() => $refs['buy_record_container']"
    >
      <a-spin :spinning="modalLoadingStatus">
        <span>只显示最近3个月的消费记录</span>
        <a-table
          :row-key="record => record.id"
          :columns="buyRecordColumns"
          :data-source="buyRecordDataList"
          :pagination="buyRecordPagination"
          :scroll="{ x: 1500 }"
          @change="buyRecordHandleTableChange"
        >
        </a-table>
      </a-spin>
      <!-- <template slot="footer">
        <a-button
          :disabled="modalLoadingStatus"
          @click="closeBuyRecord"
        >取消</a-button>
        <a-button type="primary" :disabled="modalLoadingStatus" @click="closeBuyRecord">确定</a-button>
      </template> -->
    </a-modal>
  </div>
</template>

<script>
import { getMemberBuyRecordData } from '@/api/member'
export default {
  name: 'MemberBuyRecord',
  data () {
    return {
      dialogStyle: {
        left: '10px'
      },
      modalLoadingStatus: false, // 弹框加载中显示状态
      // 消费记录弹框显示状态
      buyRecordShowStatus: false,
      buyRecordDataList: [],
      buyRecordColumns: [
        {
          title: '商品编号',
          dataIndex: 'goodCode',
          align: 'center',
          width: 150
        },
        {
          title: '商品名称',
          dataIndex: 'goodName',
          align: 'center',
          width: 150
        },
        {
          title: '规格',
          dataIndex: 'specifications',
          align: 'center',
          width: 150
        },
        {
          title: '生产厂家',
          dataIndex: 'manufacturing',
          align: 'center',
          width: 150
        },
        {
          title: '数量',
          dataIndex: 'num',
          align: 'center',
          width: 150
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          width: 150
        },
        {
          title: '消费门店',
          dataIndex: 'orgName',
          align: 'center',
          width: 150
        },
        {
          title: '消费时间',
          dataIndex: 'orderDateStr',
          align: 'center',
          width: 150
        }
      ],
      // 消费记录弹框分页信息
      buyRecordPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  components: {
  },
  props: {
    permissionText: {
      type: String,
      default: ''
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    showStatus () {
      this.buyRecordShowStatus = this.showStatus
      if (this.buyRecordShowStatus) {
        this.modalLoadingStatus = true
        this.getDataList()
      }
    }
  },
  created () {
    console.log('组件创建')
  },
  methods: {
    getDataList () {
      const params = {
        id: this.id,
        page: this.buyRecordPagination.current,
        perPage: this.buyRecordPagination.pageSize
      }
      this.modalLoadingStatus = true
      getMemberBuyRecordData(params).then(response => {
        console.log(response, '获取群聊列表')
        this.buyRecordDataList = response.data.list
        this.$set(this.buyRecordPagination, 'total', Number(response.data.page.total))
        this.modalLoadingStatus = false
      }).catch(() => {
        this.modalLoadingStatus = false
      })
    },
    // 消费记录列表分页信息
    buyRecordHandleTableChange ({ current, pageSize }) {
      this.buyRecordPagination.current = current
      this.buyRecordPagination.pageSize = pageSize
      this.getDataList()
    },
    // 关闭消费记录弹框
    closeBuyRecord () {
      this.buyRecordShowStatus = false
      this.buyRecordDataList = []
      this.$emit('update:showStatus', this.buyRecordShowStatus)
    }
  }
}
</script>

  <style lang="less" scoped>
  .filter-input-row {
    display: flex;
    flex-wrap: wrap;
      .item {
        display: flex;
        align-items: center;
        .title {
          flex-shrink: 0;
          text-align: left;
          width: auto;
        }
        .selectLabelBox {
          min-width: 120px;
          max-width: 85%;
          position: relative;
          .selectBtn {
            min-width: 180px;
            min-height: 38px;
            display: flex;
            align-items: center;
            border-radius: 3px;
            border: 1px dashed #8a8a8a;
            position: relative;
            cursor: pointer;
            flex-wrap: wrap;
            .emptyBtn {
              width: 100%;
              text-align: center;
            }

            .label_input_title {
              margin: 4px;
              padding: 0 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 28px;
              color: rgba(0, 0, 0, 0.65);
              font-size: 14px;
              background: #f7f7f7;
              border-radius: 4px;
              border: 1px solid #e9e9e9;
              .delete {
                margin-left: 5px;
                line-height: 20px;
                font-size: 20px;
                transform: rotate(45deg);

                &:hover {
                  color: #0052d9;
                }
              }
            }
          }
        }
      }
      .item:nth-last-child(1) {
        margin-left: auto;
      }
      .ant-btn:nth-last-child(1) {
        margin-left: 4px;
      }
    }
  </style>
