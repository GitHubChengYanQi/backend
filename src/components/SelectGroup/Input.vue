<template>
  <div class="select-group-input">
    <div class="select-box" @click="$refs.selectGroup.show(selectGroup)">
      <div class="cur-room flex">
        <div class="left mr6">
          <img src="../../assets/avatar-room-default.svg">
        </div>
        <div class="right">
          <span v-if="selectGroup.length">
            {{ selectGroup[0].roomName }}
            {{ selectGroup.length > 1 ? `等${selectGroup.length - 1}个群聊` : '' }}
          </span>
          <span v-else>
            全部群聊
          </span>
        </div>
      </div>
      <div class="down-icon">
        <a-icon type="down"/>
      </div>
    </div>

    <SelectGroup ref="selectGroup" @change="selectGroupChange"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      groupShowData: [],
      selectGroup: []
    }
  },
  props: {
    changeId: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: _ => []
    }
  },
  watch: {
    value () {
      if (this.value.length === 0) {
        this.groupShowData = []
        this.selectGroup = []
      }
    }
  },
  methods: {
    change () {
      if (this.groupShowData.length === 0) {
        this.selectGroup = []

        this.emit()
      }
    },

    delChange (e) {
      this.selectGroup.deleteObj('name', e)

      this.emit()
    },

    selectGroupChange (e) {
      this.selectShowData = e

      const names = e.map(v => {
        return v.name
      })

      this.selectGroup = e
      this.groupShowData = names

      this.emit()
    },

    emit () {
      if (this.changeId) {
        const ids = this.selectGroup.map(v => {
          return v.workRoomId
        })

        this.$emit('input', ids)

        return false
      }

      this.$emit('input', this.selectGroup)
    }
  }
}
</script>

<style lang="less" scoped>
.select-box {
  min-width: 220px;
  max-width: 323px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  padding: 3px 0;
  height: 36px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  padding-left: 12px;
  display: flex;
  align-items: center;

  img {
    width: 23px;
    height: 23px;
  }

  .down-icon {
    font-size: 12px;
    color: #00000040;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }

  &:hover {
    border: 1px solid #40a9ff;
    box-shadow: 0 0 0 2px #1890ff33;
  }
}

.select-group-input {
  width: 100%;
}

/deep/ .ant-select-selection__rendered ul {
  position: absolute;
  display: flex;
  overflow: hidden;
  width: 184px;
}
</style>
