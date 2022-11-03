<template>
  <div class="member">
    <div
      class="item"
      :style="{'margin-left': `${marginLeft}px`}"
      v-for="v in list"
      :key="v.id"
    >
      <div class="box" v-if="v.type === 'depart'">
        <div class="user-info">
          <div class="icon">
            <a-icon type="folder" class="folder"/>
          </div>
          <div class="name">
            {{ v.name }}
          </div>
        </div>
        <div class="radio">
          <div v-show="checkbox">
            <Checkbox
              v-show="!updateViewFlag"
              :select="v.select"
              @click.native="selectClick(v)"
              ref="checkbox"
            />
          </div>
          <a-icon type="close" @click="delClick(v)" v-show="!checkbox"/>
        </div>
      </div>
      <div class="box" v-else>
        <div class="user-info">
          <div class="avatar">
            <img :src="v.avatar">
          </div>
          <div class="name">
            {{ v.name }}
          </div>
        </div>
        <div class="radio">
          <div v-show="checkbox">
            <Checkbox
              v-show="!updateViewFlag"
              :select="v.select"
              @click.native="selectClick(v)"
              ref="checkbox"
            />
          </div>
          <a-icon type="close" @click="delClick(v)" v-show="!checkbox"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/SelectEmployeeNew/components/Checkbox'

export default {
  data () {
    return {
      updateViewFlag: false
    }
  },
  props: {
    marginLeft: {
      type: String,
      default: '0'
    },
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    checkbox: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    list: {
      deep: true,
      handler () {
        this.updateView()
      }
    }
  },
  methods: {
    updateSelect (data, select = false) {
      const find = this.list.find(v => {
        return v.wxUserId === data.wxUserId
      })

      if (find) find.select = select

      this.$forceUpdate()
    },

    delClick (data) {
      this.emitEvent(false, data)
    },

    selectClick (data) {
      data.select = !data.select

      this.emitEvent(data.select, data)
      this.updateView()
    },

    emitEvent (select, data) {
      const params = {
        select,
        data
      }

      this.$emit('change', params)

      this.$parent.$emit('change', params)
    },

    updateView () {
      this.$forceUpdate()
    }
  },
  components: { Checkbox }
}
</script>

<style lang="less" scoped>
.member {
  margin: 13px 0;
  margin-top: 6px;

  &::-webkit-scrollbar {
    width: 5px;
    height: 1px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #d7d7d7;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }

  .item {
    height: 42px;

    .box {
      margin-bottom: 10px;
      display: flex;
      align-items: center;

      .radio {
        margin-right: 20px;
      }

      .user-info {
        display: flex;
        align-items: center;
        flex: 1;

        .icon {
          color: #47a7ff;
          font-size: 23px;
          margin-right: 12px;
          margin-left: 6px;
        }

        .avatar img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
          border-radius: 2px;
        }
      }
    }
  }
}

.radio {
  cursor: pointer;
}
</style>
