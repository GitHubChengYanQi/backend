<template>
  <div class="A_page">
    <div class="A_left_box">
      <a-input-search
        v-model="search"
        @search="getGroup"
        style="margin-bottom: 8px"
        placeholder="请输入分组名称"
      />
      <a-tree
        :treeData="groupData"
        :defaultExpandAll="true"
        @select="getGroups"
      >
        <template
          slot="custom"
          slot-scope="item"
        >
          <div class="tree-view-item">
            <span class="tree-view-left">{{ item.title }}</span>
            <span
              class="tree-view-right"
              v-if="selectKey.includes(item.key)"
            >
              <a-dropdown
                :trigger="['click']"
                placement="bottomLeft"
              >
                <img
                  @click.stop
                  class="icon"
                  :src="require('@/assets/set.png')"
                  alt=""
                />
                <template #overlay>
                  <a-menu>
                    <a-menu-item style="border-bottom:1px solid #ccc;">
                      <div
                        class="down_select"
                        @click="exportsElxe(2)"
                      >导出当前页</div>
                    </a-menu-item>
                    <a-menu-item>
                      <div
                        class="down_select"
                        @click="exportsElxe(1)"
                      >导出所有</div>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </span>
          </div>
        </template>
      </a-tree>
    </div>
    <div class="A_right_box">

      <div class="A_content_box">
        <div class="A_header_box">
          <div
            class="title"
            :style="index + 1 != titleData.length ? {color:'#ccc'}:{}"
            v-for="(item,index) in titleData"
            :key="index"
          >
            <span class="icon">
              <img
                class="img"
                :src=" index == 0 ? require('@/assets/branch_start.svg') : require('@/assets/branch_icon.svg')"
                alt=""
              >
            </span>
            {{ item }}
            <span
              class="division"
              v-if="index + 1 < titleData.length"
            >></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      groupData: [
        {
          key: '99230713',
          title: '客户群标签',
          id: '1',
          // ⚠️重点这这里⚠️每一条数据上都添加scopedSlots属性
          scopedSlots: {
            title: 'custom'
          },
          children: [
            {
              key: '99230992',
              title: '华东区域',
              id: '2',
              scopedSlots: {
                title: 'custom'
              },
              children: [
                {
                  key: '99230112',
                  title: '杭州万科',
                  scopedSlots: {
                    title: 'custom'
                  },
                  children: []
                }
              ]
            },
            {
              key: '99230993',
              title: '华南区域',
              scopedSlots: {
                title: 'custom'
              },
              children: []
            },
            {
              key: '99231020',
              title: '华北区域',
              scopedSlots: {
                title: 'custom'
              },
              children: []
            }
          ]
        }
      ],
      selectKey: [],
      titleData: ['客户群标签', '二级分类', '三级分类']
    }
  },
  methods: {
    getGroup () {
      console.log(this.search)
    },
    getGroups (e) {
      this.selectKey = e
    },
    getSelect (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less" scoped>
.A_page {
  width: 100%;
  height: 100%;
  display: flex;
  .A_left_box {
    width: 230px;
    overflow: auto;
    height: 744px;
    box-sizing: border-box;
    padding: 15px 5px;
    flex-shrink: 0;
    background-color: #fff;
    border-radius: 5px;
    .tree-view-right {
      position: relative;
      margin: 0 10px 0 80px;
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .A_right_box {
    margin-left: 10px;
    flex-grow: 1;
    background-color: #fff;
    box-sizing: border-box;
    padding: 15px;
    .A_content_box {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      .A_header_box {
        box-sizing: border-box;
        padding-left: 25px;
        width: 100%;
        min-height: 45px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border-bottom: 1px solid #ccc;
        .title {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.8980392156862745);

          .icon {
            width: 14px;
            margin-right: 5px;
            position: relative;
            .img {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .division {
            color: #ccc;
            margin: 0 5px;
          }
        }
      }
    }
  }
}
</style>
