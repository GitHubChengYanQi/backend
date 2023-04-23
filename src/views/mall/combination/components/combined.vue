<template>
  <div>
    <!--search-->
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row :gutter="16">
          <a-col :lg="8" :md="6">
            <a-form-item
              label="联合用药名称："
              :labelCol="{lg: {span: 7} }"
              :wrapperCol="{lg: {span: 17} }">
              <a-input v-model="screenData.name" placeholder="请输入联合用药名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="6">
            <a-form-item
              label="有无辅药："
              :labelCol="{lg: {span: 7} }"
              :wrapperCol="{lg: {span: 17} }">
              <a-select placeholder="请选择" v-model="screenData.haveAdjuvants">
                <a-select-option v-for="item in haveNoOption" :key="item.code" :value="item.code">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="6">
            <a-form-item
              label="主药名称："
              :labelCol="{lg: {span: 7} }"
              :wrapperCol="{lg: {span: 17} }">
              <a-input v-model="screenData.mainDrug" placeholder="请输入主药名称" />
            </a-form-item>
          </a-col>
          <a-col :lg="20" :md="6">
            <a-form-item
              label="疾病分类："
              :labelCol="{lg: {span: 2}}"
              :wrapperCol="{lg: {span: 17}}">
              <disease-select placeholder="请选择疾病分类" @change="handleChange" v-model="this.screenData.symptomDiseaseClassify" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--end search-->

    <!--table-->
    <div class="table-wrapper">
      <div class="table-head">
        <div class="fl"></div>
        <div class="fr">
          <a-button
            v-permission="'/mall/combined@search'"
            type="primary"
            @click="search">查询</a-button>
          <a-button @click="resetSearch">重置</a-button>
          <a-button
            type="primary"
            :loading="loading"
            v-permission="'/mall/combined@add'"
            @click="addFn()">新增</a-button>
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
          slot="status"
          slot-scope="text">
          <template>
            {{ text === '0' ? '启用' : '禁用' }}
          </template>
        </div>
        <div slot="name" slot-scope="text">
          {{ text | filterNull }}
        </div>
        <div slot="symptomDiseaseClassifyOneLevel" slot-scope="text">
          {{ text | filterNull }}
        </div>
        <div slot="symptomDiseaseClassifyTwoLevel" slot-scope="text">
          {{ text | filterNull }}
        </div>
        <div slot="mainDrugList" slot-scope="text">
          <a-popover title="主要用药" v-if="text && text.length > 0">
            <template slot="content">
              <div class="labelBox">
                <a-tag v-for="(item, index) in text" :key="index">{{ item }}</a-tag>
              </div>
            </template>
            <a-tag style="margin-bottom:5px;" v-for="i in text.slice(0, 2)" :key="i">{{ i }}</a-tag>
          </a-popover>
        </div>
        <div slot="haveAdjuvants" slot-scope="text">
          {{ text | filterNull }}
        </div>
        <div slot="updatedAt" slot-scope="text">
          {{ text | filterNull }}
        </div>
        <div
          slot="action"
          class="action"
          slot-scope="text, record">
          <template>
            <a @click="detailFn('EDIT', record)" v-permission="'/mall/combined@edit'">编辑</a>
            <a @click="detailFn('DELETE', record)" v-permission="'/mall/combined@del'">删除</a>
          </template>
        </div>
      </a-table>
    </div>
    <!--end table-->

  </div>
</template>

