<template>
  <div class="interactionRadar_page">
    <a-card class="interactionRadar_card">
      <div class="interactionRadar_content">
        <div
          class="interactionRadar_catalog"
          @click="()=>{
            catalogIndex = -1
            getTableData()
          }">
          <div class="header">
            <div class="title">
              分组名称
            </div>
            <div
              class="add_btn"
              @click="()=>{
                amendId = -1
                modalTitle = '新建分组'
                modalState = true
              }"
            >
              添加
            </div>
          </div>
          <div class="catalog_box">
            <div
              class="catalog"
              :style="catalogIndex == item.id ? {backgroundColor:'rgba(129, 211, 248, 1)'}:{}"
              v-for="(item,index) in catalog"
              @click.stop="()=>{
                catalogIndex = item.id
                table.pagination.current = 1
                table.pagination.pageSize = 10
                getTableData()
              }"
              :key="index"
            >
              <span class="title">{{ item.name }}</span>
              <span v-if="catalogIndex == item.id && index != 0">
                <a-dropdown
                  :trigger="['click']"
                  placement="bottomLeft"
                >
                  <img
                    class="icon"
                    :src="require('@/assets/more.svg')"
                    alt=""
                  >
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <div
                          class="down_select"
                          @click="setGroup(1,item)"
                        >修改分组</div>
                      </a-menu-item>
                      <a-menu-item>
                        <div
                          class="down_select"
                          @click="setGroup(2,item)"
                        >删除分组</div>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </span>
            </div>
          </div>
        </div>
        <div class="interactionRadar_table_box">
          <div class="hearder">
            <div class="search_box">
              <div
                class="search"
                v-for="(item,index) in searchData.searchInput"
                :key="index"
              >
                <div class="title">{{ item.title }}</div>
                <div class="input_box">
                  <a-range-picker
                    class="date"
                    v-model="searchData.data[item.key]"
                    v-if="item.type == 'date'"
                  />
                  <a-select
                    class="input"
                    v-model="searchData.data[item.key]"
                    v-else-if="item.type == 'select'"
                  >
                    <a-select-option
                      v-for="(items,indexs) in selectArr[item.selectKey]"
                      :value="items.code"
                      :key="indexs"
                    >{{ items.name }}</a-select-option>
                  </a-select>
                  <a-input
                    class="input"
                    v-else
                    v-model="searchData.data[item.key]"
                    :placeholder="item.placeholder ? item.placeholder : ''"
                  ></a-input>
                </div>
              </div>
            </div>
            <div class="button_box">
              <a-button
                type="primary"
                class="button"
                @click="getSearch"
              >查询</a-button>
              <a-button
                class="button"
                @click="reset"
              >重置</a-button>
              <a-button
                type="primary"
                class="button"
                @click="exportsElxe"
              >导出</a-button>
            </div>
          </div>
          <div class="content">
            <div class="header">
              <span class="txt">共{{ table.pagination.total }}个雷达链接</span>
              <span class="button_box">
                <a-popover
                  title="选择分组"
                  trigger="click"
                  :visible="clicked"
                  @visibleChange="handleClickChange"
                >
                  <template #content>
                    <div class="batches_box">
                      <div class="input_box">
                        <a-select
                          class="input"
                          placeholder="请选择"
                          v-model="unitId"
                        >
                          <a-select-option
                            v-for="(items,indexs) in catalog"
                            :value="items.id"
                            :key="indexs"
                          >{{ items.name }}</a-select-option>
                        </a-select>
                      </div>
                      <div class="btn_box">
                        <a-button
                          class="button"
                          @click="handleClickChange"
                        >取消</a-button>
                        <a-button
                          type="primary"
                          class="button"
                          @click="batchesAmend"
                        >确定</a-button>
                      </div>
                    </div>
                  </template>
                  <a-button
                    type="primary"
                    class="button"
                  >批量修改分组</a-button>
                </a-popover>
                <a-button
                  type="primary"
                  class="button"
                  @click="batchesDel"
                >批量删除</a-button>
                <a-button
                  type="primary"
                  class="button"
                  @click="goPage(0)"
                >新建雷达连接</a-button>
              </span>
            </div>
            <div class="table_box">
              <a-table
                bordered
                :row-key="record => record.id"
                :columns="table.columns"
                :data-source="table.data"
                :pagination="table.pagination"
                :scroll="{ x: 1500}"
                :row-selection="{selectedRowKeys:table.rowSelection,onChange: onSelectChange}"
                @change="handleTableChange"
                class="table"
                ref="table"
              >
                <div
                  slot="operation"
                  slot-scope="text, record"
                >
                  <template>
                    <a-button
                      type="link"
                      @click="goPage(3,record)"
                    >数据</a-button>
                    <a-button
                      type="link"
                      @click="goPage(1,record)"
                    >修改</a-button>
                    <a-button
                      type="link"
                      @click="remove(record)"
                    >删除</a-button>
                    <a-button
                      type="link"
                      @click="copylink(record)"
                    >复制链接</a-button>
                  </template>
                </div>
                <div
                  slot="example"
                  slot-scope="text,record"
                >
                  <template>
                    <div class="example" v-if="record.entry">
                      <div
                        v-if="record.type == 2"
                        class="pdf"
                      >
                        <div class="title">{{ record.entry.linkTitle }}</div>
                        <div class="icon_box">
                          <img
                            class="icon"
                            :src="require('@/assets/pdf.png')"
                            alt=""
                          >
                        </div>
                      </div>
                      <div
                        v-else
                        class="example_box"
                      >
                        <div class="left">
                          <div class="title">{{ record.entry.linkTitle }}</div>
                          <div class="content">{{ record.entry.linkDigest }}</div>
                        </div>
                        <div class="right">
                          <img
                            class="img"
                            :src="record.entry.linkImg"
                            alt=""
                          />
                        </div>
                      </div>

                    </div>
                  </template>
                </div>
                <div
                  slot="radarTab"
                  slot-scope="text,record"
                >
                  <template>
                    <a-popover
                      title="标签"
                      v-if="record.track && record.track.linkState && record.track.linkState.length > 0"
                    >
                      <template slot="content">
                        <div class="labelBox">
                          <a-tag
                            v-for="(item, index) in record.track.linkState"
                            :key="index"
                          >{{ item.name }}</a-tag>
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
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-modal
      v-model="modalState"
      :title="modalTitle"
      width="591px"
      @ok="setCatalog"
      @cancel="()=>{
        modalState = false
        catalogName = ''
      }"
    >
      <div class="model_input_box">
        <span class="model_input_title"> <span class="model_input_icon">* </span> 分组名称：</span>
        <a-input
          v-model="catalogName"
          :maxLength="15"
        ></a-input>
        <span class="hint">{{ catalogName.length + '/15' }}</span>
      </div>
    </a-modal>
    <a-modal
      v-model="copylinkState"
      title="选择应用渠道"
      width="591px"
      @ok="copy"
      @cancel="()=>{
        copylinkState = false
      }"
    >
      <div class="model_input_box">
        <a-select
          style="width:300px"
          class="input"
          placeholder="请选择"
          v-model="copylinkName"
        >
          <a-select-option
            v-for="(items,indexs) in channel"
            :value="items.id"
            :key="indexs"
          >{{ items.name }}</a-select-option>
        </a-select>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'
