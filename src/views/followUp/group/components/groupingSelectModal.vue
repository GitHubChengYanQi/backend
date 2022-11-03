<template>
  <div>
    <a-modal v-model="visible" :title="title" @ok="handleOk" :width="400" :destroyOnClose="true">
      <a-input-search placeholder="输入分组名称" v-model="searchVal" @search="onSearch" @change="onSearch" />
      <div class="demo-infinite-container">
        <template v-if="type == 2">
          <a-radio-group v-model="currentId" style="width: 100%">
            <a-spin :spinning="loading">
              <a-list :data-source="list">
                <a-list-item slot="renderItem" slot-scope="item" v-if="!(type != 3 && item.categoryId === 0)">
                  <a-list-item-meta :description="item.name"></a-list-item-meta>
                  <div>
                    <a-radio :value="item.categoryId"> </a-radio>
                  </div>
                </a-list-item>
              </a-list>
            </a-spin>
          </a-radio-group>
        </template>
        <template v-else-if="type == 1">
          <a-checkbox-group v-model="idList" style="width: 100%">
            <a-spin :spinning="loading">
              <a-list :data-source="list">
                <a-list-item slot="renderItem" slot-scope="item" v-if="item.categoryId != 0">
                  <a-list-item-meta :description="item.name"></a-list-item-meta>
                  <div>
                    <a-checkbox :value="item.bindId" v-if="type == 3"> </a-checkbox>
                    <a-checkbox :value="item.categoryId" v-else></a-checkbox>
                  </div>
                </a-list-item>
              </a-list>
            </a-spin>
          </a-checkbox-group>
        </template>
        <template v-else-if="type == 3">
          <a-checkbox-group v-model="idList" style="width: 100%">
            <a-spin :spinning="loading">
              <a-list :data-source="listCom">
                <a-list-item slot="renderItem" slot-scope="item" v-if="item.categoryId != 0">
                  <a-list-item-meta :description="item.name"></a-list-item-meta>
                  <div>
                    <a-checkbox :value="item.bindId" v-if="type == 3"> </a-checkbox>
                    <a-checkbox :value="item.categoryId" v-else></a-checkbox>
                  </div>
                </a-list-item>
              </a-list>
            </a-spin>
          </a-checkbox-group>
        </template>
        <Empty v-if="list.length == 0" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { categoryList, categoryBindAdd, categoryBindTransfer, categoryBindDelete } from '@/api/healthManage'
export default {
  data () {
    return {
      currentId: '', // ID
      idList: [],
      list: [], // 列表
      visible: false,
      searchVal: '', // 搜索内容
      title: '添加患者分组',
      id: '',
      type: '',
      obj: {},
      loading: false
    }
  },
  computed: {
    listCom () {
      if (!this.searchVal) return this.list
      return this.list.filter(ele => {
        return ele.name.includes(this.searchVal)
      })
    }
  },
  methods: {
    open (type, obj, list) {
      if (type == 1) {
        this.title = '添加患者分组'
      }
      if (type == 2) {
        this.title = '移动患者分组'
      }
      if (type == 3) {
        this.list = list
        this.title = '删除患者分组'
      }
      this.currentId = ''
      this.searchVal = ''
      this.idList = []
      this.type = type
      this.obj = obj
      this.visible = true
      if (type != 3) {
        this.getCategoryList()
      }
    },
    // 搜索
    onSearch () {
      if (this.type != 3) {
        this.getCategoryList()
      }
    },
    // 列表
    async getCategoryList () {
      this.loading = true
      const data = await categoryList({ name: this.searchVal, contactId: this.obj.id || this.obj.contactId })
      if (data.data.code == 200) {
        this.list = data.data.data
      }
      console.log(this.list, 'this.list')
      this.loading = false
    },
    // 确定
    async handleOk () {
      if (this.type == 2 && (!this.currentId || this.currentId === '')) {
        this.$message.error('请选择分组')
        return
      }
      if (this.type != 2 && !this.idList.length) {
        this.$message.error('请选择分组')
        return
      }
      let data
      this.visible = false
      if (this.type == 1) {
        data = await categoryBindAdd({ categoryIds: this.idList, contactId: this.obj.id || this.obj.contactId })
      } else if (this.type == 2) {
        data = await categoryBindTransfer({
          categoryId: this.currentId,
          contactId: this.obj.contactId,
          bindId: this.obj.bindId,
          toCategoryId: this.currentId
        })
      } else {
        data = await categoryBindDelete({ bindIds: this.idList })
      }
      if (data.code == 200) {
        this.$message.success('操作成功')
        this.$emit('updateList')
        return
      }
      this.$message.success('操作失败')
    }
  }
}
</script>

<style lang="less">
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 330px;
  margin-top: 20px;
}
</style>