<script>
import { combinList, deleteCombin } from '@/api/mall'
import { deepClone } from '@/utils/util'
import diseaseSelect from './diseaseSelect'
import { getDict } from '@/api/common.js'
export default {
  filters: {
    filterNull: function (text) {
      return text || '-'
    }
  },
  components: {
    diseaseSelect
  },
  data () {
    return {
      // 字典：有无用药
      haveNoOption: [],
      loading: false,
      screenData: {
        symptomDiseaseClassify: []
      },
      columns: [
        {
          title: '联合用药名称',
          dataIndex: 'name',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '疾病/症状一级分类',
          dataIndex: 'symptomDiseaseClassifyOneLevel',
          // sorter: true,
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'symptomDiseaseClassifyOneLevel' }
        },
        {
          title: '疾病/症状二级分类',
          dataIndex: 'symptomDiseaseClassifyTwoLevel',
          // sorter: true,
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'symptomDiseaseClassifyTwoLevel' }
        },
        {
          title: '主要用药',
          dataIndex: 'mainDrugList',
          align: 'center',
          width: 300,
          scopedSlots: { customRender: 'mainDrugList' }
        },
        {
          title: '有无辅药',
          dataIndex: 'haveAdjuvants',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'haveAdjuvants' }
        },
        {
          title: '最后编辑时间',
          dataIndex: 'updatedAt',
          sorter: true,
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'updatedAt' }
        },
        {
          title: '编辑人',
          dataIndex: 'updatedBy',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'updatedBy' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  created () {
    if (sessionStorage.getItem('combinPage')) {
      this.pagination.current = Number(sessionStorage.getItem('combinPage'))
    } else {
      this.pagination.current = 1
    }
    if (sessionStorage.getItem('combinPageSize')) {
      this.pagination.pageSize = Number(sessionStorage.getItem('combinPageSize'))
    } else {
      this.pagination.pageSize = 10
    }
    const tempSearchInfo = sessionStorage.getItem('combinSearchData')
    if (tempSearchInfo) {
      this.screenData = JSON.parse(tempSearchInfo)
    }
    sessionStorage.removeItem('combinPage')
    sessionStorage.removeItem('combinPageSize')
    sessionStorage.removeItem('combinSearchData')
    this.initFn()
  },
  methods: {
    deepClone,
    /**
     * 初始化
     */
    initFn () {
      this.getDict('have_no')
      this.getTableData()
    },
    /**
     * 拉取字典
     * @param {*} e
     */
    getDict (e) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        if (e === 'have_no') {
          this.haveNoOption = res.data
        }
      })
    },
    /**
     * 疾病分类回调
     */
    handleChange (res) {
      this.screenData.symptomDiseaseClassifyOneLevel = res[0]
      this.screenData.symptomDiseaseClassifyTwoLevel = res[1]
    },
    /**
     * 拉取列表
     */
    getTableData () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        perPage: this.pagination.pageSize,
        ...this.screenData
      }
      combinList(params).then((res) => {
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
      this.selectedRowKeys = []
      this.selectedRows = []
      // this.screenData.erpOrderNos = ''
      this.getTableData()
    },
    /**
     * 重置查询
     */
    resetSearch () {
      // this.storeIds = []
      this.screenData = {
        symptomDiseaseClassify: []
      }
      this.selectedRowKeys = []
      this.selectedRows = []
      // this.screenData.erpOrderNos = ''
      this.search()
    },
    /**
     * 表格监听事件
     */
    handleTableChange (pagination, filters, sorter) {
      this.selectedRowKeys = []
      this.selectedRows = []
      const sort = {}
      if (sorter.order) {
        if (sorter.order === 'ascend') {
          sort.orderBySortCode = `${sorter.field}`
          sort.orderBySort = 'asc'
        } else {
          sort.orderBySortCode = `${sorter.field}`
          sort.orderBySort = 'desc'
        }
      }
      this.screenData = { ...this.screenData, ...sort }
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
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
     * 编辑
     */
    detailFn (type, record) {
      // 点击编辑后需要携带联合用药id跳转到编辑页面进行回显
      if (type === 'EDIT') {
        sessionStorage.setItem('combinPage', this.pagination.current)
        sessionStorage.setItem('combinPageSize', this.pagination.pageSize)
        sessionStorage.setItem('combinSearchData', JSON.stringify(this.screenData))
        this.$router.push({
          path: '/mall/combination/edit',
          query: {
            combinedId: record.id
          }
        })
      }
      if (type === 'DELETE') {
        this.$confirm({
          centered: true,
          closable: true,
          cancelText: '取消',
          okType: 'danger',
          okText: '确定',
          title: '删除联合用药',
          content: '是否确认删除？',
          icon: () => null,
          onOk: () => {
            const tempInfo = {
              id: record.id
            }
            deleteCombin(tempInfo).then(() => {
              this.getTableData()
            })
          }
        })
      }
    },
    /**
     * 新增
     */
    addFn () {
      this.$router.push({
        path: '/mall/combination/add'
      })
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
  .table-head {
    height: 50px;
    & > div {
      width: 50%;
    }
    .fl {
      float: left;
      span{
        font-size:16px;
        margin-right:10px;
      }
      button{
        margin-right:10px;
      }
    }
    .fr {
      float: right;
      text-align: right;
      & > * {
        margin-left: 10px;
      }
      .labelSpan{
        font-style:normal;
        margin-right:10px;
        &::after{
          content:'>';
          margin-left:10px;
        }
      }
      .labelSpan:last-child{
        &::after{
          content:'';
        }
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
.inputNum{
  width:400px;
}
.modalBox{
  .total{
    margin-top:10px;
    text-align: right;
  }
}
.inputBox{
  display:flex;
  span.input{
    flex:1;
  }
  span.sign{
    width:20px;
    text-align: center;
  }
}
.news {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    //img {
    //  width: 40px;
    //  height: 40px;
    //}
  }
  .labelBox{
    width:500px;
    span{
      margin-bottom:8px;
    }
  }
</style>
