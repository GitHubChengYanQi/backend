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
        <div class="list" style="display: flex;">
          <div class="tags">
            <div class="labeladdBtn" @click="add = true">
              <a-icon type="plus"/>
              添加
            </div>
            <a-input
              class="lable_input"
              v-model="addlableCont"
              placeholder="输入后回车"
              v-if="add"
              @blur="closeInput"
              @pressEnter="inputLable"
            ></a-input>
            <div class="tag" v-for="(tag,i2) in tags" :key="i2">
              <div
                v-if="!active"
                :class="{'tag-box':true, 'active': tag.select}"
                @click="switchActive(tag)">
                {{ tag.name }}
              </div>
            </div>
          </div>

        </div>
      </loading>
    </a-modal>
  </div>
</template>

<script>
import { contactEmployeeTag, contactEmployeeTagStore } from '@/api/workContact'

export default {
  data () {
    return {
      visible: false,
      tags: [],
      active: false,
      loading: false,
      id: {},
      addlableCont: '',
      add: false
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
        if (group.select) selectTag.push(group)
      })

      this.$emit('change', JSON.parse(JSON.stringify(selectTag)))
      this.visible = false
    },

    show (id, tags = []) {
      this.id = id
      this.tagsSelect = tags
      this.getData()

      this.visible = true
    },

    getData (loading) {
      this.loading = !loading
      contactEmployeeTag(
        this.id
      ).then(res => {
        this.tags = res.data

        this.tags.forEach(group => {
          group.select = false
        })

        this.tagsSelect.forEach(tag => {
          this.tags.forEach(group => {
            if (tag.id === group.id) {
              group.select = true
            }
          })
        })

        this.loading = false
      })
    },

    closeInput () {
      this.add = false
      this.addlableCont = ''
    },
    inputLable () {
      contactEmployeeTagStore(
        { name: this.addlableCont, employeeId: this.id.employeeId }
      ).then(res => {
        this.addlableCont = ''
        this.add = false
        this.getData(true)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.labeladdBtn {
  width: 70px;
  border: 1px solid #d9d9d9;
  height: 28px;
  line-height: 28px;
  text-align: center;
  margin-right: 10px;
  font-size: 13px;
  padding: 0 5px;
  cursor: pointer;
}

.labeladdBtn i {
  font-size: 14px;
}
.lable_input {
  height: 28px;
  width: 120px;
  margin-right: 10px;
}
/deep/ .ant-modal-body {
  min-height: 300px;
  max-height: 600px;
  overflow: auto;
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
