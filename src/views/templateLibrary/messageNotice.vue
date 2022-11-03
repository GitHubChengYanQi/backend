<template>
  <div class="warning_rule" id="messageNotice_Page_Container">
    <!-- 搜索 -->
    <div class="search_card">
      <a-card>
        <div class="search_box">
          <div class="search_input_box" v-for="(item,index) in searchInput" :key="index">
            <span class="search_title">{{ item.title }}</span>
            <span class="input_box" v-if="item.type == 'input'">
              <a-input
                :placeholder="item.placeholder"
                v-model="searchData[item.key]"
                :style="item.style"
              ></a-input>
            </span>
            <span class="select_box" v-if="item.type == 'cascader'">
              <a-cascader
                v-model="searchData[item.key]"
                :options="item.select"
                :field-names="{ label: 'name', value: 'code', children: 'child' }"
                placeholder="请选择"
              />
            </span>
          </div>

          <div class="search_button_box">
            <a-button
              type="primary"
              style="width: 54px;height: 34px;margin-right: 10px;"
              @click="handleSearch"
            >查询</a-button>
            <a-button style="width: 54px;height: 34px;margin-right: 10px;" @click="reset">重置</a-button>
          </div>
        </div>
      </a-card>
    </div>
    <!-- 跳转 -->
    <div class="skip_box">
      <div class="skip_button" @click="goPath(0, 'id=-1')">新建模板</div>
    </div>
    <!-- 表格 -->
    <div class="table_box">
      <a-table
        :row-key="record => record.id"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :scroll="{ x: 1500}"
        @change="handleTableChange"
      >
        <div slot="number" slot-scope="text, record, index">
          <template>
            <div>{{ index + 1 }}</div>
          </template>
        </div>
        <div slot="secondClass" slot-scope="text, record">
          <template>
            <div>{{ record.secondClass }}</div>
          </template>
        </div>
        <div slot="enableState" slot-scope="text, record, index">
          <template>
            <div class="on_state">
              <a-switch
                :checked="record.enableState === '1'"
                @click="setRules(record, index)"
                checked-children="开"
                un-checked-children="关"
              />
            </div>
          </template>
        </div>
        <div slot="operation" slot-scope="text, record, index" class="operationBox">
          <template>
            <div class="contentBox" v-if="nitoceInfoIdx === index">
              <div class="title">{{ record.title }}</div>
              <div class="content">{{ record.content }}</div>
            </div>
            <a-button type="link" @click="nitoceInfoIdx = nitoceInfoIdx === index ? -1 : index">查看</a-button>
            <a-button type="link" @click="goPath(0, `id=${record.id}`)">编辑</a-button>
            <a-button type="link" @click="deleteInfo(record.id)">删除</a-button>
          </template>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getDictTree } from '@/api/common'
