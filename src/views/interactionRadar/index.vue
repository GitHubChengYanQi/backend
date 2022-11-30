<template>
  <div class="a_page">
    <a-card class="a_card">
      <div class="a_content">
        <div class="a_catalog">
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
              :style="catalogIndex == index ? {backgroundColor:'rgba(129, 211, 248, 1)'}:{}"
              v-for="(item,index) in catalog"
              @click="()=>{
                catalogIndex = index
              }"
              :key="index"
            >
              <span class="title">{{ item }}</span>
              <span v-if="catalogIndex == index && index != 0">
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
                          @click="setGroup(1,index)"
                        >修改分组</div>
                      </a-menu-item>
                      <a-menu-item>
                        <div
                          class="down_select"
                          @click="setGroup(2,index)"
                        >删除分组</div>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </span>
            </div>
          </div>
        </div>
        <div class="a_table_box">
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
              <span class="txt">共{{ 4 }}个雷达链接</span>
              <span class="button_box">
                <a-button
                  type="primary"
                  class="button"
                  @click="getSearch"
                >批量修改分组</a-button>
                <a-button
                  type="primary"
                  class="button"
                  @click="getSearch"
                >批量删除</a-button>
                <a-button
                  type="primary"
                  class="button"
                  @click="goPage(0)"
                >新建雷达连接</a-button>
              </span>
            </div>
            <div class="table_box">

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
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'
import { callDownLoadByBlob } from '@/utils/downloadUtil'

export default {
  data () {
    return {
      catalog: ['默认分组', '123'],
      catalogIndex: -1,
      modalTitle: '新建分组',
      modalState: false,
      catalogName: '',
      amendId: -1,
      searchData: {
        searchInput: [
          {
            title: '创建时间：',
            type: 'date',
            key: 'date'
          },
          {
            title: '类型：',
            type: 'select',
            selectKey: 'type',
            key: 'type'
          },
          {
            title: '链接标题：',
            type: 'input',
            placeholder: '请输入要搜索的链接标题',
            key: 'title'
          }
        ],
        data: {
          date: [],
          type: '0',
          title: ''
        }
      },
      selectArr: {
        type: []
      }
    }
  },
  created () {
    this.getSelect('radar_type', 'type')
  },
  methods: {
    goPage (e, item = {}) {
      console.log(e, item)
    },
    getSearch () {},
    reset () {
      this.searchData.data = {
        date: [],
        type: '0',
        title: ''
      }
    },
    exportsElxe () {
      callDownLoadByBlob()
    },
    setCatalog () {
      console.log(this.catalogName)
      if (this.amendId != -1) {
        this.catalog = this.catalog.map((item, index) => {
          if (index == this.amendId) {
            item = this.catalogName
          }
          return item
        })
      } else {
        this.catalog = [...this.catalog, this.catalogName]
      }
      this.modalState = false
      this.catalogName = ''
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
        this.amendId = item
      } else {
        this.$confirm({
          title: '提示',
          content: '是否确认删除当前分组？删除后该分组下素材移动到默认分组中，该操作不可撤销，请谨慎操作。',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {},
          onCancel () {}
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.a_page {
  width: 100%;
  .a_card {
    width: 100%;
    min-width: 870px;

    .a_content {
      min-width: 870px;
      width: 100%;
      display: flex;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
      color: #333333;
      .a_catalog {
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
          }
        }
      }
      .a_table_box {
        flex-grow: 1;
        box-sizing: border-box;
        padding: 5px 10px;
        min-width: 650px;
        flex-shrink: 0;
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
          margin-top: 25px;
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
        }
      }
    }
  }
}
.model_input_box {
  display: flex;
  align-items: center;
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
</style>
