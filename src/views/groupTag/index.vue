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
    <div class="A_right_box"></div>
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
      selectKey: []
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
  }
}
</style>