import { callDownLoadByBlob } from '@/utils/downloadUtil'
import { scrmRadarLabelFind, scrmRadarLabelSave, scrmRadarLabelDrop, scrmRadarArticleFind, scrmRadarArticleDrop, scrmRadarArticleAway, scrmRadarArticleMove, scrmRadarArticleDown, scrmRadarShiftSend } from '@/api/setRadar.js'
import moment from 'moment'

export default {
  data () {
    return {
      catalog: [],
      catalogIndex: -1,
      unitId: 0,
      modalTitle: '新建分组',
      modalState: false,
      catalogName: '',
      amendId: -1,
      searchData: {
        searchInput: [
          {
            title: '创建时间：',
            type: 'date',
            key: 'createdAt'
          },
          {
            title: '类型：',
            type: 'select',
            selectKey: 'type',
            key: 'shape'
          },
          {
            title: '链接标题：',
            type: 'input',
            placeholder: '请输入要搜索的链接标题',
            key: 'title'
          }
        ],
        data: {
          createdAt: [],
          shape: '0',
          title: ''
        }
      },
      selectArr: {
        type: []
      },
      table: {
        data: [],
        columns: [
          {
            align: 'center',
            title: '雷达标题',
            dataIndex: 'title',
            width: 150
          },
          {
            align: 'center',
            title: '所属分组',
            dataIndex: 'unitName',
            width: 150
          },
          {
            align: 'center',
            title: '示例',
            dataIndex: 'example',
            scopedSlots: { customRender: 'example' },
            width: 200
          },
          {
            align: 'center',
            title: '雷达标签',
            dataIndex: 'radarTab',
            scopedSlots: { customRender: 'radarTab' },
            width: 150
          },
          {
            align: 'center',
            title: '点击人数',
            dataIndex: 'clickNum',
            width: 150
          },
          {
            align: 'center',
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 150
          },
          {
            align: 'center',
            title: '类型',
            dataIndex: 'shape'
          },
          {
            align: 'center',
            className: 'table_header',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 280,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共${total}条数据 `,
          pageSizeOptions: ['10', '20', '30', '50']
        },
        rowSelection: []
      },
      clicked: false,
      copylinkState: false,
      copyId: -1,
      copylinkName: -1,
      channel: []
    }
  },
  created () {
    this.getSelect('radar_type', 'type')
    this.getGroup()
    this.getTableData()
  },
  methods: {
    handleClickChange () {
      if (this.table.rowSelection.length == 0) return this.$message.error('至少选择一条链接')
      this.clicked = !this.clicked
    },
    getGroup () {
      const obj = {
        left: 1
      }
      scrmRadarLabelFind(obj).then((res) => {
        console.log(res)
        this.catalog = res.data.group
      })
    },
    remove (e) {
      this.$confirm({
        title: '删除规则',
        content: '是否确定删除规则？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const obj = {
            id: e.id
          }
          console.log(obj)
          scrmRadarArticleDrop(obj).then(res => {
            console.log(res)
            this.getTableData()
          })
        },
        onCancel () {}
      })
    },
    batchesAmend () {
      const obj = {
        kagi: this.table.rowSelection,
        unitId: this.unitId
      }
      scrmRadarArticleMove(obj).then(res => {
        console.log(res)
        this.getTableData()
      })
      this.clicked = !this.clicked
    },
    batchesDel () {
      if (this.table.rowSelection.length == 0) return this.$message.error('至少选择一条链接')
      this.$confirm({
        title: '警告',
        content: '是否确认删除当前雷达？该操作不可撤销，请谨慎操作。',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const obj = { kagi: this.table.rowSelection }
          scrmRadarArticleAway(obj).then(res => {
            console.log(res)
            this.getTableData()
          })
        },
        onCancel () {}
      })
    },
    copylink (e) {
      console.log(e)
      this.copyId = e.id
      this.copylinkName = e.ditch[0].id
      this.channel = e.ditch
      this.copylinkState = true
    },
    copy () {
      const obj = {
        articleId: this.copyId,
        ditchId: this.copylinkName,
        remark: '从互动雷达列表页发送'
      }
      scrmRadarShiftSend(obj).then(res => {
        console.log(res)
        const inputNode = document.createElement('input') // 创建input
        inputNode.value = res.data.link // 赋值给 input 值
        document.body.appendChild(inputNode) // 插入进去
        inputNode.select() // 选择对象
        document.execCommand('Copy') // 原生调用执行浏览器复制命令
        inputNode.className = 'oInput'
        inputNode.style.display = 'none' // 隐藏
        this.copylinkState = false
        this.$message.success('复制成功')
      })
    },
    handleTableChange ({ current, pageSize }) {
      console.log(current, pageSize)
      this.table.pagination.pageSize = pageSize
      this.table.pagination.current = current
      this.getTableData()
    },
    onSelectChange (e) {
      console.log(e)
      this.table.rowSelection = e
    },
    goPage (e, item = {}) {
      console.log(e, item)
      if (e != 3) {
        this.$router.push(`/interactionRadar/setRadar${e == 0 ? '' : '?id=' + item.id}`)
      } else {
        this.$router.push(`/interactionRadar/radarInfo?id=${item.id}`)
      }
    },
    getSearch () {
      this.getTableData()
    },
    reset () {
      this.searchData.data = {
        createdAt: [],
        shape: '0',
        title: ''
      }
      this.table.pagination.current = 1
      this.table.pagination.pageSize = 10
      this.getTableData()
    },
    exportsElxe () {
      const { data } = this.searchData

      const obj = {}
      for (const key in data) {
        if (key != 'createdAt') {
          obj[key] = data[key]
        }
      }
      if (data.createdAt.length > 0) {
        obj.createdAt = data.createdAt.map(item => {
          return moment(item).format('YYYY-MM-DD')
        })
      }
      if (this.table.rowSelection.length != 0) {
        obj.kagi = this.table.rowSelection
        obj.current = 1
      }
      if (this.catalogIndex != -1) {
        obj.unitId = this.catalogIndex
      }
      scrmRadarArticleDown(obj).then(res => {
        callDownLoadByBlob(res, '互动雷达')
      })
    },
    setCatalog () {
      console.log(this.catalogName)
      const obj = {
        name: this.catalogName
      }
      if (this.amendId != -1) {
        obj.id = this.amendId
      }
      scrmRadarLabelSave(obj).then((res) => {
        console.log(res)
        this.modalState = false
        this.catalogName = ''
        this.getGroup()
      })
    },
    getSelect (e, key) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        console.log(res)
        this.selectArr[key] = res.data
      })
    },
    setGroup (e, item) {
      console.log(e, item)
      if (e == 1) {
        this.modalTitle = '修改分组'
        this.modalState = true
        this.catalogName = item.name
        this.amendId = item.id
      } else {
        this.$confirm({
          title: '提示',
          content: '是否确认删除当前分组？删除后该分组下素材移动到默认分组中，该操作不可撤销，请谨慎操作。',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            const obj = {
              id: item.id
            }
            scrmRadarLabelDrop(obj).then(res => {
              console.log(res)
              this.getGroup()
            })
          },
          onCancel () {}
        })
      }
    },
    getTableData () {
      const { current, pageSize } = this.table.pagination
      const { data } = this.searchData
      const obj = {
        current,
        size: pageSize
      }
      for (const key in data) {
        if (key != 'createdAt') {
          obj[key] = data[key]
        }
      }
      if (data.createdAt.length > 0) {
        obj.createdAt = data.createdAt.map(item => {
          return moment(item).format('YYYY-MM-DD')
        })
      }
      if (this.catalogIndex != -1) {
        obj.unitId = this.catalogIndex
      }
      console.log(obj)
      scrmRadarArticleFind(obj).then(res => {
        console.log(res)
        this.table.data = res.data.datas.map(item => {
          const typeArr = this.selectArr.type.filter(items => {
            return items.name == item.shape
          })
          item.type = typeArr.length == 0 ? 3 : typeArr[0].code
          return item
        })
        this.table.pagination.total = res.data.total
      })
    }
  }
}
</script>

<style lang="less" scoped>
.interactionRadar_page {
  width: 100%;
  .interactionRadar_card {
    width: 100%;
    min-width: 870px;

    .interactionRadar_content {
      min-width: 870px;
      width: 100%;
      display: flex;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
      color: #333333;
      .interactionRadar_catalog {
        flex-shrink: 0;
        width: 220px;
        height: 647px;
        overflow: auto;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 10px;
        .header {
          margin-bottom: 10px;
          font-size: 14px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .title {
            font-weight: 700;
          }
          .add_btn {
            cursor: pointer;
            color: #1890fe;
          }
        }
        .catalog_box {
          width: 100%;
          display: flex;
          flex-direction: column;
          .catalog {
            margin-bottom: 15px;
            cursor: pointer;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 31px;
            box-sizing: border-box;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            .icon {
              width: 20px;
              transform: rotate(90deg);
            }
            .title {
              white-space: nowrap;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .interactionRadar_table_box {
        flex-grow: 1;
        box-sizing: border-box;
        padding: 5px 10px;
        min-width: 650px;
        .hearder {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .search_box {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .search {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              margin-right: 15px;
              margin-bottom: 25px;
              .title {
                white-space: nowrap;
              }
              .input_box {
                .date {
                  width: 200px;
                }
              }
            }
          }
          .button_box {
            margin-bottom: 25px;
            .button {
              margin-left: 10px;
            }
          }
        }
        .content {
          width: 100%;
          .header {
            margin-bottom: 25px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .button_box {
              .button {
                margin-left: 10px;
              }
            }
          }
          .table_box {
            width: 100%;
            .table {
              width: 100%;
              .example {
                width: 100%;
                height: 100%;
                .example_box {
                  width: 178px;
                  height: 79px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  box-sizing: border-box;
                  padding: 10px;
                  border: 1px solid #ccc;
                  border-radius: 10px;
                  .left {
                    width: 90px;
                    font-size: 12px;
                    color: #7f7f7f;

                    .title {
                      white-space: nowrap;
                      text-align: start;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                    .content {
                      white-space: nowrap;
                      text-align: start;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                  .img {
                    width: 57px;
                    height: 44px;
                  }
                }
                .pdf {
                  width: 178px;
                  height: 87px;
                  display: flex;
                  justify-content: space-between;
                  box-sizing: border-box;
                  padding: 10px;
                  border: 1px solid #ccc;
                  border-radius: 10px;
                  .title {
                    flex-grow: 1;
                    text-align: start;
                  }
                  .icon {
                    width: 70px;
                    height: auto;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.model_input_box {
  display: flex;
  align-items: center;
  justify-content: center;
  .model_input_title {
    position: relative;
    font-size: 13px;
    white-space: nowrap;
    .model_input_icon {
      color: red;
    }
  }
  .hint {
    position: absolute;
    top: 50%;
    right: 30px;
    transform: translate(0, -50%);
  }
}

.labelBox {
  width: 400px;
  span {
    margin-bottom: 10px;
  }
}
.batches_box {
  width: 292px;
  .input {
    width: 80%;
    margin-bottom: 10px;
  }
  .btn_box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .button {
      margin-left: 20px;
    }
  }
}
</style>
