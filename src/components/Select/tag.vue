<template>
  <div>
    <a-modal
      title="选择标签"
      :visible="visible"
      okText="确定"
      cancelText="取消"
      @cancel="visible = !visible,serchValue = ''"
      @ok="ok"
    >
      <loading :loading="loading" height="100%">
        <div v-if="serch">
          <div class="screen">
            筛选条件：
            <a-radio-group size="small" v-model="screenValue">
              <a-radio :value="0">
                以下标签满足其中之一
              </a-radio>
              <a-radio :value="1">
                以下标签同时满足
              </a-radio>
              <a-radio :value="2">
                无任何标签
              </a-radio>
            </a-radio-group>
          </div>
          <div class="serch" v-if="screenValue != 2">
            <a-input placeholder="请输入要查找的标签" v-model="searchTxt">
              <a-icon slot="suffix" type="search" @click="searchFn" />
            </a-input>
          </div>
        </div>

        <div v-if="screenValue != 2">
          <div class="list" v-if="!serchValue">
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
          <div class="list" v-else>
            <div v-if="serchTags.length > 0">
              <div class="item" v-for="(group,i) in serchTags" :key="i">
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
            <div class="empty" v-else>
              <img src="../../assets/group-manage_search-empty.svg" alt="">
              没有搜到相关标签哦~
            </div>
          </div>
        </div>

        <div v-else style="margin-top: 15px;color:#8c8c8c">选择无任何标签后，将筛选出没有被打上过任何标签的客户～</div>
      </loading>
    </a-modal>
  </div>
</template>

<script>
import { clientTagsReceive } from '@/api/roomClockIn'

export default {
  data () {
    return {
      visible: false,
      tags: [],
      serchTags: [],
      active: false,
      loading: false,
      screenValue: 0,
      serchValue: '',
      searchTxt: '',
      serch: false
    }
  },
  methods: {
    switchActive (data) {
      this.active = true
      data.select = !data.select
      this.active = false
    },
    getUnique (array) {
      const obj = {}
      return array.filter((item, index) => {
        // 防止key重复
        const newItem = item + JSON.stringify(item)
        const arr = Object.prototype.hasOwnProperty.call(obj, newItem) ? false : obj[newItem] = true
        return arr
      })
    },
    ok () {
      const selectTag = []

      this.tags.forEach(group => {
        group.tags.forEach(tag => {
          this.serchValue = ''
          if (tag.select) selectTag.push(tag)
        })
      })

      if (this.serch) {
        var tags = {
          type: this.screenValue + 1,
          tagIds: selectTag
        }
        if (this.serchValue) {
          const selectTags = []

          this.serchTags.forEach(group => {
            group.tags.forEach(tag => {
              if (tag.select) selectTags.push(tag)
            })
          })
          var data = selectTags.concat(selectTag)
          tags.tagIds = this.getUnique(data)
        }
        if (tags.type == 3) {
          tags.tagIds = []
        }
        this.$emit('change', JSON.parse(JSON.stringify(tags)))
      } else {
        this.$emit('change', JSON.parse(JSON.stringify(selectTag)))
      }
      this.visible = false
    },

    show (tags = [], serch) {
      this.serch = serch
      if (serch) {
        this.getData(tags.tagIds ? tags.tagIds : [])
      } else {
        this.getData(tags)
      }
      this.visible = true
    },

    getData (tags) {
      this.loading = true

      clientTagsReceive().then(res => {
        this.tags = res.data

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
    },
    change () {
      if (this.tagShowData.length === 0) this.selectTag = []
    },

    delChange (e, e2) {
      this.selectTag.deleteObj('name', e)
    },

    selectTagChange (e) {
      if (!this.screentags) {
        this.selectShowData = e

        const names = e.map(v => {
          return v.name
        })

        this.tagShowData = names
        this.selectTag = e
      } else {
        this.selectShowData = e.tagIds

        const names = e.tagIds.map(v => {
          return v.name
        })

        this.tagShowData = names
        this.selectTag = e
      }
    },
    searchFn () {
      this.serchValue = this.searchTxt
    }
  },
  watch: {
    serchValue () {
      // this.tags.forEach(i => {
      //   i.tags.forEach(v => {
      //     v.select = false
      //   })
      // })
      var result = this.tags.map((i, s) => {
        return {
          'id': i.id,
          'wxGroupId': i.wxGroupId,
          'groupName': i.groupName,
          'tags': i.tags.filter(v => {
            if (v.name.indexOf(this.serchValue) != -1) {
              return v
            }
          })
        }
      })

      var resultTags = result.filter((i, v) => {
        if (i.tags.length > 0) {
          return i
        }
      })
      this.serchTags = resultTags
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-modal-body {
  height: 600px;
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

.screen{
  white-space: nowrap;
  /deep/.ant-radio-wrapper{
    font-size: 12px;
  }
}
.empty{
  img{
    width: 167px;
    margin-bottom: 16px;
  }
  color: rgba(0,0,0,.65);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
}
.serch{
  margin: 15px 0;
}
</style>
