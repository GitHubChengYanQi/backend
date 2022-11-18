<template>
  <div class="auto_lable">
    <div class="table_header">
      <div
        class="table_title"
        v-for="(item,index) in tabHeader"
        v-permission="item.permission"
        :style="{color: table == index ? '#1890ff':'',textShadow: '0 0 0.25px currentColor',border:table == index ? '':'none',display:item.hidden ? 'none':'' }"
        @click="setTable(index)"
        :key="index"
      >
        {{ item.title }}
      </div>
    </div>
    <a-card>
      <div class="table_operation">
        <div
          class="add_rule"
          v-if="addRulePermission.includes(permissionButtonData.addRule[table])"
          @click="goAddPage"
        >添加规则</div>
        <div class="search_box">
          客户标签：
          <div
            class="label_input"
            @click="showBox"
          >
            <span v-if="inputArr.length == 0">请选择标签</span>
            <span
              v-if="inputArr.length > 0"
              class="label_input_title"
            >
              {{ inputArr[0].name }}
              <span
                class="delete"
                @click.stop="setInputArr(inputArr[0].id,0)"
              >+</span>
            </span>
            <i
              class="number"
              v-if="inputArr.length > 1"
            >{{ '（' + inputArr.length + '）' }}</i>
            <span
              v-if="inputArr.length > 0"
              class="empty"
              @click.stop="empty"
            >+</span>
          </div>
          搜索规则：
          <a-input
            placeholder="请搜索规则名称"
            v-model="searchValue"
            style="width: 289px;height:32px;"
          ></a-input>
          <div class="operation_box">
            <a-button
              type="primary"
              @click="onSearch"
            >
              查询
            </a-button>
            <a-button
              style="margin-left:10px;"
              @click="()=>{
                this.searchValue = ''
                this.pagination.current = 1
                this.empty()
                this.getTableData()
              }"
            >
              重置
            </a-button>
          </div>
        </div>
      </div>
      <a-table
        style="marginTop: 20px"
        :row-key="record => record.id"
        :columns="columns[table]"
        :data-source="tableData"
        :pagination="pagination"
        :scroll="{ x: 1500}"
        @change="handleTableChange"
      >
        <div
          slot="fuzzyMatching"
          slot-scope="text, record"
        >
          <template>
            <div class="label_box">
              <span
                class="label"
                v-for=" (item ,index) in record.fuzzyMatching.slice(0,1) "
                :key="index"
              >{{ item.keysInfo }}</span>
              <span
                class="spread"
                v-if="record.fuzzyMatching.length > 1"
                @mouseenter="setSpread(record,'fuzzyMatching')"
              >
                <svg-icon :state="3" />
              </span>
              <div
                class="hidden_div"
                @mouseleave="setSpread(record,'fuzzyMatching')"
                v-if="spread['fuzzyMatching'].includes(record.id)"
              >
                <div
                  class="hidden_span"
                  v-for=" (item , index) in record.fuzzyMatching"
                  :key="index"
                >{{ item.keysInfo }}</div>
              </div>
            </div>
          </template>
        </div>
        <div
          slot="exactMatch"
          slot-scope="text, record"
        >
          <template>
            <div class="label_box">
              <span
                class="label"
                v-for=" (item ,index) in record.exactMatch.slice(0,1) "
                :key="index"
              >{{ item.keysInfo }}</span>
              <span
                class="spread"
                v-if="record.exactMatch.length > 1"
                @mouseenter="setSpread(record,'exactMatch')"
              >
                <svg-icon :state="3" />
              </span>
              <div
                class="hidden_div"
                @mouseleave="setSpread(record,'exactMatch')"
                v-if="spread['exactMatch'].includes(record.id)"
              >
                <div
                  class="hidden_span"
                  v-for=" (item , index) in record.exactMatch"
                  :key="index"
                >{{ item.keysInfo }}</div>
              </div>
            </div>
          </template>
        </div>
        <div
          slot="addRule"
          slot-scope="text, record"
        >
          <template>
            <div class="label_box">
              <span
                class="label"
                v-for=" (item ,index) in record.addRule.slice(0,1)"
                :key="index"
              >{{ item.labelGroupName }}</span>
              <span
                class="spread"
                v-if="record.addRule.length > 1"
                @mouseenter="setSpread(record,'addRule')"
              >
                <svg-icon :state="3" />
              </span>
              <div
                class="hidden_div"
                @mouseleave="setSpread(record,'addRule')"
                v-if="spread['addRule'].includes(record.id)"
              >
                <div
                  class="hidden_span"
                  v-for=" (item , index) in record.addRule"
                  :key="index"
                >{{ item.labelGroupName }}</div>
              </div>
            </div>
          </template>
        </div>
        <div
          slot="labelIdNameGroup"
          slot-scope="text, record"
        >
          <template>
            <a-popover
              title="添加的标签"
              v-if="record.labelIdNameGroup && record.labelIdNameGroup.length > 0"
            >
              <template slot="content">
                <div class="popoverBox">
                  <a-tag
                    v-for="(item, index) in record.labelIdNameGroup"
                    :key="index"
                  >{{ item }}</a-tag>
                </div>
              </template>
              <a-tag type="button">
                查看
              </a-tag>
            </a-popover>
            <span
              class="nolabel"
              v-else
            >无标签</span>
          </template>
        </div>
        <div
          slot="status"
          slot-scope="text, record"
        >
          <template>
            <div class="on_state">
              <a-switch
                :checked="record.status == 1"
                @click="setRules(record)"
                v-permission="permissionButtonData.state[table]"
                checked-children="开"
                un-checked-children="关"
              />
            </div>
          </template>
        </div>
        <div
          slot="operation"
          slot-scope="text, record"
        >
          <template>
            <a-button
              type="link"
              @click="particulars(record)"
              v-permission="permissionButtonData.info[table]"
            >{{ table == 3 ? '编辑':'详情' }}</a-button>
            <a-button
              type="link"
              @click="remove(record)"
              v-permission="permissionButtonData.delete[table]"
            >删除</a-button>
          </template>
        </div>
      </a-table>
    </a-card>
    <label-select
      :state="labelState"
      ref="labelSelect"
    />
  </div>
