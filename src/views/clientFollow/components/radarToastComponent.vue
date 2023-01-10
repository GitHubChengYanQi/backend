<template>
  <div class="radarChooseToast_Component_Container" ref="radarChooseToast_Component_Ref">
    <a-modal
      :visible="visible"
      centered
      @ok="handleAddRadarOk"
      width="75%"
      :getContainer="() => $refs['radarChooseToast_Component_Ref']"
      @cancel="handleClose">
      <div class="interactionRadar_table_box">
        <div class="hearder">
          <div class="tabs">
            <a-tabs v-model="searchData.shape" @change="getTableData()">
              <a-tab-pane v-for="items in typeArr" :key="items.code" :tab="items.name" />
            </a-tabs>
          </div>
          <div class="rigBox">
            <div class="search_box">
              <div class="search">
                <div class="title">链接标题：</div>
                <div class="input_box">
                  <a-input class="input" v-model="searchData.title" placeholder="请输入要搜索的链接标题"></a-input>
                </div>
              </div>
            </div>
            <div class="button_box">
              <a-button type="primary" class="button" @click="getTableData()">查询</a-button>
              <a-button class="button" @click="reset">重置</a-button>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="table_box">
            <a-table
              bordered
              :row-key="record => record.id"
              :columns="columns"
              :data-source="tableData"
              :pagination="pagination"
              :row-selection="{ selectedRowKeys: rowSelection, onChange: onSelectChange }"
              @change="handleTableChange"
              class="table"
              ref="table">
              <div slot="ditch" slot-scope="list, record">
                <a-select style="width: 100px;" v-model="record.selectChannel" placeholder="请选择...">
                  <a-select-option v-for="item in list" :key="item.id" :value="item.id">{{ item.name
                  }}</a-select-option>
                </a-select>
              </div>
              <div slot="example" slot-scope="text,record">
                <template>
                  <div class="example">
                    <div v-if="record.type == 2" class="pdf">
                      <div class="title">{{ record.entry.linkTitle }}</div>
                      <div class="icon_box">
                        <img class="icon" :src="require('@/assets/pdf.png')" alt="">
                      </div>
                    </div>
                    <div v-else class="example_box">
                      <div class="left">
                        <div class="title">{{ record.entry.linkTitle }}</div>
                        <div class="content">{{ record.entry.linkDigest }}</div>
                      </div>
                      <div class="right">
                        <img v-if="record.entry.linkImg" class="img" :src="record.entry.linkImg" alt="" />
                      </div>
                    </div>

                  </div>
                </template>
              </div>
              <div slot="radarTab" slot-scope="text,record">
                <template>
                  <a-popover
                    title="标签"
                    v-if="record.track && record.track.linkState && record.track.linkState.length > 0">
                    <template slot="content">
                      <div class="labelBox">
                        <a-tag v-for="(item, index) in record.track.linkState" :key="index">{{ item.name }}</a-tag>
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
      </div>
    </a-modal>
  </div>
</template>

<script>
/**
 * @param v-model 控制是否显示  由于需要判断点击确定后的数量，类型是否允许展示，所以取消展示由父组件判断，内部不主动关闭
 * @function handleAddRadarOk 点击确定后展示items
 *
 */
import { getDict } from '@/api/common'
import { scrmRadarArticleFind, scrmRadarShiftSend } from '@/api/setRadar'

export default {
  name: 'RadarChoose',
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  model: {
    prop: 'visible',
    event: 'setVisible'
  },
  components: {},
  data () {
    return {
      selectItem: [],
      searchData: {
        shape: '0',
        title: ''
      },
      typeArr: [],
      tableData: [],
      columns: [
        {
          align: 'center',
          title: '选择渠道',
          dataIndex: 'ditch',
          scopedSlots: { customRender: 'ditch' },
          width: 150
        },
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
          width: 100
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
          dataIndex: 'shape',
          width: 100
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
    }
  },
  computed: {},
  watch: {
    visible (e) {
      if (e) {
        if (!this.typeArr.length) {
          getDict({ dictType: 'radar_type' }).then((res) => {
            this.typeArr = res.data
          })
        }
        this.getTableData()
      } else {
        this.clearToast()
      }
    }
  },
  created () {

  },
  methods: {
    async handleAddRadarOk () {
      if (this.selectItem.some(it => it.selectChannel === undefined)) {
        this.$message.warning('请给选中雷达内容选择对应渠道')
        return
      }
      const generaLinkList = []
      const pdfImgUrl = 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16705765731520526947.png?Expires=101670576719&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=8PKFdn5QcdzIQnTYMjR7uBY8VjM%3D'
      for (let i = 0; i < this.selectItem.length; i++) {
        const item = this.selectItem[i]
        const res = await scrmRadarShiftSend({
          articleId: item.id,
          ditchId: item.selectChannel,
          remark: 'SCRM发送'
        })
        const findChannel = item.ditch.find(it => it.id === item.selectChannel) || {}
        if (item.shape === 'PDF') {
          item.entry.linkImg = pdfImgUrl
          item.entry.linkImgPath = 'upload/16705765731520526947.png'
        }
        generaLinkList.push({ ...item, link: res.data.link, itemType: 'radar', channelTxt: findChannel.name })
      }
      console.log(generaLinkList[0], 'generaLinkList')
      this.$emit('handleAddRadarOk', generaLinkList)
      // 外部判断允许关闭了外部直接关闭
      // this.$emit('setVisible', false)
    },
    getTableData () {
      const { current, pageSize } = this.pagination
      const obj = {
        ...this.searchData,
        current,
        size: pageSize
      }
      scrmRadarArticleFind(obj).then(res => {
        console.log(res)
        this.tableData = res.data.datas.map(item => {
          const typeArr = this.typeArr.filter(items => {
            return items.name == item.shape
          })
          item.type = typeArr.length == 0 ? 3 : typeArr[0].code
          item.selectChannel = item.ditch.length === 1 ? item.ditch[0].id : undefined
          return item
        })
        this.pagination.total = res.data.total
      })
    },
    reset () {
      this.searchData.title = ''
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.getTableData()
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.pageSize = pageSize
      this.pagination.current = current
      this.getTableData()
    },
    onSelectChange (keys, rows) {
      this.rowSelection = keys
      this.selectItem = rows
    },
    clearToast () {
      this.searchData = {
        shape: '0',
        title: ''
      }
      this.tableData = []
      this.pagination.total = 0
      this.pagination.current = 1
      this.rowSelection = []
    },
    handleClose () {
      this.$emit('setVisible', false)
    }
  }
}
</script>
<style lang='less'>
.radarChooseToast_Component_Container {
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

      .rigBox {
        display: flex;
        height: 45px;
        margin-right: 20px;
      }

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
        .button {
          margin-left: 10px;
        }
      }
    }

    .content {
      width: 100%;

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
</style>
<style lang='less' scoped>

</style>