import { changeNiticeStatusReq, delNoticeReq, getNoticeListReq } from '@/api/templateLibrary'
import { deepClonev2 } from '@/utils/util'
export default {
  data () {
    return {
      // 搜索盒子信息参数
      searchInput: [
        {
          title: '模板名称：',
          type: 'input',
          key: 'tempName',
          placeholder: '请输入模板名称',
          style: 'width: 239px;height: 35px;'
        },
        {
          title: '模板分类：',
          type: 'cascader',
          key: 'temp_classify',
          select: [],
          style: 'width: 172px;height: 40px;'
        }
      ],
      // 搜索参数
      searchData: {
        tempName: '',
        temp_classify: [],
        monitoring_scope: '0',
        sort: ''
      }, // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          scopedSlots: { customRender: 'number' },
          width: 80
        },
        {
          align: 'center',
          title: '模板名称',
          dataIndex: 'name',
          // scopedSlots: { customRender: 'secondClass' },
          width: 120
        },
        {
          align: 'center',
          title: '创建人',
          dataIndex: 'createdBy',
          width: 120
        },
        {
          align: 'center',
          title: '创建时间',
          sorter: true,
          dataIndex: 'createdAt',
          width: 150
        },
        {
          align: 'center',
          title: '更新时间',
          sorter: true,
          dataIndex: 'updatedAt',
          width: 150
        },
        {
          align: 'center',
          title: '模板分类',
          dataIndex: 'secondClass',
          width: 120
        },
        {
          align: 'center',
          title: '模板状态',
          dataIndex: 'enableState',
          scopedSlots: { customRender: 'enableState' },
          width: 100
        },
        {
          align: 'center',
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'operation' }
        }
      ], // 表格数据
      tableData: [], // 页脚
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `共 ${Math.ceil(range[1] / this.pagination.pageSize)}页/${total}条数据 `
      },
      nitoceInfoIdx: -1
    }
  },
  created () {
    this.handleSearch()
    this.getDicts()
  },
  methods: {
    getDicts () {
      const that = this
      getDictTree({ dictType: 'model_classification' }).then(res => {
        const nowD = deepClonev2(that.searchInput)
        nowD[1].select = res.data
        that.searchInput = nowD
      })
    },
    // 搜索
    handleSearch () {
      const [firstClass, secondClass] = this.searchData.temp_classify
      const { sort, tempName } = this.searchData
      const searchParams = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        name: tempName,
        firstClass,
        secondClass,
        sort
      }
      const that = this
      getNoticeListReq(searchParams).then(({ data }) => {
        console.log(data, 'data')
        that.pagination = {
          ...that.pagination,
          current: data.current,
          total: data.total
        }
        that.tableData = data.records
      })
    },
    // 重置
    reset () {
      this.searchData = {
        tempName: '',
        temp_classify: [],
        monitoring_scope: '0',
        orderBy: '',
        sort: ''
      }
      this.handleSearch()
    },
    // 分页
    handleTableChange ({ current, pageSize }, _, sorter) {
      // 顺序
      if (sorter.order) {
        let str = ''
        if (sorter.columnKey === 'createdAt') {
          str = sorter.order == 'ascend' ? 'createdAtAsc' : 'createdAtDesc'
        } else if (sorter.columnKey === 'updatedAt') {
          str = sorter.order == 'ascend' ? 'updatedAtAsc' : 'updatedAtDesc'
        }
        this.searchData.sort = str
        this.handleSearch()
        return
      }
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.handleSearch()
    },
    // 改变状态
    async setRules ({ id, enableState }, index) {
      await changeNiticeStatusReq({ id })
      const nowD = deepClonev2(this.tableData)
      nowD[index].enableState = enableState === '1' ? '0' : '1'
      this.tableData = nowD
      this.$message.success('修改成功！')
    },
    // 跳转
    goPath (e, params) {
      const pathData = ['/templateLibrary/createNotice']
      const target = pathData[e] + (params ? `?${params}` : '')
      this.$router.push(target)
    },
    deleteInfo (id) {
      const that = this
      this.$confirm({
        content: '确认删除吗？',
        onOk () {
          delNoticeReq({ id }).then(() => {
            that.$message.success('删除成功！')
            that.handleSearch()
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
#messageNotice_Page_Container {
  .table_box {
    .ant-table-fixed-right {
      overflow: inherit;
    }
  }
}
</style>
<style lang="less" scoped>
.warning_rule {
  width: 100%;
  // 搜索卡片试图
  .search_card {
    width: 100%;
    .search_box {
      display: flex;
      align-items: center;
      .search_input_box {
        margin-right: 20px;
        flex-shrink: 0;
      }
      .search_button_box {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
  // 跳转
  .skip_box {
    width: 100%;
    padding: 20px 0;
    box-sizing: border-box;
    .skip_button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 130px;
      height: 39px;
      background: inherit;
      background-color: rgba(52, 112, 255, 1);
      border: none;
      border-radius: 5px;
      box-shadow: none;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      color: #ffffff;
      cursor: pointer;

      &:hover {
        background-color: #1890ff;
      }
    }
  }
  .table_box {
    .label_box {
      color: #1890ff;
    }
    .operationBox {
      position: relative;
      .contentBox {
        position: absolute;
        width: 250px;
        height: 180px;
        background: #fff;
        left: -260px;
        top: 0;
        z-index: 100;
        box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0;
        .title {
          margin: 0 auto 5px;
          width: 90%;
          padding: 5px;
          border: 1px solid rgba(0, 0, 0, 0.7);
          height: 30px;
          text-align: left;
        }
        .content {
          margin: 0 auto;
          width: 90%;
          padding: 5px;
          border: 1px solid rgba(0, 0, 0, 0.7);
          height: 120px;
          text-align: left;
          overflow-y: auto;
        }
      }
    }
  }
}
</style>
