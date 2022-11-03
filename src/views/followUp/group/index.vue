'<template>
  <a-card>
    <div class="wrapper">
      <div class="fl">
        <a-button type="primary" icon="plus" style="width: 100%" @click="open('add')" v-permission="'/category/add#post'"> 新建分组 </a-button>
        <ul>
          <li
            :class="{ active: item.categoryId === currentId }"
            v-for="item in categoryArr"
            :key="item.categoryId"
            @click="itemCli(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="fr">
        <template v-if="currentId !== ''">
          <div class="head">
            <h2>分组基本信息</h2>
            <p>组名：{{ currentItem.name }}</p>
            <p>描述：{{ currentItem.description }}</p>
            <div class="handle" v-if="currentId != 0">
              <Space>
                <a-button type="primary" ghost @click="open('edit')" v-permission="'/category/edit#post'">编辑分组</a-button>
                <a-button type="primary" ghost @click="delItem" v-permission="'/category/delete#post'">解散分组</a-button>
              </Space>
            </div>
          </div>
          <div class="body">
            <h2>组内成员</h2>
            <Table ref="currentTable" />
          </div>
        </template>
        <Empty v-else description="请选择分组" />
      </div>
    </div>
    <GroupingModal ref="groupingModal" @updateList="getCategoryList" />
  </a-card>
</template>

<script>
import Table from './components/table'
import GroupingModal from './components/groupingModal'
import { categoryList, categoryDelete } from '@/api/healthManage'
import { Space, Empty } from 'ant-design-vue'

export default {
  components: {
    Table,
    GroupingModal,
    Space,
    Empty
  },
  data () {
    return {
      nav: [
        {
          id: 1,
          name: '未分组'
        }
      ],
      categoryArr: [],
      currentId: 0,
      currentItem: {}
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    // 查询分组列表
    async getCategoryList () {
      const { data: { data } } = await categoryList()
      this.categoryArr = data
      if (this.currentId !== '') {
        this.categoryArr.forEach(element => {
          if (element.categoryId == this.currentId) {
            this.currentItem = element
            this.$nextTick(() => {
              this.$refs.currentTable.initFn(element.categoryId)
            })
          }
        })
      }
    },
    itemCli (item) {
      this.currentId = item.categoryId
      this.currentItem = item
      this.$nextTick(() => {
        this.$refs.currentTable.initFn(item.categoryId)
      })
    },
    open (type) {
      this.$refs.groupingModal.open(type, this.currentItem)
    },
    /**
     * 删除操作
     */
    delItem () {
      const _self = this
      this.$confirm({
        content: '确定要解散该分组嘛？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const { code } = await categoryDelete({ categoryId: this.currentId })
          if (code == 200) {
            _self.$message.success('操作成功')
            _self.currentId = ''
            _self.getCategoryList()
          } else {
            _self.$message.error('操作失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  display: flex;

  .fl {
    width: 200px;
    margin-right: 20px;
    border: 1px solid#e8e8e8;
    padding: 15px;
    border-radius: 5px;

    ul {
      margin-top: 20px;
      padding: 0;
      height: 707px;
      max-height: 707px;
      overflow-y: auto;
      li {
        width: 100%;
        height: 53px;
        line-height: 53px;
        text-align: center;
        border: 1px solid rgba(170, 170, 170, 1);
        border-radius: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all; /*允许在单词内换行,防止有字母时候出问题*/
        display: -webkit-box; /*将对象作为弹性伸缩盒子模型显示*/
        -webkit-line-clamp: 1; /*多行在这里修改数字即可*/
        -webkit-box-orient: vertical; /*从上到下垂直排列子元素*/
      }
      .active {
        background: rgb(2, 167, 240);
        color: #fff;
      }
    }
  }

  .fr {
    flex: 1;
    border: 1px solid#e8e8e8;
    padding: 15px;
    border-radius: 5px;
  }
}
</style>