</template>

<script>
import LabelSelect from './components/LabelSelect'
import SvgIcon from './components/SvgIcon.vue'
import {
  numberAutoLabelIndex,
  numberAutoLabelStatusChange,
  numberAutoLabelDelete,
  groupAutoLabelIndex,
  groupAutoLabelDelete,
  groupAutoLabelStatusChange,
  timeAutoLabelIndex,
  timeAutoLabelDelete,
  timeAutoLabelStatusChange
} from '@/api/clientFollow.js'
import store from '@/store'

export default {
  components: { 'label-select': LabelSelect, 'svg-icon': SvgIcon },
  data () {
    return {
      spread: {
        autoLabelGroups: [],
        addRule: [],
        exactMatch: [],
        fuzzyMatching: []
      },
      tabHeader: [
        { title: '关键词打标签', permission: '/clientFollow/autoLabel/keyword', hidden: true },
        { title: '客户入群行为打标签', permission: '/clientFollow/autoLabel/group' },
        { title: '分时段打标签', permission: '/clientFollow/autoLabel/date' },
        { title: '数值打标签', permission: '/clientFollow/autoLabel/number' },
        { title: '消费属性打标签', permission: '/clientFollow/autoLabel/expend' }
      ],
      permissionButtonData: {
        addRule: ['', '/groupAutoLabel/add@post', '/timeAutoLabel/add@post', '/numberAutoLabel/add@post'],
        state: [
          '',
          '/groupAutoLabel/statusChange@put',
          '/timeAutoLabel/statusChange@put',
          '/numberAutoLabel/statusChange@put'
        ],
        info: ['', '/groupAutoLabel/detail@get', '/timeAutoLabel/detail@get', '/numberAutoLabel/detail@get'],
        delete: ['', '/groupAutoLabel/delete@delete', '/timeAutoLabel/delete@delete', '/numberAutoLabel/delete@delete']
      },
      table: 0,
      searchValue: '',
      columns: [
        [
          {
            align: 'center',
            title: '规则名称',
            dataIndex: 'name',
            width: 150
          },
          {
            align: 'center',
            title: '已打标签数',
            dataIndex: 'labeledNum',
            width: 150
          },
          {
            align: 'center',
            title: '模糊匹配',
            dataIndex: 'fuzzyMatching',
            scopedSlots: { customRender: 'fuzzyMatching' },
            width: 150
          },
          {
            align: 'center',
            title: '精准匹配',
            dataIndex: 'exactMatch',
            scopedSlots: { customRender: 'exactMatch' },
            width: 150
          },
          {
            align: 'center',
            title: '添加的标签',
            dataIndex: 'labelIdNameGroup',
            scopedSlots: { customRender: 'labelIdNameGroup' },
            width: 150
          },
          {
            align: 'center',
            title: '创建时间',
            dataIndex: 'createTime',
            width: 150
          },
          {
            align: 'center',
            title: '规则状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            width: 150
          },
          {
            align: 'center',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        [
          {
            align: 'center',
            title: '规则名称',
            dataIndex: 'name',
            width: 150
          },
          {
            align: 'center',
            title: '已打标签数',
            dataIndex: 'labeledNum',
            width: 150
          },
          {
            align: 'center',
            title: '添加的标签',
            dataIndex: 'labelIdNameGroup',
            scopedSlots: { customRender: 'labelIdNameGroup' },
            width: 150
          },
          {
            align: 'center',
            title: '创建时间',
            dataIndex: 'createTime',
            width: 150
          },
          {
            align: 'center',
            title: '规则状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            width: 150
          },
          {
            align: 'center',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        [
          {
            align: 'center',
            title: '规则名称',
            dataIndex: 'name',
            width: 150
          },
          {
            align: 'center',
            title: '已打标签数',
            dataIndex: 'labeledNum',
            width: 150
          },
          {
            align: 'center',
            title: '创建人',
            dataIndex: 'createBy',
            width: 150
          },
          {
            align: 'center',
            title: '创建时间',
            dataIndex: 'createTime',
            width: 150
          },
          {
            align: 'center',
            title: '添加的标签',
            dataIndex: 'labelIdNameGroup',
            scopedSlots: { customRender: 'labelIdNameGroup' },
            width: 150
          },
          {
            align: 'center',
            title: '规则状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            width: 150
          },
          {
            align: 'center',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        [
          {
            align: 'center',
            title: '规则名称',
            dataIndex: 'name',
            width: 150
          },
          {
            align: 'center',
            title: '创建人',
            dataIndex: 'createBy',
            width: 150
          },
          {
            align: 'center',
            title: '创建时间',
            dataIndex: 'createTime',
            width: 150
          },
          {
            align: 'center',
            title: '已打标签数',
            dataIndex: 'labeledNum',
            width: 150
          },
          {
            align: 'center',
            title: '添加的标签',
            dataIndex: 'labelIdNameGroup',
            scopedSlots: { customRender: 'labelIdNameGroup' },
            width: 150
          },
          {
            align: 'center',
            title: '规则状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            width: 150
          },
          {
            align: 'center',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        [
          {
            align: 'center',
            title: '规则名称',
            dataIndex: 'name',
            width: 150
          },
          {
            align: 'center',
            title: '创建人',
            dataIndex: 'createBy',
            width: 150
          },
          {
            align: 'center',
            title: '创建时间',
            dataIndex: 'createTime',
            width: 150
          },
          {
            align: 'center',
            title: '已打标签数',
            dataIndex: 'labeledNum',
            width: 150
          },
          {
            align: 'center',
            title: '添加的标签',
            dataIndex: 'labelIdNameGroup',
            scopedSlots: { customRender: 'labelIdNameGroup' },
            width: 150
          },
          {
            align: 'center',
            title: '规则状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            width: 150
          },
          {
            align: 'center',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: 'operation' }
          }
        ]
      ],
      tableData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total, range) => `第 ${Math.ceil(range[1] / this.pagination.pageSize)}页/共${total}条数据 `
      },
      labelState: false,
      inputArr: [],
      tabPermission: [],
      autoLabelData: [],
      addRulePermission: []
    }
  },
  created () {
    this.getUrl()
  },
  methods: {
    setSpread (e, key) {
      if (!this.spread[key].includes(e.id)) {
        this.spread[key] = [...this.spread[key], e.id]
      } else {
        this.spread[key] = this.spread[key].filter((item) => {
          return item != e.id
        })
      }
      this.$forceUpdate()
    },
    onSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    del (e) {
      const data = {
        id: e
      }
      const apiArr = ['', groupAutoLabelDelete, timeAutoLabelDelete, numberAutoLabelDelete]
      apiArr[this.table](data).then((res) => {
        if (res.code == 200) this.$message.success('删除成功')
        this.getTableData()
      })
    },
    updated (e, i) {
      const data = {
        id: e,
        status: i == '1' ? '0' : '1'
      }
      const apiArr = ['', groupAutoLabelStatusChange, timeAutoLabelStatusChange, numberAutoLabelStatusChange]
      apiArr[this.table](data).then((res) => {
        console.log(res)
        this.getTableData()
      })
    },
    setTable (e) {
      if (this.$refs.labelSelect) {
        this.$refs.labelSelect.idArr = []
        this.$refs.labelSelect.inputArr = []
      }

      this.table = e
      this.searchValue = ''
      this.inputArr = []
      this.tableData = []
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.getTableData()
      history.replaceState(null, '', `/clientFollow/autoLabel?id=${e}`)
    },
    getTableData () {
      let labelIdGroup = ''
      if (this.inputArr.length > 0) {
        this.inputArr.map((item, index) => {
          labelIdGroup = index == 0 ? item.id : labelIdGroup + ',' + item.id
        })
        labelIdGroup = labelIdGroup.toString()
      }
      console.log(labelIdGroup)
      const obj = {
        labelIdGroup,
        name: this.searchValue,
        page: this.pagination.current,
        perPage: this.pagination.pageSize
      }
      console.log(obj)
      const apiArr = ['', groupAutoLabelIndex, timeAutoLabelIndex, numberAutoLabelIndex, numberAutoLabelIndex]
      apiArr[this.table](obj).then((res) => {
        console.log(res)
        this.tableData = res.data.list
        this.pagination.total = res.data.page.total
      })
    },
    handleChange (e) {
      this.value = [...e]
    },
    transmitLabel (e) {
      this.inputArr = e
    },
    remove (e) {
      this.$confirm({
        title: '提示',
        content: '是否删除',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.del(e.id)
        },
        onCancel () {}
      })
    },
    // 编辑
    particulars (record) {
      if (this.table == 3) {
        this.$router.push(`${'/clientFollow/addRule'}?id=${this.table}&label=${record.id}`)
        localStorage.setItem('autoLabel', JSON.stringify(record))
      } else {
        this.$router.push(`${'/clientFollow/labelInfo'}?id=${this.table}&label=${record.id}`)
      }
    },
    setRules (e) {
      this.updated(e.id, e.status)
    },
    showBox (e) {
      if (e != -1) {
        this.$refs.labelSelect.idArr = this.inputArr.map((item) => {
          return item.id
        })
        this.$refs.labelSelect.inputArr = this.inputArr
      }
      this.labelState = !this.labelState
    },
    getUrl () {
      // autoLabelRule().then((res) => {
      //   console.log(res)
      // })
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符串
      const urlData = url.substr(1)
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      this.table = object.id || 1
      console.log(this.table)
      const sideMenus = store.state.permission.permissionList
      sideMenus[0].children.map((item) => {
        if (item.children.length > 0) {
          item.children.map((items) => {
            if (items.path == '/clientFollow/autoLabel') {
              this.autoLabelData = items.meta.actionList
            }
          })
        }
      })
      this.tabHeader.filter((item, index) => {
        if (this.autoLabelData.includes(item.permission)) {
          this.tabPermission.push(index)
        }
      })
      this.addRulePermission = this.autoLabelData.filter((item) => {
        return this.permissionButtonData.addRule.includes(item)
      })
      console.log(this.addRulePermission)
      // if (this.tabPermission.length != 0) {
      //   if (this.tabPermission[0] == 0) {
      //     this.table = 1
      //     this.setTable(1)
      //   } else {
      //     this.table = this.tabPermission[0]
      //     this.setTable(this.tabPermission[0])
      //   }
      // }

      this.getTableData()
    },
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.filters = filters
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    empty () {
      this.$refs.labelSelect.idArr = []
      this.$refs.labelSelect.inputArr = []
      this.inputArr = []
    },
    setInputArr (e, i) {
      this.$refs.labelSelect.setArr(e, i)
      this.inputArr = this.inputArr.filter((item) => {
        if (item.id != e) return item
      })
    },
    goAddPage () {
      this.$router.push(`${'/clientFollow/addRule'}?id=${this.table}`)
    }
  }
}
</script>

<style lang="less" scoped>
.auto_lable {
  .table_header {
    box-sizing: border-box;
    padding: 10px 0 20px 0;
    width: 100%;
    display: flex;
    .table_title {
      margin: 0 32px 0 0;
      padding: 12px 16px;
      position: relative;
      cursor: pointer;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      font-family: 'FontAwesome', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      color: #333333;
      height: 50px;
      background: inherit;
      border-bottom: 2px solid #1890ff;

      .wire {
        position: absolute;
        bottom: -20px;
        width: 120px;
        height: 1px;
        background-color: #1890ff;
      }
    }
  }
  .table_operation {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .add_rule {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 130px;
      height: 39px;
      background: inherit;
      background-color: #1890ff;
      border: none;
      border-radius: 5px;
      font-family: 'Arial Normal', 'Arial', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      flex-shrink: 0;
      color: #ffffff;
    }
    .search_box {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;

      .label_input {
        position: relative;
        box-sizing: border-box;
        padding: 5px;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        border: 1px solid #d9d9d9;
        width: 173px;
        overflow: hidden;
        box-sizing: border-box;
        cursor: pointer;
        color: #bfbfbf;
        border-radius: 2px;
        padding-left: 5px;
        margin-right: 10px;
        .label_input_title {
          position: relative;
          flex-shrink: 0;
          margin: 4px;
          padding: 0 20px;
          max-width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 28px;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          background: #f7f7f7;
          border-radius: 4px;
          border: 1px solid #e9e9e9;
          .delete {
            position: absolute;
            top: 0;
            right: 0;
            margin-left: 5px;
            line-height: 20px;
            font-size: 20px;
            transform: rotate(45deg);

            &:hover {
              color: #0052d9;
            }
          }
        }
        .number {
          position: absolute;
          right: 46px;
          top: 12px;
        }
        .empty {
          position: absolute;
          top: 50%;
          right: 10px;
          width: 14px;
          height: 14px;
          background-color: rgba(87, 85, 85, 0.7);
          border-radius: 50%;
          color: #fff;
          transform: translateY(-50%) rotate(45deg);
          font-size: 18px;
          font-style: normal;
          line-height: 10px;
          text-align: center;
          text-transform: none;
          vertical-align: -0.125em;
          text-rendering: optimizeLegibility;
        }
      }

      .operation_box {
        display: flex;
        align-items: center;
        box-shadow: none;
        padding: 0 10px;
        margin-left: 20px;
        font-family: 'Arial Normal', 'Arial', sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        .query {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 32px;
          background: inherit;
          background-color: rgba(0, 82, 217, 1);
          border: none;
          border-radius: 3px;
          color: #fff;
        }
        .reset {
          margin-left: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0052d9;
          width: 60px;
          height: 32px;
          background: inherit;
          background-color: rgba(255, 255, 255, 1);
          box-sizing: border-box;
          border-width: 1px;
          border-style: solid;
          border-color: rgba(0, 82, 217, 1);
          border-radius: 3px;
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
  .on_state {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
