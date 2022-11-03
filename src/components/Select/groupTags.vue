<template>
  <div>
    <a-modal
      title="选择标签"
      :visible="visible"
      okText="确定"
      cancelText="取消"
      @cancel="visible = !visible"
      @ok="ok"
    >
      <loading :loading="loading" height="100%">
        <div class="list">
          <div class="item" v-for="(group,i) in tags" :key="i">
            <div class="group-title">
              {{ group.groupName }}
            </div>
            <div class="tags">
              <div class="tag" v-for="(tag,i2) in group.tags" :key="i2">
                <div
                  v-if="!active"
                  :class="{'tag-box':true, 'active': tag.select}"
                  @click="switchActive(tag)">
                  {{ tag.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </loading>
    </a-modal>
  </div>
</template>

<script>
import { getList } from '@/api/roomTag'

export default {
  data () {
    return {
      visible: false,
      tags: [],
      active: false,
      loading: false
    }
  },
  methods: {
    switchActive (data) {
      this.active = true
      data.select = !data.select
      this.active = false
    },

    ok () {
      const selectTag = []

      this.tags.forEach(group => {
        group.tags.forEach(tag => {
          if (tag.select) selectTag.push(tag)
        })
      })

      this.$emit('change', JSON.parse(JSON.stringify(selectTag)))
      this.visible = false
    },

    show (tags = []) {
      this.getData(tags)
      this.visible = true
    },

    getData (tags) {
      this.loading = true

      getList().then(res => {
        this.tags = res.data.list
        this.tags.forEach(group => {
          group.tags.forEach(tag2 => {
            tag2.select = false
          })
        })

        tags.forEach(tag => {
          this.tags.forEach(group => {
            group.tags.forEach(tag2 => {
              if (tag.id === tag2.id) {
                tag2.select = true
              }
            })
          })
        })

        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-modal-body {
  min-height: 300px;
  overflow: auto;
  max-height: 600px;
}

/deep/ .ant-tag-checkable {
  padding: 3px 17px;
  background: #f4f4f4;
  color: #727272;
  cursor: pointer;
}

/deep/ .ant-tag-checkable-checked {
  background: #158fff1a;
  color: #1890ff;
  border: 1px solid #1890ff;
}

.group-title {
  margin-bottom: 4px;
  font-size: 13px;
}

.item {
  margin-bottom: 16px;
}

.tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .tag {
    margin-bottom: 6px;
  }
}

.tag-box {
  padding: 4px 17px;
  background: #f4f4f4;
  color: #727272;
  cursor: pointer;
  font-size: 12px;
  margin-right: 10px;
  border-radius: 3px;

  &:hover {
    color: #4f4f4f;
  }
}

.active {
  background: #158fff1a;
  color: #1890ff;
  border: 1px solid #1890ff;
}

.loading {
  height: auto!important;
}
</style>
