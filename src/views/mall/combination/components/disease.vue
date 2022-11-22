<template>
  <div class="disease">
    <a-row :gutter="20">

      <!--tree-->
      <a-col :span="6">
        <div class="box">
          <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
          <a-tree
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :blockNode="true"
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
                    <a-menu-item>
                      <a href="javascript:;" @click="handleClick('add', item)">新建子分类</a>
                    </a-menu-item>
                    <a-menu-item v-if="item.level === 2 || item.level === 3">
                      <a href="javascript:;" @click="handleClick('edit', item)">修改分类</a>
                    </a-menu-item>
                    <a-menu-item v-if="item.level === 2 || item.level === 3">
                      <a href="javascript:;" @click="handleClick('del', item)">删除分类</a>
                    </a-menu-item>
                    <a-menu-item v-if="item.level === 2 || item.level === 3">
                      <a href="javascript:;" @click="handleClick('up', item)">向上移动</a>
                    </a-menu-item>
                    <a-menu-item v-if="item.level === 2 || item.level === 3">
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
        <div class="box">
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item href="">
              <a-icon type="home" />
            </a-breadcrumb-item>
            <a-breadcrumb-item v-for="(item,index) in route" :key="index">
              {{ item }}
            </a-breadcrumb-item>
          </a-breadcrumb>
          <p>修改人：{{ info.person }}</p>
          <p>修改时间：{{ info.time }}</p>
          <p class="txt">
            <span>分类药品推荐:</span>
            <a-textarea v-model="info.suggest" placeholder="Controlled autosize" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </p>
          <a-button type="primary">保存</a-button>
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
          <a-input v-model="form.name" :max-length="20" :suffix="`${form.name ? form.name.length : 0}/20`" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- end modal -->
  </div>
</template>

<script>
// import moment from 'moment'
import ActorDetail from './combinedDetail.vue'
// import { relList, userRelExport } from '@/api/actor'
// import { deepClone } from '@/utils/util'
// import { callDownLoadByBlob } from '@/utils/downloadUtil'

export default {
  components: {
    ActorDetail
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      title: '',
      visible: false,
      route: [],
      form: {
        name: ''
      },
      info: {
        person: '',
        time: '',
        suggest: ''
      },
      dataList: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      policiesAndRegulationss: [
        {
          title: 'title0-0-0',
          key: '0-0-0',
          level: 1,
          scopedSlots: {
            title: 'custom'
          },
          children: [
            {
              title: 'title0-0-0-0',
              key: '0-0-0-0',
              level: 2,
              scopedSlots: {
                title: 'custom'
              }
            }
          ]
        },
        {
          title: 'title0-0-1',
          key: '0-0-1',
          level: 1,
          scopedSlots: {
            title: 'custom'
          },
          children: [
            {
              title: 'title0-0-1-0',
              key: '0-0-1-0',
              level: 2,
              scopedSlots: {
                title: 'custom'
              }
            }
          ]
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.generateList(this.policiesAndRegulationss)
  },
  methods: {
    /**
     * 点击树
     * @param {*} key
     * @param {*} data
     */
    handleSelect (key, data) {
      console.log(11111, key, data)
    },
    /**
     * 树操作
     * @param {*} type
     * @param {*} data
     */
    handleClick (type, data) {
      // console.log(11111,type,data)
      if (type === 'add') {
        console.log(type, data)
        this.title = '新增分类'
        this.visible = true
      }
      if (type === 'edit') {
        console.log(type, data)
        this.title = '编辑分类'
        this.visible = true
      }
      if (type === 'del') {
        console.log(type, data)
      }
      if (type === 'up') {
        console.log(type, data)
      }
      if (type === 'down') {
        console.log(type, data)
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
        const key = node.key
        this.dataList.push({ key, title: key })
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
      this.visible = false
    },
    /**
     * 取消
     */
    handleCancel () {
      this.visible = false
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
      span {
        display: block;
        margin-bottom: 10px;
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
}
</style>
