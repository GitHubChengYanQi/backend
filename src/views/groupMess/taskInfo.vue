<template>
  <div class="A_page">
    <a-card class="A_card">
      <div class="A_header">
        <div
          class="A_info_box"
          v-for="(item,index) in info.type"
          :key="index"
        >
          <div class="info_title">{{ item.title }}</div>
          <div class="info_content">
            <span
              class="button"
              v-if="item.type == 'button'"
            >
              <span class="text">
                {{ info.data[item.key] }}
              </span>
              <span
                class="btn_box"
                :style="`background-color:${info.btnState[info.data.btn].color}`"
              >{{ info.btnState[info.data.btn].txt }}</span>
            </span>
            <span
              class="content"
              v-else-if="item.type == 'content'"
            >
              <span
                class="text"
                v-for="(items,indexs) in info.data[item.key]"
                :key="indexs"
              >
                {{ info.state[items] + (indexs + 1 != info.data[item.key].length ? '+' : '') }}
              </span>
              <span class="btn">预览消息</span>
            </span>
            <span
              class="txt"
              v-else
            >{{ info.data[item.key] }}</span>
          </div>
        </div>
      </div>
      <div class="A_table_box">
        <div class="A_tab_box">
          <div
            class="A_tab"
            v-for="(item,index) in table.tabArr"
            :key="index"
            @click="setTab(index)"
            :style="table.tab == index ? {color:'rgb(0, 82, 217)',borderBottom:'1px solid rgb(0, 82, 217)'}:{}"
          >
            {{ item }}
          </div>
          <a-button
            type="primary"
            class="button"
            @click="exportsElxe"
          >导出</a-button>
        </div>
        <div class="A_table">
          <a-table
            :columns="table.columns[table.tab]"
            :data-source="table.data"
            rowKey="id"
            :row-selection="{selectedRowKeys:table.rowSelection,onChange: onSelectChange}"
            :pagination="table.pagination"
            @change="handleTableChange"
          ></a-table>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      info: {
        type: [
          {
            title: '任务名称：',
            type: 'button',
            key: 'taskName'
          },
          {
            title: '创建时间：',
            type: 'txt',
            key: 'createTime'
          },
          {
            title: '开始时间：',
            type: 'txt',
            key: 'startTime'
          },
          {
            title: '消息内容：',
            type: 'content',
            key: 'content'
          }
        ],
        data: {
          taskName: '测试123',
          createTime: '2022年11月18日 17:12:31',
          startTime: '2022年11月18日 17:12:31',
          content: [0, 1, 2, 3],
          btn: '0'
        },
        state: ['文本内容', '【图片】', '【链接】', '【小程序】'],
        btnState: [
          {
            txt: '正在进行',
            color: '#004dcc'
          },
          {
            txt: '已完成',
            color: '#009e69'
          },
          {
            txt: '任务待开始',
            color: '#df742c'
          },
          {
            txt: '创建失败',
            color: '#d64854'
          }
        ]
      },
      table: {
        tab: 0,
        tabArr: ['未执行', '已执行', '无法执行'],
        columns: {
          0: [],
          1: [],
          2: []
        },
        tableData: [],
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
    }
  },
  methods: {
    setTab (e) {
      this.table.tab = e
    },
    exportsElxe () {},
    onSelectChange (e) {
      this.table.rowSelection = e
    },
    handleTableChange ({ current }) {
      this.pagination.pageSize = arguments[0].pageSize
      this.pagination.current = current
      this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
.A_page {
  width: 100%;
  .A_card {
    width: 100%;
    .A_header {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 0;
      border-bottom: 1px solid #ccc;
      .A_info_box {
        display: flex;
        align-items: center;
        font-size: 14px;
        text-align: left;
        font-family: '微软雅黑', sans-serif;
        font-weight: 400;
        margin-bottom: 20px;
        .info_title {
          margin-left: 50px;
          white-space: nowrap;
        }
        .info_content {
          flex-shrink: 1;
          white-space: nowrap;
        }
        .btn_box {
          margin-left: 10px;
          padding: 2px 10px;
          border-radius: 5px;
          min-width: 75px;
          height: 35px;
          color: #fff;
        }
        .btn {
          margin-left: 20px;
          cursor: pointer;
          color: #3470ff;
        }
      }
    }
    .A_table_box {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 50px;
      .A_tab_box {
        display: flex;
        align-items: center;
        .A_tab {
          text-align: center;
          line-height: 48px;
          width: 88px;
          height: 48px;
          cursor: pointer;
        }
        .button {
          margin-left: auto;
        }
      }
    }
  }
}
</style>
