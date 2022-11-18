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
            :tree-data="gData"
            @expand="onExpand">
            <template slot="title" slot-scope="{ title }">
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
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
            <a-breadcrumb-item href="">
              <span>一级分类</span>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
              二级分类
            </a-breadcrumb-item>
          </a-breadcrumb>
          <p>修改人：李航</p>
          <p>修改时间：2022-22-22</p>
          <p class="txt">
            <span>分类药品推荐:</span>
            <a-textarea v-model="value" placeholder="Controlled autosize" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </p>
          <a-button type="primary">保存</a-button>
        </div>
      </a-col>
      <!--end detail-->

    </a-row>
  </div>
</template>

<script>
// import moment from 'moment'
import ActorDetail from './combinedDetail.vue'
// import { relList, userRelExport } from '@/api/actor'
// import { deepClone } from '@/utils/util'
// import { callDownLoadByBlob } from '@/utils/downloadUtil'
const x = 3
const y = 2
const z = 1
const gData = []

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0'
  const tns = _tns || gData

  const children = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({ title: key, key, scopedSlots: { title: 'title' } })
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateData(level, key, tns[index].children)
  })
}
generateData(z)

const dataList = []
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: key })
    if (node.children) {
      generateList(node.children)
    }
  }
}
generateList(gData)

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
export default {
  components: {
    ActorDetail
  },
  data () {
    return {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData
    }
  },
  created () {
    this.initFn()
  },
  methods: {
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange (e) {
      const value = e.target.value
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.disease {
  .breadcrumb{
    margin-bottom:20px;
    border-bottom:1px solid #eee;
    padding-bottom:10px;
  }
  .box {
    height:100%;
    border: 1px solid #eee;
    padding: 20px;
    box-sizing: border-box;
    height: calc(100vh - 250px);
    .txt{
      span{
        display:block;
        margin-bottom:10px;
      }
    }
  }
}
</style>
