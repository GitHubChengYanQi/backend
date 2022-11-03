<template>
  <div class="box">
    <div class="flex-between mb16">
      <a-button type="primary" @click="$refs.add.$show()" v-permission="'/workContactTag/index@addGroup'">添加标签组</a-button>
      <a-button type="primary" ghost @click="sync" v-permission="'/workContactTag/index@sync'">同步企微标签</a-button>
    </div>
    <div class="card">
      <div class="f-sub">
        共{{ total }}个标签
      </div>
      <a-divider/>

      <div class="list">
        <div class="item flex-between" v-for="(v,i) in list" :key="v.id">
          <div class="left flex">
            <div class="name">
              <div class="f-sub mb8">
                {{ v.groupName }}
              </div>
              <div class="count">
                共{{ v.tags.length }}个标签
              </div>
            </div>
            <div>
              <div class="status mb12">
                可见范围：全部
              </div>
              <div class="tags flex">
                <a-button
                  icon="plus"
                  class="small-btn mr8 mb10"
                  v-permission="'/workContactTag/index@add'"
                  @click="switchAdd(v, $event)"
                >
                  添加
                </a-button>
                <a-input
                  placeholder="输入后回车"
                  class="mr16 mb10 tag-input"
                  v-if="v.add"
                  :ref="`addInput${v.id}`"
                  @keyup.enter.native="addTag(v,$event)"
                />

                <a-tag v-for="tag in v.tags" :key="tag.id">
                  {{ tag.name }}
                </a-tag>
              </div>
            </div>
          </div>
          <div class="right flex">
            <div class="flex" @click="up(i)" v-permission="'/workContactTag/index@move'">
              <a-icon type="up-circle" class="mr3"/>
              上移
            </div>
            <a-divider type="vertical"/>
            <div class="flex" @click="down(i)" v-permission="'/workContactTag/index@move'">
              <a-icon type="down-circle" class="mr3"/>
              下移
            </div>
            <a-divider type="vertical"/>
            <div class="flex" @click="$refs.add.$show(v)" v-permission="'/workContactTag/index@editGroup'">
              <a-icon type="form" class="mr3"/>
              编辑
            </div>
          </div>
        </div>
      </div>
    </div>

    <add ref="add" @change="getData"/>
  </div>
</template>

<script>
import add from './components/add'
import { getContactTagGroup, addContactTag, syncTag, moveContactTag } from '@/api/workContactTag'

export default {
  data () {
    return {
      list: [],
      total: '...',
      loading: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    up (i) {
      if (i === 0) {
        this.$message.error('不能在上了')
        return false
      }
      this.loading = true
      moveContactTag({
        groupId: this.list[i].groupId,
        towards: 'up'
      }).then(res => {
        this.loading = false
        this.getData()
      })
    },

    down (i) {
      if (i + 1 === this.list.length) {
        this.$message.error('不能在下了')
        return false
      }
      this.loading = true
      moveContactTag({
        groupId: this.list[i].groupId,
        towards: 'down'
      }).then(res => {
        this.loading = false
        this.getData()
      })
    },

    sync () {
      this.loading = true
      syncTag().then(() => {
        this.getData()
        this.loading = false
        this.$message.success('发送同步请求成功')
      })
    },

    addTag (data, e) {
      data.add = false
      // this.$forceUpdate()
      // this.loading = true
      addContactTag({
        groupId: data.groupId,
        tag: {
          'name': e.target.value,
          'order': data.tags[0].order + 1
        }
      }).then(() => {
        // this.loading = false
        this.getData(false)
      })
    },

    switchAdd (data, e) {
      data.add = !data.add

      this.$forceUpdate()

      if (data.add) {
        setTimeout(_ => {
          e.path[1].querySelector('.ant-input').focus()
        }, 50)
      }
    },

    getData (loading = true) {
      if (loading) this.loading = true
      getContactTagGroup().then(res => {
        this.total = res.data.total
        this.list = res.data.tagGroupList
        this.loading = false
      })
    }
  },
  components: { add }
}
</script>

<style lang="less" scoped>
.status {
  font-size: 14px;
  color: rgba(0, 0, 0, .85);
}

.list {
  .name {
    min-width: 200px;
  }

  .item {
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px dashed #e8e8e8;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
  }
}

.right {
  min-width: 190px;

  .flex {
    cursor: pointer;
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
  }

  .ant-divider {
    margin: 0 10px;
  }
}

.tag-input {
  width: 120px;
  height: 30px;
}

.tags {
  flex-wrap: wrap;

  .ant-tag {
    margin-bottom: 10px;
  }
}
</style>
