<template>
  <div class="select-tag-input">
    <a-select
      mode="multiple"
      v-model="tagShowData"
      :open="false"
      :showArrow="true"
      :allowClear="true"
      placeholder="请选择标签"
      @click.native="show"
      @deselect="delChange"
      @change="change"
      :maxTagCount="1"
    />

    <SelectTag v-if="!groupOrUser" ref="selectTag" @change="selectTagChange"/>
    <selectGroupTags v-else ref="selectTag" @change="selectTagChange"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectTag: [],
      tagShowData: this.tagShowDatas
    }
  },
  props: {
    changeId: {
      type: Boolean,
      default: false
    },
    groupOrUser: {
      type: Boolean,
      default: false
    },
    screentags: {
      type: Boolean,
      default: false
    },
    tagShowDatas: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    selectTag () {
      if (this.changeId) {
        if (this.screentags) {
          this.$emit('input', this.selectTag)
        } else {
          const ids = this.selectTag.map(v => {
            return v.id
          })

          this.$emit('input', ids)
        }

        return false
      }

      this.$emit('input', this.selectTag)
    }
  },
  methods: {
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
    show () {
      if (this.screentags) {
        this.$refs.selectTag.show(this.selectTag, true)
      } else {
        this.$refs.selectTag.show(this.selectTag)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.select-tag-input {
  width: 100%;
}
/deep/.ant-select{
  width: 100%;
}
/deep/ .ant-select-selection__rendered ul {
  position: absolute;
  display: flex;
  overflow: hidden;
  width: 184px;
}
</style>
