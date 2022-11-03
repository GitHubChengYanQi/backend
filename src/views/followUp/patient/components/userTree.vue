<template>
  <div>
    <a-modal :visible="visible" title="选择成员" @ok="handleOk" :width="800" @cancel="visible = false">
      <a-spin :spinning="loading">
        <div class="content">
          <div class="l">
            <a-checkbox-group v-model="userList">
              <TreeItem :currentData="item" v-for="item in treeData" v-if="treeData.length" :key="item.id" />
            </a-checkbox-group>
          </div>
          <div class="r">
            <div class="tree-user-content flex-row-center" v-for="(item,index) in userList" :key="item.id">
              <div class="flex-row-center">
                <img class="ree-user-head" :src="item.icon" alt="">
                <span>{{ item.title }}</span>
              </div>
              <img class="delItem" :src="require('@/assets/healthManage/u2050.png')" alt="" @click="delItem(index)">
            </div>
          </div>
        </div>
      </a-spin>

    </a-modal>
  </div>
</template>

<script>
import { workDepartmentDepartmentEmp } from '@/api/healthManage'
import TreeItem from './treeComponents/item.vue'
export default {
  name: 'UserTree',
  components: {
    TreeItem
  },
  data () {
    return {
      visible: false,
      treeData: [],
      userList: [],
      loading: false
    }
  },
  mounted () {
    this.getUserTree()
  },
  methods: {
    open () {
      this.visible = true
    },
    async getUserTree () {
      this.loading = true
      const { data } = await workDepartmentDepartmentEmp()
      console.log(data, 'data....')
      this.treeData = data
      this.loading = false
      this.treeData.forEach(v => {
        v.down = true
      })
    },
    delItem (index) {
      this.userList.splice(index, 1)
    },
    handleOk () {
      // let arr = []
      // this.userList.forEach(ele=>{
      //   arr.push(ele.id)
      // })
      this.$emit('setUserIds', this.userList)
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: row;
  height: 490px;

  .l {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding: 15px 0;
  }

  .r {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding: 0 15px;

    .flex-row-center {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .tree-user-content {
      height: 50px;
      width: 100%;
      border-bottom: 1px solid #f2f2f2;
      justify-content: space-between;
      .delItem{
        width: 25px;
        height: 25px;
      }
    }

    .ree-user-head {
      height: 30px;
      width: 30px;
      margin-right: 10px;
    }
  }
}
</style>
