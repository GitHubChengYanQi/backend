<template>
  <div class="disease">
    <a-row :gutter="20">

      <!--tree-->
      <a-col :span="6">
        <div class="box">
          <a-input-search style="margin-bottom: 8px" placeholder="请输入分组名称" @change="onChange" />
          <a-tree
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :blockNode="true"
            :selectedKeys="selectedKeys"
            @select="handleSelect"
            :tree-data="policiesAndRegulationss"
            @expand="onExpand">
            <template slot="custom" slot-scope="item">
              <span v-if="item.title.indexOf(searchValue) > -1" >
                {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ item.title }}</span>
              <div class="iconBox">
                <a-dropdown>
                  <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                    <a-icon type="setting" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item v-if="(item.level === 0 || item.level === 1)">
                      <a href="javascript:;" @click="handleClick('add', item)">新建子分类</a>
                    </a-menu-item>
                    <a-menu-item v-if="(item.level === 1 || item.level === 2)">
                      <a href="javascript:;" @click="handleClick('edit', item)">修改分类</a>
                    </a-menu-item>
                    <a-menu-item v-if="(item.level === 1 || item.level === 2)">
                      <a href="javascript:;" @click="handleClick('del', item)">删除分类</a>
                    </a-menu-item>
                    <a-menu-item v-if="(item.level === 1 || item.level === 2)">
                      <a href="javascript:;" @click="handleClick('up', item)">向上移动</a>
                    </a-menu-item>
                    <a-menu-item v-if="(item.level === 1 || item.level === 2)">
                      <a href="javascript:;" @click="handleClick('down', item)">向下移动</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </template>
          </a-tree>
        </div>
      </a-col>
      <!--end tree-->

      <!--detail-->
      <a-col :span="18">
        <div class="box" v-if="show">
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item href="">
              <a-icon type="home" />
            </a-breadcrumb-item>
            <a-breadcrumb-item v-for="(item,index) in info.path" :key="index">
              {{ item }}
            </a-breadcrumb-item>
          </a-breadcrumb>
          <p>修改人：{{ info.updateBy }}</p>
          <p>修改时间：{{ info.updateAt }}</p>
          <p class="txt">
            <span>分类药品推荐:</span>
            <span class="tip">{{ `${info.salesGuidance.length}/200` }}</span>
            <a-textarea v-model="info.salesGuidance" :max-length="200" placeholder="限制200个字" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </p>
          <a-button type="primary" @click="handleSave">保存</a-button>
        </div>
      </a-col>
      <!--end detail-->

    </a-row>

    <!-- modal -->
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        ref="ruleForm"
        v-if="visible"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="name" label="分类名称" prop="name">
          <a-input v-model="form.name" :max-length="15" :suffix="`${form.name ? form.name.length : 0}/15`" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- end modal -->
  </div>
</template>

<script>
import ActorDetail from './combinedDetail.vue'
import { treeList, treeSave, treeModify, treeDelete, searchSalesGuidance, modifySalesGuidance, moveUp, moveDown } from '@/api/mall'

export default {
  components: {
    ActorDetail
  },
  data () {
    return {
      show: false, // 是否显示右侧详情
      type: '', // 选中树操作类型 add,edit,del,up,down
      cur: '', // 选中树数据
      selectedKeys: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      title: '',
      visible: false,
      form: {
        name: ''
      },
      info: {
        id: '',
        person: '',
        time: '',
        salesGuidance: ''
      },
      dataList: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      policiesAndRegulationss: [], // 树
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /**
     * 获取类别树
     */
    getList () {
      treeList().then(res => {
        this.policiesAndRegulationss = [res.data]
        this.generateList(this.policiesAndRegulationss)
      })
    },
    /**
     * 点击树
     * @param {*} key
     * @param {*} data
     */
    handleSelect (key, data) {
      if (key.length > 0) {
        this.selectedKeys = key
        const node = data.selectedNodes[0].data.props
        if (node.leaf === '1') {
          const param = {
            id: key[0]
          }
          searchSalesGuidance(param).then(res => {
            this.show = true
            this.info = { id: key[0], ...res.data }
          })
        } else {
          this.show = false
        }
      }
    },
    /**
     * 树操作
     * @param {*} type
     * @param {*} data
     */
    handleClick (type, data) {
      this.type = type
      this.cur = data
      this.title = ''
      this.form = {}
      if (type === 'add') {
        this.title = '新增分类'
        this.visible = true
      }
      if (type === 'edit') {
        this.form.name = data.name
        this.title = '编辑分类'
        this.visible = true
      }
      if (type === 'del') {
        const _this = this
        this.$confirm({
          title: '提示',
          content: '确认后将会删除该分类，是否删除？',
          okText: '删除',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            _this.loading = true
            const param = {
              id: data.id
            }
            treeDelete(param).then(res => {
              _this.loading = false
              _this.$message.success('删除成功')
              _this.getList()
            })
          }
        })
      }
      if (type === 'up') {
        const param = {
          id: data.id
        }
        moveUp(param).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      }
      if (type === 'down') {
        const param = {
          id: data.id
        }
        moveDown(param).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      }
    },
    /**
     * 初始化树
     * @param {*} arr
     */
    generateList (arr) {
      const data = arr
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        node.key = node.id
        node.title = node.name
        node.scopedSlots = {
          title: 'custom'
        }
        const key = node.key
        const title = node.title
        this.dataList.push({ key, title })
        if (node.children) {
          this.generateList(node.children)
        }
      }
    },
    /**
     * 获取父级id
     * @param {*} key
     * @param {*} tree
     */
    getParentKey (key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    /**
     * 展开
     * @param {*} expandedKeys
     */
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    /**
     * 树查询
     * @param {*} e
     */
    onChange (e) {
      const value = e.target.value
      const dataList = this.dataList
      const expandedKeys = dataList.map(item => {
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.key, this.policiesAndRegulationss)
        }
        return null
      })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    /**
     * 确定
     */
    handleOk () {
      if (this.type === 'add') {
        const param = {
          name: this.form.name,
          parentId: this.cur.id
        }
        treeSave(param).then(res => {
          this.getList()
          this.visible = false
        })
      }
      if (this.type === 'edit') {
        const param = {
          name: this.form.name,
          id: this.cur.id
        }
        treeModify(param).then(res => {
          this.getList()
          this.visible = false
        })
      }
    },
    /**
     * 取消
     */
    handleCancel () {
      this.visible = false
    },
    /**
     * 保存销售指导
     */
    handleSave () {
      const param = {
        id: this.info.id,
        salesGuidance: this.info.salesGuidance
      }
      modifySalesGuidance(param).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.disease {
  .breadcrumb {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  .box {
    height: 100%;
    border: 1px solid #eee;
    padding: 20px;
    box-sizing: border-box;
    height: calc(100vh - 250px);
    overflow: auto;

    .txt {
      position: relative;
      span {
        display: block;
        margin-bottom: 10px;
      }
      .tip{
        position: absolute;
        bottom:-5px;
        right:10px;
        z-index: 99;
      }
    }
  }
  .iconBox{
    float:right;
    display:none;
    i{
      margin-left:10px;
    }
  }
  /deep/ .ant-tree-node-selected{
    .iconBox{
      display:block;
    }
  }
  /deep/ .ant-tree-title{
    display:flex;
    span:first-child{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex:1;
    }
  }
}
</style>
