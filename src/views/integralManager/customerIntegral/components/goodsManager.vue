<template>
  <div id="goods_manager_container" ref="goods_manager_container" v-if="goodsManagerShowStatus">
    <a-modal
      title="选择商品"
      :maskClosable="false"
      :width="1000"
      :visible="goodsManagerShowStatus"
      class="goodsManagerClass"
      :zIndex="zIndex"
      @cancel="closeGoodsManager()"
      :dialogStyle="dialogStyle"
      :getContainer="() => $refs['goods_manager_container']"
    >
      <a-spin :spinning="modalLoadingStatus">
        <div class="searchLine">
          <a-input v-model="screenData.name" placeholder="请输入商品名称" class="inputClass"></a-input>
          <a-button
            style="margin-left: 10px"
            type="primary"
            @click="search"
          >查询</a-button>
        </div>
        <a-table
          :row-key="record => record.id"
          :columns="columns"
          :data-source="tableData"
          :pagination="goodsManagerPagination"
          :row-selection="{ type: isRadioStatus ? 'radio' : 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 1500}"
          @change="handleTableChange">
          <div
            slot="effective"
            slot-scope="text, record">
            <template>
              <a-switch
                :checked="record.effective === '1' ? true : false"
                checked-children="开"
                un-checked-children="关"
                :disabled="record.status === '2' || record.saleStatus === '0'"
              />
            </template>
          </div>
        </a-table>
      </a-spin>
      <template slot="footer">
        <a-button
          :disabled="modalLoadingStatus"
          @click="closeGoodsManager()"
        >取消</a-button>
        <a-button type="primary" :disabled="modalLoadingStatus || selectedRowKeys.length === 0" @click="confirmGoodsManager">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { erpGoods } from '@/api/integralManager'
export default {
  name: 'GoodsManager',
  data () {
    return {
      selectRowArray: [],
      screenData: {},
      dialogStyle: {
        left: '130px'
      },
      // 表头
      columns: [
        {
          title: '平台编码',
          dataIndex: 'platformCode',
          sorter: true,
          align: 'center',
          width: 200
        },
        {
          title: 'ERP商品编码',
          dataIndex: 'code',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '通用名',
          dataIndex: 'commonName',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '商品规格',
          dataIndex: 'specifications',
          align: 'center',
          width: 150
        },
        {
          title: '批准文号',
          dataIndex: 'approvalNo',
          align: 'center',
          width: 150
        },
        {
          title: '条形码',
          dataIndex: 'barCode',
          align: 'center',
          width: 150
        },
        {
          title: '毛利率',
          dataIndex: 'margin',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '失效天数',
          dataIndex: 'invalidDyas',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '单品提成',
          dataIndex: 'goodsCommission',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '销售状态',
          dataIndex: 'saleStatusName',
          align: 'center',
          width: 150
        },
        {
          title: '商品状态',
          dataIndex: 'statusName',
          align: 'center',
          width: 150
        },
        {
          title: '更新时间',
          dataIndex: 'createdAt',
          sorter: true,
          align: 'center',
          width: 150
        },
        {
          title: '状态',
          dataIndex: 'effective',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'effective' }
        }
      ],
      // 表格数据载体
      tableData: [],
      selectedRowKeys: [],
      // 选择商品库弹框显示状态
      goodsManagerShowStatus: false,
      // 弹框加载中
      modalLoadingStatus: false,
      // 群聊弹框分页信息
      goodsManagerPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  props: {
    zIndex: {
      type: Number,
      default: 1000
    },
    permissionText: {
      type: String,
      default: ''
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    isRadioStatus: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showStatus () {
      console.log(this.showStatus, 'showStatus')
      this.goodsManagerShowStatus = this.showStatus
      if (this.goodsManagerShowStatus) {
        this.modalLoadingStatus = true
        this.getData()
      }
    }
  },
  created () {
    console.log('created商品库组件')
  },
  mounted () {

  },

  methods: {
    /**
     * 查询
     */
    search () {
      this.goodsManagerPagination.current = 1
      this.screenData.erpOrderNos = ''
      this.getTableData()
    },
    getData () {
      const params = {
        page: this.goodsManagerPagination.current,
        perPage: this.goodsManagerPagination.pageSize,
        ...this.screenData
      }
      erpGoods(params).then((response) => {
        this.modalLoadingStatus = false
        this.tableData = response.data.list
        this.$set(this.goodsManagerPagination, 'total', Number(response.data.page.total))
        if (this.tableData.length === 0) {
          // 列表中没有数据
          if (this.goodsManagerPagination.total !== 0) {
            // 总数据有,但当前页没有
            // 重新将页码换成1
            this.$set(this.goodsManagerPagination, 'current', 1)
            this.getData()
          } else {
            // 是真没有数据
          }
        }
      }).catch(() => {
        this.modalLoadingStatus = false
      })
    },
    handleTableChange ({ current, pageSize }, filters, sorter) {
      // console.log(current, pageSize, sorter, '监听的信息')
      this.selectedRowKeys = []
      let currentTypeText = ''
      if (sorter.order) {
        // 获取点击的是那一列排序
        currentTypeText = sorter.column.dataIndex
        this.$set(this.screenData, 'orderBySortCode', currentTypeText)
        if (sorter.order === 'ascend') {
          // 正序
          this.$set(this.screenData, 'orderBySort', 'asc')
        } else {
          // 逆序
          this.$set(this.screenData, 'orderBySort', 'desc')
        }
      } else {
        // 无需排序
        this.$delete(this.screenData, 'orderBySort')
        this.$delete(this.screenData, 'orderBySortCode')
      }
      this.goodsManagerPagination.current = current
      this.goodsManagerPagination.pageSize = pageSize
      this.getData()
    },
    // 表格选中
    onSelectChange (selectedRowKeys, row) {
      console.log(selectedRowKeys, row, '表格选择监听')
      this.selectedRowKeys = selectedRowKeys
      this.selectRowArray = Object.assign([], row)
    },
    closeGoodsManager () {
      this.goodsManagerShowStatus = false
      this.$emit('update:showStatus', this.goodsManagerShowStatus)
    },
    confirmGoodsManager () {
      this.goodsManagerShowStatus = false
      this.$emit('update:showStatus', this.goodsManagerShowStatus)
      this.$emit('submitConfirm', this.selectRowArray)
      this.selectedRowKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.goodsManagerClass {
  .searchLine {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .inputClass {
      width: 200px;
    }
  }
}
</style>
